# DIRECTION [the rig round six]: THE CLIPS AND THE FIRST RUNWAY BODY (10/18/26)

Lane: DIRECTION (art lead). Opened by the coordinator under rules 112 to 117 (Opus 5.5, Extra); no check-in, no question.
His word this answers: YES on rig round five ("THE TRUCK WITHOUT THE FROST, AND THE ROBOT FINISHED BY HAND"), so the row's
gate ("once he thumbs the finished eight") is open; rule 115c (the character models remade through the rig) and 115g
(the demo wears the rig: the clips and the people are what the demo wears).

READBACK: I read [the rig round six] as: the robot's Idle 12 and Walk 6 re-rendered under the current recipe in all
eight facings, the research's hold check (D9) measured on them, the head's one-pixel hole named in the model, PLUMBER's
D6/D7/D8 answer written into the guide's tests, and CHARACTER's first runway body through the rig beside the robot at
1:1 in VOTE; fix in the model or the rig, never in the pixels. Done, with the rig changed four times by what the
measurements found.

## WHAT SHIPPED

| Thing | Where |
|---|---|
| The rig, round seven: THE HOLD (a rigid part under half a pixel since its last drawn pose keeps that pose; a skinned part under it is drawn as a frozen copy of its last drawn shape; a key where every part holds is the key before, copied), THE MOTION TABLE of what is drawn, THE OBJECT-ID PASS on every still and clip key, THE MOVERS' LIGHT pass, THE WEAR BY MATERIAL (hair 0.15, skin 0.25, eyes 0), the portrait class no longer crashes | tools/bohemia_direction_master_rig.py; guide rig keys hold_px, light_mask_samples, light_mask_values, wear_by_material |
| The robot: 8 stills, Idle 12 and Walking 6 in eight facings (152 frames), each frame's shadow layer, object-ID and movers' light | records/target/direction_rig_round_six/robot/ |
| The Mob (CHARACTER's model, rebuilt byte for byte by tools/bohemia_character_the_thirteen_through_the_rig.py): 8 stills and its walk in eight | records/target/direction_rig_round_six/mob/ |
| The measuring tool: the hold, the dropouts, the holes, the ten checks, the player atlas, the sheet | tools/bohemia_direction_rig_round_six.py, records/target/direction_rig_round_six/report.json |
| The VOTE page: the robot's idle and walk and the Mob's walk, eight facings each, on the 120 beat, one art pixel to one phone pixel | slices/vote/DIRECTION_THE_RIG_ROUND_SIX.html (+ .webp atlas, _TABLE.js) |
| The sheet | records/target/direction_rig_round_six/DIRECTION_THE_RIG_ROUND_SIX.png |
| The guide: field 15 hold_check, field 10 silhouette_box (D6), field 7 value_thirds (D7), field 11 orphans (D8) and wear_by_material, tests D6 to D9, two decisions against the research, the portrait class's floor | records/target/BOHEMIA_STYLE_GUIDE.json |
| The gate, leg 8: every round-seven render with clips holds them at the guide's hold_px with a whole motion table and ID pass; the round six report holds the declared idle under the bar with no dropout | gates/style_guide_gate.py |
| VOTE card direction-the-rig-round-six-10-18 (kind animation, a placeholder; twin: CHARACTER's Mob as rendered last round) | records/target/BOHEMIA_VOTE_REGISTRY.json |

## MEASURED: THE HOLD (research round two D9, R11, R12)

The test: every idle key against the key before (the clip loops); the moving mask is every part the motion table moves
half a pixel or more, in either frame, grown one pixel, plus the movers' light; a change is more than 3 values on a
channel (the exact count beside it). The idle is the declared hold. Bar: under 3 percent of the opaque pixels.

| The robot's idle | Exact change outside, worst / mean | Visible change outside, worst | Dropouts |
|---|---|---|---|
| The recipe, no hold | 71.79 / 14.89 % | 10.88 % | 1 |
| Rigid parts pinned | 28.63 / 6.82 % | 6.48 % | 1 |
| + a whole hold repeats the key before, + the movers' light at 6 values | 25.94 / 4.29 % | 4.71 % | 1 |
| + the movers' light at 3 values | 23.77 / 3.94 % | 4.49 % | 1 |
| + skinned parts hold their shape (final) | 10.55 / 2.25 % | 0.28 % | 0 (one hidden by the turning head, one an ID-pass boundary flip with the picture unchanged) |

(The first four rows' dropout is the one the last row tells apart: the upper leg's 3 px sliver under the turning head.)

What each step found:
1. A part that drifts a fifth of a pixel changes most of its pixels: the grain stuck to the surface is sampled again
   at a new sub-pixel offset (the head at 0.27 px, nothing else moving, changed 9.8 percent of the sprite visibly, S key 0). Pinning fixed the rigid
   parts.
2. Two renders of the same frame are identical bit for bit (measured), so a key where everything holds is now a copy
   of the key before (16 keys of the 96 idle frames).
3. When only the head turns (keys 3 and 9, 7 to 17 px), its shadow sweeps the torso and its bounce re-lights
   everything by 1 to 3 values; that is the head's motion, which a stop-motion head turn throws too, so it is masked
   (white clay rendered with and without the movers in the light).
4. The last visible change was the hands: skinned to finger bones, a third of a pixel of finger drift resampled them
   (107 and 115 px), and their changed bounce showed on the shin. A pin cannot hold a bend; a frozen copy of the
   last drawn shape can.

The walk is not a hold (every part moves every key) and is read only: the robot's lower leg is lost once (key 2, behind the other leg on the stride), and the Mob's hands go behind its body and cape on the swing in 7 facing-keys; a walk is not a hold, so these are read, not judged.

## MEASURED: THE TEN CHECKS AND THE CARD (S still)

| | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | D9 | R2 | card under the guide |
|---|---|---|---|---|---|---|---|---|---|---|---|
| robot (S) | ok | ok | ok | ok | ok | ok | ok | ok | ok | 1 colour only on the boundary | 0 of 8 out |
| Mob (S) | ok | ok | ok | ok | ok | ok | ok | ok | ok | 1 colour only on the boundary | 1 of 8 out (value span 102 against 118) |

R2's one colour each is a ring pixel beside a one-pixel hole (the robot's is the head's crack, below; the Mob's are
between a hand and the coat). D10 is the UI leg and reads no sprite.

PLUMBER's three readings, now the guide's tests D6 to D8: D6 reads the 8x8 box (at 3x3 every render was a box), D7
the 1st to 99th percentile (the two eye glints no longer squeeze the light third), D8 against the prop packs' band
(284.8 orphans per 1,000): the robot now reads 283.8, inside it (round five was past it: the truck's recipe of
old paint and worn edges changed the speckle), the Mob 245.3.

## THE HOLE IN THE ROBOT'S HEAD, NAMED

The head mesh is 466 loose faces (the export splits every face); welded by position it is 29 pieces. A camera ray cast
through each hole pixel (NW 43,12 / 30,22 / 29,23 and NE 77,24) hits nothing and passes between piece 0 (the head
shell, 230 faces, the grey band and the mustard dome) and a black 12-face side plate (pieces 25 and 26, about
0.4 x 0.2 x 0.1 m) that stands 1 to 2 cm off the shell: at 57 px a metre that crack is a third of a pixel to 1.3 px,
and seen edge-on from NW and NE it shows one pixel of sky. The shell is closed except for the 6-edge bolt rings, so
nothing is open under the plate. It is the model's design (an ear plate standing proud), not the rig's: the fix is in
the model, seating the plates on the shell, and it waits for his word on the robot (it is the bar he loved).

## THE FIRST RUNWAY BODY: THE MOB, NOT THE ANARCHISTS

The row's body was meant to be the most runway of CHARACTER's thirteen. The Anarchists (lanky, a wrap coat, stacked
boots) came first, and rendered with a PURPLE coat: CHARACTER painted it the Anarchists' runway accent (#c026a0, a
magenta, vibrance down), and purple belongs to the Amalgamation alone (PURPLE RESERVATION). Their territory colour is a
brown leather (#513a27). So the body beside the robot is the Mob (lanky, a charcoal shoulder mantle, pinstripes,
cropped trousers, stacked soles: the Rick Owens line, no colour-law question), and the Anarchists' coat is routed to
CHARACTER. The same render showed every dark crown dusted grey (CHARACTER's and COOK THREE's finding, sent to me twice):
the rig now gives hair, skin and eyes a share of the dust and chips, and the Mob's crown is charcoal again.

Mob card: 1 of 8 out, the value span (102 against 118: a charcoal mantle and pinstripe over dark trousers have little light in them), not BACK; CHARACTER's round-five Mob read 101 on the same row, so the recipe did not darken it, and its crown went from grey to charcoal.

## DECISIONS (in the guide's decisions list, with the reasons)

1. Research C3 (snap the root to the pixel grid) TAKEN PER PART: the robot's hips bob 0.7 to 1.0 px while its feet
   are planted, so a root snap makes the feet creep instead; holding each part under half a pixel is what a
   stop-motion animator does.
2. Research D9 (XOR, 3 percent) TAKEN WITH TWO READINGS: a change is more than 3 values (a path tracer re-lights every
   part by 1 to 3 values when anything moves; the exact count is printed beside it), and the movers' light is motion.

## ROUTED

- CHARACTER: the Anarchists' coat renders purple (accent #c026a0); PURPLE RESERVATION. The look's territory is a brown
  leather (#513a27). The rig's dust no longer greys hair (wear_by_material); the hair-normal work-round can stay.
- PORTRAIT: the dust and chips are off skin now (skin 0.25, eyes 0) and --class portrait no longer crashes; your crew
  renders at --wear 0.45 are the 13 reds of THE STYLE GUIDE GATE (a break outside a dont_ folder); re-render at the
  guide's wear and they go green.
- PLUMBER: D9 as the research wrote it (XOR) counts a path tracer's 1-to-3-value re-noise; the guide now reads more
  than 3 values with the exact count beside it, and the movers' light as motion. NOT VIBE CODED's D9 is the mirror
  check, a different test with the same number; the hold lives in THE STYLE GUIDE GATE leg 8.
- RUN, CHARACTER, ANIMATION, COOK, PORTRAIT: ground_px in every rig.json before rig round 7 is the look point (the
  image centre, half the height up); the true ground is ground_px y + real_dims_m[2] x ppm / 2. Round 7 renders write
  ground_px (the ground) and look_px (the old value).
- RUN (rule 115g): the robot's idle and walk are on disk in eight the moment the card passes:
  records/target/direction_rig_round_six/robot/rig_{Idle|Walking}_<F>_kNN.png, one crop box (ground_px in rig.json),
  each with its shadow layer.

## FOUND AFTER THE SHIP: ground_px WAS THE LOOK POINT

The VOTE page, checked at 390 px (24 canvases drawing, 0 errors, no sideways scroll), drew its ground line across the
robot's chest: rig.json's ground_px has been the IMAGE CENTRE since round two, which is the camera's look point at
half the body's height, not the ground. The model's ground centre sits look_z x sin(tilt) lower on the screen, which
under the 3/4 stretch is half the real height in pixels (the robot 49 px, the Mob 50). Rig round 7 now writes the
true ground_px (the world origin projected) and keeps the old value as look_px; the two renders of this round carry
it by the same formula (robot 53,69 -> 53,118; Mob 41,61 -> 41,111), the renders unchanged. Every render before this
(CHARACTER's fourteen, ANIMATION's beasts, COOK's props, PORTRAIT's crew, the truck RUN put on the map) carries the old
number: a lane that placed a sprite by ground_px placed it by its middle. That is CHARACTER's 10/17 finding ('clothes
placed by the ground sit 16 px low') seen from the other side.

## NOT DONE, SAID

- The hand-finish (research Section B) is on the round-five stills only; the clips are raw from the rig.
- The robot's ear plates are not seated (above).
- The Mob is one of fourteen; the other twelve render through the same call when CHARACTER re-renders.

[bb Battle Brothers draws its men as still paper-doll pieces between moves, so nothing on them can shimmer; ours
animate, so the bar is the same stillness: a part that is not moving never changes a pixel.]
[analog horror: a stop-motion puppet only moves where a hand moved it; everything else holds dead still, which is what
makes a clay show uncanny. The rig now holds the same way.]
