#!/usr/bin/env node
/* AUTO KNOWS ITS MAN (COMBAT 8, rule 394 and its two 11/4 amendments, ask lines 429, 431, 432; Paolo 11/4: 'how good is auto at
   switching weapons, let's say a guy's really good melee and range... I've seen it keep wanting my Lone Wolf melee guy to pull out
   his pistol... can I buy someone and have them switch around from melee to range?'; 'if I give a guy a really good gun and a really
   good melee weapon, will he start pulling out the melee weapon if he's surrounded'; 'does this also work with shields? In Battle
   Brothers without perks equipping the shield and a one-handed weapon takes a whole turn'). The brain is slices/BOHEMIA_FIGHT.html
   planTurn, its __AUTO_KNOWS_ITS_MAN__ blocks: a man with something to change to weighs his WHOLE next turn with what each choice
   leaves in his hands (the blows his AP buys, the men walking at him for his club, the swap back's AP, a two-hander's sweep, the shield
   he could put on), closing in is scored, and the shield in his bag goes on when it pays.

   MEASURED 11/5 BEFORE (the same legs on main 7889d375): E1 the club-strong man drew his pistol on the thugs walking at him; H1 the
   rifleman with three beside him shot and reloaded for three turns, never the man splitter; I1 and J1 no shield was ever put on.

   Legs, headless on the live fight's rules (tools/bohemia_fight_headless.js):
   E1 (394 b) A CLUB-STRONG MAN (melee 85, ranged 25), a club in hand and a pistol in his bag, two club men of theirs walking at him
      four tiles off: he never draws the pistol; he closes in or holds for their arrival.
   E2 (394 c) A MAN GOOD AT BOTH (melee 60, ranged 80), the same: he draws the pistol and shoots while they come.
   E3 (394 b) THE ONE WHO WILL NOT COME: the club-strong man against a shooter of theirs who stands off (a man who does not walk to
      him): he draws and shoots (B3's lesson stays).
   H1 (394 h) A GUN IN HAND, A TWO-HANDER IN THE BAG, THREE BESIDE HIM: within two turns he has the two-hander in his hands.
   I1 (394 i) A ONE-HANDER, A SHIELD IN THE BAG, THREE CLUBS ON HIM in heavy armour (his blows bite little): the shield goes on
      within two turns; I2 the same with nothing near him: never; I3 a kill on offer that turn: no shield that turn.
   J1 (394 j) A TWO-HANDER IN HAND, A ONE-HANDER AND A SHIELD IN THE BAG, FOUR CLUBS ON HIM: one-hander and shield within two turns;
      J2 with nothing near him he never does.
   K1 A MAN WITH NOTHING TO CHANGE TO is weighed as before (the same pick and the same score on a seeded turn before and after).
   Run: node gates/auto_knows_its_man_gate.js */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb', f), 'utf8'));
const WP = J('weapons.json'), AR = J('armor.json');
const row = id => WP.rows.filter(r => r.id === id)[0];

const ctx = engine(), F = ctx.FIGHT, T = F._t;
ctx.setSeed(5); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, band: ['brigand_thug', 'brigand_thug', 'brigand_thug', 'brigand_thug', 'brigand_marksman'] });
const S = F.S, mine = S.units.filter(u => u.side === 'you'), theirs = S.units.filter(u => u.side === 'them');
const shields = ctx.DB.armor.shields, shieldRow = id => shields.filter(r => r.id === id)[0];
const field = keep => { S.units.forEach(u => { u.fled = keep.indexOf(u) < 0; u.dead = false; u.down = false; u.netted = null; u.tauntedBy = null; u.morale = 'Steady'; }); S.over = false; S.focus = null; };
const arm = (u, id) => { const w = Object.assign({}, row(id)); u.weapon = T.pistolShot(w) || w; const am = w.ammo ? String(w.ammo).match(/\d+/) : null; u.ammo = w.mag || (am ? Number(am[0]) : null); u.ammoMax = u.ammo; u.loaded = true; };
const bagOf = ids => ids.map(id => { const s = shieldRow(id); if (s) return s; const w = Object.assign({}, row(id)); return T.pistolShot(w) || w; });
const turn = u => { S.order = [u.id].concat(S.units.filter(v => v !== u && !v.fled).map(v => v.id)); S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true; u.morale = 'Steady'; u.turnLog = S.log.length; u.turnFrom = { x: u.x, y: u.y }; u.lastTurn = null; u.upRound = null; u.disarmed = false; u.stunned = false; u.swappedFree = false; };
const put = (u, x, y) => { u.x = x; u.y = y; };
const did = (u, L0) => S.log.slice(L0).filter(e => e.id === u.id && !e.free);
const play = u => { const L0 = S.log.length; let g = 0; while (F.current() === u && !S.over && g++ < 16) F.aiStep(u); return did(u, L0); };
const said = ev => ev.map(e => e.t + (e.to ? ' ' + e.to : '') + (e.skill ? ' ' + e.skill : '')).join(', ');
const man = (u, ms, rs) => { u.mskill = ms; u.rskill = rs; u.perks = []; u.shield = null; u.shieldBack = null; u.bagState = []; u.hp = u.hpMax; u.fat = 0; u.injuries = []; };
const BASE = {}; theirs.forEach(t => { BASE[t.id] = { mskill: t.mskill, mdef: t.mdef, rskill: t.rskill, rdef: t.rdef }; });
const foe = (t, id, hp, armour) => { Object.assign(t, BASE[t.id]); arm(t, id); t.hp = t.hpMax = hp; t.armB = armour || 0; t.armH = armour || 0; t.morale = 'Steady'; };
const gunNow = u => !!(u.weapon && F.isRanged(u.weapon));

/* E1, E2, E3: the club in hand, the pistol in the bag */
const clubAndPistol = (ms, rs, them, place) => {
  const m = mine[0]; field([m].concat(them)); man(m, ms, rs); arm(m, 'bludgeon'); m.bag = bagOf(['dagger']);
  put(m, 6, 6); place(them); turn(m); return m;
};
{
  const t = theirs.slice(0, 2); t.forEach(x => foe(x, 'bludgeon', 70));
  const m = clubAndPistol(85, 25, t, q => { put(q[0], 10, 6); put(q[1], 10, 7); });
  const ev = play(m), drew = ev.some(e => e.t === 'swap') || gunNow(m);
  leg(!drew, '*** E1 A CLUB-STRONG MAN KEEPS HIS CLUB *** (melee 85, ranged 25; two club men of theirs walking at him from four tiles): he never draws the pistol, he closes in or holds',
    (said(ev) || 'held') + '; weighed ' + JSON.stringify(m.btLast || []) + '; says ' + (m.btSay || ''));
}
{
  const t = theirs.slice(0, 2); t.forEach(x => foe(x, 'bludgeon', 70));
  const m = clubAndPistol(60, 80, t, q => { put(q[0], 10, 6); put(q[1], 10, 7); });
  const ev = play(m), shot = ev.some(e => e.t === 'attack' && e.shot);
  leg(ev.some(e => e.t === 'swap') && shot, '*** E2 A MAN GOOD AT BOTH SHOOTS WHILE THEY COME *** (melee 60, ranged 80): he draws the pistol and shoots',
    (said(ev) || 'held') + '; weighed ' + JSON.stringify(m.btLast || []));
}
{
  const t = [theirs[4]]; foe(t[0], 'short_bow', 60);
  const m = clubAndPistol(85, 25, t, q => { put(q[0], 10, 6); });
  t[0].weapon.range = t[0].weapon.range;   /* a shooter of theirs: he does not walk to him */
  const ev = play(m), shot = ev.some(e => e.t === 'attack' && e.shot);
  leg(ev.some(e => e.t === 'swap') && shot, '  E3 THE ONE WHO WILL NOT COME: the club-strong man against a shooter who stands off draws and shoots',
    (said(ev) || 'held') + '; weighed ' + JSON.stringify(m.btLast || []));
}
/* H1: a gun in hand, the man splitter in the bag, three beside him */
{
  const m = mine[1], t = theirs.slice(0, 3); field([m].concat(t)); man(m, 70, 70); arm(m, 'light_crossbow'); m.bag = bagOf(['man_splitter']);
  put(m, 10, 6); put(t[0], 11, 6); put(t[1], 11, 5); put(t[2], 10, 5); t.forEach(x => foe(x, 'bludgeon', 90, 40));
  let got = null; const log = [];
  for (let k = 1; k <= 2 && got === null; k++) { turn(m); const ev = play(m); log.push('turn ' + k + ': ' + (said(ev) || 'held') + ' {' + (m.btSay || '') + '}'); if (m.weapon && m.weapon.id === 'man_splitter') got = k; S.over = false; }
  leg(got !== null, '*** H1 SURROUNDED, THE TWO-HANDER COMES OUT *** (a crossbow in hand, the man splitter in the bag, three of theirs beside him): in his hands within two turns',
    (got ? 'turn ' + got : 'never') + '; ' + log.join(' | '));
}
/* H2: the coordinator's own case (rule 394 amended, measured 11/4: 'a lever rifle in hand, three thugs beside him, 9 AP, no perks...
   with a TWO-handed one (the man splitter) he keeps the rifle... over the next turns he shoots and RELOADS') */
{
  const m = mine[1], t = theirs.slice(0, 3); field([m].concat(t)); man(m, 60, 60); arm(m, 'lever_rifle'); m.bag = bagOf(['man_splitter']);
  put(m, 10, 6); put(t[0], 11, 6); put(t[1], 11, 5); put(t[2], 10, 5); t.forEach(x => foe(x, 'bludgeon', 90, 40));
  let got = null, reloadFirst = 0; const log = [];
  for (let k = 1; k <= 2 && got === null; k++) { turn(m); const ev = play(m); if (ev[0] && ev[0].t === 'reload') reloadFirst++; log.push('turn ' + k + ': ' + (said(ev) || 'held') + ' {' + (m.btSay || '') + '}'); if (m.weapon && m.weapon.id === 'man_splitter') got = k; S.over = false; }
  leg(got !== null && reloadFirst === 0, '*** H2 THE LEVER RIFLE AND THE MAN SPLITTER *** (the coordinator\'s case: three thugs beside him): the two-hander within two turns, a reload never his first choice among them',
    (got ? 'turn ' + got : 'never') + ', reload first ' + reloadFirst + '; ' + log.join(' | '));
}
/* I1, I2, I3: a one-hander and a shield in the bag */
const oneAndShield = (near, hp) => {
  const m = mine[2], t = theirs.slice(0, 3); field([m].concat(t)); man(m, 60, 30); arm(m, 'bludgeon'); m.bag = bagOf(['wooden_shield']);
  put(m, 10, 6); if (near) { put(t[0], 11, 6); put(t[1], 11, 5); put(t[2], 10, 5); } else { put(t[0], 2, 1); put(t[1], 3, 1); put(t[2], 4, 1); }
  t.forEach(x => foe(x, 'bludgeon', hp || 120, 260)); return m;
};
{
  const m = oneAndShield(true); let on = null; const log = [];
  for (let k = 1; k <= 2 && on === null; k++) { turn(m); const ev = play(m); log.push('turn ' + k + ': ' + (said(ev) || 'held') + ' {' + (m.btSay || '') + '}'); if (m.shield) on = k; S.over = false; }
  leg(on !== null, '*** I1 THREE CLUBS ON HIM, THE SHIELD GOES ON *** (a club in hand, a car door in his bag, three armoured clubs beside him)', (on ? 'turn ' + on : 'never') + '; ' + log.join(' | '));
  const m2 = oneAndShield(false); turn(m2); const e2 = play(m2), on2 = e2.some(e => e.t === 'swap') || !!m2.shield;
  leg(!on2, '  I2 nothing near him (their clubs eight tiles off): that turn the shield stays in the bag', (on2 ? 'put on' : 'stayed in the bag') + '; ' + (said(e2) || 'held'));
  const m3 = oneAndShield(true, 120); const v = theirs[0]; v.hp = 2; v.armB = 0; v.armH = 0; turn(m3); const ev3 = play(m3);
  const first = ev3[0];
  leg(!!first && first.t !== 'swap', '  I3 a kill on offer this turn: the blow, not the shield', said(ev3));
}
/* J1, J2: a two-hander in hand, a one-hander and a shield in the bag */
const twoOneShield = near => {
  /* where it pays (rule 394(i): 'when the hurt the shield saves him over the next turns beats what he loses dealing'): a poor fighter
     (melee 30) under four strong clubs (melee 95, war hammers, defence 40), whose sweep seldom lands and whose every round there costs */
  const m = mine[3], t = theirs.slice(0, 4); field([m].concat(t)); man(m, 30, 30); arm(m, 'two_handed_mallet'); m.bag = bagOf(['bludgeon', 'wooden_shield']);
  m.hp = m.hpMax = 400;
  put(m, 10, 6); if (near) { put(t[0], 11, 6); put(t[1], 11, 5); put(t[2], 10, 5); put(t[3], 9, 6); } else { put(t[0], 1, 1); put(t[1], 2, 1); put(t[2], 3, 1); put(t[3], 4, 1); }
  t.forEach(x => { foe(x, 'warhammer', 160, 60); x.mskill = 95; x.mdef = 40; }); return m;
};
{
  const m = twoOneShield(true); let done = null; const log = [];
  for (let k = 1; k <= 2 && done === null; k++) { turn(m); const ev = play(m); log.push('turn ' + k + ': ' + (said(ev) || 'held') + ' {' + (m.btSay || '') + '} ' + JSON.stringify(m.btLast || [])); if (m.shield && m.weapon && m.weapon.id === 'bludgeon') done = k; S.over = false; }
  leg(done !== null, '*** J1 FOUR CLUBS ON HIM: THE ONE-HANDER AND THE SHIELD *** (a sledge in hand, a club and a car door in the bag, four armoured clubs beside him): within two turns',
    (done ? 'turn ' + done : 'never') + '; ' + log.join(' | '));
  const m2 = twoOneShield(false); turn(m2); const ej = play(m2), ch = !!m2.shield || m2.weapon.id !== 'two_handed_mallet';
  leg(!ch, '  J2 nothing near him (their clubs eight tiles off): that turn he keeps the sledge', (ch ? 'changed' : 'kept') + '; ' + (said(ej) || 'held'));
}
/* K1: a man with nothing to change to, a seeded turn: the brain's pick and its score as the AUTO PLAYS THE BEST TURN gate's B2 holds */
{
  const m = mine[4], t = theirs.slice(0, 3); field([m].concat(t)); man(m, 60, 30); arm(m, 'two_handed_mallet'); m.bag = [];
  put(m, 10, 6); put(t[0], 11, 6); put(t[1], 11, 5); put(t[2], 10, 5); t.forEach(x => foe(x, 'bludgeon', 60)); turn(m);
  const ev = play(m), a = ev.filter(e => e.t === 'attack')[0];
  leg(!!a && a.skill === 'Shatter' && (m.btLast || []).every(s => !/^(close|shield)/.test(s)), '  K1 a man with nothing to change to: no closing-in or shield in what he weighs, his sweep as before', (a ? a.skill || 'a blow' : 'nothing') + '; ' + JSON.stringify(m.btLast || []));
}
console.log('=== AUTO KNOWS ITS MAN GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
