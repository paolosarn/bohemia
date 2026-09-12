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
# the tail goes BELOW the baseline (row 7) or a comma reads as a full stop -- caught on a
# screenshot of the real day card, where "now, before I go" looked like two sentences
',': ["     ","     ","     ","     ","     "," ##  "," ##  ","  #  "],
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
';': ["     ","     "," ##  "," ##  ","     "," ##  "," ##  ","  #  "],
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
# *** THE CLOSE MARK, AND THE GATE FOUND IT ON ITS FIRST RUN. *** Every card in this game
# gets a corner close from cardShow and it is drawn with U+2715, not an ASCII x. Neither of
# our faces had it, so that one mark on every panel fell through to whatever the browser
# had -- a different typeface sitting on the corner of every card, and nobody would ever
# see it. This is the SECOND glyph found this way (the phone's signal bar was the first),
# which is the argument for asking the renderer what a surface actually draws instead of
# trusting a list somebody remembered.
'\u2715': ["     ","#   #"," # # ","  #  "," # # ","#   #","     ","     "],   # close
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


# ============================================================================
# THE BODY FACE, AND IT IS THE SAME CUT SET PROPORTIONALLY (9/13, round six).
#
# DIRECTION's ruling: fixed pitch is legal ONLY where the in-world device is a
# character-cell screen. Prose is not a screen. The day card and the talking card
# carry 30 of the walked city's 66 monospace hits between them, and they are the two
# surfaces in the game that are pure WRITING -- a person writing does not write on a
# grid, which is the whole tell.
#
# WHY THIS IS THE SAME TABLE AND NOT A SECOND ALPHABET. REUSE-FIRST is a law here with
# a gate behind it. The cell glyphs are already drawn on a 7-row cap and a 5-row
# x-height, which is exactly the shape a small proportional body wants; what makes them
# monospace is not the drawing, it is that every one is handed the same five columns. So
# the body face TRIMS each glyph to its own ink and gives it its own advance. An i gets
# the width of an i. That is the difference between type and a grid, and it is one pass
# over a table that already exists rather than ninety-five new drawings.
#
# AND THE PART THAT IS NOT AUTOMATIC. Trimming alone leaves a handful of letters wearing
# compromises they only made because they had five columns to fill, so those are redrawn
# here by hand and the list is short and named. Everything else is the cut as it stands.
#
# WHOSE CALL THIS IS, SAID OUT LOUD. DIRECTION's ruling names a POOL to cut the body from
# (Pixel Operator, m5x7, monogram, LanaPixel -- OFL/CC0, none of them in this repo). This
# is not one of them. Two OFL pixel faces DO happen to sit on this machine (Silkscreen,
# Pixelify Sans) and either could have been embedded, but pulling a face DIRECTION did not
# name into the game's look is their decision, not this lane's. Drawing ours asks nobody
# for permission, carries no licence to honour, and -- this is the point of building the
# registers first -- DIRECTION swaps it for any pool face by changing ONE token.
# ==========================================================================

# The letters whose monospace shape was a compromise with the five columns, redrawn at
# the width they actually want. Short and named on purpose: everything not here is the
# cell cut trimmed, unchanged.
BODY_OVERRIDE = {
'm': ["     ","     ","## ##","# # #","# # #","# # #","# # #","     "],  # 5 wide: three stems
'w': ["     ","     ","#   #","#   #","# # #","# # #"," # # ","     "],  # 5 wide
'i': ["#", " ", "#", "#", "#", "#", "#", " "],                            # 1 wide: a dot and a stem
'l': ["##", " #", " #", " #", " #", " #", " ##", "  "],                   # 2 wide
'j': ["  #","   ","  #","  #","  #","  #","  #"," ##"],                   # 3 wide, descends
'r': ["    ","    ","# ##","##  ","#   ","#   ","#   ","    "],           # 4 wide
't': [" #  "," #  ","####"," #  "," #  "," #  ","  ##","    "],           # 4 wide
'f': ["  ##"," #  "," #  ","####"," #  "," #  "," #  ","    "],           # 4 wide
'I': ["#","#","#","#","#","#","#",""],                                    # 1 wide, no serifs

# *** AND THE ROUND LOWERCASE HAD TO BE REDRAWN, OR THIS FACE WOULD BE A LIE. ***
# Trimming alone gave a, c, e, o, n, u and the rest FIVE columns each, because the cell
# cut fills five columns by construction -- it has no choice. A face where almost every
# letter is the same width is a grid with a few narrow letters in it, and calling that
# proportional would be exactly the kind of claim-with-nothing-behind-it this row keeps
# catching. Measured before the fix: 77 of the 107 glyphs were five columns wide. So the
# round lowercase is cut to four, which is the width it wants: caps at five, lowercase at
# four, i at one, l at three. That spread is the thing you can actually see.
'a': ["    ","    "," ## ","   #"," ###","#  #"," ###","    "],
'c': ["    ","    "," ###","#   ","#   ","#   "," ###","    "],
'e': ["    ","    "," ## ","#  #","####","#   "," ###","    "],
'o': ["    ","    "," ## ","#  #","#  #","#  #"," ## ","    "],
's': ["    ","    "," ###","#   "," ## ","   #","### ","    "],
'n': ["    ","    ","### ","#  #","#  #","#  #","#  #","    "],
'u': ["    ","    ","#  #","#  #","#  #","#  #"," ###","    "],
'v': ["    ","    ","#  #","#  #","#  #"," ## "," ## ","    "],
'x': ["    ","    ","#  #","#  #"," ## ","#  #","#  #","    "],
'z': ["    ","    ","####","   #"," ## ","#   ","####","    "],
'g': ["    ","    "," ###","#  #","#  #"," ###","   #","### "],
'p': ["    ","    ","### ","#  #","#  #","### ","#   ","#   "],
'q': ["    ","    "," ###","#  #","#  #"," ###","   #","   #"],
'y': ["    ","    ","#  #","#  #","#  #"," ###","   #","### "],
'b': ["#   ","#   ","### ","#  #","#  #","#  #","### ","    "],
'd': ["   #","   #"," ###","#  #","#  #","#  #"," ###","    "],
'h': ["#   ","#   ","### ","#  #","#  #","#  #","#  #","    "],
'k': ["#   ","#   ","#  #","# # ","##  ","# # ","#  #","    "],
}

def trim(rows):
    """Cut the blank columns off both sides. A glyph with no ink keeps no columns."""
    w = max(len(r) for r in rows)
    rows = [(r + ' ' * w)[:w] for r in rows]
    cols = [any(r[c] == '#' for r in rows) for c in range(w)]
    if not any(cols):
        return []
    a, b = cols.index(True), w - 1 - cols[::-1].index(True)
    return [r[a:b + 1] for r in rows]

SPACE_COLS = 2          # a word gap, in dot columns, plus the gutter every glyph gets

def body_rows(ch):
    if ch in BODY_OVERRIDE:
        return [r for r in BODY_OVERRIDE[ch]]
    return trim(rows_of(ch))

def build_body():
    from fontTools.fontBuilder import FontBuilder
    from fontTools.pens.ttGlyphPen import TTGlyphPen

    chars = sorted(G.keys())
    names = {c: ('space' if c == ' ' else 'uni%04X' % ord(c)) for c in chars}
    order = ['.notdef'] + [names[c] for c in chars]

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap({ord(c): names[c] for c in chars})

    glyphs, metrics = {}, {}
    pen = TTGlyphPen(None); glyphs['.notdef'] = pen.glyph(); metrics['.notdef'] = (4 * PITCH, 0)
    # *** THE BODY'S PIXELS TOUCH, AND THE SCREEN'S DO NOT, FOR A REASON THAT IS NOT TASTE.
    # The screen face leaves a gutter around every lit cell because a character-cell display
    # is made of LAMPS and you can see the dark between them. Body text is not lamps. It is
    # ink on a board, or paint through a stencil, and ink does not leave a gap between the
    # squares of one letter -- it runs together, which is why a printed letter reads as one
    # stroke. So the body cell is solid and its neighbours touch. Same drawing, same grid,
    # and the two faces end up looking properly unrelated because the two things they are
    # made of are unrelated. ***
    inset, solid = 0, PITCH   # 'cell' is the loop's name for a character; do not shadow it
    widths = {}
    for c in chars:
        rows = body_rows(c)
        cols = max((len(r) for r in rows), default=0)
        pen = TTGlyphPen(None)
        for ri, row in enumerate(rows):
            for ci, cell in enumerate(row):
                if cell != '#':
                    continue
                x0 = ci * PITCH + inset
                y0 = (7 - ri) * PITCH + inset - BASE
                x1, y1 = x0 + solid, y0 + solid
                pen.moveTo((x0, y0)); pen.lineTo((x1, y0))
                pen.lineTo((x1, y1)); pen.lineTo((x0, y1)); pen.closePath()
        adv = (cols + 1) * PITCH if cols else (SPACE_COLS + 1) * PITCH
        glyphs[names[c]] = pen.glyph()
        metrics[names[c]] = (adv, 0)
        widths[c] = cols

    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=ASC, descent=-BASE)
    fb.setupNameTable({
        'familyName': 'BohemiaBody', 'styleName': 'Regular',
        'psName': 'BohemiaBody-Regular', 'version': 'Version 1.000',
        'copyright': 'BOHEMIA. The same cell cut, set proportionally. '
                     'Not derived from any existing typeface.',
    })
    fb.setupOS2(sTypoAscender=ASC, sTypoDescender=-BASE,
                usWinAscent=ASC, usWinDescent=BASE, achVendID='BOHE')
    fb.setupPost(isFixedPitch=0)
    return fb, widths

def emit(fb, stem, label):
    out = os.path.join(ROOT, 'slices', 'fonts')
    os.makedirs(out, exist_ok=True)
    ttf = os.path.join(out, stem + '.ttf')
    fb.save(ttf)
    from fontTools.ttLib import TTFont
    f = TTFont(ttf); f.flavor = 'woff2'
    w2 = os.path.join(out, stem + '.woff2')
    f.save(w2)
    b = open(w2, 'rb').read()
    print('  %-13s %d glyphs, %d bytes woff2 (%d as base64)'
          % (label, len(G), len(b), len(base64.b64encode(b))))
    return base64.b64encode(b).decode('ascii')


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

    fbb, widths = build_body()
    from collections import Counter
    spread = dict(sorted(Counter(widths.values()).items()))
    b64body = emit(fbb, 'BohemiaBody-Regular', 'BODY')
    print('  body widths   dot columns -> glyphs: %s' % spread)
    print('                caps 5, lowercase 4, i 1, l 3 -- proportional, and that spread')
    print('                is the whole difference between type and a grid.')

    if '--embed' in sys.argv:
        embed(base64.b64encode(b).decode('ascii'), 'BohemiaROM')
        embed(b64body, 'BohemiaBody')

def face_re(fam):
    return re.compile(r"@font-face\{ font-family:'" + fam + r"';[\s\S]*?\}\n", re.M)

def embed(b64, fam='BohemiaROM'):
    """Write the face into the surfaces that draw his screen, replacing any
    earlier cut rather than stacking a second one."""
    block = ("@font-face{ font-family:'" + fam + "'; font-style:normal; font-weight:400;\n"
             "  font-display:block;\n"
             "  src:url(data:font/woff2;base64," + b64 + ") format('woff2') }\n")
    FACE_RE = face_re(fam)
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
        print('  %-9s %-12s %s' % (how, fam, rel))

if __name__ == '__main__':
    main()
