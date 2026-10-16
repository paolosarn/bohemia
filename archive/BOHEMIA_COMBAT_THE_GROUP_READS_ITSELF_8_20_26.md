# THE GROUP READS ITSELF (v171, RF4-25, the first ★★★ row this lane has built)

COMBAT lane, 8/20/26. **TAB: COMBAT.**

> **Paolo, 8/20:** *"combat. continue building rogue fable 4"* — after
> *"this is not even close."*

## THE ROW, AND WHY IT WAS THE ONE

RF4-25, three stars:

> *"Enemies synergize when in groups, with each new enemy treated differently
> depending on what group it spawns with, creating exponential growth in
> complexity... the same enemy added to 5 very different groups should produce 5
> very different combat encounters."*

Our own diff column had already answered his complaint, word for word, weeks
before he made it:

> **"ABSENT."** 5 real types exist and **"none of them read each other. This is
> the actual answer to 'why does the fight feel flat'."**

**Measured rather than repeated:** every enemy brain in the blob does loop the
roster — `pressAI`, `coverSeekAI`, `enterAim`, `grenadeTurn`, `meleeTurnRun` —
and **every one of those loops is occupancy**, marked `/* one body per spot */`
in the source. Not one enemy's decision read what another enemy **is**. Five
archetypes, five solo actors sharing a room.

---

## FIRST, THE BASELINE NOBODY HAD TAKEN (RF4-14)

RF4-14 is the row the document calls *"the single most important line in RF4's
design notes"*: **"there is almost never a turn in which the player is not either
using an ability or moving into position to use an ability in the next turn or
two."** Our diff column had said **NOT MEASURED** for three weeks.

Measured, 30 fights, 420 player turns, on the shipped predicates:

| while men are still up | |
|---|---|
| can shoot somebody right now | **79.6%** |
| can pin somebody right now | **20.4%** |
| nothing to do but wait | **0.0%** |

| after the board is clear | |
|---|---|
| nothing to do but wait | **100%** (58 turns across 30 fights) |

**The fight is not idle. The walk out is.** Roughly two dead turns per fight,
all of them after the last man falls, spent walking to the way out with no
decision left in the room. That is now a stated number instead of a feeling, and
it is the honest baseline every later claim gets compared against.

**One thing I could not measure and am not reporting as if I did.** I built a
probe that reversibly walks the world one and two steps to ask whether
repositioning would open a shot. Its control — a man parked one tile outside
reach, where stepping at him *must* open the shot — would not come back true
reliably, because the player's reach is itself a function of the roster
(`myRange` reads `longestFoeReach`) and the arms kept landing on the float
boundary. **A number whose control fails is not a number**, so the probe is
dropped and nothing here rests on it.

---

## WHAT SHIPPED

**One read of the roster**, `squadRead()`, computed once per turn and cached, and
consulted in exactly **one** place: `standoff`, the variable that already decided
how close a man is willing to get. No new geometry. Two rules:

1. **THE ANVIL.** While a friendly blade is *closing*, the gunmen stop closing
   and hold a firing line. The blade is the hammer; walking into their own
   knife-man's lane is how a group shoots itself.
2. **THE MARKSMAN'S LANE.** While a living spotter can see you, the rest hold
   back and let him work. Put him down and the whole room comes forward.

## MEASURED: THREE IDENTICAL GUNMEN, SIX DIFFERENT ROOMS

Same three goons, same opening ring at 11 tiles, same ten turns, averaged across
12 arenas. **The only thing that changes is who else is in the room.**

| the group | the gun line ends at |
|---|---|
| three guns, alone | **4.9** |
| ...plus a shiv **closing** | **8.7** |
| ...plus the same shiv parked **far off** | 5.0 |
| ...plus a **live** spotter | **9.9** |
| ...plus a **dead** spotter | 4.9 |
| ...plus a fourth plain goon | 5.5 |

**And the control, the same harness on the build without v171:**

| the group | ends at |
|---|---|
| alone | 4.71 |
| + shiv closing | **4.71** (identical to alone) |
| + shiv far | 6.06 |
| + live spotter | **6.06** (identical to the far-off shiv) |

Before this, the only thing any enemy read about another was **that a cell was
taken**. A live marksman and a shiv fourteen tiles away produced the same number,
because the only difference the code could see was body count.

**Three things the numbers say that matter:**

- **A blade has to be swinging, not merely present.** Closing 8.7 against far-off
  5.0, and far-off is where they stand with nobody beside them at all. A rule
  that fired on the mere existence of a blade would be a blanket buff wearing a
  synergy costume.
- **Killing the marksman brings the room forward ~5 tiles.** V168 made him worth
  crossing the room for because he takes your legs; now ignoring him also holds
  the entire gun line off you. One priority target, two consequences.
- **It is what they are, not how many there are.** A fourth plain goon moves the
  line 0.6 tiles (crowding: he takes a movement slot and a cell). Changing *who*
  is beside them moves it 3.8 to 5.0 tiles.

## A THIRD RULE WAS WRITTEN, MEASURED, AND CUT

*"A man does not give up stone for open ground unless a friendly has a bead on
you."* Written, wired, and measured over 20 arenas: **30 cover-leaving steps with
it, 29 to 31 without, in every arm.**

It was not mis-gated. The condition it reads is live — somebody holds a bead on
**12.2%** of real turns, so the rule was armed on the other 88%. It simply never
changed a decision, because the standoff rules above already decide where these
men stand.

**A dead dial is worse than no dial** (V168, where the first version of the
spotter measured 22.5% against a 20.8% control and was cut rather than shipped as
flavour). Shipping an unmeasurable rule inside a measured feature is how the
measured parts stop being believed.

## AND THE DIALS HAD TO BE MEASURED INTO PLACE

The first cut set the anvil at 5.0 tiles and the lane at 6.5. **Both changed
nothing**, because a lone goon already settles at 6.0 — his gun's effective range
— and neither number sits outside a distance he never crosses. Three arms, one
behaviour. Second time V168's lesson has had to be learned by playing it rather
than reading it.

## MUTATION-TESTED SIX WAYS, AND IT FOUND A REAL HOLE

| mutation | caught |
|---|---|
| the anvil never fires | shape + browser |
| the lane never fires | shape + browser |
| a blade counts merely by existing | shape + browser |
| the dials go back to their dead values | shape + browser |
| dead men count as company | shape only, **at first** |
| a blind marksman still holds the room | shape only, **at first** |

The last two survived the browser because **the two guards were covering for each
other**: deleting the dead-filter changed nothing since `seesMe` also rejects a
corpse, and deleting the `seesMe` test changed nothing since the dead-filter also
rejects one. Both guards are real — `seesMe` additionally covers cover, darkness
and smoke — so the fix was two arms that put exactly one guard under load each:

- **a dead shiv lying at 5 tiles** must not make an anvil (it does not: 5.06
  against a live one's 8.7)
- **V170's smoke hung on the marksman's line** must lift his hold while he stands
  there alive (it does: 9.9 down to 5.0)

That second one is worth saying plainly: **smoke lifts the group's hold, and
neither feature knows the other exists.** The read asks `seesMe`, so cover,
darkness and V170's screen were wired into it the day it was written. Second time
machine 4 has paid for a feature it predates.

## GATES

- `gates/fight_moves_you_gate.js` — **47 pass / 0 fail** (7 new V171 claims, all
  measured in a real browser, each arm averaged over 12 arenas because a single
  arena swings 1.35 tiles on parity and two claims failed on the very next run)
- `gates/combat_lab_gate.js` — **876 pass / 1 fail** (6 new V171 shape claims; the
  one fail is a MUSIC-lane claim already red on clean main)
- `gates/top_of_the_document_gate.js` — **8 pass / 0 fail**. Its T6 was written
  yesterday as *"RF4-25 is still unbuilt, and when it is built this check goes red
  and gets rewritten rather than quietly becoming false."* **It went red on this
  commit**, which is the check working, and it has been rewritten to hold the new
  truth plus two successors: the starred ledger must have actually moved, and the
  thesis row must not be declared finished.

**RF4-14 and RF4-25 both move SPECED → BUILT.** The starred ledger goes from
**2 of 10** built to **4 of 10**.

## WHAT THIS LEAVES

The two remaining ★★★ rows are **RF4-36**, the thesis (*"the most important line
in any of this"*: tactical depth and boomer-shooter mayhem held in deliberate
tension), and **RF4-49**, the free-movement budget — which our own handoff has
called BUILT since V163 while the spec's status cell still says SPECED. That
contradiction between two live files is a bug, and resolving it is the STATUS-column
split the coordinator routed here: the column uses BUILT for both *"the substrate
exists"* and *"the machine exists"*.
