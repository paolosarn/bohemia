# BOHEMIA ADDENDUM: ASSET PACK INTAKE FACTORY (7/7/26, overnight build)

## WHAT IT IS
bohemia_pack_intake.py: the moment Paolo's purchased tile packs land in
chat, this processes them same turn. FACTORY LAW shape: zip in, judged
surfaces out.

## THE PIPELINE (built + gated on a synthetic pack)
1. EXTRACT: unzip, find every PNG recursively.
2. GRID DETECT: votes 16 vs 32 per sheet by alpha-seam scanning; --grid
   overrides.
3. SLICE: cuts tiles, drops fully-transparent cells.
4. DEDUPE: md5 per tile across ALL sheets; duplicates dropped (synthetic
   gate: 20 tiles in, 4 unique out, 16 dupes dropped).
5. PALETTE CENSUS: unique color count + top-24 swatches per pack (feeds
   the style-spec extraction when Paolo crowns a favorite).
6. CONTACT SHEETS: per source sheet, 4x-scaled, numbered tiles on the
   Bohemia dark ground, ready for thumbs; verdicts reference tile ids.
7. MANIFEST: BOHEMIA_PACK_MANIFEST.txt, the repo file that goes to the
   project at wrap.

## USAGE (Claude runs it, Paolo never touches it)
python3 bohemia_pack_intake.py pack.zip outdir [--grid 16|32|auto]

## NEXT LINKS IN THE CHAIN [waiting on packs landing]
- Style-spec extraction from the crowned favorite (palette, outline law,
  shading direction, proportion grammar) per the emulation-factory plan.
- Approved tiles wire into the texture tile factory (real tiles replace
  procedural painters) and prefab palette chars map to tile ids.
- 32x32 packs: intake at native, one-flag 2:1 downsample, both test
  neighborhoods shipped for Paolo's pick.
