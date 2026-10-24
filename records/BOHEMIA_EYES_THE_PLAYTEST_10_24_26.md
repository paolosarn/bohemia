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
5. [WORDS] THE TITLE SAYS 'CONTINUE  NO RUN SAVED' (p01). There are no runs in this game (the pillar).
6. [WORDS] THE DOOR'S ORIGIN CARDS SAY 'START 290 BATTERIES · 3 MEN · 12 IN A FIGHT' (p02). A new player reads
   three men and twelve in a fight and cannot tell which is his crew.
7. [UI] THE BUILD STAMP WRAPS on the title, one word ('WORDS') alone on the second line (p01).

## NOT A GAME DEFECT, FOR PLUMBER (the instrument)
- The one driver (tools/bohemia_drive_the_demo.js) opened the demo and came back 'opened' after 163 s with the
  TITLE STILL UP (title.via null) and the map alive under it: every reading after it was of a map nobody could
  see. A real finger on the title's NEW GAME works (5.3 s, the title goes 'gone'). The title also carries an
  old hidden menu (div.it[data-k=new], 0 x 0) beside the real button (button.b.card[data-k=new]); a script that
  asks for [data-k=new] first gets the hidden one.
