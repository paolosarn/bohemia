# HIS APPROVED WALLS ARE NOT IN THE WORLD HE WALKS — 8/9/26, PEOPLE lane

Paolo picked **A** ("wire the already-finished stuff into what I actually play")
and **B** ("the day loop"). This is the first item of A, proven and made
one-step-ready. **The wiring itself is the CITY lane's, and the reason is in the
last section.**

---

## THE FINDING, MEASURED TWICE

On 8/2 Paolo judged the perimeter walls: **all thirteen of his own 7/14 walls
thumbed down, eleven of eighteen cooked ones thumbed up.** Those eleven are
`banks/BOHEMIA_PERIMETER_8_2_26.txt`, 330 tiles.

Sampling 24 tile payloads from that bank and searching for the **bytes**:

| file | what it is | his approved walls |
|---|---|---|
| `slices/BOHEMIA_RUN_CURRENT.html` | loaded by the alpha, **never displayed** | **21 / 24** |
| `slices/BOHEMIA_CITY_WORLD.html` | **the walked world, what RUN shows** | **0 / 24** |
| `slices/BOHEMIA_CITY_TILES.js` | that world's 28.4 MB art bank | **0 / 24** |

**Measured twice on purpose.** The first pass tested only `CITY_WORLD.html` — and
hours earlier another lane had moved that file's art out to `CITY_TILES.js`
(28.2 MB -> 1.0 MB, the right call). A test that missed the art file would have
been the exact "wrong door" bug this repo has paid for all week. Re-run with the
art file included, the answer is unchanged: **his walls are absent from
everything the walked world can draw.**

The only mentions of a perimeter pool in the walked world are two **comments**
citing `banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt` — the July pool his 8/2
verdict superseded. Nothing loads it.

---

## WHAT WIRING IT NEEDS

There is a working precedent. `tools/build_run_slice.js` line 85:

    var PERIM_COOK = 'banks/BOHEMIA_PERIMETER_8_2_26.txt';

It inlines the cooked bank, draws the wall around the block, and
`gates/perimeter_gate.py` asserts the killed bytes never come back. That is the
whole pattern; the walked world needs the same three things:

1. the 330 cooked tiles reachable from the walked world's art path
2. its wall draw pointed at them, one design per plot, face/base variants
   shuffled per cell (one tile per design stamped the same crack on every cell at
   44px pitch, which is what he meant by *"looks like it's glitching out"*)
3. a gate asserting the seven he killed never appear

---

## WHY THIS LANE DID NOT DO THE WIRING

`BOHEMIA_CITY_TILES.js` is 28.4 MB, was extracted **hours ago**, and the owning
lane is mid-swarm in it right now — seven "TILEFORM SWARM" commits in the last
hour, cooking 525 candidate tiles.

Editing another lane's freshly-restructured art pipeline, blind, while they are
actively inside it, is precisely the collision this repo has spent a week
cleaning up after. Two sessions built the same city resolver on 8/4; two built
the same dead-body system on 8/8. **Making it a one-step job for the lane that
owns the renderer is worth more than a rushed edit that costs them a rebase.**

Everything they need is above: the bank path, the byte proof, the precedent tool,
the three requirements, and the reason the shuffle matters.
