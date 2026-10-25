#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [the clothes look real], THE OUTFIT: LAYERS THAT SHOW (rule 129 as corrected, Paolo 10/23: 'I am
concerned that you're not making the clothing good enough to look good... layering, layering'; then 'I didn't mean to
say leather, I just meant to say layers'). A person is an outfit, never one garment, on the pieces already made.

WHAT THE REAL PHOTOGRAPHS SAID AT THE GAME'S SIZE (four people scaled to 112 px tall, this lane's check, rule 82; the
links and the measures are in records/BOHEMIA_THE_CLOTHES_LOOK_REAL_LAYERS_10_23_26.md):
  1. a layer reads only if it is ANOTHER VALUE than the one over it: a light V of shirt under a dark coat, dark sleeves
     out of a light tee, a red stripe down an open tan jacket. Two layers in one colour are one garment at 112 px;
  2. what shows of the layer under is 2 to 5 pixels: the V at the neck, the stripe down an open front, a band of hem
     under a shorter layer, a cuff past a sleeve, a hood heaped over a coat's collar;
  3. every layer over another throws a shadow band on it (GARM-01), so the layers stand off each other by the cloth.
WHAT OUR PEOPLE DID (measured on RUN TWO's roll, 116 people): the shirt and the coat are both rolled inside the gang's
hue, so a coat over a shirt was one brown blob (the RUST HOODIE under the LEATHER JACKET, 79 and 69 of 255); the coat
closed over the neck and to the wrist, so nothing under it showed; and 76 of the 116 wore one top and nothing else.

THE OUTFIT (outfit(spec), decided once per person off his id, so the same person is the same outfit on every build):
  base    the layer on the skin (RUN TWO's top); under a coat it is swapped for the same garment in another value when the
          two read as one (the same cut, the next colour of the bank, a plain colour first, so the gang's colour stays on
          the outside where the street reads it);
  mid     a second top worn over the base when he wears no coat: an open shirt over a tee, a tank or a henley; his own
          shirt worn open over a plain tee; his tee or tank over a long-sleeve of another value (its sleeves and hem out
          from under); his hoodie over a longer tee whose hem shows under its band, or under an open flannel with its
          hood out over the flannel's collar;
  outer   RUN TWO's coat, worn the way people wear one: open down the front to the neck, the sleeves pushed up or ending
          short of the shirt's cuff, the hoodie's hood heaped over its collar, the shirt's collar out over its lapels,
          the shirt's tail or the hoodie's band below a jacket or a vest.
  layers  what the garment tools read (L['layers'], set by dress() inside the body tool's DRESS hook): base, mid, outer,
          each a dict of how that piece sits. The garments read it off their build's own locals, so a caller that builds a
          person (RUN TWO's builder) takes the outfit unedited.

REUSE CHECK: every garment is the GARMENTS BASE and GARMENTS OUTER piece already made (tools/bohemia_character_garments_
base.py, _outer.py), nothing new is modelled; the roll's randomness is the barber's (a string-seeded stream per person).
REFERENCE CHECK (the 9/4 standing duty): the four photographs at 1:1 (the record), the runway library's RNWY-05, 06 and 08
(every layer's hem lower than the one over it; each layer readable at the collar), GARM-01 (a shadow band under every
overhang); analog horror AH-01; no reference game.
"""
import colorsys
import json
import os
import random
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_garments_base as BASE  # noqa: E402
import bohemia_character_garments_outer as OUTER  # noqa: E402

BOOK = os.path.join(ROOT, 'records/target/character/BOHEMIA_THE_BARBERS_BOOK.json')
STEP = 40          # two layers read as two when their cloths are this many values apart (0..255, the bank's mid)
STEP_HUE = 24      # or this many apart and of clearly different hues (Leonard's red shirt in the tan jacket)
TEE_LIKE = ('TANK', 'TEE', 'LONGSLEEVE', 'HENLEY')
SHIRTS = ('BUTTON SHIRT', 'WORK SHIRT', 'FLANNEL', 'ROLLED SLEEVE')
SLEEVED = ('TRENCH', 'DUSTER', 'LONGCOAT', 'SPLIT TAIL', 'CAR COAT', 'CHORE COAT', 'JACKET', 'COCOON COAT', 'COMMA COAT',
           'WRAP COAT', 'ASYMMETRIC COAT')
# how a coat is worn open: the chance, the opening's half width at the chest (m), and the height the front opens up to
OPEN = {'JACKET': (0.80, 0.050, 1.120), 'CAR COAT': (0.65, 0.048, 1.110), 'CHORE COAT': (0.65, 0.048, 1.110),
        'LONGCOAT': (0.60, 0.046, 1.100), 'SPLIT TAIL': (0.60, 0.046, 1.100), 'DUSTER': (1.00, 0.060, 1.100),
        'TRENCH': (0.35, 0.046, 1.100), 'COCOON COAT': (0.50, 0.044, 1.100), 'COMMA COAT': (0.50, 0.044, 1.100),
        'ASYMMETRIC COAT': (0.50, 0.044, 1.100), 'VEST': (1.00, 0.056, 1.115)}
SHORT = ('JACKET', 'VEST')   # a layer under one of these drops its hem below it (RNWY-05, RNWY-08)


def lum(c):
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def hsv(c):
    return colorsys.rgb_to_hsv(*[v / 255.0 for v in c])


def apart(A, B):
    """two garments read as two layers at 112 px (what the photographs said): far enough apart in value, or apart and of
    clearly different hues; a plaid or a stripe against a plain cloth reads as its own layer by its print (a 16 cm check is
    9 px at the game's size), so a printed one needs only the smaller step"""
    a, b = A['mid'], B['mid']
    dl = abs(lum(a) - lum(b))
    if dl >= STEP: return True
    if (A.get('pattern') or B.get('pattern')) and dl >= STEP_HUE: return True
    ha, sa, _ = hsv(a); hb, sb, _ = hsv(b)
    dh = min(abs(ha - hb), 1 - abs(ha - hb))
    return dl >= STEP_HUE and dh >= 0.10 and sa >= 0.30 and sb >= 0.30


def plain(c):
    """a plain cloth (bone, ash, black, charcoal, sand): a garment or its colour"""
    return hsv(c['mid'] if isinstance(c, dict) else c)[1] < 0.25


def held():
    B = json.load(open(BOOK))
    return set(t['name'] for t in B['tops'] if t['held']), set(c['name'] for c in B['coats'] if c['held'])


def loud(G):
    """IT IS AN ECONOMIC APOCALYPSE: NO RAINBOW (rule 159, Paolo 10/24: 'there shouldn't be so much colour'): a cloth whose
    hue is a toy's in act one: a cool or a pink hue with any real colour in it (green, teal, blue, violet, rose; the rig's
    cool fill pushes them hotter still: a (70, 78, 89) slate rendered (80, 96, 144)), or a saturated bright red or gold.
    Earth (rust, brown, khaki, sand, olive) and every grey stay. Measured 10/25 (CHARACTER [the enemies' looks]): a swap
    for value put a COBALT SHIRT under a smith's apron, a bright blue body under the frame"""
    h, s_, v = hsv(G['mid'] if isinstance(G, dict) else G)
    return (s_ >= 0.30 and 80 < h * 360 < 345) or (s_ >= 0.60 and v >= 0.55)


def contrast_pick(rng, cands, against, *prefer, own=None):
    """the candidates that read apart from every garment in against; the first preference that leaves any, then the
    furthest in value, one of the best three. A swap never reaches for a loud cloth (rule 159) unless it is the wearer's
    own gang's colour (COLOUR IS TERRITORY: own); none left is None, and the layer stays as it was rolled"""
    ok = [G for G in cands if (not loud(G) or (own and own(G))) and all(apart(G, A) for A in against)]
    if not ok: return None
    best = ok
    for pf in prefer:
        b = [G for G in ok if pf(G)]
        if b: best = b; break
    best.sort(key=lambda G: (-min(abs(lum(G['mid']) - lum(A['mid'])) for A in against), G['name']))
    return rng.choice(best[:3])


# a gang's own piece stays with the gang (the Church's vestment, the Mob's pinstripe, the Trades' apron)
SIGNATURE = {'VESTMENT GOLD SHIRT': 'Church', 'MOB PINSTRIPE SHIRT': 'Mob', 'TRADES APRON': 'Trades'}


def gang_hue(gang):
    """a garment is his gang's when its cloth is the hue of one of his gang look's own cloths (RUN TWO's rule, the same
    numbers: both grey and near in value, or both coloured and near in hue)"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    L = CH.LOOKS.get(gang) or {}
    cl = [L[k]['colour'] for k in ('shirt', 'coat', 'mantle', 'cape') if isinstance(L.get(k), dict) and L[k].get('colour')]
    def same(a, b):
        ha, sa, va = hsv(a); hb, sb, vb = hsv(b)
        if sa < 0.2 or sb < 0.2: return sa < 0.2 and sb < 0.2 and abs(va - vb) < 0.22
        dh = min(abs(ha - hb), 1 - abs(ha - hb)); return dh < 0.07 and abs(va - vb) < 0.45
    return lambda G: gang != 'Body' and any(same(G['mid'], c) for c in cl)


def outfit(spec):
    """THE OUTFIT for one person (a roll entry with his gang, id, top and coat), or None when he carries no top (the
    barber's own crowd, which wears his gang's look)"""
    top, coat = spec.get('top'), spec.get('coat')
    if top not in BASE.BY: return None
    if os.environ.get('BOHEMIA_OUTFIT') == 'off': return None   # a measuring knob: the person as he was built before (the before sheet)
    gang = spec.get('gang')
    rng = random.Random('outfit:%s:%s' % (gang, spec.get('id')))
    ht, hc = held()
    ours = gang_hue(gang)
    mine = lambda g: SIGNATURE.get(g['name'], gang) == gang   # a gang's own piece stays with the gang
    Gt = BASE.BY[top]; Gc = OUTER.BY.get(coat)
    S = Gc['shape'] if Gc else None
    base, mid, why = top, None, []
    L = dict(base={}, mid={}, outer={})
    OPTS = ('sleeves', 'neck', 'cut', 'shoulder', 'hood_up', 'fn', 'bib', 'short')

    def sibling(G, against, *prefer):
        """the same top in another colour of the bank (the same cut and options, only the ramp moves)"""
        same = [g for g in BASE.BANK if g['shape'] == G['shape'] and g['name'] not in ht and mine(g) and
                all(g[k] == G[k] for k in OPTS)]
        return contrast_pick(rng, same, against, *prefer, own=ours)

    if Gc and S not in ('PONCHO', 'HOODED PONCHO'):
        # 1. UNDER A COAT: the top reads apart from it, or it becomes the same cut in another value (a plain colour first,
        # the gang's colour stays on the coat); failing that the coat does, the same coat in another colour (the gang's first)
        if not apart(Gt, Gc):
            g = sibling(Gt, [Gc], plain)
            if g:
                why.append('%s read as one with %s (%d and %d of 255): the same cut in %s (%d)' % (
                    top, coat, lum(Gt['mid']), lum(Gc['mid']), g['name'], lum(g['mid']))); base = g['name']; Gt = g
            else:
                same = [c for c in OUTER.BANK if c['shape'] == S and c['name'] not in hc and mine(c) and
                        all(c[k] == Gc[k] for k in ('len', 'vest', 'jacket', 'split', 'wrap', 'asym', 'cocoon', 'comma', 'hood', 'bibless'))]
                c = contrast_pick(rng, same, [Gt], ours, plain, own=ours)
                if c:
                    why.append('%s read as one with %s (%d and %d of 255) and no colour of that top reads apart: the same coat in %s (%d)' % (
                        top, coat, lum(Gt['mid']), lum(Gc['mid']), c['name'], lum(c['mid']))); coat = c['name']; Gc = c
                else: why.append('%s and %s read as one, and no colour of either cut reads apart' % (top, coat))
        # 2. HOW THE COAT IS WORN
        o = L['outer']; b = L['base']
        b['under'] = S
        o['lift'] = round(0.55 * base_weight(Gt), 4)          # a coat over a hoodie stands further off him than over a tank
        if S in OPEN:
            p, ohw, cz = OPEN[S]
            if rng.random() < p:
                o.update(open=True, ohw=ohw, collar_z=cz, fo_add=0.25); why.append('%s worn open to the neck' % coat)
        if Gt['neck'] == 'hood' and not Gt['hood_up'] and S in SLEEVED + ('VEST',):
            o.update(collar=False, neck_top=1.120); b['hood_over'] = round(0.016 + o['lift'], 4)
            why.append('the hood heaped over the coat\'s collar')
        elif Gt['neck'] == 'button' and o.get('open') and S in SLEEVED and rng.random() < 0.7:
            o.update(collar=False, neck_top=1.100); b['collar_out'] = round(0.016 + o['lift'], 4)
            why.append('the shirt\'s collar out over the lapels')
        if S in SHORT and Gt['fn'] == 'genTop' and Gt['cut'] != 'long' and rng.random() < (0.85 if S == 'JACKET' else 0.7):
            b['hem_drop'] = 0.050 if S == 'JACKET' else 0.040; why.append('the %s\'s hem below the %s' % (Gt['shape'].lower(), S.lower()))
        if S in SLEEVED:
            b['arms_covered'] = True
            r = rng.random()
            if Gt['sleeves'] == 'long' and Gt['fn'] == 'genTop' and r < 0.45:
                o['sleeve_to'] = 1.70; b['cuff_to'] = 1.89; why.append('the sleeve ends short of the cuff under it')
            elif r > 0.72:
                o['sleeve_to'] = 1.42; o['push'] = True; why.append('the sleeves pushed up the forearm')
    elif not Gc:
        # 3. NO COAT: a second top, so nobody is one garment; the one on the outside in his gang's colour where one reads
        shirts = [g for g in BASE.BANK if g['shape'] in SHIRTS and g['fn'] == 'genTop' and g['name'] not in ht and not g['tatter'] and mine(g)]
        tees = [g for g in BASE.BANK if g['shape'] in ('TEE', 'TANK') and g['name'] not in ht and mine(g)]
        longs = [g for g in BASE.BANK if g['shape'] in ('LONGSLEEVE', 'HENLEY') and g['sleeves'] == 'long' and g['name'] not in ht and mine(g)]
        r = rng.random()
        tee_like = Gt['shape'] in TEE_LIKE + ('TURTLENECK',) or (Gt['shape'] == 'THE RUNWAY CUTS' and Gt['cut'] != 'layered') or \
            (Gt['shape'] == 'TATTERED' and Gt['neck'] != 'button')
        shirt_like = Gt['shape'] in SHIRTS or (Gt['shape'] == 'TATTERED' and Gt['neck'] == 'button')
        if tee_like and Gt['shape'] in ('TEE', 'TANK') and not Gt['tatter'] and 0.55 <= r < 0.80:
            # his tee or tank over a long-sleeve of another value: the dark sleeves out of the light tee (the photographs'
            # strongest read at 112 px), the long-sleeve's hem a band under the tee's
            g = contrast_pick(rng, longs, [Gt], plain, own=ours)
            if g:
                mid, base = top, g['name']; Gt = g; L['base']['hem_drop'] = 0.040
                why.append('his %s over a %s, its sleeves and hem out from under' % (mid, base))
        if not mid and tee_like and r < 0.95:
            g = contrast_pick(rng, shirts, [Gt], ours, lambda g: not plain(g), own=ours)
            if g:
                mid = g['name']; why.append('an open %s over the %s' % (g['name'], top))
        elif shirt_like and r < 0.90:
            g = contrast_pick(rng, tees, [Gt], plain, own=ours)
            if g:
                mid, base = top, g['name']; Gt = g; why.append('his %s worn open over a %s' % (mid, base))
        elif Gt['shape'] == 'HOODIE' and r < 0.45:
            g = contrast_pick(rng, [t for t in tees if t['shape'] == 'TEE' and not t['pattern']], [Gt], plain, own=ours)
            if g:
                mid, base = top, g['name']; Gt = g; L['base']['hem_drop'] = 0.060
                why.append('his %s over a longer %s, its hem under the band' % (mid, base))
        elif Gt['shape'] == 'HOODIE' and r < 0.90:
            # an open flannel over his hoodie, the hood out over the shirt's collar (the street's own layering)
            g = contrast_pick(rng, [g for g in shirts if g['sleeves'] == 'long'], [Gt], ours, lambda g: bool(g['pattern']), own=ours)
            if g:
                mid = g['name']; L['base']['hood_over'] = round(base_weight(Gt) + 0.005 + 0.012, 4)
                why.append('an open %s over his %s, the hood out over its collar' % (mid, top))
        if mid:
            Gm = BASE.BY[mid]
            L['mid'] = dict(role='mid', lift=round(base_weight(Gt) + 0.005, 4), open=Gm['neck'] == 'button',
                            ohw=0.050 if Gm['neck'] == 'button' else 0.0)
            L['base']['under'] = 'mid'; L['base']['arms_covered'] = True
            if Gm['neck'] == 'button' and Gm['sleeves'] == 'long' and rng.random() < 0.4:
                L['mid']['sleeves'] = 'rolled'; why.append('its sleeves rolled')
    return dict(base=base, mid=mid, outer=coat if Gc else None, layers=L, why=why,
                was=dict(top=top, coat=spec.get('coat')) if base != top or mid or coat != spec.get('coat') else None)


def base_weight(G):
    """GARMENTS BASE's cloth weight for a top (how far it stands off the man), read the way its pieces() reads it"""
    coverall, bib = G['fn'] == 'genCoverall', G['bib']
    sleeves = 'long' if coverall and not bib else ('none' if bib else G['sleeves'])
    return 0.011 if G['neck'] == 'hood' else 0.009 if coverall else 0.005 if sleeves == 'none' else 0.007


def dress(L, O, name):
    """put the outfit on a look (in memory, inside the body tool's DRESS hook): the layers the garments read, the mid top
    as its own pieces after whatever extra() the look carries, with its own materials and print"""
    if not O: return L
    import bohemia_character_the_thirteen_through_the_rig as CH
    L['layers'] = O['layers']
    L['worn'] = dict(L.get('worn') or {})
    L['worn']['outfit'] = O['why']
    if O.get('mid'):
        Gm = BASE.at_source(BASE.BY[O['mid']])
        L['worn']['mid'] = Gm['name']
        CH.PRINTS[name] = dict(CH.PRINTS.get(name) or {})
        CH.PRINTS[name].update({'mid_' + k: v for k, v in BASE.prints(Gm).items() if not k.startswith('body:')})
        old = L.get('extra')

        def extra(X, old=old, Gm=Gm, lay=O['layers']['mid']):
            made = (old(X) or []) if old else []
            X2 = dict(X); X2['tag'] = X['tag'] + '_mid'
            f0 = X['finish']
            X2['finish'] = lambda g, colour, key, subdiv, rim: f0(g, colour, 'mid_' + key, subdiv, rim)
            t0 = X['tube']   # the body tool's hanging piece names itself and its cloth by its own tag: the mid's are its own
            X2['tube'] = lambda key, *a, **k: t0('mid_' + key, *a, **k)
            return made + BASE.pieces(Gm, X2, layer=lay)
        L['extra'] = extra
    return L


OUTFITS = os.path.join(ROOT, 'records/target/character/BOHEMIA_THE_OUTFITS.json')


def write(roll_path=os.path.join(ROOT, 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json')):
    """THE OUTFIT BOOK: every person of a roll with the outfit his build wears (the base, the mid, the coat, how each sits,
    and what moved from the roll), so a bake names what he wears and an era re-renders the same layers (rule 128)"""
    from collections import Counter
    roll = json.load(open(roll_path)); people = []; n = Counter()
    for P in roll:
        O = outfit(P)
        if not O: n['no top'] += 1; continue
        n['%d layers' % (1 + bool(O['mid']) + bool(O['outer']))] += 1
        if O['base'] != P['top']: n['top swapped for value'] += 1
        if O['outer'] != P.get('coat'): n['coat swapped for value'] += 1
        people.append(dict(id=P['id'], gang=P['gang'], base=O['base'], mid=O['mid'], outer=O['outer'],
                           rolled=dict(top=P['top'], coat=P.get('coat')), layers=O['layers'], why=O['why']))
    out = dict(what='CHARACTER [the clothes look real] THE OUTFIT BOOK (rule 129 as corrected): each person of the roll and the '
                    'layers his build wears (tools/bohemia_character_the_outfit.py outfit(), off his id; the barber builds them)',
               roll=os.path.relpath(roll_path, ROOT), counts=dict(n), people=people)
    with open(OUTFITS, 'w') as f:
        json.dump(out, f, indent=1); f.write('\n')
    print('wrote', os.path.relpath(OUTFITS, ROOT), dict(n))


if __name__ == '__main__':
    if sys.argv[1:2] == ['write']: write(); sys.exit(0)
    # the outfits of RUN TWO's roll, counted (what the build will put on each person)
    from collections import Counter
    roll = json.load(open(os.path.join(ROOT, 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json')))
    n = Counter(); out = []
    for P in roll:
        O = outfit(P)
        if not O: n['no top'] += 1; continue
        layers = 1 + bool(O['mid']) + bool(O['outer'])
        n['%d layers' % layers] += 1
        if O['base'] != P['top']: n['swapped for value'] += 1
        out.append((P['id'], O['base'], O['mid'], O['outer'], '; '.join(O['why'])))
    for r in out: print('%-14s %-22s %-22s %-22s %s' % r)
    print(dict(n))
