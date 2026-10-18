#!/usr/bin/env python3
"""MODS [a sheet's class] -- which keys tell a check the class of a frame, a clip and a block (reads only, writes nothing).

    python3 tools/bohemia_mods_sheet_class.py            # the census and the per-clip table
    python3 tools/bohemia_mods_sheet_class.py --json     # the numbers as JSON

RESEARCH ONLY (rule 22): nothing in the game calls this. It reads slices/fight_people/fight_people.json and every
rig.json under records/target, lists the keys a check could read as a class, then measures on the 26 packed looks
which frames really lie down (the alpha box wider than tall) and where the light row breaks (the craft audit's angle,
per clip, against the look's own standing median), so the declaration names only what the pixels need.
"""
import os, sys, json, glob, importlib.util, collections, statistics
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DIR = os.path.join(ROOT, 'slices', 'fight_people')


def mod(rel):
    s = importlib.util.spec_from_file_location(os.path.basename(rel)[:-3], os.path.join(ROOT, rel))
    m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m


A = mod('tools/bohemia_pixel_craft_audit.py')


def adiff(a, b):
    return abs((a - b + 180) % 360 - 180)


def rigs():
    out = []
    for f in sorted(glob.glob(os.path.join(ROOT, 'records/target/**/rig.json'), recursive=True)):
        r = json.load(open(f))
        out.append({'rig': os.path.relpath(os.path.dirname(f), ROOT), 'card_family': (r.get('card') or {}).get('family'),
                    'class': r.get('class'), 'kind': r.get('kind'), 'portrait': r.get('portrait'),
                    'clips': list((r.get('clips') or {}).keys())})
    return out


def main():
    d = json.load(open(os.path.join(DIR, 'fight_people.json')))
    F, rows, cols = d['frame'], d['rows'], d['cols']
    clip_of = {c: n for n, cl in d['clips'].items() for c in cl['cols']}
    face_x = len(cols) * F
    per_col = collections.defaultdict(lambda: {'wide': 0, 'n': 0, 'off': 0, 'lit': 0})
    face = {'present': 0, 'under_empty': 0}
    for key, lk in d['looks'].items():
        sheet = Image.open(os.path.join(DIR, lk['file'])).convert('RGBA')
        alpha = sheet.getchannel('A')
        face['present'] += alpha.crop((face_x, 0, face_x + d['face']['size'], d['face']['size'])).getbbox() is not None
        face['under_empty'] += alpha.crop((face_x, d['face']['size'], sheet.width, sheet.height)).getbbox() is None
        for ri, r in enumerate(rows):
            got = {}
            for ci, c in enumerate(cols):
                fr = sheet.crop((ci * F, ri * F, ci * F + F, ri * F + F))
                b = fr.getchannel('A').getbbox()
                if not b:
                    continue
                pc = per_col[c]; pc['n'] += 1; pc['wide'] += (b[2] - b[0]) > (b[3] - b[1])
                got[c] = A.audit_tile(fr)['light_deg']
            stand = [v for c, v in got.items() if v is not None and clip_of.get(c) in ('idle', 'step', 'aim', 'shot', 'shot_1h')]
            if len(stand) < 4:
                continue
            med = statistics.median(stand)
            for c, v in got.items():
                if v is not None:
                    per_col[c]['lit'] += 1; per_col[c]['off'] += adiff(v, med) > 45
    by_clip = collections.OrderedDict()
    for c in cols:
        n = clip_of.get(c, '(no clip)'); s = by_clip.setdefault(n, {'cols': 0, 'frames': 0, 'wide': 0, 'lit': 0, 'off': 0})
        s['cols'] += 1
        for k in ('wide', 'lit', 'off'):
            s[k] += per_col[c][k]
        s['frames'] += per_col[c]['n']
    rg = rigs()
    out = {
        'sheet_keys': {'file': ['frame', 'figure_bbox', 'rows', 'cols', 'face', 'clips', 'clips_by', 'looks', 'packed'],
                       'look_keys': sorted({k for v in d['looks'].values() for k in v}),
                       'look_kinds': dict(collections.Counter(v.get('kind') for v in d['looks'].values())),
                       'face': d['face'], 'face_rect': [face_x, 0, d['face']['size'], d['face']['size']],
                       'clip_keys': sorted({k for cl in d['clips'].values() for k in cl}),
                       'cols_in_no_clip': [c for c in cols if c not in clip_of]},
        'face_block': dict(face, looks=len(d['looks'])),
        'by_clip': by_clip,
        'rigs': {'count': len(rg), 'card_family': dict(collections.Counter(r['card_family'] for r in rg)),
                 'with_class_key': sum(1 for r in rg if r['class'] or r['kind']),
                 'with_portrait_pointer': sum(1 for r in rg if r['portrait']),
                 'folders': dict(collections.Counter(os.path.dirname(r['rig']) for r in rg)),
                 'clip_names': sorted({c for r in rg for c in r['clips']})},
    }
    if '--json' in sys.argv:
        print(json.dumps(out, indent=1)); return
    sk = out['sheet_keys']
    print('fight_people.json keys a check can read:', ', '.join(sk['file']))
    print('  per look:', sk['look_keys'], sk['look_kinds'])
    print('  per clip:', sk['clip_keys'], '| cols in no clip:', sk['cols_in_no_clip'])
    print('  face:', sk['face'], '-> rect', sk['face_rect'], '| present', face['present'], 'of', len(d['looks']),
          '| area under it empty', face['under_empty'])
    print('clip        cols frames  wider-than-tall  light >45 deg off the standing median')
    for n, s in by_clip.items():
        print(f"{n:11s} {s['cols']:4d} {s['frames']:6d}  {s['wide']:6d}           {s['off']:4d} of {s['lit']}")
    r = out['rigs']
    print('rig.json:', r['count'], 'files; card.family', r['card_family'], '; a class or kind key on', r['with_class_key'],
          '; a portrait pointer on', r['with_portrait_pointer'])
    print('  folders', r['folders'])
    print('  clip names', r['clip_names'])


if __name__ == '__main__':
    main()
