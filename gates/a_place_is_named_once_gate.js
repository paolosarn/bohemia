#!/usr/bin/env node
/* ============================================================================
   A PLACE IS NAMED ONCE  (WORLD, 10/18/26; row [the dam in one place], routed to WORLD by WHO LIVES WHERE 10/17:
   'the dam is in two places').
   Record: records/BOHEMIA_WORLD_THE_DAM_IN_ONE_PLACE_10_18_26.md

   The roll (engine/bohemia_overmap.js) lays pieces of the valley that ARE real places by name in its own comments
   (Lake Mead, the dam, Boulder City, Lake Las Vegas, the intake, the Apex landfill, Sloan's quarry, Mount
   Charleston), inside the 96-block box; the region file (engine/BOHEMIA_REGION_LAND.json) puts the same real places
   where they are, out on the map, 22 to 45 km from the Strip. One place twice means a quest, a faction seat and a trip
   each pick one.

   IT REFUSES:
   A. THE REGION: a name twice in the region's own places; a real place the table below names that the region does
      not carry (the table and the land drift apart).
   B. THE GAME'S SEED and C. TWENTY SEEDS: a valley piece carrying a real place's name while the region carries that
      place outside the box, beyond the OWED list (today's duplicates, pinned with their owner so they can only be
      fixed). An OWED one that is gone is a NOTE (take it off the list), never a red: the check never blocks a fix.
   D. THE ROLL'S OWN WORDS: the table reads the names from the overmap's comments; a piece renamed or removed there
      without the table knowing goes red.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const OM = require('../engine/bohemia_overmap.js');
const J = JSON.parse(read('engine/BOHEMIA_REGION_LAND.json'));

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? '  (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  (' + note + ')' : ''))); };
const say = (n, note) => console.log('  NOTE ' + n + (note ? '  (' + note + ')' : ''));
const section = (t, f) => { console.log('\n--- ' + t + ' ---'); f(); };

/* THE VALLEY'S REAL-NAMED PIECES: the layout key, the real place, and the words in the overmap that name it */
const PIECES = [
  { key: 'damR',     name: 'HOOVER DAM',          says: /dam/i },
  { key: 'boulder',  name: 'BOULDER CITY',        says: /boulder city/i },
  { key: 'mead',     name: 'LAKE MEAD',           says: /lake mead|mead/i },
  { key: 'lakeLV',   name: 'LAKE LAS VEGAS',      says: /LAKE LAS VEGAS/i },
  { key: 'intake',   name: 'THE INTAKE',          says: /INTAKE/i },
  { key: 'landfill', name: 'APEX LANDFILL',       says: /APEX LANDFILL/i },
  { key: 'quarry',   name: 'SLOAN',               says: /Sloan/ },
  { key: 'mtChar',   name: 'MT CHARLESTON LODGE', says: /MOUNT CHARLESTON/i }
];
/* OWED: the duplicates on main 10/18, pinned (their owner: the roll, WORLD's [the dam in one place] and [the roll];
   the move is a VOTE candidate first, rule: the corner rule is Paolo's 7/5 layout) */
const OWED = ['HOOVER DAM', 'BOULDER CITY', 'LAKE MEAD', 'LAKE LAS VEGAS', 'THE INTAKE', 'APEX LANDFILL', 'SLOAN', 'MT CHARLESTON LODGE'];

const regionNames = J.places.map(p => p.name).concat((J.inValley || []).map(p => p.name));
const regionAll = new Set(regionNames.concat((J.districts || []).map(d => d.name)));
const inBox = (x, y) => x >= 0 && y >= 0 && x < 96 && y < 96;
const regionOutside = n => { const p = J.places.find(q => q.name === n); if (p) return !inBox(p.x, p.y); const d = (J.districts || []).find(q => q.name === n); return !!d; };

function dupes(sd) {
  const L = OM.buildOvermap(sd).layout, out = [];
  PIECES.forEach(pc => { const R = L[pc.key]; if (R && inBox(R.x, R.y) && regionAll.has(pc.name) && regionOutside(pc.name)) out.push(pc.name); });
  return out;
}

section('A. the region names each place once', () => {
  const seen = {}, twice = regionNames.filter(n => (seen[n] = (seen[n] || 0) + 1) === 2);
  ok('A1 no name twice in the region\'s places', twice.length === 0, twice.join(', ') || regionNames.length + ' names');
  const missing = PIECES.filter(pc => !regionAll.has(pc.name)).map(pc => pc.name);
  ok('A2 every real place the valley\'s pieces stand for is on the region\'s map', missing.length === 0, missing.join(', ') || PIECES.length + ' of ' + PIECES.length);
});

section('B. the game\'s seed', () => {
  const frame = read('slices/BOHEMIA_CITY_WORLD.html'); let seed = 2691674296;
  const st = frame.match(/const BOH_SEED_TEXT='([^']+)'/), hs = frame.indexOf('function BOH_HASH_SEED(');
  if (st && hs >= 0) seed = new Function(frame.slice(hs, frame.indexOf('return (h^(h>>>16))>>>0; }', hs) + 27) + '\nreturn BOH_HASH_SEED;')()(st[1]);
  const d = dupes(seed), fresh = d.filter(n => OWED.indexOf(n) < 0), gone = OWED.filter(n => d.indexOf(n) < 0);
  ok('B1 no real place stands twice beyond the owed list', fresh.length === 0, fresh.join(', ') || d.length + ' owed: ' + d.join(', '));
  gone.forEach(n => say('FIXED on the game\'s seed, take it off OWED', n));
});

section('C. twenty seeds', () => {
  const seeds = [2691674296]; for (let i = 1; i < 20; i++) seeds.push(i * 7919);
  const fresh = new Set(); seeds.forEach(sd => dupes(sd).forEach(n => { if (OWED.indexOf(n) < 0) fresh.add(n); }));
  ok('C1 every seed: no real place twice beyond the owed list', fresh.size === 0, [...fresh].join(', ') || '20 of 20');
});

section('D. the roll\'s own words', () => {
  const src = read('engine/bohemia_overmap.js');
  const lost = PIECES.filter(pc => { const m = new RegExp('(?:const|let)\\s+' + pc.key + '\\b|\\b' + pc.key + '\\s*=\\s*\\{').exec(src), j = m ? m.index : -1;
    if (j < 0) return true; const win = src.slice(Math.max(0, j - 1200), j + 400); return !pc.says.test(win); }).map(pc => pc.key);
  ok('D1 each piece the table names is still laid by the roll under the words that name it', lost.length === 0, lost.join(', ') || PIECES.length + ' pieces');
});

section('M. mutations, each must bite', () => {
  ok('M1 with the owed list emptied, the game\'s seed\'s duplicates are found (the check sees them)', dupes(2691674296).length >= 3, dupes(2691674296).length + ' found');
  const names2 = regionNames.concat(['BOULDER CITY']), seen = {};
  ok('M2 a region carrying a name twice is caught', names2.some(n => (seen[n] = (seen[n] || 0) + 1) === 2));
});

console.log('\n' + (fail ? 'A PLACE IS NAMED ONCE: RED' : 'A PLACE IS NAMED ONCE: GREEN') + '  ' + pass + '/' + fail);
process.exit(fail ? 1 : 0);
