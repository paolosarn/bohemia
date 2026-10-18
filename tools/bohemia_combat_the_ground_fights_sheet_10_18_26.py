#!/usr/bin/env python3
"""THE GROUND FIGHTS, the VOTE sheet (COMBAT [the ground fights], rule 59). Called by
tools/bohemia_combat_the_ground_fights_10_18_26.js with a spec of the frames it took from the game's own camera;
this file only lays them out and writes the captions. Nothing on the frames is drawn here."""
import json
import sys
from PIL import Image, ImageDraw, ImageFont

FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
BG, INK, DIM, GOLD = (13, 11, 9), (230, 217, 194), (156, 140, 116), (217, 168, 90)
MOMENT_W, PANEL_W, PER_ROW, PAD = 320, 228, 7, 12
NICE = {'suburb_block': 'SUBURB', 'the_strip': 'THE STRIP', 'industrial': 'INDUSTRIAL', 'open_desert': 'OPEN DESERT',
        'wash_and_shore': 'WASH + SHORE', 'hills': 'HILLS', 'freeway': 'FREEWAY', 'lot_and_bigbox': 'LOTS + BIG BOX',
        'trailer_park': 'TRAILER PARK', 'golf_and_park': 'GOLF + PARK', 'airport': 'AIRPORT', 'solar_and_pumps': 'SOLAR + PUMPS',
        'landfill': 'LANDFILL'}


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
    f_big, f_mid, f_small = ImageFont.truetype(BOLD, 30), ImageFont.truetype(BOLD, 17), ImageFont.truetype(FONT, 14)
    moments = []
    for m in spec['moments']:
        if m.get('missing'):
            continue
        moments.append((m['name'], m['say'], fit(Image.open(m['file']).convert('RGB'), MOMENT_W)))
        if m.get('walk'):
            moments.append((m['name'] + ', HE STEPS UP', m['walk']['feed'] or 'the gold ring at his feet',
                            fit(Image.open(m['walk']['file']).convert('RGB'), MOMENT_W)))
    panels = [(p, fit(Image.open(p['file']).convert('RGB'), PANEL_W)) for p in spec['panels']]
    width = max(len(moments) * (MOMENT_W + PAD) + PAD, PER_ROW * (PANEL_W + PAD) + PAD)
    mh = max(im.height for _, _, im in moments) if moments else 0
    ph = max(im.height for _, im in panels)
    rows = (len(panels) + PER_ROW - 1) // PER_ROW
    height = 96 + 30 + mh + 70 + 46 + rows * (ph + 74) + PAD
    sheet = Image.new('RGB', (width, height), BG)
    d = ImageDraw.Draw(sheet)
    d.text((PAD, 14), 'WHAT THE GROUND UNDER HIM DOES', font=f_big, fill=GOLD)
    d.text((PAD, 56), 'Every tile is a Battle Brothers tile with its cost and its effect, from one table. '
           'Tap a tile that changes something and the line says so. All from the game\'s camera, his phone upright.',
           font=f_small, fill=DIM)
    y = 96
    d.text((PAD, y), 'A FINGER ON THE GROUND', font=f_mid, fill=INK)
    y += 30
    x = PAD
    for name, say, im in moments:
        sheet.paste(im, (x, y))
        d.text((x, y + im.height + 6), name, font=f_mid, fill=GOLD)
        for i, ln in enumerate(wrap(d, '"' + say + '"', f_small, MOMENT_W)[:2]):
            d.text((x, y + im.height + 28 + i * 17), ln, font=f_small, fill=INK)
        x += MOMENT_W + PAD
    y += mh + 70
    d.text((PAD, y), 'ONE BOARD PER GROUND, AT THE OPEN. Under each, that ground over all its districts: slow / water / high / walls', font=f_mid, fill=INK)
    y += 30
    for i, (p, im) in enumerate(panels):
        cx, cy = PAD + (i % PER_ROW) * (PANEL_W + PAD), y + (i // PER_ROW) * (ph + 74)
        sheet.paste(im, (cx, cy))
        s = p['share']
        d.text((cx, cy + im.height + 6), NICE.get(p['ground'], p['ground']), font=f_mid, fill=GOLD)
        d.text((cx, cy + im.height + 27), '%d / %d / %d / %d %%' % (round(100 * s['rough']), round(100 * s['swamp']),
               round(100 * s['height']), round(100 * (s['obstacles'] + s['solid']))), font=f_small, fill=INK)
        d.text((cx, cy + im.height + 45), p['district'] + ' (' + p['kind'] + ')', font=f_small, fill=DIM)
    sheet.save(spec['out'], 'JPEG', quality=62, optimize=True, progressive=True)


if __name__ == '__main__':
    main(sys.argv[1])
