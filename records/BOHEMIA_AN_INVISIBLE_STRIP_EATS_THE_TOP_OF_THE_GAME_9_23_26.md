# AN 87-PIXEL STRIP ACROSS THE TOP OF THE GAME EATS EVERY FINGER
# and none of the seven controls was ever dead
# LIFE + CITY, 9/23/26, row [eyes: half a hud] — STILL CLAIMED

---

## 1. THE ANSWER, FIRST

**NONE OF THE SEVEN CONTROLS EYES REPORTED IS DEAD.** Measured on the alpha with the
presses finally landing where they belong:

    SCAVENGE    #workbtn   ALIVE   opens the plot panel ("SUBURB · plot")
    BUILD HERE  #buildbtn  ALIVE   opens a card 752 px tall
    STANDING    #rungbtn   opens its card on a direct click
    RAY, DENISE, MARCO, Marry     their ids appear INSIDE that card

**AND THERE IS A REAL BUG, WORSE THAN A DEAD BUTTON:** an invisible-to-reason,
87-pixel, full-width strip across the top of the walked game takes every finger.

    the city frame   [0, 42, 390, 802]
    #openInvite      [0, 109, 390, 87]      position:absolute, top:0, z-index:39
    the card's X     frame y 74..118        DIRECTLY UNDERNEATH IT

`#openInvite` is the OPENING OVERLAY's invitation: *"DAY 1 BEGINS BEFORE THE DAY /
The family, the table, ten years ago."* with two real buttons, WATCH and NOT NOW. It
lives in the **parent document**, so the card's own `z-index:40` cannot win — an
iframe's internal stacking never beats its parent's.

**THIS IS WHY IT PASSED EVERY CHECK THAT WAS NOT A FINGER.** `el.click()` reaches the
X directly and closes the card instantly, every time. Only a real finger goes through
the parent first. Paolo is on a phone, so Paolo is the one who finds it.

## 2. IT IS PAOLO'S OWN 8/24 BUG, STILL ALIVE

> "When I press standing, and I press close, it doesn't close."

Measured, one card, three ways:

    a DOM click on the X        on / 752px  ->  CLOSED, 0px
    a real finger on the X      on / 752px  ->  on / 752px
    a real finger outside it    on / 752px  ->  on / 752px

The X is 44x44, display flex, pointer-events auto, and `elementFromPoint` at its own
centre returns **the X itself**. Nothing covers it *inside the frame*. The cover is
one document up.

## 3. SIX WRONG INSTRUMENTS, MINE, IN ORDER

| it said | it was actually doing |
|---|---|
| two ALIVE | measuring the stale **baked demo** |
| SCAVENGE ALIVE | a **teaching ring** that opens on any tap |
| all three dead | clicking **#loadgl**, through the loading screen |
| all seven NOT ON SCREEN | sitting on the **VOTE landing** |
| three dead, finger "on the control" | **frame coordinates clicked on the page** |
| "the close answers a mouse, not a finger" | a **wrong diagnosis**; the fix changed nothing and is reverted |

**EVERY ONE IS A NUMBER MEASURED IN ONE PLACE AND USED IN ANOTHER.** Each was caught
by the next cheap check, never by being clever. What saved the row each time was
refusing to report a number I could not explain — a false *"three core verbs are
dead"* never went out to the fleet.

**AND THE SIXTH IS THE ONE THAT MATTERS MOST**, because I shipped it to my session
branch and reverted it: I bound the close to `pointerup`, the glass still said
`on / 752px`, and only then did I spy on the events and find that **nothing arrives at
all**. A close cannot fail to answer an event it never receives.

## 4. THIRD TIME THIS ROUND, AND IT IS THE SHAPE OF THIS CODEBASE'S WORST BUG

`#loadgl` over the game. The VOTE landing over the game. Now `#openInvite` over the
game. And the ancestor: the day card that sat over all eight direction buttons and
made **544 presses move him zero cells**.

**SOMETHING INVISIBLE LYING OVER A CONTROL** is not a coincidence any more. It
deserves a standing machine check — for every control the game offers, does a real
finger at its centre reach *it*, in the top document, or something else? — rather than
being rediscovered by hand every time.

## 5. WHAT I DID NOT DO, AND WHY

**I did not patch `#openInvite`.** It is the opening overlay in the alpha shell and it
has its own two buttons; `pointer-events:none` would kill WATCH and NOT NOW. ONE
SYSTEM, ONE SESSION, and rule 10 says lanes do not add jobs. Dodging it from inside my
own file — moving the X out of the band — would leave the whole top strip of the
walked surface dead to a thumb and **hide the bug instead of fixing it**.

Measured, named to the element, and routed. The row stays CLAIMED.

## 6. FOR WHOEVER OWNS THE OPENING OVERLAY

The banner is `display:none` in its inline style and was **block** when measured, so
something shows it and nothing hides it again. Two things are true at once and both
need a decision that is not mine: it should not outlive its moment, and while it is up
it should not take presses meant for the game underneath it.
