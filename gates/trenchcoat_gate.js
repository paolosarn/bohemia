/* BOHEMIA — TRENCHCOAT GATE (8/27/26). FACTORY LAW: new law, own gate, same turn.
 *
 * laws/BOHEMIA_LAW_TRENCHCOATS_ARE_RESERVED_8_27_26.md, Paolo 8/27:
 *   "everyone's getting a fucking trenchcoat and I think that's fucking ridiculous. The
 *    trenchcoat should just be reserved for like mostly badass people for real like
 *    killers and shit ... I know we still need to make a lot more clothing ...
 *    trenchcoats are for bad ass motherfuckers bro cowboy shit like killers like for real"
 *
 * MEASURED ON THE REAL PICKER, NOT THE CATALOGUE. A share cap read off the garment list
 * would say "16 of 35 are long, that is 46%" and be describing a shelf nobody stands in.
 * What he SAW was the street, so the street is what gets measured: 3,000 people through
 * BOH_PERSONLOOK.lookFor, the same function the crowd uses.
 *
 * THE HALF THAT IS EASY TO GET WRONG IS TEST 3. A share cap alone is satisfied by
 * DELETING the coats, and it is also satisfied by a wardrobe where the only alternative
 * to a duster is a waistcoat -- which is the bug he was actually looking at. The cause
 * was a HOLE (nothing existed between the waist and the floor), so the gate holds the
 * middle of the wardrobe open as hard as it holds the coat share down.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO: read FACTION_LOOKS, or decide who is a badass.
 * A named character wears what his ruling says. The reservation governs the RANDOM
 * population only, and who earns a coat is HIS (MECHANISM-MINE / CONTENTS-PAOLO'S).
 *
 *   node gates/trenchcoat_gate.js
 */
'use strict';
const path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('\n=== TRENCHCOAT GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

/* THE PINS. Shares are CEILINGS that may only fall; band counts are FLOORS that may
   only rise. Both were taken the day the law was written, off the numbers below. */
const CROWD_CAP  = 4.0;   /* % of everybody. measured 1.6 */
const COAT_CAP   = 12.0;  /* % of the people who wear ANY outer garment. measured 3.5 */
const LONG_LEN   = 0.70;  /* at or past this, it is a long coat and must be tagged */
const HIP_MIN    = 6;     /* garments with 0.20 <= len < 0.45 */
const THIGH_MIN  = 5;     /* garments with 0.45 <= len < 0.70 */
const N          = 3000;

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForFunction(() => window.BOH_PERSONLOOK && window.GARMENTS, { timeout: 30000 });
  ok('the alpha loads with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  const R = await pg.evaluate((cfg) => {
    const pool = window.GARMENTS.filter(g => g.st === 'canon');
    const outer = pool.filter(g => g.layer === 'outer');
    /* the length lives inside the generator call, which is the only place it exists.
       reading the source is honest here: it is the same string the game runs. */
    const lenOf = (g) => { const m = /genCoat\s*\([\s\S]*?len\s*:\s*([0-9.]+)/.exec(String(g.gen));
      return m ? parseFloat(m[1]) : 0; };
    const bands = { hip: [], thigh: [], long: [], waist: [] };
    const untagged = [];
    for (const g of outer) { const L = lenOf(g);
      if (L >= cfg.LONG_LEN) { bands.long.push(g.n); if (!g.hard) untagged.push(g.n + ' len ' + L); }
      else if (L >= 0.45) bands.thigh.push(g.n);
      else if (L >= 0.20) bands.hip.push(g.n);
      else bands.waist.push(g.n); }
    const LONGSET = {}; for (const n of bands.long) LONGSET[n] = 1;

    const walk = () => { let people = 0, coats = 0, longs = 0;
      for (let i = 0; i < cfg.N; i++) { const w = (window.BOH_PERSONLOOK.lookFor('gate:coat:' + i, pool) || {}).worn || {};
        people++; if (!w.outer) continue; coats++; if (LONGSET[w.outer]) longs++; }
      return { people, coats, longs }; };

    const live = walk();

    /* MUTATION: is the reservation actually load-bearing? Re-run the walk with every
       `hard` flag stripped. If the number does not move, the filter is dead code and
       this gate would be passing on a feature that is not there. */
    const saved = outer.map(g => g.hard);
    outer.forEach(g => { delete g.hard; });
    const noFlag = walk();
    outer.forEach((g, i) => { if (saved[i]) g.hard = saved[i]; });

    return { bands, untagged, live, noFlag, nOuter: outer.length };
  }, { LONG_LEN, N });
  await b.close();

  const pctAll  = 100 * R.live.longs / Math.max(1, R.live.people);
  const pctCoat = 100 * R.live.longs / Math.max(1, R.live.coats);

  /* ---- 1. THE CROWD RATCHET ---------------------------------------------
     The number he was reacting to. One in five was 20.6%. */
  ok('*** NOT EVERYBODY HAS A TRENCHCOAT *** (' + pctAll.toFixed(1) + '% of ' + R.live.people +
     ' people, cap ' + CROWD_CAP.toFixed(1) + '%)', pctAll <= CROWD_CAP);

  /* ---- 2. THE COAT-WEARER RATCHET ---------------------------------------
     Sharper than test 1 and it cannot be gamed by making coats rarer overall:
     of the people who DID put a coat on, how many reached for the long one. */
  ok('and of the people wearing any coat, few reach for the long one (' + pctCoat.toFixed(1) +
     '% of ' + R.live.coats + ' coat-wearers, cap ' + COAT_CAP.toFixed(1) + '%)', pctCoat <= COAT_CAP);

  /* ---- 3. THE MIDDLE OF THE WARDROBE STAYS OPEN --------------------------
     THE REAL TEST. Tests 1 and 2 are both satisfied by deleting every duster, and
     they were both satisfied on 8/26 by a wardrobe with NOTHING between a waistcoat
     and the floor -- which is what put one in five people in a duster in the first
     place. A cap without this line is a cap on the symptom. */
  ok('THE HIP BAND EXISTS (' + R.bands.hip.length + ' coats end at the hip, floor ' + HIP_MIN + ')',
     R.bands.hip.length >= HIP_MIN);
  ok('THE THIGH BAND EXISTS (' + R.bands.thigh.length + ' coats end mid-thigh, floor ' + THIGH_MIN + ')',
     R.bands.thigh.length >= THIGH_MIN);

  /* ---- 4. EVERY LONG COAT IS TAGGED --------------------------------------
     This is what makes the rule survive the NEXT cook. Add a duster without the flag
     and this goes red the same turn, instead of quietly climbing back to 20%. */
  ok('*** EVERY FLOOR-LENGTH COAT IS RESERVED *** (' + R.bands.long.length + ' long coats, all tagged' +
     (R.untagged.length ? ' -- UNTAGGED: ' + R.untagged.join(', ') : '') + ')', R.untagged.length === 0);

  /* ---- 5. THE RESERVATION IS LIVE, PROVED BY MUTATION ---------------------
     A gate that still passes with the feature deleted is not a gate. Strip the flags
     and the share must jump back toward the 20% he complained about. */
  const mutPct = 100 * R.noFlag.longs / Math.max(1, R.noFlag.people);
  ok('MUTATION: delete the reservation and the trenchcoats come back (' + pctAll.toFixed(1) +
     '% -> ' + mutPct.toFixed(1) + '%)', mutPct > pctAll * 3 && mutPct > 8);

  /* ---- 6. THE COAT IS NOT DELETED ----------------------------------------
     He never asked for fewer coats, he asked for fewer coats ON STRANGERS. Every one
     of them is still in the game and still wearable in the CHARACTER tab. */
  ok('and not one coat was deleted (' + R.bands.long.length + ' long coats still in the wardrobe)',
     R.bands.long.length >= 15);

  const src = require('fs').readFileSync(ALPHA, 'utf8');
  ok('the picker reserves by DATA, not by name (no garment name in the reservation)',
     /_hardOdds/.test(src) && /return\s*!x\.hard/.test(src));

  console.log('\n  outer slot: ' + R.nOuter + ' garments');
  console.log('    waist  ' + String(R.bands.waist.length).padStart(3) + '   ' + R.bands.waist.slice(0, 5).join(', ').toLowerCase());
  console.log('    hip    ' + String(R.bands.hip.length).padStart(3) + '   ' + R.bands.hip.join(', ').toLowerCase());
  console.log('    thigh  ' + String(R.bands.thigh.length).padStart(3) + '   ' + R.bands.thigh.join(', ').toLowerCase());
  console.log('    floor  ' + String(R.bands.long.length).padStart(3) + '   RESERVED');
  console.log('  street:  ' + pctAll.toFixed(1) + '% of everybody, ' + pctCoat.toFixed(1) + '% of coat-wearers');
  console.log('  with the reservation deleted it would be ' + mutPct.toFixed(1) + '% -- that gap IS the feature');
  if (pctAll < CROWD_CAP - 1)
    console.log('  *** WELL UNDER THE CAP. Lower CROWD_CAP toward ' + (pctAll + 0.5).toFixed(1) + ' once the wardrobe settles. ***');
  done();
})();
