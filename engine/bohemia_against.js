// BOHEMIA AGAINST — IS THIS PERSON AGAINST YOU, AND WHAT DOES THE CROWD DO
// ABOUT IT. (9/5/26, PEOPLE lane. VAMILY [who is hostile], row
// THE-CROWD-CARRIES-THE-SIGN.)
//
// THE ROW, IN ITS OWN WORDS: "the between-ledger already computes who is
// hostile to you (sorted hostile-first, they charge more, 'only enemies watch
// you'). None of that reaches the street. Make the sign visible in the crowd:
// they watch, they follow, they block a door, they refuse."
//
// *** MEASURED BEFORE A LINE WAS WRITTEN, AND THE MEASUREMENT SHAPED IT. ***
// There are exactly TWO live ways somebody can be against the player, and I ran
// both on the real surface before choosing anything:
//
//   1. THEIR OUTFIT vs YOURS.  bohemia_between holds nine authored positions.
//      Only THREE outfits of fourteen can ever be at odds with you (Cartel,
//      Caravans, Remnants) and their bases sit 48, 60 and 62 cells from where a
//      new player stands. Your own outfit starts with no enemies at all, and
//      earns them the moment you side with somebody: side with the Caravans and
//      the Cartel is against you from that second.
//   2. THEIR OWN OPINION OF YOU.  bohemia_standing's deed ledger. 82 weights
//      load at runtime off his quest files, and every one is a QUEST deed --
//      the four things you can do on the street (claim:met, claim:refused,
//      commit, favour) are all UNWEIGHTED, so street behaviour moves nobody's
//      opinion until he rules what it is worth. [PENDING Paolo], in the handoff.
//
// AND THE THIRD MEASUREMENT IS THE ONE THAT MATTERS MOST: 0 of 61 people within
// three neighbourhoods of the player's front door run with ANYBODY. The nearest
// base is 29 cells away and a base's pull reaches 12, so a seventeen-cell ring
// around the spawn cannot hold an affiliated body. That is a fact about the MAP
// (not mine) and two dials marked [PENDING Paolo] (not mine either).
//
// SO THIS MODULE READS BOTH CHANNELS THROUGH ONE QUESTION. Where the world is
// genuinely empty it stays dark and it says so; the moment either channel has
// anything to say -- you side with an outfit, you walk onto somebody's ground,
// he turns the STANDING dial -- the crowd carries the sign with no further
// wiring. Building it on either channel alone would have shipped a feature that
// is dark everywhere a demo player actually walks, which is this lane's oldest
// bug wearing a new coat.
//
// NOTHING HERE INVENTS A NUMBER OR A LADDER.
//   - the personal rungs are BohemiaStanding.RUNGS, passed IN as a word. This
//     file does not own a copy of that ladder and must never grow one.
//   - the outfit sign and the war flag are BohemiaBetween's own, passed in.
//   - the four signs are the four the row names, in that order.
// What IS chosen here is which sign rides which rung, and that is an escalation
// order, not a magnitude: watching is the cheapest signal a person can send and
// costs nothing, following costs commitment, refusing withdraws cooperation,
// and blocking a doorway is a claim on ground. Real escalation runs in that
// order and so does this. Every WORD is draft:true.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: the ladder is mechanism, the sentences are
// attempts, and the magnitudes are all somebody else's.
(function (root) {
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* THE FOUR SIGNS, IN ESCALATION ORDER. The row names them in this order and
     that order is also the order a person really escalates: look, close,
     withhold, stand in the way. */
  var SIGNS = ['watch', 'follow', 'refuse', 'block'];

  /* THE LADDER. Three levels, and every one of them is a word that already
     exists somewhere else in this repo -- COLD and HOSTILE are two of
     BohemiaStanding's five rungs, and WAR is BohemiaBetween's `locked:'war'`
     flag. No fourth level is invented to make room for a fourth sign. */
  var LEVELS = {
    cold:    { rank: 1, signs: { watch: true } },
    hostile: { rank: 2, signs: { watch: true, follow: true, refuse: true } },
    war:     { rank: 3, signs: { watch: true, follow: true, refuse: true, block: true } }
  };

  /* PLAIN WORDS, AND THEY ARE ATTEMPTS. ALWAYS MAKE AN ATTEMPT (8/11): text
     ships as a real try tagged draft, numbers wait. He rewrites these; nothing
     downstream reads them as data. Eighth grade, said out loud, no jargon. */
  var WORDS = {
    them: {
      cold:    'THEY RUN WITH PEOPLE WHO DO NOT LIKE YOURS',
      hostile: 'YOUR OUTFIT AND THEIRS ARE AT ODDS',
      war:     'YOUR OUTFIT AND THEIRS ARE AT WAR'
    },
    you: {
      cold:    'THEY SAW SOMETHING THEY DID NOT LIKE',
      hostile: 'THEY HAVE A PROBLEM WITH YOU',
      war:     'THEY HAVE A PROBLEM WITH YOU'
    },
    both: {
      cold:    'THEY SAW SOMETHING, AND THEIR OUTFIT IS NOT YOURS',
      hostile: 'IT IS YOUR OUTFIT AND IT IS ALSO YOU',
      war:     'YOUR OUTFITS ARE AT WAR AND IT IS ALSO PERSONAL'
    }
  };

  /* WHAT THE SIGN LOOKS LIKE, SAID PLAINLY, for a card that has to explain a
     body's behaviour rather than leave the player guessing why somebody turned
     around. Attempts, draft:true. */
  var SIGN_WORDS = {
    watch:  'THEY ARE WATCHING YOU',
    follow: 'THEY ARE KEEPING NEAR YOU',
    refuse: 'THEY WILL NOT DEAL WITH YOU',
    block:  'THEY ARE STANDING IN THE WAY'
  };

  function rankOf(level) { return (LEVELS[level] && LEVELS[level].rank) || 0; }

  /* THE OUTFIT HALF. `rel` is a BohemiaBetween edge read FROM them TO you, or
     null. Its `sign` and its `war` flag are its own; nothing is recomputed. */
  function fromOutfit(rel) {
    if (!rel) return null;
    if (rel.war) return 'war';
    if (rel.sign === 'hostile') return 'hostile';
    return null;
  }

  /* THE PERSONAL HALF. `rung` is a word out of BohemiaStanding.RUNGS, computed
     by the caller with rungFor(). PASSED IN AS A WORD ON PURPOSE: a second copy
     of that ladder living here is the drift this lane has deleted six times. */
  function fromRung(rung) {
    var r = String(rung || '').toUpperCase();
    if (r === 'HOSTILE') return 'hostile';
    if (r === 'COLD') return 'cold';
    return null;
  }

  /* ---- THE QUESTION ------------------------------------------------------
     read({ rel, rung }) -> null, or one answer with the signs it earns.

     NULL IS THE HONEST ANSWER AND IT IS THE COMMON ONE. Most people in the
     valley are against nobody, and a module that returns a neutral object for
     them would put a live sign on every body on the street. Nothing is a real
     answer here, which is precisely why it must never also be the error answer:
     bad input throws nothing and returns nothing, same as indifference, so the
     caller gets the same silence either way -- and that is why the CALLER, not
     this file, is the thing a gate has to walk. */
  function read(facts) {
    if (!facts) return null;
    var a = fromOutfit(facts.rel), b = fromRung(facts.rung);
    if (!a && !b) return null;
    /* THE WORSE OF THE TWO WINS, because a person is not the average of their
       reasons. Somebody whose outfit is at war with yours does not become
       merely cold because they have never personally seen you. */
    var level = (rankOf(a) >= rankOf(b)) ? a : b;
    if (!level) return null;
    var why = (a && b) ? 'both' : (a ? 'them' : 'you');
    var spec = LEVELS[level];
    var signs = {};
    for (var i = 0; i < SIGNS.length; i++) signs[SIGNS[i]] = !!spec.signs[SIGNS[i]];
    return {
      level: level,
      rank: spec.rank,
      why: why,
      /* BOTH HALVES SURVIVE THE JOIN, so a card can say which one it is even
         when only one of them set the level. */
      outfit: a || null,
      personal: b || null,
      word: WORDS[why][level],
      signs: signs,
      draft: true
    };
  }

  /* WHICH SIGNS, AS A LIST, for a surface that wants to say them out loud. */
  function signsOf(ans) {
    if (!ans || !ans.signs) return [];
    var out = [];
    for (var i = 0; i < SIGNS.length; i++)
      if (ans.signs[SIGNS[i]]) out.push({ sign: SIGNS[i], say: SIGN_WORDS[SIGNS[i]], draft: true });
    return out;
  }

  /* ---- WHERE A FOLLOWER STANDS -------------------------------------------
     WORLD MOVERS LAW (Paolo 7/5/26): "NOTHING moves until you do." So this is
     not a chase loop; it is one step, and the caller runs it once per step the
     PLAYER takes. Pure: same inputs, same cell, every time.

     IT STOPS AT TWO CELLS AND THAT DISTANCE IS NOT MINE EITHER. The city's own
     gossip pass already fixed what standing beside somebody means -- "TOGETHER
     MEANS CONVERSATIONAL DISTANCE ... two cells is arm's length plus one" -- so
     a follower closes to exactly that and no further. Any closer and the
     OCCUPANCY LAW fight starts (one body per cell, player included); any
     further and nobody would read it as following.

     ONE CELL PER STEP, DIAGONALS INCLUDED, because the walker has eight
     directions and a follower that could only use four would visibly lag on
     every diagonal. */
  var KEEP = 2;
  function follow(from, to, standable) {
    if (!from || !to) return from || null;
    var fx = from[0] | 0, fy = from[1] | 0, tx = to[0] | 0, ty = to[1] | 0;
    var dx = tx - fx, dy = ty - fy;
    var far = Math.max(Math.abs(dx), Math.abs(dy));
    if (far <= KEEP) return [fx, fy];             /* close enough; hold */
    var sx = fx + (dx > 0 ? 1 : dx < 0 ? -1 : 0);
    var sy = fy + (dy > 0 ? 1 : dy < 0 ? -1 : 0);
    if (sx === tx && sy === ty) return [fx, fy];  /* never onto the player */
    if (standable && !standable(sx, sy)) {
      /* BLOCKED IS NOT STUCK. A body that gives up the moment a wall is in the
         way reads as a bug, so it tries the two slides a person would: the
         horizontal part of the move, then the vertical. If neither is standable
         it holds, which is also what a person does. */
      if (sx !== fx && standable(sx, fy) && !(sx === tx && fy === ty)) return [sx, fy];
      if (sy !== fy && standable(fx, sy) && !(fx === tx && sy === ty)) return [fx, sy];
      return [fx, fy];
    }
    return [sx, sy];
  }

  /* IS THE PLAYER CLOSE ENOUGH TO BE WATCHED AT ALL. BohemiaStanding.SEE_RANGE
     is nine tiles because that is how far you can see something happen, and it
     is passed in rather than copied so the two can never disagree. */
  function inSight(from, to, range) {
    if (!from || !to) return false;
    return Math.max(Math.abs(to[0] - from[0]), Math.abs(to[1] - from[1])) <= (range | 0);
  }

  /* rankOf IS DELIBERATELY NOT EXPORTED. It was, for one round, and the organ
     reach sweep called it dead the first time it looked -- correctly: nothing
     outside this file has any business ranking a level, and read() is the only
     thing that ever needs to. An exported helper with no caller is the exact rot
     that sweep exists to kill, and it does not get an exemption just because I
     wrote it. */
  var API = { SIGNS: SIGNS, LEVELS: LEVELS, WORDS: WORDS, SIGN_WORDS: SIGN_WORDS,
              KEEP: KEEP,
              read: read, signsOf: signsOf, follow: follow, inSight: inSight };
  if (HASREQ) module.exports = API; else root.BohemiaAgainst = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
