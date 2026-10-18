#!/usr/bin/env node
/* BOHEMIA THE NAMES MIX GATE (10/18/26, PEOPLE lane).
 * Row [the names mix] MORE-WHITE-NAMES-KEEP-IT-NATURAL, under the hold (rule 88:
 * a page is the ship). Paolo 9/21 on the names at your door: 'a little more
 * percentage of white people names and we're good, try to keep it natural'.
 *
 * The page is records/BOHEMIA_PEOPLE_THE_NAMES_MIX_10_18_26.md and its test
 * material is banks/BOHEMIA_THE_NAMES_MIX_10_18_26.json, draft:true, never read
 * by the game.
 *
 * PROVES:
 *   A  the bank is a draft bank; the heritage shares sum to 1 and sit within
 *      two points of the census the bank cites (33.4 / 35.6 / 14.4 / 12.5)
 *   B  NOTHING OF HIS IS DELETED: every given name and surname in the live
 *      engine pool is in exactly one of the bank's pools; no pool is empty
 *   C  THE MEASURED GAP, AS HISTORY (rewritten 10/18 when PEOPLE [the names
 *      wired in] wired the bank, as this line said to): the 9/22 draw, re-run
 *      on his names, drew given and surname independently, so more people's
 *      names read Hispanic than the county is Hispanic; the post's old hire
 *      names (frozen in this bank) read Hispanic 12 of 16; the engine keeps
 *      that draw only behind the roll, and the post's list is gone
 *   D  THE BANK FIXES IT: under the bank's rule the share of names that read
 *      Hispanic is within five points of the census, the white-heritage share
 *      within two, and the most common full name is under one percent
 *   E  nothing in engine/ or slices/ LOADS the bank at run time (the roller,
 *      engine/bohemia_names.js, cites it and carries its pools, held to it name
 *      for name by gates/the_names_wired_in_gate.js)
 *   F  the page exists, names the bank, carries the finding, the twenty
 *      sample names the gate prints, a ROUTED section, the [bb and [ah lines
 *
 *   node gates/the_names_mix_gate.js
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
function pct(x) { return (100 * x).toFixed(1) + '%'; }

var BANK = 'banks/BOHEMIA_THE_NAMES_MIX_10_18_26.json';
var PAGE = 'records/BOHEMIA_PEOPLE_THE_NAMES_MIX_10_18_26.md';
var bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
var engine = fs.readFileSync('engine/bohemia_people.js', 'utf8');
function arr(name) {
  var m = engine.match(new RegExp('var ' + name + ' = \\[([\\s\\S]*?)\\];'));
  var body = m[1].replace(/\/\*[\s\S]*?\*\//g, '');
  return (body.match(/'([^']+)'/g) || []).map(function (s) { return s.slice(1, -1); });
}
var GIVEN = arr('GIVEN'), SURNAME = arr('SURNAME');
/* the engine's own hash, copied so the measurement is the live draw */
var mix32 = (function () {
  var m = engine.match(/function mix32\(v\) \{([\s\S]*?)\n  \}/);
  if (!m) throw new Error('GATE BUG: the engine\'s mix32 moved; read it again.');
  return new Function('v', m[1]);
})();
function hashOf(key) {
  var h = 0;
  for (var i = 0; i < key.length; i++) h = (Math.imul(h, 31) + key.charCodeAt(i)) >>> 0;
  return h;
}
var N = 20000;

head('A  a draft bank on the census');
ok('draft is true', bank.draft === true);
ok('tuned is false', bank.tuned === false);
var HS = bank.heritage_share;
var sum = Object.keys(HS).reduce(function (a, k) { return a + HS[k]; }, 0);
ok('heritage shares sum to 1', Math.abs(sum - 1) < 1e-9, sum.toFixed(3));
var CENSUS = { hispanic: 0.334, white: 0.356, black: 0.144, asian: 0.125 };
Object.keys(CENSUS).forEach(function (k) {
  ok(k + ' share within two points of the census', Math.abs(HS[k] - CENSUS[k]) <= 0.02, pct(HS[k]) + ' vs ' + pct(CENSUS[k]));
  ok('the bank cites the census number for ' + k, bank.census.source.indexOf((CENSUS[k] * 100).toFixed(1) + '%') >= 0);
});
ok('the source is the Census Bureau', /U\.S\. Census Bureau/.test(bank.census.source) && /census\.gov/.test(bank.census.source));

head('B  nothing of his is deleted');
var PG = bank.pools.given, PS = bank.pools.surname;
function where(pools, n) { return Object.keys(pools).filter(function (k) { return pools[k].indexOf(n) >= 0; }); }
var lostG = GIVEN.filter(function (n) { return where(PG, n).length !== 1; });
var lostS = SURNAME.filter(function (n) { return where(PS, n).length !== 1; });
ok('every live given name is in exactly one pool', lostG.length === 0, GIVEN.length + ' names; ' + lostG.join(','));
ok('every live surname is in exactly one pool', lostS.length === 0, SURNAME.length + ' names; ' + lostS.join(','));
Object.keys(PG).forEach(function (k) { ok('given pool ' + k + ' is not empty', PG[k].length >= 8, String(PG[k].length)); });
Object.keys(PS).forEach(function (k) { ok('surname pool ' + k + ' is not empty', PS[k].length >= 8, String(PS[k].length)); });
ok('the stereotype flags are not in any pool', bank.the_post_names.stereotype_flags.every(function (n) {
  return where(PG, n).length === 0; }));

head('C  the measured gap (the live draw)');
var hisG = {}, hisS = {};
PG.hispanic.forEach(function (n) { hisG[n] = 1; }); PS.hispanic.forEach(function (n) { hisS[n] = 1; });
var liveHis = 0;
for (var i = 0; i < N; i++) {
  var h = hashOf('person:' + i), a = mix32(h), b = mix32(h ^ 0x9e3779b9);
  var g = GIVEN[a % GIVEN.length], s = SURNAME[b % SURNAME.length];
  if (hisG[g] || hisS[s]) liveHis++;
}
var liveShare = liveHis / N;
ok('the 9/22 draw made more names read Hispanic than the county is', liveShare > CENSUS.hispanic + 0.10, pct(liveShare) + ' of names vs ' + pct(CENSUS.hispanic) + ' of people');
ok('the engine keeps the 9/22 draw only behind the roll',
  /GIVEN\[a % GIVEN\.length\] \+ ' ' \+ SURNAME\[b % SURNAME\.length\]/.test(engine) &&
  /if \(N\) return N\.roll\(key, \{ sex: sex \}\)\.full;/.test(engine));
var post = fs.readFileSync('slices/BOHEMIA_SETTLEMENT_SCREEN.html', 'utf8');
var hire = bank.the_post_names.list;
var hireHis = hire.filter(function (n) { return bank.the_post_names.reads_hispanic.indexOf(n) >= 0; });
ok('the post\'s old hire names (frozen here) read Hispanic 12 of 16', hire.length === 16 && hireHis.length === 12,
  hireHis.length + ' of ' + hire.length + ' (' + pct(hireHis.length / Math.max(1, hire.length)) + ')');
ok('the post\'s fixed list is gone from the screen', !/var HIRE_NAMES\b/.test(post));

head('D  the bank fixes it');
function pick(pools, rule, her, u1, u2, all) {
  if (rule[her] === 'any') return all[u2 % all.length];
  var keys = Object.keys(rule[her]), acc = 0, x = (u1 % 10000) / 10000;
  for (var j = 0; j < keys.length; j++) { acc += rule[her][keys[j]]; if (x < acc || j === keys.length - 1) { var p = pools[keys[j]]; return p[u2 % p.length]; } }
}
var allG = [].concat.apply([], Object.keys(PG).map(function (k) { return PG[k]; }));
var allS = [].concat.apply([], Object.keys(PS).map(function (k) { return PS[k]; }));
var HK = Object.keys(HS);
function bankName(key) {
  var h = hashOf(key), r = [h, mix32(h), mix32(h ^ 0x9e3779b9), mix32(h ^ 0x85ebca6b), mix32(h ^ 0xc2b2ae35)];
  var x = (mix32(r[0] ^ 0x27d4eb2f) % 10000) / 10000, acc = 0, her = HK[HK.length - 1];
  /* the first stream picks the heritage; it is reused by nothing below */
  for (var j = 0; j < HK.length; j++) { acc += HS[HK[j]]; if (x < acc) { her = HK[j]; break; } }
  return { her: her, name: pick(PG, bank.given_rule, her, r[1], r[2], allG) + ' ' + pick(PS, bank.surname_rule, her, r[3], r[4], allS) };
}
var herCount = {}, bankHis = 0, seen = {}, top = 0;
for (i = 0; i < N; i++) {
  var bn = bankName('person:' + i);
  herCount[bn.her] = (herCount[bn.her] || 0) + 1;
  var parts = bn.name.split(' ');
  if (hisG[parts[0]] || hisS[parts[1]]) bankHis++;
  seen[bn.name] = (seen[bn.name] || 0) + 1; if (seen[bn.name] > top) top = seen[bn.name];
}
var bankShare = bankHis / N;
ok('under the bank the names that read Hispanic are within five points of the census', Math.abs(bankShare - CENSUS.hispanic) <= 0.05, pct(bankShare));
ok('the white-heritage share drawn is within two points of the census', Math.abs((herCount.white || 0) / N - CENSUS.white) <= 0.02, pct((herCount.white || 0) / N));
ok('no full name is one percent of the valley', top / N < 0.01, top + ' of ' + N);
var SAMPLES = [];
for (i = 0; i < 20; i++) SAMPLES.push(bankName('sample:' + i).name);
console.log('  twenty: ' + SAMPLES.join(', '));
console.log('  MEASURED: live ' + pct(liveShare) + ' read Hispanic; bank ' + pct(bankShare) + '; census ' + pct(CENSUS.hispanic));

head('E  nothing loads the bank at run time');
function anyReads(dir) {
  var LOAD = /(fetch|require|readFileSync|src=)\s*\(?\s*['"][^'"]*BOHEMIA_THE_NAMES_MIX/;
  return fs.readdirSync(dir).filter(function (f) { return /\.(js|html)$/.test(f); })
    .filter(function (f) { return LOAD.test(fs.readFileSync(path.join(dir, f), 'utf8')); });
}
var readers = anyReads('engine').concat(anyReads('slices'));
ok('nothing in engine/ or slices/ loads the bank', readers.length === 0, readers.join(','));
ok('the roller cites the bank as its source', fs.readFileSync('engine/bohemia_names.js', 'utf8').indexOf(path.basename(BANK)) >= 0);

head('F  the page');
var pageText = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : '';
ok('the page exists', pageText.length > 2000);
ok('the page names the bank', pageText.indexOf(path.basename(BANK)) >= 0);
ok('the page carries the finding that proves us wrong', /PROVES US WRONG/.test(pageText));
ok('the page lists the twenty sample names this gate draws', SAMPLES.every(function (n) { return pageText.indexOf(n) >= 0; }),
  SAMPLES.filter(function (n) { return pageText.indexOf(n) < 0; }).join(','));
ok('the page carries the live and bank shares', pageText.indexOf(pct(liveShare)) >= 0 && pageText.indexOf(pct(bankShare)) >= 0);
ok('the page has a ROUTED section', /## \d+\. ROUTED/.test(pageText));
ok('the page has its [bb names] and [ah] lines', /\[bb names\]/.test(pageText) && /\[ah\]/.test(pageText));

console.log('\n' + (fail ? 'THE NAMES MIX GATE: ' + fail + ' FAILED, ' + pass + ' ok'
  : 'THE NAMES MIX GATE: ' + pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
