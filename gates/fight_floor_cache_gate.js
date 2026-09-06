#!/usr/bin/env node
/* __BOHEMIA_SOLO__
 * FIGHT FLOOR CACHE GATE -- ONE FRAME, BOTH WAYS, COMPARED PIXEL FOR PIXEL.
 * (9/6/26, PLUMBER lane, VAMILY row [fight headroom] THE-FIGHT-HAS-NO-HEADROOM)
 *
 * WHAT LAW THIS ENFORCES: the 120 BPM law, at the only place it is currently
 * broken -- a fighting beat spends 497.5 of its 500 ms. The floor cache is the
 * change that buys the headroom back, and this is the checker that says the
 * picture did not move while it did.
 *
 * WHY IT IS SHAPED LIKE THIS, AND IT IS THE WHOLE POINT OF THE ROUND. The
 * obvious check is a before-and-after screenshot across two trees. That check
 * CANNOT WORK HERE and this lane measured why: gates/bohemia_fight_pixels.js
 * fingerprinted the same unchanged fight across three boots and the distance
 * between them was 44.74. A FIGHT DOES NOT REPEAT ACROSS BOOTS, so any
 * difference the cache made would be buried under the difference the fight
 * makes by itself.
 * So the comparison happens INSIDE ONE FRAME. One boot, one fight, one
 * synchronous block of JavaScript, the same camera and the same G: the floor is
 * composed BOTH WAYS into two canvases and the two canvases are compared to
 * each other. Session-to-session variance cannot enter, because there is only
 * one session.
 *
 * WHAT WOULD MAKE IT RED:
 *   - one channel of one pixel differing between the cached and uncached floor
 *   - the cache not actually engaging (a hit must make exactly ONE draw call)
 *   - the uncached path not actually drawing the floor (the anti-silent-pass
 *     floor: fewer than 500 tile calls, or a blank canvas, means the probe
 *     measured nothing and a pass would be a lie)
 *   - the trailing context state differing, which code after the floor reads
 *   - the cache being SLOWER than the path it replaces
 */
const path = require('path');
const PERF = require(path.join(__dirname, 'bohemia_phone_perf.js'));
const sleep = ms => new Promise(r => setTimeout(r, ms));

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('  ok   ' + m); }
                       else { fail++; console.log('  FAIL ' + m); } };

/* Everything below runs SYNCHRONOUSLY in the fight's own realm, so the game's
   animation frame cannot interleave and change the world between the arms. */
const BOTH_WAYS = `(() => {
  if (typeof fieldFloor !== 'function' || typeof fieldFloorPaint !== 'function')
    return { ok:false, why:'the floor was never extracted -- fieldFloor is missing' };
  const cv2 = document.getElementById('cv');
  if (!cv2 || !cv2.width) return { ok:false, why:'no #cv' };
  const W = cv2.width, H = cv2.height;
  const ring = Math.min(W,H) * fieldPitch(W,H);
  const aimP = (G.phase === 'aim' || !!G.ks);
  const cx = aimP ? W*0.42 : W/2, cy = aimP ? H*0.46 : H*0.56;

  const mk = () => { const k = document.createElement('canvas'); k.width=W; k.height=H;
                     return k; };
  /* THE DESTINATION IS SET UP THE WAY draw() SETS IT UP, using the game's own
     fieldFloorCam. Rebuilding the camera by hand here would be measuring a
     camera the game never uses, and copying its matrix would be measuring a
     DIFFERENT camera: setTransform(getTransform()) rasterises the same floor
     29,610 channels away from the ops that made it. */
  if (typeof fieldFloorCam !== 'function')
    return { ok:false, why:'fieldFloorCam is missing -- the cache cannot replay the camera' };
  const setCam = q => fieldFloorCam(q, W, H);

  /* count real draw calls, so "it passed" can never mean "it drew nothing" */
  const proto = CanvasRenderingContext2D.prototype;
  const realDI = proto.drawImage;
  let calls = 0;
  const count = on => { proto.drawImage = on
    ? function(){ calls++; return realDI.apply(this, arguments); } : realDI; };

  const run = (noCache) => {
    const k = mk(), q = k.getContext('2d');
    setCam(q);
    calls = 0; count(true);
    fieldFloor(q, W, H, cx, cy, undefined, ring, noCache, fieldFloorCam);
    count(false);
    const st = { f:String(q.fillStyle), s:String(q.strokeStyle), w:q.lineWidth,
                 c:q.lineCap, j:q.lineJoin };
    q.setTransform(1,0,0,1,0,0);
    return { cv:k, data:q.getImageData(0,0,W,H).data, calls:calls, state:st };
  };

  /* A COLD CACHE, so every arm below is ours and none of it is left over from
     the frames the game itself just drew. Cold, the first call BUILDS (it paints
     the floor into the cache canvas and blits it) and every call after it HITS. */
  _FLK = null;
  const B0 = run(false);       /* cold: the cache BUILDS here */
  const B1 = run(false);       /* and must HIT here */
  const B2 = run(false);       /* and keep hitting */
  const A  = run(true);        /* the original path, untouched */

  const diff = (p, q) => { let n=0, max=0;
    for (let i=0;i<p.length;i++){ const d=Math.abs(p[i]-q[i]); if(d){n++; if(d>max)max=d;} }
    return { n:n, max:max }; };
  const dB0 = diff(A.data, B0.data), dB1 = diff(A.data, B1.data), dB2 = diff(A.data, B2.data);

  /* ink: how much of the canvas the floor actually painted. A blank arm that
     matches another blank arm is the silent pass this floor exists to stop. */
  let ink = 0;
  for (let i=3;i<A.data.length;i+=4) if (A.data[i] > 8) ink++;

  /* and what it costs, both ways, in this same frame */
  const dst = mk(), dx = dst.getContext('2d');
  const time = (noCache, reps) => { const o=[];
    for (let i=0;i<reps;i++){ setCam(dx); dx.setTransform(1,0,0,1,0,0);
      dx.clearRect(0,0,W,H); setCam(dx);
      const t0 = performance.now();
      fieldFloor(dx, W, H, cx, cy, undefined, ring, noCache, fieldFloorCam);
      try { dx.getImageData(0,0,1,1); } catch(e){}
      o.push(performance.now()-t0); }
    o.sort((a,b)=>a-b); return +o[o.length>>1].toFixed(3); };
  const msUncached = time(true, 21);
  const msCached   = time(false, 21);

  return { ok:true, W:W, H:H, zoom:+uzEff().toFixed(5), phase:G.phase,
           pixels:W*H, channels:A.data.length, inkPct:+(100*ink/(W*H)).toFixed(1),
           callsUncached:A.calls, callsFirst:B0.calls, callsBuild:B1.calls, callsHit:B2.calls,
           diffFirst:dB0, diffBuild:dB1, diffHit:dB2,
           stateA:A.state, stateB:B2.state,
           msUncached:msUncached, msCached:msCached };
})()`;

async function main() {
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
      try { cityEncounterIn({ packageId: 1, label: 'floor cache proof' }); return 'ok'; }
      catch (e) { return 'threw: ' + e.message; }
    });
    if (started !== 'ok') { r = { ok: false, why: 'the fight never started: ' + started }; }
    else {
      let cf = null;
      for (let i = 0; i < 300 && !cf; i++) {
        await sleep(100);
        const h = await page.$('#combatFrame');
        if (h) { const c = await h.contentFrame();
          if (c && (await c.evaluate(() => document.querySelectorAll('canvas').length).catch(() => 0)) > 0) cf = c; }
      }
      if (!cf) r = { ok: false, why: 'the fight never showed a canvas' };
      else {
        for (let i = 0; i < 200; i++) {
          await sleep(100);
          const s = await cf.evaluate(() => (typeof G !== 'undefined' && G)
            ? { phase: G.phase, over: !!G.over, ks: !!G.ks } : null).catch(() => null);
          if (s && s.phase === 'cover' && !s.over && !s.ks) break;
        }
        /* let the camera ease settle so the arms share one steady world */
        let last = null;
        for (let i = 0; i < 60; i++) {
          await sleep(150);
          const z = await cf.evaluate(() => (typeof G !== 'undefined' && G && G._uzE != null)
            ? +G._uzE.toFixed(4) : null).catch(() => null);
          if (z != null && z === last) break;
          last = z;
        }
        r = await cf.evaluate(BOTH_WAYS).catch(e => ({ ok: false, why: String(e) }));
      }
    }
  } finally { await browser.close(); srv.close(); }

  console.log('\nTHE FIGHT FLOOR, COMPOSED BOTH WAYS INSIDE ONE FRAME');
  if (!r || !r.ok) {
    console.log('  the probe could not run: ' + ((r && r.why) || 'no result'));
    ok(false, 'the both-ways comparison ran at all');
  } else {
    console.log('    canvas ' + r.W + ' x ' + r.H + ', camera zoom ' + r.zoom + ', phase ' + r.phase);
    console.log('    the floor covers ' + r.inkPct + '% of the canvas');
    console.log('    draw calls   uncached ' + r.callsUncached
      + '   cold build ' + r.callsFirst
      + '   hit ' + r.callsBuild + '   hit again ' + r.callsHit);
    console.log('    channels differing   build ' + r.diffBuild.n + ' (max ' + r.diffBuild.max
      + ')   hit ' + r.diffHit.n + ' (max ' + r.diffHit.max + ')   of ' + r.channels);
    console.log('    one floor costs   uncached ' + r.msUncached + ' ms   cached ' + r.msCached + ' ms');

    ok(true, 'the both-ways comparison ran at all');
    /* ANTI-SILENT-PASS FLOORS FIRST: an empty probe must never read green */
    ok(r.callsUncached > 500,
      'the uncached floor really drew a floor (' + r.callsUncached + ' calls, floor 500)');
    ok(r.inkPct > 40, 'the floor really covers the canvas (' + r.inkPct + '%, floor 40%)');
    ok(r.channels > 1000000, 'the comparison really read the pixels (' + r.channels + ' channels)');
    /* THE CACHE MUST ACTUALLY BE A CACHE */
    ok(r.callsFirst === r.callsUncached + 1,
      'a cache MISS paints the same floor and blits it once (' + r.callsFirst
      + ' = ' + r.callsUncached + ' + 1). It builds on EVERY miss on purpose: waiting for a '
      + 'key to repeat saved JavaScript and cost the BEAT, 498 ms against 419.5, because a '
      + 'beat is mostly raster');
    ok(r.diffFirst.n === 0, 'the freshly BUILT floor is pixel-identical to the old path ('
      + r.diffFirst.n + ' channels differ)');
    ok(r.callsBuild === 1, 'the next frame HITS, exactly one draw call (' + r.callsBuild + ')');
    ok(r.callsHit === 1, 'and it keeps hitting (' + r.callsHit + ')');
    /* AND THE PICTURE MUST NOT MOVE */
    ok(r.diffBuild.n === 0, 'the first cached floor is pixel-identical to the old path ('
      + r.diffBuild.n + ' channels differ)');
    ok(r.diffHit.n === 0, 'the CACHED floor is pixel-identical to the old path ('
      + r.diffHit.n + ' channels differ)');
    ok(r.diffHit.max === 0, 'not one channel is off by even 1 (max ' + r.diffHit.max + ')');
    /* THE LEFTOVERS CODE AFTER THE FLOOR READS */
    ok(r.stateA.f === r.stateB.f, 'trailing fillStyle matches (' + r.stateA.f + ')');
    ok(r.stateA.s === r.stateB.s, 'trailing strokeStyle matches (' + r.stateA.s + ')');
    ok(r.stateA.w === r.stateB.w, 'trailing lineWidth matches (' + r.stateA.w + ')');
    ok(r.stateA.c === r.stateB.c, 'trailing lineCap matches (' + r.stateA.c + ')');
    ok(r.stateA.j === r.stateB.j, 'trailing lineJoin matches (' + r.stateA.j + ')');
    /* AND IT HAS TO BE FASTER, OR IT IS ONLY COMPLEXITY */
    ok(r.msCached < r.msUncached,
      'the cached floor is faster than the floor it replaces ('
      + r.msCached + ' ms vs ' + r.msUncached + ' ms)');
    const saved = r.msUncached - r.msCached;
    console.log('\n    SAVED PER FRAME: ' + saved.toFixed(3) + ' ms  ('
      + (100 * saved / Math.max(0.001, r.msUncached)).toFixed(1) + '% of the floor)');
  }

  console.log('\n=== FIGHT FLOOR CACHE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
}

main().catch(e => { console.log('  FAIL the gate itself threw: ' + e.message);
                    console.log('\n=== FIGHT FLOOR CACHE GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ===');
                    process.exit(1); });
