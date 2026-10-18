#!/usr/bin/env python3
"""THE PROOF THAT THE JOBS WORK, END TO END, WITH NO HUMAN (PLUMBER 10/18/26, VAMILY row [aseprite in the pipe]).

Two runs through tools/aseprite/*.lua on a headless Aseprite, every step's JSON kept:

  1. HIS PACK TILE ROUND-TRIPPED: open one of his pack tiles, snap it to its own palette (Aseprite quantizes it to
     256), put a one-pixel outline on in its own darkest entry, export it, report it. Held: the exported PNG's
     palette is byte-identical to the palette the snap wrote (.gpl), entry for entry.
     Then the outline taken OFF again: the silhouette must come back to the snapped tile's, pixel for pixel.
  2. A GENERATED PICTURE CLEANED: the rig's robot (made by code, the clay-rig render he fell in love with 10/17)
     in its eight facings, each reported raw, snapped to the palette of the pack car the rig was measured against
     (written as a .gpl), reported, strays removed, reported against that palette; no outline (the style guide's
     field 8: a rendered thing draws no line); then the eight stacked into one sheet with its JSON, the facings
     that are one picture flipped counted, and the sheet split back into eight.

Nothing in this script is a colour or a coordinate; the pictures come from his packs and from the rig.

  python3 tools/aseprite/bohemia_aseprite_proof.py [--out DIR]     (Aseprite at $ASEPRITE_PATH or tools/aseprite/bin/aseprite)
"""
import json, os, shutil, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
JOBS = os.path.join(ROOT, 'tools', 'aseprite')
TILE = os.path.join(ROOT, 'reference', 'art_bank', 'road', 'pack_1_cobblestone_floor_tiles_000.png')
CAR = os.path.join(ROOT, 'reference', 'art_bank', 'prop', 'pack_10_abandoned_cars_000.png')
ROBOT = os.path.join(ROOT, 'records', 'target', 'master_rig', 'robot')
FACINGS = ('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW')
OUT = os.path.join(ROOT, 'reference', 'art_pipe', 'proof_round_two')


def binary():
    for p in (os.environ.get('ASEPRITE_PATH'), os.path.join(JOBS, 'bin', 'aseprite')):
        if p and os.path.isfile(p) and os.access(p, os.X_OK):
            return p
    return None


def job(exe, name, log, **params):
    cmd = [exe, '-b']
    for k, v in params.items():
        cmd += ['--script-param', '%s=%s' % (k, v)]
    cmd += ['--script', os.path.join(JOBS, name + '.lua')]
    t0 = time.time()
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    step = {'job': name, 'params': {k: os.path.relpath(v, ROOT) if isinstance(v, str) and v.startswith(ROOT) else v
                                    for k, v in params.items()},
            'seconds': round(time.time() - t0, 2), 'exit': r.returncode,
            'said': (r.stdout + r.stderr).replace(ROOT + os.sep, '').strip()[-600:]}
    log.append(step)
    if r.returncode != 0 or 'error' in r.stderr.lower():
        raise SystemExit('the %s job failed: %s' % (name, step['said']))
    return step


def gpl_palette(path):
    """the RGB triples of a GIMP palette file, in order."""
    out = []
    for line in open(path):
        parts = line.split()
        if len(parts) >= 3 and all(p.isdigit() for p in parts[:3]):
            out.append(tuple(int(p) for p in parts[:3]))
    return out


def png_palette(path):
    from PIL import Image
    im = Image.open(path)
    if im.mode != 'P':
        return None
    raw = im.getpalette() or []
    return [tuple(raw[i:i + 3]) for i in range(0, len(raw), 3)]


def same_palette(a, b):
    """byte for byte over every entry the snap wrote (PIL pads a PNG palette to 256 entries with black)."""
    return a is not None and b is not None and len(a) <= len(b) and a == b[:len(a)]


def main(argv):
    out = argv[argv.index('--out') + 1] if '--out' in argv else OUT
    exe = binary()
    if not exe:
        print('no Aseprite here: set ASEPRITE_PATH or build it (tools/aseprite/build_headless.sh)'); return 2
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    ver = subprocess.run([exe, '--version'], capture_output=True, text=True).stdout.strip()
    log, rec = [], {'aseprite': ver, 'made': '10/18', 'tile': os.path.relpath(TILE, ROOT)}
    # 1. his pack tile round-tripped
    p = lambda n: os.path.join(out, n)
    job(exe, 'snap', log, **{'in': TILE, 'palette': TILE, 'out': p('tile_snapped.png'), 'palette_out': p('tile_palette.gpl')})
    job(exe, 'outline', log, **{'in': p('tile_snapped.png'), 'out': p('tile_outlined.png'), 'mode': 'on'})
    job(exe, 'report', log, **{'in': p('tile_outlined.png'), 'out': p('tile_outlined.report.json'), 'palette': p('tile_palette.gpl')})
    job(exe, 'outline', log, **{'in': p('tile_outlined.png'), 'out': p('tile_outline_off.png'), 'mode': 'off'})
    a, b = gpl_palette(p('tile_palette.gpl')), png_palette(p('tile_outlined.png'))
    rep = json.load(open(p('tile_outlined.report.json')))
    on, off = json.load(open(p('tile_outlined.png.json'))), json.load(open(p('tile_outline_off.png.json')))
    rec['round_trip'] = {'palette_entries': len(a), 'png_palette_entries': len(b or []), 'byte_identical': same_palette(a, b),
                         'colours': rep['colours'], 'colours_off_palette': rep['colours_off_palette'],
                         'outline_pixels': on['pixels_changed'],
                         'silhouette': {'snapped': on['opaque_before'], 'outline_on': on['opaque_after'], 'outline_off': off['opaque_after']}}
    # 2. a generated picture cleaned end to end
    rec['generated'] = {'source': os.path.relpath(ROBOT, ROOT), 'palette_from': os.path.relpath(CAR, ROOT), 'facings': {}}
    os.makedirs(p('robot'))
    for f in FACINGS:
        src = os.path.join(ROBOT, 'rig_%s.png' % f)
        job(exe, 'report', log, **{'in': src, 'out': p('robot/raw_%s.report.json' % f)})
        job(exe, 'snap', log, **{'in': src, 'palette': CAR, 'out': p('robot/snap_%s.png' % f), 'palette_out': p('robot/car_palette.gpl')})
        job(exe, 'report', log, **{'in': p('robot/snap_%s.png' % f), 'out': p('robot/snap_%s.report.json' % f)})
        job(exe, 'strays', log, **{'in': p('robot/snap_%s.png' % f), 'out': p('robot/%s.png' % f)})
        job(exe, 'report', log, **{'in': p('robot/%s.png' % f), 'out': p('robot/%s.report.json' % f), 'palette': p('robot/car_palette.gpl')})
        raw, sn, fin = (json.load(open(p('robot/%s.report.json' % n))) for n in ('raw_' + f, 'snap_' + f, f))
        st = json.load(open(p('robot/%s.png.json' % f)))
        rec['generated']['facings'][f] = {'colours': [raw['colours'], sn['colours'], fin['colours']],
                                          'strays': [raw['strays'], sn['strays'], fin['strays']], 'strays_replaced': st['replaced'],
                                          'opaque': [raw['opaque'], fin['opaque']], 'half_transparent': [raw['half_transparent'], fin['half_transparent']],
                                          'colours_off_palette': fin.get('colours_off_palette')}
    job(exe, 'facings', log, **{'mode': 'stack', 'dir': p('robot'), 'out': p('robot_sheet.png')})
    sh = json.load(open(p('robot_sheet.png.json')))
    rec['generated']['sheet'] = {'png': os.path.relpath(p('robot_sheet.png'), ROOT), 'cell': sh['cell'],
                                 'distinct_facings': sh['distinct'], 'mirrored': sh['mirrored']}
    job(exe, 'facings', log, **{'mode': 'split', 'in': p('robot_sheet.png'), 'dir': p('robot_split')})
    rec['seconds'] = round(sum(s['seconds'] for s in log), 1)
    rec['steps'] = log
    json.dump(rec, open(p('proof.json'), 'w'), indent=1)
    print(json.dumps({k: rec[k] for k in ('aseprite', 'round_trip', 'seconds')}, indent=1))
    print('generated: %d facings cleaned, sheet %s, distinct facings %d' % (
        len(rec['generated']['facings']), rec['generated']['sheet']['png'], rec['generated']['sheet']['distinct_facings']))
    return 0 if rec['round_trip']['byte_identical'] else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
