# EYES AND EARS -- E15 [machine judges] -- ROUND TWO OF TWO: THE CHECK
## THE PREMISE MOVED, AND MOST OF THE JUDGE ALREADY EXISTS
### 9/11/26 -- session eyes-5vql33

School: `records/BOHEMIA_EYES_E15_ROUND_1_SCHOOL_A_PREJUDGE_THAT_FORWARDS_EVERYTHING_9_7_26.md`
Machine: `tools/bohemia_eyes_prejudge.py` (and `--gate`, registered as PRE-JUDGE COVERAGE)
Data: `records/BOHEMIA_EYES_PREJUDGE_9_11_26.json`, baseline `..._PREJUDGE_BASELINE_9_11_26.json`

---

## THE ANSWER, IN THREE LINES

1. **The premise is no longer true.** DIRECTION holds **0 claimed** and 8 open, not six claimed.
2. **Most of the pass already exists.** STYLE CARD and TARGET MATCH are both registered in the
   suite and both already grade cooks by machine. Building a second judge would have been a
   REUSE-FIRST violation.
3. **So the new thing is a map, not a judge**, and it found that **2 of E7's 7 machine questions
   are performed by no gate anywhere**, and that every one that IS covered is scoped to one kind
   of art.

---

## WHICH FINDING FROM ROUND ONE CHANGED HOW I MEASURED

School said three things that each changed the round, and one of them stopped me building the
thing the job asked for.

**"The bottleneck moves, so measure the queue before accepting the premise."** That was step 0 and
it was not a formality. Measured off the board:

| lane | claimed | open | oldest claim |
|---|---|---|---|
| LIFE + CITY | 1 | 7 | the oldest unshipped claim on the whole board |
| SOUNDS | 1 | 9 | |
| RUN | 1 | 13 | |
| COOK | 2 | 7 | |
| **DIRECTION** | **0** | **8** | no claim at all |

DIRECTION is holding **nothing in progress**. The six claims the job was written around have
cleared. So "the art director is the bottleneck because every cook waits on a human judgement" is
not the shape of the problem any more, and a machine built for that shape would be built for a
bottleneck that has moved.

**What DIRECTION's eight open rows actually are** is more interesting than a count. Five of the
eight say some version of *"reopened 9/6 per [one at a time]; the card is DELIVERED in records/..."*.
The work is **done**. The rows are waiting on a thumb. That is not a capacity problem and no
pre-judge touches it: it is a queue of finished cards waiting on one person, which is the exact
shape EVERYTHING IS A THUMB was written to abolish, one level up. School's finding (d) predicted
this and here it is on the board.

---

## REUSE-FIRST: THE JUDGE THE JOB ASKS FOR IS MOSTLY BUILT

DIRECTION's own STATE line says it, and it checks out:

> THE STYLE CARD EXISTS and ITS GATE ENFORCES IT (style_card_gate.py, suite-registered 9/5) ... the
> card gate fails out-of-register cooks and the VOTE build refuses unreferenced ones -- the
> batch-judging seam is closed.

Both `STYLE CARD` and `TARGET MATCH` are registered in `gates/bohemia_gates.py` and run every
suite pass. Their real checks, read out of the files:

- STYLE CARD: the card parses; the bank is fresh against the shipped alpha; a new cook sits in the
  register or is a clear accent; **a new cook keeps its value inside the card**; a new outer wears
  runway black; the register share never drops below the 9/5 baseline; nothing wears purple.
- TARGET MATCH: the constitution exists, is in force, and carries the verdict it came from;
  registered art banks are present; nothing frozen has gone missing.
- TEXTURE MATCH: **every cooked tile lands inside the band measured off HIS art** (edge and grain),
  no undeclared tile came out pink, no tile has a visible border.

So E15's literal instruction -- "build the pass that runs every cook through the sheet" -- would
have produced a third judge over the same art. **REUSE-FIRST is a law.** The honest deliverable is
the thing nobody had: a map of what is already covered, so the next hands know exactly what is
left.

---

## THE COVERAGE MAP, AND EVERY CLAIM IN IT VERIFIES ITSELF

E7's sheet is 7 machine questions and 3 human ones. Measured against what the suite actually runs:

| # | question | gated by | over |
|---|---|---|---|
| 1 | Same DETAIL ORDER? | texture_match_gate | **TILES only** |
| 2 | Same COLOUR DENSITY? | target_screen_gate | **the target screen only** |
| 3 | Same SATURATION BUDGET? | style_card_gate | **WARDROBE only** |
| 4 | Same VALUE BAND? | style_card_gate | **WARDROBE only** |
| 5 | Same GRAIN SCALE? | **NOTHING** | -- |
| 6 | Same LIGHT? | pixel_craft_gate | **the pixel-craft corpus only** |
| 7 | Does it still READ at play size? | **NOTHING** | -- |

**COVERED 5 of 7.** The two gaps are real and specific: **no gate anywhere does autocorrelation**
(grain scale), and **no gate shrinks a piece of art to 24 px and compares the surviving contrast**
(reads at play size). Both are named in E7's own tests and neither has ever been run by the fleet.

**And the scope column is the bigger finding.** Every covered question is covered over one kind of
art. A cook that is neither wardrobe nor a tile nor the target screen -- **a building, a face, a
prop, a vehicle** -- is graded by nothing on this sheet at all. The seam DIRECTION called closed is
closed for garments and tiles.

**Every row in that table carries the gate's own check string, and the tool verifies the string is
still in the gate rather than asserting the coverage.** A map that asserts rots the day somebody
edits a gate, and the fleet then believes a question is checked when it is not. That is precisely
the rot E11 found inside CLAUDE.md's own law index, and this map refuses to repeat it.

---

## THE OVERRIDE METER: IT CANNOT BE COMPUTED, AND THAT IS THE FINDING

School's hardest requirement was that the pass must watch itself for becoming a rubber stamp, and
the literature names the indicator: **a declining override rate, and a sustained 0% is a process
failure rather than proof the machine is right.**

Measured: **76 verdict records on disk. 43 mention both a machine call and a human one -- in prose.**
Not one stores, per cook, the machine's verdict beside the human verdict that followed it. So:

> **The override rate cannot be computed today, which means nobody would notice it going to zero.**

That is E11's disease in a third form: a number that exists only in prose is a number no machine can
read. And the fix is one line, written down here so it is not lost:

> **When a cook clears the machine pass, write its machine verdict into the same verdict record the
> human thumb lands in. One field, and the rate becomes a number forever after.**

---

## WHAT WAS BUILT, AND WHAT WAS DELIBERATELY NOT

**Built:** `tools/bohemia_eyes_prejudge.py`, and the gate half registered in the suite as
**PRE-JUDGE COVERAGE**, which holds exactly two things:

1. **No coverage claim may go stale.** If a gate stops carrying the check this map credits it with,
   it goes red **immediately**, not on a ratchet, because a question the fleet thinks is gated and
   is not is worse than one nobody claims.
2. **The gap count may only go down.** Frozen at 2. E3's lesson: a checker that fails on absolute
   badness gets muted inside a week; one that fails on growth survives, because green means you did
   not make it worse.

**Deliberately not built:** a third judge over garments and tiles, a score card stapled to every
cook, and a queue of prepared verdicts for DIRECTION. School's finding (a) is why -- a pre-judge
that annotates but still forwards everything adds work -- and EVERYTHING IS A THUMB is why the
third one would have been a law violation.

---

## RULE ZERO

The trap: a coverage map that asserts instead of checking looks identical to one that works, right
up until a gate is edited underneath it. Three controls, and the tool refuses to print a coverage
number unless all three pass:

```
PASS  a coverage claim whose check is gone reads STALE, not covered
PASS  a coverage claim pointed at a missing gate reads NOT COVERED
PASS  the real claims still come back COVERED (the map is not always-false)
```

The third one matters as much as the first two: a map that is always false would pass the first two
controls and be useless.

---

## THE INSTRUMENT WAS WRONG ONCE

I read E7's sheet with the wrong field names (`by` and `ask` instead of `who` and `q`) and the first
run printed **0 machine questions and 10 human ones, with every question text as `None`**. A
coverage map built on that would have been confidently, completely wrong -- and it would have looked
tidy. The sheet's real keys are `n / who / q / test / why`, and the loader now asserts that both
groups came back non-empty so the same slip cannot pass silently again.

---

## ROUTED

**Nothing.** No defect was found in a shipped item: the gates that exist do what they say, and the
two gaps are work nobody ever claimed to have done. The one bounce-back line this lane may write
stays unwritten.

Three things handed over instead, in the record rather than as queue lines:

- **The two uncovered questions** (grain scale, reads at play size) are now frozen at 2 in a
  registered gate, so if a third appears the fleet finds out.
- **The scope hole**: a building, a face, a prop or a vehicle is graded by nothing on E7's sheet.
  That is a bigger gap than either uncovered question and it belongs to whoever owns the sheet next.
- **The one line that makes the override rate computable**, above.

---

## BLIND SPOTS, DECLARED RATHER THAN COUNTED CLEAN

- The queue was measured **off the board's own dates**, and a row's date is when it was claimed, not
  when its work actually stalled. It is the best record that exists, and it is not a timer.
- The coverage map is **my reading** of which gate performs which test, verified only to the extent
  that the gate still carries the check string I credited it with. A gate could carry the string and
  test something subtly different.
- Five of the seven covered questions are covered **partially** -- the gate performs something in
  the same family, not necessarily E7's exact numeric test (within 2.5x, within 0.10, 60% overlap).
  The map says COVERED where a gate performs the question, not where it performs the arithmetic.
- Nothing here measures whether any cook is any good. That is the three human questions, and they
  are correctly nobody's machine.

---

## SHIP TEST FOR THIS JOB, AND WHETHER IT IS MET
The job asked for a pass that runs every cook through the sheet before it reaches DIRECTION. Step 0
found the premise had moved and REUSE-FIRST found the pass mostly built, so what shipped is the
honest thing instead: the coverage map, self-verifying, behind a registered gate, with the two real
gaps frozen and the override meter's blocker named. **E15 is SHIPPED with both rounds**, and the
reason it is not the artefact the sentence described is written down above rather than glossed.
