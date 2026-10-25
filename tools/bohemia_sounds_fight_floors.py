#!/usr/bin/env python3
"""THE FIGHT'S FLOORS, READ OFF ITS OWN PICTURES (SOUNDS, 10/18/26, row [the step in the fight]).

The fight's step was one 70 Hz triangle beep for every man on every tile (SND.step in
slices/BOHEMIA_FIGHT.html). A real shoe needs to know what it lands on, and a fight tile names only its
RULE (flat, rough, debris, water, height, blocked: Battle Brothers' costs), never its material. The
material is in the drawing: every block of COMBAT TWO's ground is one picture, five tiles by five, and
the picture already says road, parking lot, yard, wash or carpet. So this reads it, once, into a table
the engine looks up per step (slices/vote/travel_steps/fight_floors.json): the drawing and the sound
agree, tile by tile (the two-scales law: every cell's drawing agrees with what it is).

THE RULE, IN ORDER (first match wins):
  1. a CASINO block is carpet, wall to wall (the picture is one red carpet; the bar on casino.1 stands on it)
  2. a tile COMBAT TWO's kit plan lays a road piece on is asphalt (the street, the crossing, the junction);
     the plan's key is 'row,col' (lots.0's east-west road is '2,0' to '2,4'), measured against the pictures
  3. a tile whose picture is at least DARK_SHARE dark grey (saturation under 0.18, value under 0.42) is
     asphalt: the strip's parking, the freeway's lanes, the cul-de-sac's ring
  4. everything else is gravel ('dirt', the gravel walks): the desert yards, the scrub, the wash, the
     rubble, the landfill, the roofs (a flat Las Vegas roof is tar and gravel), and the shore's wet edge
     until a real wading recording exists (named in the record as the one gap)

  python3 tools/bohemia_sounds_fight_floors.py          # writes the table and prints every block
  python3 tools/bohemia_sounds_fight_floors.py --check  # re-derives it and fails on any difference
"""
import json, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GROUND = os.path.join(ROOT, 'slices', 'fight_ground', 'fight_ground.json')
OUT = os.path.join(ROOT, 'slices', 'vote', 'travel_steps', 'fight_floors.json')
DARK_SHARE = 0.30
SAT, VAL = 0.18, 0.42


def derive():
    G = json.load(open(GROUND))
    bt = G['block_tiles']
    terrain = {}
    for B in G['boards'].values():
        for by, row in enumerate(B['blocks']):
            for bx, name in enumerate(row):
                terrain.setdefault(name, [r[bx * bt:(bx + 1) * bt] for r in B['terrain'][by * bt:(by + 1) * bt]])
    blocks = {}
    for name, b in G['blocks'].items():
        im = np.asarray(Image.open(os.path.join(ROOT, 'slices', 'fight_ground', b['src'])).convert('RGB')).astype(float) / 255
        H, W, _ = im.shape
        mx, mn = im.max(axis=2), im.min(axis=2)
        dark = ((mx - mn) / (mx + 1e-6) < SAT) & (mx < VAL)
        plan = b.get('kit_plan') or {}
        floor, share, why = [], [], []
        for ty in range(bt):
            frow, srow, wrow = [], [], []
            for tx in range(bt):
                d = float(dark[int(ty * H / bt):int((ty + 1) * H / bt), int(tx * W / bt):int((tx + 1) * W / bt)].mean())
                if name.split('.')[0] == 'casino': f, w = 'carpet', 'casino'
                elif ('%d,%d' % (ty, tx)) in plan: f, w = 'asphalt', 'road:' + plan['%d,%d' % (ty, tx)]   # the plan's key is 'row,col'
                elif d >= DARK_SHARE: f, w = 'asphalt', 'drawn dark'
                else: f, w = 'dirt', 'gravel'
                frow.append(f); srow.append(round(d, 2)); wrow.append(w)
            floor.append(frow); share.append(srow); why.append(wrow)
        blocks[name] = dict(floor=floor, dark_share=share, why=why, terrain=terrain.get(name))
    return dict(
        _readme="THE FIGHT'S FLOORS (SOUNDS 10/18/26, row [the step in the fight]): what a shoe lands on, per tile of every block of COMBAT TWO's fight ground, read off the block's own picture by tools/bohemia_sounds_fight_floors.py. floor[y][x] names a sprite in this folder (steps_<floor>.mp3). The rule, first match wins: a casino block is carpet; a kit-plan road piece is asphalt; a tile drawn at least %d percent dark grey is asphalt; everything else is the gravel walk ('dirt'). The fight's own terrain (flat, rough, ...) is copied beside it for reading, never used: it is a cost, not a material." % round(DARK_SHARE * 100),
        made='10/18/26', lane='sounds', draft=True, source='slices/fight_ground/fight_ground.json',
        block_tiles=bt, tile_metres=G['tile_metres'], dark_share_for_asphalt=DARK_SHARE,
        surfaces=sorted({f for b in blocks.values() for r in b['floor'] for f in r}), blocks=blocks)


def main():
    t = derive()
    if '--check' in sys.argv:
        old = json.load(open(OUT))
        bad = [n for n in t['blocks'] if old.get('blocks', {}).get(n, {}).get('floor') != t['blocks'][n]['floor']]
        bad += [n for n in old.get('blocks', {}) if n not in t['blocks']]
        print('CHECK FAIL: the table disagrees with the pictures on ' + ', '.join(bad) if bad else 'CHECK PASS: %d blocks, the table is the pictures' % len(t['blocks']))
        return 1 if bad else 0
    json.dump(t, open(OUT, 'w'), indent=1)
    count = {}
    for n, b in t['blocks'].items():
        for r in b['floor']:
            for f in r: count[f] = count.get(f, 0) + 1
        print('%-14s %s' % (n, ' | '.join(' '.join(f[0].upper() for f in r) for r in b['floor'])))
    print('tiles by floor:', count)
    return 0


if __name__ == '__main__':
    sys.exit(main())
