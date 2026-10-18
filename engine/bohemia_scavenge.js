/* ============================================================================
   BOHEMIA -- SCAVENGE (9/29/26, WORLD lane).  Row [scavenge], rule 37(k).

   HIS WORDS (Paolo 9/27, on the shift research): a SCAVENGE button in the
   settlement screen -- spend time, test your luck, for materials; for when you
   are down bad on food, medicine or batteries; a settlement may show a bonus
   (a recent battle: more ammo).

   And rule 40 (Paolo 9/29) is why this row matters now: THE HOURS GO TO THE
   WORLD, NOT THE CHESS BOARD -- "a more deep rich interactable buildable
   world". Scavenging is one of the few verbs that makes a PLACE worth standing
   in rather than passing through, so it had better be about the place.

   ============================================================================
   THE FOUR CALLS THAT ARE MINE, AND WHY EACH ONE IS FORCED
   ============================================================================

   1. *** LUCK DECIDES WHETHER, NEVER HOW MANY. ***
      EVERYTHING COSTS ONE (Paolo 8/15) and BATTERIES ARE THE MONEY (9/4). A
      scavenge that pays out a variable PILE is a faucet with no ceiling, and
      this repo has already measured exactly that failure once: [people charge]
      found an ordinary solar panel offering 9.33 cells a day against a day's
      work paying ONE, which "would end EVERYTHING COSTS ONE inside a week".
      So a search returns ONE THING OR NOTHING. His "test your luck" is honoured
      in full -- it decides IF you find something and WHICH thing -- and the
      economy's locked ruling survives it. This is the load-bearing call here.

   2. *** WHAT YOU CAN FIND IS WHAT THE BLOCK REALLY HAS. ***
      Not a loot table. A loot table is the spreadsheet-simulator move the three-
      currencies law names as the anti-reference, and it makes every block the
      same block -- which is the identical defect [bb places] measured on 9/25,
      where a shelf was a function of TIER ALONE and every camp sold the same
      four things. The valley already knows what is on a block: the overmap gives
      every cell a district, and engine/bohemia_place.js (this lane, 9/27) already
      turns a block into what is standing on it. So a scavenge READS THE BLOCK.
      A boneyard is not a house.

   3. *** A BLOCK HAS A FINITE NUMBER OF THINGS LEFT, AND IT IS A COUNT, NOT A DIAL. ***
      The obvious build is a percentage chance per search, and that number would
      be mine, invented, and exactly what rule 36 hands to TUNING. A STOCK needs
      no such number: a block starts with however many findable things its own
      cells imply, each search takes at most one, and when it is empty the block
      says PICKED_CLEAN by name. Diminishing returns fall out of that for free,
      they are what really happens to a scavenged street, and nothing here is a
      difficulty I invented. The count is derived from the block every time; this
      module stores only WHAT HAS BEEN TAKEN.

   4. *** TIME IS THE ONLY COST. ***
      He said "spend time, test your luck", and he said it is for when you are
      DOWN BAD. A scavenge that charges batteries is unreachable by the player it
      exists for. So it costs a block of the day and nothing else, which is also
      what makes it the honest floor of the economy: you can always search, you
      just cannot always eat.

   ============================================================================
   WHAT THIS MODULE REFUSES TO INVENT
   ============================================================================
   YIELDS ships EMPTY. WHAT a kind of ground actually gives up is content and
   content is his (MECHANISM-MINE / CONTENTS-PAOLO'S). Asking answers NO_RULING
   by name and says which table is empty, the same three-answer discipline
   bohemia_strike and bohemia_place use.

   *** AND THE BONUS HALF IS A HOLE, NAMED RATHER THAN FAKED. ***
   His sentence ends "a settlement may show a bonus (a recent battle: more
   ammo)". MEASURED 9/29: NOTHING IN THIS GAME RECORDS THAT A FIGHT HAPPENED
   ANYWHERE. The deed ledger is the right shape and already carries turn, x, y
   and where. *** AND MY FIRST VERSION OF THIS NOTE WAS WRONG, WHICH IS WHY IT IS
   SPELT OUT: *** I wrote that bohemia_claims and bohemia_haggle publish into it.
   They do not. Both only BUILD ROWS "in the shape bohemia_deeds.publish already
   takes", and claims says in its own file "This module never publishes it". The
   only two publish calls in the whole game are in the walked surface, both on a
   QUEST STAGE. So no engine module publishes a deed at all, and the fight
   publishes nothing. `bonus()` answers UNREAD with the reason, and the fix is one
   publish call when a fight ends, which is COMBAT's, not a new system here.

   *** AND MEDICINE IS A CURRENCY QUESTION THAT IS NOT MINE. ***
   He named "food, medicine or batteries". The currencies are LOCKED at three
   (laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md) and the purse has
   carried "a third icon is [PENDING Paolo]" since 7/26. His scavenge sentence is
   the strongest evidence yet for what that third icon is. This module does not
   decide it: it names `medicine` as a FIND KIND, which is a thing you can hold,
   and never as a balance. No fourth currency is created here.

     node gates/scavenge_gate.js
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var PLACE = HASREQ ? require('./bohemia_place.js')
    : (root.BohemiaPlace || null);

  var NO_RULING = 'NO_RULING';
  var NOT_A_PLACE = 'NOT_A_PLACE';
  var PICKED_CLEAN = 'PICKED_CLEAN';
  var UNREAD = 'UNREAD';

  /* THE KINDS OF THING A SEARCH CAN TURN UP. These are the nouns his own
     sentence uses ("food, medicine or batteries") plus the two the game already
     spends (tape is materials, per the purse's own comment). A kind is a THING,
     never a balance: what a find is worth, and whether medicine is a currency at
     all, is not settled here.

     *** CORRECTED 10/9 BY RULE 47 (Paolo 9/29): THE SIX RESOURCES ARE BATTERIES,
     FOOD, MEDS, ROUNDS, TAPE AND WATER. *** This list was written 9/29 off his
     scavenge sentence alone and came out FIVE, missing WATER -- so the one thing a
     body in a desert needs most was the one thing a search in the Mojave could
     never turn up. Rule 47 is newer than the hedge above it and settles the
     currency question too: MEDS is one of the six, so `medicine` is not a pending
     fourth icon any more, it is ruled. The names here stay the singular nouns the
     older consumers already read; mapping them onto rule 47's six is one line each
     (food->FOOD, medicine->MEDS, battery->BATTERIES, tape->TAPE, ammo->ROUNDS,
     water->WATER) and the rename belongs with ECONOMY's ledger and MODS' file,
     which rule 47 gives them by name. The gate now refuses a list that is missing
     any of the six, so this cannot drift back to five. */
  var KINDS = ['food', 'medicine', 'battery', 'tape', 'ammo', 'water'];

  /* *** SHIPS EMPTY ON PURPOSE. *** Which ground gives up which kind is content.
     The MECHANISM below works the moment he fills one line in. */
  var YIELDS = {};

  /* WHICH DISTRICTS HOLD ANYTHING AT ALL. This is not a yield table: it is the
     list of ground the generator really makes that a person could search, taken
     from the same districts bohemia_place reads. A district absent here answers
     "nothing to search", which is an ANSWER and not a gap. */
  var SEARCHABLE = ['commercial', 'industrial', 'warehouse', 'suburb', 'apartment',
                    'downtown', 'casino', 'strip', 'motel', 'trailer'];

  function clampInt(n) { n = n | 0; return n < 0 ? 0 : n; }

  /* ---- WHAT IS LEFT ON A BLOCK --------------------------------------------
     DERIVED FROM THE BLOCK EVERY TIME, never stored. A block's findable count is
     its own searchable cells: one thing per searchable cell, which is the most
     boring possible rule and therefore the one that needs no ruling from him. */
  function findableOn(m, block) {
    if (!m || !block || !block.cells) return 0;
    var n = 0;
    for (var i = 0; i < block.cells.length; i += 2) {
      var c = m.at(block.cells[i], block.cells[i + 1]);
      if (c && c.district && SEARCHABLE.indexOf(c.district) >= 0) n++;
    }
    return n;
  }

  /* ---- THE LEDGER OF WHAT HAS BEEN TAKEN ---------------------------------
     THE ONLY STATE THIS MODULE OWNS, and it is deliberately tiny: a count per
     block. Not a list of items, not a seed, not a per-cell flag. If this file
     ever needs to remember more than "how many times this block gave something
     up", the design has drifted. */
  function create(opts) {
    opts = opts || {};
    return { id: opts.id || 'scav', taken: {} };
  }
  function takenOn(s, blockI) {
    return clampInt(s && s.taken ? s.taken[blockI] : 0);
  }

  /* ---- WHAT A BLOCK STILL HOLDS ------------------------------------------ */
  function leftOn(s, m, block) {
    var total = findableOn(m, block);
    var gone = takenOn(s, block.i);
    var left = total - gone;
    return { total: total, taken: gone, left: left < 0 ? 0 : left };
  }

  /* ---- THE BONUS: UNREAD, AND IT SAYS WHY --------------------------------
     *** MEASURED 9/29, NOT ASSUMED. *** His "a recent battle: more ammo" needs
     one fact nobody stores: that a fight happened here, and when. The deed
     ledger is exactly the right shape (bohemia_deeds.publish carries turn, x, y
     and where) but the FIGHT NEVER PUBLISHES INTO IT -- only claims and haggle
     do. A zero returned here would be indistinguishable from "no battle
     happened", so it answers UNREAD instead, the same way bohemia_future names a
     field it cannot read. */
  function bonus(where) {
    return {
      known: false, why: UNREAD, kind: 'ammo',
      because: 'nothing records that a fight happened at a place. The deed ledger '
        + 'already carries turn, x, y and where, but the only two publish calls in '
        + 'the game are in the walked surface and both are on a QUEST STAGE -- no '
        + 'engine module publishes a deed at all, and the fight publishes nothing '
        + '(WORLD measured it 9/29). One publish call when a fight ends closes '
        + 'this, and it belongs to COMBAT.',
      where: (where && where.where) || null
    };
  }

  /* ---- WHAT A KIND IS WORTH: HIS ----------------------------------------- */
  function yieldOf(kind) {
    if (KINDS.indexOf(kind) < 0)
      return { known: false, why: 'NOT_A_KIND', kind: kind, are: KINDS.slice() };
    if (!Object.prototype.hasOwnProperty.call(YIELDS, kind))
      return { known: false, why: NO_RULING, table: 'YIELDS', kind: kind,
               because: 'what a find gives you is content, and content is his' };
    return { known: true, kind: kind, gives: YIELDS[kind] };
  }

  /* ---- THE SEARCH --------------------------------------------------------
     ONE THING OR NOTHING. The roll is a pure function of the block and how many
     times it has already been searched, so the same block searched the same
     number of times answers the same way -- a save and a reload cannot re-roll a
     block into a better answer. */
  /* *** A PROPER AVALANCHE, BECAUSE MY FIRST ONE WAS BIASED AND I MEASURED IT. ***
     The first cut was a bare xorshift over a seed built as
     block*k + taken*k2 + day*k3. Driven for real it took 199 searches to clear a
     six-thing block when the arithmetic says total * H(total) = about 15 -- so
     the roll was not uniform, it was tracking the structure in its own seed, and
     the verb would have been unusable for a reason that had nothing to do with
     the design. This is the murmur3 finalizer, which avalanches every input bit,
     and the gate below holds the measured pace against that arithmetic so a
     biased roll can never come back quietly. */
  function roll(seed) {
    var x = seed >>> 0;
    x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b) >>> 0;
    x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35) >>> 0;
    x ^= x >>> 16;
    return (x >>> 0) / 4294967296;
  }

  function search(o) {
    o = o || {};
    var m = o.map, blocks = o.blocks, s = o.state;
    if (!m || !blocks || !s) return { ok: false, why: 'NO_WORLD' };
    var b = null;
    if (typeof o.block === 'object' && o.block) b = o.block;
    else if (PLACE) {
      var p = PLACE.at({ map: m, blocks: blocks, x: o.x, y: o.y });
      if (!p.known) return { ok: false, why: NOT_A_PLACE, x: o.x | 0, y: o.y | 0 };
      b = blocks.blocks[p.block];
    }
    if (!b) return { ok: false, why: NOT_A_PLACE };

    var st = leftOn(s, m, b);
    if (st.total === 0)
      return { ok: false, why: 'NOTHING_TO_SEARCH', block: b.i, left: 0,
               because: 'no cell on this block is ground a person could search' };
    if (st.left === 0)
      return { ok: false, why: PICKED_CLEAN, block: b.i, total: st.total,
               taken: st.taken, left: 0 };

    /* *** LUCK DECIDES WHETHER, NOT HOW MANY. *** The chance a search finds
       anything is how much of the block is still there. A fresh block almost
       always gives something up; a block searched to its last thing almost never
       does. That is one line, it is what really happens, and NOT ONE NUMBER IN IT
       IS MINE -- it is a ratio of two counts the world already decided. */
    var chance = st.left / st.total;
    var r = roll((b.i * 2654435761 + st.taken * 40503 + (o.day | 0) * 97) >>> 0);
    if (r >= chance) {
      return { ok: true, found: null, block: b.i, total: st.total,
               taken: st.taken, left: st.left, chance: chance,
               spent: 'time', why: 'FOUND_NOTHING' };
    }

    /* WHICH kind, from the ground itself. YIELDS is empty, so this reports the
       GROUND it searched and defers the noun -- it never guesses a kind. */
    var seatCell = m.at(b.cells[0], b.cells[1]);
    s.taken[b.i] = takenOn(s, b.i) + 1;
    return {
      ok: true, found: true, block: b.i, ground: (seatCell && seatCell.district) || null,
      total: st.total, taken: s.taken[b.i], left: st.left - 1, chance: chance,
      spent: 'time',
      kind: { known: false, why: NO_RULING, table: 'YIELDS',
              because: 'the block gave something up; WHICH thing is content, and content is his' }
    };
  }

  /* ---- THE VALLEY'S OWN ANSWER, for the gate and for a settlement screen --- */
  function census(m, blocks) {
    var out = { blocks: 0, searchable: 0, findable: 0, biggest: 0, empty: 0 };
    if (!m || !blocks || !blocks.blocks) return out;
    for (var i = 0; i < blocks.blocks.length; i++) {
      var n = findableOn(m, blocks.blocks[i]);
      out.blocks++;
      out.findable += n;
      if (n > 0) out.searchable++; else out.empty++;
      if (n > out.biggest) out.biggest = n;
    }
    return out;
  }

  var API = {
    KINDS: KINDS, YIELDS: YIELDS, SEARCHABLE: SEARCHABLE,
    NO_RULING: NO_RULING, NOT_A_PLACE: NOT_A_PLACE,
    PICKED_CLEAN: PICKED_CLEAN, UNREAD: UNREAD,
    create: create, findableOn: findableOn, leftOn: leftOn,
    search: search, yieldOf: yieldOf, bonus: bonus, census: census
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BohemiaScavenge = API;
})(typeof self !== 'undefined' ? self : this);
