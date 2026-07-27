#!/usr/bin/env python3
"""BOHEMIA - COMBAT v84c: THE ORANGE IS THE ROAD MEDIAN, NOT THE DIAL.

Paolo, three times: "the dead shot dial orange part is still there by the time
the game pauses."

NAMED BY THE INSTRUMENT, NOT BY ME. With WHAT'S ON SCREEN armed, the game itself
reported, during the pause:

    x10  fill rgba(184,160,40,0.55)  2x2670  (3.1% of screen)

That is the DOUBLE-YELLOW ROAD MEDIAN -- the street's centre line -- drawn ten
times during the freeze as a full-height gold stripe. IT IS NOT THE DIAL. Which
is exactly why v83's dial fade changed nothing he could see: I was fading the
wrong object, twice.

It survives because drawFloor lays base + pulse + VIGNETTE, and then drawField
paints the street markings ON TOP of the vignette. So the one thing meant to dim
the scene runs before the brightest thing in it.

THE FIX: the street markings fade with the shot, on the SAME _df the dial already
uses. They are environment; during a kill they have no business being the
brightest object on screen. The lane dashes go with them for the same reason.

REUSE CHECK: no art or audio assets are cooked, read or written. Two existing
fills get the existing fade multiplier.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V84C THE MARKINGS FADE WITH THE SHOT'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo
    demo = sub1(demo,
        "    if(medX>-t*20&&medX<W+t*20){ x.fillStyle='rgba(184,160,40,0.55)';",
        "    /* V84C THE MARKINGS FADE WITH THE SHOT. The instrument named this: during\n"
        "       the kill pause the game was drawing rgba(184,160,40,0.55) as a 2x2670\n"
        "       gold stripe, ten times, and Paolo has been calling it \"the orange from\n"
        "       the dial\" for three turns. It is the road's double-yellow median, and it\n"
        "       is drawn AFTER drawFloor's vignette -- so the one pass meant to dim the\n"
        "       scene runs before the brightest object in it. It is environment; during a\n"
        "       kill it has no business out-shining the body. */\n"
        "    const _mk=(G.ks&&G._ksAt)?Math.max(0,1-(performance.now()-G._ksAt)/260):1;\n"
        "    if(medX>-t*20&&medX<W+t*20){ x.fillStyle='rgba(184,160,40,'+(0.55*_mk).toFixed(3)+')';",
        'median fades with the shot')
    demo = sub1(demo,
        "    x.fillStyle='rgba(215,205,185,0.38)';\n"
        "    for(const lane of [-1.5,6.5]){",
        "    x.fillStyle='rgba(215,205,185,'+(0.38*_mk).toFixed(3)+')';   /* V84C: the lane dashes go with it */\n"
        "    for(const lane of [-1.5,6.5]){",
        'lane dashes fade too')
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
