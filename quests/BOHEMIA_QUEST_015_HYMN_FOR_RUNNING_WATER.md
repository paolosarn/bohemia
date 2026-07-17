# BOHEMIA — QUEST 015: "HYMN FOR RUNNING WATER"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-014. Tier-1 PILLAR, INFRASTRUCTURE CONSPIRACY (Vault #9 Corporal White/Water
Theft + tradition XXXI Papers-Please + XXXII Frostpunk law + the "infrastructure IS
the curriculum" thesis). Name from Paolo's catalog. Third pillar — the one where the
REAL Las Vegas water system is the whole moral engine.

Design soul: a missing person opens into a water-theft conspiracy across the actual
Vegas pipeline, and the resolution is a LAW the district lives under. This is the
educational spine made a pillar: who controls water controls life, and every fix is a
trade-off measured in real litres and real lives. No preaching — the plumbing teaches.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_hymn_running_water
- tier: 1 (PILLAR; district-defining; ledger + economy + governance wired)
- fold: the water DOCTRINE the player installs (open tap / metered / rationed-by-need /
  privatized) governs the district's survival and mood for the rest of the game and
  into the fold — an heir inherits the water law and its consequences.
- entry_conditions: a pump-worker (CORPORAL-analog DASA) goes missing; her sister asks
  the dynasty to find her; the trail leads into the pipeline.
- faction_wires: TRADES (run the pipes), REMNANTS (guard them), CARAVANS (haul water),
  REDS/NETWORK (want to privatize the source), HOMELESS + poor blocks (cut off first),
  CHURCH (water-as-sacrament framing).
- music_pool: TENSION; a flowing/dripping water motif; the cyan-hum near the Network's
  hand in it; a solemn resolve at the doctrine-setting.
- ledger_writes: recorded[water_doctrine_*]; UNRECORDED[who_you_let_go_dry]=true;
  economy: district WATER-supply + distribution model persist.
- amalgamation_thread: MEDIUM — the privatization push is Network-driven (the servers
  need the water-reclamation plant — ties the Amalgamation's physical body/canon: the
  tunnel from data-fortress to the water plant). A [READ] exposes WHY they want the water.

===============================================================================
## 2. CAST
===============================================================================
- DASA (id: dasa) — a pump-station worker who discovered the theft and went missing for
  it (found alive-captive or dead, per investigation). The catalyst. faction: TRADES.
- NILA (id: nila) — Dasa's sister, who hires the dynasty. default_emotion: frightened_
  determined. faction: TRADES.
- FOREMAN OKONMA (id: okonma) — runs the main pump station; knows the theft is happening
  and has been looking the other way to keep HIS blocks supplied (Papers-Please: complicit
  to survive). default_emotion: guilty_pragmatic. faction: TRADES.
- BROKER VANCE (id: vance) — RECURRING Network broker; behind the privatization push
  (wants the source sold so the Network controls the reclamation plant). eyelid-flicker
  tell. default_emotion: pleasant_cool.
- ELDER RUE (id: rue) — CHURCH figure who frames water as sacrament; a moral voice for
  open distribution. default_emotion: fervent_gentle.
- THE PLAYER — [READ], [BARTER], [MEDICINE] (triage need), [TRADES] (read the system),
  standing across factions.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
HUB-AND-SPOKE investigation (find Dasa + trace the theft across the pipeline in any
order) -> a LANDSMEET-style DOCTRINE COUNCIL where banked standing + evidence set the
district's WATER LAW -> BRANCH install of one of four doctrines + optional Network
confrontation. This is Q007's succession-council shape applied to a RESOURCE LAW.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- NILA'S PLEA ---
node open_01
  speaker: nila  emotion: frightened_determined  gesture: grip_your_sleeve  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "My sister Dasa ran pump station four. Ten days ago she told me the numbers
         were wrong — water going missing before it ever reached the poor blocks. Nine
         days ago she didn't come home. Nobody will look. The Remnants say it's a
         'labor matter.' Please. Find her. And find where the water's GOING."
  -> goto invest_hub

node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Trace the pipeline flow numbers.)"       -> clue_flow    [once]
   - "(Search pump station four for Dasa.)"      -> clue_dasa    [once]
   - "(Lean on Foreman Okonma.)"                 -> okonma_01    [once]
   - "(Hear the Church's stake — Elder Rue.)"    -> rue_01       [once]
   - "(Follow the diverted water.)"              -> clue_divert  [once]
   - "(Call the water doctrine council.)"        -> council_gate [show after finding Dasa + 2 clues]

node clue_flow
  speaker: PLR (internal)  camera: closeup_on_gauges  music:{pool:TENSION,cue:water_drip}
  line: "(Real numbers: Lake Mead intake up — the lake's risen since the crash. But
         downstream, the poor blocks get a third of their share. The missing water isn't
         lost. It's REROUTED — to a private cistern network feeding one buyer. Somebody
         turned a public flow into a private tap.)"
  effect: knowledge[water_is_rerouted_to_a_buyer]  -> goto invest_hub
node clue_dasa
  speaker: dasa (if alive)  emotion: parched_defiant  camera: closeup  micro_expression: cracked_lips
  line: "You came. They've got me off the books — grabbed me for asking who authorized
         the reroute. It was signed with a REDS seal but it doesn't smell like REDS
         money. Somebody bigger wants this water. Get the numbers to the council. Don't
         let them bury it with me."
  effect: rescue Dasa (or find her body -> knowledge[dasa_killed_for_it], darker);
    knowledge[reroute_authorized_from_above]  -> goto invest_hub
node okonma_01
  speaker: okonma  emotion: guilty_pragmatic  gesture: wont_meet_your_eyes  camera: two_shot
  line: "You think I don't KNOW? I've got four thousand people on my lines. I looked
         away from the reroute because the deal kept MY blocks wet. You want me to be a
         hero? Heroes here die thirsty. I kept my people alive. That's the only law I've
         got left."
  effect: knowledge[okonma_complicit_to_survive] (Papers-Please: the decent man who
    chose his own)  -> goto invest_hub
node rue_01
  speaker: rue  emotion: fervent_gentle  gesture: open_hands  camera: closeup
  line: "Water is the one thing the desert cannot fake. Before the crash they SOLD it
         in bottles while the river died. If this district learns nothing else, let it
         learn that a thirsty neighbor is your responsibility, not your market. Set the
         tap OPEN."
  effect: knowledge[church_backs_open_water]  -> goto invest_hub
node clue_divert
  speaker: PLR (internal)  camera: wide_cistern  music:{pool:TENSION,cue:cyan_hum_in}
  line: "(The diverted water pools in a new cistern field — and the pipes don't feed
         homes. They feed the RECLAMATION PLANT. The one wired to the tunnels under the
         Strip. Somebody isn't stealing water to sell it. They're stealing it to COOL
         something. Something big and always-on, underground.)"
  effect: knowledge[water_feeds_the_reclamation_plant] (CANON: the Amalgamation's body
    runs data-fortress -> water plant; the servers need cooling); mindmap Reconstruction
    clue[the_machine_drinks]  -> goto invest_hub

--- THE NETWORK'S HAND (optional [READ]) ---
node vance_confront  (reachable if knowledge.water_feeds_the_reclamation_plant)
  speaker: vance  emotion: pleasant_cool  camera: two_shot  micro_expression: eyelid_flicker
  line: "You've followed the water further than anyone was meant to. Yes — my employers
         need the flow. Call it climate control for a very important... archive. Sell the
         district the convenience of not asking why, and everyone stays comfortable.
         Fight it, and the blocks that depend on the deal go dry the day I close the tap."
  effect: knowledge[network_needs_water_to_cool_the_amalgamation] (a MAJOR Reconstruction
    link — the enemy has a physical vulnerability: it must be COOLED); music:{cyan_hum}
  -> goto invest_hub

--- THE DOCTRINE COUNCIL (Landsmeet for a RESOURCE LAW) ---
node council_gate
  speaker: PLR (chairing)  camera: wide_council  music:{pool:TENSION,cue:hold}
  mechanic: evidence (flow numbers, Dasa's testimony, the cistern) + banked standing set
    which doctrine the room will pass. Each faction pushes its interest (poor blocks +
    Church = open; Trades = metered; Remnants = order/rationing; REDS/Network = privatize).
  choices:
   - "(OPEN TAP — water is a right, distributed by need.)"        -> doctrine_open
   - "(METERED — water is priced; use funds the system.)"          -> doctrine_metered
   - "(RATIONED BY NEED — triage: the sick and children first.)"   -> doctrine_ration [MEDICINE]
   - "(PRIVATIZE — sell the source to the buyer for capital now.)" -> doctrine_privatize
   - "(Expose the Network; refuse the sale; unite the district.)" [require knowledge.network_needs_water_to_cool_the_amalgamation] -> doctrine_defiance

===============================================================================
## 5. THE DOCTRINES (each a real trade-off; the district lives under it)
===============================================================================
node doctrine_open
  speaker: rue  emotion: moved  camera: two_shot  music:{pool:TENSION,cue:solemn_resolve}
  line: "The tap is open. No one in this district dies thirsty while another hoards.
         God and arithmetic willing, we'll make it stretch."
  effect: WATER-LAW=OPEN; everyone supplied, but reserves thin — a DROUGHT event later
    tests it (if the lake dips, shortages hit ALL equally); recorded[water_open];
    UNRECORDED[chose_the_commons]=true; poor blocks + Church loyal; REDS/Network rebuffed.
  -> END
node doctrine_metered
  speaker: okonma  emotion: cautious_relief  camera: closeup
  line: "Metered, then. Everyone pays a little, the system stays funded, the pipes get
         fixed. The ones who can't pay... we'll see. It's not cruel. It's just not kind."
  effect: WATER-LAW=METERED; sustainable + funds infrastructure, but the poorest ration
    themselves and some go without quietly; recorded[water_metered]; UNRECORDED
    [who_you_let_go_dry]=poor_blocks; economically stable, morally grey. -> END
node doctrine_ration  [MEDICINE]
  speaker: PLR  camera: two_shot  music:{pool:TENSION,cue:hold}
  line: "Triage. Sick and children and workers on the lines first. Everyone gets enough
         to live; no one gets enough to waste. We decide by need, and we OWN that
         decision out loud."
  effect: WATER-LAW=RATIONED; maximizes survival under scarcity (Frostpunk), but demands
    constant hard calls and breeds resentment among the able-bodied cut back; recorded
    [water_rationed]; UNRECORDED[you_played_god_with_the_tap]=true. The hardest, fairest-
    under-scarcity law. -> END
node doctrine_privatize
  speaker: vance  emotion: pleasant_cool  gesture: hand_you_a_cut  camera: closeup
  line: "The wise choice. Capital now, comfort now, and the buyer keeps the plant humming.
         The blocks that go dry? They were always going to. You just got paid for it."
  effect: WATER-LAW=PRIVATE; the dynasty gets a large capital windfall; the poor blocks
    and Homeless are cut off (deaths, migration); the Network SECURES the reclamation
    plant — advancing the Amalgamation's cooling + the endgame threat; recorded
    [sold_the_water]; UNRECORDED[let_the_machine_drink]=true. Most lucrative, worst future
    (Megaton: evil pays now). -> END
node doctrine_defiance  [the clean pillar win]
  speaker: PLR + rue + nila  camera: three_shot  music:{pool:TENSION,cue:defiant_resolve}
  line: "Dasa found out what the water's really for — cooling the thing under the Strip.
         We don't sell it. We don't just share it. We CHOKE it. Every litre that isn't
         keeping us alive stops feeding the machine. Let them come explain why they need
         our water so badly."
  effect: WATER-LAW=OPEN+DEFIANT; the district keeps its water AND deliberately starves
    the reclamation plant of surplus (a strategic strike on the Amalgamation's body —
    ties the endgame: the enemy can be COOLED-DENIED); the Network marks the dynasty a
    top threat (heat rises hard); recorded[choked_the_machine]; UNRECORDED[named_the_
    thirst]=true; the best fold inheritance for the liberation arc. Requires having
    traced the water to the plant (the mystery work). -> END

===============================================================================
## 6. CONSEQUENCE ACROSS THE FOLD (PILLAR — the district lives under the law)
===============================================================================
- OPEN: humane, fragile; a later drought event stress-tests it; heir inherits a loyal
  but thin-reserved district.
- METERED: stable, grey; heir inherits a funded system and a quietly-suffering underclass
  (the unrecorded ledger names who went dry).
- RATIONED: survivalist, fair-under-scarcity, resented; heir inherits a disciplined,
  tense district that endures crises best.
- PRIVATIZE: rich now, hollow later; the Network holds the plant; every later generation
  faces a better-cooled, stronger Amalgamation (the worst long-game).
- DEFIANCE: the strategic pillar win — the district keeps water AND weakens the enemy's
  body; heir inherits a besieged-but-armed district and a live vulnerability (cooling
  denial) for the endgame.
- UNRECORDED water flags color survival, mood, and the Amalgamation's strength for the
  rest of the game.

===============================================================================
## 7. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Okonma's guilt (wont_meet_your_eyes), Dasa's cracked-lip defiance, Rue's fervor,
  Vance's eyelid_flicker (recurring tell). The doctrine council frames each faction's
  face as the vote turns. Procedural lip-sync.
BODY: pump-station and cistern are staged spaces (scheduler); gesture one-shots
  (grip_sleeve, open_hands, hand_you_a_cut). Rescuing Dasa may involve stealth/dodge
  (Pacifist path) or a fight (Dead Eye) against her captors.
CAMERA: closeup on the flow gauges (the numbers ARE the stakes — like Q006's ledger),
  wide_cistern for the reveal, wide_council for the doctrine vote, three_shot for defiance.
  Cuts on beat.
MUSIC: TENSION with a flowing/dripping water motif; the cyan-hum on the cistern/plant
  reveal (the Amalgamation link); solemn resolve at the doctrine-setting; defiant resolve
  on the pillar win. 120 BPM.

===============================================================================
## 8. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + the curriculum)
===============================================================================
- Pacifist-completable: the investigation and council are non-combat; rescuing Dasa can
  be done by stealth/negotiation; the doctrine is set by evidence + standing, not force.
- Rewards diverge hard (Megaton law): PRIVATIZE = capital now + the worst future;
  DEFIANCE = no windfall + the best strategic future; the humane laws (OPEN/RATION) cost
  comfort and demand hard governance. No doctrine is "correct" — each is a real-world
  water politics answer with real litres and real lives (the curriculum: infrastructure
  IS the lesson, taught without preaching).
- MAJOR mystery payoff: reveals the Amalgamation's physical VULNERABILITY (it must be
  cooled by the reclamation plant), turning a water quest into a strategic key for the
  endgame (Outer-Wilds knowledge-as-power).

===============================================================================
## 9. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Drives the WATER/ECONOMY subsystem (supply, distribution
model) + the doctrine-council (Q007's support-tally reused for a resource law) + a MAJOR
Reconstruction node (the_machine_drinks / cooling vulnerability). Reads ledger/standing/
skill/knowledge/economy/fold; writes same + persistent water-law governance. Deterministic
+ save-through. Gate: all five doctrines install + persist, council tallies correctly,
Dasa alive/dead branches resolve, the cooling-vulnerability node locks on tracing the
water, defiance gated behind the mystery. Joins the suite.

## 10. WHAT THIS PROVES (vs 001-014)
Third PILLAR + the INFRASTRUCTURE-CONSPIRACY engine: a missing-person case that opens
into the real Vegas water system, resolved by installing a WATER DOCTRINE the district
lives under (open/metered/rationed/privatized/defiant) — the "infrastructure IS the
curriculum" thesis made a generation-defining law, each doctrine a real trade-off in
litres and lives. It also delivers a MAJOR mystery payoff (the Amalgamation must be
COOLED — a physical vulnerability for the endgame), linking the resource sim to the
Reconstruction. Bible at 15; three pillars now anchor the tiers, and the water teaches
without preaching.
