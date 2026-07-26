#!/usr/bin/env python3
"""BOHEMIA V12 SLICE ASSEMBLER (7/18/26, v2 — the INTERSECTION slice).

v1 mistake (Paolo, verbatim): "we were so hard on intersections and the
street lights, they're not even here... there's invisible walls
everywhere I'm bumping into." Both were real: v1 walked four random
STREET cells (no intersection, no signals) and blocked every wrecked-car
footprint on the road, so the road felt full of invisible walls.

v2 fixes both. The slice IS the intersection we built, with the stoplights
standing at all four approaches (facing law), and the ONLY solid cells are
the mast pole bases and the corner lamps — off the road, at the corners.
The whole road, crosswalks and box are freely walkable; the signal arms
just overhang (you walk under them). You walk up to a dead Vegas
intersection and our stoplights are right there.

The bake stays the world (V12 thesis): markings + signals + lamps baked
native, zero overlay. Harness (light pass, patrol, walk loop) reused
verbatim from V11.

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
PNG = 'slices/BOHEMIA_V12_INTERSECTION_INTACT_7_18_26.png'
OCCJSON = 'slices/BOHEMIA_V12_INTERSECTION_INTACT_7_18_26.occ.json'
T = 44


def main():
    # 1. bake the intersection with all four stoplights standing (writes the
    #    PNG + an .occ.json sidecar of the solid cells)
    r = subprocess.run(['python3', 'tools/bohemia_bake_factory.py',
                        '--intersection', '3', '3', 'intact'],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print('BAKE FAILED: ' + r.stderr[:400]); return 1
    sc = json.load(open(OCCJSON))
    H = sc['H']
    W = 24
    c0, r0, c1, r1 = sc['box']

    img = Image.open(PNG).convert('RGB')
    buf = io.BytesIO(); img.save(buf, 'JPEG', quality=90)
    day = base64.b64encode(buf.getvalue()).decode()

    # 2. OCC: ONLY the solid furniture — mast pole bases + standing lamps.
    #    The road box, crosswalks and approaches stay open.
    occ = set()
    for cx, cy in sc['signal_cells']:
        occ.add((cx, cy))
    for cx, cy in sc['lamp_cells']:
        occ.add((cx, cy))
    occ = sorted(o for o in occ if 0 <= o[0] < W and 0 <= o[1] < H)

    # spawn on the SOUTH approach, a few cells below the crosswalk, so the
    # opening view frames the south stoplight + crosswalk + lane markings
    # (the box interior is clean by design — don't open on empty asphalt)
    blocked = set(occ)
    tgtx, tgty = (c0 + c1) // 2, min(H - 3, r1 + sc['cwn'] + 3)
    spawn = None
    for rad in range(0, 14):
        for dx in range(-rad, rad + 1):
            for dy in range(-rad, rad + 1):
                nx, ny = tgtx + dx, tgty + dy
                if 0 <= nx < W and 0 <= ny < H and (nx, ny) not in blocked:
                    spawn = (nx, ny); break
            if spawn:
                break
        if spawn:
            break
    sx, sy = spawn or (tgtx, tgty)

    # 3. reuse V11's harness blocks verbatim
    h = open(V11, encoding='utf-8').read()
    scripts = re.findall(r'<script>.*?</script>', h, re.S)
    light_block, patrol_block, walk_block = scripts[0], scripts[2], scripts[3]
    for tag in ('MARKINGS-DRAW', 'LAMPS-IMGS', 'LAMPS-DRAW', 'PATROL-DRAW'):
        walk_block = re.sub(r'/\*%s\*/.*?/\*/%s\*/' % (tag, tag), '', walk_block, flags=re.S)
    walk_block = walk_block.replace('let guy={x:12,y:6', 'let guy={x:%d,y:%d' % (sx, sy))
    # open in DAYLIGHT so the intersection + stoplights read immediately
    # (V11 started the world clock at 22:00 night)
    walk_block = walk_block.replace('makeWorldClock(0.917)', 'makeWorldClock(0.52)')
    walk_block = walk_block.replace('let TOD=0.917', 'let TOD=0.52')

    data_block = ('<script>\nconst DAY=%r;\nconst CELL=%d;\nconst W=%d,H=%d;\n'
                  'const OCC=%s;\nconst FIRES=[];\nconst DOORS=[];\n'
                  'const STATIC_LIGHTS=[];\nconst LAMPS=[];\nconst MARKINGS=[];\n'
                  '</script>' % (day, T, W, H, json.dumps([list(c) for c in occ])))

    title = 'BOHEMIA LIVE SLICE V12 — the intersection, native, walkable'
    expl = ('V12: you are standing in the dead intersection we built. Every '
            'stoplight is here at its approach (facing law), the lane markings, '
            'crosswalks and medians are baked into the ground, the corner lamps '
            'stand dark (the grid is dead in act 1). The whole road is walkable '
            '— walk up to any signal; only the poles and lamps are solid, the '
            'arms just overhang. Tap a direction to step on the beat, hold to '
            'run. This is the same ground the finished game generates, native '
            'baked, zero overlay.')

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
        '<h1>LIVE SLICE V12 — the intersection + our stoplights, baked native, walkable</h1>\n'
        '<div id="wrap"><canvas id="cv"></canvas></div>\n'
        '<div class="pad"><span></span><button id="bU">&#9650;</button><span></span>\n'
        '<button id="bL">&#9664;</button><button id="bD">&#9660;</button><button id="bR">&#9654;</button></div>\n'
        '<div style="background:#1a1a22;border:2px solid #3a3a44;border-radius:10px;padding:8px 10px;margin-top:10px">\n'
        '<label style="font-size:13px;font-weight:800">TIME OF DAY: <span id="tval">22:00</span> '
        '<button id="mode" style="float:right;margin-left:6px;font-size:12px;padding:4px 10px;border-radius:8px;border:2px solid #6a3fb5;background:#2a2a34;color:#e8e4da;font-weight:800">GAME TIME</button>'
        '<button id="tauto" style="float:right;font-size:12px;padding:4px 10px;border-radius:8px;border:2px solid #3a3a44;background:#2a2a34;color:#e8e4da;font-weight:800">AUTO: ON</button></label>\n'
        '<input type="range" id="tod" min="0" max="1000" value="520" style="width:100%%"></div>\n'
        '<div class="expl">%s</div>\n'
        '%s%s</body></html>'
    ) % (title, light_block, data_block, expl, patrol_block, walk_block)

    open(OUT, 'w', encoding='utf-8').write(out)
    print('V12 intersection slice: %dx%d, %d occ (poles+lamps only), spawn (%d,%d) in box, %d bytes -> %s'
          % (W, H, len(occ), sx, sy, len(out), OUT))
    return 0


if __name__ == '__main__':
    sys.exit(main())
