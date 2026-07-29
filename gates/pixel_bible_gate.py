#!/usr/bin/env python3
"""THE PIXEL BIBLE GATE (7/29/26) — laws/BOHEMIA_THE_PIXEL_BIBLE.md

Paolo: "OKAY SAVE ALL YOUR KNOWLEDGE IN A MASTER PIXEL ART DOCUMENT THAT YOU WILL
LIVE BY DIE BY EVERYTIME NEVER TO DRIFT OFF FROM."

"Never to drift off from" is the operative phrase, and it is the half a document
cannot enforce about itself. A bible nobody can check is a bible that rots: a
future session waters down a clause, deletes an inconvenient failure, quietly
drops an honesty caveat, and nothing goes red.

So this gate holds the bible against exactly the four ways it would rot:

  1. EVERY LAW IS STILL IN IT. All thirteen craft laws (L0-L12) and all nineteen
     mastery laws (M1-M19) must still appear. Consolidation is allowed to
     shorten; it is not allowed to LOSE one.
  2. THE HONESTY CLAUSES SURVIVE. Search-summaries not primary sources, Pixel
     Logic unread, and "I have never drawn a pixel by hand". Those three are the
     limits of the whole document, and a version of it that has quietly become
     confident is a version that will get somebody hurt.
  3. THE FAILURE RECORD SURVIVES. Ten named mistakes, mine, with the pattern they
     share. Deleting your own post-mortems is the most tempting drift there is
     and it is the one that guarantees the repeat.
  4. THE NUMBERS AGREE WITH THE ENGINE. The bible's hard constants are asserted
     against the files that actually define them, so the bible can never quietly
     disagree with the game (44px cell, 2x3 car, CELL_M 0.75).

AND ONE MORE, because the failure mode is real: **the ignorance list may not be
shortened by deletion.** It shrinks by CLOSING entries (marked CLOSED with what
closed them), never by removing them. A session that tidies away what it does not
know has drifted in the exact way this gate exists to catch.

Run from repo root:  python3 gates/pixel_bible_gate.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BIBLE = 'laws/BOHEMIA_THE_PIXEL_BIBLE.md'
CRAFT = 'laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md'
MASTERY = 'laws/BOHEMIA_PIXEL_MASTERY_LAWS_7_28_26.md'
IGNORANCE = 'records/BOHEMIA_WHAT_I_DONT_KNOW_7_28_26.md'
PROP_SCALE = 'engine/bohemia_prop_scale.js'
CONTRACT = 'laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md'

HONESTY = [
    ('search-returned summaries', 'the bible must keep saying it is built from search '
     'summaries, not from reading the primary sources'),
    ('UNREAD', 'the bible must keep saying Pixel Logic is unread'),
    ('never drawn a pixel by hand', 'the bible must keep saying I have never drawn a '
     'pixel by hand — that clause is why Paolo\'s thumb is load-bearing'),
]

P = F = 0


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def main():
    print('PIXEL BIBLE GATE — the document the ART lane lives by')
    chk(os.path.exists(BIBLE), 'THE BIBLE IS GONE: %s' % BIBLE)
    if not os.path.exists(BIBLE):
        print('  %d passed, %d FAILED' % (P, F))
        return 1
    b = open(BIBLE).read()

    # ---- 1. every law still present ------------------------------------
    for i in range(13):
        chk(re.search(r'\bL%d\.' % i, b) is not None,
            'craft law L%d has fallen out of the bible. Consolidation may shorten a '
            'law; it may never lose one.' % i)
    for i in range(1, 20):
        chk(re.search(r'\bM%d\.' % i, b) is not None,
            'mastery law M%d has fallen out of the bible' % i)

    # ---- 2. the honesty clauses ----------------------------------------
    for needle, why in HONESTY:
        chk(needle in b, why)

    # ---- 3. the failure record -----------------------------------------
    chk('FAILURE RECORD' in b, 'the bible has lost its own failure record — the most '
                               'tempting thing to delete and the one that guarantees '
                               'the repeat')
    fails = re.search(r'# PART 7(.*?)# PART 8', b, re.S)
    chk(fails is not None and len(re.findall(r'^\d+\.\s', fails.group(1), re.M)) >= 10,
        'the failure record is down to fewer than ten named mistakes. They were all '
        'mine and they all happened; a shorter list is a rewritten history.')
    chk('a green number, and a picture nobody looked at' in b,
        'the bible must keep naming the PATTERN in its own failures, not just list them')

    # ---- 4. the numbers agree with the game ----------------------------
    chk('44 px' in b, 'the bible must state the corpus cell')
    if os.path.exists(PROP_SCALE):
        eng = open(PROP_SCALE).read().replace(' ', '')
        if 'fp:[3,2]' in eng:
            chk('2 x 3 tiles' in b or '2x3' in b,
                'the engine says the car footprint is 3x2 and the bible does not say so')
    if os.path.exists(CONTRACT):
        c = open(CONTRACT).read()
        chk(('CELL_M = 0.75' in c) == ('CELL_M' in b and '0.75' in b),
            'the bible and the render contract disagree about CELL_M')
        chk('upper LEFT' in b and 'upper LEFT' in c,
            'the bible and the contract must agree the key comes from the upper left')

    # ---- 5. the bible is actually wired in ------------------------------
    chk('never judges whether art looks good' in b or 'NOT A TASTE MACHINE' in b,
        'the bible must keep saying the machine is not a taste machine')
    chk('gate is never edited to let code through' in b,
        'the bible must keep the never-edit-a-gate-to-pass rule')
    for f, label in ((CRAFT, 'craft laws'), (MASTERY, 'mastery laws')):
        if os.path.exists(f):
            chk(f in b, 'the bible does not point at the %s it consolidates' % label)

    # ---- 6. the ignorance list shrinks by CLOSING, never by deleting ----
    if os.path.exists(IGNORANCE):
        ig = open(IGNORANCE).read()
        entries = re.findall(r'^\*\*B(\d+)\.', ig, re.M)
        chk(len(entries) >= 12,
            'the ignorance list is down to %d entries. It shrinks by CLOSING things '
            '(marked CLOSED with what closed them), NEVER by deleting them. A session '
            'that tidies away what it does not know has drifted in the exact way this '
            'gate exists to catch.' % len(entries))
        chk('CLOSED' in ig, 'nothing in the ignorance list is marked closed, which '
                            'means it is not being worked')
        chk('never drawn a pixel by hand' in ig.lower() or
            'NEVER DRAWN A PIXEL BY HAND' in ig,
            'B0 — the structural admission — has been removed from the ignorance list')

    print('  %d passed, %d FAILED' % (P, F))
    if F == 0:
        print('  13 craft laws + 19 mastery laws + 3 honesty clauses + 10 failures, '
              'all still standing')
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
