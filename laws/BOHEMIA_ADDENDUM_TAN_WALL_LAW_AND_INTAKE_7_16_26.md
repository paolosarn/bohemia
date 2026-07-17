# BOHEMIA — TAN WALL LAW + GUARDED INTAKE (7/16/26)

## 1. TAN WALL LAW is now code

Your wall-picks ruling (7/14):

> "85% of Vegas walls are desert yellow tan brick vibes — create tan versions,
> keep originals; pool weighted 85% tan / 15% original"

That was filed as a direction and never wired. It is now a law inside
`BOH_TILEPOOL`, `TAN_SHARE = 0.85`.

**The two axes are independent.** A wall is (tan | original) AND
(parent | weathered). They draw on separate hash salts, so tan walls weather at
exactly the same rate original walls do — 12% either way. If tan rode the same
salt as weathering, every tan wall would also be the weathered one, and the
Strip would grow a pattern nobody asked for.

Same law that governs weathering governs this: **the draw keys on the FINE
CELL, never on the family.** Keying on family is the V6-0 bug — whole runs of
wall flip together instead of scattering per cell.

Opt-in by data: the tan axis only exists if a pool was actually given tan
siblings. Ground, street and water pools are untouched. A pool that is all tan
with no originals left does not invent a phantom axis.

**Gate: `tan_gate.js`, 12/12.** Measured over 200,000 fine cells: tan 85.03%,
weathered 12.02%. Tan rate *inside* the weathered bucket also 85% — that check
is what proves independence rather than assuming it.

## 2. GUARDED INTAKE — the revert loop is closed

Twice this session an upload drop silently reverted the engine. Both times the
sync gate caught it afterwards. A gate that catches a revert after the fact is
worse than an intake that cannot perform one.

`bohemia_intake.py` replaces blind copying:

- file not in the working dir → copied, no question
- byte-identical → skipped
- **differs AND carries a `BOH_` module → NOT overwritten.** Kept as
  `.incoming` and reported, so a diff is a decision instead of an accident
- differs, not a carrier → copied, old kept as `.prev`. Nothing is destroyed

The protection is on the **carrier**, not the label. Reverting
`bohemia_slice_core.js` is exactly as bad as reverting the declared canon file,
because the sync gate then has to arbitrate between two live bodies. My first
cut only protected declared-canon filenames and it let two carriers through on
the very same run — fixed, and the fix is what the third column of the intake
report proves.

## Gate status
- sync gate: 11 modules, zero drift
- graphics suite: 83 / 0
- tan gate 12/12 · scale gate 12/12 · lightreg gate 25/25 · V11 gate 13/13

## Noted from this drop, not acted on
- **DOOR RARITY LAW** (7/10): doors are 2x2 or 3x2 multicell, never 1x1. The
  demo room tileset still lists its door as 1x2. Flagged, not touched — the
  re-cut is an art pass, and NO-TRANSFORM LAW says I do not squish my way there.
- **E/W doors**: crop the painted frame-edge strip from approved frontal art.
  Width options are yours to pick. Nothing generated.
