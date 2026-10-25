# COOK 10/25/26: THE TOWN IS PAINTED IN, AND THE STREETS READ AS STREETS

Session cook-towns-painted-in, opened by the coordinator (rule 112) at the weekly reset: 'finish [the cities sit in the
ground]... then [the PC playtest: the art's part]... push to main every 15 minutes.' Rules 154, 159, 164 (items 11, 13,
29, 30).

## 1. [the cities sit in the ground] (rule 154), a6e1ad1d

PAOLO 10/24: 'I asked you a long time ago to fix the settlements so they're part of the map instead of a sticker on top;
they still look like that.'

MEASURED FIRST (records/target/cook_map_colour/towns_start1025, the demo's map through the one driver, five stops): last
round took the edge and the oval off, but a town was still COOK's map picture (slices/map_towns/) laid over RUN's painting
at 74 CSS px whatever the zoom. Since RUN's __ONE_MAP_AT_EVERY_ZOOM__ the map is the painter's own picture at every zoom,
so the town was the only thing on the glass with its own camera, its own sun and its own scale: close in (a block 85 CSS
px) a toy town 74 px wide over downtown towers three times its height. That is what reads as a sticker.

THE FIX (__THE_TOWN_IS_PAINTED_IN__): the painter (vbCityCore) builds each of the 14 home bases into the blocks it stands
on, in the painting's own texels, sun and cast shadows, rolled on the valley's coordinates so a close tile and the whole
painting agree (inp.towns from ctBases and mapTierOf; the painting's key carries them).
- FORTRESS, 4 x 4 blocks (a prison or a works taken whole): a concrete wall with crenels, corner towers over the houses,
  gate towers where the streets run in, barriers staggered in the gate, braziers on the walk, a faded banner.
- TOWN, 3 x 3 (a neighbourhood walled): a ring of stacked containers, cars, plywood and tyres, a lookout of containers at
  each corner, its market under tarps along its streets, a water tower.
- CAMP, 2 x 2: tents round a fire in a ring of wrecks, the lot cleared.
- Round each, THE FIELD OF FIRE: what stood nearest the wall knocked down to rubble and char on a ragged line, so the town's
  edge dissolves into the city's lots; inside, the city's own blocks stand (the prison, the chapel, the radio station).
- Act one's colour (rule 159): concrete, rust, grey tarp, plywood; the faction's colour only on tower roofs and a banner,
  45 percent of it over the dust (COLOUR IS TERRITORY). The fires burn without the grid, in firelight (#d0833f), never the
  grid's lamp colour, so THE FAR END IS PAINTED's F6 still holds grid light to powered blocks.
- Once the painting has them nothing is drawn over it. The flag, the name and the people stand at the gate (the town's near
  corner), so the town shows behind them; the tap box is its blocks. Until the painting lands, the old picture is drawn.

THE LOOK: node tools/bohemia_cook_the_town_is_painted_in_10_25_26.js <label> ['Town;Town;x,y'] centres the demo's camera on
each town (or block) at six stops, far to near, and writes one sheet a town: records/target/cook_map_colour/painted_p4 (the
towns), painted_p5 (with the streets).

## 2. [the PC playtest: the art's part] (rule 164), part one, f458f104

PAOLO 10/24: 'the freeway and the Strip still look bad'; 'there are some buildings in the street lanes'; 'I want to zoom in
and see more detail, the sidewalks, my team.'

MEASURED FIRST (painted_roads0): an arterial was asphalt and one dashed line. The freeway was a concrete slab with one line,
and NO line at all where it is two blocks wide, because a two-wide one has its own kind on three sides and the painter
read it as a knot: that is all of I-15 (x 51 and 52). The Strip (two wide, x 43 and 44) was a crosswalk on every cell for
the same reason, with gold squares at random on its edges. 14 blocks the valley's roll set inside a street's line, the
street running into them from both sides (a fire station and the sign in the middle of the Strip, a resort and a casino in
arterials, five suburbs).

THE FIX (__THE_STREETS_READ_AS_STREETS__, marked blocks in vbCityCore and base()):
- The freeway and the Strip know which way they run and how wide they are; a two-wide one is one road with one median.
- THE FREEWAY: shoulders, solid edge lines, three or five lanes a way, a Jersey barrier down the median, on its berm. Close
  in: lane dashes, the oil line down each lane, the day it stopped (cars and semis left in the lanes), sand on the shoulders.
- THE STRIP: wide sidewalks with the casinos' sign pylons (its one faded accent, lit at night only where there is power), a
  raised median of dead palms, four lanes a way.
- AN ARTERIAL: a sidewalk and a gutter each side, three lanes a way, a faded yellow centre line (double close in). Close in:
  lamp posts (their heads lit where there is power), the slabs' joints, crosswalks at every crossing, cars at the kerb, sand
  in the gutter, cracks.
- NO BLOCK IN A STREET'S LANE: a block a street runs into from both sides carries the street through it on the map.
- The close-in things are painted only at four texels a q and up (the close tiles); the whole painting stays clean and pays
  little: one box, the whole bake 1.35 to 1.5 s before, 1.84 to 1.9 s after; a 96-texel tile 276 to 293 ms, 286 to 311 ms.

## GATES (rule 13: the pre-push pass, by name)
THE MAP HAS ITS PEOPLE 19/0, THE MAP STANDS UP 13/0 (the berm mutation still turns U3 red), THE FAR END IS PAINTED 11/0,
THE LIVING MAP 22/0, NO TWO TEXTS OVERLAP ON THE DEMO 14/0, THE MAP AT THE PHONE'S PIXELS 16/0. FACTION BETWEEN 80/2 and THE
NEAR END IS THE BLOCK 6/1 are the same reds on main without this (a card's size; the speed pad, rule 151(c)).

## WHAT IS NOT DONE
- The region's twelve places outside the valley (bohemia_region.js) still draw through mapBaseDraw's picture path; the
  region never turns on in the demo today (BOH_REGION.ready false after 60 s), so nothing he sees is a sticker. When RUN
  turns it on, they want the same: the painter run on a small patch of land with the town in it, ground cut away.
- Item 13, the fight boards more organic and without glitches: COMBAT holds its part (7) open; EYES' [eyes: board seams]
  is half (the washed strip above a desert board meets it at a straight line). Next for this lane.
- The crowd at a town's gate still covers most of a camp at the opening zoom (LIFE+CITY's people at their size, rule 21).
