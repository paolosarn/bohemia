#!/usr/bin/env node
/* THE TURN ENDS ITSELF (COMBAT [the turn ends itself], rule 125, Paolo 10/20: 'even Battle Brothers has the auto end system:
   if you only have one movement left and you can't even move a tile... that's why they have the stamina and the numbers...
   you gotta do that a lot better, right now'). When the man you control cannot afford any action (one tile, a strike, a
   reload, any skill), his turn ends by itself after a short beat that shows why; the numbers say why, Battle Brothers' way;
   never while anything is affordable; WAIT and END TURN stay.

   Legs, headless on the live fight's rules (tools/bohemia_fight_headless.js):
   1. NOTHING AFFORDABLE IS THE BUTTONS' OWN TESTS: at 0 AP a man can do nothing; one AP short of a step and nothing in
      reach, nothing; one step's AP, a tile; boxed in with a man in reach of his blow, the blow; an empty gun with the AP to
      reload, the reload; a one-AP skill (Adrenaline), the skill;
   2. THE WHY IS THE RULES' NUMBERS: the step it names is what the cheapest tile beside him costs (the rules' stepCost);
   and on his phone's profile (390 x 844 at 3x), the real page:
   3. OUT OF ACTION POINTS: a man who can afford nothing: the warning goes over his bars, the line says the AP left and what
      a step costs, and his turn passes by itself a beat and a half later (not before a beat, not after three);
   4. NEVER WHILE ANYTHING IS AFFORDABLE: with one step's AP he keeps his turn three beats and more, no warning;
   5. THE NUMBERS ON THE BAR: his AP and his fatigue as numbers beside the pips, the rules' own;
   6. END TURN STAYS: a man with AP left still ends his turn on the big button.
   Run: node gates/the_turn_ends_itself_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const ctx = engine(), F = ctx.FIGHT, T = F._t;

ctx.setSeed(5); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, band: ['brigand_thug'] });
const S = F.S, mine = S.units.filter(u => u.side === 'you'), t = S.units.filter(u => u.side === 'them')[0];
const plain = mine.filter(u => !u.perks.some(id => F.ACTIVE.indexOf(id) >= 0) && !u.weapon.of && u.job === 'pipe')[0];
const gunner = mine.filter(u => !!u.weapon.of)[0];
const put = (u, x, y, ap) => { mine.forEach(v => { if (v !== u) { v.x = 0; v.y = mine.indexOf(v); } }); u.x = x; u.y = y; u.ap = ap; u.fat = 0; S.order = [u.id]; S.idx = 0; };
t.x = 18; t.y = 12;
put(plain, 10, 6, 0); const at0 = F.canAct(plain);
const why = F.spentWhy(plain), cheapest = Math.min.apply(null, [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].map(d => T.passable(10 + d[0], 6 + d[1]) ? T.stepCost(plain, 10, 6, 10 + d[0], 6 + d[1]) : Infinity));
put(plain, 10, 6, cheapest - 1); const short = F.canAct(plain);
put(plain, 10, 6, cheapest); const oneStep = F.canAct(plain);
/* boxed in, the thug beside him, the AP for his blow: the board's corner and two rows of his own men (one friend can be
   walked through, two cannot), so no tile is left to him and only the blow is */
const others = mine.filter(v => v !== plain); others.forEach((v, i) => { v.x = 19; v.y = i; });
plain.x = 0; plain.y = 0; t.x = 1; t.y = 0; S.order = [plain.id]; S.idx = 0; plain.fat = 0;
[[0, 1], [1, 1], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2]].forEach((q, i) => { others[i].x = q[0]; others[i].y = q[1]; });
plain.ap = T.skillAP(plain.weapon, F.strikeSkill(plain.weapon), plain); const boxed = F.canAct(plain) && F.canStrike(plain, t), boxedMove = Object.keys(F.reach(plain, null, true).best).length;
t.x = 18; t.y = 12;
put(gunner, 10, 6, T.skillAP(gunner.weapon, F.reloadSkill(gunner.weapon), gunner)); gunner.ammo = 0;
const reloadAP = gunner.ap; gunner.ap = Math.min(gunner.ap, cheapest - 1 >= reloadAP ? reloadAP : reloadAP);
const withReload = F.canAct(gunner) && F.canReload(gunner);
gunner.ammo = gunner.weapon.mag; gunner.ap = 1; const adren = gunner.perks.indexOf('adrenaline') >= 0 ? F.canAct(gunner) && F.canUse(gunner, 'adrenaline') : null;
leg(!at0 && !short && oneStep && boxed && boxedMove === 1 && withReload && adren !== false,
  '*** NOTHING AFFORDABLE IS THE BUTTONS\' OWN TESTS ***: 0 AP nothing; one AP short of a step, nothing; a step\'s AP, a tile; boxed in with a man in reach, the blow; an empty gun, the reload; one AP and Adrenaline, the skill',
  '0 AP ' + at0 + ', ' + (cheapest - 1) + ' AP ' + short + ', ' + cheapest + ' AP ' + oneStep + ', boxed ' + boxed + ' (' + boxedMove + ' tile), reload ' + withReload + ', adrenaline ' + adren);
leg(why.step === cheapest && why.ap === 0 && why.apTurn === plain.apTurn, '*** THE WHY IS THE RULES\' NUMBERS ***: the step it names is the cheapest tile beside him', 'says ' + why.step + ', the rules ' + cheapest);

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const base = { seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug'] };
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(base) });
  const p = d.page;
  await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
  const mineNow = async () => { for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : u.side === 'you' ? 'busy' : 'theirs'; });
    if (st === 'mine') return; if (st === 'theirs') await p.touchscreen.tap(200, 420); await p.waitForTimeout(150); } };
  /* a pipe man with no skill of his own, the thug far off, the AP the leg asks */
  const set = async ap => { await mineNow();
    return p.evaluate(a => { const S = FIGHT.S, u = S.units.filter(v => v.side === 'you' && v.job === 'pipe' && !v.perks.some(id => FIGHT.ACTIVE.indexOf(id) >= 0))[0], t = S.units.filter(v => v.side === 'them')[0];
      S.units.forEach(v => { if (v.side === 'them' && v !== t) v.fled = true; });
      t.x = 18; t.y = 12; u.x = 10; u.y = 6; S.order = [u.id, t.id]; S.idx = 0; u.fat = 0; u.begun = true;
      const step = FIGHT.spentWhy(u).step; u.ap = a === 'short' ? step - 1 : a === 'step' ? step : a;
      FIGHT_UI.anim = []; FIGHT_UI.glide = null; FIGHT_UI.pend = null; FIGHT_UI.spentKey = null; FIGHT_UI.cx = (u.x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (u.y + .5) * FIGHT_UI.th;
      return { id: u.id, ap: u.ap, step, t0: performance.now(), beat: 60000 / R('ours.beat_bpm') / FIGHT_UI.speed }; }, ap); };
  const read = id => p.evaluate(i => { const o = document.getElementById('outap'), st = document.getElementById('stats').getBoundingClientRect(), r = o.getBoundingClientRect(), u = FIGHT.byId(i);
    return { now: performance.now(), cur: FIGHT.current() ? FIGHT.current().id : null, out: o.style.display !== 'none' ? o.innerText.replace(/\s+/g, ' ').trim() : '', over: r.width > 0 && r.left <= st.left && r.right >= st.right,
      say: document.getElementById('say').innerText, apn: document.getElementById('apn').textContent, ap: u.ap, apTurn: u.apTurn, fat: Math.round(u.fat), fm: FIGHT.fatMax(u) }; }, id);

  const a = await set('short');
  await p.waitForTimeout(250);
  const a1 = await read(a.id);
  let passedAt = null;
  for (let i = 0; i < 60 && passedAt === null; i++) { await p.waitForTimeout(50); const r = await read(a.id); if (r.cur !== a.id) passedAt = r.now; }
  const dt = passedAt === null ? null : passedAt - a.t0;
  leg(/OUT OF ACTION POINTS/.test(a1.out) && a1.over && new RegExp(a.ap + ' AP left, a step costs ' + a.step).test(a1.say),
    '*** OUT OF ACTION POINTS: OVER HIS BARS, AND THE LINE SAYS WHY IN THE RULES\' NUMBERS ***', '"' + a1.out + '" | "' + a1.say + '"');
  leg(dt !== null && dt >= a.beat && dt <= a.beat * 3, '*** AND HIS TURN PASSES BY ITSELF A BEAT AND A HALF LATER ***', dt === null ? 'it never passed' : Math.round(dt) + ' ms (a beat is ' + a.beat + ' ms)');

  await p.waitForTimeout(300);
  const b = await set('step');
  await p.waitForTimeout(b.beat * 3.2);
  const b1 = await read(b.id);
  leg(b1.cur === b.id && !b1.out, '*** NEVER WHILE ANYTHING IS AFFORDABLE ***: with one step\'s AP (' + b.ap + ') he keeps his turn three beats and more, no warning', b1.cur === b.id ? 'still his, ' + (b1.out ? 'WARNING SHOWN' : 'quiet') : 'IT PASSED');
  leg(b1.apn.indexOf(b1.ap + '/' + b1.apTurn + ' AP') === 0 && b1.apn.indexOf(b1.fat + '/' + b1.fm + ' FAT') > 0, '*** THE NUMBERS ON THE BAR: HIS AP AND HIS FATIGUE, BATTLE BROTHERS\' WAY ***', '"' + b1.apn + '"');
  const eb = await p.evaluate(() => { const r = document.getElementById('bend').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: document.getElementById('bend').innerText.replace(/\s+/g, ' ').trim() }; });
  await p.touchscreen.tap(eb.x, eb.y); await p.waitForTimeout(300);
  const c1 = await read(b.id);
  leg(/END TURN/.test(eb.label) && c1.cur !== b.id, '*** END TURN STAYS ***: with AP left, the big button still ends his turn', eb.label + ' -> ' + (c1.cur !== b.id ? 'passed' : 'STILL HIS'));
  leg(d.errs.length === 0, '  the page threw nothing', d.errs[0] || '');
  await d.close();
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
function done() { console.log('=== THE TURN ENDS ITSELF GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); }
