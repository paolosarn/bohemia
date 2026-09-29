# A BLOCK RUNS OUT

WORLD lane (chat 02), 9/29/26. Row `[scavenge]`, rule 37(k). And the round also
cleared `[cut citations]`, which was a red gate on main.

---

## 0. WHAT HE ASKED FOR

Paolo, 9/27, on the shift research:

> a SCAVENGE button in the settlement screen: spend time, test your luck, for
> materials; for when you are down bad on food, medicine or batteries; a
> settlement may show a bonus (a recent battle: more ammo).

And rule 40 (Paolo 9/29) is why it matters now:

> in Battle Brothers the chess-playstyle board is the longest part of the
> gameplay, not the traversing, contracts, exploration, map; I want it to lean
> into faster combat and **a more deep rich interactable buildable world**

Scavenging is one of the few verbs that makes a *place* worth standing in rather
than passing through. So it had better be about the place.

---

## 1. THE FOUR CALLS THAT ARE MINE

Rule 39(a) says every lane decides its defaults and builds. These are the four,
and each one is forced by something already ruled.

### (a) **LUCK DECIDES WHETHER, NEVER HOW MANY.** This is the load-bearing one.

EVERYTHING COSTS ONE (8/15) and BATTERIES ARE THE MONEY (9/4). A scavenge that
pays out a variable *pile* is a faucet with no ceiling, and **this repo has
already measured that exact failure once**: `[people charge]` on 9/22 found an
ordinary 10 W panel offering 9.33 cells a day against a day's work paying ONE,
which "would end EVERYTHING COSTS ONE inside a week".

So a search returns **one thing or nothing**. His "test your luck" is honoured in
full: luck decides *if* you find something and *which* thing. The locked economy
survives it.

### (b) **WHAT YOU CAN FIND IS WHAT THE BLOCK REALLY HAS.**

Not a loot table. A loot table is the spreadsheet-simulator move the three-
currencies law names as its anti-reference, and it makes every block the same
block — **the identical defect `[bb places]` measured on 9/25**, where a shelf was
a function of TIER ALONE and every camp sold the same four things.

The valley already knows what is on a block. The overmap gives every cell a
district, and `engine/bohemia_place.js` (this lane, 9/27) already turns a block
into what is standing on it. So a scavenge reads the block. A boneyard is not a
house.

### (c) **A BLOCK HAS A FINITE NUMBER OF THINGS LEFT, AND IT IS A COUNT, NOT A DIAL.**

The obvious build is a percentage chance per search. That number would be mine,
invented, and exactly what rule 36 hands to TUNING.

A **stock** needs no such number. A block starts with as many findable things as
its own searchable cells imply, each search takes at most one, and when it is
empty the block answers `PICKED_CLEAN` by name. Diminishing returns fall out for
free, they are what really happens to a scavenged street, and **not one number in
it is mine** — the chance a search finds anything is `left / total`, a ratio of
two counts the world already decided.

The module stores only *how many times each block gave something up*. The total is
re-derived from the block every time.

### (d) **TIME IS THE ONLY COST.**

He said "spend time" and he said it is for when you are **down bad**. A scavenge
that charges batteries is unreachable by the player it exists for. So it costs a
block of the day and nothing else, which makes it the honest floor of the economy:
you can always search, you just cannot always eat.

---

## 2. MEASURED ON THE REAL VALLEY

Seed 1337: **467 blocks, 451 worth searching, 3,166 findable things**, the biggest
single block holding 233, and **16 blocks with nothing on them at all** — which is
an answer, not a gap.

Clearing a block costs `total × H(total)` searches. Measured against that
arithmetic:

| things on the block | searches to clear | theory | ratio |
|---|---|---|---|
| 1 | 1 | 1.0 | 1.00 |
| 2 | 3 | 3.0 | 1.00 |
| 6 | 24 | 14.7 | 1.63 |
| 233 | 1,247 | 1405.1 | 0.89 |

A typical six-thing block gives up its six over about two dozen searches, most of
them empty-handed. **How long one search takes is TUNING's dial, not mine** — the
arithmetic above is the input they need. My default, stated so it can be argued
with: one search is a quarter of a day, so a typical block is a bit under a week of
picking and you feel it run dry.

---

## 3. **THE ROLL WAS BIASED AND I MEASURED IT BEFORE ANYTHING ELSE DID**

The first cut used a bare xorshift over a seed built as
`block×k + taken×k2 + day×k3`. Driven for real it took **199 searches to clear a
six-thing block** when the arithmetic says about 15.

The roll was not uniform. It was tracking the structure in its own seed, and the
verb would have been unusable for a reason that had nothing to do with the design
— the kind of defect that gets diagnosed as "scavenging feels bad, raise the drop
rate" and fixed in the wrong place forever.

It is the murmur3 finalizer now, which avalanches every input bit, and **the gate
holds the measured pace against `total × H(total)`** so a biased roll cannot come
back quietly. Putting the old roll back turns the gate red at **7.82× theory**.

---

## 4. TWO THINGS THIS DOES NOT DECIDE

### **The recent-battle bonus is UNREAD, and it says why.**

His sentence ends "a settlement may show a bonus (a recent battle: more ammo)".
That needs one fact nobody stores: **that a fight happened here, and when.**

The deed ledger is exactly the right shape — `bohemia_deeds.publish` already
carries `turn, x, y, where`. But a zero returned here would be indistinguishable
from "no battle happened", so `bonus()` answers `UNREAD` with the reason, the same
discipline `bohemia_future` uses for a field it cannot read.

**And my first version of that note was wrong.** I wrote that `bohemia_claims` and
`bohemia_haggle` publish into the ledger. They do not. Both only *build rows* "in
the shape `bohemia_deeds.publish` already takes", and claims says in its own file
"This module never publishes it." **The only two publish calls in the entire game
are in the walked surface, and both are on a quest stage.** No engine module
publishes a deed at all.

So the finding is stronger than I first wrote it: the deed ledger has one caller,
for one thing. One publish call when a fight ends closes the bonus for free, and
it belongs to COMBAT.

### **Medicine is a currency question that is not mine.**

He named "food, medicine or batteries". The currencies are **locked at three**
and the purse has carried "a third icon is [PENDING Paolo]" since 7/26. His
scavenge sentence is the strongest evidence yet for what that third icon is.

This module does not decide it. `medicine` is a **find kind** — a thing you can
hold — and never a balance. No fourth currency is created here, and the gate holds
that the module never credits or debits anything at all.

`YIELDS` ships empty. What a find gives you is content, and content is his.

---

## 5. THE COOK: PICKED CLEAN

`tools/bohemia_picked_clean_cook_9_29_26.js` → `slices/vote/WORLD_PICKED_CLEAN.png`.
VOTE tab, `world-picked-clean-9-29`.

**One real block of Las Vegas** — block 43 on seed 1337, eight cells, two
commercial and six suburb — drawn three times: as you find it, halfway through,
and picked clean.

Every other scavenge system in every other game is a button that pays forever.
The picture exists to say the one thing a number cannot: **this one runs out.**

Measured: **4,228 ground pixels compared across the three panels, 0 moved.**
Finds on screen 128 → 64 → 0. The finds are 0.89% of the frame.

The tool refuses itself three ways: if a single ground pixel differs between
panels (searching a street does not rearrange it), if the finds do not fall to
zero, and — the important one — **if its own count of findable cells disagrees
with the module's.** The picture is read out of the engine, not drawn to
illustrate it.

**AH-01, and the wrong thing is the third panel being empty.** Three photographs
of the same corner. Nothing was destroyed, nothing moved, nobody is there. There
is just nothing left on it, and you are the reason.

---

## 6. THE OTHER ROW: `[cut citations]`

PLUMBER measured on a clean main that CANON ROT was red for every lane, C2 at
**10 against a ceiling of 6**, because my rule-33h cut moved the notice module,
its tool and its gate to `archive/` and four citations still named them as live.

All four now carry a note beside them saying what happened and when. C2 is back to
6, at ceiling.

**And the gate was still red on a second count that was not mine**: C3 had gained
one new rot. The TF-ART-019 grid-kit sheet pointed at a cook file with `_grid_`
in the middle of its name, which does not exist; the real one is
`tools/tfcook/TF-ART-019_cook.py`. That is LIFE+CITY's file and a one-word typo in
a doc, not a system of theirs, so I fixed the word rather than leaving main red
over it.

*** AND WRITING THIS SECTION BROKE THE GATE AGAIN, WHICH IS WORTH KEEPING. ***
My first draft of the paragraph above spelled the dead filename out in full so the
reader could see the typo. The gate reads any path in a record as a citation, so
**documenting a broken citation created one** and CANON ROT went red on my own
record. C3 has no "described it as dead" escape the way C2 does, so the cure is not
to write the dead path at all. It is named in prose above instead.

**CANON ROT: 13 pass / 0 fail.** It was 11 / 2.

---

## 7. ROUTED

- **COMBAT** — one `publish` call when a fight ends turns the recent-battle bonus
  from UNREAD into a derive. Nothing else is needed.
- **TUNING** — how long one search costs is the only felt number here. The
  arithmetic is in section 2; my default is a quarter of a day.
- **RUN** `[settlement screen]` — this is the button's screen. The module answers
  `NOT_A_PLACE`, `NOTHING_TO_SEARCH`, `PICKED_CLEAN`, found-nothing and found-one,
  which is every state a button needs.
- **LIFE+CITY** `[build a lot]` — rule 40(b) puts building in the same screen.
  Scavenging takes a block down; building puts something back on it. They are the
  same block and should read off the same count.
- **Paolo** — `[PENDING Paolo]` the third RESOURCES icon. His scavenge sentence
  names medicine, and that slot has been empty since 7/26.

---

`[bb scavenge]` **Battle Brothers has no scavenge button, and the gap is the
point.** Its loot comes from bodies and from contracts, so its world is a place
you pass through to reach the next fight — which is precisely what rule 40 says
we are not doing. **OUR TWIST, so nobody can call it a rip-off** (rule 39b): BB's
map is a supply of *opportunities* and never runs down; ours is a supply of
*things* and does. A BB village you have visited twenty times is identical to a BB
village you have never seen. Ours remembers you, gets thinner, and eventually has
nothing left to give — and since the derive is signed (rule 37c, 9/28), a valley
you stripped in act one is a poorer valley in act three. That is the deep
interactable world in one mechanism: **the map is a resource you can spend.**
