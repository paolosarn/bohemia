#!/usr/bin/env python3
"""THE FIGHT'S WEIGHT, the picture (MOTION 3, 11/10/26, rule 443(e)): the slowed phone's own drawn frames of one blow, the fight as it
was beside the fight now. Reads the two staged runs of tools/bohemia_fight_weight.js (--stage --film --json, the weight off and on, AUTO
speed as run, the CPU slowed 4x) and lays every frame the page drew round the man from just before the blow lands, in order, a row a moment: the block on a shield, the shot,
the hit; the fight as it was on top of each pair, the weight under it (the title says the speed and the slow-down the runs used). Each frame carries its time from the blow's start.
  python3 tools/bohemia_fight_weight_picture.py OFF.json ON.json OUT.webp"""
import base64, io, json, sys
from PIL import Image, ImageDraw, ImageFont

def frames(r, k):
    m = r.get(k) or {}
    B = 500.0 / max(1, r.get('speed') or 1)
    t0 = (0.35 if k == 'shot' else 0.45) * B - 70   # from just before the blow lands (the shot's kick key, the blow's landing)
    out = []
    for t, url in (m.get('film') or []):
        if t < t0: continue
        out.append((t, Image.open(io.BytesIO(base64.b64decode(url.split(',', 1)[1]))).convert('RGB')))
    return out

def main(off_p, on_p, out_p, maxn=9):
    off, on = json.load(open(off_p)), json.load(open(on_p))
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 17)
        small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
    except Exception:
        font = small = ImageFont.load_default()
    rows = []
    names = {'block': 'A BLOCK ON A SHIELD', 'shot': 'A SHOT', 'hit': 'A HIT'}
    for k in ('block', 'shot', 'hit'):
        a, b = frames(off, k), frames(on, k)
        if not a or not b:
            continue
        rows.append((names[k] + ' - BEFORE (the fight as it was)', a[:maxn]))
        rows.append((names[k] + ' - NOW', b[:maxn]))
    if not rows:
        print('no frames'); return 1
    fw = max(f.width for _, fs in rows for _, f in fs)
    fh = max(f.height for _, fs in rows for _, f in fs)
    sc = max(1, min(3, 150 // max(1, fw)))
    cw, ch = fw * sc, fh * sc
    pad, lab = 8, 26
    W = pad + maxn * (cw + pad)
    H = 44 + len(rows) * (lab + ch + 18 + pad)
    img = Image.new('RGB', (W, H), (16, 13, 11))
    d = ImageDraw.Draw(img)
    d.text((pad, 10), "THE FIGHT'S WEIGHT: every frame a slowed phone drew (AUTO %sx, the CPU %sx slower), one blow a row" % (on.get('speed', 1), on.get('cpu', 1)), fill=(232, 220, 196), font=font)
    y = 44
    for title, fs in rows:
        d.text((pad, y + 4), title, fill=(240, 196, 120) if 'NOW' in title else (170, 160, 150), font=font)
        y += lab
        for i, (t, f) in enumerate(fs):
            x = pad + i * (cw + pad)
            img.paste(f.resize((f.width * sc, f.height * sc), Image.NEAREST), (x, y))
            d.text((x + 2, y + ch + 2), '%d ms' % t, fill=(200, 190, 175), font=small)
        y += ch + 18 + pad
    img.save(out_p, 'WEBP', quality=88, method=6)
    print('wrote', out_p, img.size)
    return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1], sys.argv[2], sys.argv[3]))
