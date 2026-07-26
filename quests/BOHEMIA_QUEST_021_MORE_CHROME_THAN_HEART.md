# BOHEMIA — QUEST 021: "MORE CHROME THAN HEART"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-020. Tier-2 AUGMENTATION-COST tragedy (Vault #27 More Chrome Than Heart /
Cyberpunk Lizzy-Wizzy + tradition on the price of escaping pain). Name from Paolo's
catalog tone. Surfaces the MUSIC (the subject is a performer) and threads NeuroLink/
augmentation lore without being an Amalgamation-mystery quest — it's about a PERSON.

Design soul: the price of not feeling. A beloved performer replaced so much of herself
with salvaged tech to outrun grief that she's losing the capacity to feel anything at
all — and hires the dynasty to investigate a betrayal she can no longer emotionally
process. The quest asks whether numbness is mercy or death-in-life, and whether "fixing"
someone means giving them back their pain. No villain but grief and the tech that
promised to end it.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_chrome_heart
- tier: 2 (marked; hired by the performer directly)
- fold: whether NyxNyx keeps augmenting, pulls back, or finds a middle path shapes
  whether she survives as an artist or fades — an heir may find her legend (or her
  cautionary tale) in the music of the world.
- entry_conditions: NYX, a famous augmented performer, hires the dynasty to find who
  leaked her private recordings / betrayed her (the surface case).
- faction_wires: COLORFUL (the arts scene), TRADES (the chop-docs who augment her),
  NETWORK (augmentation supply — a light thread, not the focus), VOLUNTEERS (a medic
  who warns her).
- music_pool: NYX's own MUSIC (diegetic — her tracks, growing colder/more synthetic as
  the quest reveals her numbness); TENSION on the investigation; a single warm human
  note if she reconnects.
- ledger_writes: recorded[nyx_outcome_*]; UNRECORDED[gave_her_back_her_pain] OR
  [let_her_go_numb].
- amalgamation_thread: LIGHT — her augments use Network tech; one optional clue ties the
  supply to the same source as the NeuroLink (Q004/Q010), but the quest stays about HER.

===============================================================================
## 2. CAST
===============================================================================
- NYX (id: nyx) — a performer who lost her partner in the crash and began replacing her
  body with salvaged augments to stop the pain; each augment dulled more feeling, and now
  she's a breathtaking artist who can barely feel her own songs. Elegant, flat-affect,
  quietly desperate under the chrome. baked rig: skin #2 heavily overlaid with augment-
  reveal cybernetics (universal damage-reveal engine, but voluntary/aesthetic). default_
  emotion: exquisite_flatness -> (rare flickers) buried_grief. faction: COLORFUL.
- REYA (id: reya) — Nyx's former collaborator, the "betrayer" of the surface case;
  actually leaked the recordings out of love, trying to make Nyx FEEL something by forcing
  a crisis. default_emotion: guilty_devoted. faction: COLORFUL.
- DOC VELE (id: vele) — the chop-doc who installs Nyx's augments; will keep going as long
  as she pays; not evil, just supply-and-demand (Papers-Please pragmatism). default_
  emotion: transactional_uneasy. faction: TRADES.
- DR. SAMA (id: sama) — VOLUNTEERS (RECURRING); warns that the next augment may take the
  last of Nyx's affect. default_emotion: grave_gentle.
- THE PLAYER — [MEDICINE] (read the augment damage), [READ], standing shape routes.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
DETECTIVE HUB-AND-SPOKE (investigate the "betrayal" — interview Reya, Vele, examine the
leaked recordings) that TWISTS (the betrayal was an act of love) into a CARE bottleneck:
the real case is Nyx's numbness. BRANCH resolution: help her FEEL again (give back the
pain), help her go FULLY numb (her stated wish), find a MIDDLE (art without self-erasure),
or take the pay and leave it.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- THE HIRE (the surface case) ---
node open_01
  speaker: nyx  emotion: exquisite_flatness  gesture: still_perfect_posture  camera: closeup
  music:{pool:NYX_TRACK,cue:cold_synthetic}
  line: "Someone leaked my private sessions. The raw ones, before I process the feeling
         out of them. I want to know who, and I want it handled. I can pay in caps or in
         a song with your name in it. I'm told the second is worth more, though I confess
         I no longer feel why."
  choices (PLR):
   - "I'll find who leaked them."          -> invest_hub
   - "Why process the feeling out?"         -> spoke_process
   - "[MEDICINE] How much of you is still... you?" -> spoke_med [require skill.medicine>=2]
node spoke_process
  speaker: nyx  emotion: exquisite_flatness  camera: closeup  micro_expression: almost_nothing
  line: "Feeling is a wound that doesn't close. I lost someone. Every song I wrote after
         bled. So I... upgraded. Now the songs are perfect and they don't cost me anything.
         That's the trade. Perfect, and free. You look like you think that's sad. I can't
         quite reach sad anymore, so I'll take your word."
  effect: knowledge[nyx_augmented_to_escape_grief]  -> goto invest_hub
node spoke_med  [MEDICINE]
  speaker: nyx  emotion: buried_grief_flicker  camera: closeup  micro_expression: a_single_flicker
  line: "Honest question. Honest answer: I don't know. There's a room in me I sealed off
         and I've forgotten which door it was. Sometimes I hear something moving in there.
         (the flicker passes) ...Sorry. That was almost a feeling. How embarrassing."
  effect: knowledge[something_of_her_remains] (the room isn't empty — there's a way back)
  -> goto invest_hub

--- INVESTIGATION (the twist) ---
node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Interview Reya, the suspected leaker.)"  -> reya_01  [once]
   - "(Talk to Doc Vele, her augment-doc.)"      -> vele_01  [once]
   - "(Examine the leaked raw recordings.)"      -> clue_tapes [once]
   - "(Confront Nyx with what you've found.)"    -> reveal_gate [show after 2]
node reya_01
  speaker: reya  emotion: guilty_devoted  gesture: wont_deny_it  camera: two_shot
  line: "Yes. I leaked them. The RAW ones — the ones where she still SOUNDED like a
         person. Because the world's falling in love with a beautiful machine and forgetting
         there was a woman in there who's DROWNING. I didn't do it to hurt her. I did it so
         SOMEBODY would look at her and see what I see. Even her."
  effect: knowledge[reya_leaked_out_of_love] (the betrayal twists into a rescue attempt)
  -> goto invest_hub
node vele_01
  speaker: vele  emotion: transactional_uneasy  gesture: clean_a_tool  camera: closeup
  line: "She wants another augment. Vocal-cord array — she'd never miss a note again. I'll
         do it; caps are caps. But between us? There's not much feeling left to numb. One
         more and I think the lights go out behind her eyes for good. I install. I don't
         judge. But you asked."
  effect: knowledge[next_augment_ends_her_affect] (the ticking clock)  -> goto invest_hub
node clue_tapes
  speaker: PLR (internal)  camera: closeup  music:{pool:NYX_TRACK,cue:raw_human_version}
  line: "(The leaked raw sessions: the SAME songs, but before the processing — and they're
         devastating. A cracked voice, a breath that catches on a dead lover's name. This
         is what she sounds like with the feeling still IN. The processed versions are
         flawless. These are ALIVE. She's been sanding the life off her own art to survive
         it.)"
  effect: knowledge[her_raw_art_is_the_real_art]  -> goto invest_hub

--- THE REVEAL / CARE BOTTLENECK ---
node reveal_gate
  speaker: nyx  emotion: exquisite_flatness  camera: closeup  music:{pool:NYX_TRACK,cue:hold_cold}
  line (PLR reports Reya): "...Reya. Of course. She always did love the version of me that
         hurt. (a pause) You've heard the raw tapes now. Tell me. Was I better broken? Be
         honest. I can't tell anymore, and I have one more upgrade scheduled for Thursday."
  -> goto resolve_gate
node resolve_gate (speaker: PLR)  camera: closeup
  choices:
   - "You were ALIVE broken. Cancel Thursday. Come back."   -> route_feel
   - "It's your body. If numb is survival, I'll help you go fully numb." -> route_numb
   - "You don't have to choose all-pain or all-chrome. There's a middle." [require knowledge.something_of_her_remains] -> route_middle
   - "(Report the leaker, take the pay, leave the rest to her.)" -> route_leave

===============================================================================
## 5. THE ROUTES
===============================================================================
node route_feel  (give back the pain — the hardest mercy)
  speaker: nyx  emotion: terror_then_thaw  camera: closeup  micro_expression: first_real_tears
  line: "Cancel it. Undo some of it. You're asking me to let it ALL back in — the loss,
         the— " (a wave hits her, real, staggering) "—oh. OH. There it is. God, it HURTS.
         I forgot it hurt this much. I forgot HIM this much. ...don't let me seal it again.
         Even this. Even this is better than the quiet."
  effect: Nyx begins reversing augments (a hard, painful path with Sama's help); recorded
    [nyx_chose_to_feel]; UNRECORDED[gave_her_back_her_pain]=true; her art becomes ALIVE
    again (raw tracks circulate — the real her); she survives as a whole, hurting person.
    The hardest, warmest outcome. -> END
node route_numb  (honor her stated wish — the dark mercy)
  speaker: nyx  emotion: relief_or_void  camera: closeup
  line: "...Thank you for not fighting me. Everyone fights me. The upgrade's Thursday. I'll
         be perfect. I'll be free. And I won't be here to miss myself. That's the whole
         point." (she goes through with it — the lights go out behind her eyes)
  effect: recorded[helped_nyx_go_numb]; UNRECORDED[let_her_go_numb]=true; Nyx becomes a
    flawless, feelingless star — beautiful, empty, and by her own choice; her art goes
    perfect and dead; an heir finds a legend with no soul left in it. The game honors her
    autonomy AND shows the cost (no scolding — Sinnerman restraint). -> END
node route_middle  [requires knowing something remains]
  speaker: nyx + sama  emotion: fragile_negotiation  camera: two_shot  music:{pool:NYX_TRACK,cue:warm_note}
  line (sama): "Not all-or-nothing. We keep the augments that don't touch affect — the
         voice, the stamina — and we open ONE door. Just enough to feel your own songs.
         You get to make art that costs something without it destroying you. It's harder
         than numb. It's harder than raw. But it's YOURS."
  effect (needs MEDICINE/standing): a negotiated middle — Nyx keeps her craft AND a
    measured capacity to feel; recorded[nyx_found_the_middle]; UNRECORDED[the_measured_
    heart]=true; the wisest outcome (integration over erasure or martyrdom); she thrives.
  -> END
node route_leave
  speaker: nyx  emotion: exquisite_flatness  camera: closeup
  line: "Reya leaked them. Fine. Consider yourself paid. The upgrade's still Thursday. You
         did your job. The rest was never your job." (she proceeds toward numbness by
         default — inaction is a choice)
  effect: recorded[took_the_pay]; Nyx defaults toward the numb path unless she acts alone;
    UNRECORDED[left_her_to_it]=true. The clean-hands, cold outcome. -> END

===============================================================================
## 6. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- FEEL: Nyx survives whole and hurting; her raw music becomes legendary (an heir hears
  the ALIVE version across Vegas — art that costs something); Reya reconciled.
- NUMB: a flawless, soulless legend; her perfect-dead tracks play in the world as a
  cautionary beauty; an heir may not even know a woman was in there once.
- MIDDLE: Nyx thrives as an integrated artist; the healthiest legacy; a model of
  augmentation-with-limits that ripples into how the world sees the tech.
- LEAVE: she fades toward numbness off-screen; a quiet loss.
- The FEEL/NUMB/MIDDLE choice becomes part of the world's MUSIC (her legacy is audible),
  tying the theme to Bohemia's music-vehicle purpose.

===============================================================================
## 7. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Nyx's exquisite_flatness is a facial performance of ABSENCE — a beautiful face that
  almost never moves, with rare, devastating micro-flickers (a_single_flicker, first_real_
  tears). The augment-reveal cybernetics (universal damage-reveal engine, used AESTHETIC-
  ally here) show her chrome. The horror/beauty is the stillness. Procedural lip-sync;
  her singing lip-syncs to the diegetic tracks (cold processed vs raw human versions).
BODY: still_perfect_posture (unnatural composure — the ONE actor whose talk-idle is
  eerily TOO still, like the statue in 011 but tragic not comic); minimal gestures.
CAMERA: closeups dominate (this is a face quest); two_shots for Reya/Sama; the raw-tapes
  beat holds on the player listening. Cuts on beat.
MUSIC: NYX's own tracks are diegetic and DUAL — the cold processed versions (what the
  world loves) vs the raw human versions (what she buried); the quest weaponizes the
  CONTRAST. A single warm note if she reconnects. Her music IS her emotional state, audible.
  120 BPM.

===============================================================================
## 8. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + autonomy)
===============================================================================
- Zero combat (a detective/care quest); fully non-violent by nature.
- Rewards diverge (Megaton law): FEEL = alive art + a whole hurting person; NUMB = a
  perfect empty legend; MIDDLE = a thriving integrated artist; LEAVE = a fade. No route
  is forced; the game HONORS her autonomy (she can choose numb) while making every cost
  audible in her music — it shows, never preaches (Sinnerman restraint).
- Theme: the price of escaping pain, and whether "help" means giving someone back their
  suffering. A mature, no-villain tragedy that trusts the player to sit with ambiguity.

===============================================================================
## 9. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Uses the universal damage-reveal engine AESTHETICALLY (chosen
augments, not wounds) + DUAL diegetic track versions (processed vs raw) as an emotional
mechanic + the "too-still talk-idle" (tragic variant of 011's locked idle). Reads ledger/
standing/skill/knowledge/fold; writes same + a world-music-legacy flag (which version of
her art survives). Deterministic + save-through. Gate: the betrayal-twist lands, all four
care routes resolve, middle gated behind knowing something remains, dual-track contrast
plays, music-legacy flag propagates, autonomy (numb) honored without a forced "good" push.
Joins the suite.

## 10. WHAT THIS PROVES (vs 001-020)
New engine: the AUGMENTATION-COST tragedy — a detective case that twists into a care
question (is numbness mercy or death-in-life?), resolved by feel/numb/middle/leave with NO
villain but grief and the tech that promised to end it. It weaponizes DUAL diegetic track
versions (processed vs raw) as the emotional mechanic, ties augmentation lore to a PERSON
(not the mystery), and honors autonomy while making every cost audible in the world's
music. Bible at 21; the music-vehicle purpose now runs through a character's very soul.
