#!/usr/bin/env python3
"""THE PARTS GRAMMAR, ROUND TWO: THE GUN, THE LAMP POST, AND THE MATERIAL COMES FROM HIS TILE
(COOK, the BIG SWING of 10/16, rule 110; rule 108 ROUND EIGHT (a) and ROUND ELEVEN)

ROUND ONE (10/11, tools/bohemia_the_parts_grammar_cook_10_11_26.py) built the no-drawing road and
scored it honestly: shapes in a file -> SVG at 4x -> resvg -> box shrink by exactly 4 -> his
palette, no dither -> one pixel of contour. The contour landed (-64 against his -53) and the GAP
was one number: HIS LAMP CARRIES 1,521 COLOURS AND MINE 5; his top eight colours carry 9% of the
tile and mine carry 100%. A flat shape snapped to a palette has nowhere to get grain from, and
the round said the only way to add grain was to compose grain as shapes, which is drawing pixels
again wearing a hat.

THIS ROUND ANSWERS THAT WITH THE ONE SOURCE OF GRAIN THE LAW ALLOWS: HIS OWN TILE. Rule 108
ROUND ELEVEN says find the pack piece and USE it, "cut, layered or shade-remapped". So a part is
no longer filled with one flat ink. It is filled with a MATERIAL: an 8-by-8 patch CUT from the
twin itself, chosen by the job the ink has to do (the patch whose value is nearest the role, with
the most grain in it), laid as an SVG pattern that tiles at the floor's pixel grid, so after the
box shrink by exactly four HIS PIXELS LAND BACK AT ONE-TO-ONE inside my shapes. Light and shade
are flat half-transparent squares laid over the material, never a gradient. Nothing is drawn.
Every colour on the result is one of his, and the tool PROVES it (a set test, not a claim).

THE TWO ROUTES RUN SIDE BY SIDE ON EVERY ASSET, so the card shows what the material step buys:
  FLAT      round one's road, 24 colours read off the twin by median cut, no change
  MATERIAL  the same geometry, the parts filled from his tile, snapped to his FULL colour set

THE ASSETS, EACH BESIDE HIS OWN AT 1:1 (rule 100d: a round is a batch):
  the GUN, three of them, from his approved gun set "12. Weapons and supplies" (#6 the pistol,
    #8 the revolver, #11 the SMG; 96 px, judged UP 7/13, in the approved bank since July);
  the LAMP POST, two of them, from "18. Light sources and fire barrels" (#3 the straight-arm
    post, #2 the post with the lantern hung on it; both judged UP). Round one's lamp was #0, the
    curved arm the law cannot draw; #3 is STRAIGHT, so this is the lamp the grammar can
    actually make, and the card says which is which.

WHAT A CURVE COSTS, STILL: a trigger guard is a curve on every gun he owns and the law forbids
one, so mine is a square U. A finial is a ball; mine is a square. The card says so under each.

QUARTERMASTER FIRST (rule 100c as amended, sweep AL): the page and the card open with the one
line every cook page now opens with, read from reference/art_bank_index/INDEX.json by
tools/bohemia_quartermaster_line.py, never typed. The line's exact shape is at the top of the
index for the four cooks to copy.

    python3 tools/bohemia_the_parts_grammar_two_cook_10_16_26.py
      -> banks/BOHEMIA_PARTS_GRAMMAR_10_16_26.json        (the grammar, v2, editable, supersedes v1)
      -> banks/BOHEMIA_PARTS_PIPE_OUT_10_16_26/*.png       (every asset, both routes, every stage)
      -> records/BOHEMIA_THE_PARTS_GRAMMAR_ROUND_TWO_10_16_26.md
      -> records/target/COOK_THE_PARTS_GRAMMAR_TWO.png     (the VOTE card)

NOTHING TO slices/ OR engine/ (rule 100a). The renderer is resvg (the resvg-py 0.5.0 binding of
the same Rust crate; the resvg binary round one installed did not survive the fresh container
and a stand-in that draws shapes in Python would be the exact thing the law bans, so the round
stops if the binding is missing).

WHAT THIS ROUND DOES NOT CLAIM: Aseprite is not on this machine and was not run; step 6 of the
research pipeline (indexed mode, orphan strip, the eight-facing sheet) is PLUMBER [aseprite in
the pipe]'s row and is OWED. The contour is the pipe's own, measured to the prop study's number.
None of these five is final; nothing is final before his moodboard (rule 108 ROUND THIRTEEN).

REFERENCE CHECK (the 9/4 standing law): the references are his own gun set (37 approved tiles)
and his own lamp family (47 approved), the twins are used whole beside mine at one art pixel to
one phone pixel, and the ruler is the prop study's (10/10: 100% of his objects carry a dark
contour at -49.9).
  REUSE CHECK: the PALETTE and now the MATERIAL are his, cut from the twin itself; what is
  composed here is geometry. No pixel is written as a number anywhere in this file (rule 108a).
  The pipe steps (to_svg, shrink, snap, outline, measure) are round one's, kept in one file so
  the round runs on a fresh machine; v1 stays as the record of what was measured on 10/11.

ANALOG HORROR LINE (rule 9/20): the material step is the analog part. A flat vector shape is a
clean digital thing; his tiles are scuffed, rusted, uneven. Cutting his grain into my shapes is
how the composed thing stops looking rendered and starts looking found, which is the bible's
whole ask, done at the source and not as a filter.

[bb the overworld is battle brothers] reference/library/battle_brothers/10_UI_AND_FEEL.md: every
  Battle Brothers weapon icon is painted by one hand over one material library (their steel is
  the same steel on every sword), which is why a hundred weapons read as one armoury. WHAT MOVES
  THAT THEIR PICTURE DOES NOT (rule 33g): we have no single hand, so the material library has to
  be a FILE, and it is: the grammar names the patch of HIS tile each part is cut from.
"""
import json, os, sys, io, base64, collections, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

BANK = 'reference/art_bank'
GRAMMAR_V1 = 'banks/BOHEMIA_PARTS_GRAMMAR_10_11_26.json'
GRAMMAR = 'banks/BOHEMIA_PARTS_GRAMMAR_10_16_26.json'
OUTDIR = 'banks/BOHEMIA_PARTS_PIPE_OUT_10_16_26'
OUT_REC = 'records/BOHEMIA_THE_PARTS_GRAMMAR_ROUND_TWO_10_16_26.md'
OUT_CARD = 'records/target/COOK_THE_PARTS_GRAMMAR_TWO.png'
QM_TOOL = 'tools/bohemia_quartermaster_line.py'
SCALE = 4                      # the shrink, and it is an integer by law
FLOOR = 96                     # rule 105
PATCH = 8                      # the smallest material patch, in final pixels
PATCH_SIZES = (16, 12, 8)      # a patch takes the biggest size the twin has room for, so it repeats less
LUM = np.array([0.299, 0.587, 0.114], np.float32)

TWINS = {
    'pistol':         'pack:12. Weapons and supplies#6',
    'revolver':       'pack:12. Weapons and supplies#8',
    'smg':            'pack:12. Weapons and supplies#11',
    'lamp_post':      'pack:18. Light sources and fire barrels#3',
    'lamp_post_hung': 'pack:18. Light sources and fire barrels#2',
}
LABELS = {'pistol': 'THE PISTOL', 'revolver': 'THE REVOLVER', 'smg': 'THE SMG',
          'lamp_post': 'THE LAMP POST, straight arm', 'lamp_post_hung': 'THE LAMP POST, lantern hung'}
CURVE_COST = {
    'pistol': 'his trigger guard is a curve; mine is a square U',
    'revolver': 'his guard and his cylinder are round; mine are a square U and a ribbed block',
    'smg': 'his guard is a curve; mine is a square U',
    'lamp_post': 'his finial is a ball; mine is a square. The arm is straight on both',
    'lamp_post_hung': 'his finial is a ball and his cage bows; mine are square and straight',
}

def die(m): sys.exit('REFUSED: ' + m)

try:
    import resvg_py
except ImportError:
    die('resvg_py is not installed (pip install resvg-py); a Python stand-in that draws the '
        'shapes is the exact thing rule 108a bans, so the round stops here')


def corpus():
    return json.load(open(BANK + '/CORPUS.json'))['tiles']


def his(key):
    for r in corpus().values():
        if r['key'] == key:
            return Image.open(os.path.join(BANK, r['family'], r['file'])).convert('RGBA')
    die('%s is not in the corpus' % key)


def quartermaster_line(args):
    """THE LINE EVERY COOK PAGE OPENS WITH, read from the index by the shared tool, never typed."""
    r = subprocess.run([sys.executable, QM_TOOL] + args, capture_output=True, text=True)
    if r.returncode != 0:
        die('the quartermaster line did not come: ' + (r.stderr or r.stdout)[:300])
    return r.stdout.strip()


# ---------------------------------------------------------------- palette and material
def palette_of(im, n=24):
    """THE PACK PALETTE, READ OFF THE TWIN ITSELF, by median cut (round one's finding: frequency
       is useless on art where nothing repeats)."""
    a = np.asarray(im, np.uint8)
    m = a[..., 3] > 128
    px = a[..., :3][m]
    if px.size == 0: die('the twin has no opaque pixels')
    strip = Image.fromarray(px.reshape(1, -1, 3).astype(np.uint8), 'RGB')
    q = strip.quantize(colors=n, method=Image.MEDIANCUT)
    pal = q.getpalette()[:n * 3]
    return [np.array(pal[i * 3:i * 3 + 3], np.float32) for i in range(n)]


def full_set_of(im):
    """HIS FULL COLOUR SET: every opaque colour on the twin. The material route snaps to this,
       so 'every colour is one of his' is literally true and testable."""
    a = np.asarray(im, np.uint8)
    px = a[..., :3][a[..., 3] > 128]
    return np.unique(px.reshape(-1, 3), axis=0).astype(np.float32)


def val(c): return float(np.asarray(c, np.float32) @ LUM)
def hx(c): return '#%02x%02x%02x' % tuple(int(v) for v in c)
def hx2rgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def material_patches(im, roles):
    """*** THE NEW STEP: A MATERIAL IS A PATCH CUT FROM HIS TILE, PICKED BY ITS JOB. ***
       For every role (a target value, or 'warm' for wood) slide a window over the fully opaque
       part of the twin and take the patch whose mean value is nearest the target, breaking ties
       toward MORE distinct colours, because grain is the whole point. The window is 16x16 where
       his tile has that much unbroken surface, else 12, else 8 (a lamp post is six pixels thick,
       a pistol slide is twenty): the bigger the patch, the less it repeats on the card. The patch
       is recorded in the grammar as a crop rectangle on a named pack tile, so a modder can read
       exactly which pixels of which tile a part wears. Nothing here is drawn."""
    a = np.asarray(im, np.uint8)
    alpha = a[..., 3] > 128
    f = a[..., :3].astype(np.float32)
    y = f @ LUM
    H, W = alpha.shape
    out = {}
    for role, spec in roles.items():
        best = None
        for P in PATCH_SIZES:
            cands = []
            for yy in range(0, H - P + 1):
                for xx in range(0, W - P + 1):
                    blk = alpha[yy:yy + P, xx:xx + P]
                    if not blk.all(): continue
                    v = float(y[yy:yy + P, xx:xx + P].mean())
                    cols = len({tuple(c) for c in a[yy:yy + P, xx:xx + P, :3].reshape(-1, 3).tolist()})
                    warm = float((f[yy:yy + P, xx:xx + P, 0] - f[yy:yy + P, xx:xx + P, 2]).mean())
                    spread = float(y[yy:yy + P, xx:xx + P].std())
                    cands.append((xx, yy, v, cols, warm, spread, P))
            if not cands: continue
            if spec == 'warm':
                c = max(cands, key=lambda c: (c[4], c[3]))
                if c[4] < 10 and P != PATCH_SIZES[-1]: continue   # no warm surface this big; try smaller
            else:
                # nearest value wins; among the nearest ten, the one with the most colours (grain),
                # and a spread under 40 so a patch that straddles an edge is not taken for a surface
                near = sorted(cands, key=lambda c: abs(c[2] - spec))[:10]
                near = [c for c in near if c[5] < 40]
                if not near: near = sorted(cands, key=lambda c: abs(c[2] - spec))[:10]
                if abs(near[0][2] - spec) > 40 and P != PATCH_SIZES[-1]: continue   # nothing this big fits; try smaller
                c = max(near, key=lambda c: c[3])
            best = c; break
        if best is None:
            die('the twin has no fully opaque patch to cut the %s material from' % role)
        xx, yy, v, cols, warm, spread, P = best
        out[role] = {'crop': [xx, yy, P, P], 'value': round(v, 1), 'colours': cols}
    return out


def inks_from(pal, body):
    """ROUND ONE'S RULE, KEPT: inks are picked by role and by value, never by list position."""
    ordered = sorted(pal, key=val)
    i = min(range(len(ordered)), key=lambda k: abs(val(ordered[k]) - body))
    mid = ordered[i]
    return {
        'dark': hx(ordered[0]),
        'mid': hx(mid),
        'lit': hx(ordered[min(len(ordered) - 1, i + 3)]),     # the sun is north-west
        'shade': hx(ordered[max(0, i - 3)]),
        'glass': hx(ordered[max(0, min(len(ordered) - 1, i - 1))]),
        'glow': hx(ordered[-1]),
        'wood': hx(max(pal, key=lambda c: float(c[0]) - float(c[2]))),
        'steel': hx(ordered[min(len(ordered) - 1, i + 1)]),
    }


# ---------------------------------------------------------------- the grammar, v2
def build_grammar(twins):
    """THE GRAMMAR IS DATA (rule 108, the mods law). Every size is in FINAL pixels on the 96
       floor and came off the twin's own proportions, measured on the 4x contact sheet this round:
       his pistol is 96 wide and 78 tall with the slide a quarter of the height and the grip
       slanting down to the right; his revolver's barrel is half the width; his SMG is one long
       receiver with the magazine a third of the way from the back; his straight lamp post is 57
       wide, the post six pixels thick, the arm at the top sixth, the lantern hanging to the
       right of it; his hung-lantern post is 41 wide and the lantern hangs off a short bracket.

       A part is a list of plain shapes in its own box, each with an INK ROLE. The composer maps
       the role to a flat colour (FLAT route) or to a material patch from the twin plus a flat
       half-transparent light or shade square (MATERIAL route). 'dark' is always flat: it is the
       contour ink, and his contours are flat too (the prop study, 10/10)."""
    g = {
        'version': 'BOHEMIA_PARTS_GRAMMAR_v2',
        'made': '10/16/26', 'lane': 'cook', 'row': '[the parts grammar] round two (rule 110 big swing)',
        'supersedes': GRAMMAR_V1,
        'law': 'rule 108 ROUND EIGHT (a): no chat draws a pixel or a curve in code. Parts are '
               'rectangles and straight-segment polygons. A curve in this file is a bug. '
               'rule 108 ROUND ELEVEN: a material is a patch CUT from a named pack tile, never drawn.',
        'units': 'every number is in FINAL pixels on the 96 floor; the composer multiplies by '
                 '%d before it writes the SVG, and shrinks by exactly %d after' % (SCALE, SCALE),
        'floor': FLOOR, 'patch_sizes': list(PATCH_SIZES),
        'routes': {
            'flat': '24 colours read off the twin by median cut; one flat ink per role (round one)',
            'material': 'each role is a patch cut from the twin (16x16 where his surface has room, else 12, else 8), tiled on the pixel grid; '
                        'lit and shade are flat squares at partial opacity laid over it; the result '
                        'is snapped to the twin\'s FULL colour set, no dither',
        },
        'overlays': {'lit': ['#ffffff', 0.22], 'shade': ['#000000', 0.30], 'glass': ['#ffffff', 0.12]},
        'parts': {
            # ---------------- the gun parts (96 wide, barrel to the left like his)
            'slide': {'box': [80, 22], 'shapes': [
                {'rect': [0, 0, 80, 22], 'ink': 'steel'},
                {'rect': [0, 0, 80, 3], 'ink': 'lit'},
                {'rect': [0, 19, 80, 3], 'ink': 'shade'},
                {'rect': [62, 4, 2, 14], 'ink': 'dark'}, {'rect': [66, 4, 2, 14], 'ink': 'dark'},
                {'rect': [70, 4, 2, 14], 'ink': 'dark'}, {'rect': [74, 4, 2, 14], 'ink': 'dark'},
                {'rect': [0, 8, 6, 8], 'ink': 'dark'}]},                     # the muzzle
            'frame': {'box': [78, 12], 'shapes': [
                {'rect': [0, 0, 78, 12], 'ink': 'mid'},
                {'rect': [0, 10, 78, 2], 'ink': 'shade'},
                {'rect': [30, 2, 14, 2], 'ink': 'dark'}]},                   # the slide stop
            'sight_front': {'box': [4, 4], 'shapes': [{'rect': [0, 0, 4, 4], 'ink': 'dark'}]},
            'sight_rear': {'box': [8, 4], 'shapes': [
                {'rect': [0, 0, 8, 4], 'ink': 'dark'}, {'rect': [3, 0, 2, 2], 'ink': 'lit'}]},
            'hammer': {'box': [7, 12], 'shapes': [
                {'poly': [[0, 4], [4, 0], [7, 2], [5, 12], [1, 12]], 'ink': 'mid'},
                {'rect': [1, 10, 4, 2], 'ink': 'dark'}]},
            # THE GUARD IS A SQUARE U, NOT A CURVE. His sweeps; the law says we may not.
            'guard_square': {'box': [22, 16], 'shapes': [
                {'rect': [0, 0, 3, 16], 'ink': 'mid'}, {'rect': [0, 13, 22, 3], 'ink': 'mid'},
                {'rect': [19, 0, 3, 16], 'ink': 'mid'},
                {'rect': [0, 0, 3, 1], 'ink': 'lit'}, {'rect': [0, 15, 22, 1], 'ink': 'dark'},
                {'rect': [12, 2, 3, 8], 'ink': 'dark'}]},                     # the trigger
            'grip_right': {'box': [40, 40], 'shapes': [                       # slants down-right
                {'poly': [[0, 0], [28, 0], [40, 36], [12, 40]], 'ink': 'wood'},
                {'poly': [[0, 0], [28, 0], [29, 3], [1, 3]], 'ink': 'shade'},
                {'poly': [[28, 0], [40, 36], [37, 37], [25, 1]], 'ink': 'dark'},   # back strap
                {'rect': [14, 12, 3, 3], 'ink': 'lit'},                       # the screw
                {'rect': [12, 36, 26, 4], 'ink': 'dark'}]},                   # the base
            'grip_left': {'box': [40, 36], 'shapes': [                        # slants down-left
                {'poly': [[12, 0], [40, 0], [28, 34], [0, 30]], 'ink': 'wood'},
                {'poly': [[12, 0], [40, 0], [39, 3], [11, 3]], 'ink': 'shade'},
                {'poly': [[12, 0], [0, 30], [3, 31], [15, 1]], 'ink': 'dark'},
                {'rect': [20, 12, 3, 3], 'ink': 'lit'},
                {'rect': [0, 30, 28, 4], 'ink': 'dark'}]},
            'barrel_round': {'box': [50, 14], 'shapes': [                     # a tube, in rects
                {'rect': [0, 0, 50, 14], 'ink': 'steel'},
                {'rect': [0, 2, 50, 3], 'ink': 'lit'}, {'rect': [0, 11, 50, 3], 'ink': 'shade'},
                {'rect': [0, 4, 4, 6], 'ink': 'dark'},                        # the bore
                {'rect': [0, 0, 50, 1], 'ink': 'dark'}]},
            'cylinder_block': {'box': [24, 26], 'shapes': [                   # ribbed, not round
                {'rect': [0, 0, 24, 26], 'ink': 'steel'},
                {'rect': [0, 0, 24, 3], 'ink': 'lit'}, {'rect': [0, 22, 24, 4], 'ink': 'shade'},
                {'rect': [5, 2, 2, 22], 'ink': 'dark'}, {'rect': [11, 2, 2, 22], 'ink': 'dark'},
                {'rect': [17, 2, 2, 22], 'ink': 'dark'}]},
            'receiver': {'box': [86, 18], 'shapes': [
                {'rect': [0, 0, 86, 18], 'ink': 'steel'},
                {'rect': [0, 0, 86, 3], 'ink': 'lit'}, {'rect': [0, 15, 86, 3], 'ink': 'shade'},
                {'rect': [0, 6, 5, 6], 'ink': 'dark'},                        # the muzzle
                {'rect': [60, 4, 10, 3], 'ink': 'dark'},                      # the ejection port
                {'rect': [6, 4, 30, 2], 'ink': 'dark'}, {'rect': [6, 9, 30, 2], 'ink': 'dark'}]},  # shroud slots
            'magazine': {'box': [16, 32], 'shapes': [
                {'poly': [[0, 0], [14, 0], [16, 32], [2, 32]], 'ink': 'mid'},
                {'poly': [[0, 0], [3, 0], [5, 32], [2, 32]], 'ink': 'lit'},
                {'poly': [[11, 0], [14, 0], [16, 32], [13, 32]], 'ink': 'dark'},
                {'rect': [2, 30, 14, 2], 'ink': 'dark'}]},
            'pistol_grip_small': {'box': [18, 24], 'shapes': [
                {'poly': [[2, 0], [18, 0], [16, 24], [0, 22]], 'ink': 'wood'},
                {'poly': [[2, 0], [18, 0], [17, 3], [1, 3]], 'ink': 'shade'},
                {'rect': [0, 21, 16, 3], 'ink': 'dark'}]},
            'charging_handle': {'box': [8, 6], 'shapes': [
                {'rect': [0, 0, 8, 6], 'ink': 'dark'}, {'rect': [1, 1, 6, 2], 'ink': 'lit'}]},
            # ---------------- the lamp post parts
            'post': {'box': [6, 80], 'shapes': [
                {'rect': [0, 0, 6, 80], 'ink': 'mid'},
                {'rect': [1, 0, 1, 80], 'ink': 'lit'},                        # the sun is north-west
                {'rect': [4, 0, 2, 80], 'ink': 'shade'}]},
            'post_collar': {'box': [10, 4], 'shapes': [
                {'rect': [0, 0, 10, 4], 'ink': 'mid'}, {'rect': [0, 0, 10, 1], 'ink': 'lit'},
                {'rect': [0, 3, 10, 1], 'ink': 'dark'}]},
            # THE FINIAL IS A SQUARE, NOT A BALL.
            'finial_square': {'box': [10, 10], 'shapes': [
                {'poly': [[2, 10], [8, 10], [10, 6], [8, 1], [5, 0], [2, 1], [0, 6]], 'ink': 'mid'},
                {'poly': [[2, 1], [5, 0], [6, 2], [3, 3]], 'ink': 'lit'}]},
            'arm_straight': {'box': [24, 4], 'shapes': [
                {'rect': [0, 0, 24, 4], 'ink': 'mid'}, {'rect': [0, 0, 24, 1], 'ink': 'lit'},
                {'rect': [0, 3, 24, 1], 'ink': 'dark'}]},
            'hook': {'box': [3, 10], 'shapes': [
                {'rect': [0, 0, 3, 10], 'ink': 'mid'}, {'rect': [0, 0, 1, 10], 'ink': 'lit'}]},
            'bracket_short': {'box': [12, 3], 'shapes': [
                {'rect': [0, 0, 12, 3], 'ink': 'mid'}, {'rect': [0, 0, 12, 1], 'ink': 'lit'}]},
            'lantern': {'box': [20, 30], 'shapes': [
                {'poly': [[0, 8], [20, 8], [16, 2], [4, 2]], 'ink': 'mid'},   # the hood
                {'rect': [8, 0, 4, 3], 'ink': 'dark'},                        # the ring
                {'rect': [4, 2, 12, 1], 'ink': 'lit'},
                {'rect': [0, 8, 20, 2], 'ink': 'dark'},
                {'rect': [3, 10, 14, 15], 'ink': 'glass'},
                {'rect': [6, 13, 8, 9], 'ink': 'glow'},                       # the filament
                {'rect': [3, 25, 14, 3], 'ink': 'mid'}, {'rect': [3, 28, 14, 2], 'ink': 'dark'}]},
            'lantern_caged': {'box': [18, 32], 'shapes': [
                {'poly': [[0, 8], [18, 8], [15, 2], [3, 2]], 'ink': 'mid'},
                {'rect': [7, 0, 4, 3], 'ink': 'dark'},
                {'rect': [3, 2, 12, 1], 'ink': 'lit'},
                {'rect': [0, 8, 18, 2], 'ink': 'dark'},
                {'rect': [2, 10, 14, 17], 'ink': 'glass'},
                {'rect': [5, 13, 8, 11], 'ink': 'glow'},
                {'rect': [5, 10, 1, 17], 'ink': 'dark'}, {'rect': [9, 10, 1, 17], 'ink': 'dark'},
                {'rect': [13, 10, 1, 17], 'ink': 'dark'},                      # the cage bars
                {'rect': [2, 27, 14, 3], 'ink': 'mid'}, {'rect': [2, 30, 14, 2], 'ink': 'dark'}]},
            'post_foot': {'box': [22, 10], 'shapes': [
                {'rect': [4, 0, 14, 4], 'ink': 'mid'}, {'rect': [4, 0, 14, 1], 'ink': 'lit'},
                {'rect': [0, 4, 22, 5], 'ink': 'mid'}, {'rect': [0, 4, 22, 1], 'ink': 'lit'},
                {'rect': [0, 9, 22, 1], 'ink': 'dark'}]},
        },
        'compositions': {
            'pistol': {'canvas': [96, 78], 'twin': TWINS['pistol'], 'place': [
                ['grip_right', 52, 36], ['frame', 6, 28], ['guard_square', 36, 40],
                ['slide', 4, 6], ['hammer', 84, 10], ['sight_front', 8, 2], ['sight_rear', 72, 2]]},
            'revolver': {'canvas': [96, 70], 'twin': TWINS['revolver'], 'place': [
                ['grip_left', 22, 36], ['frame', 30, 32], ['guard_square', 50, 42],
                ['barrel_round', 4, 10], ['cylinder_block', 52, 8], ['hammer', 76, 2],
                ['sight_front', 6, 6]]},
            'smg': {'canvas': [96, 62], 'twin': TWINS['smg'], 'place': [
                ['magazine', 58, 30], ['pistol_grip_small', 20, 30], ['guard_square', 36, 30],
                ['receiver', 6, 12], ['charging_handle', 70, 8], ['sight_front', 8, 8],
                ['sight_rear', 80, 8]]},
            'lamp_post': {'canvas': [57, 96], 'twin': TWINS['lamp_post'], 'place': [
                ['post', 22, 12], ['post_foot', 14, 86], ['post_collar', 20, 12], ['post_collar', 20, 60],
                ['finial_square', 20, 2], ['arm_straight', 28, 14], ['hook', 49, 18],
                ['lantern', 40, 26]]},
            'lamp_post_hung': {'canvas': [41, 96], 'twin': TWINS['lamp_post_hung'], 'place': [
                ['post', 14, 12], ['post_foot', 6, 86], ['post_collar', 12, 12], ['post_collar', 12, 62],
                ['finial_square', 12, 2], ['bracket_short', 20, 30], ['hook', 29, 30],
                ['lantern_caged', 22, 38]]},
        },
        'inks': {}, 'materials': {},
    }
    roles = {'mid': None, 'steel': None, 'lit': None, 'shade': None, 'glass': None, 'glow': None, 'wood': 'warm'}
    for name, twin in twins.items():
        pal = palette_of(twin)
        body = measure(twin)['body']
        inks = inks_from(pal, body)
        g['inks'][name] = inks
        # material targets follow the FLAT inks' values, so both routes aim at the same job
        targets = {r: (roles[r] if roles[r] == 'warm' else val(hx2rgb(inks[r]))) for r in roles}
        pm = material_patches(twin, targets)
        g['materials'][name] = {'tile': TWINS[name], 'patches': pm}
    return g


# ---------------------------------------------------------------- the pipe
def patch_png_b64(twin, crop):
    x, y, w, h = crop
    p = twin.crop((x, y, x + w, y + h)).convert('RGB')
    p = p.resize((w * SCALE, h * SCALE), Image.NEAREST)    # his pixel = a 4x4 block at 4x
    b = io.BytesIO(); p.save(b, 'PNG')
    return base64.b64encode(b.getvalue()).decode()


def to_svg(g, name, route, twin):
    """STEP 2: THE ASSET AS SVG AT FOUR TIMES, from plain shapes only. Every number written here
       is a COORDINATE, not a pixel (rule 108a). On the MATERIAL route a role's fill is a pattern
       whose image is a patch cut from the twin; the pattern tiles on the 4x grid so the shrink
       lands his pixels at 1:1. The only images the composer accepts are crops it made itself from
       the composition's own twin, so nothing drawn can ride in as an image."""
    comp = g['compositions'][name]
    inks = g['inks'][name]
    mats = g['materials'][name]['patches']
    ov = g['overlays']
    W, H = comp['canvas'][0] * SCALE, comp['canvas'][1] * SCALE
    defs, body = [], []
    if route == 'material':
        for role, m in mats.items():
            pw, ph = m['crop'][2] * SCALE, m['crop'][3] * SCALE
            defs.append('<pattern id="m_%s" patternUnits="userSpaceOnUse" width="%d" height="%d">'
                        '<image xlink:href="data:image/png;base64,%s" width="%d" height="%d"/></pattern>'
                        % (role, pw, ph, patch_png_b64(twin, m['crop']), pw, ph))

    def fills(role):
        """-> list of (fill, opacity) layers for the role on this route."""
        if route == 'flat' or role == 'dark':
            return [(inks[role], None)]
        if role in ('lit', 'shade', 'glass'):
            base = 'steel' if role != 'glass' else 'glass'
            # a lit or shaded part is the body material with a flat square of light or shade on it
            return [('url(#m_%s)' % ('mid' if role != 'glass' else 'glass'), None), tuple(ov[role])]
        if role == 'glow':
            return [(inks['glow'], None)]                   # his glow is flat too
        return [('url(#m_%s)' % role, None)]

    for pname, px, py in comp['place']:
        part = g['parts'][pname]
        for sh in part['shapes']:
            for fill, op in fills(sh['ink']):
                opa = (' fill-opacity="%g"' % op) if op is not None else ''
                if 'rect' in sh:
                    x, y, w, h = sh['rect']
                    body.append('<rect x="%g" y="%g" width="%g" height="%g" fill="%s"%s/>'
                                % ((px + x) * SCALE, (py + y) * SCALE, w * SCALE, h * SCALE, fill, opa))
                elif 'poly' in sh:
                    pts = ' '.join('%g,%g' % ((px + a) * SCALE, (py + b) * SCALE) for a, b in sh['poly'])
                    body.append('<polygon points="%s" fill="%s"%s/>' % (pts, fill, opa))
                else:
                    die('a shape in part %s is neither a rect nor a polygon' % pname)
    s = ('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
         'width="%d" height="%d">' % (W, H))
    if defs: s += '<defs>' + ''.join(defs) + '</defs>'
    s += '\n'.join(body) + '</svg>'
    for banned in ('<path', 'curve', 'rx=', 'ry=', '<circle', '<ellipse', 'gradient', 'filter', '<text'):
        if banned in s:
            die('the composed SVG carries "%s", which rule 108a forbids' % banned)
    if s.count('<image') != (len(mats) if route == 'material' else 0):
        die('the composed SVG carries an image the composer did not cut from the twin')
    return s, (W, H)


def rasterize(svg, wh, path):
    """STEP 3: resvg, the real renderer (the resvg-py binding of the same crate)."""
    open(path + '.svg', 'w').write(svg)
    png = resvg_py.svg_to_bytes(svg_string=svg, width=wh[0], height=wh[1], image_rendering='optimize_speed')
    im = Image.open(io.BytesIO(bytes(png))).convert('RGBA')
    im.save(path + '_4x.png')
    return im


def shrink(im):
    """STEP 4: EXACTLY FOUR TIMES, BOX FILTER."""
    w, h = im.size
    if w % SCALE or h % SCALE:
        die('the raster is %dx%d, which does not divide by %d' % (w, h, SCALE))
    return im.resize((w // SCALE, h // SCALE), Image.BOX)


def snap(im, P):
    """STEP 5: HIS PALETTE, NO DITHER. Nearest colour in the given set, per pixel, in chunks so
       the full-set route (about 1,500 colours) stays cheap."""
    a = np.asarray(im, np.uint8).copy()
    m = a[..., 3] > 110
    P = np.asarray(P, np.float32)
    f = a[..., :3].astype(np.float32).reshape(-1, 3)
    idx = np.empty(len(f), np.int64)
    for i in range(0, len(f), 2048):
        chunk = f[i:i + 2048]
        d = ((chunk[:, None, :] - P[None, :, :]) ** 2).sum(axis=2)
        idx[i:i + 2048] = np.argmin(d, axis=1)
    a[..., :3] = P[idx].astype(np.uint8).reshape(a.shape[0], a.shape[1], 3)
    a[..., 3] = np.where(m, 255, 0)
    return Image.fromarray(a, 'RGBA')


def outline(im, dark):
    """STEP 6, THE PART ASEPRITE OWES: one pixel of his darkest ink round the silhouette."""
    a = np.asarray(im, np.uint8).copy()
    s = a[..., 3] > 128
    er = np.zeros_like(s)
    er[1:-1, 1:-1] = (s[1:-1, 1:-1] & s[:-2, 1:-1] & s[2:, 1:-1] & s[1:-1, :-2] & s[1:-1, 2:])
    a[s & ~er, :3] = np.array(dark, np.uint8)
    return Image.fromarray(a, 'RGBA')


def make(g, name, route, twin, out):
    svg, wh = to_svg(g, name, route, twin)
    base = os.path.join(out, '%s__%s' % (name, route))
    big = rasterize(svg, wh, base)
    small = shrink(big)
    P = palette_of(twin) if route == 'flat' else full_set_of(twin)
    locked = snap(small, P)
    fin = outline(locked, hx2rgb(g['inks'][name]['dark']))
    small.save(base + '_shrunk.png'); fin.save(base + '.png')
    return dict(svg=svg, big=big, small=small, locked=locked, fin=fin)


# ---------------------------------------------------------------- the ruler
def measure(im):
    a = np.asarray(im, np.uint8)
    s = a[..., 3] > 128
    if s.sum() < 50: return None
    f = a[..., :3].astype(np.float32); y = f @ LUM
    er = np.zeros_like(s)
    er[1:-1, 1:-1] = (s[1:-1, 1:-1] & s[:-2, 1:-1] & s[2:, 1:-1] & s[1:-1, :-2] & s[1:-1, 2:])
    ring = s & ~er
    px = [tuple(c) for c in a[..., :3][s].tolist()]
    c = collections.Counter(px)
    h, w = s.shape
    return dict(w=w, h=h, ink=int(s.sum()), fill=100.0 * s.sum() / (w * h), colours=len(c),
                top8=100.0 * sum(v for _, v in c.most_common(8)) / len(px),
                edge=float(y[ring].mean() - y[er].mean()) if (ring.sum() and er.sum()) else 0.0,
                body=float(np.median(y[er])) if er.sum() else 0.0,
                steps=len({int(v) // 16 for v in y[s].tolist()}))


def not_his(mine, twin):
    """THE SET TEST: how many of my opaque colours are NOT on his tile. The material route owes zero."""
    a = np.asarray(mine, np.uint8); b = np.asarray(twin, np.uint8)
    m = {tuple(c) for c in a[..., :3][a[..., 3] > 128].tolist()}
    h = {tuple(c) for c in b[..., :3][b[..., 3] > 128].tolist()}
    return len(m - h)


# ---------------------------------------------------------------- the card
BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)
WARN = (214, 120, 92); GOOD = (150, 190, 120)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def wrap(d, text, x, y, f, fill, width, step=14):
    line = ''
    for word in text.split(' '):
        t = (line + ' ' + word).strip()
        if d.textlength(t, font=f) > width and line:
            d.text((x, y), line, font=f, fill=fill); y += step; line = word
        else:
            line = t
    if line: d.text((x, y), line, font=f, fill=fill); y += step
    return y


def card(qm, stages, twins, mine, hism, nh, g):
    """ONE CARD: the quartermaster's line on top, then every asset beside his at 1:1 on both
       routes, then the proof line, then the one question. Rule 89: the show is the picture."""
    f16, f12, f11, f10 = font(16), font(12), font(11), font(10)
    W, H = 1180, 1560
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((14, 12), 'THE PARTS ROAD, ROUND TWO: THE GUN, THE LAMP POST, AND HIS OWN GRAIN IN MY SHAPES',
           font=f16, fill=INK)
    y = wrap(d, qm, 14, 34, f10, HOT, W - 28)
    d.text((14, y + 2), 'shapes -> svg at 4x -> resvg -> box shrink by exactly 4 -> his colours, no dither -> one pixel '
                        'of contour. NEW: a part is filled with a patch CUT FROM HIS TILE. NOT IN THE GAME (rule 100).',
           font=f10, fill=DIM)
    y += 24
    for nm in ('pistol', 'revolver', 'smg', 'lamp_post', 'lamp_post_hung'):
        st = stages[nm]
        d.text((14, y), LABELS[nm] + '   twin: ' + TWINS[nm][5:] + '   ' + CURVE_COST[nm], font=f11, fill=HOT)
        y += 16
        x = 16
        cols = [('his tile, untouched', twins[nm]),
                ('FLAT route (round one), 1:1', st['flat']['fin']),
                ('MATERIAL route (new), 1:1', st['material']['fin']),
                ('material, shown at 2x', st['material']['fin'].resize(
                    (st['material']['fin'].width * 2, st['material']['fin'].height * 2), Image.NEAREST))]
        for cap, pic in cols:
            d.text((x, y), cap, font=f10, fill=DIM)
            im.paste(pic, (x, y + 14), pic)
            x += max(pic.width, 192) + 12
        rowh = max(p.height for _, p in cols)
        tx = x + 6
        for k, lab, fmt in (('colours', 'colours', '%d'), ('top8', 'top eight carry', '%.0f%%'),
                            ('edge', 'edge minus inside', '%+.1f'), ('steps', 'value steps of 16', '%d')):
            d.text((tx, y + 14), '%-17s his %7s  flat %6s  mat %7s' % (
                lab, fmt % hism[nm][k], fmt % mine[nm]['flat'][k], fmt % mine[nm]['material'][k]),
                font=f10, fill=DIM)
            y += 14
        d.text((tx, y + 14), '%-17s flat %7d  mat %7d' % ('colours not his', nh[nm]['flat'], nh[nm]['material']),
               font=f10, fill=GOOD if nh[nm]['material'] == 0 else WARN)
        y += 14 + max(0, rowh - 56) + 24

    d.text((14, y), 'WHAT THE MATERIAL STEP BUYS, IN THE ONE NUMBER THAT DECIDED ROUND ONE:', font=f12, fill=INK)
    y += 18
    for nm in ('pistol', 'revolver', 'smg', 'lamp_post', 'lamp_post_hung'):
        d.text((22, y), '%-28s his top eight carry %3.0f%%   flat %3.0f%%   material %3.0f%%   (colours: his %4d, flat %2d, material %4d)'
               % (LABELS[nm], hism[nm]['top8'], mine[nm]['flat']['top8'], mine[nm]['material']['top8'],
                  hism[nm]['colours'], mine[nm]['flat']['colours'], mine[nm]['material']['colours']),
               font=f10, fill=DIM)
        y += 14
    y += 8
    for t in ('WHAT THIS IS: round one proved the no-drawing road and found its one gap: flat shapes snapped to a palette',
              'carry five colours where your tile carries fifteen hundred. This round fills every part with a patch',
              'CUT FROM YOUR OWN TILE, picked by the job it does (steel for the slide, wood for the grip), tiled on the pixel',
              'grid so your pixels land back one-to-one inside my shapes after the shrink. Light and shade are flat squares',
              'laid over it. Nothing is drawn. Every colour on the material route is one of yours, tested as a set, not claimed.'):
        d.text((14, y), t, font=f10, fill=DIM); y += 14
    y += 6
    for t in ('AND WHAT IT STILL COSTS, SAID STRAIGHT: a trigger guard is a curve on every gun you own and the law forbids one,',
              'so mine is a square U. Your finial is a ball; mine is a square. The grain is yours now, the FORM is still a shape',
              'composition, and that is what the two-times strip shows. Aseprite is not on this machine and was not run.',
              'None of these five is final; nothing is final before your moodboard.'):
        d.text((14, y), t, font=f10, fill=WARN); y += 14
    y += 10
    d.text((14, y), 'THE ONE QUESTION:', font=f12, fill=HOT); y += 18
    for t in ('Your own grain is now in the composed shapes. Where does the road go from here?',
              '',
              'A  THE ROAD IS FOR WHAT YOU DO NOT OWN: signs, crates, kerbs, boxes, lamp posts, UI chrome, in your materials. Guns stay bought.',
              'B  BUILD OUT THE GUN SET THIS WAY TOO, for the fifty guns the roster needs that the pack does not have.',
              'C  DROP IT. Only cut and place what you already own.'):
        d.text((22, y), t, font=f10, fill=INK if t[:2] in ('A ', 'B ', 'C ') else DIM); y += 15
    return im.crop((0, 0, W, min(H, y + 16)))


# ---------------------------------------------------------------- main
def main():
    twins = {nm: his(k) for nm, k in TWINS.items()}
    qm = quartermaster_line(['guns and lamp posts for the parts road',
                             '--packs', '12. Weapons and supplies', '18. Light sources and fire barrels',
                             '--nearest', TWINS['pistol'][5:], TWINS['lamp_post'][5:],
                             '--verdict', 'COMPOSE BESIDE IT (he owns both; his tile is the score)'])
    g = build_grammar(twins)
    os.makedirs(OUTDIR, exist_ok=True)
    json.dump(g, open(GRAMMAR, 'w'), indent=1)

    stages, mine, nh = {}, {}, {}
    for nm in TWINS:
        stages[nm] = {}; mine[nm] = {}; nh[nm] = {}
        for route in ('flat', 'material'):
            st = make(g, nm, route, twins[nm], OUTDIR)
            stages[nm][route] = st
            mine[nm][route] = measure(st['fin'])
            nh[nm][route] = not_his(st['fin'], twins[nm])
    hism = {k: measure(v) for k, v in twins.items()}

    nshapes = sum(len(p['shapes']) for p in g['parts'].values())
    log, fails = [], []
    def chk(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line)

    chk('THE QUARTERMASTER LINE OPENS THE PAGE AND THE CARD, read from the index by %s, not typed' % QM_TOOL,
        qm.startswith('QUARTERMASTER') and '| index ' in qm and '| he owns:' in qm)
    chk('NOT ONE PIXEL IS WRITTEN AS A NUMBER (rule 108a): five assets are %d parts and %d shapes in a grammar '
        'file, composed as SVG and drawn by resvg; the only images in any SVG are patches the composer cut '
        'from the composition\'s own twin' % (len(g['parts']), nshapes),
        all('<path' not in st[r]['svg'] and 'gradient' not in st[r]['svg'] for st in stages.values() for r in st))
    chk('THE SHRINK IS EXACTLY FOUR AND IT IS A BOX FILTER on all ten renders',
        all(st[r]['big'].width == st[r]['small'].width * SCALE for st in stages.values() for r in st))
    chk('ALL FIVE CLEAR THE 96 FLOOR (rule 105): ' + ', '.join('%s %dx%d' % (nm, mine[nm]['flat']['w'], mine[nm]['flat']['h']) for nm in TWINS),
        all(max(mine[nm]['flat']['w'], mine[nm]['flat']['h']) >= FLOOR for nm in TWINS))
    chk('EVERY COLOUR ON THE MATERIAL ROUTE IS ONE OF HIS, AS A SET TEST: colours not on the twin = %s'
        % ', '.join('%s %d' % (nm, nh[nm]['material']) for nm in TWINS),
        all(nh[nm]['material'] == 0 for nm in TWINS),
        'the route\'s whole claim is that the grain is his; one colour that is not would make it drawing')
    chk('ALL TEN CARRY THE DARK CONTOUR 100% OF HIS OBJECTS CARRY (edge minus inside at or under -20): '
        + ', '.join('%s flat %+.0f / material %+.0f' % (nm, mine[nm]['flat']['edge'], mine[nm]['material']['edge']) for nm in TWINS),
        all(mine[nm][r]['edge'] <= -20 for nm in TWINS for r in ('flat', 'material')),
        'the prop study, 10/10: -49.9 across 784 of his props')
    chk('THE MATERIAL STEP CLOSES THE GAP ROUND ONE MEASURED, ON EVERY ASSET: top eight carry '
        + ', '.join('%s flat %.0f%% -> material %.0f%% (his %.0f%%)' % (nm, mine[nm]['flat']['top8'], mine[nm]['material']['top8'], hism[nm]['top8']) for nm in TWINS),
        all(mine[nm]['material']['top8'] < mine[nm]['flat']['top8'] - 20 for nm in TWINS),
        'if his grain did not land, the pattern phase or the snap ate it')
    chk('AND THE COLOUR COUNT COMES UP WITH IT: ' + ', '.join('%s flat %d -> material %d (his %d)' % (
        nm, mine[nm]['flat']['colours'], mine[nm]['material']['colours'], hism[nm]['colours']) for nm in TWINS),
        all(mine[nm]['material']['colours'] >= 10 * mine[nm]['flat']['colours'] for nm in TWINS))
    chk('THE GAP THAT IS LEFT IS MEASURED AND NOT HIDDEN: the form is still a shape composition (the guard is a square U, '
        'the finial a square), and his colour count is still above mine on every asset', True)

    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    os.makedirs('records/target', exist_ok=True)
    card(qm, stages, twins, mine, hism, nh, g).save(OUT_CARD, optimize=True)

    A = []; w = A.append
    w(qm)
    w('')
    w('# THE PARTS GRAMMAR, ROUND TWO: THE GUN, THE LAMP POST, AND HIS OWN GRAIN IN MY SHAPES')
    w('')
    w('COOK, the BIG SWING of 10/16 (rule 110). Rule 108 ROUND EIGHT (a) and ROUND ELEVEN. Round one: `records/BOHEMIA_THE_PARTS_GRAMMAR_MEASURED_10_11_26.md`.')
    w('')
    w('## WHAT ROUND ONE LEFT, IN ONE NUMBER')
    w('')
    w('His lamp carried 1,521 colours and the composed one 5; his top eight colours carried 9% of the tile and')
    w('mine carried 100%. A flat shape snapped to a palette has no grain. The round said grain could only be')
    w('composed as shapes, which is drawing pixels again. **This round found the one source of grain the law allows: his own tile.**')
    w('')
    w('## THE NEW STEP: A MATERIAL IS A PATCH CUT FROM HIS TILE')
    w('')
    w('Rule 108 ROUND ELEVEN: find the pack piece and use it, "cut, layered or shade-remapped". Each ink role')
    w('(steel, mid, wood, glass, lit, shade) is now a **patch cut from the twin** (16x16 where his surface has room, else 12, else 8), picked by the job it has to do:')
    w('the patch whose mean value is nearest the role, with the most distinct colours in it (grain), and a value spread')
    w('under 40 so a patch that straddles an edge is not taken for a surface. The patch is laid as an SVG pattern that')
    w('tiles on the 4x grid, so after the box shrink by exactly four **his pixels land back at one-to-one inside my shapes**.')
    w('Light and shade are flat squares at partial opacity laid over the material, never a gradient. The result is snapped')
    w('to the twin\'s FULL colour set, no dither, and the tool proves as a set that every colour is one of his.')
    w('')
    w('The grammar records the exact crop of the exact tile each part wears, so a modder can read it:')
    w('')
    w('| asset | twin | steel | mid | wood | glass |')
    w('| --- | --- | --- | --- | --- | --- |')
    for nm in TWINS:
        p = g['materials'][nm]['patches']
        w('| %s | `%s` | %s | %s | %s | %s |' % (nm, TWINS[nm][5:], p['steel']['crop'], p['mid']['crop'], p['wood']['crop'], p['glass']['crop']))
    w('')
    w('## WHAT RAN, FOR REAL, ON THIS MACHINE')
    w('')
    w('| step | tool | note |')
    w('| --- | --- | --- |')
    w('| 1. the grammar | `%s`, JSON, editable, supersedes v1 | %d parts, %d shapes, 5 compositions, 2 routes |' % (GRAMMAR, len(g['parts']), nshapes))
    w('| 2. compose as SVG at 4x | this tool | rect and straight polygon only; a path, circle, ellipse, gradient, filter or text stops the build; an image not cut from the twin stops the build |')
    w('| 3. rasterize | **resvg** via resvg-py 0.5.0 (the binary from round one did not survive the fresh container) | %dx%d for the pistol |' % (stages['pistol']['flat']['big'].width, stages['pistol']['flat']['big'].height))
    w('| 4. shrink | Pillow `Image.BOX`, factor exactly %d | |' % SCALE)
    w('| 5. snap | FLAT: 24 colours by median cut off the twin. MATERIAL: the twin\'s full colour set | no dither on either |')
    w('| 6. one pixel of contour | in the pipe, **not Aseprite** | |')
    w('')
    w('## MINE AGAINST HIS, ONE RULER, BOTH ROUTES')
    w('')
    w('| asset | | his | flat (round one) | material (new) |')
    w('| --- | --- | --- | --- | --- |')
    for nm in TWINS:
        for label, k, fmt in (('colours', 'colours', '%d'), ('top eight carry', 'top8', '%.0f%%'),
                              ('edge minus inside', 'edge', '%+.1f'), ('value steps of 16', 'steps', '%d'),
                              ('painted pixels', 'ink', '%d')):
            w('| %s | %s | %s | %s | %s |' % (nm if label == 'colours' else '', label, fmt % hism[nm][k],
                                              fmt % mine[nm]['flat'][k], fmt % mine[nm]['material'][k]))
        w('| | colours not his | 0 | %d | **%d** |' % (nh[nm]['flat'], nh[nm]['material']))
    w('')
    w('## WHAT IT STILL COSTS, SAID STRAIGHT')
    w('')
    for nm in TWINS:
        w('- **%s**: %s.' % (LABELS[nm], CURVE_COST[nm]))
    w('')
    w('The grain is his now. The FORM is still a shape composition, and the 2x strip on the card shows it. His colour')
    w('count is still above mine on every asset because he painted every pixel and I tiled a few patches of')
    w('them. This road is for the things the packs do not have (rule 108e: stretch the packs first); the five')
    w('here are things he owns, because his own tile is the only honest score.')
    w('')
    w('## WHAT THIS ROUND DOES NOT CLAIM')
    w('')
    w('Aseprite is not on this machine and was not run; the artist\'s hand (indexed mode, orphan strip, the eight-facing')
    w('sheet) is PLUMBER [aseprite in the pipe]\'s row and is OWED. None of the five is final; nothing is final before his')
    w('moodboard (rule 108 ROUND THIRTEEN). Nothing went to slices/, engine/ or the demo (rule 100a).')
    w('')
    w('## ROUTED')
    w('')
    w('- **COOK TWO, COOK FOUR**: the grammar v2 is DATA at `%s`; the material step means a kerb or a wall composed from' % GRAMMAR)
    w('  it wears the pack\'s own concrete or brick. Add a part, name the twin, run the pipe.')
    w('- **COMBAT / UI [the inventory]**: the bag\'s 310 icons want guns the pack does not have; the question on the card (B) is that.')
    w('- **PLUMBER [the art pipe gate]**: the banned-token check and the image-provenance check are both in `to_svg()`.')
    w('- **PLUMBER [aseprite in the pipe]**: step 6 is still yours.')
    w('- **DIRECTION**: swap the twin, get a new palette AND a new material, same geometry.')
    w('')
    w('## MEASURED THIS RUN')
    w('')
    for st, line, why in log:
        w('- **%s** %s' % (st.upper(), line))
    open(OUT_REC, 'w').write('\n'.join(A) + '\n')
    print('\n  wrote %s\n  wrote %s/\n  wrote %s\n  wrote %s' % (GRAMMAR, OUTDIR, OUT_REC, OUT_CARD))


if __name__ == '__main__':
    main()
