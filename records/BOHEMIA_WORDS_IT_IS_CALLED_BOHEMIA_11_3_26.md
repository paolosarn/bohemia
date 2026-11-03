# IT IS CALLED BOHEMIA (WORDS 2, 11/3/26; VAMILY rule 362, ask line 386)

Paolo 11/3: "don't put any writing anywhere that's called Las Vegas. Bohemia is Las Vegas... scour all the lines of any text in
the game if it's called Las Vegas, no, it's called Bohemia."

## 1. THE MEASURE (before, at 5c915d7a, by the gate below run on a clean copy of that commit)

THE SURFACE: found by following the pages, not a hand list. From slices/BOHEMIA_DEMO.html, slices/BOHEMIA_ALPHA_0_9.html and
slices/BOHEMIA_VOTE_TAB.html, every page and data file they reference inside the three published folders (slices/, engine/,
records/target/), the alpha's dev-tab frames (data-src) NOT followed: 9 game pages (the demo, the alpha, the map
BOHEMIA_CITY_WORLD, the fight, the spoils, the town BOHEMIA_SETTLEMENT_SCREEN, the crew BOHEMIA_ROSTER_SCREEN, the phone
BOHEMIA_CURRENT_SLICE, VOTE), 86 data files, 193 files; plus the 41 pages that VOTE cards still waiting show.

119 player-readable "Vegas" in 17 files:

| count | file | what |
|---|---|---|
| 50 | engine/BOHEMIA_REGION_LAND.json | the map's places and districts: LAKE LAS VEGAS, LAS VEGAS BAY, LAS VEGAS VALLEY (every district's neighbour list, every road crossing, every road end), LAS VEGAS BLVD N (NV-604); two notes |
| 26 | records/target/bb/feed_world.json | 22 world posts ("my grandson is in las vegas", "convoy for vegas leaves friday") and the accounts' voice notes |
| 8 | records/target/bb/feed_kinds.json | the weather bot @wx_vegas_auto (handle, name, three acts) and its three "Have a great day, Vegas!" posts |
| 8 | records/target/bb/region_bases.json | THE EYE AT LAKE LAS VEGAS (name, id, place join), notes |
| 5 | records/target/BOHEMIA_VOTE_REGISTRY.json | four cards still waiting (quests' contract kinds and road events, economy's crashes, cook 4's ranch) |
| 3+3 | slices/BOHEMIA_ALPHA_0_9.html, slices/BOHEMIA_DEMO.html | THE START SCREEN: "POST-ECONOMIC APOCALYPSE - LAS VEGAS"; two cold-open tile notes |
| 3 | slices/BOHEMIA_CITY_WORLD.html | the map key "THE STRIP (Las Vegas Blvd)", "WELCOME TO FABULOUS LAS VEGAS (the sign)"; boss 47's verb "deal again, and Vegas earns the way Vegas earned" |
| 3 | records/target/bb/factions.json | the eye's seat id and notes |
| 3 | slices/vote/WORDS_THE_WORLD_FEED_11_3.html | this lane's own waiting card (its lede and two posts) |
| 1+1 | slices/bohemia_ui_crashbox.js, slices/crashbox/crashbox.json | THE LOADING SCREEN: the camera's miles readout "LAS VEGAS 6 MI" |
| 1 | slices/BOHEMIA_CURRENT_SLICE.html | THE PHONE: "@founder_gen1 · post-collapse Las Vegas" |
| 1 | slices/BOHEMIA_SETTLEMENT_SCREEN.html | the town screen's default name "THE WASH, NORTH LAS VEGAS" |
| 1 | records/target/bb/ours.json | the Strip board's landmark "Las Vegas Boulevard" |
| 1 | records/target/bb/bohemia_enemies.json | a beast's range "the Las Vegas Wash" |
| 1 | records/target/BOHEMIA_GROUND_EFFECTS.json | "Las Vegas Creek" |

The three that a player meets first: the loading screen's camera readout, the start screen's line under the name, and the phone's
own page.

Out of scope, measured and said: the alpha's dev tabs (WORDS, MAP, RUN, the old slices: 142, 142, 138 mentions each, nearly all
inlined engine comments and research citations) are the workshop, not the game; records, laws, banks and tools are for the
machine (rule 362). Judged VOTE cards (a vote consumes, they never render again), the triage tags and the list of his yeses about
judged cards are the record of what a card was called when he voted, left as they were.

## 2. WHAT CHANGED (by meaning, at the source; no new Spanglish, no lore)

- The city is BOHEMIA: the start screen "POST-ECONOMIC APOCALYPSE - BOHEMIA"; the camera "BOHEMIA 6 MI"; the phone
  "post-collapse Bohemia"; the world feed's 22 posts ("my grandson is in bohemia", "convoy for bohemia leaves friday", the
  feed's lowercase kept); the weather bot @wx_bohemia_auto, "Have a great day, Bohemia!" (the bank's source
  tools/words_feed/feed_accounts.py and feed_posts_part2.py, rebuilt through build_feed_bank.py and bohemia_feed_build.py).
- Compounds: NORTH LAS VEGAS -> NORTH BOHEMIA (THE WASH, NORTH BOHEMIA); LAKE LAS VEGAS -> LAKE BOHEMIA (and THE EYE AT LAKE
  BOHEMIA, its id lake_bohemia_eye in region_bases.json, factions.json and region_bases_gate.js); LAS VEGAS BAY -> BOHEMIA BAY;
  LAS VEGAS VALLEY -> THE BOHEMIA VALLEY; LAS VEGAS BLVD N (NV-604) -> BOHEMIA BLVD N (NV-604); Las Vegas Boulevard -> Bohemia
  Boulevard (the Strip board, and its source tool); THE STRIP (Las Vegas Blvd) -> THE STRIP (Bohemia Blvd); the Las Vegas Wash ->
  the Wash; Las Vegas Creek -> the creek; WELCOME TO FABULOUS LAS VEGAS -> WELCOME TO FABULOUS BOHEMIA (the map key).
- Boss 47 THE HOUSE: "deal again, and Bohemia earns the way Bohemia earned". The ladder data is generated from his ladder, so
  the cell in records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md row 47 was changed and tools/bohemia_ladder_data.js re-run (the walk
  gate re-reads both sources; 43/0); the map's inlined copy carries the same line.
- The region: tools/bohemia_world_region.py and tools/bohemia_world_region_districts.py renamed, the land regenerated, and the
  output proven identical field by field to the old one apart from the four names and two notes (same place order, same blocks,
  same roads). Everything that looks a place up by name moved with it: engine/bohemia_freeways.js, engine/bohemia_the_real_corner.js,
  tools/bohemia_world_the_real_corner_shot.js, and WORLD's gates region_districts (29/0), region_bases (365/0), the real corner
  (16/0), a place is named once (7/0, its regex reads either name), region land 61/0, the region has its cities 5/0.
- Two posts rewritten to stay at 120 with every fill at its longest (rule 350): "the driver is with the church nurse"; "first
  bohemia crew on relay. 73." The world feed gate 8/0, longest 120.
- The four waiting VOTE cards: one word each ("jobs in Bohemia", "a person in Bohemia", "2008 in the real valley itself",
  "A BOHEMIA RANCH"). This lane's own world-feed card follows its posts.
- Two cold-open tile notes in the alpha (and engine/bohemia_coldopen_set.js, and its bake tool) say "the valley" now.

Real places that are not the city's name keep theirs: Henderson, Boulder City, Pahrump, Red Rock, Lake Mead, the Strip, Reno.

## 3. THE GATE: gates/it_is_called_bohemia_gate.js (IT IS CALLED BOHEMIA, in the suite, node only, seconds)

H a page's text and attributes outside scripts and comments; S a script's strings; J a data file's values and keys; V a VOTE card
still waiting (title, why, question, options, twin, and the page it shows). Allowed, and only this: code comments and .bq comment
lines; code names (a string or key with no space, e.g. the sound id 'vegasorgan', the crashbox word key 'vegas'); his own words
quoted back in VOTE (`said`); a retired line quoted struck through on a VOTE card (`<div class="was" data-was>`); and the value
of a MACHINE note field. Every MACHINE field was read against the pages that load it and none is drawn:
_about/_why/_readme/_note/_source/_rule/_how and note/notes (a file's notes), real/research (the real-world fact a row is built
from), reference/ref/source/sources/cite (citations), summary/layout/decisions/circulation/layering (a district kit's NOTES block),
act1 (a kit tile's look, read only by the material sorter __materialOf), voice/teaches (the feed's writer notes; teaches is
carried on a post and never drawn), hold (belonging.js's dossier; bargain() returns it as `holds` and no screen reads it).
Plants: the start line and an alt caught, a comment passes; a name and a template caught, a citation and a code name pass; a post
caught, its notes pass; a waiting card caught, his quote and a judged card pass; a .bq comment passes; on a card the struck-through
old line passes and a new one is caught.

## 4. WEAK, SAID

- Pixels were not read: any painted word in an image (the welcome sign's art, a billboard) is not checked by this gate.
- The road code "NV-604 LV BLVD N" keeps "LV" (a road id the land joins on; it never says Vegas).
- Old saves keep posts already made under the old weather handle until they scroll away.
- The alpha's dev tabs still say Las Vegas in their own pages; they are the workshop.

## 5. [bb] AND THE ANALOG HORROR LINE

[bb] Battle Brothers never names a real place; its map is invented, so its words never have to choose. Ours is a real valley with
its own name laid over it, so the game has to choose every time, and now a checker chooses with it.
ANALOG HORROR: the camera at the loading screen counts BOHEMIA 6 MI down to 0 on the beat, a place name the old maps never had,
on a tape somebody kept running.
