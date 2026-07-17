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

---
# V2 PAYLOAD — BACKFILLED 7/17/26 (FORMAT LAW v2). Original content above untouched.

## V2-A CAST + WHAT EACH ONE WANTS

**HARRY'S SKILLS (the 24-voice internal party)** — each wants a different Harry. Authority wants domination of the room; Empathy wants nobody else to die; Electrochemistry wants a drink IN THE MIDDLE OF THE SHOOTOUT; Hand/Eye wants the shot. Will trade: perception. A high voice shows you lines the others cannot see. Will never say out loud: that they are all him. FUNCTION: the cast INSIDE the player. The Tribunal is a conversation Harry has with himself while men shoot each other around him.

**KORTENAER (the lead merc)** — wants the Hardie Boys to hand over a killer, and failing that, wants the excuse. Will trade: minutes. Every passed check buys the room seconds of him not firing. Will never say out loud: that the tribunal is grief. His man was hanged; this is a funeral conducted with rifles. FUNCTION: the collision. He cannot be talked out of the yard, only steered inside it.

**TITUS HARDIE** — wants his boys alive and the union's story intact, in that order revealed under pressure (the story cracks first). Will trade: the truth about Ruby, too late to matter. Will never say out loud: that he knows the story is a cover. FUNCTION: the defended. The tribunal is aimed at him; your checks decide how much of him is left after.

**ELIZABETH** — wants the Hardie Boys' innocence argued, and she is standing where a failed argument lands. FUNCTION: the cost of a botched Logic check, made visible. A life spent by a sentence that wasn't good enough.

**SHANKY** — wants to not be here, and does not know it yet. One held line makes him flee and live. FUNCTION: proof that a dialogue choice is a life. The topic-change is the trigger; the file above records both settings.

**KIM KITSURAGI** — wants Harry to survive his own climax. Will trade: everything; he steps between. Will never say out loud: that saving him is a CHECK, and some builds fail it. FUNCTION: the partner as the stake. The Authority roll while downed is the quest asking what Harry is made of, one last time.

**RUBY (offstage)** — wants to be gone. FUNCTION: the instigator who is not in the scene. The tribunal is the bill for an arc that ended in a cave under the Feld building.

## V2-B THE CONVERSATIONS (node trees; lines paraphrased, structure exact, checks per the wiki record above)

NODE: TRIBUNAL_OPEN — the Whirling-in-Rags yard, entry: Ruby arc closed. UNAVOIDABLE (W7).
  Kortenaer states the tribunal's business: the union hands over the killer or the mercs collect.
  > "I'm the police. This stops now."   [gate: none]           -> OPEN_COP (announced; the scene does NOT stop; posture changes)
  > (keep your head down)               [gate: none] SILENCE   -> OPEN_LOW (you spectate the opening; fewer levers later)
  > "The hanged man. Let's talk about him."  [gate: Suggestion 13, RED] -> STEER_MURDER (pass: the room talks instead of shoots, for now)
  NOVERB: "Everyone go home." The verb to prevent the tribunal does not exist anywhere in the game. Agency is HOW, never WHETHER (W7). The quest's thesis is a removed verb.

NODE: STEER_MURDER — the parley, entry: Suggestion passed or Kortenaer's patience
  The talk turns to Wild Pines pulling out of Martinaise.
  > "Wild Pines won't approve of this." (and HOLD the topic when pressed)  [gate: none] -> SHANKY_FLEES (he hears it, does the math, leaves. He lives.)
  > (change the subject when pressed)   [gate: none] TRAP -> SHANKY_STAYS (feels polite, costs nothing visible. He stays. He dies in the fight.)
  > (think of an argument)              [gate: Rhetoric 12, RED] -> ARG_BANKED (pass: the later shot gets easier; fail: nothing. A red that only pays.)
  THE TRAP IS COURTESY. Changing the topic is the socially smooth line and it spends a life silently. The gate teaches: in a room full of guns, staying on the uncomfortable subject is the mercy.

NODE: THE_SHOT — the draw, entry: talk collapses (it always collapses)
  > [shoot Kortenaer]                   [gate: Hand/Eye Coordination, RED, +mod if ARG_BANKED] -> KORT_MARKED (pass: his death later is GUARANTEED; the check writes a future)
  > [retry]                             [gate: has:>1 bullet] -> THE_SHOT (the game counts your bullets; one-bullet builds get one draw)
  > [throw the gun]                     [gate: none] -> THROWN (will not kill; a gesture spent)
  > (accept the miss)                   [gate: none] SILENCE -> FIGHT_OPEN
  WHAT THIS NODE COSTS: the illusion that the climax is cinematic. It is arithmetic: bullets, modifiers, and what you banked in the parley (W8).

NODE: ELIZABETH_PLEA — mid-fight, entry: the Hardie Boys accused
  > "They're innocent, and here's why."  [gate: Logic 11, RED] -> pass: ELIZABETH_LIVES / fail: ELIZABETH_SHOT (the argument itself draws the fire)
  THE CRUELEST MECHANIC IN THE FILE: not arguing is safe for her. ARGUING AND FAILING kills her. The quest prices eloquence: attempt the defense only if you can carry it.

NODE: THE_LAST_BULLET — entry: the fight's end
  > [dodge]   [gate: Reaction Speed, RED, IMPASSABLE without prior setup] -> DODGED (only prepared builds; the game withholds success until the setup was EARNED earlier)
  > (take it) [gate: none] -> DOWNED
  NODE: KIM_SAVE — while downed, entry: DOWNED
  > "KIM. DOWN."  [gate: Authority 11, RED] -> pass: KIM_LIVES / fail: KIM_AT_RISK (some builds lose him here; the partner is a stake, not a fixture)
  > (fade out)    [gate: none] SILENCE -> the ledger decides without you

NODE: AFTERMATH — the hostel room, entry: survived
  Harry wakes. The room is free now. Nobody says why.
  WRITES: casualty ledger (kim, titus, elizabeth, shanky, mercs) -> read by the finale. The grace note (no more rent) is one line of world reacting, unremarked (the Q122 clipboard family: the horror and the kindness both arrive as logistics).

## V2-C THE BRANCH MAP

COUNT: 2 terminal states x a 5-line casualty ledger (the real output is the ledger, not the terminal).

B1 — HARRY DIES AT THE TRIBUNAL. Ending screen. The one hard stop in a no-combat game, placed at the only firefight. WRITES: nothing. There is nobody left to write to.

B2 — HARRY SURVIVES. WRITES, independently, each from its own red check or held line: shanky_fled|shanky_dead; kortenaer_marked|kortenaer_free; elizabeth_lives|elizabeth_shot; kim_lives|kim_lost; titus per the fight's arithmetic. CASHES: the finale reads the ledger (who stands beside you at the Phasmid, who is absent from the sea wall). LOCKS: nothing further; the quest's locks all fired DURING it, one red check at a time.

THE STRUCTURAL FINDING FOR THE COMPILE: the Tribunal is the FINALE-IS-A-LEDGER-READ law running in miniature, mid-game: a fixed collision whose only variables are the names on the casualty list, every name priced by a one-shot check the player cannot take back. Cross-ref Q136 (theater), Q137 (arithmetic), Q102 (rooftop). Bohemia's multi-enemy dial quests should steal the shape: the fight happens; the checks decide the manifest; the manifest is what the ending reads out loud.
