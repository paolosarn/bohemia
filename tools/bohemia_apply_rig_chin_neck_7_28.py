#!/usr/bin/env python3
"""
BOHEMIA — APPLY PAOLO'S 7/28 RIG EDIT: THE CHIN AND THE NECK IN PROFILE

He pasted a full rig export and said: "updated rig. i updated the neck and chin.
please fix this."

WHAT HE ACTUALLY CHANGED, measured by diffing his export against the live BAKED
rather than taking the description on trust:

    E  FACE  removed idx 870  -> x=30 y=15
    E  NECK  removed idx 926  -> x=30 y=16
    W  FACE  removed idx 865  -> x=25 y=15
    W  NECK  removed idx 921  -> x=25 y=16

FOUR PIXELS. One column at the chin/neck junction on each profile facing --
x=30 on E, x=25 on W, rows 15 and 16. He trimmed the forward-most column where
the chin meets the neck, which is the exact seam that has been the subject of
every neck complaint this session.

Everything else in his export is byte-identical to the live rig: all 8
directions of parts 4-12, and 21 of the 24 head/face/neck arrays. The skeleton,
the pose, the layerOverride and swingAmt all match to the byte. That is why this
tool touches ONLY parts 1/2/3 -- there is nothing else to apply, and a tool that
rewrote the whole package would make a 4-pixel edit unreviewable.

RIG LAW: his pixels are copied VERBATIM. Nothing is reshaped, mirrored,
resampled or "cleaned up".

RIG IS LAW GATE: the alpha's BAKED and the BAKED inside the embedded rig tool
(RIG_B64) must stay BYTE-IDENTICAL -- they drifted 65 pixels apart once before,
which is what that gate exists to prevent. So this patches BOTH, with the same
serialisation, and re-encodes the rig tool.

REUSE CHECK (REUSE-FIRST): cooks NO art. Every pixel here was painted by Paolo
in the rig tool and pasted by him this turn.

Idempotent: re-running with the same export is a no-op.

  python3 tools/bohemia_apply_rig_chin_neck_7_28.py
"""
import base64, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
NEWHEAD = os.path.join(ROOT, 'records', 'rig', 'RIG_NECK_CHIN_7_28_26_layers.json')
EXPORT = os.path.join(ROOT, 'records', 'rig', 'RIG_NECK_CHIN_7_28_26.json')

def die(m):
    print('  ! ' + m); sys.exit(1)

for p in (NEWHEAD, EXPORT):
    if not os.path.exists(p):
        die('his export is not on disk: ' + p)
new_head = json.load(open(NEWHEAD, encoding='utf-8'))
exp = json.load(open(EXPORT, encoding='utf-8'))

src = open(ALPHA, encoding='utf-8').read()

def grab(text):
    """the BAKED object literal, brace-matched exactly like rig_is_law_gate does"""
    m = re.search(r'(?:const|let|var)\s+BAKED\s*=\s*', text)
    if not m:
        return None, None, None
    i = text.index('{', m.end())
    d = 0
    for k in range(i, len(text)):
        if text[k] == '{':
            d += 1
        elif text[k] == '}':
            d -= 1
            if d == 0:
                return text[i:k + 1], i, k + 1
    return None, None, None

def patched(baked_txt):
    b = json.loads(baked_txt)
    changed = []
    for d in new_head:
        for p in ('1', '2', '3'):
            if b['layers'][d][p] != new_head[d][p]:
                changed.append((d, p, len(b['layers'][d][p]), len(new_head[d][p])))
                b['layers'][d][p] = new_head[d][p]
    return json.dumps(b, separators=(',', ':')), changed

# THE PARTS HE DID NOT TOUCH MUST NOT MOVE. Verified before writing, not after.
alpha_txt, a0, a1 = grab(src)
if not alpha_txt:
    die('could not extract BAKED from the alpha')
live = json.loads(alpha_txt)
for d in exp['skeleton']:
    if live['skeleton'][d] != exp['skeleton'][d]:
        die('his export moves the SKELETON on %s -- that is not a chin/neck edit, stop and check' % d)
    if live['pose'].get(d) and exp.get('pose', {}).get(d) and live['pose'][d] != exp['pose'][d]:
        die('his export moves the POSE on %s -- stop and check' % d)
if live['layerOverride'] != exp['layerOverride']:
    die('his export changes the LAYER ORDER -- that is a different kind of edit, stop and check')
if live['swingAmt'] != exp['swingAmt']:
    die('his export changes swingAmt -- stop and check')

new_alpha_baked, changed = patched(alpha_txt)
if not changed:
    print('RIG CHIN/NECK: already applied, nothing to do.')
    sys.exit(0)

print('RIG CHIN/NECK — applying his 7/28 edit:')
for d, p, o, n in changed:
    nm = {'1': 'HEAD', '2': 'FACE', '3': 'NECK'}[p]
    print('  %-3s %-5s %3d -> %3d px  (%+d)' % (d, nm, o, n, n - o))

src = src[:a0] + new_alpha_baked + src[a1:]

# THE EMBEDDED RIG TOOL MUST CARRY THE SAME BODY, BYTE FOR BYTE.
m = re.search(r"const RIG_B64='([^']+)'", src)
if not m:
    die('RIG_B64 not found -- cannot keep the rig tool in sync')
rig_html = base64.b64decode(m.group(1)).decode('utf-8')
rig_txt, r0, r1 = grab(rig_html)
if not rig_txt:
    die('could not extract BAKED from the embedded rig tool')
new_rig_baked, rig_changed = patched(rig_txt)
if new_rig_baked != new_alpha_baked:
    die('the two bodies would not be byte-identical after patching -- refusing to '
        'ship the drift the RIG IS LAW gate exists to catch')
rig_html = rig_html[:r0] + new_rig_baked + rig_html[r1:]
src = src[:m.start(1)] + base64.b64encode(rig_html.encode('utf-8')).decode('ascii') + src[m.end(1):]

open(ALPHA, 'w', encoding='utf-8').write(src)
print('applied to slices/BOHEMIA_ALPHA_0_9.html')
print('  - the alpha BAKED and the rig tool BAKED are byte-identical (RIG IS LAW)')
print('  - skeleton, pose, layer order and swing all verified unchanged before writing')
