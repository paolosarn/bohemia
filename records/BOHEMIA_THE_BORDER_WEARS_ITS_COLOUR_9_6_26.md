# THE BORDER WEARS ITS COLOUR, WHERE HE WALKS
COOK (16, the Production Artist), VAMILY [border marked], 9/6/26. Round 1.

## THE ROW
> cook the edge: a territory border is marked where a player can see it, in the holder's
> colour, on the wall, the fence, the underpass. Tab: CITY.

Both things it waited on landed first, and neither of them is this:
- **FACTIONS `[who holds]` (8bf3a91)** made the border REAL. Every one of the 9,216 cells
  has an owner and **100%** of the places two owners meet run along a road, a rail line, a
  wash or a mountain, so every border is on a landmark a painter could reach.
- **FACTIONS `[colours fixed]` (0160c71)** made the colour REACHABLE. A faction's hue lived
  only as rendered cloth pixels; it is measured off his own wardrobe now and inlined into
  the city.
- **UI `[owner shown]`** painted it **on the map**.

**A map is not where he walks.** This is the other half: the wall you are standing next to.

## THE REFERENCE CHECK (the 9/4 standing duty)
Compared against police-intelligence write-ups on gang boundary graffiti — policemag.com
*Decoding the Secret Messages on the Wall*, police1.com *How police can gain intelligence
from gang graffiti*, the ASU Center for Problem-Oriented Policing *Graffiti* guide,
gangenforcement.com.

**Taken, structurally:**
1. A boundary mark is a **no-trespassing sign aimed at the other side**, not decoration. So
   it is the holder's own colour, on the holder's own edge, facing out.
2. The places named are *"main thoroughfares, underpasses, and walls bordering rival
   territories"* — **which is the row's own list, arrived at independently.**
3. *"Large and plain surfaces are preferred, without windows or doors."* So: plain wall and
   fence faces only. No window, no boarded window, no door, no garage door, nothing
   enterable.
4. A mark is a **name or symbol, repeated along the boundary — not a wash of colour.** A
   faction that paints its whole border wall has painted a fence, not a claim.

**Not taken:** the crossing-out vocabulary (a rival's mark struck through is a threat;
where two claims meet you see both). That needs the contested edge as a *pair* rather than
a cell. Named below as the next thing rather than half-built here.

**Style from us:** the hue is HIS, measured off his wardrobe and never picked here
(COLOUR IS TERRITORY, 8/26: *"which faction owns which hue is HIS"*), and the mark is thin —
a 3 px band and two strokes on a 44 px face, under a tenth of the wall.

## WHAT SHIPPED, IN THREE PLACES
`tools/bohemia_border_wears_its_colour_9_6_26.py`
1. **`bohBorderInk()`**, one helper beside the turf cache. The map's own copy lifts value
   *and* saturation hard and is right to: an overmap is drawn at night and the Mob's
   measured `#572f2a` is nearly black at one pixel. **A wall is not a map.** This is paint
   on tan stucco in the sun, so the value stays where his wardrobe put it and only the
   saturation comes up. A drab faction keeps its drab — an outfit that does not advertise
   would not paint a bright line.
2. **The tile builder** sets `c.turfMark` on a plain wall or fence face in the band of a
   border cell that faces the rival.
3. **The structure draw** paints it on the wall texture and under the edge lines, so the
   shadow at the foot of the wall still falls across it.

## MEASURED ON THE REAL SURFACE, AND IT CORRECTED ME THREE TIMES
`tools/bohemia_border_paint_probe_9_6_26.js` — the alpha's RUN tab, the city frame the
player is actually inside.

**1. The first cut painted the whole neighbourhood.** It marked any plain wall anywhere in
a border overmap cell, one face in three. An overmap cell is **128 × 128 walked tiles**, so
that came out at ten marks per 16,384 cells, scattered through a whole district — a player
could live there and never meet one, and if they did it would be mid-block, saying nothing.
Fixed: the band is the **eighth of the cell that touches the rival, on that side only**, at
one face in two, which is a line of paint you walk along.

**2. The first probe reported zero of everything on a working build.** It asked `tileMeta`
for cells; `tileMeta` returns the kit CODES and no cells at all. The cells are built on
demand by `cellAt()`, which is what a walk calls.

**3. The filter tested the KIND and the kind is not the thing every district agrees on.**
The city's own legend calls code 4 `kind:'fence'`; a district **kit writes its own legend**.
Measured: the apartment kit's 756 fence tiles are `kind:'structure', name:'fence'`; the
solar kit's are `kind:'fence', name:'fence'`. Testing the kind found the solar farm and
missed everywhere anybody lives. **The NAME is what every kit agrees on**, because it is
what the dossier calls the object.

**4. And the sample only saw the rim.** Taking border cells in scan order gave twelve from
the top three rows — solar, freeway, mountain. A sample that only sees the rim cannot
answer a question about the suburbs. It is spread across the valley now.

## WHAT IT DOES NOW

    3,121 border cells and 6,095 interior cells in the valley

    BORDER cells sampled     marks land, in the holder's own measured colour
    INTERIOR cells sampled   0 marks  (the mark is the EDGE, and that is checked)
    mountain border cells    0 marks  (605-1,290 rock faces, correctly untouched:
                                       nobody sprays a cliff)
    freeway border cells     64, 8 and 3 marks -- the sound wall and the fence along
                             the thoroughfare, which is the reference's first named place

## WHAT IS NOT DONE, AND IT IS 22% OF THE BORDER
The mark is set on the **district kit** path, which needs a kit legend to tell a fence from
a window. Measured over every 7th border cell in the valley:

    346 of 446   have a district kit legend -- the mark can see them
    100 of 446   are drawn the older parametric way and carry no legend
                 (99 suburb, 1 gated)

**So the suburb — where most people live and where garden walls actually are — is not
painted yet.** That is round 2, and it is a specific, located piece of work rather than a
vague remainder: the parametric suburb path sets `c.s` and `c.face` without ever building a
legend entry, so the branch this mark lives on never sees it.

## PROOF
    node tools/bohemia_border_paint_probe_9_6_26.js   the measurement above
    node gates/turf_gate.js               36/0
    node gates/faction_colour_gate.js     17/0
    node gates/walked_surface_gate.js     15/0
    node gates/alpha_loads_gate.js        20/0
    node gates/border_gate.js              6/0
    node gates/city_cast_gate.js           7/1 -- B6, measured FLAKY on unchanged
                                          origin/main last round (3 red of 4 runs)

## WHERE HE SEES IT
**CITY tab**, walking. Stand on the edge of a faction's ground next to a freeway or a fenced
lot and the wall carries that faction's colour. Not on their back streets, not on a cliff,
and not yet in the suburbs.
