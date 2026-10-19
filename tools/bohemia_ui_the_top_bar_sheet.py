#!/usr/bin/env python3
"""THE TOP BAR, the sheet and the reads (UI [the top bar], rule 121, 10/19/26).

Lays the card's pictures from the shots tools/bohemia_ui_the_top_bar_shots.js took on his phone profile at one css pixel a pixel
(crops, never scaled): upright, the map's top NOW beside A, B and C, then the fight NOW beside the fight with nothing across the
top; on its side the same, one under the other. The labels are the game's own faces. Then THE READS the gate holds:
every word on every bar against the ground really under it (the second shot, ink made transparent), plain and under a flat 25%
white (the sun, rule 73); every press's size; how much of the glass each bar takes; how much of the fight's glass is board.

  python3 tools/bohemia_ui_the_top_bar_sheet.py      # reads and writes records/target/ui_the_top_bar/
"""
import json, os, re
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'records/target/ui_the_top_bar')
FIRST = os.path.join(ROOT, 'records/target/vote_first/ui-the-top-bar-10-19.webp')
CASING = ImageFont.truetype(os.path.join(ROOT, 'slices/fonts/BohemiaCasing-Regular.ttf'), 20)
ROM = ImageFont.truetype(os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf'), 10)
BG, INK, DIM, GOLD = (13, 11, 9), (230, 217, 194), (156, 140, 116), (230, 196, 117)
GAP = 16


def lum(c):
    def ch(v):
        v = v / 255.0
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])


def ratio(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def sun(c):
    return tuple(round(v * 0.75 + 255 * 0.25) for v in c)


def rgb(s):
    m = re.findall(r'[\d.]+', s or '')
    return tuple(int(float(v)) for v in m[:3]) if len(m) >= 3 else None


def words_read(shots, side, v):
    """each word's ink against the ground under it: the worst of the ground's 5th and 95th luminance percentile pixels"""
    g = Image.open(os.path.join(D, 'map_%s_ground_%s.png' % (v, side))).convert('RGB')
    rows = []
    for w in shots['map'][v]['measure'].get('words', []):
        ink = rgb(w['color'])
        x, y, ww, hh = w['box']
        box = (max(0, x), max(0, y), min(g.width, x + ww), min(g.height, y + hh))
        if not ink or box[2] <= box[0] or box[3] <= box[1]:
            continue
        px = sorted(list(g.crop(box).getdata()), key=lum)
        lo, hi = px[int(len(px) * 0.05)], px[min(len(px) - 1, int(len(px) * 0.95))]
        plain = min(ratio(ink, lo), ratio(ink, hi))
        lit = min(ratio(sun(ink), sun(lo)), ratio(sun(ink), sun(hi)))
        rows.append({'text': w['text'], 'ink': ink, 'plain': round(plain, 2), 'sun': round(lit, 2), 'size': w.get('size')})
    return rows


def label(img, x, y, big, small=None):
    dr = ImageDraw.Draw(img)
    dr.text((x, y), big, font=CASING, fill=GOLD)
    if small:
        dr.text((x, y + 24), small, font=ROM, fill=DIM)


def main():
    out = {'made': '10/19', 'sides': {}}
    for side in ('portrait', 'landscape'):
        p = os.path.join(D, 'shots_%s.json' % side)
        if not os.path.exists(p):
            continue
        s = json.load(open(p))
        W = 390 if side == 'portrait' else 844
        H = 844 if side == 'portrait' else 390
        r = {'facts': s.get('facts'), 'stamp': s.get('stamp'), 'nowBar': s['map']['now']['bottom'], 'bars': {}, 'fight': {}}
        for v in 'ABC':
            m = s['map'][v]['measure']
            presses = [i for i in m['items'] if 't p' in i['cls'] or i['f'] in ('gear',)]
            gear = m.get('gear') or {}
            r['bars'][v] = {'bottom': s['map'][v]['laid']['bottom'], 'share': round(s['map'][v]['laid']['bottom'] / H, 3),
                            'words': words_read(s, side, v),
                            'presses': [{'f': i['f'], 'w': i['box'][2], 'h': i['box'][3]} for i in presses],
                            'gear': gear.get('box'), 'fonts': m.get('fonts', []), 'radii': sorted(set(i['radius'] for i in m['items'])),
                            'said': {i['f']: i['text'] for i in m['items'] if i['f'] in ('clock', 'batteries', 'food', 'crew', 'place', 'notes')},
                            'text': ' | '.join(i['text'] for i in m['items'] if i['f'] in ('clock', 'batteries', 'food', 'crew', 'place', 'notes') and i['text'])}
        f = s.get('fight', {})
        if f.get('now') and f.get('after'):
            r['fight'] = {'nowTop': f['now']['topBottom'], 'nowBot': f['now']['botTop'], 'afterTopShown': f['after']['topShown'],
                          'afterBot': f['after']['botTop'], 'edges': f['after'].get('edges'), 'autoTap': f['after'].get('autoTap'),
                          'boardNow': round((f['now']['botTop'] - f['now']['topBottom']) / H, 3), 'boardAfter': round(f['after']['botTop'] / H, 3)}
        out['sides'][side] = r

        # the sheet: crops at one css pixel a pixel, never scaled
        cut = max([r['bars'][v]['bottom'] for v in 'ABC'] + [r['nowBar']]) + (90 if side == 'portrait' else 40)
        crops = [('NOW', 'map_now', 'the map today'), ('A', 'map_A', 'one row: the day, batteries, food and its days, the crew'),
                 ('B', 'map_B', 'two rows: the day, the place, the crew; the stores and the days'),
                 ('C', 'map_C', 'the company on top: the day dial, the stores, a card a man')]
        cols = 2 if side == 'portrait' else 1
        cw, lh = W, 44
        rows_n = (len(crops) + cols - 1) // cols
        fight_h = H
        sheet_w = cols * cw + (cols + 1) * GAP if side == 'portrait' else W + 2 * GAP
        fight_cols = 2 if side == 'portrait' else 1
        fight_rows = 1 if side == 'portrait' else 2
        sheet_h = GAP + rows_n * (lh + cut + GAP) + fight_rows * (lh + fight_h + GAP)
        sh = Image.new('RGB', (sheet_w, sheet_h), BG)
        y = GAP
        for i, (k, name, words) in enumerate(crops):
            cx = GAP + (i % cols) * (cw + GAP)
            if i % cols == 0 and i:
                y += lh + cut + GAP
            im = Image.open(os.path.join(D, '%s_%s.png' % (name, side))).convert('RGB')
            label(sh, cx, y, k, words)
            sh.paste(im.crop((0, 0, W, cut)), (cx, y + lh))
            if k == 'A' and side == 'portrait':
                out['firstAt'] = [cx, y + lh, W, min(300, cut)]
                os.makedirs(os.path.dirname(FIRST), exist_ok=True)
                im.crop((0, 0, W, min(300, cut))).save(FIRST, 'WEBP', quality=92)
        y += lh + cut + GAP
        for j, (k, name, words) in enumerate([('THE FIGHT NOW', 'fight_now', 'the round, the faces and AUTO across the top'),
                                              ('THE FIGHT, NOTHING ON TOP', 'fight_after', 'the board to the top; they ride the bottom bar')]):
            if not os.path.exists(os.path.join(D, '%s_%s.png' % (name, side))):
                continue
            im = Image.open(os.path.join(D, '%s_%s.png' % (name, side))).convert('RGB')
            cx = GAP + (j % fight_cols) * (W + GAP)
            yy = y + (j // fight_cols) * (lh + H + GAP) if fight_cols == 1 else y
            label(sh, cx, yy, k, words)
            sh.paste(im.crop((0, 0, W, H)), (cx, yy + lh))
        name = 'UI_THE_TOP_BAR.png' if side == 'portrait' else 'UI_THE_TOP_BAR_SIDEWAYS.png'
        sh.save(os.path.join(D, name), optimize=True)
        out['sides'][side]['sheet'] = name
        out['sides'][side]['sheetSize'] = list(sh.size)
    json.dump(out, open(os.path.join(D, 'manifest.json'), 'w'), indent=1)
    for side, r in out['sides'].items():
        for v, b in r['bars'].items():
            wp = min([w['plain'] for w in b['words']] or [0])
            ws = min([w['sun'] for w in b['words']] or [0])
            print(side, v, 'bar to', b['bottom'], 'words', len(b['words']), 'worst plain', wp, 'sun', ws, '|', b['text'][:90])
        print(side, 'fight', r['fight'])


if __name__ == '__main__':
    main()
