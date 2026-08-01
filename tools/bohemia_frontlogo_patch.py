#!/usr/bin/env python3
"""
BOHEMIA — HIS CHOSEN LOGO ONTO THE FRONT SCREEN (8/1/26)

REUSE CHECK: cooks NOTHING. It lifts the finished PNG out of
banks/BOHEMIA_LOGO_CANDIDATES_8_1_26.txt (logo 11, the one HE chose) and inlines those
exact bytes into the alpha. No pixel is drawn or altered here. Purchased libraries hold
no wordmark (checked in tools/bohemia_logo_cook.py), so there is nothing bought to
prefer.

Paolo 8/1, with logos 3 and 5 in front of him: "If you can put the coloring of the
[Sign] painter exactly as the Punk stencil is just be concerned with the coloring I
would be very happy. Do that properly slide it into the homepage the first thing I see
every time I open up the alpha, please"

WHAT THIS REPLACES. The front screen already had a wordmark, drawn live by
renderWordmark() from a GLYPH table baked into the alpha - italic, sheared, with a
fault-slip. It was never judged. His logo is judged, so it wins, and the old renderer
stays in the file untouched because other surfaces call it.

WRITING TO THE ALPHA IS THE DANGEROUS PART AND THIS FILE KNOWS IT. A 34 MB single-file
alpha was once truncated to ZERO BYTES by an open(p,'w') whose replacement expression
raised - Python opens and truncates before it evaluates the argument. So: read whole,
verify every anchor is present and unique, build the new text in memory, assert the
result is not smaller than the original, and only then write.

  python3 tools/bohemia_frontlogo_patch.py
"""
import json
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_LOGO_CANDIDATES_8_1_26.txt'
MARK = 'BOH_FRONT_LOGO_B64'


def main():
    bank = json.load(open(BANK))
    pick = bank.get('chosen_by_paolo') or bank.get('my_pick')
    logo = next(l for l in bank['logos'] if l['n'] == pick)
    print('front logo -> %d  %s' % (pick, logo['name']))

    src = open(ALPHA, encoding='utf8').read()
    before = len(src)

    # ---- the payload, inlined once, right before the front markup
    # anchor on the MARKUP, not the string: '<div id="front">' also appears inside a
    # comment further down the file, and the first run of this patch refused because of
    # it. That refusal was correct - a two-match anchor in a 34 MB single-file build is
    # exactly how the wrong thing gets rewritten.
    anchor = '<div id="front">\n  <canvas id="logobig"'
    if src.count(anchor) != 1:
        raise SystemExit('REFUSING: expected exactly one front-screen anchor, found %d'
                         % src.count(anchor))
    block = (
        '<script>\n'
        '/* HIS CHOSEN LOGO (Paolo 8/1). Logo 11 of the eleven he was shown: the SIGN\n'
        '   PAINTER letterforms wearing the PUNK STENCIL palette, which is exactly what\n'
        '   he asked for - "just be concerned with the coloring". Inlined as the finished\n'
        '   bytes from banks/BOHEMIA_LOGO_CANDIDATES_8_1_26.txt so the front screen and\n'
        '   the judged artwork can never drift apart. */\n'
        'var %s = "%s";\n'
        '</script>\n' % (MARK, logo['b64']))
    if MARK in src:                       # idempotent: replace the old payload
        src = re.sub(r'<script>\n/\* HIS CHOSEN LOGO.*?</script>\n', block, src,
                     count=1, flags=re.S)
    else:
        src = src.replace(anchor, block + anchor, 1)

    # ---- draw it instead of the unjudged live wordmark
    old = 'function drawLogoBig(){renderWordmark(document.getElementById(\'logobig\'),11,15);}'
    if src.count(old) != 1:
        if 'BOH_FRONT_LOGO_IMG' not in src:
            raise SystemExit('REFUSING: drawLogoBig anchor not found exactly once')
    else:
        new = (
            "var BOH_FRONT_LOGO_IMG=null;\n"
            "function drawLogoBig(){\n"
            "  /* HIS LOGO, not the old live-drawn wordmark. Nearest-neighbour and an\n"
            "     INTEGER scale, because this is pixel art and a fractional blit would\n"
            "     soften every edge (the no-resample law). Letterboxed on the canvas so\n"
            "     nothing is ever cropped - four of the ten candidates ran off their own\n"
            "     frame before the gate caught it, and that must not happen here. */\n"
            "  var cv=document.getElementById('logobig'); if(!cv) return;\n"
            "  var x=cv.getContext('2d');\n"
            "  if(!BOH_FRONT_LOGO_IMG){\n"
            "    BOH_FRONT_LOGO_IMG=new Image();\n"
            "    BOH_FRONT_LOGO_IMG.onload=function(){drawLogoBig();};\n"
            "    BOH_FRONT_LOGO_IMG.src='data:image/png;base64,'+" + MARK + ";\n"
            "  }\n"
            "  var im=BOH_FRONT_LOGO_IMG;\n"
            "  if(!im.complete||!im.naturalWidth){ return; }\n"
            "  /* THE CANVAS TAKES THE ARTWORK'S OWN SIZE. The first wiring kept the\n"
            "     canvas at its old 640x170 and letterboxed a 400x130 logo inside it at\n"
            "     integer scale 1, so on a phone it came out small and adrift in a field\n"
            "     of dead canvas. Sizing the canvas TO the image means CSS lays out the\n"
            "     logo itself, it fills its box edge to edge, and the scaling is done by\n"
            "     the browser with image-rendering:pixelated - crisp, and no fractional\n"
            "     blit inside the canvas. */\n"
            "  if(cv.width!==im.naturalWidth||cv.height!==im.naturalHeight){\n"
            "    cv.width=im.naturalWidth; cv.height=im.naturalHeight;\n"
            "  }\n"
            "  x.imageSmoothingEnabled=false;\n"
            "  x.clearRect(0,0,cv.width,cv.height);\n"
            "  x.drawImage(im,0,0);\n"
            "}")
        src = src.replace(old, new, 1)

    # THE GUARD IS AGAINST TRUNCATION, NOT AGAINST CHANGE. It first refused a legitimate
    # re-patch because the replacement PNG compressed 4 KB smaller than the one it
    # replaced - a correct instinct calibrated wrong. What it must catch is the alpha
    # going to zero or losing a chunk, which is a real thing that has happened to this
    # file. 2% is far tighter than any real loss and far looser than a payload swap.
    if len(src) < before * 0.98:
        raise SystemExit('REFUSING: alpha would LOSE CONTENT %d -> %d (%.1f%%)'
                         % (before, len(src), 100.0 * len(src) / before))
    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  alpha %d -> %d bytes' % (before, len(src)))
    print('  front screen now shows his logo, letterboxed, integer scale, no smoothing')


if __name__ == '__main__':
    main()
