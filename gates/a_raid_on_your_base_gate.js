/* A RAID ON YOUR BASE — the gate for [a raid on your base] (10/9/26, LIFE + CITY; the ledger is FACTIONS')
 * On THE ALPHA, reached by the pinch, with the game's own SLEEP and clock:
 *   A  ONE LEDGER: your outfit's base is yours from the first day (FACTIONS' ledger, one 'deal' taking); the
 *      build lots and the raids read it; the save carries it.
 *   B  WHAT YOU BUILD DRAWS A CREW: two things standing at your base, and the next morning a crew leaves the
 *      nearest seat that is not your friend, walking at your gate, and the phone says so (rule 68).
 *   C  AWAY: it reaches the gate, the raid opens with its days, and on the due morning the world settles it
 *      (FACTIONS' settle): the stronger crew takes the base; what you built stands and pays them.
 *   D  THERE: standing at your base when the crew reaches it starts the fight at the gate through the one door,
 *      with what you built on the board; a win holds the base; a loss is a reload (Paolo 7/26: death is a reload,
 *      not a reset), so it writes nothing and the raid is still at the gate in the save he goes back to.
 *   E  ONE CREW AN ACT: a held base draws no second crew the same act.
 * Run:  node gates/a_raid_on_your_base_gate.js
 */
'use strict';
const path = require('path');
const D = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (d ? '  [' + d + ']' : '')); };
const SETUP = `(async function(goHome){
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  window.__night=async()=>{ document.getElementById('sleepbtn').click(); await sleep(300); const go=document.querySelector('#daycardIn .dcgo'); if(go) go.click(); else DAY.wake(); await sleep(300); };
  const bs=ctBases(), mine=Object.keys(bs).find(n=>lotIsMine(n)), seat=turfSeats().find(s=>s.faction===mine);
  window.__mine=mine; window.__seat=seat;
  const P=purseGet(); BohemiaPurse.credit(P,'electricity',3,'gate','gate',DAY.day);
  BohemiaLotBuild.start(lotBookFor(mine),P,{x:0,y:0},'wall',DAY.day,lotHoldFor(mine));
  BohemiaLotBuild.start(lotBookFor(mine),P,{x:1,y:0},'tank',DAY.day,lotHoldFor(mine));
  await __night(); if(goHome){ city.x=seat.x; city.y=seat.y; }
  return { mine:mine, crew:(partiesAll()||[]).filter(p=>p.raid).map(p=>p.from.faction), said:(window.__RAID_SAID||[]).slice(),
           held:BohemiaHomeBases.heldBy(hbRec(),mine,hbRec().act), snap:!!(citySnapshot().homebases) };
})`;
(async () => {
  /* ---- A, B, C: away ---- */
  let d = await D.open({ alpha: true });
  try {
    await d.toMap();
    const a = await d.fr.evaluate('(' + SETUP + ')(false)');
    ok('A your outfit\'s base is yours in FACTIONS\' ledger', a.held === 'you', a.mine + ' held by ' + a.held);
    ok('A the save carries the ledger', a.snap);
    ok('B *** two things standing draw a crew, and the phone says it is coming ***', a.crew.length === 1 && a.said.some(t => /walking at/.test(t)), a.crew.join() + ' | ' + a.said.slice(-1));
    const c = await d.fr.evaluate(async () => {
      const open = () => BohemiaHomeBases.raidsOpen(hbRec()).filter(x => x.base === window.__mine)[0];
      for (let k = 0; k < 60 && !open(); k++) { advance(60); if (DAY.phase !== 'awake') await __night(); }
      const r = open(); const opened = r ? { due: r.due - r.day, by: r.by } : null;
      for (let k = 0; k < 8 && open(); k++) await __night();
      const last = (hbRec().raids || []).filter(x => x.base === window.__mine).pop();
      const site = lotBookFor(window.__mine);
      return { opened: opened, state: last && last.state, how: last && last.end && last.end.how, mine: lotIsMine(window.__mine),
               standing: Object.values(site.lots).filter(l => l.done).length, said: (window.__RAID_SAID || []).slice(-1)[0] };
    });
    ok('C the crew reaches the gate and the raid opens with its days', !!c.opened && c.opened.due > 0, JSON.stringify(c.opened));
    ok('C *** away on the due morning: the stronger crew takes the base ***', c.state === 'taken' && c.how === 'unattended' && !c.mine, c.state + ', ' + c.how);
    ok('C what you built still stands (it pays them now)', c.standing === 2, c.said);
    ok('C nothing threw', d.errs.length === 0, d.errs.join(' | ').slice(0, 200));
  } finally { await d.close(); }
  /* ---- D, E: there ---- */
  for (const win of [true, false]) {
    d = await D.open({ alpha: true });
    try {
      await d.toMap();
      await d.fr.evaluate('(' + SETUP + ')(true)');
      const f = await d.fr.evaluate(async () => {
        for (let k = 0; k < 60 && !RAID_FIGHTING; k++) { advance(60); if (DAY.phase !== 'awake') { await __night(); city.x = __seat.x; city.y = __seat.y; } }
        return RAID_FIGHTING;
      });
      let sh = {};
      for (let k = 0; k < 60; k++) { await d.page.waitForTimeout(500);
        sh = await d.pageEval(() => { try { const l = NF.frame.contentDocument.getElementById('load');
          return { open: !!NF.frame, built: (NF.opts && NF.opts.built) || [], ready: !!(l && l.style.display === 'none'), load: l ? l.textContent : '' }; } catch (e) { return { open: false, built: [] }; } });
        if (sh.ready || /DID NOT LOAD/.test(sh.load || '')) break; }
      ok('D *** there when they arrive: the fight opens at the gate *** (' + (win ? 'win' : 'loss') + ' run)', f && sh.open, 'fighting at ' + f);
      ok('D with what you built on the board (' + (win ? 'win' : 'loss') + ' run)', sh.built.map(b => b.id).join() === 'wall,tank', sh.built.map(b => b.id).join());
      ok('D *** and the fight actually builds its ground *** (' + (win ? 'win' : 'loss') + ' run)', sh.ready, sh.ready ? 'ready' : sh.load);
      const e = await d.fr.evaluate((win) => new Promise(r => {
        window.postMessage({ type: 'BOHEMIA_CITY_COMBAT_END', outcome: win ? { victory: true, result: 'win', alive: 0 } : { victory: false, result: 'loss', alive: 3 }, at: null }, '*');
        setTimeout(async () => { const last = (hbRec().raids || []).slice(-1)[0];
          const out = { state: last && last.state, mine: lotIsMine(window.__mine), fighting: RAID_FIGHTING, raids: JSON.stringify(hbRec().raids), said: (window.__RAID_SAID||[]).slice(-2) };
          if (win) { for (let k = 0; k < 3; k++) await __night(); out.again = (partiesAll() || []).filter(p => p.raid && !p.arrived).length; }
          r(out); }, 600); }), win);
      if (win) {
        ok('D a win holds the base', e.state === 'held' && e.mine, e.state);
        ok('E a held base draws no second crew the same act', e.again === 0, e.again + ' walking');
      } else ok('D a loss is a reload: the raid is still open at the gate and the base still yours', e.state === 'open' && e.mine && !(e.said || []).some(t => / took /.test(t)), e.state);
      ok('D nothing threw (' + (win ? 'win' : 'loss') + ')', d.errs.length === 0, d.errs.join(' | ').slice(0, 200));
    } finally { await d.close(); }
  }
  console.log('\nA RAID ON YOUR BASE GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
