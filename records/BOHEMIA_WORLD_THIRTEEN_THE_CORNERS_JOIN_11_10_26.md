# WORLD THIRTEEN, ROUND THREE: THE CORNERS JOIN (11/10/26)

VAMILY rule 442(d) (the map's half; COMBAT TWO shipped the boards' half as BUILD 11/10f); ask line 547. BUILD 11/10j - THE CORNERS
JOIN. VOTE world13-the-corners-join-11-10 (stand_in, his phone's own pictures).

Paolo 11/9, his YES on a street at every house, with a note: 'you really need to make sure intersections, the sidewalk and the
streets continue looking good like they're supposed to'. The coordinator: on the MAP, where two roads meet, the asphalt, the lines,
the kerbs and the sidewalks join and turn the corner the way a real intersection does, at every zoom, in every zone, gated over 20+
seeds (planted: a sidewalk cut at a corner, red).

## 1. WHAT WAS WRONG (measured on main 74940d89 and after)

- THE MOUTHS: a house street or a works drive (11/7, 11/10c) ran out onto a mile street, and the mile street's sidewalk, gutter and
  kerb ran straight on across its end: on his phone at the street stop, a sidewalk strip across every side street (the VOTE card's
  first picture). 43,495 such mouths on 22 valleys, none opened. The mile street could not know: the street byte rode the house
  block only.
- THE T's (a neighbour's street coming in through one lot of a row, 423(b)'s cross streets): its roadway stopped at the gutter of
  the street it met, a kerb line across the T.
- THE WORKS DRIVES had no sidewalk at all, so a house street running on into the works lost its walk at the line.

## 2. THE FIX

- THE GENERATOR (`laneMouths` in engine/bohemia_overmap.js, inside houseLanes; the page carries the whole engine, re-inlined): the
  mile street's own byte carries the mouths, bits 16/32/64/128 a side street comes in from the north/east/south/west (a mile street
  has no house street of its own, so its byte was free). Re-read in the page after a home base's square takes its streets, and the
  squares cleared again after (a mouth never marked onto a mile street the town paints over: found by THE MAP STREETS JOIN's J1, 3
  sides on the boot valley).
- THE PAINTER (`__THE_CORNERS_JOIN__` in slices/BOHEMIA_CITY_WORLD.html, the road case): at a mouth the walk, the gutter, a lamp's
  post and pool, a sign's pylon open exactly as wide as the side street's roadway (4.55 to 7.45 q along the side, between its two
  sidewalks), its asphalt runs through to the mile street's lanes, a crosswalk painted across it, and the two sidewalks either side
  turn the corner into the mile street's walk. Only the walk opens, never the mile street's own lanes; a straight run opens its walk
  and gutter (1.3 q), the Strip its wide walk (1.9 q), a T's, a bend's or an end's walk as deep as it reaches.
- THE T's: the side street's roadway runs through the block's own sidewalk and gutter into its street; the sidewalks turn its corners.
  The same in the works.
- THE WORKS DRIVES: a sidewalk and a gutter each side, the same as a house street's (the trailers and containers still on the drive).

## 3. MEASURED AFTER

- 22 valleys (node): every open end of a house street or a works drive that meets a mile street or the Strip is marked on it, and
  every mark has its street: 43,495 mouths, 0 disagreeing blocks.
- 5 valleys in the page (the boot valley and four rebuilt), six tiles each (the four with the most mouths and T's, spread out, the
  two with the most works drives), at 12, 24 and 48 texels a block: 648 of 648 mouths with the asphalt through, 1,296 of 1,296
  corners walk to walk, 300 of 300 T's through, 600 of 600 T corners walk to walk, at every zoom. By zone: a house street onto a
  mile street 1,797 of 1,797, a works drive onto one 147 of 147, a T in the houses 867 of 867, a T in the works 33 of 33. The Strip:
  20 mouths in 6 valleys (the Strip is mostly casinos), none in the sampled tiles; C1 holds them.
- Planted: the mouths not opened (through 0%), a sidewalk cut at a corner, the opening too wide (corners 0%), a kerb left across a
  T (through 0%): each red.
- Close in (48 texels a block, four a q), the mile street's sidewalk joints (a side-colour line every q) sit on the corner's q; the
  gate reads the corners 0.2 q outside the opening, clear of them.

## 4. GATES

- NEW gates/the_corners_join_gate.js 7/0 (C1 to C6, C4b in every zone), in the suite as THE CORNERS JOIN.
- In the suite now too (written 11/7 to 11/10, never registered): THE MAP KINDS HAVE FIGHT ANSWERS 17/0, A STREET IN FRONT OF EVERY
  HOUSE 10/0, THE VALLEY HAS ITS ZONES 9/0.
- the_map_streets_join 6/0: its J1 (a side that meets a block is a kerb) reads the mouth bits now: a mouth is a join (it read the 1,932
  new openings as 'street lanes into a block'), and waits for the towns first.
- the_board_is_the_city_at_that_spot 193/0 (alone), the_map_stands_up 13/0, the_houses_stand_up_close 28/0, the_far_end_is_painted
  11/0, landlocked 16/0, map_joins 23/0, map_density 13/0, street_connectivity 12/0, district_taxonomy 6/0.
- the_first_boss_changes_the_map: its boss lands somewhere new every run (the gate sets no campaign code, so the start is
  Date.now ^ Math.random), and its G1 and C1b move with the place: main 3 of 3 G1 green (one C1b red on f03752fd), this build with
  the corners switched off 2 of 2, this build 1 of 6. Nothing his ground reads was changed (bossPlace, makeGround, cityRoute and
  cityWalkable's wraps, cityStepMins, freshStart read the map's kinds and the walk; the street bytes reach only the painter). Named
  for BOSSES with the numbers: pin the gate's campaign code so it measures one place every run.
- After the rebase onto 11/10f: COMBAT TWO's the_streets_join 13/0, every_building_on_the_road 9/0, home_base 86/0.

## 5. SEEN ON THE WAY, NOT THIS ROUND'S (named for COOK FOUR)

At the street stop an apartment block stands as a tall grey striped stack (the painter's slab at 2 to 3 storeys, no close-up model
yet), and the house models next door draw over it. On main before this round too (the before picture has it). COOK FOUR's row
already holds the 2 to 3 storey and works models; the occlusion (a model drawn over a taller painter block in front of it) is the
map houses' draw order.

## 6. NEXT

(3) the 15 place boards as templates the generator places (rule 430: every asset kept); (4) the cut, with COMBAT TWO.

[bb] Battle Brothers' world map never draws a street you can see the corner of; ours is a city at house scale, so its corners
are the real valley's: the kerb ramps, the crosswalk, the walk turning the corner.
[analog horror] every corner the same grey, the crosswalk worn to a ghost of itself, and a side street running back into houses
with no lights on.
