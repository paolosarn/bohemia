#!/usr/bin/env node
/* WALK THROUGH YOUR OWN MEN, ALWAYS (COMBAT [walk through your own men], rule 199, Paolo 10/25, his 'new rule': 'any teammate can
   walk through another teammate at all times... each tile is not the size of a human'; overrides Battle Brothers for us;
   records/BOHEMIA_PAOLO_RETREAT_THE_ROUT_WALK_THROUGH_YOUR_MEN_AND_EVERY_CURRENCY_ON_TOP_10_25_26.md).
   Measured before (main 3dbc2553): the path finder let a man through ONE of his own, never two in a row (rule 70), a diagonal
   step between two of his men was a squeeze, and AUTO's walk field treated every friend's tile as a wall.
   Legs:
   W1 BOXED IN BY HIS OWN MEN (rolled boards, seven kinds, four seeds; the man up boxed by two rings of his own men, the enemy
      sent away): he reaches the open tiles beyond in one move, every tile at the same AP as on the board with his men gone, by
      his finger's rules and by the brains'; and he walks there for real, the AP spent the empty board's;
   W2 NEVER ON A FRIEND: no tile he can end on holds a friend; a walk cut short on a friend's tile (a swing that holds him) leaves
      two men on no tile, in a file of his men too;
   W3 ENEMIES STILL BLOCK: an enemy's tile is never on any way he is shown, and his zone still bites (a free swing on leaving it);
   W4 AUTO USES IT (rolled fights, AUTO both sides): men step through their own men's tiles, and after every act no two men stand
      on one tile;
   on the real page, his phone (390 x 844 at 3x) and his computer (1440 x 900):
   W5 the lit tiles reach past a file of his own men, and a tap (a click) on the open tile beyond walks him there, through them;
   W6 nothing threw.
   Run: node gates/walk_through_your_own_men_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== WALK THROUGH YOUR OWN MEN GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];

/* the man up, his own men set on the open tiles of the two rings round him (as many as he has), the enemy sent off the board */
function boxIn(F, T, S, u, keepFoes) {
  const mates = S.units.filter(v => v !== u && v.side === u.side && F.onField(v));
  if (!keepFoes) S.units.forEach(v => { if (v.side !== u.side) v.fled = true; });
  const free = (x, y) => x >= 0 && y >= 0 && x < S.w && y < S.h && T.passable(x, y) && !S.units.some(v => F.onField(v) && v !== u && v.x === x && v.y === y && v.side !== u.side);
  const ring = [];
  for (let r = 1; r <= 2; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++)
    if (Math.max(Math.abs(dx), Math.abs(dy)) === r && free(u.x + dx, u.y + dy)) ring.push({ x: u.x + dx, y: u.y + dy, r });
  const set = ring.slice(0, mates.length);
  mates.forEach((m, i) => { if (set[i]) { m.x = set[i].x; m.y = set[i].y; } else m.fled = true; });
  return { mates: mates.filter(m => F.onField(m)), ring: set, full: set.filter(q => q.r === 1).length === ring.filter(q => q.r === 1).length };
}
const shared = (F, S) => { const seen = {}; let n = 0; S.units.forEach(v => { if (!F.onField(v)) return; const k = v.x + ',' + v.y; if (seen[k]) n++; seen[k] = true; }); return n; };

(async () => {
  const errs = [];
  const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
  const ctx = engine(), F = ctx.FIGHT, T = F._t;
  /* W1, W2, W3 */
  let boards = 0, boxed = 0, beyond = 0, costOff = [], brainOff = [], walks = 0, walkOff = [], onFriend = 0, through = 0, enemyOnWay = 0, bites = 0, bitesSeen = 0, holds = 0, holdShared = 0;
  for (const kind of ['strip', 'suburb', 'culdesac', 'ruin', 'scrub', 'shore', 'landfill']) for (const seed of [3, 11, 19, 27]) {
    try {
      ctx.setSeed(seed); F.setup({ seed, kind, auto: true, formation: null, deploy: false, party: { faction: 'brigands', count: 3, days: 1 } });
      const S = F.S; S.deploy = false;
      let g = 0; while (F.current() && F.current().side !== 'you' && g++ < 200) F.aiStep(F.current());
      const u = F.current(); if (!u || u.side !== 'you' || u.netted) continue;
      boards++;
      const snap = F.freeze();
      u.ap = u.apTurn;
      const box = boxIn(F, T, S, u); if (!box.full || box.mates.length < 9) { F.thaw(snap, true); continue; }
      boxed++;
      const withMen = F.reach(u, null, true), brainWith = F.reach(u);
      box.mates.forEach(m => { m.fled = true; }); const bare = F.reach(u, null, true), brainBare = F.reach(u); box.mates.forEach(m => { m.fled = false; });
      const k = (x, y) => y * S.w + x, held = {}; box.ring.forEach(q => { held[k(q.x, q.y)] = true; });
      Object.keys(bare.best).forEach(kk => {
        if (held[kk] || Number(kk) === k(u.x, u.y)) return;
        const r = Math.max(Math.abs(kk % S.w - u.x), Math.abs(Math.floor(kk / S.w) - u.y));
        if (r >= 2) beyond += withMen.best[kk] !== undefined ? 1 : 0;
        if (withMen.best[kk] !== bare.best[kk]) costOff.push(kind + seed + ' ' + (kk % S.w) + ',' + Math.floor(kk / S.w) + ' ' + withMen.best[kk] + '/' + bare.best[kk]);
      });
      Object.keys(brainBare.best).forEach(kk => { if (!held[kk] && Number(kk) !== k(u.x, u.y) && brainWith.best[kk] !== brainBare.best[kk]) brainOff.push(kind + seed + ' ' + (kk % S.w) + ',' + Math.floor(kk / S.w)); });
      Object.keys(withMen.best).forEach(kk => { if (held[kk]) onFriend++; });
      /* walk for real to the three farthest open tiles past the second ring */
      const far = Object.keys(withMen.best).map(Number).filter(kk => !held[kk] && Math.max(Math.abs(kk % S.w - u.x), Math.abs(Math.floor(kk / S.w) - u.y)) >= 3)
        .sort((a, b) => withMen.best[b] - withMen.best[a]).slice(0, 3);
      far.forEach(kk => {
        const s2 = F.freeze(), x = kk % S.w, y = Math.floor(kk / S.w), ap0 = u.ap, path0 = F.pathTo(u, x, y, F.reach(u, null, true));
        if (path0 && path0.some(p => held[k(p.x, p.y)])) through++;
        F.moveTo(u, x, y, true); walks++;
        if (u.x !== x || u.y !== y || ap0 - u.ap !== bare.best[kk] || shared(F, S)) walkOff.push(kind + seed + ' to ' + x + ',' + y + ' at ' + u.x + ',' + u.y + ' spent ' + (ap0 - u.ap) + '/' + bare.best[kk]);
        F.thaw(s2, true);
      });
      F.thaw(snap, true);
      /* W3: the enemy back, one of them on the first ring: never on a way, and his zone bites a man walking out through it */
      const s3 = F.freeze(); u.ap = u.apTurn;
      const foe = S.units.find(v => v.side !== u.side && F.onField(v) && !F.isRanged(v.weapon)) || null;
      if (foe) {
        const b2 = boxIn(F, T, S, u, true);
        const slot = b2.ring.find(q => q.r === 1), m0 = b2.mates.find(m => m.x === slot.x && m.y === slot.y);
        if (m0) { m0.fled = true; foe.x = slot.x; foe.y = slot.y; foe.stunned = false; foe.morale = 'Steady'; }
        const f2 = F.reach(u, null, true);
        Object.keys(f2.best).forEach(kk => { const pth = F.pathTo(u, kk % S.w, Math.floor(kk / S.w), f2); if (pth && pth.some(p => p.x === foe.x && p.y === foe.y)) enemyOnWay++; });
        /* step out of his zone through a friend's tile: the free swing is rolled */
        const out = Object.keys(f2.best).map(Number).filter(kk => { const x = kk % S.w, y = Math.floor(kk / S.w); return Math.max(Math.abs(x - foe.x), Math.abs(y - foe.y)) >= 2; })[0];
        if (out !== undefined && F.zocOn(u, u.x, u.y).length) {
          bitesSeen++; const n0 = S.log.length; F.moveTo(u, out % S.w, Math.floor(out / S.w), true);
          const lg = S.log.slice(n0); if (lg.some(e => e.t === 'attack' && e.free) || lg.some(e => e.t === 'held')) bites++;
          if (lg.some(e => e.t === 'held')) { holds++; if (shared(F, S)) holdShared++; }
        }
      }
      F.thaw(s3, true);
    } catch (e) { errs.push(kind + seed + ': ' + e.message.slice(0, 140)); }
  }
  /* W2's hard case, forced: a file of three of his men, a melee foe beside the middle one, the free swing always lands: he is held
     on a friend's tile with another friend behind him; the two of them must never share it */
  let forced = 0, forcedShared = 0;
  try {
    const c2 = engine({ patch: r => r.replace('function resolveAttack(', 'function resolveAttack(a, t, sk, o) { if (o && o.free) return Object.assign(resolveAttack0(a, t, sk, o), { hit: true }); return resolveAttack0(a, t, sk, o); }\n  function resolveAttack0(') });
    const G = c2.FIGHT, U = G._t;
    for (const seed of [3, 7, 11, 19, 23, 31]) {
      c2.setSeed(seed); G.setup({ seed, kind: 'scrub', auto: true, formation: null, deploy: false, flat: true, party: { faction: 'brigands', count: 3, days: 1 } });
      const S = G.S; S.deploy = false;
      let g = 0; while (G.current() && G.current().side !== 'you' && g++ < 200) G.aiStep(G.current());
      const u = G.current(); if (!u || u.side !== 'you') continue;
      u.ap = 99; const mates = S.units.filter(v => v !== u && v.side === u.side && G.onField(v)), foe = S.units.find(v => v.side !== u.side && G.onField(v) && !G.isRanged(v.weapon));
      if (mates.length < 3 || !foe) continue;
      S.units.forEach(v => { if (v.side !== u.side && v !== foe) v.fled = true; });
      /* a row along x: u, m1, m2, m3, open; the foe one row above m2 */
      let row = null;
      for (let y = 1; y < S.h - 1 && !row; y++) for (let x = 0; x + 5 < S.w && !row; x++) {
        let ok = true; for (let i = 0; i <= 5; i++) if (!U.passable(x + i, y)) ok = false;
        if (ok && U.passable(x + 2, y - 1)) row = { x, y };
      }
      if (!row) continue;
      S.units.forEach(v => { if (G.onField(v)) { v.x = -50; v.y = -50; } });
      u.x = row.x; u.y = row.y; mates.slice(0, 3).forEach((m, i) => { m.x = row.x + 1 + i; m.y = row.y; });
      mates.slice(3).forEach(m => { m.fled = true; });
      foe.x = row.x + 2; foe.y = row.y - 1; foe.stunned = false; foe.morale = 'Steady';
      const n0 = S.log.length; G.moveTo(u, row.x + 4, row.y, true, [1, 2, 3, 4].map(i => ({ x: row.x + i, y: row.y })));   /* the drawn way straight down the file */
      if (S.log.slice(n0).some(e => e.t === 'held')) { forced++; if (shared(G, S)) forcedShared++; }
    }
  } catch (e) { errs.push('forced hold: ' + e.message.slice(0, 140)); }

  leg(boxed >= 10 && beyond > 0 && costOff.length === 0 && brainOff.length === 0,
    '*** W1 BOXED IN BY HIS OWN MEN, HE WALKS OUT *** (rule 199(a)(d)): every tile past two rings of his own men reached in one move at the AP the empty board asks, his finger\'s rules and the brains\'',
    boxed + ' of ' + boards + ' boards boxed by 9+ of his men; ' + beyond + ' tiles past the rings reached; cost off ' + costOff.length + ', brains off ' + brainOff.length + (costOff.concat(brainOff).length ? ': ' + costOff.concat(brainOff).slice(0, 3).join('; ') : ''));
  leg(walks >= 20 && walkOff.length === 0 && through >= walks / 2,
    '  and he walks it for real: on the tile, the AP the empty board asks, through his men',
    walks + ' walks, ' + through + ' through his men, ' + walkOff.length + ' off' + (walkOff.length ? ': ' + walkOff.slice(0, 3).join('; ') : ''));
  leg(onFriend === 0 && holdShared === 0 && forced >= 3 && forcedShared === 0,
    '*** W2 NEVER ON A FRIEND *** (rule 199(b), NOBODY STANDS ON ANYBODY): no tile he may end on holds a friend; held on a friend\'s tile in a file of his men, the two never share it',
    'friend tiles offered ' + onFriend + '; held on the box ' + holds + ' (' + holdShared + ' shared); forced holds in a file of three ' + forced + ' (' + forcedShared + ' shared)');
  leg(enemyOnWay === 0 && bitesSeen >= 5 && bites === bitesSeen,
    '*** W3 ENEMIES STILL BLOCK, THEIR ZONES BITE *** (rule 199(c)): no way runs through an enemy\'s tile; walking out of his zone through his own men, the free swing is rolled',
    'ways through an enemy ' + enemyOnWay + '; ' + bites + ' of ' + bitesSeen + ' walks out of a zone met the swing');

  /* W4: AUTO both sides, rolled fights */
  let fights = 0, steps = 0, throughSteps = 0, fileSteps = 0, sharedAfter = 0;
  for (const kind of ['strip', 'suburb', 'culdesac', 'ruin', 'scrub', 'shore', 'landfill']) for (const seed of [5, 13, 21]) {
    try {
      ctx.setSeed(seed); F.setup({ seed, kind, auto: true, formation: null, deploy: false, party: { faction: 'brigands', count: 6, days: 1 } });
      const S = F.S; S.deploy = false; fights++;
      for (let g = 0; g < 600 && !S.over && F.current(); g++) {
        const u = F.current(), at = {}; S.units.forEach(v => { if (v !== u && F.onField(v)) at[v.x + ',' + v.y] = v.side; });
        const n0 = S.log.length; F.aiStep(u); let last = false;
        S.log.slice(n0).forEach(e => { if (e.t === 'step' && e.id === u.id) { steps++; const on = at[e.x + ',' + e.y] === u.side; if (on) throughSteps++; if (on && last) fileSteps++; last = on; } });
        if (shared(F, S)) sharedAfter++;
      }
    } catch (e) { errs.push('auto ' + kind + seed + ': ' + e.message.slice(0, 140)); }
  }
  leg(fights >= 15 && fileSteps > 0 && sharedAfter === 0,
    '*** W4 AUTO WALKS THROUGH ITS OWN MEN *** (rule 199(d)): in rolled AUTO fights men walk through a file of their friends (two friends\' tiles in a row, which rule 70 refused), and after every act no two men share a tile',
    fights + ' fights, ' + steps + ' steps, ' + throughSteps + ' through a friend\'s tile, ' + fileSteps + ' of them the second friend in a row; shared after an act ' + sharedAfter);

  /* W5: the page */
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  for (const profile of ['phone_portrait', 'computer']) {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug'] }) });
    const p = d.page; p.on('pageerror', e => errs.push(profile + ': ' + e.message));
    try {
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
      for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : 'wait'; }); if (st === 'mine') break; await p.waitForTimeout(250); }
      /* a block of six of his own men across his way, two deep and three wide, the open tile three away straight past them: every
         three-step way there crosses two of them in a row (rule 70's refusal), any way round costs more */
      const setUp = await p.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(), T = FIGHT._t; S.units.forEach(v => { if (v !== u && v.side === 'them') v.fled = true; });
        u.ap = u.apTurn; u.fat = 0; FIGHT_UI.pend = null; FIGHT_UI.anim = []; FIGHT_UI.glide = null;
        const mates = S.units.filter(v => v !== u && v.side === u.side && FIGHT.onField(v)); if (mates.length < 6) return null;
        const open = (x, y) => x >= 0 && y >= 0 && x < S.w && y < S.h && T.passable(x, y);
        for (const d of [[-1, 0], [1, 0], [0, 1], [0, -1]]) {
          const pp = [d[1], d[0]], block = [];
          for (let i = 1; i <= 2; i++) for (let j = -1; j <= 1; j++) block.push({ x: u.x + d[0] * i + pp[0] * j, y: u.y + d[1] * i + pp[1] * j });
          const to = { x: u.x + d[0] * 3, y: u.y + d[1] * 3 };
          if (!block.concat([to]).every(q => open(q.x, q.y))) continue;
          const bk = new Set(block.map(q => q.y * S.w + q.x).concat([to.y * S.w + to.x]));
          mates.forEach((m, i) => { if (i < 6) { m.x = block[i].x; m.y = block[i].y; } else if (bk.has(m.y * S.w + m.x)) m.fled = true; });
          const f = FIGHT.reach(u, null, true), k = to.y * S.w + to.x; if (f.best[k] === undefined) return { none: true };
          const path = FIGHT.pathTo(u, to.x, to.y, f), held = new Set(block.map(q => q.y * S.w + q.x));
          FIGHT_UI.cx = ((u.x + to.x) / 2 + .5) * FIGHT_UI.tw; FIGHT_UI.cy = ((u.y + to.y) / 2 + .5) * FIGHT_UI.th; hud();
          return { to, file: path.slice(0, 2), cost: f.best[k], straight: path.length === 3 && held.has(path[0].y * S.w + path[0].x) && held.has(path[1].y * S.w + path[1].x), u: { id: u.id, x: u.x, y: u.y, ap: u.ap } };
        }
        return null; });
      if (setUp && setUp.none) { leg(false, '*** W5 ' + profile + ' *** the open tile past a block of six of his own men is not lit'); continue; }
      if (!setUp) { errs.push(profile + ': no straight file on the board'); continue; }
      await p.waitForTimeout(400);
      const lit = await p.evaluate(q => { const pend = FIGHT_UI.pend; const f = FIGHT.reach(FIGHT.current(), null, true); return f.best[q.y * FIGHT.S.w + q.x] !== undefined; }, setUp.to);
      const at = await p.evaluate(q => { const s = { x: sx((q.x + .5) * FIGHT_UI.tw), y: sy((q.y + .5) * FIGHT_UI.th) }; return { x: s.x, y: s.y, inside: s.x > 4 && s.y > 4 && s.x < innerWidth - 4 && s.y < innerHeight - BOTH - 4 }; }, setUp.to);
      if (profile === 'computer') { await p.mouse.move(at.x, at.y, { steps: 4 }); await p.waitForTimeout(300); await p.mouse.click(at.x, at.y); }
      else { await p.touchscreen.tap(at.x, at.y); await p.waitForTimeout(400); const pend = await p.evaluate(() => !!FIGHT_UI.pend); if (pend) await p.touchscreen.tap(at.x, at.y); }
      await p.waitForFunction(() => !FIGHT_UI.anim.length, null, { timeout: 8000 }).catch(() => {});
      await p.waitForTimeout(300);
      const after = await p.evaluate(id => { const u = FIGHT.byId(id), S = FIGHT.S; const seen = {}; let sh = 0; S.units.forEach(v => { if (!FIGHT.onField(v)) return; const k = v.x + ',' + v.y; if (seen[k]) sh++; seen[k] = true; }); return { x: u.x, y: u.y, ap: u.ap, shared: sh, say: document.getElementById('say').innerText }; }, setUp.u.id);
      leg(at.inside && lit && setUp.straight && after.x === setUp.to.x && after.y === setUp.to.y && setUp.u.ap - after.ap === setUp.cost && after.shared === 0,
        '*** W5 ' + (profile === 'computer' ? 'COMPUTER: THE CLICK' : 'PHONE: THE TAP') + ' WALKS HIM THROUGH TWO OF HIS OWN MEN *** (rule 199): the tile past a block of his men two deep is lit, the way runs straight through two of them, he walks it at the normal cost',
        'from ' + setUp.u.x + ',' + setUp.u.y + ' through ' + setUp.file.map(q => q.x + ',' + q.y).join(' ') + ' to ' + after.x + ',' + after.y + ' (asked ' + setUp.to.x + ',' + setUp.to.y + '), spent ' + (setUp.u.ap - after.ap) + ' of ' + setUp.cost + ', shared ' + after.shared + (after.say ? ' | ' + after.say.replace(/\n/g, ' / ').slice(0, 80) : ''));
    } catch (e) { errs.push(profile + ': ' + e.message.slice(0, 160)); }
    finally { await d.close(); }
  }
  leg(errs.length === 0, 'W6 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
