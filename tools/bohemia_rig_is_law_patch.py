#!/usr/bin/env python3
"""
BOHEMIA — THE RIG IS LAW (Paolo 7/26/26, LOCKED)

His words: "The rig is law right this wherever you need to, the rig is the body
law like for any animations or customization... no wonder you're having an issue
making the female body, like the rig is law."

The alpha was carrying TWO painted bodies -- its own BAKED, and the BAKED inside
RIG_B64 that his RIG tab draws -- differing in 20 painted parts, 65 pixels, and
the pose. He has been judging animation against a body he never painted.

THIS TOOL MAKES THE RIG THE ONLY BODY. It copies the rig tool's BAKED into the
alpha VERBATIM -- byte for byte, not merged, not reconciled, not "fixed up". The
rig is the authoring surface; whatever is in it is the character. Nothing else
gets a vote, including me.

Downstream is covered by construction: COMBAT_B64, CITY_B64 and PREFAB_B64 carry
NO body of their own (verified: zero BAKED copies inside any of them) -- they are
fed sprites baked by the alpha at runtime. Fix the alpha's body and every surface
draws the rig.

Gate: gates/rig_is_law_gate.js -- the two must stay byte-identical forever, and
no new copy of the body may appear anywhere.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO pixels. It deletes
a divergent copy of his art and replaces it with his art.

Idempotent.

  python3 tools/bohemia_rig_is_law_patch.py
"""
import base64, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(msg):
    print('  ! ' + msg)
    sys.exit(1)

def grab(t, name):
    m = re.search(r'(?:const|let|var)\s+' + name + r'\s*=\s*', t)
    if not m:
        return None, None, None
    i = t.index('{', m.end())
    d = 0
    for k in range(i, len(t)):
        if t[k] == '{':
            d += 1
        elif t[k] == '}':
            d -= 1
            if d == 0:
                return t[i:k + 1], i, k + 1
    return None, None, None

src = open(ALPHA, encoding='utf-8').read()

m = re.search(r"const RIG_B64='([^']+)'", src)
if not m:
    die('RIG_B64 not found -- cannot read the rig')
rig_html = base64.b64decode(m.group(1)).decode('utf-8')

rig_txt, _, _ = grab(rig_html, 'BAKED')
alpha_txt, a0, a1 = grab(src, 'BAKED')
if not rig_txt or not alpha_txt:
    die('could not extract both BAKED bodies')

if rig_txt == alpha_txt:
    print('RIG IS LAW: the game already draws the rig body exactly. Nothing to do.')
    sys.exit(0)

R = json.loads(rig_txt)
A = json.loads(alpha_txt)

# the rig export must be complete before it is allowed to become the body
missing = [k for k in ('W', 'H', 'skeleton', 'layers', 'pose', 'layerOverride', 'swingAmt') if k not in R]
if missing:
    die('the rig export is missing %s -- refusing to install a partial body' % missing)
if sorted(R['layers'].keys()) != sorted(A['layers'].keys()):
    die('the rig body does not cover the same 8 directions -- refusing')
for d in R['layers']:
    if sorted(R['layers'][d].keys()) != sorted(A['layers'][d].keys()):
        die('the rig body has a different part set on %s -- refusing' % d)
    for p, arr in R['layers'][d].items():
        if not arr:
            die('the rig body has an EMPTY part (%s/%s) -- refusing' % (d, p))

parts = sum(1 for d in R['layers'] for p in R['layers'][d]
            if R['layers'][d][p] != A['layers'][d][p])
px = sum(abs(len(R['layers'][d][p]) - len(A['layers'][d][p]))
         for d in R['layers'] for p in R['layers'][d])

src = src[:a0] + rig_txt + src[a1:]
open(ALPHA, 'w', encoding='utf-8').write(src)
print('RIG IS LAW: the alpha now draws the rig tool\'s body, verbatim.')
print('  painted parts replaced : %d' % parts)
print('  pixel delta closed     : %d' % px)
print('  pose replaced          : %s' % (json.dumps(R['pose'], sort_keys=True) != json.dumps(A['pose'], sort_keys=True)))
