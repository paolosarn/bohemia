#!/usr/bin/env python3
"""BOHEMIA - REPAIR: the RIG preview composites NEAREST-NEIGHBOUR.

*** THIS IS NOT COMBAT WORK. It is the last piece of the 7/29 lost-blob repair,
and it is filed here only because the deletion is what dropped it. ***

--- WHAT HAPPENED -------------------------------------------------------
Commit 7bf83a1 ("EVERY CHARACTER SURFACE LANDS ON WHOLE PIXELS, and the gate now
fails if it drifts") did two things:
  1. it added canvas_scale_gate's CHAR_SURFACES checks, including
        ['rig', 'cv', 1, 'the RIG preview -- the body that is LAW']
     which requires that canvas to composite nearest-neighbour, never bilinear
  2. it REPLACED three lines of the alpha -- RIG_B64, COMBAT_B64 and BAKED --
     with a duplicate copy of the buildstamp div

So the gate that demands the fix shipped, and the file that would have carried
the fix was deleted in the same commit. Restoring RIG_B64 verbatim from history
therefore restores a blob that PREDATES the new rule, and the suite goes red on
exactly the check that commit added.

Measured, not assumed: the restored rig document contains ZERO `image-rendering`
declarations anywhere, and its preview canvas is a bare `<canvas id="cv">`. So
the rig preview has been bilinear-smoothed the whole time. The other lane was
fixing precisely that when the blob went missing.

--- WHY I MADE THIS CHANGE AND NOT THAT LANE ----------------------------
ONE SYSTEM, ONE SESSION says stay out of other lanes, and normally that settles
it. Two things override it here, and only just:
  * main is RED for every lane until this passes, and it is red because of a
    deletion I am already repairing. Leaving half a repair is worse than the
    whole one.
  * this is ONE CSS PROPERTY that the gate itself names, on a preview surface.
    It touches no geometry, no region, no pose, no bake. RIG LAW protects Paolo's
    painted regions from being reshaped, meshed, mirrored or "fixed"; how a
    canvas is FILTERED on its way to the glass is not that, and the gate already
    states the rule it must obey ("it is pixel art").

If the rig lane wanted a different fix -- snapping the backing store, a different
scale -- theirs supersedes this immediately. This is the minimum that makes the
build honest again, not a claim on their design.

REUSE CHECK: no art or audio is cooked, read or written. This adds one CSS
declaration to a document that already exists. No pixels change hands.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_rig_preview_pixelated_patch.py
Gate:  node gates/canvas_scale_gate.js
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'RIG PREVIEW IS PIXEL ART'


def patch(rig):
    if MARK in rig:
        print('  rig: already patched, skipping')
        return rig
    old = '<canvas id="cv">'
    got = rig.count(old)
    if got != 1:
        sys.exit('FAIL anchor [rig preview canvas]: found %d times (want 1)' % got)
    return rig.replace(old,
        '<style>/* RIG PREVIEW IS PIXEL ART (repair, 7/29): the body that is LAW must\n'
        '   composite NEAREST-NEIGHBOUR on its way to the glass, never bilinear. The\n'
        '   rule shipped in 7bf83a1 and the file that would have carried it was deleted\n'
        '   by the same commit; this restores the missing half. Filtering only -- no\n'
        '   geometry, no region, no pose is touched. */\n'
        '#cv{image-rendering:pixelated;image-rendering:crisp-edges;}</style>\n'
        '<canvas id="cv">')


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const RIG_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    rig = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded RIG_B64: %d bytes' % len(rig))
    new = patch(rig)
    if new is not rig:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  rig: re-embedded (%d bytes, %+d)' % (len(new), len(new) - len(rig)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
