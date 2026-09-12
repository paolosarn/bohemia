# COOK — THE WELCOME TO LAS VEGAS SIGN, DRAWN AT LAST
9/12/26 · lane 16 COOK · `[fortress buildings]` round 3 · **7 undrawn landmarks → 6**

## THE ROW

Round 2 measured that the overmap names seven Las Vegas landmarks that no registry can build:
ten cells of bare ground where the most recognisable objects in the city are supposed to
stand. This is the first of them drawn, and it is first for the reason round 2 named: one
cell, one shape, and honest at 96 metres.

## THE REFERENCE CHECK

**Compared to:** DIST-02 (Learning From Las Vegas, Venturi/Scott Brown), CB-07 (the same
book's builder half), BLDG-04 (the Strip's three races), TG-05 (the commercial lot tile), and
the real sign at 5100 Las Vegas Blvd South.

**Rules taken:**
- **DIST-02** — *"a Vegas commercial plot is SIGN + SHED + PARKING IN FRONT; the building
  hides behind its lot."* The Welcome sign is that idea **with the shed deleted**. There is no
  building at all: a sign, an apron, and the boulevard. It is the purest case in the whole
  reference, which is exactly why it is the right first landmark and not the hardest.
- **CB-07** — *"the SIGN is taller than the building."* Nothing here is taller than the sign
  because nothing else is here.
- **TG-05** — a lot is striped asphalt, "the most readable man-made ground", so the bays are
  marked rather than the apron being a grey rectangle.
- **The desert dominance law** (Paolo 7/14) — one dominant ground at 85%, accents in coherent
  clusters, per-cell shuffle banned. The five landmarks already in the file say in their own
  comment that painting the background flat "broke the monoblock law five times over". Patches,
  not noise. Measured: dominant ground **42.1%**.

**What changed from the real thing, and whose call it was:** the real sign stands in the
*median* of the boulevard. Here it fronts the boulevard instead, because cell 55,65 has
ARTERIAL down its entire west side and suburb and commercial on the other three. **MAP LAW:
Claude never designs the map.** The sign goes where the map already put it and faces the road
the map already gave it. The 3×3 around the cell was read off a generated map before a line
was drawn.

## THREE THINGS THE PICTURE CAUGHT THAT THE NUMBERS CALLED FINE

The first cut measured well — 16 of 16 legend codes drawn, no dead dials, dominant ground
under the monoblock ceiling. Then I rendered it beside `fort` and `minigp` and looked.

1. **The sign read as a red blob.** My diamond formula subtracted an extra two near the ends,
   which rounded the points off and turned Betty Willis's diamond into a lens. Rendered, it
   read as a flying saucer. **The silhouette IS the landmark here** — get the outline wrong and
   no amount of correct colour rescues it. Now a true diamond: half-width falls linearly to 1
   at top and bottom, star above it, the letter rows as light bands.
2. **The shadow did not exist.** `#6f6249` against `#8a7a5e` hardpan is three values apart and
   simply did not read, so the sign floated on dirt. A Vegas midday shadow is hard and dark.
3. **The apron was a slab.** Drawn 0.30–0.74 across the cell (~34 m) with one-unit bay
   stripes, it reduced to a single dark block with no bays in it — the exact "coloured slabs"
   failure this lane has spent rounds fixing. The real free lot is about a dozen bays, roughly
   30 × 18 m. **Smaller and more legible**, which is what usually happens when the number comes
   off the real thing instead of off the eye. Bay stripes went to two units, because 0.75 m of
   paint vanishes the moment anything reduces it and 1.5 m is what a Vegas lot actually has.

Three rounds of looking, and every one of the three was invisible to the measurements.

## MY OWN TOOL SHIPPED A DRIFT BUG AND ITS OWN GUARD CAUGHT IT

The cook edits two files — `bohemia_landmarks.js` for the art and `bohemia_world.js` for the
registration. The first cut **wrote the landmark file and then validated the world file.** The
world anchor's spacing was wrong, so it refused — *after* writing half the change, leaving
exactly the drift its own guard exists to prevent. A tool that edits two files has to be
all-or-nothing or it is a drift generator. Both files are validated before either is written now.

## VERIFIED ON THE REAL SURFACE

Asked the world itself, not my own generator:

    w.plot(55,65)  ->  district 'sign' · category gaming_resort · archetype leisure
                       16 legend entries · 3 buildings
    w.plot(56,65)  ->  district 'suburb' · 15 legend entries

## AND THE GATE I BUILT LAST ROUND CAUGHT ITS OWN IMPROVEMENT

`map_names_it_gate` went from 7 names over 10 cells to **6 over 9**, printed
*"IT FELL. Re-freeze the baseline DOWNWARD"*, and I did. That is a ratchet doing the one job a
ratchet is for, one round after it was written.

## NUMBERS

    map_names_it   9/0  (7 names/10 cells -> 6/9, re-frozen downward)
    district_kit  24/0    world_gate     29/0    landlocked    16/0
    tilespec     310/0    alpha_loads    20/0    walked_surface 15/0
    art_45        16/0    pixel_craft    30/0    purity          exit 0
    reference_check 6/0
    DISTRICT FILL 52/1 — pre-existing, the one failure is `freeway is not emptier than it was
    on 8/2`, identical to the baseline taken two rounds ago and nothing to do with this cell.

The aerial tile bank went **61 → 62 kinds**; the sign derives a coarse tile like every other
district, so it is drawn at both zooms from the same art. Both slices that inline the engine
were rebuilt (`build_current_slice.js`, `build_run_slice.js`) — the lesson from the round
before last, applied without being reminded.

## STILL OPEN

Six landmarks left: **sphere** (4 cells — needs the `clusterBoundsOf` treatment the airfields
use, a different mechanism), **highroller**, **strat**, **springs**, **luxor**,
**robofactory** (all single-cell, all the pattern this round just walked).

**Nothing on Paolo's screen changes until he walks to 55,65.** The cell is at the south end of
the boulevard, and the row stays CLAIMED.
