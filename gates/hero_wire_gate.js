#!/usr/bin/env node
/* BOHEMIA HERO WIRE GATE (7/24/26) — locks the approved DISTRICT HERO sprites
 * into the CITY tab render. Paolo approved v7 (matched to the walkable district)
 * and NOTES ARE RULINGS, so the city-view render MUST draw the hero PNG on the
 * cityhall / battery / terminal tiles (via drawHero), not a crude block. Guards
 * against a silent regression back to the flat dia+prism (and the dead-world-
 * illegal green stripe the old battery block painted).
 *
 *   node gates/hero_wire_gate.js
 */
const fs = require('fs');
const REPO = require('path').dirname(__dirname);
process.chdir(REPO);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
const m = alpha.match(/const CITY_B64='([^']+)'/);
ok('CITY_B64 present', !!m);
if (m) {
  const dec = Buffer.from(m[1], 'base64').toString('utf8');
  ok('drawHero() is defined in the city render', dec.indexOf('function drawHero(') >= 0);
  ok('HERO_WIRE block present (markers)', dec.indexOf('/*HERO_WIRE_START*/') >= 0 && dec.indexOf('/*HERO_WIRE_END*/') >= 0);
  for (const d of ['cityhall', 'battery', 'terminal']) {
    ok(d + ': switch case calls drawHero', dec.indexOf("drawHero('" + d + "'") >= 0);
    ok(d + ': sprite embedded as PNG data URI', dec.indexOf('"' + d + '":"data:image/png;base64,') >= 0);
    ok(d + ': anchor bx/by embedded', new RegExp('"' + d + '":\\{"bx":\\d+,"by":\\d+\\}').test(dec));
  }
  // the old battery block painted a live-GREEN stripe (#48c858) — DEAD WORLD LAW.
  // wiring dropped it; make sure it does not creep back.
  ok('no dead-world green stripe in the battery city tile', dec.indexOf("case 'battery': { dia(p,'#8a8a82'); g.fillStyle='#e8e8e0'") < 0);
}

console.log('HERO WIRE GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
