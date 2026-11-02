# CHARACTER [hair three]: TWELVE MORE HAIRCUTS, EIGHT MORE HEADS, AND THE CROWD WEARS THEM (11/3/26)

THE ASK (his votes, sent by the coordinator 11/3): 'need more, way more facial customization, hair options as well'; 'we need way
more hairstyles and head shapes, look how Battle Brothers does it'; 'can we make more hairstyles that I can approve of,
immediately'; 'what's up with the Chinese hats and the weird hats on these people, give them hairstyles'; 'make sure shit
doesn't clip'; 'the bright colours not so bright'; 11/2 'more clothing, more weapons, the whole package' (rule 302, row 289).

TAB: the towns (tap any place on the MAP: the street's crowd), the hall's cards and the crew's faces in the demo; the sheets are
NOT IN A TAB YET (records/target/character/CHARACTER_HAIR_THREE.png, CHARACTER_FACES_TWO_SHAPES.png,
CHARACTER_HAIR_THREE_THE_CROWD.png).

## 1. MEASURED FIRST (the 3D rig, before this round)
- HAIRCUTS on the 3D head: 23 made (3 barber + 8 HAIR 1 + 12 HAIR 2), 2 held (ROPE LOCKS, HEAVY FRINGE), so 21 in play.
- HEAD SHAPES: 13 (the starred face + 12, FACES 1), on 14 face dials. BEARDS 11 (+ none), MARKS 8, HATS 21, FACE PIECES 14.
- CLOTHES per slot (the book): 77 tops, 70 coats, 45 trousers, 40 shoes, 68 kit pieces (bags, capes, scarves, belts, gloves).
- THE VALLEY'S PEOPLE: 156 rolled people wore 21 cuts; three cuts sat on 12 people each (RAZOR SKULL, BOX BRAIDS, HALF SHAVE).
- A CROWD OF 40 (dealt the way the game deals one, 200 places): 18.1 different cuts, 21.9 heads repeating a cut already on
  the street, up to 5.0 heads on one cut, 2.6 hats.
- THE TOWNS AT PHONE SIZE (390x844, the settlement screen the demo opens, market day): NELLIS GATE 31 people, 17 cuts, 14
  repeated heads, 0 hats; THE WASH 29 people, 15 cuts, 14 repeated, 2 hats; HENDERSON 29 people, 15 cuts, 14 repeated, 1 hat.
- HATS: 9 of 156 rolled people wore a hat over their hair (knit caps). The rice-farmer hat and the wraps were already out of
  the roll (RUN TWO, 10/23) and are NOT drawn on any rolled person, measured on the renders: the Caravans' 'wears.head: CHINESE
  RICE FARMER HAT' in the mix is the outfit's list, not the picture (their heads show their cuts). Where he still meets the cone:
  the thirteen old gang looks (faction_<gang> sheets) that stand first in a band's pool on the map and the fight. NOTE RUN TWO.

## 2. WHAT SHIPPED
HAIR 3, twelve new cuts (tools/bohemia_character_hair_three.py; built on PORTRAIT's starred head, rendered through DIRECTION's
master rig, eight turns and the portrait off one model; Battle Brothers' range filled where ours had holes):
  WIDOW'S PEAK (receding), TONSURE (the Church's ring), HERMIT (bald top, long grey strings), WILD MANE (long, big, wavy),
  BOWL CUT (the home cut), CROPPED CURLS, MANGE (a buzz with bald patches), SALT SKULL (bald, grey stubble), TEMPLE BRAIDS
  (loose with two temple plaits), SLICK DRAPE (long, wet, combed back), FRENCH CROP (a blunt high fringe), RAZOR LINES.
  Cycle 2 on three after looking at all eight turns and the portrait: the mane's side locks hung onto the cheeks (rooted
  from 0.55 rad; now 0.90, behind the cheek line); the crop's eleven fringe tufts read as dark stitches (dropped, the shell's
  blunt edge is the fringe); the razor-lines top read as a knit cap (now thins to its line, the shave darker).
  NO GRAVEYARD SHAPE: no crest, no tie (ponytail, braided tail, top knot, low bun: Battle Brothers' 'tied' stays dead here),
  no mullet, no side part, no flat top, no pompadour, no chin bob, no afro by volume, no cornrows, no fade made of holes.
  MUTED: every colour a dark step of the style palette (black, brown, grey, sand, bleach); nothing bright.
FACES 2, eight more head shapes (tools/bohemia_character_faces_one.py NEW_SHAPES): PEAR, DIAMOND, BULLDOG, BIRD, SKULL, BABY
  FACE, BOXER, WIDE MOUTH, the fourteen dials pushed to their ends in combinations the first twelve never reached. The book now
  holds 33 cuts and 21 head shapes (records/target/character/BOHEMIA_THE_BARBERS_BOOK.json, 6,586,272 heads).
THE CROWD (tools/bohemia_character_hair_three_recut.py, then RUN TWO's own batch, bake and index, unedited): the people past six
  on one cut re-cut onto the new twelve (his gang's cuts first, the emptiest first), every other one of them given a new head
  shape, everything else about each person kept; the hats off all but 3 knit caps on shaved heads. 43 people re-rendered
  (walk, stand, portrait and the four talking mouths, from the same roll line: one id, one whole person).

## 3. AFTER
- THE VALLEY'S PEOPLE: 156 people now wear 33 cuts; the most on one cut is 7 (was 12). Hats on 4 (was 9): three knit caps on
  shaved heads, and church_1's cap kept because he stands on the fight's board, whose sheets are packed off COMBAT's renders
  (not on this box; repacking here would drop everybody else's), so his street body keeps the cap his fight sheet wears.
- A CROWD OF 40 (the same 200 places): 24.3 different cuts (was 18.1), 15.7 repeated heads (was 21.9), at most 3.6 on one cut
  (was 5.0), 1.1 hats (was 2.6).
- THE TOWNS AT PHONE SIZE, market day: NELLIS GATE 31 people, 21 cuts (was 17), 10 repeated (was 14), 0 hats; THE WASH 29, 20
  cuts (was 15), 9 repeated (was 14), 0 hats (was 2); HENDERSON 29, 18 cuts (was 15), 11 repeated (was 14), 1 hat.
  Picture: records/target/character/CHARACTER_HAIR_THREE_THE_CROWD.png (before left, after right).
- 43 people re-rendered: 42 re-cut (22 of them on a new head shape), the rest the hat off; three built in the minute before
  the cycle-2 fixes were built again. Who changed and why: records/target/character/BOHEMIA_HAIR_THREE_THE_CROWD.json.
- THE HIRE CARDS AND YOUR CREW: unchanged this round (they stand on the fight's board; see section 4).

## 4. NAMED, NOT DONE
- CLOTHES (the brief's third item, row 289): not this round. Every top and coat on the 3D man is read off the alpha's 2D
  wardrobe bank, so a new piece is a new bank entry AND its 3D build; 77/70/45/40/68 pieces exist and the crowd wears 57 tops
  and 42 coats of them. Next round: fifteen new shapes (not recolours) across tops, coats and kit, through the same chain.
- THE BARBER'S SHELF in the demo still opens the alpha's 2D face maker (12 cuts); the 33 cuts on the 3D head reach the crowd,
  the hall and the faces, but a player cannot yet put one on his own man (his body is a separate render per cut). Next round.
- NEW DIALS: the 14 dials are PORTRAIT's and the alpha's FACE_SLIDERS, clamped to the 2D panel's ranges; real new dials (nose
  length, ear size, cheekbone height, skull width) need both. FACES 2 pushes the 14 to their ends instead.
- THE FIGHT BOARD'S PEOPLE (the hire cards, your crew): re-cutting them needs COMBAT's fight renders and its pack, which live
  only where COMBAT renders (records/target/combat/rig is not in the repo); next round re-cuts a dozen of the hall's men with it.
- The old gang looks (faction_<gang>) still wear their hats where a band's pool stands its first man as it was (RUN TWO's).

[bb Battle Brothers draws a brother's head as hair, beard and head from long lists, and age walks a man down the hair list:
grey, receding, bald. HAIR 3 gives our list its old men (WIDOW'S PEAK, SALT SKULL, HERMIT, TONSURE), its wild ones (WILD MANE,
TEMPLE BRAIDS) and its home cuts (BOWL, MANGE), so a crowd reads by age and by life, not only by gang colour.]
[analog horror: the mange, the hermit's strings, the scabbed and the scorched: a city where nobody can afford a barber and stress
takes the hair out in coins.]

GATES: green HAIR GATE 39/0, THE PORTRAIT HAIRCUT GATE 15/0, THE HAIR GRAVEYARD GATE 13/0, THE FACE IS HIS OWN FACE 18/0,
A FEW WOMEN AT THE POST, EVERY ORIGIN STARTS LIKE ITSELF 15/0, HER BODY 9/0, THE TOWN'S ACTIVITIES 22/0. NO TWO PEOPLE ALIKE
22/1: the one red leg (THE CREW SCREEN: a hired man wears his own face, '0 rolled faces of 0 on the line') is red the same way
on main without this round's changes; NOTE RUN TWO / UI.
