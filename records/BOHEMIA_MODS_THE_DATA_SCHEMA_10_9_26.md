# THE DATA FILES, ON ONE PAGE (generated 10/9/26 by tools/bohemia_mods_schema_page.js)

Paolo 9/30: "the point of the mods chat is to make it easy for people to make mods." This page is written from the live files in `records/target/bb/`, so it cannot disagree with them. Re-run the tool and it rewrites itself.

## THE FIVE THINGS TO KNOW

1. **Two shapes, and some files have both.** A *table* is a list of rows, each with an `id`. A *value* is a named number, or a small object with `value`, `source` and `quote`.
2. **Every row says where it came from.** The `source` field names the wiki page (or the ruling) a number was copied from. `missing` lists what the source left blank. Do not delete them; they are how a change is traced.
3. **Units.** Damage is hit points. Anything ending `_pct` is percent. `ap` is action points. `range` is tiles. **Money in the wiki files is crowns; the game shows batteries at 10 crowns to 1 (price_table.json, and the engine converts when it reads).** Edit crowns. The one exception is origins.json, which carries a crowns block AND a batteries block: keep them in step.
4. **`_about` is the documentation.** Each file opens with a plain account of what it holds, its source and who owns changing it.
5. **Names are drafts.** A row with `draft: true` has a name and line that are an attempt; the numbers around them are the wiki's.

## THE FILES

| file | rows or keys | read live by | gates that read it |
|---|---|---|---|
| BOHEMIA_GROUND_EDGES.json | 6 values | a build input, not read live | 1 |
| ai.json | 4 values | BOHEMIA_FIGHT.html | 2 |
| armor.json | 184 rows | bohemia_godgear.js, bohemia_pricetable.js, bohemia_roster.js, BOHEMIA_FIGHT.html, BOHEMIA_SETTLEMENT_SCREEN.html, bohemia_ui_materials.js | 4 |
| backgrounds.json | 77 rows and 2 values | bohemia_goodbros.js, bohemia_pricetable.js, bohemia_roster.js, BOHEMIA_FIGHT.html | 4 |
| contract_terms.json | 7 values | bohemia_contracts.js | 1 |
| enemies.json | 160 rows | BOHEMIA_FIGHT.html, vote/CHARACTER_THE_ENEMY_TIERS_DRESSED.html | 2 |
| factions.json | 4 rows and 2 values | bohemia_factions.js | 1 |
| injuries.json | 59 rows and 1 values | BOHEMIA_FIGHT.html, BOHEMIA_SETTLEMENT_SCREEN.html | 1 |
| origins.json | 15 rows and 1 values | BOHEMIA_ALPHA_0_9.html, BOHEMIA_DEMO.html, BOHEMIA_FIGHT.html | 4 |
| ours.json | 27 values | bohemia_roster.js, BOHEMIA_ALPHA_0_9.html, BOHEMIA_DEMO.html, BOHEMIA_FIGHT.html, BOHEMIA_ROSTER_SCREEN.html, BOHEMIA_SETTLEMENT_SCREEN.html, BOHEMIA_THE_MARK_ON_THE_WALL_9_22_26.html, BOHEMIA_THE_SIGN_STILL_LIGHTS_9_21_26.html | 4 |
| party_math.json | 7 values | bohemia_factions.js, BOHEMIA_CITY_WORLD.html | 3 |
| perk_translation.json | 50 rows and 1 values | BOHEMIA_FIGHT.html | 1 |
| perks.json | 50 rows and 1 values | BOHEMIA_FIGHT.html | 2 |
| price_table.json | 8 values | bohemia_contracts.js, bohemia_pricetable.js, bohemia_stash.js | 3 |
| rules.json | 14 values | BOHEMIA_FIGHT.html | 2 |
| stash_rates.json | 6 values | bohemia_stash.js | 1 |
| weapon_lines.json | 15 rows | BOHEMIA_FIGHT.html | 1 |
| weapons.json | 126 rows | bohemia_godgear.js, bohemia_pricetable.js, bohemia_roster.js, BOHEMIA_FIGHT.html, BOHEMIA_SETTLEMENT_SCREEN.html, bohemia_ui_materials.js | 4 |

### BOHEMIA_GROUND_EDGES.json

*53978 bytes.* 

**Values:** `compass` "NORTH is up the screen (the far side of the ...; `types` {"road":"asphalt","walk":"sidewalk, shoulder,...; `join_rule` "road, curb-walk and water runs meet the same...; `px_per_metre` [30.333333333333332,42.916666666666664]; `blocks` {"casino.0":{"N":{"runs":[["lot",0,60]],"line...; `faults` {"desert":{"board":[],"with_apron":[]},"shore...

### ai.json

*8653 bytes.* How each kind of enemy fights in the rebuilt fight (rule 63b: 'Battle Brothers has its AI for the enemies correctly'; every archetype's behaviour from the library as data, before any skin). A behaviour is a set of switches the fight's one AI reads; each row qu

**Values:** `kinds` {"brigand_thug":{"value":"line","source":"bb_...; `archetypes` {"line":{"value":{"advance":true,"hold_if_ran...; `hunt` "an enemy that sees nobody walks the shortest...; `tactics` {"avoid_surround":{"value":true,"source":"bb_...

### armor.json

*101190 bytes.* Battle Brothers body armour, headgear and shields copied exactly from the wiki text in the repo (rule 63d); every row cites its page. Rows = the Body Armor, Headgear and Shields list pages (transcluded by # PAGE Armor in CORE_WIKITEXT.md); the item's own page 

**body: 78 rows.** Fields:

| field | type | example | blank | range |
|---|---|---|---|---|
| id | string | "tattered_sackcloth" | 0 of 78 |  |
| name | string | "Tattered Sackcloth" | 0 of 78 |  |
| durability | number | 5 | 0 of 78 | 5 to 320 |
| fatigue | number | -1 | 12 of 78 | -42 to -1 |
| value | number | 0 | 0 of 78 | 0 to 7000 |
| source | string | "reference/library/grok/wiki/PAGES_ALL.tar.gz... | 0 of 78 |  |
| missing | list | ["fatigue (Max. Fatigue cell blank on the lis... | 0 of 78 |  |
| dlc | string | "Blazing Deserts DLC Blazing Deserts" | 0 of 78 |  |
| notes | string | "Worn by Wildmen" | 0 of 78 |  |
| special | string | "-5 Resolve for every enemy engaged in melee" | 0 of 78 |  |

**head: 87 rows.** Fields:

| field | type | example | blank | range |
|---|---|---|---|---|
| id | string | "mouthpiece" | 0 of 87 |  |
| name | string | "Mouthpiece" | 0 of 87 |  |
| durability | number | 10 | 0 of 87 | 10 to 320 |
| fatigue | number | -1 | 18 of 87 | -23 to -1 |
| vision | number | -1 | 32 of 87 | -3 to -1 |
| value | number | 15 | 0 of 87 | 15 to 4000 |
| source | string | "reference/library/grok/wiki/PAGES_ALL.tar.gz... | 0 of 87 |  |
| notes | string | "Worn by Miners" | 0 of 87 |  |
| missing | list | ["fatigue (Max. Fatigue cell blank on the lis... | 0 of 87 |  |
| dlc | string | "Blazing Deserts DLC Blazing Deserts" | 0 of 87 |  |
| special | string | "Only take 50% of damage inflicted by Miasma." | 0 of 87 |  |

**shields: 19 rows.** Fields:

| field | type | example | blank | range |
|---|---|---|---|---|
| id | string | "buckler" | 0 of 19 |  |
| name | string | "Buckler" | 0 of 19 |  |
| melee_defense | number | 10 | 0 of 19 | 10 to 24 |
| ranged_defense | number | 5 | 0 of 19 | 5 to 25 |
| durability | number | 16 | 0 of 19 | 12 to 72 |
| fatigue | number | -4 | 0 of 19 | -22 to -4 |
| value | number | 45 | 0 of 19 | 45 to 1200 |
| skills | list | [{"name":"Knock Back","ap":4,"fatigue":20,"hi... | 0 of 19 |  |
| source | string | "reference/library/grok/wiki/PAGES_ALL.tar.gz... | 0 of 19 |  |
| notes | string | "Shieldwall skill is unavailable" | 0 of 19 |  |
| skills_basis | string | "shield page Skills section" | 0 of 19 |  |
| missing | list | [] | 0 of 19 |  |
| dlc | string | "Blazing Deserts DLC Blazing Deserts" | 0 of 19 |  |

### backgrounds.json

*161946 bytes.* Battle Brothers character backgrounds, extracted from the fandom wiki dump. One row per stat table on each '(Background)' page, so variants (Southern Assassin, Barbarian/Southern Indebted, Companion 1H/2H/Ranged, Regent in Absentia, Monk turned Flagellant, Pac

**rows: 77 rows.** Fields:

| field | type | example | blank | range |
|---|---|---|---|---|
| id | string | "adventurous_noble" | 0 of 77 |  |
| name | string | "Adventurous Noble" | 0 of 77 |  |
| wiki_page | string | "Adventurous Noble (Background)" | 0 of 77 |  |
| hiring_cost | null |  | 77 of 77 |  |
| daily_wage | number | 25 | 0 of 77 | 0 to 35 |
| daily_wage_kind | string | "base wage (before the 90%-110% random multip... | 0 of 77 |  |
| starting_level | list | [1,3] | 0 of 77 |  |
| stats | object | {"hp":[50,60],"fatigue":[90,105],"resolve":[4... | 0 of 77 |  |
| stats_kind | string | "range: absolute [min,max] a recruit of this ... | 0 of 77 |  |
| stats_source | string | "bb_all/0031_Adventurous Noble (Background).txt" | 0 of 77 |  |
| stat_modifiers | object | {"hp":[0,0],"fatigue":[0,5],"resolve":[15,20]... | 0 of 77 |  |
| stat_modifiers_kind | string | "[added to base min, added to base max]; the ... | 0 of 77 |  |
| traits_excluded | list | ["Asthmatic","Clubfooted","Craven","Dastard",... | 0 of 77 |  |
| cross_check | string | "matches the Attribute Ranges table and base+... | 0 of 77 |  |
| source | string | "reference/library/grok/wiki/PAGES_ALL.tar.gz... | 0 of 77 |  |
| missing | list | ["hiring_cost (no per-background base hiring ... | 0 of 77 |  |
| hiring_cost_game_guide_observed | object | {"range":"120 - 170","note":"observed hiring ... | 0 of 77 |  |
| traits_excluded_variant | object | {"variant":"Southern Caravan Hand","also_excl... | 0 of 77 |  |
| traits_excluded_note | string | "This background is event-exclusive and will ... | 0 of 77 |  |

**Values:** `base_stats` {"stats":{"hp":[50,60],"fatigue":[90,100],"re...; `hiring_and_wage_rules` {"hiring_quote":"The background defines a bas...

### contract_terms.json

*6114 bytes.* ECONOMY [the contract's worth], rule 74. Contracts priced by skulls and distance, clout raising the pay, a failed one costing relation, the haggle and its cost. Pulled directly from the wiki's own Contracts and Relations pages (reference/library/grok/wiki/PAGE

**Values:** `difficulty` {"_about":"contract difficulty is measured in...; `renown` {"_about":"'the crowns reward increases with ...; `haggle` {"_about":"the full negotiation mechanic, pul...; `workedExampleWikiCrowns` {"_about":"the wiki page's own four real exam...; `workedExampleBatteries` {"_about":"the same four rows at ten wiki cro...; `relationsCost` {"_about":"every relations change the wiki's ...; `relationBands` {"_about":"for reading what a relation number...

### enemies.json

*333522 bytes.* Battle Brothers enemy stats copied exactly from the wiki text in the repo (rule 63d); every row cites its page

**rows: 160 rows.** Fields:

| field | type | example | blank | range |
|---|---|---|---|---|
| id | string | "alp" | 0 of 160 |  |
| name | string | "Alp" | 0 of 160 |  |
| faction | string | "beasts" | 0 of 160 |  |
| variant | string | "base" | 0 of 160 |  |
| hp | number/string | 100 | 2 of 160 | 1 to 3800 |
| fatigue | number | 100 | 30 of 160 | 80 to 999 |
| resolve | number/string | 100 | 22 of 160 | 35 to 200 |
| initiative | string/number | "60-115" | 5 of 160 | -300 to 161 |
| melee_skill | number/string | 55 | 11 of 160 | 40 to 115 |
| ranged_skill | number/string | 60 | 66 of 160 | 30 to 97 |
| melee_defense | number/string | 10 | 1 of 160 | -50 to 125 |
| ranged_defense | number/string | 10 | 1 of 160 | -50 to 999 |
| ap | number | 10 | 5 of 160 | 5 to 14 |
| armor_head | string/number | "0-95" | 22 of 160 | 0 to 1600 |
| armor_body | string/number | "0-25" | 22 of 160 | 20 to 1600 |
| fatigue_recovery | number | 15 | 32 of 160 | 15 to 35 |
| champion_chance | string | "1%" | 139 of 160 |  |
| gear | list | [] | 0 of 160 |  |
| gear_detail | list | [] | 0 of 160 |  |
| perks | list | ["Underdog"] | 0 of 160 |  |
| skills | list | ["Nightmare","Sleep","Existing Partly in Drea... | 0 of 160 |  |
| traits | list | ["Existing Partly in Dreams","Fade"] | 0 of 160 |  |
| stat_modifiers | list | [] | 0 of 160 |  |
| immune | list | ["Disarm","Nighttime","Forced movement","Inju... | 0 of 160 |  |
| not_immune | list | ["Stun","Nets","Fire","Morale","Fatigue"] | 0 of 160 |  |
| xp | number | 300 | 1 of 160 | 0 to 2500 |
| notes | string | "Alp is a nighttime enemy from the Beasts fac... | 0 of 160 |  |
| source | string | "bb_all/0046_Alp.txt" | 0 of 160 |  |
| listed_in | list | ["beasts"] | 0 of 160 |  |
| table_sources | list | ["bb_all/0224_Beasts.txt"] | 0 of 160 |  |
| ... | | 7 more fields | | |

### factions.json

*6965 bytes.* The demo's factions as one table RUN's parties and the map card read (VAMILY rows [the parties on the map] and [a house you give a fuck about], rule 80c). Every faction has a banner ink, a party make-up (enemy ids from enemies.json, counts from party_math.json

**factions: 4 rows.** Fields:

| field | type | example | blank | range |
|---|---|---|---|---|
| id | string | "brigands" | 0 of 4 |  |
| name | string | "Road crews" | 0 of 4 |  |
| enemy_faction | string | "brigands" | 0 of 4 |  |
| banner | string | "#ff6a00" | 0 of 4 |  |
| banner_ours | boolean | true | 0 of 4 |  |
| mix | object | {"early":{"brigand_thug":8,"lower_brigand_rai... | 0 of 4 |  |
| ground | list | ["road","freeway","interchange"] | 0 of 4 |  |
| behaviour | string | "raid" | 0 of 4 |  |
| behaviour_source | string | "reference/library/grok/wiki/PAGES_ALL.tar.gz... | 0 of 4 |  |
| behaviour_quote | string | "In the early game Brigand groups usually con... | 0 of 4 |  |
| face | object | {"id":"face-brigands-boss","role":"the crew's... | 0 of 4 |  |
| voice | object | {"text":"Esta carretera es nuestra. Pay the t... | 0 of 4 |  |
| want | object | {"id":"hold-the-freeway","text":"to own the f... | 0 of 4 |  |
| base | object | {"kind":"camp","tier":"camp","note":"a home b... | 0 of 4 |  |
| memory | object | {"driven_by":"beef","bands":["unknown","wary"... | 0 of 4 |  |
| mix_source | string | "records/target/bb/ours.json enemy_tiers (bb_... | 0 of 4 |  |
| mix_ours | boolean | true | 0 of 4 |  |
| mix_note | string | "draft make-up from enemies.json ids; COMBAT'... | 0 of 4 |  |
| behaviour_ours | boolean | true | 0 of 4 |  |

**Values:** `banner_rule` "a faction's ink is nobody else's; chosen by ...; `gaps` ["no dead or beast art exists, so the card sh...

### injuries.json

*56781 bytes.* Battle Brothers injuries, extracted from the fandom wiki dump (2256 pages). 48 temporary + 11 permanent = 59 rows. Each row comes from the injury's own card page (threshold, effects, heal days, flavor); kind and damage_type/body_part come from which section of

**rows: 59 rows.** Fields:

| field | type | example | blank | range |
|---|---|---|---|---|
| id | string | "sick" | 0 of 59 |  |
| name | string | "Sick" | 0 of 59 |  |
| kind | string | "temporary" | 0 of 59 |  |
| damage_type | list | ["blunt"] | 13 of 59 |  |
| body_part | list | ["body"] | 13 of 59 |  |
| special | string | "not sustained through the usual means (event... | 0 of 59 |  |
| threshold_pct_of_max_hp | number | 50 | 13 of 59 | 25 to 60 |
| effects | object | {"all_levelable_attributes_pct":-25,"vision":-2} | 0 of 59 |  |
| effects_text | list | ["−25% to all attributes that can be leveled ... | 0 of 59 |  |
| heal_days | list | [1,3] | 11 of 59 |  |
| flavor | string | "Struck with sickness and disease, the charac... | 0 of 59 |  |
| source | string | "reference/library/grok/wiki/PAGES_ALL.tar.gz... | 0 of 59 |  |
| missing | list | ["damage_type","body_part","threshold"] | 0 of 59 |  |
| effects_note | string | "The card says '−25% to all attributes that c... | 0 of 59 |  |
| cross_check | string | "Injuries page Effects table expands the card... | 0 of 59 |  |
| threshold_parameters_table_pct | number | 35 | 0 of 59 | 35 to 35 |
| note | string | "permanent injuries come from being struck do... | 0 of 59 |  |

**Values:** `rules` {"what":{"quote":"Injuries are (mostly) negat...

### origins.json

*14444 bytes.* Battle Brothers' fifteen origins, from the wiki dump (the Origins index at reference/library/grok/wiki/CORE_WIKITEXT.md:342-394 (the Origins index); the Lone Wolf page in CORE_WIKITEXT.md; the other fourteen pages in PAGES_ALL.tar.gz bb_all/), each with our sk

**origins: 15 rows.** Fields:

| field | type | example | blank | range |
|---|---|---|---|---|
| id | string | "rebuild" | 0 of 15 |  |
| bb | string | "Rebuilding a Company" | 0 of 15 |  |
| name | string | "THE CREW THAT IS LEFT" | 0 of 15 |  |
| line | string | "Three of you, a debt paid off, and a name to... | 0 of 15 |  |
| draft | boolean | true | 0 of 15 |  |
| difficulty | string | "Easy" | 0 of 15 |  |
| d | number | 1 | 0 of 15 | 1 to 3 |
| men | list | [{"background":"companion_2hand","level":null... | 0 of 15 |  |
| crowns | object | {"high":2500,"medium":2000,"low":1500} | 0 of 15 |  |
| batteries | object | {"full":250,"thin":200,"bare":150} | 0 of 15 |  |
| roster_cap | number | 20 | 0 of 15 | 12 to 25 |
| field_cap | number | 12 | 0 of 15 | 12 to 16 |
| pay | number | 0 | 0 of 15 | 0 to 1 |
| rules | list | ["Starts off with a basic tutorial"] | 0 of 15 |  |
| source | string | "reference/library/grok/wiki/PAGES_ALL.tar.gz... | 0 of 15 |  |
| notes | string | "the eleventh and twelfth men are one of Vaga... | 0 of 15 |  |

**Values:** `defaults` {"roster_cap":{"value":20,"source":"reference...

### ours.json

*19403 bytes.* Bohemia's own numbers in the rebuilt fight (rule 63): only what Paolo ruled, each row citing the law or record that holds his words. Everything else the fight feels is Battle Brothers' and lives in the other files of this folder. TUNING owns changing any of th

**Values:** `beat_bpm` 120; `field_size` 12; `roster_size` 20; `struck_down_death_chance` 0.2; `struck_down_laid_up_days` [30,40]; `main_character_dies` false; `first_enemy_band` 6; `weapon_jobs` {"pistol":"dagger","shotgun":"handgonne","rif...; `board_tiles` [20,15]; `grid` "square"; `veteran_death_chance` 0.1; `weapon_rows` {"pipe":"bludgeon","car_door":"wooden_shield"...; `crew` [{"name":"YOU","main":true,"background":"sell...; `first_band` ["brigand_thug","brigand_thug","brigand_thug"...; `night` false; `cover_tile_blocks_line` false; `perk_builds` {"pipe":["colossus","steel_brow","rally_the_t...; `board_mix` {"families":{"city":["subs","suburb_stem","co...; `start_cols` [7,12]; `cover_defence` {"melee_per_piece":5,"ranged_per_piece":10,"m...; `people_looks` {"crew":["you","cast_longcoat","cast_barearms...; `formation_depth_lines` 2; `night_lights` {"lit_tile_plays_as_day":true}; `formation` {"slots_per_row":9}; and 3 more

### party_math.json

*4171 bytes.* How big a party is (rule 75b: 'a party is sized by Battle Brothers' math, never twelve against twelve, and the first roads give a few thugs'). The INPUTS and their directions are Battle Brothers' (the wiki's Game Mechanics page and GROK_60): roster strength, t

**Values:** `roster_strength` {"per_man":10,"per_level":2,"strongest":12,"s...; `count_words` [{"word":"A FEW","lo":2,"hi":3},{"word":"SOME...; `day_cap` 100; `difficulty_by_pick` {"new":0,"seen":1,"out":2}; `difficulty_count_mult` [0.85,1,1.15,1.3]; `job` {"strength_per_enemy":10,"skull_mult":{"1":0....; `roaming` {"base":2,"per_day":0.1,"per_block_from_town"...

### perk_translation.json

*22497 bytes.* THE FIFTY, TRANSLATED (COMBAT [perks translated], rule 48, Paolo 9/29: 'the perks need to be translated'): every Battle Brothers perk one for one, its mechanic and its numbers kept exactly (they live in perks.json beside the wiki's words), with our draft name 

**rows: 50 rows.** Fields:

| field | type | example | blank | range |
|---|---|---|---|---|
| id | string | "fast_adaptation" | 0 of 50 |  |
| bb_name | string | "Fast Adaptation" | 0 of 50 |  |
| tier | number | 1 | 0 of 50 | 1 to 7 |
| name | string | "READS YOU" | 0 of 50 |  |
| draft | boolean | true | 0 of 50 |  |
| skin | string | "every miss teaches him where you lean" | 0 of 50 |  |
| in_the_fight | string | "live" | 0 of 50 |  |
| old_tree | string | "STEADY EYE (a flat +1 to every gun)" | 45 of 50 |  |
| numbers_from | string | "records/target/bb/perks.json#fast_adaptation" | 0 of 50 |  |
| source | string | "reference/library/grok/wiki/PAGES_ALL.tar.gz... | 0 of 50 |  |

**Values:** `count` {"all":50,"live":44,"outside_the_fight":4,"he...

### perks.json

*29716 bytes.* Battle Brothers perks, all 50, extracted from the fandom wiki dump. tier = the perk row (1-7) on the Perks page. effect = the wiki description cell, wikitext stripped (icons replaced by their label words, refs removed), notes kept. numbers = every number in th

**rows: 50 rows.** Fields:

| field | type | example | blank | range |
|---|---|---|---|---|
| id | string | "fast_adaptation" | 0 of 50 |  |
| name | string | "Fast Adaptation" | 0 of 50 |  |
| tier | number | 1 | 0 of 50 | 1 to 7 |
| effect | string | "Gain an additional stacking +10% chance to h... | 0 of 50 |  |
| numbers | object | {"hit_chance_per_miss_pct":10} | 0 of 50 |  |
| source | string | "reference/library/grok/wiki/PAGES_ALL.tar.gz... | 0 of 50 |  |
| missing | list | ["numbers (the effect text gives no number)"] | 0 of 50 |  |
| wiki_title | string | "Crossbow Mastery" | 0 of 50 |  |
| note | string | "'Crossbow Mastery' redirects to 'Crossbow an... | 0 of 50 |  |

**Values:** `rules` {"perk_point_per_level":1,"perk_points_at_vet...

### price_table.json

*8536 bytes.* ECONOMY [the price table at ten to one], rule 74 top row. Everything a player sees in batteries, converted from the wiki's own crown numbers at ten to one with a one-battery floor (Paolo, GROK_31/32/33, stamped). This file holds the market-level numbers the wi

**Values:** `conversion` {"crownsPerBattery":10,"floorBatteries":1,"ru...; `sellCutByRelationAndSize` {"_about":"fraction of an item's worth paid w...; `buySideDropAtTopOfBar` {"fraction":0.15,"about":"the buy price can d...; `buyToSellRatioAtNeutral` {"ratio":6.67,"difficulty":"veteran","example...; `situationMultipliers` {"_about":"stack on the relation price AFTER ...; `wageAndHire` {"_about":"the mechanism for a background's d...; `contractPay` {"_about":"no skull-tiered table exists in an...; `dailyRates` {"foodPerManPerDay":{"value":2,"unit":"stacks...

### rules.json

*64925 bytes.* {"what":"Battle Brothers combat rules as numbers, every value carrying its wiki page and an exact quote. Reference only: describes Battle Brothers' own hex board; Bohemia's square grid and house tiles are separate locked rulings.","sources":{"bb_all/*":"refere

**Values:** `board` {"grid":{"value":"hex","source":"bb_all/0424_...; `deployment` {"min_gap_between_lines_hexes":{"value":5,"so...; `ap` {"per_turn":{"value":9,"source":"bb_all/0424_...; `fatigue` {"action_needs_fatigue":{"value":"a fully fat...; `initiative_and_turn_order` {"order":{"value":"highest initiative acts fi...; `zone_of_control` {"who_exerts":{"value":"melee units: melee we...; `hit_chance` {"base_melee":{"value":"melee skill - melee d...; `head_and_critical` {"head_roll_is_second_d100":{"value":true,"so...; `damage` {"simplified_formula":{"value":{"armor_damage...; `status_effects` {"bleeding":{"value":{"hp_per_turn":5,"turns"...; `morale` {"states":{"value":["Unbreakable","Confident"...; `injuries_and_death` {"hp_zero":{"value":"killed or struck down","...; `experience` {"level_table_total_xp":{"value":{"2":200,"3"...; `parsed` {"morale_struck":{"value":{"threshold_hp":15,...

### stash_rates.json

*4336 bytes.* ECONOMY [what the stash is], rule 74. What the bar's six counts (batteries, food, meds, rounds/ammo, tape/tools, water) cost PER DAY, from the wiki's own pages, never converted to batteries here -- a day's SPEND is a count consumed, not a price paid. Cross-cit

**Values:** `foodByTerrain` {"_about":"the wiki's own baseline (2 a man a...; `foodSpoilDaysExtended` {"_about":"extends price_table.json dailyRate...; `toolRepair` {"_about":"extends price_table.json dailyRate...; `medicine` {"_about":"one point per injury per day or th...; `ammo` {"_about":"no existing block to extend; this ...; `sharedPileNote` {"_about":"GROK_116 reports Paolo said food a...

### weapon_lines.json

*6150 bytes.* THE WEAPONS SAY WHAT THEY DO (rule 75e, Paolo 10/5: 'weapons that I don't even think you know what they're supposed to do yet'). One plain line per Battle Brothers weapon class, the name it carries in Bohemia and its base named, read by the fight's weapon card

**rows (keyed by id): 15 rows.** Fields:

| field | type | example | blank | range |
|---|---|---|---|---|
| job | string | "pistol" | 8 of 15 |  |
| name | string | "PISTOL" | 0 of 15 |  |
| base | string | "Dagger" | 0 of 15 |  |
| line | string | "A cheap handgun. Light and quick, but armor ... | 0 of 15 |  |
| by | string | "records/BOHEMIA_WORDS_THE_WEAPONS_LINES_10_5... | 0 of 15 |  |
| draft | boolean | true | 0 of 15 |  |
| why | string | "swords: 16 rows, 47-58 damage, 81% to armour... | 0 of 15 |  |

### weapons.json

*227296 bytes.* Battle Brothers weapons copied exactly from the wiki text in the repo (rule 63d); every row cites its page. Rows = every weapon in the class tables of the Melee Weapons and Ranged Weapons pages (Daggers, Swords, Maces, Spears, Axes, Flails, Cleavers, Hammers, 

**rows: 126 rows.** Fields:

| field | type | example | blank | range |
|---|---|---|---|---|
| id | string | "knife" | 0 of 126 |  |
| name | string | "Knife" | 0 of 126 |  |
| class | string | "dagger" | 0 of 126 |  |
| hands | number | 1 | 13 of 126 | 1 to 2 |
| damage_min | number | 15 | 7 of 126 | 5 to 95 |
| damage_max | number | 25 | 7 of 126 | 10 to 120 |
| armor_damage_pct | number | 50 | 7 of 126 | 10 to 225 |
| armor_ignore_pct | number | 20 | 7 of 126 | 10 to 60 |
| fatigue | number | -3 | 4 of 126 | -34 to 0 |
| durability | number | 32 | 14 of 126 | 2 to 120 |
| value | number | 30 | 0 of 126 | 30 to 3500 |
| range | number/string | 1 | 3 of 126 | 1 to 7 |
| range_min | number | 1 | 13 of 126 | 1 to 7 |
| range_max | number | 1 | 13 of 126 | 1 to 7 |
| skills | list | [{"name":"Stab","ap":4,"fatigue":7,"hit_bonus... | 0 of 126 |  |
| source | string | "reference/library/grok/wiki/PAGES_ALL.tar.gz... | 0 of 126 |  |
| class_page_section | string | "One-Handed Daggers" | 0 of 126 |  |
| hands_basis | string | "Daggers page heading \"One-Handed Daggers\"" | 0 of 126 |  |
| skills_basis | string | "weapon page Skills section" | 0 of 126 |  |
| missing | list | ["fatigue (Max. Fatigue cell blank on the cla... | 0 of 126 |  |
| also_listed_in | list | ["Swords page / One-Handed Swords"] | 0 of 126 |  |
| dlc | string | "Blazing Deserts DLC" | 0 of 126 |  |
| head_hit_chance | number | 5 | 0 of 126 | 0 to 15 |
| range_note | string | "weapon page tilerange is per-skill text, cop... | 0 of 126 |  |
| shield_damage | number | 12 | 0 of 126 | 8 to 42 |
| use_fatigue_extra | number | 5 | 0 of 126 | 5 to 5 |
| note | string | "(Orc weapon)" | 0 of 126 |  |
| weapon_hit_chance | string/number | "+40 Ranged Skill for Ignite skill" | 0 of 126 | -10 to 5 |
| ammo | string | "1" | 0 of 126 |  |
| range_basis | string | "class table Range 2; weapon page tilerange \... | 0 of 126 |  |
| ... | | 1 more fields | | |

## A WORKED EXAMPLE: MAKE THE KNIFE HIT HARDER

In `records/target/bb/weapons.json`, find the row with `"id": "knife"`.

    before:  {"id":"knife","name":"Knife","damage_min":15,"damage_max":25}
    after:   {"id":"knife","name":"Knife","damage_min":20,"damage_max":30}

That is the whole change. These files name `damage_min` and read it live or check it, so they are where it shows up:

- `engine/bohemia_roster.js`
- `gates/the_rebuilt_fight_plays_gate.js`
- `slices/BOHEMIA_FIGHT.html`
- `slices/BOHEMIA_SETTLEMENT_SCREEN.html`
- `tools/bohemia_mods_merge_proof.js`
- `tools/bohemia_mods_merge_reference.js`
- `tools/bohemia_mods_schema_page.js`

Nothing else needs editing: the fight rolls its damage from the row, the settlement screen and the roster print it from the row, and the fight's gate reads the number from the row instead of pinning a digit. (Checked by reading the code. The gate takes about five minutes and was not re-run with a changed row, so run it yourself before you trust a change.)
