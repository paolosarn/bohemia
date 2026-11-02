#!/usr/bin/env node
/* COMBAT 6 [auto plays the best turn, the round swing three in front] 11/2 -- THE PROBE (a measuring instrument).
   Paolo 11/2 (rules 332, 333): 'are we going to let auto combat use abilities... two offhand items you can bring... I don't want AI
   to prioritize finding the mechanic, then the melee guy has to go straight for the mechanic and dodge through all the robots...
   the best course of action in that turn, to do the most damage and take the least damage within that turn... round swing right
   now hits eight people around you... it could hit three tiles... what happens if the character is out of stamina'.
   It plays the LIVE fight headless (slices/BOHEMIA_FIGHT.html's own rules and data) on AUTO for both sides, N fights per kind
   (wolves, raiders, the mechanic's robots, the three act-one bosses in turn; companies of 3 and 6, early and middle kit; the same
   seeds and boards as tools/bohemia_combat_auto_plays_smart_probe_11_2_26.js) and counts, for HIS men:
     abilities   his sweeps (a weapon's other blow: Split, Swing, Shatter, Reap, Round Swing, Thresh, a whip's Disarm) and his
                 active perks (Adrenaline, Recover, Rotation, Rally, Taunt, Footwork, Indomitable), per fight
     swaps       a weapon or shield out of his bag
     rests       a turn he spent nothing while winded when it opened (the rest COMBAT 3 made work: 30 back, not 15); rested_for_breath:
                 the brain held him for his breath (rule 332's out of stamina, or the rest for a bigger next turn); held_by_the_score:
                 holding beat every option (every walk to a blow cost more than it dealt)
     idle        a turn he spent nothing while NOT winded (and not fleeing, netted or stunned); idle_with_a_blow_here: of those,
                 a seen man of theirs was in his reach from where he stood when it opened
     long chases a turn he walked 3+ tiles and ended it inside the reach of 2+ of their men who swing (their walk this turn and a
                 swing: floor((AP - the blow's AP) / the flat step) + their reach; a man of theirs already beside another man of
                 ours counts only his own reach); chases_any also counts their shooters in range
     round swing the men one Round Swing or Thresh struck (his and theirs), and his friends on its tiles
   and the fight: won, rounds, minutes on AUTO (the tuning bench's sum: 2 beats a turn that acts, half a beat one that passes, 120
   a minute), his men down, the free swings his men took walking.
     node tools/bohemia_combat_auto_best_turn_probe_11_2_26.js [--n 30] [--json out.json] [--kinds wolves,raiders] [--old] [--old-his] [--set auto_best_turn.swaps_a_turn=0]
   --old turns this round's two changes off in the memory copy (ai crew.best_turn false, ours.round_swing.on false): the brain and
   the swing before rule 332 and 333, on the same seeds. */
'use strict';
const fs = require('fs'), path = require('path');
const G = require('./bohemia_tuning_the_whole_grid.js');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const has = k => process.argv.indexOf(k) > 0;
const N = Number(arg('--n', 30)), OUT = arg('--json', null), ONLY = arg('--kinds', null);
const BOSSES = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/boss_act_one.json'), 'utf8')).bosses;
const KINDS = [
  { id: 'wolves', party: size => ({ faction: 'beasts', count: Math.round(size * 1.5) }) },
  { id: 'raiders', party: size => ({ faction: 'brigands', count: Math.round(size * 1.2) }) },
  { id: 'robots', party: size => { const band = ['necromancer']; for (let i = 0; i < Math.round(size * 1.2); i++) band.push(i % 3 === 2 ? 'armored_wiederganger' : 'wiederganger'); return { band: band, count: band.length, rolled: true }; } },
  { id: 'boss', boss: true }
];
const SWEEPS = ['Split', 'Swing', 'Shatter', 'Reap', 'Round Swing', 'Thresh', 'Disarm'];
const ROUND = ['Round Swing', 'Thresh'];
const dist = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
(async () => {
  const ctx = await G.engine(true), F = ctx.FIGHT, districts = ctx.DB.boardKinds.districts, T_ = F._t || {};
  const O = ctx.DB.ours, crew = ctx.DB.ai.archetypes.crew.value;
  if (has('--old')) { crew.best_turn = false; if (O.round_swing) O.round_swing.value.on = false; if (O.auto_best_turn) O.auto_best_turn.value.theirs = false; }
  /* --old-his: his brain and the swing before, THEIR side on this round's brain: his AUTO judged against the same enemy */
  if (has('--old-his')) { crew.best_turn = false; if (O.round_swing) O.round_swing.value.on = false; }
  /* --set auto_best_turn.swaps_a_turn=0 (repeatable): a number of ours.json moved in this memory copy only, to tell its share apart */
  process.argv.forEach((a, i) => { if (a !== '--set') return; const kv = String(process.argv[i + 1]).split('='), ks = kv[0].split('.'); let n = O[ks[0]].value; for (let j = 1; j < ks.length - 1; j++) n = n[ks[j]]; n[ks[ks.length - 1]] = JSON.parse(kv[1]); });
  const flat = ctx.DB.rules.ap.move_cost.flat.value;
  const out = { at: new Date().toISOString(), n: N, old: has('--old'), kinds: {} };
  /* the men of theirs who could swing at (or, any, shoot) a man on x,y in their next turn */
  function inTheirReach(man, any) {
    return F.S.units.filter(f => f.side !== man.side && F.onField(f) && f.morale !== 'Fleeing' && !f.disarmed).filter(f => {
      const d = dist(f, man);
      if (F.isRanged(f.weapon)) return any && d <= F.rangeMax(f.weapon.range);
      const busy = F.S.units.some(m => m !== man && m.side === man.side && F.onField(m) && dist(m, f) === 1);
      const sAP = T_.skillAP ? T_.skillAP(f.weapon, F.strikeSkill(f.weapon), f) : 4;
      const steps = busy ? 0 : Math.floor(Math.max(0, f.apTurn - sAP) / flat);
      return d <= steps + F.reachOf(f.weapon);
    }).length;
  }
  for (const K of KINDS) {
    if (ONLY && ONLY.split(',').indexOf(K.id) < 0) continue;
    const T = { fights: 0, won: 0, lost: 0, rounds: 0, beats: 0, turns: 0, abilities: 0, by: {}, swaps: 0, rests: 0, idle: 0, idle_blow: 0,
      chases: 0, chases_any: 0, walks3: 0, picks: {}, says: {}, examples: {}, climbs: 0, rest_for_next: 0, breath: 0, held: 0, free_taken: 0, down: 0, rs: 0, rs_struck: 0, rs_friends: 0, errs: [] };
    for (let k = 0; k < N; k++) {
      try {
        const size = [3, 6][k % 2], stage = ['early', 'middle'][Math.floor(k / 2) % 2];
        const d = districts[(k * 7 + 3) % districts.length];
        ctx.setSeed(6100 + k);
        let opts;
        if (K.boss) {
          const B = BOSSES[k % BOSSES.length], band = [B.boss.kind].concat(B.crew || []);
          opts = { auto: true, formation: null, company: G.companyOf(size, stage), cap: size,
            party: { band: band, count: band.length, rolled: true, boss: true, days: stage === 'early' ? 1 : 30 },
            boss: { n: B.n, kind: B.boss.kind, name: B.boss.name, hp_x: +B.boss.hp_x || 1, weapon: B.boss.weapon, shield: B.boss.shield },
            days: stage === 'early' ? 1 : 30, district: d.district, cell: { x: 11 + (k % 29), y: 7 + (k % 31) }, act: 1 };
        } else {
          opts = { auto: true, formation: null, company: G.companyOf(size, stage), cap: size,
            party: Object.assign({ days: stage === 'early' ? 1 : 30 }, K.party(size)),
            days: stage === 'early' ? 1 : 30, district: d.district, cell: { x: 11 + (k % 29), y: 7 + (k % 31) }, act: 1 };
        }
        F.setup(opts);
        const S = F.S; S.deploy = false;
        if (F.startFight) try { F.startFight(); } catch (e) { /* the bench's own setups start on their own */ }
        const ids = new Set(S.units.filter(u => u.side === 'you').map(u => u.id));
        let g = 0, open = null;
        const idle = G.idleWatch(F);
        const close = () => {
          if (!open) return;
          const r = open; open = null; T.turns++;
          const u = F.byId(r.id), evs = S.log.slice(r.L0).filter(e => e.id === r.id);
          const acted = evs.some(e => /^(attack|reload|skill|step)$/.test(e.t) && !e.free && !e.shoved) || evs.some(e => e.t === 'swap' && e.slot !== undefined);
          const steps = evs.filter(e => e.t === 'step' && !e.shoved).length;
          if (!acted && !r.fleeing && !r.netted && !r.stunned) {
            if (r.winded) T.rests++; else if (r.why === 'rest' || r.why === 'recover') T.breath++; else if (r.why === 'hold') T.held++; else { T.idle++; if (r.blow) T.idle_blow++; }
          }
          if (steps >= 3 && u && F.onField(u)) {
            T.walks3++;
            if (inTheirReach(u, false) >= 2) T.chases++;
            if (inTheirReach(u, true) >= 2) T.chases_any++;
          }
        };
        while (!S.over && g < 200000) {
          const u = F.current(); if (!u) break;
          if (!open || open.id !== u.id || open.round !== S.round) {
            close();
            if (u.side === 'you') open = { id: u.id, round: S.round, L0: S.log.length, winded: !!F.winded(u), fleeing: u.morale === 'Fleeing', netted: !!u.netted, stunned: u.ap <= 0,
              blow: S.units.some(t => t.side !== u.side && F.onField(t) && F.canStrike(u, t) && F.sideSees(u.side, t)) };
          }
          const L0 = S.log.length;
          u.btWhy = null; u.btSay = null; F.aiStep(u); g++;
          /* rule 332 amended (ask line 334): the brain's pick and its reason, for his men and theirs */
          if (open && open.id === u.id && u.btWhy) open.why = u.btWhy;
          if (u.btWhy) { const pk = u.side + ':' + u.btWhy; T.picks[pk] = (T.picks[pk] || 0) + 1;
            if (u.btWhy === 'climb' && u.side === 'you') T.climbs++;
            if (u.btWhy === 'rest' && u.side === 'you' && u.btSay && /^rests: next turn/.test(u.btSay)) T.rest_for_next++;
            /* the three worked examples (ask line 334): a shooter climbs; a shooter shoots now with a roof weighed; a rest for next turn */
            const ex = (key, ok) => { if (!ok) return; T.examples[key] = T.examples[key] || []; if (T.examples[key].length < 2) T.examples[key].push({ fight: k, round: S.round, side: u.side, man: u.name || u.kind, weapon: u.weapon && u.weapon.name, said: u.btSay, weighed: u.btLast }); };
            ex('a shooter climbs', F.isRanged(u.weapon) && u.btWhy === 'climb');
            ex('a shooter shoots now, a roof weighed', F.isRanged(u.weapon) && u.btWhy === 'strike' && (u.btLast || []).some(x => /^climb/.test(x)));
            ex('a rest for next turn', u.btWhy === 'rest' && /^rests: next turn/.test(u.btSay || ''));
            if (u.btSay) { const sk = u.side + ':' + u.btSay.split(':')[0]; T.says[sk] = T.says[sk] || []; if (T.says[sk].length < 3) T.says[sk].push(u.name + ' ' + (u.weapon && u.weapon.name) + ': ' + u.btSay); } }
          let rsAt = null;
          S.log.slice(L0).forEach(e => {
            if (e.t === 'attack' && e.free && ids.has(e.to)) T.free_taken++;
            if (e.t === 'skill' && ids.has(e.id)) { T.abilities++; T.by[e.skill] = (T.by[e.skill] || 0) + 1; }
            if (e.t === 'swap' && e.slot !== undefined && ids.has(e.id)) T.swaps++;
            if (e.t === 'attack' && !e.free && !e.sweep && SWEEPS.indexOf(e.skill) >= 0) {
              if (ids.has(e.id)) { T.abilities++; T.by[e.skill] = (T.by[e.skill] || 0) + 1; }
              if (ROUND.indexOf(e.skill) >= 0) {
                T.rs++; T.rs_struck++; rsAt = e.id;
                const a = F.byId(e.id); if (a) T.rs_friends += S.units.filter(m => m !== a && m.side === a.side && F.onField(m) && dist(m, a) === 1).length;
              }
            } else if (e.t === 'attack' && e.sweep && rsAt === e.id && ROUND.indexOf(e.skill) >= 0) T.rs_struck++;
            if ((e.t === 'down' || e.t === 'dead') && ids.has(e.id)) T.down++;
          });
          if (idle()) break;
        }
        close();
        T.fights++; if (S.result === 'won') T.won++; else if (S.result === 'lost') T.lost++; T.rounds += S.round;
        let op = false, acted = false;
        S.log.forEach(e => { if (e.t === 'turn') { if (op) T.beats += acted ? 2 : 0.5; op = true; acted = false; } else if (/^(step|attack|reload|skill|swap)$/.test(e.t)) acted = true; });
        if (op) T.beats += acted ? 2 : 0.5;
      } catch (e) { T.errs.push(String(e && e.stack || e).slice(0, 300)); }
    }
    const r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100, f = Math.max(1, T.fights);
    out.kinds[K.id] = { fights: T.fights, won: T.won, lost: T.lost, rounds_per_fight: r1(T.rounds / f), minutes_on_auto: r1(T.beats / f / 120),
      his_turns: T.turns, abilities: T.abilities, abilities_per_fight: r2(T.abilities / f), abilities_by: T.by, swaps: T.swaps,
      rests: T.rests, rested_for_breath: T.breath, held_by_the_score: T.held, idle: T.idle, idle_with_a_blow_here: T.idle_blow, walks_of_3_plus: T.walks3, long_chases: T.chases, long_chases_any: T.chases_any,
      free_swings_taken: T.free_taken, his_men_down: T.down,
      climbs: T.climbs, rests_for_next_turn: T.rest_for_next, picks: T.picks, reasons: T.says, examples: T.examples,
      round_swings: T.rs, round_swing_men_struck: T.rs_struck, round_swing_friends_beside: T.rs_friends, errors: T.errs.slice(0, 3) };
    console.log(K.id.toUpperCase(), JSON.stringify(out.kinds[K.id]));
  }
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
