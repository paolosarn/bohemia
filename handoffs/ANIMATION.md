# ANIMATION -- the handoff block (written only by ANIMATION; newest on top; the old blocks are handoffs/ANIMATION_ARCHIVE.md)

ANIMATION (session_01GKDyutPrWASvMYWVtMVPYL): 11/7 (b) LATEST -- [the kill cams] (rule 426(h), ask lines 365 and 498, the coordinator's
routine 'ANIMATION: kill cams') SHIPPED (BUILD 11/7n - THE KILL CAMS, REMADE), BUILT, NOT YET SEEN. Still OFF in the game until he says
good (rule 379(b)). TAB: the FIGHT (turn KILL CAMS on behind the gear, under FIGHTS) and VOTE (animation-the-kill-cams-remade-11-7,
GOLDEN, kind screen: before and now, with sound).
WHAT IS IN THE GAME NOW (slices/BOHEMIA_FIGHT.html, the block THE KILL CAMS, REMADE; numbers ours.kill_cams):
- Only the kills that matter (killStake, pure, off the fight's log): the last of theirs and a champion or boss (HELD BREATH, 4 beats,
  the heartbeat; never halved on AUTO for the last one), a killing blow of 0.8 of his health or more (HAMMER, 2 beats, halved on AUTO).
  Measured: 15 kills on six AUTO fights, 6 would cut; the gate's three fights 9 kills, 3 cuts.
- The picture: on each new key (6 a second) the frame the fight just drew, cut and blown up by a WHOLE number with no smoothing (x2;
  HELD BREATH x3 from beat two, on the man who did it), held inside the board's picture; washed, warm, lines, the head-switch band,
  the cheap lens's corners, HAMMER's tear on the blow; REC, the counter, what it caught, the zoom, in the ROM letters. Its own canvas
  (#killcam, z 2, pointer-events none) over the board and under the HUD. The board's marks guarded out of a cut (!UI.cut on the men's
  bars, the outclass chevrons, the tape corners, the rounds mark, the kill's ripple: five one-token guards in COMBAT's draw code).
- Old CSS punch-in (cutCss/cutClass/cutOrigin/cutBars) removed; SHARP, CINE-FOLLOW, ORBIT, X-RAY, CHAIN, LAST STAND retired with the
  plain-kill cut. The switch's ON line in slices/bohemia_killcams.js says what they do now.
- Gate: gates/the_kill_cams_gate.js rewritten (K1-K8, planted fails on the rule, the beat and the pixels; K7 frames 7.6 ms with vs 8.1
  without). Capture: tools/bohemia_animation_the_kill_cams_capture.js (records/target/animation/kill_cams/). Record:
  records/BOHEMIA_ANIMATION_THE_KILL_CAMS_REMADE_11_7_26.md.
WHAT IS LEFT (no Paolo needed): ON by default the moment he says good (one line: rule 379(b) and the switch's default); SOUNDS may add a
camcorder's own sound; a camera PLACED in the street would cost frames (said in the record, not done).

ANIMATION (session_01GKDyutPrWASvMYWVtMVPYL): 11/7 (a) -- [the crawl] (HIS YES 11/7, no words: the recipe is FROZEN, 408(b) step 9; the rest of the bodies are next on this lane) (rule 390, ask line 423, opened by rule 421) SHIPPED
(BUILD 11/7f - THE CRAWL), BUILT, NOT YET SEEN. ONE GOLDEN PIECE (408(b)) on ONE man, cast_barearms. TAB: the FIGHT (any man of
his struck down who lives, in that look) and VOTE (animation-the-crawl-golden-11-7, GOLDEN: plays all eight ways beside the thug,
and the phone picture from the real fight).
WHAT IS IN THE GAME NOW:
- A man of his struck down who lives (down, not dead), his fall played and two bars on his back, rolls over and drags himself
  away from the man he faced (the crawl faces the fall + 4): the drag (legs dead, the right arm pulls, the left reaches), his
  breath, the drag, the elbows (low, slow, head down), the last (a few inches, a stop, the hand opens), then he lies there.
  162 keys, three a beat, 0.41 units (about half a metre, inside his tile). The fight's cloth_on plays as each hand comes down.
- Real reference first: WALK-04 the low crawl (FM 21-75), WALK-05 care under fire (TCCC), WALK-06 the belly crawl, filed in
  the reference library. Bar: body_thug_S and the town is alive; the card's line is SAME (the same rig, his colours) and says
  what it does that they do not, and its two weak points (no finger bones; the pulling arm hidden on half the facings).
- Code: tools/bohemia_animation_the_crawl.py (source, pose via the TOWN tool's pose step, render via COMBAT's render over the
  master rig, pack, shots), engine/bohemia_crawl.js (the player, the slide), slices/BOHEMIA_FIGHT.html __THE_CRAWL__ (crawlDraw;
  one changed line in blitMan: the crawl is asked before holdDraw), tools/bohemia_animation_the_crawl_capture.js (the real fight
  on the phone). Source records/target/animation/BOHEMIA_THE_CRAWL.json; joints records/animation/crawl_joints/; pictures
  slices/rig_crawl/; shots records/target/animation/crawl_shots/; loop log records/target/animation/crawl_look/.
- Gate: gates/the_crawl_gate.py 21/0 (S H E P X W; E is the envelope over every drawn key of the whole arc, 8 facings; W4 runs
  the real fight in a browser). what_a_man_holds_gate.py 15/0 (its W1 takes the changed line). Record:
  records/BOHEMIA_ANIMATION_THE_CRAWL_11_7_26.md.
FOUND: COMBAT's poses tool turns bones AFTER its ROOT tips the man (world axes); the town's LIE turns them BEFORE. To reuse a
COMBAT key in the town's format carry the axes back: F d -> U -d, U d -> F d, L stays (the record shows it).
WHAT IS LEFT (no Paolo needed):
- After his pass (the recipe freezes): `python3 tools/bohemia_animation_the_crawl.py source`, add looks to LOOKS, then per man
  `<venv>/bin/python tools/bohemia_animation_the_crawl.py render <look>` (about 1 min 20 s a man here) and `pack`; the gate's P1
  says one man until then (408(b)); widen it with the volume.
- COMBAT: letting a struck-down man crawl a TILE (the record lists the five things: a CRAWL action, zone of control, the AI's
  choice, the base drop of a tile in crawlDraw, theirs who live). SOUNDS: a true cloth-on-concrete drag.
- The fingers need a hand rig (CHARACTER/DIRECTION).
- EVERYBODY IDLES is red 3 on main, not from this round: P1 the looks other lanes added have no idles (robot, the six bosses,
  the new beasts: coyote, mountain lion, feral hog, camelops, feral bull, short-faced bear...), C3 the three old beasts' idles carry
  +60 colours over their sheets, R5 a few rolled men's map idles sit 3 px off their map still. Lane debt: render and pack them.
- bpy: `python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow` (it installed here in a few minutes).

ANIMATION (session_01GKDyusavUZcodjCHmVnXRM): 11/2 (a) -- [they mend on the march] (ask line 314) SHIPPED (BUILD 11/3zj - THEY MEND ON THE MARCH),
NOT YET SEEN. TAB: VOTE (four items, each playing on his three walking) and the MAP itself (it happens by itself on the march).
WHAT IS IN THE GAME NOW:
- On the map, a man healing or mending on the march does one of his four as he walks, the walk going on under it: binds a bandage
  (under 60% hp), dry-swallows pills (an ache), duct-tapes his worn plate (armour down + tape in the cart), knocks the dent out of
  his worn helmet with a knife's butt (a real helmet, armour down + tape). One or two at a time, whole bars, a 6-12 bar rest, never
  in the first 2 bars, never facing away (S SE E SW W only), ends if he stops or turns away. Numbers: records/target/bb/march_acts.json.
- Pictures: slices/rig_march (his own model on his own six walk keys, laid on his map walk by the legs, his sheet's colours, a
  second sheet of only his arms drawn over his worn plate; the helmet in his fist via the wear player's new headAt).
- Code: engine/bohemia_march_acts.js (the picker/player), slices/BOHEMIA_CITY_WORLD.html __THEY_MEND_ON_THE_MARCH__ (the party's
  drawing only), engine/bohemia_wear.js o.headAt (additive, CHARACTER's file), tools/bohemia_animation_they_mend_on_the_march.py
  (render), tools/bohemia_animation_march_pack.py (pack, strips), tools/bohemia_animation_march_capture.js (the phone proof),
  the towns tool's WALK op, walk-key pose names and split_arms (records/target/animation/BOHEMIA_THEY_MEND_ON_THE_MARCH.json).
- Gate: gates/they_mend_on_the_march_gate.js. Record: records/BOHEMIA_ANIMATION_HEALING_AND_MENDING_ON_THE_MARCH_11_2_26.md.
WHAT IS LEFT (no Paolo needed):
- Render the other nine of his eleven (TINA, BOOKIE, OSO, MARISOL, CHEWY, LUPE, GRIZ, DEUCE, NENA): they walk without acts until
  then. A maker's main man and the post's hires the same way (their look). The record's WHAT IS LEFT has the commands.
- EYES on a real phone at the close end.
- Render cost: bpy 4.2 in a python3.11 venv (`python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow`); a man is
  ~35-45 min on one core (660 colour keys + 660 arm keys). Run each man as his own background job with a LONG time limit: a 30-min
  background cap killed three half-done men this round. Then `python3 tools/bohemia_animation_they_mend_on_the_march.py pack`.
