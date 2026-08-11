# ADDENDUM: BONES ARE HUMAN-SIZED, AND YOU PROVE IT WITH A PERSON (Paolo 8/11/26, LOCKED)

## HIS WORDS

> "i would chalenge you to make sure any bones or skulls are always the same
> size as our humasn please so idk if you want to put a character next to it fo
> reference but any thing thats human decay pleasemake the art with a person
> next to it so u get the real scale and size please."

> "maybe we should have more open pits where a bunch of the shit shit lives as
> well. i know we have grids and shit but part of the procedureal generation
> especially if its dirt/sand is that we can proceduraly generate elements on
> the dirt/sand and this may be part of it."

> "the mob used to bury a bunch of dead bodies all over vegas so maybe we can
> have a quest on that or something maybe"

## 1. THE SCALE LAW (BUILT 8/11)

**Every piece of human decay is drawn the size that thing actually is, measured
against the human.** Not one scale for a bank. Per tile.

He caught this by eye, off a picture, and the measurement backed him completely.
`engine/bohemia_dead.js` carried a single draw height (`TILES.scale.skeleton =
1.5` cells) applied to all 62 judged tiles, so **everything came out 1.75 m
long whatever it depicted.** Measured against the real baked body (1.74 m) it
was wrong in *both* directions:

| what it depicts | was drawn | actually is |
|---|---|---|
| single skull (#44-48) | 0.92 - 1.31 m | **0.20 m** |
| jawbone (#53) | 1.43 m | **0.22 m** |
| femur (#49, #56) | 1.17 m | **0.45 m** |
| ribcage (#51) | 1.13 m | **0.40 m** |
| articulated skeleton (#34-40) | 0.52 - 1.17 m | **1.70 m** |

A skull and a whole body were **the same length**. That is the tell, and it is
now a gate assertion in its own right: a body must be at least 4x a skull.

**THE SIZES ARE FACT, NOT TASTE.** An adult skull is ~20 cm, a femur ~45 cm, a
laid-out adult ~1.7 m. That is why a machine may hold them at all — this is
MECHANISM (measurable), never CONTENTS. Nothing in the table judges his art; it
only states how big the depicted thing is in the world.

**ONE RULER.** `BohemiaDead.tileMetres(idx)` is the single source. The renderer
(outdoors *and* indoors), the reference sheet and the gate all ask it. Two
rulers for one measurement is how 51 imaginary scatter violations got invented
on 8/9.

## 2. THE PROOF LAW (BUILT 8/11)

**Anything that is human decay ships with a picture of a person next to it, at
true scale.** `tools/bohemia_bone_scale_sheet.js` -> `slices/look/bone-scale.png`:
all 62 judged tiles, each beside the real baked body, over a one-metre rule.

### The bug this uncovered, which is bigger than the scale bug

**The player was a BLANK WHITE RECTANGLE in every LOOK picture ever shipped.**

`PLAYER_CV` reaches the world page by `postMessage` from the alpha's character
bake (`citySendPlayer`). The shot tool opened `BOHEMIA_CITY_WORLD.html`
*directly*, so the message never came, so `PLAYER_CV` stayed null forever and
the man rendered as a featureless box. **He has been judging scale against a
rectangle** — his "put a character next to it" was him working around a bug he
could see and I could not.

Fixed: the tool now drives **the alpha**, taps the splash, taps RUN, waits for
the real body, and refuses to shoot without it. VERIFY ON THE REAL SURFACE
taken literally — the surface is the thing he taps, not the file it loads.

(It also now refuses a **0x0 city frame**. Clicking RUN behind the front splash
loads the frame at zero size: every check passes, `evaluate()` answers, the
player reports present, and the picture comes back solid black at 7 KB. Silence
is not success.)

## 3. THE PITS AND THE MOB — RULED, NOT YET BUILT

Recorded here so neither is lost, and stated plainly as **NOT DONE**:

- **OPEN PITS ON DIRT/SAND, PROCEDURALLY.** His point is that dirt and sand are
  a *generative surface*, not just a floor: pits, disturbed ground and dumped
  remains should be generated onto them the way other elements are. The
  cemetery pit (34 bodies, one heap) exists and is the proof of concept; what
  he asked for is that pattern spread across dirt/sand ground generally.
  **STATUS: not built. Next item in this lane.**

- **THE MOB BURIED BODIES ALL OVER VEGAS.** Historically true and exactly the
  kind of grounding this game runs on. He floated it as a quest.
  **STATUS: not built, and not this lane's to build.** A canon `.bq` quest must
  cite the corpus (QUEST STUDY LAW: `@STUDY` ids that resolve, verbatim titles,
  >=2 studies across >=2 masters) and quests belong to the quest lane under ONE
  SYSTEM / ONE SESSION. Handed over, with the ground truth already in place:
  the world can already put remains in the dirt, so the quest has a floor to
  stand on. **No faction is named anywhere in the dead system** — who was
  turning people into soil, and who buried what, stays his to rule
  (MECHANISM-MINE / CONTENTS-PAOLO'S).

## THE GATE (same turn)

`gates/bone_scale_gate.js`, registered in the suite **before** THE DEAD. 17/0.
Holds: the declared human is the measured 1.74 m; the per-tile table is
populated; **nothing out-measures the human**; skulls land in 0.15-0.30 m;
articulated skeletons in 1.5-1.74 m; a body is >=4x a skull; the fallback is
safe in both directions; the shipped page sizes off `tileMetres()`; no draw site
still multiplies a cell by the old blanket scale; the indoor pass uses the same
function; and the reference picture actually exists and is a real render.

`dead_gate.js` also had to be repaired, not the code it tested: its aspect check
matched the literal string `naturalWidth / im.naturalHeight`, so it went red on
a rewrite that obeys the law in different words. **Ask for the property, never
the spelling** — it now checks that both natural dimensions are read and that
nothing is drawn into a forced square. Fix the ruler, never the target (8/1).
