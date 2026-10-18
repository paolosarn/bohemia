#!/usr/bin/env node
/* BOHEMIA HEIRS BACKGROUNDS GATE (10/18/26, PEOPLE lane).
 * Row [heirs backgrounds] A-KILLER'S-KID-COMES-PREPARED, with DYNASTY [heirs]
 * (engine/bohemia_heirs.js, e9c96db4), under the hold (rule 88: a page is the ship).
 *
 * The page is records/BOHEMIA_PEOPLE_THE_HEIRS_BACKGROUNDS_10_18_26.md and its
 * test material is banks/BOHEMIA_HEIRS_BACKGROUNDS_10_18_26.json, draft:true,
 * never read by the game.
 *
 * PROVES:
 *   A  the bank is a draft bank: draft true, tuned false, four heir
 *      backgrounds with unique ids, each with when, carries, grew_up, a mouth
 *   B  EVERY BATTLE BROTHERS QUOTE IS ON ITS OWN WIKI PAGE, byte for byte,
 *      read out of the library's tarball at gate time; planted wrong numbers
 *      are the negative controls
 *   C  THE TRAIT CLASSES COVER BATTLE BROTHERS' WHOLE TRAITS PAGE: every
 *      trait the page lists is in exactly one class, no class names a trait
 *      the page does not list; EARNED and CHANCE pass nothing
 *   D  every one of the fifteen former trades (WAS_WORDS) has a follow
 *      share; every trade that keeps nothing has share 0; no share is over
 *      the Census's highest group (41 percent)
 *   E  THE MEASURED GAP IS STILL TRUE (goes red the day somebody builds the
 *      page into heirOf; then rewrite the page): every heir carries the
 *      parent's pre-crash trade; the trade's learned skill passes exactly as
 *      often to a dead man's kid as to a living teacher's; an earned trait
 *      passes by blood about half the time
 *   F  the hold holds: nothing in engine/ or slices/ reads the bank
 *   G  the page exists, names the bank, carries the finding, a ROUTED
 *      section, the [bb and [ah lines, the shared better-than line; no VOTE
 *      item for this held round
 *   H  every player-facing line has a speaker (the heir), the player never
 *      speaks, and nothing fires in the first minute
 *
 *   node gates/heirs_backgrounds_gate.js
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

var BANK = 'banks/BOHEMIA_HEIRS_BACKGROUNDS_10_18_26.json';
var PAGE = 'records/BOHEMIA_PEOPLE_THE_HEIRS_BACKGROUNDS_10_18_26.md';
var TAR = 'reference/library/grok/wiki/PAGES_ALL.tar.gz';

head('A  a draft bank, four heir backgrounds');
var bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
ok('draft is true', bank.draft === true);
ok('tuned is false', bank.tuned === false);
var BG = bank.backgrounds || [];
ok('four heir backgrounds', BG.length === 4, String(BG.length));
var ids = BG.map(function (b) { return b.id; });
ok('ids are unique', new Set(ids).size === BG.length, ids.join(','));
BG.forEach(function (b) {
  var missing = ['label', 'when', 'carries', 'grew_up', 'says'].filter(function (f) { return b[f] == null; });
  ok(b.id + ' carries every field', missing.length === 0, missing.join(','));
  ok(b.id + ' is itself draft', b.draft === true);
  ok(b.id + ' names a Battle Brothers shape or says why there is none', (b.bb_shape && bank.bb_shape[b.bb_shape]) || (b.bb_shape === null && !!b.bb_none));
});
ok('the trait shares are marked for TUNING', bank.trait_classes && bank.trait_classes.share_tuning === true);
ok('the trade shares are marked for TUNING', bank.trade_follows && bank.trade_follows.tuning === true);
ok('every real source names a link', ['trade_follows', 'traits_pass'].every(function (k) { return /https:\/\//.test((bank.real[k] || {}).source || ''); }));
ok('no heir has a was (born after the money died)', bank.was && bank.was.heir_was === null);

head('B  every Battle Brothers quote is on its own wiki page, read out of the tarball now');
var pages = {};
function page(name) {
  if (!pages[name]) pages[name] = cp.execFileSync('tar', ['-xOzf', TAR, name], { maxBuffer: 1 << 26 }).toString('utf8');
  return pages[name];
}
var shape = bank.bb_shape || {};
var quotes = 0;
Object.keys(shape).forEach(function (k) {
  var e = shape[k], txt = null;
  try { txt = page(e.page); } catch (err) { txt = null; }
  ok(k + ' names a page that is in the tarball', !!txt && txt.length > 50, e.page);
  if (!txt) return;
  (e.quotes || []).forEach(function (q) {
    quotes++;
    ok(k + ' quote on the page: ' + JSON.stringify(q.slice(0, 70)), txt.indexOf(q) >= 0);
  });
});
ok('at least a dozen quotes checked', quotes >= 12, String(quotes));
var al = page(shape.apprentice_learns.page);
ok('negative control: a planted "level 9 or higher" is NOT on the Apprentice Learns page', al.indexOf('needs to be level 9 or higher') === -1);
ok('negative control: the Apprentice Learns page never says a dead brother teaches', !/dead (brother|teacher)/i.test(al));

head('C  the trait classes cover Battle Brothers\' whole Traits page');
var tp = page(shape.traits.page);
var listed = (tp.match(/\{\{:[^}]+\}\}/g) || []).map(function (s) { return s.slice(3, -2); });
ok('the Traits page lists at least seventy traits', listed.length >= 70, String(listed.length));
var TC = bank.trait_classes, CLASSES = ['BODY', 'MIND', 'EARNED', 'CHANCE'];
var seen = {};
CLASSES.forEach(function (c) { (TC[c] || []).forEach(function (t) { seen[t] = (seen[t] || 0) + 1; }); });
var missing = listed.filter(function (t) { return !seen[t]; });
var twice = Object.keys(seen).filter(function (t) { return seen[t] > 1; });
var invented = Object.keys(seen).filter(function (t) { return listed.indexOf(t) === -1; });
ok('every listed trait is classed', missing.length === 0, missing.join(','));
ok('no trait is in two classes', twice.length === 0, twice.join(','));
ok('no class names a trait the page does not list', invented.length === 0, invented.join(','));
ok('EARNED and CHANCE pass nothing by blood', TC.share.EARNED === 0 && TC.share.CHANCE === 0);
ok('a body passes more often than a temperament, and neither reaches half',
  TC.share.BODY > TC.share.MIND && TC.share.BODY < 0.5 && TC.share.MIND > 0);
ok('death_leaves names an EARNED trait', TC.EARNED.indexOf(bank.death_leaves.beast) >= 0, bank.death_leaves.beast);

head('D  every former trade has a follow share');
var P = require(path.join(ROOT, 'engine/bohemia_people.js'));
var W = P.WAS_WORDS;
var by = bank.trade_follows.by_trade;
ok('fifteen former trades in WAS_WORDS', W.length === 15, String(W.length));
W.forEach(function (w) {
  var r = by[w.id];
  ok(w.id + ' has a share', !!r && typeof r.share === 'number' && !!r.why);
  if (!r) return;
  ok(w.id + (w.keeps ? ' (keeps something) is a real share' : ' (keeps nothing) is a dead trade at 0'),
    w.keeps ? (r.share > 0 && r.share <= 0.41) : r.share === 0, String(r.share));
});
ok('no share names a trade WAS_WORDS does not have', Object.keys(by).every(function (k) { return W.some(function (w) { return w.id === k; }); }));

head('E  the measured gap is still true (goes red the day the page is built; then rewrite the page)');
var H = require(path.join(ROOT, 'engine/bohemia_heirs.js'));
var n = 0, same = 0, taught = 0, nT = 0, kid = 0, nK = 0, differ = 0;
W.forEach(function (w) {
  for (var i = 0; i < 200; i++) {
    var m = { key: 'g' + w.id + i, name: 'Ana Ruiz', was: { id: w.id, keeps: w.keeps }, traits: [] };
    var hs = H.heirOf(m, 2, H.WHY.SURVIVED), hd = H.heirOf(m, 2, H.WHY.LONG_ENOUGH);
    [hs, hd].forEach(function (h) { n++; if (h.was && h.was.id === w.id) same++; });
    if (w.keeps) {
      var a = hs.traits.indexOf(w.keeps) >= 0, b = hd.traits.indexOf(w.keeps) >= 0;
      nT++; nK++; if (a) taught++; if (b) kid++; if (a !== b) differ++;
    }
  }
});
ok('every heir carries the parent\'s pre-crash trade (the page says none can)', same === n, same + ' of ' + n);
ok('a dead man\'s kid keeps the trade exactly as often as a living teacher\'s', differ === 0 && taught === kid, taught + '/' + nT + ' taught, ' + kid + '/' + nK + ' untaught');
ok('and that rate is about half, not always and not never', taught / nT > 0.4 && taught / nT < 0.6, (100 * taught / nT).toFixed(1) + '%');
var earned = 0, tries = 0;
for (var j = 0; j < 1000; j++) {
  var h = H.heirOf({ key: 'e' + j, traits: ['Huge', 'Brave', 'Addict', 'Fat'] }, 2, H.WHY.SURVIVED);
  ['Addict', 'Fat'].forEach(function (t) { tries++; if (h.traits.indexOf(t) >= 0) earned++; });
}
ok('an earned trait passes by blood about half the time (the page says never)', earned / tries > 0.4 && earned / tries < 0.6, earned + ' of ' + tries);
ok('the one flat share is still 0.5 for every kind of trait', H.ROWS.traitShare === 0.5);
var pageText = fs.readFileSync(PAGE, 'utf8');
ok('the page says the gap in its own words', /every heir carries the parent's pre-crash trade/i.test(pageText));

head('F  the hold holds');
function anyReads(dir) {
  return fs.readdirSync(dir).filter(function (f) { return /\.(js|html)$/.test(f); })
    .filter(function (f) { return fs.readFileSync(path.join(dir, f), 'utf8').indexOf('BOHEMIA_HEIRS_BACKGROUNDS') >= 0; });
}
var readers = anyReads('engine').concat(anyReads('slices'));
ok('nothing in engine/ or slices/ reads the bank', readers.length === 0, readers.join(','));

head('G  the page and the registry');
ok('the page exists', pageText.length > 2000);
ok('the page names the bank', pageText.indexOf(path.basename(BANK)) >= 0);
ok('the page carries the finding that proves us wrong', /PROVES US WRONG/.test(pageText));
ok('the page has a ROUTED section', /## \d+\. ROUTED/.test(pageText));
ok('the page has its [bb heirs] and [ah] lines', /\[bb heirs\]/.test(pageText) && /\[ah\]/.test(pageText));
ok('the page has a BETTER THAN BATTLE BROTHERS line', /BETTER THAN BATTLE BROTHERS/.test(pageText));
var better = fs.readFileSync('records/BOHEMIA_BETTER_THAN_BATTLE_BROTHERS_10_9_26.md', 'utf8');
ok('rule 80: the better-than line is in the shared record', /A KID IS TAUGHT OR TOLD/.test(better));
var REG = JSON.parse(fs.readFileSync('records/target/BOHEMIA_VOTE_REGISTRY.json', 'utf8'));
var items = Array.isArray(REG) ? REG : (REG.items || []);
ok('no PEOPLE VOTE item was registered for this held round', !items.some(function (it) {
  return it.lane === 'people' && /heirs[- ]backgrounds|killer'?s[- ]kid|taught[- ]or[- ]told/i.test(JSON.stringify(it)); }));

head('H  text comes from a mouth, and nothing fires first');
BG.forEach(function (b) {
  var keys = Object.keys(b.says || {});
  ok(b.id + ' every line is the heir speaking', keys.length >= 1 && keys.every(function (k) { return k === 'heir'; }), keys.join(','));
  ok(b.id + ' the line is not empty', keys.every(function (k) { return String(b.says[k]).length > 20; }));
});
ok('the bank says nothing fires in the first minute or before the first fight', Array.isArray(bank.never_before) && bank.never_before.some(function (x) { return /first minute/.test(x); }) && bank.never_before.some(function (x) { return /first fight/.test(x); }));

console.log('\n' + (fail ? 'HEIRS BACKGROUNDS GATE: ' + fail + ' FAILED, ' + pass + ' ok'
  : 'HEIRS BACKGROUNDS GATE: ' + pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
