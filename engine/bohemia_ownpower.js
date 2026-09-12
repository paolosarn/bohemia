// BOHEMIA OWN POWER — YOUR OWN POWER IS YOUR WAY OUT (9/12/26, WORLD lane)
// Board row [own power] / YOUR-OWN-POWER-IS-YOUR-WAY-OUT.
//
// ============================================================================
// THE ROW
// ============================================================================
//   "from the 9/5 generator-mafia research: the Lebanese families who built their
//    own rooftop solar were buying their way out of the block's owner. In our
//    game, a power building you place on your land takes you OFF the block's line:
//    the monthly cut stops, your batteries are yours, and the faction that owned
//    the line notices (a standing hit, a visit). This is what 'set up buildings
//    and auto-mine batteries' (Paolo 9/5) means in the world."
//
// ============================================================================
// BOTH HALVES IT NEEDS ARE ALREADY BUILT, AND THIS IS THE JOIN
// ============================================================================
//   [block rent], 9/12 (FACTIONS)  living on a faction's ground costs a cut in
//                                  batteries, billed per BLOCK of their ground you
//                                  used, through BohemiaTowns.rentOn(used, towns)
//   [batteries mined], 9/11 (this lane)  solar, the battery farm and the substation
//                                  mint a battery a day for the man who placed them
//
// So going off the line is not a new charge or a new table. It is the same bill
// with your OWN blocks taken out of it: a block you put a generator on is a block
// you no longer buy power for. `used` goes in, a smaller `used` comes out, and
// rentOn is not touched -- it belongs to another lane and it is already right.
//
// ============================================================================
// WHAT IS HIS AND IS NOT INVENTED HERE
// ============================================================================
// "the faction that owned the line notices (a standing hit, a visit)".
//   THE HIT IS A WEIGHT. bohemia_standing.js ships DEED_WEIGHT EMPTY and says why:
//   "What counts as a deed and what it is worth to whom is" his. [block rent] made
//   the same call one row earlier, in its own words: "Nothing here invents a
//   standing change: what an unpaid debt does to how they FEEL about you is a
//   weight, and weights are his."
//   THE VISIT IS AN ENCOUNTER, and the encounter director's tables are his too.
// So this module makes the NOTICING REAL AND VISIBLE -- it names which factions
// you went off the line on, and the card says so in words -- and leaves the size
// of the grudge and the knock at the door to him. A weightless fact that is
// recorded and said out loud is honest; a number nobody ruled is not.
//
// AND IT DOES NOT FORCE THE DEED DOOR. bohemia_standing.js's witness() needs minds
// standing within sight and a where() for each. A faction knowing about its own
// wire is not a person seeing you do something, and pushing it through that door
// would be the exact mistake [block rent] wrote down about payTo(): using the
// function whose name matches rather than the one whose question matches.
//
// node: require('./bohemia_ownpower.js')   Gate: gates/own_power_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* ASK FOR A NEIGHBOUR WHEN YOU NEED IT, NEVER WHEN YOU LOAD. */
  function POWERB() {
    if (HASREQ) { try { return require('./bohemia_powerbuild.js'); } catch (e) { return null; } }
    return root.BohemiaPowerBuild || (typeof BohemiaPowerBuild !== 'undefined' ? BohemiaPowerBuild : null);
  }
  function TOWNS() {
    if (HASREQ) { try { return require('./bohemia_towns.js'); } catch (e) { return null; } }
    return root.BohemiaTowns || (typeof BohemiaTowns !== 'undefined' ? BohemiaTowns : null);
  }

  var RULING = 'Paolo 9/5: set up certain buildings and that is just more batteries';

  /* ------------------------------------------------------------------------
     WHICH GROUND YOU ARE OFF THE LINE ON.
     A power building you placed sits on somebody's ground -- BB-TURF's holderOf
     answers for every cell in the valley -- and that block is yours to power now.
     THE BLOCK IS THE UNIT BECAUSE THE BILL IS. [block rent] bills per block of a
     faction's ground you used, so the thing that cancels a billed block has to be
     counted in blocks too, or the two would be talking past each other.
     blockOf is the CALLER's, for the same reason: which cells make one block is
     the walked surface's own idea and a second copy of it here is how two systems
     start disagreeing about what a block is.
     ------------------------------------------------------------------------ */
  function offBlocks(edits, towns, blockOf) {
    var PB = POWERB(), T = TOWNS();
    var out = { byFaction: {}, blocks: [], total: 0 };
    if (!PB || !T || typeof T.holderOf !== 'function') return out;
    var mine = [];
    try { mine = PB.mine(edits) || []; } catch (_e) { mine = []; }
    var seen = {};
    for (var i = 0; i < mine.length; i++) {
      var b = mine[i];
      var k = null;
      if (typeof blockOf === 'function') {
        try { var bl = blockOf(b.x, b.y); if (bl) k = bl[0] + ',' + bl[1]; } catch (_e) { k = null; }
      }
      if (k == null) k = b.x + ',' + b.y;        /* no block helper: the plot is the block */
      var h = null;
      try { h = T.holderOf(towns, b.x, b.y); } catch (_e) { h = null; }
      if (!h || !h.faction) continue;
      var key = h.faction + '@' + k;
      if (seen[key]) continue;                    /* two generators on one block is one block */
      seen[key] = 1;
      out.byFaction[h.faction] = (out.byFaction[h.faction] || 0) + 1;
      out.blocks.push({ faction: h.faction, block: k, type: b.type, x: b.x, y: b.y });
      out.total++;
    }
    return out;
  }

  /* THE SAME BILL WITH YOUR OWN BLOCKS TAKEN OUT OF IT.
     Never below zero: you cannot be off the line on more of somebody's ground than
     you stood on, and a negative `used` would pay you rent. */
  function discount(used, off) {
    var out = {}, f;
    for (f in (used || {})) {
      if (!Object.prototype.hasOwnProperty.call(used, f)) continue;
      var n = (used[f] | 0) - (((off && off.byFaction) || {})[f] | 0);
      out[f] = n > 0 ? n : 0;
    }
    return out;
  }

  /* WHAT IT SAVED HIM, SO THE CARD CAN SAY IT AND A GATE CAN CHECK IT. Asks the
     rent rule BOTH WAYS rather than doing the arithmetic twice: whatever a
     fortress charges and however the thirds round, this is the real difference. */
  function saved(used, off, towns) {
    var T = TOWNS();
    if (!T || typeof T.rentOn !== 'function') return null;
    var full = null, cut = null;
    try { full = T.rentOn(used, towns); cut = T.rentOn(discount(used, off), towns); }
    catch (_e) { return null; }
    if (!full || !cut) return null;
    return { was: full.total, now: cut.total, saved: full.total - cut.total };
  }

  /* WHOSE LINE YOU CAME OFF, WHICH IS THE NOTICING. The size of what they feel
     about it is his; that it happened, and to whom, is a fact and lives here. */
  function noticed(off) {
    var out = [], f;
    for (f in ((off && off.byFaction) || {}))
      if (Object.prototype.hasOwnProperty.call(off.byFaction, f)) out.push(f);
    return out.sort();
  }

  /* THE SENTENCE. draft:true. */
  function say(off, s) {
    if (!off || !off.total) return '';
    var who = noticed(off);
    var n = off.total;
    var head = (n === 1 ? 'One block of yours runs on your own power now'
                        : (n + ' blocks of yours run on your own power now'));
    var tail = who.length
      ? (' — ' + who.join(' and ') + (who.length === 1 ? ' noticed' : ' noticed'))
      : '';
    var cost = (s && s.saved > 0)
      ? (', and it kept ' + (s.saved === 1 ? 'a battery' : s.saved + ' batteries')
         + ' out of their hands')
      : '';
    return head + cost + tail + '.';
  }

  var API = { RULING: RULING, offBlocks: offBlocks, discount: discount,
              saved: saved, noticed: noticed, say: say };
  if (HASREQ) module.exports = API;
  root.BohemiaOwnPower = API;
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
