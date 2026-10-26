#!/usr/bin/env python3
"""EVERY TOWN SCREEN ITS OWN (COOK [every town looks its own], the settlement screen's half; rule 186(b), Paolo 10/25: 'every
settlement has to look unique and different a little bit; they can borrow from each other, especially if they're in the same
tier, but still... a settlement deep in the heart of the city should give more city vibes'). EYES 10/25w, line 106 of
records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md: 'IN THE TOWN one tier is still one picture: Cartel is the same yard as Mob and
Network... the camps (Custom, Colorful) are the same tents.'

Read off the shipped pictures (slices/settlement_ground_towns/) and the scene records beside them
(records/target/cook_town_screens/render/<town>.json), with the likeness of tools/bohemia_cook_town_screen_likeness_10_25_26.py
(0.40 colour + 0.40 form + 0.20 layout):
  1. EVERY HOME BASE HAS ITS OWN PICTURE: all fourteen the map opens (its baked bases), each its own day and night file at the
     screen's 2060 x 1092, and its tier's tap boxes to the pixel (the screen's taps land where they did).
  2. *** NO TWO TOWNS READ THE SAME ***: every pair of the fourteen under LINE.
  3. THE MEASURE BITES: the two pictures of one tier that EYES read as one picture (town_0 ~ town_1, camp_0 ~ camp_1,
     fortress_0 ~ fortress_1) score LINE or more.
  4. EACH REPLACES ITS TIER'S PICTURE: every town against both its tier's old pictures under LINE.
  5. *** THE HEART LOOKS LIKE THE CITY ***: the towns deep in it (u >= 0.6: Church, Mob, Reds) stand on buildings at least
     12 m tall that rise off the top of the picture, three or more of them; the edge's tallest building stands under 10 m (two storeys)
     (watch towers, masts, tanks and cranes aside: things, not buildings).
  6. NO RAINBOW, NEVER GREY (rule 159, 167(b)): every picture's median chroma between 2 and 16.
  7. NIGHT IS NIGHT: every night picture darker than its day (median lightness under 0.7 of the day's) with lit pools (its
     brightest 0.5% at least three times its median).
  8. THE WALK HAS ITS OUTLINES (rule 169, for RUN TWO): every picture carries its blocks, measured in the scene; the foot of
     every tap (a step below its box) is ground a person can stand on.
  Run: python3 gates/every_town_screen_its_own_gate.py
"""
import os, sys, json, itertools, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_town_screen_likeness_10_25_26 as LK

SHIP = os.path.join(R, 'slices/settlement_ground_towns')
REND = os.path.join(R, 'records/target/cook_town_screens/render')
REND2 = os.path.join(R, 'records/target/cook_town_screens/wide/render')     # the wide re-laid (10/26)
PACKS = os.path.join(R, 'slices/settlement_ground_packs')
LINE = 0.70
HEART = {'Church', 'Mob', 'Reds'}
THINGS = re.compile(r'((?<!bld_)tower|watch|guard|post|mast|tank|crane|hoist|turbine|palm|lamp|light|sign|dish|stage|truss|rig|wreck|stall|board|posts|fill_|wall|razor|fence|bunt|pad)', re.I)

ok_n = bad_n = 0


def leg(ok, what, why=''):
    global ok_n, bad_n
    if ok: ok_n += 1
    else: bad_n += 1
    print(('  ok   ' if ok else '  FAIL ') + what + ('  [' + str(why) + ']' if why != '' else ''))


def bases():
    s = open(os.path.join(R, 'slices/BOHEMIA_CITY_WORLD.html')).read()
    m = re.search(r'CT_BASES_BAKED\s*=\s*(\{.*?\});', s, re.S)
    return sorted(json.loads(m.group(1)).keys()) if m else []


def chroma(path):
    L = LK.load(path); return float(np.median(np.hypot(L[..., 1], L[..., 2]))), L


def main():
    man = json.load(open(os.path.join(SHIP, 'settlement_ground.json')))
    walk = json.load(open(os.path.join(SHIP, 'settlement_walk.json')))
    packs = json.load(open(os.path.join(PACKS, 'settlement_ground.json')))
    T = man.get('towns', {}); B = bases()
    # 1
    miss = [b for b in B if b not in T]
    files_ok = all(os.path.exists(os.path.join(SHIP, t[k])) and Image.open(os.path.join(SHIP, t[k])).size == (2060, 1092) for t in T.values() for k in ('src', 'night_src'))
    # the 10/25 wide keeps the tier's taps to the pixel; the wide re-laid out of the phone's corners (rule 213, the 10/26 composer)
    # carries its own, measured in its scene, every role of the tier
    taps_ok = all((set(t['hotspots']) == set(packs['tiers'][t['tier']]['variants'][0]['hotspots'])) if (t.get('wide') or {}).get('relaid')
                  else t['hotspots'] == packs['tiers'][t['tier']]['variants'][0]['hotspots'] for t in T.values())
    leg(len(B) >= 14 and not miss and files_ok and taps_ok, 'every home base has its own picture, day and night, its tier\'s taps (to the pixel, or re-laid and measured)',
        '%d of %d bases%s' % (len(B) - len(miss), len(B), (', missing ' + ', '.join(miss)) if miss else ''))
    cache = {n: LK.load(os.path.join(SHIP, t['src'])) for n, t in T.items()}
    old = {f: LK.load(os.path.join(PACKS, f)) for f in ('town_0.webp', 'town_1.webp', 'camp_0.webp', 'camp_1.webp', 'fortress_0.webp', 'fortress_1.webp')}
    # 2
    pairs = sorted(((LK.likeness(cache[a], cache[b])[0], a, b) for a, b in itertools.combinations(sorted(T), 2)), reverse=True)
    leg(pairs and pairs[0][0] < LINE, '*** NO TWO TOWNS READ THE SAME *** (every pair of %d under %.2f)' % (len(T), LINE),
        ', '.join('%s ~ %s %.3f' % (a, b, v) for v, a, b in pairs[:4]))
    # 3
    ctl = [(LK.likeness(old[a], old[b])[0], a, b) for a, b in (('town_0.webp', 'town_1.webp'), ('camp_0.webp', 'camp_1.webp'), ('fortress_0.webp', 'fortress_1.webp'))]
    leg(all(v >= LINE for v, a, b in ctl), 'the measure bites: the tier\'s two pictures EYES read as one score %.2f or more' % LINE,
        ', '.join('%s ~ %s %.3f' % (a[:-5], b[:-5], v) for v, a, b in ctl))
    # 4
    worst = max(((LK.likeness(cache[n], old['%s_%d.webp' % (t['tier'], k)])[0], n, k) for n, t in T.items() for k in (0, 1)), default=(1, '', 0))
    leg(worst[0] < LINE, 'each replaces its tier\'s picture: every town against both old pictures of its tier under %.2f' % LINE, 'most alike %s ~ %s_%d %.3f' % (worst[1], T.get(worst[1], {}).get('tier'), worst[2], worst[0]))
    # 5
    meta = {n: json.load(open(os.path.join(REND2 if (t.get('wide') or {}).get('relaid') else REND, t['src'][:-5] + '.json'))) for n, t in T.items()}
    def bldgs(n): return [o for o in meta[n]['outlines'] if not THINGS.search(o['name'])]
    heart = {n: [o for o in bldgs(n) if o['h'] >= 12 and o['box'][1] <= 0] for n in T if n in HEART}
    edge = {n: max([o['h'] for o in bldgs(n)] or [0]) for n in T if T[n].get('u', 0) < 0.3}
    leg(len(heart) == 3 and all(len(v) >= 3 for v in heart.values()) and edge and max(edge.values()) < 10.0,
        '*** THE HEART LOOKS LIKE THE CITY ***: three or more buildings 12 m and up off the top of every heart town; the edge\'s tallest building under 10 m',
        'heart ' + ', '.join('%s %d' % (n, len(v)) for n, v in heart.items()) + '; edge tallest ' + ', '.join('%s %.1f' % (n, h) for n, h in sorted(edge.items(), key=lambda x: -x[1])[:3]))
    # 6
    ch = {n: chroma(os.path.join(SHIP, t['src']))[0] for n, t in T.items()}
    leg(all(2 <= c <= 16 for c in ch.values()), 'no rainbow, never grey: every picture\'s median chroma between 2 and 16',
        'least %s %.1f, most %s %.1f' % (min(ch, key=ch.get), min(ch.values()), max(ch, key=ch.get), max(ch.values())))
    # 7
    bad = []
    for n, t in T.items():
        d, nn = LK.load(os.path.join(SHIP, t['src']))[..., 0], np.asarray(Image.open(os.path.join(SHIP, t['night_src'])).convert('L'), np.float32)
        nl = LK.load(os.path.join(SHIP, t['night_src']))[..., 0]
        if not (np.median(nl) < 0.7 * np.median(d) and np.percentile(nn, 99.5) >= 3 * max(1.0, np.median(nn))): bad.append(n)
    leg(not bad, 'night is night: darker than the day, its lamps and fires in pools', ', '.join(bad) if bad else 'all %d' % len(T))
    # 8
    nob, stuck = [], []
    for n, t in T.items():
        bl = walk.get('pictures', {}).get(t['src'], {}).get('blocks', [])
        if len(bl) < 8: nob.append(n); continue
        for k, h in t['hotspots'].items():
            b = h['box']; x, y = (b[0] + b[2]) / 2, min(1091, b[3] + 14)
            if any(q[0] <= x <= q[2] and q[1] <= y <= q[3] for q in bl): stuck.append('%s %s' % (n, k))
    leg(not nob and not stuck, 'the walk has its outlines (measured in the scene) and a person can stand at the foot of every tap',
        ('no outlines: ' + ', '.join(nob) + ' ' if nob else '') + ('feet on a block: ' + ', '.join(stuck[:6]) if stuck else 'every tap\'s foot clear'))
    print('EVERY TOWN SCREEN ITS OWN: %d ok, %d failed' % (ok_n, bad_n))
    return 1 if bad_n else 0


if __name__ == '__main__':
    sys.exit(main())
