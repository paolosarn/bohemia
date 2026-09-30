# NO TWO TEXTS OVERLAP ON THE DEMO (RUN, 9/30/26)

VAMILY `[demo text]`, rule 44c.

> **PAOLO 9/29, said again:** *"for the demo bro you gotta keep in mind when texts are overlapping
> each other. I don't know why it's so fucking difficult for you to understand when text is
> overlapping each other."* His screenshot: the quest line at the top running under the phone.

## HOW IT WAS MEASURED (and three ways the first ruler lied)

Every visible text box on the page at phone size: DOM text in the shell and in the world frame,
plus the map's drawn name plates. Two boxes overlapping, or a text under something, is a finding.

1. **Scrolled-away feed lines read as "under the canvas".** A text box has to be clipped to what its
   scrolling containers actually show, or the phone's whole feed reports as buried. Clipped.
2. **Labels that refuse fingers were invisible to the ruler.** The quest line is
   `pointer-events:none`, so asking the browser what is on top at a point skipped it and named the
   map instead. The paint order is now read with pointer-events forced on.
3. **A see-through box's edge is not a cover.** The left rail's box reached over a speed button
   with nothing painted there. "Under" now means something that PAINTS is on top: a fill, a
   border, an image, a canvas, a drawing, or its own text.

And one thing that is not an overlap, named so nobody re-finds it: **the phone's cracked glass
(`#cityfeedglass`) lies over the phone's own feed on purpose.** That is the cracked iPhone he ruled.

Each surface is measured with a LONG quest line. The short one never wraps, and a check that only
sees the easy case cannot fail.

## WHAT IT FOUND AND WHAT CHANGED

| Surface | Found | Fixed |
|---|---|---|
| demo + alpha map | the quest line is the whole frame's width and the phone sits over its right side, so a long line wraps into the phone (26 x 5 px on the demo): **his screenshot** | the line gives up exactly the room the phone takes, read off the phone's box every render (never a copied width). It lives in a flex column whose children are forced `margin:0 !important`, so the room is an inline `!important` right margin |
| demo | the gear sits over the top-left of the world frame and the quest line's second line ran under it (11 x 5 px) | the demo's quest line starts past the gear |
| alpha map | the HOLD TO WALK lesson (this lane's own, 9/12) still rang on the map, and its caption sat on the new 3x and 5x speed buttons | the walk lesson is the street's; on the map it waits |
| alpha map | the street hint "move on the streets. time moves when you move." covered a town's name plate | on the map the street hint steps aside (the demo strips it outright, 18g) |

**Now: the demo 32 text boxes, 0 overlapping, 0 under anything. The alpha map 46, 0 and 0. The
quest line ends at 239 px and the phone starts at 245.**

## CHECK

**NO TWO TEXTS OVERLAP ON THE DEMO**, new, 14/0, registered slow. Mutations, each caught and
restored: the line not fitted -> 4 red; the walk lesson on the map -> 1 red; the demo line under the
gear -> 2 red. The walk-lesson leg asks the lesson itself, because when its caption is up depends on
the beat and a census taken between beats passed with the bug in (measured: the first version of
this mutation came back green).

PLUMBER `[no overlap]` is the suite-wide gate the row names. This one holds what RUN fixed.
