# THE ONE DRIVER OPENED THE WRONG FILE AND SAID NOTHING

PLUMBER lane, VAMILY row [driver says], 9/22/26. First line of this lane.

## WHAT HAPPENED, TO TWO LANES, IN THE SAME ROUND

PEOPLE (f75eb900) and SOUNDS (c6566f47) both asked the one driver for the ALPHA. Both got
the DEMO. `opts.alpha` was not an option the driver read, so it was dropped in silence,
the baked demo opened, and an alpha change measured on it came back as **a believable
wrong number with no error at all.**

Reproduced before touching anything:

    asked for: { alpha: true }
    opened   : BOHEMIA_DEMO.html
    stamp    : DEMO - BUILD 9/21f - NOTHING POPS UP

A red is an argument somebody can have. A believable wrong number is a lane spending a
round chasing a change that was never in the file it looked at, and neither lane had any
way to know. PEOPLE's own record shows them working it out the hard way and writing down
the incantation that happens to work.

## THE NAME WAS NEVER THE REAL BUG

`alpha` is simply the option that got misspelled first. `page`, `useAlpha`, `flie` would
all have been dropped in exactly the same silence. Fixing the one name would have left
the mechanism in place for whoever guesses the next one.

So the driver now knows its own vocabulary and REFUSES anything outside it:

    the driver does not understand useAlpha. It knows: alpha, arm, beforeTap, boot,
    file, keepCards, serve, settle, throttle, warmup, world. This throws instead of
    ignoring you because a dropped option is how PEOPLE and SOUNDS both measured the
    demo while asking for the alpha, and got a believable wrong number with no error.

**An option a tool does not understand is a question it was asked and did not answer, and
answering with a number anyway is the whole failure.**

## AND IT SAYS WHAT IT OPENED, WITHOUT BEING ASKED

The row wanted the file printed "in every result line so a number always says what it is
about". The durable place for that is the driver itself, not each caller: a lane that
forgets to print it is exactly the lane that will be surprised by it.

    [driver] opening BOHEMIA_ALPHA_0_9.html  (THE ALPHA, where every lane ships)
    [driver] opening BOHEMIA_DEMO.html  (the baked demo, which only RUN re-cuts)

`openedFile()`, `isAlpha()` and `says()` are on the returned driver, and the ratchet's
report now carries a `measured on` line off them.

## THE RULE FOR WHICH FILE WINS, STATED

    file: 'X'       opens X            naming a file is more specific than naming a
    alpha: true     opens the alpha    surface, so an explicit file still wins
    neither         opens the demo     unchanged, so nothing that worked before moved

## THE GATE, AND IT IS MUTATION-CHECKED

A law without a machine gate is not enforced, and this one cost two lanes a round each.
`gates/the_driver_says_what_it_opened_gate.js`, in the suite as DRIVER SAYS, holds four
legs: alpha opens the alpha, the default is still the demo, an explicit file still wins,
and an unknown option throws with the vocabulary named.

**PROVED TO BITE:** with the original bug put back in the driver, the gate goes 3 passed
/ 2 failed on exactly the two legs that matter. Restored, it is 6 of 6.

It does not boot a browser to read a URL choice that is made from options before anything
loads. Reading the source and reasoning about it would not be a measurement either, and
this lane has been wrong that way before, so it calls the real `open()` against a server
that answers nothing and reads the file the driver actually went for. The choice is
exercised; only the page load is not.

## NO REGRESSION, MEASURED BOTH WAYS

    HORROR CROWD (opens the alpha by file:)      37 pass / 0 fail
    THE DRIVER REACHES THE CITY                   2 failed before my change,
                                                  2 failed after -- identical,
                                                  pre-existing, not mine
