#!/usr/bin/env node
/* BOHEMIA HERO WIRE GATE (7/24/26) — locks the approved DISTRICT HERO sprites
 * into the CITY tab render. Paolo approved the matched heroes and asked for the
 * same treatment across the district roster; NOTES ARE RULINGS. The city-view
 * render MUST draw each district's hero PNG (via a guarded switch) instead of a
 * crude block. Guards against a silent regression back to flat dia+prism and
 * against a district in the bank never getting wired.
 *
 *   node gates/hero_wire_gate.js
 */
const fs = require('fs');
const REPO = require('path').dirname(__dirname);
process.chdir(REPO);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const bank = JSON.parse(fs.readFileSync('banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt', 'utf8'));
const districts = bank.heroes.map(h => h.district);

const alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
const m = alpha.match(/const CITY_B64='([^']+)'/);
ok('CITY_B64 present', !!m);
if (m) {
  const dec = Buffer.from(m[1], 'base64').toString('utf8');
  ok('drawHero() is defined in the city render', dec.indexOf('function drawHero(') >= 0);
  ok('HERO_WIRE block present (markers)', dec.indexOf('/*HERO_WIRE_START*/') >= 0 && dec.indexOf('/*HERO_WIRE_END*/') >= 0);
  ok('render switch is hero-guarded (all districts covered)', dec.indexOf('if(!(HERO_IMG[d]&&drawHero(d,p)))switch(d){') >= 0);
  for (const d of districts) {
    ok(d + ': sprite embedded as PNG data URI', dec.indexOf('"' + d + '":"data:image/png;base64,') >= 0);
    ok(d + ': anchor bx/by embedded', new RegExp('"' + d + '":\\{"bx":\\d+,"by":\\d+\\}').test(dec));
  }
  // the pre-wire battery block painted a live-GREEN stripe (#48c858) — DEAD WORLD LAW.
  ok('no dead-world green stripe in the battery city tile', dec.indexOf("g.fillStyle='#48c858'") < 0);
}

console.log('HERO WIRE GATE: ' + pass + ' passed, ' + fail + ' failed (' + districts.length + ' districts)');
process.exit(fail ? 1 : 0);
