// BOHEMIA FOLD -- THE GENERATION HANDOFF, AS ONE THING THE RUNTIME CAN RUN
// (9/7/26, QUESTS lane, [generation handoff] THE-FOLD-IN-THE-RUNTIME)
//
// *** THERE ARE TWO FOLDS IN TWO FILES AND NEITHER KNOWS THE OTHER EXISTS. ***
// Measured, and the DYNASTY study found it twice from two directions:
//   engine/bohemia_engine.js foldGeneration carries THE LEDGER -- standings,
//     territory, builds, economyCapacity, invest, karma, virtues, family,
//     blindSpot, recordedKnown -- and has ZERO callers outside the retired slice.
//   the walked city's ctFold carries THE MEMORY -- it advances the witness web,
//     keeps only deeds somebody RETOLD, and returns {gen, carried, died}.
// One knows what you own. The other knows what people still say. A generation
// handoff that runs only one of them is half a handoff.
//
// THIS FILE DOES NOT REPLACE EITHER. It COMPOSES them, because both are somebody
// else's system and rewriting a fold that already works would be the cross-lane
// edit ONE SYSTEM, ONE SESSION forbids. Hand it what each fold returned and it
// answers the three questions the row asks: what carries, what the heir gets,
// and what the beat has to say.
//
// *** WHAT CARRIES IS NOT MY OPINION. *** The table below is the field-by-field
// carry list from records/BOHEMIA_DYNASTY_DAY_13_WHAT_CARRIES_AND_WHAT_MUST_DIE,
// which was written against measured persistence research, and every line of it
// carries the reason it says what it says. Nothing was added here.
//
// *** AND EVERY RATE IS UNRULED ON PURPOSE. *** The one rate that exists in the
// engine today is STANDING_DECAY_TO_NEUTRAL at 0.25 a generation. The study
// measured that social status really persists at about 0.79 a generation, so
// 0.75 is very nearly right -- AND IT IS ON THE WRONG FIELD, because it is the
// only field that decays at all while wealth, which really persists at 0.3 to
// 0.4, carries whole forever. THIS FILE REPORTS THAT AND CHANGES NOTHING.
// Fixing it is a ruling about how his hundred years feel, not a commit.
//
// WHAT IS DELIBERATELY NOT HERE
// - NO SCENE. The row says "the beat itself; canon is his". Who dies at the end
//   of act one is PARKED by Paolo's own words ("I don't know who dies at the end
//   of act one, ask me later"), so the beat here is the MACHINE for the moment
//   and not one line of its story.
// - NO NEW FIELD, and no field dropped. The heir gets what the two folds already
//   produced, sorted by a list that was researched rather than invented.
// - NO DECAY I MADE UP. A field whose rate nobody has ruled carries WHOLE and is
//   listed in unruled(), so the machine says what it does not know.
//
// REUSE CHECK: cooks no pixels, opens no bank, writes no save, and re-implements
// neither fold. It is a reading of two answers somebody else computed.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* ==================================================================== */
  /*  THE CARRY LIST. From the study, with its reasons, unedited.          */
  /*                                                                       */
  /*  carries: 'whole' | 'decays' | 'dies'                                 */
  /*  ruled:   is there a decision about the RATE? almost nowhere.         */
  /*  from:    which fold produced it, so nothing is invented here.        */
  /* ==================================================================== */
  var CARRY = [
    { field: 'standings',       from: 'ledger', carries: 'decays', ruled: true,
      why: 'status persists about 0.79 a generation and takes ten to fifteen to fade, the stickiest thing there is. It is the ONLY field that decays today and the study says the rate is right and it is on the wrong field.' },
    { field: 'deeds',           from: 'memory', carries: 'decays', ruled: true,
      why: 'the eyewitness is dead, so only what was RETOLD is still in the valley. Already built and already correct: do not touch it.' },
    { field: 'territory',       from: 'ledger', carries: 'whole',  ruled: false,
      why: 'property is the real channel of wealth transmission, but a territory is a VACANCY rather than an inheritance and today it carries at 100% forever with no way to lose it.' },
    { field: 'builds',          from: 'ledger', carries: 'whole',  ruled: false,
      why: 'a hard ratchet today. Buildings turn over in decades and the century rule asks for visibly poorer, which is arithmetically impossible while this only climbs.' },
    { field: 'economyCapacity', from: 'ledger', carries: 'whole',  ruled: false,
      why: 'wealth really persists about 0.3 to 0.4, less than half the name, and it carries whole here.' },
    { field: 'invest',          from: 'ledger', carries: 'whole',  ruled: false,
      why: 'drives the district texture, which can only climb today.' },
    { field: 'karma',           from: 'ledger', carries: 'whole',  ruled: false,
      why: 'accumulates only, never subtracts, and the study did not question that. It is on this list so the next round can see it was considered rather than missed.' },
    { field: 'virtues',         from: 'ledger', carries: 'whole',  ruled: false,
      why: 'accumulates like karma and is summed by the monument at the end of the hundred years, so it carries whole and nothing has ever tested whether it should.' },
    { field: 'family',          from: 'ledger', carries: 'whole',  ruled: false,
      why: 'the tree carries, and a relative is {id, rel, alive} with NO NAME. A relative without a name can be counted but not inherited.' },
    { field: 'wounds',          from: 'ledger', carries: 'whole',  ruled: false,
      why: 'write-only today: nothing reads a wound and nothing settles one. The enemies carry and nobody can act on them.' },
    { field: 'blindSpot',       from: 'ledger', carries: 'whole',  ruled: true,
      why: 'monotonic by design, and the finale reads it.' },
    { field: 'recordedKnown',   from: 'ledger', carries: 'whole',  ruled: true,
      why: 'the other half of the two-ledger canon: what the Amalgamation can see and model exactly. Monotonic by design, same as the blind spot.' },
    /* AND THE ONE THING ON THE BRIEF'S OWN LIST THAT DOES NOT CARRY. */
    { field: 'debt',            from: 'neither', carries: 'dies',  ruled: true,
      why: 'a child is not personally liable for a parent\'s unsecured debts; the claim is against the estate and an insolvent estate means the creditor loses. YOU DO NOT INHERIT A BILL, YOU INHERIT LESS AND YOU INHERIT THE PEOPLE HE OWED, still standing there. That is a standing-web query, not a purse line.' }
  ];

  function carryList() { return CARRY.slice(); }
  function unruled()   { return CARRY.filter(function (c) { return !c.ruled; }); }
  function dies()      { return CARRY.filter(function (c) { return c.carries === 'dies'; }); }

  /* ==================================================================== */
  /*  THE FOLD, COMPOSED                                                   */
  /* ==================================================================== */
  function num(x) { return typeof x === 'number' && isFinite(x) ? x : 0; }
  function keys(o) { return (o && typeof o === 'object') ? Object.keys(o) : []; }

  /* fold(ledger, memory) -- ledger is what foldGeneration returned, memory is
     what ctFold returned ({gen, carried, died}). Either may be missing, and a
     missing half is REPORTED rather than filled in. */
  function fold(ledger, memory) {
    var have = { ledger: !!ledger, memory: !!memory };
    return {
      gen: (memory && num(memory.gen)) || (ledger && num(ledger.gen)) || 0,
      ledger: ledger || null,
      memory: memory || null,
      have: have,
      whole: have.ledger && have.memory,
      /* THE HALF THAT IS MISSING, NAMED. A fold that ran one side and said
         nothing is how this ended up as two folds in the first place. */
      missing: have.ledger ? (have.memory ? null : 'memory') : (have.memory ? 'ledger' : 'both')
    };
  }

  /* ==================================================================== */
  /*  WHAT THE HEIR GETS, AND WHAT YOU KEPT COMES FIRST                    */
  /*                                                                       */
  /*  The study measured that ctFold already counts exactly what the heir's  */
  /*  first hour needs -- carried and died -- and that NOTHING CONSUMES     */
  /*  THEM. It also found the order matters: losses are felt harder than    */
  /*  equal gains, so the thing that answers the player's question goes     */
  /*  first and the loss goes second.                                       */
  /* ==================================================================== */
  function whatYouKept(f) {
    if (!f) return null;
    var out = [], m = f.memory, l = f.ledger;
    if (m && num(m.carried) > 0)
      out.push({ what: 'deeds', n: num(m.carried),
                 say: 'people still tell ' + num(m.carried) + ' of the things you did' });
    if (l) {
      var t = keys(l.territory).length, b = keys(l.builds).length,
          s = keys(l.standings).length, fam = (l.family && (l.family.tree || []).length) || 0;
      if (t)   out.push({ what: 'territory', n: t, say: 'you still hold ' + t + ' of the ground' });
      if (b)   out.push({ what: 'builds',    n: b, say: b + ' of what you put up is still standing' });
      if (s)   out.push({ what: 'standings', n: s, say: s + ' outfits still have an opinion about your family' });
      if (fam) out.push({ what: 'family',    n: fam, say: fam + ' of your people are still here' });
    }
    return out;                                                  /* draft:true */
  }

  function whatDied(f) {
    if (!f) return null;
    var out = [], m = f.memory, l = f.ledger;
    if (m && num(m.died) > 0)
      out.push({ what: 'deeds', n: num(m.died),
                 say: num(m.died) + ' of the things you did died with the last person who saw them' });
    if (l && l.family && (l.family.wounds || []).length)
      out.push({ what: 'wounds', n: l.family.wounds.length,
                 say: l.family.wounds.length + ' things nobody has settled came with you' });
    return out;                                                  /* draft:true */
  }

  /* theBeat(f) -- the handoff as the runtime sees it: what to say, in the order
     the study says to say it. THE MACHINE, NOT THE SCENE. Who dies and what the
     room looks like is his, and act two is parked on his own word. */
  function theBeat(f) {
    if (!f) return null;
    var kept = whatYouKept(f) || [], gone = whatDied(f) || [];
    return {
      gen: f.gen,
      kept: kept,          /* FIRST, always: it is the question the player has */
      lost: gone,          /* second: the loss lands harder and does not need help */
      whole: f.whole,
      missing: f.missing,
      unruled: unruled().map(function (c) { return c.field; }),
      draft: true
    };
  }

  var API = { CARRY: CARRY, carryList: carryList, unruled: unruled, dies: dies,
              fold: fold, whatYouKept: whatYouKept, whatDied: whatDied,
              theBeat: theBeat };
  if (HASREQ) module.exports = API; else root.BohemiaFold = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
