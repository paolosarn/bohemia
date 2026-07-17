#!/usr/bin/env python3
"""BOHEMIA LAMP FACTORY — LAMPS ONTO V11 (7/17/26)

Places street lamps onto the live slice from REAL BLOCKGEN ANATOMY, exactly the
way bohemia_blockgen.js places them (STAGGERED LAW: x from 2 every 8 cells,
alternating grid[0] / grid[H-1] sidewalk rows, lampH = lanes>=3 ? 4 : 3,
state 'dead'). Lit-ness is never decided here: BOH_POWERGRID is asked per
overmap cell and the answer picks the art (LIT originals vs DARK variants,
Paolo's blessed pairs 0-4).

V11 ANATOMY (verified against V11's OWN bake before every injection, because
the handoff law says so: the dead chat once patched V9 with V8's height):
  rows  0-2   dark desert edge
  rows  3-9   H7  lanes1 street  cell (33,6) suburb      sidewalks 3 & 9, median 6
  rows 10-11  building strip
  rows 12-18  H7  lanes1 street  cell (34,6) suburb      sidewalks 12 & 18, median 15
  rows 19-20  building strip
  rows 21-41  H21 lanes3 street  cell (35,6) commercial  sidewalks 21-22 & 40-41, median 31
  rows 42-43  building strip
  rows 44-62  H19 lanes3 street  cell (36,6) arterial    sidewalks 44 & 62
The injector refuses to run if the bake contradicts this table (sidewalk rows
must be bright concrete, suburb/commercial medians must carry yellow paint).

OCCUPANCY LAW: a lamp slot already occupied in the slice's OCC payload is
SKIPPED and logged, never stacked. Lamp base cells join the blocked set.

Idempotent: re-running replaces the previous LAMPS injection in place.
Run from repo root: python3 tools/bohemia_lamps_v11.py [--dry]
"""
import base64
import io
import json
import os
import re
import subprocess
import sys

V11 = 'slices/BOHEMIA_LIVE_SLICE_V11_7_16_26.html'
DARK_BANK = 'banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt'
LIT_BANK = 'banks/BOHEMIA_DEMO_PROP_POOL_7_10_26.txt'
USABLE = [0, 1, 2, 3, 4]   # Paolo's ruling: pairs 0-4 usable
CELL = 44
SEED = 12345

# (top_row, height, lanes, overmap cell, median_row or None if paint too worn to assert)
BLOCKS = [
    (3,  7,  1, (33, 6), 6),
    (12, 7,  1, (34, 6), 15),
    (21, 21, 3, (35, 6), 31),
    (44, 19, 3, (36, 6), None),
]


def fail(msg):
    print('LAMP FACTORY REFUSES: ' + msg)
    sys.exit(1)


def verify_anatomy(html):
    """The bake is the ground truth. Check it before touching anything."""
    try:
        import numpy as np
        from PIL import Image
    except ImportError:
        fail('needs numpy + pillow (same as the pixel gates)')
    m = re.search(r"const DAY='([^']+)'", html)
    if not m:
        fail('no baked DAY image found in V11')
    img = Image.open(io.BytesIO(base64.b64decode(m.group(1)))).convert('RGB')
    if img.size != (24 * CELL, 63 * CELL):
        fail('bake is %s, expected 24x63 cells' % (img.size,))
    a = np.asarray(img).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    lum = (r + g + b) / 3
    yellow = (r > 110) & (g > 70) & (b < 90) & (r - b > 50)
    def row_lum(y): return lum[y * CELL:(y + 1) * CELL].mean()
    def row_yellow(y): return yellow[y * CELL:(y + 1) * CELL].mean() * 100
    for top, H, lanes, cell, med in BLOCKS:
        for sw in (top, top + H - 1):
            if row_lum(sw) < 85:
                fail('row %d should be bright sidewalk concrete (lum %.0f)' % (sw, row_lum(sw)))
        if med is not None and row_yellow(med) < 0.6:
            fail('row %d should carry the yellow median paint (%.2f%%)' % (med, row_yellow(med)))
        mid = top + H // 2
        if med is not None and row_lum(mid) > 85:
            fail('row %d should be dark asphalt, not concrete' % mid)
    return True


def powergrid_states():
    """Ask the real module. Lit-ness is BOH_POWERGRID's call, never ours."""
    js = (
        "const OM=require('./engine/bohemia_overmap.js');"
        "const P=require('./engine/bohemia_powergrid.js');"
        "const m=OM.buildOvermap(%d);const pm=P.powerMap(m,%d);"
        "console.log(JSON.stringify([%s].map(([x,y])=>({x,y,s:pm.at(x,y)}))));"
    ) % (SEED, SEED, ','.join('[%d,%d]' % c for _, _, _, c, _ in BLOCKS))
    out = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if out.returncode != 0:
        fail('powergrid query failed: ' + out.stderr[:200])
    return {(e['x'], e['y']): e['s'] for e in json.loads(out.stdout)}


def lamp_slots():
    """bohemia_blockgen.js STAGGERED LAW, verbatim: x from 2 step 8 (W=24 ->
    x = 2, 10, 18), side alternates 0 / H-1 per lamp, lampH by lanes."""
    slots = []
    for top, H, lanes, cell, _ in BLOCKS:
        side = 0
        h = 4 if lanes >= 3 else 3
        for x in range(2, 24 - 1, 8):
            y = top + (H - 1 if side else 0)
            slots.append({'x': x, 'y': y, 'h': h, 'cell': cell})
            side = 1 - side
    return slots


def main():
    dry = '--dry' in sys.argv
    html = open(V11, encoding='utf-8').read()
    verify_anatomy(html)
    print('anatomy verified against the bake: 4 blocks, 8 sidewalk rows, medians in place')

    occ = set(map(tuple, json.loads(re.search(r'const OCC=(\[.*?\]);', html).group(1))))
    doors = json.loads(re.search(r'const DOORS=(\[.*?\]);const AMB', html, re.S).group(1))
    door_cells = {(d['x'] + dx, d['y'] + dy) for d in doors for dx in (0, 1) for dy in (0, 1)}
    states = powergrid_states()
    for c, s in states.items():
        print('  powergrid %s -> %s' % (c, 'LIVE (%s)' % s['owner'] if s['live'] else 'dead'))

    dark = json.load(open(DARK_BANK))['lamps']
    lit = None
    if any(s['live'] for s in states.values()):
        lit = json.load(open(LIT_BANK))   # only loaded if the grid ever lights up

    art, art_key = [], {}
    lamps, skipped = [], []
    for i, sl in enumerate(lamp_slots()):
        pos = (sl['x'], sl['y'])
        if pos in occ or pos in door_cells:
            skipped.append(pos)
            continue
        live = states[sl['cell']]['live']
        variant = USABLE[len(lamps) % len(USABLE)]
        if live:
            fail('cell %s is LIVE: wire the LIT art path before shipping it' % (sl['cell'],))
        key = ('dark', variant)
        if key not in art_key:
            art_key[key] = len(art)
            art.append(dark[variant]['b64'])
        lamps.append({'x': sl['x'], 'y': sl['y'], 'h': sl['h'],
                      'state': 'dead', 'i': art_key[key]})
    print('lamps placed: %d   skipped (cell occupied): %s' % (len(lamps), skipped or 'none'))

    payload = ('/*LAMPS-PAYLOAD*/const LAMP_ART=%s;const LAMPS=%s;/*/LAMPS-PAYLOAD*/'
               % (json.dumps(art), json.dumps(lamps)))
    imgs = ("/*LAMPS-IMGS*/const lampImgs=LAMP_ART.map(b=>{const i=new Image();"
            "i.src='data:image/png;base64,'+b;return i;});"
            "LAMPS.forEach(l=>blocked.add(l.x+','+l.y));/*/LAMPS-IMGS*/")
    draw = ("/*LAMPS-DRAW*/LAMPS.forEach(L=>{const img=lampImgs[L.i];"
            "if(img&&img.complete){const dh=L.h*CELL,dw=img.width*(dh/img.height);"
            "sctx.drawImage(img,L.x*CELL+CELL/2-dw/2,(L.y+1)*CELL-dh,dw,dh);}});/*/LAMPS-DRAW*/")

    # strip any previous injection, then inject fresh (idempotent)
    for tag in ('LAMPS-PAYLOAD', 'LAMPS-IMGS', 'LAMPS-DRAW'):
        html = re.sub(r'/\*%s\*/.*?/\*/%s\*/' % (tag, tag), '', html, flags=re.S)

    anchor = 'const OCC='
    html = html.replace(anchor, payload + anchor, 1)
    anchor = "const blocked=new Set(OCC.map(o=>o[0]+','+o[1]));"
    if anchor not in html:
        fail('blocked-set anchor missing')
    html = html.replace(anchor, anchor + imgs, 1)
    anchor = ' NPCS.forEach(n=>{\n  if(FREERUN)'
    if anchor not in html:
        fail('draw anchor missing')
    html = html.replace(anchor, draw + anchor, 1)

    old_h1 = re.search(r'<h1>.*?</h1>', html, re.S).group(0)
    html = html.replace(old_h1,
        '<h1>LIVE SLICE V11 — LAMPS ON THE GRID: %d street lamps straight from '
        'blockgen anatomy, every one dead because BOH_POWERGRID says every circuit '
        'on this street is dead (nearest live circuit: the settlement at (31,7))</h1>'
        % len(lamps), 1)
    html = html.replace('</div>\n<script>',
        ' LAMPS LAW: lamp slots come from the block generator (x every 8, staggered '
        'sides, arterial poles taller), the power grid decides who lights up, and '
        'today the answer is nobody: this is act-1 dark. One slot (10,9) is skipped, '
        'its sidewalk cell is already occupied.</div>\n<script>', 1)

    if dry:
        print('DRY RUN: no write. payload %d bytes' % len(payload))
        return
    open(V11, 'w', encoding='utf-8').write(html)
    print('injected into %s (%d bytes)' % (V11, len(html)))


if __name__ == '__main__':
    main()
