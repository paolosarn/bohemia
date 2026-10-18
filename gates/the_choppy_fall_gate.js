#!/usr/bin/env node
/* THE CHOPPY FALL (ANIMATION [the shadow line and the choppy fall], 10/18; his thirteenth-vote note on the ragdoll:
   'choppy, not smooth, a little too slow'). __THE_CHOPPY_FALL__ (slices/BOHEMIA_ALPHA_0_9.html): the physics untouched,
   the CLOCK changed: the clip plays the simulation's first RAGDOLL.play.secs in play.beats on play.keys pictures.
   Asked in the alpha (chromium through the one driver), the four kinds (blow, shot, club, roof) x eight facings, of the
   pictures the clip actually draws (the phase (i + 0.5) / keys, style guide field 15's rule):
     SMOOTH: no joint moves more than 28 px from one drawn picture to the next (it was 54), 9 on average (it was 14);
     FASTER: he is down (the torso past 70 degrees) within 0.75 s of wall clock on the blow and 0.9 s on every kind and
             facing (it was up to 1.6 s), and the clip is two beats;
     NO POP AT THE END: the last drawn picture is within 3 px of the body at rest, so the dead pose that follows holds;
     THE PHYSICS IS THE SAME: gravity 560 at his scale, the 1/240 s step, two seconds simulated;
     THE TEST BITES: the old clock (12 pictures over 4 beats of 2 s) fails SMOOTH and FASTER. */
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, why) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n + (why ? '  [' + why + ']' : ''))); };
const done = () => { console.log('\nTHE CHOPPY FALL GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const src = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), 'utf8');
ok('the clip is two beats in the bank and the clock is one knob (RAGDOLL.play)', /'take-hit':1,ragdoll:2,/.test(src) && /play:\{secs:1\.8,beats:2,keys:24\}/.test(src));
(async () => {
  const d = await open({ alpha: true }); let ready = false;
  for (let i = 0; i < 240 && !ready; i++) { ready = await d.page.evaluate(() => typeof ragdollSim === 'function' && typeof RIG !== 'undefined' && RIG && Object.keys(RIG).length > 0).catch(() => false); if (!ready) await d.page.waitForTimeout(500); }
  if (!ready) { ok('the alpha boots and exposes its rig', false); await d.browser.close(); return done(); }
  const r = await d.page.evaluate(() => {
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'], KINDS = ['blow', 'shot', 'club', 'roof'];
    const phys = { g: RAGDOLL.g, dt: RAGDOLL.dt, secs: RAGDOLL.secs };
    const sims = {}; for (const kind of KINDS) for (const dd of DIRS) sims[kind + '|' + dd] = ragdollSim(RIG[dd], fallSide(dd), RAGDOLL.seed, kind);
    const tang = f => Math.abs(Math.atan2(f.neck[0] - f.waC[0], -(f.neck[1] - f.waC[1]))) * 180 / Math.PI;
    /* the clip as ragdollPose samples it: phase t -> the snapshot at t * secs (one every 1/120 s) */
    const judge = (play, beats) => { let peak = 0, sum = 0, n = 0, res = 0, slow = [], worst = '';
      for (const k in sims) { const F = sims[k], at = t => F[Math.min(F.length - 1, Math.round(t * play.secs * 120))];
        const ks = []; for (let i = 0; i < play.keys; i++) ks.push(at((i + 0.5) / play.keys));
        for (let i = 1; i < ks.length; i++) { let mv = 0; for (const j in ks[i]) mv = Math.max(mv, Math.hypot(ks[i][j][0] - ks[i - 1][j][0], ks[i][j][1] - ks[i - 1][j][1])); if (mv > peak) { peak = mv; worst = k + ' key ' + i; } sum += mv; n++; }
        let down = -1; for (let i = 0; i < ks.length; i++) if (tang(ks[i]) > 70) { down = (i + 0.5) / play.keys * beats * 0.5; break; }
        const bar = k.startsWith('blow') ? 0.75 : 0.9;   /* the blow topples; a shot or a club on two facings slumps propped on an arm first (measured 10/18: 0.81 to 0.90 s) */
        if (down < 0 || down > bar) slow.push(k + ' ' + (down < 0 ? 'never' : down.toFixed(2) + ' s'));
        const L = F[F.length - 1], last = ks[ks.length - 1]; let rr = 0; for (const j in L) rr = Math.max(rr, Math.hypot(L[j][0] - last[j][0], L[j][1] - last[j][1])); res = Math.max(res, rr); }
      return { peak, mean: sum / n, res, slow, worst }; };
    return { phys, now: judge(RAGDOLL.play, ANIMBEATS.ragdoll), old: judge({ secs: 2.0, keys: 12 }, 4), beats: ANIMBEATS.ragdoll }; });
  const N = r.now, O = r.old;
  console.log('         now: biggest jump ' + N.peak.toFixed(1) + ' px (' + N.worst + '), average ' + N.mean.toFixed(1) + ', the last picture ' + N.res.toFixed(1) + ' px from rest');
  console.log('         old: biggest jump ' + O.peak.toFixed(1) + ' px, average ' + O.mean.toFixed(1) + ', slow on ' + O.slow.length + ' of 32');
  ok('THE PHYSICS IS THE SAME: gravity 560, the 1/240 s step, two seconds simulated', r.phys.g === 560 && Math.abs(r.phys.dt - 1 / 240) < 1e-9 && r.phys.secs === 2.0, JSON.stringify(r.phys));
  ok('SMOOTH: no joint jumps more than 28 px between two drawn pictures (4 kinds x 8 facings)', N.peak <= 28, N.peak.toFixed(1) + ' at ' + N.worst);
  ok('SMOOTH: 9 px or less on average between two drawn pictures', N.mean <= 9, N.mean.toFixed(1));
  ok('FASTER: the blow down within 0.75 s of wall clock and every kind within 0.9 s (it was up to 1.6), the clip two beats', r.beats === 2 && !N.slow.length, N.slow.join(', '));
  ok('NO POP AT THE END: the last drawn picture within 3 px of the body at rest', N.res <= 3, N.res.toFixed(1));
  ok('THE TEST BITES: the old clock (12 pictures over 4 beats) fails smooth and faster', O.peak > 28 && O.slow.length > 0, O.peak.toFixed(1) + ' / ' + O.slow.length);
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
