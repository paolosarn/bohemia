# EYES AND EARS -- THE PLAYTEST, ROUND 1 (10/24, eyes-opus-10-24, rule 150)

Paolo 10/24: 'there's a lot that's not really correct and right... this is the shit you have to stay on top of,
all these little things; I can't be explaining all these little things to you; you have to build these things.'

THE BUILD: DEMO - BUILD 10/24j - THE STARS SIT WITH THE WORDS (main 1236b62c), slices/BOHEMIA_DEMO.html.
THE PHONE: the one driver's phone_portrait profile (390 x 844, touch, 3x pixels), full CPU, a wiped phone,
every step a real finger (touchscreen tap, two-finger pinch over CDP), every picture the game's own camera
(page.screenshot, downscaled to 390 wide) in records/eyes_the_playtest_10_24/.
THE WAY: one live game held open and played step by step like a new player; nothing fixed here.

STATUS: IN PROGRESS. The list grows as the play goes; worst first inside each part.

## THE RANKED LIST (the coordinator reads this)

1. [RUN] ONE SQUEEZE FROM THE START GOES TO OUTER SPACE. From the first map (zoom 1.0), one ordinary
   two-finger squeeze lands at the far bound (0.214) AND crosses into the sky view: black space, a moon,
   a planet's rim (p04). Five more squeezes stay there. The valley-as-a-whole rung is skipped. His 10/24:
   'it's like two maps right now, actually three.' Step: NEW GAME, BEGIN, pinch out once left of the phone.
2. [RUN, COOK] THE VALLEY PAST THE CITY DRAWS IN BIG BLURRY BLOCKS. Pinch back in after space: the camera
   is no longer on the crew (pan 950, -1869 at the closest zoom), it is over the Black Mountains, and the land
   there is coarse flat diamonds, each about 40 px on the glass, beside a city drawn at full detail (p05, p06).
   One zoom, two kinds of map. Step: as 1, then pinch in until it stops.
3. [UI, in flight: UI CLAIMED [the phone shows two jobs]] THE PHONE IS A WALL OF TEXT. Two jobs, then a social
   feed of about ten posts (@marisol_v, @waterline, @thecircuit, @nightcount, @thevalley...), 33 lines of words
   on the first screen, the phone covering about 40 percent of the map's width (p03). Not filed again.
4. [RUN, in flight: RUN OPEN [the job's stars]] THE JOBS STILL WEAR SKULLS on the phone (one and two skulls,
   p03); his 146(e) is stars. Not filed again.
5. [RUN TWO, WORDS] THE SHOP PRINTS THE BATTLE BROTHERS NAMES. Every item card at the smith and the armourer
   ends with where it was copied from: 'Solid fire axe... (was Head Splitter)', 'Good pistol... (was Qatal
   Dagger)', 'A riot shield... (was Kite Shield)' (p13, p14). His 9/28: 'our own way, never a rip-off.'
   Step: a town, the smith, tap any item on THEIR SHELF.
6. [RUN TWO, COMBAT] THE 'GOOD PISTOL' IS A DAGGER. The smith's good pistol (125 batt) reads 'One house away...
   dmg 30-45 vs armour 70% reach 1 (was Qatal Dagger)'; the crew's own pistol reads 'REACH 2 TO 4 TILES, A CLUB
   AT 1'. A gun you buy reaches less than the gun you start with. Step: the smith, tap 'good pistol'.
7. [RUN TWO] A FINGER CANNOT PICK A MAN IN THE CROWD. 16 people stand in the street; the game's own hit test
   (personAt, every 3 px over the whole street at the stall's view) reaches 11 of them; 5 are never hit; 4 of
   the 11 are a target of about 13 x 13 px (18 to 25 hits of 9 px), a tenth of a phone's 44-point finger. Aimed
   at person_reds_5 the finger opens KAI CROWDER (person_remnants_3) beside him; aimed at person_volunteers_4,
   AMBROSE YAMADA. 'Talk to everyone' cannot be done. Step: a town, tap people in the line one by one.
8. [RUN TWO] THE KEEPER'S LINE RUNS UNDER THE CLOSE BUTTON. At the smith 'a blade sha[x]rp', the armourer
   'before no[x]on', 'twenty-five batteries[x].', the board 'for marke[x]t day': the first line of a sheet is
   cut by the x (p10, p11, p14). Step: a town, the smith.
9. [RUN TWO, UI] THE CREW SCREEN SAYS 3 / 20, THE TOP BAR 3/12, THE DOOR '12 IN A FIGHT'. Three numbers for
   one company (p07, p03, p02). Step: NEW GAME, BEGIN, tap the face chip on the top bar.
10. [UI] THE SETTINGS GEAR FLOATS OVER EVERY SCREEN: on the crew screen it covers the FRONT label and the first
   front place (p07) and, scrolled, the word HITPOINTS (p08: 'POINTS'); in the town it sits on the picture (p09).
11. [RUN TWO, WORDS] YOU ARE PAID A WAGE AND CALLED A COMPANION. The crew screen's first card: 'YOU / COMPANION
   (2HAND) LEVEL 1 1 BATT A DAY' while holding a pistol and a car door, and his line is about himself in the
   third person: 'Does not talk about before. You do not ask.' (p07). Step: the face chip.
12. [RUN TWO, WORDS] THE BAG LINE STOPS MID-SENTENCE: 'YOUR BAG 0 / 36 DRAG ONTO A SLOT ABOVE, OR TAP' (p08).
13. [UI, WORDS] THE MONEY HAS FOUR SPELLINGS ON ONE SCREEN: '290 BATTERIES' (bar), '30 batt' (board),
   '1 battery' (stall), '138b' (shelf) (p10, p11).
14. [WORDS] YOU SAY THE STALL'S LINE: the lot's sheet puts 'Market day. Everybody is out, everything is moving.
   Good day to sell, bad day to buy.' in YOUR mouth, the stall keeper's line word for word.
15. [WORDS] THE TITLE SAYS 'CONTINUE  NO RUN SAVED' (p01). There are no runs in this game (the pillar).
16. [WORDS] THE DOOR'S ORIGIN CARDS SAY 'START 290 BATTERIES · 3 MEN · 12 IN A FIGHT' (p02). A new player reads
   three men and twelve in a fight and cannot tell which is his crew.
17. [UI] THE BUILD STAMP WRAPS on the title, one word ('WORDS') alone on the second line (p01).

## NOT A GAME DEFECT, FOR PLUMBER (the instrument)
- The one driver (tools/bohemia_drive_the_demo.js) opened the demo and came back 'opened' after 163 s with the
  TITLE STILL UP (title.via null) and the map alive under it: every reading after it was of a map nobody could
  see. A real finger on the title's NEW GAME works (5.3 s, the title goes 'gone'). The title also carries an
  old hidden menu (div.it[data-k=new], 0 x 0) beside the real button (button.b.card[data-k=new]); a script that
  asks for [data-k=new] first gets the hidden one.
