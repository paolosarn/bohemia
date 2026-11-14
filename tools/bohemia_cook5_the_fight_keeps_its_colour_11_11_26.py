#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [the fight keeps its colour] 11/11/26: THE THIRTY FIGHT PICTURES THAT WENT NEARLY GREY GET THEIR OWN COLOUR BACK.
Ask row 576 (FOUND BY PLUMBER 8 11/10, the red debt: gate THE FIGHT KEEPS ITS COLOUR, K2 red on main), VAMILY rule 167(b)
(Paolo 10/25: 'the combat map like went completely like almost like black and white... I don't know why you did that'),
rule 336 (Paolo 11/2 on the six maps: 'still this yellow brown sand dirt as the main ground, not enough unique shit going
on'), rule 430 (improve, never throw away), rule 441.

WHAT HAPPENED (read off the history, not guessed): on 10/25 the gate remembered every fight picture's colour as he knew it
(median CIELAB chroma about 12 to 13.6: a board that was mostly sand). On 11/2 COMBAT's EVERY GROUND ITS OWN (c7f7ce05)
answered his NO on the sand: every place's own ground through the rig laid where the sand was. The sand went, by his word,
and most of the colour went with it, which nobody ruled: the landfill and main street kept a fifth of theirs (chroma 2.5 and
2.9: grey to the eye), the wash, the works, the ruin, the freeway block and the scrub under half. Thirty pictures.

WHAT THIS DOES. It does not bring the sand back and it does not repaint anything. Each of the thirty keeps every pixel's
lightness and its own hue (the place's own ground: cover soil, cobbles, rust, brick, creosote) and gets more of the colour it
already has, enough that the gate's own measure reads a little over half of what he knew (ASK of the remembered chroma):
  the lift is in CIELAB: a,b = a,b + (k - 1) x (a,b smoothed over a few pixels), so a picture's grain and its packing
  noise are not coloured, only what is there over an area; k is found per picture by the gate's own measure; a colour that
  is already strong is held (a soft ceiling at chroma CEIL), so paint and signs do not go neon.
The raided futures are their own files and get the same.
WHAT IS GREY AND MEANT TO BE takes the valley's dust instead (a warm buff cast, never more than DUST_MAX: more is the sand he
ruled out), and A DARK GREY ROAD STAYS A DARK GREY ROAD: SOUNDS' floor table (tools/bohemia_sounds_fight_floors.py) hears a tile
as asphalt when three tenths of its picture is dark grey, so those pixels are held (ROAD_SAT, ROAD_VAL), and a tile it hears
as a road by a hair is held whole. The landfill's dark is cover soil, not asphalt: it is lifted, and the table is re-derived
there (its 50 tiles are dirt to the ear now, nothing else changes).
MAIN STREET, 11/14 (it was left red on 11/11 at three tenths): its car parks are 13 tiles SOUNDS hears as asphalt off the picture.
A tile drawn dark needs three tenths of itself dark grey, not all of it (held_mask): in each, four tenths stays bare in bands
lying along the street (what the last tyres and the wind keep clean) and the dust lies on the rest; a tile heard by COMBAT's
plan is not read off the picture and is not held. All thirty are over half now; the floor table is the pictures, unchanged.

  python3 tools/bohemia_cook5_the_fight_keeps_its_colour_11_11_26.py list            (what is under half, by the gate's own measure)
  python3 tools/bohemia_cook5_the_fight_keeps_its_colour_11_11_26.py lift [--write]   (without --write: to records/target/cook5_colour/try/)
  python3 tools/bohemia_cook5_the_fight_keeps_its_colour_11_11_26.py sheet <before_dir> <page_dir>

ANALOG HORROR (rule 20), at the source: act one is faded, dirty, rare colour, never grey: the colour that comes back is
rust, old brick, dried mud and dead grass, the colours of things left out for years.
REFERENCE CHECK (the 9/4 standing duty): the twin of each picture is itself as it stood (a quarter-size copy made at lift time in
records/target/cook5_colour/before/, not kept in git: the VOTE sheet carries them side by side) and the fight pictures that never lost their colour (the suburbs, the Strip: chroma 9 to 13); the
real places: the Apex landfill's cover soil is red-brown caliche, Fremont Street's pavement is warm grey with brick bands,
the Las Vegas Wash's bed is tan silt over grey cobble, the creosote flats are olive on buff. No reference game.
REUSE CHECK (REUSE-FIRST): the gate's own measure (gates/the_fight_keeps_its_colour_gate.py chroma_of and picture, imported,
never copied); COMBAT's 11/2 pictures themselves (nothing re-rendered); PIL and numpy.
TASTE CHECK: his 10/25 words (never black and white) and his 11/2 words (not the yellow brown sand) both hold: the hue is
each place's own, the amount is the least the gate asks plus a margin.
"""
import importlib.util, json, os, sys
import numpy as np
from PIL import Image, ImageFilter

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FG = os.path.join(R, 'slices', 'fight_ground')
OUT = os.path.join(R, 'records', 'target', 'cook5_colour')
ASK = 0.58          # of the remembered chroma (the gate's line is half; the margin is for the packing)
CEIL = 46.0         # a colour already this strong is held
KMAX = 1.45         # a picture's own colour is never more than this many times itself (at 2.6 main street's cream roofs went mustard: seen 11/11)
DUST = np.array([0.34, 0.94])   # the valley's dust in CIELAB a,b: a warm buff (hue 70), what everything left outside goes
DUST_ONLY_UNDER = 6.0
ROAD_SAT, ROAD_VAL = 0.10, 0.395   # a dark grey road keeps well under SOUNDS' 0.18 and 0.42: the packing moves a dark pixel's saturation by up to 0.07 (measured on the ruin: at 0.155 and 0.415 nine road tiles went to dirt)
DUST_MAX = 5.5       # more dust than this on a pale ground is the yellow brown sand he ruled out on 11/2 (seen at 14: a tan plate)
NOT_A_ROAD = ('landfill', 'scrub')   # their dark grey is cover soil and shadow, not asphalt: SOUNDS' table read the landfill's soil as a road; it is re-derived (dirt)
QUALITY = 78

_spec = importlib.util.spec_from_file_location('colour_gate', os.path.join(R, 'gates', 'the_fight_keeps_its_colour_gate.py'))
G = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(G)

M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]); MI = np.linalg.inv(M)
WP = np.array([0.95047, 1.0, 1.08883])


def to_lab(rgb):
    a = rgb.astype(np.float64) / 255.0
    lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    xyz = (lin @ M.T) / WP
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def to_rgb(lab):
    fy = (lab[..., 0] + 16) / 116; fx = fy + lab[..., 1] / 500; fz = fy - lab[..., 2] / 200
    f = np.stack([fx, fy, fz], -1)
    xyz = np.where(f ** 3 > 0.008856, f ** 3, (f - 16 / 116) / 7.787) * WP
    lin = np.clip(xyz @ MI.T, 0, 1)
    return np.clip(np.where(lin <= 0.0031308, lin * 12.92, 1.055 * lin ** (1 / 2.4) - 0.055) * 255 + 0.5, 0, 255).astype(np.uint8)


def lifted(im, k, blur=2.2, dust=0.0, hold_road=True, edge=None, held=None):
    """the picture with k times its own colour (its lightness and hue kept, its grain not coloured, a strong colour held);
    dust: what is nearly grey (bare asphalt, concrete) takes the valley's dust, a warm cast of this much chroma, and what
    already has a colour takes none"""
    rgba = np.asarray(im.convert('RGBA')); lab = to_lab(rgba[..., :3])
    sm = np.asarray(Image.fromarray(rgba[..., :3]).filter(ImageFilter.GaussianBlur(blur))); labs = to_lab(sm)
    ab = lab[..., 1:] + (k - 1.0) * labs[..., 1:]
    if dust:
        cs = np.hypot(labs[..., 1], labs[..., 2]); wgt = np.exp(-(cs / DUST_ONLY_UNDER) ** 2) * np.clip(lab[..., 0] / 22.0, 0, 1)   # not in the black of a shadow or a window
        if held is not None:                                       # the dust thins out toward a swept band, it does not stop at a line
            wgt = wgt * (1.0 - np.asarray(Image.fromarray((held * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur * 2.5)), np.float64) / 255.0)
        ab = ab + dust * wgt[..., None] * DUST
    c = np.hypot(ab[..., 0], ab[..., 1]); c0 = np.hypot(lab[..., 1], lab[..., 2])
    lim = np.maximum(c0, CEIL * np.tanh(c / CEIL))                # never less colour than it had, never a neon
    ab = ab * (np.minimum(c, lim) / np.maximum(c, 1e-6))[..., None]
    out = to_rgb(np.concatenate([lab[..., :1], ab], -1)).astype(np.float64)
    # WHAT THE EAR READS STAYS WHAT IT WAS (SOUNDS' floor table, tools/bohemia_sounds_fight_floors.py: a tile is asphalt when
    # three tenths of its picture is dark grey, saturation under 0.18 and value under 0.42): a pixel that was dark grey stays
    # dark grey (its colour held under ROAD_SAT), so no tile changes its floor; measured 11/11: the first lift turned the
    # roads of main street, the ruin and the landfill to dirt for the ear, and no other threshold gives the table back
    src = rgba[..., :3].astype(np.float64); mx0, mn0 = src.max(-1), src.min(-1)
    road = ((mx0 - mn0) / (mx0 + 1e-6) < 0.18) & (mx0 / 255.0 < 0.42) & bool(hold_road)
    if held is not None: road = held                               # (the caller says which pixels the ear needs: held_mask)
    elif edge is not None and hold_road:                             # a tile the ear reads as a road by a hair (its dark grey share just over three tenths): what is nearly dark grey there goes with the road, so the packing cannot tip the tile
        road |= edge & ((mx0 - mn0) / (mx0 + 1e-6) < 0.26) & (mx0 / 255.0 < 0.47)
    for _ in range(3):
        mx, mn = out.max(-1), out.min(-1); sat = (mx - mn) / (mx + 1e-6)
        t = np.where(road & (sat > ROAD_SAT), ROAD_SAT / np.maximum(sat, 1e-6), 1.0)[..., None]
        grey = out.mean(-1, keepdims=True); out = grey + (out - grey) * t
    out[road] = np.minimum(out[road], ROAD_VAL * 255)              # and its value under the line it was under
    return Image.fromarray(np.concatenate([np.clip(out + 0.5, 0, 255).astype(np.uint8), rgba[..., 3:]], -1), 'RGBA')


def measure(im):
    a = np.asarray(im.convert('RGBA'))
    a = np.asarray(Image.fromarray(a).reduce(4)) if min(im.size) > 400 else a
    return G.chroma_of(a)


def packed(im, lossless, path):
    if im.getextrema()[3][0] == 255: im = im.convert('RGB')
    im.save(path, 'WEBP', lossless=True, method=6) if lossless else im.save(path, 'WEBP', quality=QUALITY, method=6)
    return Image.open(path)


def edge_tiles(name, size):
    """the tiles of a block SOUNDS' table calls asphalt only because they are drawn dark, and only just (share under 0.42), as a pixel mask"""
    t = json.load(open(os.path.join(R, 'slices', 'vote', 'travel_steps', 'fight_floors.json')))['blocks']
    key = name.replace('block_', '').replace('_raided', ''); i = key.rfind('_'); b = t.get(key[:i] + '.' + key[i + 1:])
    if not b: return None
    W_, H_ = size; bt = len(b['floor']); m = np.zeros((H_, W_), bool)
    for ty in range(bt):
        for tx in range(bt):
            if b['why'][ty][tx] == 'drawn dark' and b['dark_share'][ty][tx] < 0.42: m[int(ty * H_ / bt):int((ty + 1) * H_ / bt), int(tx * W_ / bt):int((tx + 1) * W_ / bt)] = True
    return m if m.any() else None


SWEPT = 0.40        # of a tile the ear reads off the picture stays bare dark grey (the table's line is three tenths; the rest is for the packing)


def held_mask(name, im, seed=7):
    """WHERE THE EAR READS THE PICTURE, AND ONLY THERE (COOK FIVE 11/14, the main street left red on 11/11). SOUNDS' table hears
    a tile as asphalt for one of two reasons: COMBAT's plan lays a road piece on it (then the picture is not read at all), or
    three tenths of its picture is dark grey ('drawn dark'). Holding EVERY dark grey pixel kept main street at three tenths of
    its colour, because its car parks are 13 tiles drawn dark. A tile drawn dark needs three tenths, not all of itself: so in
    each such tile SWEPT of it stays bare (the bands the last tyres and the wind keep clean, lying along the street), and the
    dust lies on the rest; a tile only just over the line is held whole, with what is nearly dark grey; a tile heard by the
    plan, and a tile heard as dirt, is not held. Returns the pixels to hold, or None when the table does not know the block."""
    t = json.load(open(os.path.join(R, 'slices', 'vote', 'travel_steps', 'fight_floors.json')))['blocks']
    key = name.replace('block_', '').replace('_raided', ''); i = key.rfind('_'); b = t.get(key[:i] + '.' + key[i + 1:])
    if not b: return None
    src = np.asarray(im.convert('RGB')).astype(np.float64); mx, mn = src.max(-1), src.min(-1); sat = (mx - mn) / (mx + 1e-6); val = mx / 255.0
    road = (sat < 0.18) & (val < 0.42); near = (sat < 0.26) & (val < 0.47)
    H_, W_ = road.shape; bt = len(b['floor']); held = np.zeros((H_, W_), bool)
    rng = np.random.RandomState(seed + sum(map(ord, key)))            # the bands: long along the street (east-west), a couple of metres across
    lat = rng.rand(max(2, H_ // 70) + 2, max(2, W_ // 420) + 2).astype(np.float32)
    pat = np.asarray(Image.fromarray((lat * 255).astype(np.uint8)).resize((W_ + 2 * 420, H_ + 2 * 70), Image.BICUBIC), np.float32)[70:70 + H_, 420:420 + W_]
    fine = rng.rand(H_ // 6 + 2, W_ // 6 + 2).astype(np.float32)
    pat = pat + 18.0 * np.asarray(Image.fromarray((fine * 255).astype(np.uint8)).resize((W_, H_), Image.BICUBIC), np.float32) / 255.0
    for ty in range(bt):
        for tx in range(bt):
            if b['why'][ty][tx] != 'drawn dark': continue
            sl = (slice(int(ty * H_ / bt), int((ty + 1) * H_ / bt)), slice(int(tx * W_ / bt), int((tx + 1) * W_ / bt)))
            share = float(road[sl].mean())
            if share < SWEPT + 0.1: held[sl] = near[sl]                # only just a road to the ear: all of it, and what is nearly dark grey
            else:
                thr = np.quantile(pat[sl][road[sl]], SWEPT / share); held[sl] = road[sl] & (pat[sl] <= thr)
    return held


def low():
    mem = json.load(open(G.MEM))['chroma']; pics = G.pictures(); out = []
    for n, c0 in mem.items():
        if n in pics and c0 > 1.0:
            c = G.chroma_of(G.picture(pics[n]))
            if c < G.HALF * c0: out.append((n, c0, c))
    return sorted(out, key=lambda r: r[2] / r[1])


def is_lossless(path):
    with open(path, 'rb') as f: head = f.read(20)
    return head[12:16] == b'VP8L'


def lift(write=False):
    rows = low(); dst = FG if write else os.path.join(OUT, 'try'); os.makedirs(dst, exist_ok=True)
    only = [a for a in sys.argv[2:] if not a.startswith('--')]
    if only: rows = [r for r in rows if r[0] in only]
    os.makedirs(os.path.join(OUT, 'before'), exist_ok=True); ledger = {}
    for n, c0, c in rows:
        src = os.path.join(FG, n + '.webp'); im = Image.open(src).convert('RGBA'); ll = is_lossless(src); size0 = os.path.getsize(src)
        bq = os.path.join(OUT, 'before', n + '.jpg')
        if not os.path.exists(bq): im.convert('RGB').reduce(4).save(bq, quality=86)           # the twin: itself as it stood
        hold = not any(n.startswith('block_' + f + '_') for f in NOT_A_ROAD); edge = None
        held = held_mask(n, im) if hold else None
        want = ASK * c0; small = im.reduce(4) if min(im.size) > 400 else im
        hs = None if held is None else np.asarray(Image.fromarray(held).resize(small.size, Image.NEAREST))
        read = lambda k_, d_: G.chroma_of(np.asarray(lifted(small, k_, 0.55, d_, hold, None, hs)))
        k, dust = KMAX, 0.0
        if read(KMAX, 0.0) >= want:                                 # its own colour is enough: the least lift that reads ASK of what he knew (the gate's own measure, its own quarter size)
            lo, hi = 1.0, KMAX
            for _ in range(10):
                k = (lo + hi) / 2
                if read(k, 0.0) < want: lo = k
                else: hi = k
            k = hi
        else:                                                       # mostly bare road: its own colour to KMAX, then the dust on what is grey
            lo, hi = 0.0, DUST_MAX
            for _ in range(10):
                dust = (lo + hi) / 2
                if read(k, dust) < want: lo = dust
                else: hi = dust
            dust = hi
        tmp = os.path.join(dst, n + '.webp'); got = measure(packed(lifted(im, k, 2.2, dust, hold, edge, held), ll, tmp))
        if got < G.HALF * c0 * 1.06 and not dust:                   # the packing took some back: a little more
            k *= 1.06; got = measure(packed(lifted(im, k, 2.2, dust, hold, edge, held), ll, tmp))
        for _ in range(3):                                          # (and where the dust carries it: a little more dust, never past DUST_MAX)
            if got >= G.HALF * c0 * 1.06 or not dust or dust >= DUST_MAX: break
            dust = min(DUST_MAX, dust * 1.5 + 0.5); got = measure(packed(lifted(im, k, 2.2, dust, hold, edge, held), ll, tmp))
        ledger[n] = dict(remembered=c0, was=round(c, 2), now=round(got, 2), share=round(got / c0, 3), k=round(k, 3), dust=round(dust, 2), road_held=hold, bytes_was=size0, bytes_now=os.path.getsize(tmp), lossless=ll)
        print('%-30s %5.1f -> %5.1f of %5.1f (%2.0f%%)  k %.2f dust %.1f  %8d -> %8d bytes' % (n, c, got, c0, 100 * got / c0, k, dust, size0, os.path.getsize(tmp)), flush=True)
    lp = os.path.join(OUT, 'ledger.json' if write else 'ledger_try.json')
    if os.path.exists(lp): ledger = dict(json.load(open(lp)).get('pictures', {}), **ledger)   # a later run of a few keeps the others' lines
    json.dump(dict(why='ask row 576, rule 167(b): each picture\'s own colour lifted to a little over half of what he knew (the gate\'s own measure); lightness and hue kept', ask=ASK, pictures=ledger),
              open(lp, 'w'), indent=1)
    print(len(rows), 'pictures', 'written into the game' if write else 'tried in ' + dst)


def sheet(page_dir):
    """records/target/COOK5_THE_FIGHT_KEEPS_ITS_COLOUR_11_11.webp: each place as it stood and now (a quarter size), then the
    fight's own page on his phone"""
    from PIL import ImageDraw, ImageFont
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub=None):
        im = Image.new('RGB', (WID, 64 if sub else 40), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK)
        if sub: d.text((10, 38), sub, font=font(14), fill=DIM)
        rows.append(im)
    led = json.load(open(os.path.join(OUT, 'ledger.json')))['pictures']
    title('ON HIS PHONE: A FIGHT AT THE LANDFILL AND ON MAIN STREET, AS IT STOOD AND NOW', 'the fight\'s own page, 390 x 844, the same seed')
    items = [('THE LANDFILL, AS IT STOOD', 'landfill_before'), ('NOW', 'landfill_now'), ('MAIN STREET, AS IT STOOD', 'main_before'), ('NOW', 'main_now')]
    cw = (WID - 30) // 4; r = Image.new('RGB', (WID, int(660 * cw / 390) + 26), BG); d = ImageDraw.Draw(r); x = 0
    for lab, fn in items:
        n = Image.open(os.path.join(page_dir, fn + '_upright.png')).convert('RGB'); n = n.crop((0, 0, n.width, int(n.width * 660 / 390))).resize((cw, int(660 * cw / 390)), Image.LANCZOS)
        d.text((x + 4, 4), lab, font=font(14), fill=DIM if 'STOOD' in lab else INK); r.paste(n, (x, 26)); x += cw + 10
    rows.append(r); first_row = len(rows) - 1
    title('EVERY PLACE THAT HAD GONE GREY: AS IT STOOD (LEFT) AND NOW (RIGHT)', 'each block a quarter size; the number is how much of the colour he knew it keeps')
    names = [n for n in led if not n.endswith('_raided')]; tw, th = 280, 198; per = 2
    for i in range(0, len(names), per):
        r = Image.new('RGB', (WID, th + 22), BG); d = ImageDraw.Draw(r)
        for j, n in enumerate(names[i:i + per]):
            b = Image.open(os.path.join(OUT, 'before', n + '.jpg')).convert('RGB').resize((tw, th), Image.LANCZOS)
            a = Image.open(os.path.join(FG, n + '.webp')).convert('RGB').resize((tw, th), Image.LANCZOS)
            x = j * (tw * 2 + 14 + 16); r.paste(b, (x, 22)); r.paste(a, (x + tw + 6, 22))
            d.text((x + 4, 3), '%s   %d%% -> %d%%' % (n.replace('block_', '').upper(), round(100 * led[n]['was'] / led[n]['remembered']), round(100 * led[n]['share'])), font=font(14), fill=INK)
        rows.append(r)
    out = Image.new('RGB', (WID, sum(q.height + 8 for q in rows)), BG); y = 0; fy = 0
    for i, q in enumerate(rows):
        out.paste(q, (0, y))
        if i == first_row: fy = y
        y += q.height + 8
    dst = os.path.join(R, 'records/target/COOK5_THE_FIGHT_KEEPS_ITS_COLOUR_11_11.webp'); out.save(dst, 'WEBP', quality=78, method=6)
    n = Image.open(os.path.join(page_dir, 'landfill_now_upright.png')).convert('RGB'); n = n.crop((0, 0, n.width, int(n.width * 660 / 390)))
    os.makedirs(os.path.join(R, 'records/target/vote_first'), exist_ok=True)
    n.resize((n.width // 2, n.height // 2), Image.LANCZOS).save(os.path.join(R, 'records/target/vote_first/cook5-the-fight-keeps-its-colour-11-11.webp'), 'WEBP', quality=82, method=6)
    print('sheet', out.size, os.path.getsize(dst), 'first at', (cw + 10, fy + 26, cw, int(660 * cw / 390)))


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'list':
        for n, c0, c in low(): print('%-30s remembered %5.1f now %5.1f (%2.0f%%)' % (n, c0, c, 100 * c / c0))
    elif a and a[0] == 'lift': lift('--write' in a)
    elif a and a[0] == 'sheet': sheet(a[1])
    else: print(__doc__)
