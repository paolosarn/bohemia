# THE JOB SAYS WHAT IT PAYS, AND YOU CAN ARGUE ABOUT IT
## VAMILY round 27, QUESTS lane, row [haggling works] BB-ASK-FOR-MORE
### 9/11/26, chat 19 QUESTS (held by the DYNASTY chat, dynasty-vamily-w4yxiz)

---

## THE ROW, RE-MEASURED BEFORE A LINE WAS WRITTEN

> Measured: zero hits for haggle, negotiate-a-fee, counter-offer, advance or
> retainer anywhere in the walked city. A job here has no price and no terms.

Still true. Zero hits for counter-offer, retainer or advance pay. The three
"haggle" hits in the alpha are an **animation clip name**, a gesture in the
movement library, nothing to do with money.

## *** THE FIRST HALF OF THIS ROW IS NOT THE HAGGLE. IT IS THE DISCLOSURE. ***

The wake card says the title. It says nobody has picked it up yet. Since 9/7 it
says how long the walk is.

**It has never said what the job pays.**

You cannot ask for more of a thing you were never told about, so the pay line
lands before the asking does. The study this row came from names it in the same
breath as the haggle: "a job saying what it pays before you take it."

And it is on the same side of the decision as the distance, for the reason the
reach row learned the hard way: **terms you find out after you agreed are not
terms.**

The card reads what the quest's own COMPLETE endings pay, and answers honestly in
three ways rather than guessing:

- every ending pays the same one: **"Pays one battery"**
- the endings pay different ones: **"Pays one, and which one depends on how you
  do it"** (which is true, and is the residual right the player already has)
- nothing pays: **"Pays nothing. They said so up front"**

## THE SHAPE, AND WHY IT IS NOT THE SHAPE OF THE GAME WE STUDIED

The campaign game he named: every haggle adds a random 3 to 6 to a hidden
ANNOYANCE counter, and at 9 you are thrown out with a reputation hit. Safe once,
risky twice, nearly impossible three times.

**That shape is the thing worth taking. Those numbers are not ours.** Our own
study said so in its own words: "it needs no balance number under EVERYTHING
COSTS ONE."

So there is no annoyance counter in this build and no threshold:

- **The counter is how many times you opened your mouth.** That is not a balance
  number, it is a fact about the conversation, and the player can count it
  themselves.
- **The room is the size of the menu.** There are exactly two things to ask for, so
  two asks land and the third can only be repeating yourself at somebody who has
  already said yes twice.
- **It is deliberate, not random.** You are told, out loud, before the ask that
  would cost you. A hidden roll would mean the player can never know where they
  stand, and this valley already refuses that: a claim is checked by going and
  looking, never by a roll. Deterministic is a real difference from the game we
  studied and it is the house style winning, not an oversight.

## WHAT YOU CAN ASK FOR, AND WHY IT IS NEVER "MORE"

EVERYTHING COSTS ONE. A job pays one. So "ask for more" cannot mean two without
breaking the one locked number in the economy.

**It means the shape of the one**, which is what the study found on the other
side: "PAYMENT SHAPES: more overall, all-on-completion, or per head returned."

1. **A DIFFERENT ONE.** The job pays one battery; you ask for one bag instead.
   Still one. Real, because the three are not interchangeable: you cannot eat a
   battery, and a battery will not buy you what people say about you.
2. **UP FRONT.** The same one, now, instead of at the end. A real trade and not a
   bonus, per the study: you walk away afterwards holding their thing, and that is
   what walking away costs.

At most three asks on any offer and the room is two, so you can change the
currency AND take it up front, but you cannot change it twice.

## THE STANDING MARK IS NOT A NUMBER EITHER

The row asks for a haggle that "leaves a standing mark." It would be easy and
wrong to debit a clout.

In this valley work passes hand to hand, and the study says what the enforcement
actually is: *"it's unlikely either will do business with the other in the future
-- reputation and repeat trade ARE the contract."*

So pushing too far **withdraws the offer**, and the mark is a real deed row handed
to the deed ledger that already exists, witnessed by whoever is standing there,
carrying a clout tag the deed system already grades. No new standing system, no
invented debit, and the feed reads it like every other thing you did.

**And a withdrawn offer is really gone**: accepting it is refused in code, not
just described on a card. That is the whole cost of pushing. There is no job.

## THE BUG I MADE, AND THE CHECK THAT CATCHES IT

`showWake()` re-rings the offer every time it draws the card, and an ask redraws
the card. So opening fresh terms inside `offerRing()` **wiped the ask the moment
it was made**. He would have pressed a button that did nothing, forever, and every
headless test would have passed because the module was fine.

The terms are now keyed on the day and the job, so the same offer keeps the same
conversation and a new day opens a fresh one. The gate drives the real button on
the real surface, then forces a redraw, and demands the ask still be there.

A second one caught by the gate: the card showed the settled line straight away,
so on a morning nobody had said a word it read "One battery" instead of "Pays one
battery" - a statement of terms dressed as a disclosure. The disclosure comes
first and the terms replace it only once they have actually moved.

## THE GATE, AND FOUR NEGATIVE CONTROLS

`gates/ask_for_more_gate.js`, **43 passed, 0 failed**, registered in the suite
the same round the file was written.

It walks **every reachable sequence of asks across all 42 quests, 12,837 states**,
and checks that every settlement it can reach is exactly one unit of exactly one of
his three currencies. Not by reading the code and believing it.

Every mutation was caught:

| mutation | caught by |
|---|---|
| smuggle a threshold (`ANNOYANCE_CAP = 9`) | 1a, 1b |
| make the third ask cost nothing | 2b, 4c, 4d |
| make a settlement pay two | 2a (5,130 bad states), 3e |
| break the redraw survival | 8a, R9, R10 |

And one check had to be fixed because it was wrong about an honest file: it looked
for a sentence that a comment rewrap had split across two lines. The gate now reads
the file's prose unwrapped, so a claim about what a file says cannot break because
somebody wrapped it at eighty columns.

## RULE 7: IN THE WALKED SURFACE AND IN THE DEMO

The module ships inlined verbatim in the city, the pay line and the asks are in
the text of the card the player is looking at (checked on the glass, not as a
variable that exists), pressing an ask on the real surface moves the terms,
pushing past the warning takes the job away, and the purse honours what was agreed
at payday. **No ask, no override**: a quest nobody argued over pays exactly what
its own pay line says.

Build stamp: **BUILD 9/11p - THE JOB SAYS WHAT IT PAYS**.

## WHAT IS STILL HIS

Every line of words is `draft:true` and the module names nobody. Who gets angry at
what is contents and it is his. The amounts are one because one is the locked
placeholder, and the moment he tunes them this file follows.

