# V225 — THE FRAME MOVES THE GROUND, NOT THE PERSON (COMBAT lane, `[fight looks]`)

**The coordinator's note on my row, 9/23b, on V224:**

> *"THE GLASS IS HONEST NOW, 112 CSS, and the row does not close yet: rule 21 says the
> frame moves the ground and never his size, and your own record says the auto frame
> still scales the person to 71 CSS at a wide frame. `[fight looks]` closes when he is
> 112 at EVERY frame width; that half stays here, not in `[fight feel]`."*

---

## WHAT WAS WRONG

V224 made the fight's canvas honest, so the ruled 112 box is 112 CSS pixels. But the
fight has a camera the walked street does not — **the auto frame**, which widens to hold
every living enemy — and it widened by scaling the whole world, ground and people
together:

```
  frame 1.105  ->  the fighter is 62 CSS
  frame 0.636  ->  the fighter is 71 CSS
  frame 0.372  ->  the fighter is 42 CSS
```

One ruled body, three sizes, chosen by how far away the furthest man happened to be.

## WHAT SHIPPED

**One number becomes two, because it was always doing two jobs:**

- **`bodyRule()` — the ruled size.** How big a person *is*, which is what a house lot is
  1.75 of. Exactly what `bodyScale` returned before, so the two rulers that read it
  (`tileWideMult`, `contentR`) are byte-identical.
- **`bodyScale()` — the drawn size.** What the sprite is blitted at. It divides by the
  live frame, because the body is drawn **inside** the camera's own transform: dividing
  by the zoom and then being multiplied by it lands him on the ruled pixels at every
  frame width, **by construction rather than by tuning**.

Everything else that reads `bodyScale` is a body offset against the sprite (head 84,
soles 28, mass marker 42, the pool, the aim ring), drawn in the same transform, so they
follow the drawn size and stay where they were put.

**And the frame has to know he is big.** The auto frame solves for the *ground* — fit the
furthest man inside the glass, less a thumb margin — which was safe while bodies shrank
with everything else. A body that never shrinks is a constant 112 px tall however wide
the shot, so the margin must hold a whole person or the furthest man is half off the
screen at exactly the moment the camera widened to take him in. Derived, not picked: his
own half-height.

---

## THE MEASUREMENT, AND THE SECOND RUN IS THE STRONGER ONE

```
  asked 1.30   frame when drawn 1.199  ->  111.5 CSS
  asked 1.00   frame when drawn 0.929  ->  112.4 CSS
  asked 0.80   frame when drawn 0.749  ->  112.4 CSS
  asked 0.60   frame when drawn 0.569  ->  112.1 CSS
  asked 0.40   frame when drawn 0.389  ->  112.1 CSS
  asked 0.20   frame when drawn 0.209  ->  112.1 CSS
```

**The frame genuinely drifted between the request and the draw** — 1.30 became 1.199,
1.00 became 0.929 — **and the body still landed at 112.** That is the proof: the person
is decoupled from the camera, not merely consistent with a camera that sat still.

### My first sweep was wrong twice, in opposite directions

It set `G._uzE = z` and computed `112*bodyScale()*z`. The render loop smooths `_uzE` back
toward its own target every frame, so by the time `bodyScale()` was read the zoom was no
longer `z`: **one run said 112 six times and the next said 176 down to 92, from the same
tree.** Computing it self-consistently (multiplying by `uzEff()`) would be worse — it is
112 by algebra and measures nothing. So the probe wraps the board's `drawImage`, catches
the blit whose source is the 112 body canvas, and multiplies its destination by the
**live transform** at that instant.

---

## AND `[hidden frame]` RESTS ON A PREMISE THAT IS NOT TRUE — MY OWN

The row reads *"the alpha pre-creates a fight frame for its COMBAT tab… every softer
test picks it; five frame finders failed on it."* **I wrote that, and it is wrong.**

Measured this round, on **both** surfaces, counting every frame that answers as a fight:

```
  FRAMES THAT ANSWER AS A FIGHT: 1
  {"cv":"390x683","box":390,"url":"about:srcdoc","phase":"cover","e":1}
```

**Exactly one.** The alpha creates `#combatFrame` once and hands the same element back
forever. There was never a second frame to tell apart. Every bad reading — `k=300`, a
`300x150` canvas, `0.4 CSS` — is that **one** frame read *before the panel gave it a
box*, when its canvas still sat at the HTML default.

**V224's zero-box guard is what closed it**: `size()` now retries until the board has a
box instead of locking at `0x0` or `1x1` for ever, so the frame heals itself and a
patient reader finds it sized. Rule 12 says a dependency on a line is a premise and to
measure whether the named blocker is real. It is not. **The row wants retiring, not a
sixth finder**, and it exists because of a claim of mine — which is why this is at the
top of the record and not a footnote.

---

## PROOF

**Sound:** the one driver, twice, on the cut, on the phone profile, measuring off the
blit through the live transform — the numbers above — plus the photographs.

**Still not trustworthy, said again:** `the_person_is_112_gate` reaches a properly sized
board only sometimes; when it does not, its arms read `k=300` and `0.4 CSS`. Its new
legs are right (the ruled size, the sweep, and an arm that reports what the wait saw so
a timeout cannot masquerade as a claim about the fighter), and where it reaches a real
board the sweep is green: `1.3->112  1->112  0.6->112  0.2->112`. **The fix has not
changed for two rounds: rule 14(g), put it on the one driver.** A job, not a patch.

## AND TWO OF THIS LANE'S OWN GATES WERE MEASURING THE WRONG THING

**`combat_scale_gate` failed V225 for going right.** Its rule 21 leg read
`112*bodyScale()`, and V225 is precisely the change that made `bodyScale()` the *drawn*
size — which divides by the live frame on purpose. So at a frame of 0.20 the leg computed
**560 px** and called it a giant. Repointed to `bodyRule()`, the ruled size, with a
fallback so it still runs on a tree that predates V225. **It is not loosened:** it still
asserts a man is 112 px at every zoom, it just stops reading the number through the camera
it is testing. **7/1 → 8/0.** This is the same defect I fixed in the 112 gate's probe an
hour earlier and did not think to look for in its sibling.

**`house_board_gate` has been red on main, and the cause was never the fight.** Baselined
in a worktree at `6ef899d`: same arm, same count, **1 passed 1 failed on main too**. Then
measured rather than guessed — at the moment it sends a finger at a hostile, the element
under that point is:

```
  DIV#loadgl  <  DIV#loadwrap  <  DIV#front.load.ready  <  BODY
```

**The loading screen, still on top**, over a city frame that is alive and answering every
question underneath it. Its door was two blind clicks at (215,450) written before rule 18's
loading screen existed; the splash's PLAY sits at the bottom and refuses until the load is
ready, so a finger in the middle at nine seconds hits `#loadgl` and nothing happens, for
ever. **The one driver already carries this scar in writing** — its trap 6 names a gate
that printed *"NOTHING REACHABLE … DIV#loadgl"* for exactly this reason. Door procedure
copied from it, and the gate now refuses to report anything if the door did not open. **It
opens in about 8 seconds.**

Behind that door, a second stale step: the gate stood **five cells** off the crew, which is
off the glass since rule 16 moved the street's zoom. It walks in now, nearest first.

**It is still red, 2 passed 1 failed, and the red finally carries its numbers:**

```
  AT 1..5 CELLS  boxes 1  claimed 3  under "nothing"  pt [0,0]
                 view [430,890]  rect [0,0,0,0]  board [418,861,"cv"]  hit0 [159,319,112,112]
```

A 112x112 body, drawn, claimed by the street's own tap test — mapped through a canvas with
**418x861 of backing and a bounding box of 0x0**. A board with pixels and no layout box:
**the same defect class as the fight-frame saga above**, on the other surface. Two of my
gates, one cause. The fleet's answer is not a sixth finder, it is rule 14(g): put these
gates **on the driver** instead of each carrying a copy of its door. That is the instrument
job on my row and it is now the third round it has been named — and writing a fourth patch
at the end of a round is the tell, so I stopped.

## RULE 22

Registered in the VOTE tab as `combat-the-same-man-every-frame-9-24`: three frames off
the real glass — the fighter at 37 px on 9/20, the fighter now, and the man he walks
around as — asking the only question I need, which is whether he is too big, too small,
or whether it is the ground I should be looking at.

## STILL OPEN

1. The way out is placed at 3.5 to 6.4 lots off `sightTiles`, so it can sit off the
   glass. Belongs to `[fight feel]`.
2. The gutter shadow, the half-transparent roof corners, the light not carrying, the
   roof reading as a floor — carried, unchanged.
3. `[one mode]` (rule 24) is first on the lane and OPEN: the fight must stop being a
   second document at all.

---

**Tool:** `tools/bohemia_the_frame_moves_the_ground_patch.py` · **Stamp:** 9/24h ·
**Tab:** COMBAT, and any fight you walk into from CITY; the picture is in VOTE.
