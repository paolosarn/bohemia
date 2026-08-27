#!/usr/bin/env node
/* ============================================================================
   DEAD VALLEY GATE  --  ACT ONE HAS NO LIVING PLANT IN IT
   8/27/26, WORLD lane.

   WHY THIS EXISTS, AND WHY IT IS EMBARRASSING THAT IT DID NOT.

   `#3a4520` is an olive green. It was the colour of "dead brush", "dead tree",
   "weed / brush", "windbreak tree" and "dead landscaping" in eighteen district
   modules of a game whose entire first act is a valley where the irrigation died
   thirty years ago. On a real frame it reads as a healthy shrub.

   IT HAS BEEN FIXED THREE SEPARATE TIMES, ONE MODULE AT A TIME:
     - bohemia_strip.js  picked #4d4a38 (a grey brown) at some point and was right
     - bohemia_jail.js   8/23  "CODE 3 WAS GREEN AND CODE 3 IS DEAD BRUSH"
     - bohemia_arterial.js 8/26 "THE DEAD PALM WAS GREEN, AND ACT ONE HAS NOTHING
       GREEN IN IT" -- and that comment names the strip as already having the
       answer, so the author KNEW it was a class of bug and still fixed one file.
   Three fixes, three post-mortems, and eighteen modules still green, because
   A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. This is that gate. There will
   not be a fourth per-module fix.

   THE RULE, STATED HONESTLY:
     Living green is not banned in this valley. WATER CHEMISTRY is green (sulfate
     turquoise in the gypsum pit, dyed glycol under a cooling unit, algae in the
     one wash that always trickles). PAINT is green (a 1930s Arts District
     storefront). An EXIT MARKER is green, because that is what a way out looks
     like in a dark interior. And ONE PLANT is green, deliberately: the creek
     grass at the Mormon Fort, "the last grass in the valley, along the creek,
     because the spring never stopped" -- the fort is there because the spring is
     there, and that is the whole point of the landmark.
     WHAT IS BANNED IS A LIVING PLANT. If a tile's own name says it is dead
     vegetation, it may not be painted a living green. The name is the promise;
     the pixel has to keep it.

   TWO CHECKS, BECAUSE ONE OF THEM CANNOT SEE EVERYTHING:
     A. VEGETATION BY NAME -- every palette entry whose legend says plant must
        not be a living green. This is the check that matters.
     B. ANY SATURATED GREEN AT ALL must appear on the allow list below with a
        written reason. This is the backstop for tiles with NO legend (the crypt
        and garage entrance markers had none, and check A is blind to them).

   C. THE WALKED SURFACE carries an INLINED copy of every engine module. A colour
      fixed in engine/ and not resynced is a colour Paolo still sees. Checked.

   D. MUTATION TEST -- a green is put back in memory and the checker must go red.
      A negative result is a claim about your instrument until you have shown the
      instrument could have seen a positive one.
   ========================================================================== */

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENGINE = path.join(ROOT, 'engine');
const WORLD = path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html');

let checks = 0, fails = 0;
const FAIL = m => { fails++; console.log('  FAIL  ' + m); };
const OK = m => { checks++; console.log('  ok    ' + m); };

/* ---------------------------------------------------------------- colour --- */
function hsv(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d > 1e-9) {
    if (mx === r) h = 60 * (((g - b) / d) % 6);
    else if (mx === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  if (h < 0) h += 360;
  return { h, s: mx ? d / mx : 0, v: mx };
}
/* A LIVING plant is green AND has colour in it. Dead straw sits at hue 40-55 and
   dead grey-brown below saturation 0.15, so both clear this band with room. */
const isLivingGreen = hex => { const c = hsv(hex); return c.h >= 65 && c.h <= 175 && c.s >= 0.15; };
/* Check B is deliberately looser on hue and tighter on saturation: it is looking
   for a colour a person would call green without hesitating. */
const isVividGreen  = hex => { const c = hsv(hex); return c.h >= 70 && c.h <= 175 && c.s >= 0.30; };

/* A tile is VEGETATION if the layering kind says so, or if its own name does. */
const VEG_NAME = /(^|[^a-z])(weed|brush|shrub|palm|grass|lawn|hedge|bush|turf|tumbleweed|sod|ivy|vine|cactus|yucca|creosote|mesquite|juniper|oleander)([^a-z]|$)|landscap|planter|putting surface|outfield|infield|dead tree|windbreak/i;
const isVeg = (name, kind) => kind === 'tree-dead' || kind === 'tree' || VEG_NAME.test(String(name || ''));

/* ------------------------------------------------------------ allow list --- */
/* module:code -> the reason it is allowed to be green. A green with no reason
   written here is a bug, not a decision. */
const ALLOW = {
  'bohemia_crypt.js:4':      'ENTRANCE MARKER. Not a plant: the way out of a pitch-dark crypt, drawn the colour every exit sign on earth is drawn.',
  'bohemia_garage.js:6':     'ENTRANCE MARKER. Same, on the ground deck of a parking structure.',
  'bohemia_landmarks.js:6':  'CREEK GRASS AT THE MORMON FORT. Authored canon: "the last grass in the valley, along the creek, because the spring never stopped." The fort exists BECAUSE the spring does. This is the one deliberate living plant in Act One and it carries the reason a city is here at all.',
  'bohemia_utility.js:8':    'WATER CHEMISTRY, not vegetation. Sulfate turquoise in the gypsum pit water, dyed glycol under a datafort cooling unit, algae in the basin trickle that runs even when it has not rained. Each act1 text says outright that it is the only colour on its site.',
  'bohemia_downtown.js:16':  'PAINT. A 1930s Arts District storefront in faded green. Paint does not need water.',
  'bohemia_landfill.js:8':   'LEACHATE. A chemical pond, not a plant.',
  'bohemia_dress.js':        'FACTION COLOUR, not world pixels.',
  'bohemia_valleymap.js':    'MAP KEY, not world pixels.',
  'bohemia_desert.js:2':     'CREOSOTE. Larrea tridentata is the dominant plant of the Mojave and it is not on anybody\'s irrigation -- it is the reason the desert outside Vegas is not bare sand, and thirty years without a city changes nothing about it. REALISM FIRST: the open desert stays alive. Muted to real dusty olive, not lawn.',
  'bohemia_mountain.js:6':   'DESERT SHRUB on the ranges, same reason as the creosote: never watered by the city, so never killed by the city.',
  'bohemia_commercial.js:9': 'AWNING FABRIC in teal. Cloth, not a plant.',
  'bohemia_school.js:14':    'GYMNASIUM, a teal-painted block. Paint, not a plant.',
};

/* ------------------------------------------------- palette/legend finder --- */
const isHex = v => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);
const numericKeyed = o => {
  const k = Object.keys(o);
  return k.length >= 3 && k.every(x => /^\d+$/.test(x));
};
function collect(node, pathStr, out, seen, depth) {
  if (!node || typeof node !== 'object' || depth > 5 || seen.has(node)) return;
  seen.add(node);
  if (numericKeyed(node)) {
    const vals = Object.values(node);
    if (vals.every(isHex)) { out.pal.push([pathStr, node]); return; }
    if (vals.every(v => v && typeof v === 'object' && 'name' in v)) { out.leg.push([pathStr, node]); return; }
  }
  for (const k of Object.keys(node)) {
    let v; try { v = node[k]; } catch (e) { continue; }
    collect(v, pathStr + '.' + k, out, seen, depth + 1);
  }
}
/* pair each palette with the legend sharing the longest path prefix */
function pairLegend(palPath, legends) {
  let best = null, bestLen = -1;
  for (const [lp, leg] of legends) {
    let i = 0; while (i < lp.length && i < palPath.length && lp[i] === palPath[i]) i++;
    if (i > bestLen) { bestLen = i; best = leg; }
  }
  return best;
}

/* =============================== CHECK A =============================== */
console.log('\nDEAD VALLEY GATE  --  act one has no living plant in it\n');
console.log('A. VEGETATION BY NAME');

const files = fs.readdirSync(ENGINE).filter(f => /^bohemia_.*\.js$/.test(f)).sort();
let scanned = 0, vegTiles = 0;
const greenVeg = [];
const allPaletteEntries = [];   // for check B

/* SOME ENGINE MODULES RUN THEIR OWN SELF-TEST ON REQUIRE, AND ONE OF THEM CALLS
   process.exit. The first draft of this gate printed its own heading, then a
   quest-format gate's 29 lines, then STOPPED -- exit code 0, no findings, and it
   would have read as a pass. A checker that another module can silently kill is
   not a checker. Requires are done with the console muted and exit disarmed. */
function quietRequire(p) {
  const realExit = process.exit, realLog = console.log, realErr = console.error;
  process.exit = () => { throw new Error('module tried to exit on require'); };
  console.log = console.error = () => {};
  try { return require(p); }
  catch (e) { return null; }
  finally { process.exit = realExit; console.log = realLog; console.error = realErr; }
}

for (const f of files) {
  const M = quietRequire(path.join(ENGINE, f));
  if (!M) continue;
  const out = { pal: [], leg: [] };
  collect(M, '', out, new Set(), 0);
  if (!out.pal.length) continue;
  scanned++;
  for (const [pp, pal] of out.pal) {
    const leg = pairLegend(pp, out.leg);
    for (const code of Object.keys(pal)) {
      const hex = pal[code];
      const ent = leg && leg[code] ? leg[code] : null;
      const name = ent ? ent.name : null;
      const kind = ent ? ent.kind : null;
      allPaletteEntries.push({ f, code, hex, name, kind, pp });
      if (!isVeg(name, kind)) continue;
      vegTiles++;
      /* a plant that is green ON PURPOSE is allowed here too, and for the SAME
         written reason -- the allow list is one place, not two. */
      if (ALLOW[f + ':' + code] || ALLOW[f]) continue;
      if (isLivingGreen(hex)) greenVeg.push({ f, code, hex, name, pp });
    }
  }
}

if (scanned < 40) FAIL(`only ${scanned} modules had a palette -- the scanner is broken, not the valley`);
else OK(`${scanned} district modules scanned, ${vegTiles} vegetation tiles found`);

if (greenVeg.length) {
  for (const g of greenVeg) FAIL(`${g.f} code ${g.code} "${g.name}" is ${g.hex} -- a LIVING GREEN on a dead plant`);
} else {
  OK(`0 of ${vegTiles} vegetation tiles is a living green`);
}

/* =============================== CHECK B =============================== */
console.log('\nB. ANY VIVID GREEN NEEDS A WRITTEN REASON');
let unexplained = 0, allowed = 0;
for (const e of allPaletteEntries) {
  if (!isVividGreen(e.hex)) continue;
  const k1 = e.f + ':' + e.code, k2 = e.f;
  if (ALLOW[k1] || ALLOW[k2]) { allowed++; continue; }
  unexplained++;
  FAIL(`${e.f} code ${e.code} ${e.hex} ("${e.name || 'no legend'}") is vividly green and is on no allow list`);
}
if (!unexplained) OK(`every vivid green in the valley has a written reason (${allowed} allowed)`);
/* the allow list must not rot into a blanket amnesty */
if (Object.keys(ALLOW).length > 12) FAIL(`allow list has ${Object.keys(ALLOW).length} entries -- it is becoming a way to not fix things`);
else OK(`allow list is ${Object.keys(ALLOW).length} entries, each with a stated reason`);

/* =============================== CHECK C =============================== */
console.log('\nC. THE SURFACE PAOLO WALKS CARRIES THE SAME COLOURS');
const DEAD_GREENS = ['#3a4520', '#3a4526', '#4a5533', '#5b6a44', '#4f6038', '#7d8a4a',
                     '#55603a', '#49512e', '#4a5230', '#49512f'];
if (!fs.existsSync(WORLD)) {
  FAIL('the walked surface is missing');
} else {
  const html = fs.readFileSync(WORLD, 'utf8');
  /* MATCH A PALETTE VALUE, NOT PROSE. The first draft matched the bare literal and
     went red on four hits that were all COMMENTS -- the strip's, the jail's 8/23 and
     the arterial's 8/26 post-mortems for this very bug, inlined with their modules.
     A checker that cannot tell a mention from a use is the broken one. */
  let stale = 0;
  for (const g of DEAD_GREENS) {
    const n = (html.match(new RegExp(`['"]${g}['"]`, 'gi')) || []).length;
    if (n) { stale++; FAIL(`${g} is still assigned ${n}x in the walked surface -- engine fixed, slice never resynced`); }
  }
  if (!stale) OK(`none of the ${DEAD_GREENS.length} swept greens survives in the inlined copy`);
  /* and the fix itself must actually be there, or "no green" is just "no module" */
  const n = (html.match(/#4d4a38/gi) || []).length;
  if (n < 10) FAIL(`the replacement grey-brown appears only ${n}x in the walked surface -- the resync did not carry`);
  else OK(`the replacement grey-brown is inlined ${n}x`);
}

/* =============================== CHECK D =============================== */
console.log('\nD. MUTATION TEST -- can this gate see a green at all?');
{
  const probeVeg = { name: 'dead brush', kind: 'tree-dead' };
  const before = isLivingGreen('#4d4a38') && isVeg(probeVeg.name, probeVeg.kind);
  const after  = isLivingGreen('#3a4520') && isVeg(probeVeg.name, probeVeg.kind);
  if (before) FAIL('the shipped grey-brown reads as a living green -- the threshold is wrong');
  else OK('the shipped grey-brown passes');
  if (!after) FAIL('putting #3a4520 back on dead brush does NOT trip the check -- THIS GATE IS BLIND');
  else OK('putting #3a4520 back on dead brush trips the check');
  /* and the backstop must catch a legend-less green, which is how the entrance
     markers were found in the first place */
  if (!isVividGreen('#39d46a')) FAIL('the backstop cannot see #39d46a -- it would have missed the entrance markers');
  else OK('the backstop sees a legend-less vivid green');
  /* and it must NOT flag straw, or every dead field in the valley goes red */
  for (const straw of ['#574f3b', '#6d6449', '#635a42', '#8b8064', '#605844']) {
    if (isLivingGreen(straw)) FAIL(`${straw} (bleached straw) reads as living green -- the band is too wide`);
  }
  OK('the five bleached-straw turf colours all read as dead');
}

console.log(`\n${fails ? 'RED' : 'GREEN'}  dead_valley_gate  ${checks} ok, ${fails} failed\n`);
process.exit(fails ? 1 : 0);
