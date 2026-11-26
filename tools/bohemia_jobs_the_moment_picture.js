#!/usr/bin/env node
// JOBS TWO 11/26 -- THE MOMENT IS SEEN AND HEARD, its picture: the demo on a phone held upright (390 x 844), a new crew on the map,
// the job's moment said ('FOUND IT') and the glass taken four times through its life: the first frame (the plate and the first ring),
// the tape's dropout (70 to 140 ms), the second ring on the beat (500 ms), and the plate held (1.2 s). Each frame cut around his crew.
// node tools/bohemia_jobs_the_moment_picture.js --out dir      (writes moment_0.png .. moment_3.png)
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(arg('--out', 'records/target/jobs_11_26')); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const d = await drive.open({ profile: 'phone_portrait', alpha: false, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, page = d.page;
  await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.LOOP && LOOP.start, null, { timeout: 300000 });
  await page.waitForTimeout(4000);
  /* the map near him, the way he walks a job (the close end of the zoom's middle), the camera over his crew */
  await fr.evaluate(() => { const zb = zoomBounds(); try { setZoomAt(zb[0] + (zb[1] - zb[0]) * 0.7); } catch (e) {} try { camHold(); } catch (e) {} render(); });
  await page.waitForTimeout(2500);
  const fb = await (await fr.frameElement()).boundingBox();
  /* where he stands on the glass: the moment's own plate (the jobs' layer's record, in the canvas's CSS pixels), found by saying it once */
  await fr.evaluate(() => BohemiaJobKinds.flash('found it')); await page.waitForTimeout(300);
  const at = await fr.evaluate(() => { render(); const cv = document.querySelector('canvas'), r = cv.getBoundingClientRect(), P = BohemiaJobKinds.plates().filter(p => p.moment).pop();
    return P ? { cx: r.left + P.sx, cy: r.top + P.cy } : { cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; });
  await page.waitForTimeout(4000);
  const vp = page.viewportSize(), cx = fb.x + at.cx, cy = fb.y + at.cy, clip = { x: Math.max(0, Math.min(vp.width - 300, cx - 150)), y: Math.max(0, Math.min(vp.height - 300, cy - 60)), width: 300, height: 300 };
  /* each frame at its own instant: the map's clock held there (the moment's steps read Date.now), drawn, taken, let go */
  const times = [10, 100, 540, 1200], names = [];
  await fr.evaluate(() => { window.__REAL_NOW = Date.now; window.__T0 = Date.now(); Date.now = () => window.__T0; BohemiaJobKinds.flash('found it'); });
  for (let i = 0; i < times.length; i++) {
    await fr.evaluate((t) => { Date.now = () => window.__T0 + t; render(); }, times[i]); await page.waitForTimeout(60);
    const f = path.join(OUT, 'moment_' + i + '.png'); await page.screenshot({ path: f, clip }); names.push(f + ' at ' + times[i] + ' ms');
  }
  await fr.evaluate(() => { Date.now = window.__REAL_NOW; });
  console.log(names.join('\n'));
  await d.close();
})();
