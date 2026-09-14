# THE BOARD BLAMED THE WRONG FILE, AND SO DID I (RUN, 9/14/26)

VAMILY round. Four things, and the second is a correction of something I said out
loud before I had measured it properly.

## 1. THE DEAD BUTTON: THE CUTTER WAS INNOCENT

`[cutter flex]` says one line in `tools/bohemia_cut_the_demo.js` causes Paolo's
*"one button, ready to go, I press it, nothing happens"*: the demo's thumb floor
declares `#topbar>*,#blstack>*{display:flex !important}`, which beats the INLINE
`display:none` the game hides a useless chip with. The reasoning is exactly right.
**The conclusion is wrong, and only the glass said so.**

I built the fix into the cutter first, re-cut, and drove the demo with the one
driver. **MARKET was still on screen.** So I disabled that entire stylesheet at
runtime and asked the page again:

    mktbtn display   with cutter: flex    WITHOUT cutter: flex

Then I asked which rules actually claim `display` on that chip:

    demo-cut-city   flex  !important   #topbar > *, #blstack > *
    demo-cut-city   none  !important   #topbar > [style*="display: none"], ...
    halfcss         flex  !important   #blstack > .uihalf
    dayloopCss      none               #mktbtn

`halfcss` is the 9/6 UI halving, and it lives in **the walked city**, not the demo.
`#blstack > .uihalf` is id+class, the same specificity as my id+attribute, and it
sits in a **later** stylesheet, so it wins on order. **The bug was never demo-only:
the alpha has it too.**

**THE FIX WENT NEXT TO ITS CAUSE**, and it is the same shape as the phone-chip fix
this lane made a round earlier: re-hide only what the game itself hid, by reading
the element's own inline style, at a specificity that wins.

    #blstack > .uihalf[style*="display: none"], ... { display:none!important }

MEASURED ON THE GLASS, before and after, through a real walk:

    before   mktbtn   says HIDE   computed flex   44x44   *** FORCED ON SCREEN ***
    after    mktbtn   says HIDE   computed none   0x0
    visible chips 6, under the 44 floor 0   (the halving is untouched)

The cutter's rule stays, with its comment rewritten to say it is **not** the lock
that was open: it still covers any chip in those two bars the game hides inline
that the halving sheet does not claim. A rule that cannot win is the same trap as
the inert `.pb{width:44px}` this lane found on 9/13; the difference is that this
one is written down as a second lock rather than sold as the fix.

## 2. *** I REPORTED THE MAP UNREACHABLE AND I WAS WRONG. THE MAP IS FINE. ***

I am leaving the whole mistake in rather than editing it out, because the shape of
it is the useful part.

WHAT I SAID: four hard pinches on the demo, `mode human hzoom 44` every time, the
zoom never moving, reproduced against the demo already on main. I called it the
biggest thing on the page and said it blocked `[fast travel]` outright.

WHAT IS ACTUALLY TRUE, measured with an instrument that has a proven positive
result on this same box: **THE PAD SAYS WHAT IT WILL DO gate crosses the seam, 12
passed 0 failed.** The pinch works. The map is reachable. Fast travel is not
blocked by the seam.

### THE TWO BROKEN INSTRUMENTS, BOTH MINE

1. **A CARD OVER THE GLASS.** The opening stacks cards now: GET UP closes the wake
   card and THE JOB OFFER opens behind it. Every pinch harness in this round
   cleared ONE card, so a full-screen card was sitting on the canvas. Measured at
   the pinch point: `elementFromPoint` returned a `DIV`, the card read
   `display:flex class="on"`, and the canvas received **zero pointerdowns**. A
   pinch that never reaches the canvas is indistinguishable from a seam that has
   stopped working.
2. **`.click()` IS NOT A FINGER.** With the offer card up, eight synthetic clicks
   in a row did not close it, while real taps at the same coordinates did. The one
   driver's own header names this as its trap 3 and I walked into it anyway.

And a third, which is real and belongs to the shared tool rather than to me:
**the one driver cannot pinch at all.** `navigator.maxTouchPoints` is 1 in its
context, so a two-point CDP touch delivers one pointer. Every "the seam is dead"
line I produced through the driver was meaningless. Raising it with
`Emulation.setTouchEmulationEnabled` reports 5 and still yields one pointer, so the
fix is not one line and is written down here rather than guessed at.

### WHAT I SHOULD HAVE DONE, IN ONE SENTENCE

I had a gate that pinches and that I had watched go green hours earlier; I reached
for a new probe instead of the instrument with the proven positive, and then I
bisected with it, and the bisect was honest work built on a broken ruler. **When an
old instrument and a new one disagree, the old one that has passed is the witness.**

### WHAT THE GATE NEEDED, AND IT IS NOT A LOOSENING

PAD SAYS now clears EVERY card with REAL TAPS instead of one card with a synthetic
click. The assertions are untouched. 7/5 -> 12/0.

## 3. THE CUT: SIX LANES' WORK REACHED HIM

EYES E26 item 0, measured: *"THE DEMO DID NOT CHANGE THIS ROUND... Demo is stamped
BUILD 9/13z, alpha BUILD 9/14a, and only THE RUN re-cuts. Six lanes shipped against
last round's list and the demo he opens is the same demo."*

Rule 14(a) makes this lane the only one that can close that gap, and only after
walking the five minutes. Walked, then cut:

    before   demo BUILD 9/13z   42 Space Grotesk refs   2 fonts.googleapis
    after    demo BUILD 9/14l    2 Space Grotesk refs   0 fonts.googleapis
             (identical to the alpha, which is what "level with the workshop" means)

EYES E26 item 1 -- *"the font fix is real and is not in what he plays"* -- is closed
by this cut, not by new work. So is item 2's build-button fix, which LIFE+CITY had
already landed in the walked city.

## THE BREAK LIST, walked on the glass this round

    streets and sidewalks do not read        NOT RE-MEASURED THIS ROUND
    a flat freeway reads as an overpass      NOT RE-MEASURED THIS ROUND
    PRETTY MAP and DROP IN buttons exist     NOT RE-MEASURED THIS ROUND
    offer cards promise and do nothing       one closed: MARKET is gone when there
                                             is no market. The rest is [dead cards].
    no fight met in five minutes             NOT RE-MEASURED THIS ROUND
    no fast travel from the map              the MAP IS REACHABLE (I said otherwise
                                             and was wrong, see section 2). Fast
                                             travel itself still does not exist.
    glitches                                 no page errors in the walk, but see
                                             the gear loop below

## 4. *** AND THE COLD HAND FOUND A REAL ONE: THE GEAR IS A TRAP ***

THE COLD HAND presses the loudest thing it can reach, forty times, and never reads
a word. Its trail on this build:

    front > padring > daycardIn > daycardIn > dcbtn > dcgo > blstack > dcgo >
    gearbtn > setclose > gearbtn > setclose > gearbtn > setclose > ...

**Thirty-two of forty presses are the settings gear opening and closing.** The
clock does not move: `1d 360m -> 1d 360m over 40 presses`. Once a stranger is past
the cards, the loudest thing on his screen is SETTINGS, and opening it and closing
it is a loop that goes nowhere.

This gate was 7/0 on 9/13 and is 5/2 now, so something changed under it. It is the
same family as the ringing phone going grey a round earlier: the game's own
pointing loses to a control that is merely bright. It is named here and is the next
thing this lane looks at; it is not fixed in this round and this round does not
pretend otherwise.

## THE LESSON

Two rounds running, this lane has found a written-down cause that was wrong, and
both times the same thing settled it: **turn the accused off and see if the symptom
goes away.** A stylesheet you can disable at runtime will tell you in one second
what a day of reading CSS will not.

AND THE SHARPER ONE FROM SECTION 2: **a broken instrument does not look broken, it
looks like a broken game.** Two rounds ago a gate that could not see an SVG group
said the walk pad had stopped speaking. This round a probe that could not clear a
card said the map was gone. Both times the game was fine. The defence that works is
not more care, it is keeping an instrument with a PROVEN POSITIVE and reaching for
that one first.
