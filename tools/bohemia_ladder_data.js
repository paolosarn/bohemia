#!/usr/bin/env node
/* BOHEMIA LADDER DATA (QUESTS lane, 9/6/26) -- VAMILY [spine first].
 *
 * The walk has to run in the browser, and the browser cannot read a .md file in
 * records/. So this emits engine/bohemia_ladder_data.js from HIS TWO FILES and
 * nothing else, exactly the way tools/bohemia_combat_the_mini_bosses_patch.py
 * already feeds the fight. Same pattern, same reason, and that one has held at
 * zero drifted rows since 8/27.
 *
 * THE POINT IS THAT NOBODY TYPES A BOSS. Re-run this after he edits the ladder
 * or the graph; ladder_walk_gate.js re-reads both sources and compares field by
 * field, so a hand edit here is caught rather than shipped.
 *
 * REUSE CHECK: cooks no pixels, opens no bank. It copies two files he wrote.
 *   node tools/bohemia_ladder_data.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LADDER = path.join(ROOT, 'records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md');
const GRAPH  = path.join(ROOT, 'records/BOHEMIA_LADDER_GRAPH_8_13_26.json');
const OUT    = path.join(ROOT, 'engine/bohemia_ladder_data.js');

function parseLadder(text) {
  const rows = []; let act = 0;
  text.split('\n').forEach(l => {
    const h = l.match(/^##\s*ACT\s*([123])\b/); if (h) { act = +h[1]; return; }
    const m = l.match(/^\|\s*(\d+)\s*\|\s*\*\*([^*]+)\*\*\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/);
    if (!m) return;
    rows.push({ i: +m[1], n: m[2].trim(), holds: m[3].trim(), lock: m[4].trim(),
                grant: m[5].trim(), kind: m[6].trim(), act });
  });
  return rows;
}

const bosses = parseLadder(fs.readFileSync(LADDER, 'utf8'));
const edges  = JSON.parse(fs.readFileSync(GRAPH, 'utf8')).edges;
if (!bosses.length) { console.error('REFUSING: parsed 0 bosses out of his ladder.'); process.exit(2); }
if (!edges.length)  { console.error('REFUSING: parsed 0 edges out of his graph.');  process.exit(2); }

const body =
`// BOHEMIA LADDER DATA -- GENERATED, DO NOT HAND-EDIT (9/6/26, QUESTS lane)
//
// Emitted by tools/bohemia_ladder_data.js from the only two rulers:
//   records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md   (his ${bosses.length} bosses)
//   records/BOHEMIA_LADDER_GRAPH_8_13_26.json      (his ${edges.length} physical edges)
//
// It exists because the walk has to run in a browser and a browser cannot read
// a markdown file. Nobody typed a boss here. gates/ladder_walk_gate.js re-reads
// both sources and compares this field by field, so an edit made here instead of
// there goes red rather than shipping.
//
// draft:true on every row: these are HIS words carried across, not approved
// player-facing copy written by anybody else.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var BOSSES = ${JSON.stringify(bosses, null, 1)};
  var EDGES = ${JSON.stringify(edges, null, 1)};
  BOSSES.forEach(function (b) { b.draft = true; });
  var API = { BOSSES: BOSSES, EDGES: EDGES, count: BOSSES.length, edgeCount: EDGES.length };
  if (HASREQ) module.exports = API; else root.BohemiaLadderData = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
`;
fs.writeFileSync(OUT, body);
console.log('LADDER DATA: ' + bosses.length + ' bosses, ' + edges.length + ' edges -> engine/bohemia_ladder_data.js');
