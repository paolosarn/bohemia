#!/usr/bin/env node
/* THE DECOY (COMBAT 7, rule 367, ask line 391; Paolo 11/3, his name and his line: 'Did you seriously just walk around with a cardboard
   cutout?'... 'you can set it down, enemy can as well'). slices/BOHEMIA_FIGHT.html setDecoy, the skill 'decoy'; ours.decoy; perks.json.
   Legs:
   D1 THE PERK IS DATA: perks.json row decoy, his line its description, its AP and breath; ours.decoy (hit points, reach, once a fight,
      the enemy's archetypes) with source, his words and why
   D2 THEY GO FOR IT (headless): his man sets a cutout between himself and three of theirs: they strike it, it never takes a turn,
      never swings, holds no zone; knocked down it is cardboard (no death, no XP to the man who did it, never one of his men alive)
   D3 THE ENEMY HAS IT TOO (headless): a kid of theirs carries the perk and, on AUTO with ours on him, sets his own cutout
   D4 BY HIS FINGER (the upright phone 390 x 844, touch): the DECOY square, then a tile: the cutout stands there, the line says so; at the
      fight's end it is never listed among his men; nothing threw
   Run: node gates/the_decoy_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb', f), 'utf8'));
const O = J('ours.json').decoy, P = J('perks.json').rows.filter(r => r.id === 'decoy')[0];
leg(!!(P && /cardboard cutout/.test(P.effect) && P.numbers.skill_ap_cost > 0 && O && O.value && O.source && O.quote && O.why && O.value.hp > 0 && O.value.per_fight >= 1 && O.value.enemy_archetypes.length),
  '*** D1 THE PERK IS DATA ***: perks.json decoy ("' + (P && P.effect) + '"), ours.decoy', JSON.stringify(O && O.value));

/* D2 */
{
  const ctx = engine(), F = ctx.FIGHT; let ok = 0, n = 0; const why = [];
  for (let sd = 1; sd <= 6; sd++) {
    ctx.setSeed(sd); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, band: ['brigand_thug', 'brigand_thug', 'brigand_thug'] });
    const S = F.S, me = S.units.filter(u => u.side === 'you')[0], th = S.units.filter(u => u.side === 'them');
    S.units.forEach(u => { u.fled = u !== me && th.indexOf(u) < 0; });
    me.perks = (me.perks || []).concat(['decoy']); me.x = 8; me.y = 6; th.forEach((t, i) => { t.x = 11; t.y = 5 + i; });
    S.order = [me.id].concat(th.map(t => t.id)); S.idx = 0; me.ap = me.apTurn; me.fat = 0; me.begun = true;
    const set = F.useSkill(me, 'decoy', { x: 9, y: 6 }), c = S.units.filter(u => u.decoy)[0]; n++;
    if (!set || !c) { why.push('seed ' + sd + ' not set'); continue; }
    const xp0 = th.map(t => t.xpGained || 0);
    let g = 0; while (!S.over && g++ < 400 && S.round < 6 && !c.knocked) { const u = F.current(); if (!u) break; F.aiStep(u); }
    const hits = S.log.filter(e => e.t === 'attack' && e.to === c.id).length, acts = S.log.filter(e => e.id === c.id && /^(attack|step|turn|skill)$/.test(e.t)).length;
    const dead = S.log.some(e => e.t === 'dead' && e.id === c.id), xpUp = th.some((t, i) => (t.xpGained || 0) > xp0[i] && S.log.some(e => e.t === 'knocked' && e.by === t.id) && !S.log.some(e => e.t === 'attack' && e.id === t.id && e.to !== c.id));
    const counted = F.alive('you').some(u => u.decoy) || S.units.filter(u => u.side === 'you' && F.onField(u) && u.decoy).length && F.alive('you').indexOf(c) >= 0;
    if (hits > 0 && acts === 0 && !dead && !counted && !F.zocOn(th[0], c.x + 1, c.y).some(f => f.decoy)) ok++; else why.push('seed ' + sd + ': hits ' + hits + ', acts ' + acts + ', dead ' + dead + ', counted ' + counted);
    if (xpUp) why.push('seed ' + sd + ': xp for cardboard');
  }
  leg(ok === n && n >= 5, '*** D2 THEY GO FOR IT ***: his cutout between him and three of theirs is struck, takes no turn, never swings, holds no zone, goes over as cardboard, never counts as his man', ok + ' of ' + n + (why.length ? ': ' + why.slice(0, 3).join('; ') : ''));
}

/* D3 */
{
  const ctx = engine(), F = ctx.FIGHT; let set = 0, n = 0;
  for (let sd = 1; sd <= 8; sd++) {
    ctx.setSeed(sd); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, company: [{}, {}, {}], cap: 3, band: ['goblin_skirmisher'] });
    const S = F.S, k = S.units.filter(u => u.side === 'them')[0], mine = S.units.filter(u => u.side === 'you');
    if (!k || (k.perks || []).indexOf('decoy') < 0) continue;
    n++; k.x = 8; k.y = 6; mine.forEach((m, i) => { m.x = 10; m.y = 5 + i; });
    S.order = [k.id].concat(mine.map(m => m.id)); S.idx = 0; k.ap = k.apTurn; k.fat = 0; k.begun = true;
    let g = 0; while (F.current() === k && g++ < 12) F.aiStep(k);
    if (S.log.some(e => e.t === 'decoy' && e.by === k.id)) set++;
  }
  leg(n > 0 && set > 0, '*** D3 THE ENEMY HAS IT TOO ***: a kid of theirs carries the perk and sets his own cutout with ours on him', set + ' of ' + n + ' set one');
}

(async () => {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug', 'brigand_thug'] }) });
  const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
    for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : 'wait'; }); if (st === 'mine') break; if (st === 'wait') await p.touchscreen.tap(200, 420); await p.waitForTimeout(150); }
    await p.evaluate(() => { const u = FIGHT.current(); u.perks = (u.perks || []).concat(['decoy']); u.ap = u.apTurn; u.fat = 0; FIGHT_UI.pend = null; hud(); });
    await p.waitForTimeout(300);
    const sq = await p.evaluate(() => { const b = document.querySelector('#skills button[data-skill="decoy"]'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, lit: !b.disabled }; });
    if (sq) await p.touchscreen.tap(sq.x, sq.y);
    await p.waitForTimeout(300);
    const tile = await p.evaluate(() => { const u = FIGHT.current(); const qs = FIGHT.skillTargets(u, 'decoy').map(q => ({ x: sx((q.x + .5) * FIGHT_UI.tw), y: sy((q.y + .5) * FIGHT_UI.th), q }));
      const on = qs.filter(t => t.x > OPEN.l + 10 && t.x < OPEN.r - 10 && t.y > OPEN.t + 10 && t.y < OPEN.b - 10 && document.elementFromPoint(t.x, t.y) === document.getElementById('cv')); return on[0] || null; });   /* a tile on the open glass, his finger can reach it */
    if (tile) await p.touchscreen.tap(tile.x, tile.y);
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => { const c = FIGHT.S.units.filter(u => u.decoy)[0]; return { set: !!c, at: c ? [c.x, c.y] : null, say: document.getElementById('say').innerText, heard: (FIGHT_UI.heard || []).slice(-6) }; });
    leg(!!sq && sq.lit && sq.w >= 40 && r.set && tile && r.at[0] === tile.q.x && r.at[1] === tile.q.y,
      '*** D4 BY HIS FINGER *** [upright 390 x 844, touch]: the DECOY square, a tile, the cutout stands there', JSON.stringify({ square: sq, cutout: r.at, line: r.say.replace(/\s+/g, ' ').slice(0, 90) }));
    if (process.env.DECOY_SHOT) await p.screenshot({ path: process.env.DECOY_SHOT, scale: 'css' });
    /* the fight's end: never one of his men */
    await p.evaluate(() => { FIGHT_UI.auto = true; });
    await p.waitForFunction(() => FIGHT.S.over && document.getElementById('over').style.display === 'flex', null, { timeout: 150000 }).catch(() => {});
    const end = await p.evaluate(() => ({ over: FIGHT.S.over, rows: document.getElementById('over').innerText.indexOf('CUTOUT') >= 0, home: (homeMessage(FIGHT.S.result).crew || []).some(c => /CUTOUT/.test(c.name || '')) }));
    leg(end.over && !end.rows && !end.home, '  at the end the cutout is never among his men (the end card, the message home)', JSON.stringify(end));
  } catch (e) { leg(false, 'the page legs ran', String(e.message).slice(0, 200)); }
  leg(errs.length === 0, '  nothing threw', errs.slice(0, 2).join(' | ') || 'none');
  await d.close();
  console.log('\n=== THE DECOY: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
