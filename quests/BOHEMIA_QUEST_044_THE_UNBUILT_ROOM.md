# BOHEMIA — QUEST 044: "THE ROOM THAT WASN'T BUILT"
Full production build. Built to the dialogue/scene spec; template = 001-043. Tier-3
BUILDER'S-DILEMMA / opportunity-cost (tradition XXXII Frostpunk resource-law + the city-
builder canon + the recorded-vs-unrecorded ledger). Name catalog-adjacent. A pure CITY-BUILDER
quest dramatized: one plot, scarce materials, and competing needs — clinic, granary, shelter,
or defense — where every build is another thing NOT built, and the choice shapes the district
for a generation. Teaches opportunity cost, the builder's real curriculum.

Design soul: to build one thing is to un-build every other. The district has resources for ONE
major structure on its last open plot, and four groups each need it to be theirs — and each has
a true case and a real cost-of-refusal. No villain, just scarcity and the weight of choosing.
The city-builder's core tension made a narrative quest: what you build is who you become.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_unbuilt_room
- tier: 3 (a builder's-dilemma; drives the city-builder resource sim)
- fold: what gets built shapes the district's resilience, health, growth, or safety for a
  generation — a compounding infrastructure choice an heir inherits grown (or missed).
- entry_conditions: the district has materials for ONE major build on its last plot; four
  delegations petition for it.
- faction_wires: VOLUNTEERS (clinic), TRADES/CARAVANS (granary/market), HOMELESS (shelter),
  REMNANTS (defense wall) — each faction's need embodied.
- music_pool: a contemplative BUILDER motif (measured, weighing); warm resolve on the build;
  no combat (a governance quest).
- ledger_writes: recorded[build_choice_*]; UNRECORDED[what_you_chose_not_to_build];
  a persistent district infrastructure/resilience state.
- amalgamation_thread: NONE. Pure city-builder curriculum (opportunity cost).

===============================================================================
## 2. CAST
===============================================================================
- MASTER-BUILDER OKA (id: oka) — runs the build crew; neutral, lays out the hard math (one plot,
  one structure, these materials, no more). default_emotion: plainspoken_pragmatic. faction: TRADES.
- DELEGATE VESNA (id: vesna) — VOLUNTEERS; petitions for a CLINIC (the sick die without it).
  default_emotion: urgent_caring.
- DELEGATE HARL (id: harl) — TRADES/CARAVANS; petitions for a GRANARY/market (hunger + the economy).
  default_emotion: practical_insistent.
- DELEGATE NURa (id: nura) — HOMELESS; petitions for a SHELTER (people freeze/die exposed).
  default_emotion: quiet_desperate.
- DELEGATE COLE (id: dcole) — REMNANTS; petitions for a DEFENSE WALL (raids are coming).
  default_emotion: grim_warning.
- THE PLAYER — weighs the four; [READ]/[MEDICINE] surface true stakes; leadership decides.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
DELIBERATION HUB (hear each of the four delegations' true case + cost-of-refusal) -> a single
BUILD CHOICE (clinic / granary / shelter / wall) -> a resolution showing the immediate benefit
AND the sharpest cost-of-not-building (opportunity cost made concrete). Optional: a clever
[READ]/[BARTER] partial-compromise at reduced scale. The city-builder's core tension, narrated.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: oka  emotion: plainspoken_pragmatic  gesture: unroll_a_plan  camera: two_shot
  music:{pool:BUILDER,cue:soft_enter}
  line: "Last open plot, and materials for ONE major build. Not two. Not one-and-a-half. One. I've
         got four delegations outside, each certain their need is THE need, and each of 'em right in
         their own way. I build what you tell me. But know this going in: whatever rises here, three
         other things DON'T. That's the job. That's always been the job. Who do you want to hear first?"
  -> goto deliberate_hub
node deliberate_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Hear the clinic case — Vesna.)"    -> case_clinic  [once]
   - "(Hear the granary case — Harl.)"     -> case_granary [once]
   - "(Hear the shelter case — Nura.)"     -> case_shelter [once]
   - "(Hear the wall case — Cole.)"        -> case_wall    [once]
   - "(Decide what to build.)"             -> build_gate   [show after 2 cases]
node case_clinic
  speaker: vesna  emotion: urgent_caring  gesture: press_a_list_of_names  camera: closeup
  line: "A clinic. Every season the fever takes people a real infirmary would've saved — here's this
         year's names, and it's longer than last year's. Build anything else and I can tell you almost
         exactly who dies waiting. I'm not being dramatic. I'm being a DOCTOR. This is arithmetic in
         bodies."
  effect: knowledge[clinic_saves_the_sick_costs_the_rest]  -> goto deliberate_hub
node case_granary
  speaker: harl  emotion: practical_insistent  gesture: tap_an_empty_sack  camera: closeup
  line: "A granary and market. Hungry people don't heal in your clinic OR hold your wall — they RIOT,
         or they leave. Store the harvest, steady the trade, and everything else gets POSSIBLE. Food
         isn't one need among four. It's the FLOOR the other three stand on. Build the floor first."
  effect: knowledge[granary_is_the_economic_floor]  -> goto deliberate_hub
node case_shelter
  speaker: nura  emotion: quiet_desperate  gesture: hold_a_thin_blanket  camera: closeup
  line: "A shelter. My people sleep in the open and the open kills — cold, sickness, worse. You'll
         never see us on Vesna's list because we die before we reach a clinic. A wall protects what's
         inside it; we're OUTSIDE it. Build the thing that decides whether we're people this district
         keeps, or people it lets the night take."
  effect: knowledge[shelter_saves_the_exposed_the_uncounted] (ties the HOMELESS canon — the discarded)
  -> goto deliberate_hub
node case_wall
  speaker: dcole  emotion: grim_warning  gesture: point_at_the_horizon  camera: closeup
  line: "A wall. The Cartel's massing and when they hit, your clinic and granary and shelter are just
         TARGETS with no wall around them. I don't LIKE being the one who says 'defense before mercy.'
         But a district that can't hold its ground doesn't get to have any of the nice things. Safety
         is the precondition for everything else. Build the wall or risk losing it ALL."
  effect: knowledge[wall_is_the_security_precondition]  -> goto deliberate_hub

--- THE BUILD CHOICE ---
node build_gate (speaker: PLR)  camera: closeup  music:{pool:BUILDER,cue:hold}
  choices:
   - "(Build the CLINIC.)"      -> build_clinic
   - "(Build the GRANARY.)"     -> build_granary
   - "(Build the SHELTER.)"     -> build_shelter
   - "(Build the WALL.)"        -> build_wall
   - "[READ/BARTER] (A reduced-scale compromise — two half-builds.)" -> build_compromise
node build_clinic
  speaker: vesna  emotion: grateful_grave  camera: two_shot  music:{pool:BUILDER,cue:warm_build}
  line: "Thank you. The names on this list — most of them live now. I won't forget it. ...And I know
         what it cost. Nura's people are still in the cold and Cole's wall's still a gap. You chose
         the sick. I'll honor it by making sure they don't die anyway."
  effect: CLINIC built (district HEALTH up — fewer seasonal deaths); COST: shelter/wall/granary needs
    unmet (exposure deaths, raid-vulnerability, or tighter food persist as real district states);
    recorded[built_clinic]; UNRECORDED[what_you_chose_not_to_build]=shelter_wall_granary. -> END
node build_granary
  speaker: harl  emotion: satisfied  camera: two_shot  music:{pool:BUILDER,cue:warm_build}
  line: "The floor's built. Full bellies, steady trade, a district that can AFFORD its next choice.
         The others'll grumble — let 'em grumble fed. Next season's surplus buys the clinic they wanted.
         That's how you build a city: floor first, then everything ON it."
  effect: GRANARY built (district ECONOMY/food-stability up — enables FUTURE builds faster); COST:
    the sick/exposed/undefended wait (real states persist); recorded[built_granary]; the long-game
    economic choice (delayed enablement). -> END
node build_shelter
  speaker: nura  emotion: overwhelmed  camera: two_shot  music:{pool:BUILDER,cue:warm_build}
  line: "...You built it for US. The uncounted. The ones every other district lets the night take.
         (quietly) Do you know what that DOES, to be chosen? My people will remember this dynasty
         chose the outside as worth keeping. We don't forget who kept us. We never forget."
  effect: SHELTER built (district saves the EXPOSED — HOMELESS deeply bonded, population/cohesion up);
    COST: sick/hungry/undefended states persist; recorded[built_shelter]; UNRECORDED[chose_the_
    uncounted]=true; the mercy-to-the-discarded choice (ties the HOMELESS/debtor canon). -> END
node build_wall
  speaker: dcole  emotion: grim_relief  camera: two_shot  music:{pool:BUILDER,cue:warm_build}
  line: "Wall's up. When the Cartel comes — and they're coming — this district HOLDS. I know what got
         traded for it. But a graveyard doesn't need a clinic, and ashes don't need a granary. You
         bought the district a FUTURE to have those arguments in. Safety first. Everything else second."
  effect: WALL built (district DEFENSE up — survives the coming raid, ties Q014 Cartel-escalation state);
    COST: sick/exposed/hungry states persist; recorded[built_wall]; the security-first choice (protects
    everything at the cost of everything else's now). -> END
node build_compromise  [READ/BARTER]
  speaker: oka  emotion: skeptical_impressed  camera: closeup
  line: "...Two half-builds instead of one whole one? A lean-to shelter AND a field-clinic tent, say —
         neither as good as the real thing, both better than nothing? It's not how I'd do it. It's not
         EFFICIENT. But if you can scrounge the extra and accept that HALF-solutions half-work... maybe
         that's its own kind of wisdom. Or its own kind of mess. We'll find out."
  effect: TWO reduced-scale builds (both partial — half the benefit each, at the cost of neither being
    robust); recorded[built_compromise]; UNRECORDED[split_the_difference]=true; the pragmatic-but-
    imperfect route (spreads the mercy thin — sometimes wise, sometimes a mess that serves no one fully;
    the game doesn't say which — that's the builder's gamble). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- CLINIC: district health up (fewer seasonal deaths for generations); the unmet needs (shelter/wall/
  granary) persist as real states an heir inherits + must eventually address.
- GRANARY: economic floor + faster future builds (a compounding enabler — the long-game); other needs
  wait.
- SHELTER: the exposed saved + deep HOMELESS bond + cohesion (ties the discarded-debtor canon); other
  needs wait.
- WALL: survives the coming raid (Q014 link); other needs wait (and if no raid comes, the wall is a
  hedge that cost the district its mercy — the risk of security-first).
- COMPROMISE: two half-solutions — spreads thin; may be wisdom or mess (the game leaves it to play out).
- UNRECORDED[what_you_chose_not_to_build] is the opportunity-cost ledger — the district IS the sum of
  what you built AND the ghosts of what you didn't (the builder's true accounting).

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: four faces of need, each true — Vesna's list of names, Harl's empty sack, Nura's thin blanket,
  Cole's horizon-warning; Oka's plainspoken neutrality. The chosen delegate's gratitude AND their
  acknowledgment of the cost (nobody pretends the others didn't lose). Procedural lip-sync.
BODY: a petition/deliberation staging (the four delegates, the plot, the plan-table); the build itself
  is a staged construction (scheduler world-state change — the structure rising is the payoff). No combat.
CAMERA: two_shots for each case, closeup on the props of need (the list, the sack, the blanket), a wide
  on the finished build rising. Cuts on beat.
MUSIC: a contemplative BUILDER motif (measured, weighing — the sound of a hard choice); a warm build-cue
  as the chosen structure rises. No dread (a governance quest). 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Megaton + the builder's curriculum)
===============================================================================
- Zero combat (a pure governance/resource quest).
- Rewards diverge (Megaton law) as DISTRICT STATES: CLINIC = health; GRANARY = economy + future
  enablement; SHELTER = the exposed saved + cohesion; WALL = defense (raid survival); COMPROMISE = two
  half-measures. There is NO "correct" build — each is a real answer to scarcity with a real cost, and
  the district becomes the sum of the choice (Frostpunk: you can't have everything, and the game makes
  you feel the cost of what you gave up).
- Core teaching (infrastructure IS the curriculum): OPPORTUNITY COST — the builder's fundamental truth,
  that every build un-builds three others. No preaching; the unmet-need states teach. The compromise
  route teaches that spreading thin is its own gamble.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON that drives the CITY-BUILDER resource sim (one plot, scarce materials, a
build choice writing a persistent district-infrastructure state) + the unmet-need states (opportunity
cost made mechanical) + the reduced-scale compromise. Reads ledger/standing/skill/economy/fold; writes
the build + the un-built-need states + district resilience/health/economy/defense. Deterministic + save-
through. Gate: all four cases heard, all four builds + the compromise resolve, the chosen build writes
its district state, the UNMET needs persist as real states, no-correct-answer enforced (each has a real
cost). Joins the suite.

## 9. WHAT THIS PROVES (vs 001-043)
New engine: the BUILDER'S-DILEMMA / opportunity-cost — one plot, scarce materials, four true competing
needs (clinic/granary/shelter/wall), where every build un-builds three others and the district becomes
the sum of the choice (Frostpunk resource-law). The city-builder's CORE tension dramatized as a
narrative quest, teaching opportunity cost through persistent unmet-need states (no preaching, no correct
answer). Introduces the build-choice-with-persistent-costs mechanic + the reduced-scale compromise gamble.
Bible at 44; the act of building is now a moral quest, and what you DON'T build haunts the district too.
