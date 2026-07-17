# BOHEMIA — QUEST 036: "THE LAST SHIFT AT THE PLANT"
Full production build. Built to the dialogue/scene spec; template = 001-035. Tier-2
INFRASTRUCTURE-SIEGE / hold-the-line (tradition XXXII Frostpunk crisis-law + the "keep the
lights on" survival-management shape + the reclamation-plant canon). Name catalog-adjacent.
A crisis-management quest: keep a failing power/water plant running through a night of
cascading failures — pure survival triage, the city-builder's systems under fire.

Design soul: the unglamorous heroism of keeping the lights on. The district's aging plant
(power + water, the twin lifebloods) is failing on the worst possible night, and the dynasty
must triage cascading breakdowns with never enough hands, parts, or time — choosing which
systems live and which blocks go dark. No villain, just entropy and hard math. Infrastructure
IS the curriculum: this quest teaches how fragile "the lights staying on" really is.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_last_shift
- tier: 2 (marked; a crisis call in the night)
- fold: which systems the dynasty saved (and who it let go dark) shapes the district's
  infrastructure resilience and which blocks trust the dynasty afterward.
- entry_conditions: the district's combined RECLAMATION PLANT (power + water) cascades into
  failure overnight; the exhausted chief (RASA) calls the dynasty in to help hold it.
- faction_wires: TRADES (the plant crew), VOLUNTEERS (the vulnerable who die first if it
  fails — hospital, nursery), REMNANTS (order if panic spreads), HOMELESS (the blocks cut
  first). NETWORK (a [READ] thread: the plant ALSO cools the servers — Q015 canon).
- music_pool: TENSION-URGENT (a driving, ticking crisis motif that intensifies as systems
  fail); COMBAT only if a desperate crowd turns; a spent, quiet resolve at dawn.
- ledger_writes: recorded[last_shift_outcome_*]; UNRECORDED[which_blocks_you_let_go_dark];
  district infrastructure-resilience + block-trust flags.
- amalgamation_thread: LIGHT — a [READ] reveals the plant's load includes cooling the servers
  (Q015 link); the player can choose to prioritize PEOPLE over the servers' cooling (a small
  strategic strike) or not notice/care.

===============================================================================
## 2. CAST
===============================================================================
- CHIEF RASA (id: rasa) — runs the plant; competent, exhausted, out of options and hands;
  hates every triage call but makes them. default_emotion: grim_capable. faction: TRADES.
- APPRENTICE TIB (id: tib) — a young, panicking crew member the dynasty can steady or lose;
  the human stakes on the crew side. default_emotion: overwhelmed. faction: TRADES.
- DELEGATE MERA (id: dmera) — speaks for the vulnerable blocks (hospital/nursery) begging not
  to be the ones cut. default_emotion: pleading_dignified. faction: VOLUNTEERS.
- THE PLANT ITSELF — a system of failing subsystems (turbines, pumps, coolant, the grid) —
  the "boss" is entropy; each failure a timed triage node.
- THE PLAYER — [TRADES]/[READ] (diagnose/repair), [MEDICINE] (prioritize the vulnerable),
  leadership (steady the crew).

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
CRISIS TRIAGE LOOP: cascading failures arrive on a timer; the dynasty allocates scarce
resources (parts, crew, time) across competing subsystems, choosing what to save and what to
sacrifice. A series of TRIAGE FORKS -> a dawn RESOLUTION scored by what survived + who was let
go dark. Frostpunk-style: no perfect run; every choice costs someone.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: rasa  emotion: grim_capable  gesture: slam_a_breaker  camera: two_shot
  music:{pool:URGENT,cue:crisis_enter}
  line: "Whole plant's going down like dominoes and I've got three crew and a prayer. Power AND
         water on the same dying spine. I can't save all of it — nobody could tonight. But maybe
         with you I save MOST of it. I'll call the failures; you help me choose what lives. And
         friend — every choice we make, somebody's block goes dark. Get comfortable with that fast."
  -> goto triage_hub
node triage_hub (speaker: PLR)  camera: plant_floor  music:{pool:URGENT,cue:ticking}
  effect: presents cascading TRIAGE FORKS (timed). Each fork spends limited resources. Sample forks:
  choices:
   - "(TURBINE failing — reroute power, but a block goes dark.)"  -> fork_turbine
   - "(PUMP seizing — save water, but the hospital's power dips.)" -> fork_pump
   - "(COOLANT line cracked — patch it, or vent + lose capacity.)" -> fork_coolant
   - "(Steady the crew — keep Tib from bolting.)"                  -> fork_crew
   - "(Dawn — see what held.)"                                     -> resolve_gate [after key forks]
node fork_turbine
  speaker: PLR (internal)  camera: closeup  micro_expression: n/a
  line: "(One turbine's gone. Reroute its load and the grid holds — but a residential block loses
         power till morning. Which block? The wealthy one that'll survive a cold night, or the poor
         one where losing heat KILLS? The math is ugly and it's yours.)"
  effect: TRIAGE choice — cut power to a block (player picks which by [MEDICINE]/values); logs
    UNRECORDED[which_blocks_you_let_go_dark]  -> goto triage_hub
node fork_pump
  speaker: dmera  emotion: pleading_dignified  gesture: grip_the_railing  camera: two_shot
  line: "The pump feeds the hospital's water AND its power runs the ward. Save the pump and a
         nursery loses heat; save the ward's power and the water stops. I'm not asking you to play
         God. I'm asking you to KNOW that you are, right now, whatever you pick."
  effect: TRIAGE choice — water vs ward power (a Sophie's-choice node); [MEDICINE] finds a partial
    both-save at a cost elsewhere  -> goto triage_hub
node fork_coolant
  speaker: rasa  emotion: grim_capable  camera: closeup  music:{pool:URGENT,cue:cyan_hum_faint}
  line: "Coolant line's cracked. Patch it and we keep full capacity. Vent it and we lose a third of
         output but buy time. ...And [READ]: notice the coolant line doesn't just cool the plant.
         Half that flow runs OFF-SITE — to the servers under the Strip. You could 'accidentally'
         vent the wrong line tonight. Nobody'd ever prove it. Just saying. Long night. Things break."
  effect: TRIAGE choice + OPTIONAL strategic beat — [READ] lets the player quietly deny the servers
    coolant under cover of the crisis (a Q015-linked strike on the Amalgamation's body); logs
    knowledge[you_can_starve_the_servers_tonight]  -> goto triage_hub
node fork_crew
  speaker: tib  emotion: overwhelmed  gesture: shaking_hands  camera: closeup
  line: "I can't— Chief I CAN'T, it's all failing and we're gonna lose people and it's gonna be MY
         fault, I can't—"
  choices (PLR):
   - "(Steady him — you're not alone, one valve at a time.)"  -> tib_steady
   - "(Send him home — he's a liability panicking.)"           -> tib_send
node tib_steady
  speaker: tib  emotion: steadying  camera: closeup  micro_expression: breath_returns
  line: "...one valve. Okay. One valve. I can do one valve. ...thank you. Okay. What's next."
  effect: Tib holds; +1 effective crew for the rest of the crisis (leadership pays); recorded
    [steadied_tib]  -> goto triage_hub
node tib_send
  effect: Tib leaves (safer for him, -1 crew for the crisis — a harder night); recorded[sent_tib_home]
  -> goto triage_hub

--- DAWN / RESOLUTION ---
node resolve_gate (speaker: rasa)  camera: two_shot  music:{pool:URGENT,cue:dawn_quiet}
  effect: score the night by what survived + who went dark.
  - MOST SAVED: the plant limps into dawn; the district holds; the dynasty is credited with a long,
    unglamorous, LIFE-SAVING night. block-trust up broadly; infrastructure-resilience up.
  - HARD LOSSES: some blocks went dark, some vulnerable died; the plant survives but the district
    counts its dead; trust splits by who was saved.
  rasa line (most saved): "...Dawn. We're still standing. Barely. You know how many nights I've
    prayed for one more pair of hands that KNEW what they were doing? We saved most of them. Most.
    I'll take most. Go sleep. You earned the ugly kind of hero's rest."
  effect: recorded[held_the_plant]; district infra-resilience + block-trust flags set; if the servers
    were starved (coolant beat), a strategic strike on the Amalgamation banks. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- MOST SAVED: the district's infrastructure is hardened (the dynasty learned the plant's guts — a
  resilience bonus for future crises + city-building); broad trust; an heir inherits a district that
  KNOWS how close it came and maintains its plant better.
- HARD LOSSES: the plant survives but blocks remember who was let go dark (trust splits — the blocks
  saved are loyal, the blocks cut are cold); an heir inherits that fault line.
- SERVERS STARVED (optional coolant beat): a quiet strategic strike on the Amalgamation's cooling
  (Q015 link) — the enemy runs a little hotter/weaker, banked toward the endgame; nobody knows the
  dynasty did it.
- UNRECORDED[which_blocks_you_let_go_dark] is a values ledger — did the dynasty save the vulnerable
  or the valuable when it had to choose?

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Rasa's grim competence (the pro who hates the math but does it); Tib's panic and its steadying
  (breath_returns); Mera's pleading dignity. The faces are exhaustion and hard resolve — no villains,
  just tired people making impossible calls. Procedural lip-sync.
BODY: the plant floor is a staged crisis space (scheduler — sparking panels, venting steam, running
  crew); the triage is a hands-on repair-and-allocate loop; combat only if a desperate crowd storms
  the gates (avoidable). Urgent, physical.
CAMERA: plant_floor framing (systems failing around the player), closeups on the triage faces, a
  quiet wide at dawn (the spent, standing survivors). Cuts tighten with the crisis, loosen at dawn.
MUSIC: a driving, TICKING URGENT motif that INTENSIFIES as systems fail (the crisis made audible);
  a faint cyan-hum at the coolant beat (the servers' secret); a spent, quiet resolve at dawn. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + the curriculum)
===============================================================================
- Pacifist by nature (the "enemy" is entropy, not people); combat only if panic turns violent
  (avoidable by steadying the crowd/crew).
- Rewards diverge (Megaton law): the reward is WHAT SURVIVED and WHO TRUSTS you after — saving the
  vulnerable earns Volunteer/poor-block loyalty; saving the valuable earns wealth-block favor; there's
  no "win everything" (Frostpunk). The optional servers-starve beat trades nothing the player needs
  for a strategic strike on the enemy.
- Core teaching (infrastructure IS the curriculum): how FRAGILE the lights-and-water really are, and
  that "keeping them on" is a nightly triage of hard math — the unglamorous backbone of the city-
  builder, dramatized. No preaching; the breakers and the body-count teach.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON as a TIMED TRIAGE LOOP (cascading failures, scarce-resource allocation,
scored by survival + values). Drives the POWER/WATER infrastructure subsystem (Q015 economy) + a
resilience flag + block-trust flags + the optional server-cooling strike (Q015 link). Reads ledger/
standing/skill/knowledge/economy/fold; writes same. Deterministic + save-through. Gate: triage forks
present on a timer + spend resources, all forks resolve, dawn scores by survival + values, block-trust
+ resilience persist, the optional coolant-strike banks, no-perfect-run enforced. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-035)
New engine: the INFRASTRUCTURE-SIEGE / crisis-triage — hold a failing power+water plant through a
night of cascading failures, allocating scarce parts/crew/time and choosing which blocks go dark
(Frostpunk crisis-law, no perfect run). The "enemy" is entropy; the reward is what survived and who
trusts you. Teaches how fragile the lights-and-water are (infrastructure IS the curriculum) and folds
in an optional Q015-linked strike on the servers' cooling. Introduces the timed triage loop. Bible at
36; the city-builder's survival backbone is now a dramatized quest.
