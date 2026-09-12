# THE BANNED NAMES ARE OUT, AND THE FONT DEBT IS NAMED (9/12/26, UI lane 11, row [no slop], round two)

Round one is `records/BOHEMIA_NO_SLOP_THE_FIRST_COUNT_9_11_26.md`.
Ruler: `tools/bohemia_count_the_tells.js`. Picture: `slices/BOHEMIA_THE_FIVE_REGISTERS_9_12_26.html`.
The row stays CLAIMED. Its ship test says none of the tells survive, and some still do.

## WHAT MOVED, ONE RULER, SAME COMMAND
```
                        round one      now
  named fonts                 14         0      -14
  1px borders                 62        62
  rounded corners             65        65
  monospace                   36        44      +8   <- see section 3
  spaced caps                 80        80
  THE WALKED CITY            278       272
```

## 1. TYPE GOES THROUGH A REGISTER NOW, NOT A FAMILY TYPED AT THE CALL SITE
Paolo: *"even down to the font."* The law bans Inter, Poppins, Space Grotesk and Geist by
name, and the walked city named Space Grotesk **fourteen times** in fourteen different
places. Three registers now live on the root, from DIRECTION's `[the font]` ruling:

    CASING   what a stamped or painted label on a thing is set in
    SCREEN   what a character-cell device displays, the one place fixed-pitch is ruled legal
    BODY     running text a person reads

**Fourteen call sites became one place.** Zero banned names on the walked surface.

## 2. CANVAS DOES NOT UNDERSTAND `var()`, AND THAT WOULD HAVE SHIPPED SILENTLY
Four of those fourteen were `ctx.font`, not CSS. A canvas font string containing a custom
property is not resolved -- it is **rejected whole**, and the context silently keeps
whatever font it had. The district labels on the map would have kept drawing, in the wrong
face, with nothing red anywhere and nothing to see unless you knew what the face should be.
Caught by reading what I had just changed rather than by a gate. Canvas asks the page what
the register resolves to now, cached per register.

## 3. THE NUMBER WENT UP, AND THAT IS THE HONEST PART OF THIS ROUND
`monospace` went **36 to 44**, because each register declares a fallback stack that ends in
`monospace` and the canvas resolver has one too.

**That is the ruler telling the truth: the names are gone and the tell is not.** All three
registers resolve to the game's own embedded face today, so *monospace for everything* is
still exactly what the screen does. The faces the research chose -- a DIN 1451 stencil cut,
an HD44780 ROM cut, DSEG for meters, a proportional pixel body -- **are not in this repo.**

**I did not swap the body register to a system sans to make the number fall.** That trades a
named tell for the actual disease the law is about: the reflex default, nobody's decision.
The debt is real and it is written here with a number on it rather than painted over.

**WHAT IT WOULD TAKE:** DSEG is free (OFL) and is the easiest to land. The ROM cut can be
drawn by us from the published 5x8 cell grid and needs no licence. The stencil is the one
that needs a real font file. That is DIRECTION's and COOK's to land; the seam is ready.

## 4. THE PICTURE IS DRAWN, NOT TYPED, AND THAT IS WHY
Five registers, the same word in each, **drawn as shapes**: the dot-matrix cell built from
the real HD44780 5x7 grid, the stencil with its bridges, the seven-segment meter, embossed
tape, engraving. Showing five things all set in the one face we own and calling them five
choices would have been a sheet that lies. Each says what it would take to actually have it.

**And the sheet caught itself once:** the stencil caption said "with the little bridges a
stencil leaves" over a drawing that had none. A bridge is where the plate stayed joined and
the paint never landed, so it is drawn that way now. Words claiming what the picture does
not show is the one thing a comparison sheet must never do.

## 5. STILL THERE
`1px borders` 62, `rounded corners` 65, `spaced caps` 80, `gradients` 11 on the walked
city, and the whole alpha shell at 467 -- **RUN's surface, which I have not opened.** The
remaining borders and radii are other lanes' panels: the day card, the market, the outfit
screen. Each needs its owner or a round that measures before it touches.
