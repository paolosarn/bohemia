# THE WALL WAS NEVER MISSING — it popped, and a "check" said it did not exist
# 8/26/26, WORLD lane. Executing PLAYTEST DISPATCH item 1 (Paolo 8/25, LOCKED).

> "IN THE RUN WTF IS GOING ON HERE WITH THE SOUTH PART OF THE BUILDING THE WALL
>  CHANGES I HOPE THATS NOT FOR ME WHEN IM SUPPOSED TO BE BEHIND A WALL FACING
>  THE CAMERA AND ITS SUPPOSED TO BE THE WALL OPCAICITY"

## THE DISPATCH SPLIT THAT INTO TWO ITEMS AND THE SECOND ONE WAS WRONG

It was filed as:
- **(a)** a flicker bug, and
- **(b)** *"THERE IS NO WALL-OPACITY SYSTEM IN THIS BUILD. I checked: nothing fades,
  ghosts or cuts away a wall when the player is behind it. He believes we have it.
  WE DO NOT. That is a feature to build."*

**We do have it.** `__XRAY_WHOLE_BUILDING__` has been on the walked surface since
**8/3**, built on his own ruling that day — *"Ofcourse the building should become
see through to reflect characters items or the player or doors"* / *"Building
should be absolutely transparent."*

Measured on the real page, standing behind a wall in the district he spawns in:

| | |
|---|---|
| trials | 60 |
| the building went see-through | **60** |
| solid cells near spawn carrying an enterable mass | 29,453 of 41,077 |
| suburb specifically | 14,370 of 16,157 (89%) |

**And his own sentence already said it.** *"I HOPE THAT'S NOT FOR ME ... AND IT'S
SUPPOSED TO BE THE WALL OPCAICITY."* He is not reporting an absent feature. He is
asking whether the thing he just watched change was the wall opacity — **because it
looked like a bug**. (a) and (b) were never two items. They were one item, and the
one that mattered was (a).

## WHAT WAS ACTUALLY WRONG

Walked him 24 tiles past his own house and recorded the alpha of every wall cell at
every step:

    A WALL CROSSED 0.65 OF ALPHA IN A SINGLE FOOTSTEP.

Solid (1.0) to a third opacity (0.35) between one tile and the next. There were
**three** fade rules on the draw and every one of them was **binary**:

    a = 1                                        // default
    if (wall covers his sprite)      a = WALL_SEE   // 0.35
    if (cell is in his building)     a = XRAY_A     // 0.12
    else if (within XRAY_R of him)   a = WALL_SEE   // 0.35

Each rule is individually correct. Nothing is wrong with any of them. The defect is
that there is **nothing between the states** — the value is recomputed from scratch
every frame and assigned straight to `globalAlpha`. **A hard step in opacity as you
walk IS a flicker.** There is no other way for it to read, and reading the three
rules will never find it, because none of them is the bug.

## THE FIX: A RAMP IN SPACE, AND AN EASE IN TIME

Two changes, deliberately independent, either of which helps and both of which are
needed:

- **RAMP** — `xrayTarget()` returns a continuous value from 1.0 at the outer radius
  to the floor at the inner, driven by his distance to the building's **footprint**,
  so the whole building carries one value (his 8/3 ruling: it is *one object*). The
  radius went 2 → 5 tiles, so it starts opening while he is still walking up to it
  instead of at the last step.
- **EASE** — `xrayEase()` keeps one number per wall cell and moves it a fraction
  (0.22) toward its target each frame, so **no single frame can produce a jump at
  all**, even if a target changes abruptly. A cell entering view starts *at* its
  target rather than easing up from solid, or the fix would have introduced a new
  flicker of its own.

Also: the floor went **0.12 → 0.22**. The old comment already argued that skipping
the draw *"deletes the wall instead of making it see-through"* — 12% is 88% deleted,
which is the same complaint one step quieter. At 0.22 it reads as glass.

| | before | after |
|---|---|---|
| largest single-frame opacity change | **0.65** | **0.112** |
| radius it begins opening at | 2 tiles (1.5 m) | 5 tiles (3.8 m) |
| floor opacity | 0.12 | 0.22 |

## THE GATE

`gates/wall_fade_gate.js`, 10 checks, on the real page, routed in the suite:

- the system **exists** and fires where he walks — so nobody files it missing a third time
- **nothing snaps**: walks 28 tiles at 6 frames a tile and fails if any wall moves
  more than 0.18 of alpha in one frame
- the fade is really **moving** — a build with no fade at all would pass a
  "nothing changed" test, so that is asserted separately
- the **door does not fade with its wall** (his 8/3 ruling, easy to lose in a rewrite)
- **a mutation**: run the same walk with the ease off and it must snap again (0.186)

### AND THE MUTATION TEST WAS WRONG FIRST, WHICH IS WORTH MORE THAN THE FEATURE

The first version reassigned the page's `xrayEase` and re-measured. It reported
0.186 against a ceiling of 0.18 — a pass by 0.006. **The reassignment never took**:
a top-level function declaration on that page is not reachable that way from inside
an evaluate wrapper, so the probe kept calling the real easer the whole time. I was
one rounding error from shipping a green mutation test **that mutated nothing** —
the worst possible kind of green, and exactly the failure this repo has a law about.
It now turns the ease off *in the probe's own mirror of the draw rule* and says so
plainly: it proves the measurement would catch an un-eased build; it does not claim
to have rebound the page.

## THE LESSON, AND IT IS THE ONE THIS REPO KEEPS RE-LEARNING

**A NEGATIVE RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU HAVE SHOWN THE
INSTRUMENT COULD HAVE SEEN A POSITIVE ONE.** "I checked and it is not there" needed
a positive control and did not have one. The cost was not just a wrong line in a
law file — it was a lane being told to **build a feature that already existed**,
while the real defect (it pops) sat unfixed for a day with a ruling on it.

The correction is written into
`laws/BOHEMIA_ADDENDUM_THE_PLAYTEST_DISPATCH_8_25_26.md` itself, next to the
sentence that was wrong, because a law file that still says the opposite is a
contradiction between two live files, and the truth hierarchy calls that a bug.
