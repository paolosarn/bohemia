# THE CRAWL (ANIMATION, 11/7/26; rule 390, ask line 423; ONE GOLDEN PIECE, rule 408(b); opened by rule 421 PUSH MORE)

His words, 11/4 (rule 390): 'make an animation of people crawling on the floor... a fucked up scary sad murders type of
crawl... plenty of ways we can use that... or make a job for it.'

## THE ANSWER (for him, eighth grade)

1. A man of yours who is struck down and lives now crawls. He falls on his back, lies there two bars, rolls over, and drags
   himself away from the man who dropped him, toward his own side.
2. Three weights, one after the other: the DRAG (legs dead, the right arm pulls, the left reaches ahead and never grips),
   the ELBOWS (low, slow, head down), the LAST (one weak reach, a few inches, a stop, the hand opens). Then he stays there.
3. It is his own 3D model through the same rig as everyone, eight directions, on the beat at 120. Nothing jumps: a machine
   checks every joint on every drawn key in all eight directions.
4. It is in the real fight now, on one man (the bare-armed crewman), the first of its kind. If you pass it, the same recipe
   makes it for every body.
5. Where: the FIGHT (any man of yours struck down who lives, if he is the bare-armed crewman), and the VOTE tab (the card
   plays it all eight ways beside the thug, with a picture from the real fight on a phone).

## STEP 3 OF THE RECIPE: THE REAL THING FIRST

Read through the search engine's excerpts (this box's network refused uakron.edu; nothing below is from memory). Filed in the
reference library as WALK-04, WALK-05, WALK-06 (reference/library/walk-cycle/INDEX.md; records/BOHEMIA_REFERENCE_LIBRARY_INDEX.json
now 102 references).

| REF | the real thing | what it says | what the crawl took from it |
|---|---|---|---|
| WALK-04 | the low crawl: US Army FM 21-75 (1984) ch. 3; University of Akron Army ROTC MS1 lesson 9; army.mil 'Introduction to the low crawl' (2015) | 'the greatest protection with the slowest movement'; the body pressed flat, 'push both arms forward... move forward by pulling with your arms'; used where cover is under a foot high | THE PLANTED HAND: the body is pulled UP TO the hand, so the hand stays on its pixel while he slides (gate leg H1, under 0.012 units). The head low. The slowest way a man moves |
| WALK-05 | care under fire: TCCC instructor guide (mhs.osd.mil 2011, web archive), TCCC module 3 (tccc.org.ua), UN Field Medical Assistants skill cards (2026) | 'direct casualty to move to cover and apply self-aid if able'; 'if cover is not available or the wounded service member cannot move to cover, they should lie flat and motionless' | HE CRAWLS AWAY, toward cover and his own (the crawl faces the fall + 4: his head lies where his back was). And it ENDS IN STILLNESS: the last weight lies flat and stays |
| WALK-06 | the belly ('commando') crawl: parentingscience.com, flintrehab.com, pathways.org | 'lies on their stomach and inches forward, often swaying side to side, pulling himself forward with his arms... the legs help a bit, fishtailing' | THE SWAY: on each pull the shoulders swing to the pulling arm and the hips the other way (SWAY_R, SWAY_L). The legs drag and do nothing |
| WALK-03 | the Animator's Survival Kit (already in the library) | the walk is a controlled fall | the roll is a body falling over onto its belly, not a turn on a pin |

The numbers taken from them: a pull moves him 0.14 units (about 16 cm: a badly hurt man, a hand's reach less the slack), a
forearm pull 0.05 (6 cm, low and slow), the last 0.03 (3 cm). In all 0.41 units, about half a metre: he stays on his tile.

## STEP 2: THE BAR BESIDE IT

Motion's bar is THE TOWN IS ALIVE ('This is perfect I love it', 10/9; a page, not on the sheet) and the body's is THE THUG
THROUGH THE RIG (body_thug_S, 'analog horror AI slop and I love it', 10/18). The card holds him beside the thug's own fight
picture (tier_thug's stand cell), and in the real fight the thug stands over him. Card fields: bar none:motion (motion has no
key on the bar sheet), nearest body_thug_S, real WALK-04.

THE LINE (ANIMATION holding its own piece to the bar, as the coordinator's brief asks; DIRECTION's eye may overturn it):
beside the bar: SAME, because it is the thug's way (his own clay model through the master rig, one camera, one sun, his fight
sheet's own 63 colours) put in motion, held keys on the beat like the town that is alive; and it does what neither does: a
whole body moving along the ground with the hand that pulls nailed to its pixel, reading at 1x in the real fight as a man
dragging himself away from the thug standing over him. WEAKER, said plainly: the fingers cannot move (the rig's man has no
finger bones, so 'the hand opens' is the wrist rolling and the arm going slack, not fingers), and on half the facings the
pulling arm is behind his own body (the pull then reads through his body and head sliding).

## STEP 4: ONE SOURCE (the model, the rig, the keys)

- THE MAN: cast_barearms (his company's bare-armed crewman), COMBAT's posed whole person (records/combat/rig, PORTRAIT's body
  and starred head on CHARACTER's builder). Picked because the crawl is all arms and his are bare.
- THE POSES: records/target/animation/BOHEMIA_THE_CRAWL.json (the kept source, rule 128), written by
  tools/bohemia_animation_the_crawl.py source from its numbers, in the town tool's format so the town's own pose step
  (LIE, REACH, the joints) lays it on any man. 32 poses: the roll 5, the drag 9, the elbows 12, the last 6.
- THE KEYS: three a beat at 120, held (Crashbox stop-motion). The drag is one bar a pull: the lift, THE HITCH (the reach
  held three keys half way: the stutter in the reach, 390(b)), the reach, the hand DOWN ON BEAT THREE, three keys of pull,
  the rest. The elbows are two bars (each forearm down on beat two of its bar, two keys a step: slow). The last is two bars,
  played once, then its last key held for good.
- THE ARC: the roll, his breath, the drag, two bars of breath, the drag, his breath, into the elbows, the elbows, two bars of
  breath, the last. 162 keys, 27 seconds. Then he lies there with the hand open.
- THE RENDER: COMBAT's render() over DIRECTION's master rig (the same camera, sun, scale, 24 samples, no dents as his fight
  sheet), Stand first so the box is his own: 1 minute 17 seconds for 32 poses x 8 facings on this box (bpy 4.2, python3.11
  venv). Packed the idles' way: each cell cut to what is drawn, the one-pixel day rim, ONLY his fight sheet's own colours (63
  of its 63): slices/rig_crawl/cast_barearms.webp (204 KB lossless, 256 cells), cast_barearms.json, rig_crawl.json.
- THE SLIDE: every key carries how far he has come; the player turns it into rig pixels on the master rig's 45 degree camera
  (x = d sin 45i, y = d cos 45i x 0.707; ppu = scale_from_model x 57 = 64.3 rig px a unit for him), so the screen moves the
  picture and the hand stays. The pull's hand targets are the plant minus the slide, made so by the tool, never by hand.

### THE ROLL AND THE HAND-OFF (nothing jumps when the crawl takes over from the fall)

COMBAT's fall ends on his back with his head where his back was. The roll's first key IS that key: the tool reads COMBAT's
last Fall ops from tools/bohemia_combat_the_fight_poses.py (never copied by hand) and lays them in the crawl's frame.
FOUND AND FIXED: COMBAT turns its bones AFTER its ROOT tips him (the ROOT op sorts first), about the world's axes; the town's
step turns them BEFORE it lays him down. A turn about world axis a after the tip R is a turn about R^-1 a before it; R is -90
about L, so world F is standing -U, world U is standing F: F d -> U -d, U d -> F d, L stays. Before the fix the first key
matched 0.61; after, every joint is within 0.01 units of COMBAT's (the record's probe) and the pictures agree 0.96 within a
pixel, middles 1.8 px apart at worst (S): the same man standing is already 1 px apart at N between the two renders. The roll
starts at BASE, where the fall left his pelvis: 0.179 units along the crawl (measured on his posed model, recorded in the
pack). The crawl faces the fall + 4.

## STEP 5: THE LOOP (what I saw, every cycle, in words)

Cycles 1 to 6 were on contact sheets of the renders and the gate's numbers; 7 to 9 on the real fight; the nine look-tool
cycles are logged in records/target/animation/crawl_look/the_crawl.loop.jsonl with their sheets. 18 cycles in all, not 20.

| # | where | what I saw | what I changed |
|---|---|---|---|
| 1 | contact sheet, side | the roll reads (back, turning, side, belly); on his belly both arms hide behind his big head: a log | the reaching arm out past his head (l 0.32) |
| 2 | contact sheet, front | the drag toward the camera reads, but only the top of his head shows; on the elbows his forearms wrap his own head like a man covering up | the face lifts on the strain; the forearms wider |
| 3 | contact sheet, the last | from the front the right hand slides out toward you and stays: the ending works; the first four keys wrap the head | the same fix |
| 4 | the gate, first run | the pulling hand slides 1 cm (it was put down beyond arm's reach, the arm clamps); the hand hops up and back on the south facing as it leaves the floor; the head lifts and slides back across one key; the roll's arms swing 26 to 41 px in one key | plant inside reach (0.80); the lift rises less than it goes forward (rise under 0.7 x forward); the strain on the key before the plant; one more roll key; the side-lying right hand aimed between the keys either side (it was aimed at his own shoulder and the elbow went under the floor) |
| 5 | the gate | the elbows' forearms never lay flat: the plant was at full arm's length | the plant at 0.70 (shoulder to wrist 0.32 of the 0.445 arm, the elbow near square) |
| 6 | the hand-off picture, all eight facings | the fall and the roll's first key were different men (0.61): COMBAT's turns are after the tip | the axes carried back (above); then the same picture |
| 7 | the real fight, phone | he was buried: the fight dealt him a tile with roofs laid over him and the crowd on top | the capture stands him and the thug on an open patch of street (my staging, not the crawl) |
| 8 | the real fight, phone | there: on the open street, his arm out ahead, the thug stepping past with the pipe; reads at a glance; the drag mark is invisible (it lies under his own dragged legs) | the mark as wide as a body, from the pool; still mostly under him in half a metre: the fight's pool behind his feet is what reads; claimed as nothing more |
| 9 | look tool, the drag from the side | five keys, one man, the hitch, the hand down, the face up on the strain; RAMPS and EDGE fail, but his own fight sheet cells fail the same rows (top 8 34.5%, edge -42): the fight's 64 colours and baked rim | none |
| 10-14 | look tool: elbows front, last up-left, roll side, drag front, elbows side | the elbows are the quietest weight from the front (foreshortened), right for low and slow; the roll reads; the drag at the camera is the frame that should frighten | none |
| 15 | look tool, the last from the side | his left arm sliding back along the ground points straight away from the camera and reads as an arm RAISED | the left hand tucked at his ribs |
| 16 | look tool, the last again | fixed: a bump over his back, the near arm slack ahead, the face on its cheek with an eye showing (W) | none |
| 17 | the VOTE card on a phone | it plays; the thug's head was cut off and he stood on the man's legs; two labels both said AWAY | the thug a tile off, the frame taller, the labels |
| 18 | the VOTE card again | the thug at his feet facing him, pipe down; the man rolls and crawls away from him; eight ways in step | none |

## STEP 6: THE MACHINE CHECKS

- gates/the_crawl_gate.py 21/0 (new): S the source (three weights and the roll, whole bars, the slide never goes back, 0.41
  units); H THE HAND THAT PULLS STAYS PUT on the posed joints; E AN ENVELOPE RAMPS SLOWER THAN THE GRID over all 162 drawn
  keys of the arc, every clip into the next, eight facings, 14 joints: nothing out and back, nothing over 24 px; P the
  pictures (every pose x 8, his colours only, THE HAND-OFF); X the player under node; W wired, and on the real fight in a
  browser his man struck down rolls and crawls (about 100 crawl draws, his drawn pelvis 25.8 px along his crawl, no error).
  Four mutations bite (a slide that goes back, a hand that skates 3 cm, a wrist out and back, a roll started on his foot
  point).
- The envelope gate of the laws (gates/an_envelope_ramps_slower_than_the_grid_gate.js) is scoped to the five hand clips on
  purpose (its own note says why); the crawl's envelope leg is E above, the town gate's ruler on this arc.
- Purity: 0 lava strict, 0 suspect, 0 purple (gates/bohemia_purity_gate.py check_png) on the sheet and in the fight.
- VOTE: gates/vote_tab_gate.js, the card passes every leg including FIRST TIME FINAL F1 to F8 (golden, art_kind motion, bar
  none:motion with nearest body_thug_S, real WALK-04, surface the phone picture, direction PASS with its line). The gate's
  other reds are not this card's: DYNASTY's two old cards and three alpha-landing legs, the same four reds on an untouched
  copy of main (0db6b989), run this round.
- gates/what_a_man_holds_gate.py 15/0 (its W1 read the exact line this round changed; it now takes either form).
- reference_check_gate.py: 514/2, both reds four of COOK's tools (not this lane's).

## STEP 7: ON ITS REAL SURFACE

records/target/animation/crawl_shots/: crawl_in_the_fight_phone.webp (the whole phone screen, 390 x 844 at three to one,
the fight's own camera at its own zoom, his turn waiting) and the close cuts at each weight (roll, drag_reach, drag_pull,
elbows, elbows_pull, last_stop, last_open). Made by tools/bohemia_animation_the_crawl_capture.js (the shared driver), then
tools/bohemia_animation_the_crawl.py shots. A standing man there is about 180 of the phone's pixels (60 points); lying he is
about as long; the whole crawl moves him about 48 of them.

## HOW IT IS WIRED (and what is not mine)

- engine/bohemia_crawl.js: the player (the arc, the slide, the drag mark's start; pure, node-testable).
- slices/BOHEMIA_FIGHT.html (COMBAT's file): one script tag, the marked block __THE_CRAWL__ (crawlDraw), and one changed line
  in blitMan (the crawl is asked before the holds; a crawling man is drawn once). The block only draws: his tile never
  changes. The fight's own pool (rule 145) stays where he fell; the dark drag mark runs from it to him (mostly under his
  legs in half a metre). On each hand or forearm coming down (each on a beat) the fight's existing cloth sound plays
  (cloth_on, already its 'tears free').
- A look with no crawl pictures keeps his fall's last key, exactly as before.

### WHAT COMBAT WOULD NEED TO LET HIM CRAWL A TILE (routed, not built: the fight's logic is not ANIMATION's)

Today a man struck down is off the field (onField false): no turn, no tile change. To crawl a tile:
1. A struck-down man who lives keeps a slot in the turn order with one action: CRAWL, one tile, to a free neighbour, never
   toward a man of theirs (Battle Brothers has no crawl: a struck-down man is gone; this is ours).
2. Leaving a tile next to a man of theirs gives that man a free blow (Battle Brothers' zone of control), so crawling away is
   a risk, and AUTO must weigh it.
3. The AI's choice on a crawler: finish him, or let him go (rule 366, theirs who want to live).
4. The draw already slides: when his crawl has carried him half a tile, his tile moves and the player's base drops by a tile
   (one number in crawlDraw); ANIMATION does that line the round COMBAT lands the rule.
5. Theirs crawling away (rule 390(c), 366) needs theirs to be struck down and live; today theirs die when they fall.

## WHAT IS LEFT (no Paolo needed)

- His pass freezes the recipe (408(b) step 9); then the same tool makes it for every body: the twelve of his company and
  YOU first (32 poses x 8, about 1 min 20 s a man on this box), then the gangs, then the rolled people.
- The fingers: the rig's man has no finger bones; a hand that truly opens needs a hand rig (CHARACTER and DIRECTION).
- The sound: a true cloth-on-concrete drag (SOUNDS; the fight plays cloth_on in its place).
- The other uses (390(c)): the dead-not-yet on the streets (rule 360), a camera feed's figure, the arena's loser, the drug
  crowds if he picks A. The pictures are the same; each is its own lane's call.

[bb crawl]: Battle Brothers draws a struck-down man as gone (the body, the loot); nobody crawls. OURS: the man who lives is
still a person on the board, moving, slowly, toward his own. [analog horror]: AH-01, the ordinary frame with one wrong
thing: the fight goes on around a man who is still moving on the street; held keys (Crashbox); his face on its cheek with one
eye showing; no gore (the red is COMBAT's pool, the mark is dark and mostly under him).

## REFERENCE CHECK (the 9/4 duty)

Compared to the world: WALK-04 (the low crawl), WALK-05 (care under fire), WALK-06 (the belly crawl), WALK-03; AH-01; the
bar: body_thug_S and the town is alive. No reference game was used for the look; Battle Brothers named only for what it
does not have (the [bb] line).
