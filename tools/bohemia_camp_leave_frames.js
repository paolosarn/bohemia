/* MOTION 3, ask row 560 (THE CAMP LETS GO WHEN HE LEAVES): one leave of a street camp, the demo upright, the CPU slowed 4x, the camp made
   by the phone's HEAL and left by HEAL again 1.5 s in (its board still baking), every frame the page drew and every long task (with its
   page) for 6 s from the tap, the camp's board page kept (OFF=1, the way it was) or let go; written as JSON for the VOTE card's picture
   (tools/bohemia_camp_leave_picture.py).   OFF=1 node tools/bohemia_camp_leave_frames.js OUT.json */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const C = require(path.join(ROOT, 'tools/bohemia_freeze_census.js'));
(async () => {
  const OFF = process.env.OFF === '1', OUT = process.argv[2];
  const d = await D.open({ profile: 'phone_portrait', door: 180000, engage: true, pages: true, throttle: 4, arm: C.CLOCK + (OFF ? ';window.__CAMP_LEAVE_KEEPS_BOARD=true;' : '') });
  const p = d.page, fr = d.fr, sleep = (ms) => new Promise(r => setTimeout(r, ms));
  await sleep(3000);
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await sleep(2500);
  await fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
  const btn = (sel) => p.evaluate((sel) => { const e = [...document.querySelectorAll(sel)].find(x => x.getBoundingClientRect().width > 0); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, sel);
  const heal = async () => { const h = await btn('#bohphone.on .app[data-app=heal]'); if (h) await p.touchscreen.tap(h[0], h[1]); else await fr.evaluate(() => BohemiaMapCamp.toggle()); };
  await heal();
  for (let i = 0; i < 80; i++) { if (await fr.evaluate(() => !!(window.__CAMP && __CAMP.on && LOOP.open && LOOP.open.camp))) break; await sleep(150); }
  await sleep(1500);
  const t0 = await fr.evaluate(() => { const W = window.__LV = { t0: top.performance.now(), brk: null, gone: null }; W.iv = setInterval(function () { var t = top.performance.now() - W.t0; if (W.brk == null && window.__CAMP && !__CAMP.on) W.brk = t; if (W.brk != null && W.gone == null && !top.document.getElementById('campboardframe')) W.gone = t; if (t > 6500) clearInterval(W.iv); }, 50); return W.t0; });
  await heal();
  await sleep(6300);
  const W = await fr.evaluate(() => ({ brk: window.__LV.brk, gone: window.__LV.gone }));
  const fz = await p.evaluate((t0) => { const F = window.__FZ; return { frames: F.t.filter(x => x > t0 - 20 && x < t0 + 6000).map(x => Math.round(x - t0)), long: F.long.filter(l => l[0] > t0 - 20 && l[0] < t0 + 6000).map(l => [Math.round(l[0] - t0), Math.round(l[1]), (l[2] || 'top').replace(/^.*\//, '')]) }; }, t0);
  const out = { off: OFF, brk: W.brk == null ? null : Math.round(W.brk), gone: W.gone == null ? null : Math.round(W.gone), frames: fz.frames, long: fz.long };
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out)); else console.log(JSON.stringify(out));
  const g = out.frames.slice(1).map((x, i) => x - out.frames[i]); console.log((OFF ? 'the way it was' : 'let go') + ': ' + out.frames.length + ' frames in 6 s, worst gap ' + Math.max(...g) + ' ms, the board page\'s tasks ' + out.long.filter(l => /FIGHT/.test(l[2])).length);
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
