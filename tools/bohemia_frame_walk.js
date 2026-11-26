#!/usr/bin/env node
/* ============================================================================
   THE FRAME WALK (PLUMBER 8, 11/26/26; VAMILY rule 480(c)(d), Paolo 11/26: 'make sure fps is never choppy for nothing').
   ONE WALK THROUGH EVERY SCREEN AND EVERY MOVE BETWEEN THEM on a slowed phone (390 x 844, touch, the CPU slowed 4 times, the canvas on
   a GPU process), every frame judged: A HITCH is a frame past 50 ms, A CHOPPY SCREEN is a step whose frames average under 55 a second.
   It is the freeze census's own walk (tools/bohemia_freeze_census.js: the town he wakes in, the map standing, travelling at the slowest
   and the fastest speed, the pinch in and out, a town, a shop, an item, the lot and its minigame, camp made and broken, a fight from its
   start to its spoils, AUTO at 1x and 4x, a boss, a home base planted and opened, a save, the reload) with rule 480's own steps added
   (opts.more: the map panned by a finger, the jobs on a town's board, his place's camera pinched in and out) and the alpha's VOTE tab
   (its loading screen to BEGIN, the tab standing, its list dragged by a finger: the demo has no VOTE tab).
   Every hitch says what ran in it: the page's own tasks over 50 ms (and the frame each ran in), or nothing of the page's (the drawing:
   the compositor, the GPU, the browser's raster). --profile adds each step's CPU profile (its costliest functions), for finding the
   source; the gate walks without it (a profiler costs frames).
   USE: node tools/bohemia_frame_walk.js [--profile] [--json out.json] [--no-alpha] [--arm 'js'] [--stop 'step name']
   It is the measuring half of gates/never_choppy_the_frame_walk_gate.js.
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = process.env.BOHEMIA_CENSUS_ROOT || path.dirname(__dirname);
const C = require(path.join(ROOT, 'tools/bohemia_freeze_census.js'));
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const FPS_FLOOR = 55, HITCH = C.HITCH || 50;

/* THE ALPHA'S VOTE TAB: the only screen the demo has not got. Opened bare (the driver serves it, nothing driven), BEGIN pressed by a
   finger, the tab it lands on stood and dragged */
async function voteWalk(opts) {
  const d = await D.open({ file: 'BOHEMIA_ALPHA_0_9.html', bare: true, profile: 'phone_portrait', throttle: opts.throttle || 4, gpu: !opts.cpu, arm: C.CLOCK + (opts.arm || '') });
  const p = d.page, M = (fn, a) => p.evaluate(fn, a), steps = [];
  const mark = (n) => M(n => window.__FZ && __FZ.mark(n), n);
  const step = async (name, press, settle) => { await mark(name); let ok = true, why = ''; let prof = null;
    if (opts.profile) { try { await d.cdp.send('Profiler.enable'); await d.cdp.send('Profiler.setSamplingInterval', { interval: 1000 }); await d.cdp.send('Profiler.start'); } catch (e) {} }
    try { const r = await press(); if (r === false) { ok = false; why = 'not pressed'; } } catch (e) { ok = false; why = String(e && e.message || e).slice(0, 120); }
    await sleep(settle || 2500);
    if (opts.profile) { try { const { profile } = await d.cdp.send('Profiler.stop'); prof = C.profTop(profile); } catch (e) {} }
    steps.push({ name, ok, why, prof }); return ok; };
  const out = { steps, errs: d.errs || [] };
  try {
    await step('the alpha: its loading screen to BEGIN', async () => { await p.waitForFunction(() => window.__LOAD_READY === true, null, { timeout: 240000 }); await p.touchscreen.tap(195, 500); return true; }, 3000);
    const vf = async () => { const h = await p.$('#voteFrame'); return h ? h.contentFrame() : null; };
    await step('the VOTE tab, standing', async () => { const f = await vf(); if (!f) return false; await f.waitForSelector('#list .row', { timeout: 60000 }).catch(() => null); return true; }, 4000);
    await step('the VOTE tab dragged (a finger, down and back)', async () => { const vp = p.viewportSize() || { width: 390, height: 844 }, cx = vp.width / 2;
      for (let k = 0; k < 2; k++) { const y0 = k ? vp.height * 0.3 : vp.height * 0.7, dy = k ? 9 : -9;
        await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: y0, id: 9 }] });
        for (let i = 1; i <= 30; i++) { await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx, y: y0 + dy * i, id: 9 }] }); await sleep(17); }
        await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(1200); } return true; }, 2500);
    out.walk = C.census(await M(() => window.__FZ), await M(() => performance.now()));
    out.walk.forEach(s => { if (/^boot/.test(s.step)) s.step = 'the alpha: boot (the page opening)'; });
  } finally { try { await d.close(); } catch (e) {} }
  return out;
}

/* rule 480's judgement of one step: every frame past 50 ms named, and its frames a second against 55 */
function judge(s) {
  return { step: s.step, fps: s.fps, frames: s.frames, worst: s.worst, over50: s.over50 || 0, over50page: s.over50page || 0, worstPage: s.worstPage || 0, pageMs: s.pageMs || 0,
    choppy: s.frames > 0 && s.fps < FPS_FLOOR, hitched: (s.over50 || 0) > 0, ok: !(s.frames > 0 && s.fps < FPS_FLOOR) && !((s.over50 || 0) > 0),
    top: (s.hitches || []).slice(0, 3).map(h => h.ms + ' ms ' + (h.page ? 'PAGE ' + (h.tasks.slice(0, 2).map(t => t.ms + ' ms in ' + t.frame).join(', ')) : 'DRAWING (no page task over 50 ms)')) };
}

async function frameWalk(opts) {
  opts = opts || {};
  const o = await C.walk(Object.assign({ throttle: 4, quiet: true, more: true }, opts));
  if (!opts.noAlpha) { try { o.vote = await voteWalk(opts); } catch (e) { o.voteErr = String(e && e.message || e).slice(0, 200); } }
  const all = (o.walk || []).concat(o.reload || []).concat((o.vote && o.vote.walk) || []);
  const profs = {}; (o.steps || []).concat((o.vote && o.vote.steps) || []).forEach(s => { if (s.prof) profs[s.name] = s.prof; });
  o.judged = all.map(s => Object.assign(judge(s), { prof: profs[s.step] || null }));
  o.notWalked = (o.steps || []).concat((o.vote && o.vote.steps) || []).filter(s => !s.ok).map(s => s.name + ' (' + s.why + ')');
  return o;
}

function report(o) {
  const L = ['THE FRAME WALK (rule 480): the demo and the alpha\'s VOTE tab, phone upright, CPU slowed ' + (o.throttle || 4) + 'x, canvas ' + (o.gpu ? 'on a GPU process' : 'in software')
    + '; a hitch is a frame past ' + HITCH + ' ms, a choppy screen averages under ' + FPS_FLOOR + ' frames a second'];
  (o.judged || []).forEach(j => {
    L.push('  ' + (j.ok ? 'ok    ' : 'OVER  ') + j.step.slice(0, 52).padEnd(52) + String(j.fps).padStart(6) + ' fps ' + String(j.over50).padStart(4) + ' over 50 ms (' + j.over50page + ' the page\'s)  worst ' + String(j.worst).padStart(5) + ' ms'
      + (j.top.length ? '\n          ' + j.top.join(' | ') : ''));
    if (j.prof) L.push('          profile ' + j.prof.ms + ' ms (idle ' + j.prof.idle + ', browser ' + j.prof.program + ', gc ' + j.prof.gc + '): ' + j.prof.self.slice(0, 5).join(' | ') + '\n          by total: ' + j.prof.total.slice(0, 6).join(' | '));
  });
  const n = (o.judged || []).length, bad = (o.judged || []).filter(j => !j.ok).length;
  L.push('  ' + (n - bad) + ' of ' + n + ' steps inside rule 480; ' + (o.judged || []).reduce((q, j) => q + j.over50, 0) + ' frames past 50 ms in all ('
    + (o.judged || []).reduce((q, j) => q + j.over50page, 0) + ' with the page\'s own code in them)');
  if (o.notWalked && o.notWalked.length) L.push('  NOT WALKED: ' + o.notWalked.join('; '));
  if (o.voteErr) L.push('  THE VOTE TAB NOT WALKED: ' + o.voteErr);
  if (o.errs && o.errs.length) L.push('  page errors: ' + o.errs.slice(0, 3).join(' | '));
  return L.join('\n');
}
module.exports = { frameWalk, voteWalk, judge, report, FPS_FLOOR, HITCH };

if (require.main === module) {
  const a = process.argv.slice(2), arg = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
  (async () => {
    const o = await frameWalk({ profile: a.includes('--profile'), noAlpha: a.includes('--no-alpha'), arm: arg('--arm') || '', stopAfter: arg('--stop') || null, cpu: a.includes('--cpu') });
    console.log(report(o));
    if (arg('--json')) fs.writeFileSync(arg('--json'), JSON.stringify(o, null, 1));
    process.exit(0);
  })().catch(e => { console.error(e); process.exit(1); });
}
