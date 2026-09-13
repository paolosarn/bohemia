# WHO WOULD FOLLOW YOU FROM THIS BLOCK
FACTIONS lane · VAMILY row `[who follows]` WHO-WOULD-FOLLOW-YOU-FROM-THIS-BLOCK · 9/13/26

## THE ONE LINE
Forty-six of the sixty-one people on the block you wake on would come with you,
and on the first morning not one of them would follow you. Nobody follows a
stranger. Now the game says so, says what would change it, and when somebody
finally is yours the law that says nobody you keep is lost for good has somebody
to keep.

## AVAILABLE IS NOT WILLING, AND THAT IS THE WHOLE ROW
`[recruit anywhere]` shipped who CAN come and measured it: **46 of 61**. That is a
crowd, not a crew. This asks the harder question of the same people: which of them
has a **reason**.

The row names the three the world is supposed to give — your standing, their debt,
who holds the ground — and every one is a **fact this game already keeps**, not a
score:

| the tie | where it comes from |
|---|---|
| their outfit's ladder | how many times you did what their outfit wanted. His rungs are already an ORDER, so the ranking is his ladder and not my weighting. |
| they saw you | the deed ledger knows who personally watched you do something. A count, no weight. |
| a debt between you | the loan book and the favour ledger. Owing or being owed is a tie either way. |
| who holds the ground | already answered: this reads the list `joinersOn` hands back, so a faction that will not deal with you has emptied the block before anybody is ranked. |

**Nothing is multiplied and nothing is added.** The order is a sort over facts in a
stated order — already yours, then the outfit's ladder, then what they saw, then
what stands between you — which is an ordering a player can be told out loud. A
score would be a number nobody ruled.

## ON THE FIRST MORNING THIS ANSWERS NOBODY, AND THAT IS THE POINT
Measured before a line was written: **0 of 61** people have seen the player do
anything, **0** carry a debt, and the rung with every outfit is `stranger`. So the
card says:

> **WOULD COME WITH YOU** 46 of 61
> **WOULD FOLLOW YOU** NOBODY YET
> *The rest would come. They have no reason to stay. Nobody follows a stranger.*

A list that handed him six names on day one would be lying about the world.

## AND IT REALLY MOVES, THREE WAYS, ON THE REAL SURFACE
    somebody watches you do something   crew 0 -> 1   "THEY WATCHED YOU DO IT"
    do what an outfit wants three times crew 0 -> 16  rung stranger -> useful
    a debt with an outfit               reads 0 -> 1  through the loan book's own writer

**One honest limit, measured and stated rather than faked: both debt ledgers in
this game are keyed by OUTFIT, not by person.** `BohemiaLend`'s book is opened with
a faction id and `BohemiaFavour.owedOf` takes one too. So a person who runs with
nobody has no debt tie available at all, and a debt can deepen a tie but never be
the only one — the people it could reach are exactly the ones `joinersOn` holds
back until you climb their ladder. A per-person debt ledger would change that, and
nobody has built one.

## THE SECOND HALF: THE LAW WAS PROTECTING A LIST OF NOBODY
PEOPLE's `[down not dead]` shipped the promise that nobody you keep is lost for
good, and said in its own file that it held **because there was nobody to lose.**
One round later that was still true. `ctDownMine()` read the family tree and
nothing else, and on the first morning the family tree is empty.

It reads your **company** now — the set `bohemia_company.js` computes from the
ledgers the world already keeps — so the moment anybody becomes yours, through a
bond, a witness, or later the nights you paid under `[take them on]`, they are
covered with nothing to edit and no list to keep.

**Both spellings of an id are asked, on purpose.** The company names people as
`P:city:<id>` and COMBAT's `[downed body]` row has not shipped, so which spelling
it will hand `ctFall` is undecided. Asking both means a companion is covered
whichever arrives, instead of a silent miss nobody would ever see.

Driven end to end: a real deed through the real witness pass → the company names
somebody → knock them down → the card reads

> **THE WATCH IS DOWN** · KNOCKED ABOUT, 7 DAYS
> *Down, not gone. Nobody you keep is lost for good.*

and four hundred days later they are healed, which is the arithmetic and not a
promise.

## THE DEFECT THIS ROW FOUND IN A SHIPPED ONE
`ctCompanySnapshot` called `BohemiaStanding.becauseOf(minds, '@', '@', ...)`.
`becauseOf` is a **faction-shaped** answer — its first line is
`if (factionOfOwner(m.owner) !== faction) continue;` — so passing `'@'` as the
faction asks for witnesses whose *outfit* is `'@'`, and nobody's outfit is `'@'`.
**Every mind was skipped, every time.** One of the company module's two naming
ledgers had never named anybody on the walked surface, and an empty company reads
exactly like *you have nobody*, which is the ambiguity that row exists to end.

The company's question is person-shaped, so the seam walks the minds it already
has. **And it does not ask what the deed was worth**: `becauseOf` weighs each deed
and drops the weightless ones, and not one of the five kinds this surface
publishes has a weight yet (`[deeds weigh]`, open in this lane). Whether they saw
you is a fact; what it did to them is a weight, and weights are his. Eyewitness
only — `hops > 0` is a retelling, and somebody who heard about you in a bar is not
one of yours.

## TWO MISTAKES OF MY OWN, BOTH CAUGHT BY MEASURING
**A missing function answered a confident zero.** `ctOwedWith` called
`ctOwingRows()`, which does not exist — the one that reads the loan book is
`loanRows()` — and the bare catch around it turned that into *every outfit in the
valley is square with you*. Same class as the swallowed TypeError that cost this
lane thirteen days on `ctFactionOf`. It says so once, in a sentence, now.

**A probe that could not see witnesses.** `BARK_DREW` came back empty after every
`render()` in the workshop, which would have made every witness claim pass for the
wrong reason. `peoplePass` returns immediately while the player's own body has not
loaded, and in a headless workshop load it never does. The demo goes through the
front splash, which is where the body arrives, so the witness half of the gate
runs there and the gate says why in its own comment.

## GATES
`faction_towns_gate` **201/0**, up from 170 — extended, not duplicated. Thirty-one
new claims, ten of them driving the real surface: a tie is required, one tie of any
of the three is enough, a bottom rung is not a tie, the order is a sort and not a
score, the rung arrives as an index so this file holds no copy of his ladder,
somebody already yours leads, nothing is stored, the cap is a rendering bound, the
city reads the list `[recruit anywhere]` builds, the ladder and the debt are asked
once per outfit, what they saw is counted and never weighed, the debt ledgers are
keyed by outfit and the code says so, a missing dependency speaks instead of
answering zero, the down state reads the company, both id spellings are asked, one
naming body serves both cards, and the company's witness ledger can name somebody
at last.

Green alongside: engine sync zero drift, bundle, banner, turf, demo build, alpha
loads.

## [PENDING Paolo] — NOTHING NEW
Nothing here needed a ruling. The ladder is his, the trades are the world's own
words, the price of taking somebody on is `[take them on]`'s and is already ruled,
and what a deed is worth stays his.
