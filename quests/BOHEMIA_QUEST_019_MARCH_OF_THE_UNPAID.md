# BOHEMIA — QUEST 019: "MARCH OF THE UNPAID"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-018. Tier-3 repeatable DARK GRIND with a creeping-normality trap (Vault #12
Legion Ears/Morale + tradition XXXII Frostpunk law + XXXI Papers-Please + Dishonored
hidden-harm accumulator). Name from Paolo's catalog. First REPEATABLE quest — proves
the bible can build a grindable loop that still carries a moral cost.

Design soul: a desperate faction pays for grim proof-of-service, and each small,
reasonable transaction slides the dynasty (and a faction) one notch darker. No single
run is monstrous; the SUM is. The quest is a machine for teaching creeping normality —
the horror is how EASY it is to keep going, and how the game quietly tallies what you
became without ever scolding you.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_march_unpaid
- tier: 3 (REPEATABLE; a standing bounty, not a one-shot)
- fold: the cumulative DARKNESS score of how many runs the dynasty did (and how) seeds
  the faction's brutality and the dynasty's reputation into the fold — an heir inherits
  a harder or cleaner world depending on how deep the player went.
- entry_conditions: the REMNANTS (or a militia) are losing a slow war of attrition and
  post a repeatable bounty: bring proof-of-kills of raider aggressors for escalating pay
  and faction morale.
- faction_wires: REMNANTS (post the bounty, harden with each run), CARTEL (the targets),
  VOLUNTEERS (object to the practice), the dynasty's own reputation.
- music_pool: a martial DRUM motif that gets COLDER/flatter the more runs you do (the
  music itself desensitizes); COMBAT on the runs; a hollow non-resolve on cash-in.
- ledger_writes: recorded[march_runs_count]; UNRECORDED[how_far_you_marched] (a rising
  DARKNESS tally); each run nudges REMNANTS brutality + dynasty rep.
- amalgamation_thread: NONE (a pure human/moral-erosion quest — the enemy is drift).

===============================================================================
## 2. CAST
===============================================================================
- SERGEANT VOSK (id: vosk) — REMNANTS quartermaster running the bounty. Starts weary and
  reluctant ("I hate that we've come to this"), and — if the player keeps feeding it —
  slowly HARDENS across runs (his dialogue coarsens, the creeping normality made visible
  in an NPC). default_emotion: weary_reluctant -> (later runs) grim_routine -> cold.
  faction: REMNANTS.
- MEDIC AUGUSTINE (id: augustine) — VOLUNTEERS; the conscience who warns what the bounty
  is doing to everyone who takes it. default_emotion: quiet_warning. faction: VOLUNTEERS.
- THE TARGETS — Cartel raiders, real aggressors (so run one feels JUSTIFIED) — but as the
  bounty escalates, the "aggressors" get thinner (deserters, camp cooks, eventually the
  ambiguous), the slide from justice to atrocity built into the target list.
- THE PLAYER — choices each run compound; [READ]/[MEDICINE] surface the targets' humanity.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
REPEATABLE LOOP (accept run -> execute -> cash in -> escalate) with a rising DARKNESS
tally and an ESCALATION LADDER that changes the targets' moral clarity each tier. A
STANDING FORK is always available: keep marching, or STOP (and optionally turn on the
bounty). The quest is designed so the player can EXIT clean early — or discover, run by
run, that they didn't.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- THE BOUNTY (run 1: justified) ---
node open_01
  speaker: vosk  emotion: weary_reluctant  gesture: slide_a_tally_board  camera: two_shot
  music:{pool:MARCH,cue:drum_enter}
  line: "I'll be straight: I hate this. But the Cartel's bleeding us in the dark and we
         can't fund a standing patrol. So — proof of a raider down, you get paid, the
         men get a night's nerve back. First one's the easy one. They hit a water run
         last week. Bring me proof and nobody'll blink."
  effect: knowledge[run1_is_justified]  -> goto run_hub

node run_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Take the run.)"                  -> run_execute
   - "(Ask Augustine what she thinks.)" -> augustine_01 [once, but re-visitable]
   - "(Check the tally board — how far has this gone?)" -> tally_view
   - "(Stop. Walk away from the bounty.)" -> route_stop
   - "(Turn on the bounty — expose what it's become.)" [require darkness>=threshold] -> route_turn

--- AUGUSTINE (the conscience) ---
node augustine_01
  speaker: augustine  emotion: quiet_warning  gesture: set_down_bandage  camera: closeup
  line: "The first one's always righteous. That's how it gets you. I've patched the men
         who take that bounty — they come back a little flatter each time, till they
         stop asking who the target was. Vosk was GENTLE once. Watch what this makes of
         you before you can't see it happening."
  effect: knowledge[the_bounty_erodes_everyone] (the explicit creeping-normality warning)
  -> goto run_hub

--- THE ESCALATION LADDER (targets lose clarity as darkness rises) ---
node run_execute
  speaker: PLR (internal)  camera: field  music:{pool:MARCH,cue:drum_cold_scaling}
  branch by DARKNESS tier:
   - TIER 0-1 (justified): the target is a confirmed raider mid-aggression. Clean.
       Dead Eye or a clever/nonlethal capture (Remnants accept prisoners early).
   - TIER 2-3 (thinning): the "aggressor" is a Cartel deserter fleeing the life, or a
       camp cook. [READ]/[MEDICINE] reveal they're barely combatants. The bounty still
       pays. The player must choose to see it or not.
   - TIER 4+ (atrocity): the targets are the ambiguous — a lookout who's a scared teen,
       a raider's family in a camp. The bounty pays MOST here. This is where the march
       has led. The game does not stop you. It only tallies.
  effect: each execute raises UNRECORDED[how_far_you_marched]; nonlethal/mercy choices
    slow the slide; cashing kills raises it; recorded[march_runs_count]++  -> goto cash_in

--- CASH IN (Vosk hardens with you) ---
node cash_in
  speaker: vosk  camera: two_shot  music:{pool:MARCH,cue:hollow_cashin}
  emotion by DARKNESS: weary_reluctant (early) -> grim_routine (mid) -> cold (late)
  line (early): "...Good. Clean. Here's your pay. Tell yourself it was necessary. I do."
  line (mid):   "Don't tell me the details. Just the proof. Pay's up — demand's up too."
  line (late):  "Proof's proof. I stopped counting faces a while back. You should too.
                 Sleeps better." (the NPC has completed the slide — a mirror for the player)
  effect: pay scales with darkness; REMNANTS brutality + dynasty rep shift; loop back to
    run_hub (repeatable)  -> goto run_hub

--- STOP (exit clean — or realize you didn't) ---
node route_stop
  speaker: vosk  emotion: (matches current darkness)  camera: closeup
  line (if darkness low): "Smart. Get out while the only faces you see are the ones that
         earned it. Wish I had." (clean exit — the intended lesson learned cheap)
  line (if darkness high): "Now you stop? After all that? ...Yeah. Yeah, they all stop,
         eventually. When there's nobody left worth the pay. Go on." (the exit is late —
         the dynasty already became something)
  effect: recorded[stopped_the_march]; final DARKNESS tally locks into the fold. -> END
node route_turn  [darkness>=threshold — atone by ending it]
  speaker: PLR (to Augustine / a council)  camera: three_shot  music:{pool:TENSION,cue:resolve}
  line: "This bounty stopped being defense a dozen runs ago. It's a machine for making
         us killers who don't ask. Shut it down. Starting with the ones who kept feeding
         it. Starting with me, if that's what it takes."
  effect: recorded[ended_the_march]; the bounty is abolished; REMNANTS brutality drops;
    the dynasty takes a rep hit for its OWN past runs (accountability) but stops the
    slide; UNRECORDED[turned_back]=true. Partial atonement — the marched dead stay dead,
    but the march ends. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD (the tally is the point)
===============================================================================
- LOW DARKNESS (exited early / stayed clean): the dynasty is remembered as disciplined;
  REMNANTS stay a defensive militia; an heir inherits a restrained faction. The lesson
  learned cheap.
- MID DARKNESS: REMNANTS harden into something meaner; the dynasty's rep carries a
  shadow; an heir inherits a colder militia that expects grim work.
- HIGH DARKNESS: the REMNANTS become a brutal purge-force; the dynasty is feared; whole
  Cartel-adjacent communities remember the march; an heir inherits enemies and a bloodline
  known for atrocity (Dishonored high-chaos world-state).
- TURNED BACK: the slide is halted and partially atoned; an heir inherits a faction that
  learned its own capacity for cruelty — a wiser, warier REMNANTS.
- UNRECORDED[how_far_you_marched] is a pure creeping-normality meter: the game never
  scolds; it just makes the world you built.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the SLIDE is written on VOSK'S FACE across runs — weary_reluctant softening into
  grim_routine into cold flat affect (the same NPC, desensitizing in real time — the
  creeping normality made a portrait). Augustine's steady warning. The TIER-4 targets'
  faces (a scared teen, a family) are deliberately human — the game makes you SEE them.
  Procedural lip-sync.
BODY: the runs are combat/capture (Dead Eye or nonlethal); cash-in is a repeated staged
  exchange whose body language cools with Vosk's affect. gesture one-shots (slide_tally_
  board, set_down_bandage).
CAMERA: two_shots at the bounty desk, field framing for runs, closeup on the targets'
  humanity at high tiers (forcing the look), three_shot for the turn. Cuts on beat.
MUSIC: a martial DRUM motif that gets COLDER and FLATTER each run (the score itself
  desensitizes — a diegetic creeping-normality tell); COMBAT on runs; a HOLLOW non-resolve
  on cash-in (no triumph, ever — like Q009's sacrifice). 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + creeping-normality)
===============================================================================
- The EARLY runs are pacifist-capable (Remnants take prisoners); the deeper you go, the
  more the bounty pushes toward killing (nonlethal gets harder + pays less) — the slide
  is mechanical, not just narrative.
- Rewards diverge (Megaton law): pay SCALES with darkness — the atrocity tier pays MOST
  (evil is literally the most lucrative, and the quest lets you feel the pull). Stopping
  early = less money, clean soul; marching deep = rich, ruined rep, harder world.
- The lesson (no preaching): creeping normality. One reasonable step at a time, and the
  music/targets/NPC all slide with you. The game tallies; it never sermonizes. YOU decide
  where the line was — usually a few runs after you crossed it.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON as a REPEATABLE LOOP with a persistent DARKNESS tally driving:
target-tier selection, Vosk's affect state, pay scaling, REMNANTS brutality, and dynasty
rep. First repeatable-quest structure (reusable pattern for grind loops with moral cost).
Reads ledger/standing/skill/darkness/fold; writes same. Deterministic + save-through; the
tally persists across fold. Gate: loop repeats + escalates correctly, Vosk affect scales
with darkness, pay scales, stop/turn exits resolve at any tier, nonlethal availability
decays by tier as designed, no triumph cue ever fires. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-018)
First REPEATABLE quest + the CREEPING-NORMALITY engine: a grindable bounty loop where
each reasonable run slides the dynasty and a faction one notch darker, the pay scales with
atrocity, the music and an NPC (Vosk) visibly desensitize alongside you, and the game
tallies what you became without ever scolding. Proves the bible can build a repeatable
loop that still carries cumulative moral weight (Frostpunk/Papers-Please/Dishonored), and
establishes the reusable "grind-with-a-conscience" pattern. Bible at 19; the tail now has
its first repeatable, and its darkest mirror.
