# THE TRAFFIC SIGNALS WERE NEVER PLACED (measured 8/1/26)

> "we spent like a couple days you know I made not only did I make street lights,
> but I also made traffic lights as well. I even made traffic lights that were
> broken and on the floor and I want to see that on all intersections, we made
> laws about it. You know we haven't seen these traffic lights in a fat fucking
> minute. What's up with that?"

## THE ANSWER, MEASURED

`banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt` holds **348 finished
sprites, 6.6 MB of art**. Measured against the shipped alpha:

| where | signal sprites found |
|---|---|
| the alpha shell | **0 of 348** |
| the CITY renderer (the surface the RUN tab opens) | **0 of 348** |

Not one byte has ever reached a renderer. He has not seen them because **they were
never put anywhere.**

## WHAT IS IN THE BANK, ALL OF IT UNUSED

| axis | values |
|---|---|
| kind | intact 288, **fallen_arm 12**, **dropped_heads 12**, scattered 28, jury_rigged 4, headless 4 |
| color | galv 174, bronze 174 |
| state | dead 132, red 72, amber 72, green 72 |
| dir | e 174, w 174 |
| arm | short 96, med 100, long 152 |

`fallen_arm`, `dropped_heads` and `scattered` ARE "the broken ones on the floor"
he is asking about. They exist, finished, and have never been drawn.

The bank also already carries his rulings, so placement has no decisions left to
make:
- **arm_law**: lanes -> arm reach. 1 lane = short (3 cells), 2 = med (6), 3 = long (9).
- **color_law** (researched 7/18): real mast arms are hot-dip galvanized, so most
  weather to dull zinc GRAY with rust at welds/joints/bases; only coating-stripped
  masts brown out.
- DEAD is the act-1 default (grid power is [PENDING Paolo]); lit r/a/g are the
  powered pairs. Sign plates ILLEGIBLE, names are canon. No purple. Deterministic.

## WHY IT STALLED, AND THE TRAP IN IT

`status: UNJUDGED (first commissioned original; Paolo judges on the intersection
proof)`.

The bank made judgment conditional on a proof surface that was never built. So it
sat "unjudged" for two weeks while the thing that would let him judge it did not
exist. **That is not him withholding a verdict, that is us never asking the
question.** And by the UNJUDGED-IS-DEAD law, stale-unjudged normally means dead --
which would have quietly graveyarded 6.6 MB of his own commissioned work on a
technicality. He has now said plainly he wants them in, which by NOTES ARE RULINGS
is the ruling: **place them.**

## THE WORK, SO THE NEXT TURN STARTS FROM THE PLAN

1. Embed a subset into the CITY blob. All 348 at 6.6 MB is affordable next to a
   42 MB alpha, but the honest first cut is the DEAD galv/bronze set plus every
   broken kind, since dead is the act-1 default and the wreckage is what he asked
   for by name.
2. Find intersections in the city's road grid (a cell where a road runs both ways).
   The city currently says "intersection" exactly once, so this is new placement
   code, not a re-wiring.
3. Place per arm_law: count the lanes on the approach, pick short/med/long, pick
   e/w by which way the arm reaches, and seed the kind so the wreckage is
   deterministic per intersection.
4. Gate it the same turn: every intersection carries a signal, arm length matches
   lane count, and the sprites on screen are BYTES from his bank -- the
   street_source_gate pattern, because a citation is not a placement.

## THE PATTERN THIS IS THE FOURTH INSTANCE OF

Border walls (7/28), the bought sidewalk (7/31), footsteps (7/31), and now traffic
signals. Every time: art or audio he judged sat finished in `banks/` while the
thing he was looking at used something else or nothing, and **nothing in the
machine cared.** `banks_used_gate` covers the banks the run loads. It cannot catch
a bank NOTHING loads. That hole is what let 6.6 MB disappear for two weeks.

## PLACEMENT ATTEMPT 1 (8/1, end of session) -- BUILT, NOT YET DRAWING

`tools/bohemia_city_traffic_signals.py` is written and applies cleanly. Verified
on the real surface:

| check | result |
|---|---|
| his sprites embedded in the CITY renderer | **22 of 22** |
| those images actually loaded in the browser | **22 of 22** |
| `sigPass` present and callable | yes |
| intersections found by the world model | **56** in a 40x40 tile sweep |
| signal draws in a frame, standing ON an intersection | **0** |

So the art now reaches the renderer and the intersections are correctly found --
the two things that were missing for two weeks -- but the draw call is being
skipped inside `sigPass`'s tile loop. No page errors. **The alpha was reverted; it
is NOT shipped, because a renderer change nobody has seen work is exactly the
class of thing that wasted three turns on the pixel complaint.**

WHAT WAS LEARNED, so the next attempt starts here:
- `tileMeta(tx,ty).vx/.hz` are NOT the crossing test. They stay -1 on road tiles;
  the road tile's shape comes from the four neighbour booleans `m.N/S/E/W`. An
  intersection is `road && (N||S) && (E||W)`. That predicate is correct and finds
  56 crossings, confirmed.
- The remaining bug is inside `sigPass`'s visible-tile loop (`gx0..gx1` ->
  `t0x..t1x`), or the hook after `facadePass(ox,oy,C,true,hy,_pbox)` is not on the
  path that actually paints the walked world. Instrument the loop bounds first --
  print `t0x,t1x,t0y,t1y` against the known intersection at tile (13,5) -- rather
  than re-reading the code.
