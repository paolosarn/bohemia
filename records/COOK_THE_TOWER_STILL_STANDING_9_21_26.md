# COOK — THE TOWER THAT IS STILL STANDING
## Round V, 9/21/26. [fortress buildings] round 4 / [seven landmarks].
## COOKED AND REGISTERED IN VOTE: `cook-the-tower-still-standing-9-21`. Nothing went to the alpha or the demo.

---

## WHY THIS ROUND WENT HERE

THE FIGHT VERDICT round 4 passed this lane's edge fix and says in its own words: **"nothing
new for COOK on the fight this round."** The three lies left on that list are COMBAT's and
UI's. Rule 22 says a making lane cooks anyway, so the round went to this lane's own top open
row.

`[seven landmarks]`: the overmap names seven singular Las Vegas landmarks and **nothing can
build six of them**. A player walking to any one finds bare ground. Round 3 drew the Welcome
sign, 7 → 6. This is **the Stratosphere**, and it is next for a reason: it is the tallest
thing in the valley and the thing you orient by from anywhere in it, so it is the one whose
absence is felt furthest away.

---

## THE ONE THING MADE

**The Stratosphere plot**, one cell of the map, 96 metres across, 16,384 valley tiles,
sixteen legend codes, rendered through the game's own planner so the picture is the real
plan and not a mock-up.

    bank:      banks/BOHEMIA_THE_STRAT_9_21_26.txt   (palette, legend, notes, build source)
    picture:   slices/vote/COOK_THE_TOWER_STILL_STANDING.png
    tool:      tools/bohemia_the_tower_still_standing_cook_9_21_26.js

    hardpan 20.6%   car park 17.8%   arterial 13.1%   podium roof 9.9%   rock lag 9.6%
    under the pod 5.9%   THE TOWER SHADOW 4.5%   the pod 4.4%   the pool 4.3%
    parapet 2.3%   bay stripes 2.2%   shaft 2.0%   shaft shaded 1.9%   porte-cochere 1.5%
    open desert 30.2% of the plot, 90% of it one dominant ground

---

## MAP LAW: THE PLOT WAS READ, NOT CHOSEN

Claude never designs the map. `strat` sits at **53,28** and the tool reads its 3x3 off a
generated map before it draws a line, and refuses to run if the arterial ever moves:

    arterial   arterial   arterial
    downtown   STRAT      arterial
    strip      resort     resort

Arterial along the whole north edge and the east, downtown west, the Strip south-west,
resort south and south-east. **That is exactly where the real one is**: the north end of the
Strip where the boulevard meets Sahara, with downtown behind it. So the plot fronts north
and east and the drivable-access law is served off the arterial it already has.

A cell is **96 m and 128 valley tiles**, so one tile is 0.75 m (measured from
`engine/bohemia_overmap.js`: TILE_M 96, TILE_FINE 128, CELL_M 0.75). The real podium is
bigger than one cell, so what goes in the cell is the **tower and its own apron** — the same
call round 3 made for the sign. The rest of the resort is the resort cells south.

---

## THE SHADOW IS THE WHOLE IDEA, AND IT TOOK THREE GOES

From directly above you **cannot see that a thing is 350 m tall**. The tower is a circle and
the pod is a wider circle. What tells you is the shadow, and at this height it is longer
than the block and leaves the cell.

**Version 1: a cone.** It spread as it went and swallowed a quarter of the plot. It read as
a dark stain, not a shadow. The picture said so instantly; no number would have.

**Version 2: the right shape, invisible.** A cylinder's shadow is a **bar of its own width**
with the pod's wider ellipse further along the same bar. Correct — and the podium then
filled the whole east side of the cell, so the shadow had nowhere to fall (it only paints on
ground, because a shadow falls on the ground and the podium is three storeys above it). The
render came back with the idea of the plot hidden behind its own building.

**Version 3: the tower moved to the podium's north-east corner**, hard by the boulevard,
which is where the real one is. Now there is open ground and a road east of it, and the
shadow crosses both and leaves the cell.

Three versions of one element, each one caught by looking. The fourth would have been the
tell; there was no fourth.

---

## THE ANALOG HORROR BIBLE (rule 20, reference AH-01)

- **R1 THE ORDINARY FRAME, ONE WRONG THING.** A car park, a casino roof, a road, a pool —
  and a shadow longer than the block, thrown by something with no light in it. Name the
  wrong thing in one sentence: *the tallest object in the valley casts a shadow and shows
  nothing.*
- **R4 THE LIGHT WAS IN THE ROOM.** The fixture is the sun, and it agrees with every other
  tile in the game. Round 3's own words are the rule followed here: *"THE SHADOW GOES EAST,
  because every other tile in this game is lit from the same corner and a landmark throwing
  its shadow the wrong way is the one thing that would make it read as pasted on."* Nothing
  on this plot glows.
- **R10 GRIME IS BAKED.** This is a plan of legend codes; the art is the palette the game
  already draws. Nothing is shaded at runtime.

## THE REFERENCE CHECK (standing duty, 9/4 law)

- **DIST-02 / CB-07 (Learning From Las Vegas, both halves)** — a Strip plot is SIGN + SHED +
  PARKING IN FRONT and the sign is taller than the building. **This is that idea at its
  limit: the sign is 350 m and the shed is three storeys.** Taken: the plan reads TOWER
  FIRST, and the podium is deliberately low and plain so it cannot compete.
- **BLDG-04 (the Strip's three races — pool, sign, porte-cochere)** — taken literally: the
  pool is on the podium roof where a top-down view can see it, and the porte-cochere is on
  the arterial, because that is the one piece of a casino that must touch the road.
- **TG-05 (the commercial lot tile)** — a lot is striped asphalt with seal patches, not a
  grey rectangle. The car park is marked in bays.
- **DIST-03 (Las Vegas aerial)** — the site's real shape: tower at the north end, podium
  spreading south and west, big surface parking beside it.
- **The desert dominance law (Paolo 7/14)** — one dominant ground at 85%, accents in
  coherent clusters, per-cell shuffle BANNED. The first cut put the rock lag at 32% of the
  open desert. Tuned to the law's own number, **90% dominant**, and the tool now refuses to
  write below 80% so it cannot drift back.
- **The real subject:** Stratosphere Tower, 1996, 350 m, the tallest freestanding
  observation tower in the United States. A tapering concrete shaft on a three-legged base,
  an observation pod near the top, a low casino podium and a large surface car park.

## WHAT THIS DOES NOT DO

- **It does not touch the game.** `engine/bohemia_landmarks.js` is the walked world, and
  rule 18 keeps code off the play surface, so this is a bank and a VOTE candidate. The block
  drops into the engine in one paste when the hold lifts.
- It draws one of the six. Five are left: sphere, highroller, luxor, springs, robofactory.

## THE GUARDS IN THE TOOL

It refuses to write if the map stops putting an arterial on the north edge, if any code has
no legend entry, if any legend entry is drawn by nothing, or if the open desert falls under
80% one dominant ground. And it prints the full material split every run, so none of it can
drift quietly.

## HOW TO RE-RUN IT

    node tools/bohemia_the_tower_still_standing_cook_9_21_26.js
