#!/usr/bin/env node
/* MODS [lists in rows] (10/10/26): which fields of the bb data files are LISTS inside a row, how long they run, and
   whether each element has a natural key (name or id) a patch could use to change ONE element. Read-only.
   Usage: node tools/bohemia_mods_lists_audit.js [--json] */
'use strict';
const fs = require('fs');
const path = require('path');
const BB = path.join(__dirname, '..', 'records', 'target', 'bb');
const isRow = x => x && typeof x === 'object' && !Array.isArray(x);
const out = [];
for (const file of fs.readdirSync(BB).filter(f => f.endsWith('.json')).sort()) {
  const j = JSON.parse(fs.readFileSync(path.join(BB, file), 'utf8'));
  for (const [t, v] of Object.entries(j)) {
    if (t.startsWith('_') || !Array.isArray(v) || !v.length || !v.every(isRow)) continue;
    const f = {};
    for (const r of v) for (const [k, x] of Object.entries(r)) if (Array.isArray(x) && x.length) {
      const e = f[k] || (f[k] = { rows: 0, elems: 0, max: 0, objects: 0, keyed: 0, strings: 0, key: {} });
      e.rows++; e.elems += x.length; e.max = Math.max(e.max, x.length);
      for (const el of x) { if (typeof el === 'string') e.strings++; else if (isRow(el)) { e.objects++; for (const kk of ['name', 'id', 'background']) if (kk in el) e.key[kk] = (e.key[kk] || 0) + 1; } }
    }
    for (const [k, e] of Object.entries(f)) out.push({ where: file.replace('.json', '') + '.' + t + '.' + k, rows: e.rows, of: v.length, avg: +(e.elems / e.rows).toFixed(1), max: e.max, kind: e.objects ? 'objects' : 'strings', objects: e.objects, withName: e.key.name || 0, withId: e.key.id || 0 });
  }
}
out.sort((a, b) => b.objects - a.objects || b.rows - a.rows);
if (process.argv.includes('--json')) { console.log(JSON.stringify(out, null, 1)); process.exit(0); }
console.log(out.length + ' list fields; ' + out.filter(o => o.kind === 'objects').length + ' hold objects, ' + out.filter(o => o.kind === 'strings').length + ' hold plain words.');
out.slice(0, 14).forEach(o => console.log('  ' + o.where.padEnd(40) + o.kind.padEnd(8) + o.rows + '/' + o.of + ' rows, avg ' + o.avg + ', max ' + o.max + (o.kind === 'objects' ? ', named ' + o.withName + '/' + o.objects : '')));
