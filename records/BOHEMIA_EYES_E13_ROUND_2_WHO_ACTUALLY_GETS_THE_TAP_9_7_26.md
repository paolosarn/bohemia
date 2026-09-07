# EYES AND EARS -- E13 [half size check] -- ROUND TWO OF TWO: THE CHECK
## WHO ACTUALLY GETS THE TAP
### 9/7/26 -- session eyes-5vql33 -- measured on the shipped alpha, at iPhone size

School: `records/BOHEMIA_EYES_E13_ROUND_1_SCHOOL_DRAWN_IS_NOT_TOUCHED_9_6_26.md`
Machine: `tools/bohemia_eyes_thumbs.js`
Data: `records/BOHEMIA_EYES_THUMBS_9_7_26.json`

---

## THE TWO ANSWERS

**Did it halve?** For the buttons, yes, almost exactly. Six of eight pressable controls come
out at **x0.47 to x0.50 in both width and height**. The labels do not halve (x0.56 to x0.84),
one control gets **wider** (musbtn, x1.21), and the median across everything measured is x0.56.

**Is every touch target still 44 px?** No, and it was not before either. With the halving
**off**, which is what ships today, **zero of fourteen** controls clear 44. Ten clear 24. With
it **on**, two clear 44 -- and those two are the ones causing the damage.

---

## WHICH FINDING FROM ROUND ONE CHANGED HOW I MEASURED

The MODE requires this, and it changed the whole instrument.

**School: drawn size is not touch size, so the check has to hit-test.** That was right and it
was only half. The shipped file itself says the thing that completed it:

> "a real driven tap landed 2 of 11 while an in-page hit test insisted on 12 of 12"
> "three harnesses disagreed with each other"

An in-page hit test and a real tap are different measurements, and when they disagree the real
tap is the one the player performs. So this measures **three** things per control: the painted
box, the hit-tested reach, and **a real driven tap plus the name of whatever actually received
it**. That third column is what nobody had, and it is the column that names the bug.

---

## THE NUMBERS

**HALVING OFF -- what ships today**

| control | paint | reach | clears | tap lands |
|---|---|---|---|---|
| musbtn | 79.5x30 | 80x30 | 24 | yes |
| savebtn | 37.5x30 | 38x30 | 24 | yes |
| phonebtn | 79.5x30 | 80x30 | 24 | yes |
| outfitbtn | 80x30 | 81x30 | 24 | yes |
| rungbtn | 100x31.4 | 101x31 | 24 | yes |
| buildbtn | 115.2x31.4 | 116x32 | 24 | yes |
| modechip | 62.4x30 | 63x30 | 24 | yes |
| fitbtn | 103x32 | 104x32 | 24 | yes |
| sleepbtn | 81.6x31.4 | 81x31 | 24 | yes |
| note | 186x40 | 186x40 | 24 | yes |
| hud | 378x23.4 | 241x23 | neither | no |
| hmode / hclock / hslot | ~15 tall | ~16 tall | neither | yes |

**0 clear 44. 10 clear 24. The tap lands on 13 of 14.**

**HALVING ON**

**2 clear 44. 0 clear 24 only. 12 clear neither. The tap lands on 7 of 14.**

---

## THE FINDING: THE REACH SPILLS ONTO THE NEIGHBOURS, AND HERE IS EXACTLY WHO TAKES WHOSE TAP

The shipped file says the presses do not land and calls it next round's job. This is the
mechanism, measured.

With the halving on, two controls have a reach far larger than anything they were given:

| control | painted | its reach | expansion |
|---|---|---|---|
| **savebtn** | 18.8 x 15 | **236 x 54** | ~108 px of reach on each side of an 18.8 px button |
| **fitbtn** | 51.5 x 15 | **147 x 48** | ~48 px on each side of a 51.5 px button |

Those two reach boxes lie on top of five neighbours, and the driven tap says so by name:

```
musbtn      tap taken instead by: savebtn
phonebtn    tap taken instead by: savebtn
outfitbtn   tap taken instead by: savebtn
modechip    tap taken instead by: fitbtn
note        tap taken instead by: fitbtn
```

**Five controls that work today stop working when the halving is turned on**, and every one of
them is stolen by savebtn or fitbtn. That is why "the phone opens without the halving and does
nothing with it": `phonebtn`'s tap is going to `savebtn`.

It also explains the three disagreeing harnesses. An in-page hit test asks "is this control at
this point", and the answer for savebtn is a confident yes across a 236 px band, so a hit test
scores 12 of 12 while a finger scores 2 of 11. **Both measurements were correct. They were
answering different questions.**

---

## SCHOOL'S COUNTER-FINDING, RESOLVED, AND NOT THE WAY IT EXPECTED

Round one argued that "did it halve" might be unanswerable: half of *what*, if no file holds
the before, and that would be E11's disease again.

It is answerable, for a reason school did not predict. **The halving ships as a switch that is
off** (`BOHEMIA_HALF`, default suspended). So both states are measured in one run, on the same
screen, seconds apart, and the ratio is exact rather than inferred. **A live toggle is a better
"before" than a recorded number, because it cannot drift.** That is worth keeping as a pattern:
when a lane ships a change behind a switch, the checker gets its baseline for free.

---

## THE INSTRUMENT WAS WRONG FOUR TIMES, AND THE FOURTH IS THE ONE WORTH REMEMBERING

1. **`MEASURE` was a template string.** Playwright evaluates a string as an expression and hands
   back its value, so a string holding an arrow function came back as `undefined`. The tool
   refused to report because it could not see a control it had planted itself, which is the
   behaviour I wanted, but the fault was mine.
2. **The day card was up.** The first run reported that 11 of 14 controls clear no bar and 8 take
   no tap -- a game with unpressable buttons. False: `#daycard` (z 40, 378x773) was covering the
   whole screen. A modal blocking what is under it is correct behaviour. The sweep now refuses to
   measure while anything covers the screen, and clears it **by tapping the scrim the way the
   game says it is cleared**, never by calling the game's own hide function.
3. **The recorder only listened inside the frame.** Six controls reported "NOBODY" received the
   tap, which says nothing about who is at fault. The shell the frame sits in can take a tap too,
   so it records as well now.
4. **The sweep's own taps changed the screen it was measuring.** Tapping the controls in order
   meant tapping `phonebtn`, which **opens the phone panel**, and every control after that was
   measured underneath an open phone -- `#phoneslot` sitting on top of six of them. Six more
   false "unpressable". The screen is now put back between every single control, so each
   measurement is independent of the last.

Bug 4 is the general lesson and it is not specific to this job: **a sweep that interacts is a
sweep that changes its own subject.** Any future instrument in this lane that taps, drags or
types has to reset between subjects or it is measuring its own wake.

---

## RULE ZERO

The trap school named was that a broken hit-test silently degrades into the old wrong check by
returning the drawn box every time, and looks completely plausible. Three controls are planted
before any number is believed, and all three passed on every run:

```
PASS  a planted control with an expanded reach measures BIGGER than its paint   (10x10 -> 50x50)
PASS  a planted control with no expansion measures the SAME as its paint        (10x10 -> 10x10)
PASS  a real driven tap reaches the page at all
```

---

## ON THE PREDICTION FROM SCHOOL ABOUT `phone_readable_gate.js`

Round one predicted that our one 44 px checker, which measures `getBoundingClientRect()`, would
go red on correct work once controls were drawn at half with expanded reach. **Measured, that is
not yet true, and I am not routing it.** That gate checks two named controls (`settext`,
`setmotion`) on one screen of the demo, and it never looks at the run's controls at all. So it
cannot fire on this work either way.

What round one got right is the part that mattered: **there was no general touch-target check
anywhere in this repo, so nothing could answer the word "every".** Now something can.

---

## ROUTED

One `[eyes: reach spills]` line into UI's `[half size]` row, which is the single bounce-back this
lane may write. It carries the two reach measurements and the five names, because the row's own
note says the presses not landing is next round's job and this is the mechanism.

Not routed, said here instead: with the halving **off**, **no control on the walked surface
clears the 44 bar** -- the tallest is 32. That is a fact about the build before the order, not a
defect the order created, and what to do about it is UI's and DIRECTION's, not mine.

---

## BLIND SPOTS, DECLARED RATHER THAN COUNTED CLEAN

- One viewport (390x844) and one device pixel ratio. That is not every phone.
- Controls appear and disappear with the game's own state: `mktbtn`, `bikebtn`, `modeLbl` and
  `cttalk` measured zero size in this walk, and `buildbtn` and `bikebtn` were present in the
  off pass and gone in the on pass. A control missing from a run is not a control that does not
  exist.
- The AA bar is 24 px **or** a spacing offset. This measured size only, which is the stricter
  half of that rule, so a "clears 24" here is honest and a "clears neither" might still pass AA
  on spacing. Spacing is not measured yet.
- This measures geometry and event delivery. It never says whether anything is legible.
- The halving was turned on by this tool for the measurement and turned off again. It is off in
  the shipped build and this round did not change that.

---

## SHIP TEST FOR THIS JOB, AND WHETHER IT IS MET
The job said: check that every UI element on the walked surface is at 50% and every touch target
is still 44 px. Both are answered with numbers, on the real surface, with the controls proved
before the numbers were believed, and the reason the halving cannot ship yet is named down to
which control takes whose tap. **E13 is SHIPPED with both rounds.**
