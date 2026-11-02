#!/usr/bin/env node
/* COMBAT 5 [the cell vest] 11/2 -- THE PHONE LOOK (rule 305): the real fight page at his phone's size (390 x 844), a hire of his in
   a yard vest (8 cells) with two men of theirs and one of his touching him: the SPARK square, the first tap (the nine tiles ringed
   crimson, the hurt over every man touching him, his odds to die, the line), the squeeze, the white frame and the fire after.
   Pictures to records/combat_the_cell_vest_11_2/. Exits 1 when a piece is missing.
     node tools/bohemia_combat_the_cell_vest_phone_11_2_26.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..'), OUT = path.join(ROOT, 'records/combat_the_cell_vest_11_2');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const COMPANY = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'CHISPA', gear: { main: 'hatchet', body: 'padded_surcoat', head: 'hood', acc: 'cell_vest_yard' } }, { background: 'companion_2hand', name: 'OSO' }, { background: 'companion_ranged', name: 'TINA' }];
(async () => {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 4, kind: 'works', company: COMPANY, cap: 4, band: ['brigand_thug', 'brigand_thug', 'brigand_thug'], teach: false }) });
  const p = d.page; let bad = 0;
  const ok = (g, m, x) => { if (!g) bad++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
    if (await p.evaluate(() => !!FIGHT.S.deploy)) await p.evaluate(() => document.getElementById('bend').click());
    await p.waitForFunction(() => { const u = FIGHT.current(); return !FIGHT.S.deploy && u && u.side === 'you' && crewControlled(u) && !FIGHT_UI.anim.length; }, null, { timeout: 60000 });
    const set = await p.evaluate(() => {
      const S = FIGHT.S, T = FIGHT._t, m = S.units.filter(v => v.vest)[0]; if (!m) return { err: 'no man in a vest' };
      /* a tile with open ground round it, the camera's own: where the current man stands */
      const u = FIGHT.current(); let c = null;
      const open = (x, y) => T.passable(x, y) && FIGHT.level(x, y) === 0 && !T.unitAt(x, y);
      for (let r = 0; r < 12 && !c; r++) for (let y = u.y - r; y <= u.y + r && !c; y++) for (let x = u.x - r; x <= u.x + r && !c; x++) {
        let good = true; for (let dy = -1; dy <= 1 && good; dy++) for (let dx = -1; dx <= 1 && good; dx++) good = T.passable(x + dx, y + dy) && FIGHT.level(x + dx, y + dy) === 0;
        if (good) c = { x, y };
      }
      if (!c) return { err: 'no open ground' };
      const foes = S.units.filter(v => v.side === 'them' && FIGHT.onField(v)), mate = S.units.filter(v => v.side === 'you' && v !== m && !v.main)[0];
      S.units.forEach(v => { if (v !== m) { v.x = -50; v.y = -50; } });
      m.x = c.x; m.y = c.y; foes[0].x = c.x + 1; foes[0].y = c.y; foes[1].x = c.x; foes[1].y = c.y - 1; foes[2].x = c.x + 3; foes[2].y = c.y; mate.x = c.x - 1; mate.y = c.y + 1;
      const main = S.units.filter(v => v.main)[0]; main.x = c.x - 3; main.y = c.y + 2;
      S.units.forEach(v => { v._at = undefined; });
      S.order = [m.id].concat(S.order.filter(id => id !== m.id)); S.idx = 0; m.ap = m.apTurn; m.fat = 0; m.begun = true;
      FIGHT_UI.cx = (c.x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (c.y + .5) * FIGHT_UI.th;
      hud();
      return { me: m.id, name: m.name, c, square: !!document.querySelector('#skills button[data-skill="spark"]') };
    });
    if (set.err) { ok(false, set.err); process.exit(1); }
    await p.waitForTimeout(500);
    ok(set.square, 'the SPARK square is on his skill row (a vest of cells, a crimson edge)');
    await p.evaluate(() => document.querySelector('#skills button[data-skill="spark"]').click());
    await p.waitForTimeout(600);
    const lit = await p.evaluate(() => ({ say: document.getElementById('say').innerText, tags: Array.from(document.querySelectorAll('#hurts .hurt')).map(e => e.textContent), on: document.querySelector('#skills button[data-skill="spark"]').className }));
    await p.screenshot({ path: path.join(OUT, '1_THE_RISK_LIT.png') });
    ok(/vest: 8 cells/.test(lit.say) && /% he dies/.test(lit.say) && lit.tags.some(t => /DIES/.test(t)) && lit.tags.filter(t => /^-\d+/.test(t)).length === 3 && /on/.test(lit.on),
      'the first tap lights the risk: the line, the hurt over the 3 men touching him, his odds to die, the square breathing', JSON.stringify(lit));
    /* the squeeze on the beat: wait for the beat's edge, then tap */
    await p.evaluate(() => new Promise(res => { (function w() { const ph = beatPh(performance.now()); if (ph < .03 || ph > .985) return res(); requestAnimationFrame(w); })(); }));
    await p.evaluate(() => document.querySelector('#skills button[data-skill="spark"]').click());
    await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(OUT, '2_THE_SQUEEZE.png') });
    await p.waitForFunction(() => !FIGHT_UI.anim.length, null, { timeout: 20000 }).catch(() => {});
    await p.waitForTimeout(300);
    const after = await p.evaluate(s => { const S = FIGHT.S, ev = S.log.filter(e => e.t === 'spark'); return { spark: ev.map(e => ({ how: e.how, cells: e.cells })), burns: S.log.filter(e => e.t === 'burn').length, fire: (S.fire || []).length, he: (FIGHT.byId(s.me).dead ? 'dead' : FIGHT.byId(s.me).down ? 'down' : 'standing'), heard: (FIGHT_UI.heard || []).indexOf('cell_vest') >= 0, say: document.getElementById('say').innerText }; }, set);
    await p.screenshot({ path: path.join(OUT, '3_THE_FIRE_AFTER.png') });
    ok(after.spark.length === 1 && after.burns === 3 && after.fire === 9 && after.he !== 'standing' && after.heard, 'the squeeze: the cells go, 3 men burn, 9 tiles on fire, he is down, the sound asked for', JSON.stringify(after));
    ok(d.errs.length === 0, 'the page threw nothing', d.errs.slice(0, 2).join(' | '));
  } finally { await d.close(); }
  process.exit(bad ? 1 : 0);
})().catch(e => { console.log('  FAIL ' + (e && e.message)); process.exit(1); });
