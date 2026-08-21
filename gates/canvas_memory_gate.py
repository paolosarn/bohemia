#!/usr/bin/env python3
"""THE CANVAS MEMORY GATE (7/27/26) — section 8 of the mobile render contract,
finally checked instead of hoped for.

Section 8 pinned a ~224 MB iOS Safari canvas floor and then said, in its own
words: "NOT YET INSTRUMENTED. No session has measured live canvas bytes on a real
device... the gate does not pretend to check it." That was honest and it was also
the one clause of my own contract I had left open while the ART lane was about to
multiply the thing that spends the budget. The probe
(tools/bohemia_canvas_memory_probe.js) now measures it; this gate holds the
number.

WHAT IT HOLDS
  1. The record exists, is the current version, names its limits, and still
     carries the honesty clause. A measurement that stops saying it was taken on
     a desktop becomes a lie the moment somebody quotes it.
  2. The exercise ACTUALLY HAPPENED. The first run of the probe pressed 480 arrow
     keys into a bedroom wall and reported "memory did not grow"; the second
     clicked eleven tabs that were all covered by the front splash and reported
     the whole build as holding 0.8 MB. Both were green-looking nonsense. So the
     record carries proof - the walk left the house and reached the street, every
     tab opened - and no proof means no pass.
  3. THE CEILINGS, as ratchets. Nothing here says the current numbers are good;
     it says they cannot quietly get worse. Measured 7/27 and pinned with real
     headroom, because the heap moves a couple of MB between runs.
  4. THE CLAUSE ITSELF: the walked world must NOT climb as the world streams
     past. That is the actual content of section 8 - caches multiplied by era
     variants - and it is the one thing here that is a law rather than a budget.
  5. The contract no longer claims to be uninstrumented, and cites the record.

WHAT IT DOES NOT HOLD, said plainly rather than left for someone to discover:
this gate reads a RECORDED measurement. It does not launch a browser - a
three-minute browser probe inside a suite the whole fleet runs on every ship
would be a tax that gets the gate deleted. So the record can go stale, and the
gate handles that in the one place it matters: the TILE SET's hash is a hard
fail, because the tile set is precisely the thing section 8 warns will multiply.
The three surface hashes are REPORTED, not failed, because every lane touches the
alpha on every ship. Re-take the measurement with:

    node tools/bohemia_canvas_memory_probe.js

Run from repo root:  python3 gates/canvas_memory_gate.py
"""
import hashlib
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

REC = 'records/target/BOHEMIA_CANVAS_MEMORY.json'
PROBE = 'tools/bohemia_canvas_memory_probe.js'
CONTRACT = 'laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md'
TILESET = 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt'

# RATCHETS, measured 7/27/26 and pinned with headroom. The alpha with every tab
# open sat at ~93 MB resident (60 MB of pixels + ~45 MB of heap at its worst
# moment) = 41% of the floor.
RESIDENT_CEILING_MB = 120.0     # ~54% of the 224 MB floor
PIXEL_CEILING_MB = 75.0         # canvases + decoded images alone
# THE LAW HALF: walking must not grow the picture. 480 steps across the valley
# moved the pixel total by 0.0 MB, which is what a working LRU looks like.
WALK_PIXEL_GROWTH_MAX_MB = 2.0

P = F = 0


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def md5(p):
    return hashlib.md5(open(p, 'rb').read()).hexdigest()


def main():
    print('CANVAS MEMORY GATE — section 8 of the mobile render contract')

    chk(os.path.exists(REC), '%s is missing. Run: node %s' % (REC, PROBE))
    if not os.path.exists(REC):
        print('  %d passed, %d FAILED' % (P, F))
        return 1
    d = json.load(open(REC))

    # ---- 1. the record is what it says it is -------------------------------
    chk(d.get('version') == 'BOHEMIA_CANVAS_MEMORY_v2',
        'the memory record is not the current version; re-run the probe')
    chk('HEADLESS DESKTOP CHROMIUM' in d.get('HONESTY', ''),
        'the record dropped its honesty clause. A desktop measurement that stops '
        'saying it is a desktop measurement becomes a lie the first time it is quoted.')
    chk('HEADLESS DESKTOP CHROMIUM' in open(PROBE).read(),
        'the probe dropped its own honesty clause')
    chk('forced collection' in d.get('what_is_counted', '').lower()
        or 'FORCED COLLECTION' in d.get('what_is_counted', ''),
        'the heap must be read after a forced collection, or a leak and an '
        'uncollected nursery look identical')

    # the floor is the LAW's number, never a number the probe invented
    law = open(CONTRACT).read()
    m = re.search(r'iOS Safari canvas floor to respect is \*\*~(\d+) MB\*\*', law)
    chk(bool(m), 'the contract no longer states an iOS floor')
    if m:
        chk(d.get('ios_floor_mb') == int(m.group(1)),
            'the record measures against %s MB but the contract says %s MB'
            % (d.get('ios_floor_mb'), m.group(1)))

    # ---- 2. every shipped surface is covered -------------------------------
    by_file = {s['surface']: s for s in d.get('surfaces', [])}
    for f in ('BOHEMIA_ALPHA_0_9.html', 'BOHEMIA_RUN_CURRENT.html',
              'BOHEMIA_CITY_CURRENT.html'):
        chk(f in by_file, 'the probe did not measure %s — a surface Paolo can '
                          'reach is a surface that can kill the tab' % f)

    # ---- 3. the exercise actually happened --------------------------------
    run = by_file.get('BOHEMIA_RUN_CURRENT.html')
    if run:
        pr = run.get('exercise_proof', {})
        chk(pr.get('moved') is True,
            'the walked world was measured without walking anywhere')
        chk(bool(pr.get('exit', {}).get('got_out')),
            'the probe never got out of the house, so it measured a bedroom and '
            'called it the streaming world')
        chk((pr.get('after') or {}).get('mode') == 'ext',
            'the walk did not end outside; the streaming world was not exercised')
        chk(len(run.get('moments', [])) >= 4,
            'the walked world needs a measurement at load and after a long walk, '
            'or "it did not grow" is not a claim about anything')

    alpha = by_file.get('BOHEMIA_ALPHA_0_9.html')
    if alpha:
        tabs = alpha.get('exercise_proof', {}).get('tabs') or []
        chk(len(tabs) >= 11,
            'the alpha was measured with %d tabs opened. A tab nobody opened has '
            'not built its bodies yet, and its memory is not in the number.' % len(tabs))
        # THERE IS NO CITY TAB, AND THERE HAS NOT BEEN ONE FOR A WHILE (8/20).
        # This demanded 'city' and the alpha does not have it: 15 tab elements,
        # none of them city. The alpha SAYS SO in its own words next to the code
        # that does it -- "THE WALKED SURFACE IS BEHIND THE **RUN** TAB. There is
        # no data-p='city' tab at all -- the shell maps the RUN tab to the p-city
        # panel". So the probe opened every tab that exists, and the gate failed
        # it for missing one that does not.
        #
        # (The trap is worth naming: grepping the alpha for data-p="city" DOES
        # find a hit -- inside that very comment. A CHECKER THAT CANNOT TELL A
        # MENTION FROM A USE IS THE BROKEN ONE, and it caught me first.)
        #
        # The invariant is not the tab's NAME, it is that the walked world was
        # actually built before anybody read a number off it. RUN is the tab that
        # builds it, and the city is an IFRAME, which is why the frames check
        # below is the other half of the same claim.
        for t in ('map', 'run', 'char'):
            chk(t in tabs, 'the alpha was measured without ever opening the %s tab' % t)
        # the alpha carries its heaviest modules in iframes; a main-frame-only
        # reading reports the biggest surface in the game as holding nothing.
        frames = max((mm.get('frames', 0) for mm in alpha.get('moments', [])), default=0)
        chk(frames >= 5, 'the alpha was measured across %d frames; its modules are '
                         'embedded iframes and they have to be counted' % frames)

    # ---- 4. the ratchets --------------------------------------------------
    for s in d.get('surfaces', []):
        chk(s['resident_peak_mb'] <= RESIDENT_CEILING_MB,
            '%s peaks at %s MB resident, over the %s MB ratchet (%s%% of the %s MB '
            'iOS floor). This is not a style note: the tab gets killed.'
            % (s['name'], s['resident_peak_mb'], RESIDENT_CEILING_MB,
               s['pct_of_ios_floor'], d['ios_floor_mb']))
        chk(s['peak_mb'] <= PIXEL_CEILING_MB,
            '%s holds %s MB of canvases and decoded images, over the %s MB ratchet'
            % (s['name'], s['peak_mb'], PIXEL_CEILING_MB))

    # ---- 5. THE CLAUSE: streaming must not climb --------------------------
    if run:
        chk(run['growth_under_exercise_mb'] <= WALK_PIXEL_GROWTH_MAX_MB,
            'walking the valley grew the picture by %s MB. Section 8 is about '
            'exactly this: caches that never let go are how a small game hits a '
            '224 MB wall. Bound the cache, do not raise the ceiling.'
            % run['growth_under_exercise_mb'])

    # ---- 6. the contract stopped claiming to be blind ---------------------
    chk('NOT YET INSTRUMENTED' not in law,
        'section 8 still says NOT YET INSTRUMENTED while a measurement exists. '
        'Either the law or the record is lying.')
    chk(REC in law, 'section 8 does not cite %s, so nobody reading the law can '
                    'find the number' % REC)
    chk('HEADLESS' in law or 'not an iPhone' in law or 'NOT AN IPHONE' in law,
        'section 8 must say the measurement is a desktop one. A number that '
        'travels without its limit becomes a claim about a phone.')

    # ---- 7. staleness -----------------------------------------------------
    chk(d.get('tileset_md5') == md5(TILESET),
        'the starter tile set changed since the memory was measured. Section 8 is '
        'the clause about the tile set multiplying, so this one is not a warning: '
        're-run `node %s`.' % PROBE)
    moved = [s['surface'] for s in d.get('surfaces', [])
             if os.path.exists('slices/' + s['surface'])
             and s.get('surface_md5') != md5('slices/' + s['surface'])]
    if moved:
        print('  NOTE  measured before the latest change to: %s' % ', '.join(moved))
        print('        (reported, not failed — every lane touches the alpha every '
              'ship. Re-take with: node %s)' % PROBE)

    print('  %d passed, %d FAILED' % (P, F))
    if F == 0:
        w = d.get('worst_surface')
        print('  worst: %s at %s MB resident = %s%% of the %s MB iOS floor'
              % (w, d.get('worst_resident_peak_mb'), d.get('worst_pct_of_floor'),
                 d.get('ios_floor_mb')))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
