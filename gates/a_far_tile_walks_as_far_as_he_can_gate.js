#!/usr/bin/env node
/* A FAR TILE WALKS AS FAR AS HE CAN (COMBAT [a far tile walks as far as he can], rule 206, Paolo 10/25: 'in Battle Brothers, if I
   clicked a tile farther than my stamina would allow, if you double clicked it you would take the path as far as it goes... fix
   that now'; records/BOHEMIA_PAOLO_A_FAR_TILE_WALKS_AS_FAR_AS_HE_CAN_10_25_26.md).
   Measured before (main 80ba31e1): a tile past this turn's AP said 'Too far for the AP left.' and nothing moved.
   Legs:
   F1 the rules, headless, rolled boards (seven kinds, four seeds, every man of his at the start of his turn, every open tile past
      this turn's AP): the whole way is found round houses and blockers (never refused while he has the AP for a step); the
      stop is the last tile on it he can stand on with this turn's AP (never a friend's tile); walked along the drawn way he ends
      on the stop with exactly its AP spent (a free swing that lands may hold him earlier, counted apart);
   on the real page, his phone (390 x 844 at 3x) and his computer (1440 x 900):
   F2 a tap on a far tile: the line says how far he gets, the whole way is drawn with a mark where he stops, the big button says
      WALK; the second tap walks him to the mark, his AP spent the walk's own;
   F3 the computer: the mouse over the far tile is the first tap, the click walks it, the same;
   F4 nothing threw.
   Run: node gates/a_far_tile_walks_as_far_as_he_can_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== A FAR TILE WALKS AS FAR AS HE CAN GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  const errs = [];
  /* F1 */
  const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
  const ctx = engine(), F = ctx.FIGHT, T = F._t;
  let tiles = 0, refused = [], badStop = [], walked = 0, off = [], held = 0, gapped = [];
  for (const kind of ['strip', 'suburb', 'culdesac', 'ruin', 'scrub', 'shore', 'landfill']) for (const seed of [3, 11, 19, 27]) {
    try {
      ctx.setSeed(seed); F.setup({ seed, kind, auto: true, formation: null, deploy: false, party: { faction: 'brigands', count: 3, days: 1 } });
      const S = F.S; S.deploy = false;
      let g = 0; while (F.current() && F.current().side !== 'you' && g++ < 200) F.aiStep(F.current());
      const u = F.current(); if (!u || u.side !== 'you') continue;
      const near = F.reach(u, null, true), all = F.reach(u, Infinity, true);
      const far = Object.keys(all.best).map(Number).filter(k => near.best[k] === undefined).map(k => ({ x: k % S.w, y: Math.floor(k / S.w) }));
      const cheapest = Math.min(...[[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].map(d => { const x = u.x + d[0], y = u.y + d[1]; return T.passable(x, y) ? T.stepCost(u, u.x, u.y, x, y) : Infinity; }));
      far.slice(0, 40).forEach(q => {
        tiles++;
        const w = F.farWalk(u, q.x, q.y);
        if (!w || !w.stop) { if (u.ap >= cheapest && !u.netted) refused.push(kind + seed + ' ' + q.x + ',' + q.y); return; }
        let at = { x: u.x, y: u.y }, c = 0, okWay = true;
        w.path.forEach(p => { if (Math.max(Math.abs(p.x - at.x), Math.abs(p.y - at.y)) !== 1) okWay = false; at = p; });
        if (!okWay) gapped.push(kind + seed);
        at = { x: u.x, y: u.y }; for (let i = 0; i < w.n; i++) { c += T.stepCost(u, at.x, at.y, w.path[i].x, w.path[i].y); at = w.path[i]; }
        const mate = S.units.find(v => v !== u && F.onField(v) && v.x === w.stop.x && v.y === w.stop.y);
        const next = w.n < w.path.length ? T.stepCost(u, w.stop.x, w.stop.y, w.path[w.n].x, w.path[w.n].y) : 0;
        if (c !== w.cost || c > u.ap || mate || (w.n < w.path.length && !S.units.some(v => v !== u && F.onField(v) && v.x === w.path[w.n].x && v.y === w.path[w.n].y) && c + next <= u.ap)) badStop.push(kind + seed + ' ' + q.x + ',' + q.y + ' cost ' + c + '/' + w.cost + ' ap ' + u.ap);
      });
      /* walk three of them for real, each from a fresh copy of the turn */
      far.slice(0, 3).forEach(q => {
        const snap = F.freeze(), w = F.farWalk(u, q.x, q.y); if (!w || !w.stop) { F.thaw(snap, true); return; }
        const ap0 = u.ap, n0 = S.log.length; F.moveTo(u, w.stop.x, w.stop.y, true, w.path.slice(0, w.n));
        const hit = S.log.slice(n0).some(e => e.t === 'held' || (e.t === 'attack' && e.free && e.to === u.id));
        if (hit) held++; else { walked++; if (u.x !== w.stop.x || u.y !== w.stop.y || ap0 - u.ap !== w.cost) off.push(kind + seed + ' at ' + u.x + ',' + u.y + ' not ' + w.stop.x + ',' + w.stop.y + ' spent ' + (ap0 - u.ap) + '/' + w.cost); }
        F.thaw(snap, true);
      });
    } catch (e) { errs.push(kind + seed + ': ' + e.message.slice(0, 140)); }
  }
  leg(tiles > 200 && refused.length === 0 && gapped.length === 0 && badStop.length === 0, '*** F1 A FAR TILE IS NEVER REFUSED *** (rule 206(a)(c)): the whole way round houses and blockers, the stop the last tile he can stand on with this turn\'s AP, never a friend\'s',
    tiles + ' far tiles on 28 boards; refused ' + refused.length + ', broken ways ' + gapped.length + ', wrong stops ' + badStop.length + (refused.concat(badStop).length ? ': ' + refused.concat(badStop).slice(0, 3).join('; ') : ''));
  leg(walked > 30 && off.length === 0, '  walked along the drawn way, he ends on the mark with exactly its AP spent (a free swing that holds him counted apart)',
    walked + ' walks, ' + off.length + ' off' + (off.length ? ': ' + off.slice(0, 3).join('; ') : '') + '; held by a swing ' + held);

  /* F2, F3: the page */
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  for (const profile of ['phone_portrait', 'computer']) {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug'] }) });
    const p = d.page; p.on('pageerror', e => errs.push(profile + ': ' + e.message));
    try {
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
      for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : 'wait'; }); if (st === 'mine') break; await p.waitForTimeout(250); }
      /* his man on an open row, a far tile on the same board, the camera on both */
      const setUp = await p.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(); S.units.forEach(v => { if (v !== u && v.side === 'them') v.fled = true; });
        u.ap = u.apTurn; u.fat = 0; FIGHT_UI.pend = null; FIGHT_UI.anim = []; FIGHT_UI.glide = null;
        const near = FIGHT.reach(u, null, true), all = FIGHT.reach(u, Infinity, true);
        const far = Object.keys(all.best).map(Number).filter(k => near.best[k] === undefined).map(k => ({ x: k % S.w, y: Math.floor(k / S.w) }))
          .filter(q => { const w = FIGHT.farWalk(u, q.x, q.y); return w && w.stop && w.path.length >= w.n + 2 && w.path.length <= w.n + 5; })
          .sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y))[0];
        if (!far) return null;
        FIGHT_UI.cx = ((u.x + far.x) / 2 + .5) * FIGHT_UI.tw; FIGHT_UI.cy = ((u.y + far.y) / 2 + .5) * FIGHT_UI.th; hud();
        return { far, u: { id: u.id, x: u.x, y: u.y, ap: u.ap } }; });
      if (!setUp) { errs.push(profile + ': no far tile on the board'); continue; }
      await p.waitForTimeout(400);
      const at = await p.evaluate(q => { const s = { x: sx((q.x + .5) * FIGHT_UI.tw), y: sy((q.y + .5) * FIGHT_UI.th) }; return { x: s.x, y: s.y, inside: s.x > 4 && s.y > 4 && s.x < innerWidth - 4 && s.y < innerHeight - BOTH - 4 }; }, setUp.far);
      if (profile === 'computer') await p.mouse.move(at.x, at.y, { steps: 4 }); else await p.touchscreen.tap(at.x, at.y);
      await p.waitForTimeout(400);
      const first = await p.evaluate(() => { const pd = FIGHT_UI.pend || {}; return { say: document.getElementById('say').innerText, big: document.getElementById('bend').textContent, far: !!pd.far, stop: pd.stop || null, cost: pd.cost, rest: (pd.rest || []).length, ap: FIGHT.current().ap }; });
      if (profile === 'computer') await p.mouse.click(at.x, at.y); else await p.touchscreen.tap(at.x, at.y);
      await p.waitForFunction(() => !FIGHT_UI.anim.length, null, { timeout: 8000 }).catch(() => {});
      await p.waitForTimeout(300);
      const after = await p.evaluate(id => { const u = FIGHT.byId(id); return { x: u.x, y: u.y, ap: u.ap }; }, setUp.u.id);
      leg(at.inside && first.far && first.stop && first.rest >= 1 && /Too far for one turn/.test(first.say) && /WALK/.test(first.big)
        && after.x === first.stop.x && after.y === first.stop.y && setUp.u.ap - after.ap === first.cost,
        '*** F' + (profile === 'computer' ? '3 COMPUTER: THE MOUSE OVER IT, THE CLICK WALKS IT' : '2 PHONE: TAP, TAP, HE WALKS AS FAR AS HE CAN') + ' *** (rule 206): the line says how far, the rest of the way drawn dim past the mark, WALK; he ends on the mark, the walk\'s own AP spent',
        first.say.replace(/\n/g, ' / ').slice(0, 100) + ' | ' + first.big + ' | from ' + setUp.u.x + ',' + setUp.u.y + ' to ' + after.x + ',' + after.y + ' (mark ' + (first.stop ? first.stop.x + ',' + first.stop.y : 'none') + ', ' + first.rest + ' tiles dim), spent ' + (setUp.u.ap - after.ap) + ' of ' + first.cost);
    } catch (e) { errs.push(profile + ': ' + e.message.slice(0, 160)); }
    finally { await d.close(); }
  }
  leg(errs.length === 0, 'F4 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
