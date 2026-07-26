# BOHEMIA — DEMO TILE BAKE INTEGRATION (7/10/26)

## What shipped
- `BOHEMIA_DEMO_TILE_BAKE_7_10_26.txt` — 24 tiles, 5 categories, 44px RGBA light
  copies, EXACT same JSON shape as BOHEMIA_TILE_REPO.txt:
  `{version, built, type:{cat:tiletype}, tiles:{cat:[b64...]}, counts}`
- `BOHEMIA_DEMO_TILE_SOURCES_7_10_26.txt` — HD-master pointers per tile
  (file|pack|idx) so any bad cut re-cuts from the masters, per the manifest law.
- `bohemia_purity_gate.py` — permanent FACTORY-LAW gate (see below).

## Categories baked (name -> 7-type)
- sewer_wash  (4)  -> ground   — light dry concrete, the flood channel
- sewer_floor (7)  -> ground   — dark wet stone tunnel floor
- sewer_water (3)  -> ground   — the channel that threads the descent
- sewer_wall  (8)  -> wall     — dark neutral tunnel walls, tonal spread
- sewer_door  (2)  -> door     — dark gates/doors (NOT the hatch)

## HOW THE CODE ACCEPTS IT
1. The bake file is MERGEABLE into the alpha's tile repo: for each category in
   `tiles`, add the category to the alpha repo's `tiles` and its type to `type`,
   update `counts`. New names (sewer_*) cannot collide with existing categories.
2. The judging menu picks the new categories up automatically once merged —
   they land UNJUDGED like all new tiles (per standing law: no pre-approval).
3. The demo map (BOHEMIA_SEWER_DEMO_MAP_SPEC) references zones wash/sewer/water;
   the render bridge maps zone -> category: wash->sewer_wash, sewer->sewer_floor,
   water->sewer_water, plus sewer_wall for tunnel edges, sewer_door for interior
   doors. THE HATCH IS NOT A TILE — it is the one purple PROP, rendered from
   NEUROLINK_GLOW/amalgam colors (see agent look files).
4. MERGE HAPPENS IN THE MAIN PROJECT SESSION that owns the alpha (one-alpha law).
   This chat ships the bake; the alpha-owning session merges it.

## THE PURITY GATE (FACTORY LAW — permanent regression gate)
`python3 bohemia_purity_gate.py <repo.txt>` — exits 1 with a violation list if
ANY tile contains purple px (Purple Reservation Law) or lava-hot px (No Volcano
Law). Runs on light bakes AND HD chunks. Every future tile bake runs this gate
before shipping. Current bake: PASS (0 purple, 0 lava, all 24 tiles).

## PENDING PAOLO
- Eyeball the sewer walls/doors when parked (auto-picked for tone, your call)
- The hatch PROP art itself (drawn marker so far, needs its real look)

## UPDATE (same day) — map data + hatch variants shipped
- `BOHEMIA_SEWER_DEMO_MAP_DATA_7_10_26.json` — the machine-readable map the render
  bridge consumes directly: 14x30 grid, zone->category mapping, computed WALL layer
  (80 cells, every void orthogonally touching walkable), player_start, hatch pos,
  6 validated agent spawns (left chamber x2, right chamber x2, hatch guards x2).
  Render rule: walls draw with `sewer_wall`, doors with `sewer_door`, hatch is the
  purple prop at hatch.pos.
- `BOHEMIA_HATCH_VARIANTS.png` + `BOHEMIA_HATCH_{0..3}.png` — four 44px hatch prop
  OPTIONS for Paolo to pick (dial-directions precedent): 0 MANHOLE (purple seam rim),
  1 VAULT (spoked door, purple core), 2 IRIS (amalgam eye aperture), 3 GRATE (purple
  light bleeding up through slats). All inside the Purple Reservation Law.
  [PENDING Paolo: pick one or redirect.]

## UPDATE v3 — HOMELESS CAMPS (set dressing, 7/10/26)
- Bake gains 4 PROP categories: sewer_prop_bed/trash/crate/misc (6 tiles each,
  purity-gated, cold props only — nothing emissive, No Volcano Law safe).
- Map data gains `props` (23 placements) + `prop_pools`: CAMPS in both ambush
  chambers (bedding + crates + trash = the agents LIVE there, the camp tells the
  story before the fight starts), corners of the hatch room, sparse tunnel and
  wash scatter. No placement collides with a spawn cell.
- Render rule: props draw AFTER ground, same cell, alpha-composited. PROP type =
  walk-around per the 7-type system.
- Map render v3 shipped: camps visible, purity re-verified (0 lava, purple hatch-only).

## v12 UPDATES (7/10/26)
- tiles_multicell.sewer_door_multi: 2 Paolo-validated doors (2x2 industrial,
  2x1 airlock). Render per DOOR FOOTPRINT LAW; 1x1 sewer_door DEPRECATED —
  wire multicell doors into wall lines; junction treatment [PENDING Paolo],
  flush = placeholder.
- Cover props available (family='cover' in multicell set) — see
  BOHEMIA_COVER_INTEGRATION_7_10_26.md; placement = Paolo/map.
- Water slots: lead favorite + 3 Paolo-validated quilts; context dressing
  (clean/dirty) at render per water-context law.
- All consuming rules for families: BOHEMIA_FAMILY_CONSUMER_RULES_7_10_26.md.
