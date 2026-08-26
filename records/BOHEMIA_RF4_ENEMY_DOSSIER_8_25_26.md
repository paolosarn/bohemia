# THE ROGUE FABLE IV ENEMY DOSSIER
# (8/25/26, coordinator, on his order: "DO BIG BRAIN RESEARCH ON ALL THE
# ENEMIES OF ROGUE FABLE 4 REAL QUICK." Pairs with, and sharpens,
# records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md.)

## COLLECTION NOTE, STATED BECAUSE IT LIMITS CONFIDENCE
The network proxy BLOCKS rogue-fable-iv.fandom.com outright (measured:
EGRESS_BLOCKED), so the full 250-monster table could not be read
directly. What follows is assembled from the DESIGNER'S OWN devlog text,
patch notes, and search-surfaced wiki content, all attributed. The
ARCHITECTURE is fully recovered and it is the part that transfers. The
complete named roster is not, and I am not going to invent it.

## 1. THE TAXONOMY — FIVE ARCHETYPES, IN JUSTIN WANG'S OWN WORDS
This is the whole system. Every one of RF4's 250+ monsters is one of
these five wearing a costume.
**PLINKER** — "typically ranged enemies that chip away at your health,
are not very dangerous and are a low priority target, BUT DUE TO THEIR
RANGE THEY APPLY CONSTANT PRESSURE ON THE PLAYER TO FINISH THE FIGHT
QUICKLY."
**NUKER** — "monsters that dump a ton of damage into the player and can
be either ranged or melee; the player does not want to get hit by these
guys AND MUST PAY VERY CLOSE ATTENTION TO THEM during the fight."
**SWARMER** — "weak enemies that come in large groups and CAN QUICKLY
SURROUND THE PLAYER, tend to get in the way, and some form of AoE is very
good for dealing with them."
**SUMMONER** — "often some of the most dangerous and high priority
targets since THEY FILL THE BATTLEFIELD WITH MONSTERS WHICH TEND TO ACT
AS A SHIELD and make it difficult to kill the summoner."
**TANK** — high damage, LOW MOBILITY, and "best ignored until the end of
the fight."
### WHY THIS IS THE FINDING AND NOT A LIST
**EACH ARCHETYPE IS A DIFFERENT INSTRUCTION TO THE PLAYER, AND THE FIGHT
IS THE ARGUMENT BETWEEN THEM.** The plinker says HURRY. The tank says
IGNORE ME. The summoner says COME HERE NOW. The swarmer says DON'T LET
ME SURROUND YOU. The nuker says WATCH ME AND NOTHING ELSE. A room with
three of them is a room where the player is being told three
contradictory things and has to pick. THAT is the puzzle, and it is built
out of five ideas, not two hundred and fifty.

## 2. THE STAT BLOCK IS TINY, ON PURPOSE
The recovered example, Goblin Shaman:
    HP 12 · Speed NORMAL · Size SMALL · Level 3 · Range 5
    Abilities: HEAL, SLOW
**SIX NUMBERS AND TWO VERBS.** That is the whole monster. It matches the
project's stated design — "deliberately free of stat and formula bloat,
most of the critical information presented in the world and on the field
of battle itself." SPEED is a WORD, not a number. SIZE is a category.
A player can hold this in their head, which is the entire point.

## 3. THE AI RULES THAT MAKE THE ARCHETYPES BITE
From the devlog and the series' own wikis:
- **THERE IS ALMOST ALWAYS A HIGHEST-PRIORITY TARGET**, and it is usually
  a SUPPORT type at the BACK. Intended play: "rather than simply blasting
  away at whichever enemy is closest the player often needs to plan a few
  turns ahead, IGNORE THE NEAREST ENEMIES and somehow maneuver himself
  into position to kill the Priority-Target who is often hiding in the
  back."
- **THE BACKLINE ACTIVELY RUNS FROM YOU.** Support AI keeps line of sight
  and range to at least one ALLY while biased AGAINST being close to, or
  in line of sight of, the PLAYER. "Forces the player to either aggro
  into them or have tools to pick them off."
- **THE ANTI-PULL SHOUT.** "There is now a 50% chance that enemies will
  shout immediately upon gaining agro to prevent easy, repeatable single
  pulls." Series precedent (RF3): a shout aggros within 6 tiles, nothing
  beyond ~10.5, and OUTSIDE LINE OF SIGHT THE RADIUS HALVES TO 3.
- **PLAYER GUIDANCE CONFIRMS IT:** "shamans should be prioritized and
  killed early to stop them from healing, as well as mages and archers,"
  and archers fire at most every 3 turns because arrows carry a 2-turn
  cooldown. **THE COOLDOWN IS THE TELL** — a ranged enemy that fires
  every turn is noise; one that fires every third turn is a clock the
  player can read and beat.

## 4. THE MODIFIER SYSTEM — 250 MONSTERS FROM ONE TABLE
Enemies carry stacking modifiers rather than being hand-authored:
RF3: **FAST** (moves at fast speed), **REGENERATION**, **REFLECTIVE**
(melee attacks on it damage you back), **TOUGH** (1.5x health),
**STRONG** (increased damage).
RF4's ranked mode extends it with tiers: **TOUGH** 125/150/200% HP,
**DEADLY** 150/200/300% damage, **REGENERATION** x4/x6/x8, **RAPID
HEALING** (-1/-2/-3 cooldown on enemy heals), **CONSUMABLE-LOCK**
(10/20/40 turn lockout after using a wand), and **EXEMPLAR**, where every
elite gains twice the usual elite bonuses.
**THIS IS THE FACTORY LAW, IN THEIR ENGINE.** Five archetypes x a
modifier table x a zone palette = 250 monsters without 250 designs. It is
exactly how this repo already builds districts and clothing.

## 5. THE TRANSLATION TO OUR VALLEY — AND ONE ARCHETYPE DOES NOT SURVIVE
Mapping the 8/25 bestiary research onto the five:
- **SWARMER — RATS.** Straight across. They surround, they are weak, they
  get in the way. Flies are the ambient version.
- **TANK — the thing you walk around.** A burro that will not move. A
  wrecked car with something living in it. Low mobility is the whole
  point, and our streets are full of immovable things already.
- **SUMMONER — THE ONE THAT BARKS.** *** THIS IS THE BEST FIT IN THE
  WHOLE MAPPING AND IT IS FREE REALISM. *** RF4's summoner "fills the
  battlefield with monsters which act as a shield." A dog or a coyote
  that howls does EXACTLY THAT, for real, in the real world. And we
  already took the anti-pull shout from the RF4 lift — so the shout
  mechanic and the summoner archetype are THE SAME ANIMAL BEHAVIOUR.
  Kill the one that is barking, or the whole block arrives.
- **NUKER — the one hit you cannot take.** Africanized bees in a wall. A
  person with a rifle. Both say WATCH ME AND NOTHING ELSE.
- **PLINKER — *** THIS ONE HAS ALMOST NO ANIMAL ANALOGUE. *** **
### THE FINDING THAT CHALLENGES WHAT WE BELIEVE
RF4's roster is built on MAGES AND ARCHERS. Take away magic and bows and
**the plinker mostly disappears, and half the nukers with it.** Animals
do not have ranged attacks. A coyote cannot chip you from nine tiles.
**SO A PURE-ANIMAL BESTIARY CANNOT PRODUCE RF4'S FIGHT SHAPE.** The
constant ranged pressure that says HURRY UP — the thing that stops a
fight becoming "stand in the doorway and swing" — has to come from
somewhere else, and there are only two candidates:
  1. **PEOPLE WITH GUNS.** Which means factions and hostile humans are
     NOT flavour on top of the animal layer. They are STRUCTURALLY
     REQUIRED for the combat to have its shape at all.
  2. **THE ENVIRONMENT.** Heat, thirst, the day clock, a fire, a
     collapsing floor. A timer is a plinker that never misses.
**AND WE ALREADY HAVE THE SECOND ONE BUILT** — heat is the daily
condition (7/31), the day advances 0.084 per cell, and the RF4 lift
already took terrain kills. THE CLOCK IS OUR PLINKER. That is a real
answer, it is more Bohemia than an archer would ever be, and it means the
animal tiers can ship without waiting on the faction roster he reserved.
Whether hostile PEOPLE join the bestiary is his call and this record does
not decide it.

## 6. WHAT I COULD NOT GET — DO NOT LET ANYBODY GUESS IT
- The full 250-monster table and the per-zone rosters for RF4's thirteen
  zones. The wiki is proxy-blocked.
- RF4's exact damage numbers, and how much randomness survives after the
  Protection/Block unification.
- The complete ability list per monster.
**RECOMMENDED AND CHEAP, SAME AS THE 8/16 DOSSIER SAID: he owns the
game.** One recorded run, or one screenshot of the enemies page, closes
every gap above in a minute. NOT A BLOCKER — §1 through §5 is the part
that transfers, and it is the part that was always going to transfer.

## 7. ROUTED
- **COMBAT — BESTIARY (amended):** the valley's enemies are authored as
  FIVE ARCHETYPES x A MODIFIER TABLE x A DISTRICT PALETTE, not as a list
  of animals. The archetype is the design; the animal is the costume.
  THE SUMMONER IS THE ONE THAT BARKS, and it reuses the shout machinery
  already taken from RF4.
- **COMBAT — the stat block is SIX NUMBERS AND TWO VERBS.** If a Bohemia
  enemy needs a spreadsheet to explain, it failed RF4's own test and his
  ("spreadsheet simulators and I'm not a fan").
- **COMBAT / LAB — THE CLOCK IS THE PLINKER.** Ranged pressure comes from
  time and terrain, not from animals with bows. This is the answer to
  §5's gap and it is cheaper than the alternative.
- **LAB — the teardown spec** takes §1-4 as recovered architecture; §6 is
  the open list, and it closes with one screenshot from him rather than
  another search.

## 8. CONFIDENCE
- The five archetypes: DESIGNER'S OWN WORDS, quoted. **HIGH.**
- The Goblin Shaman stat block and the archer cooldown: series wiki via
  search. **MEDIUM-HIGH** (RF3 numbers; RF4 has rebalanced).
- The modifier tables: patch notes and wiki. **MEDIUM-HIGH.**
- The priority-target and backline AI: devlog. **HIGH.**
- The translation in §5 and the plinker gap: MY ARGUMENT built on the
  above, flagged as design reasoning rather than a finding.

## SOURCES
Justin Wang, "Game Design: Combat" devlog for Rogue Fable IV (11 Dec
2023) — the five archetypes and the priority-target design; Rogue Fable
IV Steam page (250+ monsters, 30+ bosses); Rogue Fable IV update 1.3
"Ranked Mode II" patch notes (modifier tiers, Exemplar); Rogue Fable III
Fandom wiki (List of Enemies, Enemy Modifiers, Enemy Information, Goblin
Shaman, Tactics); Steam Community "Rogue Fable III Tactics Guide"; itch.io
community threads. rogue-fable-iv.fandom.com is blocked by this
environment's egress proxy and was NOT read. Prior in-repo:
records/BOHEMIA_RF4_RESEARCH_DOSSIER_8_16_26.md,
laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md,
records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md.
