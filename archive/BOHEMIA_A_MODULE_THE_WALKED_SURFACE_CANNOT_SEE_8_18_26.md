# A MODULE THE WALKED SURFACE CANNOT SEE (8/18/26, WORLD lane)

**Eighteen district types had finished engine modules — legends, dossiers, layering, their
own gates — and rendered as a placeholder box in the game Paolo actually walks. 165 cells.
Nothing was broken. The walked surface simply did not carry the file.**

---

## HOW IT WAS FOUND

This is the second half of the same bug I shipped a fix for four hours earlier. The Strip
districts were invisible because *no module existed*. These were invisible because *the
module existed and the page could not see it* — and the second kind is worse, because
every gate that reads `engine/` reports perfect health.

`slices/BOHEMIA_CITY_WORLD.html` dispatches districts through
`BohemiaDistrictKit.get(d)`. That returns null unless the module is INLINED IN THAT PAGE.
Measured: **62 registered types, 36 of them backed by an inlined module.** The other 26 fell
through to the generic "BUILT NEIGHBORHOOD" placeholder branch — the one that drops a flat
box on the tile.

Twelve of the 26 are surfaces the page draws with its own older code (roads, desert,
mountain, water), which is a separate argument. The other **eighteen were pure loss**:

| module | types | cells |
|---|---|---|
| `bohemia_utility.js` | quarry, gypsum, fueldepot, reservoir, pumpstation, intake, granary, arsenal, datafort, basin, reclaim, radio | 26 |
| `bohemia_airfield.js` | airport, airbase | **94** |
| `bohemia_campus.js` | campus | 16 |
| `bohemia_speedway.js` | speedway | 12 |
| `bohemia_town.js` | town | 9 |
| `bohemia_ballpark.js` | ballpark | 8 |

**165 cells.** Comparable to the 204 the Strip ship covered, and it cost **45 KB gzipped** —
the six files inlined, and the kit dispatch picked all eighteen up with no further wiring,
because that path was already written.

Every one of them generates 12–17 distinct tile codes against a 15–18 entry legend. This
was never thin content waiting to be finished. It was finished content nobody could reach.

---

## AND A FIELD IS A BLOB, NOT A CELL

`bohemia_airfield.js` is the one that could not simply be inlined. A runway is three
kilometres long and a cell is 96 metres, so the module lays its runway **in valley
coordinates against the bounds of its whole cluster**, and each cell draws its slice of one
continuous line. Handed no bounds it falls back to *"this cell IS the field"* — and would
have painted a complete miniature airfield every 96 m, ninety-four times over.

The world model has walked the blob for this since 7/26 (`clusterBoundsOf`). The walked
surface never had to, because it never carried the module. It does now: one BFS per blob,
cached onto every cell of that blob, so the cost is one walk per field and not one per cell.

**Measured on the real surface:** two neighbouring airport cells come back **88.5% identical**
— not 100%. They are different slices of one runway. If the bounds were not arriving they
would be byte-identical.

---

## THE VERIFICATION LESSON, WHICH IS THE REAL ONE

The Strip pass verified itself by calling `kitRoadLegs()` inside the live page and reading
what it returned. That is asking the HELPER what it thinks, not asking the SURFACE what it
drew. A checker built that way passes while the page is wrong — the same shape as the three
broken rulers this repo has already paid for.

This pass reads **`m.kit`** — the actual code grid the renderer blits — and asserts things
that can only be true if the district's own module produced it: `kit=true`, five or more
distinct codes, and a legend behind them. Twenty types checked in the running alpha,
**20 live / 0 dead, zero page errors.**

---

## WHAT IS STILL NOT REACHABLE

* **`estate` and `gated`** are fine and were never the problem — they ride the suburb
  generator and build 21 and 20 real houses each.
* **`convention` (6), `prison` (4), `dam` (4), `minigp` (1)** — 15 cells with no district
  module at all, still on the generic blockgen path. Real building types, buildable, nobody's
  canon to invent. That is the next one.
* **The eight named gaming landmarks** (Sphere ×4, Luxor, Strat, the Welcome sign, High
  Roller, Springs) — single cells, and what each one *is* is IDENTITY. **[PENDING Paolo]**.
* Two modules in this page are stale (`bohemia_agents.js`, `bohemia_population.js`) and were
  stale before this work. The resync tool cannot see them — their banners wrap, which
  `banner_gate` already documents as an opt-out from the ENGINE SYNC LAW. **Another lane's
  file, flagged, not touched** (ONE SYSTEM, ONE SESSION).
