# COOK SIX: THE TWO HOME CENTERS WEAR THEIR OWN PIECE (11/20/26)

COOK FIVE's list carried on by COOK SIX (VAMILY rule 461, THE WHOLE ENCHILADA; rules 453, 441, 408, 409(c), 455). BUILD
11/20i - THE HOME CENTERS, EAST AND WEST. COOK FIVE's next job after the stadium: 'the_home_center_east and the_home_center_west on the map (the last two of
the valley's fifteen)'.

## WHAT THIS IS
The valley's fifteen real places (records/target/bb/real_places.json, where 'valley') each wore the kit art of the kind it is
like until it got its own piece. Thirteen had theirs (COOK FIVE, 11/17 to 11/18). These are the last two: both HOME CENTERs,
the big-box hardware stores on a mile-street corner of each side of town, which wore the commercial kit art. No code: two
entries in slices/place_pieces/place_pieces.json and four lossless WebP pictures, drawn by slices/bohemia_place_pieces.js.
ONE BIG BOX, TWO STATES, each from what WORLD's own list says of it:

- THE HOME CENTER, EAST SIDE ('Everything with a plug went the first week, jefe... What's left is paint and doorknobs. A crew
  sleeps in the lumber aisle.'): the tilt-up box with its entrance gaping, the doors gone and the glass on the walk; the band
  where its name was, four of its letters gone; the lumber canopy stripped to its blue racks, one board left; a hole opened in
  the roof over the lumber aisle with the soot round it, and the crew's fire in it; the garden centre's shade cloth torn down
  over the dead plants in their pots, and the night manager among them; on the lot, the paint they could not eat poured out
  in pools of every colour a room can be, in front of the doors; doorknobs in their boxes kicked about; one sheet of plywood
  left, walked on; carts on their sides, a light pole down; one of the crew at the canopy.
  ON THE BEAT: the crew's fire through the roof and its smoke leaning, the night manager's lantern.
- THE HOME CENTER, WEST SIDE ('Thirty years I cut keys here. Nobody needs a key now, everything is open... The west side went
  slower than the east. There's still some in receiving, if you know where the dock door is.'): the same box, its doors
  standing open but whole, the band with one letter gone; the lumber canopy still stacked with plywood and two-by; carts in
  their corral; three cars that never left the lot; contractor bags tied by the doors; round the side the receiving dock: its
  step, three roll-up doors, one up with a pallet still in its wrap inside it, the key cutter in the next door's light, a
  trailer backed to the third, a forklift parked square.
  ON THE BEAT: his lantern, swinging, and the spark of the key machine he runs out of habit.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_the_place_pieces_on_the_page_11_17_26.js on the demo (a new game, the fog lifted as a checker measures the map, the
crew sent by the map's own travelTo to a block beside each store), the same frame shot with the pieces off and on:
- upright 390 x 844: the module loaded with fifteen pictures, 15 real places seated; a block 18 points; the EAST SIDE at block
  29,53 drawn 51 x 52 points, the WEST SIDE at 60,38 drawn 51 x 51; with the pieces off 0 drawn; no error.
- on its side 844 x 390: the same two, 51 points wide each; no error.
- (the crew stopped short of where it was sent both times, as with COOK FIVE's thirteen; each piece is whole on its shot.)
Gate THE PLACES WEAR THEIR OWN PIECE 8/0 with fifteen places, its page leg included: G2 both stores 51 points on the glass, G3
seen (58% and 53% of their rectangles another picture with them on). Its S3 caught the first cut of the west store: its two
beat frames differed by 5 pixels (the lantern and the spark too faint); now 53.
15 places, 365,516 bytes for all their frames; each store about 21,000 bytes for its two.

## REFERENCE CHECK (compared to the world before calling it done)
An American big-box home improvement store (a tilt-up concrete box on a mile-street corner, one tall entrance portal with a
canopy and a coloured band for the name; a garden centre fenced in chain-link under a shade-cloth roof; a lumber canopy at one
side over racks; a lot with cart corrals and tall light poles; a receiving dock round the side with roll-up doors at trailer
height and a trailer backed in); a store looted in a collapse (doors gone, the lot littered, what has no use poured out). The
twins: COOK FIVE's thirteen places (the same frame, rig and draw), and the kit's commercial blocks beside them on the map (the
card shows each before and now).

[analog horror: paint poured out on the lot in front of the doors, every colour a room can be, because it was the only thing
left; a key cut every night for a door that is always open]
[bb Battle Brothers' map: a place worth the walk is told from a village at a glance; two stores of one kind are told apart by
what happened to them]

## THE TOOLS
tools/bohemia_cook6_the_home_centers_wear_their_own_piece_11_20_26.py   scenes; render; finish; sheet
  (ON COOK FIVE's places tool, its downtown tool and its east-side tool)
FOUND ON THE WAY: the places' render skips a scene whose master is already on disk, so a changed scene renders the old
picture until its master is deleted (the second render of these two drew the first's, unchanged). Said here for whoever
renders a place again.

## NOT DONE, SAID PLAINLY
1. At the travel zoom a store is 51 points wide: the paint on the east lot is a few coloured flecks, the key cutter a speck,
   until he pinches in (the same as the thirteen).
2. The stores' own arrival screens are the screen's lane; the fight on their block deals the commercial kind's board.
3. THE REGION'S FOUR (TULE SPRINGS LAB, LENZIE STATION, SPRING MOUNTAIN RANCH, CALLVILLE BAY) wear the region's painted patch:
   measured this round (records/BOHEMIA_COOK_SIX_THE_STADIUM_11_20_26.md, NOT DONE 5), they need a wrap of the map's
   mapBaseDraw by name in this lane's own module and four scenes: the next build on this lane.

VOTE: cook6-the-home-centers-11-20 (MADE FROM arena2-the-pit-is-a-pit-11-7).
