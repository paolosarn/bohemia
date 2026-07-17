# BOHEMIA — QUEST 006: "THE QUARTERMASTER'S CUT"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-005. Tier-2 side quest, SCARCITY / TRIAGE economic (Vault Batch 01 #3 +
tradition XXXI Papers-Please "rules-correct = filthy" + XXVIII Dead-Money greed).
The bible's first quest where the three-currency ECONOMY is the moral engine.

Design soul: the system is the villain and you're its hand. A corrupt quartermaster
skims the district's medicine to sell it; but the "rules-correct" fix (turn him in)
collapses the supply chain he alone keeps limping, and people die of the cure being
cut off. No clean answer — scarcity forces you to show your values, the game never
scores it (Papers-Please / Fallout water-chip, made Bohemia).

===============================================================================
## 1. HEADER
===============================================================================
- id: q_quarter_cut
- tier: 2 (marked; unlocks when the player has any standing with TRADES or REMNANTS)
- fold: how the district's medicine supply is left (functioning-but-corrupt, clean-
  but-broken, or reformed) persists — an heir inherits the health of this district.
- entry_conditions: a medic (LEENA) flags a medicine shortfall; OR the player audits
  a TRADES depot and finds the books don't add up.
- faction_wires: TRADES (the guild that runs logistics), REMNANTS (they police it),
  VOLUNTEERS (they suffer the shortfall), CARAVANS (the real supply line).
- music_pool: TENSION; a cold ledger-tick motif under the audit scenes; no COMBAT
  unless the player forces it.
- ledger_writes: recorded[handled_contreras_*]; UNRECORDED[who_you_let_starve]=true
  (a boolean tracking which population lost medicine — pays off a generation late).
- amalgamation_thread: NONE (pure economic morality; keeps the curriculum clean).

===============================================================================
## 2. CAST
===============================================================================
- QUARTERMASTER DESH (id: desh) — TRADES logistics officer. Skims ~15% of the
  district's medicine and sells it to CARAVANS for parts. He is ALSO the only reason
  the supply line runs at all — he bribes, he improvises, he keeps the trucks moving.
  Corrupt AND load-bearing. default_emotion: tired_pragmatic. faction: TRADES.
- LT. FARROW (id: farrow) — REMNANTS officer who suspects Desh and wants him gone,
  by the book. Honest, rigid, does NOT grasp that removing Desh breaks the chain.
  default_emotion: righteous_flat. faction: REMNANTS.
- LEENA (id: leena) — VOLUNTEERS medic whose clinic is short on medicine NOW. The
  human face of the shortfall. default_emotion: exhausted_urgent. faction: VOLUNTEERS.
- THE PLAYER — [BARTER], [READ], [MEDICINE] gate key lines/routes.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
HUB-AND-SPOKE investigation (audit the books, hear all three sides in any order) ->
BRANCH-AND-BOTTLENECK resolution with FOUR terminal routes: TURN HIM IN (rules-
correct, chain breaks), LET HIM RUN IT (complicit, chain lives), REFORM (hardest —
fix the chain so Desh isn't needed), EXPOSE UPWARD (the system, not the man).

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- LEENA OPENS IT ---
node open_01
  speaker: leena  emotion: exhausted_urgent  gesture: empty_medbox  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "I'm rationing antivirals by lottery. LOTTERY. The manifests say full
         shipments came in. They didn't. Somebody's bleeding this district and I'm
         the one signing which kid doesn't get the dose."
  -> goto invest_hub

node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Audit the TRADES depot books.)"   -> audit    [once]
   - "(Talk to Desh, the quartermaster.)" -> desh_01  [once]
   - "(Talk to Lt. Farrow, REMNANTS.)"    -> farrow_01 [once]
   - "(Decide what to do.)"               -> resolve_gate [show after >=1 spoke]

--- THE AUDIT (the cold economic beat) ---
node audit
  speaker: PLR (internal)  camera: closeup_on_ledger  music:{pool:TENSION,cue:ledger_tick}
  line: "(The numbers are a confession. ~15% of every medicine shipment vanishes
         before it reaches a clinic. But the freight LOGS... every truck that still
         runs, runs because someone paid a bribe out of pocket. The theft and the
         supply are the same hand.)"
  effect: reveal knowledge[desh_skims] AND knowledge[desh_keeps_chain_alive]
    (BOTH — the trap: the corruption and the function are inseparable)  -> goto invest_hub

--- DESH (corrupt AND load-bearing) ---
node desh_01
  speaker: desh  emotion: tired_pragmatic  gesture: rub_eyes  camera: two_shot
  line: "You found the fifteen percent. Congratulations. Now find me a driver who'll
         cross Cartel road WITHOUT the parts I buy with it. The guild pays for
         paperwork, not for reality. I skim so the trucks ROLL. Turn me in and watch
         the whole line stop inside a week."
  choices (PLR):
   - "You're stealing medicine from a clinic."   -> desh_defend
   - "[READ] Some of that 15% isn't going to trucks." -> desh_read [require skill.read>=3]
   - "How much would it cost to run this clean?"  -> desh_reform_seed [BARTER path]
node desh_defend
  speaker: desh  emotion: bitter_honest  camera: closeup  micro_expression: jaw_flex
  line: "Every day. And every day the line runs and MORE people live than die. You
         want clean hands or you want the trucks? Pick one. I picked years ago."
  -> goto invest_hub
node desh_read  [READ]
  speaker: desh  emotion: caught  camera: closeup  micro_expression: eye_away
  line: "...Fine. A cut goes to me. I've got a family in Salt Lake I'm buying out of
         a Cartel debt. So yeah. I'm not a saint. I'm a man with a chain to run and
         a debt to clear. Judge away."
  effect: reveal knowledge[desh_skims_partly_for_self] (complicates but doesn't
    erase that he keeps the chain)  -> goto invest_hub
node desh_reform_seed  [opens REFORM route]
  speaker: desh  emotion: surprised_wary  camera: closeup
  line: "Run it clean? You'd need the guild to fund real bribes as line-items, a
         second driver, and someone to lean on the Caravans for a fair rate. Nobody's
         ever bothered. You bother, and maybe I don't have to steal. Maybe."
  effect: reveal knowledge[reform_is_possible]  -> goto invest_hub

--- FARROW (rules-correct, blind to the chain) ---
node farrow_01
  speaker: farrow  emotion: righteous_flat  gesture: hand_on_report  camera: two_shot
  line: "Desh is a thief. I have enough to detain him today. Give me your word and I
         move tonight. The law doesn't care how well a thief runs his route."
  choices (PLR):
   - "Detaining him breaks the supply line."  -> farrow_warn
   - "Do it. He's stealing medicine."          -> route_turnin (jump)
node farrow_warn
  speaker: farrow  emotion: uncomfortable_rigid  camera: closeup  micro_expression: brief_doubt
  line: "...That's not my department. My department is that he's a thief. If the line
         breaks, that's the guild's failure, not mine. ...Isn't it?"
  effect: reveal knowledge[farrow_wont_own_the_fallout]  -> goto invest_hub

--- RESOLUTION (four routes) ---
node resolve_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold}
  choices:
   - "(Turn Desh in to Farrow.)"                              -> route_turnin
   - "(Let Desh keep running it. Say nothing.)"               -> route_letrun
   - "[BARTER] (Reform the chain so no one has to steal.)" [require knowledge.reform_is_possible AND skill.barter>=3] -> route_reform
   - "(Expose the GUILD that underfunds the line — not Desh.)" [require knowledge.desh_keeps_chain_alive] -> route_expose

===============================================================================
## 5. THE FOUR ROUTES
===============================================================================
node route_turnin  (rules-correct — the chain breaks)
  speaker: farrow  emotion: grim_satisfaction  camera: two_shot  music:{pool:TENSION,cue:cold_resolve}
  line: "Good. He's done." (Desh is detained.)
  effect: recorded[turned_in_desh]; within an in-game week the supply line stumbles;
    Leena's clinic goes DARK on antivirals; UNRECORDED[who_you_let_starve]=VOLUNTEERS_ward.
    world_state: this district's medicine economy CRIPPLED for the generation.
    LESSON (unspoken): you did the correct thing and people died of it (Papers-Please).
  -> END
node route_letrun  (complicit — the chain lives, the theft continues)
  speaker: desh  emotion: tired_relief  camera: closeup
  line: "...Smart. The trucks roll. The clinic gets most of what it needs. Most.
         I'll sleep fine. Will you?"
  effect: recorded[shielded_desh]; the line keeps running; Leena stays ~80% supplied
    (rationing continues but nobody dies of a dry clinic); UNRECORDED[you_bought_the_
    skim]=true — a small ongoing theft you chose to allow (creeping normality, Frostpunk).
  -> END
node route_reform  [BARTER — the hardest, best road]
  speaker: PLR + desh + (offscreen) the guild
  camera: two_shot  music:{pool:TENSION,cue:warm_low}
  beats: THREE brokering beats — (1) pass a BARTER check to make the guild fund bribes
    as line-items, (2) secure a second driver (costs the dynasty resources/caps now),
    (3) lean on CARAVANS for a fair rate (standing or [INTIMIDATE]). All three ->
    the chain runs CLEAN; Desh has no reason to steal.
  effect: recorded[reformed_the_line]; UNRECORDED[fixed_it_right]=true; the district's
    medicine economy is HEALTHY for generations (best fold inheritance); costs the
    dynasty real resources upfront (Dead-Money: the right thing costs you now).
  -> END
node route_expose  [requires knowing Desh keeps the chain alive]
  speaker: PLR (to a district council / the guild)
  camera: three_shot  music:{pool:TENSION,cue:hold}
  line: "The thief isn't the problem. The GUILD that funds paperwork instead of trucks
         MADE the thief. Fund reality or keep making Deshes."
  effect: a LANDSMEET-style beat — provable (you have the audit) sways the council;
    the guild is shamed into partial funding. Desh is spared but demoted; the line
    runs semi-clean. recorded[exposed_the_guild]; UNRECORDED[named_the_system]=true.
    Partial win: better than turn-in, not as complete as reform. Points blame at the
    SYSTEM not the hand (the educational thesis, no preaching).  -> END

===============================================================================
## 6. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- TURN IN: an heir inherits a district with a broken medicine economy and a memory —
  "the year the clinic went dark." A cold, correct ruin. Farrow's rigidity is
  vindicated on paper and damned in life.
- LET RUN: the district limps on, corrupt but alive; an heir may find the skim grew
  (unchecked corruption compounds — the creeping-normality cost), or Desh long gone
  and the chain fragile.
- REFORM: an heir inherits a HEALTHY, clean supply line — a rare unambiguous good,
  bought with the prior generation's resources. The quiet best outcome.
- EXPOSE: the district runs semi-clean; the guild is warier; an heir inherits a
  functioning-but-watchful system and a precedent for naming institutions.
- In all cases UNRECORDED[who_you_let_starve] / [fixed_it_right] shapes the district's
  health and mood a generation late.

===============================================================================
## 7. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Desh's exhaustion (rub_eyes, jaw_flex, eye_away) sells corrupt-but-human;
  Farrow's brief_doubt is the crack in the rulebook; Leena's exhaustion is the stakes.
  Procedural lip-sync. Portraits carry the weight — nobody here is a cartoon.
BODY: talk-idle loops; gesture one-shots (empty_medbox, rub_eyes, hand_on_report).
  The audit is a UI/ledger closeup, not a talking head — the numbers ARE the beat.
CAMERA: closeup on the ledger for the audit (the cold economic gut-punch), two_shots
  for the three sides, three_shot for the expose. Cuts on beat.
MUSIC: TENSION with a cold LEDGER-TICK motif under the audit (money as dread); no
  COMBAT unless forced; warm_low on reform (the only route that earns warmth). 120 BPM.

===============================================================================
## 8. ROUTES + REWARD DIVERGENCE (Pacifist Path Law + Megaton law)
===============================================================================
- Zero combat required on ANY route; this is an economic/social quest by nature.
  (If the player attacks Desh or Farrow, Dead Eye applies, but it solves nothing and
  worsens the fold — the game doesn't reward it.)
- Rewards diverge HARD and none is "optimal": TURN IN = clean conscience + dead
  clinic; LET RUN = alive district + dirty hands; REFORM = healthy future + real cost
  now; EXPOSE = semi-clean + a named system. The three currencies (medicine especially)
  are the stakes throughout — this is the curriculum: infrastructure IS the lesson.
- The RULES-CORRECT choice is the WORST humanitarian outcome (Papers-Please). The
  game never tells you that. It just lets the clinic go dark.

===============================================================================
## 9. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Reads/writes the district ECONOMY state (medicine supply
%, corruption level) — the first quest to touch the economy sim directly. Conditions
read ledger/standing/skill/knowledge/economy/fold; effects write same. Deterministic +
save-through; the district health value persists across the fold. Gate: all four
routes reachable + resolve, the audit sets BOTH inseparable knowledge flags, economy
writes are legal, reform requires its three beats. Joins the permanent suite.

## 10. WHAT THIS PROVES (vs 001-005)
Sixth distinct engine: ECONOMY-as-morality. The three-currency system is the moral
device — a corrupt-but-load-bearing supply chain where the rules-correct fix kills
people, taught with zero preaching (Papers-Please + Fallout water-chip + Dead-Money).
First quest to touch the economy sim and leave a district's HEALTH as the fold
inheritance. The bible now covers: tender-tail, branching-moral, companion-succession,
core-mystery, release-valve tone, AND economic triage. Six engines, six for six.
