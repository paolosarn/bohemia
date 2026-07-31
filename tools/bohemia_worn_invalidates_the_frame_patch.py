#!/usr/bin/env python3
"""
BOHEMIA - SHUFFLE FIT DID NOTHING, AND IT WAS A CACHE KEY (Paolo 7/31/26)

Paolo: "THE SHUFFLE FIT BUTTON DID NOT WORK BRO!!!"

He was right and my own checks said otherwise, which is the part worth recording.
Every measurement I had was green:
    the button exists, is visible, and has an onclick        yes
    clicking it three times changed G_WORN every time        yes
    wearing RED SHIRT through buildFrame changed 302 px      yes
    legs 190 px, feet 66 px, outer 396 px                    yes
...and on the actual CHARACTER stage he still saw the babypunk outfit. I only
found it by putting an unmissable outfit (red shirt, blue jeans, brown boots) on
the LIVE stage and LOOKING: dark jacket, dark legs, no red, no blue.

ROOT CAUSE. The live canvas does not call buildFrame. drawChar reads HD_CACHE,
keyed by  d | clip | phase | hd | frameLookHash(d)  -- and frameLookHash hashed
G.equipped, G.tints, G.swing, G.bodyVar, skinTone, hair, face, SKIN_DETAIL,
EDITS_VER and FACE_OFFSETS, but NOT window.G_WORN. Wearing a garment changed the
frame the renderer WOULD build and did not change the key, so the cache served
the previous body forever. Every direct-buildFrame test bypassed the cache, which
is exactly why they all passed while the screen was wrong.

THE FIX: G_WORN joins the look hash. That is the whole bug -- one missing term in
one key.

THE LESSON, and it is the same one as VERIFY ON THE REAL SURFACE (7/18): a probe
that calls the render function directly is a SIDE DOOR. The surface he taps goes
through a cache, and a cache is part of the render path. Test what he taps.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): no joints, no anatomy, no layering, no
pixels. One cache key gains one term.
  built on: the BAKED package
  joints: none named
  parts: none

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO graphic pixels, opens NO banks.

  python3 tools/bohemia_worn_invalidates_the_frame_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = ("  const parts=[G.equipped,G.tints,G.swing,G.bodyVar,G.rigidLimbs,"
       "typeof skinTone!=='undefined'?skinTone:0,")
NEW = ("  /* WHAT HE IS WEARING IS PART OF HOW HE LOOKS (Paolo 7/31: \"THE SHUFFLE FIT\n"
       "     BUTTON DID NOT WORK BRO!!!\"). It was this: HD_CACHE keys off this hash, and\n"
       "     G_WORN was not in it, so putting on a red shirt changed the frame the\n"
       "     renderer WOULD build and never changed the key -- the cache served the old\n"
       "     body forever. Every test that called buildFrame directly passed, because\n"
       "     that is a side door around the cache. The surface he taps goes through it. */\n"
       "  const parts=[G.equipped,G.tints,G.swing,G.bodyVar,G.rigidLimbs,"
       "typeof window!=='undefined'&&window.G_WORN?window.G_WORN:0,"
       "typeof skinTone!=='undefined'?skinTone:0,")


def main():
    s = open(ALPHA, encoding='utf-8').read()
    if 'window.G_WORN?window.G_WORN:0' in s:
        print('already applied')
        return 0
    if s.count(OLD) != 1:
        print('REFUSING TO WRITE: frameLookHash parts resolved %d times, expected 1' % s.count(OLD))
        return 1
    open(ALPHA, 'w', encoding='utf-8').write(s.replace(OLD, NEW))
    print('G_WORN now invalidates the frame cache -- wearing a garment repaints the stage')
    return 0


if __name__ == '__main__':
    sys.exit(main())
