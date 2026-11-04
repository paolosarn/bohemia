#!/usr/bin/env node
/* COMBAT 4 [height is accuracy, auto plays smart] 11/2 -- THE PROBE (a measuring instrument; the gate is
   gates/auto_plays_smart_gate.js). Paolo 11/2 (rules 321, 322): 'a wolf somehow ended up on top of a roof and my main guy couldn't
   hit him... it's not that you can never hit him, it's just more inaccurate'; 'my sniper, my rifle character, ends his turn without
   trying to get to the best point of view, a place with line of sight where he can shoot'.
   It plays the LIVE fight headless (slices/BOHEMIA_FIGHT.html's own rules and data) on AUTO for both sides, 30 fights per kind
   (wolves, raiders, the mechanic's robots, the three act-one bosses in turn; companies of 3 and 6, early and middle kit), and logs
   every turn of every man of his:
     shot_now     he could strike or shoot from where he stood when his turn opened
     shot_by_move a tile he could walk to this turn (the brains' own walk, which stops at a zone of control) left him the AP, the
                  breath and the rounds to strike or shoot from it
     next_turn    a tile he could walk to this turn (not the one he stands on) put a seen foe in his reach for his next turn (full AP,
                  the breath that comes back), while the tile he stands on did not (next_turn_home)
     struck / moved / idle (neither; a winded man's rest is counted apart, it is the rest working)
   and the failures: a shooter (or a club) who ended a turn with no blow when shot_by_move held; an idle turn when next_turn held.
   AMENDED 11/2 (COMBAT 6, rule 332 OUT OF STAMINA): a turn the brain held him for his breath (the blow would leave him unable to
   swing next turn, no kill on offer) is his rule working, like a winded man's rest: counted apart (rested_for_breath), never a failure;
   and (ask line 334, this turn and the next) a turn the brain scored another choice above the shot (a roof for next turn's shot, a
   swap, a perk, holding) is counted apart too (shooter_chose_other, chose_by); a turn with no reason from the brain still fails.
   Also: a beast standing on a roof (and how it got there), a club next to a man he could not swing at because of the storeys
   between them, the fight's length in rounds and minutes (2 beats a turn that acts, half a beat one that passes, 120 a minute: the
   tuning bench's own sum), and who won.
     node tools/bohemia_combat_auto_plays_smart_probe_11_2_26.js [--n 30] [--json out.json] [--turns]   */
'use strict';
const fs = require('fs'), path = require('path');
const G = require('./bohemia_tuning_the_whole_grid.js');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const N = Number(arg('--n', 30)), OUT = arg('--json', null), TURNS = process.argv.indexOf('--turns') > 0;
const BOSSES = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/boss_act_one.json'), 'utf8')).bosses;
const KINDS = [
  { id: 'wolves', why: 'the wolves (direwolves and hyenas)', party: size => ({ faction: 'beasts', count: Math.round(size * 1.5) }) },
  { id: 'raiders', why: 'the road crews (brigands)', party: size => ({ faction: 'brigands', count: Math.round(size * 1.2) }) },
  { id: 'robots', why: 'the mechanic and his robots', party: size => { const band = ['necromancer']; for (let i = 0; i < Math.round(size * 1.2); i++) band.push(i % 3 === 2 ? 'armored_wiederganger' : 'wiederganger'); return { band: band, count: band.length, rolled: true }; } },
  { id: 'boss', why: 'the three act-one bosses in turn (THE POT, THE TAP, THE FILTER) with their crews', boss: true }
];
const dist = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
(async () => {
  const ctx = await G.engine(true), F = ctx.FIGHT, districts = ctx.DB.boardKinds.districts;
  /* switches, in this memory copy only, to tell the changes apart: --wall (the library's height wall back), --dumb (AUTO's
     finds_a_shot off), --climb (beasts climb roofs again); --kinds wolves,raiders keeps only those */
  const O = ctx.DB.ours, has = k => process.argv.indexOf(k) > 0;
  if (has('--wall') && O.height_is_accuracy) Object.assign(O.height_is_accuracy.value, { melee_any_storey: false, zone_any_storey: false });
  if (has('--dumb')) { ctx.DB.ai.archetypes.crew.value.finds_a_shot = false; if (O.auto_finds_a_shot) O.auto_finds_a_shot.value.club_target_weight = 0; }
  if (has('--climb') && O.climbers) Object.assign(O.climbers.value, { beast_sheet_climbs: true, never_climb: [] });
  const ONLY = arg('--kinds', null);
  const out = { at: new Date().toISOString(), n: N, kinds: {}, switches: process.argv.slice(2).filter(a => /^--(wall|dumb|climb)$/.test(a)) };
  /* what a man of his could do from tile x,y with ap: the rules' own canStrike, on a foe his side sees (nothing on the board is
     moved for good: every field it touches is put back) */
  function shotFrom(u, x, y, ap, fat) {
    const keep = { x: u.x, y: u.y, ap: u.ap, fat: u.fat }, lurk = F.S.units.map(v => v.lurking);
    u.x = x; u.y = y; u.ap = ap; if (fat !== undefined) u.fat = fat;
    let ok = false;
    try { ok = F.S.units.some(t => t.side !== u.side && F.onField(t) && F.canStrike(u, t) && F.sideSees(u.side, t)); }
    finally { u.x = keep.x; u.y = keep.y; u.ap = keep.ap; u.fat = keep.fat; F.S.units.forEach((v, i) => { v.lurking = lurk[i]; }); }
    return ok;
  }
  function opening(u) {
    const S = F.S, rec = { id: u.id, name: u.name, round: S.round, ranged: F.isRanged(u.weapon), x: u.x, y: u.y, lv: F.level(u.x, u.y),
      winded: !!F.winded(u), fleeing: u.morale === 'Fleeing', netted: !!u.netted };
    /* AUTO HOLDS THE ROOF (the coordinator 11/4, rule 385 amended): a shooter of his posting up on his roof (no shot from it, the turns
       the rule asks not yet held) is the rule working, counted apart (posted_up), never a failure */
    try { if (F._t.roofSeen) F._t.roofSeen(u); rec.posting = !!(F._t.keepsRoof && F._t.keepsRoof(u)); } catch (e) { rec.posting = false; }
    rec.shot_now = shotFrom(u, u.x, u.y, u.ap);
    const back = ctx.DB.rules.fatigue.recovery_per_turn.value;
    rec.next_turn_home = rec.shot_now || shotFrom(u, u.x, u.y, u.apTurn, Math.max(0, u.fat - back));
    rec.shot_by_move = rec.shot_now; rec.next_turn = false;
    if (!rec.fleeing && !rec.netted) {
      const f = F.reach(u);
      Object.keys(f.best).forEach(k => {
        if (rec.shot_by_move && rec.next_turn) return;
        k = Number(k); const x = k % S.w, y = Math.floor(k / S.w);
        if (x === u.x && y === u.y) return;
        /* CLIMB OR ATTACK (COMBAT 5, rule 328): a tile his way climbs a roof to gives no shot this turn, by his rule */
        if (!rec.shot_by_move && !(f.up && f.up[k]) && shotFrom(u, x, y, u.ap - f.best[k])) rec.shot_by_move = true;
        if (!rec.next_turn && shotFrom(u, x, y, u.apTurn, Math.max(0, u.fat - back))) rec.next_turn = true;
      });
    }
    /* a club beside a man of theirs he cannot swing at for the storeys between them (the library's rule, before) */
    rec.height_walled = !rec.ranged && S.units.some(t => t.side !== u.side && F.onField(t) && dist(u, t) === 1 && !F.canStrike(u, t) &&
      Math.abs(F.level(u.x, u.y) - F.level(t.x, t.y)) >= 2 && u.ap >= 4 && !F.winded(u));
    return rec;
  }
  for (const K of KINDS) {
    if (ONLY && ONLY.split(',').indexOf(K.id) < 0) continue;
    const T = { fights: 0, won: 0, lost: 0, rounds: 0, beats: 0, turns: 0, struck: 0, moved: 0, idle: 0, rested: 0,
      shooter_turns: 0, shooter_no_shot_at_open: 0, shooter_moved_to_a_shot: 0, shooter_ended_no_shot_when_a_tile_gave_one: 0,
      club_turns: 0, club_ended_no_blow_when_a_tile_gave_one: 0, idle_when_a_move_gave_a_hit_next_turn: 0,
      shooter_idle_when_a_move_gave_a_shot_next_turn: 0, height_walled_turns: 0, beast_on_roof_steps: 0, beast_on_roof_fights: 0,
      beast_climbed_a_roof: 0, beast_dealt_on_a_roof: 0, rested_for_breath: 0, shooter_chose_other: 0, chose_by: {}, hits_across_2_storeys: 0, theirs_up_2: 0, theirs_up_2_hit: 0, his_down_on_high: 0, his_down_on_ground: 0, won_by_standoff: 0, errs: [], fails: [] };
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
        const beasts = S.units.filter(u => u.side === 'them' && u.beast), ids = new Set(S.units.filter(u => u.side === 'you').map(u => u.id));
        if (beasts.some(b => F.onField(b) && F.isRoof(b.x, b.y))) T.beast_dealt_on_a_roof++;
        let onRoofFight = false, g = 0, open = null;
        const idle = G.idleWatch(F);
        const close = () => {
          if (!open) return;
          const r = open; open = null; T.turns++;
          const evs = S.log.slice(r.L0).filter(e => e.id === r.id);
          r.struck = evs.some(e => e.t === 'attack' && !e.free);
          r.moved = evs.some(e => e.t === 'step' && !e.shoved);
          r.skill = evs.some(e => e.t === 'skill' || e.t === 'reload');
          const u = F.byId(r.id);
          r.idle = !r.struck && !r.moved && !r.skill;
          if (r.struck) T.struck++; if (r.moved) T.moved++;
          if (r.breath) T.rested_for_breath++;   /* COMBAT 6, rule 332: the brain held him for his breath (no kill on offer) */
          if (r.idle && r.winded) { T.rested++; }
          else if (r.idle) T.idle++;
          if (r.height_walled) T.height_walled_turns++;
          if (r.fleeing || r.netted) return;
          if (r.ranged) {
            T.shooter_turns++;
            if (!r.shot_now) T.shooter_no_shot_at_open++;
            if (!r.shot_now && r.moved && r.struck) T.shooter_moved_to_a_shot++;
            if (!r.struck && r.shot_by_move && !r.winded && !r.breath && r.chose) { T.shooter_chose_other++; T.chose_by[r.chose] = (T.chose_by[r.chose] || 0) + 1; }
            if (!r.struck && r.shot_by_move && !r.winded && !r.breath && !r.chose && r.posting) T.posted_up = (T.posted_up || 0) + 1;
            else if (!r.struck && r.shot_by_move && !r.winded && !r.breath && !r.chose) { T.shooter_ended_no_shot_when_a_tile_gave_one++; if (T.fails.length < 12) T.fails.push(Object.assign({ kind: K.id, fight: k, why: 'shooter, no shot, a tile gave one' }, r, { L0: undefined })); }
            if (r.idle && !r.winded && !r.breath && !r.next_turn_home && r.next_turn && !r.shot_by_move) T.shooter_idle_when_a_move_gave_a_shot_next_turn++;
          } else {
            T.club_turns++;
            if (!r.struck && r.shot_by_move && !r.winded && !r.breath && !r.chose) { T.club_ended_no_blow_when_a_tile_gave_one++; if (T.fails.length < 12) T.fails.push(Object.assign({ kind: K.id, fight: k, why: 'club, no blow, a tile gave one' }, r, { L0: undefined })); }
          }
          if (r.idle && r.posting) T.posted_up = (T.posted_up || 0) + 1;
          else if (r.idle && !r.winded && !r.breath && !r.next_turn_home && r.next_turn) { T.idle_when_a_move_gave_a_hit_next_turn++; if (T.fails.length < 12) T.fails.push(Object.assign({ kind: K.id, fight: k, why: 'idle, a move gave a hit next turn' }, r, { L0: undefined })); }
          if (TURNS) (out.turns = out.turns || []).push(Object.assign({ kind: K.id, fight: k }, r, { L0: undefined }));
        };
        while (!S.over && g < 200000) {
          const u = F.current(); if (!u) break;
          if (!open || open.id !== u.id || open.round !== S.round) {
            close();
            if (u.side === 'you') { open = opening(u); open.L0 = S.log.length; }
          }
          const L0 = S.log.length;
          u.btWhy = null; F.aiStep(u); g++;
          if (open && open.id === u.id && (u.btWhy === 'rest' || u.btWhy === 'recover')) open.breath = true;
          /* rule 332 amended (ask line 334): the brain scored another choice above the shot: a roof for next turn's shot, a swap, a perk,
             or holding; counted apart, never a failure (a turn with no reason from the brain still is) */
          if (open && open.id === u.id && /^(climb|swap|rotation|rally|footwork|hold)$/.test(u.btWhy || '')) open.chose = u.btWhy;
          S.log.slice(L0).forEach(e => {
            if (e.t === 'step' && !e.shoved) { const b = F.byId(e.id); if (b && b.beast && F.isRoof(e.x !== undefined ? e.x : b.x, e.y !== undefined ? e.y : b.y)) T.beast_climbed_a_roof++; }
            if (e.t === 'attack' && !e.free) { const a = F.byId(e.id), t = F.byId(e.to); if (a && t && !F.isRanged(a.weapon) && Math.abs(F.level(a.x, a.y) - F.level(t.x, t.y)) >= 2) { T.hits_across_2_storeys++; if (a.side === 'them') { T.theirs_up_2++; if (e.hit) T.theirs_up_2_hit++; } } }
            if ((e.t === 'down' || e.t === 'dead') && ids.has(e.id)) { const m = F.byId(e.id); if (m && F.level(m.x, m.y) >= 1) T.his_down_on_high++; else T.his_down_on_ground++; }
          });
          const up = beasts.filter(b => F.onField(b) && F.isRoof(b.x, b.y)).length;
          if (up) { T.beast_on_roof_steps++; onRoofFight = true; }
          if (idle()) break;
        }
        close();
        if (onRoofFight) T.beast_on_roof_fights++;
        if (S.result === 'won' && S.log.some(e => e.t === 'standoff')) T.won_by_standoff++;
        T.fights++; if (S.result === 'won') T.won++; else if (S.result === 'lost') T.lost++; T.rounds += S.round;
        let op = false, acted = false;
        S.log.forEach(e => { if (e.t === 'turn') { if (op) T.beats += acted ? 2 : 0.5; op = true; acted = false; } else if (/^(step|attack|reload|skill)$/.test(e.t)) acted = true; });
        if (op) T.beats += acted ? 2 : 0.5;
      } catch (e) { T.errs.push(String(e && e.message).slice(0, 160)); }
    }
    const r1 = x => Math.round(x * 10) / 10;
    out.kinds[K.id] = { why: K.why, fights: T.fights, won: T.won, won_by_standoff: T.won_by_standoff, lost: T.lost, rounds_per_fight: r1(T.rounds / Math.max(1, T.fights)), minutes_on_auto: r1(T.beats / Math.max(1, T.fights) / 120),
      his_turns: T.turns, struck: T.struck, moved: T.moved, idle_not_resting: T.idle, rested_winded: T.rested, rested_for_breath: T.rested_for_breath, shooter_chose_other: T.shooter_chose_other, chose_by: T.chose_by,
      shooter_turns: T.shooter_turns, shooter_no_shot_at_open: T.shooter_no_shot_at_open, shooter_moved_to_a_shot: T.shooter_moved_to_a_shot,
      shooter_ended_no_shot_when_a_tile_gave_one: T.shooter_ended_no_shot_when_a_tile_gave_one,
      shooter_idle_when_a_move_gave_a_shot_next_turn: T.shooter_idle_when_a_move_gave_a_shot_next_turn,
      club_turns: T.club_turns, club_ended_no_blow_when_a_tile_gave_one: T.club_ended_no_blow_when_a_tile_gave_one,
      idle_when_a_move_gave_a_hit_next_turn: T.idle_when_a_move_gave_a_hit_next_turn,
      height_walled_turns: T.height_walled_turns, posted_up: T.posted_up || 0, melee_blows_across_2_storeys: T.hits_across_2_storeys, their_blows_up_2_storeys: T.theirs_up_2, of_them_landed: T.theirs_up_2_hit,
      his_men_down_on_high_ground: T.his_down_on_high, his_men_down_on_the_ground: T.his_down_on_ground,
      beast_on_roof_fights: T.beast_on_roof_fights, beast_on_roof_steps: T.beast_on_roof_steps, beast_climbed_a_roof: T.beast_climbed_a_roof, beast_dealt_on_a_roof: T.beast_dealt_on_a_roof,
      errors: T.errs.slice(0, 5), fails: T.fails };
    const o = Object.assign({}, out.kinds[K.id]); delete o.fails;
    console.log(K.id.toUpperCase(), JSON.stringify(o));
  }
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
