# RUN THREE -- [make your main guy] (10/26/26)
# Rule 263(b)(c) (records/BOHEMIA_PAOLO_YOUR_MAIN_GUY_LEADS_YOU_MAKE_HIM_FIRST_AND_HEALING_ON_OUR_CLOCK_10_26_26.md); the coordinator
# handed the row to RUN THREE with [the game starts in a town].

## HIS WORDS
'before you start Bohemia should always be able to customize your main guy type shit... it's probably gonna use a lot of the same
UI stuff as when you go to the barber or whatever.'

## MEASURED BEFORE
A new game went from the origin at the door straight to his squad's tape. The main man was the one look 'you', named YOU, on the
tape, the crew screen, the town, the fight and the top bar. engine/bohemia_barber.js is a battery and a door to the bench's face
maker (the CHARACTER tab's sliders); no part of it reached a new game.

## WHAT EXISTS TO MAKE HIM FROM (measured, so the screen promises nothing the game cannot draw)
Every man the game draws is a whole render: a body (records/target/character/barber/person_<id>), his walk and idles
(slices/rig_walk, slices/rig_idles), his fight cells (slices/fight_rig), his map sheet (slices/rig_mix) and his HD face
(.../face/). There is no renderer in the game (no Blender in this box either): a part can not be painted onto a body that does not
carry it (ANIMATION's note on the board: a look is about three machine-hours through the whole chain). 55 rolled people have
all of it; 11 of them are the company's own; 44 plus the origin's own man ('you') are free: 45.
Their parts: 6 skins, 20 cuts (with his own), 10 beards (with clean), 8 marks and 6 face pieces (with clean). BUILD: every body
is on the one master rig (real_dims 0.46 to 0.51 m wide, 1.61 to 1.75 m tall), so a build is a new look: ANIMATION's offer,
records/target/bb/main_guy_builds.json (LEAN you_lean 0.44 m, SET 'you', BROAD you_broad 0.56 m; ready: false until it renders
them), and the chair's BUILD row appears by itself once two builds are ready (M8 proves it with a plant). The ID pass the barber's book names (rig.json id_table: re-tint the hair or skin by material) is the road to
skin and hair colours on any man, once every sheet carries one (NOTE CHARACTER).

## WHAT IS BUILT
1. THE CHAIR (engine/bohemia_main_man.js, BohemiaMainMan.make): after the origin and before the tape, over the whole screen.
   THE BARBER speaks from his own moving face ('Sit, sit. Before the road takes you, who are you?', draft:true). THE MIRROR: his
   whole body breathing (ANIMATION's idle, the crew card's) at a whole number of screen pixels to the render's (2 on a phone, 3
   on a computer), his HD face beside it; a tap turns him an eighth. Four rows of the barber's own part renders (CHARACTER's
   barber's book on the barber's man): SKIN (the measured colour of the people's own cheeks), HAIR, BEARD, FACE (marks and face
   pieces). Rule 249: one tap lights a tile and the mirror shows, at once and in place, the whole man nearest the one on show
   who wears it; a double tap (a right click on the computer) takes it, and every tile no whole man can wear with what is taken
   goes dim in place (rule 250: nothing moves, nothing scrolls by itself, the facts line one size). NAME and GO at the thumb:
   GO takes the man in the mirror; GO at once keeps the origin's own man. Nothing in its first second: the tube over the chair
   is off, then flickers on; a tap before then does nothing. Analog horror at the source: the flickering tube, old glass with a
   crack, the tape's grain.
2. ONE MAN, WRITTEN ONCE: localStorage bohemia.main.v1 {look, name, parts, origin, made}. Read by: the tape (startSquad, his
   breathing idle where he has no town pictures), the roster's main man (engine/bohemia_roster.js lookFor and manOf: the crew
   screen, the hall, the town), the origin's first man for the fight (engine/bohemia_condition.js named) and the fight's name for
   him (BOHEMIA_FIGHT.html, YOU first by the name he gave), the town's lead and his face when he speaks at camp
   (BOHEMIA_SETTLEMENT_SCREEN.html leadLook, campSay), the top bar's face (slices/bohemia_ui_materials.js), the map's lead
   (RUN's mapMainLook reads it first), and the valley's casts (engine/bohemia_rig_bodies.js isCompany) and the post (recruitLooks,
   womenLooks) never deal his body to anybody else; the fight never gives an enemy his look (LOOKS_TAKEN, the crew's). A new
   game clears it before the chair; the bench's valley (the dark lifted) clears it and shows no chair.
3. THE DRIVER (tools/bohemia_drive_the_demo.js, RUN's): a stranger's game taps GO in the chair once it is armed (one real tap),
   so every checker that plays the stranger's game walks through it; opts.maker 'stay' leaves it up for this gate.
4. CAMP'S CALL IN THE TOWN (the coordinator's NOTEs [camp in a town] 259(c), [the bars over their heads] 261, [a town is safe]
   273): BohemiaSettlement.crewCall(fn) sets what each of his men does in the town's picture (ANIMATION's acts or a camp act CAMP
   names), crewOver(fn) draws over each man's head every frame (CAMP's red and grey bars, hidden at 87 percent and above; CAMP
   TWO's ghosts), crewAgain() lays them out again. Nothing is drawn by RUN THREE.

## GATES
- NEW gates/make_your_main_guy_gate.js MAKE YOUR MAIN GUY 16/0 in parts (M8 the BUILD row, a plant: no row as shipped, two
  builds ready and the row holds them, LEAN taken and that body in the mirror) (GATE_ONLY=faith | truck,wolf | bench): M1 the chair up
  before the tape, armed at 1006 to 1019 ms, the tape after GO (three origins); M2 one tap lit COMB OVER and the mirror showed a
  man wearing it, 0 boxes moved, 0 things added; a double tap (the computer: a right click) took DARK and 31 tiles went dim;
  M3 the Faithful (phone) as CHUY and the Lone Wolf (computer) as EL LOBO: the record, the tape's first man, the crew screen's
  main man (opened by a real tap: his man in the town, or CREW on his phone for the Lone Wolf), the town's lead and his main man
  in a real fight through the shell's door, all the made man by his name; M4 the water truck, GO at once: 'you', YOU, not made,
  on the tape and the crew screen; M5 the bench: no chair, no record; M6 nothing threw; M7 the map's lead figure after a real
  LEAVE is his man (RUN's MAP_DREW.youLook), the made one or the origin's own.
- ADDED to gates/your_crew_lives_in_the_town_gate.js: K9 CAMP's call in the town.

## NOT DONE
- BUILD: the row is wired; the bodies are ANIMATION's (main_guy_builds.json, NOTE).
- Free colours of skin and hair on any man: the ID pass on every sheet (NOTE CHARACTER).
- The face maker's own dials (PORTRAIT's sliders) stay the bench's: a dial moves a face no body was rendered with.

[bb Battle Brothers never lets you make your man: you pick an origin, a name and a banner. Ours seats him in the barber's chair
first, and every man he can be is a man the game already draws whole.]
[analog horror: a tube over a barber's chair coming on in a dead town, an old mirror with a crack, and the man in it is whoever you
say you were.]
