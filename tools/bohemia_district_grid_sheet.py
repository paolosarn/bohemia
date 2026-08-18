#!/usr/bin/env python3
"""
BOHEMIA DISTRICT GRID SHEET (8/11/26, WORLD lane) — the cell as a GRID OF SQUARES.

    "I need to see what one fucking district grid of a street of an intersection of a
     freeway and a freeway intersection looks like... in a square like the square crib
     not like you put it in a box and call it a square picture bro like the school you
     know how the map is 96 x 96 square squares in grids I need to see it by a grid"
                                                                    -- Paolo, 8/11/26

WHAT I HAD BEEN SHOWING HIM AND WHY IT WAS THE WRONG THING. Every surface in this repo
renders a district as a 3/4 ISOMETRIC PICTURE and then puts that picture in a square
frame. He does not want a square picture of a district. He wants THE DISTRICT'S GRID:
the 128 x 128 tiles the cell is actually made of, drawn as squares, in a grid, seen
straight down -- the thing the game generates and the thing a body walks. A diamond in a
box is a drawing of it. This is IT.

THE NUMBERS, so the picture is honest about scale:
    the valley   96 x 96 CELLS          (bohemia_overmap.js, OVER_N)
    one cell     128 x 128 TILES        (district kit, K.SZ)
    one tile     0.75 m                 (K.TILE) -> a cell is 96 m x 96 m
So one district grid is 16,384 squares, and every one of them has a legend entry saying
what it is (DISTRICT DOSSIER LAW). That is what gets drawn here: one square per tile, in
the district's OWN palette, with the grid ruled so the squares read AS squares.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks NO new graphic pixels and invents no colour.
  opened tools/bohemia_district_grid_dump.js -> the generated code grid + the palette +
    the per-code kind/name, straight out of each engine module. Same source the hero
    factory extrudes, so the grid and the icon are the same cell (ENGINE SYNC LAW).
  opened nothing else. Every colour on this sheet is the district's own palette entry.

  python3 tools/bohemia_district_grid_sheet.py [district ...]
    -> records/target/BOHEMIA_GRID_<district>.png   one cell, one grid
    -> records/target/BOHEMIA_GRID_SHEET.png        the four he asked for, side by side
"""
import json
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
from PIL import Image, ImageDraw

SCRATCH = os.environ.get('BOHEMIA_SCRATCH') or '/tmp'
DUMP = os.path.join(SCRATCH, 'bohemia_grid_sheet_dump.json')
OUTDIR = 'records/target'

# THE FOUR HE NAMED, in his order: a street, an intersection, a freeway, and a freeway
# interchange. Overridable on the command line; this is the default because it is the ask.
DEFAULT = ['arterial', 'arterial_x', 'freeway', 'interchange']

PX = 6          # pixels per TILE. 128 tiles x 6 = 768 px per cell -- big enough that a
                # single 0.75 m tile is a square you can actually see, which is the point.
RULE_EVERY = 8  # a heavier rule every 8 tiles (6 m) so the eye can count without straining


def _hex(h):
    h = (h or '#000000').lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def load():
    # A CACHE THAT NEVER EXPIRES IS A LIE (8/18). `if not exists(DUMP)` meant this tool
    # re-drew the SAME grids forever: I changed three engine modules, re-ran it, and got a
    # byte-identical sheet back with a cheerful success line -- the exact "a tool that
    # silently no-ops is worse than one that fails" failure this repo keeps paying for.
    # The dump is stale the moment any engine module is newer than it.
    stale = not os.path.exists(DUMP)
    if not stale:
        t = os.path.getmtime(DUMP)
        stale = any(os.path.getmtime(os.path.join('engine', f)) > t
                    for f in os.listdir('engine') if f.endswith('.js'))
    if stale:
        subprocess.run(['node', 'tools/bohemia_district_grid_dump.js', DUMP],
                       check=True, capture_output=True)
    return json.load(open(DUMP, encoding='utf8'))


def draw_cell(d, data):
    """One district cell as a grid of squares, seen straight down."""
    W, H = data['W'], data['H']
    grid, pal = data['grid'], data['palette']
    img = Image.new('RGB', (W * PX, H * PX), (26, 24, 21))
    px = img.load()
    colours = {}
    for k, v in pal.items():
        colours[int(k)] = _hex(v)
    miss = set()
    # THE KIT'S GRID IS ROWS OF ROWS, not one flat run. Read it the way it is published
    # rather than assuming a stride -- assuming one is how a renderer silently draws a
    # transposed or sheared cell and nobody notices until it ships.
    rows = grid if (grid and isinstance(grid[0], list)) else \
        [grid[r * W:(r + 1) * W] for r in range(H)]
    for y in range(H):
        row = rows[y]
        for x in range(W):
            c = row[x]
            col = colours.get(c)
            if col is None:
                miss.add(c)
                col = (200, 0, 200)      # LOUD, never quiet: an undrawn code must be seen
            x0, y0 = x * PX, y * PX
            for yy in range(y0, y0 + PX):
                for xx in range(x0, x0 + PX):
                    px[xx, yy] = col
    # THE GRID IS RULED, because "square squares in grids" is the whole request. A hairline
    # per tile so every square is legible as a square, heavier every 8 tiles (6 m) so the
    # eye can count them without straining.
    dr = ImageDraw.Draw(img, 'RGBA')
    for i in range(0, W + 1):
        a = 70 if i % RULE_EVERY else 130
        dr.line([(i * PX, 0), (i * PX, H * PX)], fill=(0, 0, 0, a))
    for j in range(0, H + 1):
        a = 70 if j % RULE_EVERY else 130
        dr.line([(0, j * PX), (W * PX, j * PX)], fill=(0, 0, 0, a))
    return img, miss


def main():
    want = [a for a in sys.argv[1:] if not a.startswith('-')] or DEFAULT
    data = load()
    os.makedirs(OUTDIR, exist_ok=True)
    made = []
    for d in want:
        if d not in data:
            print('  no grid for %s (not in the dump)' % d)
            continue
        img, miss = draw_cell(d, data[d])
        p = os.path.join(OUTDIR, 'BOHEMIA_GRID_%s.png' % d)
        img.save(p)
        made.append((d, img))
        print('  %-12s %d x %d tiles -> %s%s'
              % (d, data[d]['W'], data[d]['H'], p,
                 ('   UNPAINTED CODES: ' + ','.join(map(str, sorted(miss)))) if miss else ''))
    if len(made) > 1:
        cw = made[0][1].size[0]
        cols = 2
        rows = (len(made) + cols - 1) // cols
        gap = 14
        sheet = Image.new('RGB', (cols * cw + (cols + 1) * gap,
                                  rows * cw + (rows + 1) * gap), (16, 15, 13))
        for i, (d, im) in enumerate(made):
            cx = gap + (i % cols) * (cw + gap)
            cy = gap + (i // cols) * (cw + gap)
            sheet.paste(im, (cx, cy))
        p = os.path.join(OUTDIR, 'BOHEMIA_GRID_SHEET.png')
        sheet.save(p)
        print('  sheet -> %s  (%s)' % (p, ' '.join(d for d, _ in made)))


if __name__ == '__main__':
    main()
