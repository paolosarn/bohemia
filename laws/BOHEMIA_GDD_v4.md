# BOHEMIA
## Game Design Document — Version 4
### By Paolo Alexandre Sarnataro (Babypunk / Punk4Prez)
### Compiled July 2026 — Extends GDD v2 (lore foundation) and GDD v3 (combat, endgame, engine direction)

## HOW TO READ THIS DOCUMENT
GDD v2 remains the lore foundation (world history, the Amalgamation, the Network, factions, setting). GDD v3 remains the combat system (Dead Eye Dial), the endgame/final boss, and the v3 locked lore. THIS document folds in everything designed and built between 6/28/26 and 7/2/26 — twenty-four addendums plus the master systems map — consolidated by system. The addendum files remain in the project as the full implementation detail; this is the master reference. LOCKED means build to it. [PENDING] means Paolo has not called it. Nothing here overrides a lock in v2 or v3; where a later law supersedes an earlier rule, the supersession is stated explicitly.

## TABLE OF CONTENTS
- PART ONE — Time, Persistence & the Deterministic Core (I-move-you-move, two-scale camera, fused consequences, the generational fold, fold determinism laws, macro/micro inventory line, shot resolution)
- PART TWO — The City, the Society & the Antagonist's Mind (city-builder model, the Succession System, Bunker Guy, perks & abilities, the two ledgers, Amalgamation threat logic)
- PART THREE — The Living World (persistent consequence, the pseudo-mayor arc, the dad's book, entities & the delta model, world model & camera LOD)
- PART FOUR — The Character Stack (the rig and its laws, one package law, garment laws, motion & anatomy laws, the clip set, face/portrait/skin, Babypunk, production flags)
- PART FIVE — Engine Laws, Combat DNA & World Extensions (the five architectural laws, RF4 yardstick, VR/companions/XP, systems status)
- PART SIX — Consolidated Pending Decisions

# PART ONE — TIME, PERSISTENCE & THE DETERMINISTIC CORE
*(folds: Time Model 7/1, Camera/Timestep/Fused 7/1, Generational Persistence 7/1, Fold Determinism 7/1, Inventory Macro/Micro 7/1, Combat Resolution 7/1)*

## The Time Model — "I Move, You Move" (LOCKED + built, 34 tests green)
Bohemia is a roguetime game (RF4 / WazHack lineage): the world advances only when the player acts. One hard refinement, locked emphatically ("A ABSOLUTELY A"): **only GRID POSITION waits for the player. Animation NEVER stops.** Nobody is a frozen statue. Every sprite plays its animation continuously on the 120 BPM heartbeat; a walker walks in place (treadmill) and never drops to idle just because the world isn't traveling.

**Two clocks, two jobs.** HEARTBEAT (120 BPM): the render/animation clock, drives every sprite always, never gated. SCHEDULER (`bohemia_scheduler.js`): the world-turn/grid clock, advances grid position exactly one world-turn per committed player action; the player is actor #0 and the only actor whose decision blocks on input.

**Animation taxonomy.** Every animation declares its end-behaviour: LOOP (walk/run/idle/dance — plays forever, the treadmill), RETURN (flinch/reload — one-shot, falls back to prior loop), TERMINAL (headshot death/KO — one-shot into a new RESTING state). **Terminal anims play through LIVE on their own heartbeat beats, NOT gated by player movement** — a death is a body resolving, not a grid move. A dying actor leaves the grid queue at once (RESOLVING), ragdolls to rest via frame-tick, then is DOWN (corpse), becoming a permanent entities delta.

**The Sun.** No wall-clock day/night. Time-of-day is a readout of world-turns elapsed (the scheduler's turn counter, saved since schema v5). The world literally cannot advance toward night while the player stands still. [PENDING: does time-of-day drive mechanics (solar, brownouts, night entities) or stay cosmetic.]

**Energy model.** Standard roguelike energy scheduling: actors bank energy at their speed; crossing STEP_COST (100) earns one grid-step. Deterministic, saveable, no timers.

## Two-Scale Camera & Variable Time-Step (LOCKED)
Same game, same pixel style, two zooms that feel like different experiences:
- **ZOOMED IN — walkable third-person body (fine grain).** Movable character on the streets, animal-tier camera, Dead Eye Dial combat, intentionally creepy up close, carried by the music.
- **ZOOMED OUT — the living city view (coarse grain).** Not chibi; same pixel style reading as a realistic city from above. The social feed and mayor/management layer live here. Modeled on Pocket City 2's walkable-survey city but ALIVE: enemies and entangled characters visibly move; quests aren't handed to you, you SEE the thing to do two grids over. Pixel style is what unlocks this. Transition as fast as Pocket City 2's drop-into-avatar; map slightly bigger than Pocket City 2.

**Variable time-step.** The freeze rule holds at both zooms; the SIZE of the step changes. Zoomed in: one step = one tile = a small unit of time. Zoomed out: one step = one city-tile = a big chunk of time. THE LESSON (never preached): focus on the big picture and you literally can't see the little things — the fine-grain moments happen inside the time you skipped, because you chose big steps. One clock, one rule, no contradiction; the city-view action advances the scheduler by a larger multiple, LOD resolves skipped moments.

**Perception-perk layer (LOCKED intent).** Perks become a PERCEPTION system on the zoomed-out layer, not just combat stats: better perks = see more movers, read the map deeper, buy back some fine grain at city scale. [PENDING: perk tree size/structure, which perks grant what perception.]

**Fused consequences (LOCKED).** Most of the world waits for you, but some events are PLANTED with a fuse (kill a leader, cut a deal → fires ~2 days later regardless). Ties to Succession: tear a hole and the power struggle resolves on its own timeline. **The warning window (LOCKED):** a fused consequence is never a silent gut-punch — as the fuse burns down the game warns "you're gonna wanna pull up soon," giving a window of turns to zoom in and reach it. Make it: you can intervene. Too slow: it resolves without you. Skill = attention + position + speed. Engine: fused event carries fire-turn + warning-lead, slots into LOD forward-compute. [PENDING: warning specificity — named event vs direction-only; whether a reached consequence is fully playable vs a shortened beat (leaning playable).]

**Scripted scenes (LOCKED technical base).** Bethesda method: condition met → story event → quest stage → scene (camera moves, actors play packages/poses, dialogue). Because characters are rig-driven, a cutscene is just the skinner posing the rig — cutscenes cost almost nothing once the rig is locked.

## Generational Persistence — the 100-Year Problem (LOCKED architecture, built)
**A generation is a FOLD, not a snapshot.** World = f(seed, choiceLog). At each generational transition the accumulated choice log is folded into a compact inheritance block; the next generation starts from that fold plus a connected, generation-tagged choice log. Three folds stack; the ending reads all three. A 3-gen dynasty folds to ~619 bytes.

**What carries (the inheritance block, the ONLY survivors):** faction standings (~14 numbers), territory ownership (district→owner), compound build list, economy stocks (leaning: inherit productive CAPACITY, not the bank account — a dynasty inherits the factory), family tree (marriages, children, deaths, heir, traits/wounds — the emotional spine), karma/virtue ledger, the recorded/unrecorded two-ledger split, and per-district investment scores. Rule: if the heir would feel the consequences, it folds; if it can be recomputed from seed + folds, it doesn't.

**Three lives, visually, without storing the world:** district texture = pure function of accumulated investment score (never touched → still apocalypse; invested across gens → modern; invested once then neglected → recovering, frozen). The monument (stone/organic/light) is a readout of the karma+virtue fold. The ending city is a deterministic readout, not a stored image.

**Transition sequence:** point-of-no-return (warned) → fold → heir selection from the family tree (child or sibling's child) → heir traits computed from the fold (inherits wounds and advantages) → world recomputed seed → worldgen → apply folds → heir wakes into a world a generation older.

[PENDING: economy carry fraction; standing decay across a skip (partial decay toward neutral feels right, number TBD); the three act-two permanent decisions; wound modeling in the heir; building persistence across the skip (leaning "most stays, lore-justified").]

## Fold Determinism Laws (LOCKED + tested)
**The governing law: the fold must be a pure function of (seed, choiceLog) and nothing else.** Any randomness must derive deterministically from the seed plus the choice's own identity — never a live RNG stream, wall clock, iteration order, or unstored state.
- Same-beat choices sort by beat, then by stable choice id. Insertion order is never trusted.
- Heir selection is DERIVED, not streamed: `selectHeir(family, seedText, gen)` hashes seed + gen + candidate ids. Same family + seed = same heir forever, regardless of reload timing.
- Proven: 200/200 identical dynasties across deterministic shuffles of the same choiceLog.

**The Save↔Fold bridge (LOCKED + tested).** Choice log entries carry `{id, beat, gen, recorded, effect}`. `recorded` is the two-ledger flag: true = public/feed (the Amalgamation sees it), false = off-ledger (tunnels, family, private — the blind spot); world is recorded BY DEFAULT, going dark is the deliberate exception. `foldFromSave(save)` runs the full dynasty off the log, pure. `amalgamationModel(save)` returns the antagonist's knowledge = the RECORDED ledger only: `{knows, blindSpot, modelledFolds, predictedFinal}` — its prediction is deliberately incomplete, missing every off-ledger move. **That gap is, mechanically, the finale win condition.** [PENDING: which choices author as recorded:false; does the player SEE which ledger a choice lands on (feed-ping vs no-ping); can an off-ledger choice get exposed (surveillance leak = threat escalation).]

## Inventory & the Macro/Micro Line (LAW, built, 25 tests)
**Two tiers of "stuff", opposite storage strategies.** MACRO (folds, deterministic, tiny, survives 100 years): consequential/permanent things — alliances, cleared camps, district investment, economic CAPACITY ("the dynasty runs an ammo operation"). MICRO (ephemeral session state, plain save blob): bullets in the mag, this gun, 3 painkillers, carry weight — zero 100-year determinism needed; folding trigger-pulls would bloat the log into garbage.

They touch at EXACTLY ONE seam: `resupplyFromEconomy(inv, type, capacity, {ceiling})` — capacity is a macro number from the economy/fold; it tops up micro ammo. Bullets-in-your-gun are micro; "the dynasty makes bullets" is macro; the faucet is one function. `BohemiaEngine.Inventory`: ammo add/spend (dry click returns false), items with carry weight and partial adds, equip slots. Lives on the save, never in the choice log. [PENDING: item roster/weights/stack caps; per-round ammo weight; whether equipped weapon gates ammo type; mag sizes.]

## Combat Shot Resolution (built, 23 tests)
`BohemiaEngine.Combat` is the referee between the Dead Eye Dial (HOW WELL you hit) and the world (WHO dies, what it COSTS). A shot spends one round; a DRY mag BLOCKS the shot (no round spent, no turn charged) — grounded in locked rifle-ammo rarity. Hit tiers from dial accuracy: killshot (clean kill, advances chain), vital (big damage + stun), graze, miss. **Killshot chain = ONE action** (the locked "8 perfect kills = 1 turn"), breaking on any lesser tier or dry mag. **No stun-lock:** a second vital cannot refresh a freeze until the target has had a full turn back; re-vitaling still chips HP. A vital that KILLS continues the chain; a vital that only stuns does not. Combat rides the micro tier via Inventory.spendAmmo — never the fold. [PENDING: tier band cutoffs (placeholder .92/.70/.40); damage tables; weapon roster; forks #2 and #4 from the combat addendum.]
# PART TWO — THE CITY, THE SOCIETY & THE ANTAGONIST'S MIND
*(folds: Citybuilder Model 7/1, Succession & Bunker Guy 7/1, Perks & Abilities 7/1, Recorded vs Unrecorded 7/1, Amalgamation Threat Logic 7/1)*

## The City-Builder Model — Pocket City 2 Base (LOCKED shape)
Pocket City 2 is the locked construction reference. Bohemia adopts: **zone, don't hand-place** (the player designates zones; the SOCIETY auto-constructs — "not necessarily yourself, kinda like Fallout 4 but the society does it"; you are the planner, the population is the labor); **everything needs road + power + water to function** (dead/darkened otherwise); **daily upkeep on everything** (overbuild past income and you bankrupt — ties to the three-currency system: electricity/medicine/clout); **zones/buildings upgrade to higher tiers**.

**The Bohemia twists (LOCKED):**
- **Three cities = three generations, each an upgrade tier of the last.** One map, one valley, three escalating construction tiers matching the three texture states (apocalypse → recovering → modern). Gen 2's city is built on gen 1's bones.
- **Buildings gated by act/tier.** Act 1 = the baseline survivable set; Act 2 = special, genuinely hard (needs infrastructure, materials, faction cooperation); Act 3 = the hardest, grand city-defining structures. Progression is generational, not just XP.
- **The shipping/logistics spine.** The story is built around setting up train stations / shipping infrastructure. Logistics is how the city graduates tiers: Act 1 barely moves goods (foot, bike, horse); Act 3 runs real rail. Shipping capacity gates city growth; ties to the Caravan trade-route economy. [PENDING: the logistics tech ladder.]
- **Every building type can anchor a quest.** A building isn't a placed sprite; earning the ability to build it can BE a questline. Train stations anchor main-quest progression. [PENDING: the building catalog, Bohemia names, act-tiers, quest anchors — creative direction, Paolo's call; once handed over, Claude produces each entry's quest hook + sprite + three act-state versions.]
- **Everything can genuinely be rubble.** No investment = the city stays ruined, for real. Degradation is not cosmetic; the apocalypse texture is the DEFAULT.
- **The player becomes pseudo-mayor** (Mayor addendum governs the rungs: territory → popular mandate ~49% factions FWU → mayor governs). The mayor arc gates WHERE you may build; this layer is the HOW.

**Life-lesson underneath:** civilization is zoned, connected, and MAINTAINED across generations by people who mostly won't live to see it finished. Augustus was greater than Julius because he inherited unfinished work and didn't squander it.

**THE OPEN GUT-PUNCH FORK [PENDING, blocks the economy sim shape]:** do zoned buildings appear INSTANTLY once paid + requirements met (Pocket City 2 style, mobile-proven), or get CONSTRUCTED OVER TIME by the society (caravans haul materials, you watch it rise — grounded and gorgeous but a much heavier logistics sim)? This single answer defines light city-builder vs logistics sim. Also [PENDING]: zone naming, demand bars vs diegetic demand, power-grid abstraction vs light real grid (canon leans real: solar mega-project + Hoover-dam-equivalent make power geographic).

## The Succession System — Bohemia's SIGNATURE MECHANIC (LOCKED)
You can kill or remove anyone (nobody is plot-armored). When you do, the world runs a **POWER STRUGGLE to fill the vacancy**, playing out over REAL TIME (turns, even decades), resolving on the LOD forward-compute while you're elsewhere. Who wins depends on faction standing, economics, everything you've done. Society survived the apocalypse but CHANGED, and keeps changing around the holes you tear in it.

**Why it's nobody else's:** the Nemesis System is patented by Warner Bros through 2036 and is a fast-combat enemy-memory toy ("the best players get the least out of it"). Bohemia is the opposite — slow, turn-based, 100 years — the perfect home for the reactive-world idea, because we have the one thing Nemesis lacked: TIME for consequence to compound. Not an enemy-army hierarchy; a whole SOCIETY reorganizing around vacancies across generations, driven by faction economics and roles, not grudges. Paolo is interested in self-patenting (provisional application + real patent attorney; dated design docs support priority date; not legal advice).

**The architecture (three proven pieces):**
1. **Roles, not NPC-pointers** (Bethesda alias model): a role stores requirements + conditions, actors match at runtime; a kill writes a delta, the role re-queries. Prevents soft-locks.
2. **Vacancy = a contested EVENT with a winner** (Nemesis insight): kill the moderate leader and a hardliner may fill the vacuum, or the faction fractures, or a rival absorbs its territory.
3. **The generational fold makes it matter:** succession echoes for 100 years. The routing and the "kill-everything endpoint" (the world runs out of people to send and just stops) are the SAME system.

**Anti-soft-lock rule:** every role requires BOTH a fallback path (living NPCs first, spawned replacement over time IF the faction still has bodies — Dwarf Fortress migrant logic) AND a graceful closed-state (a bled-dry faction's thread CLOSES with a consequence ripple, never an error; that closure IS the kill-everything endpoint locally).

**Timing (LOCKED):** the struggle plays out over time, not instant — the crazy consequences intentionally bloom in decades 2 and 3. Fused-consequence system drives the reveal (fuse, warning, zoom-in). **Julius/Augustus framing:** gen 2 can be greater than gen 1 by inheriting unfinished work and not squandering it; the people who finish the work are rarely the ones who started it.

[PENDING: does a closed thread ever REOPEN if a faction recovers over a generation (permanent-delta vs fold-aware); spawned replacements vs alive-only (leaning both + graceful close).]

## The Bunker Guy Quest (LOCKED concept)
A rough, seen-it-all realist who diegetically delivers the founding premise (the apocalypse was ECONOMIC, not nuclear): "you think the Chinese wanna die? you think the Russians don't wanna live anymore either?" Mutually-assured-survival instinct is exactly why the collapse came economic. Then the twist: he shows you his BUNKER — a failed investment, built for an apocalypse that came in a form he never predicted. He's fine, he's chilling, but it quietly makes him sad. **Life-lesson:** people armor against the dramatic disaster they imagine and get blindsided by the slow quiet one that arrives. He prepped for fire and drowned. [PENDING: district/act placement, name, standalone vs faction tie-in, bunker as usable location after.]

## Perks & Abilities — the Build-Variety Axis (catalogued, NOT built)
The build-variety answer to RF4's class depth. **The locked spine:** the second bar = the mana bar = the time-dilation bar (ONE resource, powers time-dilation AND active abilities); the ability layer lives in the POSITIONING/TILES game after the cover rewrite (the dial stays pure execution); read-ahead powers are the combat expression of the Ghost Time Layer. Design law: abilities merge/simplify, never stat-bloat; the tell stays on the battlefield; never punish taking time.

**Abilities catalogued [not built]:** Invincible run to cover (bullet-immune sprint; mana cost scales with distance, guns-on-you, and pool size — the flagship: exposure survivable without being safe); Move 2 tiles + shoot exposed enemies in 1 turn; Auto-killshot (guaranteed kill, skips the dial, paid in mana — must cost enough to be a decision, not a default); See the enemy's next move (projected enemy movement, the purest Ghost Time expression).

**Perks catalogued [not built]:** Vital stun lasts 3 turns instead of 2 (extends the initial freeze; does NOT override the no-stun-lock law).

**Perception perks (from Camera addendum, LOCKED intent):** on the zoomed-out layer, perks grant PERCEPTION — see more movers, read the map deeper, buy back fine grain at city scale.

[OPEN: tree size (Claude's lean: lighter than RF4, a tight set of powers that each change how you play — Paolo's call); dynasty inheritance (carry / reset / family-knowledge spine); acquisition method (connects to VR_COMPANIONS_XP addendum).]

## Recorded vs Unrecorded — the Two-Ledger Principle (LOCKED)
**The tension:** the save makes the world a pure function of the choice log; the lore makes the dynasty's advantage the things that were NEVER recorded. **The resolution:** one flag per choice, `recorded: true|false`, two ledgers.
- **THE RECORDED LEDGER** (public, feed-touching, faction-facing): what the world computes from AND, in-fiction, exactly what the Amalgamation sees and models. **The game's own save file is the thing the antagonist reads.** Thematically perfect.
- **THE UNRECORDED LEDGER** (tunnels, compound, family, face-to-face): still deterministic for save/replay, but tagged off-ledger — the engine knows it, the Amalgamation-model is DENIED it.

**What this buys:** the antagonist's knowledge model is enforced by a flag, not authoring; the blind spot becomes a MECHANIC (the finale's whisper network literally runs on unrecorded coordination the machine never saw); the life-lesson as architecture — **what you do publicly can be modeled, what you do in trust cannot**; the save stays tiny. Clout tension: going viral earns currency but is maximally recorded — power-via-visibility vs safety-via-invisibility is a real strategic axis. [PENDING: the recorded:false authoring rule; player-visible ledger feedback (feed-ping vs no-ping); exposure events (a leak = the Amalgamation suddenly knows something it shouldn't).]

## The Amalgamation's Threat Logic (LOCKED)
**The rule: it triggers lethal action on ONE thing — threat to its own survival and secrecy. Not ambition. Not power. Fear.** A dynasty can consolidate the whole city, become pseudo-mayor, rule in all but name, and the Amalgamation does not care. **The threat scales with PROXIMITY TO THE SECRET, not player power.** You can be weak and doomed (stumbled onto the tunnels early) or immensely powerful and safe (never looked under the city).

Why it's load-bearing: it decouples "how strong am I" from "how much danger am I in"; it makes the antagonist genuinely non-human (no ego, only survival); it protects the city-builder payoff (building is safe, truth is lethal — the two fantasies stay cleanly separable); it's the mechanical blind spot (your city's footprint is loud NOISE; the truth-approach is the quiet axis that kills).

**The trigger list:** approaching the two surface data centers; nearing the tunnel infrastructure under the Homeless faction; uncovering the Dubai truth; threatening the Network's secrecy; any move that could expose the Amalgamation publicly. **Response ladder (surgical until forced overt):** natural-seeming accident → quietly accelerated faction conflict → untraceable out-of-state hit squad → activated Neuralink carriers (the moment it abandons secrecy). The player forces it up the ladder by getting CLOSER, never by getting STRONGER.

**Life-lesson, structural, never said:** what you build makes you loved; what you know makes you a target.

[PENDING design consequences: a "proximity-to-secret" heat value distinct from standing and power (rises from investigation, not combat or building); near-zero coupling between mayor rung and heat; response ladder mapped to heat thresholds; confirm the valid ending where a player rules Bohemia and deliberately never confronts the truth.]
# PART THREE — THE LIVING WORLD: CONSEQUENCE, ENTITIES & LOD
*(folds: Persistent Consequence & Mayor 6/30, Entities/Spawning/Delta 6/30, World Model & Camera LOD 6/30)*

## Persistent Consequence — Your Violence Stays (LOCKED)
**Cleared is permanently cleared, within an act.** A camp you wipe stays ended for the rest of that generation. No timer-based respawn, ever — banned at the architecture level. A violent playthrough visibly depopulates its region; the world remembers what you did to it. Free via the delta model: clearing logs a "cleared" delta that overrides the seed-spawn forever within the act.

**The generational threat reset (LOCKED, and it's NOT a respawn):** threats return only at the act/generational handoff — a NEW threat map, new camps in NEW locations, new hostile groups, generated fresh for the new act from seed + world state. Never a refill of what the player personally ended. **Life-lesson as mechanic: your father's war is over. You can win a fight for good, but you can't win it forever for your children.**

## The Mayor Arc (LOCKED shape, tuning PENDING)
The shining jewel: customizing the city in friendly territory, escalating to de-facto rule. **Three rungs mapping onto the acts:**
1. **TERRITORY** — build where you're loved (friendly-faction districts).
2. **POPULAR MANDATE** — at ~49% of factions FWU (Paolo's starting number), the city itself backs you: build even where the local faction doesn't love you. Popular support overrides local resistance.
3. **MAYOR** — governance; building markedly easier/cheaper/faster across the map. You're not negotiating anymore, you're governing.

**"Mayor" = PSEUDO-MAYOR / city-state strongman (LOCKED — resolves a real lore tension).** Formal government failed everywhere (Texas cautionary tale); the word "mayor" appears nowhere in core canon as an office. You are NOT elected; there is no restored municipal institution. Cities collapsed into city-state structure and you are the dynasty everyone defers to because you hold the territory, trade, defense, and loyalty — "mayor" is just what people call the family at the center of gravity (Renaissance communes, Sumerian city-states, post-Roman merchant families). You don't inherit an OFFICE across three generations, you inherit a FAMILY'S standing. **Life-lesson: legitimate power after collapse isn't granted by a system; you became load-bearing.** [PENDING: what the world calls it in-game ("the House," "the Family," "the Seat"?); rival pseudo-mayors / competing houses as Act 2/3 tension; exact numbers/curves; what "easier" grants per rung; rung demotion on lost favor.]

## Act 2 — "Shit Has Changed" (LOCKED intent)
Gen-2 wakes to a weathered world, not a reset: new threats, shifted factions, texture drift. **The dad's-book mechanic (LOCKED):** the player can read their father's book — a diegetic object — to revisit the Act 1 city as it was. Nostalgia as a literal object; cheap to build (the Act 1 state is deterministically reconstructable from the choice log; the book is a read-only reconstruction viewer). [PENDING fork, Paolo leaning "most things stay, lore-justified": do gen-1 buildings stand in Act 2, or partially decay for a rebuild hook? Candidate lore for "stays": family+allies maintain the compound; dynasty-as-armor continuity. Candidate for partial decay: neglected districts slide back; a specific Act 1→2 event damages a defined area. Decision deferred to Act 2 content design.]

## Entities, Spawning & the Delta Model (LOCKED architecture)
**The one big idea: SEED-REGENERATES, DELTAS-PERSIST.** The world regenerates from the seed; the save stores only what the player changed (the Minecraft model, same as the existing save system). Every entity is either **GENERATED** (deterministic from seed + location + world state; not in the save; most things) or **TRACKED** (the player caused a persistent change; a delta overrides the generated version; few things). **The graduation rule:** an entity is anonymous and generated until the player's action promotes it to tracked.

**Four entity classes:** (1) Terrain/static world — pure seed-gen; the Strip and Freeway Beltway are hardcoded anchors pinning the grid. (2) The player's base — the opposite extreme, 100% tracked, fully stored, exact (the one class that's entirely delta, because the player authored it). (3) NPCs & factions — anonymous background NPCs regenerate from seed (nobody notices a re-rolled face); named/consequential NPCs are tracked, placed exactly, remember you. **The SoD2 enclave lesson: hard ceiling on concurrently simulated groups** — cap HOT/WARM actors, named entities always get a slot, anonymous fill to the cap. (4) Enemies/loot/resources — seed + world-state generated; deltas only for emptied/depleted/cleared; defense waves are seed-driven functions of (base value, act, threat), reproducible and fair, never a stored army.

**Save impact:** the save gains bounded sections — `base` (built structures), `tracked` (named entity states), `deltas` (emptied/depleted/cleared by location). Save scales with what the player DID, never with world size: a 65-mile map and a 6-mile map save nearly the same. That property is what makes this shippable on a phone.

**The offline-simulation fork [PENDING, the biggest feel decision]:** SoD1 fully simulated survivors offline and players hated it into quitting; SoD2 removed it. Options: A "world waits" (forward-compute only to save.beat — safe, forgiving), B "world turns" (advance by wall-clock elapsed — immersive, historically hated when mandatory), or the likely-right hybrid: default A with specific opt-in telegraphed real-time events (timed defense, "hold this 3 days" contracts; the blackout/rain windows in v3 are exactly this). Engine supports all three.

[Also PENDING: anonymous re-roll tolerance (likely stable flavor, re-rollable individuals); entity cap number (needs phone profiling; SoD2's ~16 groups is a reference); resource node regen timers (likely timed, confirm).]

## World Model, Camera LOD & Simulation Detail (LOCKED architecture)
The problem: a 65-road-mile city, per-tile three-state textures, factions and economy running everywhere, 100 years, on a phone. Solved with **spatial LOD** (chunked streaming, quadtree aggregation, distant impostors — the RDR2/Skyrim standard) plus **simulation LOD** (Dwarf Fortress world-activation: one continuous simulation whose RESOLUTION changes with distance and attention).

**Three tiers:** HOT (the player's district: every enemy, per-tile textures, the dial, 120 BPM), WARM (nearby/relevant districts: aggregates — who controls it, output, texture average, threat; slow tick), COLD (the other 60 miles: compact records advancing in big deterministic steps). A COLD region promotes by **computing forward from its last state + elapsed ticks** — you don't pay for what nobody watched; you compute the result when someone looks.

**THE THREE CAMERA ZOOMS ARE THE LOD SELECTOR.** Street/Animal = HOT made visible. City/Human = the WARM aggregate state rendered as a living map (faction borders, district status, the feed). Planetary/Angel = COLD + dynasty meta (Earth-at-night glow, karma, virtues, the quest log — deliberately ONLY here). Zooming doesn't load a different scene; it reads the same world at a coarser tier. One system serves performance AND the signature camera feature.

**The three-state tile at every LOD:** HOT = per-pixel blend; WARM = district average ("mostly recovering, edging modern"); COLD = one number feeding the planetary glow. Change enough HOT tiles and the shift propagates up automatically — the city reflecting 100 years at the end is the natural top-of-hierarchy readout, not an endgame render. The save stores choices/events; tile/district/region states recompute forward on load.

**Time is the second LOD axis:** within an act, fine ticks; between acts, one big deterministic forward-compute across years (factions shift, districts drift, NPCs age or die). "Each generation inherits everything" is mechanically "recompute the world forward from the accumulated choice log."

**The Ghost Time Layer is LOD-native:** at every tier the engine already computes "where is this going" (forward-compute); the ghost layer is that computation made visible — enemy trajectories at HOT, faction expansion trends at WARM, dynasty/world connection lines at Planetary. The signature aesthetic and the core engine technique are the same thing wearing different clothes. The 5D theme gets a literal engine echo, deepening as you zoom toward the Amalgamation's vantage.

[PENDING: WARM promotion triggers; forward-compute hitch mitigation for long-COLD promotions (chunk across frames / cap resolution for huge gaps); determinism vs replay surprise (choice-driven divergence likely suffices, confirm); ghost-layer perf if fights spike; Godot vs custom for the spatial half.]
# PART FOUR — THE CHARACTER STACK: RIG, ART, ANIMATION & GARMENT LAWS
*(folds: Character Art 6/28, Babypunk 6/28, Face System 6/28, Micro Expressions 6/29, Rig & Zones 6/29, Animation & Ragdoll 6/29, Character Pipeline 6/30, Merge App Laws 7/2, One Package Laws 7/2, Garment Contact & Motion Laws 7/2, Animation Rebuild & Anatomy Laws 7/2. Where later 7/2 laws supersede earlier rules, the later law is stated and the supersession noted. Alphas 0.2 → 0.9 shipped across these sessions.)*

## The Spine — Paper-Doll Layered Sprites (LOCKED)
Every character (player, NPC, enemy) is a naked base body + ~13 apparel slots drawn in order (back → front): body, facial, glasses, pants, shoes, shirt, jacket, hair, hat (+ future slots, list open). Portrait customization is FOR EVERYONE. Proportions LOCKED at MID (~4.5 heads, taller than Stardew). Direction model: 8-direction; W/SW/NW mirror E/SE/NE art (asymmetric designs like logos will flip sides — [PENDING when the first logo garment appears: accept vs dedicated W-side art]). 2x HD resolution standard: author 1x (24x50 garments / 56-grid body), display via Scale2x — HD on everything, final. Pose families: 4 world families + the dial rig.

## The Rig — Bohemian Rig, the Law of the Land (LOCKED, sacred)
Skeletal/cutout animation with RIGID SKINNING (one bone per pixel). 56x56 canvas, 12 parts (1,2 head/face; 3,4 torso; 5,6 upper arms; 7,8 forearms+hands; 9,10 thighs; 11,12 shins/feet), 15-joint skeleton with the 3-point waist (Paolo's spec). Two breakthroughs that killed the old bugs: LAYERS (overlap is lossless) and INVERSE SAMPLING (no holes when limbs move).

**THE SACROSANCT RULE (hard, permanent):** Claude never touches, normalizes, auto-reshapes, meshes, or "fixes" body-part region geometry. Paolo's painted regions are baked verbatim, all 12 parts, all 8 directions. Refitting clothing to his regions is fine (reads only); reshaping is forbidden.

**RIG v2 IS CANON** (jaw fix, E/W face repaint — his art, his fix, canon everywhere via the one-package pipeline). **THE RIG LAW:** BAKED.pose (his hand-posed 6 dirs; S/N at rest by design) is the base skeleton for ALL render and animation. Art binds at the paint home (rest), the Skinner deforms rest → (his pose + clip delta) in one shot; his pose is the standing frame, every clip is a delta on top. Every build verifies against his rig before shipping (all 8 dirs within 1px at idle; SW right-leg-high must read in rendered pixels).

**THE DEPTH LAW:** his layerOverride semantics — LOWEST index = NEAREST. The Skinner screen-claim iterates his order per direction. Garment pixel depth = rank of the body part its bone belongs to per his CANDD; paints only if nearer-or-equal. Torso cloth can never bury a near arm. His per-dir wishes are encoded in layerOverride (S arms+hands nearest; SE/NE B-arm near; NW/W/SW A-arm near).

**BINDING LAW:** all binding (body and garments) goes through his CANDD side-locked per-direction map; garment pixels bind within the CANDD of the body part beneath (3px spill neighborhood); side-locked fill never bridges legs.

## The One Package Law (LOCKED)
Nothing is standalone. Every tool, module, and view speaks to every other one: change the rig and it changes in character view, animation, colors, combat, everywhere. When coding ANY feature, build the engine plumbing so every similar task is seamless under the same laws — a feature that works in isolation but does not propagate is a bug. Implementation: the embedded rig tool broadcasts live state to the app (ONE-PACKAGE BRIDGE, postMessage, 700ms debounce); the app rebuilds all 8 Skinners live. Rig edits ARE the canon, live.

## Garment Laws (LOCKED — the mass-production rules)
- **GARMENT CONTACT LAW:** each slot may only touch its allowed body parts; any garment obeying the law drops into the game clean. PANTS: legs+feet only (9,10,11,12), never torso/waist. SHOES: their foot only, max 2px beneath the knee pivot. SHIRT: torso + arms (4,5,6); NECK only if turtleneck-rated. JACKET: same as shirt (this killed the japanese-fuzz eating the whole body). HAT: upper half of head, stops before the eyes — THE DURAG IS THE ULTIMATE SKELETON: it defines the minimum hat shape and the MAXIMUM southern travel (HAT_MAX_Y per direction). NECK GRANDFATHER RULE: Paolo's existing neck-touching garments keep it. [PENDING: contact rules for hair/glasses/facial.]
- **HAND LAYER LAW:** hands (7,8) ALWAYS render one layer nearer than arms; arm clothing never bleeds onto the hand layer (`Skinner.handLaw`; supersedes the old 3.2px hand-joint radius hack). Future gloves opt out via `coversHands` [PENDING: gloves slot].
- **JACKET OPEN FRONT LAW (production rule):** jackets are drawn with nothing in the middle front so the shirt shows. Paolo's existing jackets are canon as-is.
- **HAIR COVER LAW:** facing N/NE/NW, equipped hair covers the entire head part — no bald back-of-head.
- **Garment authoring standard:** all garments are 24x50 anchored at offset (16,3) into the 56 grid. Every new garment MUST author on that canvas or the contact law clips it wrong.

## Motion & Anatomy Laws (LOCKED)
- **120 BPM LAW:** one clock, BEAT=0.5s, every clip phrased in beats; combat, scheduler, and heartbeat phase-lock for free.
- **IDLE LAW:** idle is BREATHING. Feet NEVER move, no floating; a gentle 1px pixel-snapped chest/head rise once per cycle plus slight arm movement (the old hipOff float is deleted).
- **HEAD BOB LAW:** facing N or S, the head gets a slight 1px pixel-snapped bob (walk/run: one dip per step; idle: one per cycle) — supersedes "no bob" for the HEAD ONLY; the body still has no N/S sway. Neck and headTop move together so hair and hats follow.
- **N/S CRUNCH:** head-on gait has no sway, no body bob; legs alternate REAL bone-length compression toward the hip pivot (legCompress; walk 0.72, run 1.0, crouch 0.38). **N/S ARM CRUNCH LAW:** both arms pivot INWARD (fixed lean, no swing) and COMPRESS toward the shoulder, opposite-synced to the legs (first-pass 0.10 inward / 0.25 compression, Paolo tunes).
- **CONTRALATERAL LAW:** walking or running, the arm and leg on the same screen side ALWAYS swing opposite.
- **MIRROR RULE:** all arm rotation terms (upper AND forearm) negate on W/SW/NW.
- **PIXEL SNAP LAW:** the posed skeleton snaps to integer pixels before skinning (killed E/W shimmer).
- **SWING LAW:** the swing amplitude slider drives every clip's amplitude (0.5 = 1x; range 0.1x–2x).
- **WIDTH LAW:** limb compression crunches pixels ALONG the bone only; width perpendicular to the bone NEVER changes (anisotropic seg at the transform level; rotations identical). Known 1px note at extreme compression, fix candidate filed.
- **ANATOMY LAW v2 (supersedes v1):** ONE base skin tone + ONE darker tone only, NO black shadows ever. 1px contour in the darker tone per LIMB GROUP (arm+hand one group, leg+foot one group, torso one group; line ends in the armpit; no hand-arm or foot-leg junction lines). HEAD and FACE never bordered. NIPPLES off the rig skeleton at shoulder-line +5px: front views two (torso center ±3), profiles one (first pixel inside the facing chest edge), back views none.
- **SHOULDER + WAIST BLEND:** the body is ONE piece — waist (legs meeting torso) gets NO border ever; the shoulder blend zone (top-inside pixels, shoulder row +1) stays base tone, the inner border resumes below into the armpit. Legs still border each other at the crotch.
- **Animation hard rules carried:** arm pivot at the shoulder; limbs never fly far apart; hallucinate holes, never flat-fill; camera never zooms into a body part; render frames to visually verify before shipping; Paolo does not tune animations in-tool (he directs, Claude produces, he approves by eye).

## The Clip Set (rebuilt on rig v2, first pass, Paolo tunes by eye)
idle, walk, run, pistol, two-hand, deadeye, melee, reload, hurt, crouch, kneel, lean, lean-x, lean-p, lean-2h, sleep, headshot, ragdoll, death — all parametric on the v2 pose base, all through the same applyPose, all obeying the laws. **HEADSHOT (locked physicality, Paolo's spec):** 4 beats — head snaps back on impact (0–0.08), torso gives FIRST and knees fold (0.10–0.45), arms hold UP on inertia while the body drops (0.15–0.35), torso falls BACK with a hard resistance clamp (spine ≥ -0.55, never folds into the waist), arms come in slightly LAST (0.72–1). Arm inertia stays keyframed, not physics-simulated (cheaper, deterministic, tunable; real ragdoll only if a clip provably can't sell it).

## Face, Portrait & Skin (LOCKED)
Face system: a face is built from REGIONS, each a parameter; head-shape-first rule; always 90° straight-on (whole project); portrait framing = circle default; portrait→sprite bridge BUILT. The verbatim alpha portrait stack is canon: PUNK face, SKR ramps, 9 SKIN_TONES, 7 HAIR_COLORS, 6 IRIS, 5 LIPS, 4 BROWC; 5-row editor (Skin/Hair/Eyes/Lips/Brows). **Face-to-body tint pipe:** facial ramp remaps [54,44,40]→brows, [82,88,82]→iris×0.55, [136,88,84]→mouth×0.74; hair luminance-tints by hairColor; SK_DEF→skinTone — the walking character follows the portrait.

**SKIN DETAIL LAYER ARCHITECTURE (LOCKED design):** the rig is the be-all end-all LAW OF THE LAND for geometry; everything stacks on top. LAYER 0: rig regions + skeleton (edited ONLY in the rig tool, sacred). LAYER 1: SKIN DETAIL overlay (paintable in the skin ramp — nipples and skin touches; algorithm seeds defaults, Paolo's edits override, per direction). LAYER 2: garments, contact-law clipped. Editing a nipple never touches the rig; editing the rig never wipes skin details.

**GARMENT TOUCH-UP EDITOR (shipped 0.7):** pencil EDIT beside every slot row — full-screen pixel editor per equipped piece, per direction, paint with the piece's own ramp; SAVE applies live (one package); EXPORT dumps JSON to send to Claude = the durable save path. BODY's edit = EDIT SKIN (tone swatches + skin-detail brush + export); geometry stays rig-tool-only. **COLORS (replaced the Ramps tab):** every garment stores colors as ramp indexes; tap to retint a whole piece (structure preserved, outline locked) — one jacket becomes fifty without repainting.

## Babypunk — Player Character #1 (LOCKED look)
"Most baby-punk outfit I've ever worn": all black, the only two bright values are the pale face and the platinum hair — that contrast IS the silhouette. Slots: backwards black hoodie reading as a cowl (full long sleeve); black designer Japanese jacket with black fuzzy hood (hoodDown / hoodUp variants); tight black leather pants with fuzzy legwarmer bottoms baked in as one item (leather carries the only specular sheen); black Balenciagas; platinum shaggy jaw-length parted hair; optional tight black beanie; pale skin, strong dark brows, light eyes, septum ring. Hand-authored daylight-readable palette on file (addendum 6/28). Value-separate the black mass: jacket darkest, cowl softest, leather sheens, fuzz carries texture; face + platinum stay the brightest pixels. [PENDING: iconic hood state hoodDown vs hoodUp; character #2 Keira, photo pending.]

## Micro-Expression System (CATALOGED, not built)
Eyebrows + lips as a cheap universal expression layer, designed as patterns like the Dead Eye Dial patterns. Two layers, plugs into the portrait/sprite bridge. Explicitly NOT NOW.

## Production Headache Flags (filed, will bite later)
Rig persistence on iPhone (localStorage eviction; app-owned rig state is the fix, scheduled with combat-native integration); body-swap refits (female/child rigs need a refit pass per rig — reads regions only, never reshapes); Scale2x smears 1px details (2px minimum feature size rule); combat merge must namespace its globals (Combat.G) before leaving the iframe; bridge debounce is tunable if painting janks; frame caching (~8–16 frames per clip per dir turns per-frame skinning into a lookup — THE iPhone perf move before combat-native); skin detail exports must fold into the next build's baked defaults; skin detail layers become per-rig once female/child land.
# PART FIVE — ENGINE LAWS, COMBAT DNA & WORLD EXTENSIONS
*(folds: Engine Architecture 6/30, Combat DNA RF4 6/30, VR/Companions/XP 6/28, Master Systems Map 7/1)*

## The Five Architectural Laws (LOCKED — every system inherits them)
The through-line since combat: **one shared engine, single source of truth, many faces** (demos are stamped from the engine, never hand-edited, so they can't drift).
1. **SEPARATE DATA, LOGIC, AND RENDER.**
2. **THE CLOCK OWNS TIME** (fixed timestep; the 120 BPM heartbeat + the scheduler).
3. **DETERMINISM** (seed + inputs = the whole world; makes forward-compute, tiny saves, and the generational fold exact).
4. **SAVE VERSIONING** (never break an old save; the migration chain — schema has walked v3→v7+ across these sessions, every step migrating).
5. **SYSTEMS ARE ISLANDS** (they talk through DATA, not to each other).
Plus the **three-state tile** world model (apocalypse/recovering/modern per tile, load-bearing for the whole engine) and the packaging reality: code quality = app quality on an iPhone HTML target.

## Combat DNA — Steal RF4, Beat It With Guns + 120 BPM (north star)
RF4's foundational tension: maximize BOTH tactical roguelike depth AND fast crunchy mayhem, at full volume — never a middle ground. Bohemia inherits the pillars and goes past them: (1) the dial makes EXECUTION a live skill, not just decision-making; (2) rhythm is a skill dimension RF4 doesn't have; (3) guns change the geometry of the fight; (4) the "no punishment for taking time" rule out-elegances RF4's resource tax; (5) difficulty from shape and speed, never cheap tricks.

**THE DESIGN YARDSTICK (use on every combat decision):** Does it reward player skill over character stats? Does it keep the player thinking about position and angle? Is it deterministic and learnable, or cheap randomness? Is the tell ON the battlefield, readable for free? Does it MERGE/simplify, or add stat bloat? [PENDING: how much environmental interaction the gun-native version wants — fire spread, blackouts killing LOS, weather changing cover; blackout-as-escape is already canon and is exactly this.]

The Dead Eye Dial itself (52 patterns, PAT_DIFF tiers, the five difficulty packages EASY/NORMAL/HARD/VERY HARD/BOHEMIAN with speed convergence, ARC_MULT 1.11, deleted-forever patterns orbit and pulse2) is locked in GDD v3 Part One and BOHEMIA_DEAD_EYE_DIAL_PATTERNS.md.

## VR, Companion Thresholds & XP (LOCKED INTENT)
**VR/headsets exist in the world** (pre-crash Oculus/Vision lineage alongside Neuralink and Project Angel). The dynasty can build a **VR station in the compound**: simulate and gain real experience without risking death — the safe grind. Some enemies and NPCs wear headsets, scaled to area/era adoption; **the Network has notably higher adoption** — one more voluntary data-feed vector, a quiet tell like the rain/cooling tell. [OPEN: VR XP transfer 1:1 vs discounted; VR failure costs; headset enemies more dangerous (augmented) vs more exploitable (half somewhere else); VR as an Amalgamation influence path — keep the 5D ambiguity intact.]

**Companion combat thresholds:** companions don't suicide into fights. The player talks to a companion and sets a health threshold at which they pull out of combat (e.g. under 70%, disengage). Pairs with permanent companion death + one-revival-per-act: the threshold is how you keep them alive BEFORE you need the revival. [OPEN: per-companion vs global default; what "pulls out" looks like on the grid; do courage/loyalty traits nudge willingness to hold.]

## Where Everything Stands (the systems map, condensed)
**Built + green:** engine bundle (bohemia_engine.js, 14 modules incl. Skinner with all garment/depth/anatomy laws, Retarget, Scale2x, RigData v2): Core, Save (v7 schema), Inventory, Combat, Economy, Factions, Entities, Heartbeat, Skinner, WorldGen, FactionCanon, Generations (fold + save↔fold bridge + amalgamationModel), scheduler ("I move you move"), master loop scaffold. Merge app through **ALPHA 0.9**: Character (paper-doll + colors + touch-up editors + skin editor), Animation (full clip set on rig v2), Rig (embedded live tool, one-package bridge), Combat tab (v12 embedded via iframe, native integration next). Dead Eye Dial: 52 patterns + packages, playable.
**The signature systems, locked in design:** Succession (build pending), two-ledger recorded/unrecorded, Amalgamation threat logic (proximity-to-secret heat), generational fold, mayor arc, two-scale camera + variable timestep + fused consequences, city-builder (Pocket City 2 base).

# PART SIX — CONSOLIDATED PENDING DECISIONS [all Paolo's calls]
**Blocking / near-term:**
- Combat-native integration (namespace Combat.G, frame caching first for iPhone perf)
- Instant vs constructed-over-time buildings (defines light city-builder vs logistics sim)
- Offline-simulation model (world waits / world turns / opt-in hybrid — hybrid leaning)
- Clip-by-clip review of the rebuilt animation set; headshot timing tune
- Female + child rigs (then garment refit passes, per-rig skin detail)
- Skin detail layer build (architecture locked, build scheduled)
**Design forks:**
- Perk tree size + acquisition + dynasty inheritance; which perks grant which perception
- recorded:false authoring rule; player-visible ledger feedback; exposure events
- Succession: closed threads reopening across generations; spawned replacements
- Warning specificity on fused consequences (named vs direction-only); reached consequences fully playable vs shortened beat
- Economy carry fraction at generational fold; standing decay across the skip; wound modeling; Act 2 building persistence exact rule (leaning "most stays, lore-justified")
- Building catalog (names, act-tiers, quest anchors); zone naming; demand display; power grid abstraction; logistics tech ladder
- Pseudo-mayor in-world naming ("the House" / "the Family" / "the Seat"); rival houses as Act 2/3 tension; mayor rung numbers and grants
- Amalgamation heat thresholds mapping to the response ladder; the never-touch-the-truth ending confirmed as valid
- Day/night driving mechanics vs cosmetic; walkable city exact size
- Bunker Guy placement/name/faction tie/bunker-as-location
- VR opens (above); accuracy tier cutoffs; damage tables; weapon roster; mag sizes; ammo weight; item roster
- Gloves slot; mirrored-facing asymmetric garment art; hood state hoodDown vs hoodUp; Keira (photo pending)
- Entity cap number (profiling); anonymous re-roll tolerance; resource regen timers; WARM promotion triggers; Godot vs custom for spatial streaming
- Environment interaction scope in combat
