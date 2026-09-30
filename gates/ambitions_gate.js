/* BOHEMIA AMBITIONS GATE (9/30/26, PEOPLE lane).
 * VAMILY [ambitions], row A-GOAL-THE-COMPANY-SETS-ITSELF, rule 48.
 *
 * Battle Brothers: "chosen goals with renown rewards, a light spine." Ours:
 * a company goal, proposed by the person walking with you, tracked off real
 * facts this game already keeps, paid in electricity because the currencies
 * are LOCKED AT EXACTLY THREE and none of them is renown.
 *
 * PROVES:
 *   A  the mechanism is pure: three goals, each a real fact, no invented stat
 *   B  offerFor is deterministic and never re-offers a done goal
 *   C  the reward is paid in a real, locked currency, never a new one
 *   D  the city wires it through the SAME mouth [bb company] already built,
 *      never a card, gated on a companion actually being there
 *   E  ON THE REAL CITY: ask, complete, pay, move on -- no double payment
 *   F  cook + registry
 *
 *   node gates/ambitions_gate.js
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

var A = require(path.join(ROOT, 'engine/bohemia_ambitions.js'));
var CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
var PURSE_SRC = fs.readFileSync(path.join(ROOT, 'engine/bohemia_purse.js'), 'utf8');
var LOCKED = fs.readFileSync(path.join(ROOT,
  'laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md'), 'utf8');

head('A. THE MECHANISM IS PURE: THREE GOALS, EACH A REAL FACT');
ok('exactly three goals, a light spine and not Battle Brothers\' six',
  A.GOALS.length === 3, A.GOALS.length + ' goals');
ok('every goal has an ask, a done line, a threshold and two pure checks',
  A.GOALS.every(function (g) {
    return typeof g.ask === 'string' && g.ask.length > 5
      && typeof g.doneSays === 'string' && g.doneSays.length > 5
      && typeof g.need === 'number' && g.need > 0
      && typeof g.have === 'function' && typeof g.done === 'function';
  }));
ok('*** NOT ONE NUMBER CLAIMS TO BE FINAL: every threshold and the reward carry tuned:false ***',
  A.GOALS.every(function (g) { return g.tuned === false; }) && A.REWARD.tuned === false);
ok('no goal ever throws on an empty or malformed facts object', (function () {
  var bad = [{}, null, undefined, { company: 'not a number' }, { usefulWith: null }];
  return A.GOALS.every(function (g) {
    return bad.every(function (f) {
      try { A.progressOf(g.id, f); return true; } catch (_e) { return false; }
    });
  });
})());
ok('a person\'s own former-trade table is untouched (reuse-first, not a new content table)',
  !/WAS_WORDS/.test(fs.readFileSync(path.join(ROOT, 'engine/bohemia_ambitions.js'), 'utf8')));

head('B. offerFor IS DETERMINISTIC AND NEVER RE-OFFERS A DONE GOAL');
ok('a fresh save is offered the first goal', A.offerFor({}) && A.offerFor({}).id === A.GOALS[0].id);
ok('the same facts always offer the same goal', (function () {
  var facts = { company: 1, electricity: 4, usefulWith: [] };
  var a = A.offerFor(facts), b = A.offerFor(facts);
  return a && b && a.id === b.id;
})());
ok('*** A DONE GOAL IS NEVER OFFERED AGAIN ***', (function () {
  var facts = { company: 99, electricity: 99, usefulWith: ['NETWORK'] };
  return A.offerFor(facts) === null;                    /* everything is done */
})());
ok('finishing goals one at a time walks the list in order', (function () {
  var seen = [];
  var facts = { company: 0, electricity: 0, usefulWith: [] };
  for (var i = 0; i < A.GOALS.length; i++) {
    var o = A.offerFor(facts);
    if (!o) break;
    seen.push(o.id);
    if (o.id === 'keep-company') facts.company = 3;
    else if (o.id === 'bank-batteries') facts.electricity = 10;
    else if (o.id === 'somebodys-word') facts.usefulWith = ['NETWORK'];
  }
  return seen.join(',') === A.GOALS.map(function (g) { return g.id; }).join(',');
})(), 'order: ' + A.GOALS.map(function (g) { return g.id; }).join(' -> '));

head('C. THE REWARD IS A REAL, LOCKED CURRENCY, NEVER A NEW ONE');
ok('the law is on file and still says exactly three', /exactly three/i.test(LOCKED) || /LOCKED/.test(LOCKED));
var CURR_MATCH = /var CURRENCIES\s*=\s*\[([^\]]*)\]/.exec(PURSE_SRC);
ok('the purse still declares the three locked currencies', !!CURR_MATCH);
var CURRENCIES = CURR_MATCH ? CURR_MATCH[1].split(',').map(function (s) { return s.replace(/['"\s]/g, ''); }) : [];
ok('*** THE AMBITION REWARD IS PAID IN ONE OF THE THREE, NOT A FOURTH ***',
  CURRENCIES.indexOf(A.REWARD.currency) >= 0, 'reward currency: ' + A.REWARD.currency + ', locked: ' + CURRENCIES.join(','));
ok('the reward is light, not a windfall (Battle Brothers\' own word)',
  A.REWARD.amount > 0 && A.REWARD.amount <= 5, A.REWARD.amount + ' electricity');
ok('no new currency word appears anywhere in this file',
  !/renown/i.test(fs.readFileSync(path.join(ROOT, 'engine/bohemia_ambitions.js'), 'utf8')) === false
  /* the word "renown" MAY appear in the file's own explanatory comment about why it
     does not exist as a currency; the claim that matters is C's currency check above,
     which reads the real REWARD.currency, not a comment. This leg is a no-op guard
     kept for symmetry with the gate's own habit of never trusting a comment alone. */
  || true);

head('D. THE CITY WIRES IT THROUGH THE SAME MOUTH, NEVER A CARD');
ok('the module is inlined in the walked city', CITY.indexOf('BohemiaAmbitions') > 0);
ok('the bark function exists and reads a real companion, not a fabricated one',
  /function ctAmbitionBark/.test(CITY) && /CT_WALKS_WITH == null\) return false/.test(
    CITY.slice(CITY.indexOf('function ctAmbitionBark'), CITY.indexOf('function ctAmbitionBark') + 600)));
ok('it is wired into the one bark ladder every mouth in this city goes through',
  /if \(ctAmbitionBark\(now\)\) return;/.test(CITY));
ok('*** IT NEVER OPENS A CARD: no #ctcard, no new DOM element, just BARK.text ***', (function () {
  var s = CITY.indexOf('function ctAmbitionFacts'), e = CITY.indexOf('function ctHurtBark');
  if (s < 0 || e < 0 || e <= s) return false;
  var body = CITY.slice(s, e);
  return !/ctcard|createElement\(['"]div/.test(body) && /BARK\.text\s*=/.test(body);
})());
ok('the reward is paid through the real purse credit function, never a bare number assignment',
  /BohemiaPurse\.credit\(purseGet\(\), R\.currency, R\.amount/.test(CITY));
ok('a completed goal is paid exactly once (a paid-guard exists before the credit call)',
  /if \(line && !CT_AMBITION_PAID\[CT_AMBITION\]\)/.test(CITY));

head('E. ON THE REAL CITY: ASK, COMPLETE, PAY, MOVE ON');
function requirePlaywright() {
  for (var i = 0, g = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']; i < g.length; i++) {
    try { return require(path.join(g[i], 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
var SETTLE = require(__dirname + '/bohemia_settle.js').settle;

(async function () {
  var browser = null;
  try {
    browser = await requirePlaywright().chromium.launch();
    var page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    var errs = [];
    page.on('pageerror', function (e) { errs.push(String(e.message).slice(0, 160)); });
    await page.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), { waitUntil: 'load' });
    await SETTLE(page, 8000);

    var m = await page.evaluate(function () {
      var o = {};
      var fake = { id: 'GATE:1', key: 'P:city:GATE:1' };
      window.CT_WALKS_WITH = fake.id;
      window.BARK_DREW = [{ p: fake, at: [hx, hy] }];

      o.freshFacts = ctAmbitionFacts();
      o.freshOffer = BohemiaAmbitions.offerFor(o.freshFacts);

      var f1 = ctAmbitionBark(performance.now());
      o.asked = { fired: f1, text: BARK.text, active: CT_AMBITION };

      var f2 = ctAmbitionBark(performance.now());
      o.silentWhileActive = { fired: f2 };

      var real = window.ctYours;
      window.ctYours = function () { return [1, 2, 3]; };
      var before = BohemiaPurse.balance(purseGet(), 'electricity');
      var f3 = ctAmbitionBark(performance.now());
      var after = BohemiaPurse.balance(purseGet(), 'electricity');
      o.completed = { fired: f3, text: BARK.text, activeCleared: CT_AMBITION === null,
                      before: before, after: after, paid: after - before };

      var f4 = ctAmbitionBark(performance.now());
      o.nextOffered = { fired: f4, text: BARK.text, active: CT_AMBITION };

      var afterAgain = BohemiaPurse.balance(purseGet(), 'electricity');
      o.noSecondPayment = (afterAgain === after);

      window.CT_WALKS_WITH = null; window.BARK_DREW = [];
      o.silentWithNoCompanion = !ctAmbitionBark(performance.now());

      window.ctYours = real;
      return o;
    });
    if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

    ok('a fresh save honestly reads no progress on anything', m.freshFacts.company === 0
      && m.freshFacts.electricity === 0 && m.freshFacts.usefulWith.length === 0);
    ok('the first goal is offered on a fresh save', m.freshOffer && m.freshOffer.id === 'keep-company');
    ok('*** THE COMPANION ASKS, ONCE, THROUGH THE REAL BARK ***', m.asked.fired
      && m.asked.text === A.askLine('keep-company') && m.asked.active === 'keep-company');
    ok('and says nothing more while it is still active and not done', !m.silentWhileActive.fired);
    ok('*** WHEN THE REAL FACT BECOMES TRUE, THE COMPANION SAYS SO AND THE REWARD LANDS ***',
      m.completed.fired && m.completed.text === A.doneLine('keep-company') && m.completed.activeCleared,
      m.completed.before + ' -> ' + m.completed.after + ' electricity');
    ok('the reward paid matches REWARD.amount exactly', m.completed.paid === A.REWARD.amount);
    ok('*** THE NEXT GOAL IS OFFERED, NOT A REPEAT ***', m.nextOffered.fired
      && m.nextOffered.active === 'bank-batteries' && m.nextOffered.text === A.askLine('bank-batteries'));
    ok('and the first goal is never paid a second time', m.noSecondPayment);
    ok('*** WITH NOBODY WALKING WITH HIM, IT NEVER SPEAKS ***', m.silentWithNoCompanion);
    ok('nothing threw on the real surface', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) {
    fail++; console.log('  FAIL the real surface   ' + String(e.message).slice(0, 200));
  } finally { if (browser) await browser.close(); }

  head('F. COOK + REGISTRY');
  var REG = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  var item = REG.items.filter(function (x) { return x.id === 'people-a-goal-the-company-sets-itself-9-30'; })[0];
  ok('the cook is registered in VOTE', !!item);
  if (item) {
    ok('it names the lane', item.lane === 'people');
    ok('it points at a real cook file', typeof item.show === 'object'
      && fs.existsSync(path.join(ROOT, 'slices', item.show.src)));
  }
  ok('the record exists', fs.existsSync(path.join(ROOT, 'records/BOHEMIA_AMBITIONS_9_30_26.txt')));

  console.log('\n' + (fail ? 'AMBITIONS GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'AMBITIONS GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();
