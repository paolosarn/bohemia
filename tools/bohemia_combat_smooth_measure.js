#!/usr/bin/env node
/* COMBAT [smooth] (rule 121, Paolo 10/19: 'combat is still not smooth, it still sucks, it looks like it's been coded by a
   fifth grader'). THE STOPWATCH ON THE FIGHT: the same three numbers before and after, on his phone's profile (the one
   driver, 390 x 844 at 3x, the CPU throttled 4x like THE ONE STOPWATCH), at the real beat (speed 1, 120 BPM):
     1. FRAME TIMES over a whole AUTO fight: median, 95th, 99th, worst, and how many frames took longer than two frames
        (33 ms, a hitch the eye sees).
     2. THE DEAD PAUSE: while it is not his turn to decide (their move, or his men on AUTO), the time the board stands
        still: no man moving, no blow playing, no camera gliding. The longest one and the share of the fight.
     3. TAP TO MOTION: his finger confirms a walk (the second tap on the tile), how long until the man moves; his finger
        ends the turn, how long until the next man does something.
   Run: node tools/bohemia_combat_smooth_measure.js [label] [--seed N] [--secs S] [--throttle T]
   Writes records/target/combat/BOHEMIA_COMBAT_SMOOTH_<label>.json */
'use strict';
const fs = require('fs');
const path = require('path');
const { open } = require('./bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
const A = process.argv.slice(2);
const opt = (k, d) => { const i = A.indexOf(k); return i >= 0 ? Number(A[i + 1]) : d; };
const LABEL = A[0] && !A[0].startsWith('--') ? A[0] : 'now';
const SEED = opt('--seed', 5), SECS = opt('--secs', 90), THROTTLE = opt('--throttle', 4);

/* in the page before its own script: a frame clock and a stillness clock, read off the fight's own state every frame */
const ARM = `window.__sm = { f: [], dead: [], d0: 0, busyF: 0, allF: 0, up: 0, lat: [], endUp: 0, endLat: [] };
(function () {
  const raf = window.requestAnimationFrame.bind(window); let last = 0;
  function busy(U) { return !!(U.glide || (U.anim && U.anim.length && U.anim[0].at) || (U.busy && U.busy())); }
  function loop(t) {
    raf(loop);
    const M = window.__sm; if (last) M.f.push(t - last); last = t;
    const U = window.FIGHT_UI; if (!U || !U.board || typeof FIGHT === 'undefined' || !FIGHT.S) return;
    const S = FIGHT.S, u = FIGHT.current(), now = performance.now();
    const mine = u && u.side === 'you' && !U.auto && u.morale !== 'Fleeing';
    const b = busy(U);
    if (M.up && b) { M.lat.push(now - M.up); M.up = 0; }
    if (M.endUp && b && u && !mine) { M.endLat.push(now - M.endUp); M.endUp = 0; }
    if (S.over || S.deploy || mine || b) { if (M.d0) { M.dead.push(now - M.d0); M.d0 = 0; } if (!S.over && !S.deploy) { M.allF++; if (b) M.busyF++; } return; }
    M.allF++; if (!M.d0) M.d0 = now;
  }
  raf(loop);
})();`;

const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0; };
const r1 = x => Math.round(x * 10) / 10;

async function autoFight() {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, throttle: THROTTLE,
    arm: ARM + 'window.FIGHT_OPTS={seed:' + SEED + ',speed:1,kind:"suburb",auto:true}' });
  const p = d.page;
  const t0 = Date.now();
  while (Date.now() - t0 < 40000 && !(await p.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board))) await p.waitForTimeout(200);
  await p.evaluate(() => { window.__sm.f = []; window.__sm.dead = []; window.__sm.d0 = 0; window.__sm.busyF = 0; window.__sm.allF = 0; });
  const t1 = Date.now();
  while (Date.now() - t1 < SECS * 1000 && !(await p.evaluate(() => FIGHT.S.over))) await p.waitForTimeout(500);
  const M = await p.evaluate(() => { const M = window.__sm; if (M.d0) M.dead.push(performance.now() - M.d0); return { f: M.f, dead: M.dead, busyF: M.busyF, allF: M.allF, over: FIGHT.S.over, round: FIGHT.S.round }; });
  await d.close();
  const f = M.f.slice(3), deadSum = M.dead.reduce((a, b) => a + b, 0), secs = f.reduce((a, b) => a + b, 0) / 1000;
  return { seconds: r1(secs), frames: f.length, fps: r1(f.length / Math.max(.001, secs)), median_ms: r1(q(f, .5)), p95_ms: r1(q(f, .95)), p99_ms: r1(q(f, .99)), worst_ms: r1(Math.max.apply(null, f)),
    hitches_over_33ms: f.filter(x => x > 33.4).length, dead_longest_ms: Math.round(Math.max(0, ...M.dead)), dead_total_s: r1(deadSum / 1000),
    dead_share: r1(100 * deadSum / 1000 / Math.max(.001, secs)), dead_over_500ms: M.dead.filter(x => x > 500).length, ended: !!M.over, rounds: M.round };
}

async function tapFight() {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, throttle: THROTTLE,
    arm: ARM + 'window.FIGHT_OPTS={seed:' + SEED + ',speed:1,kind:"suburb"}' });
  const p = d.page;
  const until = async (fn, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p.evaluate(fn)) return true; await p.waitForTimeout(50); } return false; };
  await until(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board, 40000);
  const btn = async id => { const b = await p.evaluate(i => { const r = document.getElementById(i).getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, id); await p.mouse.click(b[0], b[1]); };
  if (await p.evaluate(() => FIGHT.S.deploy)) { await p.waitForTimeout(2600); await btn('bend'); }
  const walks = [], ends = [];
  for (let n = 0; n < 4; n++) {
    if (!(await until(() => { const u = FIGHT.current(); return FIGHT.S.over || (u && u.side === 'you' && !FIGHT_UI.anim.length && !FIGHT_UI.glide); }, 60000))) break;
    if (await p.evaluate(() => FIGHT.S.over)) break;
    /* a tile he can walk to, two or more away, on the glass */
    const t = await p.evaluate(() => { const u = FIGHT.current(), S = FIGHT.S, f = FIGHT.reach(u, null, true);
      const ks = Object.keys(f.best).map(Number).map(k => ({ x: k % S.w, y: Math.floor(k / S.w) }))
        .filter(t => Math.abs(t.x - u.x) + Math.abs(t.y - u.y) >= 2 && !S.units.some(v => FIGHT.onField(v) && v.x === t.x && v.y === t.y) && FIGHT.pathTo(u, t.x, t.y, f))
        .map(t => ({ X: sx((t.x + .5) * FIGHT_UI.tw), Y: sy((t.y + .5) * FIGHT_UI.th) }))
        .filter(q => q.X > 20 && q.X < innerWidth - 20 && q.Y > TOPH + 20 && q.Y < innerHeight - BOTH - 20);
      return ks[0] || null; });
    if (!t) { await btn('bend'); continue; }
    await p.mouse.click(t.X, t.Y); await p.waitForTimeout(250);
    await p.evaluate(() => { window.__sm.up = performance.now(); });
    await p.mouse.click(t.X, t.Y);
    await until(() => !window.__sm.up, 3000);
    walks.push(await p.evaluate(() => window.__sm.lat[window.__sm.lat.length - 1]));
    await until(() => !FIGHT_UI.anim.length, 8000);
    if (await p.evaluate(() => { const u = FIGHT.current(); return u && u.side === 'you' && !FIGHT.S.over; })) {
      await p.evaluate(() => { window.__sm.endUp = performance.now(); });
      await btn('bend');
      await until(() => !window.__sm.endUp || FIGHT.S.over, 15000);
      const e = await p.evaluate(() => window.__sm.endLat[window.__sm.endLat.length - 1]);
      if (e !== undefined) ends.push(e);
    }
  }
  await d.close();
  return { walk_confirm_to_motion_ms: walks.map(Math.round), end_turn_to_their_first_motion_ms: ends.map(Math.round),
    worst_walk_ms: Math.round(Math.max(0, ...walks)), worst_end_ms: Math.round(Math.max(0, ...ends)) };
}

(async () => {
  const auto = await autoFight();
  const taps = await tapFight();
  const out = { label: LABEL, seed: SEED, throttle: THROTTLE, profile: '390x844 @3x, the one driver', speed: 1, auto, taps,
    file_md5: require('crypto').createHash('md5').update(fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'))).digest('hex') };
  const dir = path.join(ROOT, 'records/target/combat'); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'BOHEMIA_COMBAT_SMOOTH_' + LABEL.toUpperCase() + '.json'), JSON.stringify(out, null, 1) + '\n');
  console.log(JSON.stringify(out, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
