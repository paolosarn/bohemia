# BOHEMIA QUESTBOOK — DEEP DIVE 05: DISCO ELYSIUM (the whole-game quest MODEL + The Tribunal)
Full teardown, the whole enchilada: the game's quest SYSTEM (skills-as-voices, red/white checks,
failure-as-content, the Thought Cabinet as anti-loot), the flagship set-piece "The Tribunal" stage-
by-stage, the honest critique (the brick wall), and Bohemia ports. Disco is the medium's model for
DIALOGUE-AS-GAMEPLAY and FAILURE-THAT-ADVANCES-THE-STORY, with zero combat. Reference only; Paolo does
not read it. No Bohemia quest written here.

Game: Disco Elysium (ZA/UM, 2019; Final Cut 2021). You play a memory-wiped, addict detective in the
poor harbor district of Martinaise, solving the murder of a man found HANGED from a tree, while two
factions (a dockworkers' union + a mercenary company) teeter toward violence over it.

===============================================================================
## 0. WHY IT'S IN THE CANON (the model, not one quest)
===============================================================================
Disco is studied as the proof that a QUEST can be pure conversation + skill checks and still be the
best in the medium — no combat, all consequence carried by dialogue, dice, and character. Its four
system pillars (below) are the transferable model. It's here as a SYSTEM teardown + one set-piece,
because the innovation is architectural, not a single mission.

===============================================================================
## 1. THE FOUR SYSTEM PILLARS (the model to steal)
===============================================================================

### PILLAR 1 — SKILLS AS CHARACTERS (24 voices, an internal party)
- The detective's mind is split into 24 SKILLS, each a distinct VOICE with its own personality,
  agenda, and portrait (Final Cut: all voiced). They interject, argue, contradict each other, and
  push you toward different actions: Empathy senses a lie; Authority wants domination; Inland Empire
  says "Let's dance, baby!" mid-crisis; Electrochemistry begs you to use. The player ARBITRATES an
  internal party of conflicting impulses.
- CONSEQUENCE: your build literally changes what you PERCEIVE — high skills open perceptions/lines
  invisible to other builds. The character sheet is a lens on reality, not just a combat stat block.

### PILLAR 2 — RED vs WHITE CHECKS (the failure architecture)
- WHITE checks: retryable. You can come back after raising the skill / changing clothes / internalizing
  a Thought and try again. The game "does its utmost to help you succeed" on the critical-path whites
  (e.g. the Authority check on Titus reopens easier each fail; fail it 4x and a NEW option unlocks —
  ask Kim to step in). Failure REROUTES, never dead-ends, on the mandatory whites.
- RED checks: ONE-SHOT, permanent, story-altering. You get one roll; the outcome is locked. Two 1s
  always crit-fail, two 6s always crit-win. Reds are where the game's biggest divergences live (the
  Tribunal is all reds).
- CLOTHING/THOUGHT MODIFIERS: +1 from the right hat can make a check; players are taught to DRESS for
  a check. Stats are contextual and gear-shiftable — a soft, transparent way to influence odds.

### PILLAR 3 — FAILURE IS CONTENT (the core law)
- The design thesis (and player consensus): DON'T reload failed checks — "failure often leads to
  better, funnier, or more interesting outcomes." Failing the Electrochemistry check to NOT drink is
  cited as one of the most memorable moments in the game. Failure produces NEW narrative, not a dead
  end (on whites). The game front-loads failure into its worldview: it's a game ABOUT a failure of a
  man in a failed city where "0.000% of Communism has been built."

### PILLAR 4 — THE THOUGHT CABINET (anti-loot: ideas as rewards)
- Instead of item loot, actions/conversations SUGGEST "Thoughts" (theories, ideologies, self-concepts:
  Mazovian Socio-economics, Advanced Race Theory, Cop of the Apocalypse). You INTERNALIZE one over
  several in-game hours in a limited-slot "cabinet"; it then grants passive skill mods — and, radically,
  some make you WORSE (Advanced Race Theory: -1 Drama, "fooled by the absurdity"). Thoughts are
  characterization-as-reward; you can forget them (error recovery). The "loot" is who Harry BECOMES.
- KEY IDEA: the reward for engaging content is IDENTITY, not gear. The build is a self-portrait.

===============================================================================
## 2. THE FLAGSHIP SET-PIECE — "THE TRIBUNAL" (stage-by-stage)
===============================================================================
Context: after the "Look for Ruby" arc (confront Ruby in the cave under the Feld building, read her
journal), the mercenary tribunal triggers back at the Whirling-in-Rags hostel — the murder
investigation's violent climax, a shootout between the union's Hardie Boys and Wild Pines mercenaries.

### STAGE 1 — THE UNAVOIDABLE CONFRONTATION
- The Tribunal BEGINS regardless of your choices; you can announce you're the police or keep your head
  down, but you CANNOT avoid or stop it. STAGING: a fixed collision the whole game has been building
  toward — agency is in HOW you survive it, not whether it happens.

### STAGE 2 — THE RED-CHECK GAUNTLET (every check here is one-shot, permanent)
A rapid sequence of RED checks, each deciding who lives/dies:
- HANGED MAN talk: a Suggestion 13 check to steer the conversation onto the murder (defuse via words).
- "Wild Pines won't approve" line: state it and REFUSE to change the topic -> the merc Shanky FLEES
  (lives elsewhere); change the topic -> he STAYS and DIES. (A dialogue choice = a life.)
- Rhetoric 12: think of an argument; failing does nothing, passing makes the later Hand/Eye shot easier.
- HAND/EYE COORDINATION: shoot Kortenaer (the lead merc) — pass GUARANTEES his death later in the
  fight; fail -> you can retry only if you have >1 bullet, or throw the gun (won't kill), or accept it.
- LOGIC 11: attempting to argue the Hardie Boys' innocence and FAILING gets Elizabeth SHOT; passing
  saves her.
- REACTION SPEED: dodge the last bullet — an IMPASSABLE red check (cannot be passed) unless specific
  prior conditions are met — the game withholds success until you've earned the setup.
- AUTHORITY 11 (while downed): a check to SAVE KIM'S LIFE — one of the game's most consequential
  moments; Authority builds live, others may lose Kim.
- DESIGN NOTE: the entire climax is a cluster of ONE-SHOT reds where dialogue choices AND stat checks
  each spend a life. No reloading intended — you live with the bodies. Prior investigation (who you
  talked to, what you learned, how you're dressed, your Thoughts) silently stacks the odds.

### STAGE 3 — SURVIVE / THE AFTERMATH
- Fail to survive -> an ENDING SCREEN (you can die here). Survive -> Harry goes unconscious, wakes in
  his hostel room, and (a small reactive grace) no longer has to PAY for the room. Who died at the
  Tribunal (Kim, Titus, Elizabeth, the mercs) persists into the finale.

===============================================================================
## 3. THE HONEST CRITIQUE (the anti-pattern to avoid)
===============================================================================
- THE BRICK WALL: if you dump all points into one attribute (e.g. Intellect/Motorics), you hit
  Psyche/Physique checks you can't pass — and "the narrative stops dead in its tracks until you can
  succeed." Because quests are interlinked, one impassable check can freeze a whole CHAIN. This is the
  ONE widely-cited flaw: white checks reroute, but a build-locked wall on a critical path can stall.
- MISSABLE PREREQUISITES: some content (the Hanged Man's armor set; the emotionally-key Phasmid ending)
  is gated behind non-obvious prerequisite steps you can permanently miss (put on the shirt to trigger
  the next step, etc.) — deep, but easy to lock yourself out without knowing.
- THE LESSON (already in our craft research C1): failure must ROUTE, never DEAD-END; never gate a whole
  chain behind a single un-passable check.

===============================================================================
## 4. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. DIALOGUE IS THE GAMEPLAY: no combat; every conflict is conversation + checks. Proof a great quest
    needs zero fighting — the tension is social, moral, internal.
W2. THE INTERNAL PARTY (skills as voices): externalize the character's competing impulses as VOICES
    that argue — the player's own psyche is the "party," and the build changes what you perceive.
W3. FAILURE-AS-CONTENT: write the FAILURE branch as richer than success wherever possible; teach the
    player (by making failure fun) that reloading is the worse experience. Failure = new story.
W4. RED vs WHITE (permanent vs retryable): distinguish one-shot story-altering checks from retryable
    ones; concentrate the biggest divergences in clearly-flagged permanent moments (the Tribunal).
W5. IDENTITY-AS-LOOT (Thought Cabinet): reward engagement with CHARACTER (ideas, self-concept), not
    gear — and let some rewards make you WORSE, as characterization. The build is a self-portrait.
W6. DRESS-FOR-THE-CHECK (transparent soft modifiers): let players tilt odds via visible, swappable
    means (clothing/Thoughts) — agency over probability without save-scumming.
W7. THE UNAVOIDABLE COLLISION: some climaxes should be INEVITABLE (the Tribunal happens no matter what);
    agency lives in HOW you meet it, not whether. Fixed event + variable survival.
W8. THE ODDS ARE THE INVESTIGATION: everything you did earlier (who you talked to, what you learned,
    how you built/dressed) silently stacks the climax's checks — the payoff of paying attention.
W9. PERCEPTION IS BUILD-GATED: high skills reveal lines/clues invisible to other builds — replay value
    + the sense of a world bigger than any one playthrough sees.
W10. MORALIZED FAILURE, NOT PUNISHED: failing is embedded in the game's THEME (a failure of a man in a
    failed world) — failure isn't a slap, it's the subject.

===============================================================================
## 5. BOHEMIA PORTS (directions, not built — this is the biggest system-lesson set)
===============================================================================
- W1 (dialogue is gameplay): validates our pacifist-completable spine; keep proving conflicts resolve
  socially/morally without combat (our Q038/Q047/Q049). Combat is ONE verb, never the only one.
- W2 (internal party / skills-as-voices): we don't need 24, but bank a LIGHT "instinct voices" system —
  the dynasty's hard-won TRAITS (from upbringing Q003 + prior quests) speak up in dialogue as competing
  nudges (the ruthless streak vs the mercy streak arguing) — externalize the dynasty's character.
- W3 (failure-as-content): THE priority upgrade for our skill-gates. Write the FAILURE branch of key
  [READ]/[BARTER]/social checks as its own real content (fail the read -> accuse the wrong person ->
  a new problem), never a dead "you miss it." (Craft research A3 confirmed; this is the how.)
- W4 (red vs white): formalize TWO check types in Bohemia — retryable (grind/return) vs ONE-SHOT
  permanent (the succession vote, the endgame threshold, a life-or-death faction beat). Flag the
  permanents so the player feels the weight.
- W5 (identity-as-loot): our unrecorded ledger + succession ALREADY make identity the reward; push it —
  some "rewards" (a hardening trait, a fearsome reputation) should carry a DOWNSIDE as characterization
  (the Thought-Cabinet lesson: growth can make you worse).
- W6 (dress-for-the-check): let players tilt Bohemia odds via visible, swappable means (gear, a
  companion present, a faction favor spent) — transparent soft modifiers, not dice-reloading.
- W7 (the unavoidable collision): our Q039 summit + Q050 threshold are inevitable collisions; keep
  building climaxes that HAPPEN regardless, with agency in the HOW (who survives, on what terms).
- W8 (odds = the investigation): make our climaxes silently read the whole prior playthrough (Q050
  already reads the Reconstruction; extend: how you're "dressed," who you brought, what you learned).
- W10 (moralized failure): tie failure to our THEME — a dynasty's failures are the subject (consequence
  across time), not a punishment; the fold surfaces them as story (Q042), never as a game-over slap.
- AVOID (the brick wall, C1): never gate a Bohemia quest CHAIN behind one un-passable check; always a
  reroute (ask a companion to step in, a different approach, a costlier path).

## SOURCES
Disco Elysium Wiki (discoelysium.wiki.gg): The Tribunal (all red checks, Shanky/Elizabeth/Kortenaer/
Kim outcomes), Skills (red/white, the 24 voices, Final Cut voicing, impassable checks); gamepressure
(Return to the Whirling-in-Rags stage-by-stage); Gabriel Chauri + Game Design Thinking (system
analysis, Thought Cabinet as anti-loot); Medium/Eryk Sawicki ("Failures of the World, Unite" — failure
as worldview, Advanced Race Theory makes you worse); Artly Reviews + Hypercritic (the brick-wall
critique); EarlyGuides + Nocturnal Rambler (embrace-failure consensus, missable prerequisites, the
Phasmid ending). FUTURE: a ZA/UM writer interview on the failure-first design philosophy; a Phasmid-
ending teardown (the game's emotional apex) as its own micro deep-dive.
