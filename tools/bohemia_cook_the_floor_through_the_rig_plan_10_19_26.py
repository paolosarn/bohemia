#!/usr/bin/env python3
"""BOHEMIA -- COOK [the floor through the rig] 10/19/26, STEP ONE: THE PLAN OF EVERY FIGHT BLOCK, READ, NEVER DRAWN.
Rule 121(j) (Paolo 10/19: 'even the floor tiles and building tiles and all accessories have to get remade with this
analog horror Crashbox style. Everything. Everything.'); rule 121(h): the fight floor is a NO again ('looks like shit').

The fight's 54 block pictures are made by COMBAT TWO's block maker (tools/bohemia_combat2_the_ground_for_the_new_fight_
cook_10_2_26.py). COOK TWO's [the fight floor he hates] (tools/bohemia_cook2_the_fight_floor_10_19_26.py) already found how
to ask that maker, per pixel, WHICH ground a pixel is and HOW DARK the maker's own shade() left it: run it twice, once as it
is and once with every ground dressed in a code ramp. This step imports COOK TWO's functions as they are (never edited)
and keeps only what the rig needs to build the ground in 3D:
  gid   per pixel, the ground (0..6 in GROUNDS order below) or 255 (not ground: a house, a wall, a car, a lamp)
  keep  per pixel, True where the shipped picture still equals the maker's output (a pixel a later round changed is kept)
  lum   per pixel, the maker's darkness on that ground (its house shadows), 0..255 of the ground's unshaded level
Written to records/target/cook_floor_rig/plans/<block>.npz (regenerated, not committed: about 3 minutes for 27 blocks).

  python3 tools/bohemia_cook_the_floor_through_the_rig_plan_10_19_26.py [block ...]

REFERENCE CHECK (the 9/4 standing duty): the compare law; nothing is drawn here, the plan is COMBAT TWO's own. No reference game.
REUSE CHECK (REUSE-FIRST): COOK TWO's load_maker, canon, make, code_everything and decode, imported; nothing re-written.
TASTE CHECK: none needed, no pixel is made in this step.
"""
import os, sys, json, time
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook2_the_fight_floor_10_19_26 as C2

OUT = os.path.join(R, 'records/target/cook_floor_rig/plans')
# the blocks of the boards the fight deals (suburb, culdesac, strip, desert, ruin, freeway): what he meets first
BLOCKS = ['subs.0', 'subs.1', 'subs.2', 'subs.3', 'lots.0', 'corner.0', 'corner.1', 'corner.2', 'culdesac.0', 'culdesac.1',
          'suburb_stem.0', 'suburb_stem.1', 'main.0', 'main.1', 'strip.0', 'strip.1', 'works.0', 'scrub.0', 'scrub.1', 'scrub.2',
          'wash.0', 'wash.1', 'ruin.0', 'ruin.1', 'freeway.0', 'freewayo.0', 'scrubroad.0', 'scrubroad.1']


def main(bids):
    t0 = time.time(); os.makedirs(OUT, exist_ok=True)
    G = C2.load_maker()
    C2.canon(G); orig = {}
    for b in bids: orig[b] = C2.make(G, b)
    kind_now = C2.code_everything(G); kind_now[0] = 'scrub'
    C2.canon(G)
    names = None; ledger = {}
    for b in bids:
        kind_now[0] = b.split('.')[0]
        coded = C2.make(G, b)
        gid, lum, names = C2.decode(coded)
        ship = np.asarray(Image.open(os.path.join(C2.SHIP, 'block_%s.webp' % b.replace('.', '_'))).convert('RGB'))
        keep = (ship == orig[b]).all(2)
        g8 = np.where(gid >= 0, gid, 255).astype(np.uint8)
        l8 = np.zeros(gid.shape, np.uint8)
        for k in range(len(names)):
            sel = gid == k
            if not sel.any(): continue
            mode = np.percentile(lum[sel], 85)                 # the maker's unshaded level, as COOK TWO reads it
            l8[sel] = (np.clip(lum[sel] / max(mode, 1e-3), 0, 1) * 255).round()
        np.savez_compressed(os.path.join(OUT, b.replace('.', '_') + '.npz'), gid=g8, keep=keep, lum=l8)
        ledger[b] = {n: round(float((gid == k).mean()), 4) for k, n in enumerate(names) if (gid == k).any()}
        ledger[b]['not_ground'] = round(float((gid < 0).mean()), 4)
        print('  plan', b, ledger[b], round(time.time() - t0), 's')
    json.dump(dict(grounds=names, blocks=ledger, made='10/19', how='COOK TWO\'s coded run of COMBAT TWO\'s maker, read per pixel'),
              open(os.path.join(OUT, 'plans.json'), 'w'), indent=1)


if __name__ == '__main__':
    main(sys.argv[1:] or BLOCKS)
