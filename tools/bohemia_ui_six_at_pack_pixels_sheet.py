"""THE SIX AT PACK PIXELS, the sheet (UI [icons at full pixels] + [the crew button], 10/13/26).
Composes, never draws: the bar screenshots the driver took (before, now, candidate A, candidate B) and his
pack props pasted whole at 1:1. Writes the sheet and its manifest; gates/the_six_at_pack_pixels_gate.py
re-crops every cut from the sheet and compares it to the pack file pixel for pixel.
python3 tools/bohemia_ui_six_at_pack_pixels_sheet.py <dir with bar_before.png bar_now.png bar_after_A.png bar_after_B.png>"""
import sys, json
from PIL import Image, ImageDraw, ImageFont
S = sys.argv[1]; P = 'reference/art_bank/prop/'
SETS = {'A': {'batteries': 'pack_11_survival_props_045', 'food': 'pack_11_survival_props_042', 'meds': 'pack_12_weapons_and_supplies_030',
              'rounds': 'pack_12_weapons_and_supplies_018', 'tape': 'pack_11_survival_props_039', 'water': 'pack_11_survival_props_004'},
        'B': {'batteries': 'pack_11_survival_props_044', 'food': 'pack_11_survival_props_035', 'meds': 'pack_11_survival_props_007',
              'rounds': 'pack_11_survival_props_031', 'tape': 'pack_12_weapons_and_supplies_027', 'water': 'pack_16_loot_and_survival_props_032'}}
ORDER = ['batteries', 'food', 'meds', 'rounds', 'tape', 'water']
OLDX = {'batteries': 23, 'food': 59, 'meds': 84, 'rounds': 109, 'tape': 134, 'water': 159}   # the old icons' x on the bar, in points
BG = (28, 24, 20, 255); W = 1170; INK = (242, 228, 198, 255); AMB = (240, 196, 106, 255); GREY = (190, 180, 160, 255)
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
sm = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 11)
shot = lambda n: Image.open(S + '/' + n).convert('RGBA')
before = shot('bar_before.png')
blocks = [('BEFORE: the bar on your phone, 1:1. The six are 10 x 10 drawings; the grey ring is the one you called a noose', before),
          ('NOW: the noose is deleted. Its slot keeps the count and draws nothing until you pick', shot('bar_now.png')),
          ('A: the six cut whole from your survival packs at their own 96 pixels, plus a CREW button on glass', shot('bar_after_A.png')),
          ('B: six other cuts from the same packs, CREW on a receipt like NOTES', shot('bar_after_B.png'))]
sh = Image.new('RGBA', (W, 4000), BG); d = ImageDraw.Draw(sh)
d.text((16, 10), 'THE SIX AT PACK PIXELS + THE CREW BUTTON  (UI, one sheet, 1 art px = 1 phone px)', font=F, fill=AMB)
y = 46; man = {'sheet': 'records/target/UI_ONE_AT_A_TIME_THE_SIX_AT_PACK_PIXELS.png', 'bg': list(BG), 'cuts': []}
man['shots'] = {}
for (t, b), key in zip(blocks, ['before', 'now', 'A', 'B']):
    d.text((16, y + 10), t, font=f, fill=INK); y += 40; sh.alpha_composite(b, (0, y)); man['shots'][key] = {'y': y, 'h': b.height}; y += b.height + 22
man['crew_pt'] = [281, 3, 52, 44]; man['dpr'] = 3; man['icon_box_pt'] = 32   # read off the driver: the CREW button's box and the candidate's icon box
d.text((16, y + 8), 'THE CUTS BESIDE WHAT THEY REPLACE, 1:1: the old drawing (30 px), then A, then B. Every cut is his tile, not one pixel changed', font=f, fill=INK); y += 44
for k in ['A', 'B']:
    x = 16
    for s in ORDER:
        if k == 'A':
            sh.alpha_composite(before.crop((OLDX[s] * 3, 60, OLDX[s] * 3 + 30, 90)), (x, y + 33))
        im = Image.open(P + SETS[k][s] + '.png').convert('RGBA')
        px, py = x + 40, y + (96 - im.height)
        sh.alpha_composite(im, (px, py))
        man['cuts'].append({'set': k, 'supply': s, 'src': P + SETS[k][s] + '.png', 'x': px, 'y': py, 'w': im.width, 'h': im.height})
        n = SETS[k][s]; i = n.rfind('_', 0, len(n) - 4)
        d.text((x, y + 102), k + ' ' + s, font=f, fill=AMB)
        d.text((x, y + 122), n[:i + 1], font=sm, fill=GREY); d.text((x, y + 136), n[i + 1:], font=sm, fill=GREY)
        x += 190
    y += 96 + 64
sh = sh.crop((0, 0, W, y + 6)); sh.save(man['sheet'])
json.dump(man, open('records/target/UI_THE_SIX_AT_PACK_PIXELS.json', 'w'), indent=1)
print(man['sheet'], sh.size)
