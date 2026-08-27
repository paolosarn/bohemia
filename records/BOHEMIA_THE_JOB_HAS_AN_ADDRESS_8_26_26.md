# THE MAN THE QUEST WAS ABOUT WAS TWO KILOMETRES AWAY AND NOTHING SAID SO
# (8/26/26, PEOPLE lane. Dispatch item 2, the PLACE half, and it took two wrong
#  answers to get to the right one.)

## THE MEASUREMENT THAT STARTED IT

Counted on the walked city, outward from the block the player actually wakes up
on. A block is **384 m**.

| | |
|---|---|
| people within 3 blocks | 23 |
| **of those, running with any outfit** | **ZERO** |
| nearest TRADES | 5 blocks (~1.9 km) |
| nearest NETWORK | 6 blocks (~2.3 km) |
| of 115 people out to 6 blocks | 6 affiliated (5.2%) |

Day one's quest demands `faction=TRADES` for its one REQUIRED role. **So the
person that quest is about stood a two-kilometre walk from the front door, in an
unnamed direction, and nothing anywhere on screen said so.**

That is Paolo's dispatch item 2 as a number: *"THE QUESTS ARE SO BAD AND NOT
WIRED TO ANY LOCATIONS OR PEOPLE IN THE CITY."*

## AND YESTERDAY'S FIX MADE IT WORSE WITHOUT EVER LOOKING WRONG

The first cut of casting ran against **whatever block you were standing on**. So
"the fixer" was a different person on every block, and the row said so honestly:
*"On this block, that is them."* The sentence was true. The thing it described
was not a story.

**A QUEST WHOSE CAST CHANGES WHEN YOU CROSS THE STREET IS NOT A QUEST, IT IS A
MOOD.** Nothing was red. The row read fine. It took walking the numbers to see
it.

## AND THE FIRST FIX WAS WRONG TOO, AND THE VALLEY SAID SO OUT LOUD

The obvious repair is one address per quest: ring outward, take the nearest block
that can fill every REQUIRED role. Built it, then measured all five demo days the
same minute:

| day | quest | required | result |
|---|---|---|---|
| 1 | the meter reader | `lineman=TRADES` | cast, 5 blocks out |
| 2 | the back door | `neighbor` (no outfit) | cast, right here |
| 3 | the same crate twice | `REDS` + `BLUES` | **nothing** |
| 4 | the cold room | `VOLUNTEERS` + `TRADES` + `NETWORK` | **nothing** |
| 5 | the pressure goes backward | `VOLUNTEERS` + `TRADES` + `BLUES` | **nothing** |

**Three of the five demo days could not be cast at all, and the world was right.**
**THREE OUTFITS NEVER SHARE A BLOCK. THAT IS WHAT HOLDING TERRITORY MEANS.**

A quest that demands three of them is not a quest with an address. It is a quest
that spans the city. So:

> **A QUEST DOES NOT HAVE AN ADDRESS. IT HAS ONE PER ROLE, AND GOING FROM ONE TO
> THE OTHER IS THE JOB.**

Which is also just what the corpus already does. The dying woman of S07 is in the
church; the man who wronged her is somewhere else entirely. Two addresses. The
walk between them is the quest.

## AND EACH PART IS LOOKED FOR WHERE ITS PEOPLE ACTUALLY ARE

| | |
|---|---|
| outfits with a real member within 2 blocks of their own base | **11 of 14** |
| outfits holding empty ground | ANARCHISTS, BLUES, CUSTOM |

So a role is looked for on **its own outfit's ground**, and a role with no outfit
is looked for where the player is, because a neighbour is a neighbour.

Mutation M24 turns that decision into a measurement: make every role search from
the player instead and **12 claims go red**, with day 1 at 0/1, day 3 at 0/2, day
4 at 0/3 and day 5 at 0/3. Searching from the player finds nobody, because
affiliation clusters on faction ground. That is not a preference, it is the
valley's own arithmetic.

## WHAT IT DOES NOW

```
day 1, standing at the front door:

  Find why the block browns out · get inside somewhere the power is out
                                · 6 blocks south west, out by the houses

three blocks out   ->  3 blocks north west, out by the houses
two blocks out     ->  2 blocks north west, out by the houses
one block out      ->  a block north west, out by the houses
standing on it     ->  right here, by the houses
```

And the quest's two parts are in two places: the **lineman** on TRADES ground at
block [8,18], the **fixer** on NETWORK ground at [5,13]. Walk to the lineman and
his card says *"The Meter Reader wants the lineman. That is them."* -- the hedge
is gone, because the cast no longer moves. **1 of 81 blocks casts anybody.**

## WORDS, NOT AN ARROW, AND THAT IS RESEARCHED

Morrowind put its directions in dialogue and no marker on the map, and the thing
players remember about it is the valley itself: *"the world becomes unforgettable
because the player travels across it of their own accord instead of mindlessly
chasing a marker."* The marker games trade that memory for the convenience, and
the writing shortens to match -- *"once developers know players can rely on
markers, directions become shorter and environmental clues become less
important."* The other half of the same research names the risk honestly: with no
direction at all, a world this size is frustrating.

So we take the half that fits and refuse the half that does not: **a bearing, a
rough distance, and what the ground is called.** Bohemia is a city whose phones do
not work. A compass that always knows where everybody is would be the strangest
object in it.

The ground words are a real attempt and his to retype: `industrial` says **the
workshops**, `wash` says **the wash**, `suburb` says **the houses**, `arterial`
says **the big road**. A district type nobody has written a phrase for still gives
the direction rather than going silent.

## MUTATIONS

| break | result |
|---|---|
| **M24** every role searched from the player, not its own ground | **12 red** |
| **M25** the cast not confined to its block | **1 red**, `81 of 81 blocks cast` |
| **M26** the address not appended to the objective line | **2 red** |
| **M27** the countdown hook removed | **1 red**, `6 blocks ... 6 blocks ... 6 blocks` while standing on the man |
| **M28** the cast not saved | **1 red** |

## AND A GATE I HAD TO REWRITE THE SAME WEEK I WROTE IT

`casting_gate` demanded `castBlocks > 5`. That was the right claim for a cast
computed against the block under your feet: many blocks casting meant the caster
was alive. With one part on one block it became **a gate demanding the bug back**,
and it went red on the fix.

**A GATE MUST NEVER OUTRANK A RULING. FIX THE RULER, NEVER THE TARGET.** The
replacement is strictly stronger: not "several", **exactly one**, out of every
populated block in the valley. It still catches a caster that stops working
(that reads zero) and now also catches one that starts working everywhere again.

## WHAT IT SAYS OUT LOUD RATHER THAN PAPERING OVER

Two demo days still cannot fill every required part:

```
day 3  red_boss=REDS, blue_boss=BLUES        1 of 2
day 5  nurse=VOLUNTEERS, fitter=TRADES, pumper=BLUES   2 of 3
```

Both hit the same wall: **BLUES holds ground with nobody on it.** Its base sits on
the valley's north edge, where 81 blocks hold 8 people. That is a world fact and
it belongs to the lanes that own the world and the outfits. Handing those parts to
a stranger who happens to be nearby would be exactly the fake this whole system
refuses.

## THE MACHINE

| file | what |
|---|---|
| `engine/bohemia_people.js` | `castAddresses`, `bearingOf`, `addressLine` |
| `tools/bohemia_city_address_patch.py` | the day cast, the HUD line, the countdown, the save |
| `gates/address_gate.js` | 33 claims, registered as ADDRESS |
| `gates/casting_gate.js` | the rewritten claim |
