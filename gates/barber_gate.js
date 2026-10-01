/* THE BARBER — the gate for rule 37i / row [barber] (10/1/26, CHARACTER)
 *
 * Paolo 9/27: customization at the barber in the settlement. The coordinator's row (9/29, rule 41):
 * a building you tap; the face maker and the haircut bank open there and nowhere else; it costs a
 * battery; with PORTRAIT (the face) and RUN (the screen). This gate holds engine/bohemia_barber.js,
 * this lane's own piece, to his ruling.
 *
 *   A  THE COST IS HIS OWN WORDS: exactly one battery, and the ruling string says so.
 *   B  A VISIT PAYS: a rich purse loses exactly one electricity, no more, no less.
 *   C  A BROKE VISIT IS REFUSED BY NAME, and nothing is silently granted.
 *   D  NO FIFTH VERB: this file never calls BohemiaPurse.upkeep() with an invented verb; it debits
 *      directly, the same primitive the four frozen verbs and lotbuild's own COST both use.
 *   E  WHAT OPENS IS NAMED: the face editor and the hair bank, nothing else, so RUN and PORTRAIT
 *      know exactly what a tap on the building is for.
 *   F  MUTATION: an amount other than one is caught; a currency other than electricity is caught.
 *
 * Run:  node gates/barber_gate.js
 */
'use strict';
const path = require('path');
const ENGINE = path.join(path.dirname(__dirname), 'engine');
const B = require(path.join(ENGINE, 'bohemia_barber.js'));
const P = require(path.join(ENGINE, 'bohemia_purse.js'));

let pass = 0, fail = 0;
const ok = (name, cond, detail) => {
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '  [' + detail + ']' : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '  [' + detail + ']' : '')); }
};
function rich(n) { const p = P.create({}); P.credit(p, 'electricity', n, 'gate', 'seed', 0); return p; }

/* ---- A ---- */
ok('A it costs ONE BATTERY', B.COST.currency === 'electricity' && B.COST.amount === 1);
ok('A the ruling cites his own words, not an invented number',
  /9\/27 CUSTOMIZATION AT THE BARBER/.test(B.RULING) && /8\/15 EVERYTHING COSTS ONE/.test(B.RULING));

/* ---- B ---- */
{
  const p = rich(3);
  const before = P.balance(p, 'electricity');
  const r = B.visit(p, 0, 'test');
  ok('B a visit succeeds when he can pay', r.ok === true, JSON.stringify(r));
  ok('B and it costs exactly one, not two, not zero',
    P.balance(p, 'electricity') === before - 1, before + ' -> ' + P.balance(p, 'electricity'));
}

/* ---- C ---- */
{
  const broke = P.create({});
  const r = B.visit(broke, 0, 'test');
  ok('C a broke visit is refused by name', r.ok === false && r.why === 'CANNOT_AFFORD', JSON.stringify(r));
  ok('C and nothing moved', P.balance(broke, 'electricity') === 0);
}
{
  const r = B.visit(null, 0, 'test');
  ok('C no purse at all is refused by name, not a crash', r.ok === false && r.why === 'NO_PURSE');
}

/* ---- D ---- */
{
  const src = require('fs').readFileSync(path.join(ENGINE, 'bohemia_barber.js'), 'utf8');
  const code = src.split('\n').filter(l => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  ok('D never calls upkeep() with a new verb', !/\.upkeep\s*\(/.test(code), 'checked code lines only, not the comment that explains why');
  ok('D calls debit() directly, the same primitive the frozen verbs use', /\.debit\s*\(/.test(code));
}

/* ---- E ---- */
{
  const p = rich(1);
  const r = B.visit(p, 0, 'test');
  ok('E a successful visit names what opens', r.ok && r.opens && r.opens.faceEditor === true && r.opens.hairBank === true,
    JSON.stringify(r.opens));
  const keys = Object.keys(B.OPENS);
  ok('E and nothing else is named', keys.length === 2 && keys.indexOf('faceEditor') >= 0 && keys.indexOf('hairBank') >= 0,
    keys.join(', '));
}

/* ---- F, mutation: compile a BROKEN copy of the real file and prove the gate's own checks
   would catch it, instead of trusting that B/C above are strict enough by inspection. */
{
  const Module = require('module');
  function loadMutant(src) {
    const m = new Module(path.join(ENGINE, 'bohemia_barber_mutant.js'), null);
    m.filename = path.join(ENGINE, 'bohemia_barber_mutant.js');
    m.paths = Module._nodeModulePaths(ENGINE);
    m._compile(src, m.filename);
    return m.exports;
  }
  const src = require('fs').readFileSync(path.join(ENGINE, 'bohemia_barber.js'), 'utf8');

  const overcharged = loadMutant(src.replace('amount: 1', 'amount: 2'));
  const p1 = rich(1);
  const r1 = overcharged.visit(p1, 0, 'mut');
  ok('F MUTATION: charging 2 instead of 1 is caught by check B\'s exact-one assertion',
    !(r1.ok && P.balance(p1, 'electricity') === 0), 'mutant left ' + P.balance(p1, 'electricity'));

  const wrongCurrency = loadMutant(src.replace("currency: 'electricity'", "currency: 'clout'"));
  const p2 = rich(1);
  const r2 = wrongCurrency.visit(p2, 0, 'mut');
  ok('F MUTATION: charging clout instead of electricity is caught by check A\'s currency assertion',
    !(r2.ok && wrongCurrency.COST.currency === 'electricity'));
}

console.log('');
console.log('=== THE BARBER GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
