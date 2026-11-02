# THEY MEND ON THE MARCH (ANIMATION, ask line 314, 11/2)

## HIS WORDS
Paolo 11/2, picking four of the coordinator's ten: "I like these animations, let's make this happen... it has to look good,
that's the main thing... I hope it's not too many tokens... I'm not sure if it needs to be customizable to all the items, I
prefer maybe not."

## WHAT SHIPPED (BUILD 11/3zj - THEY MEND ON THE MARCH)
While the party walks the map, a man who is HEALING or MENDING on the march does one of the four as he walks. The walk goes
on under it: every pose of every act is drawn on each of the six keys of HIS OWN map walk, so his legs are the map's legs.

| act | what he does | starts when | length |
|---|---|---|---|
| bind | wraps a dirty bandage round his left forearm, over and under, bites the end and pulls it tight, tries the arm | he is under 60% of his hitpoints (badly cut) | 3 bars |
| pills | shakes pills out of an orange bottle into his cupped palm twice, palm to mouth, head back, swallowed dry | under 99% of his hitpoints and over 60% (an ache) | 2 bars |
| tape | pins the duct tape's end on his chest, pulls a strip across, the roll to his teeth and torn, pressed flat, a second strip | his body piece is down a point or more AND the company has TAPE | 3 bars |
| helmet | both hands up, the helmet off and held at his chest, the knife's butt brought down on the dent three times, back on | his head piece is down a point or more, it is a REAL helmet (hard hat, riot, moto, army pot, welder's mask), AND the company has TAPE | 3 bars |

THE TRIGGERS ARE THE MAP'S OWN CLOCK. engine/bohemia_condition.js `elapse()` heals and mends on the march (1 hitpoint an hour
on the map, 3 armour points a piece an hour paid in TAPE, records/target/bb/condition.json), so all four play on the march
itself; none needed a camp. No tape in the cart = nothing is mended = nobody tapes or knocks. A hood, a bandana, a rag or a
gas mask has no dent: a man mending one does no act (said here, decided by ANIMATION, his to change in the numbers file).

WHO AND WHEN (every number in `records/target/bb/march_acts.json`, a modder's file; draft:true where it is ANIMATION's pick):
one or two men at a time across the party (men_at_once 2), never everyone; an act starts on a bar (a 45% chance on each new bar
for a man who needs it and is free); it plays its whole bars; then he rests 6 to 12 bars before he works again; nobody works in
the march's first 2 bars (nothing happens in the first second). Only while walking, and only facing the camera or across it
(S SE E SW W): turned away his hands are behind his body and a hand at his mouth seen from behind reads as a scratch at the back
of his head (the 9/24 graveyard's lesson, records/BOHEMIA_GRAVEYARD_THE_HAND_AT_THE_FACE_9_24_26.md). If he stops or turns
away the act ends where it is and he rests.

NOT PER ITEM (his preference, and the tokens): the props are generic: the bind's own dirty bandage, one orange pill bottle, one
roll of grey duct tape, one knife. The plate and the helmet are the ones he WEARS: the map lays his worn plate and helmet on him
with CHARACTER's wear player (engine/bohemia_wear.js), found on his WALK frame so his working hands never move them, then draws
HIS ARMS AGAIN over the plate (a second sheet of only his arms and what his hands hold), so his hands tape the plate he wears,
whatever plate it is. His helmet moves from his head to his fist and back: the wear player's new `headAt` draws it at the bowl
in his left fist (the bowl is flat magenta in the render; the pack takes its middle and repaints it dull steel, seen only if
his piece has no picture). No art per item, so every armour row works the day it is added.

## HOW (the machine)
- SOURCE (rule 128): records/target/animation/BOHEMIA_THEY_MEND_ON_THE_MARCH.json (its own file beside the town's: whole bars
  on the walk, not the town's 24-key loops; the towns tool's `source()` reads both). Arms only, as REACH targets off the chest
  and the head; the bandage's arms are the camp's bind's (bi_arm, bi_over, bi_under, bi_teeth_h, bi_teeth) unchanged but the
  forearm lifted 9 cm so it reads standing. Every act starts and ends on its own LIFT (both forearms up before the belt), the
  step between the walk's swing and the work, so no joint crosses from his side to his chest in one drawn key. Every hold is two
  keys or more, no pose beside itself (AN ENVELOPE RAMPS SLOWER THAN THE GRID).
- POSE: tools/bohemia_animation_the_towns_activities.py, three small additions: `pose_list` expands an act with `walk: 6` into
  `pose@0..@5`; `apply()` takes `['WALK', k]`: the bones from the model's own six-key walk (Anim_0) sampled exactly where the
  master rig samples it (f0 + (f1 - f0)(k + 0.5)/6), no foot plant; `split_arms()` cuts each skinned mesh's arm faces (every
  corner's strongest bone an arm's, a hand's or a finger's) into meshes of their own, same skin, same normals.
- RENDER: tools/bohemia_animation_they_mend_on_the_march.py `render` runs the towns tool's person_one / fight_one (RUN TWO's
  builds, COMBAT's YOU) with DIRECTION's master rig patched in memory (the way render_model already patches it): a march clip
  renders only the five seen facings (3/8 saved), and MARCH_FRONTS renders every key again with everything but his arms and
  props as Cycles holdout, 4 samples. MEASURED: the master rig's own object-ID pass cost 2.7 s a key against the colour's 0.7,
  and switching holdout per key cost 2 s; held out once per clip it is about 0.5 s a key.
- PACK: tools/bohemia_animation_march_pack.py lays each cell on HIS OWN MAP WALK FRAME BY THE LEGS (the one offset that makes
  the render's legs from the knees down cover his map walk's legs best over every seen facing and key; leftover written per
  man), snaps to his map sheet's own colours (+10 for what his hands hold), adds his sheet's outline when it has one (the fight's
  YOU carries a one-pixel ring (14,10,5); the rolled people do not), keeps a hand that reaches past his walk frame (24 px pad).
  Out: slices/rig_march/<look>_<act>.webp, <look>_<act>_front.webp, rig_march.json.
- PLAY: engine/bohemia_march_acts.js (BohemiaMarch.frame) picks and plays; slices/BOHEMIA_CITY_WORLD.html
  `__THEY_MEND_ON_THE_MARCH__` (mapMarchFrame, mapPersonDraw for his two men, the YOU block for him): the party's drawing only.

## MEASURED
- RENDERED: YOU, DESI (person_town_0) and RAUL (person_town_1): the man the map leads with and the two it walks beside him in
  the demo's company. Each act: its poses x 6 walk keys x 5 facings = 180 (bind, tape) or 150 (pills, helmet) cells, 660 a man,
  and 660 arm cells. Time: YOU 22 min on one core; DESI and RAUL 32 min each on two cores side by side (bpy 4.2, CPU).
- LEGS ON HIS OWN MAP WALK (leg pixels from the knees down that still disagree after the one offset): YOU 408 of 17,731 (2.3%:
  his sheet's outline ring, drawn back on), DESI 53 of 21,502 (0.25%), RAUL 115 of 13,698 (0.8%).
- WEIGHT: slices/rig_march is 2.7 MB for the three (each man eight lossless webp sheets: four acts, four arm sheets). One act's
  sheet is 1024 x 736 to 949 (about 3.8 MB decoded, the same again for its arms), fetched only when that man needs that act.
- ON THE PHONE (the driver's phone_portrait, 390 x 844 at 3x, the demo itself): left alone the map's picker started DESI's
  bandage, RAUL's tape and YOUR pills, never more than two at once, the first 7.1 s into the march (the first bars are 4 s);
  forced, DESI bandaging and RAUL taping side by side, then YOU knocking his hat (it leaves his head, sits at his chest under the
  knife, goes back on) and RAUL on the pills; zero page errors.
- THE PICKER IN A CLOCK (the gate, 400 bars): most at once 2, 93 acts started, first at key 24 (bar 2), none facing away, none
  standing, DESI's hood never knocked, RAUL tapes his vest, and with no tape only the bandage and the pills.
- THE TWEAKING RULER: AN ENVELOPE RAMPS SLOWER THAN THE GRID gate still 10 of 10 (it is scoped to the five hand clips on
  purpose, its own header says why); these four hold every pose two keys or more and go through the lift (the gate's M1).

## PROOF
- Strips (every drawn key of each act, his own map walk frame at the same key above it, down-right, the map's pixels x2):
  records/target/animation/march_strips/ (bind on DESI, pills and tape on RAUL, helmet on YOU).
- The phone: records/target/animation/march_capture/ (tools/bohemia_animation_march_capture.js): the demo on the phone profile,
  the crew hurt the way a fight leaves them and tape in the cart, the party walking at the close end: first nothing forced
  (the map's own picker), then DESI bandaging and RAUL taping together, then YOU knocking his helmet and RAUL on the pills, a
  frame a key cut round the party.
- Gate: gates/they_mend_on_the_march_gate.js (M1 the source, M2 the pack, M3 the numbers file, M4 the picker run 400 bars in a
  clock: never more than two at once, never in the first bars, never facing away or standing, a hood never knocked, no tape no
  mending; M5 the map's drawing; M6 the four VOTE items).
- VOTE tab: four items (animation-march-bandage/pills/tape/helmet-11-2), each a page that PLAYS it on his three walking on the
  map's own pictures with their worn gear (slices/vote/ANIMATION_MARCH_*.html).
- Compare law: the twin of every key is the same man's own walk frame at the same facing and key (the strips' top row).
  Analog horror AH-01: the held key, stop-motion, never a tween; the props worn (a torn label, dirt on the tape, a grey grip).

## WHAT IS LEFT
- THE OTHER NINE OF HIS ELEVEN walk without acts until rendered: TINA (person_town_5, killed half done by a 30-minute
  background cap this round), BOOKIE (2), OSO (6), MARISOL (4), CHEWY (8), LUPE (7), GRIZ (11), DEUCE (3), NENA (10).
  `<venv>/bin/python tools/bohemia_animation_they_mend_on_the_march.py render person_town_5,person_town_2,... 4` (as background
  jobs with a long time limit), then `python3 tools/bohemia_animation_they_mend_on_the_march.py pack`. Nothing else changes.
- A main man made in the maker (his own look) and a man hired at a post (a rolled person) walk without acts until their look is
  rendered the same way (a look not in the index is simply skipped, never an error).
- Facing away (N, NE, NW) nobody works, on purpose (the graveyard's lesson); if he asks to see it from behind, it is three more
  facings in the same render (drop them from SEEN in both the tool and the player).
- EYES: on a real phone at the close end. The pictures are small there (a man about 45 css px); the act reads as hands busy at
  the chest and the hat leaving the head. If he wants it bigger, that is the map's zoom, not this.
