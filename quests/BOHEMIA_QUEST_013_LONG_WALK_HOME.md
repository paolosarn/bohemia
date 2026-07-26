# BOHEMIA — QUEST 013: "LONG WALK HOME"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-012. Tier-3 WITNESS/RECOVERY (Vault #2 Bring-Him-Home / NV "Final Plan for
Esteban" + tradition XXXV Howard restraint). Second tender-tail (after 001), tonally
distinct: 001 was letting-go; this is the weight of the dead and who's owed the walk.

Design soul: a small favor with a heavy body. A widow can't recover her husband's
remains from a ruin held by NeuroLinked homeless; the dynasty does the walk she can't.
No twist, no villain — just the labor of carrying the dead home in a world that stopped
having the room for it. The grief is the quest. Restraint scores it.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_long_walk_home
- tier: 3 (unmarked-leaning; given by a grieving widow at a district edge)
- fold: if done with care, the grave the dynasty helps make becomes a small tended
  site an heir can find; the widow's line remembers the family that walked.
- entry_conditions: player passes MRS. AGA HOLT near the OUTER-EAST ruins; she's been
  trying to hire someone for weeks and can't pay much.
- faction_wires: VOLUNTEERS (help the burial), HOMELESS (hold the ruin — the
  NeuroLinked, non-hostile unless provoked), CHURCH (rites).
- music_pool: a low LAMENT; a single held tone at the recovery; a warm resolve at a
  proper burial. No COMBAT loaded by default (violence is a failure here).
- ledger_writes: recorded[recovered_esrom]; UNRECORDED[you_carried_him]=true;
  standing[VOLUNTEERS]+ small.
- amalgamation_thread: MICRO — the ruin's NeuroLinked guardian can, if freed/talked,
  give a fragment clue (ties Q004/Q010) — optional, easily missed (Howard restraint).

===============================================================================
## 2. CAST
===============================================================================
- AGA HOLT (id: aga) — a widow, ~50, whose husband Esrom died scavenging cable in the
  OUTER-EAST ruins two weeks ago. The NCR-of-Bohemia (REMNANTS) won't retrieve a body
  from NeuroLinked territory; she can't go herself (bad leg, and she can't bear to see
  him like that). default_emotion: worn_dignified. faction: TRADES (small vendor).
- ESROM (id: esrom) — dead. Present as a body to recover and the man Aga describes. A
  gentle absence.
- THE WARDEN (id: warden) — a NeuroLinked homeless man wired to guard the ruin (like
  Mara/Q010, the sewer-demo sentinels). Not hostile if unprovoked; "guards" the dead
  as much as the living. default_emotion: patrolling_blank -> (lucid flicker) mournful.
- THE PLAYER — [MEDICINE] (recognize the implant / confirm cause of death), CHURCH
  standing (rites), HOMELESS standing (safe passage).

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
LINEAR-with-CHECKS spine (accept -> enter the ruin -> the warden gate -> recover ->
return), with a small resolution FORK on the warden (pass / free / fight) and on the
burial (proper rites / quiet / just deliver the body). Non-combat by default.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- AGA'S REQUEST ---
node open_01
  speaker: aga  emotion: worn_dignified  gesture: hold_folded_cloth  camera: two_shot
  music:{pool:LAMENT,cue:soft_enter}
  line: "You look like you can walk into a bad place and walk back out. My Esrom went
         into the east ruins for cable and didn't. The Remnants won't fetch a body out
         of hobo territory. I can't pay much. I can't— I can't go see him like that.
         But he shouldn't be LEFT there. Nobody should be left there. Will you bring
         him home?"
  choices (PLR):
   - "I'll bring him home."                 -> accept_01
   - "Tell me about him."                     -> spoke_esrom
   - "[MEDICINE] How do you know he's dead?"  -> spoke_med [require skill.medicine>=2]
node spoke_esrom
  speaker: aga  emotion: grief_warmed  camera: closeup  micro_expression: small_smile_then_break
  line: "Forty years a cable-man. Could splice anything, mend anything but his own
         knees. Hummed when he worked. I keep listening for it. House is too quiet to
         sleep in." -> goto accept_gate
node spoke_med  [MEDICINE]
  speaker: aga  emotion: flat_certain  camera: closeup
  line: "His partner made it back. Said Esrom went down and didn't get up and the...
         the guardian wouldn't let him drag Esrom out. So he's there. Two weeks. In
         this heat. I KNOW what that means. Bring me what's left. He gets a grave."
  effect: knowledge[esrom_confirmed_dead]  -> goto accept_gate
node accept_gate (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "I'll go now."           -> ruin_01
   - "(Ask the Volunteers to help with the burial first.)" -> vol_prep [standing]
node accept_01
  speaker: aga  emotion: relief_grief  camera: closeup  micro_expression: eyes_wet
  line: "...Thank you. Take this — his cloth. Wrap him in it. He'd want to go home in
         something of ours, not a Remnant tarp."
  effect: receive ESROM'S CLOTH (a burial item)  -> goto ruin_01

--- THE RUIN + THE WARDEN ---
node ruin_01
  speaker: PLR (internal)  camera: wide_ruin  music:{pool:LAMENT,cue:low}
  line: "(The east ruins. Cable-guts everywhere — Esrom's trade, his grave. And in the
         dark, something moving on a slow patrol. It hasn't seen you. Yet.)"
  -> goto warden_gate
node warden_gate
  speaker: warden  emotion: patrolling_blank  gesture: slow_turn_toward_you  camera: closeup
  music:{pool:LAMENT,cue:tense_hold}  micro_expression: implant_glow
  line: "Territory. Held. No taking. Nothing leaves. Nothing— " [a lucid flicker,
         looking at Esrom's body] "—he won't wake. I kept the birds off him. I keep them
         all off. Nobody comes for them. Did somebody come? Did somebody finally come?"
  -> goto warden_fork
node warden_fork (speaker: PLR)  camera: closeup
  choices:
   - "Someone came. His wife sent me. Let me take him home."  -> warden_pass [HOMELESS standing OR compassion line]
   - "[MEDICINE/TRADES] (Ease the implant so he'll let go.)"  -> warden_free [require skill.medicine>=2 OR skill.trades>=2]
   - "(Move past him for the body.)"                           -> warden_provoke
node warden_pass
  speaker: warden  emotion: mournful_lucid  camera: closeup  micro_expression: implant_dims
  line: "...Home. Yes. Take him home. Tell her— tell her he wasn't alone. I stayed. I
         stay with all of them. Somebody should." (he steps aside)
  effect: knowledge[warden_guards_the_dead]; UNRECORDED[the_warden_was_kind]=true;
    optional mindmap CLUE[network_left_sentinels_to_guard_nothing] (ties Q010) -> goto recover
node warden_free  [MEDICINE/TRADES]
  speaker: PLR + warden
  camera: closeup
  beats: easing the implant (non-lethal skill beat, dodge/evade if he resists, NOT Dead
    Eye). SUCCESS: the warden comes partly back to himself, grieves the strangers he's
    guarded for years, and can be sent to the Volunteers. FAIL: he retreats deeper,
    still guarding (sad non-resolution); the body is still recoverable.
  effect (success): mindmap CLUE[network_left_sentinels_to_guard_nothing]; UNRECORDED
    [freed_the_warden]=true; a second life brought out of the ruin.  -> goto recover
node warden_provoke
  speaker: warden  emotion: implant_seizes_hostile  camera: closeup  music:{pool:COMBAT,cue:swap}
  line: "NO TAKING. HELD. HELD—"
  effect: forces a fight (Dead Eye) OR flee; killing him works but writes UNRECORDED
    [killed_the_grave_keeper]=true — you killed the man who kept the birds off the dead.
    An heir can learn it. The avoidable, ugly road (the quest BEGGED you not to). -> goto recover

--- RECOVER + RETURN ---
node recover
  speaker: PLR (internal)  camera: closeup  music:{pool:LAMENT,cue:one_held_tone}
  line: "(You wrap Esrom in the cloth Aga gave you. He's light. Two weeks and the heat
         and he's so light. You carry him. It's a long walk. You take every step of it.)"
  beats: a SLOW carry back (grid traversal, no timer, no combat — the labor IS the
    beat, like 001's row and 008's crossing). The player bears the body the whole way.
  effect: recorded[recovered_esrom]; UNRECORDED[you_carried_him]=true  -> goto return_gate
node return_gate (speaker: PLR, to Aga)  camera: two_shot
  choices:
   - "(Deliver him with the Volunteers for proper rites.)" -> end_rites [standing/vol_prep]
   - "(Deliver him quietly. Let Aga decide.)"              -> end_quiet
   - "(Just hand over the body.)"                           -> end_plain
node end_rites
  speaker: aga  emotion: broken_grateful  camera: closeup  micro_expression: crumple_then_steady
  line: "...You brought him home. And you brought people to stand for him. Forty years
         and I thought he'd go into the dirt with nobody. Look at this. Look who came.
         ...Thank you. Come by. There'll always be a plate for the one who walked."
  effect: a small burial scene (Volunteers/Church); a tended grave persists; standing
    [VOLUNTEERS]+; Aga becomes a warm recurring vendor/ally. -> END
node end_quiet
  speaker: aga  emotion: quiet_shattered_grateful  camera: closeup
  line: "Just us, then. That's right. That's how he'd want it. ...You didn't have to
         take the whole walk. But you did. I won't forget the family that did."
  effect: recorded[quiet_burial]; a private grave; Aga's line remembers the dynasty. -> END
node end_plain
  speaker: aga  emotion: grief_flat  camera: closeup
  line: "...Thank you. That's — that's him. Okay. Okay. You can go."
  effect: the body's home but the dynasty gave only the labor, not the tenderness;
    still honorable, less warmth banked. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- RITES/QUIET: a tended grave in the east; an heir can find it, and Aga's descendants
  (or Aga, if the gen is close) remember "the family that walked." A small, warm,
  permanent good.
- WARDEN FREED: a second person out of the ruin + a Reconstruction clue; the ruin is
  a little less haunted next gen.
- WARDEN KILLED: an heir can learn the dynasty killed the man who guarded the dead — a
  quiet stain the quest openly warned against.
- The east ruins' character (haunted / eased) shifts by how the warden was handled.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Aga's dignified grief (small_smile_then_break, crumple_then_steady) carries the
  quest; the warden's blank patrol cracking to mournful lucidity (implant_glow/dims,
  via the universal damage-reveal engine) rhymes with Mara (Q010) — the Network's
  abandoned sentinels are becoming a visual motif. Procedural lip-sync.
BODY: the CARRY is the signature body beat — the player bears Esrom's wrapped body in a
  slow grid traversal (a carry animation, no combat). The warden's slow_turn patrol.
  No breathe-loop on the body (the dead don't sway — like the statue's locked idle, but
  grief not comedy).
CAMERA: two_shots with Aga, wide_ruin for the approach, closeup on the warden's lucid
  break, and a long unhurried follow on the carry home. Cuts sparse, on the beat.
MUSIC: LAMENT baseline; one held tone at the recovery/carry; warm resolve ONLY at a
  proper burial; COMBAT loads only if the warden is provoked (the music tells you you've
  gone wrong). 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Howard restraint)
===============================================================================
- Non-combat by design; the warden is passable by compassion or skill; combat is the
  FAILURE road the quest explicitly discourages (and the music punishes). Fully
  pacifist-completable.
- Rewards diverge softly (Megaton law, tender register): RITES = a tended grave + a warm
  ally + Volunteers standing; QUIET = a remembered private burial; PLAIN = honor without
  warmth; WARDEN-FREED = a saved life + a clue; WARDEN-KILLED = a quiet stain. The "pay"
  is almost nothing in caps — the reward is what you become by walking.
- Pairs with 001 and 008 as the bible's TENDER-TAIL spine: letting-go (001), a dying
  man's dream (008), and now carrying the dead home (013). Three faces of grief, none
  the same.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Reuses the universal damage-reveal (warden cybernetics) and
the slow-labor traversal (the carry, kin to 001's row / 008's crossing). Reads ledger/
standing/skill/knowledge/fold; writes same + a tended-grave landmark + optional
Reconstruction clue. Deterministic + save-through. Gate: warden pass/free/provoke all
resolve (free's success+fail non-lethal), the carry traversal completes, burial variants
resolve, grave landmark + clue persist, provoke path correctly flagged as discouraged.
Joins the suite.

## 9. WHAT THIS PROVES (vs 001-012)
Deepens the TENDER-TAIL vein with a second, distinct grief quest — not letting-go (001)
but the LABOR of carrying the dead home, with a NeuroLinked grave-keeper who rhymes with
the contract's Mara (010) to build the "abandoned sentinel" motif. Proves the bible can
run a quest whose entire mechanic is a slow, non-combat walk with a body, scored like a
funeral, and leave a tended grave to the fold. 13 quests; the tender spine now has three
non-repeating faces of grief.
