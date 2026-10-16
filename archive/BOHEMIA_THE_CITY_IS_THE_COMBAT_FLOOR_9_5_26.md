# THE CITY IS THE COMBAT FLOOR — and the leg that did not catch its own mutation
(9/5/26, LIFE + CITY lane. VAMILY job `[combat floor] THE-AERIAL-VIEW-IS-THE-COMBAT-FLOOR`.)

## HIS RULING IS THE SPEC, AND IT ANSWERS THE "HOW" ITSELF

`laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md`, 3b,
LOCKED:

> *"the size of the 'ground' changes but the player is the same size just what they
> 'walk' on is a more zoomed out city so it really feels like war is spilling in the
> streets type shit when its a combat shit."*

and, in the same clause:

> **"REUSE-FIRST, and it is already built ... The combat floor is that render, centred
> on the block you are standing on, NOT A NEW BOARD. ONE SEED, same coordinates, so
> the fight happens on the actual streets you walked to."**

So the job had exactly one correct shape, and the law wrote it: **do not draw a
city.**

## WHAT SHIPPED

`engine/bohemia_combatfloor.js` owns the **contract**; the walked surface registers
**its own `renderCity`** as the painter. `paint()` points that renderer at a block,
copies the frame out, and puts the camera back.

- **A second renderer was never an option.** It would be byte-different from the
  streets he walked to get there, which is precisely what "ONE SEED, same
  coordinates" forbids — and it is the two-systems bug this lane has now written five
  post-mortems about in one round.
- **Swapping the live canvas is safe, and it is worth knowing why.** A canvas is
  presented at the *end* of a task, never mid-task. Everything between save and
  restore is synchronous — point, render, copy, restore, re-render — so the browser
  has no opportunity to show the intermediate frame. The restore is in a `finally`.
- **`plan()` is pure arithmetic and needs no pixels.** COMBAT can ask where the
  street is without drawing a frame; a lane that must render to find out will render
  every time it asks.

## THE RULING HELD AS A RULE, NOT A SETTING

"The player is the same size" only reads as war on a map if the ground is genuinely
smaller than the person. So a tile at or above the 112px sprite is **refused by
name** — `FLOOR_BIGGER_THAN_THE_FIGURE` — because a floor that zooms *in* is not this
ruling with a different number, it is the opposite of it.

And the picture is stated as a **number** rather than an adjective: at the city's own
18px tile, a figure stands **6.22 blocks wide**. His numbers throughout — the 56 rig
drawing at 112, and `TW0/TH0 = 18/9`, the scale the pad already moves across.

## A NUMBER IS NOT HONEST UNTIL ITS UNIT IS

A cell on this floor is an **overmap cell** — a district, about ninety-six metres —
not a house. Measured: **2,524 of 2,601 cells** on a suburb floor come back solid.
That is *correct* for blocks and *nonsense* for houses, so every answer carries
`scope:'block'`, and the 9/4 law's other clause ("a combat tile is a house") is noted
as governing the house-scale board, not this one. COMBAT should know that before it
builds a cover model on top.

## THE LEG THAT DID NOT CATCH ITS OWN MUTATION

B3 asserts the camera comes back exactly. I deleted the restore — and the gate stayed
**13/0**.

The leg had captured the camera *as it happened to sit*: at boot it was already on
the walked cell at the default tile, and the floor was painted centred on that same
cell at that same tile. **Deleting the restore changed nothing to compare.**

> Accidental correctness again, one round after writing it down. The leg now parks the
> camera somewhere distinctive first *and asserts that the park really was somewhere
> the floor had to move away from* — or it is grading a claim against itself.

With that, the mutation goes red instantly:
`parked at {x:7,y:11,TW:26} … found at {x:48,y:48,TW:18}`.

## THE GATE

`gates/combat_floor_gate.js`, **13 pass / 0 fail**, walked surface and cut demo.

| mutation | legs that went red |
|---|---|
| drop the scale rule | A2 |
| leave the camera where the fight put it | B3 *(only after hardening)* |
| paint a flat fill instead of the city | B2 (1 colour) |

## WHAT IS NOT HERE, ON PURPOSE

No fight, no board state, no cover model, no sprite. **NO DAMAGE BEFORE THE DIAL**,
and the fight is COMBAT's lane. This hands them a floor, tells them what is standing
on each block of it, and refuses to decide anything about the fight.

**Measured and left for them:** the city render bakes its own map labels (`CUSTOM`,
`COLORFUL`) into the frame, because the floor *is* that render, exactly as the law
says. If COMBAT wants a floor without labels, that is a change to the city renderer
and a conversation with this lane — not something to strip silently on the way past.

## AND A RED IN THIS LANE'S OWN GATE, FIXED THE SAME ROUND

`city_tab_gate` went **63/1** on `POWER rebuilds with every world rebuild (3 hooks)` —
and the lights rebuild in all three places. The leg was matching **one exact call
spelling**, `/POWER=BOH_POWERGRID\.powerMap\(om,seed\)/`, and somebody had folded that
call into a `buildPower(om,seed)` helper. Correct, tidier, behaviour unchanged, gate
red. **A broken ruler, not broken code** — and this lane's own ruler
(`city_tab_gate` is LIFE+CITY-SURFACE's), so mine to fix.

FIX THE RULER, NEVER THE TARGET. The invariant is stated directly now: **every world
rebuild is followed by a power rebuild before the next world rebuild**, in any
spelling. The first attempt at that used a fixed 160-character window and was *also*
wrong — the boot build sits sixty lines above its `let POWER=…` because `CBinstall`
has to be defined in between, so it called a legitimate pairing an orphan. **The
invariant was never about proximity.** Re-checked by deleting one power rebuild:
`3 world rebuilds, 2 power rebuilds, 1 world rebuild with no lights` — still red where
it should be.

## THE STANDING NOTE

**A TEST THAT PASSES BECAUSE THE WORLD HAPPENED TO ALREADY BE IN THE RIGHT STATE IS
NOT A TEST.** Set the state you are claiming to restore, and prove you set it to
something that had to change. The mutation is the only thing that tells you which
kind of green you have.
