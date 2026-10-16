# THE BOULEVARD WITH NO INTERSECTIONS

**8/20/26 — WORLD lane. Las Vegas Boulevard is 81 cells, 7.8 km of the most
recognisable street on earth, and it had not one intersection on it. No crosswalk, no
signal, no stop bar, and none of the enclosed pedestrian bridges that are the single
most identifiable thing about the Strip. Three bugs stacked on top of each other, and
I wrote all three.**

---

## FIRST, A CORRECTION TO YESTERDAY

`legend_kept_gate.js` shipped yesterday saying **55** codes across the registry were
declared and never built, and named the **mountain** as the worst case. Both were
wrong, and the gate got its own answer wrong **three times in one day** before it was
right. Each time for the same reason: **it guessed its inputs instead of using the
real ones.**

| version | what it did | what it wrongly reported |
|---|---|---|
| v1 | no `cellX`/`cellY`, no `open` | the mountain builds no ravine, no drainage, no shrub, no boulder, no alluvial fan. **It builds all five.** |
| v2 | passed `cross: true` | the generator reads `cross.indexOf('E')`, which throws on a boolean; the try/catch ate it and the whole mode made nothing. **Eight false findings from one wrong type**, including the rail's level crossing and the freeway's rail underpass. |
| v3 | a synthetic 3x3 cluster block | the airport parks no airliners, docks no jet bridges, builds no revetment. The airfield lays stands with `for (st = A0 + 90; st < A1 - 120; st += 150)`, which on a 3x3 block is an **empty range**. On its real blobs the family builds **18 of 18.** |

Every one of those is the gate calling a working district broken, which is precisely
the failure its own care note warns about, three times over.

**There is exactly one input that cannot be wrong about the modes, and it is the world
itself.** The gate now builds the valley from the ONE SEED and reads the cells the
player actually walks, sampled 30 per type. That is VERIFY ON THE REAL SURFACE (7/18)
applied to a generator instead of to a picture, and it should have been the first
version.

The true figure was **41**. It is **34** now, because of what the honest measurement
found next.

## WHAT THE REAL WORLD SAID

The moment the gate read real cells, a family jumped to the top that had never been
near it:

```
strip + strip_x   3=crosswalk  12=signal mast  15=stop bar  16=storm drain inlet
                  17=yellow turn-pocket line   18=pedestrian bridge
                  19=bridge tower              23=junction box
```

Eight declared tiles, none built. And then the number that explained it:

```
strip cells: 81      strip_x cells: 0
```

**Zero.** The crossing type was registered on 8/18, generated correctly, dossiered, and
never once selected in the shipped valley.

## THREE BUGS, STACKED

**1. The dispatcher was hard-coded to one road.**

```js
function kitRoadType(d,legs){
  if(d!=='arterial') return d;              // <- everything else, always the run type
  return (legs&&legs.cross&&legs.cross.length)?'arterial_x':'arterial';
}
```

`strip_x` could never be returned. Any road may now have a `<type>_x` sibling, used
when the world says the cell has a cross street and ignored when no such type exists.

**2. The Strip module never read the world's own answer.** Freeway and rail both read
`opts.same || opts.links || opts.streets`. The Strip read only `links || streets`, so
the corridor axis came from whatever a caller happened to pass and `sameLinks` — the
world's actual computation — was thrown away.

**3. And the corridor-axis test was defeated by the boulevard's own width.** This is
the good one, and it silently undid the 8/18 fix.

The Strip runs **two cells abreast**. So a cell's `same` set holds its continuation
ahead and behind *plus its sibling half to the side*: in the seed valley, `same = [N,
S, E]`. The test asked *"is there any leg on this axis"* — which for that cell answers
**yes on both axes**. So every cross street was rejected as "running along the
boulevard", and not one of the 81 cells ever built a junction.

**A corridor runs on the axis it enters and leaves by — both legs. A sibling is one
leg.** That distinction is the entire difference:

```js
var vert = hasN && hasS, horiz = hasE && hasW;     // was: hasN || hasS
```

There was a fourth thing under that: a cross leg was never added to the cell's own
pavement, so `coverH()` stayed false on that axis and the approach, its crosswalk and
its stop bar were all painted onto ground that was not roadway. **An intersection with
no road arriving at it is a painted rumour.**

## AND IT DID NOT BRING BACK THE 8/18 BUG

That fix exists because the two-cells-wide adjacency once made **78 of the 81 cells**
build a full signalised junction — seventy-eight sets of crosswalks and pedestrian
bridges in an unbroken row down the boulevard. So the first thing measured after this
change was whether it came back:

```
strip cells: 81
  cells with a CROSSWALK  : 12      (12 have real cross legs)
  cells with a PED BRIDGE : 12
```

Twelve, matching the world's own cross-leg count exactly. Roughly one intersection
every 670 m, which is about right for the Strip's major crossings.

## WHAT IS THERE NOW

Every major intersection on Las Vegas Boulevard: ladder crosswalks on all four
approaches, dark signal masts, stop bars, the yellow left-turn pocket lines, the
polished junction box, and **twelve enclosed pedestrian bridges with their stair and
escalator towers** — the thing you actually picture when someone says the Strip, and
the reason you cross that road above it rather than on it.

`records/target/BOHEMIA_GRID_strip_x.png` is the top-down proof.

## THE LESSON

Yesterday's record ended by saying the gate exists because *counting what the generator
emits and comparing it to what the module promised* is worth more than reading the
code. That is still true. What today added is the other half:

**A checker is only as honest as its inputs, and a synthesised input is a guess wearing
a lab coat.** Three times I built an input that looked like the real thing and got an
answer that was confidently, specifically wrong — wrong enough to ship a false claim
about the mountain to main. The real world was available the whole time and costs 137
seconds to generate.

The one part that worked as designed: the gate's own honesty check — *every code still
named in DEBT must still really be unplaced* — is what caught each wrong version. A
ratchet that only checks one direction would have let all three ship quietly.
