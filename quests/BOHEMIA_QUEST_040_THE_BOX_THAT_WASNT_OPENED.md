# BOHEMIA — QUEST 040: "THE BOX THAT WASN'T OPENED"
Full production build. Built to the dialogue/scene spec; template = 001-039. Tier-1
PILLAR, SUCCESSION / the Family Box (the Succession System canon + the recorded-vs-unrecorded
ledger + generational-persistence + the device/credential concept). Name catalog-adjacent. The
succession pillar: the current dynast is dying, and the quest is choosing an HEIR and deciding
what passes down in the Family Box — the mechanic Paolo flagged as Bohemia's signature.

Design soul: the whole game is about what survives a death — this is the death, and the passing.
The dynast is dying; the quest is the SUCCESSION: who inherits, what goes in the Family Box (the
unrecorded ledger of the dynasty's true history), and what secrets, debts, and gifts pass to the
next generation. It cashes in the fold system and sets up the next dynasty's starting state.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_family_box
- tier: 1 (PILLAR; the GENERATIONAL HINGE — ends one dynasty chapter, begins the next)
- fold: THIS quest IS the fold event — it determines the heir, the Family Box contents, and the
  starting conditions (assets, debts, secrets, reputation) the next dynasty inherits.
- entry_conditions: the current dynast is dying (age/injury/story); the succession must be decided
  before they pass.
- faction_wires: ALL — the heir's relationships, the district-order (Q039), the credential
  (Q009/Q023), every persistent flag converges here.
- music_pool: a solemn LEGACY motif (the dynasty's own theme, matured); warm or heavy by what's
  passed; a hopeful open at the new dawn.
- ledger_writes: recorded[succession_outcome_*]; the FAMILY BOX contents (the unrecorded ledger,
  the credential, relics, debts, secrets); the NEXT-DYNASTY starting state.
- amalgamation_thread: HIGH — the endgame CREDENTIAL/console (Q009/Q023), the Reconstruction
  knowledge, and the Amalgamation-threat level all pass (or don't) through the Box to the heir.

===============================================================================
## 2. CAST
===============================================================================
- THE DYING DYNAST (id: dynast) — the player's current character, at the end; lucid, reckoning
  with what they built and what they'll pass on. default_emotion: spent_clear.
- THE HEIR CANDIDATES (id: heirs) — 2-3 possible successors, each shaped by prior quests (a child
  raised hard or gentle — Q003; a loyal companion; a chosen protege). Each inherits DIFFERENTLY
  (different starting traits/relationships). default_emotion: varies.
- THE WITNESS (id: witness) — an old ally (recurring NPC, e.g. Dr. Sama / a faction elder) who
  helps the dynast decide and keeps the Box honest. default_emotion: faithful_grave.
- THE FAMILY BOX — the physical unrecorded ledger + relics + the credential; what the dynasty
  REALLY was, passed hand to hand, off the official record.
- THE PLAYER — makes the final calls: heir, Box contents, last words, what truth passes down.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
DELIBERATE SUCCESSION (not a fight — a reckoning): review the dynasty's life (the ledger), CHOOSE
an heir, DECIDE what goes in the Box (each inclusion/omission a consequence), and set the last
truth. RESOLUTION = the next dynasty's starting state. The "choices" are what to PASS DOWN:
the credential, the debts, the secrets, the reputation, the grudges, the grace.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: dynast  emotion: spent_clear  gesture: hand_on_the_box  camera: closeup
  music:{pool:LEGACY,cue:soft_enter}
  line: "So this is the end of my chapter. I can feel it. There's a Box here — my parent gave it to
         me, and theirs to them, all the way back. It's not the official ledger. It's the TRUE one.
         Everything we really did, everything we really were, passed hand to hand so the next of us
         starts knowing. Before I go, I decide what goes in it, and who opens it next. Help me get
         this right. It's the only thing that outlasts me."
  -> goto succession_hub
node succession_hub (speaker: PLR)  camera: bedside  music:{pool:LEGACY,cue:low}
  choices:
   - "(Review the life — read the unrecorded ledger.)"  -> review_ledger [once]
   - "(Choose the heir.)"                                 -> heir_gate     [once]
   - "(Decide what goes in the Box.)"                     -> box_gate      [after heir]
   - "(Speak the last truth + pass it on.)"               -> passing_gate  [after box]
node review_ledger
  speaker: dynast  emotion: reckoning  camera: closeup  micro_expression: complicated_peace
  line: "(the unrecorded ledger — everything the official record never held) Look at it all. The
         ferryman I rowed out or the one I stopped. The companion I spent for a key, or the one I
         wouldn't. The march I walked too far, or turned back from. The debt I forgave, or enforced.
         The machine I fed, or starved. None of it's in the district's books. All of it's in ME. And
         now it goes in the Box, so my heir starts with the TRUTH of us — not the legend."
  effect: surfaces the cumulative UNRECORDED ledger (every prior quest's hidden flag) — the dynasty's
    true history, made visible at the end (the recorded-vs-unrecorded payoff)  -> goto succession_hub

--- CHOOSE THE HEIR ---
node heir_gate (speaker: PLR)  camera: two_shot
  effect: present 2-3 heir candidates, each shaped by prior quests; choosing sets the next dynasty's
    base traits + relationships.
  choices:
   - "(The child you raised — hardened or gentle per Q003/upbringing.)"  -> heir_child
   - "(The loyal companion — if one survived Q009/etc.)"                  -> heir_companion
   - "(A chosen protege — merit over blood.)"                             -> heir_protege
node heir_child
  speaker: dynast  emotion: parental  camera: closeup
  line (if raised gentle): "You'll inherit a soft heart in a hard world. It'll cost you and save you.
         Lead with it anyway. It's the best of what I had."
  line (if raised hard): "I made you tough because the world is. I hope I didn't make you COLD. The
         Box'll show you where hard helped and where it hurt. Learn the difference I didn't."
  effect: heir = the child (traits per upbringing — Q003 pays off); recorded[heir_is_child]  -> goto succession_hub
node heir_companion
  speaker: dynast  emotion: trusting  camera: two_shot
  line: "Not my blood, but my chosen. You stood by this dynasty when you didn't have to. Carry it now.
         The blood was never the point — the LOYALTY was."
  effect: heir = the companion (inherits their existing bonds/skills); recorded[heir_is_companion]  -> goto succession_hub
node heir_protege
  speaker: dynast  emotion: deliberate  camera: closeup
  line: "Merit, not blood. You're the best of the next generation and this dynasty is bigger than one
         bloodline. Some will call it a betrayal of the line. I call it choosing the FUTURE over the
         name."
  effect: heir = protege (a merit-line — different faction reactions); recorded[heir_is_protege]  -> goto succession_hub

--- WHAT GOES IN THE BOX ---
node box_gate (speaker: PLR)  camera: closeup  music:{pool:LEGACY,cue:hold}
  effect: decide what the heir inherits — each a real consequence for the next dynasty.
  choices (multi-select — the Box holds several):
   - "(The CREDENTIAL/console — the endgame key.)" [if obtained Q009/Q023] -> box_credential
   - "(The full TRUTH — every unrecorded sin and grace.)"                   -> box_truth
   - "(A curated truth — spare the heir the worst.)"                        -> box_curated
   - "(The debts + grudges — what's still owed.)"                           -> box_debts
   - "(The Reconstruction knowledge — where the machine sleeps + its weakness.)" [if learned] -> box_reconstruction
   - "(Done — seal the Box.)"                                                -> passing_gate
node box_credential
  effect: the endgame CREDENTIAL/console passes to the heir (they START the next chapter able to
    approach the Amalgamation — the liberation path stays open across the fold); recorded[passed_the
    _credential]; UNRECORDED[the_key_survives]=true.  -> goto box_gate
node box_truth
  effect: the FULL unrecorded ledger passes — the heir starts knowing every sin and grace (a heavy
    but honest inheritance; the heir can ATONE for or continue the dynasty's real history);
    recorded[passed_the_full_truth]; UNRECORDED[hid_nothing]=true.  -> goto box_gate
node box_curated
  effect: a CURATED truth passes — the dynast spares the heir the worst (protective, but the heir
    starts on a partial legend, and hidden sins may resurface — the Q038 precedent applies: hiding
    inherited guilt has a cost); recorded[curated_the_box]; UNRECORDED[spared_them_the_worst]=true.
    -> goto box_gate
node box_debts
  effect: the outstanding debts/grudges pass (the heir inherits both what's OWED to the dynasty and
    what the dynasty owes — the reputation web from Q027/Q039 carries forward); recorded[passed_the
    _debts]; UNRECORDED[the_ledger_carries]=true.  -> goto box_gate
node box_reconstruction
  effect: the RECONSTRUCTION knowledge passes — location (Q018), weakness (Q015), growth-method (Q029),
    negotiation-hope (Q026), interface (Q023) — the heir starts the endgame mystery ALREADY SOLVED
    (the dynasty's greatest inheritance: the truth about the enemy); recorded[passed_the_reconstruction];
    UNRECORDED[the_truth_survives]=true.  -> goto box_gate

--- THE PASSING ---
node passing_gate (speaker: dynast + heir)  camera: two_shot  music:{pool:LEGACY,cue:passing}
  line (dynast): "It's yours now — the Box, the name, the district, all of it. I'm not afraid. My
         parent went into this same dark and I turned out... well, you'll read the Box and judge. Do
         better than me where you can. Forgive me where you can't. And when it's YOUR turn at this
         bedside — pass it on honest. That's the only rule that ever mattered. ...Go on. Open it when
         I'm gone. Not before."
  choices (PLR — the last truth):
   - "(A last word of grace.)"     -> end_grace
   - "(A last warning.)"           -> end_warning
   - "(A last confession.)"        -> end_confession
node end_grace
  speaker: heir  emotion: tearful_resolved  camera: closeup  music:{pool:LEGACY,cue:new_dawn}
  line: "...I'll carry it. All of it. And I'll pass it on honest, like you said. Rest now. The
         dynasty holds. I've got it from here."
  effect: succession complete; the NEXT DYNASTY begins with the chosen heir + the Box contents + the
    district-order (Q039) + all passed flags as its starting state; recorded[succession_grace];
    UNRECORDED[passed_it_on_honest]=true. The generational hinge turns — the game continues into the
    next chapter, everything you built (and hid) now the heir's foundation. -> END
node end_warning
  speaker: dynast  emotion: urgent_fading  camera: closeup
  line: "One thing — the thing under the Strip. It's real, it's awake, and everything I learned about
         it is in the Box. Don't let them tell you it's a god or a ghost. It's a MACHINE that eats the
         dead and it can be beaten. Finish what I couldn't. Promise me. ...good. ...good."
  effect: succession complete + the Amalgamation-threat foregrounded for the heir (endgame primed);
    recorded[succession_warning]; the next chapter opens aimed at the enemy. -> END
node end_confession
  speaker: dynast  emotion: unburdening  camera: closeup  micro_expression: final_honesty
  line: "Before I go — the worst thing I did. It's in the Box, but you should hear it from ME, not
         read it cold. (the dynast names their heaviest UNRECORDED sin — the companion folded, the
         march marched, the innocent enforced) I did it. I own it. Don't carry the guilt — carry the
         LESSON. That's the difference between a curse and an inheritance."
  effect: succession complete + the dynast's heaviest sin passed as a LESSON not a curse (the Q038
    through-line resolved for the dynasty itself — guilt transformed into wisdom); recorded[succession
    _confession]; UNRECORDED[turned_the_curse_to_a_lesson]=true. The most honest passing. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD (this quest IS the fold hinge)
===============================================================================
- The HEIR choice sets the next dynasty's base (child = upbringing traits; companion = existing bonds;
  protege = merit-line + mixed faction reactions).
- The BOX contents set the next dynasty's starting inheritance: the CREDENTIAL (endgame stays open),
  the full/curated TRUTH (honest vs protected start — Q038 precedent applies), the DEBTS (the rep web
  carries), the RECONSTRUCTION knowledge (endgame mystery pre-solved).
- The LAST TRUTH (grace/warning/confession) sets the heir's emotional + strategic orientation (aimed
  at the enemy, unburdened, or carrying a lesson).
- The DISTRICT-ORDER (Q039) + every persistent flag flow through this hinge into the next chapter.
- This is the SIGNATURE MECHANIC: the game literally continues as the next dynasty, starting from
  everything you chose to pass (or hide) — "what survives when a life ends" made the core loop.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the dying dynast's spent clarity (complicated_peace, final_honesty) — a whole playthrough's
  weight in one face at the end; the heir's tearful resolve; the witness's grave faith. The most
  intimate portrait work in the bible (a deathbed, not a battle). Procedural lip-sync, quiet.
BODY: a bedside scene (minimal, still — the hand on the Box the key gesture); the Box itself a
  rendered relic (the unrecorded ledger + credential + relics). No combat — this is a passing.
CAMERA: closeups dominate (the deathbed intimacy); the Box gets a hold (the object that outlasts);
  a two_shot for the passing; a hopeful wide at the new dawn (the heir standing). Cuts slow, gentle.
MUSIC: the dynasty's OWN theme, matured into a solemn LEGACY motif; heavy or warm by what's passed;
  a hopeful new-dawn open at the end (the next chapter beginning). The dynasty's leitmotif, aged. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (the signature mechanic)
===============================================================================
- Zero combat (a deathbed reckoning); the pillar is pure consequence.
- "Rewards" diverge as the NEXT DYNASTY'S STARTING STATE (the ultimate Megaton divergence — the whole
  next chapter is the reward/consequence): heir traits, Box inheritance, district-order, the endgame
  key + knowledge, the emotional orientation. Nothing is "loot" — everything is INHERITANCE.
- Core purpose: the SUCCESSION SYSTEM, Bohemia's signature mechanic (Paolo-flagged for self-patenting),
  dramatized as a quest — "what survives when a life ends" is the whole game's thesis, and here it's
  the literal core loop: you die, you choose what passes, the game continues as your heir starting from
  your true (or curated) history.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON as the SUCCESSION HINGE — the fold event that reads the ENTIRE cumulative
state (all unrecorded flags, district-order, credential, Reconstruction knowledge, reputation web) and
writes the NEXT-DYNASTY starting state (heir traits + Box contents + inherited flags). The signature
Succession-System mechanic. Reads EVERYTHING; writes the next chapter's initial conditions.
Deterministic + save-through. Gate: the unrecorded ledger surfaces the full flag history, heir choice
sets base traits, Box multi-select passes each inheritance correctly, the last-truth sets orientation,
the next-dynasty starting state initializes from all passed flags, the Q038 curated-truth precedent
applies. Joins the suite. (Note: this is the fold-hinge; it hands off to the next dynasty's first quest.)

## 9. WHAT THIS PROVES (vs 001-039)
The SIGNATURE MECHANIC as a PILLAR: the Succession System dramatized — the dynast dies, and the player
chooses the HEIR and what passes in the FAMILY BOX (the unrecorded true history, the endgame credential,
the Reconstruction knowledge, the debts, the last truth). It cashes in the ENTIRE cumulative state and
sets the next dynasty's starting conditions — "what survives when a life ends" made the literal core
loop. Resolves the recorded-vs-unrecorded ledger, the Q038 inheritance precedent, and the generational-
persistence canon in one hinge. Bible at 40; the game now has its beating heart — the death and the
passing that turns one dynasty into the next.
