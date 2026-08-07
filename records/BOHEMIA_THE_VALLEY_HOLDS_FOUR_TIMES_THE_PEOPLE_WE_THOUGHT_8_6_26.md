# THE VALLEY HOLDS FOUR TIMES THE PEOPLE WE THOUGHT — 8/6/26, PEOPLE lane

A number the whole game rests on was wrong by **4.25x**, and it was wrong inside
the tool built to stop exactly that from happening.

---

## THE NUMBER

`tools/bohemia_scale_model.js` exists to keep one figure honest: how many people
are alive in the valley. Paolo asked the question that produced it on 8/1 — *"you
get the scale model of it and now it's not millions, and then on top of it now we
have an apocalypse."* The tool's own header promises the answer

> *"can never drift away from the world it describes"*

It then measured the world like this:

    for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++)
    const side = 48 * 96;

**The valley became 96×96. The tool kept measuring a quarter of it** — silently,
because a small loop over a big world does not error, it under-counts.

| | the tool said | the world holds |
|---|---|---|
| homes | 12,259 | **55,391** |
| area | 21.2 km² | **84.9 km²** |
| scale by housing | 1 : 78.2 | **1 : 17.3** |
| scale by area | 1 : 65.9 | **1 : 16.5** |
| **people in the valley** | **1,112** | **≈5,027 derived / 4,723 measured** |

---

## THE PART THAT PROVES IT IS A FIX AND NOT A SECOND MISTAKE

The scale model's own sanity check is that its two independent measures agree —
homes and area, counted separately, should land on the same scale, *"which is what
says the map is a coherent model and not a doodle."*

- **Before:** 1:78.2 by housing against 1:65.9 by area — agreeing within **16%**
- **After:** 1:17.3 by housing against 1:16.5 by area — agreeing within **5%**

The correction makes the model *tighter*, not looser. And an exact census over all
2,809 residential cells returns **4,723 people** against the corrected derivation's
**5,027** — 6% apart, where before the fix the same two numbers were **4.25x**
apart and nobody knew.

---

## WHAT DID NOT CHANGE, AND THIS IS THE IMPORTANT PART

**`OCCUPIED_RATE = 0.038` was right the whole time.** The world produces **3.91%**
occupancy, measured, against the 4.1% the arithmetic asks for.

> **Nothing about the world changed when this was fixed — only what we believed
> about it.** No district got emptier or fuller, no save is invalid, no ruling of
> Paolo's is overturned. The people were always there. The document describing
> them was counting a map that no longer existed.

That is why this is a correction and not a redesign, and why it needs no decision
from him.

---

## IT HAD SPREAD TO TEN FILES

`1,113` was cited in two engine modules, a gate, this lane's own block fixture,
two research records, the handoff and the backlog. **A number in a comment is
documentation right up until somebody builds an economy on it** — and the economy
is BIG MISSING item 3, unbuilt, and would have been sized against it.

Live code corrected: `engine/bohemia_agents.js`, `engine/bohemia_population.js`,
`gates/bohemia_block_fixture.js`. Dated records left as history, which is what
records are for.

---

## THE GATE THAT WOULD HAVE CAUGHT IT ON DAY ONE

`gates/scale_truth_gate.js` — 8 claims, three mutations killed (re-hardcode the
48, restore the stale figure, delete the correction note — all three go red).

The load-bearing claim is not a text check. It is:

> **The sampled estimate and an exact census of every residential cell must
> agree.** Two ways of counting the same thing — one cheap, one exhaustive. A
> map-size bug cannot survive both, because it corrupts one and not the other.

That claim would have failed the moment the valley outgrew 48×48, years of
sessions before anybody noticed by hand. The other claims are cheaper and narrower:
the map bound must be *read* and never typed, the occupancy the world produces
must equal the dial, and the engine's written figure must stay within reach of the
measured one.

**A tool that promises it cannot drift is a claim, and a claim without a machine
behind it is a wish.** That is the oldest law in this repo, and this is the third
thing today it caught.

---

## WHY IT SURVIVED: THE CROSS-CHECK HAD THE SAME BUG

There *was* a gate on this. `people_gate` G6 — **"THE SIM HOLDS WHAT THE
ARITHMETIC SAYS"** — counts the live sim and compares it to the derived figure.
It is the one claim in that block designed to be independent, and its comment says
it exists to go red "if somebody edits the occupancy rate back to a round guess."

It counted the sim like this:

    for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++)

**The identical hardcoded 48.** The sim side measured a quarter of the world, the
model side measured a quarter of the world, and the two agreed *perfectly* while
both were wrong by 4.25x — G6 reported "0% off" for weeks.

> **A cross-check whose two sides share an error is not a cross-check. It is one
> measurement written twice, and it will agree with itself forever.**

That is the real lesson here, and it is worth more than the number. Both sides now
read `world.n`. And the new `scale_truth_gate` is immune by construction: its
exhaustive census walks `w.n`, so it cannot inherit a stale bound from anywhere.

Four claims in that block were also pinned to the 48×48 world (area 21.23 km²,
homes 10–15k, no-apocalypse 20–80k, valley 600–2,000 people). They passed only
because the tool under-measured to match. Re-pinned to the measured world, with
the reason recorded at each one.

---

## THEN I SWEPT THE PATTERN INSTEAD OF THE INSTANCES — AND FOUND NINE MORE

Four separate hunts today found this class of bug one at a time. That is the exact
habit I criticised this morning before building the reachability census, so:
grep the whole repo for the shape rather than the symptom.

**`people_gate` had TEN loops bounded at 48, not one.** G6 was simply the one that
happened to be checkable. The others feed:

| bound | the claim it fed |
|---|---|
| `y < 48` | **K1 "EVERY body has a seat to be keyed by"** |
| `y < 48` | **K2 "the biggest household in the valley"** |
| `y < 48` | **E7 "turning it down thins the valley, it never MOVES anybody"** |
| `y < 48` | D4, J1, I3, K3 — "somewhere in the valley…" |

The existential ones ("somewhere") are *safe* under-scanned — finding a thing in a
quarter still proves it exists. **The universal ones are not.** "EVERY body" and
"never MOVES anybody" tested on 25% of the world means a violation in the other 75%
passes silently.

Widened to `world.n`, the scan covers **678 residential cells instead of 162** and
**1,224 bodies instead of 268** — and all 152 claims still pass. **The code was
right; the tests were short-sighted.** K1 now verifies a universal property over
every body in the valley instead of a fifth of them.

> And the number **268**, quoted across this repo as "our 268 derived people", was
> itself an artefact of that bound.

### `gates/mapbound_gate.js` — the machine that finds the next one

A **ratchet, not a purge.** Twenty-six typed map bounds survive in nine files
across the fleet; they are correct *today* only because 96 happens to be the map
size, and they belong to other lanes. Dumping red on them is the thing this repo
spent a week learning not to do. So they are **declared with a date, may only
shrink, and any NEW one fails immediately** — plus a specific ratchet on the three
files this cost the most.

It strips comments before counting, because this file's own header quotes `y < 48`
four times and **a checker that cannot tell a mention from a use is the broken
one.**
