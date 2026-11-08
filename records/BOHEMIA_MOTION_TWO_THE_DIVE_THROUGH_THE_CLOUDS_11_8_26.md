# THE DIVE GOES THROUGH THE CLOUDS (MOTION 2, 11/8/26; rule 401(a), ask line 442; rule 426(d) 'Needs more better'; rule 430)

BUILD 11/8 - THROUGH THE CLOUDS. Files: slices/bohemia_motion.js (__THE_DIVE_GOES_THROUGH_THE_CLOUDS__, the come-down re-timed in
flight, the bar's lift on the compositor), gates/the_zoom_down_into_the_board_gate.js (C1, C2), the demo re-cut.
VOTE motion-2-through-the-clouds-11-8 (STAND-IN, 408(c)).

## HIS WORDS AND WHAT STANDS
Paolo 11/4 (rule 401): 'when it's combat time the clouds aren't just on a brown black background but zooming in from the city from
how you have it zoomed in.' Rule 401(a): the way into a fight dives from the map, the clouds passing between the camera and the real
ground, the way out climbs back the same way. His vote on the 11/6 zoom down: 'Needs more better' (rule 426(d), MOTION 2 carries it).
His vote on 11/7h (THE WAY INTO A FIGHT): YES, and 'keep going' (the coordinator's routine, 11/8). Rule 430: art is improved, never
thrown away. KEPT WHOLE from 11/7h: the compositor dive, the tape (REC, the timecode, tracking from the frame's own pixels, the hum),
the turn, the grid scanning on, the brackets, the colours bleeding, the rewind home.

## READ FIRST: PLUMBER 7's NUMBERS (11/7zd, records/BOHEMIA_PLUMBER_THE_MAP_S_LIGHTS_AND_EVERY_CHANGE_AT_SIXTY_11_7_26.md)
On the page's thread at full speed: the come-down 44 fps (worst 100 ms, the map still drawing under it), the hold 20 fps (worst
850 ms: the fight built under the tape), the turn 16 fps, the way out 33 (worst 250); THE BAR'S LIFT INTO A FIGHT 20 and 7.8 fps
(MOTION's own: the old main-thread morph, the page's thread busy with the dive's draws at the same moment). The tape's own frames are
the compositor's (40 to 48 ms worst at 4x, 11/7h's gate).

## WHAT CHANGED
1. THROUGH THE CLOUDS. The old clouds' own art (RUN 10/2, deleted 11/6 with its loading look): the valley's dust and ash, a billow field
   lit from above and dark beneath, the bible's grain. KEPT: its two billow layers, the same painter, palette and shapes. DROPPED: its
   third layer, the solid dusk floor (the brown backdrop he hated). IMPROVED: the billow thins out at its edge and its light is mixed,
   not switched (a hard cut over the real city read as camouflage blobs: seen, fixed); thin enough that the city reads through the
   thickest of it (at 0.78 and 0.7 it was a tan wash: seen, now 0.58 and 0.5). Painted ONCE, a few rows at a time in idle time (never at
   the door), at half the glass's points, 1.4 times its size. On the dive the camera comes down through the deck on the compositor: seen
   from above, the near layer growing faster, both parting off the edges round the block, the real map's own pictures under it in every
   frame, clear well before the stop; a dive too short to pass a deck has none; the climb home goes back up through the same deck.
2. THE COME-DOWN TIMES ITSELF TO THE PHONE. The map draws its people and names at one size, so a picture shown long past its own zoom
   makes them giant, and they snap back when the next picture lands. On a slow phone the pictures came late (measured at 4x: a picture
   every 550 to 1,030 ms against a one-second come-down). Now: after the first in-between picture is drawn the pace is known, and the
   camera slows from where it is, the progress kept, every picture and the deck rebuilt on the new clock (at most 4 beats); the next
   dive starts from the pace measured on this one. A FIX FOUND ON THE WAY: the timeline's own clock stands still through a long task
   (133 ms read where 365 had passed, right after a map draw): the elapsed time is read off performance.now (the same time base).
3. ONE ANIMATION A PICTURE: each picture's pose and opacity in one Web Animation on the come-down's one clock, rebuilt in place when the
   picture over it arrives (two animations, one pending and one on the clock, reached the compositor a frame apart: seen once, a picture
   a frame without its pose). The hand-over between pictures is a 230 ms dissolve (the names and people settle, never snap).
4. COVER FOR THE WHOLE STAY: an in-between picture is drawn at the zoom that keeps it covering the glass from the moment it is laid to
   the moment the next one is (the camera pans as it comes down; one covering only at its laying left a band).
5. THE BAR LEAVES ON THE COMPOSITOR (PLUMBER 7's 20 and 7.8 fps): a copy of the bar rises off the top as a Web Animation on the beat's
   grid, logged as the piece's flight (THE UI MORPHS M8 reads it).
6. THE CLIMB HOME at the camera's own pace (it draws nothing), not the stretched come-down's.

## NUMBERS
THE ZOOM DOWN INTO THE BOARD 32/0 (one run: phone 15, computer 12, phone at 4x traced 7, S1). The deck on 22 frames of the way down on
the phone (28 on the computer) and 33 / 32 of the climb, thickest 0.58, a map picture under it in every frame, none in the hold. The
phone at 4x (the trace, DrawFrame): the way in 676 frames in 11.9 s, median 16.7 ms, p90 21.4, worst 52 ms, none over 100 (the
come-down re-timed to the phone's pace); the turn worst 52; the way out 119 frames, median 16.6, p90 21.3, one frame of 422 ms
(under a beat) inside other pages' work after a fight. At 1x the pictures are drawn in 20 to 70 ms and the come-down keeps its own
1.05 s (phone) / 1.35 s (computer).
THE TOWN SHOWS 10/0 (rule 414). THE UI MORPHS phone 19/6 (M8 green with the bar's compositor lift: planned 293 ms, 0 frames without
it; the six reds are main's, as PLUMBER 7 recorded: the camp's grow and shrink, the old phone's fold and return, the fight's phone fold
and back).

## WEAK, NAMED
- On this box at 4x (software canvas, PLUMBER 7's note) the come-down stretches to its 4-beat cap and the in-between pictures still
  show the map's names up to about 2.2x before the next lands; a real phone's GPU canvas draws the map far faster, so the camera keeps
  its own pace there. A map draw without its names for the dive's pictures would end it (PLUMBER 7's / WORLD's switch).
- The 2.1 s between contact and the camera moving is still the map's own frames before the shell reads the fight's message (RUN).
- The fight's build under the tape grew to 7 to 9 s at 4x on this box this round (COMBAT TWO's dressed boards, its kit decoded once).
- A page error in the fight's own figure drawing (BOHEMIA_FIGHT.html blitMan, 'drawImage: the provided value is not of type'), seen
  in one watch and in PLUMBER 7's runs: COMBAT / CHARACTER.

[bb] Battle Brothers cuts to its battlefield behind a loading screen; ours comes down through the valley's own dust onto the street.
[analog horror] the deck is the valley's dust and ash, flat and lit from above, the camera on its mast sinking through it to a street
that is already being recorded.
