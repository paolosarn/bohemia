# COOK FIVE: SHARK REEF, CHANNEL 8 AND THE UNEMPLOYMENT OFFICE WEAR THEIR OWN PIECE (11/18/26)

The coordinator's routine 'COOK FIVE next' (VAMILY rules 453, 441, 408, 409(c), 455): 'take the next jobs on your own list,
one build each: finished art wherever a card still says STAND-IN; every picture lands light'. BUILD 11/18h - SHARK REEF, CHANNEL 8 AND THE LINE. The second job on this
lane's list (its handoff): the real places left in kit art, the Strip's side first.

## WHAT THIS IS
Three more of the eighteen real places (records/target/bb/real_places.json) wore the kit art of the kind each is like: SHARK
REEF a resort like any resort, CHANNEL 8 a radio station like any radio station, the UNEMPLOYMENT OFFICE a library like any
library. Each has its own piece on the map now, through the map's rig, in the same frame as the seven before it, drawn on
its block by slices/bohemia_place_pieces.js (NO CODE in this build: three entries in slices/place_pieces/place_pieces.json
and six pictures). What each shows is what WORLD's own list says of it:

SHARK REEF (the aquarium at the Strip's south end; 'nobody fed the big tank since the power went ... now there are four
sharks and they are very big'): the bay's gold glass tower behind it, dead, panes gone; at its foot the reef's hall, and the
roof light over the big tank with its glass gone: two bare ribs, one fallen in half way, one pane left white with dust, and
under them the dark water. A grey fin on the canopy over the door; the name's letters, two missing. The ones who live there
camp on the forecourt ('people who will not go downstairs') round a fire, with a board somebody painted. On the beat: 'some
nights the emergency lights come on by themselves and you can see them going round and round': the tank lights green from
under, and a long pale shape is in it, with a smaller one deeper.

CHANNEL 8 (the valley's first television station, 1953): a low brick office wing with its ribbon of windows, the windowless
studio box with the 8 on its face, studio B to the front; the red and white mast with the lamps they hung down it ('nobody
has a TV, so we put the picture on the mast, the lights, and people read it from across the valley'); two dishes on the
roof and the big one on the lot; the generator on its trailer and its drums ('Thursdays, if the generator starts'); the
live truck on its rims, its own mast still up; and on the forecourt a camera on its tripod and a lamp on its stand, aimed at
an empty chair. The night crew at the door. On the beat: the mast's lamps, one set then the other; and studio B's window
comes on cold ('sometimes the camera in studio B comes on by itself and there is somebody at the desk we don't know').

THE UNEMPLOYMENT OFFICE (the state's job office on Maryland Parkway): a low tan office, its band of windows dark, its doors
open on the dark, the state's name on the parapet with letters gone, a vending machine on its face. And THE LINE ('the line
never went home ... ten years of standing'): twenty-eight people from the door along the front, down the side, along the
kerb and up the far side, some sat on crates, a jug of water at their feet, and two places held by a bag whose owner has not
come back. The bus stop's bench is empty: nobody sits out of the line. Over the door the board still says NOW SERVING, the
one thing lit ('nobody is behind the window'). On the beat: that board, and one cigarette in the line.

The folder is 249,754 bytes now (twenty lossless WebP pictures and the list). Ten of the eighteen real places have their own
piece.

## WHAT WAS TRIED AND THROWN OUT (so nobody redoes it)
THE TANK AS A SMALL POOL IN A LOW HALL read as a grid on a roof: the hall is most of the block now and the roof light most
of the hall. THE WATER HIGH IN THE HALL came out pale grey: the map's rig dusts every flat top pale unless it is dark and
at grade (the rule that keeps a road dark). THE WATER AT 0.04 came out as paving: the factory's pad under every piece has
its top at 0.05 (measured), so anything flat on the ground starts at 0.06. FIVE RIBS BY FOUR cut the long pale shape into
a row of dots: two ribs by one. THE SHAPE AT ANY HEADING was short: at 45 degrees to the block it lies level across the
picture and its whole length shows.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_the_place_pieces_on_the_page_11_17_26.js on the demo, upright and sideways, the crew sent by the map's own
travelTo to six blocks from each:
- upright 390 x 844: the module loaded with ten pictures, 15 real places seated; a block 18 points; SHARK REEF at block 42,64 drawn 51 x 57 points,
  CHANNEL 8 at 38,44 drawn 51 x 52, the UNEMPLOYMENT OFFICE at 37,38 drawn 51 x 50; with the pieces switched off 0 drawn, with them on 9 on the shot;
  0 errors.
- on its side 844 x 390: the same three, 51 points wide each (7, 9 and 10 pieces on the shot), 0 errors.
- (the crew stopped one block short of where it was sent beside Shark Reef and the office; the piece is whole on each shot.)
Gate THE PLACES WEAR THEIR OWN PIECE 8/0 with all ten places (no place heavier than 30,000 bytes for its two frames).

## REFERENCE CHECK (compared to the world before calling it done)
A late-1990s resort tower (a slab of gold mirror glass in floor bands) with an aquarium hall off its foot (a big tank under
a framed roof light); a 1950s local television station (a low brick office wing, a tall windowless studio box, a red and
white lattice mast, satellite dishes, a live truck with a telescoping mast); a state employment office in a low stuccoed
building (a band of windows, a ticket board over the counter, a queue held by rope posts). The twins: this lane's seven
earlier places (the same frame, rig and draw), and the kit's resort, radio and library blocks beside them on the map (the
card shows each before and now).

[analog horror: a tank nobody feeds whose lights come on by themselves; a camera aimed at an empty chair; a line that has
stood ten years for a window nobody is behind]
[bb Battle Brothers' map: a place worth the walk is told from a village at a glance: a lit pool, a striped mast and a
line of people are three glances]

## THE TOOLS
tools/bohemia_cook5_the_strips_three_wear_their_own_piece_11_18_26.py   scenes | render | finish | sheet <shots>
  (three scenes and three beats ON tools/bohemia_cook5_the_places_wear_their_own_piece_11_17_26.py and the downtown tool)
tools/bohemia_the_place_pieces_on_the_page_11_17_26.js <outdir> [phone_portrait|phone_landscape] [id,id]

## NOT DONE, SAID PLAINLY
1. A piece is 51 points wide on his phone at the map's travel zoom: the shark is a fleck there and a fish only when he
   pinches in. What reads from far is the pool going green, the striped mast, the ring of people.
2. Arriving at any of the ten still opens the generic screen of its tier (the screen's pictures are keyed by faction, not
   by place: the screen's lane).
3. Eight real places wear their kit art still (the lab, the two power stations, the animal shelter, the two home centers,
   the ranch, Callville Bay).
4. Shark Reef's tower is a plain gold slab, not the bay's own three-winged shape; no name of the resort is on it.

VOTE: cook5-the-strips-three-11-18 (MADE FROM arena2-the-pit-is-a-pit-11-7).
