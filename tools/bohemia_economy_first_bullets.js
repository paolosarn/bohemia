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
//   --n 300  fights per cell (default 300); --jobs 4  worker processes
//   --grid [--write] [--n 100]   ECONOMY [the grid's money]: companies 1, 3, 6, 12, 14 against a job the map sizes at 1, 2, 3
//              skulls and against 3, 6, 12, 20, 38; writes banks/BOHEMIA_ECONOMY_THE_GRIDS_MONEY_10_19_26.json
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
  const T = { fights: 0, won: 0, rounds: 0, beats: 0, shots: 0, hits: 0, gunAtt: 0, points: 0, enemies: 0, downed: 0, held: 0, perFight: [], roundsList: [], wonShots: 0, down: 0, dead: 0, unfinished: 0 };
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
    T.fights++; T.enemies += S.units.length - ids.size; T.rounds += S.round; T.roundsList.push(S.round);
    if (!S.over) T.unfinished++;
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
  const rs = T.roundsList.slice().sort((a, b) => a - b);
  return { fights: f, won_in_100: pct(T.won / f), unfinished: T.unfinished, rounds_median: rs[Math.floor(rs.length / 2)], rounds_of_the_fight: r1(T.rounds / f), minutes_on_auto: r1(T.beats / f / 120),
    enemies: r1(T.enemies / f), shots_per_fight: r1(T.shots / f), shots_p90: p90, shots_per_won_fight: r1(T.wonShots / Math.max(1, T.won)),
    bb_points_per_fight: r1(T.points / f), shots_per_enemy_out: r2(T.shots / Math.max(1, T.downed)), gun_hits_in_100: T.gunAtt ? pct(T.hits / T.gunAtt) : null,
    your_men_down_per_fight: r2(T.down / f), your_men_dead_per_100: r1(100 * T.dead / f) };
}

/* ---------- THE GRID'S MONEY (ECONOMY [the grid's money], rule 117(e)): TUNING's companies against TUNING's counts ----------
   the company as TUNING's whole grid builds it (tools/bohemia_tuning_the_whole_grid.js companyOf, the early stage): 1 = the Lone
   Wolf origin's man, 3 = A New Crew's three, else the twelve's places in order (each man his place's kit); the band as the map
   sizes a job (party_math at 1, 2 and 3 skulls) or a fixed count (3, 6, 12, 20, 38). Counted for the money: shots, every injury
   with its heal days (injuries.json heal_days, the middle), every man struck down (his laid-up days off the 'down' event), the
   dead. */
const GRID_N = [1, 3, 6, 12, 14], GRID_COUNTS = ['s1', 's2', 's3', 3, 6, 12, 20, 38];
function gridCompany(n) {
  const origins = J('records/target/bb/origins.json').origins, crew = OURS.crew.value;
  if (n === 1) return origins.filter(o => o.id === 'wolf')[0].men.map(m => ({ background: m.background, level: m.level }));
  if (n === 3) return origins.filter(o => o.id === 'newcrew')[0].men.map(m => ({ background: m.background, level: m.level }));
  return Array.from({ length: n }, (_, i) => ({ background: crew[i % crew.length].background }));
}
function gridCell(n, cnt, fights) {
  const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB;
  const heal = {}; DB.injuries.rows.forEach(r => { if (r.heal_days) heal[r.name] = (r.heal_days[0] + r.heal_days[r.heal_days.length - 1]) / 2; });
  const T = { fights: 0, won: 0, shots: 0, injuries: 0, healDays: 0, down: 0, laidDays: 0, dead: 0, enemies: 0, rounds: [], unfinished: 0, beats: 0 };
  let shotsThis = 0;
  ctx.HOOK = { shot: a => { if (a.side === 'you' && F.isRanged(a.weapon)) shotsThis++; }, careful: () => true };
  const lv = gridCompany(n).map(m => m.level || 1), meanLv = lv.reduce((a, b) => a + b, 0) / lv.length;
  const count = typeof cnt === 'string' ? jobCount(n, meanLv, Number(cnt.slice(1)), 1) : cnt;
  for (let k = 0; k < fights; k++) {
    ctx.setSeed(9100 + 1000 * GRID_N.indexOf(n) + 100 * GRID_COUNTS.indexOf(cnt) + k);
    shotsThis = 0;
    F.setup({ auto: true, formation: null, company: gridCompany(n), cap: 14, party: { count: count, days: 3, difficulty: 1, faction: 'brigands' } });
    let g = 0;
    while (!F.S.over && g < 60000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; }
    const S = F.S, ids = new Set(S.units.filter(u => u.side === 'you').map(u => u.id));
    T.fights++; T.enemies += S.units.length - ids.size; T.rounds.push(S.round); if (!S.over) T.unfinished++;
    if (S.result === 'won') T.won++;
    T.shots += shotsThis;
    let acted = false, open = false;
    S.log.forEach(e => {
      if (e.t === 'turn') { if (open) T.beats += acted ? 2 : 0.5; open = true; acted = false; }
      else if (e.t === 'step' || e.t === 'attack' || e.t === 'reload' || e.t === 'skill') acted = true;
      if (!ids.has(e.id)) return;
      if (e.t === 'injury') { T.injuries++; T.healDays += heal[e.name] || 0; }
      if (e.t === 'down') { T.down++; T.laidDays += e.days || 0; }
      if (e.t === 'dead') T.dead++;
    });
    if (open) T.beats += acted ? 2 : 0.5;
  }
  const f = T.fights, r2 = x => Math.round(x * 100) / 100, rs = T.rounds.sort((a, b) => a - b);
  return { company: n, count: cnt, enemies: count, fights: f, won_in_100: Math.round(100 * T.won / f), unfinished: T.unfinished,
    rounds_median: rs[Math.floor(rs.length / 2)], minutes_on_auto: Math.round(T.beats / f / 120 * 10) / 10, shots_per_fight: r2(T.shots / f),
    injuries_per_fight: r2(T.injuries / f), heal_days_per_fight: r2(T.healDays / f), down_per_fight: r2(T.down / f),
    laid_up_days_per_fight: r2(T.laidDays / f), dead_per_fight: r2(T.dead / f) };
}
if (process.argv[2] === '--gridcell') {
  const c = process.argv[4];
  process.stdout.write(JSON.stringify(gridCell(Number(process.argv[3]), /^s/.test(c) ? c : Number(c), Number(process.argv[5]))));
  process.exit(0);
}
if (process.argv[2] === '--cell') {
  const [, , , sc, kit, hand, n] = process.argv;
  process.stdout.write(JSON.stringify(felt(cell({ sc: sc, kit: kit, hand: hand }, Number(n)))));
  process.exit(0);
}
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const N = arg('--n', 300), JOBS = arg('--jobs', 4), t0 = Date.now(), table = {};
if (process.argv.includes('--grid')) {
  const GN = arg('--n', 100), work = [], out = {};
  GRID_N.forEach(n => GRID_COUNTS.forEach(c => work.push({ n: n, c: c })));
  let gi = 0, gr = 0;
  const gpump = () => {
    while (gr < JOBS && gi < work.length) {
      const w = work[gi++]; gr++;
      require('child_process').execFile(process.execPath, [__filename, '--gridcell', String(w.n), String(w.c), String(GN)], { maxBuffer: 1 << 24 }, (err, o) => {
        gr--;
        if (err) { console.error('cell failed', w, err.message); process.exit(1); }
        out[w.n + '|' + w.c] = JSON.parse(o); process.stderr.write('.');
        if (gi >= work.length && gr === 0) gdone(); else gpump();
      });
    }
  };
  const gdone = () => {
    process.stderr.write('\n');
    const cols = ['enemies', 'won_in_100', 'unfinished', 'rounds_median', 'minutes_on_auto', 'shots_per_fight', 'injuries_per_fight', 'heal_days_per_fight', 'down_per_fight', 'laid_up_days_per_fight', 'dead_per_fight'];
    console.log('cell'.padEnd(10) + cols.map(c => c.split('_').map(w => w[0]).join('').padStart(7)).join(''));
    work.forEach(w => { const k = w.n + '|' + w.c; console.log(k.padEnd(10) + cols.map(x => String(out[k][x]).padStart(7)).join('')); });
    console.log(work.length + ' cells x ' + GN + ' fights in ' + Math.round((Date.now() - t0) / 1000) + ' s');
    if (process.argv.includes('--write')) {
      const GOUT = path.join(ROOT, 'banks/BOHEMIA_ECONOMY_THE_GRIDS_MONEY_10_19_26.json');
      fs.writeFileSync(GOUT, JSON.stringify({ _readme: 'ECONOMY [the grid\'s money] 10/19 (rule 117(e); rule 38g research only). draft:true. NOTHING IN THE GAME READS THIS FILE. '
        + 'Every cell is ' + GN + ' fights of the live fight (tools/bohemia_economy_first_bullets.js --grid), both sides on AUTO, the company as TUNING\'s whole grid builds it '
        + '(early stage: each man his place\'s kit, today\'s rows), the band a job the map sizes at 1, 2, 3 skulls (s1, s2, s3) or a fixed count. Page: records/BOHEMIA_ECONOMY_DAY_79_THE_GRIDS_MONEY_10_19_26.md',
        draft: true, schema: 1, fights_per_cell: GN, companies: GRID_N, counts: GRID_COUNTS,
        felt: work.reduce((o, w) => { const k = w.n + '|' + w.c; o[k] = out[k]; return o; }, {}) }, null, 1) + '\n');
      console.log('wrote ' + path.relative(ROOT, GOUT));
    }
    process.exit(0);
  };
  gpump();
} else {
let next = 0, running = 0;
function pump(done) {
  while (running < JOBS && next < CELLS.length) {
    const c = CELLS[next++]; running++;
    require('child_process').execFile(process.execPath, [__filename, '--cell', c.sc, c.kit, c.hand, String(N)], { maxBuffer: 1 << 24 }, (err, out) => {
      running--;
      if (err) { console.error('cell failed', c, err.message); process.exit(1); }
      table[c.sc + '|' + c.kit + '|' + c.hand] = JSON.parse(out); process.stderr.write('.');
      if (next >= CELLS.length && running === 0) done(); else pump(done);
    });
  }
}
pump(finish);
function finish() {
process.stderr.write('\n');
const cols = ['won_in_100', 'unfinished', 'rounds_median', 'shots_per_fight', 'shots_p90', 'bb_points_per_fight', 'shots_per_enemy_out', 'gun_hits_in_100', 'your_men_down_per_fight', 'your_men_dead_per_100'];
console.log('cell'.padEnd(26) + cols.map(c => c.split('_').map(w => w[0]).join('').padStart(7)).join(''));
CELLS.forEach(c => { const k = c.sc + '|' + c.kit + '|' + c.hand; console.log(k.padEnd(26) + cols.map(x => String(table[k][x]).padStart(7)).join('')); });
console.log(CELLS.length + ' cells x ' + N + ' fights in ' + Math.round((Date.now() - t0) / 1000) + ' s');
if (process.argv.includes('--write')) {
  fs.writeFileSync(OUT, JSON.stringify({
    _readme: 'ECONOMY [the first bullets] 10/19 (rule 120(a); rule 38g research only). draft:true. NOTHING IN THE GAME READS THIS FILE. '
      + 'Every cell is ' + N + ' fights of the live fight\'s own rules (slices/BOHEMIA_FIGHT.html, headless, tools/bohemia_economy_first_bullets.js), '
      + 'both sides on AUTO, guns handed through the roster\'s gear, every shot of yours counted. careful = a shooter of yours holds a shot under '
      + CAREFUL + ' in 100. Page: records/BOHEMIA_ECONOMY_DAY_78_THE_FIRST_BULLETS_10_19_26.md',
    draft: true, schema: 1, fights_per_cell: N, careful_holds_under: CAREFUL, bb_points_per_shot: POINTS,
    kits: KITS, scenarios: SCENARIOS.map(s => Object.assign({ enemies_by_party_math: jobCount(s.men, 1, s.skulls, 1) }, s)),
    felt: CELLS.reduce((o, c) => { const k = c.sc + '|' + c.kit + '|' + c.hand; o[k] = table[k]; return o; }, {})
  }, null, 1) + '\n');
  console.log('wrote ' + path.relative(ROOT, OUT));
}
}
}
