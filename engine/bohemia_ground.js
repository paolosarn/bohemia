/* ============================================================================
   BOHEMIA -- GROUND THAT REALLY CHANGES HANDS   (9/13/26, QUESTS lane)
   VAMILY row [map moves] / BB-TERRITORY-FLAG.

   THE ROW: "TEN QUESTS SAY THE MAP CHANGES HANDS AND NOTHING IS LISTENING."

   PAOLO 7/24, THE PACING LAW THIS OBEYS: the territory AI's advanceRound "is
   never a tick -- it fires when the narrative calls for it, a quest resolves, a
   story beat lands." The lever is the quest verb @DO advance_territory, opt-in
   per quest, so everyday errands never move the map. That is his design and
   nothing here changes it. What was missing was the other end of the wire.

   PAOLO 9/13, RULE 14, WHICH IS WHY THIS ROW IS NOT A DETOUR: "You offer
   requests just for me to see them, but nothing happens." A card that promises
   something and does nothing is the worst bug in the game. Ten quests promise
   the player that ground changed hands. This is that promise, delivered.

   ------------------------------------------------------------------------
   WHAT WAS MEASURED BEFORE A LINE OF THIS WAS WRITTEN
   ------------------------------------------------------------------------
   1. TEN QUESTS FIRE THE VERB (S15, S18, S20, S21, S22, S23, S24, S25, S26,
      S27). The runtime parses it and sets s.advanceTerritory = true.
   2. NOTHING ON THE WALKED SURFACE READS THAT FLAG. Its only reader is
      bohemia_loop.js:681, which lives in the RETIRED slice.
   3. AND THE OBVIOUS FIX IS DEAD. That reader called the faction engine's
      advanceRound(). With comments stripped, `advanceRound` and `owner.set`
      appear ZERO times in the walked city, ZERO in the alpha, ZERO in the demo.
      That machinery is not on the surface the player walks and cannot be
      revived by calling it. (Raw grep DOES hit twice; both are comments, one of
      them a proof string this lane wrote itself. Reading prose as code has bitten
      this lane four times, so it was checked with comments stripped.)
   4. WHAT IS LIVE IS THE TURF MAP -- BohemiaTowns, 31 references in the walked
      city, and since BB-TURF (9/5, afc3bf7) it is the single answer to who holds
      any cell in the valley. So this goes through the one answer that exists
      rather than reviving a second owner of the same fact.

   ------------------------------------------------------------------------
   *** THE FINDING, AND IT IS THE OPPOSITE OF THE OBVIOUS READING. ***
   ------------------------------------------------------------------------
   Who takes the ground is NOT typed here and was NOT guessed. Every one of the
   ten fires the verb inside a COMPLETE stage tagged #reckless -- all ten, no
   exceptions -- so THE MAP ONLY MOVES WHEN YOU DID IT LOUD. And in the four
   quests that state a posture, the faction that pushes is the one you just
   ANGERED:

      S15  faction MOB -12        posture MOB +1
      S18  faction TRADES -8      posture TRADES +1
      S20  faction REDS -18       posture REDS +1
      S21  faction REMNANTS -12   posture REMNANTS +1

   Four for four, the loser of standing is the pusher. THE MAP MOVES AGAINST
   YOU, NOT FOR YOU. The naive version -- the faction you helped is rewarded
   with ground -- is not what a single one of his files says, and it would have
   turned a consequence into a prize.

   The six with no posture line say the same thing with standing alone: each
   names somebody who lost in that stage (Network, Network, Blues, Trades,
   Network), and that is the one that moves.

   *** AND ONE OF THE TEN NAMES NOBODY, SO IT MOVES NOTHING. *** S24's stage is
   `faction Blues +6` and `bond owner -40`: the only thing hurt is a PERSON, not
   a faction. Nobody was crossed, so nobody has a claim, and this module refuses
   rather than inventing a claimant out of the faction that gained. That refusal
   is the difference between reading his files and decorating them.

   ------------------------------------------------------------------------
   WHAT THIS MODULE WILL NOT DO
   ------------------------------------------------------------------------
   - IT NEVER WRITES INTO HOLDS. BohemiaTowns.HOLDS is his AUTHORED override
     ("HOLDS ships EMPTY and an entry in it wins"), which is a statement about
     who starts holding what. A capture at runtime is world state, not authored
     canon, and putting them in one box would mean a playthrough could rewrite
     his rulings. They are separate ledgers on purpose.
   - IT INVENTS NO NAME AND NO NUMBER. Every faction here came out of the
     quest's own @DO lines. There is no threshold for how much standing must
     drop, because "who lost" needs no number -- it is the smallest one, whatever
     the numbers are, which is the same no-number shape the shelf reader uses.
   - ONE BLOCK. EVERYTHING COSTS ONE. A resolution takes one block, never a
     sweep, and there is no size dial to tune.
   - IT KEEPS NO LIST OF WHO OWNS THE VALLEY. The turf map already answers that
     for all 9,216 cells. This holds ONLY the cells a quest actually took, and
     an empty ledger means the map reads exactly as it did before.
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  /* ==================================================================== */
  /*  WHO PUSHES -- read off the quest's own accumulated state             */
  /* ==================================================================== */
  /* The runtime state is what actually ran, so this reads the state rather
     than re-parsing the file: only the paths the player really took have
     accumulated into it, which is the whole point of an opt-in verb. */
  function pusher(state) {
    if (!state || typeof state !== 'object') return null;

    /* POSTURE FIRST, because it is the explicit word for "they push". */
    var post = state.posture || {}, best = null, k;
    for (k in post) if (Object.prototype.hasOwnProperty.call(post, k)) {
      if (!(post[k] > 0)) continue;
      if (best === null || post[k] > post[best]) best = k;
    }
    if (best !== null) return { faction: best, because: 'posture' };

    /* THEN THE ONE YOU CROSSED. No threshold: the smallest is the smallest. */
    var fac = state.faction || {}, worst = null, f;
    for (f in fac) if (Object.prototype.hasOwnProperty.call(fac, f)) {
      if (!(fac[f] < 0)) continue;
      if (worst === null || fac[f] < fac[worst]) worst = f;
    }
    if (worst !== null) return { faction: worst, because: 'standing' };

    return null;                    /* nobody was crossed: nobody has a claim */
  }

  /* ==================================================================== */
  /*  ONE NAME FOR ONE FACTION, AND A BUG THE FIRST DRIVE CAUGHT             */
  /* ==================================================================== */
  /* MEASURED ON THE REAL SURFACE, driving S15 through the live runtime: the
     block went from "Mob" to "MOB". The quest files spell a faction in caps
     (@DO faction_posture MOB +1) and the valley's registry spells it in title
     case ("Mob"), so the capture moved a block from a faction TO ITSELF under a
     second spelling -- a no-op dressed as a conquest -- and wrote into the map a
     name no other system knows, which would break colour, standing and anything
     else keyed on the registry.

     THE RULE IS NOT INVENTED HERE. bohemia_loop.js:583 already resolved exactly
     this, case-insensitively against the real registry, and returned NULL when a
     name did not resolve. That rule is reused rather than rewritten, because two
     answers to "who is this faction" is the same disease BB-TURF cured when the
     14 factions were seated in two places that disagreed by ninety cells.

     AND AN UNKNOWN NAME REFUSES. Writing a faction the valley has never heard of
     is worse than moving nothing. */
  function resolve(name, known) {
    if (!name) return null;
    var list = known || [];
    var i;
    for (i = 0; i < list.length; i++) if (list[i] === name) return list[i];
    var up = String(name).toUpperCase();
    for (i = 0; i < list.length; i++)
      if (String(list[i]).toUpperCase() === up) return list[i];
    return null;
  }

  /* ==================================================================== */
  /*  THE FIRST GATE. Everything downstream is refused before it happens.  */
  /* ==================================================================== */
  function refuse(move) {
    if (!move || typeof move !== 'object') return 'not a move';
    if (move.said !== true)  return 'the quest did not say the map moves';
    if (move.done !== true)  return 'the quest is not finished';
    if (move.outcome !== 'COMPLETE')
      return 'a job that failed takes no ground';
    if (!move.faction)       return 'nobody was crossed, so nobody has a claim';
    if (move.known && !resolve(move.faction, move.known))
      return 'the valley does not know a faction by that name: ' + move.faction;
    if (!move.where)         return 'the quest happened nowhere';
    if (move.held && move.held === move.faction)
      return 'they already hold it';
    return null;                                  /* null means IT REALLY MOVES */
  }
  function moves(move) { return refuse(move) === null; }

  /* readMove(rt, where, heldBy) -- turn a finished quest into a move, or into
     a refusal with a reason. Nothing is performed here. */
  function readMove(rt, where, heldBy, known) {
    var s = (rt && rt.state) || null;
    var who = pusher(s);
    /* THE NAME THE VALLEY USES, not the one the file typed. */
    var real = who ? (known ? resolve(who.faction, known) : who.faction) : null;
    return {
      known:   known || null,
      said:    !!(s && s.advanceTerritory === true),
      done:    !!(s && s.done === true),
      outcome: (s && s.outcome) || null,
      faction: real || (who ? who.faction : null),
      because: who ? who.because : null,
      where:   where || null,
      held:    heldBy || null,
      loud:    !!(s && (s.doneTags || []).indexOf('reckless') >= 0)
    };
  }

  /* ==================================================================== */
  /*  THE LEDGER -- only the cells a quest actually took                   */
  /* ==================================================================== */
  function fresh() { return { took: {} }; }

  function take(ledger, move) {
    var why = refuse(move);
    if (why) return { moved: false, why: why };
    var L = ledger || fresh();
    L.took = L.took || {};
    L.took[String(move.where)] = {
      faction: move.faction,
      from:    move.held || null,
      because: move.because
    };
    return { moved: true, where: String(move.where),
             faction: move.faction, from: move.held || null };
  }

  /* holderOf(ledger, where) -- the runtime holder of one cell, or null when no
     quest has taken it. Null means "ask the map", never "nobody holds it". */
  function holderOf(ledger, where) {
    if (!ledger || !ledger.took || where == null) return null;
    var r = ledger.took[String(where)];
    return r ? r.faction : null;
  }

  function count(ledger) {
    return (ledger && ledger.took) ? Object.keys(ledger.took).length : 0;
  }

  /* WHAT THE STREET SAW. A deed row for the ledger that already exists, so no
     second standing system is built. draft:true -- the words are an attempt. */
  function mark(move) {
    if (!moves(move)) return null;
    return { kind: 'ground_changed_hands', faction: move.faction,
             where: move.where, from: move.held || null,
             clout: move.loud ? 'reckless' : 'notable',
             draft: true };
  }

  function serialize(ledger) {
    return JSON.stringify((ledger && ledger.took) || {});
  }
  function restore(text) {
    var L = fresh();
    try { var o = JSON.parse(text || '{}');
          if (o && typeof o === 'object') L.took = o; } catch (_e) {}
    return L;
  }

  var API = {
    pusher: pusher, resolve: resolve, refuse: refuse, moves: moves, readMove: readMove,
    fresh: fresh, take: take, holderOf: holderOf, count: count, mark: mark,
    serialize: serialize, restore: restore
  };
  if (HASREQ) module.exports = API; else root.BohemiaGround = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
