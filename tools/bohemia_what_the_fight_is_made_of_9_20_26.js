/* ============================================================================
   WHAT THE FIGHT IS MADE OF  (COOK, 9/20/26, rule 18(b) measurement round)

   RULE 17 asks for ONE PICTURE: the street he stands on beside the fight that
   starts there, on the deployed cut, at phone size. RULE 14(g) says there is
   ONE DRIVER and every lane uses it or extends it, so this is a CALLER of
   tools/bohemia_drive_the_demo.js and adds no second instrument.

   IT TAKES TWO ROUTES ON PURPOSE:
     1. THE GLASS  -- boot the demo, photograph the street, call the game's own
        startColdOpen (the first fight in the game, the same call the run makes),
        show the combat panel, photograph the fight. Nothing is assigned; the
        only two things touched are functions the game calls itself.
     2. THE BYTES  -- decode COMBAT_B64 out of the cut and read the fight's own
        art tables, because a screenshot cannot tell you WHERE a tile came from
        and that is the whole finding.

   WHY BOTH: this lane has now been wrong seven times by measuring cleanly from
   the wrong table. A picture caught what numbers could not (the roof laid flat
   as a floor); numbers caught what the picture could not (the road is the
   PRE-RECOOK street, byte for byte).

   USE IT:  node tools/bohemia_what_the_fight_is_made_of_9_20_26.js [outdir]
   ========================================================================== */
'use strict';
const D = require('./bohemia_drive_the_demo.js');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2] || '/tmp/fightshot';
const w = (p, ms) => p.waitForTimeout(ms);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await D.open({ file: 'BOHEMIA_DEMO.html' });
  const P = d.page;

  console.log('ON FOOT:', JSON.stringify(await d.state()));
  await d.shot(path.join(OUT, 'A_STREET.png'));

  /* THE GAME'S OWN DOOR. startColdOpen is what a quest step calls for the first
     fight; showTabPanel is what the tab strip calls. Neither is a variable the
     render loop recomputes, which is the trap the driver's header names. */
  console.log('cold open ->', await P.evaluate(() => {
    try { startColdOpen(() => {}); return 'ok'; } catch (e) { return 'ERR ' + e.message; } }));
  await w(P, 9000);
  console.log('show panel ->', await P.evaluate(() => {
    try { showTabPanel('combat'); return 'ok'; } catch (e) { return 'ERR ' + e.message; } }));
  await w(P, 6000);

  const h = await P.$('#combatFrame');
  if (!h) { console.log('NO FIGHT FRAME'); await d.close(); return; }
  const box = await h.boundingBox();
  const cf = await h.contentFrame();
  await P.screenshot({ path: path.join(OUT, 'B_FIGHT.png'), clip: box });

  const f = await cf.evaluate(() => {
    const W = innerWidth, H = innerHeight;
    const T = Math.max(26, Math.min(W, H) / 12);   /* drawFloor's own line */
    const o = {
      screen: W + 'x' + H,
      faction: FAC().n, motif: FAC().motif, base: FAC().base, line: FAC().line, acc: FAC().acc,
      arena: G.arenaKind, phase: G.phase,
      /* TWO GRIDS ON ONE SCREEN: the faction floor's lines, and the tile size */
      factionGridPx: +T.toFixed(2),
      factionGridLines: Math.ceil((W + T) / T) + Math.ceil((H + T) / T),
      streetTilePx: (typeof _stCacheT !== 'undefined') ? _stCacheT : null,
      streetReady: (typeof STREET_READY !== 'undefined') ? STREET_READY : null,
      /* WHAT THE FIGHT'S OWN TABLE HOLDS, AFTER THE FOUR OF THEM HAVE OVERWRITTEN
         EACH OTHER. The four source tables are `const` in the document's own
         scope and are NOT reachable from here -- a probe for them comes back
         empty, and an empty probe that reads like a fact is the trap this lane
         has fallen into seven times. So it says so, and the RESOLVED table
         below (which IS reachable, and is what actually draws) is the number
         that counts. Read the four source tables out of the decoded document
         instead; the record for this round shows how. */
      sourceTablesReachableFromHere: false,
      groundKinds: Object.keys(STREET_B64).map(k => k + ':' + STREET_B64[k].length).join(' '),
      groundImages: Object.keys(STREET_B64).reduce((n, k) => n + STREET_B64[k].length, 0)
    };
    const tb = document.getElementById('topbar');
    if (tb) { const r = tb.getBoundingClientRect(); o.topbarPct = +(100 * r.height / H).toFixed(1); }
    return o; });
  console.log('FIGHT:', JSON.stringify(f, null, 1));

  /* A 44px TILE AT A FRACTIONAL SIZE BREAKS ITS OWN PIXEL GRID. Same arithmetic
     the canvas does with smoothing off; no guessing. */
  const rows = {};
  for (let dst = 0; dst < f.streetTilePx; dst++) {
    const s = Math.floor(dst * 44 / f.streetTilePx); rows[s] = (rows[s] || 0) + 1; }
  const hist = {};
  for (const k in rows) hist[rows[k]] = (hist[rows[k]] || 0) + 1;
  console.log('A 44px TILE AT ' + f.streetTilePx + 'px: source rows repeated ' + JSON.stringify(hist)
    + '  (scale ' + (f.streetTilePx / 44).toFixed(3) + ')');

  console.log('ERRS:', d.errs.slice(0, 4));
  await d.close();
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
