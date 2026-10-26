#!/usr/bin/env node
// TUNING [the stupid-move watch] 10/26 -- RESEARCH INSTRUMENT, NOT A GATE (rule 188(b), rule 201, rule 38g). STANDING: every round.
// Paolo 10/25: 'there's so much wrong with the auto combat code and tuning... I can't be explaining all these, you gotta know all
// this.' Rule 188(b): many AUTO fights on the live fight in every crew shape he uses, every move a good player would call wrong
// counted by kind, worst first, as rows on COMBAT's board; the counts only go down. Rule 201: a SPREAD round is a wrong move.
//
// This plays the LIVE fight (slices/BOHEMIA_FIGHT.html's own rules and data, PLAIN, through tools/bohemia_tuning_auto_brain.js's
// engine: no hooks, the game exactly as it plays) on AUTO for both sides and watches OUR side only (AUTO is his men; the enemy
// keeps Battle Brothers' brain on purpose, rule 201(e)). Before every one of our men's actions it reads what he could do (every
// foe he can strike and see, with the fight's own hitChance), after it reads what he did (the fight's own log), and counts:
//   IDLE        a turn ended with nothing done (no blow, shot, step, reload, swap) while he still had AP, split by why:
//                 a blow left   he could still strike (canStrike, seen): the plain stupid one (rule 176(a))
//                 winded        a foe in his reach but the swing's fatigue passes his most (EYES' Lone Wolf: 9 of 9 AP beside a hyena)
//                 a walk open   a melee man, nothing in reach, a step nearer the fight open (COMBAT's PARKED, rule 188(a))
//                 nothing       nothing in reach and no walk (boxed in, rooted in a net, a gun with no line)
//   STREAK      the same man IDLE with full AP three of his turns running (EYES saw twelve)
//   PARKED      COMBAT's own J1 (gates/every_man_has_a_job_each_turn_gate.js): a melee man with a walk to a foe open, AP for a step,
//               breath for a blow, not in a rout or a net, ends with no blow and not one step nearer (whatever else he did)
//   LONE        a walk that ends with three or more foes within two tiles and none of his own within two, when he did not start
//               so (Desi's two-hand spear: four tiles alone into three thugs); only when he has men of his own on the board
//   LOW SHOT    a shot taken at a chance ten points or more under the best shot he had from the same tile at that moment; split by
//               whether the man he shot was the team's man this round (struck already this round by ours, fell this round, or the
//               Mechanic), which rule 191(a) read with 201 allows, or not (the wrong one)
//   SPREAD      a round in which our landed blows hit two or more of them, none of them fell, and the hitpoints those blows took
//               would have dropped one of the men they hit (rule 201)
//   FREE HIT    a walk out of a ring that drew a free swing at him, in a turn in which he struck nobody (not fleeing, not the retreat)
//   DANCE       off and back over two rounds with no blow in either (rule 176(b))
//   KEY MAN     the Mechanic in his reach and seen, and he struck someone else or nobody (rule 182)
//   NEVER       a melee man who never struck, a gunman who never shot, in a fight of four rounds or more (on the board to round 4)
// and, for rule 201's gate, per round: the share of our blows on the round's most-struck man (the focus share; on the named
// target once the fight names one: S.named / S.target / S.focus, read if the fight carries it), and how many of them stand hurt
// at the round's end.
//
//   node tools/bohemia_tuning_stupid_move_watch.js [--n 80] [--jobs 4] [--shapes his,wolf,newcrew,spear,watch,bench]
//   --save                      write the round into the bank (banks/BOHEMIA_TUNING_STUPID_MOVE_WATCH_10_26_26.json), keyed by main's sha
//   --fight '<json>'            one fight (the workers)
// The resume cache lives in the scratchpad (TUNING_CACHE, default /tmp), never in the repo. Every number it prints is DRAFT.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const B = require('./bohemia_tuning_auto_brain.js');
const BANK = path.join(ROOT, 'banks/BOHEMIA_TUNING_STUPID_MOVE_WATCH_10_26_26.json');
const CACHE = process.env.TUNING_CACHE || '/tmp';

/* ---------- the door: the live roll engine/bohemia_origin_start.js hands the fight (the same men the crew screen shows) ---------- */
let DOOR = null;
async function door() {
  if (DOOR) return DOOR;
  const ctx = { console, Math, JSON, Date, Object, Array, String, Number, Promise, setTimeout: () => 0,
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    fetch: u => Promise.resolve({ json: () => Promise.resolve(JSON.parse(fs.readFileSync(path.join(ROOT, 'slices', u), 'utf8'))) }) };
  ctx.window = ctx; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_origin_start.js'), 'utf8'), ctx);
  await ctx.BohemiaOriginStart.load();
  DOOR = ctx.BohemiaOriginStart; return DOOR;
}

/* ---------- the crew shapes he uses (rule 188(b)) and what the road hands them ---------- */
const FACTIONS = ['brigands', 'beasts', 'kids', 'machines', 'heavies'];
const g = (main, off) => ({ main, off, body: null, head: null, bag: [] });
/* HIS CREW, his words 10/25: one long rifle and two spear-and-car-door men (COMBAT's gate builds the same three) */
const HIS = [{ background: 'companion_ranged', name: 'YOU', main: true, gear: g('light_crossbow', null) },
  { background: 'companion_1hand', name: 'RAUL', gear: g('militia_spear', 'wooden_shield') },
  { background: 'companion_1hand', name: 'JAMAL', gear: g('militia_spear', 'wooden_shield') }];
const SHAPES = {
  his: { why: 'his crew: a rifle and two spear-and-car-door men', faction: k => FACTIONS[k % 5], count: k => 2 + (k % 4), days: k => 1 + (k % 5) * 12 },
  wolf: { why: 'the Lone Wolf from the door (the hedge knight\'s rolled kit), dogs half the time', origin: 'wolf', faction: k => k % 2 ? 'beasts' : FACTIONS[(k >> 1) % 5], count: k => 2 + (k % 3), days: k => 1 + (k % 4) * 15 },
  newcrew: { why: 'A New Crew from the door, against the road', origin: 'newcrew', faction: k => k % 3 ? 'brigands' : FACTIONS[k % 5], count: k => 3 + (k % 3), days: k => 1 + (k % 4) * 10 },
  spear: { why: 'A New Crew with Desi\'s two-hand spear (reach 2) on the two-hander, against three to five thugs (EYES q22)', origin: 'newcrew', spear: 'spetum', faction: () => 'brigands', count: k => 3 + (k % 3), days: k => 1 + (k % 3) * 8 },
  watch: { why: 'the twelve (the Block Watch from the door), against six to ten', origin: 'watch', cap: 12, faction: k => FACTIONS[k % 5], count: k => 6 + (k % 5), days: k => 1 + (k % 5) * 12 },
  bench: { why: 'TUNING\'s spread (3, 6 and 12 men, three gear stages, the map\'s count x0.6 to x1.6)', bench: true },
  /* THE WINDED TRAP, side shapes (never in ALL SHAPES): the Lone Wolf against two to four dogs only, in the door's lightest and
     heaviest kit, so the kit's share of his wind is measured and not argued (--shapes wolfdogs,wolflight,wolfheavy) */
  wolfdogs: { why: 'the Lone Wolf as rolled, dogs only', side: true, origin: 'wolf', faction: () => 'beasts', count: k => 2 + (k % 3), days: k => 1 + (k % 4) * 15 },
  wolflight: { why: 'the Lone Wolf in the door\'s lightest kit (reinforced mail, the closed flat top), dogs only', side: true, origin: 'wolf', kit: { body: 'reinforced_mail_hauberk', head: 'closed_flat_top_with_mail' }, faction: () => 'beasts', count: k => 2 + (k % 3), days: k => 1 + (k % 4) * 15 },
  /* Battle Brothers' own answer, as a research splice (never the game): the Recover perk (tier 1, 9 AP, half his fatigue) in the
     place of Steel Brow, and AUTO allowed that one button when the swing's fatigue passes his most at a full turn (rule 180 bars it) */
  wolfrecover: { why: 'the Lone Wolf with Recover in place of Steel Brow, AUTO may press Recover only (research splice), dogs only', side: true, origin: 'wolf', perks: ['colossus', 'brawny', 'recover'], engine: 'recover', faction: () => 'beasts', count: k => 2 + (k % 3), days: k => 1 + (k % 4) * 15 },
  wolfheavy: { why: 'the Lone Wolf in the door\'s heaviest kit (coat of plates, full helm), dogs only', side: true, origin: 'wolf', kit: { body: 'coat_of_plates', head: 'full_helm' }, faction: () => 'beasts', count: k => 2 + (k % 3), days: k => 1 + (k % 4) * 15 }
};
async function setupShape(ctx, shape, k, districts) {
  const F = ctx.FIGHT, Sh = SHAPES[shape], W = B.fightOf(k, districts);
  if (Sh.bench) { const count = B.setupFight(ctx, W); F.S.deploy = false; return { k, seed: W.seed, company: W.company, enemies: count, faction: W.faction, stage: W.stage }; }
  let company = HIS, cap = 3;
  if (Sh.origin) {
    const D = await door(); company = D.roll(Sh.origin, 4242 + k * 977) || HIS; cap = Sh.cap || company.length;
    if (Sh.perks) company = company.map(m => Object.assign({}, m, { perks: Sh.perks.slice() }));
    if (Sh.kit) company = company.map(m => Object.assign({}, m, { gear: Object.assign({}, m.gear, Sh.kit) }));
    if (Sh.spear) company = company.map(m => m.background === 'companion_2hand' ? Object.assign({}, m, { gear: Object.assign({}, m.gear, { main: Sh.spear, off: null }) }) : m);
  }
  const faction = Sh.faction(k), count = Sh.count(k), days = Sh.days(k);
  ctx.setSeed(W.seed);
  F.setup({ auto: true, formation: null, company: company, cap: cap, party: { faction: faction, count: count, days: days }, days: days, district: W.district, cell: W.cell, act: 1 });
  F.S.deploy = false;
  return { k, seed: W.seed, company: cap, enemies: F.S.units.filter(u => u.side === 'them').length, faction, days };
}

/* ---------- one fight, watched ---------- */
function zero() {
  return { fights: 0, won: 0, clean: 0, rounds: 0, turns: 0, actions: 0,
    idle: 0, idleWhy: {}, streak: 0, parked: 0, parkedTurns: 0, lone: 0, loneWalks: 0, shots: 0, shotsChoice: 0, shotGap5: 0, lowShot: 0, lowShotTeam: 0, lowShotGap: 0,
    roundsWithHits: 0, spread: 0, focusAimed: 0, aimed: 0, namedAimed: 0, namedRounds: 0, hurtStanding: 0, roundsCounted: 0,
    freeHit: 0, freeSwingsOnUs: 0, dance: 0, keyChances: 0, keyIgnored: 0, meleeMen: 0, meleeNever: 0, gunMen: 0, gunNever: 0, ourDown: 0, ourDead: 0 };
}
function playWatched(ctx, meta) {
  const F = ctx.FIGHT, S = F.S, T = F._t, C = zero(), ex = [];
  const keep = (kind, o) => { if (ex.filter(e => e.kind === kind).length < 2) ex.push(Object.assign({ kind, fight: meta.k, seed: meta.seed }, o)); };
  const near = (u, side, r) => S.units.filter(v => v !== u && F.onField(v) && v.morale !== 'Fleeing' && (side === 'foe' ? v.side !== u.side : v.side === u.side) && Math.max(Math.abs(v.x - u.x), Math.abs(v.y - u.y)) <= r).length;
  const reachable = u => S.units.filter(t => t.side !== u.side && F.canStrike(u, t) && F.sideSees(u.side, t));
  const isHead = t => !!(F.racial && F.racial(t, 'raise_undead'));
  const named = () => S.named || S.target || S.focus || null;
  const per = {}, open = {};   /* per man: his turns; the turn he is in */
  let guard = 0, R0 = null;
  const openRound = () => { R0 = { round: S.round, hp: {}, aimed: {}, landed: {}, hpTaken: 0, fell: new Set(), low: [], named: named() };
    S.units.forEach(u => { if (u.side === 'them' && F.onField(u)) R0.hp[u.id] = u.hp; }); };
  const closeRound = () => {
    if (!R0) return;
    const aimedN = Object.values(R0.aimed).reduce((a, b) => a + b, 0), struck = Object.keys(R0.landed);
    if (aimedN) {
      C.roundsWithHits++; C.aimed += aimedN; C.focusAimed += Math.max.apply(null, Object.values(R0.aimed));
      if (R0.named) { C.namedRounds++; C.namedAimed += R0.aimed[R0.named.id || R0.named] || 0; }
    }
    const fell = [...R0.fell].some(id => R0.hp[id] !== undefined);
    if (struck.length >= 2 && !fell) {
      const least = Math.min.apply(null, struck.map(id => R0.hp[id] === undefined ? Infinity : R0.hp[id]));
      if (R0.hpTaken >= least) { C.spread++; keep('spread', { round: R0.round, struck: struck.length, hpTaken: R0.hpTaken, leastLeft: least }); }
    }
    R0.low.forEach(l => { if (l.team || R0.fell.has(l.to)) C.lowShotTeam++; else { C.lowShot++; C.lowShotGap += l.gap; keep('low shot', l); } });
    C.roundsCounted++;
    C.hurtStanding += S.units.filter(u => u.side === 'them' && F.onField(u) && u.morale !== 'Fleeing' && u.hp < u.hpMax).length;
    R0 = null;
  };
  /* his turn opens at his 'turn' event, with the AP and breath the round gave him */
  const openTurn = v => {
    const melee = !F.isRanged(v.weapon), h = melee ? T.huntField(v)(v.x, v.y) : null;
    open[v.id] = { u: v, x: v.x, y: v.y, ap: v.ap, h0: h, r: S.round, rout: v.morale === 'Fleeing', blows: 0, steps: 0, others: 0, freeOn: 0, stuck: false, waited: false,
      breath: v.fat + T.skillFat(v, F.strikeSkill(v.weapon)) <= F.fatMax(v), foes2: near(v, 'foe', 2), mates2: near(v, 'mate', 2),
      mates: S.units.filter(o => o !== v && o.side === v.side && F.onField(o)).length };
  };
  /* what he could do at the moment of a call: the brain's choice is judged against this */
  const snapOf = v => {
    const melee = !F.isRanged(v.weapon);
    return { ap: v.ap, apTurn: v.apTurn, fat: Math.round(v.fat), fatMax: F.fatMax(v), x: v.x, y: v.y, netted: !!v.netted,
      opts: reachable(v).map(t => ({ id: t.id, ch: F.hitChance(v, t).chance, head: isHead(t) })),
      inReach: S.units.filter(t => t.side !== v.side && F.onField(t) && F.sideSees(v.side, t) && F.canStrike(Object.assign({}, v, { ap: 99, fat: 0 }), t)).length,
      walk: melee && !v.netted && (h => h > 1 && isFinite(h))(T.huntField(v)(v.x, v.y)) && v.ap >= T.stepCost(v, v.x, v.y, v.x, v.y) };
  };
  /* 'nothing' split: a gunman with a tile in this turn's walk he could shoot from stood (rule 188(a): a shooter gets sight
     and reach); a melee man with no way to any foe (a roof no club reaches, a fenced lot); boxed in by bodies; the rest */
  const nothingWhy = (u, snap) => {
    if (F.isRanged(u.weapon)) {
      const f = F.reach(u), ox = u.x, oy = u.y; let shot = false;
      Object.keys(f.best).some(k => { k = Number(k); const x = k % S.w, y = Math.floor(k / S.w); if (x === ox && y === oy) return false;
        u.x = x; u.y = y; shot = S.units.some(t => t.side !== u.side && F.onField(t) && F.sideSees(u.side, t) && F.canStrike(Object.assign({}, u, { ap: 99, fat: 0 }), t)); u.x = ox; u.y = oy; return shot; });
      return shot ? 'a gunman stood, a shot one walk away' : 'a gunman, no shot from his walk';
    }
    const h = T.huntField(u)(u.x, u.y);
    if (!isFinite(h)) return 'no way to any foe';
    return Object.keys(F.reach(u).best).length <= 1 ? 'boxed in' : 'nothing';
  };
  const closeTurn = (u, snap) => {
    const t0 = open[u.id]; if (!t0) return; delete open[u.id];
    const rec = { r: t0.r, sx: t0.x, sy: t0.y, ex: u.x, ey: u.y, steps: t0.steps, blows: t0.blows };
    (per[u.id] = per[u.id] || []).push(rec);
    C.turns++;
    const on = F.onField(u) && u.morale !== 'Fleeing' && !S.retreat && !t0.rout;
    /* IDLE: judged at the call that ended it */
    if (on && snap && !t0.blows && !t0.steps && !t0.others && snap.ap > 0) {
      let why = snap.opts.length ? 'a blow left' : snap.inReach ? 'winded beside a foe' : snap.walk ? 'a walk open' : snap.netted ? 'in a net' : 'nothing';
      if (why === 'nothing') why = nothingWhy(u, snap);
      C.idle++; C.idleWhy[why] = (C.idleWhy[why] || 0) + 1; rec.idle = why; rec.fullAP = snap.ap >= snap.apTurn;
      if (why !== 'nothing' && why !== 'in a net') keep('idle: ' + why, { man: u.name || u.id, round: t0.r, ap: snap.ap + '/' + snap.apTurn, fat: snap.fat + '/' + snap.fatMax, weapon: u.weapon.id });
    }
    /* PARKED, COMBAT's J1 to the letter */
    if (!F.isRanged(u.weapon)) {
      C.parkedTurns++;
      const h1 = T.huntField(u)(u.x, u.y);
      if (!t0.blows && !t0.stuck && !u.netted && t0.h0 > 1 && isFinite(t0.h0) && h1 >= t0.h0 && t0.ap >= T.stepCost(u, u.x, u.y, u.x, u.y) && t0.breath && !t0.rout && u.morale !== 'Fleeing') {
        C.parked++; keep('parked', { man: u.name || u.id, round: t0.r, hunt: t0.h0 + '->' + h1, weapon: u.weapon.id });
      }
    }
    /* LONE INTO THREE */
    if (t0.steps && t0.mates > 0 && F.onField(u)) {
      C.loneWalks++;
      const f2 = near(u, 'foe', 2), m2 = near(u, 'mate', 2);
      if (f2 >= 3 && m2 === 0 && !(t0.foes2 >= 3 && t0.mates2 === 0)) { C.lone++; keep('lone into three', { man: u.name || u.id, round: t0.r, from: t0.x + ',' + t0.y, to: u.x + ',' + u.y, foes2: f2, weapon: u.weapon.id }); }
    }
    /* FREE HIT FOR NOTHING */
    C.freeSwingsOnUs += t0.freeOn;
    if (t0.freeOn && t0.steps && !t0.blows && on) { C.freeHit++; keep('free hit for nothing', { man: u.name || u.id, round: t0.r, swings: t0.freeOn, weapon: u.weapon.id }); }
  };
  openRound();
  S.units.forEach(u => { if (u.side === 'you' && u === F.current()) openTurn(u); });
  while (!S.over && S.round <= 60 && guard++ < 200000) {
    const v = F.current(); if (!v) break;
    const ours = v.side === 'you' && F.onField(v) && v.morale !== 'Fleeing';
    if (v.side === 'you' && !open[v.id]) openTurn(v);
    const snap = v.side === 'you' ? snapOf(v) : null;
    if (ours) C.actions++;
    const n0 = S.log.length;
    F.aiStep(v);
    const L = S.log.slice(n0);
    let blow = null;
    L.forEach(e => {
      if (e.t === 'round') { closeRound(); openRound(); return; }
      const a = e.id !== undefined ? F.byId(e.id) : null;
      if (e.t === 'turn' && a && a.side === 'you') { if (!open[a.id]) openTurn(a); return; }
      if ((e.t === 'down' || e.t === 'dead' || e.t === 'fled') && R0 && a && a.side === 'them') R0.fell.add(e.id);
      const t0 = a && open[a.id];
      if (t0) {
        if (e.t === 'attack' && !e.free) t0.blows++;
        else if (e.t === 'step' && !e.shoved) t0.steps++;
        else if (/^(reload|skill|swap)$/.test(e.t)) t0.others++;
        else if (e.t === 'stuck') t0.stuck = true;
      }
      if (e.t === 'attack' && e.free) { const tt = F.byId(e.to); if (tt && open[tt.id] && tt === v) open[tt.id].freeOn++; }
      if ((e.t === 'end' || e.t === 'fled') && a && a.side === 'you') closeTurn(a, a === v ? snap : null);
      if (e.t !== 'attack' || !a || a.side !== 'you' || !R0) return;
      if (!e.free) { R0.aimed[e.to] = (R0.aimed[e.to] || 0) + 1; if (a === v && !blow) blow = e; }
      if (e.hit) { R0.landed[e.to] = 1; R0.hpTaken += Math.max(0, e.hp || 0); }
    });
    if (ours && snap) {
      const head = snap.opts.filter(o => o.head);
      if (head.length) { C.keyChances++; if (!blow || !head.some(o => o.id === blow.to)) { C.keyIgnored++; keep('key man ignored', { man: v.name || v.id, round: S.round, did: blow ? 'struck another' : 'no blow' }); } }
      if (blow && blow.shot) {
        C.shots++;
        if (snap.opts.length >= 2) {
          C.shotsChoice++;
          const best = Math.max.apply(null, snap.opts.map(o => o.ch)), mine = (snap.opts.filter(o => o.id === blow.to)[0] || { ch: blow.chance }).ch;
          if (best - mine >= 5) C.shotGap5++;
          if (best - mine >= 10 && R0) R0.low.push({ man: v.name || v.id, round: S.round, to: blow.to, chance: mine, best: best, gap: best - mine,
            team: (R0.aimed[blow.to] || 0) > 1 || head.some(o => o.id === blow.to) || (R0.named && (R0.named.id || R0.named) === blow.to) });
        }
      }
    }
  }
  closeRound();
  /* the dance, the streak and the never */
  Object.keys(per).forEach(id => {
    const rs = per[id], u = F.byId(id);
    const byR = {}; rs.forEach(r => { const q = byR[r.r] = byR[r.r] || { r: r.r, sx: r.sx, sy: r.sy, steps: 0, blows: 0 }; q.ex = r.ex; q.ey = r.ey; q.steps += r.steps; q.blows += r.blows; });
    const turns = Object.values(byR).sort((a, b) => a.r - b.r);
    turns.forEach((r, i) => { const n = turns[i + 1];
      if (n && n.r === r.r + 1 && r.steps && (r.ex !== r.sx || r.ey !== r.sy) && n.steps && n.ex === r.sx && n.ey === r.sy && !r.blows && !n.blows) { C.dance++; keep('dance', { man: u.name || id, round: r.r }); } });
    let run = 0, best = 0; rs.forEach(r => { run = r.idle && r.idle !== 'nothing' && r.fullAP ? run + 1 : 0; best = Math.max(best, run); });
    if (best >= 3) { C.streak++; keep('streak', { man: u.name || id, turns: best, weapon: u.weapon.id, why: rs.filter(r => r.idle).map(r => r.idle)[0] }); }
    if (S.round >= 4 && turns.length >= 4) {
      const struck = S.log.some(e => e.t === 'attack' && e.id === id && !e.free);
      if (F.isRanged(u.weapon)) { C.gunMen++; if (!struck) C.gunNever++; }
      else { C.meleeMen++; if (!struck) { C.meleeNever++; keep('never struck', { man: u.name || id, weapon: u.weapon.id, rounds: S.round }); } }
    }
  });
  C.fights = 1; C.won = S.result === 'won' ? 1 : 0; C.rounds = S.round;
  const mine = S.units.filter(u => u.side === 'you');
  C.ourDown = mine.filter(u => u.down || u.dead).length; C.ourDead = mine.filter(u => u.dead).length;
  C.clean = C.won && !mine.some(u => u.down || u.dead) ? 1 : 0;
  return { C, ex, result: S.over ? S.result : 'stalled' };
}

/* a research engine: the live rules with one splice, each anchor matched exactly once or it stops (the fight moved) */
const ENGINES = {
  recover: [["    if (u.side === 'you') return false;   /* rule 180: AUTO moves, fires and strikes, nothing else; abilities are his */\n",
    "    if (u.side === 'you') { if (canUse(u, 'recover') && u.ap === u.apTurn && u.fat + skillFat(u, strikeSkill(u.weapon)) > fatMax(u)) return useSkill(u, 'recover'); return false; }\n"]]
};
async function engineWith(name) {
  if (!name) return B.engineFor('today');
  const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8'), grab = id => { const m = html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)<\\/script>')); if (!m) throw new Error('no script ' + id); return m[1]; };
  let rules = grab('fight-rules');
  ENGINES[name].forEach(([a, b]) => { const n = rules.split(a).length - 1; if (n !== 1) throw new Error('THE FIGHT MOVED: splice anchor found ' + n + ' times: ' + a.slice(0, 70)); rules = rules.replace(a, () => b); });
  const ctx = { console, Math, JSON, Date, Object, Array, String, Number, Error, Promise,
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    fetch: u => Promise.resolve({ json: () => Promise.resolve(JSON.parse(fs.readFileSync(path.join(ROOT, 'slices', u), 'utf8'))) }) };
  vm.createContext(ctx);
  vm.runInContext(grab('fight-data') + ';this.DB=DB;this.loadAll=loadAll;this.setSeed=function(s){SEED=s>>>0;};', ctx);
  await ctx.loadAll();
  vm.runInContext(rules + ';this.FIGHT=FIGHT;', ctx);
  return ctx;
}
async function oneFight(shape, k) {
  const ctx = await engineWith(SHAPES[shape].engine), districts = ctx.DB.boardKinds.districts;
  const meta = await setupShape(ctx, shape, k, districts);
  const P = playWatched(ctx, meta);
  return Object.assign(meta, { shape, result: P.result, C: P.C, ex: P.ex });
}

function sum(fs_) { const T = zero(); fs_.forEach(f => Object.keys(T).forEach(k => { if (typeof T[k] === 'number') T[k] += f.C[k]; else Object.keys(f.C[k]).forEach(q => { T[k][q] = (T[k][q] || 0) + f.C[k][q]; }); })); return T; }
/* the kinds, per 100 of the unit they are counted in, so a round with more fights reads the same */
function kinds(T) {
  const per = (a, b) => b ? +(100 * a / b).toFixed(2) : 0;
  return [
    ['IDLE: ended a turn with a blow left', T.idleWhy['a blow left'] || 0, T.turns, 'turns'],
    ['IDLE: winded beside a foe, full turn lost', T.idleWhy['winded beside a foe'] || 0, T.turns, 'turns'],
    ['IDLE: a melee man stood with a walk to the fight open', T.idleWhy['a walk open'] || 0, T.turns, 'turns'],
    ['IDLE: a gunman stood with a shot one walk away', T.idleWhy['a gunman stood, a shot one walk away'] || 0, T.turns, 'turns'],
    ['STREAK: the same man idle with full AP 3+ turns running', T.streak, T.meleeMen + T.gunMen, 'men'],
    ['PARKED: a melee man no blow and no step nearer (COMBAT J1)', T.parked, T.parkedTurns, 'melee turns'],
    ['LONE: a walk alone into three', T.lone, T.loneWalks, 'walks'],
    ['LOW SHOT: 10+ points under his best shot, not the team\'s man', T.lowShot, T.shotsChoice, 'shots with a choice'],
    ['SPREAD: hits split, none fell, one could have', T.spread, T.roundsWithHits, 'rounds with our blows'],
    ['FREE HIT: walked out of a ring for nothing', T.freeHit, T.turns, 'turns'],
    ['DANCE: off and back, no blow', T.dance, T.turns, 'turns'],
    ['KEY MAN: the Mechanic in reach, not struck', T.keyIgnored, T.keyChances, 'actions with him in reach'],
    ['NEVER: a melee man who never struck', T.meleeNever, T.meleeMen, 'melee men'],
    ['NEVER: a gunman who never shot', T.gunNever, T.gunMen, 'gunmen']
  ].map(([k, n, d, unit]) => ({ kind: k, n, of: d, unit, per100: per(n, d) }));
}
function report(label, fs_) {
  const T = sum(fs_), K = kinds(T);
  console.log('\n######## ' + label + ': ' + fs_.length + ' fights, ' + T.turns + ' turns of ours, won ' + T.won + ', clean ' + T.clean + ', rounds ' + (T.rounds / Math.max(1, fs_.length)).toFixed(1));
  K.slice().sort((a, b) => b.per100 - a.per100).forEach(x => console.log('  ' + String(x.n).padStart(5) + ' of ' + String(x.of).padEnd(6) + (x.per100.toFixed(2) + '%').padStart(8) + '  ' + x.kind + '  [' + x.unit + ']'));
  console.log('  idle why: ' + JSON.stringify(T.idleWhy));
  console.log('  rule 201: focus share ' + (100 * T.focusAimed / Math.max(1, T.aimed)).toFixed(1) + '% of our blows on the round\'s most-struck man' + (T.namedRounds ? ', named ' + (100 * T.namedAimed / Math.max(1, T.aimed)).toFixed(1) + '%' : ', no named target in the fight')
    + '; hurt and standing at a round\'s end ' + (T.hurtStanding / Math.max(1, T.roundsCounted)).toFixed(2) + '; low shots at the team\'s man (allowed) ' + T.lowShotTeam + '; shots 5+ under the best ' + T.shotGap5 + ' of ' + T.shotsChoice);
  return { T, K };
}

async function main() {
  const argv = process.argv, arg = (k, d) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
  if (argv[2] === '--fight') { process.stdout.write(JSON.stringify(await oneFight(argv[3], Number(argv[4])))); return; }
  const N = Number(arg('--n', 80)), JOBS = Number(arg('--jobs', 4)), shapes = String(arg('--shapes', Object.keys(SHAPES).filter(k => !SHAPES[k].side).join(','))).split(',');
  /* the round's name is the last commit that changed the fight or its data (a commit of mine changes neither), its key the rules' print */
  const sha = cp.execSync('git log -1 --format=%h --abbrev=8 -- slices/BOHEMIA_FIGHT.html records/target/bb slices/fight_ground', { cwd: ROOT }).toString().trim(), fp = B.rulesPrint();
  const me = require('crypto').createHash('sha1').update(fs.readFileSync(__filename)).digest('hex').slice(0, 8);   /* the instrument's own print: a changed counter replays */
  const CF = path.join(CACHE, 'tuning_stupid_move_watch.' + fp + '.' + me + '.ndjson'), res = {};
  if (fs.existsSync(CF)) fs.readFileSync(CF, 'utf8').split('\n').filter(Boolean).forEach(l => { try { const x = JSON.parse(l); res[x.shape + '|' + x.k] = x; } catch (e) { /* a cut line */ } });
  const work = []; shapes.forEach(s => { for (let k = 0; k < N; k++) if (!res[s + '|' + k]) work.push([s, k]); });
  process.stderr.write('rules ' + fp + ' (main ' + sha + '); resume: ' + (shapes.length * N - work.length) + ' of ' + shapes.length * N + ' already played\n');
  let next = 0, running = 0; const t0 = Date.now();
  await new Promise(done => {
    const pump = () => { while (running < JOBS && next < work.length) { const [s, k] = work[next++]; running++;
      cp.execFile(process.execPath, [__filename, '--fight', s, String(k)], { maxBuffer: 1 << 26 }, (err, so) => {
        running--;
        if (err) console.error('fight failed', s, k, err.message.slice(0, 300)); else { const x = JSON.parse(so); res[s + '|' + k] = x; fs.appendFileSync(CF, JSON.stringify(x) + '\n'); }
        if (next % 40 === 0) process.stderr.write(next + '/' + work.length + ' ' + Math.round((Date.now() - t0) / 1000) + 's\n');
        if (next >= work.length && running === 0) done(); else pump(); }); } };
    if (!work.length) done(); else pump();
  });
  const out = { sha, rules_print: fp, n: N, at: new Date().toISOString(), shapes: {} };
  const all = [];
  shapes.forEach(s => { const fs_ = Object.values(res).filter(x => x.shape === s && x.k < N); if (!SHAPES[s].side) all.push.apply(all, fs_);
    const r = report(s.toUpperCase() + ' (' + SHAPES[s].why + ')', fs_); out.shapes[s] = { why: SHAPES[s].why, fights: fs_.length, totals: r.T, kinds: r.K, examples: [].concat.apply([], fs_.map(f => f.ex)).slice(0, 40) }; });
  const r = report('ALL SHAPES', all); out.all = { fights: all.length, totals: r.T, kinds: r.K };
  if (argv.includes('--save')) {
    const bank = fs.existsSync(BANK) ? JSON.parse(fs.readFileSync(BANK, 'utf8')) : { draft: true, rounds: [] };
    bank._readme = 'TUNING [the stupid-move watch] (rule 188(b), rule 201; research only). draft:true. NOTHING IN THE GAME READS THIS FILE. '
      + 'Each round is the live fight on main (its sha and its rules\' print) played on AUTO both sides by tools/bohemia_tuning_stupid_move_watch.js; '
      + 'OUR side watched. kinds: every wrong move by kind, n of the unit it is counted in, per 100. The counts must go down round over round.';
    /* one round per main sha and rules print: a later run of other shapes on the same tree adds its shapes to that round */
    const same = (bank.rounds || []).filter(x => x.rules_print === fp)[0];
    if (same) { same.sha = sha; Object.assign(same.shapes, out.shapes); if (all.length) same.all = out.all; same.at = out.at; same.n = Math.max(same.n || 0, N); }
    bank.draft = true; bank.rounds = bank.rounds || []; if (!same) bank.rounds.push(out);
    fs.writeFileSync(BANK, JSON.stringify(bank) + '\n'); console.log('\nwrote ' + path.relative(ROOT, BANK) + ' (' + bank.rounds.length + ' rounds)');
  }
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { SHAPES, setupShape, playWatched, oneFight, kinds, sum };
