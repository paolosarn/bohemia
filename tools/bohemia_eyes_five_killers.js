#!/usr/bin/env node
/* ============================================================================
   EYES: FIVE KILLERS (VAMILY rule 493(d), Paolo 11/27: 'I have five combat people [that] were absolute killers and there's no more
   challenges, nothing else to do'). A company like his, made the game's own way, against the hardest work the map can deal it.

   THE COMPANY: the first five of the crew list (ours.json crew), each made by the crew screen's own code (engine/bohemia_roster.js
   manOf), climbed to the level asked by its own grant() (the fight's XP table), every level's rolls RAISED on his kind's plan (the
   same plan the recruit-ceiling calculator uses: melee or gun), every perk point spent on a killer's pick (Battle Brothers' common
   late build, in the tier order the screen allows), dressed in the best kit (TUNING's 'late' or 'endgame' rows, every id a shop row).
   THE WORK: the map's own job math for that company (party_math.json job_bb: Battle Brothers' contract multiplier on the strength
   from slices/bohemia_job_kinds.js strength(), kit counted), dressed for the day a company that strong stands (job_bb.dress), at one,
   two and three skulls, and the job's most (party_math job.max). Each faction asked plays it.
   THE FIGHT: slices/BOHEMIA_FIGHT.html's own rules and brain on both sides (AUTO), seeded.
   node tools/bohemia_eyes_five_killers.js [--n 24] [--levels 8,11,14] [--kit late,endgame] [--factions brigands,...] [--json out]
   Nothing in the game reads this; every number is a measurement of the game as it is.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const G = require('./bohemia_tuning_the_whole_grid.js');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const N = +arg('--n', 24), OUT = arg('--json', null);
const LEVELS = arg('--levels', '8,11,14').split(',').map(Number);
const KITS = arg('--kit', 'late,endgame').split(',');
const FACTIONS = arg('--factions', 'brigands').split(',');
const MEN = +arg('--men', 5);
const PM = J('records/target/bb/party_math.json');
const GEAR = {
  late: { pipe: 'winged_mace', sledge: 'two_handed_hammer', pistol: 'qatal_dagger', rifle: 'heavy_crossbow', shotgun: 'handgonne',
    bottles: 'bundle_of_heavy_throwing_axes', car_door: 'heater_shield', body: 'reinforced_mail_hauberk', head: 'bascinet_with_mail' },
  endgame: { pipe: 'winged_mace', sledge: 'two_handed_hammer', pistol: 'qatal_dagger', rifle: 'heavy_crossbow', shotgun: 'handgonne',
    bottles: 'bundle_of_heavy_throwing_axes', car_door: 'heater_shield', body: 'coat_of_scales', head: 'full_helm' }
};
/* a killer's picks, Battle Brothers' common late build, taken in this order as the tiers open */
const PICKS = { melee: ['colossus', 'nine_lives', 'steel_brow', 'brawny', 'MASTERY', 'underdog', 'battle_forged', 'killing_frenzy', 'indomitable', 'berserk',
    'recover', 'dodge', 'resilient', 'anticipation', 'shield_expert', 'reach_advantage', 'duelist', 'fast_adaptation'],
  gun: ['colossus', 'bullseye', 'nine_lives', 'quick_hands', 'MASTERY', 'footwork', 'head_hunter', 'killing_frenzy', 'indomitable', 'battle_forged',
    'recover', 'dodge', 'resilient', 'anticipation', 'brawny', 'nimble', 'fearsome', 'fast_adaptation'] };
/* the mastery for the weapon he holds (the fight's row's class) */
const MASTERY = { dagger: 'dagger_mastery', mace: 'mace_mastery', hammer: 'hammer_mastery', crossbow: 'crossbow_mastery', throwing: 'throwing_mastery', axe: 'axe_mastery', sword: 'sword_mastery', firearm: 'crossbow_mastery' };

/* the crew screen's own roster code, its data read off disk */
function roster() {
  const ctx = { console, Math, JSON, Object, Array, String, Number, Promise, isNaN, parseInt, parseFloat, setTimeout, clearTimeout,
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} } };
  ctx.fetch = (u) => { const rel = u.replace(/^\.\.\//, '').replace(/^fight_people\//, 'slices/fight_people/'); const f = path.join(ROOT, rel);
    return Promise.resolve({ json: () => Promise.resolve(JSON.parse(fs.readFileSync(f, 'utf8'))), ok: true }); };
  ctx.window = ctx; ctx.root = ctx; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_roster.js'), 'utf8'), ctx);
  return ctx.BohemiaRoster.load('../records/target/bb/').then(() => ctx.BohemiaRoster);
}
const ARM = (() => { const a = J('records/target/bb/armor.json'), m = {}; ['head', 'body'].forEach(k => (a[k] || []).forEach(r => { if (r && r.id) m[r.id] = +r.durability || 0; })); return m; })();
function strengthOf(men) {   /* slices/bohemia_job_kinds.js companyStrength(), the same rows */
  const R = PM.roster_strength.value;
  return Math.round(men.map(m => R.per_man + R.per_level * (m.level - 1) + (+R.kit_per_armour || 0) * ((ARM[m.gear.head] || 0) + (ARM[m.gear.body] || 0)))
    .sort((a, b) => b - a).slice(0, R.strongest).reduce((t, s) => t + s, 0) * 10) / 10;
}
const BBM = PM.job_bb.value;
function dressDay(str) {   /* the same table tools/bohemia_world_most_jobs_fit.js reads (job_bb.dress) */
  const T = BBM.dress; if (str <= T[0][0]) return T[0][1];
  for (let i = 1; i < T.length; i++) if (str <= T[i][0]) return Math.round(T[i - 1][1] + (T[i][1] - T[i - 1][1]) * (str - T[i - 1][0]) / (T[i][0] - T[i - 1][0]));
  return Math.min(100, Math.round(T[T.length - 1][1] + (str - T[T.length - 1][0]) / 4));
}
function jobCount(str, skulls) {
  const P = PM.job.value, mult = PM.difficulty_count_mult.value[1];   /* the door's default, Veteran */
  const m = Math.max(BBM.mult_min, Math.min(BBM.mult_max, BBM.k * Math.pow(str / 100, BBM.exp)));
  return Math.max(P.min, Math.min(P.max, Math.floor(BBM.base_men[String(skulls)] * m * mult + 0.5)));
}

(async () => {
  const BR = await roster();
  const ctx = await G.engine(true, null), F = ctx.FIGHT, W = { weapons: J('records/target/bb/weapons.json') };
  const crewDefs = J('records/target/bb/ours.json').crew.value.slice(0, MEN);
  const rows = [];
  for (const L of LEVELS) for (const kit of KITS) {
    const g = GEAR[kit];
    const men = crewDefs.map((def, i) => {
      const m = BR.manOf(def, i), kind = (def.jobs || []).some(j => j === 'rifle' || j === 'shotgun' || j === 'bottles') ? 'gun' : 'melee';
      BR.grant(m, BR.xpFor(L), 'eyes:' + i);
      const plan = BR.planFor(kind); while ((m.rolls || []).length) BR.raise(m, plan);
      const jobs = def.jobs || [], main = jobs.filter(j => j !== 'car_door')[0];
      const wrow = (W.weapons.rows || []).filter(r => r.id === g[main])[0], mast = wrow && MASTERY[wrow['class']];
      const picks = PICKS[kind].map(p => p === 'MASTERY' ? mast : p).filter(Boolean);
      for (let s = 0; s < 40 && m.points > 0; s++) { const can = BR.perkChoices(m).map(r => r.id), want = picks.find(p => can.indexOf(p) >= 0) || can[0]; if (!want || !BR.takePerk(m, want)) break; }
      return { name: m.name, background: m.bgId, level: m.level, perks: m.perks.slice(), stats: Object.assign({}, m.stats), kind,
        gear: { main: g[main], off: jobs.indexOf('car_door') >= 0 ? g.car_door : null, body: g.body, head: g.head } };
    });
    const str = strengthOf(men), dd = dressDay(str);
    /* --company-out: the five as the crew screen keeps them (bohemia.company.v1), for the page walk */
    if (arg('--company-out', null)) fs.writeFileSync(arg('--company-out') + '_L' + L + '_' + kit + '.json', JSON.stringify(men.map(m => ({ name: m.name, background: m.background,
      level: m.level, perks: m.perks, stats: m.stats, marks: [], gear: Object.assign({ bag: [null, null] }, m.gear) }))));
    if (arg('--company-only', null)) continue;
    const asks = [1, 2, 3].map(s => ({ skulls: s, count: jobCount(str, s) })).concat([{ skulls: 'most', count: PM.job.value.max }]);
    /* --bosses 10-18: the hard places (BOSSES 11/27zu, slices/bohemia_bosses.js __THE_HARD_PLACES__): his band as the map hands it
       (him first, his crew, his lair's seven, records/target/bb/boss_act_one.json), the boss made the fight's own way (opts.boss) */
    if (arg('--bosses', null)) {
      const [a, b] = arg('--bosses').split('-').map(Number), BOSSES = J('records/target/bb/boss_act_one.json').bosses.slice(a - 1, b);
      for (const B of BOSSES) {
        const band = [B.boss.kind].concat(B.crew || []); (B.lair && B.lair.guards || []).forEach(g => { for (let q = 0; q < (g.count | 0); q++) band.push(g.kind); });
        const T = { won: 0, lost: 0, stall: 0, down: 0, dead: 0, rounds: 0 };
        for (let k = 0; k < N; k++) {
          ctx.setSeed(9100 + k);
          F.setup({ auto: true, formation: null, company: men, cap: men.length, days: dd,
            party: { faction: 'brigands', count: band.length, band: band.slice(), rolled: true, boss: true, days: dd, difficulty: 1 },
            boss: { n: B.n, kind: B.boss.kind, name: B.boss.name || B.n, hp_x: +B.boss.hp_x || 1, weapon: B.boss.weapon || null, shield: B.boss.shield || null } });
          if (k === 0 && F.S.bossErr) console.log('  boss err', F.S.bossErr);
          if (k === 0) T.them = F.S.units.filter(u => u.side !== 'you').length;
          let gq = 0; const idle = G.idleWatch(F);
          while (!F.S.over && gq < 400000) { const u = F.current(); if (!u) break; F.aiStep(u); gq++; if (idle()) break; }
          const S = F.S, ids = new Set(S.units.filter(u => u.side === 'you').map(u => u.id));
          if (!S.over) T.stall++; else if (S.result === 'won') T.won++; else T.lost++;
          T.rounds += S.round || 0; S.log.forEach(e => { if (ids.has(e.id) && e.t === 'down') T.down++; if (ids.has(e.id) && e.t === 'dead') T.dead++; });
        }
        const row = { level: L, kit, boss: B.n, band: band.length, stood: T.them, won_in_100: Math.round(100 * T.won / N), lost_in_100: Math.round(100 * T.lost / N), stalled_in_100: Math.round(100 * T.stall / N),
          his_men_down_a_fight: +(T.down / N).toFixed(2), his_men_dead_a_fight: +(T.dead / N).toFixed(2), rounds_a_fight: +(T.rounds / N).toFixed(1), hoard: B.lair && B.lair.haul };
        rows.push(row);
        console.log(`L${L} ${kit.padEnd(7)} ${B.n.padEnd(12)} ${String(T.them).padStart(2)} stood  won ${String(row.won_in_100).padStart(3)} lost ${String(row.lost_in_100).padStart(3)} stall ${row.stalled_in_100}  down/fight ${row.his_men_down_a_fight} dead/fight ${row.his_men_dead_a_fight}  rounds ${row.rounds_a_fight}  hoard ${row.hoard}`);
      }
      continue;
    }
    for (const fac of FACTIONS) for (const A of asks) {
      const T = { won: 0, lost: 0, stall: 0, down: 0, dead: 0, rounds: 0, theirTop: 0 };
      for (let k = 0; k < N; k++) {
        ctx.setSeed(9100 + k);
        F.setup({ auto: true, formation: null, company: men, cap: men.length, party: { faction: fac, count: A.count, days: A.skulls === 'most' ? 100 : dd, difficulty: 1 }, days: A.skulls === 'most' ? 100 : dd });
        let gq = 0; const idle = G.idleWatch(F);
        while (!F.S.over && gq < 400000) { const u = F.current(); if (!u) break; F.aiStep(u); gq++; if (idle()) break; }
        const S = F.S, ids = new Set(S.units.filter(u => u.side === 'you').map(u => u.id));
        if (!S.over) T.stall++; else if (S.result === 'won') T.won++; else T.lost++;
        T.rounds += S.round || 0;
        S.log.forEach(e => { if (ids.has(e.id) && e.t === 'down') T.down++; if (ids.has(e.id) && e.t === 'dead') T.dead++; });
      }
      const row = { level: L, kit, faction: fac, strength: str, dressed_for_day: A.skulls === 'most' ? 100 : dd, skulls: A.skulls, enemies: A.count,
        won_in_100: Math.round(100 * T.won / N), lost_in_100: Math.round(100 * T.lost / N), stalled_in_100: Math.round(100 * T.stall / N),
        his_men_down_a_fight: +(T.down / N).toFixed(2), his_men_dead_a_fight: +(T.dead / N).toFixed(2), rounds_a_fight: +(T.rounds / N).toFixed(1) };
      rows.push(row);
      console.log(`L${L} ${kit.padEnd(7)} ${fac.padEnd(10)} str ${String(str).padStart(5)} dressed d${String(row.dressed_for_day).padStart(3)}  ${String(A.skulls).padEnd(4)} ${String(A.count).padStart(2)} of them  won ${String(row.won_in_100).padStart(3)} lost ${String(row.lost_in_100).padStart(3)} stall ${row.stalled_in_100}  down/fight ${row.his_men_down_a_fight} dead/fight ${row.his_men_dead_a_fight}  rounds ${row.rounds_a_fight}`);
    }
    if (L === LEVELS[0] && kit === KITS[0]) console.log('  the five: ' + men.map(m => m.name + ' L' + m.level + ' ' + m.kind + ' ms' + m.stats.melee_skill + ' rs' + m.stats.ranged_skill + ' hp' + m.stats.hp + ' [' + m.perks.join(',') + ']').join(' | '));
  }
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ n: N, rows }, null, 1));
})().catch(e => { console.error(e.stack || e.message); process.exit(1); });
