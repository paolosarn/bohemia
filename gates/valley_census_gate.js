#!/usr/bin/env node
/* VALLEY CENSUS GATE (8/5/26, WORLD lane).
 *
 *   "know what comes after"                                      -- Paolo, 8/4/26
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. The census (tools/bohemia_valley_
 * census.js) measured the whole valley and found that 22 of its 73 district types
 * put NOTHING on the ground -- a plot of them generates and then has no building on
 * it at all. Most of those are correct: a freeway has no building, and neither does
 * a mountain. But ten of them are NAMED PLACES the overmap deliberately sites -- a
 * quarry, a granary, an arsenal, a fuel depot -- and they are empty because nobody
 * has built them yet.
 *
 * A number nobody re-measures is a number that goes stale. So the finding becomes a
 * ratchet instead of a memo:
 *
 *   FLAT_BY_NATURE   surfaces with no building BY FORM. A road, a ridge, a lake, a
 *                    wash. Each carries its reason. This list is allowed to exist,
 *                    and a type joins it only with the reason written next to it.
 *   RESERVED         Paolo's hand by law -- the Strip and the casino core are never
 *                    auto-generated, so of course they are flat. Not debt, canon.
 *   FLAT_DEBT        named places that are empty because they are UNBUILT. RATCHET:
 *                    this list may only SHRINK. A type comes off the moment it puts
 *                    a building on the ground, and nothing new may join it.
 *
 * THE GATE FAILS IF:
 *   - a flat type is on none of the three lists (something new went empty), or
 *   - a type on FLAT_DEBT has gained buildings and was left on the list (stale debt
 *     is the same lie as an unmeasured number), or
 *   - a plot throws, or a building yields no interior.
 *
 *   node gates/valley_census_gate.js
 */
const path = require('path');
const { census, flatTypes } = require(path.join(__dirname, '..', 'tools', 'bohemia_valley_census.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

// ---- FLAT BY NATURE. A surface, not a lot. Reason attached to every entry. -----
const FLAT_BY_NATURE = {
  arterial:    'a six-lane road. The buildings are on the cells BESIDE it.',
  freeway:     'a roadbed on an embankment. Nothing is built on the travel lanes.',
  interchange: 'a stack of flyovers. Its verticality is deck and column, never a building.',
  rail:        'the mainline corridor. The buildings are in the RAILYARD cell.',
  mountain:    'bedrock. There is nothing up there.',
  desert:      'open Mojave. Creosote and one outcrop, which is the point of it.',
  water:       'Lake Mead, shrunken. A launch ramp is not a building.',
  wash:        'a lined flood channel cut BELOW grade. The way in is the tunnel mouth.',
  airport:     'runway, taxiway and apron. Its terminal and hangars are drawn but expose no ' +
               'footprint on purpose -- interiors are a CITY-lane item (engine/bohemia_airfield.js NOTES).',
  airbase:     'same as airport: one module, one ruling.',
};

// ---- RESERVED. Paolo's hand by law. Never auto-generated, so always flat. ------
const RESERVED = {
  strip:  'the Strip is Paolo\'s hand by law. Claude never auto-generates it.',
  casino: 'the Fremont casino core is reserved the same way.',
};

// ---- FLAT DEBT. Named, sited, and UNBUILT. RATCHET: may only shrink. -----------
//
// PAID IN FULL, 8/5/26, the same day it was measured. The list opened at TWELVE types
// and 29 cells -- basin, datafort, reclaim, reservoir, intake, gypsum, granary,
// fueldepot, arsenal, quarry, radio, pumpstation -- every one a named place the
// overmap sites with real geography behind it, every one generating bare ground.
// engine/bohemia_utility.js builds all twelve from one factory (nine layout
// primitives, twelve typed specs) and the ratchet below caught them the moment they
// stopped being flat: it FAILED with all twelve listed as stale, which is the gate
// working exactly as designed rather than a number somebody remembered to update.
//
// It stays here, empty, on purpose. An empty ratchet is the machine saying every
// named place in the valley has something standing on it; a deleted ratchet is
// nobody checking. Anything that goes flat in future must be added here WITH ITS
// REASON, and it can only ever come back off by being built.
const FLAT_DEBT = {};

const SEEDS = [12345, 777, 20260805];

let firstFlat = null;
for (const seed of SEEDS) {
  const c = census(seed);
  ok('seed ' + seed + ': no plot throws (' + c.sampled + ' sampled)', c.threw === 0);
  const noInt = c.rows.filter(r => r.noInterior > 0);
  ok('seed ' + seed + ': every building yields an interior' +
     (noInt.length ? ' -- ' + noInt.map(r => r.type).join(' ') : ''), noInt.length === 0);

  const flat = flatTypes(c).map(r => r.type);
  if (!firstFlat) firstFlat = flat;

  // (1) nothing flat may be unaccounted for
  const orphan = flat.filter(t => !FLAT_BY_NATURE[t] && !RESERVED[t] && !FLAT_DEBT[t]);
  ok('seed ' + seed + ': no UNACCOUNTED flat type' +
     (orphan.length ? ' -- ' + orphan.join(' ') : ''), orphan.length === 0);

  // (2) THE RATCHET: a debt entry that is no longer flat must come off the list
  const built = Object.keys(FLAT_DEBT).filter(t => {
    const r = c.rows.find(rr => rr.type === t);
    return r && r.plots > 0 && r.flat < r.plots;
  });
  ok('seed ' + seed + ': no STALE debt entry (built but still listed)' +
     (built.length ? ' -- ' + built.join(' ') : ''), built.length === 0);
}

// (3) the three lists may not overlap -- a type has exactly one reason for being flat
const dup = Object.keys(FLAT_DEBT).filter(t => FLAT_BY_NATURE[t] || RESERVED[t])
  .concat(Object.keys(RESERVED).filter(t => FLAT_BY_NATURE[t]));
ok('a flat type has exactly ONE reason' + (dup.length ? ' -- ' + dup.join(' ') : ''), dup.length === 0);

// (4) every FLAT_BY_NATURE entry carries a real reason, never a bare name
const thin = Object.keys(FLAT_BY_NATURE).filter(t => String(FLAT_BY_NATURE[t]).length < 24);
ok('every by-nature exemption states its reason' + (thin.length ? ' -- ' + thin.join(' ') : ''),
   thin.length === 0);

const debtCells = Object.keys(FLAT_DEBT).reduce((s, t) => s + FLAT_DEBT[t], 0);
console.log('\nVALLEY CENSUS: ' + pass + '/' + fail +
            '   flat debt ' + Object.keys(FLAT_DEBT).length + ' types, ' + debtCells + ' cells' +
            '   (by-nature ' + Object.keys(FLAT_BY_NATURE).length +
            ', reserved ' + Object.keys(RESERVED).length + ')');
process.exit(fail ? 1 : 0);
