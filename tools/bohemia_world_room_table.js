#!/usr/bin/env node
/* ============================================================================
   ONE TABLE FOR THE ROOMS  (WORLD, row [one table for the rooms], 10/18/26)

   Which room grammar a district's buildings are generated with (a police station
   is a hall, a reception, records and offices; a hospital is wards) lives in ONE
   place: DISTGEN in engine/bohemia_world.js, this lane's file. The CITY app keeps
   a second hand-typed copy (IN_ZONE) and it has drifted: six districts, every one
   collapsed into the generic `institutional`, so a police station is built with
   hospital wards in it (records/BOHEMIA_WORLD_A_POLICE_STATION_FULL_OF_HOSPITAL_
   WARDS_10_10_26.md).

   This tool PUBLISHES DISTGEN as a plain data file, engine/BOHEMIA_DISTRICT_ROOMS.json,
   the one readable source any page can inline instead of typing its own copy (the
   way the app already inlines engine/bohemia_floorplan.js byte-identical). It is
   written FROM the engine, never by hand, same bytes every run, so it cannot
   disagree with the engine; gates/one_room_table_gate.js regenerates it and
   refuses a difference, and refuses a new hand-kept copy anywhere in the repo.

   The file also carries every live district the table does NOT name, split the
   way the 10/10 record split it: the seven that are not buildings (correctly no
   rooms) and the nine that owe a grammar. The split is a reading, mine, tuned:false.

     node tools/bohemia_world_room_table.js          writes the file
     node tools/bohemia_world_room_table.js --check  exits 1 if the file is stale
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const P = p => path.join(__dirname, '..', p);
const OUT = 'engine/BOHEMIA_DISTRICT_ROOMS.json';

function build() {
  const W = require('../engine/bohemia_world.js');
  let BK = require('../engine/bohemia_boardkinds.js'); BK = BK.BOH_BOARDKINDS || BK;
  let IN = require('../engine/bohemia_insides.js'); IN = IN.BOH_INSIDES || IN;
  const FP = require('../engine/bohemia_floorplan.js');

  const zones = {};
  W.districtTypes().slice().sort().forEach(d => { zones[d] = W.districtZone(d); });
  const live = Object.keys(BK.districts()).sort();
  const none = IN.NO_GRAMMAR_YET.correctlyNone.districts.slice().sort();
  const owes = IN.NO_GRAMMAR_YET.owesOne.districts.slice().sort();
  return {
    what: 'THE ONE DISTRICT -> ROOM-GRAMMAR TABLE. Which room plan a district\'s buildings '
        + 'are generated with (engine/bohemia_floorplan.js). Read this; never type a copy.',
    source: 'DISTGEN in engine/bohemia_world.js (WORLD). Written by '
        + 'tools/bohemia_world_room_table.js, never by hand. Gate: gates/one_room_table_gate.js.',
    law: 'INTERIOR-MATCHES-EXTERIOR (Paolo 7/19, LOCKED); A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED',
    record: 'records/BOHEMIA_WORLD_ONE_TABLE_FOR_THE_ROOMS_10_18_26.md',
    grammars: Object.keys(FP.ZONES),
    zones: zones,
    noRooms: {
      correctlyNone: none,
      correctlyNoneWhy: IN.NO_GRAMMAR_YET.correctlyNone.why,
      owesOne: owes,
      owesOneWhy: IN.NO_GRAMMAR_YET.owesOne.why,
      blocked: IN.NO_GRAMMAR_YET.owesOne.blocked.slice().sort(),
      blockedWhy: IN.NO_GRAMMAR_YET.owesOne.blockedBecause,
      mine: true, tuned: false
    },
    counts: { liveDistricts: live.length, withRooms: Object.keys(zones).length,
              correctlyNone: none.length, owesOne: owes.length }
  };
}
function text() { return JSON.stringify(build(), null, 1) + '\n'; }

if (require.main === module) {
  const t = text();
  if (process.argv.includes('--check')) {
    const cur = fs.existsSync(P(OUT)) ? fs.readFileSync(P(OUT), 'utf8') : '';
    if (cur !== t) { console.log('STALE: ' + OUT + ' differs from DISTGEN; rerun the tool'); process.exit(1); }
    console.log('OK: ' + OUT + ' matches DISTGEN'); process.exit(0);
  }
  fs.writeFileSync(P(OUT), t);
  const j = JSON.parse(t);
  console.log('wrote ' + OUT + ' (' + t.length + ' bytes): ' + j.counts.withRooms + ' districts with rooms, '
    + j.counts.correctlyNone + ' correctly none, ' + j.counts.owesOne + ' owe one, of ' + j.counts.liveDistricts + ' live');
}
module.exports = { build: build, text: text, OUT: OUT };
