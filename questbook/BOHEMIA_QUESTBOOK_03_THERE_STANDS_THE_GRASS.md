# BOHEMIA QUESTBOOK — DEEP DIVE 03: THERE STANDS THE GRASS / VAULT 22 (Fallout: New Vegas)
Full teardown, the whole enchilada: event, staging, stage-by-stage flow, script beats, branch/skill-
gate map, the destroy-the-data ethical core, and Bohemia ports. This is NV's showcase of the
INVESTIGATION-with-no-clean-answer + the "destroy the data so the institution can't misuse it" beat
+ the quiet-horror dungeon. Reference only; Paolo does not read it. No Bohemia quest written here.

Quest: "There Stands the Grass" (a pun on the 1953 country song "There Stands the Glass"). A side quest;
dungeon = Vault 22, a pre-war agricultural vault where a fungal experiment went catastrophically wrong.

===============================================================================
## 0. THE PREMISE / STAKES
===============================================================================
- WHO: Dr. Thomas HILDERN, an ambitious, dismissive NCR bureaucrat-scientist at Camp McCarran; his
  subordinate Dr. Angela WILLIAMS; and KEELY, a ghoul researcher trapped in the vault.
- THE HOOK: Hildern hires the Courier (as a mercenary — a cold transaction) to enter Vault 22 and
  download experimental agricultural data that could "prevent a future food shortage" for the NCR.
- THE HIDDEN TRUTH: Vault 22's experiment was a fungal/spore plague that KILLED the vault and spawned
  monsters; the "miracle crop" data is really the recipe for an ecological catastrophe. Hildern has
  sent MULTIPLE hires before — none returned (he didn't mention that).
- THE MORAL CORE: should the data be RECOVERED (NCR gets a food fix — and maybe unleashes the plague
  again) or DESTROYED (safer for the world — but you defy your employer and lose the reward)? Keely,
  who's seen the horror firsthand, wants it deleted. The player adjudicates knowledge-vs-safety.

===============================================================================
## 1. THE FULL STAGE-BY-STAGE FLOW
===============================================================================

### STAGE 1 — THE HIRE (Camp McCarran) + the withheld truth
- Talk to Hildern in his office; take the mercenary job to fetch the data. He's transactional and
  dismissive — the "science serves the institution" archetype.
- AS YOU LEAVE — Angela Williams intercepts you (a scripted hand-off): she warns the vault is deadly
  AND reveals the OPTIONAL objective — find KEELY, a researcher sent before you who never came back.
  KEY REVEAL: Hildern has sent OTHERS on "this exact mission" and none returned — he's spending lives
  for data and hiding it.
- OPTIONAL SOCIAL BEAT: return to Hildern and DEMAND answers about the prior hires; he dismisses your
  concern, but a Speech 40 check DOUBLES your pay (turn his callousness into leverage).
- DESIGN NOTE: the optional Keely objective and the "he sent others" reveal RECONTEXTUALIZE the errand
  before you even leave — the transaction is already morally dirty. Note also KEELY MAY NOT SPAWN unless
  you accept the optional quest (reactivity of presence — like Cass's quest, the person exists when the
  hook does).

### STAGE 2 — THE APPROACH (environmental storytelling)
- The route: cazadores + fiends en route (dangerous approach). The valley telegraphs the horror — a
  faint GREEN tint, then huge colorful mutant plants, giant mantises hiding in foliage, and the vault's
  metal sign SPRAYPAINTED OVER: "STAY OUT!! THE PLANTS KILL!" STAGING: the dungeon warns you from
  outside, in the environment, before a word of dialogue. The place testifies.

### STAGE 3 — THE DUNGEON (Vault 22, five levels, quiet horror)
- Five levels; 1-2 are enemy-free (dread-building emptiness) before the spore-creatures and mantises.
  Overgrown ruins, vines through the architecture — a dead ecosystem that ate its makers.
- TRAVERSAL CHOICE (multi-key): reach the Pest Control floor (level 5) + data terminal via (a) REPAIR
  the elevator (Repair 50) OR (b) the cave route needing the Vault 22 Cave Door Key Card (found by
  unlocking the Overseer's office + the quarters) OR (c) the stairs/long way. Skill, item, or effort.

### STAGE 4 — THE DATA TERMINAL (the object of the errand)
- Download the research data from the Pest Control terminal (pick the lock or use the Overseer's
  terminal to open the room). You now HOLD the thing everyone's died for. STRUCTURAL NOTE: you can
  turn around here and just deliver it to Hildern — the quest is completable as a pure fetch, no Keely,
  no moral reckoning. The depth is OPTIONAL; the game respects players who don't dig.

### STAGE 5 — KEELY (the witness who wants it destroyed)
- Find Keely trapped in the cave section (a 75 Lockpick can free her a faster way). She's a ghoul
  researcher who survived down here and UNDERSTANDS what the data is: a plague, not a miracle. She asks
  your help to (a) purge the spores and (b) DELETE the research so it can never be repeated.
- THE PURGE SET-PIECE: the vault is full of flammable gas that can burn out the contagious spores.
  Keely's plan: ignite it. You go to the Pest Control vents and set off the gas (dynamite/C4/grenade),
  then DUCK — the flames roar down the whole corridor (a staging hazard: close the WRONG door and the
  fire comes through and kills you — the environment is lethal if misread). The spores burn out.

### STAGE 6 — THE MORAL FORK: THE DATA (the heart of the quest)
- Back with Keely, the reckoning. Keely wants to DELETE the data. The fork:
  - LET HER DELETE IT (the "destroy the data" route): the world is safer; the plague-recipe dies with
    the vault. BUT you defy Hildern and forfeit the cap reward (and get reduced XP). The morally-clean,
    materially-costly choice.
  - PRESERVE IT / STOP HER: keep the data for Hildern/NCR (the reward) — betting the institution won't
    misuse it (it will: the NCR would incorporate the plants into farms regardless of the danger).
  - THE SCIENCE 70 ARGUMENT: you can tell Keely that DESTROYING the data may increase the chance this
    "all happens again" (without the record, no one learns from it) — a genuinely two-sided intellectual
    beat. Knowledge is dangerous AND its destruction is dangerous; the game gives BOTH sides teeth.
  - LIE OPTION: a Speech check lets you convince Keely you never downloaded the data — she lets you
    leave, and you keep it (deceiving the sympathetic witness).
  - COMPANION-UNIQUE PEACE: if here on Veronica's companion quest, a unique peaceful option opens.
  - You CAN just kill Keely (no Karma hit for the kill itself — the game doesn't moralize the act, only
    the later lie).

### STAGE 7 — THE PAYOUT (double-dip, lie, or clean hands)
- Return to Camp McCarran:
  - Give Hildern the data: 1200 caps, raisable to 1800 with Barter/Speech 50. If the data was DELETED:
    no caps, reduced XP (1200 vs 1500).
  - Tell Angela that Keely is SAFE: +800 caps. You can LIE that she's safe if she's dead (Speech check)
    — that lie COSTS Karma (note: killing Keely = no Karma loss; LYING about it = Karma loss — the game
    moralizes the deception, not the kill).
  - Best-of-all-worlds: save the data AND Keely, collect from both, 1500 XP.
- REACTIVITY / EXCLUSIVITY: completing this quest can LOCK OFF dialogue with Hildern afterward, which
  can break "You Can Depend on Me" and make companion Rose of Sharon Cassidy UNOBTAINABLE. Also
  interacts with "I Could Make You Care" (doing this first removes that quest's data-retrieval option).
  Choices here close other content — real, unadvertised exclusivity.

===============================================================================
## 2. THE BRANCH / SKILL-GATE MAP (compact)
===============================================================================
HIRE: take job | Speech 40 -> double pay | (Angela) accept optional Keely objective (or Keely won't spawn)
TRAVERSAL: Repair 50 elevator | Cave Key Card (Overseer's office + quarters) | stairs
DATA: download early -> can complete as pure fetch (skip Keely/morality)
PURGE: ignite gas (explosive) + duck (misclosing a door = death)
DATA FORK: let Keely delete (safe world, no reward) | preserve for NCR (reward, risk) | Science 70
  (destroying-it-is-also-risky argument) | lie you didn't download (keep it) | Veronica-unique peace |
  kill Keely (no Karma for kill)
PAYOUT: data to Hildern (1200, ->1800 Barter/Speech 50; deleted = 0 caps, less XP) | Angela: Keely
  safe (+800) or LIE she's safe (Karma loss) | save both (1500 XP)
EXCLUSIVITY: can lock Hildern dialogue -> breaks You Can Depend on Me -> Cassidy unobtainable; interacts
  with I Could Make You Care.

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. THE DIRTY ERRAND: the transaction is compromised before you leave (he sent others to die, hid it) —
    the moral weight is seeded in the HIRE, not just the destination.
W2. ENVIRONMENTAL WARNING: the green tint, the mutant flora, the spraypainted "THE PLANTS KILL" sign —
    the dungeon tells its own horror story from outside; the space is the exposition.
W3. QUIET-HORROR PACING: two empty levels before the monsters — dread built by ABSENCE, then released.
W4. OPTIONAL DEPTH, RESPECTED: completable as a pure data-fetch; the Keely arc + moral fork are entirely
    optional. Players who don't dig still finish; players who do get the soul. (Faith in the curious.)
W5. THE TWO-SIDED KNOWLEDGE PROBLEM: destroy the data (safe now, but no one learns and it may recur —
    Science 70) vs preserve it (useful, but the institution WILL misuse it). Both sides have real teeth;
    there is no clean answer. The quest's intellectual core.
W6. THE INSTITUTION-WILL-MISUSE-IT BEAT: the reason "destroy the data" is arguably RIGHT is that the NCR
    would weaponize the plants regardless of the danger — anti-institutional distrust made a mechanic.
W7. MULTI-KEY TRAVERSAL: elevator (Repair) / cave (item) / stairs (effort) — the dungeon opens to any build.
W8. THE WITNESS WHO KNOWS: Keely (a survivor/ghoul) carries the moral truth the employer hides — side
    with the one who's SEEN it, or the one who PAYS you.
W9. THE GAME MORALIZES THE LIE, NOT THE KILL: killing Keely costs no Karma; LYING about her death does.
    A precise, interesting moral model — deception is the sin, not the act. (Debatable, memorable.)
W10. UNADVERTISED EXCLUSIVITY: finishing this can silently lock a companion (Cassidy) and break other
    quests — choices close doors you didn't know were doors. Consequence you feel later.
W11. STAGING HAZARD AS TENSION: the gas-ignition can kill YOU if you misread which door to close —
    the environment demands attention; the set-piece is lethal if rushed.

===============================================================================
## 4. BOHEMIA PORTS (directions, not built)
===============================================================================
- W1 (dirty errand): seed moral weight in the HIRE — a Bohemia patron who's sent others to die / hid the
  real stakes (our Q009 dark-sacrifice patron, our Network brokers) — the job is compromised before you go.
- W2/W3 (environmental warning + quiet-horror pacing): our Amalgamation dungeons (Q024 dream-temple, Q050
  the door) should WARN from outside (the cyan-hum, drift-glyphs) and build dread by emptiness before the
  reveal — the space as exposition.
- W4 (optional depth respected): keep some Bohemia quests completable shallow (pure fetch/build) with the
  moral soul OPTIONAL for the curious — don't force the depth (New Vegas's faith in players).
- W5/W6 (two-sided knowledge + institution-misuse): DIRECTLY ours — the Reconstruction data, the
  Amalgamation's "recipe," the founder's console (Q023/Q029). Bank a recurring "destroy it so the Network
  can't misuse it vs preserve it to understand the enemy" fork (our Q023 already gestures at this — sharpen
  it with the Science-70-style "destroying it is ALSO dangerous" counter-argument).
- W8 (the witness who knows vs the one who pays): pit a survivor-witness (a freed NeuroLinked, a Homeless
  elder) against a paying patron — side with truth or coin (our Q037 Naro, Q046 Finch).
- W9 (moralize the lie not the act): a precise moral-ledger idea for our unrecorded system — track
  DECEPTION distinctly from ACTS (lying about what you did may weigh heavier than the deed).
- W10 (unadvertised exclusivity): let some Bohemia choices quietly close other quests/companions (our
  Heartache-style exclusivity) — real, unadvertised cost.
- W11 (lethal staging hazard): our infrastructure set-pieces (Q036 the plant) can have environment that
  kills the careless — attention as a survival mechanic.

---
# V2 PAYLOAD — BACKFILLED 7/16/26 (FORMAT LAW v2). Original content above untouched.

## V2-A CAST + WHAT EACH ONE WANTS

**DR. THOMAS HILDERN** — wants the data, and wants to not know what it costs. OSI bureaucrat buying salvation at a desk. Will trade: caps. Will never say: that he already sent a person (Keely) and stopped counting the days. FUNCTION: quest giver as the banality of institutional appetite. He is not evil. He is a budget.

**KEELY** — the prior expedition, alive, furious, and RIGHT. Wants the data destroyed because she has read it and understands what an aerosolized crop-killer-turned-man-killer does to a wasteland that shares air. Will trade: her endorsement of the deletion; nothing else. Will never say: thanks. FUNCTION: the witness who wants the object of the errand un-made. The anti-fetch.

**THE VAULT ITSELF** — wants nothing; it is a garden that ate its gardeners. FUNCTION: the argument. Five floors of green over bones IS Keely's case, staged before you meet her.

**THE SPORE CARRIERS** — the vault's population, present tense. FUNCTION: the data, demonstrated.

## V2-B THE CONVERSATIONS (node trees)

NODE: HILDERN_HIRE — Camp McCarran, entry: quest start
  Crop data, vault, fee. He withholds Keely's existence.
  > "What happened to the last team?"   [gate: none] -> H_DEFLECT ("records are incomplete") — THE LIE IS PASSIVE-VOICE. Bank the construction: institutions lie in the passive voice.
  > "Fine. Fee up front?"               [gate: none] -> hired
  NOVERB: "Is the data safe to bring back?" — the question the whole quest turns on cannot be asked at the desk. It can only be answered in the vault.

NODE: KEELY_FOUND — entry: rescued from the spore nest
  She does not thank you. She goes back to work and orders you around her own rescue.
  > "Hildern sent me for the data."     [gate: none] -> K_CASE (she makes the argument: read it, then decide)
  > "You're welcome, by the way."       [gate: none] TRAP -> K_CONTEMPT (costs warmth, changes nothing; the trap teaches that she is not a reward dispenser)
  > (help her finish the burn first)    [gate: none] SILENCE -> K_RESPECT (deeds, not lines)

NODE: THE_TERMINAL — the fork, entry: data in hand, gas vented or not
  The quest's whole weight lands on a menu with no NPC in the room.
  > [UPLOAD to Hildern]      [gate: none]              -> B1/B2 path. Caps. And the ending acknowledges what the OSI does with hungry science.
  > [DELETE]                 [gate: none]              -> B3 path. Keely's way. Hildern stiffs you.
  > [Science 70: copy the SAFE subset] [gate: science>=70] -> B4. The "have it both ways" gate.
  COMPILE NOTE: again FNV's skill gate, again with a workaround (persuading Keely via her own data exists as a Speech route in the wider quest). Bohemia conversion: the "safe subset" becomes a DEED gate — you can only extract the safe subset if you BURNED THE NEST FLOOR (flag), i.e. the careful path is earned by prior thoroughness, not by a character sheet.
  THE STAGING FINDING: the biggest moral choice in the quest is made ALONE, at a terminal, with both advocates offstage. Cross-ref Q119 (PLAY/DELETE alone) — this is the pattern's origin point in the questbook. Bohemia uses it deliberately: the Fold's worst decisions get NO audience.

NODE: KEELY_VERDICT / HILDERN_PAYOUT — mirrored closers
  Tell each what you did; each has a text for every branch, including being lied to.
  > lie to Keely (uploaded, claim deleted)  [gate: none] TRAP -> she checks. She is a scientist. The lie FAILS and costs everything with her. THE MECHANIC: some NPCs verify. The game does not warn you which.

## V2-C THE BRANCH MAP

COUNT: 4.
B1 — Upload, full data. Caps, Hildern satisfied, the wasteland's future quietly mortgaged in the ending slides.
B2 — Upload after venting the gas (dungeon state variant): same, cleaner conscience about the vault, same mortgage.
B3 — Delete. No caps, Keely's respect, Hildern hostile-lite. The quest pays you in NOTHING and dares you to feel it was worth it.
B4 — Safe subset (Science 70). Both parties partially satisfied. The compromise exists but is GATED — the game charges character-build for moderation.
STRUCTURAL FINDING: the reward gradient runs OPPOSITE to the moral gradient (most caps = worst outcome). No karma meter comments. The LEDGER is the sermon. This is Bohemia's survival-accounting thesis stated by a 2010 quest: cross-ref Q126 PORT 6 (mercy is arithmetic).

## SOURCES
Fallout Wiki (fallout.wiki) + Fandom + The Vault (full route, skill gates, the Science 70 argument, the
Karma-on-lie-not-kill model, the Cassidy/You-Can-Depend-on-Me exclusivity, the song pun); Game8 +
gamepressure + SuperCheats + Altered Gamer + Wasteland Gamers (stage-by-stage, the gas-ignition set-piece,
the traversal keys, the payout numbers). FUTURE: an essay on NV's anti-institutional themes for the
"destroy the data" pattern across the game (Vault 22, the NCR, House).
