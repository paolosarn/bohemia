/* BOHEMIA WHO VOUCHES GATE (9/5/26, PEOPLE lane).
 * VAMILY [your reputation] -- BOHEMIA_BACKLOG.md row BB-STANDING-PLAYER.
 *
 * THE ROW'S OWN SHAPE: "it is A WEB, NOT A BAR. A job comes from a PERSON, and
 * that person heard about you from someone. The question a favour answers is not
 * 'did my bar go up' but 'who will vouch for me now.'"
 *
 * MEASURED BEFORE BUILDING, AND IT MOVED THE JOB. The player is ALREADY in the
 * person-level web: the walked city calls witness(), opinionOf() and standingOf()
 * with actor '@' in 25 places. What was missing was the WEB'S ANSWER -- this web
 * recorded HOW FAR a story travelled (hops) and never WHO CARRIED IT, so the game
 * could total a reputation and could not name one person who would speak for you.
 *
 * PROVES:
 *   A  the teller travels with the story
 *   B  it returns PEOPLE, not a number, and both sides of the web
 *   C  IT CANNOT INVENT A STANDING HE NEVER RULED: an unweighted deed vouches
 *      for nobody, which is the row's own constraint
 *   D  the chain: who saw it, who heard it, and from whom
 *   E  ON THE REAL SURFACE: the panel is in the walked city under the panel that
 *      already answers "what do they think of me", it renders, and it never
 *      prints a raw mind id at a player
 *
 *   node gates/who_vouches_gate.js
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

var S = require(path.join(ROOT, 'engine/bohemia_standing.js'));
var CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

function mind(o) { return { owner: o, deeds: [], cap: 64 }; }
function fresh() {
  var A = mind('ana'), B = mind('beto'), C = mind('caro');
  return { A: A, B: B, C: C, all: [A, B, C] };
}
function withWeight(kind, w, fn) {
  var had = Object.prototype.hasOwnProperty.call(S.DEED_WEIGHT, kind);
  var old = S.DEED_WEIGHT[kind];
  S.DEED_WEIGHT[kind] = w;
  try { return fn(); } finally { if (had) S.DEED_WEIGHT[kind] = old; else delete S.DEED_WEIGHT[kind]; }
}

head('A. THE TELLER TRAVELS WITH THE STORY');
ok('the module answers the question at all',
  typeof S.whoVouches === 'function' && typeof S.whoWont === 'function');
var t = fresh();
withWeight('probe_deed', 3, function () {
  S.witness([t.A], 10, '@', 'probe_deed', 5, 5, function () { return [5, 5]; }, {});
  S.gossip(t.A, t.B, 12);
});
var told = t.B.deeds.filter(function (d) { return d.actor === '@'; })[0];
ok('*** A RETOLD DEED NOW REMEMBERS WHO TOLD IT ***', !!told && told.from === 'ana',
  told ? ('from=' + told.from + ' hops=' + told.hops) : 'nothing was retold');

head('B. IT RETURNS PEOPLE, AND BOTH SIDES OF THE WEB');
var v = withWeight('probe_deed', 3, function () { return S.whoVouches(t.all, '@', 12); });
ok('*** IT NAMES PEOPLE RATHER THAN TOTALLING A BAR ***',
  v.length >= 2 && typeof v[0].who === 'string' && typeof v[0].rung === 'string',
  v.map(function (x) { return x.who + ':' + x.rung; }).join(', '));
ok('the strongest voucher is first', v.length < 2 || v[0].value >= v[1].value);
ok('a limit is honoured',
  withWeight('probe_deed', 3, function () { return S.whoVouches(t.all, '@', 12, { limit: 1 }).length; }) === 1);
var bad = fresh();
withWeight('bad_deed', -3, function () {
  S.witness([bad.A], 10, '@', 'bad_deed', 5, 5, function () { return [5, 5]; }, {});
});
var wont = withWeight('bad_deed', -3, function () { return S.whoWont(bad.all, '@', 12); });
ok('*** AND IT SAYS WHO WOULD NOT, BECAUSE ONE SIDE OF A WEB IS A BAR ***',
  wont.length === 1 && wont[0].who === 'ana', wont.map(function (x) { return x.who + ':' + x.rung; }).join(', '));
ok('somebody who would not vouch is not counted as one who would',
  withWeight('bad_deed', -3, function () { return S.whoVouches(bad.all, '@', 12).length; }) === 0);

head('C. IT CANNOT INVENT A STANDING HE NEVER RULED');
/* THE ROW'S OWN CONSTRAINT, WORD FOR WORD: "Adding a node must not let this lane
   invent a standing he never ruled." forceOf returns 0 for an unweighted deed,
   so an unruled deed vouches for nobody however many people saw it. */
var un = fresh();
S.witness([un.A, un.B], 10, '@', 'deed_with_no_ruling', 5, 5, function () { return [5, 5]; }, {});
ok('two people watched an UNRULED deed', un.A.deeds.length + un.B.deeds.length >= 1,
  (un.A.deeds.length + un.B.deeds.length) + ' sightings');
ok('*** AND NOBODY VOUCHES, BECAUSE ITS WORTH IS NOT HIS RULING TO SKIP ***',
  S.whoVouches(un.all, '@', 12).length === 0 && S.whoWont(un.all, '@', 12).length === 0);
ok('the module still ships its weight table empty',
  Object.keys(S.DEED_WEIGHT).length === 0, Object.keys(S.DEED_WEIGHT).length + ' entries');

head('D. THE CHAIN: WHO SAW IT, WHO WAS TOLD, AND BY WHOM');
var c = fresh();
var chain = withWeight('probe_deed', 3, function () {
  S.witness([c.A], 10, '@', 'probe_deed', 5, 5, function () { return [5, 5]; }, {});
  S.gossip(c.A, c.B, 12);
  S.gossip(c.B, c.C, 13);
  return S.whoVouches(c.all, '@', 13);
});
var by = {};
chain.forEach(function (x) { by[x.who] = x; });
ok('*** THE EYEWITNESS SAW IT HERSELF ***', !!by.ana && by.ana.sawIt && by.ana.hops === 0);
ok('*** THE SECOND HEARD IT FROM THE EYEWITNESS ***',
  !!by.beto && !by.beto.sawIt && by.beto.from === 'ana',
  by.beto ? ('beto <- ' + by.beto.from + ' (hops ' + by.beto.hops + ')') : 'beto knows nothing');
ok('*** AND THE THIRD HEARD IT FROM THE SECOND ***',
  !!by.caro && !by.caro.sawIt && by.caro.from === 'beto',
  by.caro ? ('caro <- ' + by.caro.from + ' (hops ' + by.caro.hops + ')') : 'caro knows nothing');
ok('and it gets weaker the further it travels',
  !!by.ana && !!by.beto && !!by.caro && by.ana.value > by.beto.value && by.beto.value > by.caro.value,
  by.ana && by.caro ? (by.ana.value.toFixed(2) + ' -> ' + by.beto.value.toFixed(2)
    + ' -> ' + by.caro.value.toFixed(2)) : '');

head('E. IT IS IN THE WALKED CITY, UNDER THE PANEL THAT ALREADY ANSWERS THIS');
ok('the panel exists in the city', CITY.indexOf('__CITY_WHO_VOUCHES__') >= 0);
ok('*** AND IT IS CALLED, NOT JUST DEFINED ***',
  (CITY.split('ctWhoVouchesHtml(').length - 1) >= 3,
  (CITY.split('ctWhoVouchesHtml(').length - 1) + ' occurrences');
ok('it renders directly under WHO HAS LAID EYES ON YOU, not behind a new door',
  /ctSeenByHtml\(\) \+ ctWhoVouchesHtml\(\)/.test(CITY));
/* A NAME IS EARNED, NEVER GIVEN. The panel must never print a mind's owner id at
   a player: the first cut did, and it read "12:12:900 FWU SAW IT". */
var panel = CITY.slice(CITY.indexOf('function ctWhoVouchesHtml'),
                       CITY.indexOf('function ctVouchedHtml'));
ok('*** IT NEVER PRINTS A RAW MIND ID AT A PLAYER ***',
  panel.indexOf('String(v.who)') < 0 && panel.indexOf('String(w.who)') < 0
  && panel.indexOf('headingOf') > 0);
ok('and the city carries the version of the module that can answer this',
  CITY.indexOf('whoVouches:whoVouches') > 0 && CITY.indexOf('from:from.owner') > 0);

console.log('\n' + (fail ? 'WHO VOUCHES GATE: ' + fail + ' FAILED, ' + pass + ' ok'
  : 'WHO VOUCHES GATE: ' + pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
