# BOHEMIA BACKLOG (the fleet's queue — read via THE GO PROCEDURE)

## *** FLEET-WIDE FREEZE (7/26, ART-FIRST RESET — read laws/BOHEMIA_ADDENDUM_
## ART_FIRST_RESET_7_26_26.md). *** BOTH FREEZES ARE LIFTED AS OF 7/26. ***
## Paolo verdicted the target screen CBB, so the visual constitution EXISTS:
## records/target/BOHEMIA_VISUAL_CONSTITUTION.json, held by
## gates/target_match_gate.py. Every lane may cook new pixels again, and quest
## asks may be surfaced again. THE PRICE: every cook now passes the proxy gates
## (palette ceiling, per-layer value bands, no keyline, no dither, one light
## direction, hashable seam contracts) and every new art bank REGISTERS itself
## in target_match_gate.py's BANKS list. CBB also means the target itself is
## FROZEN and byte-locked - nobody makes another target screen. Verdict record:
## records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt ***

## LAB (THE REFERENCE LAB — first word "lab"; law: laws/BOHEMIA_ADDENDUM_
## THE_REFERENCE_LAB_7_26_26.md. One session = one system = one named game.)
0. [RULED 7/26] THE LANE'S ASSIGNMENT CHANGED MID-DAY. Paolo: "who said I
   wanted to test the walking... it was supposed to be like the actual game and
   all its mechanics... you need to get the code online and implement it for the
   different game mechanics like marriage and fishing in farming". Law:
   laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md — an emulation is
   THREE OR MORE NAMED MECHANICS, each playable end to end, from the real source.
   Movement/camera/collision/lighting are plumbing and can never be a lab
   deliverable again; the gate fails a row that declares one. He also RULED
   Bohemia's movement in the same breath
   (laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md): the world moves
   when you spend time taking an action. That closed LAB-1's open question.
1g. [SHIPPED 7/27 — AWAITING PAOLO'S PLAY] VALHEIM'S COMFORT LOOP, COMMISSIONED BY
   NAME. Paolo: "Next emulation, whole mechanics: VALHEIM'S COMFORT LOOP... I play
   it and then rule Bohemia's survival system off the feel, not off a document."
   slices/lab/BOHEMIA_LAB_VALHEIM_COMFORT_7_27_26.html — the three mechanics he
   named, playable end to end in one small world (meadow camp, forest to forage,
   freezing mountain with a cairn at the top):
     FOOD    three slots, each adding max health AND max stamina for tens of
             minutes; the bonus SHRINKS as the food burns, so your ceiling sags
             instead of an alarm going off; the fourth food is refused; a food can
             only be topped up below half. An empty stomach is 25 health — weak,
             alive, and it never kills you.
     RESTED  20 seconds standing at the fire UNDER A ROOF, then +50% health regen
             and +100% stamina regen. It travels with you and it re-grants for
             free while you are in your own camp.
     COMFORT the one worth stealing: comfort = 1 + the HIGHEST item in each
             CATEGORY within 10 m, and the comfort number IS how many minutes
             Rested lasts (480s + 60s per level). A rug is a minute. A second rug
             is nothing. Decorating your camp literally makes you stronger, and
             the HUD says "comfort 9 = 16 min rested" while you do it.
   THE FIRST **MODEL** ROW, AND THAT IS A NEW THING IN THE MACHINE. Valheim's logic
   ships as a compiled Unity DLL: no source to fetch, every decompiled-source repo
   probed came back 404, and the wikis are 403 at this environment's network
   gateway. So numbers are DOCUMENTED, not read off a line — except two that ARE
   real source, lifted from ValheimPlus's Harmony patches which name the vanilla
   values they overwrite (the 10 m comfort radius, BuildingConfiguration.cs:9, and
   the 60 s per comfort level, PlayerConfiguration.cs:11).
   gates/lab_gate.js CLAUSE 7 now exists to keep a model from ever passing itself
   off as a measurement: a row may declare kind:'MODEL', and then EVERY constant
   must be tagged [SOURCED file:line] or [DOC ...] or declared ours, at least one
   must be genuinely SOURCED, the page must say NOT A MEASUREMENT on its own face,
   and the record must list what was actually tried and failed. An untagged number
   fails the build exactly like a missing citation. (The MODEL deliverable was
   named in records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_7_26_26.md before it was
   ever needed.)
   Gate: 83 new checks (262 total in the lab gate), all measured through the page's
   own tick(), so a 24-minute buff is verified in milliseconds.
   TWO DEFECTS FOUND BY LOOKING, NOT BY READING — the lesson from the last two
   kills: (1) the mountain was not actually dangerous (5 tiles of cold crossed in
   8 seconds, 8 of 25 health, so the buffs did not matter, so the page failed the
   one thing he asked it to test). The map was rescaled so the cold round trip
   costs ~29 health: empty you reach the cairn and die on the way down, fed you
   barely notice. (2) Rested re-granted every frame at your own fire — correct
   behaviour — but announced itself every frame, burying the screen in toasts.
   Teardown, every number tagged: records/lab/BOHEMIA_LAB_VALHEIM_TEARDOWN_7_27_26.txt
   Patterns: records/lab/BOHEMIA_LAB_VALHEIM_PATTERN_NOTE_7_27_26.md (6 mechanisms,
   6 do-not-ports, 5 honest limits).
   [PENDING Paolo] and it is the whole point of the page: does a camp that makes
   you stronger belong in Bohemia? Behind that, also his: our comfort CATEGORIES,
   how long our rest ritual takes, whether food raises a ceiling or fills a meter,
   and whether we have a hunger axis at all (Valheim's case for "no" is strong).
   NOTHING WAS PORTED. The lab ports on his word only.
1f. [KILLED 7/27 — DEAD, GRAVEYARDED, AND LOOT IS NOW A CLOSED LAB SUBJECT]
   Paolo: "That was really bad so bad so bad." The A Dark Room scavenge page
   (slices/lab/BOHEMIA_LAB_DARKROOM_SCAVENGE_7_26_26.html — DEAD, do not re-add) is deleted and
   graveyarded; its registry row and all 44 live checks are removed from
   gates/lab_gate.js. That is the SECOND loot emulation killed in two days, so
   under laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md LOOT IS ENDED as a lab
   subject: no v3, no third reference game, nobody re-pitches a loot page unless
   Paolo names it himself.
   POST-MORTEM: records/BOHEMIA_DARKROOM_LOOT_KILL_7_27_26.txt. Three causes, and
   the first is the big one: (1) I PRODUCED SOMETHING HE DID NOT ASK FOR — his
   message asked for research, and "you could try it something else" is a shrug,
   not a commission; the research alone was the turn. (2) I answered "too slow" by
   DELETING THE ACT instead of speeding it up — A Dark Room's loot is a paragraph
   and one button in a modal, and he said State of Decay is decent AS AN
   EXPERIENCE, which is exactly the part I removed. Two taps in a menu is not a
   fast search, it is no search. (3) It looked like nothing — grey squares with
   letters — in the middle of a fleet-wide look problem that is the reason he
   cannot approve anything.
   264 green checks and a verified deploy proved the port was FAITHFUL and could
   not ask whether he wanted it. I even added a FEEL-STATEMENT step after the
   Zomboid kill, ran it, and it PASSED, because it checked the reference against
   his rulings and never against what he actually wanted. A procedure I invented
   cleared me; that is worth less than nothing.
   laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md is UNCHANGED and still
   the ruling. Its four content questions are still [PENDING Paolo] and are still
   the only real blocker: resource KINDS and how many, yield range per container
   kind, what a search costs in time, and re-search / noise.
1e. [SHIPPED 7/26, ON HIS ORDER] THE RESEARCH DOSSIER: WHICH GAMES ARE ACTUALLY
   LIKE OURS, AND WHOSE CODE WE CAN GET. Paolo: "Do big brain online research for
   games that are just like ours or like a combination of what we're going for."
   records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_7_26_26.md — Bohemia's combination
   written as a ten-column checklist, nine candidates scored against it, a
   VERIFIED source verdict per game (fetched, not assumed), a one-line FEEL
   STATEMENT per game checked against his standing rulings, and a ranked
   shortlist. It also names the split that matters: an EMULATION has real source
   and citable lines; a MODEL has only documentation and needs a NEW GATE ROW
   TYPE before one can legally ship. #1 next target: CATACLYSM: DDA faction camps
   (open source, verified fetchable) because it is the only game that answers his
   own ruled-but-unfilled question — what an action COSTS and what a crew you
   sent away brings back. Honest finding: the FEED/clout axis has NO reference
   with obtainable numbers, and that is a finding, not a gap to fill by inventing.
1d. [SHIPPED 7/26, ON HIS ORDER] THE FIRST PORT OUT OF THE LAB.
   Paolo after playing LAB-03: "Awesome! All these things worked. Very good! Did
   you learn anything. Anything we can throw in the bohemia code right now?"
   Law: laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md — the lab ports
   only when he says so, ships MECHANISM ONLY in its own new file, never wires
   itself into another lane's surface, and carries its provenance.
   engine/bohemia_resolve.js (headless, no deps, collides with nothing):
     RESOLVE  one moment, a DECLARED phase order, and no system able to read
              another's report. A step that throws cannot eat the player's night.
     RATION   a limit by COUNT per day and per week with a bypass that overrides
              both (the birthday shape). No price term exists anywhere in it.
     CEILING  points cannot pass the current state's cap and ONLY a state change
              moves the cap. 500 favours cannot grind past a wall.
     REACH    one declared range, one facing rule, one predicate.
   AMENDED THE SAME TURN BY HIS RULING: "I like it all tbh all 3 and sleep
   understand sleep can be hangout or eat too u know" — APPROVE on all four, and
   the resolve moment is ANY BLOCK OF TIME THE PLAYER SPENDS, not just sleep.
   Law: laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md. The
   resolver now takes a CALLER-DECLARED list of moments each carrying a SIZE, a
   system declares WHICH moments it answers, and an undeclared moment is a build
   error. A meal moves less than a night because each system says so, not because
   the module hardcoded a night. Verdict: records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt
   Gate: gates/resolve_gate.js, 77 checks, registered as LAB PORT, and
   mutation-tested (breaking the clamp, leaking reports between steps, letting a
   thrown step kill the moment, ignoring a moment subscription, leaking the moment
   through the shared context, or accepting an undeclared moment each turn it red).
   EVERY TABLE IS EMPTY. No ration limits, no faction thresholds, no reach number
   and no action costs for any real Bohemia system: callers pass them in, and the
   first default is a RULING, not code. NOT WIRED INTO ANY SURFACE — adopting it
   is the owning lane's build item (RUN for the contextual verb + reach, WORLD for
   the resolve point, LIFE/SOCIAL for the ration and the standing ceiling).
1c. [SHIPPED 7/26 — AWAITING PAOLO'S PLAY] ONE WORLD, ALL THREE MECHANICS ON IT.
   Paolo: "are you able to code these into the walkable version of Stardew Valley
   made earlier pull up to the mini lake you can start fishing pull up on your
   potential spouse. Do all of this pull up on your farm."
   slices/lab/BOHEMIA_LAB_STARDEW_WORLD_7_26_26.html — one town, one clock, one
   purse. Your farmhouse and a 54-tile fenced plot, the shop up the road, a lake
   with a dock, EMILY walking a real schedule. ONE contextual action button:
   CAST at water, USE TOOL at soil, TALK next to her, SLEEP at your bed, HOLD TO
   REEL once a fish is on, and the tile you are about to act on is outlined.
   Sleeping is the only integration point: crops advance or stall, soil dries,
   her friendship decays, the wedding counts down, her schedule resets.
   What the merge taught (the actual finding):
   records/lab/BOHEMIA_LAB_STARDEW_WORLD_NOTE_7_26_26.md — the walk is a sentence
   structure not a feature; one contextual verb instead of a button per system;
   reach is a declared number; ONE resolve point with zero coupling between
   systems; distance on the map IS the pacing. Gate: 179 checks, and the world
   half WALKS the route with the real movement code (door -> plot -> till/seed/
   water -> across the map to the dock -> land a fish -> up to her -> bouquet ->
   home -> in the door -> bed -> sleep -> the crop advanced).
   His musing "in our world it's gonna most likely be like a Hydro farm pool or
   something I don't know but yeah" is RECORDED AND NOT ACTED ON. No Bohemia
   growing system invented. If he rules it, it becomes a CITY/WORLD item.
1b. [SHIPPED 7/26 — AWAITING PAOLO'S PLAY] STARDEW MECHANICS: FISHING + FARMING
   + MARRIAGE, all three playable end to end in
   slices/lab/BOHEMIA_LAB_STARDEW_MECHANICS_7_26_26.html. The real bobber-bar
   physics (bar height IS the entire fishing skill tree); till/seed/water/sleep/
   harvest/regrow with the real reasons a crop stalls (dry = a wasted day, not
   damage) or dies (wrong season); and stranger -> friend -> dating -> engaged ->
   married on the real point economy (250/heart, gifts rationed 1/day + 2/week,
   birthday x8, neglect -2/-8/-20, and the HARD 8-heart cap that gifting cannot
   pass). Teardown with every file:line:
   records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_TEARDOWN_7_26_26.txt. Patterns +
   what Bohemia should take: records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_PATTERN_
   NOTE_7_26_26.md (10 named patterns, 7 recommendations, 4 do-not-ports).
   Gate: 112 checks that PLAY all three loops.
1. [SUPERSEDED 7/26 by item 0 — kept as the record, not a template] STARDEW
   TOWN-WALK FEEL. All three
   deliverables landed: slices/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_7_26_26.html
   (one town, two furnished interiors, fade transitions, the 7s/10min clock with
   the real dusk curve, one scheduled NPC),
   records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_FEEL_LEDGER_7_26_26.txt (37
   constants, each with the decompiled file:line it was read from) and
   records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_PATTERN_NOTE_7_26_26.md (9 port
   candidates, 4 explicit do-not-ports). Gate: gates/lab_gate.js, 83 checks,
   registered as REFERENCE LAB. The verdict is Paolo playing it; the lane ports
   nothing on its own. ONE [PENDING Paolo] came out of it and is written into
   the note: Bohemia's 120 BPM / one-body-per-cell walk and Stardew's continuous
   sub-pixel walk cannot both live in one surface — three options are laid out,
   all three are his call.
2. [KILLED 7/26 — DEAD, GRAVEYARDED, NO V2] ZOMBOID LOOT LOOP. Paolo: "That was
   really bad and not fun." The page is DELETED and graveyarded; its gate row is
   gone. Post-mortem: records/BOHEMIA_ZOMBOID_LOOT_KILL_7_26_26.txt. The teardown
   and pattern note survive marked DEAD as the record of what was measured.
   THE RULING THAT REPLACED IT, and it is the valuable thing:
   laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md (LOCKED) — Bohemia's
   loot is VERY SIMPLIFIED: a found thing is a RESOURCE WITH A COUNT ("you found
   like three"), not a named object; the description carries the flavour and its
   job is to explain the amount; looting is ONE FAST ACTION, because "imagine if
   that went by really quick instead of really slowly I might give a fuck about
   it"; minimalistic, FEWER kinds than State of Decay; customisation is NOT bought
   with loot volume; STATE OF DECAY (and SoD2) is the reference and PROJECT
   ZOMBOID IS NOW AN ANTI-REFERENCE for loot pace.
   [PENDING Paolo] the resource KINDS and how many, the yield range per container
   kind, what a search costs in time, and whether a container can be searched
   twice. Nobody invents these.
   WHY IT FAILED (root cause, in the post-mortem): I emulated a pace he had
   already implied he did not want, treated an old backlog phrase as a spec, and
   shipped volume into a lane where he wants minimalism. 245 green checks proved
   every rule was ported faithfully and not one of them could ask whether it was
   fun.

3. (Paolo adds more targets by naming a game + system to any lab session or
   to the coordinator.)

## ART (new lane — first word "art")
-1. (discovered 7/26) FLEET: TWO SESSIONS BUILT THE SAME THING IN THE SAME HOUR.
   ART and RUN both wired the frozen tileset into the run; RUN landed first and
   ART binned its duplicate. "Check main before you start" does not help when
   the other lane lands mid-turn. Needs a real mechanism (a claim/lock on a file
   or a system, visible across sessions), not a promise. NOT designed here -
   fleet process is not this lane's to invent. Record:
   records/BOHEMIA_ART_LANE_COLLISION_7_26_26.md
0. [SHIPPED 7/26] STEP ZERO — THE MOBILE RENDER CONTRACT (amendment D):
   laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md. Pins frame, tile px, integer
   zoom, portrait viewport, proportion canon, ONE light direction, the three
   value bands, no-keyline, no-dither, the pipeline rule and the memory
   constraint. Every number is asserted against the factory's own constants by
   target_screen_gate.py, so contract and code cannot drift. TWO CLAUSES ARE
   HONESTLY UNMET AND SAY SO IN THE DOC: (a) the 64-colour master ramp is
   DERIVED (records/target/BOHEMIA_MASTER_PALETTE.json) but the approved corpus
   is continuous-tone, 59,377 colours across the plates — indexing lands with
   the act-1 tileset (item 2) and is held meanwhile by a ratchet ceiling;
   (b) live canvas memory vs the ~224MB iOS floor is NOT instrumented and the
   gate does not pretend to check it. Order note: amendment D landed on main
   mid-session, so the contract was written FROM the screens, not before them.
0b. [SHIPPED 7/27] MEASURE LIVE CANVAS MEMORY against the ~224MB iOS floor.
   tools/bohemia_canvas_memory_probe.js drives the three shipped surfaces in a
   real browser at iPhone portrait and counts canvas backing stores (w*h*4, in
   EVERY frame - the alpha's heaviest modules are iframes), decoded image bytes,
   and the JS heap over CDP after a FORCED collection. WeakRef-tracked, so a
   cache that works reads as a number that stops climbing. Record:
   records/target/BOHEMIA_CANVAS_MEMORY.json + records/
   BOHEMIA_MEMORY_MEASURED_7_27_26.md. Gate: gates/canvas_memory_gate.py (31
   checks), registered. Section 8 of the contract now carries the numbers.
   THE CLAUSE HOLDS: 480 steps across the valley grew the picture by 0.0 MB
   (the WORLD lane's bounded plot LRU works). WHAT IT FOUND INSTEAD, and it is
   NOT what the clause was watching: the ALPHA holds 2604 live canvases once
   every tab is open (2217 in the shell, 188 mapFrame, 193 runFrame, ~21KB each
   - which is why nobody noticed) and ~46MB of JS heap at load, because the art
   arrives as base64 and lives as JS pixel arrays, never as an image or canvas.
   ~98MB resident = 44% of the floor. Headroom today, work items for the lanes
   that own those tabs (see CHARACTER / RUN), written down rather than patched
   from inside the ART lane. LIMIT STATED EVERYWHERE IT APPEARS: headless
   desktop Chromium, not an iPhone - it proves the SHAPE of the curve, which is
   what kills a phone. A real-device number still needs a real device.
1. [CLOSED 7/26 - CBB, SHIPPED, FROZEN] THE TARGET SCREEN. Paolo: "Could be
   better." Per the verdict pipeline that is SHIPS + FROZEN + NEVER SPAWNS
   VARIANTS. The tile-reassembled frame IS the target; it and the 42-tile
   starter set are byte-locked in the constitution and changing either needs a
   NEW RULING, not a new render. DO NOT MAKE ANOTHER TARGET SCREEN. All further
   look work happens in the act-1 tileset against this target. Verdict:
   records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt. Constitution +
   target-match gate shipped the same turn (215 checks).
   [HISTORY] Amendment C (ANTI-BIOSHOCK) was run for the first time and the mockup
   FAILED it: the painted plate cut into 262 unique tiles for 264 cells - it was
   never a tiled world. Fixed: banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt is
   a real, bounded, NAMED 38-tile set (+11 sprites + cast-shadow DATA), the frame
   is re-laid from nothing but those tiles, and it renders on a real browser
   canvas with integer blit and smoothing off. The first reassembly looked worse
   and the four reasons were specific: no wall corners, a hip roof laid as flat
   stripes, no runtime cast shadows, no gaps between buildings. All four fixed.
   Delta from the painting is now 34/255, essentially all of it the two poster
   passes that belong to the renderer. THE TILE-REASSEMBLED FRAME IS NOW THE
   TARGET and the judge page leads with it. Record:
   records/BOHEMIA_REASSEMBLY_TEST_7_26_26.md. Gate: 1,074 checks, including a
   hard 96-tile ceiling. Backlog item 2 (MASTER ACT-1 TILESET) is now partly
   delivered: this IS the starter set; what remains is the act triptych and
   palette indexing.
   [PRIOR ROUND] THE TARGET SCREEN.
   REV 3 answers the marked-up shot: the nameless bottom band, the fake
   chain-link and the fake power line are DELETED (invented decoration is
   deleted on sight); the radioactive barrel is a plain rusted drum and
   radiation/hazard iconography is now BANNED BY LORE everywhere; the crossing
   spans kerb to kerb with its bars across traffic, lined up with its walk; the
   front door shares a column with its own walk; the garage door is a real
   opening with the driveway running into it; the lamps are the slim blessed
   post, a tile taller and not one pixel wider; and two objects can no longer
   stand on the same ground - the BUILD FAILS. NEW LAW + gate:
   laws/BOHEMIA_ADDENDUM_NAME_IT_OR_DONT_DRAW_IT_7_26_26.md - every thing on
   screen is named, described, sourced, and the build dies if the drawn count
   ever exceeds the named count. Manifest ships with the render and is printed
   on the judge page. Gate: 483 checks.
   [PRIOR ROUND] THE TARGET SCREEN. Paolo:
   "Front base is the only one I'm concerned with and even then it looks like
   hallucinated AI slop. We made a rule that all cars are 2 x 3 tiles. Yeah the
   roofs are all fucked up not put on correctly yeah." A THE FRONT FACE is the
   direction; B and C are GRAVEYARDED (registry + post-mortem in
   records/BOHEMIA_TARGET_SCREEN_RULING_7_26_26.md) and their renderers were
   DELETED, not disabled. REV 2 fixes both named defects at the root: cars are
   sized from engine/bohemia_prop_scale.js at draw time (never a typed number)
   and turned along the road they died on; SHEAR is 0 forever, so a roof sits
   square on its own walls and is a real hip form (ridge, hip ends in the roof's
   own material, fascia, eave shadow). Judge page is now ONE TAP: GOOD ENOUGH /
   COULD BE BETTER / STILL SLOP, with both fixes shown under a tile grid.
   Gate: 91 checks. STILL OPEN: whether the LOOK is there. If it comes back
   STILL SLOP the named next suspects are the one-tan value range, the unindexed
   palette, and boxes-instead-of-massing. Do not act on those before he rules.
1-OLD. [superseded] the three-candidate sitting
   (A THE FRONT FACE / B THE ISO BLOCK / C THE CUTAWAY), each side-by-side with
   a real screenshot of the shipped run, judged from alpha -> LIFE -> PICK THE
   TARGET SCREEN. Built entirely from approved banks; the body is baked by the
   alpha itself. Record: records/BOHEMIA_TARGET_SCREENS_7_26_26.md. Gate:
   target_screen_gate.py (63 checks, registered) — it holds 2-tile doors, human
   scale, three-tone/no-keyline, dead-dark glass, and law 4's quest-ask freeze.
   NOTE: they were composed BEFORE amendment D landed on main, so item 0's
   MOBILE RENDER CONTRACT is written FROM them (records/target/BOHEMIA_TARGET_
   SPEC.json already pins resolution, tile px, integer scale, portrait viewport,
   light direction and the three-tone/no-outline rule) rather than the other way
   round. Amendments B+C (cut-and-reassemble acceptance, proxy gates) attach at
   the moment of the pick, not before it.
1b. (blocked on the pick) WRITE THE PICK IN: status PICKED in the spec, losers
   to the graveyard with a post-mortem, target-match diffing on, proxy gates +
   the cut-and-reassemble acceptance test per amendments B+C, freeze lifted.
2. (after the pick) MASTER ACT-1 TILESET to the target. INTERIOR COMPOSITION
   SOURCE (7/26): records/BOHEMIA_ROOM_RECIPE_BOOK_7_26_26.md — 12 room
   recipes + composition laws + the 70/20/10 dead-world translation,
   [PENDING Paolo bulk verdict]; on APPROVE, rooms are composed FROM the
   recipes (manifests mapped to the interior pool), never invented.
   INGREDIENT DELIVERED
   7/26 by CITY: banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt - Paolo's Great Sweep
   crossed to real images for the first time (all 87 swept packs resolve against
   the HD masters, 0 unresolved), filtered UP-ONLY, 465 tiles bucketed by room
   function with per-tile draw scale from the sweep's BIG/SMALL flags. Built by
   tools/bohemia_interior_pool_factory.py; re-run it with different caps for a
   bigger set. Bodies/gore excluded on purpose (UP, but a story Paolo places).
   Deliberately NOT wired into the game - the freeze and TILESETS-ARE-SETS say a
   look is judged as one assembled scene, after the pick. produced + judged as
   one assembled scene; act triptych variants in spec. | tileset gate +
   proportion gate (2-tile doors, human scale — the proportion half already
   ships inside target_screen_gate.py) | — | yes, as a set.
3. [RETIRED 7/26 - the work is dead, not done] RE-COOK VEHICLES TO ISO. This was
   only ever needed if candidate B or C won. A won and both are graveyarded, so
   the approved car art is already in the right projection. Removing it rather
   than leaving it to rot at the bottom of the lane.
3b. [PENDING Paolo, carried] THE CAR LENGTH. At true pixel scale the approved
   wreck art is ~2 tiles wide by >4 long, against his locked 2x3 footprint.
   Either the art is re-cooked shorter or the footprint becomes 2x5. Not a
   guess I get to make.

Rules (full doctrine: laws/BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md): topmost
unblocked item in YOUR lane; [PENDING Paolo] items are SKIPPED, never resolved;
only Paolo/verdicts add direction-class items; agents may append (discovered)
items; every item works to the Definition of Done. Entry shape:
GOAL | DoD beyond the standard | DON'T TOUCH | needs-verdict-before-volume?

## RUN  (LANE CHARTER CHANGED 7/26 — read
##       laws/BOHEMIA_ADDENDUM_THE_RUN_IS_THE_INTEGRATION_LANE_7_26_26.md first.
##       This lane INTEGRATES what the fleet built; it does not add features, and
##       the run's quest is disposable scaffolding, never judged.)
A2. [DONE 7/27 — HIS ORDER, job two] THE WORLD ADOPTED THE RESOLVER.
   engine/bohemia_world_resolve.js: four systems subscribe to the declared time-spend
   moments — day (accrues spend, rolls the day), economy (advances the ledger when the
   day has moved under it), faction (the beat), encounters (the director's socket).
   NO MOMENT NAME AND NO RATE LIVES IN THE MODULE: his own example words (sleep, night,
   meal, hangout) appear nowhere in it, and a resolver whose moments are named nonsense
   works identically, which is the proof it genuinely does not know them.
   EVERY TABLE SHIPS EMPTY. An unruled system runs, changes nothing, and reports
   NO_RULING BY NAME, so an unruled world reads as unruled instead of looking like a
   working one. Ten small moments equal one big one exactly when he says 0.1 and 1.0,
   and four equal one when he says 0.25 — the ratio lives in the ruling.
   THE 7/24 PACING RULING HOLDS: a faction turn cannot fire without a caller-supplied
   beat predicate, so DEFAULT OFF is structural, not a comment. A spent meal can never
   quietly become a war. Gate WORLD RESOLVE, 39 checks.
   FOUND BY THE GATE: ten spends of 0.1 sum to 0.9999999999999999, so a strict >= 1 ate
   one moment in every ten and the player could eat ten meals and never turn the day.
   [PENDING Paolo, and it is what blocks everything downstream] THE MOMENT TABLE —
   which moments exist and how much each one spends — and each system's per-unit rate.
   Nothing in this lane will guess either.
A. [FILED BY VERDICT 7/26 — records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt] ADOPT THE
   ONE CONTEXTUAL VERB AND THE DECLARED REACH. Paolo APPROVED both, so this needs
   no further ask. engine/bohemia_resolve.js ships makeReach(tiles) + facingTile:
   one range, one facing rule, one predicate. The run currently has a talk trigger
   AND a door bump AND separate buttons; fold them into ONE button whose label
   comes from what you face, exactly as the lab world does (CAST / USE TOOL / TALK
   / SLEEP), with the target tile outlined so the button is never a mystery. It
   REMOVES UI rather than adding it, which is what a phone wants.
   [PENDING Paolo] HOW MANY TILES OF REACH. Do not pick it. The lab used 1 in a
   reference page; that is not a ruling.
   [DONE 7/26] THE FIRST CONNECTED RUN — shipped, gated. Record:
   records/BOHEMIA_THE_FIRST_CONNECTED_RUN_7_26_26.txt.
   [DONE 7/26] THE REAL CAST — the run wears the real rig + wardrobe + face.
   [DONE 7/26] REAL ANIMATED DOORS (2 tiles tall, approved 7/13 bank) + MUSIC
   (the alpha's own synth scores the walk). Law:
   laws/BOHEMIA_ADDENDUM_DOOR_LAW_TWO_TILES_TALL_7_26_26.md.
   [DONE 7/26] SAVE / LOAD — one portable versioned blob (sleep + manual +
   autosave, export/import code, no device prefs inside, old versions migrate
   forward) and DEATH IS A RELOAD wired to it.
   [DONE 7/26] THE OVERWORLD LOOK — the block is laid from the FROZEN starter
   tileset of Paolo's CBB target. Consumed, never re-rendered; the builder
   refuses to ship if the bank md5 moves. CORRECTION ON RECORD: the target he
   picked is TOP-DOWN, so this lane's old "the run must go 3/4 iso" premise was
   wrong and is retired.
   [DONE 7/26] INTERIORS DRESSED — CITY's UP-only interior pool consumed: one
   floor per ROOM by the room's own function, props from the role's own buckets,
   walls from the constitution's own tile. Props never became collision.
   [DONE 7/27] THE SENTENCE (his ruling after the lab): every verb goes through
   the ported engine/bohemia_resolve.js — REACH declared once, ONE contextual
   button (talk/enter/use/sleep/hang out), and every time-spend resolves the
   world through declared moments in declared phase order. Sleep saves.
   [DONE 7/27] WALK FEEL as playable toggles: GRID / SLIDE / HYBRID / FREE.
   [DONE 7/27] THE REAL VALLEY — the block is a real CELL of the generated
   valley, read off the world model's own tile rung; walking off an edge loads
   the neighbouring district. Passability is the world's answer now.
   Scoreboard: records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md (21/27),
   enforced by gates/integration_gate.js.
0b. DISTRICT ART (now the lane's top gap). The other districts are WALKABLE but
   wear a generic material pass laid from the world's own tile names. Each type
   needs its own dressed language the way the suburb has one, built to the
   constitution. | per-type material map + a real-surface screenshot each |
   the frozen tileset is frozen; new tiles register in target_match_gate | yes.
0c. DISTRICT ART / MUSIC / DAY CYCLE (ledger priorities 3-5), in that order.
1. Phone-feel pass on the run (touch responsiveness at arm's length): real
   device-shaped viewports, hold-to-walk tuning, tap-to-step target sizes,
   the objective bar at arm's length. | run_gate extended with a real-device
   viewport pass | engine/bohemia_loop.js (flag needs to WORLD) | no.
2. (discovered) WIDEN THE RUN: the run is one seed-7 block. Walking off the
   block into the neighbouring district is the next real milestone — needs the
   world model's plot-to-plot transition, not new content. | run_gate proves a
   second district reached on foot | district engines (CITY lane owns them) | no.
3. (discovered) The player is not registered in ctx.scheduler, so the run's
   grid clock is the block sim's, not the loop's turn scheduler. Engine request
   for WORLD: a player actor the run can commit() through. | loop gate section
   | engine/bohemia_loop.js | no.
4. (discovered) Only S01 is wired into the run. Once placement is ruled, the
   other twenty canon quests should be reachable from a run surface too. |
   run_gate covers a second quest end to end | quest text | [PENDING Paolo
   placement].

## WORLD
ICON LAW (Paolo 7/27, LOCKED — laws/BOHEMIA_ADDENDUM_ICON_WITH_EVERY_BUILD_7_27_26.md):
"anytime you build something like this you have to make a city builder icon as well like
for real." A district or surface is NOT FINISHED until it has a city builder icon (a
DISTRICT HERO), the same turn the ground ships. Gate ICON is a ratchet: new work cannot
add debt, and the named debt list may only ever shrink.
I0. [DONE 7/27] rail + interchange heroes, built the approved way (hand-built 3D volumes
   matched to the walkable district, palette pulled live from the engine module, full
   PARTS dossier). Wired into the CITY tab. Gate ICON, 17 checks.
I1. [HELD — needs Paolo's ruling, do NOT just retry] AIRPORT + AIRBASE HEROES. Both
   builders are written, correct and left in tools/bohemia_district_hero_factory.py, but
   deliberately OUT of the HEROES dict because the signature does not read. The aeroplane
   geometry is NOT the problem — baked alone on a bare plate it reads unmistakably as an
   aeroplane, verified. The problem is SIZE: every other hero's signature is a BUILDING,
   which survives shrinking to a 1x1 plot; an airfield's signature is an AIRCRAFT, and a
   plot holding a runway + a taxiway + a terminal has no room left to make it legible.
   Four attempts are written up in the factory so nobody re-walks them. THE QUESTION FOR
   PAOLO: should an airfield hero DROP the runway and show just the terminal and the
   aeroplane, big? That is a composition ruling, not a code fix.
I2. THE ICON DEBT, 22 of 44 registered types (gate prints it every run): suburb, trailer,
   apartment, wash, cemetery, drivein, golf, jail, chapel, landfill, railyard, substation,
   watertreat, boneyard, waterpark, airport, airbase, arterial, freeway, desert, mountain,
   water. Terrain (desert/mountain/water) may not want a building hero at all — that is
   a separate ruling. Chip at this list; it can only shrink.
I3. [FIXED 7/27, found while doing I0] tools/bohemia_district_hero_factory.py had its
   scratch path HARD-CODED to one session's private directory, so the factory could not
   be run by anybody else at all — the palette dump died on check=True before the first
   hero was built. Session-portable now (BOHEMIA_SCRATCH, else the system temp dir).
0. [DONE 7/27 — HIS ORDER, top of the queue] THE ONE MAP.
   laws/BOHEMIA_ADDENDUM_ONE_MAP_7_27_26.md. The phone's map app drew a SCHEMATIC:
   gradients, two glyphs, and one tiny square per building lot. It now renders THE
   REAL GENERATED VALLEY, cell for cell, from engine/bohemia_valleymap.js — the ONE
   shared renderer the city-builder MAP tab now reads from as well. Quest pins on top,
   grouped by cell (21 quests land on 13 cells, so a stack reads as a stack with a
   count instead of three glyphs hiding each other). Tap any cell and it tells you
   what is really there, straight off the world model. Gate ONE MAP, 37 checks.
   WHAT THE JOB ACTUALLY UNCOVERED, and it was worse than a re-skin:
     a. THE PHONE WAS RUNNING A WORLD MODEL WITH NINE GENERATORS MISSING. arterial,
        freeway, terrain_noise, airfield, desert, mountain, water, rail and
        interchange were never in build_current_slice.js's MODS, so the railway, the
        freeways, the interchange, both airfields and all three terrains rendered as
        nothing on the phone while the MAP tab drew them properly. Fixed and gated.
     b. FOUR INDEPENDENT VALLEY RENDERERS, no shared layer, tone tables copy-pasted
        between files with comments admitting it. The MAP tab's private copies are
        gone; it reads the shared module now.
     c. DEAD CODE IN THE MAP APP: wm.hubs and wm.routes were read every draw and
        buildRealWorldMap has never set either one.
     d. THE PLAYER STOOD OUTSIDE THE WORLD. tile 128,128 on a 96-cell valley, so the
        blip — the one thing on the map that is YOU — was permanently off the canvas.
   STILL OPEN, and it is a real one: the placement-verdict overrides. The pins read
   ctx.quests.castTarget, which hashes into a faction's territory list, so one faction
   base attracts every quest that demands it. engine/bohemia_quest_placement.js exists
   to fix exactly that and NOTHING CONSUMES ITS OUTPUT yet. That is [PENDING Paolo] —
   the judge page is built and unjudged, and the WORLD-BEFORE-QUESTS park only lifted
   far enough to DRAW pins, not to decide where they go.
A. [FILED BY VERDICT 7/26 — records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt] ADOPT THE
   RESOLVE POINT. Paolo APPROVED it and RULED its shape in the same breath: "sleep
   can be hangout or eat too u know" — the world resolves at ANY BLOCK OF TIME THE
   PLAYER SPENDS, and sleep is only the biggest one. Law:
   laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md
   engine/bohemia_resolve.js ships the machinery: a resolver takes a declared list
   of moments each carrying a size, a system declares which moments it answers, an
   undeclared moment is a build error, systems cannot read each other, and one
   broken system cannot eat the time the player spent. Register the world's systems
   as steps (territory, who noticed you, the overnight feed, decay) and run them at
   a spent block instead of scattering them across the tick.
   [PENDING Paolo] THE MOMENT TABLE: which moments exist beyond his three examples
   and HOW LONG EACH SPENDS. And the action cost table. Do not invent either.
LANE RULING (Paolo 7/26, LOCKED — laws/BOHEMIA_ADDENDUM_WORLD_BEFORE_QUESTS_7_26_26.md):
"we need to actually build a fucking world." This lane does NOT work on quests. Every
quest item is PARKED until Paolo himself reopens it. Build ground, not plumbing for
stories the world cannot host yet.

0. [DONE 7/26, freeze lifted] THE FIVE SURFACES CONFORM TO THE VISUAL CONSTITUTION.
   Built during the freeze and flagged PROVISIONAL SKIN; the moment Paolo ruled the
   target CBB they were measured against it and the 5 out-of-band palette entries
   (road paint, crosswalks, stop bars, the lake ring) were toned into their layer's
   value band. Locked by a CONSTITUTION CONFORMANCE section in roadcell_gate and
   terrain_gate, which read the constitution at run time. Any NEW cook in this lane
   passes the same section plus the fleet's proxy gates, and any new art BANK
   registers itself in target_match_gate.py.
0c. [DONE 7/26] STREAMING: bounded LRU plot cache (64 cells) + w.stream() warming the
   ring ahead of the body + the walk surface streaming before it steps. Walking the
   valley used to grow without limit toward ~1.8 GB; it is now flat, and a boundary
   crossing costs 0.03 ms. Gate: STREAMING. RESIDUAL for a SURFACE lane (not WORLD):
   the ~30-40 ms first-touch of a fresh cell wants an idle callback or a worker inside
   the run/city frame loop.
0b. [PENDING Paolo] ACT TRIPTYCH for the five surfaces: act-2 recovering and act-3
   rebuilt materials. Content, his call, recorded in every dossier.
1. DONE 7/26: THE GROUND IS BUILT. Roads (arterial 2,434 + freeway 952) and terrain
   (mountain 927 + desert 620 + water 74) all generate real ground on one continuous
   valley-wide noise field. Valley: 40% -> 95% generated. Gates ROAD CELLS + TERRAIN.
   WHAT IS LEFT UNBUILT, in order of size, and it is all LANDMARK work now:
     a. [DONE 7/26] airbase 54 + airport 40: engine/bohemia_airfield.js, built across
        the CLUSTER (new clusterBoundsOf rung on the world model) so one runway spans
        the whole field. Gate AIRFIELD, 20 checks. FOLLOW-UP (discovered): the field
        reads as clean bands and wants dressing — drifted sand over the pavement,
        cracked slabs, blast staining, wrecks off the taxiway. Cheap, and it is what
        would make it read finished rather than merely correct.
     b. [DONE 7/27] rail 90 + interchange 16, and they turned out to be nothing like
        "network tiles like the roads, same machinery" — that line in this backlog was
        wrong and both had to be built as their own thing.
        RAIL (engine/bohemia_rail.js): a railway has no lanes, no median, no sidewalk
        and no intersections, so it gets its own vocabulary — a two-track ballast prism,
        cess, ditch, a maintenance road on ONE side, a right-of-way fence, and rail-served
        industrial frontage outside it. Passing sidings keyed on the CELL COORDINATE so
        they run 16 cells and taper into the main through real point blades. 17 at-grade
        crossings where the mile grid meets it. THE LINE IS ONE LINE for the whole valley:
        world.js's new continuityLinks looks THROUGH a crossing surface, and
        bohemia_freeway.js now carries the ballast and rails UNDER its deck, so the
        mainline is not severed into three pieces at the freeways. Gate RAIL, 36 checks.
        INTERCHANGE (engine/bohemia_interchange.js): the stack, solved across all 16
        cells as ONE PURE FUNCTION of valley position — no per-cell buffer anywhere, which
        the gate proves outright via the exported solve() rather than inferring it from
        seams. Two mainlines, one decked over the other on piers, eight ramps (a tight
        connector and a directional flyover per quadrant), two retention basins, the wall
        track, and the jam that starts here. Approaches come from the MAP
        (world.js clusterApproach), not from a symmetry assumption. Gate INTERCHANGE, 43.
     b2. [DONE 7/27, FOUND BY LOOKING] THE INTERSTATE WAS RENDERING AS A LATTICE. 926 of
        the valley's 952 freeway cells were drawing themselves as a four-way junction,
        because the overmap lays an interstate TWO CELLS WIDE and the module read "any
        freeway neighbour" as its axis — so the third neighbour, which is the PARALLEL
        CARRIAGEWAY, looked like a crossing. The corridor came out as a grid of tan
        embankment squares. A cell's axis is now the direction it has BOTH neighbours in,
        the odd one out is named as parallel, and no sound wall stands between two
        carriageways. Gated in roadcell_gate (crossroads must stay under 5%).
        This was my own 7/26 work. It shipped with all gates green because no gate
        looked at the SHAPE of the corridor, only at whether you could drive through it.
     c. campus 16, town 9, speedway 12, ballpark 8, convention 6, datafort 6,
        prison 4, dam 4, basin 8, reservoir 3 (small landmark set, one at a time).
     d. NEVER AUTO-GENERATED, by law: strip 81, resort 118, casino 5, luxor, sphere,
        strat, highroller, sign. Paolo's hand. Leave them reserved.
2. [DONE 7/27] AMBIENT ENCOUNTER DIRECTOR. engine/bohemia_encounters.js, built on
   his "Approve all" (records/BOHEMIA_VERDICT_ACT1_ROSTER_7_26_26.txt). All 12 act-1
   tokens under the verdict's own names, each with the VERB that makes it different
   (variety is a verb, never a bigger HP bar) and the beat telegraphs the roster
   specified. The whole approved pacing package is held and measured:
     70/20/10 by a DEFICIT CHOOSER, not dice — and the class is NOT NEGOTIABLE. The
       first build substituted another class when the wanted one was on cooldown and
       came out 40/42/18; if the story wants an ambient beat and none is available,
       NOTHING HAPPENS rather than a forced fight standing in for it. Now lands on
       70.0/20.0/10.0 over a long walk.
     STORYTELLER BUDGET — spends big when healthy and quiet, small after hard fights.
       A hurt player with a hot recent past measurably gets fewer encounters.
     ~90s FLOOR, RARE IS SACRED (spice once a session, ever), NO REPEAT-SPAM.
     NO GLOBAL SPAWNS EVER — held by construction: there is no fallback table, so a
       district with no entry spawns nothing and says so.
     NO BACKGROUND TICKING (his pacing ruling) — the module owns NO CLOCK at all: no
       timer, no interval, no Date.now. It is PULLED through the encounters socket in
       bohemia_world_resolve.js. Standing still forever produces nothing, gated.
     PRECONDITIONS THE ROSTER STATED are honoured and an unproven one is a NO: the
       bounty squad only exists because of your own murders, the spotter drone only
       patrols owned light (LIGHT=TERRITORY), patrols collide only at a seam.
   Gate ENCOUNTERS, 46 checks. Enemy ART is explicitly NOT this item (the verdict
   files it as a separate fresh-look judge under approved-assets-first).
   NOT YET LIVE, and this is the honest state: the director is built and its socket
   exists, but nothing spawns until (a) Paolo rules the MOMENT TABLE so the world
   resolver actually fires, and (b) somebody supplies the district+day/night table,
   which is content nobody has ruled. Both are one call away, neither is guessed.
3. INTERIORS FOR THE GROUND THAT HAS THEM: coordinate with CITY (they own the district
   interiors item) so nothing is built twice. | — | CITY lane's item 1 | no.
4. [DONE 7/26] Engine support for RUN, request 1 of 2: THE VALLEY TILE + CROSSING
   (world.tile / solidAt / step / walk / route). The run can now ask the world model for
   any tile in the valley and walk across cell boundaries on real ground; gate CROSSING
   proves district -> street -> district on foot. RUN's ledger priority 2 is unblocked.
   [DONE 7/26] request 2 of 2 as well: THE WALK SURFACE
   (Loop.makeWalkSurface + ctx.walk) — a player actor in a real loop scheduler in
   valley tile space, blocked by the world's own tiles, with commit/routeTo/follow.
   Gate CROSSING is 22 checks and walks it end to end. RUN item 3 is unblocked.
5. Further engine support requests flagged by RUN (as they arrive, priority). | per
   request | — | no.
5. (discovered 7/26) VALLEY COMPOSITION: 70% of the built valley is suburb, and there are
   301 solar cells but 1 library, 1 firestation, 1 jail. Whether that is the city he wants
   is a DIRECTION call. | — | — | [PENDING Paolo].
6. (discovered 7/26) Faction bases are an even stride across the district list, so all 14
   factions sit on suburb tracts holding 1 cell each. Whether a faction's ground should
   match its trade is his call; the mechanism is a small change to bootFactions.
   | — | — | [PENDING Paolo].

PARKED BY THE 7/26 RULING (do not pick these up):
- P1. Quest placement picks -> apply as a casting-bridge override. The candidates shipped
  (all 21 quests after the QUESTS lane folded theirs in) and the judge page is live in
  the LIFE tab; it stays there, unjudged, unsurfaced.
- P2. World bridge deepening (quest outcomes moving factions on the map).

## LIFE / SOCIAL
A. [FILED BY VERDICT 7/26 — records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt] ADOPT THE
   RATION AND THE STANDING CEILING. Paolo APPROVED both.
   RATION (engine/bohemia_resolve.js makeRation): limit favours, posts and gifts by
   COUNT per day and per week, NEVER by money. A priced limit stops mattering the
   moment the player is rich; a rationed one never does. The bypass slot is the
   birthday shape: an occasion that ignores both windows and can pay a multiplier.
   CEILING (makeCeiling): faction standing gets a WALL you cannot grind through.
   You reach it by doing jobs and you only pass it by COMMITTING (taking a side,
   burning a bridge), and neglect gets more expensive the deeper in you are.
   [PENDING Paolo] THE NUMBERS: how many favours per week, where each faction wall
   sits, what commitment moves it, what neglect costs per rung. Do not invent them.

## CITY
0. [DONE 7/26] THE WALKED WORLD WAS RESAMPLED AT EVERY ZOOM. Found by
   MEASUREMENT (tools/bohemia_render_audit.js patches the canvas before the app
   boots and records every real draw), not by reading code. 41% of all draws
   upscaled by x1.375 - the chunk bake was 16px/cell while the default zoom is
   22, so the ENTIRE ground plane was resampled, and the zoom ladder
   [11,22,44,88] is a clean power-of-two family that was being divided by the
   wrong base. 44% more landed on a half pixel because the canvas takes its CSS
   client height and an odd height puts .5 in the camera origin. Fixed:
   tools/bohemia_city_pixelfix_patch.py (TPX 16->22, whole-pixel camera, and
   canvases given their own 64-entry LRU so the bigger bake cannot blow the
   ~224MB iOS floor). Result 41% -> 0.1% and 44% -> 3.4%. Locked by
   gates/render_pixel_gate.js, a RATCHET measured on the real surface.
0A. [DONE 7/27] THE PHONE WAS EATING THE CONTROLS. He said "I can't get outside
   the suburb" and "I'm trying to copy and paste the arrow of move" in the same
   breath, and THOSE ARE ONE BUG. Movement in this game is press-and-HOLD on an
   arrow. iOS Safari's default answer to a long press on text is the selection
   magnifier and the Copy / Look Up / Search callout. The entire 33MB alpha
   contained ZERO occurrences of -webkit-touch-callout and the shell's reset
   never set user-select at all, so holding the d-pad opened the OS menu instead
   of walking. MEASURED, so the level design is cleared: every suburb sample
   sits 16-50 steps from a different district, and 7,645 of 7,649 built cells can
   be walked out of. He was not trapped by the map, he was trapped by the button.
   Fixed: tools/bohemia_touch_guard_patch.py (shell + all three frames; text
   fields keep copy/paste on purpose). Gate: gates/touch_guard_gate.js, which
   states plainly which half it can measure - Chromium does not implement
   -webkit-touch-callout, so user-select is measured on the real controls and the
   callout declaration is asserted in source.
0H. [DONE 7/27, his ruling, law in laws/BOHEMIA_ADDENDUM_THREE_TILE_WALL_7_27_26.md]
   THE THREE-TILE WALL AND THE SEE-THROUGH. "every wall supporting a door should
   be three tiles tall ... an opacity filter for when I'm in front of a wall".
   Two asks, ONE mechanism: a wall only gets height by leaving the baked chunk
   (three tiles means drawing into the two cells above, which belong to other
   rows and sometimes other chunks), and the opacity depends on where he is
   standing THIS FRAME, which a bake cannot know. So facades are a live pass
   drawn in two halves around the player: behind him at full opacity, then the
   player, then what stands between him and the camera, faded to 35% only where
   it covers him. A door is 2 of the 3 tiles (DOOR LAW); a window moved UP to the
   middle tile instead of lying on the ground. The tall door is DERIVED ONCE into
   a cached 16x32 tile so no frame ever stretches it - a law does not get to
   break the render contract to implement itself. Gate: wallheight_gate.js,
   which renders two real frames and reads back destination size AND alpha
   (invisible to a normal draw audit), asserting the fade fires when covered and
   does NOT fire when clear. NO PIXEL COOKED - all his own 7/21 house verdict.
0E. [DONE 7/27, diagnosis in records/BOHEMIA_SUBURB_DIAGNOSIS_7_27_26.md] "THE
   DOOR SUCK" WAS A DICE ROLL. Every exposed house tile picked its facade from a
   per-tile hash and 10% of that roll was a DOOR: measured 62 doors across 727
   exposed fronts in 24 real suburb cells, scattered down every wall including
   the 643 that face a dead-dirt backyard with no path to them. The suburb
   generator already marks its driveway apron (3) and its street (1); the door
   now goes where the house meets one of those, one per approach. After:
   17 doors, 17 reachable, 0 on dirt. The generic-district path had the same
   roll and it was worse - those dossiers declare doors as PORTAL tiles you step
   through, so a painted door there is a door that lies; it paints none now.
   Gate: frontdoor_gate.js. NO PIXEL WAS COOKED - it places Paolo's own 7/21
   approved tiles correctly. HIS CALL, NOT DECIDED: 17 doors over 24 cells means
   most homes are entered through the GARAGE (whose dossier says it has a door
   into the house), because that is where the plot's walkable approach goes. Real
   for a Vegas tract house, or he wants a front door on every home.
0F. (7/27, [PENDING Paolo], from the same diagnosis - all TASTE, deliberately
   untouched) (a) The red-brick read is his OWN approved roof art: hroof holds
   exactly the 14 he thumbed UP on 7/21 (roof_shingle_0-5, roof_gravel_6-7,
   roof_stile_21-26), so it is not a wiring bug; a seamless tile has no ridge, no
   slope and no shadow, which is why a roof reads as wallpaper. (b) The facade is
   drawn ONE tile tall while DOOR LAW says two - the interiors obey it and
   interiors_gate byte-locks it, the exteriors do not, so inside and outside
   disagree about the same law. (c) 54% of a suburb cell is dead-dirt yard drawn
   as one flat noise; the share is honest for a real subdivision but it reads as
   a void. Each of these changes how every building in the game looks. | no |
   records/BOHEMIA_SUBURB_DIAGNOSIS_7_27_26.md | YES.
0G. (7/27, FOR THE WORLD LANE, not touched - ONE SYSTEM ONE SESSION) 4 cells of
   7,649 are SEALED: you can drop into them and never walk out. 88,1 solar ·
   92,8 estate · 92,39 suburb · 5,53 gypsum. Found by flood-filling walkable
   tiles from the game's own drop-in point. Belongs with landlocked_gate.js.
0B. (7/27, HIS WORDS, NOT ACTIONED - recorded so nobody re-cooks into a
   rejection) He rejected, in one message: the HOUSES ("the houses aren't
   good"), the DOORS ("the door suck"), the GARAGE ("the garage is suck"), and
   asked whether the house is even built from the approved target art ("is this
   target art"). STOP PRODUCING applies: nobody makes a v2 of any of these until
   he asks. The one thing he DID direct: "you really should be using the suburb
   district" - the suburb generator, which the walked world does already read
   (realizeCell's m.sub path drives off BohemiaSuburb's own legend). What he is
   pointing at is that the RESULT does not look like the district we built, so
   the gap is between the suburb dossier and what actually renders. Diagnose
   before touching pixels. | no new gate until he rules | his message 7/27 | YES,
   blocked on him.
0C. (7/27, [PENDING Paolo]) "the street that I didn't say you could go" - reads
   as a MAP LAW complaint: a street exists that he did not place. MAP LAW says
   Claude never designs map layouts. Needs him to point at which one before
   anything is changed. | no | his message 7/27 | YES.
0D. (7/27, [PENDING Paolo], probably not the CITY lane) "the phone system isn't
   in here, doesn't progress as I walk" - the phone/feed is not reachable from
   the walked world and nothing about it advances with steps. Whose lane that is
   (LIFE/SOCIAL vs CITY) is his call, and so is whether it belongs in the walk at
   all. | no | his message 7/27 | YES.
0b. [DONE 7/27] THE PHONE WAS BLURRING THE WHOLE WORLD ON THE WAY TO THE SCREEN.
   The 7/26 fix above made the world blit 1:1 INSIDE the canvas. The browser
   then undid it: #cv in the city frame never set image-rendering, so it took
   the default `auto` = smooth, and the 378-wide backing store was BILINEAR
   upscaled x3 onto the phone's glass every frame. Not one tile has ever
   reached Paolo's eye at the sharpness it was painted at, and no amount of
   reading render code could show it, because the damage happens after the game
   stops drawing. Second defect on the same element: the stage box measures
   764.61 CSS px while clientHeight rounds to 765, so the whole world was also
   squeezed x0.9995 - a resample of every row for a squash nobody can see.
   Fixed: tools/bohemia_city_screenfilter_patch.py (CSS box sized in explicit px
   to equal the backing store; filter follows MODE - nearest for the walked
   world, `auto` LEFT ALONE for the builder overview, where 13:1 hero
   minifications need smoothing and Paolo likes the surface as it is). New
   instrument: tools/bohemia_canvas_scale_audit.js measures every canvas's CSS
   box and glass scale against its backing store, on every tab. Locked BOTH
   directions by gates/canvas_scale_gate.js.
0c. (measured 7/27, [PENDING Paolo] - a LOOK call, not a bug fix) THE NAV
   PORTRAIT IS A LUMPY x1.25. #modeFace is a 64x64 player frame shown in the
   80x80 mode button: 64 -> 80 is x1.25, so with nearest some source pixels are
   one screen pixel wide and some are two, on a FACE. Every fix is a visible
   change to a surface he did not ask about - show the face at 64 inside the
   80px ring (an 8px rim of the button's gradient shows), or take the ring to
   64. Do not pick one for him. | canvas_scale_gate would lock whichever he
   picks | measured by tools/bohemia_canvas_scale_audit.js | no.
0a. (discovered 7/26) PRE-SCALE THE DISTRICT HEROES. 732 draws per walk push a
   ~266x172 hero image into a ~20x13 slot - a 13:1 minification done every
   frame. Smoothing is the RIGHT call at that ratio so the look is fine; the
   waste is doing it every frame instead of once. Cache one pre-scaled copy per
   hero per zoom: identical output, a fraction of the work. | render_pixel_gate
   ratchet on the smoothed count once it drops | the city-builder overview is a
   surface Paolo LIKES - identical output or do not touch it | no.
1. [BLOCKED ON THE TARGET PICK] DRESS THE INTERIORS. Paolo killed the first
   interiors ("Dogshit.") and the diagnosis is empty rooms: the shell is lawful
   approved art but it is five textures and no furniture. The furniture is ready
   (banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt, UP-only, bucketed by room function)
   and the role->bucket mapping is written in
   records/BOHEMIA_INTERIOR_KILL_AND_THE_SWEEP_CROSSING_7_26_26.md. Do NOT wire
   it before the target screen is approved - that is the freeze, and dressing
   rooms from loose tiles against no reference is what the reset exists to stop.
   | interiors_gate extended: the pool is UP-only and every drawn tile traces to
   a UP verdict | the shell/mechanism is done, do not re-litigate it | yes - the
   dressed room is judged as an assembled scene, per TILESETS-ARE-SETS.
-1. [DONE 7/26, CITY] THE CITY TAB DREW WORLD ART SMOOTHED. It never set
   imageSmoothingEnabled at all, so it took the browser default (true) and
   bilinear-filtered every approved tile - worst on 3x phones. Fixed at the
   SOURCE (tools/bohemia_city_tab.py), both at context creation and inside
   fit(), because assigning cv.width/cv.height resets the entire 2D context
   state and silently turns smoothing back on. The ART lane's PIPELINE_DEBT
   exemption in target_screen_gate.py is DELETED per its own terms; that gate
   now holds every surface to the contract with no exceptions (484 checks).
2. MARRY COMMERCIAL (discovered, CITY 7/26). The corner plaza has NEVER been
   registered with the district kit (it never binds K, and the registration sits
   behind a `typeof K` guard that silently swallowed it), so the walked city
   still renders commercial from the LEGACY PREFAB STAMPS — not the canon plaza,
   nothing enterable. Binding K is one line and turns walkable_gate RED: on a
   single W or N street the generator builds only ONE store strip and parking
   fills the rest (drive 61% vs content 30%). Fix the mid-block/single-edge form
   FIRST, then bind K. Full numbers in the module's own head comment + records/
   BOHEMIA_INTERIORS_EVERYWHERE_7_26_26.md. | walkable_gate green with commercial
   swept + interiors_gate proves a plaza store is enterable | the S/corner form is
   approved, do not reshape it | the mid-block plaza form is [PENDING Paolo] per
   the module's own NOTES — surface it as rendered candidates, do not pick one.
3. GARAGE + CRYPT INTERIORS IN THE ALPHA (discovered, CITY 7/26). The engine
   DISPATCHES a building's interior by kind (garage -> multi-deck parking, crypt
   -> vault hall, everything else -> rooms) and world_gate proves it. The alpha's
   STEP-INSIDE renders the ROOMS kind only, so walking into a parking structure
   or a mausoleum gets you a floorplan instead of decks/vaults. Embed
   bohemia_garage.js + bohemia_crypt.js in CITY_B64 (resync tool exists now) and
   branch the render the way the engine branches. | interiors_gate extended to
   assert all three kinds render | engine dispatch is correct, do not touch it |
   the deck/vault LOOK = judge before volume.
4. Interiors everywhere: DONE 7/26 (records/BOHEMIA_INTERIORS_EVERYWHERE_7_26_26
   .md). Left standing: THE UNDERGROUND behind wash's sewer tunnel mouth is a
   LIFE-lane below-grade level, not a room in a footprint. [PENDING — LIFE lane]
5. District volume: next Pocket-City-type gaps that fit the dead world, on
   the KIT, full touchpoint list per the architecture map. | per-district gate
   x6 configs | bespoke strip/casino (Paolo's hand) | new district LOOK =
   judge before volume.
6. (discovered, coordinator 7/25) RIG_B64/PREFAB_B64 byte-lock holes + sync-
   canon gaps (PLOTGEN/POWERGRID/FLOORPLAN/TRANSITIONS). NON-COOK item. |
   new byte-lock gates registered | — | no.
   (CITY 7/26 note: tools/bohemia_city_module_resync.py now re-syncs every
   engine module inlined in CITY_B64 and `--check` reports staleness, which is
   the freshness half of this item for the CITY app. It caught commercial +
   suburb + district_kit all silently behind. The remaining half is the same
   treatment for RIG_B64/PREFAB_B64.)

## COMBAT
1a. (discovered 7/26 by COMBAT, NOT ours to fix) THE RENDER PIXEL GATE IS FLAKY.
   It drives a live WALKING CITY and measures whatever draws happen, so the draw
   count swings ~19.8k-22.8k run to run. It failed once at 12.4% half-pixel draws
   against a 6% ratchet, then passed 4/4 on six consecutive runs (three on clean
   main, three with the same working tree that failed). A gate that can red-flag
   any lane at random will eventually get ignored, which is worse than no gate.
   Suggest: average N runs, or drive a FIXED deterministic route instead of a
   timed walk. Owning lane: ART/render. | — | gates/render_pixel_gate.js | no.
0. DONE 7/27 (v86): THE REST OF THE JUICE PASS, ON THE GRID. Item 1e's leftovers,
   built while he slept because they are the lane's top item that needs NO verdict
   ("no" thumbs, his own pick-list, his standing word "I want more juice").
   Auditing them first turned three of five into BUGS, and the MEASURING turned up
   two more the writing had missed.
   (a) THE SHOT FLASH WAS FRAME-COUNTED: flash-=0.08 PER FRAME = 208ms at 60Hz and
   104ms on his 120Hz phone. Not a duration, a refresh rate. Same defect class as
   the frame-counted hit-stop v81 killed, sitting untouched in a second place.
   (b) THE KILLSHOT PUNCH WAS A FRACTION OF ks.dur: the same white ran 0.167s
   behind a clean kill and 0.375s behind a sharp one.
   (c) AND THE ZERO WAS WRONG TWICE, both caught by the probe not by Paolo: keyed
   to ks.t the hit-stop PINNED it (measured 633ms of white); keyed to G._ksAt it
   never drew at all, because the HELD BREATH runs first and driveKillshotCamera
   early-returns through the whole thing. G._ksGo = the first frame the cinematic
   actually draws. Measured after: clean 91ms, sharp 115ms.
   (d) RECOIL comes home ON the next sixteenth (was dt*4.5 = 0.222s, between two
   notes). Measured 130ms. (e) THE HELD BREATH was 0.12 against a sixteenth of
   0.125 -- 4% off the grid. (f) PERMANENCE: the brass cap was 14, so the
   fifteenth casing silently deleted the first; now 96, still bounded, still
   cleared on a fresh fight. (g) THE IMPACT THROWS ALONG THE SHOT: twelve
   particles at k/12*6.28 is a perfect circle, the one shape a real impact never
   makes; now x1.30 down-range against x0.45 behind.
   NOT SHIPPED ON PURPOSE: THE CAMERA THAT LEADS. Every other item is a defect
   with a right answer; camera lead is a FEEL call with a dozen, and picking one
   while he is asleep is what STOP PRODUCING forbids. Stays on his pick-list.
   LAW: laws/BOHEMIA_ADDENDUM_EVERY_DURATION_IS_A_NOTE_7_27_26.md
   Gate section 21, 381 checks.
0. DONE 7/27 (v85): THE BROWN BOX AND THE ORANGE ONE, NAMED IN A CAPTURED FRAME
   AND BOTH DELETED. Five reports, five misses, then a reproduction first.
   scratchpad/spot.js: hook fillRect + drawImage + arc/fill + arc/stroke, convert
   every draw to SCREEN space via ctx.getTransform(), let the cinematic RUN, dump
   everything landing on the body at the frozen frame. It answered in one run:
     THE BROWN BOX   fillRect rgba(70,60,50,0.984) @197,272 42x50
     THE ORANGE ONE  arcFill  rgba(255,200,70,0.55) @197,237 9x9 + glow
   (a) THE BROWN BOX = drawKillshotWorld's LEGACY_PRE_REVAMP stand-in body. Its
   alpha is 1-ip*0.8 and ip=0 at contact, so it is a SOLID slab, and the freeze
   holds ks.t still so it stayed solid for the whole pause. DELETED.
   (b) IT WAS ALSO THE HEADSHOT ANSWER (0b, asked three times). Its own comment
   said so since 7/3/26: "still drops/fades ON TOP of the real sprite death
   playing underneath ... delete at cleanup." A 12-frame clip, three rolled
   variants, contact-timed, playing correctly, invisible under a placeholder.
   (c) THE ORANGE ONE = the JUICE.T gold payout chip. Spawns AT contact, flies on
   p.t, p.t rides dt, dt is 0 while frozen -- so it hung on the corpse for the
   whole pause. It no longer draws during a freeze: the stop belongs to the kill,
   the reward comes after it.
   (d) THE STOP IS A STILL, AND THE PAUSE IS PAID BACK. visNow() pins the body's
   clock during a freeze; every body timestamp then advances by exactly the frozen
   duration on release, or the clip snaps forward and the drop you paused FOR is
   the part that gets skipped (measured: frame 0 held, then straight to 4 of 12).
   LAW: laws/BOHEMIA_ADDENDUM_REPRODUCE_BEFORE_YOU_FIX_7_27_26.md
   Gate section 20, 368 checks.
0-prev. DONE 7/27 (v84): THE BROWN BOX + THE ORANGE, BOTH NAMED AND BOTH FIXED, and
   the instrument built so it never costs three turns again.
   (a) The brown box was a REGRESSION I CAUSED: v82 pinned _bpmPhase during the
   freeze, which pinned the JUICE.B floor pulse, which welds a full-screen
   orange-brown faction-accent wash on for the whole pause. The pulse no longer
   draws while frozen.
   (b) The orange was NEVER THE DIAL - it is the road's double-yellow median
   (rgba(184,160,40), 2x2670, ten times per pause), drawn AFTER the vignette that
   was supposed to dim it. Markings and lane dashes now fade with the shot.
   (c) WHAT'S ON SCREEN? - arm it, get a kill, the game names every draw covering
   >2% of the canvas into the comment box next to COPY.
   HARNESS LESSON: my probe kept freezing the game to photograph it, which stopped
   the cinematic it was measuring. Let it RUN and screenshot at 60ms.
   Gate section 19, 359 checks.
0a. UNBLOCKED 7/27 by v85 above -- the reproduction landed and both objects were
   named in a captured frame. History kept because the process lesson is the
   valuable part. WAS: *** BLOCKED. THE BROWN BOX + THE ORANGE DIAL ARE STILL ON
   HIS SCREEN AFTER THREE ATTEMPTS (v81/v82/v83). *** Post-mortem:
   records/BOHEMIA_COMBAT_POSTMORTEM_AND_RESEARCH_3_7_27_26.md
   The deploy DID land (8dcb1247 SUCCESS); the fixes were simply wrong. Root
   cause: THE KILL CINEMATIC CANNOT BE DRIVEN HEADLESS, so every fix was reasoning
   about code that was never watched running.
   DO NOT SHIP ANOTHER FIX FOR THIS WITHOUT A REPRODUCTION FIRST.
   HARD EVIDENCE captured by hooking CanvasRenderingContext2D.prototype during a
   killshot: rgba(184,160,40) drawn 108x as 2x2670 strips on cv = the orange dial
   parts, drawn OUTSIDE the _df alpha block. That is why tightening _df did
   nothing. Promising, NOT proven, NOT shipped.
   THE UNBLOCK (his call, neither built):
     (a) DEBUG CAPTURE in the build - during the freeze, name every draw covering
         >2% of the screen and print it in the combat log. One tap, he sends the
         text, the guessing ends for this and every future visual bug. Few lines.
     (b) A TEST HOOK that makes the killshot drivable headlessly, so this class of
         bug is reproducible forever.
0b. DONE 7/27 (v85), AND IT WAS NEVER A COOK. HEADSHOT 1 + HEADSHOT 2: the death
   clips already existed (L.death, 12 frames, three rolled variants, contact-timed
   off _deadAt). They were INVISIBLE because the LEGACY_PRE_REVAMP placeholder slab
   was drawn on top of them every killshot. Deleting the slab started the animation.
   STILL OPEN AS A JUDGE ITEM: he has never SEEN these clips, so the fall itself is
   UNJUDGED. If he wants a different fall, that is a fresh cook under LEAF-PIXEL +
   RIG + 45-DEGREE law -- but do not cook one before he has looked at the one that
   was already there.
0c. *** SUPPRESS - THIRD TIME HE HAS SAID IT IS CONFUSING. *** Research: XCOM's
   suppression confuses XCOM players too; its value "isn't self-evident" because
   both its effects are invisible until after the enemy acts. THE FIX IS NOT MORE
   MECHANICS, it is a LEGIBLE PROMISE sayable in ONE SENTENCE and shown ON THE MAN
   rather than in a readout. If the current version cannot be said in one
   sentence, that is the defect. [PENDING Paolo] what the promise is - three asks
   means he wants a RULE, not another tweak.
1b. DONE 7/26 (v83): THE BROWN BOX + THE DIAL THAT WOULD NOT LEAVE. From his
   screenshot. (a) The brown quad was #6c503b, traced to two LEGACY_PRE_REVAMP
   placeholder body blocks (brown torso rect + head square) from before real
   sprites existed; the killshot magnified them through the board zoom and the
   kill camera into a slab covering the frame. DELETED; a missing sprite draws
   nothing and logs it. (b) The dial's fade was a flat 350ms while a sharp shot
   contacts at 90ms, so it was 74% VISIBLE at impact. Now derived from the
   bullet's own travel time, zero at contact, every style and duration.
   Gate section 18, 346 checks.
1c. *** [PENDING Paolo / ART LANE] THE GETTING-SHOT ANIMATION CATEGORY. He said:
   "this would also be a great time to start the headshot fall animation and
   whatever category of animation we put towards people like getting shot." NOT
   STARTED - it is a COOK and it needs a declared category list plus his eye, not
   a guess. Governed by LEAF-PIXEL LAW (structure frozen, leaf only), RIG LAW
   (painted regions sacrosanct) and the 45 DEGREE LAW. The demo already rolls a
   _deathVar (3 variants) and has fall/land timing hooks (fallLanded, landDust),
   so the PLUMBING exists and what is missing is the named set of reactions:
   headshot drop, gut fold, spin, knocked-back, stumble-and-catch. HE NAMES THE
   SET. | leaf_pixel_gate + combat_anim_gate | combat demo | yes (thumbs).
1d. DONE 7/26 (v82): THE FREEZE HE COULD NOT FEEL - TWO DEFECTS, BOTH FIXED.
   (a) The killshot contact fired the WEAPON tier (0.125s) instead of KILL
   (0.500s); freeze('kill') only ever fired from finishHim and from your own
   death. (b) The freeze stopped the SIM but not the PICTURE - 27% of the screen
   was still changing because _bpmClock rides the AUDIO clock and drives the bob,
   floor pulse and kick pulse. The visual beat clock is now pinned; the audio is
   not. Measured clean: 43.67% of the screen changes while a killshot runs, 0.06%
   while frozen. GATE LESSON RECORDED: section 17 checked the TABLE and never the
   PATH. It now tests the path. 339 checks.
1e. DONE 7/26 (v81): THE QUANTIZED FREEZE - pick-list item 2, on his word
   ("Lets freeze the game for that snappy satisfying feelings then"). Law:
   laws/BOHEMIA_ADDENDUM_THE_QUANTIZED_FREEZE_7_26_26.md. Every freeze is a NOTE
   VALUE derived from BEAT (1/16 graze, 1/8 hit, 1/4 KILL = one whole beat, 1/2
   last man). A killshot is a REST IN THE MUSIC. Directional shake decays INSIDE
   the freeze. ONE arming function, named tiers only.
   *** AND IT UNCOVERED A REAL BUG: the old hit-stop counted FRAMES, so every
   impact in the game was running at HALF WEIGHT on a 120Hz phone, which is what
   Paolo has been judging feel on. ***
   Gate section 17, 335 checks, and the invariant REJECTS the old frame counts.
   STILL OPEN FROM THE JUICE PASS (item 2 of the pick-list is only PARTLY done -
   the freeze and the shake landed, these did not): PERMANENCE (casings, impact
   scars and blood persisting for the encounter - Vlambeer rates it top-tier and
   it is nearly free), 1-2px RECOIL/KICKBACK snapping back on the next 16th,
   MUZZLE FLASH + a directional impact burst, a CAMERA THAT LEADS the shot, and a
   ONE-FRAME FLASH reserved for killshots only. All cheap, all quantized, no
   rules change. | gate: every juice duration is a note value | combat demo | no.
1g. *** THE MERGED COMBAT PICK-LIST (both research docs, ONE order). ALL
   [PENDING Paolo] - he picks, then I build. Docs:
   records/BOHEMIA_COMBAT_RESEARCH_TURN_BASED_GRID_7_26_26.md (part one) and
   records/BOHEMIA_COMBAT_RESEARCH_JUICE_VERTICALITY_COMPANIONS_7_26_26.md. ***
   1 THE PROVING GROUND - one GREYBOX arena as an INSTRUMENT not a level:
     two-storey block + stairs + open ledge, hard and soft cover, a long lane, a
     tight room, an open middle, dials for enemy archetype/count, and a toggle
     per juice effect so any one can be A/B'd alone. He asked for this by name
     ("an actual arena map where we test out different AI and the feel of it").
     HIGHEST LEVERAGE: it makes every other item judgeable instead of arguable.
     | gate: the arena exists, every element present, every toggle independent |
     combat demo | Paolo plays = the verdict.
   2 THE JUICE PASS, QUANTIZED - hitstop as a NOTE VALUE (1/16 graze, 1/8 hit,
     1/4 killshot, 1 bar last-man-down) so the freeze IS the 120 BPM clock and a
     killshot is a rest in the music; PERMANENCE (casings, scars, blood stay);
     1-2px recoil snapping back on the next 16th; directional shake decaying
     INSIDE the hitstop; muzzle flash + directional impact burst; camera lead;
     a one-frame flash on killshots ONLY. | gate: every juice duration is a note
     value, no exceptions | combat demo | no.
   3 ENEMY INTENT ON BY DEFAULT (part one item 1). FORESIGHT stops being the
     source of intent and buys something else. | gate: intent shown every turn |
   4 SHOVE AS A REAL ONE-TILE PUSH with collision damage (part one item 4).
     Becomes DEFENESTRATION the moment floors exist. | gate: push resolves
     against occupancy, collision damages both |
   5 AI ARCHETYPES WITH RHYTHMIC SIGNATURES - archetype-specific utility
     FUNCTIONS (not weight tweaks) + a musical tell per archetype (downbeat /
     offbeat / every other bar / reactive). | gate: each archetype's action
     lands on its declared note value |
   6 COMPANIONS ON STANCES - HOLD / PUSH / COVER ME / GET OUT, set once, one
     tap, NEVER per-turn (micromanagement is the named killer), ally acts ON THE
     BEAT. Foundation already RULED (item 0, ally spawn/target/down-never-dead).
     WHO they are and what they say is [PENDING Paolo], contents his.
   7 TWO AND THREE STOREY COMBAT - stairs as chokepoints (one-body-per-cell is
     already law, so a man on a stair is a cork), height beats cover and exposes
     you, ledges drawn honestly (XCOM 1's trap-slopes are the warning). The
     LAYERING law + INTERIOR-MATCHES-EXTERIOR already speak multi-storey; only
     combat does not. HIGH cost, biggest change.
   8 TURN CLOCK = THE SONG'S FORM (part one item 0) - 5 turns, turn N = section
     N, reaches the 0:48 payoff every fight without costing the NEW ENCOUNTER
     song change. Real rules change, HIS call.
1f. [LOGGED 7/26, HE SAID DO NOT CONTINUE] PULSE VOICES sound "elementary school
   hi-hat metronome shit". They borrow each song's kit by design (v75) - which
   worked for sounding like the record and failed for sounding like a fight. The
   answer is a DEDICATED COMBAT PERCUSSION BANK (casings on concrete, boot on
   gravel, door slam backbeat, distant generator). That is a COOK: needs a REUSE
   CHECK against banks/ and HIS ear before a voice is drawn. Do not start it
   until he says. | reusefirst_gate + song_lock | combat demo | yes (thumbs).
1i. DONE 7/26 (v80): SOFT THE WHOLE FIGHT + THE HEADROOM TRIM. Paolo retired his
   own v79 top rung ("forget about it going hard at five kills... a lot of volume
   fighting each other"). HARD_AT=Infinity; AUTO is SOFT forever; his 2/4 rungs
   carry the climb. The volume complaint was measured (16.2 -> 24.2 -> 41.8
   voices/bar, ~+4.1dB into one master with no trim in front of a -14dB limiter)
   and fixed the way a mix engineer would: the master trims 1.00/0.82/0.68 as the
   rungs land, ramped, reset per fight. Net +0.8dB instead of +4.1dB. Master gain
   ONLY - no note, voice or pattern touched. Gate section 16, 316 checks.
1h. *** RESEARCH ON THE SHELF, NOTHING BUILT, ALL [PENDING Paolo]: ***
   records/BOHEMIA_COMBAT_RESEARCH_TURN_BASED_GRID_7_26_26.md - six games (Into
   the Breach, Slay the Spire, XCOM 2, NecroDancer, Divinity OS2, game-feel
   literature), seven ranked ideas, sourced. Top three:
   (a) QUANTIZED HITSTOP: freeze for a NOTE VALUE (1/16 graze, 1/8 hit, 1/4 on a
       killshot) so the impact freeze IS the 120 BPM clock instead of breaking
       it. Cheap, no rules change, biggest feel-per-hour. | gate: every freeze
       length is a note value | combat demo | no.
   (b) ENEMY INTENT ON BY DEFAULT: ITB/StS are built on perfect information;
       Bohemia has it as a perk (FORESIGHT), off. Cheap, UI job. | gate: intent
       shown for every enemy every turn | combat demo | no.
   (c) THE TURN CLOCK = THE SONG'S FORM: ITB fights are 5 turns then the enemies
       retreat. A fixed turn count is a fixed number of BARS, so turn 1 = section
       A ... turn 5 = section D. Reaches the 0:48 payoff EVERY fight without
       persisting anything and without costing the NEW ENCOUNTER song change -
       the v76 problem solved from the other end. Real rules change, HIS call.
   ALSO: widen the timing windows (NecroDancer shipped ~100% leeway because the
   challenge belongs in the TACTICS, not the timing - a warning aimed at my
   55/110ms grades); make SHOVE a real one-tile PUSH with collision damage
   (ITB's best verb is displacement); ENVIRONMENT (elevation, destructible
   cover, Vegas surfaces) is still the thinnest part of the fight; and NEVER add
   a hidden hit roll on top of a good dial press (XCOM's unsolved problem that
   Bohemia already solved) - that one should become a law.
1k. DONE 7/26 (v79): THE PULSE JOINS THE LADDER. Paolo's design, locked and
   shipped same turn. Law: laws/BOHEMIA_ADDENDUM_THE_PULSE_JOINS_THE_LADDER_7_26_26.md.
   0 kills PULSE SOFT / 2 his rung 1 / 4 his rung 2 / 5 PULSE HARD. The pulse
   stops being a parallel system and becomes his ladder's floor and ceiling.
   Keys off _sk so downed men (V71) and the GROOVE chain (v74) both count: a full
   chain reaches HARD with nobody down. Button AUTO->SOFT->HARD->OFF, manual
   still wins. Gate section 16 executes the ladder at every rung (310 checks).
1j. *** [PENDING Paolo] THE OVERWORLD INTENSITY DRIVER. *** He asked how the 2/4
   progression could apply CALMLY outside combat. ANSWERED IN THE LAW ABOVE,
   NOT BUILT. Recommended driver: LIGHT = TERRITORY + CLUSTERED POWER (rung 1
   in lit owned blocks, rung 2 deep in a grid, calm in the dark) because it
   needs no new lore, is visible on screen, and carries the same cargo as two
   men down without violence. The CALMLY half is mechanism and mine: rungs enter
   on a SECTION BOUNDARY with a one-bar fade so it reads composed, not triggered.
   Supersedes/absorbs item 1n (the MUS.layers dead path). Blocked on his ruling.
   | gate: the driver is posted from the world, layers enter on a boundary |
   parent MUS + CITYMUS, a DIFFERENT sequencer from combat | no.
1l. DONE 7/26 (v78): NEW ENCOUNTER = NEW SONG. Paolo RULED OUT the v76 play-out
   swap ("that's so fucking retarded bro"). Deleted outright, no dead flag left.
   The v76 diagnosis was right and the lever was wrong: persisting the song fixed
   the FORM at the cost of the thing the button is for. RULE LEFT BEHIND: a fix
   that trades what the player feels NOW for what they would feel LATER is a BET,
   and it is his to place. Survives: the single pull point (the bag was drained
   twice an encounter), the pulse yield, the corrected measurement.
   COST ON THE RECORD: combat hears ~the first 40s of a song again; the 2:08 form
   and its 0:48 payoff stay unreachable in a fight. ANY future answer must NOT
   cost him the NEW ENCOUNTER song change. [PENDING Paolo] and not mine to retry.
1m. DONE 7/26 (v77): HIS SONGS ARE CANON + SONG LOCK GATE. Law:
   laws/BOHEMIA_ADDENDUM_HIS_SONGS_ARE_CANON_7_26_26.md. Paolo asked whether the
   music work had touched his actual songs. It had not (every body hashes
   identical from 70e2061), but a promise is not enforcement, so the worry became
   a gate the same turn. gates/song_lock_gate.js byte-locks OVERWORLD_SONGS,
   MLOOPS, MFACTIONS, SONG_ARR/ROOT, synthV, drumV, the 7/3 rungs and the klay
   styles against records/BOHEMIA_SONG_LOCK.json. Proven by tampering SLOW
   CREEP's kick and watching the build fail. NOT a ban on new music: the music
   lane runs --write and says why, which puts the change in the diff.
   FLEET NOTE: any lane that legitimately changes a song must now run
   `node gates/song_lock_gate.js --write` in the same commit.
1o. DONE 7/26 (v76): THE SONGS PLAY OUT + THE PULSE YIELDS. Law:
   laws/BOHEMIA_ADDENDUM_THE_SONGS_PLAY_OUT_7_26_26.md. v75 APPROVED BY EAR.
   (a) Corrected my own 4x error: the creepers run 2.17 kicks / 2.33 hats a bar,
   not 0.54/0.58; the gate now DERIVES the unit from stepDur. Placement is the
   sharper finding: nothing kicks on beat 2, one kick in the pool on beat 4.
   (b) His songs are 2:08 arrangements with the FULL section at 0:48, but every
   NEW ENCOUNTER reset them to bar 0, so he only ever heard the first 40s. Combat
   now waits for a full 1024-step pass before swapping, exactly as CITYMUS
   already did in the overworld. V71's bag fix stands; only the frequency changed.
   (c) The floor now YIELDS instead of doubling 11 kicks and 14 hats his songs
   already played.
   *** STILL FROZEN: every timing mechanic in 1v / 1t / v74's chain. ***
   *** [PENDING Paolo] should the 2/4 rungs unlock the MELODY at all, or only
   energy, or should kills FAST-FORWARD the form instead of unlocking it. His
   7/3 LOCKED law owns those rungs; nothing was moved. ***
1n. (discovered 7/26, NOT fixed, needs HIS ruling) THE OVERWORLD KILL LADDER IS
   A DEAD PATH. MUS.layers starts at 0 and the only assignment in the whole build
   is the studio's CALM/2 KILLS/4 KILLS preview buttons, so the four melody-klay
   creepers can never bloom in the city or the run. What drives intensity out
   there is lore. | gate records the single assignment | — | no.
1p. DONE 7/26 (v75): THE FIGHT PULSE. Law:
   laws/BOHEMIA_ADDENDUM_THE_FIGHT_PULSE_7_26_26.md. Paolo froze new timing
   mechanics until the music and the button work together, so the encounter
   music got COUNTED instead of clock-fixed a sixth time: his creepers average
   0.54 kicks / 0.58 hats a bar (four-on-the-floor is 4 / 8), all half-time. He
   was trying to lock to a pulse not in the recording. His songs untouched; a
   combat-only FLOOR under them in the song's own kit (kick on 4, eighth hats,
   backbeat on 2+4), thickening with the groove chain, plus the count is now the
   song's hat instead of a 415Hz UI beep. PULSE: HARD/SOFT/OFF for an honest A/B.
   *** EVERY TIMING MECHANIC IN 1v / 1t / v74's chain IS FROZEN until Paolo
   rules on this. A SECOND rejection ends the rhythm direction for the session. ***
1w. DONE 7/26 (v69): the four rhythm-game pillars - approach ring, graded press
   with a persistent ms strip, the shot plays a note in the song's key, and a
   SYNC tap-calibration. Law + what is still missing:
   laws/BOHEMIA_ADDENDUM_WHAT_MAKES_IT_A_RHYTHM_GAME_7_26_26.md.
1v. RHYTHM AS DIFFICULTY (next, from that addendum): the 52 dial patterns are
   curve shapes, not rhythms. A rhythm game gets harder by getting more
   syncopated, not faster. Author patterns as note values against the bar.
   | gate asserts each pattern's kill moments land on declared note values |
   the PHASE re-bake machinery exists, reuse it | new dial feel = he plays it.
1u. THE WHOLE FIGHT ON THE GRID: the return volley, deaths, steps and camera
   hits are not quantized, so only the dial is musical. | gate proves every
   fight event resolves on a beat | 120 BPM law | no.
1t. A COUNT-IN BAR when an engagement opens, so you enter already inside the
   pulse. | — | do not delay the pop itself | no.
1z. DONE 7/26 (v68, Paolo's 120-BPM-FIRST law): every dial cycle is a whole BAR
   (44% of pattern x difficulty combos could never land the perfect shot on a
   downbeat), the PHASE table re-solved against it, and the press is now a
   REQUEST granted on the beat. [PENDING Paolo] whether the POP should be
   beat-gated too (it would neutralise the ON THE ONE streak reward).
1y. (discovered 7/26) THE DIAL ENGINE HAS NO MASTER. The stamped block says
   "edit engine/bohemia_engine.master.js then re-stamp"; that file and the
   stamper do not exist anywhere in the repo. Either restore a master + stamper
   or delete the misleading header. NON-COOK. | a sync/byte-lock gate for the
   engine block | — | no.
1a. DONE 7/26 (v67, straight from Paolo playing it): dial locked to the AUDIO
   clock + whole-bar cover cycles; suppression turn-based and legible; sprint
   costs stamina and the refill no longer refunds it; sprint/dash mutually
   exclusive with the armed move named on the ring. [PENDING Paolo] the cycle
   rebalance it forced: package 2 slowed 6->8 beats, package 3 quickened 6->4.
0. ALLY-IN-COMBAT foundation (RULED 7/26, companions addendum): the encounter
   system supports friendly combatants on the player's side — spawn, target
   correctly, go down but never permanently die. Mechanism only; WHO joins
   and companion personalities are Paolo's/quest canon. | proven headless: an
   ally fights alongside through the real bus, downed ally never deleted |
   CITY_B64 | no.
1. DONE 7/26 (v66): encounter handoff hardening for the RUN. Contract:
   laws/BOHEMIA_ADDENDUM_RUN_HANDOFF_CONTRACT_7_26_26.md. Quest context in,
   dead/spared/fled out, declared LEAK LIST, cold handoff with the tab never
   opened, READY queue, abort, loud errors, no splash. 5 back-to-back
   EXECUTED headless in combat_lab_gate sections 5-6, plus a real-surface
   Playwright proof. The cold handoff went 12.9s -> 14ms (blocking font).
2. Combat grammar graduation: stack candidates in ONE judge surface. | judge
   reachable from alpha, side-by-side anchors | — | yes (thumbs then build
   the winner).
3. (discovered 7/26, RUN lane's call) The alpha SHELL carries the same
   render-blocking cross-origin font link the combat demo did. Combat fixed
   its own blob only (lane discipline). Same one-line fix, whole-game boot
   payoff: `media="print" onload="this.media='all'"`. NON-COOK.
4. (discovered 7/26) The demo's melee/nerve loop re-rolls `pickRandomFaction`
   twice on a quest handoff (startGame + the shuffle hook). Harmless, same
   distribution, but it is duplicate work on the enter path. NON-COOK tidy.

## CHARACTER  (LANE LAW 7/26: laws/BOHEMIA_ADDENDUM_THE_RIG_IS_LAW_7_26_26.md
## — the rig is the starting point of ALL body/anim work; RIG CHECK mandatory;
## AND laws/BOHEMIA_ADDENDUM_SHADOWS_ARE_SEPARATE_7_26_26.md — shading never
## baked into asset pixels, render-time layer only. First items of the lane's
## next session: the rig-check gate assertion + the shading-separation gate
## assertion, same turn.)
1. (DONE 7/26 -- records/BOHEMIA_BODYVAR_SLIDERS_7_26_26.txt) ONE-RIG VARIATION
   SLIDERS. Shipped with gates/bodyvar_gate.js + a real-browser clip-set sweep.
   The RANGES are now waiting on Paolo's thumb; do not re-cook them, and do not
   wire per-NPC randomisation until he rules on it.
1b. (MEASURED BY THE CITY LANE 7/27, handed over untouched — ONE SYSTEM, ONE
   SESSION) EVERY CHARACTER SURFACE IS DISPLAYED AT A FRACTIONAL SCALE. The
   city lane built tools/bohemia_canvas_scale_audit.js to catch its own canvas
   being bilinear-upscaled to the phone screen, and the same sweep measured
   yours. These are CSS-box-vs-backing-store ratios on a real iPhone-portrait
   DPR-3 browser; `image-rendering:pixelated` is already set on all of them, so
   the failure mode is not blur, it is UNEVEN PIXELS - some source pixels land
   3 screen pixels wide and some 4, which reads as a wobbly, badly drawn
   sprite, and it is worst on the biggest one:
       char    #charCv      112x112 -> 358.8 css   x3.2035   (glass x9.61)
       char    #portraitCv   64x64  -> 120 css     x1.8750   (glass x5.63)
       clothes .cloBig       56x56  -> 150 css     x2.6786   (glass x8.04)
       clothes .cloCv        56x56  ->  52 css     x0.9286   (a minification)
       anim    #g8_0..7     112x112 ->  85.8 css   x0.7660   (drops ~23% of
                            every row and column - on the gallery the anims are
                            JUDGED from)
       rig     #cv          336x336 -> 336 css     x1, but image-rendering is
                            `auto`, the only canvas in the game with no filter
                            set at all: at DPR 3 the rig preview is a bilinear
                            x3 smear.
   The fix is integer boxes (charCv 112 -> 336 css = x3, portraitCv 64 -> 128,
   cloBig 56 -> 168 or 112, the g8 gallery baked at 56 rather than shrunk from
   112) plus `image-rendering:pixelated` in RIG_B64, which has none. Each one
   nudges an element's size, so it is a look call as much as a fix. Reproduce
   with: node tools/bohemia_canvas_scale_audit.js
   slices/BOHEMIA_ALPHA_0_9.html | gates/canvas_scale_gate.js already PRINTS
   these every run and deliberately does not fail on them; make them yours and
   turn them into assertions | measured, not read | no.
1c. (MEASURED BY THE ART LANE 7/27, handed over untouched — ONE SYSTEM, ONE
   SESSION) THE SHELL HOLDS 2217 LIVE CANVASES once every tab has been opened.
   Different sweep, different concern from 1b: that one is about how canvases
   are DISPLAYED, this one is about how many of them EXIST. The memory probe
   (tools/bohemia_canvas_memory_probe.js) counts 2604 live canvases across the
   alpha at ~21 KB each = 53.8 MB of pixels, and 2217 of them are in the shell
   itself, which is where char / clothes / anim live. They survive a forced
   garbage collection, so they are RETAINED, not garbage waiting to go. Nothing
   is on fire: the whole build peaks at ~98 MB resident = 44% of the 224 MB iOS
   floor. But no single one of those canvases looks wrong, which is exactly why
   this went uncounted until now, and the tile set is about to multiply. Likely
   shape of the fix: one canvas per THUMBNAIL kind reused, or the previews drawn
   into a shared atlas, rather than one per garment/frame retained forever.
   Reproduce with: node tools/bohemia_canvas_memory_probe.js (see by_frame in
   records/target/BOHEMIA_CANVAS_MEMORY.json). gates/canvas_memory_gate.py
   ratchets the total and deliberately does not fail on the count | measured,
   not read | no.
2. Wardrobe: new SHAPES (structure-not-color), taste-filtered before
   surfacing. | structure_gate | — | fresh shapes = thumbs.
3. Music pool volume in approved styles, taste-filtered. | music gates | — |
   fresh songs = thumbs.

## QUESTS — HIBERNATED (Paolo 7/26, laws/BOHEMIA_ADDENDUM_QUESTS_LANE_
## HIBERNATED_7_26_26.md). Do NOT pick up items below; no "quests" sessions
## until Paolo reopens the lane. All shipped quest work stays live and gated.
1. DONE 7/26 (S10-S21 shipped, corpus 9 -> 21, gate hardened with 5 new checks,
   laws/BOHEMIA_ADDENDUM_TWELVE_MORE_CANON_QUESTS_7_26_26.md). Sitting is live in
   the alpha: LIFE tab -> THE 12 NEW CANON QUESTS. Awaiting thumbs.
2. Act-1 main-quest beats from the locked lore (cold open -> flash-flood climax)
   drafted as .bq chains. START by querying records/BOHEMIA_QUESTBOOK_LAW_INDEX.json
   (QUEST STUDY LAW) and cite what you build from. | same bar as S10-S21, plus
   chain continuity proven headless | engine code, the alpha | yes.
2b. (discovered 7/26) The PORTS master is a 1,276-item BUILD QUEUE written for
   Bohemia by name and almost none of it is built. Mine it for the next quest
   batches instead of inventing shapes. NON-COOK triage first: list the ports
   that are already satisfied vs open. | the index makes this queryable | — | no.
3. (discovered 7/26) MULTI-QUEST CHAIN SUPPORT: nothing in the format or the
   runtime lets quest B read that quest A resolved (S09 -> S06 is a chain only in
   prose). Act-1 beats need it. NON-COOK item: a cross-quest flag surface on
   ctx.quests + a gate proving A's ending really opens B. | new gate section |
   the .bq format's no-stat-gates law is untouchable | no.
4. (discovered 7/26) The batch plants unread flags (opened_the_deep,
   aired_the_method, killed_the_token, walked_them_out, owes_the_cartel,
   sold_the_forger). Nothing consumes them. Wiring them to world beats is
   [PENDING Paolo] at the canon level; the mechanism half is item 3.

## SHARED / ANY IDLE SESSION (non-cook)
1. VERDICT TOOLING upgrade per the doctrine: one AGGREGATED judge page across
   lanes grouped by discipline, side-by-side anchors, APPROVE/CBB/KILL
   buttons, kill-reason tags, .txt export. | replaces per-lane judge sprawl;
   gate: the page exists + exports parse | — | no (tooling, not art).
2. [PRIORITY UP 7/26, Paolo direct order — approved-assets-first addendum]
   CANON EXEMPLAR INDEX + KILL-REASON TAXONOMY distilled from banks +
   graveyard post-mortems (machine-readable; cooking tools cite which
   exemplar anchored each cook). | reusefirst-style gate extension | — | no.
3. DRIFT CANARY harness: re-render fixed approved anchors, diff vs blessed.
   | canary gate registered | — | no.
