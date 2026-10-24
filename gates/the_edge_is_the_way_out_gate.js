#!/usr/bin/env node
/* THE EDGE IS THE WAY OUT (COMBAT [retreat], rule 144(c), Paolo 10/24: 'can you retreat in this game? Are you able to retreat?').
   Battle Brothers' way (records/target/bb/rules.json deployment.retreat_from_map_edge, Dev Blog 105): men on the edge retreat
   safely; the others move to the edge by themselves until they succeed or die. A retreat ends lost (no pay) and is never a wipe
   (143(e)); the crew reacts (143(c)).

   Legs, headless on the live fight's rules (tools/bohemia_fight_headless.js):
   1. THE ORDER: on his turn, every man of his already on the edge is out at once (fled, escaped), the rest are no longer his to
      steer;
   2. THE RUN FOR THE EDGE: played out by the rules alone, every man of his ends out (escaped) or down or dead, and none is still
      standing on the board; the fight ends lost;
   3. never twice, never before the line is set;
   and on his phone's profile (390 x 844), the real page:
   4. ONE TAP TO SEE, ONE TO DO: the first tap on RETREAT arms it and says what happens; the second orders it;
   5. THE END: the recap says YOU PULLED OUT with how many got out; home with BOHEMIA_FIGHT_OVER retreat:true, wipe:false;
   6. the crew calls the retreat.
   Run: node gates/the_edge_is_the_way_out_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== THE EDGE IS THE WAY OUT GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

const ctx = engine(), F = ctx.FIGHT;
let results = [], firstOut = [], stood = 0, twice = 0, early = 0;
for (let seed = 1; seed <= 6; seed++) {
  ctx.setSeed(seed); F.setup({ kind: 'suburb', formation: null, deploy: false, band: ['brigand_thug', 'brigand_thug', 'brigand_raider'] });
  const S = F.S;
  /* his turn */
  for (let g = 0; g < 400 && !S.over; g++) { const u = F.current(); if (u && u.side === 'you') break; F.aiStep(u); }
  const mine = S.units.filter(v => v.side === 'you');
  const u0 = F.current(); u0.x = 0;   /* one of his on the edge (the west edge, his own side's) */
  const ok = F.retreat();
  firstOut.push(ok && u0.fled && u0.escaped);
  if (F.retreat()) twice++;
  for (let g = 0; g < 5000 && !S.over; g++) { const u = F.current(); if (!u) break; F.aiStep(u); }
  stood += mine.filter(v => F.onField(v)).length;
  results.push(S.result + ':' + mine.filter(v => v.escaped).length + '/' + mine.filter(v => v.down || v.dead).length + '/' + mine.length);
}
ctx.setSeed(9); F.setup({ kind: 'suburb', formation: null, deploy: true, band: ['brigand_thug'] });
if (F.retreat()) early++;
leg(firstOut.every(Boolean), '*** THE ORDER: A MAN ON THE EDGE IS OUT AT ONCE ***', firstOut.join(','));
leg(stood === 0 && results.every(r => /^lost:/.test(r)) && results.every(r => +r.split(':')[1].split('/')[0] >= 1),
  '*** THE RUN FOR THE EDGE: EVERY MAN OF HIS ENDS OUT OR FALLEN, NONE LEFT STANDING; THE FIGHT ENDS LOST ***', results.join(' | ') + ' (out/fallen/men)');
leg(!twice && !early, '  never twice, never before the line is set', 'twice ' + twice + ', in the line set ' + early);

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ kind: 'suburb', deploy: false, teach: false, band: ['brigand_thug', 'brigand_raider'] }) });
  const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e)));
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil && CALL.bank, null, { timeout: 40000 });
    for (let i = 0; i < 120; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !!u && crewControlled(u) && !FIGHT_UI.anim.length; }); if (st) break; await p.touchscreen.tap(200, 420); await p.waitForTimeout(150); }
    const box = await p.evaluate(() => { const r = document.getElementById('bflee').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, vis: r.width > 0 && r.bottom <= innerHeight }; });
    await p.touchscreen.tap(box.x, box.y); await p.waitForTimeout(150);
    const a1 = await p.evaluate(() => ({ arm: document.getElementById('bflee').classList.contains('arm'), say: document.getElementById('say').textContent, r: !!FIGHT.S.retreat }));
    await p.touchscreen.tap(box.x, box.y); await p.waitForTimeout(150);
    const a2 = await p.evaluate(() => ({ r: !!FIGHT.S.retreat, ctl: crewControlled(FIGHT.current()), call: FIGHT_UI.callQ && FIGHT_UI.callQ.moment || (FIGHT_UI.call && FIGHT_UI.call.moment) }));
    leg(box.vis && a1.arm && /Retreat\?/.test(a1.say) && !a1.r && a2.r && !a2.ctl, '*** ONE TAP TO SEE, ONE TO DO: RETREAT ARMS AND SAYS WHAT HAPPENS, THE SECOND TAP ORDERS IT ***', JSON.stringify({ box, a1, a2: { r: a2.r, ctl: a2.ctl } }));
    let saw = a2.call === 'retreat';
    for (let i = 0; i < 400; i++) {
      const st = await p.evaluate(() => ({ o: document.getElementById('over').style.display, c: (FIGHT_UI.calls || []).some(c => c.moment === 'retreat') }));
      if (st.c) saw = true; if (st.o === 'flex') break; await p.waitForTimeout(200);
    }
    const e = await p.evaluate(() => ({ oh: document.getElementById('oh').textContent, ob: document.getElementById('ob').textContent, home: homeMessage(FIGHT.S.result), wipe: !!FIGHT_UI.wipe,
      out: FIGHT.S.units.filter(v => v.side === 'you' && v.escaped).length, men: FIGHT.S.units.filter(v => v.side === 'you').length, mainOut: FIGHT.S.units.filter(v => v.main)[0].escaped }));
    leg(e.oh === 'YOU PULLED OUT' && /got out/.test(e.ob) && e.home.retreat === true && e.home.wipe === false && e.home.result === 'lost' && !e.wipe,
      '*** THE END: YOU PULLED OUT, HOME WITH retreat:true AND NEVER A WIPE ***', e.oh + ' / ' + e.out + ' of ' + e.men + ' out (YOU ' + (e.mainOut ? 'out' : 'caught') + ') / ' + JSON.stringify({ retreat: e.home.retreat, wipe: e.home.wipe, result: e.home.result }));
    leg(saw, '  the crew calls the retreat', saw ? 'called' : 'silent');
    leg(!errs.length, '  the page threw nothing', errs.join(' | '));
  } finally { await d.close(); }
  done();
})().catch(e => { console.error(e); fail++; done(); });
