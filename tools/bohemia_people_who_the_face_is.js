#!/usr/bin/env node
/* BOHEMIA WHO THE FACE IS (10/18/26, PEOPLE lane) -- the tool that writes the bank.
 *
 * Row [a name for every starred face] WHO-THE-FACE-IS, rule 115(h): every face is now built
 * the starred way (PORTRAIT's head on the body's own model, his first star). PURPOSE: a face
 * he loves needs a person behind it. Under the hold (rule 88) this is a page: the bank is
 * draft:true and nothing live reads it.
 *
 * WHAT IT READS (every piece is the live thing, read out of its own file, never a copy):
 *   PORTRAIT's crew manifest  records/target/portrait/crew/BOHEMIA_CREW_FACES.json (13 faces)
 *   PORTRAIT's rig heads      records/target/portrait/rig/<tier>/rig_portrait_S*.png (thug, poacher)
 *   the names mix             banks/BOHEMIA_THE_NAMES_MIX_10_18_26.json (heritage shares, pools, rules)
 *   who lives where           banks/BOHEMIA_WHO_LIVES_WHERE_10_17_26.json (26 places, BB's hire rolls)
 *   the starting crew         records/target/bb/ours.json crew (the names on the crew screen today)
 *   the roster's look rule    engine/bohemia_roster.js manOf (looks[i % looks.length])
 *   the post                  slices/BOHEMIA_SETTLEMENT_SCREEN.html (seedOf, HIRE_NAMES, POST_COUNT, the 12 looks)
 *   the mouth                 slices/BOHEMIA_ALPHA_0_9.html visemeFor/visemesOf (one shape per 250 ms)
 *   the Spanish               engine/bohemia_people.js esWordsIn + ES_LEX (the closed set the game may say)
 *
 * WHAT IT WRITES: banks/BOHEMIA_WHO_THE_FACE_IS_10_18_26.json
 *
 *   node tools/bohemia_people_who_the_face_is.js          write the bank, print the people
 *   node tools/bohemia_people_who_the_face_is.js --check  print only, write nothing
 */
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.dirname(__dirname);
process.chdir(ROOT);
var CHECK = process.argv.indexOf('--check') >= 0;

function J(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
var MANIFEST = 'records/target/portrait/crew/BOHEMIA_CREW_FACES.json';
var RIG = 'records/target/portrait/rig/';
var NAMES = 'banks/BOHEMIA_THE_NAMES_MIX_10_18_26.json';
var WHERE = 'banks/BOHEMIA_WHO_LIVES_WHERE_10_17_26.json';
var OURS = 'records/target/bb/ours.json';
var OUT = 'banks/BOHEMIA_WHO_THE_FACE_IS_10_18_26.json';

var man = J(MANIFEST), names = J(NAMES), where = J(WHERE), ours = J(OURS);
var people = J('slices/fight_people/fight_people.json');
var post = fs.readFileSync('slices/BOHEMIA_SETTLEMENT_SCREEN.html', 'utf8');
var alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
var roster = fs.readFileSync('engine/bohemia_roster.js', 'utf8');
var P = require('../engine/bohemia_people.js');

/* ---- the live pieces, lifted out of their own files ---- */
function lift(src, re, what) { var m = src.match(re); if (!m) throw new Error('TOOL BUG: ' + what + ' moved; read it again.'); return m; }
var seedOf = new Function('str', lift(post, /function seedOf\(str\)\{([^\n]*?)\}\n/, 'the post\'s seedOf')[1]);
var HIRE_NAMES = lift(post, /var HIRE_NAMES = \[([^\]]*)\]/, 'HIRE_NAMES')[1].match(/'([^']+)'/g).map(function (s) { return s.slice(1, -1); });
var POST_COUNT = new Function('return ' + lift(post, /var POST_COUNT = (\{[^}]*\})/, 'POST_COUNT')[1])();
var POST_LOOKS = lift(post, /r\.look = 'cast_' \+ \[([^\]]*)\]\[seedOf\(key \+ ':look:' \+ i\) % 12\]/, 'the post\'s look roll')[1]
  .match(/'([^']+)'/g).map(function (s) { return 'cast_' + s.slice(1, -1); });
lift(post, /r\.name = HIRE_NAMES\[seedOf\(key \+ ':name:' \+ i\) % HIRE_NAMES\.length\]/, 'the post\'s name roll');
lift(roster, /look: def\.main \? 'you' : \(looks\.length \? looks\[i % looks\.length\] : 'you'\)/, 'manOf\'s look rule');
var visemeSrc = lift(alpha, /function visemeFor\(ch\)\{[\s\S]*?\n\}\n/, 'visemeFor')[0] + lift(alpha, /function visemesOf\(line\)\{[\s\S]*?\n\}\n/, 'visemesOf')[0];
var visemesOf = new Function(visemeSrc + '; return visemesOf;')();
var visemeFor = new Function(visemeSrc + '; return visemeFor;')();

/* THE MOUTH ON THE SYLLABLE (this round's third finding). The game's visemesOf gives one shape per
   letter-sound and plays each for 250 ms, so a seven-word line takes 8.5 s; people read English at
   about 6.2 syllables a second and Spanish at 7.8 (Pellegrino, Coupe and Marsico 2011, Language 87(3)).
   Same shapes (the game's own visemeFor picks the vowel's shape), right clock: ONE SYLLABLE PER EIGHTH
   NOTE at 120 BPM, 4 a second, a slow deliberate cadence inside the beat law. Each syllable is two
   sixteenths: the lips close first (M) when it starts on m, b or p, else the vowel is held; a comma
   rests an eighth, a full stop a beat. */
var VOW = /[aeiouyáéíóúü]+/gi;
function syllablesOf(word) {
  var w = word.toLowerCase().replace(/[^a-záéíóúüñ']/g, '');
  if (!w) return [];
  if (w.length > 3 && /[^aeiouy]e$/.test(w) && !/le$/.test(w)) w = w.slice(0, -1);   /* the silent e */
  var groups = [], m; VOW.lastIndex = 0;
  while ((m = VOW.exec(w))) groups.push({ at: m.index, v: m[0] });
  if (!groups.length) return [{ onset: w, v: 'e' }];
  return groups.map(function (g, i) {
    var start = i === 0 ? 0 : (function () { var prevEnd = groups[i - 1].at + groups[i - 1].v.length; return Math.max(prevEnd, g.at - 1); })();
    return { onset: w.slice(start, g.at), v: g.v };
  });
}
var SHAPE = { open: 'A', wide: 'O', mid: 'E', closed: 'M' };   /* the 8/26 four shapes onto PORTRAIT's A E O M keys */
function mouthOf(line) {
  var keys = [], syl = 0, toks = line.match(/[^\s,.!?;:]+|[,.!?;:]/g) || [];
  toks.forEach(function (t, ti) {
    if (/^[,;:]$/.test(t)) { keys.push('rest', 'rest'); return; }
    if (/^[.!?]$/.test(t)) { if (ti < toks.length - 1) keys.push('rest', 'rest', 'rest', 'rest'); return; }
    syllablesOf(t).forEach(function (s) {
      var v = SHAPE[visemeFor(s.v[0])] || 'E';
      keys.push(/[mbp]/.test(s.onset) ? 'M' : v, v); syl++;
    });
  });
  return { keys: ['rest'].concat(keys).concat(['rest']), syllables: syl };
}

/* ---- 1. THE MEASUREMENT: what the screens do with a face today ---- */
var CAST = Object.keys(people.looks).filter(function (l) { return /^cast_/.test(l); });   /* manOf's own order */
var crew = ours.crew.value;
var crewOnFace = {};   /* look -> the crew member manOf puts on it */
crew.forEach(function (def, i) { var look = def.main ? 'you' : CAST[i % CAST.length]; crewOnFace[look] = { name: def.name, background: def.background, index: i }; });
var WOMAN_NAMES = ['Lupe', 'Yesenia', 'Marisol', 'Kiki', 'Ofelia'];   /* of HIRE_NAMES; Dani and Rudy read either way */
var WEEKS = 13, recruits = 0, onCrewFace = 0, womanName = 0, namesOnFace = {};
where.places.forEach(function (pl) {
  for (var w = 0; w < WEEKS; w++) {
    var key = pl.name + ':' + w, n = POST_COUNT[pl.tier] || 4;
    for (var i = 0; i < n; i++) {
      var nm = HIRE_NAMES[seedOf(key + ':name:' + i) % HIRE_NAMES.length], look = POST_LOOKS[seedOf(key + ':look:' + i) % 12];
      recruits++; if (crewOnFace[look]) onCrewFace++; if (WOMAN_NAMES.indexOf(nm) >= 0) womanName++;
      (namesOnFace[look] = namesOnFace[look] || {})[nm] = 1;
    }
  }
});
var perFace = Object.keys(namesOnFace).map(function (k) { return Object.keys(namesOnFace[k]).length; });
var MEASURED = {
  places: where.places.length, weeks: WEEKS, recruits: recruits,
  recruits_wearing_a_crewmates_face: onCrewFace,
  share_wearing_a_crewmates_face: +(onCrewFace / recruits).toFixed(3),
  crew_faces_taken_by_the_starting_crew: Object.keys(crewOnFace).filter(function (k) { return k !== 'you'; }).length,
  cast_faces: CAST.length,
  free_cast_faces: CAST.filter(function (l) { return !crewOnFace[l]; }),
  names_one_face_carries_min: Math.min.apply(null, perFace), names_one_face_carries_max: Math.max.apply(null, perFace),
  recruits_with_a_womans_name: womanName,
  how: 'the post\'s own seedOf, HIRE_NAMES, POST_COUNT and look roll, lifted from slices/BOHEMIA_SETTLEMENT_SCREEN.html, keyed place:week as recruitsHere keys them, an ordinary week (no trait moving the count), the 26 places of who lives where, 13 weeks'
};

/* ---- 2. WHO EACH FACE IS ---- */
MEASURED.names_each_face_carries = {};
Object.keys(namesOnFace).sort().forEach(function (k) { MEASURED.names_each_face_carries[k] = Object.keys(namesOnFace[k]).sort(); });
MEASURED.why_four = 'the name roll (% 16) and the look roll (% 12) hash the same key with one word changed; both moduli are multiples of 4, and the low two bits of the post\'s FNV hash come out tied, so a face only ever meets the four names whose index matches its own mod 4';
var FACES = ['you'].concat(CAST).concat(['thug', 'poacher']);
Object.keys(man.faces).forEach(function (k) { if (FACES.indexOf(k) < 0) throw new Error('TOOL BUG: PORTRAIT shipped a face this tool does not know: ' + k); });

/* WHAT THE FACE READS AS (mine, from the 128 rest face and the look's worn list, never from skin):
   PORTRAIT's thirteen share one skull, so sex is read off the hair and the clothes the look was
   built from; PORTRAIT's dials (its next round) make the three women read as women. */
var READS = {
  you:            { sex: 'm', age: 'young', why: 'fight_people: "the player as he stands"' },
  cast_longcoat:  { sex: 'm', age: 'grown', why: 'temple taper, wasteland duster' },
  cast_barearms:  { sex: 'm', age: 'grown', why: 'coil crown, soot tank, brick suspenders' },
  cast_pack:      { sex: 'm', age: 'grown', why: 'dry taper under a storm knit cap, olive mantle' },
  cast_skirt:     { sex: 'f', age: 'grown', why: 'curtain cut, ankle wrap skirt' },
  cast_widebrim:  { sex: 'm', age: 'grown', why: 'deep taper, dust plaid, scav tool belt' },
  cast_cape:      { sex: 'm', age: 'old',   why: 'grey shag, road cape, trailing scarf' },
  cast_apron:     { sex: 'm', age: 'old',   why: 'grey deep taper, smith\'s apron' },
  cast_poncho:    { sex: 'f', age: 'old',   why: 'white curtain cut to the jaw, oxblood poncho' },
  cast_bedroll:   { sex: 'm', age: 'grown', why: 'temple taper, dust work cap, a bedroll' },
  cast_shorts:    { sex: 'm', age: 'young', why: 'blond coil crown, striped tee, charcoal shorts' },
  cast_satchel:   { sex: 'm', age: 'young', why: 'dry taper under a watch cap, salvage satchel' },
  cast_shortcoat: { sex: 'f', age: 'young', why: 'layered fall, leather jacket, slouch beanie' },
  thug:           { sex: 'm', age: 'grown', why: 'COOK THREE\'s thug: buzz, stubble, knit cap' },
  poacher:        { sex: 'm', age: 'grown', why: 'COOK THREE\'s poacher: black curls, field hat' }
};
/* the given names by how they read (the names mix carries no sex, and the post's 16 put five
   women's names on men's backgrounds); 'x' reads either way */
var SEX = {};
'Ignacio Amaury Ruben Terrence Kwame Odell Booker Delroy Rashad Jamal Tyrell Deshawn Andre Marcus Hoang Minh Jin Arnel Jun Danilo Dante Silas Ambrose Bishop Ezekiel Casimir Otis Malachi Everett Tobias Cyrus Jonah Wendell Amos Horace Emmett Abel Milo Roman Jarvis Wyatt Nolan Wade Clyde Garrett Harlan Travis Colton Cody Dustin Shane Kyle'
  .split(' ').forEach(function (n) { SEX[n] = 'm'; });
'Marisol Rosa Imelda Lupe Nayeli Consuelo Araceli Guadalupe Paloma Xiomara Yolanda Perla Estella Socorro Anahi Renata Marisela Citlali Ofelia Belen Idalia Reyna Lourdes Esperanza Clemencia Adaeze Latrice Keisha Tasha Monique Ebony Thuy Linh Trinh Mei Priya Rowena Marites Liza Juniper Nadia Opal Pearl Hazel Fern Loretta Bonnie Della Rachel Heather Amber Megan Shannon Brooke Carly Jodie Tammy Lacey Corinne'
  .split(' ').forEach(function (n) { SEX[n] = 'f'; });
'Kai Sunny Dana Anh'.split(' ').forEach(function (n) { SEX[n] = 'x'; });
/* THE HOLE THIS ROUND FILLS: the names mix's Hispanic given pool is 25 women and 3 men (Ignacio,
   Amaury, Ruben), so a Hispanic man drew one of three names 65% of the time. Ten of the commonest
   given names of Hispanic men in the US, none a joke name to an American ear (Pancho and Nacho stay out). */
var ADDED_HISPANIC_MEN = ['Hector', 'Javier', 'Armando', 'Octavio', 'Efrain', 'Rogelio', 'Sergio', 'Jorge', 'Raul', 'Esteban'];
ADDED_HISPANIC_MEN.forEach(function (n) { SEX[n] = 'm'; });

var PG = JSON.parse(JSON.stringify(names.pools.given)), PS = names.pools.surname;
PG.hispanic = PG.hispanic.concat(ADDED_HISPANIC_MEN);
Object.keys(PG).forEach(function (k) { PG[k].forEach(function (n) { if (!SEX[n]) throw new Error('TOOL BUG: no sex reading for ' + n); }); });

function h(key) { return seedOf('who-the-face-is:' + key); }
/* the heritages, counted from the census the names mix cites (largest remainder over the faces),
   then dealt to the faces in an order the hash sets: skin never decides (the 8/27 law keeps the
   valley's complexions uniform until he rules, so a name may not be read off a skin) */
var HS = names.heritage_share, HK = Object.keys(HS), N = FACES.length;
var quota = HK.map(function (k) { return { k: k, n: Math.floor(HS[k] * N), r: HS[k] * N - Math.floor(HS[k] * N) }; });
var left = N - quota.reduce(function (a, q) { return a + q.n; }, 0);
quota.slice().sort(function (a, b) { return b.r - a.r; }).slice(0, left).forEach(function (q) { q.n++; });
var deck = []; quota.forEach(function (q) { for (var i = 0; i < q.n; i++) deck.push(q.k); });
var order = FACES.slice().sort(function (a, b) { return h('order:' + a) - h('order:' + b); });
var HERITAGE = {}; order.forEach(function (f, i) { HERITAGE[f] = deck[i]; });

function byRule(rule, her, u) {
  if (rule[her] === 'any') return null;
  var keys = Object.keys(rule[her]), acc = 0, x = (u % 10000) / 10000;
  for (var j = 0; j < keys.length; j++) { acc += rule[her][keys[j]]; if (x < acc || j === keys.length - 1) return keys[j]; }
}
/* THE ORIGIN RULE (this round's second finding): the names mix's 'rest' surnames hold five West
   African ones beside the English and European, and its 'asian' pools hold five peoples in one list,
   so its own rule hands a white man 'Amadi' and pairs a Filipino first name with a Vietnamese surname.
   Here: a white, Hispanic or Asian person's crossover surname is never a West African one; an Asian
   person's Asian given name comes from the same people as the surname (else a common name, which is
   how most Japanese and Korean Americans are named); an African given name goes with an African surname. */
var ORIGIN = {};
'Okonkwo Amadi Adeyemi Osei Achebe Adaeze Kwame'.split(' ').forEach(function (n) { ORIGIN[n] = 'west_african'; });
'Thuy Linh Hoang Trinh Minh Anh Nguyen Pham Duong Tran Truong Chu'.split(' ').forEach(function (n) { ORIGIN[n] = 'vietnamese'; });
'Arnel Jun Rowena Marites Danilo Liza Bautista Pascual Tolentino Dizon Manalo Macaraeg'.split(' ').forEach(function (n) { ORIGIN[n] = 'filipino'; });
'Kimura Nakamura Yamada'.split(' ').forEach(function (n) { ORIGIN[n] = 'japanese'; });
'Park Jin'.split(' ').forEach(function (n) { ORIGIN[n] = 'korean'; });
'Vue Thao'.split(' ').forEach(function (n) { ORIGIN[n] = 'hmong'; });
'Mei'.split(' ').forEach(function (n) { ORIGIN[n] = 'chinese'; });
'Priya'.split(' ').forEach(function (n) { ORIGIN[n] = 'indian'; });
var taken = {};
function nameFor(face) {
  var her = HERITAGE[face], sex = READS[face].sex;
  for (var tries = 0; tries < 64; tries++) {
    var sk = byRule(names.surname_rule, her, h(face + ':spool:' + tries)) || Object.keys(PS)[h(face + ':sany:' + tries) % 3];
    var spool = PS[sk].filter(function (n) { return her === 'black' || her === 'mixed' || ORIGIN[n] !== 'west_african'; });
    var sur = spool[h(face + ':sur:' + tries) % spool.length];
    var gk = byRule(names.given_rule, her, h(face + ':gpool:' + tries)) || Object.keys(PG)[h(face + ':gany:' + tries) % 4];
    var gpool = PG[gk].filter(function (n) {
      if (SEX[n] !== sex && SEX[n] !== 'x') return false;
      if (her === 'mixed') return true;
      if (gk === 'asian') return ORIGIN[n] === ORIGIN[sur];
      if (ORIGIN[n] === 'west_african') return ORIGIN[sur] === 'west_african';
      return true;
    });
    if (!gpool.length) { gk = 'common'; gpool = PG.common.filter(function (n) { return SEX[n] === sex || SEX[n] === 'x'; }); }
    var given = gpool[h(face + ':given:' + tries) % gpool.length];
    if (taken[given] || taken[sur]) continue;   /* fifteen people, fifteen first names and fifteen surnames */
    taken[given] = taken[sur] = 1;
    return { given: given, surname: sur, full: given + ' ' + sur, heritage: her, given_pool: gk, surname_pool: sk, sex: sex, origin: ORIGIN[sur] || null };
  }
  throw new Error('TOOL BUG: no free name for ' + face);
}

/* what they do: the crew screen's own background for a face a crew member wears today (so the
   stats and the gear the roster already rolled stay his), BB's tier for the two enemy heads, and
   for the one face nobody wears, a draw off the hire roll of the place he comes from */
var ENEMY = { thug: { background: 'raider', tier: 'brigand_thug' }, poacher: { background: 'poacher', tier: 'brigand_poacher' } };
function rollAt(pl, u) {
  var tot = pl.base_roll.reduce(function (a, r) { return a + r.pct; }, 0), x = (u % 100000) / 100000 * tot, acc = 0;
  for (var i = 0; i < pl.base_roll.length; i++) { acc += pl.base_roll[i].pct; if (x < acc) return pl.base_roll[i]; }
  return pl.base_roll[pl.base_roll.length - 1];
}
function homeFor(face, bg) {
  /* weighted by the chance BB's own book gives that background at each place: where men like him are hired */
  var rows = []; where.places.forEach(function (pl) { pl.base_roll.forEach(function (r) { if (r.id === bg) rows.push({ pl: pl, pct: r.pct }); }); });
  if (!rows.length) throw new Error('TOOL BUG: no place hires a ' + bg);
  var tot = rows.reduce(function (a, r) { return a + r.pct; }, 0), x = (h(face + ':home') % 100000) / 100000 * tot, acc = 0;
  for (var i = 0; i < rows.length; i++) { acc += rows[i].pct; if (x < acc) return rows[i]; }
  return rows[rows.length - 1];
}

/* the register: the valley's mix (engine/bohemia_people.js VALLEY_MIX, his 8/26 'proportional, maybe
   slightly less' and his 9/22 'chill with the Spanglish'), counted over the faces that speak; the
   bilingual ones dealt to people of Hispanic heritage; the player never (his first votes, rule 27) */
var MIX = lift(fs.readFileSync('engine/bohemia_people.js', 'utf8'), /var VALLEY_MIX = \{ en: (\d+), spanglish: (\d+), es: (\d+) \}/, 'VALLEY_MIX');
var VM = { en: +MIX[1] / 1000, spanglish: +MIX[2] / 1000, es: +MIX[3] / 1000 };
var speakers = FACES.filter(function (f) { return f !== 'you'; });
var rq = ['en', 'spanglish', 'es'].map(function (k) { return { k: k, n: Math.floor(VM[k] * speakers.length), r: VM[k] * speakers.length - Math.floor(VM[k] * speakers.length) }; });
var rleft = speakers.length - rq.reduce(function (a, q) { return a + q.n; }, 0);
rq.slice().sort(function (a, b) { return b.r - a.r; }).slice(0, rleft).forEach(function (q) { q.n++; });
var bilingual = rq[1].n + rq[2].n;
var hisp = speakers.filter(function (f) { return HERITAGE[f] === 'hispanic'; }).sort(function (a, b) { return h('reg:' + a) - h('reg:' + b); });
var REGISTER = {}; FACES.forEach(function (f) { REGISTER[f] = 'en'; });
hisp.slice(0, rq[1].n).forEach(function (f) { REGISTER[f] = 'spanglish'; });
hisp.slice(rq[1].n, rq[1].n + rq[2].n).forEach(function (f) { REGISTER[f] = 'es'; });

/* ---- 3. THE LINES (the words are attempts, draft:true; written to the person the draw made) ---- */
var LINES = require('./bohemia_people_who_the_face_is_lines.js');

var out = {};
FACES.forEach(function (face) {
  var crewMan = crewOnFace[face] || null, enemy = ENEMY[face] || null, nm = nameFor(face);
  var bg, home;
  if (crewMan) { bg = crewMan.background; home = homeFor(face, bg); }
  else if (enemy) { bg = enemy.background; home = homeFor(face, bg); }
  else {
    var pl = where.places[h(face + ':place') % where.places.length], r = rollAt(pl, h(face + ':bg'));
    bg = r.id; home = { pl: pl, pct: r.pct };
  }
  var skin = where.skin[bg] || {};
  var is = skin.is || bg.replace(/_/g, ' ');
  if (READS[face].sex === 'f') is = is.replace(/\bhis\b/g, 'her').replace(/\bhim\b/g, 'her').replace(/\bhe\b/g, 'she').replace(/\bman\b/g, 'woman').replace(/\bmen\b/g, 'women');
  var line = LINES[face];
  if (!line) throw new Error('TOOL BUG: no line written for ' + face);
  var es = P.esWordsIn(line);
  var mo = mouthOf(line), games = visemesOf(line).length;
  var files = man.faces[face] ? man.faces[face].files : null;
  if (!files) {
    files = {}; ['rest'].concat(man.keys.slice(1)).forEach(function (k) {
      files[k] = RIG + face + '/rig_portrait_S' + (k === 'rest' ? '' : '_' + k) + '.png';
      if (!fs.existsSync(files[k])) throw new Error('TOOL BUG: PORTRAIT\'s ' + face + ' head has no ' + k);
    });
  }
  out[face] = {
    face: face, face_files: files,
    on_the_crew_screen_today: crewMan ? crewMan.name : null,
    reads_as: READS[face],
    name: nm,
    home: { id: home.pl.id, name: home.pl.name, tier: home.pl.tier, why: 'a ' + bg.replace(/_/g, ' ') + ' is ' + home.pct + '% of a hire roll there (BB\'s own book, who lives where)' },
    who: nm.full + ', ' + is + ', from ' + home.pl.name.replace(/ \(.*\)$/, '').replace(/\b([A-Z])([A-Z]+)\b/g, function (a, b, c) { return b + c.toLowerCase(); }),
    does: { background: bg, is: is, tier: enemy ? enemy.tier : null, source: crewMan ? 'the crew screen\'s own (ours.json crew, manOf\'s look rule)' : enemy ? 'BB\'s tier COOK THREE modelled' : 'the hire roll at his home' },
    line: { text: line, register: REGISTER[face], es_words: es, speaker_is_player: face === 'you', draft: true },
    mouth: { ms_per_key: 125, per_beat: 4, bpm: 120, keys: mo.keys, syllables: mo.syllables, seconds: +(mo.keys.length * 0.125).toFixed(3),
      the_games_rule_today: { shapes: games, ms_per_shape: 250, seconds: +(games * 0.25).toFixed(2) } },
    draft: true
  };
});

var bank = {
  _about: 'WHO THE FACE IS (PEOPLE, 10/18/26, row [a name for every starred face], rule 115(h)). Every face PORTRAIT shipped the starred way (the 13 the crew and scavenge screens show, and the thug and poacher heads) gets ONE person: a name from the names mix, the place they live, what they do, one line in their own register, and the mouth that says it in PORTRAIT\'s own shape keys at half a beat a shape. Keyed by the face\'s own id, the same key as PORTRAIT\'s manifest. Under the hold (rule 88): draft:true, nothing live reads it; RUN TWO wires it when the hold lifts.',
  draft: true, tuned: false,
  row: 'PEOPLE [a name for every starred face] WHO-THE-FACE-IS',
  rule: '115h; ONE ID, ONE WHOLE PERSON (8/27); THEY SPEAK SPANGLISH (8/25) as dialled (8/26) and amended (9/22: the player never)',
  reads: [MANIFEST, RIG + '{thug,poacher}/', NAMES, WHERE, OURS, 'engine/bohemia_roster.js manOf', 'slices/BOHEMIA_SETTLEMENT_SCREEN.html recruitsHere', 'slices/BOHEMIA_ALPHA_0_9.html visemesOf', 'engine/bohemia_people.js esWordsIn, ES_LEX, VALLEY_MIX'],
  measured: MEASURED,
  heritage_count: quota.reduce(function (o, q) { o[q.k] = q.n; return o; }, {}),
  register_count: rq.reduce(function (o, q) { o[q.k] = q.n; return o; }, {}),
  added_hispanic_men_given: ADDED_HISPANIC_MEN,
  english_additions: ['cutting', 'meat'],   /* plain English words in a bilingual line the words book has never said; the gate proves none is Spanish */
  given_sex: SEX,
  the_post_rule: {
    draft: true,
    rule: 'ONE KEY DRAWS THE MAN. A recruit\'s face and name come from one person, never two rolls: a starred face at a post is the person this bank says it is, with his name, his home and his past; a face already on the roster never stands at a post; past the free starred faces a stranger is drawn whole (name by the names mix and the given_sex reading, face by PORTRAIT\'s dials when they land, the sheet face until then).',
    why: 'Battle Brothers draws a recruit once, as one man: his name, his face and his past are one object made at the post (recall, the 06 backgrounds study); our post rolls the name and the face with two different hashes, so one face is many men and a hired man can be a crewmate\'s twin',
    route: 'RUN TWO (recruitsHere; the roster\'s faceCanvas); COMBAT or whoever owns ours.json for the crew names; PORTRAIT for the three women\'s dials'
  },
  faces: out
};

FACES.forEach(function (f) {
  var p = out[f];
  console.log((f + '                ').slice(0, 16) + (p.name.full + '                    ').slice(0, 22) + ('(' + p.name.heritage + ', ' + p.reads_as.sex + ', ' + p.reads_as.age + ')                ').slice(0, 22)
    + (p.home.name + '                         ').slice(0, 26) + (p.does.background + '               ').slice(0, 16) + p.line.register + '  ' + p.mouth.seconds + 's (game ' + p.mouth.the_games_rule_today.seconds + 's, ' + p.mouth.syllables + ' syl)  [' + p.line.es_words.join(',') + ']  was ' + p.on_the_crew_screen_today);
  console.log('                ' + p.line.text);
});
console.log('\nMEASURED: ' + JSON.stringify(MEASURED));
console.log('heritage ' + JSON.stringify(bank.heritage_count) + '  register ' + JSON.stringify(bank.register_count));
if (!CHECK) { fs.writeFileSync(OUT, JSON.stringify(bank, null, 1) + '\n'); console.log('wrote ' + OUT); }
