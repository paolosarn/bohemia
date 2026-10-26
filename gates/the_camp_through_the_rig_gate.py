#!/usr/bin/env python3
"""THE CAMP THROUGH THE RIG (COOK, CAMP TWO's NOTE [the camp grows] 10/26: 'When a session has the master rig, put the same shapes
through it and drop them into slices/camp_two/kit.png at the same rects and feet; the camp reads kit.json only. Also wanted: a
camp-sized trailer for the last carrier step'; rule 115(a): the rig's look is the look; rule 289(e)).

Read off what ships (slices/camp_two/kit.png + kit.json, records/target/cook_camp_rig/rig_json.json,
records/target/master_rig/cook_camp_trailer/):
  1. *** EVERY PIECE THE CAMP READS IS ON THE SHEET ***: every piece kit.json names has a rect inside kit.png with a body in it
     (opaque pixels), a foot, its footprint in metres and its height; every follower the camp offers has its piece (f_<id>).
  2. *** MADE BY THE RIG ***: every piece has its rig run (rig_json.json: Cycles, the guide's settings with NO break, its ground and
     box), and kit.json says so; the body is the rig's (more colours than the numpy recipe's floor: the source pass's spread).
  3. THE FIRE NEVER JITTERS: the six keys share one size and one foot.
  4. THE FOOT IS THE PIECE'S OWN GROUND POINT: from the foot, the body reaches as far left and right as its footprint in metres says
     (x at the rig's 57 px a metre) and its nearest edge comes down to where its southmost ground point lands (y x sin 45), within
     8 px: a piece drawn at its ground point stands where the camp put it, never floats or sinks (the dead lie south of theirs).
  5. *** THE CAMP TRAILER ***: a 4 x 7 ft trailer through the rig in all eight facings (rig_<facing>.png, rig.json with no break),
     shorter than 4 m (the rig's own trailer is 12 m), and kit.json's camp_trailer_rig names its folder, ground pixel and hitch.
  Run: python3 gates/the_camp_through_the_rig_gate.py
"""
import os, sys, json, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.join(R, 'slices/camp_two')
RJ = os.path.join(R, 'records/target/cook_camp_rig/rig_json.json')
TR = os.path.join(R, 'records/target/master_rig/cook_camp_trailer')
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
ok_n = bad_n = 0


def leg(ok, what, why=''):
    global ok_n, bad_n
    if ok: ok_n += 1
    else: bad_n += 1
    print(('  ok   ' if ok else '  FAIL ') + what + ('  [' + str(why) + ']' if why != '' else ''))


def main(kit_dir=KIT, rj_path=RJ, tr_dir=TR):
    kit = json.load(open(os.path.join(kit_dir, 'kit.json'))); sheet = np.asarray(Image.open(os.path.join(kit_dir, 'kit.png')).convert('RGBA'))
    H, W = sheet.shape[:2]; P = kit.get('pieces', {})
    # the followers the camp offers (engine/bohemia_camp.js MORE and the six live), each must have its piece
    src = open(os.path.join(R, 'engine/bohemia_camp.js')).read()
    fol = sorted(set(re.findall(r"\b([a-z_]+):\s*\{\s*says:", src)) | set(re.findall(r"\{\s*id:\s*'([a-z_]+)',\s*price:", src)))
    miss = []
    for n, e in P.items():
        x, y, w, h = e.get('rect', [0, 0, 0, 0])
        if not (0 <= x and 0 <= y and x + w <= W and y + h <= H and w > 0 and h > 0): miss.append(n + ' rect off the sheet'); continue
        if (sheet[y:y + h, x:x + w, 3] > 200).sum() < 40: miss.append(n + ' no body')
        if not e.get('foot') or not e.get('footprint_m') or 'height_m' not in e: miss.append(n + ' no foot/footprint/height')
    for f in fol:
        if 'f_' + f not in P: miss.append('follower ' + f + ' has no piece')
    leg(not miss and len(P) >= 35, '*** EVERY PIECE THE CAMP READS IS ON THE SHEET ***: every rect inside kit.png with a body, a foot, a footprint and a height; every follower his piece',
        '; '.join(miss[:6]) if miss else '%d pieces, %d followers, sheet %d x %d' % (len(P), len(fol), W, H))
    # 2
    rj = json.load(open(rj_path)) if os.path.exists(rj_path) else {}
    bad = []
    cols = []
    for n, e in P.items():
        r = rj.get(n)
        if not r: bad.append(n + ' no rig run'); continue
        if r.get('engine') != 'CYCLES' or r.get('breaks'): bad.append('%s engine %s breaks %s' % (n, r.get('engine'), r.get('breaks')))
        if not r.get('crop_box_px') or not r.get('ground_screen'): bad.append(n + ' no box/ground')
        x, y, w, h = e['rect']; a = sheet[y:y + h, x:x + w]; op = a[..., 3] > 200
        c = len(set(map(tuple, a[op][:, :3].tolist()))); cols.append((c, n))
        if c < 400: bad.append('%s %d colours' % (n, c))
    if 'master rig' not in str(kit.get('made', '')): bad.append('kit.json does not say the rig made it')
    leg(not bad, '*** MADE BY THE RIG ***: every piece its own run of the master rig (Cycles, the guide\'s settings, no break), the sheet the rig\'s bodies (400 colours or more each)',
        '; '.join(bad[:6]) if bad else 'fewest colours %d (%s)' % min(cols))
    # 3
    keys = ['fire_%d' % i for i in range(6)]
    sz = {tuple(P[k]['rect'][2:]) for k in keys if k in P}; ft = {tuple(P[k]['foot']) for k in keys if k in P}
    leg(len(sz) == 1 and len(ft) == 1 and all(k in P for k in keys), 'the fire never jitters: its six keys one size and one foot', '%s %s' % (sorted(sz), sorted(ft)))
    # 4
    ppm = float(kit.get('ppm', 57.0)); sn = 0.7071
    off = []
    for n, e in P.items():
        x, y, w, h = e['rect']; fx, fy = e['foot']; op = sheet[y:y + h, x:x + w, 3] > 200
        ys, xs = np.nonzero(op)
        if not len(ys): continue
        x0m, y0m, x1m, y1m = e['footprint_m']
        want = (fx + x0m * ppm, fx + x1m * ppm, fy - y0m * sn * ppm)
        got = (xs.min(), xs.max() + 1, ys.max() + 1)
        if abs(got[0] - want[0]) > 8 or abs(got[1] - want[1]) > 8 or abs(got[2] - want[2]) > 8:
            off.append('%s body x %d..%d bottom %d, footprint says %.0f..%.0f bottom %.0f' % ((n,) + got + want))
    leg(not off, 'the foot is the piece\'s own ground point: the body spans its footprint and reaches its southmost ground, within 8 px', '; '.join(off[:4]) if off else 'all %d' % len(P))
    # 5
    tb = []
    t = kit.get('camp_trailer_rig')
    if not t: tb.append('kit.json has no camp_trailer_rig')
    else:
        if not t.get('ground') or not t.get('hitch_m') or 'cook_camp_trailer' not in t.get('dir', ''): tb.append('no ground/hitch/dir')
    if not os.path.isdir(tr_dir): tb.append('no trailer folder')
    else:
        for f in FACINGS:
            if not os.path.exists(os.path.join(tr_dir, 'rig_%s.png' % f)): tb.append('no rig_' + f)
        try:
            r = json.load(open(os.path.join(tr_dir, 'rig.json')))
            if r.get('breaks'): tb.append('breaks %s' % r['breaks'])
            if max(r['real_dims_m'][:2]) >= 4.0: tb.append('%.1f m long' % max(r['real_dims_m'][:2]))
        except Exception as ex: tb.append('rig.json %s' % ex)
    leg(not tb, '*** THE CAMP TRAILER ***: a 4 x 7 ft trailer through the rig in all eight facings, under 4 m, named in kit.json with its ground and hitch',
        '; '.join(tb[:6]) if tb else '%s m, ground %s, hitch %s' % (t['real_dims_m'], t['ground'], t['hitch_m']))
    print('THE CAMP THROUGH THE RIG: %d ok, %d failed' % (ok_n, bad_n))
    return 1 if bad_n else 0


if __name__ == '__main__':
    sys.exit(main())
