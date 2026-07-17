# BOHEMIA — QUEST 017: "SOMEWHERE A FOUNTAIN STILL RUNS"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-016. Tier-3 TENDER, a child coping with loss (Vault #23 Time-Traveler's Kid +
tradition XXXV Howard restraint + Majora small-doomed-lives). Name from Paolo's
catalog. Third tender-tail (001 letting-go, 013 carrying-the-dead, now 017 a child's
grief) — and the first quest centered on a MINOR, handled with maximum care.

Design soul: a kid insists she can "go back" to before the crash split her family, and
asks the dynasty to help her fix it. There is no magic and no villain — only a child
metabolizing loss through a story, and a real, small, doable problem underneath (thugs
harassing her surviving parent). The player can't fix the past; they can protect the
present and let the kid keep her story without lying to her. The gentlest quest in the bible.

CHILD-SAFETY NOTE: Neva is a minor. Zero romantic/sexual content of any kind. No adult
isolates or grooms her; the quest's whole thrust is CONNECTING her to trusted adults
(her surviving parent, the Volunteers), never separating her. The dynasty's role is
protector and honest friend, full stop.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_fountain_runs
- tier: 3 (unmarked; triggered by finding NEVA at a dry public fountain, "fixing time")
- fold: how the dynasty treated Neva echoes — a later gen may meet her grown, steadier
  or harder depending on whether she was met with honesty and protection or dismissal.
- entry_conditions: player passes the dead PLAZA fountain where NEVA (~9) is
  "operating" it like a machine; her mother OONA is nearby, worn thin.
- faction_wires: VOLUNTEERS (child support), TRADES (Oona's work), MOB/CARTEL-lite
  (the small-time thugs shaking down Oona).
- music_pool: a soft MUSIC-BOX motif (childlike, a little sad); TENSION only at the
  thug confrontation; warm resolve at the end.
- ledger_writes: recorded[helped_neva]; UNRECORDED[told_her_the_truth_gently]=true or
  [played_along] or [dismissed_her].
- amalgamation_thread: NONE. Deliberately clean and human.

===============================================================================
## 2. CAST
===============================================================================
- NEVA (id: neva) — ~9, bright, stubborn, grieving. Her father didn't die in the crash;
  he LEFT (economic collapse split the family — he went east for work and never came
  back, or couldn't). Neva has decided the fountain is a "time machine" and if she gets
  it running she can go back to before he left. baked rig: child skin #1, patched dress.
  default_emotion: focused_bright -> (when pressed on the truth) fragile. faction: none.
- OONA (id: oona) — Neva's mother, working double shifts, being shaken down by local
  thugs for "protection," too exhausted to fight Neva's fantasy or the thugs.
  default_emotion: bone_tired_loving. faction: TRADES.
- RESK (id: resk) — a low-tier thug shaking down Oona's stall. A nuisance, not a boss.
  default_emotion: petty_greedy. faction: CARTEL-lite.
- DR. SAMA (id: sama) — VOLUNTEERS (RECURRING); can connect Neva to real grief support.
  default_emotion: warm_steady.
- THE PLAYER — [MEDICINE] (recognize grief-coping), [BARTER]/[INTIMIDATE] (the thugs),
  and a gentleness the game quietly rewards.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
HUB-AND-SPOKE (talk with Neva, learn from Oona, in any order) -> the REAL problem
(the thugs) as a small FORK -> a tender BRANCH on how to handle Neva's story (honesty /
play-along / redirect to support), none cruel by default. The "quest" resolves the
PRESENT (thugs, Oona) and the child's HEART (the story), not the impossible past.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- THE FOUNTAIN ---
node open_01
  speaker: neva  emotion: focused_bright  gesture: turn_an_imaginary_dial  camera: two_shot
  music:{pool:MUSICBOX,cue:soft_enter}
  line: "Shh — don't bump it, it's calibrating. This is a time fountain. When the water
         runs backwards it goes to BEFORE. I've almost got it. You look strong — can you
         help me turn the big valve? I have to get back to before Papa went east."
  -> goto hub

node hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "Tell me how the time fountain works."   -> spoke_fountain [once]
   - "Where's your papa now?"                  -> spoke_papa     [once]
   - "[MEDICINE] (Gently) The fountain can't really go back, can it."  -> spoke_truth [require skill.medicine>=2][once]
   - "(Talk to her mother, Oona.)"             -> oona_01        [once]
   - "(Help her turn the 'valve.')"            -> play_valve     (play along, opens tender routes)
node spoke_fountain
  speaker: neva  emotion: bright_certain  camera: closeup  micro_expression: too_quick_smile
  line: "Water remembers where it's been — that's SCIENCE. So if I make it run backward
         hard enough, it remembers all the way to when we were all here. Papa said water's
         the smartest thing in the desert. He'd KNOW if it was working. So I have to make
         it work so he'll come see."  -> goto hub
node spoke_papa
  speaker: neva  emotion: fragile_defiant  camera: closeup  micro_expression: chin_wobble
  line: "He went east for work when the money broke. He's coming back. He IS. Mama says
         'we'll see' but that's what she says when it's no. So I'm not ASKING her. I'm
         fixing it myself." -> goto hub
node spoke_truth  [MEDICINE — handle with care]
  speaker: neva  emotion: fragile  camera: closeup  micro_expression: eyes_fill
  line: "...You sound like Mama. Everybody KNOWS everything can't-be. I don't want it
         can't-be. I want ONE thing to be fixable. Just one. Is that so— " (she stops,
         chin trembling) "...you don't have to help. Nobody has to help."
  effect: knowledge[neva_knows_deep_down] (she half-knows — grief, not delusion); the
    game flags this as a moment to be GENTLE (dismissiveness here = the bad outcome)
  -> goto hub
node oona_01
  speaker: oona  emotion: bone_tired_loving  gesture: rub_temples  camera: two_shot
  line: "The fountain thing? Let her have it. Her dad went east eighteen months ago.
         Sends nothing. Says less. I can't tell her he's not coming — I can barely tell
         MYSELF. And now Resk and his boys are bleeding my stall dry for 'protection.'
         I don't have the fight left for the thugs AND my daughter's broken heart."
  effect: reveal knowledge[real_problem_is_thugs_and_grief]; two threads open: the
    THUGS (actionable now) and NEVA's HEART (tender)  -> goto hub

--- THE REAL PROBLEM: THE THUGS (small fork) ---
node thug_gate  (reachable from oona_01 or if the player seeks Resk)
  speaker: resk  emotion: petty_greedy  gesture: knock_stall_goods  camera: two_shot
  music:{pool:TENSION,cue:swap}
  line: "Rent day, mama. Same as every week. That new muscle you hired?" (nods at player)
         "He can watch or he can pay too."
  choices (PLR):
   - "[INTIMIDATE] (Make Resk find another stall.)"   -> thug_scare
   - "[BARTER] (Buy out Oona's 'debt' and end it.)"    -> thug_pay
   - "(Beat them off.)"                                 -> thug_fight
   - "(Set a trap so they stop coming back.)"          -> thug_trap [READ]
node thug_scare
  speaker: resk  emotion: reassessing  camera: closeup  micro_expression: step_back
  line: "...Whatever. Stall's not worth it. C'mon." (leaves — may send someone later if
    not permanently deterred)  effect: recorded[scared_resk]  -> goto tender_gate
node thug_pay
  effect: currency-=cost; Oona's stall freed for now; recorded[paid_off_resk]  -> goto tender_gate
node thug_fight
  effect: Dead Eye (they're weak); UNRECORDED[blood_at_the_stall]=true (Neva SEES it if
    present — handle: she's frightened; a gentler resolution is better for her); ->
    goto tender_gate
node thug_trap  [READ]
  effect: a clever bloodless deterrent (rig the stall, involve Remnants); recorded
    [outsmarted_resk]; the best resolution — safe AND no violence near the kid  -> goto tender_gate

--- NEVA'S HEART (the tender branch) ---
node tender_gate (speaker: PLR)  camera: closeup  music:{pool:MUSICBOX,cue:warm_low}
  choices:
   - "(Play along — help her 'run' the fountain one last time.)"     -> route_play
   - "(Gently honest — the fountain won't bring him, but you're not alone.)" -> route_honest
   - "(Connect her + Oona to Dr. Sama's grief support.)"             -> route_support
   - "(Give her a real, doable project instead — fix the fountain to RUN.)" -> route_rebuild
node route_play
  speaker: neva  emotion: hopeful_then_quiet  camera: closeup  micro_expression: slow_understanding
  line: "(you turn the valve together; the dry fountain stays dry) ...it didn't work.
         I did everything right and it didn't— " (a long pause; she looks at you, not
         crying, just SEEING) "...it's not really a time machine. Is it. ...I think I
         knew. I just wanted to build something on the day he left instead of just...
         being on it."
  effect: recorded[played_along]; UNRECORDED[let_her_arrive_at_it]=true; the gentlest
    truth — she reaches it herself (Howard restraint); she's sad but not shattered. -> goto neva_close
node route_honest  [gentle]
  speaker: neva  emotion: fragile_then_held  camera: closeup  micro_expression: tears_then_breath
  line: "...I know. I think I knew. I just didn't want a grown-up to SAY it and make it
         real. ...You said I'm not alone though. Do you mean that? Even though you can't
         fix it?" (she needs the second half more than the first)
  effect: recorded[told_her_gently]; UNRECORDED[told_her_the_truth_gently]=true; requires
    warmth — if delivered coldly (dismissed), routes to a worse fold echo. -> goto neva_close
node route_support
  speaker: sama  emotion: warm_steady  gesture: crouch_to_her_level  camera: two_shot
  line: "Hey. I lost people in the crash too. I run a little group — kids, grown-ups,
         we just... talk about the ones who aren't here. No fixing. Just not-alone.
         Want to come? Your mama too."
  effect: recorded[connected_to_support]; Neva + Oona enter real grief support (the
    healthiest outcome); standing[VOLUNTEERS]+; Neva may recur grown + steady. -> goto neva_close
node route_rebuild
  speaker: neva  emotion: kindling_purpose  camera: closeup  micro_expression: first_real_smile
  line: "...Make it run REAL water? Not backward, just... run? So the plaza has a
         fountain again?" (a project she CAN finish — grief into making)
  effect: recorded[gave_her_a_project]; the fountain is repaired (a plaza landmark
    persists — a child's monument, not to going back, but to going ON); Neva channels
    grief into building (the game's quiet thesis: you don't fix the past, you make
    something on top of it). standing[TRADES/COLORFUL]+.  -> goto neva_close
node neva_close
  speaker: oona  emotion: tearful_grateful  camera: two_shot  music:{pool:MUSICBOX,cue:warm_resolve}
  line: "I don't know what you said to her. She's still sad. But she came and ATE dinner
         tonight instead of sitting at that fountain till dark. That's... that's the most
         I've had in months. Thank you. Whoever you are. Thank you."
  effect: Oona + Neva become a warm recurring plaza presence; the quest resolves the
    PRESENT (thugs gone, dinner eaten) and the HEART (grief met honestly), never the
    impossible past. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- HONEST/SUPPORT/REBUILD: a later gen may meet Neva grown — steadier, maybe a Volunteer
  or a builder who "fixes things that can be fixed" (the lesson took). The repaired
  fountain persists as a plaza landmark (rebuild route).
- PLAY-ALONG: Neva grows up having reached the truth kindly, on her own — bittersweet,
  healthy.
- DISMISSED (cold honesty / ignored her): a harder Neva who learned grown-ups say
  can't-be and walk away; a colder recurring adult (the game's warning that HOW you tell
  a child the truth matters as much as the truth).
- The thugs' handling (bloodless vs blood-at-the-stall) also echoes — a kid who saw
  violence over her mother's stall carries it.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Neva is the whole quest — too_quick_smile, chin_wobble, eyes_fill, and the
  crucial slow_understanding / first_real_smile at resolution. Her micro-expressions
  must read as a CHILD half-knowing, never manipulated. Oona's bone-tired love.
  Procedural lip-sync (Neva's voice quick and bright, then small).
BODY: Neva "operates" the imaginary fountain (turn_an_imaginary_dial) — child-scale
  animation; Oona rubs temples; Resk knocks goods. The rebuild route shows the fountain
  actually flowing (a staged world-state change). Any violence handled AWAY from Neva
  where possible.
CAMERA: two_shots and crouch-to-her-level framing (adults meeting a child's eyeline —
  a deliberate warmth cue); closeups on Neva's face at the tender beats. Cuts gentle, on beat.
MUSIC: a soft MUSIC-BOX motif (childlike, sad-sweet); TENSION only at the thugs; warm
  resolve at dinner. The music-box is the quest's signature and never turns dark. 120 BPM.

===============================================================================
## 7. ROUTES + CHILD-SAFETY + REWARD DIVERGENCE
===============================================================================
- CHILD-SAFETY (reaffirmed): every route CONNECTS Neva to trusted adults (Oona, Sama);
  none isolates her. No romantic/sexual content. The dynasty is protector/honest friend.
  The healthiest routes (support/honest-with-warmth/rebuild) are the game's clear "good."
- Pacifist-completable: the thugs can be scared/paid/outsmarted; the heart-work is all
  dialogue. Blood near the child is possible but is the WORST-scored handling.
- Rewards diverge (Megaton law, tender register): the "reward" is who Neva becomes and a
  warm recurring family; the rebuild route adds a persistent plaza fountain. Cold
  dismissal costs a warmth and hardens her — kindness is mechanically the better play.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Child NPC uses child-scale rig + the crouch-to-eyeline
framing cue. Reads ledger/standing/skill/fold; writes same + a recurring family +
optional plaza-fountain landmark (rebuild). Deterministic + save-through. Gate: all
tender routes resolve, the thug fork resolves (bloodless preferred/flagged), the
gentle-vs-cold delivery of truth branches correctly to the fold echo, child-safety
invariants hold (no isolation route exists), fountain landmark persists. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-016)
Third tender-tail, and the first centered on a CHILD — grief metabolized through a
story, with no magic and no villain, resolved by fixing the PRESENT (thugs, a shared
dinner) and meeting the HEART honestly, never the impossible past. Proves the bible can
handle a minor with maximum care (connect-to-trusted-adults, never isolate) and land the
thesis "you don't fix the past, you make something on top of it" (the rebuild route's
flowing fountain). Bible at 17; the tender spine now has three faces of grief across
letting-go, carrying-the-dead, and a child's loss.
