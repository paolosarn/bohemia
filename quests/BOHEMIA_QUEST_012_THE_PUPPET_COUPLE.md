# BOHEMIA — QUEST 012: "WHAT THE MIRRORS KEPT"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-011. Tier-2 AMALGAMATION-THREAD conspiracy (Vault #26 Puppet Couple / Cyberpunk
Peralez + tradition XXX Obra-Dinn + the Dream-On no-closure shape). Name from Paolo's
catalog. Second Reconstruction quest — deepens the mystery, and deliberately does NOT
fully resolve (the horror is that you can't fix it).

Design soul: the unseen hand rewrites minds, and knowing doesn't free you. A "clean,"
beloved council pair are being quietly edited between meetings by the Network — and
the player uncovers it but CANNOT cleanly undo it. The dread is powerlessness against
something that reaches into thought itself (proximity to the secret = the Amalgamation
notices). Deepens the Reconstruction and raises the threat.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_mirrors_kept
- tier: 2 (marked investigation; unlocks with Reconstruction progress — ideally after
  Q004, so the player already suspects the Network reaches into minds)
- fold: what the player learns persists (mindmap); the couple's fate (freed-ish,
  exposed, or left puppeted) shapes the district's governance an heir inherits.
- entry_conditions: the player has locked >=1 Reconstruction cluster; a staffer (INES)
  flags that Councillor pair the PERALTAS "aren't themselves lately."
- faction_wires: NETWORK (the hand), COLORFUL/TRADES (the district they govern),
  VOLUNTEERS (a medic who notices the neuro-signs).
- music_pool: TENSION; the cyan-hum motif recurs and INTENSIFIES near the truth; a
  cold, WRONG lullaby motif under the "edited" council scenes (something too smooth).
- ledger_writes: recorded[peraltas_outcome_*]; UNRECORDED[you_saw_the_strings]=true;
  mindmap CLUE[network_edits_minds_between_meetings].
- amalgamation_thread: CORE — advances the Reconstruction AND is the first quest to
  show the Amalgamation editing LIVING people (not just uploading dead ones), a key
  escalation. The Amalgamation "notices" the player harder for solving it.

===============================================================================
## 2. CAST
===============================================================================
- COUNCILLOR TOMAS PERALTA (id: tomas) & COUNCILLOR ADA PERALTA (id: ada) — a devoted,
  incorruptible district-council pair, genuinely loved, who keep the COLORFUL district
  fair. Between sessions their memories are being quietly rewritten so they vote the
  Network's way and never notice the seam. default_emotion: warm_certain (public) ->
  brief_wrongness (when a seam shows). faction: COLORFUL council.
- INES (id: ines) — the Peraltas' staffer; loves them, noticed the small
  discontinuities (a promise unremembered, a scar in the wrong place). The player's way
  in. default_emotion: frightened_loyal.
- DR. SAMA (id: sama) — VOLUNTEERS medic (RECURRING, Q003/Q005); can read the neuro-
  signature of the edits. default_emotion: grave_careful.
- HANDLER (Network, id: handler) — never fully seen; a voice, a signature in the data.
  The reach, not a face.
- THE PLAYER — [READ], [MEDICINE], Reconstruction knowledge, standing shape routes.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
HUB-AND-SPOKE investigation (gather discontinuities from multiple sources; Obra-Dinn
confirm-in-cluster) -> a bottleneck REVELATION -> a resolution that is deliberately
PARTIAL: WARN (they may not believe you — Dream-On), SHIELD (a stopgap that fails over
time), EXPOSE (public, dangerous, incomplete), or USE (leave them puppeted for your
own gain — the dark option). No route fully "frees" them — that's the point.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- INES OPENS IT ---
node open_01
  speaker: ines  emotion: frightened_loyal  gesture: clutch_notes  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "I've worked for them nine years. Last week Councillor Ada thanked me for a
         thing I never did and forgot a thing she PROMISED. Tomas has a scar he didn't
         have Tuesday. They're the best people I know and something is WRONG with them
         and everyone thinks I'm mad."
  -> goto invest_hub

node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Review the council voting record.)"     -> clue_votes   [once]
   - "(Talk to the Peraltas directly.)"          -> clue_couple  [once]
   - "(Have Dr. Sama read them.)"                -> clue_sama    [once]
   - "(Trace who benefits from the votes.)"      -> clue_benefit [once]
   - "(Confront what you've found.)"             -> reveal_gate  [show after 3 clues]

node clue_votes
  speaker: PLR (internal)  camera: closeup_on_record  music:{pool:TENSION,cue:wrong_lullaby}
  line: "(For years the Peraltas voted for the district — water to the poor blocks,
         no sales to outside capital. Then, six months back, small reversals. Each one
         reasonable alone. Together they hand the district's infrastructure, piece by
         piece, toward... the same buyer. And the Peraltas don't remember changing.)"
  effect: mindmap CLUE[votes_drift_toward_the_network]  -> goto invest_hub
node clue_couple
  speaker: ada  emotion: warm_certain  camera: two_shot  micro_expression: brief_wrongness
  line: "The district's never been better managed, and I'll stake my name on it. We'd
         never sell the water rights — why would you even— " (a flicker; her eyes go
         blank a half-second) "—I'm sorry, what were we— of course. Modernization is
         simply prudent. Where was I?"
  effect: mindmap CLUE[the_seam_shows_live] (the player WITNESSES an edit mid-sentence);
    UNRECORDED[you_saw_the_strings]=true  music:{pool:TENSION,cue:cyan_hum_in}  -> goto invest_hub
node clue_sama
  speaker: sama  emotion: grave_careful  gesture: lower_scanner  camera: closeup
  line: "I've seen NeuroLink scarring. This isn't that. There's no hardware. Whatever's
         editing them is doing it REMOTELY — from the memory up. I didn't know that was
         possible. I wish I still didn't."
  effect: mindmap CLUE[edits_are_remote_no_implant] (the escalation: the Amalgamation
    reaches minds directly)  -> goto invest_hub
node clue_benefit
  speaker: PLR (internal)  camera: closeup  micro_expression: n/a
  line: "(Every drifted vote routes value to one broker network — the same signature
         from the servers under the Strip. The Peraltas aren't corrupt. They're
         ANTENNAE. Someone's using the two most trusted people in the district as a
         clean hand.)"
  effect: mindmap CLUE[the_network_is_the_hand] (ties Q002/Q004/Q007)  -> goto invest_hub

--- THE REVELATION (confirm-in-cluster) ---
node reveal_gate  [requires 3+ CLUE nodes incl. the_seam_shows_live]
  speaker: PLR + sama  camera: closeup  music:{pool:TENSION,cue:hold_hum}
  effect: LOCK mindmap TRUTH[the_amalgamation_edits_living_minds] (a MAJOR escalation
    of the Reconstruction — it doesn't just upload the dead, it rewrites the living).
  sama line: "So it's not just hoarding the dead. It's... redecorating the living. If
    it can do this to the Peraltas, it can do it to anyone it gets close enough to.
    Including, I'd guess, us — the closer we get."
  -> goto resolve_gate

--- RESOLUTION (deliberately PARTIAL — no clean fix) ---
node resolve_gate (speaker: PLR)  camera: closeup
  choices:
   - "(Warn the Peraltas directly.)"                    -> route_warn
   - "[MEDICINE] (Shield them — a stopgap dampener.)" [require skill.medicine>=2 AND clue_sama] -> route_shield
   - "(Expose it publicly — the district must know.)"   -> route_expose
   - "(Say nothing. Use their voting for your own ends.)" -> route_use

===============================================================================
## 5. THE ROUTES (none fully frees them — Dream-On no-closure)
===============================================================================
node route_warn
  speaker: tomas  emotion: warm_certain_then_afraid  camera: two_shot  micro_expression: fear_breaks_through
  line: "You're saying my own mind is a... a rented room? That the votes I'm PROUD of
         aren't— " (the edit fights back; his face smooths over) "—that's a paranoid
         fantasy, friend. We're fine. We're FINE." (the smoothing IS the proof)
  effect: they can't hold the knowledge — the edit erases the warning within a day
    (Dream-On: telling them doesn't free them). BUT Ines now believes, and the player
    has an inside witness. recorded[warned_peraltas]; UNRECORDED[they_couldnt_keep_it]=true.
    Partial: awareness banked in Ines, not the couple. -> END
node route_shield  [MEDICINE — a stopgap that DECAYS]
  speaker: sama  emotion: grim_focus  camera: closeup  music:{pool:TENSION,cue:hold}
  line: "A dampener. It'll hold the edits off — for a while. Weeks, maybe. It's a
         bucket under a leak, not a repair. But for those weeks... they'll be THEM.
         They should get to be them. Even briefly."
  effect: for a window, the Peraltas are FREE and lucid — and they use it to quietly
    move against the Network (a real, time-limited win). Then the dampener fails and the
    edits resume UNLESS the player has advanced the Reconstruction elsewhere to strike
    the source. recorded[shielded_peraltas]; UNRECORDED[bought_them_weeks]=true; mindmap
    ally-window. The bittersweet best: dignity on a timer. -> END
node route_expose
  speaker: PLR (public)  camera: wide_plaza  music:{pool:TENSION,cue:cold_reveal}
  line: "Your beloved council is being written like a ledger by the thing under the
         Strip. Don't trust the votes. Don't trust ME either — get close enough to it
         and it writes anyone. That's the point. That's the whole horror."
  effect: the district panics/divides (some believe, some call it slander); the Network,
    exposed, may ABANDON the Peraltas (freeing them — but broken, hollowed by the
    removal) OR double down. recorded[exposed_the_edits]; UNRECORDED[named_the_unseen_hand]
    =true; a public Reconstruction clue (rare, powerful, destabilizing). Governance
    thrown into chaos an heir inherits. The loud, costly, incomplete truth. -> END
node route_use  (the dark option)
  speaker: handler (Network, voice)  emotion: cool_offer  camera: closeup  micro_expression: n/a
  line: "You see the strings. Good. You could pull the mad staffer off them and let us
         keep our... instruments. We'd route a little value your way. Two trusted votes
         are worth more than your silence costs."
  effect: recorded[used_the_puppets]; UNRECORDED[you_took_the_strings]=true; the dynasty
    profits from the couple's stolen agency (a Become-path complicity); the Peraltas stay
    puppeted forever; an heir inherits both the income and the fact that the bloodline
    KNEW and chose the strings. The creeping-normality nadir. -> END

===============================================================================
## 6. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- WARN: Ines carries the truth forward as an inside ally; the Peraltas stay edited but
  the dynasty has an antenna into the Network's method.
- SHIELD: a real (if temporary) window where the couple fought back; if the player later
  strikes the source (endgame Reconstruction), the shield's groundwork pays off; if not,
  the edits resume and an heir finds them puppeted again — but remembered as briefly free.
- EXPOSE: the district's governance is destabilized for generations; the unseen hand is
  publicly named (accelerates later liberation) at the cost of chaos and broken people.
- USE: the dynasty is quietly complicit; income now, rot in the soul; the heaviest mark
  short of the Q009 sacrifice — the family that saw the strings and PULLED them.
- mindmap TRUTH[amalgamation_edits_living_minds] persists across the fold — every later
  Reconstruction quest is darker for knowing the enemy can reach into thought.

===============================================================================
## 7. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the horror is FACIAL — the Peraltas' warm_certain masks with brief_wrongness
  flickers (eyes-blank-mid-sentence, the seam), and on route_warn, fear_breaks_through
  then SMOOTHS OVER in real time (the edit visibly winning on their face — the single
  most unsettling portrait beat in the bible). Sama's grave restraint; Ines's fear.
  Procedural lip-sync; the "smoothing" is a scripted micro-expression override.
BODY: composed council body language with tiny glitches (a repeated gesture, a
  half-second freeze — the treadmill loop stuttering on purpose). No combat core.
CAMERA: two_shots for the council warmth, tight closeups to catch the seams, wide_plaza
  for the expose. The reveal holds on Ada's blank half-second. Cuts on beat.
MUSIC: TENSION + a WRONG LULLABY motif under the edited scenes (too smooth, slightly
  off-key — the uncanny); the cyan-hum intensifies toward the truth; cold_reveal on
  expose. NO warm resolve exists — nothing here fully resolves. 120 BPM.

===============================================================================
## 8. ROUTES + REWARD DIVERGENCE (Pacifist + no-closure)
===============================================================================
- Fully non-combat (an investigation/conspiracy quest); drawing the Dead Eye finds no
  enemy to shoot — the hand is remote (the powerlessness is mechanical, not just tonal).
- Rewards diverge (Megaton law) but ALL are partial (Dream-On): WARN = an ally, not a
  cure; SHIELD = weeks of dignity on a timer; EXPOSE = a named enemy + chaos; USE =
  profit + complicity. The absence of a clean win IS the design — the enemy that edits
  minds cannot be fixed by one quest, only resisted, exposed, or served.
- This escalates the Amalgamation from "hoards the dead" to "rewrites the living" — the
  threat's proximity-trigger tightens (solving this makes the Amalgamation notice you).

===============================================================================
## 9. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Advances the Reconstruction mindmap with a MAJOR truth-node
(edits_living_minds) and introduces the "scripted micro-expression override" (the edit
smoothing a face in real time) as reusable tech for later Amalgamation-touch scenes.
Reads ledger/standing/skill/knowledge/fold; writes same + governance-state + the truth
node. Deterministic + save-through; knowledge persists across fold. Gate: 3-clue cluster
locks the truth, all four routes resolve as PARTIAL (no route sets a "cured" flag), the
face-smoothing override fires on warn, governance-state persists. Joins the suite.

## 10. WHAT THIS PROVES (vs 001-011)
Second Reconstruction quest + the NO-CLOSURE engine: a conspiracy where the player
uncovers the truth but cannot cleanly fix it (Dream-On), escalating the Amalgamation
from uploading the dead to EDITING THE LIVING. It proves the bible can hold dread built
on POWERLESSNESS (not combat), introduces the face-smoothing override, and ties the
Reconstruction to district governance. Bible at 12; the mystery now has two threads and
a rising, unfixable menace.
