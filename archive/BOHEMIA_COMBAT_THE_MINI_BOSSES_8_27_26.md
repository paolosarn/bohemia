# V190 — THE MINI BOSSES (COMBAT lane, 8/27/26)

His ruling, 8/26, on what experience is for:

> "LEVELING UP LEVELS AND GIVES YOU EXPERIENCE FOR EXPERIENCE TREE CYBER PUNK
> ELDERSCROLL PERK AND BONUS SHIT. **WILL ALSO GO HAND IN HAND WITH ABILITIES AND
> THE 60 MINI BOSSES IN THE GAME THAT GIVE YOU A NEW WAY TO INTERACT WITH BOHEMIA
> BRO!**"

---

## WHAT I FOUND BEFORE WRITING ANYTHING

**THE BOSSES HAVE EXISTED ON PAPER FOR THREE WEEKS AND NOT ONE OF THEM WAS IN THE
GAME.** `records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md` holds **fifty-three** of
them, each with a NAME, a HOLD, a LOCK stated as an impossibility, a GRANT and a
KIND, audited across seven passes and **ten of his own rulings**, with
`boss_ladder_gate.js` (87 checks) holding every lock distinct.

It was a document. You could not fight it, you could not beat it, and **nothing in
the running game had ever read one byte of it.**

Same shape as five other finds this week: the material existed and never reached
the player. `chewCover` unreachable. `FINISH_AT` unreachable. Five of six deaths
dropping nothing. A kit verb with no caller. A perk switch with no hand on it.

## SO NOT ONE BOSS WAS INVENTED HERE

The patch tool **parses his record at build time** and emits all fifty-three
verbatim — name, hold, lock, grant, kind, act. MECHANISM-MINE / CONTENTS-PAOLO'S
with the seam made out of a file instead of a promise. The gate re-reads the record
and compares every row character for character: **0 rows drifted.**

**FIFTY-THREE, NOT SIXTY.** The ladder's own first line calls itself "a pool to cut
from, not a shipping list" and puts the final count under WHAT I AM NOT DECIDING.
Seven more names in that file is seven more bosses in the game with no code
written.

---

## WHAT SHIPS

**SIX TRAITS, AND EVERY ONE IS A FLAG THIS ENGINE ALREADY READS.** A boss is 2.2x
health (capped) and a JOB.

| | boss | what the fight measured |
|---|---|---|
| **HE IS NEVER ALONE** | THE POT | his two nearest stand **2.59 tiles** off him, against **4.31** for a boss nobody is told to guard |
| **HE IS PLATED** | THE LOCKSMITH | armour **9**: a raw 30 lands as **21** on him and **30** on the man beside him |
| **HE RANGES YOU** | THE SURVEYOR | `spotter` on, and his accuracy and damage are **ARCH.human's exactly** |
| **HE BREAKS STONE** | THE BURN | `breach` on — he shoots the rock you are behind |
| **HE HOLDS THE HEIGHT** | THE TAP | takes the deck on **8 of 12** lots that have one |
| **HE CLOSES** | THE TOOTH | advance **3**, cadence every turn |

**NOT ONE ACCURACY OR DAMAGE NUMBER DIFFERS FROM THE ARCHETYPE HE WAS BUILT FROM.**
Gated: `eyes.acc === ARCH.human.acc`, `eyes.dmg === ARCH.human.dmg`,
`plated.dmg === ARCH.bot.dmg`.

**A BOSS FIGHT IS BIGGER, ON HIS OWN NOTES.** V167 quotes RF4's designer — "3-4
enemies with 5-6 being very hard and **anything above that being reserved for boss
fights**" — and we shipped the 3-6 band and left 7-8 unused because there was
nothing to reserve it for. Measured: ordinary fights **3-6**, boss fights **6-8**.

**THE LOCK IS REAL OR THE GRANT IS A CERTIFICATE.** Two of his fifty-three name
verbs this engine already owns:

- **THE CLIMB** — press STAIRS on a lot that has them: level **0** before,
  level **1** after. Before, it says *"YOU CANNOT CLIMB — THE CLIMB holds the hoist"*.
- **THE CHARGE** — the grenade reads **false** before, **true** after. Before, it
  says *"YOU HAVE NOTHING THAT GOES OFF — THE CHARGE holds the charges"*.

A locked button that no-ops teaches nothing. A locked button that says a NAME is a
quest.

**AND THE KEY IS ON HIS BODY** (his 8/25 ruling, "off their bodies"). Not held when
he falls, held after the walk, paying **188 xp** against an ordinary body's **15**.
It **survives the next fight**, is written to storage, and is published to the
parent window as `bohemiaKeys` so CITY, RUN and QUESTS can read what you hold
without knowing anything about combat.

**ONE TURNS UP UNASKED**, and only ever a man who still holds something you lack:
**14.6%** of fights over 4,000 rolls, **53** different men, and **0 of 2,000** once
every key is yours.

**WHERE HE CHANGES IT HIMSELF (8/12):** COMBAT tab, DEMO SETTINGS, a BOSSES row —
all 53 in a list, what you hold spelled out, and GIVE IT ALL BACK.

---

## THE BUG THIS ALMOST SHIPPED, AND ONLY AN OLD GATE FOUND IT

**A FEATURE THAT COSTS A SEEDED STREAM ONE DRAW REWRITES THE WHOLE MAP.**

The first cut rolled the boss inside `BohemiaArena.withDice`, which swaps
`Math.random` for a seeded stream so that — V88's own promise — *"one number
reproduces one exact fight, forever."*

One extra draw per fight **silently re-dealt every arena Paolo has ever written
down**. No crash. No warning. Every single V190 check green.

What caught it: **two long-standing arms with nothing to do with bosses went red.**
V173's backliner distance collapsed from a 1.0-tile margin to 0.55, and V180's
open-ground economy moved off its dial. Neither arm knows what a boss is. That is
the whole argument for keeping old measurements running — **the arm that catches a
new feature's damage is almost never the arm written for it.**

The roll now happens in the wrapper, before the swap. Gated both ways: seed 4
replayed 40 times gives **1** arena signature across 71 pieces of cover, identical
to the same seed with the roll switched off, and `setupEnemiesBody` must never call
`rollBoss` at all.

## AND TWO NUMBERS THE FIRST MEASUREMENT CORRECTED

1. **A PLATED BOSS WAS A TWENTY-HIT WALL.** 2.2x on a SEC-BOT's 160 is 352, plus 9
   armour. That is not a hard fight, it is a LONG one — the "messy kiting" RF4's own
   designer warns about and the thing V167 shrank the roster to escape. Capped at
   **200**. The surviving spread is 99 (a sniper holding a roof) to 200 (a plated
   machine), so which boss you drew still changes how long he takes.
2. **TWO OF THE SIX TRAITS PRODUCED THE IDENTICAL MAN.** EYES and HIGH both read
   `sniper`, and `ARCH.sniper` already carries `spotter:true` — so only the deck told
   them apart. EYES is an ordinary body now: a goon whose job is to range you, which
   is exactly what V168 built the flag to mean.

---

## THE HARNESS WAS WRONG TWICE AND BOTH WERE MINE

1. **THE KEY ARM READ ZERO XP.** `worldShift` sweeps the ground it moves you over —
   "the world moving under him IS him walking" — so the pickup had already happened
   before the probe read `TREE.xp`. Same class as V180's three dead measurements.
2. **THE CLIMB ARM PASSED, THEN FAILED, ON THE SAME CODE.** A deck is rolled per
   arena, and a lot without stairs refuses the climb for a reason that has nothing
   to do with a key. It rolls until it has stairs now, and says so.

## THREE GATE ANCHORS RE-POINTED FOR STRUCTURE, NEVER FOR OUTCOME

- **V88** matched the `setupEnemies` wrapper as one exact literal line. Re-pointed
  to what it always meant (the body is WRAPPED, not rewritten) and **strengthened**
  with the seed claim above.
- **V121**'s ordering window 900 → 4000 chars. The boss block sits between the deck
  holders and the occupancy sweep, which is where it belongs.
- **V181**'s xp-branch regex now allows the boss multiplier on the same line. Still
  on the body, still through the sweep, still nothing if you never walk to it.

---

## GATES AT CLOSE

| gate | |
|---|---|
| `fight_moves_you_gate.js` | **122 pass / 0 fail** (was 114/0; 8 new arms) |
| `combat_lab_gate.js` | **931 pass / 1 fail** (baseline 930/1; the one red is another session's fight-music ladder) |
| `boss_ladder_gate.js` | 87 / 0 |
| `one_engine_gate.js` | 3 / 0 |
| `tool_idempotent_gate.js` | 6 / 0 |
| page errors | **0** |

## WHAT COMES AFTER

**THE OTHER FIFTY-ONE GRANTS LIVE OUTSIDE COMBAT.** The map, cooking, tattoos, the
workshop, the farm — those are CITY, RUN and QUESTS. The keys are already published
to the parent window as plain facts, so the next move is those lanes reading
`bohemiaKeys` and closing their own doors. **Nothing about that is combat's to
write.**

And three of his 8/25 play notes are still open and still named as open: **ammo is
confusing** (a readability job), **"it could be more hardcore if you wanted it to
be"** (permission, not a ruling), and the pillars-and-stairs note — half answered by
V187's shapes and by THE CLIMB making height something you earn, not by the terrain
itself.
