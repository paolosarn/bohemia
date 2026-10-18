#!/usr/bin/env python3
"""MODS [the face apart] -- what the 64 px face costs inside the packed fight sheet and out of it (reads only).

    python3 tools/bohemia_mods_face_apart.py                 # bytes per look, the readers, the rig faces
    python3 tools/bohemia_mods_face_apart.py --json          # the numbers as JSON
    python3 tools/bohemia_mods_face_apart.py --split DIR     # also write body-only and face-only WebPs into DIR
                                                             # (for tools/bohemia_mods_face_apart_fetch.js; never
                                                             # into the repo)

RESEARCH ONLY (rule 22): nothing in the game calls this. It re-encodes each of the looks in slices/fight_people with
the bake's own settings (PIL lossless WebP, quality 100, method 6; tools/bohemia_fight_people_bake.js), checks the
re-encode is byte-identical to the committed file, then encodes the sheet without its face column and the 64 px face on
its own, so the bytes of splitting are measured with the encoder that made them, not guessed. It also lists every live
line that crops the face and how each one finds it, and which looks already have a face file of their own
(slices/rig_faces, RUN TWO 10/18).
"""
import os, io, re, sys, json, glob
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DIR = os.path.join(ROOT, 'slices', 'fight_people')
RIG = os.path.join(ROOT, 'slices', 'rig_faces')
ENC = dict(lossless=True, quality=100, method=6)

# every live line that reads the face block, and the way it finds it; a pattern that stops matching is reported
READERS = [
    ('slices/BOHEMIA_FIGHT.html', r'drawImage\(img, DB\.people\.frame \* DB\.people\.cols\.length, 0, DB\.people\.face\.size',
     'the bar and the turn strip, every look', 'frame x cols.length, face.size from the manifest'),
    ('slices/BOHEMIA_SETTLEMENT_SCREEN.html', r'drawImage\(im, im\.naturalWidth - 64, 0, 64, 64',
     'a hire card and a speaker with no portrait, only a look with no rig face', 'the image width minus 64, no manifest'),
    ('slices/BOHEMIA_ROSTER_SCREEN.html', r'drawImage\(im, im\.naturalWidth - 64, C\.FACE\.y, 64, 64',
     'a man on the crew screen, only a look with no rig face', 'the image width minus 64, y from the roster constant'),
    ('engine/bohemia_roster.js', r'FACE: \{ x: 1568, y: 0, s: 64 \}',
     'the roster constant (x is read by nobody)', 'x 1568 = 14 x 112, the sheet of 14 columns; it has 34'),
]
# lines that read a face from somewhere else, so they are not readers of the block
OTHER = [
    ('engine/bohemia_rig_faces.js', r"'rig_faces/' \+ look \+ '\.webp'", 'the rig face file, 128 px, one per look'),
    ('slices/BOHEMIA_DEMO.html', r'function keeperFaceSrc', 'the talking portrait: renderFace at 64 px, drawn, not read'),
]


def enc(im):
    b = io.BytesIO(); im.save(b, 'WEBP', **ENC); return b.getvalue()


def line_of(rel, pat):
    p = os.path.join(ROOT, rel)
    if not os.path.exists(p):
        return None
    for i, ln in enumerate(open(p, encoding='utf-8', errors='replace'), 1):
        if re.search(pat, ln):
            return i
    return None


def main():
    args = sys.argv[1:]
    split = args[args.index('--split') + 1] if '--split' in args else None
    if split:
        split = os.path.abspath(split)
        if split.startswith(ROOT + os.sep):
            sys.exit('--split writes outside the repo only')
        os.makedirs(os.path.join(split, 'body'), exist_ok=True); os.makedirs(os.path.join(split, 'face'), exist_ok=True)
    d = json.load(open(os.path.join(DIR, 'fight_people.json')))
    F, fs = d['frame'], d['face']['size']
    fx = len(d['cols']) * F
    rows, same = [], 0
    for key, lk in d['looks'].items():
        p = os.path.join(DIR, lk['file'])
        sheet = Image.open(p).convert('RGBA')
        packed = os.path.getsize(p)
        full = enc(sheet); same += len(full) == packed
        body_im, face_im = sheet.crop((0, 0, fx, sheet.height)), sheet.crop((fx, 0, fx + fs, fs))
        body, face = enc(body_im), enc(face_im)
        rf = os.path.join(RIG, key + '.webp')
        rows.append({'look': key, 'kind': lk['kind'], 'packed': packed, 'reencode_same': len(full) == packed,
                     'body': len(body), 'face': len(face), 'face_in_sheet': packed - len(body),
                     'split': len(body) + len(face), 'delta': len(body) + len(face) - packed,
                     'rig_face': os.path.getsize(rf) if os.path.exists(rf) else None})
        if split:
            open(os.path.join(split, 'body', lk['file']), 'wb').write(body)
            open(os.path.join(split, 'face', lk['file']), 'wb').write(face)
    tiny = len(enc(Image.new('RGBA', (1, 1))))
    S = lambda k: sum(r[k] for r in rows)
    rig = [r for r in rows if r['rig_face'] is not None]
    out = {'looks': len(rows), 'reencode_byte_identical': same, 'sheet_px': [fx + fs, rows and Image.open(
        os.path.join(DIR, d['looks'][rows[0]['look']]['file'])).height], 'face_px': [fs, fs], 'face_column_px': [fs, 224],
        'packed': S('packed'), 'body': S('body'), 'face': S('face'), 'split': S('split'), 'delta': S('delta'),
        'face_in_sheet': S('face_in_sheet'), 'smallest_webp': tiny,
        'rig_faces': {'looks': len(rig), 'bytes': sum(r['rig_face'] for r in rig),
                      'face_in_sheet_of_those': sum(r['face_in_sheet'] for r in rig)},
        'readers': [{'file': f, 'line': line_of(f, pat), 'what': w, 'how': h} for f, pat, w, h in READERS],
        'other': [{'file': f, 'line': line_of(f, pat), 'what': w} for f, pat, w in OTHER],
        'rows': rows}
    if '--json' in args:
        print(json.dumps(out, indent=1)); return
    print('MODS [the face apart]: %d looks, re-encode byte-identical on %d; sheet %dx%d, face %dx%d in a %dx%d column'
          % (out['looks'], same, out['sheet_px'][0], out['sheet_px'][1], fs, fs, fs, 224))
    print('%-16s %-7s %7s %7s %6s %7s %6s %8s' % ('look', 'kind', 'packed', 'body', 'face', 'split', 'delta', 'rig face'))
    for r in rows:
        print('%-16s %-7s %7d %7d %6d %7d %+6d %8s' % (r['look'], r['kind'], r['packed'], r['body'], r['face'], r['split'],
                                                     r['delta'], r['rig_face'] if r['rig_face'] is not None else '-'))
    print('%-16s %-7s %7d %7d %6d %7d %+6d' % ('ALL', '', out['packed'], out['body'], out['face'], out['split'], out['delta']))
    print('the face inside the sheet costs %d bytes over %d looks (%.1f%% of the sheets); alone it is %d; the smallest '
          'lossless WebP is %d bytes' % (out['face_in_sheet'], out['looks'], 100.0 * out['face_in_sheet'] / out['packed'],
                                        out['face'], tiny))
    print('rig faces already their own file: %d looks, %d bytes; the sheet faces of those looks: %d bytes'
          % (len(rig), out['rig_faces']['bytes'], out['rig_faces']['face_in_sheet_of_those']))
    print('readers of the face block:')
    for r in out['readers']:
        print('  %s:%s  %s  (%s)' % (r['file'], r['line'] if r['line'] else 'GONE', r['what'], r['how']))
    print('faces read from elsewhere:')
    for r in out['other']:
        print('  %s:%s  %s' % (r['file'], r['line'] if r['line'] else 'GONE', r['what']))


if __name__ == '__main__':
    main()
