# THE FAR END IS PAINTED (RUN, 10/2/26, [map pixels now], rule 65)

> **PAOLO 10/2, the fourth time:** *"I've been telling you I want the map graphics to be bigger and
> better and especially when you zoom out of the city for a fat minute, bro please."*

## MEASURED FIRST
At the far stop of the pinch the 96 x 96 blocks were the tiles' own building pictures, shrunk to
3.7 CSS px a block. On the glass that reads as one dark grid carpet. The seven town buildings
stayed 74 CSS px wide at every zoom and covered half of it.

## NOW
- **The city is painted for the far end** (`vbCityCore`, baked in the same worker as the land). It
  uses twelve texels a block, 0.93 device px a texel at the far stop. Every block is painted by what
  it is:
  - houses as nine small two-tone roofs on dry yards;
  - big flat roofs with their HVAC;
  - towers and casinos standing up, lifted the way the camera sees them;
  - mile roads with their lane line and lamp posts, freeways with their edges, the boulevard with
    its neon;
  - parks with trees, water, the solar fields in rows, rail ties;
  - the rim mountains rising toward the ranges outside.
  
  About one block in six of houses and roofs is burned (act one is the ruin). All 75 district kinds
  have art; none falls to a flat fill.
- **It fades in as the camera pulls out.** It is fully painted below 6 CSS px a block, and only the
  tiles show above 10.
- **At night only blocks with power show light:** windows, tower faces, lamps and neon, read from
  the same power the map's lamps use, re-read at most every 5 s.
- **The art scales with the zoom, the names do not** (rule 61's answer: Battle Brothers' town art
  scales, its labels stay screen size). A town goes from 74 to 30 CSS px at the far stop, and the
  people and crews to 0.55 of their size. He stays his own size (rule 21). Names are drawn after him.

## THE FLOOR (DIRECTION 9/28, amended 9/29), on the ground picture at the far stop
| | before (the tiles) | now (painted) | floor |
|---|---|---|---|
| (3a) painted unit, device px | 1.07 x 1.10 | **1.03 x 1.09** | <= 1.5 |
| (3b) fine band | 0.39 / 0.40 | **0.23 / 0.27** | >= 0.020 |

Said plainly: the old carpet ALSO met the floor by these numbers, because tiny noisy tiles read as
fine detail. So the floor is what the painting is held to; "denser than before" is not claimed. The
first reading was off the glass and sat on him, the church and the crowds (1.52, over). The gate
reads the map's ground picture (`MAP_GROUND.cv`), where the walkers are not.

## CHECK
**THE FAR END IS PAINTED**, new, 9/0, registered slow. Mutations, each red: the painting never
drawn; lights without power; the art not scaling.

## LEFT ON [map pixels now]
- Half (a): the markers drawn 1:1 from their art. They scale now, but are not 1:1.
- The near end at the walk's 42.9 px/m.
- The far painting is RUN's, from the art that exists. A painted map at Battle Brothers' hand
  needs COOK and DIRECTION back (rule 54), which is one word from him.
