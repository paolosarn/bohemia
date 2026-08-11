#!/usr/bin/env python3
"""
BOHEMIA NO-BULLSHIT-QUESTIONS GATE (8/11/26) — a law without a machine gate is
not enforced.

Locks laws/BOHEMIA_ADDENDUM_STOP_ASKING_IF_IT_IS_FUNNER_AND_REAL_DO_IT_8_11_26.md

  Paolo 8/11: "BRO UR QUESTIONS ARE NOT ENGLISH I NEED YOU TO STOP ASKING ME
  BULLSHIT QUESTIONS / IF IT MAKES THE GAME FUNNER AND REALISTIC DO IT PUSSY"

WHAT IT CHECKS, AND WHY ONLY THESE THREE THINGS:
  1. the addendum EXISTS, is LOCKED, carries his words verbatim, and still holds
     the two-key test plus the four carve-outs it is not allowed to overrule
     (mechanism/contents, MAP LAW, the graveyard, a rejection)
  2. NO LETTERED OPTION MENUS in anything written from 8/11/26 forward. "A) ...
     B) ..." handed to him is the machine asking him to do the machine's job,
     and it is the literal shape he was looking at when he wrote that message
  3. NO MACHINE WORDS INSIDE A QUESTION. Any line that ends in '?' and carries a
     term from the build-language blocklist fails. The blocklist is vocabulary
     he was actually handed and could not use.

THE LINE: a gate cannot read intent and this one does not pretend to. It catches
the two SHAPES he named. Judging whether a question was worth asking at all
stays human, which is the correct division.

  python3 gates/no_bullshit_questions_gate.py
"""
import glob, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

LAW = 'laws/BOHEMIA_ADDENDUM_STOP_ASKING_IF_IT_IS_FUNNER_AND_REAL_DO_IT_8_11_26.md'

# his words, verbatim, as the law must carry them
HIS_WORDS = [
    'UR QUESTIONS ARE NOT ENGLISH',
    'STOP ASKING ME BULLSHIT',
    'IF IT MAKES THE GAME FUNNER AND REALISTIC DO IT',
]
# the two keys, and the reservations this delegation may never overrule
LAW_MUST_HOLD = [
    'FUNNER', 'REALISTIC', 'TWO-KEY TEST',
    'MECHANISM-MINE', 'MAP LAW', 'GRAVEYARD', 'REJECTION',
    'NO LETTERED MENUS', 'NO MACHINE WORDS',
]

# build language: terms that exist only because of how the code works.
# A question containing one of these is not in English as far as he is concerned.
MACHINE_WORDS = [
    'hysteresis', 'quantize', 'quantized', 'idempotent', 'polar', 'arc-length',
    'arclength', 'refactor', 'regression', 'heuristic', 'enum', 'boolean',
    'raster', 'rasterize', 'delta', 'vector', 'scalar', 'fingerprint',
    'subdivision', 'clamp', 'clamped', 'lerp', 'interpolate', 'multiplier',
    'coefficient', 'threshold', 'accuracy curve', 'threat mult', 'packageid',
    'anchor count', 'base64', 'iframe', 'callback', 'async', 'mutex',
    'normalize', 'normalized', 'bitmask', 'nullable', 'schema', 'payload',
]

# from 8/11/26 forward only. Older files were written under the old rules and
# rewriting history to satisfy a new gate is not enforcement, it is laundering.
DATED = re.compile(r'_(\d{1,2})_(\d{1,2})_26(?:\.md|\.txt)$')


def in_scope(path):
    m = DATED.search(path)
    if not m:
        return False
    mo, dy = int(m.group(1)), int(m.group(2))
    return (mo, dy) >= (8, 11)


passed = 0
failed = []


def check(name, ok, detail=''):
    global passed
    if ok:
        passed += 1
    else:
        failed.append(name + (': ' + detail if detail else ''))
    print('  %s %s%s' % ('PASS' if ok else 'FAIL', name, ('  (' + detail + ')') if detail and not ok else ''))


print('=== NO-BULLSHIT-QUESTIONS GATE ===')

# ---- 1. the law itself ------------------------------------------------------
check('law file exists', os.path.exists(LAW), LAW)
law = open(LAW, encoding='utf8').read() if os.path.exists(LAW) else ''
check('law is LOCKED', 'LOCKED' in law)
for w in HIS_WORDS:
    check('law carries his words verbatim: "%s"' % w[:34], w in law)
for k in LAW_MUST_HOLD:
    check('law still holds: %s' % k, k in law)
check('law names its own gate', 'no_bullshit_questions_gate.py' in law)

# ---- 2 + 3. sweep everything written from 8/11 forward ----------------------
files = sorted(f for f in (glob.glob('records/**/*.md', recursive=True)
                           + glob.glob('records/**/*.txt', recursive=True)
                           + glob.glob('laws/**/*.md', recursive=True))
               if in_scope(f))
check('found files in scope (8/11/26 forward)', True, '%d' % len(files))

# a lettered menu: two or more sibling options as "A) ..." / "A." / "**A**" lines
MENU = re.compile(r'^\s*(?:\*\*)?([A-D])(?:\*\*)?[).\]]\s+\S', re.M)
menus = []
jargon = []
for f in files:
    src = open(f, encoding='utf8').read()
    letters = [m.group(1) for m in MENU.finditer(src)]
    # two DIFFERENT consecutive letters starting at A is a menu, not a list item
    if len(set(letters)) >= 2 and 'A' in letters and 'B' in letters:
        menus.append(f)
    for line in src.splitlines():
        s = line.strip()
        if not s.endswith('?'):
            continue
        low = s.lower()
        # the law and this gate quote the blocklist to define it; that is the
        # definition, not a question asked of him
        if os.path.abspath(f) == os.path.abspath(LAW):
            continue
        hit = [w for w in MACHINE_WORDS if w in low]
        if hit:
            jargon.append('%s -> %s' % (os.path.basename(f), hit[0]))

check('no lettered option menus handed to Paolo', not menus,
      '%d file(s): %s' % (len(menus), ', '.join(os.path.basename(m) for m in menus[:3])))
check('no machine words inside a question', not jargon,
      '%d: %s' % (len(jargon), ' | '.join(jargon[:3])))

print('\nNO-BULLSHIT-QUESTIONS GATE: %d passed, %d failed' % (passed, len(failed)))
if failed:
    for f in failed:
        print('  - ' + f)
    sys.exit(1)
