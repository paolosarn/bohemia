#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [every old asset into the new look]: THE PLAYER'S FIRST LOOK ON THE 3D MAN (10/23/26; rule 121(e):
'EVERYTHING IS A 3D MODEL NOW... WTF TRYING TO COMBINE THE TWO'; rule 121(l): 'all the 2D assets made into 3D assets';
rule 123: no card).

THE GAP: the player's first look is the paper doll (the alpha's PD_DATA): seven painted layers, the only clothes in the
game that were never in the GARMENTS table, so every 3D batch passed them by. Six are clothes and are built here, each
read off the paper doll's own ramp (PD_DATA.ramps, its skin steps left out, the darkest step the dark, the lightest the
light), never edited:
    COWL HOODIE              (shirt/cowl-hoodie)            BASE 1's hoodie, its hood down, and GEAR 1's cowl round the neck
    FUZZ JACKET              (jacket/japanese-fuzz_hoodDown) OUTER 1's jacket, its cloth shagged 2 mm either way (fuzz)
    LEATHER LEGWARMER PANTS  (pants/leather-legwarmer)      slim leather and knit warmers bunched up the shins (LEGS 1)
    RUNWAY SNEAKERS          (shoes/balenciaga)             a laced sneaker on a stacked sole (LEGS AND FEET 1)
    DURAG                    (hat/durag)                    HATS 1's head wrap, tied, its tails down the back
    SHADES                   (glasses/shades)               EYEWEAR 1's wraparounds
The seventh, his painted CURTAIN BOB (hair/curtain-bob), is his own and stays his (the roll call's note); the barber's
CURTAIN CUT is the nearest sculpt and the bob is never re-cut as a new shape (CHIN BOB is in the graveyard).

THE PLAYER'S OWN: none of the six enters the crowd's roll; the player's look is his, the way his first look always was.
Built whole on the barber's mannequin: build FIRST (the barber); any screen that draws the player in 3D builds from it.

REUSE CHECK: every piece is BASE 1's, OUTER 1's, GEAR 1's, LEGS AND FEET 1's, HATS 1's or EYEWEAR 1's, called with the
paper doll's colours; the man and his lift are this lane's tool; the render is DIRECTION's master rig.
REFERENCE CHECK (the 9/4 standing duty): the twin is the paper doll itself (PD_DATA, five facings); the runway names
(Rick Owens, Balenciaga, Bottega Veneta) are the paper doll's own; analog horror AH-01; no reference game.
"""
import json
import math
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_garments_base as BASE  # noqa: E402
import bohemia_character_garments_outer as OUTER  # noqa: E402
import bohemia_character_garments_legs as LEGS  # noqa: E402
import bohemia_character_garments_gear as GEAR  # noqa: E402
import bohemia_character_hats_one as HATS_ONE  # noqa: E402
import bohemia_character_eyewear_one as EYE_ONE  # noqa: E402

ALPHA = os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html')
RIG_DIR = os.path.join(ROOT, 'records/character/rig')
LABEL = 'THE FIRST LOOK'


def ramps():
    s = open(ALPHA).read(); i = s.find('const PD_DATA = {')
    pd = json.loads(s[i + len('const PD_DATA = '):s.find('\n', i)].rstrip().rstrip(';'))
    skin = set(tuple(c) for c in pd['ramps']['skin'])
    out = {}
    for k, steps in pd['ramps'].items():
        st = sorted((tuple(c) for c in steps if tuple(c) not in skin), key=BASE.lum)
        if not st: continue
        mid = st[len(st) // 2] if len(st) > 2 else st[-1]
        lt = st[-1] if len(st) > 1 else tuple(min(255, int(v * 1.6) + 8) for v in st[0])
        out[k] = dict(dk=st[0], mid=mid, lt=lt if lt != mid else tuple(min(255, int(v * 1.5) + 10) for v in mid))
    return out


R = ramps()
# the roll call's plain names (tools/bohemia_character_the_roll_call.py PLAIN), the layer they come from
LAYER = {'COWL HOODIE': 'shirt/cowl-hoodie', 'FUZZ JACKET': 'jacket/japanese-fuzz_hoodDown', 'LEATHER LEGWARMER PANTS': 'pants/leather-legwarmer',
         'RUNWAY SNEAKERS': 'shoes/balenciaga', 'DURAG': 'hat/durag', 'SHADES': 'glasses/shades'}
BY = {n: dict(name=n, layer=l, **R[l]) for n, l in LAYER.items()}
HELD = {n: "the player's own: his first look is his, never the crowd's roll" for n in BY}   # 3D, never rolled
HIS_OWN = {'CURTAIN BOB': "his painted curtain bob stays his (the roll call); CHIN BOB is in the graveyard, so no new bob is cut"}

# the head pieces ride the barber's head tools: registered here (in memory) under their own names, never in HATS 1's or
# EYEWEAR 1's lists, so the crowd's roll never draws them
HATS_ONE.CUTS['HAT DURAG'] = dict(tag='hat_durag', hat='DURAG', shape='wrap', cloth=BY['DURAG']['mid'], bank=dict(ramp='H_BLK', vol=0, side=0.36, front=0.16),
                                  hair=('cloth_black', 0), zcap=1.0, worn_by="the player's first look")
EYE_ONE.CUTS['FACE SHADES'] = dict(tag='face_shades', piece='SHADES', shape='shades', cloth=BY['SHADES']['mid'], bank=dict(ramp='H_BLK', vol=0, side=0.36, front=0.16),
                                   hair=('cloth_black', 0), zcap=1.0, worn_by="the player's first look")
CUTS = {'FIRST LOOK': dict(tag='first_look', body='records/character/rig/f_first_look.glb', hair_cut='CURTAIN CUT', hat='HAT DURAG',
                           eyewear='FACE SHADES', bank=dict(ramp='H_BLE', vol=0, side=0.78, front=0.42), hair=('clay_bone', 2), zcap=1.0,
                           worn_by="the player's first look (the paper doll)")}
ORDER = ['FIRST LOOK']


def garments():
    """the four clothes as the garment modules take them (their own keys, the paper doll's colours)"""
    h = BY['COWL HOODIE']; j = BY['FUZZ JACKET']; p = BY['LEATHER LEGWARMER PANTS']; s = BY['RUNWAY SNEAKERS']
    top = dict(name='COWL HOODIE', tag='first_cowl_hoodie', fn='genTop', ramp='PD', sleeves='long', neck='hood', pattern=None, tatter=False,
               shoulder=None, cut=None, pocket=True, hood_up=False, bib=False, short=False, pockets=False, shape='HOODIE',
               mid=h['mid'], dk=h['dk'], lt=h['lt'])
    cowl = dict(name='COWL HOODIE', tag='kit_first_cowl', slot='neck', kind='cowl', words=['COWL'], mid=h['mid'], dk=h['dk'], lt=h['lt'])
    coat = dict(name='FUZZ JACKET', tag='outer_first_fuzz_jacket', fn='genCoat', ramp='PD', len=0.3, vest=False, jacket=True, split=False,
                wrap=False, asym=False, cocoon=False, comma=False, hood=False, bibless=False, words=['FUZZ', 'JACKET'], shape='JACKET',
                mid=j['mid'], dk=j['dk'], lt=j['lt'])
    legs = dict(name='LEATHER LEGWARMER PANTS', slot='legs', tag='legs_first_legwarmers', fn='genPants', cut=None, shaft=None, sole_kind=None,
                words=['LEATHER', 'LEGWARMER', 'PANTS'], shape='LEGWARMERS', mid=p['mid'], dk=p['dk'], lt=p['lt'], sole=p['dk'])
    feet = dict(name='RUNWAY SNEAKERS', slot='feet', tag='feet_first_runway_sneakers', fn='genShoes', cut=None, shaft=None, sole_kind='stack',
                words=['RUNWAY', 'SNEAKERS'], shape='RUNWAY SNEAKERS', mid=s['mid'], dk=s['dk'], lt=s['lt'], sole=s['dk'])
    return top, cowl, coat, legs, feet


def dress(L):
    """the player's first look on a look (in memory): the hoodie, the cowl, the fuzz jacket, the legwarmer pants, the sneakers"""
    top, cowl, coat, legs, feet = [BASE.at_source(G) for G in garments()]
    L['shirt'] = dict(colour=top['mid'], sleeve='long'); L.pop('coat', None)
    L['trousers'] = dict(colour=legs['mid'], wide=0.0, crop=0.0)
    L['shoes'] = dict(colour=feet['mid'], kind='sneaker', top=LEGS.SHOE['RUNWAY SNEAKERS'][1])
    L['worn'] = dict(L.get('worn') or {}, base='COWL HOODIE', outer='FUZZ JACKET', legs='LEATHER LEGWARMER PANTS', feet='RUNWAY SNEAKERS',
                     neck='COWL HOODIE', head='DURAG', face='SHADES')
    old = L.get('extra')

    def extra(X, old=old):
        made = list((old(X) or []) if old else [])
        made += BASE.pieces(top, X)
        jk = OUTER.pieces(coat, X)
        for o in jk:   # THE FUZZ: the jacket's cloth shagged 2 mm either way along its normal, a fixed hash a vertex
            if o is None or not o.name.endswith('_coat'): continue
            for i, v in enumerate(o.data.vertices):
                h = (((i * 2654435761) & 0xffffffff) / 4294967296.0) - 0.5
                v.co = v.co + v.normal * (0.004 * h)
        made += jk
        made += GEAR.pieces([cowl], X, over=0.022)
        made += LEGS.pieces(legs, feet, X)
        return made
    L['extra'] = extra
    return L


def body(cut):
    """the barber's mannequin in the player's first look: THIS LANE's body tool builds LOOKS 'F_FIRST_LOOK' (in memory)"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    L = dict(CH.LOOKS['Body']); L = {k: (dict(v) if isinstance(v, dict) else v) for k, v in L.items()}
    L['hair'] = dict(style='taper', colour=CH.HAIR_DARK); L['order'] = 104
    L['shape'] = "the barber's mannequin in the player's first look (the paper doll, in 3D)"
    dress(L)
    CH.LOOKS['F_FIRST_LOOK'] = L
    CH.build('F_FIRST_LOOK', RIG_DIR)


if __name__ == '__main__':
    print(json.dumps({n: dict((k, v) for k, v in G.items() if k in ('layer', 'dk', 'mid', 'lt')) for n, G in BY.items()}, indent=1))
