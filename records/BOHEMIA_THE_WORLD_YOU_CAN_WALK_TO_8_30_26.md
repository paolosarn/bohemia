# NOBODY HAD EVER ASKED WHETHER YOU CAN WALK ANYWHERE
# 8/30/26, WORLD lane.

## THE HOLE

The demo is a person on foot. Every screenshot of it says **SUBURB · ON FOOT**. The whole
first act is walking somewhere and walking back.

And every reachability measure in this repo is about something else:

| gate | what it actually asks |
|---|---|
| `street_contract_gate` | does this seam line up (×7,600), and since 8/28, can a **car** reach the road network |
| `walkable_gate` | is this **district** mostly parking lot — one district at a time |
| `drive_network_gate` | can a **car** reach every stall — inside one plot |
| `roadcell_gate` | is this road cell's visual constitution right |

Not one of them asks the only question the player asks: **from where the game starts me,
what can I walk to?**

## THE ANSWER, AND IT IS GOOD NEWS

Measured on the built valley, at cell resolution:

| | |
|---|---|
| cells carrying standable ground | 9,043 |
| separate walk networks | 99 |
| the demo opens in | `suburb(48,48)` |
| **cells he can walk to from there** | **8,653 — 95.7%** |
| and that is | the valley's **biggest** network |

Everything out of reach is **mountain** (371 cells) — except **eighteen**, and all eighteen
are one- to twelve-cell pockets pressed against the rim: four desert cells in the top-left
corner, five estate cells on the massif's inner face where the overmap deliberately puts
millionaires behind mountain, and a handful of singles.

Only three of the eighteen are in the valley proper: `warehouse(56,34)`, `warehouse(57,34)`
and `suburb(7,83)`.

**The world you can walk is in good shape. Nothing was guarding that.**

## THE MEASURE

One node per valley cell that has any standable tile on any edge. An edge between two cells
wherever there is at least one index `i` at which **both** sides' edge tile is standable —
which is exactly the condition a body needs to step across a cell boundary. Then connected
components, and the component containing the cell the demo opens in.

Cell resolution on purpose: 96×96 cells of 128×128 tiles is **150 million tiles**, and a
flood over that in a browser is a hang, not a measurement. Standability along the shared edge
is the only thing cell resolution has to get right, and it gets it exactly right.

## AND ITS FIRST ANSWER WAS ABOUT ITSELF

The first draft read the district kit's own per-tile solidity. That is correct for every kit
district and **blind to the suburb** — `SUB_RES` cells carry `m.sub` and never `m.kit`, and
the suburb is the one district the demo starts in.

It reported that the player can walk to **0.0%** of the valley.

That is a statement about the instrument, not about the game, and it is the **fourth time
this month** a measurement's first answer was about itself: the connector filter that
returned everything, the crude channel threshold that missed `#49512e` by one point, the
seam metric that called a driveway a break, and now this.

So it calls `realizeCell` — the walked surface's **own** answer, which cannot drift from what
a body experiences. Same reason `occupancy_gate` compares the model against the running page
instead of trusting either one alone.

## THE GATE — `gates/walkable_valley_gate.js`, 6 checks

- **THE PLAYER CAN WALK OUT OF WHERE THE GAME PUT HIM** — the opening cell is on the biggest
  walk network, not in a pocket of its own.
- **AND HE CAN WALK TO THE WORLD** — the reachable share, floored at 95.5% and only ever
  going up, so nothing can quietly wall him into a corner while every local seam still passes.
- **AND WHAT HE CANNOT REACH IS THE MOUNTAIN, NOT SOMEBODY'S STREET** — rim and water are
  allowed to be unreachable and are excluded from the headline, because counting 371 mountains
  would let a real stranding hide behind them. Ceiling 18, only goes down.
- **THE MUTATION TEST** — seal the opening cell off from its neighbours and the reach must
  collapse from 8,653 to 1. Given that this sweep's first draft returned 0.0%, the warning
  that *a negative result is a claim about your instrument* is not theoretical here.
- The world is unchanged afterwards, and the page threw nothing.

Registered in the suite as **WALK THE WORLD**, 75 s, green. An unregistered gate never runs.

## WHAT COMES AFTER

The three strandings in the valley proper — two warehouse cells and one suburb cell — are
worth a look, and the ceiling is set at 18 so closing them ratchets.

The estate pockets on the massif are almost certainly correct: the overmap puts estates on
the mountain's inner face on purpose, and a gated hillside street that only a car road reaches
is a real thing rather than a defect. That is a judgement about the map, not about the
plumbing, so it is written down rather than fixed.
