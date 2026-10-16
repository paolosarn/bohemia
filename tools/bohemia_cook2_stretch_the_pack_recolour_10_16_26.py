#!/usr/bin/env python3
"""COOK TWO [stretch the pack] round three: FACTION RECOLOUR (rule 108 ROUND EIGHT (e): 'faction recolour as a
shade-to-shade remap on quantised tiles... faction colour goes on props and markings, not asphalt'). records/ only.
COLOUR IS TERRITORY (8/26): a gang marks its street. The four factions with an accent on the board
(engine/bohemia_cook3_runway_paint.json, COOK THREE's, read not copied): Reds #c0392b, Trades #d07a2a,
Caravans #caa05a, Anarchists #c026a0. Two of HIS parts take the colour, nothing else:
  * his zebra tile (street pack 15): only the PAINT (pixels much brighter than the tile's own asphalt median and
    low in saturation), the asphalt under and between the bars untouched bit for bit (asserted);
  * his striped barricade (barricades pack 13): only its red-and-white stripe paint (saturated reds and the
    near-white beside them), the wood, the posts and the lamps untouched (asserted).
  python3 tools/bohemia_cook2_stretch_the_pack_recolour_10_16_26.py
"""
import json, os, sys, colorsys
import numpy as np
from PIL import Image, ImageDraw
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook2_stretch_the_pack as S
paint = json.load(open(os.path.join(R, 'engine/bohemia_cook3_runway_paint.json')))['factions']
FACT = [(k, v['accentHex']) for k, v in paint.items() if 'accentHex' in v]
BAR = '3. Barricades and blockades'
zebra = S.pad(S.cut_frame(S.pack(S.ROAD, 15), S.ROAD), 82, 81)
z = zebra[..., :3].astype(int); zl = z.sum(2); zs = z.max(2) - z.min(2)
zmask = (zl > np.median(zl) + 150) & (zs < 60)
bar = S.pack(BAR, 13); b = bar[..., :3].astype(int); bs = b.max(2) - b.min(2); bl = b.sum(2)
red = (b[..., 0] > b[..., 1] + 60) & (b[..., 0] > b[..., 2] + 60)
white = (bl > 560) & (bs < 50)
bmask = (bar[..., 3] > 0) & (red | white)
rows = [('HIS', zebra, bar)]
for name, hx in FACT:
    zz = S.recolour(zebra, zmask, hx, sat_scale=0.45);   # road paint is thirty years washed (markings_30yr_law, his 7/14): the colour at under half
    bb = S.recolour(bar, bmask & ~white, hx)   # the white stays white: the stripe alternates
    assert (zz[~zmask] == zebra[~zmask]).all() and (bb[~bmask] == bar[~bmask]).all()
    rows.append((name.upper(), zz, bb))
Z = 3; cw = 82 * Z; bw = bar.shape[1] * Z
sheet = Image.new('RGB', (len(rows) * (cw + 16) + 10, 70 + 81 * Z + 20 + bar.shape[0] * Z + 30), (14, 14, 14)); d = ImageDraw.Draw(sheet)
for i, (n, zz, bb) in enumerate(rows):
    x = 6 + i * (cw + 16)
    d.text((x, 44), n, fill=(235, 235, 235))
    sheet.paste(Image.fromarray(zz[..., :3]).resize((82 * Z, 81 * Z), Image.NEAREST), (x, 62))
    im = Image.fromarray(bb).resize((bar.shape[1] * Z, bar.shape[0] * Z), Image.NEAREST)
    bg = Image.new('RGBA', im.size, (60, 58, 55, 255)); bg.alpha_composite(im); sheet.paste(bg.convert('RGB'), (x, 62 + 81 * Z + 20))
d.text((6, 6), 'HIS ZEBRA AND HIS BARRICADE, IN EACH FACTION\'S COLOUR (shade to shade; the asphalt and the wood untouched)  x3', fill=(235, 235, 235))
d.text((6, 24), 'ONE QUESTION: can you tell whose street it is from the paint?', fill=(235, 200, 120))
sheet.save(os.path.join(R, 'records/target/COOK2_STRETCH_THE_PACK_RECOLOUR.png'))
m = dict(factions=FACT, zebra_paint_px=int(zmask.sum()), zebra_px=int(zmask.size), barricade_paint_px=int((bmask & ~white).sum()),
         untouched='asserted bit for bit outside the masks')
json.dump(m, open(os.path.join(R, 'records/BOHEMIA_COOK2_RECOLOUR_10_16_26.json'), 'w'), indent=1); print(m)
