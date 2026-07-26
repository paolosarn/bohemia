# BOHEMIA — THE REASSEMBLY TEST (ART lane, 7/26/26)
# amendment C of the art-first reset, run for the first time

## THE RULE

> **THE ANTI-BIOSHOCK RULE:** the painted mockup is not the constitution — the
> target phase's acceptance test is CUT the picked mockup into the real starter
> tileset and REASSEMBLE the identical frame from those tiles on the real render
> path. The tile-reassembled frame is the framed target. **If reassembly looks
> worse, the mockup lied; fix before locking.**

## THE VERDICT: THE MOCKUP LIED

Measured before anything was built, by cutting the shipped target plate on the
contract's own 38px grid:

| variant | cells | UNIQUE tiles |
|---|---|---|
| the shipped plate | 264 | **262** |
| dirt pass + vignette off | 264 | 256 |
| …and cast shadows off | 264 | 240 |

262 unique tiles for 264 cells. **The painting was using a different one-off tile
for almost every square on screen.** That is not a world — a world built that way
needs a unique tile per cell of the entire valley. Every cell had drawn its own
random pool pick, its own random flip, and its own row-by-row gradient.

This is exactly the failure amendment C was written to catch, and it caught it
on the first run. Nobody had to notice it in a screenshot.

## THE FIX: A REAL, BOUNDED, NAMED TILE SET

`banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt` — **38 tiles** for the same 264
cells, plus 11 named sprites and the cast-shadow rects. Every tile is generated
once from approved material and reused; every tile carries a plain-English
description, per NAME IT OR DON'T DRAW IT.

- **ground (16):** asphalt ×3, centre line, sidewalk ×3, kerb, gutter, crossing,
  yard ×3, concrete ×2, dirt
- **walls (10):** stucco ×3, base course, under-eave course, window, boarded,
  left corner, right corner, and the two halves of the 2-tile door
- **garage (2):** the open bay's top and bottom
- **roof (10):** slope, ridge, eave, four hip corners, gravel deck, parapet

## WHAT THE FIRST REASSEMBLY LOST, AND WHY

The first pass looked markedly worse than the painting, and the reasons were
specific and fixable, not vague:

1. **No silhouette.** A row of wall tiles has no ends, so every building ran off
   the edge of the world as one continuous band. → **wall corner tiles** (a lit
   step on the left edge, a shaded step on the right).
2. **The roof was a stripe.** A hip roof is a trapezoid and a trapezoid is not a
   grid of squares. → **four hip-corner tiles** carrying the diagonal, with the
   outside of the cut **transparent**, so the roof reads as a shape sitting on a
   house.
3. **Nothing sat on the ground.** A cast shadow cannot live in a ground tile — it
   would need a unique tile per building per hour of day. → the shadows ship as
   **DATA** and the renderer draws them **at runtime**. This was the single
   biggest loss.
4. **No gaps between buildings.** → the map lays a dirt alley between houses.

After those four, the reassembly holds. Mean absolute difference from the
painting is **34/255**, and essentially all of it is the two poster passes (the
dirt noise and the vignette) which are a full-screen post effect at runtime, not
art.

## PAOLO'S RULING, SAME DAY: THE PAINTED REV 3 IS THE LOOK

> "This was my fav one u were getting closer"  — sent with the rev 3 painting.

So the painting is not just a source to cut up; **its look is the bar.** The
first tile reassembly threw that look away without saying so, because I moved
the light, the dust and the shadow OUT of the art and never put them back
anywhere. That is a regression dressed up as an engineering win, and it is worth
naming plainly: a tileset that loses the look has not passed the test, it has
just passed the tile count.

The fix is the correct one and it is now the standing rule for this world:

**WHAT IS ART, AND WHAT IS LIGHT.**
- **ART (a tile):** the material. Stucco, asphalt, roof tile, concrete, glass.
  Flat, uniform, repeatable, no baked lighting beyond its own texture.
- **LIGHT (runtime, from data):** the Vegas key, the wall falloff from eave to
  base, the cast shadow a mass throws down-right across its own ground, the
  dust, the vignette, the haze that sets the block behind further back.

Every one of those was in the painting and none of them can live in a tile —
baking them would need a different tile per building, per row, per hour. They
now ship as rects and gradients the renderer draws, which is both cheaper and
the only way the look survives being tiled.

Delta from the painting: **34 → 29.6 / 255**, and the wall seams, the missing
falloff and the missing key are gone. What is left is mostly the grain of the
noise field, which is a seed, not a look.

Also fixed in the same pass, because they were reading as "not his painting":
three wall variants put a hard vertical seam on every tile edge (now ONE wall
material, as the painting had), the fascia highlight was a highlighter line (now
a board), and the back row sat in the same light as the hero house (now hazed
back).

## SECOND MARKED-UP SHOT, SAME DAY — FOUR MORE, ALL ONE ROOT CAUSE

> "a light post [should] never be in the driveway where a car enters… why are
> you like not just using the windows and you're like doing zoomed in zoomed out
> pictures of windows… there's an asset I don't remember approving. It looks
> like a volcanic [fire] that you're trying to have as a rock… I'm a little
> confused why the cars look like they're low quality pixel wise."

Three of the four are the same defect wearing different clothes: **I was
resampling his approved art.**

**THE CELL WAS WRONG.** Every tile in every approved bank is **44 px**. The world
was being drawn at **38 px**, so the ENTIRE corpus was being resized every frame
at a 0.86 ratio — and through `LANCZOS`, a *smoothing* filter. That is precisely
"low quality pixel wise": crisp painted pixels blurred into mush. The cell is now
44, an approved tile blits 1:1 and is never touched, and every remaining scale is
`NEAREST`. Cars specifically now draw at a clean integer **2×**, every pixel
doubled, nothing resampled. Gated: the cell must equal the corpus cell, and any
`LANCZOS`/`BICUBIC`/`BILINEAR` on art fails the build.

**THE WINDOWS.** The corpus tile already IS a wall with a window in it. I was
cropping the window out of it, shrinking it by a non-integer ratio, and drawing
my own frame and sill around it — so the same window appeared at three different
sizes on one screen. Now the approved tile is used **whole**, untouched. Gated.

**THE VOLCANIC ROCK.** He never approved it, and it is not one bad sprite: **all
24 members of the desert BOULDER family are glowing lava rock.** Las Vegas sits
in a basin of limestone and sandstone; there is no volcano and there never was.
Banned by LORE, registered by bank and index next to the radiation marks, and the
build dies if one is placed. What is left in the yard is plain grey broken
concrete.

**THE LIGHT POST IN THE DRIVEWAY.** Moved onto the walk, clear of the drive, and
now gated against the driveway rect — nothing may stand where a car drives in.

## THIRD MARKED-UP SHOT — THE DOOR AND THE GARAGE

> "half of the door is like a picture of a door which is crazy to me and then the
> garage that you have instead of it being two or three tiles wide it's one tile
> wide like how the fuck is a car supposed to fit in there"

**THE DOOR WAS A PICTURE, AGAIN.** He caught this once already on the garage and
I fixed that one and left the front door doing the same thing. I was drawing the
FACE of a door leaf standing in the hole — a flat brown rectangle filling half
the opening. A door you can walk through is a **hole**: a reveal with thickness,
dark inside, a floor you can actually see, a lit lintel across the head, and a
concrete step at the threshold. The leaf is still there and it is still the
approved leaf, but you see **its edge**, swung inward, never its face. Gated by
name, including the phrase, so it cannot come back.

**THE GARAGE COULD NOT FIT A CAR.** The bay was one tile wide. A car is two tiles
wide **by his own locked law**, so the bay was geometrically impossible — the
kind of thing that should never survive to a screenshot. The bay is now **three
tiles**, with its own jambs, lined up exactly with the three-tile driveway that
runs into it, and the house narrowed by a tile to make room. Gated: the widest
run of garage tiles must be at least the car's width, measured off the map
itself, so a bay a car cannot enter fails the build.

The same check now measures the front doorway's height off the map and fails if
it is not exactly two tiles.

## WHAT THIS CHANGES

- **The tile-reassembled frame is now THE TARGET**, per amendment C, and the
  judge page leads with it. The painting is shown underneath as the thing it was
  cut from. Paolo's one tap applies to the tiled frame, because that is the one
  the engine can actually draw.
- The render contract's pipeline rule is now proven, not asserted: the frame is
  drawn on a real browser canvas, offscreen at 1×, integer-blitted, smoothing
  off (`slices/BOHEMIA_REASSEMBLY_7_26_26.html`).
- Any future target that cuts into more tiles than `MAX_TILES = 96` fails the
  build.

## WHAT IS STILL HONEST TO SAY

- The reassembly is **close to but not identical to** the painting, and it never
  will be while the painting carries full-screen noise. That is correct: those
  passes belong to the renderer.
- The walls are still one tan material because the approved wall corpus is one
  tan material. That is a **corpus** problem, not a tiling problem, and it is the
  same open note from the previous round.
- The palette is still unindexed (46,082 colours). Section 6 of the render
  contract still says so.

## FILES

- `tools/bohemia_starter_tileset.py` — cuts the set, lays the map, writes the page
- `tools/bohemia_reassembly_shot.js` — drives the real canvas and saves the frame
- `banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt` — 38 tiles, the map, the sprites, the shadows
- `records/target/REASSEMBLED.png` — **the framed target**
- `records/target/TILESET_CONTACT.png` — every tile in the set, labelled
- `gates/target_screen_gate.py` — 1,074 checks, the reassembly test among them


---

# ADDENDUM — THE ACT TRIPTYCH, PROVEN (7/26/26, after the CBB)

Law 3 says every tile family is born with act1-dead / act2-recovering /
act3-rebuilt. Amendment A corrects it: assets are born **era-READY, not
era-complete**, derivation is proven on **2-3 representative families only**,
filler **shares** the treatment, and an approval is never held hostage to three
finished eras. So this is a proof on three families — one per render layer
(`yard_0` ground, `wall_0` wall, `roof_slope` top) — and it stops there.

## THE FINDING: THE DECAY WAS PAINTED IN, SO THE OVERLAY HAD TO BE RECOVERED

Amendment A assumes assets are *structured* with overlay layers so acts derive
cheaply. Bohemia's approved corpus is not: its cracks, dust and weeds are
already pixels, and there is no clean source underneath to reveal. "Derive act
2" therefore cannot mean turning a knob down. It means **undoing paint nobody
authored as a layer** — so the layer had to be found:

1. **Blur the tile hard.** Cracks and grime are small and dark; the blur is what
   the surface looked like before them.
2. **Wherever a pixel is darker than that estimate, the difference IS the
   decay.** That mask is the overlay layer, recovered instead of authored.
3. **Heal by a factor** — act 2 lerps toward clean by 55% of the decay weight,
   act 3 by 90%, plus a lift on the surface value.
4. **Weeds get their own term**, because they are *lighter and greener* than
   what they grow out of, and a darkness mask is blind to them. Without this
   step act 3 stays overgrown.

No per-tile hand work anywhere in the treatment. That is the point: filler
shares it.

## WHAT THE GATE HOLDS

`target_match_gate.py` is now **act-aware**, and the exemptions are declared
rather than assumed:

- act-1 **value bands do not apply** to later acts — a repaired wall *is*
  brighter, that is the whole point of act 2
- **DEAD DARK GLASS is an act-1 rule** (the dead-world reconciliation says so),
  so act 3 may show clean glass
- **nothing else is relaxed**: no keyline, no dither, and radiation and volcanic
  iconography stay banned in every act, because those are lore, not weathering
- each act must be **measurably cleaner than the one before it**, so a copy with
  a new name fails the build

## WHAT IS HONESTLY NOT DONE

**Act 3 reads as act 1 with the dirt turned down, and it will until Paolo rules
on a colour.** A rebuilt building is repainted, and what colour rebuilt Vegas is
painted is *canon*, not something a filter gets to pick. Same for content: act 3
having planters, signage or lit windows is rebuilt-Vegas canon. Both are logged
[PENDING Paolo] rather than guessed. MECHANISM-MINE / CONTENTS-PAOLO'S.


## SELF-AUDIT AGAINST A RULING THAT LANDED MID-TURN

`laws/BOHEMIA_ADDENDUM_SHADOWS_ARE_SEPARATE_7_26_26.md` reached main while this
work was in flight: *"when you make shadows or whatever you're doing, it has to
be separate from the actual clothing. I see you make shadows ON the clothing and
it's really bad when it's animation time."* Clause 3 names this lane's
cast-shadow DATA as the correct precedent, so I audited my own banks against it
rather than assuming the compliment applied.

**RESULT:**
- **the act-triptych cook (new): clean.** No tile carries a directional light
  ramp. The treatment only removes decay and lifts surface value uniformly,
  which is paint, not light.
- **the frozen act-1 set: one real debt.** `wall_under_eave` bakes the eave
  shadow into its own pixels. Under the new law that belongs at render time. It
  is NOT being fixed now, and the reason is the law itself: clause 4 says
  approved assets are not re-cooked wholesale, and the set is byte-locked by
  Paolo's CBB. **Logged to be moved to the runtime light pass the moment that
  tile is touched for any other reason** (clause 4's own condition).

**AND A LIMIT WORTH WRITING DOWN.** My first instinct was to ship a "baked
shadow detector" — measure each tile's top-to-bottom luminance ramp and fail
anything steep. It does not work: the garage tiles in the frozen set trip it at
-83 and they are innocent, because a bay is dark for being a *hole*, not for
being shaded. A ramp cannot tell those apart. So it ships as a **ratchet on new
cooks only** (which currently measure 0), it is never pointed at anything it
would falsely accuse, and the gate says so in its own comment. A check that
cries wolf gets ignored, and then it protects nothing.
