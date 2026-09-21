# THE RATCHET REFUSED A CLEAN TREE ON ITS COLDEST READING (9/21/26, WORLD lane, hold round)

**Nothing shipped to the alpha.** Rule 18(b): WORLD holds, and the round is spent
measuring its part of loading, walking or the fight.

Measuring loading is how this was found, and it belongs to PLUMBER, not to me.

---

## 1. WHAT HAPPENED

`tools/bohemia_never_worse.js` shipped this round (rule 18c) and now refuses any push
that scores worse than the last accepted cut. I ran it on an unchanged tree, as the
first thing I did in a fresh container:

```
tappableMs   548 -> 1223   WORSE   (allowed up to 740)
*** REFUSED. 1 number(s) are worse than the last accepted cut. ***
```

Nothing in the tree had changed. So I ran it again.

## 2. EIGHT MORE RUNS, SAME UNCHANGED TREE

```
run 0 (first in the container) .... 1223   REFUSED
run 1 .............................  574   within
run 2 .............................  630   within
run 3 .............................  660   within
run 4 .............................  637   within
run 5 .............................  594   within
run 6 .............................  599   within
run 7 .............................  555   within
run 8 .............................  609   within
```

**Warm range 555 to 660, median about 605. The one cold reading was 1223 — twice the
warm median and 1.65x the refusal threshold.**

## 3. WHY THIS MATTERS MORE THAN AN ODD NUMBER

Every lane runs this **once**, in a **fresh container**, as the first thing it does
before a push. So **the first reading any lane ever takes is the cold one**, and on
this evidence the cold one refuses.

A gate that says no to good work, on its first run, every time, is a gate lanes will
learn to re-run until it agrees — which is exactly the habit the ratchet exists to
prevent.

## 4. WHAT I AM CLAIMING, AND WHAT I AM NOT

**Claimed, measured:** on one unchanged tree, the first run in a fresh container read
1223 ms and eight subsequent runs read 555 to 660 ms.

**Not claimed:** *why*. "Cold file cache" and "first Chromium launch in the container"
both fit and I cannot separate them without un-launching a browser. It is a hypothesis
and it is labelled as one. The measurement stands on its own either way.

## 5. THE SHAPE OF A FIX, FOR PLUMBER

The tool already refuses to score things it cannot decide — it holds `deadPresses`
back for being bimodal and says so in its own output. `tappableMs` needs the same
honesty applied to its *sampling* rather than its scoring:

- a discarded warm-up run, or
- the **median of three**, which on this data would have read about 630 and passed, or
- best-of-N.

Median of three is the cheapest and it is what the numbers support.

**This is PLUMBER's tool and PLUMBER's call.** Measured and handed over, not touched —
the same way this lane handed over the demo-cutter line and the block-residents minds.

## 6. AND MY OWN PART OF LOADING, SINCE THAT IS THE ASSIGNMENT

`f7d4d384`, this lane's last code ship, is an **ancestor of the accepted baseline
`de2bc43`**. So every number in that baseline already includes WORLD's boot work, and
none of the regression window is mine. The window holds twenty commits from PLUMBER,
LIFE+CITY, UI, PORTRAIT, SOUNDS, WORDS, QUESTS, ECONOMY, ANIMATION, DIRECTION and the
coordinator; my only commit in it is a documentation round.

Last round's numbers still stand: WORLD costs about **50 ms a night** on a phone-shaped
CPU and **35 ms once** at boot, against the 174 s of freezing EYES measured in the
first 300.

## 7. STILL OPEN FROM LAST ROUND, STILL NOT SHIPPED

The first night card says `BATTERIES IN THE VALLEY: 0` and the second says the valley
made 3,352 overnight. Cause found, fix written down, two lines, both in my own files.
It waits for the hold to lift, and rule 19(a) moves that bookkeeping to the phone
anyway.
