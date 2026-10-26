#!/usr/bin/env python3
"""EVERY PERK A PICTURE (COOK [the fifty perk icons], rule 252(c), Paolo 10/26: 'I don't want a single perk without an icon, I need
you to have icons for all the perks... I need to be able to visualize it as well as what's written for it'; line 179 of his list).

Read off what ships (slices/perk_icons/, records/target/cook_perk_icons/rig_json.json):
  1. *** EVERY PERK HAS ITS PICTURE ***: every perk of records/target/bb/perks.json has slices/perk_icons/<id>.png, 96 x 96, and a
     row in perk_icons.json (its row, carried or pressed as the fight's ACTIVE list says, what it shows, draft:true).
  2. *** MADE BY THE RIG ***: every icon's model went through the master rig (Cycles, no break, 1,000 colours or more on the body).
  3. THE RIM SAYS CARRIED OR PRESSED: gold where he carries it, steel blue where he presses it (the fight's colours).
  4. THE ROW IN DOTS: as many raised dots at the plate's foot as the perk's row (1 to 7), no more.
  5. *** IT READS AT THE CREW CARD'S SIZE ***: at 32 px the thing stands off its plate (12 percent or more of the middle 20 x 20
     stands 45 values or more off the bare plate: a hammer's thin diagonal is 14, a heart 60; an empty plate 0) and no two icons are
     alike there (every pair 12 values or more apart on average).
  Run: python3 gates/every_perk_a_picture_gate.py [dir]
"""
import os, sys, json, re, itertools
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ok_n = bad_n = 0


def leg(ok, what, why=''):
    global ok_n, bad_n
    if ok: ok_n += 1
    else: bad_n += 1
    print(('  ok   ' if ok else '  FAIL ') + what + ('  [' + str(why) + ']' if why != '' else ''))


def main(d=os.path.join(R, 'slices/perk_icons'), rjp=os.path.join(R, 'records/target/cook_perk_icons/rig_json.json')):
    perks = json.load(open(os.path.join(R, 'records/target/bb/perks.json')))['rows']
    fight = open(os.path.join(R, 'slices/BOHEMIA_FIGHT.html')).read()
    active = re.findall(r"'([a-z_]+)'", re.search(r"const ACTIVE = \[([^\]]*)\]", fight).group(1))
    man = json.load(open(os.path.join(d, 'perk_icons.json'))).get('icons', {}) if os.path.exists(os.path.join(d, 'perk_icons.json')) else {}
    miss, ims = [], {}
    for p in perks:
        f = os.path.join(d, p['id'] + '.png'); e = man.get(p['id'])
        if not os.path.exists(f): miss.append(p['id'] + ' no picture'); continue
        im = Image.open(f).convert('RGBA')
        if im.size != (96, 96): miss.append('%s %s' % (p['id'], im.size)); continue
        ims[p['id']] = np.asarray(im).astype(float)
        if not e or e.get('tier') != p['tier'] or e.get('pressed') != (p['id'] in active) or not e.get('shows') or e.get('draft') is not True:
            miss.append(p['id'] + ' manifest row')
    leg(not miss and len(ims) == len(perks) == 50, '*** EVERY PERK HAS ITS PICTURE ***: fifty pictures, 96 x 96, each its row in perk_icons.json (row, carried or pressed, what it shows, draft)',
        '; '.join(miss[:6]) if miss else '%d of %d' % (len(ims), len(perks)))
    rj = json.load(open(rjp)) if os.path.exists(rjp) else {}
    bad = ['%s %s' % (k, 'no run' if k not in rj else 'engine %s breaks %s colours %s' % (rj[k].get('engine'), rj[k].get('breaks'), rj[k].get('colours')))
           for k in ims if k not in rj or rj[k].get('engine') != 'CYCLES' or rj[k].get('breaks') or (rj[k].get('colours') or 0) < 1000]
    leg(not bad and ims, '*** MADE BY THE RIG ***: every icon\'s model through the master rig (Cycles, no break, 1,000 colours or more)', '; '.join(bad[:6]) if bad else 'fewest colours %d' % min(rj[k]['colours'] for k in ims))
    # 3 the rim: the ring 4.2 px in from the plate's edge (rows and columns 6 and 89), on the straight runs (the middle of each side)
    wrong = []
    for k, a in ims.items():
        rim = np.concatenate([a[6, 30:66, :3], a[89, 30:66, :3], a[30:66, 6, :3], a[30:66, 89, :3]])
        r, g, b = rim.mean(0)
        if (k in active) != (b > r): wrong.append('%s rim %d,%d,%d' % (k, r, g, b))
    leg(not wrong, 'the rim says carried or pressed: gold where he carries it, steel blue where he presses it', '; '.join(wrong[:6]) if wrong else 'all fifty')
    # 4 the dots: centres at x 10.5 + 4.5 i, y 85.5
    dots = []
    tiers = {p['id']: p['tier'] for p in perks}
    for k, a in ims.items():
        lum = a[..., :3].mean(-1); base = np.median(lum[80:90, 40:60])
        lit = [lum[85, int(10.5 + 4.5 * i)] > base + 25 for i in range(9)]
        n = 0
        while n < 9 and lit[n]: n += 1
        if n != tiers[k]: dots.append('%s %d dots, row %d' % (k, n, tiers[k]))
    leg(not dots, 'the row in dots: as many raised dots at the plate\'s foot as the perk\'s row', '; '.join(dots[:6]) if dots else 'all fifty')
    # 5 at 32 px
    small = {k: np.asarray(Image.fromarray(a.astype(np.uint8), 'RGBA').resize((32, 32), Image.LANCZOS)).astype(float)[..., :3] for k, a in ims.items()}
    flat, alike = [], []
    for k, s in small.items():
        plate = np.median(np.concatenate([s[3, 3:29], s[28, 3:29], s[3:29, 3], s[3:29, 28]]), 0)
        v = (np.abs(s[6:26, 6:26] - plate).max(-1) > 45).mean()
        if v < 0.12: flat.append('%s %.0f%%' % (k, v * 100))
    worst = (999, '', '')
    for x, y in itertools.combinations(sorted(small), 2):
        v = np.abs(small[x][6:26, 6:26] - small[y][6:26, 6:26]).mean(); worst = min(worst, (v, x, y))
        if v < 12: alike.append('%s ~ %s %.1f' % (x, y, v))
    leg(not flat and not alike and small, '*** IT READS AT THE CREW CARD\'S SIZE ***: at 32 px every thing stands off its plate and no two icons are alike',
        '; '.join((flat + alike)[:6]) if (flat or alike) else 'most alike %s ~ %s %.1f' % (worst[1], worst[2], worst[0]))
    print('EVERY PERK A PICTURE: %d ok, %d failed' % (ok_n, bad_n))
    return 1 if bad_n else 0


if __name__ == '__main__':
    sys.exit(main(*sys.argv[1:2]) if len(sys.argv) > 1 else main())
