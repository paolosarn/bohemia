# BOHEMIA HD TILE REPO — MANIFEST (7/8/26)

## What this is
Everything downloaded today, cut into proper squares via connected-components,
at HD resolution (96px cap — crisp for pixel-art on TV/desktop). This is the
SOURCE OF TRUTH. Any bad cut in the game gets re-cut from these masters.

## Contents
- 8,674 HD tiles across 294 apocalypse-appropriate packs
- Off-tone packs (ocean, fantasy, egypt, sports, snow, lava, magic) excluded
- Footprint-tagged: 1x1=6171, 2x1=831, 1x2=1198, 2x2=474
  (multi-cell tags flag doorways / big objects that span >1 grid cell)

## Files (4 chunks, ~45MB each, under transport limits)
- BOHEMIA_HD_TILE_REPO_part1.txt  (73 packs)
- BOHEMIA_HD_TILE_REPO_part2.txt  (72 packs)
- BOHEMIA_HD_TILE_REPO_part3.txt  (76 packs)
- BOHEMIA_HD_TILE_REPO_part4.txt  (73 packs)

## Format (JSON in .txt for iOS safety)
{version, note, chunk, footprints, packs:{theme:[{b64,fp,w,h}]}}

## Law
- These are MASTERS. Alpha renders downscaled copies for play; masters stay HD.
- New session: read these from project. Never re-upload the raw 1.26GB packs.
- Bad cut in game -> re-cut from the master here.
- 3 packs failed to cut (timeout edge) — re-run if any specific one is needed.
