#!/usr/bin/env node
/* BOHEMIA -- MODS [error messages] (research, 10/10/26): every message the reference merge can print when a mod is
   wrong, each with a short code, plain words, the fix, and a tiny broken mod that makes it appear.
   The tool BUILDS each broken mod, runs the real reference merge, and checks the message shows up. It also checks
   that every warn/bad line in the merge source has an entry here, so a new message cannot be added unexplained.
   Help only: nothing here refuses a mod. Usage: node tools/bohemia_mods_error_messages.js [--write] */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'tools', 'bohemia_mods_merge_reference.js');
const { merge, loadBase } = require(SRC);
const GOOD = '{ "id": "t", "name": "T", "version": "1.0.0", "schema": 1 }';
const W = o => ({ 'weapons.json': JSON.stringify(o) });
const base = loadBase();
/* find, in the live data, a row field that holds an object, and a non-table file key that holds an object */
let objRow = null, objKey = null;
for (const f of ['weapons.json', 'enemies.json', 'perks.json', 'armor.json']) {
  const t = base[f] && base[f].rows; if (!t) continue;
  const rows = Array.isArray(t) ? t.map(r => [r.id, r]) : Object.entries(t);
  for (const [id, r] of rows) for (const [k, v] of Object.entries(r)) if (!objRow && v && typeof v === 'object' && !Array.isArray(v)) objRow = { f, id, k, kk: Object.keys(v)[0], vv: v[Object.keys(v)[0]] };
}
for (const [f, d] of Object.entries(base)) for (const [k, v] of Object.entries(d)) if (!objKey && !k.startsWith('_') && v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length <= 8 && Object.values(v).some(x => typeof x === 'number')) objKey = { f, k, kk: Object.keys(v).find(x => typeof v[x] === 'number') };
const newSword = fs.readFileSync(path.join(ROOT, 'tools/mods_reference/example_mods/new-sword/weapons.json'), 'utf8');

/* code, site (a unique piece of the source line), the plain words, the fix, the broken mod */
const C = [
 ['M01', 'a list of words takes', 'This list holds plain words, and your change is not an add or a remove.', 'Write {"add": ["Word"], "remove": ["Other"]}, or give the whole list as [ ... ].', { 'enemies.json': '{"rows":{"brigand_poacher":{"perks":{"oops":1}}}}' }, /a list of words takes/],
 ['M02', 'a list element change must be an object', 'You named a list entry but gave it a value that is not a { } block.', 'Write the entry as {"Stab": {"ap": 3}}.', W({ rows: { knife: { skills: { Stab: 5 } } } }), /list element change must be an object/],
 ['M03', 'the list has only', 'You used a position number that is past the end of the list.', 'Count from 0. A list of 2 has positions 0 and 1.', W({ rows: { knife: { skills: { 7: { ap: 1 } } } } }), /the list has only/],
 ['M04', "f + ': wants '", 'A field inside a list entry has the wrong kind of value (a word where a number goes, or the reverse).', 'Look at the value in the base file and use the same kind. Numbers have no quote marks.', W({ rows: { knife: { skills: { Stab: { ap: 'three' } } } } }), /skills\.Stab\.ap: wants/],
 ['M05', 'a row change must be an object', 'You named a row but gave it something that is not a { } block.', 'Write the row as {"knife": {"damage_min": 20}}.', W({ rows: { knife: 5 } }), /a row change must be an object/],
 ['M06', 'no row in the base has this field', 'No row in this file has a field with that name, so it was ignored.', 'Check the spelling against the schema page. Copy a field name from a base row.', W({ rows: { knife: { colour: 'red' } } }), /no row in the base has this field/],
 ['M07', "got ' + typeOf(v) + '. The whole row change is skipped.", 'A field has the wrong kind of value, so none of this row change was applied.', 'Use the same kind of value the base row has. Numbers have no quote marks.', W({ rows: { knife: { damage_min: 'a lot' } } }), /knife\.damage_min: wants number/],
 ['M08', "'.' + kk + ': wants ' + typeOf(next", 'A value inside a small { } block on a row has the wrong kind, so none of this row change was applied.', 'Open the row in the base file, find the block, and match the kind of each value.', objRow && { [objRow.f]: JSON.stringify({ rows: { [objRow.id]: { [objRow.k]: { [objRow.kk]: typeof objRow.vv === 'number' ? 'x' : 5 } } } }) }, objRow && new RegExp(objRow.k + '\\.' + objRow.kk + ': wants')],
 ['M09', 'a NEW row needs', 'You added a new row but left out fields that almost every row has.', 'Copy a whole base row, change the id and the numbers. The message names the missing fields.', W({ rows: { laser: { damage_min: 5 } } }), /a NEW row needs/],
 ['M10', 'so it cannot collide', 'Your new id could collide with a base id or another mod (only shown if you ask for this check).', 'Start new ids with your mod id and a colon, like moon:blade. Optional.', { 'weapons.json': newSword }, /new id should start with/, { namespace: true }],
 ['M11', 'the base file has no such key', 'The file has no top-level key with that name, so it was ignored.', 'Check the spelling against the schema page.', W({ nonsense: 1 }), /the base file has no such key/],
 ['M12', "': wants ' + typeOf(b[kk])", 'A value in a small settings block has the wrong kind.', 'Match the kind in the base file. Numbers have no quote marks.', objKey && { [objKey.f]: JSON.stringify({ [objKey.k]: { [objKey.kk]: 'x' } }) }, objKey && new RegExp(objKey.k + '\\.' + objKey.kk + ': wants')],
 ['M13', "': wants ' + typeOf(b) + ', got '", 'A whole setting has the wrong kind of value.', 'Match the kind in the base file. Numbers have no quote marks.', { 'ours.json': '{"beat_bpm":"fast"}' }, /beat_bpm: wants/],
 ['M14', 'manifest.json is missing or not JSON', 'The mod folder has no manifest.json, or it cannot be read.', 'Add manifest.json with an id and a version. Check for a missing comma or quote.', { 'weapons.json': '{}' }, /manifest\.json is missing or not JSON/, null, true],
 ['M15', 'manifest needs id and version', 'The manifest has no id or no version, both as words in quotes.', 'Write {"id": "my-mod", "version": "1.0.0"}.', { 'weapons.json': '{}' }, /manifest needs id and version/, null, '{ "id": "x" }'],
 ['M16', 'written for data schema', 'The mod says it was written for a different version of the data. It loaded anyway.', 'Open the data changelog, see what changed since your version, then set "schema" to the current number.', W({ rows: {} }), /written for data schema/, null, '{ "id": "t", "version": "1.0.0", "schema": 0 }'],
 ['M17', 'not JSON (', 'One of your files is not valid JSON, so it was skipped.', 'Look for a missing comma, a missing quote or a stray bracket near the spot named.', { 'weapons.json': '{nope' }, /not JSON \(/],
 ['M18', 'loadAfter loop', 'Two or more mods each say they load after the other, so none of them loaded.', 'Remove one of the loadAfter lines.', 'LOOP', /loadAfter loop/],
 ['M19', 'no such data file', 'Your file is named for a data file that does not exist, so it was ignored.', 'Name each patch file exactly like the data file it changes, for example weapons.json.', { 'nothing.json': '{}' }, /no such data file/],
 ['M20', 'CONFLICT', 'Two mods change the same row. The one that loads later wins.', 'This is a heads-up, not a fault. Use loadAfter to pick which one wins.', 'CONFLICT', /CONFLICT/],
];

function build(entry, dir) {
  const [code, , , , files, , , man] = entry;
  const put = (id, manifest, fs2) => { const d = path.join(dir, id); fs.mkdirSync(d, { recursive: true }); if (manifest !== false) fs.writeFileSync(path.join(d, 'manifest.json'), manifest); for (const [f, t] of Object.entries(fs2 || {})) fs.writeFileSync(path.join(d, f), t); };
  if (files === 'LOOP') { put('a', '{"id":"a","version":"1","schema":1,"loadAfter":["b"]}'); put('b', '{"id":"b","version":"1","schema":1,"loadAfter":["a"]}'); return; }
  if (files === 'CONFLICT') { const k = '{"rows":{"knife":{"damage_min":21}}}'; put('a', '{"id":"a","version":"1","schema":1}', { 'weapons.json': k }); put('b', '{"id":"b","version":"1","schema":1,"loadAfter":["a"]}', { 'weapons.json': k.replace('21', '22') }); return; }
  put('t', entry[7] === true ? false : (typeof man === 'string' ? man : GOOD), files);
}

function run() {
  const src = fs.readFileSync(SRC, 'utf8'), out = [], problems = [];
  for (const e of C) {
    if (!e[4]) { problems.push(e[0] + ': no fixture could be built'); continue; }
    if (!src.includes(e[1])) problems.push(e[0] + ': its place in the merge source is gone (' + e[1] + ')');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'modmsg-'));
    build(e, dir);
    const r = merge(dir, e[6] || {});
    const hit = r.log.find(l => e[5].test(l[1]) && l[0] !== 'ok');
    if (!hit) problems.push(e[0] + ': the broken mod did not print the message. Log: ' + JSON.stringify(r.log));
    if (hit && hit[2] !== e[0]) problems.push(e[0] + ': the merge tagged it ' + hit[2] + ' instead');
    out.push({ code: e[0], kind: hit ? hit[0] : '?', said: hit ? hit[1] : '', plain: e[2], fix: e[3] });
    fs.rmSync(dir, { recursive: true, force: true });
  }
  /* every warn/bad line in the source must be covered by an entry */
  const lines = src.split('\n');
  lines.forEach((ln, i) => { if (/log\.push\(\['(bad|warn)'|\['warn', 'CONFLICT/.test(ln) && !C.some(e => ln.includes(e[1]))) problems.push('line ' + (i + 1) + ' of the merge prints a message with no entry here'); });
  return { out, problems };
}
module.exports = { run, C };
if (require.main === module) {
  const { out, problems } = run();
  out.forEach(o => console.log(o.code + ' ' + o.kind.toUpperCase().padEnd(4) + ' ' + o.said));
  console.log(out.length + ' messages explained, ' + problems.length + ' problems');
  problems.forEach(p => console.log('  PROBLEM ' + p));
  if (process.argv.includes('--write')) {
    const md = ['# MODS [error messages] -- WHAT THE LOADER SAYS WHEN A MOD IS WRONG, IN PLAIN WORDS (10/10/26)', '',
      'Research, nothing built in the game. Help only: no message here refuses a mod. Every row below was produced by a real broken mod run through the reference merge (tools/bohemia_mods_error_messages.js), so the text is not a guess. `bad` means that part of your mod was skipped. `warn` means it loaded and you may want to look. The tool also fails if the merge ever prints a message that has no row here.', '',
      '| code | kind | what the loader says | in plain words | how to fix it |', '|---|---|---|---|---|'];
    out.forEach(o => md.push('| ' + o.code + ' | ' + o.kind + ' | `' + o.said.replace(/\|/g, '/') + '` | ' + o.plain + ' | ' + o.fix + ' |'));
    md.push('', 'ROUTED: PLUMBER shows `code` and the plain words when the loader is built. The codes are stable so a doc page can link them.', '');
    fs.writeFileSync(path.join(ROOT, 'records', 'BOHEMIA_MODS_PLAIN_WORDS_WHEN_A_MOD_IS_WRONG_10_10_26.md'), md.join('\n'));
    console.log('wrote the record');
  }
  process.exit(problems.length ? 1 : 0);
}
