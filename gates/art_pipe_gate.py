#!/usr/bin/env python3
"""THE ART PIPE GATE -- NO PIXEL WRITTEN AS A NUMBER IN CODE, FROM NOW
(10/17/26, PLUMBER lane, VAMILY row [the art pipe gate]; rule 108 ROUND EIGHT (a), the research page
records/BOHEMIA_RESEARCH_UNLOCK_THE_LIMITS_06_WHAT_GOES_IN_THE_REPO_SKILLS_AND_TOOL_SERVERS_10_11_26.md)

PAOLO 10/10: "all the art assets you made look like AI slop ... every time you make something art-wise
you use the tiniest amount of pixels possible." THE FINDING (rule 108): the good small teams drive a
real pixel editor from their tools and feed it the packs; nobody draws a tile pixel by pixel in code.
This repo has 744 drawing tools and 178 of them place squares by number. The Aseprite tool server
is now in the repo (tools/aseprite_mcp/, MIT, README there). This gate is the fence behind it.

WHAT A LITERAL PIXEL WRITE IS, counted per file, by call:
    Python / Pillow   .putpixel(   .putdata(   draw.point(   draw.line(   draw.polygon(
                      draw.rectangle( ... fill=   draw.ellipse( ... fill=   draw.chord/pieslice/arc(
    JS / canvas       fillRect(   strokeRect(   putImageData(   imageData.data[i] = ...
What is NOT counted, on purpose: Image.new's one background colour; a rectangle or ellipse drawn
with an OUTLINE only (a frame round a pack tile on a contact sheet); paste, crop, composite, resize
(moving a pack's pixels is the whole point); text (labels on a sheet are words, not art); the
vendored server itself (it generates Lua for Aseprite and is the pipe, not a drawing).

THE RATCHET (the same shape as REFERENCE CHECK and REUSE-FIRST): gates/art_pipe_baseline.json is
the frozen count per file on the day the gate landed. A file in the baseline may only go DOWN; a
file not in the baseline (new, or renamed) must be ZERO; a baseline that grew is itself refused.
So the debt can only shrink, and nothing already shipped turns red by surprise.

LEGS
    A1  the baseline is on disk, parses, and every file it names still exists or is reported as
        retired (a retired file leaves the baseline on --rebase, never by hand).
    A2  NO NEW LITERAL PIXELS: every drawing tool outside the baseline counts zero.
    A3  NOTHING GREW: every baseline file's count is at or under its frozen count.
    A4  THE PIPE IS THERE: tools/aseprite_mcp/ imports, its LICENSE and README are on disk, and the
        README names the one line that starts it.
    S1  SELF-TEST both ways on planted sources: a tool that putpixels a tile is counted, the same
        tool with the pixels pasted from a pack tile counts zero, an outline-only frame counts zero,
        a canvas fillRect is counted.

    python3 gates/art_pipe_gate.py            the gate
    python3 gates/art_pipe_gate.py --rebase   rewrite the baseline LOWER (never higher): drops retired
                                              files and lowered counts; refuses to raise any count
    python3 gates/art_pipe_gate.py --count <file>   one file's count, with the lines
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
BASELINE = 'gates/art_pipe_baseline.json'
PIPE = 'tools/aseprite_mcp'
SWEEP_ROOT = 'tools'
EXT = ('.py', '.js', '.html', '.mjs')
SKIP = re.compile(r'(^|/)(aseprite_mcp|node_modules|__pycache__)(/|$)')

# each pattern: (name, regex). A rectangle/ellipse counts only with a fill= (an outline-only frame is a frame).
PY = [
    ('putpixel', re.compile(r'\.putpixel\s*\(')),
    ('putdata', re.compile(r'\.putdata\s*\(')),
    ('draw.point', re.compile(r'\.point\s*\(')),
    ('draw.line', re.compile(r'\.line\s*\(')),
    ('draw.polygon', re.compile(r'\.polygon\s*\(')),
    ('draw.rectangle fill', re.compile(r'\.rectangle\s*\([^)\n]*\bfill\s*=')),
    ('draw.ellipse fill', re.compile(r'\.ellipse\s*\([^)\n]*\bfill\s*=')),
    ('draw.chord/pieslice', re.compile(r'\.(chord|pieslice)\s*\(')),
]
JS = [
    ('fillRect', re.compile(r'\bfillRect\s*\(')),
    ('strokeRect', re.compile(r'\bstrokeRect\s*\(')),
    ('putImageData', re.compile(r'\bputImageData\s*\(')),
    ('data[i] =', re.compile(r'\.data\s*\[[^\]]+\]\s*=[^=]')),
]
PY_SIGNAL = re.compile(r'\bPIL\b|\bImage\b|ImageDraw|\.save\(|png', re.I)
JS_SIGNAL = re.compile(r'getContext\s*\(\s*[\'"]2d|createCanvas|\bcanvas\b|ImageData|png', re.I)


def count_text(text, kind):
    """kind 'py' or 'js'. Returns (total, {pattern: n}). A file with no image signal at all counts
    zero: .point( in a geometry helper that never touches a picture is not a pixel."""
    pats = PY if kind == 'py' else JS
    sig = PY_SIGNAL if kind == 'py' else JS_SIGNAL
    if not sig.search(text):
        return 0, {}
    found = {}
    for name, rx in pats:
        n = len(rx.findall(text))
        if n:
            found[name] = n
    return sum(found.values()), found


def kind_of(path):
    return 'py' if path.endswith('.py') else 'js'


def sweep():
    out = {}
    for dp, dn, fn in os.walk(SWEEP_ROOT):
        if SKIP.search(dp + '/'):
            dn[:] = []
            continue
        for f in fn:
            if not f.endswith(EXT):
                continue
            p = os.path.join(dp, f).replace(os.sep, '/')
            try:
                t = open(p, encoding='utf8', errors='replace').read()
            except Exception:
                continue
            n, found = count_text(t, kind_of(p))
            if n:
                out[p] = {'count': n, 'by': found}
    return out


def rebase(live):
    old = {}
    if os.path.exists(BASELINE):
        old = json.load(open(BASELINE, encoding='utf8')).get('files', {})
    new = {}
    raised = []
    for p, r in live.items():
        if p in old:
            if r['count'] > old[p]:
                raised.append('%s %d -> %d' % (p, old[p], r['count']))
                new[p] = old[p]
            else:
                new[p] = r['count']
        elif not old:
            new[p] = r['count']      # the first freeze takes everything
    if raised and old:
        print('REFUSED: --rebase may only lower a count or drop a retired file; these grew: ' + '; '.join(raised[:6]))
        return 1
    json.dump({'stamp': '10/17/26', 'what': 'THE ART PIPE BASELINE: literal pixel writes per drawing tool on the day the gate landed. '
              'A RATCHET: a file may only go down or leave; a new file must be zero. Rewritten only by python3 gates/art_pipe_gate.py --rebase, never by hand.',
              'files': dict(sorted(new.items()))}, open(BASELINE, 'w', encoding='utf8'), indent=1)
    print('baseline written: %d files, %d literal writes' % (len(new), sum(new.values())))
    return 0


def main(argv):
    if '--count' in argv:
        p = argv[argv.index('--count') + 1]
        t = open(p, encoding='utf8', errors='replace').read()
        n, found = count_text(t, kind_of(p))
        print('%s: %d literal pixel writes %s' % (p, n, found))
        return 0
    live = sweep()
    if '--rebase' in argv:
        return rebase(live)

    print('\nTHE ART PIPE GATE -- no pixel written as a number in code, from now (rule 108 round eight)\n')
    passed = failed = 0

    def ok(name, cond, why=''):
        nonlocal passed, failed
        if cond:
            passed += 1
            print('  ok   ' + name)
        else:
            failed += 1
            print('  FAIL ' + name + ('\n         ' + why if why else ''))

    # S1 self-test first: a detector that cannot tell the two apart holds nothing
    planted_bad = "from PIL import Image\nim = Image.new('RGBA', (96, 96))\nfor y in range(96):\n    for x in range(96):\n        im.putpixel((x, y), (120, 90, 60, 255))\nim.save('tile.png')\n"
    planted_good = "from PIL import Image\nim = Image.new('RGBA', (96, 96))\nsrc = Image.open('reference/art_bank/road/pack_1_000.png')\nim.paste(src.crop((0, 0, 96, 96)), (0, 0))\nim.save('tile.png')\n"
    planted_frame = "from PIL import Image, ImageDraw\nsheet = Image.new('RGB', (400, 200), (20, 20, 20))\nd = ImageDraw.Draw(sheet)\nd.rectangle([0, 0, 99, 99], outline=(255, 255, 255))\nd.text((4, 104), 'pack 1', fill=(255, 255, 255))\nsheet.save('sheet.png')\n"
    planted_js = "const cv = createCanvas(96, 96); const cx = cv.getContext('2d'); cx.fillStyle = '#8a6a4a'; cx.fillRect(10, 10, 20, 20);\n"
    b = count_text(planted_bad, 'py')[0]; g = count_text(planted_good, 'py')[0]; f = count_text(planted_frame, 'py')[0]; j = count_text(planted_js, 'js')[0]
    ok('S1 the detector tells them apart: a putpixel tile is counted (%d), the same tile pasted from a pack counts zero (%d), an outline-only frame with a label counts zero (%d), a canvas fillRect is counted (%d)' % (b, g, f, j),
       b >= 1 and g == 0 and f == 0 and j >= 1)

    # A1
    base = None
    try:
        base = json.load(open(BASELINE, encoding='utf8'))['files']
    except Exception as e:
        ok('A1 the baseline is on disk and parses (%s)' % BASELINE, False, str(e)[:120] + '. First freeze: python3 gates/art_pipe_gate.py --rebase')
        print('\n=== ART PIPE GATE: %d passed, %d failed ===' % (passed, failed))
        return 1
    retired = [p for p in base if not os.path.exists(p)]
    ok('A1 the baseline is on disk: %d files frozen with %d literal writes; %d retired since (they leave on --rebase)' % (len(base), sum(base.values()), len(retired)), True)

    # A2
    new_bad = {p: r for p, r in live.items() if p not in base}
    ok('A2 NO NEW LITERAL PIXELS: every drawing tool outside the baseline counts zero (%d do not)' % len(new_bad), not new_bad,
       '\n         '.join('%s: %d %s' % (p, r['count'], r['by']) for p, r in sorted(new_bad.items())[:10])
       + '\n         Drive Aseprite instead (tools/aseprite_mcp/README.md): open the pack tile, edit it with the server, export with its JSON. A new tool that places squares by number is the thing rule 108 ended.')

    # A3
    grew = {p: (base[p], r['count']) for p, r in live.items() if p in base and r['count'] > base[p]}
    ok('A3 NOTHING GREW: every baseline file is at or under its frozen count (%d grew)' % len(grew), not grew,
       '\n         '.join('%s: %d -> %d' % (p, a, c) for p, (a, c) in sorted(grew.items())[:10]))
    lowered = sum(1 for p, r in live.items() if p in base and r['count'] < base[p])
    if lowered:
        print('       note: %d baseline files are now under their frozen count; python3 gates/art_pipe_gate.py --rebase locks the gain in' % lowered)

    # A4
    pipe_ok = False
    why = ''
    try:
        import importlib
        import subprocess
        r = subprocess.run([sys.executable, '-c', 'import aseprite_mcp.server'], env=dict(os.environ, PYTHONPATH=PIPE), capture_output=True, text=True)
        pipe_ok = r.returncode == 0
        why = (r.stderr or '').strip().split('\n')[-1][:160]
    except Exception as e:
        why = str(e)[:160]
    readme = os.path.join(PIPE, 'README.md')
    has_readme = os.path.exists(readme) and 'python3 -m aseprite_mcp' in open(readme, encoding='utf8').read()
    ok('A4 THE PIPE IS THERE: tools/aseprite_mcp imports (the vendored server), its LICENSE and README are on disk, and the README names the one line that starts it',
       pipe_ok and os.path.exists(os.path.join(PIPE, 'LICENSE')) and has_readme,
       why or 'README or LICENSE missing under ' + PIPE)

    print('\n=== ART PIPE GATE: %d passed, %d failed ===' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
