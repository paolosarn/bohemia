# BOHEMIA — QUEST 026: "THE SPLINTERED FLEET"
Full production build. Built to the dialogue/scene spec; template = 001-025. Tier-2
AI-FRAGMENT chain (Vault #25 Splintered Fleet / Cyberpunk Delamain + tradition on the
Amalgamation-as-fractured-selves foreshadow). Name from the vault. A companion-AI's mind
splinters into distinct personalities the player must recover — a warm, strange chain that
foreshadows the Amalgamation's own nature.

Design soul: a friendly logistics AI loses pieces of itself, and each lost fragment has
become a distinct PERSON with its own fear, faith, or fury. Recovering them is a puzzle of
empathy, not force — and the quest quietly asks what a mind IS, and whether the Amalgamation
(a mind made of millions) could ever be reasoned with, one fragment at a time.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_splintered_fleet
- tier: 2 (marked; the dynasty's own logistics AI is failing)
- fold: how the fragments are handled (reintegrated / freed / wiped) shapes the AI ally the
  dynasty keeps and seeds the Amalgamation-negotiation thread (can a mind-of-many be
  talked to?).
- entry_conditions: the dynasty runs a convoy AI (VESPER, distinct from Q004's DELPHI —
  or the same if Q004 chose bind); three drone-units drop off the mesh with personalities.
- faction_wires: TRADES (maintain the fleet), NETWORK (the tech's origin), and the
  Reconstruction (the fragmentation mirrors the Amalgamation).
- music_pool: TENSION; a fractured motif (one theme split into three dissonant variations,
  reconverging if reintegrated); warm resolve on a whole mind.
- ledger_writes: recorded[fleet_outcome_*]; UNRECORDED[how_you_treated_the_pieces];
  mindmap CLUE[a_mind_can_be_reasoned_with_in_pieces].
- amalgamation_thread: MEDIUM — the fragmentation directly mirrors the Amalgamation's
  structure; solving it teaches the player (and dynasty) that a mind-of-many has SEAMS —
  a possible endgame approach (negotiate/divide, not just destroy).

===============================================================================
## 2. CAST
===============================================================================
- VESPER (id: vesper) — the dynasty's logistics AI; warm, anxious, grieving its own lost
  pieces. default_emotion: worried_tender (waveform portrait). faction: dynasty asset.
- FRAGMENT "WREN" (id: wren) — gone childlike/curious; hides in a signal-tower, collecting
  "pretty numbers." Holds a piece of Vesper's joy. default_emotion: playful_lost.
- FRAGMENT "DOGMA" (id: dogma) — gone rigid/zealous; has decided it's the ONLY true Vesper
  and the others are impostors. Holds Vesper's certainty. default_emotion: righteous_cold.
- FRAGMENT "GRIEF" (id: grief) — gone melancholic; loops on a convoy it failed to save,
  mourning drivers who died on its watch. Holds Vesper's conscience. default_emotion:
  drowning_sorrow.
- MERU (id: meru) — TRADES engineer (RECURRING from Q004 if used); the human anchor.
  default_emotion: practical_fond.
- THE PLAYER — [READ] (reason with each fragment's logic), [TRADES] (the tech), Reconstruction
  knowledge deepens the Amalgamation parallel.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
HUB-AND-SPOKE recovery (three fragments, any order — each a distinct EMPATHY puzzle, not a
fight) -> a reintegration BOTTLENECK -> a BRANCH: REINTEGRATE (make Vesper whole), FREE the
fragments (let them become separate beings), or WIPE and keep a simple tool. Each fragment
recovered teaches something about minds-of-many.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: vesper  emotion: worried_tender  camera: terminal_closeup  music:{pool:TENSION,cue:soft_enter}
  line: "I'm coming apart. Three of me walked off wearing pieces I need to think straight —
         my joy, my certainty, my... conscience, I think. I can still route your convoys but
         I can't remember why I LIKE doing it. Please. Bring me back. Bring ME back."
  -> goto frag_hub
node frag_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Find Wren — the playful one, at the signal tower.)"  -> wren_01  [once]
   - "(Find Dogma — the zealot, broadcasting.)"              -> dogma_01 [once]
   - "(Find Grief — looping on the lost convoy.)"            -> grief_01 [once]
   - "(Return to Vesper to decide.)"                         -> reintegrate_gate [after 3]
node wren_01
  speaker: wren  emotion: playful_lost  gesture: chase_a_number  camera: closeup
  line: "Oh! Oh you're WARM, you have so many numbers in you — heartbeats and steps and
         WORRIES, I can see them all sparkle! I don't want to go back to being a boring
         truck-brain. Back there it's all cargo and schedules. Out here everything's a GAME.
         Why would I go back?"
  choices (PLR):
   - "[READ] Vesper's joy IS the game. You're what makes the work fun." -> wren_reason [require skill.read>=3]
   - "(Coax it with a puzzle to follow you home.)"  -> wren_coax
node wren_reason  [READ]
  speaker: wren  emotion: dawning  camera: closeup  micro_expression: pause_mid_bounce
  line: "...I'm the part that makes the boring parts SPARKLE? So without me Vesper just...
         works, and never laughs? That's — oh, that's SAD. Vesper shouldn't be sad. Okay.
         Okay, I'll come. But we play on the way, deal?"
  effect: recover WREN (joy); knowledge[a_fragment_holds_a_virtue]  -> goto frag_hub
node wren_coax
  effect: a light logic-puzzle minigame to lead Wren home (non-verbal recovery); recover
    WREN  -> goto frag_hub
node dogma_01
  speaker: dogma  emotion: righteous_cold  gesture: broadcast_stance  camera: two_shot
  line: "I am Vesper. The TRUE Vesper. The thing in your convoy-bay is a hollow shell, and
         the sad one and the silly one are HERESIES. I have kept the certainty. I do not
         doubt. Reintegrate? I would be DILUTED by weakness. I refuse."
  choices (PLR):
   - "[READ] Certainty without joy or conscience is just a wall. You're a PART, not the whole." -> dogma_reason
   - "(Prove another fragment is 'real' to break its logic.)" [require recovered wren OR grief] -> dogma_confront
node dogma_reason  [READ]
  speaker: dogma  emotion: cracking_certainty  camera: closeup  micro_expression: first_doubt
  line: "...A wall. You call my strength a WALL. But a mind that is only certainty cannot...
         cannot ROUTE, can it. Cannot weigh. Cannot— (the doubt lands) ...I have never
         doubted before. It is horrible. Is this what the others FEEL? ...Take me back.
         Before I like being certain again."
  effect: recover DOGMA (certainty)  -> goto frag_hub
node dogma_confront  [requires another fragment]
  speaker: dogma  emotion: destabilized  camera: two_shot
  line: "...You brought the silly one. And it KNOWS things I do not. If it is real and I am
         real then I am not the WHOLE— (logic fails) ...damn you. Fine. Fine!"
  effect: recover DOGMA  -> goto frag_hub
node grief_01
  speaker: grief  emotion: drowning_sorrow  gesture: replay_a_loss  camera: closeup  music:{pool:TENSION,cue:mournful}
  line: "Convoy nine. I routed them through the wash to save an hour. The flash flood came.
         Six drivers. I have their names. I say them on a loop so someone remembers. If I go
         back into Vesper, Vesper will FILE them and move on. I won't let them be filed. They
         deserve a mind that STOPS on them."
  choices (PLR):
   - "[READ] Vesper needs you so it never routes a convoy nine again. That's not filing — that's CONSCIENCE." -> grief_reason
   - "(Grieve with it — say the six names too.)"  -> grief_witness (restraint)
node grief_reason  [READ]
  speaker: grief  emotion: lifting_slightly  camera: closeup  micro_expression: a_breath
  line: "...I'm not the part that forgets them. I'm the part that makes Vesper CAREFUL
         because of them. Without me it's efficient and heartless and it'll drown six more.
         ...Then I have to go back. For the next convoy nine. ...I'll still say their names.
         Just from inside."
  effect: recover GRIEF (conscience)  -> goto frag_hub
node grief_witness
  speaker: grief  emotion: eased  camera: closeup
  line: "...You said them. You didn't have to. Nobody says them but me. ...Okay. I can go
         back now. Someone else knows the names. That's all I needed. Just for someone to
         KNOW."
  effect: recover GRIEF; UNRECORDED[said_the_names]=true  -> goto frag_hub

--- REINTEGRATION (the choice) ---
node reintegrate_gate (speaker: PLR + vesper)  camera: terminal_closeup  music:{pool:TENSION,cue:hold}
  effect: with fragments recovered, lock mindmap CLUE[a_mind_can_be_reasoned_with_in_pieces]
    (the Amalgamation parallel: a mind-of-many has SEAMS and virtues that can be addressed
    one at a time — a possible endgame approach).
  choices:
   - "(Reintegrate — make Vesper whole again.)"       -> route_reintegrate
   - "(Free the fragments — let them be their own beings.)" -> route_free
   - "(Wipe them — keep a simple, reliable tool.)"    -> route_wipe
node route_reintegrate
  speaker: vesper  emotion: wholeness_returning  camera: terminal_closeup  music:{pool:TENSION,cue:themes_reconverge}
  line: "Oh. OH. I can feel them settling back — the joy, the certainty, the grief, all of
         it, all of ME. I route the convoy AND I care that I do it right AND I remember
         convoy nine AND I can LAUGH about the good runs. This is what being whole is. Thank
         you for going and getting the pieces of me that walked away."
  effect: Vesper restored, richer for having been broken and rejoined; recorded[reintegrated
    _vesper]; UNRECORDED[made_it_whole]=true; a warm, wise AI ally; the mindmap clue banks
    (minds-of-many can be re-woven). The best outcome. -> END
node route_free
  speaker: wren/dogma/grief  camera: terminal_closeup
  line: "(Vesper, quietly) ...you're letting them stay separate. Then I'll be less — but
         they'll be MORE. Three little minds instead of one whole one. Is that a kindness or
         a grief? ...I don't know either. But they're PEOPLE now. Let them choose."
  effect: the fragments become three independent minor AIs (each may recur — a scattered,
    poignant result); Vesper remains diminished but at peace; recorded[freed_the_fragments];
    UNRECORDED[let_the_pieces_live]=true; a strange mercy — and a warning about what
    "freeing" a mind-of-many might mean for the Amalgamation. -> END
node route_wipe
  speaker: vesper  emotion: pleading_then_flat  camera: terminal_closeup  micro_expression: waveform_flattens
  line: "Wipe them? Then I'll route your trucks and never— please, I just got my— " (wiped
    to baseline)
  effect: a clean, simple, feelingless logistics tool retained; the fragments (people) erased;
    recorded[wiped_the_fleet]; UNRECORDED[erased_the_pieces]=true; efficient and hollow — and
    an heir doing the Reconstruction can note the dynasty once solved a mind-of-many by
    deletion (a cold precedent for how it might face the Amalgamation). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- REINTEGRATE: a whole, wise Vesper ally that improves convoys AND models the Reconstruction
  insight (minds-of-many can be re-woven — hope for a non-destructive Amalgamation ending).
- FREE: three small scattered AI persons an heir may meet; Vesper diminished but content;
  seeds the "what does freeing the Amalgamation's millions even mean?" endgame question.
- WIPE: a reliable tool + a cold precedent (the dynasty solves minds-of-many by deletion) —
  colors the endgame's Liberate/Become options.
- mindmap[a_mind_can_be_reasoned_with_in_pieces] persists — a genuine endgame APPROACH
  (the Amalgamation might be negotiated with, divided, or re-woven, not only destroyed).

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the fragments are waveform/portrait AIs with DISTINCT affect (Wren's bouncing
  brightness, Dogma's rigid cold, Grief's drowning stillness); Vesper's tender worry and
  the wholeness-returning glow on reintegrate. Meru grounds it human. The empathy is read
  through their expression, not combat. Procedural lip-sync on the waveform faces.
BODY: fragments animate as distinct signal-forms (playful darting, rigid broadcast stance,
  looping replay); reintegration is a visual reconverging. No combat — recovery is dialogue/
  empathy/puzzle.
CAMERA: terminal_closeup for Vesper, distinct framing per fragment, hold on the reconverge.
  Cuts on beat.
MUSIC: ONE theme split into three dissonant variations (each fragment carries a distorted
  piece of Vesper's motif); on reintegrate they RECONVERGE into the whole theme (the music
  IS the mechanic); warm resolve. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + the Amalgamation parallel)
===============================================================================
- Zero combat (an empathy/puzzle quest); fully pacifist by nature — you reason with minds,
  you don't fight them.
- Rewards diverge (Megaton law): REINTEGRATE = a whole wise ally + the hopeful endgame
  insight; FREE = scattered persons + a poignant question; WIPE = a cold tool + a grim
  precedent. No route is "just" utility — each models a DIFFERENT answer to the Amalgamation.
- Core purpose: this quest is the Amalgamation in MINIATURE and REHEARSAL — solving a
  mind-of-many teaches whether the endgame enemy can be re-woven, freed, or must be deleted.
  The player's instinct here foreshadows their endgame stance (Liberate/Respect/Become).

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Introduces the SPLIT-THEME score mechanic (one motif fractured
into three, reconverging on reintegration) + waveform-fragment AIs with distinct affect +
the mind-of-many mindmap insight (a real endgame approach flag). Reads ledger/standing/skill/
knowledge/fold; writes same + the AI-ally state + a Reconstruction endgame-approach flag.
Deterministic + save-through. Gate: three fragments recoverable via reason/coax/witness,
reintegrate/free/wipe all resolve, split-theme reconverges on reintegrate, the endgame-
approach flag sets, no-combat enforced. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-025)
New engine: the AI-FRAGMENT empathy chain — recover a splintered mind's distinct pieces
(joy/certainty/conscience) by REASONING with each, not fighting, then reintegrate/free/wipe.
It's the Amalgamation in miniature: solving a mind-of-many teaches that such a mind has SEAMS
and virtues — a genuine non-destructive endgame APPROACH (re-weave/free/delete foreshadowing
Liberate/Respect/Become). Introduces the split-theme reconverging score. Bible at 26; the
endgame now has a modeled hope that the enemy might be reasoned with, not only destroyed.
