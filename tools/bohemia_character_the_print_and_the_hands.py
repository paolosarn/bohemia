#!/usr/bin/env python3
"""CHARACTER [the print and the hands] -- the VOTE sheet (plain python3, reads only).

    python3 tools/bohemia_character_the_print_and_the_hands.py <before_root> records/target/character/rig \
        records/target/character/CHARACTER_THE_PRINT_AND_THE_HANDS.png

The models are built by tools/bohemia_character_the_thirteen_through_the_rig.py (PRINTS and the hands, section 1b)
and rendered through DIRECTION's master rig unedited. <before_root> is the last round's renders (9ebddcc), taken out
of git so the sheet compares the same rig, the same camera and the same light, one change apart.
Rows: the three print looks at 1:1 (before, after, his twin today) in S, SE and SW; then the same at 4x; then the
hands at 1:1 and at 6x on the plain body and on two coats. Caption: the pixel size, the palette, the light (rule 114c).
"""
import os, sys, importlib.util
from PIL import Image, ImageDraw

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
s = importlib.util.spec_from_file_location('t13', os.path.join(ROOT, 'tools/bohemia_character_the_thirteen_through_the_rig.py'))
T = importlib.util.module_from_spec(s); s.loader.exec_module(T)

BG = (22, 21, 20); GROUND = (118, 106, 88); INK = (220, 214, 200); DIM = (160, 154, 140); HEAD = (200, 190, 120)
PRINT_LOOKS = ['Mob', 'Caravans', 'Colorful']
HAND_LOOKS = ['Body', 'Reds', 'Trades']


def load(root, look, f):
    im = Image.open(os.path.join(root, look.lower(), 'rig_%s.png' % f)).convert('RGBA')
    return im.crop(im.getbbox())


def main(before, after, out):
    fac = ['S', 'SE', 'SW']
    cells = []   # (label, image, zoom)
    W = 1500; Sh = Image.new('RGB', (W, 1900), BG); d = ImageDraw.Draw(Sh)
    d.text((12, 8), "CHARACTER: THE PRINT AND THE HANDS on the rig's models (rule 115c). CANDIDATES: nothing is final before the moodboard.", fill=INK)
    d.text((12, 24), "57 px a metre, one pixel size, block 1 | palette: the runway paint as the street wears it (records/cook3/thirteen_repainted.png, AFTER) + the print's own two or three cloth colours | ONE light: the rig's sun, upper left (155.4 y-up)", fill=DIM)
    d.text((12, 38), "the print is a cloth material in metres on the garment (chalk stripe 2 cm on 8, blanket plaid 6 cm on 16, tee bands 3 cm), never painted on the pixels; the hand is a palm, four two-joint fingers and a thumb on the hand bone", fill=DIM)
    y = 60

    def cell(im, x, y, cw, ch, z=1):
        Sh.paste(GROUND, (x, y, x + cw, y + ch))
        if im:
            if z != 1: im = im.resize((im.width * z, im.height * z), Image.NEAREST)
            Sh.paste(im, (x + (cw - im.width) // 2, y + ch - im.height - 2), im)

    # 1:1 rows
    d.text((12, y), 'AT 1:1, the size it plays at: BEFORE (last round) | AFTER (this round) | HIS TWIN TODAY (the flat sprite)', fill=HEAD); y += 16
    cw, ch = 46, 124
    x = 12
    for n in PRINT_LOOKS:
        d.text((x, y), n.upper(), fill=INK)
        xx = x
        for f in fac:
            cell(load(before, n, f), xx, y + 14, cw, ch); xx += cw + 2
        xx += 6
        for f in fac:
            cell(load(after, n, f), xx, y + 14, cw, ch); xx += cw + 2
        xx += 6
        cell(T.twin(n), xx, y + 14, cw + 10, ch); xx += cw + 10
        d.text((x, y + ch + 16), 'before S SE SW | after S SE SW | twin', fill=DIM)
        x = xx + 30
    y += ch + 40
    # 4x rows
    d.text((12, y), 'AT 4x, to see what the pixels carry: BEFORE | AFTER, S and SE', fill=HEAD); y += 16
    z = 4; cw4, ch4 = 46 * z, 124 * z
    x = 12
    for n in PRINT_LOOKS:
        for src, lab in ((before, 'before'), (after, 'after')):
            for f in ('S', 'SE'):
                if x + cw4 > W:
                    x = 12; y += ch4 + 22
                cell(load(src, n, f), x, y, cw4, ch4, z); d.text((x + 4, y + 4), '%s %s %s' % (n.upper(), lab, f), fill=INK)
                x += cw4 + 6
    y += ch4 + 24
    # hands
    d.text((12, y), 'THE HANDS AT 6x, the arm and hand only: BEFORE (a mitt) | AFTER (palm, fingers, thumb), S and SE', fill=HEAD); y += 16
    x = 12; hz = 6
    for n in HAND_LOOKS:
        for src, lab in ((before, 'before'), (after, 'after')):
            for f in ('S', 'SE'):
                im = load(src, n, f); h = im.height
                c = im.crop((0, int(h * 0.42), im.width, int(h * 0.72)))
                cwh, chh = 46 * hz, c.height * hz + 4
                if x + cwh > W:
                    x = 12; y += chh + 22
                cell(c, x, y, cwh, chh, hz); d.text((x + 4, y + 4), '%s %s %s' % (n.upper(), lab, f), fill=INK)
                x += cwh + 6
    y += chh + 30
    Sh = Sh.crop((0, 0, W, y)); os.makedirs(os.path.dirname(out), exist_ok=True); Sh.save(out); print('sheet', out, Sh.size)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3])
