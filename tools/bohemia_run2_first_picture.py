#!/usr/bin/env python3
"""THE FIRST PICTURE IS ONE THING (RUN TWO [a card's picture, full size], rule 89, Paolo 10/10: what he cannot
see did not ship).

A VOTE card that shows a sheet of many shrinks every thing on it to a thumbnail on his phone: COMBAT TWO measured
five boards across his screen at about 75 points each. So a sheet card carries show.first, ONE thing cut from its
own sheet, and show.firstAt, where that thing sits on the sheet [x, y, w, h] in the sheet's pixels. The VOTE tab
shows the one thing on the card; a tap opens the whole sheet at full size on that same spot (one image pixel to
one point) and he drags to the rest.

THE CUT IS A FRAME, NEVER A NEW PICTURE: the pixels are the sheet's own, copied 1:1 (lossless; a cut over 300 KB
goes lossy at 90, because the tap opens the lane's own sheet at full size anyway), so the card shows what the lane
made. The rect is chosen by looking at the sheet: the thing the card's WHY asks him to judge
(the after when the sheet is a before and after, the first of a row of the same kind).

A LANE REGISTERING A NEW SHEET: add a line to CUTS (or pass --id ID --rect x y w h) and run this; it writes the cut
to records/target/vote_first/<id>.webp and puts first/firstAt into the card's show, touching no other byte of the
registry. The vote tab gate refuses a card from 10/19 on whose first picture does not fit one phone screen.

Run: python3 tools/bohemia_run2_first_picture.py            (every line in CUTS)
     python3 tools/bohemia_run2_first_picture.py --id ID --rect X Y W H
"""
import json
import os
import re
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json')
OUT = os.path.join(ROOT, 'records', 'target', 'vote_first')
SLICES = os.path.join(ROOT, 'slices')

# id -> (x, y, w, h) on the card's own sheet, and the one thing it frames
CUTS = {
    # 1724 x 8787: seven props, each in eight facings; the first is the wreck on his tiles, HIS beside MINE
    'cook-the-empty-terrains-cover-10-18': ((0, 78, 545, 464), 'the wreck on its roof, on his tiles, his car beside it'),
    # 1170 x 5982: five boards stacked; the first is the Strip, its name and line with it
    'combat2-a-board-from-every-district-10-18': ((0, 715, 1170, 990), 'the Strip board, whole'),
    # 1840 x 4490: the near stop three ways; the right one is the map with the curb laid
    'cook2-the-curb-on-the-map-10-18': ((1228, 128, 589, 1094), 'the near stop with the curb laid, on the phone'),
    # 1786 x 4100: 13 rows of faces beside the star; the first row's star and the first new face
    'eyes-the-star-is-the-bar-10-18': ((0, 175, 490, 265), 'the starred poacher beside the first new face'),
    # 2720 x 6392: five houses before and after; the first house, after
    'cook4-the-second-pass-10-18': ((1356, 159, 1306, 766), 'the first house, second pass, on the board'),
    # 2360 x 1546: twelve hire cards; the first card and its old name
    'people-the-names-wired-in-10-18': ((30, 150, 755, 325), 'the first hire card and the name it had'),
    # 2814 x 2739: the company screen four ways, upright and on its side; A on its side
    'ui-the-line-on-a-ground-10-18': ((890, 560, 850, 420), 'A, they stand in the camp, on its side'),
}


def card_src(reg, cid):
    for it in reg['items']:
        if it.get('id') == cid:
            return (it.get('show') or {}).get('src')
    raise SystemExit('no card ' + cid)


def cut(reg, cid, rect):
    src = card_src(reg, cid)
    im = Image.open(os.path.normpath(os.path.join(SLICES, src)))
    x, y, w, h = rect
    if x < 0 or y < 0 or x + w > im.width or y + h > im.height:
        raise SystemExit('%s: %r is off its %dx%d sheet' % (cid, rect, im.width, im.height))
    os.makedirs(OUT, exist_ok=True)
    out = os.path.join(OUT, cid + '.webp')
    piece = im.crop((x, y, x + w, y + h))
    piece.save(out, 'WEBP', lossless=True, method=6)
    if os.path.getsize(out) > 300000:   # a render-heavy cut: the card's preview goes lossy at 90, the 1:1 view is the sheet itself
        piece.save(out, 'WEBP', quality=90, method=6)
    return '../records/target/vote_first/' + cid + '.webp'


def patch(raw, cid, first, rect):
    """put first/firstAt into the card's show, by text, so no other byte of the registry moves"""
    i = raw.find('"id": "%s"' % cid)
    if i < 0:
        raise SystemExit('no card ' + cid + ' in the text')
    s = raw.find('"show": {', i)
    e = raw.find('}', s)
    block = raw[s:e]
    block = re.sub(r',\s*"first": "[^"]*"', '', block)
    block = re.sub(r',\s*"firstAt": \[[^\]]*\]', '', block)
    m = re.search(r'\n( *)"src"', block)
    ind = m.group(1) if m else '    '
    block = block.rstrip()
    block += ',\n%s"first": "%s",\n%s"firstAt": [%d, %d, %d, %d]\n%s' % (
        ind, first, ind, rect[0], rect[1], rect[2], rect[3], ind[:-1])
    return raw[:s] + block + raw[e:]


def main():
    raw = open(REG, encoding='utf-8').read()
    reg = json.loads(raw)
    todo = dict((k, v[0]) for k, v in CUTS.items())
    if '--id' in sys.argv:
        a = sys.argv
        todo = {a[a.index('--id') + 1]: tuple(int(v) for v in a[a.index('--rect') + 1:a.index('--rect') + 5])}
    for cid, rect in todo.items():
        first = cut(reg, cid, rect)
        raw = patch(raw, cid, first, rect)
        print('%-48s %s  %dx%d' % (cid, first, rect[2], rect[3]))
    json.loads(raw)   # never write a registry that does not parse
    open(REG, 'w', encoding='utf-8').write(raw)


if __name__ == '__main__':
    main()
