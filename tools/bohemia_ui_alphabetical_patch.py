#!/usr/bin/env python3
"""
BOHEMIA - EVERY LIST HE HAS TO SCAN IS ALPHABETICAL (Paolo 7/30/26, STANDING)

Paolo: "Also I need you from now on in the ui to order them alphabetically i
cant find what u need me to find man"

THE REAL COST, which is why this is a standing law and not a nicety: the whole
verdict workflow depends on him FINDING the thing I asked him to judge. The
ANIMATION tab holds 102 clips in authoring order -- the order they happened to be
written in over months -- so "look at cough, cower and scratch-back" means he
scans 102 unsorted buttons three times. A judging surface he cannot navigate is a
judging surface that does not get used, and STALE UNJUDGED IS DEAD.

WHAT THIS SORTS, the lists that are long enough to get lost in:
  1. the CLIP buttons in the ANIMATION tab   (102 entries, authoring order)
  2. the CANON CLOSET items inside each category   (221 garments across 11 cats)

WHAT IT DELIBERATELY DOES NOT SORT, because order carries meaning there:
  - FACING (S SE E NE N NW W SW) is a compass, not a list. Alphabetising it to
    E N NE NW S SE SW W would destroy the rotation it represents.
  - the KNOCK selector, same reason (AUTO first, then a compass).
  - the CATEGORY headings themselves (TOPS/LEGS/FEET/OUTER...) read top-to-bottom
    like a body, which is easier to scan than alphabetical would be.
  - the underlying CLIPS array is NOT reordered: export, ANIMBEATS and the verdict
    file all key off it, and re-ordering data to fix a view is how a display
    change becomes a data bug. Only the VIEW sorts, via a copy.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): touches no rig, no pose, no joint, no
layer. This is button order in the DOM.
  built on: the BAKED package
  joints: none named
  parts: none

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO graphic pixels, opens NO banks.
It reorders existing DOM buttons; no art is authored or altered.

  python3 tools/bohemia_ui_alphabetical_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# 1. THE CLIP BUTTONS. Sort a COPY -- CLIPS itself stays in authoring order
#    because the export and ANIMBEATS key off it.
CLIP_OLD = "  CLIPS.forEach(c=>{const b=document.createElement('button');"
CLIP_NEW = ("  /* ALPHABETICAL UI (Paolo 7/30/26, STANDING): \"i cant find what u need me to"
            "\n     find man\". 102 clips in authoring order is unnavigable, and a judging"
            "\n     surface he cannot navigate does not get used. Sorted COPY -- the CLIPS"
            "\n     array keeps authoring order because export/ANIMBEATS key off it. */"
            "\n  CLIPS.slice().sort((a,b)=>a.localeCompare(b)).forEach(c=>{const b=document.createElement('button');")

# 2. THE CANON CLOSET, inside each category.
CLO_OLD = "var items=canon.filter(function(g){return g.layer===cat[0];});"
CLO_NEW = ("var items=canon.filter(function(g){return g.layer===cat[0];})"
           ".sort(function(x,y){return x.n.localeCompare(y.n);});   "
           "/* ALPHABETICAL UI (Paolo 7/30/26, STANDING) */")

EDITS = [
    ('the ANIMATION tab clip buttons', CLIP_OLD, CLIP_NEW),
    ('the CANON CLOSET, within each category', CLO_OLD, CLO_NEW),
]


def main():
    s = open(ALPHA, encoding='utf-8').read()
    applied, already, bad = [], [], []
    for name, old, new in EDITS:
        if new.split('\n')[-1].strip()[:40] in s and 'localeCompare' in s and old not in s:
            already.append(name)
            continue
        n = s.count(old)
        if n != 1:
            bad.append('%s: resolved %d times, expected 1' % (name, n))
            continue
        s = s.replace(old, new)
        applied.append(name)
    if bad:
        print('REFUSING TO WRITE:')
        for x in bad:
            print('   ' + x)
        return 1
    open(ALPHA, 'w', encoding='utf-8').write(s)
    for a in applied:
        print('SORTED  ' + a)
    for a in already:
        print('already ' + a)
    return 0


if __name__ == '__main__':
    sys.exit(main())
