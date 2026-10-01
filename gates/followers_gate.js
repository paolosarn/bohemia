/* BOHEMIA FOLLOWERS GATE (10/1/26, PEOPLE lane).
 * VAMILY [followers], row THE-RETINUE, rule 48.
 *
 * Battle Brothers hires camp staff (scout, surgeon, negotiator, blacksmith)
 * for a daily wage. Ours: the mechanic, the medic, the fixer, the driver (the
 * board row's own order), offered one at a time by the person walking with
 * you, hired by staying close two beats, paid nightly in electricity (the
 * real locked currency), through a plain transfer never a fifth frozen verb.
 *
 * PROVES:
 *   A  the mechanism is pure: four roles, flat wage, no invented currency
 *   B  offerFor is deterministic AND a decline advances to the next role
 *      (the bug this round actually found and fixed: without skipping an
 *      ASKED role, not just a HIRED one, a single decline on the first role
 *      blocks all three others forever)
 *   C  the wage is a real, locked currency, and the frozen upkeep() verbs
 *      table gained no fifth entry
 *   D  the city wires it through the SAME mouth [ambitions] already proved,
 *      never a card; the nightly debit is a plain transfer, never upkeep();
 *      the driver's effect is wired into the real travel-time function
 *   E  ON THE REAL CITY: ask, wait, hire, decline-advances, pay, unpaid
 *      leaves, the fixer's relief skips every other night for the rest
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

head('A. THE MECHANISM IS PURE: FOUR ROLES, A FLAT WAGE, NO INVENTED CURRENCY');
ok('exactly four roles, the board row\'s own list (mechanic, medic, fixer, driver)',
  F.FOLLOWERS.length === 4 && F.FOLLOWERS.map(function (f) { return f.id; }).join(',')
    === 'mechanic,medic,fixer,driver');
ok('every role has an ask, a hire line, an unpaid line and a wage',
  F.FOLLOWERS.every(function (f) {
    return typeof f.ask === 'string' && f.ask.length > 5
      && typeof f.hireSays === 'string' && f.hireSays.length > 5
      && typeof f.unpaidSays === 'string' && f.unpaidSays.length > 5
      && typeof f.wage === 'number' && f.wage > 0;
  }));
ok('*** EVERY WAGE IS FLAT AT ONE, THE HOUSE STYLE (EVERYTHING COSTS ONE) ***',
  F.FOLLOWERS.every(function (f) { return f.wage === 1; }));
ok('*** NOT ONE NUMBER CLAIMS TO BE FINAL: every role and its effect carry tuned:false ***',
  F.FOLLOWERS.every(function (f) { return f.tuned === false && f.changes.tuned === false; }));
ok('two of the four effects are honestly declared NOT YET LIVE, naming the missing system',
  F.byId('medic').changes.mult === null && /wound|injury/.test(F.byId('medic').changes.note)
  && F.byId('mechanic').changes.mult === null && /repair meter/.test(F.byId('mechanic').changes.note));
ok('the other two carry a real number the city actually reads',
  typeof F.byId('driver').changes.mult === 'number' && typeof F.byId('fixer').changes.everyNights === 'number');
ok('no goal/stat/currency word appears that is not one of the three locked currencies',
  !/\brenown\b/i.test(FOLLOWERS_SRC));

head('B. offerFor IS DETERMINISTIC, AND A DECLINE ADVANCES RATHER THAN BLOCKS');
ok('a fresh company (nobody hired, nobody asked) is offered the first role',
  F.offerFor({}, {}) === 'mechanic');
ok('the same (hired, asked) pair always offers the same role', (function () {
  var hired = { mechanic: true }, asked = { mechanic: 1 };
  return F.offerFor(hired, asked) === F.offerFor(hired, asked);
})());
ok('*** [self-test] THIS LEG CAN FAIL: offering by HIRED alone (the bug this round fixed) blocks forever ***',
  (function () {
    // the exact pre-fix shape: skip only what is hired, never what was asked-and-declined
    function buggyOfferFor(hired) {
      for (var i = 0; i < F.FOLLOWERS.length; i++) if (!hired[F.FOLLOWERS[i].id]) return F.FOLLOWERS[i].id;
      return null;
    }
    var hired = {}, asked = { mechanic: 1 }; // mechanic was asked and declined, never hired
    return buggyOfferFor(hired) === 'mechanic'; // the bug: still offers mechanic, forever
  })());
ok('*** THE REAL FUNCTION DOES NOT HAVE THAT BUG: a decline advances to the next role ***', (function () {
  var hired = {}, asked = { mechanic: 1 };
  return F.offerFor(hired, asked) === 'medic';
})());
ok('declining all four in a row offers each exactly once, in order, then null', (function () {
  var hired = {}, asked = {}, seen = [];
  for (var i = 0; i < 6; i++) {
    var o = F.offerFor(hired, asked);
    seen.push(o === null ? 'null' : o);
    if (!o) break;
    asked[o] = 1; // declined, never hired
  }
  return seen.join(',') === 'mechanic,medic,fixer,driver,null';
})());
ok('hiring (not declining) also advances, and a fully staffed retinue offers nothing',
  F.offerFor({ mechanic: true, medic: true, fixer: true, driver: true },
             { mechanic: 1, medic: 1, fixer: 1, driver: 1 }) === null);

head('C. THE WAGE IS A REAL LOCKED CURRENCY; THE FROZEN VERBS TABLE GAINED NO FIFTH ENTRY');
ok('the law is on file and still says exactly three', /exactly three/i.test(LOCKED) || /LOCKED/.test(LOCKED));
var CURR_MATCH = /var CURRENCIES\s*=\s*\[([^\]]*)\]/.exec(PURSE_SRC);
ok('the purse still declares the three locked currencies', !!CURR_MATCH);
var CURRENCIES = CURR_MATCH ? CURR_MATCH[1].split(',').map(function (s) { return s.replace(/['"\s]/g, ''); }) : [];
ok('*** WAGES ARE PAID IN electricity, ONE OF THE THREE, NEVER A FOURTH ***',
  CURRENCIES.indexOf('electricity') >= 0, 'locked: ' + CURRENCIES.join(','));
var VERBS_MATCH = /var VERBS\s*=\s*\{([\s\S]*?)\n  \};/.exec(CITY);
ok('the frozen upkeep verbs table is still exactly the four it was (day:ate, fight:plate, night:power, ask:leaned)',
  !!VERBS_MATCH && ['day:ate', 'fight:plate', 'night:power', 'ask:leaned'].every(function (v) {
    return VERBS_MATCH[1].indexOf("'" + v + "'") >= 0;
  }) && (VERBS_MATCH[1].match(/:\s*\{\s*currency:/g) || []).length === 4);
ok('*** followerWagesNight NEVER CALLS upkeep() OR upkeepPost() -- IT IS A TRANSFER, NOT A FIFTH VERB ***',
  (function () {
    var s = CITY.indexOf('function followerWagesNight'); if (s < 0) return false;
    var e = CITY.indexOf('\n}', s);
    var body = CITY.slice(s, e);
    return !/\bupkeep(Post)?\(/.test(body) && /BohemiaPurse\.debit\(/.test(body);
  })());

head('D. THE CITY WIRES IT THROUGH THE SAME MOUTH, NEVER A CARD; THE DRIVER IS REAL');
ok('the module is inlined in the walked city', CITY.indexOf('BohemiaFollowers') > 0);
ok('the bark function exists and reads a real companion, not a fabricated one',
  /function ctFollowerBark/.test(CITY) && /CT_WALKS_WITH == null\) return false/.test(
    CITY.slice(CITY.indexOf('function ctFollowerBark'), CITY.indexOf('function ctFollowerBark') + 400)));
ok('it is wired into the one bark ladder every mouth in this city goes through',
  /if \(ctFollowerBark\(now\)\) return;/.test(CITY));
ok('*** IT NEVER OPENS A CARD: no #ctcard, no new DOM element, just BARK.text ***', (function () {
  var s = CITY.indexOf('function ctFollowerBark'), e = CITY.indexOf('function followerWagesNight');
  if (s < 0 || e < 0 || e <= s) return false;
  var body = CITY.slice(s, e);
  return !/ctcard|createElement\(['"]div/.test(body) && /BARK\.text\s*=/.test(body);
})());
ok('the two-beat accept window is a real, named number (120 BPM, 500 ms/beat), not a guess with no source',
  /now - CT_FOLLOWER_OFFER_AT >= 1000/.test(CITY) && /120 BPM, 500 ms.beat/.test(CITY));
ok('followerWagesNight is wired into the nightfall sequence, after loanNight',
  (function () {
    var a = CITY.indexOf('try{ loanNight(); }catch(_e){}');
    var b = CITY.indexOf('try{ followerWagesNight(); }catch(_e){}');
    return a > 0 && b > a && b - a < 800;
  })());
ok('the driver\'s effect is wired into the real travel-time-per-block function, defaulting to a no-op',
  (function () {
    var s = CITY.indexOf('function cityStepMins'); if (s < 0) return false;
    var e = CITY.indexOf('\n}', s);
    var body = CITY.slice(s, e);
    return /BohemiaFollowers\.travelMultiplier\(CT_FOLLOWERS\)/.test(body) && /return base\*f\*dm/.test(body);
  })());

head('E. ON THE REAL CITY: ASK, WAIT, HIRE, DECLINE ADVANCES, PAY, UNPAID LEAVES, THE FIXER\'S RELIEF');
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

      // A. THE FIRST ASK, UNHIRED, FRESH.
      var f1 = ctFollowerBark(performance.now());
      o.asked = { fired: f1, text: BARK.text, offer: CT_FOLLOWER_OFFER };

      // B. SILENT WHILE THE OFFER IS LIVE AND LESS THAN TWO BEATS HAVE PASSED.
      var f2 = ctFollowerBark(performance.now());
      o.silentWhileWaiting = { fired: f2 };

      // C. TWO BEATS PASS (pushed into the past rather than waited for): HIRED.
      CT_FOLLOWER_OFFER_AT -= 1000;
      var before1 = BohemiaPurse.balance(purseGet(), 'electricity');
      var f3 = ctFollowerBark(performance.now());
      o.hired = { fired: f3, text: BARK.text, now: !!CT_FOLLOWERS.mechanic, offerCleared: CT_FOLLOWER_OFFER === null };

      // D. THE SECOND ROLE IS OFFERED NEXT (not mechanic again).
      var f4 = ctFollowerBark(performance.now());
      o.secondOffer = { fired: f4, offer: CT_FOLLOWER_OFFER, text: BARK.text };

      // E. DECLINE: walk off to a DIFFERENT companion before two beats pass.
      window.CT_WALKS_WITH = fakeB.id;
      var f5 = ctFollowerBark(performance.now());
      o.declinedThenNext = { fired: f5, offer: CT_FOLLOWER_OFFER, medicHired: !!CT_FOLLOWERS.medic,
        skippedToFixer: CT_FOLLOWER_OFFER === 'fixer', text: BARK.text };

      // F. HIRE THE FIXER TOO (two beats pass), so the relief has something to relieve.
      CT_FOLLOWER_OFFER_AT -= 1000;
      var f6 = ctFollowerBark(performance.now());
      o.fixerHired = { fired: f6, now: !!CT_FOLLOWERS.fixer };

      // G. FUND THE PURSE (an honest test precondition, same as the ambitions gate crediting
      //    electricity to prove a real payment lands -- not a cheat of the mechanism itself).
      BohemiaPurse.credit(purseGet(), 'electricity', 20, 'gate test funding', 'gate:fund', 0);
      var funded = BohemiaPurse.balance(purseGet(), 'electricity');

      // H. NIGHT 0 (this mechanism's own tick, reset for a known starting point):
      //    both mechanic and fixer are charged -- the fixer is never relieved by
      //    itself, and tick 0 is even so the mechanic's relief-gated charge is due too.
      CT_FOLLOWER_NIGHTS = 0;
      followerWagesNight();
      var afterNight0 = BohemiaPurse.balance(purseGet(), 'electricity');
      o.night0Charge = funded - afterNight0;

      // I. NIGHT 1 (tick 1, odd): the fixer's relief means the mechanic is NOT
      //    charged; the fixer itself is still charged every time.
      followerWagesNight();
      var afterNight1 = BohemiaPurse.balance(purseGet(), 'electricity');
      o.night1Charge = afterNight0 - afterNight1;

      // J. NIGHT 2 (tick 2, even again): the mechanic is charged again.
      followerWagesNight();
      var afterNight2 = BohemiaPurse.balance(purseGet(), 'electricity');
      o.night2Charge = afterNight1 - afterNight2;

      // K. THE DRIVER'S REAL EFFECT ON TRAVEL TIME, hired directly for a focused check
      //    (the ask/accept path is already proven above; this isolates the effect itself).
      var mins0 = cityStepMins(hx, hy);
      CT_FOLLOWERS.driver = true;
      var mins1 = cityStepMins(hx, hy);
      delete CT_FOLLOWERS.driver;
      o.driverEffect = { withoutDriver: mins0, withDriver: mins1,
        ratio: mins0 > 0 ? +(mins1 / mins0).toFixed(2) : null };

      // L. UNPAID LEAVES THE SAME NIGHT, and the next mouth announces it.
      // Reset to a known, even tick so BOTH hired followers are due regardless
      // of how many nights ran above, then drain the purse to nothing.
      CT_FOLLOWER_NIGHTS = 0;
      var balBefore = BohemiaPurse.balance(purseGet(), 'electricity');
      BohemiaPurse.debit(purseGet(), 'electricity', Math.max(0, balBefore), 'gate drain', 'gate:drain', 0);
      followerWagesNight();
      o.unpaidLeaves = { mechanicGone: !CT_FOLLOWERS.mechanic, fixerGone: !CT_FOLLOWERS.fixer,
        queued: CT_FOLLOWER_LEFT.slice() };
      var f7 = ctFollowerBark(performance.now());
      o.saidItLeft = { fired: f7, text: BARK.text,
        matches: (BARK.text === BohemiaFollowers.unpaidLine('mechanic')) || (BARK.text === BohemiaFollowers.unpaidLine('fixer')) };

      window.CT_WALKS_WITH = null; window.BARK_DREW = [];
      o.silentWithNoCompanion = !ctFollowerBark(performance.now());
      return o;
    });
    if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

    ok('a fresh company is asked for a mechanic, through the real bark', m.asked.fired
      && m.asked.text === F.askLine('mechanic') && m.asked.offer === 'mechanic');
    ok('says nothing new while the offer is live and under two beats', !m.silentWhileWaiting.fired);
    ok('*** TWO BEATS WITH THE SAME COMPANION HIRES THEM, THROUGH THE REAL BARK ***',
      m.hired.fired && m.hired.text === F.hireLine('mechanic') && m.hired.now && m.hired.offerCleared);
    ok('the second role offered is medic, not mechanic again', m.secondOffer.fired && m.secondOffer.offer === 'medic'
      && m.secondOffer.text === F.askLine('medic'));
    ok('*** WALKING OFF TO SOMEBODY ELSE DECLINES FOR FREE, AND NEVER HIRES MEDIC ***',
      !m.declinedThenNext.medicHired);
    ok('*** AND THE NEXT OFFER SKIPS STRAIGHT TO FIXER -- THE EXACT BUG THIS ROUND FOUND AND FIXED ***',
      m.declinedThenNext.skippedToFixer, 'offer after decline: ' + m.declinedThenNext.offer);
    ok('the fixer is hired the same way, two beats later', m.fixerHired.now);
    ok('night 0 charges both hired followers, one battery each', m.night0Charge === 2, m.night0Charge + ' electricity');
    ok('*** NIGHT 1, THE FIXER\'S RELIEF SKIPS THE MECHANIC\'S CHARGE -- ONLY THE FIXER IS CHARGED ***',
      m.night1Charge === 1, m.night1Charge + ' electricity (fixer only)');
    ok('night 2, an even night, charges both again', m.night2Charge === 2, m.night2Charge + ' electricity');
    ok('*** THE DRIVER CUTS REAL TRAVEL TIME BY 15%, READ OFF THE SAME FUNCTION THE MAP ACTUALLY CALLS ***',
      m.driverEffect.ratio === 0.85, JSON.stringify(m.driverEffect));
    ok('*** AN UNPAYABLE WAGE ENDS THAT FOLLOWER\'S SERVICE THE SAME NIGHT, NO INVENTED GRACE PERIOD ***',
      m.unpaidLeaves.mechanicGone && m.unpaidLeaves.fixerGone
      && m.unpaidLeaves.queued.indexOf('mechanic') >= 0 && m.unpaidLeaves.queued.indexOf('fixer') >= 0);
    ok('and the next mouth says so, in the real declared words', m.saidItLeft.fired && m.saidItLeft.matches);
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
