/* WHAT IS THE FIGHT'S COVER ACTUALLY MADE OF?  (COOK, [combat ground] round 2, 9/7/26)
 *
 * The row's remaining clause is "cover that reads", and this lane's own reference sheet
 * says what that means (reference/library/tile-ground/INDEX.md, TG-07):
 *
 *   "at one house per tile, cover is HOUSE-PART SIZED -- a block wall segment, a dead car,
 *    a dumpster, a porch pier -- and each must break the ground's silhouette at the tile
 *    edge where it blocks; COVER THAT ONLY READS BY ITS COLOUR IS NOT COVER."
 *
 * Round 1 measured the ground before touching it and the measurement corrected the guess
 * twice. Same discipline here. Reading the source says cover is a rectangle and two
 * ellipses; what matters is HOW MANY are on screen at once, because the fight already
 * spends 92% of a 500 ms beat and ~48% of that is canvas blits (beat_budget_gate, 9/7).
 * Whether cover can become pictures at all is a number, not an opinion.
 *
 *   node tools/bohemia_combat_cover_probe_9_7_26.js
 */
'use strict';
const path = require('path');
const PERF = require(path.dirname(__dirname) + '/gates/bohemia_phone_perf.js');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const LOOK = `(() => {
  if (typeof G === 'undefined') return { err: 'no fight' };
  const all = [...document.querySelectorAll('canvas')];
  if (!all.length) return { err: 'no canvas' };
  const cv = all.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
  const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2;
  const ring = (typeof G.ring === 'number' && G.ring) ? G.ring : 44;
  const P = G.pillars || [];

  /* ON SCREEN IS THE ONLY COUNT THAT COSTS ANYTHING. fieldPos is what the draw loop
     itself uses, so this asks the same question the frame asks. */
  let onScreen = 0, tall = 0, low = 0, placed = 0, hardFalse = 0;
  const radii = [], spans = [];
  for (const p of P) {
    if (p.hard === false) hardFalse++;
    if (p.tall === false) low++; else tall++;
    if (p.placed) placed++;
    radii.push(p.r || 0);
    let px = null;
    try { px = fieldPos(p, W, H, cx, cy); } catch (e) {}
    if (px && px[0] > -ring && px[0] < W + ring && px[1] > -ring && px[1] < H + ring) onScreen++;
    /* the drawn block is s*1.1 wide where s = ring*0.62, so its footprint in TILES: */
    spans.push((ring * 0.62 * 1.1) / ring);
  }
  radii.sort((a, b) => a - b);
  const med = (a) => a.length ? a[(a.length / 2) | 0] : 0;

  /* WHAT IT IS DRAWN WITH, read off the paint the fight actually runs rather than off
     my memory of it. The three fill styles below are the whole picture of a cover
     piece today: a shadow, a body and a lid. */
  const src = (typeof fieldDraw === 'function') ? String(fieldDraw) : '';
  const colours = [...new Set((src.match(/#[0-9a-f]{6}/gi) || []))];
  const drawsImage = /drawImage/.test(src);

  return { W, H, ring, arena: G.arenaKind || 'street',
           teachBeat: !!G.teachBeat, cars: G._cars || 0,
           carCells: P.filter(p => p.car).length, burnt: P.filter(p => p.burnt).length,
           n: P.length, onScreen, tall, low, placed, hardFalse,
           rMin: radii[0] || 0, rMed: med(radii), rMax: radii[radii.length - 1] || 0,
           spanTiles: med(spans),
           bodyColour: '#6e604a', lidLow: '#7a94a8', lidTall: '#94836a',
           coverBank: (typeof COVER_B64 !== 'undefined') ? Object.keys(COVER_B64) : null,
           streetKinds: (typeof STREET_B64 !== 'undefined') ? Object.keys(STREET_B64).length : null };
})()`;

(async () => {
  const { chromium } = PERF.requirePlaywright();
  const { srv, port } = await PERF.startServer();
  const browser = await chromium.launch();
  let r = null;
  try {
    const ctx = await browser.newContext(PERF.PHONE);
    await ctx.addInitScript(PERF.WITNESS);
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    page.__cdp = cdp;
    await cdp.send('Performance.enable');
    await PERF.bootToPlay(page, 'http://127.0.0.1:' + port, PERF.PAGES.demo, () => {}, {});
    await PERF.awaitQuiet(cdp, 25000);
    const started = await page.evaluate(() => {
      try { cityEncounterIn({ packageId: 1, label: 'cover probe' }); return 'ok'; }
      catch (e) { return 'threw: ' + e.message; }
    });
    /* THE FIRST FIGHT IS THE LESSON AND IT HAS NO COVER BY DESIGN. V202 in the fight's
       own source: the street arena's cover branch is empty while G.teachBeat is set, and
       scatterCars is skipped beside it -- "a car is cover, and cover is a later lesson".
       The first run of this probe reported 0 pieces and 0 cars and that number was TRUE
       and about the WRONG FIGHT. G.teachBeat is consumed on entry (it reads G._teachReq
       and clears it), so a second encounter is a real arena. */
    if (started !== 'ok') { r = { err: 'the fight never started: ' + started }; }
    else {
      let cf = null;
      for (let i = 0; i < 300 && !cf; i++) {
        await sleep(100);
        const h = await page.$('#combatFrame');
        if (h) { const c = await h.contentFrame();
          if (c && (await c.evaluate(() => document.querySelectorAll('canvas').length).catch(() => 0)) > 0) cf = c; }
      }
      if (!cf) r = { err: 'the fight never showed a canvas' };
      else {
        await sleep(2500);
        const lesson = await cf.evaluate(LOOK).catch(e => ({ err: String(e) }));
        /* now a real one */
        await page.evaluate(() => {
          try { cityEncounterIn({ packageId: 2, label: 'cover probe, a real arena' }); } catch (e) {}
        });
        await sleep(3500);
        r = await cf.evaluate(LOOK).catch(e => ({ err: String(e) }));
        if (r && !r.err) r.lesson = lesson;
      }
    }
  } finally { await browser.close(); try { srv.close(); } catch (e) {} }

  if (!r || r.err) { console.log('PROBE FAILED: ' + (r && r.err)); process.exit(1); }
  console.log('\nWHAT IS THE FIGHT\'S COVER MADE OF?');
  if (r.lesson && !r.lesson.err)
    console.log('  (the FIRST fight, the lesson: ' + r.lesson.n + ' pieces, ' + r.lesson.cars +
                ' cars, teachBeat=' + r.lesson.teachBeat + ' -- V202 gives it no cover ON PURPOSE,\n' +
                '   so measuring that one and calling it the fight would have been the wrong fight.)');
  console.log('  arena "' + r.arena + '", teachBeat=' + r.teachBeat +
              ', canvas ' + r.W + 'x' + r.H + ', tile ' + r.ring + ' px');
  console.log('  street ground bank: ' + r.streetKinds + ' kinds');
  console.log('  a cover picture bank: ' + (r.coverBank ? r.coverBank.join(', ') : 'THERE IS NONE'));
  console.log('\n  HOW MANY PIECES');
  console.log('    in the arena      ' + String(r.n).padStart(4));
  console.log('    ON SCREEN AT ONCE ' + String(r.onScreen).padStart(4) + '   <- this is what a picture would cost per frame');
  console.log('    tall (no vault)   ' + String(r.tall).padStart(4));
  console.log('    low  (vaultable)  ' + String(r.low).padStart(4));
  console.log('    cars in the lot   ' + String(r.cars).padStart(4) + '   (' + r.carCells +
              ' of the pieces are car cells, ' + r.burnt + ' burnt)');
  console.log('\n  HOW BIG');
  console.log('    radius  min ' + r.rMin.toFixed(2) + '  median ' + r.rMed.toFixed(2) + '  max ' + r.rMax.toFixed(2) + ' tiles');
  console.log('    the drawn block is ' + r.spanTiles.toFixed(2) + ' tiles wide');
  console.log('\n  WHAT IT IS DRAWN WITH TODAY');
  console.log('    a shadow ellipse, a flat block ' + r.bodyColour + ', and a lid ellipse:');
  console.log('      ' + r.lidLow + '  = LOW, you may vault it');
  console.log('      ' + r.lidTall + '  = TALL, you may not');
  console.log('    *** THE VAULT STATE IS SIGNALLED BY LID COLOUR AND NOTHING ELSE. ***');
  console.log('    TG-07: "cover that only reads by its colour is not cover."');
})();
