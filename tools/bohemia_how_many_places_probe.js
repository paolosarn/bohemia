/* BOHEMIA — HOW MANY PLACES IS THIS MAP? (9/27/26, LIFE + CITY, [bb places] round one)
 *
 * Rule 33(a), Paolo 9/24: THE MAP IS THE CITY VIEW WE HAVE. Battle Brothers generates a
 * world with roughly SEVENTEEN settlements on it and everything else exists to make the
 * distance between them cost something. So the question this lane owes is not "how does
 * BB do a map" but HOW MANY NAMES ARE ON OURS, measured, right now.
 *
 * A NUMBER IN A RECORD IS A CLAIM. A PROBE IS A MEASUREMENT. This file exists so the
 * count in records/BOHEMIA_BB_SCHOOL_LIFE_AND_CITY_THE_MAP_HAS_FOURTEEN_PLACES_9_27_26.md
 * can be re-run by anybody, including after somebody edits the faction graph.
 *
 * IT MEASURES, IT DOES NOT DEFINE. The tier rule is not re-implemented here from memory:
 * it is the one engine/bohemia_towns.js documents (rank act1_power, cut in thirds), and
 * this file REFUSES TO RUN if that file stops saying so, because a probe that silently
 * keeps its own copy of a rule is how two numbers start to drift.
 *
 * Run from repo root:  node tools/bohemia_how_many_places_probe.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const GRAPH = path.join(ROOT, 'engine', 'BOHEMIA_faction_graph.json');
const TOWNS = path.join(ROOT, 'engine', 'bohemia_towns.js');

// Battle Brothers' own number, for the comparison this probe exists to make.
const BB_SETTLEMENTS = 17;

function refuse(why) { console.error('REFUSING: ' + why); process.exit(1); }

if (!fs.existsSync(GRAPH)) refuse('engine/BOHEMIA_faction_graph.json is not there.');
if (!fs.existsSync(TOWNS)) refuse('engine/bohemia_towns.js is not there.');

// THE RULE IS READ, NOT REMEMBERED.
const townsrc = fs.readFileSync(TOWNS, 'utf8');
if (!/act1_power/.test(townsrc) || !/thirds/i.test(townsrc)) {
  refuse('engine/bohemia_towns.js no longer describes the seat tier as act1_power ranked ' +
         'and cut in thirds. This probe measures THAT rule; if the rule moved, the probe ' +
         'is measuring a rule nobody uses any more.');
}

const factions = JSON.parse(fs.readFileSync(GRAPH, 'utf8')).factions;
const rows = Object.keys(factions).map(function (id) {
  return { id: id, a1: factions[id].act1_power, a3: factions[id].act3_power };
});

function tiers(key) {
  const seated = rows.filter(function (r) { return typeof r[key] === 'number'; })
                     .sort(function (a, b) { return b[key] - a[key]; });
  const cut = Math.ceil(seated.length / 3);
  const map = {};
  seated.forEach(function (r, i) {
    map[r.id] = i < cut ? 'FORTRESS' : (i < cut * 2 ? 'TOWN' : 'CAMP');
  });
  return map;
}

const A1 = tiers('a1'), A3 = tiers('a3');
const seats = Object.keys(A1);
const noSeat = rows.filter(function (r) { return typeof r.a1 !== 'number'; });
const noAct3 = seats.filter(function (id) { return !A3[id]; });
const moved = seats.filter(function (id) { return A3[id] && A3[id] !== A1[id]; });

const count = { FORTRESS: 0, TOWN: 0, CAMP: 0 };
seats.forEach(function (id) { count[A1[id]]++; });

console.log('HOW MANY PLACES IS THIS MAP?  (LIFE + CITY, [bb places], rule 33a)');
console.log('');
console.log('  SEATS ON THE MAP           %d', seats.length);
console.log('  BATTLE BROTHERS SHIPS     ~%d settlements per generated world', BB_SETTLEMENTS);
console.log('  difference                 %d', Math.abs(seats.length - BB_SETTLEMENTS));
console.log('');
console.log('  act 1 tiers                %d FORTRESS, %d TOWN, %d CAMP',
            count.FORTRESS, count.TOWN, count.CAMP);
seats.sort(function (a, b) { return factions[b].act1_power - factions[a].act1_power; })
     .forEach(function (id) {
  const a = A1[id], c = A3[id] || '(no act3_power)';
  console.log('    %s  act1 %s  act3 %s%s', id.padEnd(12), a.padEnd(9), String(c).padEnd(15),
              (A3[id] && A3[id] !== a) ? '   <-- CHANGES RANK' : '');
});
console.log('');
console.log('  *** THE MAP AT THREE DATES, IN ITS OWN NUMBERS (row [three cities], rule 31) ***');
console.log('  destinations that change rank between act 1 and act 3:  %d of %d',
            moved.length, seats.length);
if (moved.length) console.log('    %s', moved.join(', '));
console.log('');
console.log('  HOLES THE COUNT FOUND:');
console.log('    factions with NO seat at all (act1_power null):  %d  %s',
            noSeat.length, noSeat.map(function (r) { return r.id; }).join(', ') || '-');
console.log('    seats with NO act3_power (missing data, NOT a change):  %d  %s',
            noAct3.length, noAct3.join(', ') || '-');
console.log('');
console.log('  read from : engine/BOHEMIA_faction_graph.json');
console.log('  rule from : engine/bohemia_towns.js (checked, not remembered)');
