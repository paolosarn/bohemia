# A HOUSE IS ONE TILE -- COOK [tile options] round 2 (9/28/26)
# Rule 38, corrected the same hour: records/BOHEMIA_PAOLO_A_COMBAT_TILE_IS_A_HOUSE_I_READ_IT_BACKWARDS_9_28_26.md
# Tool: tools/bohemia_a_house_is_one_tile_cook_9_28_26.py
# Bank: banks/BOHEMIA_THE_HOUSE_TILE_9_28_26.txt
# Card: slices/vote/COOK_A_HOUSE_IS_ONE_TILE.png  (VOTE tab, the alpha)

## THE ASK, HIS WORDS
"In combat the boards and the tiles are like big as a city like parts of the city LIKE A HOUSE
IS ONE TILE and I've told you this millions of times... for the combat a tile is as big as a
house." Round 1 of this row drew a block out of one-metre tiles. That was the exploration
walk's scale and the walk is dead. Same question, right size.

## 1. MEASURING THE BOARD FIRST FOUND WHAT THIS ROUND IS ACTUALLY ABOUT
COMBAT's live board, out of their own gate (`gates/no_atari_gate.js`, asserted 10/0), not
guessed: **a tile is 12 metres, the man is 112 px at full detail, TILE_WIDE is 1.75, so a tile
is 196 px.** That is **16.3 pixels per metre**.

The walk's banks, which rule 38e says dress that tile, measured off his own drawing last round
(three sprites his 7/28 bank places, each with a real size): **42.9 pixels per metre.**

### THEY ARE 2.6 TIMES APART, AND NOBODY HAD PUT THE NUMBER ON IT
His words are "all the assets we were creating for the zoomed-in walk, even the sidewalk, are
going to be used for the combat." They cannot be PASTED on: his kerb arrives two and a half
times too big, and shrinking it to fit throws away 62% of the pixels he had just finished
telling us never to throw away. **That is the Atari complaint arriving from the other
direction.**

**So every tile here is drawn at his street's density (515 px for 12 m) and shown at the
board's (196 px).** The art keeps the pixels whatever the board decides to do with them, which
is the only arrangement where "no Atari" and "a tile is a house" are both true at once.

## 2. THE THREE OPTIONS, ONE HOUSE TILE AND ONE STREET TILE EACH
- **A -- DOWN AT AN ANGLE, ROOFS ON.** TG-02: roof planes first, then the front face. BB's own
  camera, and the one that makes rule 37g work ("high ground could mean a building with the
  roof that you can be on").
- **B -- STRAIGHT DOWN.** Roof planes and the yard ring from straight overhead.
- **C -- ACROSS.** The house front fills the tile, his 7/28 street's own look.

Each with four tiles at board size and **the 112 man standing on one**, because a tile only
means something beside the figure that stands on it. One of the four has its roof gone, so you
can see the slab inside.

## 3. THE STREET TILE IS A WHOLE STREET, MEASURED
At 12 m across: two 3.5 m lanes, a kerb and a 2 m sidewalk each side. That is a real
residential street's whole width, not a look. His road tiles, his sidewalk tiles, his own
`walk_kerb` on both sides (flipped on the far one so the lit lip faces the road, because the
sun is north-west). TG-04: the kerb is the street tile's strongest edge.

## 4. THE MAN IS DRAWN FOUR TIMES LIFE SIZE ON HIS OWN TILE
112 px on a 196 px tile is **57%** of it. A 1.75 m man on a 12 m house lot is really **15%**.
So he is **3.9 times** life size relative to his square. That is the board-game convention and
it is how Battle Brothers looks; it is COMBAT's number, not this lane's, and it is on the card
in those words so he can knock it down if it reads wrong.

*I wrote this guard expecting the man to be TALLER than a tile is wide, and it fired. He is
not. The guard now checks what is actually true (he reads as a figure on a square, between a
quarter and 85% of it) and reports the exaggeration, instead of asserting a direction I had
guessed.*

## 5. FLAGGED, NOT FIXED: TWO LIVE FILES DISAGREE
`engine/bohemia_combatfloor.js` refuses any plan whose tile is 112 px or more: *"a tile at or
above the sprite is a zoom IN, which is the opposite of the ruling."* The fight draws 196.
**Two live files carry opposite rules about the same thing.** The fight does not call that
floor today (only the city world does), so nothing is broken right now, but a contradiction
between two live files is a bug and not a reading (the truth hierarchy). **COMBAT's and
PLUMBER's, not mine to resolve.**

## 6. WHAT IS PROVED, NOT CLAIMED (each refuses the run)
- **NO ATARI**: every tile drawn at 42.9 px per metre, his own densest reading, re-derived
  from the three sprites in his bank at run time;
- **A TILE IS A HOUSE**: 12 m a tile, the house about 11 m of it, the yard the margin (TG-01);
- **EVERY PIXEL IS HIS**: nothing off his family ramps or his own tiles;
- **THE MAN READS AS A FIGURE ON A SQUARE**, and the exaggeration is measured and reported;
- **NOTHING IS STAMPED**: the four board tiles are four different pictures.

## 7. I WROTE THE SAME BUG TWICE AND ONLY LOOKING CAUGHT IT BOTH TIMES
Last round the shadow pass picked its ramp by ROW, so a grey concrete floor came out tan. This
round the first cut did it from the other end: it snapped the darkened pixel to the nearest
entry across EVERY ramp at once, so **his terracotta roof, shaded, landed on concrete grey and
the far roof plane came out as a grey band lying on an orange roof.** Same fault, new disguise,
green guards both times. A shadow darkens WITHIN ITS OWN FAMILY, and the family is now found
per colour.

**And the first cut of this round was not dressed with his art at all.** It drew flat
rectangles in his PALETTE and called that dressing. His colours are not his art, and that is
the same fault as last round's re-authoring wearing different clothes. Every surface is now
his own tiles, repeated with a variant rotation and a per-tile roll (a roll cannot add a
colour or move the light, because it is a translation). Material repeating every metre is not
wallpaper; it is what material does.

Also caught by a guard: two houses built from the same variant order came out byte-identical,
because the seed reached the roll but not the variant choice. A board of identical houses is
the no-stamp rule failing at tile scale.

## 8. THE ANALOG HORROR LINE (rule 20)
A whole house is one square now, and at that size the only thing you can read about it is
whether the roof is still on. Two of the four on the board have theirs. The one with its roof
gone is the one you can see inside, and there is nothing in it.

## 9. [bb the overworld is battle brothers] -- rule 33(f) and (j), volume cited
**reference/library/battle_brothers/02_COMBAT_RULES.md**, the BOARD line: *"hex tiles with
height levels; a fight is generated from the map terrain where it happens."* BB's board tile is
a piece of ground a man stands on, and its art is quieter than the man on purpose: the figure
is the thing you read, the tile is the thing you plan on. That is why the man being four times
life size on his square is correct here and not a defect.

**WHERE BB IS A STILL AND WE MOVE (rule 33g):** BB's tile is flat ground with a marker of
height, set before anyone steps on it. Ours is a HOUSE, so its height is a roof you climb onto
(rule 37g, his own up-vote), and the tile has to say from above whether that roof is still
there while a camera moves over it.

## 10. WHAT THIS DOES NOT DECIDE
Which camera is his pick. The board's 196 px and the 12 m tile are COMBAT's. What this settles
is that the tile ART is drawn at his street's density, and what each camera actually looks like
with his assets in it.

## 11. STILL OPEN ON THIS LANE
- the boot's heel question, on the WHICH WAY IS HE FACING card.
- landmarks still undrawn: luxor, springs, robofactory.
- the map at his density: the three he killed all need re-cooking, and that is a re-draw.
