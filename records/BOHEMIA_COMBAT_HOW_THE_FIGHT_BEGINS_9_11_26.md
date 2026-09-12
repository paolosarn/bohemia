# V205 — HOW THE FIGHT BEGINS: THE CAMERA PULLS BACK (COMBAT lane)

VAMILY job: **HOW-THE-FIGHT-BEGINS** `[enter zoom]`.

> *** PAOLO RULED IT 9/6, OPTION A: THE CAMERA PULLS BACK. *** "Yes definitely,
> and the map will zoom out nicely, maybe a cloud opacity somewhere."

His detail, locked: **a cloud passes in the turn** — a soft opacity layer that
covers the moment the scale changes, so the zoom reads as **weather and not as a
loading screen**. Same move for a street fight and for walking through a door
into a room. Both directions, in and out. No hard cut, no separate arena, no
text. You never leave the street.

Tab: **RUN into COMBAT.**

---

## THE MOVE HE ASKED FOR WAS ALREADY IN THE BUILD AND THE FIGHT NEVER ASKED FOR IT

This is the fourth row in a row where the material existed and nothing consumed
it. The walked city's `transition()` has been taking the street up into the map
since long before this ruling: same easing, same pull-back curve, a veil that
peaks exactly at the swap. Its own comment says what it is doing — *"pulling up:
zoom OUT from wherever you were."*

Starting a fight did none of it. Four places posted the encounter and all four
**hard cut**: one frame you are standing on a street at person scale, the next
frame you are looking at a combat board at house scale.

## AND WHAT THE HALF SECOND LOOKS LIKE WAS NOT MINE TO DECIDE

**DIRECTION ruled it on 9/6 and routed the card to this row by name:**
`records/BOHEMIA_FIGHT_TRANSITION_LOOK_9_6_26.md` — *"COMBAT [enter zoom] and
ANIMATION [zoom beat] build to this."*

**I BUILT THE ROW BEFORE I READ IT, AND THE FIRST CUT BROKE FOUR OF ITS CLAUSES.**
Not near-misses: the card bans by name the thing I built.

| the card | my first cut |
|---|---|
| **two beats** — "beat one the cloud arrives, beat two the scale settles" | one beat |
| **a cloud SHADOW**, a value multiplier darkening to 0.75-0.85, "no white mist" | **pale dust — the white mist** |
| **covers at most 60%** of the frame, "NEVER the whole screen" | a full-frame coat |
| **it travels**, "enters one screen edge and leaves the other" | bloomed in place |
| a door gets **the doorway's shadow, not a cloud** | the same cloud indoors |
| "a frozen frame must still look like the walked street" | the street on **near-black bars** |

Every visual number in the shipped move is now quoted from that card. The card's
own routing says **DIRECTION judges the built thing on the real surface** against
its section 6, which is the arbiter here, not me.

## WHAT SHIPPED

| | |
|---|---|
| the pull-back | the street you are standing on eases back toward house scale, inside beat two |
| beat one | the **live world**, still running, with the shade crossing it |
| the shade | a cloud shadow: black at an alpha, 0.78 at the core, travelling one way |
| one door | all four ways into a fight go through the same move |
| the door's own skin | indoors it is the doorway's shadow, darker and a different shape |
| the way back | winning runs the same two beats reversed |
| tools/bohemia_enter_zoom_patch.py | replayable, MARK `__ENTER_ZOOM__` |
| gates/enter_zoom_gate.js | **13 pass / 0 fail**, suite-registered as **ENTER ZOOM** |

**THE VALUE-ONLY PART IS ARITHMETIC, NOT AN OPINION.** The shade is **black at an
alpha**, never a grey fill and never a blend mode: compositing black at alpha A
multiplies every channel by exactly (1-A), so hue and saturation cannot move.
Measured on the shipped canvas with the world held still: the darkest the street
gets is **×0.775** (the card's band is 0.75-0.85) and the worst disagreement
between the three channels anywhere in the frame is **0.016**. With the pale mist
put back as a mutation, that same number reads **0.292**.

```
  the shaded part of the frame, across the move   7.9% -> 23.2% -> 38.9% -> 48.3% -> 39.2%
  the centre of the shadow, across the width      0.093 -> 0.218 -> 0.357 -> 0.499 -> 0.635
  the core, as a multiplier                       x0.775            (the card: 0.75 - 0.85)
  worst channel disagreement anywhere             0.016             (pale mist: 0.292)
  the door's skin                                 x0.616, 43.9% of frame
```

The world's own weather module already dims a cloudy hour this way
(`CLOUD_MULT [0.86,0.88,0.94]`), which is the same mechanism one step shallower.
The one place the two differ is that `CLOUD_MULT` **cools** as it dims and the
card says value only; the card is newer and it is about this turn, so the turn
does not cool.

## AND THE FIGHT LOOP PAYS ZERO, WHICH IS WHY THIS COULD SHIP AT ALL

`[draw budget]`, this lane's own row from last round, says anything new that draws
inside the fight ships with its cost in milliseconds a beat and **does not enter
until there is room** — and the worst-case headroom is **2.5 ms**. A camera move
plus a weather layer does not fit in 2.5 ms.

So nothing new draws in the fight. **The pull-back and the shade are the CITY's,
the cover over the swap is the SHELL's, and all of it happens during a HANDOVER,
which is not the fight loop.** The ledger row reads `in_loop: false`, and the
proof is the ratchet: the combat blob's draw surface is **unchanged at fifteen
functions**. Measured per call in the city: the shade **0.1 ms**, one paint of the
pull-back **0.1 ms**, the photograph **3 ms once**, and the live render under beat
one **2-3 ms**, which is the render the city was already doing.

*The cheapest way to pay a budget is to not spend it.*

## SIX THINGS WERE WRONG FIRST, AND EVERY ONE CAME OFF THE REAL SURFACE

**1. THE FIRST CUT DROVE THE CAMERA AND RE-RENDERED THE WORLD.** It did what
`transition()` does: change the street's pixels-per-cell and redraw. **Eleven
frames in eight hundred milliseconds** — re-rendering at a new zoom busts the
chunk cache every frame — and **the camera was left stranded at 1.4 pixels a
cell**, because I read the shipped curve as spanning the whole move when its ease
only ever reaches **a half** before the swap.

**THE FIX IS THE WHOLE DESIGN: photograph the frame already on the glass, once,
and scale that one bitmap.** One blit a frame. It cannot strand the camera because
it never touches the camera.

**2. AND THE PHOTOGRAPH HAD TO BE OF A CLEAN FRAME.** Snapshot the canvas the
shade is already painted on and the shadow is **baked into the bitmap and then
scaled with it** — the shade shrinks with the street while a second one is drawn
on top. The photograph is taken of a fresh render, with no shade on it.

**3. THE LATCH WAS STRANDED FOREVER, AND A HARNESS HUNG ON IT.** The handover
**hides the city document**, so `requestAnimationFrame` stops firing, the second
half of the animation never runs, and the flag saying "a zoom is in progress"
stays up for good — **refusing every fight after the first**. Both directions now
carry a wall-clock backstop that survives a document nobody is drawing.

**4. THE HANDOVER WAITED ON FRAMES, SO IT LANDED LATE.** The walked city idles at
**twenty frames a second** here and fell to **three** under load, which put the
handover at **845 ms instead of 250**. The picture is allowed to be as smooth as
the document can manage; **when the fight starts is not.** It is on a clock.

**5. THE SHADE VANISHED AT THE PANEL SWAP**, which is the one instant it exists to
cover, because the city's canvas goes away with the city. The cover now lives
**above both documents** in the shell, wearing the card's numbers, and it takes no
taps.

**6. AND A LETTERBOX IS NOT THE STREET.** Scaling the photograph down left a
near-black margin, which fails the card's own judge test — *"if a frozen frame
looks like a different game, the turn failed."* The margin is the same street,
blurred once at photograph time and blitted, so what is around the edge is more of
the ground you are standing on.

## THE CHECKER TOOK THREE WRONG CUTS OF ITS OWN

**IT COULD NOT LIVE IN THE ENTRY GATE.** Forty arms run in front of it there and
leave the shell showing the fight panel with the city frame hidden — and a hidden
document gets no animation frames, so every attempt to drive a 500 ms camera move
from down there **waited for frames that were never coming** and hung. *A gate
that has to unwind another gate's state to ask its own question is the wrong gate.*

**MY RAW-POST COUNT COUNTED THE WRONG STRING.** The arm proving all four entries
go through one door counted the word `type:` — the message's own field, there
either way — so it read **four out of four as raw** on code where all four were
fixed.

**AND THE FRAME COUNT WAS NEVER THE CLAIM.** *** MEASURED, WITH NOTHING RUNNING
AT ALL: the walked city gets TEN animation frames a second on this machine and
its worst gap between two of them is 1475 ms. *** One stall can eat the entire
second beat and leave the pull-back a single frame. An arm demanding four frames
reports "the pull-back never happened" on a build where it happens perfectly. So
the arm asserts the thing that is true either way: **every frame it did get was at
the scale the clock says** (worst deviation from the curve **0.000**), and how
many frames a browser hands out is printed beside the stall that explains it. The
handover's band is **early-side exact and late-side measured**: it may never fire
before the mark, and it may be late by however long the machine actually stalled.

**MUTATION-PROVED, four separate defects injected, each caught by the arm that
owns it:** one beat instead of two → 1 red; the pale mist back → the shadow arm
and the coverage arm red; the door losing its own skin → the one-door arm red.

## AND LAST ROUND'S OWN GATE CAUGHT THIS ROUND'S LEDGER ROW

`draw_budget_gate` went red on the row I wrote for this feature, and it was right
to. Its floor rule says every row at or under the instrument's resolution must be
**flagged as under it** rather than printed as a small number — and my row carried
a per-draw cost of **0.0** with the flag off.

The flag was the wrong answer either way. *Below the floor* means **too small for
this instrument, not free**. This row's claim is different and stronger: it never
draws inside the fight, so **there was never anything for the instrument to put a
stopwatch on**, and a row carrying a measured-looking 0.0 is claiming the tool
read zero when the tool was never run. The per-draw number is gone, and a new arm
holds the terms a row has to meet to cost nothing **by construction**: it must be
**out of the loop**, it may **not** carry a per-draw number the tool never took,
and it has to **say in writing** how it gets away with zero. A lane that wants to
write "free" on something that draws every frame still has to measure it.

## WHAT THE CARD ASKS FOR THAT THIS ROW DID NOT BUILD

**THE CROWD WALKING OFF** (card section 4: non-combatants clear the board at walk
speed during the cloud beats, "nobody pops, nobody fades"). Beat one is the live
world, so the mechanism is there for it — but who walks and where they go is the
crowd's own code, not this lane's, and beat two is a photograph where nobody can
walk at all. **Routed, with the reason measured:** re-rendering the world during
the scale change is what ran at fourteen frames a second.

## `NO DAMAGE BEFORE THE DIAL`

Nothing in this row authors a damage number, a hit or a roll. It is a camera, a
cover and a handover.

## GATES AT CLOSE

| gate | |
|---|---|
| `enter_zoom_gate.js` | **13 pass / 0 fail**, and four injected defects caught |
| `combat_entry_gate.js` | 43 / 0 |
| `draw_budget_gate.js` | **11 / 0**, one arm added this round |
| `demo_build_gate.js` | 25 / 0 |
| `blob_integrity_gate.js` | 107 / 0 |
| page errors | **0** |
