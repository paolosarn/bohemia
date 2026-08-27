# THE BOHEMIA LOOK
# Paolo, 8/27/26, LOCKED. Two exports, six hours apart, seven forks answered.
# Records: records/BOHEMIA_UI_VERDICT_THE_LOOK_8_27_26.txt
#          records/BOHEMIA_THE_GAME_HAS_LETTERS_AND_THE_RUN_WEARS_HIS_LOOK_8_27_26.md
# Gate: gates/ui_look_gate.js   Factory: tools/bohemia_look_factory.js
# The one canonical body: engine/bohemia_look.css

He asked for this lane in one sentence: *"craft this bohemia look BY MYSELF WITH
YOU."* He then picked it, fork by fork, off a page he could tear up. **This file
is his answer written down. Nobody re-asks these and nobody re-pitches the two he
killed.**

---

## THE FIVE THINGS

### 1. THE CORNER IS CUT
Two corners sliced at 45 degrees, **10px deep**, top-left and bottom-right.
Never rounded. Never square. The world is drawn at 45 degrees and the interface
agrees with it. It reads as a stamped metal tag, which is the half of the
FF10-meets-Machine-Party thesis that Machine Party owns.

*A bottom sheet's bottom corners are off the phone, so only the top-left cut is
ever on screen. That is the same rule, not a second shape.*

### 2. THE LINE IS HEAVY
**2px**, `#766f63`, which is his own ink at 45 percent over his own surface. No
new hue. **3.78 to 1** against the panel. The hairline it replaced measured
**1.22**, which is nothing in his sun.

### 3. GOLD IS YOU. COLD IS THE MACHINE.
**This is a rule about MEANING. It is not a pair of swatches.**

> **GOLD** `#d8a742` -- the objective, the verb on the action button, the arrows
> you move with, your choices in a conversation, the feedback on what you just
> did. Anything you press. Anything you are trying to do.
>
> **COLD** `#61a89f` -- the phone, the network, the place-name, every count and
> every timestamp the machine hands you and you did not choose.

He overruled a recommendation to go neutral, and he was right. Neutral kept the
law; this keeps the law **and** buys a second meaning. The valley has no cold in
it, so nothing on screen ever competes with a lamp (**LIGHT = TERRITORY**), and
the phone reads as a different object from the street (**FFX.L03**: the interface
lives in a hue the world does not use).

**THE HARD LIMIT: NO ESSENTIAL INFORMATION BY COLOUR ALONE.** Gold and cold say
WHOSE a thing is. They never say WHAT it says. Every cold value carries its own
word beside it. A screen that only works in colour is a broken screen.

**A person is neither.** Not you, not the network. Plain ink. Gold got sharper by
giving something back.

### 4. EVERY LETTER IS THE SAME WIDTH
Labels and body alike. A receipt, a ledger, a printout, for a game about money
that stopped working.

**The face is IBM Plex Mono, 400 and 700, embedded as a data URI.** Bank:
`banks/BOHEMIA_TYPEFACE_MONO_8_27_26.txt`. He ruled the CATEGORY; the family was
chosen inside it and he can overrule that in the UI tab like anything else.

**AND THE RULE THAT COMES WITH IT, WHICH IS BIGGER THAN THE FONT: A QUOTED FAMILY
NAME IS A REQUEST FOR A FILE.** If no `@font-face` answers it, the request is a
lie and the browser silently serves something else. The workshop asked for
'Space Grotesk' for a month with no font file anywhere in this repo, so **this
game had no letters at all** while every gate was green. Gated now, generally.

**The one exception, and it is not a letter:** a glyph used as a CONTROL. No font
carries all eight compass arrows in one weight, so a ring of eight arrow glyphs
comes back in two weights. **Controls are drawn, not typed.**

### 5. PRESSED IS A FLIP
The **whole box** inverts to solid accent with dark ink, **8.60 to 1**. Not a
highlight in the middle. **A thumb covers the middle of the button**, so a change
that happens there is a change he cannot see. It is the FF10 move: the selected
row is a solid bar, not an outline.

---

## AND TWO THINGS ARE DEAD

**THE DIRT.** He said no to grime on the panels, no to a worn edge, and no to
plain flat. **The interface is not textured.** Grime belongs to the room you are
standing in and not to the readout (`MP.L01`), and the world lane already has it
wired at his ruled 0.30.

**THE FEED POST.** Killed three times counting the ASCII text-cam art. **The slot
is empty and it stays empty until he says what goes in it.** Nobody cooks a
fourth set. Re-pitching at a man who just said no three times is exactly what
STOP PRODUCING (7/26) is about.

---

## THE BOX: HOW IT IS BUILT

The look is one primitive. An **outer** element that IS the edge, wrapping an
**inner** face that IS the fill. Corner, weight and cut all fall out of that one
pair.

**THE INNER CHAMFER IS COMPUTED, NEVER EYEBALLED.** If both are cut at the same
depth, the cut slices straight through the line at the corner. Two parallel
45-degree lines a border-width apart differ in intercept by `bw * sqrt(2)`, so:

```
cutIn = cut - bw * (2 - sqrt(2))        10px, 2px  ->  8.83px
```

**AND IT NEEDS NO EXTRA MARKUP.** A judge page can afford a wrapper div per box.
The game cannot: its buttons are built by other lanes' JavaScript, and **a LOOK
lane does not reach into another lane's DOM.** The inner face is a `::before`
held under the text by a stacking context on the element itself. Same picture,
zero markup, nothing in `engine/` has to change.

---

## HOW A LANE PUTS IT ON

`engine/bohemia_look.css` is the **only** copy. Do not retype these values.

1. Put `/* LOOK:BEGIN */` and `/* LOOK:END */` in your surface's stylesheet.
2. Run `node tools/bohemia_look_factory.js`. It stamps every registered surface
   and is idempotent.
3. Apply THE BOX **by selector** to what you already have. Change CSS, never
   markup, never logic.

Today it is on **the run** and **the workshop shell**. Every other tab is another
lane's room and this lane does not repaint somebody else's room from the hallway.
Backlog **UI-13** is the seam.

---

## THE TWO PROCESS LESSONS THIS COST, AND THEY BIND EVERY LANE

**1. A RULING THAT ONLY REACHES A RECORD IS A RULING THAT DID NOT SHIP.** His
verdict landed at 06:07 and for eight hours it lived on a judge page while the
game he plays wore the old chrome and 452 gates stayed green. If he decides
something, the acceptance line is the thing he touches wearing it, and a gate
reads that surface.

**2. WHEN YOUR EYE DISAGREES WITH THE CODE, MEASURE BEFORE YOU CHANGE ANYTHING.**
The first drawn arrow was 14 wide by 10 tall and it was misread four times off a
screenshot, about to "fix" a rotation that was already correct. Measuring proved
the rotations had been right the whole time and the SHAPE was the problem: a squat
triangle has base corners further from its middle than its own tip, so the eye
picks the wrong end. This is the 8/25 hair lesson running the other way, and both
directions are now law: **when a number disagrees with him about his own art,
suspect the number. When your eye disagrees with the code, suspect your eye.**
