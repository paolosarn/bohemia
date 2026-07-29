#!/usr/bin/env python3
"""
BOHEMIA HOUSE SHAPE GATE (7/29/26)

Paolo, killing house 01: "so this could be a fucking trailer home bro. a trailer
home with a grage? its ass lowkey... i need you to care about house shapes and shit
bro. like fr."

THE HUMAN SCALE GATE WAS GREEN THE WHOLE TIME. Every dimension on that house was
real and machine-checked, and the house was still a trailer, because nothing in the
machine had an opinion about SHAPE. A law without a gate is not enforced, and
"houses have to look like houses" had no gate at all — it did not even exist as a
law until he said it.

So this is the shape law, and it is three numbers taken from the research rather
than from my taste:

  1. AT LEAST TWO MASSES. Every suburban type that reads as a house carries a
     massing break — L-ranch, snout, cross-gable, two-story, split-level. The ONE
     type without a break is the hip ranch with the garage swallowed into the main
     volume, which is exactly what house 01 was.
  2. PITCH 4:12 OR STEEPER. A mobile home reads as one at 2:12 to 3:12; site-built
     is 4:12 and up, and modular is required to hit 5:12.
  3. EAVE AT LEAST 12 INCHES. Manufactured housing runs about 6 in. "Without eaves,
     most homes look like a cheap box."

AND ONE PROPORTION, because a long enough box is a trailer whatever its roof does:
a single-wide is 3.7 x 18.3 m, about 5:1. Any house mass longer than 3.5:1 against
its own depth is refused.

WHAT THIS GATE DOES NOT DO: decide whether a shape is GOOD. It refuses the shapes
that are provably not houses. Which of the legal shapes actually get built is
Paolo's, and he picks them off the LIFE tab.

Run from repo root:  python3 gates/house_shape_gate.py
"""
import importlib.util
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

STUDY = 'tools/bohemia_house_massing.py'
MIN_MASSES = 2
MIN_PITCH = 4          # rise per 12
MIN_EAVE_IN = 12.0
MAX_SLENDER = 3.5      # width : depth of any single mass

P = F = 0


def ok(name, cond, detail=''):
    global P, F
    if cond:
        P += 1
    else:
        F += 1
        print('   FAIL  %s  %s' % (name, detail))


def judge(t):
    """Returns the list of reasons this shape is not a house. Empty = legal."""
    why = []
    if len(t['blocks']) < MIN_MASSES:
        why.append('one mass, no break')
    if t['pitch'] < MIN_PITCH:
        why.append('pitch %d:12' % t['pitch'])
    if t['eave'] / 0.0254 < MIN_EAVE_IN:
        why.append('eave %.0f in' % (t['eave'] / 0.0254))
    for (_x, w, _p, _r) in t['blocks']:
        if w / t['depth'] > MAX_SLENDER:
            why.append('a mass %.1f x %.1f m is %.1f:1' % (w, t['depth'], w / t['depth']))
            break
    return why


def main():
    if not os.path.exists(STUDY):
        print('   HOUSE SHAPE GATE: no shape study, nothing to hold')
        return 0
    spec = importlib.util.spec_from_file_location('ms', STUDY)
    ms = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(ms)

    types = {t['key']: t for t in ms.TYPES}
    ok('the study still carries shapes', len(types) >= 5, '%d found' % len(types))

    # THE TWO THAT MUST FAIL. A gate nobody has watched refuse anything is not a
    # gate, and these two are the exact shapes he rejected — so they are the
    # permanent negative test, living in the gate rather than in a one-off script.
    for key, label in (('TRAILER', 'a single-wide'), ('HIP', 'house 01')):
        if key in types:
            why = judge(types[key])
            ok('REFUSED: %s' % label, bool(why),
               'the gate accepted the shape Paolo killed')
            if why:
                print('   (correctly refused %-8s %s)' % (key, '; '.join(why)))

    # everything else on the sheet is offered to him as buildable, so it had
    # better actually be legal
    for key, t in types.items():
        if key in ('TRAILER', 'HIP'):
            continue
        ok('legal shape: %s' % key, not judge(t), '; '.join(judge(t)))

    legal = [k for k, t in types.items() if not judge(t)]
    print('   HOUSE SHAPE GATE: %d passed, %d failed  (%d legal shapes: %s)'
          % (P, F, len(legal), ', '.join(sorted(legal))))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
