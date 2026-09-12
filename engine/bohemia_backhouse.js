// BOHEMIA BACK OF HOUSE — THE CASINO HAS NO BACK (9/13/26, WORLD lane)
// Board row [back of house] / THE-CASINO-HAS-NO-BACK.
//
// ============================================================================
// THE ROW, HARVESTED FROM ECONOMY ROUND 6
// ============================================================================
//   "Our own economy module has said since 7/19 that downtown matters for its
//    'deep casino/resort dry stores', and there is no dry store, no laundry, no
//    boiler, no loading dock in any building in this game. Every job the city
//    offers happens in a room that does not exist. Build the back of house as a
//    real place you can enter, work in, and steal from. Needs COOK for the rooms."
//
// ============================================================================
// MEASURED FIRST, AND THE ROW IS HALF WRONG IN THE MOST USEFUL WAY
// ============================================================================
// THE ROOMS EXIST. bohemia_floorplan generates twelve zones of real rooms, and a
// casino is zone `leisure`, which already lays out concourse, counter, kitchen,
// locker, restroom and service. A shop already gets a STOCKROOM. A warehouse
// already gets a DOCK. bohemia_furnish already fills a stockroom wall to wall with
// racking and pallet stacks. You can already walk in: 67 tiles across the engine
// declare an `enter` line and the walked surface reads them.
//
// SO "NEEDS COOK FOR THE ROOMS" IS NOT TRUE, and front-page rule 12 says measure
// that rather than wait on it. The rooms are GENERATED AND FURNISHED BY CODE, not
// drawn by hand. Nothing in this row needs a single new piece of art.
//
// ============================================================================
// WHAT IS REALLY MISSING IS TWO THINGS, AND THE SECOND ONE IS THE WHOLE ROW
// ============================================================================
// ONE -- THE ONE ROOM THE ECONOMY ASKS FOR BY NAME IS THE ONE ROOM IT NEVER GETS.
// bohemia_economy's own header, since 7/19: "deep casino/resort dry stores -- THE
// reason downtown matters." `leisure` is the goods-heavy zone with NO stockroom in
// its role list, while `stockroom` already exists, is already assigned to retail,
// and is already furnished. The dry store the economy is built around was the one
// room nobody laid out.
//
// TWO -- AND NOTHING THAT PAYS YOU CAN SEE ANY ROOM AT ALL. bohemia_economy.YIELD
// is two flat numbers, site 3.0 salvage and scav 1.2, and THE ROOM NEVER ENTERS THE
// ARITHMETIC. bohemia_work, which is what a day of work runs on, does not contain
// the word room, zone or interior anywhere. So a sweep through the back of a casino
// pays exactly what a sweep across a car park pays, and the whole back of house --
// built, furnished, enterable -- is invisible to the only thing that rewards you
// for being there. THAT is "every job the city offers happens in a room that does
// not exist": not that the room is missing, but that nothing can see it.
//
// ============================================================================
// AND THE FIX INVENTS NO NUMBER, BECAUSE THE GAME ALREADY RULED THIS
// ============================================================================
// The economy has exactly two kinds of work and it already says what separates
// them: SITE is working a real place that holds something, SCAV is sweeping. That
// difference is already 3.0 against 1.2, already untuned, and already his.
// A DRY STORE IS A SITE. A CONCOURSE IS NOT.
// So the room decides WHICH OF THE TWO KINDS THE ECONOMY ALREADY HAS you are
// doing, and no third number is introduced anywhere.
//
// WHICH ROOMS HOLD GOODS IS DERIVED, NOT LISTED. bohemia_furnish already says what
// is in every room, in its own vocabulary: racking, pallet stacks, a fridge. A room
// holds goods when the game already puts storage in it. A list typed here would be
// a second opinion about the same fact, and it would be wrong the day somebody adds
// a room -- this way a new room gets the right answer for free.
//
// node: require('./bohemia_backhouse.js')   Gate: gates/back_of_house_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var DRAFT = true;

  function FURNISH() {
    if (HASREQ) { try { return require('./bohemia_furnish.js'); } catch (e) { return null; } }
    return root.BohemiaFurnish || (typeof BohemiaFurnish !== 'undefined' ? BohemiaFurnish : null);
  }
  function ECONOMY() {
    if (HASREQ) { try { return require('./bohemia_economy.js'); } catch (e) { return null; } }
    return root.BohemiaEconomy || (typeof BohemiaEconomy !== 'undefined' ? BohemiaEconomy : null);
  }

  /* THE FURNITURE THAT MEANS SOMETHING IS KEPT HERE. Not a list of rooms -- a list
     of the PIECES the furnisher already places, so the answer comes from the same
     table that draws the room. Racking and pallets are storage anywhere they are
     put; a fridge is where food was.
     THIS IS THE ONE JUDGEMENT IN THE FILE AND IT IS ABOUT FURNITURE, NOT ABOUT
     WHICH BUILDINGS PAY, WHICH WOULD BE HIS. */
  var STORES = ['racking', 'pallet_stack', 'fridge'];

  /* THE ECONOMY'S OWN TWO KINDS. Read off it rather than spelled, so a rename or a
     third kind cannot leave this quietly asking about work that does not exist. */
  function kinds() {
    var e = ECONOMY();
    if (!e || !e.YIELD) return [];
    var out = [], k;
    for (k in e.YIELD) if (Object.prototype.hasOwnProperty.call(e.YIELD, k)) out.push(k);
    return out;
  }
  function hasKind(k) { return kinds().indexOf(k) >= 0; }

  /* ---- DOES THIS ROOM HOLD ANYTHING --------------------------------------
     Asked of the furnisher, every time. An unknown room is NOT a store, which is
     the safe answer: it means a room nobody has furnished pays a sweep, never a
     site, so a missing entry can never quietly inflate what a day is worth. */
  function pieces(role) {
    var F = FURNISH();
    if (!F || !F.ROLES) return [];
    var r = F.ROLES[role];
    if (!r || !r.pieces) return [];
    var out = [];
    for (var i = 0; i < r.pieces.length; i++) {
      var p = r.pieces[i];
      /* the furnisher's piece is { id, w, h, cls, wall } -- `id` is the thing's
         name. The first cut of this guessed `what`/`name`/`piece` and got null for
         every piece in the game, so every room came back empty and every room came
         back a sweep. A GUESS AT A FIELD NAME IS NOT A READ: it fails silently and
         looks exactly like a world with nothing in it. */
      out.push(typeof p === 'string' ? p : (p && p.id) || null);
    }
    return out;
  }
  function holds(role) {
    var ps = pieces(role);
    for (var i = 0; i < ps.length; i++)
      if (STORES.indexOf(ps[i]) >= 0) return true;
    return false;
  }

  /* every room the game knows that holds something, for anything that wants the
     set rather than one answer. Derived every call; never cached, because a cache
     is a second copy of the furnisher's table. */
  function storerooms() {
    var F = FURNISH(), out = [];
    if (!F || !F.ROLES) return out;
    for (var role in F.ROLES)
      if (Object.prototype.hasOwnProperty.call(F.ROLES, role) && holds(role)) out.push(role);
    return out.sort();
  }

  /* ---- WHAT KIND OF WORK IS THIS ROOM ------------------------------------
     THE WHOLE JOIN, AND IT IS ONE LINE OF ARITHMETIC-FREE JUDGEMENT: a room that
     holds goods is the economy's SITE, anything else is its SCAV. Both names come
     back from the economy itself; if either ever stops existing this answers null
     rather than naming work the game cannot do. */
  function workIn(role) {
    if (!hasKind('site') || !hasKind('scav')) return null;
    return holds(role) ? 'site' : 'scav';
  }

  /* WHAT HE IS TOLD, when a day's work happens somewhere that is worth being.
     Names the room in plain words and never a number: what a site is worth is the
     economy's YIELD, which is untuned and his. draft:true. */
  var SAY = {
    stockroom: 'the dry store, racking still stacked',
    records:   'the records room, shelf after shelf of it',
    service:   'the service room behind the floor',
    floor_open:'the warehouse floor',
    dock:      'the loading dock',
    kitchen:   'the kitchen, and whatever is left in the cold store'
  };
  function say(role) {
    if (!holds(role)) return '';
    return SAY[role] || 'the back of house';                       /* draft:true */
  }

  var API = { STORES: STORES, SAY: SAY,
              kinds: kinds, hasKind: hasKind, pieces: pieces,
              holds: holds, storerooms: storerooms, workIn: workIn, say: say,
              draft: DRAFT };
  if (HASREQ) module.exports = API;
  root.BohemiaBackhouse = API;
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
