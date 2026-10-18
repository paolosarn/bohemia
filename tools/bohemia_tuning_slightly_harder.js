#!/usr/bin/env node
// TUNING [slightly harder, measured] 10/18 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 117).
// Paolo 10/18, his YES on 'easier, measured' (78 wins in 100 at the rule 117 start, Battle Brothers' Veteran 46) with:
// 'make it just slightly harder than that.' The coordinator's note: a small step, not halfway, about 70 in 100, the player
// still mostly winning. This finds the levers that get there and measures them THE SAME WAY as last round: the live fight's
// own rules played headless by tools/bohemia_tuning_easier_measured.js (its --cell mode, a levers JSON laid over its BASE),
// the same four fights a player meets, 300 seeded fights a cell, both sides on AUTO, the four fights averaged.
//
//   node tools/bohemia_tuning_slightly_harder.js singles    each lever taken back alone, on top of the start
//   node tools/bohemia_tuning_slightly_harder.js combos     the candidates near 70
//   node tools/bohemia_tuning_slightly_harder.js table      prints every measured setting, the four fights averaged
//   --jobs 4   worker processes. Every cell is cached in the bank, so a phase that dies resumes where it stopped.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const BENCH = path.join(ROOT, 'tools/bohemia_tuning_easier_measured.js');
const BANK = path.join(ROOT, 'banks/BOHEMIA_TUNING_SLIGHTLY_HARDER_10_18_26.json');
const N = 300;
const SCEN = ['first', 'newcrew', 'grown', 'tough'];

/* THE START he said YES to (78 in 100): the bench's ALL, byte for byte (checked: the JSON cell replays the named 'start' cell) */
const STREAK = { from: 50, plus: 10 };
const START = { gains: true, hit: 5, streak: STREAK, pick: 0, nerve: 0.9, breath: 18, tiers: [25, 75], xp: -0.05 };
const on = o => Object.assign({}, START, o);
const PHASES = {
  singles: [
    { id: 'start', name: 'THE START he said YES to (every rule 117 lever)', L: START },
    { id: 'theirs3', name: 'their roll -3, not -5 (yours stays +5)', L: on({ hitThem: 3 }) },
    { id: 'theirs0', name: 'their roll back to Battle Brothers\' 0 (yours stays +5)', L: on({ hitThem: 0 }) },
    { id: 'yours3', name: 'your roll +3, not +5 (theirs stays -5)', L: on({ hit: 3, hitThem: 5 }) },
    { id: 'both3', name: 'your roll +3 and theirs -3', L: on({ hit: 3, hitThem: 3 }) },
    { id: 'count0925', name: 'the party 0.925, halfway from Beginner\'s 0.85 to Veteran\'s 1.0', L: on({ countMult: 0.925 }) },
    { id: 'count1', name: 'the party at Veteran\'s 1.0', L: on({ countMult: 1 }) },
    { id: 'nerve095', name: 'the enemy\'s nerve 0.95, not 0.9', L: on({ nerve: 0.95 }) },
    { id: 'nerve1', name: 'the enemy\'s nerve back to 1.0', L: on({ nerve: 1 }) },
    { id: 'breath16', name: 'your breath back 16 a turn, not 18', L: on({ breath: 16 }) },
    { id: 'breath15', name: 'your breath back to Battle Brothers\' 15', L: on({ breath: 15 }) },
    { id: 'nostreak', name: 'no bad-streak help', L: on({ streak: null }) },
    { id: 'tiersbb', name: 'the better crews at Battle Brothers\' days (20 and 60)', L: on({ tiers: [20, 60] }) }
  ],
  /* written after the singles: THEIR side only first (their roll, their count, their nerve), so the step is never 'you got worse' */
  combos: [
    { id: 'theirs_count', name: 'their roll back to 0 and the party at 1.0', L: on({ hitThem: 0, countMult: 1 }) },
    { id: 'their_side_bb', name: 'THEIR SIDE AT BATTLE BROTHERS\' VETERAN: their roll 0, the party 1.0, their nerve 1.0 (yours untouched)', L: on({ hitThem: 0, countMult: 1, nerve: 1 }) },
    { id: 'theirs_count_n095', name: 'their roll 0, the party 1.0, their nerve 0.95', L: on({ hitThem: 0, countMult: 1, nerve: 0.95 }) },
    { id: 'theirs3_count_n1', name: 'their roll -3, the party 1.0, their nerve 1.0', L: on({ hitThem: 3, countMult: 1, nerve: 1 }) },
    { id: 'both3_count', name: 'your roll +3 and theirs -3, the party 1.0 (both sides give a little)', L: on({ hit: 3, hitThem: 3, countMult: 1 }) },
    { id: 'their_side_breath16', name: 'their side at Veteran and your breath 16', L: on({ hitThem: 0, countMult: 1, nerve: 1, breath: 16 }) }
  ]
};

/* ---------- the cache ---------- */
const bank = fs.existsSync(BANK) ? JSON.parse(fs.readFileSync(BANK, 'utf8')) : { cells: {} };
bank.cells = bank.cells || {};
const key = (sc, L) => sc + '|' + JSON.stringify(L) + '|' + N;
function save() {
  bank._readme = 'TUNING [slightly harder, measured] 10/18 (rule 117; rule 38g research only). draft:true. NOTHING IN THE GAME READS THIS FILE. '
    + 'Every cell is ' + N + ' fights of the live fight\'s own rules played headless (tools/bohemia_tuning_easier_measured.js --cell, a levers JSON over its BASE), '
    + 'both sides on AUTO, seeded so every setting meets the same fights. Written by tools/bohemia_tuning_slightly_harder.js. '
    + 'Page: records/BOHEMIA_TUNING_SLIGHTLY_HARDER_MEASURED_10_18_26.md';
  bank.draft = true; bank.schema = 1; bank.fights_per_cell = N;
  fs.writeFileSync(BANK, JSON.stringify(bank, null, 1) + '\n');
}

/* ---------- what a player feels (the bench's own felt(), the same rounding) ---------- */
function felt(T) {
  const f = T.fights, r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100, pct = x => Math.round(100 * x);
  return {
    won_in_100: pct(T.won / f), won_with_nobody_down_in_100: pct(T.wonNoneDown / f), minutes_on_auto: r1(T.beats / f / 120),
    your_swings_land_in_100: pct(T.yourHit / Math.max(1, T.yourAtt)), their_swings_land_in_100: pct(T.theirHit / Math.max(1, T.theirAtt)),
    three_misses_in_a_row_on_a_good_shot_per_fight: r2(T.streak3 / f), your_men_struck_down_per_fight: r2(T.down / f),
    your_men_dead_per_100_fights: r1(100 * T.dead / f), your_men_who_ran_per_fight: r2(T.yourRan / f), their_men_who_ran_per_fight: r2(T.theirRan / f),
    wins_by_a_rout_in_100: pct(T.rout / f), fights_to_200_xp: r1(200 / Math.max(1e-9, T.xp / f)), enemies: r1(T.enemies / f)
  };
}
const COLS = ['won_in_100', 'won_with_nobody_down_in_100', 'your_men_struck_down_per_fight', 'your_men_dead_per_100_fights', 'your_men_who_ran_per_fight',
  'their_men_who_ran_per_fight', 'your_swings_land_in_100', 'their_swings_land_in_100', 'three_misses_in_a_row_on_a_good_shot_per_fight',
  'fights_to_200_xp', 'minutes_on_auto', 'enemies'];
const avg4 = s => { const o = {}; COLS.forEach(c => { o[c] = Math.round(10 * SCEN.reduce((a, sc) => a + s[sc][c], 0) / SCEN.length) / 10; }); return o; };
function measured(set) {
  const per = {};
  for (const sc of SCEN) { const T = bank.cells[key(sc, set.L)]; if (!T) return null; per[sc] = felt(T); }
  per.avg = avg4(per);
  return per;
}

/* ---------- run a phase ---------- */
function run(sets, jobs, done) {
  const work = [];
  sets.forEach(s => SCEN.forEach(sc => { if (!bank.cells[key(sc, s.L)]) work.push({ sc: sc, s: s }); }));
  /* the slow fight first, so the four workers finish together */
  const cost = { first: 4, tough: 2, grown: 2, newcrew: 1 };
  work.sort((a, b) => cost[b.sc] - cost[a.sc]);
  let next = 0, running = 0; const t0 = Date.now();
  process.stderr.write(work.length + ' cells to play\n');
  if (!work.length) return done();
  (function pump() {
    while (running < jobs && next < work.length) {
      const w = work[next++]; running++;
      cp.execFile(process.execPath, [BENCH, '--cell', w.sc, JSON.stringify(w.s.L), String(N)], { maxBuffer: 1 << 24 }, (err, out) => {
        running--;
        if (err) { console.error('cell failed', w.sc, w.s.id, err.message); process.exit(1); }
        bank.cells[key(w.sc, w.s.L)] = JSON.parse(out); save();
        process.stderr.write(w.s.id + '/' + w.sc + ' ' + Math.round((Date.now() - t0) / 1000) + 's\n');
        if (next >= work.length && running === 0) done(); else pump();
      });
    }
  })();
}

function table(sets) {
  const base = measured(PHASES.singles[0]);
  console.log('setting'.padEnd(11) + SCEN.concat(['AVG', 'dAVG', 'down', 'dead', 'yHit', 'tHit', 'tRan']).map(c => c.padStart(8)).join(''));
  for (const s of sets) {
    const m = measured(s); if (!m) { console.log(s.id.padEnd(11) + '  (not measured)'); continue; }
    console.log(s.id.padEnd(11) + SCEN.map(sc => String(m[sc].won_in_100).padStart(8)).join('') + String(m.avg.won_in_100).padStart(8)
      + String(base ? Math.round(10 * (m.avg.won_in_100 - base.avg.won_in_100)) / 10 : '').padStart(8)
      + [m.avg.your_men_struck_down_per_fight, m.avg.your_men_dead_per_100_fights, m.avg.your_swings_land_in_100, m.avg.their_swings_land_in_100,
        m.avg.their_men_who_ran_per_fight].map(x => String(x).padStart(8)).join(''));
  }
}

module.exports = { PHASES, START, SCEN, COLS, measured, bank, N };
if (require.main === module) {
  const cmd = process.argv[2] || 'table';
  const ai = process.argv.indexOf('--jobs'), jobs = ai > 0 ? Number(process.argv[ai + 1]) : 4;
  const all = PHASES.singles.concat(PHASES.combos);
  if (cmd === 'table') table(all);
  else if (PHASES[cmd]) run(cmd === 'singles' ? PHASES.singles : PHASES.singles.slice(0, 1).concat(PHASES[cmd]), jobs, () => table(all));
  else { console.error('singles | combos | table'); process.exit(2); }
}
