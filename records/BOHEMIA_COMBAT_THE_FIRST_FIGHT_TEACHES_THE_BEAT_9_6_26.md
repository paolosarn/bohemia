# V202 — THE FIRST FIGHT TEACHES THE BEAT (COMBAT lane)

VAMILY job: **THE-FIRST-FIGHT-TEACHES-THE-BEAT** `[first fight]`.

> "one lesson per encounter, and the obstacle must be impossible to pass without
> the thing being taught... A first fight that teaches four things teaches none."
> — `records/BOHEMIA_COORDINATOR_RESEARCH_THE_FIRST_FIGHT_TEACHES_9_6_26.md`

---

## THE PROBLEM WAS COUNTED BEFORE IT WAS BUILT

A stranger opens the demo link with no manual and meets a real fight. Four rules
have to be true in their head inside the first minute:

| | the rule | what teaches it |
|---|---|---|
| 1 | **the beat**, at 120 BPM | nothing |
| 2 | it is always a **group** | nothing |
| 3 | a tile is a **house** | nothing |
| 4 | the **companion** takes her own turn | nothing |

Every piece is built. The beat is at the front door, the fight starts where you
stand, the readout is one number. **The ORDER nobody had authored**, and this row
authors exactly one step of it.

## WHAT SHIPPED: THE FIRST FIGHT IS A LESSON IN THE BEAT AND NOTHING ELSE

Measured on the real surface, in the running fight, not read out of the source:

| | the teaching board |
|---|---|
| men | **1** |
| board | **street** |
| cover / cars / upper deck | **0 / 0 / 0** |
| companion | **off** |
| who he is | a plain man with a gun, never a blade and never a machine |
| where he stands | **already inside your reach** (7.3 tiles of 15) |
| words added | **none** |

Lessons two, three and four are kept OUT on purpose. **IT IS A GROUP** cannot be
taught by one man. **USE THE BOARD** cannot be taught with nothing to hide
behind. **A TILE IS A HOUSE** cannot be taught if range never comes up. **THE
COMPANION ACTS** cannot be taught by a companion who is not there — and she would
have won this fight for you, which deletes the lesson outright.

## AND THE OBSTACLE CANNOT BE PASSED EXCEPT BY THE THING BEING TAUGHT

On the teaching board **the dial does not decide, the press does.**

| the press | what happens |
|---|---|
| off the beat | **nothing lands on him** |
| on the beat | **he goes down** |

It reads `G._lastGrade`, the same grade the groove chain has read since V74, so
there is **one judge of what on-the-beat means and not two**. The grade is taken
on the PRESS — which is already this file's rule, because the permission gate
fires the held shot on the beat by design and grading the granted shot would
print PERFECT every time.

## AND YOU CAN SEE IT WITHOUT BEING TOLD

He is **solid inside the window and a ghost outside it** (alpha 1 → 0.34). No
text box, ever: the row says so and the research says why — a lesson that makes
sense inside the world does not break it, and a tooltip does.

**The window is derived, never declared.** `teachAlpha()` reads `GOOD_MS` on the
120 grid, which is arithmetically the same window `gradeOf()` bands (±110 ms of a
500 ms beat = ±0.22 of a beat). *A tell that can drift from the rule is a lie
with an animation on it.*

It sits on the **caller**, not inside `drawEnemySprite`, and that is the whole
point — see the mistakes below. Both the sprite and the fallback disc go through
one door, so it does not matter which of them a given launch is drawing.

## AND THE LESSON ENDS, WHICH IS THE GUARD THAT MATTERS MOST

It is marked learned **only on a WIN** — so dying or quitting in the middle
leaves it standing and the fight you cannot pass without the beat comes back.
Measured: `false → true` on the win, and the next fight through the same door is
an ordinary one (5 men, 52 pieces of cover, companion back on).

The flag is a **LATCH consumed by setup**, so a fight built without a fresh
message — the COMBAT bench's own FOES buttons included — is never a teaching
fight. It rides `PERSIST`'s existing backend, which already falls back to memory
in a launcher that throws on `localStorage`, and it touches **no other lane's
save**.

And **an authored fight is never the lesson.** A quest step or a hold-line
defence is a fight somebody WROTE, with its own roster and its own way to lose;
cutting it down to one man on an empty street would break the thing that asked
for it — and it must not spend the lesson either. A fight carrying a `questId` or
a `defend` contract builds an ordinary board and leaves the lesson standing. *The
lesson waits for a fight the world produced on its own, which is the only kind a
stranger meets anyway.*

## `NO DAMAGE BEFORE THE DIAL`

This row moves **no damage, accuracy, range or resource number**. `KILL_DMG`, the
archetypes and every weapon band are untouched. What it changes is **which of the
existing outcomes a shot resolves to, on one board, for one fight**.

## FOUR THINGS WENT WRONG AND THREE OF THEM WERE THE INSTRUMENT

**1. THE FLAG WAS READ BEFORE IT WAS DECLARED, AND IT THREW ON EVERY FIGHT.**
The first cut put `const _teach` down beside the postMessage and read it in the
`G.encounter` object literal twelve lines ABOVE. That is a temporal dead zone:
`startEncounter` threw `Cannot access '_teach' before initialization` on every
single fight and the flag never went out. **It went red on the real surface,
which is the only reason it is not shipping.** Decided once, at the top, where
both readers can see it.

**2. THE GATE PASSED WITH THE RULE DELETED.** The first cut of the beat arm
pressed the trigger and read the man's health, which sounds like proof and is
not: *an off-beat press can miss on the dial all by itself, and an on-beat one
can hit.* Mutation-tested it, got **35 pass / 0 fail with the rule cut out of the
file**, and that is a checker that agrees with whatever it is shown.

The fix is to **pin the needle the other way round from the answer being
claimed**: the off-beat press is taken with the dial held **dead centre** (the
dial says kill) and the on-beat press with the dial held at a **wild miss** (the
dial says nothing). Both come out backwards from the needle, so only the press
can explain it. `G.angle` is an input held still, never the thing under test.
Mutation now: **35 / 1**, red for the right reason — with the rule gone, the
dead-centre needle killed him off the beat.

**3. THE TELL WAS IN THE DRAW PATH NOBODY IS ON, AND THE CHECKER COULD NOT SEE
IT.** The ghost was first wrapped around `drawEnemySprite`, and the arm asked
`teachAlpha()` what it would return, which is not a picture. **Measured: that
function is called every frame and RETURNS FALSE EVERY TIME** — `enemyLook()` has
no baked look for this man, so what a stranger actually sees is the **fallback
disc** one line below the call. *The tell was real code, in a branch the game
never takes.* Moved to the caller, which is the one door both draws go through,
and proved with a screenshot: at alpha 0 the man is simply not painted.

**AND THE ARM THAT CHECKS IT TOOK THREE MORE WRONG CUTS.** It sampled on-beat
frames against off-beat ones — but **his own peek and fire windows are beat-locked
too** and repaint that disc green or red, which is far louder than any alpha, so
it was measuring HIS COLOUR. Then it sampled sixty frames of one setting followed
by sixty of the other, so the answer was **the camera still settling** at the top
of the fight. Then it read the canvas **in the same frame it set the flag** — and
the reader shares `requestAnimationFrame` with the render loop, so the pixels
belonged to the previous setting and the two arms cancelled: **a 1.3 difference
the wrong way round, on a ghost a screenshot shows working.** It interleaves frame
by frame, reads a frame later, and holds a control box of ground beside him:
51.9 → 61.3 on him, 48.4 → 48.4 on the ground.

**4. MY OWN V201 CHECKER WENT RED ON WORKING CODE, PINNED TO ANOTHER LANE'S
NUMBER.** The street-fight hook arm matched the literal `walkInterrupt(5.04)`.
WORLD's `[faster roads]` row made a step cost what the ground costs, so the call
is `walkInterrupt(_mc*60)` now and **the hook never moved**. What that arm is
checking is WHERE the hook sits, so it matches the call and not its argument.
*A checker pinned to a constant another lane owns is a false alarm waiting for a
date.*

## GATES AT CLOSE

| gate | |
|---|---|
| `combat_entry_gate.js` | **36 pass / 0 fail** (was 31/0) |
| `fight_moves_you_gate.js` | 170 / 0 |
| `combat_lab_gate.js` | 931 / 1 (the red is another lane's KILLMUS rungs, pre-existing) |
| `one_engine_gate.js` | 3 / 0 |
| `boss_ladder_gate.js` | 87 / 0 |
| page errors | **0** |

Mutations: cut the rule → 1 red; never clear the latch and never shape the board
→ 2 red; put the ghost back in the draw path nobody is on → 1 red.

## WHAT COMES AFTER

1. **SOUNDS `[beat teaches]`** and **UI `[no text box]`** are the other two thirds
   of the same research. The beat has to be audible and unmissable during this
   fight, and nothing in it may be explained in words.
2. **Lesson two is the group**, and it is not built: the second encounter should
   be the one that cannot be won by shooting one man at a time.
3. Still not built in this lane: the door as a fighting RETREAT, doorways as
   chokepoints, and the group being drawn from the people actually standing
   there rather than from archetypes.
