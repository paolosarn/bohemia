# THE ONE THAT IS YOU (9/11/26, LIFE + CITY lane)

VAMILY `[white rings]` WHAT-ARE-THE-FOUR-WHITE-RINGS. From his own frame, and it turned
out to be this lane's own work.

## HIS FRAME, 9/8

`records/target/PAOLO_THE_RAIL_COLLIDES_9_8_26.jpg` — four white rings on the city at
once, and one of them is supposed to be him.

## THEY WERE MINE

Three of them are the SETTLEMENT RINGS this lane shipped in round 3 of `[more people]`.
Their own comment promises *"NOT A HUD PIN, it does not follow him and it is not on the
walking screen."* They keep that promise exactly. They still caused this, because nobody
ever checked them against the mark they sit beside.

## MEASURED ON THE ALPHA BEFORE ANYTHING WAS TOUCHED

At the zoom his frame was taken at:

    settlement rings on screen     4      radius 10.2 px
    the mark that means YOU        1      radius  5.0 px

**The marks for "a town is here" were twice the size of the mark for "you are here",** and
both were a pale disc. The loudest thing on his screen was never him.

And it got worse the closer he looked: the player's mark was a **fixed 5 px at every
zoom** while the rings scale with the tile. At the closest zoom a town is 16 px and he was
still 5.

## THE FIX IS SHAPE, NOT BRIGHTNESS

Dimming the rings would fight the ruling that put them there — round 3 measured 38 pieces
of text on his screen too faint to read and built these to clear a 3:1 contrast floor on
purpose. So the rings are untouched.

**A RING IS A PLACE. A PIN IS A PERSON.** He now stands on a stem with a foot on the
ground, so his silhouette cannot be read as a hollow ring at any size, and he carries his
own colour in the middle where a ring carries a dark hole. It scales with the tile like
everything else on the map, and it is drawn last so nothing can cover him.

## AFTER

    TW=18   town 74 bright pixels    YOU 86
    TW=30   town 236 bright pixels   YOU 260
    TW=48   town  -                  YOU 684
    his centre against a town's centre: 212 apart in rgb

## THE GATE, AND IT CAUGHT ME TWICE

`gates/the_one_that_is_you_gate.js`, 7 pass / 0 fail, registered. It measures **rendered
pixels on the alpha**, not the source, because two marks can be written differently and
still look identical on the glass — and looking identical on the glass is the entire
complaint.

**The first cut of this gate could not fail.** It computed the player's size from its OWN
copy of the drawing formula, so when the mutation run put the old fixed 5 px disc back,
the size legs never moved and the gate still printed the new numbers. A gate that cannot
fail is worse than none. Both legs now count the bright pixels each mark actually puts on
the canvas, in an identical box around each, so the game is what is measured and neither
mark gets a rule of its own.

**And then the honest measurement caught the fix.** By height the pin looked fixed; by
pixels it was still quieter than a town — 106 against 236 — because a town is a FILLED
disc and a pin was a thin ring on a stem. **Height is not loudness.** Two cuts were wrong
before the third was right (82% of a town's height, then 45% of its brightness).

MUTATION-TESTED TWO WAYS:
  - restore the old fixed 5 px disc   -> A2, B1 and B3 red, B3 printing `52 -> 52 -> 52`,
    which is the old defect exactly
  - give him a town's dark centre     -> B2 red at 0 apart in rgb, proving the pixel
    comparison is real and not a description of itself

## THE STANDING NOTE THIS ROUND EARNED

**A MARK IS ONLY EVER RIGHT NEXT TO THE OTHER MARKS.** Round 3 measured its ring against
the GROUND it sits on, cleared the contrast floor, and shipped something correct in
isolation that broke the one thing on the screen a player must never lose. Nothing in that
round was wrong; the missing step was looking at the screen with everything on it.

Tab: CITY. Build stamp: 9/11h.
