// BOHEMIA ASKS -- THE WORLD DOES THE ASKING (9/6/26, QUESTS lane, [asks exist])
//
// Nobody writes a side quest here. A running system produces somebody standing in
// front of you who wants something they cannot get, and the ONLY reason they
// cannot get it is a system that is already turning: an empty shelf, a dead
// circuit, a border with an owner, what people are saying about you.
//
// THE LAW THIS MODULE EXISTS TO ENFORCE (coordinator 9/6, from the research on
// why generated quests read as filler):
//
//        *** AN ASK THAT CHANGES NOTHING VISIBLE IS NOT AN ASK. ***
//
// The failure of generated content is never the generator. It is that finishing
// one changes nothing the player can see. So the visible change is not a reward
// bolted on at the end; IT IS THE ADMISSION TICKET. offer() builds candidates and
// then throws away every one that cannot name what will visibly move, BEFORE
// anybody is asked anything. A candidate with no visible change is not a weak
// ask, it is not an ask, and it is never offered.
//
// AND THE SECOND RULE FROM THE SAME RULING: the verbs are the ones we have. An
// ask that would need the game to learn a new verb is a BOSS, not a quest, so
// every change here names a @DO verb bohemia_quest_runtime.js already runs.
//
// WHAT IS DELIBERATELY NOT HERE
// - NO CONTENT. Not one person, place, price, threshold or count. Every number in
//   an ask comes out of the snapshot the live world hands in. MECHANISM-MINE,
//   CONTENTS-PAOLO'S.
// - NO WRITING TO ANY SYSTEM. This module reads the world and produces the ask.
//   The system that owns the change is the one that moves it (ONE SYSTEM, ONE
//   SESSION), so plan() names the move and never performs it.
// - NO NEW VISIBLE CHANGE. The six below are HIS list from the unpark ruling,
//   word for word. A seventh is a ruling, not a commit.
//
// TWO OF THE SIX ARE NOT WIRED YET AND THIS MODULE SAYS SO OUT LOUD rather than
// pretending. A debt with a name that can be cleared or called in does not exist
// (belonging models debt as a faction WANT, not a balance anybody holds), and
// nothing in the repo moves a person from one house to another. Both ship with
// proof:null, which means offer() refuses them every time. That refusal IS the
// law working, and unwiring is how it gets fixed: give the change a real proof
// and the ask turns itself on with no edit here.
//
// REUSE CHECK: cooks no pixels, opens no bank, writes no save, and adds no verb.
// It reads systems that already run and hands back plain data any UI can render.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* ==================================================================== */
  /*  THE SIX. HIS LIST (unpark ruling 9/6). NOTHING ADDED.               */
  /*                                                                       */
  /*  says   -- plain words for what the player watches happen. draft:true */
  /*  system -- the module that owns the thing that moves                  */
  /*  proof  -- {file, symbol}: what the gate opens to prove it is real.   */
  /*            null means NOT WIRED, and offer() will never emit it.      */
  /*  does   -- the @DO verb bohemia_quest_runtime.js already runs, so no  */
  /*            ask can smuggle in a verb the game does not have.          */
  /* ==================================================================== */
  var CHANGES = {
    block_changes_hands: {
      id: 'block_changes_hands',
      says: 'A block changes hands.',
      system: 'faction territory',
      proof: { file: 'engine/bohemia_engine.js', symbol: 'this.owner.set(d, id)' },
      does: 'advance_territory',
      draft: true
    },
    light_comes_back: {
      id: 'light_comes_back',
      says: 'A light comes back on.',
      system: 'the grid',
      proof: { file: 'engine/bohemia_brownout.js', symbol: 'circuits' },
      does: 'set_flag',
      draft: true
    },
    shelf_refills: {
      id: 'shelf_refills',
      says: 'A shelf fills back up.',
      system: 'the block ledger',
      proof: { file: 'engine/bohemia_economy.js', symbol: 'stocks' },
      does: 'give',
      draft: true
    },
    rumour_turns: {
      id: 'rumour_turns',
      says: 'What people say about you changes.',
      system: 'the standing web',
      proof: { file: 'engine/bohemia_standing.js', symbol: 'gossip' },
      does: 'faction',
      draft: true
    },
    /* ---- NOT WIRED. Measured 9/6, stated instead of faked. ------------- */
    debt_moves: {
      id: 'debt_moves',
      says: 'A debt clears, or somebody calls one in.',
      system: 'nothing owns this yet',
      proof: null,
      unwired: 'belonging models debt as a faction WANT, not a balance with a name on it that anybody can clear',
      does: 'pay',
      draft: true
    },
    /* *** WIRED 9/22, AND NOT BY INVENTING A SEVENTH CHANGE. *** (row [strike
       ask].) This was one of the two of HIS SIX that carried proof:null, with
       the honest note that nothing in the repo moved a person between homes.
       WORLD shipped the strike on 9/21 (engine/bohemia_strike.js, THE BLOCK
       HOLDS THE DOOR) and that is exactly the missing system: Glasgow 1915 was
       never won on money, it was won on THE VACANCY -- a landlord's cut only
       works if he can replace you, and he cannot replace a door the block is
       holding. held() answers whether anybody moves into that flat.
       So the picket's visible change is one he already named, now real: the
       flat stays empty, or somebody moves in. Nothing was added to his list. */
    person_moves_house: {
      id: 'person_moves_house',
      says: 'Somebody moves house, or the flat stays empty.',
      system: 'the block holding the door',
      proof: { file: 'engine/bohemia_strike.js', symbol: 'held' },
      does: 'set_flag',
      draft: true
    }
  };

  var ORDER = ['block_changes_hands', 'light_comes_back', 'shelf_refills',
               'rumour_turns', 'debt_moves', 'person_moves_house'];

  function changes() { return ORDER.map(function (k) { return CHANGES[k]; }); }
  function wired()   { return changes().filter(function (c) { return !!c.proof; }); }
  function unwired() { return changes().filter(function (c) { return !c.proof; }); }

  /* ==================================================================== */
  /*  THE FIRST GATE, IN CODE. Everything else in this file is downstream. */
  /* ==================================================================== */
  /* A candidate is an ask ONLY if all four hold. Anything else is refused
     with a reason, before a single word is put in anybody's mouth. */
  function refuse(cand) {
    if (!cand || typeof cand !== 'object') return 'not a candidate';
    var c = CHANGES[cand.changes];
    if (!cand.changes)  return 'names no visible change';
    if (!c)             return 'names a change that is not on his list: ' + cand.changes;
    if (!c.proof)       return 'the change is not wired: ' + (c.unwired || c.id);
    if (!c.does)        return 'the change has no verb the game already does';
    if (!cand.who)      return 'nobody is asking';
    if (!cand.where)    return 'it happens nowhere';
    return null;                       /* null means IT IS AN ASK */
  }
  function isAsk(cand) { return refuse(cand) === null; }

  /* ==================================================================== */
  /*  READING A RUNNING SYSTEM INTO A WANT                                 */
  /*                                                                       */
  /*  A reader gets the live snapshot and returns candidates. It invents no */
  /*  numbers: every value it puts in an ask came out of the snapshot. A    */
  /*  reader that finds nothing returns nothing, which is the normal case   */
  /*  and is not a failure.                                                */
  /* ==================================================================== */
  function arr(x) { return Object.prototype.toString.call(x) === '[object Array]' ? x : []; }
  function pick(o, k, d) { return (o && o[k] != null) ? o[k] : d; }

  var READERS = [
    /* THE SHELF. The block ledger already tracks stocks per good and already
       prices scarcity. An empty shelf with a person standing next to it is a
       want, and the thing that visibly moves is the shelf. */
    function readShelf(snap) {
      return arr(pick(snap, 'shelves')).filter(function (s) {
        /* *** TWO SHELF FACTS, AND BOTH ARE THE WORLD'S OWN. (9/13, [first ask].) ***
           This read `empty === true` only, so the shelf could not ask for anything
           until a good was ALREADY GONE -- which is far too late to be the first
           thing a stranger meets, and measured on the real surface nothing is gone
           on day one (food 8.4 days, water 59.6, meds 30.4). The countdown is what
           is true at minute one.
           SO IT ALSO TAKES THE SCARCEST, AND THERE IS NO THRESHOLD IN THAT. "The
           thing this valley has least of" is always exactly one good, whatever the
           numbers are, and the nightfall card has shown it with no threshold since
           THE-VALLEY-RUNS-OUT shipped. Both flags are set by the world and read
           here; this file still decides nothing about how few days is few. */
        return s && (s.empty === true || s.scarcest === true);
      }).map(function (s) {
        return { changes: 'shelf_refills', who: s.who, where: s.where,
                 about: s.good, from: 'the block ledger',
                 gone: s.empty === true };   /* gone, or merely the least of */
      });
    },
    /* THE GRID. A dead circuit is the most visible thing in this valley:
       clustered power means a live circuit is owned and a dead block is dark. */
    function readGrid(snap) {
      return arr(pick(snap, 'circuits')).filter(function (c) {
        return c && c.live === false;
      }).map(function (c) {
        return { changes: 'light_comes_back', who: c.who, where: c.where,
                 about: c.id, from: 'the grid' };
      });
    },
    /* THE BORDER. A district with an owner somebody cannot cross. */
    function readBorder(snap) {
      return arr(pick(snap, 'borders')).filter(function (b) {
        return b && b.blocked === true;
      }).map(function (b) {
        return { changes: 'block_changes_hands', who: b.who, where: b.where,
                 about: b.owner, from: 'faction territory' };
      });
    },
    /* THE DOOR. (9/22, row [strike ask].) A flat whose light the owner has cut
       is a door somebody is about to be replaced through, and Glasgow 1915 says
       the way that is beaten is never the money -- it is THE VACANCY. So the ask
       is the picket: stand at the empty door tonight so nobody moves in.

       IT IS REFUSED UNLESS THE DOOR IS REALLY AT STAKE, which is the whole of
       this lane's first law: an ask that changes nothing visible is not an ask.
       A cut that is not live, or a flat nobody is coming for, produces nothing
       rather than a picket over an imaginary eviction.

       `held` is WORLD's, and this reader does NOT re-derive it. Whether the
       block holds the door is their answer; this only notices that a door is
       open to being lost, and hands the want over. */
    function readDoor(snap) {
      return arr(pick(snap, 'doors')).filter(function (d) {
        return d && d.cut === true && d.empty === true;
      }).map(function (d) {
        return { changes: 'person_moves_house', who: d.who, where: d.where,
                 about: d.flat, from: 'the block holding the door' };
      });
    },
    /* WHAT PEOPLE SAY. The standing web already knows who will not vouch for
       somebody. That is a want with a name on it. */
    function readTalk(snap) {
      return arr(pick(snap, 'talk')).filter(function (t) {
        return t && t.against === true;
      }).map(function (t) {
        return { changes: 'rumour_turns', who: t.who, where: t.where,
                 about: t.about, from: 'the standing web' };
      });
    }
  ];

  /* ==================================================================== */
  /*  THE GENERATOR                                                        */
  /* ==================================================================== */
  /* candidates(snapshot) -- everything the running systems produced, refused
     and unrefused, so the refusals can be read and counted. */
  function candidates(snap) {
    var out = [];
    for (var i = 0; i < READERS.length; i++) {
      var got = READERS[i](snap || {}) || [];
      for (var j = 0; j < got.length; j++) {
        var c = got[j];
        c.refused = refuse(c);
        out.push(c);
      }
    }
    return out;
  }

  /* offer(snapshot) -- THE ONE ENTRY POINT. Returns an ask, or null.
     Never returns something that changes nothing. */
  function offer(snap) {
    var all = candidates(snap), live = all.filter(isAsk);
    if (!live.length) return null;
    /* No scoring, no weighting, no invented preference: which one to offer
       first when several are live is a ruling nobody has made, so it is the
       order the world handed them in. */
    var c = live[0], ch = CHANGES[c.changes];
    return {
      changes: c.changes,
      who: c.who,
      where: c.where,
      about: c.about,
      from: c.from,
      visible: ch.says,          /* what the player will watch happen */
      does: ch.does,             /* a verb the runtime already runs */
      draft: true                /* every word of this is an attempt */
    };
  }

  /* why(ask) -- the sentence that makes the ask worth doing, in his words.
     If this is ever empty, the ask should not have been offered. */
  function why(ask) {
    if (!ask || !CHANGES[ask.changes]) return '';
    return CHANGES[ask.changes].says;
  }

  /* plan(ask) -- what the owning system must move, named and NOT performed.
     ONE SYSTEM, ONE SESSION: this module never writes into somebody else's. */
  function plan(ask) {
    var ch = ask && CHANGES[ask.changes];
    if (!ch || !ch.proof) return null;
    return { system: ch.system, file: ch.proof.file, symbol: ch.proof.symbol,
             does: ch.does, where: ask.where, visible: ch.says };
  }

  /* refusals(snapshot) -- why the world stayed quiet. Debugging honesty. */
  function refusals(snap) {
    return candidates(snap).filter(function (c) { return c.refused; })
      .map(function (c) { return { changes: c.changes, why: c.refused }; });
  }

  var API = {
    CHANGES: CHANGES, ORDER: ORDER,
    changes: changes, wired: wired, unwired: unwired,
    refuse: refuse, isAsk: isAsk,
    candidates: candidates, offer: offer, why: why, plan: plan,
    refusals: refusals,
    readerCount: READERS.length
  };
  if (HASREQ) module.exports = API; else root.BohemiaAsks = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
