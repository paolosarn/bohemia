# THE FACING GATE NEVER LOOKED AT A STREET
### 8/28/26, RUN lane. He reported it on 8/15 and again today, and a green gate sat on it for thirteen days.

## WHAT HE SAID

> "Bro, do you not see the fucking streets that are not facing the correct
> direction? What is wrong with you? I keep trying to fucking tell you, bro it's
> really annoying. You can't keep doing this to me."

He is right that he keeps telling us. `gates/street_facing_gate.js` OPENS WITH
HIS WORDS, dated **8/15**:

> "how hard is it to recognize and be smart about which direction a street
> should be going east to West north to south and then make it face that way
> properly by turning the tile ... we need that and the freeway too."

That gate has been **GREEN, 16 of 16, every day since.**

---

## THE FINDING: IT HAS NEVER LOOKED AT A STREET

Measured on the file itself:

| | |
|---|---|
| times it renders a frame or reads `om.at` | **0** |
| checks that are regexes against its own source text | **14** |

Its central claim is `/roadAxis\(d,x,y\)/.test(fn)` — it proves the source code
**contains those characters.** That is a MENTION, not a USE, and this repo
already has the law: *a checker that cannot tell a mention from a use is the
broken one.* It cannot count a single misfaced street, and it never could.

**IT IS THE SAME SHAPE THE WORLD LANE ADMITTED THE SAME MORNING**, about a
different street gate:

> "HE PLAYED IT AND SAID THE STREETS WERE STILL FUCKED WHILE MY GATE SAID 0 OF
> 2594. HE WAS RIGHT AND THE GATE WAS THE BROKEN PART."

Twice in one day. Two gates. Both about streets. Both green. Both blind for the
same reason: **they measured the code instead of the world.**

---

## WHAT IS ACTUALLY WRONG, MEASURED ON THE REAL SURFACE

`roadAxis()` decides which way a street runs by RUN LENGTH, and that is the right
question. Over the whole valley:

```
road cells                                   3,573
answered                                     3,458
ANSWERED NOTHING AT ALL                        115   <- arterial 101, freeway 10, interchange 4
  of those, inside a real corridor            114
  of those, an isolated corner                  1
```

And `roadAxis`'s own comment, written 8/27, says exactly what those 115 cost:

> "A TIE IS NOT AN ANSWER, AND EVERY CALLER WAS TURNING IT INTO ONE ... an
> ambiguous cell did not become a crossing, it became a **NORTH-SOUTH ROAD BY
> DEFAULT** ... the world had no answer, and instead of finding one, the code
> guessed, and the guess was always the same direction."

That was written about **14 freeway cells** and fixed for them. **The same
sentence is still true for 115 more**, and 114 of them are not odd corners — they
sit inside a real corridor with two or more road neighbours of their own
district. Every caller still writes `roadAxis(...) || 'ns'`.

115 of 3,573 is 3.2% of the valley's roads, scattered everywhere rather than
clustered. **That is exactly what "streets not facing the correct direction"
looks like from the air**, which is where he was looking.

---

## AND I CHECKED MY OWN RULER BEFORE REPORTING ANY OF IT

My first measure counted a cell's road NEIGHBOURS and flagged 15 further cells as
facing the wrong way. **They were not.**

```
cell (55,87)  neighbours say EW   run length ns 3 / ew 2   roadAxis says NS   <- roadAxis is right
cell (37,89)  neighbours say NS   run length ns 2 / ew 3   roadAxis says EW   <- roadAxis is right
cell (14,92)  neighbours say EW   run length ns 3 / ew 2   roadAxis says NS   <- roadAxis is right
```

Run length is the correct question and neighbour count is not. **My ruler was the
broken part — the fourth broken ruler in this lane this week** — and the only
reason it did not reach him as a false accusation is that it got checked against
the function's own inputs first. FIX THE RULER, NEVER THE TARGET, applied to
myself before opening my mouth.

The new gate holds that distinction explicitly, so nobody re-derives the wrong
measure later and "proves" a street is misfaced when it is not.

---

## WHAT I BUILT, AND WHAT I DELIBERATELY DID NOT

**BUILT:** `gates/street_facing_is_measured_gate.js`. It opens the real surface,
sweeps all 3,573 road cells, asks the real function, and prints the number in
every suite run. Its first claim is that IT READS THE MAP — so if it ever decays
into another source-text checker, it fails itself.

Mutation-tested by disabling the 8/27 tie-break poll: **115 → 149, two claims
red.** It can fail, on the thing it exists to catch.

**DID NOT:** touch the street renderer. That is the WORLD lane's system and they
are in it today — most recent writer in the handoff, mid-flight on street-to-city
seams. ONE SYSTEM, ONE SESSION, and **this lane lost four hours to exactly that
collision earlier the same day** when two sessions built the feedback card at
once. Reaching into their pipe now would be that mistake made twice, on purpose.

**AND IT RATCHETS RATHER THAN GOING RED**, because a deliberately-red gate blocks
every lane's ship. It holds 115/114 as a ceiling: the number cannot get worse in
silence, it is printed where nobody can miss it, and the gate goes green on its
own as it comes down. That is the pattern the WORLD lane already uses for its own
ratcheted seam counts.

---

## THE HANDOVER, IN ONE LINE

**115 road cells have no decided direction and every caller turns that into
north-south. 114 of them are inside real corridors. The fix belongs in the
callers, not in `roadAxis` — the function is already honest about not knowing,
and it says so in its own comment. First six: (40,6) (39,7) (75,7) arterial,
(13,13) (85,13) freeway, (90,13) arterial.**

---

## THE LESSON, AND IT IS NOT ABOUT STREETS

A gate named after a behaviour that only reads source text is worse than no gate,
because it converts his report into a closed ticket. He said this on 8/15. The
gate went green on 8/15. He said it again on 8/28.

**THIRTEEN DAYS OF A GREEN GATE STANDING BETWEEN HIM AND THE TRUTH.**

A GATE MUST NEVER OUTRANK A RULING is already law in this repo. This is what it
looks like when it happens: nobody lied, nobody skipped a step, and the machine
answered a question he never asked.

---

## ADDENDUM, SAME DAY: I TRIED THE OBVIOUS FIX AND IT IS WRONG

`roadAxis`'s own comment prescribes it: an undecided cell **is a crossing**, so
build all four arms instead of guessing north-south. One line in `kitRoadLegs`.

**Applied, measured, reverted. None of it is committed.**

```
crossings built NS-only         115  ->  0        the defect, gone
roadcell_gate                  46/0  ->  46/0
street_facing_gate (the old)   16/0  ->  16/0
street_contract_gate           19/0  ->  17/2     *** BROKEN ***
    arterial seams disagreeing tile for tile   0  ->  191   (ceiling 0)
    street-to-city edges broken              ~700 -> 881   (ceiling 700)
```

### WHY, AND THIS IS THE REAL FINDING

**A CROSSING IS AN AGREEMENT BETWEEN TWO CELLS, NOT A DECISION ONE CELL MAKES.**

Give one cell an east-west arm its neighbour is not expecting and the shared edge
stops matching. 115 wrong-facing cells become 191 broken seams. The 115 cannot be
fixed cell by cell at all — it has to be settled where the seam is negotiated,
which is the street contract, which is the WORLD lane's live work.

So the handover is not "here is a bug". It is: **here is the defect, here is the
fix everybody will reach for, and here is the proof that it costs 191 arterial
seams** — so nobody spends a turn rediscovering it.

### AND MY OWN GATE COULD NOT SEE THE FIX

The first version counted the cells where `roadAxis` answers nothing. That is a
fact about a FUNCTION. I applied the candidate fix and **the number did not
move**, because the fix changes what the CALLER does with the blank, not whether
the blank happens.

**A gate that cannot tell you whether a fix worked is measuring the wrong end of
the pipe.** It now also counts what gets BUILT — 115 crossings built as a plain
north-south street with no east-west arms — which is what a wrong-facing street
actually is, and the number that has to reach zero.

That is the fifth broken ruler in this lane this week, and the first one I found
by trying to use it rather than by mutating it.
