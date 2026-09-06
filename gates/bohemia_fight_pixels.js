#!/usr/bin/env node
/* ============================================================================
   BOHEMIA FIGHT PIXELS — CAN WE PROVE A FIGHT STILL LOOKS THE SAME?
   (9/6/26, PLUMBER lane, VAMILY row [fight headroom])

   THE MISSING INSTRUMENT, NAMED BY THE ROUND THAT NEEDED IT. The fight spends
   2,504 drawImage calls a frame and 99.9% of them are one 24x24 street tile, so
   the fix is to compose that floor once instead of per cell. That change is a
   SILENTLY WRONG PICTURE if it is wrong, not a crash -- and this lane could
   measure a fight but not SEE one. No screenshot pass on the fight exists;
   EYES AND EARS has not built one. Shipping renderer surgery into the surface
   the 120 BPM law governs, unable to look at it, is not a trade worth making.

   So this is the eye: boot the demo, walk into a fight through the real door,
   let it reach a named state, and fingerprint the fight canvas. Run it on two
   trees and the pictures either match or they do not.

   THE HARD PART IS NOT THE SCREENSHOT, IT IS WHETHER A FIGHT REPEATS AT ALL.
   A fight has a clock, a beat, enemies that act and a camera that eases. If the
   same tree gives two different pictures, then a difference after a change
   proves nothing, and this tool has to say so rather than hand somebody a false
   verdict. So it takes SEVERAL samples on ONE tree first and reports how much
   the fight varies with nothing changed. That number is the noise floor, and any
   real comparison has to clear it.

     node gates/bohemia_fight_pixels.js            # 3 samples, report the spread
     node gates/bohemia_fight_pixels.js --n 5      # more samples
     node gates/bohemia_fight_pixels.js --save DIR # write the PNGs too
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const PERF = require(path.join(__dirname, 'bohemia_phone_perf.js'));
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* THE FINGERPRINT IS A GRID OF AVERAGES, NOT A HASH OF EVERY BYTE. A byte hash
   answers "identical or not" and nothing else, so one stray antialiased pixel
   reads the same as a floor that vanished. A coarse grid of channel averages
   gives a DISTANCE, which is what a noise floor needs to be expressed in. */
/* PICK THE FIGHT CANVAS BY NAME, AND THE FIRST DRAFT OF THIS DID NOT.
   querySelector('canvas') returned a 183x54 LOGO -- the fight frame holds three
   canvases and the field is the third. The tool then reported a noise floor of
   EXACTLY ZERO across three boots whose camera zoom was visibly different
   (1.0735, 1.0209, 1.3), which is not a stable fight, it is a photograph of a
   logo. That is the silent pass this file's own header warns about, caught by
   asking why a number was too good rather than by being pleased with it.
   The field is #cv. It is also the only canvas with a client size, so the
   fallback picks the largest ON-SCREEN one rather than the first in the DOM. */
const FINGERPRINT = `(() => {
  let c = document.getElementById('cv');
  if (!c || !c.width) {
    const all = [...document.querySelectorAll('canvas')]
      .filter(k => k.width && k.clientWidth)
      .sort((a, b) => (b.width * b.height) - (a.width * a.height));
    c = all[0];
  }
  if (!c || !c.width) return null;
  const g = c.getContext('2d');
  const N = 16;
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const out = [];
  for (let gy = 0; gy < N; gy++) {
    for (let gx = 0; gx < N; gx++) {
      const x0 = Math.floor(gx * c.width / N), x1 = Math.floor((gx + 1) * c.width / N);
      const y0 = Math.floor(gy * c.height / N), y1 = Math.floor((gy + 1) * c.height / N);
      let r = 0, gg = 0, b = 0, n = 0;
      for (let y = y0; y < y1; y += 2) {
        for (let x = x0; x < x1; x += 2) {
          const i = (y * c.width + x) * 4;
          r += d[i]; gg += d[i + 1]; b += d[i + 2]; n++;
        }
      }
      if (!n) { out.push(0, 0, 0); continue; }
      out.push(Math.round(r / n), Math.round(gg / n), Math.round(b / n));
    }
  }
  return { id: c.id || '(no id)', w: c.width, h: c.height, cells: out };
})()`;

function distance(a, b) {
  if (!a || !b || a.cells.length !== b.cells.length) return null;
  let sum = 0;
  for (let i = 0; i < a.cells.length; i++) sum += Math.abs(a.cells[i] - b.cells[i]);
  return +(sum / a.cells.length).toFixed(2);   /* mean channel difference, 0..255 */
}

/* THE SAMPLE IS TAKEN AT A NAMED MOMENT, NOT AFTER A SLEEP. "Wait three seconds
   and shoot" photographs whatever the fight happened to be doing, and then the
   spread this tool reports is the spread of MY TIMING rather than of the game.
   So it waits for the fight to be in the cover phase with the camera settled,
   and shoots on the beat boundary. */
async function sampleOnce(opts) {
  const { chromium } = PERF.requirePlaywright();
  const { srv, port } = await PERF.startServer();
  const browser = await chromium.launch();
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
      try { cityEncounterIn({ packageId: 1, label: 'pixel sample' }); return 'ok'; }
      catch (e) { return 'threw: ' + e.message; }
    });
    if (started !== 'ok') return { ok: false, why: started };

    let cf = null;
    for (let i = 0; i < 300 && !cf; i++) {
      await sleep(100);
      const h = await page.$('#combatFrame');
      if (h) {
        const c = await h.contentFrame();
        if (c && (await c.evaluate(() => document.querySelectorAll('canvas').length).catch(() => 0)) > 0) cf = c;
      }
    }
    if (!cf) return { ok: false, why: 'the fight never showed a canvas' };

    /* wait for the named state rather than for the clock */
    let state = null;
    for (let i = 0; i < 200; i++) {
      await sleep(100);
      state = await cf.evaluate(() => {
        try {
          if (typeof G === 'undefined' || !G) return null;
          return { phase: G.phase, over: !!G.over, ks: !!G.ks,
                   zoom: G._uzE == null ? null : +G._uzE.toFixed(4) };
        } catch (e) { return null; }
      }).catch(() => null);
      if (state && state.phase === 'cover' && !state.over && !state.ks) break;
    }
    /* let the camera ease settle: two readings the same to four places */
    let last = null, settled = false;
    for (let i = 0; i < 60 && !settled; i++) {
      await sleep(150);
      const z = await cf.evaluate(() => (typeof G !== 'undefined' && G && G._uzE != null)
        ? +G._uzE.toFixed(4) : null).catch(() => null);
      if (z != null && z === last) settled = true;
      last = z;
    }
    const fp = await cf.evaluate(FINGERPRINT).catch(() => null);
    let shot = null;
    if (opts.saveDir) {
      shot = path.join(opts.saveDir, 'fight_' + opts.tag + '.png');
      try { await page.screenshot({ path: shot }); } catch (_e) { shot = null; }
    }
    return { ok: !!fp, fingerprint: fp, state, cameraSettled: settled, shot };
  } finally {
    await browser.close();
    srv.close();
  }
}

async function run(n, saveDir) {
  const samples = [];
  for (let i = 0; i < n; i++) {
    const s = await sampleOnce({ tag: String(i + 1), saveDir });
    console.log('  sample ' + (i + 1) + ': ' + (s.ok ? 'ok' : 'FAILED -- ' + s.why) +
                (s.state ? '   phase=' + s.state.phase + ' zoom=' + s.state.zoom +
                 ' cameraSettled=' + s.cameraSettled : '') +
                (s.fingerprint ? '   canvas #' + s.fingerprint.id + ' ' +
                 s.fingerprint.w + 'x' + s.fingerprint.h : ''));
    samples.push(s);
  }
  const good = samples.filter(s => s.ok);
  const dists = [];
  for (let i = 1; i < good.length; i++) {
    const d = distance(good[0].fingerprint, good[i].fingerprint);
    if (d != null) dists.push(d);
  }
  return { samples: good.length, distances: dists,
           worst: dists.length ? Math.max(...dists) : null };
}

module.exports = { sampleOnce, distance, run, FINGERPRINT };

if (require.main === module) {
  const a = process.argv.slice(2);
  const arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
  const n = Number(arg('--n', 3));
  const saveDir = arg('--save', null);
  if (saveDir) fs.mkdirSync(saveDir, { recursive: true });
  console.log('THE SAME TREE, ' + n + ' TIMES. Any real comparison has to clear this.');
  run(n, saveDir).then(R => {
    console.log('\n  usable samples: ' + R.samples);
    console.log('  distance from the first sample: ' +
                (R.distances.length ? R.distances.join(', ') : 'none'));
    console.log('  THE NOISE FLOOR: ' + (R.worst == null ? 'unknown' : R.worst) +
                ' mean channel difference on an unchanged tree.');
    if (R.worst != null) {
      console.log(R.worst < 1
        ? '  A FIGHT REPEATS. A change that moves this more than a point or two is a real\n' +
          '  difference in the picture, and a floor cache can be proven identical.'
        : '  A FIGHT DOES NOT REPEAT CLEANLY at this distance, so a picture comparison\n' +
          '  cannot prove a renderer change on its own. Say so rather than trusting it.');
    }
  }).catch(e => { console.error('ERR ' + e.message); process.exit(1); });
}
