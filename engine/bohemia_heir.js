// BOHEMIA HEIR — WHAT THE NEXT ONE ACTUALLY WALKS INTO (9/16/26, WORLD lane)
// Board row [fold carries] / THE-FOLD-CARRIES-THE-WRONG-THINGS.
//
// ============================================================================
// MEASURED FIRST (rule 12), AND THE FOLD IS A JOINER, NOT AN APPLIER
// ============================================================================
// bohemia_fold.js carries a CARRY table of thirteen rows saying what crosses a
// generation: standings DECAY, deeds DECAY, debt DIES, and EIGHT MORE marked
// ruled:false that all read `carries: whole` -- territory, builds,
// economyCapacity, invest, karma, virtues, family, wounds.
//
// READ, not guessed: fold(ledger, memory) takes both halves, reports which one it
// is missing, and HANDS BOTH THROUGH UNTOUCHED. It never consults CARRY at all.
// Driven with a full ledger, every field comes out the other side identical,
// debt included -- and debt is a row the table itself marks RULED and DIES.
//
// That is not a bug in fold(). The ruled rows DO get executed, each by the system
// that owns its field: bohemia_standing.inherit() decays the standings, owedFold()
// handles the rent book, and [debt carried] (9/12) made bohemia_owing clear the
// bill by asking the fold's own table. Two ledgers, two owners, numbers between
// them (THE DEBT GETS CALLED IN, 8/18, rule 4). What is missing is an owner for the
// MATERIAL rows, and that is this file.
//
// ============================================================================
// SO TODAY THE HEIR KEEPS EVERYTHING HE COULD SEE, AND THE FOLD MEANS NOTHING
// ============================================================================
// Every acre, every building, every scrap of capacity crosses whole. The row names
// two failure modes -- "an heir must arrive with a real leg up or the handoff reads
// as deleting your character, and a clean heir nobody remembers is the other
// failure" -- and the game is in NEITHER of them. It is in a third one nobody
// wrote down: THE HANDOFF COSTS NOTHING, so it is not a handoff, it is a rename.
//
// ============================================================================
// WHAT DYNASTY'S LIST SAYS, AND THE ONE PART OF IT THAT NEEDS NO NUMBER
// ============================================================================
// banks/BOHEMIA_THE_CARRY_LIST_DRAFT_9_5_26.txt, draft:true, DYNASTY 9/5:
//   THE HOUSE   "but held, not owned forever, and it can be lost."
//   THE WALLS   "and they come down if nobody keeps them up."
//
// "HELD, NOT OWNED FOREVER" and "IF NOBODY KEEPS THEM UP" are mechanisms, not
// rates. A percentage that survives would be a number nobody ruled. A CONDITION is
// not: the game already knows, per building, whether anybody kept that place up,
// and it knows it in the most visible way there is.
//
// THE LIGHTS. A circuit goes dark when the rent on that ground went unpaid
// ([held ground], 9/5: a faction darkens what a faction controls), it stays dark,
// it rides its own save key, and it is the one thing on this map a player can see
// from across the street. A building standing on dark ground is the game's own
// existing statement that nobody kept that place up. So:
//
//   THE HEIR KEEPS WHAT IS STILL LIT AND LOSES WHAT WENT DARK.
//
// No rate, no roll, no threshold, and it wires the generation fold to the rent you
// did or did not pay -- which is the whole argument of this lane's economy.
//
// IT DECIDES NOTHING ELSE. karma, virtues, family and wounds belong to other lanes
// and are left exactly as they are, named here so the next reader knows they were
// considered and skipped rather than missed. economyCapacity and invest have no
// writer on the walked surface at all yet.
//
// IT MOVES NOTHING. It answers which builds survived; the surface does the removing
// through bohemia_cityedit's own demolish(), because that file is the one writer of
// the edit set and a second writer is how two records of one fact start disagreeing.
//
// node: require('./bohemia_heir.js')   Gate: gates/fold_carries_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var DRAFT = true;

  function FOLD() {
    if (HASREQ) { try { return require('./bohemia_fold.js'); } catch (e) { return null; } }
    return root.BohemiaFold || (typeof BohemiaFold !== 'undefined' ? BohemiaFold : null);
  }

  /* THE RULING THIS EXECUTES, ASKED NOT COPIED. If the fold's table ever says
     builds carry whole and RULED, this stops taking anything -- one row moves and
     there is nothing here to edit. That is the same discipline [debt carried] used
     for the bill. */
  function buildsRule() {
    var F = FOLD();
    if (!F || !F.CARRY) return null;
    for (var i = 0; i < F.CARRY.length; i++) if (F.CARRY[i].field === 'builds') return F.CARRY[i];
    return null;
  }
  /* Only take things when the ruling has NOT been settled the other way. An unruled
     row is this lane's to decide under EVERYTHING IS A THUMB (8/9); a row he has
     ruled `whole` is his answer and wins. */
  function takesAnything() {
    var r = buildsRule();
    return !!(r && !(r.ruled === true && r.carries === 'whole'));
  }

  /* ---------------------------------------------------------------------------
     WHAT SURVIVED. `builds` is a plain list of {x, y, ...} handed in by the
     surface; `lit` is a function the surface supplies that answers whether that
     cell still has light. Nothing is fetched here and no map is read.
     A build whose light cannot be determined is KEPT. Losing somebody's house
     because a lookup threw is the worst possible direction to fail in.
     --------------------------------------------------------------------------- */
  function survives(builds, lit) {
    var out = { kept: [], lost: [], unknown: 0, took: takesAnything() };
    if (!builds || !builds.length) return out;
    for (var i = 0; i < builds.length; i++) {
      var b = builds[i];
      if (!b) continue;
      if (!out.took) { out.kept.push(b); continue; }
      var on = null;
      if (typeof lit === 'function') { try { on = lit(b.x, b.y); } catch (e) { on = null; } }
      if (on === null || on === undefined) { out.unknown++; out.kept.push(b); continue; }
      if (on) out.kept.push(b); else out.lost.push(b);
    }
    return out;
  }

  /* ---------------------------------------------------------------------------
     THE WORDS. The kept line goes FIRST: bohemia_fold's own study found losses are
     felt harder than equal gains, so the thing that answers the player's question
     comes before the thing that hurts. Attempts, draft:true, and every number in
     them is a COUNT of real things rather than a value anybody set.
     --------------------------------------------------------------------------- */
  function say(s) {
    if (!s) return [];
    var out = [];
    var k = s.kept.length, l = s.lost.length;
    if (k) out.push(k === 1 ? 'One thing you put up is still standing, and it is yours now.'
                            : k + ' of the things you put up are still standing, and they are yours now.');
    if (l) out.push(l === 1 ? 'One went dark and nobody kept it up. It is gone.'
                            : l + ' went dark and nobody kept them up. They are gone.');
    if (!k && !l) out.push('He put nothing up, so there is nothing to hand over.');
    return out;                                                          /* draft:true */
  }
  function tag(s) {
    if (!s) return '';
    return s.lost.length ? 'WHAT THE DARK TOOK' : 'WHAT STILL STANDS';   /* draft:true */
  }

  /* THE FIELDS THIS DELIBERATELY DOES NOT TOUCH, so a reader can see the edge of
     the decision rather than infer it. */
  var NOT_MINE = ['karma', 'virtues', 'family', 'wounds', 'economyCapacity', 'invest'];

  var API = {
    NOT_MINE: NOT_MINE,
    buildsRule: buildsRule, takesAnything: takesAnything,
    survives: survives, say: say, tag: tag, draft: DRAFT
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaHeir = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
