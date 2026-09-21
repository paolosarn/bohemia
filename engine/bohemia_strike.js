// BOHEMIA STRIKE — THE BLOCK HOLDS THE DOOR (9/21/26, WORLD lane)
// Board row [block strikes] / WE-BUILT-THE-CUT-OFF-AND-NEVER-BUILT-THE-STRIKE.
//
// ============================================================================
// THIS ROW WAS HELD FOR SIX ROUNDS ON A MEASUREMENT TAKEN ON THE WRONG PAGE
// ============================================================================
// On 9/15 this lane measured the walked surface and wrote:
//
//     "CT_MINDS IS EMPTY AND STAYS EMPTY. At the door 0 minds; after twelve
//      hours of advanced game time, still 0. ZERO of the block's 20 residents
//      has a mind, so whoVouches over the block returns nothing, ALWAYS, and
//      the picket cannot be counted. THE FIX IS GIVING A BLOCK'S RESIDENTS
//      MINDS, WHICH IS 09 PEOPLE'S LANE."
//
// That was true of the page I opened and false of the game. PLAYER_CV is set
// ONLY by a postMessage from the parent frame, so the walked city opened on its
// own is never sent a body -- and peoplePass() returns 0 on its FIRST LINE when
// there is no body, so it draws nobody at all. No bodies drawn, no minds born.
// I measured a city with no people in it and concluded the game had no people.
//
// RE-MEASURED ON THE DEMO HE ACTUALLY PLAYS, through the one driver (rule 14g),
// with the player's position checked so a sample from somebody who never moved
// cannot be read as a walk:
//
//     at the door ......... 2 minds,  6 bodies drawn
//     walking, 4 seconds ... 25 minds, 9 people known by name
//     on the player's own block ......... 6 minds
//     a deed done in front of them ...... seen, and it lands in the mind
//
// THE PICKET CAN BE COUNTED. It was countable the whole time.
//
// ============================================================================
// WHAT GLASGOW 1915 ACTUALLY WAS, WHICH IS WHY THIS IS NOT A MONEY MECHANIC
// ============================================================================
// 25,000 families stopped paying and won in nine months, and the mechanism was
// never the money. It was THE VACANCY. Bailiffs were driven from doors and empty
// houses were picketed so nobody could take the flat. A landlord's cut only works
// if he can replace you. IF THE BLOCK HOLDS THE DOOR, HE CANNOT.
//
// So this module answers exactly one question -- CAN THE CUT BE MADE TO STICK --
// and the answer is about people, not batteries.
//
// ============================================================================
// MECHANISM-MINE / CONTENTS-PAOLO'S, AND THERE IS NO WEIGHT IN THIS FILE
// ============================================================================
// A MAJORITY IS THE SHAPE OF A PICKET, NOT A TUNED NUMBER. More of the block
// standing with you than against you is what "the block held" means in plain
// English, so nothing here is a dial he has to set and nothing here ships a
// weight. The opinions themselves come from bohemia_standing, off real deeds
// with his own CLOUT_WEIGHTS behind them, and this file never touches them.
//
// THE PRICE OF GETTING THE LIGHT BACK IS HIS ONE. Board note, already decided:
// "relight costs one, his 8/15 EVERYTHING COSTS ONE answers it". So it is READ
// off the purse's ruled table and never typed here.
//
// ============================================================================
// *** AND THE EMPTY STATE IS THE WHOLE TRAP THIS ROW SAT IN FOR SIX ROUNDS ***
// ============================================================================
// Early in the game almost nobody has seen you do anything. A block where no
// resident holds an opinion is NOT a block that is against you -- it is a block
// that does not know you. Those are different facts and a counter that collapses
// them will report "the strike failed" on day one, every time, forever.
//
// So `held()` has THREE answers, not two: HELD, BROKEN, and NOT KNOWN. Nothing
// in this file ever converts silence into a verdict. That is the same rule this
// lane put on the notice module last round (refuse rather than print a plausible
// number) and the same one that took six rounds to learn here.
(function (root) {
  'use strict';

  var DRAFT = true;

  /* the three answers, named, so a caller cannot mistake silence for a no */
  var HELD = 'HELD', BROKEN = 'BROKEN', NOT_KNOWN = 'NOT_KNOWN';

  function standing() {
    try { if (root && root.BohemiaStanding) return root.BohemiaStanding; } catch (e) {}
    if (typeof module !== 'undefined' && typeof require !== 'undefined') {
      try { return require('./bohemia_standing.js'); } catch (e) {}
    }
    return null;
  }
  function purse() {
    try { if (root && root.BohemiaPurse) return root.BohemiaPurse; } catch (e) {}
    if (typeof module !== 'undefined' && typeof require !== 'undefined') {
      try { return require('./bohemia_purse.js'); } catch (e) {}
    }
    return null;
  }

  /* HIS ONE, READ, NEVER TYPED. PAYOUT.COMPLETE is the row whose own comment
     says a day's work pays a battery, and 8/15 says everything costs one, so
     buying the light back costs the same one. No table means no price, and no
     price means this module says so rather than inventing a fee. */
  function relightPrice() {
    var P = purse();
    try {
      var row = P && P.PAYOUT && P.PAYOUT.COMPLETE;
      if (row && typeof row.electricity === 'number') return row.electricity;
    } catch (e) {}
    return null;
  }

  /* --------------------------------------------------------------------------
     WHO IS ON THIS BLOCK.

     A mind's id is the person's id, and the city builds those as
     "<neighbourhood x>:<neighbourhood y>:<n>". So the block's own people are the
     minds whose id begins with this block's coordinates.

     THIS IS PARSED, NOT LOOKED UP, ON PURPOSE AND IT IS SAID OUT LOUD: the
     alternative is asking the population module to re-derive who lives here,
     which is a SECOND ANSWER to "who is on this block" and two answers to that
     question is exactly the drift this lane has a paragraph about in the power
     grid. The minds that exist are the people the game drew. Those are the
     people who could picket. A resident nobody has ever seen cannot hold a door.
     -------------------------------------------------------------------------- */
  function onBlock(minds, nx, ny) {
    var out = [];
    if (!minds) return out;
    var want = String(nx) + ':' + String(ny) + ':';
    var keys = Array.isArray(minds) ? null : Object.keys(minds);
    if (keys) {
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].indexOf(want) === 0) out.push(minds[keys[i]]);
      }
      return out;
    }
    for (var j = 0; j < minds.length; j++) {
      var m = minds[j];
      if (m && m.owner && String(m.owner).indexOf(want) === 0) out.push(m);
    }
    return out;
  }

  /* --------------------------------------------------------------------------
     DOES THE BLOCK HOLD THE DOOR.

     minds    the block's own minds (from onBlock), or all of them with nx/ny
     actorId  who the block is deciding about -- '@' is the player
     now      the game's own minute

     Returns { held, vouch, wont, asked, why }. `asked` is how many of the
     block's people hold ANY opinion, and it is the number that separates
     BROKEN from NOT_KNOWN.
     -------------------------------------------------------------------------- */
  function held(minds, actorId, now, opts) {
    opts = opts || {};
    var S = standing();
    if (!S || typeof S.whoVouches !== 'function' || typeof S.whoWont !== 'function') {
      return { held: NOT_KNOWN, why: 'NO_STANDING_MODULE' };
    }
    if (!actorId) return { held: NOT_KNOWN, why: 'NOBODY_TO_DECIDE_ABOUT' };

    var list = minds;
    if (opts.nx != null && opts.ny != null) list = onBlock(minds, opts.nx, opts.ny);
    else if (!Array.isArray(list)) {
      var arr = [], k;
      for (k in list) if (Object.prototype.hasOwnProperty.call(list, k)) arr.push(list[k]);
      list = arr;
    }
    if (!list || !list.length) return { held: NOT_KNOWN, vouch: 0, wont: 0, asked: 0,
                                        why: 'NOBODY_LIVES_HERE_THAT_ANYONE_HAS_SEEN' };

    var vouch = 0, wont = 0;
    try {
      vouch = S.whoVouches(list, actorId, now, { limit: list.length }).length;
      wont = S.whoWont(list, actorId, now, { limit: list.length }).length;
    } catch (e) { return { held: NOT_KNOWN, why: 'STANDING_THREW' }; }

    var asked = vouch + wont;
    /* *** SILENCE IS NOT A NO. *** A block where nobody holds an opinion does not
       know you; it has not decided against you. Six rounds of this row died in
       the gap between those two sentences. */
    if (!asked) return { held: NOT_KNOWN, vouch: 0, wont: 0, asked: 0, people: list.length,
                         why: 'NOBODY_HERE_HAS_SEEN_YOU_DO_ANYTHING' };

    /* A MAJORITY IS THE SHAPE OF A PICKET, not a number anybody tuned. */
    return {
      held: (vouch > wont) ? HELD : BROKEN,
      vouch: vouch, wont: wont, asked: asked, people: list.length,
      why: (vouch > wont) ? 'MORE_OF_THE_BLOCK_STANDS_WITH_YOU' : 'MORE_OF_THE_BLOCK_WILL_NOT',
      draft: DRAFT
    };
  }

  /* --------------------------------------------------------------------------
     CAN THE OWNER'S CUT BE MADE TO STICK.

     The whole row in one function. The owner douses a circuit because you did
     not pay; whether that STICKS depends on whether he can replace you, and he
     cannot replace a door the block is holding.

     A cut is not refused by a block nobody has an opinion about. NOT_KNOWN falls
     through to the cut sticking, which is the honest default: the machinery
     works, and it is the people who have to show up. That is also the design --
     a strike you win by not playing is not a strike.
     -------------------------------------------------------------------------- */
  function cutSticks(minds, actorId, now, opts) {
    var h = held(minds, actorId, now, opts);
    if (h.held === HELD) {
      return { sticks: false, because: 'THE_BLOCK_IS_HOLDING_THE_DOOR', door: h, draft: DRAFT };
    }
    return { sticks: true, because: h.held === BROKEN ? 'THE_BLOCK_DID_NOT_HOLD'
                                                     : 'NOBODY_HERE_KNOWS_YOU_YET',
             door: h, draft: DRAFT };
  }

  /* WHAT IT COSTS TO BUY THE LIGHT BACK, when the cut did stick. His ONE, read.
     A null price is a refusal, not a free relight: a caller that cannot learn
     the price must not quietly turn the lights on. */
  function backOn() {
    var one = relightPrice();
    if (one == null) return { can: false, why: 'NO_RULING', table: 'PAYOUT' };
    return { can: true, costs: one, currency: 'electricity', draft: DRAFT };
  }

  var API = {
    HELD: HELD, BROKEN: BROKEN, NOT_KNOWN: NOT_KNOWN,
    onBlock: onBlock,
    held: held,
    cutSticks: cutSticks,
    backOn: backOn,
    relightPrice: relightPrice,
    draft: DRAFT
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.BohemiaStrike = API;
  return API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
