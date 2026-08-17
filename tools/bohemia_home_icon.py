#!/usr/bin/env python3
"""
THE HOME SCREEN ICON, FROM THE LOGO HE ALREADY CHOSE FOR IT (8/16/26, RUN lane).

DEMO STATUS BOARD row 6, the half still open: "the 8/13 home-screen work order
(manifest + apple metas + icon + the first-sleep-save install card) --
`grep -c manifest` = 0 across all three surfaces." OWNER: RUN. Measured again
8/16 before starting: still 0, 0 and 0.

HE ALREADY PICKED THIS ART FOR THIS EXACT JOB. banks/BOHEMIA_LOGO_CANDIDATES_
8_1_26.txt records the brief in his own words:

    "cook me up 10 new Bohemia logos ... and the one that you choose I WILL PUT
     ON THE HOME SCREEN"                                          -- Paolo 8/1

and then he chose one himself: `chosen_by_paolo: 11`, THE ONE (PUNK STENCIL IN
SIGN-PAINTER GOLD), which is already the alpha's front screen. So the home screen
icon is not a thing to design. It is a thing to READ OUT OF HIS BANK.

REUSE CHECK: opens banks/BOHEMIA_LOGO_CANDIDATES_8_1_26.txt IN CODE and takes
whichever logo the file's own `chosen_by_paolo` field names -- his pick is read,
never hardcoded, so if he ever changes it the icon follows. NO NEW PIXELS ARE
DRAWN: his logo is decoded, cropped to its own gold, and PLACED. Everything this
file decides is measured off his art or dictated by iOS, never chosen by taste:
  - THE SQUARE IS FILLED WITH HIS LOGO'S OWN GROUND, sampled from the art. I
    LOOKED AT THE FIRST CUT and it was wrong: I had used the front screen's
    --bg (#0c0a08), and his logo carries its own textured dark grey, so the icon
    had a visible lighter BOX sitting in the middle of it.
  - IT IS CROPPED TO THE GOLD. The first cut centred the whole 400x130 plate at
    full width and the wordmark came out letterboxed into illegibility at 180px.
    Cropping to the ink lets his letters be as large as the square allows.
  - nearest-neighbour only, so the stencil edges stay stencil edges. Smoothing
    hand-set bitmap type into mush is the TEXTURE MATCH lane's whole complaint.
  - centred, at 90% width, inside the margin iOS masks to a rounded square.

SIZES, and why these: iOS DOES NOT USE THE MANIFEST'S ICONS for the home screen.
It reads `<link rel="apple-touch-icon">`, and if that element exists it OVERRIDES
the manifest icon list entirely. 180x180 is the iPhone @3x size. The 192 and 512
PNGs exist for the manifest so every other platform (and any future Safari that
honours it) has a real icon rather than a screenshot.

Idempotent: writes the same bytes from the same bank every run.
"""
import base64
import io
import json
import os
import re
import sys

BANK = 'banks/BOHEMIA_LOGO_CANDIDATES_8_1_26.txt'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
OUT = 'slices/icons'
SIZES = [180, 192, 512]


def logo_bg(im):
    """HIS LOGO'S OWN BACKGROUND, sampled from the art itself.
    The first cut filled the square with the front screen's --bg (#0c0a08) and
    I LOOKED AT IT: his logo carries its own textured dark-grey ground, so a
    black square put a visible lighter BOX in the middle of the icon. Sampling
    his own ground means the wordmark sits on the tone it was drawn on and the
    seam disappears. Nothing here is chosen by taste; it is measured off his
    pixels."""
    from collections import Counter
    return Counter(list(im.getdata())).most_common(1)[0][0]


def ink_box(im, bg):
    """The bounding box of the GOLD, so the wordmark can be as large as the
    square allows. A wide wordmark centred at full width is letterboxed into
    illegibility at 180px -- looked at, on the first cut, and it was."""
    px = im.load()
    W, H = im.size
    xs, ys = [], []
    for y in range(H):
        for x in range(W):
            p = px[x, y]
            if abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2]) > 40:
                xs.append(x); ys.append(y)
    if not xs:
        return (0, 0, W, H)
    return (min(xs), min(ys), max(xs) + 1, max(ys) + 1)


def main():
    try:
        from PIL import Image
    except ImportError:
        sys.exit('FAIL: PIL is needed to place his logo')
    if not os.path.exists(BANK):
        sys.exit('FAIL: his logo bank is not there -- ' + BANK)
    d = json.load(open(BANK))
    pick = d.get('chosen_by_paolo')
    if not pick:
        sys.exit('FAIL: the bank does not record a pick; the icon is HIS choice, not mine')
    row = [L for L in d['logos'] if L.get('n') == pick]
    if not row:
        sys.exit('FAIL: chosen_by_paolo=%r is not in the bank' % pick)
    row = row[0]
    logo = Image.open(io.BytesIO(base64.b64decode(row['b64']))).convert('RGB')

    bg = logo_bg(logo)
    x0, y0, x1, y1 = ink_box(logo, bg)
    PAD = 6
    crop = logo.crop((max(0, x0 - PAD), max(0, y0 - PAD),
                      min(logo.size[0], x1 + PAD), min(logo.size[1], y1 + PAD)))
    os.makedirs(OUT, exist_ok=True)
    made = []
    for S in SIZES:
        # as wide as the rounded-square mask safely allows
        target_w = int(S * 0.90)
        k = target_w / float(crop.size[0])
        w, h = max(1, int(crop.size[0] * k)), max(1, int(crop.size[1] * k))
        art = crop.resize((w, h), Image.NEAREST)
        img = Image.new('RGB', (S, S), bg)
        img.paste(art, ((S - w) // 2, (S - h) // 2))
        p = os.path.join(OUT, 'bohemia-%d.png' % S)
        img.save(p)
        made.append('%s (%dx%d, his wordmark %dx%d on his own ground)' % (p, S, S, w, h))
    print('ICON: ' + row.get('name', '?') + ', his pick #%s' % pick)
    for m in made:
        print('  ' + m)


if __name__ == '__main__':
    main()
