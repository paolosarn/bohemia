# BOHEMIA — POCKET CITY 2 STYLE BIBLE (7/23/26)

The art-direction standard for Bohemia's ISO BUILDING art, derived from studying
Paolo's 66-screenshot reference set (`records/refs/pocketcity2/`, saved forever
because git is the memory). Reference, not copy: we take the READABILITY + FORM
LANGUAGE and render it in Bohemia's DEAD world. Every future iso-building cook
builds against THIS doc, and its gate (art_45 + the hero gate) enforces the
measurable parts.

Trigger for this bible: district-hero v1 (generic boxes) AND my sight-unseen v2
both missed. Paolo: "they were all ICONIC — you could tell what the building was
and the purpose of it."

---

## THE LOOK, IN RULES (what the references actually show)

1. **PROJECTION** — dimetric 3/4, ~2:1 iso. Every building sits ON a square base
   PLOT (its lot), not floating. A soft, diffuse DROP SHADOW pools on the ground
   under it. The building fills most of its plot; a little ground shows at the edges.

2. **MASSING — chunky, simple, BOLD.** Each building is a few big clean volumes,
   not a busy pile of detail. Silhouette reads instantly. Fewer, larger shapes
   beat many small ones. (v2 was too fiddly — simplify.)

3. **SHADING — soft ambient, THREE flat tones per volume:** a bright top face, a
   mid front-right face, a darker front-left face. Transitions are FLAT and clean,
   not noisy. **NO hard 1px black outline.** Edges read from the value step between
   faces (and at most a slightly-darker edge pixel), never a keyline. *(v2's black
   border is the single biggest thing to kill.)*

4. **ROOFS carry the color; WALLS are pale.**
   - Houses/small civic: a saturated COLORED hip or gable roof — terracotta red,
     forest green, teal, navy — over PALE walls (white, cream, lavender-gray,
     light blue-gray).
   - Big civic / commercial: FLAT roofs, pale gray, dressed with parapets, roof-
     access boxes, AC units, vents.
   - Industrial: dark hip roofs on RED BRICK, or flat roofs with machinery + stacks.

5. **WINDOWS — big, neat, readable GRIDS** of dark blue-gray glass; storefronts get
   large panes. Windows are a primary read, evenly spaced, generous. Trim/frames
   in the roof accent color.

6. **THE BASE PLOT is dressed** — a path/driveway, a low fence, ground texture,
   small props that signal function (benches, AC units, hedges [alive world],
   crates + a forklift for industrial). The plot is part of the sprite.

7. **PALETTE — bright but slightly PASTEL/desaturated.** Warm golden daylight.
   NIGHT (their look): buildings go cool blue-violet with WARM YELLOW glowing
   windows + neon signs. (Ours differs at night — see dead-world below.)

8. **PROPORTION — buildings read BIG and grounded,** wide not tall-skinny (except
   deliberate towers). Human figures are tiny next to them.

## THE ICONIC SIGNATURE PER BUILDING (the "you can tell what it is" tell)
Each type has ONE unmistakable feature. This is the whole game:
- **Town Hall / City Hall**: pale symmetric stone block, a small central DOME/
  CUPOLA on top, columned/portico entrance, a LANDSCAPED base (trees, hedges,
  paths). Civic dignity.
- **Bank**: pale stone, columned front, hedges, flat roof, symmetric, solid.
- **Water Tower**: an elevated round TANK on a tall lattice-leg frame.
- **Water Treatment**: a raised platform building + big round TANKS / clarifiers.
- **Power Plant**: boxy industrial hall + SMOKESTACKS (large = cooling towers).
- **Factory / Mill**: RED BRICK hall, dark hip roof, TALL SMOKESTACKS, roof vents,
  loading doors; steel/ore variants are gray or orange boxes with roof machinery.
- **Wind**: a single white 3-blade TURBINE. **Solar**: a flat blue PANEL array.
- **Bus / Transit terminal**: a big sweeping platform CANOPY + bays (our read).
- **News Station**: mid-rise + a rooftop DISH/antenna.
- **Stadium**: an oval BOWL with colored seating rings.
- **Commerce Towers**: paired glass SKYSCRAPERS.
- **Museum / Library / Historical**: columns + pediment, cultural-formal.

## BOHEMIA DEAD-WORLD RECONCILIATION (how we differ — LAW, not optional)
Their world is alive and cheerful; ours is a post-collapse dead Vegas. We keep the
FORM/READABILITY, change the LIFE:
- **KEEP**: chunky clean masses, base plot + soft shadow, soft 3-tone shading, NO
  black outline, colored roof over pale wall, big window grids, the iconic signature.
- **CHANGE (dead act 1)**: windows are DEAD DARK glass — **never the warm night
  glow** (the place is abandoned; that's our night read: dark, not lit). Walls are
  weathered/dusty pastels (faded, not fresh). Roofs faded. Decay tells layered on:
  cracks, rust streaks, a BOARDED window or two, a tattered flag, a dead vehicle.
  The green lawn base becomes DEAD DIRT / gravel (dead-world law: no living turf);
  trees are dead sticks or absent. **But the ICON still reads first** — decay is a
  finish on a legible building, never mush that hides what it is.
- Purple stays reserved (Amalgamation only). Tan-wall 85/15 still governs stucco.

## WHAT v1 + v2 GOT WRONG (so the recook doesn't repeat it)
- v1: generic identical tan BOXES, no signature — read as nothing. (GRAVEYARDED.)
- v2: right instinct (add signatures) but WRONG EXECUTION vs this reference —
  (a) a hard **1px black outline** the PC2 look never uses; (b) walls too dark/
  muddy — should be PALE with the color on the ROOF; (c) too cluttered/noisy —
  PC2 is simpler and bolder; (d) shading too high-contrast + jittery — should be
  soft flat 3-tone; (e) the base plot was a thin pad — should be a dressed lot
  with a soft shadow.

## THE RECOOK TARGET (v3)
Rebuild each hero as: a clean chunky mass on a dressed dead-dirt plot with a soft
shadow, PALE weathered walls + a colored (faded) roof, big DEAD-glass window grids,
soft 3-tone shading and NO black outline, its ONE iconic signature bold and clear,
decay as a finish. Then judge.

---

# THE MEASUREMENT (7/28/26) — WHY THIS BIBLE EXISTED FOR FIVE DAYS AND THE DISTRICTS
# STILL CAME BACK 32 DOWN

Paolo re-sent this reference on 7/28 after the bulk verdict. It had been sitting in
`records/refs/pocketcity2/` since 7/24 and this bible had been written against it on
7/23. So the reference was not missing and the rules were not missing. Something else
was wrong, and it is now measured rather than guessed.

**COLOUR, COUNTED. Hue families present (12 buckets, counting only pixels with
saturation > 0.18):**

| | hue families | chromatic pixels |
|---|---|---|
| **Pocket City 2** (`IMG_4006`, real gameplay) | **12 of 12** | **87.5%** |
| **Pocket City 2** (`IMG_4013`) | **12 of 12** | **77.9%** |
| **Bohemia district icons** (27, median) | **3** | **13.4%** |
| Bohemia worst (policestation) | 2 | **0.9%** |
| Bohemia worst (park) | 3 | **0.5%** |

**Our world is four times less colourful than the reference, and half our icons carry
essentially no colour at all.** Thirteen of twenty-seven icons have only TWO hue families
in them. That is not a style, that is mud.

**AND IT IS SELF-INFLICTED — NO LAW REQUIRED IT.** The visual constitution constrains
**value bands** (brightness per layer: ground 103.7, top 110.2, wall 96.0, ±26). It says
**nothing about saturation or hue at all**. Nothing in canon ever told us to build a
grey-brown world. We chose those palettes district by district and never once measured
the result across the set.

**THE MECHANISM OF THE FAILURE — rule 4 of this very bible:**
> *"ROOFS carry the color; WALLS are pale."*

We wrote that down and did not do it. What happened instead is that the dead-world
reconciliation section — *"faded, not fresh"* — got applied as **"desaturate everything
toward brown"**, which is a different instruction. Faded terracotta is still terracotta.
Faded teal is still teal. A faded roof and a faded wall in the same brown are not faded,
they are *merged*, and a merged roof and wall destroy exactly the silhouette read the
whole bible exists to protect.

That is the honest answer to *"each grid each district should feel like its own
landmark"*: **they cannot, because they are all the same colour.** Hooks and silhouettes
matter, but two districts rendered in the same three browns will read as the same
district no matter how different their shapes are.

## THE CORRECTION (proposed, needs his ruling on how far)

A dead Vegas should NOT hit 88% chromatic — that is a living sunny city and copying it
would be wrong. But 13% and three hue families is far too low. The target is
**muted but DISTINCT**: every district keeps a recognisable hue identity, dropped in
saturation and value, never merged into the neighbouring one.

- **KEEP the value bands.** The constitution measured them and they are not the problem.
- **RAISE hue variety.** Roofs, awnings, signage, doors, trim, vehicles and markings all
  carry faded-but-real colour. Walls stay pale, which is rule 4 as written.
- **SEPARATE DISTRICTS BY HUE, deliberately.** Two neighbouring district types should not
  share a dominant hue. This is a set-wide constraint and nobody has ever checked it.

## THE GATES OWED (neither exists)

1. **HUE VARIETY GATE** — every district icon must carry at least N hue families and at
   least M% chromatic pixels. Ratchet, so it can only improve. Numbers to be set from a
   Paolo-approved reference district, never invented.
2. **THE SQUINT GATE** — render every icon at one tile, threshold to pure black, require
   silhouettes to be mutually distinguishable. Two districts with the same black shape
   ARE the same district at map zoom.

Together they cover the two ways a district fails to be a landmark: same shape, or same
colour. We have been failing on colour and did not know it because nothing measured it.
