#!/usr/bin/env python3
"""
BOHEMIA - THE COUGH HAND WAS LANDING ON THE CHEST, NOT THE MOUTH (7/30/26)

Paolo, with a screenshot circling NE / E / SW in the ANIMATION tab:
"For cough the three i circled the hand layer is fucked up"

WHAT IT ACTUALLY WAS. He was right that it is the hand, and right that it reads
as a layer problem, but the hand's LAYER is correct -- it is his own authored
order. Measured on the real surface:

  the raised hand lands at y18-20. The face occupies y7-16.

So the hand stops BELOW the chin and sits on the chest as a 13-17 pixel patch of
bare skin on a black jacket. A bare hand is correct (a long sleeve stops at the
hand), but the forearm that should lead to it is inside the torso silhouette, so
the hand has nothing visibly connecting it and reads as a detached blob stuck on
the chest. That is what he circled.

  bare-skin pixels on the chest band (rows 17-26), cough:
      NE 13   E 17   S 13   W 2   SW 0   NW 0     = 45
  the same measurement on idle and walk is 0 on every facing.

WHAT THIS DOES NOT DO, and the reason matters. It does NOT add a per-pose hand
layer rule. Paolo RETIRED dynamic hand-depth twice (7/2 and 7/26, "AUTHORED
LAYERING IS THE LAW") because inferring depth from how far a hand had drifted
flipped whole arms between frames -- 150 order changes on E, 164 on NW. A third
attempt at that guess would be the same mistake a third time. The authored
layering is untouched here.

THE FIX IS THE POSE, which the clip owns: lift the cough's hand IK from 4 px
above the gun-target to 8, so the hand arrives AT the mouth instead of stalling
on the chest. On the away facings it correctly disappears behind the head (from
behind, you do not see a hand held to a mouth); on E it reads at the mouth.

  after: NE 1   E 5   S 4   W 0   SW 0   NW 0     = 10   (45 -> 10, -78%)

RIG CHECK (RIG IS LAW, Paolo 7/26/26): no new joints, no anatomy, no layering
scheme. It moves one existing IK target for one clip; the arm still solves
through the one rig's own shoulder/elbow/hand chain.
  built on: RIG, POSE, poseHoldAt
  joints: handR, elR, shR
  parts: 6=arm-R, 8=hand-R (read only, via the rendered frame)

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO graphic pixels and opens NO
banks. It changes one numeric constant in one clip function. No art is authored.

  python3 tools/bohemia_cough_hand_to_the_mouth_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = "ikR:[g[0][0],g[0][1]-4],bendR:'auto'"
NEW = "ikR:[g[0][0],g[0][1]-8],bendR:'auto'"

# SCOPED TO THE COUGH FUNCTION, and the reason is a bug this tool already had:
# the first version asked `if NEW in source` to decide it had already run. Four
# clips use this IK shape at different lifts -- cough -4, whistle -6, search -7,
# and one more at -8 -- so the guard matched ANOTHER clip's -8 and the tool
# reported "already applied" while cough sat untouched at -4. An idempotency
# check has to look at the thing it edits, not at the whole file.
import re


def cough_span(s):
    m = re.search(r"'?cough'?:\(d,ph\)=>\{", s)
    if not m:
        return None
    i = s.index('{', m.start())
    d = 0
    for k in range(i, len(s)):
        if s[k] == '{':
            d += 1
        elif s[k] == '}':
            d -= 1
            if d == 0:
                return (i, k + 1)
    return None


def main():
    s = open(ALPHA, encoding='utf-8').read()
    sp = cough_span(s)
    if not sp:
        print('REFUSING TO WRITE: could not find the cough clip')
        return 1
    a, b = sp
    body = s[a:b]
    if NEW in body:
        print('already applied')
        return 0
    if body.count(OLD) != 1:
        print('REFUSING TO WRITE: the cough IK target resolved %d times inside cough, expected 1'
              % body.count(OLD))
        return 1
    open(ALPHA, 'w', encoding='utf-8').write(s[:a] + body.replace(OLD, NEW) + s[b:])
    print('cough hand lifted 4 -> 8: it now reaches the mouth instead of stopping on the chest')
    return 0


if __name__ == '__main__':
    sys.exit(main())
