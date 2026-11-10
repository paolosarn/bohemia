# WORLD THIRTEEN, ROUND TWO: THE VALLEY HAS ITS ZONES, AND EVERY WORKS BLOCK ITS DRIVE (11/10/26)

VAMILY rules 429(g)(h)(f)(b), 430; ask lines 508, 509, 507, 505. BUILD 11/10c - THE VALLEY HAS ITS ZONES.

Paolo 11/7: 'not every part of town is gonna be this suburb shit... where there's more desert landscape, where there's more
industrial or building going on... some sort of smart system'; 'every building needs to have a road on it... a building needs to be
part of whatever road network you want there to be'. The coordinator's routine (11/10): ship what is ready, in order: (1) the zones,
(2) the table, (3) the templates, (4) the cut.

## 1. MEASURED FIRST (22 seeds, tools/bohemia_world_thirteen_zones_measure.js, committed 11/7 49bc7f24)

Every zone was on the map but out of the real valley's balance: houses 29.2 to 30.7 in 100 blocks, mile streets 25.5 to 27.9,
open land 18.8 to 20.9, transport 12.1 to 13.2, commercial 3.6 to 4.3, the Strip 2.3 to 2.4, green 1.3 to 1.9, water 0.8 to 1.0,
INDUSTRY 0.6 TO 0.8 (scattered single blocks: the generator's two industrial parks were a radius of 3.2 blocks and only on blocks
touching a mile street; 2,328 house blocks touched a works block, 6 sat inside the works), civic 0.4 to 0.6, downtown 0.3 to 0.4,
THE CHEAP EDGE (trailer parks, swap meets) 0.2 TO 0.3.

## 2. THE LAND-USE LAYER

`records/target/bb/land_use.json`, a modder's file: twelve zones (the Strip, downtown, industry, transport, the mile streets, the
suburbs, the cheap edge, commercial, civic, green, open, water), each its district kinds, its share of the valley (a range the gate
holds on 22 seeds), and its street pattern in words; the industry corridor and parks; the cheap edge; four rules. The generator
carries the numbers word for word (`tools/bohemia_world_thirteen_land_use_sync.js`).

THE PASS (`landUse` in engine/bohemia_overmap.js, `__THE_VALLEY_HAS_ITS_ZONES__`): the districts are laid exactly as before (no roll
moves), then zoned the way the real valley is zoned:
1. THE WORKS: every tract, apartment, shop or vacant block within 3 of the rail between the freeway's bends (the real Industrial
   Road and the UP yards) and inside the generator's own two industrial parks grown to a radius of 5.5 becomes industrial (50 in 100),
   warehouse (35) or storage (15) by its own roll; 12 in 100 stay as they were (the blend).
2. NO HOUSE INSIDE THE WORKS: a house block with five or more of its eight neighbours works is taken in, again until none.
3. THE SEAM: an estate or a gated tract never touches the works: the works block beside one becomes shops.
4. THE CHEAP EDGE: a tract block beside the works, the freeway or the rail turns trailer park at 12 in 100.
Fixed blocks (landmarks, mile streets, the real places) are never touched; the real places take their seats after, on the zoned ground.

MEASURED AFTER (22 seeds): industry 2.8 to 3.4 in 100 blocks in zones (at least 91 in 100 works blocks touch another), the cheap edge
0.7 to 1.0, houses 26.6 to 28.1; no house inside the works, no estate by the works; every zone inside its range on every seed.

## 3. EVERY WORKS BLOCK ON THE ROAD NETWORK (429(h))

The street pass (`houseLanes`) lays a works block's TRUCK DRIVE the same way as a house street: down its middle (one fight tile, a
gutter each side, no sidewalk, trailers and containers left on it), joined to a mile street straight on or as a T; the painter stands
a shed each side on its yard with its loading docks on the drive; where a drive ends unjoined, it ends in a CONTAINER YARD stacked
two high (a dead-end drive in the works ends at a yard, never an empty turnaround). 5,420 works blocks on 22 seeds, every one with its
drive, every one in a lump on a mile street joined to it. On 10 fight boards cut at the works, 208 of 208 sheds have a street tile at
their front.

CROSS STREETS (423(b)): with every house on its street, two house blocks side by side were two rows of houses back to back, a wall
between two streets on an undressed board (COMBAT TWO's board gate M4 caught it: the bare suburb board could not join the two sides).
Now every third block along, a short cross street runs from one street to the next through one lot of each row: a tract is a grid
you can cross, the real valley's way.

## 4. THE TABLE (429(b), extended)

Every map kind's row carries its zone (`zone`, from the land-use file; the fight knows if it is in the works, a tract, the Strip or
the open desert). Gate F14.

## 5. THE MAP PAGE CARRIES THE WHOLE GENERATOR

Found this round: since 11/7 the map page carried the generator from before the pocket-track fix (only the engine file had it): a hand
replace moved part of it, and the map joins gate compares the first and last few thousand characters only. Now
`tools/bohemia_world_thirteen_inline_generator.py` puts the whole engine file into the page, and the zones gate's Z5 holds the whole
of it word for word.

## 6. THE PAINTING

Apartments: most of the valley's garden apartments are flat tar roofs, their parapets and walls weathered grey block (rule 159:
concrete gone grey); with every block on its street, an apartment block's walls (69 in 100 of its pixels on the painting) had read
too close to the houses and the trailers (THE MAP STANDS UP D1, the closest two 8.1 and 9.1 apart against 10); now 68,67,64 against
the houses' 83,76,74 and the trailers' 89,87,85.

## 7. GATES

- NEW `gates/the_valley_has_its_zones_gate.js` 9/0: Z1 every zone on every valley; Z2 every share in range; Z3 the neighbour rules;
  Z4 every works block's drive joined; Z5 the numbers and the whole generator in the page; Z6 PLANTED FAIL (the works put back as
  tracts, a tract inside the works, an estate by the works, a drive taken away: each red); P1 the painter paints the drives and the
  sheds; P2 every shed on the fight boards at the works has a street at its front; P3 nothing threw.
- the_map_kinds_have_fight_answers 17/0 (F14 the zones); a_street_in_front_of_every_house 10/0 (its walk now goes through the works'
  drives too: a house street can join the mile streets through one); the_board_is_the_city_at_that_spot 193/0 (its truth reads the
  works' drives and the container yards off the generator's byte); the_map_stands_up 13/0; the_first_boss_changes_the_map 18/0;
  landlocked 16/0; street_connectivity 12/0; map_density 13/0; district_taxonomy 6/0; map_joins 23/0. Run alone (ten browsers at
  once had timed some of them out: a pinch that never zoomed, a worker taking 31 s): bosses_act_one 109/0, home_base 78/0,
  the_far_end_is_painted 11/0, the_houses_stand_up_close 28/0, the_map_streets_join 6/0, the_missing_real_places 16/0.
- NAMED FOR COMBAT TWO, not hidden: the_board_is_the_city_at_that_spot is 193/0 alone and was 193/0 under a second browser once and
  190/2 once (S1 at an industrial spot 136/148, K1 at seed 7's Strip spot blockers 107 to 67): the reds move with load, never with
  the code; the gate re-rolls valleys inside the page while its frame loop runs, a likely cause not yet proven. Main's own run alone
  194/0 (the count is one lower here because one leg runs only where a spot's board holds houses).

## 8. NEXT

(3) the 15 place boards (fight_ground.json boards place_*) as TEMPLATES the generator places wherever that kind of place lands, every
asset kept (rule 430): the template format first. (4) the cut, with COMBAT TWO: its lay() still makes six map houses in seven solid
walls; the table says every house is a tile a man can be on (423(c)); one marked line there reads `BohemiaFightKinds.roofOK`.

[bb] Battle Brothers' world has its regions, each with its own settlements; ours zones one valley the way its county did.
[analog horror] the works by the tracks, every gate chained, a hundred trailers by the freeway with their lights out.
