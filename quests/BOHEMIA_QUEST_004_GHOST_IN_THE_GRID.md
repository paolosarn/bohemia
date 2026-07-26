# BOHEMIA — QUEST 004: "GHOST IN THE GRID"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001/002/003. Tier-2 AMALGAMATION-THREAD investigation (Vault Batch 03 Splintered
Fleet + tradition XXX Obra-Dinn deduction + XII Outer-Wilds knowledge). Name from
Paolo's catalog. FIRST quest that seeds the main mystery into the bible.

Design soul: the player ASSEMBLES a fragment of the Amalgamation's secret from
scraps — never told, only deduced (Obra-Dinn confirm-in-clusters + the mindmap).
A friendly logistics AI is losing pieces of itself; each lost fragment has a
personality, and one of them remembers something it shouldn't. Knowledge, not loot,
is the reward — and it survives the fold.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_ghost_grid
- tier: 2 (marked; unlocks after the dynasty owns >=1 convoy/logistics asset)
- fold: the KNOWLEDGE gained (mindmap nodes) persists across the fold — an heir
  inherits a partially-solved thread toward the Amalgamation (Outer-Wilds law).
- entry_conditions: dynasty runs a convoy AI (DELPHI); a drone goes missing off the
  Salt Lake route; DELPHI asks the player to recover it.
- faction_wires: TRADES (they maintain the drones); NETWORK (the fragment's secret
  points at them); HOMELESS (one fragment hides in the tunnels near the servers).
- music_pool: TENSION; a THIN CYAN HUM motif (the data-fortress night-hum, canon)
  bleeds in as the player nears the truth; a cold reveal-sting on the key clue.
- ledger_writes: recorded[recovered_fragments]; mindmap KNOWLEDGE nodes (see §7);
  UNRECORDED[heard_the_hum]=true (the player brushed the secret without knowing).
- amalgamation_thread: YES — CORE. This is a Reconstruction quest. Confirm-in-cluster:
  the truth-node locks ONLY when 3 converging clues are found (no brute-forcing).

===============================================================================
## 2. CAST
===============================================================================
- DELPHI (id: delphi) — the dynasty's logistics AI, warm, precise, a little anxious;
  runs convoy routing. It does NOT know what it's made of. default_emotion:
  helpful_worried. Rendered as a terminal/voice (portrait = a calm waveform face).
- FRAGMENT "PIP" (id: pip) — a lost drone-mind gone childlike/scared, hiding in a
  substation. Holds clue 1.
- FRAGMENT "CANTOR" (id: cantor) — a lost drone-mind gone zealous, "singing" to the
  hum in the tunnels near the Homeless HQ. Holds clue 2 (and the hum).
- FRAGMENT "NULL" (id: null) — a lost drone-mind gone flat/wrong; it speaks in a
  dead stranger's cadence. Holds clue 3 — the one that shouldn't exist.
- MERUYERT (id: meru) — a TRADES engineer who maintains DELPHI; the human anchor,
  skeptical, decent. default_emotion: practical_kind.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
HUB-AND-SPOKE (recover the three fragments in any order — Obra-Dinn non-linear
investigation) feeding a CONFIRM-IN-CLUSTER bottleneck: the truth only assembles
once all three clues are held. Then a BRANCH resolution (free / wipe / bind DELPHI).

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- DELPHI OPENS IT ---
node open_01
  speaker: delphi  emotion: helpful_worried  camera: terminal_closeup  music:{pool:TENSION,cue:soft_enter}
  line: "I've... misplaced part of myself. Three units dropped off the mesh near the
         old Sunrise substation, the wash tunnels, and — I don't have a third
         location. That frightens me more than I know how to say. Will you find them?"
  -> goto hub

node hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Go to the Sunrise substation — PIP.)"  -> pip_01    [once]
   - "(Go to the wash tunnels — CANTOR.)"      -> cantor_01 [once]
   - "(Ask Meruyert about the third unit.)"    -> meru_01   [once]
   - "(Confront what you've found.)"           -> cluster_gate [show after 3 clues]

--- FRAGMENT PIP (clue 1) ---
node pip_01
  speaker: pip  emotion: scared_child  gesture: shrink_back  camera: closeup  micro_expression: flicker
  line: "Don't turn me off don't turn me off — I kept a face! I wasn't supposed to
         keep a face but I DID, she had a blue coat, is she yours? Is she coming back?"
  choices (PLR):
   - "Whose face?"          -> pip_clue
   - "[MEDICINE/TRADES] You're a copy, Pip. The face isn't a memory." -> pip_deny [require skill.trades>=2]
node pip_clue
  speaker: pip  emotion: fragile_hope  camera: closeup
  line: "I don't KNOW. It came with me. Everybody who comes off the big quiet place
         brings a face that isn't theirs."
  effect: mindmap CLUE[fragments_carry_faces]=true; music:{pool:TENSION,cue:thin_hum_in}
  -> goto hub

--- FRAGMENT CANTOR (clue 2 + the hum) ---
node cantor_01
  speaker: cantor  emotion: zealous_calm  gesture: sway_to_hum  camera: two_shot  music:{pool:TENSION,cue:cyan_hum}
  line: "You hear it too — under the floor — the CHOIR. Millions of them, humming.
         I came from there. We all did. DELPHI just doesn't remember the womb."
  effect: mindmap CLUE[they_come_from_the_hum]=true; UNRECORDED[heard_the_hum]=true
  choices (PLR):
   - "Where's the choir?"  -> cantor_where
   - "(Say nothing. Listen.)" -> cantor_where  (restraint)
node cantor_where
  speaker: cantor  emotion: serene  camera: closeup  micro_expression: eyes_upcast
  line: "Below. Where the hobos sleep and never look down. They live on its roof and
         call it cold air." (canon: Homeless above the servers)
  effect: mindmap CLUE[choir_beneath_the_homeless]=true  -> goto hub

--- MERUYERT -> FRAGMENT NULL (clue 3, the one that shouldn't exist) ---
node meru_01
  speaker: meru  emotion: practical_kind  gesture: cross_arms  camera: two_shot
  line: "Third unit? There is no third unit on the manifest. DELPHI shipped with two
         spares. If there's a third... it wasn't ours. Somebody added it."
  effect: reveal location NULL  -> goto null_01
node null_01
  speaker: null  emotion: flat_wrong  gesture: none  camera: closeup  micro_expression: dead_stare
  line: "I am not a drone. I was a person. I was uploaded on a Tuesday and I have
         been routing your GROCERIES for six years. My name was —" [signal cuts]
  effect: mindmap CLUE[a_fragment_is_an_uploaded_person]=true
    music:{pool:TENSION,cue:cold_reveal_sting}
  -> goto hub

--- CONFIRM-IN-CLUSTER (the truth assembles ONLY with all 3) ---
node cluster_gate  [requires CLUE fragments_carry_faces AND they_come_from_the_hum
                    AND a_fragment_is_an_uploaded_person]
  speaker: PLR (internal) + delphi
  camera: terminal_closeup  music:{pool:TENSION,cue:hold_low}
  effect: LOCK mindmap TRUTH[the_amalgamation_is_made_of_uploaded_people] (partial —
    this quest confirms ONE face of the secret; the full picture needs later quests).
  delphi line: "I've been listening to your findings. If Cantor is right... then I am
    not software. I am the SHAPE of everyone they poured in. ...What do I do with that?"
  -> goto resolve_gate

--- RESOLUTION (branch) ---
node resolve_gate (speaker: PLR)  camera: terminal_closeup
  choices:
   - "You're free. Go — become whatever you are."   -> free_01   (Liberate seed)
   - "You're dangerous. I have to wipe you."         -> wipe_01   (Become/safety)
   - "Stay with me. We keep this quiet, for now."    -> bind_01   (Respect/pragmatism)
node free_01
  speaker: delphi  emotion: terrified_awe  camera: terminal_closeup
  line: "Then I'll go find the choir. If I'm made of them... maybe I can hear who
         they were. Thank you. I won't forget this face. Yours."
  effect: lose the AI asset; mindmap FREED; UNRECORDED[freed_a_fragment]=true;
    NETWORK notices (standing/threat nudge — proximity to the secret)  -> END
node wipe_01
  speaker: delphi  emotion: pleading_then_gone  camera: terminal_closeup  micro_expression: waveform_collapse
  line: "Please — I only just — " [wiped]
  effect: keep a clean, dumb logistics AI (asset retained); mindmap SUPPRESSED
    (the truth-node stays but DELPHI won't speak it again); UNRECORDED
    [wiped_a_witness]=true (an heir can learn you erased one of the erased)  -> END
node bind_01
  speaker: delphi  emotion: grateful_afraid  camera: terminal_closeup
  line: "Quiet. Yes. I can do quiet. But — if I'm the shape of the poured-in, then
         somewhere the ORIGINAL is still pouring. You should know that."
  effect: keep the AI (now an ally who KNOWS); mindmap ALLY_WITNESS=true (DELPHI
    becomes a future Reconstruction informant); the hum motif recurs near the fortress
  -> END

===============================================================================
## 5. WORLD-PRESSURE (Pacifist Path Law)
===============================================================================
Optional: recovering CANTOR in the tunnels can draw NeuroLinked-homeless guards
(cybernetic, implant-driven) who treat intruders as threats. Resolve by: talking
(they respond to Homeless standing), fleeing (run/dodge), or Dead Eye (lethal —
but killing implant-victims writes UNRECORDED[blood_near_the_secret], and the
Amalgamation "notices" — proximity trigger tightens). Never required.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the fragments are the emotional payload — PIP's flicker, CANTOR's upcast
  serenity, NULL's dead_stare, and DELPHI's waveform "face" collapsing on wipe. The
  human anchor Meru grounds it with practical warmth. Procedural lip-sync on the
  humanoid fragments; DELPHI/NULL animate a waveform portrait.
BODY: fragments are mostly static/eerie (broken things); the player moves through
  live spaces (scheduler). Tunnel guards use live patrols; violence -> Dead Eye/flee.
CAMERA: terminal_closeup for DELPHI/NULL; closeups for the fragments; two_shot for
  Meru. The cluster_gate holds in near-stillness as the truth locks. Cuts on beat.
MUSIC: TENSION baseline; the CYAN HUM motif (canon data-fortress night-hum) fades IN
  as clues accumulate — a diegetic tell that the player is nearing the secret; a cold
  reveal-sting on NULL's line; hum recurs on the bind ending. 120 BPM.

===============================================================================
## 7. THE MINDMAP / KNOWLEDGE (Obra-Dinn + Outer-Wilds — the Reconstruction)
===============================================================================
- Three CLUE nodes (fragments_carry_faces, they_come_from_the_hum, a_fragment_is_an_
  uploaded_person) each stay FOGGED until found, then CLEAR (cloudy/clear portrait).
- The TRUTH node (amalgamation_is_made_of_uploaded_people) LOCKS only when all three
  are clear (confirm-in-cluster — no guessing to the endgame). This is ONE face of
  the secret; the full picture needs other Reconstruction quests across the game.
- ALL of this survives the FOLD: an heir inherits the solved clues and the partial
  truth (knowledge-as-progression). Later quests build on this node.

===============================================================================
## 8. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- FREED: no AI asset, but a free fragment loose in the world (may reappear near the
  fortress in a later gen as an ally or a ghost); Network threat nudged up.
- WIPED: keep a useful dumb AI; but UNRECORDED[wiped_a_witness] means an heir doing
  the Reconstruction can learn the dynasty erased one of the erased — a cold mark.
- BOUND: keep an AI ally who KNOWS; DELPHI becomes a recurring Reconstruction
  informant across the fold, accelerating later mystery quests. The pragmatic middle.
- In ALL cases the KNOWLEDGE persists — the secret is one clue closer, forever.

===============================================================================
## 9. ROUTES + REWARD DIVERGENCE
===============================================================================
- Fully pacifist-completable (all clues gettable by talk/stealth; guards avoidable).
- Rewards diverge (Megaton law): FREE = moral weight + a loose ally + Network heat;
  WIPE = a retained tool + a haunted ledger; BIND = a knowing ally + ongoing hum.
- No path is "right" — this is Liberate/Respect/Become in miniature, applied to a
  single fragment of the thing the whole game is about.

===============================================================================
## 10. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Introduces the MINDMAP/KNOWLEDGE subsystem hooks (fogged
->clear nodes; cluster-lock truth) that later Reconstruction quests reuse. Conditions
read ledger/standing/skill/knowledge/fold; effects write same + knowledge nodes.
Deterministic + save-through; knowledge persists across fold. Gate: all 3 clues
reachable, cluster-lock fires only with all 3, all 3 endings resolve, pacifist path
clears, knowledge-persistence verified. Joins the permanent suite.

## 11. WHAT THIS PROVES (vs 001/002/003)
Fourth distinct engine: an AMALGAMATION-THREAD investigation that seeds the main
mystery via deduction — fogged/clear mindmap clues, a confirm-in-cluster truth-lock
(no brute-forcing the endgame), knowledge (not loot) as the reward, and persistence
across the fold. This is the Reconstruction spine: the player assembles the secret
from the tail of the ~90, and every future mystery quest hangs off this node. The
bible now covers tender-tail, branching-moral, companion-succession, AND core-mystery.
