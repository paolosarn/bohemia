// BOHEMIA BARBER — WHERE YOU CHANGE YOUR LOOK, AND WHAT IT COSTS
// (10/1/26, CHARACTER lane. VAMILY row [barber] / THE-BARBER-IS-WHERE-YOU-CHANGE-YOUR-LOOK.)
//
// HIS RULING, rule 37i, Paolo 9/27: customization at the barber in the settlement, many more
// hairstyles and head shapes. Rule 41 (coordinator 9/29) wrote the row: "a building you tap in
// the settlement screen; the face maker and the haircut bank open there and nowhere else; it
// costs a battery; with PORTRAIT (the face) and RUN (the screen)."
//
// WHAT THIS LANE OWNS, AND WHAT IT DOES NOT. PORTRAIT owns the face itself; RUN owns the
// settlement screen and the building tap that will call this. This lane owns the HAIRCUT BANK
// (already its own since wave 1) and THE COST GATE that stands between a free tab and a real
// in-game visit. REUSE-FIRST: the face maker (buildFaceEditor) and the hair shelf (inside
// window.wardrobeRefresh) already exist and work, in the CHARACTER tab, our own dev workbench --
// nothing there needed rebuilding. What did not exist anywhere was the COST, because no surface
// has ever asked a player to pay for opening either one. That is this file.
//
// NO FIFTH VERB. engine/bohemia_purse.js freezes VERBS at four (day:ate, fight:plate,
// night:power, ask:leaned) and upkeep() REFUSES a fifth by name -- "a fifth is a design change,
// and design changes are Paolo's." A barber visit is not one of his four verbs, so it is not
// forced through upkeep(). It is also not a GOOD: engine/bohemia_economy.js's GOODS table is
// ECONOMY's own ledger of physical stock (water, food, meds...) and a haircut is a service, not
// a thing with a need-per-day. So this file calls the purse's own debit() directly, the same
// primitive spend() and upkeep() both call underneath, with ONE BATTERY as the amount -- not
// invented: his own words in rule 37i are the ruling, and EVERYTHING COSTS ONE (8/15, LOCKED)
// is the number already fixed for every ruled-but-unpriced thing in this repo.
//
// WHAT A VISIT OPENS, SO RUN KNOWS WHAT TO CALL: the face maker (PORTRAIT's) and the haircut
// bank (this lane's, CUTS below), never anything else -- "there and nowhere else" means the barber
// is the only in-game door to either, not that this file gates our own dev tab (the CHARACTER
// tab stays a free workbench for building and judging the game, the same way the RIG tab always
// has; what a player meets in the shipped game is a different door, and that door is this one).
//
//   node engine/bohemia_barber.js   (prints the catalog + ruling; no side effects)
(function (root) {
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  function DEP(file, global) {
    if (HASREQ) { try { return require('./' + file + '.js'); } catch (e) { return null; } }
    return (typeof root !== 'undefined' && root[global]) || null;
  }
  function PURSE() { return DEP('bohemia_purse', 'BohemiaPurse'); }

  var RULING = '9/27 CUSTOMIZATION AT THE BARBER + 8/15 EVERYTHING COSTS ONE + 9/4 BATTERIES ARE THE MONEY';
  var COST = { currency: 'electricity', amount: 1 };   /* one battery, per his own words in rule 37i */

  /* OPENS: a descriptor, not a UI. RUN's settlement screen and PORTRAIT's face maker read this to
     know what a tap on the barber building is for; nothing here draws a pixel. */
  var OPENS = { faceEditor: true, hairBank: true };

  function visit(purse, day, ref) {
    var P = PURSE();
    if (!P) return { ok: false, why: 'NO_PURSE_MODULE' };
    if (!purse) return { ok: false, why: 'NO_PURSE' };
    if (P.balance(purse, COST.currency) < COST.amount)
      return { ok: false, why: 'CANNOT_AFFORD', need: COST.amount, currency: COST.currency };
    var paid = P.debit(purse, COST.currency, COST.amount, 'barber:visit', ref || null, day);
    if (!paid || !paid.applied) return { ok: false, why: 'PURSE_REFUSED', purse: paid };
    return { ok: true, opens: OPENS, paid: paid };
  }

  var API = { RULING: RULING, COST: COST, OPENS: OPENS, visit: visit };
  if (HASREQ) module.exports = API;
  root.BohemiaBarber = API;

  if (HASREQ && require.main === module) {
    console.log('THE BARBER');
    console.log('  costs: ' + COST.amount + ' ' + COST.currency);
    console.log('  opens: ' + Object.keys(OPENS).filter(function (k) { return OPENS[k]; }).join(', '));
    console.log('  ruling: ' + RULING);
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
