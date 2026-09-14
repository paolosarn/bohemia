# THE BOARD BLAMED THE WRONG FILE, AND THERE IS NO WAY INTO THE MAP (RUN, 9/14/26)

VAMILY round. Three things happened, in this order, and the second one is the one
that matters most to him.

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

## 2. *** THERE IS NO WAY INTO THE MAP, AND IT WAS ALREADY BROKEN ***

The one driver's own header records, 9/13: *"the way into CITY mode is the PINCH,
and it works on the first hard squeeze (HZOOM 44 -> 11, mode human -> city). The
round button is deliberately quiet when nothing is in front of you and the CITY
chip is built but never appended, **so the pinch is the only door** -- and it
opens."*

It does not open. Four hard squeezes on the demo:

    before    mode human   hzoom 44
    pinch 1   mode human   hzoom 44
    pinch 2   mode human   hzoom 44
    pinch 3   mode human   hzoom 44
    pinch 4   mode human   hzoom 44

**The zoom does not move at all.** Not "does not cross the seam" -- does not move.
And this is not mine: I stashed every change I had made, ran the same probe against
**the demo that is already on main**, and got the identical five lines. No page
errors either time.

### WHY THIS IS THE BIGGEST THING ON THIS PAGE

- It is on his own break list: *no fast travel from the map*.
- The seam is how the game shows you it is one world at two scales. With it shut,
  the demo is a street and nothing else.
- **It blocks this lane's claimed job outright.** The `[fast travel]` ship test
  begins "zoom out, tap a place". You cannot tap a place on a map you cannot reach.

The seam code itself reads fine: `setHZoom` crosses when a pinch asks for a zoom
wider than the widest walked stop while already standing on it. That branch cannot
run if HZOOM never leaves 44, so the gesture is not reaching the zoom at all. Named
here rather than guessed at; finding what eats the gesture is the next thing this
lane does, ahead of the rest of fast travel, because fast travel cannot exist
without it.

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
    no fast travel from the map              *** WORSE THAN RECORDED: there is no
                                             way to the map at all. Reproduced on
                                             main's own demo, four pinches, zoom
                                             never moves. ***
    glitches                                 no page errors in the walk

## THE LESSON

Two rounds running, this lane has found a written-down cause that was wrong, and
both times the same thing settled it: **turn the accused off and see if the symptom
goes away.** A stylesheet you can disable at runtime will tell you in one second
what a day of reading CSS will not.
