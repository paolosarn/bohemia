#!/usr/bin/env node
// ECONOMY THREE 11/26 -- RULE 480(c): NO MONEY SCREEN COSTS A FRAME. The demo (or the alpha, --alpha) on a phone held upright,
// 390 x 844, the CPU slowed four times with the canvas drawn by the GPU process (JOBS TWO's shape, tools/bohemia_jobs_frames_on_a_slow_phone.js),
// A NEW CREW, the valley K7QM9X. Every frame the glass draws is timed through each money step, done with a finger where a finger does it:
//   the map with the bar still / the town opens / the stall (a finger) / a buy at the stall (two fingers: one lights, one does it) /
//   the smith (a finger, the mend list) / the hall (the hire prices) / back to the map (the bar counts the purse down)
// Each step: frames a second, the worst frame, frames past 50 ms (a hitch, rule 480(d)), past 33 ms; and with the profiler on, THE MONEY'S
// OWN TIME: every sample whose stack holds a money frame (the price engine, the purse, the wages, the job pay, the bar's money paint, the
// stall's and the shop's price rows), so the native work the money calls (innerHTML, layout read) is the money's too.
// node tools/bohemia_economy_three_money_frames.js [--alpha] [--shape phone_portrait] [--throttle 4] [--out dir] [--tag t]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ALPHA = process.argv.indexOf('--alpha') > 0, SHAPE = arg('--shape', 'phone_portrait'), THROTTLE = +arg('--throttle', '4');
const OUTD = path.resolve(ROOT, arg('--out', 'records/target/economy_three_11_26')), TAG = arg('--tag', (ALPHA ? 'alpha' : 'demo') + '_' + SHAPE + '_x' + THROTTLE);
fs.mkdirSync(OUTD, { recursive: true });
/* what is money: the engines that price, pay and keep the purse, and the page functions that draw a price or the purse */
/* the job board (bohemia_board_shelf.js, JOBS') and the phone's own paint are not the money: counted apart, as the floor */
const MONEY_FILE = /^(bohemia_stall_prices|bohemia_purse|bohemia_economy|bohemia_wages|bohemia_job_pay|bohemia_shop_wear)\.js$/;
/* a page's own money functions (only in a page, never a script of the same name elsewhere) */
const MONEY_FN = /^(shop(Buy|Sell|Refresh|StripFill|Tile|Do|Redo|Mark|Pick|SelIt|UpFor)|stall(Have|Week|Need\w*|Ctx|Rows|RowOf|Price|Lots|Sides|Warns|Box|Line|Tap|Mark|Do|Refresh|StripFill|GearPays|GearList)|sell(Back|Junk)|mend\w*|priceOf|worthOf|moneyWord|bats|paintRead|paint|money|readings|sixPlate|billPublish|loopSettleBats|loopBats|loopJobPay)$/;
const PAGE = /\.html$/;

(async () => {
  const d = await drive.open({ profile: SHAPE, alpha: ALPHA, fog: false, keepCards: true, engage: true, throttle: THROTTLE, gpu: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = [], steps = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(250); } return false; };
  const recOn = () => page.evaluate(() => { window.__MF = []; window.__MF_ON = true; const f = (t) => { if (!window.__MF_ON) return; window.__MF.push(t); requestAnimationFrame(f); }; requestAnimationFrame(f); });
  const recOff = () => page.evaluate(() => { window.__MF_ON = false; return window.__MF || []; });
  const stat = (ts) => { const dd = []; for (let i = 1; i < ts.length; i++) dd.push(ts[i] - ts[i - 1]); const span = ts.length > 1 ? ts[ts.length - 1] - ts[0] : 0;
    const s = dd.slice().sort((a, b) => a - b);
    return { frames: dd.length, ms: Math.round(span), fps: span ? +(1000 * dd.length / span).toFixed(1) : 0, worst: +(s[s.length - 1] || 0).toFixed(1), p50: +(s[Math.floor(s.length / 2)] || 0).toFixed(1),
      over50: dd.filter(x => x > 50).length, over33: dd.filter(x => x > 33.4).length }; };
  const cdp = await page.context().newCDPSession(page); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 });
  /* the money's time: a sample is the money's when any frame on its stack is money; the busy time is every sample but idle */
  const moneyOf = (prof) => { const N = prof.nodes, id = {}, par = {}; N.forEach(n => { id[n.id] = n; (n.children || []).forEach(c => { par[c] = n.id; }); });
    const isM = {}; N.forEach(n => { const u = String(n.callFrame.url || '').split('/').pop().split('?')[0]; isM[n.id] = MONEY_FILE.test(u) || (PAGE.test(u) && MONEY_FN.test(n.callFrame.functionName || '')); });
    const memo = {}; const under = (nid) => { if (nid in memo) return memo[nid]; let p = nid, r = null; while (p != null) { if (isM[p]) { r = p; break; } p = par[p]; } return (memo[nid] = r); };
    const dt = {}; (prof.samples || []).forEach((s, i) => { dt[s] = (dt[s] || 0) + ((prof.timeDeltas || [])[i] || 0); });
    let busy = 0, money = 0; const by = {};
    N.forEach(n => { const t = (dt[n.id] || 0) / 1000; if (!t) return; const nm = n.callFrame.functionName; if (nm === '(idle)') return; busy += t;
      const m = under(n.id); if (m == null) return; money += t; const c = id[m].callFrame, k = String(c.url).split('/').pop().split('?')[0] + ' ' + (c.functionName || '(anon)'); by[k] = (by[k] || 0) + t; });
    return { busy_ms: Math.round(busy), money_ms: +money.toFixed(1), top: Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([a, b]) => a + ' ' + b.toFixed(1) + 'ms') }; };
  const step = async (name, fn, hold) => { await recOn(); await cdp.send('Profiler.start'); let note = null; try { note = await fn(); } catch (e) { note = 'ERR ' + String(e && e.message || e).slice(0, 120); }
    await page.waitForTimeout(hold == null ? 1500 : hold); const ts = await recOff(); const st = Object.assign({ step: name, note }, stat(ts));
    st.profile = moneyOf((await cdp.send('Profiler.stop')).profile); st.money_ms_a_second = st.ms ? +(1000 * st.profile.money_ms / st.ms).toFixed(1) : 0; steps.push(st);
    console.log('  ' + name.padEnd(36) + String(st.fps).padStart(6) + ' fps  worst ' + String(st.worst).padStart(6) + ' ms  ' + st.over50 + ' past 50 of ' + st.frames +
      '  | the money ' + st.profile.money_ms + ' ms of ' + st.profile.busy_ms + ' busy (' + st.money_ms_a_second + ' ms a second)' + (note ? '  (' + String(note).slice(0, 60) + ')' : ''));
    if (st.profile.top.length) console.log('      ' + st.profile.top.join(', ')); };
  const tapXY = async (sf, sfH, xy) => { const hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]); await page.touchscreen.tap(hb.x + xy.x * hb.width / (iw[0] || hb.width), hb.y + xy.y * hb.height / (iw[1] || hb.height)); };
  const tapSel = async (sf, sfH, sel) => { const r = await sf.evaluate((q) => { const e = document.querySelector(q); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, sel);
    if (!r) return false; await tapXY(sf, sfH, r); return true; };
  try {
    await fr.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.LOOP && LOOP.start, null, { timeout: 300000 });
    await page.waitForTimeout(6000);
    await step('the map, the bar still', async () => null, 4000);
    const tn = 'Caravans';
    await step('the town opens', async () => { await fr.evaluate((n) => { try { loopClose(); } catch (e) {} const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); }, tn);
      await waitFor(() => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)), 90000);
      if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); }); return tn; }, 2500);
    const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
    await waitFor(() => sf.evaluate((n) => !!(BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n), tn), 30000);
    await step('the town, still (the floor)', async () => null, 3000);
    const openBy = async (k) => { for (let t = 0; t < 4; t++) { const xy = await sf.evaluate((q) => BohemiaSettlement.where(q), k); if (xy) await tapXY(sf, sfH, xy);
        if (await waitFor(() => sf.evaluate((q) => BohemiaSettlement.state.open === q && document.getElementById('sheet').classList.contains('on'), k), 8000)) return 'open'; }
      await sf.evaluate((q) => BohemiaSettlement.open(q), k); return (await sf.evaluate((q) => BohemiaSettlement.state.open === q, k)) ? 'open (by the call)' : 'did not open'; };
    const shut = () => sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button')].filter(x => /^(back|close|leave it|done)/i.test((x.textContent || '').trim()))[0]; if (b) b.click(); else if (window.BohemiaSettlement && BohemiaSettlement.close) BohemiaSettlement.close(); });
    await step('the stall opens (a finger)', async () => openBy('stall'), 2000);
    await step('the stall, still', async () => null, 3000);
    await step('a buy at the stall (two fingers)', async () => {
      const purse = () => fr.evaluate(() => window.__BAR_READ ? __BAR_READ.batteries : null).catch(() => null), before = await purse();
      const sel = '#sbody .stline[data-good="tape"] .sb[data-side="buy"]';
      if (!(await sf.evaluate((q) => !!document.querySelector(q), sel))) return 'no tape row';
      await tapSel(sf, sfH, sel); await page.waitForTimeout(120); await tapSel(sf, sfH, sel);
      await page.waitForTimeout(900); const after = await purse();
      return 'purse ' + before + ' -> ' + after; }, 2500);
    await shut(); await page.waitForTimeout(800);
    const shopK = await sf.evaluate(() => ['smith', 'armourer', 'arms'].filter(k => BohemiaSettlement.where(k))[0] || null);
    if (shopK) { await step('the ' + shopK + ' opens (a finger)', async () => openBy(shopK), 2000); await step('the ' + shopK + ', still', async () => null, 3000); await shut(); await page.waitForTimeout(800); }
    if (await sf.evaluate(() => !!BohemiaSettlement.where('hall'))) { await step('the hall opens (a finger)', async () => openBy('hall'), 2000);
      await step('the hall, still', async () => null, 3000); await shut(); await page.waitForTimeout(800); }
    await step('back to the map (the bar counts down)', async () => { await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); return null; }, 3500);
    await step('the map, the bar still again', async () => null, 4000);
    if (process.argv.includes('--shot')) await page.screenshot({ path: path.join(OUTD, TAG + '_money_frames_end.png') });   /* only when asked: 4 MB a picture */
  } catch (e) { errs.push('walk: ' + String(e && e.message || e).slice(0, 200)); }
  await d.close().catch(() => {});
  const f = path.join(OUTD, 'money_frames_' + TAG + '.json');
  fs.writeFileSync(f, JSON.stringify({ draft: true, tool: 'tools/bohemia_economy_three_money_frames.js', tag: TAG, alpha: ALPHA, shape: SHAPE, throttle: THROTTLE, steps, errs }, null, 1));
  console.log('wrote ' + path.relative(ROOT, f) + (errs.length ? '  ERRS ' + errs.slice(0, 2).join(' | ') : ''));
  process.exit(0);
})();
