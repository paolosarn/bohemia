# BOHEMIA — QUEST 042: "THE UNMARKED GRAVE"
Full production build. Built to the dialogue/scene spec; template = 001-041. Tier-3
COLD-CASE / delayed-consequence (tradition XXX Obra-Dinn deduction + the fold's "the past
resurfaces" mechanic + recorded-vs-unrecorded ledger). Name catalog-adjacent. A NEXT-
GENERATION quest: an unmarked grave surfaces a crime the PRIOR dynasty was involved in — the
heir must investigate their own bloodline's buried history. Proves the fold's "your past
literally comes back" reactivity.

Design soul: the dead don't stay buried, and neither do the choices. An unmarked grave is
found, and the investigation leads back to something the PREVIOUS dynasty did (per prior-quest
flags) — a killing, a betrayal, an abandonment. The heir must uncover the truth about their own
parent and decide whether to expose it, bury it deeper, or make amends. The fold made a quest:
the past you played resurfaces to be reckoned with.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_unmarked_grave
- tier: 3 (a next-gen cold case; reads prior-dynasty UNRECORDED flags)
- fold: how the heir handles the resurfaced crime (expose / bury / amend) shapes the dynasty's
  moral trajectory and whether the buried past keeps resurfacing.
- entry_conditions: (next dynasty) an unmarked grave is unearthed during construction; the remains
  tie to an event the PRIOR dynasty caused (branches on which UNRECORDED flags exist).
- faction_wires: whichever faction the buried crime touched (per prior flags); VOLUNTEERS (proper
  burial), the district's memory.
- music_pool: TENSION; a cold-case motif (a buried version of the LEGACY theme — the dynasty's own
  sin, surfacing); resolve varies.
- ledger_writes: recorded[grave_outcome_*]; UNRECORDED[what_you_did_with_the_body];
  the dynasty's moral-trajectory flag.
- amalgamation_thread: LIGHT-optional — if the prior crime was Amalgamation-linked (e.g. Q009 fold,
  Q010 kill), the grave ties to the Reconstruction; otherwise purely human.

===============================================================================
## 2. CAST
===============================================================================
- THE REMAINS / THE VICTIM — identified through investigation; WHO they are branches on prior flags
  (e.g. the ferryman stopped, the sentinel killed, the innocent enforced, the companion folded).
- THE FINDER / DIGGER ROSK (id: rosk) — unearthed the grave; wants to know what to report. default_
  emotion: unsettled_honest. faction: TRADES.
- A SURVIVOR/KIN (id: kin) — someone connected to the victim, still alive, who's wondered for years
  what happened. default_emotion: long_grief. faction: varies.
- THE WITNESS (id: witness) — the recurring old ally who knew the prior dynast; can confirm the truth.
  default_emotion: reluctant_honest.
- THE PLAYER (the heir) — [READ]/[MEDICINE] (identify the remains), reckoning with the parent's sin.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
COLD-CASE DEDUCTION (identify the remains, trace them to the prior dynasty's act — confirm-in-cluster)
-> the RECKONING: EXPOSE (the truth, publicly — honor the dead, shame the bloodline), BURY (deeper —
protect the dynasty's name), AMEND (make it right with the kin — atonement), or, if innocent-of-this,
CLEAR the name (if the crime wasn't actually the dynasty's). The past made a quest.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: rosk  emotion: unsettled_honest  gesture: wipe_dirt_from_a_find  camera: two_shot
  music:{pool:TENSION,cue:cold_case_enter}
  line: "Digging the new foundation and we hit bones. Unmarked. Old — but not old enough to be
         nothing. There's a— there's a personal effect with it, and it's got a mark I RECOGNIZE.
         Your family's mark. Boss, I didn't want to be the one to find this. But you should know
         before anyone else does. What do you want me to do?"
  -> goto invest_hub
node invest_hub (speaker: PLR/heir)  camera: over_shoulder_player
  choices:
   - "[MEDICINE] (Identify the remains.)"          -> clue_remains [require skill.medicine>=2][once]
   - "(Examine the personal effect + your family's mark.)" -> clue_effect [once]
   - "(Ask the Witness what the prior dynast did.)" -> witness_01  [once]
   - "(Find the victim's kin.)"                      -> kin_01       [once]
   - "(Decide what to do with the truth.)"           -> reckon_gate  [show after 2 clues]
node clue_remains  [MEDICINE]
  speaker: PLR/heir (internal)  camera: closeup  music:{pool:TENSION,cue:cold_low}
  line: (branches on prior UNRECORDED flags — e.g.) "(The remains tell a story: [an old man, no
         violence — the ferryman stopped, who died in a cot and was buried quiet] / [a wired skull —
         the sentinel the dynasty killed] / [a young frame — the innocent enforced into ruin]. Whoever
         this was, my bloodline put them here. And never marked it.)"
  effect: knowledge[the_remains_tie_to_the_prior_dynasty] (the specific victim per prior flags)  -> goto invest_hub
node clue_effect
  speaker: PLR/heir (internal)  camera: closeup_on_effect
  line: "(The personal effect beside the bones bears my family's mark — a token the prior dynast
         carried, left with the body. Not hidden. Almost... KEPT. Like they wanted, someday, someone
         to find this and know. Or like they couldn't bear to take the last of the victim away too.)"
  effect: knowledge[the_prior_dynast_left_a_marker] (ambiguous — shame or a buried confession?)  -> goto invest_hub
node witness_01
  speaker: witness  emotion: reluctant_honest  gesture: long_pause  camera: two_shot
  line: "...I wondered if this day would come. Yes. Your parent did this. I was there, or near it.
         It wasn't cruelty — it was a choice made in a hard hour, the kind that looked necessary and
         never stopped weighing. They carried it to the grave. Now it's yours to carry, or to set
         down. I won't tell you which. But I'll tell you the truth, whole, if you want it."
  effect: knowledge[the_full_context_of_the_act] (the prior choice, with its hard-hour context — not
    absolution, but not a cartoon either)  -> goto invest_hub
node kin_01
  speaker: kin  emotion: long_grief  gesture: clutch_an_old_keepsake  camera: closeup
  line: "You're asking about them? After all this time? I gave up on ever knowing. They just...
         didn't come home, and the years ate the question. If you know something — ANYTHING — tell me.
         I've grieved a mystery for twenty years. I'd rather grieve a truth. Even a hard one. Please."
  effect: knowledge[the_kin_needs_the_truth] (someone still waiting for an answer the dynasty owes)
  -> goto invest_hub

--- THE RECKONING ---
node reckon_gate (speaker: PLR/heir)  camera: closeup  music:{pool:TENSION,cue:hold}
  choices:
   - "(Expose the truth — mark the grave, name the deed.)"   -> route_expose
   - "(Bury it deeper — protect the dynasty's name.)"         -> route_bury
   - "(Amend it — give the kin the truth + make it right.)"   -> route_amend
   - "(If the crime wasn't the dynasty's — clear the name.)" [if flags show innocence] -> route_clear
node route_expose
  speaker: heir  emotion: grave_resolved  camera: two_shot  music:{pool:TENSION,cue:solemn_resolve}
  line: "We mark the grave. With their name and the truth of how they got here — even though it shames
         my blood. The dead earned a marker more than my family earned a clean legend. Let the district
         see that this dynasty tells the truth even about ITSELF. Especially about itself."
  effect: the truth is public; the grave marked; the dynasty's name takes a hit BUT earns a reputation
    for brutal honesty (some respect it deeply); recorded[exposed_the_grave]; UNRECORDED[named_our_own
    _sin]=true; the honest, costly reckoning (the anti-CONCEAL of Q041 — a dynasty that faces itself). -> END
node route_bury
  speaker: heir  emotion: guarded_uneasy  camera: closeup  micro_expression: wont_meet_the_witness
  line: "...Rebury them. Deeper. No mark. What good does dragging my parent's worst hour into the light
         do now? The dead stay dead either way. The dynasty needs its name more than a stranger's bones
         need a story. ...I'll live with choosing this. Somehow."
  effect: the crime is reburied (name protected, truth denied); the kin never learns; a moral-trajectory
    stain (the dynasty hides its own — Q041 CONCEAL deepened); the buried past may resurface AGAIN later
    (the fold keeps the debt); recorded[buried_it_deeper]; UNRECORDED[hid_our_own_sin]=true. -> END
node route_amend
  speaker: kin  emotion: shattered_grateful  camera: closeup  micro_expression: tears_of_closure
  line: "...It was your parent. And you came to tell me anyway, and to make it— you didn't have to.
         You could've let me die not knowing. ...Thank you. For the truth. For the marker. For not
         making me grieve a mystery one more year. Your blood did this — but YOU did THIS. And this
         is the part I'll remember."
  effect: the kin gets the truth + amends (a proper burial, restitution, honor); the dynasty's sin is
    acknowledged AND partly redeemed by the heir's honesty; recorded[amended_the_grave]; UNRECORDED
    [made_it_right]=true; the atonement route (the Q038/Q041 forgiveness-line, chosen by the heir for
    the PARENT'S sin — you can't undo it, but you can face it); deep kin/faction goodwill. -> END
node route_clear
  speaker: heir  emotion: relief_then_resolve  camera: two_shot
  line: "...The mark's ours but the deed ISN'T — the records clear it. My parent buried them out of
         MERCY, not murder — gave a nameless victim a grave when no one else would. This isn't our
         sin. It's our KINDNESS, mistaken for a crime. Mark it true: not 'here lies our shame,' but
         'here lies one my family wouldn't leave unburied.'"
  effect (if prior flags show the act was merciful, e.g. a compassionate burial not a killing): the
    dynasty's name is CLEARED + honored; the "crime" was a grace; recorded[cleared_the_name]; UNRECORDED
    [it_was_mercy_not_murder]=true; the vindication route (not every buried thing is a sin — the fold
    can surface GRACE too). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- EXPOSE: the dynasty's honest-even-about-itself rep (respected + shamed); an heir inherits a bloodline
  that faces its own history; the grave marked forever.
- BURY: the name protected on a buried truth; the past resurfaces AGAIN later (the fold won't let the
  debt rest — a recurring liability); the CONCEAL-line deepened.
- AMEND: the sin acknowledged + redeemed by the heir's honesty; kin/faction goodwill; the atonement-
  across-generations line (you can face a parent's sin even if you can't undo it).
- CLEAR: the name vindicated; the "crime" revealed as a grace; the fold surfaced GOOD, not just guilt
  (proof the past isn't only sins).
- The moral-trajectory flag compounds with Q041's stance — the dynasty's relationship to its own truth
  deepens each generation.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the heir reckoning with a parent's face they'll never see again (grave_resolved / guarded_uneasy);
  the kin's long grief and its closure (tears_of_closure); the witness's reluctant honesty. The remains
  themselves are a readable place-node (Q028/Q042 environmental deduction). Procedural lip-sync.
BODY: the dig site is a staged scene (scheduler); examining remains/effect is a hands-on deduction beat;
  the reburial/marking is a world-state change. No combat (a reckoning).
CAMERA: two_shots at the grave, closeup on the remains + the family mark, closeup on the kin's closure.
  Cuts on beat.
MUSIC: a COLD-CASE motif — a buried, minor-key version of the LEGACY theme (the dynasty's own theme,
  surfacing as its own sin); solemn resolve on expose/amend, uneasy low on bury, a warm turn on clear.
  The dynasty's music haunting itself. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (the fold resurfaces)
===============================================================================
- Fully pacifist (a cold-case reckoning); no combat.
- Rewards diverge (Megaton law): EXPOSE = honest rep + a shamed name; BURY = protected name + a
  resurfacing debt; AMEND = atonement + goodwill; CLEAR = vindication (if it was mercy). The "reward" is
  the dynasty's moral trajectory + whether the past rests or returns.
- Core purpose: the FOLD'S "your past resurfaces" reactivity — a quest that reads the PRIOR dynasty's
  UNRECORDED flags and makes the heir reckon with them. Proves consequence-across-time from the far side:
  the choices you made as one dynast literally dig themselves up for the next to face (Q038/Q040/Q041
  through-line, now with teeth in a later generation).

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON that READS prior-dynasty UNRECORDED flags to determine the victim + context
(the fold's resurfacing mechanic). Uses cold-case deduction + readable remains place-nodes + the buried-
LEGACY-motif score. Reads ledger/prior-flags/standing/skill/fold; writes same + moral-trajectory + a
resurface flag (bury). Deterministic + save-through. Gate: the victim/context branch correctly on prior
flags, deduction confirms-in-cluster, all four reckonings resolve, clear gated behind mercy-flags, bury
sets a resurface debt, the buried-LEGACY motif plays. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-041)
The FOLD'S RESURFACING MECHANIC as a quest: an unmarked grave reads the PRIOR dynasty's UNRECORDED flags,
forcing the heir to reckon with a parent's buried act (expose/bury/amend/clear). Proves consequence-
across-time from the receiving generation — the choices made as one dynast literally dig themselves up
for the next (Q038/Q040/Q041 through-line with teeth). CLEAR proves the fold can surface GRACE, not only
guilt; BURY proves hidden debts return. Introduces the buried-LEGACY-motif (the dynasty's theme haunting
itself). Bible at 42; the past you played is now a place the next generation excavates.
