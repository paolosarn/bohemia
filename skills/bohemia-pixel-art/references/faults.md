# THE FAULTS, AND THE LIMITS HIS OWN TILES SET (DIRECTION 10/11)

## THE FINDING: OUR OLD CRAFT AUDIT FAILS HIS PACKS
The 7/27 craft laws and their audit (tools/bohemia_pixel_craft_audit.py, gates/pixel_craft_gate.py) were written for
low-colour pixel art: "a document of palette indices". His packs are not that. Run on 25 of his tiles a family:

| family | exact-colour orphans | single-use colours | clusters per 1000 px | pixel size | banding | light (deg) | jaggy steps |
|---|---|---|---|---|---|---|---|
| road | 94% | 78% | 958 | 1 | 0 | 253 | 30% |
| ground | 97% | 90% | 981 | 1 | 0 | 242 | 20% |
| settlement | 96% | 87% | 966 | 1 | 0 | 251 | 25% |
| door | 94% | 78% | 956 | 1 | 0 | 265 | 60% |
| lamp | 97% | 94% | 975 | 1 | 0 | 254 | 24% |
| prop | 92% | 87% | 939 | 1 | 0 | 254 | 21% |
| marking | 95% | 78% | 967 | 1 | 0 | 266 | 11% |

The craft gate's caps are 12% orphans on average, 35% single-use colours, 120 clusters per 1000 px. His tiles sit at
92 to 97%, 78 to 94% and about 960. Judged by those caps, every tile he bought would be sent back. So on HIS KIND of
tile those three are not faults. What his tiles DO keep, and what we keep with them:
- **one pixel size** (block 1 in every family): no mixels, never scaled by a non-integer;
- **no banding** (0 in every family);
- **light from above** (240 to 266 degrees, where 270 is straight up and 180 is left: above, a little left);
- **stray pixels at the level of light and dark**: quantised to 8 value steps, a pixel no 4-neighbour shares is 6 to
  12% of a tile (median), 7 to 19% at the ninetieth. That is the real cluster rule on his tiles, and the check uses it.

## THE CATALOGUE (what the check catches, where the rule comes from)
| fault | the measure | the limit | source |
|---|---|---|---|
| under the floor | long side | the family's tenth (96 for most) | rule 105 |
| too few colours (a ramp, not a surface) | distinct colours | the family's fewest tenth | the card |
| leans on a few colours (banded, posterised) | share of the top 8 | the family's ninetieth | the card |
| flat (no range) | value span 5th to 95th | the family's tenth | the card |
| loud | saturation median | the family's ninetieth | the card |
| lit wrong | top half minus bottom | the family's tenth | the card; craft law 7 |
| outlined wrong | edge ring minus the ring inside | inside the family's band | the card; craft law 3 |
| flat fills | 16-step run length | the family's ninetieth | the card; craft law 8 |
| noise | stray pixels at 8 steps | the family's ninetieth | above; craft law 1 restated |
| mixels | block size | exactly 1 | craft law 9 |
| banding | eyes tool banding share | 0 | craft law 5 |
| seams | a 3 x 3 of the tile, diff the joints | no line you can see | rule 104b; craft law 12 |
| no source | the asset's path line | present | ROUND ELEVEN |

NOT measured, DIRECTION's eye: does it read at 16 x 16, is the wear authored, does it sit in its scene, is it analog
horror (one calm wrong thing, never a filter).
