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

  var API = { RULING: RULING, DEFAULT_CURRENCY: DEFAULT_CURRENCY,
              install: install, placed: placed, producedOn: producedOn, tick: tick };
  if (HASREQ) module.exports = API;
  root.BohemiaProduction = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
