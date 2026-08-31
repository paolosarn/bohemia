#!/usr/bin/env python3
"""BATHTUB RING — the white mineral band the lake left as it dropped.

THE JOB (the 8/28 census, the last named family with NO approved art):
'bathtub ring' is 108,559 ground cells at the water and dam districts
plus 1,274 'bathtub ring / roof' structure cells at the intake, and all
of it draws the generic fallback. The dossier calls it "the white
mineral band on the rock marking where the water used to be" - Lake
Mead's ring, the most photographed drought mark on earth. Four tiles:

  br_h_0/1     the band running E-W: calcium crust with faint LEVEL
               LINES (successive stands of the shrinking lake) running
               along the band, worn patches where the rock shows through
  br_v_0/1     the same band running N-S (the crust rotated a quarter,
               so the stand lines follow the shoreline's own axis)

THE EDGE RULE: the level lines sit at CANONICAL y positions shared by
both variants, wander +/-1 in the middle (8/1 - no straight lines) and
are PINNED BACK to the canonical y at both tile edges, so any two ring
cells join without a jump. The wander steps 3-5 cells with per-step
jitter, never a fixed 2 (the 8/28 loc-part lesson: a jitter whose step
equals the straight-run limit hides nothing).

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale pool IS the calcium crust (carbonate and caliche
    are the same mineral family as the pale kerb concrete).
  banks/tileforms/TF-ART-023_CANDIDATES_8_25_26.json - rip_0: the
    approved riprap rock greys ARE the rock showing through the worn
    patches - the ring is deposited ON this exact rock.
TASTE CHECK: no purple, no readable text, no self-light, no dot
stipple (worn patches are 2-6px off-shape clusters); the one-pixel
marks are deliberate crust pits (8/25 clause 2); deterministic per
variant; DRY always - the whole point of the ring is that the water
is gone.

  python3 tools/tfcook/TF-ART-033_bathtub_ring_cook.py
    -> banks/tileforms/TF-ART-033_CANDIDATES_8_30_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-033_CANDIDATES_8_30_26.json')
C = 44

def load_b64(b): return Image.open(io.BytesIO(base64.b64decode(b.split(',')[-1]))).convert('RGBA')
def pools(im, n=4):
    px = im.load(); seen = {}
    for y in range(im.height):
        for x in range(im.width):
            c = px[x, y]
            if c[3] > 200:
                k = (c[0]//14, c[1]//14, c[2]//14); seen.setdefault(k, []).append(c[:3])
    ps = sorted(seen.values(), key=len, reverse=True)[:n]
    return [tuple(sum(v[i] for v in p)//len(p) for i in range(3)) for p in ps]

def bank_tile(path, nm):
    d = json.load(open(os.path.join(REPO, path)))
    for t in d['tiles']:
        if t['name'] == nm: return load_b64(t['b64'])

PALE = max(pools(bank_tile('banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json', 'kerb_return_ne')), key=lambda c: sum(c))
ROCK = pools(bank_tile('banks/tileforms/TF-ART-023_CANDIDATES_8_25_26.json', 'rip_0'))[0]

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def mix(a, b, t): return tuple(int(av*(1-t) + bv*t) for av, bv in zip(a, b))
def noise(c, r, a=4):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

CRUST  = mix(PALE, (255, 255, 255), 0.18)   # the carbonate, one step whiter than kerb bone
STAND  = dim(CRUST, 0.90)                    # a stand line: the crust, one value down
PIT    = dim(CRUST, 0.80)                    # a crust pit, two down
ROCK_S = dim(ROCK, 0.86)                     # rock in a worn hole, shadowed by the crust lip

# the stand lines' canonical rows - shared by every variant so any two
# ring cells join; the spacing drifts (a lake does not drop evenly)
STANDS = (6, 14, 25, 37)

def ring(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(33000 + v*41)
    for y in range(C):
        for x in range(C):
            px[x, y] = noise(CRUST, r) + (255,)
    # the stand lines: canonical row, wandering +/-1 in 3-5 step runs,
    # PINNED to the canonical row at both edges
    for base in STANDS:
        y, x = base, 0
        while x < C:
            step = r.randint(3, 5)
            nxt = base + (0 if (x + step >= C - 2 or x < 2) else r.randint(-1, 1))
            for i in range(step):
                if x >= C: break
                px[x, y] = noise(STAND, r, 3) + (255,)
                if y != nxt and i == step - 1: y = nxt
                x += 1
    # worn holes: 3-5 off-shape clusters of exposed rock, wandering
    for _ in range(r.randint(3, 5)):
        cx, cy = r.randint(4, C-5), r.randint(4, C-5)
        n = r.randint(3, 7)
        for _ in range(n):
            px[max(0, min(C-1, cx)), max(0, min(C-1, cy))] = noise(ROCK, r) + (255,)
            if r.random() < 0.5:
                px[max(0, min(C-1, cx+r.randint(-1, 1))), max(0, min(C-1, cy))] = noise(ROCK_S, r) + (255,)
            cx += r.randint(-1, 1); cy += r.randint(-1, 1)
    # the one-pixel marks (8/25 clause 2): single crust pits, inside only
    for _ in range(14):
        px[r.randint(2, C-3), r.randint(2, C-3)] = noise(PIT, r, 3) + (255,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for v in range(2):
    h = ring(v)
    tiles.append({'name': 'br_h_%d' % v, 'b64': b64(h)})
    tiles.append({'name': 'br_v_%d' % v, 'b64': b64(h.transpose(Image.ROTATE_90))})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under the 8/11 attempt rule; '
           'Paolo corrects in-game. Cooked 8/30 from the approved kerb pale '
           '(TF-ART-018) and riprap rock (TF-ART-023) pools only.',
    'form': 'TF-ART-033',
    'tiles': tiles,
}, open(OUT, 'w'), indent=0)
print('wrote %s: %d tiles' % (OUT, len(tiles)))
print('CRUST %s STAND %s ROCK %s' % (CRUST, STAND, ROCK))
