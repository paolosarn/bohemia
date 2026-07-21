#!/usr/bin/env python3
"""
BOHEMIA CITY BUILDING ART PATCH (7/20/26) - buildings wear the approved art.

The last programmer-art layer at street level: structure cells drew flat
colored blocks. The HOUSE FACTORY BANK (banks/BOHEMIA_HOUSE_FACTORY_BANK_
7_14_26: 24 complete house stamps assembled from Paolo-approved pieces only
- seamless walls, seamless roofs, approved doors and windows) now textures
them:

  - ROOF cells (residential structure tops) draw real roof tiles cropped
    from the approved stamps (two roof families, hash variants)
  - WALL FACE rows (the front of a building, c.face) draw real wall-face
    tiles - plain wall or window wall by deterministic variant - cropped
    from the stamps' facade rows (TAN WALL territory, approved pieces)
  - doors wait for per-building placement (a face needs exactly ONE door,
    which needs building identity - not a per-cell hash; deferred honestly)
  - commercial/industrial/civic structures keep their colors this turn;
    their banks get the same treatment when their art is judged

Seed-regen friendly: pure texture substitution keyed by color + position
hash. Idempotent (marker BUILDING ART). city_tab_gate locks it.

  python3 tools/bohemia_city_buildingart_patch.py
"""
import base64
import io
import json
import os
import sys

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_HOUSE_FACTORY_BANK_7_14_26.txt'
TPX = 16
CELL = 44


def b64img(b):
    return Image.open(io.BytesIO(base64.b64decode(b + '=' * (-len(b) % 4)))).convert('RGB')


def enc(im):
    im = im.resize((TPX, TPX), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, 'PNG', optimize=True)
    return base64.b64encode(out.getvalue()).decode('ascii')


houses = json.load(open(BANK))['houses']
roofs, walls, wins = [], [], []
for h in houses[:8]:
    im = b64img(h['b64'])
    w, hh = im.size
    cols = w // CELL
    # roof: the top row's center cell
    roofs.append(enc(im.crop((CELL * (cols // 2), 0, CELL * (cols // 2) + CELL, CELL))))
    # facade: the bottom row; plain wall = a column that is neither door nor window
    win_cols = set(h.get('win_x') or [])
    door = h.get('door_x')
    plain = next((c for c in range(cols) if c not in win_cols and c != door), 0)
    walls.append(enc(im.crop((CELL * plain, hh - CELL, CELL * plain + CELL, hh))))
    for wc in list(win_cols)[:1]:
        wins.append(enc(im.crop((CELL * wc, hh - CELL, CELL * wc + CELL, hh))))

TILES = {'roof': roofs[:6], 'wallface': walls[:6], 'wallwin': wins[:4]}

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'BUILDING ART' in decoded:
    print('buildings already wear the art. no-op.')
    sys.exit(0)

# 1) tiles join the atlas
tj = json.dumps(TILES)[1:-1]
SA_OPEN = 'const SA_TILES={'
assert SA_OPEN in decoded
decoded = decoded.replace(SA_OPEN, SA_OPEN + tj + ',', 1)

# 2) residential roofs serve real art (the two SCOL roof colors)
TEX_HOOK = "if(!isStruct){ const sp=SA_MAP[col]; if(sp){ const t2=saTex(sp,variant); if(t2)return t2; } }"
assert TEX_HOOK in decoded
decoded = decoded.replace(TEX_HOOK, TEX_HOOK +
    " /* BUILDING ART (7/20): approved house-stamp roofs for residential structures */"
    " if(isStruct&&(col==='#c04030'||col==='#7a5a48')){ const t3=saTex('roof',variant); if(t3)return t3; }", 1)

# 3) wall FACES serve real facade tiles (plain or window by variant)
KIND_OPEN = 'function texForKind(kind,col,variant){'
assert KIND_OPEN in decoded
decoded = decoded.replace(KIND_OPEN, KIND_OPEN +
    " if(kind==='wall'&&(col==='#c04030'||col==='#7a5a48')){"
    " const t4=saTex(variant===3?'wallwin':'wallface',variant); if(t4)return t4; }", 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('buildings wear the art: %d roofs, %d facades, %d window walls from the approved stamps' %
      (len(TILES['roof']), len(TILES['wallface']), len(TILES['wallwin'])))
