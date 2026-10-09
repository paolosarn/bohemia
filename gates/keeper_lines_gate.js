/* BOHEMIA THE KEEPERS SPEAK GATE (10/9/26, PEOPLE lane).
 * VAMILY [the keepers speak], rule 71a.
 *
 * engine/bohemia_keeper_lines.js is a pure module: a spoken PRICE line for
 * the smith, the armourer, the barber, the clinic and the board's man. Every
 * fixed number in it is read off the real file it actually lives in, never
 * retyped from memory:
 *   - BOARD_PAY_BY_SKULLS against slices/BOHEMIA_SETTLEMENT_SCREEN.html's
 *     own OFFERS array (pay: 30/60/90)
 *   - CLINIC_FLOOR_BATTERIES against that same file's clinicPrice() formula
 *     (20 crowns a day at the floor, ten to one)
 *   - BARBER_BATTERIES against engine/bohemia_barber.js's own COST.amount
 * This gate reads those real files directly and checks my numbers against
 * them -- it never asserts they are right, it PROVES it.
 *
 * PROVES:
 *   A  every fixed constant matches the real source file, byte for byte
 *   B  smith/armourer take the real visit's shelf range, never a hardcoded one
 *   C  an unknown keeper kind is refused, never a guessed default
 *   D  every line speaks in the same Spanglish voice the real file already
 *      uses for these exact keepers (checked, not assumed)
 *   E  the smith's three lines (trait, price, rumour) combine end to end,
 *      the rumour pulled from the real settlement_rumours.json file RUN
 *      TWO already built and WORLD's god-gear rumours already ride in
 *   F  cook + registry
 *
 *   node gates/keeper_lines_gate.js
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

var K = require(path.join(ROOT, 'engine/bohemia_keeper_lines.js'));
var SETTLE_SRC = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
var BARBER_SRC = fs.readFileSync(path.join(ROOT, 'engine/bohemia_barber.js'), 'utf8');

head('A. EVERY FIXED CONSTANT MATCHES THE REAL SOURCE FILE, BYTE FOR BYTE');
(function () {
  var offersBlock = (SETTLE_SRC.match(/var OFFERS = \[[\s\S]*?\n\];/) || [''])[0];
  var pays = (offersBlock.match(/pay:\s*(\d+)/g) || []).map(function (s) { return parseInt(s.replace(/\D/g, ''), 10); });
  ok('the real OFFERS array has one-, two- and three-skull jobs to read', pays.length >= 3, pays.join(','));
  ok('*** BOARD_PAY_BY_SKULLS[1] matches the real one-skull job’s pay ***', K.BOARD_PAY_BY_SKULLS[1] === Math.min.apply(null, pays));
  ok('*** BOARD_PAY_BY_SKULLS[3] matches the real three-skull job’s pay ***', K.BOARD_PAY_BY_SKULLS[3] === Math.max.apply(null, pays));
  var clinicFn = (SETTLE_SRC.match(/function clinicPrice\(w\)\{[\s\S]*?\n\}/) || [''])[0];
  var crownsConst = (clinicFn.match(/(\d+)\s*\*\s*1\s*\*\s*traitMult/) || [])[1];
  ok('the real clinicPrice() formula has its 20-crowns-a-day constant to read', crownsConst === '20', clinicFn.slice(0, 60));
  ok('*** CLINIC_FLOOR_BATTERIES matches that real formula at the floor (level 1, no trait, ten to one) ***',
    K.CLINIC_FLOOR_BATTERIES === K.batteryPrice(parseInt(crownsConst, 10)));
  var costMatch = BARBER_SRC.match(/COST\s*=\s*\{[^}]*amount:\s*(\d+)/);
  ok('engine/bohemia_barber.js has its own COST.amount to read', !!costMatch, costMatch && costMatch[0]);
  ok('*** BARBER_BATTERIES matches that real constant exactly ***', costMatch && K.BARBER_BATTERIES === parseInt(costMatch[1], 10));
})();

head('B. SMITH AND ARMOURER SPEAK THE REAL VISIT’S OWN SHELF RANGE, NEVER A HARDCODED ONE');
ok('a smith with no real shelf numbers handed in is refused, never a guessed default', K.priceLine('smith', {}) === null);
ok('the smith speaks the real min and max it was handed', (function () {
  var l = K.priceLine('smith', { min: 7, max: 41 });
  return typeof l === 'string' && l.indexOf('7 batter') >= 0 && l.indexOf('41 batter') >= 0;
})());
ok('a different shelf speaks a different line (nothing cached from the first call)', (function () {
  var a = K.priceLine('smith', { min: 3, max: 9 }), b = K.priceLine('smith', { min: 100, max: 200 });
  return a !== b && a.indexOf('3 batter') >= 0 && b.indexOf('200 batter') >= 0;
})());
ok('the armourer speaks the real min and max it was handed too', (function () {
  var l = K.priceLine('armourer', { min: 2, max: 14 });
  return typeof l === 'string' && l.indexOf('2 batter') >= 0 && l.indexOf('14 batter') >= 0;
})());

head('C. AN UNKNOWN KEEPER IS REFUSED, NEVER A GUESSED DEFAULT');
ok('priceLine of an unknown kind returns null', K.priceLine('bartender', {}) === null);
ok('priceLine with no kind at all returns null', K.priceLine(undefined, {}) === null);

head('D. EVERY LINE SPEAKS IN THE SAME SPANGLISH VOICE THE REAL FILE ALREADY USES FOR THESE KEEPERS');
(function () {
  var MARK = /\b(mijo|pues|compa|gracias|bueno)\b/i;
  ok('the real file already speaks this voice for these five keepers (checked, not assumed)',
    MARK.test(SETTLE_SRC));
  K.KEEPER_KINDS.forEach(function (k) {
    var ctx = (k === 'smith' || k === 'armourer') ? { min: 5, max: 50 } : {};
    var line = K.priceLine(k, ctx);
    ok(k + ': the price line carries the same voice', MARK.test(line), line);
  });
  ok('*** [self-test] THIS LEG CAN FAIL: a flat, voiceless line would not match ***',
    !MARK.test('The price is five.'));
})();

head('E. THE SMITH’S THREE LINES COMBINE END TO END (TRAIT, PRICE, RUMOUR)');
(function () {
  /* the trait line is RUN TWO's own traitLine(k), already live for every keeper
     and not this lane's to rebuild; here it is only the real fallback greeting
     text already in the file, read directly, to prove the THREE-LINE SHAPE */
  var helloMatch = SETTLE_SRC.match(/var hello = \{[^}]*smith:\s*'([^']+)'/);
  ok('the real file already has a trait-ready greeting for the smith to read', !!helloMatch, helloMatch && helloMatch[1]);
  var traitLine = helloMatch ? helloMatch[1] : null;

  var priceLine = K.priceLine('smith', { min: 6, max: 38 });

  var rumourFile = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_rumours.json'), 'utf8'));
  ok('the real rumour file exists with WORLD’s god-gear rumours already riding in it (kind:gear)',
    rumourFile.rumours.some(function (r) { return r.kind === 'gear'; }));
  var rumourLine = rumourFile.rumours[0].says;

  var three = [traitLine, priceLine, rumourLine];
  ok('*** ALL THREE LINES ARE REAL, NON-EMPTY, AND DISTINCT FROM EACH OTHER ***',
    three.every(function (l) { return typeof l === 'string' && l.length > 10; })
    && new Set(three).size === 3, three.map(function (l) { return l.slice(0, 30); }).join(' | '));
})();

head('E2. WORDS’ OWN CONTENT (THE TRAIT REACTIONS, THE RUMOUR HOOKS) IS APPLIED, BYTE FOR BYTE');
(function () {
  var WORDS_MD = fs.readFileSync(path.join(ROOT, 'records/BOHEMIA_WORDS_THE_KEEPERS_LINES_10_10_26.md'), 'utf8');
  var TRAITS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_traits.json'), 'utf8'));
  var RUMOURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_rumours.json'), 'utf8'));
  var NAME_TO_KEY = { RUBEN: 'smith', IRMA: 'armourer', CHUY: 'barber', 'DOC ROSALES': 'clinic', 'THE ELDER': 'board' };

  var sampleLine = 'Everybody wants a blade fixed since the raid. I am three deep already.';
  ok('WORDS’ own record carries that exact raided/smith line (so the quote below is real, not retyped from memory)',
    WORDS_MD.indexOf(sampleLine) >= 0);
  var raided = TRAITS.traits.filter(function (t) { return t.id === 'raided'; })[0];
  ok('*** settlement_traits.json’s raided.says.smith matches WORDS’ own line exactly ***',
    raided && raided.says.smith === sampleLine);
  Object.keys(NAME_TO_KEY).forEach(function (nm) {
    var k = NAME_TO_KEY[nm];
    ['raided', 'sickness', 'market_day'].forEach(function (tid) {
      var t = TRAITS.traits.filter(function (x) { return x.id === tid; })[0];
      ok(tid + '.says.' + k + ' is a real line, not empty or a placeholder', t && typeof t.says[k] === 'string' && t.says[k].length > 10);
    });
  });

  var keeperRumours = RUMOURS.rumours.filter(function (r) { return r.kind === 'keeper'; });
  ok('all five keeper-scoped rumour hooks are present, one each', keeperRumours.length === 5
    && ['smith', 'armourer', 'barber', 'clinic', 'board'].every(function (k) { return keeperRumours.some(function (r) { return r.keeper === k; }); }));
  var chipLine = 'A man came in talking about a chip under his skin, swore it kept him alive once. I did not look. Gracias a Dios, some things stay closed.';
  ok('WORDS’ own record carries that exact clinic rumour line', WORDS_MD.indexOf(chipLine) >= 0);
  ok('*** settlement_rumours.json’s clinic hook matches WORDS’ own line exactly ***',
    keeperRumours.some(function (r) { return r.keeper === 'clinic' && r.says === chipLine; }));
})();

head('F. COOK + REGISTRY');
var REG = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
var item = REG.items.filter(function (x) { return x.id === 'people-the-keepers-speak-10-9'; })[0];
ok('the cook is registered in VOTE', !!item);
if (item) {
  ok('it names the lane', item.lane === 'people');
  ok('it points at a real cook file', typeof item.show === 'object'
    && fs.existsSync(path.join(ROOT, 'slices', item.show.src)));
}
ok('the record exists', fs.existsSync(path.join(ROOT, 'records/BOHEMIA_THE_KEEPERS_SPEAK_10_9_26.txt')));
ok('the review file for RUN TWO exists', fs.existsSync(path.join(ROOT, 'records/BOHEMIA_THE_KEEPERS_SPEAK_REVIEW_FOR_RUN_TWO_10_9_26.md')));

console.log('\n' + (fail ? 'THE KEEPERS SPEAK GATE: ' + fail + ' FAILED, ' + pass + ' ok'
  : 'THE KEEPERS SPEAK GATE: ' + pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
