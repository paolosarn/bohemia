#!/usr/bin/env python3
"""GUNS FROM THE FIRST FIGHT, the VOTE sheet (COMBAT [guns from the first fight], rule 120(a)). Called by
tools/bohemia_combat_guns_from_the_first_fight_10_19_26.js with the frames it took from the game's own camera and the
bench it played; this file only lays them out and writes the captions. Nothing on the frames is drawn here."""
import json
import sys
from PIL import Image, ImageDraw, ImageFont

FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
BG, INK, DIM, GOLD, RED, GREEN = (13, 11, 9), (230, 217, 194), (156, 140, 116), (217, 168, 90), (196, 85, 63), (143, 174, 106)
W2, W4, PAD = 470, 300, 14


def fit(img, w):
    return img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)


def wrap(d, text, font, w):
    out, line = [], ''
    for word in text.split():
        t = (line + ' ' + word).strip()
        if d.textlength(t, font=font) > w and line:
            out.append(line)
            line = word
        else:
            line = t
    if line:
        out.append(line)
    return out


def main(spec_path):
    spec = json.load(open(spec_path))
    fr, b = spec['frames'], spec['bench']
    f_big, f_mid, f_small = ImageFont.truetype(BOLD, 30), ImageFont.truetype(BOLD, 17), ImageFont.truetype(FONT, 14)
    top = []
    for k, name in (('before', 'BEFORE: TWO PIPES AND A SLEDGE'), ('after', 'NOW: TWO PISTOLS AND A RIFLE')):
        if k in fr:
            top.append((name, ', '.join(fr[k]['kit']), fit(Image.open(fr[k]['file']).convert('RGB'), W2)))
    row = []
    if 'pistol' in fr and fr['pistol']:
        p = fr['pistol']
        row.append(('HIS GUN\'S REACH, TAPED', 'two to four tiles; the rust X is the thug he will shoot, %d%% at %d tiles' % (p['chance'], p['d']),
                    fit(Image.open(p['aim']).convert('RGB'), W4)))
        row.append(('THE PISTOL KICKS', p.get('feed') or (p['who'] + ' fires'), fit(Image.open(p['fire']).convert('RGB'), W4)))
    if 'rifle' in fr and fr['rifle']:
        r = fr['rifle']
        row.append(('THE RIFLE INTO THE SHOULDER', r.get('feed') or (r['who'] + ' fires'), fit(Image.open(r['fire']).convert('RGB'), W4)))
    if 'card' in fr:
        row.append(('HOLD THE STRIKE SQUARE', 'two to four tiles, five rounds then a reload, a club at one',
                    fit(Image.open(fr['card']['file']).convert('RGB'), W4)))
    width = max(2 * (W2 + PAD) + PAD, len(row) * (W4 + PAD) + PAD)
    th = max(im.height for _, _, im in top) if top else 0
    rh = max(im.height for _, _, im in row) if row else 0
    height = 100 + th + 66 + 34 + rh + 70 + 40 + 5 * 22 + 30 + 20 * 18 + PAD
    sheet = Image.new('RGB', (width, height), BG)
    d = ImageDraw.Draw(sheet)
    d.text((PAD, 14), 'GUNS FROM THE FIRST FIGHT', font=f_big, fill=GOLD)
    for i, ln in enumerate(wrap(d, 'A NEW CREW, the door\'s first pick, against its first band: three thugs on day one. Before, two pipes and a '
                                   'sledge; the "pistol" was secretly a one-tile knife and never fired once. Now the pistol shoots two to four tiles, '
                                   'the best eye takes the rifle, every gun clubs at one. All from the game\'s camera, his phone upright.', f_small, width - 2 * PAD)):
        d.text((PAD, 52 + i * 17), ln, font=f_small, fill=DIM)
    y = 100
    x = PAD
    for name, sub, im in top:
        sheet.paste(im, (x, y))
        d.text((x, y + im.height + 6), name, font=f_mid, fill=GOLD)
        for i, ln in enumerate(wrap(d, sub, f_small, W2)[:2]):
            d.text((x, y + im.height + 28 + i * 17), ln, font=f_small, fill=INK)
        x += W2 + PAD
    y += th + 66
    d.text((PAD, y), 'HIS TURN, WITH A GUN', font=f_mid, fill=INK)
    y += 34
    x = PAD
    for name, sub, im in row:
        sheet.paste(im, (x, y))
        d.text((x, y + im.height + 6), name, font=f_mid, fill=GOLD)
        for i, ln in enumerate(wrap(d, sub, f_small, W4)[:2]):
            d.text((x, y + im.height + 28 + i * 17), ln, font=f_small, fill=INK)
        x += W4 + PAD
    y += rh + 70
    d.text((PAD, y), 'HOW OFTEN A NEW CREW WINS ITS FIRST FIGHT (%d fights each, the fight\'s own rules, auto both sides)' % spec['seeds'], font=f_mid, fill=INK)
    y += 30
    cols = [PAD, PAD + 230, PAD + 420, PAD + 610, PAD + 800]
    for c, t in zip(cols, ['THEIR BAND', 'BEFORE', 'NOW', 'GUNS KILLED', 'SHOTS A FIGHT']):
        d.text((c, y), t, font=f_small, fill=DIM)
    y += 22
    for o, g in zip(b['old'], b['guns']):
        d.text((cols[0], y), '%d thugs' % g['thugs'], font=f_mid, fill=INK)
        d.text((cols[1], y), '%d in 100' % o['winPct'], font=f_mid, fill=RED)
        d.text((cols[2], y), '%d in 100' % g['winPct'], font=f_mid, fill=GREEN)
        d.text((cols[3], y), '%d%% of them' % g['gunKillPct'], font=f_mid, fill=GOLD)
        d.text((cols[4], y), '%s (was %s)' % (g['shotsPerFight'], o['shotsPerFight']), font=f_mid, fill=INK)
        y += 22
    y += 18
    d.text((PAD, y), 'EVERY ORIGIN AGAINST THREE THUGS, BEFORE -> NOW', font=f_mid, fill=INK)
    y += 26
    by = {}
    for r in spec['all']:
        by.setdefault(r['origin'], {})[r['kit']] = r
    items = list(by.values())
    half = (len(items) + 1) // 2
    for i, v in enumerate(items):
        o, g = v['old'], v['guns']
        cx, cy = PAD + (i // half) * (width // 2), y + (i % half) * 18
        d.text((cx, cy), '%-22s %2d men  %3d -> %3d in 100' % (g['name'][:22], g['men'], o['winPct'], g['winPct']), font=f_small,
               fill=GREEN if g['winPct'] > o['winPct'] else (INK if g['winPct'] == o['winPct'] else RED))
    sheet = sheet.crop((0, 0, width, y + half * 18 + PAD))
    sheet.save(spec['out'], 'JPEG', quality=62, optimize=True, progressive=True)


if __name__ == '__main__':
    main(sys.argv[1])
