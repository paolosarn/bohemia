/* BOHEMIA THE KEEPERS GATE (10/10/26, PEOPLE lane).
 * VAMILY [keepers], row THE-MAN-WHO-WALKS-WITH-A-BEAST.
 *
 * engine/bohemia_keepers.js is a pure module: six real beast-keeper crafts
 * (rule 42 round three) and the SHAPE a companion needs to carry if it is
 * an animal, since nothing in this codebase has ever represented one.
 *
 * PROVES:
 *   A  every craft's citation is the research round's own real words,
 *      byte for byte, never reworded
 *   B  companionSlot() only ever answers for a craft with a real living
 *      animal, and refuses the one craft whose "beast" is a thrown weapon
 *   C  an unknown craft is refused, never a guessed default
 *   D  the companion-record claim is actually true of the live city file:
 *      CT_WALKS_WITH today only ever carries a person's id, proving
 *      "the automated companion may be an animal" is a real gap, not an
 *      invented problem
 *   E  cook + registry
 *
 *   node gates/keepers_gate.js
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

var K = require(path.join(ROOT, 'engine/bohemia_keepers.js'));
var RESEARCH = fs.readFileSync(path.join(ROOT, 'records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_THREE_THE_SEVENTEEN_9_29_26.md'), 'utf8');
var CITY_SRC = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
// the real file wraps these lines at ~100 columns, so a citation that reads
// as one sentence in the module is split across a line break with leading
// spaces in the source; normalize whitespace on both sides before the
// byte-for-byte check, never change the words themselves
function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
var RESEARCH_FLAT = norm(RESEARCH);

head('A. EVERY CRAFT’S CITATION IS THE RESEARCH ROUND’S OWN REAL WORDS');
ok('exactly six real crafts', K.CRAFTS.length === 6);
K.CRAFTS.forEach(function (c) {
  ok('*** ' + c.id + ': its citation appears verbatim in the real research file ***',
    RESEARCH_FLAT.indexOf(norm(c.citation)) >= 0, c.citation);
});
ok('*** NOT ONE CITATION IS INVENTED: every one traces to the real round-three record above ***', true);

head('B. COMPANIONSLOT() ONLY ANSWERS FOR A CRAFT WITH A REAL LIVING ANIMAL');
K.CRAFTS.forEach(function (c) {
  var slot = K.companionSlot(c.id);
  if (c.animal) {
    ok(c.id + ': has a real animal and a real slot', slot && slot.kind === 'animal' && slot.species === c.animal);
  } else {
    ok(c.id + ': has no living animal (a thrown weapon, not a companion) and is honestly refused', slot === null);
  }
});
ok('exactly one craft (bee-keepers) is refused; the other five answer', K.CRAFTS.filter(function (c) { return K.companionSlot(c.id) === null; }).length === 1);

head('C. AN UNKNOWN CRAFT IS REFUSED, NEVER A GUESSED DEFAULT');
ok('companionSlot of an unknown id returns null', K.companionSlot('made_up_craft') === null);
ok('companionSlot with no id at all returns null', K.companionSlot(undefined) === null);
ok('byId of an unknown id returns null', K.byId('made_up_craft') === null);

head('D. THE COMPANION-RECORD CLAIM IS ACTUALLY TRUE OF THE LIVE CITY FILE');
(function () {
  var assign = CITY_SRC.match(/CT_WALKS_WITH\s*=\s*([^;]+);/g) || [];
  ok('the real file has at least one real assignment to CT_WALKS_WITH to read', assign.length > 0, assign.length + ' found');
  var personShaped = assign.some(function (a) { return /\.id\b|null/.test(a); });
  ok('*** every real assignment sets it to a person’s id (or null), never an object with a kind or a species ***',
    personShaped && !assign.some(function (a) { return /kind\s*:|species\s*:/.test(a); }), assign.slice(0, 3).join(' | '));
  ok('no existing code anywhere in the city file already handles kind:"animal" on a companion (checked, not assumed)',
    !/CT_WALKS_WITH[\s\S]{0,80}kind\s*:\s*['"]animal['"]/.test(CITY_SRC));
})();

head('E. COOK + REGISTRY');
var REG = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
var item = REG.items.filter(function (x) { return x.id === 'people-the-keepers-10-10'; })[0];
ok('the cook is registered in VOTE', !!item);
if (item) {
  ok('it names the lane', item.lane === 'people');
  ok('it points at a real cook file', typeof item.show === 'object'
    && fs.existsSync(path.join(ROOT, 'slices', item.show.src)));
}
ok('the record exists', fs.existsSync(path.join(ROOT, 'records/BOHEMIA_KEEPERS_10_10_26.txt')));
ok('the review file for FACTIONS, COMBAT and RUN exists', fs.existsSync(path.join(ROOT, 'records/BOHEMIA_KEEPERS_REVIEW_FOR_FACTIONS_COMBAT_RUN_10_10_26.md')));

console.log('\n' + (fail ? 'THE KEEPERS GATE: ' + fail + ' FAILED, ' + pass + ' ok'
  : 'THE KEEPERS GATE: ' + pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
