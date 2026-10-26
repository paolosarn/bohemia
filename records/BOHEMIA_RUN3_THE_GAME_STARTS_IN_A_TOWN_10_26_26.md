# RUN THREE -- [the game starts in a town] (10/26/26)
# Rule 236 (records/BOHEMIA_PAOLO_THE_GAME_STARTS_IN_A_TOWN_WITH_THE_SQUAD_UP_CLOSE_10_26_26.md); the coordinator's routine
# trig_013jpQRR1pu9P5mVugBfLJRa handed the row to RUN THREE after [your crew lives in the town].

## HIS WORDS
'when the game starts up... some sort of introduction vibe where you get a close-up of the squad, and then instead of starting in
map mode it will start on settlement mode... the closest settlement... whatever the math is right now... maybe depending on the
origin that impacts where you will be.'

## MEASURED BEFORE
BEGIN lifted the door onto the map at the origin's corner (RUN's __A_FRESH_START_AND_A_FOG_OF_WAR__: TUNING's START_KINDS, the
Faithful by a chapel, the water truck at a truck stop or on the road, up from Henderson on the south freeway, the Lone Wolf alone
three blocks from anything). No squad was shown; the first screen was the map.

## WHAT IS BUILT
1. THE SQUAD UP CLOSE (slices/bohemia_the_squad_up_close.js, BohemiaSquadUpClose.play): over the shell's whole screen (the top
   document, so nothing of the map or the HUD shows), a found tape: one second of black and a breath of static (nothing happens),
   then each man his origin rolled, his own 3D head (engine/bohemia_crew_faces.js, the crew screen's), his name and trade (the
   roster's words, BohemiaRoster.bgName), his level past 1 and his stars, about two beats a man (shorter for a big crew, about
   five and a half seconds for all), then the crew together under the origin's name and the crew's; analog horror at the source:
   grain drawn on the beat, scanlines, a tracking band rolling a step a beat, the head a pixel off on the beat with its colour split,
   PLAY and a counter. From the second on, a tap, a click, Escape, Enter or Space skips it. A Lone Wolf's tape is one man.
   THE SONG (rule 237) is SOUNDS': the tape asks the shell's __originSong(origin, 'intro') when it starts and ('done') when it ends,
   if SOUNDS defines it; until then the room and the pulse BEGIN already started are what plays.
2. THE TOWN FIRST (slices/BOHEMIA_CITY_WORLD.html, __THE_GAME_STARTS_IN_A_TOWN__): mapStartIn on a NEW game (not a CONTINUE: the
   purse's start ledger returns first; not the bench's valley with the dark lifted) calls startInTown: the tape's black at once,
   the tape, then the closest settlement to the corner freshStart picked, by the map's own measure (startPick's townNear: blocks, the
   longer side; the straight line breaks a tie), any tier; the company is put in it (city.x, city.y on its block, the dark clearing
   round him as it does wherever he stands) and its SETTLEMENT SCREEN opens (loopOpenTown). Leaving it is the map at that block.
   The men on the tape are named and dressed as the crew screen will (startSquad: ours.json's crew at his place, the origin's
   background and level, the rolled stars; the same lookFor rule), so the same men stand in the town after it.
3. THE ORIGIN'S PLACE, A MODDER'S: an origin row in records/target/bb/origins.json with a start_kinds list (district kinds, START_KINDS'
   words) replaces TUNING's built-in kinds for that origin (RUN TWO adds the field, rule 236(c)); with none, the built-in table
   already places the coordinator's three defaults.

## GATES
- NEW gates/the_game_starts_in_a_town_gate.js THE GAME STARTS IN A TOWN 15/0 (run in parts, GATE_ONLY=faith | truck,wolf | bench):
  S1 the tape showed every man (the Faithful's four, the water truck's three, the Lone Wolf alone on the computer), armed at 1002 to
  1010 ms, the same names in the town; S2 the first screen after it the closest settlement (Remnants 2 blocks, Blues 3, Blues 10 for
  the wolf); S3 a real LEAVE and the map on the town's block; S4 a tap at half a second leaves the tape on, a tap after the second
  ends it in under 30 ms, his heads drawn; S5 the bench's valley begins on the map as before; S6 nothing threw.
- RE-AIMED, because rule 236 changes what follows GO:
  gates/the_place_in_the_dark_gate.js (WORLD's): it measures the map, so it leaves the starting town by a real tap on LEAVE first:
  20/0 (main 19/1).
  gates/only_the_final_look_gate.js (RUN's): node ran out of memory on the new start (it kept every screen frame while the driver
  waited, and the busy town repaints every frame: 55 frames a second, 1.9 GB in 70 s); it now keeps only the frames it compares
  (GO's first four seconds, else the last three); with the tape, F4 compares GO's first frame with the tape's quiet second (+600 ms)
  instead of +3 s: 5/0 on the phone, 5/0 on the computer.
- Green: A FRESH START AND A FOG OF WAR 8/0, SIGHT DOWN THE STREET 6/0, DEMO BUILD 25/0.

## FOUND ON THE WAY (for RUN)
tools/bohemia_drive_the_demo.js waits up to two minutes for MODE === 'human' with eight pad buttons; on main and here the map's MODE
after GO is 'city' and the pad buttons are hidden, so every stranger's-game driver run waits out the full timeout (measured: open()
43 s on main with world: 30000; 55 s here, the start in a town adding the card sweep's patience). Not changed here.

## NOT DONE (rule 236 in full)
- (d) the origins made personal (their own look, their unique things to buy): his direction, not this round.
- ROUND TWO DONE (BUILD 10/26zj): each man on the tape is his HD head beside his own body MOVING, ANIMATION's town cells
  (BohemiaIdles.activity, his own seed's activity: a smoke, a drink, a lean) at a whole-number zoom with smoothing off (their
  NOTE), loaded during the quiet second; the group shot stands them two and two, talking. A man with no cells yet keeps his head
  alone (.hd.solo). S4 counts both ('cell' and 'fresh'): faith 1 body moving, wolf 2 of 3. ONLY THE FINAL LOOK 5/0 phone and 5/0
  computer on the new tape. The faces breathe when PORTRAIT's rule 246 lands in the crew faces (nothing to change here).
- The origin's song is SOUNDS' (rule 237): the hook is in, the table is not.

[bb Battle Brothers opens a campaign on a painted card about who these men are, then the company beside a town on the map. Ours
opens on the men themselves and puts them in the town.]
[analog horror: it opens like a tape somebody found in a dead man's coat: their faces, one by one, and a counter that keeps going.]
