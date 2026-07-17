# BOHEMIA QUESTBOOK — DEEP DIVE 54: PURE DEDUCTION / ASSEMBLE-THE-WORDS ACCUSATION (The Case of the Golden Idol)
Full teardown, the whole enchilada: the Exploring/Thinking two-mode loop, the Mad-Libs fill-in-the-blank
deduction with a SINGLE correct solution, the interconnected cases across 40 years, the puzzle-gated hint
system, red herrings, the "trust the player / no handholding" design, show-don't-tell environmental
story, the honest flaws, and Bohemia ports. This is the medium's most ACCESSIBLE model for REAL DEDUCTION
AS GAMEPLAY — feeling like a detective through mechanics, not narrative flavor. Obra Dinn's sibling. Color
Gray Games. Reference only; Paolo does not read it. No Bohemia quest written here.

Game: The Case of the Golden Idol (Color Gray Games, 2022) + The Rise of the Golden Idol (2024). A point-
and-click DEDUCTION detective game. You examine frozen crime-scene tableaux, gather color-coded WORDS
(names, verbs, objects) from the environment, then drag them into fill-in-the-blank case summaries to
deduce WHO died, WHO killed them, HOW, and WHY. Twelve cases span 40 years, following a cursed golden
idol. IGF Excellence in Design; a modern deduction-genre landmark. No combat.

===============================================================================
## 0. THE CORE IDEA (why it's in the canon)
===============================================================================
- REAL DEDUCTION AS GAMEPLAY (not "pretend detective"): designer Andrejs Klavins names the exact problem
  they set out to solve — most "detective" games make you feel like a sleuth through NARRATIVE FLAVOR,
  not gameplay ("pretend detective games" offer 3 choices, denying the actual act of deduction). Golden
  Idol (like Obra Dinn Q19 + Her Story) makes you ACTUALLY reason — "the game won't guide you; you piece
  every clue together yourself." The FEELING of being a detective comes from the MECHANIC (cf. Obra Dinn
  Q19, Outer Wilds Q18; deduction as a real verb, not a cutscene).
- THE FILL-IN-THE-BLANK ACCUSATION (the elegant input solution): the core design problem in deduction
  games is HOW the player communicates "I figured it out." Text parsers = frustrating syntax; multiple-
  choice = no real deduction. Golden Idol's answer: drag color-coded WORDS (nouns/verbs/names) from a
  gathered word-bank into Mad-Libs SENTENCES describing the crime. Flexible enough for real reasoning,
  structured enough to be inputtable — a SINGLE correct solution out of thousands of permutations (cf.
  Obra Dinn's fate-dropdowns Q19; the accessible deduction-input model — key for OUR platform).
- SHOW, DON'T TELL (environmental story-assembly): the story is told through the ENVIRONMENT — you rifle
  pockets, read discarded notes, cross-reference. Nothing is narrated at you; you ASSEMBLE the narrative
  yourself from oblique details. "A masterclass in showing instead of telling" (cf. our unrecorded-ledger/
  [READ] — the player reconstructs truth from evidence).

===============================================================================
## 1. THE ARCHITECTURE (how real deduction is made playable)
===============================================================================

### THE TWO-MODE LOOP (Exploring <-> Thinking)
- EXPLORING: navigate a static point-and-click tableau (a frozen moment at/after a death), examine rooms,
  pockets, cabinets, garbage — highlighted WORDS get added to a bottom-screen word-bank. You can't modify
  the scene; you OBSERVE.
- THINKING: fill-in-the-blank puzzles — drag word-bank nouns/verbs/names into sentences describing the
  plot (+ variants: name the characters, translate symbols, compute numbers). Correct sections LOCK
  (feedback you got them right); complete all -> the game summarizes what happened -> next case.
- The clean OBSERVE-then-DEDUCE loop separates gathering from reasoning — a legible, repeatable structure
  (cf. Obra Dinn Q19's find-then-identify, our explore/deduce potential).

### PARTIAL-LOCK FEEDBACK (the frustration fix — key craft)
- Early demos told players only "correct/incorrect" for a whole scene — with complex cases, players got
  FRUSTRATED (many places to be wrong, no idea WHICH). The fix: SECTION-LOCKING (a correct sub-section
  locks) + extra puzzles (name-the-people, a custom puzzle per scene) + a "two or fewer slots incorrect"
  indicator — so players feel PROGRESS + get rewarded for being close. Granular feedback keeps hard
  deduction SATISFYING not maddening (cf. Obra Dinn's 3-correct-locks Q19, our RULE OF THREE; the
  fairness-feedback principle).

### INTERCONNECTED CASES (the through-line across 40 years)
- 12 cases are SEQUENTIAL in time + causally linked — one scene DIRECTLY results from the last (a death ->
  the next case is the reading of that person's will). You must REMEMBER names/faces across cases + carry
  knowledge forward; late cases require connecting back to early ones. A macro-story built from micro-
  mysteries — each self-contained yet part of a web (cf. our episodic-quests-in-a-larger-arc, Obra Dinn's
  ship-wide mystery Q19).

### THE PUZZLE-GATED HINT SYSTEM (help without spoiling — steal this)
- Stuck? The hint button gives you ANOTHER PUZZLE to solve to UNLOCK the hint (or a short wait/ritual in
  the sequel) — "something more games should use." Help is available but you still EARN it; it never just
  hands you the answer (cf. our optional-help/accessibility design; assist without removing the act).

### RED HERRINGS + THE MURDERERS HIDE THEIR TRACKS
- Because the in-fiction murderers CONCEAL their tracks, the format is fertile for MISDIRECTS + red
  herrings — not every gathered word is useful; some clues mislead. The challenge is separating signal
  from noise, which is the DETECTIVE'S real skill (cf. Obra Dinn Q19, our evidence-vs-noise).

### CARICATURE + TONE (grounding the grim)
- Over-the-top caricature characters + absurd politics (a law banning outlandish clothing) keep the
  frequent grisly murders from being unrelentingly bleak — comedy balances the tragedy (cf. Yakuza tonal-
  range Q13, our tone; humor as a pressure-valve on darkness).

===============================================================================
## 2. THE HONEST FLAWS (banked)
===============================================================================
- FILL-IN-THE-BLANK LIMITS OPTIONS (easier than open deduction): the word-bank + slots CONSTRAIN the
  solution space — you can brute-force/trial-and-error, and it's "somewhat easier" than open-ended
  deduction (Obra Dinn). LESSON: structured input = accessible but less pure; TUNE how much you constrain
  (enough structure to be inputtable, enough openness to require real thought — the core tension for OUR
  deduction).
- FEEDBACK TUNING IS A KNIFE-EDGE: the "two or fewer incorrect" indicator that reduces frustration ALSO
  "reduced the difficulty and length." LESSON: granular feedback trades difficulty for satisfaction —
  a deliberate DIAL, not a free win; tune per audience (our difficulty packages / accessibility knobs).
- SOME FIND IT TOO EASY / OVER-SIGNPOSTED: a minority complaint — animated exclamation marks mark every
  clue ("everything is hand-delivered"), and one-scene chapters feel short. LESSON: don't over-mark clues
  if the JOY is finding them; balance discoverability vs spoon-feeding (cf. Gothic/Morrowind fair-friction
  Q51/Q37; our clue-legibility tuning).
- LATE-GAME COGNITIVE LOAD / NEEDS A NOTEPAD: big late scenes + math sums pile up; players resort to a
  real notepad. LESSON: as complexity scales, provide IN-GAME note/tracking tools so the load is
  manageable on the intended device (crucial for MOBILE — our unrecorded-ledger UI must track this).
- DLC BREVITY / TROPE-RECYCLING: expansions are short (<1hr) + recycle familiar tropes without new
  mechanics. LESSON: episodic deduction content must keep introducing fresh mechanical wrinkles or it
  stales (our quest-variety principle).

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. REAL DEDUCTION AS GAMEPLAY (not "pretend detective"): you ACTUALLY reason to solve; the detective
    feeling comes from the MECHANIC, not narrative flavor (cf. Obra Dinn Q19, Outer Wilds Q18).
W2. THE FILL-IN-THE-BLANK ACCUSATION (accessible deduction-input): drag gathered words into Mad-Libs
    sentences — flexible enough for reasoning, structured enough to input; ONE solution of thousands (cf.
    Obra Dinn dropdowns Q19; key for our platform).
W3. SHOW, DON'T TELL (environmental assembly): the story is reconstructed from pockets/notes/cross-refs,
    not narrated — the player ASSEMBLES the narrative (cf. our unrecorded-ledger/[READ]).
W4. THE OBSERVE-THEN-DEDUCE LOOP (two modes): clean separation of gathering (Exploring) from reasoning
    (Thinking) — a legible, repeatable structure (cf. Obra Dinn find-then-identify Q19).
W5. PARTIAL-LOCK FEEDBACK (fairness that keeps deduction satisfying): section-locking + per-scene sub-
    puzzles + a "close" indicator reward progress so hard deduction stays satisfying not maddening (cf.
    Obra Dinn 3-locks Q19, our RULE OF THREE).
W6. INTERCONNECTED CASES (macro-story from micro-mysteries): self-contained cases causally linked across
    40 years; carry knowledge forward — a web, not isolated puzzles (cf. Obra Dinn Q19, our quest-arc).
W7. THE PUZZLE-GATED HINT SYSTEM: help costs a puzzle to unlock — assist without handing the answer;
    you still EARN it (cf. our optional-help/accessibility; steal this directly).
W8. RED HERRINGS / SIGNAL-VS-NOISE: murderers hide tracks -> misleading clues; separating signal from
    noise IS the detective's skill (cf. Obra Dinn Q19, our evidence-vs-noise).
W9. TONE BALANCES THE GRIM (caricature/absurdity): comedy + over-the-top characters keep frequent murder
    from unrelenting bleakness — humor as a pressure-valve (cf. Yakuza Q13, our tone).
W10. STREAMLINED ACCESSIBILITY = "FEEL SMART": streamlined, low-bells-and-whistles design lets players
     "feel like the smartest version of themselves" — accessible depth that flatters the player (cf. our
     SUN-MODE/mobile accessibility; make deduction reachable + rewarding).

===============================================================================
## 4. BOHEMIA PORTS (directions, not built) — the accessible-deduction pillar for our [READ]/ledger
===============================================================================
Golden Idol is the master model for ACCESSIBLE REAL DEDUCTION — the missing accessible-input piece next to
Obra Dinn (Q19). Directly relevant to our unrecorded-ledger + [READ] + investigation/mystery layer, and
its streamlined, mobile-friendly, "feel smart" design fits our iPhone target perfectly.
- W1/W2 (real deduction + the fill-in-the-blank accusation — key for our platform): bank the FILL-IN-THE-
  BLANK ACCUSATION as our accessible DEDUCTION-INPUT model — where Obra Dinn (Q19) uses fate-dropdowns,
  Golden Idol's drag-words-into-sentences is even more MOBILE-friendly + expressive. For any Bohemia
  investigation/mystery (uncovering a killer, a faction's secret, the Amalgamation's truth), the player
  GATHERS evidence-words then ASSEMBLES an accusation — REAL reasoning, not multiple-choice (ties Obra Dinn
  Q19, Outer Wilds Q18, our [READ]/unrecorded-ledger; the accessible-deduction verb).
- W3/W4 (show-don't-tell + observe-then-deduce): our UNRECORDED-LEDGER + [READ] should work like Golden
  Idol's two modes — EXPLORE to gather evidence-words from the environment (pockets, notes, the district),
  then DEDUCE by assembling the truth; the player RECONSTRUCTS the narrative from oblique detail, not
  narration (ties our [READ]/ledger, Obra Dinn Q19, our recorded-vs-unrecorded design).
- W5 (partial-lock feedback — the fairness fix): STEAL the section-locking + "close" indicator — our
  deduction/[READ] must give GRANULAR feedback (a correct sub-part locks; a "nearly there" nudge) so hard
  reasoning feels SATISFYING not maddening — but TUNE it as a difficulty DIAL (ties Obra Dinn 3-locks Q19,
  our RULE OF THREE, our difficulty packages).
- W6 (interconnected cases — macro from micro): structure our investigation/quest layer as self-contained
  mysteries CAUSALLY linked across the ~100-year arc — carry knowledge forward, late cases connect to
  early ones (a death now -> a will-reading/feud later) — a web across generations (ties our fold, quest-
  arc, Obra Dinn Q19; on-theme with our generational causality Q50).
- W7 (the puzzle-gated hint system — steal directly): implement OPTIONAL HELP that costs a small puzzle/
  effort to unlock — assist stuck players WITHOUT handing the answer; they still EARN it. This is our
  accessibility + no-brick-wall + anti-frustration design in one elegant mechanic (ties our regression-
  gate/no-brick-wall, SUN-MODE/accessibility; a direct steal).
- W8 (red herrings / signal-vs-noise): our evidence layer should include MISLEADING clues (factions/
  killers hide tracks) so separating signal from noise IS the skill — not every ledger-word is useful
  (ties Obra Dinn Q19, our evidence design; make deduction a real filter).
- W9/W10 (tone balances the grim + accessible "feel smart"): balance Bohemia's grim survival/murder with
  moments of TONE (caricature/absurdity/humor) as a pressure-valve (Yakuza Q13, our tone); and bank the
  "feel smart" mandate — streamlined, MOBILE-friendly deduction that flatters the player's intelligence
  (ties our SUN-MODE/mobile/single-file constraints; Golden Idol PROVES accessible deduction thrives on
  our platform).
- FLAWS (bank): TUNE the constraint (enough structure to input, enough openness to require real thought —
  the fill-in-blank can get too easy/brute-forceable); treat feedback granularity as a deliberate
  difficulty DIAL (satisfaction vs difficulty trade); don't OVER-mark clues if finding them is the joy
  (clue-legibility balance — Gothic/Morrowind friction Q51/Q37); provide IN-GAME note/tracking so late-
  game load is manageable ON MOBILE (our ledger UI — critical); and keep episodic content introducing
  fresh mechanical wrinkles so it doesn't stale.

## SOURCES
Thinky Games (Exploring/Thinking two modes, Mad-Libs fill-in-blank color-coded nouns/verbs/names, single
solution of thousands of permutations, variants name-characters/translate-symbols/compute-numbers, Agatha-
Christie whodunits + misdirects/red-herrings, expands Obra Dinn's format, IGF Excellence in Design);
Game Developer/Klavins interview (the "pretend detective" problem/real-deduction-through-gameplay goal,
text-parser-vs-multiple-choice input problem, section-locking + extra puzzles + "two-or-fewer-incorrect"
indicator fixing frustration but reducing difficulty, each scenario serves macro-story + individual
mystery + puzzle + real-logic, Obra Dinn/Her Story inspiration); GamingTrend + Escape Effect + Vice
(frozen-tableau/omniscient-detective, rifle-pockets/read-garbage, suspect-list-repeats aid memory, 3-hints-
per-scroll, 12 cases/40 years sequential+causal will-reading-follows-death, remember-names-faces, show-
don't-tell, red-herrings/think-bigger, caricature-tone-grounds-grim, "feel like Sherlock"); Metacritic +
Grokipedia + Adventure Game Hotspot (little-handholding/trust-the-player, puzzle-gated hint system "more
games should use," fill-in-blank limits-options/somewhat-easier + red-herrings keep-it-challenging, whodunnit/
howdunnit/whydunnit/whendunnit, streamlined-accessible "feel like the smartest version of yourself,"
sequel 1970s + non-lethal cases + QoL, DLC brevity/trope-recycle, some-find-it-too-easy/over-signposted).
Cross-ref Questbook 19 (Obra Dinn — THE deduction sibling/RULE OF THREE/fate-input), 18 (Outer Wilds —
knowledge-as-progression), 13 (Yakuza — tonal-range), 51/37 (Gothic/Morrowind — fair-friction/no-over-
marking), 50 (Chrono Trigger — generational causality), our unrecorded-ledger + [READ] + recorded-vs-
unrecorded + investigation/mystery layer + fold/quest-arc + regression-gate/no-brick-wall + difficulty
packages + SUN-MODE/mobile/single-file + tone. FUTURE: the Color Gray Games testing/design talks (they
"used frequent testing to sharpen puzzles"); a Her Story / Paradise Killer / Return of the Obra Dinn cross-
study on deduction-input models (the full accessible-deduction toolkit for our [READ] system).
