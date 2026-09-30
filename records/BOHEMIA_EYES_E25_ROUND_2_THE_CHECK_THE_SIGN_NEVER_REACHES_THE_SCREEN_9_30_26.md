# EYES AND EARS -- E25 [the sign] -- ROUND TWO OF TWO: THE CHECK
### 9/30/26 -- session eyes-5vql33

Row: does the drawn Welcome to Las Vegas sign read as the real one -- a pointed diamond, a
hard shadow, a striped apron -- on the real MAP tab, zoomed out. Round one (school,
records/BOHEMIA_EYES_E25_ROUND_1_SCHOOL_A_LENS_IS_NOT_A_DIAMOND_9_28_26.md) armed three
checks against the real sign's sourced shape and read the drawing code
(engine/bohemia_landmarks.js): all three defects COOK's own eye caught -- a lens not a
diamond, no shadow, a slab apron -- are already fixed IN THE SAME COMMIT. So round two's job
was never "is the code right." It was VERIFY ON THE REAL SURFACE: does any of that reach the
screen.

## IT DOES NOT. THE SIGN IS PLAIN DESERT ON THE MAP.

Measured on the alpha (slices/BOHEMIA_ALPHA_0_9.html), MAP tab, zoomed all the way out
(czoom 0.208), at the sign's own cell -- found off the game's own layout data (44,65), not
guessed -- and confirmed by the game's own `district()` call reading `sign` there and
something else 30 cells away:

- **Zero pixels of the sign's own red (#b9482f) anywhere in a 60x60 canvas-pixel crop
  centred on the cell.** Not blurred, not shrunk -- ABSENT.
- **The sign cell's own painted colour is `(138,122,88)` -- which is `#8a7a5e`, the exact
  hex the drawing code itself calls "hardpan," the plain desert BEFORE anything is drawn on
  it (engine/bohemia_landmarks.js SIGN_PAL index 0).** The cell reads as empty desert, not as
  a landmark with a colour problem.
- No diamond, no star, no shadow, no parking apron, no bay stripes -- a screenshot of the
  exact spot (records/eyes_the_sign/01_sign_crop_composited.png) shows flat tan ground
  crossed by the game's own generic diagonal fence-shadow overlay, the same texture that
  would sit over any empty cell nearby. A stranger looking at this exact spot on the map sees
  nothing that says "a landmark is here."

**So the school round's own three-item checklist (pointed silhouette, a shadow, striped
asphalt) could not even be run.** There is nothing on screen to grade against the checklist.
That is a bigger finding than any one of the three, and it is the one round two actually
found.

## WHY, FOUND AND NOT GUESSED

`engine/bohemia_landmarks.js`'s sign-drawing function is only ever CALLED from
`engine/bohemia_world.js` (`LMK.plan(...)`, confirmed by reading both files). And
`slices/BOHEMIA_CITY_WORLD.html` -- the file the MAP tab and the RUN tab's city view both
actually load -- says why that never runs, in its own committed comment, dated 8/21, about a
different bug that happened to name the exact same wiring gap:

> "LANDLOCK CONNECT... Moved here from bohemia_world.js on 8/21 for one reason: **WORLD.JS
> IS NOT ON THE PAGE.** The walked surface inlines this module and the district kit, never
> world.js..."

`bohemia_world.js` is the only caller of the sign's drawing code, and `bohemia_world.js` is
not loaded by the surface a player is on. The diamond fix, the shadow fix and the striped
bays all exist, are all correct, and are all unreachable -- not a downscaling problem, one
step earlier: a wiring gap that predates this whole row, confirmed in the game's own words,
not mine.

## RULE ZERO

Four controls, all green, printed in records/BOHEMIA_EYES_THE_SIGN_CHECK_9_30_26.json:
- **C3 THE SHAPE READER KNOWS A POINT FROM A ROUND TOP.** The first cut of this control
  FAILED and is kept in the tool's own history rather than quietly fixed: a "is the tip row
  narrow" test called a planted semicircle "pointed," because a circle's exact tip row is
  also one pixel wide, same as a diamond's -- both come to a point at the extreme pixel. The
  real tell is the RATE of widening one row in from the tip (a diamond's edge is straight and
  widens at a constant pace; a circle's edge curves and widens fast immediately below its
  cap). Refit on that measure, planted diamond reads pointed, planted circle does not, before
  either ever touched a real pixel.
- **C0 the door held**, **C1 the camera actually reached the map (czoom 0.208, not the
  street)**, **C2 the sign's own cell reads `district: sign` and a cell 30 away does not** --
  proving the reader finds the one real cell, not everything.

Positive control, not just the shape reader: this round's own numbers are what caught the
finding, not an assumption -- the raw canvas pixels were pulled and searched for the sign's
own five painted colours before concluding anything.

## THE THREE ORIGINAL QUESTIONS, ANSWERED HONESTLY

1. Silhouette pointed? **Cannot be judged -- there is no diamond-coloured pixel to judge.**
2. Shadow present and surviving? **No shadow-specific pixel reaches the screen either** (the
   pixels that loosely matched the shadow hex were the generic fence-overlay texture, not a
   landmark shadow; the same tolerance also caught 2,004 of 3,600 crop pixels as "hardpan,"
   which is the actual honest paint).
3. Apron striped or a slab? **Neither -- there is no apron at all on screen.**

## ROUTED

Nothing bounced back. This is a wiring gap in shared engine code
(`bohemia_world.js`/`bohemia_landmarks.js`/`BOHEMIA_CITY_WORLD.html`), not a taste call --
EYES never decides whether the fix is "load world.js on the page," "port the sign's plan()
call into the city-world file directly," or something else. That call, and whether it is
worth doing at all given the map's own [density leg] already reads RED ON PURPOSE for a more
basic reason (map cells painting one flat colour, PLUMBER 9/28,
records/BOHEMIA_THE_MAP_PAINTS_ONE_PIXEL_IN_THIRTEEN_9_28_26.md), belongs to whichever lane
owns the overworld map's rendering (WORLD / LIFE+CITY / PLUMBER's own row), named here so it
is not lost, not decided here.

## SHIP TEST FOR THIS ROW

School asked how a landmark is supposed to read at map scale and delivered the sourced
checklist. The check measured the drawn cell against that checklist on the real screen and
found the honest, verified-on-the-real-surface answer: the cell paints as empty desert, the
fix that already exists in the code never reaches it, and why, in the game's own words.
**BOTH ROUNDS SHIPPED. [the sign] E25 is done.**
