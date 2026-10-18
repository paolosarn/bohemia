#!/usr/bin/env node
/* BOHEMIA THE NAMES WIRED IN GATE (10/18/26, PEOPLE lane).
 * Row [the names wired in] THE-MIX-IN-THE-GAME. Paolo 9/21: 'a little more
 * percentage of white people names... keep it natural... this game isn't a
 * Hispanic game, chill'. The plan (the names mix, 6bb2be0c) did nothing until
 * the game rolled from it; this gate holds the game to it.
 *
 * One roll, engine/bohemia_names.js, names everybody the game names: the man at
 * the post, the keeper in each building, the stranger who tells you his name.
 *
 * PROVES:
 *   A  THE ROLLER IS THE PLAN: its pools are the names mix's pools plus the ten
 *      Hispanic men who-the-face-is added, name for name; its shares and its
 *      crossover are the bank's; every first name has the who-the-face-is
 *      reading; every face reading is who-the-face-is's; nothing he voted UP is
 *      missing; no joke names
 *   B  1,000 ROLLS AGAINST THE SHARES, through each surface's OWN CODE (the
 *      settlement screen's hireName and keeperName lifted out of the file and
 *      run, the city frame's inlined copy of the roller and the people engine
 *      run in a sandbox): the five backgrounds within four and a half points of
 *      the bank (three sigma at 1,000), the names that read Hispanic within five
 *      points of the census, every name two words, no full name over 1 percent,
 *      and where a face is known the name reads as the face, 1,000 of 1,000
 *   C  THE SURFACES ARE WIRED: the post and the keepers call the roll and no
 *      fixed name list is left (HIRE_NAMES gone, no keeper carries a first name
 *      but YOU); the screen loads the roller before its own script; the city
 *      carries the roller byte for byte in front of the people engine, which is
 *      byte for byte the engine's; generatedName rolls through it
 *   D  THE BEFORE STAYS TRUE AS HISTORY: the old post list (frozen in the names
 *      mix bank) read Hispanic 12 of 16; the old two-list draw, re-run here on
 *      the names he voted UP, read Hispanic over 50 percent
 *   E  the page exists, carries the finding, the twelve names on the sheet, the
 *      [bb and [ah lines, a ROUTED section; the VOTE item is registered
 *
 *   node gates/the_names_wired_in_gate.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');
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
function same(a, b) { return a.length === b.length && a.slice().sort().join('|') === b.slice().sort().join('|'); }

var NAMES_SRC = fs.readFileSync('engine/bohemia_names.js', 'utf8');
var N = require(path.join(ROOT, 'engine/bohemia_names.js'));
var MIX = N.MIX;
var MIXBANK = JSON.parse(fs.readFileSync('banks/BOHEMIA_THE_NAMES_MIX_10_18_26.json', 'utf8'));
var FACEBANK = JSON.parse(fs.readFileSync('banks/BOHEMIA_WHO_THE_FACE_IS_10_18_26.json', 'utf8'));
var PLACES = JSON.parse(fs.readFileSync('banks/BOHEMIA_WHO_LIVES_WHERE_10_17_26.json', 'utf8')).places;
var CENSUS_HISPANIC = 0.334;
var ROLLS = 1000;

head('A  the roller is the plan');
ok('the roller is a draft (TUNING sets the crossover)', MIX.draft === true && MIX.tuned === false);
var ADDED = FACEBANK.added_hispanic_men_given;
Object.keys(MIXBANK.pools.given).forEach(function (k) {
  var want = MIXBANK.pools.given[k].concat(k === 'hispanic' ? ADDED : []);
  ok('given pool ' + k + ' is the bank\'s, name for name' + (k === 'hispanic' ? ' (plus the ten men)' : ''),
    !!MIX.given[k] && same(MIX.given[k], want), (MIX.given[k] || []).length + ' names');
});
ok('no given pool the bank does not have', same(Object.keys(MIX.given), Object.keys(MIXBANK.pools.given)));
Object.keys(MIXBANK.pools.surname).forEach(function (k) {
  ok('surname pool ' + k + ' is the bank\'s, name for name', !!MIX.surname[k] && same(MIX.surname[k], MIXBANK.pools.surname[k]),
    (MIX.surname[k] || []).length + ' names');
});
ok('no surname pool the bank does not have', same(Object.keys(MIX.surname), Object.keys(MIXBANK.pools.surname)));
ok('the five shares are the bank\'s', Object.keys(MIXBANK.heritage_share).every(function (k) {
  return MIX.heritage[k] === Math.round(MIXBANK.heritage_share[k] * 100); }) && same(Object.keys(MIX.heritage), Object.keys(MIXBANK.heritage_share)),
  JSON.stringify(MIX.heritage));
function ruleSame(a, b) {
  return Object.keys(b).every(function (her) {
    if (b[her] === 'any') return a[her] === 'any';
    return a[her] && Object.keys(b[her]).every(function (p) { return a[her][p] === Math.round(b[her][p] * 100); }) &&
      same(Object.keys(a[her]), Object.keys(b[her]));
  });
}
ok('the first-name crossover is the bank\'s', ruleSame(MIX.givenRule, MIXBANK.given_rule));
ok('the surname crossover is the bank\'s', ruleSame(MIX.surnameRule, MIXBANK.surname_rule));
var allGiven = [].concat.apply([], Object.keys(MIX.given).map(function (k) { return MIX.given[k]; }));
var badRead = allGiven.filter(function (n) { return MIX.sex[n] !== FACEBANK.given_sex[n]; });
ok('every first name reads as who-the-face-is read it', badRead.length === 0, allGiven.length + ' names; ' + badRead.join(','));
ok('no reading for a name the pools do not carry', Object.keys(MIX.sex).every(function (n) { return allGiven.indexOf(n) >= 0; }));
var faceKeys = Object.keys(FACEBANK.faces).filter(function (k) { return k === 'you' || /^cast_/.test(k); });
ok('every face reads as who-the-face-is read it', same(Object.keys(MIX.faces), faceKeys) &&
  faceKeys.every(function (k) { return MIX.faces[k] === FACEBANK.faces[k].reads_as.sex; }),
  faceKeys.filter(function (k) { return /^cast_/.test(k) && MIX.faces[k] === 'f'; }).join(',') + ' read as women');
var engine = fs.readFileSync('engine/bohemia_people.js', 'utf8');
function arr(name) {
  var m = engine.match(new RegExp('var ' + name + ' = \\[([\\s\\S]*?)\\];'));
  var body = m[1].replace(/\/\*[\s\S]*?\*\//g, '');
  return (body.match(/'([^']+)'/g) || []).map(function (s) { return s.slice(1, -1); });
}
var allSur = [].concat.apply([], Object.keys(MIX.surname).map(function (k) { return MIX.surname[k]; }));
var lostG = arr('GIVEN').filter(function (n) { return allGiven.indexOf(n) < 0; });
var lostS = arr('SURNAME').filter(function (n) { return allSur.indexOf(n) < 0; });
ok('every first name he voted UP is in the roll', lostG.length === 0, arr('GIVEN').length + ' names; ' + lostG.join(','));
ok('every surname he voted UP is in the roll', lostS.length === 0, arr('SURNAME').length + ' names; ' + lostS.join(','));
ok('Pancho, Nacho and Chuy are nowhere in the roll', !/\b(Pancho|Nacho|Chuy)\b/.test(JSON.stringify(MIX)));
ok('the West African surnames go to a Black or mixed person only',
  same(MIX.blackOnlySurnames, ['Okonkwo', 'Amadi', 'Adeyemi', 'Osei', 'Achebe']) &&
  MIX.blackOnlySurnames.every(function (n) { return MIX.surname.rest.indexOf(n) >= 0; }));

head('B  1,000 rolls against the shares, through each surface\'s own code');
var SETTLE = fs.readFileSync('slices/BOHEMIA_SETTLEMENT_SCREEN.html', 'utf8');
function lift(src, fname) {
  var at = src.indexOf('function ' + fname + '(');
  if (at < 0) return null;
  var depth = 0, i = src.indexOf('{', at);
  for (; i < src.length; i++) { if (src[i] === '{') depth++; else if (src[i] === '}') { depth--; if (depth === 0) break; } }
  return src.slice(at, i + 1);
}
var hireSrc = lift(SETTLE, 'hireName'), keeperSrc = lift(SETTLE, 'keeperName');
var kpm = SETTLE.match(/var KEEPERS = (\{[\s\S]*?\n\});/);
var KEEPERS = kpm ? new Function('return ' + kpm[1])() : {};
ok('the screen\'s hireName and keeperName are there to run', !!hireSrc && !!keeperSrc && !!kpm);
var CAST = Object.keys(MIX.faces).filter(function (k) { return /^cast_/.test(k); });
function tally(list) {
  var her = {}, his = 0, two = 0, seen = {}, top = 0, agree = 0, faced = 0;
  list.forEach(function (x) {
    var p = x.full.split(' ');
    if (p.length === 2 && p[0] && p[1]) two++;
    if (N.readsHispanic(x.full)) his++;
    if (x.heritage) her[x.heritage] = (her[x.heritage] || 0) + 1;
    seen[x.full] = (seen[x.full] || 0) + 1; if (seen[x.full] > top) top = seen[x.full];
    if (x.face) { faced++; var s = MIX.sex[p[0]]; if (s === x.face || s === 'x') agree++; }
  });
  return { n: list.length, her: her, his: his / list.length, two: two, top: top, agree: agree, faced: faced, distinct: Object.keys(seen).length };
}
function judge(label, t, withHeritage) {
  ok(label + ': ' + t.n + ' rolls', t.n === ROLLS);
  if (withHeritage) {
    var off = Object.keys(MIX.heritage).filter(function (k) { return Math.abs((t.her[k] || 0) / t.n - MIX.heritage[k] / 100) > 0.045; });
    ok(label + ': the five backgrounds within four and a half points of the shares', off.length === 0,
      Object.keys(MIX.heritage).map(function (k) { return k + ' ' + pct((t.her[k] || 0) / t.n); }).join(', '));
  }
  ok(label + ': names that read Hispanic within five points of the county', Math.abs(t.his - CENSUS_HISPANIC) <= 0.05,
    pct(t.his) + ' vs ' + pct(CENSUS_HISPANIC));
  ok(label + ': every name is two words', t.two === t.n, t.two + ' of ' + t.n);
  ok(label + ': no full name is one percent of the rolls', t.top <= ROLLS / 100, 'the most common ' + t.top + ', ' + t.distinct + ' different');
  if (t.faced) ok(label + ': the name reads as the face, every time', t.agree === t.faced, t.agree + ' of ' + t.faced);
}
/* THE POST: the screen's own hireName, at the 26 places, week by week, slot by slot, on the face the slot draws */
var post = [];
if (hireSrc) {
  var hireName = new Function('window', 'BohemiaNames', hireSrc + '\nreturn hireName;')({ BohemiaNames: N }, N);
  var seedOf = new Function('str', (SETTLE.match(/function seedOf\(str\)\{([^\n]*?)\}\n/) || [])[1] || 'return 0;');
  var LOOKS = (SETTLE.match(/r\.look = 'cast_' \+ \[([^\]]*)\]/) || [])[1];
  LOOKS = LOOKS ? LOOKS.match(/'([^']+)'/g).map(function (s) { return 'cast_' + s.slice(1, -1); }) : CAST;
  for (var w = 0; post.length < ROLLS; w++) {
    PLACES.forEach(function (pl) {
      for (var i = 0; i < 6 && post.length < ROLLS; i++) {
        var key = pl.name + ':' + w, look = LOOKS[seedOf(key + ':look:' + i) % LOOKS.length], full = hireName(key, i, look);
        var r = N.roll('post:' + key + ':' + i, { sex: N.faceReads(look) });
        post.push({ full: full, heritage: r.full === full ? r.heritage : null, face: N.faceReads(look) });
      }
    });
  }
  ok('the screen\'s hireName is the roll at the post\'s own key', post.every(function (x) { return x.heritage; }));
  judge('THE POST', tally(post), true);
}
/* THE KEEPERS: the screen's own keeperName, every building at the 26 places (then again under other place names until
   1,000), on a face rolled here for the check (the browser proof, tools/bohemia_people_names_wired_in.js, reads the
   faces the screen really draws) */
var keep = [];
if (keeperSrc) {
  var kn = Object.keys(KEEPERS).filter(function (k) { return !KEEPERS[k].name; });
  ok('every keeper but YOU and THE ELDER (a title, no first name) is a role, not a fixed name', kn.length >= 9 && Object.keys(KEEPERS).every(function (k) {
    return KEEPERS[k].name ? (KEEPERS[k].who === 'you' || KEEPERS[k].name === 'THE ELDER') : typeof KEEPERS[k].role === 'string'; }), kn.join(','));
  var faceNow = null, S = { place: { name: '' } };
  var keeperName = new Function('window', 'BohemiaNames', 'KEEPERS', 'S', 'lookOf', keeperSrc + '\nreturn keeperName;')(
    { BohemiaNames: N }, N, KEEPERS, S, function () { return faceNow; });
  for (var v = 0; keep.length < ROLLS; v++) {
    PLACES.forEach(function (pl) {
      kn.forEach(function (k, j) {
        if (keep.length >= ROLLS) return;
        S.place.name = v ? pl.name + ' #' + v : pl.name;
        faceNow = CAST[seedOf(S.place.name + ':' + k) % CAST.length];
        var label = keeperName(k), tail = ', ' + KEEPERS[k].role;
        var full = label.slice(0, label.length - tail.length);
        var r = N.roll('keeper:' + S.place.name + ':' + k, { sex: N.faceReads(faceNow) });
        keep.push({ full: full.split(' ').map(function (w) { return w.charAt(0) + w.slice(1).toLowerCase(); }).join(' '),
          heritage: r.full.toUpperCase() === full && label.slice(-tail.length) === tail ? r.heritage : null, face: N.faceReads(faceNow) });
      });
    });
  }
  ok('the screen\'s keeperName is the roll at the keeper\'s own key, with his role after it', keep.every(function (x) { return x.heritage; }));
  judge('THE KEEPERS', tally(keep), true);
}
/* THE STRANGERS: the city frame's own inlined roller and people engine, run in a sandbox, asked the way the city asks */
var CITY = fs.readFileSync('slices/BOHEMIA_CITY_WORLD.html', 'utf8');
var NS = '/* ==== engine/bohemia_names.js (PEOPLE, the names wired in, 10/18) ==== */', NE = '/* ==== /engine/bohemia_names.js ==== */';
var PS = '/* ==== engine/bohemia_people.js (CITY TALK, 8/3) ==== */', PE = '/* ==== /engine/bohemia_people.js (CITY TALK) ==== */';
var ni = CITY.indexOf(NS), nj = CITY.indexOf(NE), pi = CITY.indexOf(PS), pj = CITY.indexOf(PE);
var cityNames = ni >= 0 && nj > ni ? CITY.slice(ni + NS.length, nj).trim() : '';
var cityPeople = pi >= 0 && pj > pi ? CITY.slice(pi + PS.length, pj).trim() : '';
var strangers = [];
if (cityNames && cityPeople) {
  var box = { console: console, Math: Math, JSON: JSON };
  box.window = box; box.globalThis = box;
  vm.createContext(box);
  vm.runInContext(cityNames + '\n' + cityPeople, box, { filename: 'BOHEMIA_CITY_WORLD.html' });
  var BP = box.BohemiaPeople;
  ok('the city\'s people engine and roller both load', !!(BP && box.BohemiaNames && typeof BP.generatedName === 'function'));
  for (var c = 0; c < ROLLS; c++) {
    var full = BP.generatedName('P:city:' + c), r = N.roll('P:city:' + c);
    strangers.push({ full: full, heritage: r.full === full ? r.heritage : null });
  }
  ok('the city\'s generatedName is the roll', strangers.every(function (x) { return x.heritage; }));
  judge('THE STRANGERS', tally(strangers), true);
  var sheF = 0, both = 0;
  for (c = 0; c < 200; c++) { var ra = BP.readsAs(BP.generatedName('she:' + c, 'she')); if (ra === 'she') sheF++; else if (ra === 'either') both++; }
  ok('the city can ask for a woman\'s name and get one (a body already drawn)', sheF + both === 200 && sheF >= 160,
    sheF + ' of 200 read she, ' + both + ' go both ways (Kai, Sunny, Dana, Anh)');
}

head('C  the surfaces are wired');
ok('the post\'s fixed list is gone', !/var HIRE_NAMES\b/.test(SETTLE));
ok('recruitsHere names a recruit after his face, by hireName', /r\.look = 'cast_' \+ \[[^\]]*\]\[seedOf\(key \+ ':look:' \+ i\) % 12\]; r\.name = hireName\(key, i, r\.look\);/.test(SETTLE));
ok('hireName rolls at the post\'s key with the face\'s reading', !!hireSrc && /BohemiaNames\.roll\('post:' \+ key \+ ':' \+ i, \{sex: BohemiaNames\.faceReads\(look\)\}\)\.full/.test(hireSrc));
ok('keeperName rolls at the place and the building, with the face the place drew', !!keeperSrc &&
  /BohemiaNames\.roll\('keeper:' \+ S\.place\.name \+ ':' \+ k, \{sex: look \? BohemiaNames\.faceReads\(look\) : null\}\)/.test(keeperSrc) && /lookOf\(k\)/.test(keeperSrc));
ok('the keeper speaks under keeperName', /n\.textContent = keeperName\(k\);/.test(SETTLE) && !/KEEPERS\[k\]\.name/.test(SETTLE));
var tagAt = SETTLE.indexOf('<script src="../engine/bohemia_names.js"></script>'), mainAt = SETTLE.indexOf('<script>\n(function(){');
ok('the screen loads the roller before its own script', tagAt > 0 && mainAt > tagAt);
ok('the city carries the roller byte for byte', cityNames === NAMES_SRC.trim(), cityNames.length + ' bytes');
ok('the roller sits in front of the people engine in the city', ni >= 0 && nj < pi);
ok('the city\'s people engine is the engine\'s, byte for byte', cityPeople === engine.trim());
ok('generatedName rolls through the roller first', /function generatedName\(key, sex\) \{\s*var N = names\(\);\s*if \(N\) return N\.roll\(key, \{ sex: sex \}\)\.full;/.test(engine));
var names = require(path.join(ROOT, 'engine/bohemia_people.js'));
ok('the engine answers the roll in node too', names.generatedName('P:city:7') === N.roll('P:city:7').full, names.generatedName('P:city:7'));

head('D  the before stays true as history');
var old = MIXBANK.the_post_names;
ok('the old post list read Hispanic 12 of 16 (frozen in the names mix bank)', old.list.length === 16 && old.reads_hispanic.length === 12);
var hisOld = 0, G = arr('GIVEN'), SN = arr('SURNAME'), HG = {}, HSN = {};
MIXBANK.pools.given.hispanic.forEach(function (n) { HG[n] = 1; }); MIXBANK.pools.surname.hispanic.forEach(function (n) { HSN[n] = 1; });
for (var o = 0; o < 20000; o++) {
  var h = N.hashOf('person:' + o), a = N.mix32(h), b = N.mix32(h ^ 0x9e3779b9);
  if (HG[G[a % G.length]] || HSN[SN[b % SN.length]]) hisOld++;
}
ok('the old two-list draw on his names read Hispanic over half the time', hisOld / 20000 > 0.5, pct(hisOld / 20000));

head('E  the page and the sheet');
var PAGE = 'records/BOHEMIA_PEOPLE_THE_NAMES_WIRED_IN_10_18_26.md';
var page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : '';
ok('the page exists', page.length > 2000);
ok('the page carries the finding that proves us wrong', /PROVES US WRONG/.test(page));
ok('the page has its [bb names] and [ah] lines and a ROUTED section', /\[bb names\]/.test(page) && /\[ah\]/.test(page) && /## \d+\. ROUTED/.test(page));
var SHEETJ = 'records/people/THE_NAMES_WIRED_IN.json';
var sheet = fs.existsSync(SHEETJ) ? JSON.parse(fs.readFileSync(SHEETJ, 'utf8')) : { cards: [] };
ok('the sheet carries twelve recruits read off the real screen', sheet.cards.length === 12);
var badCard = sheet.cards.filter(function (cd) {
  return cd.name !== N.roll('post:' + cd.place + ':' + cd.week + ':' + cd.slot, { sex: N.faceReads(cd.look) }).full; });
ok('every name on the sheet is the roll for that slot, today', badCard.length === 0, badCard.map(function (cd) { return cd.name; }).join(','));
ok('every name on the sheet is on the page', sheet.cards.every(function (cd) { return page.indexOf(cd.name) >= 0; }));
ok('the sheet picture exists', fs.existsSync('slices/vote/PEOPLE_THE_NAMES_WIRED_IN_10_18.png'));
var REG = JSON.parse(fs.readFileSync('records/target/BOHEMIA_VOTE_REGISTRY.json', 'utf8'));
var item = REG.items.filter(function (x) { return x.id === 'people-the-names-wired-in-10-18'; })[0];
ok('the VOTE item is registered, PEOPLE\'s, showing the sheet', !!item && item.lane === 'people' && item.show &&
  item.show.src === 'vote/PEOPLE_THE_NAMES_WIRED_IN_10_18.png' && item.draft === true);

console.log('\n' + (fail ? 'THE NAMES WIRED IN GATE: ' + fail + ' FAILED, ' + pass + ' ok'
  : 'THE NAMES WIRED IN GATE: ' + pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
