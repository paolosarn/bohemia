# FOUR ASSERTIONS THAT COULD NOT FAIL (8/20/26, PEOPLE lane)

## WHERE TO SEE IT: the **CUTSCENE** tab, the fourth chip, THE LAST ROOM. Three
## people are standing in the family's house instead of sitting down to dinner in
## the room they just fought through, and they are on the floor rather than on the
## chairs. The gate work behind it is NOT IN A TAB.

---

## THE GATE SAID 44 PASSED, 0 FAILED, AND FOUR OF THEM WERE DECORATION

Yesterday's standing work shipped with four new checks in `coldopen_gate.js`.
They read fine. They ran green. They were incapable of going red.

```js
ok('a scene can put people ON THEIR FEET (' + posed.standing + ' standing)',
   !posed.missing && posed.standing >= 3 && posed.seated === 0);
```

`coldopen_gate.js` is `ok(condition, message)`. **The other three gates this lane
owns are `ok(message, condition)`** -- `scene_gate.js`, `quirk_gate.js` and
`attempt_gate.js` all take the name first. I wrote four checks in the habit of
the three and put them in the one, so the condition slot received a message
string. A non-empty string is truthy. All four passed unconditionally.

Nothing about this is visible on the page. The call reads correctly, the message
prints correctly if you force a failure by hand, and the count went up by four.

## HOW IT WAS CAUGHT: THE MUTATION DID NOT BITE

Deliberately break the code, confirm the gate goes red. `var standing = ...` was
replaced with `var standing = false;` so nobody could ever stand up.

**The gate stayed at 44/0.**

The first explanation was the comfortable one -- the mutation probably never
reached the alpha the gate actually loads, since the re-inline step's output had
been sent to `/dev/null` where a failure would be invisible. So the test was run
again with a proof step wedged in the middle:

```
PROOF mutation is in the alpha under test: 1
COLD OPEN GATE: 44 passed, 0 failed
```

The mutation was demonstrably in the file under test and the gate still did not
care. That killed the comfortable explanation and left the real one.

**A MUTATION TEST THAT DOES NOT PROVE THE MUTATION ARRIVED IS TESTING THE
ORIGINAL CODE.** That proof line is now a permanent step, not a debugging aid.

## THE FIX IS NOT THE FOUR CALLS

Correcting four argument orders is the worse half of the fix, because it leaves
the trap armed for the fifth one. So the slot defends itself, in all four of the
lane's gates:

```js
if (typeof c === 'string') throw new Error('GATE BUG: ok() got a STRING as its condition...');
if (typeof m !== 'string') throw new Error('GATE BUG: ok() got a ' + typeof m + ' as its message...');
```

Both directions, because the reversal is silent from either side. Proved by
reversing a real call in `scene_gate.js`:

```
Error: GATE BUG: ok() got a STRING as its condition. Reversed call: "true"
```

**A GATE CANNOT BE CHECKED BY THE GATE SUITE. IT IS THE CHECKER.** Inside `ok()`
is the only place this class of bug can be caught at all.

## HOW WIDESPREAD: 310 GATES SWEPT, AND THE ANSWER IS NONE

Before touching anything outside this lane, the whole `gates/` directory was
swept -- every file with an `ok()` helper, its argument order inferred from its
own body, every call parsed for a string literal in the condition slot.

**310 gates. Zero vacuous calls outside the four I wrote.** Two files flagged and
both were artifacts of the sweeper's own template-literal parsing, checked by
eye and cleared. This was my bug in my four assertions, not repo rot, so the
guard went into this lane's four gates and the other 306 were left alone.

## THEN THE THIRD ASSERTION TURNED OUT TO BE WRONG ON ITS MERITS

With the arguments fixed, three of the four bit immediately. The fourth --
"they stand where the camera is looking, not in the far corner" -- still passed
when bodies were deliberately dumped in the corner.

It asked one Manhattan distance against a constant `8`. **The living room is
10x9.** The room's own far corner, the exact wrong answer the check exists to
catch, measures 7. The threshold was larger than the room it was measuring.

Measured on the real alpha, both ways:

| | dx | dy | Manhattan |
|---|---|---|---|
| correct (at the camera) | 0, 0, 2 | 1, 2, 0 | 1, 2, 2 |
| broken (default corner) | 4, 4, 3 | 3, 2, 3 | 7, 6, 6 |

The focus is a **rect**, so the honest test is per-axis containment inside it
plus one cell of spill -- a margin that scales with the scene's own geometry
instead of a number that happens to fit today's room. Third time this lane has
hit the same family: **AN ASSERTION THAT PINS A NUMBER INSTEAD OF A RULE IS
CORRECT ONLY BY COINCIDENCE, AND ONLY TODAY.**

## AND THEN THE PICTURE SHOWED A BUG ALL FIVE HAD MISSED

Five green assertions, every one of them mutation-proved. Then the scene was
rendered and looked at:

**two of the three were standing on the dining chairs.** The mother on the far
chair, the player on the near one, both inside the table's footprint.

`Seating.stand()` finds the nearest free non-solid cell. A chair is free and a
chair is not solid, so chairs won every time. And the check that was supposed to
notice asked whether they were near the camera -- **a chair is extremely near
the camera.** Every assertion was true and the render was still wrong.

Fixed in `Seating.stand()` rather than in the scene, because standing on the
furniture is wrong for every caller: the open floor is searched first and seat
cells only if nothing else is free. A PREFERENCE, NOT A PROHIBITION -- in a room
that is all furniture, standing on a chair still beats vanishing, the same
reason `sit()` already falls back to standing.

New sixth assertion counts `stand` bodies whose cell is in `furn.seats`.
Mutation-proved: `2 on furniture, of 8 seat cells`.

**VERIFY ON THE REAL SURFACE, for the fourth time on this surface.** The
screenshot is not a formality after the gates pass. It is the only check that
sees what the gates were not asked about.

## THE MACHINE

| file | what |
|---|---|
| `gates/coldopen_gate.js` | 44 -> 45; `ok()` guarded; 4 calls corrected; focus rule rewritten; furniture check added |
| `gates/scene_gate.js` | `ok()` guarded (101 passed) |
| `gates/quirk_gate.js` | `ok()` guarded (38 passed) |
| `gates/attempt_gate.js` | `ok()` guarded (15 passed) |
| `engine/bohemia_stage.js` | `Seating.stand()` prefers floor over chairs |
| `engine/bohemia_story_surface.js` | duplicated comment block collapsed |
| `records/BOHEMIA_SCENE_ACT1_THE_LAST_ROOM.json` | set in `family_table`, `needsArt` removed |

Mutation-proved, five ways, each with the arrival of the mutation verified in
the alpha under test before the gate was run:

| mutation | result |
|---|---|
| nobody ever stands | **1 red** (0 standing, 3 seated) |
| pass the focus rect where a cell is wanted | **2 red** (0/3 placed) |
| drop the standing clip from the bake list | **1 red** (4 seated-only) |
| stand at `stand()`'s default corner | **1 red** (2 off-focus) |
| let `stand()` take chairs again | **1 red** (2 on furniture) |

## ONE MORE THING THAT COST WORK

Undoing a one-line test mutation with `git checkout gates/coldopen_gate.js`
deleted every uncommitted line in that file -- the entire standing block, the
guard, the four corrections. **`git checkout <file>` IS NOT AN UNDO, IT IS A
RESTORE FROM HEAD, AND IT DOES NOT KNOW WHICH OF YOUR LINES YOU MEANT.** Same
family as the whole-region replace that ate another lane's work on 8/17. Every
mutation since is backed up to scratch and restored by copy.

## WHAT COMES AFTER

Unchanged, and none of the first four are this lane's:

1. **Walking is silent** -- the city sends one sfx message and has zero footstep
   code, while 97 approved sounds sit unplayed. SOUNDS.
2. **No fight on the walked surface** -- the `startEncounter` hits in the city
   are comments. RUN + COMBAT.
3. **`COLD_OPEN.cast` / `place`** -- `placeHoldLine(spec)` reads only
   `spec.holdLine`; the combat frame has no concept of people or a place behind
   you, so filling those fields would feed something nothing reads. A feature
   COMBAT would build, not a content fill.
4. **The ridge exterior** -- still the one genuinely missing picture, and the one
   scene still carrying an honest `needsArt`. ART's.
5. **DEEDS AND STANDING** -- still zero occurrences in the city, and
   `bohemia_memory.js` is absent too. Three modules and a corpus. **This lane's.**
