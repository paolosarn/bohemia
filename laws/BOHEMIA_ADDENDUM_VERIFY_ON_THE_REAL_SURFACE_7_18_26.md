# BOHEMIA — VERIFY ON THE REAL SURFACE LAW (7/18/26, Paolo, LOCKED)

Born from the six-round hoodie saga. Paolo, on the finally-fixed hoodie:
*"whatever took you so long, record that down so that way you never have these
fucking issues ever again."* This is that record, as law.

## What actually happened (the anatomy of six wasted rounds)
One symptom — "skin keeps showing on the hoodie" — survived five fixes because
FOUR separate defects were stacked, and my verification was broken in a way that
hid three of them:

1. **Render-order bug.** The SKIN_DETAIL pass ran AFTER the garment hook and
   repainted the neck skin over every hood, every frame. No amount of redrawing
   the hood could ever win. (Fix: garment renders LAST.)
2. **Blanket rule wrong per facing.** The hood painter's "never paint over head
   pixels" rule is right for the FACE but wrong from BEHIND — a hood drapes over
   the lower skull. It left a skull-shaped skin hole in the hood's center.
3. **Inherited behavior.** genTop carves a small crew-NECK HOLE at the throat
   (intentional for shirts). The hoodie inherited the carve in every facing —
   that hole WAS the skin patch in every screenshot.
4. **LYING PROBES (the reason 1–3 took six rounds instead of one).** My
   verification called buildFrame directly with a capture-only preview hook —
   which renders a DIFFERENT image than the preview canvas (no garment applied,
   the paper-doll outfit still equipped). Every "verified clean" was measured on
   the wrong pixels while Paolo screenshotted the real ones.

## THE LAW
1. **Art is judged ONLY on the surface Paolo sees.** Verification must read the
   pixels of the real preview canvas / the real alpha render path. A probe that
   reconstructs the render through a side door is not verification; it is a lie
   with extra steps. If the probe and Paolo's screenshot disagree, the probe is
   wrong by definition.
2. **Look before shipping.** Render the actual pixels (zoomed AND at normal
   scale, all 8 facings for anything on the rig) and EYEBALL them before any
   art change ships. Paolo is the judge, never the QA.
3. **A symptom that survives content changes is a PIPELINE bug.** After the
   second failed redraw, stop redrawing and audit order/state/inheritance.
4. **Blanket rules must be audited per facing.** Any "never/always paint X"
   rule on the rig must be checked from front, side, AND back — anatomy
   changes with the camera.
5. **Shared generators: audit what a new type inherits.** Adding a garment type
   to an existing generator inherits every carve/detail/behavior in it. Walk
   them all, on purpose.

## The gate (a law without a machine gate is not enforced)
`gates/hood_gate.js` (wired into `bohemia_gates.py`, always-run) machine-locks
the concrete regressions: extracts the REAL genTop from the alpha and asserts —
hood collar paints EVERY neck pixel; hood fills the neck carve (zero unpainted
torso); crew shirts still keep their intentional neck hole; the back-view hood
covers the lower skull and adds outside-the-skeleton geometry. Reintroduce any
of the four defects and the suite goes red.

Rules 1–2 are workflow (mine to obey, recorded here and pointed to from
CLAUDE.md); rules 3–5 ride every future factory.
