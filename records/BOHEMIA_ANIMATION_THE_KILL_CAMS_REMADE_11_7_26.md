# THE KILL CAMS, REMADE (ANIMATION, 11/7/26; rule 426(h), ask lines 365 and 498; the coordinator's routine 'ANIMATION: kill cams')

His words: 11/3 (rule 351(f)): 'in the early combat you know we had kill cams, bro why don't we have kill cams here... it will
just like fit into the timing of the game... I always just care about the frames per second.' Then (rule 379): 'Kill cams came in
like ugly dogshit, they are far from final, let's have a kill cam setting while you still work on it, it's fucking with the visuals
they are that bad. Toggle kill cams on or off.' 11/7: 'More' (rule 426(h): ANIMATION takes the kill cams on the beat).

The brief: from the first combat module, in this fight, on the beat at 120 BPM, never costing frames (60 on a phone), never on
every kill (the ones that matter: the last enemy, a big hit, a champion), skippable by a tap; a gate with a planted fail.

## THE ANSWER (for him, eighth grade)

1. A kill cam now plays only when a kill matters: the last man of theirs, a champion or a boss, or a big hit (one blow that took
   80 in 100 of the man's health or more). Every other kill just plays on the board. Measured: about one cut a fight.
2. The picture is your crew's camcorder: the fight itself, blown up with every pixel kept sharp (no more blur), six pictures a
   second on the beat, warm tape, REC and the counter in the corners, the strip of noise at the bottom where the tape head switches.
3. THE LAST ONE (HELD BREATH, four beats): the fall close up, then it pushes in on the man who did it, standing there, with the
   heartbeat. A BIG HIT (HAMMER): the hit and the fall, the tape tearing sideways on the blow.
4. It costs no frames (measured: a kill's frame 7.6 ms with the cams, 8.1 ms without). A tap skips it.
5. It is still OFF in the game until you say it is good (the switch behind the gear, under FIGHTS). The VOTE tab shows before and now.

## WHAT MADE THE FIRST ONE UGLY (COMBAT 7's own finding, 11/3, its record section 9)

The punch-in was the browser scaling the WHOLE finished glass (a CSS transform on the fight's canvas): every pixel of the art blown
up and smeared by the browser's filter; the tags over the men stepped aside and left them bare; and nearly every kill was cut
(a shuffled SHARP, HAMMER, CINE-FOLLOW, ORBIT or X-RAY on any kill he saw).

## THE REMAKE (slices/BOHEMIA_FIGHT.html, the block THE KILL CAMS, REMADE; numbers ours.kill_cams)

- WHICH KILLS (killStake, pure, read off the fight's own log): the last of theirs to fall; a champion or a boss; a killing blow of
  big_share (0.8) of his whole health or more. MEASURED FIRST on six AUTO fights (seeds 23 31 7 11 42 5): 15 kills; the killing blow
  took 0.19 to 1.2 of the man's health; 2 blows at 0.8 or more (1.2 and 0.87, both to the head), 4 last men: 6 cuts in 15 kills.
  The gate's three fights on the shipped tree: seeds 23 and 11 the last man each (HELD BREATH), seed 42 (a lost fight after WEAPONS'
  11/7l) two kills, both blows of 0.8 or more, both cut as HAMMER, a beat each on AUTO: 8 kills, 4 cuts. (The gate's first K2 called
  that fight 'every kill'; one fight can honestly be all big hits, so 'never every kill' is now judged over the run and on the plant.)
- THE STYLES THAT STAY, from the first module, by name: HELD BREATH for the last one and a champion (long_beats, 4; the heartbeat),
  HAMMER for a big hit (short_beats, 2; the deep hit, vital_deep). On AUTO each is halved, never the last one (the fight is over,
  nothing waits on it). Retired with the plain-kill cut: SHARP, CINE-FOLLOW, ORBIT, X-RAY, CHAIN, LAST STAND.
- THE PICTURE: on a new key only (three a beat at 120: six pictures a second), the frame the fight has just drawn is cut and blown
  up by a WHOLE number with no smoothing (HAMMER 2; HELD BREATH 2, then 3 from its second beat) from a whole-pixel origin, so every
  pixel of the art is a clean block (the cheap camera's digital zoom, never the browser's smear), never past the board's own
  picture (the crop is held inside it: no black band). What it holds: the body on the ground; when the man who did it is within two
  tiles, the point between them; HELD BREATH's push holds the man who did it (found on the phone: a last man who falls behind a
  house is covered by its roof, the board's layering, so the push on him showed a roof). Then the tape: the colour washed 0.3 toward
  grey (the tape's chroma), warm (multiplied by 255 232 206), one dark line in every DPR rows at 0.3, the head-switch band at the
  bottom of the open picture (1.6 percent of its height, pulled sideways, specks of light, new every key: real VHS, AH-02 and the
  AV Artifact Atlas's 'head switching noise', about eight lines at the frame's foot), the corners falling off to dark (0.5, the
  cheap lens), on a HAMMER the tape torn 22 points sideways on the blow's key with its top edge bright; the camcorder's own corner
  text in the casing's ROM letters: REC with its dot on the beat, the counter, what it caught (LAST ONE, HELD BREATH, BIG HIT,
  draft:true), the zoom (x2, x3).
- ON ITS OWN LAYER: a canvas of its own over the board and under every button (z 2; the HUD never moves, one game mode), drawn only
  on a new key; the fight's camera never moves; the board's marks stay out of the camera's picture (the men's bars, the outclass
  chevrons, the acting man's tape corners, his rounds, the kill's ripple: each of the five draws one guard, !UI.cut, in COMBAT's
  draw code; under the layer nothing else changes).
- A TAP SKIPS IT (unchanged: the board's tap ends the cut, the layer goes).
- THE SWITCH (rule 379(b)) keeps them OFF until he says they are good; its ON line now says what they do: 'THE LAST ONE, A CHAMPION
  OR A BIG HIT, ON YOUR CREW'S TAPE. TAP TO SKIP.' (draft:true; slices/bohemia_killcams.js).

## THE LOOK LOOP (on the phone's profile, the real fight)

| # | what I saw | what I changed |
|---|---|---|
| 1 | the first try: crisp blocks, the fallen man in the middle, REC and the counter; but the men's health bars and the kill's red ripple blown up into the camera's picture, and a black notch | the board's marks guarded out of a cut |
| 2 | HELD BREATH clean; HAMMER's tear reads; but it reads as the game zoomed, not as tape | stronger lines, the cheap lens's dark corners, the tear 22 points with a bright edge, HAMMER only |
| 3 | better; still not tape | the colour washed toward grey, the head-switch band at the bottom |
| 4 | the HELD BREATH sequence: a black band down the right (the fallen man lay near the screen's edge, the crop ran off the board) and at x3 a roof in the middle | the crop held inside the board's picture; the body on the ground, not the air over it; the killer and the fallen together when close |
| 5 | HAMMER is right (the hit, the fall, the body down, the tear, the crew's 'Woo! Right there!'); HELD BREATH's push still lands on a roof: the last man fell behind a house | HELD BREATH's push holds the man who did it |
| 6 | HELD BREATH tells it: the fall at x2, then the men who did it standing with their door shields, 'That's a nap.'; the red outclass chevrons sneak in at the top | the chevrons guarded out |
| 7 | the VOTE card on a phone: before (the far board, its bars, the blur) beside now (the close tape) | none |

## THE CHECKS

- gates/the_kill_cams_gate.js (rewritten for the remake; ANIMATION's from rule 426(h)): K1 the rule is data; K2 ONLY THE KILLS THAT
  MATTER on three real AUTO fights, PLANTED big_share 0 must read 'every kill'; K3 ON THE BEAT (whole beats, the picture only on the
  key grid, each key once in order), PLANTED a cut of 1.5 beats; K4 THE ART'S OWN PIXELS (whole zooms from whole pixels, the fight's
  canvas never transformed), PLANTED x1.5; K5 the camera never moves, no man's bars drawn in a cut, the tags aside and back, the
  layer gone after; K6 a tap skips it; K7 NO FRAME LOST (7.6 ms a kill's frame with, 8.1 without: the fight's draw and the layer
  together); K8 the switch, OFF by default (the default fight never cuts and never makes the layer; the gear's card on the demo by
  touch). The run before this ship: 9/0 (K5 caught a real slip first: the rule that hides the tags was made a frame late on the very
  first cut of a fight; it is made when the cut starts now). This ship's run: 9/0, after K5 caught a second real one: the last man's
  cut is a full four beats now, and when the fight stops drawing for its end screen nothing ended the cut, so the layer could sit
  under the end screen; a timer now ends every cut on time whatever the drawing does.

## THE CARD

animation-the-kill-cams-remade-11-7 (GOLDEN, art_kind screen, the bar screen_feed_a: the starred camera feeds; real AH-02;
surface records/target/animation/kill_cams/phone_held.webp): slices/vote/ANIMATION_THE_KILL_CAMS.html plays BEFORE (COMBAT 7's
frames, records/target/combat7_11_3/cam_held_NN, cam_hammer_NN) beside NOW (the remade cut filmed in the real fight on the phone,
tools/bohemia_animation_the_kill_cams_capture.js: one picture a key, the song slowed ten times only while the photographs are
taken, shown at the game's own speed), with the game's own sounds.

THE LINE (ANIMATION holding its own piece to the bar; DIRECTION's eye may overturn it): beside the bar: SAME, because it is the
starred feeds' way (the medium baked at the source, six pictures a second, warm tape with its real head-switch noise, the camera's
own corner text, the game's own picture and nothing drawn for it) put on the one moment that matters, where the feeds sit on a
loading screen; it does what they do not: it tells a kill, on the beat, and goes in a beat. WEAKER: it is the board's own camera
blown up, not a camera placed in the street, so a man who falls behind a house is under its roof (HELD BREATH then holds the man
who did it), and its corner text is small on a phone.

## WHAT IS LEFT

- His word: ON by default once he says they are good (rule 379(b)); the card asks.
- SOUNDS: a camcorder's own sound under the cut (the tape's hiss, the REC click) if he wants more than the heartbeat and the hit.
- If he wants a camera PLACED in the street (an angle the board does not have), that is a render of the board from another camera
  and costs frames; not done, said here.

[bb kill cams]: Battle Brothers has none; the first combat module's were ours (RF4's beat, rule 351(f)). [analog horror]: the
bible's R8 'diegetic or dead' (the crew's camcorder is in the world), R10 'grime is baked' (every pixel of the tape is drawn on the
picture, no filter), AH-02 the real tape: damage is horizontal, head-switch noise at the foot.

## REFERENCE CHECK (the 9/4 duty)

AH-01, AH-02 (and the AV Artifact Atlas, avartifactatlas.com, 'head switching noise'); the bar: screen_feed_a (STAR 2); the first
combat module's style names (laws/BOHEMIA_ADDENDUM_COMBAT_DNA_RF4_6_30_26.md). No reference game for the look.
