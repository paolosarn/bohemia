# BOHEMIA — QUEST 001: "MOTHS AROUND THE LAST LIGHT"
Reference production build (the whole enchilada: script -> presentation -> engine).
Built to BOHEMIA_ADDENDUM_DIALOGUE_SCENE_PRODUCTION_SPEC_7_10_26.md. This is the
TEMPLATE every future quest is batched against. Tier-3 unmarked witness quest.
Seed origin: Quest Vault seed #2/Howard tradition (XXXV). Name from Paolo's catalog.

Design soul: the whole game's thesis in five quiet minutes — what do you owe the
people the system erased. No villain. Restraint is the weapon (no timer, no nag,
no score). Both routes exist but neither is combat-first; the world can still turn
on you. Payoff persists past the fold: the person is gone when an heir returns, but
what they left is written on the unrecorded ledger — the softest proof a life mattered.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_last_light
- tier: 3 (unmarked — no journal marker; discovered by walking near ETHAN)
- fold: available any generation; PAYOFF changes across the fold (see §7)
- entry_conditions: player enters the SPRINGS wash district within R=26 of ETHAN;
  time-of-day any; no prior condition (first-contact safe).
- faction_wires: HOMELESS (Ethan is unhoused), VOLUNTEERS (optional aid route).
- music_pool: TENSION at open -> resolves to a single-instrument TRIUMPH-adjacent
  lament ("EMBER VIGIL"-class) at the release. 120 BPM swaps only.
- ledger_writes: recorded[met_ethan]; UNRECORDED[freed_the_moths] (the boolean the
  player never sees flip — pays off a generation later, Whispering-Hillock law).
- amalgamation_thread: NONE. Deliberately clean — the soul quest carries no plot,
  only humanity. (Contrast makes the dread quests land harder — Yakuza whiplash.)

===============================================================================
## 2. CAST
===============================================================================
- ETHAN (id: ethan) — an unhoused former line-cook, ~60, laid off when the casino
  commissaries closed in the crash, then lost his wife the winter after. Keeps a
  cluster of salvaged solar lanterns ("the last light") burning in a dead
  storefront so "she can find her way back." He is dying (unstated; the player
  infers it — Howard restraint). Baked rig: worn skin palette #4, rag outfit #6.
  default_emotion: tired_warm. upbringing: n/a (NPC). faction: HOMELESS.
- THE PLAYER (dynasty member) — whatever generation/upbringing; upbringing gates
  two optional lines (see [MEDICINE], [TRADES] tags).
- (Route-dependent) TWO SCAVENGERS (id: scav_a, scav_b) — not villains; desperate,
  they want the lanterns' solar cells. They only appear on the WORLD-PRESSURE beat
  (§5) and can be talked down, paid, fled, or fought. faction: none (freelance).

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
HUB-AND-SPOKE for the conversation with Ethan (sit and let the player choose what
to ask, in any order — restraint, no railroad), with a single BRANCH-AND-BOTTLENECK
at the release beat. Optional WORLD-PRESSURE interrupt (the scavengers) can fire
once, mid-scene, per the Pacifist Path Law (the world isn't safe even here).

===============================================================================
## 4. THE NODE TREE (data layer — schema per spec Part A)
===============================================================================
Nodes are abbreviated JSON. speaker "eth"=Ethan, "PLR"=player choice hub.
emotion/gesture/camera/music tags drive presentation (§6). Conditions in [brackets].

--- ENTRY (fires when player halts within 2 tiles of Ethan; unmarked) ---
node open_01
  speaker: eth
  line: "Careful of the cords, friend. Lanterns don't like to be tripped."
  emotion: tired_warm   gesture: tend_lantern   camera: two_shot   music: {pool:TENSION, cue:soft_enter}
  onEnter: [ethan.face_player]   -> goto hub

--- HUB (spoke topics; any order; each returns to hub; restraint = no push) ---
node hub  (speaker: PLR — choice hub)
  camera: over_shoulder_player
  choices:
   - "Why keep them lit?"                -> spoke_light      [once]
   - "You been out here long?"           -> spoke_history    [once]
   - "[MEDICINE] You're not well."       -> spoke_med        [require skill.medicine>=2] [once]
   - "[TRADES] Those cells are failing." -> spoke_cells      [require skill.trades>=2] [once]
   - "Can I do anything?"                -> ask_release      [show after >=1 spoke seen]
   - "(Just sit with him.)"              -> sit_silence      [always]
   - "(Leave.)"                          -> END_leave

node spoke_light
  speaker: eth  emotion: wistful  gesture: look_to_lanterns  camera: closeup  music:{pool:TENSION,cue:duck}
  line: "My wife had no sense of direction. Ha. Forty years and she'd still lose
         the car. I keep 'em burning so if she's out there... she finds the door."
  -> goto hub
node spoke_history
  speaker: eth  emotion: flat_then_soft  gesture: none  camera: two_shot
  line: "Cooked the graveyard line at a place that don't exist no more. Twenty
         years. Then the tables went cold and so did the kitchens. Then so did she."
  micro_expression: swallow   -> goto hub
node spoke_med   [gated: MEDICINE]
  speaker: eth  emotion: caught_out  gesture: wave_off  camera: closeup  micro_expression: flinch
  line: "You got a healer's eye. Don't waste it on me. I know what's coming. I just
         want the lights on when it does."
  effect: reveal knowledge[ethan_dying]  -> goto hub
node spoke_cells   [gated: TRADES]
  speaker: eth  emotion: worried  gesture: touch_lantern  camera: closeup
  line: "You can hear it too? The hum's gone thin. Couple nights left in 'em, maybe.
         After that it's just me and the dark out here."
  effect: reveal knowledge[cells_failing]  -> goto hub

--- THE ASK (bottleneck; the small last request) ---
node ask_release
  speaker: eth  emotion: gathering_courage  gesture: steady_hands  camera: closeup  music:{pool:TENSION,cue:hold}
  line: "There is one thing. When the cells die... don't let 'em just flicker out.
         Take 'em up high — the old marquee — and let 'em all shine at once. One
         last time. Loud as morning. Then let 'em go. Will you?"
  -> goto release_choice

node release_choice  (speaker: PLR)
  camera: over_shoulder_player
  choices:
   - "I'll do it. (accept)"                    -> accept_01
   - "[TRADES] I can fix the cells instead."   -> fix_offer   [require skill.trades>=2]
   - "You should come with me. Volunteers can help." -> vol_offer  [always]
   - "(Say nothing. Nod.)"                     -> accept_01

--- ACCEPT / RELEASE (the beat the whole quest exists for) ---
node accept_01
  speaker: eth  emotion: relief_tears  gesture: grip_player_hand  camera: closeup  micro_expression: eyes_wet
  line: "...Thank you. Go on now. I'll watch from here."
  -> goto release_sequence

--- OPTIONAL FORKS off release_choice ---
node fix_offer  [TRADES]
  speaker: eth  emotion: gentle_refusal  camera: two_shot
  line: "Kind of you. But I don't want 'em to last. I want 'em to SHINE, then rest.
         Same as me. Take 'em up high. Please."
  -> goto release_choice   (loops back; fixing is honored as declined — the point
     is letting go, not preserving — Dead Money "begin again" in miniature.)
node vol_offer
  speaker: eth  emotion: soft_decline  camera: closeup
  line: "They came by. Good folks. But her door's HERE. I'm not leaving the door."
  effect: standing[VOLUNTEERS]+=2 if player later flags Ethan to them (offscreen)
  -> goto release_choice   (anti-savior beat — Majora Anju/Kafei: honor his wish,
     the 'save' you want isn't the one he wants.)

===============================================================================
## 5. WORLD-PRESSURE INTERRUPT (Pacifist Path Law — the world isn't safe)
===============================================================================
Fires ONCE, only if knowledge[cells_failing] is set and player accepted, as they
carry the lanterns to the marquee. Two scavengers move in for the solar cells.
This is where the quest can turn — but combat is NEVER required.

node scav_enter
  speaker: scav_a  emotion: hungry_wary  gesture: block_path  camera: wide  music:{pool:COMBAT,cue:swap}
  line: "Those cells. Hand 'em over and nobody's night gets worse."
  -> goto scav_choice

node scav_choice  (speaker: PLR)
  choices:
   - "[INTIMIDATE] These aren't worth dying for."  [require skill.intimidate>=3] -> scav_backdown
   - "Take these caps instead. (pay)"              [require currency>=cost]      -> scav_paid
   - "(Run — get the lanterns clear.)"             -> scav_flee   (RUN BUTTON / dodge minigame)
   - "(Draw.)"                                     -> scav_fight  (DEAD EYE DIAL)
node scav_backdown
  speaker: scav_a  emotion: cowed  camera: two_shot  music:{pool:TENSION,cue:resolve}
  line: "...Not worth it. C'mon." (they leave)  -> goto release_sequence
node scav_paid
  effect: currency-=cost; ledger[paid_scavs]  -> (they leave) -> goto release_sequence
node scav_flee
  -> DODGE/EVADE MINIGAME (pacifist). success -> release_sequence (lanterns intact).
     partial-fail -> lose 1 lantern (release still works, dimmer) -> release_sequence.
node scav_fight
  -> DEAD EYE DIAL. On resolve (lethal or non-lethal per player), -> release_sequence.
     NOTE: killing them writes UNRECORDED[blood_for_light] — the release is haunted;
     an heir later can learn two people died for a dead man's lanterns (Whispering
     Hillock hidden second consequence). No on-screen judgment (Megaton/Frostpunk:
     show, don't preach).

===============================================================================
## 6. PRESENTATION PASS (how it PLAYS — spec Part B, all four channels)
===============================================================================
FACE (face system + micro-expressions): emotion tags above map to FACS action-unit
  blends on Ethan's baked rig; the PORTRAIT frames his real face per RIG LAW.
  Key micro-expressions authored: swallow (spoke_history), flinch (spoke_med),
  eyes_wet (accept_01) — the involuntary tells that make him a person, not a
  quest-dispenser. Lip-sync procedural/phoneme-driven off each line.
BODY (skinner + scheduler): Ethan runs a TALK-IDLE loop the whole scene (heartbeat,
  120 BPM, in place — never a frozen mannequin). gesture tags fire RETURN one-shots
  over it (tend_lantern, look_to_lanterns, grip_player_hand) then fall back — exactly
  bohemia_scheduler.js ANIM.RETURN. No new anim tech.
CAMERA (thin framer over grid): two_shot for warmth, closeup for the gut-beats,
  wide for the scavenger threat. Cuts land on the beat. Actors never leave their
  grid tiles; camera only frames.
MUSIC (MUS pools on 120 clock): opens TENSION, DUCKS to near-silence under
  spoke_light (let the line breathe — Howard restraint), swaps to COMBAT only if
  scavengers draw, and at RELEASE (§8) blooms one lament instrument. Every swap
  quantized to the beat (120 BPM LAW).

===============================================================================
## 7. THE RELEASE SEQUENCE (the payoff — scripted beat, not a cutscene)
===============================================================================
node release_sequence
  camera: wide (the dead marquee) -> slow push
  music: {pool: LAMENT, cue: bloom_single_instrument}
  beats (each on the 120 grid):
   1. player places the lanterns on the marquee ledge (scheduler moves the carried
      props tile-by-tile; player input drives it — I move, you move).
   2. all lanterns brighten at once ("loud as morning") — a light bloom, no VO.
   3. hold. no timer, no prompt. the player may leave whenever. (RESTRAINT.)
   4. if the player lingers, a single beat: Ethan, tiny in the distance at his
      storefront, is still. The player is not told what it means. (Howard: the
      ambulance/empty-chair beat — inferred, never stated.)
  ledger_writes: recorded[freed_the_lanterns]; UNRECORDED[freed_the_moths]=true
  world_state: the marquee now glows at night for the rest of THIS generation
      (a small warm landmark — Dishonored world-state, but tender not grim).

===============================================================================
## 8. CONSEQUENCE ACROSS THE FOLD (why it outlives one life)
===============================================================================
- THIS generation: the marquee glows nightly; Ethan's storefront goes dark within
  a few in-game days (no announcement; a passerby line notes "old fella that kept
  the lights, haven't seen him").
- NEXT generation (heir returns to Springs): Ethan is long gone. IF UNRECORDED
  [freed_the_moths]==true, the marquee STILL glows — someone unknown keeps relighting
  it; an NPC says "been burning since before I was born, nobody knows who started
  it." The heir can learn (mindmap) it was their OWN blood. The softest proof a life
  mattered, paid back sideways, generations late (Whispering Hillock + Chrono Trigger
  testimony + NieR re-read, all in a tiny quest).
- IF the player killed the scavengers (UNRECORDED[blood_for_light]): the heir can
  also find the two scavengers' kin, who remember, and one door in the district is
  colder (Jaheira/BG3 body-count gating). The light is real; so is its cost.

===============================================================================
## 9. ROUTES SUMMARY (Pacifist Path Law compliance)
===============================================================================
- Fully pacifist path exists end to end: talk, [INTIMIDATE], pay, or FLEE/dodge the
  scavengers; never required to kill. Ethan's quest itself has zero combat.
- Lethal path exists (Dead Eye on the scavengers) but is the HARDER moral road —
  it haunts the payoff (Undertale mercy-is-harder inverted: here, mercy is also the
  clean-ledger road).
- Rewards diverge (Megaton law): pacifist -> clean unrecorded ledger + full-bright
  marquee + a Volunteers standing bump if flagged. Lethal -> haunted ledger + a
  colder district next gen. No path is "optimal"; they're different souls.

===============================================================================
## 10. ENGINE HOOKUP (spec Part D — no new tech)
===============================================================================
- This whole doc compiles to ONE scene JSON (nodes + tags + conditions + effects)
  consumed by the DIALOGUE RUNTIME state-machine module (to be added to the engine
  bundle; headless, node-testable like all modules).
- Conditions read: Core/Save, recorded+unrecorded ledger, faction standing, skills/
  upbringing, mindmap knowledge, fold gen. Effects write the same. All deterministic
  + save-through (fold determinism law) so it replays identically and survives the
  roguelite + the fold.
- Presentation tags consumed by EXISTING systems: face system + micro-expressions,
  skinner + scheduler (ANIM.RETURN/LOOP/TERMINAL), thin camera framer, MUS pools.
- GATE: a dialogue-tree test (no dead ends; every condition reachable; both routes
  resolve; every ledger/standing/skill/knowledge key referenced exists) joins the
  permanent gate suite.

===============================================================================
## 11. WHAT THIS PROVES
===============================================================================
A one-sentence seed ("a forgotten Vegas life, one small last request") is now a
complete, playable, engine-ready scene: hub-and-spoke dialogue with real branching,
skill/upbringing-gated lines, four parallel presentation channels (face/body/camera/
music) driven by systems Bohemia already has, a pacifist AND lethal route per law,
recorded + unrecorded ledger writes, and a fold payoff that makes a small life echo
across a century. THIS is the template. Every other seed is batched against it.
