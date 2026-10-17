# TEN SECONDS TO PLAY, ROUND FIVE: THE MORNING RING COMES BAKED (RUN, 10/16/26, [ten seconds to play])

## MEASURED FIRST (a Chrome trace of the 20 s after BEGIN at 4x, the page's own scripts by function)
The CPU profile's "(program)" had hidden it; the trace named it. Of 19.6 s busy in 20: the morning ring's street blocks
5.1 s (six blocks, about 0.85 s each, a block a task since round three), one map redraw per later person landing 2.0 s
(ten redraws), his walk 1.0 s, the sprites' handfuls 0.7 s. The late street-sprite FILES were not it: measured one by one,
most freeze under half a second (the browser reads them off the main thread), so splitting them was dropped.

## THE CUTS
- **The morning ring's distance comes baked** (`__THE_RING_COMES_BAKED__`). How far the first morning's job is, the same
  answer every new game, is worked out by the cut (tools/bohemia_bake_the_demo_cast.js writes it into
  BOHEMIA_DEMO_CAST.json) under a key of everything it rests on (the valley's seed, the day, the job, his doorstep block,
  the search radius, the people's rules and dial); the ring uses it only when the key is this morning's, and finds it live
  otherwise. Proven the same number as the live search; a wrong key falls back to the six blocks, live.
- **The crowd's later people in one message**: the map redraws once for them, not once a person.

## THE NUMBERS (on the demo cut with both, at 4x, before the stop held the cut)
After BEGIN for 20 s: frozen 68-80% -> **43-54%**, the longest freeze about 2 s -> **0.7-1.4 s**, street blocks built 0.

## NOT CUT
The stop on the demo cut holds (sweep AL), so the committed demo stays BUILD 10/13b: the ring's baked distance and the
crowd's one message reach the demo with the next cut. The leg that proves the ring's distance (THE DEMO BOOTS LIGHT B12:
the cut's answer used, no street block built for it, and the same as the live search; two mutations red: a key from
another morning, a wrong distance) lands with that cut.
