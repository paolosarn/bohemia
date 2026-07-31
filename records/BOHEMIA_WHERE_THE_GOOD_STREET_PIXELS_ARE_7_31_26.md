# WHERE THE GOOD STREET PIXELS ARE (7/31/26)

Paolo: *"whatever pixels you're using for the streets are quality and I just need
you to help me identify that for the other chat cause I think some of the other
chats they've lost how to find that high quality graphic Street... the streets
are very important."*

**Nothing was drawn for the combat street. Every pixel of it came out of two
banks that were already in the repo and already approved.** This file is the
answer, so any lane can wire the same street in an afternoon.

---

## THE TWO BANKS, BY EXACT PATH

### 1. `banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt`
**This is the one people are losing.** It is the STREET BLOCKS row of
`records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md` (verdict source: REAL_VEGAS R2)
and it is already wired in CITY. Everything is a full 44px tile with the paint
already on the asphalt, so a marking never has to be composited over a road.

Open it with `json.load`. The pools:

| key | count | what it is |
|---|---|---|
| `pools.street` | 18 | **the roadway.** Grey cracked asphalt, the good stuff |
| `pools.side` | 36 | **the sidewalk.** Pale concrete, joints, weeds in the cracks |
| `pools.median` | 3 | the **double-yellow** centre line, already washed out |
| `pools.lane_div` | 2 | the white lane line |
| `pools.cross` | 3 | the crossing bars |
| `pools.twlt_v_L/R`, `twlt_h_T/B` | 6 each | two-way-left-turn |
| `pools.pocket_line_v/h` | 6 each | turn pockets |
| `pools.stall_line_v/h` | 18 each | **parking stalls** |
| `pools.desert`, `rock`, `scorch` | 10/1/3 | the margins |
| `weather_variants.*` | 2x each pool | the weathered siblings |

**AND IT CARRIES THREE OF PAOLO'S OWN RULINGS, IN THE BANK, NOT IN /laws.** This
is why the tiles look right and hand-painted markings never do:

- **`markings_30yr_law`** — wash 0.55 plus a second 0.40 pass.
  *Paolo 7/14: "whites and yellows of all medians/crosswalks/lanes/parking should
  be more washed out."*
- **`weather_rarity_law`** — parents 88%, weathered 12%.
  *Paolo 7/14: "why did a bunch of the tiles change color."*
- **`desert_dominance_law`** — one dominant tile at 85%, accents in coherent
  clusters, **"per-cell random shuffle" BANNED**.
  *Paolo 7/14: "too much diversity with the desert tiles."*
- **`parking_geometry_law`** — stall lines every 3rd tile, shared dividers,
  interior 2 tiles, row depth 4, aisle 4. *Paolo 7/14, proof PK0/PK1 blessed.*

### 2. `banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt`
The 42-tile set Paolo approved 7/28 and picked again 7/29 ("A"), byte-locked in
`records/target/BOHEMIA_VISUAL_CONSTITUTION.json`, and what the RUN ships.
Combat takes the pieces the street bank does not carry:
`road_gutter`, `walk_kerb`, `dirt`, `yard_0/1/2`, `concrete_0/1`.

---

## THE FOUR THINGS THAT MAKE IT LOOK GOOD

Having the tiles is not enough. These are what actually did the work:

1. **ROAD AND MARKINGS FROM THE SAME BANK.** The first version took the road from
   the starter set and the median from the street pools, and I had to *measure*
   that they matched (2.6 luminance apart). Taking both from one bank means they
   match by construction and no measurement is needed.

2. **QUARTER-TURNS AT BLIT TIME, FOR FREE.** Rotating each tile 0/90/180/270 when
   it is scaled into the blit cache turns 8 variants into 32 distinct faces at
   **zero extra payload**. This is what kills the visible grid. The street bank
   expects rotation: it ships its own `orientation_table` with
   `rot90_for_EW_road`.

3. **DIRECTIONAL TILES MUST NOT BE ROTATED, AND YOU MEASURE WHICH ARE.** Do not
   guess. Measured off the pixels:
   - `walk_kerb`: bottom 6 rows mean luminance **146.4** vs `walk_0`'s 117.4 →
     the kerb lip is a bright band on the **bottom** edge.
   - `road_gutter`: top 6 rows **49.5** vs bottom **61.4** → the kerb shadow is on
     the **top** edge.
   - `median` / `lane_div`: row-to-row variation 4.6 vs column-to-column 2.1 →
     the lines run **horizontal**, i.e. authored for an EAST-WEST road.
   All of it is authored for an EW road, so a north-south street turns them.

4. **OBEY `desert_dominance_law` ON ANY OPEN GROUND.** I ignored it once and the
   lots came out a checkerboard. One hash per 4x4 REGION, and a region is the
   dominant tile or a single accent, never a mix.

---

## THE WORKING CODE, IF YOU WANT TO COPY IT

`tools/bohemia_combat_street_tiles_patch.py` (bakes and embeds)
`tools/bohemia_combat_street_edges_patch.py` (the quarter-turns and the sidewalk
edge)
`tools/bohemia_combat_lot_dominance_patch.py` (the dominance law)
`tools/bohemia_combat_mass_and_streetpool_patch.py` (the switch to the street
bank)

All four are idempotent, none of them cooks a pixel, and each carries a REUSE
CHECK naming the bank it opens.

---

## THE ONE-LINE VERSION FOR ANOTHER CHAT

> The good street tiles are `banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt`
> (`pools.street` 18, `pools.side` 36, plus median / lane_div / cross / stall
> lines, all with the paint already on the asphalt). It is the STREET BLOCKS row
> of the approved asset index. Rotate them per cell to kill the grid, never
> rotate the kerb or the gutter, and read the four Paolo rulings stored inside
> the bank itself.
