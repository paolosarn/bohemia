#!/usr/bin/env python3
"""
V225 -- THE FRAME MOVES THE GROUND, NOT THE PERSON  (COMBAT lane, [fight looks])

THE COORDINATOR'S NOTE ON MY ROW, 9/23b, on V224: "THE GLASS IS HONEST NOW, 112 CSS,
and the row does not close yet: rule 21 says the frame moves the ground and never his
size, and your own record says the auto frame still scales the person to 71 CSS at a
wide frame. [fight looks] closes when he is 112 at EVERY frame width; that half stays
here, not in [fight feel]."

So this is the other half of rule 21's fight leg, and it is the half my own record
named and left open.

------------------------------------------------------------------ WHAT WAS WRONG

V224 made the fight's canvas honest, so the ruled 112 box is 112 CSS pixels. But the
fight has a camera the walked street does not: THE AUTO FRAME, which widens to hold
every living enemy, and it widens by scaling THE WHOLE WORLD -- the ground and the
people together. Measured on the cut, on the phone profile, in real fights:

    frame at 1.105   the fighter is  62 CSS
    frame at 0.636   the fighter is  71 CSS
    frame at 0.372   the fighter is  42 CSS

One ruled body, three sizes, chosen by how far away the furthest man happens to be.
That is exactly what rule 21 forbids: "the camera moves the ground, NEVER HIS SIZE."

------------------------------------------------------------------- WHAT IT DOES

ONE NUMBER BECOMES TWO, because it was always doing two jobs:

    bodyRule()    THE RULED SIZE. What the rulers read: how big a person IS, which
                  is what a house lot is 1.75 of. Exactly what bodyScale returned
                  before this, so tileWideMult and contentR are byte-identical.
    bodyScale()   THE DRAWN SIZE. What the sprite is blitted at, and it now divides
                  by the live frame, because the body is drawn INSIDE the camera's
                  own transform -- so dividing by the zoom and then being multiplied
                  by it lands the body on exactly the ruled pixels, at every frame
                  width, by construction rather than by tuning.

Everything that rides bodyScale is a BODY OFFSET measured against the sprite -- the
head at 84, the soles at 28, the mass marker at 42, the blood pool, the aim ring --
and every one of them is drawn in the same transform as the body, so they follow the
drawn size and stay where they were put. The two RULERS are the only readers that
wanted the other number, and they are the only two repointed.

THE BODY BOARD CANNOT MOVE: bodyRule is 1/FIELD_ZOOM when houseOn() is false and the
draw divides by nothing there, so the old value runs byte for byte.

--------------------------------------------- AND THE FRAME HAS TO KNOW HE IS BIG

The auto frame solves for the GROUND: fit the furthest man's distance inside the
glass, minus a thumb margin. That was safe while bodies shrank with everything else.
With a body that never shrinks, a man at the edge of the frame is now a constant 112
px tall no matter how wide the shot, so the margin has to hold a whole person or the
furthest man is half off the screen at exactly the moment the camera widened to
include him.

So the pad gains the body's own half-height, DERIVED (112*bodyRule()/2) rather than
picked. At the ruled size that is 56 px of margin that used to be a shrinking number
and is now an honest constant.

NO DAMAGE BEFORE THE DIAL: not a reach, a chance, a hit or a turn. MAP LAW held: this
authors no street. The ground still zooms exactly as it did -- fieldPitch, the ring,
contentR and every distance are untouched, which is the whole point: THE GROUND MAY
ZOOM, THE PERSON MAY NOT.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_FRAME_MOVES_THE_GROUND__'

OLD_BODY = """function bodyScale(){ return houseOn()?1:(1/FIELD_ZOOM); }"""

NEW_BODY = """/* ===== V225 __THE_FRAME_MOVES_THE_GROUND__ (COMBAT, [fight looks], rule 21) =====
   V224 made the canvas honest, so the ruled 112 box is 112 CSS pixels. But the fight
   has a camera the walked street does not -- THE AUTO FRAME -- and it widens by
   scaling THE WHOLE WORLD, ground and people together. Measured on the cut, on the
   phone profile, in real fights: the fighter read 62 CSS at a frame of 1.105, 71 at
   0.636 and 42 at 0.372. ONE RULED BODY, THREE SIZES, chosen by how far away the
   furthest man happened to be. Rule 21: "the camera moves the ground, NEVER HIS SIZE."

   SO ONE NUMBER BECOMES TWO, because it was always doing two jobs:
     bodyRule()   THE RULED SIZE -- how big a person IS, which is what a lot is 1.75
                  of. Exactly what bodyScale returned before, so the two rulers that
                  read it (tileWideMult, contentR) are byte-identical.
     bodyScale()  THE DRAWN SIZE -- what the sprite is blitted at. It divides by the
                  live frame because the body is drawn INSIDE the camera's transform,
                  so dividing by the zoom and then being multiplied by it lands him on
                  the ruled pixels AT EVERY FRAME WIDTH, by construction.
   Everything else that reads bodyScale is a BODY OFFSET against the sprite (the head
   at 84, the soles at 28, the mass marker at 42, the pool, the aim ring), drawn in the
   same transform, so they follow the drawn size and stay where they were put.
   The body board cannot move: bodyRule is 1/FIELD_ZOOM there and the draw divides by
   nothing, so the old value runs byte for byte. */
function bodyRule(){ return houseOn()?1:(1/FIELD_ZOOM); }
function bodyScale(){ return houseOn()?(bodyRule()/Math.max(0.05,uzEff())):bodyRule(); }"""

OLD_MULT = """  const nat=Math.min(W,H)*FIELD_PITCH, spr=112*bodyScale();"""
NEW_MULT = """  const nat=Math.min(W,H)*FIELD_PITCH, spr=112*bodyRule();   /* V225: the RULED size. A lot is 1.75 of how big a person IS, never of how big the camera drew him this frame. */"""

OLD_CONTENT = """function contentR(){ return 0.85/(FIELD_PITCH*(houseOn()?(TILE_WIDE*112*bodyScale())/(430*FIELD_PITCH):1)) + 2; }"""
NEW_CONTENT = """function contentR(){ return 0.85/(FIELD_PITCH*(houseOn()?(TILE_WIDE*112*bodyRule())/(430*FIELD_PITCH):1)) + 2; }   /* V225: the RULED size, so how far the world is BUILT does not breathe with the camera */"""

OLD_PAD = """      if(md>0){ const _k=Math.max(1,cv.width/Math.max(1,cv.getBoundingClientRect().width||cv.width));
        const _pad=(G.isTouch?48:22)*_k, _slack=(G.isTouch?35:20)*_k, _ceil=G.isTouch?1.30:1.85;"""

NEW_PAD = """      /* V225 __THE_FRAME_MOVES_THE_GROUND__: AND THE FRAME HAS TO KNOW HE IS BIG.
         This solves for the GROUND -- fit the furthest man inside the glass, less a
         thumb margin -- which was safe while bodies shrank with everything else. A body
         that never shrinks is a constant 112 px tall however wide the shot, so the
         margin must hold A WHOLE PERSON or the furthest man is half off the screen at
         exactly the moment the camera widened to take him in. DERIVED, not picked:
         his own half-height. */
      if(md>0){ const _k=Math.max(1,cv.width/Math.max(1,cv.getBoundingClientRect().width||cv.width));
        const _pad=(G.isTouch?48:22)*_k + 112*bodyRule()/2, _slack=(G.isTouch?35:20)*_k, _ceil=G.isTouch?1.30:1.85;"""


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES. V214 terminated a JS string and the fight
    stopped defining G; V217's first cut left a block comment open and the last script
    went silent. A guard that checks whether the file still runs rather than the text
    it wrote is not a guard."""
    bodies = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', blob, re.S | re.I)
    if not bodies:
        sys.exit('GUARD %s: no inline scripts found, which cannot be right' % label)
    bad = 0
    for i, b in enumerate(bodies):
        fd, p = tempfile.mkstemp(suffix='.js')
        os.write(fd, b.encode('utf-8'))
        os.close(fd)
        r = subprocess.run(['node', '--check', p], capture_output=True)
        os.unlink(p)
        if r.returncode != 0:
            bad += 1
            print('  SCRIPT %d OF %d DOES NOT PARSE:' % (i + 1, len(bodies)),
                  r.stderr.decode('utf-8', 'replace').strip().splitlines()[-1][:160])
    if bad:
        sys.exit('GUARD %s: %d of %d scripts do not parse' % (label, bad, len(bodies)))
    print('  %s: %d scripts, all parse' % (label, len(bodies)))


def sub(s, old, new, what):
    n = s.count(old)
    if n != 1:
        sys.exit('ANCHOR %s: expected 1, found %d' % (what, n))
    return s.replace(old, new, 1)


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  the frame already moves the ground')
        return
    if '__THE_FIGHT_RENDERS_LIKE_THE_STREET__' not in blob:
        sys.exit('GUARD: V224 is not in this blob; V225 is written on top of it')
    blob = sub(blob, OLD_BODY, NEW_BODY, 'blob/bodyScale and bodyRule')
    blob = sub(blob, OLD_MULT, NEW_MULT, 'blob/tileWideMult reads the ruled size')
    blob = sub(blob, OLD_CONTENT, NEW_CONTENT, 'blob/contentR reads the ruled size')
    blob = sub(blob, OLD_PAD, NEW_PAD, 'blob/the frame holds a whole person')

    code = re.sub(r'/\*.*?\*/', '', blob, flags=re.S)
    if code.count('function bodyRule()') != 1 or code.count('function bodyScale()') != 1:
        sys.exit('GUARD: the two sizes are not defined exactly once each')
    # THE RULERS READ THE RULED SIZE AND NOTHING ELSE. A ruler that reads the DRAWN
    # size breathes with the camera, which is the bug this ships against.
    for name, txt in (('tileWideMult', 'spr=112*bodyRule()'),
                      ('contentR', 'TILE_WIDE*112*bodyRule()')):
        if txt not in code:
            sys.exit('GUARD: %s does not read the ruled size' % name)
    if re.search(r'(spr|TILE_WIDE\*112)\s*=?\*?\s*112?\*?bodyScale\(\)', code):
        sys.exit('GUARD: a ruler still reads the drawn size')
    # AND THE DRAWN SIZE REALLY DIVIDES BY THE LIVE FRAME.
    if 'bodyRule()/Math.max(0.05,uzEff())' not in code:
        sys.exit('GUARD: the drawn size does not divide by the live frame')
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V225 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
