// BOHEMIA CLAIMS -- YOU CATCH A LIAR BY WALKING TO THE FENCE
// (9/12/26, QUESTS lane, [check the claim] YOU-CATCH-A-LIAR-BY-WALKING-TO-THE-FENCE)
//
// THE RESEARCH THE ROW WAS HARVESTED FROM (WORDS' first schooled round,
// records/BOHEMIA_HARVEST_THREE_NOTHING_IN_HIS_MOUTH_IS_A_TELL_9_6_26.md):
// of 158 measured deception cues, 118 mean NOTHING, pauses among them, and people
// catch a lie 47% of the time, which is a coin. So:
//
//        *** THE LIAR IS BELIEVED, AND NOTHING IN HIS MOUTH IS A TELL. ***
//
// The design rule that falls out, and the whole of this module: an ask can be a
// CLAIM, and a claim is checked by GOING TO THE THING -- never by a highlighted
// dialogue option, never by a skill roll, never by reading a face.
//
// WHY IT IS A MODULE AND NOT SEVEN QUEST FILES. The seven act-one asks shipped 9/7
// are each hand-written to this rule and that is where the rule stops. The row says
// "build the asking and the checking; the fences already exist." bohemia_asks.js
// turns a running system into somebody who WANTS something. This turns the same
// running system into somebody who SAYS something, and hands the player the only
// instrument that settles it: their own legs.
//
// ---------------------------------------------------------------------------
// THE ADMISSION TICKET, STOLEN FROM ITS SIBLING ON PURPOSE
// ---------------------------------------------------------------------------
// bohemia_asks.js refuses any candidate that cannot name a visible change, BEFORE
// anybody is asked anything, because a reward bolted on at the end is not a
// design. The same shape is the right one here:
//
//        A CLAIM THAT CANNOT BE CHECKED BY WALKING SOMEWHERE IS NOT A CLAIM.
//
// No place to go, or nothing at that place the world actually holds an answer
// about, and it is refused with a reason. An unfalsifiable statement is not a
// claim, it is atmosphere, and atmosphere does not get to waste a player's day.
//
// ---------------------------------------------------------------------------
// *** AND A TELL THAT PREDICTS IS A BUG, WHICH IS A THING A GATE CAN HOLD ***
// ---------------------------------------------------------------------------
// The tempting version of this feature is the one every game ships: the liar
// fidgets. That is the 118 cues that mean nothing, rebuilt as a mechanic, and it
// would quietly delete the row -- because if manner predicts, nobody ever walks.
//
// So manner exists (people are not blank) and it is assigned from WHERE THE CLAIM
// IS ABOUT, never from whether it is true. The gate takes every claim the module
// can make, splits them by true and false, and fails if the manner distributions
// differ at all. A future round that "helpfully" makes liars sweat turns that gate
// red, which is the only way a rule like this survives contact with instinct.
//
// ---------------------------------------------------------------------------
// BELIEVING IS THE DEFAULT, AND IT IS NOT A PENALTY
// ---------------------------------------------------------------------------
// Before you go, the verdict is not "unknown" in some menu: the world ACTS ON THE
// CLAIM. standing() says so in plain words. That is what "the liar is believed"
// means mechanically, and it is why walking is worth the minutes it costs. You are
// never told you were lied to; you find out, or you do not.
//
// WHAT IS DELIBERATELY NOT HERE
// - NO CONTENT. Not one person, place, good or number. Everything comes out of the
//   snapshot the live world hands in, same as its sibling.
// - NO ROLL AND NO GATE. There is no skill in this file and there cannot be one:
//   the only instrument is distance, and the gate greps for it.
// - NO WRITING TO ANY SYSTEM. Catching somebody out produces a deed ROW for the
//   ledger that already exists. This module never publishes it.
// - NO ACCUSATION SCENE. What you say to somebody you caught is content and it is
//   his. This produces the fact, not the confrontation.
//
// REUSE CHECK: cooks no pixels, opens no bank, writes no save, moves nobody, adds
// no verb, and owns no standing of its own.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* ==================================================================== */
  /*  WHAT THE WORLD ALREADY KEEPS AN ANSWER ABOUT                        */
  /*                                                                       */
  /*  Each entry is one FENCE: a thing at a place with a value the world    */
  /*  holds, that a person can be wrong or lying about, and that a player   */
  /*  can settle by standing in front of it.                               */
  /*                                                                       */
  /*  field  -- the snapshot key the world's own answer lives in           */
  /*  says   -- the claim in plain words, both ways. draft:true            */
  /*  look   -- what going there actually means, in plain words            */
  /*  from   -- the running system that holds the answer                   */
  /* ==================================================================== */
  var FENCES = {
    shelf: {
      id: 'shelf', list: 'shelves', field: 'empty', from: 'the block ledger',
      says: { yes: 'There is nothing left on that shelf.',
              no:  'That shelf is still stocked.' },
      look: 'go to the shelf and look at it',
      draft: true
    },
    circuit: {
      id: 'circuit', list: 'circuits', field: 'live', from: 'the grid',
      says: { yes: 'That block still has its lights.',
              no:  'That block has been dark for days.' },
      look: 'stand on the block after dark',
      draft: true
    },
    border: {
      id: 'border', list: 'borders', field: 'blocked', from: 'faction territory',
      says: { yes: 'You will not get through there.',
              no:  'That way is open, walk it.' },
      look: 'walk up to the line and try it',
      draft: true
    },
    talk: {
      id: 'talk', list: 'talk', field: 'against', from: 'the standing web',
      says: { yes: 'They will not speak for you.',
              no:  'They have got nothing bad to say about you.' },
      look: 'ask somebody else on that block what they have heard',
      draft: true
    }
  };

  var ORDER = ['shelf', 'circuit', 'border', 'talk'];

  /* MANNER. People are not blank, and none of this means anything. Every word
     below is draft:true and the list is deliberately ORDINARY: a man who will not
     meet your eye and a man who will are the same man as far as this file is
     concerned. */
  var MANNER = ['says it flatly', 'says it and holds your eye', 'says it quickly',
                'says it like it is obvious', 'shrugs while saying it',
                'says it twice', 'says it and looks away', 'says it quietly'];

  /* THE WORDS THIS MODULE MAY NEVER PUT IN ANYBODY'S MOUTH. Not a filter on his
     writing: a fence around MINE. A generated tell is the failure this row exists
     to prevent, so it is refused in code and the gate fires it at a string it must
     catch. */
  var TELLS = ['nervous', 'shifty', 'sweat', 'fidget', 'stammer', 'stutter',
               'avoids your eye', 'cannot look', 'too quickly', 'hesitat',
               'suspicious', 'lying', 'liar', 'tell'];

  function arr(x) { return Object.prototype.toString.call(x) === '[object Array]' ? x : []; }
  function pick(o, k, d) { return (o && o[k] != null) ? o[k] : d; }

  /* ==================================================================== */
  /*  THE FIRST GATE, IN CODE. Everything else is downstream.             */
  /* ==================================================================== */
  /* A candidate is a CLAIM only if all of these hold. Anything else is refused
     with a reason, before a word is put in anybody's mouth. */
  function refuse(c) {
    if (!c || typeof c !== 'object') return 'not a candidate';
    var f = FENCES[c.fence];
    if (!c.fence)                 return 'names no fence';
    if (!f)                       return 'names a fence that does not exist: ' + c.fence;
    if (!c.who)                   return 'nobody is saying it';
    /* *** THE ONE THAT MATTERS. *** */
    if (!c.where)                 return 'there is nowhere to go and look, so it cannot be checked';
    if (typeof c.asserted !== 'boolean') return 'says nothing that can be true or false';
    if (hasTell(c))               return 'carries a tell, and nothing in his mouth is a tell';
    return null;                                   /* null means IT IS A CLAIM */
  }
  function isClaim(c) { return refuse(c) === null; }

  function hasTell(c) {
    var s = [pick(c, 'said', ''), pick(c, 'manner', ''), pick(c, 'who', '')]
              .join(' ').toLowerCase();
    for (var i = 0; i < TELLS.length; i++) if (s.indexOf(TELLS[i]) >= 0) return true;
    return false;
  }

  /* ==================================================================== */
  /*  MANNER, AND WHY IT IS A HASH OF THE PLACE                           */
  /* ==================================================================== */
  /* Assigned from WHERE, so it is stable (the same person about the same thing
     says it the same way twice) and carries exactly no information about whether
     it is true. Deliberately not random either: random manner would be honest and
     unrepeatable, and a player who cannot rely on a person being consistent
     learns nothing at all. */
  /* *** AND THE MULTIPLY HAS TO BE Math.imul, WHICH I FOUND BY LOOKING. *** My
     first cut used the repo's usual `h = (h * 16777619) >>> 0`. In JavaScript that
     product runs past 2^53, the LOW BITS ARE LOST TO FLOATING POINT, and `% 8`
     then collapses: b01, b07, b12 and b20 all came back 0, so every person on
     every block said it exactly the same way. Measured, not guessed -- four block
     ids, one bucket. Math.imul is the 32-bit multiply this needs and the spread
     is checked by the gate rather than eyeballed. */
  function mannerFor(where) {
    var s = String(where == null ? '' : where), h = 2166136261;
    var mul = (typeof Math.imul === 'function')
      ? Math.imul
      : function (a, b) {                          /* same arithmetic, no imul */
          var al = a & 0xffff, ah = a >>> 16, bl = b & 0xffff, bh = b >>> 16;
          return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)) | 0;
        };
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = mul(h, 16777619) >>> 0; }
    return MANNER[h % MANNER.length];                                /* draft:true */
  }

  /* ==================================================================== */
  /*  READING A RUNNING SYSTEM INTO SOMETHING SOMEBODY SAYS               */
  /* ==================================================================== */
  /* claimsIn(snapshot) -- every claim the world could produce right now.
     THE SPEAKER IS NOT ALWAYS RIGHT AND THIS FILE DOES NOT DECIDE WHO IS. What
     somebody asserts comes in on the snapshot row as `saysIt`; when the world does
     not say what they claimed, the row is a false claim and nothing here flags it.
     If the snapshot has no opinion, the honest default is that they are telling
     the truth, because most people are. */
  function claimsIn(snap) {
    var out = [];
    for (var i = 0; i < ORDER.length; i++) {
      var f = FENCES[ORDER[i]], rows = arr(pick(snap, f.list));
      for (var j = 0; j < rows.length; j++) {
        var r = rows[j];
        if (!r) continue;
        var truth = r[f.field];
        if (typeof truth !== 'boolean') continue;   /* the world has no answer */
        var asserted = (typeof r.saysIt === 'boolean') ? r.saysIt : truth;
        var c = {
          fence: f.id, who: r.who, where: r.where, about: r.about || r.good || r.id,
          asserted: asserted,
          said: asserted ? f.says.yes : f.says.no,               /* draft:true */
          manner: mannerFor(r.where),                            /* draft:true */
          look: f.look, from: f.from, field: f.field, draft: true
        };
        c.refused = refuse(c);
        out.push(c);
      }
    }
    return out;
  }

  /* offer(snapshot) -- ONE claim, or null. Same discipline as its sibling: no
     scoring and no invented preference, so it is the order the world handed them
     in until somebody rules otherwise. */
  function offer(snap) {
    var live = claimsIn(snap).filter(isClaim);
    return live.length ? live[0] : null;
  }

  function refusals(snap) {
    return claimsIn(snap).filter(function (c) { return c.refused; })
      .map(function (c) { return { fence: c.fence, why: c.refused }; });
  }

  /* ==================================================================== */
  /*  BELIEVING, WHICH IS WHAT HAPPENS WHEN YOU DO NOT WALK               */
  /* ==================================================================== */
  /* standing(claim) -- where a claim stands before anybody checks it, and the
     answer is never "unknown". The world acts on what it was told. */
  function standing(claim) {
    if (!claim) return null;
    return { believed: true, checked: false,
             because: 'nobody went and looked',                   /* draft:true */
             acting_on: claim.asserted };
  }

  /* ==================================================================== */
  /*  THE ONLY INSTRUMENT: GOING THERE                                    */
  /* ==================================================================== */
  /* check(claim, world) -- what you find when you stand in front of it. `world` is
     the same snapshot shape, read fresh, so what settles it is the running system
     and never the claim. A claim about a place the world no longer holds an answer
     about comes back unsettled, and unsettled is an honest outcome. */
  function check(claim, world) {
    if (!claim || refuse(claim)) return null;
    var f = FENCES[claim.fence], rows = arr(pick(world, f.list));
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!r || r.where !== claim.where) continue;
      var truth = r[f.field];
      if (typeof truth !== 'boolean') break;
      return { went: true, settled: true, found: truth,
               agrees: truth === claim.asserted,
               look: f.look, from: f.from };
    }
    return { went: true, settled: false, found: null, agrees: null,
             look: f.look, from: f.from,
             because: 'you went, and there is nothing there to settle it' };
  }

  /* verdict(claim, found) -- true, false, or not yet. A COMPARISON, never a roll,
     and it exists only after somebody walked. */
  function verdict(claim, found) {
    if (!claim) return null;
    if (!found || !found.went) return 'believed';        /* nobody went */
    if (!found.settled) return 'unsettled';
    return found.agrees ? 'true' : 'false';
  }

  /* say(claim, found) -- the line, in plain words. draft:true. It never names the
     manner as evidence, because the manner is not evidence. */
  function say(claim, found) {
    if (!claim) return '';
    var v = verdict(claim, found);
    if (v === 'believed')  return claim.said + ' You have not been to look.';
    if (v === 'unsettled') return 'You went. There is nothing there to say either way.';
    if (v === 'true')      return 'You went, and it is exactly as they said.';
    return 'You went, and it is not what they told you.';                /* draft:true */
  }

  /* ==================================================================== */
  /*  WHAT CATCHING SOMEBODY OUT LEAVES BEHIND                            */
  /* ==================================================================== */
  /* mark(claim, found) -- a deed ROW in the shape bohemia_deeds.publish already
     takes, so the ledger, the witness range and the feed that already exist carry
     it and no second standing system is built. Returns null unless somebody
     actually went and actually found them out: a lie nobody checked left no mark,
     which is the whole point of the row. */
  function mark(claim, found) {
    if (verdict(claim, found) !== 'false') return null;
    return { kind: 'caught_a_lie', clout: 'notable', delta: 0, faction: null,
             where: claim.where, about: claim.about };
  }

  var API = {
    FENCES: FENCES, ORDER: ORDER, MANNER: MANNER, TELLS: TELLS,
    refuse: refuse, isClaim: isClaim, hasTell: hasTell, mannerFor: mannerFor,
    claimsIn: claimsIn, offer: offer, refusals: refusals,
    standing: standing, check: check, verdict: verdict, say: say, mark: mark
  };
  if (HASREQ) module.exports = API; else root.BohemiaClaims = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
