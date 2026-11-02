# WORLD 11/2 round 2: THE MOMENTS BETWEEN (ask line 273; BUILD 11/2zzb)

His words (11/2, the coordinator's brief): 'The transition of the camp to when time passes by and an enemy wants to attack you,
it's just like sloppy quick bullshit... I want things to look less choppy... less AI slop.'

All measured on the demo at phone size (390 x 844, 3x, tools/bohemia_drive_the_demo.js, phone_portrait), frame by frame through the
browser's own screencast: every frame the screen actually showed, the change between two shown frames as the mean of the whole
picture (0 to 100 percent of full scale) and the share of the screen that moved more than 48 levels in that one frame.

## WHAT IT WAS (before)
- MAKE CAMP: the camp screen came on in ONE frame: 21.1 percent of the whole picture changed between two frames, 52 percent of the
  screen at once (campMake set the frame's display to block).
- BREAK CAMP: the same cut the other way (loopClose: display none in one frame).
- THEY COME: the crew walked in on the camp, the camp screen vanished and the meet card hit in the same frame: 11.1 percent of the
  picture, 14 percent of the screen.
- No moment had a length; nothing was on the beat; there was nothing to skip.

## WHAT IT IS (__THE_MOMENTS_BETWEEN__, slices/BOHEMIA_CITY_WORLD.html)
Three moments on the map, whole beats of 120 BPM, a tap skips each one (the skipping tap is eaten, it never walks him):
- MAKE CAMP, 3 beats (1.5 s): the light goes down round him (the tape's dark, scanlines, one tracking roll), his fire catches on
  the marker with embers going up, the camcorder clock comes up in the corner (DAY d HH:MM, colours a pixel apart), and the camp
  screen comes up over the last two beats.
- BREAK CAMP, 2 beats (1 s): the camp screen goes over both (in one, a slow frame stepped a quarter of the way), the clock RUNS THE HOURS HE RESTED up to now (+N H), the fire dies,
  the light comes back; the world walks again. This is the time passing he sees on the map.
- THEY COME, 2 beats on the road, 3 from a camp: the camp screen goes over the first two, the dark closes red round him and them, a
  ring goes off on them each beat, the card comes up over the last beat and the dark holds while it stands. ENGAGE closes it to
  black in one beat (into the shell's own dust, the fight's door, untouched); FALL BACK and MAKE CAMP NEARBY open it in one beat.
- Battle Brothers first: a camp there is the party sitting down on the map while the clock runs fast; an attack is a party you SAW
  coming (here its plate already says COMING FOR YOU) and its card stops the screen. Our swag: the tape, the clock, the fire.
- THE LOGIC NEVER WAITS. CAMP.on, the frame's display, MEET.up, #meetcard and the fight's hand-off change on the frame they always
  did; only the picture is eased, so every gate and lane that reads them reads what it always read.

## THREE THINGS THE MEASURING FOUND (each fixed, each in the code's comments)
1. THE PAGE STALLS. Breaking a camp (the save) and a crew's hour (the world's six steps) hold the page 300 to 540 ms; a clock off
   the wall jumped the ease past half its way in one shown frame. The moment's clock is now the frames: each drawn frame adds at
   most 100 ms, so a stall holds the picture still and it goes on from there. The ease is a sine (half the cubic's steepest).
2. THE MAP DRAWS IN CSS PIXELS (cvSize's setTransform): the first cut put the fire 100 px up and left of him. Now on the marker.
3. A CLOSED TOWN SCREEN LETS GO. Kept on the glass past its close, the town screen frees its pictures the moment the map marks it
   shut (its iPhone memory rule, which stays) and the phone gives the map its band back (736 -> 844 px): the camp screen redrew
   itself small on black in ONE frame, 33 to 36 percent of the picture, twice. So the screen shuts when it always did, and what
   fades is one copy of its last picture taken just before, let go when the fade ends.

## AFTER (the same probe, the same phone)
| moment | before: largest change in one shown frame | after | frames over 5 percent |
|---|---|---|---|
| MAKE CAMP | 21.1 percent of the picture, 52 percent of the screen at once | 3.5 percent (0.4 percent of the screen) | 0 |
| BREAK CAMP | one-frame cut (display none); the first eased cut measured 31 to 36 | 6.6 percent (5.2 percent of the screen), the first frame after the save's stall | 1 |
| THEY COME (at the camp) | 11.1 percent, 14 percent of the screen | 3.3 percent (2.0 percent of the screen) | 0 |

The gate's own frames (in-page, every drawn frame): MAKE CAMP's screen whole at 1.74 s on the wall (3 beats on the moment's
clock), its largest step 0.15 of the way; BREAK CAMP's picture gone at 1.2 s, largest step 0.07; THEY COME's card whole at 1.57 s,
largest step 0.16, the camp's picture gone at 1.05 s; a tap 0.25 s into a camp made the screen whole on the next frame and did
not move him. Headless draws about 12 frames a second under a camp, so a phone at 60 steps about a fifth of this.

Strips (8 shown frames across each moment, left to right): records/target/world_moments_between/
  before_make.jpg, before_attack.jpg, after_make.jpg, after_break.jpg, after_attack.jpg

## GATE
gates/the_moments_between_gate.js (THE MOMENTS BETWEEN in gates/bohemia_gates.py), B1 to B7, every drawn frame sampled in the page:
made and broken at once, the screens and the card eased with no frame stepping over a fifth (the old cuts stepped the whole way in
one frame), the lengths on the beat, the dark holding under the card, FALL BACK and ENGAGE in a beat, a real tap skipping without
walking him. 7 of 7. CAMP HOLDS UNTIL HE ENDS IT 14 of 14 with this in. MEET BEFORE YOU FIGHT 13 of 15 with it AND 13 of 15 on main without it (M6 ENGAGE again, M10 the walk past a pack: the same two, not this change; RUN's gate).

## NOT TOUCHED
The fight board, the fight HUD, slices/bohemia_phone.js, the town screen (other lanes). The camp's own screen still draws what it
draws; its hours inside it are CAMP's. The phone's band change at a camp's end is UI's; the copy-fade covers it on the map side.
