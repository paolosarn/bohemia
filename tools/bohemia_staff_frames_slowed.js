#!/usr/bin/env node
// STAFF 2 [staff frames] 11/26 -- VAMILY rule 480(c) on the staff as built (rules 468, 470(a), 471): A FIGHT WITH FIVE STAFF AND THEIR CARTS
// HOLDS ITS FRAMES ON A SLOWED PHONE. The demo, his phone upright (390 x 844 at 3), the CPU slowed 4x, the GPU's canvas on (the driver's gpu:
// a phone draws on its GPU, off the page's thread; PLUMBER 7's way), one valley, a road crew off the town through the one driver, AUTO from the
// bell to the end. Every frame the fight's glass draws is timed (requestAnimationFrame in the fight's own frame) from the board standing to the
// end, in three spans: THE START (the first 3 s of the board), THE FIGHT (the rest), and the whole. A HITCH is a frame past 50 ms (rule 480(d)).
// --control: the same walk with no camp (the frame clock's control). --camp N: N staff (default 5). Writes <out>/frames_<tag>.json.
//   node tools/bohemia_staff_frames_slowed.js [--control] [--throttle 4] [--secs 45] [--alpha] [--out dir]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const A = process.argv.slice(2), arg = (k, d) => { const i = A.indexOf(k); return i >= 0 ? A[i + 1] : d; };
const CONTROL = A.includes('--control'), ALPHA = A.includes('--alpha'), THROTTLE = Number(arg('--throttle', 4)), SECS = Number(arg('--secs', 45));
const N = CONTROL ? 0 : Number(arg('--camp', 5)), CODE = arg('--code', 'K7QM9X'), OUTD = path.resolve(ROOT, arg('--out', 'records/target/staff_cart'));
const CAMP = ['cook', 'surgeon', 'blacksmith', 'scout', 'quartermaster'].slice(0, N), TAG = (ALPHA ? 'alpha' : 'demo') + (CONTROL ? '_control' : '_camp' + N) + (A.includes('--nocart') ? '_nocart' : '') + '_x' + THROTTLE;
fs.mkdirSync(OUTD, { recursive: true });

(async () => {
  const arm = "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "');" +
    " var c = { cart: 0, retinue: " + JSON.stringify(CAMP) + ", carts: { surgeon: 1, blacksmith: 2 }, __framesProof: 1 }; localStorage.setItem('bohemia.camp.v1', JSON.stringify(c)); } catch (e) {}";
  const d = await drive.open({ profile: 'phone_portrait', alpha: ALPHA, fog: false, keepCards: true, arm, throttle: THROTTLE, gpu: true });
  const page = d.page, errs = [], out = { tag: TAG, throttle: THROTTLE, camp: CAMP };
  page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  try {
    await page.waitForTimeout(4000);
    await page.evaluate(() => { window.__PLAY_BEGAN = true; });
    await d.fr.evaluate((sup) => { localStorage.setItem('bohemia.supplies.v1', JSON.stringify(sup)); }, { food: 40, meds: 20, tape: 30, rounds: 60 });
    const c = await drive.roadFightOffTheTown(d, null, 180000);
    if (!c) throw new Error('no road fight stood');
    /* the clock from the board standing: every frame's gap, the time it came at */
    await c.evaluate((secs) => { window.__SF = { t0: performance.now(), gaps: [], at: [] }; let last = performance.now();
      const tick = (t) => { const S = window.__SF; S.gaps.push(t - last); S.at.push(t - S.t0); last = t; if (t - S.t0 < secs * 1000 && !S.stop) requestAnimationFrame(tick); else S.t1 = t; };
      requestAnimationFrame(tick); }, SECS);
    await page.waitForTimeout(1500);
    /* who thinks how long: every AI step timed, a staff member's against a fighter's (the frame it runs in pays for it) */
    await c.evaluate(() => { const F = FIGHT, aim = F.aiStep; window.__AI = { staff: [], fighter: [], them: [] };
      F.aiStep = function (u) { const t = performance.now(), r = aim.apply(this, arguments), ms = performance.now() - t; (u && u.staff ? __AI.staff : u && u.side === 'you' ? __AI.fighter : __AI.them).push(ms); return r; }; });
    /* what the carts cost to draw: every cart layer of every staff member timed (the page's own function, wrapped where it lives) */
    out.cartClock = await c.evaluate(() => { if (typeof cartLayer !== 'function') return 'no cartLayer'; const f0 = cartLayer; window.__CL = { ms: 0, n: 0, worst: 0 };
      window.cartLayer = function () { const t = performance.now(), r = f0.apply(this, arguments), ms = performance.now() - t; __CL.ms += ms; __CL.n++; if (ms > __CL.worst) __CL.worst = ms; return r; };
      return cartLayer !== f0 ? 'wrapped' : 'not wrapped'; }).catch(e => String(e).slice(0, 80));
    if (A.includes('--nocart')) await c.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.staff) u.cart = null; }); });
    await c.evaluate(() => { FIGHT_UI.auto = true; });
    const t0 = Date.now();
    while (Date.now() - t0 < SECS * 1000 + 4000) { await page.waitForTimeout(1000); if (await c.evaluate(() => !!(window.__SF && window.__SF.t1)).catch(() => true)) break;
      if (await c.evaluate(() => FIGHT.S.over).catch(() => true)) { await c.evaluate(() => { window.__SF.stop = true; }).catch(() => {}); await page.waitForTimeout(300); break; } }
    const F = await c.evaluate(() => { const S = window.__SF; return { gaps: S.gaps.slice(1), at: S.at.slice(1), over: FIGHT.S.over, rounds: FIGHT.S.round,
      staff: FIGHT.S.units.filter(u => u.staff).length, carts: Object.keys(FIGHT_UI.cartDrawn || {}).length, men: FIGHT.S.units.length }; });
    const span = (lo, hi) => { const g = F.gaps.filter((x, i) => F.at[i] >= lo && F.at[i] < hi); if (!g.length) return null; const s = g.slice().sort((a, b) => a - b), ms = g.reduce((a, b) => a + b, 0);
      return { frames: g.length, fps: +(1000 * g.length / ms).toFixed(1), median: +s[Math.floor(s.length / 2)].toFixed(1), p95: +s[Math.floor(s.length * 0.95)].toFixed(1), worst: Math.round(s[s.length - 1]), hitches: g.filter(x => x > 50).length, over33: g.filter(x => x > 33.4).length }; };
    out.start = span(0, 3000); out.fight = span(3000, 1e9); out.whole = span(0, 1e9);
    out.fightInfo = { over: F.over, rounds: F.rounds, staff: F.staff, cartsDrawn: F.carts, men: F.men };
    out.ai = await c.evaluate(() => { const st = (a) => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y); return { n: a.length, median: +s[Math.floor(s.length / 2)].toFixed(1), worst: Math.round(s[s.length - 1]), over50: a.filter(x => x > 50).length, total: Math.round(a.reduce((x, y) => x + y, 0)) }; };
      return { staff: st(__AI.staff), fighter: st(__AI.fighter), them: st(__AI.them) }; }).catch(() => null);
    out.carts = await c.evaluate((fr) => window.__CL ? { layers: __CL.n, ms: +__CL.ms.toFixed(1), perFrame: +(__CL.ms / Math.max(1, fr)).toFixed(2), worst: +__CL.worst.toFixed(2) } : null, F.gaps.length).catch(() => null);
    out.worstAt = F.gaps.map((g, i) => [Math.round(g), Math.round(F.at[i])]).sort((a, b) => b[0] - a[0]).slice(0, 8);
  } catch (e) { out.err = String(e && e.message || e).slice(0, 300); }
  out.errs = errs.slice(0, 5);
  fs.writeFileSync(path.join(OUTD, 'frames_' + TAG + '.json'), JSON.stringify(out, null, 1));
  const f = (s) => s ? s.fps + ' fps, median ' + s.median + ' ms, p95 ' + s.p95 + ', worst ' + s.worst + ' ms, ' + s.hitches + ' past 50 ms of ' + s.frames : 'none';
  console.log(TAG + (out.err ? ' ERR ' + out.err : '') + ' | ' + JSON.stringify(out.fightInfo) + '\n  start: ' + f(out.start) + '\n  fight: ' + f(out.fight) + '\n  whole: ' + f(out.whole) + '\n  AI step ms: ' + JSON.stringify(out.ai) + '\n  the carts drawn (' + out.cartClock + '): ' + JSON.stringify(out.carts) + '\n  worst frames [ms, at ms]: ' + JSON.stringify(out.worstAt) + (errs.length ? '\n  errors ' + errs.join(' / ') : ''));
  await d.close().catch(() => {});
})();
