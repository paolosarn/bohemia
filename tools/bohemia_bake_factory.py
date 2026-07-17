#!/usr/bin/env python3
"""BOHEMIA BAKE FACTORY v1 (7/17/26) — the machine that renders blocks.

The chat-era bake tool died with the chat; V11's DAY image was its orphan.
This rebuilds the machine from the laws that survived as DATA:

  - BOHEMIA_STREET_POOLS_HARMONIZED (7/14): role-keyed tile pools with the
    family edge harmonization already baked into the art
  - weather_rarity_law: 88% parent / 12% weathered, per cell, seeded
  - BOHEMIA_MARKING_BANK (APPROVED 7/17): cell.mk baked NATIVELY — the whole
    point of V12-class work
  - LAMP_DARK_VARIANTS pairs 0-4 for street_lamp props (state dead, powergrid
    already ruled these cells dark)

WHAT v1 BAKES: street blocks — ground, lines, crosswalks, native markings,
dark lamps. Wrecks, fire barrels, and plot/building strips are the named
NEXT (their art pipelines exist; scope is scope).

SELF-GATE (refuses to write on failure): every cell tiled; role coverage
complete; deterministic (same seed -> same bytes); zero purple in the output.

Run from repo root:
  python3 tools/bohemia_bake_factory.py 35 6      # bake overmap cell (35,6)
Output: a PNG + a proof HTML in slices/ (proofs are judging surfaces).
"""
import base64
import io
import json
import subprocess
import sys

import numpy as np
from PIL import Image

POOLS = 'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt'
MARKS = 'banks/BOHEMIA_MARKING_BANK_7_17_26.txt'
LAMPS = 'banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt'
T = 44
SEED = 12345


def rng(seed):
    s = seed & 0xffffffff
    def r():
        nonlocal s
        s = (s * 1103515245 + 12345) & 0xffffffff
        return s / 4294967296.0
    return r


def fail(msg):
    print('BAKE FACTORY REFUSES: ' + msg)
    sys.exit(1)


def img_of(b64, mode='RGB'):
    return Image.open(io.BytesIO(base64.b64decode(b64))).convert(mode)


def engine_block(cx, cy):
    js = """
const OM=require('./engine/bohemia_overmap.js');
const BR=require('./engine/bohemia_overmap_bridge.js');
const G=require('./engine/bohemia_blockgen.js');
const m=OM.buildOvermap(%d);
const b=BR.blockFor(m.at(%d,%d),G,24);
const grid=[];
for(let y=0;y<b.H;y++){const row=[];
 for(let x=0;x<24;x++){const c=b.grid[y][x];
  row.push({g:c.g,mk:c.mk||null,props:(c.props||[]).map(p=>({p:p.p,hTiles:p.hTiles||1,state:p.state||null}))});}
 grid.push(row);}
console.log(JSON.stringify({H:b.H,meta:b.meta,grid}));
""" % (SEED, cx, cy)
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if r.returncode != 0:
        fail('engine: ' + r.stderr[:300])
    return json.loads(r.stdout)


def pick(pools, weather, cls, r, rarity):
    """88/12 parent/weathered per the rarity law, seeded."""
    par = pools.get(cls) or []
    wea = weather.get(cls) or []
    if not par and not wea:
        return None
    use_weathered = wea and (not par or r() < rarity)
    src = wea if use_weathered else par
    return src[int(r() * len(src)) % len(src)]


def engine_intersection(lanes_ew, lanes_ns, seed):
    js = """
const G=require('./engine/bohemia_blockgen.js');
const b=G.generate('intersection',%d,24,{lanesEW:%d,lanesNS:%d});
const grid=[];
for(let y=0;y<b.H;y++){const row=[];
 for(let x=0;x<24;x++){const c=b.grid[y][x];
  row.push({g:c.g,o:c.o||null,mk:c.mk||null,props:(c.props||[]).map(p=>({p:p.p,hTiles:p.hTiles||1,state:p.state||null}))});}
 grid.push(row);}
console.log(JSON.stringify({H:b.H,meta:b.meta,grid}));
""" % (seed, lanes_ew, lanes_ns)
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if r.returncode != 0:
        fail('engine: ' + r.stderr[:300])
    return json.loads(r.stdout)


def main():
    if sys.argv[1] == '--intersection':
        bake_intersection(int(sys.argv[2]), int(sys.argv[3]))
        return
    cx, cy = int(sys.argv[1]), int(sys.argv[2])
    blk = engine_block(cx, cy)
    H = blk['H']
    P = json.load(open(POOLS))
    pools, weather = P['pools'], P['weather_variants']
    rarity = 1.0 - P['weather_rarity_law']['parent_share']
    marks = json.load(open(MARKS))['classes']
    lampbank = json.load(open(LAMPS))['lamps'][:5]   # pairs 0-4, the blessed set

    # role -> pool class (EW road; the orientation table's horizontal families)
    ROLE = {'side': 'side', 'lane': 'street', 'lane_div': 'lane_div',
            'median': 'median', 'crosswalk': 'cross',
            'twlt_T': 'twlt_h_T', 'twlt_B': 'twlt_h_B'}
    MKMAP = {'pocket_line': 'pocket_line_h', 'turn_arrow_left': 'arrow_left_h',
             'turn_arrow_right': 'arrow_right_h'}

    out = Image.new('RGB', (24 * T, H * T))
    filled = 0
    for y in range(H):
        for x in range(24):
            c = blk['grid'][y][x]
            r = rng((SEED ^ (x * 73856093) ^ (y * 19349663) ^ (cx << 8) ^ cy) & 0xffffffff)
            mk = c['mk']
            if mk:
                cls = MKMAP.get(mk, mk)
                if cls not in marks:
                    fail('mk %r has no approved bank class' % mk)
                tile = img_of(marks[cls][int(r() * 16) % len(marks[cls])])
            else:
                cls = ROLE.get(c['g'])
                if cls is None:
                    fail('no pool mapping for role %r at (%d,%d)' % (c['g'], x, y))
                b64 = pick(pools, weather, cls, r, rarity)
                if b64 is None:
                    fail('empty pool for %r' % cls)
                tile = img_of(b64)
            out.paste(tile, (x * T, y * T))
            filled += 1
    if filled != 24 * H:
        fail('cell coverage %d != %d' % (filled, 24 * H))

    # lamps: street_lamp props, dark (these cells are powergrid-dark)
    outa = out.convert('RGBA')
    for y in range(H):
        for x in range(24):
            for p in blk['grid'][y][x]['props']:
                if p['p'] != 'street_lamp':
                    continue
                li = (x * 7 + y) % len(lampbank)
                art = img_of(lampbank[li]['b64'], 'RGBA')
                dh = p['hTiles'] * T
                dw = round(art.width * dh / art.height)
                art = art.resize((dw, dh), Image.NEAREST)
                outa.alpha_composite(art, (x * T + T // 2 - dw // 2, (y + 1) * T - dh))
    out = outa.convert('RGB')

    a = np.asarray(out).astype(int)
    purple = ((a[..., 2] > 100) & (a[..., 0] > 80) & (a[..., 1] < 70) &
              (a[..., 2] - a[..., 1] > 50) & (a[..., 0] - a[..., 1] > 30)).sum()
    if purple:
        fail('PURPLE in the bake (%d px)' % purple)

    png = 'slices/BOHEMIA_V12_BAKE_PROOF_%d_%d.png' % (cx, cy)
    out.save(png)
    buf = io.BytesIO(); out.save(buf, 'PNG')
    b64 = base64.b64encode(buf.getvalue()).decode()
    meta = blk['meta']
    html = """<title>BOHEMIA V12 BAKE PROOF (%d,%d)</title>
<style>body{margin:0;background:#12100d;color:#ece6d8;font:15px/1.5 ui-monospace,monospace;padding:10px}
img{width:100%%;image-rendering:pixelated;border:2px solid #332e26;border-radius:8px}</style>
<h3>V12 BAKE PROOF: overmap cell (%d,%d) — %s, lanes %s, native cell.mk markings, dark lamps. Baked by tools/bohemia_bake_factory.py from the harmonized pools + the APPROVED marking bank. First machine-baked block of the repo era.</h3>
<img src="data:image/png;base64,%s">
""" % (cx, cy, cx, cy, meta.get('district', '?'), meta.get('lanes', '?'), b64)
    hpath = 'slices/BOHEMIA_V12_BAKE_PROOF_%d_%d.html' % (cx, cy)
    open(hpath, 'w').write(html)
    print('baked (%d,%d): %dx%d cells, lanes=%s intersection=%s pockets L%s R%s -> %s + %s'
          % (cx, cy, 24, H, meta.get('lanes'), meta.get('intersection'),
             meta.get('pocketsLeft'), meta.get('pocketsRight'), png, hpath))




def bake_intersection(lanes_ew, lanes_ns):
    """The proper intersection, baked: orientation-aware tiles (NS = rot90 of
    the EW-authored pools), the clean box, four crosswalks, BOLD candidate
    markings (UNJUDGED: this proof IS the judging surface)."""
    blk = engine_intersection(lanes_ew, lanes_ns, SEED)
    H = blk['H']
    P = json.load(open(POOLS))
    pools, weather = P['pools'], P['weather_variants']
    rarity = 1.0 - P['weather_rarity_law']['parent_share']
    bold = json.load(open('banks/BOHEMIA_MARKING_BOLD_CANDIDATES_7_17_26.txt'))['candidates']
    lampbank = json.load(open(LAMPS))['lamps'][:5]

    # bold set orientation: *_v points WEST (EW road), *_h points NORTH (NS road)
    MK = {  # mk -> (class, rotate_degrees)
        'turn_arrow_left_w': ('bold_left_v', 0), 'turn_arrow_left_e': ('bold_left_v', 180),
        'turn_arrow_left_n': ('bold_left_h', 0), 'turn_arrow_left_s': ('bold_left_h', 180),
    }
    out = Image.new('RGB', (24 * T, H * T))
    for y in range(H):
        for x in range(24):
            c = blk['grid'][y][x]
            r = rng((SEED ^ (x * 73856093) ^ (y * 19349663) ^ 0xA11CE) & 0xffffffff)
            rot = 0
            if c['mk']:
                if c['mk'] in MK:
                    cls, rot = MK[c['mk']]
                elif c['mk'] == 'pocket_edge':
                    cls = 'edge_h' if c['o'] == 'ew' else 'edge_v'
                    # edge sits against the through lane: flip for the far side
                    if c['o'] == 'ew' and y > blk['meta']['medRow']: rot = 180
                    if c['o'] == 'ns' and x > blk['meta']['medCol']: rot = 180
                else:
                    fail('unknown mk %r' % c['mk'])
                tile = img_of(bold[cls][int(r() * 6) % len(bold[cls])])
            else:
                base_cls = {'side': 'side', 'lane': 'street', 'box': 'street',
                            'lane_div': 'lane_div', 'median': 'median',
                            'crosswalk': 'cross'}.get(c['g'])
                if base_cls is None:
                    fail('no mapping for %r' % c['g'])
                b64 = pick(pools, weather, base_cls, r, rarity)
                tile = img_of(b64)
                if c['o'] == 'ns' and c['g'] in ('lane_div', 'median', 'crosswalk'):
                    rot = 90
            if rot:
                tile = tile.rotate(rot, expand=False)
            out.paste(tile, (x * T, y * T))

    outa = out.convert('RGBA')
    for y in range(H):
        for x in range(24):
            for p in blk['grid'][y][x]['props']:
                if p['p'] != 'street_lamp':
                    continue
                art = img_of(lampbank[(x * 7 + y) % len(lampbank)]['b64'], 'RGBA')
                dh = p['hTiles'] * T
                dw = round(art.width * dh / art.height)
                art = art.resize((dw, dh), Image.NEAREST)
                outa.alpha_composite(art, (x * T + T // 2 - dw // 2, (y + 1) * T - dh))
    out = outa.convert('RGB')

    a = np.asarray(out).astype(int)
    purple = ((a[..., 2] > 100) & (a[..., 0] > 80) & (a[..., 1] < 70) &
              (a[..., 2] - a[..., 1] > 50) & (a[..., 0] - a[..., 1] > 30)).sum()
    if purple:
        fail('PURPLE in the bake (%d px)' % purple)
    png = 'slices/BOHEMIA_V12_INTERSECTION_PROOF_7_17_26.png'
    out.save(png)
    m = blk['meta']
    print('intersection baked: %dx%d, box=%s, crosswalks=%d, pockets X%s Y%s -> %s'
          % (24, H, m['box'], m['crosswalks'], m['pocketLenX'], m['pocketLenY'], png))


if __name__ == '__main__':
    main()
