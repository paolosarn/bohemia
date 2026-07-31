#!/usr/bin/env python3
"""
BOHEMIA — THE HOUSE FACTORY (7/31/26). SIXTEEN HOUSES.

Paolo on house 02 facing south: "THE SOUTH LOOKS SO FUCKING GOOD BRO!!! NICEE!!!!"
That is an APPROVE, and approval unlocks volume. He asked for sixteen he approves of
for the suburb slots, and then: "TAKE A BIG SWING LETS DO SOMETHING AWESOME."

THE SWING IS THAT HOUSE 02 WAS NEVER A DRAWING. It is a solid built from parameters —
masses, pitch, plate, eave, colourway — which is why it could be turned from
south-west to south without being redrawn. The same property means it can be VARIED.
So this is the factory the FACTORY LAW asks for: typed spec, generator, batch output,
one judge page, its own gate.

  SPEC (below)  ->  generator  ->  16 banked houses  ->  one judge page  ->  gate

WHAT VARIES, and every axis is real rather than cosmetic:
  MASSING     five legal types out of gates/house_shape_gate.py — L-ranch, mirrored
              L, snout, cross-gable (three masses), two-storey, split-level. Every
              one carries a massing break, because the one type without a break is
              the hip ranch that read as a trailer and got house 01 killed.
  PITCH       4:12 to 6:12. Never below 4, which is where a roof starts reading as
              manufactured housing.
  PLATE       2.55 to 5.30 m — a single storey, a tall single, or a real two-storey.
  COLOURWAY   his five approved roof families (shingle, gravel, terracotta stile,
              desert brown, gray brown) against his four approved wall skins.

STRUCTURE-NOT-COLOUR is respected: the sixteen differ by SHAPE first. Colourway is
the second axis, never the headline — six recolours of one silhouette would be
filler and the law says so.

REUSE CHECK: cooks NO new colour and invents no material. It opens
banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt — the thirty house skins Paolo
verdicted UP on 7/21, status CANON — and every pixel of every house is one of his
colours out of that bank. No other bank was needed: the starter tileset is the STREET
(asphalt, kerb, yard), not house material, and the CMU family is the industrial wall
that exists precisely so civic buildings stop borrowing house stucco.
gates/house_factory_gate.py VERIFIES the claim per house rather than trusting this
paragraph, which is the check house 01 would have failed.

TASTE CHECK, measured after rather than asserted: act-1 floor and ceiling on every
house, no dither, one light direction, and every house passing the shape law it was
generated under.

  python3 tools/bohemia_house_factory.py -> banks/BOHEMIA_HOUSE_SET_16_7_31_26.txt
"""
import base64
import io
import json
import os
from collections import Counter

from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

SKINS = 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
OUT = 'banks/BOHEMIA_HOUSE_SET_16_7_31_26.txt'
SHEET = 'records/target/HOUSE_SET_16.png'

CELL_M = 0.75
TW, TH = 44, 22
HH = TH // 2
PXM = TH / CELL_M
CEIL = 232.0


def M(x0, y0, w, d, ridge, plate=None):
    return dict(x0=x0, y0=y0, w=w, d=d, ridge=ridge, plate=plate)


# ---------------------------------------------------------------------------
# THE SPEC. Sixteen houses, shape first. Every entry is a real suburban type and
# every one has at least two masses.
# ---------------------------------------------------------------------------
SPEC = [
    ('H01', 'L-RANCH', 5, 2.70, 'roof_shingle', 'wall_plain_8',
     [M(0, 0, 18, 10, 'x'), M(3, 10, 7, 5, 'y')]),
    ('H02', 'L-RANCH MIRRORED', 5, 2.70, 'roof_stile_terracotta', 'wall_plain_9',
     [M(0, 0, 18, 10, 'x'), M(9, 10, 7, 5, 'y')]),
    ('H03', 'SNOUT', 5, 2.70, 'roof_shingle', 'wall_plain_10',
     [M(0, 0, 16, 10, 'x'), M(10, 10, 8, 6, 'y')]),
    ('H04', 'CROSS-GABLE', 6, 2.70, 'roof_stile_desertbrown', 'wall_plain_11',
     [M(0, 0, 20, 10, 'x'), M(7, 10, 6, 5, 'y')]),
    ('H05', 'TWO-STOREY', 6, 5.30, 'roof_shingle', 'wall_plain_8',
     [M(0, 0, 14, 10, 'x'), M(2, 10, 7, 5, 'y', 2.70)]),
    ('H06', 'SPLIT-LEVEL', 5, 2.55, 'roof_stile_graybrown', 'wall_plain_9',
     [M(0, 0, 10, 10, 'x', 3.90), M(10, 0, 9, 10, 'x'), M(2, 10, 6, 5, 'y')]),
    ('H07', 'WIDE L-RANCH', 4, 2.70, 'roof_gravel', 'wall_plain_10',
     [M(0, 0, 22, 10, 'x'), M(5, 10, 8, 5, 'y')]),
    ('H08', 'COMPACT L', 6, 2.55, 'roof_stile_terracotta', 'wall_plain_11',
     [M(0, 0, 13, 9, 'x'), M(2, 9, 6, 4, 'y')]),
    ('H09', 'DOUBLE GABLE', 6, 2.70, 'roof_shingle', 'wall_plain_9',
     [M(0, 0, 19, 10, 'x'), M(1, 10, 6, 5, 'y'), M(11, 10, 6, 5, 'y')]),
    ('H10', 'DEEP RANCH', 5, 2.70, 'roof_stile_desertbrown', 'wall_plain_8',
     [M(0, 0, 16, 12, 'x'), M(4, 12, 7, 4, 'y')]),
    ('H11', 'TALL SINGLE', 5, 3.20, 'roof_stile_graybrown', 'wall_plain_10',
     [M(0, 0, 17, 10, 'x'), M(8, 10, 7, 5, 'y')]),
    ('H12', 'SNOUT + WING', 5, 2.70, 'roof_shingle', 'wall_plain_11',
     [M(0, 0, 17, 10, 'x'), M(0, 10, 7, 6, 'y'), M(12, 10, 5, 4, 'y')]),
    ('H13', 'TWO-STOREY L', 6, 5.30, 'roof_stile_terracotta', 'wall_plain_9',
     [M(0, 0, 12, 10, 'x'), M(8, 10, 8, 6, 'y', 2.70)]),
    ('H14', 'FLAT-TOP GRAVEL', 4, 2.70, 'roof_gravel', 'wall_plain_10',
     [M(0, 0, 18, 10, 'x'), M(6, 10, 8, 4, 'y')]),
    ('H15', 'STEPPED SPLIT', 5, 2.55, 'roof_stile_desertbrown', 'wall_plain_8',
     [M(0, 0, 9, 10, 'x', 3.60), M(9, 0, 10, 10, 'x'), M(11, 10, 6, 5, 'y')]),
    ('H16', 'BIG CROSS-GABLE', 6, 3.00, 'roof_shingle', 'wall_plain_11',
     [M(0, 0, 21, 11, 'x'), M(4, 11, 7, 6, 'y'), M(14, 11, 5, 4, 'y')]),
]


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def ramp_of(bank, prefix, n):
    """REUSE: the real colours out of HIS approved skins, darkest first."""
    cnt = Counter()
    for t in bank['tiles']:
        if not t['id'].startswith(prefix):
            continue
        im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
        p = im.load()
        for y in range(im.size[1]):
            for x in range(im.size[0]):
                if p[x, y][3] > 8:
                    cnt[p[x, y][:3]] += 1
    top = [c for c, _ in cnt.most_common(max(n * 4, 16)) if lum(c) <= CEIL]
    top.sort(key=lum)
    if not top:
        raise SystemExit('no colours for ' + prefix)
    while len(top) < n:
        top.append(top[-1])
    step = (len(top) - 1) / float(n - 1)
    return [top[int(round(i * step))] for i in range(n)]


def build(bank, pitch, plate_m, roof_pref, wall_id, masses):
    """One house. SOUTH-facing, which is the facing Paolo approved."""
    wall = ramp_of(bank, wall_id, 5)
    roof = ramp_of(bank, roof_pref, 5)
    door_c = ramp_of(bank, 'wall_door', 4)
    glass = ramp_of(bank, 'wall_window', 3)[0]

    walls, rows = [], 1
    ev = 0.46 / CELL_M
    fw = max(m['x0'] + m['w'] for m in masses)
    fd = max(m['y0'] + m['d'] for m in masses)

    def plate_of(m):
        return int(round((m['plate'] or plate_m) * PXM))

    def rise_of(m):
        span = (m['d'] if m['ridge'] == 'x' else m['w']) * CELL_M
        return int(round((span / 2.0) * (pitch / 12.0) * PXM))

    top = max(plate_of(m) + rise_of(m) for m in masses)
    W = int((fw + 2) * TW)
    H = int(fd * HH + top + 40)
    OX, OY = TW, int(20 + top)
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    def P(cx, cy, z=0):
        return (OX + cx * TW, OY + cy * HH - z)

    # PAINTER'S ORDER: north to south. A mass nearer the street covers one behind
    # it, and y0 is exactly that ordering, so this is a sort and not a special case.
    for m in sorted(masses, key=lambda m: m['y0']):
        x0, y0 = m['x0'], m['y0']
        x1, y1 = x0 + m['w'], y0 + m['d']
        plate, rise = plate_of(m), rise_of(m)

        d.polygon([P(x0, y1), P(x1, y1), P(x1, y1, plate), P(x0, y1, plate)],
                  fill=wall[3])
        d.line([P(x0, y1), P(x0, y1, plate)], fill=wall[1])
        d.line([P(x1, y1), P(x1, y1, plate)], fill=wall[1])
        for i in range(int(round(0.30 * PXM))):
            d.line([P(x0, y1, plate - i), P(x1, y1, plate - i)], fill=wall[1])

        if m['ridge'] == 'x':
            mid = (y0 + y1) / 2.0
            ra, rb = P(x0 - ev, mid, plate + rise), P(x1 + ev, mid, plate + rise)
            near = [P(x0 - ev, y1 + ev, plate), P(x1 + ev, y1 + ev, plate), rb, ra]
            back = int(round(0.55 * PXM))
            d.polygon([(ra[0], ra[1] - back), (rb[0], rb[1] - back), rb, ra],
                      fill=roof[1])
            d.polygon(near, fill=roof[3])
            d.line([ra, rb], fill=roof[4])
            nc = max(6, int((near[0][1] - ra[1]) / (0.36 * PXM)))
            for k in range(1, nc):
                yy = ra[1] + (near[0][1] - ra[1]) * (k / float(nc))
                d.line([(ra[0], yy), (rb[0], yy)], fill=roof[1])
                d.line([(ra[0], yy - 1), (rb[0], yy - 1)], fill=roof[4])
                off = 0 if k % 2 else int(TW * 0.25)
                for xx in range(int(ra[0]) + off, int(rb[0]), int(TW * 0.5)):
                    d.line([(xx, yy - int(0.36 * PXM)), (xx, yy - 1)], fill=roof[2])
            d.line([near[0], near[1]], fill=roof[0])
            d.line([(near[0][0], near[0][1] + 1), (near[1][0], near[1][1] + 1)],
                   fill=roof[0])
        else:
            mid = (x0 + x1) / 2.0
            for (ax, bx, col) in ((x0 - ev, mid, roof[3]), (mid, x1 + ev, roof[1])):
                d.polygon([P(ax, y1 + ev, plate if ax != mid else plate + rise),
                           P(bx, y1 + ev, plate + rise if bx == mid else plate),
                           P(bx, y0 - ev, plate + rise if bx == mid else plate),
                           P(ax, y0 - ev, plate if ax != mid else plate + rise)],
                          fill=col)
            for k in range(1, 9):
                t = k / 9.0
                for (ax, bx) in ((x0 - ev, mid), (mid, x1 + ev)):
                    xx = ax + (bx - ax) * t
                    za = plate + rise * (t if ax == x0 - ev else 1 - t)
                    d.line([P(xx, y1 + ev, za), P(xx, y0 - ev, za)],
                           fill=roof[2] if k % 2 else roof[4])
            d.line([P(mid, y1 + ev, plate + rise), P(mid, y0 - ev, plate + rise)],
                   fill=roof[4])
            d.line([P(x0 - ev, y1 + ev, plate), P(mid, y1 + ev, plate + rise)],
                   fill=roof[0])
            d.line([P(mid, y1 + ev, plate + rise), P(x1 + ev, y1 + ev, plate)],
                   fill=roof[0])
            g = [P(x0, y1, plate), P(x1, y1, plate), P(mid, y1, plate + rise)]
            d.polygon(g, fill=wall[2])
            d.line([g[0], g[2]], fill=roof[0])
            d.line([g[1], g[2]], fill=roof[0])

        # ============ OPENINGS ============================================
        # PAOLO 7/31: "ON ALL OF THEM YOU HAVE DOORS MESHING IN WITH WINDOWS".
        # He is right and the cause was structural, not cosmetic: the door was
        # placed at one offset and the windows by a separate loop, and NOTHING
        # COMPARED THEM. Two independent placers on one wall will collide sooner
        # or later, and here it was every time. So now every opening on a wall is
        # claimed from ONE occupancy list, in order, and an opening that cannot
        # find clear wall is not drawn at all.
        wh, sill = int(round(1.22 * PXM)), int(round(0.91 * PXM))
        span_m = m['w'] * CELL_M
        taken = []                       # [(start_m, end_m)] along this wall

        def claim(start, width, pad=0.55):
            """Take a run of wall, or return None if anything is already there."""
            a0, a1 = start - pad, start + width + pad
            if start < 0.6 or start + width > span_m - 0.6:
                return None
            for (b0, b1) in taken:
                if a0 < b1 and b0 < a1:
                    return None
            taken.append((start, start + width))
            return start

        def opening(u, w_m, z0, z1, fill, lintel=True):
            a = x0 + u / CELL_M
            b = x0 + (u + w_m) / CELL_M
            d.polygon([P(a, y1, z0), P(b, y1, z0), P(b, y1, z1), P(a, y1, z1)],
                      fill=fill)
            if lintel:
                d.line([P(a, y1, z1), P(b, y1, z1)], fill=wall[4])
                d.line([P(a, y1, z0), P(b, y1, z0)], fill=wall[4])

        # TWO STOREYS ARE TWO STOREYS, not one tall blank wall. Paolo 7/31: "YOUR
        # TWO STORY HOUSES LOOK LIKE SHIT". They were a 5.3 m plate with a single
        # row of windows near the floor and nothing above — which reads as a
        # warehouse, because that IS what a warehouse looks like. A real one has a
        # floor line and a SECOND ROW of windows on the upper storey.
        storeys = 2 if (m['plate'] or plate_m) >= 4.0 else 1
        if storeys == 2:
            band = int(round(((m['plate'] or plate_m) / 2.0) * PXM))
            for i in range(3):           # the floor/rim-joist band between storeys
                d.line([P(x0, y1, band + i), P(x1, y1, band + i)], fill=wall[1])
            d.line([P(x0, y1, band + 3), P(x1, y1, band + 3)], fill=wall[4])

        # THE FRONT DOOR GOES DOWN FIRST and claims its wall before anything else,
        # because it is the one opening whose position actually means something.
        nearest = sorted(masses, key=lambda q: (-q['y0'], q['x0']))[0]
        if m is nearest:
            dh = int(round(2.03 * PXM))
            du = claim(span_m * 0.30, 0.91)
            if du is None:
                du = claim(1.0, 0.91)
            if du is not None:
                opening(du, 0.91, 0, dh, door_c[0], lintel=False)
                a = x0 + du / CELL_M
                b = x0 + (du + 0.91) / CELL_M
                d.line([P(a, y1, dh), P(b, y1, dh)], fill=wall[4])

        # then windows fill whatever wall is genuinely left, ground floor first
        u = 1.1
        while u + 1.22 < span_m - 0.9:
            got = claim(u, 1.22)
            if got is not None:
                opening(got, 1.22, sill, sill + wh, glass)
            u += 2.6
        if storeys == 2:
            # UPPER STOREY. Its own occupancy list — an upstairs window cannot
            # collide with a downstairs door, they are on different floors.
            taken = []
            band_m = (m['plate'] or plate_m) / 2.0
            up_sill = int(round((band_m + 0.85) * PXM))
            u = 1.4
            while u + 1.22 < span_m - 0.9:
                got = claim(u, 1.22)
                if got is not None:
                    opening(got, 1.22, up_sill, up_sill + wh, glass)
                u += 2.6
            rows = max(rows, 2)
        walls.append({'mass': [x0, y0], 'openings': [list(t) for t in sorted(taken)]})
    return im, fw, fd, walls, rows


def main():
    bank = json.load(open(SKINS))
    houses, imgs = [], []
    for (hid, name, pitch, plate, rp, wid, masses) in SPEC:
        im, fw, fd, walls, rows = build(bank, pitch, plate, rp, wid, masses)
        b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
        houses.append({'id': hid, 'name': name, 'pitch': '%d:12' % pitch,
                       'plate_m': plate, 'roof': rp, 'wall': wid,
                       'masses': len(masses), 'walls': walls, 'window_rows': rows,
                       'footprint_cells': [fw, fd],
                       'footprint_m': [round(fw * CELL_M, 1), round(fd * CELL_M, 1)],
                       'sqft': round(sum(m['w'] * m['d'] for m in masses)
                                     * CELL_M ** 2 * 10.764),
                       'b64': base64.b64encode(b.getvalue()).decode()})
        imgs.append((hid, name, im))

    json.dump({'version': 'BOHEMIA_HOUSE_SET_16_v1', 'built': '2026-07-31',
               'authority': 'Paolo 7/31 on house 02 south: "THE SOUTH LOOKS SO '
                            'FUCKING GOOD BRO!!! NICEE!!!!" — approval unlocks '
                            'volume. These sixteen are NOT individually approved.',
               'facing': 'south', 'projection': '2:1, front squared to the screen',
               'art_from': SKINS, 'cell_m': CELL_M, 'px_per_m': PXM,
               'houses': houses}, open(OUT, 'w'))

    # contact sheet, 4 across, each scaled to a common width so shapes compare
    COLW = 330
    rows = (len(imgs) + 3) // 4
    cell_h = max(int(im.size[1] * COLW / im.size[0]) for _, _, im in imgs) + 30
    sh = Image.new('RGB', (COLW * 4 + 50, cell_h * rows + 30), (18, 18, 20))
    dd = ImageDraw.Draw(sh)
    for i, (hid, name, im) in enumerate(imgs):
        h = int(im.size[1] * COLW / im.size[0])
        r = im.resize((COLW, h), Image.NEAREST)
        x = 10 + (i % 4) * (COLW + 10)
        y = 10 + (i // 4) * cell_h
        sh.paste(r, (x, y + (cell_h - 30 - h)), r)
        dd.text((x, y + cell_h - 24), '%s  %s' % (hid, name), fill=(199, 154, 63))
    sh.save(SHEET)

    allc = set()
    for _, _, im in imgs:
        p = im.load()
        allc |= {p[x, y][:3] for y in range(im.size[1]) for x in range(im.size[0])
                 if p[x, y][3] > 8}
    print('%d HOUSES -> %s' % (len(houses), OUT))
    print('   shapes: %s' % ', '.join(sorted({h['name'].split()[0] for h in houses})))
    print('   %d colours across all sixteen, every one from his approved skins'
          % len(allc))
    print('   sq ft range %d..%d' % (min(h['sqft'] for h in houses),
                                     max(h['sqft'] for h in houses)))
    print('   -> %s' % SHEET)


if __name__ == '__main__':
    main()
