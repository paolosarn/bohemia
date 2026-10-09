#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- MODS: A ROW ID IS A PROMISE (MODS lane, 10/10/26)
   Row [ids never change], rule 22. A mod names a row by its id, so renaming an id
   breaks every mod that touches it. This measures what already leans on an id:
     1. every table's ids, and any id used in TWO tables (a rename must move both);
     2. every place one data file REFERS to another table's id (a rename breaks it);
     3. every id also written as a quoted literal in code (slices/, engine/, gates/);
     4. whether any id contains ':' (free to use as a namespace separator).
   Usage: node tools/bohemia_mods_ids_audit.js [--json]
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const BB = path.join(ROOT, 'records', 'target', 'bb');
const isRow = x => x && typeof x === 'object' && !Array.isArray(x);

const tables = {};   /* 'weapons.json:rows' -> Set of ids */
const data = {};
for (const f of fs.readdirSync(BB).filter(f => f.endsWith('.json')).sort()) {
  const j = JSON.parse(fs.readFileSync(path.join(BB, f), 'utf8')); data[f] = j;
  for (const [k, v] of Object.entries(j)) {
    if (k.startsWith('_')) continue;
    if (Array.isArray(v) && v.length && v.every(r => isRow(r) && typeof r.id === 'string')) tables[f + ':' + k] = new Set(v.map(r => r.id));
  }
}
const names = Object.keys(tables);
const total = names.reduce((a, n) => a + tables[n].size, 0);

/* 1 ids used in two tables */
const where = {};
for (const n of names) for (const id of tables[n]) (where[id] = where[id] || []).push(n);
const shared = Object.entries(where).filter(([, w]) => w.length > 1).map(([id, w]) => ({ id, tables: w }));

/* 2 cross-file references: a string anywhere in file A (not a row's own id) equal to an id of a table in ANOTHER file */
const refs = {};
function scan(file, node, trail, ownId) {
  if (typeof node === 'string') {
    for (const n of names) if (n.split(':')[0] !== file && tables[n].has(node)) {
      const key = file + ' ' + trail.replace(/\[\d+\]/g, '[]') + '  ->  ' + n;
      refs[key] = (refs[key] || 0) + 1;
    }
  } else if (Array.isArray(node)) node.forEach((x, i) => scan(file, x, trail + '[' + i + ']', ownId));
  else if (isRow(node)) for (const [k, v] of Object.entries(node)) { if (k === 'source' || k === 'quote' || k === 'page' || k === 'wiki_page') continue; scan(file, v, trail + '.' + k, ownId); }
}
for (const [f, j] of Object.entries(data)) for (const [k, v] of Object.entries(j)) if (!k.startsWith('_')) scan(f, v, k, null);
const refList = Object.entries(refs).map(([k, c]) => ({ where: k, hits: c })).sort((a, b) => b.hits - a.hits);

/* 3 ids written as a quoted literal in code */
const code = execSync('git ls-files slices engine gates', { cwd: ROOT, maxBuffer: 1 << 28 }).toString().split('\n').filter(f => /\.(js|html|py)$/.test(f) && !/_B64/.test(f));
const lit = new Set();
for (const f of code) {
  let t; try { t = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { continue; }
  t = t.replace(/(\w+_B64)\s*=\s*["'][A-Za-z0-9+/=]{2000,}["']/g, '');
  const re = /['"`]([a-z][a-z0-9_]{2,40})['"`]/g; let m; while ((m = re.exec(t))) lit.add(m[1]);
}
const inCode = {};
for (const n of names) inCode[n] = [...tables[n]].filter(id => lit.has(id)).length;
const colon = [...Object.keys(where)].filter(id => id.includes(':'));
const out = { tables: names.map(n => ({ table: n, ids: tables[n].size, namedInCode: inCode[n] })), totalIds: total, sharedAcrossTables: shared, crossFileReferences: refList, idsWithColon: colon.length };
if (process.argv.includes('--json')) { console.log(JSON.stringify(out, null, 1)); process.exit(0); }
console.log(names.length + ' tables, ' + total + ' ids; ' + shared.length + ' ids sit in two tables; ' + refList.length + ' cross-file reference paths; ' + colon.length + ' ids contain a colon.');
out.tables.forEach(t => console.log('  ' + t.table.padEnd(34) + t.ids + ' ids, ' + t.namedInCode + ' also quoted in code'));
console.log('shared: ' + shared.slice(0, 12).map(s => s.id).join(', '));
refList.slice(0, 14).forEach(r => console.log('  ' + r.hits + 'x  ' + r.where));
