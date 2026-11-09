# EYES 11/8 -- THE DEMO PLAYED END TO END ON A PHONE, UPRIGHT AND ON ITS SIDE (rule 437(c), ask line 522)

The brief (the coordinator, 11/8): play the demo end to end on a phone the way Paolo does; measure, never guess; every stall,
error, freeze over 1 s, dead tap, unreadable word or missing picture becomes an ask row tagged FOUND BY EYES with its lane; fix
only one-line plain bugs. He kept finding the bugs himself (his men stood still on AUTO; he could not find SCAVENGE; vultures).

WHAT WAS PLAYED: the demo, BUILD 11/8e EVERY BUILDING ON THE ROAD (main a0182e99), served from disk at the real address
(tools/bohemia_eyes_live_session.js, service worker off, github.io is refused from this box). Upright 390 x 844 (valley
MKH-7UJ, THE NIGHT SHIFT, A NEW CREW, about 95 steps) and on its side 844 x 390 (valley V54-BSS, about 15 steps). CPU at 1x:
this box is several times faster than his phone, so every freeze here is longer there. Pictures: records/eyes_walk_11_8/ (20 webp).

## THE ONE HE ALREADY HIT, FOUND AT THE ROOT AND FIXED (rule 438(b), ask line 524)

1. SEARCH THE LOT IS GREYED AND SILENT IN HALF THE TOWNS. The town's lot asks WORLD's engine how much is left, and the engine
   answers by the MAP GROUND under the town's gate (engine/bohemia_scavenge.js SEARCHABLE). On valley MKH-7UJ 7 of 14 towns stand
   on ground that list leaves out: Caravans (terminal), Blues (park), Church and Volunteers (school), Mob (resort), Network
   (substation), Remnants (prison). There the lot counts 0, the button is DISABLED, and a disabled button says nothing when you
   press it: his 'I press it and nothing happens'. The upright start town was Caravans (e01: 'Everybody's at the market. Nobody's
   watching the lot.' over a dead button); the sideways start town was Volunteers and its line read 'Nothing left on this lot.
   You took it all.' in the first minute, before anything was taken (e02).
   WHY NOBODY SAW IT: the coordinator's check and the SCAVENGE ON THE DIAL gate's demo leg (B6) both opened a searchable town
   (Anarchists, an apartment block).
   FIXED BY EYES (one line, slices/BOHEMIA_SETTLEMENT_SCREEN.html lotWorld): a TOWN's lot is its own junk lot, so a town whose gate
   stands on unlisted ground reads its lot as commercial (a camp is untouched). Proven on the phone on its side: Volunteers' 'Four
   hours on the block. Houses, yards, the wrecks.', the button live, the minigame open 356 ms after the tap with 6 spots, LEAVE
   closes it, 'Four hours. Nothing.' back in town (e03, e04). Gates after the line: SCAVENGE 39/0, SCAVENGE ON THE DIAL 27/0.
   LEFT FOR TOWN FIX (438(b)'s other half): a lot that really is emptied still greys the button with no word when pressed; the
   button must answer at once ('nothing left'), and the gate's demo leg should open a town on unlisted ground too.

## BROKEN, TO HAND OUT (worst first)

2. THE END SCREEN HIDES THE NEWS ON AN UPRIGHT PHONE (UI THREE, the spoils screen). After the Strip fight, 4 men, 3 level-ups:
   'TASHA STANTON: STRUCK DOWN, ONE HITPOINT: MAIMED FOOT' sits at y 859, WHAT THEY LEFT at 921, YOUR STASH at 1131 on an 844 glass,
   and a swipe does not move it (scrollTop stays 0). 'Tap a piece to see it' with no piece on the glass; even the first fight, with
   no level-ups, put WHAT THEY LEFT under the hint bar (y 734). On its side: 1 of 3 men shown, the loot row half under the buttons
   (e05, e06).
3. THE PHONE'S OWN WORDS ARE 6 TO 7 PX (UI TWO, the phone): the clock (7 px), the job cards (7), the feed (6 to 6.5), the crew
   panel ('3 / 20 12 IN A FIGHT', 'STASH 4/36', 6 px), the crew filters (8), against the 11 px floor; both shapes (e17).
4. THE FIGHT'S SMALL PRESSES (UI THREE with COMBAT TWO): WAIT, RETREAT, AUTO and the speed button are 25 x 27 px upright and
   23 x 24 on its side; FIGHT / END TURN 25 px tall on its side; the skill slots 22 to 24 px. The floor is 44 (e16).
5. THE BARBER ON ITS SIDE HAS NO SKIN ROW (UI THREE with CHARACTER): the SKIN row is at y -99, above the glass, and nothing
   scrolls, so a skin cannot be picked with the phone on its side; the hair pictures are cut at the top; every row's sixth choice is
   cut at the right. Upright the sixth choice of all four rows (DARK, DRY TAPER, MOUSTACHE, CLOUDED EYE) is behind a sideways
   scroll (strip 360 wide in 292) (e08).
6. THE PISTOL'S CARD SAYS 'THROW JAVELIN' (UI THREE the card, WEAPONS the name): the pistol rides the javelin row
   (ours.json pistol_shot) and the row's Battle Brothers skill name reaches the card ('WHAT IT CAN DO: THROW JAVELIN STRIKE');
   the same pistol reads 'dmg 15-35' on the slot line and 'DAMAGE 30-45' on the card (e07).
7. EVERY WIN SAYS 'THE RAIDERS ARE DOWN' (WORDS with COMBAT TWO): the yard's watchmen (thugs), the Strip's thugs, the freeway's
   thugs and the road's thugs all came home as raiders; only the pit's were raiders (e14).
8. THE MEET CARD AND THE BOARD DISAGREE (COMBAT TWO the board, WORLD 13 the card): 'THE GROUND: OPEN ROAD - ARTERIAL. Wrecks and
   the median for cover, nothing high.' dealt suburb_stem, rows of two-storey houses (e12, e13).
9. THE HALL (HIRES, with WORDS and PEOPLE): a MELEE brawler is hired 'with the pistol in his hands' (his knife row is a pistol by the
   same table) and the hall draws a pistol beside MELEE on every melee man; the BARGAIN tag pushes the trait word under the icon
   ('BARGAIN S...'); Tasha, a woman's name, is a 'he' (no woman's body exists yet, the name table still deals the name); 8 men,
   two Travis and two Ocampo (e15).
10. THE BOARD'S JOB CARDS CUT THEIR WORDS (UI THREE): the client's name runs off the card's bottom ('DON RUBEN, THE QUARTERMASTER'
    half gone; 'COMANDANTE RIVAS, WHO KEEPS THE PEACE HERE, BADLY' under the next card's blood edge); a PAID THERE badge squeezes
    the title into a corner. Both shapes (e10).
11. THE NEW GAME ON ITS SIDE CUTS WORDS (RUN, the start screen): the crew name shows 'THE NIGHT' (no SHIFT, no dots), 'THE CREW
    THAT IS...', and the origin's own line ('Three of you and nothing owed...', '290 BATTERIES - YOU AND 2 MEN -') is cut (e09).
12. THE HALL ON ITS SIDE: the BEST / BEST FOR THE PRICE switch is drawn over the keeper's sentence (UI THREE) (e11).
13. A RAISED STAT LOOKS LIKE IT FELL (UI THREE, the crew screen): while picking, the bars show bare numbers (fatigue 106,
    initiative 103, melee defence 9); after RAISE THEM the same bars show the numbers with gear (85, 82, 24).
14. THE SMITH'S SHELF (WEAPONS): a 'solid two-hand machete' on the one-hand machete's picture (rule 424(c)); two rows both named
    'solid fire axe' with different numbers (30-45, 120% vs armour; and 20-30, 200% vs armour, 60% through: a pick's numbers).
15. FREEZES OVER 1 S (PLUMBER; SCAVENGE for the bake), at 1x on this box: 1.37 s leaving a won fight by MAKE CAMP; 1.18 s opening the
    scavenge game (its board bake). Nothing else over 1 s in about 110 steps; next worst 0.98 s (a road fight's deal), 0.82 s
    (leaving a fight), 0.73 s (the first fight's deal).

## SMALLER, NOTED, NOT HANDED OUT

- The arterial and suburb boards are full of a pale mint ground under parked cars that reads as water (DIRECTION's eye; e13).
- 'accessory: does not count' under every man in the pit's pick, and 'House rules: no collar...' read as code (WORDS).
- 'Nobody climbed this time.' on the crew screen after a death (WORDS).
- The retreat's 'tap again' forgets the first tap after about ten seconds and says nothing (my scripted gap; a thumb is quicker).
- MAKE CAMP with nobody hurt goes straight back to the map (fine), with the 1.37 s freeze above.

## SEEN WORKING (measured, both shapes unless said)

- The door to the map: NEW GAME, the picks, BEGIN to the barber 2.1 s, GO, the crew card, the town. No page error in about 110 steps.
- Every door's sign on the glass and off the phone in Caravans, Custom and the Mob (upright) and Volunteers (sideways); every
  sheet opens and closes (barber, clinic, smith, armourer, stall, bar, hall, board, guns, scavenge, the pit). The Mob's town is its
  own picture (the drained pool, the palms) on Caravans' plan.
- The shop: the machete bought (290 to 246, BAG 1/36); a hire is one tap (Tasha, 246 to 236).
- A job end to end: the tire yard taken, 11 blocks in about 10 s, the meet card, ENGAGE, the fight by hand (a walk in two taps,
  an aim, 'out of reach' said), AUTO; walking back past Caravans paid 90 on touching it.
- RULE 435 HOLDS: every man of his acted on AUTO, 61 of 61 turns: suburb 1x 12/12, the pool pit 1x 11/11, the Strip 4x 15/15,
  the freeway deck 4x 12/12, the road on its side 1x 11/11. Fights 9 to 21 s. Boards dealt in 1.6 to 3.1 s (6.1 s the first on
  its side): the Strip 'stripw + blvd + stripe', THE DECK, the pool pit, suburb_stem (e18, e19, e20).
- The pit: pick three, FIGHT WITH 3, won, the purse paid (327 to 362).
- Retreat: two quick taps, three men ran off the edge, over in 5.2 s, 'YOU PULLED OUT'; the man at one hitpoint died left behind.
- Camp: HEAL took 12:37 to 16:37, blood 123/181 to 181/181, armour 156/405 to 405/405, tape 43 to 26.
- The crew screen fits both ways; a level-up's four picks and RAISE THEM work.
- SAVE AND RELOAD both shapes (the tab killed like a phone kills it, the link opened, CONTINUE): the block, the batteries, the
  job, the clock and the heal bar came back the same; the map up 1.2 s after CONTINUE.

## HOW, SAID PLAINLY

- Fights on the Strip, the freeway and the side road were opened through the map's own encounter message (nfOpen, the door the
  freeway gate uses), not by waiting for a crew; far towns were reached by the map's travelTo (the call a tap makes); the near
  ones by a finger on the map. AUTO was read from the fight's own state (FIGHT.S, a man's place and the log) every 40 ms.
- TWO FALSE ALARMS FROM MY OWN TOOL, NOT FILED: a tap on a list's container opened the wrong job; and the tool's tap helper added
  every parent frame's box to a frame two deep, so LEAVE in the scavenge game looked dead (Playwright's frame box is already on
  the page's glass). The helper is fixed in tools/bohemia_eyes_live_session.js, which also gained the phone on its side
  ('phone_side', 844 x 390) and a stall meter armed in every frame before any page script (S.stalls).
- NOT WALKED: the alpha link (the demo only), sound, night, a board job that lands on the Strip or the freeway by itself.

## NEXT ROUND (rule 437(c): every round)

Re-walk after the next ships, the alpha too; the lanes above first as they land; a night fight; a job to the Strip by its own road.
