# WHAT THE WORLD ACTUALLY COSTS, AND WHAT IT ACTUALLY HOLDS
## 8/2/26. Two measurements nobody had taken, and two things I was wrong about.

Follows on from `BOHEMIA_HOW_BIG_IS_THE_MAP_8_2_26.md`, which ended by saying
**size was never the problem, filling is.** This is the check on that sentence.

---

# 1. WHAT WALKING COSTS, ON THE SURFACE HE LOOKS AT

`streaming_gate` measures the WORLD MODEL's step cost. That is a side-door probe
(the 7/18 law): it measures the data, not the pixels. Nobody had ever measured a
FRAME while walking, in a real browser, at his phone size.

Measured: real alpha, RUN tab, dropped in, 390x844 at DPR 3, holding a direction
in four directions for 7 seconds each, ~1,350 real frames.

| | |
|---|---|
| median frame | **0.6 ms** |
| p95 frame | **1.0 ms** |
| frames missing 60fps | 0.2% |
| drawImage calls per frame | ~49 |
| pixels drawn per frame | 11.97 Mpx onto a 0.29 Mpx canvas (**41x overdraw**) |

**THE WALK IS FAST. Performance is not what to work on next.** That is a whole
lane of "optimise the renderer" work that would have been wasted, and it cost one
measurement to rule out.

## the one thing left open, stated honestly
There were bursts of ~8 consecutive 60-75 ms frames, twice. They are not
workload: those frames did **20% more work and took 110x longer**, drew from
**zero** never-before-seen sources (so it is not texture upload), and the heap was
flat (so it is not obviously GC). **This ran in HEADLESS CHROMIUM ON A SERVER,
which software-rasterises.** A software-raster stall is not evidence of a stutter
on an iPhone, and I am not going to claim it is one. It needs a real phone to
call. Filed, not fixed, not exaggerated.

The 41x overdraw is real and measured, but at 0.6 ms a frame it is buying nothing
to chase.

---

# 2. WHAT EVERY DISTRICT ACTUALLY HOLDS

First time all 49 registered district types have been measured side by side and
ranked. Share of the plot that is real content (worst of the six street configs):

| thinnest | content | pavement |
|---|---|---|
| drivein | 10.0% | 66.2% (vehicular) |
| cemetery | 14.3% | 18.5% |
| park | 14.4% | 4.4% |
| golf | 18.4% | 7.4% |
| truckstop | 19.8% | 52.2% (vehicular) |
| swapmeet | 20.1% | 20.6% |
| **suburb** | **26.9%** | **22.9%** |

| fullest | content |
|---|---|
| water | 88.8% |
| jail | 83.5% |
| watertreat | 82.1% |

**Median district: 45.8% content across 49 types.**

---

# 3. THE TWO THINGS I WAS WRONG ABOUT, AND THE SEARCHES THAT SAID SO

I went looking for under-built districts, because my own record had just said
filling was the problem. **I did not find any.**

### the suburb is not thin, it is accurate
27% content / 23% pavement / 50% yard looked sparse for the district he spawns in
and the biggest single land use in the valley (2,582 cells, 23.8 km², 28% of
everything). Real single-family zoning caps building coverage at **30-40% per
lot**, and a subdivision is lots PLUS streets PLUS yards. Ours is what a Sun Belt
subdivision actually is.

### the cemetery is not empty, it is a real cemetery
61% memorial lawn against 5.6% headstones looked plainly wrong. It is not. The
plot is 96 x 96 m = **2.28 acres** and carries 917 headstone cells: **403 graves
an acre.** Real conventional cemeteries run **400-1,000 an acre**; historic ones
with family plots and winding paths run **300-600**. It is inside the band.

### and park, golf, desert, mountain
Open ground IS the land use. A park that is 77% lawn is a park.

> **TWICE IN ONE TURN, A NUMBER THAT LOOKED LIKE A DEFECT WAS THE REAL WORLD
> BEING MODELLED CORRECTLY, AND BOTH TIMES THE CHECK COST ONE SEARCH.**
> *DO NOT CLAIM THINGS ABOUT THE CODEBASE WITHOUT CHECKING* (8/1) covers land
> use too. The right output of this investigation was a floor, not a work order.

---

# 4. SO WHAT SHIPPED: THE FLOOR ONE LEVEL DOWN FROM MAP SIZE

`walkable_gate` holds the WALKABLE-LAND LAW's letter: pavement may not dominate
content. It catches what it was written for (the fire station, 8% building and
52% apron).

**It cannot catch emptiness with no pavement in it.** A district with no drive
surface passes it however empty it gets, because there is no drive to compare
against. Content could fall to nothing, one district at a time, and every gate in
this repo would stay green. The law's own text admits the hole: *"SPIRIT the
number can't fully catch."*

`gates/district_fill_gate.js` (suite: **DISTRICT FILL**, 53 claims) pins every one
of the 49 types at the share it measured today, plus a floor under the median so
nobody hollows out half the registry a few points at a time.

Baseline: `records/BOHEMIA_DISTRICT_FILL_BASELINE_8_2_26.json`

**Mutation-proven, and proven the hard way:** the first two sabotages I wrote
silently did not apply and the gate reported 53/0 both times. A green gate against
an edit that never landed is not evidence of anything. The third measured the
effect first — thinning the headstone rows 9x moved the cemetery 14.35% -> 9.23%
— and only then did the gate speak, naming the district and both numbers.

**It is a FLOOR, not a target.** If it goes red, a district got emptier. If a
baseline looks too LOW to somebody, that is a content decision and it is Paolo's,
not a gate's.

---

## THE LIFE LESSON UNDERNEATH (never preached in game)
Empty and finished look identical from a distance. The only way to tell is to go
and stand in it.
