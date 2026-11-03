#!/usr/bin/env python3
"""HOME SETTLEMENT GATE (rule 354 (g) to (o); ask lines 371, 373). Paolo 11/3: 'each camera angle has to show all 12 lots... 12 out of
12 lots even if things are three dimensional' and 'this has to be modular... we can't be cooking up 30 angles of a building type'.
Reads what tools/bohemia_home_settlement_pipeline_11_3_26.py wrote to records/target/home_settlement/ (no Blender needed):
  S1 the manifest is the pipeline's own (its script, its look)
  S2 THE FIXED CAMERAS: exactly the pipeline's three, and every plate and piece was rendered for that set (a camera outside it fails)
  S3 NO HAND STEP: every piece of the pipeline has every state from every camera, both shapes, on every lot of its row, each picture
     on disk and listed; no picture in the folder that the pipeline did not list (a hand-made angle fails)
  S4 THE ROW'S HEIGHT: no piece taller than its row allows, none wider than a lot
  S5 TWELVE OF TWELVE, recomputed from the flat pictures: every camera, upright and sideways, every lot at its tallest still shows 60% of
     itself (measured against the lot alone on a canvas twice as big, so what the frame cuts off counts as unseen) and a 44-point tap box
  S6 INTIMATE (rule 373): the three cameras look through a wide barrel lens (the equisolid fisheye) from across the street, not from far
     overhead: a lens under 20 mm, mounted under 16 m, within 20 m of the block's front wall
  M  it can fail: a planted fourth camera fails S2, a planted picture fails S3, a wall painted over lot 10 fails S5
"""
import os, sys, json, copy
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_home_settlement_pipeline_11_3_26 as H
OUT = H.OUT; ok_n = bad_n = 0
def ok(name, cond, why=''):
    global ok_n, bad_n
    if cond: ok_n += 1; print('  ok  ', name)
    else: bad_n += 1; print('  FAIL', name, ' ', why)

def s2(M):
    return (M.get('cams_hash') == H.cams_hash() and sorted(int(k) for k in M['cams']) == sorted(H.CAMS)
            and all(e.get('cams') == H.cams_hash() for e in list(M['plates'].values()) + list(M['pieces'].values())))
def s3(M, files):
    want = set()
    for pid, D in H.PIECES.items():
        P = M['pieces'].get(pid)
        if not P: return False, 'missing piece ' + pid
        lots = [L['n'] for L in H.LOTS if L['row'] == D['row']]
        for st in D['states']:
            for cn in H.CAMS:
                for sh in H.SIZES:
                    for ln in lots:
                        c = P['states'].get(st, {}).get('pics', {}).get('%d_%s_%d' % (cn, sh, ln))
                        if not c or not c['pictures']: return False, '%s %s cam%d %s lot%d has no picture' % (pid, st, cn, sh, ln)
                        want |= set(c['pictures'])
    extra = files - want; missing = want - files
    return (not extra and not missing), 'extra %s missing %s' % (sorted(extra)[:3], sorted(missing)[:3])
def s5(src):
    g = H.gate_numbers(src); bad = [(k, n, v) for k, row in g['lots'].items() for n, v in row.items() if v['seen'] < 0.6 or v['tap_pt'] < 44]
    return not bad, g, bad

mp = os.path.join(OUT, 'manifest.json')
ok('S1 the manifest is the pipeline\'s own', os.path.exists(mp))
if not os.path.exists(mp): print('=== HOME SETTLEMENT GATE: %d passed, %d failed ===' % (ok_n, bad_n)); sys.exit(1)
M = json.load(open(mp))
ok('S1 made by the pipeline, act one\'s look', M.get('by') == 'tools/bohemia_home_settlement_pipeline_11_3_26.py' and M.get('look') in H.LOOKS)
ok('S2 exactly the three fixed cameras, every plate and piece rendered for them', s2(M))
cams = M['cams']
ok('S6 intimate: every camera a wide barrel lens (under 20 mm), under 16 m up, within 20 m of the front wall',
   all(max(c['f'].values()) < 20 and c['loc'][2] < 16 and abs(c['loc'][1] - 3.6) < 20 for c in cams.values()),
   str({k: (c['f'], c['loc']) for k, c in cams.items()}))
files = set(os.listdir(os.path.join(OUT, 'pieces')))
r3, why3 = s3(M, files); ok('S3 every piece, every state, every camera and shape, every lot of its row, by the script (%d pictures, %d pieces)' % (len(files), len(M['pieces'])), r3, why3)
tall = [(pid, st, S['size_m']) for pid, P in M['pieces'].items() for st, S in P['states'].items()
        if S['size_m'][2] > H.ROWS[P['row']]['hmax'] + 0.05 or S['size_m'][0] > 11.0 or S['size_m'][1] > 10.0]
ok('S4 no piece taller than its row allows or bigger than a lot', not tall, str(tall[:3]))
r5, g, bad = s5(os.path.join(OUT, 'gate'))
ok('S5 twelve of twelve in every camera, upright and sideways: worst %.0f%% seen, smallest tap %.0f points' %
   (g['summary']['worst_seen'] * 100, g['summary']['worst_tap_pt']), r5, str(bad[:3]))
# M: the ruler can fail
M2 = copy.deepcopy(M); M2['cams']['4'] = dict(name='CAM 4 A HAND ANGLE', az=40.0, el=20.0)
ok('M  a fourth camera outside the set fails S2', not s2(M2))
r, w = s3(M, files | {'house_plain_built_cam1_tall_lot9_hand.png'}); ok('M  a picture the pipeline did not make fails S3', not r)
import tempfile, shutil
import numpy as np
from PIL import Image
tmp = tempfile.mkdtemp()
for fn in os.listdir(os.path.join(OUT, 'gate')): shutil.copy(os.path.join(OUT, 'gate', fn), tmp)
a = np.asarray(Image.open(os.path.join(tmp, 'gate_cam1_tall_all.png')).convert('RGB')).copy(); m = abs(a[..., 0].astype(int) - 200) <= 3
a[m] = 0; Image.fromarray(a).save(os.path.join(tmp, 'gate_cam1_tall_all.png'))
r, _, _ = s5(tmp); ok('M  a wall painted over lot 10 in CAM 1 fails S5', not r); shutil.rmtree(tmp)
print('=== HOME SETTLEMENT GATE: %d passed, %d failed ===' % (ok_n, bad_n))
sys.exit(1 if bad_n else 0)
