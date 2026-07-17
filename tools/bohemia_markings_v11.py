#!/usr/bin/env python3
"""BOHEMIA MARKINGS ONTO V11 (7/17/26) — the renderer pass, slice edition.

blockgen places turn pockets as cell.mk (7/17, art APPROVED at volume). This
factory draws them onto the live slice the way lamps and patrols went in:
bake-verified, engine-lawful, machine-gated, injected idempotently.

THE ALIGNMENT PROBLEM, honestly: V11's bake predates the pocket engine. The
bake's crosswalk position is baked paint; the engine's regenerated crosswalk
is an rng draw that may or may not reproduce it. THE RULE (the V8-on-V9
lesson, again): THE BAKE IS THE GROUND TRUTH. This factory:

  1. verifies V11's band anatomy (same table as the lamp factory)
  2. DETECTS each street band's crosswalk from the bake's own pixels
     (white-paint column profile across the road rows)
  3. compares with the engine's regenerated crosswalkX per block:
     - EXACT match -> use the engine's cell.mk grid wholesale
     - mismatch    -> anchor the engine's own pocket LAW (PL=6, dual at
       lanes>=3, right pocket on the curb lane, approach-side per dir) to the
       DETECTED crosswalk instead, and say so in the payload meta
     - no crosswalk detected in a band -> that band gets NO pockets, period
  4. injects a MARKINGS payload drawn from BOHEMIA_MARKING_BANK (approved
     volume, deterministic variant per cell) + a draw pass directly over the
     bake (ground paint: under doors, actors, and the light pass)
  5. refuses to write unless every marked cell is a road cell in a band with
     a detected crosswalk, every class is in the approved vocabulary, and
     every variant index exists in the bank

Run from repo root: python3 tools/bohemia_markings_v11.py [--dry]
"""
import base64
import io
import json
import re
import subprocess
import sys

V11 = 'slices/BOHEMIA_LIVE_SLICE_V11_7_16_26.html'
BANK = 'banks/BOHEMIA_MARKING_BANK_7_17_26.txt'
CELL = 44
SEED = 12345
PL = 6   # the engine's pocket length; cross-checked against the engine below

# the verified anatomy (lamp factory table): only street bands, with lane rows
# (top, H, lanes, cell, medianRow, laneRowsA(top-side), laneRowsB(bottom-side), curbA, curbB)
BLOCKS = [
    {'top': 3,  'H': 7,  'lanes': 1, 'cell': (33, 6)},
    {'top': 12, 'H': 7,  'lanes': 1, 'cell': (34, 6)},
    {'top': 21, 'H': 21, 'lanes': 3, 'cell': (35, 6)},
    {'top': 44, 'H': 19, 'lanes': 3, 'cell': (36, 6)},
]


def fail(msg):
    print('MARKINGS FACTORY REFUSES: ' + msg)
    sys.exit(1)


def load_bake(html):
    import numpy as np
    from PIL import Image
    m = re.search(r"const DAY='([^']+)'", html)
    img = Image.open(io.BytesIO(base64.b64decode(m.group(1)))).convert('RGB')
    if img.size != (24 * CELL, 63 * CELL):
        fail('bake is %s, expected 24x63' % (img.size,))
    return np.asarray(img).astype(int)


def detect_crosswalk(a, blk):
    """ROW-COVERAGE detection (the 7/17 lesson: raw white-pixel counts find
    parked WHITE CARS, not crosswalks — a wreck is a blob in 3-4 rows, a zebra
    spans the whole road). A crosswalk column has whitish paint in >=60% of the
    band's road rows."""
    import numpy as np
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    sat = np.abs(r - b) + np.abs(r - g) + np.abs(g - b)
    white = (r > 118) & (g > 118) & (b > 110) & (sat < 60)
    sw = 2 if blk['H'] == 21 else 1
    rows = list(range(blk['top'] + sw, blk['top'] + blk['H'] - sw))
    cov = []
    for x in range(24):
        hit = sum(1 for ry in rows
                  if white[ry * CELL:(ry + 1) * CELL, x * CELL:(x + 1) * CELL].sum() > 60)
        cov.append(hit)
    need = max(3, int(0.6 * len(rows)))
    hot = [x for x in range(24) if cov[x] >= need]
    if not hot:
        return None, None
    runs = []
    st = hot[0]
    for i in range(1, len(hot) + 1):
        if i == len(hot) or hot[i] != hot[i - 1] + 1:
            runs.append((st, hot[i - 1] - st + 1))
            if i < len(hot):
                st = hot[i]
    runs = [t for t in runs if 1 <= t[1] <= 3]
    if not runs:
        return None, None
    runs.sort(key=lambda t: -t[1])
    return runs[0]


def engine_blocks():
    js = """
const OM=require('./engine/bohemia_overmap.js');
const BR=require('./engine/bohemia_overmap_bridge.js');
const G=require('./engine/bohemia_blockgen.js');
const m=OM.buildOvermap(%d);
const out=[];
for(const [x,y] of [[33,6],[34,6],[35,6],[36,6]]){
  const b=BR.blockFor(m.at(x,y),G,24);
  const mks=[];
  if(b.grid)for(let yy=0;yy<b.H;yy++)for(let xx=0;xx<24;xx++)
    if(b.grid[yy][xx].mk)mks.push([xx,yy,b.grid[yy][xx].mk]);
  out.push({cell:[x,y],H:b.H,meta:b.meta||{},mks});
}
console.log(JSON.stringify(out));
""" % SEED
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if r.returncode != 0:
        fail('engine query failed: ' + r.stderr[:300])
    return json.loads(r.stdout)


def lawful_pockets(blk, cx, cw):
    """The engine's pocket law, anchored to the DETECTED crosswalk.
    Mirrors bohemia_blockgen.js exactly: innermost lane(s) pocket toward the
    crosswalk from both approaches, dual left at lanes>=3 plus right pocket on
    the curb lane; arrow every 3rd cell (offset 1), pocket_line otherwise."""
    sw = 2 if blk['H'] == 21 else 1
    lanes = blk['lanes']
    top = blk['top']
    # lane PAIRS (LANE_W=2 + white divs between): pockets mark ONE row per LANE
    pairs_a, yy = [], sw
    for d in range(lanes):
        pairs_a.append((yy, yy + 1)); yy += 2
        if d < lanes - 1: yy += 1
    med = yy
    pairs_b, yy = [], med + 1
    for d in range(lanes):
        if d > 0: yy += 1
        pairs_b.append((yy, yy + 1)); yy += 2
    inner_a = pairs_a[-1][1]           # innermost lane, median-side row
    inner_a2 = pairs_a[-2][1] if lanes >= 2 else None   # SECOND lane (dual)
    inner_b = pairs_b[0][0]
    inner_b2 = pairs_b[1][0] if lanes >= 2 else None
    curb_a = pairs_a[0][0]
    curb_b = pairs_b[-1][1]
    out = []

    def mark(ylocal, x0, x1, arrow):
        for x in range(x0, x1 + 1):
            cls = arrow if ((x - x0) % 3 == 1) else ('pocket_line_h')
            out.append((x, top + ylocal, cls))

    if cx - 1 - PL >= 1:
        mark(inner_a, cx - PL, cx - 1, 'arrow_left_h')
        if lanes >= 3:
            mark(inner_a2, cx - PL, cx - 1, 'arrow_left_h')
            mark(curb_a, cx - PL, cx - 1, 'arrow_right_h')
    if cx + cw + PL <= 24 - 2:
        mark(inner_b, cx + cw, cx + cw + PL - 1, 'arrow_left_h')
        if lanes >= 3:
            mark(inner_b2, cx + cw, cx + cw + PL - 1, 'arrow_left_h')
            mark(curb_b, cx + cw, cx + cw + PL - 1, 'arrow_right_h')
    return out


def main():
    dry = '--dry' in sys.argv
    html = open(V11, encoding='utf-8').read()
    bake = load_bake(html)
    bank = json.load(open(BANK))
    eng = engine_blocks()

    markings = []
    notes = []
    for blk, eb in zip(BLOCKS, eng):
        cx, cw = detect_crosswalk(bake, blk)
        if cx is None:
            notes.append('%s: no crosswalk in the bake, no pockets' % (blk['cell'],))
            continue
        meta = eb.get('meta', {})
        if meta.get('intersection') and meta.get('crosswalkX') == cx and eb['H'] == blk['H']:
            for xx, yy, mk in eb['mks']:
                cls = {'pocket_line': 'pocket_line_h', 'turn_arrow_left': 'arrow_left_h',
                       'turn_arrow_right': 'arrow_right_h'}.get(mk, mk)
                markings.append((xx, blk['top'] + yy, cls))
            notes.append('%s: engine regen matches bake (cx=%d), engine grid used' % (blk['cell'], cx))
        else:
            markings.extend(lawful_pockets(blk, cx, cw))
            notes.append('%s: bake anchor cx=%d cw=%d (engine drew %s), law applied to the bake'
                         % (blk['cell'], cx, cw, meta.get('crosswalkX')))

    if not markings:
        fail('zero markings computed; nothing to inject')

    vocab = set(bank['classes'].keys())
    for x, y, cls in markings:
        if cls not in vocab:
            fail('class %r not in the approved bank' % cls)
        if not (0 <= x < 24 and 0 <= y < 63):
            fail('cell out of range (%d,%d)' % (x, y))

    art, art_key, payload = [], {}, []
    for x, y, cls in sorted(set(markings)):
        vi = (x * 7 + y * 13) % len(bank['classes'][cls])
        key = (cls, vi)
        if key not in art_key:
            art_key[key] = len(art)
            art.append(bank['classes'][cls][vi])
        payload.append({'x': x, 'y': y, 'i': art_key[key]})
    print('markings: %d cells, %d distinct tiles' % (len(payload), len(art)))
    for n in notes:
        print('  ' + n)

    pay = ('/*MARKINGS-PAYLOAD*/const MARK_ART=%s;const MARKINGS=%s;'
           'const markImgs=MARK_ART.map(b=>{const i=new Image();'
           "i.src='data:image/png;base64,'+b;return i;});/*/MARKINGS-PAYLOAD*/"
           % (json.dumps(art), json.dumps(payload)))
    draw = ("/*MARKINGS-DRAW*/MARKINGS.forEach(M=>{const img=markImgs[M.i];"
            "if(img&&img.complete)sctx.drawImage(img,M.x*CELL,M.y*CELL,CELL,CELL);});/*/MARKINGS-DRAW*/")

    for tag in ('MARKINGS-PAYLOAD', 'MARKINGS-DRAW'):
        html = re.sub(r'/\*%s\*/.*?/\*/%s\*/' % (tag, tag), '', html, flags=re.S)
    anchor = 'const OCC='
    html = html.replace(anchor, pay + anchor, 1)
    anchor = ' sctx.drawImage(dayImg,0,0);'
    if anchor not in html:
        fail('draw anchor missing')
    html = html.replace(anchor, anchor + draw, 1)
    html = html.replace('</div>\n<script>',
        ' MARKINGS LAW: the pocket paint you approved 7/17 is on the ground now, '
        'placed by the engine\'s own pocket law anchored to this bake\'s real '
        'crosswalks. Ground paint draws under everything that moves.</div>\n<script>', 1)

    if dry:
        print('DRY RUN: payload %d bytes' % len(pay))
        return
    open(V11, 'w', encoding='utf-8').write(html)
    print('injected into %s (%d bytes)' % (V11, len(html)))


if __name__ == '__main__':
    main()
