# THE DOOR OFFERED AT FOUR TENTHS OF A SECOND (RUN, 9/16/26)

VAMILY `[loading screen]` / ONE-SCREEN-HOLDS-ALL-THE-LOADING.

> **PAOLO 9/8, LOCKED:** *"we seriously need a loading screen. It's bullshit when I
> go in the demo, all the loading shit that you might need to do, handle it, it's so
> awkward looking."*
> **PAOLO 9/15, after playing:** *"it's kinda not running as smoothly as I would
> like, maybe it's cause things are loading in real time."*

## THE BOOT, TIMED ON A PHONE-SPEED CPU

4x CPU throttle -- the one driver's own phone profile, because this container is not
a handset -- tapping once a second from the moment the door offered:

    0.4 s   THE DOOR SAYS TAP TO ENTER          two files loaded
    4.6 s   the door opens, AFTER TWO TAPS -- THE FIRST TAP DID NOTHING
   51.5 s   the walked world has a clock
   78.3 s   the city has drawn a frame
   85.9 s   a person can be talked to

**Eighty-five seconds from the door opening to a game**, and the invitation was on
screen four tenths of a second in, with two files loaded.

## THE PART NOBODY HAD TIMED: THE FIRST TAP IS A DEAD PRESS

The invitation is static markup. The listener that answers it is a script several
hundred kilobytes down the page. So the door asks to be tapped **before anything is
listening**, the first press falls through, and a player taps again.

That is his own sentence from a different round -- *"one button, ready to go, I
press it, nothing happens"* -- landing on **the first button anybody ever touches in
this game.**

## WHAT SHIPPED

The door reads **ONE MOMENT** until the entry is really wired, and only then offers.
`window.__DOOR_WIRED` is set on the line *after* the listener exists, so it can never
be true while a tap would fall through.

    before   0.4 s "TAP TO ENTER"   ->  opens after 2 taps
    after    1.1 s "ONE MOMENT"
             3.0 s "TAP TO ENTER"   ->  OPENS ON THE FIRST TAP

This is the smallest half of his ruling -- *"the front door appears only when the
game is actually ready to be played"* -- and **it costs nothing**: the wait was
always there. It was being spent on a lie.

## AND THE FIRST CUT OF THIS FIX DID NOTHING, WHICH ONLY THE GLASS SAID

I guarded the function that writes the door's text, re-cut, re-measured:

    still "TAP TO ENTER" at 0.5 s

**The markup itself carries the promise.** `<div id="fronttap">TAP TO ENTER</div>`
is in the document before one byte of script runs, so no guard on the painter can
possibly be early enough. The element ships as the waiting line now and the painter
turns it into the invitation.

Same shape as the inert CSS rule this lane found on 9/13 and the halving rule that
was stamping out the lit phone chip: **a fix that cannot run is not a fix, and only
re-measuring says so.**

## AND I EDITED THE GENERATED FILE FIRST

The demo is cut from the alpha. My first edit went into `BOHEMIA_DEMO.html`, which
the very next cut would have wiped without a word. Caught before it cost anything,
and the gate now checks **both** files so it cannot happen quietly.

## THE GATE

`gates/the_door_waits_gate.js`, in the suite as **DOOR WAITS**, 10 passed 0 failed.
It runs on the served demo at 4x CPU and holds: the first words on screen are not an
invitation, the invitation does arrive, **one tap opens it**, the flag is really set,
and both source files ship the waiting line.

**MUTATION:** put `TAP TO ENTER` back in the markup -> **4 red**, and the one-tap leg
independently reproduces the dead first press.

## WHAT IS NOT DONE, AND IS NOT PRETENDED TO BE

**The eighty seconds are still after the tap.** Pulling them behind this screen is
the rest of this same row: the city iframe is built lazily *inside* the click
handler, so the heavy work happens with his finger already down. Moving it in front
of the tap is the next piece, and it is why the door now has a screen to hold it.

    DOOR TO PLAYABLE, before   85.4 s
    DOOR TO PLAYABLE, after    79.4 s      (the tap saved, not the load)
