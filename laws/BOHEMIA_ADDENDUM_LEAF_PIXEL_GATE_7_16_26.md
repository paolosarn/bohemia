# BOHEMIA — LEAF-PIXEL GATE (7/16/26)

## The law said the gate existed. It didn't.
ANIMATION-PIXEL LAW (7/13): *"Every animation must pinpoint exactly which pixels
it touches. Moving parts (the LEAF) animate; structure (jambs, posts, headers,
frames, borders) stays frozen."*

Nothing had ever checked a shipped clip. **95 clips across 6 banks**, cooked and
approved, never verified by anything but eyes on a proof page.

## THE RESULT: the law holds. 95/95, zero violations.
Structure frozen everywhere. Every clip moves. Leaf coverage across the 95:
**min 1.6%, median 40.8%, max 93.7%.** The record is now a fact per clip in
`BOHEMIA_LEAF_RECORD_7_16_26.csv` instead of an intention.

Two clips have a dead frame (loop stalls). Not a law break, listed anyway.

## Getting there took two corrections and both are the interesting part

**First cut said 34 of 95 clips were broken.** It tested "the outermost ring is
identical across frames." That is not the law, it is a caricature of it. The
banks proved it immediately:

```
fire_24/25/26   top moves, everything else frozen   flame licking the top edge
fire_23         BOTTOM moves, top frozen            fire rises — a barrel whose
                                                    BASE moves is the vessel crawling
```

The law names its own structure: *jambs, posts, headers, frames*. Which edge is
structure depends on what the thing **is**. A door's jambs are left and right,
its header is the top, and its bottom is a threshold the leaf sweeps. A fire
barrel's structure is the vessel at the bottom; the top is flame. A particle fx
is free-standing and has no structure to violate.
*[The per-edge mapping is my inference from the law text plus physics. Flagged.]*

That took 34 down to 3.

**Then the last 3 turned out not to be violations either.** Before saying a word
I checked what was actually changing:

```
fire_23  bottom   alpha(geometry) changes = 0    rgb-only changes = 20
fire_32  left     alpha(geometry) changes = 0    rgb-only changes = 14
fire_40  left     alpha(geometry) changes = 0    rgb-only changes = 21
```

**Zero alpha changes. Nothing moved.** The shape is frozen; only its colour
breathed. That is baked flicker glow on the vessel, not structure crawling.

So the gate now splits it, and this distinction is the whole gate:
- **alpha changed** → a pixel appeared or vanished, the shape MOVED → law break
- **rgb changed, alpha identical** → shape frozen, colour breathed → different
  law entirely, so it is FLAGGED, not failed

A blunt `!=` test would have condemned 34 clips for a crime none of them
committed, and I would have handed you 34 "violations" to look at.

## What the 3 are, flagged for you [PENDING]
`fire_23`, `fire_32`, `fire_40` bake flicker glow into the barrel's own pixels.
LIGHT PHILOSOPHY says the whole-frame multiply pass owns the glow and nothing
carries a per-sprite tint. These cells also get an emitter from the light
registry, so the vessel is lit twice: once in the art, once by the engine.

Whether that reads as wrong or just reads as a barrel lit by its own fire is
your eye, not mine. Three clips, and the gate will keep pointing at them.

## The gate
`bohemia_leaf_gate.py` — every bank, one command. Checks frozen structure per
edge by object kind, leaf bbox, something-actually-moves, dead frames, and frame
size agreement. **It does not check whether the leaf is the RIGHT region.** That
is your eye. Auto-correcting a leaf rect would be redrawing your art.

## Gates
leaf 95-95 · sync 11 modules · graveyard 0 live · graphics 83-0 · sidewalk 17-17 ·
line 18-18 · tan 12-12 · scale 12-12 · lightreg 25-25 · purity swept
