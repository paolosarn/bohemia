# NOTHING MOVES UNDER HIS FINGER
# LIFE + CITY, 9/15/26, VAMILY row [eyes: shape rows]
# EYES E26 bounce-back, under PAOLO 9/13 rule 14(d):
# "A card that promises something and does nothing is the worst bug in the game:
#  deliver it or remove it."

---

## 1. THE THREE ROWS ARE NOT DEAD

EYES E26 reported three rows on the day card dead, on rounds 4, 5 and 6, on two
independent walks each: **'Half of it now, before I go'**, **'I will go first, on
something small'**, **'I'LL TAKE IT'**. 320x44 each, panel still open, nothing new
inside it, both presses.

Driven row by row from a clean door, with a real finger, at phone size, on the demo:

| row | pressed first, from a clean door |
|---|---|
| Half of it now, before I go | terms go to the **upfront** shape; the card changes to "One battery, half of it up front" and "Half now. And you are holding it if you walk" |
| I will go first, on something small | terms go to the **first** shape; "You go first. If they walk, it was cheap to find out" |
| I'LL TAKE IT | the job is taken; the card says "You took it. It is yours until the day is out." |

**Every one of them works on the first press.** Not one is dead.

I am not claiming EYES' observation away, and section 3 is why their instrument was
right to say something was wrong here.

## 2. THE REAL BUG IS THE SECOND PRESS, AND IT IS WORSE THAN A DEAD ROW

Measured on the demo at phone size, positions in page pixels:

    BEFORE                                  AFTER ONE TAP ON 'Half of it now'
      y=165  ✕                                y=236  ✕
      y=367  Make it a bag instead            y=438  Make it a bag instead
      y=420  Make it a favour instead         y=491  Make it a favour instead   <<<<
      y=473  Half of it now, before I go      y=561  I'LL TAKE IT
      y=526  Leave it with somebody...        y=619  GET UP
      y=579  I will go first...
      y=632  I'LL TAKE IT
      y=690  GET UP

**The finger lands at y=473. 'Make it a favour instead' arrives at y=491.** Eighteen
pixels away, inside the same 44-pixel row. Choosing one shape spends all three (one
shape per deal, which is correct), the card loses three rows, and the card is
vertically centred so the whole thing slides as it shrinks.

**THE ROOM IS TWO ASKS.** So on the first card of the game:

- a double tap spends his second and last ask on a deal he never chose
- a third tap, on whatever slid in next, **withdraws the offer and the job is gone**

The gate reproduces exactly this on the old code: a second tap in the same place
takes `asked` from 1 to 2.

That is not "a card that does nothing". It is a card that does something expensive
and invisible, which is the same complaint from the other side.

## 3. AND IT IS WHY A CAREFUL INSTRUMENT KEPT READING THEM DEAD

EYES' round 5 note found this exact shape and fixed half of it:

> "a planted button that removes its own panel read 'did nothing', because once the
>  panel is gone the same screen point belongs to whatever is underneath, so press
>  two measured a different element and agreed with itself."

They fixed it for a panel that **closes**. A panel whose **contents move** reads
exactly the same way, and that half was still open. Press one moves the terms; press
two lands on whatever slid into the gap, which is a `.sub` line or a row that does
not answer; the panel is still open and nothing it owns changed, so the verdict is
DID NOTHING and the row gets called dead.

**A screen point is not an element, even when the panel survives.** That is the
general form, and it is worth more than this one card.

## 4. WHAT SHIPPED

**THE MENU NEVER CHANGES HEIGHT.** Every row keeps its slot for the life of the card:

- two swap slots (there are always exactly two currencies that are not the current
  one) and the three shape slots, in the haggle module's own order. Nothing here
  decides what may be asked; it only decides where the answer is drawn.
- a spent row is drawn **in place**, dashed and dimmed, **with no `data-act` at all**,
  so a tap on it cannot reach the dispatcher even if a style is ever overridden.
- the shape he actually chose is marked **chosen**, not spent: "this is the deal you
  made" and "this is gone" are different sentences and the card should not say them
  the same way.
- 'I'LL TAKE IT' keeps its slot too. It used to not be drawn once the job was taken,
  which is right about what it may do and wrong about where GET UP ends up.
- taking the job now dims the rows in place instead of `display:none`, which was the
  same bug on the one path that does not redraw.

**AND THE TWO LINES THAT ONLY APPEAR AFTER A PRESS GET RESERVED BLANK SLOTS.** The
warning, what was agreed, and "You took it" each used to arrive as a new line, and
on a centred card a new line moves everything. Measured: 8 px of drift after an ask,
13 px after taking the job. Both are now zero.

This is this lane's own 9/13 ruling finished: a button that cannot work must not look
like one, **and it must not move either**.

## 5. THE GATE, AND THE FIRST VERSION OF IT WAS NOT A RULER

`gates/nothing_moves_under_his_finger_gate.js`, in the suite as NOTHING MOVES UNDER
HIS FINGER. 20 pass / 0 fail. The leg that matters is B3: after a press, **no row a
finger can use may sit within half a row of the point that was pressed.**

**MY FIRST MUTATION TEST PASSED AND SHOULD NOT HAVE.** I set the spent rows to
`display:none` and the driven legs stayed green. Two separate things were wrong:

1. The gate counted DOM nodes rather than visible rows, so a collapsing card looked
   the same size. Fixed: it counts rows with height, and leg B4b now checks that every
   row he can still press has not moved.
2. **The mutation itself was a no-op**, which I only found by measuring the layout
   directly instead of trusting the pass. `#daycardIn .dcbtn` sets `display:flex` and
   beats `.dcbtn.spent` on specificity, so the rows never actually hid. A green gate
   over a mutation that did not mutate is the same lie as a green gate over a gate
   that never ran.

The real mutation is the old behaviour: do not draw the spent rows. It reds four legs,
including the one that is the bug itself:

    B4  the card still shows the same number of rows      7 -> 4
    B4b every row he can still press stayed where it was  80 px of drift
    B5  a second tap in the same place spends nothing     asked 1 -> 2
    B9  the card still shows the same number of rows      7 -> 4

## 6. THE DRIVER GOT ONE EXTENSION (rule 14g: one driver, extend it)

`tools/bohemia_drive_the_demo.js` dismisses the day card during boot, which is right
for every walk and impossible for this one: you cannot test a row on a card the driver
has already thrown away. `open({ keepCards: true })` stops at the door with the card
standing, and `d.clearCards()` dismisses it when the caller is ready. The default is
unchanged, so no existing use of the driver moves.

## 7. WHAT I DID NOT CHANGE, SAID OUT LOUD

**The card offers five ways to argue and the budget is two.** That is not a bug in the
drawing, it is a design question: the warning only appears after the second ask, which
is correct under the module's own rule (you are told before the ask that costs you),
but a stranger reading five rows has no way to know that pressing three of them ends
the job. Now that a double tap is harmless, the remaining question is whether the menu
should say how much room is left from the start. That is a words-and-design call, not
a defect, so it is named here and not decided.
