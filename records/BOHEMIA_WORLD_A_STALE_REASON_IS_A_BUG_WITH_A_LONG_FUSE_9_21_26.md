# A STALE REASON IS A BUG WITH A LONG FUSE (9/21/26, WORLD lane)

Board row **[visible change] / WHAT-AN-ASK-IS-ALLOWED-TO-MOVE**, and rule 22
(COOK EVERY ROUND). **Nothing shipped to a play surface** — rule 18 still holds
this lane off the alpha and the demo; the cook went to the VOTE tab.

---

## 1. RULE 12 FIRST, AND THE ROW'S PREMISE WAS ALREADY BUILT

The row asks for "the list of things a generated ask may change, and every one of
them has to be something a player can already SEE happen."

**The list already exists.** QUESTS shipped it on 9/6 inside
`engine/bohemia_asks.js` as `CHANGES` — six rows, and they are the six rows the
board row names, down to "a rumour about you turning":

```
block_changes_hands   wired    engine/bohemia_engine.js   :: this.owner.set(d, id)
light_comes_back      wired    engine/bohemia_brownout.js :: circuits
shelf_refills         wired    engine/bohemia_economy.js  :: stocks
rumour_turns          wired    engine/bohemia_standing.js :: gossip
debt_moves            UNWIRED
person_moves_house    UNWIRED
```

Writing the list again would have shipped a second list that drifts from the
first the day either one changes. **What is missing is not the list. It is that
nothing checks it.**

## 2. *** AND HERE IS THE PROOF THAT NOTHING CHECKS IT, AND IT IS THIS LANE'S OWN DEBT ***

The two unwired rows each carry a typed sentence saying why. One of them says:

> **debt_moves** — "belonging models debt as a faction WANT, not a balance with a
> name on it that anybody can clear"

**That sentence was true on 9/6 and WORLD made it false on 9/13.**
`engine/bohemia_lend.js` ships `take()` (a named lender hands you batteries),
`paid()` (the balance comes down and the row is deleted at zero) and `short()`
(you miss and the street finds out). A balance, with a name on it, that anybody
can clear. `[debt carried]` put the lender's name on it the same week.

Nobody told the list. **Nobody could have: the reason is a string.** A string
cannot notice the world moved underneath it, and a list of what a quest is
allowed to do is the worst possible place for a fact that can quietly go out of
date, because the cost is a real quest refusing to be generated for eight rounds.

## 3. THE FIX, AND IT IS THE MECHANISM NOT THE CORRECTION

`engine/bohemia_watch.js` holds the two things the list cannot hold itself.

**A WATCHER** for every change: where a player sees it, named as a surface and a
symbol on that surface, plus the **text a player reads**. A change nobody can
watch is filler with a ledger entry, which is the sentence the board row is made
of.

**A PROMOTION TEST** for every unwired change: the check that would make it
wired, **written as a predicate over the live modules rather than a sentence
about them.** Run it and a row that has quietly become buildable says so, by
itself, forever, without anybody remembering to look.

```
stale(CHANGES)  ->  [{ id: 'debt_moves',
                       said:  'belonging models debt as a faction WANT...',
                       found: 'bohemia_lend take/paid/owingRows: a named debt
                               was taken and cleared to nothing' }]
```

The test is **driven, not read**: it takes a debt in a real book and clears it to
nothing before it says anything.

**THE LIST STAYS QUESTS'.** One system, one session. This module keeps no copy,
reaches for the asks module nowhere in its code, and takes the list as an
argument every time. Hand it a seventh row and it reports the seventh row rather
than skipping it, because a checker that quietly ignores what it does not
recognise checks nothing.

## 4. THE WORDS MOVE, ON THE REAL SURFACE

A symbol existing in a file is not a player watching something happen. So the
gate boots the walked city, reads **the nightfall card as words**, runs one night
through the game's own `blockRent` and `nightPower`, and reads it again.

```
BEFORE  DAY 2 NIGHTFALL ... BATTERIES IN THE VALLEY: 3352 ... Mob ground ...

AFTER   DAY 2 NIGHTFALL ... WHO YOU OWE  MOB: 1 nights unpaid ...
        Mob (fortress) wanted 1 for the 1 block of theirs you used and you had 0
        so the Mob cut 1 of their own street off
```

A debt arrives in the words. A light going out arrives in the words, **in a
sentence**. Words do not repaint on their own, which is why they are the reading
and a screen diff is not (QUESTS' own rule 14h finding: a diff reads false life
**and** false death).

**Two controls make it mean something.** Read the card twice with nothing changed
and the words are identical. And douse a wire **outside** the night and nothing
moves — which is **correct**, because the card is a record of the night, not a
readout of the grid, and a light going out with no bill behind it is not an event.

## 5. *** MY INSTRUMENT WAS WRONG THREE TIMES AND THE GAME WAS RIGHT EVERY TIME ***

The first cut of that section reported four reds. **Three of them were mine.**

1. It ran the night first and then doused a circuit by hand, and was one sentence
   from reporting **"putting a circuit out does not move the words."** It does.
   What does not move the words is dousing outside the night, and that is the
   game being right.
2. It asserted every doused circuit comes back, on a run where the night had
   legitimately put a second one out.
3. It compared a faction name to `turfGrid().at()`, which returns a whole row,
   and printed `[object Object]`.

And the fourth: a check that the module "never requires the asks module" went red
on **the module's own header**, which spends a paragraph explaining that the list
is QUESTS'. That is the same self-defeating ruler this lane shipped last round on
a reference check. **A ruler that cannot tell a citation from a disclaimer
measures nothing.** It now strips comments and looks for a real reach in code.

Four reds, three of them my instrument, one of them my ruler, none of them the
game. **Never report a break you have not reproduced** (rule 14g) is not a slogan
about other lanes.

## 6. THE COOK: YOU PAID IT

Rule 22 — a making lane ends every round with a real thing. A bill you can never
answer is half a machine, and the half it was missing is the half you can
**watch**. So `debt_moves` gets its other end: `BohemiaNotice.cleared()`.

```
CLARK COUNTY POWER DISTRICT
NOTICE OF PAYMENT IN FULL

ACCOUNT: FEEDER 24 / SERVICE ADDRESS FREEWAY 75-5
RECEIVED: DAY 4 AT 09:20

AMOUNT RECEIVED ...... 2 BATTERIES BY MOB
BALANCE REMAINING .... 0 BATTERIES

SERVICE TO THIS ADDRESS IS RESTORED.
THANK YOU.
KEEP THIS NOTICE FOR YOUR RECORDS IN THE EVENT OF A DISPUTE.
```

**The zero is stated, not implied**, because a bill that just stops arriving is
not a receipt. And the receipt **refuses to issue** while anything is still owed
— a document saying PAID IN FULL over a remainder is the card that promises and
does nothing, printed on letterhead, which rule 14(d) calls the worst bug in the
game.

The horror is the same horror and it cost nothing again: **it thanks you, and it
tells you to keep it in case of a dispute** — with the office the last record
measured nobody in. The text never says so.

## 7. WHAT IS STILL HONESTLY OUT

`person_moves_house`: "nothing in the repo moves a person from one home to
another." **Re-measured, not inherited, and still true.** A person's home is a
derived field of the seed in `bohemia_population.personFields`; nothing
reassigns it. Its promotion test is now written down and will fire the day
somebody builds it. It is the one change on the list with no watcher, and the
gate names it every run.

## 8. THE GATES

```
VISIBLE CHANGE   26 / 0   driven on the walked city, with a control both ways
FIRST NOTICE     48 / 0   was 41; the closing notice added seven
```

Red two ways each, proved rather than claimed: remove the promotion test and the
stale fuse goes dark (2 red); claim a watcher that is not on the surface (2 red);
type the amount instead of reading his table (1); say PAID IN FULL over a
remainder (1).

## 9. WHERE HE FINDS IT

**Tab: VOTE, in the alpha.** Three rows now, all this lane's: THE FIRST NOTICE,
WHO SENDS THE NOTICE, and **YOU PAID IT**. The page is generated from the
modules, and the gate re-runs the generator and fails on drift.

## 10. ROUTED

**TO QUESTS**, and it is the only thing this round asks of anybody: `debt_moves`
is buildable now, and the evidence is in `BohemiaWatch.stale()` where your gate
can read it. The row's stated reason is nine days stale. This lane did not edit
your list — one system, one session.

**TO PEOPLE**: `person_moves_house` needs somebody to be able to move, and the
promotion test that would notice is written.

**STILL OPEN, carried:** the night card's `BATTERIES IN THE VALLEY: 0` on the
first night and its invented drift on the second. Fix written down, waiting for
the hold to lift.
