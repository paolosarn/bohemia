# THE TWENTY FACE PAIRS: THE TASTE SESSION FOR THE FACE (PORTRAIT 10/17/26, the big swing, rule 110)

Rule 110 (Paolo 10/16: '24 hours, take big swings, I can't check in every three minutes') put this on the lane's MODE
line: 'the twenty face pairs for his taste session (head only, head gear shown), ready to show the moment the moodboard
lands.' Rule 108 ROUND TWELVE (5): his eye used ONCE, as twenty pairs, each pair separating one choice that matters.
DIRECTION built the ground's twenty on 10/11 (records/BOHEMIA_THE_TASTE_SESSION_10_11_26.md); this is the face's
twenty, in the same shape, so one session reads the same way for both: THUMBS UP = THE LEFT PICTURE, DOWN = THE RIGHT.

## HOW IT IS MADE (so his tap is about one thing)
Two tools, nothing drawn (rule 108a: no chat draws a pixel or a curve in code).

1. tools/bohemia_cook_the_twenty_face_pairs.js renders twenty real people the game already draws, through the shipping
   faceFor()/renderFace() called unmodified at 64 x 64, head only (rule 37i), head gear wherever the person's spec
   carries it: the six brigand tiers with their faction look's hair (the over.hairName route [the enemy faces] built),
   the five keepers of THE WASH, NORTH LAS VEGAS (the id the settlement screen asks for), nine crowd citizens whose spec
   carries a durag or shades. It refuses to write if two renders of one person differ, if two people share a face, or if
   fewer than twelve of twenty show gear. MEASURED: 15 of 20 show gear (9 durags, 3 shades among the crowd; 3 durags
   and 1 shades among the tiers and keepers; 5 bare-headed). Each head is also rendered through three switches the
   renderer has carried since 9/24 to 9/30 (threeD, feat 1.2, brow -0.5), for the three pairs that ask about them.
2. tools/bohemia_portrait_taste_session.py makes each pair: THE SAME HEAD TWICE with ONE measured operation changed,
   the knob named exactly as DIRECTION's where it is the same knob (outline, colours, sat, value, warm, grit): a 1 or
   2 px dark ring round the person; a median cut to N colours with no dither; saturation scaled; value scaled; red and
   blue shifted; grime from his own pack_7 burnt-ground tiles on the person only (R10, never a noise layer); the
   renderer's blue-grey gradient swapped for one flat colour (nearly black, or the median of his pack_2 soil tiles,
   measured: 110, 91, 71); the far side of the person one step darker (light from the top-left, the card); the frame
   cut to the person plus 3 px; a whole-number zoom of 4 or 6; a renderer switch. Which side carries the change is
   seeded (the change sits on the right in 7 of the 13 pairs that have a shipping-face side, on the left in 6), so a
   lean cannot pass for a taste. Each sheet is 1080 px wide: both heads at one whole-number zoom (5x; the settlement
   screen draws the 64 px face at 72 px today, which is no face on a phone) AND the 1:1 head under each (rule 89).

The control is honest: for every pair that has a shipping-face side, that side is BYTE-IDENTICAL at 1:1 to the face
as it ships (checked by the tool, written in the key per pair). No pack twin exists for a character face (this lane's
count 16c80eb7, COOK's pixel sweep f3090598: a dozen faces in the bank, every one printed on a poster or banner), so
the pair's own unchanged side is the twin.

## THE TWENTY
| # | who | gear | the one question | UP (left) | DOWN (right) |
|---|---|---|---|---|---|
| 1 | citizen 105 | shades | A LINE ROUND THE HEAD? | no line, as it ships | a 1-pixel dark line |
| 2 | the poacher | none | HOW THICK A LINE? | a 1-pixel line | a 2-pixel line |
| 3 | the marksman | durag | HOW MANY COLOURS? | cut to 16 | every colour |
| 4 | the raider | durag | HOW MANY COLOURS? | every colour | cut to 32 |
| 5 | the leader | none | HOW MANY COLOURS? | 8 colours | 32 colours |
| 6 | the marauder | none | HOW STRONG THE COLOUR? | at 55% | as it ships |
| 7 | the smith | none | HOW STRONG THE COLOUR? | at 45% | at 80% |
| 8 | the armourer | durag | HOW DARK? | 70% as bright | as it ships |
| 9 | the barber | durag | HOW DARK? | 60% as bright | as it ships |
| 10 | the clinic | none | WARM OR COLD LIGHT? | warm | cold |
| 11 | the board | shades | WHAT IS BEHIND THE FACE? | the blue-grey fade | flat, nearly black |
| 12 | citizen 2 | durag | WHAT IS BEHIND THE FACE? | the colour of his dirt | the blue-grey fade |
| 13 | citizen 5 | shades | HOW DIRTY THE FACE? | grime from his burnt ground | clean |
| 14 | citizen 10 | shades | HOW DIRTY THE FACE? | heavy grime | a little grime |
| 15 | citizen 14 | durag | LIT FROM ONE SIDE OR FLAT? | flat | the far side darker |
| 16 | citizen 21 | durag | FLAT OR 3-D? | 3-D, a lit turned head | flat |
| 17 | citizen 35 | durag | HOW BIG THE FEATURES? | as they ship | 20% bigger |
| 18 | citizen 47 | durag | HOW MUCH ROOM ROUND THE HEAD? | the frame as it ships | cut to the head plus 3 |
| 19 | citizen 63 | durag | HOW BIG ON THE PHONE? | four pixels to one | six pixels to one |
| 20 | the thug | durag | AT REST: BLANK OR A LITTLE BROW? | the brow down a touch | the face at rest |

Files: records/target/taste/PORTRAIT_TASTE_01.webp .. _20.webp (lossless, 160 KB in all), the answer key
records/target/taste/PORTRAIT_TASTE_KEY.json, the heads records/target/taste/portrait_heads/ with PORTRAIT_HEADS.json,
and the twenty registry items ready in records/target/taste/PORTRAIT_TASTE_ITEMS_READY.json.

## WHAT HAPPENS TO HIS TAPS
The round his verdicts land, each axis's taps become one line in the skill file's section 9 beside DIRECTION's (one
rule per axis: line or no line and how thick; how many colours; colour strength; how dark; warm or cold; the room
behind the face; grime; the light's side; flat or 3-D; the features' size; the frame; the zoom; the face at rest).
Two pairs on one axis that disagree are a range, not a rule. A pair he skips is no rule. Nothing per face follows.
Where the face's knob is the same as the ground's (line, colours, sat, value, warm, grit), the two sessions are read
together: a face that agrees with its ground is one rule; one that disagrees is two, named.

## WHAT THIS IS NOT, NAMED HONESTLY
- The heads are PLACEHOLDERS (rule 108 ROUND THIRTEEN): the hand-coded renderer is what the moodboard and the camera
  route replace. The session does not ask him to like a face; it asks which way each knob goes, and the knobs outlive
  the renderer. 'Head gear shown' is the gear the spec carries today (one durag style, one shades style, read from the
  older NPC source that agrees with the walked body 59% of the time, [the real clothes reach the portrait] 10/10).
- Not in VOTE. Rule 82/87 holds every portrait sheet out of the tab until DIRECTION passes COOK THREE's, and the
  coordinator parked DIRECTION's own session until the moodboard lands (sweep AI). Same here: built, keyed, the twenty
  items written, and `python3 tools/bohemia_portrait_taste_session.py --register` appends them the round the
  coordinator says the moodboard landed (it stamps the sha and tells you to run the vote tab gate before pushing).
  The three verdict-free pairs he already half-ruled on were left out on purpose: head only versus a bust (his 9/27
  word, NOTES ARE RULINGS), gear shown or hidden (it must show), the eyes not all white (his 9/23 word, in).
- No look-fix loop log (rule 108 ROUND TWELVE (1)): the loop's scripts measure a tile against its family's card, and
  a face has no family card or pack twin yet; the pairs are one operation each on a shipping head, not a drawn asset.

## GATES
reference_check_gate.py 457 passed, 2 failed: the 2 are a COOK TWO tool and a COOK tool born without a block before this
round (bohemia_cook2_stretch_the_pack_recolour_10_16_26.py, bohemia_cook_the_real_height_range.js), not this lane's; both new
tools here carry the block and their rulers FACE-01/02/03 and AH-01 resolve. pages_publish_gate.js is red on main already
(609 MB against a 260 MB cap, PLUMBER [excavate]); this round adds 0.3 MB to records/target. vote_tab_gate.js 34/3, the 3 unchanged and not this lane's (a duplicated id across animation/ui/combat,
TUNING's four-sentence whys, COMBAT TWO's twinless sheet). Nothing in slices/, engine/ or the demo was touched
(rule 100a).

## [bb faces]
Battle Brothers asks no taste of its player: one painted bust per man, the same light, the same frame, and the
player learns the men by their faces over 450 hours. Our twenty pairs are the step BB never needed because one artist
drew every face; we have no one artist yet, so the rules come from his taps first, then one maker (the rig or the
model) draws every face by them. The lesson kept: once the rule is set, every face obeys it, no exceptions per face.
