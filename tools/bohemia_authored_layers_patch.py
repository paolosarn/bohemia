#!/usr/bin/env python3
"""
BOHEMIA — REFER TO THE LAYERING HE AUTHORED (Paolo 7/26/26, LOCKED)

His words: "we made the rig and we put the layers in the positions and how they
layer, why can't you just refer to that? How do you not see this shit tweak out
when it's facing different directions, facing east and west... the pixels on the
torso tweak out."

MEASURED FIRST, on the shipped alpha, over every clip x 24 phases:

    facing   draw-order changes MID-ANIMATION   clips affected
    S                 0                              0
    N                 0                              0
    E               150                             48
    W               106                             38
    SE              141                             46
    NE              144                             47
    NW              164                             47
    SW              151                             48

His authored layerOverride is honoured on exactly the two facings where nothing
re-sorts -- N and S -- and thrown away on the other six, where handOrder()
recomputes the draw order from scratch on EVERY FRAME. When a joint drifts
across a +-2.5px deadband mid-swing the order FLIPS, an arm or hand jumps from
behind the torso to in front of it between one frame and the next, and on E/W
(where both arms sit INSIDE the 8px torso footprint) that flip repaints a big
band of torso. That is the tweak-out, and it is his layering being overridden.

WHAT THIS RETIRES: the two DEADBAND-GUESSED re-sorts.
  - place() / the rest-relative hand rule on E, W and the four diagonals
  - the NE/NW ARM-UNIT DEPTH rule
Both try to INFER depth from how far a joint has drifted. Inference that can
flip mid-clip is exactly what he authored the layerOverride to prevent.

WHAT THIS KEEPS: the two rules a POSE DECLARES rather than guesses --
  - the GUN-UNIT law (a clip holding a weapon states it: present._gun)
  - _handsBack (a clip states its hands are behind the body)
Those cannot oscillate, because a clip either declares them or it does not.

TRUTH HIERARCHY: this supersedes the dynamic-hand-layer ruling (7/2/26) and the
NE/NW arm-unit ruling (7/20/26) on the six facings. Both were his; today's is
also his, and NEWEST DATE WINS. His authored layerOverride is the baseline and
now actually is one.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO pixels. It deletes
code that overrode his authored data and restores the data he authored.

Idempotent.

  python3 tools/bohemia_authored_layers_patch.py
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(msg):
    print('  ! ' + msg)
    sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()
orig = src
did = []

MARK = 'AUTHORED LAYERING IS THE LAW'

# ---------------------------------------------------------------------------
# 1. the NE/NW arm-unit guess: retired
# ---------------------------------------------------------------------------
OLD_NENW = "  if((d==='NE'||d==='NW')&&P){"
NEW_NENW = ("  /* " + MARK + " (Paolo 7/26/26): the NE/NW ARM-UNIT DEPTH guess is\n"
            "     RETIRED. It inferred depth from how far the hand had drifted along the\n"
            "     facing, so a swing that crossed the deadband flipped a whole arm from\n"
            "     behind the torso to in front of it between two frames -- 144 order\n"
            "     changes on NE and 164 on NW across the clip set. Superseded by his\n"
            "     7/26 instruction to refer to the layering he authored. */\n"
            "  if(false&&(d==='NE'||d==='NW')&&P){")
if MARK not in src:
    if OLD_NENW not in src:
        die('NE/NW arm-unit anchor not found')
    src = src.replace(OLD_NENW, NEW_NENW, 1)
    did.append('NE/NW arm-unit depth guess retired')

# ---------------------------------------------------------------------------
# 2. the rest-relative hand guess on E/W + diagonals: retired
# ---------------------------------------------------------------------------
OLD_PLACE = "  if(P){\n  const fx=Math.sign(Math.cos(FACEANG[d]))||1;          /* facing lateral sign */"
NEW_PLACE = ("  /* " + MARK + " (Paolo 7/26/26): the rest-relative hand guess is RETIRED\n"
             "     on every facing. Same defect as the arm-unit rule above -- a +-2.5px\n"
             "     deadband decided depth, so mid-swing the hand crossed it and the draw\n"
             "     order changed underneath the animation (150 changes on E, 106 on W).\n"
             "     On E and W both arms live INSIDE the 8px torso footprint, so a flip\n"
             "     there repaints a band of torso: the pixels he watched tweak out.\n"
             "     The GUN-UNIT and _handsBack rules above survive because a clip\n"
             "     DECLARES those; a declaration cannot oscillate, a guess can. */\n"
             "  if(false&&P){\n  const fx=Math.sign(Math.cos(FACEANG[d]))||1;          /* facing lateral sign */")
if 'the rest-relative hand guess is RETIRED' not in src:
    if OLD_PLACE not in src:
        die('rest-relative hand rule anchor not found')
    src = src.replace(OLD_PLACE, NEW_PLACE, 1)
    did.append('rest-relative hand depth guess retired on all facings')

if src == orig:
    print('AUTHORED LAYERS PATCH: already applied, nothing to do.')
    sys.exit(0)

open(ALPHA, 'w', encoding='utf-8').write(src)
print('AUTHORED LAYERS PATCH applied to slices/BOHEMIA_ALPHA_0_9.html')
for d in did:
    print('  - ' + d)
