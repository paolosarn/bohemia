#!/usr/bin/env python3
"""THE PIXEL FLOOR (PLUMBER 10/19/26, VAMILY row [the pixel floor]; rule 105, Paolo 10/10: 'every time you decide to
make something art wise, you decide you need to use the tiniest amount of pixels possible... look at the graphics and
art that we downloaded and see how many pixels they are. That is the floor').

Every picture the site publishes (slices/, engine/, records/target/, and the pictures inlined in their pages) gets a
KIND (gates/pixel_floor_kinds.json, first matching rule) and, if its kind is judged, its PAINTED size (the box of its
pixels at least half opaque, never the canvas around them, never the camera's zoom) against that kind's FLOOR.

THE FLOORS ARE RE-MEASURED FROM HIS PACKS, never typed (records/target/BOHEMIA_PIXEL_FLOOR.json, --measure), by the
ruling's own words (records/BOHEMIA_PAOLO_THE_PIXEL_FLOOR_IS_THE_PACKS_10_10_26.md):
    tile      a floor tile is the pack's tile        painted long side >= the 10th percentile of road, ground, marking
    building  96 on its long side                    painted long side >= the 10th percentile of settlement and door
    lamp      96 tall                                painted height    >= the 10th percentile of the lamps
    thing     never under the pack's smallest prop   painted long side >= the smallest prop he bought (beasts too)
    vehicle   a car or a crate at the pack's median  painted long side >= the props' median
    portrait  never under the pack's tile            canvas, both sides >= the pack tile's median canvas
    person    the 112 box, about 100 painted         a rig still: painted height >= 98 (98 px = 1.72 m, the body in
                                                     metres); a cell or a sheet's frame: >= 112
    icon, thumb  never under 32 by 32                painted long side >= 32 (the smallest prop's canvas, rounded up)
    marker    never under 40 by 40                   painted long side >= 40 (the smallest ground piece's canvas)
The ruling's numbers that came from a canvas (29 by 36, 40 by 38) are kept as rulings; every other floor is the
packs' painted pixels measured again on every --measure.

    python3 tools/bohemia_pixel_floor.py --measure     re-measure the bank into the floor file
    python3 tools/bohemia_pixel_floor.py               every judged picture under its floor, by kind
    python3 tools/bohemia_pixel_floor.py --write       freeze today's under-floor list as the baseline (shrink only)
                                                       and write it into records/BOHEMIA_PLACEHOLDERS.md
"""
import base64
import fnmatch
import glob
import hashlib
import io
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'reference', 'art_bank')
KINDS = os.path.join(ROOT, 'gates', 'pixel_floor_kinds.json')
FLOOR = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_PIXEL_FLOOR.json')
BASELINE = os.path.join(ROOT, 'gates', 'pixel_floor_baseline.json')
PLACEHOLDERS = os.path.join(ROOT, 'records', 'BOHEMIA_PLACEHOLDERS.md')
PUBLISHED = ('slices', 'engine', 'records/target')
IMG = re.compile(r'\.(png|webp|jpe?g|gif)$', re.I)
TEXT = re.compile(r'\.(html?|js|mjs|json|css)$', re.I)
BLOB = re.compile(r'data:image/(?:png|webp|jpeg|gif);base64,([A-Za-z0-9+/=]{40,})')
PASSES = ('shadow_', 'raw_', 'rigid', 'rigobj', 'id_', 'obj_', 'calibration', 'riglight', 'normal_', 'mat_', 'mask_')
KEY = re.compile(r'_k\d+\.png$')
JUDGED = ('tile', 'building', 'lamp', 'thing', 'beast', 'vehicle', 'portrait', 'person', 'person_cell', 'sheet_cell',
          'icon', 'thumb', 'marker')
START = '<!-- PIXEL FLOOR START: written by tools/bohemia_pixel_floor.py --write (PLUMBER); the list only shrinks -->'
END = '<!-- PIXEL FLOOR END -->'


def blob_sha(data):
    return hashlib.sha1(b'blob %d\0' % len(data) + data).hexdigest()


# ------------------------------------------------------------------------------------- measuring
def painted(im):
    """(width, height) of the box of pixels at least half opaque; an image with no alpha is all painted."""
    import numpy as np
    if im.mode in ('RGBA', 'LA', 'PA') or (im.mode == 'P' and 'transparency' in im.info):
        a = np.asarray(im.convert('RGBA'))[..., 3] >= 128
        ys, xs = np.where(a)
        if not len(ys):
            return 0, 0
        return int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1)
    return im.size


def measure_bank():
    """the floor file: every number from his packs' painted pixels, plus the ruling's canvas-derived three."""
    import numpy as np
    from PIL import Image
    fam = {}
    for d in sorted(os.listdir(BANK)):
        fs = [f for f in glob.glob(os.path.join(BANK, d, '*.png')) if 'CONTACT' not in os.path.basename(f)]
        rows = []
        for f in fs:
            im = Image.open(f)
            w, h = painted(im)
            if w and h:
                rows.append((w, h, im.size[0], im.size[1]))
        if rows:
            fam[d] = np.array(rows)

    def cat(*names):
        return np.concatenate([fam[n] for n in names if n in fam])
    tiles, builds, lamps, props = cat('road', 'ground', 'marking'), cat('settlement', 'door'), cat('lamp'), cat('prop')
    long_ = lambda a: a[:, :2].max(1)
    floors = {
        'tile': dict(measure='painted long side', px=int(np.percentile(long_(tiles), 10)),
                     from_='10th percentile of %d road, ground and marking pieces' % len(tiles)),
        'building': dict(measure='painted long side', px=int(np.percentile(long_(builds), 10)),
                         from_='10th percentile of %d settlement and door pieces' % len(builds)),
        'lamp': dict(measure='painted height', px=int(np.percentile(lamps[:, 1], 10)),
                     from_='10th percentile of %d lamps' % len(lamps)),
        'thing': dict(measure='painted long side', px=int(long_(props).min()),
                      from_='the smallest of %d props he bought' % len(props)),
        'vehicle': dict(measure='painted long side', px=int(np.percentile(long_(props), 50)),
                        from_='the median of %d props (a car or a crate)' % len(props)),
        'portrait': dict(measure='canvas, both sides', px=int(np.percentile(tiles[:, 2:].max(1), 50)),
                         from_='the median canvas of %d pack tiles' % len(tiles)),
        'person': dict(measure='rig still: painted height', px=98,
                       from_='ruling: the 112 box, about 100 painted; records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md 98 px = 1.72 m'),
        'person_cell': dict(measure='cell, long side', px=112, from_='ruling: the 112 box'),
        'icon': dict(measure='painted long side', px=32, from_='ruling: the smallest prop canvas, 29 by 36, rounded up'),
        'marker': dict(measure='painted long side', px=40, from_='ruling: the smallest ground canvas, 40 by 38'),
    }
    floors['beast'] = dict(floors['thing'], from_=floors['thing']['from_'] + ' (a beast is held to the smallest thing)')
    floors['thumb'] = dict(floors['icon'], from_=floors['icon']['from_'] + ' (a face\'s thumb is icon-sized, law 8/28)')
    floors['sheet_cell'] = dict(floors['person_cell'])
    for v in floors.values():
        v['from'] = v.pop('from_')
    return {
        '_readme': 'THE PIXEL FLOOR (rule 105), re-measured from his packs by tools/bohemia_pixel_floor.py --measure; '
                   'painted = the box of pixels at least half opaque. Read by gates/pixel_floor_gate.py.',
        'bank': {k: {'pieces': int(len(v)), 'painted_long_p10': int(np.percentile(long_(v), 10)),
                     'painted_long_p50': int(np.percentile(long_(v), 50)), 'painted_long_min': int(long_(v).min())}
                 for k, v in fam.items()},
        'floors': floors}


# ------------------------------------------------------------------------------------- the kinds
def load_kinds(path=None):
    return json.load(open(path or KINDS))


def rig_kind(folder, kinds):
    for r in kinds['rig_kinds']:
        if fnmatch.fnmatchcase(folder, r['match']):
            return r['kind']
    return 'thing'


def classify(path, kinds, root=ROOT, rig_dirs=None):
    """(kind, why, extra) for a published picture path, relative to root."""
    d, b = os.path.dirname(path), os.path.basename(path)
    is_rig = (d in rig_dirs) if rig_dirs is not None else os.path.exists(os.path.join(root, d, 'rig.json'))
    if is_rig:
        if b.startswith('rig_'):
            if KEY.search(b):
                return 'key', 'a clip key: judged by its folder\'s stills, the same canvas', {}
            return rig_kind(d, kinds), 'a rig still', {'rig': True}
        if b.startswith('raw_') and not any(x.startswith('rig_') for x in os.listdir(os.path.join(root, d))):
            if KEY.search(b):
                return 'key', 'a clip key', {}
            return rig_kind(d, kinds), 'a rig still (raw_, no rig_ in the folder)', {'rig': True}
        if b.startswith(PASSES):
            return 'pass', 'a render pass beside the rig still', {}
    for r in kinds['rules']:
        if fnmatch.fnmatchcase(path, r['glob']):
            return r['kind'], r['why'], {k: v for k, v in r.items() if k not in ('glob', 'kind', 'why')}
    return None, 'NO KIND: add a rule to gates/pixel_floor_kinds.json', {}


def inline_kind(host, context, kinds):
    for r in kinds['inline']:
        if fnmatch.fnmatchcase(host, r['host']) and (not r.get('context') or r['context'] in context):
            return r['kind'], r['why']
    return None, 'NO KIND: add an inline rule to gates/pixel_floor_kinds.json'


def judge(kind, size, canvas, floors, rig=False, cell=None):
    """(ok, value, floor, measure)"""
    if kind in ('person', ) and rig:
        f = floors['person']
        return size[1] >= f['px'], size[1], f['px'], f['measure']
    if kind in ('person', 'person_cell'):
        f = floors['person_cell']
        v = max(canvas) if cell is None else cell
        return v >= f['px'], v, f['px'], f['measure']
    if kind == 'sheet_cell':
        f = floors['sheet_cell']
        v = cell if cell else 0
        return v >= f['px'], v, f['px'], 'the sheet\'s frame'
    if kind == 'portrait':
        f = floors['portrait']
        v = min(canvas)
        return v >= f['px'], v, f['px'], f['measure']
    if kind == 'lamp':
        f = floors['lamp']
        return size[1] >= f['px'], size[1], f['px'], f['measure']
    f = floors[kind]
    v = max(size)
    return v >= f['px'], v, f['px'], f['measure']


def broadest(folder, kind, root, rig_dirs, cache):
    """a rig thing's size is its broadest facing: the largest painted width and height over the folder's stills (a
    car head-on is narrower than its long side; the gate holds the thing, not one view of it)."""
    if folder in cache:
        return cache[folder]
    from PIL import Image
    names = sorted(os.listdir(os.path.join(root, folder)))
    stills = [n for n in names if n.startswith('rig_') and n.endswith('.png') and not KEY.search(n)]
    if not stills:
        stills = [n for n in names if n.startswith('raw_') and n.endswith('.png') and not KEY.search(n)]
    w = h = 0
    for n in stills:
        pw, ph = painted(Image.open(os.path.join(root, folder, n)))
        w, h = max(w, pw), max(h, ph)
    cache[folder] = (w, h)
    return cache[folder]


def sheet_frame(path, root=ROOT):
    """a sheet's cell from a JSON beside it that names 'frame'."""
    for j in glob.glob(os.path.join(root, os.path.dirname(path), '*.json')):
        try:
            d = json.load(open(j))
        except Exception:
            continue
        if isinstance(d, dict) and isinstance(d.get('frame'), int):
            return d['frame']
    return None


# ------------------------------------------------------------------------------------- the sweep
def published_files(root=ROOT):
    out = subprocess.run(['git', 'ls-files', '--cached', '--others', '--exclude-standard', '--'] + list(PUBLISHED),
                         cwd=root, capture_output=True, text=True).stdout.split('\n')
    return sorted(set(f for f in out if f and os.path.exists(os.path.join(root, f))))


def sweep(root=ROOT, kinds=None, floors=None, files=None):
    """every published picture and inlined picture: rows of dict(path, kind, why, judged, ok, value, floor, measure,
    size, canvas, sha)."""
    from PIL import Image
    kinds = kinds or load_kinds()
    floors = floors or json.load(open(FLOOR))['floors']
    files = files if files is not None else published_files(root)
    rig_dirs = {os.path.dirname(f) for f in files if os.path.basename(f) == 'rig.json'}
    broad = {}
    rows = []
    for f in files:
        if IMG.search(f):
            kind, why, extra = classify(f, kinds, root, rig_dirs)
            row = dict(path=f, kind=kind, why=why, judged=kind in JUDGED)
            if row['judged']:
                full = os.path.join(root, f)
                try:
                    im = Image.open(full)
                    canvas = im.size
                    size = painted(im)
                except Exception as e:
                    row.update(ok=False, value=0, floor=None, measure='unreadable: %s' % e)
                    rows.append(row)
                    continue
                cell = sheet_frame(f, root) if kind == 'sheet_cell' else None
                if extra.get('rig'):
                    size = broadest(os.path.dirname(f), kind, root, rig_dirs, broad)
                ok, v, fl, how = judge(kind, size, canvas, floors, rig=extra.get('rig', False), cell=cell)
                if extra.get('rig'):
                    how += ', the broadest of the folder\'s stills'
                row.update(ok=ok, value=v, floor=fl, measure=how, size=list(size), canvas=list(canvas))
                if not ok:
                    row['sha'] = blob_sha(open(full, 'rb').read())
            rows.append(row)
        elif TEXT.search(f):
            full = os.path.join(root, f)
            try:
                if os.path.getsize(full) > 64 << 20:
                    continue
                body = open(full, 'r', errors='ignore').read()
            except Exception:
                continue
            if 'data:image/' not in body:
                continue
            for i, m in enumerate(BLOB.finditer(body)):
                ctx = body[max(0, m.start() - 300):m.start()]
                kind, why = inline_kind(f, ctx, kinds)
                row = dict(path='%s#inline%d' % (f, i), kind=kind, why=why, judged=kind in JUDGED)
                if row['judged']:
                    data = base64.b64decode(m.group(1))
                    im = Image.open(io.BytesIO(data))
                    size, canvas = painted(im), im.size
                    ok, v, fl, how = judge(kind, size, canvas, floors)
                    row.update(ok=ok, value=v, floor=fl, measure=how, size=list(size), canvas=list(canvas))
                    if not ok:
                        row['sha'] = hashlib.sha1(data).hexdigest()
                rows.append(row)
    return rows


def lane_of(path, root=ROOT, kinds=None):
    """the lane a placeholder is routed to: the owners table in the kinds file (this clone is shallow, so git's
    history credits old files to whoever touched them last); nothing matched says so."""
    kinds = kinds or load_kinds()
    p = path.split('#')[0]
    for r in kinds.get('owners', []):
        if fnmatch.fnmatchcase(p, r['glob']):
            return r['lane']
    return 'NO OWNER LINE'


def placeholders_section(under, root=ROOT):
    lines = [START, '## UNDER THE PIXEL FLOOR (rule 105; PLUMBER [the pixel floor], gates/pixel_floor_gate.py)',
             'Every published picture painted smaller than its kind\'s floor on the day the gate landed (10/19), with its '
             'lane. Each is a placeholder: a new one is red, a changed one still under is red, and one that reaches its '
             'floor or leaves the site drops off this list. The floors are his packs re-measured '
             '(records/target/BOHEMIA_PIXEL_FLOOR.json).', '']
    by = {}
    for r in under:
        by.setdefault(r.get('lane', '?'), []).append(r)
    for lane in sorted(by):
        lines.append('### %s (%d under the floor)' % (lane, len(by[lane])))
        for r in sorted(by[lane], key=lambda r: r['path']):
            lines.append('- %s -- %s, %d against the floor %d (%s)' % (r['path'], r['kind'], r['value'], r['floor'], r['measure']))
        lines.append('')
    lines.append(END)
    return '\n'.join(lines)


def write_baseline(rows, root=ROOT):
    under = [r for r in rows if r.get('judged') and r.get('ok') is False]
    for r in under:
        r['lane'] = lane_of(r['path'], root)
    base = {'_readme': 'THE PIXEL FLOOR\'s baseline (gates/pixel_floor_gate.py): every published picture under its '
                       'kind\'s floor when the gate landed, by path, with its bytes\' hash. It only shrinks: a new entry '
                       'is refused, a changed one still under is red, one that is gone or over the floor is dropped by '
                       '--write.',
            'under': {r['path']: {'kind': r['kind'], 'value': r['value'], 'floor': r['floor'], 'sha': r['sha'],
                                  'lane': r['lane']} for r in under}}
    old = json.load(open(BASELINE))['under'] if os.path.exists(BASELINE) else None
    if old is not None:
        grew = [p for p in base['under'] if p not in old or old[p]['sha'] != base['under'][p]['sha']]
        if grew:
            raise SystemExit('REFUSED: the baseline only shrinks; new or changed under the floor:\n  ' + '\n  '.join(grew))
    with open(BASELINE, 'w') as f:
        json.dump(base, f, indent=1, sort_keys=True)
    text = open(PLACEHOLDERS).read()
    sec = placeholders_section(under, root)
    if START in text:
        text = text[:text.index(START)] + sec + text[text.index(END) + len(END):]
    else:
        text = text.rstrip('\n') + '\n\n' + sec + '\n'
    with open(PLACEHOLDERS, 'w') as f:
        f.write(text)
    return under


def main(argv):
    if '--measure' in argv:
        m = measure_bank()
        with open(FLOOR, 'w') as f:
            json.dump(m, f, indent=1)
        for k, v in m['floors'].items():
            print('  %-11s %4d  %s (%s)' % (k, v['px'], v['measure'], v['from']))
        return 0
    rows = sweep()
    if '--write' in argv:
        under = write_baseline(rows)
        print('baseline: %d under the floor; written into %s' % (len(under), os.path.relpath(PLACEHOLDERS, ROOT)))
        return 0
    judged = [r for r in rows if r['judged']]
    under = [r for r in judged if r['ok'] is False]
    nokind = [r for r in rows if r['kind'] is None]
    by = {}
    for r in rows:
        by[r['kind']] = by.get(r['kind'], 0) + 1
    print('%d pictures, %d judged, %d under the floor, %d with no kind' % (len(rows), len(judged), len(under), len(nokind)))
    print('  by kind: ' + ', '.join('%s %d' % (k, v) for k, v in sorted(by.items(), key=lambda x: -x[1])))
    for r in under:
        print('  UNDER  %-11s %4d < %-4d %s' % (r['kind'], r['value'], r['floor'], r['path']))
    for r in nokind[:40]:
        print('  NO KIND  ' + r['path'])
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
