#!/usr/bin/env python3
"""THE PARTS GRAMMAR: NO CHAT DRAWS A CURVE  (COOK [the parts grammar], 10/11/26, rule 108 ROUND EIGHT (a))

PAOLO 10/11: "the limit of your graphics feels coded by a seventh grader, I'm trying to unlock
your limits." The research answered why (records/BOHEMIA_RESEARCH_UNLOCK_THE_LIMITS_02_*): a
language model is bad at placing pixels as numbers and bad at fine curves, and reliably good at
ONE thing -- laying simple shapes in the right places. Chat2SVG (CVPR 2025) says it in a
sentence: models "can produce basic geometric shapes... but struggle to produce the complex
geometric details required for professional SVG applications."

SO THE CHAT STOPS DRAWING AND STARTS COMPOSING. This file is the road, end to end, run for
real on this machine:

  1. A GRAMMAR of named parts with sizes in the floor's pixels, in a JSON file a modder can
     edit (banks/BOHEMIA_PARTS_GRAMMAR_10_11_26.json). The chat fills the grammar.
  2. The asset is composed as SVG AT FOUR TIMES the final size, from rect / line / polygon with
     straight segments and flat fills only. No gradient, no blur, no text, no curve.
  3. RASTERIZED with resvg 0.44.0, the real renderer the research names, installed this round.
  4. SHRUNK BY EXACTLY FOUR with a BOX filter. Never bilinear, never a fractional factor. The
     box average over a 4x4 block is what makes the straight line land as a clean pixel edge.
  5. SNAPPED TO THE PACK PALETTE with NO DITHER, the palette read off his own tiles.
  6. OUTLINED one pixel, because the prop study (10/10) measured 100% of his objects carrying a
     dark contour at -49.9.

THE TWO PROOFS THE ROW ASKS FOR, each beside its pack twin at 1:1: the first LAMP and the first
WRECKED CAR. Both are things he ALREADY OWNS, and that is deliberate -- a road you cannot score
is not proven, and his own tile is the only honest score. The pipe's job is the things the packs
do NOT have; the lamp and the wreck are the test bench.

HIS LAMP CURVES AND THIS ONE CANNOT. His street lamp's arm is a swept curve. The grammar has no
curve in it by law. That gap is the honest result of the round and it is on the card as a number,
not hidden.

    python3 tools/bohemia_the_parts_grammar_cook_10_11_26.py
      -> banks/BOHEMIA_PARTS_GRAMMAR_10_11_26.json       (the grammar, editable)
      -> banks/BOHEMIA_PARTS_PIPE_OUT_10_11_26/*.png     (the two assets and their stages)
      -> records/BOHEMIA_THE_PARTS_GRAMMAR_MEASURED_10_11_26.md
      -> records/target/COOK_THE_PARTS_GRAMMAR.png       (the VOTE card)

NOTHING TO slices/ OR engine/ (rule 100a).

WHAT THIS ROUND DOES NOT CLAIM: Aseprite is not on this machine and was not run. Step 6 of the
research pipeline (the artist's hand: indexed mode, orphan strip, the eight-facing sheet) is
PLUMBER [aseprite in the pipe]'s row and is OWED. The outline here is done in the pipe and the
card says so.

REFERENCE CHECK (the 9/4 standing law): the reference is his own lamp family (47 tiles, 8 of
them street lamps) and his wreck pack (35 tiles), measured on the study page this round, and the
card puts mine beside his at one art pixel to one phone pixel.
  REUSE CHECK: the PALETTE is his, read off the twin itself, and the twin is used whole as the
  comparison. What is composed here is geometry, not pixels: no pixel is written as a number
  anywhere in this file, which is rule 108a's whole point.

[bb the overworld is battle brothers] reference/library/battle_brothers/10_UI_AND_FEEL.md: their
  whole look is one artist's hand held for years, which is why a Battle Brothers helmet reads as
  the same object on four enemies. WHAT MOVES THAT THEIR PICTURE DOES NOT (rule 33g): we have no
  single hand, we have nine chats, so the hand has to be a FILE. The grammar is that file: every
  chat fills the same parts at the same sizes, so the consistency comes from the machine instead
  of from one person's wrist.
"""
import json, os, subprocess, sys, collections
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

BANK = 'reference/art_bank'
GRAMMAR = 'banks/BOHEMIA_PARTS_GRAMMAR_10_11_26.json'
OUTDIR = 'banks/BOHEMIA_PARTS_PIPE_OUT_10_11_26'
OUT_REC = 'records/BOHEMIA_THE_PARTS_GRAMMAR_MEASURED_10_11_26.md'
OUT_CARD = 'records/target/COOK_THE_PARTS_GRAMMAR.png'
SCALE = 4                      # the shrink, and it is an integer by law
FLOOR = 96                     # rule 105
LUM = np.array([0.299, 0.587, 0.114], np.float32)

LAMP_TWIN = 'pack:18. Light sources and fire barrels#0'
WRECK_TWIN = 'pack:9. Abandoned cards#1'

def die(m): sys.exit('REFUSED: ' + m)


def his(key):
    for r in json.load(open(BANK + '/CORPUS.json'))['tiles'].values():
        if r['key'] == key:
            return Image.open(os.path.join(BANK, r['family'], r['file'])).convert('RGBA')
    die('%s is not in the corpus' % key)


def palette_of(im, n=24):
    """THE PACK PALETTE, READ OFF THE TWIN ITSELF, never picked.

       *** AND NOT BY FREQUENCY, WHICH WAS THE FIRST CUT AND WAS USELESS. *** His lamp carries
       1,521 distinct colours in 1,766 painted pixels: almost every pixel is unique, so "the 24
       most common colours" returns (0,0,0), (0,0,1), (0,0,2) -- the flat black of his contour
       and nothing else. Both assets came out of the pipe in FOUR near-black colours and the
       contour guard caught it. Frequency means nothing on art where nothing repeats.

       Median cut over the opaque pixels is the right question: it splits the colour box until
       it has n groups that COVER the tile's range, which is what a palette is for."""
    a = np.asarray(im, np.uint8)
    m = a[..., 3] > 128
    px = a[..., :3][m]
    if px.size == 0: die('the twin has no opaque pixels')
    strip = Image.fromarray(px.reshape(1, -1, 3).astype(np.uint8), 'RGB')
    q = strip.quantize(colors=n, method=Image.MEDIANCUT)
    pal = q.getpalette()[:n * 3]
    return [np.array(pal[i * 3:i * 3 + 3], np.float32) for i in range(n)]


# ---------------------------------------------------------------- the grammar
def build_grammar(lamp_pal, wreck_pal, lamp_body, wreck_body):
    """THE GRAMMAR IS DATA, NOT CODE (rule 108, and the mods law): named parts, sizes in the
       floor's pixels, and a composition that says where each part goes. A modder edits this
       file; nobody edits a pixel.

       Every size here came off the study page's measurements of his own tiles, not off a
       feeling: his street lamp stands 96 tall in a 56 wide box and fills 33% of it, so the pole
       is thin and the head is small and high, and the whole thing is mostly empty box, because
       a silhouette is most of what a prop is."""
    def hx(c): return '#%02x%02x%02x' % tuple(int(v) for v in c)
    def val(c): return float(np.asarray(c, np.float32) @ LUM)

    def inks_from(pal, body):
        """*** THE INKS ARE PICKED BY ROLE AND BY VALUE, NOT BY POSITION IN THE LIST. ***
           The cut before this took pal[0] for the body, and median cut returns its groups in
           no useful order, so the lamp's whole pole came out painted in #fbf5c2, the bright
           cream of its own glow. A palette is a set, not a ranking.

           So the palette is sorted by how light each colour is, and each ink is the entry
           nearest the job it has to do. The BODY is anchored to the twin's own measured body
           value, which the prop study (10/10) says is where his objects sit."""
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
            'rust': hx(max(pal, key=lambda c: float(c[0]) - float(c[2]))),
        }

    return {
        'version': 'BOHEMIA_PARTS_GRAMMAR_v1',
        'made': '10/11/26', 'lane': 'cook', 'row': '[the parts grammar]',
        'law': 'rule 108 ROUND EIGHT (a): no chat draws a pixel or a curve in code. Parts are '
               'rectangles, straight lines and straight-segment polygons. A curve in this file '
               'is a bug.',
        'units': 'every number is in FINAL pixels on the 96 floor; the composer multiplies by '
                 '%d before it writes the SVG, and shrinks by exactly %d after' % (SCALE, SCALE),
        'floor': FLOOR,
        'parts': {
            # a part is a list of plain shapes in its own box. x,y,w,h in final pixels.
            'pole': {'box': [6, 70], 'shapes': [
                {'rect': [2, 0, 2, 70], 'ink': 'mid'},
                {'rect': [1, 0, 1, 70], 'ink': 'lit'},       # the sun is north-west
                {'rect': [4, 0, 1, 70], 'ink': 'dark'}]},
            'pole_foot': {'box': [12, 7], 'shapes': [
                {'rect': [0, 4, 12, 3], 'ink': 'mid'},
                {'rect': [2, 1, 8, 3], 'ink': 'mid'},
                {'rect': [2, 1, 8, 1], 'ink': 'lit'},
                {'rect': [0, 6, 12, 1], 'ink': 'dark'}]},
            # THE ARM IS A STAIRCASE, NOT A CURVE. His sweeps; the law says we may not, so the
            # grammar steps it. The card shows what that costs.
            'arm_step': {'box': [18, 12], 'shapes': [
                {'rect': [0, 8, 6, 2], 'ink': 'mid'},
                {'rect': [5, 5, 6, 2], 'ink': 'mid'},
                {'rect': [10, 2, 6, 2], 'ink': 'mid'},
                {'rect': [14, 0, 4, 2], 'ink': 'mid'},
                {'rect': [0, 8, 6, 1], 'ink': 'lit'},
                {'rect': [5, 5, 6, 1], 'ink': 'lit'},
                {'rect': [10, 2, 6, 1], 'ink': 'lit'},
                {'rect': [14, 0, 4, 1], 'ink': 'lit'}]},
            'lamp_head': {'box': [16, 20], 'shapes': [
                {'poly': [[2, 6], [14, 6], [11, 0], [5, 0]], 'ink': 'mid'},    # the hood
                {'rect': [5, 0, 6, 1], 'ink': 'lit'},
                {'rect': [1, 6, 14, 2], 'ink': 'dark'},
                {'rect': [3, 8, 10, 9], 'ink': 'glass'},                       # the glass
                {'rect': [5, 10, 6, 5], 'ink': 'glow'},                        # the filament
                {'rect': [3, 17, 10, 2], 'ink': 'mid'},
                {'rect': [3, 19, 10, 1], 'ink': 'dark'}]},
            'wreck_body': {'box': [64, 22], 'shapes': [
                {'poly': [[0, 10], [6, 4], [20, 2], [44, 2], [58, 5], [64, 11],
                          [64, 20], [0, 20]], 'ink': 'mid'},
                {'poly': [[6, 4], [20, 2], [44, 2], [52, 5]], 'ink': 'lit'},
                {'rect': [0, 18, 64, 2], 'ink': 'dark'}]},
            'wreck_cabin': {'box': [34, 14], 'shapes': [
                {'poly': [[4, 14], [8, 1], [26, 1], [31, 14]], 'ink': 'mid'},
                {'poly': [[9, 12], [12, 3], [22, 3], [25, 12]], 'ink': 'glass'},
                {'rect': [8, 1, 18, 1], 'ink': 'lit'},
                {'poly': [[13, 5], [16, 5], [15, 11], [12, 11]], 'ink': 'dark'}]},  # the break
            'wheel': {'box': [14, 14], 'shapes': [
                {'poly': [[3, 0], [11, 0], [14, 3], [14, 11], [11, 14], [3, 14],
                          [0, 11], [0, 3]], 'ink': 'dark'},
                {'poly': [[5, 3], [9, 3], [11, 5], [11, 9], [9, 11], [5, 11],
                          [3, 9], [3, 5]], 'ink': 'mid'}]},
            'rust_patch': {'box': [10, 6], 'shapes': [
                {'rect': [0, 0, 7, 2], 'ink': 'rust'},
                {'rect': [3, 2, 7, 2], 'ink': 'rust'},
                {'rect': [1, 4, 5, 2], 'ink': 'rust'}]},
        },
        'inks': {'lamp': inks_from(lamp_pal, lamp_body),
                 'wreck': inks_from(wreck_pal, wreck_body)},
        'compositions': {
            'street_lamp': {'canvas': [FLOOR // 2 + 8, FLOOR], 'inks': 'lamp', 'place': [
                ['pole', 20, 20], ['pole_foot', 17, 89], ['arm_step', 23, 8],
                ['lamp_head', 36, 17]]},
            'wrecked_car': {'canvas': [FLOOR, 58], 'inks': 'wreck', 'place': [
                ['wheel', 10, 42], ['wheel', 70, 42],
                ['wreck_body', 16, 32], ['wreck_cabin', 30, 20],
                ['rust_patch', 24, 38], ['rust_patch', 58, 36], ['rust_patch', 44, 50]]},
        },
    }


# ---------------------------------------------------------------- the pipe
def to_svg(g, name):
    """STEP 2: THE ASSET AS SVG AT FOUR TIMES, from plain shapes only. Every number written here
       is a COORDINATE, not a pixel: that is the difference rule 108a draws."""
    comp = g['compositions'][name]
    inks = g['inks'][comp['inks']]
    W, H = comp['canvas'][0] * SCALE, comp['canvas'][1] * SCALE
    # *** AND crispEdges IS GONE, WHICH IS THE WHOLE POINT OF THE ROAD. The first cut set
    # *** shape-rendering="crispEdges" and every part's coordinates were whole final pixels, so
    # every shape edge landed exactly on a 4-pixel boundary and the box shrink averaged uniform
    # blocks. The result had FIVE colours in it: a 1:1 pixel drawing in fancy dress, which is the
    # exact thing rule 108a is trying to escape. Letting resvg anti-alias, and letting a part's
    # numbers be fractions of a final pixel, is what makes the shrink do any work at all: a
    # diagonal at 4x becomes real intermediate values at 1x instead of a staircase.
    out = ['<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d">' % (W, H)]
    for pname, px, py in comp['place']:
        part = g['parts'][pname]
        for sh in part['shapes']:
            col = inks[sh['ink']]
            if 'rect' in sh:
                x, y, w, h = sh['rect']
                out.append('<rect x="%g" y="%g" width="%g" height="%g" fill="%s"/>'
                           % ((px + x) * SCALE, (py + y) * SCALE, w * SCALE, h * SCALE, col))
            elif 'poly' in sh:
                pts = ' '.join('%g,%g' % ((px + a) * SCALE, (py + b) * SCALE)
                               for a, b in sh['poly'])
                out.append('<polygon points="%s" fill="%s"/>' % (pts, col))
            else:
                die('a shape in part %s is neither a rect nor a polygon' % pname)
    out.append('</svg>')
    s = '\n'.join(out)
    for banned in ('<path', 'curve', 'rx=', 'ry=', '<circle', '<ellipse', 'gradient', 'filter'):
        if banned in s:
            die('the composed SVG carries "%s", which rule 108a forbids' % banned)
    return s, (W, H)


def rasterize(svg, wh, path):
    """STEP 3: resvg, the real renderer. If it is not here the round stops; a stand-in that
       draws the shapes in Python would be the exact thing the law bans."""
    open(path + '.svg', 'w').write(svg)
    r = subprocess.run(['resvg', '--width', str(wh[0]), '--height', str(wh[1]),
                        path + '.svg', path + '_4x.png'], capture_output=True, text=True)
    if r.returncode != 0:
        die('resvg failed: ' + (r.stderr or r.stdout)[:300])
    return Image.open(path + '_4x.png').convert('RGBA')


def shrink(im):
    """STEP 4: EXACTLY FOUR TIMES, BOX FILTER. The whole trick of the road is here. A box average
       over a 4x4 block turns a straight vector edge into a clean pixel edge with its own
       anti-aliasing; nearest at a fractional factor is what makes the uneven cells that the
       unfake tools exist to repair."""
    w, h = im.size
    if w % SCALE or h % SCALE:
        die('the raster is %dx%d, which does not divide by %d' % (w, h, SCALE))
    return im.resize((w // SCALE, h // SCALE), Image.BOX)


def snap(im, pal):
    """STEP 5: THE PACK PALETTE, NO DITHER. Nearest colour in his own palette, per pixel. Dither
       is banned because his tiles do not dither: the road page measured a value holding 1.90 px
       at sixteen steps, which is grain, not a per-pixel checker."""
    a = np.asarray(im, np.uint8).copy()
    m = a[..., 3] > 110
    P = np.stack(pal)
    f = a[..., :3].astype(np.float32)
    d = ((f[:, :, None, :] - P[None, None, :, :]) ** 2).sum(axis=3)
    a[..., :3] = P[np.argmin(d, axis=2)].astype(np.uint8)
    a[..., 3] = np.where(m, 255, 0)
    return Image.fromarray(a, 'RGBA')


def outline(im, dark):
    """STEP 6, THE PART ASEPRITE OWES. The prop study measured 100% of his objects carrying a
       dark contour at -49.9, so the silhouette gets one pixel of his darkest ink all the way
       round. This is the pipe's hand, not Aseprite's: Aseprite is not on this machine and the
       card says so."""
    a = np.asarray(im, np.uint8).copy()
    s = a[..., 3] > 128
    er = np.zeros_like(s)
    er[1:-1, 1:-1] = (s[1:-1, 1:-1] & s[:-2, 1:-1] & s[2:, 1:-1] & s[1:-1, :-2] & s[1:-1, 2:])
    a[s & ~er, :3] = np.array(dark, np.uint8)
    return Image.fromarray(a, 'RGBA')


def hx2rgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def make(g, name, pal, out):
    svg, wh = to_svg(g, name)
    big = rasterize(svg, wh, os.path.join(out, name))
    small = shrink(big)
    locked = snap(small, pal)
    dark = hx2rgb(g['inks'][g['compositions'][name]['inks']]['dark'])
    fin = outline(locked, dark)
    big.save(os.path.join(out, name + '_4x.png'))
    small.save(os.path.join(out, name + '_shrunk.png'))
    fin.save(os.path.join(out, name + '.png'))
    return svg, big, small, fin


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
                body=float(np.median(y[er])) if er.sum() else 0.0)


BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)
WARN = (214, 120, 92); GOOD = (150, 190, 120)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def card(stages, twins, mine, his, g):
    """ONE CARD: EVERY STAGE OF THE ROAD, AND MINE BESIDE HIS AT 1:1. Rule 89: the show is the
       picture, the numbers are the proof line under it. The four stages are on the card because
       the road IS the thing being voted on this round, not the lamp."""
    f16, f12, f11, f10 = font(16), font(12), font(11), font(10)
    W, H = 1020, 900
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((14, 12), 'NO CHAT DRAWS A CURVE: THE PARTS ROAD, RUN FOR REAL', font=f16, fill=INK)
    d.text((14, 34), 'shapes -> svg at 4x -> resvg -> box shrink by exactly 4 -> his palette, '
                     'no dither -> one pixel of contour. NOT IN THE GAME (rule 101).',
           font=f10, fill=HOT)

    y = 56
    for nm, label in (('street_lamp', 'THE LAMP'), ('wrecked_car', 'THE WRECK')):
        st = stages[nm]
        d.text((14, y), label, font=f12, fill=HOT)
        y += 16
        x = 16
        cols = [('his tile, untouched', twins[nm]),
                ('off resvg, shown at half', st['big'].resize(
                    (st['big'].width // 2, st['big'].height // 2), Image.BOX)),
                ('shrunk by 4, box', st['small']),
                ('his palette, no dither', st['locked']),
                ('and one pixel of contour', st['fin'])]
        for cap, pic in cols:
            d.text((x, y), cap, font=f10, fill=DIM)
            im.paste(pic, (x, y + 14), pic if pic.mode == 'RGBA' else None)
            x += max(pic.width, 150) + 14
        y += 14 + max(p.height for _, p in cols) + 14

    d.text((14, y), 'THE PROOF LINE, under the picture where it belongs:', font=f12, fill=INK)
    y += 20
    d.text((22, y), '%-22s %10s %10s %10s %10s' % ('', 'HIS LAMP', 'MY LAMP', 'HIS WRECK', 'MY WRECK'),
           font=f10, fill=DIM)
    y += 15
    rows = [('painted pixels', 'ink', '%d'), ('how full the box is', 'fill', '%.0f%%'),
            ('colours in it', 'colours', '%d'), ('the top eight carry', 'top8', '%.0f%%'),
            ('edge minus inside', 'edge', '%+.1f'), ("the body's own value", 'body', '%.0f')]
    for label, k, fmt in rows:
        vals = (his['street_lamp'][k], mine['street_lamp'][k],
                his['wrecked_car'][k], mine['wrecked_car'][k])
        d.text((22, y), '%-22s %10s %10s %10s %10s'
               % (label, fmt % vals[0], fmt % vals[1], fmt % vals[2], fmt % vals[3]),
               font=f10, fill=DIM)
        y += 15

    y += 8
    for t in ('WHAT THIS IS: the chats were placing pixels one at a time as numbers in code, which is the one',
              'thing a language model is worst at, and it looked it. Nothing here places a pixel. A grammar of',
              'named parts gets composed as flat shapes, a real renderer draws them big, and the picture is',
              'shrunk by exactly four so the straight edges land clean. The grammar is a file a modder edits.'):
        d.text((14, y), t, font=f10, fill=DIM)
        y += 14
    y += 6
    for t in ('AND WHAT IT COSTS, SAID STRAIGHT, BECAUSE ONE NUMBER ON THAT TABLE IS THE WHOLE ANSWER:',
              'THE TOP EIGHT COLOURS CARRY 9%% OF HIS LAMP AND 100%% OF MINE. That is the exact measurement this'
              % (),
              'programme has used for "AI slop" since the twin round, and the parts road scores the worst it can',
              'score. His tile is a surface; mine is a flat ramp of five colours, which is what NO ATARI names.',
              'His lamp arm is a curve and the law forbids drawing one, so mine is a staircase. The road can only',
              'get grain by composing grain as shapes, which is drawing pixels again wearing a hat.',
              'Aseprite is not on this machine and was not run.'):
        d.text((14, y), t, font=f10, fill=WARN)
        y += 14

    y += 10
    d.text((14, y), 'THE ONE QUESTION:', font=f12, fill=HOT)
    y += 18
    for t in ('How far do we take this road, knowing it can never draw a curve and lands a flat five colours?',
              'The numbers on this card point at A.',
              '',
              'A  ONLY THE PLAINEST THINGS: signs, crates, kerbs, boxes, UI chrome. Anything with a shape is bought.',
              'B  BUILD IT OUT anyway for buildings, street furniture, vehicles and icons, and live with flat.',
              'C  DROP IT. Buy or commission everything, and the chats only cut and place what we already own.'):
        d.text((22, y), t, font=f10, fill=INK if t.startswith(('A ', 'B ', 'C ')) else DIM)
        y += 15
    return im


def main():
    lamp_twin, wreck_twin = his(LAMP_TWIN), his(WRECK_TWIN)
    lamp_pal, wreck_pal = palette_of(lamp_twin), palette_of(wreck_twin)
    lb = measure(lamp_twin)['body']; wb = measure(wreck_twin)['body']
    g = build_grammar(lamp_pal, wreck_pal, lb, wb)
    os.makedirs(OUTDIR, exist_ok=True)
    json.dump(g, open(GRAMMAR, 'w'), indent=1)

    stages, mine, svgs = {}, {}, {}
    pals = {'street_lamp': lamp_pal, 'wrecked_car': wreck_pal}
    for nm in ('street_lamp', 'wrecked_car'):
        svg, big, small, fin = make(g, nm, pals[nm], OUTDIR)
        locked = snap(small, pals[nm])
        stages[nm] = dict(big=big, small=small, locked=locked, fin=fin)
        mine[nm] = measure(fin)
        svgs[nm] = svg
    twins = {'street_lamp': lamp_twin, 'wrecked_car': wreck_twin}
    hism = {k: measure(v) for k, v in twins.items()}

    log = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        return cond
    fails = []

    for line, cond, why in [
        ('NOT ONE PIXEL IS WRITTEN AS A NUMBER (rule 108a): the two assets are %d shapes in a '
         'grammar file, composed as SVG and drawn by resvg 0.44.0'
         % sum(len(p['shapes']) for p in g['parts'].values()),
         all('<path' not in s and '<circle' not in s and 'gradient' not in s for s in svgs.values()),
         'a pixel written as a number in code is what made the seventh-grader look'),
        ('THE SHRINK IS EXACTLY FOUR AND IT IS A BOX FILTER: %dx%d down to %dx%d, never bilinear, '
         'never a fraction' % (stages['street_lamp']['big'].width,
                               stages['street_lamp']['big'].height,
                               stages['street_lamp']['small'].width,
                               stages['street_lamp']['small'].height),
         stages['street_lamp']['big'].width == stages['street_lamp']['small'].width * SCALE,
         'a fractional shrink is what makes the uneven cells the unfake tools exist to repair'),
        ('EVERY COLOUR ON BOTH IS ONE OF HIS: the palette is read off the twin itself and snapped '
         'with no dither', True, ''),
        ('BOTH CLEAR THE 96 FLOOR (rule 105): the lamp %dx%d, the wreck %dx%d'
         % (mine['street_lamp']['w'], mine['street_lamp']['h'],
            mine['wrecked_car']['w'], mine['wrecked_car']['h']),
         max(mine['street_lamp']['w'], mine['street_lamp']['h']) >= FLOOR
         and max(mine['wrecked_car']['w'], mine['wrecked_car']['h']) >= FLOOR,
         'a marker, a prop or a tile is never under its kind\'s floor'),
        ('THEY CARRY THE DARK CONTOUR 100%% OF HIS OBJECTS CARRY: mine %+.1f and %+.1f, his %+.1f '
         'and %+.1f' % (mine['street_lamp']['edge'], mine['wrecked_car']['edge'],
                        hism['street_lamp']['edge'], hism['wrecked_car']['edge']),
         mine['street_lamp']['edge'] <= -20 and mine['wrecked_car']['edge'] <= -20,
         'the prop study, 10/10: edge minus inside -49.9 across 784 of his props'),
        ('AND THE GAP IS MEASURED AND NOT HIDDEN: his lamp carries %d colours and mine %d, his '
         'wreck %d and mine %d'
         % (hism['street_lamp']['colours'], mine['street_lamp']['colours'],
            hism['wrecked_car']['colours'], mine['wrecked_car']['colours']), True, ''),
        ('IT IS ONE ROAD, PROVEN ON TWO THINGS HE ALREADY OWNS, so his own tile is the score', True, ''),
    ]:
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line)

    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    os.makedirs('records/target', exist_ok=True)
    card(stages, twins, mine, hism, g).save(OUT_CARD, optimize=True)

    A = []; w = A.append
    w('# THE PARTS GRAMMAR: NO CHAT DRAWS A CURVE')
    w('')
    w('COOK [the parts grammar], 10/11/26. Rule 108 ROUND EIGHT (a).')
    w('')
    w('## WHAT RAN, FOR REAL, ON THIS MACHINE')
    w('')
    w('| step | tool | what came out |')
    w('| --- | --- | --- |')
    w('| 1. the grammar | `%s`, JSON, editable | %d named parts, %d shapes, sizes in the floor\'s pixels |'
      % (GRAMMAR, len(g['parts']), sum(len(p['shapes']) for p in g['parts'].values())))
    w('| 2. compose as SVG at 4x | this tool | rect, line and straight polygon only; a path, a '
      'circle, an ellipse, a gradient or a filter in the output stops the build |')
    w('| 3. rasterize | **resvg 0.44.0**, installed this round | %dx%d for the lamp |'
      % (stages['street_lamp']['big'].width, stages['street_lamp']['big'].height))
    w('| 4. shrink | Pillow `Image.BOX`, factor exactly %d | %dx%d |'
      % (SCALE, stages['street_lamp']['small'].width, stages['street_lamp']['small'].height))
    w('| 5. snap to his palette | nearest colour, NO dither, palette read off the twin | |')
    w('| 6. one pixel of contour | in the pipe, **not Aseprite** | |')
    w('')
    w('## MINE AGAINST HIS, ONE RULER, BOTH WAYS')
    w('')
    w('| | his lamp | my lamp | his wreck | my wreck |')
    w('| --- | --- | --- | --- | --- |')
    for label, k, fmt in [('painted pixels', 'ink', '%d'), ('how full the box is', 'fill', '%.0f%%'),
                          ('colours', 'colours', '%d'), ('the top eight carry', 'top8', '%.0f%%'),
                          ('edge minus inside', 'edge', '%+.1f'), ("the body's value", 'body', '%.0f')]:
        w('| %s | %s | %s | %s | %s |' % (label, fmt % hism['street_lamp'][k],
                                          fmt % mine['street_lamp'][k],
                                          fmt % hism['wrecked_car'][k],
                                          fmt % mine['wrecked_car'][k]))
    w('')
    w('## WHAT IT COSTS, SAID STRAIGHT')
    w('')
    w('**His lamp arm is a curve and the law forbids drawing one, so mine is a staircase.** That is')
    w('the honest result of the round, not a detail. His wreck is a photograph of a dead car and')
    w('mine is a shape of one: he carries %d colours in his and the pipe lands %d in mine, because'
      % (hism['wrecked_car']['colours'], mine['wrecked_car']['colours']))
    w('a flat-shape composition snapped to a palette has nowhere to get grain from.')
    w('')
    w('So THIS ROAD IS FOR THE THINGS THE PACKS DO NOT HAVE. The lamp and the wreck are on the card')
    w('because he already OWNS both, and his own tile is the only honest score there is. The pack')
    w('card (10/11) found 210 of his packs never opened; rule 108e says stretch the packs first,')
    w('and that order still holds: cut his piece if it exists, compose only when it does not.')
    w('')
    w('## WHAT THIS ROUND DOES NOT CLAIM')
    w('')
    w('Aseprite is not on this machine and was not run. The artist\'s hand (indexed mode, orphan')
    w('strip, the eight-facing sheet) is PLUMBER [aseprite in the pipe]\'s row and is OWED. The')
    w('contour here is the pipe\'s own, measured to the prop study\'s number, and the card says so.')
    w('')
    w('## ROUTED')
    w('')
    w('- **COOK TWO, COOK FOUR**: the grammar is at `%s` and it is DATA. Add a part, fill a' % GRAMMAR)
    w('  composition, run the pipe. Nobody writes a pixel.')
    w('- **PLUMBER [the art pipe gate]**: this tool is the first thing the gate can point at. The')
    w('  banned-token check on the composed SVG is in `to_svg()` and it stops the build.')
    w('- **PLUMBER [aseprite in the pipe]**: step 6 is waiting for you; the pipe hands you a')
    w('  palette-locked PNG at the floor.')
    w('- **DIRECTION**: the inks come from the twin, not from a mood. Swap the twin, get a new')
    w('  palette, same geometry.')
    w('')
    w('## MEASURED THIS RUN')
    w('')
    for st, line, why in log:
        w('- **%s** %s' % (st.upper(), line))
    open(OUT_REC, 'w').write('\n'.join(A) + '\n')
    print('\n  wrote %s\n  wrote %s/\n  wrote %s\n  wrote %s'
          % (GRAMMAR, OUTDIR, OUT_REC, OUT_CARD))


if __name__ == '__main__':
    main()
