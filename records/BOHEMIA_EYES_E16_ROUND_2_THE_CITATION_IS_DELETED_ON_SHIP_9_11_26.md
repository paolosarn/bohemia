# EYES AND EARS -- E16 [never opened] -- ROUND TWO OF TWO: THE CHECK
## THE LINK IS NOT MISSING. IT IS DELETED, AT THE MOMENT THE WORK LANDS
### 9/11/26 -- session eyes-5vql33

School: `records/BOHEMIA_EYES_E16_ROUND_1_SCHOOL_NEVER_REVIEWED_IS_A_STATUS_9_11_26.md`
Machine: `tools/bohemia_eyes_seen.py` (and `--gate`, registered as SEEN BY HIM)
Data: `records/BOHEMIA_EYES_SEEN_9_11_26.json`, baseline `..._SEEN_BASELINE_9_11_26.json`

---

## THE ANSWER, IN THREE NUMBERS

| | |
|---|---|
| An **OPEN** row cites a ruling of his | **34%** |
| A **CLAIMED** row cites a ruling of his | **38%** |
| A **SHIPPED** row cites a ruling of his | **12%** |

**An open row cites him three times more often than a shipped one.** The row is rewritten as a
result summary when it lands, and the ruling it answered goes with it. So the link between his
words and the work is not missing -- it is **destroyed at the exact moment the work becomes
history.**

That is why "has he seen this" could not be computed, and it took two failed attempts to see it.

---

## FIRST: THE PRIOR QUESTION IS ANSWERED YES, AND IT CORRECTS MY OWN SCHOOL ROUND

School said answer this before building anything, because the record the job came from says the
art director judged 127 garments for him and he thumbed **zero** -- and if nothing has ever got
him to open a named thing, a rota is a file nobody opens.

Measured: **76 verdict records on disk, and 39 of them carry his own verbatim words.** Oldest
`BOHEMIA_MARKING_VERDICTS_7_17_26.txt`, newest `BOHEMIA_CLIP_VERDICTS_9_7_26.txt`.

So a judge page **has** repeatedly got rulings out of him -- thirty-nine times, most recently four
rounds ago. **My own school round's counter-finding (c) was too pessimistic.** "He has thumbed
zero" is true of those 127 garments; it is not true of the repo's history. A rota can ride on
something that has worked thirty-nine times.

---

## WHICH FINDING FROM ROUND ONE CHANGED HOW I MEASURED

Three did, and the second one is the reason this record exists in the shape it does.

**"He mentioned it is not he reviewed it, and the error is lopsided."** So the bar was set at an
explicit quoted judgement, and everything ambiguous counted UNSEEN. That was right, and it is
also what exposed the deeper problem.

**"The prior question comes first."** Answered above, and it changed the conclusion from
"do not build this" to "build it".

**"Oldest-unseen is the wrong ordering."** The one item surfaced below is chosen by risk.

---

## TWO ATTEMPTS TO COMPUTE IT, BOTH FAILED, AND THE SECOND EXPLAINED THE FIRST

### ATTEMPT 1: MATCH A ROW TO HIS RULINGS BY WORDS. 3 hits in 205, at least 2 spurious.

`PEOPLE [your reputation] BB-STANDING-PLAYER` "matched" a quote about the player's daily hub.
`UI [one number] BB-ONE-NUMBER` "matched" a quote about phone numbers being personal. Neither is
a ruling on that row.

And the one that should obviously have matched did not: **`BB-BATTERIES-ARE-THE-MONEY` came back
UNSEEN**, because there is **no quote of his in the readable corpus containing both "batteries" and
"money"**. CLAUDE.md says "Batteries are the money (9/4)" -- and that is a **summary**, not his
words, so the precision-first bar correctly refused it.

**The finding: the board's rows and his rulings do not share a vocabulary.** Rows are named after
mechanics; he talks about intent. A keyword matcher therefore delivers near-zero true positives and
a handful of false ones, and a false SEEN is the one error that hides an item forever. Abandoned,
and the false positives are recorded above as the evidence for abandoning it.

### ATTEMPT 2: USE THE EXACT LINK THE BOARD ALREADY CARRIES. 4 in 205, 2%.

A row built off a ruling of his usually **quotes him in its own text**. That is exact, needs no
guessing, and answers a question nobody had a number for: how much shipped work came off a ruling
of his and how much came off my defaults.

**Four of 205.** Which was so low it demanded its own explanation, and that is where the real
finding came from.

---

## THE MECHANISM, MEASURED: THE CITATION IS DELETED ON SHIP

Rather than accept 2% as a mystery, count the citations by status. The table at the top is the
answer: **34% of open rows, 38% of claimed, 12% of shipped.** A gap of 22 points.

The citation is not absent from the board. It is present while the work is in flight and gone once
it lands, because a SHIPPED line is rewritten to say what the work achieved, with the proof paths,
and the ruling that caused it is not part of that sentence.

**So the answer to E16 is not a list. It is one field.** Keep the ruling citation on the row when
it ships and coverage becomes computable forever, by anybody, in one grep. Exactly what school's
first finding said: real trackers make this a **status**, and our board has no field for it.

---

## THE MATRIX, AND WHAT IT HONESTLY SUPPORTS

205 shipped rows graded. 201 carry no citation of a ruling of his. **58 of those sit in the first
minute of the game.** By lane, the largest blocks with no ruling cited are ECONOMY 28,
DIRECTION 23, WORDS 17, DYNASTY 17, and **EYES AND EARS 15 -- my own lane, which is the fair
place for that number to land.**

What the matrix does **not** support is the sentence "he has never seen these 201 things". It
supports the narrower, true claim: **nothing on the board records that he ruled on them.** Those
are different statements and this record will not blur them.

## STEP 4: THE ONE ITEM FOR THIS ROUND, BY RISK

> **WORLD [living costs] BB-FOUR-VERBS-THREE-CURRENCIES** -- shipped, no ruling of his cited on
> the row, and it sits in the first minute of the game: the day eats food, the fight eats tape,
> the night eats power, asking eats clout.

One item, not a list, because a list aimed at one person is the queue EVERYTHING IS A THUMB
abolished. The other two hundred do not wait.

---

## RULE ZERO, AND IT EARNED ITS KEEP THIS ROUND

Eight controls, and the tool refuses to print a number unless all eight pass. One of them **failed
on the first run and caught a real bug**:

```
FAIL  a thing he demonstrably ruled on is findable in the corpus (the UI at 50%)
```

The harvester matched quotes with `"([^"]{12,600})"` across the whole file, so **a single
unbalanced quote mark anywhere put every later pairing off by one.** The harvest came back with
sentences glued to board rows -- one "quote" ended with `- SHIPPED 9/7 8a13045`. A quote may not
cross a newline now, so each line pairs its own marks and the drift cannot start; multi-line
verbatim blocks in the verdict records are captured separately. The corpus went from 690 garbled
strings to **341 real quoted rulings of his**.

Without that control I would have published a matrix built on nonsense, and it would have looked
fine.

---

## THE GATE

Registered as **SEEN BY HIM**, and it holds **one number: the citation gap.** Frozen at 22 points,
and it may only shrink. Closing it means rulings survive shipping, which is the whole fix.

It deliberately does **not** hold a raw count. New rows arrive honestly and would push any absolute
number around; the gap is immune to growth because both halves move together when the board simply
gets bigger. That is the same lesson as the NO READER gate, where a byte-exact check went red for
the whole fleet inside a minute.

---

## ROUTED

**Nothing.** No defect in a shipped item: the board records what it was designed to record. What it
was never designed to record is the link, and that is a board change, not a lane's defect. This
lane may change status words only, so the one-field fix is written here and in my handoff for the
coordinator, not made.

---

## BLIND SPOTS, DECLARED RATHER THAN COUNTED CLEAN

- **The board is not the game.** A SHIPPED line is a claim, and E11 and E13 both found shipped
  claims that were not true on the surface.
- **"No ruling on record" is not "he has never seen it."** His rulings from before the board
  existed live in chat transcripts nobody kept, and he may have ruled in words that never made it
  into a file.
- The matrix grades 205 rows while the gate counts 210 shipped rows: the matrix requires a row to
  carry a two-word label or a NAME-IN-CAPS to be gradeable, and five do not.
- The risk column is a keyword guess at whether something sits in the first minute. It is a
  heuristic for ordering one item per round, not a claim about importance.
- Nothing here measures whether he would **like** any of it, which is the whole point of putting
  something in front of him.

---

## SHIP TEST FOR THIS JOB, AND WHETHER IT IS MET
The job asked for every shipped line with whether any ruling of his has ever mentioned it, one item
per round. The prior question is answered with a number, two methods were tried and the failure of
the second produced the real finding, the matrix and the one item exist, and the mechanism behind
the low number is measured and frozen behind a registered gate. **E16 is SHIPPED with both rounds.**
