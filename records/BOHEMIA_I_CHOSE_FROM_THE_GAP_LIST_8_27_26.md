# I CHOSE FOUR VOICES FROM A GAP LIST AND NEVER ASKED WHAT THE GAME SOUNDS LIKE
# (8/27/26, SOUND lane, post-mortem on batch 25)

> "I didn't like any of the new shit that you made"

Zero for eight. Four songs and the four voices they were built for. All buried,
same turn, graveyard final. **There is no batch 26 in this session** — a second
cook straight into a rejection is the STOP PRODUCING violation by name.

## THREE THEORIES, AND MY OWN DATA KILLED ALL THREE

I want these on the record because the temptation was to publish the first one
and it was wrong.

**THEORY 1: my own variety gate steered the batch away from his taste.** It
rewarded distance from every existing voice, and the existing voices are the ones
he approved — so the harder a voice passed, the further it had walked from him.
It was a tidy story and I believed it enough to build the measurement.

Measured, on the same six axes, against the 98 lead voices his 120 CANON songs
actually use:

    a typical approved lead sits   0.6515 from the centre of his taste
    the farthest approved lead     0.9952

    bowdrag     0.3512        pafvox      0.6443
    scanstring  0.7029        syncthorn   0.7313

**0 of 4 sat outside his approved range.** `bowdrag` is *closer* to the centre of
his taste than a typical voice he approved. The theory is false.

**THEORY 2: they sit in a thin or unpopulated acoustic region.** Also false, and
worse than false — his approved leads span 0.32 to 0.995 from their own centre.
"His taste" is not a tight region in these six numbers at all, which means the
descriptor cannot express taste, only distinctness.

**THEORY 3: they ignore the HORROR KIT the lawbook names** (noise buffers,
karplus, ring mod, waveshaper, pitch-drift, tritone dissonance, heartbeat subs).
I built a detector for it — and it scored `ashchoir` and `coldpiano`, two voices
from his own canon dread set, at **zero of seven**. A detector that reads the
reference set as empty is a broken detector, and it cannot support the claim.

**So I stopped.** Three attempts to measure why he didn't like them, three
rejections by my own evidence. The honest position is that I cannot measure this,
and continuing to try is how the whole batch went wrong in the first place.

## THE ANSWER NEEDS NO METRIC, AND IT IS IN A LOCKED LAW I WALKED PAST

**NEW VOICES LAW (Paolo 7/7/26, LOCKED), clause 2:**

> "All new voices are POST-APOCALYPTIC FINAL FANTASY themed, **always**."

and the direction beside it:

> "horror creepy post-apocalyptic Final Fantasy"

My four were scanned synthesis, hard sync, phase-aligned formant, and stick-slip
friction. Every one of them is an answer to **"what physics is missing from the
rack"** — a question about the ENGINE. Not one was chosen to be creepy,
post-apocalyptic, or Final Fantasy. A hard-sync scream is a 1990s trance lead; I
put it in a horror game about a dead Las Vegas because the rack had never done
oscillator sync.

**I read the law for what it forbade and not for what it required.** The variety
clause is a CONSTRAINT — do not repeat yourself. Clause 2 is the GOAL — sound
like this world. I optimised the constraint and never opened the goal.

## AND NOTHING HAS EVER ENFORCED CLAUSE 2

The lawbook says "Enforced by `_newvoice_gate.js` every ship." **That file does not
exist** — it is in `gates/bohemia_superseded.txt`. No gate in the fleet checks the
theme of a new voice. A locked clause with no machine since 7/7, and I am the one
who walked through the hole.

**I am not building a gate for it.** Three failed measurements this turn are
enough evidence that "is this post-apocalyptic Final Fantasy" is not a thing six
acoustic numbers can decide, and shipping a gate that pretends otherwise would be
worse than the hole — it would let the next person believe the question had been
asked. The correction here is a PROCESS one, written down where the next cook
will read it:

> **A COOK STARTS FROM THE WORLD, NOT FROM THE GAP LIST.** Name the moment in
> the game it is for and the feeling it has to carry, THEN find a technique that
> serves it. Batch 25 ran that backwards: technique first, world never.

## WHAT WAS ACTUALLY REVERTED

- 4 songs out of MLOOPS (132 → 128), tags pruned, tombstones written.
- **4 voice bodies deleted from synthV** (586 → 582, exactly where the rack was
  before the batch). Unlike `particle` and `air` on 8/14 — which were barred but
  kept, because those were METHODS and 0/30 could not separate the method from
  the writing — these are four named voice IDs born and killed in one session
  with nothing calling them. The techniques are NOT barred; this writing of them
  is dead, and that distinction is on each tombstone.
- `NEW_VIBES` is now **empty**, which is the truthful state: there is no fresh
  cook. Two gates had to learn that an empty fresh cook is a state and not a
  hole, without losing the defence they were built for — `voice_audible_gate` now
  asserts that NEW_VIBES was *found and parsed* (so a lost list still fails) and
  reports zero out loud, and `voice_variety_gate` reads the current fresh cook
  instead of the four names it used to hardcode. **A gate written for one batch
  dies with that batch**; both of those are now instruments for the next one.
- The burial tool prunes NEW_VIBES itself now, so a buried song can never stay
  badged NEW — it was pointing him at four songs that no longer existed and
  pointing a gate at leads it could not render.

## WHAT I AM NOT DOING

Not cooking a replacement batch. He said "keep cooking" *before* seeing the
result; the result is in and it is 0 for 8, and the newest signal wins. Whenever
the next batch does happen it starts from the world.

---

# APPENDIX, SAME DAY, HOURS LATER: THE HEADLINE ABOVE IS WRONG AND THE COUNTEREXAMPLE WAS ALREADY IN THE REPO

I went looking for a way to put "a cook starts from the world, not from the gap
list" behind a machine, since a conclusion with no gate is not enforced. Before
writing it I checked the one thing that could kill it, which is what the three
dead theories above taught me to do first.

**IT IS KILLED. BATCH 24 STARTED FROM THE GAP LIST TOO, IN THOSE WORDS, AND WENT
3 FOR 4.**

From `tools/bohemia_music_batch24.py`, verbatim:

> "So the four topologies below were chosen by first reading what the 577-voice
> rack already does and ruling out the near misses"

That is the gap list. It is the same method, written down in the same place, by
the same lane, three days earlier. Its result:

    THE BELLS DISAGREE                      ALIVE
    THE LAST BROADCAST CORRODES             ALIVE
    THE VOICE THAT STILL ANNOUNCES FLOORS   ALIVE
    THE NOTE THAT WOULD NOT STAY ONE        buried

Three of four. Against batch 25's zero of eight. **Same starting method, opposite
outcome.** So the starting method is not the cause, and I had written a fourth
theory into a record on the strength of it reading well. That is exactly the
failure the first half of this document is about, committed again in the act of
writing it up.

## WHAT THE TWO BATCHES ACTUALLY DIFFER ON IS THE SECOND STEP

Both read the rack for a hole. Then:

    BATCH 24    atriumvox    fissionhymn    signalrot    twintoll
    BATCH 25    scanstring   syncthorn      pafvox       bowdrag

Batch 24 answered each hole with **a thing that exists in this world**: the voice
of an atrium, a hymn coming apart, signal rot, two bells tolling against each
other. Batch 25 shipped **the technique itself, wearing the technique's name**:
scanned synthesis, hard sync, phase-aligned formant, stick-slip bow drag.

Nobody chose a hole wrong. Batch 25 stopped after choosing.

## AND THE SHARPEST PAIR IN THE DATA, WHICH IS ALSO THE THINNEST

`atriumvox` and `pafvox` are the SAME SYNTHESIS FAMILY. Both are formant
synthesis; atriumvox is FOF/CHANT grain-per-period, pafvox is Puckette's
phase-aligned formant. One is named for a room in a dead building. One is named
for the acronym in the paper. **The room is canon. The acronym is in the
graveyard.**

That is one pair. It is n=1, it is not proof of anything, and it is written down
here as the most interesting thing in the data rather than as a finding. The
difference in outcome may be entirely in how the two were WRITTEN and have
nothing to do with what they were called. I am not building a gate on it.

## WHAT I AM NOT BUILDING, AND WHY THAT IS THE POINT

No `cook_from_the_world_gate`. Four theories now, four killed by this repo's own
data, and a gate is a claim the machine can check — enshrining an unproven one
would let the next person believe the question had been asked. That is the exact
harm named earlier in this document about clause 2's missing gate, and it does
not get better because the theory is mine.

**What survives as guidance, with no machine behind it and labelled as such:**
read the rack for the hole if you like, that part is fine and batch 24 proves it.
Then do the second step. Do not ship a technique with the technique's name on it.
