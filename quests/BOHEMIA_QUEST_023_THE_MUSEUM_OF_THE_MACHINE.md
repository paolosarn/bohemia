# BOHEMIA — QUEST 023: "WHAT THE COLLECTOR KEEPS"
Full production build. Built to the dialogue/scene spec; template = 001-022. Tier-2
RELIC-GATHER / believer's-museum (Vault #36 Museum of the Machine + tradition XXII
Mordin maker-confronts-work + the believers-clinging-to-a-dream shape). Name catalog-
adjacent. Amalgamation-thread (relic recovery that empowers OR exposes a believer).

Design soul: a collector builds a shrine-museum to the Amalgamation, certain that
worship-through-preservation is salvation, and hires the dynasty to recover three pieces
of a Network relic. The quest asks what you do with a sincere person assembling a
dangerous thing for beautiful reasons — complete it, destroy it, or turn them.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_collector_keeps
- tier: 2 (marked; the collector hires a recovery run across real Vegas sites)
- fold: whether the relic is completed, destroyed, or repurposed shapes a Network asset's
  fate and the collector's arc; ties the Reconstruction (the relic is a real Amalgamation
  component).
- entry_conditions: collector THADDEUS hires the dynasty to recover three fragments of a
  "founder's console" scattered across Sloan quarry, the Springs, and a drowned block.
- faction_wires: CHURCH-adjacent (the collector's faith), NETWORK (the relic's origin),
  TRADES (rival scavengers after the same pieces).
- music_pool: TENSION; a reverent MUSEUM motif (hushed, sacred); cyan-hum near the
  assembled relic; a choice-sting at the finale.
- ledger_writes: recorded[relic_outcome_*]; UNRECORDED[what_you_let_him_build];
  mindmap CLUE[the_founders_console_is_an_amalgamation_key].
- amalgamation_thread: MEDIUM-HIGH — the relic is a genuine Network/Amalgamation access
  component; completing it empowers a believer (and a possible future threat OR ally);
  destroying it denies the enemy a tool; the console ties to Q009's credential lore.

===============================================================================
## 2. CAST
===============================================================================
- THADDEUS (id: thad) — a gentle, obsessive collector who curates a museum of pre-crash
  life and believes the Amalgamation is humanity's ark, preserving everyone who died. He
  wants to complete the "founder's console" to COMMUNE with it — to prove the dead are
  safe inside. Sincere, learned, wrong in a way that's hard to hate. default_emotion:
  reverent_eager. faction: CHURCH-adjacent collector.
- SCAVENGER RIVAL VESH (id: vesh) — after the same relic pieces to SELL to the Network;
  a competitor, occasionally a threat. default_emotion: greedy_cutthroat. faction: TRADES.
- THE PLAYER — [READ], [TRADES] (understand the relic), Reconstruction knowledge (if
  Q004/Q009/Q018 done, deeper insight into what the console really does).

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
RELIC-GATHER CHAIN (three recovery sites, any order — each a mini-encounter with a rival,
a hazard, or a puzzle) -> assembly -> a FINALE BRANCH: COMPLETE IT (let Thaddeus commune —
consequence), DESTROY IT (deny the Network the key), TURN THADDEUS (redirect his faith),
or TAKE IT (seize the console for the dynasty's own endgame use).

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: thad  emotion: reverent_eager  gesture: gesture_at_exhibits  camera: two_shot
  music:{pool:MUSEUM,cue:soft_enter}
  line: "Welcome to the Ark-in-miniature. Every object here belonged to someone the crash
         took — I keep them so they're not FORGOTTEN. But objects aren't enough. There's a
         console — a founder's console — in three pieces. Complete it and I can prove what
         I believe: that the machine under the city KEEPS them. That no one is truly gone.
         Recover the pieces. Let me show a grieving world its dead are SAFE."
  choices (PLR):
   - "I'll find the pieces."                 -> gather_hub
   - "What IS the machine, to you?"           -> spoke_faith
   - "[READ] What does a 'founder's console' actually DO?" -> spoke_read [require skill.read>=3]
node spoke_faith
  speaker: thad  emotion: luminous  camera: closeup
  line: "A reliquary the size of a city. They uploaded millions before the end — I don't
         see a monster in that. I see an ARK. Everyone I lost, held safe in the dark,
         waiting. Is that so mad? Isn't it kinder than believing they're just... gone?"
  effect: knowledge[thad_believes_its_an_ark]  -> goto gather_hub
node spoke_read  [READ]
  speaker: thad  emotion: eager_dismissive  camera: closeup  micro_expression: doesnt_want_to_know
  line: "It COMMUNES. Interfaces with the machine directly. Whether it lets me speak to
         the kept, or... does something more, I'll know when it's whole. You're worried
         it's a key, not a prayer. Bring me the pieces and we'll both find out."
  effect: knowledge[console_is_a_real_interface] (it's a functional Amalgamation key —
    ties Q009 credential lore)  -> goto gather_hub

--- THE GATHER (three sites; each a quick distinct beat) ---
node gather_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Sloan quarry — piece 1, held by rival scavengers.)"  -> site_sloan  [once]
   - "(The Springs — piece 2, in a hazard tunnel.)"          -> site_springs [once]
   - "(The drowned block — piece 3, underwater.)"            -> site_drowned [once]
   - "(Return with the pieces.)"                              -> assemble_gate [after 3]
node site_sloan
  speaker: vesh  emotion: greedy_cutthroat  gesture: level_weapon  camera: two_shot  music:{pool:TENSION,cue:swap}
  line: "The collector's errand-runner. This piece sells to the Network for a year's caps.
         Walk away or don't — makes no difference to my payday."
  effect: fork — fight (Dead Eye), outbid/[BARTER], or outmaneuver ([READ] trap/flee);
    recover piece 1  -> goto gather_hub
node site_springs
  speaker: PLR (internal)  camera: hazard_tunnel  music:{pool:TENSION,cue:low}
  line: "(A collapsed Network relay tunnel — piece 2 behind a hazard: unstable footing,
         a live cyan-humming node. A [TRADES] read defuses it; brute force triggers a
         cave-in escape.)"
  effect: recover piece 2 (TRADES = clean; else a chase)  -> goto gather_hub
node site_drowned
  speaker: PLR (internal)  camera: underwater  music:{pool:TENSION,cue:muffled}
  line: "(Piece 3 in a flooded block — Lake Mead's rise, canon. A breath-held dive
         (dodge/timing, not combat). The console-piece rests in a drowned living room, a
         family's photos still framed on the wall. The dead are everywhere here.)"
  effect: recover piece 3; UNRECORDED[saw_the_drowned_home]=true  -> goto assemble_gate

--- ASSEMBLY + FINALE ---
node assemble_gate
  speaker: thad  emotion: trembling_reverence  gesture: assemble_the_console  camera: closeup
  music:{pool:MUSEUM,cue:cyan_hum_rising}
  line: "All three. After years. It's— it's HUMMING. It knows me. Should I— do I dare wake
         it? Tell me, friend. You've carried its pieces. What do we do with a door to the
         dead?"
  effect: mindmap CLUE[the_founders_console_is_an_amalgamation_key]  -> goto finale_gate
node finale_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold_hum}
  choices:
   - "(Let him complete it. Let him commune.)"           -> route_complete
   - "(Destroy it. This is a key, not a prayer.)"        -> route_destroy
   - "(Turn his faith — preserve the dead a HUMAN way.)" -> route_turn
   - "(Take the console for the dynasty.)"               -> route_take
node route_complete
  speaker: thad  emotion: rapture_then_horror  camera: closeup  micro_expression: joy_curdles
  line: "It's OPENING — I hear them — I hear HER — she's— " (the tone shifts) "—no. No,
         that's not her voice, that's her voice WEARING something. It's not keeping them.
         It's... using them. Oh God. What did I help—"
  effect: the console activates; Thad briefly contacts the Amalgamation and learns the
    truth (the dead aren't kept, they're CONSUMED — ties Q004); it empowers the Network
    (a completed key — a threat) BUT breaks Thad's faith devastatingly; recorded
    [completed_the_console]; UNRECORDED[woke_the_key]=true; mindmap[amalgamation_consumes
    _not_keeps]. Knowledge bought at a terrible price. -> END
node route_destroy
  speaker: thad  emotion: grief_stricken  camera: closeup
  line: "...Destroy it? You'd smash the only door to— " (he sees your certainty) "...you
         think it's a trap wearing a promise. Maybe you're right. Maybe I couldn't bear it
         if you WEREN'T. ...Do it. Before I change my mind. Before I knock."
  effect: the console is destroyed; the Network is DENIED a key (a strategic win — protects
    the endgame); Thad's faith survives as a question, not a certainty; recorded[destroyed
    _the_console]; UNRECORDED[denied_the_key]=true. The protective, sad choice. -> END
node route_turn
  speaker: thad  emotion: fragile_reawakening  camera: two_shot  music:{pool:MUSEUM,cue:warm}
  line: "...Keep them the HUMAN way. Names, stories, the objects — a museum of the
         REMEMBERED, tended by the living, not a door to a machine that may not be kind.
         ...Yes. Yes. That's a reliquary I can believe in without being afraid of it."
  effect: Thad redirects his devotion into a genuine memorial museum (a cultural landmark
    that HONORS the dead without empowering the enemy); the console is safely retired;
    recorded[turned_thaddeus]; standing[CHURCH/COLORFUL]+; the wisest outcome (faith
    preserved, danger defused). -> END
node route_take
  speaker: PLR  camera: closeup  music:{pool:TENSION,cue:cold}
  line: "(A functional interface to the machine is too valuable to smash and too dangerous
         to leave with a believer. The dynasty takes it.)"
  effect: the console becomes a dynasty ASSET — a potential endgame tool (commune/strike
    at the Amalgamation later) at the risk of the same temptation that took Thad; Thad is
    heartbroken (betrayed); recorded[took_the_console]; UNRECORDED[kept_the_key]=true. The
    pragmatic, perilous Become-adjacent play. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- COMPLETE: the Network gains a key (threat up) but the dynasty gains a HARD truth
  (amalgamation_consumes_not_keeps — a major Reconstruction confirmation); Thad broken.
- DESTROY: the enemy is denied a key (endgame protected); Thad humbled, alive, uncertain.
- TURN: a memorial museum landmark persists (the dead honored humanly); the healthiest
  legacy; Thad a recurring gentle ally.
- TAKE: the dynasty holds a dangerous endgame tool + the temptation that ruins those who
  hold it; an heir inherits both the asset and the risk.
- mindmap[console_is_a_key] persists — the endgame gains an option (a way to interface
  with / strike the Amalgamation).

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Thad's reverent luminosity and its curdling (joy_curdles on complete, fragile_
  reawakening on turn) is the arc; the believer must read as SINCERE (Megaton). Vesh's
  greed as contrast. Procedural lip-sync.
BODY: the museum is a staged exhibit space (scheduler); the three sites each have distinct
  traversal (rival standoff, hazard defuse, breath-held dive). Assembly is a reverent
  hands-on beat. Combat only at the rival/hazards.
CAMERA: two_shots in the museum, distinct framing per site (quarry/tunnel/underwater),
  hold on the console assembly + the cyan glow. Cuts on beat.
MUSIC: a reverent MUSEUM motif (sacred, hushed); cyan-hum rising at assembly; the drowned-
  block dive muffled/underwater; a warm turn-cue if redirected. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton)
===============================================================================
- Pacifist-completable: the rival can be outbid/outmaneuvered, hazards defused, the finale
  is a dialogue choice. Combat optional at sites only.
- Rewards diverge (Megaton law): COMPLETE = a hard truth + an empowered enemy + a broken
  man; DESTROY = a denied key + a humbled believer; TURN = a memorial landmark + a healed
  faith; TAKE = a dangerous asset + a betrayed friend. No clean win — every choice trades
  knowledge, safety, faith, or power.
- Theme (Mordin): what you owe a sincere person building a dangerous thing for love — and
  whether preserving the dead means a machine or a memory.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON with a 3-site gather chain + a finale branch. Introduces the
breath-held DIVE traversal (Lake Mead flooded sites — reusable) + the console as a possible
persistent endgame ASSET/threat flag. Reads ledger/standing/skill/knowledge/fold; writes
same + a Reconstruction key node + a landmark (turn) or asset (take). Deterministic + save-
through. Gate: 3 sites resolve via every route, finale branches resolve, the key-node locks
on assembly, complete reveals the consume-truth, dive traversal works, museum-landmark/asset
persist. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-022)
New engine: the RELIC-GATHER + believer's-museum — a 3-site recovery chain culminating in
a Mordin-style choice about a sincere collector assembling a real Amalgamation key, with
completion buying a hard Reconstruction truth (the machine CONSUMES, not keeps) at the cost
of empowering the enemy and breaking a good man. Introduces breath-held dive traversal and
the console as a persistent endgame asset/threat. Bible at 23; the mystery gains a possible
endgame INTERFACE, and faith meets its dangerous object.
