# DRIVE IT LIKE A PLAYER (9/13/26, LIFE + CITY lane)
## Paying the method debt, and three measurements — one of which killed my own headline

**Nothing shipped to the game. The lane's five-minute break is done and rule 14(b) says a
building lane without one adds nothing to the demo, so it added a tool instead.**

`tools/bohemia_drive_the_demo.js` — boots the demo on a phone profile, clears the card,
crosses the seam, photographs the canvas. It exists because **nobody in this fleet could
look at the demo the way he does**, and that is what made my last two headlines wrong.

---

## THE DEBT

Two rounds, two wrong headlines, one cause:

| round | what I did | what I reported | the truth |
|---|---|---|---|
| `[tiles not slabs]` | set `TW` by hand and rendered | "zero images at every zoom" | the city already drew **9,050** |
| `[freeway reads]` | set `city.x` / `MODE` | (no picture at all, 4 tries) | every frame was repainted before the shutter |

The game recomputes `TW`, `MODE`, `city.x` and `CZOOM` every frame from its own state.
**Assignment is not input.** Two screenshots labelled TW=18 and TW=28 came back
*pixel-identical* and I nearly read them as a before/after.

## THE FOUR TRAPS BETWEEN A SCRIPT AND THE GLASS

Each one cost a round, and each one fails **silently** — the screen just reads "nothing
happened":

1. **The iframe offset.** The canvas is in an iframe, so a rect measured inside it is
   iframe-relative. A tap needs the frame's own box added or it lands nowhere.
2. **The card.** A card sits over the glass at the door and eats every tap. **Its button
   says GET UP.** I guessed NOT NOW / SKIP / CLOSE / OK — none exist — and got a clean
   "nothing moved" from all four, which I nearly wrote down as a bug.
3. **A text selector is not a finger.** Clicking by text matched a hidden copy and did
   nothing. A touch at the element's real screen position worked.
4. **The seam is a pinch.** Not a button, not an assignment.

## THREE MEASUREMENTS

### 1. The way into CITY mode is the pinch, and it works

I nearly shipped **"my lane's entire surface is unreachable in the five minutes."** The
evidence looked strong:

- No CITY-ish control is visible at the door. The full list is HUMAN MODE, SUBURB · ON
  FOOT, DAY 1 · 06:00, MUSIC, SAVE, PHONE, OUTFIT, SLEEP, BIKE, MARKET, SCAVENGE, BUILD
  HERE, ◆ STANDING.
- The round `#mode` button has an **empty label** and tapping it leaves mode on `human`
  — and the tap definitely arrives, instrumented: `pointerdown`, `touchstart`, `click`
  all fire.
- Calling `transition()` directly **does** open city mode.
- The `#modechip` CITY chip is built and **deliberately never appended**.

Then I read the 8/26 note instead of stopping: *"Zoom is the way in and out and it is
measured working, so this is no longer the primary verb."* My earlier pinch proved
nothing because **the card was still eating it**. Card cleared first:

    pinch #1   mode human -> city,  HZOOM 44 -> 11

**One hard squeeze. The door opens.** The blank, inert round button is *deliberate* —
their note says a control that vanishes reads as broken, so it stays quiet rather than
gone. Not a bug, and not mine to revert.

### 2. Four fifths of the walked surface is art, not flat fill

Letting the game's own loop paint for 1.5s and watching the context:

    drawImage 144 calls   37,438,032 pixels of ART
    fillRect 4943 calls    9,249,063 pixels of flat colour
    -> 19.8% of what he sees is flat fill

My eye said the opposite. The screenshot on foot reads as flat tan and khaki bands, and
I was ready to call it a missing renderer. **It isn't.** The pixels are there; the art
*reads* flat. That matters for whoever holds "the streets don't look like streets" —
**don't go looking for a renderer that isn't drawing; the problem is contrast and
variety in art that is already on the glass.**

### 3. The first thing in the five minutes is a card

Before one step is taken, the glass carries THE METER READER: a job, a travel time, a
price, and three negotiations — *Make it a bag instead*, *Make it a favour instead*,
*Half of it now, before I go* — plus GET UP. That is RUN's `[dead cards]` row and its
own rule 14(d); noted here only because it is literally minute zero and it silently ate
four of my measurements.

## THE STANDING NOTE

**A CLEAN "NOTHING HAPPENED" IS THE MOST EXPENSIVE RESULT IN THIS REPO.** Every one of
the four traps returns exactly that, and it is indistinguishable from a real defect. I
have now twice been one commit away from reporting a broken game when the truth was a
broken probe — *"drawImage 0"*, and *"city mode is unreachable"*. Both were mine.

The rule that would have saved all of it: **before believing a negative, prove the
instrument can produce a positive.** Tap something that definitely works. Pinch and read
the number back. If the harness cannot show the thing working, it cannot show it broken
either.

---

    tools/bohemia_drive_the_demo.js   new, reusable, runs standalone
    slices/                           UNTOUCHED -- rule 14(b), no break left to fix
    demo                              NOT re-cut -- rule 14(a)
