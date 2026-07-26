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
| 3/4 iso view (45 DEGREE ART LAW) | NOT YET | — | the run is flat top-down; the game's art is three-quarter. Biggest visual gap. |
| district heroes + district art (21 types) | NOT YET | — | none of the built districts are walkable in the run |
| music (faction pools, 120 BPM) | INTEGRATED | music_bridge | the alpha's own MUS/CITYMUS synth scores the walk; one AudioContext in the parent, no second music engine |
| day cycle / light pass / LIGHT=TERRITORY | NOT YET | — | the block is one fixed time of day, lamps are dead props |
| economy | NOT YET | — | booted in the context, untouched by the run |
| dress-by-rank | NOT YET | — | bodies are random colourways, not rank-dressed |
| vehicles | NOT YET | — | driveways are empty; the drivable network is unused |
| save / load | NOT YET | — | ruled 7/26 (DEATH IS A RELOAD + SAVES AND CLOUD); not wired to the run yet |

## THE ORDER THE GAPS GET CLOSED (biggest visible first)
1. **3/4 ISO VIEW** — the single loudest "this isn't our game" signal. The city
   tab already renders the real iso world with the real character in human mode;
   the run's world view should become that renderer, not a second one.
2. **THE REAL VALLEY** — the run's block becomes a real cell of the generated
   valley so walking off it lands in a real neighbouring district.
3. **DISTRICT ART** — the 21 built district types become places the errand can
   route him through.
4. **DAY CYCLE + LIGHT** — the lamps and the dark mean something.
5. **VEHICLES + DRESS-BY-RANK** — the driveways are empty and bodies are random
   colourways instead of rank-dressed.

Everything below that is bookkeeping compared to those five.
