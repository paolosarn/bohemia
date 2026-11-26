#!/usr/bin/env node
// JOBS TWO [jobs smooth] 11/26 -- RULE 480(c): THE JOBS HOLD THEIR FRAMES ON A SLOWED PHONE. The demo (or the alpha, --alpha) on a phone
// held upright, 390 x 844, the CPU slowed four times (the driver's throttle, the DevTools knob) with the canvas drawn by the GPU process
// (the driver's gpu: true, PLUMBER 7's phone shape), A NEW CREW, the valley K7QM9X. Every frame the glass draws is timed (the top page's
// requestAnimationFrame) through each step of a job, done with a finger where a finger does it:
//   the town opens (Caravans, the map's own door) / the board opens (a finger on BOARD) / a job's card (a finger on a person) /
//   Take it (a finger) / back to the map / the map holds with the job marked / the trip to the job and its arrival (the map's walk)
// Each step: frames a second, the worst frame, frames past 50 ms (a hitch, rule 480(d)), past 33 ms. Writes <out>/jobs_frames_<tag>.json.
// node tools/bohemia_jobs_frames_on_a_slow_phone.js [--alpha] [--shape phone_portrait] [--throttle 4] [--out dir] [--tag t]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ALPHA = process.argv.indexOf('--alpha') > 0, SHAPE = arg('--shape', 'phone_portrait'), THROTTLE = +arg('--throttle', '4');
const OUTD = path.resolve(ROOT, arg('--out', 'records/target/jobs_11_26')), TAG = arg('--tag', ALPHA ? 'alpha' : 'demo');
fs.mkdirSync(OUTD, { recursive: true });

(async () => {
  const d = await drive.open({ profile: SHAPE, alpha: ALPHA, fog: false, keepCards: true, engage: true, throttle: THROTTLE, gpu: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = [], steps = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(250); } return false; };
  /* every frame of the glass, timed in the top page */
  const recOn = () => page.evaluate(() => { window.__JF = []; window.__JF_ON = true; const f = (t) => { if (!window.__JF_ON) return; window.__JF.push(t); requestAnimationFrame(f); }; requestAnimationFrame(f); });
  const recOff = () => page.evaluate(() => { window.__JF_ON = false; return window.__JF || []; });
  const stat = (ts) => { const dd = []; for (let i = 1; i < ts.length; i++) dd.push(ts[i] - ts[i - 1]); const span = ts.length > 1 ? ts[ts.length - 1] - ts[0] : 0;
    const s = dd.slice().sort((a, b) => a - b);
    return { frames: dd.length, ms: Math.round(span), fps: span ? +(1000 * dd.length / span).toFixed(1) : 0, worst: +(s[s.length - 1] || 0).toFixed(1), p50: +(s[Math.floor(s.length / 2)] || 0).toFixed(1),
      over50: dd.filter(x => x > 50).length, over33: dd.filter(x => x > 33.4).length }; };
  const PROF = process.argv.includes('--profile'); let cdp = null; if (PROF) { cdp = await page.context().newCDPSession(page); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); }
  const selfBy = (prof) => { const by = {}, fn = {}, N = prof.nodes, id = {}; N.forEach(n => { id[n.id] = n; });
    const dt = {}; (prof.samples || []).forEach((s, i) => { dt[s] = (dt[s] || 0) + ((prof.timeDeltas || [])[i] || 0); });
    N.forEach(n => { const t = (dt[n.id] || 0) / 1000; if (!t) return; const u = String(n.callFrame.url || '(native)').split('/').pop().split('?')[0] || '(program)'; by[u] = (by[u] || 0) + t;
      const k = u + ' ' + (n.callFrame.functionName || '(anon)') + ':' + n.callFrame.lineNumber; fn[k] = (fn[k] || 0) + t; });
    /* a native call's time, given to the script that called it (getImageData, fill, drawImage: whose?) */
    const par = {}; N.forEach(n => (n.children || []).forEach(c => { par[c] = n.id; })); const via = {};
    N.forEach(n => { const t = (dt[n.id] || 0) / 1000; if (!t || n.callFrame.url) return; const nm = n.callFrame.functionName; if (!/^(getImageData|fill|drawImage|restore|putImageData|checkVisibility|getBoundingClientRect|fillRect|stroke|save)$/.test(nm)) return;
      let p = par[n.id]; while (p != null && !id[p].callFrame.url) p = par[p]; if (p == null) return; const c = id[p].callFrame, k = nm + ' <- ' + String(c.url).split('/').pop().split('?')[0] + ' ' + (c.functionName || '(anon)') + ':' + c.lineNumber; via[k] = (via[k] || 0) + t; });
    const top = (o, k) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, k).map(([a, b]) => a + ' ' + Math.round(b) + 'ms'); return { files: top(by, 8), fns: top(fn, 12), via: top(via, 10) }; };
  const step = async (name, fn, hold) => { await recOn(); if (cdp) await cdp.send('Profiler.start'); let note = null; try { note = await fn(); } catch (e) { note = 'ERR ' + String(e && e.message || e).slice(0, 120); }
    await page.waitForTimeout(hold == null ? 1200 : hold); const ts = await recOff(); const st = Object.assign({ step: name, note }, stat(ts));
    if (cdp) { const pr = (await cdp.send('Profiler.stop')).profile; st.profile = selfBy(pr); } steps.push(st);
    if (st.profile) console.log('      files: ' + st.profile.files.join(', ') + '\n      via: ' + st.profile.via.join(', '));
    console.log('  ' + TAG + ' ' + name.padEnd(34) + String(st.fps).padStart(6) + ' fps  worst ' + String(st.worst).padStart(6) + ' ms  ' + st.over50 + ' past 50 ms, ' + st.over33 + ' past 33 of ' + st.frames + (note ? '  (' + String(note).slice(0, 80) + ')' : '')); };
  const tapFrame = async (sf, sfH, sel) => { const r = await sf.evaluate((q) => { const e = document.querySelector(q); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, sel);
    if (!r) return false; const hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]); await page.touchscreen.tap(hb.x + r.x * hb.width / (iw[0] || hb.width), hb.y + r.y * hb.height / (iw[1] || hb.height)); return true; };
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.LOOP && LOOP.start, null, { timeout: 300000 });
    await page.waitForTimeout(6000);
    await step('the map, still (the floor)', async () => null, 3000);
    const tn = 'Caravans';
    await step('the town opens', async () => { await fr.evaluate((n) => { try { loopClose(); } catch (e) {} const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); }, tn);
      await waitFor(() => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)), 90000);
      if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); }); return tn; }, 2500);
    const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
    await waitFor(() => sf.evaluate((n) => !!(BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n), tn), 30000);
    await step('the town, still', async () => null, 3000);
    await step('the board opens (a finger)', async () => { for (let k = 0; k < 4; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('board')), hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]);
        if (xy) await page.touchscreen.tap(hb.x + xy.x * hb.width / (iw[0] || hb.width), hb.y + xy.y * hb.height / (iw[1] || hb.height));
        if (await waitFor(() => sf.evaluate(() => BohemiaSettlement.state.open === 'board' && document.querySelectorAll('#sheet button.act.client').length > 0), 10000)) return 'open'; } return 'did not open'; }, 2000);
    await step('the board, still', async () => null, 3000);
    const jobId = await sf.evaluate(() => { const b = document.querySelector('#sheet button.act.client'); return b ? b.dataset.id : null; });
    await step('a job\'s card (a finger)', async () => { await tapFrame(sf, sfH, '#sheet button.act.client'); await page.waitForTimeout(1500); return jobId; }, 1500);
    await step('Take it (a finger)', async () => { const sel = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button')].filter(x => /take it/i.test(x.textContent || ''))[0]; if (!b) return null; b.id = b.id || 'jf_take'; return '#' + b.id; });
      if (sel) await tapFrame(sf, sfH, sel); await waitFor(() => fr.evaluate((id) => LOOP.held.some(h => h.id === id), jobId), 8000); return (await fr.evaluate((id) => LOOP.held.some(h => h.id === id), jobId)) ? 'held ' + jobId : 'NOT HELD'; }, 1500);
    await step('back to the map', async () => { await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); return null; }, 2500);
    await step('the map holds, the job marked', async () => { await fr.evaluate(() => { try { travelStop(); } catch (e) {} }); return null; }, 3000);
    await step('the trip and the arrival', async () => {
      const t = await fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; const n = j && BohemiaJobKinds.nextOf ? BohemiaJobKinds.nextOf(j) : null; return n ? [n.x, n.y, j.stage] : (j && j.target ? [j.target.x, j.target.y, j.stage] : null); }, jobId);
      if (!t) return 'no place';
      await fr.evaluate((p) => { travelStop(); travelTo(0, 0, [p[0], p[1]]); try { travelSpeedSet(4); } catch (e) {} }, t);
      const arrived = await waitFor(async () => { const s = await fr.evaluate((p) => ({ at: Math.max(Math.abs(city.x - p[0]), Math.abs(city.y - p[1])), trav: !!TRAVEL }), t); return s.at <= 1 || !s.trav || await page.evaluate(() => !!CITYFIGHT); }, 120000);
      const st = await fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; return j ? j.stage : 'gone'; }, jobId);
      return (arrived ? 'arrived' : 'NOT ARRIVED') + ', stage ' + t[2] + ' -> ' + st + ((await page.evaluate(() => !!CITYFIGHT)) ? ', a fight' : '');
    }, 2500);
    await page.screenshot({ path: path.join(OUTD, TAG + '_jobs_frames_end.png') });
  } catch (e) { errs.push('walk: ' + String(e && e.message || e).slice(0, 200)); }
  await d.close().catch(() => {});
  const f = path.join(OUTD, 'jobs_frames_' + TAG + '.json');
  fs.writeFileSync(f, JSON.stringify({ draft: true, tool: 'tools/bohemia_jobs_frames_on_a_slow_phone.js', tag: TAG, alpha: ALPHA, shape: SHAPE, throttle: THROTTLE, steps, errs }, null, 1));
  console.log('wrote ' + path.relative(ROOT, f) + (errs.length ? '  ERRS ' + errs.slice(0, 2).join(' | ') : ''));
  process.exit(0);
})();
