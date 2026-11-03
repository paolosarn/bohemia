#!/usr/bin/env node
/* COMBAT 7 [the enemy wants to live] 11/3 -- THE PROBE (a measuring instrument; rule 366, ask line 390; Paolo 11/3: 'Battle Brothers
   [enemies are] slightly intelligent, they try to preserve their [lives]... our enemies should be climbing on tops as high as they can,
   reasonable... the enemy can have abilities as well').
   It plays the LIVE fight headless on AUTO for both sides, the best-turn probe's kinds and seeds, and watches THEIR men:
     shooter_turns / on_roof      a turn of a shooter of theirs (a gun, a bow, a sling in his hands), and how many of those END on a
                                  roof; roof_open: of the turns that ended on the ground, a roof he could walk to this turn was there
     alone_into_many              a man of theirs who WALKED and ended where 3 or more of ours can strike him on their next turn with
                                  no man of his own beside him (and struck nobody this turn)
     hurt_walk_in                 a man of theirs under hurt_below of his hitpoints who walked into the reach of 2 or more of ours
     abilities                    their skills and sweeps used (by name)
     hit_the_soft                 of their blows with a choice (2 or more of ours in reach), the share on the most hurt man or a
                                  shooter of ours, the ones Battle Brothers' AI goes for
   and his wins.
     node tools/bohemia_combat_the_enemy_wants_to_live_probe_11_3_26.js [--n 15] [--kinds wolves,raiders] [--json out.json] */
'use strict';
const fs = require('fs'), path = require('path');
const G = require('./bohemia_tuning_the_whole_grid.js');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const N = Number(arg('--n', 15)), OUT = arg('--json', null), ONLY = arg('--kinds', null), HURT = 0.35;
const BOSSES = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/boss_act_one.json'), 'utf8')).bosses;
const KINDS = [
  { id: 'wolves', party: size => ({ faction: 'beasts', count: Math.round(size * 1.5) }) },
  { id: 'raiders', party: size => ({ faction: 'brigands', count: Math.round(size * 1.2) }) },
  { id: 'robots', party: size => { const band = ['necromancer']; for (let i = 0; i < Math.round(size * 1.2); i++) band.push(i % 3 === 2 ? 'armored_wiederganger' : 'wiederganger'); return { band: band, count: band.length, rolled: true }; } },
  { id: 'boss', boss: true }
];
const dist = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
(async () => {
  const ctx = await G.engine(true), F = ctx.FIGHT, T_ = F._t, districts = ctx.DB.boardKinds.districts;
  const flat = ctx.DB.rules.ap.move_cost.flat.value;
  const out = { at: new Date().toISOString(), n: N, kinds: {}, total: {} };
  const reachers = (S, man, swords) => S.units.filter(f => f.side !== man.side && F.onField(f) && f.morale !== 'Fleeing' && !(swords && F.isRanged(f.weapon))).filter(f => {
    const d = dist(f, man); if (F.isRanged(f.weapon)) return d <= F.rangeMax(f.weapon.range);
    const sAP = T_.skillAP ? T_.skillAP(f.weapon, F.strikeSkill(f.weapon), f) : 4; return d <= Math.floor(Math.max(0, f.apTurn - sAP) / flat) + F.reachOf(f.weapon); }).length;
  for (const K of KINDS) {
    if (ONLY && ONLY.split(',').indexOf(K.id) < 0) continue;
    const C = { fights: 0, won: 0, shooter_turns: 0, on_roof: 0, roof_open: 0, could_climb: 0, did_climb: 0, height_up: 0, alone_into_many: 0, walks: 0, hurt_walk_in: 0, hurt_turns: 0, abilities: 0, by: {}, choice_blows: 0, hit_the_soft: 0, errs: [] };
    for (let k = 0; k < N; k++) {
      try {
        const size = [3, 6][k % 2], stage = ['early', 'middle'][Math.floor(k / 2) % 2], d = districts[(k * 7 + 3) % districts.length];
        ctx.setSeed(6100 + k); let opts;
        if (K.boss) { const B = BOSSES[k % BOSSES.length], band = [B.boss.kind].concat(B.crew || []);
          opts = { auto: true, formation: null, company: G.companyOf(size, stage), cap: size, party: { band: band, count: band.length, rolled: true, boss: true, days: stage === 'early' ? 1 : 30 },
            boss: { n: B.n, kind: B.boss.kind, name: B.boss.name, hp_x: +B.boss.hp_x || 1, weapon: B.boss.weapon, shield: B.boss.shield }, days: stage === 'early' ? 1 : 30, district: d.district, cell: { x: 11 + (k % 29), y: 7 + (k % 31) }, act: 1 };
        } else opts = { auto: true, formation: null, company: G.companyOf(size, stage), cap: size, party: Object.assign({ days: stage === 'early' ? 1 : 30 }, K.party(size)), days: stage === 'early' ? 1 : 30, district: d.district, cell: { x: 11 + (k % 29), y: 7 + (k % 31) }, act: 1 };
        F.setup(opts); const S = F.S; S.deploy = false; if (F.startFight) try { F.startFight(); } catch (e) {}
        const idle = G.idleWatch(F); let g = 0, open = null;
        const close = () => {
          if (!open) return; const r = open; open = null; const u = F.byId(r.id); if (!u || !F.onField(u)) return;
          const evs = S.log.slice(r.L0).filter(e => e.id === r.id), walked = evs.some(e => e.t === 'step'), struck = evs.some(e => e.t === 'attack' && !e.free);
          if (r.could && process.env.EW_DEBUG && (C.dbg = (C.dbg || 0) + 1) <= 8) console.log('COULD', u.kind, u.weapon && u.weapon.name, 'ap', u.apTurn, 'lv', F.level(u.x, u.y), evs.map(e => e.t + (e.skill ? ':' + e.skill : '')).join('/'), u.btSay || '', JSON.stringify(u.btLast || []).slice(0, 160));
          if (r.could) { C.could_climb++; if (evs.some(e => e.t === 'climbed') || (F.isRoof(u.x, u.y) && F.level(u.x, u.y) > 0)) { C.did_climb++; if (F.level(u.x, u.y) >= r.top) C.height_up++; } }
          if (r.shooter) { C.shooter_turns++; if (F.isRoof(u.x, u.y) && F.level(u.x, u.y) >= 1) C.on_roof++; else if (r.roofOpen) C.roof_open++; }
          if (walked) { C.walks++;
            const pals = S.units.filter(m => m !== u && m.side === u.side && F.onField(m) && dist(m, u) === 1).length;
            if (!struck && pals === 0 && reachers(S, u) >= 3) C.alone_into_many++;
            if (r.hurt && reachers(S, u) >= 2 && r.reach0 < 2) C.hurt_walk_in++; }
        };
        while (!S.over && g < 200000) {
          const u = F.current(); if (!u) break;
          if (!open || open.id !== u.id || open.round !== S.round) { close();
            if (u.side === 'them' && u.morale !== 'Fleeing') {
              const shooter = F.isRanged(u.weapon);
              let roofOpen = false, could = false, top = F.level(u.x, u.y);
              if (shooter) { const ld = u.loaded, am = u.ammo; u.loaded = true; if (u.ammo !== null && u.ammo <= 0) u.ammo = 1; const f = F.reach(u), noShot = !S.units.some(t => t.side === 'you' && F.onField(t) && F.canStrike(u, t)) && !(T_.vantage && (v => !!v && v !== 'stay' && v.kind !== 'shot_next_turn')(T_.vantage(u, true)));
                Object.keys(f.best).forEach(kk => { kk = Number(kk); const x = kk % S.w, y = Math.floor(kk / S.w); if (!F.isRoof(x, y) || F.level(x, y) <= F.level(u.x, u.y)) return; roofOpen = true;
                  const far = F.rangeMax(u.weapon.range) + F.level(x, y); if (noShot && S.units.some(t => t.side === 'you' && F.onField(t) && dist(t, { x, y }) <= far)) { could = true; top = Math.max(top, F.level(x, y)); } }); u.loaded = ld; u.ammo = am; }
              const hurt = u.hp < u.hpMax * HURT; if (hurt) C.hurt_turns++;
              open = { id: u.id, round: S.round, L0: S.log.length, shooter, roofOpen, could, top, hurt, reach0: reachers(S, u) };
            } }
          const L0 = S.log.length;
          /* their blows with a choice: before the act, who of ours was in reach */
          const inReach = u.side === 'them' ? S.units.filter(t => t.side === 'you' && F.onField(t) && F.canStrike(u, t) && F.sideSees(u.side, t)) : [];
          F.aiStep(u); g++;
          S.log.slice(L0).forEach(e => {
            if (e.id !== u.id || u.side !== 'them') return;
            if (e.t === 'skill') { C.abilities++; C.by[e.skill] = (C.by[e.skill] || 0) + 1; }
            if (e.t === 'attack' && !e.free && e.skill && !/^(Strike|Bite|Shoot|Stab|Slash|Bash|Chop|Thrust|Punch)$/i.test(e.skill) && F.sweepSkills && F.sweepSkills(u.weapon).some(s => s.name === e.skill)) { C.abilities++; C.by[e.skill] = (C.by[e.skill] || 0) + 1; }
            if (e.t === 'attack' && !e.free && !e.sweep && inReach.length >= 2) {
              C.choice_blows++;
              const t = F.byId(e.to), low = inReach.reduce((m, v) => Math.min(m, v.hp / v.hpMax), 1);
              if (t && (t.hp / t.hpMax <= low + 0.05 || F.isRanged(t.weapon))) C.hit_the_soft++;
            }
          });
          if (idle()) break;
        }
        close(); C.fights++; if (S.result === 'won') C.won++;
      } catch (e) { C.errs.push(String(e && e.stack || e).slice(0, 300)); }
    }
    out.kinds[K.id] = C;
    Object.keys(C).forEach(k2 => { if (typeof C[k2] === 'number') out.total[k2] = (out.total[k2] || 0) + C[k2]; });
    console.log(K.id.toUpperCase(), JSON.stringify(Object.assign({}, C, { errs: C.errs.slice(0, 1) })));
  }
  const t = out.total;
  console.log('TOTAL', JSON.stringify(t), 'alone into many ' + t.alone_into_many + ' of ' + t.walks + ' walks, roof share ' + (t.on_roof / Math.max(1, t.shooter_turns)).toFixed(2) + ', climbed when it gave a shot ' + t.did_climb + ' of ' + t.could_climb + ' (to the highest ' + t.height_up + ')' + ', soft share ' + (t.hit_the_soft / Math.max(1, t.choice_blows)).toFixed(2));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
