#!/usr/bin/env python3
"""
CITY FULL PIXEL PATCH (7/31/26) -- fix the blur on the surface Paolo ACTUALLY PLAYS.

Paolo 7/31, twice, in caps: "WHY WHEN I ZOOM IN ARE ALL THE QUALITY OF THE PIXELS
OF THE TILES SO DOGSHIT??? WHY IS THE PIXEL QUALITY NOT AT FULL BRO WTF."
Then, after I "fixed" it: "ALL THE FIXES I NEEDED TO SEE ARE NOT THERE!!!"

HE WAS RIGHT BOTH TIMES, AND THE SECOND TIME IS THE ONE THAT MATTERS.

I found the device-pixel-ratio bug in slices/BOHEMIA_RUN_SLICE_7_26_26.html, fixed
it there, measured it there in a headless browser at DPR 3, gated it there, and
shipped. Every one of those steps was real. All of them were on a file he never
opens.

THE ALPHA ROUTES THE RUN TAB TO THE CITY PANEL, on purpose, per his own 7/25
ruling that there is ONE view with a zoom continuum (walk zoomed in, zoom out to
the city-builder). The alpha says so in its own comment at the routing line. So
the CITY renderer is the game. The run slice is a development surface.

I broke VERIFY ON THE REAL SURFACE (7/18) -- the law that exists because of exactly
this -- while believing I was obeying it. Measuring rigorously on the wrong canvas
is not verification, it is a more convincing way to be wrong.

THE BUG, identical in both renderers:

    function fit(){ ...
      cv.width=w; cv.height=h;                 // <-- CSS pixels
      cv.style.width=w+'px'; cv.style.height=h+'px'; }

The backing store is sized in CSS pixels and devicePixelRatio is never consulted.
On his phone (DPR 3) the whole game is rendered into a buffer one third the width
and one third the height of the screen, and the BROWSER stretches it 3x on the way
to the glass, with its own smoothing. That blur happens after the canvas is
finished, so no imageSmoothingEnabled=false inside the page can undo it. It is
literally 1/9th of the pixels he paid for.

THE FIX: size the buffer in DEVICE pixels and scale the context by the same factor.
Every existing draw call keeps working in CSS units -- no geometry changes, no
layout changes, nothing to re-tune -- but each one now lands on 3x the pixels. And
because a 44px tile drawn at 44 CSS units becomes 132 device pixels, the scale is
an exact integer 3x, so nearest-neighbour keeps it crisp instead of smeared.

REUSE CHECK: cooks no graphic pixels. It rewrites two lines of existing renderer
code inside CITY_B64. No bank is read and none is needed.

Idempotent: re-running finds the marker and reports NOOP. Refuses to write if the
expected source text is missing, so a renderer another lane has rewritten fails
loudly instead of being half-patched.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = '__FULL_PIXEL_DPR__'

OLD = ("  const w=Math.max(1,Math.round(r.width)), h=Math.max(1,Math.ceil(r.height));\n"
       "  cv.width=w; cv.height=h;\n"
       "  cv.style.width=w+'px'; cv.style.height=h+'px';\n"
       "  render(); }")

NEW = ("  const w=Math.max(1,Math.round(r.width)), h=Math.max(1,Math.ceil(r.height));\n"
       "  /* " + MARKER + " -- FULL PIXEL QUALITY (Paolo 7/31, THE BUILT WORLD LAW B1).\n"
       "     This said `cv.width=w; cv.height=h;` -- the backing store in CSS pixels,\n"
       "     devicePixelRatio never consulted. On his phone (DPR 3) the entire game was\n"
       "     drawn into a buffer one third the width and height of the screen and the\n"
       "     BROWSER stretched it 3x on the way to the glass with its own smoothing.\n"
       "     One ninth of the pixels, and the blur lands after the canvas is done so\n"
       "     nothing inside the page can undo it. That is 'the pixel quality is not at\n"
       "     full', exactly.\n"
       "     Buffer is device pixels now; the context is scaled by the same factor so\n"
       "     every existing draw call keeps working in CSS units and nothing else has to\n"
       "     change. A 44px tile at 44 CSS units becomes 132 device pixels: an exact\n"
       "     integer 3x, so nearest-neighbour stays crisp. */\n"
       "  const __DPR=Math.max(1,Math.min(4,Math.round(window.devicePixelRatio||1)));\n"
       "  cv.width=Math.round(w*__DPR); cv.height=Math.round(h*__DPR);\n"
       "  cv.style.width=w+'px'; cv.style.height=h+'px';\n"
       "  try{ const __g=cv.getContext('2d');\n"
       "       __g.setTransform(__DPR,0,0,__DPR,0,0);\n"
       "       __g.imageSmoothingEnabled=false; }catch(_e){}\n"
       "  render(); }")


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found in the alpha')
        return 1
    b64 = m.group(1)
    city = base64.b64decode(b64).decode('utf8', errors='ignore')

    if MARKER in city:
        print('NOOP: the city canvas is already at full device resolution')
        return 0
    if OLD not in city:
        print('FAIL: the city fit() is not where this tool expects it.\n'
              '      Another lane may have rewritten the renderer; refusing to half-patch.')
        return 1

    city = city.replace(OLD, NEW, 1)

    # sanity: the transform must be re-applied on EVERY resize, not once at boot,
    # because setting canvas.width resets the context state including the transform.
    if city.count('setTransform(__DPR') != 1:
        print('FAIL: expected exactly one DPR transform inside fit()')
        return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    alpha = alpha[:m.start(1)] + out + alpha[m.end(1):]
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('wrote %s (city blob %d -> %d bytes)' % (ALPHA, len(b64), len(out)))
    print('  the CITY canvas now renders at full device resolution')
    return 0


if __name__ == '__main__':
    sys.exit(main())
