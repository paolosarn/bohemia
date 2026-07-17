#!/usr/bin/env python3
"""BOHEMIA V12 SLICE ASSEMBLER (7/18/26) — the overlay era ends.

V11 baked plain terrain and PAINTED markings + lamps LIVE on top (overlay
payloads injected into the walk loop). V12's thesis: THE BAKE IS THE WORLD.
The bake factory already composites markings, wrecked cars, fire barrels
and dead lamps natively into each cell's image, so the DAY image simply IS
the ground truth. Every static overlay V11 painted live is gone; the live
layers shrink to what actually moves — actors, the player, and the day/night
ambient pass.

This assembler:
  1. bakes the same four canonical cells V11 walked — (33,6)(34,6)(35,6)
     (36,6) from seed 12345, all pure street variants (no buildings, so no
     map canon needed) — natively, and stitches them into one DAY image
  2. reads each cell's props from the engine and builds OCCUPANCY from the
     baked footprints (cars w x h, barrels, lamp bases) so the player can't
     walk through them
  3. reuses V11's harness VERBATIM (the light-pass module, the patrol
     module, the walk loop) — only swapping the DAY image, the block dims,
     and OCC, and REMOVING the markings/lamps overlay injections (native now)

Result: slices/BOHEMIA_LIVE_SLICE_V12_7_18_26.html — the same canonical
ground V11 walked, every tile now native-baked, zero overlay.

Run from repo root: python3 tools/bohemia_v12_slice.py
"""
import base64
import io
import json
import re
import subprocess
import sys

from PIL import Image

V11 = 'slices/BOHEMIA_LIVE_SLICE_V11_7_16_26.html'
OUT = 'slices/BOHEMIA_LIVE_SLICE_V12_7_18_26.html'
CELLS = [(33, 6), (34, 6), (35, 6), (36, 6)]
T = 44
SEED = 12345


def bake_cell(cx, cy):
    r = subprocess.run(['python3', 'tools/bohemia_bake_factory.py', str(cx), str(cy)],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print('BAKE FAILED (%d,%d): %s' % (cx, cy, r.stderr[:300]))
        sys.exit(1)
    return Image.open('slices/BOHEMIA_V12_BAKE_PROOF_%d_%d.png' % (cx, cy)).convert('RGB')


def cell_props(cx, cy):
    js = """
const OM=require('./engine/bohemia_overmap.js');
const BR=require('./engine/bohemia_overmap_bridge.js');
const G=require('./engine/bohemia_blockgen.js');
const m=OM.buildOvermap(%d);
const b=BR.blockFor(m.at(%d,%d),G,24);
const out={H:b.H,props:[]};
for(let y=0;y<b.H;y++)for(let x=0;x<24;x++)
  for(const p of (b.grid[y][x].props||[]))
    out.props.push({x,y,p:p.p,w:p.w||1,h:p.h||1});
console.log(JSON.stringify(out));
""" % (SEED, cx, cy)
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if r.returncode != 0:
        print('ENGINE QUERY FAILED (%d,%d): %s' % (cx, cy, r.stderr[:300]))
        sys.exit(1)
    return json.loads(r.stdout)


def main():
    # 1. bake + stitch, tracking the y-offset of each cell
    imgs, occ, y0 = [], [], 0
    for cx, cy in CELLS:
        img = bake_cell(cx, cy)
        eng = cell_props(cx, cy)
        imgs.append(img)
        for pr in eng['props']:
            gx, gy = pr['x'], y0 + pr['y']
            if pr['p'] == 'car_wreck':
                for dx in range(pr['w']):
                    for dy in range(pr['h']):
                        occ.append([gx + dx, gy + dy])
            else:                      # fire_barrel / street_lamp: one cell
                occ.append([gx, gy])
        y0 += eng['H']
    W, H = 24, y0
    stitched = Image.new('RGB', (W * T, H * T))
    yy = 0
    for img in imgs:
        stitched.paste(img, (0, yy)); yy += img.height
    buf = io.BytesIO(); stitched.save(buf, 'JPEG', quality=88)
    day = base64.b64encode(buf.getvalue()).decode()
    occ = sorted({tuple(c) for c in occ if 0 <= c[0] < W and 0 <= c[1] < H})

    # a guaranteed-walkable spawn: scan for a cell that is not in OCC, near
    # the top band's center
    blocked = set(occ)
    spawn = None
    for ny in range(2, H):
        for nx in range(8, 16):
            if (nx, ny) not in blocked:
                spawn = (nx, ny); break
        if spawn:
            break
    sx, sy = spawn or (12, 3)

    # 2. reuse V11's harness blocks verbatim
    h = open(V11, encoding='utf-8').read()
    scripts = re.findall(r'<script>.*?</script>', h, re.S)
    light_block = scripts[0]          # BOH_LIGHT + DAYCYCLE + SLICE
    patrol_block = scripts[2]         # BOH_PATROL
    walk_block = scripts[3]           # the walk loop

    # strip the overlay injections from the walk loop (native now)
    for tag in ('MARKINGS-DRAW', 'LAMPS-IMGS', 'LAMPS-DRAW', 'PATROL-DRAW'):
        walk_block = re.sub(r'/\*%s\*/.*?/\*/%s\*/' % (tag, tag), '', walk_block, flags=re.S)
    # neutralize the payload references the walk loop still names
    walk_block = walk_block.replace('let guy={x:12,y:6', 'let guy={x:%d,y:%d' % (sx, sy))

    # 3. the new data block — DAY is the whole world; the only live layers are
    #    empty here (no fires/doors/static lights in a pure street stretch)
    data_block = ('<script>\nconst DAY=%r;\nconst CELL=%d;\nconst W=%d,H=%d;\n'
                  'const OCC=%s;\nconst FIRES=[];\nconst DOORS=[];\n'
                  'const STATIC_LIGHTS=[];\nconst LAMPS=[];\nconst MARKINGS=[];\n'
                  '</script>' % (day, T, W, H, json.dumps([list(c) for c in occ])))

    title = 'BOHEMIA LIVE SLICE V12 — everything baked native, zero overlay'
    expl = ('V12: THE BAKE IS THE WORLD. The same canonical ground V11 walked '
            '(cells (33,6)(34,6)(35,6)(36,6), seed 12345) — but every marking, '
            'wrecked car, fire barrel and dead lamp is now BAKED into the tile '
            'image by the bake factory, not painted live on top. V11 injected '
            'three overlay payloads into the walk loop; V12 has NONE. The live '
            'layers are only what moves: you, the survivors, and the sun. '
            'Walk it — you are on native-baked cells, the overlay era is over.')

    out = (
        '<!DOCTYPE html><html><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>%s</title><style>\n'
        'body{background:#0d0d12;color:#e8e4da;font-family:-apple-system,sans-serif;margin:0;padding:10px;font-size:16px}\n'
        'h1{font-size:15px;color:#b39ddb;font-weight:800;margin:4px 0 8px}\n'
        '#wrap{overflow:auto;border:2px solid #3a3a44;border-radius:10px;max-height:64vh}\n'
        'canvas{image-rendering:pixelated;display:block}\n'
        '.pad{display:grid;grid-template-columns:70px 70px 70px;gap:6px;justify-content:center;margin-top:10px}\n'
        '.pad button{font-size:22px;padding:14px 0;border-radius:10px;border:2px solid #3a3a44;background:#1a1a22;color:#e8e4da;font-weight:800}\n'
        '.expl{background:#1a1a22;border:2px solid #3a3a44;border-radius:10px;padding:10px;font-size:13px;margin-top:10px}\n'
        '</style>%s%s</head><body>\n'
        '<h1>LIVE SLICE V12 — every tile native-baked, zero overlay payloads</h1>\n'
        '<div id="wrap"><canvas id="cv"></canvas></div>\n'
        '<div class="pad"><span></span><button id="bU">&#9650;</button><span></span>\n'
        '<button id="bL">&#9664;</button><button id="bD">&#9660;</button><button id="bR">&#9654;</button></div>\n'
        '<div style="background:#1a1a22;border:2px solid #3a3a44;border-radius:10px;padding:8px 10px;margin-top:10px">\n'
        '<label style="font-size:13px;font-weight:800">TIME OF DAY: <span id="tval">22:00</span> '
        '<button id="mode" style="float:right;margin-left:6px;font-size:12px;padding:4px 10px;border-radius:8px;border:2px solid #6a3fb5;background:#2a2a34;color:#e8e4da;font-weight:800">GAME TIME</button>'
        '<button id="tauto" style="float:right;font-size:12px;padding:4px 10px;border-radius:8px;border:2px solid #3a3a44;background:#2a2a34;color:#e8e4da;font-weight:800">AUTO: ON</button></label>\n'
        '<input type="range" id="tod" min="0" max="1000" value="917" style="width:100%%"></div>\n'
        '<div class="expl">%s</div>\n'
        '%s%s</body></html>'
    ) % (title, light_block, data_block, expl, patrol_block, walk_block)

    open(OUT, 'w', encoding='utf-8').write(out)
    print('V12 slice: %dx%d cells, %d occ, spawn (%d,%d), %d bytes -> %s'
          % (W, H, len(occ), sx, sy, len(out), OUT))
    return 0


if __name__ == '__main__':
    sys.exit(main())
