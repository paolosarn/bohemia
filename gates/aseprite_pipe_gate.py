#!/usr/bin/env python3
"""THE PIPE GATE: ASEPRITE IN THE PIPE (10/18/26, PLUMBER lane, VAMILY row [aseprite in the pipe]; rule 108 round
six, Paolo 10/11, his one word 'Aseprite': the chats fix pixels with an artist's tools, not with code that places
squares).

tools/aseprite/ holds one Lua script per job, each run headless (aseprite -b --script-param k=v --script <job>.lua)
and each writing its picture plus a JSON of what it did: snap (to the pack palette, indexed), outline (one pixel,
on or off), strays, resize (blur-free), facings (split and stack eight-facing sheets), sheet (frames plus JSON),
report (the pixel count and palette this gate reads). The binary is built from the public source on GitHub's free
runner (.github/workflows/aseprite.yml) and cached there, never committed (the EULA: compile for your own use).

THE LEGS
  P0  THE JOBS ARE THERE AND HOLD NO PIXEL (every box): the seven jobs and their library, each with its one-line
      usage; no colour and no coordinate typed into a job (a Color{r=...} with a number, a hex colour, a drawPixel
      or a Rectangle at a typed place; planted both ways); the proof driver counts zero on ART PIPE; the README
      names every job.
  P1  NO BINARY IN THE REPO (every box): git tracks nothing under tools/aseprite/bin and the folder is ignored; the
      build script carries the licence lines and builds headless; the workflow pins the tag and the commit, checks
      the commit, caches the build keyed on the build script, saves it the moment it is built, runs the proof and
      this gate, and asks for read access only.
  P2  THE COMMITTED PROOF HOLDS (every box, re-read with PIL): his pack tile round-tripped has a palette
      byte-identical to the one the snap wrote, entry for entry (a palette one byte off is red, planted); the rig's
      robot was cleaned in all eight facings and stacked into one sheet with its JSON; every step exited clean.
  P3  THE JOBS RUN HERE (the runner, or any box with Aseprite at $ASEPRITE_PATH or tools/aseprite/bin/aseprite):
      the proof made fresh on this box ($BOHEMIA_ASEPRITE_PROOF, or made into a temp folder) holds P2, and agrees
      with the committed one (the same palette entries, the same counts): the jobs are deterministic. Without a
      binary: UNMEASURED, never a pass.

RED CASE: P0's planted typed colour and typed rectangle; P1's planted tracked binary; P2's planted palette one byte
off, every run.

  python3 gates/aseprite_pipe_gate.py
"""
import json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'aseprite'))
sys.path.insert(0, os.path.join(ROOT, 'gates'))
import bohemia_aseprite_proof as PROOF  # noqa: E402

JOBS = ('snap', 'outline', 'strays', 'resize', 'facings', 'sheet', 'report')
DIR = os.path.join(ROOT, 'tools', 'aseprite')
WORKFLOW = os.path.join(ROOT, '.github', 'workflows', 'aseprite.yml')
COMMITTED = PROOF.OUT
TYPED = [('a colour typed as numbers', re.compile(r'Color\s*\{\s*(r|red|index)\s*=\s*\d')),
         ('a colour typed as hex', re.compile(r'[\'"]#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?[\'"]')),
         ('a pixel drawn at a typed place', re.compile(r'drawPixel\s*\(\s*\d')),
         ('a rectangle at a typed place', re.compile(r'Rectangle\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+'))]

passed = failed = 0


def ok(name, cond, why=''):
    global passed, failed
    if cond:
        passed += 1; print('  ok   ' + name)
    else:
        failed += 1; print('  FAIL ' + name + ('\n         ' + why if why else ''))


def typed(text):
    return [what for what, rx in TYPED if rx.search(text)]


def p0():
    miss = [j for j in JOBS + ('lib',) if not os.path.isfile(os.path.join(DIR, j + '.lua'))]
    ok('P0 the seven jobs and their library are in tools/aseprite (%s)' % ', '.join(JOBS), not miss, 'missing: %s' % miss)
    nouse = [j for j in JOBS if os.path.isfile(os.path.join(DIR, j + '.lua'))
             and 'usage: aseprite -b' not in ''.join(open(os.path.join(DIR, j + '.lua')).readlines()[:4])]
    ok('P0 every job carries its one-line usage in its first lines', not nouse, 'no usage line: %s' % nouse)
    hits = {j: typed(open(os.path.join(DIR, j + '.lua')).read()) for j in JOBS + ('lib',)
            if os.path.isfile(os.path.join(DIR, j + '.lua'))}
    hits = {j: h for j, h in hits.items() if h}
    ok('P0 no job holds a colour or a coordinate typed in', not hits, json.dumps(hits))
    plant = typed("local c = Color{ r = 40, g = 30, b = 20 }\nimg:drawPixel(3, 4, c)\nlocal r = Rectangle(0, 0, 16, 16)")
    clean = typed("local c = Color{ r = r, g = g, b = b, a = a }\nimg:drawPixel(x, y, best)\nRectangle((i - 1) * cw, 0, cw, spr.height)")
    ok('P0 a typed colour, a typed pixel and a typed rectangle are caught, and the same read from the picture are not '
       '(planted)', len(plant) == 3 and not clean, 'planted %s, clean %s' % (plant, clean))
    import art_pipe_gate as AP
    total, found = AP.count_text(open(os.path.join(DIR, 'bohemia_aseprite_proof.py')).read(), 'py')
    ok('P0 the proof driver writes no pixel as a number (ART PIPE counts %d)' % total, total == 0, str(found))
    readme = open(os.path.join(DIR, 'README.md')).read() if os.path.isfile(os.path.join(DIR, 'README.md')) else ''
    unnamed = [j for j in JOBS if '%s.lua' % j not in readme]
    ok('P0 the README names every job and the fifteen-minute steps', readme and not unnamed and 'FIFTEEN MINUTES' in readme,
       'unnamed: %s' % unnamed if readme else 'tools/aseprite/README.md missing')


def binaries(tracked):
    return [f for f in tracked if f.startswith('tools/aseprite/bin/') or os.path.basename(f) == 'aseprite']


def p1():
    git = lambda *a: subprocess.run(['git'] + list(a), cwd=ROOT, capture_output=True, text=True)
    tracked = git('ls-files').stdout.split('\n')
    b = binaries(tracked)
    ok('P1 git tracks no Aseprite build (%d files read)' % len(tracked), tracked != [''] and not b, ', '.join(b[:5]))
    ok('P1 a planted tracked build is red', binaries(['tools/aseprite/bin/aseprite', 'tools/aseprite/snap.lua']) ==
       ['tools/aseprite/bin/aseprite'])
    ok('P1 tools/aseprite/bin/ is ignored (the build can never be added by accident)',
       git('check-ignore', '-q', 'tools/aseprite/bin/aseprite').returncode == 0, 'add tools/aseprite/bin/ to .gitignore')
    sh = open(os.path.join(DIR, 'build_headless.sh')).read() if os.path.isfile(os.path.join(DIR, 'build_headless.sh')) else ''
    need = {'the licence holder': 'Igara Studio', 'the EULA line': 'EULA', 'never redistributed': 'redistribut',
            'headless': '-DENABLE_UI=OFF', 'no graphics backend': '-DLAF_BACKEND=none', 'Lua scripting': '-DENABLE_SCRIPTING=ON'}
    miss = [k for k, v in need.items() if v not in sh]
    ok('P1 the build script carries the licence lines and builds headless', sh and not miss, 'missing: %s' % miss)
    y = open(WORKFLOW).read() if os.path.isfile(WORKFLOW) else ''
    need = {'the build script': 'tools/aseprite/build_headless.sh', 'the cache': 'actions/cache/restore@',
            'kept the moment it is built': 'actions/cache/save@',
            'keyed on the build script': "hashFiles('tools/aseprite/build_headless.sh')",
            'the commit checked': 'rev-parse HEAD', 'the proof': 'bohemia_aseprite_proof.py', 'this gate': 'gates/aseprite_pipe_gate.py',
            'read access only': 'contents: read'}
    miss = [k for k, v in need.items() if v not in y]
    if not re.search(r'ASEPRITE_TAG:\s*v\d+\.\d+', y):
        miss.append('the pinned tag')
    if not re.search(r'ASEPRITE_COMMIT:\s*[0-9a-f]{40}\b', y):
        miss.append('the pinned commit')
    if 'contents: write' in y:
        miss.append('it asks to write')
    ok('P1 the workflow builds at a pinned tag and commit, caches, runs the proof and this gate, read only',
       bool(y) and not miss, 'missing in .github/workflows/aseprite.yml: %s' % ', '.join(miss or ['the file']))


def hold(proof_dir, label):
    """P2's checks on one proof folder; returns the record."""
    pj = os.path.join(proof_dir, 'proof.json')
    if not os.path.isfile(pj):
        ok('%s the proof is on disk (%s)' % (label, os.path.relpath(pj, ROOT)), False, 'run: python3 tools/aseprite/bohemia_aseprite_proof.py')
        return None
    rec = json.load(open(pj))
    a = PROOF.gpl_palette(os.path.join(proof_dir, 'tile_palette.gpl'))
    b = PROOF.png_palette(os.path.join(proof_dir, 'tile_outlined.png'))
    rt = rec['round_trip']
    ok('%s his pack tile round-tripped (snap, outline, export): the PNG\'s palette is byte-identical to the snap\'s, '
       '%d entries, re-read here' % (label, len(a)), PROOF.same_palette(a, b) and rt['byte_identical'] and len(a) > 16,
       '%d entries in the .gpl, %d in the PNG' % (len(a), len(b or [])))
    ok('%s the outline went on in the tile\'s own palette (%d pixels, %d colours off the palette)' % (
        label, rt['outline_pixels'], rt['colours_off_palette']), rt['outline_pixels'] > 0 and rt['colours_off_palette'] == 0)
    si = rt['silhouette']
    # off is an erosion (the outermost ring cleared), on a dilation; the two invert each other except where the art
    # is one pixel thin (a spur the ring takes with it), measured 10/18: 2 of 8,532 on his cobblestone tile
    ok('%s the outline off takes back what on put on, all but the one-pixel-thin spurs (silhouette %d -> %d -> %d '
       'pixels)' % (label, si['snapped'], si['outline_on'], si['outline_off']),
       si['outline_off'] < si['outline_on'] and abs(si['outline_off'] - si['snapped']) <= 0.001 * si['snapped'])
    g = rec['generated']
    fac = g['facings']
    ok('%s the rig\'s robot cleaned with no human in all eight facings, every colour on his car\'s palette (colours '
       'raw -> snapped -> clean %s; strays %s; half see-through %s)' % (
        label, ' '.join('%d/%d/%d' % tuple(fac[f]['colours']) for f in PROOF.FACINGS if f in fac),
        ' '.join('%d/%d/%d' % tuple(fac[f]['strays']) for f in PROOF.FACINGS if f in fac),
        ' '.join('%d/%d' % tuple(fac[f]['half_transparent']) for f in PROOF.FACINGS if f in fac)),
       set(fac) == set(PROOF.FACINGS) and all(fac[f]['colours_off_palette'] == 0 for f in fac)
       and all(fac[f]['strays'][2] < fac[f]['strays'][1] for f in fac) and all(fac[f]['half_transparent'][1] == 0 for f in fac),
       json.dumps(fac)[:300])
    sh = g['sheet']
    ok('%s the eight stacked into one sheet with its JSON (%d distinct facings, mirrored: %s)' % (
        label, sh['distinct_facings'], sh['mirrored'] or 'none'),
       os.path.isfile(os.path.join(proof_dir, 'robot_sheet.png')) and os.path.isfile(os.path.join(proof_dir, 'robot_sheet.sheet.json'))
       and sh['distinct_facings'] == 8)
    bad = [s['job'] for s in rec['steps'] if s['exit'] != 0]
    ok('%s every step exited clean (%d steps, %.1f s of Aseprite, %s)' % (label, len(rec['steps']), rec['seconds'], rec['aseprite']),
       not bad and len(rec['steps']) >= 44, 'failed: %s' % bad)
    return rec


def p2():
    rec = hold(COMMITTED, 'P2')
    if not rec:
        return None
    a = PROOF.gpl_palette(os.path.join(COMMITTED, 'tile_palette.gpl'))
    b = PROOF.png_palette(os.path.join(COMMITTED, 'tile_outlined.png'))
    off = list(a); off[len(off) // 2] = (off[len(off) // 2][0] ^ 1,) + tuple(off[len(off) // 2][1:])
    ok('P2 a palette one byte off is red (planted)', not PROOF.same_palette(off, b) and PROOF.same_palette(a, b))
    return rec


def p3(committed):
    fresh = os.environ.get('BOHEMIA_ASEPRITE_PROOF')
    if not fresh:
        if not PROOF.binary():
            print('  --   P3 UNMEASURED: no Aseprite on this box (the free runner builds it: .github/workflows/aseprite.yml)')
            return
        fresh = tempfile.mkdtemp()
        r = subprocess.run([sys.executable, os.path.join(DIR, 'bohemia_aseprite_proof.py'), '--out', fresh],
                           capture_output=True, text=True)
        ok('P3 the jobs ran end to end on this box', r.returncode == 0, (r.stdout + r.stderr)[-400:])
    rec = hold(fresh, 'P3')
    if not rec or not committed:
        return
    same = (PROOF.gpl_palette(os.path.join(fresh, 'tile_palette.gpl')) == PROOF.gpl_palette(os.path.join(COMMITTED, 'tile_palette.gpl'))
            and {f: v['colours'] + v['strays'] for f, v in rec['generated']['facings'].items()}
            == {f: v['colours'] + v['strays'] for f, v in committed['generated']['facings'].items()})
    ok('P3 the fresh proof agrees with the committed one (the same palette, the same counts): the jobs are deterministic',
       same, 'fresh %s vs committed %s' % (rec['aseprite'], committed['aseprite']))


def main():
    print('THE PIPE GATE (rule 108 round six, his word Aseprite): the jobs, the build, the proof')
    p0()
    p1()
    committed = p2()
    p3(committed)
    print('\nTHE PIPE GATE: %d passed, %d failed' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
