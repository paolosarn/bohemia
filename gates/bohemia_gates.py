#!/usr/bin/env python3
"""
BOHEMIA GATES — one command, every law (7/16/26)

Nine gates got built today. Nine gates nobody will remember to run individually
is nine gates that do not exist. That is the exact failure this whole day was
about: laws enforced by memory are not enforced.

  python3 bohemia_gates.py            # everything
  python3 bohemia_gates.py --fast     # skip the pixel sweeps (~2s vs ~4min)
  python3 bohemia_gates.py --lenient  # exit 0 even if gates fail (--strict is now the default)

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
    # 8/19: measured on the shipped alpha -- the street shuffle took the music
    # back 64 bars into the COLD OPEN, the first fight in the game, because
    # CITYMUS.on stayed true while combat drove the same transport. And combat
    # drew its song uniformly from a list whose first entry is CUSTOM, the
    # studio's blank scratch patch. This gate PLAYS A FIGHT rather than grepping
    # for a function name, because a static check goes green the moment a call
    # site exists and says nothing about whether the shuffle actually let go.
    # 8/20: 30 of the 92 game moments make NO SOUND, every one of them shown to
    # him and thumbed down twice, and not one of them had a CALLER anywhere in
    # the build -- so an approval would still have been silent and would have
    # looked like a bad sound rather than a missing wire. This counts them and
    # holds the wires this lane could reach.
    ('SILENT MOMENTS',  ['python3', 'gates/silent_moments_gate.py'],
     'the moments that make no sound are counted, and the ones this lane can '
     'reach have a caller waiting for the day they are approved', False),
    ('NO CASH',        ['python3', 'gates/no_cash_gate.py'],
     'there is no paper and there are no coins (Paolo 8/20, on the hands_pass.4 '
     'verdict line): no live moment describes money as paper or coin, the three '
     'dead cash ids stay dead and hold no approved sound, the moment is ANSWERED '
     'by parts_pass rather than deleted, and nothing in the shipped build plays '
     'a dead cash id', False),
    ('STING AUDIBLE',  ['python3', 'gates/sting_audible_gate.py'],
     'every musical sting actually makes a sound, MEASURED through the real '
     'synthV rather than read: a graveyarded or drumV voice name renders a '
     'silent gain and every other check stays green (ironlung, throatsong, '
     'knock/rim/wood/brim). Plus QUESTSTING driven through a real quest '
     'transition, so finishing a job is heard and reloading a finished save '
     'is not', True),
    ('FIGHT MUSIC',    ['python3', 'gates/fight_music_gate.py'],
     'the music knows when you are in a fight: the streets stand down, hold '
     'past a 64-bar pass, and come back on a phrase boundary -- and a fight is '
     'never scored by the studio scratch patch', False),
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
    ('VERDICT FROZEN', ['python3', 'gates/verdict_frozen_gate.py'],
     "Paolo 8/16: \"I didn't see the new sound effect\". SFX-07 shipped on the "
     "same event ids he had killed hours earlier, so the judge sheet hid thirty "
     "new candidates behind his own DOWN thumbs AND thirty of his verdicts were "
     "silently reassigned to sounds he never heard. A sound he has judged is "
     "frozen forever; a new sound gets a NEW id", False),
    ('INSTRUMENTS',    ['python3', 'gates/instrument_gate.py'],
     "Paolo 8/16 after SFX-06 died 34 of 35: \"use more instruments\". The alpha "
     "carries a 602-voice music rack that every song he calls fire is built "
     "from, and the sound engine had never called one of them in five sweeps. "
     "This proves the door is open, that every instrument a recipe names is one "
     "the rack really answers to, and that borrowing it copies no voice and adds "
     "no feedback path", False),
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
    ('DAY PAYS',       ['node', 'gates/day_pays_gate.js'],
     'The demo cut ruled 8/4 says "GET PAID -> spend at a trading hub". It never happened, '
     'and not because it was unbuilt: MEASURED 8/12, engine/bohemia_payday.js exported '
     'questEvent, payForQuest, hubs, nearestHub, shelf, price, buy and dayReport and every '
     'one was referenced EXACTLY ZERO times outside its own module -- dormant since 8/11. '
     'One piece really was missing: Paolo ruled "whatever currency the quest decida to give" '
     'and the .bq language had NO VERB to say it, so every finished job fell through to the '
     'empty global table. Now @DO pay <currency> <n> lives on the stage (the reward belongs '
     'to the OUTCOME) and the run calls the bridge. A quest that declares nothing is REFUSED '
     'rather than guessed at, and the reckoning says "nobody has ruled what this pays" and '
     'names the job -- because amounts are CONTENTS and numbers wait for him', True),
    ('MARKET',         ['node', 'gates/market_gate.js'],
     'The other half of that same demo row -- "SPEND AT A TRADING HUB" -- and my own '
     'handoff said it was blocked on Paolo because "a price is a number, and numbers are '
     'his." THAT WAS WRONG AND I HAD NOT READ THE FILE. He ruled it three days earlier: '
     '@RULING PRICES A (8/11), "Three goods, priced off the scarcity sim we already have", '
     'and payday.js has carried PRICE_SOURCE=economy ever since. The lane spent three days '
     'waiting for a ruling it already had -- the seventh finished thing this week that never '
     'reached the surface he taps. Now: the hubs are READ OUT OF THE OVERMAP (MAP LAW, '
     'nothing placed), the goods and their prices come off the scarcity sim (hyperbolic in '
     'days-of-supply, anchored in Sarajevo 92-95 where staples moved 10-100x), and a market '
     'is A PLACE -- standing anywhere else there is no button, and you cannot buy from the '
     'phone. Driven on the real surface: he stands in the swap meet the overmap put there, '
     'is refused while broke, buys, the balance really drops, buying the stock makes the '
     'next one DEARER, and a night in the valley moves the price again. HIS TABLE STILL '
     'WINS and is still empty: the day he names a price it beats the sim', True),
    ('CITY BRIDGE',    ['node', 'gates/city_bridge_gate.js'],
     'THE CITY COULD NOT TALK TO THE SHELL, AND THE SAVE PANEL SAID IT COULD. Measured in '
     'a real browser before anything was changed: postMessage({bohemiaCityState:{day:42}}) '
     'saved 0 bytes, and the SAME payload with a .type field saved 135 and read back. '
     'combatMsgIn opened with `if(!d||!d.type)return false;` and SEVEN handlers inside it '
     'are keyed on bohemia* properties with no .type -- so the autosave, the city sounds, '
     'the music toggle, all three save-panel messages and the prefab bridge were ALL '
     'unreachable. The city has never autosaved through the alpha, while its own save '
     'panel read "Autosaves survive a reload", and my 8/12 and 8/14 gates both asserted '
     'the purse and market ride the save -- true on the city page opened DIRECTLY, where '
     'there is no shell to post to, and false where he plays. The fix is DERIVED, not a '
     'list: the guard tests for a .type OR any bohemia* key, so the eighth handler is '
     'covered before it is written. This posts every handler the alpha declares (scraped '
     'from the alpha, never typed here), proves the save, the sound and the prefab bridge '
     'really work, and proves an unrelated postMessage is still ignored', True),
    ('PLACEHOLDER #',  ['node', 'gates/placeholder_number_gate.js'],
     'laws/BOHEMIA_ADDENDUM_EVERYTHING_COSTS_ONE_8_15_26.md (Paolo, LOCKED) asks for this '
     'gate by name in its section 5b and says whoever ships first writes it. His reasoning '
     'is the whole point: a plausible-looking number LOOKS TUNED, so it slips past every '
     'future reader, gets built on, and becomes canon by inertia -- nobody re-opens a value '
     'that looks deliberate, while a 1 announces itself as a placeholder from across the '
     'room. So the failure caught here is not a wrong number, it is a number wearing NO '
     'LABEL. It constrains the PROPERTY and not the shape, because WORLD owns these tables '
     'and has not filled them yet and this lane does not design another lane\'s data on the '
     'way past. Mutation-tested in place (a bare {resources:7} is planted, caught, and the '
     'table put back), asserts ONE IS NOT FREE (the honest NO_RULING refusal survives), '
     'asserts NO DAMAGE BEFORE THE DIAL is untouched, and GENERATES the tuning list rather '
     'than remembering it. The tables are empty today: it is standing before the numbers '
     'arrive so the first hand to fill them cannot land an untagged one', True),
    ('SAVE COMPAT',    ['node', 'gates/save_compat_gate.js'],
     'DEMO BOARD row 6, P0-SAVE, routed here 8/15: "DURABILITY IS NOT COMPATIBILITY -- this '
     'audit verified that the bytes survive the BROWSER and never asked whether they survive '
     'US." Everything built for the save so far protects it from the PHONE; none of it '
     'protected it from the next commit. MEASURED: citySnapshot wrote a hardcoded v:1 and '
     'applyRestore tested st.v!==1, EXACT EQUALITY against a hardcoded 1 -- so the first lane '
     'to do the CORRECT thing (change the shape, bump the version) would have silently '
     'returned false for every save in existence and started him at day 1 with nothing, '
     'indistinguishable from a wipe. I only got away with adding purse and market this week '
     'because I did NOT bump it, which is luck. The inverse was live too: a cached older '
     'build threw a newer save away without a word. Now one constant, a walk-forward '
     'migrator that NEVER MUTATES THE INPUT, and a named refusal for a save from a newer '
     'build. It is MUTATION-TESTED by performing the future commit -- bump the version at '
     'runtime, add the migration a lane would add, and prove his old save still arrives -- '
     'because a trap that only springs on a later commit cannot be proved any other way', True),
    ('VISTA BEAT',     ['node', 'gates/vista_beat_gate.js'],
     'DEMO BOARD row 11: the vista is built, derived, inlined and ARMED, "BUT NOTHING LEADS '
     'YOU THERE -- a repo-wide grep finds ZERO game-side callers. The demo money shot is '
     'currently found by ACCIDENTALLY WALKING ONTO ONE RIM CELL." Eighth row of that exact '
     'shape this lane has closed: a finished thing with a published seam and no caller. Now '
     'the phone carries where the overlook is (the same channel that carries the market, so '
     'it is somewhere to WALK TO), and the day loop plays it ONCE on the day 2 morning -- not '
     'day 1, which is already the cold open plus his first job. AND THE HALF A GREEN GATE '
     'MISSED: the first cut opened it ON the wake, which also raises the DAY 2 card, so the '
     'money shot rendered UNDER a modal -- gate green, shot buried. Found by taking the '
     'screenshot and looking. It waits for GET UP now, and the gate asserts the card is GONE '
     'when the valley is up. Once ever, across reloads, and MAP LAW holds: this lane reports '
     'where the overlook is and never places it', True),
    ('WHOLE DEMO',     ['node', 'gates/the_whole_demo_gate.js'],
     'THE DEMO IS SCOPED (Paolo 8/4): THE ORIGIN + THE VISTA + ONE GOOD DAY. Every beat of it '
     'is green and NOT ONE TEST HAD EVER PLAYED IT THROUGH. Five gates, three surfaces, five '
     'separate boots, and the join between any two of them proved by nobody -- SWEEP 13 word '
     'for word, "gates that test pieces and never the journey", and the same shape as every '
     'other bug this week: a finished thing with a published seam and no caller, except here '
     'the seam is between two GATES and the thing falling through it is the demo. THE VISTA '
     'WAS THE SHARPEST CASE: vista_beat drives BOHEMIA_CITY_WORLD.html STANDALONE, and nobody '
     'opens it that way -- he opens the alpha and taps the splash, and the city runs as an '
     'IFRAME inside a shell with its own toolbar, day card and install banner. This lane had '
     'already shipped a fix for a bug of exactly that shape. So the demo\'s money shot had '
     'never once been checked on the surface his thumb touches. It is now, and it works: the '
     'valley opens on day 2 in the alpha, card at page 104-164 against a tab bar at 0-40, '
     'compared in ONE coordinate system because the card is measured in the iframe and the bar '
     'in the page. EVERY BEAT IS A TAP A PLAYER COULD MAKE -- no offerAccept(), no DAY.day=2, '
     'no forcing a panel visible. Mutation-tested both ways: disarm the vista and the money '
     'shot goes red, silence the phone badge and the affordance claim goes red. It does NOT '
     'replace FIRST NIGHT and must not be deduped with it -- that one is the microscope on day '
     'one, this is the SPINE, and a microscope cannot see a seam between two boots', False),
    ('FIRST NIGHT',    ['node', 'gates/first_night_gate.js'],
     'THE FIRST NIGHT HAD NEVER BEEN PLAYED AS A SEQUENCE. Nine beats land in the player\'s '
     'first twenty minutes -- cold open, wake, the job on the phone, the offer, the market, '
     'the reckoning, the install line, the day 2 wake, the vista -- each built by a different '
     'turn against its own gate, and every one of those gates was GREEN. The bug was in the '
     'space between them: measured on the real alpha, the shell\'s cold-open banner covered '
     'page y 40-127 and the city\'s own toolbar sits at 89-120, so MUSIC, save, the builder '
     'drawer and PHONE -- unread badge lit -- were ENTIRELY underneath it, on the morning the '
     'wake card says "Something came in on your phone overnight". THE JOB COMES IN ON THE '
     'PHONE, so the demo\'s core loop was blocked at minute one by the story hook, and neither '
     'beat won: the family-at-the-table hook was a thin bar losing to a big gold GET UP button. '
     'The offset is now REPORTED BY THE CITY and never typed in the shell (which cannot read '
     'into the iframe on file:// anyway), and the banner STANDS DOWN entirely while a city '
     'surface is open -- because the first cut only moved it below the toolbar and the phone '
     'SCREEN then ran 115-844 under a banner at 121-208, which is moving a bug, not fixing it. '
     'It TAPS the phone through the shell rather than comparing rectangles. Mutation-tested '
     'both ways: restore the overlap and the tap stops opening the phone; drop the z-index '
     'clause and the world canvas counts as an overlay, which suppresses the cold open '
     'permanently -- the regression that hid INSIDE the fix, caught by measuring after. '
     'IT NOW ALSO HOLDS THE TWO THINGS THE REACHABILITY HALF FOUND. (a) HIS HOUSE WAS 38 '
     'CELLS FROM HIS FEET on every boot: the shell forwards a cell from the RUN SLICE (a '
     'different surface with its own player) and homeFind keyed on that marker, so the one '
     'thing the run is anchored on sat across the valley. (b) THE DAY COULD NOT BE SPENT BY '
     'PLAYING: bohemia_dayloop tick did `mins = Math.max(0, mins | 0)`, the walk ticks 0.084 '
     'min per cell, and 0.084|0 is 0 -- every step ever taken was discarded, each call '
     'truncating independently so the remainder could never accumulate. DAY.step had NO '
     'CALLER at all, so "N steps" was always 0 too. That is why the reckoning always read '
     '"0h lived - 16h given back": not a quiet day, a day that could not be spent. It walks '
     'the real pad with real pointer holds in eight directions (a wall ended the first cut '
     'after six cells and would have reported the clock broken for the wrong reason) and '
     'asserts the clock moved, the steps counted and the district ledger recorded it. '
     'AND THE LAST UNPROVEN STRETCH IS DRIVEN NOW: he TAKES THE JOB by tapping TAKE IT in '
     'the phone frame (demo_day_gate calls offerAccept() directly, so the cross-frame path '
     'had never been tapped) and WALKS THROUGH HIS OWN FRONT DOOR. That found the valley '
     'sealed: 2,334 cells around the spawn belong to enterable buildings and TWO could be '
     'walked into, because massHasDoor counted FOUR door markers (hdoor, portal+enter, '
     'doorW, doorE) while the walk admitted through TWO -- so a house whose door is a doorW '
     'made the guard say "this building HAS a door", flipping the walk to its strict branch, '
     'which then could not see the marker the guard had just counted. THE GUARD LOCKED THE '
     'DOOR AND THREW AWAY THE KEY, and his own front door 29 cells away was one of the '
     'eighteen refused. One predicate now, so the two halves cannot disagree: 20 doors '
     'reachable, nearest 29 cells. AND WALKING IN STARTED A GUNFIGHT -- the fight roll is '
     'DETERMINISTIC off the footprint, so his house was not unlucky once, it was a firefight '
     'FOREVER; the odds are untouched and the house is exempt. The path is a BFS standing in '
     'for a player\'s eyes but every move is a real pointer hold at a FULL BEAT, because '
     'movement is beat-quantised and a 220ms press lands nothing', True),
    ('INSTALL CARD',   ['node', 'gates/install_card_gate.js'],
     'DEMO BOARD row 6, THE LAST HALF OF THE HOME-SCREEN WORK ORDER: the manifest, the icon '
     'and the apple metas shipped 8/16 so an install WORKS, but NOTHING EVER TOLD HIM IT '
     'EXISTS -- grep -c "ADD TO HOME" was 0 across both surfaces. On the platform he demos '
     'on there is no other channel: beforeinstallprompt has never existed in Safari (WebKit '
     '255716) and Chrome and Edge on iOS are Safari underneath, so iOS gets a sentence from '
     'us or it gets nothing. AND THE STAKE IS THE SAVE -- iOS does NOT share localStorage '
     'between Safari and a home-screen app, so the run he is in does not travel with him, '
     'which is why the ask lands at the end of DAY 1 when he has the least to lose. IT IS A '
     'LINE ON THE RECKONING, NOT A CARD, AND THAT WAS A CORRECTION: the first cut was its '
     'own modal and took THREE of my own gates red (vista_beat 14/5, dayloop 56/1, demo_day '
     '21/3) because the first night became reckoning -> install -> wake -> GET UP -> vista, '
     'five modals, four before he plays day two. So the SHAPE is asserted, not just the '
     'presence: the reckoning must still have EXACTLY ONE BUTTON and one tap must still land '
     'on DAY 2. The iOS 26 detail is pinned too, because it is the one claim in the copy that '
     'rots: Safari moved Share out of the toolbar, so the instruction names the ELLIPSIS. '
     'Mutation-tested both ways -- strip the caller and the row\'s original state goes red, '
     'add a second button and the cost-him-nothing assertion goes red', True),
    ('HOME SCREEN',    ['node', 'gates/home_screen_gate.js'],
     'DEMO BOARD row 6, the half open since 8/13: manifest + apple metas + icon, and the '
     'board\'s own evidence was a grep returning 0, 0 and 0 across every surface. He demos '
     'this on a PHONE off one link and that link had no name, no icon and no way out of '
     'Safari chrome. THREE iOS FACTS, researched rather than remembered, because each is a '
     'place iOS does not do what other platforms do: (1) iOS DOES NOT USE THE MANIFEST ICONS '
     'for the springboard -- it reads apple-touch-icon, which OVERRIDES the manifest list, so '
     'a manifest-only build passes every checker and still ships a grey screenshot as the '
     'icon; (2) the icon has to EXIST AND PUBLISH, checked on disk and against _config.yml '
     'through the shared resolver, because a missing one is not a broken image he could '
     'diagnose, it is a blank tile on his phone; (3) STORAGE IS NOT SHARED between Safari and '
     'a home-screen app -- separate localStorage, cookies and service worker -- so a run he '
     'played in the browser IS NOT THERE when he taps the icon, and the symptom is '
     'indistinguishable from the save being wiped. The build says so in plain words and names '
     'the EXPORT/IMPORT path that already exists, and this DRIVES ALL THREE CASES in a real '
     'browser: standalone-and-empty must warn, standalone-with-a-run must stay QUIET (a '
     'notice fired at a returning player is worse than none), and the browser never sees it. '
     'That middle case caught a real bug on the first run: the check read CITYSAVE from four '
     'thousand lines above its own const, so the TDZ throw landed in a catch that called it '
     '"no save" -- a not-yet is not an answer', True),
    ('ONE VALLEY',     ['node', 'gates/one_valley_gate.js'],
     'Paolo 8/15: "When I press the re-roll button... it like puts me to another location and I '
     'cant continue to run." MEASURED mid-run: one tap swapped the valley seed, threw him out of '
     'his body, made his HOME null, and THE NEXT AUTOSAVE WROTE THE NEW SEED. THEN I GOT THE FIX '
     'WRONG AND THAT IS THE USEFUL HALF: I removed the button, and ANOTHER LANE HAD ALREADY '
     'FIXED IT THE SAME DAY for his other report about it, with a rehome and a gate that presses '
     'it five times. Deleting a feature somebody just repaired, for the same user, is not a fix. '
     'The button is back and reroll is THEIRS. What this holds is the part that is nobody elses '
     'and still true: NOTHING IN THE TOOLBAR IS A ONE-WAY DOOR OUT OF HIS RUN. It starts a real '
     'run, presses EVERY control, toggles each BACK, and asserts he ends up in his own body with '
     'his own house -- checking any single button by name would let the next one land with the '
     'same power. The sweep earns that: it found UNDER, which cleared its view but left him in '
     'the overview with no way back to his feet. Reroll is skipped DECLARED, not silently, '
     'because replacing the world is its job and reroll_gate.js owns where it lands him. '
     'Mutation-tested: re-break UNDER and it goes red naming it', True),
    ('DEMO DAY',       ['node', 'gates/demo_day_gate.js'],
     'THE PEOPLE LANE SHIPPED A demo_gate THE SAME DAY FOR THE SAME ROW AND BOTH ARE WORTH '
     'KEEPING -- theirs guards the SPINE OF THE OPENING from a phone that has never seen the '
     'game, this one guards THE DAY ITSELF. Neither is a superset of the other and collapsing '
     'them would have thrown away real coverage to win a filename. '
     'DEMO BOARD row 9: seven gates each proved one beat of the demo and NOBODY had ever '
     'played the whole thing on the surface Paolo taps. This does, by hand, in ONE session, '
     'touching only what a player can touch: tap the splash and land IN THE GAME rather '
     'than on the wardrobe workbench (row 7), wake with no objective, the phone rings, take '
     'the job ON THE PHONE, walk into the building, tap the quest author\'s own option, GET '
     'PAID, walk to the swap meet the overmap placed, TAP A ROW AND BUY, sleep, day 2 -- '
     'then RELOAD THE WHOLE ALPHA and assert the day, the purse and the valley\'s stocks '
     'all came back. It found two real bugs on its first run and both are fixed. It also '
     'chains the deploy check row 9 asked for: every file the played day actually loaded is '
     'a path _config.yml publishes, read through the shared resolver, so a demo that works '
     'on disk and 404s on the real link goes red here. THE FIGHT and CAMP are named as NOT '
     'ASSERTED out loud, so this row can never read as closed while the game still stops', True),
    ('CONTINUITY',     ['node', 'gates/continuity_gate.js'],
     'Paolo 8/12: "we are trying tk create the best funnest deepest videogame ever". Depth '
     'is not more surface, it is yesterday still being true today -- so it was MEASURED '
     'across a real day boundary first: day 1 ended TRADES +8, day 2 opened {} . A BOND '
     'survived the night and everything he did to a FACTION was forgotten by morning, in a '
     'valley whose whole spine is factions. Half a wiring job somebody stopped in the '
     'middle: Paolo 8/7 ruling A ("a bond built in one quest opens a door in another. '
     'Continuity is the dynasty") was applied to bonds and not to standing. Now standing, '
     'posture and bonds all carry, each with the REASON kept -- the quest\'s own @LOG line, '
     'diffed against the .bq -- and the phone SHOWS it, because a ledger nobody can read is '
     'bookkeeping, not depth. Also asserts a runtime with NO shared ledger is unchanged (the '
     'engine\'s written promise) and that the buzz is a sound HE PUT UP on 8/9', True),
    ('PHONE RINGS',    ['node', 'gates/phone_rings_gate.js'],
     'The phone was in his pocket and knew where he was, and was still a VIEWER: nothing '
     'ever arrived on it and nothing he did on it changed the day. engine/bohemia_loop.js '
     'has modelled the answer since it was written -- "THE FEED OFFERS: the quests you can '
     'pick up OVER THE PHONE right now" -- and the demo was skipping the channel by handing '
     'him the day\'s job on the wake card, done deal. Now the day starts with NO objective, '
     'the job arrives on the phone in the quest\'s OWN words, and taking it THERE is what '
     'makes it real in the run. And NOT TAKING A JOB IS NOT FAILING IT -- a distinction the '
     'old auto-start could not express. Driven by tapping the real buttons, both scenarios: '
     'he takes it and runs out of light (the author\'s own FAIL stage fires), and he never '
     'takes it (nothing runs, and the reckoning says "never taken")', True),
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
    # Paolo 8/11: "more open pits ... especially if its dirt/sand ... we can
    # proceduraly generate elements on the dirt/sand". Dirt is a generative
    # surface, not a floor.
    ('PITS',           ['node', 'gates/pits_gate.js'],
     'bare dirt and sand get dug: subsidence, a cracked rim, the spoil heap that never went '
     'back in, a machine ramp and nitrogen-fed growth over the fill -- every part a cited '
     'forensic surface indicator, elliptical never rectangular, spoil thrown to one side, '
     'deterministic, never on pavement, and naming no faction', False),
    # Paolo 8/15 on the whole icon batch: "it's border should be on the border of
    # the tile. It should be that fat and big on the tile" + the storey curve.
    # Paolo 8/15: "recognize and be smart about which direction a street should be
    # going east to West north to south and then make it face that way properly".
    ('STREET FACING',  ['node', 'gates/street_facing_gate.js'],
     'a street tile faces the way the street actually runs, read off the neighbour mask the '
     'cell already computes (not guessed): north-south and east-west are the two diagonals of '
     'an iso diamond, so the turn is a MIRROR about the tile centre rather than a bitmap '
     'rotation that would shear the pixel grid; junctions are symmetric and never flipped, '
     'and no building is ever mirrored', False),
    ('FAT AND TALL',   ['node', 'gates/fat_and_tall_gate.js'],
     'every building painted on a tile starts at the cell border and gains a storey (1 reads '
     'as 2, 2 as 3, the tallest very tall) -- a CURVE not a multiplier, because x2 then x1.5 '
     'is falling and a constant would flatten the skyline he asked to exaggerate; clamped at '
     'the plate so fat is never bleed, and the ground is never lifted off its own cell', False),
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
    ('VOICE MOOD',     ['python3', 'gates/voice_mood_gate.py'],
     "identity was solved on 8/11 and DELIVERY was not: a mother calling her kids "
     "to dinner and somebody telling you to get out of the house came out at the "
     "same pitch, speed and weight. Scherer 1986 and the Juslin & Laukka 2003 "
     "meta-analysis both say high arousal is higher F0, more F0 variability, more "
     "intensity, faster rate and more high-frequency energy -- so the engine moves "
     "all five on two axes, reads only PUNCTUATION AND CASE by default (never "
     "sentiment, which would be writing his people for him), and this gate proves "
     "a line with no marks in it is byte-for-byte the voice he approved", True),
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
    ('MIX',            ['python3', 'gates/mix_gate.py'],
     "nothing in the game ever moved out of the way of anything else: 105 approved "
     "sounds all arriving at the same weight, and a voice cap that dropped whatever "
     "came ninth. Four coarse priority tiers decide now (the fight is never "
     "refused), and the music DUCKS UNDER A PERSON TALKING -- the researched -9 dB, "
     "with the attack shortened from the usual 500ms because a squiggle line is "
     "often only a second and a half long. Measured as AUDIO through the duck node "
     "against the AUDIO clock, never read off the arithmetic", True),
    ('SPATIAL SOUND',  ['python3', 'gates/spatial_sound_gate.py'],
     "the valley was a FLAT STEREO FIELD: every sound arrived at the same level "
     "from the same nowhere except a neighbour's footstep, which got distance and "
     "pan on 8/2 and stayed the only spatial sound in the game. Placement is now "
     "one path for everything -- the inverse law for level, pan from the x offset, "
     "a lowpass that closes with distance, and OCCLUSION when a wall is between "
     "you and it. Measured in the rendered samples, never read back off the "
     "arithmetic, and mutation-tested: pinning the filter open takes it red", True),
    ('SFX DIVERSITY',  ['python3', 'gates/sfx_diversity_gate.py'],
     "Paolo after judging all 270: \"you need more diverse sounds bro its getting "
     "stale at this point\". He was hearing the TOPOLOGY -- every sound this engine "
     "ever made was a struck resonant object, so 54 moments came out 54 cousins, and "
     "9 of the 12 that died whole were the moments that are not a strike. The engine "
     "now has five physics (modal / FM / PhISEM particle / friction / turbulence) and "
     "this gate renders a CONTROLLED PROBE -- every parameter fixed, only the method "
     "changed -- so two methods sharing one body cannot pass under two names", True),
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
    ('COMBAT ENTRY',  ['node', 'gates/combat_entry_gate.js'],
     'THE DOOR IS THE FIGHT (RF4-C first deliverable, 8/17): demo row 1 said the walked surface has NO COMBAT '
     'ENTRY POINT -- verified, all five "combat" occurrences in the city world were comments or CSS -- while the '
     'V66 BOHEMIA_ENCOUNTER bridge had been finished and driven by the run for weeks. The city simply never called '
     'it. This boots the alpha, opens the walked surface the way his thumb does, WALKS A BODY THROUGH A REAL DOOR '
     'via the shipped inEnter, and requires a real fight to assemble and then put him back on the block he was '
     'standing on. Mutation-tested against ITSELF: an earlier version drove the trigger by hand and stayed green '
     'when the door was unhooked, which is the exact present-and-dead blind spot it exists to catch', True),
    ('FIGHT MOVES YOU', ['node', 'gates/fight_moves_you_gate.js'],
     'THE FIGHT HAS TO MOVE YOU (Paolo 8/15, LOCKED, demo-critical): "there\'s no movement whatsoever and I hate it". '
     'His law names its own test and asked for this gate by name -- play a fight from ONE SPOT and require it to FAIL. '
     'It plays the real fight in a real browser with one policy and two arms: never-moves must clear ZERO, allowed-to-walk '
     'must still clear most, and the walking arm is scored against a CONTROL running the old infinite-ammo world so that '
     'scarcity making fights unwinnable (rather than unstandable) also goes red. Every call is the shipped function -- '
     'dryNow, doReload, doSwap, spendRound, pickTarget, dropRounds, worldShift -- because a gate that reimplements the '
     'maths marks its own homework. Mutation-tested: full magazines at the bell clear 8 of 12 from one spot and take it red', True),
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
    ('CLOTHES 4X',     ['node', 'gates/clothes_4x_gate.js'],
     'every garment and hairstyle keeps its proportions when the rig doubles, on all 8 facings -- '
     'and not one pixel of the 56 wardrobe he plays today moved (1,744 pinned hashes)', False),
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
    ('ZOOM IDENTITY',  ['node', 'gates/zoom_identity_gate.js'],
     'the game must OPEN at a zoom where people are still people. Every claim this '
     'lane has made about telling thirteen factions apart was measured at 112px, one '
     'of the FOUR sizes the city draws a body at. Measured on the rungs below it: the '
     'closest pair is 0.036 at 112, 0.0150 at 56 and 0.0144 at 28 -- and the gap that '
     'once ACTUALLY failed was 0.014. Identity does not survive being zoomed out, and '
     'no coat fixes a 25px body. So this does NOT fail on the limit (a gate red on '
     'physics gets switched off, and takes the real checks in the same file with it); '
     'it fails on LOSING THE GOOD RUNG -- `let HC=44` maps to 112, and one character '
     'dropping it under 32 would quietly turn the whole cast back into crowd with '
     'nothing going red. Reads the ladder out of the city source rather than '
     'restating it, so it cannot pass by agreeing with a drifted copy', False),
    ('LOOP SEAM',      ['node', 'gates/loop_seam_gate.js'],
     'no animation jerks once a bar: a cyclic clip whose LAST rendered frame does not '
     'lead back into its FIRST snaps at the wrap forever. Scored as a RATIO -- pixels '
     'changing at the wrap over the biggest change between any two neighbouring frames '
     '-- so `run` is not called broken for moving a lot. TWO EARLIER RULERS WERE WRONG '
     'AND BOTH LOOKED FINE: hand travel in rig-space claimed 31 clips were broken when '
     '102 of 103 were already fine, and a median denominator gave `run` a ratio of 2617 '
     'because POSEHOLD holds each pose for a whole key so every second step is exactly '
     'zero. It found the one real defect in the game: drunk`s sway ran at HALF the '
     'frequency of every sibling term and flipped sign at the wrap, teleporting the hips '
     '3.5px sideways every two seconds since it was written', False),
    ('FIELD SURGERY',  ['node', 'gates/field_surgery_gate.js'],
     'backlog row FS, his 8/13 order "we\'re gonna need to make animations for this": '
     'three clips for the five-step gunshot treatment he wrote at a bedside. All three '
     'put both hands in the same patch in front of the body -- it is the same wound -- '
     'so they are separated by TIMING and timing is what is asserted: pour is the '
     'stillest, inject owns the fastest single keyframe (the jab), tweeze is the only '
     'thing in the game that trembles. Measured on the HAND off posedSkel, because a '
     'whole-frame pixel diff is dominated by the body settling and reported a loop snap '
     'as "the fastest move". It caught three defects reading could not: the wound was '
     'out of arm reach (thigh 19.1px, arm 16px), the jab was shorter than a keyframe so '
     'it never rendered, and the tremor was sampled exactly at its own zero crossings', False),
    ('OUTFITS 13',     ['node', 'gates/faction_outfit_gate.js'],
     'backlog row SIL, the faction half: all 13 selectable factions have an OUTLINE '
     'of their own, chosen by searching 880 rendered fits rather than by eye, and '
     'the four groups that hide inside other factions deliberately have none. Scored '
     'on the width profile with colour and size discarded, on the same 112 pixels he '
     'sees -- choosing on one ruler and grading on another produced pairs at 0.007 '
     'and four rounds of tweaking the wrong thing. It also holds the INSTRUMENT '
     '(HE MUST BE ABLE TO DIRECT IT, 8/12): WEAR IT, SAVE TO, COLOUR OFF, EXPORT, '
     'because what factions wear is reserved to him by name and a question is not a '
     'tool', False),
    ('CAST SHAPES',    ['node', 'gates/city_cast_silhouette_gate.js'],
     'STRUCTURE-NOT-COLOR (7/19, amended 8/15 to govern IDENTITY) + Paolo 8/3 "have '
     'it not be a copy of me": the six city residents were the player body in the '
     'player clothes under four RANDOM tints, so in greyscale they were six identical '
     'silhouettes -- and the valley is dark, which makes colour the one channel that '
     'cannot carry a cast. Scored on WIDTH PROFILE with colour and size discarded. The '
     'old cast scores EXACTLY 0.000 on all fifteen pairs by construction, so the floor '
     'rejects it absolutely; mutation-tested by making everyone person #0', False),
    ('CITY BORDER',    ['node', 'gates/city_border_gate.js'],
     'the 1px border reached the CHARACTER tab and COMBAT and was still DOUBLED in '
     'the game: the city scales bodies on an integer ladder (EPX x2 at the default '
     'walk zoom HC=44, x4 past 64), so a border baked in at 56 arrived 2px and 4px. '
     'SELF-CALIBRATING: it measures the shipped path AND the exact behaviour it '
     'replaced with the same ruler on the same sprite, so the claim is a comparison '
     '(2->1, 4->1) and not a threshold somebody picked. Measured on the sprite '
     'spriteAt() actually returns, because three attempts to read it off the '
     'composited screen measured the desert and a HUD bar instead', False),
    ('PLAY SURFACE',   ['node', 'gates/play_surface_clean_gate.js'],
     'a friend boots the demo, taps the splash, lands in the game -- and read '
     '"rig sync: waiting for a rig edit" across the top. Not a tab-switching bug: '
     '#syncBadge sits BETWEEN the tab bar and #stage, outside every panel, so it '
     'renders on all sixteen tabs including the one the game is played on. This '
     'checks THE BAND, not the badge -- naming the element would let the next one '
     'land in the same place under a different id -- by reading what is actually '
     'visible after the splash and failing on developer vocabulary', False),
    ('BORDER 1PX',     ['node', 'gates/border_gate.js'],
     'Paolo 8/14: "the black border has to be thinner, like half as thin". CHAR_OUTLINE '
     'always drew ONE pixel and was always correct -- it just ran BEFORE the Scale2x that '
     'takes the frame to 112, so his border arrived DOUBLED. A pass can be right and still '
     'be wrong for WHERE IT SITS IN THE PIPELINE, and no amount of reading it finds that. '
     'Measured against SKIN on the real render path (the naive ruler read 10px off his '
     'black trousers), all 8 facings, plus: ONLY the border moved (every non-border pixel '
     'matches the borderless frame upscaled the same way), the border still CLOSES, and '
     'bake112 agrees so he is not outlined 1px in CHARACTER and 2px in COMBAT', False),
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
    ('FUSED',          ['node', 'gates/fuse_gate.js'],
     'NOT EVERYTHING WAITS FOR YOU (locked 7/1): an event is PLANTED with a fire-turn and a '
     'warning lead, it warns you to pull up, and it fires on its fuse wherever you are. '
     'Reach it in time and you intervene; miss it and you live with it -- same fuse, same '
     'turn, different ending, decided by attention and position. NOT a silent gut-punch (the '
     'warning is clamped so it can never land in the past, even on a fuse shorter than its '
     'own lead) and NOT a cutscene. Nothing ever vanishes: 400 fuzzed histories, every fuse '
     'ends in exactly one terminal state. It rides SUCCESSION\'s own resolve day so the two '
     'clocks cannot drift, and both of his OPEN FORKS refuse out loud by name', False),
    ('SUCCESSION',     ['node', 'gates/succession_gate.js'],
     "Bohemia's SIGNATURE MECHANIC, locked in architecture 7/1 and unbuilt until 8/11: the world "
     'routes around the body. A ROLE stores requirements, never a person, so killing the holder '
     'cannot dangle a pointer; a vacancy is a CONTESTED EVENT decided by weight (what the player '
     'did) rather than silent reassignment or a dice roll; and it PLAYS OUT OVER TIME on a fuse, '
     'resolving on the forward compute while the player is elsewhere. Anti-soft-lock is proved by '
     'FUZZ -- 400 random histories of kills, claims, time and sweeps with zero unreachable states '
     '-- because the addendum names Skyrim radiant quests as the system that ships that bug. The '
     'registry is EMPTY of seats and leaders, and both of his OPEN FORKS refuse out loud by name', False),
    ('MEDKIT',         ['node', 'gates/medkit_gate.js'],
     'THE FIELD SURGERY KIT, and it is five goods and only five. Paolo wrote the procedure '
     'himself at a bedside (8/13, LOCKED): pour povidone iodine cut with sterile water, inject '
     'lidocaine around the wound, sterilise tweezers in boiling water, pick the pellets out, '
     'inject antibiotics. It is the ACTUAL wilderness-medicine sequence, which is why it earned '
     'a law -- and iodine and lidocaine both keep for years, so what survives the crash is '
     'exactly this kit, with injectable antibiotics the scarce link that turns a complete one '
     'into a prize. Tweezers are the only DURABLE. All five price through the ONE existing '
     'scarcity sim rather than a second path built beside it, at his EVERYTHING COSTS ONE, '
     'because that ruling is NEWER than the 8/11 scarcity one and reaches any price anybody is '
     'tempted to invent (the six older goods keep their researched anchors). Every description '
     'is a real written attempt tagged draft:true, because he does not write from a blank page, '
     'he edits. And it proves what is ABSENT: no treat-wound verb, no clip hook, no sound hook, '
     'no skip-a-step dial -- those are RUN\'s, CHARACTER\'s and the sound lane\'s halves of '
     'the same routing, and taking them would break ONE SYSTEM, ONE SESSION. Every assertion '
     'mutation-tested', False),
    ('BANNER',         ['node', 'gates/banner_gate.js'],
     'A MODULE THE SYNC SWEEP CANNOT SEE IS A MODULE OUTSIDE THE ENGINE SYNC LAW, AND NOTHING '
     'SAID SO. The resync scanner finds embedded copies by a ONE-LINE banner, so a banner that '
     'WRAPS is not a formatting nit, it is an opt-out: the module keeps its stale copy, the '
     'sweep skips it, and every gate stays green because a checker that only looks at what it '
     'can SEE reports perfect health on a shrinking sample. It had already happened three times '
     '-- four RUN modules, then agents + population on the city page, and WHEN THOSE TWO WERE '
     'PUT BACK THE SWEEP RESYNCED BOTH IMMEDIATELY: the city was carrying a population module '
     'from before the 8/6 scale correction, describing a 48x48 valley that has been 96x96 for '
     'weeks. This lane was guilty too -- the payday patch wrote "----" banners, so all eight '
     'modules it inlines were outside the law. Ratchet on the four that remain, in pages this '
     'lane does not own. Its own first run was WRONG and said so: it signed modules by their '
     'first long line, which for a dozen of them is a "/* ======" divider occurring 42 times '
     'in one page, so it reported three modules inlined that are not there. A CHECKER THAT '
     'CANNOT TELL ONE MODULE FROM ANOTHER IS THE BROKEN ONE -- and it took THREE wrong rulers, each one confidently wrong: the first long line is a divider, the LONGEST line is often the shared IIFE footer (eight modules came back inlined nine times), and some engine files are BUNDLES carrying others verbatim so a contained module can never have a unique line. Bundles are DERIVED, never listed. It also now proves NO MODULE IS INLINED TWICE, which is how the real bug was found: renaming the payday block ORPHANED the old one, the patch could not see it, and a second stale copy of economy/purse/payday sat LATER in the file and WON at runtime while the fresh one was dead code. Caught only because a good added to the economy was missing from the real page', False),
    ('FRAME BUDGET',   ['node', 'gates/frame_budget_gate.js'],
     'THE FIRST PERF GAUGE IN THE REPO. Demo board row 8: "step latency is gated, render '
     'latency is measured NOWHERE. A perf claim without a gauge is a guess." It was right -- '
     'of ~150 gates, ZERO counted what a finger movement costs on the surface he plays. It '
     'measures FULL REDRAWS PER TOUCH MOVE, a count and not a stopwatch, because milliseconds '
     'are a property of whatever machine the gate runs on while a redraw count is '
     'deterministic and travels -- and the count is what caught the sky P0 (2.1 per move) AND '
     'a fix for it that made things worse (41 for 12). ms is printed as information and never '
     'asserted. WHAT IT FOUND ON ITS FIRST RUN, which is the whole argument for gauges: '
     'pinch-zoom WHILE WALKING costs 2.08 full redraws per touch move at ~23 ms, so about 49 '
     'ms of painting per finger movement, THREE FRAMES at 60 Hz, during the most common '
     'gesture in the game. setHZoom ends in render() and a two-finger pinch dispatches TWO '
     'pointermove events per visual step. Ratcheted at the MEASURED truth rather than a wish, '
     'because a gate red on a known number gets switched off. The fix is deliberately NOT in '
     'THE FIX TOOK TWO ATTEMPTS AND THE FIRST IS WHY THE SECOND WORKED: wrapping the page from '
     'OUTSIDE measured WORSE (3.08), and instrumenting it was flat -- the listener fired 24 '
     'times, muted 24 times, and its stub was called ZERO times, because the page\'s internal '
     'render() calls do not resolve through window.render. A paint can only be coalesced from '
     'INSIDE the paint path. One helper in the page\'s own scope and ONE call site changed: '
     '2.08 -> 1.08, nearly halved, with the zoom still landing on a pixel-true stop and the '
     'mode seam still crossing (both asserted, because a perf ratchet is trivially won by '
     'breaking the feature). AND ITS OWN BLIND SPOT IS WRITTEN INTO THE HEADER rather than '
     'papered over: throttling the zoom\'s paint away entirely is NOT detected -- confirmed by '
     'mutation, twice -- because state assertions pass (HZOOM is still assigned) and a canvas '
     'fingerprint passes. IT CATCHES BOTH DIRECTIONS NOW and that corrected a false claim: an '
     'earlier revision declared paint-stopping undetectable "because the day loop repaints '
     'anyway", and this page renders ZERO times in two idle seconds -- there is no ambient '
     'loop. What was actually missing was COVERAGE, not cleverness: the gate only watched the '
     'view the page opens in, so a cheat in the city view had nothing looking at it. '
     'Extending the gauge to the second view gave it the floor that catches it, mutation-'
     'confirmed in both directions. AND IT COVERS BOTH VIEWS NOW, '
     'which is how the worst number in the game was found: the first version only ever saw '
     'the walked view because that is where the page OPENS, so the CITY BUILDER -- the '
     '"shining jewel", the view he BUILDS in -- had no number at all. When one was finally '
     'taken it was FOUR full redraws per touch move, ~86 ms per finger movement, five frames '
     'at 60 Hz. Its pinch branch called setZoomAt() AND the pan branch and each ended in '
     'render(): the SAME bug the 8/13 P0 named in the sky, sitting in a second place, found '
     'only because somebody finally counted. Now 1.00. A GAUGE THAT ONLY LOOKS WHERE THE APP '
     'HAPPENS TO OPEN IS HALF A GAUGE', False),
    ('SKY TOUCH',      ['node', 'gates/sky_touch_gate.js'],
     'PAOLO\'S P0, 8/13, HIS OWN PHONE: "the zoom out didn\'t work, once I started to leave '
     'the city it kind of crashed." THE WHEEL PATH WORKED THE WHOLE TIME, which is the entire '
     'reason this gate drives REAL TOUCH EVENTS through CDP on an iPhone-shaped viewport '
     'instead of calling functions -- a gate that called skyZoom() directly would have been '
     'green on the broken build, and that is how a desktop-verified feature reached his hand '
     'broken. One root: in SKY, MODE is still "city", so every pointer handler believed it was '
     'looking at the city. Nothing on touch advanced the sky at all (measured: SKYU moved by '
     'ZERO), the pinch branch ran setZoomAt AND the pan branch and each ended in a full N x N '
     'valley redraw (measured: 21 redraws for TEN touch moves at 8.2 ms each, against a 16 ms '
     'frame -- that is the freeze), and a tap at the moon selected an invisible plot '
     'underneath. THE FIX\'S OWN FIRST VERSION MADE THE FREEZE WORSE -- skyZoom ends in '
     'render() and one move is several steps, so stepping it naively measured FORTY-ONE '
     'redraws for twelve moves. The render budget is asserted, not assumed, which is the only '
     'reason that was caught: a gate checking only "does the pinch reach the moon" would have '
     'shipped a worse freeze than the one it was written to fix. All three mutations bite -- '
     'his original bug, that naive fix, and letting the city camera see the gesture', False),
    ('MANDATE FACE',   ['node', 'gates/mandate_face_gate.js'],
     'HE MUST BE ABLE TO DIRECT IT, NOT JUST WATCH IT (Paolo 8/12): the ladder he locked on '
     '6/30 shipped as a module and computed perfectly where nobody could reach it, which is '
     'the exact failure that cost him the quests. So there is a STANDING button on the page '
     'he walks, and this gate RUNS THAT PAGE IN A REAL BROWSER and taps it. It DRIVES the '
     'ladder rather than photographing it: 0 of 16 TERRITORY, warm seven and the card MOVES, '
     'the eighth crosses his ~49% and flips to MANDATE, turn one against you and it knocks '
     'straight back down -- the rung is derived and never stored, proved where he can see it '
     'rather than in a unit test. THAT DRIVING IS THE POINT: the first version read a QS '
     'global that DOES NOT EXIST on the page, failed silently into an empty object behind a '
     'try/catch, and would have shown "0 of 16" forever while looking healthy. A gate that '
     'only opened the card would have passed it. It also holds the refusals, because a UI is '
     'the easiest place to smuggle in canon nobody ruled: the card must never name a faction '
     'as owning the ground (MAP LAW, and who holds which district is his) and never put a '
     'number on the top rung. All three mutations bite, including that original bug', False),
    ('MANDATE',        ['node', 'gates/mandate_gate.js'],
     'TERRITORY -> MANDATE -> MAYOR, locked 6/30 and unbuilt until 8/11: "the more the city '
     'backs you, the easier building becomes, even in areas whose local faction does not love '
     'you". The middle rung has to CHANGE something or it is decoration, so the gate proves his '
     '~49% actually opens a district that hates you. The rung is DERIVED and never stored, which '
     'answers his own third pending -- losing favour knocks you back down by construction, and a '
     'stored rung would sit high forever the first time somebody forgot a demotion rule. MAYOR is '
     'a PSEUDO-mayor and the lore depends on it (formal government failed everywhere; the word '
     'appears nowhere in core canon), and it is a SEAT handed to succession, so the top of the '
     'ladder is killable. Patrol is the faucet and a dark district cannot pay -- and it pays his '
     'ONE (EVERYTHING COSTS ONE, 8/15, which reaches "any future resource price anybody is '
     'tempted to invent", and a per-day take is a yield), so this gate flipped that assertion '
     'from refuse to pay the same turn he ruled it: A GATE MUST NEVER OUTRANK A RULING. Every '
     'number he has NOT ruled still refuses out loud by name', False),
    ('HAZARD',         ['node', 'gates/hazard_gate.js'],
     'THE FLOOR CAN DO SOMETHING TO YOU. Paolo 8/17 LOCKED: "the world has to feel more '
     'alive", routed to WORLD by the RF4 lift because it is TILE TYPES with combat-readable '
     'properties, not combat code. THE MEMBERSHIP IS DERIVED, NOT TYPED: nobody invented a '
     'hazard and nobody placed one -- 62 district generators had been authoring drained '
     'pools, talus aprons, leachate ponds and standing pit water for weeks and NOTHING EVER '
     'TOLD THE GAME ANY OF IT WAS DANGEROUS, so a rule reads each district\'s own LEGEND and '
     '19 tiles in 15 districts came back lethal, loose or wet. The gate MUTATES a legend in '
     'both directions -- rename apartment:8 and the pit stops being a pit; author a drained '
     'pool into a district that never had one and it is lethal that instant -- because a '
     'hand-kept table would sail through every other assertion here. His numbers are asserted '
     'as his (+50% exactly, sprint AND abilities off, the kill outright on the environmental '
     'channel with NO WEAPON allowed near it, which is the fence NO DAMAGE BEFORE THE DIAL '
     'stands on), and FORCED ENTRY KILLS while walking in does not -- his own "knocked or '
     'charging in", which dissolves the how-deep-is-fatal question by making CONSENT the test '
     'instead of depth. His dials stay EMPTY and answer NO_RULING. And it drives a REAL STEP '
     'through the page\'s own metronome onto real hazard ground in the real valley, because a '
     'module that classifies nineteen tiles and never reaches the glass has shipped nothing -- '
     'the running page had already corrected the rule once, failing six tiles the kit called '
     'non-solid and the walked surface blocks', False),
    ('TERRAIN SURFACE',['node', 'gates/terrain_surface_gate.js'],
     'THE GENERATOR\'S OUTPUT IS WHAT HE WALKS ON. gates/terrain_gate.js has been green '
     'since 7/26 on the desert, the mountain and the lake -- the seam, the determinism, the '
     'self-spaced creosote, the OHV tracks, the ghost plat, the bathtub ring. Every '
     'assertion was true and NONE OF IT WAS IN THE GAME: measured on the running page, every '
     'terrain cell in the valley was realized as TEN 2x2 RECTANGLES OF FLAT COLOUR. Same '
     'shape as every other miss this lane found today -- terrain_gate tests the GENERATOR '
     'and nothing asked whether the game called it. So this gate stands ON the seam: it '
     'boots the real page and asks the running valley whether a terrain cell comes back with '
     'its module grid (desert 13 tile types: desert pavement, graded pad, rock lag, dry '
     'rill, caliche, OHV track; wash 13: channel bank, invert, maintenance road, riprap) or '
     'with rectangles. THE ASSERTION THAT MATTERS IS THE SEAM, because it is the one thing '
     'that can break silently: terrain is sampled from ONE valley-wide field in GLOBAL '
     'coordinates, and handing the generator the CELL instead of the 128-tile BLOCK breaks '
     'every seam in the valley WHILE EACH CELL STILL LOOKS FINE ON ITS OWN. Measured against '
     'an AVERAGED control so it cannot flake: a real neighbour agrees 117/128 along the '
     'shared edge, six distant controls average 54.7/128. Mutation-confirmed -- pin the '
     'field coordinate and both collapse to exactly 71/71, identical, no seam at all. It '
     'also proves the DELIBERATELY EXCLUDED types (mountain, water) still take the rectangle '
     'fallback, so the exclusion is a live decision and the fallback is not dead code', False),
    ('FIGHT ROOM',     ['node', 'gates/fightroom_gate.js'],
     'THE FIGHT WAS TOLD THE ROOM IS A RECTANGLE. __CITY_FIGHT__ made the door the fight, and '
     'the handoff it posted to combat described the room as {w, h, zone} -- two numbers and a '
     'label -- because walls as cover and doorways as chokepoints "belong to the teardown '
     'spec, WHICH DOES NOT EXIST". It exists now (8/18), so the seam was the last thing left. '
     'IT IS THE PUREST FORM OF WHAT THE LIFT sec 6 WARNS ABOUT: this lane spent a day making '
     'the floor mean something -- cover you can get behind, ground that kills or slows, a '
     'measured retreat guarantee -- and at the moment a fight starts, combat got a BOX. The '
     'room now rides as one character per cell: floor, cover (chest-high and knee-high as '
     'DIFFERENT characters, because only one of them hides you), the hazard channel, the '
     'doorways as chokepoints, and the retreat obligation MEASURED FOR THAT ROOM. THE LEGEND '
     'RIDES IN THE PAYLOAD so combat never guesses and neither side can silently redefine a '
     'character. The gate asserts the map IS the room he is standing in, cell for cell, '
     'against inPassable() -- the same seam bug that had the occupancy model and the walked '
     'surface disagreeing about 4,327 of 4,327 cells -- and cross-checks the retreat cell '
     'count against the standable cells in the map, two independent counts of one room. Both '
     'mutations bite: flatten cover into one character and it names it; make the map forget '
     'that furniture blocks and it names the coordinates. NOT COMBAT CODE and it decides '
     'nothing about the fight -- WORLD owns making the room legible, COMBAT owns what to do '
     'with it', False),
    ('OCCUPANCY',      ['node', 'gates/occupancy_gate.js'],
     'THE GAME AND THE MODEL MUST AGREE ABOUT EVERY TILE, AND UNTIL 8/18 NOTHING HAD EVER '
     'ASKED. First run, measured on the real page across 40 real district cells: 4,327 of '
     '4,327 walk-through prop cells DISAGREED with the occupancy model, and 0 of 4,327 after '
     'the fix. The kit models prop solidity PER TILE and documents it ("prop: an object '
     'sitting on the ground; SOLID PER ITS SIZE" / "solid = does the tile block a body\'s '
     'cell at grade") and defaults it to TRUE, so every solid:false in a legend is a district '
     'author deliberately saying a body may stand there -- 48 declarations across 41 '
     'districts, in dossiers, held by tilespec_gate and district_kit_gate. The walked surface '
     'threw away all 48 in ONE LINE that never mentioned tl.solid. NO EXISTING GATE COULD SEE '
     'IT because each was checking its own side of a seam nobody stood on: district_kit_gate '
     'holds the model, walkable_gate holds land statistics, tilespec_gate holds the dossier, '
     'and all three were green. So this gate is a COMPARISON and nothing else -- it asserts '
     'nothing about which answer is right for any tile (that is the author\'s call, in the '
     'legend) and only refuses to let the two disagree. Checked in BOTH directions, so "make '
     'everything walkable" is not a way to pass it: both mutations bite. It also holds the '
     'half that made the fix safe -- honouring the flag exposed twelve dead trees and two '
     'hard objects declared walk-through, which would have shipped a player walking through '
     'tree trunks, so A TRUNK BLOCKS is asserted by name', False),
    # REGISTERED 8/20, AND THE THREE BELOW HAD BEEN RUNNING ONLY BY HAND. A gate that is not
    # in this table is a gate nobody runs, which is the same silence it was written to end.
    ('INTERIOR GROUND', ['node', 'gates/interior_ground_gate.js'],
     'THE FLOOR CAN DO SOMETHING TO YOU EVERYWHERE EXCEPT WHERE THE FIGHTS ARE. Interiors '
     'carried NO terrain at all until 8/20 -- an interior cell held g/room/door/role/furn and '
     'nothing else, so the fight payload ground channel was 252 dots for every room in every '
     'fight, and every fight in this game starts by walking through a door. Ceiling rubble '
     'falls where the span is longest and a lift shaft opens in a building that would have '
     'had one, both derived from the room rather than from a rate: a warehouse comes out 7.7% '
     'damaged and a house 2.2% and nobody typed either number. Almost every check is a '
     'REFUSAL (never in a doorway, never under furniture, never cutting the floor in two, '
     'never a hole behind a door, never a lift in a bungalow) and all four mutate red', False),
    ('HAZARD LOOK',    ['node', 'gates/hazard_look_gate.js'],
     'DANGEROUS GROUND HAS TO LOOK DANGEROUS (RF4 lift 2.6: never explain something the floor '
     'could have shown). For three days the floor could kill, slow or amplify and every hazard '
     'tile drew as FLAT COLOUR, with a line of text in the corner as the only tell. This gate '
     'reads the BAKED PIXELS, not the data -- every flag was already correct while the picture '
     'was byte-identical, so a gate asserting "the class is on the cell" would have been green '
     'through a feature that did not exist. Measured on the glass: loose ground is visible by '
     'TEXTURE, a drop by TEXTURE and VALUE, standing water by VALUE', False),
    ('ART ARRIVES',    ['node', 'gates/approved_art_arrives_gate.js'],
     'LOADED IS NOT THE SAME AS ON THE SCREEN, and nothing had ever asked the second question. '
     'His 348 traffic signal sprites were loaded, correct and drawing NOWHERE for weeks while '
     'the check that said "his sprites are LOADED in the browser" stayed green. This counts '
     'the actual draws of every approved pool across 58 renders of the walked surface AND the '
     'city view, hooking every canvas context because street art bakes into per-chunk '
     'canvases. CORRECTED THE SAME DAY: the first version counted the raw approved Image, '
     'but saTex() blits it into a CACHED CANVAS once and returns that, so eight working '
     'pools looked silent on a warm cache -- and it asked SA_MAP (a colour lookup) when the '
     'live door is gArtPool (a pool named on the cell), got a null and reported the street '
     'bank missing from the roads. Measured properly, 52,904 street + 1,262 side cells wear '
     'his bank. It counts REQUESTS now, which no cache and no choice of door can fool. 8 of '
     '21 pools are in use and 13 are never asked for at all, named and ratcheted. It is the '
     'machine the STREETS ARE THE HARMONIZED POOL law (7/31, LOCKED) never had', False),
    ('FURNISH',        ['node', 'gates/furnish_gate.js'],
     'WHAT IS IN THE ROOM, AND THEREFORE WHAT YOU CAN GET BEHIND -- the second half of a '
     'number this lane published the same morning. RETREAT measured the RF4 lift sec 6 '
     'obligation ("a cramped room deletes the entire core verb") and found a clean break: '
     'every plate at 10x10 or under is ONE ROOM with 94% of its floor unable to get out of '
     'sight, and walls cannot fix it because a 6x6 plate is 4.5 METRES SQUARE -- '
     'partitioning a shed to make a gate go green is inventing architecture that does not '
     'exist. Cover at that size is what is IN the room, which the floorplan generator has '
     'carried as the string "furniture per role" in meta.pending since July with nothing '
     'measuring its absence. FURNISHED: stranded cells 9,630 -> 3,053 (-68%) and the break '
     'point 320 -> 224 tiles, ratcheted so it may only come down. THE ONE CHEAT THIS EXISTS '
     'TO STOP is calling a desk cover: only chest-to-head `cover` blocks sight, `low` (a '
     'bed, a sofa, a table) blocks the BODY and never the LOOK because there is no crouch, '
     'and flipping that one flag would pass the retreat obligation everywhere while nothing '
     'changed on screen -- mutation-confirmed, it bites. It also holds the two ways '
     'furnishing BREAKS a room: a piece across a doorway seals it shut (2,722 violations '
     'when the guard is removed) and a racking run across the middle strands the half '
     'without the door (233 plates cut in two). The smallest plates are improved and NOT '
     'claimed fixed, because tuning density until that number went green would be lying '
     'about a shed. REUSE CHECK ended in a warning rather than a shopping list: both '
     'interior banks were opened, decoded and LOOKED AT, and one is a fantasy pack (oak '
     'barrels, burlap sacks, LIVE FLOWERING PLANTS) while the other\'s containers are '
     'glowing sci-fi loot crates -- so nothing is wired from either and the forms are '
     'ART\'s ask, two of them rather than twenty-five', False),
    ('RETREAT',        ['node', 'gates/retreat_gate.js'],
     'A ROOM YOU CANNOT BACK OUT OF HAS NO FIGHT IN IT. The RF4 lift §6 puts a HARD '
     'OBLIGATION on WORLD in his synthesis\'s own words: "if your combat loop requires '
     'retreat, your level generator has a hard obligation to guarantee retreat is '
     'possible... a cramped room deletes the entire core verb". Nothing was checking, and '
     'that failure never announces itself -- every room generates, every gate stays green, '
     'and the fight is quietly worse everywhere. WITH GUNS ON BOTH SIDES DISTANCE IS NOT '
     'SAFETY, LINE OF SIGHT IS (§3 C4), so the question asked from every floor cell is '
     'the gun-native one: can I reach somewhere they cannot see me. Binary, no invented '
     'radius. FIRST RUN FOUND A CLEAN BREAK: 6x6/8x8/10x10 are ONE ROOM every time with 94% '
     'of the floor stranded, and at 20x16 and up every cell of every plan in every zone has '
     'a retreat -- so the obligation is asserted absolutely above the break point and the '
     'break point itself is a ratchet that may only come DOWN. The small plates are named '
     'rather than fixed, and the reason is a ruling: a 6x6 plate is 4.5 m square, so '
     'partitioning a shed to win a number would be inventing architecture that does not '
     'exist. Cover in a small room is FURNITURE, which has sat in the generator\'s own '
     'meta.pending since July and is now a combat requirement with a number on it. It also '
     'holds an assertion I caught myself writing: the first loop check counted cycles on '
     'the CELL grid and passed 54 of 54 because any floor wider than one tile is a mesh -- '
     'it could not have failed. The room graph is measured on DOORS now', False),
    ('TRUNCATION',     ['node', 'gates/truncation_gate.js'],
     'NOTHING STOPS HALFWAY ACROSS ITS OWN CELL: every through-surface reaches the boundary on '
     'both ends of its axis, so the next cell can connect to it. The arterial and the freeway '
     'both laid road across a third of the cell and stopped, and NO existing check could see it '
     '-- a truncated cell is internally consistent, so walkable/tilespec/answered-for all pass. '
     'Found only when Paolo made me render a real top-down grid; on its first run it also caught '
     'an off-by-one leaving a one-tile dirt seam between adjacent road cells', False),
    ('WEATHER',        ['node', 'gates/weather_gate.js'],
     'VEGAS WEATHER, WHICH IS BARELY ANY WEATHER (Paolo 7/28 LOCKED): three states and only '
     'three -- "anyone proposing a fourth weather type is violating this addendum, not '
     'extending it". It rains about once a month, MEASURED over a full year on five seeds, and '
     'a rain day is a short loud monsoon event rather than a grey afternoon. Rain wets the '
     'ground and REVIVES NOTHING (dead foliage is the baseline, not a weather effect), and '
     'weather only ever ATTENUATES the day cycle -- a module returning its own absolute light '
     'would be a SECOND SUN and the two would drift the first time anybody tuned one', False),
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
    ('REROLL',         ['node', 'gates/reroll_gate.js'],
     'HIS BUG, REPORTED LIVE 8/15: "I pressed re-roll the seed button on the run tab and now I '
     'can\'t find the house I\'m supposed to be at." TWO bugs stacked. (1) REROLL replaced the '
     'world and left everything derived from it standing -- new seed, new neighbourhood, and he '
     'never moved: his own front door measured 549 TILES AWAY in a cell he was not in, because '
     'HOME anchors on LANDED and LANDED still pointed into the old valley. (2) And it put him on '
     'the STRIP, which has no houses -- the handler carried a COPY of the exact line '
     '__WORKING_DISTRICT__ names as the 8/2 bug and keeps only as a last-resort fallback. Boot '
     'was fixed on 8/2; reroll kept the dead version because the fix lived in an anonymous IIFE '
     'nothing could call. A COPIED LINE IS A FIX THAT ONLY HALF-SHIPPED. One resolver now, '
     'called from both. This presses the button he pressed FIVE times and demands he lands '
     'somewhere he can live with a house he can find', False),
    ('CITY BARKS',     ['node', 'gates/city_barks_gate.js'],
     'THE WORST REACH FAILURE THIS LANE HAS FOUND: linesFor was called ZERO TIMES in '
     'BOHEMIA_CITY_WORLD.html -- the frame the player looks at when they tap RUN. 244 written '
     'barks and 66 reactions, inlined and correct in that file, and nothing in it had ever asked '
     'for a line; the mouth and its gates all lived in BOHEMIA_RUN_CURRENT, which the RUN tab '
     'does not show. Now the residents on the street speak, and this proves it in PIXELS on the '
     'real path -- because the feature failed FOUR times with everything upstream measuring '
     'perfect: declarations nested inside the draw, a clock that demanded an exact beat on an '
     'I-MOVE-YOU-MOVE surface, a speaker picked by proximity instead of visibility (a bubble over '
     'a roof), and `var g = ctx` in a frame whose context is `g` -- which threw on every call '
     'inside a try/catch that ate it. A CAUGHT EXCEPTION IN A DRAW PATH IS A FEATURE THAT '
     'SILENTLY DOES NOTHING. So the claim is the same frame drawn silent and spoken, and the '
     'pixels must DIFFER', False),
    ('ONE THING THAT IS THEIRS', ['node', 'gates/quirk_gate.js'],
     'Every person in the valley was interchangeable: 58 BUCKET lines (every Blue says the '
     'same five sentences) and 19 player-reactions, and ZERO things belonging to one human. '
     'Tone research R1 finding 1: A CHARACTER NOBODY LAUGHED WITH IS A CHARACTER NOBODY '
     'MOURNS -- the demo kills the sibling and that cannot land in a valley nobody has been '
     'charmed by. R1 named the slot exactly ("what a stranger says when you ask their name is '
     'where Undertale would put the first laugh") and the slot had been shipped and EMPTY '
     'since 7/31. Now 22 shapes x 40 typed nouns = 304 quirks, each authored TWICE AS THE '
     'SAME PERSON: benign violation theory says funny and scary are ONE DIAL (a violation '
     'appraised as SAFE), so the lit register is the joke and the dark one is the same trait '
     'with the safety taken out. *** IT WAS ABOUT TO SHIP BACKWARDS AND ONLY THE REAL SURFACE '
     'KNEW: *** the register asked dayDark() alone, and driving the walked world measured 358 '
     'of 9,216 tiles live (3.9%) and 131 of 5,007 people on one (2.6%) -- 97.4% of every '
     'conversation would have been the DREAD line and the joke would have been unreachable, '
     'with every gate green because every gate asked the same wrong question. A DIAL SOLDERED '
     'TO ONE END IS NOT A DIAL. The fix is the renderer\'s own test (isNight() AND not live), '
     'because an unpowered lot at noon is a lot. Also holds the GRAMMAR CONTRACT (all 608 '
     'renderings: no noun opens a sentence, after the first build shipped "Mine\'s the same '
     'as his was. a slot handle snapped off at the base"), and NOBODY ON A STREET SHARES A '
     'BIT (measured 1.63 duplicate pairs per block -> 0.00, moving only 5.3% of people)', False),
    ('ASKING', ['node', 'gates/asking_gate.js'],
     'The overheard-fact log shipped READ-ONLY: eleven true things about this valley and no '
     'way to do anything with any of them. Q018.W3 THE RUMOR WEB asks for a thread to PULL, '
     'and a thread you cannot pull is a list. Now you can ask somebody about a subject you '
     'overheard, and if their TRADE knows it the thread goes one step deeper into the same '
     'log. SCOPED, NOT COMBINATORIAL: Q047.X1 tells a solo dev to get the effect of '
     'reactivity with templated content rather than volume, and the research agrees hard '
     '(Disco Elysium\'s four call signs alone cost 428 new dialogue cards), so it is 7 '
     'subjects x 2 answers + 4 reusable refusals -- 18 blocks covering 28 combinations, and '
     'this asserts that shape so nobody "improves" it into a content mountain. Every subject '
     'is answerable by TWO trades (Q014.W4 MULTIPLE KEYS) so you never hunt one body; you can '
     'only ask about what you really overheard (Q001.P8); a refusal names a TRADE and never a '
     'place (Q037.W3, the log IS the map); and NOTHING RESOLVES, because what is up the hill '
     'and who owns the tank are CANON and his. It PRESSES THE BUTTON, because the first cut '
     'drew three perfect buttons that did nothing at all -- the patch guard matched a string '
     'the step above it had just inserted, so the handler was never bound', False),
    ('WHAT YOU HEARD', ['node', 'gates/known_gate.js'],
     'The street exchanges shipped with ELEVEN conversations that say something TRUE about '
     'this valley said nowhere else, and the fact went NOWHERE: you overheard it, the bubble '
     'faded, the game forgot. Q001.P8 "reward the listener" asks to gate something behind a '
     'detail only an attentive player caught, and a detail caught then dropped gates nothing '
     '-- that was atmosphere wearing a mechanic\'s coat. Now overhearing WRITES IT DOWN, and '
     'STAYING IS WHAT PAYS: the fact is recorded only when the conversation reaches its LAST '
     'turn and the line quoted is that turn, so walking off halfway means you heard people '
     'talking and learned nothing (measured first: quoting the JOIN turn produced HEARD: '
     '"Where then.", a fact about nothing). It NEVER POINTS AT ANYTHING -- Q018.W3 asks for a '
     'thread to pull with NO waypoints, and MAP LAW agrees, so a row carries a SUBJECT and a '
     'QUESTION and no cell, ever. This walks a real settlement through the one link and '
     'demands the log FILL ITSELF, survive a reload, and be readable on the card he already '
     'opens', False),
    ('STREET EXCHANGE', ['node', 'gates/exchange_gate.js'],
     'Q043.W4 AMBIENT BANTER AS CHARACTERIZATION asks for OVERHEARD RELATIONSHIPS, and the '
     '8/12 bark factory CITES that finding in its own header while shipping 244 lines in '
     'which every single person is talking to NOBODY. A person alone saying a thing is not '
     'a relationship. It was not neglect: measured at every hour of a full day, ONE body '
     'was drawn on the street and never a pair, so a conversation was physically impossible '
     'until the population dial landed. Now two people who are both DRAWN, both in earshot '
     'and standing near each other hold a real conversation and YOU WALK IN ON THE MIDDLE '
     'of it -- every exchange is authored as four turns and entered at turn 1 or 2, so the '
     'opening line is written and deliberately never heard, which is the one craft rule '
     'every source agrees on. This drives the real street through the one link and demands: '
     'two DIFFERENT people speak, nobody answers themselves, no opening line is ever heard, '
     'a pair spends its whole pool before repeating (Q030.X3), no kind is a stub (Q043.X4), '
     'the solo bark still fires when there is nobody to talk to, and THE BUBBLE REACHES '
     'PIXELS -- because `var g = ctx` once threw on the first line of every bark inside a '
     'try/catch that ate it, and everything upstream measured perfect', False),
    ('POPULATION DIAL', ['node', 'gates/population_dial_gate.js'],
     'Paolo 8/1: "the slider can go all the way from zero to a maximum." The PLUMBING shipped '
     'that day -- DIAL, setDial, applyDial, a MIN and a MAX -- and MEASURED 8/16, FIFTEEN DAYS '
     'LATER, NOTHING ANYWHERE CALLED setDial. There was no control, in any tab, at any zoom. '
     'HE MUST BE ABLE TO DIRECT IT (8/12) and he could not. This gate holds the handle open, '
     'and every claim it makes is a bug that was really there: the panel first landed inside '
     '#topbar, whose CSS strips positioning off every child; the dial multiplied a RATE only '
     'bohemia_agents.js ever read, while the city walks peopleIn -> homesIn -> headsAt RAW, so '
     'bodies drawn at dial 0, 1 and 20 measured 1, 1 and 1; PPL_PEOPLE keys on rulesVersion and '
     'setDial never bumped it, so the surface served pre-dial neighbourhoods forever; an '
     'authored spawn neighbour stood in the GHOST VALLEY at dial 0, which the module itself '
     'calls the bottom of the slider being a lie; and a 24-body draw budget made dial 4, 12, 20 '
     'and 32 THE SAME STREET. It presses the button he presses, walks into a settlement, and '
     'COUNTS THE BODIES THE FRAME BLITTED -- 0 -> 6 -> 31 -> 88 across the track -- because '
     'this lane has now shipped five features that measured perfectly and were invisible', False),
    ('DEMO',           ['node', 'gates/demo_gate.js'],
     'DEMO PLAN critical path row 9, the only row with no owner named: "one integration test '
     'that plays the whole day headless + deploy-verified on the real link. THE DEMO IS A '
     'BUILD, NOT A VIBE." dayloop_gate already plays a day, but it plays it in the CITY page '
     '-- and THAT IS NOT THE DOOR. Paolo taps one link and everything he sees comes through '
     'the alpha; every difference between those two surfaces is a place the demo can be broken '
     'with every gate green, and 8/14 found three of exactly that kind in one afternoon. So '
     'this plays it the way he plays it: open the link, tap through TAP TO ENTER, tap RUN, take '
     'the opening, take the job off the phone, live the day to nightfall, read the reckoning, '
     'and check tomorrow is a different job. NOTE THE HONEST GAP: this container cannot reach '
     'github.io (the proxy 403s CONNECT), so row 9\'s deploy half stays MANUAL and DEMO GREEN '
     'does NOT mean the live link is good', False),
    ('OPENING',        ['node', 'gates/opening_gate.js'],
     'THE DEMO PLAN has two critical-path rows for the cold open (7 THE FIRST FIVE MINUTES, '
     '10 THE COLD OPEN SCENE) and neither was done: the runtime shipped 8/9, the scene shipped, '
     'the CUTSCENE tab is gated forty claims deep, and the run booted straight into wakeInBed() '
     '-- that row\'s own FALLBACK -- with ZERO references to the scene runtime anywhere in it. '
     'The demo opened on the fallback for ten days while the real opening sat one tab away. This '
     'boots the alpha, enters through the TAP TO ENTER splash the way a finger does, taps RUN, '
     'and demands PIXELS: the family on screen, a caption saying something, SKIP reachable, and '
     'a way into the day from every exit. It also holds the three ways this is worse than not '
     'shipping (playing over a real save, playing twice, stranding somebody on black) and the '
     'two lies that got past the first cut -- display:flex inside a display:none parent, and '
     'the RUN tab routing to p-city rather than p-run', False),
    ('REACTION REACH', ['node', 'gates/reaction_reach_gate.js'],
     'The reaction lines were written, cited and GREEN while not one person in the game could '
     'say one: the walked run called linesFor(who) with NO ARGUMENTS, so every situation bucket '
     'was unreachable; the frame the RUN tab loads carried a build-old INLINED copy of the '
     'module with no reactions in it at all; and met:lied could never fire because the ledger '
     'discarded the false half of the honesty bit. NONE of that is visible to a gate that reads '
     'files -- and the first version of THIS check grepped the source, survived the mutation, '
     'and had to be thrown away, because a checker that cannot tell a MENTION from a USE is the '
     'broken one (8/1). So it BOOTS THE SURFACE, plants the signals the way the world plants '
     'them (his own DEED_WEIGHT table, loaded from the canon quests\' @DO lines), and asks the '
     'page what came out: seeing beats hearing beats standing beats memory beats the weather, '
     'somebody who was not there learns nothing, and cutting any one wire turns it red', False),
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
    ('CITY MEMORY',    ['node', 'gates/city_memory_gate.js'],
     "engine/bohemia_memory.js is the witness organ -- minds hold sightings, familiarity slows "
     "forgetting, clarity decays as 0.5^(age/halflife) -- and memory_gate has proved all of it green "
     "since 7/19. It was in ZERO player-reachable files, and engine/bohemia_standing.js on top of it "
     "was too: 45 green assertions about people remembering you, and nobody in the game who had ever "
     "remembered anything. The city itself wrote the finding into a comment on 8/18 and nothing acted "
     "on it. This drives the ALPHA, taps the RUN tab, and proves the organ is RUNNING: somebody "
     "witnesses you at boot, a witness is somebody the render actually DREW and inside SEE_RANGE "
     "(measured by placing a body out of range, not by hoping the world provides one), the throttle "
     "never spends a minute it recorded nothing in, recognition fades back to nothing so a stranger "
     "becomes a stranger again, and A RECOGNITION IS NEVER A NAME", True),
    ('CITY DEEDS',     ['node', 'gates/city_deeds_gate.js'],
     "engine/bohemia_deeds.js names this flaw in its own opening paragraph: 'the faction standing got "
     "applied godlike -- the number moved, valley-wide, instantly, and NOBODY HAD SEEN ANYTHING'. The "
     "city was committing exactly that: you answer a claim to somebody's face, BohemiaBelonging moves "
     "a valley-wide number, and not one person in Las Vegas observed a thing. bohemia_standing.js was "
     "built for this input on 8/2 with 35 green claims and had no caller. This proves the ledger is "
     "FED from a real choice on the tab he taps and that what it holds TRAVELS: a claim answered is "
     "witnessed by people actually near (measured by placing somebody sixty cells away, not by hoping "
     "the world provides one), two people together for the module's own 45-minute window swap it at a "
     "hop, it does NOT move before the window, SAW reads differently from HEARD, nobody gossips to "
     "your face, and DEED_WEIGHT is STILL EMPTY because what a deed is WORTH is Paolo's dial. "
     "8/21 CLOSES THE OTHER HALF OF THAT SAME HEADER COMPLAINT -- 'a back-yard handshake and a "
     "public humiliation in front of a whole block are worth the same' -- which stayed true because "
     "every deed took the default reach and hop budget. Each act now carries one of HIS four clout "
     "words, read off the corpus rule he wrote on 7/21 ('CLOUT rides loudness', 'the player does not "
     "pick a clout number'), and reach/hops derive from his CLOUT_WEIGHTS. That table was DECLARED "
     "FOUR TIMES (bohemia_loop plus three slices that retyped it, because reaching the original meant "
     "dragging in 75 KB and six modules) while bohemia_deeds threw an error saying there is no second "
     "copy on purpose; it now lives alone in bohemia_clout.js with no dependencies and everything "
     "READS it, so retuning one number moves the engine, the loop and the walked city together", True),
    ('CITY DIAL',      ['node', 'gates/city_dial_gate.js'],
     "This lane shipped a reputation system over three turns -- people witness what you do, remember "
     "it, tell each other at a penalty per retelling, and forget it as it fades -- with its entire "
     "JUDGEMENT layer, bohemia_standing's DEED_WEIGHT, deliberately EMPTY and waiting on Paolo. "
     "Correct under MECHANISM-MINE/CONTENTS-PAOLO'S. BUT THE ONLY WAY HE COULD FILL IT WAS TO TELL ME "
     "AND I EDIT A FILE, and his own 8/12 law answers that in one line: 'where does he change this "
     "himself? If the answer is he tells me and I edit a file, the system is not shipped yet.' Not "
     "inventing his numbers and not giving him the controls are two different mistakes. The DIRECT tab "
     "now has a STANDING dial: every act in plain words, the consequence spelled out (watched vs only "
     "heard) COMPUTED BY THE SHIPPED MODULE rather than retyped in the alpha, it crosses the frame the "
     "moment he presses so the city is live on it, it persists, it exports as canon, and he can take "
     "it back. The table still ships EMPTY and the gate asserts every declaration of it is", True),
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
    ('WALKED SURFACE', ['node', 'gates/walked_surface_gate.js'],
     "I SPENT FOUR TURNS WIRING PLAYER-FACING WORK INTO A SURFACE HE NEVER SEES. The coordinator "
     "ruled 8/14 that the CITY WORLD is the walked surface and the run slice is legacy -- "
     "preloaded every visit, NEVER DISPLAYED -- and by then this lane had put the sixteen "
     "introductions, the vouch, the bargain and the act on the run's person card. All real, all "
     "gated, all dark. Worse, integration_gate let three rows say INTEGRATED while probing that "
     "file, under a ledger header that had WARNED about exactly this since 8/4: a warning is not a "
     "gate. So this checks the thing the integration probes structurally cannot -- not IS IT "
     "WIRED but IS IT WIRED WHERE HE LOOKS. Which surface he sees is MEASURED in a real browser "
     "rather than read off a document, so if the build flips back the lane is told instead of "
     "guessing. The migration is not a copy-paste and the gate says why: the city's people are "
     "SHIMS with no faction, no household and no job site, so all three organs would port over "
     "inert. The one fact that unlocks them is who somebody runs with, and the bases for it are "
     "the LOOP'S OWN, baked and gated BYTE-IDENTICAL, because deriving a second set would put the "
     "Cartel in two places depending which surface you stand on", False),
    ('FAVOUR',         ['node', 'gates/favour_gate.js'],
     "THE LADDER POINTED AT NOTHING. An outfit could COUNT you and lean on you (the claim) and "
     "could never GIVE YOU ANYTHING -- his sixteen `pays` lines were card text, swept and "
     "confirmed: no ask/request/receive/grant anywhere in engine/. Scott 1972 and Eisenstadt & "
     "Roniger 1984 give the shape -- a patron tie carries LONG-RANGE CREDIT AND OBLIGATIONS, so "
     "it is a RUNNING ACCOUNT, not a trade -- AND HIS CARTEL DOSSIER WROTE THAT MECHANIC ON 8/2 "
     "BEFORE ANY OF IT: 'They want you to OWE them... the first thing they give you is free and "
     "it is exactly the thing you needed that week.' Three economies fall out of his firstMove "
     "axis, which until now only produced one warning row: they-give-first gives from the first "
     "meeting for free and puts you in debt, you-give-first gives nothing until COUNTED and then "
     "SPENDS standing, never gives nothing at any depth. What they hand over is his line BYTE FOR "
     "BYTE across every outfit and no outfit is named in the code. The refusal is a ROW not an "
     "absence, because 'never' and 'not yet' are different facts. And for a wants:debt outfit the "
     "act and the favour are ONE GESTURE -- taking their help IS how you climb -- so one button "
     "fires both halves", False),
    ('CLAIM',          ['node', 'gates/claim_gate.js'],
     "MEMBERSHIP WAS ALL UPSIDE. The ladder (8/12) and the wall (8/15) both model what YOU do "
     "to THEM -- you could be COUNTED by the Church and they would never once ask you for "
     "anything. Portes 1998's second dark side of social capital is EXCESS CLAIMS ON GROUP "
     "MEMBERS, the half no faction system builds: being inside is a relationship that makes "
     "demands, and refusing costs the standing that made you worth asking. So once an outfit "
     "counts you it asks, for the thing IT already wants (his 8/2 canon, read never invented); "
     "saying YES buys NOTHING because meeting an obligation is the rent not a ladder, and that "
     "asymmetry is the first thing a kind edit would break; saying NO drops you below COUNTED by "
     "an amount DERIVED from the shipped rungs. Gouldner 1960 is why it has a clock and not a "
     "price -- an unanswered claim ages in public. The ration is BOH_RESOLVE.makeRation, APPROVED "
     "7/26 and unadopted until now, proven adopted by deleting the dependency and demanding a "
     "refusal; its LIMITS stay [PENDING Paolo] (verdict item c) so the surface passes {} and the "
     "pipe runs without refusing yet. FIVE BUGS IT FOUND: the ration was one per PROCESS so a "
     "second save started with the week spent; the save was looked up by the DISPLAY LABEL not "
     "the id (the three-spellings class, sixth time); I hand-edited a GENERATED file and the "
     "belonging gate silently wiped it; and TWO OF THESE CLAIMS WERE THEMSELVES THE BROKEN ONE -- "
     "one grepped a faction name out of a COMMENT, one asserted a design that was never the "
     "design. Both fixed at the ruler, never the target. *** EXTENDED 8/18: THE DEBT GETS "
     "CALLED IN. *** The favour (8/16) opened an account and NOTHING EVER COLLECTED IT -- his "
     "Cartel canon had a hook and no line. Now owing an outfit BYPASSES the weekly ration "
     "(the bypass slot Paolo approved 7/26 and nothing had ever called: the limit models "
     "restraint and a creditor has none), refusing costs one extra rung PER UNPAID FAVOUR "
     "(counted at 6, owing 3, refuse -> 2), and MEETING a claim works one off, because a debt "
     "you can never clear is a sentence not a relationship. The card says THEY ARE NOT "
     "WAITING so the player can trace it to the free thing they took. Neither organ touches "
     "the other's save -- a number in, a number out, asserted", False),
    ('OPENS ON THE GAME', ['node', 'gates/front_door_gate.js'],
     "WHAT HAPPENS TO EVERY PERSON WHO IS EVER HANDED THE LINK, and nothing checked it. "
     "Demo board ROW 7 ('the cheapest big win on the board') was fixed -- the splash tap taps "
     "the real RUN tab, which is the only path that also builds the city iframe, sends the "
     "player, sends the cast, restores the save and pushes prefabs -- and "
     "window.__OPENED_ON_THE_GAME was set by the alpha and READ BY NO GATE IN THE REPO. A LAW "
     "WITHOUT A MACHINE GATE IS NOT ENFORCED, on the single most important interaction in the "
     "product. *** AND THE BOARD READ THE SOURCE AND GOT THE OPPOSITE ANSWER. *** Re-audited "
     "8/20, it still lists ROW 7 as OPEN and 'five days flagged, unmoved', citing the static "
     "markup <div class=\"tab on\" data-p=\"char\"> at ALPHA:1012. THAT MARKUP IS STILL CHAR "
     "AND THE RUNTIME OVERRIDES IT on the splash tap, which is the only gesture a player can "
     "make. Measured: tap the splash and the active tab is RUN, the active panel is p-city, "
     "the city iframe exists with a real box (not the 0x0-inside-a-hidden-parent trap the "
     "alpha's own comments describe), and the screen offers DAY 1 and GET UP. Zero errors. "
     "VERIFY ON THE REAL SURFACE (7/18): a source-read is not a measurement, and here the two "
     "disagreed completely. Both mutations bite -- delete the runTab.click() and five claims "
     "go red, rename the RUN tab and six do", False),
    ('TOOL IDEMPOTENT',['node', 'gates/tool_idempotent_gate.js'],
     "THE LOUD FAILURES WERE THE SAFE ONES. Backlog P-N has said since 8/4 that ~60 city "
     "patch tools reach for the dead CITY_B64 key and crash, and filed THE CRASHERS as the "
     "problem. Measured 8/21 by RUNNING all 63 with the tree hard-reset after each: 52 "
     "crash, 9 no-op correctly, and 2 actually run -- and the two that run are the hazard. "
     "TWO STATIC COUNTS GOT IT WRONG FIRST (63, then 61), because referencing CITY_B64 is "
     "not the same as breaking on it; bohemia_city_module_resync was in BOTH broken lists "
     "and runs perfectly. A CLASSIFIER THAT CANNOT TELL A WORKING TOOL FROM A BROKEN ONE IS "
     "THE BROKEN THING. cast_patch printed 'wrote ALPHA + CITY', exited 0, and DELETED 63 "
     "LINES to add 9 -- what it deleted was an authored block a LATER patch added (SIX "
     "SHAPES NOT SIX COLOURS), because a tool that cuts its own previous bake is correct "
     "until the block in the file is NEWER than the one it carries, and then re-running it "
     "is a silent REGRESSION rather than a crash. hero_wire wrote byte-identical content "
     "every run and still printed '69 district heroes wired', a success line over an "
     "unchanged file. Both are fixed and both were RED here first. It runs only the 11 "
     "tools that execute (a crasher cannot damage anything) and REFUSES TO MEASURE ON A "
     "DIRTY TREE so a stranger's uncommitted work is never reported as a tool's damage. "
     "Best lead on the 1,159 lines that vanished from the city the same day and were never "
     "reproduced -- named as a lead, NOT as the cause", False),
    ('ORGAN REACH',    ['node', 'gates/organ_reach_gate.js'],
     "TEN TIMES IN ONE WEEK, IN ONE LANE: AN ORGAN COMPUTES SOMETHING AND NOTHING ON THE "
     "WALKED SURFACE CALLS IT. give(), the uncollected favour, the cost that cost nothing, "
     "the ladder with no rungs, neglectFor, the count asked to remember, askOutcome, three "
     "third-party name conditions, tertius, and the Colorful's onward. NINE OF THE TEN WERE "
     "FOUND BY TRIPPING OVER THEM, because it never shows up as a crash: the organ is "
     "correct, its unit test is green, ITS OWN GATE IS GREEN, and the feature does not exist "
     "for the player. This sweeps every exported function of the faction modules and tiers "
     "its reach -- the page he walks, another module, only a gate or tool, or NOTHING -- by "
     "shelling out to tools/bohemia_organ_reach.js rather than re-implementing it, because a "
     "second copy of a sweep is two opinions about one repo. FOUR RULES, AND THE ALLOWLIST IS "
     "CHECKED IN BOTH DIRECTIONS SO IT CANNOT ROT: nothing-anywhere is a defect with no "
     "exemption possible; off-the-surface needs a WRITTEN REASON so 'built for the machine' "
     "and 'built and forgotten' stop looking identical; a declared helper that LATER GETS "
     "WIRED must be deleted from the list; and an entry for a function that no longer exists "
     "is rot. Rules 3 and 4 are why this is a gate and not a checklist -- an allowlist "
     "checked in one direction is a place to hide things. IT CAUGHT ITS AUTHOR TWICE ON ITS "
     "FIRST RUN (a reason too thin to be a reason, and states() called off a require() "
     "expression the sweep cannot see -- an organ the sweep cannot see is one somebody "
     "deletes as dead in six months). It inherits ONE blind spot deliberately and says so: "
     "BohemiaTies is handed to whoHears AS A VALUE, so a textual count cannot see its "
     "methods -- the first sweep called the whole module dead and was COMPLETELY WRONG, and "
     "a claim here fails if that INJECTED flag ever stops being reported", False),
    ('FACTION ARC',    ['node', 'gates/faction_arc_gate.js'],
     "NINE GATES COVER THIS STACK AND EVERY ONE OF THEM VERIFIES A LAYER -- the organ "
     "clamps, the card displays, the rule derives, the save round-trips -- and every one "
     "was GREEN while the stack was broken, four separate times: factionOf was not a "
     "function so ZERO of 166 people ran with anybody for thirteen days (8/15); "
     "BohemiaCommitment.give() was called ZERO times on the walked surface so nine presses "
     "took you to 9 against a ceiling of 5 (8/18); the favour opened an account and NOTHING "
     "EVER COLLECTED IT (8/18); and `burned` said 'you cost yourself somewhere else to be "
     "here' while nothing anywhere cost you anything anywhere else (8/19). THE ORGAN WAS "
     "VERIFIED AND THE WIRING WAS NOT, four times, and each time the thing that found it was "
     "a person driving the real card by hand. NO CLAIM ANYWHERE PLAYED THE ARC. So this "
     "does: it finds a REAL affiliated person on the REAL city page (no stub, and it FAILS "
     "rather than skips if it cannot, because 'nobody in Las Vegas runs with anybody' is the "
     "exact state the game was silently in) and walks meet -> ask their name -> read their "
     "terms -> do what they want -> hit THE WALL -> take a side -> climb further -> take "
     "what they offer -> OWE them -> get asked. Every step is a real button, in order, and "
     "every step must MOVE something. AND WALKING IT FOUND TWO THINGS ON THE FIRST TRY. (1) "
     "The card is opened by TALK and closed ONLY by GO: ctVerb runs on every render and "
     "never asked whether the open card's person was still there, so you could walk the "
     "whole valley with somebody's card up and their buttons live -- and waking up MOVES THE "
     "PLAYER (day 1 me [10246,2268], day 2 me [10293,2248]) while they stay where they live, "
     "so every day rollover left a card open on somebody forty cells away. Same family as "
     "the 8/18 wall: a control on screen that does not do what the screen says. There it "
     "could not move anything; here it moved the WRONG PERSON'S standing. (2) Turning up is "
     "ONCE A DAY by design, so the walk sleeps and goes back to find them -- a gate that "
     "hammers one day is testing a game nobody plays. HONEST LIMIT IN ITS OWN HEADER: B5 "
     "cannot tell the clamp from the button suppression because either alone stops the climb "
     "at the ceiling, so removing BOTH is the mutation that was actually run; the clamp "
     "alone is proved by commitment_gate Ez6. And the probe's own first draft read "
     "sv.meta.owed directly and reported 0 while the real debt was 6 -- the three-spellings "
     "bug, seventh time in this lane, written by the person who fixed the other six. *** AND "
     "THEN WALKING THE OTHER ECONOMIES FOUND A THIRD SURFACE LIE. *** The arc first walked "
     "the Cartel (they-give-first, wants:debt) which is 4 of 16 outfits; the other twelve had "
     "never been driven. On a real Colorful member: NO BUTTONS AT ALL, and either side of "
     "\'NOTHING TO PRESS\' the card printed \'1 MORE TO SOMEBODY WHO SHOWED UP\' and \'5 MORE "
     "AND TURNING UP STOPS WORKING\'. One more WHAT? Third time this week the same disease: a "
     "surface describing a mechanism the player cannot reach. AND THE MISSING ACT IS NOT THE "
     "BUG -- two outfits want `character` and his own dossiers say why there is no button: "
     "THE COLORFUL \'to know whether you are safe to be around ... it never stops running\', "
     "THE SOCIAL FORCES \'recruits who are frightened, they approach AFTER something bad has "
     "happened to you\'. CHARACTER IS NOT SOMETHING YOU DO, IT IS SOMETHING THEY READ OFF "
     "YOU, so a prove-your-character button would be inventing canon in the two places he was "
     "most careful. The entry stays missing and the CARD stops promising a climb, saying the "
     "real rule instead. The distinction is the whole fix: noActBecause already separates a "
     "PERMANENT absence from a TEMPORARY block, and only the permanent one silences the "
     "ladder. Both mutations bite -- restore the false ladder and C1-C3 go red, silence "
     "everybody\'s ladder and B6 does", False),
    ('CARD FOLD',      ['node', 'gates/cardfold_gate.js'],
     "THE PERSON CARD BECAME THE PHONE. Five systems write rows onto it now (the name, the "
     "bargain, the wall, the claim, the favour) and nobody owned the total: MEASURED at iPhone "
     "portrait, 22 rows and 808px of an 844px screen -- 96%% -- and the sixth system overflows "
     "it. Nielsen 2006 (progressive disclosure) and Cowan 2001 (the real working-memory limit is "
     "about FOUR chunks, not seven) give the rule, but the DATA gives the answer to WHAT folds: "
     "THEY WANT / THEY HOLD / PAID IN / CAREFUL are IDENTICAL on every member of that outfit "
     "forever, so they are a fact about the OUTFIT and you read terms once -- re-printing them on "
     "the ninth Church member is wallpaper with a high word count. They fold the moment you have "
     "any standing at all (gave > 0), which is exactly the moment you have demonstrably already "
     "acted on those terms: read off state that already exists, so NO new save field and NO new "
     "dial. 96%% -> 84%% at the busiest state the game can reach. THE TWO THINGS A NAME-GREP "
     "CANNOT DO and this does: it MEASURES THE REAL CARD IN A REAL BROWSER at 390x844 against a "
     "real affiliated person with no stub, and it PROVES NOTHING WAS DELETED -- progressive "
     "disclosure is DEFER, never DROP, and unreachable information is this repo's own named "
     "disease (the 8/9 authored-but-unread gate, written by this lane). All nine claims are "
     "mutation-proven: killing the fold reds four, turning DEFER into DROP reds the one that "
     "exists for it, restoring the duplicate row reds the last. A first meeting still shows the "
     "terms in full because you cannot have read what you were never shown, and the next card "
     "opens folded again so one tap never changes the rule. *** AND THEN THE REAL SURFACE "
     "CAUGHT WHAT NINE GREEN CLAIMS COULD NOT. *** All nine passed while the tap target was "
     "153x14px: every one of them opened the fold with .click() or an element tap, which "
     "lands DEAD CENTRE every time, and a thumb on a real phone does not. Apple's HIG has "
     "said 44x44 since 2013 and Material says 48dp for the same physical reason -- a "
     "fingertip contact patch is about 10mm. The whole ROW is the target now (332x46) and "
     "A10/A11 measure the BOX on a real touch page and open it with a REAL TAP, because THE "
     "HANDLER IS BOUND and A PERSON CAN REACH IT ARE DIFFERENT FACTS and only one of them is "
     "the game -- a synthetic click is the touch-target equivalent of a gate that mocks the "
     "thing it tests. Cost 2 points of screen (84%% -> 86%%), which is the correct trade. "
     "Two other things only the rendered pixels caught, both after the gate was green: the "
     "fold said \'tap to read THE REST\' one row under the Cartel\'s \'HOW YOU GET THE REST "
     "-> NOTHING. EVER.\', and the commitment row was labelled \'YOU HAVE\' four rows under "
     "\'YOU HAVE MET\' so it read as a truncated duplicate. Neither row is wrong on its own; "
     "both collisions exist only once they are neighbours", False),
    ('COMMITMENT',     ['node', 'gates/commitment_gate.js'],
     "A LADDER WITH NO WALL IS A PROGRESS BAR. The 8/12 ladder went stranger to inside and you "
     "could climb all of it by pressing one button ten times, and no other outfit ever heard. The "
     "clamp that stops it had been sitting in bohemia_resolve APPROVED BY PAOLO SINCE 7/26 with "
     "ZERO CALLERS for twenty days; this ADOPTS it rather than writing a second one, proven by "
     "deleting the dependency in a child process and demanding a refusal -- every other check would "
     "pass with a private fallback clamp. Every ceiling is DERIVED from the shipped RUNGS (each "
     "commitment buys exactly one more rung); the only real number is what neglect costs and it is "
     "1 per stage, tagged, under EVERYTHING COSTS ONE. Committing is VISIBLE: word walks the "
     "acquaintance graph to outfits with a line to this one, as fact at one hop and rumour beyond, "
     "and the gate asserts the THEOREM that every bridge across a faction line is cross-cutting "
     "(a faction focus cannot bridge itself) because the first landing rule had a branch for the "
     "opposite case that could never fire. AND THIS IS WHAT IT FOUND: the city carried a 7/29 "
     "snapshot of bohemia_agents whose faction half was written 8/11, so factionOf was not a "
     "function, and this lane's own bare catch turned that into 'nobody in Las Vegas runs with "
     "anybody' -- ZERO affiliated across 166 people and all 14 bases, silently, for thirteen days. "
     "walked_surface_gate never saw it because it STUBBED ctFactionOf: a test that mocks the broken "
     "thing cannot see that it is broken. D3a and D10/D11 lock the measured valley so it can never "
     "quietly fall to zero again. AND IT IS CALLED COMMITMENT BECAUSE I FIRST CALLED IT "
     "STANDING AND OVERWROTE engine/bohemia_standing.js -- the PEOPLE lane's 8/2 witness "
     "reputation organ, gated 35/35, commit titled WORD TRAVELS -- along with its gate. "
     "Restored from git the same turn. My reuse check swept for a CALLER of makeCeiling and "
     "never asked whether a module for this already existed. The two now coexist with the "
     "boundary written into both: standing is what people THINK of you from deeds they SAW; "
     "commitment is how far IN you are with an outfit. *** EXTENDED 8/18: THE WALL WAS A SIGN "
     "AND NOT A FENCE, FOR THREE DAYS. *** BohemiaCommitment.give() -- the clamp this whole gate "
     "exists to prove -- was called ZERO times on the walked surface. The act button went "
     "straight to BohemiaBelonging.record(), which has no ceiling at all: measured on the real "
     "card, nine presses reached gave 9 against a ceiling of 5 with the state still 'none' and "
     "the row still reading COUNTED. You walked through the wall while the card told you it was "
     "there. WHY THE EXISTING CLAIMS MISSED IT is the part worth keeping -- part A proved the "
     "organ clamps (true, and nothing called it) and part D proved the card DISPLAYS the wall "
     "(also true). NO CLAIM ANYWHERE PRESSED THE ACT BUTTON PAST THE WALL ON THE REAL SURFACE. "
     "Same shape as the stale-agents outage one level down: the organ was verified, the wiring "
     "was not, and 'the card shows the right thing' was mistaken for 'the thing is enforced'. "
     "Fixed belt and braces -- the button is not offered at the wall (a button that does nothing "
     "tells the player the wall is soft) AND both writers go through ONE clamped helper so a "
     "third caller cannot quietly reopen it. AND THE FIRST VERSION OF THIS CHECK WAS ITSELF A "
     "LIE: hiding the button did all the work, so it passed with the clamp gutted. Ez6 presses "
     "the writer directly with no button in the way, and it was mutation-proven by gutting the "
     "clamp and watching exactly that claim go red. *** PARTS G AND H, 8/19: THE STAGE "
     "CALLED `burned` HAS SAID \'YOU COST YOURSELF SOMEWHERE ELSE TO BE HERE\' SINCE 8/15 AND "
     "NOTHING EVER COST YOU ANYWHERE ELSE -- adjust() was only ever called on the outfit in "
     "front of you, while whoHears walked the graph and the card printed WHO WILL HEAR and "
     "then nothing happened to any of them. Coser / Lipset & Rokkan supply the shape and it "
     "needs NO rivalry table, which is what keeps it legal: a tie to one side is a liability "
     "with EVERY other side, not only declared enemies, and that generalised liability IS the "
     "mechanism by which cross-cutting ties damp conflict. So no outfit is named in the organ "
     "(asserted). A rumour cannot cost you and that is read off LANDING\'s own shipped words "
     "(\'they will not hear exactly what\'); you cannot fall below a stranger; the amount is "
     "the STAGE INDEX, derived like neglect and never typed. Printed BEFORE the button, per "
     "this lane\'s own 8/15 rule 2 -- a cost you find out afterwards is a punishment, a cost "
     "you read first is a decision. *** AND BUILDING IT FOUND SOMETHING MUCH WORSE. *** The "
     "card reported TRADES hearing a Reds commitment through a FACTION focus at one hop, "
     "which cannot happen (F:REDS and F:TRADES do not match). Measured: 298 people in the "
     "valley roster answered to SEVENTEEN NAMES -- bohemia_population numbers people PER "
     "NEIGHBOURHOOD and the roster concatenates every neighbourhood, so \'H1-1\' stood in for "
     "~140 real people across NINE outfits, byKey kept whichever came last and seen[] skipped "
     "the other sixteen. THE SOCIAL GRAPH OF THE VALLEY WAS LARGELY FICTION. Why no claim "
     "caught it is the part that generalises: every who-hears assertion tested SHAPE, and "
     "COLLISIONS ADD EDGES RATHER THAN REMOVE THEM, so nothing ever looked empty. Nobody "
     "asked whether two people with the same name were the same person. The foci were never "
     "wrong (real valley coordinates); only the keys collided, so the fix is four lines "
     "through the keyOf whoHears has always accepted, and engine/ is untouched. AND THE FIX "
     "EMPTIED THE FEATURE, WHICH IS THE FINDING: with real keys nobody hears anything, "
     "because 32 affiliated people live in 32 different buildings and NO TWO OF THEM SHARE A "
     "SETTING AT ALL. I did not widen the tie rule to make it look alive -- that is the same "
     "fiction chosen on purpose. The density dials are his and already flagged. H3 asserts "
     "CONSISTENCY rather than emptiness, so it holds in both worlds. *** AND PART F KILLS THIS LANE'S "
     "OWN NEXT JOB. *** The 8/15 law flagged bohemia_standing's RUNGS and "
     "bohemia_belonging's RUNGS FOR CONSOLIDATION as the last duplicate mechanism in "
     "the lane, and it sat in the handoff as NEXT for four days. IT IS A NAME "
     "COLLISION, and the evidence was three lines above my own flag in my own law: a "
     "table saying the two modules answer different questions. Measured -- they share "
     "ZERO words, standing goes negative and belonging cannot, and fed the same number "
     "they disagree on EVERY input (3 is USEFUL to one and FWU to the other). The "
     "argument that settles it is expressiveness, not taste: you can be INSIDE the "
     "Cartel and still be somebody a given member thinks badly of, both true at once "
     "and both load-bearing, and ONE TABLE CANNOT HOLD THAT STATE. A consolidation "
     "would silently rewrite both systems' answers rather than tidy them. Six claims "
     "fence it, READ-ONLY against the other lane's module because this lane already "
     "overwrote bohemia_standing.js once by accident and renaming their public field "
     "is theirs to decide. A SHARED IDENTIFIER IS NOT A SHARED MECHANISM, AND A FLAG "
     "IS A HYPOTHESIS, NOT A WORK ORDER", False),
    ('BELONGING',      ['node', 'gates/belonging_gate.js'],
     "THE DOOR HAD NOTHING BEHIND IT. Two turns built sixteen ways to learn a faction member's "
     "name and a lock that makes the Mob wait for somebody inside to vouch -- and then you were "
     "through with no reason to want in, no idea what they wanted, no idea what it was worth. Both "
     "halves had been sitting in his dossiers since 8/2, thumbed up and read by nothing: WHAT THEY "
     "WANT FROM YOU and WHAT THEY TRADE/CONTROL, and they are sixteen ECONOMIES, not sixteen "
     "paraphrases of 'help us' (REMNANTS 'Not loyalty. INFORMATION ABOUT THE ROAD... they will pay "
     "in ammunition'; MOB 'you ACCOUNTED FOR. Not loyal, not employed - listed'; VOLUNTEERS 'will "
     "refuse a gift that would make them worth robbing'). Grounded in Lave & Wenger's LEGITIMATE "
     "PERIPHERAL PARTICIPATION: nobody JOINS anything, newcomers do low-stakes work at the edge "
     "and drift inward -- which is what every one of his sentences describes, and the Anarchists "
     "say it outright ('Not sign anything, not join anything'). BELONGING IS NOT STANDING and the "
     "gate proves it by driving a real quest: +6 then +1 is TWO deeds, not seven, and hurting them "
     "is not a step toward belonging. 32 anchors verbatim plus regenerate-and-diff. His OPEN "
     "question (whether the Mob IS the Cartel, the guarantor seat) is carried as PENDING and gated "
     "so nobody answers it. The three-spellings-of-a-faction bug bit for the THIRD time here and "
     "the gate caught it on the real card, not by reading code", False),
    ('TIES',           ['node', 'gates/ties_gate.js'],
     "EVERY PERSON IN THE VALLEY WAS AN ISLAND, which is why three of the sixteen introductions "
     "shipped dead: four of his dossiers ask for a THIRD PARTY (MOB 'a third person supplies it, "
     "and that person is vouching', REMNANTS 'it arrives from somebody ELSE', COLORFUL "
     "'introduced onward to three people') and there was no such thing as a third party anywhere "
     "in the game. Grounded in Feld 1981 (ties form around FOCI -- shared settings -- and "
     "homophily is mostly an OUTPUT of that), and the engine already stamped exactly three foci on "
     "every agent and had never used one socially: the roof, the job site, the outfit. DUNBAR IS "
     "THE CEILING AND IT IS MEASURED, not asserted: below the layer a shared setting acquaints "
     "everybody, above it the graph thins to an expected degree ON the layer (400 in one outfit -> "
     "49.1 against a layer of 50), because otherwise 300 survivors all know all 300. A VOUCH IS A "
     "GUARANTEE, not a flag -- thieves-in-law crowners are guarantors, so the sponsor must be "
     "somebody whose name you already earned AND inside the outfit; four wrong shapes are driven "
     "and all four must refuse. Symmetry is checked on EVERY pair across six real generated "
     "blocks, because hashing an ordered pair gives a one-way friendship that spot-checks fine and "
     "is nonsense. Part D plays the whole Mob story through the REAL DOM of the REAL built run. "
     "HONEST LIMIT, stated everywhere: the roster is one block, so a faction tie across cells does "
     "not exist and is not faked", False),
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
    ('FAMILY ANIM',    ['node', 'gates/family_anim_gate.js'],
     'Paolo 8/11: "The family is looking good. I fuck with it heavy if I could see them do animations that '
     'would be awesome." All four cast bodies ANIMATE, counted as distinct RENDERED frames over real '
     'wall-clock time; the clip picker carries the FULL canon CLIPS list (it shipped with ONE, because CLIPS '
     'is a const and window.CLIPS is undefined); changing the clip changes what they DRAW, not just what the '
     'select says; and they ride the render loop that already owns the 120 BPM phase rather than a private '
     'timer, because two clocks drift. Baked strips, since famPaintBody rebuilds the rig',
     True),
    ('WORN PERSIST',   ['node', 'gates/worn_persist_gate.js'],
     'THE CLOTHES HE PUTS ON SURVIVE A RELOAD. There are TWO wardrobes on this character and only one was '
     'ever saved: G.equipped (the PD layer slots) was in PERSIST.snapshot() since forever, and G_WORN -- the '
     'CLO catalogue, 258 garments / 236 canon, everything the clothes tab and SHUFFLE FIT put on him -- was in '
     'NO SAVE AT ALL. Measured boot to boot: the fit survived a tab round-trip and came back {} after a '
     'refresh, so he dressed the character and got the default PD layers back. frameLookHash has carried '
     'G_WORN since 7/31, so the RENDERER knew about that wardrobe for weeks and only the SAVE did not. Driven '
     'through the real button and a real page reload in one browser context',
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
     'ONE BOSS = ONE LOCK = ONE THING THAT WAS IMPOSSIBLE AND NOW IS NOT, and no two bosses may open the same door. Built 8/7 because Paolo read the ladder and said "THE STRIPPER / THE WRECKER / THE TOLL -- these are the exact same bro" and he was right: three bosses, one verb, sitting there for four days past a 131-check gate that only ever asked whether the list was well-FORMED and never whether two entries were the SAME THING. Holds the locks distinct, forces every lock to be an impossibility rather than a noun somebody owns, keeps the five killed bosses dead, and checks his rulings actually landed. It caught me committing the identical duplicate INSIDE the fix for it on its first run -- and again on the v3 pass, where two bosses shared a verb and eight locks were written as nouns. EXTENDED TWICE MORE on 8/7: he demoted the spare column as slop (so two checks RETIRED with it -- a gate must never outrank a ruling), ruled ACT 3 SLIGHTLY FUTURISTIC / early Night City, and called transport thin (now a seven-boss spine, because the rebuilding research says you cannot have metallurgy without transport networks). 53 candidates, 53 distinct locks, 53 distinct grant verbs, declared a POOL TO CUT FROM. EXTENDED AGAIN 8/7 with PART L, the GDD AUDIT half: I read the ladder against GDD v5 and SEVEN bosses were fighting canon, SIX of them my fault, because I kept inventing locks without checking whether canon had already opened that door. FOUR DIED OF IT, and the headline is that THE VOICE failed approval five passes running because the radio station is already BUILT + LOCKED in the Life-Support Trio, so it was a boss for a capability the valley already has and there was never anything to unlock. THE SPOKE died because the vehicle ladder already STARTS on man-powered bikes; THE RECLAIM because the reclaim plant kept running and is THE survival event of the backstory; THE EXCHANGE because it and THE CREDITOR were the reserved GUARANTOR seat described twice. Four more were REFRAMED rather than killed, and the gate pins the facts canon states into them (2GW at the dam, and water is not the binding constraint because soil and labour are). His two rulings both pass: THE PUMP is act 2 ("this is act 2 fs") and ACT 1 GETS RAIN COLLECTION, so THE CISTERN is boss 17 and its grant is INDEPENDENCE from whoever owns the water rather than thirst, because rooftop rain was illegal in Nevada until 2017 and catching the monsoon is an act of secession. TWO CHECKS ADDED AFTER 85 GREEN CHECKS SHIPPED A FILE WHOSE OWN HEADERS LIED: every act header must spell out a count that matches the rows under it, and no star note may address a boss by ROW NUMBER, because renumbering 56 down to 53 left ten notes pointing at the wrong bosses and the gate had only ever read the tables, never the prose around them. It also holds his lore rulings (3D printed meat is canon so THE VAT has BIOREACTOR CAPACITY as its lock, not animals; plastic pyrolysis is the fuel path and Las Vegas is the oil field; people already come to Vegas so THE MARQUEE only accelerates it) and the TWO KILL-RULES that have now killed thirteen bosses between them: if you cannot name the wall without inventing it there is no boss, and if the grant does not fit on a button it is not a grant. Its act lookup was rewritten 8/7 because it located a boss by its FIRST PROSE MENTION rather than its table row, which silently put two bosses in act 0. He also called bullshit on my shoe research (correctly -- I generalised PU-midsole hydrolysis into every shoe) so THE BOOT died by my own rule, and TWO CHECKS WERE REVERSED on his rulings rather than defended. Earlier ruling kept: BESTING IS NOT KILLING, so every one of the 34 bosses declares a KILL route (you take the thing) and a SPARE route (you gain the person), the gate fails if a spare route is the kill route reworded, and every boss declares one of four grant KINDS because he named gear and customization as the missing ones', False),
    ('RF4 TEARDOWN',   ['node', 'gates/rf4_teardown_gate.js'],
     "Paolo 8/17: \"I really need you to re-create rogue fable four holy shit please.\" THE SEAM FILE the 8/16 RECREATE-RF4-FIRST law demands, because he put TWO CHATS ON ONE SYSTEM: LAB owns the numbered spec and WRITES NO COMBAT CODE, COMBAT owns the implementation and the STATUS column, neither edits the other's. 68 numbered items, each SPECED or BUILT or DIFFERS-ON-PURPOSE, every BOHEMIA-TODAY number RE-DERIVED off the running fight so no status rests on a sentence somebody typed. MEASURED: 320 bodies across 40 arenas, and NINE OF RF4's PILLARS ARE ALREADY BUILT -- cover and line of fire, the environment genuinely fighting back (cover chews away under fire, cars cook off, decks, darkness), field readouts, ranges, target selection, the way out, armor 0 on all 320 bodies so there is no stat mitigation, and juice. THE AUTHORITY STACK IS WHY THIS GATE EXISTS: Paolo captured 83 RF4 tutorial screens HIMSELF, and the 8/17 LIFT law says his research REPLACES ours -- LAB does not re-search RF4, it turns his corpus into the spec. An 8/18 search pass ran anyway because that law had not been read first, so the gate now enforces the four-tier sourcing scheme with his CAPTURE on top, keeps the admission that the re-search was the wrong call, and holds both corrections it forced: RF4-15 wrongly said do not import the resource tax when the law had already ruled TAKE IT because SP is UPSIDE-ONLY, and RF4-10's PP regen number is FLAGGED as possibly an SP fact mis-attributed to PP. It carries his ONE SENTENCE -- RF4 is not a damage game, it is a POSITION game with a damage readout, and almost every system exists to make geometry more powerful than statistics -- and his NINE MACHINES as the build order: the free-movement budget on a GLOBAL clock (a global clock tests timing, a per-use cooldown tests only patience), vision as ONE variable gating FIVE enemy systems, movement asymmetry instead of stat inflation, environmental kills that keep a bad-item run solvable, bounded 50-100% damage variance so breakpoints are plannable, and status effects as TURN DENIAL rather than damage. Plus the six contradictions the law resolved, above all C4: RF4 is melee-and-spell and we are guns, so distance is not safety here -- BREAKING LINE OF SIGHT is our kite verb, cover is our corridor. And the fleet-wide A/B/C teaching register: tell them what they cannot derive, hint at what they could, NEVER EXPLAIN SOMETHING THE FLOOR COULD HAVE SHOWN. It does NOT demand RF4's numbers -- eight enemies a fight is not his ruling and neither is 3-6 -- it demands the divergence stay MEASURED AND DECLARED and goes red when COMBAT lands the encounter curve. It also fails if LAB's diff touches any engine module or slice, if any RF4-NN cross-reference dangles, or if a [PENDING Paolo] fork gets answered by LAB.", False),
    ('SKILL GAP',      ['node', 'gates/skill_gap_gate.js'],
     "RF4-36 is the THESIS row and the last three-star one: 'highly tactical and REWARD CLEVER DECISION MAKING... of equal importance and opposing this, fast, action packed.' Our own diff says the shooter half is real and THE DECISION LAYER is missing, so the honest first move is the one that worked on RF4-14: MEASURE WHETHER THE FIGHT REWARDS DECISIONS AT ALL, rather than add a mechanic and hope. Six policies, the same 24 arenas, the same seeded dice, every one driven through doMove (the path a tap actually takes) so the only difference between arms is the CHOICE. IT DOES REWARD DECISIONS, HUGELY -- standing still and shooting wins 0 of 24 and bleeds ~95 HP a fight -- AND IT IS THE DOOR AND NOT MOTION, because moving in a random direction while shooting well also wins 0. But the headline is a DEFECT: FIRING YOUR WEAPON IS STRICTLY DOMINATED. Monotonic across six arms -- fewest shots wins most and bleeds least, most shots wins least and bleeds most -- because shooting spends the turn (RF4-49, correctly), the win is reaching the way out (V159, his own ruling), and nothing on the board makes leaving harder, so combat is a tax paid for nothing. Pinned here in the same shape as civ5_gate D4: WRITTEN TO GO RED THE DAY IT IS FIXED and be rewritten then, rather than quietly becoming false. TWO COUNTERS WERE BUILT AND CUT THE SAME DAY (denying the step to anyone who can SEE you froze all six policies at 432 refusals of 432 steps; narrowing it to a HELD BEAD was self-reinforcing, since being pinned stops you repositioning which keeps you pinned) -- a fight with exactly one currency cannot reward a second verb, and what a fight is WORTH is economy, not combat. It also carries the three harness bugs found writing it, each of which flattered a different conclusion: calling worldShift directly walked past the player's own door, walking the straight line put the walker's face against the first rock for the rest of the fight, and 'shoot whenever anything is in the pool' is a strawman rather than clever play.", False),
    ('EXPRESSION LINE', ['node', 'gates/expression_line_gate.js'],
     "laws/BOHEMIA_ADDENDUM_RECREATE_RF4_FIRST_8_16_26.md section 5: 'systems are free to recreate, EXPRESSION IS NOT -- never copy a name, a string, an icon, a screen, or the title.' RF4-35 was marked BUILT in the teardown spec on the strength of a sentence in its own diff column and NOTHING IN THE MACHINE HAD EVER CHECKED IT; it was one of four BUILT rows that no gate named, found 8/20 by counting citations. THE HARD HALF IS TELLING A CITATION FROM A NAME: 'Rogue Fable' sits twice inside the shipped combat blob right now and BOTH ARE LEGAL, because they are code comments quoting the source a mechanic came from, which is exactly what the row permits and what the QUEST STUDY LAW asks of every borrowed idea here. A gate that simply grepped would fail the build for honest sourcing, and the obvious fix would be to DELETE THE CITATIONS -- turning sourcing into laundering. So it strips comments first and reads only what a player can actually see (readouts, button labels, visible text), and it proves it can tell the difference ON THE SPOT rather than asserting it: a name planted in a readout is caught, the same name in a comment beside it is not. Paolo 8/1: a checker that cannot tell a mention from a use is the broken one. The forbidden vocabulary is READ OUT of the spec's own citations rather than typed, so the day LAB documents another RF4 name the sweep covers it without anybody remembering.", False),
    ('TOP OF THE DOC', ['node', 'gates/top_of_the_document_gate.js'],
     "Paolo 8/20, third rejection of the combat lane in three days: \"bro i gave you a whole document to play like rgue fable 4 this is not even close. how do i shoot a car?\" TWO answers, and the second one is the gate. FIRST: you cannot shoot a car -- carHeat has exactly two callers, a round of THEIRS that the car you hide behind ate, and your own grenade -- so V170 shipped describing a verb the build has never had, and the gate I wrote for it ASSERTED THE SAME FALSE SENTENCE. SECOND, and it binds every lane: the teardown spec ranks its own 68 rows with STARS and I never counted them. TWO of the TEN highest-priority rows are built; EIGHTEEN of the FIFTY lowest are. Six ships in three days -- movement asymmetry, vision, the encounter curve, the spotter, the open book, the smoke -- all but one an unstarred or one-star row, picked by an internal routing number (the 'machine' order) that is not ranked by how much it changes the FEEL, and called forward motion because every one gated green. A GREEN GATE ON A LOW-PRIORITY ROW IS NOT PROGRESS, IT IS MOTION. And the document had already answered his complaint in our own words: RF4-25 (three stars) says 5 real types exist and none of them read each other, 'the actual answer to why the fight feels flat' -- VERIFIED rather than repeated, because every roster loop in every enemy brain is OCCUPANCY, marked one body per spot, so not one enemy's decision depends on what another enemy IS. So this gate demands that when a lane declares what it does NEXT, that item names a TOP row of the document it is drawn from, or the handoff says IN WRITING why not. It deliberately does NOT demand starred-first full stop, because A GATE MUST NEVER OUTRANK A RULING: Paolo can want a small thing, a row can be blocked by law (machine 8 is, by NO DAMAGE BEFORE THE DIAL), a lane can be paying down a defect. What it makes impossible is building the bottom of the list SILENTLY. Its own T6 went red on first run and caught me misquoting the spec in capitals -- a verbatim quote that is not verbatim is the same defect as a number typed beside a constant instead of read from it.", False),
    ('LADDER GRAPH',   ['node', 'gates/ladder_graph_gate.js'],
     "Paolo 8/13 answered \"DO I BUILD THE PREREQ COLUMN?\" with \"Sure\" and specified it in the same breath: the live menu holds 4 to 6, a prerequisite may be a boss OR a quest, and the big one -- NOT EVERY NODE IS A BOSS, because \"the idea is that its something thats ACQUIRED so it doesnt have to maybe not killing or persuading a particular person like its just a quest.\" So the ladder stops being a numbered line. 53 nodes, 38 PHYSICALLY NECESSARY edges, 8 tiers, acyclic, and every edge carries a one-sentence reason readable off the two rows it connects (you cannot catch rain off a roof you cannot reach; you cannot open a pit without something that goes off; canon says soil and LABOR are the binding constraint so farming waits on the crew). 8 tiers is where 3 acts at Civ 5 era-depth predicted, without being aimed there. AND THE HONEST HEADLINE IS A SHORTFALL THE GATE REFUSES TO LET ME HIDE: physical necessity opens TWENTY doors and he asked for four to six. The tempting move was to invent fourteen more edges until the number matched, which would have meant making fourteen decisions about how his game is played and burying them where they look like physics. STOP PRODUCING names that shape exactly, so the quest gates are EMPTY, the routes table is empty except THE POT (the one node he called a boss himself), the gate FAILS if I declare them, and it fails if the shortfall stops being stated out loud. It also holds his narrative triangle as an UNSOLVED problem rather than answering it with a feature: more than Valheim (which gives none and that is the failure he named), never a cutscene (\"we dont want to be bogged down\"), never an MMO quest log (\"which is bullshit\"). And it holds the rename question open instead of quietly retitling a file he has already judged seven times. Three checks exist because of my own errors writing it: D3 was a TAUTOLOGY on its first write (a ternary whose two branches were the same expression), the prose said twenty-one roots when the tool measures twenty (the third hand-typed number I have gotten wrong in two days, so D3 now reads the spelled-out count out of the prose and compares it to the measurement), and civ5_gate D4 had to be REWRITTEN rather than deleted because the finding it guarded went stale the moment he ruled -- which is the check working as designed.", False),
    ('CIV 5 REF',      ['node', 'gates/civ5_gate.js'],
     "Paolo 8/13: \"do big brain research into civilization five and all of the technologies in the tech tree. This may help you with your goals.\" It did, and not the way I expected. The Civ 5 BRAVE NEW WORLD tree is vendored (81 techs, 130 prereq edges) and MEASURED rather than remembered, and the headline is a held constant: THE CHOICE FAN. At every one of the 81 research steps the number of techs the player may legally take next sits between 3 and 7, median 4, for 91 percent of the game, bottoming out at 1 exactly three times (the opening move and the final two). An era is 2-3 tiers deep and five of eight span exactly 2. Two terminal techs in 81, so no research choice is ever wasted. The era cost step DECAYS 3.17x to 1.45x rather than compounding, and a run takes a FRACTION of the tree: Gunpowder on 15 of 81. MEASURED AGAINST THAT, OUR OWN BOSS LADDER IS A LINE. 53 bosses numbered 1 to 53 with zero prerequisite edges is not an unordered pool, it is a 53-tier chain with a choice fan of exactly 1, and numbering them was a design decision I made without noticing. The act sizes (19/20/14) already fit Civ 5 geometry, so nothing needs cutting; what is missing is the edges, and drawing them is HIS call, not mine. The gate re-derives every number in the record from the data, and the gap table is measured off the LIVE ladder so it goes RED the day a prereq column lands instead of quietly becoming false. It also holds two mistakes I made writing it: I reported a 43 percent units / 43 percent buildings per-era split as a design finding when buildings_enabled is a VERBATIM COPY of units_enabled in 81 of 81 source nodes (a perfect 1:1 match across eight independent eras is a tell, not a result, and the column is deleted rather than carried), and I hand-typed 236 prerequisite edges into the comparison table from nothing at all when it is 130.", False),
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
    ('SUITE HONESTY',  ['node', 'gates/suite_honesty_gate.js'],
     "SILENCE ABOUT AN UNRUN GATE READS EXACTLY LIKE GREEN. A LAW WITHOUT A MACHINE GATE IS "
     "NOT ENFORCED makes this suite the net and 'green or it does not ship' the rule -- and "
     "on 8/19 the WORLD lane measured it running 217 of 382 gates before the container clock "
     "killed it, which this lane then hit twice in one session. Every lane was shipping on a "
     "PARTIAL run and could not tell which part it missed, because a run that trails off "
     "mid-table ends on a pass. THE ROOT CAUSE, MEASURED: the per-gate cap was 1800s and "
     "TOOLS RUN spends all of it (bohemia_district_hero_factory.py takes 31 MINUTES), so ONE "
     "gate ate thirty of the ~fifty minutes a container survives. The verdict is identical "
     "either way -- a timeout is a failure -- so the extra 23 minutes bought nothing except "
     "the last third of the table never running. Now: a 600s cap (the longest HEALTHY gate "
     "measured is 61s, so two orders of margin), a whole-suite budget that makes the run "
     "STOP ITSELF WHILE IT CAN STILL SPEAK, an unrun list printed BY NAME, exit 1 on an "
     "unfinished run because an unrun gate has held nothing, a [n/total] counter on every "
     "line so a killed run's last line says how far it got, and --only so a lane can use the "
     "runner's lock and table check instead of calling gates by hand. A FILTERED RUN NEVER "
     "SAYS ALL GATES GREEN EITHER -- same lie as silence, smaller. This gate RUNS THE RUNNER "
     "in a child process and reads what it actually prints and exits with, because 'the code "
     "has an unrun list' and 'the run says so' are different facts. It drives --dry-run, "
     "which walks the table and executes nothing, so ONE SUITE AT A TIME (7/30) is untouched "
     "for every run that actually runs something. *** AND A SECOND BUG UNDER IT: A TIMED-OUT "
     "GATE WAS NOT ACTUALLY STOPPING. *** subprocess.run(timeout=) kills the CHILD it started "
     "and nothing else, so TOOLS RUN's hero factory KEPT RUNNING after the gate was declared "
     "dead -- caught at FORTY-FIVE MINUTES, burning a core beside every gate that ran after "
     "it, which means every timing downstream of a timeout was inflated by a process nobody "
     "could see. Each gate now runs in its own process GROUP and a timeout kills the group; "
     "proven both ways in a temp dir before the claim was written. *** AND THE ARITHMETIC SAYS "
     "TRIMMING CANNOT CLOSE THE GAP. *** With both fixed the suite ran 236 gates in 2748s and "
     "named the 150 that never ran -- honest, and still unfinished. That is ~11.6s a gate, so "
     "386 need ~75 minutes and a container survives ~50; TOOLS RUN's whole 600s is a third of "
     "a 25-minute gap. So --shard i/n, interleaved so each shard gets a fair mix rather than "
     "one inheriting every browser gate. THE CLAIM THAT MATTERS IS COVERAGE, NOT SPEED: a "
     "scheme that drops or double-runs a gate is WORSE than none because it looks complete, so "
     "the gate counts the union and the multiplicity against a full run instead of trusting "
     "the arithmetic. A sharded run never says ALL GATES GREEN either, and a malformed --shard "
     "refuses rather than quietly running the wrong set. Every mutation bites: swallow the "
     "unrun exit code (A6), restore the 1800s cap (A1), kill the child instead of the group "
     "(A11), drop a gate from a shard (A12), overlap the shards (A13)", False),
]

# THE PER-GATE CAP, AND WHY IT CAME DOWN FROM 1800 (8/19/26).
# Measured: TOOLS RUN runs bohemia_district_hero_factory.py, which took 31 MINUTES
# and then hit the old 1800s cap -- so ONE gate ate thirty of the ~fifty minutes a
# container survives, and the suite never reached the last third of the table. The
# verdict is identical either way (a timeout is a failure), so the only thing the
# extra 23 minutes bought was the rest of the suite not running.
# A GATE THAT CANNOT ANSWER IN TEN MINUTES IS BROKEN AS A SHIP GATE WHETHER IT
# PASSES OR NOT -- every ship in this repo waits behind it. The longest HEALTHY
# gate measured is 61s, so this is two orders of margin, not a squeeze.
GATE_CAP = int(os.environ.get('BOHEMIA_GATE_CAP', '600'))
# and the whole-suite budget, so a run that cannot finish says so ITSELF rather
# than being killed mid-sentence by the container and reading like silence.
SUITE_BUDGET = int(os.environ.get('BOHEMIA_SUITE_BUDGET', '2700'))


# ---------------------------------------------------------------------------
# __THE_SUITE_RUNS_IN_PARALLEL__ -- P0-SUITE FIX 2 (8/20/26, RUN lane).
#
# Fix 1 (the sleeps) took the run from 217/379 in 50 minutes to 258/393 in 45,
# and then the runner's own arithmetic said the truth: ~4129s of work against a
# 2700s budget. NO AMOUNT OF PER-GATE TRIMMING CLOSES A GAP THAT SIZE. What is
# left is 132 gates that each cold-launch chromium and boot a 3.8MB alpha --
# ONE AT A TIME, on a box with four cores sitting idle.
#
# The sweep asked for one warm browser shared by 94 gates. This overlaps them
# instead, which buys the same clock at a fraction of the risk: sharing a browser
# means sharing a page or a profile, and the moment two gates share state the
# suite starts lying in a NEW way -- a gate that passes because another gate
# warmed something is exactly the "green for the wrong reason" disease this whole
# sweep exists to kill. Separate processes stay separate. They just stop queueing.
#
# BROWSER GATES GET A NARROWER LANE, AND THAT IS MEASURED, NOT CAUTIOUS. Earlier
# in this lane's own session one orphaned factory burning a single core made RUN
# BEAT report "one second of wall clock moved the run 3.112 beats, not 2", and
# ZOOM SEAM, WALKED SURFACE and THE CROWD went red in the same run and green when
# run alone. Those gates measure TIME. Oversubscribe the box and they fail for
# LOAD rather than for truth, and A SUITE THAT INVENTS REDS IS WORSE THAN A SLOW
# ONE. So pure gates get all the cores and browsers get half, both tunable.
import contextlib
import threading

_CPUS = os.cpu_count() or 4
JOBS = int(os.environ.get('BOHEMIA_JOBS', str(_CPUS)))
BROWSER_JOBS = int(os.environ.get('BOHEMIA_BROWSER_JOBS', str(max(1, _CPUS // 2))))

_ISBROWSER = {}


def is_browser_gate(argv):
    """DERIVED, NEVER A LIST: a gate is a browser gate if its own file says so.

    A hand-kept list would be right today and wrong at the next gate anybody
    writes -- the same reasoning as the postMessage guard testing for a key
    shape and the door test asking one predicate. Unknown shapes are treated as
    heavy, because the cost of guessing wrong that way is a slower run and the
    cost of guessing wrong the other way is a false red.
    """
    path = None
    for a in argv:
        if isinstance(a, str) and a.startswith('gates/') \
                and (a.endswith('.js') or a.endswith('.py')):
            path = a
            break
    if not path:
        return True
    hit = _ISBROWSER.get(path)
    if hit is not None:
        return hit
    try:
        with open(path, encoding='utf8', errors='replace') as fh:
            t = fh.read()
        hit = ('playwright' in t) or ('chromium' in t)
    except Exception:
        hit = True
    _ISBROWSER[path] = hit
    return hit


def run(argv):
    """A TIMED-OUT GATE HAS TO ACTUALLY STOP, AND subprocess.run DOES NOT DO THAT.

    MEASURED 8/19, and it is the reason the suite was slower than the sum of its
    parts: subprocess.run(timeout=...) kills the CHILD it started and nothing
    else. TOOLS RUN spawns bohemia_district_hero_factory.py, so when the gate was
    killed at its cap the FACTORY KEPT RUNNING -- caught at FORTY-FIVE MINUTES,
    long after the gate that started it was declared timed out, burning a core
    alongside every gate that ran after it. Every timing downstream of a timeout
    was inflated by a process nobody could see.

    So each gate gets its own PROCESS GROUP (start_new_session) and a timeout
    kills the GROUP. A gate that is over is over, including whatever it spawned.
    """
    try:
        p = subprocess.Popen(argv, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                             text=True, start_new_session=True)
    except FileNotFoundError:
        return 127, 'gate file missing: ' + argv[-1]
    try:
        out, err = p.communicate(timeout=GATE_CAP)
        return p.returncode, (out or '') + (err or '')
    except subprocess.TimeoutExpired:
        _kill_group(p)
        out, err = '', ''
        try:
            out, err = p.communicate(timeout=10)
        except Exception:
            pass
        return 124, ((out or '') + (err or '')
                     + '\ntimed out after %ds (BOHEMIA_GATE_CAP) and the whole '
                       'process GROUP was killed. A gate that cannot answer in '
                       'that long is broken as a ship gate whether it would pass '
                       'or not -- every ship waits behind it.' % GATE_CAP)


def _kill_group(p):
    """Kill the gate AND anything it spawned. Without the group kill an orphaned
    grandchild outlives the whole suite (measured: 45 minutes)."""
    import signal
    try:
        os.killpg(os.getpgid(p.pid), signal.SIGKILL)
    except (ProcessLookupError, PermissionError, OSError):
        try:
            p.kill()
        except Exception:
            pass

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
    # __THE_SUITE_RUNS_IN_PARALLEL__ -- the browserless tier (sweep fix 3).
    # 249 of 393 gates never launch a browser; this runs those and nothing else,
    # which is the pre-ship check every lane can afford every turn.
    pure = '--pure' in sys.argv
    # A FAILING SUITE MUST EXIT NON-ZERO, AND FOR MONTHS IT DID NOT (8/20).
    # The exit code was `1 if (failed and strict) else 0`, and --strict was
    # OPT-IN -- so a plain run with NINETEEN CONFIRMED RED GATES exited 0.
    # Measured on this very sweep: 19 GATE(S) FAILED, EXIT=0. Anything reading
    # the exit code -- a script, a CI step, a lane's pre-ship check, `&&` in a
    # shell -- was told the suite passed.
    #
    # AND IT WAS BACKWARDS AGAINST THIS FILE'S OWN RULE. An UNRUN gate already
    # exits 1 ("an unfinished run is not a pass", SUITE HONESTY A6). A gate that
    # RAN AND FAILED exited 0. The weaker signal was treated more seriously than
    # the stronger one, which is the whole silence-reads-as-green disease with
    # the polarity reversed.
    #
    # CLAUDE.md has said "green or it does not ship" the entire time. So red is
    # now the default answer to red. --strict still parses and is now what the
    # suite always does; --lenient is the deliberate, visible way to ask for the
    # old behaviour, and it has to be typed.
    strict = '--strict' in sys.argv
    lenient = '--lenient' in sys.argv
    dry = '--dry-run' in sys.argv
    # --shard i/n
    shard = None
    if '--shard' in sys.argv:
        j = sys.argv.index('--shard')
        if j + 1 < len(sys.argv) and '/' in sys.argv[j + 1]:
            a, b = sys.argv[j + 1].split('/', 1)
            try:
                a, b = int(a), int(b)
            except ValueError:
                a = b = 0
            if b > 0 and 1 <= a <= b:
                shard = (a, b)
        if not shard:
            print('  --shard wants i/n, like --shard 1/2 (1-based). Nothing ran.')
            return 1
    # --only <substring>: run just the gates whose NAME matches. Every lane is
    # already doing this by hand because the suite stopped finishing; doing it
    # through the runner keeps the lock, the deps check and the table check.
    only = None
    if '--only' in sys.argv:
        i = sys.argv.index('--only')
        if i + 1 < len(sys.argv):
            only = sys.argv[i + 1]
    # THE LOCK IS FOR RUNS THAT EXECUTE GATES. A dry run rebuilds nothing, drives
    # no browser and writes no slice, so there is nothing for a second one to
    # corrupt -- and taking the lock would make it unusable from inside a suite,
    # which is the only place it is needed. ONE SUITE AT A TIME (7/30) is
    # untouched for every run that actually runs something.
    if dry:
        return _run_all(fast, strict, only, dry=True, shard=shard, pure=pure, lenient=lenient)
    if not take_lock():
        return 1
    try:
        return _run_all(fast, strict, only, shard=shard, pure=pure, lenient=lenient)
    finally:
        drop_lock()


def _check_table():
    """THE REGISTRY IS THE FLEET'S SINGLE POINT OF FAILURE, so it checks itself.

    Every GATES row is (name, argv, what, slow). Twice in one day a row landed with
    only three -- INSTRUMENTS (MUSIC lane) and VERDICT FROZEN -- and because the
    run loop UNPACKS the row, one bad row does not skip one gate: it raises
    ValueError before a single gate runs and takes down ALL 362, on every lane, for
    everybody. Both times the traceback pointed at the for-statement and named no
    gate, so the cost was a hunt rather than a fix.

    This cannot be a gate of its own -- a gate that lives in the table cannot run
    when the table is broken -- so it runs here, first, and NAMES the row. It is
    also why it does not raise: a malformed row is a typo, and telling the author
    which line to fix beats a stack trace every time.
    """
    bad = [(i, r) for i, r in enumerate(GATES) if not isinstance(r, tuple) or len(r) != 4]
    if not bad:
        # AND NO TWO ROWS SHARE A NAME. Found 8/20 by writing one: a second
        # 'FRONT DOOR' meant --only ran two different gates and the summary line
        # printed one gate's score under the other's name. A name that does not
        # identify a gate is not a name, and every report in this file is keyed
        # on it.
        seen, dupes = {}, []
        for i, r in enumerate(GATES):
            if r[0] in seen:
                dupes.append((seen[r[0]], i, r[0]))
            else:
                seen[r[0]] = i
        if dupes:
            # WARN, DO NOT BLOCK. A malformed row CRASHES the run and has to stop
            # it; a duplicate name only makes the reports ambiguous. Blocking on
            # one would stop every lane in the fleet from running anything until
            # somebody else's rename landed -- a gate outranking a ruling, which
            # this repo has a law against. Loud is enough.
            print('!' * 78)
            print('  TWO GATES SHARE A NAME -- --only cannot tell them apart, and the')
            print('  summary line prints one gate\'s score under the other\'s name:')
            for a, b, nm in dupes:
                print('    rows %d and %d are both called %r' % (a, b, nm))
            print('  Nothing is blocked. Rename one when you own it.')
            print('!' * 78)
        return True
    print('=' * 78)
    print('  THE GATE TABLE IS MALFORMED -- no gate can run until this is fixed.')
    print('  Every row is (name, argv, what, slow). These are not:')
    for i, r in bad:
        nm = r[0] if isinstance(r, (tuple, list)) and r else '?'
        print('    row %d  %-18s has %d field(s), needs 4 -- add the missing `slow` '
              'boolean (False unless the gate is slow)' % (i, nm, len(r)))
    print('=' * 78)
    return False


def _run_all(fast, strict, only=None, dry=False, shard=None, pure=False, lenient=False):
    print('=' * 78)
    print('BOHEMIA GATES')
    print('=' * 78)
    if not _check_table():
        return 1
    deps_check()
    failed = []
    t0 = time.time()
    total = len(GATES)
    unrun = []                 # the whole point: what never got a turn
    ran = 0
    # __THE_SUITE_RUNS_IN_PARALLEL__ -- the work list first, then the pool.
    # THE FILTERS ARE APPLIED EXACTLY ONCE, HERE, and the unrun list is built
    # from the SAME list the run dispatches from. The serial version rebuilt the
    # filter predicate a second time to compute unrun and got it wrong once
    # already (it counted the other shard's gates as unreached); deriving both
    # from one list means they cannot disagree again.
    work = []
    for i, (name, argv, what, slow) in enumerate(GATES):
        if fast and slow:
            print('  %-15s SKIP     %s' % (name, what))
            continue
        if only and only.upper() not in name.upper():
            continue
        if shard and (i % shard[1]) != (shard[0] - 1):
            continue
        # --pure: THE BROWSERLESS TIER (sweep fix 3). A FILTER over what exists,
        # not new work -- 249 of 393 gates never touch a browser. NOT named
        # --fast on purpose: --fast already means "skip the rows flagged slow"
        # in this runner, and silently redefining a flag other lanes already
        # type is how a tool starts lying about what it did.
        if pure and is_browser_gate(argv):
            continue
        work.append((i, name, argv, what))

    results = {}
    lock = threading.Lock()
    dispatched = set()
    stop = threading.Event()
    sem_pure = threading.Semaphore(max(1, JOBS))
    sem_browser = threading.Semaphore(max(1, BROWSER_JOBS))
    # a do-nothing slot, so the pure path is the SAME two-context statement as
    # the browser path and cannot drift out of sync with it
    _NULLSEM = contextlib.nullcontext()
    # A CLAIM IN A COMMENT IS NOT ENFORCED. The line above says total concurrency
    # is now JOBS; this is how a gate can CHECK that instead of taking my word.
    # Off unless a path is handed in, so a normal run writes nothing.
    _trace_path = os.environ.get('BOHEMIA_SUITE_TRACE')
    _trace_lock = threading.Lock()

    def _trace(ev, nm):
        if not _trace_path:
            return
        with _trace_lock:
            with open(_trace_path, 'a', encoding='utf8') as fh:
                fh.write('%s\t%.6f\t%s\n' % (ev, time.time(), nm))

    def one(item):
        i, name, argv, what = item
        heavy = is_browser_gate(argv)
        # A BROWSER GATE TAKES A CORE **AND** A BROWSER SLOT (8/20). The comment
        # above says "pure gates get all the cores and browsers get half", and
        # that is not what the code did: a browser gate held ONLY the browser
        # semaphore, so the box could run JOBS pure + BROWSER_JOBS browser at
        # once -- 4 + 2 on a four-core container. Fifty percent oversubscribed,
        # for exactly the gates that MEASURE TIME.
        #
        # That is the failure this file already warned about in its own words --
        # "oversubscribe the box and they fail for LOAD rather than for truth" --
        # and it kept happening: FIGHT MUSIC ("lands at the top of the next bar,
        # want 2, layers 0") and FIRST NIGHT both came up red in the run and
        # green alone, and the confirm-alone pass paid for a second full run of
        # each to find that out.
        #
        # Nesting is deadlock-free by ORDER: browser takes browser-then-core and
        # pure takes core only, so a pure gate never waits on a browser slot and
        # there is no cycle to close. Total concurrency is now JOBS, full stop.
        with (sem_browser if heavy else _NULLSEM), sem_pure:
            # THE BUDGET STOPS DISPATCH, NOT EXECUTION. A gate already running is
            # allowed to finish and answer; cutting it mid-sentence would turn a
            # real verdict into silence, which is the bug this whole sweep is
            # about. Anything never started is named in the unrun list instead.
            if stop.is_set():
                return
            if time.time() - t0 > SUITE_BUDGET:
                stop.set()
                return
            with lock:
                dispatched.add(i)
            t = time.time()
            _trace('IN', name)
            try:
                if dry:
                    rc, out = 0, ''
                    # TRACE MODE HOLDS THE SLOT ON PURPOSE. A dry gate's body is
                    # a nanosecond long, so two threads would essentially never
                    # be observed inside the box at once and a concurrency
                    # measurement would be a coin flip -- and a flaky claim is
                    # worse than no claim. Tracing is an off-by-default
                    # diagnostic whose entire job is to make occupancy visible,
                    # so in trace mode a dry gate occupies its slot long enough
                    # to be seen. Costs nothing on a normal run: _trace_path is
                    # None and this branch never executes.
                    if _trace_path:
                        time.sleep(0.01)
                else:
                    rc, out = run(argv)
            finally:
                _trace('OUT', name)
            with lock:
                results[i] = (name, what, rc == 0, out, time.time() - t)

    # THE REPORT IS STILL IN TABLE ORDER, AND IT STILL STREAMS. Results arrive
    # out of order because that is what parallel means, and that stays an
    # implementation detail. But a report that only prints once every thread has
    # joined is a report the container can eat WHOLE -- which is THE ORIGINAL BUG
    # OF THIS ENTIRE SWEEP wearing a new costume: a run killed at minute forty
    # would say nothing at all instead of saying how far it got. Caught by
    # watching a parallel run sit silent for ten minutes. So a gate prints the
    # moment it, and everything above it in the table, has answered.
    def emit(idx, nm, wh, okk, outp, secs):
        print('  [%3d/%3d] %-15s %-8s %-30s %5.1fs'
              % (idx + 1, total, nm, 'GREEN' if okk else 'FAIL', wh[:30], secs),
              flush=True)
        sm = summarize(nm, outp)
        if sm:
            print('                   %s' % sm[:88], flush=True)
        if not okk:
            for line in outp.split('\n'):
                if 'FAIL' in line or 'VIOLAT' in line or 'Error' in line:
                    print('                   > %s' % line.strip()[:88], flush=True)

    state = {'nxt': 0, 'ran': 0}

    def drain(final=False):
        with lock:
            while state['nxt'] < len(work):
                idx = work[state['nxt']][0]
                if idx not in results:
                    if not final:
                        break
                    unrun.append(work[state['nxt']][1])
                    state['nxt'] += 1
                    continue
                nm, wh, okk, outp, secs = results[idx]
                if not okk:
                    failed.append(nm)
                emit(idx, nm, wh, okk, outp, secs)
                state['ran'] += 1
                state['nxt'] += 1

    threads = []
    for item in work:
        th = threading.Thread(target=one, args=(item,), daemon=True)
        th.start()
        threads.append(th)
        # Threads are cheap but a thousand pending Popens are not: hold the line
        # at a few times the widest lane so the queue stays a queue, and drain
        # the printer while waiting so output keeps moving.
        while sum(1 for x in threads if x.is_alive()) > (JOBS + BROWSER_JOBS) * 3:
            drain()
            time.sleep(0.05)
    for th in threads:
        th.join()
    drain(final=True)
    ran = state['ran']

    # A RED UNDER LOAD IS NOT A VERDICT YET.
    # Running four gates at once is what makes the suite finish, and it is also
    # what can make a TIMING gate fail for load rather than for truth. Measured
    # on the first full parallel run: CITY BORDER and THE CROWD failed in the
    # pack and passed alone. That is the suite inventing a red, and an invented
    # red is worse than a slow suite -- it is the same class of lie as an unrun
    # gate reading green, pointing the other way.
    # So every failure is RE-RUN ALONE, with nothing else on the box, and THAT
    # is the verdict. It costs one quiet re-run per red (~28 gates, a couple of
    # minutes) and it buys back the one thing parallelism could have taken: the
    # right to believe a red. This is the discipline this lane was already
    # applying by hand all month -- "run it alone to see if it is load" -- moved
    # into the runner so nobody has to remember it.
    if failed and not dry:
        print('  ' + '-' * 74, flush=True)
        print('  CONFIRMING %d RED(S) ALONE -- a gate that failed in the pack may '
              'have failed for LOAD, and the suite may not invent a red.'
              % len(failed), flush=True)
        by_name = {nm: (idx, a, w) for idx, nm, a, w in work}
        confirmed, load_flakes = [], []
        for nm in list(failed):
            ent = by_name.get(nm)
            if not ent:
                confirmed.append(nm)
                continue
            rc2, out2 = run(ent[1])
            if rc2 == 0:
                load_flakes.append(nm)
                # DO NOT NAME A CAUSE YOU DID NOT MEASURE (8/20). This said
                # "WAS LOAD, NOT TRUTH", which is a CONCLUSION about WHY the
                # gate changed its mind, and the re-run measures no such thing.
                # Caught red-handed: during the 8/20 red sweep this line
                # reported eight gates as load flakes when they were green
                # because the tree had been FIXED underneath the run. Load is
                # the usual reason and it is worth naming as a suspect -- it is
                # not a finding. Same disease as every ruler cleared today:
                # claiming something nothing checked.
                print('  %-15s GREEN WHEN RUN ALONE -- not counted (usually load, '
                      'but a changed tree does this too)' % nm,
                      flush=True)
            else:
                confirmed.append(nm)
        if load_flakes:
            # same correction as above: this named a cause the re-run never
            # measured. It reports WHAT HAPPENED and leaves WHY to the reader.
            print('  %d RED(S) DID NOT REPRODUCE ALONE: %s'
                  % (len(load_flakes), ', '.join(load_flakes)), flush=True)
        failed = confirmed
    print('=' * 78)
    if failed:
        print('  %d GATE(S) FAILED: %s   (%.0fs)' % (len(failed), ', '.join(failed), time.time() - t0))
    elif not unrun:
        # AND IT SAYS HOW MANY. "ALL GATES GREEN" after --only ran one gate is
        # the same lie as silence about an unrun one.
        if only:
            print('  %d of %d GATE(S) GREEN -- filtered by --only %s. THE REST DID '
                  'NOT RUN AND HELD NOTHING.   (%.0fs)'
                  % (ran, total, only, time.time() - t0))
        elif shard:
            print('  %d of %d GATE(S) GREEN -- SHARD %d OF %d. THE OTHER SHARD(S) '
                  'DID NOT RUN AND HELD NOTHING; run them to cover the table.   (%.0fs)'
                  % (ran, total, shard[0], shard[1], time.time() - t0))
        else:
            print('  ALL %d GATES GREEN   (%.0fs)' % (ran, time.time() - t0))
    # AND THE HALF THAT WAS MISSING. An unrun gate has held nothing, so a run
    # with unrun gates is NEVER a pass -- it is an unfinished run, and it says
    # so by name and by count rather than trailing off.
    if unrun:
        print('  %d GATE(S) NEVER RAN -- the suite hit its %ds budget with %d left.'
              % (len(unrun), SUITE_BUDGET, len(unrun)))
        print('  NOT GREEN AND NOT RED: UNFINISHED. These held nothing this run:')
        for j in range(0, len(unrun), 6):
            print('    ' + ', '.join(unrun[j:j + 6]))
        # AND IT WORKS OUT THE SHARD COUNT ITSELF, from what this run just
        # measured, rather than leaving the next person to guess. Two shards was
        # MY guess and it was wrong: shard 1/2 owns 193 gates and reached 162.
        done = ran or 1
        rate = (time.time() - t0) / done                 # seconds per gate, measured
        owned = done + len(unrun)
        need = rate * owned
        # THE RATE IS A SAMPLE, AND NOT A RANDOM ONE -- it is whichever gates
        # happened to run before the clock, and the slow ones are clustered (one
        # gate alone is 600s). Measured both ways on 8/19: a full run averaged
        # 11.6s a gate, while shard 1/2 averaged 16.7s because it held TOOLS RUN.
        # So this leaves real headroom rather than dividing exactly, and says
        # AT LEAST. Advice that is optimistic here costs somebody a whole
        # container to find out.
        want = max(2, -(-int(need * 100) // int(SUITE_BUDGET * 60)))
        print('  MEASURED THIS RUN: %.1fs a gate, so this run\'s %d gates need '
              '~%.0fs against a %ds budget.' % (rate, owned, need, SUITE_BUDGET))
        print('  AT LEAST %d SHARD(S) -- the rate is a sample of whichever gates '
              'ran, and the slow ones cluster, so this leaves headroom:' % want)
        print('  ' + '  '.join(
            'python3 gates/bohemia_gates.py --shard %d/%d' % (k + 1, want)
            for k in range(min(want, 4))) + ('  ...' if want > 4 else ''))
        print('  Or run one directly: python3 gates/bohemia_gates.py --only <name>')
    if unrun:
        return 1
    return 1 if (failed and not lenient) else 0

if __name__ == '__main__':
    sys.exit(main())
