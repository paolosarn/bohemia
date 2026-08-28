# V194 — RF4-14 MEASURED AT LAST, AND A THIRD OF EVERY FIGHT WAS A DEAD TURN
# (COMBAT lane, 8/27/26)

> "we are trying to create the best funnest **deepest** videogame ever" — Paolo, 8/27

**RF4-14 is the row the teardown itself calls "the single most important line in
RF4's design notes", and its own status cell has read, for weeks:**

> **"NOT MEASURED, and it is the right question to ask of our fight. This is the
> test for whether a fight is dense or flat."**

Wang's rule, verbatim: *"there is almost never a turn in which the player is not
either **using an ability** or **moving into position** to use an ability in the
next turn or two."*

That is the depth test, written down, never run. So it was run.

---

## THE ANSWER: 594 REAL TURNS, 30 FIGHTS, THROUGH THE SHIPPED VERBS

| | |
|---|---|
| turns with an ability up | 55.7% |
| turns with ground worth taking | 17.8% |
| **turns with EITHER** | **64.0%** |
| **turns with NEITHER** | **36.0%** |
| turns where you could simply shoot | 96.1% |
| turns that were shoot-or-walk and nothing else | 20.2% |

**A third of every fight was a turn with nothing to decide.** RF4 says *almost
never*.

## AND THE CADENCE TABLE WAS WORSE THAN THE AVERAGE

Turns-to-charge per ability, computed from the **real firing rate of each
ability's own verb** in real play:

| | | | |
|---|---|---|---|
| READ THE ROOM | **3.7** | PLATE UP | 7.7 |
| SEND HIM | 4.2 | STEADY | 8.5 |
| LIGHT IT | 4.6 | PATCH IT | 8.9 |
| | | CALL IT | 9.6 |
| SLIP | 18.3 | **BREAK CONTACT** | **23.1** |

**A 6.2x spread, and the slowest ability needed more turns than a fight has.**

**BREAK CONTACT WAS NOT RARE. IT WAS NOT IN THE GAME.** That is the sixth thing
this month that shipped, worked and could not be reached — and the **first one no
structural check could ever have caught**, because the defect was in the
**economy** and not the wiring. Its verb had a caller. Its own gate arm was green
(V185 wrote that arm precisely because the first cut left `move2` with no caller
at all). The button simply never came up.

SLIP's 18.3 is left alone on purpose: its verb is a **kill**, and being handed
something the moment you put a man down is the design, not a defect.

---

## AND THE BEST IDEA IN THE KIT HAD ALWAYS BEEN INVISIBLE

V185's whole design is *"RECHARGE CONDITIONS ARE VERBS, NOT TIMERS — the kit tells
you how the game wants to be played."*

**The player has never been able to see it.** `updKit` drew a button only once an
ability was **already READY**, so the condition, the counter and the progress were
a private conversation between the engine and itself from the day it shipped.

**You cannot play toward something you cannot see.** That is what turned 36% of
turns into a shrug instead of a choice — and it is the same shape as everything
else found this week: the depth was already there and the screen would not say so.

### WHAT SHIPS

- **An ability that has started charging is on the row**, dim, with its count and
  the thing it wants in plain words: `BREAK CONTACT 1/1 · cover ground`.
- **One that has not started is still absent.** The row is empty at the bell and
  fills as the fight develops. Nine buttons at the bell is the furniture he has
  asked **five separate times** to have taken off this screen.
- **Pressing a cold one says what it needs** instead of ignoring the tap. The demo
  gap list names that as the sharp one, in these words: *"a refusal with no sound
  is indistinguishable from a broken button."*
- **BREAK CONTACT's threshold is 3 → 1**, and the number is **measured, not
  picked**: its verb's real firing rate times the cadence the rest of the kit
  already runs at.

---

## THE RESULT, AS A CONTROLLED EXPERIMENT

Alone, this metric swung **66.8, 67.5 and 70.4** across three runs of *identical
code* — a fight's whole character sets all of its turns and 45 fights is not many
fights. **Loosening a threshold until the swing fits underneath it is the
flattering-shaped check this session has already caught itself writing three
times.** So the before and after are measured in the **same run, on the same 45
boards, with one number different.**

| same 45 boards | before | after |
|---|---|---|
| a turn with an ability or ground | 66.0% | **70.4%** |
| shoot-or-walk and nothing else | 18.3% | **15.6%** |
| no real choice at all | 2.0% | **1.0%** |
| BREAK CONTACT, turns to charge | 22.6 | **8.7** |
| BREAK CONTACT, turns it was ready | 26 | **100** |

Stable across three runs: the after beat the before every time, and BREAK CONTACT
went from ~20 ready-turns to ~95.

**AND WE ARE STILL NOT AT RF4'S "ALMOST NEVER."** Roughly a quarter of turns is
still shoot-or-shrug. That is stated rather than rounded away, and it is the next
thing worth attacking. The measuring player also **spends an ability the instant
it is ready**, which is the worst case for the question being asked, so both
numbers are floors.

---

## TWO THINGS I GOT WRONG AND CAUGHT

1. **THE FIRST PROBE REPORTED THAT TWO ABILITIES NEVER CHARGED IN 591 TURNS.** It
   moved with `worldShift` and hurt with `applyDamage`, so `spendMove` and the gun
   were never touched. **A harness that skips the shipped verb cannot measure the
   shipped verb** — that was a fact about the probe, not about the game, and it
   would have been reported as a defect.
2. **I EDITED A COLUMN THAT IS NOT MINE.** RF4-14's status cell is stale and I
   updated the teardown's BOHEMIA TODAY column to say so. `rf4_teardown_gate`'s G3
   went red: COMBAT may move the **STATUS** column beside a slice change and
   nothing else, because the other columns are LAB's. **The gate was right and I
   was wrong.** Reverted, back to its pre-existing 90/4.
   **[FLAGGED TO LAB]** RF4-14's status cell still reads "NOT MEASURED". It has
   been measured; the numbers are in this file.

## GATES AT CLOSE

| gate | |
|---|---|
| `fight_moves_you_gate.js` | **140 pass / 0 fail** (was 136/0), three runs, stable |
| `combat_lab_gate.js` | **931 pass / 1 fail** (the one red is another session's fight-music ladder) |
| `rf4_teardown_gate.js` | 90 / 4 — all four pre-existing, unchanged by this turn |
| page errors | **0** |

## WHAT COMES AFTER

**A quarter of turns is still shoot-or-shrug, and the number that explains it is
this: you can simply shoot on 96% of turns.** The gun is always available and
almost always safe, so it is the default that always works. That is the next
depth question, and the teardown already names the answer shape — RF4-23 and
RF4-37: *a target worth crossing the room for*, and a reason to **ignore** the
nearest man. Both are still marked PARTIAL, and both are combat's.
