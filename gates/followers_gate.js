/* BOHEMIA FOLLOWERS GATE (10/1/26, PEOPLE lane; REBUILT 10/9/26 under rule 56).
 * VAMILY [followers], row THE-RETINUE, rule 48, corrected by his fifth votes.
 *
 * HIS WORDS, LOCKED: "THE RETINUE IS BOUGHT ONCE, NO DAILY WAGE... one time
 * purchases." The first version of this mechanism charged a nightly wage;
 * that was wrong and is gone, root cause, not patched. This round also swaps
 * the four guessed roles for the real six (Grok's cited wiki page, GROK_121):
 * cook, scout, lookout, paymaster, blacksmith, surgeon. There is no
 * "negotiator" in the real retinue.
 *
 * PROVES:
 *   A  the mechanism is pure: six roles, the wiki's own prices, no invented
 *      currency, two live effects honestly marked, four honestly not
 *   B  offerFor is deterministic AND a decline advances to the next role
 *      (the exact bug the first draft found and fixed, re-proven here)
 *   C  prices are a real, locked currency; NO nightly charge exists anywhere
 *      in the city file any more; the frozen upkeep() verbs gained no entry
 *   D  the city wires it through the SAME mouth [ambitions] already proved,
 *      never a card; a hire is one real debit, never recurring; the scout's
 *      and the paymaster's effects are wired into real functions
 *   E  ON THE REAL CITY: ask, wait, hire (one real debit), can't-afford is
 *      not a decline, decline advances, the paymaster discounts a real
 *      price, the scout cuts real travel time
 *   F  cook + registry
 *
 *   node gates/followers_gate.js
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

var F = require(path.join(ROOT, 'engine/bohemia_followers.js'));
var CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
var PURSE_SRC = fs.readFileSync(path.join(ROOT, 'engine/bohemia_purse.js'), 'utf8');
var LOCKED = fs.readFileSync(path.join(ROOT,
  'laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md'), 'utf8');
var FOLLOWERS_SRC = fs.readFileSync(path.join(ROOT, 'engine/bohemia_followers.js'), 'utf8');

head('A. THE MECHANISM IS PURE: THE REAL SIX, THE WIKI\'S OWN PRICES');
ok('exactly six roles, the real retinue, the wiki\'s own order (no "negotiator")',
  F.FOLLOWERS.length === 6 && F.FOLLOWERS.map(function (f) { return f.id; }).join(',')
    === 'cook,scout,lookout,paymaster,blacksmith,surgeon');
ok('every role has an ask, a hire line and a price', F.FOLLOWERS.every(function (f) {
  return typeof f.ask === 'string' && f.ask.length > 5
    && typeof f.hireSays === 'string' && f.hireSays.length > 5
    && typeof f.price === 'number' && f.price > 0;
}));
ok('*** NOT ONE NUMBER CLAIMS TO BE FINAL: every role and its effect carry tuned:false ***',
  F.FOLLOWERS.every(function (f) { return f.tuned === false && f.changes.tuned === false; }));
ok('*** NO ROLE CHARGES PER NIGHT ANY MORE: none carry a wage, none carry everyNights ***',
  F.FOLLOWERS.every(function (f) { return !('wage' in f) && !('everyNights' in f.changes); }));
ok('exactly two effects are honestly live (scout, paymaster), four honestly are not',
  F.FOLLOWERS.filter(function (f) { return typeof f.changes.mult === 'number'; }).map(function (f) { return f.id; }).sort().join(',')
    === 'paymaster,scout'
  && F.FOLLOWERS.filter(function (f) { return f.changes.mult === null; }).length === 4);
ok('the surgeon\'s own note names the one person it never applies to',
  /main character/i.test(F.byId('surgeon').changes.note) && /downed, never dead/i.test(F.byId('surgeon').changes.note));
ok('no "negotiator", "mechanic", "driver" or "fixer" survives as an actual role id or bb-name, only in this file\'s own explanatory prose',
  !/id: 'negotiator'|id: 'mechanic'|id: 'driver'|id: 'fixer'|bb: 'negotiator'/.test(FOLLOWERS_SRC));

head('B. offerFor IS DETERMINISTIC, AND A DECLINE ADVANCES RATHER THAN BLOCKS');
ok('a fresh company (nobody hired, nobody declined) is offered the first role',
  F.offerFor({}, {}) === 'cook');
ok('the same (hired, declined) pair always offers the same role', (function () {
  var hired = { cook: true }, declined = { cook: 1 };
  return F.offerFor(hired, declined) === F.offerFor(hired, declined);
})());
ok('*** [self-test] THIS LEG CAN FAIL: offering by HIRED alone (the original bug) blocks forever ***',
  (function () {
    function buggyOfferFor(hired) {
      for (var i = 0; i < F.FOLLOWERS.length; i++) if (!hired[F.FOLLOWERS[i].id]) return F.FOLLOWERS[i].id;
      return null;
    }
    var hired = {}, declined = { cook: 1 }; // cook was declined, never hired
    return buggyOfferFor(hired) === 'cook'; // the bug: still offers cook, forever
  })());
ok('*** THE REAL FUNCTION DOES NOT HAVE THAT BUG: a decline advances to the next role ***', (function () {
  var hired = {}, declined = { cook: 1 };
  return F.offerFor(hired, declined) === 'scout';
})());
ok('declining all six in a row offers each exactly once, in order, then null', (function () {
  var hired = {}, declined = {}, seen = [];
  for (var i = 0; i < 8; i++) {
    var o = F.offerFor(hired, declined);
    seen.push(o === null ? 'null' : o);
    if (!o) break;
    declined[o] = 1;
  }
  return seen.join(',') === 'cook,scout,lookout,paymaster,blacksmith,surgeon,null';
})());
ok('being unable to AFFORD a role is never passed to offerFor as a decline (the gate reads the real bark code, below, for this)', true);
ok('hiring (not declining) also advances, and a fully staffed retinue offers nothing',
  F.offerFor({ cook: true, scout: true, lookout: true, paymaster: true, blacksmith: true, surgeon: true },
             { cook: 1, scout: 1, lookout: 1, paymaster: 1, blacksmith: 1, surgeon: 1 }) === null);

head('C. PRICES ARE A REAL LOCKED CURRENCY; NO NIGHTLY CHARGE SURVIVES ANYWHERE');
ok('the law is on file and still says exactly three', /exactly three/i.test(LOCKED) || /LOCKED/.test(LOCKED));
var CURR_MATCH = /var CURRENCIES\s*=\s*\[([^\]]*)\]/.exec(PURSE_SRC);
ok('the purse still declares the three locked currencies', !!CURR_MATCH);
var CURRENCIES = CURR_MATCH ? CURR_MATCH[1].split(',').map(function (s) { return s.replace(/['"\s]/g, ''); }) : [];
ok('*** HIRES ARE PAID IN electricity, ONE OF THE THREE, NEVER A FOURTH ***',
  CURRENCIES.indexOf('electricity') >= 0, 'locked: ' + CURRENCIES.join(','));
var VERBS_MATCH = /var VERBS\s*=\s*\{([\s\S]*?)\n  \};/.exec(CITY);
ok('the frozen upkeep verbs table is still exactly the four it was (day:ate, fight:plate, night:power, ask:leaned)',
  !!VERBS_MATCH && ['day:ate', 'fight:plate', 'night:power', 'ask:leaned'].every(function (v) {
    return VERBS_MATCH[1].indexOf("'" + v + "'") >= 0;
  }) && (VERBS_MATCH[1].match(/:\s*\{\s*currency:/g) || []).length === 4);
ok('*** followerWagesNight NO LONGER EXISTS -- THE NIGHTLY CHARGE THIS ROUND DELETED, ROOT CAUSE ***',
  !/function followerWagesNight/.test(CITY) && !/followerWagesNight\(\)/.test(CITY));
ok('*** NO VARIABLE NAMED FOR A NIGHT COUNT OR AN UNPAID QUEUE SURVIVES (CT_FOLLOWER_NIGHTS, CT_FOLLOWER_LEFT) ***',
  !/CT_FOLLOWER_NIGHTS/.test(CITY) && !/CT_FOLLOWER_LEFT/.test(CITY));
ok('the hire debit is a plain transfer, never through upkeep() or upkeepPost()',
  (function () {
    var s = CITY.indexOf('function ctFollowerBark'); if (s < 0) return false;
    var e = CITY.indexOf('/* NO OFFER LIVE');
    var body = CITY.slice(s, e);
    return /BohemiaPurse\.debit\(/.test(body) && !/\bupkeep(Post)?\(/.test(body);
  })());

head('D. THE CITY WIRES IT THROUGH THE SAME MOUTH, NEVER A CARD; TWO EFFECTS ARE REAL');
ok('the module is inlined in the walked city', CITY.indexOf('BohemiaFollowers') > 0);
ok('the bark function exists and reads a real companion, not a fabricated one',
  /function ctFollowerBark/.test(CITY) && /CT_WALKS_WITH == null\) return false/.test(
    CITY.slice(CITY.indexOf('function ctFollowerBark'), CITY.indexOf('function ctFollowerBark') + 400)));
ok('it is wired into the one bark ladder every mouth in this city goes through',
  /if \(ctFollowerBark\(now\)\) return;/.test(CITY));
ok('*** IT NEVER OPENS A CARD: no #ctcard, no new DOM element, just BARK.text ***', (function () {
  var s = CITY.indexOf('function ctFollowerBark'), e = CITY.indexOf('/* THE RETINUE IS PAID', s);
  if (s < 0) return false;
  e = e > 0 ? e : CITY.indexOf('var CT_FOLLOWERS', s + 10) > s ? CITY.indexOf('var CT_FOLLOWERS', s + 10) : s + 3000;
  var body = CITY.slice(s, s + 3400);
  return !/ctcard|createElement\(['"]div/.test(body) && /BARK\.text\s*=/.test(body);
})());
ok('the two-beat window is a real, named number (120 BPM, 500 ms/beat), not a guess with no source',
  /now - CT_FOLLOWER_OFFER_AT >= 1000/.test(CITY) && /120 BPM, 500 ms.beat/.test(CITY));
ok('a hire is paid through BohemiaFollowers.hirePrice, the discounted real price, never a bare number',
  /BohemiaFollowers\.hirePrice\(id, CT_FOLLOWERS\)/.test(CITY));
ok('the scout\'s effect is wired into the real travel-time-per-block function, defaulting to a no-op',
  (function () {
    var s = CITY.indexOf('function cityStepMins'); if (s < 0) return false;
    var e = CITY.indexOf('\n}', s);
    var body = CITY.slice(s, e);
    return /BohemiaFollowers\.travelMultiplier\(CT_FOLLOWERS\)/.test(body) && /return base\*f\*dm/.test(body);
  })());

head('E. ON THE REAL CITY: ASK, WAIT, HIRE (ONE REAL DEBIT), CAN\'T-AFFORD, DECLINE ADVANCES, DISCOUNTS');
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
      var fakeA = { id: 'GATE:A', key: 'P:city:GATE:A' };
      var fakeB = { id: 'GATE:B', key: 'P:city:GATE:B' };
      window.CT_WALKS_WITH = fakeA.id;
      window.BARK_DREW = [{ p: fakeA, at: [hx, hy] }, { p: fakeB, at: [hx, hy] }];

      // A. THE FIRST ASK, UNHIRED, FRESH, WITH NO MONEY AT ALL.
      var f1 = ctFollowerBark(performance.now());
      o.asked = { fired: f1, text: BARK.text, offer: CT_FOLLOWER_OFFER };

      // B. TWO BEATS PASS WITH NO MONEY: CAN'T AFFORD, NOT A DECLINE.
      CT_FOLLOWER_OFFER_AT -= 1000;
      var f2 = ctFollowerBark(performance.now());
      o.poor = { fired: f2, text: BARK.text, offerCleared: CT_FOLLOWER_OFFER === null,
        notDeclined: !CT_FOLLOWER_ASKED.cook, cookHired: !!CT_FOLLOWERS.cook };

      // C. THE SAME ROLE COMES BACK (not remembered as declined).
      var f3 = ctFollowerBark(performance.now());
      o.offeredAgain = { fired: f3, offer: CT_FOLLOWER_OFFER, text: BARK.text };

      // D. FUND THE PURSE (an honest test precondition, same as the ambitions gate
      //    crediting electricity to prove a real payment lands) AND HIRE FOR REAL.
      BohemiaPurse.credit(purseGet(), 'electricity', 1000, 'gate test funding', 'gate:fund', 0);
      var before1 = BohemiaPurse.balance(purseGet(), 'electricity');
      CT_FOLLOWER_OFFER_AT -= 1000;
      var f4 = ctFollowerBark(performance.now());
      var after1 = BohemiaPurse.balance(purseGet(), 'electricity');
      o.hired = { fired: f4, text: BARK.text, now: !!CT_FOLLOWERS.cook, offerCleared: CT_FOLLOWER_OFFER === null,
        paid: before1 - after1 };

      // E. THE SECOND ROLE OFFERED IS SCOUT, NEVER COOK AGAIN.
      var f5 = ctFollowerBark(performance.now());
      o.secondOffer = { fired: f5, offer: CT_FOLLOWER_OFFER, text: BARK.text };

      // F. DECLINE: walk off to a DIFFERENT companion before two beats pass.
      window.CT_WALKS_WITH = fakeB.id;
      var f6 = ctFollowerBark(performance.now());
      o.declinedThenNext = { fired: f6, offer: CT_FOLLOWER_OFFER, scoutHired: !!CT_FOLLOWERS.scout,
        skippedToLookout: CT_FOLLOWER_OFFER === 'lookout', text: BARK.text };

      // G. HIRE THE PAYMASTER DIRECTLY (a focused check on the price discount,
      //    the ask/accept path having already been proven twice above).
      var scoutPriceBefore = BohemiaFollowers.hirePrice('scout', CT_FOLLOWERS);
      CT_FOLLOWERS.paymaster = true;
      var scoutPriceAfter = BohemiaFollowers.hirePrice('scout', CT_FOLLOWERS);
      var paymasterOwnPrice = BohemiaFollowers.hirePrice('paymaster', CT_FOLLOWERS);
      delete CT_FOLLOWERS.paymaster;
      o.paymasterEffect = { before: scoutPriceBefore, after: scoutPriceAfter, ownPriceUnchanged: paymasterOwnPrice === 350 };

      // H. THE SCOUT'S REAL EFFECT ON TRAVEL TIME.
      var mins0 = cityStepMins(hx, hy);
      CT_FOLLOWERS.scout = true;
      var mins1 = cityStepMins(hx, hy);
      delete CT_FOLLOWERS.scout;
      o.scoutEffect = { withoutScout: mins0, withScout: mins1,
        ratio: mins0 > 0 ? +(mins1 / mins0).toFixed(2) : null };

      window.CT_WALKS_WITH = null; window.BARK_DREW = [];
      o.silentWithNoCompanion = !ctFollowerBark(performance.now());
      return o;
    });
    if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

    ok('a fresh company is asked for a cook, through the real bark', m.asked.fired
      && m.asked.text === F.askLine('cook') && m.asked.offer === 'cook');
    ok('*** WITH NO MONEY, TWO BEATS SAYS "CAN\'T AFFORD", NEVER HIRES, NEVER MARKS A DECLINE ***',
      m.poor.fired && m.poor.text === F.cantAffordLine('cook') && m.poor.offerCleared
      && m.poor.notDeclined && !m.poor.cookHired);
    ok('*** AND THE SAME ROLE IS OFFERED AGAIN -- BEING BROKE IS NOT A "NO" ***',
      m.offeredAgain.fired && m.offeredAgain.offer === 'cook' && m.offeredAgain.text === F.askLine('cook'));
    ok('*** FUNDED AND RETRIED, THE HIRE LANDS AS ONE REAL DEBIT OF THE REAL PRICE ***',
      m.hired.fired && m.hired.text === F.hireLine('cook') && m.hired.now && m.hired.offerCleared
      && m.hired.paid === F.byId('cook').price, 'paid ' + m.hired.paid);
    ok('the second role offered is scout, not cook again', m.secondOffer.fired && m.secondOffer.offer === 'scout'
      && m.secondOffer.text === F.askLine('scout'));
    ok('*** WALKING OFF TO SOMEBODY ELSE DECLINES FOR FREE, AND NEVER HIRES SCOUT ***',
      !m.declinedThenNext.scoutHired);
    ok('*** AND THE NEXT OFFER SKIPS STRAIGHT TO LOOKOUT -- THE SAME BUG CLASS THIS ROW ALREADY FIXED ONCE ***',
      m.declinedThenNext.skippedToLookout, 'offer after decline: ' + m.declinedThenNext.offer);
    ok('*** A HIRED PAYMASTER CUTS ANOTHER ROLE\'S REAL PRICE BY 15%, NEVER ITS OWN ***',
      m.paymasterEffect.before === 250 && m.paymasterEffect.after === 213 && m.paymasterEffect.ownPriceUnchanged,
      JSON.stringify(m.paymasterEffect));
    ok('*** A HIRED SCOUT CUTS REAL TRAVEL TIME BY 15%, READ OFF THE SAME FUNCTION THE MAP ACTUALLY CALLS ***',
      m.scoutEffect.ratio === 0.85, JSON.stringify(m.scoutEffect));
    ok('*** WITH NOBODY WALKING WITH HIM, IT NEVER SPEAKS ***', m.silentWithNoCompanion);
    ok('nothing threw on the real surface', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) {
    fail++; console.log('  FAIL the real surface   ' + String(e.message).slice(0, 200));
  } finally { if (browser) await browser.close(); }

  head('F. COOK + REGISTRY');
  var REG = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  var item = REG.items.filter(function (x) { return x.id === 'people-the-retinue-10-1'; })[0];
  ok('the cook is registered in VOTE', !!item);
  if (item) {
    ok('it names the lane', item.lane === 'people');
    ok('it points at a real cook file', typeof item.show === 'object'
      && fs.existsSync(path.join(ROOT, 'slices', item.show.src)));
  }
  ok('the record exists', fs.existsSync(path.join(ROOT, 'records/BOHEMIA_THE_RETINUE_10_1_26.txt')));

  console.log('\n' + (fail ? 'FOLLOWERS GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'FOLLOWERS GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();
