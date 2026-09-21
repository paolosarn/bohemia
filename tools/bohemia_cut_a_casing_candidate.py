#!/usr/bin/env python3
# ============================================================================
# CUT A CASING CANDIDATE (UI lane 11, 9/21/26) -- row [cook panels].
#
# *** WHY THIS EXISTS. ***
# The casing face is the one on every chip in the game, at 5 px. Measuring every
# pair of capitals in it (tools/bohemia_which_letters_are_the_same.js) says H and
# N are the CLOSEST PAIR IN THE WHOLE ALPHABET: 10.6% of the ink differs at 5 px.
# The control settles what is to blame. The SAME 5x8 glyph table cut three ways:
#   ROM     (gutters, no overlap)  H/N 21.3%
#   BODY    (solid, proportional)  H/N 17.3%
#   CASING  (cells overlap 25%)    H/N 10.6%
# The table is not the problem. THE OVERLAP IS. An N's diagonal lives one column
# in from the left stem, and at 125 ink on a 100 column the stem's ink already
# reaches into that column, so the diagonal fuses to the stem and the letter
# becomes an H with a fat shoulder. Same for W against H, and A against H.
#
# THE OVERLAP IS NOT A BUG, it is what makes the face condensed and heavy, so the
# answer is a NUMBER, not a rewrite. This cuts the same face at a softer overlap
# so the two can be measured and looked at side by side.
#
# IT DOES NOT TOUCH THE SHIPPED FACE. It writes its own file under a candidate
# name. Rule 18 keeps this lane off the play surface; a candidate on a vote sheet
# is not the play surface.
#
#     python3 tools/bohemia_cut_a_casing_candidate.py 110
# ==========================================================================
import sys, os, importlib.util, base64

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location(
    'cutter', os.path.join(ROOT, 'tools', 'bohemia_cut_the_rom_face.py'))
cutter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cutter)

def cut(ink):
    was = cutter.CAS_INK
    cutter.CAS_INK = ink
    try:
        fb, widths = cutter.build_casing(False)
    finally:
        cutter.CAS_INK = was
    out = os.path.join(ROOT, 'slices', 'fonts')
    stem = 'BohemiaCasingCand%d-Regular' % ink
    ttf = os.path.join(out, stem + '.ttf')
    fb.save(ttf)
    from fontTools.ttLib import TTFont
    f = TTFont(ttf); f.flavor = 'woff2'
    w2 = os.path.join(out, stem + '.woff2')
    f.save(w2)
    os.remove(ttf)
    print('  ink %d on a %d column (%.2f columns of stem) -> %s, %d bytes'
          % (ink, cutter.CAS_PITCH_X, ink / cutter.CAS_PITCH_X, stem + '.woff2',
             os.path.getsize(w2)))
    return w2

if __name__ == '__main__':
    inks = [int(a) for a in sys.argv[1:] if a.isdigit()] or [110]
    print('CASING CANDIDATES (the shipped face is ink %d and is NOT touched)' % cutter.CAS_INK)
    for i in inks:
        cut(i)
