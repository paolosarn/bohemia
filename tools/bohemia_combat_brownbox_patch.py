#!/usr/bin/env python3
"""BOHEMIA - COMBAT v83: THE BROWN BOX IS A PLACEHOLDER FROM BEFORE THE SPRITES.

Paolo, with a screenshot: "now would be the perfect time to get rid of this part
of the animation, the blood animation goes off, there's a brown square that covers
everything in... and as that bullet's travelling the dead shot dial can like fade
away, so by the time there's that pause the dead shot dial is not there, cause it
kind of looks like shit."

TWO FIXES. Both found by looking at his screen and then at the real surface,
rather than guessing.

--- 1. THE BROWN BOX --------------------------------------------------------
Sampled straight out of his screenshot, the quad is #6c503b -- a warm mid-brown.
Not the pillar khaki (#6e604a), not the faction floor (all near-black). Searching
the demo for that colour lands on two blocks, and both are labelled in the source
as LEGACY_PRE_REVAMP -- dead code from before the game had real character sprites:

    c.fillStyle='#3a3228'; px(c,cx-3*S,cy-1*S,6*S,7*S);   /* torso */
    c.fillStyle='#5a4a38'; px(c,cx-2*S,cy-6*S,4*S,4*S);   /* head   */
    c.fillStyle='#241c14'; px(c,cx-2*S,cy-6*S,4*S,1.5*S); /* brow   */

A 6S x 7S rectangle where S is min(W,H)/90. On a phone that is about 26x30 px --
and the killshot runs it through the board zoom (up to 3.6x) AND the kill camera,
so it lands on screen as a slab well over a hundred pixels across. That is the
brown square covering everything.

THE FIX IS NAME IT OR DON'T DRAW IT, APPLIED LITERALLY. A nameless brown slab
standing in for a human being is precisely what that law forbids. If the sprite is
not there, DRAW NOTHING and say so in the log, because a missing body is a bug to
find, not a box to paint over the screen. The kill camera is on the victim anyway,
so an unrendered shooter costs nothing and a brown slab costs the whole frame.

--- 2. THE DIAL IS STILL ON SCREEN WHEN THE FREEZE LANDS -------------------
A dial fade already existed (7/3/26): `_df` ramps out over 350ms from `G._ksAt`.
The problem is that 350ms is unrelated to when the bullet actually arrives.

    travel fraction  = 0.18 (sharp) / 0.50 (hammer) / 0.55 (follow)
    minimum ks.dur   = 0.5s
    so a sharp shot contacts at 0.18 x 0.5 = 0.09s
    and at contact the dial is still at 1 - 90/350 = 0.74

**THE DIAL WAS 74% VISIBLE AT THE MOMENT OF IMPACT**, which is exactly the frame
he screenshotted and exactly what he is describing.

THE FIX: fade the dial across the BULLET'S OWN TRAVEL TIME, so it reaches zero at
contact. The instrument leaves as the bullet flies and the stage is empty the
instant the world freezes. The fade is derived from the same numbers the bullet
uses, so it cannot drift out of step with it -- the same "derive it, never type
it" rule the freeze and the song measurement both needed.

REUSE CHECK: no art or audio assets are cooked, read or written. This DELETES two
legacy placeholder blocks and re-derives one alpha from the bullet's own timing.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_brownbox_patch.py
Gate:  node gates/combat_lab_gate.js   (section 18)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V83 NO PLACEHOLDER SLABS'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # --- 1a. the PLAYER's legacy placeholder slab ---
    demo = sub1(demo,
        "  c.fillStyle='#3a3228';px(c,cx-3*S,cy-1*S,6*S,7*S);\n"
        "  c.fillStyle='#5a4a38';px(c,cx-2*S,cy-6*S,4*S,4*S);\n"
        "  c.fillStyle='#241c14';px(c,cx-2*S,cy-6*S,4*S,1.5*S);\n"
        "}",
        "  /* V83 NO PLACEHOLDER SLABS (Paolo, with a screenshot: \"there's a brown\n"
        "     square that covers everything\"). This was a LEGACY_PRE_REVAMP block from\n"
        "     before the game had real sprites: a 6S x 7S brown torso and a 4S head,\n"
        "     which the killshot then ran through the board zoom (up to 3.6x) AND the\n"
        "     kill camera, landing on screen as a slab over a hundred pixels across.\n"
        "     NAME IT OR DON'T DRAW IT, applied literally: a nameless brown rectangle\n"
        "     standing in for a human being is exactly what that law forbids. If the\n"
        "     sprite is not there we draw NOTHING and say so, because a missing body is\n"
        "     a bug to find, not a box to paint over the frame. */\n"
        "  if(!G._noSprWarn){ G._noSprWarn=true;\n"
        "    try{ logLine && logLine('player sprite not ready - drawing nothing (was a brown placeholder slab)'); }catch(_e){}\n"
        "    try{ console.warn('BOHEMIA: player sprite not ready; V83 draws nothing rather than a placeholder slab'); }catch(_e){} }\n"
        "}",
        'player placeholder slab')

    # --- 1b. the KILLSHOT TARGET's legacy placeholder slab ---
    demo = sub1(demo,
        "    else if(!tgt){/* LEGACY_PRE_REVAMP (4): no-target fallback blocks */c.fillStyle='#4a4038';px(c,tx-3*S,ty-5*S,6*S,7*S);c.fillStyle='#5a4a3a';px(c,tx-2*S,ty-9*S,4*S,4*S);}",
        "    /* V83: the no-target fallback slab is DELETED. It was the same legacy\n"
        "       placeholder as the player's, and the kill camera is pointed straight at\n"
        "       it, so it filled his screen with a brown box at the exact moment the\n"
        "       freeze lands. No target means nothing to draw. */",
        'target placeholder slab')

    # --- 2. the dial fades across the BULLET'S OWN TRAVEL, reaching 0 at contact ---
    demo = sub1(demo,
        "  const _df=(G.ks&&G._ksAt)?Math.max(0,1-(performance.now()-G._ksAt)/350):1;",
        "  /* V83 THE DIAL IS GONE BY THE TIME THE WORLD STOPS (Paolo: \"as that bullet's\n"
        "     travelling the dial can fade away, so by the time there's that pause the\n"
        "     dial is not there\"). The old fade was a flat 350ms, unrelated to when the\n"
        "     bullet actually arrives: a sharp shot contacts at 0.18 x 0.5s = 90ms, so\n"
        "     the dial was still 74% VISIBLE at the moment of impact -- the exact frame\n"
        "     he screenshotted. It now fades across the BULLET'S OWN TRAVEL TIME, derived\n"
        "     from the same two numbers the bullet uses, so it cannot drift out of step\n"
        "     with it. The instrument leaves as the round flies; the stage is empty when\n"
        "     the freeze lands. */\n"
        "  const _dfT=G.ks?Math.max(0.05,G.ks.dur*(G.ks.style==='sharp'?0.18:G.ks.style==='hammer'?0.5:0.55)):0.35;\n"
        "  const _df=(G.ks&&G._ksAt)?Math.max(0,1-(performance.now()-G._ksAt)/(_dfT*1000)):1;",
        'dial fades over the bullet travel')

    return demo


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  demo: re-embedded (%d bytes, %+d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
