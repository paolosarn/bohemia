# FIVE LAYERS, FOUR WRONG INSTRUMENTS, AND I AM STOPPING AT THE FIFTH
# LIFE + CITY, 9/23/26, row [eyes: half a hud] — CLAIMED, NOT CLOSED
# plus the round's cook: THE STREET THAT IS STILL LIT

---

## 1. WHY THIS RECORD STOPS WHERE IT STOPS

STOP PRODUCING (Paolo 7/26, LOCKED): *"THE TELL: writing a fourth version of anything
means you already failed — stop and say so instead of fixing the attempt."*

I am on the **fifth** version of this instrument. So this record says exactly what is
measured, exactly what is not, and stops. The row stays CLAIMED. A half-done job
marked SHIPPED is worse than an open one.

## 2. THERE ARE FIVE LAYERS BETWEEN A COLD BOOT AND THE SCREEN EYES REPORTED ON

    the splash  ->  BEGIN  ->  the VOTE landing  ->  the play tab  ->  the HUD

**TWO OF THEM ARE HIS OWN RULINGS WORKING, NOT DEFECTS.** The loading screen holds
until BEGIN (rule 18a, so a tap on the door does not give him a black rectangle for
two minutes) and the alpha opens on VOTE (rule 15g). Both are correct. Together they
mean **any harness that stops short is measuring a different screen**, and three of
mine did.

## 3. FOUR WRONG INSTRUMENTS, IN ORDER, ALL THE SAME SHAPE

| what it said | what it was actually doing |
|---|---|
| two of them ALIVE | measuring the **stale baked demo**, not the tip |
| SCAVENGE ALIVE | the "life" was a **teaching ring that opens on any tap** |
| all three dead, NOTHING AT THAT POINT | clicking **`#loadgl`**, the loading screen's own canvas, inside `#front` at z-index 200 across the whole 390x844 |
| all seven NOT ON SCREEN | sitting on the **VOTE landing** |

**EVERY ONE IS PRESSING A SURFACE SOMETHING IS COVERING** — the same bug that once
made 544 walk presses move him zero cells, wearing four different coats.

Each was caught by a cheap discipline, and each discipline is now permanent in the
probe: print **which file** you opened; press an **inert point** first and subtract
whatever appears for free; ask the top page **what it hands a finger at the control's
own coordinates**; and **walk the whole path** before believing a number.

## 4. WHAT IS MEASURED, THROUGH ALL FIVE LAYERS, ON THE ALPHA AT 390x802

    SCAVENGE    #workbtn   50x44   finger lands on #workbtn   (that IS the control)
                                   press 1: 0 new words   press 2: 0 new words
    BUILD HERE  #buildbtn  44x44   finger lands on #buildbtn  (that IS the control)
                                   press 1: 0 new words   press 2: 0 new words
    STANDING    #rungbtn   44x44   finger lands on #rungbtn   (that IS the control)
                                   press 1: 0 new words   press 2: 0 new words
    inert control press: 0 words, 0 elements — no free life to subtract

And two things that hold at every layer, on both files:

- **SCAVENGE is `#workbtn`, not `#jobbtn`.** The id in the row was a guess.
- **RAY, DENISE, MARCO and Marry are never on screen**, on any file, at any layer.
  Their ids (`fammarry`, `standingWho`) exist only inside the STANDING card. Four of
  the seven are not a dead panel: they are **the same one door**.

## 5. MY CAUSE WAS WRONG, AND THE GAME SAID SO ITSELF

I had it that all three open cards, rule 19(a) killed the card surface, and so the
room was removed and the doors were left. `cardShow()` refuses any card whose caller
did not pass `asked`, and **records every refusal on purpose** — its own comment says
why: *"Never silently: a swallowed refusal is how a lane ships a feature that does
nothing, which is this file's oldest bug."*

So I asked it, rather than believing myself:

    CARDS_REFUSED before the three presses : 0
    CARDS_REFUSED after                    : 0
    #daycard exists                        : true,  class "on"
    a plot is selected (CB.sel)            : [48,48]

**NOT ONE CARD WAS REFUSED.** The killed-card theory is dead. And two of those rows
argue with my own measurement: the day card reports itself **open**, and a plot **is**
selected — the condition BUILD HERE needs.

## 6. SO THE HONEST STATE IS: I DO NOT KNOW YET, AND I AM SAYING SO

Two observations conflict:

- through five layers with a real finger, the hit test lands **on the control** and
  nothing follows;
- in the run that read the refusal log, `#daycard` was already **on**, which could
  mask "new words" entirely — a card that was open before the press cannot produce
  new text by opening.

**An instrument that cannot say "I do not know" will say "no"** (this lane, 9/21).
Guessing a third cause at the end of a long round is how the fourth version of
something gets written. The next round's first job is one clean run that records
whether the card is open **before** the first press, clears it, and then presses —
and nothing else until that is settled.

## 7. AND THE ROUND'S COOK, WHICH DID ASK THE WORLD FIRST

`slices/vote/LIFECITY_THE_STREET_THAT_IS_STILL_LIT_9_23.png`, in the **VOTE tab**.

He killed the 9/21 shop with *"Not analog horror enough"*. Rule 7 of DIRECTION's
bible: *"lights on where the census says empty. DRAWN FROM WORLD DATA, NEVER FAKED."*
So this one counted before it drew, crossing two shipped systems over the whole 96x96
overmap on the alpha:

    lamp ground, circuit LIVE          264
    lamp ground, circuit dark        2,170
    LIT, AND THE CENSUS SAYS EMPTY     168
    lit, and somebody lives there       96
    dark and empty (ordinary)        1,555

**Most lit ground in this valley is empty ground**, on MOB's wire, NETWORK's, the
VOLUNTEERS' or nobody's, and nothing on screen says so. The picture is one real block
off that list — 59,4, arterial, MOB's wire. Ordinary night, dark houses, a street
lamp doing its job, and **one house with its lights on that the census says is
empty**, off-centre, with nothing pointing at it. The factory refuses to run without
the measured row.

Four things the first cut got wrong, all found by looking at it: the lamp was drawn
as ellipse **outlines** and read as a bullseye; the lit windows mixed warm into a
night-multiplied wall and read as a grey blind (a window is **the room**, and the room
is not under the night multiplier); half the frame was bare dirt because a street has
two sides; and the road dashes were painted in palette code 5, which the legend names
**gate**.
