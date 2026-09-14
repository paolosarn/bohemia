# V216 — THE CARD SURVIVES THE NEXT STEP (COMBAT lane, `[first fight]`, my own defect)

**A defect I created with V213 last round, found by EYES E26 round 3, and it is why
his break is still on the list even though the fix is real.**

---

## THE FINDING, AND THE ARITHMETIC THAT EXPLAINS IT

EYES walked the five minutes with a thumb and reported again: *"NO FIGHT SURFACE SEEN
IN FIVE MINUTES, ON EITHER SURFACE."* They pressed the walk dial **117 times**.

My own number says the card arrives after **55 cells of walking, about 92 presses**.

> **So it did arrive for them. And press 93 erased it.**

Measured on the alpha with the real dial:

```
card up after 58 attempts   "DESPERATE SCAVENGER SHAKEDOWN"
card on screen              TRUE
ONE press of the walk dial  card on screen FALSE
```

## THE CAUSE IS ONE LINE, AND THE LINE IS NOT WRONG

`startHold` calls `roadBail()` on **every press**, under
`__THE_ROAD_CARD_IS_NOT_A_LOCK__`. **That ruling is right and it stays:** the card is
not modal, and walking away from an offer you are ignoring must dismiss it.

**What was wrong is what V213 did to it.** That card used to be shown during
**travel**, where nobody is holding the walk dial. I routed the **walked street's**
moments into the same card — and on the walked street **the player is pressing that
dial constantly, because pressing it is how you walk.**

> The input you are already using to move became the input that erases the card,
> before a human could possibly have read it. A card that promises and does nothing is
> rule 14(d), which he called the worst bug in the game. **I built that exposure.**

## THE FIX KEEPS BOTH THINGS TRUE

- **Still not a lock.** A second press is you walking away, and it dismisses the card,
  exactly as ruled. Nothing is swallowed and nothing becomes modal — the press that
  spends the grace still walks you.
- **One press of grace.** The card survives the first press after it opens. Press once
  and you keep walking with it up; press again and you have chosen to leave.

### And it is a count, not a clock, which I got wrong first and measured

My first cut gave the card **two beats** of protection — a real ruled duration, 1000 ms
under the 120 BPM law, the same two beats V205's entry zoom takes. It looked
principled.

**It does nothing at the real cadence.** EYES walks in **two-second held presses**, so
the next press lands long after a one-second window has closed and the card is wiped
exactly as before. My own probe showed it: card gone anyway.

> **A millisecond window has to guess how fast a thumb is. A count does not.** One
> press of grace works whether he taps four times a second or once every five seconds.

## PROOF

`first_fight_gate` — **11 passed, 0 failed.** The arm presses the **real walk dial**,
the input that was doing the erasing:

```
card up                     true
after ONE walk press        STILL THERE
after a SECOND walk press   gone
```

Mutation-proved two ways, each landing on its own arm: remove the grace → the
*survives* arm goes red; make it never dismiss → the *still not a lock* arm goes red.
**The two arms hold each other honest** — neither a card that vanishes nor a card you
cannot escape can pass.

## THE DIAL

Nothing here touches a number in a fight.

---

**Tool:** `tools/bohemia_card_survives_a_step_patch.py` (MARK
`__CARD_SURVIVES_A_STEP__`, city slice only) · **Tab:** CITY.

**AND THE THING THAT IS NOT MINE TO FIX, ROUTED:** EYES item 1 measured that **the
font fix is real and is not in what he plays** — the alpha carries 0 Space Grotesk and
0 Google requests with the faces embedded, while the demo still carries 42 and 2 and
none. Same for this fix and every other lane's. Under rule 14(a) **only RUN re-cuts
the demo**, so everything six lanes shipped is one cut away from the surface he opens.
