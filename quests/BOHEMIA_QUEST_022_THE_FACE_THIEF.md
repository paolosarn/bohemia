# BOHEMIA — QUEST 022: "THE FACE THIEF"
Full production build. Built to the dialogue/scene spec; template = 001-021. Tier-2
DEDUCTION / mistaken-identity (Vault #15 Face Thief + tradition XXX Obra-Dinn + the
Amalgamation-mimicry seed). Name from Paolo's catalog tone.

Design soul: someone is robbing a district wearing other people's faces, and the town
blames a "ghost." The truth is worse and sadder — a data-portrait echo (or a con artist
using stolen Network face-data) mimicking the living. A deduction quest where the player
must confirm-in-cluster WHO the thief really is before an innocent is lynched for it.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_face_thief
- tier: 2 (marked; the district is in a panic, an innocent is about to be blamed)
- fold: catching the truth (or the wrong person) shapes whether the district learns
  paranoia or discernment; a spared innocent may recur.
- entry_conditions: a string of robberies where victims swear they were robbed by
  friends/family who deny it; a mob is forming around a scapegoat (OLD BRAM).
- faction_wires: TRADES (the robbed), MOB (forming the lynch), NETWORK (the face-data
  source), VOLUNTEERS (protect the accused).
- music_pool: TENSION; an uncanny "wrong-face" motif (a familiar melody slightly off);
  cyan-hum if the Network-data truth surfaces.
- ledger_writes: recorded[face_thief_outcome_*]; UNRECORDED[who_you_let_the_mob_take];
  optional mindmap CLUE[network_face_data_is_loose].
- amalgamation_thread: MEDIUM — the thief uses stolen data-portraits (the Amalgamation's
  raw material); catching it reveals face-data is leaking OUT of the servers.

===============================================================================
## 2. CAST
===============================================================================
- THE THIEF / "NOBODY" (id: nobody) — a person (or fractured mind) who got hold of
  Network face-projection tech and wears others' faces to rob; underneath, someone with
  no face of their own left (a data-portrait test subject whose own identity was
  overwritten). Tragic, not evil. default_emotion: wears_others -> (unmasked) faceless_grief.
- OLD BRAM (id: bram) — the scapegoat; a strange, friendless recluse the district
  wants to blame because he's easy. Innocent. default_emotion: frightened_resigned.
- CONSTABLE ORrin-analog DELL (id: dell) — wants the panic to end and will take the
  easy answer (Bram) unless the player brings proof. default_emotion: pressured_pragmatic.
- VICTIMS (3) — each robbed by a different "familiar face"; their testimony is the
  deduction data. default_emotion: shaken_certain.
- THE PLAYER — [READ], [MEDICINE], deduction; standing shapes whether the mob listens.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
DEDUCTION HUB-AND-SPOKE: gather the three victims' testimonies + physical clues,
confirm-in-cluster the thief's real nature, then a BOTTLENECK race against the mob:
EXPOSE THE TRUTH (save Bram, catch the thief), LET THE MOB TAKE BRAM (easy, wrong),
CATCH + SPARE the thief (mercy), or CATCH + END it. Confirm-in-cluster gating.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: dell  emotion: pressured_pragmatic  gesture: gesture_at_mob  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "Six robberies, six victims swearing a neighbor or a spouse did it — and every
         'thief' was somewhere else, witnessed. The district's calling it a ghost. The
         mob's calling it Old Bram, 'cause Bram's odd and alone and easy. I've got till
         sundown before they take him. Give me a TRUTH or they'll take a scapegoat."
  -> goto invest_hub
node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Interview the three victims.)"     -> clue_victims [once]
   - "(Examine a robbery scene.)"          -> clue_scene   [once]
   - "(Talk to Old Bram.)"                 -> bram_01       [once]
   - "(Trace where a 'face' could come from.)" -> clue_data [once]
   - "(Confront the truth / the mob.)"     -> cluster_gate  [show after 3 clues]
node clue_victims
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:wrong_face}
  line: "(All three swear it was someone they LOVE — a wife, a son, a partner — who then
         proved they were elsewhere. The 'faces' were perfect but the VOICES were wrong:
         flat, borrowed, a beat behind. Whatever wore those faces couldn't wear the
         voice.)"
  effect: mindmap CLUE[thief_copies_faces_not_voices]  -> goto invest_hub
node clue_scene
  speaker: PLR (internal)  camera: closeup
  line: "(At the scene: a dropped shard of Network projection-tech — face-casting gear.
         Someone's using the dead's own data-portraits as MASKS. This isn't a ghost.
         It's a person with a stolen library of faces.)"
  effect: mindmap CLUE[thief_uses_network_face_tech]  -> goto invest_hub
node bram_01
  speaker: bram  emotion: frightened_resigned  gesture: shrink  camera: closeup
  line: "They always land on me. Odd Bram. I didn't rob nobody — I can't even look folks
         in the eye, how'd I wear their FACE? But odd's as good as guilty here. If you're
         another one come to drag me, get it over with."
  effect: knowledge[bram_is_innocent] (his social fear makes the accusation absurd)
  -> goto invest_hub
node clue_data
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:cyan_hum_in}
  line: "(The face-data traces to a leak OUT of the Network servers — a library of
         uploaded portraits, loose in the world. And one portrait in the thief's kit has
         no name and no match: their OWN, blanked. Whoever this is had their face taken
         FIRST, and now takes everyone's.)"
  effect: mindmap CLUE[the_thief_lost_their_own_face] + CLUE[network_face_data_is_loose]
  -> goto invest_hub
node cluster_gate  [requires 3 CLUEs]
  speaker: PLR  camera: closeup  music:{pool:TENSION,cue:hold}
  effect: LOCK deduction TRUTH[the_thief_is_a_faceless_data_victim] — a person the
    Network erased, stealing faces because they have none. Now: the mob is at Bram's door.
  -> goto climax_gate
node climax_gate (speaker: PLR)  camera: wide_mob
  choices:
   - "(Expose the truth — clear Bram, draw out the thief.)" [require TRUTH] -> route_expose
   - "(Let the mob take Bram. Panic ends, wrong man hangs.)" -> route_scapegoat
   - "(Catch the thief — and spare them.)"                   -> route_spare [require TRUTH]
   - "(Catch the thief — and end it.)"                        -> route_end  [require TRUTH]
node route_expose
  speaker: nobody (unmasked)  emotion: faceless_grief  camera: closeup  micro_expression: no_expression_to_read
  line: "(the stolen face flickers off — beneath is a blur, a person whose features won't
         hold) They took mine first. In the labs. I woke up and mirrors showed me NOTHING.
         So I wear yours. All of yours. It's the only way anyone looks at me and doesn't
         scream. ...I'm sorry about the robberies. I don't know how else to be a person."
  effect: Bram cleared; the thief revealed as a Network victim; mindmap[network_face_data
    _is_loose] banked (Reconstruction); recorded[exposed_the_truth]; UNRECORDED[saved_bram]
    =true. Then -> spare or end (below) as a follow choice. The truth saves the innocent. -> goto spare_or_end
node route_scapegoat
  speaker: dell  emotion: ashamed_relieved  camera: two_shot  micro_expression: wont_meet_eyes
  line: "...They've got him. It's done. District feels safe again. We both know it's not
         right. But it's QUIET. God help us, quiet's what they wanted." (Bram is taken)
  effect: recorded[let_them_take_bram]; UNRECORDED[the_wrong_man]=true; the real thief
    keeps operating (a recurring problem); the district learns paranoia; a permanent stain.
    -> END
node spare_or_end (speaker: PLR)  camera: closeup
  choices:
   - "(Spare them — get them to the Volunteers.)"  -> route_spare
   - "(End it — they can't be allowed to keep stealing faces.)" -> route_end
node route_spare
  speaker: nobody  emotion: faceless_grief  camera: closeup
  line: "You're not... you're not dragging me off? You'd help a thing with no face? ...I
         could learn. Maybe. To be one person instead of everyone. Just show me which door."
  effect: recorded[spared_the_thief]; the faceless victim enters Volunteers care (may
    recur, slowly building ONE face/identity — a tender long thread); UNRECORDED
    [mercy_for_the_faceless]=true. -> END
node route_end
  speaker: nobody  emotion: something_like_relief  camera: closeup
  line: "...maybe that's kinder. I haven't had a face to close my eyes behind in years."
  effect: Dead Eye (or a nonlethal capture handed to the law); recorded[ended_the_thief];
    the robberies stop; a grim mercy; UNRECORDED[put_down_a_victim]=true. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- EXPOSE+SPARE: Bram safe (a grateful recluse who may open up); the faceless victim slowly
  builds an identity (a heart-tug recurring thread); the Reconstruction gains
  [network_face_data_is_loose] — the servers are LEAKING their raw material.
- EXPOSE+END: Bram safe; the thief dead but understood; the clue still banks.
- SCAPEGOAT: Bram lynched; the real thief loose; the district paranoid; a stain an heir
  can uncover (the wrong grave).
- The leaked-face-data clue matters later: if the Amalgamation's portraits are escaping,
  the enemy is destabilizing (an endgame thread).

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the CORE tech is the face-swap — the thief wears victims' faces (rendered on the
  baked-rig portrait system, per RIG LAW: it literally puts another actor's face on the
  rig), and the unmask reveals a BLUR that won't hold features (faceless_grief — a portrait
  with no stable expression, the quest's gut-image). Voices are "a beat behind" (the tell).
  Procedural lip-sync deliberately mistimed on the stolen faces (the clue made audible).
BODY: the thief moves like whoever they're wearing (borrowed gestures); unmasked, they're
  hesitant, unpracticed at being one person. Mob is a staged crowd (scheduler).
CAMERA: closeups for the deduction tells, wide_mob for the sundown race, hold on the
  unmask blur. Cuts on beat.
MUSIC: an uncanny WRONG-FACE motif (a warm melody pitched slightly off — familiar-but-
  wrong); cyan-hum on the data-leak clue; hold on the unmask. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + deduction)
===============================================================================
- Pacifist-completable: the truth is found by investigation; the thief can be spared;
  Bram saved without violence. Combat only if the player chooses to end the thief.
- Rewards diverge (Megaton law): EXPOSE+SPARE = a saved innocent + a tender thread + a
  Reconstruction clue; SCAPEGOAT = false peace + a stain + a loose thief; END = closure +
  a grim mercy. The EASY answer (let the mob have Bram) is the WORST — deduction over
  scapegoating (the quest's spine: truth is work, panic is easy).
- Confirm-in-cluster gating: you CANNOT expose/spare/end correctly without the 3 clues —
  no guessing your way past the mob (Obra-Dinn discipline).

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Uses the FACE-SWAP portrait tech (another actor's face on the
rig — reuses RIG LAW rendering) + mistimed lip-sync as a clue + the deduction mindmap
(confirm-in-cluster). Reads ledger/standing/skill/knowledge/fold; writes same + a
Reconstruction clue + a spared-NPC thread. Deterministic + save-through. Gate: 3-clue
cluster locks the truth, mob-race resolves at any branch, expose/spare/end/scapegoat all
resolve, face-swap renders + mistimed lip-sync fires, no truth = no correct catch. Joins suite.

## 9. WHAT THIS PROVES (vs 001-021)
New engine: a DEDUCTION / mistaken-identity quest with a race against mob justice, where
the player must confirm-in-cluster the thief's tragic truth (a faceless Network victim)
before an innocent is lynched — the EASY scapegoat answer being the worst. Introduces the
face-swap portrait tech (another actor's face on the rig) and mistimed-lip-sync-as-clue,
and threads the Amalgamation's raw material LEAKING (an endgame destabilization seed).
Bible at 22; deduction now guards an innocent, and the enemy's data is escaping.
