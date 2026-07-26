# BOHEMIA QUESTBOOK — DEEP DIVE 52: THE DECKBUILDING ROGUELITE / SYSTEMS THAT FEED EACH OTHER (Slay the Spire)
Full teardown, the whole enchilada: build-a-deck-during-the-run, deck-thinning/card-removal, synergy-over-
stacking-power, the branching-map risk/reward, enemy-intent telegraphing, deck-transforming relics, the
systems-feed-into-each-other elegance, the Ascension difficulty ladder, the honest flaws, and Bohemia
ports. This is the medium's model for ELEGANT INTERLOCKING SYSTEMS + a build you ASSEMBLE mid-run +
transparent risk/reward decisions. The genre-defining roguelite deckbuilder. Mega Crit. Reference only;
Paolo does not read it. No Bohemia quest written here.

Game: Slay the Spire (Mega Crit, 2019). A roguelike deckbuilder: pick a character, climb a 3-act tower,
and BUILD your card deck AS you go (adding, upgrading, removing cards + collecting relics) through
turn-based fights. The genre progenitor + gold standard — nearly every deckbuilder since (Monster Train,
Inscryption, Balatro-adjacent) descends from it. On iOS/mobile (relevant to our platform).

===============================================================================
## 0. THE CORE IDEA (why it's in the canon)
===============================================================================
- BUILD THE DECK DURING THE RUN (the genre innovation): unlike collectible card games (Hearthstone/Magic)
  where you build a deck BEFOREHAND, StS has you ASSEMBLE your deck WITHIN a single run — add, upgrade,
  and REMOVE cards + collect relics as you climb. The build EMERGES from the choices the run offers you,
  not a pre-plan. Every run is a fresh puzzle of "what can I make from what I'm given" (cf. our roguelite/
  fold run-by-run build; the emergent-build model).
- SYSTEMS THAT FEED INTO EACH OTHER (the elegance — the core lesson): "the brilliance is how every system
  feeds into the others." Cards are puzzle pieces; RELICS fundamentally alter how decks function; ENEMIES
  force tempo/scaling/resource thinking; even the MAP is strategy. Deceptively simple parts (cards, energy,
  block, relics, map) INTERLOCK into deep emergent decisions — elegance over complexity (cf. immersive-sim
  interlock Q08/Q15, RimWorld/DF Q44/Q45; StS is the TIGHTEST small-system-set).
- LESS IS MORE (deck-thinning — the counterintuitive masterstroke): success comes NOT from stacking
  overwhelming power but from a LEAN, focused deck. You REMOVE your weak starter cards (Strikes/Defends)
  so your powerful SYNERGIES draw consistently — "trimming makes your synergies show up." Subtraction as
  strategy; a tight 20-25 card deck beats a bloated one (cf. our scope-discipline/FACTORY-quality-over-
  quantity; the anti-bloat principle as a MECHANIC).

===============================================================================
## 1. THE ARCHITECTURE (how the interlocking systems work)
===============================================================================

### THE BRANCHING MAP (risk/reward navigation — the meta-layer)
- Each act is a BRANCHING MAP of nodes: normal fights, ELITE fights (harder, better loot/relics), shops,
  campfires (rest/upgrade), unknown EVENTS, treasure. YOU choose the route — a constant risk/reward
  calculus (fight an elite for a relic, or take the safe shop path?). The map itself is a strategic layer
  BEFORE any card is played (cf. our overmap/route choices, Darkest Dungeon dungeon-map Q41, FTL).

### ENEMY INTENT TELEGRAPHING (transparent, plannable challenge — key craft)
- You SEE what each enemy will do NEXT TURN (attack for X, buff, defend) — so combat is a PLANNABLE
  puzzle, not a guess. You block exactly the incoming damage, time your burst, respond to their pattern.
  Transparency turns RNG combat into STRATEGY — you fail from misplay, not surprise (cf. our combat-dial
  readability, the fairness principle; telegraphing = fair challenge).

### RELICS (build-transforming artifacts)
- 200+ RELICS are passive artifacts that FUNDAMENTALLY change how a deck works (free skills, extra energy,
  draw-engine changes, rule-breakers). A relic can REDEFINE your whole strategy mid-run — the run-altering
  "wildcard" that forces adaptation + creates emergent builds (cf. our perks/upgrades, Hades boons Q47,
  Darkest Dungeon trinkets Q41).

### SYNERGY OVER POWER (the discovery engine)
- 350+ cards create near-infinite COMBINATIONS — some synergies obvious (strength-scaling), some requiring
  creative discovery (Corruption makes skills free -> Dead Branch generates cards on exhaust -> an engine).
  The JOY is discovering a combo that clicks — "endlessly satisfying moments of discovery." Depth from
  INTERACTION, not raw numbers (cf. our systemic-synergy potential, Disco skill-interplay Q05).

### THE ASCENSION LADDER (scaling difficulty for mastery)
- After winning, ASCENSION levels (1-20) add stacking modifiers that raise difficulty — a long mastery
  curve that keeps deep players engaged without changing the core. Optional, incremental challenge escalation
  (cf. our difficulty packages, Hades Heat/Pact Q47; graduated mastery).

### ADAPT, DON'T FORCE (the anti-one-strategy rule)
- You "can't rely on a single strategy forever" — each enemy/act demands a different response; you ADAPT
  your build to what the run gives + what you face. Flexibility over a fixed plan (cf. our systemic
  adaptability, immersive-sim Q15).

===============================================================================
## 2. THE HONEST FLAWS (banked)
===============================================================================
- RNG CAN FEEL UNFAIR / RUN-ENDING: bad card/relic offerings or a brutal elite can doom a run through no
  misplay — the common roguelike complaint ("subsequent runs don't turn out because of RNG, I get annoyed
  and drop it"). LESSON: mitigate RNG with enough PLAYER AGENCY (choices, removal, telegraphing) that
  losses feel EARNED — StS mostly succeeds via transparency + deck control; we must too (cf. Darkest
  Dungeon/RimWorld RNG-fairness Q41/Q44, our odds-must-feel-fair).
- MINIMAL NARRATIVE: StS is nearly pure mechanics — thin story/theme (a tower, some events). LESSON (our
  edge): the deckbuilding LOOP is elegant, but we can wed systemic elegance to an AUTHORED narrative
  (our Amalgamation/fold) — get StS's mechanical tightness AND story (cf. Hades' narrative-roguelite Q47).
- UTILITARIAN ART/PRESENTATION: widely called mechanically brilliant but visually plain ("wish it had
  better art"). LESSON: elegant systems deserve strong presentation — our art/music/tile pipeline is a
  differentiator; don't ship depth in a drab shell (our aesthetic strengths).
- THE "CLEAR ONCE THEN DROP" TRAP: some players win once + bounce when RNG sours. LESSON: give reasons to
  keep climbing beyond raw challenge (StS uses Ascension + unlocks + build-discovery) — our narrative/fold/
  meta-progression must pull players back (cf. Hades' story-pull Q47, our generational hook).

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. BUILD THE DECK DURING THE RUN: assemble your build WITHIN a run from what you're offered (add/upgrade/
    remove) — an emergent build, not a pre-plan; every run a fresh puzzle (cf. our roguelite/fold build).
W2. SYSTEMS THAT FEED EACH OTHER (elegance over complexity): simple parts (cards/energy/block/relics/map)
    INTERLOCK into deep decisions — tight small-system-set beats sprawling complexity (cf. Q08/Q15/Q44).
W3. LESS IS MORE (deck-thinning): REMOVE weak cards so synergies draw consistently — subtraction as
    strategy; a lean deck beats a bloated one (anti-bloat as a MECHANIC; cf. our scope discipline).
W4. THE BRANCHING RISK/REWARD MAP: choose your route (elite-for-loot vs safe path) — a strategic meta-
    layer before combat (cf. our overmap, Darkest Dungeon Q41, FTL).
W5. ENEMY INTENT TELEGRAPHING: see the enemy's next move -> combat is a PLANNABLE puzzle; you fail from
    misplay not surprise — transparency turns RNG into strategy (cf. our combat-dial readability; fairness).
W6. BUILD-TRANSFORMING RELICS: passive artifacts that REDEFINE how your deck works mid-run — run-altering
    wildcards that force adaptation + emergent builds (cf. our perks, Hades boons Q47, DD trinkets Q41).
W7. SYNERGY OVER POWER (discovery): depth from card INTERACTION, not raw numbers; discovering a combo that
    clicks is the joy — "endlessly satisfying discovery" (cf. Disco skill-interplay Q05, our systemic synergy).
W8. THE ASCENSION MASTERY LADder: optional stacking difficulty (1-20) for a long mastery curve without
    changing the core — graduated challenge (cf. our difficulty packages, Hades Heat Q47).
W9. ADAPT, DON'T FORCE: no single strategy works forever; adapt to the run + the foe — flexibility over a
    fixed plan (cf. immersive-sim adaptability Q15, our systemic design).
W10. EASY TO LEARN, ENORMOUS DEPTH: a "deceptively simple loop" (climb/build/fight/repeat) hiding vast
     depth — the accessibility+depth sweet spot (cf. our SUN-MODE/onboarding + systemic depth; mobile fit).

===============================================================================
## 4. BOHEMIA PORTS (directions, not built) — the interlocking-systems + emergent-build model
===============================================================================
Slay the Spire is the master model for ELEGANT INTERLOCKING SYSTEMS + an emergent mid-run BUILD + fair
transparent challenge — directly useful for our roguelite/fold structure, our combat, and our city-builder
economy. It's on mobile (fits us), and its "less is more" is our scope-discipline as a MECHANIC. Our edge:
wed StS's mechanical tightness to our AUTHORED narrative + aesthetic.
- W1 (build during the run): our ROGUELITE/fold should let the dynasty ASSEMBLE its build (perks, gear,
  district config, faction alliances) WITHIN a run/generation from what's offered — an emergent build,
  every generation a fresh puzzle (ties our roguelite/fold, upbringing Q42, Rogue Legacy Q49, perks system).
- W2 (systems that feed each other — the core lesson): bank the ELEGANCE mandate — Bohemia's systems
  (survival economy + combat dial + conscience + factions + the fold) should INTERLOCK so simple parts
  create deep emergent decisions, NOT sprawl into disconnected complexity. Fewer systems that FEED EACH
  OTHER > many that don't (ties immersive-sim Q08/Q15, RimWorld/DF Q44/Q45, our FACTORY LAW/scope; a
  guiding design principle).
- W3 (less is more / deck-thinning as a MECHANIC): consider anti-bloat MECHANICS — the dynasty PRUNES
  (survivors, buildings, obligations, cards-equivalent) so its core SYNERGIES work consistently;
  subtraction as strategy (ties our scope discipline made diegetic; a lean district/build beats a bloated
  one — an elegant, on-theme survival mechanic).
- W4 (the branching risk/reward map): our OVERMAP/exploration should be a branching risk/reward layer
  (push into dangerous territory for better resources vs the safe route) — strategy BEFORE the encounter
  (ties our overmap, Darkest Dungeon Q41, Gothic no-scaling risk-map Q51; Paolo owns layout, Claude the
  node/risk data).
- W5 (enemy intent telegraphing — fairness): our COMBAT (Dead-Eye dial) should TELEGRAPH threats so
  fights are PLANNABLE puzzles — the player fails from misplay, not surprise; transparency = fair
  challenge (ties our combat-dial readability/difficulty packages, our regression-gate/no-brick-wall; the
  fairness principle).
- W6 (build-transforming relics): our PERKS/upgrades should include run-altering WILDCARDS that redefine
  a build mid-generation (a relic-equivalent that transforms the dynasty's strategy) — forcing adaptation +
  emergent builds (ties our perks system [PENDING scope], Hades boons Q47, Darkest Dungeon trinkets Q41).
- W7/W9 (synergy over power + adapt): make Bohemia depth come from system INTERACTION + discovery (a combo
  of perks/factions/buildings that clicks), and reward ADAPTATION over a fixed plan — no single strategy
  wins forever (ties Disco Q05, immersive-sim Q15, our systemic synergy).
- W8/W10 (Ascension ladder + easy-to-learn/deep — mobile fit): our DIFFICULTY PACKAGES are StS's Ascension
  (optional graduated mastery); and bank the accessibility+depth SWEET SPOT — a simple core loop hiding
  vast depth, ESSENTIAL for our iPhone/mobile target (ties our difficulty packages, SUN-MODE/onboarding,
  single-file mobile constraints; StS proves deep systemic games THRIVE on mobile).
- FLAWS (bank): mitigate RNG with enough AGENCY (choices/removal/telegraphing) that losses feel EARNED
  (our odds-must-feel-fair Q41/Q44); wed StS's mechanical tightness to our AUTHORED narrative + aesthetic
  (our edge — Hades-style Q47, not pure-mechanics); ship the depth in a STRONG presentation (our art/music
  pipeline — don't be the drab-but-brilliant game); and give players reasons to keep climbing beyond raw
  challenge (our fold/narrative/meta-progression pull).

## SOURCES
ResetEra "one of the most influential games" (build-during-run vs Hearthstone-prebuild, deck cycles/
upgrades/limited-removes, branching map elites/events/heals, multi-act + boss structure, Dominion tabletop
roots, bridge tabletop<->digital, "clear once then drop on RNG" trap); AllKeyShop + Gunslinger's Revenge
review (build-new-deck-each-run, remove/upgrade/synergy, enemies add junk cards, energy costs, SEE enemy
intent + prepare, Ironclad/Silent characters, elite high-risk-high-reward, keep-deck-lean 20-25 remove
Strikes/Defends, 350+ cards/200+ relics, Apotheosis/Limit-Break upgrades, Corruption+Dead-Branch engine);
VideoGamer "why it still rules" (systems-feed-into-each-other, cards-as-puzzle-pieces, relics-alter-decks,
map-is-strategy, elegant risk/reward balance, RNG-live-or-die, efficiency-over-stacking-power/adapt);
Eneba tips + arxiv (branching procedural map risk/reward, Ascension, the Heart/Beat-of-Death punishes
big decks, keys, StS2 2026). Cross-ref Questbook 47/49 (Hades/Rogue Legacy — roguelite build/boons/heir),
41 (Darkest Dungeon — map/trinkets/RNG-fairness), 44/45 (RimWorld/DF — interlocking emergence), 08/15
(immersive-sim interlock/adapt), 05 (Disco — skill-interplay/synergy), 51 (Gothic — no-scaling risk-map),
23 (Elden Ring — earned challenge), our roguelite/fold + upbringing + perks system [PENDING] + combat dial
+ difficulty packages + overmap + survival economy + conscience + factions + FACTORY LAW/scope discipline +
regression-gate/no-brick-wall + SUN-MODE/mobile + art/music pipeline. FUTURE: the Game Maker's Toolkit
episode on StS's design; a Mark Brown / Mega Crit analysis; an Inscryption deep-dive (the narrative-
deckbuilder that weds StS mechanics to a meta-story — the model for our "mechanics + authored narrative"
goal) or Balatro (the synergy-engine roguelite).
