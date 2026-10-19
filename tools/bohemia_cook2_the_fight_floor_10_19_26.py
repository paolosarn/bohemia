#!/usr/bin/env python3
"""COOK TWO [the fight floor he hates] (Paolo 10/18, his NO on COMBAT's ground fights: 'The floor tiles are all shit.
It's so terrible so bad I hate. I hate the ground. I hate the floor. He just looks like shit. It's so fucking bad.').
records/ only (rule 100): nothing to slices/, engine/ or the demo; every pixel cut, padded, laid or recoloured from his
purchased packs (rule 108), the way his YES street was made (cook2-one-real-street-10-18, voted UP).

WHAT HE HATES, MEASURED BEFORE CUTTING ANYTHING (records/BOHEMIA_COOK2_THE_FIGHT_FLOOR_10_19_26.md):
  * THE CAMOUFLAGE. Every ground in the fight's 35 block pictures is TWO soils, the second pasted through a coarse
    random field (9 x 9 or 14 x 14 values, bicubic-stretched over a block, cut at one level): big two-tone blobs, the
    same print on every board. The floor set's own docstring calls them 'ragged like ground'; at the fight's camera
    they read as an army print (DIRECTION's verdict 23, F3: 'a camouflage print, not ground').
  * THE ORANGE. His soils are warm and saturated (0.33 to 0.44); the scrub, the wash and the yards read orange.
  * THE PATCHWORK. The lots and driveways are a grey cobble from the 7/28 starter recook, framed squares on tan.
THE FIX IS THE GROUND HE SAID YES TO, NOT A NEW GROUND: one soil per surface, his soil #2 taken shade to shade onto
the valley's caliche (the recolour he voted UP), his slab for every concrete, his plain asphalt for every road the kit
did not already lay, his cracked dry earth for the wash bed. No noise field, no second soil, no blob.

HOW, WITHOUT TOUCHING COMBAT TWO'S FILES (the hard file split): COMBAT TWO's block maker
(tools/bohemia_combat2_the_ground_for_the_new_fight_cook_10_2_26.py) is IMPORTED, never edited, and run twice in this
process on every block the fight ships:
  1. AS IT IS: the block it makes is compared with the block the fight ships (slices/fight_ground/block_*.webp, read
     only); a pixel a later round changed (the street kit, the houses) is never touched.
  2. WITH EVERY GROUND CODED: its dress functions hand back one flat code colour per ground (a ramp of 40 steps of a
     hue nothing in the city uses, added to its own palette as a family), so every shadow its shade() casts on the
     ground lands on that family's ramp. Reading the code back gives, per pixel, WHICH ground it was and HOW MUCH its
     maker darkened it (a house's shadow, a bank, a tyre track).
Then the shipped block keeps every pixel that is not ground, and every ground pixel is his YES ground at that spot,
darkened by the same amount with the hue walking cool into shadow (the style guide's field 4).
  python3 tools/bohemia_cook2_the_fight_floor_10_19_26.py            (all 35 blocks, about 8 minutes)
  python3 tools/bohemia_cook2_the_fight_floor_10_19_26.py corner.0   (one block)
  -> records/target/cook2_fight_floor/block_<id>.webp (same size, same plan, the floor re-laid), materials/,
     COOK2_FIGHT_FLOOR_KIT.json (what each ground is, from which of his tiles, the counts per block)

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (his 7/13 UP set), the card of numbers and skills/bohemia-pixel-art, AH-01 and AH-03, the style
guide (records/BOHEMIA_THE_STYLE_GUIDE_AND_THE_LOOK_BIBLE_10_18_26.md, field 4: cool into shadow). The source is his own
tiles; the bar is his YES on one real street. No reference game.

REUSE CHECK (REUSE-FIRST, 7/22, written 10/19): his own tiles through the pack reader (bohemia_cook2_stretch_the_pack:
pack(), cut_frame(), pad(), recolour(), decal()), the one-real-street recipe for the caliche, COMBAT TWO's block maker
imported as it is for the plan and the shadows; nothing drawn (rule 108).

TASTE CHECK (written 10/19): his rulings on the ground are the bar: his NO on the fight floor (this row), his UP on one
real street ('the ground he said YES to'), his 'Way better nice!' on the joins in the valley's tans, his YES on the curb;
DIRECTION's verdict 23 (F3: no camouflage sand); the sheet goes to DIRECTION, then the VOTE tab.

[bb the battle ground] Battle Brothers' tactical board is one painted ground per terrain, quiet under the men, the hex
grid faint; a tile reads as its terrain by its ground and the things standing on it, never by a print laid over it.
"""
import colorsys, json, os, sys, time, types, importlib
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook2_stretch_the_pack as S

SHIP = os.path.join(R, 'slices/fight_ground')
OUT = os.path.join(R, 'records/target/cook2_fight_floor')
SOIL = '2. Soil and dirt tiles'
TILT = 0.7071                                       # the 45 DEGREE ART LAW: depth x cos45 (the blocks' own tilt)

# ---- the grounds: his tiles, one per surface ------------------------------------------------------------------------
# caliche: his YES street's dirt exactly (soil #2 shade to shade onto the valley's grey-tan, #9a8e78)
# desert: the same soil a step warmer (the valley's open ground is the yards' caliche; the creosote and rocks the maker
#         stands on it say desert, not a second print)
# rough: his soil #4, flecked where #2 is plain, onto the same caliche: the recolour keeps HIS luminance, so the tile
#        decides the tone; #4 sits 5 levels under #2 (#22 sat 53 under and made the ruin's debris field a blob again)
# playa: his soil #21, the cracked dry earth, onto the pale wash-bed tan (the wash and the shore when dry)
# track: the desert's two ruts (the scrub's tyre track), the same soil a step darker where the wheels packed it
# concrete: his cracked slab (the sidewalk family his YES street walks on), frames cut; his two quietest with no paint,
#           no weeds and no eight-legged star (#0, #2: 10 and 11 percent crack pixels; DIRECTION's 10/10 note on the
#           repeated star), turned all four ways (a slab and a road have no up, as the street kit lays them)
# asphalt: his six quietest plain road tiles (the YES street's rest area), frames cut
GROUNDS = {
    'caliche':  dict(fam=SOIL, ids=[2], tint='#9a8e78', cut=11, cell=(72, 74)),
    'desert':   dict(fam=SOIL, ids=[2], tint='#a19077', cut=11, cell=(72, 74)),
    'rough':    dict(fam=SOIL, ids=[4], tint='#958974', cut=11, cell=(72, 72)),
    'playa':    dict(fam=SOIL, ids=[21], tint='#ab9e86', cut=11, cell=(72, 70)),
    'track':    dict(fam=SOIL, ids=[2], tint='#8d7e68', cut=11, cell=(72, 74)),
    'concrete': dict(fam=S.SIDEWALK, ids=[0, 2], cell=(82, 81), flip4=True),
    'asphalt':  dict(fam=S.ROAD, ids=[0, 1, 8, 9, 10, 11], cell=(82, 81), flip4=True),
    'lawn':     dict(fam='3. Grass and ground tiles', ids=[1, 2, 4], cut=11, cell=(72, 72), sat=0.6),
}
# THE ANALOG HORROR LINE (rule 20, one calm wrong thing per board, from the world's state): ONE front yard on the suburb
# board is a green lawn. The dollar died, the water district is a ruin, every other yard on the street is caliche, and
# somebody still waters this one. His spring grass, its vibrance down two fifths (his 9/23; nothing glows), inside the yard's own caliche,
# the house's shadow still on it. corner.1 is on the suburb board once and the freeway board once.
LAWN = {'corner.1': (540, 1456, 1000, 1722)}
# the code hue for each ground in the coded run (far from every colour the city uses; 110..255 so a deep shadow
# never meets the dark ramps)
CODE = {'caliche': (1, .08, 1), 'desert': (1, 1, .08), 'rough': (1, .08, .08), 'playa': (.08, 1, .08),
        'concrete': (.08, 1, 1), 'asphalt': (.55, .55, 1), 'track': (.3, .08, 1)}
STEPS = 40
def code_ramp(g): return [tuple(int(round(c * v)) for c in CODE[g]) for v in np.linspace(110, 255, STEPS)]

# which of COMBAT TWO's dress names is which ground (the 7/28 starter recook names, read off its own calls)
K_DRESS = {'yard_0': 'caliche', 'yard_1': 'caliche', 'yard_2': 'caliche', 'dirt': 'caliche',
           'concrete_0': 'concrete', 'concrete_1': 'concrete', 'walk_0': 'concrete', 'walk_1': 'concrete',
           'walk_2': 'concrete', 'road_0': 'asphalt', 'road_1': 'asphalt', 'road_2': 'asphalt', 'road_gutter': 'asphalt'}
# the desert pool's soils by block kind (DGROUND index -> ground): the wash's bed is 3 and 0, its flats 1 and 2
def d_ground(kind, i):
    if kind == 'wash': return 'playa' if i in (0, 3) else 'desert'
    if kind == 'shore': return 'playa'
    if kind in ('scrub', 'scrubroad') and i == 0: return 'track'     # the scrub's ruts are pasted in soil 0
    if i in (4, 5): return 'rough'
    return 'desert'

LEDGER = {}


# ---- the ground fields ----------------------------------------------------------------------------------------------
_cache = {}
def piece(g, i, flip):
    k = (g, i, flip)                                          # flip: 0 as bought, 1 left-right, 2 top-bottom, 3 both
    if k not in _cache:
        spec = GROUNDS[g]; a = S.pack(spec['fam'], i)
        if 'tint' in spec: a = S.recolour(a, a[..., 3] > 0, spec['tint'], levels=6, shift_deg=10)
        if 'sat' in spec:
            hsv = S._hsv(a[..., :3].reshape(-1, 3).astype(float) / 255); hsv[:, 1] *= spec['sat']
            a = a.copy(); a[..., :3] = (S._rgb(hsv) * 255).round().clip(0, 255).astype(np.uint8).reshape(a.shape[:2] + (3,))
        c = spec.get('cut')
        a = a[c:-c, c:-c] if c else S.cut_frame(a, spec['fam'])
        a = S.pad(a, *spec['cell'])[..., :3]
        if flip & 1: a = a[:, ::-1]
        if flip & 2: a = a[::-1]
        _cache[k] = a
    return _cache[k]


def field(g, w, h, seed):
    """his tiles laid at his own pixel over the square plan, one per cell, left-right flips (slab and road all four ways), then the 45 camera
       (NEAREST rows, the blocks' own tilt): one pixel size, nothing scaled across."""
    spec = GROUNDS[g]; tw, th = spec['cell']; rng = np.random.RandomState(seed)
    ph = int(np.ceil(h / TILT)) + th
    plan = np.zeros((ph + th, w + tw, 3), np.uint8)
    for r in range(0, ph, th):
        off = (tw // 2) * (r // th % 2)                      # rows run like brick: no column for the eye to follow
        for c in range(-off, w + tw, tw):
            i = spec['ids'][rng.randint(len(spec['ids']))]
            t = piece(g, i, rng.randint(4) if spec.get('flip4') else int(rng.rand() < 0.5))
            x0 = max(0, c); x1 = min(w + tw, c + tw)
            plan[r:r + th, x0:x1] = t[:, x0 - c:x1 - c]
    plan = plan[:ph, :w]
    rows = np.minimum((np.arange(h) / TILT).astype(int), ph - 1)
    return plan[rows]


def shadow(px, mult):
    """his ground at the darkness COMBAT TWO's maker gave that pixel; the hue walks cool into shadow (field 4)."""
    out = px.astype(float) / 255
    sel = mult < 0.985
    if not sel.any(): return px
    hsv = S._hsv(out[sel]); m = mult[sel]
    hsv[:, 0] = (hsv[:, 0] + (1 - m) * 22 / 360) % 1          # toward violet-blue as it darkens
    hsv[:, 1] = np.clip(hsv[:, 1] * (1 + (1 - m) * 0.25), 0, 1)
    hsv[:, 2] = hsv[:, 2] * m
    out[sel] = S._rgb(hsv)
    return (out * 255).round().clip(0, 255).astype(np.uint8)


# ---- COMBAT TWO's block maker, imported as it is ------------------------------------------------------------------
def load_maker():
    os.environ.setdefault('MPLBACKEND', 'Agg')
    G = importlib.import_module('bohemia_combat2_the_ground_for_the_new_fight_cook_10_2_26')
    return G


def canon(G):
    from PIL import Image as I
    B, F, L, R4, MX = G.B, G.F, G.L, G.R4, G.MX
    L._CANON.clear()                                         # its desert strips are cached on first use: cut them again
    G.variant(0)
    cplan = R4.yards(424242); croad = MX._street(cplan, 424243)
    cboard = cplan.resize((B.BP, G.PY * G.N), I.NEAREST); B.faces(cboard, croad.resize((B.BP, G.PY * G.N), I.NEAREST), B.C[2], 0.15)
    G.CANON[:] = [cboard, F.street_small(13, ns=True), R4.scrub()[0]]
    L._CANON['shore_img'] = G.shore_one_line()[0]
    if not hasattr(F, '_lego_street_small'):
        F._lego_street_small = F.street_small
    cache = {(sd, False, True): F._lego_street_small(sd, ns=True) for sd in range(19, 28, 2)}
    cache[(13, True, False)] = F._lego_street_small(13, crossing=True)
    def street_small(seed=11, crossing=False, ns=False):
        k = (seed, crossing, ns)
        return cache[k].copy() if k in cache else F._lego_street_small(seed, crossing, ns)
    F.street_small = street_small


def make(G, bid):
    kind, v = bid.split('.')
    G.variant(int(v) * 1009); G.CUR[0] = int(v)
    board = G.MAKERS[kind]()[0]
    if kind in G.L.TOWN_KINDS or kind in G.L.CROSS_KINDS:
        board = G.L.stud(board, kind, G.CANON[0], G.CANON[1], (G.PX, G.PY), G.CANON[2])
    board, _ = G.from_the_kit(board, kind, int(v) * 7 + len(kind))
    return np.asarray(board.convert('RGB'))


def code_everything(G):
    """the coded run: every ground dress hands back its code; the code families join the palette so shade() keeps
       a shadow on the ground inside the ground's own family."""
    K, B = G.K, G.B
    for g in CODE: K.RAMPS['cook2_' + g] = code_ramp(g)
    top = {g: code_ramp(g)[-1] for g in CODE}
    kd0, da0 = G._DRESS0, G._DANY0
    names = {id(t): i for i, t in enumerate(B.DGROUND)}
    kind_now = ['']
    def kd(variants, w, h, seed):
        vs = list(variants) if isinstance(variants, (list, tuple)) else [variants]
        gs = {K_DRESS.get(x) for x in vs}
        if len(gs) == 1 and None not in gs:
            return Image.new('RGB', (max(1, w), max(1, h)), top[gs.pop()])
        return kd0(variants, w, h, seed)
    def da(tiles, w, h, seed):
        idx = [names.get(id(t)) for t in tiles]
        if None not in idx:
            gs = {d_ground(kind_now[0], i) for i in idx}
            if len(gs) == 1: return Image.new('RGB', (w, h), top[gs.pop()])
        return da0(tiles, w, h, seed)
    G._DRESS0, G._DANY0 = kd, da
    for mod in list(sys.modules.values()):
        if isinstance(mod, types.ModuleType) and getattr(mod, '__name__', '').startswith('bohemia_'):
            if getattr(mod, 'dress', None) is kd0: mod.dress = kd
            if getattr(mod, 'dress_any', None) is da0: mod.dress_any = da
    K.dress = kd; B.dress_any = da
    return kind_now


def decode(coded):
    """per pixel: the ground (or '') and the darkness its maker gave it, from the code ramps."""
    flat = coded.reshape(-1, 3)
    key = (flat[:, 0].astype(np.int64) << 16) | (flat[:, 1].astype(np.int64) << 8) | flat[:, 2]
    gid = np.full(len(key), -1, np.int16); lum = np.zeros(len(key), np.float32)
    names = list(CODE)
    for k, g in enumerate(names):
        ramp = code_ramp(g); topl = 0.299 * ramp[-1][0] + 0.587 * ramp[-1][1] + 0.114 * ramp[-1][2]
        for c in ramp:
            kk = (c[0] << 16) | (c[1] << 8) | c[2]
            hit = key == kk
            gid[hit] = k; lum[hit] = (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / topl
    return gid.reshape(coded.shape[:2]), lum.reshape(coded.shape[:2]), names


def refloor(bid, orig, coded, seed):
    ship = np.asarray(Image.open(os.path.join(SHIP, 'block_%s.webp' % bid.replace('.', '_'))).convert('RGB'))
    gid, lum, names = decode(coded)
    same = (ship == orig).all(2)                              # a pixel a later round changed is never touched
    out = ship.copy(); h, w = ship.shape[:2]
    counts = {}
    for k, g in enumerate(names):
        sel = (gid == k) & same
        if not sel.any(): continue
        mode = np.percentile(lum[gid == k], 85)                 # its maker's unshaded level (most ground is unshaded)
        mult = np.clip(lum / max(mode, 1e-3), 0.3, 1.0)
        if bid.startswith('ruin'):                            # the ruin's soot is a noise field cut at 0.6 (a second
            mult = np.where(mult < 0.7, np.clip(mult / 0.6, 0.3, 1.0), mult)   # camouflage): lifted; its houses' shadows stay
        f = field(g, w, h, seed + 97 * k)
        lay = shadow(f[sel], mult[sel])
        out[sel] = lay
        counts[g] = dict(px=int(sel.sum()), share=round(float(sel.mean()), 4), shaded=int((mult[sel] < 0.985).sum()))
    if bid in LAWN:                                           # the one watered yard
        x0, y0, x1, y1 = LAWN[bid]; box = np.zeros((h, w), bool); box[y0:y1, x0:x1] = True
        k = names.index('caliche'); sel = box & (gid == k) & same
        mode = np.percentile(lum[gid == k], 85)
        mult = np.clip(lum / max(mode, 1e-3), 0.3, 1.0)
        out[sel] = shadow(field('lawn', w, h, seed + 7)[sel], mult[sel])
        counts['lawn'] = dict(px=int(sel.sum()), box=LAWN[bid])
    counts['kept_later_rounds'] = int(((gid >= 0) & ~same).sum())
    counts['ground_share'] = round(float(((gid >= 0) & same).mean()), 4)
    return out, counts


def measure():
    """old against new on every block, on the pixels this tool re-laid (where the two differ): THE BLOB (the camouflage's
       size: the luminance spread left after a 3 m blur, so grain and cracks fall out and only patches the size of the
       print stay) and THE ORANGE (median saturation). Written into the kit."""
    from PIL import ImageFilter
    kit_path = os.path.join(OUT, 'COOK2_FIGHT_FLOOR_KIT.json'); kit = json.load(open(kit_path))
    rad = int(3.0 * 42.9)
    tot = dict(old_blob=[], new_blob=[], old_sat=[], new_sat=[], px=0)
    for b in sorted(kit['blocks']):
        f = 'block_%s.webp' % b.replace('.', '_')
        if not os.path.exists(os.path.join(OUT, f)): continue
        o = np.asarray(Image.open(os.path.join(SHIP, f)).convert('RGB')); n = np.asarray(Image.open(os.path.join(OUT, f)).convert('RGB'))
        ch = (o != n).any(2)
        if ch.sum() < 1000: continue
        row = {}
        for tag, a in (('old', o), ('new', n)):
            lum = (a.astype(float) @ np.array([0.299, 0.587, 0.114]))
            fill = np.where(ch, lum, lum[ch].mean())                 # the rest held at the ground's mean, so a house is not a patch
            bl = np.asarray(Image.fromarray(fill.round().clip(0, 255).astype(np.uint8), mode='L').filter(ImageFilter.BoxBlur(rad))).astype(float)
            row[tag + '_blob'] = round(float(bl[ch].std()), 2)
            hsv = S._hsv(a[ch][::7].astype(float) / 255); row[tag + '_sat'] = round(float(np.median(hsv[:, 1])), 3)
            tot[tag + '_blob'].append(row[tag + '_blob']); tot[tag + '_sat'].append(row[tag + '_sat'])
        row['px'] = int(ch.sum()); tot['px'] += row['px']
        kit['blocks'][b]['measured'] = row
        print('  measured', b, row)
    kit['measured'] = dict(how='on the re-laid pixels of every block: BLOB = luminance spread (0-255) after a 3 m box blur '
                               '(the camouflage patches survive it, grain and cracks do not); SAT = median saturation (0-1)',
                           blocks=len(tot['old_blob']), px=tot['px'],
                           old_blob_median=float(np.median(tot['old_blob'])), new_blob_median=float(np.median(tot['new_blob'])),
                           old_sat_median=float(np.median(tot['old_sat'])), new_sat_median=float(np.median(tot['new_sat'])))
    json.dump(kit, open(kit_path, 'w'), indent=1)
    print(kit['measured'])


def main(only=None):
    t0 = time.time()
    os.makedirs(os.path.join(OUT, 'materials'), exist_ok=True)
    man = json.load(open(os.path.join(SHIP, 'fight_ground.json')))
    bids = only or sorted(man['blocks'])
    skip = {b for b in bids if b.startswith('casino')}       # the casino's carpet is an interior, not the ground: left as it is
    bids = [b for b in bids if b not in skip]
    G = load_maker()
    canon(G); orig = {}
    for b in bids: orig[b] = make(G, b); print('  as it is', b, round(time.time() - t0))
    kind_now = code_everything(G); kind_now[0] = 'scrub'
    canon(G)
    ledger = {}
    for b in bids:
        kind_now[0] = b.split('.')[0]
        coded = make(G, b)
        out, counts = refloor(b, orig[b], coded, 1019 + 31 * bids.index(b))
        Image.fromarray(out).save(os.path.join(OUT, 'block_%s.webp' % b.replace('.', '_')), lossless=True, quality=100, method=4)
        ledger[b] = counts
        print('  refloored', b, counts.get('ground_share'), round(time.time() - t0))
    for g in GROUNDS:                                         # the materials, one house tile each, two variants
        for v in (0, 1):
            Image.fromarray(field(g, 515, 364, 7 + v)).save(os.path.join(OUT, 'materials', 'COOK2_FLOOR_%s_%d.png' % (g.upper(), v)))
    kit_path = os.path.join(OUT, 'COOK2_FIGHT_FLOOR_KIT.json')
    old = json.load(open(kit_path)) if (only and os.path.exists(kit_path)) else {}
    blocks = dict(old.get('blocks', {})); blocks.update(ledger)
    kit = dict(lane='cook 2', row='[the fight floor he hates]', made='10/19', rule='100 (records only), 108 (nothing drawn), 115b (the ground on the packs)',
               tile_px=man['tile_px'], px_per_metre=man['px_per_metre'], tilt='depth x cos45, NEAREST rows (the blocks own)',
               grounds={g: dict(src=['%s#%d' % (s['fam'], i) for i in s['ids']], tint=s.get('tint'), cell=s['cell'])
                        for g, s in GROUNDS.items()},
               combat2_dress_names=K_DRESS, desert_pool='DGROUND 0-3, 6 -> desert (wash: 0, 3 -> playa; shore -> playa); 4, 5 -> rough',
               left_as_is=dict(casino='the casino floor is an interior carpet, COMBAT TWO\'s; not ground'),
               how_combat_two_lays_it='swap blocks[id].src for records/target/cook2_fight_floor/block_<id>.webp after DIRECTION and his vote; or import GROUNDS/field() and dress the maker with it',
               blocks=blocks)
    json.dump(kit, open(kit_path, 'w'), indent=1)
    print('done', round(time.time() - t0), 's')


if __name__ == '__main__':
    if sys.argv[1:] == ['--measure']: measure()
    else: main(sys.argv[1:] or None); measure()
