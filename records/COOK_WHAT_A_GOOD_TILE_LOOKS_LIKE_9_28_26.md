# WHAT A GOOD TILE LOOKS LIKE -- COOK [tile options] round 1 (9/28/26)
# Rule 37a (Paolo 9/27 in the vote tab): laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md s1
# Tool: tools/bohemia_what_a_good_tile_looks_like_cook_9_28_26.py
# Bank: banks/BOHEMIA_THE_BLOCK_THREE_WAYS_9_28_26.txt
# Card: slices/vote/COOK_WHAT_A_GOOD_TILE_LOOKS_LIKE.png  (VOTE tab, the alpha)

## THE ASK, HIS WORDS
On the coordinator's cell item: "Bro, I need you to present me options of what a house tile
street tile would look like using assets we already have. You wanna be stuck on this fucking
tile shit but I NEED TO SEE WHAT A GOOD TILE LOOKS LIKE FIRST OK."

## 1. THREE OF THIS LANE'S THINGS WENT DOWN IN THE SAME VOTE, ALL FOR ONE FAULT
- the map markers (9/24): "we cannot be obsessed with like making things that are like eight
  pixels tall, eight pixels wide, bro this isn't fucking Atari bro are you fucking for real?"
- the valley (9/27): "you don't have to be super addicted to like using the fewest amount of
  pixels possible... add more pixels to all the squares and shit so it reads like an actual
  map instead of some Atari bullshit."
- the road parties (9/27): "everything that you make has to be as many pixels as we have been
  doing for like the overworld roaming shit when it's zoomed in... you can't be fucking making
  me shit that's I could count the amount of pixels on one fucking hand."

Three rejections, one fault. Under STOP PRODUCING a second rejection ends a FEATURE; this is
not a feature, it is a CRAFT RULE he has now stated three times, and he gave the fix himself:
more pixels, at the zoomed-in roaming art's density or denser.

## 2. THE FIRST JOB WAS TO PUT A NUMBER ON "AS MANY PIXELS AS THE ROAMING ART"
### AND THE NUMBER IS NOT IN ANY FILE. IT IS IN HIS PICTURE.
The 7/28 bank's METHOD line says "1 px = 1.7 cm, because CELL_M = 0.75", which would make a
44 px tile 0.75 m and the art **58.7 px per metre**. That is the line this lane read last
round and built a whole card on.

**The drawing he approved says otherwise, and it says it three times.** The same bank records
where every sprite STANDS, in tile units, and three of those sprites have a real-world size:

    his drawn person   1.54 tiles tall  ->  a tile is 1.14 m if he is 1.75 m   38.6 px/m
    his drawn sedan    4.36 tiles long  ->  a tile is 1.03 m if it is 4.50 m   42.7 px/m
    his drawn door     2.00 tiles tall  ->  a tile is 1.02 m if it is 2.05 m   42.9 px/m

**A tile in the street he approved is ABOUT ONE METRE, not 0.75, and his art is about 39 to 43
pixels per metre.** The method line describes the scale the MATERIAL was authored at; the
layout is the thing he actually looked at and approved.

*This is the wrong-oracle fault again, instance nineteen, and it is mine from last round: I
read the comment in the file instead of measuring the picture the comment describes. The floor
in this tool is derived at run time from those three sprites, never typed.*

## 3. AND THAT MAKES HIS COMPLAINT EXACT INSTEAD OF VAGUE

    his approved street          39 to 43 px per metre
    the road party I drew         5 px per metre        EIGHT TIMES LESS
    the 32 px cell I shipped     42.7 px per metre      already at his density

The figure in the road party is **9 pixels tall with 28 lit pixels in the whole body**. "I
could count the amount of pixels on one fucking hand" is not an exaggeration, it is a
measurement, and he was right.

**AND THE THING HE KILLED WAS NEVER THE TILES.** All three down-votes are MAP art. The cell
tiles shipped last round were at his own density. What is eight times too thin is the map,
which is exactly what he said about the map on 9/24 ("the Battle Brothers map has way more
pixels than our map does... the map is gonna need a revamp"). The card carries the two figures
side by side at the same zoom so the gap is a picture, not a sentence.

## 4. THE THREE OPTIONS: ONE BLOCK, THREE CAMERAS, ALL HIS ART
Same house, same yard, same sidewalk, same road, same car in all three. The street band is
byte-identical across them (a guard proves it), so the only thing he is choosing between is
where he is standing.

- **A -- ACROSS THE STREET.** His 7/28 street exactly as he approved it: the ground you look
  across, the building standing up behind it, his own wall courses, his window, his boarded
  window, his two-tile door. Nothing touched.
- **B -- DOWN AT AN ANGLE, ROOFS ON.** The same block from above-at-an-angle. TG-02: "from
  above-at-an-angle a house is ROOF PLANES FIRST, then the front face." His bank already holds
  every piece (four hip corners, eave, ridge, slope, parapet, deck) and his own struct band
  already lays them out. This is Battle Brothers' own camera.
- **C -- STRAIGHT DOWN.** Roofless: wall caps round an inside floor, the door the one way
  through, the house throwing its shadow south-east. This is the FIGHT's ground (rule 38b).

Plus one house tile and one street tile out of each, at four times size, so he can count the
pixels himself. The street tile is the kerb in all three, because the kerb is the street's
strongest edge (TG-04).

## 5. WHAT IS PROVED, NOT CLAIMED (each refuses the run)
- **NO ATARI**: every option measured at 42.9 px per metre against a floor of 38.6, and the
  floor is re-derived from his own three sprites at run time;
- **EVERY PIXEL IS HIS**: no colour in any option is off his tiles or their family ramps,
  except the two accents his own car keeps, which is the bank's own rule in its own words;
- **THE SAME BLOCK, THREE CAMERAS**: the street band is byte-identical in all three;
- **A TILE IS NOT A STAMP**: no row of the street repeats one picture.

## 6. THREE THINGS THE LOOKING CAUGHT THAT THE GUARDS DID NOT
1. **A SHADOW DARKENS, IT DOES NOT RE-TINT.** Option C's shadow pass picked its ramp by ROW
   (ground above the sidewalk, concrete below), so the house's grey concrete floor, which sits
   above the sidewalk, got snapped onto the tan GROUND ramp and the whole inside came out the
   same beige as the walls. Every guard was green and the house had no inside. The ramp is
   chosen per cell from what that cell IS now.
2. **THE THREE OPTIONS RAN TOGETHER INTO ONE PICTURE.** Drawn edge to edge, the yard and road
   bands crossed all three and it read as a single wide street rather than three options. A
   hairline round each, and a gap.
3. **BOTH FIGURES AT THE SAME ZOOM, OR THE PICTURE ARGUES AGAINST THE NUMBER.** The first cut
   drew the thin figure at 5x and his own person at 2x, which made them nearly the same height
   on the page and hid the whole point of the comparison.

Also thrown out: a house tile crop taken from a fixed spot handed him a blank wall square and
a blank floor square. The tile shown has to be the one that MAKES the option what it is.

## 7. THE ANALOG HORROR LINE (rule 20)
The same empty block three ways. Looked at across, there is a lit doorway and nobody in it.
Looked at from above, the roof is whole and the windows are boarded. Looked at straight down,
the roof is gone and the floor inside is swept. Three cameras agree there is nobody home.

## 8. [bb the overworld is battle brothers] -- rule 33(f) and (j), volume cited
**reference/library/battle_brothers/10_UI_AND_FEEL.md and 02_COMBAT_RULES.md**, read first.
BB shows you a world map you never walk and a tactical board you do, and the two are drawn at
different densities on purpose: the board is where the pixels go, because it is where you look
closely and make decisions. That is exactly the split rule 38b just made for us, and it is why
these options are the fight's ground and the settlement screen's look rather than a walked
city. It also says where his "more pixels" belongs first: the map.

**WHERE BB IS A STILL AND WE MOVE (rule 33g):** BB's tactical board is generated flat and set
up before the turn starts, and nothing on it moves until a unit acts. Ours is a block you
ARRIVE in, so the same tiles have to hold up while a camera moves over them and a person walks
through the door, which is why option C carries the house's shadow and option B does not need
one.

## 9. WHAT THIS DOES NOT DECIDE
The pixel size of a cell is his pick, out of these options (DIRECTION's row [judge tile
options] and rule 37a). What this round settles is the DENSITY FLOOR, measured off his own
drawing, and what the three cameras actually look like with his assets in them. The cell
LIST for a block is WORLD + LIFE+CITY [tile options] / [honest grid]; this draws to that.

## 10. STILL OPEN ON THIS LANE
- the boot's heel question, on the WHICH WAY IS HE FACING card.
- landmarks still undrawn: luxor, springs, robofactory.
- the map at his density: the three he killed all need re-cooking at 39+ px per metre, which
  is [bb map art]'s next round and is much more than a re-scale.
