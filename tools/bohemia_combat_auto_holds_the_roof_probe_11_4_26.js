#!/usr/bin/env node
/* THE COORDINATOR 11/4 [auto holds the roof] -- THE PROBE (a measuring instrument; the gate is gates/auto_holds_the_roof_gate.js).
   Paolo 11/4 (rule 385 and its amendment, ask lines 416 and 417): 'why am I watching my people climb on top of a roof and then climb
   off to get a shot... just stick on the roof, you're gonna get a better defence bonus and the whole enchilada... I'm losing battles
   because the auto keeps wanting my men to get off the roof'; 'I'm seeing them have other enemies in range of a shot and they're
   still getting off the roof... why can't they just post up for one turn to see if enemies start getting closer, especially when it's
   a tight battle'.
   It plays the LIVE fight headless (slices/BOHEMIA_FIGHT.html's own rules and data) on AUTO for both sides, the same fights as the
   auto-plays-smart probe (wolves, raiders, the mechanic's robots, the act-one bosses; companies of 3 and 6, early and middle kit), and
   logs every turn of every shooter of his that OPENS on high ground (a storey or more):
     roof_turns            such turns
     left_with_a_shot      he could shoot from where he stood when the turn opened, and the turn ended lower
     left_while_posting    no shot from there, and the turn ended lower before he had held the roof the turns the rule asks
                           (ours.auto_holds_the_roof: hold_turns, hold_turns_tight in a tight fight; counted from the first turn he
                           opened up there)
     up_then_down          the turn before ended higher than it opened (he climbed) and this one ended lower
     stayed_up             the turn ended at the same height or higher
   and who won. --before turns the rule off in this memory copy (the brain as it was).
     node tools/bohemia_combat_auto_holds_the_roof_probe_11_4_26.js [--n 30] [--before] [--json out.json] [--kinds raiders,boss]   */
'use strict';
const fs = require('fs'), path = require('path');
const G = require('./bohemia_tuning_the_whole_grid.js');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const N = Number(arg('--n', 30)), OUT = arg('--json', null), BEFORE = process.argv.indexOf('--before') > 0, ONLY = arg('--kinds', null);
const BOSSES = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/boss_act_one.json'), 'utf8')).bosses;
const KINDS = [
  { id: 'wolves', party: size => ({ faction: 'beasts', count: Math.round(size * 1.5) }) },
  { id: 'raiders', party: size => ({ faction: 'brigands', count: Math.round(size * 1.2) }) },
  { id: 'robots', party: size => { const band = ['necromancer']; for (let i = 0; i < Math.round(size * 1.2); i++) band.push(i % 3 === 2 ? 'armored_wiederganger' : 'wiederganger'); return { band: band, count: band.length, rolled: true }; } },
  { id: 'boss', boss: true }
];
(async () => {
  const ctx = await G.engine(true), F = ctx.FIGHT, districts = ctx.DB.boardKinds.districts, O = ctx.DB.ours;
  if (BEFORE && O.auto_holds_the_roof) O.auto_holds_the_roof.value.on = false;
  const H = (O.auto_holds_the_roof && O.auto_holds_the_roof.value) || { hold_turns: 1, hold_turns_tight: 2 };
  const out = { at: new Date().toISOString(), n: N, before: BEFORE, hold: H, kinds: {} };
  const shotHere = u => F.S.units.some(t => t.side !== u.side && F.onField(t) && F.canStrike(u, t) && F.sideSees(u.side, t));
  const tight = u => {
    const S = F.S, mine = S.units.filter(v => v.side === u.side), up = mine.filter(v => F.onField(v) && v.morale !== 'Fleeing').length;
    const them = S.units.filter(v => v.side !== u.side && F.onField(v) && v.morale !== 'Fleeing').length;
    return up <= them || up < mine.length;
  };
  for (const K of KINDS) {
    if (ONLY && ONLY.split(',').indexOf(K.id) < 0) continue;
    const T = { fights: 0, won: 0, lost: 0, rounds: 0, roof_turns: 0, left_with_a_shot: 0, left_while_posting: 0, up_then_down: 0, stayed_up: 0, his_down: 0, errs: [], fails: [] };
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
        const since = {}, lastUp = {};
        let open = null, g = 0;
        const idle = G.idleWatch(F);
        const close = () => {
          if (!open) return;
          const r = open; open = null;
          const u = F.byId(r.id); if (!u || !F.onField(u)) return;
          const lv1 = F.level(u.x, u.y), down = lv1 < r.lv;
          lastUp[r.id] = { round: r.round, up: lv1 > r.lv };
          if (r.lv < 1 || !r.ranged || r.fleeing || S.retreat) return;
          T.roof_turns++;
          if (!down) { T.stayed_up++; return; }
          if (r.shot) { T.left_with_a_shot++; if (T.fails.length < 8) T.fails.push({ kind: K.id, fight: k, why: 'left a roof with a shot from it', id: r.id, round: r.round, from: [r.x, r.y, r.lv], to: [u.x, u.y, lv1], btWhy: r.why }); }
          else if (r.waiting) { T.left_while_posting++; if (T.fails.length < 8) T.fails.push({ kind: K.id, fight: k, why: 'left a roof before posting up', id: r.id, round: r.round, from: [r.x, r.y, r.lv], to: [u.x, u.y, lv1], tight: r.tight, held: r.held, btWhy: r.why }); }
          if (r.climbedLast) T.up_then_down++;
        };
        while (!S.over && g < 200000) {
          const u = F.current(); if (!u) break;
          if (!open || open.id !== u.id || open.round !== S.round) {
            close();
            if (u.side === 'you') {
              const lv = F.level(u.x, u.y);
              if (lv >= 1) { if (!since[u.id] || since[u.id].lv !== lv) since[u.id] = { lv: lv, round: S.round }; } else delete since[u.id];
              const ti = tight(u), held = since[u.id] ? S.round - since[u.id].round : 0;
              const lu = lastUp[u.id];
              open = { id: u.id, round: S.round, x: u.x, y: u.y, lv: lv, ranged: F.isRanged(u.weapon), fleeing: u.morale === 'Fleeing',
                shot: lv >= 1 && shotHere(u), tight: ti, held: held, waiting: held < (ti ? H.hold_turns_tight : H.hold_turns),
                climbedLast: !!(lu && lu.up && lu.round === S.round - 1) };
            }
          }
          u.btWhy = null; F.aiStep(u); g++;
          if (open && open.id === u.id && u.btWhy) open.why = u.btWhy;
          if (idle()) break;
        }
        close();
        S.log.forEach(e => { if ((e.t === 'down' || e.t === 'dead') && ids.has(e.id)) T.his_down++; });
        T.fights++; if (S.result === 'won') T.won++; else if (S.result === 'lost') T.lost++; T.rounds += S.round;
      } catch (e) { T.errs.push(String(e && e.message).slice(0, 160)); }
    }
    out.kinds[K.id] = { fights: T.fights, won: T.won, lost: T.lost, rounds_per_fight: Math.round(T.rounds / Math.max(1, T.fights) * 10) / 10, his_men_down: T.his_down,
      roof_turns: T.roof_turns, stayed_up: T.stayed_up, left_with_a_shot: T.left_with_a_shot, left_while_posting: T.left_while_posting, up_then_down: T.up_then_down,
      errors: T.errs.slice(0, 5), fails: T.fails };
    const o = Object.assign({}, out.kinds[K.id]); delete o.fails;
    console.log(K.id.toUpperCase(), JSON.stringify(o));
  }
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
