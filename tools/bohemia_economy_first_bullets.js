#!/usr/bin/env node
// ECONOMY [the first bullets] 10/19 -- RESEARCH INSTRUMENT, NOT A GATE (rule 120(a) guns first; rule 117; rule 38g: the
// numbers are TUNING's). The row: 'what a fight's ammo costs in batteries in the first week, against the free first week and
// the day's cost, beside Battle Brothers' ammo, so a careful shooter never goes broke in the first hour.'
//
// On main a shot spends nothing (slices/BOHEMIA_FIGHT.html strike(): only a weapon row with an 'ammo' field counts down,
// and only the bottles have one), so nothing in the game can say what a fight's rounds cost. This plays the LIVE fight's
// own rules headless in node (the same way tools/bohemia_tuning_easier_measured.js does: the fight-data and fight-rules
// scripts, the data files the fight loads, unchanged), both sides on the fight's own brain (AUTO), with guns put in the
// crew's hands through the roster's own gear hand-over (a man's gear.main, RUN TWO [equip from the stash]; his body and
// head kept), and COUNTS EVERY SHOT. Two splices, each anchor must match exactly once or it stops and says the fight moved:
// a counter after the shot is taken (strike), and a CAREFUL hand (canStrike: a shooter of yours may hold fire under a
// chance he names; off unless asked). Nothing is written to any file the game reads.
//
//   node tools/bohemia_economy_first_bullets.js            prints the table
//   node tools/bohemia_economy_first_bullets.js --write    also writes banks/BOHEMIA_ECONOMY_FIRST_BULLETS_10_19_26.json
//   --n 300  fights per cell (default 300)
// Seeded: cell (scenario, kit, hand) fight k plays seed 7800 + 100*scenario + k, so every kit and hand meets the same seeds.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'banks/BOHEMIA_ECONOMY_FIRST_BULLETS_10_19_26.json');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const PM = J('records/target/bb/party_math.json'), OURS = J('records/target/bb/ours.json');
const ROWS = OURS.weapon_rows.value;   // pipe bludgeon, rifle light_crossbow, shotgun handgonne, pistol dagger, ...

/* what a shot takes out of the pile: A = one round a shot on every gun (the bar's unit); B = Battle Brothers' points
   (records/target/bb/stash_rates.json ammo.costPerShot: arrow or bolt 1, handgonne 2, throwing weapon 3) */
const BB_POINTS = J('records/target/bb/stash_rates.json').ammo.costPerShot;
const POINTS = { crossbow: BB_POINTS.arrowOrBolt, bow: BB_POINTS.arrowOrBolt, firearm: BB_POINTS.handgonne, throwing: BB_POINTS.throwingWeaponOrFireLance };

/* the kits: who holds what, front man first (the fight deploys in this order); every man keeps his place's body and head */
const KITS = {
  none:    { name: 'TODAY: no gun (pipe, pipe, sledge; the door\'s default origin as main fields it)', jobs: ['pipe', 'pipe', 'sledge'] },
  bb:      { name: 'BATTLE BROTHERS\' SHAPE: one shooter (pipe, pipe, rifle; A New Company\'s Companion (Ranged) holds a light crossbow)', jobs: ['pipe', 'pipe', 'rifle'] },
  two:     { name: 'TWO GUNS (pipe, rifle, rifle)', jobs: ['pipe', 'rifle', 'rifle'] },
  three:   { name: 'ALL GUNS (rifle, rifle, rifle)', jobs: ['rifle', 'rifle', 'rifle'] },
  shotgun: { name: 'TWO RIFLES AND A SHOTGUN (shotgun, rifle, rifle)', jobs: ['shotgun', 'rifle', 'rifle'] },
  wolf:    { name: 'THE LONE WOLF WITH A RIFLE', jobs: ['rifle'] },
  wolfpipe:{ name: 'THE LONE WOLF WITH A PIPE (today)', jobs: ['pipe'] }
};
const BGS = ['companion_2hand', 'companion_1hand', 'companion_ranged'];   // A New Company's three, the bench's new crew

function jobCount(men, level, skulls, pick) {
  const P = PM.job.value, str = men * (PM.roster_strength.value.per_man + PM.roster_strength.value.per_level * (level - 1));
  const n = str / P.strength_per_enemy * P.skull_mult[String(skulls)] * PM.difficulty_count_mult.value[pick];
  return Math.max(P.min, Math.min(P.max, Math.floor(n + 0.5)));
}
/* the first week's fights, sized the way the map sizes a job (party_math.json; pick 1 = Veteran, the door's default) */
const SCENARIOS = [
  { id: 'job1', name: 'THE FIRST JOB, ONE SKULL (day 3)', men: 3, skulls: 1, days: 3 },
  { id: 'job2', name: 'A TWO-SKULL JOB (day 5)', men: 3, skulls: 2, days: 5 },
  { id: 'job3', name: 'A THREE-SKULL JOB (day 7)', men: 3, skulls: 3, days: 7 },
  { id: 'wolf1', name: 'THE LONE WOLF\'S FIRST JOB, ONE SKULL (day 3)', men: 1, skulls: 1, days: 3 }
];
const CELLS = [];
['job1', 'job2', 'job3'].forEach(s => ['none', 'bb', 'two', 'three', 'shotgun'].forEach(k => ['auto', 'careful'].forEach(h => CELLS.push({ sc: s, kit: k, hand: h }))));
['wolfpipe', 'wolf'].forEach(k => ['auto', 'careful'].forEach(h => CELLS.push({ sc: 'wolf1', kit: k, hand: h })));
const CAREFUL = 50;   // the careful hand holds a shot under 50 in 100 (the old dial's 'a good shot', the bench's streak line)

function engine() {
  const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  const grab = id => { const m = html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)<\\/script>')); if (!m) throw new Error('no script ' + id); return m[1]; };
  let rules = grab('fight-rules');
  const splice = (anchor, repl) => {
    const n = rules.split(anchor).length - 1;
    if (n !== 1) throw new Error('THE FIGHT MOVED: anchor found ' + n + ' times: ' + anchor.slice(0, 60));
    rules = rules.replace(anchor, repl);
  };
  splice('    if (a.ammo !== null) a.ammo--;\n', '    if (a.ammo !== null) a.ammo--;\n    HOOK.shot(a, t);\n');
  splice('    return inRange(a, t);\n  }\n  function strike(a, t, forced) {',
    '    return inRange(a, t) && HOOK.careful(a, t, function () { return hitChance(a, t, s).chance; }, isRanged(a.weapon));\n  }\n  function strike(a, t, forced) {');
  const ctx = { console, Math, JSON, Date, Object, Array, String, Number, Error, HOOK: null,
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} } };
  vm.createContext(ctx);
  const data = grab('fight-data');
  vm.runInContext(data + ';this.DB=DB;this.DATA_FILES=DATA_FILES;this.setSeed=function(s){SEED=s>>>0;};', ctx);
  const slot = {}; data.replace(/DB\.(\w+) = a\[(\d+)\]/g, (m, k, i) => { slot[i] = k; return m; });
  ctx.DATA_FILES.forEach((u, i) => { if (!slot[i]) throw new Error('THE FIGHT MOVED: no DB slot for ' + u); ctx.DB[slot[i]] = J(path.join('slices', u)); });
  vm.runInContext(rules + ';this.FIGHT=FIGHT;', ctx);
  return ctx;
}

function cell(c, n) {
  const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB;
  const sc = SCENARIOS.find(s => s.id === c.sc), kit = KITS[c.kit], base = OURS.crew.value;
  const wrow = id => DB.weapons.rows.filter(r => r.id === id)[0];
  const T = { fights: 0, won: 0, rounds: 0, beats: 0, shots: 0, hits: 0, gunAtt: 0, points: 0, enemies: 0, downed: 0, held: 0, perFight: [], wonShots: 0, down: 0, dead: 0 };
  let shotsThis = 0, pointsThis = 0;
  ctx.HOOK = {
    shot: function (a) {
      if (a.side !== 'you' || !F.isRanged(a.weapon)) return;
      shotsThis++; pointsThis += POINTS[a.weapon.class] || 1;
    },
    careful: function (a, t, chance, ranged) {
      if (c.hand !== 'careful' || a.side !== 'you' || !ranged) return true;
      if (chance() >= CAREFUL) return true;
      T.held++; return false;
    }
  };
  const seed0 = 7800 + 100 * (SCENARIOS.indexOf(sc) + 1);
  for (let k = 0; k < n; k++) {
    ctx.setSeed(seed0 + k);
    shotsThis = 0; pointsThis = 0;
    const company = kit.jobs.map((job, i) => {
      const place = base[i % base.length];
      return { background: sc.men === 1 ? 'companion_2hand' : BGS[i], level: 1,
        gear: { main: ROWS[job], off: job === 'pipe' && place.jobs.indexOf('car_door') >= 0 ? ROWS.car_door : null, body: place.body, head: place.head } };
    });
    const count = jobCount(sc.men, 1, sc.skulls, 1);
    F.setup({ auto: true, formation: null, company: company, cap: 12, party: { count: count, days: sc.days, difficulty: 1, faction: 'brigands' } });
    let g = 0;
    while (!F.S.over && g < 40000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; }
    const S = F.S, ids = new Set(S.units.filter(u => u.side === 'you').map(u => u.id));
    const guns = new Set(S.units.filter(u => u.side === 'you' && F.isRanged(u.weapon)).map(u => u.id));
    T.fights++; T.enemies += S.units.length - ids.size; T.rounds += S.round;
    if (S.result === 'won') { T.won++; T.wonShots += shotsThis; }
    T.shots += shotsThis; T.points += pointsThis; T.perFight.push(shotsThis);
    let acted = false, open = false;
    S.log.forEach(e => {
      if (e.t === 'turn') { if (open) T.beats += acted ? 2 : 0.5; open = true; acted = false; }
      else if (e.t === 'step' || e.t === 'attack' || e.t === 'reload' || e.t === 'skill') acted = true;
      if ((e.t === 'down' || e.t === 'dead') && ids.has(e.id)) { T.down++; if (e.t === 'dead') T.dead++; }
      if ((e.t === 'down' || e.t === 'dead' || e.t === 'fled') && !ids.has(e.id)) T.downed++;
      if (e.t === 'attack' && guns.has(e.id) && !e.free) { T.gunAtt++; if (e.hit) T.hits++; }
    });
    if (open) T.beats += acted ? 2 : 0.5;
  }
  return T;
}

function felt(T) {
  const f = T.fights, r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100, pct = x => Math.round(100 * x);
  const s = T.perFight.slice().sort((a, b) => a - b), p90 = s[Math.min(s.length - 1, Math.floor(0.9 * s.length))];
  return { fights: f, won_in_100: pct(T.won / f), rounds_of_the_fight: r1(T.rounds / f), minutes_on_auto: r1(T.beats / f / 120),
    enemies: r1(T.enemies / f), shots_per_fight: r1(T.shots / f), shots_p90: p90, shots_per_won_fight: r1(T.wonShots / Math.max(1, T.won)),
    bb_points_per_fight: r1(T.points / f), shots_per_enemy_out: r2(T.shots / Math.max(1, T.downed)), gun_hits_in_100: T.gunAtt ? pct(T.hits / T.gunAtt) : null,
    your_men_down_per_fight: r2(T.down / f), your_men_dead_per_100: r1(100 * T.dead / f) };
}

if (process.argv[2] === '--cell') {
  const [, , , sc, kit, hand, n] = process.argv;
  process.stdout.write(JSON.stringify(felt(cell({ sc: sc, kit: kit, hand: hand }, Number(n)))));
  process.exit(0);
}
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const N = arg('--n', 300), t0 = Date.now(), table = {};
CELLS.forEach(c => { table[c.sc + '|' + c.kit + '|' + c.hand] = felt(cell(c, N)); process.stderr.write('.'); });
process.stderr.write('\n');
const cols = ['won_in_100', 'rounds_of_the_fight', 'enemies', 'shots_per_fight', 'shots_p90', 'bb_points_per_fight', 'shots_per_enemy_out', 'gun_hits_in_100', 'your_men_down_per_fight', 'your_men_dead_per_100'];
console.log('cell'.padEnd(26) + cols.map(c => c.split('_').map(w => w[0]).join('').padStart(7)).join(''));
Object.keys(table).forEach(k => console.log(k.padEnd(26) + cols.map(c => String(table[k][c]).padStart(7)).join('')));
console.log(CELLS.length + ' cells x ' + N + ' fights in ' + Math.round((Date.now() - t0) / 1000) + ' s');
if (process.argv.includes('--write')) {
  fs.writeFileSync(OUT, JSON.stringify({
    _readme: 'ECONOMY [the first bullets] 10/19 (rule 120(a); rule 38g research only). draft:true. NOTHING IN THE GAME READS THIS FILE. '
      + 'Every cell is ' + N + ' fights of the live fight\'s own rules (slices/BOHEMIA_FIGHT.html, headless, tools/bohemia_economy_first_bullets.js), '
      + 'both sides on AUTO, guns handed through the roster\'s gear, every shot of yours counted. careful = a shooter of yours holds a shot under '
      + CAREFUL + ' in 100. Page: records/BOHEMIA_ECONOMY_DAY_78_THE_FIRST_BULLETS_10_19_26.md',
    draft: true, schema: 1, fights_per_cell: N, careful_holds_under: CAREFUL, bb_points_per_shot: POINTS,
    kits: KITS, scenarios: SCENARIOS.map(s => Object.assign({ enemies_by_party_math: jobCount(s.men, 1, s.skulls, 1) }, s)), felt: table
  }, null, 1) + '\n');
  console.log('wrote ' + path.relative(ROOT, OUT));
}
