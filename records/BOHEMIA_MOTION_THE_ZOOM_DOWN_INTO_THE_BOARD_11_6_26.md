# THE ZOOM DOWN INTO THE BOARD (MOTION, 11/6/26; rule 407(g) STEP TWO, rule 417(b), ask line 450)

BUILD 11/7b - THE ZOOM DOWN INTO THE BOARD. Files: slices/bohemia_motion.js (__THE_ZOOM_DOWN_INTO_THE_BOARD__, BohemiaMotion.dive),
slices/BOHEMIA_ALPHA_0_9.html (the clouds deleted, nfOpen hands its build to the dive), the demo re-cut. Gate:
gates/the_zoom_down_into_the_board_gate.js (THE ZOOM DOWN INTO THE BOARD, registered in place of THE ZOOM GOES THROUGH CLOUDS, which is
deleted). VOTE motion-the-zoom-down-into-the-board-11-6 (STAND-IN: the zoom, not the look).

## HIS WORDS
Paolo 11/4: "I don't want even a real loading transition between combat, I low-key just wanna see it zoom in... as you zoom in that's
what starts to unfold." Rule 407(b): contact, and the camera zooms down into those streets from wherever he was; the grid lights up on
the ground, the fight starts; after it the grid fades and the zoom goes back out. 407(c): the map is a diamond, the fight's grid
square; the zoom turns on the way down (the coordinator's lead). 407(d): stream only around the fight, hold 60 (rule 400). 405(a): the
cloud dive and any loading picture retired in the same push. 404: the transition's look (407(h)'s tape roll, REC, a face) is for final.

## MEASURED BEFORE (main 06ca3ec2, the demo, 390 x 844)
The door (the shell's nfOpen) rolled three layers of painted cloud over the whole glass (RUN's __THE_ZOOM_GOES_THROUGH_CLOUDS__, 10/2),
built the fight's page 250 ms later under them, held them until the fight's loading line was gone and parted them over the board; going
home they closed over the end card and parted over the map. The map and the board were never on the glass together, and COMBAT TWO's
step one (b6f4215c) had just made the board the map's own block at one ruler, so the two could be married.

## WHAT IT DOES NOW
1. COME DOWN (the map's own camera): on contact the map's zoom climbs on the log from wherever he was to the fight's size and the
   fight's block slides to the map's focus, one map draw a frame (the same painter and houses as his pinch). The stop is the size the
   last fight on that glass opened at (the first: a block a third of the glass's short side, the phone's measured 132 px), never past
   WORLD 8's street stop nor short of the near stop: on the phone the map's block ends 1.007x the board's, so the turn has nothing left
   to zoom. The painter is asked for the stop's own tiles round the fight's block from the first frame (its own one-at-a-time ask), so
   the street is being painted while the camera comes down; a beat and a half of SETTLE at the stop lets it land (it goes on at once
   when it has).
2. HOLD: one copy of the map's last frame is laid on the glass (#bmdive, z 55, under the phone) and the fight's page is built under it:
   the build's stall (2.0 to 2.5 s on this box) shows the map's own street, never a loading picture.
3. THE TURN (two beats): the map's frame turns an eighth of a circle and stands up from the map's half aspect to the board's own, about
   the fight's block; the fight's board canvas is turned the same way backwards from where it will rest, so every frame the two put the
   same street on the same pixels (an affine marriage: map block (u, v) to board tiles (3u, 3v)); the map fades into the board through
   the turn's second half, where the angle is small. The turn's corners show the same two frames standing still (inside the fight's
   page, under its canvas), never black (rule 404's 'no black or brown bars'). While the map's frame still covers it, the board and its
   still copy are at opacity 0 (not composited): half the pictures for the first half.
4. THE GRID LIGHTS UP: the board's own tile lines scan on from the far edge through the turn's second half, hold a beat, fade to the
   board's own faint grid. NFC.state goes 'off' as the turn ends: the fight is his.
5. OUT: the grid lights over the board's last frame and fades; the board's frame turns back to the map's angle together with the map's
   frame from the way in (kept at one pixel a point, 1.2 MB, since the painter lets its pictures go during a fight), while the live map
   is laid back at the stop under them and asks its painter again; the map's bar comes down from the top; the map's own camera climbs
   back to the zoom and place he was at, his crew held as the map holds it.
REDUCED MOTION (the gear's MOTION LESS, or the phone's own setting): no zoom, no turn: the map's frame held over the build and a 167 ms
fade, both ways. A door with no map camera (a town's raid) holds that screen's own last frame and fades. A board not laid from the map
(a boss's, the arena) turns onto the board's middle. window.NFC.state keeps the clouds' meaning ('in' while a cover is up), so the motion
layer's held phone and every gate that waits on the door wait on the zoom.

## THE NUMBERS (this box: a software GPU, SwiftShader; the demo at 1x CPU)
Phone (390 x 844 at 3): the come-down 672 ms (zoom 1.00 to 10.42, 11 to 16 frames, median 31 to 60 ms, worst 102 to 142: the map's own
draw, 50 to 57 ms at worst); the fight built under the map's frame in 2.0 to 2.3 s; the turn 1.0 s, median 35 to 50 ms (the fight
alone after it 19 to 22), worst 85 to 131; the zoom's own work in a frame 3.0 to 3.8 ms at worst; the way out 2.5 s (grid 0.6, turn 1.0,
climb 0.9). Computer: the come-down to 20.4 (the street stop; the board's block is 431 px there, so the turn zooms in 1.65x), turn
median 36 to 47 ms (106 before the covered layers were skipped), own work 2.9 to 3.2 ms. SMOOTH IS A BUDGET's fight start with the zoom:
worst frame 283 ms (ratchet 650), long tasks 645 ms in all (ratchet 2000). The turn's extra cost over the fight alone is the software
GPU compositing turned full-glass pictures; a phone's GPU does that for nothing; the dive's own main-thread work stays under 5 ms a frame.

ON THE PHONE-SHAPED CPU (the driver's 4x throttle, this box, one run on the demo after the push): it is NOT in budget. The way in
took 10.1 s (come-down 1.0, settle 1.0, the fight built under the map's frame 5.8, turn 1.2, grid 1.1) at about 5 frames a second
(median gap 207 ms, worst 566): the map's own draw is 199 ms a frame there and the fight's own draw the same order; the zoom's own work
15 ms at worst. The way out 4.9 s at median gap 437 ms (worst 1,234 ms: the map's first draw after a fight, under the board's frame).
The same costs are the map's and the fight's at every moment on that CPU (SMOOTH IS A BUDGET's OVER BUDGET map lines); the zoom adds
the map drawn at a new zoom every frame for one second. Routed: PLUMBER (the map's draw per frame, rule 400) and the zoom's own next
step, drawing the map every other frame and scaling the last one between (MOTION).

## GATES (rule 13a, the ones this change touches, one at a time)
THE ZOOM DOWN INTO THE BOARD: phone 13/0 on two of its last three runs, computer 10/0 on three of its last four (every red on F1
alone, a frame ratchet on this shared box, never a leg of what is on the glass); THE TOWN SHOWS 10/0; THE BOARD IS THE CITY AT THAT SPOT 170/0 (its demo door W1 through the zoom); SMOOTH IS A BUDGET
18/1 (the red: the map at the street stop at night, median 33 ms, the map's own draw, not the door); THE UI MORPHS phone 18/7 (the seven
are main's, named by the coordinator in rule 414: the old phone's folds, the camp's grow, the fight's phone fold and back, the MOTION
button; M8's lift is green, re-aimed from the clouds to the zoom's cover); A RETREAT GETS HIM AWAY 13/1 (R5 mid-fight, the same red on
main without this change: RUN SEVEN's rule 413 round); THE VOTE TAB 62/4 (none of the four is this card).

## WEAK, NAMED
- His men and theirs: the map's men stand where the map had them in the held frame and the turn; the board's men stand at the fight's
  own deployment (his line west, theirs east). A man does not walk from one to the other: he crossfades. The deployment is COMBAT's.
- The painter: the stop's tiles take about 0.8 s each on this box; with the come-down's head start and the settle, the fight's own
  street is mostly sharp, the glass's far corners sometimes the painter's coarser fallback. A pre-paint while the meet card is up would
  make it sharp every time (WORLD's painter; a NOTE).
- The board's houses are drawn much smaller than the map's (the map stands its models 2.0x their metres): the marriage is the ground,
  the streets and the lots; the houses' look is COMBAT TWO's and COOK's.
- The frame ratchets are this box's truth; a real phone's frames are not measured here.
- slices/bohemia_phone.js (UI TWO) still raises the phone over '#nfclouds', which no longer exists: dead, harmless, UI TWO's line.

[bb] Battle Brothers cuts to a separate battlefield behind a loading screen; ours never leaves the map: the camera comes down onto the
very street and the street turns into the board.
[analog horror] the drop is a camera on a mast lowering onto the block it was already watching; the tape's roll, the timecode and REC
burned in (407(h)) wait for final.
