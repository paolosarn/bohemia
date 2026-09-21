/* ============================================================================
   BOHEMIA -- AN ASK, IN A MOUTH (9/21/26, QUESTS lane, row [a person asks])

   PAOLO 9/20, rule 19, laws/BOHEMIA_LAW_A_QUEST_IS_PEOPLE_PLACES_AND_THINGS_9_20_26.md:
   "Unless the quest has actors and I moved to things and picked things up in the
   overworld, you can't just be putting things on the screen and pretend they're
   the quest. It has to be people, characters, items to pick up, locations to go,
   text coming from people's voice, and when they speak it shows the character
   portrait. The whole enchilada."

   ------------------------------------------------------------------------
   WHAT WAS ALREADY TRUE, AND IT IS MORE THAN THE ROW ASSUMED
   ------------------------------------------------------------------------
   engine/bohemia_asks.js has generated real asks out of the running valley
   since 9/6 and gates them 38/0. Measured on the walked city at minute one:

     shelf_refills        food        at 47,50   -> "A shelf fills back up."
     light_comes_back     circuit 757 at 47,49   -> "A light comes back on."
     block_changes_hands  Church      at 50,46   -> "A block changes hands."

   ALL THREE ARE ATTRIBUTED TO P:city:12:12:0, WHO IS STANDING ON THE WAKING
   BLOCK. The person at his door already exists and already wants something.
   What the valley could not do was SAY IT. The asks reached no mouth and no
   screen -- this lane's own handoff said so: "NOT ON SCREEN YET".

   So this module is the mouth and nothing else. It invents no ask, picks no
   ask, and moves nobody: it takes an ask the generator already made and
   answers with what that person SAYS.

   ------------------------------------------------------------------------
   THE RULES IT KEEPS, EACH BECAUSE A LAW SAYS SO
   ------------------------------------------------------------------------
   1. A PERSON, A PLACE, A THING, A VISIBLE RESULT (rule 19b). Every line names
      where to go and what changes when it is done. A line that cannot name its
      place is REFUSED rather than softened, because "go help somebody" is the
      filler this lane already ruled against: AN ASK THAT CHANGES NOTHING
      VISIBLE IS NOT AN ASK.
   2. THE VISIBLE CHANGE IS THE GENERATOR'S, NEVER RE-TYPED. The closing line
      quotes ask.visible verbatim, so the promise on screen and the promise in
      the ledger cannot drift into two different sentences.
   3. NO CHANGE GETS WORDS IT WAS NOT GIVEN. A change id with no entry here
      returns null and says why. The cheap way to fake this feature is a
      friendly fallback sentence for anything, which would let an unwired
      system look wired.
   4. ANALOG HORROR, AT THE SOURCE (9/20). Ordinary sentences, said plainly, and
      nothing explained. Nobody in here says the world ended; they talk about a
      shelf, a breaker and a fence, which is the whole point of the law.
   5. THEY SPEAK SPANGLISH (8/25). The words carry it the way the rest of the
      valley does, as a person's own register, never as decoration.
   6. draft:true. Every sentence is a real attempt under ALWAYS MAKE AN ATTEMPT
      (8/11) and not one word of it is approved.
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  /* WHAT A PERSON SAYS FOR EACH VISIBLE CHANGE THE GENERATOR CAN NAME.
     Keyed on the generator's own change ids so a new change cannot quietly
     inherit somebody else's mouth. `place` is a function of the ask, never a
     constant, because the generator's `where` is the real address. */
  var MOUTH = {
    shelf_refills: {
      open: "Shelf's been empty since the weekend and nobody's saying when.",
      ask:  "Bring back whatever you can carry.",
      yes:  "Bueno. Anything is better than the shelf like that.",
      no:   "Yeah. Everybody's busy.",
      draft: true
    },
    light_comes_back: {
      open: "Breaker's been down a while and nobody's gone in to throw it.",
      ask:  "Throw it back if you're walking that way.",
      yes:  "Ojala. I'd do it myself but I don't like going in there.",
      no:   "Fine. It's been off this long.",
      draft: true
    },
    block_changes_hands: {
      open: "Fence moved. Nobody moved it while anybody was looking.",
      ask:  "Go stand on it before somebody paints it.",
      yes:  "Then it's ours. Simple as that.",
      no:   "So it's theirs. Also simple.",
      draft: true
    },
    rumour_turns: {
      open: "People are saying something about you and it isn't the true version.",
      ask:  "Go be seen where they're saying it.",
      yes:  "Good. Let them look at you instead.",
      no:   "Then it keeps going around.",
      draft: true
    }
  };

  /* refuse(ask) -- why this ask has no mouth. null means it has one. */
  function refuse(ask) {
    if (!ask || typeof ask !== 'object') return 'not an ask';
    if (!ask.changes) return 'the ask names no visible change';
    if (!MOUTH[ask.changes]) return 'no words are written for ' + ask.changes;
    if (!ask.where) return 'the ask names no place, and a place is half of it';
    if (!ask.visible) return 'the ask names no visible result';
    if (!ask.who) return 'nobody is asking, and an ask needs a mouth';
    return null;
  }

  /* spokenFor(ask, opts) -- what the person says, or null.
     opts.name  what to call them on screen; the module never invents one.
     opts.where a human phrase for ask.where; falls back to the raw address so
                a missing helper is visible rather than silently pretty. */
  function spokenFor(ask, opts) {
    var why = refuse(ask);
    if (why) return null;
    opts = opts || {};
    var m = MOUTH[ask.changes];
    var place = opts.where || String(ask.where);
    /* A COORDINATE IS NOT AN ADDRESS (see placeClause). Nobody says a cell. */
    if (!isAddress(place)) return null;
    var lines = [ m.open, m.ask + ' ' + placeClause(place) ];
    return {
      who: ask.who,
      name: opts.name || null,          /* null is honest: PEOPLE owns names */
      changes: ask.changes,
      place: place,
      says: lines,
      /* WHAT HE CAN SAY BACK. Taking it and refusing it, and the refusal is a
         real answer with a real line, never a greyed-out row. */
      back: [
        { text: "I'll go.",            takes: true,  reply: m.yes },
        { text: "Not right now.",      takes: false, reply: m.no  }
      ],
      /* THE PROMISE, IN THE GENERATOR'S OWN WORDS (rule 2 above). */
      visible: ask.visible,
      draft: true
    };
  }

  /* the one sentence that names the place, built in ONE spot so every change
     says it the same way and a change cannot forget to say it at all.

     *** AND A COORDINATE IS NOT AN ADDRESS. *** This lane already shipped that
     ruling once, when a person's card printed "HERE, 6205 6269" at him: two
     numbers no player can use. The generator's `where` is a raw cell like
     "47,49" because it is a machine field, so a caller MUST hand over a human
     phrase; a bare cell is refused rather than read out loud. The first cut of
     this module said "It's at 47,49" and that is the same defect wearing a new
     coat. */
  var BARE_CELL = /^\s*-?\d+\s*,\s*-?\d+\s*$/;
  function isAddress(place) { return !!place && !BARE_CELL.test(String(place)); }
  function placeClause(place) { return 'It\'s ' + place + '.'; }

  /* ======================================================================
     ARGUING IT, IN HIS MOUTH (9/21, round 45, same row)

     The row: "whose terms he argues in that person's mouth, whose job he takes
     with a word to them." Today every one of those is a ROW ON A CARD, and rule
     19(a) killed the card.

     *** THIS RE-TYPES NOTHING. *** engine/bohemia_haggle.js already holds every
     sentence and every rule: what you can say (`say` on each row), what they say
     back (`said`), the warning before the ask that costs you, and the third ask
     that ends it. Those were written as card rows and they already read as
     speech, because a person wrote them as speech. So this turns the haggle's
     own state into a turn of conversation and invents no line of its own. If a
     word here disagreed with the card, there would be two versions of one deal.

     WHAT IS ADDED, AND IT IS THE ONLY THING ADDED: the frame. Who is speaking,
     what he can say back, and the fact that TAKING IT IS A WORD TO A PERSON
     rather than a button under a card.
     ====================================================================== */
  function talkFor(spoken, haggle, terms) {
    if (!spoken || !haggle || !terms) return null;
    var rows = [], i;
    /* HIS LINES, STRAIGHT OFF THE HAGGLE'S OWN ROWS. */
    var offers = haggle.asks(terms) || [];
    for (i = 0; i < offers.length; i++)
      rows.push({ text: offers[i].say, kind: offers[i].kind, id: offers[i].id, argues: true });
    /* TAKING IT IS A WORD TO THEM. */
    rows.push({ text: spoken.back[0].text, kind: 'take', takes: true, reply: spoken.back[0].reply });
    /* AND WALKING AWAY IS STILL A REAL ANSWER WITH A REAL LINE. */
    rows.push({ text: spoken.back[1].text, kind: 'leave', takes: false, reply: spoken.back[1].reply });
    return {
      who: spoken.who,
      says: spoken.says,
      /* THE WARNING IS THEIRS AND IT IS SAID OUT LOUD BEFORE THE COSTLY ASK,
         because a hidden roll would mean you can never know where you stand,
         and the haggle's own comment says exactly that. */
      warns: haggle.warning(terms) || null,
      /* what THEY said in answer to the last thing you said, if anything. */
      answered: terms.said || null,
      gone: !!terms.withdrawn,
      back: rows,
      draft: true
    };
  }

  /* everyChange() -- which change ids have a mouth, for a gate to compare
     against the generator's own list rather than against a number typed here. */
  function everyChange() { return Object.keys(MOUTH); }

  var API = { spokenFor: spokenFor, talkFor: talkFor, refuse: refuse, everyChange: everyChange,
              isAddress: isAddress,
              MOUTH: MOUTH, VERSION: 'askspoken-1.0.0' };
  if (HASREQ) module.exports = API; else root.BohemiaAskSpoken = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
