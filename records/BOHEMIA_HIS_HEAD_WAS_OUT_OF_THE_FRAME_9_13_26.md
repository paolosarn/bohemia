# HIS HEAD WAS OUT OF THE FRAME
ANIMATION lane, 9/13/26. VAMILY row `[redo killed]`, round four.
Both headshot clips, which are two of the 47 he thumbed down.

## THE RULING THIS BREAKS, AND IT IS HIS OWN
> TRACKING CAMERA (Paolo 7/2/26): "the whole body stays in frame for the entire
> fall, every knock direction, at STABLE SCALE (camera law: never zoom, but
> panning to keep the body visible is the law's whole point)."

## WHAT WAS ACTUALLY ON SCREEN
Measured from a deterministic reset, stepping the ragdoll by hand so the answer
does not depend on when the probe looked:

    t      body top   body bottom   height    canvas is 112 rows
    0        -16          72          88
    0.2      -13          69          82
    0.45     -11          67          78
    0.72      -9          65          74
    1         -3          54          45

Sixteen rows of head above the top edge, for the whole fall. The drawn sprite's
top sat at row 0 in every single frame -- **he was watching a headless body drop.**
MOTION VISIBLE had been red on main for both clips on exactly this, and it read
"the top of the sprite drops (0px)".

## THE CAUSE: FOUR CAMERAS STILL WRITTEN FOR A 56-ROW CANVAS
The alpha has four camera blocks -- the tracking pan, the crumple pan, the
fixed-frame corpse and the ragdoll centroid -- and every one had its numbers typed
out by hand: 28, 27, 34, 50, 53, 54, 52, 2, 3. Every one of those is a 56-row
canvas.

BAKED is 112x112 and RIG_RS is 2. A body just STANDING spans 88 rows: head 14,
feet 102. 88 is larger than every "too big" threshold in those blocks, so the
oversize branch fired on every frame of every fall and centred a 112-space body on
**row 28** -- the middle of a canvas half this one's height.

The law's own text says "the per-frame body span always fits (the body folds as it
falls); only the full-fall envelope exceeds the canvas". That premise was false for
the same reason, so the pan was not absorbing an overflow -- it was creating one.

## THE FIX
One derivation, `rigFrame()`, and four callers. Margins, centre and the too-big
threshold all come from the canvas and the cell scale. **At RIG_RS 1 on a 56 canvas
it reproduces every number that was typed before**, so the original rig is provably
untouched, and it cannot drift again when the rig changes size.

    after:  body top 14 -> 45, bottom 101 -> 108, never outside the canvas
            headshot sprite top drops 8 -> 10, headshot-2 drops 16 -> 22
            MOTION VISIBLE 24/0, and it had been 22/2 on main

## THE GATE
`gates/his_head_is_in_the_frame_gate.js`, in the suite as HEAD IN FRAME. Twelve
claims: rigFrame exists; no camera types a 56-space number any more (a code claim,
because the pixels prove today and that claim stops tomorrow); no joint leaves the
top OR the bottom for either clip; neither drawn body is clipped at row 0; both
actually fall; and a control.

### THE CONTROL WAS VACUOUS AND TWO MUTATIONS FOUND IT
The first cut compared **idle's** head to the rest rig -- and idle never passes
through any of these four blocks, so a mutation that shoved the frame thirty rows
down the screen passed it and every other claim. A control has to be a body the
code actually touches. It is the headshot's FIRST frame now: the standing pose,
which does go through the tracking pan and already fits, so the camera must leave
it exactly where the rest rig puts it.

The second hole was the same shape: the gate collected the joints that left the
BOTTOM of the frame and never asserted on them, so a corpse shoved thirty cells
down passed everything. His law says the WHOLE body; a foot out of the bottom is as
far out as a head out of the top.

Four mutations, all caught, two of them only after those repairs:
  M1 the rig before this fix        -> 9 claims red (-16 above the edge, 8 of 8 clipped)
  M2 the ragdoll camera types 28/34 -> 4 claims red
  M3 the tracking margin shoves a fitting body -> 1 red
  M4 the corpse biased thirty cells low        -> the bottom-edge claim red

## WHERE HE SEES IT
Tab: ANIMATION, clips `headshot` and `headshot-2`. Before: a headless body. After:
the whole man, head included, toppling inside the frame.

## HIS FOUR BEATS ARE STILL NOT MET, AND THAT IS THE NEXT PIECE
Section 9 of laws/BOHEMIA_ADDENDUM_ANIMATION_REBUILD_AND_ANATOMY_7_2_26.md is his
verbatim spec: "head snaps back on impact (0 to 0.08), torso/body gives FIRST and
knees fold (0.10 to 0.45), arms hold UP on inertia while the body drops (0.15 to
0.35), torso falls BACK with a hard resistance clamp so it NEVER folds into the
waist, arms come in slightly LAST (0.72 to 1)."

Measured against the fall now, the beats do not land:
  - head snaps back 0 to 0.08: the head moves ONE row in that window
  - knees fold 0.10 to 0.45: the knee angle goes 15 degrees to 1 -- it STRAIGHTENS
  - arms hold UP 0.15 to 0.35: the hand drops 68 to 90 while the waist drops 63 to
    87, so the arms travel WITH the body instead of lagging it
  - arms come in last 0.72 to 1: this one does happen
That is the remaining headshot work, and it is a ruling, so it gets done to his
text beat for beat whatever any measurement says about the rest.

RULE 14 (9/13): alpha and workshop only. The demo was NOT re-cut; RUN cuts it.
