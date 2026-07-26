# BOHEMIA QUESTBOOK — DEEP DIVE 28: MERCY AS A MECHANIC (Undertale)
Full teardown, the whole enchilada: the ACT/SPARE combat system, the three routes, every-enemy-is-a-
solvable-non-violent-puzzle design, the persistent save that remembers atrocity FOREVER, the meta-
commentary on player nature, the honest flaws, and Bohemia ports. This is the medium's model for
NON-VIOLENCE AS A FULL FIRST-CLASS MECHANIC (not a stealth-around) + a WORLD THAT PERMANENTLY REMEMBERS
+ theme-through-route. The bright counterweight to Spec Ops (Q27). DIRECTLY validates our Pacifist Path
Law. Reference only; Paolo does not read it. No Bohemia quest written here.

Game: Undertale (Toby Fox, 2015). A child falls into the Underground, a world of monsters, and must get
home. Every "enemy" can be KILLED or SPARED — and the game tracks which, across three tonally-opposite
routes, with a save file that NEVER forgets.

===============================================================================
## 0. THE CORE IDEA (why it's in the canon)
===============================================================================
- MERCY IS A REAL MECHANIC, NOT A WORKAROUND: in combat you can FIGHT (kill) or use ACT + SPARE — every
  monster has a non-violent "solution" (comfort, flirt, encourage, play, out-wait) that ends the fight
  peacefully. Sparing isn't a stealth-bypass; it's a full combat SYSTEM with its own puzzles per enemy.
- EVERY ENEMY IS A PERSON WITH A PUZZLE: each monster has a personality + a specific ACT that pacifies
  them (Papyrus wants to capture you but is lonely; a dog wants to be petted; a shy ghost needs
  encouragement). Learning WHO they are IS the non-violent solution (cf. Deus Ex social battle Q17,
  Whodunit personality-read Q07).
- THE THREE ROUTES = THREE MORAL STANCES: NEUTRAL (kill some, spare some — the default most stumble
  into), TRUE PACIFIST (spare EVERYONE + befriend the main cast -> the warm "true" ending), GENOCIDE/NO
  MERCY (kill EVERYTHING, grinding out each region's kill-counter -> the darkest route). The ROUTE is
  the theme; how you treat the world IS the story.

===============================================================================
## 1. THE ARCHITECTURE (how mercy-as-mechanic is built)
===============================================================================

### THE ACT/SPARE SYSTEM (combat as conversation)
- Each fight: FIGHT (attack), ACT (context options: Check, Talk, Flirt, Comfort, Threaten, etc.), ITEM,
  MERCY (Spare/Flee). The right ACT sequence lowers the enemy's hostility until "SPARE" glows yellow —
  then you end it non-lethally. You DODGE their attacks (a bullet-hell mini-game) while you work out how
  to calm them — so pacifism still demands SKILL (you survive their assault while solving them).
- NAMED, CHARACTERFUL ENEMIES: even random encounters have names + personalities + unique ACT solutions;
  the game humanizes every "trash mob" so killing one has weight (cf. NieR humanize-the-enemy Q22, the
  unrecorded ledger's "everyone is someone").

### THE PERSISTENT, UNFORGETTING SAVE (the meta-mechanic)
- The game REMEMBERS across playthroughs — including a "True Reset." Complete GENOCIDE once and it
  PERMANENTLY TAINTS all future True Pacifist endings (a "soulless" ending), even after a full reset. The
  save file knows what you did and won't let you launder it. Characters (Flowey, Sans) reference your
  PRIOR runs, your resets, your kills — breaking the fourth wall to hold your history against you.
- CONSEQUENCE YOU CAN'T UNDO: the one irreversible act. Most games let you reload to clean slate;
  Undertale makes a moral choice STICK beyond the save system — the ultimate "the world remembers" (cf.
  our fold/ledger; the opposite of save-scumming).

### THE ROUTE-SHIFTS (the world reacts to your cruelty)
- On Genocide, the WORLD changes: overworld music drops to slower, lower, eerie versions; NPCs EVACUATE
  towns (empty streets); puzzles are pre-solved (no one left to set them); encounters dry up as you
  depopulate a region ("but nobody came"). The atmosphere physically decays to reflect your body count
  (cf. Spec Ops degradation Q27, Dishonored chaos Q14). Abort mid-Genocide and it reverts to Neutral —
  but the NPCs you already killed stay dead.

### THE NUDGE-TOWARD-VIOLENCE (a test of the player)
- On a mercy run, the game NUDGES you to kill: bosses escalate (Papyrus wants to capture you, Undyne
  wants to KILL you, Asgore destroys your MERCY option and forces a fight, then ASKS you to kill him).
  The game keeps offering the "easy" violent out — TRUE Pacifism requires REFUSING every nudge. Mercy is
  hard-won, not passive (cf. our pacifist-as-earned-bonus; Dishonored's tempting-but-dark spare Q14).

### THE META-COMMENTARY (why did YOU do it?)
- Genocide is framed as a comment on PLAYER nature: many do it "just to see what happens" — and the game
  interrogates that curiosity as its own kind of cruelty (Flowey: you wanted to show them happiness just
  to tear it away). The game asks not just what you did, but WHY you were willing to (cf. Spec Ops "you
  wanted to feel like a hero" Q27 — the bright-side twin).

===============================================================================
## 2. THE HONEST FLAWS (banked)
===============================================================================
- GENOCIDE IS A TEDIOUS GRIND: depopulating each region means grinding encounters until "nobody came" —
  deliberately unpleasant (the point), but a real slog. LESSON: making cruelty tedious is a valid
  statement, but it's still tedium; use sparingly.
- PACIFISM IS FIDDLY / EASY TO BREAK: one accidental kill drops you off True Pacifist; the exact ACT
  solutions can be obscure without guidance. LESSON: if mercy is the intended path, make its REQUIREMENTS
  legible (telegraph the non-violent solution) so players don't fail it by accident (cf. our no-brick-
  wall + legibility rules).
- SMALL-SCALE / BESPOKE: Undertale hand-authors every enemy's ACT solution — gorgeous but not scalable to
  hundreds of foes without systemization. LESSON: to do mercy-as-mechanic at scale, SYSTEMATIZE the
  non-violent solution space (categories of pacification), not one-off scripts for each.

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. MERCY AS A FULL MECHANIC: sparing is a real combat SYSTEM (ACT->calm->SPARE), not a stealth-bypass —
    non-violence has its own puzzles + skill (dodge while you solve). Pacifism is GAMEPLAY, not evasion.
W2. EVERY ENEMY IS A PERSON WITH A SOLUTION: each foe has a name, personality, + a specific non-violent
    ACT — killing has weight because nothing is a faceless mob (cf. NieR Q22, Undertale-humanizes-all).
W3. READING WHO THEY ARE = THE SOLUTION: pacifying an enemy means understanding them (comfort the lonely,
    encourage the shy) — characterization IS the mechanic (cf. Deus Ex Q17, Whodunit Q07).
W4. THE PERSISTENT, UNFORGETTING SAVE: an irreversible moral choice that STICKS beyond resets — the world
    remembers your worst act forever; you can't launder it by reloading. The ultimate "world remembers."
W5. THE WORLD DECAYS WITH YOUR CRUELTY: music/NPCs/atmosphere physically reflect your body count (empty
    towns, eerie tunes) — HOW you play reshapes the WORLD-STATE (cf. Spec Ops Q27, Dishonored chaos Q14).
W6. MERCY IS EARNED, NOT PASSIVE: the game NUDGES you to kill (escalating bosses, "kill me" pleas) —
    true pacifism requires REFUSING every easy violent out. Non-violence as active discipline (cf. Q14).
W7. THE ROUTE IS THE THEME: three routes = three moral stances; how you treat the world IS the story +
    the ending. Play-style as narrative (cf. Tyranny Q25, our Liberate/Respect/Become).
W8. META-COMMENTARY ON WHY: it interrogates the PLAYER'S motive ("you did it just to see") — curiosity-
    as-cruelty; the game asks why you were WILLING (the bright twin of Spec Ops Q27).
W9. THE BRIGHT COUNTERWEIGHT: unlike Spec Ops (forces atrocity), Undertale OFFERS a fully-realized
    non-violent path AND a violent one — the player CHOOSES, so the meaning is truly theirs (validates
    our Pacifist Path Law: always offer the real non-lethal route).
W10. SPARING STILL TAKES SKILL: you dodge a bullet-hell while solving the enemy — mercy isn't the EASY
    button; it's a different, equally-demanding challenge. Non-violence with teeth.

===============================================================================
## 4. BOHEMIA PORTS (directions, not built)
===============================================================================
Undertale is the master validation of our PACIFIST PATH LAW — and the model for making non-violence a
real MECHANIC with teeth, plus a world that REMEMBERS. (Our Dead-Eye dial is lethal-leaning; this is how
to build the mercy side as a true equal.)
- W1/W10 (mercy as a full mechanic with skill): build Bohemia non-lethal combat as a REAL system with its
  own challenge — a "calm/subdue/talk-down" mode on the Dead-Eye dial (or a parallel minigame) that still
  demands skill (survive/dodge/read while you de-escalate) — pacifism is GAMEPLAY, not a stealth-skip
  (ties our Pacifist Law + the Deus Ex social battle Q17 + the combat dial).
- W2/W3 (every enemy a person with a solution): give Bohemia foes names/personalities + a readable
  non-violent solution (a scared conscript wants reassurance; a zealot wants to be heard) — reading WHO
  they are is the mercy path (ties our [READ], the unrecorded ledger, humanize-the-enemy Q22/Q01).
- W4 (the persistent unforgetting save): OUR FOLD/LEDGER IS THIS — an atrocity should STICK across
  generations and resist laundering (you can't reset away a massacre; the unrecorded ledger remembers
  what the official record buried). Bank an irreversible moral stain that persists beyond any in-world
  "reset" (validates our never-lose + generational-memory core; the anti-save-scum).
- W5 (the world decays with cruelty): let the DISTRICT physically reflect the dynasty's body count/
  cruelty (emptier streets, warier factions, grimmer tone, a "darkness" state) — HOW you play reshapes
  the world-state (ties Q019 tally, Dishonored chaos Q14, Spec Ops Q27; scope per our fold).
- W6 (mercy is earned, not passive): make Bohemia's non-lethal path require REFUSING tempting violent
  outs (an enemy begs for death; violence is faster/cheaper) — pacifism as active discipline, rewarded
  (our pacifist-bonus; Dishonored's dark-spare Q14 as the grey inverse).
- W7 (the route is the theme): validated — our Liberate/Respect/Become + a mercy-vs-ruthlessness dynasty
  arc ARE routes-as-theme; how the dynasty treats the district IS the story.
- W8 (interrogate the WHY, gently): our unrecorded ledger can quietly reflect the dynasty's MOTIVE
  (why did you do it?) — within our care/tone rules (surface, don't hector — cf. Spec Ops care-note Q27,
  the Strange-Man mirror Q10).
- W9 (the bright counterweight — the CORE lesson): ALWAYS offer a fully-realized non-lethal route
  alongside the lethal one, so the meaning is the PLAYER'S (our Pacifist Path Law, validated by the
  master example; the ethical opposite of Spec Ops' forced atrocity Q27).
- FLAWS (bank): make the mercy path's requirements LEGIBLE (don't fail players by accident); don't make
  the cruel path pure tedium-as-punishment; and SYSTEMATIZE the non-violent solution space (categories of
  de-escalation) so it scales beyond hand-authored one-offs (our FACTORY LAW applies).

## SOURCES
Undertale Wiki + CYBERPEDIA + Miraheze (the three routes, ACT/SPARE, Genocide kill-counter grind + revert
rules, the permanent save-taint/"soulless" endings after Genocide, Genocide world-changes: eerie music/
evacuated NPCs/pre-solved puzzles, "but nobody came," Sans/Flowey referencing your runs); Undertale
Fandom design analysis (the escalating nudge-to-kill: Papyrus/Undyne/Asgore forcing/asking for death,
"a take on the nature of players," why-you-did-Genocide framing); Steam + Shapes.inc + runeterraccg
(True Pacifist requirements: spare all + befriend cast, Neutral as default, mercy is fiddly/easy-to-break).
Cross-ref Questbook 27 (Spec Ops — the forced-atrocity opposite), 17 (social battle), 07 (personality-
read), 22/01 (humanize enemy), 14 (dark-mercy/earned pacifism), 25 (route-as-theme), our Pacifist Path
Law + fold + Dead-Eye dial. FUTURE: a Toby Fox design note on the mercy system; a Deltarune cross-study
on evolving the spare mechanic.
