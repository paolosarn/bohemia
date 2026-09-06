# THE FIGHT HAS NO HEADROOM (coordinator, this round: the swing, and a call of mine)

## THE MEASUREMENT THAT CHANGES THE ORDER OF THE WHOLE BOARD
PLUMBER profiled one beat for the first time. A beat is 500 ms under the 120 BPM law.
```
walking the street   229 ms of every 500 ms beat   (45.9% of the main thread)
in a fight           497 ms of every 500 ms beat   (99.5% of the main thread)
```
There is no headroom in a fight. None. Three milliseconds. And two thirds of a
fight is ONE call, drawImage: canvas blits are 60.9% of a fighting beat, with
(program) at 27.6% behind it. The fight is not thinking too hard, it is DRAWING
too much. Everything four lanes are about to add -- the camera pull-back and the
cloud (his own ruling), hostiles that stand out, the border paint, richer tiles
-- is MORE DRAWING, aimed straight at a budget that is already spent.

AND 15 MS OF EVERY BEAT IS DRAWN WHERE NOBODY CAN SEE IT. The combat frame is
created at boot, sits on a hidden panel measuring zero by zero, and runs about 60
frames a second, ~900 drawImage calls a second, before any fight has ever
happened. 3% of a core, permanently, drawing nothing for nobody. Found only
because a walk profile of a session that never entered a fight contained a fight
function.

## THE RESEARCH: WHAT ACTUALLY FIXES A DRAWIMAGE WALL
- **The cost is per CALL, not per pixel.** Script bindings plus the browser's own
  bookkeeping are an O(N) cost in the NUMBER of draw calls. Hundreds or thousands
  of drawImage calls a frame is the classic wall, and it is why 60 fps at small
  scale becomes 20 at large.
- **Pre-render, do not re-compose.** Anything repeated or static gets drawn ONCE
  to an offscreen canvas and blitted whole, instead of being rebuilt every frame.
- **Layer the canvases.** Things that never move belong on their own canvas that
  is not cleared every frame; only the moving layer redraws.
- **Never scale in drawImage.** Cache the sizes you need at load; scaling per call
  is one of the most expensive things you can ask for.
- **Round the coordinates.** Whole-number x and y are measurably faster than
  fractional ones for a blit.
Sources: [MDN, optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas),
[web.dev, improving HTML5 canvas performance](https://web.dev/articles/canvas-performance),
[WHATWG wiki, canvas batch drawImage](https://wiki.whatwg.org/wiki/Canvas_Batch_drawImage),
[Reintech, optimizing canvas for large scale apps](https://reintech.io/blog/optimizing-canvas-performance-large-scale-apps),
[HTML5 canvas performance tips (gist)](https://gist.github.com/jaredwilli/5469626).

## MY CALL, AND IT IS A NARROW FREEZE (correct-after; Paolo may overrule in a word)
Paolo's instruction to the pipe fixer was "slimmest it can be, fastest it can be,
60 fps." A 497 ms beat is 2 fps of headroom on a desktop, and he plays on a phone.
So, until PLUMBER lands headroom in the fight:
- **NO LANE ADDS A NEW PER-FRAME DRAW TO THE FIGHT.** The camera pull-back, the
  cloud, the danger tell, the border paint and any new fight effect are DESIGNED
  and BUILT now, but each one lands with its cost measured and stated, and none of
  them ships into the fight loop until the beat has room.
- This is NOT an art freeze (7/26) and it is not a stop-producing order. Every
  lane keeps building. It is one rule: the fight loop is full, so anything new
  aimed at it arrives with a number.
- The 15 ms hidden panel is free money and comes out first.

## ROUTED
- PLUMBER [fight headroom]: get a fighting beat under 400 ms of 500 with the five
  techniques above, hidden panel first.
- COMBAT [draw budget]: every new fight visual states its cost in ms per beat.
- ANIMATION [cheap cloud]: his cloud is one blit, not a particle system.
