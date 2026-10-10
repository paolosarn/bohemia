#!/usr/bin/env python3
"""COOK FOUR [one at a time], asset two: THE RANCH WITH A GARAGE, drawn the pack's way.

His word on asset one (10/10): 'good direction, good job, keep going'.  So the same rules, one step
further: a Las Vegas ranch is a house AND a garage.  Two front gables side by side, never a roof plan:
  the house  5. Roof tiles #10 (clay gable) over his tan plaster (Wall tiles (1) #0), his broken window
             (5. Windows and broken glass #0) and his door (4. Doors and entrances #2), halved by BOX
  the garage 5. Roof tiles #11 (slate gable, a later add-on in a cheaper roof) over the same plaster,
             his roll-up shutter (11. Industrial doors and gates #1) as the garage door
Every piece at its own pixels, nothing scaled up (rule 105).  Our paint: shade under the eaves,
the 1 px brown-black outline, a contact shadow (the study page's numbers).

Output to reference/art_bank/settlement/ and records/target/ (rule 100: never slices/ or engine/).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 and his slate cottage #31 at 1:1 and 3x on the sheet,
  and asset one (COOK4_ONE_HOUSE_THE_PACKS_WAY) which he called good direction.
  structure taken: front gables only; 96 px pieces native; light from above; dark outline.
  what changed: a second gable and a garage, the Vegas ranch's shape; a roll-up door.
"""
import os
from PIL import Image, ImageDraw
from bohemia_cook4_one_house import A, outline, _over, AB, ROOT

def wall_with(w, h, items):
    plaster = A('settlement/pack_wall_tiles_1_000.png')
    wall = Image.new('RGBA', (w, h)); x = 0; k = 0
    while x < w:
        wall.alpha_composite(plaster.crop((0, 10 + 7 * k, 77, 10 + 7 * k + h)), (x, 0)); x += 73; k += 1
    for im, px, py in items:
        wall.alpha_composite(im, (px, py))
    sh = Image.new('RGBA', wall.size); sd = ImageDraw.Draw(sh)
    for i in range(12): sd.rectangle([0, i, w, i], fill=(30, 20, 14, 110 - i * 9))
    return outline(_over(wall, sh))

def ranch():
    door = A('door/pack_4_doors_and_entrances_002.png'); door = door.resize((door.width // 2, door.height // 2), Image.BOX)
    win = A('settlement/pack_5_windows_and_broken_glass_000.png'); win = win.resize((win.width // 2, win.height // 2), Image.BOX)
    shut = A('door/pack_11_industrial_doors_and_gates_001.png'); shut = shut.resize((int(shut.width * .7), int(shut.height * .7)), Image.BOX)
    clay, slate = A('settlement/pack_5_roof_tiles_010.png'), A('settlement/pack_5_roof_tiles_011.png')
    WALL = 62
    c = Image.new('RGBA', (200, 56 + WALL + 8))
    house = wall_with(86, WALL, [(win, 6, 10), (door, 86 - door.width - 8, WALL - door.height)])
    garage = wall_with(86, WALL - 6, [(shut, (86 - shut.width) // 2, WALL - 6 - shut.height)])
    gnd = Image.new('RGBA', c.size); ImageDraw.Draw(gnd).ellipse([0, 56 + WALL - 5, 200, 56 + WALL + 5], fill=(30, 22, 16, 110))
    c.alpha_composite(gnd)
    # the garage sits behind and to the right, a step lower: it was added later
    c.alpha_composite(garage, (104, 56 + 6)); c.alpha_composite(slate, (99, 6 + 2))
    c.alpha_composite(house, (9, 56)); c.alpha_composite(clay, (4, 0))
    return c

def sheet(h):
    t1, t2 = A('settlement/pack_5_roof_tiles_030.png'), A('settlement/pack_5_roof_tiles_031.png')
    one = A('settlement/COOK4_ONE_HOUSE_THE_PACKS_WAY.png')
    S = Image.new('RGBA', (1100, 520), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'LEFT: his pack houses (#30, #31) and our house one.   RIGHT: house two, the ranch with a garage, only his pieces.   Top 1:1, bottom 3x.', fill=(230, 220, 200))
    S.alpha_composite(t1, (30, 50)); S.alpha_composite(t2, (125, 50)); S.alpha_composite(one, (220, 40)); S.alpha_composite(h, (360, 40))
    S.alpha_composite(t1.resize((t1.width * 3, t1.height * 3), Image.NEAREST), (20, 200))
    S.alpha_composite(h.resize((h.width * 3, h.height * 3), Image.NEAREST), (420, 160))
    return S

if __name__ == '__main__':
    h = ranch()
    h.save(os.path.join(AB, 'settlement/COOK4_HOUSE_TWO_THE_RANCH.png'))
    sheet(h).save(os.path.join(ROOT, 'records/target/COOK4_HOUSE_TWO_THE_RANCH.png'))
    print('ranch', h.size)
