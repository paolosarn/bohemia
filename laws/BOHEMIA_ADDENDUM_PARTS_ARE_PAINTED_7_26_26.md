# BOHEMIA ADDENDUM — EVERY PART IS ALREADY PAINTED, BY ITSELF (Paolo 7/26/26, LOCKED)

Paolo's words: "imagine when you're making the animations, like if you turned
the arms on and off, what would the torso be doing already? You know, I feel
like it's so overcomplicated... that's why I made the whole rig bro, like so
that way everything should already be painted for their individual body parts
first. That goes for clothing, that goes for the skin. It's so annoying."

## THE LAW

Every body part and every garment is a COMPLETE, SELF-CONTAINED painted thing.
Turn any other part off and what remains is still whole and still correct.

A part's appearance is a property OF THAT PART. It is never a function of what
happens to be next to it on screen this frame. No renderer rule may look at a
part's neighbours to decide how that part looks — not its tone, not its edge,
not its line, not its shading. Compose parts by draw order; never derive one
part's pixels from another's.

This applies to SKIN and to CLOTHING equally, and it is the reason the rig
exists: he painted each region separately so that animation would be assembly,
not recalculation.

## WHY HE HAD TO SAY IT (measured 7/26 on the shipped alpha)

HIS ART ALREADY OBEYS THIS. Verified in the data, east facing:
- torso: 116 painted pixels, a SOLID blob, **zero holes**, box x24-31 y16-32
- arm-L: 83 pixels, of which **73 sit directly on top of painted torso**
- same on W; S and SE differ only by their own silhouettes

So turn the arm off and the torso really is a complete torso. "All the pieces
are made how they should be made" was a statement of fact, and it checks out.

THE RENDERER DOES NOT OBEY IT. `buildFrame` throws the part's identity away and
recomputes every skin pixel's tone each frame from the COMBINED deformed grid:
a dark ANATOMY LINE wherever an orthogonal neighbour is empty or belongs to a
different limb GROUP, and a light SKY TOP-LIGHT wherever the two cells above are
empty. So the torso's shading is drawn from where the arm happens to be that
frame. In profile the arm sits inside an 8px torso, so a one-pixel swing
reclassifies whole runs between skin and line and back the next frame — 88% of
all E/W strobe is that single pair of tones flipping.

That is his question answered literally: today, if you turned the arms off, the
torso would still be carrying the arm's shadow, because the line was never the
torso's own.

## THE HOLE THIS EXPOSES, AND IT IS THE REAL ONE

`BAKED.layers[dir][part]` is a list of pixel INDICES. Shape only. **The body
carries no painted colour at all** — not per part, not anywhere. Every skin tone
on screen is synthesised by the renderer at draw time from geometry.

So the law above cannot be fully satisfied by the current data. The rig defines
each part's SHAPE completely and independently, exactly as he says. It defines
none of their COLOUR. That gap is not a bug in one pass; it is the reason a pass
had to guess in the first place.

Two ways to close it, and it is his call which:
1. **He paints it.** The rig gains per-part tone painting; the renderer carries
   what he painted and derives nothing. This is the rig-is-law answer and it is
   what his words describe.
2. **The machine bakes a starting point.** A per-part tone map is computed ONCE
   at rest from each part's OWN outline, written into the rig as a colour
   channel he can then repaint by hand, and the renderer carries it. Nothing is
   reshaped, so RIG LAW holds; it just gives him something to correct instead of
   a blank.

## MEASURED, SO THE CHOICE IS NOT BLIND

Shading each part from its own outline alone, carried through the deform
(E and W, 30 clips x 24 phases):

    today, re-derived from the combined grid : 4.37 tone flips per frame
    each part shaded from its own shape only : 2.83 tone flips per frame  (35%)

It does not reach zero, and the reason matters: the residual is no longer the
shading rule at all, it is the inverse sample landing a screen cell on a
different SOURCE pixel between frames. Every shading variant tested bottoms out
in the same place (an earlier variant classified against the whole rest body and
reached 2.02 by producing fewer line pixels overall, not by being more stable).
Once the tone stops being re-derived, what is left is the resampler, and that is
a different problem with a different fix.

## CONSEQUENCE FOR THE SHOULDER

Per-part outlining gives the arm a full line where it meets the torso, which
collides with his earlier SHOULDER BLEND ruling ("arm and torso are not two
countries with a border"). Under this law that is not a renderer rule to tune —
it is a painting decision, and it belongs to him. Which pixels carry a line is
part of what "already painted" means.

## GATE

`gates/parts_are_painted_gate.js` — no renderer rule may read a part's
neighbours to decide that part's appearance, and each part's painted shape must
stay complete and independently whole (torso solid under the arms, no holes).
