#!/usr/bin/env python3
"""EVERY TOWN TALL AND WIDE (COOK [every town built for tall and wide], rule 220(f); Paolo 10/26: 'a settlement has to be made to
be ... 9 x 16 ... and then it has to be able to get flipped into 16 x 9 ... the settlement will damn look exactly the same ...
slightly alter the location and the entrance, buildings and stuff'). Line 142 of his list.

Read off what ships (slices/settlement_ground_towns/: the pictures, settlement_ground.json's towns[name].wide and .tall,
settlement_walk.json) and the scenes' own measure beside them (records/target/cook_town_screens/render/ and tall/render/):
  1. *** EVERY TOWN BOTH WAYS ***: all fourteen home bases have a WIDE (2060 x 1092) and a TALL (1024 x 1820) picture, day and
     night, each with every tap its tier's screen opens (the hotspots and the boxes ARMSBOX, LOTBOX, BUILDBOX and LOOKBOX held),
     its doors and its entrance, and the walk's blocks for every picture.
  2. *** THE SAME BUILDINGS ***: every building and landmark built in the WIDE scene is built in the TALL one (the same builder,
     the same name), but for the filler blocks a narrow frame has no room for, named here with why.
  3. NEVER A CROP, NEVER BARS: every picture is town to its four edges (no flat band at any edge), and the TALL is composed, not
     cut: its things stand where the WIDE's do not (the composition moved them).
  4. *** NOTHING HE TAPS AND NO KEEPER UNDER THE PHONE *** (rules 213, 279: the phone in a bottom corner, left or right; UI TWO's
     phone 124 x 276 points, 0.9 on its side, 1.25 on a computer; the town fitted to the screen): no tap's middle and no door a
     keeper stands at in the zone the composer names (ZONE: upright the bottom three tenths at the outer four tenths; sideways the
     bottom two thirds at the outer tenth), either side; the TALL and the WIDE (re-laid).
  5. *** EVERY DOOR ON GROUND HE CAN WALK *** (rule 220(c), 169): from the entrance, over the composed ground (the picture less
     its blocks), every door of both compositions is reached.
  6. TURNING KEEPS HIM BY THE SAME BUILDING: every role's door is in both compositions, and the entrance is on the same side.
  7. NO TWO TOWNS ALIKE, BOTH WAYS: every pair of TALL pictures under 0.70 likeness (the 10/25 measure), as the WIDE pairs are.
  8. RECOGNISABLY THE SAME TOWN: each town's own WIDE is among the three nearest its TALL in colour (the three concrete heart
     towns are near each other by nature; the buildings themselves are leg 2).
  9. NIGHT IS NIGHT: every TALL night picture darker than its day with lit pools.
  Run: python3 gates/every_town_tall_and_wide_gate.py
"""
import os, sys, json, itertools, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_town_screen_likeness_10_25_26 as LK
from bohemia_cook_every_town_tall_and_wide_10_26_26 import reach, in_zone, ZONE   # the composed ground's walk and the phone's corner (the composer's own)

SHIP = os.path.join(R, 'slices/settlement_ground_towns')
WREND = os.path.join(R, 'records/target/cook_town_screens/render')            # the 10/25 wide scenes
WREND2 = os.path.join(R, 'records/target/cook_town_screens/wide/render')     # the wide re-laid
TREND = os.path.join(R, 'records/target/cook_town_screens/tall/render')
LINE = 0.70
SIZE = {'wide': (2060, 1092), 'tall': (1024, 1820)}
ROLES = {'town': (['barber', 'clinic', 'stall', 'posts', 'board'], ['bar', 'smith', 'armourer', 'lot', 'build', 'look']),
         'fortress': (['clinic', 'barber', 'stall', 'board', 'posts'], ['smith', 'armourer', 'bar', 'lot', 'build', 'look']),
         'camp': (['clinic', 'barber', 'stall', 'posts', 'board'], ['arms', 'bar', 'lot', 'build', 'look'])}
# what the upright frame has no room for: filler blocks, never a tap, never the town's landmark
DROPPED = {'Church': {'east': 'a nine-storey office block filling the wide frame\'s right end; the upright row holds the three blocks he taps'},
           'Reds': {'east': 'a six-storey shop block at the wide frame\'s right end; the upright row holds the three he taps and the bank'},
           'Mob': {'west': 'a nine-storey office block at the wide frame\'s left end; upright, the casino tower stands behind the row in its place'},
           'Cartel': {'row_b': 'the second storage row; upright, one row runs the whole width behind the yard'},
           'Network': {'dish2': 'a third dish; upright, two stand in the yard\'s front'},
           'Colorful': {}, 'Custom': {}, 'Homeless': {}, 'Trades': {}, 'Volunteers': {}}
PROPS = re.compile(r'^(fill_|wreck|rubble|cart|dumpster|tyres|drums|oil_drum|sandbags|cover_jersey|cover_pump|barrier|bales|crates|tent|lamp|streetlight|'
                   r'palm|patrol|container_|heap|shed|propane|graveyard_|rolled|corral|mattress|blocks|tarp\d|semi|rig|dozer|trailer|soup|reels|jugs|'
                   r'cots|generator|bladder|welding|doors|marquee|coop_awning|bunt|pad|mural2|squat_mural|bld_motel_sign|thing|fire|posts|stall|board)')

ok_n = bad_n = 0


def leg(ok, what, why=''):
    global ok_n, bad_n
    if ok: ok_n += 1
    else: bad_n += 1
    print(('  ok   ' if ok else '  FAIL ') + what + ('  [' + str(why) + ']' if why != '' else ''))


def flat_edge(a):
    """a band of one flat colour at an edge: a bar, or a crop's empty side"""
    g = a.mean(-1)
    for band in (g[:6], g[-6:], g[:, :6], g[:, -6:]):
        if band.std() < 2.5 or band.mean() < 4: return True
    return False


def main():
    man = json.load(open(os.path.join(SHIP, 'settlement_ground.json')))
    walk = json.load(open(os.path.join(SHIP, 'settlement_walk.json')))['pictures']
    s = open(os.path.join(R, 'slices/BOHEMIA_CITY_WORLD.html')).read()
    names = sorted(json.loads(re.search(r'CT_BASES_BAKED\s*=\s*(\{.*?\});', s, re.S).group(1)).keys())
    towns = man.get('towns', {})
    # 1
    miss = []
    for n in names:
        e = towns.get(n) or {}
        for comp in ('wide', 'tall'):
            c = e.get(comp)
            if not c: miss.append(n + ' no ' + comp); continue
            hr, br = ROLES[e.get('tier', 'town')]
            for f in (c['src'], c['night_src']):
                p = os.path.join(SHIP, f)
                if not os.path.exists(p): miss.append(n + ' ' + f); continue
                if Image.open(p).size != SIZE[comp]: miss.append(n + ' ' + f + ' size')
                if f not in walk or not walk[f]['blocks']: miss.append(n + ' walk ' + f)
            for r in hr:
                if r not in c['hotspots']: miss.append(n + ' ' + comp + ' hot ' + r)
            for r in br:
                if r not in c['boxes']: miss.append(n + ' ' + comp + ' box ' + r)
            if not c.get('entrance') or not c.get('doors'): miss.append(n + ' ' + comp + ' door/entrance')
    leg(not miss and len(names) == 14, '*** EVERY TOWN BOTH WAYS ***: fourteen home bases, a wide and an upright picture each, day and night, every tap, door, entrance and walk',
        '; '.join(miss[:6]) if miss else '%d towns x 2 compositions x 2 times of day' % len(names))
    # 2
    lost = []
    for n in names:
        slug = n.lower()
        wr = WREND2 if ((towns.get(n) or {}).get('wide') or {}).get('relaid') else WREND
        try: W = json.load(open(os.path.join(wr, slug + '.json'))); T = json.load(open(os.path.join(TREND, slug + '.json')))
        except Exception as ex: lost.append(n + ' no scene record'); continue
        wn = {o['name'].split('.')[0] for o in W['outlines'] if not PROPS.match(o['name'])}
        tn = {o['name'].split('.')[0] for o in T['outlines']}
        for k in sorted(wn - tn):
            if k not in DROPPED.get(n, {}): lost.append(n + ' ' + k)
    leg(not lost, '*** THE SAME BUILDINGS ***: every building and landmark of the wide scene is built in the upright one (the filler blocks the narrow frame has no room for named, with why)',
        '; '.join(lost[:8]) if lost else 'dropped: ' + ', '.join('%s %s' % (n, k) for n, d in DROPPED.items() for k in d))
    # 3
    bars, uncut = [], 0
    for n in names:
        e = towns.get(n) or {}
        for comp in ('wide', 'tall'):
            c = e.get(comp)
            if not c: continue
            a = np.asarray(Image.open(os.path.join(SHIP, c['src'])).convert('RGB')).astype(float)
            if flat_edge(a): bars.append(n + ' ' + comp)
        if e.get('tall') and e.get('wide'):
            th, wh = e['tall']['hotspots'], e['wide']['hotspots']
            moved = 0
            for r in th:
                if r not in wh: continue
                tb, wb = th[r]['box'], wh[r]['box']
                tx = 30 + ((tb[0] + tb[2]) / 2 - 512) / 42.917; wx = 30 + ((wb[0] + wb[2]) / 2 - 1030) / 42.917
                if abs(tx - wx) > 2.0: moved += 1
            uncut += moved > 0
    leg(not bars and uncut == len(names), 'never a crop, never bars: every picture is the town to its four edges, and every upright town is composed (its taps moved), not cut from the wide',
        ('flat edge: ' + ', '.join(bars[:6])) if bars else '%d of %d upright towns re-laid' % (uncut, len(names)))
    # 4
    under = []
    for n in names:
        c = (towns.get(n) or {}).get('tall')
        if not c: continue
        W, H = c['px']
        for r, v in list(c['hotspots'].items()) + list(c['boxes'].items()):
            b = v['box'] if isinstance(v, dict) else v
            if in_zone(((b[0] + b[2]) / 2, (b[1] + b[3]) / 2), 'tall', W, H): under.append('%s %s' % (n, r))
        under += ['%s %s\'s keeper' % (n, r) for r, p in c['doors'].items() if in_zone((p[0], p[1] + 10), 'tall', W, H)]
    leg(not under, '*** NOTHING HE TAPS AND NO KEEPER UNDER THE PHONE *** (rules 213, 279): in every upright town, the phone either side', ', '.join(under[:8]) if under else 'every tap clear of both bottom corners')
    side = []
    for n in names:
        c = (towns.get(n) or {}).get('wide')
        if not c: continue
        W, H = c['px']
        for r, v in list(c['hotspots'].items()) + list(c['boxes'].items()):
            b = v['box'] if isinstance(v, dict) else v
            if in_zone(((b[0] + b[2]) / 2, (b[1] + b[3]) / 2), 'wide', W, H): side.append('%s %s' % (n, r))
        side += ['%s %s\'s keeper' % (n, r) for r, p in c['doors'].items() if in_zone((p[0], p[1] + 10), 'wide', W, H)]
    leg(not side, 'sideways too (rules 213, 279): in every wide town no tap and no keeper under the phone, either side (the wide re-laid)', ', '.join(side[:8]) if side else 'every tap clear of both bottom corners')
    # 5, 6
    cut, same = [], []
    for n in names:
        e = towns.get(n) or {}
        for comp in ('wide', 'tall'):
            c = e.get(comp)
            if not c: continue
            W, H = c['px']
            for sd in ('left', 'right'):                  # he may walk in from either end (RUN's any side is the door, rule 186(a))
                r = reach(W, H, walk.get(c['src'], {}).get('blocks', []), c['entrance'].get(sd, c['entrance']['at']), c['doors'])
                cut += ['%s %s %s from the %s' % (n, comp, k, sd) for k, v in r.items() if not v]
        if e.get('tall') and e.get('wide'):
            if set(e['tall']['doors']) != set(e['wide']['doors']) or e['tall']['entrance']['side'] != e['wide']['entrance']['side']: same.append(n)
    leg(not cut, '*** EVERY DOOR ON GROUND HE CAN WALK ***: from either end of the street over the composed ground (less its blocks), every door of both compositions', ', '.join(cut[:8]) if cut else 'every door reached, both ways')
    leg(not same, 'turning keeps him by the same building: every role\'s door in both compositions, the entrance on the same side', ', '.join(same) if same else 'all fourteen')
    # 7
    T = {n: (towns.get(n) or {}).get('tall') for n in names}
    L = {n: LK.lab(np.asarray(Image.open(os.path.join(SHIP, c['src'])).convert('RGB').resize(LK.SMALL, Image.BILINEAR))) for n, c in T.items() if c}
    worst = max((LK.likeness(L[a], L[b])[0], a, b) for a, b in itertools.combinations(sorted(L), 2)) if len(L) > 1 else (1, '', '')
    leg(len(L) == 14 and worst[0] < LINE, 'no two towns alike, both ways: every pair of upright pictures under %.2f (the 10/25 measure)' % LINE, 'most alike %s ~ %s %.3f' % (worst[1], worst[2], worst[0]))
    # 8
    off = []
    for n in names:
        e = towns.get(n) or {}
        if not e.get('tall'): continue
        ht = LK.hist(LK.load(os.path.join(SHIP, e['tall']['src'])))
        mine = None; near = []
        for m in names:
            w = (towns.get(m) or {}).get('wide')
            if not w: continue
            v = float(np.minimum(ht, LK.hist(LK.load(os.path.join(SHIP, w['src'])))).sum())
            if m == n: mine = v
            else: near.append(v)
        rank = 1 + sum(1 for v in near if v > mine)
        if rank > 3: off.append('%s: its own wide %d of 14' % (n, rank))
    leg(not off, 'recognisably the same town: every upright picture\'s own wide among the three nearest it in colour (the heart\'s three concrete towns sit near each other by nature)', ', '.join(off[:6]) if off else 'all fourteen')
    # 9
    dull = []
    for n in names:
        c = (towns.get(n) or {}).get('tall')
        if not c: continue
        d = np.asarray(Image.open(os.path.join(SHIP, c['src'])).convert('L')).astype(float)
        g = np.asarray(Image.open(os.path.join(SHIP, c['night_src'])).convert('L')).astype(float)
        if not (np.median(g) < 0.7 * np.median(d) and np.percentile(g, 99.5) > 3 * max(1, np.median(g))): dull.append(n)
    leg(not dull, 'night is night: every upright night darker than its day, with lit pools', ', '.join(dull) if dull else 'all fourteen')
    print('EVERY TOWN TALL AND WIDE: %d ok, %d failed' % (ok_n, bad_n))
    return 1 if bad_n else 0


if __name__ == '__main__':
    sys.exit(main())
