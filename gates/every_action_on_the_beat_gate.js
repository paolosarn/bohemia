#!/usr/bin/env node
/* EVERY ACTION IS A REQUEST ON THE MUSIC'S BEAT (COMBAT [every action on the music's beat], rule 158, Paolo 10/24: 'every
   time you press a button it's a request, and the game does those actions on the BPM, everything is supposed to be on the BPM
   clock of the music, and we totally lost sight of that in this revamp... if I press AUTO or I'm fighting turn by turn
   manually, it's a request to be on the same BPM with any action').
   MEASURED BEFORE: the fight cut time from its own start (UI.t0) in quarters of its own beat over the speed, the hand and the
   pace; a tap played the frame it came; the hand's top speed was 3x, a third of a beat, off any grid of the song.

   Legs, on the fight's own page (his phone's profile, no shell, so the fight keeps its own 120):
   1. A TAP IS A REQUEST: his walk, tapped off the beat, begins on the next beat, never the frame of the tap; his blow lands
      ON a beat (its landing, LAND_BEATS of its beat in, is the kick);
   2. AUTO AND THEIR TURNS TOO: every motion of a whole AUTO fight that shows something lands on its grid, his men's and theirs;
   3. FASTER IS FINER, NEVER OFF: the hand is 1x / 2x / 4x and every grid any motion used is the song's beat over a power of two
      (a beat, a half, a quarter); their turns on halves;
   and in the demo with his music on (a road fight through the map's own door, seeded):
   4. THE FIGHT READS THE SONG'S CLOCK: SONG.from is the shell's song, never the fight's own;
   5. ON THE SONG'S OWN BEATS: every motion's landing, his by hand, his on AUTO and theirs, sits within 5 ms of the grid cut from
      the beats the shell's transport really booked (MUS.playStep, each beat placed where it is heard), and every blow at 1x
      lands within 5 ms of a booked beat (the kick of four on the floor);
   6. THE SOUND MEETS THE KICK: a blow's landing sound leaves the fight SONG.lat ahead of its picture, so it is heard on the beat;
   7. nothing threw.
   Run: node gates/every_action_on_the_beat_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== EVERY ACTION ON THE BEAT GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const TOL = 5;   /* under a sixteenth of a sixteenth; the grid is cut from the fitted clock of the beats the shell booked */
/* how far a landing sits off its own grid, cut from the anchor the fight held when it booked it */
const offGrid = x => { const g = x.g, ph = (((x.land - x.songAt) % g) + g) % g; return Math.min(ph, g - ph); };
const pow2 = (beat, g) => { const r = beat / g; return Math.abs(r - Math.pow(2, Math.round(Math.log2(r)))) < 1e-6; };

(async () => {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const errs = [];
  /* ---------------- the fight's own page ---------------- */
  {
    const o = { seed: 23, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, company: [{ background: 'companion_2hand' }, { background: 'companion_1hand' }, { background: 'companion_ranged' }], cap: 12, band: ['brigand_thug', 'brigand_thug'], teach: false, odds: false };
    const d = await drive.open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    const p = d.page; p.on('pageerror', e => errs.push(String(e)));
    try {
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
      const mine = async () => { for (let i = 0; i < 300; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return FIGHT.S.over ? 'over' : u && crewControlled(u) && !FIGHT_UI.anim.length ? 'mine' : 'busy'; });
        if (st !== 'busy') return st; await p.waitForTimeout(80); } return 'stuck'; };
      await mine();
      /* 1: his walk, tapped a third of the way into a beat; then his blow on a thug set beside him */
      const set = await p.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(), t = S.units.filter(v => v.side === 'them' && FIGHT.onField(v))[0];
        t.x = Math.min(S.w - 1, u.x + 4); t.y = u.y; u.ap = u.apTurn; u.fat = 0; FIGHT_UI.pinched = true; FIGHT_UI.cx = (u.x + 2.5) * FIGHT_UI.tw; FIGHT_UI.cy = (u.y + .5) * FIGHT_UI.th;
        return { id: u.id, x: u.x, y: u.y, tid: t.id }; });
      const tile = (x, y) => p.evaluate(a => ({ x: sx((a.x + .5) * FIGHT_UI.tw), y: sy((a.y + .5) * FIGHT_UI.th) }), { x, y });
      const offBeat = () => p.evaluate(() => new Promise(r => { const b = 60000 / R('ours.beat_bpm'), ph = (((performance.now() - SONG.at) % b) + b) % b; setTimeout(r, ((b / 3 - ph) + b) % b); }));
      const q1 = await tile(set.x + 2, set.y);
      await p.touchscreen.tap(q1.x, q1.y); await p.waitForTimeout(120);
      await offBeat();
      const n0 = await p.evaluate(() => (FIGHT_UI.onBeat || []).length);
      await p.touchscreen.tap(q1.x, q1.y);
      await p.waitForFunction(n => (FIGHT_UI.onBeat || []).length > n && !FIGHT_UI.anim.length, n0, { timeout: 8000 }).catch(() => {});
      const walk = await p.evaluate(n => (FIGHT_UI.onBeat || []).slice(n).filter(x => x.k === 'step')[0] || null, n0);
      leg(walk && walk.song === 'own' && walk.at - walk.asked > 20 && offGrid(walk) <= 1 && walk.g === 60000 / 120,
        '*** A TAP IS A REQUEST ***: his walk, tapped off the beat, waits for the next beat and begins on it, never the frame of the tap',
        walk ? 'asked ' + Math.round(walk.asked) + ', began ' + Math.round(walk.at) + ' (' + Math.round(walk.at - walk.asked) + ' ms later), ' + offGrid(walk).toFixed(1) + ' ms off a ' + walk.g + ' ms beat' : 'no walk');
      await mine();
      await p.evaluate(a => { const u = FIGHT.byId(a.id), t = FIGHT.byId(a.tid); t.x = u.x + 1; t.y = u.y; u.ap = u.apTurn; u.fat = 0; t.hp = t.hpMax = 9999; }, set);
      const st = await p.evaluate(a => { const u = FIGHT.byId(a.id); return { tx: u.x + 1, ty: u.y }; }, set);
      const q2 = await tile(st.tx, st.ty);
      const n1 = await p.evaluate(() => (FIGHT_UI.onBeat || []).length);
      await p.touchscreen.tap(q2.x, q2.y); await p.waitForTimeout(150); await offBeat(); await p.touchscreen.tap(q2.x, q2.y);
      await p.waitForFunction(n => (FIGHT_UI.onBeat || []).slice(n).some(x => x.k === 'attack'), n1, { timeout: 8000 }).catch(() => {});
      const blow = await p.evaluate(n => (FIGHT_UI.onBeat || []).slice(n).filter(x => x.k === 'attack')[0] || null, n1);
      leg(blow && offGrid(blow) <= 1 && Math.abs(blow.land - blow.at - blow.g * 0.45) < 1,
        '  his blow by hand LANDS on the beat: its landing (0.45 of its beat in) on the grid, the swing leading into it',
        blow ? 'landing ' + offGrid(blow).toFixed(1) + ' ms off the beat, the swing began ' + Math.round(blow.land - blow.at) + ' ms before it' : 'no blow');
      /* 2, 3: the rest on AUTO, and the speed pane */
      await p.evaluate(() => { FIGHT_UI.auto = true; FIGHT.S.units.forEach(v => { if (v.side === 'them') v.hp = Math.min(v.hp, 30); }); });
      await p.waitForFunction(() => FIGHT.S.over && !FIGHT_UI.anim.length, null, { timeout: 180000 }).catch(() => {});
      const L = await p.evaluate(() => ({ log: FIGHT_UI.onBeat || [], beat: songBeat() }));
      const q = L.log.filter(x => x.g > 0), bad = q.filter(x => offGrid(x) > 1), sides = new Set(q.map(x => x.side));
      leg(q.length >= 8 && !bad.length && sides.has('you') && sides.has('them'),
        '*** AUTO AND THEIR TURNS TOO ***: every motion of the fight that shows something lands on its grid, his men\'s and theirs',
        q.length + ' motions on the grid of ' + L.log.length + ' (' + (L.log.length - q.length) + ' with nothing to show take no beat); off: ' + bad.length + '; sides ' + [...sides].join('+'));
      const gs = [...new Set(q.map(x => x.g))].sort((a, b) => b - a), theirs = q.filter(x => x.side === 'them' && x.k !== 'note');
      const sp = await p.evaluate(async () => { const b = document.getElementById('bspeed'), seen = [];
        for (let i = 0; i < 3; i++) { b.click(); await new Promise(r => setTimeout(r, 50)); seen.push(b.innerText + '=' + Math.round(60000 / R('ours.beat_bpm') / FIGHT_UI.speed / FIGHT_UI.hand)); } return { seen, top: SPEEDS[SPEEDS.length - 1], speeds: SPEEDS.slice(), finish: FINISH_PACE }; });
      leg(gs.every(g => pow2(L.beat, g)) && theirs.length && theirs.every(x => Math.abs(x.g - L.beat / 2) < 1e-6) && sp.speeds.every(v => pow2(L.beat, L.beat / v)) && pow2(L.beat, L.beat / sp.finish) && sp.seen.join() === '2x=250,4x=125,1x=500',
        '*** FASTER IS FINER, NEVER OFF ***: every grid a beat over a power of two, their turns on halves, the hand 1x / 2x / 4x and AUTO\'s finish 4x',
        'grids ' + gs.join(', ') + ' ms; theirs ' + [...new Set(theirs.map(x => x.g))].join(',') + '; the pane ' + sp.seen.join(' ') + '; finish ' + sp.finish + 'x');
    } catch (e) { leg(false, 'the fight\'s page ran', String(e.message).slice(0, 200)); }
    errs.push.apply(errs, d.errs); await d.close();
  }

  /* ---------------- the demo, his music on ---------------- */
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  const ARM = `(function(){ if (!/BOHEMIA_FIGHT/.test(location.href)) return; let fo;
    Object.defineProperty(window, 'FIGHT_OPTS', { configurable: true, get: function () { return fo; }, set: function (v) { fo = v ? Object.assign({}, v, { seed: 7 }) : v; } }); })();`;
  let d;
  try { d = await drive.open({ keepCards: true, arm: ARM, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { leg(false, 'the demo boots', String(e.message).slice(0, 160)); return done(); }
  const p = d.page;
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && MUS.AC && MUS.AC.state === 'running', null, { timeout: 30000 });
    /* the shell's own beats: every beat step the transport books, placed where it is heard by the mapping of the moment */
    /* the shell's own beats: every beat step the transport books (its audio time), and the audio clock against this page's,
       sampled every 100 ms and fitted as one line over the whole fight (one sample is a render quantum coarse; the fit is not) */
    await p.evaluate(() => { const B = window.__beats = [], C = window.__clk = []; const ps = MUS.playStep;
      MUS.playStep = function (s, t) { if (MUS.step % 4 === 0) B.push(t); return ps.apply(MUS, arguments); };
      setInterval(() => { const AC = MUS.AC; if (!AC) return; const ts = AC.getOutputTimestamp ? AC.getOutputTimestamp() : null;
        if (ts && ts.contextTime > 0 && ts.performanceTime > 0) C.push([ts.contextTime, ts.performanceTime]);
        else C.push([AC.currentTime, performance.now() + ((AC.outputLatency || 0) + (AC.baseLatency || 0)) * 1000]); }, 100); });
    await d.fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 7 }); });
    let f = null;
    for (let i = 0; i < 300 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
      if (c && await c.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
    if (!f) throw new Error('the road fight never came up');
    await f.waitForFunction(() => performance.now() > FIGHT_UI.openUntil, null, { timeout: 30000 });
    /* by hand: his first turn, a walk asked through the same call the tap makes, then AUTO for the rest */
    for (let i = 0; i < 200; i++) { const st = await f.evaluate(() => { const u = FIGHT.current(); if (FIGHT.S.deploy) { fightNow(); return 'deploy'; } return FIGHT.S.over ? 'over' : u && crewControlled(u) && !FIGHT_UI.anim.length ? 'mine' : 'busy'; }).catch(() => 'busy');
      if (st === 'mine' || st === 'over') break; await p.waitForTimeout(100); }
    const hand = await f.evaluate(() => { const u = FIGHT.current(); if (!u || !crewControlled(u)) return null; const S = FIGHT.S;
      const to = [[1, 0], [-1, 0], [0, 1], [0, -1], [2, 0], [-2, 0]].map(v => ({ x: u.x + v[0], y: u.y + v[1] })).filter(q => q.x >= 0 && q.y >= 0 && q.x < S.w && q.y < S.h);
      for (const q of to) { const t = performance.now(); if (walkKept(u, q.x, q.y)) { take(); return { t: t, id: u.id }; } }
      return null; });
    await f.waitForFunction(() => !FIGHT_UI.anim.length, null, { timeout: 10000 }).catch(() => {});
    await f.evaluate(() => { FIGHT_UI.auto = true; });
    await f.waitForFunction(() => FIGHT.S.over && !FIGHT_UI.anim.length, null, { timeout: 300000, polling: 500 }).catch(() => {});
    const L = await f.evaluate(() => ({ log: FIGHT_UI.onBeat || [], sent: FIGHT_UI.sent || [], origin: performance.timeOrigin, from: SONG.from, lat: SONG.lat, beat: songBeat() }));
    const P = await p.evaluate(() => ({ acBeats: window.__beats, clk: window.__clk, origin: performance.timeOrigin }));
    const n = P.clk.length, mx = P.clk.reduce((a, c) => a + c[0], 0) / n, my = P.clk.reduce((a, c) => a + c[1], 0) / n;
    const k = P.clk.reduce((a, c) => a + (c[0] - mx) * (c[1] - my), 0) / P.clk.reduce((a, c) => a + (c[0] - mx) * (c[0] - mx), 0);
    P.beats = P.acBeats.map(t => my + (t - mx) * k);
    const shift = L.origin - P.origin, near = t => { let b = 1e9, at = null; for (const x of P.beats) { const dd = Math.abs(x - t); if (dd < b) { b = dd; at = x; } } return { d: b, at: at }; };
    leg(L.from === 'song' || L.from === 'shell', '*** THE FIGHT READS THE SONG\'S CLOCK ***: the beat comes from the shell\'s song, never the fight\'s own', 'from ' + L.from + ', ' + Math.round(L.beat) + ' ms a beat, ' + L.lat.toFixed(1) + ' ms to the ear');
    const q = L.log.filter(x => x.g > 0).map(x => { const t = x.land + shift, n = near(t), ph = n.at === null ? 1e9 : (((t - n.at) % x.g) + x.g) % x.g; return Object.assign({}, x, { off: Math.min(ph, x.g - ph), beatOff: n.d }); });
    const bad = q.filter(x => x.off > TOL), blows = q.filter(x => x.k === 'attack' && Math.abs(x.g - L.beat) < 1e-6), blowsOff = blows.filter(x => x.beatOff > TOL);
    const byHand = hand ? q.filter(x => x.k === 'step' && x.side === 'you' && x.asked >= hand.t - 20)[0] || null : null;
    leg(q.length >= 8 && !bad.length && byHand && q.some(x => x.side === 'them') && blows.length && !blowsOff.length,
      '*** ON THE SONG\'S OWN BEATS ***: every motion lands within ' + TOL + ' ms of the grid cut from the beats the shell booked (his by hand, his on AUTO, theirs), every blow at 1x on a booked beat',
      q.length + ' motions, ' + bad.length + ' off (worst ' + Math.max(0, ...q.map(x => x.off)).toFixed(1) + ' ms); his tapped walk ' + (byHand ? byHand.off.toFixed(1) + ' ms off' : 'NONE') + '; ' + blows.length + ' blows at 1x, worst ' + Math.max(0, ...blows.map(x => x.beatOff)).toFixed(1) + ' ms from a booked beat; ' + P.beats.length + ' beats booked');
    /* 6: a blow's landing sound (hit, hurt, vital, miss, melee) leaves the fight SONG.lat ahead of the landing (when the fight
       sends it, on its own clock: what the shell then does with a busy thread is the shell's) */
    const LANDS = /^(hit|hurt|vital|miss|melee_hit)$/, sends = L.sent.filter(s => LANDS.test(s[0])).map(s => s[1]);
    const pairs = blows.map(x => { const t = x.land - L.lat; let b = 1e9; sends.forEach(s => { const dd = s - t; if (Math.abs(dd) < Math.abs(b)) b = dd; }); return b; }).filter(b => Math.abs(b) < 250).sort((a, b) => a - b);
    const med = pairs.length ? pairs[Math.floor(pairs.length / 2)] : 1e9, worst = pairs.length ? Math.max(...pairs.map(Math.abs)) : 1e9;
    /* a timer on the shell's thread (the fight's frame shares it): the middle under the ~20 ms at which two sounds begin to
       flam, the worst under a sixteenth's half; sample-exact needs the shell to book a sound at a time (the NOTE to SOUNDS) */
    leg(pairs.length >= Math.min(3, blows.length) && Math.abs(med) <= 15 && worst <= 62,
      '*** THE SOUND MEETS THE KICK ***: a blow\'s landing sound leaves the fight ' + L.lat.toFixed(0) + ' ms (the way to the ear) ahead of its picture, so the ear hears it on the beat',
      pairs.length + ' landings sent, the middle ' + med.toFixed(1) + ' ms and the worst ' + worst.toFixed(1) + ' ms from its place (a timer on the shell\'s thread: 15 and 62 allowed)');
    errs.push.apply(errs, d.errs);
  } catch (e) { leg(false, 'the demo with his music ran', String(e.message).slice(0, 200)); }
  await d.close();
  leg(!errs.length, 'nothing threw', errs.slice(0, 2).join(' | '));
  done();
})();
