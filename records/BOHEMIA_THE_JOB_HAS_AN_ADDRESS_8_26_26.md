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

## AND THE CLAIM THAT PROVES THE DESIGN FOUND A STUCK QUEST

The claim worth writing was the one that says *going from one to the other is the
job*: finish with the first person and the address has to move to the second. It
went red the first time it ran, and the reason was a real bug:

```
lineman (right here, by the houses)  ->  lineman (right here, by the houses)
```

**The lineman's conversation never ended.** The runtime reports `ended` only when
a chosen option runs out of graph. **A node with no options at all is never
chosen from, so it never reports anything** -- `choose(0)` on it returns the same
view forever. The lineman's scene finishes on exactly such a node:

> *"Splits somewhere past the dead storefronts. Warm cable. You'll feel it before
> you see it."*

So the scene stayed open for the rest of the game, the entry node was never
locked, and the quest's address never moved on. **Measured: 21 of the corpus's
236 talk nodes are terminal like that.** None of them pays anything today, so it
was not a farm yet -- it was a farm the day somebody writes one, and it was a
visibly stuck quest already.

**A NODE WITH NOWHERE TO GO IS THE END OF THE CONVERSATION.** `atEnd()` says so
once, in the module, and both ways a scene can finish now run through one
`ctConvFinish()` so they cannot drift apart.

And the fix had a trap of its own worth naming: closing on `atEnd` inside the
choice handler would have locked the scene **before that line was ever drawn**,
which is deleting a line the author wrote. A real node is always rendered; the
graph running out of nodes entirely is what closes on its own, and the end button
closes the rest.

With it, on the real surface:

```
lineman (right here, by the houses)  ->  fixer (5 blocks north west, out by the big road)
```

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

## AND THE WHOLE CONVERSATION FEATURE WAS GONE FROM MAIN WHEN I REBASED

Rebasing onto main, the resync tool read **96 embedded modules where there had
been 97**. `engine/bohemia_conversation.js` had been cut out of the walked city:
one commit took 114 lines out of that file and **103 of them were this module's
inlined body**, while every call site stayed exactly where it was.

So `BohemiaConversation` was called three times and defined nowhere. Every call
threw. `ctConvNode`'s bare catch turned every throw into `null`. And null is the
honest answer for almost everybody in the valley, so **the symptom was people
having nothing to say** -- nothing on screen, nothing in the console, and the
feature simply absent. `conversation_gate` went **24 passed, 12 failed**. The
gate caught it. The file did not.

**AND THE STRUCTURAL CAUSE IS MINE, NOT THEIRS.** I parked the module immediately
above another module's banner *on purpose*, that same morning, because the resync
tool finds where a module ENDS by scanning for the next `/* ==== engine/` banner
and a module parked above ordinary code has no end (measured then: a 50,917 byte
cut against a 5,002 byte module, which the tool correctly refused to write). That
placement made the resync safe and made this module **the thing that gets
swallowed when any tool cuts the module below it.**

> **A PLACEMENT THAT MADE ONE TOOL SAFE MADE ANOTHER TOOL DANGEROUS.**

Three fixes, all of them structural rather than a re-paste:

1. **The module delimits itself.** The same banner opens and closes it, so a
   boundary scan ends at the right byte wherever it is parked. The resync dedupes
   by path, so a repeated banner cannot read as a second module.
2. **The patch tool repairs instead of no-opping.** It checked its own marker and
   said "already applied" over a city with the module missing. It now checks the
   module's OWN evidence -- its banner -- and puts it back. Proved: cut the 5,119
   bytes out again, re-run, and the file comes back **byte-identical**.
3. **A missing module says so.** `ctConvNode` warns once, by name, with the
   command to fix it. Same shape as `ctFactionOf`'s guard, which exists because a
   swallowed `TypeError` there cost that lane thirteen days.
   **NULL IS A REAL ANSWER HERE, WHICH IS PRECISELY WHY IT MAY NEVER ALSO BE THE
   ERROR ANSWER.**

The words that commit shipped are good and every one of them is kept. This is
about where a file sits, not about what anybody wrote.

## AND A FUNCTION WHOSE JOB WAS ABSORBED IS AN ORPHAN, NOT A SPARE

`organ_reach_gate` went red on **`BohemiaPeople.castQuest`**: nothing on the
walked surface called it any more. It had cast every role against ONE roster,
which was the right shape while a cast meant *"who is on the block under your
feet"* and the wrong shape the moment a quest got an address per role.

Keeping it would have meant the REQ-FIRST ordering and the ONE-PERSON-ONE-PART
dedupe written down **in two places**, which is the bug this lane has now paid
for four times in a week. So it is deleted, and every claim written against it
still runs -- pointed at `castAddresses` with a **one-block world**, so the
hard-won ones (a block of ONE person proves the dedupe; one body proves REQ beats
OPT) now exercise the code the game actually runs instead of a parallel copy.

`organ_reach` 7/1 -> 8/0, with no exemption added. An exemption would have been a
shrug.

## AND THE FRONT SPLASH HAD A MERGE MARKER ON IT, LIVE

`blob_integrity_gate` reported *"the alpha shell carries no merge markers"* red.
On `origin/main`, one line below the build stamp, sat a bare **"theirs" conflict
marker** naming commit `7333cce` ("0 FOR 8. I CHOSE FOUR VOICES FROM A GAP
LIST..."). It is described here rather than reproduced, and that is not squeamish:
`nomarkers_gate` sweeps 3,105 tracked text files for a marker at the start of a
line, and **the first draft of this very record went red on its own evidence.**
A marker quoted is indistinguishable from a marker left behind, and a sweep that
tried to tell them apart would be the weaker sweep.

A conflict resolution had eaten the `<!--` that opened the comment underneath it,
so **that marker and the whole comment after it were rendering as visible text on
the front splash of the one link Paolo taps.** Not my commit -- my own push four
hours earlier had zero markers -- and not my lane, but it is the front door, and
the comment it broke is the one that says, in the file:

> *"Twice on 8/2 a lane updating the build stamp above ate it... Both times it
> reached main. gates/front_door_gate.js is the alarm; this is what stops it
> ringing."*

**It happened a third time.** One line restored, BLOB INTEGRITY 106/1 -> 107/0.

## THE MACHINE

| file | what |
|---|---|
| `engine/bohemia_people.js` | `castAddresses`, `bearingOf`, `addressLine` |
| `tools/bohemia_city_address_patch.py` | the day cast, the HUD line, the countdown, the save |
| `gates/address_gate.js` | 33 claims, registered as ADDRESS |
| `gates/casting_gate.js` | the rewritten claim |
