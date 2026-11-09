/* __BOHEMIA_SOLO__ -- THIS GATE MEASURES FRAMES, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   THE CAMP AFTER A FIGHT  (MOTION 3, 11/9/26, rule 440(e), rule 406(f)(g)(h) AMENDED 11/6; Paolo: 'once you finish a battle and you're in
   the victory screen and you camp there, you actually camp on the combat tiles that you just were on, and your company's interacting with
   their kills or the buildings nearby, the camp one through four tiles that are connected').
   MEASURED BEFORE (main d42868958, the demo, phone upright): CAMP THREE's 11/6 build pitched the camp on the fight's own board with the
   dead where they fell, and by day men went through them; nothing used the board's walls: no man ever stood at a house, the board's
   walls were known to the pitch and to nothing else.
   On the demo at 390 x 844: into a road fight, the fight won, MAKE CAMP pressed on the loot screen (a real tap):
     A1 the camp stands on that fight's own board (from the fight, the board in), its dead drawn where they fell
     A2 BY DAY THE COMPANY LIVES ON IT: a man goes through the dead (at a body), a man LEANS ON A WALL that touches the camp's tiles
        (his spot one of the board's own wall spots: the open tile beside a HOUSE of that very board (4+ blocked tiles in the 3 by 3 round
        the wall tile, never a kerb or a one-tile wall line), the wall at his right hand, and on the glass: never half off its edge, never
        under the phone); when the dealt board has no house in the camp's picture, a house planted in its grid beside the camp, said so, and the fire is kept (a man at it or by it), each man his own act
     A3 the man at the wall is drawn by the rig's own clip (ANIMATION's flirt, the wall variant: the hand up on it, rule 430), and the
        men's drawn cells change only on the beat's keys (three a beat at 120 BPM)
     A4 FRAMES: the camp at rest draws three times the old way's frames or more (measured 39 to 50 against 11 to 13), no frame over
        200 ms (this box, full speed; PLUMBER owns 60 on a phone's GPU): the map, drawn
        every frame under a camp that covers the whole glass, rests under it (__THE_MAP_RESTS_UNDER_A_PLACE__); the old way printed
        beside it; and the camp's clock still runs
     P1 PLANTED: window.__CAMP_NO_LEAN = true (the old way) and the camp laid again: no man at a wall, A2's own check goes RED
     A5 nothing threw
   node gates/the_camp_after_a_fight_gate.js   (about three minutes) */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const STATE = () => { try { const L = BohemiaCampLook.state(), C = BohemiaCampBoard.state(); return { st: C.state, fromFight: C.fromFight, dead: C.dead, bodies: L.bodies.length, night: L.night, hour: L.hour,
  acts: L.acts.map(a => ({ name: a.name, act: a.act })), spots: L.spots, walls: L.walls.map(w => ({ x: w.x, y: w.y, face: w.face, side: w.side })), drawnBy: L.drawnBy, fire: L.fire, glass: BohemiaCampLook.glass ? BohemiaCampLook.glass() : null }; } catch (e) { return { err: String(e).slice(0, 120) }; } };
/* THE ONE CHECK, for the real thing and the planted fail alike */
function lives(s) {
  if (!s || !s.acts) return { good: false, why: 'no camp' };
  const has = a => s.acts.filter(x => x.act === a);
  const lean = s.spots.filter(sp => sp.act === 'lean'), onWall = lean.filter(sp => s.walls.some(w => Math.abs(w.x - sp.x) < 2 && Math.abs(w.y - sp.y) < 2 && w.face === sp.face));
  const seen = lean.filter(sp => !!s.glass && sp.x > s.glass.x0 + 30 && sp.x < s.glass.x1 - 30);   /* on the glass, never half off its edge (no camera read: not seen) */
  const fire = s.acts.filter(x => /^(rest|tend|cook|clean|mend|watch)$/.test(x.act));
  const kinds = new Set(s.acts.map(x => x.act)).size;
  const good = has('loot').length >= 1 && lean.length >= 1 && onWall.length === lean.length && seen.length === lean.length && fire.length >= 1 && kinds >= 3;
  return { good, why: 'loot ' + has('loot').length + ', at a wall ' + lean.length + ' (on the board\'s own wall spots ' + onWall.length + ', ' + s.walls.length + ' wall spots by the camp, on the glass ' + seen.length + ' ' + JSON.stringify({ lean: lean.map(sp => [sp.name, Math.round(sp.x), Math.round(sp.y), sp.face]), glass: s.glass && [Math.round(s.glass.x0), Math.round(s.glass.x1)], all: s.spots.map(sp => [sp.name, sp.act, Math.round(sp.x), Math.round(sp.y)]) }) + '), by the fire ' + fire.length + ', ' + kinds + ' different acts: ' + s.acts.map(a => a.name + ' ' + a.act).join(', ') };
}
(async () => {
  console.log('THE CAMP AFTER A FIGHT');
  let d;
  try { d = await open({ profile: 'phone_portrait', door: 120000, engage: true }); }
  catch (e) { ok('the demo opened', false, String(e.message).slice(0, 160)); console.log('THE CAMP AFTER A FIGHT: ' + pass + ' passed, ' + fail + ' failed'); process.exit(1); }
  const p = d.page, fr = d.fr, M = (f, a) => p.evaluate(f, a), errs = [];
  p.on('pageerror', e => errs.push(String(e && e.message || e).slice(0, 140) + (/camp_(look|board)/.test(String(e && e.stack)) ? ' [camp]' : '')));
  const settle = () => p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url()));
  try {
    await p.waitForTimeout(3000);
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await p.waitForTimeout(2500);
    await fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
    /* into a road fight, as his walk meets one (off any town's ground, the meet card's ENGAGE pressed by the driver) */
    await fr.evaluate(() => { try { (function () { var N = om.n, best = null, bd = 1e9; for (var y = 4; y < N - 4; y++) for (var x = 4; x < N - 4; x++) { if (!cityWalkable(x, y)) continue; var near = false; for (var a = -3; a <= 3 && !near; a++) for (var b = -3; b <= 3 && !near; b++) if (townGround(x + a, y + b) || townSafeAt(x + a, y + b)) near = true; if (near) continue; var dd = Math.max(Math.abs(x - city.x), Math.abs(y - city.y)); if (dd < bd) { bd = dd; best = [x, y]; } } if (best) { city.x = best[0]; city.y = best[1]; } })(); stepOnce(0); stepOnce(4); } catch (_e) {} meetWalk(() => roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: Date.now() % 1000 })); });
    let ff = null;
    for (let i = 0; i < 150 && !ff; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board).catch(() => false)) ff = c; } if (!ff) await p.waitForTimeout(200); }
    for (let i = 0; i < 60; i++) { if (await M(() => !window.NFC || NFC.state === 'off')) break; await p.waitForTimeout(200); }
    await p.waitForTimeout(1500);
    const won = ff ? await ff.evaluate(() => { const S = FIGHT.S; S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u.armB = 0; u.armH = 0; });
      const r = { dead: S.units.filter(u => u.dead && !u.fled && !u.ghost).length }; S.over = true; S.result = 'won'; showOver('won'); return r; }).catch(() => null) : null;
    const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
    for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened).catch(() => false)); i++) await p.waitForTimeout(200);
    await p.waitForTimeout(1500);
    try { await p.frameLocator('#spoilsdoor iframe').locator('#camp').tap({ timeout: 6000 }); } catch (e) {}
    let s1 = null;
    for (let k = 0; k < 160; k++) { await p.waitForTimeout(250); const sf = settle(); if (!sf) continue; s1 = await sf.evaluate(STATE).catch(() => null); if (s1 && s1.st === 'in' && s1.fromFight && s1.acts && s1.acts.length) break; }
    ok('A1 MAKE CAMP on the loot screen: the camp stands on that fight\'s own board, its dead where they fell', !!won && won.dead > 0 && !!s1 && s1.st === 'in' && s1.fromFight && s1.dead === won.dead && s1.bodies >= 1,
      JSON.stringify({ won, st: s1 && s1.st, fromFight: s1 && s1.fromFight, dead: s1 && s1.dead, inView: s1 && s1.bodies }));
    /* the camp's clock runs an hour a beat: wait for the morning (7 to 10), then read it */
    const morning = async () => { for (let k = 0; k < 120; k++) { const h = await settle().evaluate(() => { const L = BohemiaCampLook.state(); return L.night ? -1 : L.hour; }).catch(() => -1); if (h >= 7 && h <= 10) return true; await p.waitForTimeout(150); } return false; };
    await morning();
    let s2 = await settle().evaluate(STATE).catch(() => null), house = 'the board\'s own house';
    /* a board with no house in the camp's picture (a camp of three is one tile; measured, the dealt board's nearest house two tiles out,
       off the picture) leans nobody, rightly: the lean is then proved on a HOUSE PLANTED in the board's own grid beside the camp's tile
       (a 3 by 2 block above it), the camp laid again, and the man must find it */
    if (s2 && (!s2.walls || !s2.walls.length)) {
      house = 'a house planted beside the camp (the dealt board has none in the camp\'s picture)';
      await settle().evaluate(() => { const B = BohemiaCampBoard._B, G = B.out.grid, P = B.pitch; for (let y = P.y - 2; y <= P.y - 1; y++) for (let x = P.x - 1; x <= P.x + P.w; x++) if (G.ok[y] && x >= 0 && x < G.w) G.ok[y][x] = 0; BohemiaCampLook.time(); });
      await p.waitForTimeout(600); await morning(); s2 = await settle().evaluate(STATE).catch(() => null); }
    const L2 = lives(s2);
    ok('A2 BY DAY THE COMPANY LIVES ON THE BOARD: a man goes through the dead, a man leans on a house touching the camp (at his right hand, on the glass), the fire kept, each his own act (' + house + ')', L2.good, L2.why);
    /* A3: drawn by the rig's own clip, cells on the beat's keys */
    const sf = settle();
    /* his clip's sheet loads the first time his act asks for it: give it the time a phone's first load takes */
    const leaner0 = s2 && s2.acts.find(a => a.act === 'lean');
    if (sf && leaner0) for (let k = 0; k < 40; k++) { const by = await sf.evaluate(n => (BohemiaCampLook.state().drawnBy || {})[n], leaner0.name).catch(() => null); if (by === 'anim:flirt') break; await p.waitForTimeout(250); }
    const a3 = sf ? await sf.evaluate(() => new Promise(res => { const seen = []; const t0 = performance.now(); const B = window.BohemiaIdles || (parent && parent.BohemiaIdles);
      const tick = () => { const L = BohemiaCampLook.state(); seen.push({ t: performance.now(), by: Object.assign({}, L.drawnBy), acts: L.acts.map(a => a.name + ':' + a.act) }); if (performance.now() - t0 < 2000) requestAnimationFrame(tick); else res(seen); }; requestAnimationFrame(tick); })).catch(() => null) : null;
    const leaner = s2 && s2.acts.find(a => a.act === 'lean');
    /* only the frames he is still at the wall (the camp's clock runs an hour a beat: by dusk the men take their night acts) */
    const byLean = a3 && leaner ? a3.filter(r => r.acts.indexOf(leaner.name + ':lean') >= 0).map(r => r.by[leaner.name === 'YOU' ? 'YOU' : leaner.name]).filter(Boolean) : [];
    /* his act's own sheet loads the first time it is asked (a still stands for him until then): from the frame it is in, every frame */
    const firstIn = byLean.indexOf('anim:flirt'), after = firstIn >= 0 ? byLean.slice(firstIn) : [];
    ok('A3 the man at the wall is drawn by the rig\'s own clip (ANIMATION\'s flirt, the hand up on the wall) from the moment its sheet is in, every frame', !!leaner && firstIn >= 0 && after.length >= byLean.length / 2 && after.every(v => v === 'anim:flirt'),
      leaner ? leaner.name + ': ' + [...new Set(byLean)].join(', ') + ' over ' + byLean.length + ' frames, the clip from frame ' + firstIn : 'no one at a wall');
    if (process.env.BOHEMIA_CAMP_DEBUG_MAP) console.log('DEBUG map ' + JSON.stringify(await require(process.env.BOHEMIA_CAMP_DEBUG_MAP)(p)));
    if (process.env.BOHEMIA_CAMP_DEBUG && sf) {
      console.log('DEBUG drawnBy ' + JSON.stringify((await sf.evaluate(STATE)).drawnBy));
      console.log('DEBUG looks ' + JSON.stringify(await sf.evaluate(() => { const I = window.BohemiaIdles || parent.BohemiaIdles; const L = BohemiaCampLook.state(); return L.acts.map(a => [a.name, a.look, I && I.activities ? I.activities(a.look) : null]); })));
      const cdp = await p.context().newCDPSession(p); await cdp.send('Profiler.enable'); await cdp.send('Profiler.start'); await p.waitForTimeout(2500); const { profile } = await cdp.send('Profiler.stop');
      const self = {}; const byId = {}; profile.nodes.forEach(n => byId[n.id] = n); const dt = profile.timeDeltas; profile.samples.forEach((id, i) => { const n = byId[id], k = n.callFrame.functionName + ' ' + (n.callFrame.url || '').split('/').pop() + ':' + n.callFrame.lineNumber; self[k] = (self[k] || 0) + (dt[i] || 0); });
      const par = {}; profile.nodes.forEach(n => (n.children || []).forEach(c => par[c] = n.id)); const by = {}; profile.samples.forEach((id, i) => { const n = byId[id]; if (!/^(restore|fill|drawImage)$/.test(n.callFrame.functionName)) return; const q = byId[par[id]]; const k = n.callFrame.functionName + ' <- ' + (q ? q.callFrame.functionName + ' ' + (q.callFrame.url || '').split('/').pop() + ':' + q.callFrame.lineNumber : '?'); by[k] = (by[k] || 0) + (dt[i] || 0); });
      console.log('DEBUG callers ' + Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => k + ' ' + Math.round(v / 1000) + 'ms').join(' | '));
      console.log('DEBUG top ' + Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([k, v]) => k + ' ' + Math.round(v / 1000) + 'ms').join(' | ')); }
    /* A4: frames at rest */
    const FPS = () => sf.evaluate(() => new Promise(res => { const t = []; const t0 = performance.now(); const CW = top.document.getElementById('cityFrame').contentWindow, h0 = BohemiaCampLook.state().hour, r0 = (CW.__MAP_UNDER_A_PLACE | 0);
      const tick = (x) => { t.push(x); if (x - t0 < 2000) requestAnimationFrame(tick); else res({ t, h0, h1: BohemiaCampLook.state().hour, rested: (CW.__MAP_UNDER_A_PLACE | 0) - r0, restedAll: CW.__MAP_UNDER_A_PLACE | 0 }); }; requestAnimationFrame(tick); })).catch(() => null);
    const rate = (o) => { const f = o && o.t || []; const g = f.slice(1).map((x, i) => x - f[i]); return { fps: f.length > 1 ? (f.length - 1) / ((f[f.length - 1] - f[0]) / 1000) : 0, worst: g.length ? Math.max(...g) : 999 }; };
    /* each measured in a calm stretch of daylight (the camp lays itself out again at dusk and dawn, a heavy one-off that is not the camp
       at rest): wait for the hour to be 7 to 12, measure, and measure again if the camp's acts changed under the sample */
    const calm = async (old) => { await p.evaluate(o => { document.getElementById('cityFrame').contentWindow.__MAP_DRAW_UNDER = o; }, old);
      let o = null;
      for (let tries = 0; tries < 4; tries++) {
        for (let k = 0; k < 80; k++) { const h = await sf.evaluate(() => { const L = BohemiaCampLook.state(); return L.night ? -1 : L.hour; }).catch(() => -1); if (h >= 7 && h <= 12) break; await p.waitForTimeout(150); }
        const k0 = await sf.evaluate(() => BohemiaCampLook.state().acts.map(a => a.act).join(','));
        o = await FPS(); o.k0 = k0; o.k1 = await sf.evaluate(() => BohemiaCampLook.state().acts.map(a => a.act).join(','));
        if (o.k0 === o.k1) break; }
      await p.evaluate(() => { document.getElementById('cityFrame').contentWindow.__MAP_DRAW_UNDER = false; });
      return o; };
    const o4 = sf ? await calm(true) : null, r0 = rate(o4);
    const n4 = sf ? await calm(false) : null, r1 = rate(n4);
    ok('A4 FRAMES: the camp at rest draws three times the frames of the old way or more, no frame over 200 ms (this box, full speed): the map rests under it', r1.fps >= 3 * r0.fps && r1.fps >= 30 && r1.worst <= 200 && !!n4 && n4.restedAll > 0,
      'now ' + r1.fps.toFixed(1) + ' fps, worst ' + Math.round(r1.worst) + ' ms, the map rested its picture ' + (n4 && n4.restedAll) + ' times since the camp opened (its loop wakes about once in two seconds under a place); the old way (the map drawn under the camp) ' + r0.fps.toFixed(1) + ' fps, worst ' + Math.round(r0.worst) + ' ms');
    ok('  and the camp\'s clock still runs while the map rests (its hour moves on)', !!n4 && n4.h1 !== n4.h0, n4 ? 'hour ' + n4.h0 + ' -> ' + n4.h1 : 'not read');
    if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'camp_after_a_fight.png') });
    if (process.env.BOHEMIA_CAMP_DEBUG_GRID) console.log('DEBUG grid ' + JSON.stringify(await require(process.env.BOHEMIA_CAMP_DEBUG_GRID)(p), null, 0));
    if (process.env.BOHEMIA_CAMP_DEBUG_DRAWN) console.log('DEBUG drawn ' + JSON.stringify(await require(process.env.BOHEMIA_CAMP_DEBUG_DRAWN)(p)));
    /* P1: the old way, laid again */
    await morning();   /* by day, when a man would lean: the planted fail is only red for the switch, never for the night */
    if (sf) await sf.evaluate(() => { window.__CAMP_NO_LEAN = true; try { BohemiaCampLook.time(); } catch (e) {} });
    await p.waitForTimeout(300);
    const s3 = sf ? await sf.evaluate(STATE).catch(() => null) : null;
    const L3 = lives(s3);
    ok('P1 PLANTED: the old way (no man at a wall), by day, the camp laid again: A2\'s own check goes RED', !!s3 && !!s3.acts && s3.acts.length > 0 && !s3.night && !L3.good && !s3.acts.some(a => a.act === 'lean'), (s3 && s3.night ? 'NIGHT: proves nothing; ' : 'by day (' + (s3 && s3.hour) + ' o\'clock); ') + L3.why);
    if (sf) await sf.evaluate(() => { window.__CAMP_NO_LEAN = false; try { BohemiaCampLook.time(); } catch (e) {} });
    const mine = errs.filter(e => /\[camp\]/.test(e));
    ok('A5 nothing threw', !mine.length, mine.length ? mine.slice(0, 3).join(' | ') : (errs.length ? 'none of the camp\'s (' + errs.length + ' others: ' + errs[0] + ')' : 'none'));
  } catch (e) { ok('the gate ran to its end', false, String(e && e.stack || e).slice(0, 300)); }
  try { await d.close(); } catch (e) {}
  console.log('THE CAMP AFTER A FIGHT: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
