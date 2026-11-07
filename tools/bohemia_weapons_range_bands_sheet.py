#!/usr/bin/env python3
"""WEAPONS 11/7: the range bands' VOTE sheet (VAMILY rule 187(c), ask line 108).

Cuts the proof frames (tools/bohemia_weapons_range_bands_proof_11_7_26.js -> records/target/weapons_range_bands/proof/) round
the shooter, six panels in two columns (the rifle, the scope, the pistol, the shotgun, the bow, the shotgun on a roof), each
with what the fight itself says under it (reachWords), into records/target/weapons_range_bands/sheet.webp.

    python3 tools/bohemia_weapons_range_bands_sheet.py
"""
import json, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'records/target/weapons_range_bands')
NAMES = {'light_crossbow': 'RIFLE', 'scoped_deer_rifle': 'SCOPED DEER RIFLE', 'dagger': 'PISTOL', 'pump_shotgun': 'SHOTGUN',
         'hunting_bow': 'BOW', 'pump_shotgun_roof': 'SHOTGUN ON A ROOF'}
ORDER = ['light_crossbow', 'scoped_deer_rifle', 'dagger', 'pump_shotgun', 'hunting_bow', 'pump_shotgun_roof']


def font(n):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(f): return ImageFont.truetype(f, n)
    return ImageFont.load_default()


def main():
    j = json.load(open(os.path.join(D, 'proof/proof.json')))
    fr = {f['name']: f for f in j['frames']}
    PW, PH, CAP = 560, 330, 66
    sheet = Image.new('RGB', (PW * 2 + 30, (PH + CAP) * 3 + 40 + 70), (18, 16, 14))
    g = ImageDraw.Draw(sheet)
    g.text((15, 18), 'RANGE BANDS: a striped ring is where his shot is worse; the tape says by how much', font=font(19), fill=(232, 224, 204))
    for i, k in enumerate(ORDER):
        f = fr[k]; im = Image.open(os.path.join(D, 'proof', k + '.png')).convert('RGB')
        S = 3.0; c = f['crop']; at = f['at']
        cx0 = c['x'] * S; cy0 = c['y'] * S; tw = c['w'] * S / 9.0; th = c['h'] * S / 7.0
        x0 = max(0, int(cx0)); y0 = max(0, int(cy0)); x1 = min(im.width, int(cx0 + c['w'] * S)); y1 = min(im.height - 600, int(cy0 + c['h'] * S))
        p = im.crop((x0, y0, x1, y1))
        r = min(PW / p.width, PH / p.height); p = p.resize((max(1, int(p.width * r)), max(1, int(p.height * r))), Image.LANCZOS)
        col, row = i % 2, i // 2
        X = 10 + col * (PW + 10); Y = 70 + row * (PH + CAP + 10)
        sheet.paste(p, (X + (PW - p.width) // 2, Y))
        g.text((X + 4, Y + p.height + 6), NAMES[k] + (' (one storey up)' if f.get('roof') else ''), font=font(20), fill=(202, 201, 193))
        g.text((X + 4, Y + p.height + 32), (at or {}).get('words', ''), font=font(17), fill=(232, 224, 204))
    out = os.path.join(D, 'sheet.webp'); sheet.save(out, 'WEBP', quality=86)
    print(out, sheet.size, os.path.getsize(out))


if __name__ == '__main__':
    main()
