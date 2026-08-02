# HOW BIG IS BOHEMIA, IN WALKING
## Paolo asked, 8/2/26. Measured, not remembered.

> "Before you cut anything, let me ask you in terms of walking how big is our map
>  size compared to Skyrim or Fallout Vegas?"

---

## THE SHORT ANSWER

**The built half of our valley, on its own, is about the whole of Skyrim.**
The land you can actually put a foot on is a bit over **four and a half New Vegases**.

| | on foot | vs us |
|---|---|---|
| **BOHEMIA (all of it)** | **84.9 km²** | — |
| **BOHEMIA (walkable)** | **75.7 km²** | — |
| **BOHEMIA (built districts only)** | **37.0 km²** | — |
| Skyrim | ~37 km² | we are **2.3x** total, **2.0x** on foot |
| Fallout: New Vegas | ~16.5 km² | we are **5.1x** total, **4.6x** on foot |

---

## THE VALLEY, MEASURED ON THE CANON SEED

`hashSeed('bohemia')` = 2691674296. Not a best case, the actual map.

    96 x 96 districts, 96 m a district
    9.22 km a side · 13.03 km corner to corner
    84.9 km² · 151 MILLION walkable cells (12,288 x 12,288 at 0.75 m)

| what | area | share |
|---|---|---|
| built districts (75 types placed) | 37.0 km² | 43.6% |
| roads, freeway, rail | 32.9 km² | 38.8% |
| open desert | 5.7 km² | 6.7% |
| mountain + water (you cannot cross) | 9.3 km² | 10.9% |
| **ON FOOT** | **75.7 km²** | **89.1%** |

---

## IN WALKING, WHICH IS THE UNIT HE ASKED IN

Read out of the shipped city frame, not assumed. `BEAT = 500 ms` (the 120 BPM
law), one cell a beat. A cell is 0.75 m, so **a walk is 1.5 m/s — a real human
pace.** Hold a direction two beats and it breaks into a run: two cells a beat,
**3.0 m/s**, a real jog.

| | walking | running |
|---|---|---|
| one side (9.22 km) | **1 h 42 m** | 51 m |
| corner to corner (13.03 km) | **2 h 25 m** | 1 h 13 m |

Nobody crosses this map by accident.

---

## THE HONEST HALF, WRITTEN DOWN SO NOBODY QUOTES ONLY THE FLATTERING ONE

**Those 37 km² are GENERATED. Skyrim's 37 km² are hand-placed, one rock at a
time, by a studio, for years.** Ours are 75 district types stamped by a generator
into a valley the size of about one and a half Manhattans (Manhattan is 59 km²).

So the answer to "should we cut" is: **size was never this project's problem, and
cutting it would not fix anything that is actually wrong.** What is wrong is
filling — whether a district reads FINISHED and USED when you stand in it. That
is the WALKABLE-LAND LAW's job, and it is measured per district, not per valley.

Cutting the map would make the true problem smaller without making it better.

---

## AND IT HAS A FLOOR NOW, BECAUSE HE SAID "BEFORE YOU CUT ANYTHING"

`valley_scale_gate` already pinned the per-cell scale (0.75 m a fine cell, 128
fine cells a district, derived and never typed) and a loose "over 5 miles
across". It pinned neither of the two numbers he actually asked about.

**A lane could have left the cell scale untouched, turned built districts back
into desert, and every gate in the repo would have stayed green while the world
quietly emptied out.**

`gates/mapsize_gate.js` (suite: **MAP SIZE**, 13 claims) holds the floor:
96 x 96 districts, 84.9 km², built land never below 35 km², on-foot land never
below 73 km², rock and water never over a quarter of it, 60+ district types, and
the walking times above computed from the real beat in the real blob.

Mutation-proven: shrinking the valley to 64 x 64 fails 7 of its 13 claims and
names every one.

---

## SOURCES FOR THE COMPARISON
- Skyrim ~37 km² playable
- Fallout: New Vegas ~16.5 km² playable (6.4 sq mi)
- Manhattan 59.1 km², for a real-world anchor

---

## THE LIFE LESSON UNDERNEATH (never preached in game)
Nobody was ever impressed by how much land you own. They notice whether anything
is happening on it.
