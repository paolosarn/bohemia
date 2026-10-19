#!/usr/bin/env python3
"""THE TOOLCHAIN (PLUMBER 10/19/26, VAMILY row [the toolchain]; rule 108, Paolo 10/10: outside help implemented
into our system). The row's end state is a chat that runs ONE script for a tile from his packs and a sound from a
real recording, every tool with its one install line, licences riding, nothing into the game. This holds it.

  K1  THE DOOR: tools/bohemia_toolchain.py doctor exits 0 on this box (every tool but Aseprite, which has a
      fallback, is READY), and every tool row carries an install line and a licence; the generator rows say
      HELD by rule 115.
  K2  THE README: tools/TOOLCHAIN.md names every command, every tool, the held half and the fifteen minutes.
  K3  THE TILE, END TO END: clean on the proof's inputs into a throwaway folder (the fallback snap, so the answer
      does not depend on whether Aseprite is on the box): 0 pixels off the pack lock, the joins inside his own
      tile's own pack's band, the sheet written, the snapped tile pixel for pixel the committed proof's.
  K4  THE SOUND, END TO END: sound on the proof's stem into a throwaway folder: the peak under -1 dBFS, no click
      at either end (the first and last millisecond under -30 dB), the licence line beside it is CC0 with its
      Freesound URL, the samples the committed proof's (correlation 0.999, the length within 1 percent).
  K5  THE REFUSALS, planted: a stem with no licence row, a stem whose row is CC BY, an --out in slices/ and in
      engine/ (rule 100; nothing written there), one pixel off the lock counted, the tile darkened 50 and 80
      percent left to right read as a SEAM against its pack, his own tile read as joining.
  K6  THE KEYS: .env is ignored by git (the row: keys live in .env, never committed).
  K7  A FRESH BOX CAN RUN IT: the session hook installs tools/requirements_toolchain.txt, and every module that
      file names is one the doctor checks.

    python3 gates/toolchain_gate.py
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, 'tools'))
TOOL = 'tools/bohemia_toolchain.py'
README = 'tools/TOOLCHAIN.md'
PROOF = 'reference/toolchain_proof'
HOOK = 'tools/bohemia_session_setup.sh'
REQ = 'tools/requirements_toolchain.txt'

passed = 0
fails = []


def ok(name, cond, why=''):
    global passed
    if cond:
        passed += 1
        print('  ok    ' + name)
    else:
        fails.append(name)
        print('  FAIL  ' + name + ('\n        ' + why if why else ''))


def refused(fn):
    try:
        fn()
    except SystemExit as e:
        return 'REFUSED' in str(e)
    return False


def main():
    import bohemia_toolchain as T

    # K1 ------------------------------------------------------------------------------------------------
    r = subprocess.run([sys.executable, TOOL, 'doctor'], capture_output=True, text=True, timeout=120)
    ok('K1 the doctor runs and every leg is ready on this box (exit %d)' % r.returncode, r.returncode == 0,
       (r.stdout + r.stderr)[-600:] + '\n        one line: python3 tools/bohemia_toolchain.py setup')
    bad = [t['name'] for t in T.TOOLS if not (t.get('install') and t.get('licence') and t.get('why'))]
    ok('K1 every tool row carries its install line, licence and why (%d rows)' % len(T.TOOLS), not bad, ', '.join(bad))
    held = [t for t in T.TOOLS if t['kind'] == 'held']
    ok('K1 the generator half is HELD by rule 115 (%d rows)' % len(held),
       held and all('rule 115' in t['install'] for t in held))
    unchecked = [t['name'] for t in T.TOOLS if t['kind'] in ('py', 'bin', 'repo') and not t['check']]
    ok('K1 every installable row has a check the doctor runs', not unchecked, ', '.join(unchecked))

    # K2 ------------------------------------------------------------------------------------------------
    txt = open(README).read() if os.path.exists(README) else ''
    need = ['bohemia_toolchain.py doctor', 'bohemia_toolchain.py setup', 'bohemia_toolchain.py clean',
            'bohemia_toolchain.py sound', 'bohemia_toolchain.py proof', 'rule 115', 'rule 100', 'FIFTEEN MINUTES']
    need += [t['name'] for t in T.TOOLS]
    miss = [n for n in need if n not in txt]
    ok('K2 the README names every command, every tool, the held half and the fifteen minutes', not miss,
       'missing: ' + ', '.join(miss))

    tmp = tempfile.mkdtemp(prefix='toolchain_gate_')
    try:
        # K3 --------------------------------------------------------------------------------------------
        import numpy as np
        from PIL import Image
        t = T.clean(T.PROOF_TILE, T.PROOF_LOCK, os.path.join(tmp, 'tile'), 'ground', force_fallback=True)
        ok('K3 the tile: 0 of %d pixels off his burnt-ground pack\'s colours' % t['opaque_pixels'],
           t['off_palette_pixels'] == 0, '%d off' % t['off_palette_pixels'])
        ok('K3 the tile joins inside its own pack\'s band (%.3f, band %.3f of %s)' % (t['joins']['ratio'] or -1, t['joins']['packs_band'] or -1, t['joins']['ruler']),
           t['joins']['verdict'] == 'JOINS' and t['joins']['ruler'] == T.pack_of(T.PROOF_TILE))
        sheet = os.path.join(tmp, 'tile', os.path.basename(t['sheet']))
        ok('K3 the sheet is written beside the twin', os.path.exists(sheet))
        mine = np.asarray(Image.open(os.path.join(tmp, 'tile', os.path.basename(t['snapped']))).convert('RGBA'))
        ref_p = os.path.join(PROOF, os.path.basename(t['snapped']))
        same = os.path.exists(ref_p) and np.array_equal(mine, np.asarray(Image.open(ref_p).convert('RGBA')))
        ok('K3 the snapped tile is the committed proof, pixel for pixel', same,
           'rerun: python3 tools/bohemia_toolchain.py proof --out ' + PROOF)
        cm = json.load(open(os.path.join(PROOF, 'pack_3_grass_and_ground_tiles_001__clean.json')))
        ok('K3 the committed proof says the fallback ran and nothing was off the lock',
           cm['snap'].startswith('fallback') and cm['off_palette_pixels'] == 0)

        # K4 --------------------------------------------------------------------------------------------
        try:
            import soundfile as sf
            have_audio = True
        except Exception:
            have_audio = False
        if not have_audio:
            ok('K4 the sound leg can run here', False, 'NOT INSTALLED: python3 tools/bohemia_toolchain.py setup')
        else:
            s = T.sound(T.PROOF_STEM, os.path.join(tmp, 'sound'), room='small', wet=0.3, spd=1.0, peak=-2.0, win='last')
            ok('K4 the sound: peak %.2f dB and the mp3 %.2f dB, both under -1 dBFS' % (s['peak_db'], s['mp3_peak_db']),
               s['peak_db'] <= -1.0 and s['mp3_peak_db'] <= -1.0)
            ok('K4 no click: first ms %.1f dB, last ms %.1f dB (under -30)' % (s['first_1ms_db'], s['last_1ms_db']),
               s['first_1ms_db'] <= -30 and s['last_1ms_db'] <= -30)
            lic = open(os.path.join(tmp, 'sound', T.PROOF_STEM + '__LICENCE.txt')).read()
            ok('K4 the licence line rides beside it, CC0 with its Freesound URL',
               'licence CC0' in lic and 'freesound.org' in lic and s['source']['licence'] == 'CC0')
            a, _ = sf.read(os.path.join(tmp, 'sound', T.PROOF_STEM + '.flac'), dtype='float32')
            ref = os.path.join(PROOF, T.PROOF_STEM + '.flac')
            if os.path.exists(ref):
                b, _ = sf.read(ref, dtype='float32')
                n = min(len(a), len(b))
                c = float(np.corrcoef(a[:n], b[:n])[0, 1]) if n > 16 else 0.0
                okk = abs(len(a) - len(b)) <= 0.01 * max(len(a), len(b)) and c >= 0.999
                ok('K4 the sound is the committed proof (correlation %.4f, %d vs %d samples)' % (c, len(a), len(b)), okk)
            else:
                ok('K4 the committed proof sound is on disk', False, ref)

        # K5 --------------------------------------------------------------------------------------------
        ok('K5 a stem with no licence row is refused',
           refused(lambda: T.sound('9-999999-Z-99', os.path.join(tmp, 'x'))))
        planted = os.path.join(tmp, 'LICENCES.md')
        with open(planted, 'w') as f:
            f.write('| stem | category | source file | author | Freesound | licence |\n|---|---|---|---|---|---|\n'
                    '| %s | Door knock | x.wav | someone | http://www.freesound.org/x | CC BY 3.0 |\n' % T.PROOF_STEM)
        ok('K5 a stem whose row is CC BY is refused (planted licence file)',
           refused(lambda: T.sound(T.PROOF_STEM, os.path.join(tmp, 'y'), licences=planted)))
        for top in ('slices', 'engine'):
            target = os.path.join(ROOT, top, '_toolchain_gate_must_not_exist')
            r1 = refused(lambda: T.clean(T.PROOF_TILE, T.PROOF_LOCK, target, 'ground', force_fallback=True))
            r2 = refused(lambda: T.sound(T.PROOF_STEM, target))
            ok('K5 rule 100: --out in %s/ is refused by both legs and nothing is written' % top,
               r1 and r2 and not os.path.exists(target))
        pal = T.pack_palette(T.PROOF_LOCK)
        snapped = os.path.join(tmp, 'tile', os.path.basename(t['snapped']))
        arr = np.asarray(Image.open(snapped).convert('RGBA')).copy()
        ys, xs = np.where(arr[..., 3] >= 128)
        y0, x0 = int(ys[len(ys) // 2]), int(xs[len(xs) // 2])
        keys = set(map(tuple, pal.tolist()))
        off = next(c for c in ((255, 0, 255), (0, 255, 0), (1, 2, 3), (254, 1, 253)) if c not in keys)
        arr[y0, x0, :3] = off
        one = os.path.join(tmp, 'one_off.png')
        Image.fromarray(arr, 'RGBA').save(one)
        ok('K5 one pixel off the lock is counted (planted)', T.off_palette(one, pal)[0] == 1)
        box = T.core_box(arr)
        tb, bb, lb, rb = box
        ruler, band = T.join_ruler(T.PROOF_TILE, T.PROOF_LOCK, 'ground')
        for k in (0.5, 0.8):
            seam = arr.copy()
            ramp = np.linspace(0, 1, rb - lb)[None, :, None]
            seam[tb:bb, lb:rb, :3] = (seam[tb:bb, lb:rb, :3] * (1 - k * ramp)).astype(np.uint8)
            jr = T.join_ratio(seam)
            ok('K5 a seam (the tile darkened %d%% left to right) reads past its pack\'s band (planted: %.2f against %.2f of %s)'
               % (int(k * 100), jr or -1, band or -1, ruler), jr is not None and band is not None and jr > band)
        jr0 = T.join_ratio(np.asarray(Image.open(T.PROOF_TILE).convert('RGBA')))
        ok('K5 his own grass tile joins inside its pack\'s band (%.2f against %.2f)' % (jr0 or -1, band or -1),
           jr0 is not None and band is not None and jr0 <= band)

        # K6 --------------------------------------------------------------------------------------------
        r = subprocess.run(['git', 'check-ignore', '-q', '.env'], cwd=ROOT)
        ok('K6 .env is ignored by git (keys never committed)', r.returncode == 0)

        # K7 --------------------------------------------------------------------------------------------
        hook = open(HOOK).read()
        ok('K7 the session hook installs ' + REQ, REQ in hook)
        mods = [ln.strip() for ln in open(REQ) if ln.strip() and not ln.startswith('#')]
        names = {'scipy': 'scipy', 'soundfile': 'soundfile', 'pedalboard': 'pedalboard', 'pyroomacoustics': 'pyroomacoustics'}
        checked = {m for t in T.TOOLS if t['kind'] == 'py' for m in t['check']}
        ok('K7 every module in the requirements is one the doctor checks (%s)' % ', '.join(mods),
           all(names.get(m, m) in checked for m in mods))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
        for top in ('slices', 'engine'):
            shutil.rmtree(os.path.join(ROOT, top, '_toolchain_gate_must_not_exist'), ignore_errors=True)

    print('\nTHE TOOLCHAIN: %d passed, %d failed' % (passed, len(fails)))
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
