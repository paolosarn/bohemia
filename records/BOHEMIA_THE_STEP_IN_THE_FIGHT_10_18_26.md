# THE STEP IN THE FIGHT (SOUNDS, 10/18/26)

Row: [the step in the fight] (VAMILY, SOUNDS), the next round of [steps from a recording]. Claimed sound-opus-10-18d
(3f7bb2be), opened by the coordinator under rule 112, run on Opus 5.5 under rule 116.

## THE RULINGS THIS ROUND ACTS ON

- The row: the party's step on the house tiles of the fight is still an engine render; FIRST, the same four CC0 walks
  and the same cuts, one cut per tile crossed, the tile's floor naming the surface, one engine call retired; one VOTE
  item on the fight's own camera. Constraint: real material, no sand, 120 BPM, the demo is RUN's cut (rule 93).
- Rule 108b (10/10): a sound starts from a recording. Rule 32e: no sand. Unjudged is silent.
- The two-scales law (9/27): every cell's drawing agrees with what it is. A COMBAT TILE IS A HOUSE (9/4, 9/28).
- His fourteenth votes, read this round: UP on sounds-the-steps-from-a-recording-10-18 (the map's real shoes). That
  is CUE 7.1, RUN's next cut; the row now says his YES is in.

## WHAT WAS THERE

The fight is slices/BOHEMIA_FIGHT.html, its own slice, opened in a frame by the alpha and the demo (the demo loads it
live, no cut). Every tile a man crosses is one 'step' event, a quarter beat long at 120 BPM (beatMs()/4 = 125 ms).
startAnim calls SND.step() for it, and SND.step is `tone(70, 0.05, 0.05, 'triangle')`: one 70 Hz triangle beep, the
same for every man on every floor, straight to the speakers. No gate checked it. A fight tile names only its RULE
(flat, rough, debris, water, height, blocked: Battle Brothers' costs), never what it is made of.

## WHAT SHIPPED

- THE FLOORS, READ OFF THE PICTURES: tools/bohemia_sounds_fight_floors.py reads every one of COMBAT TWO's 35 fight
  blocks (five tiles by five, 875 tiles) into slices/vote/travel_steps/fight_floors.json. First match wins: a casino
  block is carpet (the picture is one red carpet); a kit-plan road piece is asphalt (the plan's key is 'row,col',
  measured: the first cut read it as 'x,y' and put north-south roads on every east-west street, caught by eye on the
  table against the contact sheet); a tile drawn at least 30 percent dark grey is asphalt (the strip's parking, the
  freeway's lanes, the cul-de-sac's ring); everything else is the gravel walk (the yards, the scrub, the wash, the
  rubble, the landfill, the roofs: a flat Las Vegas roof is tar and gravel). 182 asphalt, 618 gravel, 75 carpet.
  --check re-derives the table and fails on any difference.
- THE CASINO FLOOR: mlsulli's 'Footsteps_Carpet' (CC0, Freesound 234855, ESC-50 5-234855-A-25), the one carpet walk in
  ESC-50's footsteps class, fetched from GitHub this round, FLAC in the bank, licence line in LICENCES.md and the
  frozen sources file. Six footfalls, five kept: the sixth's heel lands 120 ms after its cut starts (measured: -21.8
  dB in its first 60 ms against -12 for the others), and in a fight that is a step landing late. 4 dB under the
  street: carpet eats the hit. tools/bohemia_from_a_recording.py --steps=carpet renders one surface and keeps the road
  and gravel byte for byte (md5 unchanged, checked).
- THE PLAYER: engine/bohemia_travel_steps.js (the map's file, CUE 7.1) gains STEPS.step(AC, bus, floor, at, who): one
  footfall, never the same cut twice in a row on one ground, the map's own level (REL 0.5), a man's new step cuts his
  last one short in 20 ms (a choke, so a quick walk never smears: a gravel cut is 380 ms and a tile is 125 ms), a step
  that comes before its sprite has loaded is dropped, never late. STEPS.floorAt(S, x, y) reads the deal
  (S.boardDef.blocks) and the crop (S.crop). N is per surface now (8, 8, 5).
- THE VOTE ITEM: sounds-the-step-in-the-fight-10-18, slices/BOHEMIA_THE_STEP_IN_THE_FIGHT_10_18_26.html: the real
  fight (untouched) from its own camera, playing itself on AUTO, one seed for the A/B. STREET (a suburb board: the road
  and the yards), CASINO (the named casino board: carpet), STREET: WHAT PLAYS NOW (the fight's own beep, the same call)
  and STOP. The page wraps startAnim in the frame (the alpha already reads FIGHT through the frame the same way), lays
  the step at the moment the fight starts it, and stands the beep down on this page only. Only the steps make a sound
  there, so they are what he hears; the fight's shots and hits go to the alpha's engine and are not on this page.

## NOT IN THE GAME YET, ON PURPOSE

The fight file and the alpha are untouched (unjudged is silent; the demo loads the fight live, so a fight byte is a
demo change, rule 93). The swap is CUE 7.2 in BUILD_CALLING_SCRIPT.md, on his YES: the fight loads the engine file,
STEPS.loadFloors() at boot, startAnim passes the step's event to SND.step, and SND.step plays STEPS.step(AC,
AC.destination, STEPS.floorAt(FIGHT.S, e.x, e.y), AC.currentTime, e.id) in place of the tone. Three lines in the
fight's sound block, the beep's own path and moment. FOR COMBAT: that is the only change to your file, in the block
SOUNDS already wired (rule 54b, 10/4), and only on his YES. The gate turns red if the fight loads the file without it.

## GATES

- fight steps 34/0 (new, gates/fight_steps_gate.js, registered as FIGHT STEPS): the table is the pictures (the tool's
  --check), every block five by five, 120 of 120 road pieces asphalt, 75 of 75 casino tiles carpet, every floor a
  sprite, a cut count the engine knows and CC0 sources with no sand; unjudged silent; registered. In a real browser:
  the carpet's five cuts decode in their slots (hit within 60 ms); the street fight at three times the speed, 34 to 35
  tiles crossed and the same number of steps, 0 dropped, every step on the floor the table gives its tile (re-read in
  the gate from the deal, not the engine), road and gravel both heard, no cut twice in a row, 25 choked and 0
  overlaps; the casino 17 of 17 carpet; WHAT PLAYS NOW all beeps and no shoe; STOP silent; the four buttons fit a 390
  px phone in two rows; nothing threw. MUTATED: floorAt forced to gravel turns three claims red (31/3), restored.
- travel steps 31/0 (N per surface), from a recording --check PASS, gate registry 7/0.
- vote tab: red before this round on DYNASTY's two items with no 'where you see it' (dynasty-flip-at-crisis-10-9,
  dynasty-animal-era-10-10), unchanged; it caught this item's own 'why' at three sentences, cut to two.

## [bb] AND THE REAL WORLD

- Battle Brothers: how its fight sounds a move (by the ground or by the armour) is not in the library, and one search
  found nothing; asked, not answered. This round followed the walk's own rule instead: one step per tile, on that
  tile's ground.
- The real-world practice it follows: footsteps in shipped games are switched by the surface under the foot and drawn
  from a pool that never plays the same take twice in a row; the floor comes from the level's material data, here
  from the drawing itself, because the fight's data names costs, not materials.
- The finding that proves us wrong: the fight's tiles carry no material at all, so every floor-aware sound the fight
  will ever want (a fall, a dropped gun, a body on carpet) needs this table or its successor in COMBAT TWO's data.

## [analog horror]

Real shoes through the same tape chain as the map (high-pass 120 Hz, tape at 0.8, low-pass), no reverb tail, no
music under them on the page: a house crossed in an eighth of a second, heard as a dry, close scuff on a recording.

## NEXT

- On his YES: CUE 7.2 (three lines in the fight). On B (quieter): NUM.FIGHT.REL down 3 dB, one number.
- The gaps, named: the shore's wet band plays gravel until a real wading recording; the casino board is in the bank
  but no live deal uses it yet (no family in ours.board_mix holds it), so the carpet is heard on this page only until
  COMBAT deals it.
- The next engine call to retire in the fight: the flee's two triangle tones (SND.flee), from a recording.
