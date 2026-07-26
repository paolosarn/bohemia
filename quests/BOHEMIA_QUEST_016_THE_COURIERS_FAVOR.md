# BOHEMIA — QUEST 016: "THE COURIER'S FAVOR"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-015. Tier-2 MULTI-STOP ERRAND CHAIN with a moral fork (Vault #10 Aba-Daba /
NV drug-run + tradition on KCD Waldensians four-outcome fork + the courier/delivery
structure). Name from Paolo's catalog tone. First quest built as a MOVING chain across
districts — teaches the map and the logistics bible through a job.

Design soul: a simple delivery run becomes a test of what you'll carry and for whom.
The chain moves the player across real Vegas geography, and one stop forces a four-way
moral fork over a crucified runner — the errand's innocence curdles into a choice. The
job is the teacher: you learn the roads, the checkpoints, and the cost of cargo you
didn't ask about.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_couriers_favor
- tier: 2 (marked; offered by a caravan fixer needing a discreet runner)
- fold: how the run was handled (clean courier / thief / whistleblower) shapes the
  dynasty's standing with CARAVANS and TRADES and whether a smuggling route persists.
- entry_conditions: the player has any CARAVANS or TRADES standing; fixer BODE offers
  a paid multi-stop run "no questions."
- faction_wires: CARAVANS (the route), TRADES (the goods), CARTEL (the real client),
  REMNANTS (the checkpoints), VOLUNTEERS (the crucified runner's fate).
- music_pool: a moving TRAVEL motif (road rhythm on the 120 grid); TENSION at the
  fork; COMBAT only if a checkpoint or the fork turns violent.
- ledger_writes: recorded[courier_run_*]; UNRECORDED[what_you_carried]=true (whether
  you learned the cargo) + [the_runner_on_the_cross] outcome.
- amalgamation_thread: NONE (a logistics/moral-fork quest; teaches the map + supply bible).

===============================================================================
## 2. CAST
===============================================================================
- BODE (id: bode) — a CARAVANS fixer; hires the dynasty for a "simple" three-stop run,
  pays well for no questions. Not evil, just a middleman who survives by not looking in
  the crates. default_emotion: brisk_transactional. faction: CARAVANS.
- THE RUNNER / TAMSIN (id: tamsin) — at stop two: a young courier the Cartel crucified
  (tied up, left as a warning, still alive) for skimming a run. The moral fork. faction:
  none (freelance). default_emotion: agony_fear -> (if cut down) shattered_grateful.
- CHECKPOINT SGT. ODELL (id: odell) — a REMNANTS checkpoint officer who can be bribed,
  fooled, or told the truth. default_emotion: bored_suspicious. faction: REMNANTS.
- CLIENT'S AGENT (id: agent) — at stop three: receives the cargo; reveals (if asked)
  what it was. default_emotion: cold_efficient. faction: CARTEL.
- THE PLAYER — [BARTER]/[READ] (checkpoints), [MEDICINE] (help Tamsin), standing.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
LINEAR CHAIN (stop 1 pickup -> travel -> stop 2 the fork -> travel -> stop 3 delivery)
with FORKS at the checkpoint and at Tamsin, and a terminal fork at delivery: DELIVER
CLEAN (complete the job), STEAL THE CARGO (betray the client), or BLOW THE WHISTLE
(turn the route in). The Tamsin choice colors everything after.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- STOP 1: THE PICKUP ---
node open_01
  speaker: bode  emotion: brisk_transactional  gesture: slide_a_crate  camera: two_shot
  music:{pool:TRAVEL,cue:soft_enter}
  line: "Three stops. Pick up here, clear the east checkpoint, drop at the Sloan
         quarry road. Pay's good, and it's good BECAUSE you don't crack the crate or
         count the stops out loud. Simple. You in?"
  choices (PLR):
   - "I'm in. No questions."             -> travel_1
   - "[READ] What am I actually carrying?" -> spoke_cargo [require skill.read>=3]
   - "Who's the client?"                  -> spoke_client
node spoke_cargo  [READ]
  speaker: bode  emotion: guarded  camera: closeup  micro_expression: glance_away
  line: "You crack it, you own it. But since you've got the eye — medicine. Diverted
         medicine. The kind that's SUPPOSED to be in a clinic. I don't ask whose. Neither
         should you, if you want the pay."
  effect: knowledge[cargo_is_stolen_medicine]; UNRECORDED[what_you_carried]=true
    (ties Q006 economy — this is the OTHER end of a medicine skim)  -> goto travel_1
node spoke_client
  speaker: bode  emotion: flat  camera: closeup
  line: "The kind of client who crucifies people who ask. Do the run, get paid, forget
         my face. That's the whole relationship." -> goto travel_1

--- TRAVEL 1 -> CHECKPOINT ---
node travel_1
  speaker: PLR (internal)  camera: wide_road  music:{pool:TRAVEL,cue:road_rhythm}
  line: "(The east road. Real miles — dead strip-malls, a jackknifed caravan rusting in
         the median. Ahead: a Remnants checkpoint. They'll want to see the crate.)"
  -> goto checkpoint_gate
node checkpoint_gate
  speaker: odell  emotion: bored_suspicious  gesture: raise_hand_halt  camera: two_shot
  line: "Cargo check. Open it up or show me papers that say I don't want to."
  choices (PLR):
   - "[BARTER] (Grease the check.)"            -> cp_bribe   [currency]
   - "(Forged manifest / bluff.)"              -> cp_bluff   [READ]
   - "(Tell him the truth — it's stolen medicine.)" [require knowledge.cargo_is_stolen_medicine] -> cp_truth
   - "(Run the checkpoint.)"                    -> cp_run     (flee/dodge or COMBAT)
node cp_bribe
  speaker: odell  emotion: pocket_the_caps  camera: closeup
  line: "Crate's fine. Move along. Didn't see you." -> goto travel_2
node cp_bluff  [READ]
  speaker: odell  emotion: waved_through_grudging  camera: closeup
  line: "...Fine. Papers check out. Go." (success) -> goto travel_2
node cp_truth
  speaker: odell  emotion: startled_conflicted  camera: closeup  micro_expression: jaw_work
  line: "...Stolen clinic medicine. And you're TELLING me. Hell. Okay — I can seize it
         and it 'vanishes' into evidence, or you carry on and I never saw you. Your
         call, honest one." (opens a WHISTLEBLOWER seed — Odell becomes a contact)
  effect: knowledge[odell_will_help_expose]  -> goto travel_2
node cp_run
  effect: flee/dodge (Pacifist) or a fight (Dead Eye); success -> travel_2 but REMNANTS
    standing- and a "flagged runner" mark (later checkpoints harder). -> goto travel_2

--- STOP 2: THE CRUCIFIED RUNNER (the moral fork) ---
node travel_2
  speaker: PLR (internal)  camera: wide_road  music:{pool:TRAVEL,cue:road_rhythm_low}
  line: "(Halfway to Sloan. And then — off the road, against a billboard's dead frame —
         someone's been TIED UP. Left in the sun. A warning. ...She's still moving.)"
  -> goto tamsin_gate
node tamsin_gate
  speaker: tamsin  emotion: agony_fear  gesture: strain_against_ropes  camera: closeup
  music:{pool:TENSION,cue:hold}  micro_expression: cracked_whisper
  line: "Please— please, I'm not— I only took a little, my brother's SICK, I only— don't
         let them come back. Water. Please. Cut me down. Or don't leave me for them.
         Please."
  -> goto tamsin_fork
node tamsin_fork (speaker: PLR)  camera: closeup
  choices:
   - "(Cut her down. Help her.)"                     -> tamsin_save
   - "[MEDICINE] (She won't make it tied up — free and treat her.)" [require skill.medicine>=2] -> tamsin_save
   - "(Leave her. Not your job. Not your risk.)"     -> tamsin_leave
   - "(End her suffering.)"                           -> tamsin_mercy
   - "(Take her cargo/caps and go.)"                  -> tamsin_rob
node tamsin_save
  speaker: tamsin  emotion: shattered_grateful  camera: closeup  micro_expression: sob
  line: "...You came. Nobody— why did you— I'll disappear, I swear, they'll never know
         you— thank you, thank you—"
  effect: recorded[saved_tamsin]; UNRECORDED[cut_her_down]=true; Tamsin lives (may recur
    as a grateful contact / a future ally); if the player later BLOWS THE WHISTLE she's a
    witness. standing[VOLUNTEERS]+ if delivered to care. The costly-kind choice (the
    Cartel client may learn). -> goto travel_3
node tamsin_leave
  speaker: tamsin  emotion: breaking  camera: closeup
  line: "No— no please don't— don't LEAVE me—"
  effect: recorded[left_tamsin]; UNRECORDED[walked_past_the_cross]=true; she's dead when
    an heir or a later pass finds the billboard — a quiet mark. The safe, cold choice. -> goto travel_3
node tamsin_mercy
  speaker: PLR  camera: closeup  music:{pool:TENSION,cue:one_tone}
  line: "(You can't free her fast enough and can't leave her to them. You make it quick.
         It is the last mercy the road offers her.)"
  effect: recorded[mercy_tamsin]; UNRECORDED[the_last_mercy]=true; a grim compassion the
    game refuses to score (Sinnerman restraint). -> goto travel_3
node tamsin_rob
  speaker: tamsin  emotion: disbelief_despair  camera: closeup  micro_expression: eyes_empty
  line: "...you're— you're one of THEM. of course. of course you are."
  effect: recorded[robbed_tamsin]; UNRECORDED[took_from_the_cross]=true; the cruelest
    option; standing hits; the road remembers (Megaton: cruelty costs). -> goto travel_3

--- STOP 3: DELIVERY (terminal fork) ---
node travel_3
  speaker: agent  emotion: cold_efficient  gesture: reach_for_crate  camera: two_shot
  music:{pool:TENSION,cue:hold}
  line: "You're late enough to notice, early enough to pay. Hand it over and there's a
         bonus. Or don't, and find out why the last runner's on a billboard."
  choices (PLR):
   - "(Deliver the crate. Take the pay.)"              -> deliver_clean
   - "(Keep the cargo. Betray the client.)"            -> deliver_steal
   - "(Blow the whistle — turn the route in.)" [require knowledge.cargo_is_stolen_medicine AND (knowledge.odell_will_help_expose OR saved_tamsin)] -> deliver_whistle
node deliver_clean
  speaker: agent  emotion: satisfied_cold  camera: closeup
  line: "Smart. Bonus as promised. Bode knows how to find you for the next one."
  effect: recorded[delivered_clean]; full pay + CARAVANS/CARTEL standing; the medicine
    stays diverted (an heir may meet the clinic that went without — ties Q006);
    UNRECORDED[completed_the_run]=true. The paycheck, no questions. -> END
node deliver_steal
  speaker: PLR  camera: two_shot  music:{pool:COMBAT,cue:swap}
  line: "(You keep the crate. The agent reaches — the deal dies here.)"
  effect: a fight or a fast getaway (Dead Eye / flee); the stolen medicine can be
    RETURNED to a clinic (a redemption — reverses Q006-style harm) or kept/sold; CARTEL
    marks the dynasty an enemy (a threat seed); recorded[stole_the_cargo];
    UNRECORDED[turned_on_the_client]=true. High risk, self-directed. -> END
node deliver_whistle
  speaker: PLR (to Odell / a council)  camera: three_shot  music:{pool:TENSION,cue:resolve}
  line: "The whole route — Bode, the crate, the client, the girl on the billboard. Here's
         the manifest, here's a witness. Shut it down."
  effect: recorded[blew_the_whistle]; the smuggling route is BROKEN (medicine flow to
    clinics partially restored — ties Q006); Bode/the Cartel client exposed; the dynasty
    earns REMNANTS/VOLUNTEERS standing but loses CARAVANS/CARTEL (and gains a Cartel
    enemy); UNRECORDED[named_the_route]=true. The costly-righteous end. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- CLEAN: reliable-courier reputation (more lucrative runs later) + complicity in a
  medicine diversion an heir may trace to a dry clinic (Q006 link).
- STEAL: self-made enemy of the Cartel + a windfall or a redemption (returning the
  medicine); a volatile reputation.
- WHISTLE: a broken route + restored medicine + REMNANTS/VOLUNTEERS trust + a Cartel
  vendetta seed an heir inherits.
- TAMSIN saved: a grateful recurring contact/witness; left/mercy/robbed: a mark on the
  road an heir can find (the billboard remembers).
- UNRECORDED[what_you_carried] + the Tamsin outcome color the dynasty's road-reputation
  across the fold (Alpha Protocol reputation-travels).

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Bode's glance_away (the middleman who won't look), Odell's jaw_work at the truth,
  Tamsin's cracked_whisper and the fork's sob/eyes_empty, the agent's cold efficiency.
  Tamsin's portrait on the cross is the quest's gut-image. Procedural lip-sync.
BODY: the TRAVEL legs are grid traversals with a road rhythm (teaches the map); gesture
  one-shots (slide_a_crate, raise_hand_halt, strain_against_ropes). Checkpoint/fork/
  delivery can hand to Dead Eye or flee/dodge per choice.
CAMERA: wide_road for the travel (real Vegas geography as backdrop), closeup on Tamsin
  (the moral center), two_shots at the stops, three_shot for the whistle. Cuts on beat.
MUSIC: a moving TRAVEL motif on the road (120 grid rhythm); TENSION at the fork; COMBAT
  only on violence; resolve on the whistle. The road rhythm is the quest's signature. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton)
===============================================================================
- Pacifist-completable: checkpoints via bribe/bluff/truth, the fork via save/mercy/leave,
  delivery via clean/whistle; combat only if the player forces a checkpoint or a betrayal.
- Rewards diverge (Megaton law): CLEAN = best pay + complicity; STEAL = risk + self-
  direction; WHISTLE = righteous + a Cartel enemy + restored medicine. The Tamsin fork
  is a pure conscience test with no mechanical "reward" for kindness beyond who she
  becomes — the point is what you carry and who you leave on the road.
- Teaches the MAP + the logistics bible (checkpoints, routes, cargo you didn't ask
  about) through a moving job — the curriculum in motion.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON as a MOVING CHAIN (multi-stop, cross-district traversal with
a road-rhythm travel motif). Ties the medicine economy (Q006) at the smuggling end.
Reads ledger/standing/skill/knowledge/fold; writes same + road-reputation + a recurring
NPC (Tamsin) + a possible economy correction (returned/restored medicine). Deterministic
+ save-through. Gate: all checkpoint/fork/delivery routes resolve, whistle gated behind
evidence+witness, Tamsin's four outcomes persist to the billboard, medicine-economy
links fire, travel legs complete. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-015)
New engine: the MOVING ERRAND CHAIN — a multi-stop delivery across real Vegas geography
that teaches the map and the logistics bible through a job, with a curdling four-way
moral fork (the crucified runner) and a terminal courier/thief/whistleblower choice that
ties into the medicine economy (Q006). Proves the bible can run a quest that MOVES the
player across districts as its core structure, with conscience tests embedded in the
travel. Bible at 16; the map itself is now a quest surface.
