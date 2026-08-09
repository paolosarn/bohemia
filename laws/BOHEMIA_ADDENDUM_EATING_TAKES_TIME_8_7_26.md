# BOHEMIA ADDENDUM — EATING TAKES TIME (Paolo 8/7/26, LOCKED)

## HIS WORDS, VERBATIM

> "C if its immediatw danger the player knows about because eating will take up
> time type shit. The amount of time depends on the food"

He was answering a three-way question about whether eating should consume real
world time:

  A. real time, scaled to what you eat
  B. instant
  C. real time, but the game blocks you from eating when something is near

## THE RULING

**C, WITH A HARD QUALIFIER, AND IT CARRIES A OF THE ORIGINAL THREE INSIDE IT.**

1. **EATING TAKES REAL WORLD TIME.** Not a button, not instant. The clock moves
   while you eat. This is the part he stated as the REASON for the rest:
   *"because eating will take up time type shit."*

2. **HOW MUCH TIME DEPENDS ON THE FOOD.** *"The amount of time depends on the
   food."* One number per food, not one number for eating. A scavenged snack is
   not a cooked meal. **HE SET THE ANCHORS HIMSELF, 8/7 (see below).**

3. **IT IS BLOCKED ONLY BY IMMEDIATE DANGER THE PLAYER KNOWS ABOUT.** This is
   the qualifier and it is the whole design. Not "danger exists". Not "something
   hostile is somewhere on the map". The gate is danger that is BOTH
   **immediate** AND **already known to the player**.

## HIS NUMBERS (Paolo 8/7/26, same day, LOCKED)

> "Eating a snack might take 10 minutes eating a five star meal might take an
> hour. I'm going to sleep could take six through 12 hours."

| act | world-clock cost |
|---|---|
| snack | **10 minutes** |
| five star meal | **1 hour** |
| sleep | **6 to 12 hours** |

**THE EATING SPREAD IS SIX TO ONE**, and that ratio is the design, not the two
endpoints. A snack is cheap enough to take standing up in the open; an hour is
long enough that eating well is a thing you go somewhere safe to do. Food stops
being a stat top-up and becomes a decision about where you are and what you can
afford to stop doing. The intermediate foods are HIS — MECHANISM-MINE /
CONTENTS-PAOLO'S — but they interpolate between these two anchors.

**SLEEP IS A RANGE, NOT A CONSTANT.** Six to twelve hours. That is the one thing
in this ruling that closes a [PENDING]: the first version of this addendum said
sleeping had no ruling. It does now, and it is deliberately not a single number,
which means the length is a thing the player or the situation settles rather
than a fixed animation. Sleep is therefore the same rule as eating with a bigger
range, not a separate system.

**GROUNDED, because everything in Bohemia is grounded in the real.** A real
snack is 5 to 10 minutes and a real sit-down meal runs 45 to 90; a real night is
6 to 9 hours with 12 being the long end of catching up on debt. He picked the
true numbers, and the game does not have to explain any of them.

### WHAT THAT ALREADY MEANS FOR THE SOUND, TODAY

TIME_PASS strikes once per hour (his other 8/7 ruling: *"For hours go by have it
the amount of time that goes by"*). Laid against these numbers it lines up
without a single change:

- **snack, 10 minutes → SILENT.** The strike floor is one hour, and ten minutes
  is not "hours going by". You hear the eat sound and nothing else.
- **five star meal, 1 hour → ONE strike.** Exactly the floor.
- **sleep, 6 to 12 hours → SIX TO TWELVE strikes,** and you can count them.

The cap on strikes is 12. That was chosen before these numbers existed, for the
reason that past twelve you cannot count them and a clock face stops there. His
maximum sleep landing on exactly 12 is a coincidence, not a design I can claim —
but it means the cap can never actually truncate a real night, which is worth
knowing before anyone "fixes" it.

## WHY THE QUALIFIER IS THE ENTIRE POINT

A plain C ("you cannot eat when anything is near") would be the game reading the
world state and overruling him with information he does not have. That is the
game playing itself, and it makes the block feel arbitrary: you press eat,
nothing visible is wrong, and the game says no.

Gating on **danger the player knows about** inverts it. The block is never a
surprise, because by definition he can already see the reason. The refusal is
information he already had, so it reads as sense rather than as the game being
difficult. And it leaves the real cost intact: out in the open, with nothing
visible, eating a real meal still spends real time, and whatever walks up during
those minutes was not something the game warned him about — it was the risk he
took.

That is the life lesson underneath, and the game never says it: **the safe
moment to take care of yourself is a thing you have to notice, not a thing you
are told.**

## WHAT THIS BINDS

- Eating consumes world-clock time, per food.
- The eat action is refused ONLY while immediate, player-known danger is present.
- "Player-known" is a real state that has to exist. If the run cannot answer
  "does the player currently know about this threat", that question has to be
  built before the block can be built. A block that guesses is the failure mode
  this addendum exists to prevent.
- SLEEPING IS RULED: 6 to 12 hours (his 8/7 numbers above). It is the same rule
  as eating with a bigger range, not a separate system. The [PENDING] that stood
  here for one turn is CLOSED.

## WHAT IT ALREADY CHANGED, THE SAME DAY

The SOUND lane had EAT wired to a one-shot with no ruling on duration. His
verdict of 8/7 approved eat.2 as the sound, and this ruling says the eat MOMENT
is not instantaneous. It also gives TIME_PASS its job: his note on the same
export, *"For hours go by have it the amount of time that goes by"*, is the
sound side of exactly this rule — time spent is a real quantity and the game has
to express how much.

## LANE

The eat action, the per-food time table, and the "immediate danger the player
knows about" state are RUN / LIFE work, not SOUND. This addendum is the record
so that whoever holds that lane builds it to the ruling instead of re-asking him.
