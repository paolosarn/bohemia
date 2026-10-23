#!/usr/bin/env node
/* THE MACHINE GUN SWEEPS (COMBAT [weapon shapes], rules 33i and 46d; Paolo 9/24: 'in Battle Brothers you have some weapons
   that can hit multiple tiles at the same times, six or three... maybe a machine gun is comparable to a great sword in Battle
   Brothers, or a battle axe'; records/BOHEMIA_PAOLO_NEWGROUNDS_AND_THE_MACHINE_GUN_9_24_26.md). Every Battle Brothers skill
   that hits more than one tile has its shape on our square board (records/target/bb/weapon_shapes.json); the two-handed sword
   that swings is our MACHINE GUN (ours.machine_gun); everyone in a shape is rolled for alone, his own side too; the shape is
   lit on the tiles before the swing.

   Legs, headless on the live fight's rules (tools/bohemia_fight_headless.js):
   1. EVERY SHAPE MATCHES ITS ROW IN THE DATA: each row draws exactly its count on the board (a line its tiles, an arc its
      tiles, the ring all eight round him, the cone its rows' sum), names its wiki page and words, and is carried by a weapon
      or a beast; and no skill whose wiki words hit more than one tile is left without a row;
   2. THE MACHINE GUN: every two-handed sword that carries Swing is one, in anyone's hands (a gun: fires two to four tiles,
      clubs at one, five rounds then the crossbow's Reload); a sword without Swing is not;
   3. EVERYONE IN THE SHAPE IS STRUCK ALONE, HIS OWN SIDE TOO: a sweep across two of theirs and one of his is three rolls, the
      friend's marked; the AP and the round are spent once;
   4. THE BRAIN SWEEPS WHEN IT PAYS AND AIMS ROUND A FRIEND: two of theirs side by side, it sweeps; a friend at one end, it
      sweeps from the other end; one of theirs between two friends, it does not sweep;
   5. THE SHOTGUN'S CONE: the handgonne's one shot takes the man aimed at and the man behind him;
   6. A COMPANY OF THREE CARRIES ONE: A NEW CREW opens its first fight with a pistol, a rifle and a machine gun;
   and on his phone's profile (390 x 844 at 3x), the real page, real taps:
   7. THE SQUARE: the machine gunner's skill row carries a SWEEP square with the shape drawn on it; a tap arms it;
   8. LIT BEFORE THE SWING: a tap on a man lights every tile of the sweep on the ground (each brighter than before), the big
      button says SWEEP with the man count, and the receipt names his own man in it;
   9. THE SECOND TAP FIRES IT: three rolls in the log, one of them on his own man.
   Run: node gates/the_machine_gun_sweeps_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const ctx = engine(), F = ctx.FIGHT, T = F._t, DB = ctx.DB;
const SH = J('records/target/bb/weapon_shapes.json');

/* 1. every row draws its count, names its page, is carried */
ctx.setSeed(3); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, band: ['brigand_thug'] });
const A = { x: 10, y: 7 }, want = { line: r => r.tiles, arc: r => r.tiles, ring: () => 8, cone: r => r.rows.reduce((a, b) => a + b, 0) };
const arms = DB.weapons.rows.concat(DB.beastAttacks.rows), carried = n => arms.filter(w => (w.skills || []).some(s => s.name === n)).map(w => w.id);
const wrong = [], bare = [], dead = [];
Object.keys(SH.rows).forEach(n => { const r = SH.rows[n], t = { x: A.x + (r.shape === 'cone' ? 2 : 1), y: A.y };
  const got = F.shapeTiles(A, { name: n }, t).length; if (!want[r.shape] || got !== want[r.shape](r)) wrong.push(n + ' ' + r.shape + ' drew ' + got);
  if (!r.bb || !r.page || !/^reference\/library\//.test(r.source || '') || !r.say) bare.push(n);
  if (!carried(n).length) dead.push(n); });
const MULTI = /\bhits? (up to )?\d+ targets|in a straight line|tiles? behind the target|tiles in a row|next to each other|\d+ tiles in straight line/i;
const left = [];
arms.forEach(w => (w.skills || []).forEach(s => { if (MULTI.test(s.effect || '') && !SH.rows[s.name] && left.indexOf(s.name) < 0) left.push(s.name); }));
leg(!wrong.length && !bare.length && !dead.length && !left.length && Object.keys(SH.rows).length >= 8,
  '*** EVERY SHAPE MATCHES ITS ROW IN THE DATA ***: each draws its count on the board, names its wiki page, is carried by a weapon or a beast; no skill that hits more than one tile is left out',
  Object.keys(SH.rows).length + ' rows' + (wrong.length ? '; wrong: ' + wrong.join(', ') : '') + (bare.length ? '; unsourced: ' + bare.join(', ') : '') + (dead.length ? '; carried by nobody: ' + dead.join(', ') : '') + (left.length ? '; left out: ' + left.join(', ') : ''));

/* 2. the machine gun */
const swords = DB.weapons.rows.filter(w => w.class === 'sword'), swinging = swords.filter(w => w.skills.some(s => s.name === 'Swing'));
const made = swords.filter(w => !!T.machineGun(w));
const one = id => { ctx.setSeed(4); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, company: [{ background: 'sellsword', gear: { main: id } }], band: ['brigand_thug'] });
  return { u: F.S.units.filter(v => v.side === 'you')[0], t: F.S.units.filter(v => v.side === 'them')[0] }; };
const m = one('rhomphaia'), fires = [], clubs = [];
for (let d = 1; d <= 6; d++) { m.u.x = 3; m.u.y = 7; m.t.x = 3 + d; m.t.y = 7; m.u.ap = m.u.apTurn; F.S.order = [m.u.id]; F.S.idx = 0;
  if (F.canStrike(m.u, m.t)) (T.armIn(m.u, m.t) === m.u.club ? clubs : fires).push(d); }
leg(made.length === swinging.length && made.every(w => swinging.indexOf(w) >= 0) && swinging.length >= 4 && m.u.weapon.mg && F.isGun(m.u.weapon) && F.isRanged(m.u.weapon)
  && fires.join() === '2,3,4' && clubs.join() === '1' && m.u.weapon.mag === 5 && F.reloadSkill(m.u.weapon) && F.reloadSkill(m.u.weapon).ap === 4,
  '*** THE MACHINE GUN IS THE TWO-HANDED SWORD THAT SWINGS (Paolo 9/24) ***: a gun from two tiles to four, a club at one, five rounds then a 4 AP reload; a sword without Swing is no machine gun',
  made.map(w => w.id).join(',') + ' of ' + swords.length + ' swords; fires ' + fires + ', clubs ' + clubs + ', ' + m.u.weapon.mag + ' rounds, reload ' + (F.reloadSkill(m.u.weapon) || {}).ap + ' AP');

/* 3. struck alone, his own side too */
const sweepAt = (them, ours) => { ctx.setSeed(6); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true,
    company: [{ background: 'sellsword', gear: { main: 'rhomphaia' } }, { background: 'militia' }, { background: 'militia' }, { background: 'militia' }], band: ['brigand_thug', 'brigand_thug', 'brigand_thug'] });
  const S = F.S, u = S.units.filter(v => v.side === 'you')[0], mine = S.units.filter(v => v.side === 'you' && v !== u), foes = S.units.filter(v => v.side === 'them');
  mine.forEach((v, i) => { v.x = 0; v.y = i; }); foes.forEach((v, i) => { v.x = 19; v.y = i; });
  u.x = 6; u.y = 7; u.ap = u.apTurn; u.fat = 0; them.forEach((q, i) => { foes[i].x = q[0]; foes[i].y = q[1]; }); ours.forEach((q, i) => { mine[i].x = q[0]; mine[i].y = q[1]; });
  S.order = [u.id]; S.idx = 0; S.events = []; S.log = [];
  return { S, u, mine, foes }; };
let k = sweepAt([[9, 7], [9, 6]], [[9, 8]]);
const ap0 = k.u.ap, rd0 = k.u.ammo;
const got = F.strike(k.u, k.foes[0], null, 'Swing'), ev = k.S.log.filter(e => e.t === 'attack' && e.id === k.u.id);
leg(!!got && ev.length === 3 && ev.map(e => e.sweep).join() === '0,1,2' && ev.filter(e => e.ff).length === 1 && ev.filter(e => e.ff)[0].to === k.mine[0].id
  && ap0 - k.u.ap === F.skillNamed(k.u.weapon, 'Swing').ap && rd0 - k.u.ammo === 1,
  '*** EVERYONE IN THE SHAPE IS STRUCK ALONE, HIS OWN SIDE TOO ***: a sweep across two of theirs and one of his is three rolls, the friend\'s marked; the AP and the round spent once',
  ev.length + ' rolls (' + ev.map(e => (e.ff ? 'FRIEND ' : '') + e.to + (e.hit ? ' hit' : ' miss')).join(', ') + '), ' + (ap0 - k.u.ap) + ' AP, ' + (rd0 - k.u.ammo) + ' round');

/* 4. the brain */
k = sweepAt([[9, 7], [9, 6]], []); const b1 = T.bestAttack(k.u);
k = sweepAt([[9, 7], [9, 6]], [[9, 8]]); const b2 = T.bestAttack(k.u), b2men = b2 && b2.skill ? F.shapeMen(k.u, F.skillNamed(k.u.weapon, b2.skill), b2.t) : [];
k = sweepAt([[9, 7]], [[9, 8], [9, 6]]); const b3 = T.bestAttack(k.u);
leg(b1 && b1.skill === 'Swing' && b2 && b2.skill === 'Swing' && b2men.every(v => v.side === 'them') && b2men.length === 2 && b3 && b3.skill === null,
  '*** THE BRAIN SWEEPS WHEN IT PAYS AND AIMS ROUND A FRIEND ***: two of theirs, it sweeps; a friend at one end, it sweeps from the other end; one of theirs between two friends, it does not',
  'two: ' + (b1 && b1.skill) + '; friend at the end: ' + (b2 && b2.skill) + ' on ' + b2men.map(v => v.side).join('+') + '; between friends: ' + (b3 && b3.skill));

/* 5. the shotgun's cone */
ctx.setSeed(7); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, company: [{ background: 'sellsword', gear: { main: 'handgonne' } }], band: ['brigand_thug', 'brigand_thug'] });
const g = F.S.units.filter(v => v.side === 'you')[0], gt = F.S.units.filter(v => v.side === 'them');
g.x = 6; g.y = 7; gt[0].x = 8; gt[0].y = 7; gt[1].x = 9; gt[1].y = 8; g.ap = g.apTurn; g.fat = 0; F.S.order = [g.id]; F.S.idx = 0; F.S.log = [];
F.strike(g, gt[0]); const gev = F.S.log.filter(e => e.t === 'attack' && e.id === g.id);
leg(gev.length === 2 && gev[1].to === gt[1].id && F.shapeTiles(g, F.strikeSkill(g.weapon), gt[0]).length === 7,
  '*** THE SHOTGUN\'S CONE (the handgonne: \'can hit 5 tiles behind the target\') ***: one shot takes the man aimed at and the man behind him, seven tiles on our board',
  gev.length + ' rolls, ' + F.shapeTiles(g, F.strikeSkill(g.weapon), gt[0]).length + ' tiles');

/* 6. a company of three carries one */
ctx.setSeed(8); F.setup({ formation: null, deploy: false, company: [{ background: 'companion_2hand' }, { background: 'companion_1hand' }, { background: 'companion_ranged' }], band: ['brigand_thug'] });
const three = F.S.units.filter(v => v.side === 'you'), kinds = three.map(v => v.weapon.mg ? 'machine gun' : v.weapon.of ? 'pistol' : v.weapon.class === 'crossbow' ? 'rifle' : v.weapon.class);
leg(kinds.filter(x => x === 'machine gun').length === 1 && kinds.indexOf('pistol') >= 0 && kinds.indexOf('rifle') >= 0 && !three.filter(v => v.weapon.mg)[0].main,
  '*** A COMPANY OF THREE CARRIES ONE ***: A NEW CREW opens its first fight with a pistol, a rifle and a machine gun', kinds.join(', '));

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const base = { seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug', 'brigand_thug', 'brigand_thug'] };
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(base) });
  const p = d.page;
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
    for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : u.side === 'you' ? 'busy' : 'theirs'; });
      if (st === 'mine') break; if (st === 'theirs') await p.touchscreen.tap(200, 420); await p.waitForTimeout(150); }
    /* the machine gunner on (8, 6), two thugs and one of his own on the arc three tiles east, his turn, the camera on them */
    const who = await p.evaluate(() => { const S = FIGHT.S, u = S.units.filter(v => v.side === 'you' && v.weapon.mg)[0], f = S.units.filter(v => v.side === 'you' && v !== u)[0], th = S.units.filter(v => v.side === 'them');
      S.units.forEach(v => { if (v.side === 'you' && v !== u && v !== f) { v.x = 1; v.y = (S.units.indexOf(v) % S.h); } });
      u.x = 8; u.y = 6; th[0].x = 11; th[0].y = 6; th[1].x = 11; th[1].y = 5; th[2].x = 18; th[2].y = 13; f.x = 11; f.y = 7;
      th.forEach(t => { t.hp = t.hpMax = 5000; }); f.hp = f.hpMax = 5000;
      S.order = [u.id, th[0].id]; S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true;
      FIGHT_UI.anim = []; FIGHT_UI.glide = null; FIGHT_UI.pend = null; FIGHT_UI.shape = null; FIGHT_UI.cx = 10 * FIGHT_UI.tw; FIGHT_UI.cy = 6.3 * FIGHT_UI.th;
      return { u: u.id, f: f.id, fname: f.name }; });
    await p.waitForTimeout(500);
    const sq = await p.evaluate(() => { const b = document.querySelector('#skills button[data-shape="Swing"]'); if (!b) return null; const r = b.getBoundingClientRect();
      const c = b.querySelector('canvas'), g2 = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let lit = 0; for (let i = 0; i < g2.length; i += 4) if (g2[i + 3] > 200) lit++;
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, title: b.title, lit, disabled: b.disabled }; });
    if (sq) { await p.touchscreen.tap(sq.x, sq.y); await p.waitForTimeout(250); }
    const armed = await p.evaluate(() => FIGHT_UI.shape);
    leg(!!sq && sq.lit > 0 && !sq.disabled && sq.w >= 44 && armed === 'Swing', '*** THE SQUARE: THE MACHINE GUNNER\'S ROW CARRIES SWEEP, THE SHAPE DRAWN ON IT; A TAP ARMS IT ***',
      sq ? sq.title + ', ' + sq.lit + ' painted pixels, ' + Math.round(sq.w) + ' pt, armed ' + armed : 'no square');
    /* the ground in the middle of an EMPTY tile of the sweep and of a tile outside it, before and after the pick (his own man is
       kept off the arc for this, so its third tile is bare ground) */
    const ground = () => p.evaluate(() => { const g2 = document.getElementById('cv').getContext('2d'), out = [];
      [[11, 7], [11, 9]].forEach(q => { const X = sx((q[0] + .45) * FIGHT_UI.tw) * DPR, Y = sy((q[1] + .45) * FIGHT_UI.th) * DPR, dd = g2.getImageData(Math.round(X), Math.round(Y), 8, 8).data;
        let s = 0; for (let i = 0; i < dd.length; i += 4) s += dd[i] + dd[i + 1] + dd[i + 2]; out.push(s / (dd.length / 4) / 3); });
      return out; });
    const tap = async (x, y) => { const s = await p.evaluate(q => ({ x: sx((q.x + .5) * FIGHT_UI.tw), y: sy((q.y + .5) * FIGHT_UI.th) }), { x, y }); await p.touchscreen.tap(s.x, s.y); await p.waitForTimeout(300); };
    await p.evaluate(q => { const f = FIGHT.byId(q.f); f.x = 1; f.y = 1; }, who); await p.waitForTimeout(200);
    const before = await ground();
    await tap(11, 6);
    const after = await ground(), lit = await p.evaluate(() => { const u = FIGHT.current(), pd = FIGHT_UI.pend; return pd && pd.target ? FIGHT.shapeTiles(u, FIGHT.skillNamed(u.weapon, pd.skill), pd.target).map(q => q.x + ',' + q.y).join(' ') : ''; });
    /* now his own man on the arc's free end, the pick made again: the receipt and the button */
    await p.evaluate(q => { const f = FIGHT.byId(q.f); f.x = 11; f.y = 7; FIGHT_UI.pend = null; }, who); await p.waitForTimeout(200);
    await tap(11, 6);
    const st = await p.evaluate(() => ({ pend: FIGHT_UI.pend && FIGHT_UI.pend.skill, label: document.getElementById('bend').innerText.replace(/\s+/g, ' ').trim(), say: document.getElementById('say').innerText }));
    const up = after[0] - before[0], off = after[1] - before[1];
    leg(st.pend === 'Swing' && lit === '11,6 11,5 11,7' && up > 24 && Math.abs(off) < 6 && /^SWEEP/.test(st.label) && /x3/.test(st.label) && st.say.indexOf(who.fname) >= 0 && /too/.test(st.say),
      '*** LIT BEFORE THE SWING ***: the sweep\'s three tiles picked, its bare tile brighter on the ground and a tile outside it not; the big button says SWEEP x3; the receipt names his own man in it',
      'tiles ' + lit + '; lift ' + Math.round(up) + ', outside ' + Math.round(off) + '; "' + st.label + '"; "' + st.say.replace(/\s+/g, ' ') + '"');
    await p.touchscreen.tap(sq.x, sq.y); await p.waitForTimeout(400);
    const fired = await p.evaluate(q => FIGHT.S.log.filter(e => e.t === 'attack' && e.id === q.u).map(e => ({ s: e.sweep, ff: e.ff, to: e.to, skill: e.skill })), who);
    leg(fired.length === 3 && fired.filter(e => e.ff && e.to === who.f).length === 1 && fired.every(e => e.skill === 'Swing'),
      '*** THE SECOND TAP FIRES IT ***: three rolls in the log, one on his own man', fired.map(e => (e.ff ? 'FRIEND ' : '') + e.to).join(', '));
    await p.waitForTimeout(1600);
    leg(d.errs.length === 0, '  the page threw nothing', d.errs[0] || '');
  } catch (e) { leg(false, 'the phone legs ran', e.message); }
  await d.close();
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
function done() { console.log('=== THE MACHINE GUN SWEEPS GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); }
