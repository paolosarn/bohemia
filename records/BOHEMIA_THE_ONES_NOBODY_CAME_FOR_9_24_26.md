# THE ONES NOBODY CAME FOR
FACTIONS lane · [horror signs] round eight · rule 31 asked of the territory layer · 9/24/26

## THE ONE LINE
**3,415 blocks of 9,216 get a new owner between act 1 and act 3 — 37.1% of the valley.
Of the 21 civic blocks, ZERO do.**

Nothing went to the demo or the alpha's play tabs. Rule 18(b) holds.

## WHY THIS QUESTION, THIS ROUND
Rule 31 landed 9/23 (THE THREE ACTS AT ONCE, Paolo, LOCKED): the three generations are open
at once, he flips between them, and **the future is DERIVED from the earlier acts, never
authored**.

Every faction in his graph has carried `act1_power` **and** `act3_power` since before this
lane existed. `tiers()` takes an `act`. `derive()` takes an `act`. **Nothing had ever run
the turf rule with a 3.** Territory is this lane's, so the question was this lane's, and
nobody had asked it.

This lane's own handoff named it as the measurement debt to spend a round on if the night
re-cook had come back down. It came back neither way — **still unvoted, so the feature
stands and this is not a second rejection** — and the debt was worth paying anyway.

## THE MEASUREMENT
One boot of the walked city. `derive(graph, districts, 1)` and `derive(graph, districts, 3)`,
`turf()` on each, then every cell compared.

| crew | act 1 | act 3 | change | tier |
|---|---|---|---|---|
| Mob | 1490 | 1731 | **+241** | fortress |
| Blues | 473 | 573 | +100 | town |
| **Reds** | 654 | 719 | +65 | **town → fortress** |
| **Caravans** | 545 | 595 | +50 | **fortress → town** |
| **Trades** | 445 | 491 | +46 | **camp → town** |
| Homeless | 378 | 392 | +14 | camp |
| Custom | 363 | 363 | 0 | camp |
| Remnants | 1028 | 1003 | -25 | fortress |
| Colorful | 432 | 406 | -26 | camp |
| Volunteers | 331 | 302 | -29 | camp |
| **Anarchists** | 528 | 491 | -37 | **town → camp** |
| Church | 453 | 375 | -78 | town |
| Cartel | 875 | 733 | -142 | fortress |
| Network | 1221 | 1042 | **-179** | fortress |

**3,415 of 9,216 cells change hands — 37.1%. The `[who holds]` record (9/6, 8bf3a91) says
"act3_power run through the same rule moves 37.1% of the valley."** Same number to the
digit, from a sweep written without looking at it. That is the cross-check that this is
reading the rule the game shipped and not a rule of my own.

**THE TWO BIGGEST HOLDERS TRADE 1,171 CELLS WITH EACH OTHER**: Network → Mob 697, Mob →
Network 474. **A third of all the movement in this valley is those two crews swapping the
same ground.**

**FOUR CREWS CHANGE TIER**, and nobody typed any of it.

## THE ANARCHISTS FALL, AND THAT IS THREE SYSTEMS AGREEING
Round two measured that the Anarchists hold **100% of the valley's running water**. Round
seven measured they have **the highest share of their own ground lit of any crew** (8.5%).
And by act 3 they **drop a tier and lose ground**.

Three independent systems keep pointing at the same crew, and his canon still calls them
non-territorial. That is [PENDING Paolo] item 3 and it gets sharper every round.

## AND THE ONE THAT IS THE PAGE
**Of 21 civic blocks — 4 medical, 4 prison, 3 cemetery, 2 courthouse, 2 police station,
2 chapel, 1 fire station, 1 library, 1 jail, 1 radio — NOT ONE changes hands, and every one
is dark in both acts.**

In a valley where 37% of the ground gets a new owner across a century, the courts, the jail,
the prison, the hospital, the cemetery, the police, the fire house, the library, the chapel
and the radio station keep the same landlord the whole way and never get their power back.

Nobody authored it. It falls out of the turf rule and the map generator agreeing, which is
the fifth time this lane has found a fact by asking two shipped systems one question neither
was built to answer.

**And the block he wakes on, 48,48, is Mob fortress ground in act 1 and Mob fortress ground
in act 3.** The valley churns around him and his own corner keeps its landlord.

## THE COOK
`slices/BOHEMIA_THE_ONES_NOBODY_CAME_FOR_9_24_26.html`, registered
`factions-the-ones-nobody-came-for-9-24`.

Not a new monument and not a re-cook of anything he killed: a **roadside authority board**,
which is what a territory sign actually is, and the idea is the **over-stamp** — when 697
blocks change hands nobody prints a new board, they stamp the old one.

- **697 CELLS** — the Network board with MOB stamped across it.
- **THE ANARCHISTS** — TOWN struck out with a pen, CAMP written beside it, water still
  reading normal.
- **THE COURTHOUSE** — a board with no correction on it at all, and a power line that stops
  at the word SINCE.

R1 is satisfied by construction: each frame is an ordinary utility board and the one wrong
thing is the correction on it, or in the third frame the absence of one. R4: night is one
multiply and every board is legible only because a drawn lamp points at it.

## THREE INSTRUMENT FAULTS IN ONE ROUND, ALL THE SAME SHAPE
Every one caught by a negative that could not be true.

1. **`window.POWER` is undefined.** POWER is a bare top-level binding, and a `const`/`let`
   declaration never lands on `window`. The light half read a silent zero against round
   seven's 358 on the same surface.
2. **`POWER.at()` has no `district` key at all** — its keys are live, owner, id, faction,
   ground, free.
3. **`cat(d)` takes a district VALUE, not `(map, x, y)`.** I read its signature off how it
   is *passed* to `districtsOf` rather than how it is *called*. It answered 'sand' for all
   9,216 cells and the civic sweep came back 0 of 21.

> **HOW A FUNCTION IS PASSED IS NOT ITS SIGNATURE.**

The turf numbers were never affected: they cross-check against two shipped measurements
(37.1% and 358 lit) to the digit.

## THREE PICTURE FAULTS, ALL FOUND BY LOOKING
1. **The stamp buried the name it was correcting** — "NE⟦MOB⟧K" — so you could not tell
   what had been replaced, which is the entire point of the frame.
2. **The pen correction was drawn straight on top of the next line of the board.** A
   correction goes *beside* the word it replaces, never under it.
3. **Then the struck word went invisible** against the board when I dimmed it. It sits
   between the live ink and the board face now.

## AND A FAULT THE SIGN REPORTER CANNOT SEE
The three captions were in three flex columns. On a 390px phone that is about **17
monospace characters a line**, so caption two clipped its own words ("They dr / tier ar")
and caption three lost its heading entirely. **Same defect as text running off a sign plate,
one surface over**, and the overflow reporter cannot see it because the sign was never the
thing overflowing. Captions are full width now.

Second round running that this instrument has been shown a blind axis. It catches text too
wide *for a sign plate* and nothing else.

## A FIFTH DEAD STUB, CAUGHT IN THE EDIT THAT WROTE IT
`var col = struck ? K.night('#8d8<garbage>', 1) : ink;` — a variable holding a garbage
string that nothing ever read. Written and deleted in the same round this time, which is
the first time that has happened.

## THE CORRECTION I OWE
Round six's record says **"Eighteen blocks. Not one has power."** directly above a table of
ten kinds that adds up to **21**. Eighteen is the count of the eight kinds I named out loud;
21 is the table. The two numbers are about different things and the record does not say so.

**Same failure as last round, one round later: the table was right and the sentence over it
was not.**

## WHERE HE SEES IT
The **VOTE tab**, in the alpha, behind the gear.

## STILL WAITING
**Four of this lane's items are unvoted** — the night re-cook, the dark institutions, the
last light, and this one. 118 items in the tab, 83 verdicts. The night re-cook has now gone
two rounds without a ruling; **it is not a rejection and the feature is not over**, and the
handoff says plainly what happens if it does come back down.

## RULE 18 AND RULE 22, OBSERVED
No demo cut, no build stamp, no game file touched. One real thing made and registered where
he votes.

## [PENDING Paolo] — NOTHING NEW
Item 3 (Anarchists called non-territorial) is now backed by three independent measurements
rather than two.

## THE THING TO CARRY FORWARD
**How a function is passed is not its signature.** `districtsOf(om, cat)` reads exactly like
`cat` takes a map and a point, and it does not; it takes the value the caller pulls out. I
guessed an accessor three times in one round and every guess returned a plausible, quiet,
completely wrong answer — 'sand' for the whole valley, zero lit cells, zero civic blocks.
**None of them threw.** The only reason any of it was caught is that a previous round had
already measured the same quantity and the new number disagreed.
