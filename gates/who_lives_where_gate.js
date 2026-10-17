#!/usr/bin/env node
/* BOHEMIA WHO LIVES WHERE GATE (10/17/26, PEOPLE lane).
 * Rule 110's swing for a held lane (rule 88, rule 110e): a PAGE, who lives
 * where across the region's places, backgrounds by place.
 *
 * The page is records/BOHEMIA_PEOPLE_WHO_LIVES_WHERE_THE_REGION_10_17_26.md
 * and its test material is banks/BOHEMIA_WHO_LIVES_WHERE_10_17_26.json,
 * draft:true, never read by the game (the hold).
 *
 * PROVES:
 *   A  the bank is a draft bank: draft true, tuned false, 26 places,
 *      14 in the valley and 12 out in the region
 *   B  the 14 valley places ARE the 14 seats bohemia_towns.derive() hands
 *      out on the shipped seed, and the 12 region places ARE the 12 TOWNS in
 *      slices/bohemia_region.js, by name, neither list typed from memory
 *   C  every background id in every roll, tilt and skin is a real row of
 *      records/target/bb/backgrounds.json (the page spells one id its own
 *      way, kings_guard, and that alias is the only one allowed)
 *   D  EVERY PERCENT AND EVERY +n IS ON THE WIKI PAGE, byte for byte: the
 *      Sources page is read straight out of the library's tarball at gate
 *      time and each number is found inside its own background's block, in
 *      the cell the bank says it came from
 *   E  THE MEASURED GAP IS STILL TRUE: engine/bohemia_goodbros.js offers the
 *      same six men at every post; at every one of the 26 places at least
 *      one of those six has NO chance at all by Battle Brothers' own book,
 *      and the page says that number, so the moment somebody makes the post
 *      place-aware this leg goes red and the page has to be rewritten
 *   F  the hold holds: nothing in engine/ or slices/ reads the bank
 *   G  the page exists and names the bank; the registry carries no VOTE
 *      item for this round (a held lane registers no sheet, rule 88)
 *
 *   node gates/who_lives_where_gate.js
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

var BANK = 'banks/BOHEMIA_WHO_LIVES_WHERE_10_17_26.json';
var PAGE = 'records/BOHEMIA_PEOPLE_WHO_LIVES_WHERE_THE_REGION_10_17_26.md';
var TAR = 'reference/library/grok/wiki/PAGES_ALL.tar.gz';
var SOURCES = 'bb_all/0370_Character Backgrounds_Sources.txt';

var B = JSON.parse(fs.readFileSync(BANK, 'utf8'));

head('A  a draft bank, 26 places');
ok('draft:true', B.draft === true);
ok('tuned:false', B.tuned === false);
ok('26 places', B.places.length === 26, String(B.places.length));
ok('14 valley + 12 region', B.places.filter(function (p) { return p.where === 'valley'; }).length === 14
  && B.places.filter(function (p) { return p.where === 'region'; }).length === 12);
var CLASSES = ['City', 'Medium Village', 'Small Village', 'Citadel', 'Stone Keep', 'Wooden Keep'];
var TERRAINS = ['Coastal', 'Forest', 'Plains', 'Snow', 'Steppe', 'Swamp', 'Tundra', 'Mountain'];
ok('every place names a real Battle Brothers class and terrain', B.places.every(function (p) {
  return CLASSES.indexOf(p.bb_class) >= 0 && TERRAINS.indexOf(p.bb_terrain) >= 0; }));

head('B  the places are the game\'s own places, not a typed list');
var R = function (p) { return require(path.join(ROOT, p)); };
var T = R('engine/bohemia_towns.js'), OM = R('engine/bohemia_overmap.js'), CE = R('engine/bohemia_cityedit.js');
var GRAPH = JSON.parse(fs.readFileSync('engine/BOHEMIA_faction_graph.json', 'utf8'));
var m = OM.buildOvermap(1337);
var seats = T.derive(GRAPH, T.districtsOf(m, CE.cat), 1) || [];
var seatIds = seats.map(function (s) { return String(s.faction).toLowerCase(); }).sort();
var valleyIds = B.places.filter(function (p) { return p.where === 'valley'; }).map(function (p) { return p.id; }).sort();
ok('the 14 valley places are the 14 derived seats, by name', JSON.stringify(seatIds) === JSON.stringify(valleyIds),
  seatIds.join(',') + ' vs ' + valleyIds.join(','));
var tierOf = {}; seats.forEach(function (s) { tierOf[String(s.faction).toLowerCase()] = s.tier; });
ok('each valley place carries the seat\'s own tier', B.places.filter(function (p) { return p.where === 'valley'; })
  .every(function (p) { return tierOf[p.id] === p.tier; }));
var REGION = fs.readFileSync('slices/bohemia_region.js', 'utf8');
var towns = []; REGION.replace(/\['([A-Z ]+)',\s*-?\d+,\s*-?\d+,\s*'(\w+)'\]/g, function (_, n, t) { towns.push([n, t]); return _; });
var regionNames = B.places.filter(function (p) { return p.where === 'region'; }).map(function (p) { return p.name; }).sort();
ok('the 12 region places are the region file\'s 12 TOWNS, by name', towns.length === 12
  && JSON.stringify(towns.map(function (t) { return t[0]; }).sort()) === JSON.stringify(regionNames));
var regionTier = {}; towns.forEach(function (t) { regionTier[t[0]] = t[1]; });
ok('each region place carries the region file\'s own tier', B.places.filter(function (p) { return p.where === 'region'; })
  .every(function (p) { return regionTier[p.name] === p.tier; }));

head('C  every background is a real row of backgrounds.json');
var BG = JSON.parse(fs.readFileSync('records/target/bb/backgrounds.json', 'utf8'));
var rowIds = {}; BG.rows.forEach(function (r) { rowIds[r.id] = true; });
var ALIAS = { kings_guard: 'king_s_guard' };
function real(id) { return rowIds[id] === true || rowIds[ALIAS[id]] === true; }
var used = {};
B.places.forEach(function (p) {
  p.base_roll.forEach(function (r) { used[r.id] = true; });
  p.tilts.forEach(function (r) { used[r.id] = true; });
});
var unknown = Object.keys(used).filter(function (id) { return !real(id); });
ok('every rolled or tilted id is a real row', unknown.length === 0, unknown.join(','));
var skinIds = Object.keys(B.skin).filter(function (k) { return k !== '_about'; });
ok('every skin is a real row', skinIds.every(real), skinIds.filter(function (k) { return !real(k); }).join(','));
ok('every rolled or tilted id has a skin', Object.keys(used).every(function (id) { return !!B.skin[id]; }));
ok('a skin with no hire row is never rolled anywhere', skinIds.filter(function (k) { return B.skin[k].hire === false; })
  .every(function (k) { return !used[k]; }));

head('D  every number is on the wiki page, read out of the tarball now');
var page = cp.execFileSync('tar', ['-xOzf', TAR, SOURCES], { maxBuffer: 1 << 26 }).toString('utf8');
ok('the Sources page is in the library', page.length > 20000, page.length + ' bytes');
var blocks = {};
page.split(/\n\|\s*style="text-align: center;"\s*id="/).slice(1).forEach(function (b) {
  var id = b.split('"', 1)[0]; blocks[id] = b.split('\n|-')[0];
});
ok('the page carries 60 backgrounds', Object.keys(blocks).length === 60, String(Object.keys(blocks).length));
function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function pctRe(pct) {
  var s = String(pct); var i = s.indexOf('.'); var whole = i < 0 ? s : s.slice(0, i); var frac = i < 0 ? '' : s.slice(i + 1);
  return whole + '[.,]' + (frac || '0') + '0?%';
}
var checked = 0, missing = [];
B.places.forEach(function (p) {
  p.base_roll.forEach(function (r) {
    var cell = r.cell.split(' / ')[1];
    var re = new RegExp('- ' + esc(cell) + ' \\(~?' + pctRe(r.pct) + '\\)');
    checked++;
    if (!blocks[r.id] || !re.test(blocks[r.id])) missing.push(p.id + ':' + r.id + ':' + cell + ':' + r.pct);
  });
  p.tilts.forEach(function (r) {
    var re = new RegExp('- ' + esc(r.from) + ' \\(\\+' + r.plus + '\\)');
    checked++;
    if (!blocks[r.id] || !re.test(blocks[r.id])) missing.push(p.id + ':' + r.id + ':' + r.from + ':+' + r.plus);
  });
});
ok('every percent and every +n is in its own background\'s block on the page', missing.length === 0,
  checked + ' checked' + (missing.length ? ', missing ' + missing.slice(0, 6).join(' ') : ''));
ok('that was more than four hundred numbers, not a handful', checked > 400, String(checked));
// a planted wrong number is caught
var planted = new RegExp('- Steppe City \\(~?' + pctRe(99.9) + '\\)');
ok('negative control: a planted 99.9% is NOT on the page', !planted.test(blocks.militia));

head('E  the measured gap: the six at every post, against the book');
var G = R('engine/bohemia_goodbros.js');
var six = G.CANDIDATES.map(function (c) { return c.id; });
ok('the post still offers six men everywhere', six.length === 6, six.join(','));
var gapPlaces = 0, allSix = 0;
B.places.forEach(function (p) {
  var has = {};
  p.base_roll.forEach(function (r) { has[r.id] = true; });
  p.tilts.forEach(function (r) { has[r.id] = true; });
  var zero = six.filter(function (id) { return !has[id]; });
  if (zero.length) gapPlaces++;
  if (zero.length === 6) allSix++;
});
console.log('    [measured] ' + gapPlaces + ' of ' + B.places.length + ' places offer at least one man the book gives no chance; '
  + allSix + ' place(s) offer six such men');
ok('the gap is real today (the page is written against it; a place-aware post turns this red on purpose)', gapPlaces > 0);
var pageText = fs.readFileSync(PAGE, 'utf8');
ok('the page says the measured number', pageText.indexOf(gapPlaces + ' of 26') >= 0, gapPlaces + ' of 26');

head('F  the hold holds');
function anyReads(dir) {
  return fs.readdirSync(dir).filter(function (f) { return /\.(js|html)$/.test(f); })
    .filter(function (f) { return fs.readFileSync(path.join(dir, f), 'utf8').indexOf('BOHEMIA_WHO_LIVES_WHERE') >= 0; });
}
var readers = anyReads('engine').concat(anyReads('slices'));
ok('nothing in engine/ or slices/ reads the bank', readers.length === 0, readers.join(','));

head('G  the page and the registry');
ok('the page exists', fs.existsSync(PAGE));
ok('the page names the bank', pageText.indexOf(path.basename(BANK)) >= 0);
ok('the page carries the finding that proves us wrong', /PROVES US WRONG/.test(pageText));
ok('the page has a ROUTED section', /ROUTED/.test(pageText));
var REG = JSON.parse(fs.readFileSync('records/target/BOHEMIA_VOTE_REGISTRY.json', 'utf8'));
var items = Array.isArray(REG) ? REG : (REG.items || []);
ok('no VOTE item was registered for this held round', !items.some(function (it) {
  return /who[- ]lives[- ]where/i.test(JSON.stringify(it)); }));

console.log('\n' + (fail ? 'WHO LIVES WHERE GATE: ' + fail + ' FAILED, ' + pass + ' ok'
  : 'WHO LIVES WHERE GATE: ' + pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
