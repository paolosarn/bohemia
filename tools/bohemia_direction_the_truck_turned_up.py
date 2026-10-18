#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the truck turned up]: THE TOY TAKEN OUT OF THE RECIPE, BEFORE AND AFTER (his YES on rig round five,
10/18: 'the truck looks a little too much like a play toy for real, so turn it up, it's not gonna look like that anymore';
the row's CONSTRAINT: change the recipe, not just the one truck).

Reads round five's renders (records/target/direction_rig_round_five/) and round six's (records/target/
direction_the_truck_turned_up/, made by tools/bohemia_direction_master_rig.py round six from the guide's new rig keys) and:
  1. THE REPORT (report.json): each subject through PLUMBER's ten checks the way round five read them (that tool's
     report_one, imported, never copied), the card under the guide, the proportions, and the toy's four tells as numbers
     measured on the S still: saturation (the card's row), the brightest one percent's lift over the body's mean (the
     shine), the edge's colour spread (a ruled edge is one colour), and length to width and height (the shape).
  2. THE SHEET (DIRECTION_THE_TRUCK_TURNED_UP.png): the truck round five beside round six in three facings, the robot
     round five beside round six (the same recipe on the bar he loved: the recipe moved, not one truck), at 1:1 on his
     ground and at 2x, the numbers under it in the project's font.

    python3 tools/bohemia_direction_the_truck_turned_up.py
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_direction_rig_round_five as R5  # noqa: E402

OLD = os.path.join(ROOT, 'records/target/direction_rig_round_five')
D = os.path.join(ROOT, 'records/target/direction_the_truck_turned_up')


def tells(png):
    """the toy's tells on one still, as numbers"""
    a = np.asarray(Image.open(png).convert('RGBA')).astype(float); op = a[..., 3] > 200
    rgb = a[..., :3][op] / 255.0; mx = rgb.max(1); mn = rgb.min(1); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    v = a[..., :3].mean(2); vin = v[op]
    p = np.pad(op, 1); inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    ring2 = op & ~(inner & np.pad(inner, 1)[:-2, 1:-1] & np.pad(inner, 1)[2:, 1:-1])   # the outer two pixels
    return dict(saturation_mean=round(float(sat.mean()), 3), shine=round(float(np.percentile(vin, 99) - vin.mean()), 1),
                edge_value_spread=round(float(v[ring2].std()), 1))


def body(base, subj, pre, f): return R5.body(subj, pre, f, base)


def sheet(rep):
    board = Image.open(R5.BOARD).convert('RGBA')
    rows = [('THE TRUCK, ROUND FIVE (the toy he flagged): SE, S, E', [body(OLD, 'truck', 'rig', f) for f in ('SE', 'S', 'E')]),
            ('THE TRUCK, ROUND SIX (true proportions, old paint, worn edges, no shine): SE, S, E, NW', [body(D, 'truck', 'rig', f) for f in ('SE', 'S', 'E', 'NW')]),
            ('THE ROBOT, ROUND FIVE | ROUND SIX (the same recipe on the bar: the recipe moved, not one truck)', [body(OLD, 'robot', 'rig', f) for f in ('S', 'SE')] + [body(D, 'robot', 'rig', f) for f in ('S', 'SE')])]
    W = 2400; pad = 16; y = 60
    heights = [max(i.height for i in ims) for _, ims in rows]
    H = 60 + sum(h * 5 + 120 for h in heights) + 40 + 30 * 26
    out = Image.new('RGBA', (W, H), R5.BG); dr = ImageDraw.Draw(out)
    dr.text((pad, 14), 'THE TRUCK TURNED UP: THE TOY TAKEN OUT OF THE RECIPE. 57 PX A METRE, ONE SUN UPPER LEFT (155.4 DEG), PALETTE records/target/BOHEMIA_STYLE_PALETTE.json. 1:1 ON HIS GROUND, THEN 2X', font=R5.font(16), fill=R5.INK)
    for (title, ims), h in zip(rows, heights):
        dr.text((pad, y), title, font=R5.font(15), fill=R5.INK); y += 24
        gw = sum(i.width + 6 for i in ims) + 6
        out.paste(board.crop((1640, 1860, 1640 + gw, 1860 + h + 8)), (pad, y))
        xx = pad + 6
        for i in ims: out.alpha_composite(i, (xx, y + 4 + h - i.height)); xx += i.width + 6
        y += h + 20; x2 = pad
        for i in ims:
            big = i.resize((i.width * 2, i.height * 2), Image.NEAREST); tile = Image.new('RGBA', big.size, (78, 72, 64, 255)); tile.alpha_composite(big)
            if x2 + big.width > W - pad: x2 = pad; y += h * 2 + 8
            out.paste(tile, (x2, y + (h * 2 - big.height))); x2 += big.width + 8
        y += h * 2 + 40
    for s in rep['subjects']:
        t = s['tells']; pr = s.get('proportions')
        line = '%-6s %-5s  saturation %.3f  shine %+.1f  edge spread %.1f  %s  %s' % (s['subject'], s['round'], t['saturation_mean'], t['shine'], t['edge_value_spread'],
                                                                                  ('length:width %.2f length:height %.2f' % tuple(pr)) if pr else '', s['card'])
        dr.text((pad, y), line, font=R5.font(14), fill=R5.INK); y += 22
        hv = s['held']; bad = [d for d in ('D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9') if hv[d][0] is False]
        dr.text((pad + 30, y), 'ten checks red: %s' % (', '.join(bad) or 'none'), font=R5.font(13), fill=R5.RED if set(bad) - {'D6', 'D8'} else R5.DIM); y += 22
    g = R5.G['rig']
    dr.text((pad, y + 8), 'THE RECIPE, NEW KEYS IN THE GUIDE: ' + '  '.join('%s %s' % (k, g[k]) for k in ('roughness_min', 'specular', 'paint_sat_mul', 'bleach_up', 'edge_m', 'edge_wear', 'chip_per_m', 'dent_m', 'dent_per_m', 'proportion_tolerance')), font=R5.font(13), fill=R5.DIM)
    out = out.crop((0, 0, W, y + 40))
    p = os.path.join(D, 'DIRECTION_THE_TRUCK_TURNED_UP.png'); out.convert('RGB').save(p, optimize=True); return p


def shape(base, subj):
    m = json.load(open(os.path.join(base, subj, 'rig.json'))); L, W, H = sorted(m['real_dims_m'][:2])[::-1] + [m['real_dims_m'][2]]
    return [round(L / W, 2), round(L / H, 2)]


def main():
    subs = []
    for base, rnd in ((OLD, 'five'), (D, 'six')):
        for subj, cls in (('truck', 'vehicle'), ('robot', 'person')):
            r = R5.report_one(subj, cls, 'rig', base)
            r['round'] = rnd; r['tells'] = tells(os.path.join(base, subj, 'rig_S.png'))
            r['proportions'] = shape(base, subj) if subj == 'truck' else None
            subs.append(r)
    rep = dict(row='[the truck turned up]', made='10/18', tool='tools/bohemia_direction_the_truck_turned_up.py', subjects=subs,
               real_pickup='length:width 2.72, length:height 2.86 (5.3 x 1.95 x 1.85 m)')
    json.dump(rep, open(os.path.join(D, 'report.json'), 'w'), indent=1)
    print(sheet(rep))
    for s in subs: print(s['subject'], s['round'], s['tells'], s['proportions'], s['card'], [d for d in s['held'] if s['held'][d][0] is False])


if __name__ == '__main__':
    main()
