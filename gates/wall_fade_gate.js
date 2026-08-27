#!/usr/bin/env node
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* THE WALL FADE GATE (8/26/26, WORLD lane) — A WALL NEVER SNAPS.
 *
 * Paolo 8/25, PLAYTEST DISPATCH item 1:
 *   "WTF IS GOING ON HERE WITH THE SOUTH PART OF THE BUILDING THE WALL CHANGES I HOPE
 *    THATS NOT FOR ME WHEN IM SUPPOSED TO BE BEHIND A WALL FACING THE CAMERA AND ITS
 *    SUPPOSED TO BE THE WALL OPCAICITY"
 *
 * *** THE DISPATCH READ THAT WRONG AND THIS GATE IS PARTLY HERE TO KEEP THE RECORD
 * STRAIGHT. *** It was filed as two items: "(a) a flicker bug" and "(b) THERE IS NO
 * WALL-OPACITY SYSTEM IN THIS BUILD. I checked. He believes we have it. WE DO NOT."
 * WE DO. __XRAY_WHOLE_BUILDING__ has been on the walked surface since 8/3, on his own
 * ruling ("the building should become see through", "absolutely transparent"), and
 * MEASURED on the real page it fires on 60 of 60 trials standing behind a wall in the
 * district he spawns in. He was never reporting a missing feature — his own sentence says
 * what he thought it was ("ITS SUPPOSED TO BE THE WALL OPACITY"). He was reporting that it
 * LOOKED WRONG. A session that "checked" and found nothing checked the wrong thing, and
 * then a lane was told to build something that already existed.
 *
 * WHAT WAS ACTUALLY WRONG, measured by walking him 24 tiles past his own house and
 * recording every wall cell's alpha at each step: *** A WALL CROSSED 0.65 OF ALPHA IN ONE
 * FOOTSTEP. *** All three fade rules were binary — 1, or WALL_SEE, or XRAY_A, chosen fresh
 * each frame with nothing in between — so walking one tile could take a wall from solid to
 * a third opacity instantly. A hard step in opacity as you walk IS a flicker. There is no
 * other way for it to read, and no amount of looking at the fade rules finds it, because
 * each of the three is individually correct.
 *
 * WHAT THIS HOLDS:
 *   - the fade EXISTS and fires where he walks, so nobody files it as missing again
 *   - *** NOTHING SNAPS: no single frame may move a wall more than a bounded amount ***,
 *     which is asserted by walking the real page and diffing frame to frame
 *   - it opens on APPROACH, over metres, not at the last step (the research says the same:
 *     Project Zomboid shipped a hard cutaway and its own players called it worse than the
 *     blacked-out rooms it replaced)
 *   - a faded wall is GLASS, NOT A HOLE — there is still a wall there
 *   - THE DOOR STAYS SOLID, which is his 8/3 ruling and easy to lose in a rewrite
 *   - and a MUTATION: take the ease out and this gate must go red, or it is measuring
 *     nothing.
 *
 *   node gates/wall_fade_gate.js
 */
const path = require('path');
const ROOT = path.dirname(__dirname);
const PAGE = 'slices/BOHEMIA_CITY_WORLD.html';
let pass = 0, fail = 0;
function ok(what, cond) {
  if (cond) { pass++; console.log('  ok   ' + what); }
  else { fail++; console.log('  FAIL ' + what); }
}
function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'])
    { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

/* THE CEILING. XRAY_LERP is 0.22 and the widest a target can ever move is 1 - XRAY_A =
   0.78, so the largest first-frame step the ease can produce is 0.78 * 0.22 = 0.172.
   Anything above that means something bypassed the ease. Held a hair over it. */
const MAX_STEP = 0.18;

(async () => {
  console.log('THE WALL FADE — it exists, and nothing about it snaps\n');
  let browser;
  try {
    const { chromium } = requirePlaywright();
    browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
    await p.goto('file://' + path.join(ROOT, PAGE));
    await SETTLE(p, 5000);

    const base = await p.evaluate(() => ({
      has: typeof xrayHas === 'function' && typeof xrayFootprint === 'function',
      ramp: typeof xrayTarget === 'function',
      ease: typeof xrayEase === 'function',
      R: typeof XRAY_R !== 'undefined' ? XRAY_R : null,
      A: typeof XRAY_A !== 'undefined' ? XRAY_A : null,
      IN: typeof XRAY_IN !== 'undefined' ? XRAY_IN : null,
      LERP: typeof XRAY_LERP !== 'undefined' ? XRAY_LERP : null,
      SEE: typeof WALL_SEE !== 'undefined' ? WALL_SEE : null
    }));
    ok('THE WALL-OPACITY SYSTEM EXISTS — it has since 8/3 and the 8/25 dispatch said it ' +
       'did not; this check is here so nobody files it missing a third time',
       base.has);
    ok('it has a RAMP IN SPACE (xrayTarget) and an EASE IN TIME (xrayEase) — the two ' +
       'independent halves of not snapping', base.ramp && base.ease);
    ok('it opens on APPROACH rather than at the last step (radius ' + base.R +
       ' tiles = ' + (base.R * 0.75).toFixed(1) + ' m, fully open inside ' + base.IN + ')',
       base.R >= 4 && base.IN < base.R);
    ok('and a faded wall is GLASS, NOT A HOLE — there is still a wall there (floor ' +
       base.A + ')', base.A >= 0.18 && base.A < 0.5);

    /* IT FIRES WHERE HE WALKS. The claim the dispatch got wrong, measured rather than
       believed: stand him behind a wall, in his own district, and ask. */
    const fires = await p.evaluate(() => {
      const sx = hx, sy = hy, R = 3 * FN;
      let trials = 0, fired = 0;
      for (let gy = sy - R; gy < sy + R && trials < 60; gy++)
        for (let gx = sx - R; gx < sx + R && trials < 60; gx++) {
          const d = (om.at((gx / FN) | 0, (gy / FN) | 0) || {}).district;
          if (d !== 'suburb') continue;
          const here = cellAt(gx, gy); if (!(here && here.walk)) continue;
          const south = cellAt(gx, gy + 1); if (!(south && !south.walk)) continue;
          hx = gx; hy = gy; XRAY_FP_K = '';
          let f = false;
          try { f = !!xrayFootprint() && xrayHas(gx, gy + 1); } catch (e) {}
          trials++; if (f) fired++;
        }
      hx = sx; hy = sy; XRAY_FP_K = '';
      return { trials: trials, fired: fired };
    });
    ok('standing behind a wall in the district he SPAWNS in, the building really does go ' +
       'see-through (' + fires.fired + ' of ' + fires.trials + ' trials)',
       fires.trials >= 20 && fires.fired === fires.trials);

    /* *** NOTHING SNAPS. *** Walk him and diff the drawn alpha frame to frame. */
    const walkProbe = `(function(frames,useEase){
      function alphaAt(gx,gy){
        let a=1;
        if(xrayHas(gx,gy)) a=Math.min(a,xrayTarget());
        else { const dd=Math.max(Math.abs(gx-hx),Math.abs(gy-hy));
          if(dd<=XRAY_R){ const t=dd<=XRAY_IN?1:(XRAY_R-dd)/(XRAY_R-XRAY_IN);
            a=1-t*(1-WALL_SEE); } }
        return useEase===false ? a : xrayEase(gx+','+gy,a);
      }
      const sx=hx, sy=hy, R=12;
      let prev=null, biggest=0, moved=0, where='';
      for(let s=0;s<28;s++){
        hy=sy-14+s; XRAY_FP_K='';
        for(let f=0;f<frames;f++){
          const now={};
          for(let gy=sy-R;gy<=sy+R;gy++)for(let gx=sx-R;gx<=sx+R;gx++){
            const c=cellAt(gx,gy); if(!c||c.walk)continue;
            now[gx+','+gy]=alphaAt(gx,gy);
          }
          if(prev) for(const k in now){
            if(!(k in prev))continue;
            const d=Math.abs(now[k]-prev[k]);
            if(d>0.01) moved++;
            if(d>biggest){ biggest=d; where=k; }
          }
          prev=now;
        }
      }
      hx=sx; hy=sy; XRAY_FP_K='';
      return {biggest:+biggest.toFixed(3), moved:moved, where:where};
    })`;
    const walk = await p.evaluate(walkProbe + '(6,true)');
    console.log('       walked 28 tiles past his own house at 6 frames a tile; ' +
                walk.moved + ' wall-cell alpha changes seen');
    ok('*** NOTHING SNAPS: the largest opacity change any wall makes in one frame is ' +
       walk.biggest + ', ceiling ' + MAX_STEP + ' *** (it was 0.65 before this, at one ' +
       'frame per tile — solid to a third opacity between two footsteps, which is the ' +
       'flicker he filed)', walk.biggest <= MAX_STEP);
    ok('and the fade is really MOVING, not frozen solid — a check that nothing changes ' +
       'would also pass on a build with no fade at all (' + walk.moved + ' changes)',
       walk.moved > 50);

    /* THE MUTATION. Everything above is equally true of a page where xrayEase returns its
       target untouched, which is exactly the pre-fix behaviour. So take the ease out. */
    /* THE MUTATION, AND HOW IT IS DONE MATTERS. The first version reassigned the page's
       xrayEase and measured again -- and it did not discriminate (0.186 against a 0.18
       ceiling), because the reassignment never took: a top-level function declaration in
       this page is not reachable that way from inside an evaluate wrapper, so the probe
       kept calling the real easer and I was one rounding error away from shipping a green
       mutation test that mutated NOTHING. That is the worst possible kind of green, so it
       is written down rather than quietly fixed.
       What it does now is honest about its own scope: the probe MIRRORS the draw rule, and
       the mutation turns the ease off IN THE MIRROR. It proves the measurement would catch
       an un-eased build; it does not claim to have rebound the page. The claim that the
       page really eases is carried by the ramp/ease existence checks above and by the
       measured 0.11 against a target spread of 0.65. */
    const mut = await p.evaluate(walkProbe + '(1,false)').then(
      r => ({ ran: true, biggest: r.biggest }), e => ({ ran: false, why: String(e).slice(0, 80) }));
    if (mut.ran) {
      ok('THE MUTATION TEST: run the same walk with the ease turned OFF and it snaps ' +
         'again (' + mut.biggest + ' > ' + MAX_STEP + ') — so the ceiling above is a real ' +
         'constraint and not a number every build passes', mut.biggest > MAX_STEP);
    } else {
      /* a const binding cannot be reassigned; say so rather than claiming a pass */
      console.log('       mutation could not rebind the easer (' + mut.why + ')');
      ok('THE MUTATION TEST could not run, and a gate that cannot be attacked is not ' +
         'trusted — this must be fixed rather than skipped', false);
    }

    /* HIS 8/3 RULING, easy to lose in a rewrite of the alpha block. */
    const src = await p.evaluate(() => {
      const s = document.documentElement.innerHTML;
      return { door: /__XRAY_DOOR_STAYS__/.test(s) };
    });
    ok('THE DOOR STILL DOES NOT FADE WITH ITS WALL — he ruled the transparency exists to ' +
       'show "characters items or the player or DOORS", and a door that vanishes with the ' +
       'wall means you see through a building and still cannot find the way in',
       src.door);

    ok('the page threw nothing while all of this ran', errs.length === 0);
    if (errs.length) errs.slice(0, 3).forEach(e => console.log('       ' + e));
  } catch (e) {
    fail++; console.log('  FAIL harness: ' + (e && e.message ? e.message : String(e)));
  } finally { if (browser) await browser.close(); }

  console.log('\n' + (fail ? 'FAIL' : 'PASS') + '  ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
