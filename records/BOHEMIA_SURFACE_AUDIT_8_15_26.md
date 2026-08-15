# BOHEMIA — WHICH SURFACE IS EACH ROW TRUE ABOUT? (8/15/26, FACTIONS lane)

The integration ledger has **35 rows**. `gates/integration_gate.js` reads
`slices/BOHEMIA_RUN_CURRENT.html` for every one of them — the file the alpha
preloads and **never displays** since the coordinator ruled the CITY WORLD the
walked surface on 8/14.

The ledger's own header has said so since **8/4**: *"the greens below are not
evidence about the surface he plays, and no reader can tell which ones are."* A
warning nobody can act on is a disclaimer. This is the list.

## THE CLAIM THIS MAKES, AND THE ONE IT DOES NOT

For each row: **is the evidence that row's own probe looks for present on the
walked surface?**

**NOT FOUND does not mean broken.** The city is a separate renderer that shares
almost no drawing code with the run, and the ledger header says most systems *are*
there "each under its own spelling". So NOT FOUND means **go and look** — addressed
to the lane that owns the row, by the lane that just made this exact mistake with
its own three rows.

## THE COUNT

| | rows |
|---|---|
| ON THE WALKED SURFACE | **6** |
| ONLY ON THE ONE HE NEVER SEES | **22** |
| ON NEITHER, BY ITS OWN EVIDENCE | **0** |
| CANNOT TELL FROM ITS PROBE | **7** |

## EVERY ROW

| system | status | probe | its evidence on the walked surface | row names its surface |
|---|---|---|---|---|
| character rig + painted regions | INTEGRATED | `cast_bridge` | ONLY ON THE ONE HE NEVER SEES (0/3) | **no** |
| wardrobe / clothing | INTEGRATED | `cast_bridge` | ONLY ON THE ONE HE NEVER SEES (0/3) | **no** |
| face system | INTEGRATED | `portraits` | ONLY ON THE ONE HE NEVER SEES (0/2) | **no** |
| walk cycle animation | INTEGRATED | `walk_frames` | ONLY ON THE ONE HE NEVER SEES (0/2) | **no** |
| painter-sorted bodies | INTEGRATED | `body_sort` | ONLY ON THE ONE HE NEVER SEES (0/2) | **no** |
| suburb block generator | INTEGRATED | `suburb_module` | ONLY ON THE ONE HE NEVER SEES (0/1) | **no** |
| house skins | INTEGRATED | `art_banks` | CANNOT TELL FROM ITS PROBE | **no** |
| animated doors (2 tiles tall) | INTEGRATED | `door_anim` | ONLY ON THE ONE HE NEVER SEES (0/3) | **no** |
| floorplan interiors | INTEGRATED | `floorplan_module` | ON THE WALKED SURFACE (1/1) | **no** |
| interiors dressed (CITY's UP-only pool) | INTEGRATED | `interior_pool` | ONLY ON THE ONE HE NEVER SEES (0/5) | **no** |
| neighbours (agents, homed + scheduled) | INTEGRATED | `agents_module` | ONLY ON THE ONE HE NEVER SEES (0/2) | **no** |
| quest runtime + canon .bq | INTEGRATED | `quest_runtime` | CANNOT TELL FROM ITS PROBE | **no** |
| clout / feed / followers | INTEGRATED | `clout_feed` | ONLY ON THE ONE HE NEVER SEES (0/3) | **no** |
| combat (Dead Eye Dial) | INTEGRATED | `combat_bridge` | ONLY ON THE ONE HE NEVER SEES (0/2) | **no** |
| factions / world bridge | INTEGRATED | `world_bridge` | ONLY ON THE ONE HE NEVER SEES (0/1) | **no** |
| faction consequence on screen | INTEGRATED | `world_bridge_shown` | ON THE WALKED SURFACE (1/1) | **no** |
| the sixteen introductions | INTEGRATED | `introductions_shown` | ON THE WALKED SURFACE (1/1) | yes |
| the valley's people know each other | INTEGRATED | `ties_shown` | ON THE WALKED SURFACE (1/1) | yes |
| what a faction wants from you | INTEGRATED | `belonging_shown` | ON THE WALKED SURFACE (1/1) | yes |
| real valley / districts | INTEGRATED | `real_valley` | ONLY ON THE ONE HE NEVER SEES (0/6) | **no** |
| the target screen's look (visual constitution) | INTEGRATED | `target_tiles` | ON THE WALKED SURFACE (1/1) | **no** |
| district heroes + district art (21 types) | PARTIAL | `district_material` | ONLY ON THE ONE HE NEVER SEES (0/3) | **no** |
| music (faction pools, 120 BPM) | INTEGRATED | `music_bridge` | ONLY ON THE ONE HE NEVER SEES (0/1) | **no** |
| day cycle / light pass / LIGHT=TERRITORY | NOT YET | `—` | CANNOT TELL FROM ITS PROBE | **no** |
| economy | NOT YET | `—` | CANNOT TELL FROM ITS PROBE | **no** |
| dress-by-rank | NOT YET | `—` | CANNOT TELL FROM ITS PROBE | **no** |
| vehicles | NOT YET | `—` | CANNOT TELL FROM ITS PROBE | **no** |
| the sentence: one button, act, spend time, resolve | INTEGRATED | `resolver` | ONLY ON THE ONE HE NEVER SEES (0/8) | **no** |
| walk feel, playable (lab's 3 options) | INTEGRATED | `walk_feel` | ONLY ON THE ONE HE NEVER SEES (0/4) | **no** |
| save / load | INTEGRATED | `save_blob` | ONLY ON THE ONE HE NEVER SEES (0/8) | **no** |
| death is a reload | INTEGRATED | `death_reload` | ONLY ON THE ONE HE NEVER SEES (0/1) | **no** |
| the cooked perimeter wall (8/2, 11 designs approved) | INTEGRATED | `banks_used` | ONLY ON THE ONE HE NEVER SEES (0/4) | **no** |
| music OFF really silences | INTEGRATED | `music_bridge` | ONLY ON THE ONE HE NEVER SEES (0/1) | **no** |
| the d-pad is a control, not text | INTEGRATED | `touch_guard` | CANNOT TELL FROM ITS PROBE | **no** |
| ONE VEGAS (run and city, same seed) | INTEGRATED | `one_seed` | ONLY ON THE ONE HE NEVER SEES (0/7) | **no** |

---
*Generated by tools/bohemia_surface_audit.py. No lane's code is touched by this
file; it reads the ledger, the gate's own probes, and the two surfaces.*
