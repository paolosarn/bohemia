# THE WAY INTO A FIGHT: MORE LOVE NOW (MOTION 2, 11/7/26; rule 420, ask line 480)

BUILD 11/7d - THE WAY INTO A FIGHT. Files: slices/bohemia_motion.js (__THE_WAY_INTO_A_FIGHT__, inside the
__THE_ZOOM_DOWN_INTO_THE_BOARD__ section: BohemiaMotion.dive), gates/the_zoom_down_into_the_board_gate.js (rule 420's legs),
the demo re-cut. VOTE motion-2-the-way-into-a-fight-11-7 (STAND-IN, rule 408(c): the motion and the tape on today's art).

## HIS WORDS
Paolo 11/7: "the transition from the map to the combat right now is still kind of shit." Rule 420: (a) it plays at the frame budget
(with PLUMBER 7's map); (b) one camera coming down into one place, the city turning into the board on the same ground, his men and
theirs found where they stood, never a cut, a blink, a black or a frozen frame; (c) THE ANALOG HORROR FLOURISH, one look built and in
the game for him to correct: a tape tracking out and back in, the grid scanning on like a surveillance overlay, the sound dropping to
the hum. Gate: frames in budget on the throttled phone, the map's own ground in every frame, no frame black or held past a beat.

## WATCHED FIRST, FRAME BY FRAME (main 53a5b228, BUILD 11/7c)
The demo on the phone profile (390 x 844 at 3) with the CPU at 4x, and on the computer (1440 x 900); every frame the compositor sent
captured (CDP screencast) and a trace of the main thread. A road crew met two blocks off his crew, as the gate does it.
THE WRONG FRAMES, PHONE AT 4X:
1. Contact to the camera moving: 2.1 s of nothing. The map's own three frames (250, 720, 290 ms, CITY_WORLD's frame loop) run before
   the shell even reads the fight's message (a posted message waits behind the map's frames). Not the dive's: PLUMBER 7 / RUN.
2. The come-down: 5 frames in 1 s, the zoom jumping 1 -> about 4 -> 7 -> 10.4 (the map drawn on every step, 200 to 260 ms a draw).
3. The bar flies off the top and leaves a black band: the map's canvas starts 63 px down (under the bar), so the held frame never
   covered the top of the glass.
4. The hold: ONE still picture for 5.8 s while the fight built (only the phone changing over it).
5. The turn: 4 frames in 1 s; one frame with the map's edge a hard diagonal seam across the board; it read as a spin in three jumps.
6. The men: his crew (three big figures on the map) gone with the map's fade; the board's men simply there at their deployment.
7. The way out: the turn back ONE frame (board to map), the climb ONE frame (street to the whole valley): two cuts.
ON THE COMPUTER (1x): smoother, but the zoom went through a dark blurry smear for half a second (the painter's coarse tiles at the
middle zooms), the hold was still for about 2 s, a dark wedge in a corner during the turn.
SEEN, NOT MINE (routed below): a tutorial line (DESI: 'Tap anywhere on the map and we walk there') rides over the whole dive and into
the fight, then crossfades with 'Your line, before the fight' (two talking cards at once); the night map is blue-black and the board
beige (the board's night light, COMBAT TWO); a pulsing red vignette at the glass's edges during the build (the shell's fightVeil).

## WHAT THE WAY IN IS NOW
THE DIVE IS PLAYED BY THE COMPOSITOR. Every move is a Web Animation of transform and opacity on a held picture; the browser plays
those on its compositor thread at the screen's rate while the main thread draws the map's next picture, builds the fight and decodes
its board. Measured on this box first (a 600 ms block on the main thread at 4x): a frame every 17 ms through it.
1. COME DOWN (about a second for the whole valley): the map as it stands (A) is scaled down onto the fight's block; under it the map is
   drawn ONCE at a third and ONCE at two thirds of the zoom (a long way down; the half for a shorter one) and ONCE at the stop (C),
   each laid in on the same clock where it is sharp, so no picture is ever shown more than about twice its own size; a picture covered
   by the one over it goes to nothing (no overdraw). The stop is scaled 1.26x about the block so it covers the whole glass (the bar's
   band), the stop drawn at its zoom over that factor so the block still lands at the board's own size. The clock is the first
   picture's own start once the compositor has started it (a start set by hand before the first frame reached the glass threw the
   camera ahead by however long that frame took: seen, fixed). A new picture is unseen for its first two frames (a new layer can
   reach the glass a frame before its animation does: seen once, fixed).
2. THE TAPE TRACKS OUT while the fight builds under the stop (the build is asked as soon as the stop is held: 1.2 s after the dive
   starts at 4x, it was 2.2 s): the camera keeps lowering (a 3.5 percent push-in over nine seconds, eased), two tracking bands made of
   the held frame's own pixels (a strip of it, slipped sideways, a head line on it) roll down the glass, REC blinks and a timecode runs
   in the corner (the world's own day and hour, seconds and frames ticking on the compositor), the camera's four corners frame it, and
   the music drops through a low-pass to its own low end (one filter node between his music slider and the master, the way the
   dialogue's duck sits; never a made-up tone, rule NO SAND).
3. THE TURN (two beats): the board's first frame (F) is held; the stop and the board turn together (the affine marriage, 407(c),
   landing on the same pixel), a still copy of the stop under them for the corners; the tape tracks back in (the bands go); the grid
   scans on line by line from the far edge, a bright scan line writing it (a window that turns with the board, transform only); a
   bracket finds every man: it locks on (closing from 1.7x) where the map had his crew (theirs at the contact's block) and rides the
   turn to his own tile.
4. THE BOARD LANDS: its colours bleed (its red and its green-blue, half its pixels each, screened over black, a few pixels apart and
   closing in 0.35 s), the held board gives way to the live one under it, the music opens back up, the grid and the brackets hold a beat
   and fade, REC goes out. The fight is his from the end of the turn (NFC.state 'off').
THE WAY OUT REWINDS THE WAY IN: one compositor timeline laid down at LEAVE, nothing in it waiting for the main thread (after a fight
the main thread is the map's and the spoils' for up to 3 s at 4x): the grid scans on over the board's last frame, REW and the timecode
running backwards in the corner, the tape tracks out; after a beat the board and the stop turn back together; then the camera climbs
back through the very pictures it came down through, each leaving where it was laid on the way in; the live map, drawn ONCE where he
was (his crew held) under all of it, shows as the rewind lands; the bar comes down from the top as the climb starts; the music opens
as it climbs.
REDUCED MOTION and a door with no map camera: as before (the frame held, a 167 ms fade).

## THE NUMBERS (this box: software GPU; the trace's DrawFrame, the compositor's own frames)
PHONE, CPU AT 4X, the way in from the camera's first move to the board landing: 546 frames in 10.2 s, median 16.7 ms, p90 29.7,
worst 48 ms, none over 100 (it was about 5 frames a second, worst 566 ms). The turn alone: median 16.7, worst 26 ms. The grid over the
live fight: worst 33 ms. The build: asked 1.2 s in (was 2.2), the fight up 5.1 to 6.0 s after (its own build, under the tape).
The way out: median 16.9, p90 33.3, worst 411 ms, 4 frames over 100 ms: all four inside other pages' canvas work after a fight on this
box's software GPU (the map's result message 800 ms at CITY_WORLD 73432, bohemia_carcass.js 350 ms, the map's own frame 210 ms).
The map's draws in the come-down: 3 to 4 (B1 225 to 286 ms, B2 197 to 261, C 216 to 342 at 4x), never one a frame.
THE GATE'S OWN TRACED RUNS (two, the phone at 4x, no screencast): the way in 575 / 565 frames in 10.0 / 9.8 s, median 16.7, p90 21.1 /
20.7, worst 40.2 / 49.4 ms; the turn worst 31.6 / 28.4; the way out 140 / 150 frames, median 16.7 / 16.8, worst 96 / 99 ms, none
over 100; no gap over a beat.

## GATES (rule 13a, one at a time, on the tree rebased on main 18ae9ef0)
THE ZOOM DOWN INTO THE BOARD 26/2 on the first full run (R1 timed the cleanup timer, not the fade; T4's witness read the map canvas's
box while the fight hid its panel: both the gate's and the log's, fixed), then phone 13/0, phone at 4x traced 7/0, computer 10/0;
THE TOWN SHOWS 10/0 (rule 414); THE UI MORPHS phone 18/7 (the same seven main carries, rule 414 names them); THE BOARD IS THE CITY AT
THAT SPOT 194/0 (W1 the demo's door through the dive).

## WEAK, NAMED
- The 2.1 s between contact and the camera moving is not the dive's (item 1): the shell reads the fight's message after the map's own
  frames. ROUTED: PLUMBER 7 (the map's frame cost) and RUN (the door: the encounter could reach the shell without waiting behind them).
- The way out's 4 slow frames at 4x are other pages' canvas work (above). ROUTED: PLUMBER 7 (the map's result handler), CAMP (the
  carcass picture at the end of a fight).
- The map's names (a gang's label) swell up to about 2.2x inside a picture before the next one takes over: the pictures carry the map's
  own labels. A map drawn without them for the dive's pictures would need a switch in the map's draw (PLUMBER 7's, WORLD's).
- The brackets ride the turn from the map's spot to the board's tile in a straight blend; the men themselves do not walk (COMBAT's
  deployment). His crew's bracket starts on the crew's drawn spot, spread a little side to side, one per man.
- A tutorial line rides over the dive (DESI) and a second talking card crossfades with it as the fight opens: UI / WORDS.
- The board's night is much lighter than the map's (blue-black to beige across the turn): COMBAT TWO.
- Frame numbers are this software-GPU box's; a phone's GPU composites for nothing what this box does on the CPU.

[bb] Battle Brothers cuts to a separate battlefield behind a loading screen; ours never leaves the tape: the camera comes down onto
the very street, the board is laid on it while the tape tracks, and the way out is the same tape rewound.
[analog horror] the drop is a surveillance camera on a mast: REC, the timecode, the tracking rolling through the frame's own pixels,
the grid writing itself onto the street, the men found by brackets, the colours bleeding as the picture locks; the music sinks to its
own hum. The way out is the tape rewinding. A recording, never a filter on the world.
