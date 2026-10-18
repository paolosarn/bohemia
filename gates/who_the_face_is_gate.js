#!/usr/bin/env node
/* BOHEMIA WHO THE FACE IS GATE (10/18/26, PEOPLE lane).
 * Row [a name for every starred face] WHO-THE-FACE-IS, rule 115(h) (his first star: the face from the
 * same model is every face). PURPOSE: a face he loves needs a person behind it. Under the hold (rule 88)
 * a page is the ship: records/BOHEMIA_PEOPLE_WHO_THE_FACE_IS_10_18_26.md, and its test material is
 * banks/BOHEMIA_WHO_THE_FACE_IS_10_18_26.json (draft:true, never read by the game), written by
 * tools/bohemia_people_who_the_face_is.js.
 *
 * PROVES:
 *   A  EVERY STARRED FACE HAS A PERSON: every face in PORTRAIT's crew manifest and every head PORTRAIT
 *      rendered under records/target/portrait/rig/ has one entry, and nothing else does (goes red the
 *      day PORTRAIT ships a face nobody is)
 *   B  ONE ID, ONE WHOLE PERSON: fifteen full names, no first name or surname twice; every face file
 *      the entry names is on disk
 *   C  THE NAME IS FROM THE NAMES MIX: each given name and surname is in the pool the entry says, that
 *      pool is one the names mix's rule allows for the heritage, the given name reads as the face reads,
 *      the heritages are the census counted over the faces, no white, Hispanic or Asian person carries a
 *      West African surname, Pancho and Nacho are nowhere
 *   D  WHERE THEY LIVE AND WHAT THEY DO: the home is one of the 26 places and Battle Brothers' own hire
 *      roll there gives the background a real chance; a face the crew screen puts a man on today keeps
 *      that man's background (manOf's own rule, recomputed); the two enemy heads carry real BB tiers
 *   E  THE LINE: draft; every Spanish word is in the engine's closed lexicon and nothing in a bilingual
 *      line is an invented word (the language gate's own test); English lines and the player's line carry
 *      no Spanish; the bilingual lines are no more than the valley's share (his 8/26 ceiling)
 *   F  THE MOUTH: PORTRAIT's own keys only, rest at both ends, one key a sixteenth at 120 BPM; the
 *      line says itself in under nine seconds; and the measured gap: the game's mouth rule today takes
 *      at least 1.8 times as long (goes red the day visemesOf is fixed; then rewrite the page)
 *   G  THE MEASURED POST (live, goes red the day RUN TWO wires the fix): most men at a post wear a
 *      crewmate's face; every face meets exactly four names; the three faces that read as women never
 *      meet a woman's name
 *   H  the hold holds: nothing in engine/ or slices/ reads the bank
 *   I  the page: exists, names the bank, the finding that proves us wrong, the fifteen names, the
 *      measured numbers, a ROUTED section, the [bb faces] and [ah] lines; the sheet and the talking
 *      faces exist
 *
 *   node gates/who_the_face_is_gate.js
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
function J(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

var BANK = 'banks/BOHEMIA_WHO_THE_FACE_IS_10_18_26.json';
var PAGE = 'records/BOHEMIA_PEOPLE_WHO_THE_FACE_IS_10_18_26.md';
var bank = J(BANK), F = bank.faces, KEYS = Object.keys(F);
var man = J('records/target/portrait/crew/BOHEMIA_CREW_FACES.json');
var names = J('banks/BOHEMIA_THE_NAMES_MIX_10_18_26.json');
var where = J('banks/BOHEMIA_WHO_LIVES_WHERE_10_17_26.json');
var ours = J('records/target/bb/ours.json');
var people = J('slices/fight_people/fight_people.json');
var enemies = J('records/target/bb/enemies.json');
var P = require('../engine/bohemia_people.js');

head('A  every starred face has a person');
ok('the bank is a draft', bank.draft === true && bank.tuned === false);
var RIGDIR = 'records/target/portrait/rig/';
var rigHeads = fs.readdirSync(RIGDIR).filter(function (d) { return d !== 'crew' && fs.existsSync(path.join(RIGDIR, d, 'rig_portrait_S.png')); });
var shipped = Object.keys(man.faces).concat(rigHeads);
var nobody = shipped.filter(function (k) { return !F[k]; });
ok('every face PORTRAIT shipped has an entry', nobody.length === 0, shipped.length + ' faces' + (nobody.length ? '; nobody behind ' + nobody.join(',') : ''));
var extra = KEYS.filter(function (k) { return shipped.indexOf(k) < 0; });
ok('no entry for a face PORTRAIT never shipped', extra.length === 0, extra.join(','));
ok('fifteen faces this round (13 crew, the thug, the poacher)', KEYS.length >= 15, String(KEYS.length));

head('B  one id, one whole person');
function dupes(list) { var s = {}, d = []; list.forEach(function (x) { if (s[x]) d.push(x); s[x] = 1; }); return d; }
var fulls = KEYS.map(function (k) { return F[k].name.full; });
ok('no full name twice', dupes(fulls).length === 0, dupes(fulls).join(','));
ok('no first name twice', dupes(KEYS.map(function (k) { return F[k].name.given; })).length === 0);
ok('no surname twice', dupes(KEYS.map(function (k) { return F[k].name.surname; })).length === 0);
var missing = [];
KEYS.forEach(function (k) { ['rest', 'A', 'E', 'O', 'M'].forEach(function (key) {
  var p = (F[k].face_files[key] || '').replace('{64|128}', '128'); if (!p || !fs.existsSync(p)) missing.push(k + ':' + key); }); });
ok('every face file an entry names is on disk', missing.length === 0, missing.slice(0, 6).join(','));
ok('every entry is keyed by its own face id', KEYS.every(function (k) { return F[k].face === k; }));

head('C  the name is from the names mix');
var PG = names.pools.given, PS = names.pools.surname, added = bank.added_hispanic_men_given || [];
function allowed(rule, her, pool) { return rule[her] === 'any' || (rule[her] && rule[her][pool] > 0); }
var badPool = [], badSex = [], african = [];
var WEST_AFRICAN = ['Okonkwo', 'Amadi', 'Adeyemi', 'Osei', 'Achebe'];
KEYS.forEach(function (k) {
  var n = F[k].name, her = n.heritage;
  var inG = (PG[n.given_pool] || []).indexOf(n.given) >= 0 || (n.given_pool === 'hispanic' && added.indexOf(n.given) >= 0);
  var inS = (PS[n.surname_pool] || []).indexOf(n.surname) >= 0;
  if (!inG || !inS || !allowed(names.given_rule, her, n.given_pool) || !allowed(names.surname_rule, her, n.surname_pool)) badPool.push(k + ':' + n.full);
  var sx = bank.given_sex[n.given];
  if (!(sx === F[k].reads_as.sex || sx === 'x') || n.sex !== F[k].reads_as.sex) badSex.push(k + ':' + n.given + '(' + sx + ')');
  if (her !== 'black' && her !== 'mixed' && WEST_AFRICAN.indexOf(n.surname) >= 0) african.push(k + ':' + n.full);
});
ok('every name is drawn from a pool the names mix allows for its heritage', badPool.length === 0, badPool.join(','));
ok('every given name reads as the face reads', badSex.length === 0, badSex.join(','));
ok('no white, Hispanic or Asian person carries a West African surname', african.length === 0, african.join(','));
var HS = names.heritage_share, HK = Object.keys(HS), N = KEYS.length;
var q = HK.map(function (k) { return { k: k, n: Math.floor(HS[k] * N), r: HS[k] * N - Math.floor(HS[k] * N) }; });
var lft = N - q.reduce(function (a, x) { return a + x.n; }, 0);
q.slice().sort(function (a, b) { return b.r - a.r; }).slice(0, lft).forEach(function (x) { x.n++; });
var got = {}; KEYS.forEach(function (k) { got[F[k].name.heritage] = (got[F[k].name.heritage] || 0) + 1; });
ok('the heritages are the census counted over the faces', q.every(function (x) { return (got[x.k] || 0) === x.n; }),
  q.map(function (x) { return x.k + ' ' + (got[x.k] || 0) + '/' + x.n; }).join(', '));
ok('Pancho and Nacho are nowhere', !/\b(Pancho|Nacho)\b/.test(JSON.stringify(F)));
var hispMen = PG.hispanic.filter(function (n) { return bank.given_sex[n] === 'm'; });
ok('the names mix\'s Hispanic men are still three of its 28 given names (the hole this bank fills)', hispMen.length === 3 && PG.hispanic.length === 28,
  hispMen.join(',') + ' of ' + PG.hispanic.length);
ok('the ten added men\'s names are not in the names mix yet and are no joke names', added.length === 10 &&
  added.every(function (n) { return PG.hispanic.indexOf(n) < 0 && ['Pancho', 'Nacho', 'Chuy'].indexOf(n) < 0; }));

head('D  where they live and what they do');
var PLACE = {}; where.places.forEach(function (p) { PLACE[p.id] = p; });
var badHome = [];
KEYS.forEach(function (k) {
  var p = PLACE[F[k].home.id], bg = F[k].does.background;
  var row = p && p.base_roll.filter(function (r) { return r.id === bg; })[0];
  if (!row || !(row.pct > 0)) badHome.push(k + ':' + bg + '@' + F[k].home.id);
});
ok('every home is one of the 26 places and hires that background by BB\'s own book', badHome.length === 0, badHome.join(','));
var CAST = Object.keys(people.looks).filter(function (l) { return /^cast_/.test(l); });
var badCrew = [];
ours.crew.value.forEach(function (def, i) {
  var look = def.main ? 'you' : CAST[i % CAST.length];
  if (!F[look] || F[look].does.background !== def.background || F[look].on_the_crew_screen_today !== def.name) badCrew.push(look + ':' + def.name);
});
ok('a face the crew screen puts a man on keeps his background (manOf\'s rule, recomputed)', badCrew.length === 0, badCrew.join(','));
var tiers = enemies.rows.map(function (r) { return r.id; });
ok('the enemy heads carry real Battle Brothers tiers', KEYS.filter(function (k) { return F[k].does.tier; })
  .every(function (k) { return tiers.indexOf(F[k].does.tier) >= 0; }) && F.thug && F.thug.does.tier === 'brigand_thug');
ok('every entry says who they are in one sentence', KEYS.every(function (k) { return F[k].who.indexOf(F[k].name.full) === 0 && / from /.test(F[k].who); }));

head('E  the line');
var book = J('records/BOHEMIA_WORDS_BOOK.json'), enVocab = Object.create(null);
(book.books || []).forEach(function (bk) { (bk.lines || []).forEach(function (l) {
  if (l.lang && l.lang !== 'en') return;
  String(l.text || '').toLowerCase().replace(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ']+/g, function (w) { enVocab[w] = 1; return w; }); }); });
(J('records/BOHEMIA_BARKS.json')._meta.englishAdditions || []).forEach(function (w) { enVocab[w] = 1; });
var adds = bank.english_additions || [];
ok('the bank\'s English additions are not Spanish', adds.every(function (w) { return !P.ES_LEX[w]; }), adds.join(','));
adds.forEach(function (w) { enVocab[w] = 1; });
var invented = [], badEs = [], leaks = [];
KEYS.forEach(function (k) {
  var l = F[k].line, es = P.esWordsIn(l.text);
  if (l.draft !== true) badEs.push(k + ': not draft');
  if (JSON.stringify(es) !== JSON.stringify(l.es_words)) badEs.push(k + ': declared ' + l.es_words + ' found ' + es);
  if (!es.every(function (w) { return P.ES_LEX[w.toLowerCase()]; })) badEs.push(k + ': outside ES_LEX');
  if ((l.register === 'en' || l.speaker_is_player) && es.length) leaks.push(k + ': ' + es.join(','));
  if (l.register !== 'en' && es.length < 2) badEs.push(k + ': a bilingual line with under two Spanish words');
  if (l.register === 'en') return;
  l.text.replace(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ']+/g, function (w) {
    var forms = P.esStems(w);
    if (!forms.length || forms.some(function (f) { return P.ES_LEX[f] || enVocab[f]; })) return w;
    invented.push(k + ': ' + w); return w;
  });
});
ok('every line is a draft and its Spanish is the engine\'s closed set', badEs.length === 0, badEs.join('; '));
ok('nothing in a bilingual line is an invented word (the language gate\'s test)', invented.length === 0, invented.join(', '));
ok('English lines and the player\'s own line carry no Spanish', leaks.length === 0, leaks.join('; '));
ok('the player speaks English', F.you && F.you.line.register === 'en' && F.you.line.speaker_is_player === true);
var VM = fs.readFileSync('engine/bohemia_people.js', 'utf8').match(/var VALLEY_MIX = \{ en: (\d+), spanglish: (\d+), es: (\d+) \}/);
var speakers = KEYS.filter(function (k) { return !F[k].line.speaker_is_player; });
var biCap = Math.ceil(((+VM[2] + +VM[3]) / 1000) * speakers.length);
var bi = speakers.filter(function (k) { return F[k].line.register !== 'en'; });
ok('the bilingual lines are no more than the valley\'s share, rounded up', bi.length <= biCap && bi.length >= 1, bi.length + ' of ' + speakers.length + ', cap ' + biCap);
ok('a bilingual speaker is of Hispanic heritage', bi.every(function (k) { return F[k].name.heritage === 'hispanic'; }));

head('F  the mouth');
var badKey = [], slow = [], longer = [];
KEYS.forEach(function (k) {
  var m = F[k].mouth;
  if (m.keys[0] !== 'rest' || m.keys[m.keys.length - 1] !== 'rest' || !m.keys.every(function (x) { return ['rest', 'A', 'E', 'O', 'M'].indexOf(x) >= 0 && F[k].face_files[x]; })) badKey.push(k);
  if (m.ms_per_key !== 125 || m.bpm !== 120 || m.per_beat !== 4 || Math.abs(m.seconds - m.keys.length * 0.125) > 1e-6) badKey.push(k + ' clock');
  if (m.seconds >= 9) longer.push(k + ' ' + m.seconds);
  if (!(m.the_games_rule_today.seconds >= 1.8 * m.seconds)) slow.push(k + ' ' + m.the_games_rule_today.seconds + ' vs ' + m.seconds);
});
ok('the mouth is PORTRAIT\'s own keys, rest at both ends, a sixteenth at 120 BPM', badKey.length === 0, badKey.join(','));
ok('every line says itself in under nine seconds', longer.length === 0, longer.join(','));
ok('the measured gap: the game\'s mouth rule today takes at least 1.8 times as long', slow.length === 0, slow.join(','));
var alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
ok('the game\'s mouth still plays a shape for 250 ms (rewrite the page the day it moves)', /var VISEME_MS\s*=\s*FACE_BEAT_MS \/ 2;/.test(alpha));

head('G  the measured post (live)');
var post = fs.readFileSync('slices/BOHEMIA_SETTLEMENT_SCREEN.html', 'utf8');
var sm = post.match(/function seedOf\(str\)\{([^\n]*?)\}\n/);
var hm = post.match(/var HIRE_NAMES = \[([^\]]*)\]/);
var lm = post.match(/r\.look = 'cast_' \+ \[([^\]]*)\]\[seedOf\(key \+ ':look:' \+ i\) % 12\]/);
var nm = /r\.name = HIRE_NAMES\[seedOf\(key \+ ':name:' \+ i\) % HIRE_NAMES\.length\]/.test(post);
ok('the post still rolls the name and the face with two hashes', !!(sm && hm && lm && nm));
if (sm && hm && lm && nm) {
  var seedOf = new Function('str', sm[1]);
  var HN = hm[1].match(/'([^']+)'/g).map(function (s) { return s.slice(1, -1); });
  var PL = lm[1].match(/'([^']+)'/g).map(function (s) { return 'cast_' + s.slice(1, -1); });
  var PC = new Function('return ' + post.match(/var POST_COUNT = (\{[^}]*\})/)[1])();
  var crewFaces = {}; ours.crew.value.forEach(function (def, i) { if (!def.main) crewFaces[CAST[i % CAST.length]] = 1; });
  var tot = 0, onCrew = 0, carries = {};
  where.places.forEach(function (pl) { for (var w = 0; w < 13; w++) { for (var i = 0; i < (PC[pl.tier] || 4); i++) {
    var key = pl.name + ':' + w, n = HN[seedOf(key + ':name:' + i) % HN.length], l = PL[seedOf(key + ':look:' + i) % 12];
    tot++; if (crewFaces[l]) onCrew++; (carries[l] = carries[l] || {})[n] = 1; } } });
  var share = onCrew / tot;
  ok('most men at a post wear a crewmate\'s face', share >= 0.85 && Math.abs(share - bank.measured.share_wearing_a_crewmates_face) < 0.002,
    onCrew + ' of ' + tot + ' (' + (100 * share).toFixed(1) + '%)');
  var counts = Object.keys(carries).map(function (k) { return Object.keys(carries[k]).length; });
  ok('every face meets exactly four names', counts.length === 12 && counts.every(function (c) { return c === 4; }), counts.join(','));
  var WOMEN = HN.filter(function (n) { return bank.given_sex[n] === 'f' || ['Yesenia', 'Kiki'].indexOf(n) >= 0; });
  var womenFaces = KEYS.filter(function (k) { return /^cast_/.test(k) && F[k].reads_as.sex === 'f'; });
  ok('the three faces that read as women never meet a woman\'s name', womenFaces.length === 3 &&
    womenFaces.every(function (k) { return Object.keys(carries[k] || {}).every(function (n) { return WOMEN.indexOf(n) < 0; }); }),
    womenFaces.map(function (k) { return k + ':' + Object.keys(carries[k] || {}).sort().join('/'); }).join('  '));
}

head('H  the hold holds');
function readers(dir) {
  return fs.readdirSync(dir).filter(function (f) { return /\.(js|html)$/.test(f); })
    .filter(function (f) { return fs.readFileSync(path.join(dir, f), 'utf8').indexOf('BOHEMIA_WHO_THE_FACE_IS') >= 0; });
}
var rd = readers('engine').concat(readers('slices'));
ok('nothing in engine/ or slices/ reads the bank', rd.length === 0, rd.join(','));

head('I  the page');
var page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : '';
ok('the page exists', page.length > 3000);
ok('the page names the bank', page.indexOf(path.basename(BANK)) >= 0);
ok('the page carries the finding that proves us wrong', /PROVES US WRONG/.test(page));
var absent = fulls.filter(function (n) { return page.indexOf(n) < 0; });
ok('the page names all fifteen people', absent.length === 0, absent.join(','));
ok('the page carries the measured numbers', page.indexOf(bank.measured.recruits_wearing_a_crewmates_face + ' of ' + bank.measured.recruits) >= 0 &&
  page.indexOf((100 * bank.measured.share_wearing_a_crewmates_face).toFixed(1) + '%') >= 0);
ok('the page has a ROUTED section', /## \d+\. ROUTED/.test(page));
ok('the page has its [bb faces] and [ah] lines', /\[bb faces\]/.test(page) && /\[ah\]/.test(page));
ok('the sheet and the talking faces exist', fs.existsSync('records/people/WHO_THE_FACE_IS.png') && fs.existsSync('records/people/WHO_THE_FACE_IS_TALKING.gif'));

console.log('\n' + (fail ? 'WHO THE FACE IS GATE: ' + fail + ' FAILED, ' + pass + ' ok' : 'WHO THE FACE IS GATE: ' + pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
