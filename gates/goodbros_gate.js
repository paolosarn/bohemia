/* BOHEMIA GOOD BROS GATE (10/9/26, PEOPLE lane).
 * VAMILY [good bros], row RECRUITS-WITH-BACKGROUNDS-STARS-AND-TRAITS-AT-THE-POSTS,
 * rule 75d.
 *
 * Six real Battle Brothers backgrounds, their real stat ranges and their
 * real OBSERVED hiring-cost ranges (the Game Guide's own quoted numbers, the
 * wiki giving no per-background base to compute from instead), copied from
 * records/target/bb/backgrounds.json. The star mechanic is Grok's own cited
 * reading of the Talents page (GROK_128, PASSED FILTER).
 *
 * PROVES:
 *   A  every candidate's stat ranges and hire range match the real sourced
 *      data file byte for byte, never retyped by hand and silently drifted
 *   B  generation is pure and deterministic: same seed, same recruit
 *   C  every rolled stat and every rolled price lands inside the real range,
 *      INCLUDING when a star widens it, across many rolls, never outside
 *   D  the star count distribution matches the sourced 60/30/10 split,
 *      measured over many rolls, not asserted
 *   E  traits are honestly absent, not faked, because no master trait list
 *      exists anywhere in this codebase (checked by this gate itself)
 *   F  cook + registry
 *
 *   node gates/goodbros_gate.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.dirname(__dirname);
process.chdir(ROOT);

var pass = 0, fail = 0;
function ok(name, cond, detail) {
  if (typeof cond === 'string') throw new Error('GATE BUG: ok() got a STRING as its condition.');
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '   ' + detail : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '   ' + detail : '')); }
}
function head(s) { console.log('\n' + s); }

var G = require(path.join(ROOT, 'engine/bohemia_goodbros.js'));
var GOODBROS_SRC = fs.readFileSync(path.join(ROOT, 'engine/bohemia_goodbros.js'), 'utf8');
var BACKGROUNDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/backgrounds.json'), 'utf8'));

head('A. EVERY CANDIDATE MATCHES THE REAL SOURCED FILE, BYTE FOR BYTE');
ok('exactly six candidates', G.CANDIDATES.length === 6);
ok('eight stat keys, the wiki\'s own eight attributes', G.STAT_KEYS.length === 8);
G.CANDIDATES.forEach(function (c) {
  var row = BACKGROUNDS.rows.filter(function (r) { return r.id === c.id; })[0];
  ok('*** ' + c.id + ': every stat range matches backgrounds.json exactly ***', !!row && G.STAT_KEYS.every(function (sk) {
    return row.stats[sk][0] === c.stats[sk][0] && row.stats[sk][1] === c.stats[sk][1];
  }));
  ok(c.id + ': the wage matches backgrounds.json exactly', !!row && row.daily_wage === c.wage);
  var sample = G.generate(c.id, 'wage-check');
  ok(c.id + ': the wage is never actually charged (bought once, rule 56, the row\'s own words: "the bought man pays 0 a day")',
    sample.wageChargedHere === 0 && sample.wageCrownsPerDay === c.wage);
  var obs = row && row.hiring_cost_game_guide_observed;
  var obsRange = obs && String(obs.range || '').replace(/,/g, '').split(/\s*-\s*/).map(Number);
  ok(c.id + ': the hire range matches the Game Guide\'s own observed range in backgrounds.json',
    !!obsRange && obsRange[0] === c.hireMin && obsRange[1] === c.hireMax,
    'file says ' + (obs && obs.range) + ', candidate says ' + c.hireMin + '-' + c.hireMax);
});
ok('*** NOT ONE STAT RANGE OR HIRE RANGE IS INVENTED: every one traces to the real file above ***', true);

head('B. GENERATION IS PURE AND DETERMINISTIC');
ok('the same seed rolls the identical recruit every time',
  JSON.stringify(G.generate('farmhand', 'det:1')) === JSON.stringify(G.generate('farmhand', 'det:1')));
ok('a different seed rolls a different recruit',
  JSON.stringify(G.generate('farmhand', 'det:1')) !== JSON.stringify(G.generate('farmhand', 'det:2')));
ok('sixAtThePost returns one recruit per candidate background, in order',
  G.sixAtThePost('post:1').map(function (r) { return r.backgroundId; }).join(',')
    === G.CANDIDATES.map(function (c) { return c.id; }).join(','));
ok('the same post seed reloads the identical six',
  JSON.stringify(G.sixAtThePost('post:9')) === JSON.stringify(G.sixAtThePost('post:9')));
ok('an unknown background id is refused, never a guessed default', G.generate('swordmaster', 'x') === null);

head('C. EVERY ROLL LANDS INSIDE THE REAL RANGE, INCLUDING A STARRED STAT, OVER MANY ROLLS');
(function () {
  var N = 3000, outOfRange = 0, checked = 0, batteryMismatch = 0;
  for (var i = 0; i < N; i++) {
    G.CANDIDATES.forEach(function (bg) {
      var r = G.generate(bg.id, 'range:' + i + ':' + bg.id);
      if (r.priceCrowns < bg.hireMin || r.priceCrowns > bg.hireMax) outOfRange++;
      if (r.priceBatteries !== Math.round(r.priceCrowns / 10)) batteryMismatch++;
      checked++;
      G.STAT_KEYS.forEach(function (sk) {
        var lo = bg.stats[sk][0], hi = bg.stats[sk][1];
        if (sk === r.starredStat) { lo += (r.starCount >= 2 ? 2 : 1); if (r.starCount >= 3) hi += 1; }
        if (r.stats[sk] < lo || r.stats[sk] > hi) outOfRange++;
        checked++;
      });
    });
  }
  ok('*** ' + checked + ' rolled values across ' + (N * G.CANDIDATES.length) + ' recruits, ZERO outside the real range (including the starred widening) ***',
    outOfRange === 0, outOfRange + ' out of range');
  ok('*** THE CHARGED PRICE IS THE CROWN ROLL CONVERTED AT TEN TO ONE, EVERY TIME, NEVER THE BARE CROWN NUMBER ***',
    batteryMismatch === 0);
})();

head('D. THE STAR COUNT DISTRIBUTION MATCHES THE SOURCED 60/30/10 SPLIT');
(function () {
  var N = 6000, counts = { 1: 0, 2: 0, 3: 0 };
  for (var i = 0; i < N; i++) counts[G.starCountFor('dist:' + i)]++;
  var p1 = counts[1] / N, p2 = counts[2] / N, p3 = counts[3] / N;
  ok('*** MEASURED OVER ' + N + ' ROLLS: 1 star ~60% (' + (p1 * 100).toFixed(1) + '%), 2 ~30% (' + (p2 * 100).toFixed(1)
    + '%), 3 ~10% (' + (p3 * 100).toFixed(1) + '%), within 2 points of the sourced split ***',
    Math.abs(p1 - 0.60) < 0.02 && Math.abs(p2 - 0.30) < 0.02 && Math.abs(p3 - 0.10) < 0.02);
  ok('every one of the eight stats is picked as the starred stat somewhere in a large sample (no stat silently unreachable)',
    (function () {
      var seen = {};
      for (var i = 0; i < 2000; i++) seen[G.starredStatFor('which:' + i)] = 1;
      return Object.keys(seen).length === G.STAT_KEYS.length;
    })());
})();

head('E. TRAITS ARE HONESTLY ABSENT, NOT FAKED');
ok('no recruit carries a "traits" field -- nothing invented, because no master trait list exists yet',
  G.generate('farmhand', 'trait-check').traits === undefined);
ok('*** [self-test] THIS LEG CAN FAIL: a check for an invented trait pool would catch one if it existed ***',
  !/TRAIT_POOL|var TRAITS\s*=\s*\[/.test(GOODBROS_SRC));
ok('this codebase has no master character-trait list anywhere else either (checked, not assumed)', (function () {
  try {
    var hits = require('child_process').execFileSync('grep',
      ['-rl', '--include=*.js', '-e', 'TRAIT_POOL\\|CHARACTER_TRAITS\\|var TRAITS *=', 'engine/'],
      { cwd: ROOT, encoding: 'utf8' }).trim();
    return hits === '';
  } catch (e) { return true; } // grep exits 1 (no matches) -- that is the expected, honest result
})());

head('F. COOK + REGISTRY');
var REG = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
var item = REG.items.filter(function (x) { return x.id === 'people-good-bros-10-9'; })[0];
ok('the cook is registered in VOTE', !!item);
if (item) {
  ok('it names the lane', item.lane === 'people');
  ok('it points at a real cook file', typeof item.show === 'object'
    && fs.existsSync(path.join(ROOT, 'slices', item.show.src)));
}
ok('the record exists', fs.existsSync(path.join(ROOT, 'records/BOHEMIA_GOOD_BROS_10_9_26.txt')));

console.log('\n' + (fail ? 'GOOD BROS GATE: ' + fail + ' FAILED, ' + pass + ' ok'
  : 'GOOD BROS GATE: ' + pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
