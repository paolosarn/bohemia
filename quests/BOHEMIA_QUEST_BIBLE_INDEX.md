# BOHEMIA — QUEST BIBLE (master index)
The booklet. Each quest is its own file (safe to edit, won't scramble the others);
this index is the single-glance table of the whole bible. Grows as quests are cooked.
Built per BOHEMIA_QUEST_PRODUCTION_LAW_7_10_26.md + the dialogue/scene spec.

## TWO LAYERS (7/23/26)
This numbered table (below) is the DESIGN-DOC layer: 53 fully-produced script-to-scene
teardowns (`BOHEMIA_QUEST_###_*.md`). There is now also a PLAYABLE layer in `quests/bq/`
— actual `.bq` machine files that RUN in the engine (BQ parser -> BQRuntime -> the live
loop's `ctx.quests`), gated by `gates/bohemia_canon_quests_gate.js` (gate: CANON QUESTS).
The first batch of five playable canon SIDE quests (S01-S05) landed 7/23 once the engine
was fully wired (factions + economy + CLOUT). See `quests/bq/README.md` and
`laws/BOHEMIA_ADDENDUM_PLAYABLE_SIDE_QUESTS_7_23_26.md`. The design-doc layer is the WHAT;
the `.bq` layer is the PLAYS-RIGHT-NOW. They are tracked separately; the 53 below are untouched.

### PLAYABLE `.bq` SIDE QUESTS (quests/bq/*.bq — gate: CANON QUESTS, 120/120)
| id | name | shape | factions | CLOUT endings (emergent by deed loudness, never a label) |
|----|------|-------|----------|-----------|
| S01 | The Meter Reader | economy-as-morality (electricity) | TRADES/NETWORK | quiet / notable / reckless (+ quiet FAIL) |
| S02 | The Same Crate Twice | double-agent, reputation-travels | REDS/BLUES | notable / risky / reckless (+ quiet FAIL) |
| S03 | One More Set | tender release-valve (performer) | COLORFUL | quiet / notable / risky (+ quiet FAIL) |
| S04 | What Cries in the Deep | contract, monster-is-a-person | HOMELESS/NETWORK | quiet / reckless / risky (+ quiet FAIL) |
| S05 | The Standing Bounty | repeatable dark grind (creeping-normality) | REMNANTS | risky / reckless (+ quiet FAIL), @ONCE false |
| S06 | Behind the Fence | tender family / attention-over-force — **MARCO the neighbor + his daughter** (canon 7/23) | founding/NONE | quiet / notable (+ quiet FAIL) — the most important bond earns the FEWEST followers |
| S07 | Say It Back | slow-burn faith, NO combat (game refuses to score it) | CHURCH/VOLUNTEERS | quiet / notable / risky (+ quiet FAIL) |
| S08 | The Toll Road | exploit-the-lever / racket-break | CARTEL/CARAVANS | quiet / notable / risky / reckless (+ quiet FAIL) |

## HOW THIS WORKS (pace note, locked 7/10/26)
- Claude cooks ONE fully-produced quest per turn (script -> presentation -> engine),
  sometimes two if small. Not ten — quality per quest is the point.
- ANY reply from Paolo in production mode = "cook the next quest." A single letter,
  "k", "next", "go", "." — all mean advance. Paolo need not compose a real message;
  only speak up to STEER, kill, or change direction.
- Names pull from Paolo's music catalog where one fits.

## TARGET: ~90+ (match/beat New Vegas vanilla)
Tiers: T1 pillar (~6-10) | T2 side (~30-40) | T3 unmarked tail (~40-50) + faction/
route variants multiplying on top. Overshoot, then cut the weak.

## PROGRESS
Cooked: 53 / ~90

| # | Name | Tier | Shape / engine | Core wire | File |
|---|------|------|----------------|-----------|------|
| 001 | Moths Around the Last Light | T3 | witness (Howard) | unrecorded ledger + fold echo; HOMELESS | BOHEMIA_QUEST_001_LAST_LIGHT.md |
| 002 | The House Has Gone Bust | T2 | patron-favor (O'Dimm/Landsmeet) | faction-graph WAR; REDS/Network; creeping-normality | BOHEMIA_QUEST_002_BLOOD_FEUD.md |
| 003 | What the Ashes Remember | T2 | loyalty reckoning (ME2) | trust meter; REMNANTS; succession — WHO she becomes carries to heir | BOHEMIA_QUEST_003_WHAT_COOKCOOK_LEFT.md |
| 004 | Ghost in the Grid | T2 | Amalgamation-thread (Obra-Dinn/Outer-Wilds) | mindmap clue-cluster; NETWORK; the Reconstruction spine, knowledge survives fold | BOHEMIA_QUEST_004_GHOST_IN_THE_GRID.md |
| 005 | The Cap Collector | T3 | street-ambush release-valve (Yakuza whiplash) | comedy->grief duck cue; HOMELESS; micro Amalgamation seed | BOHEMIA_QUEST_005_WIND_BRAHMIN.md |
| 006 | The Quartermaster's Cut | T2 | economy-as-morality (Papers-Please/water-chip) | district medicine sim; TRADES/VOLUNTEERS; rules-correct=filthy; fold health | BOHEMIA_QUEST_006_THE_QUARTERMASTERS_CUT.md |
| 007 | The Pit Boss Is Gone | T1 | vacancy/succession pillar (Landsmeet/Killian) | support-tally council; MOB/REDS/HOMELESS/Network; installs a district regime, fold inherits it | BOHEMIA_QUEST_007_THE_PIT_BOSS_IS_GONE.md |
| 008 | Two Coins for the Ferryman | T2 | slow-burn faith, NO-combat (Sinnerman/Howard) | dying believer's choice; CHURCH/VOLUNTEERS; game refuses to score it; relic/shrine/legend to fold | BOHEMIA_QUEST_008_TWO_COINS_FOR_THE_FERRYMAN.md |
| 009 | The Last Dealer Folds | T1 | patron-sacrifice pillar (Virmire/Mordin/O'Dimm) | Amalgamation trades endgame key for a companion's willing betrayal; Become path's price; break-route = clean win | BOHEMIA_QUEST_009_THE_FOLLOWER_ON_THE_ALTAR.md |
| 010 | What Crawls the Concrete | T2 | contract (Witcher: monster-is-a-person) | bounty on a NeuroLinked wronged human; TRADES/HOMELESS/Network; hunt vs mercy; negotiable fee; universal damage-reveal | BOHEMIA_QUEST_010_THE_THING_IN_THE_WASH.md |
| 011 | The Man Who Holds Still | T3 | release-valve, warm (Yakuza performer) | living-statue favor; COLORFUL; performance minigame surfaces MUS catalog; reward is a friend | BOHEMIA_QUEST_011_THE_STATUE.md |
| 012 | What the Mirrors Kept | T2 | Amalgamation no-closure conspiracy (Peralez/Dream-On) | mind-editing of a beloved council; NETWORK; escalates threat to editing the LIVING; no clean fix | BOHEMIA_QUEST_012_THE_PUPPET_COUPLE.md |
| 013 | Long Walk Home | T3 | witness/recovery grief (Howard/Esteban) | carry a widow's dead husband home; HOMELESS grave-keeper; slow non-combat walk; tended grave to fold | BOHEMIA_QUEST_013_LONG_WALK_HOME.md |
| 014 | Three Nails | T2 | exploit-the-lever hunt (Three-Card Bounty/sim) | 3 raider captains, each a lever not a wall; CARTEL; clever vs bloody reshapes enemy's future | BOHEMIA_QUEST_014_THREE_NAILS.md |
| 015 | Hymn for Running Water | T1 | infrastructure conspiracy pillar (water/Frostpunk/Papers-Please) | missing-person -> water-theft; TRADES/NETWORK; install a WATER DOCTRINE; reveals Amalgamation must be COOLED | BOHEMIA_QUEST_015_HYMN_FOR_RUNNING_WATER.md |
| 016 | The Courier's Favor | T2 | moving errand chain + moral fork (Aba-Daba/KCD) | multi-stop run across real Vegas; CARAVANS/CARTEL; crucified-runner fork; ties medicine economy (Q006) | BOHEMIA_QUEST_016_THE_COURIERS_FAVOR.md |
| 017 | Somewhere a Fountain Still Runs | T3 | tender child-grief (Time-Traveler's Kid/Howard) | a kid "fixing time" after her father left; VOLUNTEERS; fix the present+heart not the past; child-safety-careful | BOHEMIA_QUEST_017_SOMEWHERE_A_FOUNTAIN.md |
| 018 | Choir for the Machine | T2>T1 | cult infiltration (Come-Fly-With-Me/Cyberpunk) | congregation worships the servers they live on; CHURCH/HOMELESS/NETWORK; CONFIRMS Amalgamation location (endgame map-pin) | BOHEMIA_QUEST_018_CHOIR_FOR_THE_MACHINE.md |
| 019 | March of the Unpaid | T3 rpt | creeping-normality dark grind (Legion Ears/Frostpunk) | REPEATABLE kill-bounty; REMNANTS; pay scales with atrocity, NPC+music desensitize; darkness tally to fold | BOHEMIA_QUEST_019_MARCH_OF_THE_UNPAID.md |
| 020 | Lights, Camera, Apocalypse | T3 | release-valve absurd (Zombie Video/Yakuza) | bodyguard a music-video shoot as real scavengers hit; COLORFUL; diegetic catalog track, canonizes a song across Vegas | BOHEMIA_QUEST_020_THE_ZOMBIE_VIDEO.md |
| 021 | More Chrome Than Heart | T2 | augmentation-cost tragedy (Lizzy-Wizzy) | performer numbs grief with augments till she can't feel; COLORFUL; dual diegetic tracks; autonomy vs numbness | BOHEMIA_QUEST_021_MORE_CHROME_THAN_HEART.md |
| 022 | The Face Thief | T2 | deduction / mistaken-identity (Obra-Dinn) | a faceless Network victim robs wearing stolen faces; MOB lynch race; save the scapegoat; face-data leaking | BOHEMIA_QUEST_022_THE_FACE_THIEF.md |
| 023 | What the Collector Keeps | T2 | relic-gather / believer's museum (Mordin) | assemble a founder's console for a sincere collector; NETWORK; complete/destroy/turn/take; console = endgame key | BOHEMIA_QUEST_023_THE_MUSEUM_OF_THE_MACHINE.md |
| 024 | What Sleeps Beneath the Psalm | T2 | Amalgamation horror (Nightmare Temple/Vaermina) | district can't sleep; dream-descent to a leaking node; CHURCH/HOMELESS/NETWORK; proximity-heat made a mechanic | BOHEMIA_QUEST_024_THE_NIGHTMARE_TEMPLE.md |
| 025 | No Clean Side | T2 | both-sides fork (Hunt/TLOU2/Hircine) | hunters vs a NeuroLinked "beast," both sympathetic; REMNANTS/HOMELESS; enact a side, mourn the other; third path saves all | BOHEMIA_QUEST_025_THE_HUNT_BOTH_SIDES.md |
| 026 | The Splintered Fleet | T2 | AI-fragment empathy chain (Delamain) | recover a splintered AI's virtues by reasoning not fighting; TRADES; Amalgamation-in-miniature; endgame "re-weave" hope | BOHEMIA_QUEST_026_THE_SPLINTERED_FLEET.md |
| 027 | Two Masters, One Knife | T2 | double-agent / traveling-rep (Killian/Alpha Protocol) | two opposed powers hire the same job; TRADES/MOB/Network; serve/double/expose/burn; reputation TRAVELS | BOHEMIA_QUEST_027_TWO_MASTERS.md |
| 028 | The Degrees of Nothing | T3 | environmental-story / place-as-quest (Elden-Ring lore) | read a ruined for-profit college; the crash was DEBT not bombs; homeless = the debtors; memorial/strip/mediate | BOHEMIA_QUEST_028_THE_COLLEGE_THAT_ATE_THEM.md |
| 029 | What Grows in the Vault | T3 | greed-trap / hidden-horror (Dead Money) | fortune-for-volunteering hides a Network mind-farm; NETWORK; take/rob/expose/warn; reveals how the Amalgamation GROWS | BOHEMIA_QUEST_029_THE_CLINICAL_TRIAL.md |
| 030 | Play-Money Shakedown | T3 rpt | roving-threat risk/reward boss (Mr-Shakedown) | roving mugger makes carrying wealth risky; MOB-lite; fight/pay/flee/barter -> kill/spare/recruit; rival-to-ally | BOHEMIA_QUEST_030_THE_CAP_IN_THE_MACHINE.md |
| 031 | The Databank She Won't Hand Over | T2 | heist / loyalty-vs-law (Sandra Dorsett/Thief) | steal back a dead man's voice from a fixer's vault; TRADES/REMNANTS; steal/buy/negotiate/lawful; deep-sim verb | BOHEMIA_QUEST_031_THE_DATABANK.md |
| 032 | The Liar's Bloodline | T2 | truth-vs-good patron-favor (Malacath/Pentiment) | a patron weaponizes a founder's fraud to demand an innocent's death; BLUES; kill/expose/protect/turn; TRUTH on the ledger | BOHEMIA_QUEST_032_THE_LIARS_BLOODLINE.md |
| 033 | The One Who Watches the Stage | T3 | protection / stalker-is-a-wound (Yakuza tender) | a performer's "stalker" is a grieving fan clinging to a song; COLORFUL; see-the-person; music-as-lifeline; help/reconcile/remove/misread | BOHEMIA_QUEST_033_THE_STALKER.md |
| 034 | The Arithmetic of Obedience | T3 | obedience-test / character (Sheogorath/O'Dimm) | Network loyalty test as an absurd errand; NETWORK; obey/refuse/flip/over-perform; sets NETWORK-DISPOSITION for the endgame | BOHEMIA_QUEST_034_THE_PATRONS_FORK.md |
| 035 | What the Lake Gave Back | T3 | exploration / delayed-investment (Sunken Shrine) | breath-held dive to a drowned shrine; Lake Mead rising as GIFT; sell/rebuild/return; rebuild = compounding fold asset | BOHEMIA_QUEST_035_THE_SUNKEN_SHRINE.md |
| 036 | The Last Shift at the Plant | T2 | infrastructure-siege / crisis-triage (Frostpunk) | hold a failing power+water plant overnight; TRADES/VOLUNTEERS; which blocks go dark; optional strike on servers' cooling | BOHEMIA_QUEST_036_THE_LAST_SHIFT.md |
| 037 | The Word on the Wall | T3 | propaganda / information-war (Papers-Please/Pentiment) | scapegoating posters fracture a district; NETWORK-seeded; truth/counter/root/exploit; fracture=weapon, cohesion=defense | BOHEMIA_QUEST_037_THE_WORD_ON_THE_WALL.md |
| 038 | The Debt That Outlived Him | T2 | THEMATIC KEYSTONE: inherited-obligation (consequence-across-time) | a dead man's debt lands on his innocent heir; TRADES/CHURCH; enforce/forgive/transform/expose; PRECEDENT judges the dynasty's own sins | BOHEMIA_QUEST_038_THE_DEBT_THAT_OUTLIVED_HIM.md |
| 039 | A Seat at the Table | T1 | faction-summit / web-payoff pillar (Landsmeet writ large) | chair a summit to stop a water war; ALL factions; cashes in the whole reputation web; sets DISTRICT-ORDER for the endgame | BOHEMIA_QUEST_039_A_SEAT_AT_THE_TABLE.md |
| 040 | The Box That Wasn't Opened | T1 | SIGNATURE MECHANIC: succession / Family Box pillar | the dynast dies; choose the heir + what passes in the Box (credential, truth, Reconstruction); the generational hinge | BOHEMIA_QUEST_040_THE_BOX_THAT_WASNT_OPENED.md |
| 041 | The Inheritance of Ash | T1 | succession RECEIVING-end pillar (mirror-hinge to 040) | the heir opens the Box, reckons with inherited sins/graces/credential; ALL; honor/break/conceal; new-dynasty trajectory | BOHEMIA_QUEST_041_THE_INHERITANCE_OF_ASH.md |
| 042 | The Unmarked Grave | T3 | fold-resurfacing cold-case (Obra-Dinn / the past returns) | a grave surfaces a PRIOR dynasty's buried act; reads prior UNRECORDED flags; expose/bury/amend/clear | BOHEMIA_QUEST_042_THE_UNMARKED_GRAVE.md |
| 043 | The Quiet Line | T2 | rescue-network / logistics-of-mercy (underground railroad) | smuggle endangered people out of Network reach; VOLUNTEERS/HOMELESS; Q016 inverted; run/expand/small/betray; anti-harvest asset | BOHEMIA_QUEST_043_THE_UNDERGROUND_RAILROAD.md |
| 044 | The Room That Wasn't Built | T3 | builder's-dilemma / opportunity-cost (Frostpunk resource-law) | one plot, four true needs (clinic/granary/shelter/wall); every build un-builds three; the city-builder's core tension | BOHEMIA_QUEST_044_THE_UNBUILT_ROOM.md |
| 045 | The Record Keeper | T2 | recorded-vs-unrecorded / who-writes-history (Pentiment) | dying archivist offers the pen; legend/honest/buried/seize; the twin-ledger duality; honest closes the legend-truth gap | BOHEMIA_QUEST_045_THE_RECORD_KEEPER.md |
| 046 | The Honest Thief | T3 | folk-Robin-Hood / redistribution-morality (sympathetic-outlaw) | a thief robs collapse-hoarders to feed collapse-victims; property-vs-need; catch/protect/expand/co-opt; jubilee link | BOHEMIA_QUEST_046_THE_HONEST_THIEF.md |
| 047 | The Language of Birds | T3 | neurodivergent-witness / attention-over-force (Undertale tender) | a pattern/birdsong communicator holds the key; learn their language, rushing fails; honor as gift not deficit | BOHEMIA_QUEST_047_THE_LANGUAGE_OF_BIRDS.md |
| 048 | The False Dawn | T2 | false-messiah / hope-as-a-weapon (Spec Ops complicity) | a magnetic figure promises an impossible dawn; NETWORK-channeled; expose/guide/replace/let-run; truth without care is cruelty | BOHEMIA_QUEST_048_THE_FALSE_DAWN.md |
| 049 | The Weight of Keys | T2 | jailer's-dilemma / justice-vs-mercy (Papers-Please) | judge 5 prisoners with no court; the verdict pattern sets the district JUSTICE PHILOSOPHY; ties Q046/Q037/Reconstruction | BOHEMIA_QUEST_049_THE_WEIGHT_OF_KEYS.md |
| 050 | The Door in the Deep | T1 | ENDGAME-THRESHOLD / convergence pillar (ME suicide-mission prep) | reach the Amalgamation's door with the whole Reconstruction; it speaks its full nature; LIBERATE/RESPECT/BECOME converge; sets the ENDGAME-PATH | BOHEMIA_QUEST_050_THE_DOOR_IN_THE_DEEP.md |
| 051 | The Opening of Every Cell | T1 | ENDGAME FINALE 1/3: the LIBERATE climax (terrible mercy) | free the uploaded millions, let your own dead go; zero combat, won by releasing; WORLD-STATE=FREED; the bittersweet ending | BOHEMIA_QUEST_051_THE_OPENING_OF_EVERY_CELL.md |
| 052 | The Cooling Peace | T1 | ENDGAME FINALE 2/3: the RESPECT climax (hardest peace) | negotiate coexistence with the mind-of-many; cool it to a neighbor; gated by Q026+Q039; WORLD-STATE=COEXISTENCE; the wise, fragile ending | BOHEMIA_QUEST_052_THE_COOLING_PEACE.md |
| 053 | The Kindest God | T1 | ENDGAME FINALE 3/3: the BECOME climax (sympathetic damnation) | seize the grave, ascend swearing kindness, become it by a staircase of mercies; kind-god/hard-god/refuse; WORLD-STATE=ASCENDED | BOHEMIA_QUEST_053_THE_KINDEST_GOD.md |

## SHAPE COVERAGE (keep the bible varied — track which engines are represented)
- [x] witness / tender tail (001)
- [x] patron-favor / branching moral (002)
- [x] loyalty reckoning (succession prep) (003)
- [x] contract (the "monster" is a person) (010)
- [x] Amalgamation-thread investigation (deduction/mindmap) (004)
- [x] vacancy / succession power-struggle (007)
- [x] Yakuza street-ambush (absurd + tender) (005)
- [x] AI/machine-humanity (Cyberpunk-flavored) (004 Delphi + 010 implant)
- [x] scarcity/triage (Papers-Please/Pathologic economic) (006)
- [x] pillar (T1 generational, ledger-wired) (007)

## STANDING
On "keep cooking"/any advance, Claude builds the next quest, rotates shapes for
variety, updates this index + shape coverage same turn, presents the new file.

## ENGINES PROVEN (all core shapes now have a reference build)
All 6 T2/T3 engines + 1 pillar + 1 no-combat faith quest = 8 distinct engines, 8 for 8.
From here: variations + volume toward ~90, each standing on tested machinery.

## MILESTONE: 20 QUESTS
20 fully-produced quests, all 8 core engines + variations. Breakdown: 3 pillars
(007 succession, 009 sacrifice, 015 water), plus companion/mystery/tender/release-
valve/economy/contract/lever/errand/cult/repeatable shapes. Reconstruction now has a
CONFIRMED target (018) + a known weakness (015 cooling). Music canonized in-world (020).
Pace: ~1 quest/turn, ~70 to go to the ~90 target.

## MILESTONE: 30 QUESTS (a third of the way)
30 fully-produced quests. Engines proven: 3 pillars, 2 repeatables, both-sides fork,
deduction, deduction-lynch, contract, lever-hunt, errand-chain, cult, environmental-
story, greed-trap, AI-fragment, double-agent/traveling-rep, augmentation-tragedy, 3
release-valves, 3 tender-tails, economy-triage, water/succession/sacrifice pillars.
Unified thesis locked: the crash was DEBT -> made the homeless -> the Network farms the
desperate -> feeds the Amalgamation that sleeps beneath them. Music canonized in-world.
Reconstruction: confirmed LOCATION (018), WEAKNESS (015 cooling), GROWTH-method (029),
NEGOTIATION-hope (026), a possible INTERFACE (023). ~60 to go.

## MILESTONE: 40 QUESTS (almost halfway)
40 fully-produced quests. FIVE PILLARS now anchor the bible: 007 succession-vacancy,
009 dark-sacrifice, 015 water-doctrine, 039 faction-summit (web-payoff), 040 the Family
Box (the signature Succession mechanic). The last two are the STRUCTURAL SPINE: 039
cashes in the whole reputation web into a DISTRICT-ORDER state; 040 is the generational
hinge that turns one dynasty into the next, carrying the credential + Reconstruction
knowledge + the unrecorded ledger forward. Thematic keystone (038) states the through-
line: consequence across time. Anti-Network thesis locked: fracture is the weapon,
cohesion is the defense (002/027/032/037/039). ~50 to go.

## MILESTONE: 45 QUESTS — HALFWAY TO ~90
Half the bible is produced. FIVE pillars (007/009/015/039/040) + the succession loop closed
end-to-end (040 pass -> 041 wake -> 042 resurface). Twin-ledger duality made explicit (045).
The generational machine is fully proven: death, passing, waking, reckoning, excavation. Every
core system (combat, economy, city-builder, logistics, faction-web, succession, the mystery)
has multiple reference quests. Anti-Network thesis (fracture vs cohesion) + the unified crash
thesis (debt -> homeless -> harvest -> Amalgamation) run through everything. ~45 to go: more
side/tail volume, faction-route multiplication, and the endgame approach quests.

## MILESTONE: 50 QUESTS — ENDGAME THRESHOLD REACHED
Halfway-plus, and the mystery has arrived at its door. SIX pillars now: 007 succession-vacancy,
009 dark-sacrifice, 015 water-doctrine, 039 faction-summit, 040 the Family Box, and 050 the
endgame threshold. The full RECONSTRUCTION is now cashable: location (018), weakness/cooling
(015/036), growth/harvest (029/043), interface/console (023), negotiation-hope (026), credential
(009), fugue-tech (024), face-data (022), edits-the-living (012). At Q050 the THREE PLAYSTYLES
(Liberate/Respect/Become) converge as the threshold choice, each GATED by what the player assembled
— the web-payoff at endgame scale. The enemy is beaten by KNOWING, not shooting. NEXT: the three
climax finales (Liberate/Respect/Become payoffs), plus ~40 more side/tail/faction-route quests.

## MILESTONE: 53 QUESTS — ALL THREE ENDINGS BUILT
The endgame is complete end-to-end. Q050 threshold -> the three finales: 051 LIBERATE (terrible
mercy, WORLD-STATE=FREED, bittersweet), 052 RESPECT (hardest peace, WORLD-STATE=COEXISTENCE,
wise/fragile, gated by Q026+Q039 cohesion), 053 BECOME (sympathetic damnation, WORLD-STATE=
ASCENDED, kind-god/hard-god/refuse). Each ending is EARNED by what the player assembled +
how they played; each refuses easy triumph. The three playstyles (Liberate/Respect/Become)
now have full mechanical + narrative payoff. Seven pillars total (007/009/015/039/040/050 +
the finale-trilogy). The hundred-year story can end three ways. NEXT: ~37 more side/tail/
faction-route quests to reach the ~90 target (the spine + endgame are DONE; remaining work is
breadth and replay density).
