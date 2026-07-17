# BOHEMIA — QUEST 003: "WHAT THE ASHES REMEMBER"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= QUEST_001/002. Tier-2 LOYALTY reckoning (Vault Batch 05 / ME2 loyalty tradition +
Betsy trauma shape). Name from Paolo's catalog tone. This one feeds SUCCESSION.

Design soul: a companion frozen by trauma the crash left in them. The quest earns
LOYALTY, and loyalty determines who survives the generational fold-climax (ME2
Suicide Mission prep). Non-combat core. The lesson: healing is harder than revenge,
and who you invest in is who survives.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_ashes_remember
- tier: 2 (companion loyalty quest; gated behind recruiting NADIA + 1 shared mission)
- fold: earning loyalty here raises NADIA's survival odds at the generation's climax;
  status carries to the heir (a loyal companion may become an heir's mentor).
- entry_conditions: NADIA recruited; player has completed >=1 mission with her;
  a squadmate (RILEY) flags the player that "Nadia's not sleeping."
- faction_wires: REMNANTS (Nadia is ex-security); CARTEL (the trauma's source);
  VOLUNTEERS (the healing route's ally).
- music_pool: TENSION; drops to near-silence in the confession; a warm resolve tone
  if she heals, a cold flat tone if she's aimed at revenge instead.
- ledger_writes: recorded[nadia_loyalty]; UNRECORDED[nadia_healed] OR [nadia_hardened]
  (which one flips changes who she becomes across the fold).
- amalgamation_thread: NONE (a human wound; contrast keeps the dread quests sharp).

===============================================================================
## 2. CAST
===============================================================================
- NADIA VOSS (id: nadia) — ex-REMNANTS security, froze during a Cartel raid that
  killed people she was meant to protect; carries it as rage she can't aim. Sharp,
  loyal, brittle under the surface. baked rig: skin #3, REMNANTS-worn outfit.
  default_emotion: coiled_flat. faction: REMNANTS.
- RILEY (id: riley) — a squadmate who cares; opens the quest. default_emotion: worried.
- DR. SAMA (id: sama) — a VOLUNTEERS medic who runs a quiet trauma circle. Offers the
  healing route. default_emotion: calm_open.
- THE PLAYER — upbringing gates [MEDICINE] and [REMNANTS-kin] empathy lines.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
PARALLEL TRACKS (a trust meter with Nadia rises/falls through the scene) feeding a
BRANCH-AND-BOTTLENECK resolution: HEAL (harder, needs trust + the right lines) vs
AIM (easier, darker — point her rage at the Cartel raider who broke her).

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- RILEY OPENS IT ---
node open_01
  speaker: riley  emotion: worried  gesture: glance_at_nadia  camera: two_shot  music:{pool:TENSION,cue:soft_enter}
  line: "She sits up all night cleaning a rifle that's already clean. Talk to her.
         She won't hear it from me."
  -> goto approach

--- APPROACH NADIA (trust meter starts) ---
node approach (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "Riley's worried. So am I."             -> n_deflect   [trust +0]
   - "[REMNANTS-kin] I know the look. I've worn it." -> n_open [require upbringing.remnants] [trust +2]
   - "You're no good to anyone tired."       -> n_cold      [trust -1]
node n_deflect
  speaker: nadia  emotion: coiled_flat  gesture: keep_cleaning  camera: closeup  micro_expression: jaw_tight
  line: "I'm fine. Gun's not gonna clean itself."  -> goto approach2
node n_cold
  speaker: nadia  emotion: flash_anger  camera: closeup  micro_expression: nostril_flare
  line: "Don't. Just... don't." (trust -1) -> goto approach2
node n_open  [REMNANTS-kin]
  speaker: nadia  emotion: cracked_surprise  camera: closeup  micro_expression: eyes_down
  line: "...Then you know it doesn't wash off. I keep it clean 'cause it's the one
         thing I didn't fail." (trust +2) -> goto confession_gate

node approach2 (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "What happened out there?"          -> confession_gate [trust >=1 -> she talks; else n_shut]
   - "(Sit. Don't push.)"                -> sit_wait  (Howard restraint: +1 trust, opens confession)
   - "(Leave her be for now.)"           -> END_soft  (can return later; no penalty)

--- THE CONFESSION (the core; music ducks; restraint) ---
node confession_gate  [requires trust>=1]
  speaker: nadia  emotion: hollow  gesture: set_rifle_down  camera: closeup  music:{pool:TENSION,cue:duck_to_silence}
  line: "Cartel came through the McCarran block. My post. I froze. Not for a
         second — for the WHOLE thing. When I moved again, the people I was standing
         for were already... I didn't earn this uniform. I just kept it."
  micro_expression: swallow  effect: reveal knowledge[nadia_froze]  -> goto resolve_gate

--- RESOLUTION (bottleneck fork) ---
node resolve_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold}
  choices:
   - "Freezing isn't failing. Come meet someone who can help." [require trust>=2] -> heal_01
   - "[MEDICINE] What you have is an injury. It heals. I'll walk you there."      [require skill.medicine>=2] -> heal_01
   - "The one who did this — I know where he is. We end it."   -> aim_01
   - "(Say nothing. Just be there.)"                            -> heal_soft [require trust>=3]

===============================================================================
## 5. HEAL ROUTE (harder — needs trust; the better road)
===============================================================================
node heal_01
  speaker: sama  emotion: calm_open  gesture: offer_seat  camera: two_shot  music:{pool:TENSION,cue:warm_low}
  line: "You don't have to talk. You just have to keep coming back. That's the
         whole ask. The rest is time."
  -> goto heal_beats
node heal_beats
  beats (across in-game days — uses the fold/time, not a cutscene): Nadia attends
    Sama's circle 3x; the player can accompany or not; each visit a short exchange
    that raises trust. On the 3rd, Nadia sleeps a full night for the first time.
  effect: ledger UNRECORDED[nadia_healed]=true; recorded[nadia_loyalty]=LOYAL
  reward: Nadia unlocks a STEADY-HANDS ability (a combat/utility perk) AND her
    fold survival odds rise; if she survives, she can become an heir's MENTOR.
node heal_close
  speaker: nadia  emotion: quiet_steady  camera: closeup  micro_expression: small_breath
  line: "Still not clean. But I slept. First time since. ...Thank you for not
         letting me point it at somebody just to feel it stop."
  -> END (LOYAL, healed)

node heal_soft  [trust>=3]  (the wordless route — Howard restraint pays off)
  speaker: nadia  emotion: undone_grateful  camera: closeup  micro_expression: eyes_wet
  line: "You didn't try to fix me. You just stayed. ...Okay. Okay. I'll go see Sama."
  -> goto heal_01

===============================================================================
## 6. AIM ROUTE (easier — darker; the revenge road)
===============================================================================
node aim_01
  speaker: nadia  emotion: dangerous_focus  gesture: pick_rifle_back_up  camera: closeup  music:{pool:COMBAT,cue:cold_swap}
  line: "...Yeah. Yeah. Give me a door and a name. I'll stop feeling it my way."
  -> goto aim_hunt
node aim_hunt
  beats: track the Cartel raider (RUSCO) to a Strip-edge den. Confrontation offers
    Dead Eye (lethal) OR a pacifist disarm-and-turn-him-in (harder). Nadia will kill
    him if the player lets her.
  effect (if Nadia kills): ledger UNRECORDED[nadia_hardened]=true; recorded
    [nadia_loyalty]=LOYAL (she's loyal to YOU — you gave her the kill) but changed.
  reward: Nadia unlocks a RUTHLESS ability (higher damage, no de-escalation) AND
    survives the fold, but as a colder person — as an heir's mentor she teaches
    vengeance, not steadiness (the fold inherits WHO she became).
node aim_close
  speaker: nadia  emotion: empty_calm  camera: closeup  micro_expression: flat_stare
  line: "It stopped. For a second. ...It'll come back, won't it. Whatever. I'm with
         you. Point me at the next one."
  -> END (LOYAL, hardened)

===============================================================================
## 7. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- HEALED: Nadia's survival odds at the generation-climax are high; if she lives she
  becomes an heir's MENTOR who teaches steadiness — a warmer next generation. The
  unrecorded[nadia_healed] boolean seeds a kinder dynasty.
- HARDENED: also loyal, also likely survives, but as a mentor she breeds vengeance;
  an heir raised by her gets the RUTHLESS upbringing tag (which later GATES darker
  dialogue — Pentiment upbringing-gate). You made her survive; you also made her
  colder, and it echoes down the bloodline.
- IGNORED/failed trust: Nadia stays disloyal; at the fold-climax she is far likelier
  to DIE (ME2 loyalty = survival). An heir finds only her clean rifle and a note.

===============================================================================
## 8. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Nadia's arc is written in micro-expressions — jaw_tight (deflect), nostril_flare
  (anger), eyes_down (opening), swallow (confession), and the payoff: small_breath +
  eyes_wet (heal) vs flat_stare (hardened). The FACE is the whole quest. Procedural
  lip-sync per line.
BODY: talk-idle loop; gesture RETURN one-shots (keep_cleaning, set_rifle_down,
  pick_rifle_back_up) — the rifle IS the prop that tells her state. Aim route hands
  to Dead Eye or the pacifist disarm.
CAMERA: closeups dominate (this is an intimate quest); two_shots for Riley/Sama;
  cuts on beat. The confession holds on her face in silence.
MUSIC: TENSION -> DUCK TO SILENCE for the confession (let it breathe) -> warm resolve
  (heal) or cold swap (aim). 120 BPM swaps.

===============================================================================
## 9. ROUTES + REWARD DIVERGENCE
===============================================================================
- Non-combat core; fully pacifist-completable (heal route has zero combat; aim route
  can end in a pacifist disarm). Combat only if the player/Nadia choose it.
- Rewards diverge (Megaton law): HEAL = steady-hands perk + warm mentor + kind heir;
  AIM = ruthless perk + cold mentor + hardened heir. Both grant loyalty + survival;
  they grant a different PERSON. The choice is who Nadia becomes, not whether she wins.
- HEAL is the harder road (Undertale mercy-is-harder): needs built trust + the right
  lines; revenge is always available and easier.

===============================================================================
## 10. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. The TRUST METER is a parallel-track variable saved on
the companion record; conditions read it plus ledger/skill/upbringing/fold. Loyalty
+ survival-odds write to the companion's fold-climax record (ME2 Suicide-Mission
shape). Deterministic + save-through. Gate: trust thresholds reachable, both routes
resolve, loyalty+survival flags set correctly, upbringing-echo to heir wired. Joins
the permanent suite.

## 11. WHAT THIS PROVES (vs 001/002)
Third distinct engine: a companion LOYALTY reckoning with a parallel-track trust
meter, a non-combat intimate core, and a resolution that doesn't change WHETHER she's
loyal but WHO she becomes — carrying that person into the fold as a mentor who shapes
the next heir's upbringing. This is the Succession System's quest spine, proven. The
bible now spans tender-tail, branching-moral, and companion-succession shapes.
