# FIVE HUNDRED PRESSES AND HE NEVER MOVED (RUN, 9/21/26)

VAMILY `[no pop ups]` / NOTHING-POPS-UP-WHEN-THE-DEMO-STARTS. Rule 19a, rule 19e.

> **PAOLO 9/20, LOCKED, twice in a row:** *"I start the demo and a bunch of shit
> pops up on the screen. What the fuck is that?"*
> And on the **second frame of the game**, the SNATCHER road card: *"you don't got
> quests like that for real... it can't just be these bullshit-ass text prompts."*

## THE MEASUREMENT IS WORSE THAN THE COMPLAINT

Served demo, phone profile, five minutes, the cards deliberately **not** cleared
because a stranger has no harness to clear them. Nothing tapped but the pad.

    ONE card opened by itself, at 2.5 SECONDS.
    IT NEVER WENT AWAY.
    544 presses on the pad over five minutes moved him ZERO CELLS.

**The demo was unplayable from the first frame.** Not "a card is annoying": the
first thing the game does sits on top of the only control the game has, so the
pad he is pressing is not a pad, it is a picture behind a sheet of glass.

And this is not new information in the building. It is the `#daycard` `inset:0`
bug **PLUMBER has carried on this lane's own row for three rounds running** --
"it sits over all eight direction buttons on boot, so time to first play cannot be
measured on either surface." It was read as an instrument problem. It was the game.

## THE RULE IS AT THE DOOR, NOT IN THE EIGHT CALLERS

Every panel in this game comes through one function, `cardShow`. So that is where
"nothing pops up" can be true for callers that do not exist yet.

**A card opens only if its caller says WHY.** Not a boolean, a sentence, because a
boolean lets the next lane write `true` and move on:

    'he pressed MARKET'
    'he pressed STANDING'
    'he pressed the feedback door'
    'the game has ended, there is no play left to interrupt'

Anything else is refused, counted and kept in `CARDS_REFUSED`, so a refusal can
never be swallowed. This file has been bitten three times by a rule every future
caller had to remember. A rule the machine holds is the only kind that lasts.

## THE FOUR THAT STOPPED, AND WHERE THEIR WORDS WENT

**THE MORNING.** No card. The same `h`, built by the same code, goes to **the phone**
and the chip rings: 10 lines, under THIS MORNING. Rule 19a says the bookkeeping
*lives on the phone he opens*, not that it disappears. The offer's yes is untouched
because it never lived on that card -- `offerRing` puts the job on the phone and
`offerAccept` is the one door, which the card's own comment says in capitals.
What the GET UP tap used to do -- the morning's sound, the vista beat -- happens
where the card used to be, because there is no press left to hang it on. Dropping
those with the card would have been a feature quietly deleted by a fix.

**THE NIGHT.** No card, and this is the one a careless fix breaks: **SLEEP was the
rollover**, not only a button. The upkeep sweep, the day turning and the demo's
ending all hung off that one press. The night now turns by itself. Measured: day
1 -> 2 with no card to dismiss. *A card with one button on it is a choice pretending
it is not* -- this file's own sentence, written for the road card, and just as true
here.

**THE ROAD DIRECTOR.** A moment with no body on screen **does not fire at all**, and
that had to be decided before anything was spent. The old order charged the minutes
and took the salvage FIRST and opened the card second, so merely refusing the card
would have left him paying ten minutes of his day for a thing that never happened --
a worse bug than the card, and a silent one. A forced contact still starts a real
fight with real bodies, which is exactly what the law says a moment must have.

**THE TABLES STAY.** `ROAD_WORDS`, `ROAD_CHOICES`, `ROAD_COST` and `roadCard` are not
deleted and not emptied. Rule 19e: they are content waiting for bodies to say them.
The graveyard is for shapes he killed; this is a shape waiting for a mouth.

## THE ONE FORCED CARD I KEPT, AND THE TRADE NAMED

**The ending.** Rule 19a kills three by name -- the wake, the night and the road card
-- and those are gone. The ending is a different animal: it is the game FINISHING.
Nothing is interrupted because there is no play left to interrupt, and the
destination the law gives the others (the phone, the thing he opens *while playing*)
does not exist after the last day. Killing it would delete the peak-end ending with
nowhere to put it, which is the deletion the law is against. It names itself in the
gate output rather than sneaking through.

## THE NUMBERS

`74ce272a` against this tree, the same five minutes, the same presses:

                                        BEFORE        AFTER
    cards that opened by themselves     1             *** 0 ***
    of those, still on screen at 5:00   1             0
    CELLS HE COVERED                    *** 0 ***     52
    the morning's words                 on a card     10 lines on the phone
    the day turns without a button      no (1 -> 1)   yes (1 -> 2)

**AND 52 IS NOT A GOOD NUMBER EITHER, SO I AM NOT SELLING IT AS ONE.** This walk
presses EAST and only east, and east of his door is the sealed yard this lane
already handed over: a wall one cell thick with no way round inside a lot. The walk
that goes *around* the block covers 685 cells in 45 presses. What 0 -> 52 proves is
that his presses reach the world at all, which they did not before. What it does
not prove is that his block is walkable, and that is still somebody's job and not
mine.

## THE GATE

`gates/nothing_pops_up_gate.js`, in the suite as **NOTHING POPS UP**, **15 passed 0
failed**. Five real minutes on the served demo, cards not cleared, every press a
real touch on the pad's own wedge.

It holds the rule and not the four callers: zero cards he did not tap for, nothing
on screen at the end, **the pad moves him**, every card that may open names why,
the morning is on the phone, the chip rings, the phone really renders it, the day
still turns, and the demo's last night still ends.

**MUTATION: main IS the mutant** -- `74ce272a` scores **4 passed / 11 failed**,
including the zero cells.

## TWO THINGS THE GATE GOT WRONG FIRST, BOTH WRITTEN DOWN

1. **It demanded day 2 from the demo.** The demo ends after day one, on purpose, and
   has since `__THE_ENDING__` was built. The gate was wrong about the game. It now
   asks the ROLLOVER whether it rolls and the DEMO whether it ends -- two rules, two
   questions, and neither of them is "the number went up".
2. **Its reason counter only matched a one-line call** and reported 2 of 5 on a
   correct tree. A checker that is wrong in the safe direction is still a checker
   that lies.

---

# AND THE OTHER HALF, BECAUSE HE SAID IT A THIRD TIME

> **PAOLO 9/21:** *"I told you what's up with all these fucked up quest cards that
> don't do anything when I click on them."*

Killing the cards that open by themselves is not the same question as: **of the
cards he can still reach, does every row DO something when he presses it?**

Measured with real touches, every row of every reachable card, at each row's own
measured centre: **19 rows.** Judged on three outcomes, never on "something
changed", because rule 14(h) says a dead button and a close button look identical
when a card closes on any tap it does not recognise.

    MOVED    still open, and its own words or its own markup changed   -> alive
    CLOSED   it went away                    -> alive only on a close row
    NOTHING  open and identical              -> DEAD

## MY INSTRUMENT LIED TWICE BEFORE IT TOLD THE TRUTH ONCE

**First cut: 12 dead of 19.** Nine of those twelve were the feedback card's answer
rows, and they were fine. A thumb on a vote row answers by **going lit** -- a class,
not a sentence -- and I was comparing text. A text-only diff calls a working control
dead, which is rule 14(h)'s lie pointing the other way. Reading the whole markup
instead: **3 dead.**

**Second cut: the ENDING's close was still reported dead, and it is not.** An
isolated probe closed it with the same touch, first try, with the click landing on
the right element carrying the right `data-act`. Proved both ways: all four cards in
one page -> DEAD; **the ending alone in its own page -> CLOSED**. The ten feedback
presses before it were leaving something behind.

**A card is not isolated by rebuilding the card. It is isolated by a fresh page.**
The tool gives each card its own boot now. Four boots is the price of a verdict that
does not accuse a working control, and *"the instrument that reproduces cleanly is
the witness"* is only worth anything if the instrument is built to reproduce cleanly.

## THE ONE REAL DEAD PRESS, AND IT WAS THE MARKET

**He has ZERO batteries.** Food and meds cost one each. So pressing FOOD ran the
whole buy, came back `CANNOT_AFFORD`, redrew the card -- **and the card said exactly
the sentence it was already saying.** Nothing moved. From his side that is a dead
button, and rule 14(d) calls a card that promises and does nothing the worst bug in
the game.

**THE FIX IS THIS FILE'S OWN IDIOM, NOT A NEW ONE.** The offer's yes already does
exactly this: *"Drawn always, pressable only when there is something to take, and
with no data-act when there is not, so a tap cannot reach the dispatcher."* A row he
cannot buy keeps its place and its price, so nothing shifts under his finger, loses
its `data-act`, and says what is missing -- **"you have no batteries, this is one
battery"** -- instead of waiting to be pressed and then saying nothing.

## THE FINAL SWEEP

    ROWS PRESSED: 16    ALIVE: 16    DEAD: 0

    MARKET    2 rows, both closes (the three shelf rows are no longer presses)
    STANDING  2 rows, both closes
    FEEDBACK  11 rows, nine light up, one sends, one closes
    ENDING    1 row, and it closes

**12 -> 3 -> 1 -> 0, and three of those four numbers were my own instrument.**
