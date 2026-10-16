"""THE PHONE'S CRACK, CUT FROM HIS PACK (UI [the phone's crack], 10/16/26).
Paolo: 'these cracks look like a seventh grader coded it' (eighth votes) and 'the cracks look like shit, they're literally just
straight lines' (eleventh votes). Rule 108: never drawn in code. This CUTS: a rectangle of a pane from his pack 5 'Windows and
broken glass', keeping only the glass pixels exactly as painted (bluish, or near-white and not warm like the stone frame) and
making the hole and the frame see-through. No pixel is moved, recoloured or added.
python3 tools/bohemia_ui_the_phones_crack_cut.py"""
import json
from PIL import Image
CUTS = {'A': ('000', (3, 7, 28, 36)), 'B': ('004', (3, 7, 77, 74)), 'C': ('011', (12, 15, 54, 79)),
        # D: five stars laid along the old crack's path from the corner it was dropped on, each a pane quadrant whole
        'D1': ('000', (3, 7, 34, 38)), 'D2': ('008', (3, 7, 34, 38)), 'D3': ('000', (38, 42, 69, 72)), 'D4': ('012', (13, 7, 40, 38)), 'D5': ('000', (3, 42, 34, 72))}
def glass(p):
    r, g, b, a = p
    if a < 200: return False
    lum = .3 * r + .59 * g + .11 * b
    return (b >= r + 4 and b > 70) or (lum > 170 and b >= r - 6)
man = {}
for k, (n, bb) in CUTS.items():
    src = 'reference/art_bank/settlement/pack_5_windows_and_broken_glass_%s.png' % n
    c = Image.open(src).convert('RGBA').crop(bb); px = c.load(); keep = 0
    for y in range(c.height):
        for x in range(c.width):
            if glass(px[x, y]): keep += 1
            else: px[x, y] = (0, 0, 0, 0)
    out = 'records/target/ui_the_phones_crack/UI_CRACK_%s.png' % k; c.save(out)
    man[k] = {'src': src, 'box': list(bb), 'out': out, 'w': c.width, 'h': c.height, 'glass_px': keep}
    print(k, n, c.size, keep)
# E TO G (round two of the same round): his pack 15 'Cracked floor details' (lava cracks, never judged, read lossless out of
# banks/BOHEMIA_HD_TILE_REPO_part*.txt). RECOLOURED, NOT DRAWN: every pixel keeps its place and its alpha; its colour becomes the
# glass ramp at its own brightness (lava's white-hot core -> the crack's light edge, its dark rim -> the crack's shadow). A whole
# turn of 90 degrees is the only other move (lossless).
import glob, io, base64
def bank_tile(pack, i):
    for f in sorted(glob.glob('banks/BOHEMIA_HD_TILE_REPO_part*.txt')):
        P = json.load(open(f))['packs']
        if pack in P: return Image.open(io.BytesIO(base64.b64decode(P[pack][i]['b64'].split(',', 1)[-1]))).convert('RGBA')
DARK, LIGHT = (12, 10, 8), (246, 240, 224)
def to_glass(im):
    im = im.copy(); px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if not a: continue
            t = min(1.0, (.3 * r + .59 * g + .11 * b) / 235.0)
            px[x, y] = tuple(int(DARK[j] + (LIGHT[j] - DARK[j]) * t) for j in range(3)) + (a,)
    return im
GLASS = {'E': (2, 0), 'F1': (3, 0), 'F2': (8, 90), 'G1': (4, 0), 'G2': (8, 90), 'G3': (9, 90)}
for k, (i, turn) in GLASS.items():
    t = bank_tile('15. Cracked floor details', i)
    if turn: t = t.transpose(Image.Transpose.ROTATE_90)
    g = to_glass(t); out = 'records/target/ui_the_phones_crack/UI_CRACK_%s.png' % k; g.save(out)
    man[k] = {'src': 'bank:15. Cracked floor details#%d' % i, 'turn': turn, 'recolour': 'glass ramp by brightness', 'out': out, 'w': g.width, 'h': g.height,
              'glass_px': sum(1 for p in g.getdata() if p[3])}
    print(k, i, g.size, man[k]['glass_px'])
json.dump(man, open('records/target/ui_the_phones_crack/cuts.json', 'w'), indent=1)
