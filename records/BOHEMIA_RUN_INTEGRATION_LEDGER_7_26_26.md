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
| neighbours (agents, homed + scheduled) | INTEGRATED | agents_module | bohemia_agents.js sim, one world-minute per step |
| quest runtime + canon .bq | INTEGRATED | quest_runtime | the real parser + runtime, real canon bytes (throwaway CONTENT by ruling) |
| clout / feed / followers | INTEGRATED | clout_feed | the engine's own buildFeed + socialProfile + cloutWeight |
| combat (Dead Eye Dial) | INTEGRATED | combat_bridge | a loud resolution really hands off to the real combat frame and back |
| factions / world bridge | PARTIAL | world_bridge | quest outcomes really move faction standing, but nothing in the run SHOWS it |
| real valley / districts | NOT YET | — | the run is one detached block, not a cell of the generated valley |
| the target screen's look (visual constitution) | INTEGRATED | target_tiles | the block is laid from the FROZEN 42-tile starter set: cracked asphalt, kerb/gutter, weedy walk, tan stucco face with windows and boarded windows, real hip roof, garage openings on their own driveways. CORRECTION: the target Paolo picked is TOP-DOWN, not three-quarter, so the old "the run must go iso" row was wrong and is retired. |
| district heroes + district art (21 types) | NOT YET | — | none of the built districts are walkable in the run |
| music (faction pools, 120 BPM) | INTEGRATED | music_bridge | the alpha's own MUS/CITYMUS synth scores the walk; one AudioContext in the parent, no second music engine |
| day cycle / light pass / LIGHT=TERRITORY | NOT YET | — | the block is one fixed time of day, lamps are dead props |
| economy | NOT YET | — | booted in the context, untouched by the run |
| dress-by-rank | NOT YET | — | bodies are random colourways, not rank-dressed |
| vehicles | NOT YET | — | driveways are empty; the drivable network is unused |
| save / load | INTEGRATED | save_blob | ONE versioned device-agnostic blob (engine save + run state), sleep + manual + autosave, export/import code, no device prefs inside, older versions migrate forward |
| death is a reload | INTEGRATED | death_reload | losing a fight loads the closest previous save, never a reset (7/26 ruling) |

## THE ORDER THE GAPS GET CLOSED (biggest visible first)
1. **INTERIORS TO THE TARGET** — the outside now speaks the constitution's
   language; inside is still flat role-tinted plates. CITY's interior pool
   (banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt, 465 swept-UP tiles) is the
   ingredient and it is deliberately unwired, waiting for exactly this.
2. **THE REAL VALLEY** — the run's block becomes a real cell of the generated
   valley so walking off it lands in a real neighbouring district.
3. **DISTRICT ART** — the 21 built district types become places the errand can
   route him through.
4. **DAY CYCLE + LIGHT** — the lamps and the dark mean something.
5. **VEHICLES + DRESS-BY-RANK** — the driveways are empty and bodies are random
   colourways instead of rank-dressed.

Everything below that is bookkeeping compared to those five.
