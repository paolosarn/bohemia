# EYES AND EARS -- E25 [the sign] -- ROUND ONE OF TWO: SCHOOL
## NO MEASURING THIS ROUND. This is desk research, armed for round two.
### 9/28/26 -- session eyes-5vql33

Row: COOK [fortress buildings] round 3 (58e62e8f) drew the Welcome to Las Vegas sign at one
cell, and its own record already named three things wrong with it even while its numbers said
it was fine: a lens instead of a diamond, no shadow, a slab apron. School first: how a
landmark is supposed to read at map scale; round two checks the drawn cell against the real
sign.

---

## FIRST, THE PREMISE CHECK RULE 12 ASKS FOR

This lane's own map has been rebuilt more than once in the three weeks since that cook landed
(the honest grid, the cell board, the reversal back to house tiles, and today's map-at-
Battle-Brothers-pixel-count ruling). Before researching anything, the row's own subject had to
still exist to research it. It does: `vegassign` is a real, live-computed landmark in
`engine/bohemia_overmap.js` (its cell moves with the generated seed, `stripX+dirE*1+1,
stripEndY+2`, not a fixed literal -- the row's own "55,65" was one seed's answer, not a
constant), and its drawing code is still wired into the current map tab
(`slices/BOHEMIA_MAP_CURRENT.html`, `engine/bohemia_landmarks.js`). **The premise holds.**
Round two checks the drawing itself, not whether there is a drawing to check.

---

## WHAT THE CRAFT SAYS ABOUT A TINY ICON THAT HAS TO STILL READ

Three convergent sources (cartography's own icon-legibility literature, general UI/HUD icon
design practice, and the specific published history of the real sign) all point at the same
three levers, which happen to line up exactly with the three things COOK's own eye already
caught:

1. **THE SILHOUETTE HAS TO BE THE RIGHT SHAPE, NOT A ROUNDED STAND-IN.** Cartographic guidance
   is blunt about this: map icons must be legible at sizes as small as **11 px**, which means
   the shape itself carries the whole read -- geometric, simple shapes survive shrinking,
   complex ones do not. "A lens" (a rounded ellipse) and "a diamond" (a shape with pointed
   top and bottom corners) are not the same silhouette at any size, and at map scale the
   silhouette IS the icon.
2. **A SHAPE SITTING ON NOTHING DOES NOT READ AS STANDING ON GROUND.** Both the cartographic
   and the game-UI literature name the same fix for this, by the same word: a **drop shadow**
   (or an outline/scrim doing the same job) is the standard, near-universal treatment that
   tells the eye an object is raised off the surface behind it, at any scale. COOK's own
   finding ("no shadow") is not a taste note, it is the textbook's own missing ingredient.
3. **THE GROUND ITSELF HAS TO READ AS THE RIGHT KIND OF GROUND.** A "slab apron" (a plain
   poured-concrete look) reads as a different real-world surface than what the reference
   plot actually is. This is the same lesson COOK's own round 2 already cited (Learning From
   Las Vegas: a Vegas commercial plot is SIGN + SHED + PARKING IN FRONT, and the lot's own
   texture -- striped asphalt -- is itself one of the most legible man-made textures there is,
   named in that same round's citation, TG-05). A slab apron is the wrong texture for the same
   real-world referent the cook already correctly identified.

---

## THE REAL SIGN'S OWN SHAPE, SOURCED, FOR ROUND TWO TO CHECK AGAINST

The real "Welcome to Fabulous Las Vegas" sign (Betty Willis, 1959, standing since at 5100 Las
Vegas Blvd S) has a specific, well-documented silhouette, not a generic rounded shape: **a
horizontally-stretched diamond, pointed at the top and bottom corners, rounded at the left and
right corners** (the shape was borrowed from the Goodyear logo of its era, chosen specifically
because most signs of the time were rectangular and this one was not). Crowning it, between
the two support poles, is an eight-pointed star. Across the top, white circles (meant to read
as silver dollars) spell WELCOME, each ringed in neon. **"A lens" reads as a plain ellipse with
no points at all -- the exact detail (pointed top and bottom) that makes the real shape
recognizable is precisely what a lens throws away.**

---

## WHAT ROUND TWO IS ARMED TO CHECK, NAMED SPECIFICALLY

1. **The silhouette**, against the sourced shape above: pointed top and bottom corners,
   rounded sides -- not an ellipse. One number: does the drawn shape have the two required
   points, yes or no.
2. **A shadow or grounding treatment**, present or not, and if present, whether it survives at
   the map's own zoomed-out pixel size (a shadow too subtle to survive downscaling is the same
   defect as no shadow, one step removed).
3. **The apron's texture**, against the striped-asphalt reference COOK's own round 2 already
   cited, not a plain slab.
4. **Whether the shape still reads at a glance at the CITY tab's own zoomed-out size** -- the
   cartographic literature's own bar (legible as small as 11 px) is a number this row can
   actually take a screenshot and check against, not an opinion.

This lane does not decide whether the sign SHOULD be redrawn or by whom -- that is DIRECTION's
and COOK's call. Round two's job is the same as every round in this lane: put a number beside
what a stranger's eye would see, on the real surface, once.

---

## ROUTED

Nothing. Nothing was measured this round; there is nothing yet to bounce back.

## SHIP TEST FOR THIS ROUND

School asked for how a landmark is supposed to read at map scale and the published rules for
a tiny icon that still has to read correctly. Delivered: the three converging sources (map-icon
legibility at small sizes, the drop-shadow/grounding convention, and the real sign's own
sourced, specific silhouette) that line up exactly with the three things COOK's own eye already
caught, plus the exact shape description round two needs to check the drawn cell against.
**Round one SHIPPED. Round two measures.**
