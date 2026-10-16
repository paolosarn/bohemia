# THE PAGE CARRIES COPIES (8/20/26, WORLD lane)

> A gate that reads canon and a game that reads a copy will agree with each other
> forever, and both of them will be wrong.

## WHAT HAPPENED

The walked surface (`slices/BOHEMIA_CITY_WORLD.html`) does not `<script src>` the engine.
It **inlines** the modules, verbatim, behind banner comments. Ninety of them.

Over 8/18-8/19 this lane corrected sixteen tile legends on disk:

- **fifteen districts** — twelve tree tiles plus `swapmeet:12` kiosk and `truckstop:13`
  planter, every one of them declaring `solid: true`, because a tree you walk through is a
  decoration and not an object.
- **`water:0 open water`** — it had inherited walk-through from the `water-dead` **kind**
  default, which is right for a dry basin and wrong for a reservoir. Deep water blocks a
  body.

Every edit was to `engine/*.js`. **The page saw none of them.**

```
python3 tools/bohemia_city_module_resync.py
  CITY MODULE RESYNC: 90 embedded, 73 already fresh
  RESYNCED: 17 modules
```

Seventeen. Sixteen of them were this lane's own day of work, silently reverted on the one
surface Paolo plays, while every gate that reads `engine/` stayed green about all of it.

## HOW IT SURFACED, WHICH IS THE ONLY PART THAT MATTERS

Nothing announced it. It surfaced because `terrain_surface_gate.js` — a gate that stands on
the **page**, not on the module — went from 18/3 to **20/1**, and the one *new* failure was:

    WATER: the drawdown lakebed is walkable and the deep water is NOT (16384/16384)

The whole reservoir, strollable. That number could not be true of the module on disk, so
the gate and the module were not looking at the same water. **That is the entire tell**, and
it only exists because the gate reads the running page. A gate written against
`engine/bohemia_water.js` would have been green through all seventeen.

This is the same shape as three earlier findings this session, and it is now four:

- *a gate that checks its own side of a seam nobody is standing on will stay green through
  anything*
- *a dependency that is not there fails exactly like a feature that was never wired*
- *verifying on the real surface is necessary and not sufficient — the surface can be the
  broken half*
- **and now: the surface can be a STALE COPY of the half you fixed.**

## IT IS NOT ONE PAGE. IT IS THREE ARTIFACTS, AND EACH ONE HAS ITS OWN REBUILD

The city world was the first. Two more turned up in the same hour, both caught by gates
that were **green on pristine main and red on my tree** — which is the only way any of this
was visible at all:

| artifact | what was stale | what rebuilds it |
|---|---|---|
| `slices/BOHEMIA_CITY_WORLD.html` | 17 inlined engine modules | `tools/bohemia_city_module_resync.py` |
| `slices/BOHEMIA_CURRENT_SLICE.html` | `bohemia_water` (verbatim-inclusion check, 9/10) | `node tools/build_current_slice.js` |
| `slices/look/*.png` | 4 photographs of a surface that moved | `bohemia_look_shots.js`, `bohemia_border_picture.js`, `bohemia_city_border_picture.js`, `bohemia_city_cast_picture.js` |

`one_map_gate.js` is the sharpest of the three and worth copying: it asserts each of ten
engine modules appears **verbatim** in the built slice. Not "a module of that name is
present" — the actual bytes on disk, found in the artifact. That check cannot be fooled by
a stale copy, and it is the reason the water fix was caught in a second place after being
caught in the first.

`look_gate.js` catches it a different way again — picture **mtime** against surface mtime,
six-hour tolerance. Different mechanism, same disease: *an artifact that is downstream of a
file you edited and does not know the file moved.*

## THE RULE THAT COMES OUT OF IT

**Editing canon is not shipping canon. The rebuild is the shipping.** After touching any
`engine/*.js`, and before trusting any number measured off a built page, run all three:

```
python3 tools/bohemia_city_module_resync.py      # the city world's 90 inlined modules
node    tools/build_current_slice.js             # the phone slice
node    gates/look_gate.js                       # names the exact photographer to re-run
```

**And the differential is the method, not the courtesy.** Twenty-four gates were red on my
tree. Twenty-one of them are red on `origin/main` too — sixteen written down in
`records/BOHEMIA_THE_FIRST_COMPLETE_GATE_PICTURE_8_19_26.md`, five more measured in a
pristine `git worktree` of main this hour. Exactly **three** were mine, and all three were
this same stale-copy disease. Without running the suspect list against a clean checkout of
main there is no way to tell a regression you caused from a red gate you inherited, and
guessing which is which is how a real regression rides in behind twenty standing ones.

The tool already refuses what it cannot verify: `engine/bohemia_floorplan.js` came back
**UNRECOGNISED** (matching neither canon nor any of the last 40 revisions) and was left
untouched rather than overwritten. That block on the page carries page-only code —
`inPassable` lives inside it and is not in the disk module — and it is that way on pristine
main, before any patch of mine. Correct refusal, and a standing note that anything editing
`inPassable` is editing inside an inlined module block.

---
**Tool:** `tools/bohemia_city_module_resync.py` · **The gate that caught it:**
`gates/terrain_surface_gate.js` (21/21 after) · **Law:** ENGINE SYNC — one canonical body
per module (`gates/bohemia_sync_canon.txt`)
