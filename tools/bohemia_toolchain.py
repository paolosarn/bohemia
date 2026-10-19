#!/usr/bin/env python3
"""THE TOOLCHAIN -- ONE SCRIPT A CHAT RUNS FOR A TILE FROM HIS PACKS AND A SOUND FROM A REAL RECORDING
(PLUMBER 10/19/26, VAMILY row [the toolchain], rule 108: outside help implemented into our system).

Every piece this calls already lives in the repo and belongs to a lane; this file is the one door to them,
so a chat on a fresh box runs one line instead of reading five READMEs. Nothing here goes into the game
(rule 100): --out under slices/ or engine/ is refused. README: tools/TOOLCHAIN.md.

    python3 tools/bohemia_toolchain.py doctor                 what is installed, the one line for what is not
    python3 tools/bohemia_toolchain.py setup                  installs the missing Python half (one pip line)
    python3 tools/bohemia_toolchain.py clean --in PIC.png --pack PIECE.png [--family ground] --out DIR
                                                              step 6 of the ten steps on a picture: snapped to the
                                                              pack piece's colours, its joins and its tells read
                                                              against his own tiles, the sheet beside the twin
    python3 tools/bohemia_toolchain.py sound --stem STEM [--win auto|last --room small --wet 0.3 --speed 1 --peak -2] --out DIR
                                                              a CC0 recording from the bank through tape and a
                                                              room, its licence line beside it
    python3 tools/bohemia_toolchain.py proof --out DIR        one tile and one sound end to end, no human

THE TILE LEG (clean). THE SNAP: Aseprite's snap.lua when ASEPRITE_PATH runs (tools/aseprite, built on the
free runner), else this file's fallback: the pack piece's own colours (Pillow's median cut to 256 when it
holds more, the same 256 Aseprite takes), every opaque pixel to its nearest entry, no dither, alpha cut at
half. No colour is typed here; every one comes from his piece. THE JOINS: the picture's opaque core laid
against itself left to right and top to bottom, the jump across the join over the median jump inside it;
his own tiles are the ruler (the family's 90th percentile, measured on the bank when the band file is
missing). THE TELLS: tools/bohemia_not_vibe_coded.py's sprite report, judged by its pack band
(band_verdict). THE SHEET: the pack piece left, the snapped picture right, at 1:1, and three by three of it.

THE SOUND LEG (sound). The recording is one of the bank's CC0 clips (reference/library/sound_bank/esc50_cc0,
LICENCES.md); a stem with no row there, or a row that is not CC0, is refused before anything is read. The
chain is SOUNDS' own (tools/bohemia_from_a_recording.py render_oneshot: window, high-pass 120 Hz, tape,
low-pass 9 kHz, a modelled room, the limiter), imported, never copied, so a change there is a change here.

HELD (rule 115, newest date wins): the generator half of the row (Retro Diffusion, PixelLab) makes no
picture here; every character, beast, vehicle and prop comes from DIRECTION's master rig and the ground
and buildings stay on his packs. doctor lists them as HELD so no chat goes looking.
"""
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
BANK_DIR = os.path.join(ROOT, 'reference', 'library', 'sound_bank', 'esc50_cc0')
LICENCES = os.environ.get('BOHEMIA_TOOLCHAIN_LICENCES', os.path.join(BANK_DIR, 'LICENCES.md'))
SEAM_BANDS = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_TOOLCHAIN_SEAM_BANDS.json')
ART_BANK = os.path.join(ROOT, 'reference', 'art_bank')
FENCED = ('slices', 'engine')

# THE TOOLS, as data: what it is for, how a chat checks it, the one line that installs it, its licence.
# kind: py (a module imports), bin (an executable runs), repo (a file in this repo), held (rule 115), wall (the
# network policy refuses its host here; measured, the line says where it was measured).
TOOLS = [
    dict(name='Pillow + numpy', kind='py', check=['PIL', 'numpy'], install='python3 -m pip install -r gates/requirements.txt',
         licence='Pillow MIT-CMU (HPND), numpy BSD-3', why='every picture leg'),
    dict(name='scipy + soundfile', kind='py', check=['scipy', 'soundfile'], install='python3 -m pip install -r tools/requirements_toolchain.txt',
         licence='scipy BSD-3, soundfile BSD-3 (libsndfile LGPL-2.1, bundled)', why='reading the recordings, the filters'),
    dict(name='Pedalboard', kind='py', check=['pedalboard'], install='python3 -m pip install -r tools/requirements_toolchain.txt',
         licence='GPL-3.0 (a tool we run; nothing of it ships in the game)', why='the high-pass, low-pass, compressor and limiter'),
    dict(name='pyroomacoustics', kind='py', check=['pyroomacoustics'], install='python3 -m pip install -r tools/requirements_toolchain.txt',
         licence='MIT', why='the modelled room (EchoThief\'s real rooms are behind the wall)'),
    dict(name='ffmpeg', kind='bin', check=['ffmpeg', '-version'], install='sudo apt-get install -y ffmpeg',
         licence='LGPL-2.1+ (libmp3lame LGPL)', why='the mp3 a card plays, FLAC for the bank; stands in for SoX, whose effects the chain does not use'),
    dict(name='Aseprite', kind='bin', check=['$ASEPRITE_PATH', '--version'], install='tools/aseprite/build_headless.sh (README there; the free runner builds and caches it: Actions "aseprite")',
         licence='Aseprite EULA: compiled for our own use, the binary never committed', why='the snap, the outline, the strays, the eight facings; without it the snap falls back to this file'),
    dict(name='the Aseprite jobs', kind='repo', check=['tools/aseprite/snap.lua', 'tools/aseprite/README.md'], install='in the repo',
         licence='ours', why='seven Lua jobs, one line each'),
    dict(name='the tells', kind='repo', check=['tools/bohemia_not_vibe_coded.py', 'records/target/BOHEMIA_NOT_VIBE_CODED_BANDS.json'], install='in the repo',
         licence='ours', why='D1 to D9 judged by the pack band'),
    dict(name='the recording chain', kind='repo', check=['tools/bohemia_from_a_recording.py', 'tools/bohemia_from_a_recording_sources.json'], install='in the repo (SOUNDS\')',
         licence='ours', why='the tape and the room'),
    dict(name='the CC0 bank', kind='repo', check=['reference/library/sound_bank/esc50_cc0/LICENCES.md'], install='in the repo (SOUNDS\')',
         licence='CC0 per clip, a Freesound URL and author per row', why='the recordings'),
    dict(name='the vendored Aseprite server', kind='repo', check=['tools/aseprite_mcp/README.md'], install='in the repo',
         licence='MIT', why='163 tools from Python, for jobs past the seven'),
    dict(name='Retro Diffusion', kind='held', check=[], install='HELD by rule 115: no picture generator; the rig and the packs are the sources',
         licence='per-call credits', why='was the generator half of this row'),
    dict(name='PixelLab', kind='held', check=[], install='HELD by rule 115 (and its API without a subscription was never confirmed)',
         licence='subscription', why='was the eight-facing rotate'),
    dict(name='Freesound, Sonniss GDC, EchoThief', kind='wall', check=[], install='behind this container\'s network wall (SOUNDS measured 10/17: CONNECT refused); the bank is the CC0 half of ESC-50, kept as FLAC',
         licence='CC0 only is taken', why='more recordings and real rooms, on a machine that can reach them'),
    dict(name='Chow Tape Model', kind='wall', check=[], install='no headless Linux scan; the tape is SOUNDS\' own stage (head bump, saturation, wow and flutter, a 2:1 compressor)',
         licence='BSD-3', why='a tape plug-in'),
    dict(name='Pyxelate, Tiled\'s rasterizer, an autotiler', kind='wall', check=[], install='not installed on purpose: the rig renders at its native size and the snap covers the rest; the boards are JSON, not TMX; Tilesetter ($12.99) is a desktop app and was never bought',
         licence='-', why='round three\'s list, measured as not needed'),
]


def _mod_ok(name):
    try:
        __import__(name)
        return True
    except Exception:
        return False


def aseprite_path():
    p = os.environ.get('ASEPRITE_PATH') or os.path.join(ROOT, 'tools', 'aseprite', 'bin', 'aseprite')
    if not (os.path.isfile(p) and os.access(p, os.X_OK)):
        return None
    try:
        r = subprocess.run([p, '--version'], capture_output=True, text=True, timeout=20)
        return p if r.returncode == 0 else None
    except Exception:
        return None


def tool_state(t):
    if t['kind'] == 'py':
        return all(_mod_ok(m) for m in t['check'])
    if t['kind'] == 'bin':
        if t['check'][0] == '$ASEPRITE_PATH':
            return aseprite_path() is not None
        return shutil.which(t['check'][0]) is not None
    if t['kind'] == 'repo':
        return all(os.path.exists(os.path.join(ROOT, f)) for f in t['check'])
    return None


def doctor(out=print):
    rows = []
    for t in TOOLS:
        s = tool_state(t)
        mark = {True: 'READY  ', False: 'MISSING', None: 'HELD   ' if t['kind'] == 'held' else 'WALL   '}[s]
        rows.append(dict(name=t['name'], state=mark.strip(), install=t['install'], licence=t['licence']))
        out('%s %-34s %s' % (mark, t['name'], '' if s else t['install']))
    missing = [r for r in rows if r['state'] == 'MISSING' and r['name'] != 'Aseprite']
    out('')
    out('MISSING: none. Every leg runs.' if not missing else
        'MISSING: %d. One line: python3 tools/bohemia_toolchain.py setup' % len(missing))
    if not any(r['name'] == 'Aseprite' and r['state'] == 'READY' for r in rows):
        out('Aseprite is not on this box: the snap uses the fallback in this file (the manifest says which ran).')
    return rows


def setup():
    need = [t for t in TOOLS if t['kind'] == 'py' and not tool_state(t)]
    if not need:
        print('setup: nothing to install')
        return 0
    for req in ('gates/requirements.txt', 'tools/requirements_toolchain.txt'):
        r = subprocess.run([sys.executable, '-m', 'pip', 'install', '--quiet', '--disable-pip-version-check', '-r',
                            os.path.join(ROOT, req)])
        if r.returncode:
            print('setup: pip failed on', req)
            return 1
    still = [t['name'] for t in TOOLS if t['kind'] == 'py' and not tool_state(t)]
    print('setup: ready' if not still else 'setup: still missing ' + ', '.join(still))
    return 1 if still else 0


def fenced(out_dir):
    """rule 100: nothing from here goes into the game."""
    rel = os.path.relpath(os.path.abspath(out_dir), ROOT)
    top = rel.split(os.sep)[0]
    return top in FENCED and not rel.startswith('..')


def sha(path):
    with open(path, 'rb') as f:
        return hashlib.sha1(f.read()).hexdigest()[:12]


# ---------------------------------------------------------------- THE TILE LEG ------------------------------
def pack_palette(piece_path):
    """the pack piece's own colours: every distinct opaque colour, or Pillow's median cut to 256 when it holds
    more (Aseprite's snap.lua quantizes the piece to 256 the same way). Returns an (N, 3) uint8 array."""
    import numpy as np
    from PIL import Image
    im = Image.open(piece_path).convert('RGBA')
    a = np.asarray(im)
    op = a[..., 3] >= 128
    cols = np.unique(a[..., :3][op].reshape(-1, 3), axis=0)
    if len(cols) <= 256:
        return cols.astype(np.uint8)
    flat = Image.fromarray(a[..., :3][op].reshape(1, -1, 3).astype(np.uint8), 'RGB')
    q = flat.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    pal = np.asarray(q.getpalette()[:3 * 256], dtype=np.uint8).reshape(-1, 3)
    used = np.unique(np.asarray(q).reshape(-1))
    return pal[used]


def snap_fallback(in_path, palette, out_path):
    """every opaque pixel to its nearest palette entry (RGB distance), no dither; alpha cut at half."""
    import numpy as np
    from PIL import Image
    a = np.asarray(Image.open(in_path).convert('RGBA')).copy()
    op = a[..., 3] >= 128
    px = a[..., :3][op].astype(np.int32)
    pal = palette.astype(np.int32)
    best = np.empty(len(px), dtype=np.int64)
    for i in range(0, len(px), 8192):
        d = ((px[i:i + 8192, None, :] - pal[None, :, :]) ** 2).sum(-1)
        best[i:i + 8192] = d.argmin(1)
    rgb = a[..., :3]
    rgb[op] = palette[best]
    a[..., 3] = np.where(op, 255, 0).astype(np.uint8)
    rgb[~op] = 0
    Image.fromarray(a, 'RGBA').save(out_path)
    return 'fallback (tools/bohemia_toolchain.py snap_fallback, nearest RGB, no dither)'


def snap_aseprite(in_path, piece_path, out_path, ase):
    gpl = os.path.splitext(out_path)[0] + '.gpl'
    r = subprocess.run([ase, '-b', '--script-param', 'in=' + in_path, '--script-param', 'palette=' + piece_path,
                        '--script-param', 'out=' + out_path, '--script-param', 'palette_out=' + gpl,
                        '--script', os.path.join(ROOT, 'tools', 'aseprite', 'snap.lua')],
                       capture_output=True, text=True, timeout=120)
    if r.returncode or not os.path.exists(out_path):
        raise RuntimeError('aseprite snap failed: ' + (r.stderr or r.stdout)[-400:])
    return 'aseprite %s (tools/aseprite/snap.lua)' % os.path.basename(ase)


def off_palette(img_path, palette):
    """how many opaque pixels carry a colour that is not in the palette: the lock, verified, not assumed."""
    import numpy as np
    from PIL import Image
    a = np.asarray(Image.open(img_path).convert('RGBA'))
    op = a[..., 3] >= 128
    cols = a[..., :3][op].reshape(-1, 3)
    keys = (cols[:, 0].astype(np.int64) << 16) | (cols[:, 1].astype(np.int64) << 8) | cols[:, 2]
    pk = (palette[:, 0].astype(np.int64) << 16) | (palette[:, 1].astype(np.int64) << 8) | palette[:, 2]
    return int((~np.isin(keys, pk)).sum()), int(op.sum())


def core_box(a):
    """the largest fully opaque rectangle found by trimming the most transparent edge, one line at a time;
    his pack tiles carry a ragged fringe that overlaps the neighbour, the core is what has to join.
    Returns (top, bottom, left, right) or None."""
    op = a[..., 3] >= 128
    t, b, l, r = 0, op.shape[0], 0, op.shape[1]
    while b - t > 8 and r - l > 8:
        s = op[t:b, l:r]
        if s.all():
            return t, b, l, r
        e = {'t': (~s[0]).mean(), 'b': (~s[-1]).mean(), 'l': (~s[:, 0]).mean(), 'r': (~s[:, -1]).mean()}
        k = max(e, key=e.get)
        if k == 't':
            t += 1
        elif k == 'b':
            b -= 1
        elif k == 'l':
            l += 1
        else:
            r -= 1
    return None


def opaque_core(a):
    box = core_box(a)
    return None if box is None else a[box[0]:box[1], box[2]:box[3]]


def join_ratio(a):
    """the jump across the join (the core's last column against its first, last row against first) over the
    median jump between neighbouring columns and rows inside it; 1 is a join as soft as the inside."""
    import numpy as np
    c = opaque_core(a)
    if c is None or min(c.shape[:2]) < 16:
        return None
    x = c[..., :3].astype(float)
    col = np.abs(np.diff(x, axis=1)).mean(axis=(0, 2))
    row = np.abs(np.diff(x, axis=0)).mean(axis=(1, 2))
    lr = np.abs(x[:, 0] - x[:, -1]).mean() / (np.median(col) + 1e-9)
    tb = np.abs(x[0] - x[-1]).mean() / (np.median(row) + 1e-9)
    return round(float(max(lr, tb)), 3)


def seam_bands(rebuild=False):
    """the packs are the ruler: per family, the 90th percentile of his own tiles' join ratio."""
    import glob
    import numpy as np
    from PIL import Image
    if os.path.exists(SEAM_BANDS) and not rebuild:
        return json.load(open(SEAM_BANDS))
    out = {'_readme': 'tools/bohemia_toolchain.py seam_bands: per tile family, his own pack tiles\' join ratio '
                      '(the opaque core laid against itself; 1 is a join as soft as the inside), the 90th '
                      'percentile is the band. Rebuilt with: python3 tools/bohemia_toolchain.py bands',
           'percentile': 90, 'families': {}}
    for fam in ('ground', 'road', 'marking', 'map_tile', 'fight_board'):
        vals = []
        for f in sorted(glob.glob(os.path.join(ART_BANK, fam, 'pack_*.png'))):
            v = join_ratio(np.asarray(Image.open(f).convert('RGBA')))
            if v is not None:
                vals.append(v)
        if vals:
            out['families'][fam] = {'pieces': len(vals), 'p50': round(float(np.percentile(vals, 50)), 3),
                                    'band': round(float(np.percentile(vals, 90)), 3)}
    os.makedirs(os.path.dirname(SEAM_BANDS), exist_ok=True)
    with open(SEAM_BANDS, 'w') as f:
        json.dump(out, f, indent=1)
    return out


def the_sheet(piece_path, snapped_path, out_path):
    """the pack piece left, ours right, at 1:1, then three by three of ours laid at its core's pitch, the
    fringe over the neighbour the way his tiles sit; pasted, never drawn."""
    import numpy as np
    from PIL import Image
    p = Image.open(piece_path).convert('RGBA')
    s = Image.open(snapped_path).convert('RGBA')
    box = core_box(np.asarray(s))
    t, b, l, r = box if box else (0, s.size[1], 0, s.size[0])
    cw, ch = r - l, b - t
    gap = 8
    w3, h3 = 2 * cw + s.size[0], 2 * ch + s.size[1]
    W = p.size[0] + gap + s.size[0] + gap + w3
    H = max(p.size[1], s.size[1], h3)
    sheet = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sheet.paste(p, (0, 0), p)
    sheet.paste(s, (p.size[0] + gap, 0), s)
    x0 = p.size[0] + gap + s.size[0] + gap
    for j in range(3):
        for i in range(3):
            sheet.alpha_composite(s, (x0 + i * cw, j * ch))
    sheet.save(out_path)


def clean(in_path, piece_path, out_dir, family='ground', force_fallback=False):
    import numpy as np
    from PIL import Image
    if fenced(out_dir):
        raise SystemExit('REFUSED (rule 100): %s is inside the game; write into a cook folder' % out_dir)
    os.makedirs(out_dir, exist_ok=True)
    stem = os.path.splitext(os.path.basename(in_path))[0]
    snapped = os.path.join(out_dir, stem + '__snapped.png')
    palette = pack_palette(piece_path)
    ase = None if force_fallback else aseprite_path()
    how = snap_aseprite(in_path, piece_path, snapped, ase) if ase else snap_fallback(in_path, palette, snapped)
    off, total = off_palette(snapped, palette)
    a = np.asarray(Image.open(snapped).convert('RGBA'))
    jr = join_ratio(a)
    bands = seam_bands()
    band = (bands['families'].get(family) or {}).get('band')
    import bohemia_not_vibe_coded as N
    cls = 'tile' if family in N.TILE_FAMILIES else 'prop'
    tb = json.load(open(N.BANDS)) if os.path.exists(N.BANDS) else None
    verdict = N.band_verdict(N.sprite_report(snapped, cls), family, tb) if tb else {}
    before = N.band_verdict(N.sprite_report(in_path, cls), family, tb) if tb else {}
    cell = N.pack_cell(family)
    sheet = os.path.join(out_dir, stem + '__sheet.png')
    the_sheet(piece_path, snapped, sheet)
    man = dict(
        made_by='tools/bohemia_toolchain.py clean', row='[the toolchain]', draft=True,
        input=dict(path=os.path.relpath(os.path.abspath(in_path), ROOT), sha1=sha(in_path)),
        palette_lock=dict(piece=os.path.relpath(os.path.abspath(piece_path), ROOT), sha1=sha(piece_path), colours=int(len(palette))),
        snap=how, off_palette_pixels=off, opaque_pixels=total,
        joins=dict(ratio=jr, family=family, packs_band=band,
                   verdict=None if jr is None or band is None else ('JOINS' if jr <= band else 'SEAM')),
        size=list(a.shape[1::-1]), family_cell=cell, at_or_over_the_cell=bool(max(a.shape[:2]) >= cell),
        tells={d: v.get('ok') for d, v in verdict.items()},
        tells_why={d: v['why'] for d, v in verdict.items() if v.get('why')},
        tells_of_the_input={d: v.get('ok') for d, v in before.items()},
        tells_the_snap_added=sorted(d for d, v in verdict.items() if v.get('ok') is False and before.get(d, {}).get('ok') is not False),
        sheet=os.path.relpath(sheet, ROOT) if not os.path.relpath(sheet, ROOT).startswith('..') else sheet,
        snapped=os.path.relpath(snapped, ROOT) if not os.path.relpath(snapped, ROOT).startswith('..') else snapped)
    with open(os.path.join(out_dir, stem + '__clean.json'), 'w') as f:
        json.dump(man, f, indent=1)
    return man


# ---------------------------------------------------------------- THE SOUND LEG -----------------------------
def licence_rows(path=None):
    """the bank's LICENCES.md table, stem -> row; the only source of truth for what may be used."""
    rows = {}
    for line in open(path or LICENCES, encoding='utf-8'):
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) == 6 and cells[0] and cells[0] not in ('stem', '---'):
            rows[cells[0]] = dict(stem=cells[0], category=cells[1], source=cells[2], author=cells[3], url=cells[4], licence=cells[5])
    return rows


def sound(stem, out_dir, room='small', wet=0.3, spd=1.0, peak=-2.0, tape_depth=1.0, licences=None, win='auto'):
    if fenced(out_dir):
        raise SystemExit('REFUSED (rule 100): %s is inside the game; write into a cook folder' % out_dir)
    rows = licence_rows(licences)
    row = rows.get(stem)
    if row is None:
        raise SystemExit('REFUSED: %s has no row in the bank\'s LICENCES.md; nothing without its licence line' % stem)
    if row['licence'] != 'CC0':
        raise SystemExit('REFUSED: %s is %s; only CC0 is taken' % (stem, row['licence']))
    os.makedirs(out_dir, exist_ok=True)
    import soundfile as sf
    import bohemia_from_a_recording as S
    spec = dict(layers=[S.R(stem, win, spd=spd)], room=room, wet=wet, tape=tape_depth, peak=peak)
    raw, y, wins = S.render_oneshot(spec)
    base = os.path.join(out_dir, stem)
    sf.write(base + '.flac', y, S.SR, subtype='PCM_16')
    mp3_peak = S.write_mp3(base + '.mp3', y, 80)
    m = S.measure(y)
    man = dict(made_by='tools/bohemia_toolchain.py sound', row='[the toolchain]', draft=True,
               chain='tools/bohemia_from_a_recording.py render_oneshot: window, high-pass 120 Hz, tape, low-pass 9 kHz, room, limiter',
               source=row, window=win, window_s=list(wins[0]), speed=spd, room=room, wet=wet, tape=tape_depth, peak_asked_db=peak,
               mp3_peak_db=round(float(mp3_peak), 2), flac=os.path.basename(base + '.flac'), mp3=os.path.basename(base + '.mp3'), **m)
    with open(base + '__sound.json', 'w') as f:
        json.dump(man, f, indent=1)
    with open(base + '__LICENCE.txt', 'w') as f:
        f.write('%s -- %s, %s, by %s, %s, licence %s. Cut through ESC-50 (the compilation CC BY-NC 3.0); re-pull '
                'the original by its Freesound id before the game ships.\n' % (stem, row['category'], row['source'],
                                                                                 row['author'], row['url'], row['licence']))
    return man


# ---------------------------------------------------------------- THE PROOF ---------------------------------
PROOF_TILE = os.path.join(ART_BANK, 'ground', 'pack_3_grass_and_ground_tiles_001.png')
PROOF_LOCK = os.path.join(ART_BANK, 'ground', 'pack_7_burnt_ground_tiles_000.png')
PROOF_STEM = '2-118624-A-30'


def proof(out_dir):
    """his grass tile recoloured into his burnt-ground pack's colours (his YES on the recolour, rule 115b),
    and a real door shutting in a small room (its last thump, the way SOUNDS cut the clinic's door)."""
    t = clean(PROOF_TILE, PROOF_LOCK, out_dir, 'ground')
    s = sound(PROOF_STEM, out_dir, room='small', wet=0.3, spd=1.0, peak=-2.0, win='last')
    print('TILE  %s -> %s: snap %s, %d of %d pixels off the lock, joins %s (%s, his tiles\' band %s), tells %s' % (
        os.path.basename(PROOF_TILE), t['snapped'], t['snap'].split(' ')[0], t['off_palette_pixels'], t['opaque_pixels'],
        t['joins']['ratio'], t['joins']['verdict'], t['joins']['packs_band'],
        ', '.join('%s %s' % (d, {True: 'ok', False: 'past', None: '-'}[v]) for d, v in sorted(t['tells'].items()))))
    print('SOUND %s (%s, %s, %s): %.2f s, peak %.2f dB, mp3 peak %.2f dB, first ms %.1f dB, last ms %.1f dB' % (
        PROOF_STEM, s['source']['category'], s['source']['author'], s['source']['licence'], s['seconds'],
        s['peak_db'], s['mp3_peak_db'], s['first_1ms_db'], s['last_1ms_db']))
    return t, s


def _arg(argv, k, d=None):
    return argv[argv.index(k) + 1] if k in argv else d


def main(argv):
    if not argv or argv[0] in ('-h', '--help', 'help'):
        print(__doc__)
        return 0
    cmd = argv[0]
    if cmd == 'doctor':
        rows = doctor()
        return 1 if any(r['state'] == 'MISSING' and r['name'] != 'Aseprite' for r in rows) else 0
    if cmd == 'setup':
        return setup()
    if cmd == 'bands':
        b = seam_bands(rebuild=True)
        print(json.dumps(b['families'], indent=1))
        return 0
    if cmd == 'clean':
        m = clean(_arg(argv, '--in'), _arg(argv, '--pack'), _arg(argv, '--out'), _arg(argv, '--family', 'ground'),
                  force_fallback='--fallback' in argv)
        print(json.dumps(m, indent=1))
        return 0 if m['off_palette_pixels'] == 0 else 1
    if cmd == 'sound':
        m = sound(_arg(argv, '--stem'), _arg(argv, '--out'), _arg(argv, '--room', 'small'), float(_arg(argv, '--wet', 0.3)),
                  float(_arg(argv, '--speed', 1.0)), float(_arg(argv, '--peak', -2.0)), float(_arg(argv, '--tape', 1.0)),
                  win=_arg(argv, '--win', 'auto'))
        print(json.dumps(m, indent=1))
        return 0
    if cmd == 'proof':
        proof(_arg(argv, '--out', tempfile.mkdtemp(prefix='toolchain_proof_')))
        return 0
    print('unknown command %r; python3 tools/bohemia_toolchain.py --help' % cmd)
    return 2


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
