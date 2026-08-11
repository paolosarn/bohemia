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
    # 8/4: the gate that asks the only question he cares about -- CAN I HEAR IT?
    ('MUSIC REACH',    ['node', 'gates/music_reach_gate.js'],
     'every category he tagged has something that can actually play it', False),
    ('SETUP HOOK',     ['python3', 'gates/setup_hook_gate.py'],
     'a fresh container installs its own gate image stack and never blocks the session doing it', False),
    ('SHIPPED TRUTH', ['node', 'gates/shipped_truth_gate.js'],
     'THE CODE MOVED AND NOTHING NOTICED, four times in one week -- the renderer left the alpha and 15 gates went silently blind, a rebase against a rewound checkout ate a feature, the working tree rolled back three times, and a session planned to re-land work that already shipped. This asks the one question none of them asked: is the work we SAY we shipped still in the file he actually taps', False),
    ('ART REQUEST',   ['node', 'gates/art_request_gate.js'],
     'Paolo 8/6: "you need to make tile request forms... we already have a chat that handles the art". A lane that needs art FILES A REQUEST and keeps working; the ART lane cooks. A request closes ONLY when its marker is measurably in the surface he plays -- because the cook-to-shipped handoff has failed seven times in one month, every time with the art approved and sitting in banks/', False),
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
    ('COLD BOOT',      ['node', 'gates/cold_boot_gate.js'],
     'TWO regressions no gate could see. (1) A render-blocking <link> to fonts.googleapis.com '
     'sat on a connection timeout: the city took 16.0s to become playable with the host '
     'unreachable and 3.1s with requests failing fast -- thirteen seconds of dead socket, not '
     'world. Paolo demos on a phone, and a phone on cellular or a captive portal IS the '
     'unreachable case, so the city is booted here WITH THE NETWORK DEAD. (2) The shared frame '
     'predicate still matched bare /srcdoc/ from before the city moved out of the alpha, and '
     'find() takes the FIRST match -- so a dozen browser gates ran their whole measurement '
     'inside somebody else\'s EMPTY srcdoc frame and crashed on "om is not defined", three of '
     'them red on main for over a week. The ordering is pinned here because what broke was a '
     'SHARED RESOLVER and nothing owned it', True),
    ('ONE ZOOM',       ['node', 'gates/onezoom_gate.js'],
     'Paolo 8/12: "you could keep zooming out and zooming out until it showed the moon you '
     'know. that was my original philosophy and i want to stick with that thats my flavor". '
     'The 7/25 law LOCKED that continuum in his words and shipped two of its three bands; its '
     'last line parked the third and nothing was blocking it but a note, for eighteen days. '
     'And it is the SPINE: 7/19 says the camera levels ARE street/city/planetary and Act 3 '
     'ends "looking down at the planet". What stood in the way was one line -- setZoomAt '
     'clamped at zmin, a wall that made the valley the whole world. Now the chain runs '
     'human -> city -> REGION -> PLANET -> MOON and all the way back to his feet, every band '
     'paints, the pixels DIFFER band to band (a state machine that renders the same frame is '
     'not a zoom), the REGION band still uses the city\'s own iso so the diamond never breaks, '
     'and the phone\'s GO moves the camera WITHOUT moving his body', True),
    ('HOME + PHONE',   ['node', 'gates/home_phone_gate.js'],
     'Paolo 8/11: "how was this a run when my house isn\'t labeled and the Phone app that we '
     'worked so hard for isn\'t even implemented yet". Both were THE WORK EXISTS AND IS NOT IN '
     'THE SURFACE HE TAPS: the phone was FINISHED (1.6 MB -- Network feed with DMs, the ONE MAP '
     'over the real generated valley, Wallet, Profile) and parked behind the alpha\'s SLICE tab, '
     'a developer tab, while the day loop woke him nowhere in a valley where nothing was his. '
     'Now HOME is a real house he wakes at with the word drawn over it, and the PHONE button in '
     'the run opens THE REAL SLICE and is told where he is, what day it is and what the job is. '
     'Driven by TAPPING THE BUTTONS in a real browser -- calling swapMode() from a harness '
     'measures a half-executed page, because the city has two pre-existing temporal-dead-zone '
     'faults on that path', True),
    ('DAY LOOP',       ['node', 'gates/dayloop_gate.js'],
     'Paolo\'s demo row: "close the game day loop end to end (hardcode the demo quests, '
     'scaffolding is legal)". The city had a TIMER, not a day: minutes accumulated, rolled '
     'past midnight, and nothing in the world knew a day had happened -- while a finished .bq '
     'parser, quest runtime and 21 canon quests sat in engine/ and in NEITHER file the player '
     'loads. Now: wake 06:00, sixteen hours, NIGHTFALL 22:00, a reckoning, day+1 carrying '
     'everything. Every resolution button is the destination stage\'s own @LOG line VERBATIM '
     '(the gate diffs each one against quests/bq/*.bq), nightfall on an unresolved quest fires '
     'THE QUEST AUTHOR\'S OWN FAIL STAGE, and the STAKES table is EMPTY because what a day costs '
     'to live is Paolo\'s ruling. Played wake-to-nightfall-to-next-wake in a real browser, and '
     'again through the alpha\'s RUN tab where he actually stands', True),
    ('SAVE IPHONE',    ['node', 'gates/save_iphone_gate.js'],
     'Paolo\'s demo row: "make the save iPhone-proof". CITYSAVE v1 had a ONE-BYTE probe '
     '(so it reported "disk" and then lost every autosave to memory in silence), ONE slot '
     '(so the write that fails destroys the only copy), no integrity check (so a torn save '
     'read as no save and the game quietly started over), and a stale-save TIME MACHINE '
     'under a comment promising there was none. Driven against a hostile fake browser -- '
     'full device, silent write, torn write, refused delete, ITP eviction, no localStorage '
     'at all -- and then driven again on the real alpha in a real browser', True),
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
    ('BROWNOUT',      ['node', 'gates/brownout_gate.js'],
     "GDD v3 LOCKED, act-1 power instability, routed off the 8/4 mechanics ledger where it sat in "
     "nobody's queue. The grid had no TIME axis: a valley whose lit 12% never flickers is one where "
     "LIGHT=TERRITORY never has a bad night. Every number is HIS -- unruled means it runs, changes "
     "NOTHING and says NO_RULING by name -- and an outage can only ever take light away", False),
    ('VOTE TAB',      ['node', 'gates/vote_tab_gate.js'],
     'Paolo 8/7: "are u gonna have me hunt for the changes or ur gonna put them in a voting tab" -- '
     'five turns running I told him to go find new icons in the CITY tab, which is a map, not a '
     'judging surface. VOTE is tab #1, opens on what has no verdict, thumbs + comments + SUN + .txt, '
     'and the queue is derived from DECLARED @VERDICT lines rather than parsed out of his prose',
     False),
    ('INTERIOR LEVELS',['node', 'gates/interior_levels_gate.js'],
     'three interiors disagreed about the word "levels" -- an ARRAY in the floorplan, a COUNT in the '
     'garage, absent in the crypt -- and neither mistake throws, so a walker would have read undefined '
     'in silence. One reader now answers for all three, and this WALKS every storey of each through it',
     False),
    ('VERTICALITY',   ['node', 'gates/verticality_gate.js'],
     "Paolo's direction is 2-3 storey buildings with climbable stairs. story:2 was computed by the "
     "suburb generator, carried all the way down the world model, and DIED at the floorplan -- every "
     "two-storey house had ONE floor inside it. This WALKS it: in off the street, to the stair, up, "
     "and every room on every floor reachable", False),
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
    # BEFORE THE DEAD ON PURPOSE (8/11): it is the gate that tells you whether
    # any of the gates below are looking at the shipped page at all. THE DEAD
    # was 48/0 green for a whole round while the app carried a build-old copy
    # of engine/bohemia_dead.js, because every tools/*_patch.py is one-shot and
    # no-ops forever after its first run. A gate on a file nobody ships is a
    # gate on nothing.
    ('INLINED FRESH',  ['node', 'gates/inlined_fresh_gate.js'],
     'the app carries ~43 engine modules INLINED, and a copy goes stale without a word: '
     'every inlined body must still be its engine canon byte for byte. The one-shot patch '
     'tools cannot catch this and dead_gate/vista_gate stayed green through it -- a FALSE '
     'GREEN, which this repo ranks worse than a false red. Fix: '
     'python3 tools/bohemia_city_module_resync.py', False),
    # Paolo 8/11: "make sure any bones or skulls are always the same size as our
    # humans". One draw height served all 62 judged tiles, so a lone skull and a
    # whole skeleton both came out 1.75 m. He caught it by eye off a picture.
    ('BONE SCALE',     ['node', 'gates/bone_scale_gate.js'],
     'nothing human out-measures the human: every dead tile is drawn the size the thing it '
     'depicts actually is (a skull 0.20 m, a femur 0.45 m, a laid-out adult 1.70 m, against a '
     'measured 1.74 m man), one ruler shared by the renderer/sheet/gate, and the reference '
     'picture with a person beside every bone exists', False),
    ('THE DEAD',       ['node', 'gates/dead_gate.js'],
     'Paolo 7/31 LOCKED (laws/BOHEMIA_ADDENDUM_LORE_SITTING_7_31_26.md sec 2), commissioned 8/8: '
     'skeletons in the open, husks in the sealed places, realistic mix, story-via-placement. '
     'Real forensics -- scavengers strip and scatter outdoors, dry heat mummifies behind a shut door -- '
     'plus the valley holding what the death math says, and not one body carrying a gore field', False),
    ('LOOK',           ['node', 'gates/look_gate.js'],
     "Paolo 8/8 LOCKED: 'just give me pictures and put it in a tab'. Every new thing is "
     "PHOTOGRAPHED off the real screen and shown in the LOOK tab, captioned, naming its own tab -- "
     "because a feature he has to walk 84.9 km2 to find is a feature he never judges", False),
    ('VISTA',          ['node', 'gates/vista_gate.js'],
     "DEMO ROW 11, the money shot: the mountain overlook where you see the whole valley. "
     "The overlook is DERIVED from the seed's own rim (MAP LAW), the camera LOOKS ACROSS the "
     "basin instead of hovering over the ledge, and it stays a CAMERA MOVE -- the plan's own "
     "rule is 'not a new renderer', so a bespoke draw loop in the vista block fails here", False),
    ('NO SHOTS IN REPO',['node', 'gates/no_shots_in_repo_gate.js'],
     "a lane flagged it 8/7 and fixed its own tool while two gates kept doing it: every suite "
     "run rewrote ~500 KB of screenshot inside slices/ and records/target/, so whichever lane "
     "was shipping came back to a dirty tree and either committed a picture nobody authored or "
     "hand-discarded it. Neither shot is read, asserted on, or loaded by a page -- they are "
     "proof pictures, which is what a temp dir is for", False),
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
    ('VOICE SURFACES',  ['python3', 'gates/every_voice_surface_gate.py'],
     "Paolo 8/11: \"I disnt hear any voices when I talked to marisela\". The voices "
     "were wired to ONE of the game's TWO talk surfaces and the gate that passed "
     "called renderTalk directly instead of pressing the button. This walks up to "
     "somebody and PRESSES WHAT HE PRESSES on every surface, and FAILS ON "
     "DISCOVERY so a third one cannot be added silently", True),
    ('SQUIGGLE VOICE', ['python3', 'gates/voice_gate.py'],
     "Paolo's demo top priority: Animal-Crossing-lineage gibberish speech with "
     "ZERO audio files, so it is FORMANT synthesis (Peterson & Barney vowels) and "
     "the character knob is the vocal tract, not pitch. Seeded so a person sounds "
     "like themselves forever; voiced and unvoiced alternate or it is a tune, not "
     "speech; pitch declines across a statement and rises at a question", True),
    ('FRESH DOORS',    ['python3', 'gates/doors_fresh_gate.py'],
     "he killed all ten doors on 7/30 (metal 3-12, wood 0-5) and named DOORS in "
     "the demo set on 8/9. GRAVEYARD IS FINAL binds Claude, not Paolo -- so the "
     "replacement is a FRESH cook from ash and stone, brighter/shorter/harder "
     "than every door that died, new ids, and nothing banked until he thumbs", True),
    ('SFX ENVELOPE',   ['python3', 'gates/sfx_envelope_gate.py'],
     "Paolo 8/11: \"we may need way more voices and way more sounds for the whole "
     "game\". 28 moments became 54, and the 26 new ones were built out of a "
     "measurement of his 140 thumbs instead of taste: material IS the verdict "
     "(glass 100%, metal 20%, wood 33%, water 20%) and he kills sounds that are "
     "PUSHED (approved makeup gain 0.92 vs rejected 1.28). The gate RE-DERIVES "
     "that from his verdict files every run, so his thumbs stay upstream of it", True),
    ('TIME PASS',      ['python3', 'gates/time_pass_gate.py'],
     "Paolo 8/7 on his own verdict export: \"For hours go by have it the amount of "
     "time that goes by\". NOTES ARE RULINGS, so the count IS the spec: four hours "
     "strike four times, nine strike nine, capped at twelve, a beat apart on the "
     "audio clock, and walking around never triggers it", True),
    ('CITYMUS ROTATION',['python3', 'gates/citymus_rotation_gate.py'],
     "his DUSK/DAWN pool is TWO songs and pick() drew with no memory, so dawn was "
     "a coin flip on playing the same track twice in a row; and a phase change "
     "waited out a 64-bar pass, so the clock was inaudible for up to 128s. ZERO "
     "repeats in 200 picks, and the turn lands on an 8-bar phrase line", True),
    ('SFX SHUFFLE',    ['python3', 'gates/sfx_shuffle_gate.py'],
     "A VERDICT COSTS ONE TAP. Twenty of twenty-six moments were silent because "
     "judging cost a couple of hundred interactions per batch, so the batch never "
     "got judged. Breadth first (so the earliest taps retire the most silence), "
     "ten per round (listening-test practice), the SAME SJ.V store and .txt "
     "export, and NOT ONE UI click tone over the sound he is judging", True),
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
    ('PAYDAY',         ['node', 'gates/payday_gate.js'],
     'Paolo 8/9, demo-critical: the day loop can PAY and a hub is reachable. The purse, the '
     'scarcity economy and the quest runtime were three finished organs and NOTHING joined '
     'them -- the probe measured "currency on the walked surface: NONE AT ALL". This proves '
     'the money is in the page the RUN tab actually opens (not the run slice, which is loaded '
     'and never displayed), that a finished quest really reaches the purse, that the hubs are '
     'READ off the overmap and not placed, and that every amount is STILL empty and refuses '
     'out loud by name -- the pipe is finished, the valve is his', False),
    ('DEMO BLOCKERS',  ['node', 'gates/demo_blockers_gate.js'],
     'Paolo 8/9: "First: DEMO BLOCKERS -- numbered, thumbable." Every blocker EXISTS only '
     'because the machine can still see the hole (an engine table shipping empty with '
     '[PENDING Paolo], a HELD backlog row, the live unjudged count) -- so ruling one removes '
     'it by itself and he is never asked twice for something he already gave. Nothing is '
     'silently dropped, and he answers it in the VOTE tab ABOVE the art, one tap', False),
    ('SQUARE ICONS',   ['node', 'gates/square_icons_gate.js'],
     'EVERYTHING IS ON A SQUARE (Paolo 8/8): one measured square for all 59 icons, nothing clipped, '
     'nothing shrunk to fit, one shared ground line, the pad squared in world space too -- and the '
     'size DERIVED at bake time, because the hand-picked 384 cut nineteen heroes in half', False),
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
    ('ATTEMPT',        ['node', 'gates/attempt_gate.js'],
     'ALWAYS MAKE AN ATTEMPT (Paolo 8/11, LOCKED): "FOR ANY TEXT JUST HAVE PLACEHOLDING GOOD '
     'ESTIMATES OF SPEECH I WILL EDIT IT LIVE THATS WHY I HAVENT DONE QUESTS YET". '
     "CONTENTS-PAOLO'S was read fleet-wide as ship-no-words, and THAT READING COST HIM THE "
     'QUESTS -- an empty field is a BLANK PAGE and he edits rather than writes from nothing. '
     'Every player-facing line now ships a REAL attempt tagged draft:true so he can find and '
     'edit it; filler and stubs FAIL. The other half is unchanged and still checked: who dies, '
     'who holds what ground, numbers and dials stay HIS and stay empty', False),
    ('DIRECT',         ['node', 'gates/direct_gate.js'],
     'HE CAN DIRECT IT, NOT JUST WATCH IT. Paolo 8/12: "this is the same fucking problem we '
     'had with the questing shit! I CANT DIRECT QUESTS OR CUTSCENES RN." WORDS let him change '
     'what somebody SAYS; nothing let him change who is in a scene, what order it happens in, '
     'where it happens, whether a beat exists, or where a choice leads -- and without that the '
     'approvals queue came back through the side door as questions from me. The DIRECT tab is '
     'the instrument, and this gate PERFORMS every verb on the real alpha rather than reading '
     'the source for the word "delete": it adds a person and asserts they are in the scene, '
     'moves a beat and asserts the order changed, deletes one, retargets a speaker, walks to '
     'another house and asserts THE ROOM MOVED, presses play and asserts a line HE added '
     'reached the screen while the shipped scene stayed untouched. An editor that renders but '
     'does nothing is the exact invisible failure he is angry about twice', False),
    ('STAGE',          ['node', 'gates/stage_gate.js'],
     'THE CUTSCENE PLUMBING IS A MACHINE, NOT A DIORAMA. Paolo 8/12: "it should be seemless '
     'and not need to be so handcrafted everytime... From location. To it being the actual '
     'house. To mfs not glitching into furniture. To understanding how long voices should '
     'play compared to how long their text shit is." Four complaints, four measured answers: '
     'a line\'s hold is computed from its own text at a PUBLISHED reading speed (Netflix 20 '
     'cps / 5-6s floor / 7s ceiling, BBC 17 cps) and the babble is trimmed to end inside it; '
     'the room comes out of the walked world\'s OWN floorplan generator at a seed, checked '
     'against it directly; 120 generated houses are swept and no two bodies ever share a cell '
     'and nobody ever stands inside furniture; and the deciding test -- a SECOND scene, in a '
     'different building, with seat names the engine has never seen, stages with ZERO new '
     'code. Mutation-tested both ways: fixed-duration lines and an occupancy-blind solver each '
     'take it red', False),
    ('COLD OPEN',      ['node', 'gates/coldopen_gate.js'],
     'THE FIRST FIFTEEN SECONDS OF THE GAME ARE IN A TAB AND THEY PLAY. scene_gate has '
     'proved the cold open beat-by-beat against the locked 7/19 shape since 8/9 -- 40 green '
     'claims, all HEADLESS, about a scene that appeared in ZERO slices. Forty greens on '
     'something he cannot open is the most expensive kind of green there is. STORY tab: the '
     'match-cut plays on the real alpha, all four drafted lines reach the screen, the framing '
     'is measured IDENTICAL either side of the cut (that identity IS the match-cut), and it '
     'hands off to COMBAT\'s own contract name. Also the freeze claim: every one of the 11 '
     'tiles is re-hashed against the approved interior pool, so NO NEW ART is measured rather '
     'than promised -- and after the cut the surface places the player and NOBODY ELSE, '
     'because who survived ten years is Paolo\'s ruling, not the renderer\'s', False),
    ('DIALOGUE CATALOGUE', ['node', 'gates/dialogue_catalogue_gate.js'],
     'DIALOGUE ALWAYS REFERS TO THE CATALOGUE (Paolo 8/11, LOCKED): "I DONT HAVE TIME TO '
     'APPROVE THE DIALOGUE THIS SLOW LIKE THIS I WILL EDIT IT LATER JUST DIALOGUE ALWAYS '
     'REFER TO THE BEST QUESTS EVER CATALOGUE... READ THE QUEST SHIT AND GET INSPIRED." He '
     'took dialogue OFF the approval queue, and the thumb WAS the quality control -- so the '
     'questbook corpus (152 studied quests, 3,672 findings) holds the bar in his place. Every '
     'authored line cites the findings it was built on: id resolves, title VERBATIM, applied '
     'says what it did, a scene spans >=2 studies and >=2 masters. Sources are DISCOVERED, '
     'never a hardcoded list. And the other half of his ruling is checked too: "I will edit '
     'it later" needs a place for later, so the WORDS tab must exist, be wired into the '
     'alpha, live where Pages publishes, fetch nothing, and be CURRENT with its sources by '
     'fingerprint -- a stale tab is the same failure wearing a green', False),
    ('SCENE',          ['node', 'gates/scene_gate.js'],
     'DEMO-CRITICAL (Paolo 8/9). The scripted-scene runtime, backlog 0sc, and its first '
     'consumer: the Act 1 cold open in the LOCKED 7/19 shape -- warm pre-collapse family '
     'table, identical framing, ONE MATCH-CUT across ten years, the same table dingy, '
     'fireworks, the father waking you, handoff to the family-defense tutorial. Plays end to '
     'end, deterministic, 13.5s at 120 BPM. Dialogue drives the EXISTING BQ runtime (REUSE-'
     "FIRST) and is proved on a real .bq: speaker, words, choices, a silence, and a choice "
     'that advances. THE WORDS ARE HIS -- the gate FAILS if anybody writes a line for his '
     'family, and if a scene cites no ruling', False),
    ('MAP BOUND',      ['node', 'gates/mapbound_gate.js'],
     'nothing that scans the valley may decide for itself how big the valley is. A typed `y < 48` '
     'cost a 4.25x population error, and the CROSS-CHECK BUILT TO CATCH IT HAD THE SAME LINE -- '
     'both sides measured a quarter of the world and agreed perfectly for weeks. The sweep then '
     'found NINE MORE in the same file, feeding claims like "EVERY body" and "the biggest '
     'household in the valley". A RATCHET, not a purge: 26 known bounds are declared and may only '
     'shrink, any NEW one fails at once, and the three files this cost most must stay clean', False),
    ('SCALE TRUTH',    ['node', 'gates/scale_truth_gate.js'],
     "the population of the game must agree with the map it is derived from. "
     "tools/bohemia_scale_model.js promised its figure 'can never drift away from the world it "
     "describes' and then measured the valley with the map size HARDCODED at 48x48. The valley "
     "became 96x96 and the tool kept measuring a quarter of it, silently -- a 4.25x error in the "
     "valley population (1,112 vs a measured 4,723), cited across ten files. The occupancy RATE "
     "was right the whole time. Load-bearing claim: the sampled estimate and an EXACT census of "
     "every residential cell must agree", False),
    ('GAME DAY',       ['node', 'gates/game_day_gate.js'],
     'THE BIG MISSING item 1 -- "the circulatory system between the organs is the game and it '
     'has never once circulated" -- ATTEMPTED instead of guessed. Measured on the surface RUN '
     'opens: wake OK, travel OK, and then it stops. Quest BLOCKED, fight BLOCKED, paid BLOCKED, '
     'spend BLOCKED, sleep does not end the day. The 7/29 blocker list was a guess and missed '
     'two of those. A RATCHET, not a demand: closing the links is the RUN lane\'s charter and '
     'is blocked on his rulings, but waking and walking ARE the game today and must not break '
     'quietly', False),
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
    ('ENTRANCE SCOPE', ['python3', 'gates/entrance_scope_gate.py'],
     "Paolo 8/12 opened the customizable entrance and CLOSED ITS SCOPE the same day: 'It only "
     "changes the location and possible vibe and colors possible dialogue but yeah it's not day "
     "and night. It's just with different clothes on.' ONE MAIN QUEST, FOURTEEN DRESSINGS -- and "
     "the second half is the one a build quietly loses. A customizable entrance is exactly the "
     "feature that becomes fourteen games: the Cartel opening should REALLY be different so it "
     "gets its own file, then the Church one does, and now there are fourteen main quests to "
     "write, test and keep in sync forever for a difference he says is NOT day and night. "
     "Fourteen dressings is a week; fourteen quests is the rest of the year. Nothing is forked "
     "today, so this is a RATCHET not a cleanup. Bans a per-faction FORK (S01_REDS.bq beside "
     "S01_THE_METER_READER.bq) while leaving quests legitimately ABOUT a faction alone, and "
     "proves the dressing path exists so nobody has an excuse: a [gate: faction:REDS] option is "
     "legal in the format he already has and really is hidden by default and open to the faction "
     "raised on it -- no format change, no second file", True),
    ('NO HUNTING',     ['python3', 'gates/no_hunting_gate.py'],
     "Paolo 8/11: 'you can't have me test shit out in the run app for real like unless you're gonna "
     "place me right in front of it every time... I'm not hunting bro like how the fuck am I supposed "
     "to find what you want me to find.' A turn shipped a real feature INTO the run (correct - that "
     "is where a player meets it) and then told him to reach it by playing the block quest and "
     "opening the phone. That is minutes of navigation to confirm one readout, and if a trigger does "
     "not fire he concludes the work is broken, so a hunting instruction turns good work into a FALSE "
     "NEGATIVE. Fires only on the exact costly shape - a look-here pointer whose route is the run, "
     "with chained steps - never on the word 'run' and never on shipping into it. Also holds: every "
     "hub card points at a page that exists, and a surface shipped for judgement RUNS ITSELF on load "
     "instead of waiting for a tap. Self-tests by feeding itself the sentence that earned the law", True),
    ('CONTINUITY',     ['node', 'gates/continuity_gate.js'],
     "Paolo 8/7 answered A: 'a bond built in one quest opens a door in another. Continuity is the "
     "dynasty.' Quest state is PER-QUEST by construction, so 44 authored @DO bond rulings could never "
     "have mattered to a later story. The identity key is what made it possible with NO new authoring: "
     "a quest's LABEL for someone is not a person -- 43 role names, 5 used by more than one quest, and "
     "those five settle it (S06/S09 write the neighbour's REQ conditions VERBATIM twice, while S02 and "
     "S12 have two different `runner`s). He has been declaring identity in the @ROLE conditions since "
     "before anything could read it, so the key is the CONDITION SET, never the label -- 46 distinct "
     "people across the 21 canon quests. Holds: a bond crosses and opens a gated option; a different "
     "person sharing a label inherits NOTHING; it survives a reload; it does not double-count inside "
     "its own quest; a runtime built without the ledger is bit-for-bit unchanged; the ledger SHIPS "
     "EMPTY. Eight planted mistakes caught every run", False),
    ('AUTHORED UNREAD', ['python3', 'gates/authored_unread_gate.py'],
     "FOUR TIMES IN NINE DAYS this project shipped content Paolo authored that nothing ever read "
     "-- an approved bank that never draws a pixel (7/30), 17 finished things shipping where no "
     "player looks (8/4), 69 clout tags read only by a vanity counter (8/6), 17 @DO faction_posture "
     "rulings parsed into a real field and dropped (8/7). Every gate in the repo was green through "
     "all four, because nothing could ask the general question. This asks it, and it asks it "
     "BEHAVIOURALLY: boot a real world, resolve a real quest carrying exactly one @DO verb through "
     "the real runtime, boot again without it, diff the worlds. Two TEXT-sweep versions were built "
     "first and both were wrong in opposite directions -- one grepped verb names and called "
     "advance_territory dead because its state field is camelCase, the other grepped state fields "
     "and called everything alive because two judge pages re-implement the runtime and a simulator "
     "looks exactly like a consumer. This one never reads a character of source, so a comment, a "
     "coincidence or a 26 MB generated slice cannot fool it. The vocabulary is read out of the "
     "runtime's own switch, never typed here", False),
    ('FACTION POSTURE', ['node', 'gates/faction_posture_gate.js'],
     "THE THIRD EFFECT, AUTHORED SINCE 7/25 AND READ BY NOTHING. bohemia_quest_runtime.js has "
     "always parsed @DO faction_posture CARTEL +1 into rt.state.posture -- 17 of them across the "
     "canon corpus -- and the world bridge carried the OTHER TWO quest effects to the real "
     "FactionWorld and dropped that one on the floor. Posture is NOT standing and the corpus proves "
     "it rather than me asserting it: an authored stage writes BOTH on the SAME faction in one "
     "breath (S13.33 REDS), which would be a duplicate line if posture meant 'toward the player'. It "
     "is how MOBILISED a faction becomes, so it moves Faction.quota -- 'districts it WANTS to hold', "
     "the appetite term scoreClaim() already reads -- rather than adding a second appetite system. "
     "Grounded in the escalation literature: groups harden in response to perceived hostility. THE "
     "PACING LAW HELD (Paolo 7/24, factions are not at war 24/7): appetite is not a turn, a posture "
     "line moves NOT ONE DISTRICT on its own, and only @DO advance_territory still shakes the map -- "
     "measured by asserting the owner map is byte-identical after a posture quest. Every value is "
     "positive because every authored one is; nobody ever writes a faction calmer. Seven planted "
     "mistakes self-tested every run", False),
    ('INTRODUCTIONS',  ['node', 'gates/introductions_gate.js'],
     "SIXTEEN AUTHORED MECHANICS, ONE UNIFORM BUTTON. Every faction dossier Paolo thumbed UP on "
     "8/2 carries a WHEN YOU ASK THEIR NAME section and every one of them is a different MECHANIC "
     "-- half of them say the word out loud (TRADES 'the earned-name mechanic is earned with WORK', "
     "CARTEL 'the name mechanic runs backwards', BLUES 'gated by REPUTATION'). They sat in "
     "records/factions/ for ten days and the only two files in the repo that had ever opened them "
     "were the generator that wrote them and the gate that checks they exist, while the game gave "
     "every one of the sixteen the same full name for the same press. THE ORGAN IS GENERATED FROM "
     "HIS CANON AND PINNED TO IT: each rule declares a verbatim ANCHOR out of its own dossier and "
     "the generator REFUSES TO RUN if the anchor moved, so a reworded dossier fails the build "
     "rather than shipping a stale reading. Distinctness is MEASURED not asserted (15 distinct "
     "behavioural signatures; NETWORK=REDS are canon twins and get named in the output), the ~85%% "
     "who run with nobody are pinned to Paolo's 7/31 YOU HAVE TO ASK byte-for-byte, and no "
     "earn:never faction leaks the name under any combination of state. Part C opens the REAL "
     "built run in a REAL browser, presses the REAL button and reads the REAL card row by row -- "
     "this lane already shipped advance_territory 'wired' by name-grep and dead in fact (8/9), and "
     "an allegiance line that was invisible for a day because the check used a side door (8/11). "
     "Four earning conditions have no system yet and are treated as FALSE, never assumed", False),
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
    ('SUN MODE',       ['node', 'tools/bohemia_sun_mode_look.js'],
     'Paolo 8/7 "make it light... I\'m working outside and it\'s sunny as shit": the CHARACTER and ANIMATION panels '
     'and EVERY hair-bearing canvas go daylight-readable, measured by luminance on the real surface, and the choice '
     'survives a reload. The canvases carry their dark background INLINE, so the failure this catches is a light '
     'panel with every hairstyle still on its own black square -- which reads as fixed in a diff and is useless to him',
     True),
    ('FAMILY CAST',    ['node', 'gates/family_cast_gate.js'],
     'the cold open cast on the ONE rig: father, mother, brother, sister all RENDER (painted pixels, not '
     'element-exists), they are four DIFFERENT people, every garment is already st==canon, every one wears '
     'legs (a bare shin paints the dark under-body, not skin), and the contact shadow lives in its own '
     'canvas with NONE of it in the sprite -- SHADOWS ARE A SEPARATE LAYER, 7/26 LOCKED',
     True),
    ('CHIN LAW',       ['node', 'gates/chin_law_gate.js'],
     'THE CHIN LAW (Paolo 8/11, LOCKED: "make sure we never have this chin issue ever again"). He caught the '
     'same defect FOUR times from TWO unrelated mechanisms -- the head was the one body part excluded from '
     'silhouette edging so his painted jawline rendered as cheek, and the throat tone took the lowest TWO rows '
     'of face, which are his jaw and his chin. Properties, not numbers: there is always head under the mouth, '
     'the throat never takes more than one row of face, the head has an edge, EVERY painted facing with the '
     'hair off. And the throat may never claim the LAST face row under the mouth -- a row count tuned per '
     'facing was corrected three times by eye and was still wrong on E',
     True),
    ('HEAD FOLLOWS RIG', ['node', 'gates/head_follows_rig_gate.js'],
     'Paolo 8/11, chin circled on a screenshot: "this is not how the rig has my head and my neck line... there '
     'needs to be more head underneath the mouth following how the rig has it." Measured, skin width per row, '
     'his painted face vs the skin the game paints: rig 6-8-8-8-10-10-8-8-6-4 (an EGG), game 7-9-10-10-10-10-10-'
     '10-9-5 (a BARREL), worst at y14 the jaw, three pixels too wide -- the flat shelf under the mouth. The '
     'cause is in the SKINNER so this is a RATCHET, not a pass/fail: the deviation may only SHRINK, the debt is '
     'visible in the suite instead of somebody memory, and this is the check that proves the fix when it lands',
     True),
    ('OVERWORLD FACE', ['node', 'gates/sprite_face_scale_gate.js'],
     'Paolo 8/11 "BRO I MEANT THE TINY PIXEL OVERWORLD FACES": his face on the 56px BODY is six pixels of '
     'eyes, three of nose and a TWO PIXEL mouth. The scale is a knob defaulting to 1 that returns HIS PIXELS '
     'BY IDENTITY at 1 (RIG LAW -- painted regions are his), every step changes real RENDERED pixels, and the '
     'per-feature form works, because at a flat x2 the two eyes fuse into one bar (2px eyes, 1px gap, 10px head) '
     'and growing only the mouth is the setting that actually reads',
     True),
    ('FACE FEAT DIAL', ['node', 'gates/face_feature_scale_gate.js'],
     'Paolo 8/11 "maybe all eyes eyebrows and mouths should be twice the size idk": the feature scale is a '
     'RENDER-TIME KNOB defaulting to 1, and at 1 the face is BYTE-IDENTICAL to no knob at all because PUNK is '
     'marked do-not-remake -- plus the ANTI-NO-OP half, that every step up the dial changes real pixels and '
     'changes more of them the further it goes (two "fixes" shipped 8/11 moved the render by 0 and 1 pixels '
     'with every gate green, because no gate asked whether the pixels moved)',
     True),
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
    ('COMBAT SCALE',   ['node', 'gates/combat_scale_gate.js'],
     'THE GATE FOR THE GIANTS (8/11): zooming the board out lowered the tile pitch but every '
     'human was blitted at a hardcoded 112x112 that did not know the board existed, so a man '
     'went from ~3 tiles tall to ~6.9 and it shipped. I looked straight at the screenshots and '
     'called it a pass. So the thing I got wrong by eye is a NUMBER now: a man must be the same '
     'number of tiles tall as he was before the zoom, the zoom must be a whole number (pixel art '
     'only scales by integers), and the world must be built further than he can see', False),
    ('NO BULLSHIT Qs', ['python3', 'gates/no_bullshit_questions_gate.py'],
     'Paolo 8/11: "UR QUESTIONS ARE NOT ENGLISH... IF IT MAKES THE GAME FUNNER AND '
     'REALISTIC DO IT". Both keys turn = build it, no question. Machine-checks the two '
     'shapes he named: no lettered option menus handed to him, and no build-language '
     'words inside anything ending in a question mark', False),
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
    ('WIRED IN A TAB', ['node', 'gates/wired_in_tab_gate.js'],
     'Paolo 8/11: "never ever ever again tell me hey check this out by opening the run '
     'tab" — every wired tile family must be VISIBLE as a screenshot card in the ART tab; '
     'shipping a wiring without putting it in front of him is the hunt, and it goes red', False),
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
     'the fourteen locked numbers nine parallel lanes all build on -- valley grid, beat, BPM, the lit 12 percent, three currencies, three generations -- given ONE declared home, every value PROVED present in the law it cites, AND (8/7) every one MEASURED OUT OF THE RUNNING WORLD or declared unmeasurable with a reason that names its own expiry. That half was added because the old engine sweep was VACUOUS for 13 of the 14 -- it matched variable NAMES the engine never uses, so it compared two numbers across 112 modules and could not fail, while BUILT_KM2 had already drifted 37.0 -> 38.35 unnoticed. The measured rows are GENERATED, so they cannot drift, because nobody types them. Also catches what no numeric check can: the currency COUNT is right and the NAMES are wrong (law says RESOURCES, engine ships MEDICINE)', False),
    ('CANON ROT', ['node', 'gates/canon_rot_gate.js'],
     'nine sessions write canon in parallel across 583 law/record files that cite each other constantly, and NOTHING had ever checked those citations resolve -- a law pointing at a file that does not exist is worse than no citation, because a session follows it, finds nothing, and concludes the thing was never built. Hard-fails extension drift, ratchets pre-existing debt so no lane is blocked by another lane, and SELF-TESTS its own regex first because the first run of this audit was wrong in exactly that way', False),
    ('BOSS LADDER',    ['node', 'gates/boss_ladder_gate.js'],
     'ONE BOSS = ONE LOCK = ONE THING THAT WAS IMPOSSIBLE AND NOW IS NOT, and no two bosses may open the same door. Built 8/7 because Paolo read the ladder and said "THE STRIPPER / THE WRECKER / THE TOLL -- these are the exact same bro" and he was right: three bosses, one verb, sitting there for four days past a 131-check gate that only ever asked whether the list was well-FORMED and never whether two entries were the SAME THING. Holds the locks distinct, forces every lock to be an impossibility rather than a noun somebody owns, keeps the five killed bosses dead, and checks his rulings actually landed. It caught me committing the identical duplicate INSIDE the fix for it on its first run -- and again on the v3 pass, where two bosses shared a verb and eight locks were written as nouns. EXTENDED TWICE MORE on 8/7: he demoted the spare column as slop (so two checks RETIRED with it -- a gate must never outrank a ruling), ruled ACT 3 SLIGHTLY FUTURISTIC / early Night City, and called transport thin (now a seven-boss spine, because the rebuilding research says you cannot have metallurgy without transport networks). 56 candidates, 56 distinct locks, 56 distinct grant verbs, declared a POOL TO CUT FROM. It also holds his lore rulings (3D printed meat is canon so THE VAT has BIOREACTOR CAPACITY as its lock, not animals; plastic pyrolysis is the fuel path and Las Vegas is the oil field; people already come to Vegas so THE MARQUEE only accelerates it) and the TWO KILL-RULES that have now killed thirteen bosses between them: if you cannot name the wall without inventing it there is no boss, and if the grant does not fit on a button it is not a grant. Its act lookup was rewritten 8/7 because it located a boss by its FIRST PROSE MENTION rather than its table row, which silently put two bosses in act 0. He also called bullshit on my shoe research (correctly -- I generalised PU-midsole hydrolysis into every shoe) so THE BOOT died by my own rule, and TWO CHECKS WERE REVERSED on his rulings rather than defended. Earlier ruling kept: BESTING IS NOT KILLING, so every one of the 34 bosses declares a KILL route (you take the thing) and a SPARE route (you gain the person), the gate fails if a spare route is the kill route reworded, and every boss declares one of four grant KINDS because he named gear and customization as the missing ones', False),
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
