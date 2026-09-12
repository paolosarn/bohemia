# THE LENDER VISITS THE HEIR
FACTIONS lane · VAMILY row `[collector heir]` THE-LENDER-VISITS-THE-HEIR · 9/12/26

## THE ONE LINE
The first thing the heir reads on their first morning is that somebody their
parent went short with is at the door. They are not asking the heir for money.
They are just there.

## TWO LIVE BOARD ROWS CONTRADICT EACH OTHER, AND THE SHIPPED CODE SETTLES IT
The row says it needs WORLD's `[debt carried]`, which says every debt **"survives
the generation fold to the heir IN FULL."**

`engine/bohemia_fold.js`, shipped 9/7 and marked `ruled: true` off the DYNASTY
study, says the opposite and says why:

> *"a child is not personally liable for a parent's unsecured debts... **YOU DO NOT
> INHERIT A BILL, YOU INHERIT LESS AND YOU INHERIT THE PEOPLE HE OWED, still
> standing there.** That is a standing-web query, not a purse line."*

**That sentence is this row.** The balance dies; the creditor does not. So nothing
crosses the fold as an amount, and what arrives is somebody at the door. This build
follows the ruling that has a machine gate behind it. The contradiction itself is
canon-level and goes to Paolo.

## THE NAMED BLOCKER WAS NOT THE BLOCKER
`[debt carried]` is still open, and so is WORLD's `[someone lends]`, whose own first
line says: *"Nothing in the game ever lends anybody anything, so the enforcement
machine has never had a debt to enforce."*

True, and it does not block this. **There is exactly one way to owe a faction in
this game today and this lane shipped it last round:** rent you could not pay. A
collector built on anything else would be a pipe with no water. **Fifth row running
where the named blocker was not what stood in the way.**

## WHAT IS KEPT IS A COUNT OF NIGHTS, NEVER A BALANCE
How many times a faction was stiffed is a **fact**. What a night of unpaid rent is
**worth** is a weight, and weights are his. So the book holds a name, a count and
the last day, and nothing here touches standing — the same refusal `[block rent]`
made one round earlier, for the same reason.

It rides its own save key beside the doused set. Being owed is not an edit to the
world, and folding it into the build delta would mean a valley reset quietly
forgave everybody.

## DRIVEN END TO END ON THE WALKED SURFACE AND THE DEMO
    1  nobody owed at the start, no visit due
    2  walked 80 cells with an empty purse, then the real nightfall bill:
         Mob 16 billed / 0 paid, Church 3/0, Cartel 2/0, Blues 2/0, Colorful 1/0
         the book: five factions, one night each
    3  no visit while the parent is alive
    4  the fold: generation 1 -> 2
    5  the heir's first morning, at the top of the card:

           DAY 1
           06:00 · light until 22:00
           SOMEBODY IS AT THE DOOR AND THEY ARE NOT HERE FOR YOU
           BLUES. YOUR FATHER WENT A NIGHT WITHOUT PAYING THEM. THEY REMEMBER
           THE DEBT DIED WITH HIM. THEY DID NOT

    6  the second morning is quiet
    7  no inherited bill anywhere in the purse

Identical on the demo. No page errors on either.

## THE MISTAKE THAT TOOK THREE GOES, AND IT IS THE SAME MISTAKE EACH TIME
Built as its own card, the collector was **drawn, counted, and never seen.** First
it was computed before the phone offer and buried by it. Moved after the offer, it
was buried by the `showChoice` on the next line. Moved to what I thought was the end
of the morning, it turned out I had edited the end of a different function.

The morning is **one card**: `showWake` builds its whole HTML and ends by calling
`cardShow` with it. So the collector belongs at the top of that HTML, which is also
exactly what the row asks for — *the first line the heir hears*. One card, not two
stacked. **Shown, counted and never seen is the same as not built**, and a counter
that goes up is not proof that anybody saw it.

The card function that was left behind by that change has been deleted rather than
left sitting with no caller.

## IT ASKS FOR NOTHING, DELIBERATELY
What a collector **wants** is a price, and prices are his. They came, they said what
it was about, and they are standing there. Not one number appears in any of the
three lines, which the gate checks — a collector who named a sum would be collecting
a bill the game has already ruled the heir does not owe.

## GATES
`faction_towns_gate` 95/0, up from 81 — extended, not duplicated. Fourteen new
claims: an empty book is a real answer, worst first with the tie breaking on the
more recent night before the name, zero nights is not owed, the collector knows how
many others there are, the words are attempts, one night reads differently from
many, **not one number is collected and the shipped fold is quoted as the reason**,
what crosses is a name and a count, the book is written where rent goes short, it
rides its own save key, the fold records which generation it belongs to, it is the
first thing on the heir's card and above the phone offer, once per generation, and
nothing touches standing.

Green alongside: turf 43/0, engine sync zero drift, demo build 25/0, alpha loads 20/0.

## [PENDING Paolo] — ONE, AND IT IS A REAL CONTRADICTION
**Does a debt cross the fold?** `engine/bohemia_fold.js` says it dies and is marked
ruled. WORLD's `[debt carried]` row says it survives in full. Both are live. I built
the shipped ruling because it is the one with a gate behind it, and because its
other half — *you inherit the people he owed* — is a better mechanic than a number
following a child around. But two live sources disagreeing is a bug in the canon,
not an interpretation, and which one stands is his.
