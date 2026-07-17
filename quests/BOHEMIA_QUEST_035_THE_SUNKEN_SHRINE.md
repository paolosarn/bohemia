# BOHEMIA — QUEST 035: "WHAT THE LAKE GAVE BACK"
Full production build. Built to the dialogue/scene spec; template = 001-034. Tier-3
EXPLORATION / delayed-investment (Vault #39 Sunken Shrine + tradition on Lake Mead rising
canon + the delayed-payoff investment shape). Name catalog-adjacent. A pure exploration +
economy quest — recover a drowned relic, fund a rebuild, and a reward matures over time.
Teaches patience and the risen-lake canon; the calm between heavier quests.

Design soul: the rising lake is both grave and gift. As Lake Mead rose after the crash it
drowned old Vegas — and now, as levels shift, it's giving pieces back. A survivor points the
dynasty to a drowned shrine holding something valuable; recovering it and investing in a
rebuild pays off weeks later. Quiet, hopeful, and it makes the WATER (the game's lifeblood
and the Amalgamation's coolant) feel like a character.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_lake_gave_back
- tier: 3 (unmarked-leaning; a diver/survivor's tip)
- fold: the rebuilt shrine/site becomes a small district asset (a fishery, a pilgrimage
  site, or a clean-water source) that matures across the fold — a patient investment an
  heir inherits grown.
- entry_conditions: an old diver (OSK) tells the dynasty of a drowned shrine now reachable
  as the lake shifts, holding a relic and the bones of a pre-crash community.
- faction_wires: CARAVANS/TRADES (the investment/trade value), CHURCH (the shrine's meaning),
  VOLUNTEERS (rebuild labor), HOMELESS (the drowned were once a community).
- music_pool: a calm, aquatic WONDER motif (hopeful, spacious); muffled underwater passages;
  a warm resolve at the rebuild.
- ledger_writes: recorded[shrine_outcome_*]; UNRECORDED[what_you_did_with_the_gift];
  a maturing-investment flag (pays off later).
- amalgamation_thread: NONE-to-LIGHT — the water canon connects to the Amalgamation's coolant
  (Q015) thematically, but this quest is HOPE, not dread (deliberate contrast).

===============================================================================
## 2. CAST
===============================================================================
- OSK (id: osk) — an old salvage-diver who knew the drowned town before the lake took it;
  points the dynasty to the shrine; too old to dive it himself now. default_emotion:
  nostalgic_hopeful. faction: TRADES/CARAVANS.
- THE DROWNED COMMUNITY — environmental (the shrine, framed photos, a bell, offerings) —
  a place that testifies to who lived there (Q028 environmental tech, but tender not damning).
- RIVAL SALVAGERS (id: rivals) — optional competitors who want the relic for scrap-value;
  a light obstacle. default_emotion: opportunistic. faction: freelance.
- THE PLAYER — dive/breath-hold traversal (Q023 tech), [TRADES] (appraise/invest), standing.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
EXPLORATION-FIRST (the dive to the shrine — a breath-held traversal set-piece) -> recover the
relic (+ optional rival encounter) -> an INVESTMENT FORK: SELL the relic (immediate caps),
REBUILD the shrine as a district asset (delayed, larger payoff), or RETURN it to the drowned
community's descendants (honor over profit, a bond + a smaller civic reward). Patient, calm.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: osk  emotion: nostalgic_hopeful  gesture: point_at_the_water  camera: two_shot
  music:{pool:WONDER,cue:soft_enter}
  line: "Lake's been giving things back lately — dropped a foot this season and there's rooftops
         breaking the surface that haven't seen sky in twenty years. My old town's down there.
         There's a shrine — good stone, a bronze bell, and folk said the founders sealed something
         precious in it before the water came. I'm too old to go down. But you're not. Bring up
         what the lake's ready to give."
  choices (PLR):
   - "I'll dive it."                     -> dive_gate
   - "What was the town?"                 -> spoke_town
   - "What's 'something precious'?"       -> spoke_relic
node spoke_town
  speaker: osk  emotion: wistful  camera: closeup  micro_expression: distant_smile
  line: "Just a little lake town — fishers, a chapel, a school. When the economy broke, folk left
         or stayed, and then Mead rose and made the choice for the ones who stayed. Good people.
         Nobody marks them now. Maybe you could. Maybe that's the precious thing — not the relic.
         Being remembered."
  effect: knowledge[the_drowned_deserve_remembering]  -> goto dive_gate
node spoke_relic
  speaker: osk  emotion: hopeful  camera: closeup
  line: "Story goes it's a founder's cache — coin, tools, maybe a seed-vault. Worth a fortune to
         a trader, or worth a REBUILD to a district with patience. Depends what kind of dynasty
         you are — the kind that cashes out, or the kind that plants." -> goto dive_gate

--- THE DIVE (breath-held exploration set-piece) ---
node dive_gate
  speaker: PLR (internal)  camera: underwater  music:{pool:WONDER,cue:muffled_descent}
  line: "(Down through green light into the drowned town — a street of rooftops, a school bell
         still hung, curtains drifting in glassless windows. The shrine at the center, its bronze
         bell green with the years. Inside: the founder's cache, sealed and dry in a bell-jar of
         trapped air. And around it, offerings the drowned left — a child's shoe, a wedding ring,
         a photograph sealed in wax. They knew the water was coming. They said goodbye HERE.)"
  effect: knowledge[the_shrine_is_a_goodbye]; recover the CACHE  -> goto rival_check
node rival_check
  speaker: rivals  emotion: opportunistic  gesture: block_the_surface  camera: two_shot  music:{pool:TENSION,cue:swap}
  line: "(surfacing) That cache is worth a fortune and you found it on OPEN water. Hand it up and
         we'll call it shared salvage. Or don't, and we'll call it something else."
  effect: OPTIONAL fork — [BARTER] split, [INTIMIDATE]/standing warn off, flee/dodge, or Dead Eye.
    (skippable if no rivals spawn; a light obstacle)  -> goto invest_gate

--- THE INVESTMENT FORK ---
node invest_gate (speaker: PLR)  camera: two_shot  music:{pool:WONDER,cue:hold}
  choices:
   - "(Sell the cache — immediate caps.)"                    -> route_sell
   - "(Invest it — rebuild the shrine as a district asset.)" -> route_rebuild
   - "(Return it to the drowned's descendants.)"             -> route_return
node route_sell
  speaker: osk  emotion: understanding  camera: closeup
  line: "Caps in hand. Can't fault a dynasty for eating. The town stays drowned and forgotten,
         but you're richer, and rich keeps people alive too. ...Just don't ring that bell on your
         way out. Feels wrong to wake it for nothing."
  effect: immediate large currency reward; the shrine/town stays lost; recorded[sold_the_cache];
    UNRECORDED[cashed_out_the_gift]=true. The pragmatic, forgettable windfall. -> END
node route_rebuild
  speaker: osk  emotion: moved_delighted  camera: two_shot  music:{pool:WONDER,cue:warm_build}
  line: "You're PLANTING it. The seed-vault, the tools — a fishery on the new shore, a shrine folk
         can pilgrimage to, the drowned remembered above the water that took them. It won't pay
         today. But give it a season... give it a GENERATION... and this'll feed a district. That's
         the long game. That's how you build a Vegas that lasts."
  effect: the cache is INVESTED; a maturing district asset (fishery/pilgrimage/clean-water source)
    that grows over time — pays off LATER and compounds into the fold; recorded[rebuilt_the_shrine];
    UNRECORDED[planted_the_gift]=true; standing[CHURCH/CARAVANS/VOLUNTEERS]+. The patient, best-
    long-game outcome (delayed gratification made mechanical — Dead Money "begin again" inverted:
    build again). -> END
node route_return
  speaker: osk  emotion: quiet_pride  camera: closeup  micro_expression: eyes_shine
  line: "...You're giving it BACK. To the fisher-kin who scattered when the town drowned. They'll
         weep. They'll build their own little shrine on the shore and put your dynasty's name in the
         prayers. Not the richest choice. Might be the RIGHTEST one. The drowned'll rest easier
         knowing their own carried them up."
  effect: the cache returns to the descendants (a bond + a smaller civic reward + deep goodwill);
    recorded[returned_the_cache]; UNRECORDED[gave_it_to_the_kin]=true; a durable ally-community;
    the honor-over-profit outcome. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- SELL: a windfall now; the drowned town stays forgotten; an heir inherits caps spent long ago
  and no trace of the place.
- REBUILD: a maturing asset (fishery/pilgrimage/water source) that COMPOUNDS across the fold — an
  heir inherits a thriving site the prior generation planted (the patient-investment payoff; models
  the city-builder's long game).
- RETURN: a grateful descendant-community (a durable ally + civic goodwill); an heir inherits a
  shore-shrine that keeps the dynasty's name in prayers.
- UNRECORDED[what_you_did_with_the_gift] colors whether the dynasty is remembered as one that
  cashed out, planted, or gave back — a values signature on the water canon.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Osk's nostalgic hope carries it (distant_smile, eyes_shine); the QUEST'S "face" is the
  DROWNED PLACE — the offerings, the sealed photograph, the child's shoe (environmental portraiture,
  tender variant of Q028). Rivals for a light beat of tension. Procedural lip-sync.
BODY: the DIVE is the signature traversal (breath-held descent, Q023 tech — slow, wondrous, no
  combat); the shrine is a readable underwater place-node; the rebuild shows a staged construction
  (scheduler, world-state change). Combat only at the optional rival beat.
CAMERA: two_shots with Osk, an UNDERWATER mode for the dive (green light, drifting curtains — awe,
  not dread), closeup on the offerings, a warm wide on the rebuilt shrine. Cuts on beat.
MUSIC: a calm aquatic WONDER motif (hopeful, spacious — the counterpoint to the cyan-hum dread);
  muffled underwater passages; a warm build-cue at the rebuild. Deliberately NO dread — the water
  as gift, not grave. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + the long game)
===============================================================================
- Fully pacifist (an exploration/economy quest); the only combat is the OPTIONAL rival beat
  (avoidable via barter/intimidate/flee).
- Rewards diverge (Megaton law): SELL = immediate caps + a forgotten town; REBUILD = a delayed,
  COMPOUNDING asset (the best long-game, models the city-builder ethos); RETURN = goodwill + a
  durable ally + a smaller reward. The most patient choice pays the most, later — teaching the
  delayed-gratification core of a generational city-builder.
- Theme: the rising lake as gift, not just grave (hopeful contrast to the water-dread of Q015);
  and the drowned deserve remembering (the tender witness-thread, underwater).

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Uses the breath-held DIVE traversal (Q023) + readable underwater place-
nodes + a MATURING-INVESTMENT flag (a reward that grows over in-game time and compounds into the
fold — reusable economy mechanic). Reads ledger/standing/skill/fold; writes same + a maturing-asset
flag or a windfall or an ally-community. Deterministic + save-through. Gate: dive traversal completes,
optional rival beat resolves (all sub-routes), all three investment forks resolve, the maturing-asset
flag grows over time + persists to the fold, no dread-hum (tonal check). Joins the suite.

## 9. WHAT THIS PROVES (vs 001-034)
New engine: EXPLORATION / delayed-investment — a breath-held dive to a drowned shrine (Lake Mead
rising canon as GIFT not grave), resolved by sell/rebuild/return, where the most patient choice
(rebuild) yields a COMPOUNDING district asset that matures across the fold — modeling the generational
city-builder's long game (delayed gratification made mechanical). A hopeful, tender counterpoint to the
water-dread of Q015. Introduces the maturing-investment flag. Bible at 35; the water is now a character
that gives as well as takes, and patience is a mechanic.
