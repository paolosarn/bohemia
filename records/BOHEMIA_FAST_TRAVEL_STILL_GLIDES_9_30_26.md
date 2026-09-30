# FAST TRAVEL STILL GLIDES (ANIMATION, [glide] round two, 9/30/26)

## WHY, AND WHY BEFORE THE THING EXISTS
Rule 44 (Paolo 9/29): the pad comes back on the map as TRAVEL SPEED, PAUSE 1x 2x 3x 5x, like Battle
Brothers. UI [speed pad] builds the buttons. The glide under the map is this lane's ([glide], round one,
37337e48), and it was written for one step per beat. Rule 12: measure the premise before building on it.

## MEASURED: THE GLIDE FELL BEHIND AND SNAPPED AT SPEED
The game's own clock driven at 60 fps, a step every BEAT/k along a straight 22-cell road, 20 steps,
the camera read off every drawn frame (a block is 9.8 px at that zoom):
    1x  largest single-frame move  1.0 px   jumps of 20 px or more  0
    2x                             1.4 px                           0
    3x                            25.9 px                           4
    5x                            30.0 px                           5
Each step started from a picture that had fallen further behind, until the lag passed the far-snap
line (2.5 cells) and the map jumped three blocks in one frame -- the boom boom boom he killed, back
again at exactly the speeds he asked for.

## THE FIX (slices/BOHEMIA_CITY_WORLD.html, __THE_MAP_GLIDES__)
A glide lasts as long as the gap between steps, capped at one beat (and floored at 50 ms). At 1x that
is exactly the beat it always was; at 5x each glide ends as the next begins, one constant slide.
AND A FAR JUMP NO LONGER SETS THE PACE: the first version counted a landing as a step, so the step
right after a landing got a 50 ms glide and 1x rose from 1.0 to 3.6 px a frame. Found by the same
instrument, fixed, and held by its own claim.
    after:  1x 1.0   2x 1.4   3x 2.0   5x 3.2 px largest frame move; 0 jumps at every speed

## PROOF
gates/the_map_glides_gate.js (MAP GLIDES) 14 claims (was 11): the speed leg at 1x/2x/3x/5x (every
speed under half a block per frame), 1x unchanged, and a control that the road is long enough and a
block is a real distance. 2 new mutations caught: the glide always lasting one beat (3x 25.9, 5x 30),
and a far jump setting the pace (1x 3.6). The first eleven claims unchanged.
Map regression: THE ONE THAT IS YOU 7/0, THE FACE ON THE MAP IS HIS 17/1 (the same red on main),
MARKER ON BEAT 12/0.
VOTE: animation-fast-travel-glides-9-30, both strips filmed off the game's map at 5x.

## [bb speed] THE SCHOOL LINE, AND WHAT WE DO DIFFERENTLY (rule 39b)
The library (reference/library/battle_brothers/10_UI_AND_FEEL.md): the map HUD carries "a pause/play/2x",
and the marker walks in real time (01_WORLDMAP.md). His rule takes that and goes to 5x.
WHAT WE DO DIFFERENTLY: at every speed the 120 BPM is still in the picture -- the pin hops once per step
inside the slide, so at 5x it hops five times a beat, the music's own subdivision. BB's marker has no beat
to keep.

## ANALOG HORROR LINE (rule 30)
A map that catches up in one jump is a tape that skipped; the viewer notices the skip, never the speed.
