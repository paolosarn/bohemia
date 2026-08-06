#!/usr/bin/env python3
"""
BOHEMIA GATES — one command, every law (7/16/26)

Nine gates got built today. Nine gates nobody will remember to run individually
is nine gates that do not exist. That is the exact failure this whole day was
about: laws enforced by memory are not enforced.

  python3 bohemia_gates.py            # everything
  python3 bohemia_gates.py --fast     # skip the pixel sweeps (~2s vs ~4min)
  python3 bohemia_gates.py --strict   # exit 1 if any gate fails

Run it before any absorption, any wrap, and after any engine edit. Green or it
does not ship.
"""
import subprocess, sys, time, os

# The repo layout (7/17/26): gates live in gates/, engine modules in engine/.
# Every gate runs with cwd = repo root, so data reads are repo-root-relative.
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO_ROOT)

# (name, argv, what it protects, slow?)
GATES = [
    # FIRST ON PURPOSE (8/4): it is the gate that makes the OTHER gates able
    # to run. Nine pixel gates need Pillow+numpy and a fresh container has
    # neither, so they used to all die at the END of a 700s run looking like
    # nine real art failures. BACKLOG SOUNDS #5, closed.
    ('SETUP HOOK',     ['python3', 'gates/setup_hook_gate.py'],
     'a fresh container installs its own gate image stack and never blocks the session doing it', False),
    ('GDD LINEAGE',    ['node', 'gates/gdd_gate.js'],
     'v2/v3/v4 are LIVE, v5 extends them', False),
    ('CARRY',          ['python3', 'gates/carry_gate.py', '.'],
     'the registry never eats a live file', False),
    ('ENGINE SYNC',    ['python3', 'gates/bohemia_sync_gate.py', '.'],
     'no module has two bodies', False),
    ('BUNDLE',         ['node', 'gates/bundle_gate.js'],
     'the bundle never lies about its md5s', False),
    ('GRAVEYARD',      ['python3', 'gates/bohemia_graveyard_gate.py', '.', '--strict'],
     'dead things stay dead', False),
    ('ENGINE TESTS',   ['node', 'engine/bohemia_graphics_tests.js'],
     'the graphics engine itself', False),
    ('SIDEWALK',       ['node', 'gates/sidewalk_gate.js'],
     'sidewalk sanctity', False),
    ('LINE COLOR',     ['node', 'gates/line_gate.js'],
     'yellow=direction, white=lane', False),
    ('STREET CONNECT', ['node', 'gates/street_connectivity_gate.js'],
     'no street dead-ends into empty lots', False),
    ('VALLEY SCALE',   ['node', 'gates/valley_scale_gate.js'],
     'a district is the size the 7/6 law says (128x128 = 96m), and ONE constant says so', False),
    ('DISTRICT FILL',  ['node', 'gates/district_fill_gate.js'],
     'the floor one level down from MAP SIZE: every district type pinned at the content share it measured on 8/2, because walkable_gate compares pavement to content and a district with NO pavement passes it however empty it gets', False),
    ('BLOB INTEGRITY', ['node', 'gates/blob_integrity_gate.js'],
     'the game is a shell plus EIGHT big documents (3 inline blobs + 5 sibling pages) rewritten by string surgery daily and resolved whole on every rebase: each one decodes, is not truncated, carries no merge markers and still PARSES -- the checks that existed were presence and size floor, which a stale or half-merged re-encode passes', False),
    ('HANDOFF',        ['node', 'gates/handoff_gate.js'],
     'the one file every session is told to read FIRST is readable: exactly one handoff, at its canonical name, leading with a lane head, and carrying no unresolved merge -- it reached main conflicted TWICE, hiding a whole lane behind a marker', False),
    ('REPO BUDGET',    ['node', 'gates/repo_budget_gate.js'],
     'the OTHER clock: 8/2 caught the 100 MB PER-FILE cap, but the REPOSITORY ceiling has its own -- 900 MB packed, +32.5 MB/day, GitHub hard cutoff at 5 GB in ~130 days, less than halfway through the 11 months of planned work', False),
    ('MAP SIZE',       ['node', 'gates/mapsize_gate.js'],
     'Paolo 8/2 "before you cut anything": the valley is 96x96 districts, 84.9 km2, 37.0 km2 of it BUILT (about the whole of Skyrim, ~4.6x Fallout New Vegas) and 75.7 km2 you can put a foot on -- with a FLOOR, so the world cannot be quietly emptied while every other gate stays green', False),
    ('DISTRICT REG',   ['node', 'gates/district_registry_gate.js'],
     'every district type is catalogued', False),
    ('FLOORPLAN',      ['node', 'gates/floorplan_gate.js'],
     'every room reachable, buildings enterable', False),
    ('ROOMS',          ['node', 'gates/rooms_gate.js'],
     'ONE WORLD INTERIORS step 1: inside is a property of the CELL, one room group per '
     'enclosed space, and no room id ever leaks onto the street', False),
    ('SUBURB MODULAR', ['node', 'gates/suburb_modular_gate.js'],
     'suburbs snap into 1x2 / 2x2, connected', False),
    ('STREET SOURCE',  ['node', 'gates/street_source_gate.js'],
     'Paolo 7/31: street pixels come from HIS harmonized pool -- bytes, not a citation', False),
    ('FOOTSTEP',       ['node', 'gates/footstep_gate.js'],
     'Paolo 7/31: walking MAKES A SOUND -- his judged footsteps reach the surface he walks', True),
    ('TRAFFIC SIGNAL',['node', 'gates/traffic_signal_gate.js'],
     'Paolo 8/1: his 348-sprite signal bank reached NOTHING for two weeks. His sprites are in '
     'the renderer byte for byte, the broken ones on the floor with them, his arm/color laws '
     'applied, and a signal MEASURED on screen at a real intersection in a real browser', True),
    ('FULL RES',       ['node', 'gates/full_res_gate.js'],
     'Paolo 7/31 + 8/1 "WHY IS THE PIXEL QUALITY NOT AT FULL BRO WTF... of the terrain of the '
     'ground of the houses": the chunk bake resolution EQUALS his approved art size, measured as '
     'a real source-vs-destination blit ratio in a browser, so nothing is decimated before '
     'compositing', True),
    ('RUN SPAWN',      ['node', 'gates/run_spawn_gate.js'],
     'Paolo 8/2: the run opens in the district we are WORKING ON, not the middle of the map. '
     'It was hardcoded to the Strip at cell 44,48 every single run. One setting, one command '
     '(tools/bohemia_run_spawn.py <district>), verified by booting the real alpha and asking '
     'the world model what district the player is standing in', True),
    ('SUN SHADOWS',    ['node', 'gates/shadow_gate.js'],
     'Paolo 8/2 BUILT WORLD B2: buildings cast shadows on the ground and the DIRECTION and '
     'LENGTH follow the in-game clock. Measured in a real browser -- shadow cells counted at '
     'midday, morning and evening falling opposite ways, longer at the horizons, and zero at '
     'night', True),
    ('DOORWAY',        ['node', 'gates/doorway_gate.js'],
     'Paolo 8/2: a building WITH a door can only be entered through its door, and a building '
     'with NO door is unchanged so nothing is ever sealed. The no-lockout check runs FIRST on '
     'purpose -- 10 of 14 district types have no door cell at all, so making walls solid '
     'everywhere before doors exist would seal the valley', True),
    ('ZOOM SEAM',      ['node', 'gates/zoomseam_gate.js'],
     'Paolo 8/2: "i should be able to ZOOM OUT UNTIL I GET INTO THE CITY BUILDER MODE". '
     'setHZoom clamped the request on its first line so pinching out at the widest stop was '
     'silently pinned there. Both directions driven on the real surface, and the ZOOM LEVEL '
     'LAW still snaps to its four pixel-true stops', True),
    ('INTERIOR WALL',  ['node', 'gates/interior_wall_gate.js'],
     'Paolo 8/2 "MY BIGGEST THING WITH INTERIORS WHY IS THE DOOR TWO TILES AND THE WALLS ARE '
     'ONE TILE": indoors the wall now stands two tiles like the door in it. Measured by '
     'entering a real house and counting destination heights -- two-tall walls present, floor '
     'still flat, nothing three or more', True),
    ('DOOR SWING',     ['node', 'gates/dooranim_gate.js'],
     'Paolo 8/2 "WHY IS THERE NO ANIMATIONS WHEN I GO THROUGH AND OPEN A DOOR WEVE WORKED ON '
     'THAT PREVIOUSLY": his 7/13 bank held 30 approved clips and ZERO frames had ever reached '
     'a renderer. Ten 88x176 swing clips now ride the door plate they exactly match, on his '
     'own 9-frames-over-2-beats timing, with animated frames COUNTED on a real canvas', True),
    ('DOOR JAMB',      ['node', 'gates/doorjamb_gate.js'],
     'Paolo 8/2 "if there is a door i need you to have it stick out slightly on the next '
     'tile": his 7/10 bank of 368 frame-edge strips had shipped 0 bytes. Every door now '
     'bleeds its jamb into the cell left and right, never stretched, never mirrored, and '
     'the jambs are COUNTED drawing on a real canvas', True),
    ('FULL PIXEL',     ['node', 'gates/full_pixel_gate.js'],
     'Paolo 7/31 B1: device-resolution canvas and an integer cell -- his art is never resampled', True),
    ('BOUGHT BEATS PAINTED', ['node', 'gates/bought_beats_painted_gate.js'],
     'Paolo 7/31: if he bought it, it wins -- his library draws FIRST, painted is the named fallback', False),
    ('SEE THROUGH',    ['node', 'gates/xray_gate.js'],
     'Paolo 8/3 ruling: "Ofcourse the building should become see through to reflect characters items or the player or doors" -- the old fade was correct and could NEVER fire (312 facades in the spawn cell, 0 walkable cells behind any of them); walls now go to glass around him, proved by DIFFING the pixels, and it stays a halo so the street does not shimmer', True),
    ('E/W DOOR',       ['node', 'gates/ewdoor_gate.js'],
     'Paolo: "I never saw your eastern west facing doors, bro what\'s up with that?" -- 368 cells approach from the east and 336 from the west against 324 from the south, and the side ones had ZERO doors because every door test read the cell BELOW. His 7/10 edge-on art, finally drawing, and no side door may be unreachable', True),
    ('EVERY DOOR',     ['node', 'gates/everydoor_gate.js'],
     'Paolo: "WY IS IT WHEN IM IN THE OUTSIDE OF A BUILDING I CAN ENTER IT FROM JUST WALKING TO ANY WALL" -- the 8/2 rule was right and covered 11% of buildings because buildings had no doors; a RATCHET on real door coverage, measured in a browser, that cannot be won by deleting buildings', True),
    ('STEP INSIDE',    ['node', 'gates/stepinside_gate.js'],
     'Paolo: "WHY WHEN I ENTER A HOUSE I CANT GO LEFT AND RIGHT" -- he was landing ON the door cell with a jamb either side; the gate PRESSES left and right through the real mover instead of flood-filling the passability test', False),
    ('KIT BINDING',    ['node', 'gates/city_kit_binding_gate.js'],
     'the CITY blob inlines the suburb BEFORE the district kit, so a load-time kit capture freezes as undefined and the world dies on the first call -- 32 gates red at once, alpha still booting clean', False),
    ('D1 KERB',        ['node', 'gates/d1_kerb_gate.js'],
     'Paolo 7/31: NEVER ON THE SIDEWALK, ANYWHERE -- swept over the whole district registry, not one module', False),
    ('SUBURB STREET',  ['node', 'gates/suburb_street_gate.js'],
     'Paolo 7/31: a ONE-GRID sidewalk, NO building on it ever, and driveways exactly 4x5', False),
    ('COMMERCIAL',     ['node', 'gates/commercial_gate.js'],
     'corner plaza: stores + parking connected to the streets', False),
    ('DISTRICT KIT',   ['node', 'gates/district_kit_gate.js'],
     'the factory: shared machine every district extends', False),
    ('FEEDBACK MASTER',['python3', 'gates/feedback_master_gate.py'],
     'Paolo 8/1 "remember all my feedback": every ruling in his own words is indexed where the next session reads it -- the repo is the only memory there is', False),
    ('BUILD THE WORLD',['python3', 'gates/build_the_world_gate.py'],
     'Paolo 7/31: quests, factions and the economy are OFF -- the footprint of all three is frozen and may only shrink', False),
    ('PURSE',          ['node', 'gates/purse_gate.js'],
     'the money is auditable and the numbers stay Paolo\'s: balances are a sum of the ledger, never negative, never anonymous, and PAYOUT/PRICES/PRODUCTION ship EMPTY', False),
    ('DRIVE NETWORK',  ['node', 'gates/drive_network_gate.js'],
     'Paolo 7/31 RULE NUMBER ONE: every drivable tile is reachable from the street, and a lane is wide enough to be a lane', False),
    ('ANSWERED FOR',   ['node', 'gates/answered_for_gate.js'],
     'Paolo 7/31: if I cannot write what a pixel IS it does not ship -- named, written, and EARNED (no code owns 30% of a plot)', False),
    ('LEGIBILITY',     ['node', 'gates/legibility_gate.js'],
     'you can tell what a building is: every building mass in every district gets an eave, one shared answer for the map and the judge surface', False),
    ('DISTRICT TAXONOMY', ['node', 'gates/district_taxonomy_gate.js'],
     'every district type files into one category', False),
    ('INDUSTRIAL',     ['node', 'gates/industrial_gate.js'],
     'warehouse yard on the kit: buildings + yard connected', False),
    ('MEDICAL',        ['node', 'gates/medical_gate.js'],
     'hospital campus: ER, ambulance, helipad, garage', False),
    ('SOLAR',          ['node', 'gates/solar_gate.js'],
     'solar farm: panels, inverters, substation, filled', False),
    ('PARK',           ['node', 'gates/park_gate.js'],
     'community park: field, diamond, courts, skate, dog run, filled', False),
    ('WASH',           ['node', 'gates/wash_gate.js'],
     'flood-control wash: channel + sewer tunnel mouth by the street, drivable', False),
    ('CEMETERY',       ['node', 'gates/cemetery_gate.js'],
     'memorial park: grave sections, chapel, mausoleum, columbarium, drivable', False),
    ('DRIVE-IN',       ['node', 'gates/drivein_gate.js'],
     'dead drive-in theater: screen tower, arced parking rows, snack bar, drivable', False),
    ('GOLF',           ['node', 'gates/golf_gate.js'],
     'dead golf course: holes (tee/fairway/green/bunker/pond), clubhouse, cart-path loop, drivable', False),
    ('STADIUM',        ['node', 'gates/stadium_gate.js'],
     'dead stadium: seating bowl, field, concourse, facade gates, light towers, parking, drivable', False),
    ('TRUCK STOP',     ['node', 'gates/truckstop_gate.js'],
     'dead gas/truck stop: overhead fuel canopy, pumps, store, wash, rig parking, pylon, drivable', False),
    ('SCHOOL',         ['node', 'gates/school_gate.js'],
     'dead school: E-building+gym, field+track, courts, playground, separate bus/drop-off/parking', False),
    ('FIRE STATION',   ['node', 'gates/firestation_gate.js'],
     'dead fire station: apparatus bays, red engines, apron, hose tower, drive-through pull-out', False),
    ('SWAP MEET',      ['node', 'gates/swapmeet_gate.js'],
     'dead swap meet: canopy stall rows, aisles, market hall, gravel parking — the barter stage', False),
    ('SELF-STORAGE',   ['node', 'gates/storage_gate.js'],
     'dead looted storage: unit rows, roll-up doors, pried-open units, drive aisles, fortress fence', False),
    ('WATER TREATMENT',['node', 'gates/watertreat_gate.js'],
     'dead wastewater plant: circular clarifiers, aeration/filter basins, control building, pipes', False),
    ('SALVAGE YARD',   ['node', 'gates/boneyard_gate.js'],
     'dead boneyard: rows of wrecks, crushed-car wall, claw crane, office+scale, fenced', False),
    ('POLICE STATION', ['node', 'gates/policestation_gate.js'],
     'dead police station: HQ, sally port, patrol fleet, impound, public/secure separation', False),
    ('LIBRARY',        ['node', 'gates/library_gate.js'],
     'dead library: ONE building — Predock drum + tower + museum wing + reading wing, plaza, lot', False),
    ('PAGES PUBLISH', ['node', 'gates/pages_publish_gate.js'],
     'the link stopped being true and no gate looked: Pages failed THREE commits running because the '
     'build was copying the whole 496 MB repo. _config.yml publishes slices/ (+ engine/ + records/target, '
     'which slices actually load) and this proves every outward ref still ships and the surface stays '
     'under what the builder can finish', False),
    ('VALLEY CENSUS', ['node', 'gates/valley_census_gate.js'],
     'Paolo 8/4: "know what comes after" -- measured across three seeds instead of guessed. Every '
     'district type that puts NOTHING on the ground is either flat BY FORM (a road, a ridge), '
     'RESERVED to Paolo (the Strip), or named FLAT DEBT that may only shrink', False),
    ('BIG ICONS',     ['python3', 'gates/big_icons_gate.py'],
     'Paolo 8/2: "I want them taller. I want them wider... remove all the parking lots... the main '
     'building biggest as fuck... fill up the square" -- measured on the baked sprites', False),
    ('NO CANOPIES',   ['python3', 'gates/no_canopies_gate.py'],
     'Paolo 8/2: "new rule no more canopies I only see canopies at parks and shit" -- a canopy is a '
     'park thing; spans (skybridge/deck/gantry/jet bridge) are not canopies; the debt only shrinks', False),
    ('ROUND + DOORS', ['python3', 'gates/round_and_doors_gate.py'],
     'Paolo 8/2: "every time you make a circular shape the roof looks like tarps" + "doors arent '
     'where theyre supposed to" -- both PIPELINE bugs, checked by measuring the geometry', False),
    ('LABEL PICTURES', ['python3', 'gates/label_every_picture_gate.py'],
     'Paolo 8/2: "you are showing me pictures, but I dont know which is which" -- every image '
     'carries its own NAME in the pixels, checked by READING the title band, not by trusting the draw call', False),
    ('ONE BUILDING',   ['node', 'gates/one_building_gate.js'],
     'ARTICULATION IS NOT FRAGMENTATION: a library/chapel/hall is ONE mass, a downtown block is MANY', False),
    ('LANDFILL',       ['node', 'gates/landfill_gate.js'],
     'dead landfill: waste cells, leachate ponds, scale, haul roads, dozer, fenced', False),
    ('RAILYARD',       ['node', 'gates/railyard_gate.js'],
     'dead railyard: classification tracks, rolling stock, engine shed, container gantry', False),
    ('SUBSTATION',     ['node', 'gates/substation_gate.js'],
     'dead substation: transformers, switchgear, busbars, control house, double-fenced', False),
    ('CHURCH',         ['node', 'gates/chapel_gate.js'],
     'dead church: cruciform building, bell tower, forecourt plaza, arcade, cross', False),
    ('COURTHOUSE',     ['node', 'gates/courthouse_gate.js'],
     'dead courthouse: columned building, dome, portico, grand steps, plaza, statue', False),
    ('CITY HALL',      ['node', 'gates/cityhall_gate.js'],
     'dead city hall: administrative block, clock tower, plaza, dry fountain, seal, kiosks', False),
    ('BATTERY',        ['node', 'gates/battery_gate.js'],
     'dead battery storage yard: fire-lane container rows, HVAC units, inverter rack, control building', False),
    ('TERMINAL',       ['node', 'gates/terminal_gate.js'],
     'dead transit terminal: waiting hall, bus bays under a boarding canopy, layover yard, park-and-ride', False),
    ('JAIL',           ['node', 'gates/jail_gate.js'],
     'dead jail: cell blocks, guard towers, razor-wire wall, rec yards, sally port', False),
    ('FARM',           ['node', 'gates/farm_gate.js'],
     'dead farm: crop fields dominate, red barn, silos, farmhouse, tractor, fenced', False),
    ('DOWNTOWN',       ['node', 'gates/downtown_gate.js'],
     'dead downtown: podium blocks + towers, street grid, roundabout plaza, skybridge', False),
    ('TRAILER PARK',   ['node', 'gates/trailer_gate.js'],
     'dead trailer park: staggered mobile-home rows, carports, sheds, some burned out', False),
    ('APARTMENT',      ['node', 'gates/apartment_gate.js'],
     'dead garden apartment complex: 3 building rows, breezeway stairs, carports, drained pool, clubhouse', False),
    ('WAREHOUSE',      ['node', 'gates/warehouse_gate.js'],
     'dead flex/light-industrial park: two rows of tenant units, dock doors, office bays, truck court', False),
    ('WATERPARK',      ['node', 'gates/waterpark_gate.js'],
     'dead water park: drained wave pool, lazy river loop, slide towers, splash pools, lockers', False),
    ('MALL',           ['node', 'gates/mall_gate.js'],
     'dead enclosed mall: dumbbell concourse + two anchors, food court, loading docks, drive ring', False),
    ('WALKABLE LAND',  ['node', 'gates/walkable_gate.js'],
     'no district is mostly parking/driveway: content dominates pavement (vehicular venues exempt)', False),
    ('LANDLOCKED',      ['node', 'gates/landlocked_gate.js'],
     'an interior district with no real street is suburb/apt and relays a road out through a same-family neighbor', False),
    ('GARAGE',         ['node', 'gates/garage_gate.js'],
     'parking garage interior: multi-deck, ramps, 3D reachable from the entrance', False),
    ('CRYPT',          ['node', 'gates/crypt_gate.js'],
     'mausoleum crypt interior: vault banks, altar, entrance, footprint-exact', False),
    ('TILE SPEC',      ['node', 'gates/tilespec_gate.js'],
     'every district legend is complete — no undocumented tile ships', False),
    ('WORLD MODEL',    ['node', 'gates/world_gate.js'],
     'one API addresses valley down to a room', False),
    ('TAN WALL',       ['node', 'gates/tan_gate.js'],
     '85/15 tan, independent of weathering', False),
    ('ITEM SCALE',     ['node', 'gates/scale_gate.js'],
     "848 flags resolve", False),
    ('LIGHT REGISTRY', ['node', 'gates/lightreg_gate.js'],
     'dark is the default, circuits decide', False),
    ('PATROL',         ['node', 'gates/patrol_gate.js'],
     'owners patrol what they light', False),
    ('SLICE V11',      ['node', 'gates/test_v11.js'],
     'occupancy, beat, world clock', False),
    ('MUSIC',          ['node', 'gates/music_gate.js'],
     'screech law, voices exist, fresh-batch variety', False),
    ('SFX FACTORY',    ['node', 'gates/sfx_gate.js'],
     "sound effects are a typed spec and a generator, not files: every duration on the "
     "16th-of-a-beat grid, nothing invented outside the spec table, the generator "
     "deterministic, one AudioContext (the studio's), and the bank EMPTY until Paolo "
     "thumbs one", False),
    ('SFX WIRED',      ['python3', 'gates/sfx_wired_gate.py'],
     "APPROVED-BUT-UNUSED IS A DEFECT, for sound: the bank holds only the 38 he "
     "thumbed UP on 7/30, nothing he killed, no door (he killed all ten), and "
     "WALKING IN THE REAL RUN actually requests one of his approved footsteps, "
     "chosen by the tile the game already knows", True),
    ('RUN BEAT',       ['python3', 'gates/run_beat_gate.py'],
     "the run is on the SONG'S clock, not its own hardcoded 500ms: the beat crosses "
     "the parent->run vocabulary, the door and the slide read the live tempo, the run "
     "locks to the studio while it plays and lets go when it stops, and a silent run "
     "behaves exactly as it did before", True),
    ('SFX RENDER',     ['python3', 'gates/sfx_render_gate.py'],
     'the 60 candidates measured AS AUDIO in a real browser: each one makes a sound, '
     'does not clip, goes silent on time (SCREECH LAW proved on the waveform), renders '
     'identically twice, sits in the judgeable loudness band, and has not drifted from '
     'its recorded fingerprint', True),
    ('SONG LOCK',      ['node', 'gates/song_lock_gate.js'],
     "Paolo's songs are byte-locked: no session edits a song quietly, ever", False),
    ('COMBAT POOL',    ['node', 'gates/combat_pool_gate.js'],
     'faction-tagged songs enter the combat pool with their voices', False),
    ('COMBAT LAB',     ['node', 'gates/combat_lab_gate.js'],
     'beat-tactics lab: dial-gated damage, occupancy, 120, verdict UI', False),
    ('COMBAT RUNS',    ['node', 'gates/combat_runs_smoke.js'],
     'IT PARSES IS NOT IT RUNS (Paolo 8/2, black screen + one red line): 620 string checks and a node --check were all green while every frame threw ReferenceError, because a temporal dead zone is valid syntax. This boots the real alpha, opens the real combat tab and drives real frames through cover -> AIM -> killshot -> freeze, failing on ANY pageerror or console error', False),
    ('FACE CANON',     ['node', 'gates/face_canon_gate.js'],
     'the 7/19 calibration is the floor: no stale save bulldozes it, every menu rebakes', False),
    ('COMBAT ANIM',    ['node', 'gates/combat_anim_gate.js'],
     'combat moves b13: crouch lived, rise/drop, gun-walk, swings, shove/topple read', False),
    ('HERO BEAT',      ['node', 'gates/herobeat_gate.js'],
     'per-song hero beat picker: MUSIC tab UI, the bus, combat resolves + shifts the dial clock', False),
    ('OPEN COAT',      ['node', 'gates/open_coat_gate.js'],
     'jackets/coats open in front, clothes show underneath', False),
    ('HOODIE',         ['node', 'gates/hood_gate.js'],
     'hood covers neck+carve, crew keeps its hole, back hood real', False),
    ('HEADWEAR',       ['node', 'gates/hat_gate.js'],
     'hats sit on the skull, never the eyes/body, directional', False),
    ('ACCESSORY',      ['node', 'gates/acc_gate.js'],
     'zone-locked: masks below the eyes, shades on them, gloves/belt/scarf', False),
    ('CLOTH STRUCT',   ['node', 'gates/structure_gate.js'],
     'structure-not-color: jacket/poncho/tall-boot/rolled/gear are real shapes', False),
    ('SHADING SEP',    ['node', 'gates/shading_separation_gate.js'],
     'shadows are a separate layer: no new cook bakes light into an asset, and the amount already baked only goes down', False),
    ('RIG IS LAW',     ['node', 'gates/rig_is_law_gate.js'],
     'the body the game draws IS the body in the rig tool, byte for byte, and no second copy exists anywhere', False),
    ('TALLER BREAKS',  ['node', 'gates/only_taller_breaks_gate.js'],
     'belly and arms stay lossless whole-row translations; the tall-body invention count stays pinned and recorded', False),
    ('REPLY CONTRACT', ['node', 'gates/reply_contract_gate.js'],
     'the ask and the TLDR are the last two things on his screen, and CLAUDE.md and the doctrine agree on that order', False),
    ('LIMB SEPARATION',['node', 'gates/limb_separation_gate.js'],
     'the limb separation line runs ON TOP of the clothing (under it the clothing erases it), legs included, and never invents a colour', False),
    ('RIG NO-DRIFT', ['python3', 'gates/rig_no_drift_gate.py'],
     'Paolo 7/31 "THE RIG IS LAW FOREVER NEVER TO BE DRIFTED FROM": his 5,246 painted pixels pinned by sha256 + per-facing counts, because he had to hand-fix ONE stray pixel nothing else would have caught', False),
    ('JUDGE SURFACE',['node', 'gates/judging_surface_gate.js'],
     'his 7/31 list: he can WEAR the 221 garments (asserted by pixel count -- the first wiring changed 0), auto-spin on, skeleton off, swing/knock gone, judge-all lists every clip', False),
    ('PERSON LOOK',   ['node', 'gates/personlook_gate.js'],
     'every person is a different person: id -> body dials + outfit, deterministic and order-proof, one rig only, never varies his skin tone, only ever wears what he approved', False),
    ('THE CROWD',     ['node', 'gates/crowd_gate.js'],
     'the population reaches the SCREEN: twelve citizens drawn through the real drawChar path, none blank, none identical (heads checked separately), deterministic pixel-for-pixel, and his own look handed back untouched', False),
    ('CRAFT LAW',     ['node', 'gates/craft_law_gate.js'],
     'Paolo 8/1 "remember all my feedback and put it into your own training data" -- I cannot, so the repo remembers instead: his seven craft rules and the process lessons pinned as law, with the code that implements each checkable clause asserted still in place', False),
    ('HAIR',          ['node', 'gates/hair_gate.js'],
     'Paolo 8/1 cook up as many hairstyles as you possibly can: 26 SHAPES not recolours (footprint-hashed, colour discarded), the face never covered, all 8 facings, fits the tallest and shortest citizen, and a thumbs board that exports .txt', False),
    ('FACING',        ['node', 'gates/facing_gate.js'],
     'Paolo 8/1 the back of my outfits are the exact same when Im facing south: 19 generators read curDir and only the CLOTHES preview ever set it, so every garment rendered front-facing everywhere. The composite now feeds the frame direction and hands it back', False),
    ('CLIP HEALTH',   ['node', 'gates/clip_health_gate.js'],
     'the net under the whole animation lane: all 102 clips x 8 facings x the ENGINE\'s own bucket count -- nothing throws, nothing renders an empty body, nothing has gone still. Samples FRAME_CACHE.buckets so a coarse probe cannot invent a regression (a 4-phase sweep reported brace and winded frozen; at 24 they show 20 and 16 distinct frames)', True),
    ('MOTION VISIBLE',['node', 'gates/motion_visible_gate.js'],
     'a clip whose name promises movement actually moves PIXELS: pray and winded rendered zero changed pixels while "animating" at 0.2px on a 56px sprite', False),
    ('RIG CHECK',      ['python3', 'gates/rig_check_gate.py'],
     'THE RIG IS LAW, finally gated: every rig-touching tool cites the joints/parts it built on and the citation is re-derived from the source, and no second anatomy can exist beside BAKED', False),
    ('ALPHA LOADS',    ['node', 'gates/alpha_loads_gate.js'],
     'the ONE alpha actually LOADS: zero page errors, BAKED/RIG_B64/COMBAT_B64 present and full size, no loose HTML in the script body — a merge ate all three on 7/30 and shipped a black screen', False),
    ('BACK LIMB',      ['node', 'gates/back_limb_gate.js'],
     'the back arm wears its own sleeve: same colours no shade, never invents fill, never undresses the near limb, arms only (not legs, not hands)', False),
    ('CLOTHES FOLLOW',['node', 'gates/clothes_follow_gate.js'],
     'a garment is fitted to the body the dials made: cloth tracks the flank BOTH ways, neutral stays byte-identical, and the init catch can never swallow its error again', False),
    ('NECK + HAIR',    ['node', 'gates/neck_tone_gate.js'],
     'the neck is its own skin TONE not a shadow and never tints a collar; his curtain-bob export ships byte for byte and a repaint can never become a retint', False),
    ('CHAR OUTLINE',   ['node', 'gates/character_outline_gate.js'],
     'the 1px black border wraps every facing: last pass, snapshot-based so it cannot grow on itself, colour only so occupancy still sees the true silhouette', False),
    ('FROZEN POSES',   ['node', 'gates/frozen_poses_gate.js'],
     'a clip is a small set of FROZEN poses and every frame of a hold is the same cache entry: zero morph is structural, and every proof clip must report 0', False),
    ('ARM HOLD',       ['node', 'gates/arm_hold_gate.js'],
     'the arms are drawn at held poses resolved with HYSTERESIS, never snapped without memory (five memoryless attempts all measured worse)', False),
    ('OWN CANVAS',     ['node', 'gates/own_canvas_gate.js'],
     'parts never share pixels: each is sampled alone then composited, and the record keeps every negative result', False),
    ('PARTS PAINTED',  ['node', 'gates/parts_are_painted_gate.js'],
     'every part is a complete painted thing on its own: torso whole under the arms, and no NEW renderer rule may derive a part from its neighbours', False),
    ('RENDER LIKE RIG', ['node', 'gates/render_like_the_rig_gate.js'],
     'the alpha carries no render pass his rig lacks: weld, forward-splat and far-arm darkening stay retired and the measured count only goes down', False),
    ('ANIM FABRICATION',['node', 'gates/anim_fabrication_gate.js'],
     'the animation renderer never draws pixels Paolo did not paint: the joint weld and hand sliver stay dead, the count only goes down', False),
    ('CHAR PREVIEW',   ['node', 'gates/charpreview_gate.js'],
     'the character box shuffles the real clip set (judge bodies through the animations, never an idle pose)', False),
    ('BODY VARIATION', ['node', 'gates/bodyvar_gate.js'],
     'ONE RIG + variation sliders: neutral is byte-identical canon, every dial clean and continuous, the two-rig fork stays dead', False),
    ('LIFE',           ['node', 'gates/life_gate.js'],
     'agents homed+scheduled on the world model, occupancy, day shape', False),
    ('DRESS',          ['node', 'gates/dress_gate.js'],
     'agents wear only the canon wardrobe, bank fresh, tables empty', False),
    ('ECONOMY',        ['node', 'gates/economy_gate.js'],
     'conservation, monotone scarcity pricing, grounded needs', False),
    ('POPULATION',     ['node', 'gates/population_gate.js'],
     'two-plane sim: census === bodies, offline plane agrees with online', False),
    ('MEMORY',         ['node', 'gates/memory_gate.js'],
     'witnesses: clarity decays, familiarity holds, missing-persons answerable', False),
    ('DEVIATION',      ['node', 'gates/deviation_gate.js'],
     'events bend a life, never break it: expiry required, cap held, re-convergence', False),
    ('WALK DEADLOCK',  ['node', 'gates/walk_deadlock_gate.js'],
     'nobody stands in the street all day: two people who want to swap cells used to freeze '
     'there forever (measured: 1,589 turns for a 173-step walk home), because the blocked '
     'branch replanned the same static BFS into the same body. They route AROUND now, in the '
     'engine AND in all four slices that inline it -- including the walked world Paolo plays', False),
    ('LOOP',           ['node', 'gates/bohemia_loop_gate.js'],
     'the nine islands boot into one driven engine: factions canon-wired, economy+spawner poured', False),
    ('CANON QUESTS',   ['node', 'gates/bohemia_canon_quests_gate.js'],
     'every canon .bq quest parses/round-trips/validates clean and plays to COMPLETE through the live loop', False),
    ('ROAD CELLS',     ['node', 'gates/roadcell_gate.js'],
     'the 3,386 road cells are real ground: every mask builds, drives through, walks across', False),
    ('AIRFIELD',       ['node', 'gates/airfield_gate.js'],
     'the airfields are built across their whole cluster: one runway, continuous, no bare cells', False),
    ('LANDMARKS',      ['node', 'gates/landmark_gate.js'],
     'the landmark set: a campus has a QUAD its buildings face, a speedway has a closed OVAL with stands on one side and the tunnel under it', False),
    ('ENCOUNTERS',     ['node', 'gates/encounter_gate.js'],
     "the approved act-1 director: 70/20/10 holds, storyteller not dice, rare is sacred, no global spawns, no background ticking", False),
    ('ONE MAP',        ['node', 'gates/one_map_gate.js'],
     "one valley, one source: the phone's map IS the city-builder map, and pins only read where quests really resolve", False),
    ('WORLD RESOLVE',  ['node', 'gates/world_resolve_gate.js'],
     "the world's systems subscribe to spent moments: nothing hardcoded, every table empty, faction beats default OFF", False),
    ('ICON',           ['node', 'gates/icon_gate.js'],
     'an icon ships with every build (Paolo 7/27): new work adds no debt, the debt only shrinks, and an icon is real art', False),
    ('TOOLS RUN',      ['python3', 'gates/tools_run_gate.py'],
     'the tools actually run: every tool and gate parses, and the hero bank is reproducible from its source (a syntax error shipped green on 7/28 because nothing ever ran the factory)', False),
    ('SQUINT',         ['python3', 'gates/squint_gate.py'],
     'EVERY DISTRICT IS ITS OWN LANDMARK (Paolo 7/28), measured: no two districts share a silhouette at map zoom; the twin list only shrinks', False),
    ('HUE',            ['python3', 'gates/hue_gate.py'],
     'the colour measurement is locked: no icon goes monochrome, the median holds, the best does not regress (measured 3 families vs Pocket City 2 at 12)', False),
    ('RAIL',           ['node', 'gates/rail_gate.js'],
     'the mainline is ONE line for the whole valley, under the freeways, with 17 real grade crossings', False),
    ('INTERCHANGE',    ['node', 'gates/interchange_gate.js'],
     'the stack is one object across all 16 cells: eight ramps, a deck on piers, no per-cell state', False),
    ('STREAMING',      ['node', 'gates/streaming_gate.js'],
     'the valley is walkable on a phone: bounded plot cache, warmed ahead, no hitch at a boundary', False),
    ('CROSSING',       ['node', 'gates/crossing_gate.js'],
     'the valley tile rung: a body walks district -> street -> district on real ground', False),
    ('TERRAIN',        ['node', 'gates/terrain_gate.js'],
     'desert, mountain and lake are real ground: one continuous field, no seams, rock walls with passes', False),
    ('QUEST PLACEMENT', ['node', 'gates/quest_placement_gate.js'],
     'quest placement candidates are real cells, anchored to the live cast, deterministic', False),
    ('QUEST STUDY',    ['node', 'gates/quest_study_gate.js'],
     'every canon quest CITES the questbook corpus it was built from, verbatim and machine-checked', False),
    ('CURRENT SLICE',  ['node', 'gates/current_slice_gate.js'],
     'the live phone (SLICE tab) never drifts from the real loop/world model — regen is a no-op', False),
    ('INTEGRATION',    ['node', 'gates/integration_gate.js'],
     'the run IS the game we built: every system claimed integrated is machine-probed in the shipped run, no unproven claims', False),
    ('DURABLE SAVE',   ['node', 'gates/durable_save_gate.js'],
     'the save survives a week off the game. iOS WebKit DELETES localStorage, IndexedDB and '
     'service worker registrations after SEVEN DAYS with no interaction -- every Bohemia save '
     'is in localStorage and sw.js (the ONE-LINK worker) is on the same list, so a player who '
     'stops for a week loses the save AND the link. Eviction skips origins granted persistence; '
     'we had never asked. MEASURED on the real alpha, not grepped: the request must really RUN '
     'at boot, never await, never throw, and touch no save code', False),
    ('REACHABILITY',   ['node', 'gates/reachability_gate.js'],
     'of everything we have BUILT, what reaches the surface he taps? 205 sources sampled by '
     'their own BYTES (not their names -- names are a lane dialect). SEVENTEEN finished things '
     "ship only into the file the alpha loads and never displays: Paolo's eleven approved "
     'perimeter walls, the interior pool, the one-button verb system, the quest runtime. The '
     'gate does not demand that number fall -- wiring order is his call -- it demands the '
     'census stay FRESH, keep its own false-negative caveat, and agree with what was verified '
     'by hand', False),
    ('SURFACE TRUTH',  ['node', 'gates/surface_truth_gate.js'],
     'a document that measures the game must say WHICH DOOR it is looking at. The integration '
     'ledger probes BOHEMIA_RUN_CURRENT.html; the RUN tab has shown the CITY frame since 7/28, '
     'so its greens are true about a file Paolo never sees. The mismatch is legal and is the RUN '
     "lane's call -- being quiet about it is not. Derives the shown surface from the alpha's own "
     'routing line, so it follows whoever re-points the tab', False),
    ('THE RUN',        ['node', 'gates/run_gate.js'],
     'the first connected run plays end to end in a real browser: house -> block -> S01 -> combat handoff -> home -> feed post, loud fork and quiet fork, inside the real alpha', False),
    ('BANKS USED',     ['node', 'gates/banks_used_gate.js'],
     'APPROVED-BUT-UNUSED IS A DEFECT: every approved bank the run loads must actually DRAW pixels, waivers named and ticketed', False),
    ('LOOP CHANNEL',   ['node', 'engine/bohemia_loop_channel_tests.js'],
     'feed vs in-person quest acquisition channels', False),
    ('LOOP CLOUT',     ['node', 'engine/bohemia_loop_clout_tests.js'],
     'reckless beats quiet (Paolo 7/21 LOCK), CLOUT weighting + tagging', False),
    ('LOOP ENTITIES',  ['node', 'engine/bohemia_loop_entities_tests.js'],
     'spawned actors + LOD district manager', False),
    ('LOOP FEED',      ['node', 'engine/bohemia_loop_feed_tests.js'],
     'TOTAL RECALL: every quest choice/outcome reaches the feed, no off-feed channel', False),
    ('LOOP LEDGER',    ['node', 'engine/bohemia_loop_ledger_tests.js'],
     'quest choices/outcomes flow into the save\'s choice-log', False),
    ('LOOP PROFILE',   ['node', 'engine/bohemia_loop_profile_tests.js'],
     'the social profile: followers/reach projection over the feed', False),
    ('LOOP QUESTS',    ['node', 'engine/bohemia_loop_quests_tests.js'],
     'ctx.quests is a first-class GameContext citizen, pullable + save-bridged', False),
    ('LOOP SLICE',     ['node', 'engine/bohemia_loop_slice_tests.js'],
     'occupancy, beat, world clock', False),
    ('LOOP TALK',      ['node', 'engine/bohemia_loop_talk_tests.js'],
     'the talk-trigger: talkablesNear/talkTo', False),
    ('LOOP BRIDGES',   ['node', 'engine/bohemia_loop_faction_bridge_tests.js'],
     'quest effects reach the real factions (pacing law held) + quests cast themselves into the real valley', False),
    ('CITY TAB',       ['node', 'gates/city_tab_gate.js'],
     'the CITY tab: embedded modules byte-locked to canon, skeleton-as-itself', False),
    ('CITY EDIT',      ['node', 'gates/cityedit_gate.js'],
     'city-builder verbs: skeleton sacred, demolish-to-desert, canon builds only', False),
    ('ZOOM BUILD',     ['python3', 'gates/zoombuild_gate.py'],
     'the builder IS a zoom of the one iso view: tap a plot, canon verbs, edits true at every zoom', False),
    ('RENDER PIXEL',   ['node', 'gates/render_pixel_gate.js'],
     'the render contract MEASURED on the real surface: no fractional upscaling, no half-pixel draws, nothing off its aspect', True),
    ('ZONE MAP',       ['node', 'gates/zone_map_gate.js'],
     "Paolo 7/29: the valley's population IS its food carrying capacity, and it lands as clusters AND no man's lands AND random spread - never a flat rate, and the emptiness is authored", False),
    ('CITY PEOPLE',    ['node', 'gates/city_people_gate.js'],
     'the walk surface had ZERO people in it: measured in a real browser on the real tab that a cluster shows people, a no man\'s land shows nobody, and nobody stands where the player cannot walk', True),
    ('PEOPLE',         ['node', 'gates/people_gate.js'],
     "the 28 scheduled bodies on the block are PEOPLE: identity DERIVED (so it survives the sim being thrown away on every save load), his named-cast and dialogue tables shipped EMPTY and kept that way, and the card he actually sees driven in a real browser", True),
    ('MASS EDIT',      ['node', 'gates/mass_edit_gate.js'],
     "Paolo 7/29's condition on the people: stable ids, one derivation point, an overrides layer - and a REAL bulk edit that provably reaches the cached surface, not a promise that it could", True),
    ('RUN PEOPLE',     ['node', 'gates/run_people_gate.js'],
     "HE PLAYS THE RUN: the surface Paolo actually taps has a day in it - the street fills, empties through the Mojave afternoon and refills, a bulk edit reaches bodies already walking, and the draw never paints somebody the sim put indoors", True),
    ('CITY CAST',      ['node', 'gates/city_cast_gate.js'],
     "Paolo 8/3: 'now we have character models just shuffle that character model every time the "
     "game looks and have it not be a copy of me'. Every resident WAS him -- the city drew PLAYER_CV "
     "with a hue shift over it. The alpha had been baking six real townsfolk for the run since 7/26 "
     "and the city never got them. This HASHES THE ACTUAL PIXELS of every baked body and of his, and "
     "requires all of them distinct AND not one of them his", True),
    ('CITY TALK',      ['node', 'gates/city_talk_gate.js'],
     "Paolo 8/2 asked for one NPC outside the spawn to test the mechanics on, then said 'I "
     "couldn't find them'. He was right: the RUN tab shows the CITY panel, #p-run is display:none, "
     "and every one of this lane's 152 claims was measured on that hidden page. Measured on HIS "
     "surface: 0 bodies drawn, nearest person 192 tiles away, zero ways to talk. This drives the "
     "ALPHA and taps the TAB: somebody stands by the spawn, you walk up, the one button names their "
     "trade, the card says YOU HAVE NOT ASKED, asking names them, the button calls them by it, the "
     "name is over their head, and it survives a reload", True),
    ('HUMAN START',    ['node', 'gates/human_start_gate.js'],
     "Paolo 8/2: 'when I press the run tab it just starts me off where I should start off ... I'd "
     "rather start off in human mode rather than city mode'. It opened in the zoomed-out city builder "
     "with the walked player at hx=0,hy=0, and BOHEMIA_GOTO_CELL flipped it straight back whenever the "
     "first fix tried. Driven on the ALPHA -- not the run file, which the alpha never shows -- so the "
     "RUN tab opens in HUMAN MODE, on foot, in the district we are working on, city still one tap away", True),
    ('THE ONE LINK',   ['node', 'gates/front_door_gate.js'],
     "THE ONE LINK OPENS THE GAME. On 8/2 one dropped </div> nested the whole app inside the front splash, so tapping the splash hid the game: 0x0, no tabs, a black screen on the only URL Paolo ever taps. The splash must close before the app opens, and the door is walked through in a real browser", True),
    ('STANDING',       ['node', 'gates/standing_gate.js'],
     "Paolo thumbed all 12 faction gaps WANT: this is gap 3, the documented failure of the whole genre - every NPC instantly knowing what you did with no route the news could take. Reputation now has to TRAVEL: a deed is WITNESSED not announced, an opinion is DERIVED from memories that decay (so redemption is free - gap 4), hearsay is weaker than eyesight and runs out of hops so a rumour cannot cross the valley, and a faction's view is just its members' views - no ledger, no faction named in the module, and zero-sum falls out for free (gap 7). DEED_WEIGHT ships EMPTY and the gate proves the module is inert until he rules", False),
    ('DEED BRIDGE',    ['node', 'gates/deed_bridge_gate.js'],
     "RECKLESS BEATS QUIET, FINALLY APPLIED TO REPUTATION. His quest corpus has always written down "
     "TWO things about an outcome - how big it was (@DO faction REDS +12) and how loud it was "
     "(#quiet/#notable/#risky/#reckless) - and the loud half only ever reached the vanity follower "
     "count. Faction standing moved godlike: valley-wide, instantly, with nobody having seen anything, "
     "so a back-yard handshake and a public humiliation were worth the same. Now the tag decides HOW FAR "
     "the news carries and HOW MANY TIMES it gets retold, on a square-root curve read off his own live "
     "CLOUT table (linear would put one loud act in front of 66 tiles of valley and news teleports again). "
     "Nothing invented: bohemia_standing.js still ships DEED_WEIGHT EMPTY, every row traces to a @DO line "
     "in a .bq file, no faction is named in the bridge, and the units conversion is DERIVED - the biggest "
     "act in the corpus, in front of a whole faction, moves exactly one rung. An untagged deed still "
     "reaches exactly SEE_RANGE and earns exactly MAX_HOPS, so nothing already in the world changed. "
     "Fifteen planted mistakes self-tested every run", False),
    ('PAYLOAD WALL',   ['python3', 'gates/payload_wall_gate.py'],
     "THE CLIFF NOBODY HAD MEASURED. GitHub REJECTS any file over 100 MB - not a warning, the push fails - and the alpha was 38.7 MB gaining ~1.4-2 MB/day, so every lane in the fleet would have lost the ability to push on an ordinary Tuesday about six weeks out, with no obvious cause. 96% of it was two inlined base64 blobs, and base64 costs 33% on top of what it carries. This measures every tracked file, projects the date off real git history, and fails at a budget well under the wall so somebody sees it with weeks of room", False),
    ('FACTION MEMBERSHIP', ['node', 'gates/faction_membership_gate.js'],
     "Paolo 8/2 'we need to make lots of progress': the 268 derived people stopped being wallpaper and BELONG to somebody. Nothing invented - which faction holds which ground is still his empty table; allegiance is derived from the bases the caller already seats, keyed to the SEAT so it survives a save load, most people belong to nobody, and the split across factions is COUNTED even (two earlier versions were 63% and 48% to one faction and both looked fine until measured). His 13 colours and 14 marks re-read out of the alpha's own faction table, byte for byte", False),
    ('FACTION DOSSIERS', ['python3', 'gates/faction_dossier_gate.py'],
     "Paolo 7/31: 'make all of them awesome and interesting.' One researched PROPOSAL dossier per faction, and the machine that keeps it honest: every selectable faction covered, the canon graph reproduced never re-argued, the six looks he already ruled carried verbatim instead of re-asked, approved wardrobe only, no purple, every proposed colour clearing the engine's own family tolerance, no dossier quietly giving Marco a faction (checked against the LIVE ruling, which moved the same day), and the frozen faction/quest machinery not grown by a single file. Seven planted mistakes self-tested every run", True),
    ('FENCE ORPHAN',   ['python3', 'gates/fence_orphan_gate.py'],
     "FLEET-WIDE, and it shipped on 8/2: a fence the patch tool stops emitting is NOT a fence that goes away - the text stays applied forever and nothing knows how to undo it. Every marker block in slices/ and engine/ is one some tool still knows how to remove, is a balanced pair, and is applied exactly once", True),
    ('ONE WORLD TAB',  ['node', 'gates/one_world_tab_gate.js'],
     "Paolo 8/2: one tab shows the world and it is RUN - no CITY tab, the routing that makes RUN show it survives, no gate navigates by the dead button, and the surface he plays is the CITY FRAME not the run slice", True),
    ('NO PRISON',      ['node', 'gates/no_prison_gate.js'],
     "Paolo 8/1, said from inside one: from anywhere a body can stand a real street is reachable ON FOOT - the doorstep touches a road, every district relays out, and the walk is proved in a real browser", True),
    ('GATED IS RICH',  ['node', 'gates/gated_is_rich_gate.js'],
     "Paolo's bank law, 7/14, unenforced until 8/1: most Vegas communities are WALLED but NOT gated - a wall is Clark County code, a gate is money, and every entrance still touches its street and reaches the whole plot", False),
    ('INVISIBLE SCHEDULE', ['node', 'gates/invisible_schedule_gate.js'],
     "Paolo 7/31: a routine is FELT, never READ, and a name is ASKED FOR, never given - the game prints nobody's timetable, present-tense eyesight stays legal, and no module manufactures a name", False),
    ('TILE FORM',      ['python3', 'gates/tileform_gate.py'],
     "the TILE REQUEST FORM law's own gate, which the law names and nobody had written: every form filled, its caption parseable and ingestable, its shopping check and anchor pointing at files that exist, and the board and the forms unable to drift apart", False),
    ('BANK LAW',       ['python3', 'gates/banklaw_gate.py'],
     "Paolo's rulings that live INSIDE banks, not /laws: indexed, current, and named — the class of miss that hit three times on 7/28", False),
    ('WALL CLASS',     ['node', 'gates/wallclass_gate.js'],
     'WALL TAXONOMY (Paolo 7/17) enforced in the DRAW: the suburb community wall stands 2 tiles from its OWN 13-key pool at its judged 44x44, never a building wall', True),
    ('NAV CLUSTER',    ['node', 'gates/navcluster_gate.js'],
     'Paolo 7/27: ONE movement UI everywhere - portrait dead centre, 8 cardinals ringed around it, controls float instead of carving a bar out of the screen', True),
    ('CMU BLOCK',      ['python3', 'gates/cmu_gate.py'],
     'TF-ART-001: the block-wall family that stops a jail, a warehouse and a family home being drawn in the same suburban stucco. Running bond (not stack), the bond dividing the corpus cell exactly, seamless laid 2x2, grey not warm, and act-1 floor/ceiling', False),
    ('HOUSE FACTORY',  ['python3', 'gates/house_factory_gate.py'],
     'Paolo 7/31 approved house 02 south, and approval unlocks volume - so the sixteen get the scrutiny the one got: two masses each, site-built pitch, every colour verified against his 30 approved skins, and 14+ DISTINCT MASSINGS so shape is doing the work and not a recolour', False),
    ('ISO HOUSE',      ['python3', 'gates/iso_house_gate.py'],
     'Paolo 7/29: "copy how other isometric pixel games make houses". The 2:1 diamond, two masses minimum, site-built pitch and eave, and - the check house 01 would have failed - EVERY colour machine-verified to exist in the 30 skins he approved, so a reuse check is checkable instead of a sentence', False),
    ('HOUSE SHAPE',    ['python3', 'gates/house_shape_gate.py'],
     'Paolo 7/29 killing house 01: "i need you to care about house shapes". The human scale gate was GREEN while that house was a trailer, because nothing in the machine had an opinion about shape. Two masses minimum, 4:12 pitch, 12 in eave, nothing over 3.5:1 - and it carries the two shapes he rejected as its own permanent negative test', False),
    ('HUMAN SCALE',    ['python3', 'gates/human_scale_gate.py'],
     'Paolo 7/29: "realistic to human sizing". The one invariant every one of the sixteen houses inherits - a person FITS THROUGH THE DOOR - plus the art agreeing with its own metre table and the engine\'s CELL_M', False),
    ('BOTTOM-LEFT',    ['python3', 'gates/bottomleft_gate.py'],
     'Paolo 7/29: "I dont want those button anymore" - BUFFET ON/PLACE/TILES are gone from '
     'the document (killed, not hidden) and the buffet flags pinned off, and whatever '
     'chrome is still in that corner is measured on a real 390px phone: on screen, not '
     'on top of each other, not under the steering ring, still visible', True),
    ('THREE-TILE WALL',['node', 'gates/wallheight_gate.js'],
     'Paolo 7/27: a wall carrying a door is 3 tiles tall, a door is 2 of them, and a wall covering the player goes see-through (and only then)', True),
    ('FRONT DOOR',     ['node', 'gates/frontdoor_gate.js'],
     'a door is a fact about the plot, not a dice roll: every front door on its own driveway, no painted doors that cannot open', True),
    ('TOUCH GUARD',    ['node', 'gates/touch_guard_gate.js'],
     'the phone cannot eat the controls: hold-to-walk never raises the iOS selection/copy menu, text fields keep paste', True),
    ('CANVAS SCALE',   ['node', 'gates/canvas_scale_gate.js'],
     'the LAST blit, the one the phone does: canvas box === backing store, walked world nearest, overview left smooth', True),
    ('INTERIORS',      ['node', 'gates/interiors_gate.js'],
     'walk into a building and you are IN it: interior === exterior footprint, one generator, the dossier decides', False),
    ('MAP TAB',        ['node', 'gates/map_tab_gate.js'],
     'the MAP tab: THE VALLEY AERIAL live + reachable, every generator module byte-locked to canon', False),
    ('HOUSE ART',      ['python3', 'gates/houseart_gate.py'],
     'house skins CANON (Paolo verdict 7/21): purity, tan 85/15, dead glass, married into the city', False),
    ('ASSET ROUNDUP',  ['python3', 'gates/assetroundup_gate.py'],
     'unjudged corpus surfaced for Paolo: purity pre-filter held, reproducible, hub-linked', False),
    ('DOOR ART',       ['python3', 'gates/doorart_gate.py'],
     'real doors in the live SLICE tab: canon door + warm-filtered trim, crisp scaling, purity', False),
    ('REUSE FIRST',    ['python3', 'gates/reusefirst_gate.py'],
     'every art-cooking tool documents a REUSE CHECK, claimed bank reuse must actually open the bank', False),
    ('LOGO',           ['python3', 'gates/logo_gate.py'],
     'Paolo 8/1: "10 unique vastly different logo ideas ... I don\'t wanna see the same '
     'font in the same style 10 different times". The cheap read of that brief is one '
     'wordmark under ten filters, so this checks the LETTERFORMS themselves differ, not '
     'the pictures - plus the bug that almost shipped, four of ten running off their own '
     'frame and losing letters', False),
    ('TEXTURE MATCH', ['python3', 'gates/texture_match_gate.py'],
     'Paolo 8/1: "make as much pixel art ... INSPIRED BY THE GRAPHIC ASSETS THAT I '
     'BOUGHT TRYING TO REPLICATE THE EXACT LOOK". Three house batches were rejected and '
     'every post-mortem blamed the SHAPES; measured, his art carries 2.5x the local '
     'contrast and 2.7x the grain at 60% of the saturation. His is ROUGH AND GREY, mine '
     'was SMOOTH AND TOO COLOURFUL. This gate is the ruler and the ruler is HIS OWN '
     'TILES, re-derived every run so it cannot drift - plus the two failures that almost '
     'shipped: PINK (desaturating at constant value turns clay into salmon) and MUSH '
     '(structure buried under the grain)', False),
    ('EXTERIOR POOL',  ['node', 'gates/exterior_pool_gate.js'],
     'MEASURED 8/5 with a probe validated against a bank the gates already prove ships: '
     'banks/BOHEMIA_HD_TILE_REPO_part1..4 is 8,674 tiles Paolo BOUGHT and ZERO of them had '
     'ever drawn a pixel -- and they were not unjudged, because his 7/13 Great Sweep ("THE '
     'act-1 art authority") gave 1,927 of them a thumbs UP. One lane harvested the 465 that '
     'go indoors, wired them into rooms, and stopped at the front door; nobody ever '
     'harvested the 812 that go OUTSIDE, so the whole valley had zero objects standing in '
     'it. THAT is why the world read empty, and it was never a texture problem. The blocker '
     'everyone assumed (96px masters, 44px cell) was imaginary: the law asks for an INTEGER '
     'SCALE, not a cell-sized tile. Holds UP-only against his own sweep, keeps hand-scale '
     'LOOT out of the scenery pool (the first cut put a car-sized glowing potion jar on a '
     'lawn -- his verdict was right, my reading of it was not), keeps his no-living-trees '
     'ruling, keeps props from ever blocking a cell, and walks out the front door to count '
     'objects that actually reached the canvas', False),
    ('ART TAB',        ['node', 'gates/art_tab_gate.js'],
     'Paolo 8/4: "can you put all the work in a different fucking tab like the life tab '
     '... u want me to hunt all your work down ... i shouldnt have to tell you that". He '
     'should not have had to. NAME THE TAB has been law since 7/28 -- "a thing he cannot '
     'reach does not exist to him" -- and the ART lane quoted that law and then handed him '
     'records/target/ file paths in the same turn. The law was written down and NOTHING IN '
     'THE MACHINE CARED, which is the 7/16 ruling exactly. Holds the door, the room, every '
     'picture in it, and the verdict controls (thumbs, note, one bottom comment box, SUN '
     'MODE, .txt never .json) -- plus the loader bug it exposed, where the alpha promoted '
     'data-src per-tab BY HAND so a newly added tab came up BLANK, which is worse than no '
     'tab. And it boots the alpha, dismisses the splash and taps ART the way his thumb '
     'does, because a tab that throws on open passes every source check ever written', False),
    ('LIGHT',          ['node', 'gates/light_gate.js'],
     'Paolo 8/3: "you\'re called the art direction chat and you\'re not doing a lot of art '
     'directing ... I can\'t even see it". Measured, he was right: the play area used 110 of '
     '255 values, 0.0% of its pixels were cool, and nothing in the world cast a shadow, so a '
     'week of texture work was going into a picture with no LIGHT in it. THE LOOK grades every '
     'world tile (one tone curve, then a split-tone keyed on the pixel\'s LUMINANCE toward a '
     'blue sky and a warm sun) and THE SUN gives every solid mass a cast shadow down-right, '
     'matching the upper-left key every cooked tile in this repo already has. It holds the '
     'three failures that already happened once: a per-CHANNEL split-tone that measured 0.0% '
     'cool before AND after (a multiply cannot move a hue - only a blend toward a colour can, '
     'the same lesson as the 8/2 perimeter cap), a cache keyed on src.length that would swap '
     'one 44px wall for another, and a sun pointing the wrong way. And it MEASURES on the real '
     'surface: it walks out the front door and reads the canvas with the light off and on', False),
    ('GRIME',          ['python3', 'gates/grime_gate.py'],
     'Paolo 8/3 loved Machine Party, and the research found the mechanism in Klubnika\'s '
     'own words: he "added dirty and grimy leaks to every corner, which BLENDS EVERYTHING '
     'TOGETHER rather than having different objects" -- the answer to the thing Paolo said '
     'himself on 7/31, two different games in one frame. The MACHINE is built: one '
     'continuous 8x8-cell sheet sampled by WORLD position, so a stain that starts on one '
     'cell carries onto the next (baking it into a 44px tile would repeat it at cell pitch, '
     'which IS the 8/2 bug). Half of what this gate protects is a DECISION NOT TO BUILD '
     'YET: he pushed back on tuning it now and he was right, because one district of '
     'twenty-seven is finished and a global look tuned against 4% of the world gets tuned '
     'twice. THE DIAL IS HELD AT ZERO until he rules on the amount -- a session that '
     'quietly raises it has surfaced unjudged art into the game he plays', False),
    ('PERIMETER',      ['python3', 'gates/perimeter_gate.py'],
     'the suburb border wall and the gate mouth, and the three bugs that were live and '
     'invisible in every contact sheet: WB4 (the one wall he kept out of 48) was stored '
     'as a 3x tiling PREVIEW and the renderer crushed the whole 792x264 sheet into one '
     '44px cell; a two-cell-thick wall drew a coping on BOTH rows, stacking two walls; '
     'and isSuburbCell() only accepted the district literally named "suburb" while '
     'suburb, gated and estate are three names sharing ONE generator - so every gated '
     'community rendered with none of the block art and the gate mouth could never draw '
     'anywhere at all. Holds the anatomy too: the cap is the sky-lit lightest band (45 '
     'DEGREE ART LAW), it oversails and casts, the pillar is proud AND casting, and the '
     'seam is tested against the tile that ACTUALLY follows it. Plus the two he caught '
     'himself on 8/2: one face tile per design stamped its single crack on EVERY cell '
     'at 44px pitch ("looks like it is glitching out"), and drawing the same gate piece '
     'on both courses of a two-cell-thick wall put a COURSE OF BRICK through the middle '
     'of the opening ("why is there a middle brick part of it")', False),
    ('BOUGHT-FIRST (COOKS)', ['python3', 'gates/bought_first_gate.py'],
     'REUSE FIRST was green while I cooked a concrete block wall he had already BOUGHT: the '
     'shopping check walked the APPROVED-ASSET index (what he has judged) and never the '
     'PURCHASED library (what he paid for). Two shelves, one looked at. This makes the cook '
     'tools name the purchased library, or say in writing why nothing bought applies', False),
    ('TASTE',          ['python3', 'gates/taste_gate.py'],
     'the Paolo taste canon: every NEVER cites a source, factories document a TASTE CHECK, the pre-judge kill-filter works', False),
    ('QUESTBOOK',      ['python3', 'gates/questbook_gate.py'],
     'v2 files are implementable, numbers audited', False),
    ('ART 45',         ['python3', 'gates/art_45_gate.py'],
     'original art is three-quarter view, never flat', False),
    ('TARGET MATCH',   ['python3', 'gates/target_match_gate.py'],
     'the VISUAL CONSTITUTION: the CBB target stays frozen, and every registered art bank '
     'obeys its palette / value bands / outline / dither / light / seam contracts', False),
    ('TARGET SCREEN',  ['python3', 'gates/target_screen_gate.py'],
     'the target screens exist, are built from approved banks, hold 2-tile doors + human '
     'scale, carry no black keyline, are judgeable from the alpha, and quest asks stay frozen',
     False),
    ('NAME THE TAB',   ['python3', 'gates/name_the_tab_gate.py'],
     'Paolo 7/28: every reply names the TAB a thing is in — and a judging surface no tab '
     'links to fails the build, because you cannot name a tab for a thing not in one', False),
    ('PIXEL BIBLE',    ['python3', 'gates/pixel_bible_gate.py'],
     'the ART lane\'s master document cannot drift: all 32 laws still in it, the three '
     'honesty clauses intact, the ten-failure record un-rewritten, and the ignorance list '
     'shrinking only by CLOSING entries, never by deleting them', False),
    ('PIXEL CRAFT',    ['python3', 'gates/pixel_craft_gate.py'],
     'the pixel craft laws (7/27): orphan pixels, single-use colours, one pixel size, '
     'pillow shading, one light direction, cluster density — built like pixel art, never '
     'a judgement of whether it looks good', False),
    ('CANVAS MEMORY',  ['python3', 'gates/canvas_memory_gate.py'],
     'section 8 of the mobile render contract, measured: the shipped surfaces stay under '
     'the resident/pixel ratchets and walking the valley does not grow the picture', False),
    ('HERO WIRE',      ['node', 'gates/hero_wire_gate.js'],
     'approved district heroes drawn on their city tiles (cityhall/battery/terminal), no flat-block regression', False),
    ('VEHICLE SIZE',   ['python3', 'gates/vehicle_size_gate.py'],
     'one canon car/bus/trailer size across every hero, via the shared _vehicle helper', False),
    ('HERO DOSSIER',   ['python3', 'gates/hero_dossier_gate.py'],
     'DOSSIER-OR-DON\'T: every hero building has all its parts written up, keyed to the walkable landmarks', False),
    ('CAMP DIAL',      ['node', 'gates/camp_dial_gate.js'],
     'his mobile-camp ruling, machine-locked: tiles not seconds, one pool, small numbers, every unruled value a dial', False),
    ('TRAUMATIC', ['node', 'gates/traumatic_gate.js'],
     "Paolo 7/31 on Crisis Response: 'it doesnt have to be gory but I do want it to be traumatic fr' -- traumatic and gory are two different dials, a hurt body is a CLOCK not a corpse, and gore is never the MECHANISM (swept: no damage scaled by gore, no score keyed to kills)", False),
    ('EARNED NOT AFFORDED', ['node', 'gates/earned_not_afforded_gate.js'],
     'Paolo 7/31 named Pocket City 2 on top of the stack, and reading the 7/1 city-builder law found it CONTRADICTING his 7/31 no-economy law: newest wins, upkeep/income/bankruptcy are dead, and buildings are EARNED not AFFORDED - swept so no surface implements the dead mechanic', False),
    ('ANSWERED', ['python3', 'gates/answered_gate.py'],
     "Paolo 7/31: 'IVE ANSWERED THIS LIKE 50 TIMESS' -- no session may ask him a question canon has already ruled; sweeps the handoff, the backlog and records/ for question-shaped text against the settled-questions index", False),
    ('TEN YEARS COLD', ['node', 'gates/ten_years_cold_gate.js'],
     'Paolo 7/31: the crash is BACKSTORY (act 1 opens ten years after), NO economic gameplay as a category, and the utility is already dead everywhere - swept across every shipped surface, because a banned CATEGORY needs a sweep and not a paragraph', False),
    ('ACTION COST SHAPE', ['node', 'gates/action_cost_shape_gate.js'],
     'Paolo 7/31 approved the SHAPE of the action clock, not the numbers: fixed cost, condition as the divisor, a hard floor, thresholds not slopes - and no lane has started building the table he reserved', False),
    ('NO MARKERS', ['node', 'gates/nomarkers_gate.js'],
     'TWICE IN ONE DAY (8/3) a session committed git CONFLICT MARKERS into '
     '00_START_HERE_NEXT_SESSION.md, the one file every session must read first -- once by me, '
     'once by the PEOPLE lane in 105a6b5, mangling 162 lines of the COMBAT lane with it. The '
     'handoff is shared infrastructure with no owning lane, so no lane gate was ever going to '
     'check it. Sweeps every tracked text file for markers, and asserts a repair kept BOTH '
     "lanes' sections -- a resolution that deletes the other lane is not a resolution", False),
    ('CANON CONSTANTS', ['node', 'gates/canon_constants_gate.js'],
     'the fourteen locked numbers nine parallel lanes all build on -- valley grid, beat, BPM, the lit 12 percent, three currencies, three generations -- given ONE declared home, with every value PROVED present in the law it cites so the registry can never drift from canon in either direction. Also records the negative finding that a prose-level numeric contradiction sweep CANNOT work (subject-blind: Skyrim 37 km2 reads as our 37 km2 built), so no session wastes a day rebuilding it', False),
    ('CANON ROT', ['node', 'gates/canon_rot_gate.js'],
     'nine sessions write canon in parallel across 583 law/record files that cite each other constantly, and NOTHING had ever checked those citations resolve -- a law pointing at a file that does not exist is worse than no citation, because a session follows it, finds nothing, and concludes the thing was never built. Hard-fails extension drift, ratchets pre-existing debt so no lane is blocked by another lane, and SELF-TESTS its own regex first because the first run of this audit was wrong in exactly that way', False),
    ('RULINGS', ['node', 'gates/rulings_gate.js'],
     "the thirty rulings he gave answering the 8/1 question round, finally written down: one universal clock, rest is a VISIBLE fast-forward, fast travel gated on having walked it, checks are BINARY (no save scumming), the mercy ledger is SILENT, stories spread like a plague, gear at the family house carries -- plus the two structural bans swept on every shipped surface", False),
    ('NO PAINT', ['node', 'gates/no_paint_gate.js'],
     "Paolo 8/3 named Machine Party and said 'I really want my game to look more like that very good' -- so it is a NAMED VISUAL REFERENCE with a written brief: no paint on any object, ONE grime pass over everything, dark as the default, stepped animation - and naming a reference is NOT permission to cook, so the sweep hunts derivative work off the law while the freeze is on", False),
    ('LAB PORT',       ['node', 'gates/resolve_gate.js'],
     'resolve/ration/ceiling/reach: mechanism only, no content, no coupling', False),
    ('REFERENCE LAB',  ['node', 'gates/lab_gate.js'],
     'emulations are 3+ MECHANICS whose loops close, sourced and measured', False),
    ('LEAF PIXEL',     ['python3', 'gates/bohemia_leaf_gate.py', '--strict'],
     'structure frozen in every clip', True),
    ('PURITY',         ['python3', 'gates/bohemia_purity_gate.py'],
     'purple is the Amalgamation alone', True),
]

def run(argv):
    try:
        p = subprocess.run(argv, capture_output=True, text=True, timeout=1800)
        return p.returncode, (p.stdout or '') + (p.stderr or '')
    except FileNotFoundError:
        return 127, 'gate file missing: ' + argv[-1]
    except subprocess.TimeoutExpired:
        return 124, 'timed out'

def summarize(name, out):
    """One line that says what actually happened, not just pass/fail."""
    for line in out.split('\n'):
        l = line.strip()
        if 'ENGINE SYNC LAW HOLDS' in l or 'VIOLATED' in l: return l
        if l.startswith('=== ') and ('passed' in l or 'FAIL' in l): return l.strip('= ')
        if 'pass /' in l: return l
        if 'LIVE REFERENCES' in l: return l
        if 'clips checked' in l: return l
        if 'images checked' in l: return l
    return out.strip().split('\n')[-1][:70] if out.strip() else ''

def deps_check():
    """SAY IT BEFORE THE RUN, NOT AFTER (7/29/26). Eight gates read pixels and
    need Pillow + numpy. On a fresh container they are absent, and all eight
    report ModuleNotFoundError at the END of a 700-second run — which reads like
    eight real failures and costs a whole re-run to diagnose. It is one pip
    install. This changes nothing about pass/fail: a gate that cannot run STILL
    FAILS, because a gate that cannot run has not held anything."""
    missing = []
    for mod, pkg in (('PIL', 'Pillow'), ('numpy', 'numpy')):
        try:
            __import__(mod)
        except ImportError:
            missing.append(pkg)
    if missing:
        print('!' * 78)
        print('  MISSING IMAGE STACK: %s' % ', '.join(missing))
        pix = [g[0] for g in GATES if g[1][0] == 'python3' and any(
            k in g[0] for k in ('HOUSE ART', 'ASSET', 'DOOR ART', 'ART 45', 'TARGET',
                                'LEAF', 'PURITY', 'HUMAN SCALE'))]
        print('  these WILL FAIL for this reason alone: ' + ', '.join(pix))
        print('  Fix it now, before the run:   pip install -r gates/requirements.txt')
        print('!' * 78)


LOCK = os.path.join(REPO_ROOT, '.bohemia_gates.lock')


def _alive(pid):
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False


def take_lock():
    """ONE SUITE AT A TIME (7/30). Two suites at once is not slow, it is WRONG.

    Found the hard way: two overlapping runs on the same tree reported
    'ALL GATES GREEN' and '10 GATE(S) FAILED' within minutes of each other, and
    a ship went out on the green one. The browser gates drive real Chromium and
    rebuild slices IN PLACE (run_gate regenerates the run, current_slice_gate
    regenerates the slice), so a second suite reads half-written files and
    starves the first of CPU. Both verdicts become worthless and you cannot tell
    which. A gate suite whose answer depends on what else is running is not a
    gate suite.

    Stale locks self-clear: the pid is checked, not just the file's existence,
    so a killed run never wedges the repo.
    """
    if os.path.exists(LOCK):
        try:
            pid = int(open(LOCK).read().strip() or 0)
        except (ValueError, OSError):
            pid = 0
        if pid and pid != os.getpid() and _alive(pid):
            print('=' * 78)
            print('  REFUSING TO RUN: gate suite pid %d is already going.' % pid)
            print('  Two suites on one tree corrupt each other\'s verdict: they')
            print('  rebuild the same slices and fight over the same browser.')
            print('  Wait for it, or kill it, then run again.')
            print('=' * 78)
            return False
        os.unlink(LOCK)          # stale: the owner is gone
    with open(LOCK, 'w') as f:
        f.write(str(os.getpid()))
    return True


def drop_lock():
    try:
        if os.path.exists(LOCK) and open(LOCK).read().strip() == str(os.getpid()):
            os.unlink(LOCK)
    except OSError:
        pass


def main():
    fast = '--fast' in sys.argv
    strict = '--strict' in sys.argv
    if not take_lock():
        return 1
    try:
        return _run_all(fast, strict)
    finally:
        drop_lock()


def _run_all(fast, strict):
    print('=' * 78)
    print('BOHEMIA GATES')
    print('=' * 78)
    deps_check()
    failed = []
    t0 = time.time()
    for name, argv, what, slow in GATES:
        if fast and slow:
            print('  %-15s SKIP     %s' % (name, what))
            continue
        t = time.time()
        rc, out = run(argv)
        ok = (rc == 0)
        if not ok:
            failed.append(name)
        print('  %-15s %-8s %-38s %5.1fs' % (name, 'GREEN' if ok else 'FAIL', what, time.time() - t))
        s = summarize(name, out)
        if s:
            print('                   %s' % s[:88])
        if not ok:
            for line in out.split('\n'):
                if 'FAIL' in line or 'VIOLAT' in line or 'Error' in line:
                    print('                   > %s' % line.strip()[:88])
    print('=' * 78)
    if failed:
        print('  %d GATE(S) FAILED: %s   (%.0fs)' % (len(failed), ', '.join(failed), time.time() - t0))
    else:
        print('  ALL GATES GREEN   (%.0fs)' % (time.time() - t0))
    return 1 if (failed and strict) else 0

if __name__ == '__main__':
    sys.exit(main())
