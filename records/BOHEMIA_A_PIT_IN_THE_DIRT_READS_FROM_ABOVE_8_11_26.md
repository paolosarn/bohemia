# A PIT IN THE DIRT READS FROM ABOVE (8/11/26, WORLD lane)

## HIS RULING

> "maybe we should have more open pits where a bunch of the shit lives as well.
> i know we have grids and shit but part of the procedureal generation
> especially if its dirt/sand is that we can proceduraly generate elements on
> the dirt/sand and this may be part of it."

Dirt and sand are a **generative surface**, not a floor. Built.

## THE RESEARCH: WHAT A GRAVE ACTUALLY LOOKS LIKE FROM ABOVE

Forensic search does not find graves by digging at random — it finds them by
reading the surface. Every part this system draws is one of those indicators,
which is why it reads as a grave instead of a decal.

**SUBSIDENCE.** Backfill compacts as the mass below decomposes, so filled ground
sits *lower* than the ground around it. A depression appears within days of
interment and is still measurable at 11 months. In arid ground with no
vegetation to close it, far longer.

**RIM CRACKS.** The cut edge cracks as fill settles away from it — visible
within days.

**SPOIL.** The earth taken out never all goes back in. Archaeology has a word
for the leftover heap: *spoil*. It sits beside the cut, on **one side**, where
the machine or the shovels threw it.

**THE RAMP.** Machine-dug mass graves have a ramp at one end — it is how the
loader got down. The stratigraphic excavation method explicitly retains "grave
walls and ramps" as features of the site.

**THE GREEN.** Decomposition floods the fill with nitrogen, phosphorus and
carbon. Grave-indicator vegetation shows *abnormally strong growth* — measured
at 10 months post-interment. **In the Mojave this is the loudest tell there is:**
a dark living patch in dead ground means something fed it.

Sources:
- [Detecting grave sites from surface anomalies: a longitudinal study (J. Forensic Sci., 2021)](https://onlinelibrary.wiley.com/doi/10.1111/1556-4029.14626)
- [Clandestine grave: modern forensic insights and soil analysis](https://biologyinsights.com/clandestine-grave-modern-forensic-insights-and-soil-analysis/)
- [Non-invasive approaches to detecting clandestine human burials (Forensic Sciences Research)](https://academic.oup.com/fsr/article/3/4/320/6780993)
- [Keeping the pieces together: comparison of mass grave excavation methodology (Forensic Sci. Int.)](https://www.sciencedirect.com/science/article/abs/pii/S0379073805001040)
- [Spoil (archaeology)](https://en.wikipedia.org/wiki/Spoil_(archaeology))

## WHAT WAS BUILT

`BohemiaDead.pits(opts)` — same contract as `place()`: a cell's grid, legend and
seed in, ground truth out. Five parts, each named for the real thing it is:
`fill` / `rim` / `spoil` / `ramp` / `green`.

- **It asks the LEGEND, never a district name.** `isDiggable(entry)` requires
  open walkable ground whose name reads as earth (dirt/sand/soil/desert/gravel/
  field...) and explicitly refuses paved surfaces. A new district gets pits the
  day it declares dirt, with nothing here edited.
- **Ellipses, rotated, with per-tile edge noise.** A square hole reads instantly
  as a placed game object. The gate holds this: no cut may fill its own
  bounding box.
- **Spoil on one side only**, dotted against a per-pit throw direction.
- **Size from the story, not from taste.** `ra` scales with `sqrt(hold)`, so a
  back-yard grave is one body wide and the cemetery pit is machine work.
- **A pit needs room.** Under ~120 diggable tiles, the cell is a strip of verge
  and the answer is honestly zero.
- **Act 1 is when the digging happened** — the same `ACT_DENSITY` the bodies use.

**NO ART WAS COOKED, AND NONE WAS NEEDED.** A pit is not an object on the
ground; it *is* the ground, moved. The render is a tonal pass over the district's
own approved ground tiles — fill darkened, spoil lifted and warmed, green
washed. Checked first: no approved excavation, spoil or open-grave tile exists
in any bank, and the page carries exactly one judged bank (`TP_TILES.gore`,
which is bone, not earth). Hand-painting a substitute would have been the
shopping-law violation. Tone is also the *honest* answer, because every real
indicator above is tonal from above.

## THE TWO THINGS I GOT WRONG, BOTH CAUGHT BY MEASURING

**1. The first cut returned zero pits valley-wide and reported `ok`.** It asked
`tileMeta(tx,ty).legend` directly. Probed the running app: **that legend is
EMPTY for every district** — which is exactly why `deadForCell` resolves through
`deadLegendFor(m)` plus a synthetic legend for bare ground. I had built a second
ruler for a question this page had already answered, and it was the wrong one.
Pits now resolve legends the way the dead do, and the gate asserts it.

**2. My own gate failed on correct code.** It pooled every tile in the cell and
asked whether "the" pit was elliptical and whether "the" spoil sat on one side —
but a cemetery cell digs **five** separate pits, each with its own throw
direction, so the pooled answer was a bounding box spanning all five and a spoil
"ring" made of five different sides. **Fix the ruler, never the target (8/1).**
It now groups by `p.pit` and asks each dig its own question.

## MECHANISM-MINE / CONTENTS-PAOLO'S

This decides **where the ground was dug and what shape the dig left**. It never
decides **who dug it**. The gate sweeps every pit story for faction words and
fails if one appears. The mob-burial quest he floated is recorded in
`laws/BOHEMIA_ADDENDUM_BONES_ARE_HUMAN_SIZED_8_11_26.md` and belongs to the
quest lane; the ground it would stand on now exists.

## GATE

`gates/pits_gate.js`, 25/0, registered in the suite: only diggable ground is
dug, never pavement; all five parts present; no cut is a rectangle; every spoil
heap is one-sided; the cemetery digs harder and holds more than a back yard; an
unruled district still gets a default; act 3 digs less than act 1; the same seed
digs the same pit forever; the shipped page draws them **under** the dead
(bodies lie *in* a pit, not beneath it); pits share the dead's legend
resolution; the pass never forces a district to generate; and the picture exists.

## THE EDGE FIX (same day, the thing I flagged and then did)

I shipped the pit with an honest note: at walking zoom the tile edges read as
**blocky squares**, because the tone was flooded per whole cell and a cell is
44 px of hard edge. That is now fixed, and the fix is the shape of the right
answer rather than a blur.

**The module ships the geometry, not just the verdict.** Each pit tile now
carries the ellipse maths it was judged by -- `d` (how far out it sits), `u`/`v`
(its position along the pit's own two axes) and `ecc` (how close to the boundary
it is, 0 deep inside, 1 right on it). All four were already computed; only the
verdict was being thrown away.

**The renderer masks boundary tiles at QUARTER-TILE resolution.** A tile deep
inside the hole is genuinely all hole, so it still floods -- cheap and correct.
A tile on the boundary is subdivided 4x4 and each quarter is tested against the
same ellipse, with a deterministic per-sub-tile jitter so the break-up is stable
and never shimmers as the camera moves. The edge now breaks at 11 px instead of
44. **Nothing is re-derived in the renderer** -- it reads what the module shipped.

**And the fix had its own bug, caught by looking.** Rounding each quarter's
origin and ceil-ing its width left sub-pixel seams between neighbours, and the
ground showed through them as a fine grid over the hole: the blocky look coming
back wearing a finer grid. Each quarter is now derived from its two rounded
BOUNDARIES, so adjacent quarters share an exact pixel edge and a filled run is
solid. Gate assertion added for exactly that, by name.

Gate now 30/0.

## DEPTH: IT READS AS A HOLE NOW (same day)

Tone alone said *something happened to this ground*. It never said **hole**,
because nothing in the picture was lit.

**The sun is the world's, not mine.** `sunVec()` already drives every cast
shadow in this app off `T.min`, so a pit now dims and swings with the day like
everything else, and goes flat at night when there is nothing to cast.

**Ambient occlusion first, cast shadow second — and that order is a measured
result, not a preference.** The first version drove depth off the sun alone. It
read beautifully at dawn and *vanished at midday*, because noon is the shortest
shadow of the day. A real hole is dark at noon too: the floor simply sees less
sky than flat ground does. So the floor now carries a constant darkness that
does not move with the clock, and the sun adds the directional cast on top.
The spoil heap goes the other way — it is a mound, so it *catches* light.

### The wrong instinct I caught myself in

When the cue read weakly, my first move was to change the LOOK tool to
photograph at **midday** instead of the game's 06:00 opening. I looked at the
result: it was **worse** — short shadows plus bright ambient washed the ground
flat. It was also the wrong instinct regardless of outcome. Choosing a
flattering hour to make my own feature look good is dressing the shot. **The
world opens at 06:00 and that is what he sees, so that is what gets
photographed. If a cue does not read at his hour, the cue is what gets fixed** —
which is what the ambient-occlusion floor does.

Gate now 35/0, including: depth must use the world sun and never a private
light; a pit floor must be dark with the sun overhead; a pit must cast nothing
at night rather than faking depth; the spoil must catch light rather than
shadow. `shadow_gate.js` still 7/0 — the world's own shadow law is untouched.

## STILL OPEN — AND IT IS THE NEXT REAL STEP

**A pit is not walkable yet.** The ramp exists as data and means nothing: you
cannot walk down into a pit, and the cut rim does not stop you walking across
it. Making the rim block and the ramp the only way in turns a picture into a
*place* — you have to find the way down, and what is at the bottom is worth the
walk. That is mechanism, not content, and it is the next thing this lane builds.
