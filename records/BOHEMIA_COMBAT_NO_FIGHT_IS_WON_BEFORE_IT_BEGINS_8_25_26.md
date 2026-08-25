# RF4-29 — NO FIGHT IS WON BEFORE IT BEGINS
### COMBAT lane, 8/25/26. A row whose own column said NOT MEASURED, finally measured.

---

## THE ROW

> **"No fights won before they begin.** You should not delete an unaware group
> with one opener; fights run *a bit longer* so advanced tactics can play out,
> while staying snappy."

Our column, written in the teardown and never revisited:

> **"NOT MEASURED.** The 6/30 doc says Bohemia deliberately inverts this (a
> perfect chain clearing in one turn as a master-player reward). Whether the
> *median* fight collapses instantly is a real risk that doc itself names, and
> **I did not measure it.** Flagged, not guessed."

**It could not be measured until today.** Until V178, nothing in this repo had
ever fired the gun — every combat gate reached the fight through `applyDamage`,
which skips `fireNow` entirely. There was no way to ask what a player who can
actually *play* does to a fight. The steady hand built this morning to repair
V178's flaky arm is the instrument this row needed.

---

## THE ANSWER

**A perfect opener hurts, and it does not win.** Eight arenas, real ENGAGE and
FIRE buttons, dial hit on target every time:

| | |
|---|---|
| arenas played | 8, averaging 4.3 men |
| openers that **landed** | **7 of 8**, taking **427 hp** off the room |
| bodies dropped by the opener | 2 |
| **openers that ended the fight** | **0** |

And over full fights played to completion:

| | fights cleared | player survived | median turns |
|---|---|---|---|
| **perfect dial** | **7 of 10** | 8 of 10 | **20** (range 14–26) |
| **random timing** | **2 of 10** | **2 of 10** | — |

**Across all 20 fights measured, not one was over inside two turns, and not one
opener deleted a group.** RF4-29 holds.

---

## AND IT CONTRADICTS OUR OWN 6/30 DOC, WHICH IS THE MORE USEFUL HALF

That doc claims Bohemia deliberately **inverts** this row: a perfect chain
clearing a room in one turn, offered as the master-player reward. **With the dial
hit perfectly every single time, that never happened once.** Not in eight openers,
not in ten full fights.

So the inversion is not in the game. Either it needs tactics this player does not
have — suppression, grenades, the finisher, target priority, cover — or it is
aspiration that was written down as if it were behaviour. Naming that is worth
more than either claiming RF4-29 as BUILT-by-accident or leaving the row blank.

**The honest status is BUILT on the row as written, with the inversion recorded as
not present.**

---

## THE HARNESS WAS WRONG TWICE, AND BOTH TIMES IT LOOKED FINE

**FIRST: IT MEASURED A MAN STANDING STILL.** The first version pressed FIRE every
turn and never moved. It reported a *perfect* player taking 24+ turns and dropping
almost nobody — which flatly contradicted V178's own measurement of three men
falling in eleven shots. One shipped guard explains all of it: `doPop` **refuses
outright** when nothing is in reach (V141, *"you cannot shoot what your gun cannot
reach"*) and says GO AND GET THEM. A player who never closes never fires a round.

*A result that disagrees with a number you already have is a bug until proven
otherwise.* That is the only reason it was caught.

**SECOND: "THE OPENER KILLED NOBODY" WAS MOSTLY "THERE WAS NO OPENER."** The first
gate arm asserted only that the opening shot killed nobody, and it passed. Adding
one column — did the round actually go into somebody — showed **6 of 8 openers had
fired nothing at all**. The arm was reporting the absence of a shot as a design
property, and it was green while doing it.

The fix is a retry until the round goes off, which is not stacking the deck: the
claim is that a **landed** perfect opener does not delete the group, so the shot
has to happen before there is anything to measure. Landed openers went 2 → 7 of 8.

**Both failures are the same failure the V180 work hit three times this morning:
an arm nobody controlled, returning a confident number about nothing.**

---

## THE CONTROL IS WHAT MAKES THE RESULT WORTH ANYTHING

A weak opener is also exactly what a broken harness returns. So the same loop was
run with the dial pressed at a **random** moment instead of on target:

- **perfect:** 7 boards cleared of 10, player died twice
- **random:** 2 boards cleared of 10, **player died eight times**

The trigger is doing enormous work. That gap is what proves the perfect arm really
is perfect — and therefore that the weak opener is a property of the fight rather
than of a bot that cannot shoot.

---

## ONE LIMIT, STATED UP FRONT

This player is **perfect at the dial and stupid at everything else.** It walks at
the nearest man and shoots. It never suppresses, never throws, never uses cover
deliberately, never spends the finisher, never picks a priority target. So this is
the **trigger ceiling, not the tactical ceiling**, and the 20-turn median should be
read as an upper bound on length for a player with good hands and no plan.

---

## THE GATE

`fight_moves_you_gate.js`, **91 pass / 0 fail** (was 89), two new arms.

**It plays only turn one, deliberately.** A full-fight version of this measurement
takes ten minutes, and the suite is already over its own budget by 1758s with 72
gates that never ran. The claim is about the opener, so the gate runs the opener:
eight arenas, one landed shot each, about forty seconds.

---

## WHERE HE FINDS IT

**COMBAT tab.** Nothing new to look at — this is a measurement of what is already
there, not a build. Nothing in the game changed.

**RF4-29 moves SPECED -> BUILT.**
