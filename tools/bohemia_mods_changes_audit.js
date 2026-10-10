#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- MODS: HOW THE DATA CHANGED (MODS lane, 10/10/26)
   Row [base changes]. A mod written last week breaks when a data file gains a
   field, loses a row or renames an id. This reads git history for records/target/bb
   and, per commit and per file, classifies every change by what it does TO A MOD:
     BREAKS    a row id removed (a mod that patched it now has nothing to patch),
               a table or top-level key removed, a field removed from every row
     ADDS      new file, new rows, new fields, new top-level keys (a mod keeps working)
     VALUES    only values changed (a mod's patch still applies; its numbers may now be stale)
   and writes the one-minute changelog a modder reads.
   Usage: node tools/bohemia_mods_changes_audit.js [--json] [--changelog]
   Note: this clone is shallow; history before the oldest commit here is not seen.
   ============================================================================ */
'use strict';
const { execSync } = require('child_process');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const sh = c => execSync(c, { cwd: ROOT, maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
const isRow = x => x && typeof x === 'object' && !Array.isArray(x);
const parse = t => { try { return JSON.parse(t); } catch (e) { return null; } };
const show = (rev, f) => { try { return parse(sh('git show ' + rev + ':' + f)); } catch (e) { return undefined; } };

function tablesOf(j) {
  const t = {};
  for (const [k, v] of Object.entries(j || {})) {
    if (k.startsWith('_')) continue;
    if (Array.isArray(v) && v.length && v.every(r => isRow(r) && 'id' in r)) t[k] = new Map(v.map(r => [r.id, r]));
    else if (isRow(v) && Object.keys(v).length > 8 && Object.values(v).every(isRow)) t[k] = new Map(Object.entries(v));
  }
  return t;
}
function diff(before, after) {
  const d = { breaks: [], adds: [], values: 0 };
  const bt = tablesOf(before), at = tablesOf(after);
  for (const k of Object.keys(bt)) if (!(k in at)) d.breaks.push('table ' + k + ' removed');
  for (const k of Object.keys(at)) if (!(k in bt)) d.adds.push('table ' + k + ' added (' + at[k].size + ' rows)');
  for (const k of Object.keys(at)) if (k in bt) {
    const b = bt[k], a = at[k];
    const gone = [...b.keys()].filter(i => !a.has(i)), born = [...a.keys()].filter(i => !b.has(i));
    if (gone.length) d.breaks.push(k + ': ' + gone.length + ' id(s) removed (' + gone.slice(0, 3).join(', ') + (gone.length > 3 ? '...' : '') + ')');
    if (born.length) d.adds.push(k + ': ' + born.length + ' new row(s)');
    const bf = new Set(), af = new Set();
    for (const r of b.values()) Object.keys(r).forEach(x => bf.add(x));
    for (const r of a.values()) Object.keys(r).forEach(x => af.add(x));
    const lost = [...bf].filter(x => !af.has(x)), gained = [...af].filter(x => !bf.has(x));
    if (lost.length) d.breaks.push(k + ': field(s) gone: ' + lost.join(', '));
    if (gained.length) d.adds.push(k + ': new field(s): ' + gained.join(', '));
    for (const [i, r] of a) if (b.has(i) && JSON.stringify(b.get(i)) !== JSON.stringify(r)) d.values++;
  }
  const bk = Object.keys(before || {}).filter(x => !x.startsWith('_')), ak = Object.keys(after || {}).filter(x => !x.startsWith('_'));
  for (const x of bk) if (!ak.includes(x)) d.breaks.push('key ' + x + ' removed');
  for (const x of ak) if (!bk.includes(x)) d.adds.push('key ' + x + ' added');
  if (!d.breaks.length && !d.adds.length && JSON.stringify(before) !== JSON.stringify(after)) d.values = Math.max(d.values, 1);
  return d;
}
const log = sh('git log --format=%H%x09%h%x09%ad%x09%s --date=short -- records/target/bb').trim().split('\n').filter(Boolean).map(l => { const [H, h, date, ...s] = l.split('\t'); return { H, h, date, subject: s.join(' ').slice(0, 90) }; });
const out = [];
for (const c of log) {
  const files = sh('git diff-tree --no-commit-id --name-status -r ' + c.H + ' -- records/target/bb').trim().split('\n').filter(Boolean);
  for (const line of files) {
    const [st, f] = line.split('\t');
    if (!f || !f.endsWith('.json')) continue;
    const after = st === 'D' ? null : show(c.H, f);
    const before = st === 'A' ? null : show(c.H + '^', f);
    if (st === 'A') { out.push({ commit: c.h, date: c.date, file: path.basename(f), kind: 'NEW FILE', breaks: [], adds: ['new file'], values: 0, subject: c.subject }); continue; }
    if (st === 'D') { out.push({ commit: c.h, date: c.date, file: path.basename(f), kind: 'BREAKS', breaks: ['file removed'], adds: [], values: 0, subject: c.subject }); continue; }
    if (before === undefined || after === undefined || !before || !after) continue;   /* the shallow boundary, or not JSON */
    const d = diff(before, after);
    const kind = d.breaks.length ? 'BREAKS' : d.adds.length ? 'ADDS' : d.values ? 'VALUES' : 'SAME';
    if (kind === 'SAME') continue;
    out.push({ commit: c.h, date: c.date, file: path.basename(f), kind, breaks: d.breaks, adds: d.adds, values: d.values, subject: c.subject });
  }
}
const tally = { 'NEW FILE': 0, BREAKS: 0, ADDS: 0, VALUES: 0 };
out.forEach(o => tally[o.kind]++);
const res = { commitsSeen: log.length, changes: out.length, tally, oldest: log.length ? log[log.length - 1].date : null, newest: log.length ? log[0].date : null, breaking: out.filter(o => o.kind === 'BREAKS'), out };
if (process.argv.includes('--json')) { console.log(JSON.stringify(res, null, 1)); process.exit(0); }
if (process.argv.includes('--changelog')) {
  const L = ['# THE DATA CHANGELOG (generated by tools/bohemia_mods_changes_audit.js)', '', 'Each line is one file in one commit. BREAKS means a mod written before it may stop working. Read the BREAKS first.', ''];
  const by = {}; out.forEach(o => (by[o.date] = by[o.date] || []).push(o));
  for (const d of Object.keys(by).sort().reverse()) {
    L.push('## ' + d);
    for (const o of by[d].sort((a, b) => ['BREAKS', 'ADDS', 'NEW FILE', 'VALUES'].indexOf(a.kind) - ['BREAKS', 'ADDS', 'NEW FILE', 'VALUES'].indexOf(b.kind)))
      L.push('- **' + o.kind + '** ' + o.file + ' (' + o.commit + '): ' + [].concat(o.breaks, o.adds).slice(0, 4).join('; ') + (o.kind === 'VALUES' ? o.values + ' row(s) changed values' : ''));
    L.push('');
  }
  console.log(L.join('\n')); process.exit(0);
}
console.log(res.commitsSeen + ' commits touched records/target/bb between ' + res.oldest + ' and ' + res.newest + ' (shallow clone). ' + res.changes + ' file changes: ' + JSON.stringify(tally));
res.breaking.slice(0, 12).forEach(b => console.log('  BREAKS ' + b.file + ' ' + b.commit + ' ' + b.breaks.join('; ')));
