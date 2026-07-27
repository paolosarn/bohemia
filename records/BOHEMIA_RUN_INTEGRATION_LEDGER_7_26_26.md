# BOHEMIA — THE RUN INTEGRATION LEDGER

Paolo's ruling 7/26 (laws/BOHEMIA_ADDENDUM_THE_RUN_IS_THE_INTEGRATION_LANE_7_26_26.md):
the run lane's job is to get EVERYTHING the fleet has built into the one thing he
plays. This file is the scoreboard, and `gates/integration_gate.js` enforces it:

  **A row may not be marked INTEGRATED without a machine probe that proves it.**
  An INTEGRATED row with no probe, or a probe that fails, turns the gate RED.

Statuses: `INTEGRATED` (really in the run, probed) · `PARTIAL` (some of it, named)
· `NOT YET` (honestly absent). No other value is legal.

| system | status | probe | note |
|---|---|---|---|
| character rig + painted regions | INTEGRATED | cast_bridge | the real baked body, 8 directions, from the RIG/CHARACTER tabs |
| wardrobe / clothing | INTEGRATED | cast_bridge | every body on the block wears the real wardrobe (tinted colourways) |
| face system | INTEGRATED | portraits | the real 64x64 face render is the dialogue portrait |
| walk cycle animation | INTEGRATED | walk_frames | 4-frame walk per direction, one frame per committed step (I-MOVE-YOU-MOVE) |
| painter-sorted bodies | INTEGRATED | body_sort | people overlap by depth, player included |
| suburb block generator | INTEGRATED | suburb_module | the approved 7/18 Campana block, canon generator |
| house skins | INTEGRATED | art_banks | the approved 7/21 roof/yard/wall skins, byte-identical |
| animated doors (2 tiles tall) | INTEGRATED | door_anim | the approved 7/13 door-anim bank: 1 wide x 2 tall, 9-frame swing over 2 beats, a shut door really blocks |
| floorplan interiors | INTEGRATED | floorplan_module | real generated rooms, interior === exterior footprint |
| interiors dressed (CITY's UP-only pool) | INTEGRATED | interior_pool | one floor per ROOM picked by the room's own function (dirt in a garage, tile in a wet room), props from the role's own buckets, walls from the constitution's own tile. Props are decoration, never collision. |
| neighbours (agents, homed + scheduled) | INTEGRATED | agents_module | bohemia_agents.js sim, one world-minute per step |
| quest runtime + canon .bq | INTEGRATED | quest_runtime | the real parser + runtime, real canon bytes (throwaway CONTENT by ruling) |
| clout / feed / followers | INTEGRATED | clout_feed | the engine's own buildFeed + socialProfile + cloutWeight |
| combat (Dead Eye Dial) | INTEGRATED | combat_bridge | a loud resolution really hands off to the real combat frame and back |
| factions / world bridge | PARTIAL | world_bridge | quest outcomes really move faction standing, but nothing in the run SHOWS it |
| real valley / districts | INTEGRATED | real_valley | the run stands on a real CELL of the generated valley (same seed, same overmap, same generators), read off the world model's own tile rung; walking off an edge really loads the neighbouring district. What BLOCKS you is now the world's answer (tile.solid), not a second copy of the rules living in the run. |
| the target screen's look (visual constitution) | INTEGRATED | target_tiles | the block is laid from the FROZEN 42-tile starter set: cracked asphalt, kerb/gutter, weedy walk, tan stucco face with windows and boarded windows, real hip roof, garage openings on their own driveways. CORRECTION: the target Paolo picked is TOP-DOWN, not three-quarter, so the old "the run must go iso" row was wrong and is retired. |
| district heroes + district art (21 types) | PARTIAL | district_material | the other districts are WALKABLE now and are laid from the constitution's materials using the WORLD'S OWN tile names (asphalt roadway, curb + gutter, dirt shoulder, sidewalk, gravel access road, solar panel...). That is a MATERIAL pass, not district art: nothing yet reads as a solar farm or an arterial specifically. |
| music (faction pools, 120 BPM) | INTEGRATED | music_bridge | the alpha's own MUS/CITYMUS synth scores the walk; one AudioContext in the parent, no second music engine |
| day cycle / light pass / LIGHT=TERRITORY | NOT YET | — | the block is one fixed time of day, lamps are dead props |
| economy | NOT YET | — | booted in the context, untouched by the run |
| dress-by-rank | NOT YET | — | bodies are random colourways, not rank-dressed |
| vehicles | NOT YET | — | driveways are empty; the drivable network is unused |
| the sentence: one button, act, spend time, resolve | INTEGRATED | resolver | the ported engine/bohemia_resolve.js drives every verb: REACH (1 tile, declared once) picks what you are standing at, ONE button becomes talk/enter/use/sleep/hang out, and every spend runs the world through declared moments in declared phase order (sleep 8, hang out 1, eat unpriced by ruling) |
| walk feel, playable (lab's 3 options) | INTEGRATED | walk_feel | GRID / SLIDE / HYBRID / FREE, switchable mid-walk from the menu, so the pattern note's fork is something to feel instead of read |
| save / load | INTEGRATED | save_blob | ONE versioned device-agnostic blob (engine save + run state), sleep + manual + autosave, export/import code, no device prefs inside, older versions migrate forward |
| death is a reload | INTEGRATED | death_reload | losing a fight loads the closest previous save, never a reset (7/26 ruling) |

## THE ORDER THE GAPS GET CLOSED (biggest visible first)
1. **DISTRICT ART** — the districts are walkable but wear a generic material
   pass. Each district type needs its own dressed language the way the suburb
   has one, built to the constitution.
2. **DAY CYCLE + LIGHT** — the lamps and the dark mean something.
3. **VEHICLES + DRESS-BY-RANK** — the driveways are empty and bodies are random
   colourways instead of rank-dressed.
4. **THE FACTIONS SHOWING** — quest outcomes really move standing, but nothing
   in the run shows it.

Everything below that is bookkeeping compared to those five.
