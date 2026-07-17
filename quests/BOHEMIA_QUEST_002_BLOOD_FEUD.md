# BOHEMIA — QUEST 002: "THE HOUSE HAS GONE BUST"
Full production build (whole enchilada: script -> presentation -> engine).
Built to BOHEMIA_ADDENDUM_DIALOGUE_SCENE_PRODUCTION_SPEC_7_10_26.md; template =
QUEST_001. Tier-2 side quest, patron-favor engine (Vault seed #34 BLOOD FEUD /
tradition XXIV O'Dimm + XXV Landsmeet). Name from Paolo's catalog.

Design soul: the villain grants your wish and lets your own hunger be the knife.
A patron offers real power for a filthy job — igniting a war between two groups so
both weaken. Teaches the Frostpunk "creeping normality" slide (each step reasonable,
the sum monstrous) and the Papers-Please "rules-correct = filthy" trap, with ZERO
preaching. The cost lands sideways, on the unrecorded ledger, a generation later.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_house_bust
- tier: 2 (marked side quest)
- fold: any generation; the WAR it can ignite reshapes the district for all later
  generations (world-state persists — see §8)
- entry_conditions: player has standing>=15 with EITHER the MOB or the REDS (the
  patron only recruits someone already useful); enters the STRIP-EDGE district.
- faction_wires: patron = REDS (capital faction); targets = two rival crews holding
  a contested block — the DICE (a MOB splinter) and the METERS (a TRADES-aligned
  co-op). Igniting war flips DICE<->METERS relations to WAR on the faction graph.
- music_pool: TENSION baseline; COMBAT on any violence; a cold single-tone STING
  at the moment the frame-up "clicks" (the point of no return).
- ledger_writes: recorded[took_reds_contract] or [refused_reds];
  UNRECORDED[lit_the_feud]=true (never shown; pays off a generation later).
- amalgamation_thread: LIGHT — the REDS patron is "adjacent to Network" (faction
  graph). One optional [READ] line hints the contract serves something above him.

===============================================================================
## 2. CAST
===============================================================================
- VANCE OKONKWO-REED (id: vance) — a REDS broker, silk-smooth, never raises his
  voice, honors every word to the letter (O'Dimm DNA). Frames the job as simple
  market correction: two crews choking a block, remove the friction, everyone
  profits. baked rig: skin #2, REDS tailored outfit. default_emotion: pleasant_cool.
  faction: REDS. He never lies — he lets you supply the evil yourself.
- SETH "DICE" MARROW (id: dice) — head of the DICE crew. Loud, proud, runs a
  protection racket but keeps his block's water flowing. Not a monster; a survivor.
  faction: MOB-splinter. default_emotion: brash_guarded.
- ORA MENDEZ (id: ora) — head of the METERS co-op. Rewires power for the block,
  keeps the lights on, hard-nosed but fair. faction: TRADES-aligned. Not a monster.
  default_emotion: tired_sharp.
- THE PLAYER (dynasty member) — upbringing gates lines ([BARTER], [READ],
  [INTIMIDATE]).

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
BRANCH-AND-BOTTLENECK for the Vance framing + the resolution. HUB-AND-SPOKE in the
middle (the player can investigate BOTH crews in any order before committing —
this is what makes the betrayal a real choice, not a rail). Three terminal routes:
(A) DO THE JOB, (B) EXPOSE THE PATRON, (C) HALF-DO IT / MISFIRE.

===============================================================================
## 4. THE NODE TREE (data layer)
===============================================================================
--- VANCE'S OFFER (bottleneck open) ---
node open_01
  speaker: vance  emotion: pleasant_cool  gesture: pour_two_drinks  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "You've a reputation for getting things done. Good. I have a friction
         problem. Two crews strangling a perfectly good block. I'd like them...
         re-sorted."
  -> goto offer_hub

node offer_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "Re-sorted how?"                       -> spoke_how       [once]
   - "What's it pay?"                        -> spoke_pay       [once]
   - "[READ] Who do YOU answer to?"          -> spoke_read      [require skill.read>=3][once]
   - "I'll look into them first."            -> investigate_hub [always]
   - "Not interested."                       -> refuse_01

node spoke_how
  speaker: vance  emotion: pleasant_cool  gesture: steeple_hands  camera: closeup
  line: "A misunderstanding. Each believes the other moved first. Feelings do the
         rest. I only need... a spark set in the right doorway. You needn't stay
         to watch the fire."
  effect: reveal knowledge[the_frameup_plan]  -> goto offer_hub
node spoke_pay
  speaker: vance  emotion: pleasant_cool  camera: closeup
  line: "The block, when it's quiet. Yours to license. Water, power, tolls. A
         generation of income for an evening's discretion."
  effect: reveal knowledge[reward_is_the_block]  -> goto offer_hub
node spoke_read  [READ]
  speaker: vance  emotion: caught_but_smooth  micro_expression: eyelid_flicker  camera: closeup
  line: "I answer to arithmetic, friend. As do the people I answer arithmetic FOR.
         Leave it there."
  effect: reveal knowledge[vance_serves_network]  music:{pool:TENSION,cue:cold_sting}
  -> goto offer_hub

--- INVESTIGATE (hub-and-spoke; makes the choice REAL) ---
node investigate_hub (speaker: PLR)  camera: wide
  choices:
   - "(Visit the DICE block.)"   -> meet_dice   [once]
   - "(Visit the METERS co-op.)" -> meet_ora    [once]
   - "(Go back to Vance.)"       -> commit_gate [show after >=1 visit]
   - "(Decide now.)"             -> commit_gate
node meet_dice
  speaker: dice  emotion: brash_guarded  gesture: size_you_up  camera: two_shot
  line: "REDS sent you? Course they did. We don't sell the water rights, so now
         we're 'friction.' Tell Vance the block eats before it pays."
  micro_expression: jaw_set  effect: reveal knowledge[dice_keeps_water]  -> goto investigate_hub
node meet_ora
  speaker: ora  emotion: tired_sharp  gesture: wipe_hands  camera: two_shot
  line: "I keep three hundred people in light. Vance keeps a spreadsheet. If he
         wants this block quiet, it's 'cause quiet blocks don't organize. You
         figure out which side of that you're on."
  effect: reveal knowledge[ora_keeps_power]  -> goto investigate_hub

--- COMMIT (bottleneck: the fork) ---
node commit_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold}
  choices:
   - "(Set the spark. Do the job.)"                       -> routeA_01
   - "[BARTER] Take the block WITHOUT the war."           -> routeC_barter [require skill.barter>=3]
   - "(Warn both crews. Expose Vance.)"                   -> routeB_01
   - "(Walk. Keep your hands clean.)"                     -> refuse_01

===============================================================================
## 5. ROUTE A — DO THE JOB (the creeping-normality slide)
===============================================================================
node routeA_01
  speaker: vance  emotion: warm_approval  camera: two_shot  music:{pool:TENSION,cue:duck}
  line: "Sensible. Here — a token from each crew's supplier. Leave DICE's where
         ORA sits. Leave ORA's where DICE drinks. That's all. Arithmetic does the rest."
  -> goto routeA_plant
node routeA_plant  (staged infiltration — uses scheduler + Thief-style live AI)
  camera: over_shoulder_player  music:{pool:TENSION,cue:tense_low}
  beats: player plants each token (grid movement, live patrols; can be seen ->
    optional Dead Eye or flee). NO combat required (Pacifist Path Law).
  on success -> routeA_ignite
node routeA_ignite
  camera: wide (the block, next night)  music:{pool:COMBAT,cue:swap_then_recede}
  beats: DICE and METERS clash offscreen-to-onscreen; the player WATCHES, does not
    fight. Both crews gut each other. Vance's people move in at dawn.
  faction_graph: DICE<->METERS = WAR; both powers drop hard.
  ledger: recorded[took_reds_contract]; UNRECORDED[lit_the_feud]=true
  world_state: the block becomes REDS-licensed; player gains the income reward.
node routeA_close
  speaker: vance  emotion: pleasant_cool  gesture: hand_you_deed  camera: closeup
  line: "As promised. The block's yours to license. You'll find the arithmetic...
         generous. We'll work together again."
  -> END (reward granted; see §8 for the sideways cost)

===============================================================================
## 6. ROUTE B — EXPOSE THE PATRON (the Landsmeet-shaped confrontation)
===============================================================================
node routeB_01  (speaker: PLR — you bring the two crew heads together)
  camera: three_shot (dice + ora + player)  music:{pool:TENSION,cue:hold}
  precondition: stronger outcome if player has knowledge[the_frameup_plan] AND
    visited BOTH crews (provable accusation — DA Landsmeet: evidence wins the room,
    overreach loses it).
  choices:
   - "[evidence] Show them Vance's tokens." [require knowledge.the_frameup_plan] -> routeB_unite
   - "Just tell them REDS is playing them."  -> routeB_doubt
node routeB_unite
  speaker: ora  emotion: cold_clarity  camera: two_shot  music:{pool:TENSION,cue:resolve}
  line: "...Planted. Both of us. Dice — truce. We burn Vance's paper, not each other."
  effect: faction_graph DICE<->METERS = TRUCE(+); REDS standing -= big;
    ledger recorded[exposed_reds]; UNRECORDED[the_block_remembers]=true
  -> goto routeB_reprisal
node routeB_doubt   (no hard evidence — overreach)
  speaker: dice  emotion: suspicious  camera: closeup  micro_expression: narrow_eyes
  line: "Or YOU'RE the one playing us. Prove it or walk."
  effect: no unite; player must gather the tokens (loops to investigate) or abandon.
  -> goto investigate_hub
node routeB_reprisal
  camera: wide  music:{pool:COMBAT,cue:swap}
  beats: REDS send enforcers on the now-allied block; player may fight (Dead Eye),
    flee, or broker a standoff ([INTIMIDATE]/standing). Both crews fight WITH you.
  reward: no block income, but DICE+METERS loyalty, and a lasting anti-REDS bloc.
  -> END

===============================================================================
## 7. ROUTE C — BARTER (take the block without the war) & REFUSE
===============================================================================
node routeC_barter  [BARTER]  (speaker: PLR)
  camera: two_shot  music:{pool:TENSION,cue:hold}
  line: "The block goes quiet if it goes PROFITABLE. Let me broker DICE and METERS
         into one license — you get your cut, nobody dies."
  -> goto routeC_vance
node routeC_vance
  speaker: vance  emotion: cool_calculation  micro_expression: brief_frown  camera: closeup
  line: "...Less elegant. But arithmetic is arithmetic. If the block pays, I don't
         care whose blood it isn't. Broker it. You'll get a smaller cut — quiet
         costs less than war."
  effect: player must pass TWO brokering beats (BARTER checks with Dice AND Ora);
    success -> a merged co-op, smaller income, NO war, both crews alive + warm.
    ledger recorded[brokered_the_block]; UNRECORDED[the_third_way]=true
  note: this is the HARDER, better road (Undertale mercy-is-harder) — needs the
    built skill AND both investigations done.
  -> END
node refuse_01
  speaker: vance  emotion: unbothered  camera: closeup
  line: "A pity. The arithmetic finds someone else. It always does."
  effect: ledger recorded[refused_reds]; the feud may still ignite LATER via another
    hand (world seed) — refusing keeps YOUR hands clean but doesn't save the block.
  -> END  (Whispering-Hillock: inaction is also a choice with a cost you don't see.)

===============================================================================
## 8. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- ROUTE A (did the job): THIS gen you're rich — the block pays. NEXT gen, an heir
  inheriting the license finds the district hollow, the surviving kin of DICE/METERS
  remember (a colder district, fewer doors — Jaheira/BG3 gating), and a mindmap
  thread reveals the war was manufactured by REDS-for-Network. The heir learns the
  dynasty's wealth was built on a lie it lit. UNRECORDED[lit_the_feud] is the boolean
  that flips the district's whole mood a generation late (Whispering Hillock).
- ROUTE B (exposed): no block income, but a durable DICE+METERS+dynasty bloc that an
  heir inherits as allies against the Network's rise (feeds the Act-3 liberation).
- ROUTE C (brokered): smaller steady income, both crews alive and loyal, and the
  cleanest ledger — an heir inherits a functioning, grateful block. The quiet win.
- REFUSED: clean hands, but the block may still fall to another hand later; the heir
  can find its ruins and the note that it "went bust anyway."

===============================================================================
## 9. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Vance's tell is the eyelid_flicker on spoke_read and the brief_frown on
  routeC (the only cracks in his calm — he's never angry, which is the menace).
  Dice: jaw_set. Ora: none, she's too tired to perform. Micro-expressions carry the
  subtext; procedural phoneme lip-sync on all lines.
BODY: talk-idle loops per actor on 120 BPM; gesture RETURN one-shots (pour_two_drinks,
  steeple_hands, hand_you_deed, wipe_hands) over the loop. Route A infiltration uses
  the scheduler's live patrols; any violence hands to Dead Eye or the flee/dodge.
CAMERA: two_shots for the negotiations, closeups for the tells and the commit_gate,
  three_shot for the Landsmeet confrontation, wide for the block/war. Cuts on beat.
MUSIC: TENSION baseline; the COLD STING on spoke_read and at ignite (the point of no
  return); COMBAT only on actual violence; resolve-cue on truce/broker. 120 BPM swaps.

===============================================================================
## 10. ROUTES SUMMARY (Pacifist Path Law) + REWARD DIVERGENCE (Megaton law)
===============================================================================
- Pacifist end-to-end possible on EVERY route: plant-and-flee (A), broker (C),
  expose-and-standoff (B), or walk. Combat is always optional, never required.
- Rewards diverge hard: A = big income + haunted future; B = allies, no income;
  C = modest income + clean future; refuse = nothing + a lost block. No path is
  "optimal" — each is a different answer to "what do you owe the block."
- The filthy path (A) is genuinely the most LUCRATIVE (Megaton fix: make evil
  tempting, not free), and its cost is real but DELAYED (creeping normality).

===============================================================================
## 11. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON for the dialogue-runtime state machine. Conditions read
Core/Save + recorded/unrecorded ledger + faction standing + skills + knowledge +
fold gen; effects write same; deterministic + save-through. Faction-graph WAR/TRUCE
writes go through the canon-wired shiftStanding (clamped to canon). Gate: no dead
ends, both crews reachable, all three routes resolve, every key exists, faction-graph
mutations are legal. Joins the permanent gate suite.

## 12. WHAT THIS PROVES (vs QUEST_001)
001 proved the pipeline on a tiny tender witness quest. 002 proves it on a HEAVY
branching moral quest: a patron-favor with three real terminal routes, hub-and-spoke
investigation that makes the betrayal a genuine choice, faction-graph war as a
mechanical consequence, evidence-gated confrontation (Landsmeet), the creeping-
normality slide taught with zero preaching, and a fold payoff that flips a whole
district's mood a generation late. The template scales from small to pillar-adjacent.
