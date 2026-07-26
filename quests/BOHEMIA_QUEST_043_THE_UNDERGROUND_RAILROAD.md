# BOHEMIA — QUEST 043: "THE QUIET LINE"
Full production build. Built to the dialogue/scene spec; template = 001-042. Tier-2
RESCUE-NETWORK / smuggle-people (tradition on underground-railroad shape + Dishonored
non-lethal + the Network-harvesting canon Q029). Name catalog-adjacent. Build/run a secret
line to smuggle people out of Network reach (trial-victims, marked debtors, the hunted) —
a logistics-of-mercy quest that inverts the smuggling of Q016 (cargo is PEOPLE, saved not sold).

Design soul: the same roads that move contraband can move salvation. A quiet network moves
endangered people out of Network-controlled blocks before they're harvested (Q029) or purged
(Q037). The dynasty can join, run, expand, or betray it. It teaches that infrastructure serves
whoever builds it — the logistics bible turned toward MERCY, and a standing anti-Network asset.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_quiet_line
- tier: 2 (marked; can become a repeatable/standing operation once established)
- fold: whether the line is built, run, expanded, or betrayed shapes a standing rescue-asset and
  the dynasty's standing with the hunted (HOMELESS/VOLUNTEERS) vs the NETWORK.
- entry_conditions: a conductor (WREN-analog, MADDA) reveals a fledgling smuggling line for PEOPLE
  and asks the dynasty's help moving a group before a Network sweep.
- faction_wires: VOLUNTEERS + HOMELESS (run/use the line), CARAVANS (the routes — Q016 inverted),
  NETWORK (the hunters), REMNANTS (checkpoints, bribeable or hostile).
- music_pool: TENSION; a low, moving "quiet run" motif (tense, hushed); COMBAT if a run is caught
  (a failure); a warm, exhaled resolve when people reach safety.
- ledger_writes: recorded[quiet_line_outcome_*]; UNRECORDED[who_you_carried_to_safety];
  a standing RESCUE-LINE asset flag (repeatable runs) + NETWORK-heat.
- amalgamation_thread: MEDIUM — the line saves people FROM the Amalgamation's recruitment/harvest
  (Q029) and purges (Q037); running it is a direct, ongoing act of resistance (starves the enemy
  of victims — the humane counter to the mind-farm).

===============================================================================
## 2. CAST
===============================================================================
- MADDA (id: madda) — the conductor; a former trial-victim (Q029-adjacent) who escaped and now
  runs the line to get others out; brave, exhausted, principled. default_emotion: steady_hunted.
  faction: VOLUNTEERS-adjacent.
- THE PASSENGERS — a group of the endangered (a marked debtor, a trial-flagged family, a hunted
  NeuroLink-refuser); the human cargo, each with a face and a reason. default_emotion: frightened_hopeful.
- CHECKPOINT SGT. ODELL (id: odell) — RECURRING (Q016); a Remnants officer at the crossing —
  bribeable, foolable, or (if turned) an ally who looks the other way. default_emotion: bored_watchful.
- THE HUNTER / NETWORK AGENT (id: hunter) — tracking the line to harvest its passengers. default_
  emotion: patient_predatory.
- THE PLAYER — [READ]/[BARTER] (checkpoints), stealth/dodge (Pacifist runs), leadership.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
BUILD-AND-RUN: join the line -> run a passage (a stealth/logistics set-piece: routes, checkpoints,
timing) -> a resolution about the line's FUTURE: RUN IT (become a conductor — standing asset),
EXPAND IT (scale it into a real anti-Network rescue network), KEEP IT SMALL (safe but limited), or
BETRAY IT (sell the passengers to the Network — the dark Become route). Non-lethal core.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: madda  emotion: steady_hunted  gesture: pull_back_a_hidden_hatch  camera: two_shot
  music:{pool:TENSION,cue:quiet_enter}
  line: "I'm going to trust you with something that gets people killed if it's said wrong. There's
         a LINE — a way to move folks the Network's marked out of reach before the sweep takes them.
         Trial-flagged. Marked debtors. People who said no to the implant. I've got a group that has
         to move TONIGHT and I'm one conductor short. You in? Say no and just walk away and forget
         this. Say yes and you carry LIVES."
  choices (PLR):
   - "I'm in. Let's move them."          -> run_setup
   - "Who are you moving?"                -> spoke_passengers
   - "Who's hunting this line?"           -> spoke_hunter
node spoke_passengers
  speaker: madda  emotion: tender_urgent  camera: closeup
  line: "A mother whose name's on a trial list. An old debtor about to be 'collected.' A kid who
         ran from the Vault before they wired him. Ordinary people the machine wants to EAT. They're
         not cargo. They're the whole reason. Remember their faces when the run gets hard." -> goto run_setup
node spoke_hunter
  speaker: madda  emotion: grim  camera: closeup  micro_expression: glance_over_shoulder
  line: "A Network tracker. Patient. Doesn't storm in — WATCHES, follows a run back to the whole
         line, then takes everyone at once. That's the danger. Not getting caught tonight — getting
         FOLLOWED. We move clean or we don't move." -> goto run_setup

--- THE RUN (stealth/logistics set-piece) ---
node run_setup (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Plan the route — safe houses, timing.)"   -> plan_route  [once]
   - "(Handle the checkpoint — Odell's crossing.)" -> checkpoint_gate [once]
   - "(Move the passengers.)"                      -> run_execute
node plan_route
  speaker: PLR (internal)  camera: night_map  music:{pool:TENSION,cue:low_move}
  line: "(Safe houses strung across the district like stepping stones — a bakery cellar, a chapel
         crypt, a caravan's false floor. Move at shift-change, avoid the lit blocks, never the same
         route twice. The Q016 smuggling roads — but this time the cargo breathes and I'm saving it,
         not selling it.)"
  effect: knowledge[the_route_is_planned] (reduces run risk)  -> goto run_setup
node checkpoint_gate
  speaker: odell  emotion: bored_watchful  gesture: raise_lantern  camera: two_shot
  line: "Night movement. You know I've got to check. ...Though I've looked away from your kind of
         cargo before, haven't I. (if Q016 truth-told rep) Question is whether tonight's the night
         it costs me my post. Give me a reason. Or a bribe. Or the truth. I've taken all three."
  choices (PLR):
   - "[BARTER] (Grease it.)"                 -> cp_pass
   - "(The truth — these are people, not contraband.)" -> cp_truth
   - "[READ] (Forged transit papers.)"        -> cp_pass
node cp_truth
  speaker: odell  emotion: conflicted_then_soft  camera: closeup  micro_expression: jaw_works
  line: "...Refugees. From the Network. And you're TELLING me, trusting me with it. ...Go. Go before
         I remember I'm supposed to stop you. And — the tracker was through here an hour back. Watch
         the east crossing. That's not a bribe talking. That's a man who's tired of what he waves
         through." (Odell becomes a quiet ally)
  effect: knowledge[odell_covers_the_line] (a turned checkpoint — a standing asset)  -> goto run_execute
node cp_pass
  effect: checkpoint cleared (bribe/forgery); run continues  -> goto run_execute
node run_execute
  speaker: PLR (internal)  camera: night_run  music:{pool:TENSION,cue:tense_move}
  beats: the RUN — move the passengers house to house (stealth/timing/dodge — Pacifist Path); the
    Network tracker may pick up the trail (a tension mechanic: move clean or get FOLLOWED). 
    - CLEAN: passengers reach safety; the line stays secret.
    - FOLLOWED: a choice — lead the tracker astray (skill), lose them (dodge), or confront (Dead Eye,
      loud, risks the line).
  effect: recorded[ran_the_line]; UNRECORDED[who_you_carried_to_safety]=true  -> goto future_gate

--- THE LINE'S FUTURE ---
node future_gate (speaker: madda + PLR)  camera: two_shot  music:{pool:TENSION,cue:hold}
  line (madda): "They made it. Look at them — SAFE. You felt that? That's the best thing this rotten
         city still lets us do. So. What now? I can't run this alone forever."
  choices (PLR):
   - "(Run it — become a conductor.)"                 -> route_run
   - "(Expand it — scale it into a real network.)"     -> route_expand
   - "(Keep it small — safe and quiet.)"               -> route_small
   - "(Betray it — sell the line to the Network.)"     -> route_betray
node route_run
  speaker: madda  emotion: relieved_grateful  camera: two_shot  music:{pool:TENSION,cue:warm_exhale}
  line: "Then there's two of us now. Two conductors. Do you know how many more we can move with two?
         ...Welcome to the quiet line. Nobody'll ever cheer you for this. Nobody can KNOW. But every
         face we pull out of the dark — that's the cheer. That's the whole cheer."
  effect: the dynasty becomes a conductor — a STANDING repeatable rescue operation (move endangered
    NPCs for standing/resources/anti-Network progress); recorded[runs_the_line]; a persistent RESCUE-
    LINE asset; NETWORK-heat rises slowly (resistance has a cost). -> END
node route_expand
  speaker: madda  emotion: awed_wary  camera: closeup
  line: "SCALE it? More conductors, more safe houses, a real network — we could empty whole marked
         blocks before the sweeps. It's bigger, it saves MORE... and it's louder. The Network will
         HUNT a network. But God, the people we could pull out. ...Your call. Big and dangerous, or
         small and safe."
  effect: the line becomes a major anti-Network RESCUE NETWORK (saves many, a real strategic thorn in
    the enemy's harvest — starves the Amalgamation of victims); recorded[expanded_the_line]; a large
    standing asset + high NETWORK-heat (a priority target); the boldest humane play. -> END
node route_small
  speaker: madda  emotion: understanding  camera: two_shot
  line: "Small and quiet. Fewer saved, but fewer lost, and the line lives to run another night.
         ...It's not cowardice. It's arithmetic. A line that survives saves more over years than a
         network that gets caught in a month. Slow mercy. I can live with slow mercy."
  effect: the line stays small (a modest, durable, low-heat rescue asset); recorded[kept_it_small];
    sustainable resistance. -> END
node route_betray
  speaker: hunter (Network)  emotion: pleased_cold  camera: closeup  micro_expression: n/a
  line: "A conductor who'll sell his own line. The Network pays WELL for a whole route and everyone on
         it — the passengers, the safe houses, the other conductors. One payment, and you're our most
         valued kind of asset: the one they TRUST. Do we have a deal?"
  effect: the dynasty sells the line (a large payment + deep Network favor); the passengers + Madda +
    the safe houses are taken (harvested/purged); recorded[betrayed_the_line]; UNRECORDED[sold_the_
    saved]=true; NETWORK-disposition -> deeply aligned; the coldest Become route (mercy's infrastructure
    turned into a trap — the darkest thing the dynasty can do with a rescue line). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- RUN: a standing rescue asset (repeatable people-saving runs); HOMELESS/VOLUNTEERS deep trust; slow
  NETWORK-heat; an heir inherits a quiet lifesaving operation.
- EXPAND: a major anti-Network network (saves many, starves the enemy of harvest-victims — a real
  strategic strike on the Amalgamation's GROWTH, ties Q029); high heat (a hunted asset); the boldest
  legacy.
- SMALL: a durable, low-heat rescue line (slow mercy that survives generations); sustainable.
- BETRAY: a windfall + Network favor + the deaths of everyone on the line; the darkest mark; an heir
  inherits Network alignment and the knowledge the bloodline sold the saved.
- The RESCUE-LINE asset (run/expand/small) is a standing anti-Network counter that compounds toward the
  endgame — cohesion + saved lives vs the enemy's fracture + harvest.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Madda's steady exhaustion (steady_hunted, the conductor who's seen too much); the passengers'
  frightened hope turning to safe-arrival relief (the payoff faces — why the run matters); Odell's
  conflicted turn (jaw_works); the hunter's patient cold. Procedural lip-sync.
BODY: the run is a stealth/logistics set-piece (scheduler patrols, safe-house waypoints, the passengers
  as escorted NPCs); Pacifist movement (dodge/timing); combat only if caught (a failure). The hidden
  hatch, the false floors — the infrastructure of mercy.
CAMERA: two_shots with Madda, night_map for planning, night_run for the passage (tense, hushed), a warm
  wide on the safe arrival (the passengers exhaling). Cuts tighten on the run, release at safety.
MUSIC: a low, moving QUIET-RUN motif (hushed tension); COMBAT if caught; a WARM exhaled resolve when
  people reach safety (the best sound in the game — mercy that worked). 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + logistics-of-mercy)
===============================================================================
- Pacifist by design (the whole point is saving lives non-violently); combat is a FAILURE state (a
  caught run). The cleanest expression of the Pacifist Path Law at scale.
- Rewards diverge (Megaton law): RUN = a standing rescue asset; EXPAND = a major network + high heat +
  a strike on the enemy's harvest; SMALL = durable slow mercy; BETRAY = a windfall + Network favor + the
  deaths of the saved. The humane routes cost heat and cash; the betrayal pays most (evil is lucrative —
  the recurring trap). 
- Core purpose: the logistics bible turned toward MERCY (Q016 smuggling INVERTED — cargo is people,
  saved not sold), and a standing ANTI-NETWORK asset that starves the Amalgamation of victims (the
  humane counter to Q029's harvest). Infrastructure serves whoever builds it.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON with a BUILD-AND-RUN structure (stealth/logistics run + a standing repeatable
RESCUE-LINE asset). Inverts the Q016 smuggling tech (people-as-cargo, escorted NPCs). Uses the recurring
Odell checkpoint + the "followed vs clean" tension mechanic + NETWORK-heat. Reads ledger/standing/skill/
knowledge/fold; writes same + a RESCUE-LINE asset flag + NETWORK-heat/disposition. Deterministic + save-
through. Gate: the run executes (clean + followed branches), checkpoint resolves (bribe/forge/truth-turn),
all four futures resolve, the rescue-line asset persists + is repeatable, betray sets Network alignment,
combat is a failure state not a requirement. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-042)
New engine: the RESCUE-NETWORK / logistics-of-mercy — build and run a secret line to smuggle endangered
people out of Network reach (Q016 smuggling INVERTED: cargo is people, saved not sold), resolved by run/
expand/small/betray, establishing a STANDING anti-Network rescue asset that starves the Amalgamation of
harvest-victims (the humane counter to Q029). The cleanest large-scale expression of the Pacifist Path
(combat = failure). Introduces the people-as-cargo escort + the followed-vs-clean tension. Bible at 43;
the roads that moved contraband now move salvation, and mercy has infrastructure.
