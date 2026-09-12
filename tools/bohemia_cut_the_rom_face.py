#!/usr/bin/env python3
# ============================================================================
# CUT THE ROM FACE (UI lane 11, 9/13/26) -- row [no slop].
# laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md
# DIRECTION's ruling: records/BOHEMIA_THE_FONT_RESEARCH_9_11_26.md sections 2-4,
# routed in its own ROUTED block to THIS row ("UI: the vibe-purge row builds to
# section 2-3").
#
# *** WHAT THIS IS, SAID PLAINLY, BECAUSE THE HONEST NAME IS THE WHOLE POINT. ***
# It is OUR OWN 5x8 dot-grid cut, drawn here, on the CELL GEOMETRY a character-cell
# display uses. It is NOT a copy of the Hitachi HD44780 CGROM and this file will not
# call it one. The ruling's own licence line says exactly this and nothing more:
# "ROM cut: drawn by us from the cell grid". The datasheet's pixel data is not in
# this repo and could not be fetched (eleif.net is blocked by the egress proxy), so
# claiming these are its glyphs would be a claim with nothing behind it -- and this
# lane spent a round last week deleting a sentence of exactly that kind out of its
# own evidence. What IS taken from the hardware is the part that is a measurement
# rather than a drawing: five dots wide by eight tall, one dot of gutter, every
# character the same width because a cell cannot be any other width.
#
# WHY A FACE AT ALL, AND WHY THIS ONE FIRST. DIRECTION ruled FIXED PITCH IS LEGAL
# ONLY WHERE THE IN-WORLD DEVICE IS A CHARACTER-CELL SCREEN. Today all three type
# registers on the walked city resolve to one fixed-pitch outline face, so the game
# is in breach of that ruling on every surface that is not a screen, and the tell
# count says so: 66 hits for monospace. The screen register is the one place fixed
# pitch is RIGHT, so it is the one that gets a real face first -- after this, the
# casing and body registers are the ones that have to stop being monospace, and
# they are a different job with different glyphs.
#
# THE DOTS ARE SEPARATE ON PURPOSE. The ruling asks for "a 2px dot grid with the dot
# gaps visible". A lit cell is drawn as its own square with a gutter around it, so
# at a small size the face reads as a thing made of lamps rather than as small type.
# That is the difference between a screen and a font.
#
#     python3 tools/bohemia_cut_the_rom_face.py            # build + print a proof
#     python3 tools/bohemia_cut_the_rom_face.py --embed    # rewrite the @font-face
# ==========================================================================
import sys, os, base64, io, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 5 wide, 8 tall. Rows 0-6 sit above the baseline, row 7 is the descender row.
G = {
' ': ["     ","     ","     ","     ","     ","     ","     ","     "],
'!': ["  #  ","  #  ","  #  ","  #  ","  #  ","     ","  #  ","     "],
'"': [" # # "," # # ","     ","     ","     ","     ","     ","     "],
'#': [" # # "," # # ","#####"," # # ","#####"," # # "," # # ","     "],
'$': ["  #  "," ####","# #  "," ### ","  # #","#### ","  #  ","     "],
'%': ["##   ","##  #","   # ","  #  "," #   ","#  ##","   ##","     "],
'&': [" ##  ","#  # ","# #  "," #   ","# # #","#  # "," ## #","     "],
"'": ["  #  ","  #  "," #   ","     ","     ","     ","     ","     "],
'(': ["   # ","  #  "," #   "," #   "," #   ","  #  ","   # ","     "],
')': [" #   ","  #  ","   # ","   # ","   # ","  #  "," #   ","     "],
'*': ["     ","  #  ","# # #"," ### ","# # #","  #  ","     ","     "],
'+': ["     ","  #  ","  #  ","#####","  #  ","  #  ","     ","     "],
',': ["     ","     ","     ","     "," ##  "," ##  ","  #  ","     "],
'-': ["     ","     ","     ","#####","     ","     ","     ","     "],
'.': ["     ","     ","     ","     ","     "," ##  "," ##  ","     "],
'/': ["     ","    #","   # ","  #  "," #   ","#    ","     ","     "],
'0': [" ### ","#   #","#  ##","# # #","##  #","#   #"," ### ","     "],
'1': ["  #  "," ##  ","  #  ","  #  ","  #  ","  #  "," ### ","     "],
'2': [" ### ","#   #","    #","   # ","  #  "," #   ","#####","     "],
'3': ["#####","   # ","  #  ","   # ","    #","#   #"," ### ","     "],
'4': ["   # ","  ## "," # # ","#  # ","#####","   # ","   # ","     "],
'5': ["#####","#    ","#### ","    #","    #","#   #"," ### ","     "],
'6': ["  ## "," #   ","#    ","#### ","#   #","#   #"," ### ","     "],
'7': ["#####","    #","   # ","  #  "," #   "," #   "," #   ","     "],
'8': [" ### ","#   #","#   #"," ### ","#   #","#   #"," ### ","     "],
'9': [" ### ","#   #","#   #"," ####","    #","   # "," ##  ","     "],
':': ["     "," ##  "," ##  ","     "," ##  "," ##  ","     ","     "],
';': ["     "," ##  "," ##  ","     "," ##  "," ##  ","  #  ","     "],
'<': ["   # ","  #  "," #   ","#    "," #   ","  #  ","   # ","     "],
'=': ["     ","     ","#####","     ","#####","     ","     ","     "],
'>': [" #   ","  #  ","   # ","    #","   # ","  #  "," #   ","     "],
'?': [" ### ","#   #","    #","   # ","  #  ","     ","  #  ","     "],
'@': [" ### ","#   #","    #","# ## ","# # #","# # #"," ### ","     "],
'A': [" ### ","#   #","#   #","#####","#   #","#   #","#   #","     "],
'B': ["#### ","#   #","#   #","#### ","#   #","#   #","#### ","     "],
'C': [" ### ","#   #","#    ","#    ","#    ","#   #"," ### ","     "],
'D': ["###  ","#  # ","#   #","#   #","#   #","#  # ","###  ","     "],
'E': ["#####","#    ","#    ","#### ","#    ","#    ","#####","     "],
'F': ["#####","#    ","#    ","#### ","#    ","#    ","#    ","     "],
'G': [" ### ","#   #","#    ","# ###","#   #","#   #"," ####","     "],
'H': ["#   #","#   #","#   #","#####","#   #","#   #","#   #","     "],
'I': [" ### ","  #  ","  #  ","  #  ","  #  ","  #  "," ### ","     "],
'J': ["    #","    #","    #","    #","#   #","#   #"," ### ","     "],
'K': ["#   #","#  # ","# #  ","##   ","# #  ","#  # ","#   #","     "],
'L': ["#    ","#    ","#    ","#    ","#    ","#    ","#####","     "],
'M': ["#   #","## ##","# # #","# # #","#   #","#   #","#   #","     "],
'N': ["#   #","#   #","##  #","# # #","#  ##","#   #","#   #","     "],
'O': [" ### ","#   #","#   #","#   #","#   #","#   #"," ### ","     "],
'P': ["#### ","#   #","#   #","#### ","#    ","#    ","#    ","     "],
'Q': [" ### ","#   #","#   #","#   #","# # #","#  # "," ## #","     "],
'R': ["#### ","#   #","#   #","#### ","# #  ","#  # ","#   #","     "],
'S': [" ####","#    ","#    "," ### ","    #","    #","#### ","     "],
'T': ["#####","  #  ","  #  ","  #  ","  #  ","  #  ","  #  ","     "],
'U': ["#   #","#   #","#   #","#   #","#   #","#   #"," ### ","     "],
'V': ["#   #","#   #","#   #","#   #","#   #"," # # ","  #  ","     "],
'W': ["#   #","#   #","#   #","# # #","# # #","## ##","#   #","     "],
'X': ["#   #","#   #"," # # ","  #  "," # # ","#   #","#   #","     "],
'Y': ["#   #","#   #"," # # ","  #  ","  #  ","  #  ","  #  ","     "],
'Z': ["#####","    #","   # ","  #  "," #   ","#    ","#####","     "],
'[': [" ### "," #   "," #   "," #   "," #   "," #   "," ### ","     "],
'\\':["     ","#    "," #   ","  #  ","   # ","    #","     ","     "],
']': [" ### ","   # ","   # ","   # ","   # ","   # "," ### ","     "],
'^': ["  #  "," # # ","#   #","     ","     ","     ","     ","     "],
'_': ["     ","     ","     ","     ","     ","     ","#####","     "],
'`': [" #   ","  #  ","   # ","     ","     ","     ","     ","     "],
'a': ["     ","     "," ### ","    #"," ####","#   #"," ####","     "],
'b': ["#    ","#    ","#### ","#   #","#   #","#   #","#### ","     "],
'c': ["     ","     "," ### ","#    ","#    ","#   #"," ### ","     "],
'd': ["    #","    #"," ####","#   #","#   #","#   #"," ####","     "],
'e': ["     ","     "," ### ","#   #","#####","#    "," ### ","     "],
'f': ["  ## "," #  #"," #   ","#### "," #   "," #   "," #   ","     "],
'g': ["     ","     "," ####","#   #","#   #"," ####","    #"," ### "],
'h': ["#    ","#    ","#### ","#   #","#   #","#   #","#   #","     "],
'i': ["  #  ","     "," ##  ","  #  ","  #  ","  #  "," ### ","     "],
'j': ["   # ","     ","   # ","   # ","   # ","#  # "," ##  ","     "],
'k': ["#    ","#    ","#  # ","# #  ","##   ","# #  ","#  # ","     "],
'l': [" ##  ","  #  ","  #  ","  #  ","  #  ","  #  "," ### ","     "],
'm': ["     ","     ","## # ","# # #","# # #","#   #","#   #","     "],
'n': ["     ","     ","#### ","#   #","#   #","#   #","#   #","     "],
'o': ["     ","     "," ### ","#   #","#   #","#   #"," ### ","     "],
'p': ["     ","     ","#### ","#   #","#   #","#### ","#    ","#    "],
'q': ["     ","     "," ####","#   #","#   #"," ####","    #","    #"],
'r': ["     ","     ","# ## ","##  #","#    ","#    ","#    ","     "],
's': ["     ","     "," ####","#    "," ### ","    #","#### ","     "],
't': [" #   "," #   ","#### "," #   "," #   "," #  #","  ## ","     "],
'u': ["     ","     ","#   #","#   #","#   #","#  ##"," ## #","     "],
'v': ["     ","     ","#   #","#   #","#   #"," # # ","  #  ","     "],
'w': ["     ","     ","#   #","#   #","# # #","# # #"," # # ","     "],
'x': ["     ","     ","#   #"," # # ","  #  "," # # ","#   #","     "],
'y': ["     ","     ","#   #","#   #","#   #"," ####","    #"," ### "],
'z': ["     ","     ","#####","   # ","  #  "," #   ","#####","     "],
'{': ["   # ","  #  ","  #  "," #   ","  #  ","  #  ","   # ","     "],
'|': ["  #  ","  #  ","  #  ","  #  ","  #  ","  #  ","  #  ","     "],
'}': [" #   ","  #  ","  #  ","   # ","  #  ","  #  "," #   ","     "],
'~': ["     ","     "," #  #","# # #","#  # ","     ","     ","     "],

# *** THE GLYPHS A CHARACTER-CELL ROM ACTUALLY CARRIES, AND WHY THESE AND NOT A GUESS. ***
# The phone's signal strength is drawn with U+25AE and nothing else on this surface was
# outside ASCII when it was measured -- but "nothing else TODAY" is not a spec, so the gate
# beside this file asks the real question instead: every character the glass draws must be
# covered by the face the glass is set in. Without that, one block character silently falls
# back to the outline face and the bar is quietly two typefaces wide. These are the bars,
# blocks and arrows a cell display has in ROM because they are what a cell can draw.
'\u00b7': ["     ","     ","     "," ##  "," ##  ","     ","     ","     "],   # middot
'\u00b0': [" ##  ","#  # ","#  # "," ##  ","     ","     ","     ","     "],   # degree
'\u25ae': ["     "," ### "," ### "," ### "," ### "," ### ","     ","     "],   # bar
'\u25a0': ["     ","#####","#####","#####","#####","#####","     ","     "],   # square
'\u2588': ["#####","#####","#####","#####","#####","#####","#####","#####"],   # full block
'\u2593': ["#####","## ##","#####","## ##","#####","## ##","#####","## ##"],   # dark shade
'\u2592': ["# # #"," # # ","# # #"," # # ","# # #"," # # ","# # #"," # # "],   # medium shade
'\u2591': ["#   #","     ","  #  ","     ","#   #","     ","  #  ","     "],   # light shade
'\u2192': ["     ","  #  ","   # ","#####","   # ","  #  ","     ","     "],   # right
'\u2190': ["     ","  #  "," #   ","#####"," #   ","  #  ","     ","     "],   # left
'\u2191': ["  #  "," ### ","# # #","  #  ","  #  ","  #  ","  #  ","     "],   # up
'\u2193': ["  #  ","  #  ","  #  ","  #  ","# # #"," ### ","  #  ","     "],   # down
}

# THE CELL, IN FONT UNITS. 5 columns of dots plus one column of gutter is the
# advance, because on a character-cell display the gutter belongs to the cell.
PITCH = 125          # one dot cell, centre to centre
DOT   = 100          # the lit square: smaller than its cell, so the gaps SHOW
ADV   = 6 * PITCH    # 5 dots + 1 gutter column
BASE  = 1 * PITCH    # row 7 hangs below the baseline
ASC   = 7 * PITCH    # the top of row 0's cell, above the baseline
# *** THE EM BOX IS SIZED SO THIS FACE COSTS NO WIDTH, AND THAT WAS MEASURED, NOT GUESSED. ***
# The first cut used a 1000 unit em, which made the advance 0.75em against the 0.6em of the
# face it replaces. On the phone's own bar that is 24.5% wider -- 96px against 77px for the
# same sixteen characters -- so about five characters fell off the end of the feed's name and
# the clock started walking toward the edge. A new face that silently eats the text is not an
# improvement, it is a regression wearing a better coat, and it took a screenshot of the real
# phone to see it. NOTHING ABOUT THE DRAWING CHANGED. Only the em box: at 1250 the advance is
# 750/1250 = 0.6em and the cap height is 875/1250 = 0.7em, which is what was there before.
UPM   = 1250

def rows_of(ch):
    r = G[ch]
    r = [ (x + '     ')[:5] for x in r ]
    return (r + ['     '] * 8)[:8]

def build():
    from fontTools.fontBuilder import FontBuilder
    from fontTools.pens.ttGlyphPen import TTGlyphPen

    chars = sorted(G.keys())
    names = {c: ('space' if c == ' ' else 'uni%04X' % ord(c)) for c in chars}
    order = ['.notdef'] + [names[c] for c in chars]

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap({ord(c): names[c] for c in chars})

    glyphs, metrics = {}, {}
    pen = TTGlyphPen(None); glyphs['.notdef'] = pen.glyph(); metrics['.notdef'] = (ADV, 0)
    inset = (PITCH - DOT) // 2
    for c in chars:
        pen = TTGlyphPen(None)
        for ri, row in enumerate(rows_of(c)):
            for ci, cell in enumerate(row):
                if cell != '#':
                    continue
                x0 = ci * PITCH + inset
                y0 = (7 - ri) * PITCH + inset - BASE
                x1, y1 = x0 + DOT, y0 + DOT
                pen.moveTo((x0, y0)); pen.lineTo((x1, y0))
                pen.lineTo((x1, y1)); pen.lineTo((x0, y1)); pen.closePath()
        glyphs[names[c]] = pen.glyph()
        metrics[names[c]] = (ADV, 0)

    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=ASC, descent=-BASE)
    fb.setupNameTable({
        'familyName': 'BohemiaROM', 'styleName': 'Regular',
        'psName': 'BohemiaROM-Regular', 'version': 'Version 1.000',
        'copyright': 'BOHEMIA. Drawn for this game on a 5x8 character cell. '
                     'Not derived from any existing typeface or ROM dump.',
    })
    fb.setupOS2(sTypoAscender=ASC, sTypoDescender=-BASE,
                usWinAscent=ASC, usWinDescent=BASE,
                achVendID='BOHE')
    fb.setupPost(isFixedPitch=1)
    return fb

def main():
    fb = build()
    out = os.path.join(ROOT, 'slices', 'fonts')
    os.makedirs(out, exist_ok=True)
    ttf = os.path.join(out, 'BohemiaROM-Regular.ttf')
    fb.save(ttf)

    from fontTools.ttLib import TTFont
    f = TTFont(ttf); f.flavor = 'woff2'
    w2 = os.path.join(out, 'BohemiaROM-Regular.woff2')
    f.save(w2)
    b = open(w2, 'rb').read()
    print('  glyphs        %d' % len(G))
    print('  ttf           %d bytes' % os.path.getsize(ttf))
    print('  woff2         %d bytes  (%d as base64)' % (len(b), len(base64.b64encode(b))))
    print('  cell          5x8 dots, %d/%d unit dot in a %d unit advance' % (DOT, PITCH, ADV))
    print('  em box        %d upm -> advance %.2fem, cap height %.2fem' % (UPM, ADV/UPM, ASC/UPM))
    print('  fixed pitch   yes, and that is the point: this face is only legal')
    print('                where the in-world device is a character-cell screen.')

    if '--embed' in sys.argv:
        embed(base64.b64encode(b).decode('ascii'))

FACE_RE = re.compile(
    r"@font-face\{ font-family:'BohemiaROM';[\s\S]*?\}\n", re.M)

def embed(b64):
    """Write the face into the surfaces that draw his screen, replacing any
    earlier cut rather than stacking a second one."""
    block = ("@font-face{ font-family:'BohemiaROM'; font-style:normal; font-weight:400;\n"
             "  font-display:block;\n"
             "  src:url(data:font/woff2;base64," + b64 + ") format('woff2') }\n")
    for rel in ('slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_ALPHA_0_9.html'):
        p = os.path.join(ROOT, rel)
        s = io.open(p, encoding='utf-8').read()
        if FACE_RE.search(s):
            s = FACE_RE.sub(block, s, count=1)
            how = 'replaced'
        else:
            anchor = "@font-face{ font-family:'BohemiaMono';"
            i = s.index(anchor)
            s = s[:i] + block + s[i:]
            how = 'inserted'
        io.open(p, 'w', encoding='utf-8').write(s)
        print('  %-9s %s' % (how, rel))

if __name__ == '__main__':
    main()
