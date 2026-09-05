// BOHEMIA PRODUCTION — the buildings you placed make something overnight.
// (9/5/26, LIFE + CITY lane. VAMILY job [buildings produce] / PRODUCTION-TICK:
//  "on the wake beat, walk every placed building and call produce(); today
//   produce() has one caller and it is a gate".)
//
// WHY THIS IS THE JOB. engine/bohemia_purse.js has carried produce(purse,
// buildingId, day) since 7/31. Measured 9/5 before writing a line of this file:
// the ONLY caller in the whole repo was gates/purse_gate.js. A verb that exists
// for its own test is not a feature, it is a fixture -- the same shape as the
// seventeen invisible hats and the four bright garments nobody wore. And the
// purse's own comment said the table above it stays empty for a reason that
// pointed straight here: "there is no buildingId vocabulary to key on ... it
// fills the day something calls it and the ids are real."
//
// So this module is the caller, and the ids it uses are not invented: they are
// exactly BohemiaCityEdit.buildableTypes(DISTRICT) -- the canon district enum's
// buildable half, which is already the only thing the BUILD button will place.
// If a district is added to the enum it is producible the same day, with no
// second list to remember. (Same rule PRICES lives under: read the goods that
// exist, never type a list beside them.)
//
// WHAT A BUILDING MAKES, AND WHICH HALF OF THAT IS HIS.
// laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md, LOCKED, clause 3:
// "BUILDINGS: house people or produce one of the three. That's the economy."
// His words in the same ruling lead with the default and offer the other two as
// exceptions: "buildings produce resources which the logo is displayed as like
// an apple, duct tape ... then there's electricity ... or a building can
// produce clout."
// So the DEFAULT ROW is resources, and the AMOUNT is his 8/15 ruling, EVERYTHING
// COSTS ONE. WHICH buildings make electricity or clout INSTEAD is canon nobody
// has ruled and this file does not guess it: install() never overwrites a row
// that is already there, so the moment he names one it wins and nothing else
// changes. [PENDING Paolo: which building types produce electricity or clout.]
//
// DELIBERATELY NOT ELECTRICITY, and it is worth one line because it is the
// tempting answer. Batteries are the money (9/4) and the market prices in them,
// so making every placed building mint electricity would turn the build button
// into a printing press -- the exact faucet-with-no-drain failure the purse's
// own header is built to measure. Making money is a design act, not a wiring
// job, and it is not on this line.
//
// WHAT COUNTS AS A BUILDING. The delta, and only the delta: the plots the PLAYER
// put down. Not the 9,216 cells the generator drew, which would pay him for the
// valley existing. A 4-lot span is ONE building and is counted once, the same
// rule demolish already holds ("one building = one demolish").
//
// IDEMPOTENT OFF THE LEDGER, NOT OFF A FLAG. A wake beat can fire twice for one
// day -- a reload lands on the same day with the purse restored -- so this asks
// the purse whether day N already has a produce: entry rather than keeping a
// "did I pay today" boolean beside it. The ledger is the truth (that is the
// whole design of bohemia_purse.js); a second record of the same fact is how two
// things that agree start disagreeing.
//
// REUSE CHECK: cooks NO pixels. Opens engine/bohemia_purse.js (the ledger, its
// PRODUCTION table and produce()) and engine/bohemia_cityedit.js (the delta, its
// spans, and the canon buildable-type list). Adds no table either of them owns
// and no second copy of anything.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  function PURSE() {
    if (HASREQ) { try { return require('./bohemia_purse.js'); } catch (e) { return null; } }
    return root.BohemiaPurse || (typeof BohemiaPurse !== 'undefined' ? BohemiaPurse : null);
  }
  function EDIT() {
    if (HASREQ) { try { return require('./bohemia_cityedit.js'); } catch (e) { return null; } }
    return root.BohemiaCityEdit || (typeof BohemiaCityEdit !== 'undefined' ? BohemiaCityEdit : null);
  }

  /* the two rulings this file rests on, carried on every row it writes so
     placeholder_number_gate can see there is no hand-typed number here. */
  var RULING = '7/26 BUILDINGS PRODUCE ONE OF THE THREE + 8/15 EVERYTHING COSTS ONE';
  var DEFAULT_CURRENCY = 'resources';
  var DEFAULT_AMOUNT = 1;

  function has(o, k) { return o && Object.prototype.hasOwnProperty.call(o, k); }

  /* ---------------------------------------------------------------------------
     1. THE IDS ARE REAL NOW. Fill PRODUCTION from the types the BUILD button can
        actually place, and never step on a row somebody ruled.
     --------------------------------------------------------------------------- */
  function install(DISTRICT) {
    var P = PURSE(), CE = EDIT();
    if (!P || !CE || !P.PRODUCTION) return { installed: 0, kept: 0, types: 0 };
    var t = CE.buildableTypes(DISTRICT) || [], added = 0, kept = 0;
    for (var i = 0; i < t.length; i++) {
      if (has(P.PRODUCTION, t[i])) { kept++; continue; }   /* his ruling always wins */
      var row = { ruling: RULING, tuned: false };
      row[DEFAULT_CURRENCY] = DEFAULT_AMOUNT;
      P.PRODUCTION[t[i]] = row;
      added++;
    }
    return { installed: added, kept: kept, types: t.length };
  }

  /* ---------------------------------------------------------------------------
     2. WHAT HE ACTUALLY PUT DOWN. One entry per BUILDING, spans counted once.
     --------------------------------------------------------------------------- */
  function placed(edits) {
    var CE = EDIT();
    if (!CE || !edits || !edits.cells) return [];
    var out = [], covered = {}, i, k;
    var sp = CE.spans(edits) || [];
    for (i = 0; i < sp.length; i++) {
      var s = sp[i];
      for (var dy = 0; dy < s.h; dy++) for (var dx = 0; dx < s.w; dx++)
        covered[(s.ax + dx) + ',' + (s.ay + dy)] = 1;
      if (s.type && s.type !== 'desert' && CE.cat(s.type) === 'sand')
        out.push({ id: s.ax + ',' + s.ay, type: s.type, x: s.ax, y: s.ay, w: s.w, h: s.h });
    }
    for (k in edits.cells) {
      if (!has(edits.cells, k) || covered[k]) continue;
      var type = edits.cells[k];
      /* a demolished lot is desert and desert is not a building; anything that is
         not a buildable district cannot have come from BUILD and is skipped
         rather than paid for. */
      if (!type || type === 'desert' || CE.cat(type) !== 'sand') continue;
      var p = k.split(',');
      out.push({ id: k, type: type, x: +p[0], y: +p[1], w: 1, h: 1 });
    }
    return out;
  }

  /* ---------------------------------------------------------------------------
     3. THE LEDGER ANSWERS "DID TODAY ALREADY PAY". No second bookkeeping.
     --------------------------------------------------------------------------- */
  function producedOn(purse, day) {
    if (!purse || !purse.entries) return false;
    for (var i = 0; i < purse.entries.length; i++) {
      var e = purse.entries[i];
      if (e.day === day && typeof e.reason === 'string' && e.reason.indexOf('produce:') === 0)
        return true;
    }
    return false;
  }

  /* ---------------------------------------------------------------------------
     4. THE WAKE BEAT. Walk every placed building, call produce() on each.
        Returns what was made AND what was refused, because "made nothing because
        there is nothing built" and "made nothing because nobody ruled what this
        type produces" are different sentences and a caller must be able to tell
        them apart. (The purse's own rule, kept.)
     --------------------------------------------------------------------------- */
  function tick(purse, edits, day) {
    var P = PURSE();
    if (!P) return { applied: false, reason: 'NO_PURSE' };
    if (!purse) return { applied: false, reason: 'NO_PURSE' };
    if (producedOn(purse, day)) return { applied: false, reason: 'ALREADY_PRODUCED', day: day };
    var b = placed(edits), made = {}, refused = [], paid = 0;
    for (var i = 0; i < b.length; i++) {
      var r = P.produce(purse, b[i].type, day);
      if (r && r.applied) {
        paid++;
        for (var j = 0; j < r.made.length; j++) {
          var e = r.made[j] && r.made[j].entry;
          if (e) made[e.currency] = (made[e.currency] || 0) + e.amount;
        }
      } else if (r && refused.indexOf(b[i].type) < 0) refused.push(b[i].type);
    }
    return { applied: paid > 0, day: day, buildings: b.length, paid: paid,
             made: made, refused: refused, balances: P.balances(purse) };
  }

  /* ---------------------------------------------------------------------------
     5. WHAT A BUILDING COSTS TO PUT DOWN. (VAMILY job [building costs] /
        BUILD-COSTS-ITS-PRICE: "CE.build debits PRICES; building is free today and
        the 8/15 law says the pipe must be exercised".)

     MEASURED BEFORE WRITING IT: the whole consequence of placing a building was
     CBafterEdit() -- persist a delta, clear two caches, redraw. Purse touched 0.
     Free, silent, instant. So section 4 above had made the BUILD button a pure
     faucet: place a plot, get paid every wake beat, forever, for nothing. A
     faucet with no drain is the exact failure the purse's own header exists to
     measure, and I built half of it last round. This is the other half.

     THE PRICE IS HIS, TWICE OVER, AND NEITHER HALF IS A GUESS.
       8/15 LOCKED: "just make everything cost one."
       9/4  LOCKED: "i dont want there to be money money maybe electronics like
                     batteries are the currency."
     So a building costs ONE BATTERY. Buying is already denominated in electricity
     on the walked surface (payday's SALVAGE_CURRENCY, 9/5), and building is
     buying, so this uses the money the shop already uses rather than inventing a
     second till.

     ONE BUILDING, ONE BATTERY -- NOT ONE PER LOT. A 2x2 spans four lots and is
     still ONE building, the same unit demolish and produce() already count. Per-
     lot pricing would make a stadium cost four while producing one, which is a
     BALANCE decision with a real design consequence, and balance is his.
     [PENDING Paolo: whether a 2x2 building should cost more than a 1x1.]

     A SEPARATE TABLE FROM PURSE.PRICES, DELIBERATELY. The job's brief says "debits
     PRICES", and the debit goes through the purse's own debit() so it lands as a
     HARD SINK in the same ledger -- but the rows live here rather than in
     PURSE.PRICES, because that table is keyed on GOODS (water, food, meds) and
     mixing two vocabularies in one table is how a list that reads it starts
     getting 59 districts it never asked for. One table, one vocabulary.

     NO REFUND ON DEMOLISH. Nobody ruled what knocking a building down gives back,
     and the honest answer to a question nobody asked is silence, not 50%.
     --------------------------------------------------------------------------- */
  var COST_RULING = '8/15 EVERYTHING COSTS ONE + 9/4 BATTERIES ARE THE MONEY';
  var COST_CURRENCY = 'electricity';
  var COST_AMOUNT = 1;
  var COST = {};                       /* buildingId -> {currency, amount, ...} */

  function installCost(DISTRICT) {
    var CE = EDIT();
    if (!CE) return { installed: 0, kept: 0, types: 0 };
    var t = CE.buildableTypes(DISTRICT) || [], added = 0, kept = 0;
    for (var i = 0; i < t.length; i++) {
      if (has(COST, t[i])) { kept++; continue; }        /* his ruling always wins */
      COST[t[i]] = { currency: COST_CURRENCY, amount: COST_AMOUNT,
                     ruling: COST_RULING, tuned: false };
      added++;
    }
    return { installed: added, kept: kept, types: t.length };
  }

  function priceOf(type) { return has(COST, type) ? COST[type] : null; }

  /* CAN HE AFFORD IT. Answered separately from charging it, because the panel has
     to say the price and the refusal BEFORE he taps, not only after. */
  function canAfford(purse, type) {
    var P = PURSE(), row = priceOf(type);
    if (!P || !purse) return { ok: false, reason: 'NO_PURSE' };
    if (!row) return { ok: false, reason: 'NO_RULING', key: type,
                       about: 'what this costs to build is Paolo\'s ruling' };
    var have = P.balance(purse, row.currency);
    return { ok: have >= row.amount, have: have, price: row.amount,
             currency: row.currency,
             reason: have >= row.amount ? null : 'CANNOT_AFFORD' };
  }

  /* THE CHARGE. A HARD SINK through the purse's own debit(), so the batteries are
     DESTROYED rather than moved -- the half of a faucet-and-drain economy that
     actually fights inflation, and the reason section 4's yield is safe to exist.
     THE ORDER MATTERS AND IT IS CHECK -> BUILD -> CHARGE. Charging first and
     unwinding on a refused build would put a debit and a refund in the ledger for
     a building that never existed, and the ledger is the record a save is read
     back from. Checking first means the debit's only failure mode (INSUFFICIENT)
     has already been ruled out, so a built plot can never end up free. */
  function charge(purse, type, day, ref) {
    var P = PURSE(), row = priceOf(type);
    if (!P || !purse) return { applied: false, reason: 'NO_PURSE' };
    if (!row) return { applied: false, reason: 'NO_RULING', table: 'COST', key: type };
    return P.debit(purse, row.currency, row.amount, 'build:' + type,
                   ref == null ? null : ref, day);
  }

  var API = { RULING: RULING, DEFAULT_CURRENCY: DEFAULT_CURRENCY,
              COST: COST, COST_RULING: COST_RULING, COST_CURRENCY: COST_CURRENCY,
              install: install, placed: placed, producedOn: producedOn, tick: tick,
              installCost: installCost, priceOf: priceOf, canAfford: canAfford,
              charge: charge };
  if (HASREQ) module.exports = API;
  root.BohemiaProduction = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
