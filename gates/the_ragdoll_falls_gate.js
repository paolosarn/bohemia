#!/usr/bin/env node
/* THE RAGDOLL FALLS (ANIMATION [ragdoll], 10/13). PAOLO 10/10, NO on the posed fall: 'why is it so hard to get ragdoll
   physics, bro?'. The rig now has ragdoll (3 beats): this facing's own rest skeleton as particles, rigid bones, a rigid
   torso and head, one minimum-distance limit at each knee, elbow and hip, a floor with friction, gravity at the body's
   scale, a seeded blow; simulated once, sampled on the twelve-key grid, drawn upright and turned (rollFrame).
   Asked in the alpha (chromium through the one driver, playwright), the player and four long-garment outfits, all eight
   facings, of the SIMULATION (ragdollSim, every 1/120 s) and of the rig's OWN FRAMES (buildFrame):
     physics: no bone stretches; nothing goes through the floor; every joint limit holds; NO POP (the 7/17 ragdoll died
     of 17-20 px single-frame jumps); he falls (the torso goes past 60 degrees, the weight drops); he COMES TO REST;
     the same seed falls the same way twice and another seed falls another way (physics, not a pose);
     pictures: the dead lie flat with the head at one end on the ground; nothing cut by the frame; nothing missing;
     eight facings, eight different dead. CONTROL: the old dead (sleep@0) fail the flat ruler. */
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, why) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n + (why ? '  [' + why + ']' : ''))); };
const done = () => { console.log('\nTHE RAGDOLL FALLS GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const src = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), 'utf8');
ok('the clip is in the bank on the grid (four beats), not a loop, and routed to the simulation',
  /ragdoll:4,/.test(src) && /const TERMINAL=\{[^}]*ragdoll:1/.test(src) && /if\(clip==='ragdoll'\)return ragdollPose\(d,ph\);/.test(src));

(async () => {
  const d = await open({ alpha: true });
  let ready = false;
  for (let i = 0; i < 240 && !ready; i++) { ready = await d.page.evaluate(() => typeof ragdollSim === 'function' && typeof buildFrame === 'function'
    && !!window.FACTION_LOOKS && !!window.CITY_CAST_LOOKS).catch(() => false); if (!ready) await d.page.waitForTimeout(500); }
  if (!ready) { ok('the alpha boots and exposes its rig', false); await d.browser.close(); return done(); }
  const r = await d.page.evaluate(() => {
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'], LOOKS = ['you', 'faction_reds', 'cast_longcoat', 'cast_cape', 'faction_church'];
    const HEAD = { 1: 1, 2: 1 };
    const set = (id) => { const m = id === 'you' ? null : (id.startsWith('cast_') ? CITY_CAST_LOOKS.filter(x => 'cast_' + x.id === id)[0]
      : FACTION_LOOKS.filter(x => 'faction_' + x.faction.toLowerCase() === id)[0]);
      if (m) { window.G_WORN = m.worn; G.bodyVar = m.dials; G.age = m.age || 'adult'; } rebuildFromRig(); FRAME_CACHE.map.clear(); };
    const keep = [window.G_WORN, G.bodyVar, G.age];
    const meas = (f) => { let n = 0, mnx = 1e9, mxx = -1, mny = 1e9, mxy = -1, hx = 0, hy = 0, hn = 0, edge = 0;
      for (let i = 0; i < f.px.length; i++) { if (!f.px[i]) continue; const x = i % f.CW, y = (i / f.CW) | 0; n++;
        if (x < mnx) mnx = x; if (x > mxx) mxx = x; if (y < mny) mny = y; if (y > mxy) mxy = y;
        if (x === 0 || x === f.CW - 1 || y === 0) edge++; if (f.grid && HEAD[f.grid[i]]) { hx += x; hy += y; hn++; } }
      return { n, w: mxx - mnx + 1, h: mxy - mny + 1, top: mny, l: mnx, r: mxx, hx: hn ? hx / hn : null, hy: hn ? hy / hn : null, edge,
               sig: f.px.map(p => p ? (p[0] << 16 | p[1] << 8 | p[2]) : -1).join(',') }; };
    let standH = 100; const flat = (m) => m.w >= 1.5 * m.h && m.h <= 0.55 * standH;
    const headDown = (m) => m.hx !== null && (Math.min(m.hx - m.l, m.r - m.hx) <= 0.3 * m.w) && (m.hy - m.top >= 0.2 * m.h || m.h <= 30);
    const BONES = [['waC','neck'],['neck','headTop'],['neck','shL'],['neck','shR'],['shL','elL'],['shR','elR'],['elL','handL'],['elR','handR'],['waC','waA'],['waC','waB'],['waA','knA'],['waB','knB'],['knA','footA'],['knB','footB']];
    const out = { sets: 0, stretch: 0, below: 0, limit: 0, pop: 0, popAt: '', notFall: [], restless: [], notSame: 0, notOther: 0, notFlat: [], notHead: [], ctrlBad: 0, ctrlN: 0, cut: [], lost: [], minKeep: 9, distinct: 0 };
    try {
      for (const L of LOOKS) { set(L); const deads = [];
        for (const dir of DIRS) { out.sets++;
          const R = RIG[dir], h = fallSide(dir), D = (a, b) => Math.hypot(R[a][0] - R[b][0], R[a][1] - R[b][1]);
          const F = ragdollSim(R, h, 1), gy = Math.max(R.footA[1], R.footB[1]) + 4;   /* the sim's floor: under the soles by the feet's thickness */
          const lim = [['waA','footA',0.85 * (D('waA','knA') + D('knA','footA'))],['waB','footB',0.85 * (D('waB','knB') + D('knB','footB'))],
            ['shL','handL',0.55 * (D('shL','elL') + D('elL','handL'))],['shR','handR',0.55 * (D('shR','elR') + D('elR','handR'))]];
          for (let i = 0; i < F.length; i++) { const f = F[i];
            for (const [a, b] of BONES) { const e = Math.abs(Math.hypot(f[b][0] - f[a][0], f[b][1] - f[a][1]) - D(a, b)); if (e > out.stretch) out.stretch = e; }
            for (const j in f) out.below = Math.max(out.below, f[j][1] - gy);
            for (const [a, b, M] of lim) out.limit = Math.max(out.limit, M - Math.hypot(f[b][0] - f[a][0], f[b][1] - f[a][1]));
            if (i) for (const j in f) { const m = Math.hypot(f[j][0] - F[i - 1][j][0], f[j][1] - F[i - 1][j][1]); if (m > out.pop) { out.pop = m; out.popAt = L + '/' + dir + '/' + j + '@' + i; } } }
          const ang = (fr) => Math.abs(Math.atan2(fr.neck[1] - fr.waC[1], fr.neck[0] - fr.waC[0]) - Math.atan2(R.neck[1] - R.waC[1], R.neck[0] - R.waC[0])) * 57.3;
          const mean = (fr) => { let s = 0, n = 0; for (const j in fr) { s += fr[j][1]; n++; } return s / n; };
          const last = F[F.length - 1];
          if (!(ang(last) > 60 && mean(last) - mean(F[0]) > 25)) out.notFall.push(L + '/' + dir + ' ' + ang(last).toFixed(0) + 'deg ' + (mean(last) - mean(F[0])).toFixed(0) + 'px');
          let sp = 0; const k0 = F.length - 25; for (let i = k0 + 1; i < F.length; i++) for (const j in F[i]) sp = Math.max(sp, Math.hypot(F[i][j][0] - F[i - 1][j][0], F[i][j][1] - F[i - 1][j][1]) * 120);
          if (sp > 6) out.restless.push(L + '/' + dir + ' ' + sp.toFixed(1) + ' px/s');
          const F2 = ragdollSim(R, h, 1), F3 = ragdollSim(R, h, 7);
          if (JSON.stringify(F2) !== JSON.stringify(F)) out.notSame++;
          let dmax = 0; for (const j in last) dmax = Math.max(dmax, Math.hypot(last[j][0] - F3[F3.length - 1][j][0], last[j][1] - F3[F3.length - 1][j][1]));
          if (dmax < 2) out.notOther++;
          const stand = meas(buildFrame(dir, 'idle', 0.02)); standH = stand.h;
          const pics = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(k => meas(buildFrame(dir, 'ragdoll', (k + 0.5) / 12))), dead = pics[11]; deads.push(dead.sig);
          if (!flat(dead)) out.notFlat.push(L + '/' + dir + ' ' + dead.w + 'x' + dead.h);
          if (!headDown(dead)) out.notHead.push(L + '/' + dir);
          const old = meas(buildFrame(dir, 'sleep', 0)); out.ctrlN++; if (!(flat(old) && headDown(old))) out.ctrlBad++;
          pics.forEach((m, i) => { if (m.edge) out.cut.push(L + '/' + dir + '/' + i); const k = m.n / stand.n; out.minKeep = Math.min(out.minKeep, k); if (k < 0.65) out.lost.push(L + '/' + dir + '/' + i + ' ' + k.toFixed(2)); });
        }
        out.distinct += new Set(deads).size === 8 ? 1 : 0; }
    } finally { window.G_WORN = keep[0]; G.bodyVar = keep[1]; G.age = keep[2]; rebuildFromRig(); FRAME_CACHE.map.clear(); }
    return out;
  });
  console.log('         ' + r.sets + ' (outfit, facing) sets, each simulated for 2 s at 1/240 s and drawn on twelve keys');
  ok('NO BONE STRETCHES: every bone holds its rest length to half a pixel at every 1/120 s (worst ' + r.stretch.toFixed(2) + ' px)', r.stretch <= 0.5);
  ok('NOTHING GOES THROUGH THE FLOOR (deepest ' + r.below.toFixed(2) + ' px under it)', r.below <= 0.5);
  ok('EVERY JOINT LIMIT HOLDS: no knee or elbow folds past its range (worst ' + r.limit.toFixed(2) + ' px inside it)', r.limit <= 0.5);
  ok('NO POP: no joint moves more than 6 px in a 1/120 s step (the 7/17 ragdoll popped 17-20) (worst ' + r.pop.toFixed(1) + ' px, ' + r.popAt + ')', r.pop <= 6);
  ok('HE FALLS: the torso goes past 60 degrees and the body\'s weight drops 25 px or more, every set', !r.notFall.length, r.notFall.slice(0, 4).join(', '));
  ok('HE COMES TO REST: no joint moves faster than 6 px a second over the last fifth of a second, every set', !r.restless.length, r.restless.slice(0, 4).join(', '));
  ok('THE SAME HIT FALLS THE SAME WAY: the same seed, run again, is identical, every set', r.notSame === 0);
  ok('  AND ANOTHER HIT FALLS ANOTHER WAY: another seed rests 2 px or more differently, every set (physics, not a pose)', r.notOther === 0, r.notOther + ' sets the same');
  ok('THE DEAD LIE FLAT: half again as wide as tall and under 55% of his standing height, every set', !r.notFlat.length, r.notFlat.slice(0, 4).join(', '));
  ok('  with the HEAD AT ONE END, DOWN ON THE GROUND, never on end and never upside down', !r.notHead.length, r.notHead.slice(0, 4).join(', '));
  ok('CONTROL: the old dead (sleep@0) fail that ruler on most sets (' + r.ctrlBad + ' of ' + r.ctrlN + ')', r.ctrlBad >= r.ctrlN / 2);
  ok('NOTHING IS CUT BY THE FRAME: no drawn picture touches its left, right or top edge', !r.cut.length, r.cut.slice(0, 4).join(', '));
  /* 65, not the posed fall's 75: lying with his back to you his arms are under him and hidden (0.71 to 0.74 measured and looked at 10/13); this claim is for a picture CUT, which keeps far less */
  ok('NOTHING GOES MISSING: every drawn picture keeps 65 percent or more of the standing body (kept ' + r.minKeep.toFixed(2) + ' or more)', !r.lost.length, r.lost.slice(0, 4).join(', '));
  ok('EIGHT FACINGS, EIGHT DEAD MEN: the eight last pictures differ, every outfit', r.distinct === 5);
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
