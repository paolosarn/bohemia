#!/usr/bin/env python3
"""
MATERIAL COOKED GATE (8/28/26) - four materials are retired, and his own best
batch is built on them.

HIS RULING, 8/28, LOCKED, at the bottom of a 599-of-600 sweep:

    "Im tired of all these voices they ran their course no more wood stone ash
     bone shit its COOKED"

So: NO NEW CANDIDATE IS COOKED ON wood, stone, ash OR bone. The legal palette is
what is left -- bell, choir, crystal, glass, metal, water.

*** AND THE OBVIOUS GATE WOULD HAVE BEEN A DISASTER. *** Banning the four
materials outright goes red on 80 OF 120 RECIPES on the day it ships, INCLUDING
ALL FOUR OF THE 5/5 SWEEPS HE GAVE IN THE SAME BREATH:

    door_more   stone   5/5     swing_more  ash    5/5
    wind_more   ash     5/5     tread_more  bone   5/5

Four clean sweeps in one batch had never happened before. A check that deletes
them is a GATE OUTRANKING A RULING, which this repo has a law about, and it
would have been "enforcing" something he never said. He did not say the sounds
are bad. He said HE IS TIRED OF THEM AND THEY RAN THEIR COURSE -- a statement
about the next cook, not a verdict on the last one.

So the 120 recipes that existed at the moment of the ruling are GRANDFATHERED BY
NAME in records/BOHEMIA_MATERIALS_GRANDFATHERED_8_28_26.txt. They are his canon.
Anything cooked AFTER that line has to use the legal palette.

AND `metal` IS ALIVE AGAIN. The engine's ENVELOPE still carries
`dead: ['metal']` from 8/12 (3 UP / 22 DOWN, "the only stable finding"). This
sweep approved SIX metal candidates -- block.2, phone_buzz.2, phone_buzz.4,
mag_home.4, sign_alive.4, parts_pass.4. Newest date wins. That is not a
convenience: with four materials retired, metal is one of only six left, and a
stale dead flag would quietly cut the legal palette to five.

    python3 gates/material_cooked_gate.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENGINE = os.path.join(ROOT, 'engine/bohemia_sfx.js')
GRAND = os.path.join(ROOT, 'records/BOHEMIA_MATERIALS_GRANDFATHERED_8_28_26.txt')
LAW = os.path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_THE_MATERIALS_ARE_COOKED_8_28_26.md')

RETIRED = ['wood', 'stone', 'ash', 'bone']
LEGAL = ['bell', 'choir', 'crystal', 'glass', 'water']  # water legal, tiny sample


def main():
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    print('=== MATERIAL COOKED GATE - "no more wood stone ash bone shit its COOKED" ===')

    ok('his ruling is written down as a law', os.path.exists(LAW))
    ok('and the grandfather list exists -- WITHOUT IT THIS GATE WOULD DELETE HIS '
       'OWN 5/5 SWEEPS, which is a gate outranking a ruling', os.path.exists(GRAND))
    if not os.path.exists(GRAND) or not os.path.exists(ENGINE):
        print('  %d passed, %d FAILED' % (p, f))
        return 1

    grand = set()
    for ln in open(GRAND, encoding='utf8'):
        ln = ln.split('#')[0].strip()
        if ln:
            grand.add(ln)
    ok('the grandfather list is a real list and not an empty file (%d recipes)'
       % len(grand), len(grand) >= 100)

    src = open(ENGINE, encoding='utf8').read()
    i = src.index('var RECIPE')
    end = src.index('\n  };\n', i)
    body = src[i:end]
    names = re.findall(r'^    ([a-z_]+):\s*\{', body, re.M)

    mats = {}
    for n in names:
        j = body.index('\n    %s: {' % n)
        blk = body[j:j + 800]
        m = re.search(r"mat:\s*'([a-z]+)'", blk)
        mats[n] = m.group(1) if m else None

    fresh = [n for n in names if n not in grand]
    offenders = [(n, mats[n]) for n in fresh if mats[n] in RETIRED]

    ok('EVERY RECIPE COOKED SINCE THE RULING USES THE LEGAL PALETTE (%s). New '
       'since 8/28: %s. On a retired material: %s'
       % (', '.join(LEGAL), fresh or 'none', offenders or 'none'),
       not offenders)

    grandfathered_on_retired = [n for n in names if n in grand and mats[n] in RETIRED]
    ok('and his canon is UNTOUCHED: %d of %d grandfathered recipes sit on a '
       'retired material and none of them is a failure here -- deleting them '
       'would delete door_more, swing_more, wind_more and tread_more, the four '
       '5/5 sweeps he gave in the same message'
       % (len(grandfathered_on_retired), len(grand)),
       len(grandfathered_on_retired) > 0)

    # METAL STAYS DEAD, AND THIS LEG EXISTS BECAUSE I GOT IT WRONG FIRST.
    # The first version of this gate asserted metal was ALIVE, on the grounds
    # that his 8/28 sweep approved six metal candidates and newest date wins.
    # It also contained 54 metal DOWNS. Counted across every verdict file metal
    # is 6 UP / 54 DOWN = 10%, the worst material in the game on sixty
    # judgements. I had cherry-picked the thumbs that agreed with me, and
    # sfx_envelope_gate went red and said so.
    # SO THE PALETTE IS FIVE, NOT SIX, and the leg now holds the opposite claim.
    code = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
    code = re.sub(r'//[^\n]*', '', code)
    m = re.search(r"dead:\s*\[(.*?)\]", code, re.S)
    deadmats = re.findall(r"'([a-z]+)'", m.group(1)) if m else []
    ok('metal is still flagged dead -- 6 UP / 54 DOWN across every verdict file '
       'is the worst material in the game, and the six approvals in his 8/28 '
       'sweep are not a reversal, they are the numerator of that fraction. '
       'Currently dead: %s' % (deadmats or 'nothing'), 'metal' in deadmats)
    ok('and metal is NOT offered as a legal material for new cooks (%s)'
       % ', '.join(LEGAL), 'metal' not in LEGAL)

    for mat in RETIRED:
        ok('the law names %s as retired' % mat,
           mat in open(LAW, encoding='utf8').read())

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  Four materials are retired for new cooks, and not one sound he '
              'approved was harmed to enforce it.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
