#!/usr/bin/env node
// TUNING [easier than Battle Brothers, measured] 10/18 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 117).
// Rule 117 (Paolo 10/18, LOCKED): 'I want you to be easier than Battle Brothers... Nintendo simplified... minimalist...
// make the people feel that they're successfully doing it.' The board's row: 'easier has to be a number, or it drifts
// back to hard.' This plays the LIVE fight's own rules (the fight-data and fight-rules scripts of slices/BOHEMIA_FIGHT.html,
// the data files they load, unchanged) headless in node, both sides on the fight's own brain (AUTO), and counts what a
// player feels, at Battle Brothers' numbers and at the rule 117 start, one lever at a time and all together.
//
// What it changes, only in its own memory copy, never in a file: two hooks are spliced into the rules text (each anchor
// must match exactly once, or it stops and says the fight moved): the hit number (your roll shift, their roll shift, the
// streak breaker), the breath a man gets back each turn (so a lever can be his side's only), and the moment a swing
// lands or misses (the counters). Everything else is a data value the fight already
// reads through R() (experience, the tier days) or an option the map already hands it (the party's count and difficulty).
//
//   node tools/bohemia_tuning_easier_measured.js            prints the table (all scenarios x all settings)
//   node tools/bohemia_tuning_easier_measured.js --write    also writes banks/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.json
//   --n 300   fights per cell (default 300); --jobs 4   worker processes
//   --control  the hooks at neutral against the unhooked rules, six seeded fights: they must match event for event
// Seeded: cell (scenario, setting) fight k plays seed 1000*scenario + k, so every setting meets the SAME fights.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'banks/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.json');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const PM = J('records/target/bb/party_math.json');

/* ---------- the settings: TODAY is Battle Brothers' Veteran (the door's default pick, 'seen'); START is rule 117 ---------- */
const BASE = { gains: false, hit: 0, streak: null, nerve: 1, ownNerve: 1, breath: 15, breathBoth: false, tiers: [20, 60], pick: 1, xp: -0.15 };
const STREAK = { from: 50, plus: 10 };
/* BB = Battle Brothers' Veteran in full, the HARD END (rule 117a): the live fight plus the one thing Battle Brothers does that the
   fight does not, a level raising three stats (rules.json experience.per_level and stat_gains, at the range's middle, no stars) */
const BB = { gains: true };
const ALL = { gains: true, hit: 5, streak: STREAK, pick: 0, nerve: 0.9, breath: 18, tiers: [25, 75], xp: -0.05 };
const SETTINGS = [
  { id: 'today', name: 'TODAY: the game as it plays (the door defaults to Veteran; a level never raises a stat in the fight)', L: {} },
  { id: 'bb', name: 'BATTLE BROTHERS VETERAN, THE HARD END: today plus a level raising three stats', L: BB },
  { id: 'hit', name: 'your roll +5, theirs -5 (their Beginner)', L: Object.assign({}, BB, { hit: 5 }) },
  { id: 'streak', name: 'a bad streak ends (+10 a miss on a 50+ shot)', L: Object.assign({}, BB, { streak: STREAK }) },
  { id: 'count', name: 'the party sized at their Beginner (the door\'s NEW pick, 0.85)', L: Object.assign({}, BB, { pick: 0 }) },
  { id: 'nerve', name: 'the enemy\'s nerve 0.9', L: Object.assign({}, BB, { nerve: 0.9 }) },
  { id: 'breath', name: 'breath back 18 a turn, YOUR men only (theirs keep 15)', L: Object.assign({}, BB, { breath: 18 }) },
  { id: 'breath_both', name: 'breath back 18 a turn for BOTH sides (a shared rule bent: the control)', L: Object.assign({}, BB, { breath: 18, breathBoth: true }) },
  { id: 'tiers', name: 'the better crews later (day 25 and 75)', L: Object.assign({}, BB, { tiers: [25, 75] }) },
  { id: 'start', name: 'THE START: every lever above together (breath yours only), and experience -0.05', L: ALL },
  { id: 'start_own', name: 'THE START plus your own nerve 1.1 (proposed this round)', L: Object.assign({}, ALL, { ownNerve: 1.1 }) },
  { id: 'expert', name: 'PAST THE HARD END: their Expert (your roll -5, theirs +5, the party 1.15, crews 20 days early)', L: Object.assign({}, BB, { hit: -5, pick: 2 }) }
];

/* ---------- the fights: what a player meets, sized the way the map sizes them (records/target/bb/party_math.json) ---------- */
function jobCount(men, level, skulls, pick) {
  const P = PM.job.value, str = men * (PM.roster_strength.value.per_man + PM.roster_strength.value.per_level * (level - 1));
  const n = str / P.strength_per_enemy * P.skull_mult[String(skulls)] * PM.difficulty_count_mult.value[pick];
  return Math.max(P.min, Math.min(P.max, Math.floor(n + 0.5)));
}
const SCENARIOS = [
  /* THE FIRST FIGHT: today it is the fixed first band (ours.first_band, nine); Battle Brothers sizes it like any job, by the
     company's strength (the twelve at their backgrounds' mean starting level, one skull): ten at Veteran, nine at Beginner */
  { id: 'first', name: 'THE FIRST FIGHT (the demo\'s: the twelve against the first band, day 1)',
    opts: L => { const O = J('records/target/bb/ours.json'), fb = O.first_band.value;
      if (!L.gains) return { band: fb.slice() };
      const bg = new Map(J('records/target/bb/backgrounds.json').rows.map(r => [r.id, r]));
      const lv = O.crew.value.map(c => { const s = bg.get(c.background).starting_level; return (s[0] + s[s.length - 1]) / 2; });
      const n = jobCount(lv.length, lv.reduce((a, b) => a + b, 0) / lv.length, 1, L.pick), band = fb.slice();
      while (band.length > n) band.splice(band.indexOf('brigand_thug'), 1); while (band.length < n) band.unshift('brigand_thug');
      return { band: band }; } },
  { id: 'newcrew', name: 'A NEW CREW\'S FIRST JOB (the door\'s default origin: three men, one skull, day 3)',
    opts: L => ({ company: [{ background: 'companion_2hand', level: 1 }, { background: 'companion_1hand', level: 1 }, { background: 'companion_ranged', level: 1 }], cap: 12,
      party: { count: jobCount(3, 1, 1, L.pick), days: 3, difficulty: L.pick, faction: 'brigands' } }) },
  { id: 'grown', name: 'THE GROWN COMPANY (eight men at level 3, two skulls, day 22)',
    opts: L => { const c = J('records/target/bb/ours.json').crew.value.slice(0, 8).map(m => ({ background: m.background, level: 3 }));
      return { company: c, cap: 12, party: { count: jobCount(8, 3, 2, L.pick), days: 22, difficulty: L.pick, faction: 'brigands' } }; } },
  { id: 'tough', name: 'A TOUGH ONE (the twelve at level 4, three skulls, day 65)',
    opts: L => { const c = J('records/target/bb/ours.json').crew.value.map(m => ({ background: m.background, level: 4 }));
      return { company: c, cap: 12, party: { count: jobCount(12, 4, 3, L.pick), days: 65, difficulty: L.pick, faction: 'brigands' } }; } }
];

/* ---------- the engine: the live fight's scripts in a node context ---------- */
function engine(plain) {
  const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  const grab = id => { const m = html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)<\\/script>')); if (!m) throw new Error('no script ' + id); return m[1]; };
  let rules = grab('fight-rules');
  const splice = (anchor, add, before) => {
    const n = rules.split(anchor).length - 1;
    if (n !== 1) throw new Error('THE FIGHT MOVED: anchor found ' + n + ' times: ' + anchor.slice(0, 60));
    rules = rules.replace(anchor, before ? add + anchor : anchor + add);
  };
  if (!plain) {
  splice("    const cap = R('hit_chance.cap');\n    return { chance: Math.round(Math.max(cap.min, Math.min(cap.max, ch))), parts: parts };", '    ch = HOOK.hit(a, t, ch);\n', true);
  splice('  function apply(a, t, r, opt) {\n    opt = opt || {};', '\n    HOOK.after(a, t, r);', false);
  splice("u.fat = Math.max(0, u.fat - R('fatigue.recovery_per_turn'));", '', false);
  rules = rules.replace("u.fat = Math.max(0, u.fat - R('fatigue.recovery_per_turn'));", "u.fat = Math.max(0, u.fat - HOOK.breath(u, R('fatigue.recovery_per_turn')));");
  }
  const ctx = { console, Math, JSON, Date, Object, Array, String, Number, Error, HOOK: null,
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} } };
  vm.createContext(ctx);
  vm.runInContext(grab('fight-data') + ';this.DB=DB;this.setSeed=function(s){SEED=s>>>0;};', ctx);
  const files = ['records/target/bb/rules.json', 'records/target/bb/ours.json', 'records/target/bb/ai.json', 'records/target/bb/enemies.json',
    'records/target/bb/weapons.json', 'records/target/bb/armor.json', 'records/target/bb/injuries.json', 'records/target/bb/backgrounds.json',
    'slices/fight_ground/fight_ground.json', 'records/target/bb/perks.json', 'records/target/bb/perk_translation.json',
    'slices/fight_people/fight_people.json', 'records/target/bb/weapon_lines.json'];
  const keys = ['rules', 'ours', 'ai', 'enemies', 'weapons', 'armor', 'injuries', 'backgrounds', 'ground', 'perks', 'perkNames', 'people', 'wlines'];
  files.forEach((f, i) => { ctx.DB[keys[i]] = J(f); });
  vm.runInContext(rules + ';this.FIGHT=FIGHT;', ctx);
  return ctx;
}

/* ---------- one cell: N fights of one scenario at one setting ---------- */
function cell(scId, setId, n) {
  const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB;
  const sc = SCENARIOS.find(s => s.id === scId), st = SETTINGS.find(s => s.id === setId), L = Object.assign({}, BASE, st.L);
  DB.rules.experience.global_modifier.value = L.xp;
  const ph = DB.ours.enemy_tiers.value.phases; ph[1].from_day = L.tiers[0]; ph[2].from_day = L.tiers[1];
  const T = { fights: 0, won: 0, rounds: 0, beats: 0, yourAtt: 0, yourHit: 0, theirAtt: 0, theirHit: 0, streak3: 0, down: 0, dead: 0,
    injured: 0, yourRan: 0, theirRan: 0, rout: 0, lostMen: 0, xp: 0, men: 0, enemies: 0, wonNoneDown: 0 };
  ctx.HOOK = {
    breath: function (u, base) { return u.side === 'you' || L.breathBoth ? L.breath : base; },
    hit: function (a, t, ch) {
      let c = ch + (a.side === 'you' ? L.hit : -L.hit);
      a.__base = c;
      if (L.streak && a.side === 'you' && c >= L.streak.from && a.__ms > 0) c += L.streak.plus * a.__ms;
      return c;
    },
    after: function (a, t, r) {
      if (a.side === 'you') {
        T.yourAtt++; if (r.hit) T.yourHit++;
        if (r.hit) a.__r50 = 0; else if (r.chance >= 50) { a.__r50 = (a.__r50 || 0) + 1; if (a.__r50 === 3) T.streak3++; }
        if (L.streak) { if (r.hit) a.__ms = 0; else if (a.__base >= L.streak.from) a.__ms = (a.__ms || 0) + 1; }
      } else { T.theirAtt++; if (r.hit) T.theirHit++; }
    }
  };
  const seed0 = 1000 * (SCENARIOS.indexOf(sc) + 1);
  for (let k = 0; k < n; k++) {
    ctx.setSeed(seed0 + k);
    F.setup(Object.assign({ auto: true, formation: null }, sc.opts(L)));
    const G = DB.rules.experience.stat_gains.value, mid = k => (G[k][0] + G[k][1]) / 2;
    const P1 = mid('primary (melee skill, melee defense)'), S2 = mid('secondary (ranged skill, ranged defense, HP, fatigue, resolve)');
    F.S.units.forEach(u => {
      if (L.gains && u.side === 'you' && u.level > 1) {
        const g = u.level - 1;
        if (F.isRanged(u.weapon)) u.rskill = Math.round(u.rskill + S2 * g); else u.mskill = Math.round(u.mskill + P1 * g);
        u.mdef = Math.round(u.mdef + P1 * g); u.hp = u.hpMax = Math.round(u.hp + S2 * g);
      }
      if (u.resolve === null || u.resolve === undefined) return;
      if (u.side === 'them' && L.nerve !== 1) u.resolve = Math.round(u.resolve * L.nerve);
      if (u.side === 'you' && L.ownNerve !== 1) u.resolve = Math.round(u.resolve * L.ownNerve);
    });
    let g = 0;
    while (!F.S.over && g < 40000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; }
    const S = F.S, yours = S.units.filter(u => u.side === 'you'), ids = new Set(yours.map(u => u.id));
    T.fights++; T.men += yours.length; T.enemies += S.units.length - yours.length;
    if (S.result === 'won') T.won++;
    T.rounds += S.round;
    let acted = false, open = false, downs = 0;
    const ranY = new Set(), ranT = new Set();
    S.log.forEach(e => {
      if (e.t === 'turn') { if (open) T.beats += acted ? 2 : 0.5; open = true; acted = false; }
      else if (e.t === 'step' || e.t === 'attack' || e.t === 'reload' || e.t === 'skill') acted = true;
      if ((e.t === 'down' || e.t === 'dead') && ids.has(e.id)) { downs++; if (e.t === 'dead') T.dead++; }
      if (e.t === 'injury' && ids.has(e.id)) T.injured++;
      if (e.t === 'morale' && e.to === 'Fleeing') (ids.has(e.id) ? ranY : ranT).add(e.id);
      if (e.t === 'fled' && !ids.has(e.id)) ranT.add(e.id);
    });
    if (open) T.beats += acted ? 2 : 0.5;
    T.down += downs; T.yourRan += ranY.size; T.theirRan += ranT.size;
    if (S.result === 'won' && ranT.size > 0) T.rout++;
    if (S.result === 'won' && downs === 0) T.wonNoneDown++;
    T.xp += yours.reduce((s, u) => s + (u.xpGained || 0), 0) / yours.length;
  }
  return T;
}

/* ---------- what a player feels, per fight ---------- */
function felt(T) {
  const f = T.fights, r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100, pct = x => Math.round(100 * x);
  return {
    fights: f,
    won_in_100: pct(T.won / f),
    won_with_nobody_down_in_100: pct(T.wonNoneDown / f),
    minutes_on_auto: r1(T.beats / f / 120),
    rounds: r1(T.rounds / f),
    your_swings_land_in_100: pct(T.yourHit / Math.max(1, T.yourAtt)),
    their_swings_land_in_100: pct(T.theirHit / Math.max(1, T.theirAtt)),
    three_misses_in_a_row_on_a_good_shot_per_fight: r2(T.streak3 / f),
    your_men_struck_down_per_fight: r2(T.down / f),
    your_men_dead_per_100_fights: r1(100 * T.dead / f),
    your_men_hurt_per_fight: r2(T.injured / f),
    your_men_who_ran_per_fight: r2(T.yourRan / f),
    their_men_who_ran_per_fight: r2(T.theirRan / f),
    wins_by_a_rout_in_100: pct(T.rout / f),
    fights_to_200_xp: r1(200 / Math.max(1e-9, T.xp / f)),
    enemies: r1(T.enemies / f), men: r1(T.men / f)
  };
}

/* THE CONTROL: the hooks set to change nothing must replay the unhooked fight event for event */
if (process.argv[2] === '--control') {
  const A = engine(true), B = engine(false);
  B.HOOK = { hit: (a, t, c) => c, after: () => {}, breath: (u, b) => b };
  let same = 0;
  for (let k = 1; k <= 6; k++) {
    const out = [A, B].map(c => { c.setSeed(k); c.FIGHT.setup({ auto: true, formation: null }); let g = 0;
      while (!c.FIGHT.S.over && g < 40000) { c.FIGHT.aiStep(c.FIGHT.current()); g++; }
      return c.FIGHT.S.result + ' in ' + c.FIGHT.S.round + ' rounds, ' + c.FIGHT.S.log.length + ' events'; });
    if (out[0] === out[1]) same++;
    console.log('seed ' + k + ': ' + out[0] + (out[0] === out[1] ? '  SAME' : '  DIFFERENT: ' + out[1]));
  }
  console.log('control: ' + same + ' of 6 the same');
  process.exit(same === 6 ? 0 : 1);
}

if (process.argv[2] === '--cell') {
  const [, , , sc, st, n] = process.argv;
  process.stdout.write(JSON.stringify(cell(sc, st, Number(n))));
  process.exit(0);
}

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const N = arg('--n', 300), JOBS = arg('--jobs', 4);
const work = [];
SCENARIOS.forEach(s => SETTINGS.forEach(t => work.push({ sc: s.id, st: t.id })));
const results = {};
let next = 0, running = 0;
const t0 = Date.now();
function pump(done) {
  while (running < JOBS && next < work.length) {
    const w = work[next++]; running++;
    cp.execFile(process.execPath, [__filename, '--cell', w.sc, w.st, String(N)], { maxBuffer: 1 << 24 }, (err, out) => {
      running--;
      if (err) { console.error('cell failed', w, err.message); process.exit(1); }
      results[w.sc + '|' + w.st] = JSON.parse(out);
      process.stderr.write('.');
      if (next >= work.length && running === 0) done(); else pump(done);
    });
  }
}
pump(() => {
  process.stderr.write('\n');
  const table = {};
  SCENARIOS.forEach(s => { table[s.id] = {}; SETTINGS.forEach(t => { table[s.id][t.id] = felt(results[s.id + '|' + t.id]); }); });
  SCENARIOS.forEach(s => {
    console.log('\n' + s.name);
    const cols = ['won_in_100', 'won_with_nobody_down_in_100', 'minutes_on_auto', 'your_swings_land_in_100', 'their_swings_land_in_100',
      'three_misses_in_a_row_on_a_good_shot_per_fight', 'your_men_struck_down_per_fight', 'your_men_dead_per_100_fights', 'your_men_hurt_per_fight',
      'your_men_who_ran_per_fight', 'their_men_who_ran_per_fight', 'wins_by_a_rout_in_100', 'fights_to_200_xp', 'enemies'];
    console.log('setting'.padEnd(10) + cols.map(c => c.split('_').map(w => w[0]).join('').padStart(6)).join(''));
    SETTINGS.forEach(t => { const r = table[s.id][t.id]; console.log(t.id.padEnd(10) + cols.map(c => String(r[c]).padStart(6)).join('')); });
  });
  console.log('\n' + work.length + ' cells x ' + N + ' fights in ' + Math.round((Date.now() - t0) / 1000) + ' s');
  if (process.argv.includes('--write')) {
    fs.writeFileSync(OUT, JSON.stringify({
      _readme: 'TUNING [easier than Battle Brothers, measured] 10/18 (rule 117; rule 38g research only). draft:true. NOTHING IN THE GAME READS THIS FILE. '
        + 'Every cell is ' + N + ' fights of the live fight\'s own rules (slices/BOHEMIA_FIGHT.html, played headless by tools/bohemia_tuning_easier_measured.js), '
        + 'both sides on the fight\'s own brain (AUTO), seeded so every setting meets the same fights. TODAY is Battle Brothers\' Veteran (the door\'s default pick, seen); '
        + 'THE START is rule 117\'s levers together. Page: records/BOHEMIA_TUNING_EASIER_THAN_BATTLE_BROTHERS_MEASURED_10_18_26.md',
      draft: true, schema: 1, fights_per_cell: N,
      settings: SETTINGS.map(t => ({ id: t.id, name: t.name, levers: Object.assign({}, BASE, t.L) })),
      scenarios: SCENARIOS.map(s => ({ id: s.id, name: s.name })),
      felt: table
    }, null, 1) + '\n');
    console.log('wrote ' + path.relative(ROOT, OUT));
  }
});
