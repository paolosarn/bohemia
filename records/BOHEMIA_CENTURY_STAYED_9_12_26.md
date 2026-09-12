# WHO STAYED COUNTS (9/12/26, WORLD lane) — board row [century stayed]

Ship: `engine/bohemia_stayed.js` (new), the walked surface, and
`gates/century_stayed_gate.js` (34 checks, registered as **CENTURY STAYED**).
Tab: **CITY**, on the nightfall card. Also in the demo.

---

## HIS RULING, 9/7

> "buildings, and some people depending on how many years passed."

The century rule counted **buildings** and nothing else. It counts **some people**
now: a person you kept in the valley counts for as long as they could still be
alive given the years between the acts, and after that what counts is **what they
left**.

## EVERY YEAR IN THIS IS CANON SOMEBODY ELSE ALREADY WROTE DOWN

| number | where it comes from |
|---|---|
| ~100 years across the three acts | the century law itself, clause 4: *"dynasty building choices COMPOUND across the three acts (~100 years)"* |
| ~30 years a handoff | `bohemia_family.js`, in its own words: *"A handoff is ~30 years and that is canon"* |
| what age a word is worth | `bohemia_family.js`'s own bands — adult 41, elder 65 |

Each is carried **with its source**, and the gate re-reads that source and checks it
still says it. A number whose provenance is a comment nobody verifies is a number
somebody typed.

**The ages are asked of the family module, never copied.** `BAND` is private to that
module, so this asks it the question instead of reaching in: age a one-person probe
and read back what the word was worth. A module's public answer beats a private
table, and it cannot drift from what the fold actually does. The gate proves the
reading is live by ageing its own probe and checking both files agree to the year.

## THE ONE PIECE OF ARITHMETIC IN THE FILE

**When is somebody past living? ELDER + ONE HANDOFF.** The age this game itself
calls elder, plus one whole generation more. Both halves are canon above; the plus
is the only sum here. It lands at **95**, which is a real outer bound for a human
life, and it is on a dial tagged `tuned:false` so he can move it by playing.

Nothing in this repo ages anybody to death, and adding that to `bohemia_family.js`
would be editing another lane's system. "Could they still be alive" is answered
here, about a housed count. The family tree is untouched.

## WHAT "A PERSON YOU KEPT" IS, AND IT IS NOT NEW DATA

The people you kept are **the people sleeping under roofs you put up**.
`bohemia_century.js` has stamped the household on every build entry since it was
written — *"THE HOUSEHOLD IS RECORDED AT THE TIME IT HAPPENED, not looked up
later"* — so the record already knew, per act, how many people the family housed.
Nothing new is stored and no second census is taken. A solar farm keeps nobody, and
that is an answer rather than a gap.

Their age is the band midpoint, which is the repo's own answer to not knowing:
`agePeople` does exactly this for anybody who only ever had a word, and says why. A
resident nobody has met is an **adult**.

## WHAT IT DOES, MEASURED ON A REAL RECORD

Three homes in act one, two apartments in act two:

```
act 1                       6 people you kept are still here
act 2, thirty years on      they are 71 and still here, plus 4 new       10 here
act 3, sixty years on       the first six are 101                         4 here,
                                                                          6 left what
                                                                          they built
                                                                          behind them
```

That is his sentence exactly: buildings, and some people, depending on how many
years passed.

## THE CHECK THAT MATTERS MOST

**"After that what counts is what they left" is a branch.** A branch that has never
executed is not code, it is an intention — and in play today the act never moves,
because the generation fold is another line's job (QUESTS, parked). So the gate
drives a real record through three acts, in node **and on the walked surface**, and
watches six people become six who left what they built behind them. Delete the
ageing and four checks go red, including that one.

## WHAT HE READS

On the nightfall card, in the **CITY** tab, under the buildings line that was
already there:

```
this generation: 3 buildings up
6 people you kept are still here
```

and, a century in:

```
4 people you kept are still here, 6 more left what they built behind them
```

Absent entirely when the family has housed nobody — the honest empty state rather
than a zero.

## ONE THING THAT LOOKED LIKE A BUG AND WAS THE GAME WORKING

Driving the surface, I set the act back to 1 and the card still answered for act 2.
That is `bohemia_century.js` refusing to run backwards, by its own rule — *"a
century that can run in reverse is not a memory"*. **My probe was the confused one,
not the card.** Worth writing down because the next person to drive acts by hand
will see the same thing.

## WHAT THIS ROW DELIBERATELY DID NOT BUILD

- **The fold.** It does not move the act; it reads the act the record is on.
- **Death.** Nothing here touches the family tree's `alive`.
- **The dials underneath.** RUN `[a day is]` and DYNASTY `[days per life]` are both
  still open. Neither blocks this: the years between acts are canon already.

## PROOF

- `node gates/century_stayed_gate.js` → **34 passed, 0 failed**, registered, suite 587
- red both ways: let nobody age out → **4 red**; put in a handoff year nobody ruled
  → **7 red** (including both source checks)
- neighbours green: CENTURY RECORD 18/0, BATTERIES MINED 36/0, PARTIES MOVE 39/0,
  A DAYS WORK 37/0, FAMILY 15/0, HOUSING 18/0, ATTEMPT 15/0, DEMO BUILD 25/0,
  PAGES PUBLISH 18/0, GATE REGISTRY 6/0
- all seven of this lane's gates verified registered, read the way the registry
  checker itself reads the table

Build stamp: **BUILD 9/12a - WHO STAYED COUNTS**
