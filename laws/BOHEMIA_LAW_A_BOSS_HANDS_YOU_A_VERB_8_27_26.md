# BOHEMIA — A BOSS HANDS YOU A VERB (Paolo 8/26/26, built 8/27, LOCKED)

> "LEVELING UP LEVELS AND GIVES YOU EXPERIENCE FOR EXPERIENCE TREE CYBER PUNK
> ELDERSCROLL PERK AND BONUS SHIT. **WILL ALSO GO HAND IN HAND WITH ABILITIES AND
> THE 60 MINI BOSSES IN THE GAME THAT GIVE YOU A NEW WAY TO INTERACT WITH BOHEMIA
> BRO!**"
> — Paolo, 8/26/26

---

## THE LAW

**A BOSS DOES NOT DROP A TROPHY. IT HANDS YOU A VERB.** Every mini boss in this
game holds ONE thing you cannot do, and beating him is how you start being able to
do it. Not a stat, not a number, not a piece of loot: **a thing the world would
not let you do yesterday.**

Three clauses, and the third is the one everything else fails on.

### 1. THE LADDER IS THE CONTENT AND IT IS READ, NEVER RETYPED

`records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md` holds fifty-three of them, each with
a NAME, a HOLD, a LOCK ("impossible before") and a GRANT, across seven passes, ten
of his own rulings, and a gate that keeps every lock distinct. **The game parses
that file at build time.** Not one boss is written in code. Edit the record and
the game changes; that is MECHANISM-MINE / CONTENTS-PAOLO'S with the seam made out
of a file instead of a promise.

**FIFTY-THREE, NOT SIXTY, AND THAT IS DELIBERATE.** The ladder's own first line
calls itself "a pool to cut from, not a shipping list" and puts the final count
under WHAT I AM NOT DECIDING. Seven more names in that file is seven more bosses
in the game with no code written.

### 2. A BOSS IS HEALTH AND A JOB, NEVER A BIGGER GUN

**NO DAMAGE BEFORE THE DIAL** is older than this law and it wins. A boss carries
2.2x health, capped, and **one TRAIT** — and every trait is a flag this engine
already reads, turned on for one man:

| TRAIT | WHAT HE DOES | THE MACHINERY, ALREADY SHIPPED |
|---|---|---|
| **HE IS NEVER ALONE** | two of his stay on him | ordinary bodies, placed by bearing |
| **HE IS PLATED** | flat armour, small hits do not count | `makeEnemy` has read `armor` since 7/4 and its own comment says "elites/bosses/robots set it later" |
| **HE RANGES YOU** | he spots, every gun uses it | V168's `spotter` |
| **HE BREAKS STONE** | he shoots the rock you are behind | V177's `breach` |
| **HE HOLDS THE HEIGHT** | he takes the deck and stays | V90's deck |
| **HE CLOSES** | he comes at you and he is fast | the blade cadence |

Not one accuracy or damage number differs from the archetype he was built from.
**A boss who hits harder is a number. A boss with a job is a fight.**

### 3. THE LOCK HAS TO BE REAL, OR THE GRANT IS A CERTIFICATE

This is the clause the whole law lives or dies on. **If nothing is ever closed, no
boss ever gives you anything** — the "grant" is a line of text congratulating you.

Two of his fifty-three name verbs this engine already owns, so **those two verbs are
dark until you take them**:

- **THE CLIMB** holds "the last hoist that lifts". Its lock, his words: *everything
  above the ground floor is scenery.* We have had a deck since V90. Press STAIRS
  and the game names the man who has them.
- **THE CHARGE** holds "who still has anything that goes off". Its lock: *a wall is
  a wall, and a door is the only way in.* The grenade is his.

A locked button that no-ops teaches nothing. **A locked button that says a NAME is
a quest.**

### AND THE KEY IS ON HIS BODY

His ruling, 8/25: *"you get experience and loot OFF THEIR BODIES."* A key handed
over at the killshot is a cutscene. A key lying in the open with his people still
shooting is the last decision of the fight. It rides V181's drop machinery, pays
four times an ordinary body, and it **survives every fight you will ever have**,
because THERE ARE NO RUNS.

### AND A BOSS FIGHT IS BIGGER, ON HIS OWN NOTES

V167 quotes RF4's designer: *"the typical encounter should have 3-4 enemies with
5-6 being very hard and **anything above that being reserved for boss fights**."*
We built the 3-6 band and left 7-8 unused because there was nothing in this game to
reserve it for. A boss fight rolls 6-8. The reserved band finally means what his
notes said it meant.

---

## THE BUG THIS LAW ALMOST SHIPPED, AND THE RULE THAT COMES OUT OF IT

**A FEATURE THAT COSTS A SEEDED STREAM ONE DRAW REWRITES THE WHOLE MAP.**

The first cut rolled the boss inside `BohemiaArena.withDice`, which swaps
`Math.random` for a seeded stream so that — V88's own promise — *"one number
reproduces one exact fight, forever."* One extra draw per fight silently re-dealt
**every arena Paolo has ever written down**. No crash. No warning. Every V190 check
green.

It was caught only because **two long-standing gate arms with nothing to do with
bosses went red the moment it landed.** That is the entire argument for keeping old
measurements running: the arm that catches a new feature's damage is almost never
the arm written for it.

The roll now happens in the wrapper, before the swap. Gated both ways: the seed's
arena signature must be identical with the roll live and with it off, and
`setupEnemiesBody` must never call `rollBoss` at all.

---

## WHERE HE CHANGES IT HIMSELF (8/12)

**COMBAT tab → DEMO SETTINGS → BOSSES.** All fifty-three in a list; pick one and
the next fight is him. What you hold, spelled out. A button that hands it all back.
Without that row a boss is something the machine can measure and he cannot reach,
which is exactly the failure the 8/12 law exists to kill.

## WHAT IS HIS AND IS NOT DECIDED HERE

Who the remaining bosses are. Which man fights which way (every trait ships
`draft:true`). Every number. What the other fifty-one grants do in CITY, RUN and
QUESTS — the keys are published to the parent window as plain facts so those lanes
can read them without knowing anything about combat.

---

**GATE:** `gates/fight_moves_you_gate.js` — the ladder read back against his record
character for character, every trait as an engine flag, the reserved band, both
locks pressed for real, the key taken off a body and surviving the next fight, the
roll only offering a man who still holds something, the seed still stable, and the
row he changes it in. Plus `gates/combat_lab_gate.js` holding the wrapper: nothing
draws off the seeded stream that is not part of the arena.

**TOOL:** `tools/bohemia_combat_the_mini_bosses_patch.py` (V190), idempotent,
replayable onto fresh main.
