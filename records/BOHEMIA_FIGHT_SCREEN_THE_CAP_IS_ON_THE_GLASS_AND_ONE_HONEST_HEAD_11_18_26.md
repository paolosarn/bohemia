# FIGHT SCREEN TWO: THE CAP IS ON THE GLASS, ONE HONEST HEAD (11/18/26) -- BUILD 11/18q - THE CAP IS ON THE GLASS, ONE HONEST HEAD

Ask rows 650 and 648, both FOUND BY EYES walking this lane's builds on a phone (records/BOHEMIA_EYES_WALK_THE_11_17_BUILDS_11_18_26.md).
One build, row 650 first (the coordinator promised him the flash never strobes, and it is a matter of people's eyes). VAMILY rules
450(c), 450(a), 441, 12; the law EVERYBODY HAS A FACE; WCAG 2.3.1 (three flashes or below).

## ROW 650: FOUR WHITE FLASHES IN ONE SECOND, THE PAGE'S OWN COUNT HOLDING NONE
EYES: two alpha AUTO fights (a street board at 2x, the works at 4x) each showed 4 flashes begin inside one second on the glass,
the closest two 233 ms apart, while the page's own count held none.

THE CAUSE, MEASURED AND REPRODUCED BEFORE A LINE WAS WRITTEN (rule 12):
- THE CAP COUNTED THE SCHEDULE, NOT THE GLASS. A shot's white was capped when the shot was SCHEDULED (the moment it would land),
  three inside any second of scheduled moments. The glass draws on its own frames. Four shots a third of a second apart are legal
  by the schedule (the fourth is 1002 ms after the first, so 'held' stays 0), but when the first frame is 90 ms late the first
  white is drawn late and all four BEGIN inside 933 ms on the glass. Reproduced on the fight's own page with the tool's eye on
  the glass: starts at 0, 400, 600, 933 ms; the page's count: 4 whites, 0 held. That is EYES' find to the letter.
- NOT the game's speed: the fight's clock is the real clock at every speed (a beat is 500, 250, 125 ms). It shows at 2x and 4x
  only because shots come closer together there, and under load (EYES had three browsers running) frames are late.
- A SECOND WHOLE-BOARD WHITE WAS NEVER COUNTED AT ALL: the vest's white (a cell vest going off: the whole board to 0.88) was
  drawn by another line with no cap and no soft setting.

THE FIX (slices/BOHEMIA_FIGHT.html __THE_CAP_IS_ON_THE_GLASS__, inside __EVERY_SHOT_IS_FELT__; records/target/bb/fight_shot.json):
- THE CAP IS WHERE THE WHITE IS DRAWN, ON THE DRAWN FRAME'S OWN CLOCK (glassMayBegin, asked by tickShot): a white BEGINS on the
  frame the glass gets whiter than it was the frame before; no more than three begin inside any 1100 ms of real time
  (glass_second_ms: a second and a tenth, the tenth so one late frame can never make a fourth), at any game speed, whoever
  fires. The schedule holds no cap any more: one place, as the coordinator asked.
- A white the glass will not take is never drawn; its barrel flash and its sound stay (he still sees and hears the shot).
- Whites that reach the glass on one frame are one flash; one that comes under a brighter standing white joins it.
- THE VEST'S WHITE ASKS THE SAME CAP (one marked line in drawSmoke), and is the soft share when FLASH is soft (it was full
  white for eyes that asked for soft).
- A SMALL MISS FIXED ON THE WAY: the drawer looked only at the last four scheduled whites, so a fifth scheduled ahead could
  push an earlier one out and it was never drawn. It reads them all now.

## ROW 648: THE FACE HAS A SEAM
EYES, on this lane's 11/17 answer to row 630 (a band opened in the gear over his eyes): 'the helmet is cut straight across above
the eyes and its brim floats across the nose and mouth; at the sheet's size RAUL is still a dome with a slit.' EYES was right:
a cut is a seam. THE CUT IS GONE. Nothing of the gear is cleared any more.

THE REAL CAUSE, MEASURED (the 11/17 record had only half of it): every head piece in the wear table was drawn alone on each of
the crew and read. CHARACTER's portrait pieces are WHOLE AND RIGHT (a dome with its brim, a coif with its face hole, a riot
helmet with a visor he is seen through, a mask). They were drawn for a head taller than it is wide (the model's). PORTRAIT's
cell is a head about as tall as it is wide, cut close. Stood on the middle of his head and sized to his head across
(engine/bohemia_wear.js face(), rule 272), a brim made for a tall head's brow lands a fifth of a head lower: on his eyes.
The lower edge of every piece, down the middle of his face, falls in three clear groups: hats end 0.20 to 0.47 of his head
under his eye line; a mouthpiece begins at his eyes; closed helms and full masks run past 0.59.

THE FIX (slices/bohemia_fight_face.js, rebuilt; this lane's own drawing only):
- A HAT (covers his eyes, ends above his mouth: 150 of 315 faces) is FITTED WHOLE: moved, and pressed no flatter than 60 parts
  in 100, so its brim's lower edge sits on his brow and its crown stands a little over his own. Pressing a brim that was drawn
  from above is turning it to the angle his face is seen from.
- A MASK that begins at his eyes (3) is moved down whole to begin under them.
- A FACE OF ITS OWN (a closed helm, a gas mask, a welding mask: 97) and an OPEN piece (a coif, a hood, a headband: 65) are left
  whole where the wear file puts them. A man in a closed helm has the helm for a face; that is honest.
- HIS EYE LINE IS READ OFF HIS OWN PICTURE (the dark row either side of his nose with skin over and under it), believed between
  44 and 57 parts in 100 of his head; otherwise the middle of PORTRAIT's cells. Read on all 315.
- THE PICTURE STILL STANDS BACK so the whole piece is in the frame. A fitted hat needs less room, so YOU and DESI are bigger
  than they were in the crew's hard hat (80 and 76 parts in 100, from 69). RAUL stays at 68: his hair is as wide as the cell,
  so his hat is the widest.
Nothing of the wear file, the gear's pictures or PORTRAIT's cells is edited.

SAID PLAINLY: RAUL reads as a man in a hard hat now (hat on his brow, eyes, nose and mouth under it), but he is still the
smallest of the three, and the hat on him is pressed the most (64 in 100). A head piece drawn for PORTRAIT's own head shape
would need no pressing. That is CHARACTER's and PORTRAIT's, routed below, as before.

## THE GATES
EVERY SHOT IS FELT (gates/every_shot_is_felt_gate.js, amended) 11/0: S6 THE GLASS ITSELF AT 1x, 2x AND 4x ON AUTO: three fights
side by side (the load EYES had), each read by the gate's own eye on every drawn frame (the white's real opacity and the TRUE
MEAN of the board's own pixels, by its own frame callback, never the page's count): in no second do more than three flashes begin.
A LESSON THE GATE TAUGHT ITS MAKER: its first eye read 64 points of the board, and a hit's camera kick moved those 64 points by a
tenth, so it called a kick a fourth flash twice. A kick is not a flash: the eye reads the mean of every pixel now (the board
halved and halved again), and three runs of three fights each then read 3 at most. Three older legs were also steadied (the fight
is live under the test's own shots; a white still on its way is counted as on its way).
S7 A LATE FRAME NEVER MAKES A FOURTH (the four shots above; fourteen shots a quarter second apart with the page stalling).
S8 THE VEST'S WHITE ASKS THE SAME CAP (read off the board's pixels) and is soft on FLASH: SOFT. S2 now fails a cap left on the
schedule and a whole-board fill it does not know. Planted: the cap taken out of the glass (four begin in a second on the glass).
THE FACE SHOWS UNDER THE HELMET (gates/the_face_shows_under_the_helmet_gate.js, rebuilt) 10/0: 3 crew x 105 head pieces = 315
faces: H1 his eyes read under a hat or over a mask; H2 NO SEAM: the gear as drawn has no cleared row its own picture does not
have, and this lane's file clears nothing; H3 inside the frame; H4 a bare head as before; H5 his sheet, the phone's card, the why
line; H6 a fitted hat's edge is on his brow, and the crew's own hard hat is such a hat on all three; H7 the gear is on him.
Planted twice: this lane's file left out (253 of 315 faces lose their eyes); a band cut out of the gear again (194 of 315 show
a cleared row their own picture does not have).

## ON THE PAGE HE PLAYS (rule 441(a); tools/bohemia_fight_screen_the_why_is_true.js with GLASS=<speed>)
The real page opened the way a stranger opens it, a band of six met through the map's own card, ENGAGED and FIGHT with a
finger, his man's card on the phone and his sheet opened with a finger, then AUTO and the speed button pressed with a finger and
the fight played to its end with the tool's own eye on the glass:
- THE ALPHA UPRIGHT AT 4x: 25 shots, 19 flashes begun on the glass, the most in any one second 3, the cap held 1.
- THE ALPHA ON ITS SIDE AT 2x: 19 shots, 18 begun, the most in a second 3, held 1.
- THE DEMO UPRIGHT AT 4x: 25 shots, 17 begun, the most in a second 3, held 0.
- THE DEMO ON ITS SIDE AT 2x: 16 shots, 15 begun, the most in a second 3, held 1.
The cap held a flash in three of the four fights: the case EYES caught is real on the page, and is stopped there. (These four
were read with the tool's first eye, the 64 points, which can only count too many; the tool carries the true-mean eye now.)
THE FACES, all four: the three of the crew in the hard hat, each fitted as a hat (RAUL: pressed 0.64, standing at 0.683),
15 to 21 faces framed a fight. 0 page errors on all four.

## ROUTED (proposals; the coordinator adds jobs)
- CHARACTER and PORTRAIT: the portrait head pieces are drawn for a tall head and PORTRAIT's heads are round; this lane fits them
  by moving and pressing. A sheet of pieces drawn on PORTRAIT's own head would need neither. The wear file also takes the WIDEST
  ROW as the middle of his head when the crown is on the cell's first row (every PORTRAIT cell), so a man with wide hair gets a
  bigger hat stood lower.
- COMBAT (the vest's white): it is capped and soft now through one marked line; its own look at full setting is unchanged.
- EYES: UI.glass on the fight's frame (began: the frame times of the last flashes; n; held); UI.shotSeen.held is now counted at
  the glass. BohemiaFightFace.said carries kind (hat, mask, open, face), sy (the press), lift, eye (his eye line in the frame).
  BohemiaFightFace.layer() hands the gear alone, as drawn and as the wear file draws it.

[bb Battle Brothers has no gun and no flash; its helmets are drawn on the face they were made for, so nothing is fitted. Ours fits a hat to a head it was not drawn for]
[analog horror: three camera flashes and then the fourth man fires in the dark; you hear him and see only his barrel]

*FIGHT SCREEN TWO, 11/18/26.*
