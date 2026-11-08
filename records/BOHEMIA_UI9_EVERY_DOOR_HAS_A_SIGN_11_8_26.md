# UI 9: EVERY DOOR HAS A SIGN (11/8/26)

VAMILY rule 434, ask line 519. Lane UI 9, from the coordinator's routine "UI 9: every door has a sign".
Paolo 11/8: 'how do I scavenge'... 'I couldn't find where to scavenge'.

## MEASURED BEFORE

The coordinator, on the demo, phone upright, the town Network: the town screen showed its buildings with no names on
them and the word SCAVENGE was nowhere on the glass. The lot (door `lot`, named SCAVENGE in the screen's own table,
its button 'Search the lot') is there for every camp, town and fortress, but nothing said which building it was.

UI 9 again on the demo (scratchpad probe `doors.js`, the town frame's own door boxes):

| phone upright | doors | named at rest | the lot on the glass |
|---|---|---|---|
| Anarchists (town) | 10 | 0 | yes, whole |
| Caravans (fortress) | 10 | 0 | yes, whole |
| Church (town) | 10 | 0 | yes, whole |
| Colorful (camp) | 9 | 0 | yes, whole |
| Mob (fortress) | 11 | 0 | yes, whole |
| Network (fortress) | 10 | 0 | yes, whole |

So (b) held already at the fit (the town is framed to the glass and does not slide until he pinches in); the whole
fault was (a): a building named itself only under the finger (rule 71a's torn tag), the post and the bar showed a
picture plate with no word (TUNING's change 7), and nothing told him which pile of junk was the lot.

## WHAT CHANGED

`slices/BOHEMIA_SETTLEMENT_SCREEN.html`, one marked block `__EVERY_DOOR_HAS_A_SIGN__` (and one call in `loop()`, one
read-only `BohemiaSettlement.doorSigns()`), nothing of anyone else's rewritten:

- Every door of the place carries a sign at rest: its icon and a short name in the game's letters (BohemiaCasing):
  HALL, BOARD, STALL, BAR, GUNS, SMITH, ARMOURER, BARBER, CLINIC, YARD, SCAVENGE, THE PIT, and BUILD only on his own
  ground. On UI's receipt paper with the hard one-pixel contact edge and a ragged side, no round corner.
- The icons are the game's own: the post's pistol and the bar's bottles (the same pictures their plates already hang),
  the stall's can, the smith's anvil and the armourer's bench (the market's bench icons), the rifle for GUNS, the med
  kit for the clinic, the crate of scrap for SCAVENGE, the framing hammer for BUILD, the chain for THE PIT, the sledge
  for THE YARD. Two had no picture and are cut by hand on a 12 grid, lit from the top left: the board's pinned notice
  and the barber's pole.
- The sign sits on the building's own roof first (people stand at the front, so the finger on a keeper is still the
  keeper), never on the phone or on the post's and the bar's picture plates, never on another sign, and keeps off the
  bodies of the people who stand still when it can. The lot's sign is placed first and its paper is a shade warmer.
- One tap on a sign opens that door, the same `openB` as the building's own pixels; the building catches the light
  under the finger as before, and the finger's torn tag still gives its line (what is left on the lot).
- Sized inside rules 402 and 403: the word 11 px at least, the press 44 px tall, the sign grows with his UI SIZE
  (LARGE 1.15, LARGEST 1.3; SMALL keeps the floor), re-laid when the size changes.
- A door the glass does not hold (when he pinches in) keeps its sign on the glass's edge with an arrow pointing to it,
  and a tap there takes him to it.
- Hidden while a building's sheet is open, during the arrival, the flip, the pinch out to the map and the scavenge game.
- Not on his own camp (the tent, the retinue, the cart: CAMP TWO's own pieces); rule 434 is the town's doors.

Rule 433 (nothing shows until he taps) does not hide these: it is what he needs to choose (434(a)).
Rule 71a (a building names itself only under the finger) is overtaken by 434, newer.

## THE GATE

`gates/every_door_has_a_sign_gate.js` (EVERY DOOR HAS A SIGN), on the demo, phone upright and on its side, every place
on the demo's map (camps, towns and fortresses):
D1 a sign for every door of the place (from the place's own door list, not the sign code's), the lot's says SCAVENGE;
D2 every sign whole on the glass, the finger walked down from the top page through the city's frame to the town's at
its middle and four corners lands on the sign (never the phone, the bar or a card);
D3 its word 11 px or more as drawn, its press 44 px each way, no two plates overlapping;
D4 the lot at least half in view without panning and off the phone, or its sign on the edge pointing to it;
D5 a tap on SCAVENGE opens the lot with its search; in the first place of each tier every sign opens its own door;
L at the LARGEST UI size every sign still whole, its word 14.3 px;
M planted: the lot's sign removed (D1 red), a sign moved under the phone (D2 red), a 9 px word (D3 red).

## RESULTS

EVERY DOOR HAS A SIGN 70 passed, 0 failed: all 14 places on the demo's map (5 camps, 4 towns, 5 fortresses), the
phone upright and on its side; every door's sign whole on the glass with the finger walked down through both frames,
the smallest word 11 px, every sign's finger 44 px or more each way as measured point by point; SCAVENGE on the lot in
all 28 visits, the lot 96 to 100 percent in view without panning; a tap on SCAVENGE opened the lot with its search in
every place, and in the first place of each tier every sign opened its own door; at LARGEST the words 14.3 px and still
whole; the three plants caught on both shapes.

The first runs were red and the fixes were real ones: (1) a sign's clear margin (the paper is 24 px tall, the press
44) lay over its neighbour's paper, so a tap on the edge of SCAVENGE opened the sign beside it: every paper now lies
above every margin (left/top placing, no transform layer) and no two signs' 44 px presses may share a point; (2) a sign
on the glass's top edge had part of its press above the glass: the press is kept whole on the glass.

AFTER, the phone upright (the town's own boxes, the plates in the town's frame):
Network: SCAVENGE 263,353 to 347,377, the lot's door 236,350 to 375,414; nine signs, none on the phone.
Anarchists: SCAVENGE 117,412 to 201,436 on the open ground in front of the lot.

OTHER GATES this change touches (the town screen's taps), run one at a time:
- EVERY SPEAKER HAS A FACE 10/0 (red first, a real catch: in a camp the barber's sign lay on the middle of GUNS AND
  PLATE and a finger on the guns opened the barber; and a gate that pans and taps in the same instant met a sign one
  frame behind the picture. Now no sign lies on another building's middle, and the signs move the instant where() or
  lookAt() pan.)
- THE PEOPLE OF THE PLACE 39/1, the same one red on clean main 56fe0a59 (a missing wounds file). Red first on this
  branch, a real catch: the new reader was named signs() and overwrote the town's signs(on), the switch the pixel
  gates use to turn off the post's and the bar's picture plates; the reader is doorSigns().
- THE TOWN AND THE HIRE 10/1 (every file loads: the same missing wounds files as main).
- THE SHOP TAPS 9/0; THE SETTLEMENT SCREEN 75/0; THE SETTLEMENT IS BUSY 10/0.
- THE BUSY TOWN TALKS 18/2, the same two red on clean main (a clip's pitch, the watchman's boots).
- SCROLLING IS ILLEGAL upright 11/2: N8 and N9, the fullest hall's new RETINUE rows (RETINUE 11/7, .campf.retf) run
  past the glass; the same two red on clean main 56fe0a59 (--alone). MAIN'S RED, NOT THE SIGNS': the hall's fit has to
  fold the retinue in (UI 9's next).
- THE LOADING MENU IS FROZEN 10/0 after the stamp and the demo cut; EVERY DOOR HAS A SIGN 26/0 again on the re-cut demo (Network, Colorful, Church, both shapes).

[bb Battle Brothers: the town screen is one painted picture with its buildings standing in it, and every building
answers the cursor with its name; on a phone there is no cursor at rest, so the name has to be on the building.]
[analog horror: the signs are scraps of receipt paper stuck on the roofs, the kind of hand-lettered labels a town
that lost its signs would tape up.]
