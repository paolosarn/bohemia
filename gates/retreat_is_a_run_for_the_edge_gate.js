#!/usr/bin/env node
/* RETREAT IS A RUN FOR THE EDGE (COMBAT 7, rule 365, Paolo 11/3, long reported: 'if you press the flee button it's like auto but
   running away, my turn, and you have to reach the edge of the map... I still don't see the retreat button working properly, it just
   auto ends the fight'). Battle Brothers' retreat: his men run for the edges on their turns, out when they reach it, a man caught is
   fought, the fight ends when all of his are out or down; broken enemies flee the same way. The lineup's half (one press, his men
   first, all out untouched = WITHDREW) is gates/retreat_from_the_lineup_gate.js.
   Legs, the real fight page, the REAL BUTTON pressed where it is on the glass (upright, the phone's own retreat; else the bar's):
   E1 MID-FIGHT, BY HAND, upright phone 390 x 844, touch: two presses (the ask, then the go) in round 2: the fight is NOT over at the
      press; his men run (steps of his toward the edges after the order), each out on the edge (escaped), theirs keep their turns;
      it ends only when every man of his is out or down, LOST (no pay) when any of his was hit or caught, never WON
   E2 ON AUTO, sideways 844 x 390, touch: the same, the run plays by itself
   E3 BROKEN ENEMIES RUN FOR THE EDGE (headless): a man of theirs who breaks walks toward the nearest edge on his turns and leaves
      from it (fled), never toward the fight
   Run: node gates/retreat_is_a_run_for_the_edge_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };

/* E3 headless */
{
  const ctx = engine(), F = ctx.FIGHT;
  let walked = 0, left = 0, toward = 0, n = 0;
  for (let sd = 1; sd <= 12; sd++) {
    ctx.setSeed(sd); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, band: ['brigand_thug', 'brigand_thug', 'brigand_thug'] });
    const S = F.S, t = S.units.filter(u => u.side === 'them')[0];
    t.morale = 'Fleeing'; t.roundsFleeing = 0; t.givesUp = true; n++;
    const edge = u => Math.min(u.x, u.y, S.w - 1 - u.x, S.h - 1 - u.y);
    let g = 0, e0 = edge(t);
    while (!S.over && g++ < 400 && F.onField(t) && S.round < 6) { const u = F.current(); if (!u) break; const b = edge(t); F.aiStep(u); if (u === t && F.onField(t)) { if (edge(t) < b) walked++; if (edge(t) > b) toward++; } }
    if (t.fled) left++;
  }
  leg(left >= n - 1 && toward === 0, '*** E3 BROKEN ENEMIES RUN FOR THE EDGE ***: a man of theirs who breaks walks to the nearest edge and leaves from it', left + ' of ' + n + ' left the board, ' + walked + ' steps nearer the edge, ' + toward + ' back toward the fight');
}

(async () => {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const run = async (profile, auto, tag) => {
    const d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 21, speed: 2, kind: 'suburb', deploy: false, formation: null, auto: auto, company: [{}, {}, {}, {}], cap: 4, band: ['brigand_thug', 'brigand_thug', 'brigand_thug', 'brigand_thug'] }) });
    const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    try {
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && !FIGHT.S.deploy, null, { timeout: 40000 });
      /* into round 2 (their men have closed), then the order, by his own finger */
      await p.waitForFunction(() => FIGHT.S.round >= 2 || FIGHT.S.over, null, { timeout: 60000 }).catch(() => {});
      if (!auto) await p.waitForFunction(() => { const u = FIGHT.current(); return FIGHT.S.over || (u && u.side === 'you' && !FIGHT_UI.anim.length); }, null, { timeout: 30000 }).catch(() => {});
      const at = await p.evaluate(() => {
        const vis = e => { if (!e) return null; const r = e.getBoundingClientRect(); if (r.width < 3 || r.bottom <= 0 || r.top >= innerHeight) return null; const x = r.x + r.width / 2, y = r.y + r.height / 2, t = document.elementFromPoint(x, y); return t && (t === e || e.contains(t)) ? { x, y } : null; };
        return vis(document.querySelector('.fc[data-c=flee]')) || vis(document.getElementById('bflee'));
      });
      if (!at) throw new Error('no retreat button on the glass');
      const L0 = await p.evaluate(() => FIGHT.S.log.length);
      await p.touchscreen.tap(at.x, at.y); await p.waitForTimeout(350); await p.touchscreen.tap(at.x, at.y); await p.waitForTimeout(300);
      const now = await p.evaluate(() => ({ over: FIGHT.S.over, retreat: !!FIGHT.S.retreat, round: FIGHT.S.round }));
      await p.waitForFunction(() => FIGHT.S.over, null, { timeout: 120000 }).catch(() => {});
      const r = await p.evaluate((l0) => {
        const S = FIGHT.S, mine = S.units.filter(v => v.side === 'you'), log = S.log.slice(l0);
        return { over: S.over, result: S.result, out: mine.filter(v => v.escaped).length, down: mine.filter(v => v.dead || v.down).length, n: mine.length,
          ran: log.filter(e => e.t === 'step' && mine.some(m => m.id === e.id)).length, theirs: log.filter(e => (e.t === 'step' || e.t === 'attack') && S.units.some(v => v.id === e.id && v.side === 'them')).length,
          left: mine.filter(v => !v.escaped && !v.dead && !v.down).length };
      }, L0);
      leg(now.retreat && !now.over && r.over && r.left === 0 && r.out + r.down === r.n && r.out > 0 && r.ran > 0 && r.result !== 'won',
        '*** ' + tag + ' *** the real button pressed in round ' + now.round + ': the fight goes on, his men run for the edge and get out one by one, it ends only when all are out or down, never won',
        JSON.stringify({ atPress: now, end: r }));
      leg(errs.length === 0, '  nothing threw ' + tag, errs.slice(0, 2).join(' | ') || 'none');
    } catch (e) { leg(false, tag + ' ran', String(e.message).slice(0, 200)); }
    await d.close();
  };
  await run('phone_portrait', false, 'E1 MID-FIGHT, BY HAND [upright 390 x 844, touch]');
  await run('phone_landscape', true, 'E2 ON AUTO [sideways 844 x 390, touch]');
  console.log('\n=== RETREAT IS A RUN FOR THE EDGE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
