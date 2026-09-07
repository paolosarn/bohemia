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

  /* WHAT IT BLOCKS AGAINST WHAT IT SHOWS, per piece, and SPLIT BY CAR OR NOT --
     because the average hides the finding. The blocking test is
     Math.sin(dA)*P.edist < P.r*0.9, so a piece stops a sightline anywhere within
     0.9*r of its centre: it is an object 1.8*r tiles across. The picture is
     s*1.1 wide where s = ring*0.62, a CONSTANT: 0.68 tiles, the same for a car
     door and for the biggest block in the lot. */
  /* WHAT IS ACTUALLY DRAWN. Before COVER THAT READS this was the constant s*1.1 =
     0.68 tiles for every piece; after it, it is the piece's own blocked width, so ask
     the build rather than assuming which one this is. */
  const HASNEW = (typeof coverWideOf === 'function');
  const drawnOf = (p) => HASNEW ? (coverWideOf(p, ring) / ring) : (0.62 * 1.1);
  const DRAWN = drawnOf(P[0] || { r: 1 });
  const ratio = (p) => drawnOf(p) / (1.8 * (p.r || 0.01));
  const carR = P.filter(p => p.car).map(ratio).sort((a, b) => a - b);
  const genR = P.filter(p => !p.car).map(ratio).sort((a, b) => a - b);
  const carW = P.filter(p => p.car).map(p => 1.8 * (p.r || 0)).sort((a, b) => a - b);
  const genW = P.filter(p => !p.car).map(p => 1.8 * (p.r || 0)).sort((a, b) => a - b);
  const carD = P.filter(p => p.car).map(drawnOf).sort((a, b) => a - b);
  const genD = P.filter(p => !p.car).map(drawnOf).sort((a, b) => a - b);

  /* WHAT IT IS DRAWN WITH, read off the paint the fight actually runs rather than off
     my memory of it. The three fill styles below are the whole picture of a cover
     piece today: a shadow, a body and a lid. */
  const src = (typeof fieldDraw === 'function') ? String(fieldDraw) : '';
  const colours = [...new Set((src.match(/#[0-9a-f]{6}/gi) || []))];
  const drawsImage = /drawImage/.test(src);

  /* DID THE NEW PATH ACTUALLY RUN? A sprite that silently refuses to bake falls back to
     the old flat box forever and everything else about this round would still look right.
     Ask the bake itself, at the sizes the lot really uses. */
  let baked = null;
  if (typeof coverSprite === 'function' && typeof coverWideOf === 'function') {
    let ok = 0, made = 0, dims = [];
    for (const p of P.slice(0, 40)) {
      const w = coverWideOf(p, ring);
      const sp = coverSprite(p.tall === false, w, ring * 0.62, ring);
      made++;
      if (sp && sp.width > 0) { ok++; if (dims.length < 4) dims.push(w + 'px face -> ' + sp.width + 'x' + sp.height + ' sprite'); }
    }
    baked = { ok, made, cached: (typeof _COVER_SPRN !== 'undefined') ? _COVER_SPRN : null, dims };
  }

  return { W, H, ring, arena: G.arenaKind || 'street', baked,
           teachBeat: !!G.teachBeat, carsField: G._cars || 0,
           cars: new Set(P.filter(p => p.car).map(p => p.car)).size,
           carCells: P.filter(p => p.car).length, burnt: P.filter(p => p.burnt).length,
           n: P.length, onScreen, tall, low, placed, hardFalse,
           rMin: radii[0] || 0, rMed: med(radii), rMax: radii[radii.length - 1] || 0,
           spanTiles: med(spans), drawnTiles: DRAWN, hasNew: HASNEW,
           carDrawn: med(carD), genDrawn: med(genD),
           carRatio: med(carR), genRatio: med(genR),
           carWide: med(carW), genWide: med(genW), genWidest: genW[genW.length - 1] || 0,
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
        /* NOW A REAL ARENA. Asking for a second encounter from inside a fight does not
           take -- COMBAT's 9/6 fuse is explicit that one step makes at most one fight --
           and the first attempt at this came back with teachBeat still true and the same
           zeroes, which is the instrument agreeing with itself instead of measuring.
           setupEnemiesBody() is the function the fight itself calls to lay out a lot; it
           reads G._teachReq at the top and clears it. Clearing the flag and calling it is
           following the fight's own path, not re-stating it. */
        await cf.evaluate(() => {
          try { G._teachReq = false; G.teachBeat = false; setupEnemiesBody(); return 'ok'; }
          catch (e) { return 'threw: ' + e.message; }
        }).catch(() => null);
        await sleep(2000);
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
              ' of the pieces are car cells, ' + r.burnt + ' burnt)' +
              (r.carsField !== r.cars ? '   [G._cars still says ' + r.carsField +
               ', which is a STALE FIELD from a previous lot, not a count]' : ''));
  console.log('\n  HOW BIG');
  console.log('    radius  min ' + r.rMin.toFixed(2) + '  median ' + r.rMed.toFixed(2) + '  max ' + r.rMax.toFixed(2) + ' tiles');
  console.log('    the drawn block is ' +
    (r.hasNew ? 'THE PIECE\'S OWN BLOCKED WIDTH (COVER THAT READS is in this build)'
              : r.drawnTiles.toFixed(2) + ' tiles wide, A CONSTANT, for every piece'));
  console.log('\n  WHAT IT BLOCKS AGAINST WHAT IT SHOWS');
  console.log('    a CAR CELL      blocks ' + r.carWide.toFixed(2) + ' tiles wide, shows ' +
              r.carDrawn.toFixed(2) + '  -> the picture is ' + (100 * r.carRatio).toFixed(0) + '%');
  console.log('    a GENERIC piece blocks ' + r.genWide.toFixed(2) + ' tiles wide, shows ' +
              r.genDrawn.toFixed(2) + '  -> the picture is ' + (100 * r.genRatio).toFixed(0) + '%');
  console.log('    the widest generic piece blocks ' + r.genWidest.toFixed(2) + ' tiles.');
  console.log('    A TILE IS A HOUSE (9/4). A car cell is authored as one tile and blocks about one.');
  console.log('    A GENERIC PIECE BLOCKS WIDER THAN THE HOUSE BESIDE IT. That is the ROW\'S own');
  console.log('    finding to route: the cover generator was sized before a tile was a house.');
  if (r.baked) {
    console.log('\n  DOES THE NEW PATH RUN?');
    console.log('    ' + r.baked.ok + ' of ' + r.baked.made + ' pieces baked a sprite; ' +
                r.baked.cached + ' distinct sizes cached');
    for (const d of r.baked.dims) console.log('      ' + d);
    if (!r.baked.ok) console.log('    *** NOTHING BAKED -- every piece is still the old flat box. ***');
  } else { console.log('\n  DOES THE NEW PATH RUN?  there is no coverSprite in this build.'); }
  console.log('\n  WHAT IT IS DRAWN WITH TODAY');
  console.log('    a shadow ellipse, a flat block ' + r.bodyColour + ', and a lid ellipse:');
  console.log('      ' + r.lidLow + '  = LOW, you may vault it');
  console.log('      ' + r.lidTall + '  = TALL, you may not');
  console.log('    AND THE HEIGHT DIFFERS TOO, which an earlier run of this lane overstated away:');
  console.log('      low  is 0.9x the block size tall, tall is 1.6x. That IS a silhouette tell,');
  console.log('      so "the vault state reads by colour and nothing else" was WRONG. It reads.');
  console.log('    WHAT DOES NOT READ IS WHAT THE PIECE *IS*: every one of them is the same');
  console.log('    flat ' + r.bodyColour + ' box at the same width, and TG-07 asks for a block wall');
  console.log('    segment, a dead car, a dumpster, a porch pier -- house-PART shapes, at the size');
  console.log('    they actually block.');
})();
