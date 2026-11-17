# WORLD THIRTEEN, ROUND SIX, BUILD THREE: THE MAP PAINTS ON EVERY CORE (11/17/26)

VAMILY rule 453(3); rules 418(c), 441. BUILD 11/17zq - THE MAP PAINTS ON EVERY CORE. VOTE world13-the-map-paints-on-every-core-11-17
(stand_in).

The coordinator 11/17: '(3) the map draws fast on a cheap phone at every zoom on every seed (measure it; PLUMBER 8 holds the freeze
rows).'

## 1. THE MEASURE (tools/bohemia_world_thirteen_map_speed.js, new)

On the demo at a phone's size (390 x 844, three device pixels), the GPU's canvas on (SwiftShader, as PLUMBER 7's journeys), for
several valleys (the map's own REROLL), at the four stops (far: the whole valley; opening; near; street): the valley's set-up, the time
to a whole picture on the glass, the time to every tile at its own detail, one tile's painter cost on the page, and three seconds
sliding the camera (frames a second, the median and the worst frame). --throttle (4 = a phone-shaped CPU), --pool, --quick (the old
way: --pool 1 --quick 0), --stops, --json. The camera spots are the same for the same valley and stop, run to run.

## 2. MEASURED FIRST (the phone-shaped CPU, 4x, three valleys)

| stop | block | tiles | the glass filled | one tile on the page |
|---|---|---|---|---|
| far | 1.9 px | the whole painting | 3 s on the first valley, 20 to 22 s on a new one | 0.2 to 1.4 s |
| opening | 18 px | the whole painting | 0.3 to 1.4 s | 0.2 to 1.7 s |
| near | 171 px | 128 texels a block | 21 to 52 s (8 to 10 tiles) | 2.7 to 8.8 s |
| street | 380 px | 128 texels a block | 1.2 to 5.6 s | 2.5 to 4.3 s |

A new valley's set-up 0.9 to 1.6 s (the generator, the power, the streets; the dirt tracks 5 ms of it, measured in node). Sliding:
17 to 21 frames a second at most stops; single frames of 2 to 14 s while a tile or the whole painting lands (the box's own CPU
shared with its software GPU; PLUMBER 8's freeze rows hold the frames).

WHY THE NEAR STOP: every close tile (12 x 12 blocks at 128 texels, 1,536 x 1,536) went to the ONE worker that also paints the whole
valley and the land past it, one after another; on a new valley the tiles waited behind the whole painting (20 s at 4x). The
painter's own cost is spread across its whole per-texel body (a profile of three tiles: no line over 4 in 100).

## 3. THE BUILD (slices/BOHEMIA_CITY_WORLD.html, `__THE_MAP_PAINTS_ON_EVERY_CORE__`)

- A POOL OF PAINTERS for the tiles (vbTilePool, vbTileSend): half the cores, one at least, three at most, of their own (the whole
  painting and the land past the map keep VB.worker); the nearest tiles first; never the same tile twice in flight; a painter that
  never answers is let go after 45 s (vbTileReap). MEASURED: one fewer than the cores starved the glass (frames of 10 s while three
  painters ran on four cores), so half.
- A QUICK PICTURE FIRST: at the close stops (96 and 128 texels a block) a tile with nothing at any detail under it is asked at 60
  texels a block first (VB_QUICK_S, about a fifth of the work), the nearest first; it stands in (the fallback that was already there)
  until its own detail lands.
- busy stays 'any tile in flight' for every reader (VBT.fly counts them).

## 4. AFTER (the gate's own run: full speed, the same spots, three valleys; the old way is the same page with --pool 1 --quick 0)

| near stop | a whole picture on the glass | every tile at its own detail |
|---|---|---|
| valley 1 | 23.9 s -> 6.6 s | about the same |
| valley 2 | 19.4 s -> 9.0 s | about the same |
| valley 3 | 16.1 s -> 11.1 s | about the same |

Summed over the near and street stops: a whole picture 65.8 s -> 30.3 s; every tile at its own detail 66.5 s -> 64.5 s. The street
stop the same or sooner (0.1 to 3.0 s now). Full detail is about the same on this box: its four cores are shared with the software
GPU (SwiftShader), which a phone's GPU takes off the CPU, so the second painter is measured here at its worst. A film strip of the
near stop filling (3, 10, 20, 35 s, old above, new below) showed little difference on the glass itself: what fills late is mostly
the margin above the glass's edge; the card shows the measured seconds instead of a strip that would oversell it.

## 5. GATES

- NEW gates/the_map_paints_on_every_core_gate.js (solo, it times): Q1 the pool, Q2 the quick picture first, Q3 the glass fills
  (the old way and this build on the same spots, a whole picture at least as soon summed), Q4 planted (the old way: Q1 and Q2 red).
- the gate 6/0 with the alpha on its side (Q5). The map's neighbours green on this tree: listed in the ship's commit.

## 6. OWED (measured, not built this round)

- THE FAR STOP ON A NEW VALLEY: the whole painting (96 x 96 blocks at 36 texels, 12 million texels) takes 20 s at 4x; split it
  across the pool by bands, or paint the far stop from tiles.
- THE PAINTER'S OWN COST at 128 texels: each tile paints 12 x 12 blocks for the 8 x 8 it shows (the margin a tall building stands
  into); a margin cut by what stands up at that zoom would save a third.

[bb] Battle Brothers' world map is drawn once at load and never makes you wait at any zoom; ours paints as you look, so it paints
the near things first, roughly, and sharpens them.
[analog horror] the close street comes in soft, like a tape finding its tracking, and then it sharpens.
