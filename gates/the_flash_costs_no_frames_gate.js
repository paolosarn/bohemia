#!/usr/bin/env node
/* __BOHEMIA_SOLO__ -- THIS GATE COUNTS FRAMES, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   THE FLASH COSTS NO FRAMES (PLUMBER 8, 11/17/26; the coordinator's routine 'PLUMBER 8 the freezes': 'the new white flash on every shot
   (FIGHT SCREEN's 11/14l): prove it costs no dropped frames on a cheap phone in a big AUTO fight'; rule 441).
   THE PHONE: 390 x 844 at 3, touch, the CPU slowed 4x, the canvas on a GPU process (SwiftShader, the driver's GPU_ARGS), as the census.
   THE FIGHT: the fight's own page, a big road fight on AUTO at 4x: six of his men with guns against ten brigands, marksmen among them,
   the same seed both times. TWICE: the page as it ships, and the same page with ONLY the shot's flash call taken out (the server
   swaps the one line, as EVERY SHOT IS FELT's own plant does). Every frame of the top page's clock over the fight's first 30 s.
     F1 THE FLASH FIRED: the white went up on the glass (a big fight's guns, drawn frames counted) and the barrel flash was drawn
     F2 THE BIG FIGHT DROPS NO FRAME: over 30 s on AUTO at 4x, the frames with the flash at least 95% of the frames without it
     F3 THE FLASH ALONE COSTS NO FRAME: the same fight standing (his turn), the white fired three times a second at the biggest gun's
        peak (the most the rules allow) in six 2.5 s blocks against six without it (off, on, on, off, three times, so a drift over the
        blocks cancels; 9 s to settle first): the frames with it at least 90% of the frames without it (a block is about 20 frames on
        this phone), the frames over 50 ms no more than without plus one a block. A shot's
        moment in a real fight is busy on its own (the attack, the hit, its sound), so a fight alone cannot isolate the white
        (measured: 14 shots a 30 s fight, 2.3 s of their moments, 30 to 50 frames, and the planted cost read faster than none)
        WHY THERE IS NO LAYER LEG: the white is one solid element whose see-through amount changes, which the compositor lays over the
        board; on this phone the frames are set by the page's own work, and a white that only repaints (measured: a blurred full-screen
        pattern with no layer of its own) cost no frame either, so the page's time is what is judged
     P1 PLANTED: a white that costs the page 50 ms a frame while it is up (a busy wait in its tick) costs frames in F3's blocks, so F3
        can see a cost
   node gates/the_flash_costs_no_frames_gate.js    (about 4 min) */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined && x !== '' ? '  [' + x + ']' : '')); };
let chromium = null; try { ({ chromium } = require('playwright')); } catch (e) {}
const GPU_ARGS = ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--enable-gpu-rasterization', '--use-angle=swiftshader', '--enable-accelerated-2d-canvas'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.css': 'text/css', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg' };
const CALL = 'shotFelt(u, t, a.at + B * 0.35, B);   /* __EVERY_SHOT_IS_FELT__';
const GUNS = ['snub_revolver', 'handgonne', 'zip_gun', 'snub_revolver', 'handgonne', 'zip_gun'];
const OPTS = { why: 'road:1', auto: true, deploy: false, speed: 4, met: 3, district: 'suburb', cell: { gx: 40, gy: 40 }, seed: 7,
  party: { count: 10, days: 40, difficulty: 1, rolled: true, faction: 'brigands',
    band: ['brigand_marksman', 'brigand_thug', 'brigand_marksman', 'brigand_thug', 'brigand_marksman', 'brigand_thug', 'brigand_marksman', 'brigand_thug', 'brigand_marksman', 'brigand_thug'] },
  company: GUNS.map((g, i) => ({ name: i ? 'MAN ' + i : undefined, background: 'militia', level: 3, gear: { main: g } })) };
const CLOCK = "(function(){ if (window.top !== window || window.__FZ) return; var F = window.__FZ = { t: [] };"
  + " requestAnimationFrame(function tick(t) { F.t.push(t); requestAnimationFrame(tick); }); })();";

(async () => {
  console.log('\nTHE FLASH COSTS NO FRAMES: a big AUTO fight on a slowed phone, with the flash and without it\n');
  if (!chromium) { ok('a browser on this box', false); return done(); }
  let mode = 'ship';
  const srv = http.createServer((q, r) => { const rel = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, rel);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    let body = fs.readFileSync(f);
    if (/BOHEMIA_FIGHT\.html$/.test(rel)) { let s = String(body);
      const LOGSHOT = '(window.__SHOTS_AT = window.__SHOTS_AT || []).push(a.at + B * 0.35); ';   /* the shot's own moment, logged both ways */
      s = mode === 'off' ? s.replace(CALL, LOGSHOT + ';   /* __EVERY_SHOT_IS_FELT__ taken out by the frames gate') : s.replace(CALL, LOGSHOT + CALL);
      if (mode === 'cost') s = s.replace('  if (SHOT_EL && SHOT_EL._a !== a) {', '  if (a > 0) { const __t = performance.now(); while (performance.now() - __t < 50) {} }   /* PLANTED by the frames gate: a white that costs the page 50 ms a frame */\n  if (SHOT_EL && SHOT_EL._a !== a) {');
      body = s; }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' }); r.end(body); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const port = srv.address().port;
  const b = await chromium.launch({ args: GPU_ARGS });
  const run = async (m) => {
    mode = m;
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 100)));
    await p.addInitScript(([o, c]) => { window.FIGHT_OPTS = o; try { localStorage.setItem('boh.flash', 'full'); } catch (e) {} (0, eval)(c); }, [OPTS, CLOCK]);
    await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_FIGHT.html');
    await p.waitForFunction(() => typeof UI !== 'undefined' && !!UI.board && !!UI.t0 && !!DB.shot, null, { timeout: 90000 });
    const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await p.waitForTimeout(1500);
    const t0 = await p.evaluate(() => { try { handSpeed(4, true); } catch (e) {} return performance.now(); });
    await p.waitForTimeout(30000);
    const R = await p.evaluate((t0) => {
      const t = window.__FZ.t.filter(x => x > t0 && x < t0 + 30000), g = t.slice(1).map((x, i) => [x - t[i], t[i]]);
      const log = (window.__SHOTS_AT || []).filter(x => x > t0 && x < t0 + 30000 - 200), up = (x) => log.some(s => x >= s - 5 && x <= s + 200);
      /* the shots' moments as one set of windows (a volley's overlap counted once): the frames that reach the glass in them, a second */
      const win = log.map(s => [s - 5, s + 200]).sort((p, q) => p[0] - q[0]), U = [];
      win.forEach(w => { if (U.length && w[0] <= U[U.length - 1][1]) U[U.length - 1][1] = Math.max(U[U.length - 1][1], w[1]); else U.push(w.slice()); });
      const winMs = U.reduce((p, w) => p + (w[1] - w[0]), 0), winFr = t.filter(x => U.some(w => x >= w[0] && x < w[1])).length;
      const med = (a) => { const s = a.slice().sort((p, q) => p - q); return s.length ? s[s.length >> 1] : 0; };
      const fl = g.filter(e => up(e[1])).map(e => e[0]), rest = g.filter(e => !up(e[1])).map(e => e[0]);
      const el = document.getElementById('shotflash'), cs = el ? getComputedStyle(el) : null;
      return { frames: t.length, over50: g.filter(e => e[0] > 50).length, worst: Math.round(Math.max(0, ...g.map(e => e[0]))), seen: UI.shotSeen || null,
        shots: log.length, flashFrames: fl.length, flashMed: Math.round(med(fl) * 10) / 10, restMed: Math.round(med(rest) * 10) / 10, flashP90: Math.round(fl.slice().sort((p, q) => p - q)[Math.floor(fl.length * 0.9)] || 0),
        flashSum: Math.round(fl.reduce((p, q) => p + q, 0)), winMs: Math.round(winMs), winFps: winMs ? Math.round(winFr / winMs * 10000) / 10 : 0, allFps: Math.round(t.length / 30 * 10) / 10,
        willChange: cs ? cs.willChange : null, over: !!(FIGHT.S && FIGHT.S.over) };
    }, t0);
    R.errs = errs.length; await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {}); await ctx.close(); return R;
  };
  /* THE FLASH ALONE: the same fight standing (his turn, nobody moving but the board's own life), the white fired three times a second
     at the biggest gun's peak (the most the rules let it, shotgun 0.74) in blocks of 3 s, flash and no flash in turn (ABAB, so the box's
     drift cancels): the frames that reach the glass in each block */
  const alone = async (m) => {
    mode = m;
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }), p = await ctx.newPage();
    await p.addInitScript(([o, c]) => { window.FIGHT_OPTS = Object.assign({}, o, { auto: false }); try { localStorage.setItem('boh.flash', 'full'); } catch (e) {} (0, eval)(c); }, [OPTS, CLOCK]);
    await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_FIGHT.html');
    await p.waitForFunction(() => typeof UI !== 'undefined' && !!UI.board && !!UI.t0 && !!DB.shot, null, { timeout: 90000 });
    const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await p.waitForTimeout(2500);
    const B = await p.evaluate(async () => {
      const sleep = (ms) => new Promise(r => setTimeout(r, ms)), F = window.__FZ.t, out = [];
      await sleep(9000);   /* settle, not counted (measured: the page standing draws two to five times faster for its first seconds) */
      const PAT = [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0];   /* off, on, on, off: a drift over the blocks cancels */
      for (let k = 0; k < PAT.length; k++) {
        const on = PAT[k] === 1, t0 = performance.now(); let iv = null, n = 0;
        if (on) iv = setInterval(() => { UI.shotSeen = UI.shotSeen || { fired: 0, white: 0, volley: 0, held: 0, barrel: 0, drawn: 0, peak: 0 }; (UI.shots = UI.shots || []).push({ at: performance.now(), kind: 'shotgun', shots: 1, soft: false, n0: 0 }); n++; if (UI.shots.length > 40) UI.shots.shift(); }, 334);
        await sleep(2500); if (iv) clearInterval(iv);
        const t1 = performance.now(), fr = F.filter(x => x >= t0 && x < t1), g = fr.slice(1).map((x, i) => x - fr[i]);
        out.push({ on, flashes: n, frames: fr.length, over50: g.filter(x => x > 50).length, drawn: (UI.shotSeen && UI.shotSeen.drawn) | 0 });
        await sleep(400);
      }
      return out;
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {}); await ctx.close();
    const sum = (on, k) => B.filter(x => x.on === on).reduce((p, x) => p + x[k], 0);
    return { blocks: B, onFr: sum(true, 'frames'), offFr: sum(false, 'frames'), onLong: sum(true, 'over50'), offLong: sum(false, 'over50'), flashes: sum(true, 'flashes'), drawn: B[B.length - 1].drawn };
  };
  try {
    const A = await run('ship'), O = await run('off');
    const S = A.seen || {};
    ok('F1 THE FLASH FIRED: the white went up on the glass and the barrel flash was drawn', S.white > 0 && S.drawn > 0 && (S.barrelDrawn | 0) > 0 && A.flashFrames > 0,
      JSON.stringify({ fired: S.fired, white: S.white, volley: S.volley, held: S.held, drawn: S.drawn, barrelDrawn: S.barrelDrawn, flashFrames: A.flashFrames }));
    ok('F2 THE BIG FIGHT DROPS NO FRAME: over its 30 s on AUTO at 4x, the frames with the flash at least 95% of the frames without it',
      A.frames >= O.frames * 0.95, 'with ' + A.frames + ' frames (' + A.allFps + ' a second), ' + A.over50 + ' over 50 ms; without ' + O.frames + ' frames (' + O.allFps + ' a second), ' + O.over50 + ' over 50 ms; '
      + A.shots + ' and ' + O.shots + ' shots');
    const L = await alone('ship');
    ok('F3 THE FLASH ALONE COSTS NO FRAME: the white three times a second at the biggest gun\'s peak, in 2.5 s blocks against as many without it (off, on, on, off, three times): the frames with it at least 90% of the frames without it, and no more frames over 50 ms than without it plus one a block',
      L.flashes >= 40 && L.drawn > 0 && L.onFr >= L.offFr * 0.9 && L.onLong <= L.offLong + 6,
      'with the white ' + L.onFr + ' frames, ' + L.onLong + ' over 50 ms (' + L.flashes + ' flashes); without ' + L.offFr + ' frames, ' + L.offLong + ' over 50 ms; blocks ' + L.blocks.map(x => (x.on ? 'W' : '-') + x.frames).join(' '));
    const P = await alone('cost');
    ok('P1 PLANTED: a white that costs the page 50 ms a frame while it is up costs frames in F3\'s blocks (F3 sees a cost)',
      P.onFr < P.offFr * 0.9 || P.onLong > P.offLong + 6, 'with the planted white ' + P.onFr + ' frames, ' + P.onLong + ' over 50 ms; without ' + P.offFr + ' frames, ' + P.offLong + ' over 50 ms; blocks ' + P.blocks.map(x => (x.on ? 'W' : '-') + x.frames).join(' '));
    ok('A1 no page error in the two fights', !A.errs && !O.errs, [A.errs, O.errs].join(' / '));
  } catch (e) { ok('the fights ran', false, String(e && e.message || e).slice(0, 240)); }
  await b.close(); srv.close();
  return done();
  function done() { console.log('\nTHE FLASH COSTS NO FRAMES: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); }
})();
