// BOHEMIA COMPANY -- YOUR PEOPLE SHOW UP IN THE ASKING
// (9/13/26, QUESTS lane, [company in asks] YOUR-PEOPLE-SHOW-UP-IN-THE-ASKING)
//
// PAOLO 9/11: "people in your company just get incorporated into quests
// autonomously, that's very cool."
//
// AND THE ROW'S OWN LAST SENTENCE IS THE WHOLE DESIGN:
//
//        *** THEY ARE PEOPLE WITH LEDGERS, NOT A ROSTER. ***
//
// MEASURED BEFORE A LINE WAS WRITTEN. engine/bohemia_down.js, shipped by PEOPLE
// one round ago, says it in its own words after checking the two files that are
// the game: "There is no company roster, no companion state, no downed state."
// True. And the temptation that follows is to build the roster, which would be
// the wrong half: a roster is a list somebody has to maintain, and the moment it
// exists it can disagree with the world.
//
// SO THERE IS NO LIST IN THIS FILE AND THERE CANNOT BE ONE. Membership is
// COMPUTED, every time, from records the world already keeps. Nobody is "added".
// Delete the record and the person stops being yours in the same instant, which
// the gate proves by deleting it.
//
// ---------------------------------------------------------------------------
// WHICH LEDGERS, AND WHY THESE
// ---------------------------------------------------------------------------
// Three things in this repo already record a person and the player together.
// Two of them can NAME somebody and one of them cannot, and that difference is
// stated rather than papered over:
//
//   A BOND      bohemia_quest_runtime.js has carried `bonds` since it was
//               written, and @DO bond is authored 44 times across the corpus.
//               A bond is keyed by ROLE and roles are cast to real people at
//               runtime, so a bond plus a cast IS a named person. NAMES SOMEBODY.
//   A WITNESS   the deed ledger knows who saw what you did, and the standing web
//               can say why they feel that way. NAMES SOMEBODY.
//   A ROOF      bohemia_stayed.js (WORLD, 9/12) already answered "what is a
//               person you kept": the people sleeping under roofs you put up,
//               off the century record's household stamp. But that record is a
//               COUNT PER ACT, not a list of people -- so it can tell you HOW
//               MANY of your people are here and it CANNOT TELL YOU WHICH.
//               NAMES NOBODY, and this file says so instead of guessing.
//
// A ledger that cannot name somebody is still worth reading, because "three of
// your people live on this block" is true and useful. It is just never allowed
// to produce a person, so it can never put a stranger's face on somebody's ask.
//
// ---------------------------------------------------------------------------
// WHAT THIS DOES TO AN ASK
// ---------------------------------------------------------------------------
// bohemia_asks.js turns a running system into somebody who WANTS something, and
// bohemia_claims.js turns the same system into somebody who SAYS something. This
// asks a third question of the same ask: IS THIS ONE OF YOURS?
//
// Two ways it can be, and they are different stories:
//   THEY ARE ASKING    the person in front of you is yours, so the want is your
//                      own household's, not a stranger's errand
//   IT IS ABOUT THEM   a stranger's ask names one of yours, which is the
//                      autonomous incorporation he described
//
// WHAT IS DELIBERATELY NOT HERE
// - NO ROSTER, NO STATE, NO ADD, NO REMOVE. Pure functions of a snapshot.
// - NO NEW RECORD. It reads bonds, witnesses and the household count and writes
//   none of them. The system that owns a record is the one that moves it.
// - NO THRESHOLD. A bond of any size is a bond. "How much of a bond counts" is a
//   number nobody has ruled, so there is not one in here.
// - NO CONTENT. Not one person, place or count. Every value comes from the
//   snapshot the live world hands in.
//
// REUSE CHECK: cooks no pixels, opens no bank, writes no save, moves nobody,
// adds no verb, and owns no list.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* ==================================================================== */
  /*  THE LEDGERS. names:false is not a gap, it is an honest limit.        */
  /* ==================================================================== */
  var FROM = {
    bond: {
      id: 'bond', names: true, from: 'the quest runtime',
      says: 'you have a bond with them',                          /* draft:true */
      proof: { file: 'engine/bohemia_quest_runtime.js', symbol: "case 'bond'" }
    },
    witness: {
      id: 'witness', names: true, from: 'the deed ledger',
      says: 'they saw what you did',                              /* draft:true */
      proof: { file: 'engine/bohemia_deeds.js', symbol: 'publish' }
    },
    roof: {
      id: 'roof', names: false, from: 'the century record',
      says: 'they sleep under a roof you put up',                 /* draft:true */
      cannot: 'the household stamp is a count per act, not a list of people',
      proof: { file: 'engine/bohemia_stayed.js', symbol: 'stayed' }
    }
  };

  var ORDER = ['bond', 'witness', 'roof'];

  function arr(x) { return Object.prototype.toString.call(x) === '[object Array]' ? x : []; }
  function pick(o, k, d) { return (o && o[k] != null) ? o[k] : d; }

  /* ==================================================================== */
  /*  THE FIRST GATE, IN CODE                                             */
  /* ==================================================================== */
  /* NOBODY IS YOURS BY DEFAULT. A candidate is one of your people only if a
     ledger that can NAME somebody actually named them. Anything else is refused
     with a reason, and a refusal here is the normal case: most people in the
     valley are strangers and that is what makes yours mean anything. */
  function refuse(c) {
    if (!c || typeof c !== 'object') return 'not a candidate';
    if (!c.who)              return 'names nobody';
    var f = FROM[c.from];
    if (!c.from)             return 'no ledger says so';
    if (!f)                  return 'a ledger that does not exist: ' + c.from;
    if (!f.names)            return 'that ledger cannot name anybody: ' + f.cannot;
    return null;                            /* null means THEY ARE ONE OF YOURS */
  }
  function isMember(c) { return refuse(c) === null; }

  /* ==================================================================== */
  /*  READING THE LEDGERS INTO PEOPLE                                     */
  /* ==================================================================== */
  /* A BOND IS KEYED BY ROLE AND A ROLE IS NOT A PERSON. The runtime records
     bonds against the role name a quest declared, and the cast is what turns a
     role into somebody. So a bond without a cast names nobody and is skipped
     rather than reported as a person called "lineman". */
  function fromBonds(snap) {
    var bonds = pick(snap, 'bonds', null), cast = pick(snap, 'cast', null), out = [];
    if (!bonds) return out;
    for (var role in bonds) {
      if (!Object.prototype.hasOwnProperty.call(bonds, role)) continue;
      var who = cast && cast[role];
      /* FOLLOW THE ARTEFACT: the city's own cast entries carry `.key` (a
         'P:city:12' string), not `.who`. Reading only who/id found nobody on the
         real surface and reported an empty company, which is the same answer as
         "you have nobody" and is exactly the ambiguity this row exists to end. */
      if (who && typeof who === 'object') who = who.who || who.key || who.id || null;
      if (!who) continue;                  /* a role nobody was cast into */
      out.push({ who: who, role: role, from: 'bond', strength: bonds[role],
                 where: (cast && cast[role]
                         && (cast[role].where || cast[role].at)) || null });
    }
    return out;
  }

  /* A WITNESS IS ALREADY A PERSON. The deed ledger deals in minds that saw a
     thing, so nothing has to be resolved. */
  function fromWitnesses(snap) {
    return arr(pick(snap, 'witnesses')).filter(function (w) {
      return w && w.who;
    }).map(function (w) {
      return { who: w.who, from: 'witness', where: w.where || null,
               saw: w.saw || w.kind || null };
    });
  }

  /* yours(snapshot) -- every person a naming ledger says is yours, with the
     reason. No list is kept: this is recomputed from the snapshot every call. */
  function yours(snap) {
    var out = fromBonds(snap).concat(fromWitnesses(snap)), seen = {}, uniq = [];
    for (var i = 0; i < out.length; i++) {
      var c = out[i];
      c.refused = refuse(c);
      if (c.refused) continue;
      if (seen[c.who]) continue;           /* one person, one entry */
      seen[c.who] = true;
      c.says = FROM[c.from].says;                                  /* draft:true */
      uniq.push(c);
    }
    return uniq;
  }

  /* howMany(snapshot) -- what the ROOF ledger knows, which is a number and never
     a person. Kept separate from yours() on purpose: a count cannot be asked a
     question and must never be mistaken for one. */
  function howMany(snap) {
    var n = pick(snap, 'housed', null);
    if (typeof n !== 'number' || !(n > 0)) return null;
    return { count: Math.floor(n), from: 'roof', names: false,
             cannot: FROM.roof.cannot, says: FROM.roof.says };      /* draft:true */
  }

  /* isYours(snapshot, who) -- the reason, or null. THE ONLY MEMBERSHIP TEST, and
     it is a lookup in the world rather than in a list this file holds. */
  function isYours(snap, who) {
    if (!who) return null;
    var mine = yours(snap);
    for (var i = 0; i < mine.length; i++) if (mine[i].who === who) return mine[i];
    return null;
  }

  /* ==================================================================== */
  /*  WHAT IT DOES TO AN ASK                                              */
  /* ==================================================================== */
  /* inAsk(ask, snapshot) -- is this ask one of yours, and in which of the two
     ways. Returns null for a stranger's errand about a stranger, which is most
     asks and is correct. THE ASK IS NOT CHANGED: this reads it and hands back a
     tag, because the generator owns the ask. */
  function inAsk(ask, snap) {
    if (!ask) return null;
    var asking = isYours(snap, ask.who);
    var about  = isYours(snap, ask.about);
    if (!asking && !about) return null;
    return {
      mine: true,
      asking: asking ? { who: asking.who, because: asking.says, from: asking.from } : null,
      about:  about  ? { who: about.who,  because: about.says,  from: about.from }  : null,
      draft: true
    };
  }

  /* say(tag) -- the line, in plain words, and it never names a number or a
     ledger at the player. draft:true. */
  function say(tag) {
    if (!tag || !tag.mine) return null;
    if (tag.asking && tag.about && tag.asking.who !== tag.about.who)
      return 'One of yours is asking, about another one of yours.';
    if (tag.asking) return 'This is one of yours asking.';
    return 'A stranger is asking about one of yours.';               /* draft:true */
  }

  /* ledgers() -- what the module reads, and which of them can name somebody.
     Published so a gate can hold the honest limit rather than trusting a comment. */
  function ledgers() { return ORDER.map(function (k) { return FROM[k]; }); }
  function naming()  { return ledgers().filter(function (f) { return f.names; }); }
  function counting(){ return ledgers().filter(function (f) { return !f.names; }); }

  var API = {
    FROM: FROM, ORDER: ORDER,
    refuse: refuse, isMember: isMember,
    yours: yours, howMany: howMany, isYours: isYours,
    inAsk: inAsk, say: say,
    ledgers: ledgers, naming: naming, counting: counting
  };
  if (HASREQ) module.exports = API; else root.BohemiaCompany = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
