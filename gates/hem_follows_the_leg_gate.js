#!/usr/bin/env node
/* HEM FOLLOWS THE LEG GATE (9/15/26, CHARACTER lane, VAMILY [long coats])
 *
 * THE ROW: Paolo 9/7, the coat problem "will be the nature of any long jackets and coats".
 * The wardrobe now carries, for every garment that hangs below the hip, which leg segment
 * swings it, so ANIMATION's [coat follows] can move a duster with the stride instead of
 * freestyling.
 *
 * *** THE WHOLE POINT OF THIS GATE IS THAT THE TABLE IS GENERATED AND CAN GO STALE. ***
 * NOTHING IS BAKED ONCE. A hand-written list of long coats is right on the day it is typed
 * and wrong the first time COOK reshapes a garment, and nothing would say so -- a coat
 * would quietly stop following the leg and nobody would find out until he watched somebody
 * walk. So this re-renders EVERY canon garment on the real body, looks every changed pixel
 * up in the rig's own part grid, and compares the answer to what the wardrobe claims.
 *
 * IT CHECKS BOTH DIRECTIONS, and the second one is the one that matters:
 *   a garment the table calls a hem MUST actually reach the leg, and
 *   a garment the table is SILENT about MUST NOT reach the leg.
 * Only the first is obvious. Without the second, a new long coat ships with no entry, the
 * table is still "correct" about everything in it, and the coat freestyles -- which is
 * exactly the failure the row was opened for. An absence has to be an answer.
 *
 * AND IT NEVER TRUSTS A NAME. This lane's open row [names lie] exists because COPPER WORK
 * SHIRT renders green. Measured here: a name would have filed 36 garments wrong, in both
 * directions. Nothing in this file reads a garment's name for anything but identity.
 *
 * TWO RULERS THROWN AWAY BUILDING THIS, BOTH OF WHICH LOOKED LIKE CLEAN RESULTS:
 *  1. buildFrame returns {px, CW, CH, grid} and has no `w`, so `fr.w || 56` took the
 *     fallback on a frame that is 112 wide. Every row number came out of the wrong
 *     division and the split read 49 thigh / 54 shin -- a believable spread, entirely noise.
 *  2. Fixed the width and then compared the lowest CHANGED pixel, anywhere, against the
 *     knee. That judges a shirt by where its hem sits on the torso; trousers came out
 *     THIGH. 99 against 4, also believable, also wrong.
 * THE HEM IS THE LOWEST PIXEL ON A LEG. This gate measures that and nothing else.
 *
 *   node gates/hem_follows_the_leg_gate.js
 */
'use strict';
const path = require('path');
const fs = require('fs');
const REPO = path.dirname(__dirname);
const ALPHA = process.env.ALPHA || path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('\n=== HEM FOLLOWS THE LEG: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  const SRC = fs.readFileSync(ALPHA, 'utf8');
  ok('the table is GENERATED and says by what, so nobody hand-edits it',
     /tools\/bohemia_what_hangs_below_the_hip\.js/.test(SRC));
  ok('and it is stamped onto the garments, so a consumer asks the garment',
     /GARMENTS\[i\]\.hem = e\[0\]/.test(SRC));

  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 90000 });

  const R = await p.evaluate(() => {
    const o = { n: 0, hangs: 0, wrongSeg: [], claimedNotReal: [], realNotClaimed: [],
                driftedDrop: [], err: [], table: 0 };
    try { o.table = Object.keys(window.HEM_LEG || {}).length; } catch (e) {}
    const keepW = window.G_WORN, keepE = G.equipped;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    G.equipped = bare(); window.G_WORN = {}; clear();
    let base = null; try { base = buildFrame('S', 'idle', 0); } catch (e) { o.err.push('bare'); }
    if (!base) { window.G_WORN = keepW; G.equipped = keepE; clear(); return o; }
    const W = base.CW, H = base.CH;                 /* READ, never defaulted -- see the head */
    if (!W || !H) { o.err.push('no CW on the frame'); window.G_WORN = keepW; G.equipped = keepE; clear(); return o; }
    o.W = W; o.H = H;
    let hipY = 1e9, footBot = -1;
    for (let i = 0; i < base.grid.length; i++) {
      const gid = base.grid[i]; if (gid < 9 || gid > 12) continue;
      const y = (i / W) | 0; if (y < hipY) hipY = y; if (y > footBot) footBot = y;
    }
    o.hipY = hipY; o.footBot = footBot;
    const span = Math.max(1, footBot - hipY);
    const canon = GARMENTS.filter(g => g && g.st === 'canon' && g.layer);
    for (const gm of canon) {
      G.equipped = bare(); window.G_WORN = {}; window.G_WORN[gm.layer] = gm.n; clear();
      let fr; try { fr = buildFrame('S', 'idle', 0); } catch (e) { o.err.push(gm.n); continue; }
      o.n++;
      let lowestLeg = -1;
      for (let i = 0; i < fr.px.length; i++) {
        const a = fr.px[i], c = base.px[i];
        if ((!a && !c) || (a && c && a[0] === c[0] && a[1] === c[1] && a[2] === c[2])) continue;
        const gid = fr.grid[i] || base.grid[i] || 0;
        if (gid >= 9 && gid <= 12) { const y = (i / W) | 0; if (y > lowestLeg) lowestLeg = y; }
      }
      const isShoe = gm.layer === 'feet';
      const realHangs = lowestLeg >= 0 && !isShoe;
      const drop = lowestLeg < 0 ? null : +(((lowestLeg - hipY) / span).toFixed(3));
      const realSeg = !realHangs ? null : (drop <= 0.5 ? 'thigh' : 'shin');
      const claimed = (window.HEM_LEG || {})[gm.n] || null;
      if (realHangs) o.hangs++;
      if (claimed && !realHangs) o.claimedNotReal.push(gm.n);
      else if (!claimed && realHangs) o.realNotClaimed.push(gm.n + ' (' + realSeg + ')');
      else if (claimed && realHangs) {
        if (claimed[0] !== realSeg) o.wrongSeg.push(gm.n + ' says ' + claimed[0] + ', measures ' + realSeg);
        if (Math.abs(claimed[1] - drop) > 0.02) o.driftedDrop.push(gm.n + ' ' + claimed[1] + ' vs ' + drop);
      }
    }
    /* AND EVERY KEY IN THE TABLE NAMES A REAL CANON GARMENT. Found by mutation: filing a
       HAT as a hem was caught only by the total, because a key nobody matches is never
       compared to anything. A table that can hold a name the rail does not have is a table
       that can be quietly wrong about a garment that was renamed or killed. */
    const canonNames = {}; for (const gm of canon) canonNames[gm.n] = 1;
    o.ghosts = Object.keys(window.HEM_LEG || {}).filter(k => !canonNames[k]);
    window.G_WORN = keepW; G.equipped = keepE; clear();
    return o;
  });
  await b.close();

  ok('*** THE WALK RENDERED A WARDROBE TO MEASURE AT ALL *** -- every number below is '
     + 'meaningless over an empty one (' + R.n + ' canon garments rendered, frame '
     + R.W + 'x' + R.H + ')', R.n > 250 && R.W === 112);
  ok('and the rig gave up a hip and a sole to measure against (rows ' + R.hipY + ' to '
     + R.footBot + ')', R.hipY > 0 && R.footBot > R.hipY);
  ok('the wardrobe carries a hem table at all (' + R.table + ' entries)', R.table > 0);
  ok('*** EVERY GARMENT THE TABLE CALLS A HEM REALLY REACHES THE LEG *** ('
     + R.claimedNotReal.length + ' claimed and do not'
     + (R.claimedNotReal.length ? ': ' + R.claimedNotReal.slice(0, 5).join(', ') : '') + ')',
     R.claimedNotReal.length === 0);
  ok('*** AND EVERY GARMENT THAT REACHES THE LEG IS IN THE TABLE *** -- this is the half '
     + 'that catches a NEW long coat shipping with no entry, which is the failure the row '
     + 'was opened for (' + R.realNotClaimed.length + ' missing'
     + (R.realNotClaimed.length ? ': ' + R.realNotClaimed.slice(0, 5).join(', ') : '') + ')',
     R.realNotClaimed.length === 0);
  ok('and the segment the table names is the segment the pixels measure ('
     + R.wrongSeg.length + ' disagree'
     + (R.wrongSeg.length ? ': ' + R.wrongSeg.slice(0, 4).join('; ') : '') + ')',
     R.wrongSeg.length === 0);
  ok('and how far down the leg each hem sits has not drifted by more than 2% ('
     + R.driftedDrop.length + ' drifted'
     + (R.driftedDrop.length ? ': ' + R.driftedDrop.slice(0, 4).join('; ') : '') + ')',
     R.driftedDrop.length === 0);
  ok('and every name in the table is a garment that is actually on the canon rail ('
     + (R.ghosts || []).length + ' ghosts'
     + ((R.ghosts || []).length ? ': ' + R.ghosts.slice(0, 5).join(', ') : '') + ')',
     (R.ghosts || []).length === 0);
  ok('and the count of measured hems matches the size of the table (' + R.hangs + ' against '
     + R.table + ')', R.hangs === R.table);

  if (R.err.length) console.log('  note: ' + R.err.length + ' did not render -- ' + R.err.slice(0, 3).join(', '));
  if (errs.length) console.log('  note: page errors -- ' + errs.slice(0, 2).join(' | '));
  console.log('\n  ' + R.n + ' canon garments, ' + R.hangs + ' hang below the hip, table holds ' + R.table);
  done();
})();
