# THE DEMO VERDICT: EVERY SCREEN A STRANGER MEETS (DIRECTION 10/9/26, row [the demo verdict])

Paolo 10/5: "everything is looking glitchy... vibe code dog shit" (rule 71: 'vibe coded' is a defect); the 9/20
law (analog horror for every pixel). EYES [a stranger's five minutes judged] was still OPEN, so this lane shot the
demo itself: tools/bohemia_direction_the_demo_verdict.js (+ .py), the one driver, 390 x 844 at 3x, BUILD 10/5g,
played the way a stranger plays it (wait on the title, NEW GAME, picks as they come, BEGIN, tap the nearest place,
the fight on AUTO, what comes after; a second session taps a settlement and waits to arrive).
Picture in VOTE: slices/vote/DIRECTION_THE_DEMO_EVERY_SCREEN.png. The tells list is AH-03 in the reference
library from this commit, so every cook's REFERENCE CHECK can cite it and reference_check_gate.py resolves it.

## THE NINE, TWO SENTENCES EACH (what is right, what is slop, what a painter would do; the owner)
1. **TITLE.** Right: power lines against a night sky with one lit window, and the menu as wood, paper and dark
   card, real materials. Slop: the logo is a gold-glitter stencil on a flat grey plate and the tagline a web chip,
   and CONTINUE says "NO RUN SAVED" in a game with no runs; a painter sets BOHEMIA in the institution's own
   letters on the night itself and says "nothing saved". UI, WORDS.
2. **PICKS.** Right: it is one screen, his 10/1 rule held, on paper cards with prepared names. Slop: a second
   screen is stapled under it (the loading list and a pale green BEGIN, #8fbf7e, off our register), the origin card
   is cut off on the right, and EASY sits in a green outline tag like a web form; a painter loads behind the picks
   and lets BEGIN be the paper's own stamp. UI, RUN.
3. **MAP.** Right: the parties are people, the lamps string the roads, the phone is a cracked phone. Slop: every
   lot is the same grey grit, so no block reads as a place, and the yellow name chips float; a painter gives each
   kind of lot its own ground (yard, slab, lot, roof) and writes the name on the place. COOK, RUN [map pixels].
4. **ARRIVED.** Right: travel works, the clock runs, the land at the edge (BLACK MOUNTAINS) shows. Slop: arriving
   opens nothing, the CUSTOM and CARTEL labels sit on each other, and the mountains at the edge are blown-up
   blocks; a painter makes arrival a place you are inside of. RUN, LIFE+CITY, UI.
5. **INTO THE FIGHT.** Slop, nothing right: for under a second a texture blown to screen size, a brown blob, fills
   the glass between the map and the fight (one game mode, no teleport, 9/21; R1). A painter cuts straight from the
   map's own frame to the board, or holds the map a beat and lets the board rise under the men. RUN, COMBAT.
6. **FIGHT.** Right: the floor is a street now (road, sidewalks, lots, orange roofs), the biggest gain since round
   21. Slop: the men are a tenth of a house on a board far bigger than the party (rules 66, 79), and a centred
   instruction box pops over the board (9/20: nothing pops up); a painter starts close on his men and lets the board
   fit the party. COMBAT, COMBAT TWO.
7. **FIGHT, ON AUTO.** Right: roofs, kerb and road read as one street. Slop: four seconds into AUTO the camera
   holds a stretch of roofs with not one man on the glass; a painter's camera never frames an empty board. COMBAT.
8. **AFTER.** Right: the fight ends inside a minute and drops back on the map, paused, the crew fed. Slop: nothing
   says won or lost (no recap at all), and a centred box ("CHURCH CAME THROUGH HERE. A PATROL.") sits on the map
   with no face; a painter shows the men walking off the board and the tracks on the map say the rest. RUN, UI.
9. **NOT IN THE DEMO.** No settlement screen, no market, no bag, no home: a tap on a place walks you there and
   nothing opens (rules 37b, 75, 76). That is the biggest hole a stranger meets, bigger than any pixel. RUN,
   LIFE+CITY, UI.

## AH-03, THE VIBE-CODED TELLS (the reference sheet; a cook names which it checked)
T1 WORDS IN A BOX OVER PLAY with no speaker and no portrait (screens 6, 8). Measure: zero, per 9/20.
T2 STOCK UI SHAPES: rounded rectangles with 1 px outlines, pill chips, outline tags, glows (2, 3). Measure: every
   control made of a named material (wood, paper, glass, card), never a CSS default.
T3 SOFT TRANSLUCENT SHAPES ON THE WORLD: ovals, diamonds, rings, pads (fight verdict 21 F3; AI-slop pair 2).
T4 A TEXTURE BLOWN UP PAST ITS PIXELS: any painted unit over 1.5 device px on a world surface (4, 5; the 9/29 floor).
T5 LABELS THAT COLLIDE or text over text (4; rule 44).
T6 WEB-FORM VOCABULARY: EASY tags, toggles, "no run saved", progress bars that are not a thing in the world (1, 2).
T7 A SECOND THING STAPLED ON A SCREEN: a loading list under the picks, a panel under a panel (2).
T8 SAMENESS: one texture repeated over every lot so no place reads (3).
T9 COLOURS OFF THE REGISTER: a flat green or red the style card never named (2; #8fbf7e BEGIN).
T10 A STATE CHANGE WITH NO PICTURE: the fight ends and nothing shows it (8).

## THE ORDER (what a painter fixes first, for the release)
1. Screen 9 (a place opens when you arrive) and screen 8 (the fight says how it went): a stranger cannot read the
   game without them. 2. Screen 5 (the blob) and T1 everywhere (no boxes over play). 3. Screen 6's men and board
   size (66, 79). 4. Screen 3's ground per lot kind. 5. Screens 1-2's chrome (T2, T6, T7, T9).

```json
{"verdict":"DEMO_EVERY_SCREEN","date":"10/9/26","row":"[the demo verdict]","build":"10/5g","surface":"BOHEMIA_DEMO.html, one driver, 390x844@3x",
 "screens":{"1_title":{"right":"night, power lines, one lit window; wood/paper/card menu","slop":"gold-glitter logo on grey plate, web chip tagline, 'NO RUN SAVED'","owner":["UI","WORDS"]},
  "2_picks":{"right":"one screen, paper cards","slop":"loading list + off-register green BEGIN #8fbf7e stapled under; origin card cut off; EASY outline tags","owner":["UI","RUN"]},
  "3_map":{"right":"parties are people, lamps, cracked phone","slop":"every lot the same grey grit; floating name chips","owner":["COOK","RUN"]},
  "4_arrived":{"right":"travel and clock work; the edge land shows","slop":"arrival opens nothing; CUSTOM over CARTEL; blown-up mountains","owner":["RUN","LIFE+CITY","UI"]},
  "5_cut":{"right":null,"slop":"a screen-size brown texture blob for under a second between map and fight","owner":["RUN","COMBAT"]},
  "6_fight":{"right":"the floor is a street","slop":"men a tenth of a house; board bigger than the party; centred instruction box","owner":["COMBAT","COMBAT TWO"]},
  "7_fight_auto":{"right":"roofs, kerb, road read","slop":"camera frames no man 4 s into AUTO","owner":["COMBAT"]},
  "8_after":{"right":"ends inside a minute, back to the map paused","slop":"no recap; centred faceless box on the map","owner":["RUN","UI"]},
  "9_missing":{"slop":"no settlement screen, market, bag, home; arrival opens nothing","owner":["RUN","LIFE+CITY","UI"]}},
 "tells":"AH-03 (T1-T10), reference/library/analog-horror/INDEX.md",
 "order":["9 a place opens, 8 the fight says how it went","5 the blob, T1 boxes","6 men and board size","3 ground per lot kind","1-2 chrome"],
 "picture":"slices/vote/DIRECTION_THE_DEMO_EVERY_SCREEN.png","tool":"tools/bohemia_direction_the_demo_verdict.js"}
```
