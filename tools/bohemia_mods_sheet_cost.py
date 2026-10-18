#!/usr/bin/env python3
"""MODS [sheets not stills] -- what the ten tests cost on a packed sheet, measured (reads only, writes nothing).

    python3 tools/bohemia_mods_sheet_cost.py            # all looks in slices/fight_people
    python3 tools/bohemia_mods_sheet_cost.py --json     # the numbers as JSON

RESEARCH ONLY (rule 22): nothing in the game calls this. It loops over the cols and rows fight_people.json declares,
runs the craft rows check.py already runs (one pixel size, light angle, banding, stray pixels at 8 steps) per frame,
on the whole sheet as one image, and measures the two rows a still cannot show: silhouette separation across the
facings (is SW a mirror of SE, and how far do two clips' frames differ) and one light across the facings.
"""
import os, sys, json, time, importlib.util
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DIR = os.path.join(ROOT, 'slices', 'fight_people')


def mod(rel):
    s = importlib.util.spec_from_file_location(os.path.basename(rel)[:-3], os.path.join(ROOT, rel))
    m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m


A = mod('tools/bohemia_pixel_craft_audit.py'); E = mod('tools/bohemia_eyes_pixel_tells.py')
C = mod('skills/bohemia-pixel-art/scripts/check.py')


def craft(im):
    a = A.audit_tile(im); e = E.look(im)
    return {'block': a['block_size'], 'light': a['light_deg'], 'banding': e.get('banding_pct') or 0, 'stray': C.orphan8(im)}


def mask(im):
    return np.asarray(im)[..., 3] > 127


def iou(m1, m2):
    u = (m1 | m2).sum()
    return float((m1 & m2).sum() / u) if u else 1.0


def main():
    d = json.load(open(os.path.join(DIR, 'fight_people.json')))
    F, rows, cols = d['frame'], d['rows'], d['cols']
    out = {'frame': F, 'rows': rows, 'cols': len(cols), 'looks': {}}
    for key, lk in d['looks'].items():
        sheet = Image.open(os.path.join(DIR, lk['file'])).convert('RGBA')
        t0 = time.time(); whole = craft(sheet); t_whole = time.time() - t0
        per = {}; t0 = time.time(); empty = 0
        for ri, r in enumerate(rows):
            for ci, c in enumerate(cols):
                fr = sheet.crop((ci * F, ri * F, ci * F + F, ri * F + F))
                if not mask(fr).any():
                    empty += 1; continue
                per[(r, c)] = (craft(fr), mask(fr))
        t_frames = time.time() - t0
        res = [v[0] for v in per.values()]
        lights = [x['light'] for x in res if x['light'] is not None]
        # facing: SW against SE mirrored, per col
        mir = []; lmir = []
        for c in cols:
            if ('SE', c) in per and ('SW', c) in per:
                mir.append(iou(per[('SE', c)][1], per[('SW', c)][1][:, ::-1]))
                l1, l2 = per[('SE', c)][0]['light'], per[('SW', c)][0]['light']
                if l1 is not None and l2 is not None:
                    lmir.append(abs(((l1 + l2) % 360) - 180))  # 0 = SW's light is SE's flipped left-right
        # silhouette separation between clips on SE: idle@0 against every other clip's first col
        base = per.get(('SE', 'idle@0'), (None, None))[1]
        sep = {}
        for cl, spec in d['clips'].items():
            c0 = spec['cols'][0] if isinstance(spec, dict) and spec.get('cols') else None
            if base is not None and c0 and ('SE', c0) in per:
                sep[cl] = round(1 - iou(base, per[('SE', c0)][1]), 3)
        out['looks'][key] = {
            'sheet_px': list(sheet.size), 'frames_checked': len(per), 'frames_empty': empty,
            'time_whole_s': round(t_whole, 3), 'time_frames_s': round(t_frames, 3),
            'whole': {k: (round(v, 3) if isinstance(v, float) else v) for k, v in whole.items()},
            'frames_block_not_1': sum(1 for x in res if x['block'] != 1),
            'frames_banding': sum(1 for x in res if x['banding']),
            'frames_stray_over_prop_p90': sum(1 for x in res if x['stray'] > C.ORPHAN8_P90['prop']),
            'frames_light_outside_above': sum(1 for x in lights if not 180 <= x <= 360),
            'frames_light_flat': len(res) - len(lights),
            'light_min': round(min(lights), 1) if lights else None, 'light_max': round(max(lights), 1) if lights else None,
            'sw_is_se_mirror_iou_min': round(min(mir), 3) if mir else None,
            'sw_is_se_mirror_iou_med': round(float(np.median(mir)), 3) if mir else None,
            'sw_light_vs_se_flipped_deg_med': round(float(np.median(lmir)), 1) if lmir else None,
            'clip_separation_from_idle': sep,
        }
    L = out['looks'].values()
    out['total'] = {
        'looks': len(out['looks']), 'frames': sum(x['frames_checked'] for x in L),
        'time_frames_s': round(sum(x['time_frames_s'] for x in L), 2), 'time_whole_s': round(sum(x['time_whole_s'] for x in L), 2),
        'frames_failing_any': sum(x['frames_block_not_1'] + x['frames_banding'] + x['frames_stray_over_prop_p90'] + x['frames_light_outside_above'] for x in L),
        'whole_sheets_failing_any': sum(1 for x in L if x['whole']['block'] != 1 or x['whole']['banding'] or x['whole']['stray'] > C.ORPHAN8_P90['prop']
                                        or (x['whole']['light'] is not None and not 180 <= x['whole']['light'] <= 360)),
    }
    if '--json' in sys.argv:
        print(json.dumps(out, indent=1)); return
    print('SHEET COST: %d looks, %d rows x %d cols of %d px' % (len(out['looks']), len(rows), len(cols), F))
    for k, x in out['looks'].items():
        print('%-20s frames %2d  per-frame %.2fs  whole %.2fs  light %s..%s  flat %d  out(block/band/stray/light) %d/%d/%d/%d  SW=mirror(SE) iou med %s  whole stray %.3f light %s'
              % (k, x['frames_checked'], x['time_frames_s'], x['time_whole_s'], x['light_min'], x['light_max'], x['frames_light_flat'],
                 x['frames_block_not_1'], x['frames_banding'], x['frames_stray_over_prop_p90'], x['frames_light_outside_above'],
                 x['sw_is_se_mirror_iou_med'], x['whole']['stray'], x['whole']['light']))
    print('TOTAL', json.dumps(out['total']))


if __name__ == '__main__':
    main()
