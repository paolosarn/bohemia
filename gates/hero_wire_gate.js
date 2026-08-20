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

// THE CITY MOVED OUT OF THE ALPHA (8/2, the payload-wall pass in another lane) and stopped
// being base64 on the way. This gate follows the artefact instead of assuming where it
// lives or what shape it is -- it went red the moment the city was refactored, which is a
// gate testing a LOCATION rather than the THING.
/* ASK THE ONE RESOLVER (8/6). This kept its own copy of "where the city lives",
   which was right twice and wrong twice: it survived the 8/2 move out of the alpha
   and then broke the moment the ART BANK was split out of the world page, because
   HERO_SRC is in BOHEMIA_CITY_TILES.js now. bohemia_city_app.read() returns the
   whole LOGICAL document -- page plus bank -- so a storage split is invisible here.
   A gate that keeps a private map of the architecture is a gate that goes red every
   time the architecture is improved. */
const CITY_APP = require('./bohemia_city_app.js');
const _app = CITY_APP.read();
const dec = _app ? _app.src : null;
const where = _app ? _app.file : null;
ok('the CITY APP is findable (' + (where || 'nowhere') + ')', !!dec);
if (dec) {
  ok('drawHero() is defined in the city render', dec.indexOf('function drawHero(') >= 0);
  ok('HERO_WIRE block present (markers)', dec.indexOf('/*HERO_WIRE_START*/') >= 0 && dec.indexOf('/*HERO_WIRE_END*/') >= 0);
  /* ASK FOR THE PROPERTY, NEVER THE SPELLING (8/1). This matched the call
     BYTE FOR BYTE, so adding a third argument to drawHero -- the street-facing
     flip, 8/15 -- turned it red while the switch was still perfectly guarded.
     THE RULE is: the district switch only runs when the hero did not draw. */
  ok('render switch is hero-guarded (all districts covered)',
     /if\(!\(HERO_IMG\[d\]&&drawHero\([\s\S]{0,60}?\)\)switch\(d\)\{/.test(dec));
  for (const d of districts) {
    ok(d + ': sprite embedded as PNG data URI', dec.indexOf('"' + d + '":"data:image/png;base64,') >= 0);
    ok(d + ': anchor bx/by embedded', new RegExp('"' + d + '":\\{"bx":\\d+,"by":\\d+\\}').test(dec));
  }
  /* AND IT HAS TO BE *THE* SPRITE, NOT JUST *A* SPRITE (8/21).
     Everything above asks whether something is wired. Nothing asked whether what is
     wired is what the bank holds -- so the map drew a 451 px cityhall from before
     Paolo's 8/2 "biggest as fuck" pass while the bank held the 1,724 px master, and
     this gate was 143/143 green the whole time. Three weeks of icon work never reached
     the map: the stadium's field, the basin's hole, the police shield, the radio masts,
     nine entire districts. A wire tool that is not re-run is indistinguishable from one
     that was, unless somebody checks.
     The wire embeds HERO_FROM: a digest of the bank entry each map copy was resampled
     from. Recompute it here and the answer is exact. (The map copy is deliberately a
     RESAMPLE -- 256 px against a 47 px draw -- so the bytes cannot be compared, only
     their provenance.) */
  const crypto = require('crypto');
  const fm = dec.match(/var HERO_FROM=(\{.*?\});/);
  ok('the wire records which bank master each map sprite came from (HERO_FROM)', !!fm);
  if (fm) {
    let stale = [];
    let FROM = {};
    try { FROM = JSON.parse(fm[1]); } catch (e) { /* reported by the parse check above */ }
    for (const h of bank.heroes) {
      const want = crypto.createHash('sha1').update(h.b64).digest('hex').slice(0, 12);
      if (FROM[h.district] !== want) stale.push(h.district);
    }
    ok('EVERY wired sprite was resampled from the CURRENT bank master -- a wire tool that '
       + 'was never re-run looks exactly like one that was (' + (bank.heroes.length - stale.length)
       + '/' + bank.heroes.length + ' current)', !stale.length,
       stale.length ? '  -- stale on the map: ' + stale.slice(0, 8).join(', ') : '');
  }
  // the pre-wire battery block painted a live-GREEN stripe (#48c858) — DEAD WORLD LAW.
  ok('no dead-world green stripe in the battery city tile', dec.indexOf("g.fillStyle='#48c858'") < 0);
}

console.log('HERO WIRE GATE: ' + pass + ' passed, ' + fail + ' failed (' + districts.length + ' districts)');
process.exit(fail ? 1 : 0);
