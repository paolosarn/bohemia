/* ============================================================================
   BOHEMIA -- WHAT PEOPLE REPEAT ABOUT YOU (9/22/26, PEOPLE lane,
   [weights shape], row WHAT-PEOPLE-REPEAT-ABOUT-YOU).

   RULED BY THE COORDINATOR 9/5 (correct-after, off the research; Paolo may
   overrule): "people repeat a HANDFUL of things about a stranger and nothing
   else: did you hurt someone, did you steal, did you help someone who needed
   it, did you keep your word, did you pay what you owed. Everything else weighs
   near zero. A betrayal is worth about five kindnesses, it is remembered
   longer, and it travels further."

   *** MEASURED BEFORE A LINE OF THIS WAS WRITTEN, AND THE TABLE IS NOT THE
   TABLE THE RULING IS ABOUT. *** bohemia_standing ships DEED_WEIGHT empty and
   bohemia_deeds fills it from his own .bq files: 83 rows, and ALL 83 ARE SHAPED
   q:<quest>:<stage>@<FACTION>. Not one row is a thing a person does on the
   street.

   AND THE SEVEN KINDS THE STREET ACTUALLY PUBLISHES ARE NOT IN IT AT ALL:
   claim:met, claim:refused, commit, favour, loan:short, spared, downed. The
   standing organ says what that means in its own words -- "unruled deed =
   weightless" -- so two people can watch you put somebody down and it moves
   nothing, for ever. Controlled both ways: with no row the opinion is 0 now and
   0 after twenty-one days; with a row it is -2.5 now, -1.95 later, and the rung
   reads COLD.

   THIS FILE IS THE SHAPE, AND IT IS AN ATTEMPT, NOT A RULING. Every number is
   draft:true and every one of them is derived from HIS ratio, not picked:
   a betrayal is five kindnesses, so a kindness is 0.5 and a betrayal is 2.5.
   Nothing else gets a row, which is the other half of the ruling.

   NOTHING HERE IS ON THE PLAY SURFACE. Rule 18 holds this lane, so no game file
   calls this; the gate and the vote page do. When the hold lifts, whoever owns
   the boot applies rows() to DEED_WEIGHT beside the quest rows, which are his
   authored faction deltas and are not touched.

   module.exports = { rows, RATIO, KIND, MISSING, apply }
   ========================================================================== */
'use strict';

/* HIS RATIO IS THE ONLY NUMBER, AND EVERY OTHER NUMBER COMES OUT OF IT.
   "A betrayal is worth about five kindnesses" (negativity bias, the coordinator's
   9/5 research). So one kindness is the unit and a betrayal is five of them. The
   unit itself is set to 0.5 because the rung ladder is [-3 HOSTILE, -1 COLD,
   +1 NEUTRAL, +3 WARM]: at 0.5 a single kindness does not move you a rung and a
   single betrayal does, which is the whole point of the finding. */
var RATIO = { draft: true, kindness: 0.5, betrayalIsWorth: 5 };
var KIND = RATIO.kindness;
var BETRAYAL = -(RATIO.kindness * RATIO.betrayalIsWorth);

/* THE FIVE THINGS, IN HIS ORDER, AND WHAT THE STREET ALREADY CALLS THEM.
   A row with no kind is NOT INVENTED HERE: it is named below as missing, because
   making up a deed kind so a table looks full is how a system starts lying. */
var FIVE = [
  { say: 'did you hurt someone',            kind: 'downed',     weight: BETRAYAL },
  { say: 'did you steal',                   kind: null,         weight: BETRAYAL },
  { say: 'did you help someone who needed it', kind: 'spared',  weight: KIND },
  { say: 'did you keep your word',          kind: 'claim:met',  weight: KIND },
  { say: 'did you pay what you owed',       kind: 'loan:short', weight: BETRAYAL }
];

/* AND EVERYTHING ELSE WEIGHS NOTHING, WHICH IS THE HALF OF THE RULING PEOPLE
   FORGET. Each one says why, because a zero with no reason reads as an
   oversight and gets "fixed" by the next lane through. */
var ZERO = [
  { kind: 'claim:refused',
    why: 'turning an outfit down is not breaking your word, it is saying no' },
  { kind: 'commit',
    why: 'throwing in with an outfit is who you run with, not what you are like; '
       + 'faction standing already carries it' },
  { kind: 'favour',
    why: 'somebody doing YOU a favour is a fact about them' }
];

/* THE TWO THE STREET CANNOT SAY YET. Named, not invented. */
var MISSING = [
  { say: 'did you steal',
    note: 'no deed kind exists for taking something that is not yours' },
  { say: 'did you help someone who needed it',
    note: 'the nearest kind is "spared", which is mercy in a fight rather than '
        + 'help; a real one would come from a quest or a day\'s work' }
];

/* HOW FAR IT TRAVELS, WHICH IS THE THIRD LEG OF THE RULING AND THE ONE THAT IS
   FALSE TODAY, BACKWARDS.
   Weight already buys the first two legs for free: the standing organ derives
   how long a deed is remembered from its own weight (deedHalflife), so a
   betrayal at 2.5 fades over 59 days and a kindness at 0.5 over 33. But HOW FAR
   IT CARRIES comes off a separate draft table in the walked city, CT_DEED_CLOUT,
   and measured today it says:
     claim:met      you kept your word         quiet     7 cells, 1 retelling
     loan:short     you did not pay            notable  12 cells, 3 retellings
     claim:refused  you turned an outfit down  notable  12 cells, 3 retellings
     commit         you threw in with somebody risky    17 cells, 4 retellings
     downed         you put somebody down      NOT IN IT  9 cells, 2 retellings
     spared         you let somebody walk      NOT IN IT  9 cells, 2 retellings
   SO THE LOUDEST THING ON THE STREET IS THE ONE THAT SAYS LEAST ABOUT YOU, and
   the worst thing a person can do travels less far than choosing a side.

   THIS IS A PROPOSAL AND NOTHING APPLIES IT. The clout table lives on the play
   surface, which rule 18 holds, and the tags are another draft besides. It is
   here so the recommendation is a thing a machine can check rather than a
   sentence on a page. */
var LOUDNESS = {
  draft: true,
  say: 'a betrayal travels further than a kindness, and neither travels as far '
     + 'as picking a side does today',
  want: {
    'downed':     'reckless',   /* draft: public violence is the most retold thing */
    'loan:short': 'risky',      /* draft: a broken debt is news, not a spectacle */
    'claim:met':  'quiet',      /* draft: unchanged; keeping your word is not news */
    'spared':     'quiet'       /* draft: mercy is seen by whoever was there */
  },
  now: {
    'downed':     null,         /* not in the table, so it runs at the default */
    'loan:short': 'notable',
    'claim:met':  'quiet',
    'spared':     null
  }
};

/* THE ROWS, AS THE TABLE WANTS THEM. Only kinds that really exist. */
function rows() {
  var out = {};
  for (var i = 0; i < FIVE.length; i++)
    if (FIVE[i].kind) out[FIVE[i].kind] = FIVE[i].weight;
  for (var j = 0; j < ZERO.length; j++) out[ZERO[j].kind] = 0;
  return out;
}

/* PUT THEM IN A TABLE WITHOUT TOUCHING WHAT IS ALREADY THERE. His 83 authored
   quest rows are his and are never overwritten, even if a key ever collided. */
function apply(table) {
  var r = rows(), added = 0, kept = 0;
  for (var k in r) {
    if (Object.prototype.hasOwnProperty.call(table, k)) { kept++; continue; }
    table[k] = r[k]; added++;
  }
  return { added: added, keptTheirs: kept };
}

module.exports = { rows: rows, apply: apply, RATIO: RATIO, FIVE: FIVE,
                   ZERO: ZERO, MISSING: MISSING, KIND: KIND, BETRAYAL: BETRAYAL,
                   LOUDNESS: LOUDNESS };
