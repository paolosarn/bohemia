# BOHEMIA — THE RUN INTEGRATION LEDGER

Paolo's ruling 7/26 (laws/BOHEMIA_ADDENDUM_THE_RUN_IS_THE_INTEGRATION_LANE_7_26_26.md):
the run lane's job is to get EVERYTHING the fleet has built into the one thing he
plays. This file is the scoreboard, and `gates/integration_gate.js` enforces it:

  **A row may not be marked INTEGRATED without a machine probe that proves it.**
  An INTEGRATED row with no probe, or a probe that fails, turns the gate RED.

Statuses: `INTEGRATED` (really in the run, probed) · `PARTIAL` (some of it, named)
· `NOT YET` (honestly absent). No other value is legal.

<!-- SURFACE-MEASURED: slices/BOHEMIA_RUN_CURRENT.html -->
<!-- MEASURED 8/21 BY ASKING THE PROBES, NOT BY READING THEM: blank the run slice
     and re-run every probe, and exactly ONE of the thirty INTEGRATED rows still
     answers yes. The gate prints that split on every run now, so a reader can no
     longer reach the greens before the caveat. -->
<!-- SURFACE-SHOWN: slices/BOHEMIA_CITY_WORLD.html -->

> ## ⚠ WHAT THIS SCOREBOARD MEASURES, AND WHAT PAOLO SEES, ARE TWO DIFFERENT FILES
>
> **Every probe below reads `slices/BOHEMIA_RUN_CURRENT.html`. The RUN tab does not
> display that file.** Since 7/28 the alpha routes RUN to the city panel — one line,
> `var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;` — so tapping RUN shows
> `slices/BOHEMIA_CITY_WORLD.html`. Measured on the real alpha 8/4: after tapping RUN
> the only visible panel is `p-city` at 390x790; `runFrame` exists in the DOM with
> `src="BOHEMIA_RUN_CURRENT.html"` and is never shown.
>
> **This does not mean the rows are lies.** They are true about the file they name.
> It means *the greens below are not evidence about the surface he plays*, and no
> reader can tell which ones are, because the scoreboard never said which door it was
> looking at. Spot-checked 8/4 across 18 systems: most ARE on his surface — the CITY
> lane ported rig, wardrobe, portraits, walk cycle, body sorting, agents, floorplans,
> doors, save/load, the resolver, combat and music, each under its own spelling. At
> least one (**clout / feed / followers**, marked INTEGRATED) has no trace in the city
> frame at all. And `makeSim(` — the agent simulation — is **defined in the city frame
> and called zero times**, so schedule-level and sim-level work lands only in the
> invisible file.
>
> Fixing this is the RUN lane's call and it is not mechanical: either the ledger
> re-points at the shown surface, or the run slice becomes the shown surface again.
> Both are real decisions with real consequences. **What is NOT optional is that the
> document says which door it is looking at**, which is what the two comment tags
> above do and what `gates/surface_truth_gate.js` now enforces.
>
> *(Filed by the PEOPLE lane 8/4 after making this exact mistake twice in one day:
> once on the identity card 8/2, once claiming a walk fix would show on his surface
> when the sim that uses it never runs there. A check pointed at the wrong door is
> this repo's most expensive recurring bug.)*

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
| factions / world bridge | INTEGRATED | world_bridge | quest outcomes really move faction standing, and the run applies them the moment a quest resolves |
| faction consequence on screen | INTEGRATED | world_bridge_shown | 8/9: the six-week PARTIAL above is closed. The phone's feed card now shows what the quest actually COST, under the vanity follower count: HOW FAR THE WORD CARRIED (the clout tag's real reach -- #quiet 7 tiles, #reckless 24), WHICH FACTIONS MOVED and the rung they now sit on (read off the live FactionWorld, not the quest's scratch), and WHO GOT STIRRED UP (@DO faction_posture). Verified in a real browser: 'The Toll Road - COMPLETE / +110 followers / WORD CARRIED 24 TILES / CARAVANS +10 - NEUTRAL / CARTEL STIRRED UP'. Nothing new was computed; the run simply never loaded the modules that were already built and gated |
| the sixteen introductions | INTEGRATED | introductions_shown | ON THE WALKED SURFACE (CITY WORLD) SINCE 8/14 -- it shipped 8/12 into the run slice, which the alpha preloads and never displays, so for two days this row was TRUE ABOUT A FILE NOBODY SEES. Migrated by tools/bohemia_city_factions_patch.py; gates/walked_surface_gate.js now checks WHERE, not just whether. 8/12: every faction dossier Paolo thumbed UP on 8/2 carries a WHEN YOU ASK THEIR NAME section and every one of them is a DIFFERENT mechanic -- half say the word out loud. They sat unread for ten days while the game gave all sixteen the same full name for the same press. engine/bohemia_introductions.js is GENERATED from records/factions/*.md and pinned to it by a verbatim ANCHOR per rule (the generator refuses to run if a dossier is reworded). In the run: the card's NAME row is rewritten from the organ so it can never print people.js's full name next to the organ's handle, the one button's label and outcome come from the organ, and three of the sixteen correctly have NO button. Verified in a real browser, not by grep: a forced Trades member reads SCAVENGER with HIRE THEM TWICE underneath and no row leaks the real name; move real Blues standing and the card turns from THE BLUES into a person by itself. Three earning conditions (work, vouch, overheard) have no system yet and are treated as FALSE, never assumed |
| the valley's people know each other | INTEGRATED | ties_shown | ON THE WALKED SURFACE (CITY WORLD) SINCE 8/14 -- same story: shipped into the run slice, dark until migrated. 8/12: every person in Bohemia was an island, which is why four of his dossiers that ask for a THIRD PARTY (Mob vouch, Remnants overheard, Colorful onward, Caravans 'nobody vouches for') could never resolve. engine/bohemia_ties.js derives an acquaintance graph from the three foci the engine ALREADY stamped on every agent and had never used socially -- the roof, the job site, the outfit -- grounded in Feld 1981's focused organization of social ties, with Dunbar's layers as a measured ceiling (400 in one outfit come out holding 49.1 acquaintances against a layer of 50). In the run: the vouch and the overheard conditions now answer, and the card prints WHO introduced you and how they know each other. Verified by playing the whole Mob story through the real DOM -- ask directly and get nothing, earn a neighbour's name, watch their word open the door. The roster is ONE BLOCK and a cross-cell faction tie does not exist; that limit is stated in the module, the gate and the law rather than faked |
| what a faction wants from you | INTEGRATED | belonging_shown | ON THE WALKED SURFACE (CITY WORLD) SINCE 8/14 -- same story: shipped into the run slice, dark until migrated. 8/12: two turns built a door (sixteen ways to learn a name) and a lock (the Mob will not be asked), and then you were through it with NOTHING IN THERE. Both halves of the answer had been in his dossiers since 8/2, thumbed up and read by nothing: WHAT THEY WANT FROM YOU and WHAT THEY TRADE/CONTROL. Now the person card carries the whole bargain -- what the outfit wants in three words, what it holds, what it pays in, what it refuses, and whether it moves first (the Cartel and the Church both help you before you agree to anything, which is the same mechanic with opposite intent and the game never says which one you are in). HOW FAR IN YOU ARE walks Lave & Wenger's periphery-to-inside gradient off a COUNT of positive authored deeds in save.meta.gave, NOT off standing -- gated by driving a real quest: +6 then +1 is two deeds, not seven. Verified on the real card in a real browser, where the gate caught a live bug: the world bridge writes under the FactionWorld id and the card asked with the quest's @ROLE token, so the ladder would have read 0 forever |
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
| the cooked perimeter wall (8/2, 11 designs approved) | INTEGRATED | banks_used | the community wall wraps the block Paolo walks, one design per plot, with pillars along the run and a gate assembly in the aperture (banks/BOHEMIA_PERIMETER_8_2_26.txt). MEASURED, not asserted: banks_used_gate sweeps the whole cell and counts the draws, and tools/bohemia_perimeter_shot.js walks the player to it and shoots the frame. It SUPERSEDED his 7/14 pool on a measured difference (his edge 5.8 against a floor of 14.27 derived from the tiles he bought), and on 8/2 he SETTLED it: all thirteen of his own walls thumbed down, eleven of my eighteen thumbed up. Only those eleven ship, each as a pool of eight face and eight base variants shuffled per cell — because one tile per design stamped its single crack on every cell of the wall at 44px pitch, which is what he meant by "looks like it's glitching out". My first version of the draw probe sampled five spots near the front door and reported ZERO, because the wall is twenty tiles away — a probe that only looks where you already are will tell you approved art is missing. |
| music OFF really silences | INTEGRATED | music_bridge | MUS.stop() cuts the MASTER GAIN, not just the scheduler. Notes already booked into the audio graph used to keep sounding after the button said off (7/27 law: OFF MEANS SILENT). |
| the d-pad is a control, not text | INTEGRATED | touch_guard | the run is loaded by iframe SRC while the other three tabs are base64 blobs, so the 7/27 touch guard skipped it and iOS raised the copy/paste menu on every direction press. Guard lives in the DEV SOURCE; the generated file is rebuilt and would erase it. |
| ONE VEGAS (run and city, same seed) | INTEGRATED | one_seed | the run and the city were two different valleys: hashSeed('bohemia')=2691674296 against a hardcoded 2026. Same world now, plus a run->city position bridge so the city menu shows where you actually are, and a CHOSEN home cell [39,23] (23 district kinds within 6 cells, 0 from an edge) instead of first-suburb-in-scan-order, which was always the map rim. |

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
