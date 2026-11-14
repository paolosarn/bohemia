# COOK FIVE: THE GATE, THE MINE AND THE NAILS, FINISHED (11/14/26)

The coordinator's turn-up round, job 2 (VAMILY rules 447 and 441): 'finished art where this round's VOTE cards still say
STAND-IN and he will meet it first: the three new bosses' map changes (the Locksmith's gates, the Charge's mines, the
Machinist's nails)'. BUILD 11/14y - THE GATE, THE MINE AND THE NAILS. Shipped after the ceilings (rule 451(a)), which his vote put first.

## WHAT THIS IS
BOSSES built what the ladder's 7th, 8th and 9th do to the map and painted a first piece for each
(tools/bohemia_bosses_seven_to_nine_places_11_11_26.py), through the map's rig; its three VOTE cards say STAND-IN, and he
voted YES on all three. This is the production artist's pass on the SAME seven pictures (fourteen files, two beat frames
each): the same file names, the same frame (THE NEXT THREE's, one street block across), the same rig. PICTURES ONLY: none of
BOSSES' code or rules is edited; its tool is imported for its capture, render and colours. In slices/boss_places/
boss_places.json only these seven entries' own measurements are rewritten, the way BOSSES' own finish() writes them, and each
is marked 'finished'.

A piece is one block across on the map: 116 picture pixels, about nine pixels a metre. Anything under a third of a metre is
nothing, so every part was drawn to be read at that size.

| piece | the first one | finished |
|---|---|---|
| THE LOCKSMITH'S GATE, shut (night) | two grey cards between two posts, a dark knot for the chain | two FRAMED chain-link panels (frame, mid rail, brace), razor wire along the top, concrete feet, his chain and a brass padlock, his KEY painted on a board, a RED LAMP on the post that is lit only while the street is shut |
| open (day) | the cards swung to the kerbs | the framed panels swung back, the board still on one, the chain hanging off the post with the padlock on its end, the lamp dark |
| after he falls | a pale rectangle on the street | one panel down flat and bent, its frame and brace on it, the post cut, the lamp in the road, the chain in two, the bolt cutters left where they did it |
| THE CHARGE'S MINE, spotted | a brown square with a disc on it, a stake | dug dirt of the wrong colour in three spade-loads, the paler mound over the can, clods, his stake and a torn red rag, a red wire to the kerb |
| dug out | a square with a dark disc, a can | the hole and the dirt thrown out of it, the spoil heap with the spade stood in it, the can out with its lid off and its wires cut, the stake thrown down |
| THE MACHINIST'S NAILS | grey specks and a tyre | nails in bands kerb to kerb, his welded caltrops big and pale enough to see, a shredded tyre and a strip of it, a cart's wheel that came off here, a dropped sack |
| swept | two hairlines, a bucket | two clean cart tracks on swept asphalt, the swept heap at the kerb, the broom leaning on the bucket of nails |

The fourteen files: 105,736 bytes (the first ones were 60,556). The published set measured 836 MB of 900 before this ship.

## WHAT WAS TRIED AND THROWN OUT
1. A WHOLE HANDCART down on its axle in the nails. Right in the tool; on the map the piece is laid on EVERY nailed block, so
   it was the same cart a dozen times round his shop. Out: what is his and belongs on every block stays big (the caltrops),
   what happened once stays small (a wheel, a sack).
2. HEAPS WITH PALE TOPS AND DARK SIDES: the mine's mound read as a target, rings on rings. A heap's shaded side is now near
   its top's tone.
3. THE SWEPT STREET as two pale bands: read as painted lane stripes. Swept asphalt is a little paler than the street, never paint.
4. A PINK LAMP: the first glow was pale orange at its middle. Found by the new gate's own leg, not by eye. Red now.

## PROOF (rule 441: on the real surface)
BOSSES' own page tool (tools/bohemia_bosses_vote_the_change_11_9_26.js, the game's camera on a phone, 390 x 844, the demo: a
new game, the bosses before him felled through the map's own door, then his own kill's beat) run for THE LOCKSMITH, THE
CHARGE and THE MACHINIST with these pictures in: each beat played whole (before, the tape, after), the pieces are on the map
in both states, no error. On the VOTE card's picture: the three before over the three after.
BOSSES' gate THE LOCKSMITH CHANGES THE MAP with these pictures in: the alpha on its side 21 of 21; the demo upright 17 of
17 (K1 his gates painted and open by day, K2 chained at night, C1b painted cut, and the rest) before this machine's
10-minute limit stopped the run, twice at the limit, never red on a leg. Said plainly: its last four upright legs (the save
reopened, nothing threw, the buttons) were not reached here; the same four passed on the alpha.

Gate THE BOSSES' MAP PIECES ARE FINISHED 7/0, new, registered (B1 the seven entries finished and their fourteen files;
B2 ONE BOX A PIECE: every state the same size and anchor, since the map swaps one for another in place; B3 THE BEAT: the
lamp, the rag and the caltrops move between the two frames, nothing else does; B4 IT IS THERE: 5 to 13 in 100 of its box,
70 to 135 steps of tone; B5 THE LAMP IS LIT WHILE THE STREET IS SHUT: 12 red pixels at night, 0 by day; B6 light, no
purple; P1 planted: another anchor, a frame copied over its twin, a piece wiped to four dots: each red).

## REFERENCE CHECK (compared to the world before calling it done)
A construction site's chain-link swing gate (a tube frame with a mid rail and a diagonal brace, mesh inside it, concertina
wire on top, precast feet, a 13 mm chain and a laminated padlock, a red battery hazard lamp on the post). A buried
improvised charge as the people who clear them describe it (disturbed soil of another colour, a marker stick, a command wire
to the roadside; cleared: the hole, the spoil, the container out and its wires cut). Road caltrops welded from four points
of rebar, the shredded carcass of a truck tyre; a street swept by hand (a heap at the kerb, a push broom, a bucket).
The twins: BOSSES' own seven at the same scale, side by side on the card.

[analog horror: a red lamp that is only lit while the street is locked; a rag on a stick over dirt of the wrong colour; a
wheel and a dropped sack in a street of nails, and nobody]
[bb Battle Brothers marks what blocks a road with one plain object you read from far off (a palisade, a cart, a camp's
stakes); each of these three is one object first and its detail second]

## THE TOOL
tools/bohemia_cook5_the_bosses_map_pieces_finished_11_14_26.py   scenes | render (BOHEMIA_BPY=<venv>/bin/python) | finish | sheet <before_dir> [page.png]

## NOT DONE, SAID PLAINLY
1. The other pictures of these three bosses (the lock shop, the powder yard, the pipe shop, the cut lock, the rubble, the
   welding bench) are BOSSES' first paintings still. The order named the map changes.
2. After the Machinist falls his swept streets are not drawn piece by piece on the map (BOSSES' draw: the street becomes his
   carts' road): the swept piece is seen in the kill's tape and on the card.
3. The bus yard and the greenhouses (WORLD 14's card says stand-in) are not started: the next batch.

VOTE: cook5-the-bosses-map-pieces-11-14 (MADE FROM arena2-the-pit-is-a-pit-11-7).
