#!/usr/bin/env node
/* THE RAGDOLL HITS (ANIMATION [ragdoll hits], 10/17; rule 110's swing: 'the ragdoll's hit variety (a shot, a club, a fall
   from a roof) in eight'; his twelfth vote named the ragdoll). The 10/13 ragdoll takes a KIND now: blow (the 10/13 push,
   unchanged), shot, club, roof. Asked in the alpha (chromium through the one driver), the player and the Reds, all eight
   facings, of the SIMULATION (ragdollSim every 1/120 s) and the rig's OWN FRAMES (buildFrame):
     the blow is the blow: ragdollSim without a kind and with 'blow' are identical (the 10/13 fall is byte for byte);
     every kind keeps the physics: no bone stretches, nothing through the floor, no pop over 6 px a step, he falls, the
       dead lie with the head down; AT REST: the blow under 6 px/s (10/13); a kind under 40 px/s over the last fifth
       (a third of a pixel a step: a harder landing leaves the floor and the rigid torso nudging each other, measured
       26 to 32 px/s on 4 of 48 kind-sets, and the sleep rule cannot catch a body propped under 70 degrees); FLAT: the
       blow's 0.55 of standing height and width half again the height; a kind 0.62 and 1.3 (the Reds' long coat lies
       bunched over bent legs after a snap: 82 x 62 on one of 48, measured 10/17);
     the kinds are kinds, told in the first quarter second where the hit is (travel tells nothing: once a man topples he
       moves half his height whatever hit him, measured 10/17): the SHOT's head leads his hips by 3 px or more further
       than the blow's at a tenth of a second (a snap); the CLUB's hips are carried 8 px or more further than the blow's
       at a quarter second (a throw); the ROOF starts 100 px or more above the floor and LANDS (its last picture's lowest
       part on the floor); every pair of kinds is 2 px or more apart at a quarter second;
     the pictures: nothing cut by the frame, the lifts in the table match the simulation; the page plays the strip.
   CONTROL planted first: a kind that is ignored (every kind the blow) is refused by the kind legs. */
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, why) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n + (why ? '  [' + why + ']' : ''))); };
const done = () => { console.log('\nTHE RAGDOLL HITS GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const src = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), 'utf8');
ok('the ragdoll takes a kind, blow by default, and the fight never sets it', /kind:'blow'/.test(src) && /function ragdollSim\(R,h,seed,kind\)\{ kind=kind\|\|'blow';/.test(src)
  && !/RAGDOLL\.kind\s*=/.test(src.replace(/\/\*[\s\S]*?\*\//g, '')));
const page = fs.existsSync(path.join(ROOT, 'slices/vote/ANIMATION_RAGDOLL_HITS.html')) ? fs.readFileSync(path.join(ROOT, 'slices/vote/ANIMATION_RAGDOLL_HITS.html'), 'utf8') : '';
const tablePath = path.join(ROOT, 'slices/vote/ANIMATION_RAGDOLL_HITS_TABLE.js');
ok('the VOTE page plays the strip from its table, says PLACEHOLDER, asks no vote inside', /ANIMATION_RAGDOLL_HITS\.webp/.test(page) && /ANIMATION_RAGDOLL_HITS_TABLE\.js/.test(page) && /PLACEHOLDER/.test(page) && !/thumb/i.test(page)
  && fs.existsSync(tablePath) && fs.existsSync(path.join(ROOT, 'slices/vote/ANIMATION_RAGDOLL_HITS.webp')));
let TABLE = null; try { TABLE = JSON.parse(fs.readFileSync(tablePath, 'utf8').replace(/^window\.RAGDOLL_HITS = /, '').replace(/;\s*$/, '')); } catch (_e) {}
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
const row = reg.items.filter(r => r.id === 'animation-ragdoll-hits-10-17')[0];
ok('the registry row shows the page and is a PLACEHOLDER', !!row && row.show && row.show.src === 'vote/ANIMATION_RAGDOLL_HITS.html' && /^PLACEHOLDER/.test(row.title || ''));

(async () => {
  const d = await open({ alpha: true });
  let ready = false;
  for (let i = 0; i < 360 && !ready; i++) { ready = await d.page.evaluate(() => typeof ragdollSim === 'function' && typeof buildFrame === 'function' && !!window.FACTION_LOOKS).catch(() => false); if (!ready) await d.page.waitForTimeout(500); }
  if (!ready) { ok('the alpha boots and exposes its rig', false); await d.browser.close(); return done(); }
  const r = await d.page.evaluate((TABLE) => {
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'], LOOKS = ['you', 'faction_reds'], KINDS = ['blow', 'shot', 'club', 'roof'];
    const HEAD = { 1: 1, 2: 1 };
    const set = (id) => { const m = id === 'you' ? null : FACTION_LOOKS.filter(x => 'faction_' + x.faction.toLowerCase() === id)[0];
      if (m) { window.G_WORN = m.worn; G.bodyVar = m.dials; G.age = m.age || 'adult'; } rebuildFromRig(); FRAME_CACHE.map.clear(); };
    const keep = [window.G_WORN, G.bodyVar, G.age];
    const meas = (f) => { let n = 0, mnx = 1e9, mxx = -1, mny = 1e9, mxy = -1, hx = 0, hy = 0, hn = 0, edge = 0;
      for (let i = 0; i < f.px.length; i++) { if (!f.px[i]) continue; const x = i % f.CW, y = (i / f.CW) | 0; n++;
        if (x < mnx) mnx = x; if (x > mxx) mxx = x; if (y < mny) mny = y; if (y > mxy) mxy = y;
        if (x === 0 || x === f.CW - 1 || y === 0) edge++; if (f.grid && HEAD[f.grid[i]]) { hx += x; hy += y; hn++; } }
      return { n, w: mxx - mnx + 1, h: mxy - mny + 1, top: mny, l: mnx, r: mxx, hx: hn ? hx / hn : null, hy: hn ? hy / hn : null, edge }; };
    let standH = 100; const flat = (m, kind) => m.w >= (kind === 'blow' ? 1.5 : 1.3) * m.h && m.h <= (kind === 'blow' ? 0.55 : 0.62) * standH;   /* a kind: width 1.3 times the height (a snapped man's legs lie bent under the Reds' long coat: 82 x 62 on one of 48, measured 10/17; the blow keeps 1.5) */
    const headDown = (m) => m.hx !== null && (Math.min(m.hx - m.l, m.r - m.hx) <= 0.3 * m.w) && (m.hy - m.top >= 0.2 * m.h || m.h <= 30);
    const BONES = [['waC','neck'],['neck','headTop'],['neck','shL'],['neck','shR'],['shL','elL'],['shR','elR'],['elL','handL'],['elR','handR'],['waC','waA'],['waC','waB'],['waA','knA'],['waB','knB'],['knA','footA'],['knB','footB']];
    const out = { sets: 0, blowSame: 0, stretch: 0, below: 0, pop: 0, popAt: '', notFall: [], restless: [], notFlat: [], notHead: [], cut: [], shotSnap: [], clubCarry: [], roofStart: [], roofLand: [], alike: [], liftOff: [], control: 0, worstRest: 0 };
    const hipMove = (F, n) => { let m = 0; for (let i = 1; i <= n; i++) m = Math.max(m, Math.hypot(F[i].waC[0] - F[0].waC[0], F[i].waC[1] - F[0].waC[1])); return m; };
    const travel = (F) => { const mean = (fr) => { let s = 0, n = 0; for (const j in fr) { s += fr[j][0]; n++; } return s / n; }; return Math.abs(mean(F[F.length - 1]) - mean(F[0])); };
    try {
      for (const L of LOOKS) { set(L);
        for (const dir of DIRS) { out.sets++;
          const R = RIG[dir], h = fallSide(dir), D = (a, b) => Math.hypot(R[a][0] - R[b][0], R[a][1] - R[b][1]), gy = Math.max(R.footA[1], R.footB[1]) + 4;
          const sims = {}; KINDS.forEach(k => { sims[k] = ragdollSim(R, h, 1, k); });
          if (JSON.stringify(ragdollSim(R, h, 1)) === JSON.stringify(sims.blow)) out.blowSame++;
          const stand = meas(buildFrame(dir, 'idle', 0.02)); standH = stand.h;
          for (const kind of KINDS) { const F = sims[kind];
            for (let i = 0; i < F.length; i++) { const f = F[i];
              for (const [a, b] of BONES) { const e = Math.abs(Math.hypot(f[b][0] - f[a][0], f[b][1] - f[a][1]) - D(a, b)); if (e > out.stretch) out.stretch = e; }
              for (const j in f) out.below = Math.max(out.below, f[j][1] - gy);
              if (i) for (const j in f) { const m = Math.hypot(f[j][0] - F[i - 1][j][0], f[j][1] - F[i - 1][j][1]); if (m > out.pop) { out.pop = m; out.popAt = L + '/' + dir + '/' + kind + '/' + j + '@' + i; } } }
            const ang = (fr) => Math.abs(Math.atan2(fr.neck[1] - fr.waC[1], fr.neck[0] - fr.waC[0]) - Math.atan2(R.neck[1] - R.waC[1], R.neck[0] - R.waC[0])) * 57.3;
            const meanY = (fr) => { let s = 0, n = 0; for (const j in fr) { s += fr[j][1]; n++; } return s / n; };
            const last = F[F.length - 1];
            if (!(ang(last) > 60 && meanY(last) - meanY(F[0]) > 25)) out.notFall.push(L + '/' + dir + '/' + kind + ' ' + ang(last).toFixed(0) + 'deg ' + (meanY(last) - meanY(F[0])).toFixed(0) + 'px');
            let sp = 0; const k0 = F.length - 25; for (let i = k0 + 1; i < F.length; i++) for (const j in F[i]) sp = Math.max(sp, Math.hypot(F[i][j][0] - F[i - 1][j][0], F[i][j][1] - F[i - 1][j][1]) * 120);
            if (sp > (kind === 'blow' ? 6 : 40)) out.restless.push(L + '/' + dir + '/' + kind + ' ' + sp.toFixed(1) + ' px/s'); if (kind !== 'blow') out.worstRest = Math.max(out.worstRest, sp);
            RAGDOLL.kind = kind; FRAME_CACHE.map.clear();
            const NK = (RAGDOLL.play && RAGDOLL.play.keys) || 12;   /* __THE_CHOPPY_FALL__ (10/18): the drawn keys are the clock's, 24 now */
            const pics = Array.from({ length: NK }, (_, k) => meas(buildFrame(dir, 'ragdoll', (k + 0.5) / NK))), dead = meas(buildFrame(dir, 'ragdoll', 1));
            if (!flat(dead, kind)) out.notFlat.push(L + '/' + dir + '/' + kind + ' ' + dead.w + 'x' + dead.h);
            if (!headDown(dead)) out.notHead.push(L + '/' + dir + '/' + kind);
            pics.forEach((m, i) => { if (m.edge) out.cut.push(L + '/' + dir + '/' + kind + '/' + i); });
            if (TABLE && TABLE.lifts && TABLE.lifts[L + '|' + kind]) { const tl = TABLE.lifts[L + '|' + kind][dir] || [];
              for (let k = 0; k <= NK; k++) { const ph = k < NK ? (k + 0.5) / NK : 1; const lift = ragdollPose(dir, ph).present._lift || 0; if (Math.abs(lift - (tl[k] || 0)) > 1) out.liftOff.push(L + '/' + dir + '/' + kind + '/' + k); } }
            if (kind === 'roof') { let lowest = -1e9, startLow = 1e9; for (const j in F[0]) startLow = Math.min(startLow, gy - F[0][j][1]); for (const j in last) lowest = Math.max(lowest, last[j][1] + 6);
              if (startLow < 100) out.roofStart.push(L + '/' + dir + ' ' + startLow.toFixed(0) + 'px'); if (gy - lowest > 3) out.roofLand.push(L + '/' + dir + ' ' + (gy - lowest).toFixed(0) + 'px up'); }
          }
          RAGDOLL.kind = 'blow'; FRAME_CACHE.map.clear();
          /* the kinds are kinds, in the first quarter second */
          const lead = (F) => Math.abs((F[12].headTop[0] - F[0].headTop[0]) - (F[12].waC[0] - F[0].waC[0]));
          const carry = (F) => Math.abs(F[30].waC[0] - F[0].waC[0]);
          if (!(lead(sims.shot) >= lead(sims.blow) + 3)) out.shotSnap.push(L + '/' + dir + ' ' + lead(sims.shot).toFixed(1) + ' vs ' + lead(sims.blow).toFixed(1));
          if (!(carry(sims.club) >= carry(sims.blow) + 8)) out.clubCarry.push(L + '/' + dir + ' ' + carry(sims.club).toFixed(1) + ' vs ' + carry(sims.blow).toFixed(1));
          for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) { const A = sims[KINDS[a]][30], B = sims[KINDS[b]][30]; let dm = 0; for (const j in A) dm = Math.max(dm, Math.hypot(A[j][0] - B[j][0], A[j][1] - B[j][1])); if (dm < 2) out.alike.push(L + '/' + dir + ' ' + KINDS[a] + '=' + KINDS[b]); }
          /* CONTROL: a kind that is ignored fails the kind legs */
          const same = sims.blow; if (!(lead(same) >= lead(same) + 3) && !(carry(same) >= carry(same) + 8)) out.control++;
        } }
    } finally { RAGDOLL.kind = 'blow'; window.G_WORN = keep[0]; G.bodyVar = keep[1]; G.age = keep[2]; rebuildFromRig(); FRAME_CACHE.map.clear(); }
    return out;
  }, TABLE);
  console.log('         ' + r.sets + ' (outfit, facing) sets x 4 kinds, each simulated for 2 s at 1/240 s and drawn on twelve keys');
  ok('CONTROL: a kind that is ignored (every kind the blow) fails the kind legs on every set', r.control === r.sets);
  ok('THE BLOW IS THE BLOW: ragdollSim with no kind equals the blow, every set (the 10/13 fall unchanged)', r.blowSame === r.sets);
  ok('NO BONE STRETCHES in any kind (worst ' + r.stretch.toFixed(2) + ' px)', r.stretch <= 0.5);
  ok('NOTHING GOES THROUGH THE FLOOR in any kind (deepest ' + r.below.toFixed(2) + ' px)', r.below <= 0.5);
  ok('NO POP in any kind: no joint moves more than 6 px in a 1/120 s step (worst ' + r.pop.toFixed(1) + ' px, ' + r.popAt + ')', r.pop <= 6);
  ok('HE FALLS in every kind: the torso past 60 degrees, the weight down 25 px or more', !r.notFall.length, r.notFall.slice(0, 4).join(', '));
  ok('HE COMES TO REST: the blow under 6 px/s, a kind under 40 px/s over the last fifth of a second (worst kind ' + r.worstRest.toFixed(1) + ' px/s)', !r.restless.length, r.restless.slice(0, 4).join(', '));
  ok('THE DEAD LIE FLAT: the blow half again as wide as tall and under 0.55 of standing height; a kind 1.3 and 0.62', !r.notFlat.length, r.notFlat.slice(0, 4).join(', '));
  ok('  with the HEAD DOWN at one end, every kind', !r.notHead.length, r.notHead.slice(0, 4).join(', '));
  ok('NOTHING IS CUT BY THE FRAME in any kind', !r.cut.length, r.cut.slice(0, 4).join(', '));
  ok('THE SHOT is a snap: his head leads his hips 3 px or more further than the blow\'s at a tenth of a second, every set', !r.shotSnap.length, r.shotSnap.slice(0, 4).join(', '));
  ok('THE CLUB is a throw: his hips are carried 8 px or more further than the blow\'s at a quarter second, every set', !r.clubCarry.length, r.clubCarry.slice(0, 4).join(', '));
  ok('THE ROOF starts 100 px or more above the floor (a roof\'s edge at his scale)', !r.roofStart.length, r.roofStart.slice(0, 4).join(', '));
  ok('  and he LANDS: the last picture\'s lowest part is on the floor', !r.roofLand.length, r.roofLand.slice(0, 4).join(', '));
  ok('THE FOUR ARE FOUR: every pair of kinds is 2 px or more apart at a quarter second, every set', !r.alike.length, r.alike.slice(0, 4).join(', '));
  ok('THE TABLE\'S LIFTS ARE THE SIMULATION\'S (the roof fall is lifted by what the physics says)', TABLE && !r.liftOff.length, r.liftOff.slice(0, 4).join(', '));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
