# BOHEMIA ADDENDUM — RENDER LIKE THE RIG (7/26/26)
# and: WHERE THE E/W MORPHING ACTUALLY COMES FROM

Paolo 7/26: "The east and west animations are still dog shit when it comes to
morph pixels underneath the arms and the back leg in the back arm. All the
pieces are made how they should be made bullshit look at the rig."

He said look at the rig. This is what looking at the rig found, and — more
importantly — what it did NOT fix.

## PART 1 — THE RENDERER WAS NOT THE RIG

`Skinner.skin()` is commented as "the engine-side twin of BOHEMIAN_RIG.html's
draw loop". Decoding `RIG_B64` and diffing its draw loop against the alpha's:

    pass                      his rig      the alpha
    inverse sample (seg)      yes          yes  (identical maths)
    segd / cohereBind         yes          yes
    refineMask / refineSkin   yes          yes
    JOINT WELD                NO           yes  (retired earlier 7/26)
    EVERY PIXEL LANDS         NO           yes  (retired here)
    FAR-ARM DARKENING         NO           yes  (retired here)

Three passes the alpha invented on top of his rig. All three are now retired.
The two retired here sit behind `SKINNER_API.RIGFAITH.on`, so the A/B is
re-runnable rather than a claim.

- **EVERY PIXEL LANDS** forward-splatted any painted pixel the inverse sample
  missed into "the nearest FREE screen cell". In profile the arms sit inside the
  torso footprint and the legs inside each other, so the destination was
  whatever gap the overlap happened to leave that frame — and a different gap
  the next frame.
- **FAR-ARM DARKENING** repainted the far arm at 62% brightness, with `farArm`
  set on E and W ONLY: the exact two facings he named. The mask was read off the
  deformed grid per pixel per frame, including for garment cells, so a 1px swing
  flipped whole columns between 62% and 100%.

Measured on the real surface, 102 clips x 8 facings x 24 phases:

    invented pixels (on-screen minus painted)
    ALL FACINGS   33,400 -> 18,284   (45% removed)
    E + W          7,879 ->  3,356   (57% removed)
    arm-L on E+W   2,984 ->  1,118
    arm-R on E+W   2,167 ->    578

## PART 2 — AND IT DID NOT FIX WHAT HE IS LOOKING AT

Invented pixels are not the same thing as visible morphing. The metric that
matches his eye is STROBE: a cell that changes and changes straight back across
three consecutive frames (there/gone/there, or tone A/B/A). A rigid limb
swinging past you never does that.

Measured on the COMPOSITED frame, E and W:

    both passes on (what he judged) : 4.65 strobing pixels per frame
    both passes retired             : 4.74 strobing pixels per frame

**It did not move.** Three renderer changes this session, all measurably
correct, none of them the thing he is watching. Recorded plainly because the
alternative is leading with the 57% and calling it fixed, which is the failure
mode STOP PRODUCING exists to kill.

## PART 3 — WHERE THE STROBE ACTUALLY IS

Naked (5.39/frame) is WORSE than dressed (4.74/frame), so it is the BODY, not
the clothing. It concentrates on sprite rows 22-25 and 31 — the arm-over-torso
band. And the tone pairs doing it are, without exception, pairs of body skin
ramp tones; 88% of them are one single pair:

    3,143   191,175,166  ->  153,137,129     base skin -> anatomy line
    2,363   153,137,129  ->  191,175,166     anatomy line -> base skin

**The body is not drawn from painted pixels at all.** `buildFrame` throws away
tone and recomputes it every frame from the DEFORMED grid:

- a dark ANATOMY LINE wherever an orthogonal neighbour is empty (outer
  silhouette) or belongs to a different limb GROUP (arm against torso), and
- a light SKY TOP-LIGHT wherever the two cells above are empty.

Both read a silhouette that wobbles a pixel per frame. In profile the arm sits
inside an 8px torso, so a one-pixel swing reclassifies whole runs of pixels
between skin tone and line tone — and back the next frame. Split by rule:
group-vs-group 3.48 flips/frame, outer silhouette 1.76, together 4.36.

That is the morphing underneath the arms and on the back arm and leg. It is not
the skinner. It is the LIGHTING/LINE layer being re-derived under the animation
— which is Paolo's own 7/26 ruling
(`BOHEMIA_ADDENDUM_SHADOWS_ARE_SEPARATE_7_26_26.md`) being broken by the body
itself, not just by the garments it was written about.

## PART 4 — THE CANDIDATE FIX, MEASURED, NOT SHIPPED

Bind the anatomy line to the REST pixel (where he painted it) and carry it
through the SAME inverse sample the art rides, so the line travels WITH the limb
instead of being re-derived under it:

    today (re-derived per frame) : 4.36 line flips per frame
    rest-bound line              : 2.02 line flips per frame   (54% removed)

Halves the dominant defect. **Does not cure it** — the residual is the inverse
sample landing a cell on a different source pixel between frames — and it is
NOT shipped. Two things were ruled out first, both measured, both null:

- pose quantization (joints snapped to 1/2px and 1px): no effect
- rigid limb stamp (exact rest bone length, angle snapped to 48/32/24/16/12/8
  steps): 4.76 -> 3.32 per frame even at 45-degree steps, which would wreck the
  poses. Not the answer.

## THE STANDING RULE THIS LEAVES

A render pass that the rig does not have is a pass that has to justify itself in
measured pixels or come out. `gates/render_like_the_rig_gate.js` locks the three
retirements and ratchets the audit so none of them can quietly come back.

Evidence, re-runnable end to end:
`node tools/bohemia_profile_morph_audit.js` -> `records/BOHEMIA_PROFILE_MORPH_AUDIT_7_26_26.txt`
