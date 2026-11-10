#!/usr/bin/env python3
"""THE CAMP IS SET UP ON THE BOARD WHILE HE WATCHES, the picture (MOTION 3, 11/10/26, rule 444(a)): the glass as he sees it from the MAKE
CAMP tap, the order as it was on top (the climb out to the map, the camp grown back in, the clock running) and the order now under it
(the board held, his men setting the camp up on it, the clock still, then the hours). Reads the shots the gate keeps
(gates/the_camp_is_set_up_on_the_board_gate.js --shots DIR: before.json, now.json); each frame carries its time from the tap and the
camp's clock.
  python3 tools/bohemia_camp_set_up_picture.py DIR OUT.webp [N]"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

def pick(idx, n):
    S = idx['shots']
    if not S: return []
    end = idx.get('endT') or S[-1]['t']
    want = [end * i / (n - 2) for i in range(n - 1)] + [end + 1200]
    out = []
    for w in want:
        best = min(S, key=lambda q: abs(q['t'] - w))
        if not out or best is not out[-1]: out.append(best)
    return out

def clock(c):
    if c is None: return ''
    m = int(c) % 1440
    return '%02d:%02d' % (m // 60, m % 60)

def main(d, out_p, n=8):
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 17)
        small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
    except Exception:
        font = small = ImageFont.load_default()
    rows = []
    for tag, title in (('before', 'BEFORE: the order as it was'), ('now', 'NOW: the camp set up on the board while he watches')):
        p = os.path.join(d, tag + '.json')
        if not os.path.exists(p): continue
        idx = json.load(open(p))
        fr = Image.open(idx['fight']).convert('RGB')
        rows.append((title, [('the fight', None, fr)] + [('%.1f s' % (q['t'] / 1000.0), q['clock'], Image.open(q['file']).convert('RGB')) for q in pick(idx, n)]))
    if not rows:
        print('no shots'); return 1
    tw = 170
    th = max(int(im.height * tw / im.width) for _, fs in rows for _, _, im in fs)
    pad, lab = 10, 30
    W = pad + max(len(fs) for _, fs in rows) * (tw + pad)
    H = 46 + len(rows) * (lab + th + 40 + pad)
    img = Image.new('RGB', (W, H), (16, 13, 11)); dr = ImageDraw.Draw(img)
    dr.text((pad, 12), "MAKE CAMP after a won fight: the glass from the tap (its time, the camp's clock under it)", fill=(232, 220, 196), font=font)
    y = 46
    for title, fs in rows:
        dr.text((pad, y + 6), title, fill=(240, 196, 120) if title.startswith('NOW') else (170, 160, 150), font=font)
        y += lab
        for i, (t, c, im) in enumerate(fs):
            x = pad + i * (tw + pad)
            img.paste(im.resize((tw, int(im.height * tw / im.width)), Image.LANCZOS), (x, y))
            dr.text((x + 2, y + th + 4), t, fill=(220, 210, 190), font=small)
            if c is not None: dr.text((x + 2, y + th + 21), 'clock ' + clock(c), fill=(200, 170, 120), font=small)
        y += th + 40 + pad
    img.save(out_p, 'WEBP', quality=86, method=6)
    print('wrote', out_p, img.size)
    return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 8))
