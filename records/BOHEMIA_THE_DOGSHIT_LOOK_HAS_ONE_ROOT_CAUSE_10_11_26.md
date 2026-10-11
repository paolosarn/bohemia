# THE DOGSHIT LOOK HAS ONE ROOT CAUSE

CHARACTER, 10/11. A measured finding, not a redesign. Rule 90: this lane
measures and reports, it does not rebuild another lane's door on its own
say-so.

## WHY THIS ROUND

Paolo said the characters look like dog shit, again, after already saying
it about [three bodies] ("looks like dogshit") and about the thirteen gang
looks ("like a seventh grader is making my game"). The fix that was already
moving, COOK THREE repainting clothes and materials on top of the rig, is
the right fix for the PAINT. It will never fully close the gap, because the
thing it is painting onto is not art. It is a formula.

Rule 108 landed today and names the mistake in the abstract: "we treated
art as a programming problem; that is the whole mistake... NO CHAT DRAWS A
PIXEL OR A CURVE IN CODE." This record points at the exact place in this
lane's own code where that mistake lives, so DIRECTION's [the master rig]
(rule 108 round eight b) has a real target instead of a theory.

## THE FUNCTION

`slices/BOHEMIA_ALPHA_0_9.html`, `buildFrame(d,clip,ph,_noOutline)`
(line 9982) plus `buildFrameCached` (line 10899) and `drawChar` (line
10915). A second, separate copy of `buildFrame` is baked into
`slices/BOHEMIA_DEMO.html` (line 9994) for the demo cut; two copies of a
~900-line function is its own REUSE-FIRST flag, noted but not this round's
job to fix.

Every person on screen, the player, the twelve CITY_CAST_LOOKS, the
thirteen FACTION_LOOKS, every enemy tier, every portrait's body, routes
through this one function. Measured call sites in the alpha alone:
`drawChar(` 9 times, `famPaintBody(` 7 times (the family, the roster, the
fight bake tools, the map's baked strips).

## WHAT IT ACTUALLY DOES

It does not draw from a sprite sheet or a pack tile. Per pixel, in order:

1. A skeleton is posed (`posedSkel`), then `SKINNERS[d].skin(P)` deforms a
   body template by the pose and the dial values into a `grid`: one
   body-part ID per pixel (head, torso, each limb).
2. For every filled pixel, a `GROUP` lookup decides which limb it belongs
   to, then a hand-written set of rules decides whether that pixel sits on
   a border (comparing it to its 4 neighbours: silhouette edge, limb vs
   torso, waist blend, shoulder blend) and picks `shade = 1` (darker) or
   `shade = 2` (base) from it.
3. The colour itself comes from `skinRampFor()`, a literal six-entry array
   built from `skinTone[1]`, hand-picked RGB triples such as `[28,22,24]`
   written directly in the function.

That is a human artist's three jobs, silhouette, anatomy shading, and
colour choice, each replaced by a fixed numeric rule written once and run
on every body in the game. It is exactly rule 108(a)'s "a pixel written as
a number in JavaScript," at the scale of the entire cast, not one asset.

## WHY THIS EXPLAINS THE PATTERN, NOT JUST THIS ROUND

COOK THREE's repaint changes the garment ramp (which colours get picked)
and the fold technique. It cannot change steps 1 and 2: the silhouette and
the anatomy shading are this function's fixed math, the same on every
faction, every tier, every portrait, before any paint lands. A palette
pass on top of a formula still reads as a formula underneath, which is the
"seventh grader" tell DIRECTION and Paolo both named on different rows
this week. The repaint was never going to fully close the gap by itself.

## WHAT THIS DOES NOT DO

It does not redraw a body, propose a fix inside this function, or touch
`slices/`, `engine/` or the demo (rule 100a). The rig is DIRECTION's door
under rule 108 round eight ("[eight through the rig]": "the rig is
DIRECTION's, you do not fork it") and [the master rig] already names the
replacement: a committed master .blend, one camera, one sun, the model
turning through eight facings, rendered on the free runner. This record
is the evidence that row needs: the current renderer's exact file, line
numbers, and mechanism, so the migration has a named target instead of a
guess, and the reason every future repaint on the old renderer will read
as dogshit no matter how good the palette gets.

## TAB

No tab. This is a diagnostic record, not a look; nothing to vote on as a
candidate. Seen in: this record and the VOTE registry's text entry.
