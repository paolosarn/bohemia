#!/usr/bin/env node
// TUNING [the felt numbers table] 10/10 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g). Writes nothing unless --write.
// Audits the REBUILT FIGHT (slices/BOHEMIA_FIGHT.html, rule 63): (1) every static R('key') it reads must resolve to a
// row in records/target/bb/{rules,ours,ai}.json with a value AND a source (R() itself throws otherwise);
// (2) each row's source is classed: a wiki page, a Paolo ruling (laws/ or VAMILY.md), a Grok page, or a record;
// (3) COMBAT's own stated rule is "no number is typed in the script but 0, 1 and 100": it counts the numeric
// literals in the fight-rules script that break it. Reports; the future gate is PLUMBER's.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), BB = path.join(ROOT, 'records/target/bb');
const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
const J = f => JSON.parse(fs.readFileSync(path.join(BB, f), 'utf8'));
const DB = { rules: J('rules.json'), ours: J('ours.json'), ai: J('ai.json') };
function lookup(p) {
  const parts = p.split('.');
  let node = parts[0] === 'ours' ? DB.ours : parts[0] === 'ai' ? DB.ai : DB.rules;
  const walk = (parts[0] === 'ours' || parts[0] === 'ai') ? parts.slice(1) : parts;
  for (const k of walk) node = node ? node[k] : undefined;
  return (node && 'value' in node && node.value !== null) ? node : null;
}
const keys = [...new Set([...html.matchAll(/\bR\(\s*'([A-Za-z0-9_.]+)'\s*\)/g)].map(m => m[1]))];
const dynamic = [...html.matchAll(/\bR\(\s*[^'\s)][^)]*\)/g)].length;
const kind = s => !s ? 'NO SOURCE' : /bb_all|Combat_Mechanics|CORE_WIKITEXT|wiki/i.test(s) ? 'wiki' : /GROK_/.test(s) ? 'grok' : /laws\/|VAMILY/.test(s) ? 'ruling' : /records\//.test(s) ? 'record' : 'other';
const rows = keys.map(k => { const n = lookup(k); return { key: k, ok: !!n, kind: n ? kind(n.source) : 'MISSING', quote: !!(n && n.quote), value: n ? n.value : null }; });
const by = {}; rows.forEach(r => by[r.kind] = (by[r.kind] || 0) + 1);
// literals in the fight-rules script
const sm = html.match(/<script id="fight-rules">([\s\S]*?)<\/script>/);
let lits = [];
if (sm) {
  const code = sm[1].replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1').replace(/'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`/g, "''");
  const allowed = new Set(['0', '1', '100']);
  code.split('\n').forEach((line, i) => { for (const m of line.matchAll(/(?<![\w.$])(\d+\.?\d*)(?![\w.])/g)) if (!allowed.has(m[1])) lits.push(m[1]); });
}
const freq = {}; lits.forEach(x => freq[x] = (freq[x] || 0) + 1);
console.log('FELT NUMBERS AUDIT: ' + keys.length + ' static R() keys (' + dynamic + ' dynamic reads); resolved ' + rows.filter(r => r.ok).length +
  ', missing ' + rows.filter(r => !r.ok).length + '; by source kind ' + JSON.stringify(by) + '; rows with no verbatim quote ' + rows.filter(r => r.ok && !r.quote).length +
  '; numeric literals in the fight-rules script outside {0,1,100}: ' + lits.length + ' (' + Object.keys(freq).length + ' distinct, commonest ' + JSON.stringify(Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8)) + ')');
if (process.argv.includes('--write')) fs.writeFileSync(path.join(ROOT, 'records/BOHEMIA_TUNING_FELT_NUMBERS_AUDIT_10_10_26.json'), JSON.stringify({ keys: rows, literals: freq, dynamicReads: dynamic }, null, 1) + '\n');
