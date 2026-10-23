#!/usr/bin/env node
/* BOHEMIA ASK THE CROWD GATE (10/19/26, PEOPLE lane).
 * Row [ask the crowd] WHO-ARE-YOU-ON-THE-STREET: every person you tapped in a place's crowd spoke as SOMEBODY ON THE
 * STREET for ever and there was no way to ask, while the people engine's own ruling is A NAME IS EARNED, NEVER GIVEN.
 * Now you can ask; they answer from the one roll (engine/bohemia_names.js) keyed by the place and their spot in the
 * crowd, the name reading as the face; the place remembers, and the next visit the bubble says the name.
 * And rule 120(d) (Paolo 10/18: 'the portraits don't even look alike, Black people looking like white people'):
 * a name, a face and a body are one person, so the people whose face and body disagree are measured and handed to
 * PORTRAIT and CHARACTER, and the debt can only shrink.
 *
 * PROVES:
 *   A  THE SCREEN IS WIRED: a crowd person carries their spot; the sheet keys them by place and spot, never by the
 *      draw order (night and market day reorder the crowd); the bubble is SOMEBODY ON THE STREET until asked and the
 *      name after; 'Who are you?' only for a stranger, in English; the answer is the roll at 'crowd:' + place + spot
 *      with the face's reading; the place remembers (bohemia.met.v1), the game is told (met) and can hand it back
 *   B  THE ROLL: a crowd person's name is two words, the same every time, reads as the face (every face the street
 *      wears is read but the one whose face and body disagree), and 1,000 crowd keys keep the county's mix; every
 *      roll carries a skin band inside its background's range, and the skin moved no name; a roll handed a known
 *      skin (CHARACTER's [one skin, one person]) names a person who fits it, 1,000 of 1,000, and over skins dealt the
 *      county's way the backgrounds stay the county's
 *   C  THE REAL SCREEN, MEASURED (records/people/ASK_THE_CROWD.json, tools/bohemia_people_ask_the_crowd.js): every
 *      person reached was a stranger first; every one asked answered with the roll in their own line; every later
 *      visit (night, market day) and a new session showed the right name or the stranger; the same spot wore the same
 *      look; no page error; and the record is today's roll, not a stale one
 *   D  RULE 120(d), THE DEBT CAN ONLY SHRINK: the skin is re-measured from the files the game draws (the bodies, the
 *      sheet faces, PORTRAIT's fresh portraits) against the committed 10/19 record; no look may newly disagree with
 *      its body, and the count of looks that disagree may never grow past the baseline (25 of 26). A face fixed is
 *      never a red here: it is printed so the record gets refreshed
 *   E  the page exists with the finding, the [bb and [ah lines, the hand-off and a ROUTED section; the VOTE item is
 *      registered, PEOPLE's, two sentences, showing the sheet
 *
 *   node gates/ask_the_crowd_gate.js
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

var N = require(path.join(ROOT, 'engine/bohemia_names.js'));
var MIX = N.MIX;
var SCREEN = fs.readFileSync('slices/BOHEMIA_SETTLEMENT_SCREEN.html', 'utf8');
var PLACES = JSON.parse(fs.readFileSync('banks/BOHEMIA_WHO_LIVES_WHERE_10_17_26.json', 'utf8')).places;
var MIXBANK = JSON.parse(fs.readFileSync('banks/BOHEMIA_THE_NAMES_MIX_10_18_26.json', 'utf8'));
var REC = JSON.parse(fs.readFileSync('records/people/ASK_THE_CROWD.json', 'utf8'));
var SKIN = JSON.parse(fs.readFileSync('records/people/THE_FACE_IS_THE_BODYS.json', 'utf8'));
var PAGE = 'records/BOHEMIA_PEOPLE_ASK_THE_CROWD_10_19_26.md';
var VOTE_ID = 'people-ask-the-crowd-10-19';
var STREET_LOOKS = Object.keys(JSON.parse(fs.readFileSync('slices/settlement_people/settlement_people.json', 'utf8')).looks);
var UNREAD_ON_PURPOSE = ['faction_anarchists'];   /* a hood on the face, long hair on the body: nothing honest to read */
var BASELINE_DISAGREE = 25;                        /* 10/19: 25 of 26 looks wear a face 2 to 5 bands off their body */

function fn(src, name) {   /* lift one function's source out of the screen, by brace count */
  var i = src.indexOf('function ' + name + '(');
  if (i < 0) return null;
  var d = 0, j = src.indexOf('{', i);
  for (var k = j; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) return src.slice(i, k + 1); } }
  return null;
}

head('A  the screen is wired');
var folkSrc = fn(SCREEN, 'folkList'), openSrc = fn(SCREEN, 'openPerson'), askSrc = fn(SCREEN, 'askCrowd'),
  rollSrc = fn(SCREEN, 'crowdRoll'), keySrc = fn(SCREEN, 'crowdKey'), nameSrc = fn(SCREEN, 'crowdName'), openAll = fn(SCREEN, 'open');
ok('a crowd person carries their spot in the crowd', !!folkSrc && /out\.push\(\{crowd:true, slot:q,/.test(folkSrc));
ok('the sheet keys a person by place and spot, never by the draw order', !!keySrc && /S\.place\.name \+ ':' \+ p\.slot/.test(keySrc) &&
  !!openSrc && openSrc.indexOf('indexOf(p)') < 0 && /'settle-crowd:' \+ crowdKey\(p\)/.test(openSrc));
ok('the bubble is SOMEBODY ON THE STREET until asked, the name after', !!openSrc &&
  /n\.textContent = name \? name\.toUpperCase\(\) : 'SOMEBODY ON THE STREET'/.test(openSrc) && /name = crowdName\(p\)/.test(openSrc));
ok('\'Who are you?\' only for a stranger, and it asks', !!openSrc && /if\(!name && window\.BohemiaNames\)/.test(openSrc) &&
  /act\('Who are you\?', '', function\(\)\{ askCrowd\(p\); \}\)/.test(openSrc));
ok('the answer is the one roll at the crowd key with the face\'s reading (10/23: a rolled person\'s beard and skin band read too)', !!rollSrc &&
  /BohemiaNames\.roll\('crowd:' \+ crowdKey\(p\), \{sex: BohemiaNames\.faceReads\(p\.look\)( \|\| \(P && P\.sex\), skin: P \? P\.skin : undefined)?\}\)/.test(rollSrc) && !!askSrc && /crowdRoll\(p\)/.test(askSrc));
ok('the place remembers, under its own key, and the game is told', /var METKEY = 'bohemia\.met\.v1'/.test(SCREEN) && !!askSrc &&
  /metRec\(\)\[crowdKey\(p\)\] = \{name:n\.full/.test(askSrc) && /metSave\(\)/.test(askSrc) && /post\('met', \{who:'settle-crowd:' \+ crowdKey\(p\), name:n\.full/.test(askSrc) &&
  !!nameSrc && /metRec\(\)\[crowdKey\(p\)\]/.test(nameSrc));
ok('the game\'s save can hand the met back', !!openAll && /if\(o\.met && typeof o\.met === 'object'\)\{ S\.met = o\.met; metSave\(\); \}/.test(openAll));
ok('a face handed while a person speaks reopens the person, not a building called person',
  /if\(S\.open === 'person' && S\.person\) openPerson\(S\.person\); else if\(S\.open\) openB\(S\.open\);/.test(SCREEN) &&
  !/BOHEMIA_SETTLEMENT_FACE' && d\.who\)\{ S\.faces\[d\.who\] = d\.src; if\(S\.open\) openB\(S\.open\); \}/.test(SCREEN));
ok('the screen loads the roller before its own script', SCREEN.indexOf('../engine/bohemia_names.js') > 0 &&
  SCREEN.indexOf('../engine/bohemia_names.js') < SCREEN.indexOf('var METKEY'));
/* the answer lines: English, the name in every one, Spanish only from somebody whose people speak it */
var says = (SCREEN.match(/var SAYS_NAME = \[([\s\S]*?)\];/) || [])[1] || '';
var lines = says.match(/"[^"]*"/g) || [];
ok('five answer lines, each says the whole name', lines.length === 5 && lines.every(function (l) { return l.indexOf('{full}') >= 0; }), lines.length + ' lines');
var saysSrc = fn(SCREEN, 'saysName');
ok('the Spanish answer only from a Hispanic background, a third of the time', !!saysSrc &&
  /n\.heritage === 'hispanic' && R\(\) < \.34\) \? SAYS_NAME_ES/.test(saysSrc));

head('B  the roll');
var looksRead = STREET_LOOKS.filter(function (l) { return !!N.faceReads(l); });
ok('every face the street wears is read, but the one left unread on purpose',
  STREET_LOOKS.filter(function (l) { return !N.faceReads(l); }).join(',') === UNREAD_ON_PURPOSE.join(','),
  looksRead.length + ' of ' + STREET_LOOKS.length + ' read');
var keys = [], bad = { two: 0, same: 0, face: 0, skin: 0 }, her = {}, hisp = 0;
for (var i = 0; i < 1000; i++) {
  var pl = PLACES[i % PLACES.length], slot = Math.floor(i / PLACES.length), look = STREET_LOOKS[(i * 7 + slot) % STREET_LOOKS.length];
  var key = 'crowd:' + pl.name + ':' + slot, a = N.roll(key, { sex: N.faceReads(look) }), b = N.roll(key, { sex: N.faceReads(look) });
  if (a.full.split(' ').length !== 2) bad.two++;
  if (a.full !== b.full || a.skin !== b.skin) bad.same++;
  if (N.faceReads(look) && a.sex !== N.faceReads(look)) bad.face++;
  if (!(MIX.skin[a.heritage][a.skin] > 0)) bad.skin++;
  her[a.heritage] = (her[a.heritage] || 0) + 1; if (N.readsHispanic(a.full)) hisp++;
}
ok('every crowd name is two words', bad.two === 0);
ok('the same key is the same person, name and skin, every time', bad.same === 0);
ok('where the face is read, the name reads as the face, 1,000 of 1,000', bad.face === 0, (1000 - bad.face) + ' of 1000');
var share = MIXBANK.heritage_share || MIXBANK.heritage || MIX.heritage;
var off = Object.keys(MIX.heritage).filter(function (h) { return Math.abs((her[h] || 0) / 10 - MIX.heritage[h]) > 4.5; });
ok('1,000 crowd keys keep the county\'s five backgrounds within 4.5 points', off.length === 0,
  Object.keys(MIX.heritage).map(function (h) { return h + ' ' + ((her[h] || 0) / 10).toFixed(1); }).join(', '));
ok('the crowd reads Hispanic within five points of the census (33.4%)', Math.abs(hisp / 10 - 33.4) <= 5, (hisp / 10).toFixed(1) + '%');
ok('every roll\'s skin band is inside its background\'s range', bad.skin === 0);
ok('the skin bands are the ITA scale\'s six, lightest first', JSON.stringify(MIX.skinBands) === JSON.stringify(['very light', 'light', 'intermediate', 'tan', 'brown', 'dark']));
ok('every background\'s skin range uses only those bands', Object.keys(MIX.skin).every(function (h) {
  return Object.keys(MIX.skin[h]).every(function (b) { return MIX.skinBands.indexOf(b) >= 0; }); }) && Object.keys(MIX.skin).sort().join() === Object.keys(MIX.heritage).sort().join());
ok('skinAgrees reads the range: a dark face never agrees with a white background, a brown one with a Hispanic one does',
  !N.skinAgrees('white', 'dark') && N.skinAgrees('hispanic', 'brown') && N.skinAgrees('black', 'dark') && N.skinAgrees('white', null));
/* THE NAME FOLLOWS A KNOWN SKIN (for CHARACTER's [one skin, one person]: the body is the truth): deal 1,000 people the
   county's way, hand each one's band to a fresh roll, and every name fits its skin while the backgrounds stay the county's */
var fit = 0, her2 = {};
for (var j = 0; j < 1000; j++) {
  var dealt = N.roll('gate-deal:' + j), named = N.roll('gate-name:' + j, { skin: dealt.skin });
  if (named.skin === dealt.skin && N.skinAgrees(named.heritage, dealt.skin)) fit++;
  her2[named.heritage] = (her2[named.heritage] || 0) + 1;
}
ok('a person whose skin is known gets a name that fits it, 1,000 of 1,000', fit === 1000, fit + ' of 1000');
var off2 = Object.keys(MIX.heritage).filter(function (h) { return Math.abs((her2[h] || 0) / 10 - MIX.heritage[h]) > 4.5; });
ok('and over skins dealt the county\'s way the backgrounds stay the county\'s', off2.length === 0,
  Object.keys(MIX.heritage).map(function (h) { return h + ' ' + ((her2[h] || 0) / 10).toFixed(1); }).join(', '));
ok('without a skin the roll is unchanged (no caller passes one yet)', N.roll('gate-same:1').full === N.roll('gate-same:1', { skin: 'nonsense' }).full);
/* the skin is its own stream: the twelve names on the names-wired-in sheet are still the roll for their slot */
var wired = JSON.parse(fs.readFileSync('records/people/THE_NAMES_WIRED_IN.json', 'utf8')).cards;
ok('adding the skin moved no name (the twelve on the 10/18 sheet still roll the same)', wired.length === 12 && wired.every(function (c) {
  return N.roll('post:' + c.place + ':' + c.week + ':' + c.slot, { sex: N.faceReads(c.look) }).full === c.name; }));

head('C  the real screen, measured');
var m = REC.measured;
ok('the record covers the 26 places', m.places === 26 && PLACES.length === 26);
ok('most of the crowd can be reached by a finger (RUN TWO owns the rest)', m.reached >= 80 && m.unreachable.length <= 13,
  m.reached + ' of ' + m.crowd_people + ', ' + m.unreachable.length + ' covered by a nearer person');
ok('every person reached was a stranger with \'Who are you?\' first', m.stranger_first === m.reached, m.stranger_first + ' of ' + m.reached);
ok('every person asked answered with the roll, in their own line', m.asked >= 50 && m.answered_with_the_roll === m.asked, m.answered_with_the_roll + ' of ' + m.asked);
ok('every name asked reads as the face', m.name_reads_as_face_sex === m.asked);
ok('every later visit, night and market day, showed the name or the stranger', m.later_visits >= 200 && m.later_visits_right === m.later_visits,
  m.later_visits_right + ' of ' + m.later_visits);
ok('the same spot wore the same look at every visit', /^(\d+) of \1$/.test(m.later_same_look), m.later_same_look);
ok('a new session kept every name asked and every stranger', m.new_session >= 75 && m.new_session_right === m.new_session, m.new_session_right + ' of ' + m.new_session);
ok('no page error in the whole walk', m.page_errors === 0);
var stale = REC.people.filter(function (r) { return r.asked && N.roll('crowd:' + r.place + ':' + r.slot, { sex: N.faceReads(r.look) }).full !== r.roll; });
ok('the record is today\'s roll', stale.length === 0, stale.length + ' stale');
ok('the answers in the record say the name the bubble shows', REC.people.filter(function (r) { return r.asked; }).every(function (r) {
  return r.after.nm === r.roll.toUpperCase() && r.after.line.indexOf(r.roll) >= 0 && r.after.ask === false; }));

head('D  rule 120(d): the face is the body\'s, the debt can only shrink');
var now = null;
try {
  now = JSON.parse(cp.execFileSync('python3', ['-c', 'import sys, json; sys.path.insert(0, "tools"); import bohemia_people_skin_measure as m; print(json.dumps(m.measure()))'],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 24 }));
} catch (e) { now = null; }
ok('the skin re-measures from the files the game draws', !!now && Object.keys(now.looks).length === 26);
if (now) {
  var drift = Object.keys(now.looks).filter(function (l) {
    var a = now.looks[l], b = SKIN.looks[l] || {};
    return ['body', 'sheetface', 'portrait'].some(function (k) { return (a[k] && a[k].band) !== (b[k] && b[k].band); });
  });
  /* the committed record is the 10/19 baseline: a face PORTRAIT fixes moves today's measurement off it, and that is
     never a red here (it is the point); it is printed so the record gets refreshed */
  console.log('  note ' + (drift.length ? drift.length + ' look(s) moved since the record (' + drift.join(',') + '); refresh with python3 tools/bohemia_people_skin_measure.py' : 'the record is the measurement today, 26 looks'));
  var dis = Object.keys(now.looks).filter(function (l) { return !now.looks[l].face_agrees_with_body; });
  var newly = dis.filter(function (l) { return SKIN.looks[l] && SKIN.looks[l].face_agrees_with_body; });
  ok('no look newly wears a face that disagrees with its body', newly.length === 0, newly.join(','));
  ok('the looks whose face and body disagree never grow past the baseline', dis.length <= BASELINE_DISAGREE,
    dis.length + ' of 26 disagree (baseline ' + BASELINE_DISAGREE + '; PORTRAIT and CHARACTER shrink it)');
}
var nf = m.name_agrees_with_face_skin || {};
ok('the names against the faces\' skin are counted on all three surfaces', !!nf.post && !!nf.keepers && !!nf.crowd_asked,
  'post ' + nf.post + ', keepers ' + nf.keepers + ', crowd ' + nf.crowd_asked);

head('E  the page and the VOTE item');
var page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : '';
ok('the page exists', !!page);
ok('the page carries the finding and the hand-off', /PROVES US WRONG/.test(page) && /HAND-OFF/.test(page) && /ROUTED/.test(page));
ok('the page has its [bb people] and [ah] lines', /\[bb people\]/.test(page) && /\[ah\]/.test(page));
ok('the page names every look that disagrees', !now || Object.keys(now.looks).filter(function (l) { return !now.looks[l].face_agrees_with_body; })
  .every(function (l) { return page.indexOf(l) >= 0; }));
var reg = JSON.parse(fs.readFileSync('records/target/BOHEMIA_VOTE_REGISTRY.json', 'utf8'));
var it = (reg.items || []).filter(function (x) { return x.id === VOTE_ID; })[0];
ok('the VOTE item is registered, PEOPLE\'s, showing the sheet', !!it && it.lane === 'people' && it.show && it.show.how === 'image' &&
  fs.existsSync(path.join('slices', it.show.src)));
ok('its why is two sentences and says where you see it', !!it && (function (s) { return s.length <= 2 && /\byou (see|hear) it\b/i.test(s[s.length - 1]); })(
  String(it.why || '').trim().split(/(?<=[.!?])\s+/).filter(Boolean)));

console.log('\nASK THE CROWD GATE: ' + (fail ? fail + ' FAILED, ' + pass + ' ok' : pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
