"""MOTION 3, ask row 560 (THE CAMP LETS GO WHEN HE LEAVES): the VOTE card's picture. Two leaves of a street camp on the slowed phone
(tools/bohemia_camp_leave_frames.js, the way it was and now), each the 6 s from his tap drawn as a strip: every frame the page drew a
tick, a gap over half a second red, the page's long tasks under it (the camp's board page, behind the map, in orange).

    python3 tools/bohemia_camp_leave_picture.py OFF.json ON.json OUT.webp
"""
import json
import sys
from PIL import Image, ImageDraw, ImageFont

W, PAD, MS = 1170, 40, 6000


def fonts():
    try:
        return (ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 34),
                ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 25),
                ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22))
    except OSError:
        f = ImageFont.load_default()
        return f, f, f


def x_of(t):
    return PAD + (W - 2 * PAD) * max(0, min(MS, t)) / MS


def strip(g, top, r, title, big, mid, small):
    fr = r['frames']
    gaps = [(fr[i + 1] - fr[i], fr[i]) for i in range(len(fr) - 1)]
    worst = max([q[0] for q in gaps] or [0])
    board = [l for l in r['long'] if 'FIGHT' in l[2]]
    g.text((PAD, top), title, font=big, fill=(236, 226, 200))
    sub = '%d frames in 6 s, the worst wait %d ms, the camp\'s board page worked %d times behind the map' % (len(fr), worst, len(board))
    g.text((PAD, top + 44), sub, font=small, fill=(190, 178, 150))
    y0, h = top + 86, 70
    g.rectangle([PAD, y0, W - PAD, y0 + h], fill=(22, 19, 15), outline=(70, 62, 48))
    for d, a in gaps:
        if d > 500:
            g.rectangle([x_of(a), y0 + 2, x_of(a + d), y0 + h - 2], fill=(150, 30, 26))
    for t in fr:
        g.line([x_of(t), y0 + 6, x_of(t), y0 + h - 6], fill=(214, 206, 180), width=2)
    if r.get('brk') is not None:
        g.line([x_of(r['brk']), y0 - 6, x_of(r['brk']), y0 + h + 6], fill=(120, 200, 120), width=3)
    yl = y0 + h + 10
    for l in r['long']:
        col = (226, 128, 32) if 'FIGHT' in l[2] else (92, 84, 70)
        g.rectangle([x_of(l[0]), yl, max(x_of(l[0]) + 2, x_of(l[0] + l[1])), yl + 26], fill=col)
    return yl + 40


def main(off_p, on_p, out_p):
    off, on = json.load(open(off_p)), json.load(open(on_p))
    big, mid, small = fonts()
    H = 740
    img = Image.new('RGB', (W, H), (12, 10, 8))
    g = ImageDraw.Draw(img)
    g.text((PAD, 26), 'LEAVING CAMP ON A SLOWED PHONE: EVERY FRAME, 6 SECONDS', font=mid, fill=(236, 226, 200))
    y = strip(g, 84, off, 'BEFORE: the camp\'s ground kept cooking behind the map', big, mid, small)
    y = strip(g, y + 30, on, 'NOW: let go the moment the camp breaks', big, mid, small)
    ly = y + 20
    g.rectangle([PAD, ly, PAD + 26, ly + 22], fill=(214, 206, 180)); g.text((PAD + 36, ly - 2), 'a frame drawn', font=small, fill=(190, 178, 150))
    g.rectangle([PAD + 260, ly, PAD + 286, ly + 22], fill=(150, 30, 26)); g.text((PAD + 296, ly - 2), 'a wait over half a second', font=small, fill=(190, 178, 150))
    g.rectangle([PAD + 620, ly, PAD + 646, ly + 22], fill=(226, 128, 32)); g.text((PAD + 656, ly - 2), 'the camp\'s board page', font=small, fill=(190, 178, 150))
    g.line([PAD + 5, ly + 44, PAD + 5, ly + 70], fill=(120, 200, 120), width=3); g.text((PAD + 36, ly + 44), 'the camp breaks (his tap)', font=small, fill=(190, 178, 150))
    g.rectangle([PAD + 420, ly + 46, PAD + 446, ly + 68], fill=(92, 84, 70)); g.text((PAD + 456, ly + 44), 'the map and the phone redrawing', font=small, fill=(190, 178, 150))
    img = img.crop((0, 0, W, min(H, ly + 96)))
    img.save(out_p, 'WEBP', quality=90, method=6)
    print('picture', out_p, img.size)


if __name__ == '__main__':
    main(*sys.argv[1:4])
