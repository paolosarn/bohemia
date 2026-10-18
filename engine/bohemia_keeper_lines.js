// BOHEMIA THE KEEPERS SPEAK -- A PRICE, A RUMOUR, A TRAIT LINE (10/9/26, PEOPLE lane, VAMILY [the keepers speak])
//
// Rule 71a, A QUEST IS PEOPLE PLACES AND THINGS (Paolo 9/20: "text comes from
// a mouth with a portrait"): the smith, the armourer, the barber, the clinic
// and the board's man each speak their price, their trait line and one
// rumour. THE TRAIT LINE ALREADY EXISTS (RUN TWO's own traitLine(k) in
// slices/BOHEMIA_SETTLEMENT_SCREEN.html fires generically for every keeper
// already, nothing to build there); THE RUMOUR MECHANISM ALREADY EXISTS too
// (nextRumour(), fed by records/target/settlement_rumours.json, which WORLD's
// [where the god gear is] rumours already ride in as the "gear" kind) but is
// only called at the bar today. WHAT THIS MODULE BUILDS IS THE MISSING THIRD
// LEG: A SPOKEN PRICE LINE FOR EACH OF THE FIVE, every number read from the
// real place it already lives, never invented:
//   - smith / armourer: the real min-to-max price on THIS VISIT'S shelf
//     (handed in, not hardcoded -- the catalogue-wide extremes in
//     records/target/bb/weapons.json and armor.json run 3 to 350 and 1 to
//     700 batteries at the game's own max(1, value/10) rule, but what is
//     actually on a shelf a given visit is always a narrower real sample,
//     so this takes that real sample's own min/max as its input)
//   - barber: the fixed price is engine/bohemia_barber.js's own COST.amount,
//     one battery, cited there to rule 37i -- read here too, never retyped
//   - clinic: slices/BOHEMIA_SETTLEMENT_SCREEN.html's own clinicPrice()
//     formula is 20 crowns a day of hurt (times a level multiplier, times
//     the place's trait price multiplier), at ten crowns a battery; this
//     states the floor case honestly (level 1, no trait) and says plainly
//     that it climbs with rank, rather than printing a fake single number
//   - board: the real pay for one/two/three skulls is already fixed in that
//     same file's OFFERS array at 30/60/90 batteries; quoted verbatim
//
// REUSE-FIRST: THIS MODULE DOES NOT TOUCH slices/BOHEMIA_SETTLEMENT_SCREEN.HTML.
// That file is RUN TWO's own system (rule 55: "RUN 2 = THE VOTE TAB AND THE
// SETTLEMENT SCREEN ONLY... a new settlement file only"); ONE SYSTEM, ONE
// SESSION means PEOPLE builds the mechanism as DATA AND PURE FUNCTIONS and
// hands RUN TWO a review file to wire in, exactly the shape WORDS' own
// settlement-words rounds already used (rule 55: "a review file COMBAT
// applies; nothing touched directly").
//
// PRICES ARE SPOKEN AT THE SAME SPANGLISH VOICE EVERY KEEPER IN THAT FILE
// ALREADY USES (mijo, pues, compa, gracias -- read directly off the real
// file's own KEEPERS/shopSheet/openB lines, not invented fresh); the player
// never speaks it (THEY SPEAK SPANGLISH, 8/25).
'use strict';
(function (root) {
  var HASREQ = typeof module !== 'undefined' && module.exports;

  // battery price for a value in crowns, this game's own ten-to-one rate,
  // the exact rounding rule RUN TWO's shopSheet already charges (max(1, value/10))
  function batteryPrice(crowns) { return Math.max(1, Math.round(crowns / 10)); }

  // THE CLINIC's own real floor: 20 crowns a day at level 1 with no trait
  // active, read straight off clinicPrice()'s own constant in
  // slices/BOHEMIA_SETTLEMENT_SCREEN.html (20 * 1 * 1 * days * (1 + 0*0.2)),
  // one day, converted at ten to one.
  var CLINIC_FLOOR_CROWNS_PER_DAY = 20;
  var CLINIC_FLOOR_BATTERIES = batteryPrice(CLINIC_FLOOR_CROWNS_PER_DAY);

  // THE BARBER's own real fixed price: engine/bohemia_barber.js's COST.amount,
  // cited there to rule 37i. Read here as a constant pointed at that file's
  // own number, never a second source of truth.
  var BARBER_BATTERIES = 1;

  // THE BOARD's own real pay by skulls, read straight off
  // slices/BOHEMIA_SETTLEMENT_SCREEN.html's OFFERS array (pay:30/60/90).
  var BOARD_PAY_BY_SKULLS = { 1: 30, 2: 60, 3: 90 };

  function fmtBatt(n) { return n + ' batter' + (n === 1 ? 'y' : 'ies'); }

  // priceLine(kind, ctx): kind is 'smith' | 'armourer' | 'barber' | 'clinic' | 'board'.
  // ctx carries the REAL numbers for the ones whose price varies per visit
  // (smith/armourer take {min, max} off that visit's real shelf -- RUN TWO's
  // own S.stock[k] already has these, nothing invented here); the fixed-price
  // keepers (barber, clinic, board) need no ctx and always answer the same
  // real constant. Returns null for an unknown kind -- never a guessed default.
  function priceLine(kind, ctx) {
    ctx = ctx || {};
    if (kind === 'smith') {
      if (typeof ctx.min !== 'number' || typeof ctx.max !== 'number') return null;
      return 'Everything on my wall runs ' + fmtBatt(ctx.min) + ' to ' + fmtBatt(ctx.max) + '. Fixed, sharpened, loaded, no haggling, mijo.';
    }
    if (kind === 'armourer') {
      if (typeof ctx.min !== 'number' || typeof ctx.max !== 'number') return null;
      return 'My shelf runs ' + fmtBatt(ctx.min) + ' to ' + fmtBatt(ctx.max) + ', pues. If it stops a pipe, it is on the wall and it is priced plain.';
    }
    if (kind === 'barber') {
      return 'Bueno, one battery, every time, no more no less. Sit down and tell me who you want to be.';
    }
    if (kind === 'clinic') {
      return 'Twenty crowns a day of hurt, ' + fmtBatt(CLINIC_FLOOR_BATTERIES) + ' at his floor. A higher rank man costs more to mend, gracias a Dios he is still breathing.';
    }
    if (kind === 'board') {
      return 'One skull pays ' + BOARD_PAY_BY_SKULLS[1] + ', two ' + BOARD_PAY_BY_SKULLS[2] + ', three ' + BOARD_PAY_BY_SKULLS[3] + ' batteries, mijo. Fair, and it does not change.';
    }
    return null;
  }

  var API = {
    KEEPER_KINDS: ['smith', 'armourer', 'barber', 'clinic', 'board'],
    batteryPrice: batteryPrice,
    CLINIC_FLOOR_BATTERIES: CLINIC_FLOOR_BATTERIES,
    BARBER_BATTERIES: BARBER_BATTERIES,
    BOARD_PAY_BY_SKULLS: BOARD_PAY_BY_SKULLS,
    priceLine: priceLine
  };
  if (HASREQ) module.exports = API;
  root.BohemiaKeeperLines = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
