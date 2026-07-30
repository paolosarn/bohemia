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
    ('DISTRICT REG',   ['node', 'gates/district_registry_gate.js'],
     'every district type is catalogued', False),
    ('FLOORPLAN',      ['node', 'gates/floorplan_gate.js'],
     'every room reachable, buildings enterable', False),
    ('SUBURB MODULAR', ['node', 'gates/suburb_modular_gate.js'],
     'suburbs snap into 1x2 / 2x2, connected', False),
    ('SUBURB STREET',  ['node', 'gates/suburb_street_gate.js'],
     'Paolo 7/31: a ONE-GRID sidewalk on every street frontage and driveways exactly 2 wide', False),
    ('COMMERCIAL',     ['node', 'gates/commercial_gate.js'],
     'corner plaza: stores + parking connected to the streets', False),
    ('DISTRICT KIT',   ['node', 'gates/district_kit_gate.js'],
     'the factory: shared machine every district extends', False),
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
     'dead library: columned building, reading courtyard, colonnade+steps, piazza, fountain', False),
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
    ('MASS EDIT',      ['node', 'gates/mass_edit_gate.js'],
     "Paolo 7/29's condition on the people: stable ids, one derivation point, an overrides layer - and a REAL bulk edit that provably reaches the cached surface, not a promise that it could", True),
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
