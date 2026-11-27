#!/usr/bin/env node
/* THE CANVAS CENSUS, GOING IN AND COMING OUT (COMBAT FIVE 11/27/26, VAMILY rule 484 as amended 11/27; Paolo 11/27: 'combat keeps
   crashing, like when I get into combat and then when I finish it, it's insane').
   His phone is Safari on an iPhone: it kills a page on far less memory than this box's Chromium and holds a hard cap on the pixels of
   every live canvas together. PLUMBER 8's twenty-fight gate reads the canvases alive BETWEEN fights after a forced collection; a phone
   gets no forced collection and dies at the PEAK, going in or coming out. So this samples, every 100 ms through one whole fight (the map,
   the meet card, ENGAGE, the way in, the fight, the win, the end screen, LEAVE, the way home, the map again), WITHOUT forcing a
   collection: every canvas any page made that is not yet collected and still has pixels (width x height x 4), the ones on a page and the
   ones not, and every ImageBitmap not closed; the most at each step, and at the peak who made them (the function that made each).
   node tools/bohemia_combat_five_canvas_census.js [--profile phone_portrait|phone_landscape] [--cpu 4] [--fights n] [--json out.json]
*/
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { leaveAt } = require(path.join(ROOT, 'tools/bohemia_leave_the_end_screen.js'));
const args = process.argv.slice(2);
const opt = (k, dflt) => { const i = args.indexOf('--' + k); return i < 0 ? dflt : (args[i + 1] && !/^--/.test(args[i + 1]) ? args[i + 1] : true); };
const PROFILE = opt('profile', 'phone_portrait'), CPU = +opt('cpu', 4), FIGHTS = +opt('fights', 1), JOUT = opt('json', null);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* every canvas any page makes (createElement, OffscreenCanvas) and every ImageBitmap, kept by the TOP page as a WeakRef with its maker */
const ARM = "(function(){ var T = window.top; if (window === T) { T.__CEN = { list: [], bm: [] }; } var add = function (k, e, w) { try { T.__CEN[k].push({ r: new WeakRef(e), w: w, p: String(location.pathname).split('/').pop() }); } catch (x) {} };"
  + " var who = function () { try { return String(new Error().stack || '').split('\\n').slice(2, 5).map(function (l) { return l.trim().replace(/^at /, '').replace(/\\(?(https?|file):[^ )]*\\//, '(').replace(/:\\d+\\)?$/, ')'); }).join(' < ').slice(0, 150); } catch (x) { return '?'; } };"
  + " var ce = Document.prototype.createElement; Document.prototype.createElement = function (n) { var e = ce.apply(this, arguments); if (String(n).toLowerCase() === 'canvas') add('list', e, who()); return e; };"
  + " if (window.OffscreenCanvas) { var OC = window.OffscreenCanvas; window.OffscreenCanvas = function (w, h) { var e = new OC(w, h); add('list', e, 'Offscreen: ' + who()); return e; }; window.OffscreenCanvas.prototype = OC.prototype; }"
  + " if (window.createImageBitmap) { var cib = window.createImageBitmap; window.createImageBitmap = function () { var w = who(); return cib.apply(this, arguments).then(function (b) { add('bm', b, w); return b; }); }; }"
  + " })();";
/* one reading: what is alive with pixels now (no collection forced) */
const READ = () => { const C = window.__CEN; if (!C) return null; let cv = 0, cvOn = 0, cvOff = 0, n = 0, bm = 0, nb = 0; const by = {};
  C.list = C.list.filter(o => { const e = o.r.deref(); if (!e) return false; const px = (e.width | 0) * (e.height | 0); if (px > 0) { const mb = px * 4 / 1048576; cv += mb; n++;
    const on = !!(e.isConnected); if (on) cvOn += mb; else cvOff += mb; const k = (on ? 'ON  ' : 'OFF ') + o.p + ' ' + o.w; by[k] = (by[k] || 0) + mb; } return true; });
  C.bm = C.bm.filter(o => { const b = o.r.deref(); if (!b) return false; const px = (b.width | 0) * (b.height | 0); if (px > 0) { const mb = px * 4 / 1048576; bm += mb; nb++; const k = 'BMP ' + o.p + ' ' + o.w; by[k] = (by[k] || 0) + mb; } return true; });
  return { cv: +cv.toFixed(1), on: +cvOn.toFixed(1), off: +cvOff.toFixed(1), n, bm: +bm.toFixed(1), nb, by }; };

(async () => {
  const d = await D.open({ profile: PROFILE, arm: ARM });
  const M = (fn, a) => d.page.evaluate(fn, a);
  for (let i = 0; i < 200; i++) { if (await d.fr.evaluate(() => typeof MODE !== 'undefined' && MODE === 'city' && typeof cityHandOver === 'function' && !!(window.om && om.n)).catch(() => false)) break; await sleep(500); }
  await sleep(3000);
  await d.fr.evaluate(D.offTheTown).catch(() => null);
  await d.fr.evaluate(() => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} }).catch(() => null);
  await sleep(2500);
  if (CPU > 1) await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  await d.cdp.send('Performance.enable').catch(() => {});
  let step = 'map', fight = 0; const peaks = {}; let top = null, topAt = null;
  const heap = async () => { try { const m = await d.cdp.send('Performance.getMetrics'); const g = (n) => (m.metrics.find(x => x.name === n) || {}).value; return Math.round(g('JSHeapUsedSize') / 1048576); } catch (e) { return null; } };
  let busy = false;
  const sample = async () => { if (busy) return; busy = true; try { const r = await M(READ); if (r) { const k = fight + ':' + step, tot = r.cv + r.bm; const p = peaks[k] || (peaks[k] = { cv: 0, on: 0, off: 0, bm: 0, tot: 0, n: 0, heap: null });
      if (tot > p.tot) { Object.assign(p, { cv: r.cv, on: r.on, off: r.off, bm: r.bm, tot: +tot.toFixed(1), n: r.n }); p.heap = await heap(); }
      if (!top || tot > top.tot) { top = { tot: +tot.toFixed(1), cv: r.cv, bm: r.bm, step: k, by: Object.entries(r.by).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([w, mb]) => mb.toFixed(1) + ' MB  ' + w) }; } } } catch (e) {} busy = false; };
  const iv = setInterval(sample, 100);
  const state = () => M(() => { let st = '?', ff = false, meet = false, spoils = false; try { st = BohemiaMotion.dive.state(); } catch (e) {} ff = !!document.getElementById('fightFrame');
    try { meet = !!document.getElementById('cityFrame').contentWindow.MEET.up; } catch (e) {} spoils = !!(window.SPOILS && SPOILS.frame); return { st, ff, meet, spoils }; });
  const errs = []; d.page.on('pageerror', e => errs.push(String(e).slice(0, 160))); d.page.on('crash', () => errs.push('CRASH'));
  for (fight = 1; fight <= FIGHTS; fight++) {
    step = 'map'; await sleep(800);
    const z0 = await d.fr.evaluate(() => ({ city: [city.x, city.y] }));
    const at = { gx: z0.city[0] + 2, gy: z0.city[1] + 1 };
    await d.fr.evaluate((at) => { const pm = partyMath('job', { skulls: 1 }), roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
      const go = () => cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'A road crew', faction: null, draft: true, roster, party: pm, street: true, why: 'party:census', at });
      if (typeof meetWalk === 'function') meetWalk(go); else go(); }, at);
    step = 'card'; await sleep(3000);
    step = 'in'; await d.fr.evaluate(() => { try { MEET_DONE(true); } catch (e) {} });
    const t0 = Date.now(); while (Date.now() - t0 < 60000) { const s = await state(); if (s.ff && s.st === 'off') break; await sleep(150); }
    step = 'fight'; await sleep(2500);
    const h = await d.page.$('#fightFrame'), f = h && await h.contentFrame();
    if (f) await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} }).catch(() => {});
    step = 'end screen';
    let lv = null, last = null; const tW = Date.now();
    while (Date.now() - tW < 60000) { const a = await leaveAt(d.page); if (!a.why) { if (last && Math.abs(last.x - a.x) < 1) { lv = a; break; } last = a; } else last = null; await sleep(150); }
    await sleep(1000);
    step = 'out'; if (lv) await d.page.touchscreen.tap(lv.x, lv.y); else await M(() => { try { spoilsLeave(); } catch (e) {} });
    const t1 = Date.now(); while (Date.now() - t1 < 40000) { const s = await state(); if (!s.ff && !s.spoils && s.st === 'off' && Date.now() - t1 > 800) break; await sleep(150); }
    step = 'map after'; await sleep(2500);
    console.log('fight ' + fight + ' done' + (lv ? '' : ' (LEAVE never on the glass: spoilsLeave)'));
  }
  clearInterval(iv); await sleep(150);
  await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {});
  /* after a forced collection, what is still alive */
  try { await d.cdp.send('HeapProfiler.enable'); await d.cdp.send('HeapProfiler.collectGarbage'); } catch (e) {}
  await sleep(500);
  const after = await M(READ);
  const res = { profile: PROFILE, cpu: CPU, fights: FIGHTS, peaks, top, afterGC: after && { cv: after.cv, on: after.on, off: after.off, bm: after.bm, n: after.n, by: Object.entries(after.by).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([w, mb]) => mb.toFixed(1) + ' MB  ' + w) }, errs };
  console.log('STEP                CANVAS MB (on page / off page)   BITMAPS MB   TOTAL   JS HEAP');
  for (const [k, p] of Object.entries(peaks)) console.log((k + '                    ').slice(0, 20) + (p.cv + ' (' + p.on + ' / ' + p.off + ')                         ').slice(0, 33) + (p.bm + '          ').slice(0, 13) + (p.tot + '        ').slice(0, 8) + p.heap);
  console.log('THE PEAK: ' + top.tot + ' MB at ' + top.step); top.by.forEach(l => console.log('   ' + l));
  console.log('AFTER A FORCED COLLECTION: ' + JSON.stringify(res.afterGC, null, 1));
  if (errs.length) console.log('ERRORS: ' + errs.join(' | '));
  if (JOUT) fs.writeFileSync(JOUT, JSON.stringify(res, null, 1));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
