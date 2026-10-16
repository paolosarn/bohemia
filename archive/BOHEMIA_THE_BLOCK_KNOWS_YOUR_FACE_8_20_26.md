# THE BLOCK KNOWS YOUR FACE (8/20/26, PEOPLE lane)

## WHERE TO SEE IT: the **RUN** tab. Walk up to anybody. The line above the
## movement pad now starts with what they remember of you, before the thing they
## are doing. Nothing to open, nothing to press.

---

## FORTY-FIVE GREEN ASSERTIONS ABOUT PEOPLE REMEMBERING YOU, AND NOBODY HAD EVER REMEMBERED ANYTHING

`engine/bohemia_memory.js` is the witness organ. Written 7/19. Minds hold
sightings, familiarity slows forgetting, clarity decays as `0.5^(age/halflife)`,
fully deterministic. `gates/memory_gate.js` has proved all ten of its claims green
for a month.

`engine/bohemia_standing.js` sits on top of it. Written 8/2, 344 lines, deeds and
opinions and gossip and hearsay decay, 35 more green claims.

**Measured 8/20: neither module appears in any file a player can reach.** Not the
city, not the alpha, not one slice. Forty-five green assertions, and no person in
this game had ever remembered seeing anybody.

## AND THE GAME HAD ALREADY WRITTEN THE FINDING DOWN

This is the part worth keeping. In `xchWorld`'s own comment, dated 8/18:

> "bohemia_deeds.js and bohemia_standing.js both exist in engine/ and NEITHER IS
> IN THIS FILE (measured 8/18: zero occurrences), so what he was SEEN doing is
> not askable here yet."

Somebody measured it correctly, wrote it down accurately, shipped a substitute
that counts doors knocked, and moved on. **A FINDING RECORDED IN A COMMENT IS NOT
A FINDING FIXED.** It sat there for two days being true.

Twelfth built-and-gated-and-unreachable capability this lane has closed.

## WHO CAN SEE YOU IS WHO THE GAME ACTUALLY DREW

The witnesses are read off `BARK_DREW`, the list `peoplePass` fills with the
bodies it really blitted this frame, positions included.

A second visibility calculation would be a second answer, and the two would drift
the first time either changed. Worse, it could credit a sighting to somebody who
is not on screen. The render is the ground truth for who is present, so the
render is what this reads. Same reason the tell reads `qkOf()`: one answer per
person, never two.

## A RECOGNITION IS NOT A NAME

YOU HAVE TO ASK (7/31) governs the name, and nothing here touches it: `nameOf()`
still returns null for a stranger and this never prints one. But a face is not a
name. Somebody can know they have seen you around without having been introduced,
and that gap is exactly the difference between a crowd and a neighbourhood. The
gate asserts the person beside you is still un-asked and that no name reached the
line.

## THE FOUR STATES, MEASURED ON THE ORGAN'S OWN CURVE

Not simulated, not hand-set: the clock is wound forward on the real surface and
the phrase read back.

| age | clarity | what the line says |
|---|---|---|
| 0h | 1.000 | has seen you before |
| 6h | 0.841 | has seen you before |
| 12h | 0.707 | has seen you before |
| 20h | 0.561 | half-remembers you |
| 36.7h | 0.347 | half-remembers you |
| 66.7h | 0.146 | almost places you |
| far enough | below 0.05 | *nothing. a stranger again.* |

**Familiarity is a separate axis** and it is what a neighbour has that a
passer-by does not: three separate encounters and the top line becomes "knows you
by now". And familiarity counts ENCOUNTERS, not frames -- walking past somebody
for an hour is one encounter, because `see()` refreshes inside its window. Seeing
them on five different occasions is five.

**The last row is the one that matters most.** The most-cited flaw in New Vegas's
reputation is that it can never be removed, only buried under a bigger opposite
number: there is no honest road back. Here memories fade, so a face you never see
again becomes a stranger, and time alone softens what you did. The gate asserts
it, and a mutation that made recognition permanent goes red.

**The words are DRAFT.** All four phrases live in one table, `CT_KNOWS`, so there
is exactly one place to rewrite them.

## WHAT IT DELIBERATELY DOES NOT DO

**No opinion, no gossip, no standing rung.** Those are `bohemia_standing.js` on
top of this organ, and they need DEEDS -- which need the player to be able to DO
something the block can judge. Wiring the witness half first is what makes the
rest possible, and it is honest on its own.

**No mechanical bonus for being known.** What recognition is WORTH is a dial, and
NO DAMAGE BEFORE THE DIAL.

## THE MACHINE

| file | what |
|---|---|
| `tools/bohemia_city_memory_patch.py` | new; inlines the organ, wires the witness pass, puts recognition on the tell |
| `slices/BOHEMIA_CITY_WORLD.html` | +232 lines |
| `gates/city_memory_gate.js` | new; 23 claims, on the real alpha through the RUN tab |
| `gates/bohemia_gates.py` | registered as CITY MEMORY (302 of 400) |

Idempotent, proved by md5 over three runs, one hash.

Mutation-proved four ways, each with the mutation's arrival verified in the file
under test **before** the gate was run:

| mutation | result |
|---|---|
| put the throttle bug back | **7 red** |
| drop the SEE_RANGE check | **1 red** |
| witness from the roster instead of what was drawn | **7 red** |
| make recognition never fade | **1 red** |

## THREE THINGS THIS TURN GOT WRONG FIRST

**A THROTTLE THAT MARKS THE WORK DONE BEFORE DOING IT IS A DROPPED FRAME WITH A
RECEIPT.** The witness pass runs once per game-minute. The first cut set the
minute-marker before reading the roster -- and `peoplePass` returns early while
the player sprite is still baking ("no body yet: draw nobody, never a
placeholder"), so the boot render leaves `BARK_DREW` empty. The pass recorded
nobody and claimed the minute anyway, and every later render that minute
short-circuited. The effect: the neighbour standing TWO CELLS AWAY at spawn never
saw you until you had walked a full game-minute, which is twelve cells, which is
out of his sight. Found by measuring, not reading: minds 0 after render, and
forcing the gate open recorded instantly.

**A WHOLE-REGION REPLACE IS A DELETE PLUS AN INSERT, AND I WROTE ONLY THE
INSERT.** The tool's refresh branch replaced the inlined organ but wrote the
store block after it -- where the previous run's store already sat. Second run:
+105 lines. Third would have been +105 again. Caught by running it three times
and comparing md5, which is now how this tool is checked.

**AN ASSERTION THE SCENARIO NEVER EXERCISES PROVES NOTHING.** "Nobody outside
SEE_RANGE ever witnessed anything" was true, correct, and useless: at boot only
one body is drawn and it is already two cells away, so there was never anybody to
exclude. Deleting the range check entirely left the gate green. The gate now
PLACES a body out of range and one in it and reads the rule off what happens to
them. Same family as the threshold bigger than the room, found this morning: the
world has to be made to produce the case, not asked politely for it.

## WHAT COMES AFTER

1. **DEEDS.** The organ now records that people SAW you. It cannot yet record
   what they saw you DO, because the walked city has no act big enough to judge.
   `bohemia_standing.js` is written and waiting for exactly that input, and
   `bohemia_deeds.js` already turns a quest outcome into an audience. **This
   lane's, and it is the next one.**
2. **Walking is silent** -- one sfx message, zero footstep code, 97 approved
   sounds unplayed. SOUNDS.
3. **No fight on the walked surface** -- the `startEncounter` hits in the city
   are comments. RUN + COMBAT.
4. **The ridge exterior** -- the one genuinely missing picture. ART's.
