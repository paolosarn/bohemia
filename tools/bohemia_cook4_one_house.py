#!/usr/bin/env python3
"""COOK FOUR [no roof tops] + [one at a time]: ONE house, drawn the pack's way, on one sheet beside its twin.

Paolo 10/10 (his YES with a note on the settlement): 'in this world I'm not able to see the top of the
houses'.  The pack never draws a roof plan.  Its house (5. Roof tiles #30) is a FRONT GABLE: the two
roof slopes seen edge-on from the front, the gable end facing you, the wall under it, a dark outline.
This house is built that way and ONLY from his pieces, at 1:1 (no scaling up: rule 105, the pack is a
96-pixel world):
  roof   5. Roof tiles #10   (the clay front gable, 96 x 70, his)
  wall   Wall tiles (1) #0   (the cracked tan plaster: Las Vegas stucco, his)
  door   4. Doors and entrances #2, window 5. Windows and broken glass #0 (his, halved by BOX, never redrawn)
Our paint: a contact shadow, the wall's shade under the eave (light from above, the study page's
top-minus-bottom +9.3), and the 1 px dark outline the pack puts round every piece.

Output to reference/art_bank/settlement/ and records/target/ (rule 100: never slices/ or engine/).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 and 3x, beside this one on the sheet; the
  study page records/BOHEMIA_COOK4_HOW_THE_PACK_DID_IT_THE_PLACES_10_10_26.md (318 tiles measured).
  structure taken: the front gable, no roof plan; 96 px on the long side; dark outline; light from above.
  what changed: the pack's timber face becomes Las Vegas stucco with a wood door and a broken window.
"""
import os
from PIL import Image, ImageDraw, ImageChops, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AB = os.path.join(ROOT, 'reference/art_bank')
def A(p): return Image.open(os.path.join(AB, p)).convert('RGBA')

def outline(im, col=(28, 18, 14, 255)):
    a = im.split()[3].point(lambda v: 255 if v > 128 else 0)
    grown = a.filter(ImageFilter.MaxFilter(3))
    ring = ImageChops.subtract(grown, a)
    o = Image.new('RGBA', im.size, col); o.putalpha(ring)
    out = Image.new('RGBA', im.size); out.alpha_composite(o); out.alpha_composite(im); return out

def house():
    roof = A('settlement/pack_5_roof_tiles_010.png')            # 96 x 70
    plaster = A('settlement/pack_wall_tiles_1_000.png')         # 77 x 96
    door = A('door/pack_4_doors_and_entrances_002.png')
    win = A('settlement/pack_5_windows_and_broken_glass_000.png')
    W, WALL = 96, 62
    c = Image.new('RGBA', (W + 8, 70 - 14 + WALL + 6))
    # the wall: his plaster, two pieces side by side, cropped to the house's width
    wall = Image.new('RGBA', (W - 10, WALL))
    wall.alpha_composite(plaster.crop((0, 10, 77, 10 + WALL)), (0, 0))
    wall.alpha_composite(plaster.crop((10, 20, 10 + W - 10 - 77 + 4, 20 + WALL)), (77 - 4, 0))
    d = door.resize((door.width // 2, door.height // 2), Image.BOX)
    w = win.resize((win.width // 2, win.height // 2), Image.BOX)
    wall.alpha_composite(w, (8, 10)); wall.alpha_composite(d, (wall.width - d.width - 10, WALL - d.height))
    # light from above: the wall darkens under the eave (the study page: top is +9.3 lighter)
    sh = Image.new('RGBA', wall.size); sd = ImageDraw.Draw(sh)
    for i in range(12): sd.rectangle([0, i, wall.width, i], fill=(30, 20, 14, 110 - i * 9))
    wall = _over(wall, sh)
    wall = outline(wall)
    base_y = 70 - 14
    gnd = Image.new('RGBA', c.size); ImageDraw.Draw(gnd).ellipse([0, base_y + WALL - 5, W + 8, base_y + WALL + 5], fill=(30, 22, 16, 110))
    c.alpha_composite(gnd.filter(ImageFilter.GaussianBlur(2)))
    c.alpha_composite(wall, (9, base_y))
    c.alpha_composite(roof, (4, 0))
    return c

def _over(b, fo):
    m = b.split()[3]; fo.putalpha(ImageChops.multiply(fo.split()[3], m)); return Image.alpha_composite(b, fo)

def sheet(h):
    twin = A('settlement/pack_5_roof_tiles_030.png')
    S = Image.new('RGBA', (1000, 470), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'LEFT: his pack house (5. Roof tiles #30).   RIGHT: ours, built only from his pieces.   Top row 1:1, bottom row 3x.', fill=(230, 220, 200))
    S.alpha_composite(twin, (60, 60)); S.alpha_composite(h, (260, 60))
    S.alpha_composite(twin.resize((twin.width * 3, twin.height * 3), Image.NEAREST), (40, 170))
    S.alpha_composite(h.resize((h.width * 3, h.height * 3), Image.NEAREST), (400, 110))
    d.text((760, 200), 'No roof from above:', fill=(230, 220, 200)); d.text((760, 218), 'the front gable and', fill=(230, 220, 200))
    d.text((760, 236), 'the roof edge only.', fill=(230, 220, 200)); d.text((760, 270), 'Stucco, a wood door,', fill=(230, 220, 200))
    d.text((760, 288), 'broken window: Vegas.', fill=(230, 220, 200))
    return S

if __name__ == '__main__':
    h = house()
    h.save(os.path.join(AB, 'settlement/COOK4_ONE_HOUSE_THE_PACKS_WAY.png'))
    sheet(h).save(os.path.join(ROOT, 'records/target/COOK4_ONE_HOUSE_THE_PACKS_WAY.png'))
    print('house', h.size)
