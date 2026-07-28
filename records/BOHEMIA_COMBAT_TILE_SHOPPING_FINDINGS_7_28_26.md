# BOHEMIA — COMBAT LANE: WHAT THE SHOPPING CHECK FOUND (7/28/26)

Filed alongside the eight COMBAT tile forms (TF-CMB-001 through TF-CMB-008).
This file is the other half of the answer: **the things the COMBAT lane draws in
code today that it must NOT ask anyone to draw, because Paolo already approved
them and nobody wired them.**

The tile-form law says a form's WHY section must name what was checked and why
each near-miss does not cover the need. Doing that honestly across the whole
combat surface turned up four cases where the near-miss was not a near-miss at
all: it was a direct hit sitting in a bank with zero consumers.

**These are NOT tile requests. Filing a form for any of them would be a
REUSE-FIRST violation. They are WIRING debt and they belong to this lane.**

---

## 1. THE FIGHT FLOOR. Already approved, md5-locked, and ignored.

**WHAT THE CODE DOES:** `drawField` paints the entire combat ground itself. Per
cell it computes a hash (`Math.imul(wx,73856093)^Math.imul(wy,19349663)`), takes
a +/-3 tone jitter off it, and fills `rgb(g+16,g+9,g+1)` with a 1px
`rgba(18,14,10,0.6)` grid on top. Every fight in the game happens on a
procedural grey fill.

**WHAT ALREADY EXISTS:** `banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt`, the
42-tile frozen CBB starter set, `cell_px` 44, md5-locked, and the approved index
lists it as **RUN: INTEGRATED**. It contains, by name:

- `road_0`, `road_1`, `road_2` — "cracked asphalt, the plain lane surface"
- `road_centre` — "asphalt carrying the faded white centre line"
- `road_gutter` — "the asphalt right against the kerb, in the kerb shadow"
- `road_crossing` — "asphalt with the painted crossing bars on it"
- `concrete_0`, `concrete_1` — "a poured concrete path or driveway slab"
- `dirt` — "the graded dirt every lot sits on"
- `yard_0`, `yard_1`, `yard_2` — "the dead gravel yard surface"
- `walk_0/1/2`, `walk_kerb` — sidewalk and its kerb lip

That is three asphalt variants, two concrete, gravel, dirt, sidewalk and a kerb.
It is frozen canon, and combat has never drawn a single pixel of it.

**VERDICT: no form. WIRE IT.** COMBAT consumes the starter tileset, same as RUN.

**CORRECTION, made the same turn after reading the WORLD lane's forms:** my
first draft of this said the starter set covers "a fight on a Las Vegas lot".
That was too broad and TF-WORLD-001 is right to exist. The starter 42 is **one
residential street**, and its `road_*` tiles are a LANE surface with the wear
pattern of a lane (two wheel-polish tracks, a centre crown). A parking LOT is
flat, cracked all over and patched, which is a different material.

What saves the claim is that **the combat field is authored as a STREET, not a
lot**: `drawField` draws a double-yellow median at world x=2.5 and lane dashes
at x=-1.5 and x=6.5. So for the arena that exists today, the starter street
tiles are the correct and already-approved answer and should be wired now. The
moment an arena is authored as a LOT, row 30 / TF-WORLD-001 is the right form
and COMBAT is not re-filing it.

Recording the correction rather than quietly narrowing the sentence, because
the whole value of a shopping check is that the next lane can trust it.

---

## 2. THE ROAD MARKINGS. 84 approved items. "I like all of them." Zero surface.

**WHAT THE CODE DOES:** `drawField` hand-draws a double-yellow median as two
`rgba(184,160,40,0.55)` rectangles at world x=2.5, and white lane dashes as
`rgba(215,205,185,0.38)` rectangles at world x=-1.5 and x=6.5. Hardcoded
positions, hardcoded colours, drawn every frame.

Worth recording: **those hand-drawn markings were themselves a shipped bug.**
The median stripe drew AFTER the floor's vignette, so the one pass meant to dim
the scene ran before the brightest object in it, and Paolo spent three turns
reporting a persistent orange he could not get rid of. It was the road. Painting
canon by hand is how that happens.

**WHAT ALREADY EXISTS,** and it is worse than "some markings exist somewhere":

`banks/BOHEMIA_MARKING_BANK_7_17_26.txt` — **84 items across 14 classes**,
verdict source MARKING_VERDICTS 7/17, Paolo's recorded comment on the batch is
**"I like all of them."** Approved index consumer column: **"factories ONLY, no
live surface, now routed."**

And `banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt` (opened after the RUN
lane's C3 note said to stop trusting bank names) carries the exact objects
`drawField` is hand-painting:

- `pools.median` x3, plus `weather_variants.median` x6
- `pools.lane_div` x2, plus `weather_variants.lane_div` x4
- `pools.cross` x3, plus 6 weathered
- `pools.stall_line_v` x18 and `stall_line_h` x18, plus 36 weathered each
- `pools.twlt_*` (two-way left turn) and `pocket_line_*`, 6 each plus weathered

**And it carries two of Paolo's own laws about them:**

> `markings_30yr_law`: wash_strength 0.55 plus a second 0.40 pass.
> Source, Paolo 7/14: *"whites and yellows of all medians/crosswalks/lanes/
> parking should be more washed out"* — act 1 locks the base.

> `weather_rarity_law`: parents 88%, weathered 12%.
> Source, Paolo 7/14: *"why did a bunch of the tiles change color"*.

> `parking_geometry_law`: stall lines every 3rd tile, SHARED dividers, interior
> 2 tiles, row depth 4, aisle 4. Source: Paolo 7/14, proof PK0/PK1 blessed.

**So: the median exists as approved art, AND Paolo ruled two years of sun onto
it, AND combat draws its own at `rgba(184,160,40,0.55)` full brightness with no
wash at all.** The orange he chased for three turns was a hand-painted object
that ignored a law written specifically to stop that object being bright.

**VERDICT: no form. WIRE IT.** And when it is wired, the median stops being a
hand-painted rectangle that can out-shine a corpse.

---

## 3. THE BLOOD. An approved bank whose stated job is literally this.

**WHAT THE CODE DOES:** `drawBloodPool` draws two nested ellipses,
`rgba(96,8,8,0.42)` over `rgba(70,5,5,0.5)`, growing with a scalar.
`drawWounds` and `drawCorpseHoles` paint 1 to 3 pixel red squares.

**WHAT ALREADY EXISTS:** `banks/BOHEMIA_GORE_OVERLAY_BANK_7_10_26.txt`, whose
own header note reads, word for word:

> "combat floor-painting layer: blood/gore overlays, transparent,
> draw-after-ground. RED IS LEGAL HERE"

24 overlays, **20 thumbed UP**, sourced from the Great Sweep blood packs. Plus 7
approved `gore` props in the demo prop pool. The approved index's consumer
column: **"none — story-placed by Paolo, hold."**

A bank that describes itself as the combat floor-painting layer has never
touched the combat floor.

**VERDICT: no form. WIRE IT** — with one honest caveat, which is the reason this
one is not simply switched on: the index says these are held for Paolo to place
by story. Auto-splattering approved gore under every corpse is a CONTENTS
decision, and contents are his. So this is wiring **[PENDING Paolo]**: the
mechanism is mine, the ruling on whether combat may auto-place them is his.

---

## 4. THE SMOKE AND THE SPARKS. Approved loops, zero consumers.

**WHAT THE CODE DOES:** `fxShot` pushes three grey circles as `smoke` particles
and fades them out.

**WHAT ALREADY EXISTS:** `banks/BOHEMIA_PARTICLE_LOOP_BANK_7_14_26.txt`:
`o_fx_smoke_puff_01` (8 frames), `o_fx_smoke_small_04` (8),
`o_fx_spark_burst_06` (6), `o_fx_ember_trail_05` (8),
`o_fx_flame_burst_00` (6). The approved index flags the whole fire/particle row
as **"ZERO consumers — now routed to the mobile-base camp."** The camp took the
fire clips. Nobody took the smoke or the sparks, and combat is where smoke and
sparks belong.

**VERDICT: no form for smoke or sparks. WIRE THEM.** TF-CMB-007 (muzzle flash)
names them as shipping in the same delivery, because the flash is genuinely
missing and the smoke around it genuinely is not.

---

## 5. TWO NEAR-MISSES THAT ARE HONESTLY NEAR-MISSES

Recorded so nobody re-litigates them:

- **`roof_deck`** ("a flat gravel roof deck") is the closest approved thing to
  the upper deck's top plate, and it is wrong for one specific reason: a parking
  deck is a DRIVING surface, poured concrete with tyre polish and control
  joints, not loose roofing ballast. Gravel also reads as ground, which is the
  exact failure the current near-black deck face is compensating for. Covered in
  TF-CMB-004's shopping check.
- **`roof_parapet`** ("the parapet wall around a flat roof, lit along its
  coping") may simply BE the deck guard. TF-CMB-006 says so out loud and tells
  the art lane to try it first and cook nothing if it works.

---

## 6. THE STALL STRIPES ARE NOT UNJUDGED. THEY ARE APPROVED AND RULED.

First pass of this file said `banks/BOHEMIA_STALL_STRIPE_CANDIDATES_7_14_26.txt`
(`stall_line_v` x6, `stall_line_h` x6, status "UNJUDGED, pools only on Paolo UP")
was a free win blocked on a thumb. **Wrong, and corrected the same turn after
the RUN lane's collision note C3 pointed at the bank I had not opened.**

The CANDIDATES file is the pre-verdict pool. The HARMONIZED bank is the
survivor, and it holds **`stall_line_v` x18 and `stall_line_h` x18 plus 36
weathered variants each**, already cut as weathered asphalt with the white line
on it, plus `parking_geometry_law` = stall lines every 3rd tile, shared
dividers, interior 2 tiles, row depth 4, aisle 4, sourced to **Paolo 7/14, proof
PK0/PK1 blessed**.

So the deck slab and every lot can have correct, approved, geometry-ruled stall
lines today. Nothing is blocked on a thumb. It is a wiring job.

**Their standing lesson applies to this file as much as theirs: the index's
per-bank rows do not enumerate every pool inside a bank. Open the bank.**

---

## 7. THE OTHER LANES FILED THE SAME DAY. WHAT COLLIDED.

Four lanes ran this order concurrently. Recorded here and on the board
(collision notes C4 to C7) so nothing gets cooked twice:

- **CMU (C4).** TF-ART-001 is a building FACE with courses and a bond beam.
  TF-CMB-002 needs a freestanding 1-tile STUB with two authored ends and a
  sky-lit top, which a building face never has. Same material, different object.
  Cook the material once, cut both from it.
- **PARAPET (C5).** TF-WORLD-007 includes a parapet cap for commercial flat
  roofs; TF-CMB-006 needs a parking-deck edge guard and already says
  `roof_parapet` may simply be the answer. One parapet, two consumers.
- **VEHICLES (C6).** TF-WORLD-011 covers heavy hulls and EXCLUDES the passenger
  car by its own scope note, "the CAR itself is canon and already sized".
  Sized is not drawn: the `_vehicle` helper is a size constant, not pixels.
  TF-CMB-003 is those pixels. The two forms are complementary, not duplicates.
- **STAIRS (C7).** Board row 1 (interior, coordinator) and TF-CMB-005 (exterior
  open-air deck run) are two halves of one problem. TF-CMB-005 carries the only
  verbal Paolo rejection on the whole board and the measured structural failure,
  so its acceptance tests are the stricter set and should govern both.

Also worth noting because it is the same class of mistake in the other
direction: the RUN lane's collision note C3 caught the ART lane's striping form
missing 18+18 approved stall-line tiles inside STREET_POOLS_HARMONIZED, with
Paolo's own blessed parking geometry attached. **That supersedes the note below
about STALL_STRIPE_CANDIDATES being unjudged: the stall lines are not just
cooked, they are approved and geometry-ruled, and they need wiring, not a
thumb.** Their standing lesson is the right one and it applies to this file too:
the index's per-bank rows do not enumerate every pool inside a bank. Open the
bank.

---

## WHAT THIS ADDS UP TO

Eight forms filed. **Four things NOT filed because the pixels already exist and
were approved months ago.** The combat surface has been hand-painting canon that
was sitting in a bank the whole time, and the orange Paolo hated for three turns
was one of those hand-painted objects.

That is the shopping law doing exactly what it was written to do.
