#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- MODS: THE REFERENCE MERGE (MODS lane, 10/10/26)
   Row [the mods folder design], rule 22. A DESIGN PROOF, NOT IN THE GAME: it
   shows the override order and the failure rules working on the REAL data
   files, so the design page is a thing that ran, not a thing that was said.
   Nothing here is loaded by the demo, the alpha or the fight (his 9/30 NAH on
   mods at boot stands). It reads records/target/bb/ and a folder of mods.

   A MOD is a folder: manifest.json plus any number of PATCH FILES named like
   the data file they patch (weapons.json patches weapons.json).
   A PATCH has the same top-level keys as the base file:
     - a table (a list of rows with ids, or a map of rows by id) is patched BY ID:
       {"rows": {"knife": {"damage_min": 20}}}  merges fields into row knife;
       an id the base lacks ADDS a row, which must carry every field that most
       base rows carry;
     - an object is merged one level; a number or string is replaced.
   ORDER: base, then each mod in the order the index lists, loadAfter respected.
   FAILURES NEVER CRASH AND NEVER HALF-APPLY A ROW: a bad value, an unknown
   field, a short new row, a loop, or a file that is not JSON is skipped by name.
   Usage: node tools/bohemia_mods_merge_reference.js <modsDir> [--json]
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const BB = path.join(__dirname, '..', 'records', 'target', 'bb');
const GAME_SCHEMA = 1;

const isRow = x => x && typeof x === 'object' && !Array.isArray(x);
const typeOf = v => v === null ? 'null' : Array.isArray(v) ? 'list' : typeof v;
const clone = o => JSON.parse(JSON.stringify(o));
const hash = o => crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0, 12);

function loadBase() {
  const base = {};
  for (const f of fs.readdirSync(BB).filter(f => f.endsWith('.json'))) base[f] = JSON.parse(fs.readFileSync(path.join(BB, f), 'utf8'));
  return base;
}
/* the fields most rows of a table carry: a new row must have them (and an id) */
function required(rows) {
  const n = rows.length, c = {};
  for (const r of rows) for (const [k, v] of Object.entries(r)) if (v !== null) c[k] = (c[k] || 0) + 1;
  return Object.keys(c).filter(k => c[k] >= 0.9 * n);
}
function fieldTypes(rows) {
  const t = {};
  for (const r of rows) for (const [k, v] of Object.entries(r)) { if (v === null) continue; (t[k] = t[k] || new Set()).add(typeOf(v)); }
  return t;
}
let NAMESPACE = false, CURRENT_MOD = null;   /* optional: a NEW row's id should start with '<modid>:' so it can never collide with a base id or another mod */
/* A LIST inside a row (a weapon's skills, an enemy's perks, an origin's men) can be patched three ways:
   - the whole list as an array: it replaces the list (as before);
   - a list of OBJECTS as an object: each key is the element's name or id (or its position, "0"); the fields named
     change, and a name the list lacks is added as a new element;
   - a list of plain WORDS as {"add": [...], "remove": [...]}. */
function patchList(list, v, log, where) {
  if (list.every(x => typeof x === 'string')) {
    if (!('add' in v) && !('remove' in v)) { log.push(['bad', where + ': a list of words takes {"add": [...], "remove": [...]} or a whole array. Skipped.']); return null; }
    const rm = new Set(Array.isArray(v.remove) ? v.remove : []);
    const out = list.filter(x => !rm.has(x));
    for (const a of (Array.isArray(v.add) ? v.add : [])) if (!out.includes(a)) out.push(a);
    return out;
  }
  const out = clone(list);
  for (const [key, change] of Object.entries(v)) {
    if (!isRow(change)) { log.push(['bad', where + '.' + key + ': a list element change must be an object. Skipped.']); return null; }
    let i = out.findIndex(e => isRow(e) && (e.name === key || e.id === key));
    if (i < 0 && /^\d+$/.test(key)) i = +key < out.length ? +key : -1;
    if (i < 0) {
      if (/^\d+$/.test(key)) { log.push(['bad', where + '.' + key + ': the list has only ' + out.length + ' elements. Skipped.']); return null; }
      out.push(Object.assign({ name: key }, clone(change)));
      continue;
    }
    for (const [f, x] of Object.entries(change)) {
      const was = out[i][f];
      if (was !== undefined && was !== null && x !== null && typeOf(x) !== typeOf(was)) { log.push(['bad', where + '.' + key + '.' + f + ': wants ' + typeOf(was) + ', got ' + typeOf(x) + '. Skipped.']); return null; }
      out[i][f] = x;
    }
  }
  return out;
}
function patchTable(baseTbl, patch, log, where) {
  const byMap = !Array.isArray(baseTbl);
  const rows = byMap ? Object.values(baseTbl) : baseTbl;
  const need = required(rows), types = fieldTypes(rows);
  const find = id => byMap ? baseTbl[id] : baseTbl.find(r => r.id === id);
  for (const [id, change] of Object.entries(patch)) {
    if (!isRow(change)) { log.push(['bad', where + '.' + id + ': a row change must be an object. Skipped.']); continue; }
    const cur = find(id), next = clone(cur || {});
    let ok = true;
    for (const [k, v] of Object.entries(change)) {
      if (isRow(v) && Array.isArray(next[k])) { const nl = patchList(next[k], v, log, where + '.' + id + '.' + k); if (!nl) { ok = false; break; } next[k] = nl; continue; }
      if (!types[k]) { log.push(['warn', where + '.' + id + '.' + k + ': no row in the base has this field. Ignored.']); continue; }
      if (v !== null && !types[k].has(typeOf(v))) { log.push(['bad', where + '.' + id + '.' + k + ': wants ' + [...types[k]].join(' or ') + ', got ' + typeOf(v) + '. The whole row change is skipped.']); ok = false; break; }
      if (isRow(v) && isRow(next[k])) {   /* an object inside a row is merged one level, so changing one number of a perk does not erase the others */
        let objOk = true;
        for (const [kk, vv] of Object.entries(v)) if (kk in next[k] && next[k][kk] !== null && vv !== null && typeOf(vv) !== typeOf(next[k][kk])) { log.push(['bad', where + '.' + id + '.' + k + '.' + kk + ': wants ' + typeOf(next[k][kk]) + ', got ' + typeOf(vv) + '. The whole row change is skipped.']); objOk = false; break; }
        if (!objOk) { ok = false; break; }
        next[k] = Object.assign({}, next[k], v);
        continue;
      }
      next[k] = v;
    }
    if (!ok) continue;
    if (!cur) {
      if (!byMap) next.id = id;
      const miss = need.filter(k => !(k in next));
      if (miss.length) { log.push(['bad', where + '.' + id + ': a NEW row needs ' + miss.join(', ') + '. Row skipped.']); continue; }
      if (byMap) baseTbl[id] = next; else baseTbl.push(next);
      if (NAMESPACE && CURRENT_MOD && !id.startsWith(CURRENT_MOD + ':')) log.push(['warn', where + '.' + id + ': a new id should start with "' + CURRENT_MOD + ':" so it cannot collide with the base or another mod. Added anyway.']);
      log.push(['ok', where + '.' + id + ': new row added.']);
    } else {
      if (byMap) baseTbl[id] = next; else baseTbl[baseTbl.indexOf(cur)] = next;
      log.push(['ok', where + '.' + id + ': changed ' + Object.keys(change).filter(k => types[k] && JSON.stringify(next[k]) !== JSON.stringify(cur[k])).join(', ') + '.']);
    }
  }
}
function patchFile(base, patch, log, name) {
  for (const [k, v] of Object.entries(patch)) {
    if (k.startsWith('_')) continue;
    if (!(k in base)) { log.push(['warn', name + '.' + k + ': the base file has no such key. Ignored.']); continue; }
    const b = base[k];
    const isTable = (Array.isArray(b) && b.length && b.every(r => isRow(r) && 'id' in r)) || (isRow(b) && Object.keys(b).length > 8 && Object.values(b).every(isRow));
    if (isTable && isRow(v)) patchTable(b, v, log, name + '.' + k);
    else if (isRow(b) && isRow(v)) { for (const [kk, vv] of Object.entries(v)) { if (typeOf(vv) !== typeOf(b[kk]) && b[kk] !== undefined) log.push(['bad', name + '.' + k + '.' + kk + ': wants ' + typeOf(b[kk]) + ', got ' + typeOf(vv) + '. Skipped.']); else { b[kk] = vv; log.push(['ok', name + '.' + k + '.' + kk + ' set.']); } } }
    else if (typeOf(v) === typeOf(b)) { base[k] = v; log.push(['ok', name + '.' + k + ' set.']); }
    else log.push(['bad', name + '.' + k + ': wants ' + typeOf(b) + ', got ' + typeOf(v) + '. Skipped.']);
  }
}
function readMods(dir) {
  const mods = [], log = [];
  if (!fs.existsSync(dir)) return { mods, log };
  for (const id of fs.readdirSync(dir).sort()) {
    const mdir = path.join(dir, id);
    if (!fs.statSync(mdir).isDirectory()) continue;
    let man;
    try { man = JSON.parse(fs.readFileSync(path.join(mdir, 'manifest.json'), 'utf8')); } catch (e) { log.push(['bad', id + ': manifest.json is missing or not JSON. Mod skipped.']); continue; }
    if (!man || typeof man.id !== 'string' || typeof man.version !== 'string') { log.push(['bad', id + ': manifest needs id and version. Mod skipped.']); continue; }
    if (man.schema !== GAME_SCHEMA) log.push(['warn', man.id + ': written for data schema ' + man.schema + ', the game reads ' + GAME_SCHEMA + '. Loaded anyway.']);
    const patches = {};
    for (const f of fs.readdirSync(mdir).filter(f => f.endsWith('.json') && f !== 'manifest.json')) {
      try { patches[f] = JSON.parse(fs.readFileSync(path.join(mdir, f), 'utf8')); } catch (e) { log.push(['bad', man.id + '/' + f + ': not JSON (' + e.message.slice(0, 40) + '). File skipped.']); }
    }
    mods.push({ man, patches });
  }
  return { mods, log };
}
function order(mods, log) {
  const by = {}, out = [], st = {};
  mods.forEach(m => by[m.man.id] = m);
  const visit = (m, stack) => {
    const id = m.man.id;
    if (st[id] === 'done' || st[id] === 'skip') return;
    if (st[id] === 'doing') { const ring = stack.slice(stack.indexOf(id)); ring.forEach(x => st[x] = 'skip'); log.push(['bad', ring.join(', ') + ': loadAfter loop. All skipped.']); return; }
    st[id] = 'doing';
    (m.man.loadAfter || []).forEach(d => by[d] && visit(by[d], stack.concat(id)));
    if (st[id] === 'doing') { out.push(m); st[id] = 'done'; }
  };
  mods.forEach(m => visit(m, []));
  return out;
}
function merge(modsDir, opts) {
  NAMESPACE = !!(opts && opts.namespace);
  const base = loadBase(), baseHash = hash(base), log = [];
  const r = readMods(modsDir); log.push(...r.log);
  const owner = {};
  for (const m of order(r.mods, log)) {
    CURRENT_MOD = m.man.id;
    for (const [file, patch] of Object.entries(m.patches)) {
      if (!base[file]) { log.push(['warn', m.man.id + '/' + file + ': no such data file. Ignored.']); continue; }
      const before = log.length;
      patchFile(base[file], patch, log, file.replace('.json', ''));
      for (let i = before; i < log.length; i++) if (log[i][0] === 'ok') { const key = log[i][1].split(':')[0].split(' ')[0]; if (owner[key] && owner[key] !== m.man.id) log.splice(i + 1, 0, ['warn', 'CONFLICT ' + key + ': ' + m.man.id + ' overrides ' + owner[key] + ' (loads later, wins).']); owner[key] = m.man.id; }
    }
    log.push(['ok', 'mod ' + m.man.id + ' v' + m.man.version + ' done.']);
  }
  return { data: base, baseHash, hash: hash(base), changed: hash(base) !== baseHash, log, mods: r.mods.length };
}
module.exports = { merge, loadBase, hash };
if (require.main === module) {
  const dir = process.argv[2];
  if (!dir) { console.error('usage: node tools/bohemia_mods_merge_reference.js <modsDir>'); process.exit(2); }
  const r = merge(path.resolve(dir), { namespace: process.argv.includes('--namespace') });
  if (process.argv.includes('--json')) { console.log(JSON.stringify({ hash: r.hash, baseHash: r.baseHash, changed: r.changed, log: r.log }, null, 1)); process.exit(0); }
  console.log('base ' + r.baseHash + '  merged ' + r.hash + '  ' + (r.changed ? 'CHANGED' : 'IDENTICAL') + '  (' + r.mods + ' mods)');
  r.log.forEach(l => console.log('  ' + l[0].toUpperCase().padEnd(4) + ' ' + l[1]));
}
