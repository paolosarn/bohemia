# BOHEMIA ADDENDUM — THE BACK ARM WEARS ITS SLEEVE (Paolo 7/26/26)
# it was never a shading bug, and his own words diagnosed it

Paolo: "It's looking a lot better. It's still not perfect. There's still like
fucked up colored pixels, like fucked up MATH colored pixels that do weird random
shit... I'm so confused as to why the back arm and the back leg, in whatever
direction I'm facing, it just can't have the proper clothing, still pixelated...
I don't want it to be a different shade off the bat, and if you make it a
different shade that's a whole different layering process that isn't actually
color-coded on the clothing pixel wise."

## WHAT IT ACTUALLY WAS

Garment coverage per limb, measured over 20 clips x 8 facings x 24 phases — the
fraction of a limb's pixels carrying a GARMENT colour rather than bare skin:

    facing   near arm    FAR arm
    S          72.5%      66.1%
    SE         72.1%      68.8%
    E          62.5%      11.0%   <-- the back arm is NAKED
    NE         72.8%      67.2%
    N          65.2%      68.5%
    NW         75.3%      61.5%
    W          67.2%       6.8%   <-- the back arm is NAKED
    SW         64.4%      65.4%

**On E and W the back arm rendered bare skin.** That is why it read as "a
different shade off the bat": it WAS a different colour, because it was skin and
not cloth. Nothing was darkening it — the far-arm darkening has been retired since
earlier today, and the far/near colour audit confirms the two limbs share the same
colour set (0 to 0.5% exclusive to the far side).

## THE MECHANISM

On E, part 5 and part 6 each have 83 painted pixels and they **SHARE 49 of them**,
and his shirt already covers BOTH at ~90% at rest. The clothing was never missing.

**A shared rest pixel can only bind to ONE bone.** The binder resolves through the
composited rest grid, where the near arm wins, so the sleeve rode the near arm and
the far arm arrived undressed. His art was correct the whole time; the binding was
taking it.

## THE FIX

The far arm gets its OWN deform pass, binding the garment pixels already sitting
on its own footprint to its own bones. Same garment, same ramp, **SAME COLOURS, no
darkening.** If depth should read darker that is a separate layer by his 7/26
SHADOWS ARE SEPARATE ruling, and it is deliberately not done here.

    facing   FAR arm before -> after
    E            11.0%  ->  42.4%
    W             6.8%  ->  47.7%

Near arm is 63-67%, so the gap closes from +52/+60 points to +21/+20. The residual
is the part of the far arm's footprint the garment genuinely does not paint at
rest. Legs unchanged, zero morph unchanged (still 0 on every proof clip), all dial
configs still clean on the real surface.

## THE WRONG TURNS, RECORDED SO THEY ARE NOT REPEATED

1. **The first audit was wrong.** It tested whether an on-screen colour exists in
   his painted palette. Garments store ramp INDICES that are then TINTED, so legal
   tinting invents RGB by design — the test claimed 67% of the character was
   "invented", which is nonsense. Replaced with a near-vs-far comparison, which is
   what his sentence actually described.
2. **Inventing fill colour.** A row-dominant guess filled uncovered far-limb cells
   and painted skin-toned pixels onto limbs. That is inventing art, which
   REUSE-FIRST forbids. Now only a garment colour ALREADY on that cell passes
   through.
3. **Letting the pass win cells by rank.** It overwrote the near limb's sleeve —
   near thigh on E fell from 88.8% to 78.9%. A pass meant to dress the back limb
   must never undress the front one. It is now restricted to the far limb's own
   cells.
4. **Running it on the legs.** They never had the defect (far thigh was within ±8
   points on every facing) and the pass made them worse. Arms only.
5. **Running it on the HANDS** (found 7/27/26, from Paolo's screenshot: *"on east
   and west the clothing is a little fucked up towards the actual hands, it might
   look like there's like two sets of hands"*). He was right, and it was this
   pass. The far hand has a **13-pixel painted footprint — exactly the same size
   as the near hand** — so dressing it laid a second hand-sized garment cluster
   right beside the real one. At 56x56, two same-sized clothed blobs a few pixels
   apart read as two hands, which is precisely what he saw. The defect this pass
   exists for was the back **ARM** arriving naked; the hand was never part of it.
   The pair list is now `[[6,5]]` / `[[5,6]]` and the pass paints **0** of those
   13 cells. The arm fix survives the change: E far arm 41.0% dressed, W 46.6%.

   **THE PATTERN ACROSS 4 AND 5:** this pass has now been over-extended twice, to
   legs and to hands, both times by applying it to a part that did not have the
   defect. A fix that is *good* is not thereby *general*. Scope it to the thing
   that was measured broken, and measure again after widening it.

## STILL OPEN

- The lone-pixel fringe: 4.04% of his rest art is already single pixels matching no
  neighbour, and animation adds ~1% more on edges. The "inside a solid region" kind
  does NOT grow with animation (2.06% at rest, 1.96% animated), so the specks he
  sees inside forms are his own painted detail, not renderer noise. The edge fringe
  is the resample, and it is the same root cause as everything else in
  `BOHEMIA_ADDENDUM_OWN_CANVAS_7_26_26.md`.
- THE BODY SLIDERS, untouched and still broken for a separate reason.

Tool: `tools/bohemia_dress_the_back_limb_patch.py` (idempotent).
Audit: `tools/bohemia_invented_color_audit.js` -> `records/BOHEMIA_BACK_LIMB_COLOR_AUDIT_7_26_26.txt`.
Gate: `gates/back_limb_gate.js`.
