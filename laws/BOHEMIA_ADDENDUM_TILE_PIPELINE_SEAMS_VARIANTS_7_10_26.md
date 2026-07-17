# BOHEMIA — TILE PRODUCTION PIPELINE: VERDICTS -> SEAMS -> VARIANTS (7/10/26, Paolo)

## The pipeline order (Paolo, locked)
1. **VERDICTS** — Paolo thumbs-up/down the work (list delivered 7/10/26).
2. **SEAM FIX (re-crop)** — approved tiles get processed so repeating textures
   read as ONE integrated surface, NOT Lego blocks stacked side by side.
   The current crops butt hard edges against each other; the fix is edge
   treatment / re-crop so same-texture neighbors flow together.
3. **VARIANT FACTORY** — every APPROVED block becomes a template: Claude
   generates ~3 more versions of that same block. Approval unlocks volume.
   (Factory Law applied to tiles: approved = seed, variants = batch output,
   purity gate = regression gate on every generated variant.)

## Seam-fix candidate approaches (to prototype for Paolo's judgment)
A. **Edge cross-fade**: blend a few edge pixels with the wrapped opposite edge
   so any tile meets itself and its siblings smoothly.
B. **Offset-wrap repair**: shift the texture 50%, heal the visible cross seam,
   shift back — makes a tile truly self-tiling (classic texture technique).
C. **Shared-border normalization**: force all tiles in one category to share a
   common border tone band so any-to-any adjacency blends.
Feathered patch-scatter (already in the buffet) helps placement variety but
does NOT fix the hard tile-edge problem — that needs per-tile processing.

## Rules
- Seam processing runs AFTER verdicts, on APPROVED tiles only.
- Every processed tile and every generated variant passes the purity gate.
- HD masters stay untouched — seam-fixed copies are new bakes, re-cuttable.

## PENDING PAOLO
- Verdicts on the 18-item list
- Seam approach pick once prototypes are in front of him
- Variant count per approved block (default ~3, his call)
