#!/usr/bin/env node
/* ============================================================================
   ONE ROOM TABLE  (WORLD, row [one table for the rooms], 10/18/26)

   The district -> room-grammar table (which room plan a district's buildings are
   generated with) is DISTGEN in engine/bohemia_world.js. The CITY app typed its
   own copy (IN_ZONE) and the copy drifted: a police station built with hospital
   wards. This gate makes the published table impossible to disagree with and
   makes a NEW copy impossible to add without a red.

   IT REFUSES FIVE THINGS:
   A. engine/BOHEMIA_DISTRICT_ROOMS.json not being exactly what DISTGEN says now
      (regenerated in memory by tools/bohemia_world_room_table.js, byte-compared).
   B. A live district being nowhere: every district the valley can place is in
      the table, or named as correctly without rooms, or named as owing a grammar,
      and in exactly one of the three.
   C. A grammar that is not a real one: every zone the table names is a zone of
      engine/bohemia_floorplan.js, and the generator run on it makes floor, walls
      and a door.
   D. A NEW HAND-KEPT COPY anywhere in the repo. Every JS, HTML and JSON file is
      scanned for a literal map of 20+ live districts to room grammars (90% of its
      values grammars, so the kit's TAXONOMY and the bridge's ARCHETYPE, which are
      other vocabularies, are not copies). Each copy found must be on KNOWN below;
      a copy not on it is RED by file and line.
   E. The known copies drifting further: each one's disagreements with the table
      are counted and held as a ratchet that may only shrink. The CITY app's is 6
      (10/10); when its owner inlines the file instead, the count is 0 and the
      copy leaves KNOWN.

   Every refusal ends at the failure count and a process.exit.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const P = p => path.join(ROOT, p);

const TOOL = require('../tools/bohemia_world_room_table.js');
let BK = require('../engine/bohemia_boardkinds.js'); BK = BK.BOH_BOARDKINDS || BK;
let IN = require('../engine/bohemia_insides.js'); IN = IN.BOH_INSIDES || IN;
const FP = require('../engine/bohemia_floorplan.js');

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? '  (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  (' + note + ')' : ''))); };
const section = (t, f) => { console.log('\n--- ' + t + ' ---'); f(); };

/* THE KNOWN HAND-KEPT COPIES, each with the most it may disagree. Only shrinks.
   A page that inlines engine/bohemia_world.js byte-identical carries DISTGEN in
   its `zone:'x'` row form, which is the engine itself (ENGINE SYNC LAW), not a copy. */
const KNOWN = {
  'slices/BOHEMIA_CITY_WORLD.html': { name: 'IN_ZONE, the CITY app', maxDrift: 6,
    owner: 'the CITY app (LIFE+CITY): inline engine/BOHEMIA_DISTRICT_ROOMS.json .zones in place of IN_ZONE' }
};

const OUT = TOOL.OUT;
const fresh = TOOL.text();
const table = JSON.parse(fresh);
const live = Object.keys(BK.districts()).sort();
const GRAMMARS = Object.keys(FP.ZONES);

console.log('=== ONE ROOM TABLE ===');
console.log('    [measured] ' + table.counts.withRooms + ' districts with rooms, '
  + table.counts.correctlyNone + ' correctly none, ' + table.counts.owesOne + ' owe one, of '
  + live.length + ' live; ' + GRAMMARS.length + ' grammars');

section('A the published file is exactly DISTGEN, now', () => {
  const cur = fs.existsSync(P(OUT)) ? fs.readFileSync(P(OUT), 'utf8') : null;
  ok('*** ' + OUT + ' EXISTS ***', cur !== null);
  ok('*** AND IS BYTE-FOR-BYTE WHAT THE TOOL WRITES FROM DISTGEN ***', cur === fresh,
     cur === fresh ? fresh.length + ' bytes' : 'stale: run node tools/bohemia_world_room_table.js');
  ok('it says where it comes from and that nobody types it',
     /DISTGEN/.test(table.source) && /never by hand/.test(table.source));
});

section('B every live district is in exactly one place', () => {
  const homes = d => [d in table.zones, table.noRooms.correctlyNone.includes(d),
                      table.noRooms.owesOne.includes(d)].filter(Boolean).length;
  const nowhere = live.filter(d => homes(d) === 0);
  const twice = live.filter(d => homes(d) > 1);
  const dead = Object.keys(table.zones).concat(table.noRooms.correctlyNone, table.noRooms.owesOne)
    .filter(d => !live.includes(d));
  ok('*** NO LIVE DISTRICT IS NOWHERE ***', nowhere.length === 0, nowhere.join(', ') || live.length + ' placed');
  ok('*** AND NONE IS IN TWO PLACES ***', twice.length === 0, twice.join(', '));
  ok('and the file names no district the valley cannot place', dead.length === 0, dead.join(', '));
  ok('the counts add up', table.counts.withRooms + table.counts.correctlyNone + table.counts.owesOne === live.length,
     table.counts.withRooms + '+' + table.counts.correctlyNone + '+' + table.counts.owesOne + ' = ' + live.length);
  ok('the none/owes split says it is a reading, not a measurement',
     table.noRooms.mine === true && table.noRooms.tuned === false);
  ok('the nine that owe a grammar are no more than the 9 of 10/10 (ratchet)', table.noRooms.owesOne.length <= 9,
     table.noRooms.owesOne.length + '');
});

section('C every grammar the table names is real', () => {
  const used = [...new Set(Object.values(table.zones))].sort();
  const unknown = used.filter(z => !GRAMMARS.includes(z));
  ok('*** EVERY ZONE IN THE TABLE IS A ZONE OF THE FLOORPLAN GENERATOR ***', unknown.length === 0,
     unknown.join(', ') || used.length + ' used: ' + used.join(' '));
  const thin = used.filter(z => {
    const r = IN.proveAnInside(z, 22, 14, 1337);
    return !r.known || r.floor < 50 || r.wall < 1 || r.door < 1 || !r.rooms.length;
  });
  ok('*** AND EACH ONE RUN FOR REAL MAKES FLOOR, WALLS AND A DOOR ***', thin.length === 0, thin.join(', '));
  const pol = IN.proveAnInside(table.zones.policestation, 44, 28, 1337);
  const wards = pol.rooms.filter(r => r === 'ward').length;
  console.log('    [measured] the police station from the table: ' + pol.rooms.length + ' rooms, '
    + wards + ' wards (' + table.zones.policestation + ')');
  ok('a police station built from the table has no hospital wards in it', wards === 0, wards + ' wards');
});

/* ---- the scan ---------------------------------------------------------- */
function walk(d, out) {
  for (const f of fs.readdirSync(d)) {
    if (f === '.git' || f === 'node_modules' || f === 'archive' || f === 'graveyard') continue;
    const p = path.join(d, f), s = fs.statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(js|html|json)$/.test(f) && s.size < 80e6) out.push(p);
  }
  return out;
}
const PAIR = /(?:[{,]|^)\s*['"]?([a-z_]+)['"]?\s*:\s*['"]([a-z_]+)['"]/gm;
function copiesIn(src) {
  if (src.indexOf("'institutional'") < 0 && src.indexOf('"institutional"') < 0) return [];
  const found = [];
  const lines = src.split('\n');
  let cur = null;
  const flush = () => {
    if (!cur) return;
    const keys = Object.keys(cur.map);
    const vals = keys.map(k => cur.map[k]);
    const gram = vals.filter(v => GRAMMARS.includes(v)).length;
    if (keys.length >= 20 && gram / keys.length >= 0.9) found.push({ line: cur.start, map: cur.map });
    cur = null;
  };
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    if (L.length > 20000 && L.indexOf('institutional') < 0) { flush(); continue; }
    let m, any = false; PAIR.lastIndex = 0;
    while ((m = PAIR.exec(L))) {
      if (!live.includes(m[1])) continue;
      if (!cur) cur = { start: i + 1, last: i, map: {} };
      cur.map[m[1]] = m[2]; cur.last = i; any = true;
    }
    if (!any && cur && i - cur.last > 3) flush();
  }
  flush();
  return found;
}

section('D no new hand-kept copy of the table anywhere in the repo', () => {
  const files = walk(ROOT, []);
  const hits = [];
  for (const f of files) {
    const rel = path.relative(ROOT, f).split(path.sep).join('/');
    if (rel === OUT) continue;
    const src = fs.readFileSync(f, 'utf8');
    copiesIn(src).forEach(c => hits.push(Object.assign({ file: rel }, c)));
  }
  console.log('    [measured] ' + files.length + ' files scanned, ' + hits.length + ' hand-kept copies found');
  hits.forEach(h => console.log('    [measured] ' + h.file + ':' + h.line + '  ' + Object.keys(h.map).length + ' districts'));
  const strays = hits.filter(h => !KNOWN[h.file]);
  ok('*** EVERY COPY FOUND IS A KNOWN ONE (a new copy is the bug this row exists to kill) ***',
     strays.length === 0, strays.map(h => h.file + ':' + h.line).join(', ') || 'none new');
  ok('the scan still finds the one copy it was written for (or it is gone, which is the goal)',
     hits.length <= Object.keys(KNOWN).length);

  section('E the known copies drift no further', () => {
    hits.filter(h => KNOWN[h.file]).forEach(h => {
      const k = KNOWN[h.file];
      const z = table.zones;
      const missing = Object.keys(z).filter(d => !(d in h.map));
      const extra = Object.keys(h.map).filter(d => !(d in z));
      const differ = Object.keys(z).filter(d => (d in h.map) && h.map[d] !== z[d]);
      const n = missing.length + extra.length + differ.length;
      console.log('    [measured] ' + k.name + ': missing ' + (missing.join(' ') || 'none') + '; extra '
        + (extra.join(' ') || 'none') + '; differ ' + (differ.map(d => d + ' ' + h.map[d] + '->' + z[d]).join(', ') || 'none'));
      console.log('    [finding]  for ' + k.owner);
      ok('*** ' + k.name + ' DISAGREES ON NO MORE THAN ' + k.maxDrift + ' (ratchet) ***', n <= k.maxDrift, n + ' now');
    });
  });
});

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
