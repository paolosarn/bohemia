#!/usr/bin/env python3
"""EVERY BEAST ITS OWN OUTLINE (BEASTS 2, 11/3/26; rule 345 AMENDED (f), ask line 381; Paolo 11/3: 'maybe the beasts can look better,
the lab beasts that got out, everything's looking like a fucking coyote'). A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.

MEASURED BEFORE THIS GATE: every rig beast was the Khronos Fox's one mesh stretched; the fight drew three dog pictures (the dire wolf,
the cave hyena on the fox, the feral dog) and any beast kind with no picture fell back to the dire wolf; every beast job dealt the
same wolf-and-hyena mix anywhere; and the map's beast pictures had their sizes typed in, which went stale and cut the wolf across two
cells. Each leg below is one of those, so none can come back quietly:

  B1 EVERY BEAST THE FIGHT CAN DEAL HAS ITS OWN PICTURE: every beast kind a beast party can deal (records/target/bb/ours.json
     enemy_tiers.mix of every beast faction, and records/target/bb/bohemia_enemies.json mix of its beast factions) has a sheet named
     (ours.json beast_rig_looks, or its row's beast.rig), the sheet is in slices/fight_rig/fight_rig.json and on disk: nothing falls
     back to the dire wolf.
  B2 NO TWO ANIMALS SHARE ONE SHEET: two kinds share a sheet only when they are the same animal (VARIANTS: a frenzied or armoured or
     goblin's wolf is a wolf).
  B3 EVERY PAIR DIFFERS BY OUTLINE: each sheet's standing picture, facing E (the side the eye reads an animal by) and SE, its alpha
     only (the silhouette, never the colour), cut to its own box and scaled to one height (a SHAPE, not a size: his complaint was a
     bull shaped like a coyote, and a stretched fox is a fox at any size), set bottom-centre; the outline distance is
     1 - overlap / union, the mean of the two facings. Every pair of different animals must be at least FLOOR apart. The floor is
     MEASURED, not guessed (11/3): the old fox-reshaped cast (the WAS rows, slices/vote/beasts_was/, SE) had its closest pair at 0.16
     (the dire wolf and the feral dog, near one shape); the rebuilt cast's closest is 0.23 (the cave hyena and the sabre-tooth). The
     floor 0.20 sits between; the control leg below proves the old cast still fails it, so the instrument measures something.
  B4 NO PLACE IS ONLY CANIDS: every ground's beast table (records/target/BOHEMIA_JOB_KINDS.json beasts_by_ground) holds a beast that
     is not a dog, a wolf or a coyote; every faction named there has its party (bohemia_enemies.json mix) and its picture (beast_looks).
  B5 THE MAP READS THE SIZES: slices/bohemia_job_kinds.js types no beast cell size (no 'w: 107' table); it reads the fight's index.
  B6 THE MARK READS FROM THE FIGHT'S CAMERA (rule 345 amended (d), rule 359 (2)): every lab beast's collar plate and the bull's and
     the hog's farm tag, hi-vis yellow-green (green over red, far over blue: no coat is that colour), shows at least MARK_PX pixels
     in the fight's own sheet (the standing picture) in at least MARK_FACINGS of the eight facings. MEASURED BEFORE: the ear tags
     rendered 0 to 3 dull pixels and the sheet's 64 colours merged them into the coat; the unmarked rows (slices/vote/beasts_was/
     *_unmarked.webp) are the plant that must fail.
  B7 EVERY BEAST LIVES AT A WATER (rule 359 (3)): every beast faction in bohemia_enemies.json names its waters (water.by_faction),
     each one a water the valley has (water.kinds), so WORLD can put it there.
PLANTED FIRST: each leg is run on a planted fault and must refuse it (a shared sheet, a kind with no picture, a canid-only ground,
two identical outlines, a typed size).
    python3 gates/every_beast_its_own_outline_gate.py
"""
import json, os, re, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda p: json.load(open(os.path.join(ROOT, p)))
FLOOR = 0.20
SHAPE_H = 64   # every silhouette is scaled to this height before the compare: a shape, not a size (a big coyote is still a coyote)
VARIANTS = [{'direwolf', 'frenzied_direwolf', 'wolf', 'goblin_wolf'}, {'hyena', 'frenzied_hyena'}, {'wardog', 'armored_wardog', 'warhound'}]
CANIDS = {'wolves', 'dogs', 'coyotes'}
MARKED = ['beast_dire_wolf', 'beast_cave_hyena', 'beast_camelops', 'beast_short_faced_bear', 'beast_ground_sloth', 'beast_sabre_tooth',
          'beast_american_lion', 'beast_ancient_bison', 'beast_ice_age_horse', 'beast_feral_bull', 'beast_feral_hog']
MARK_PX, MARK_FACINGS = 6, 4
passed = failed = 0


def leg(ok, what, why=''):
    global passed, failed
    passed += bool(ok); failed += (not ok)
    print(('  ok   ' if ok else '  FAIL ') + what + (('  [' + why + ']') if why else ''))


def same_animal(a, b):
    return a == b or any(a in v and b in v for v in VARIANTS)


def beast_kinds(ours, ne):
    """every kind a beast party can deal, and the sheet each is drawn from"""
    tiers = ours['enemy_tiers']['value']['mix']; beast_f = {f for f, v in ne['factions'].items() if v.get('beast')} | {'beasts'}
    kinds = set()
    for f, phases in list(tiers.items()) + list(ne['mix'].items()):
        if f in beast_f:
            for ph in phases.values(): kinds |= set(ph)
    m = dict(ours.get('beast_rig_looks', {}).get('value', {}))
    for r in ne['rows']:
        if r.get('beast', {}).get('rig'): m[r['id']] = r['beast']['rig']
    return kinds, m


def b1(kinds, m, index):
    bad = [k for k in sorted(kinds) if k not in m or m[k] not in index['looks'] or not os.path.exists(os.path.join(ROOT, 'slices/fight_rig', index['looks'][m[k]]['file']))]
    return bad


def b2(m):
    by = {}
    for k, s in m.items(): by.setdefault(s, []).append(k)
    return [(s, ks) for s, ks in by.items() if any(not same_animal(a, b) for a in ks for b in ks)]


def mask(sheet, L, row, col=0):
    a = np.asarray(sheet.crop((col * L['w'], row * L['h'], (col + 1) * L['w'], (row + 1) * L['h'])).convert('RGBA'))[..., 3] > 40
    return a, L['foot']


def shape(m):
    """the silhouette cut to its own box and scaled to SHAPE_H high"""
    a = m[0]; ys, xs = np.where(a)
    if not len(ys): return np.zeros((SHAPE_H, 1), bool)
    a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]; k = SHAPE_H / a.shape[0]
    return np.asarray(Image.fromarray((a * 255).astype(np.uint8)).resize((max(1, round(a.shape[1] * k)), SHAPE_H), Image.BILINEAR)) > 127


def dist(m1, m2):
    """1 - overlap/union of two shapes, each at one height, set bottom-centre"""
    a, b = shape(m1), shape(m2); W = max(a.shape[1], b.shape[1])
    A = np.zeros((SHAPE_H, W), bool); Bm = np.zeros((SHAPE_H, W), bool)
    A[:, (W - a.shape[1]) // 2:(W - a.shape[1]) // 2 + a.shape[1]] = a; Bm[:, (W - b.shape[1]) // 2:(W - b.shape[1]) // 2 + b.shape[1]] = b
    u = (A | Bm).sum()
    return 1.0 - (A & Bm).sum() / u if u else 0.0


def b3(sheets, index):
    """sheets: {name: (Image, look)} -> the pairs under the floor and the closest pair"""
    dirs = index['dirs']; rows = [dirs.index('E'), dirs.index('SE')]
    M = {n: [mask(im, L, r) for r in rows] for n, (im, L) in sheets.items()}
    names = sorted(M); out = []
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            d = sum(dist(M[names[i]][k], M[names[j]][k]) for k in range(len(rows))) / len(rows)
            out.append((d, names[i], names[j]))
    out.sort()
    return out


def b4(jk, ne):
    T = jk.get('beasts_by_ground', {}); L = jk.get('beast_looks', {}); bad = []
    for g, w in T.items():
        if g.startswith('_'): continue
        fs = [f for f, v in w.items() if v > 0]
        if not fs or all(f in CANIDS for f in fs): bad.append(g + ' is only canids')
        for f in fs:
            if f not in ne['mix']: bad.append(g + ': ' + f + ' has no party')
            if f not in L: bad.append(g + ': ' + f + ' has no picture')
    return bad


def b5(src):
    return re.findall(r"(?:wolf|hyena)\s*:\s*\{\s*file:[^}]*\bw:\s*\d+", src)


def marks(im, L, rows):
    """hi-vis pixels in the standing picture of each facing"""
    out = []
    for r in range(rows):
        a = np.asarray(im.crop((0, r * L['h'], L['w'], (r + 1) * L['h'])).convert('RGBA')).astype(np.float32)
        f = a[..., :3]; out.append(int(((a[..., 3] > 0) & (f[..., 1] > f[..., 0] * 1.05) & (f[..., 1] > f[..., 2] * 1.8) & (f[..., 1] > 70)).sum()))
    return out


def b6(sheets, nrows):
    return [(n, c) for n, (im, L) in sheets.items() for c in [marks(im, L, nrows)] if sum(1 for x in c if x >= MARK_PX) < MARK_FACINGS]


def b7(ne):
    W = ne.get('water', {}); K = set(W.get('kinds', {})); by = W.get('by_faction', {}); bad = []
    for f, v in ne['factions'].items():
        if not v.get('beast'): continue
        at = (by.get(f) or {}).get('at') or []
        if not at: bad.append(f + ' names no water')
        bad += [f + ': ' + w + ' is no water the valley has' for w in at if w not in K]
    return bad


def main():
    ours = J('records/target/bb/ours.json'); ne = J('records/target/bb/bohemia_enemies.json'); index = J('slices/fight_rig/fight_rig.json')
    jk = J('records/target/BOHEMIA_JOB_KINDS.json'); src = open(os.path.join(ROOT, 'slices/bohemia_job_kinds.js')).read()
    kinds, m = beast_kinds(ours, ne)
    # the plants: each leg refuses its fault
    pm = dict(m); pm['feral_bull'] = 'beast_dire_wolf'; pk = set(kinds) | {'planted_beast'}
    pj = json.loads(json.dumps(jk)); pj['beasts_by_ground']['hills'] = {'wolves': 2, 'dogs': 1}
    sheet_of = lambda look: (Image.open(os.path.join(ROOT, 'slices/fight_rig', index['looks'][look]['file'])), index['looks'][look])
    twin = sheet_of('beast_coyote')
    plants = [('a kind with no picture', bool(b1(pk, m, index))), ('a bull drawn on the wolf', bool(b2(pm))),
              ('a canid-only ground', bool(b4(pj, ne))), ('a typed size', bool(b5("wolf: { file: 'x.webp', w: 107, h: 116 }"))),
              ('two identical outlines', b3({'a': twin, 'b': twin}, index)[0][0] < FLOOR)]
    leg(all(p[1] for p in plants), 'the legs refuse their planted faults (' + ', '.join(p[0] for p in plants) + ')', ', '.join(p[0] for p in plants if not p[1]))
    bad = b1(kinds, m, index)
    leg(not bad, 'B1 every beast the fight can deal (%d kinds) has its own picture, nothing falls back to the dire wolf' % len(kinds), ', '.join(bad))
    bad = b2(m)
    leg(not bad, 'B2 no two animals share one sheet (%d sheets)' % len(set(m.values())), '; '.join('%s: %s' % (s, ','.join(k)) for s, k in bad))
    looks = sorted(set(m.values()))
    pairs = b3({l: sheet_of(l) for l in looks}, index)
    under = [p for p in pairs if p[0] < FLOOR]
    leg(not under, 'B3 every pair of the %d animals differs by outline (shape at one height) by %.2f or more (closest: %s and %s, %.2f)' % (len(looks), FLOOR, pairs[0][1], pairs[0][2], pairs[0][0]),
        '; '.join('%s/%s %.2f' % (a, b, d) for d, a, b in under[:6]))
    # the control: the old fox-reshaped cast (the WAS rows, SE only) must fail the floor somewhere, or the floor measures nothing
    W = J('slices/vote/beasts_was/was.json')
    was = {n: (Image.open(os.path.join(ROOT, 'slices/vote/beasts_was', n + '.webp')), dict(W[n], w=W[n]['w'], h=W[n]['h'])) for n in W}
    wi = {'dirs': ['E', 'SE']}
    wp = []
    names = sorted(was)
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            a, b = was[names[i]], was[names[j]]
            wp.append((dist(mask(a[0], a[1], 0), mask(b[0], b[1], 0)), names[i], names[j]))
    wp.sort()
    leg(wp[0][0] < FLOOR, 'B3 control: the old fox-reshaped cast fails the same floor (closest WAS pair: %s and %s, %.2f)' % (wp[0][1], wp[0][2], wp[0][0]))
    bad = b4(jk, ne)
    leg(not bad, 'B4 no place is only canids (%d grounds), every faction named there has its party and its picture' % len([g for g in jk.get('beasts_by_ground', {}) if not g.startswith('_')]), '; '.join(bad[:6]))
    bad = b5(src)
    leg(not bad, 'B5 the map types no beast cell size (it reads the fight\'s index)', '; '.join(bad[:3]))
    um = [n for n in MARKED if os.path.exists(os.path.join(ROOT, 'slices/vote/beasts_was', n[6:] + '_unmarked.webp'))]
    plant = {n: (Image.open(os.path.join(ROOT, 'slices/vote/beasts_was', n[6:] + '_unmarked.webp')), W[n[6:] + '_unmarked']) for n in um[:3]}
    leg(len(b6(plant, 1)) == len(plant) and plant, 'B6 control: the unmarked rows (%s) fail the mark leg' % ', '.join(plant))
    bad = b6({n: sheet_of(n) for n in MARKED}, len(index['dirs']))
    leg(not bad, 'B6 every lab beast\'s plate and the bull\'s and the hog\'s farm tag show %d+ pixels in %d+ of 8 facings (%d beasts)' % (MARK_PX, MARK_FACINGS, len(MARKED)),
        '; '.join('%s %s' % (n[6:], c) for n, c in bad[:6]))
    pn = json.loads(json.dumps(ne)); pn['water']['by_faction'].pop('hogs', None)
    leg(bool(b7(pn)), 'B7 control: a beast with no water is refused')
    bad = b7(ne)
    leg(not bad, 'B7 every beast party names the water it lives at (%d parties), each a water the valley has' % len([f for f, v in ne['factions'].items() if v.get('beast')]), '; '.join(bad[:6]))
    print('EVERY BEAST ITS OWN OUTLINE: %d passed, %d failed' % (passed, failed))
    if '--pairs' in sys.argv:
        for d, a, b in pairs[:12]: print('   %.3f  %s / %s' % (d, a, b))
        for d, a, b in wp[:8]: print('   WAS %.3f  %s / %s' % (d, a, b))
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
