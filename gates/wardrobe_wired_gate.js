/* THE WARDROBE WIRED GATE (9/5/26) -- art that is cooked is art that is worn.
 *
 * VAMILY job [clothes wired] WIRE-THE-REMAKE: "ART makes pixels, CHARACTER makes them
 * worn." This is the ratchet half of that job -- the half that has to exist BEFORE the
 * next batch lands, because the failure it catches has happened four times in six weeks
 * and every single time it shipped green:
 *     the seventeen invisible hats
 *     the four bright garments, three worn by nobody for five weeks (7/21 -> 8/26)
 *     the VOTE tab that held no faces for three weeks (8/7 -> 8/28)
 *     the face maker shipped into a tab the demo strips out (8/28 -> 8/30)
 * THE MATERIAL EXISTED AND NEVER REACHED THE PLAYER. Nothing has ever checked that a
 * cooked garment can actually be put on somebody.
 *
 * *** AND THE HOLE IS STRUCTURAL, NOT A MATTER OF ODDS. *** The picker says, verbatim:
 *       if (odds === undefined) continue;    // unknown category: leave it alone
 * So a garment cooked into a LAYER that nobody added to WEAR_ODDS is canon, shipped,
 * drawn in the wardrobe, and unwearable forever -- with no error, no warning, and every
 * other gate green. That is one line away at all times, and it is exactly the shape of
 * the seventeen hats.
 *
 * MEASURED THE DAY THIS WAS WRITTEN: 280 canon garments, 12 layers, every layer has
 * odds, and NOT ONE non-reserved garment is unworn over 4000 citizens. The wardrobe is
 * clean today. This gate exists so it stays clean the day COOK's WARDROBE-REMAKE lands.
 *
 * IT ASKS THE REAL PICKER. A gate that read the GARMENTS table would prove the table
 * has rows, not that anybody wears them (VERIFY ON THE REAL SURFACE, 7/18).
 *
 *   node gates/wardrobe_wired_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const PICKER = path.join(REPO, 'engine/bohemia_personlook.js');
const N = 4000;

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) { pass++; console.log('  ok   ' + n + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + n + (note ? '   ' + note : '')); } };

(async () => {
  console.log('\nTHE WARDROBE WIRED GATE');

  /* THE SILENT SKIP IS STILL THERE, so the layer check below is still needed. If the
     picker is ever changed to throw or warn on an unknown layer, this line tells the
     next session that the check can be relaxed -- rather than leaving a gate standing
     over a hole that was filled. */
  const src = fs.readFileSync(PICKER, 'utf8');
  ok('the picker still silently skips an unknown layer, so this gate is still needed',
     /odds === undefined\) continue/.test(src));

  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => window.GARMENTS && window.BOH_PERSONLOOK, { timeout: 60000 });

  const r = await p.evaluate((N) => {
    const canon = (window.GARMENTS || []).filter(g => g && g.st === 'canon' && g.layer);
    const byLayer = {};
    for (const g of canon) (byLayer[g.layer] = byLayer[g.layer] || []).push(g);
    const odds = (BOH_PERSONLOOK && BOH_PERSONLOOK.WEAR_ODDS) || null;

    const seen = {};
    let dressed = 0;
    for (let i = 0; i < N; i++) {
      const look = BOH_PERSONLOOK.lookFor('crowd:' + i, window.GARMENTS);
      const worn = (look && look.worn) || {};
      let any = false;
      for (const slot in worn) if (worn[slot]) { seen[worn[slot]] = (seen[worn[slot]] || 0) + 1; any = true; }
      if (any) dressed++;
    }
    const soft = canon.filter(g => !g.hard);
    const hard = canon.filter(g => g.hard);
    return {
      total: canon.length,
      layers: Object.keys(byLayer).sort(),
      noOdds: Object.keys(byLayer).filter(L => !odds || odds[L] === undefined).sort(),
      oddsReadable: !!odds,
      softUnworn: soft.filter(g => !seen[g.n]).map(g => g.layer + '/' + g.n),
      softTotal: soft.length,
      hardTotal: hard.length,
      hardWorn: hard.filter(g => seen[g.n]).length,
      hardShare: hard.reduce((s, g) => s + (seen[g.n] || 0), 0) / N,
      dressed, N
    };
  }, N);
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  ok('the picker publishes its odds table, so this reads the real one',
     !!r.oddsReadable, '(no second copy of a table that must agree)');
  ok('there is a wardrobe to check', (r.total | 0) >= 100,
     '(' + r.total + ' canon garments across ' + r.layers.length + ' layers)');
  ok('everybody the picker dresses actually gets dressed', r.dressed === r.N,
     '(' + r.dressed + ' of ' + r.N + ')');

  /* THE ONE THAT CATCHES THE NEXT BATCH. */
  ok('*** every canon layer is wired into the picker ***', r.noOdds.length === 0,
     r.noOdds.length
       ? '\n         UNREACHABLE LAYERS: ' + r.noOdds.join(', ') +
         '\n         A garment in a layer with no entry in WEAR_ODDS is canon, drawn,' +
         '\n         and worn by NOBODY, forever, with every other gate green. Add the' +
         '\n         layer to WEAR_ODDS in engine/bohemia_personlook.js.'
       : '(' + r.layers.join(', ') + ')');

  ok('*** every garment that is not reserved is actually worn by somebody ***',
     r.softUnworn.length === 0,
     r.softUnworn.length
       ? '\n         COOKED AND WORN BY NOBODY: ' + r.softUnworn.slice(0, 12).join(', ') +
         (r.softUnworn.length > 12 ? ' (+' + (r.softUnworn.length - 12) + ' more)' : '') +
         '\n         ART makes pixels, CHARACTER makes them worn. This is the seventeen' +
         '\n         invisible hats, again.'
       : '(' + r.softTotal + ' checked over ' + r.N + ' citizens)');

  /* RESERVED IS RARE, NOT ABSENT. The 8/27 trenchcoat cap holds long coats back from
     nine strangers in ten -- HELD BACK, NOT DELETED, and the lesson written that day was
     that a share cap alone is satisfied by deleting the thing. So the reserved pool has
     to still turn up. The per-garment share is trenchcoat_gate's business, not a second
     opinion here. */
  ok('the reserved garments are rare but not gone', r.hardWorn > 0 && r.hardShare > 0,
     '(' + r.hardWorn + ' of ' + r.hardTotal + ' seen, ' +
     (r.hardShare * 100).toFixed(2) + '% of citizens wearing one)');
  ok('and reserved really is reserved, not the default', r.hardShare < 0.12,
     '(' + (r.hardShare * 100).toFixed(2) + '%, cap is 10% plus sampling)');

  /* AND IT HAS TO REACH THE DEMO, NOT JUST THE WORKSHOP (VAMILY rule 7: a row is not
     shipped until it is in the walked surface AND the demo). The demo is cut from the
     alpha by a tool that strips seventeen dev tabs, and this lane has already shipped
     one feature into a tab that cut removes (the face maker, 8/28 -> 8/30). */
  const b2 = await chromium.launch();
  const p2 = await b2.newPage({ viewport: { width: 390, height: 844 } });
  await p2.goto('file://' + path.join(REPO, 'slices/BOHEMIA_DEMO.html'), { waitUntil: 'load' });
  let demo = { ok: false };
  try {
    await p2.waitForFunction(() => window.GARMENTS && window.BOH_PERSONLOOK, { timeout: 60000 });
    demo = await p2.evaluate(() => {
      const canon = GARMENTS.filter(g => g && g.st === 'canon' && g.layer);
      const seen = {};
      for (let i = 0; i < 1500; i++) {
        const w = (BOH_PERSONLOOK.lookFor('crowd:' + i, GARMENTS) || {}).worn || {};
        for (const s in w) if (w[s]) seen[w[s]] = 1;
      }
      const soft = canon.filter(g => !g.hard);
      return { ok: true, canon: canon.length, unworn: soft.filter(g => !seen[g.n]).length };
    });
  } catch (_e) {}
  await b2.close();

  ok('the wardrobe is in the demo a player opens, not only the workshop', !!demo.ok,
     demo.ok ? '(' + demo.canon + ' canon garments)' : '(the demo has no picker)');
  ok('and nothing is unworn there either', demo.ok && demo.unworn === 0,
     demo.ok ? '(' + demo.unworn + ' unworn)' : '');

  /* *** A KNOWN GAP, REPORTED AND NOT FAILED, BECAUSE IT IS NOT THIS LANE'S SURFACE. ***
     slices/BOHEMIA_CITY_WORLD.html -- the walked city -- simulates about 5,027 agents
     with homes, schedules and movement, and has ZERO calls to buildFrame or drawChar.
     Measured live: GARMENTS undefined, BOH_PERSONLOOK undefined, buildFrame undefined.
     NOBODY IS DRAWN AS A BODY THERE, so no garment and no haircut can reach the surface
     Paolo actually walks -- not because the wardrobe is unwired, but because there is
     no person to dress. Drawing bodies in the walked city is the RUN and LIFE+CITY
     lanes' system, so this gate REPORTS it and does not go red over another lane's
     missing feature; failing here would block them for a hole they own. It is written
     into the CHARACTER handoff for the coordinator. */
  const city = fs.readFileSync(path.join(REPO, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const cityDraws = /buildFrame|drawChar/.test(city);
  console.log('  note ' + (cityDraws
    ? 'the walked city now draws bodies -- wire the wardrobe into it and make this a check'
    : 'the walked city still draws NO bodies (0 buildFrame/drawChar), so no garment can'));
  if (!cityDraws) console.log('       reach it. Not a CHARACTER hole: RUN / LIFE+CITY own that surface.');

  console.log('\nTHE WARDROBE WIRED GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
