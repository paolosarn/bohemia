#!/usr/bin/env node
/* COMBAT 5 [climb or attack] 11/2 -- THE PHONE LOOK (rule 328): the real fight page at his phone's size (390 x 844), a man of his
   on the street beside a roof, a man of theirs he can reach from the roof: the walk's preview before the climb (the tag and the line
   warn), the climb, then the strike square and a tap on the man of theirs. Pictures to records/combat_climb_or_attack_11_2/.
   Exits 1 when a word is missing (it is a leg of gates/climb_or_attack_gate.js --phone).
     node tools/bohemia_combat_climb_or_attack_phone_11_2_26.js */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..'), OUT = path.join(ROOT, 'records/combat_climb_or_attack_11_2');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
(async () => {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 2, kind: 'works', band: ['brigand_thug', 'brigand_thug'], teach: false }) });
  const p = d.page; let bad = 0;
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
    if (await p.evaluate(() => !!FIGHT.S.deploy)) { await p.evaluate(() => document.getElementById('bend').click()); }   /* the placement step: FIGHT */
    await p.waitForFunction(() => { const u = FIGHT.current(); return !FIGHT.S.deploy && u && u.side === 'you' && crewControlled(u) && !FIGHT_UI.anim.length; }, null, { timeout: 60000 });
    const set = await p.evaluate(() => {
      const S = FIGHT.S, u = FIGHT.current(), T = FIGHT._t; let found = null;
      for (let y = 1; y < S.h - 1 && !found; y++) for (let x = 1; x < S.w - 1 && !found; x++) {
        if (!FIGHT.isRoof(x, y) || !T.passable(x, y) || FIGHT._t.unitAt(x, y)) continue;
        const foot = [[0, 1], [1, 0], [-1, 0], [0, -1]].map(q => ({ x: x + q[0], y: y + q[1] })).filter(q => T.passable(q.x, q.y) && !FIGHT.isRoof(q.x, q.y) && FIGHT.level(q.x, q.y) < FIGHT.level(x, y) && !FIGHT._t.unitAt(q.x, q.y))[0];
        if (foot) found = { x, y, foot };
      }
      if (!found) return null;
      const foe = S.units.filter(v => v.side === 'them' && FIGHT.onField(v))[0];
      S.units.forEach(v => { if (v !== u && v !== foe && v.side === 'them') { v.x = -50; v.y = -50; } });
      u.x = found.foot.x; u.y = found.foot.y; u.ap = u.apTurn; u.fat = 0;
      foe.x = -50; foe.y = -50;
      const f = FIGHT.reach(u, null, true), path = FIGHT.pathTo(u, found.x, found.y, f);
      walkPreview(u, { x: found.x, y: found.y }, f, path); hud(); placePick();
      return { found, foe: foe.id, me: u.id, name: u.name, main: !!u.main, pick: document.getElementById('pick').innerHTML, pend: !!UI.pend };
    });
    if (!set) { console.log('  FAIL no roof with a street beside it'); process.exit(1); }
    await p.waitForTimeout(300);
    const pre = await p.evaluate(() => ({ pick: document.getElementById('pick').innerText, say: document.getElementById('say').innerText }));
    if (!pre.pick) pre.pick = set.pick.replace(/<[^>]+>/g, ' ');   /* the tag as placed, when a frame has since moved it */
    await p.screenshot({ path: path.join(OUT, '1_BEFORE_THE_CLIMB.png') });
    const w1 = /CLIMBING ENDS (HIS|YOUR) ATTACKS THIS TURN/.test(pre.pick) && /Climbing ends (his|your) attacks this turn/.test(pre.say);
    console.log((w1 ? '  ok   ' : '  FAIL ') + 'the walk up warns before the climb  [' + JSON.stringify(pre) + ']'); if (!w1) bad++;
    await p.evaluate(s => { const u = FIGHT.current(); UI.pend = null; walkKept(u, s.found.x, s.found.y); take(); }, set);
    await p.waitForFunction(() => !FIGHT_UI.anim.length, null, { timeout: 15000 }).catch(() => {});
    const after = await p.evaluate(s => {
      const u = FIGHT.byId(s.me), foe = FIGHT.byId(s.foe);
      /* the man of theirs on the tile beside the roof, inside his reach */
      const T = FIGHT._t, q = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].map(o => ({ x: u.x + o[0], y: u.y + o[1] })).filter(o => T.passable(o.x, o.y) && !FIGHT._t.unitAt(o.x, o.y))[0];
      foe.x = q.x; foe.y = q.y; hud();
      return { at: [u.x, u.y], marked: FIGHT.climbedNow(u), square: document.getElementById('bstrike').innerText, title: document.getElementById('bstrike').title, why: document.getElementById('bstrike').dataset.why || '' };
    }, set);
    await p.waitForTimeout(400);
    const tapped = await p.evaluate(s => { const foe = FIGHT.byId(s.foe); foe._at = undefined; const X = sx((dx(foe) + .5) * UI.tw), Y = sy((dy(foe) + .5) * UI.th), t = tileAt(X, Y); tapAt(X, Y); return { tile: t, foe: [foe.x, foe.y], say: document.getElementById('say').innerText }; }, set);
    console.log('  (tap ' + JSON.stringify(tapped) + ')');
    await p.waitForTimeout(300);
    const said = tapped.say;
    await p.screenshot({ path: path.join(OUT, '2_UP_THERE_NO_ATTACK.png') });
    const w2 = after.marked && /CLIMBED/.test(after.square) && after.title === 'CLIMBED THIS TURN' && /climbed this turn: no blow and no shot/.test(said);
    console.log((w2 ? '  ok   ' : '  FAIL ') + 'up there the strike square says CLIMBED (CLIMBED THIS TURN)  [' + JSON.stringify(after) + ' say: ' + JSON.stringify(said) + ']'); if (!w2) bad++;
    const w3 = d.errs.length === 0; console.log((w3 ? '  ok   ' : '  FAIL ') + 'the page threw nothing  [' + d.errs.slice(0, 2).join(' | ') + ']'); if (!w3) bad++;
  } finally { await d.close(); }
  process.exit(bad ? 1 : 0);
})().catch(e => { console.log('  FAIL ' + (e && e.message)); process.exit(1); });
