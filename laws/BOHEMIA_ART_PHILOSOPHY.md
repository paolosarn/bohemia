# BOHEMIA — ART PHILOSOPHY (Claude's rules, written down at Paolo's demand)
# This is the standard. Re-read before authoring ANY sprite/clothing/hair/headwear.

## 1. KEEP EVERYTHING. CURATE AT THE END.
Never delete or throw away an asset Claude has made just because we iterate. Keep every variant, catalog it. Near ship, Paolo decides what to keep and what to cut and we repackage. Mid-stream destruction of past work is not allowed.

## 2. CONSISTENCY ACROSS ALL 8 DIRECTIONS IS NON-NEGOTIABLE.
- Build every piece from ONE coverage rule applied to the head/body box across ALL facings, so directions cannot drift.
- Claude renders the FULL 8-direction turnaround and eyeballs it side-by-side HIMSELF before anything ships. Never ship a piece checked on a single angle.
- "Front looks great, back/side is wrong" is the #1 failure. A piece is not done until it reads right from every angle.

## 3. MALE HAIR MUST READ MALE FROM EVERY ANGLE.
If it's a dude, the hair has to look like a dude's hair from front, side, AND back. No feminine curls, flips, or "1950s model" back-of-head shapes. Masculine = simpler, blockier, no dainty curl tips. Check the BACK specifically — that's where it goes feminine.

## 4. HEADWEAR IS DESIGNED ASSUMING HAIR UNDERNEATH.
Most characters have hair, and that hair sits ~2-3px out from the edge of the head. NEVER design a hat/beanie/durag to fit a bald head only — it looks like garbage on a haired character. Design headwear so hair shows around the edge (sides + bottom), and verify the hat+hair COMPOSITE on the turnaround, not just the hat alone.

## 5. SIMPLE SOLID SHAPES BEAT FUSSY DETAIL.
Straight clean lines and full solid coverage over clever rounding. Rounding/clearing corners creates notches, gaps, and bald-spots. When in doubt: solid fill, straight hem, full coverage. Pixel real estate is precious — shape by clean silhouette, not by adding borders or speckle.

## 6. HAIR IS SUBTRACTIVE, NO BORDER.
Fill the scalp, carve the face open, no dark outline border (the border is what makes hair read like a helmet). Shape comes from negative space.

## 7. REFERENCE IMAGES WIN.
When Paolo sends a reference (front + side), match that real object. Inventing volume per-angle from imagination is how drift happens.

## THE BAR
Paolo has compared friction here to working with Grok. The fix is discipline, not talent claims: ONE rule across all angles, self-check the turnaround every time, keep everything, design for hair under hats, simple solid shapes. Every piece, every time.

## 8. ACCESSORIES ARE ONE 3D OBJECT ROTATED — NOT 8 DRAWINGS.  [the core fix, 6.29.26]
Paolo's exact diagnosis: "every time you make pixel art for accessories you make eight independent pieces that don't communicate and don't make logical sense in the 360." That is THE bug. Before drawing any accessory, define it as one physical object and ask, for each facing, "where is this real object now?":
- GLASSES = two lenses that sit OVER the eyes + a bridge + two temple arms that run back and STOP AT THE EARS. So: front = both lenses + bridge; 3/4 = both lenses + the near arm heading back; SIDE (E/W) = the lens is IN FRONT over the eye, the arm runs back to the ear; BACK = only the arm by the ear, NEVER a floating line across the skull.
- The #1 tell of "8 independent drawings" is a stray line or shape on the back/side that doesn't connect to anything. If a mark doesn't correspond to where the real object is at that angle, delete it.
- Author the eyes/ears positions FIRST (per direction), then hang the accessory on those anchors, so it lands logically every time.

## 9. BASELINE HAT FIT (the durag is the reference object).
Every hat sits over hair, so the minimum width is +2px past the head edge on the LEFT and +2px past on the RIGHT, on ALL angles. How LOW it comes toward the face varies per hat, but that width is the floor. The durag is the canonical fit; new hats inherit at least its width.

## 10. PORTRAIT ANGLE (standard for every portrait).
Portraits are NOT a flat 90° straight-on. Standard = frontal yaw (face square to camera, 0° left-right) + about a 15° HIGH angle (camera slightly above eye level, looking down). This shows more crown/forehead, the eyes engage upward, the jaw foreshortens slightly. Shoulders/body are pulled UP into the frame (shifted north), face stays put. This reads alive instead of like a mugshot. Square frame or circle frame, the angle is the same.

## 11. PROFILE EYE SITS ON THE FRONT CONTOUR (E/W).  [6.29.26]
In a side view the eye is NOT sunken into the middle of the face. It sits right on the front border of the head silhouette, with the nose tip just past it. Anchor the side-view eye to the contour, then hang the lens/brow on it.

## 12. CLAUDE BUILDS 85%, PAOLO FINISHES THE LAST 15% (the collaboration model).
Claude does the heavy structural work (the 3D-object logic, all 8 directions, the base shape). The final taste-level dial-in is faster for Paolo to touch by hand than to describe in words. The Character Lab has a built-in pixel editor (DRAW) for exactly this: Paolo paints directly on any layer/direction, it updates the live character and persists. His hand-edits then become the canonical asset (the generated layer was only the starting point). This is the friction-killer: instead of describing a 1-pixel fix five times, he just does it.

## 13. THE DURAG IS THE HAT-WIDTH FLOOR (encoded in code).  [6.29.26]
Recorded in punk_full.py as `hat_bounds(h) -> (h[0]-1, h[2]+1)`. Every hat Claude makes must be AT LEAST this wide on every facing (may extend lower toward the face, never narrower). The durag width is correct for all head shapes; it is the canonical minimum. Never author a hat to a bald head.

---

## CUTOUT ANIMATION STYLE (LOCKED 6.29.26 — deliberate, never "fix" it)
Bohemia animates on a hard-pivot paper-doll skeleton. **Joints swing visibly and limbs are not
seamlessly connected at the elbow/knee — ON PURPOSE.** This is a chosen aesthetic, a flash-era /
Newgrounds cutout callback (Madness Combat, Xiao Xiao, early swivel-limb animation), and it fits
Bohemia's paranoid, grounded, duct-taped-survivor tone better than smooth AAA motion would. Future
sessions must NOT try to smooth, blend, or hide the joints. The jank is the signature.
- No overlap-tuning, no joint-blob covers, no seam-hiding required. This is a permanent speedup.
- The ONLY thing we still do at joints: keep each pivot sitting just inside the sprite so a limb
  rotates out of the shoulder/hip rather than detaching off a corner — so it reads as attached to a
  person, not flying off. That's attachment, not smoothing.
- Consequence (the unlock): clothing approved once on the standing character, mapped to the
  skeleton, wears through EVERY pose and animation with no redraw. One skeleton drives idle, walk,
  crouch, aim, sit, sleep, lean, carry, and canned knockdowns. We are building the animation system
  for the whole game, not a dial minigame.
- Ragdoll: **canned knockdown poses** (a few hand-tuned dropped poses the skeleton snaps through)
  are the cheap, great, do-now option. True physics ragdoll (per-frame gravity + joint constraints)
  is a separate later bolt-on, not the free thing.
