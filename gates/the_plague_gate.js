#!/usr/bin/env node
/* BOHEMIA THE PLAGUE GATE (10/18/26, PEOPLE lane).
 * Row [the plague], rule 42 round two: a BEAST WITH NO BODY, researched then
 * drafted as a row, under the hold (rule 88: a page is the ship).
 *
 * The page is records/BOHEMIA_PEOPLE_THE_PLAGUE_A_BEAST_WITH_NO_BODY_10_18_26.md
 * and its test material is banks/BOHEMIA_THE_PLAGUE_10_18_26.json, draft:true,
 * never read by the game.
 *
 * PROVES:
 *   A  the bank is a draft bank: draft true, tuned false, four sicknesses
 *      with unique ids, each with a real model, a verb, days, a death roll
 *      marked for TUNING, marks, a trait, places and a mouth
 *   B  EVERY BATTLE BROTHERS QUOTE IS ON ITS OWN WIKI PAGE, byte for byte:
 *      each bb_shape entry names a page in the library's tarball and the
 *      page is read out of the tarball at gate time; a planted wrong number
 *      is the negative control
 *   C  every mark is a real permanent row of records/target/bb/injuries.json,
 *      and the Sick and Infected Wound rows exist as temporary ones (the
 *      shape the page says we already hold)
 *   D  every settlement trait named exists in settlement_traits.json; every
 *      place named is one of the 26 in the who-lives-where bank
 *   E  THE MEASURED GAP IS STILL TRUE: the live sickness trait has no cause
 *      field, and no engine file writes injury id 'sick' on a person; the
 *      moment somebody builds either, this leg goes red and the page has to
 *      be rewritten
 *   F  the hold holds: nothing in engine/ or slices/ reads the bank
 *   G  the page exists, names the bank, carries the finding, a ROUTED
 *      section, the [bb and [ah lines; the registry carries no VOTE item
 *      for this round (a held lane registers no sheet, rule 88)
 *   H  every player-facing line has a speaker (rule 19c) and the bank says
 *      nothing fires before the first minute or the first fight (rule 32a)
 *
 *   node gates/the_plague_gate.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var ROOT = path.dirname(__dirname);
process.chdir(ROOT);

var pass = 0, fail = 0;
function ok(name, cond, detail) {
  if (typeof cond === 'string') throw new Error('GATE BUG: ok() got a STRING as its condition.');
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '   ' + detail : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '   ' + detail : '')); }
}
function head(s) { console.log('\n' + s); }

var BANK = 'banks/BOHEMIA_THE_PLAGUE_10_18_26.json';
var PAGE = 'records/BOHEMIA_PEOPLE_THE_PLAGUE_A_BEAST_WITH_NO_BODY_10_18_26.md';
var TAR = 'reference/library/grok/wiki/PAGES_ALL.tar.gz';
var PLACES_BANK = 'banks/BOHEMIA_WHO_LIVES_WHERE_10_17_26.json';

head('A  a draft bank, four sicknesses');
var bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
ok('draft is true', bank.draft === true);
ok('tuned is false', bank.tuned === false);
var S = bank.sicknesses || [];
ok('four sicknesses', S.length === 4, String(S.length));
var ids = S.map(function (s) { return s.id; });
ok('ids are unique', new Set(ids).size === S.length, ids.join(','));
var FIELDS = ['real', 'our_skin', 'spreads', 'the_verb', 'chance', 'laid_up_days', 'death_roll', 'marks', 'district', 'places', 'cure_start', 'first_appears', 'says'];
S.forEach(function (s) {
  var missing = FIELDS.filter(function (f) { return s[f] == null; });
  ok(s.id + ' carries every field', missing.length === 0, missing.join(','));
  ok(s.id + ' is itself draft', s.draft === true);
  ok(s.id + ' death roll is marked for TUNING', s.death_roll && s.death_roll.tuning === true);
  ok(s.id + ' laid-up days are marked for TUNING', s.laid_up_days && s.laid_up_days.tuning === true);
  ok(s.id + ' chance names its wiki page', s.chance && /^bb_all\//.test(s.chance.source || ''));
  ok(s.id + ' names a real model with numbers', s.real && Array.isArray(s.real.numbers) && s.real.numbers.length >= 1);
  ok(s.id + ' spreads line never says rumour', !/rumour/i.test(s.spreads || ''));
});

head('B  every Battle Brothers quote is on its own wiki page, read out of the tarball now');
var pages = {};
function page(name) {
  if (!pages[name]) pages[name] = cp.execFileSync('tar', ['-xOzf', TAR, name], { maxBuffer: 1 << 26 }).toString('utf8');
  return pages[name];
}
var shape = bank.bb_shape || {};
var shapeKeys = Object.keys(shape);
ok('the bank carries Battle Brothers shapes', shapeKeys.length >= 5, String(shapeKeys.length));
var quotes = 0;
shapeKeys.forEach(function (k) {
  var e = shape[k], txt = null;
  try { txt = page(e.page); } catch (err) { txt = null; }
  ok(k + ' names a page that is in the tarball', !!txt && txt.length > 50, e.page);
  if (!txt) return;
  (e.quotes || []).forEach(function (q) {
    quotes++;
    ok(k + ' quote on the page: ' + JSON.stringify(q), txt.indexOf(q) >= 0);
  });
});
ok('at least a dozen quotes checked', quotes >= 12, String(quotes));
var ctrl = page(shape.sickness_situation.page);
ok('negative control: a planted +999% is NOT on the Sickness page', ctrl.indexOf('+999%') === -1);
ok('negative control: the Sickness page does not say the sickness spreads between brothers', !/person to person|brother to brother/i.test(ctrl));
S.forEach(function (s) {
  var p = page(s.chance.source);
  ok(s.id + "'s chance formula is on its page", p.indexOf('80 − hitpoints') >= 0 && p.indexOf('20% less likely') >= 0);
});

head('C  the marks are real rows');
var INJ = JSON.parse(fs.readFileSync('records/target/bb/injuries.json', 'utf8')).rows;
var perm = {}; INJ.filter(function (r) { return r.kind === 'permanent'; }).forEach(function (r) { perm[r.id] = r; });
var temp = {}; INJ.filter(function (r) { return r.kind === 'temporary'; }).forEach(function (r) { temp[r.id] = r; });
S.forEach(function (s) {
  var bad = s.marks.filter(function (m) { return !perm[m]; });
  ok(s.id + ' marks are permanent rows of injuries.json', s.marks.length >= 1 && bad.length === 0, bad.join(','));
});
ok('the Sick row exists as a temporary injury', !!temp.sick && temp.sick.heal_days && temp.sick.heal_days[0] === 1 && temp.sick.heal_days[1] === 3);
ok('the Sick row is the wiki\'s: −25% levelable, −2 vision', !!temp.sick && temp.sick.effects && temp.sick.effects.all_levelable_attributes_pct === -25 && temp.sick.effects.vision === -2);
ok('the Infected Wound row exists as a temporary injury', !!temp.infected_wound && temp.infected_wound.heal_days[0] === 3 && temp.infected_wound.heal_days[1] === 4);

head('D  the traits and the places are real');
var TRAITS = JSON.parse(fs.readFileSync('records/target/settlement_traits.json', 'utf8'));
var traitIds = {}; (TRAITS.traits || []).forEach(function (t) { traitIds[t.id] = t; });
var PL = JSON.parse(fs.readFileSync(PLACES_BANK, 'utf8'));
var placeIds = {}; (PL.places || []).forEach(function (p) { placeIds[p.id] = p; });
ok('the who-lives-where bank still has 26 places', Object.keys(placeIds).length === 26, String(Object.keys(placeIds).length));
S.forEach(function (s) {
  ok(s.id + ' names a trait that exists', !!traitIds[s.district.trait], s.district.trait);
  var bad = s.places.filter(function (p) { return !placeIds[p]; });
  ok(s.id + ' places are among the 26', s.places.length >= 3 && bad.length === 0, bad.join(','));
});
var allPlaces = {}; S.forEach(function (s) { s.places.forEach(function (p) { allPlaces[p] = 1; }); });
ok('the four together touch at least twelve of the 26 places', Object.keys(allPlaces).length >= 12, String(Object.keys(allPlaces).length));

head('E  the measured gap is still true (goes red the day somebody builds it; then rewrite the page)');
var sick = traitIds.sickness;
var CAUSE_KEYS = ['from', 'cause', 'beast', 'trigger', 'source_beast', 'year', 'crowd', 'works'];
var causeKeys = sick ? CAUSE_KEYS.filter(function (k) { return k in sick; }) : [];
ok('the live sickness trait carries NO cause field', !!sick && causeKeys.length === 0, causeKeys.join(','));
ok('the live trait is rolled by chance and week alone', TRAITS.roll && typeof TRAITS.roll.chance_any === 'number' && typeof TRAITS.roll.period_days === 'number' && !('causes' in TRAITS.roll));
/* RUN TWO 10/18 (ECONOMY day 71) built the numbers half: the live trait now carries the card's medicine +200% and recruits -25%;
   the cause half (no cause field, rolled by chance) is still the gap */
ok("the live numbers are the card's now (medicine x3, recruits x0.75, no blanket price)", !!sick && sick.medicine_buy_mult === 3 && sick.recruits_mult === 0.75 && !('price_mult' in sick));
function engineFilesWriting(re) {
  return fs.readdirSync('engine').filter(function (f) { return /\.js$/.test(f); })
    .filter(function (f) {
      var src = fs.readFileSync(path.join('engine', f), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/mg, '');
      return re.test(src);
    });
}
var writers = engineFilesWriting(/['"]sick['"]/);
ok("no engine file writes injury id 'sick' on a person", writers.length === 0, writers.join(','));
var sickFact = engineFilesWriting(/sickFact\s*\(/);
ok('no engine file builds a sickFact yet (the routed row)', sickFact.length === 0, sickFact.join(','));
ok('the page says the gap in its own words', /no cause field/i.test(fs.readFileSync(PAGE, 'utf8')));

head('F  the hold holds');
function anyReads(dir) {
  return fs.readdirSync(dir).filter(function (f) { return /\.(js|html)$/.test(f); })
    .filter(function (f) { return fs.readFileSync(path.join(dir, f), 'utf8').indexOf('BOHEMIA_THE_PLAGUE') >= 0; });
}
var readers = anyReads('engine').concat(anyReads('slices'));
ok('nothing in engine/ or slices/ reads the bank', readers.length === 0, readers.join(','));

head('G  the page and the registry');
var pageText = fs.readFileSync(PAGE, 'utf8');
ok('the page exists', pageText.length > 2000);
ok('the page names the bank', pageText.indexOf(path.basename(BANK)) >= 0);
ok('the page carries the finding that proves us wrong', /PROVES US WRONG/.test(pageText));
ok('the page has a ROUTED section', /## 8\. ROUTED/.test(pageText));
ok('the page has its [bb school] and [analog horror] lines', /\[bb the plague\]/.test(pageText) && /\[ah\]/.test(pageText));
ok('the page has a BETTER THAN BATTLE BROTHERS line', /BETTER THAN BATTLE BROTHERS/.test(pageText));
var better = fs.readFileSync('records/BOHEMIA_BETTER_THAN_BATTLE_BROTHERS_10_9_26.md', 'utf8');
ok('rule 80: the better-than line is in the shared record', /\(PEOPLE, 10\/18\)/.test(better));
var REG = JSON.parse(fs.readFileSync('records/target/BOHEMIA_VOTE_REGISTRY.json', 'utf8'));
var items = Array.isArray(REG) ? REG : (REG.items || []);
ok('no VOTE item was registered for this held round', !items.some(function (it) {
  return /beast[- ]with[- ]no[- ]body|the[- ]thaw|people.*the[- ]plague/i.test(JSON.stringify(it)); }));

head('H  text comes from a mouth, and nothing fires first');
var SPEAKERS = ['clinic', 'keeper', 'board'];
S.forEach(function (s) {
  var keys = Object.keys(s.says || {});
  var badKey = keys.filter(function (k) { return SPEAKERS.indexOf(k) === -1; });
  ok(s.id + ' every line has a speaker from the place', keys.length >= 3 && badKey.length === 0, badKey.join(','));
  ok(s.id + ' no line is the player speaking', !keys.some(function (k) { return /player|you_say/i.test(k); }));
  ok(s.id + ' first_appears names a trigger, never a date', !!s.first_appears && !!s.first_appears.trigger && /never a date|never|weather/i.test(s.first_appears.clock || ''));
});
ok('the bank says nothing fires in the first minute or before the first fight', Array.isArray(bank.never_before) && bank.never_before.some(function (x) { return /first minute/.test(x); }) && bank.never_before.some(function (x) { return /first fight/.test(x); }));

console.log('\n' + (fail ? 'THE PLAGUE GATE: ' + fail + ' FAILED, ' + pass + ' ok'
  : 'THE PLAGUE GATE: ' + pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
