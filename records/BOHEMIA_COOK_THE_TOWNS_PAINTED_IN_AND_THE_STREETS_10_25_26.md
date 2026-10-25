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

## 3. [the PC playtest: the art's part], part two, 9cae20af: THE FIGHT FLOOR IN ACT ONE'S PALETTE

MEASURED (records/target/cook_fight_look/before, the bare fight, seed 31, six kinds): the map is grey now and the fight was
still the 10/22 tan floor, 72 percent sand family over the 35 present-day blocks (median chroma 12.7), 45 percent over the 51
cover pieces (the block walls 96). His approved ground pool measures 75 percent sand itself, so the packs give the floor its
shapes and materials and rule 159 gives act one its colour.
THE GRADE (tools/bohemia_cook_the_fight_floor_in_act_one_10_25_26.py): the painting's ruin() on a picture, chroma x 0.3 and
never past 7, value and hue kept, a strong colour (paint, a sign) a faded accent to 16. The blocks and their raided futures
(70, lossy 80 as they were, 49.71 -> 49.72 MB) and the cover pieces (lossless as they were, 765 -> 604 KB); every block under a
quarter sand after, most 1 to 9 percent. The reclaimed futures keep act three's colour. records/target/cook_fight_look/after.
SOUNDS' step table (tools/bohemia_sounds_fight_floors.py) reads asphalt as dark AND unsaturated; on the graded floor shaded
dirt is unsaturated too, so its test is 0.07 and 0.35 now (was 0.18, 0.42), the pair measured to give back the same table;
its --check names the same three blocks as on main.
STILL OPEN IN ITEM 13: the board's edge (COMBAT's ring of dimmed blocks ends on a straight line; NOTE on their board) and
the board's layout (COMBAT TWO's): rows of the same house read as made by a machine.

## 4. 99486fba: THE REGION'S PLACES PAINTED ON THE FAR LAND, AND NO WHITE LOTS

WORLD's 07826e02 turned the region on in the demo mid-round (34 places: Primm, Jean, Boulder City, the Hoover Dam, Ivanpah
Solar...), and they came drawn the old way, a picture laid on the far land. The land's painter paints at two texels a block,
too coarse to hold a town, so each place is painted as its own small patch by the same painter (vbRegionPatchInput: a
fortress 4 x 4 blocks of works, a town 3 x 3 of houses, a camp 2 x 2 of tents, the dials' industry, house and desert colours,
the region's road through it), in the worker like a close tile at 24, 48 or 96 texels a block, WITH ITS LAND CUT AWAY
(inp.cutout: the land, its road and the yard past the ragged line transparent, the town's shadow on them a soft dark), so it
stands on the far land with nothing under it and the region's own road runs through its gate. records/target/
cook_map_colour/painted_region1 (Primm and Ivanpah Solar). Until a patch lands, the picture is drawn.
NO WHITE LOTS: a burned block skipped COOK's dials, so a burned shop's parking lot fell back to the palest key in the table
(198,196,191) and read as a white box on the map at every zoom; its ground now takes its district's ground (painted_lots1).

## GATES (rule 13: the pre-push pass, by name)
THE MAP HAS ITS PEOPLE 19/0, THE MAP STANDS UP 13/0 (the berm mutation still turns U3 red), THE FAR END IS PAINTED 11/0,
THE LIVING MAP 22/0, NO TWO TEXTS OVERLAP ON THE DEMO 14/0, THE MAP AT THE PHONE'S PIXELS 16/0. FACTION BETWEEN 80/2 and THE
NEAR END IS THE BLOCK 6/1 are the same reds on main without this (a card's size; the speed pad, rule 151(c)).

## WHAT IS NOT DONE
- The region's places have no night lights yet (the patch's lights canvas is not drawn); the far land under them is the
  land painter's two texels a block, so close in a crisp town stands on a coarse land (RUN's land).
- Item 13: the floor's colour is done (part two); the board's edge is COMBAT's (NOTE on their board) and its layout COMBAT
  TWO's.
- The crowd at a town's gate still covers most of a camp at the opening zoom (LIFE+CITY's people at their size, rule 21).
