# [bb marker] SCHOOL, ROUND ONE: HOW THE PARTY MARKER TRAVELS
ANIMATION lane, 9/27/26. Rule 33(f), Paolo 9/24: every chat carries a [bb ...]
line, school first, one page per round on how Battle Brothers does that
department well and then the shape for us.

**This lane's department is how things MOVE.** The art of the marker is COOK's
and is already done (`banks/BOHEMIA_THE_MAP_MARKERS_9_24_26.txt`, five markers,
one moving part each). Where the marker is PLACED is the map's business. What is
left, and what nobody has answered, is **how it crosses the valley.**

## 1. WHAT THE MAP DOES TODAY (measured first, rule 12)
Two of my own instruments failed before one worked, and both failures were mine:

1. The first read `document.querySelector('canvas')` with `toDataURL` and scored
   the **street** at 0 frames moved, on a street with a breathing crowd.
   Identical ink on the street and the map (3176 both) was the tell: I was
   photographing a canvas the game does not draw to.
2. The second read the right canvas but asked **with nothing pressed**, and 0 is
   the correct answer there: `render()` with no step in flight is deterministic,
   so stubbing the clock draws the same frame sixty times.

Rebuilt on the instrument this lane's walk gate already uses (REUSE-FIRST): the
canvas by id, `getImageData`, the clock stubbed and `render()` called at each of
the sixty moments a 500 ms beat lands on, **with the street as a control that has
to move.**

| | street | map |
|---|---|---|
| lots he moves on one press | **22** | **0**, after 24 presses in all 8 directions |
| drawn frames the world moves on, in one beat | **32 of 60** | not reachable, he never moves |
| biggest single frame | 76.6% of the screen | |

**THERE IS NO PARTY MARKER AND THE WALK PAD IS DEAD ON THE MAP.**

## 2. HOW BATTLE BROTHERS DOES IT, AND WHY IT WORKS
- The company is **one marker**. You tap a spot or a place and it walks there in
  **continuous real time**, and you can **pause**.
- **Speed carries information**: roads fast, swamp and hills slow, heavy load
  slow, night slow and with a smaller sight radius.
- The marker **never stops being readable**: it is small, high contrast, and its
  banner tells you at a glance whose it is. Other parties move on the same map at
  the same time, so you read the whole valley's traffic in one look.
- **Time passing IS the cost.** The walk is not dead time because provisions,
  wages and healing all tick while it happens.

What players complain about is **travel dead time**: long crossings where nothing
is decided.

## 3. THE FORK, AND IT IS THE SAME SHAPE AS THE INTERFACE CHAT'S
UI's round one found that Battle Brothers teleports you to a separate fight
screen, which Paolo had already banned, so "do it like Battle Brothers" could not
be obeyed wholesale. **The same thing is true here.**

- **Battle Brothers moves its marker in continuous real time and lets you pause.**
- **THE 120 BPM LAW** says movement is a REQUEST EXECUTED ON THE 500 ms BEAT, "a
  world law, not a mode rule", on foot AND in the city.
- **RULE 24** says one game mode, the same feel every second.

Those cannot both be true. A marker gliding smoothly at an arbitrary speed while
everything else in the game snaps to a half-second beat is two games.

**PICKED: THE BEAT.** It is his own two rules agreeing, and it is the walk feel he
voted up on 9/21 (SLIDE) one zoom level out: **one beat is one lot, eased in and
out, landing exactly on the beat.** A is built beside it so he can say A with one
letter.

**AND THE ONE THING THE PICK MUST NOT BE.** A marker that simply crawled would
pass "it stops at the beat" and be a worse game. Filmed off the page's own
canvases, 80 samples 25 ms apart:

| | holds still | biggest step | ground covered |
|---|---|---|---|
| A, real time | 8 of 79 | 6 px | **3.65 px a sample** |
| B, on the beat | **25 of 78** | **12 px** | **3.54 px a sample** |

**They cover the same ground.** What differs is the shape: B stops at every beat
and moves twice as fast between them. That is the load-bearing claim and it has
its own mutation.

## 4. WHAT WE TAKE AND WHAT WE REFUSE
**TAKE:** one marker for him and the companion; speed that carries information
(a road is fewer beats a lot than dirt, not a different curve); the banner that
says whose it is; other parties travelling on the same clock so the valley's
traffic reads in one look.

**REFUSE:** continuous real time and the pause, by his own newer rules. Travel
dead time: if a crossing is many beats of nothing, that is the complaint Battle
Brothers players already have, and our answer is the road event (rule 33c) and
the clock's cost, not a faster marker.

## 5. WHAT IS NOT MINE, SAID PLAINLY
- **The marker art**: COOK's, embedded unchanged and byte-compared to their bank
  by the gate.
- **Where he can go and what a tap means**: the map's, not the animation's.
- **The trail he leaves**: already exists and is not redrawn.

## GATE
`gates/the_map_marker_travels_on_the_beat_gate.js` — 12 claims, with two
controls (the street still moves; the ruler can actually find a marker) and the
anti-cheat claim above.

## IN VOTE
`animation-how-you-cross-the-map-9-27`, and it PLAYS (rule 25): both ways
travelling, on the real 120 BPM clock, two options and no more, asked once.

## TAB
CITY (that is where the map is), and the VOTE tab in the alpha for the item.
