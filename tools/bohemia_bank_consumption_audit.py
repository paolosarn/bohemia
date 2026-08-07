"""WHICH OF THE THINGS HE OWNS ACTUALLY REACH THE SCREEN (8/6/26).

Every real win this week came from the same question asked of one bank:
  8/3  the buildings were flat starter tile -- his texture-match set was approved
       and unwired
  8/5  the valley had ZERO objects -- 8,674 purchased HD tiles, 1,927 of them
       personally thumbed UP, and not one had ever drawn a pixel
Both were found by MEASURING CONSUMPTION, not by reading a plan. Nobody has ever
asked it of the whole library. banks/ is ~60 files and this asks all of them.

THE METHOD, and it is the part that has to be right, because a broken probe
returning zero for everything is a lie that looks exactly like a finding (that
happened on 8/3 and cost a turn):
  1. Pull every base64 image out of every bank.
  2. Look for a 120-char slice of each one in every SHIPPED surface
     (slices/*.html -- the things he can actually open).
  3. VALIDATE THE PROBE FIRST against a bank the gates already prove is live.
     If the control does not come back live, the probe is broken and the whole
     run is void -- it refuses to report rather than report zeros.

WHAT IT DELIBERATELY DOES NOT DO: judge anything. A dark bank is not a bug and
not a task. Some are DEAD ON PURPOSE (graveyard), some are verdict records with no
art in them, some are masters that feed a curated subset. The output is a LIST AND
A REASON TO GO LOOK, never a to-do.

  python3 tools/bohemia_bank_consumption_audit.py
    -> records/BOHEMIA_BANK_CONSUMPTION_8_6_26.md
"""
import base64
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANKS = os.path.join(ROOT, 'banks')
SLICES = os.path.join(ROOT, 'slices')
OUT = os.path.join(ROOT, 'records', 'BOHEMIA_BANK_CONSUMPTION_8_6_26.md')

# the probe is trusted only if this comes back LIVE -- gates already prove it ships
CONTROL = 'BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt'
PNG = re.compile(r'iVBORw0KGgo[A-Za-z0-9+/=]{200,}')


def images_in(path, cap=4000):
    """Every base64 PNG in a bank, however it is nested. Regex rather than a
    schema walk because these files have a dozen different shapes."""
    try:
        blob = open(path, 'r', errors='ignore').read()
    except Exception:
        return []
    out = []
    for m in PNG.finditer(blob):
        out.append(m.group(0))
        if len(out) >= cap:
            break
    return out


def main():
    shipped = []
    for f in sorted(os.listdir(SLICES)):
        if f.endswith('.html'):
            p = os.path.join(SLICES, f)
            if os.path.getsize(p) > 2000:
                try:
                    shipped.append((f, open(p, 'r', errors='ignore').read()))
                except Exception:
                    pass
    if not shipped:
        print('NO SHIPPED SURFACES FOUND -- refusing to report'); return 1
    print('  %d shipped surfaces, %.0f MB of them'
          % (len(shipped), sum(len(s) for _, s in shipped) / 1e6))

    def live_count(imgs):
        n = 0
        for b in imgs:
            probe = b[40:160]
            for _f, src in shipped:
                if probe in src:
                    n += 1
                    break
        return n

    # ---- THE CONTROL. If this is not live, the probe is broken and nothing below
    # means anything, so the run aborts instead of printing a wall of zeros.
    ctrl = images_in(os.path.join(BANKS, CONTROL))
    ctrl_live = live_count(ctrl[:400])
    print('  CONTROL %s: %d/%d live' % (CONTROL, ctrl_live, len(ctrl[:400])))
    if ctrl_live == 0:
        print('  THE PROBE IS BROKEN (control came back dark). Refusing to report.')
        return 1

    rows = []
    for f in sorted(os.listdir(BANKS)):
        if not f.endswith('.txt'):
            continue
        p = os.path.join(BANKS, f)
        size = os.path.getsize(p)
        imgs = images_in(p)
        if not imgs:
            rows.append((f, size, 0, 0))       # no art in it at all
            continue
        rows.append((f, size, len(imgs), live_count(imgs)))

    art = [r for r in rows if r[2] > 0]
    dark = [r for r in art if r[3] == 0]
    part = [r for r in art if 0 < r[3] < r[2]]
    full = [r for r in art if r[3] == r[2]]
    noart = [r for r in rows if r[2] == 0]

    tot_img = sum(r[2] for r in art)
    tot_live = sum(r[3] for r in art)
    dark_bytes = sum(r[1] for r in dark)

    L = []
    L.append('# WHICH OF THE THINGS HE OWNS ACTUALLY REACH THE SCREEN')
    L.append('')
    L.append('8/6/26 · ART LANE · measured, not read off a plan')
    L.append('')
    L.append('Every real win this week came from asking one bank whether it was actually')
    L.append('drawing. The buildings were flat starter tile (8/3) and the valley had zero')
    L.append('objects (8/5) -- 8,674 purchased tiles, 1,927 personally thumbed UP, not one')
    L.append('pixel on screen. Nobody had ever asked it of the whole library. This does.')
    L.append('')
    L.append('## THE PROBE IS VALIDATED, NOT ASSUMED')
    L.append('')
    L.append('A broken probe returning zero for everything is a lie that looks exactly like')
    L.append('a finding, and that already cost a turn on 8/3. So the control runs first:')
    L.append('')
    L.append('    %s' % CONTROL)
    L.append('    %d of %d sampled images found live in a shipped surface' % (ctrl_live, len(ctrl[:400])))
    L.append('')
    L.append('If that came back dark this file would not exist.')
    L.append('')
    L.append('## THE NUMBERS')
    L.append('')
    L.append('| | banks | images |')
    L.append('|---|---:|---:|')
    L.append('| carry art | %d | %d |' % (len(art), tot_img))
    L.append('| **reach the screen** | %d fully, %d partly | **%d (%.1f%%)** |'
             % (len(full), len(part), tot_live, 100.0 * tot_live / max(tot_img, 1)))
    L.append('| **never draw a pixel** | **%d** | **%d** |'
             % (len(dark), sum(r[2] for r in dark)))
    L.append('| no art in them (records, verdicts) | %d | - |' % len(noart))
    L.append('')
    L.append('%.0f MB of banks carry art that has never been drawn.' % (dark_bytes / 1e6))
    L.append('')
    L.append('## READ THIS BEFORE TREATING ANY LINE BELOW AS A TASK')
    L.append('')
    L.append('**A dark bank is not a bug.** Some are dead on purpose (the graveyard is a')
    L.append('law), some are masters that deliberately feed a small curated subset, some')
    L.append('are candidate sheets that were judged and mostly rejected. This is a list of')
    L.append('places to LOOK, and nothing here is a licence to wire anything up. Four')
    L.append('separate times today I turned an approved tile into a defect by deciding')
    L.append('where it went: **a verdict is about the object, never about where or what for.**')
    L.append('')
    L.append('## THE DARK BANKS, BIGGEST FIRST')
    L.append('')
    L.append('| bank | MB | images | live |')
    L.append('|---|---:|---:|---:|')
    for f, size, n, live in sorted(dark, key=lambda r: -r[1])[:30]:
        L.append('| %s | %.1f | %d | 0 |' % (f, size / 1e6, n))
    L.append('')
    L.append('## PARTLY CONSUMED (a curated subset ships, the rest is spare)')
    L.append('')
    L.append('| bank | images | live | share |')
    L.append('|---|---:|---:|---:|')
    for f, size, n, live in sorted(part, key=lambda r: -(r[2] - r[3]))[:20]:
        L.append('| %s | %d | %d | %.0f%% |' % (f, n, live, 100.0 * live / n))
    L.append('')

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w').write('\n'.join(L) + '\n')

    print('  banks with art: %d   images: %d   live: %d (%.1f%%)'
          % (len(art), tot_img, tot_live, 100.0 * tot_live / max(tot_img, 1)))
    print('  NEVER DRAWN: %d banks, %d images, %.0f MB' % (len(dark), sum(r[2] for r in dark), dark_bytes / 1e6))
    print('  %s' % os.path.relpath(OUT, ROOT))
    for f, size, n, live in sorted(dark, key=lambda r: -r[1])[:12]:
        print('     %6.1f MB  %5d img  %s' % (size / 1e6, n, f))
    return 0


if __name__ == '__main__':
    sys.exit(main())
