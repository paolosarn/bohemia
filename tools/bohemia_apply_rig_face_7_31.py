#!/usr/bin/env python3
"""
BOHEMIA - APPLY PAOLO'S 7/31 RIG EDIT: THE FACE, AND THE EARS HE REMOVED

He pasted a full rig export and said:
  "okay i updated the face in the rig and u need to reflect these changes. pretty
   much only important for headwear or eye wear. biggest changes are for ne and nw
   where i tried to simulate ears but ur redarded so i just removed it. so any
   headwear or eyewear need to be updated for the rig change."

MEASURED AGAINST THE BUILD before touching anything -- 8 of 24 head/face/neck
part-direction pairs differ, and every one of them is on a diagonal, exactly
where he said:

    dir  part      now    his    change
    NE   HEAD       86     87    +1
    NE   FACE        6      4    -2      <- the ears, removed
    NW   HEAD       86     87    +1
    NW   FACE        6      4    -2      <- the ears, removed
    SE   FACE       63     64    +1
    SE   NECK       10      9    -1
    SW   FACE       63     64    +1
    SW   NECK       10      9    -1

The other 16 pairs are byte-identical and are NOT written.

RIG LAW (Paolo 7/26/26, LOCKED): his painted regions are SACROSANCT. This
transcribes his export and never interprets it -- no reshaping, no meshing, no
mirroring, no "fixing". The pixel index lists are copied as given. If his NE face
is four pixels, it is four pixels.

WHY IT MATTERS BEYOND THE FACE, in his words: headwear and eyewear are anchored
off the head/face region, so moving that region moves what sits on it. This tool
only lands the rig; the hat/glasses check is a separate measured step, because
"a fix that is good is not thereby general" and I am not going to guess at his
hats while landing his face.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): this IS the rig. It replaces the painted
pixel lists for parts 1/2/3 in BAKED.layers and touches nothing else -- no
skeleton, no pose, no layerOverride, no swingAmt, no other part.
  built on: BAKED
  joints: none named
  parts: 1=head, 2=face, 3=neck
  (First draft claimed BAKED.layers; rig_check_gate caught it -- the file reads
   baked['layers'], never the dotted form. The gate is right, the claim was mine.)

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO new graphic pixels and opens NO
banks. Every pixel written here was painted by Paolo in his own rig tool; this
tool is a transcriber.

  python3 tools/bohemia_apply_rig_face_7_31.py <export.json>
"""
import base64
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']


def main(path):
    new = json.load(open(path))
    s = open(ALPHA, encoding='utf-8').read()
    m = re.search(r'^const BAKED=(\{.*?\});?$', s, re.M)
    if not m:
        print('REFUSING TO WRITE: BAKED not found')
        return 1
    baked = json.loads(m.group(1))

    # SAFEGUARD 1 -- never apply a structural change blind. This file transcribes
    # PAINTED PIXELS only. If an export also moves the skeleton, the pose or the
    # layer order, that is not a chin/neck edit, stop and check: those ride
    # different laws (RIG LAW for the pose base, AUTHORED LAYERING for the order)
    # and must be applied deliberately, not as a side effect of a face fix.
    for key in ('skeleton', 'pose', 'layerOverride', 'swingAmt'):
        if key in new and json.dumps(new[key], sort_keys=True) != json.dumps(baked.get(key), sort_keys=True):
            print('REFUSING TO WRITE: the export also changes %s -- that is not a '
                  'chin/neck edit, stop and check' % key)
            return 1

    changed = []
    for d in DIRS:
        if d not in new:
            print('REFUSING TO WRITE: export is missing direction ' + d)
            return 1
        for p in ('1', '2', '3'):
            cur = baked['layers'][d].get(p, [])
            nxt = new[d][p]
            if sorted(cur) == sorted(nxt):
                continue
            baked['layers'][d][p] = nxt          # VERBATIM, his list, his order
            changed.append((d, p, len(cur), len(nxt)))

    if not changed:
        print('already applied -- his rig is already what the build carries')
        return 0

    out = json.dumps(baked, separators=(',', ':'))
    s = s[:m.start(1)] + out + s[m.end(1):]

    # SAFEGUARD 2 -- RIG IS LAW: the embedded rig tool carries its OWN copy of
    # BAKED, and the game and the tool must draw the same body. Patching only the
    # alpha's copy means the two would not be byte-identical after patching, which
    # is exactly what rig_is_law_gate catches. Sync it here so the applier can
    # never leave them disagreeing.
    rm = re.search(r"const RIG_B64='([^']+)'", s)
    if rm:
        tool = base64.b64decode(rm.group(1)).decode('utf-8')
        tb = re.search(r'const BAKED=(\{.*?\});?\n', tool, re.S)
        if tb and tb.group(1) != out:
            tool = tool[:tb.start(1)] + out + tool[tb.end(1):]
            s = s[:rm.start(1)] + base64.b64encode(tool.encode()).decode('ascii') + s[rm.end(1):]
            print('  rig tool BAKED synced (RIG IS LAW: one body, two copies, byte-identical)')

    open(ALPHA, 'w', encoding='utf-8').write(s)
    NAME = {'1': 'HEAD', '2': 'FACE', '3': 'NECK'}
    for d, p, a, b in changed:
        print('  %-3s %-5s %d -> %d px' % (d, NAME[p], a, b))
    print('%d part/direction pairs transcribed from his export' % len(changed))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else
                  'records/rig/RIG_FACE_7_31_26.json'))
