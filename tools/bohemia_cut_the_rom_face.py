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
# THE THIRD GLYPH FOUND BY ASKING THE RENDERER WHAT A SURFACE ACTUALLY DRAWS, after the
# phone's signal bar and every card's close mark. The left rail's STANDING chip is written
# "\u25c6 STANDING" and the diamond was in none of our faces, so one mark on the first
# control of the game fell through to whatever the browser had.
'\u25c6': ["     ","  #  "," ### ","#####"," ### ","  #  ","     ","     "],   # diamond

# *** THE TYPOGRAPHER'S PUNCTUATION, AND IT IS NOT HERE BECAUSE SOMEBODY LIKES DASHES. ***
# The same coverage question, asked of the BODY register instead of the machine, and the
# answer was worse: the game's own written strings carry U+2014 (one of them is a district
# summary, "Walled tract-home neighborhood - cul-de-sac streets off the entrance") and NO
# FACE OF OURS HAD IT. Every one of those would print in whatever the browser fell back to,
# a second typeface sitting inside a sentence. Cheap to close, permanent once closed.
'\u2014': ["     ","     ","     ","#####","     ","     ","     ","     "],   # em dash, 5 wide
'\u2013': ["     ","     ","     "," ### ","     ","     ","     ","     "],   # en dash, 3 wide
'\u2026': ["     ","     ","     ","     ","     ","# # #","     ","     "],   # ellipsis
# THE CURLY QUOTES REUSE THE STRAIGHT DRAWINGS, and that is a decision rather than a
# shortcut: at five dots wide there is no honest way to draw the difference between ' and
# a right single quote, and a quote of slightly the wrong shape is strictly better than a
# quote in a different typeface. Named here so nobody later reads it as an oversight.
'\u2018': ["  #  ","  #  "," #   ","     ","     ","     ","     ","     "],   # left single
'\u2019': ["  #  ","  #  ","   # ","     ","     ","     ","     ","     "],   # right single
'\u201c': [" # # "," # # ","#   #","     ","     ","     ","     ","     "],   # left double
'\u201d': [" # # "," # # ","    #","     ","     ","     ","     ","     "],   # right double
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

# ============================================================================
# THE CASING FACE (9/15, round eight) -- THE LAST REGISTER STILL ON A GRID.
#
# DIRECTION's ruling: fixed pitch is legal ONLY where the in-world device is a
# character-cell screen. The screen register got a real face on 9/13 and the body
# register got one the same round. CASING -- the words stamped or painted on the
# machine itself, which is every label, chip, button and readout on the HUD -- has
# been resolving to 'BohemiaMono' this whole time, so it is the reason the walked
# city still counts 42 monospace hits. A plate on a machine is not a screen.
#
# WHAT A CASING LABEL IS, IN THIS WORLD. Act one is 2050 gone rustic: our own era's
# tech worn down and kept alive. The words on that kind of object are STAMPED or
# PAINTED THROUGH A STENCIL, in caps, narrow enough to fit a small plate, with a
# heavy even stroke because paint spreads and a stamp bottoms out. So: CONDENSED
# CAPS, HEAVY, SOLID.
#
# AND IT IS THE SAME TABLE AGAIN, WHICH IS THE POINT OF HAVING ONE. REUSE-FIRST:
# no third alphabet. Three things are done to the cut that already exists, and each
# one is a real, visible property rather than a caption:
#   CONDENSED   the x pitch is 100 against the y pitch of 125, so a cap is 0.57 of
#               its own height instead of 0.7. That is the narrowness.
#   HEAVY       the ink square stays 125 while the column is 100, so neighbouring
#               cells OVERLAP horizontally and a stem comes out 1.25 columns wide.
#               Condensed and bold at once, the way a stamp bottoms out.
#   CAPS ONLY   lowercase maps to the cap drawing, because a stencil kit is caps and
#               numbers and nothing else. It is not a missing glyph, it is the kit.
#
# *** WHY NOT STENCIL BRIDGES, WHICH IS THE FIRST THING THE WORD STENCIL ASKS FOR. ***
# They were drawn, built and rendered at 10, 11 and 12px, which is where this register
# actually lives, and then LOOKED AT. THE ANSWER IS NOT TASTE, IT IS THE DIGITS:
#
#     8 plain      8 bridged          and a 3 in this same table
#      ###          ###                ###
#     #   #        #   #              #   #
#     #   #            #                  #
#      ###          ###                 ###      <- the bridged 8 IS the 3, cell
#     #   #        #   #              #   #         for cell. Not similar. The same.
#     #   #            #                  #
#      ###          ###                 ###
#
# 6 loses its left stem and reads as an 8; 9 loses the same cell and reads as a 3;
# BUILD came out as 3UILD. On the strip "0948 DAY 1 4 BATTERIES" read as
# "0943 DAY 1 4 BATTERIES". Batteries are the money in this game.
#
# AND THE REASON IS GEOMETRY, NOT A BAD CHOICE OF BRIDGE POSITION, which is why this
# is written down instead of retried: on a 5x7 cap grid EVERY STROKE IS EXACTLY ONE
# CELL THICK. A stencil bridge is a gap in a stroke that is thick enough to survive
# losing a piece. Here there is nothing to spare, so any bridge deletes skeleton and
# the letter becomes a different letter. Bridges need a finer grid than this table has.
# The data stays so the decision can be re-run (--bridges) and so the next person does
# not spend the round finding this out again. THE DEFAULT IS OFF.
# ==========================================================================

CAS_PITCH_X = 100          # the condensed column
CAS_PITCH_Y = PITCH        # the row, unchanged: 125
CAS_INK     = PITCH        # the ink square. Wider than its column on purpose.
# *** THE WORD SPACE IS ITS OWN NUMBER, AND THE FIRST MEASUREMENT OF IT WAS WORTHLESS. ***
# The body face gets away with a 3-column space because its letters are drawn with gaps
# inside them. These letters are HEAVY: their cells overlap, so a word closes up and the
# eye has nothing to break on. That is the argument; here is what it cost to prove.
#
# THE FIRST RUN MEASURED THE FALLBACK FONT AND CALLED IT THIS FACE. A @font-face that
# nothing on the page has used yet is never fetched, so document.fonts.ready resolved
# instantly, check() said false, and every number came back from whatever the browser
# had. The tell was that the numbers did not move when the font changed -- the same
# tell this lane has now been caught by four times. The probe loads the face by name
# first, keeps a string set in a family that does not exist as a control, and REFUSES
# TO REPORT if either face failed to load.
#
# MEASURED ON THE FACE, at 10px, which is the size most of this register is used at:
#   3-column space   word space 2.39 px   "DAY 1 4" 29.81   "DAY 14" 27.41
#   5-column space   word space 4.39 px   "DAY 1 4" 33.81   "DAY 14" 29.41
# A cap advance is 5.41 px and a letter's own gap inside a word is 1.2 px. At three
# columns the word space is twice the letter gap; at five it is nearly four times.
# On the HUD the clock line is "0948  DAY 1  4 BATTERIES" and batteries ARE the money,
# so two numbers running together is a misread and not a style note. 5 columns.
CAS_SPACE   = 5 * CAS_PITCH_X

# The counters a stencil has to free, and where the bridge goes. Row, column, per
# glyph, on the 5x7 cap grid. Kept as DATA rather than as a clever rule, because a
# rule that guesses where a counter is will silently put a hole in the wrong place.
CAS_BRIDGE = {
 'A': [(3, 1), (3, 3)], 'B': [(2, 0), (5, 0)], 'D': [(3, 0)],
 'O': [(3, 0), (3, 4)],  'P': [(2, 0)],        'Q': [(3, 0), (3, 4)],
 'R': [(2, 0)],          '0': [(3, 0), (3, 4)],'4': [(4, 0)],
 '6': [(5, 0)],          '8': [(2, 0), (5, 0)],'9': [(2, 0)],
}

def casing_rows(ch, bridges=False):
    """Caps, digits and marks from the one table. Lowercase IS the cap: a stencil
    kit has one alphabet."""
    src = ch.upper() if ch.isalpha() else ch
    if src not in G:
        src = ch
    rows = [r for r in rows_of(src)]
    if bridges and src in CAS_BRIDGE:
        for r, c in CAS_BRIDGE[src]:
            if r < len(rows) and c < len(rows[r]) and rows[r][c] == '#':
                rows[r] = rows[r][:c] + ' ' + rows[r][c + 1:]
    return trim(rows)

def build_casing(bridges=False):
    from fontTools.fontBuilder import FontBuilder
    from fontTools.pens.ttGlyphPen import TTGlyphPen

    chars = sorted(G.keys())
    names = {c: ('space' if c == ' ' else 'uni%04X' % ord(c)) for c in chars}
    order = ['.notdef'] + [names[c] for c in chars]

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap({ord(c): names[c] for c in chars})

    glyphs, metrics = {}, {}
    pen = TTGlyphPen(None); glyphs['.notdef'] = pen.glyph(); metrics['.notdef'] = (4 * CAS_PITCH_X, 0)
    widths = {}
    for c in chars:
        rows = casing_rows(c, bridges)
        cols = max((len(r) for r in rows), default=0)
        pen = TTGlyphPen(None)
        for ri, row in enumerate(rows):
            for ci, cellch in enumerate(row):
                if cellch != '#':
                    continue
                x0 = ci * CAS_PITCH_X
                y0 = (7 - ri) * CAS_PITCH_Y - BASE
                x1, y1 = x0 + CAS_INK, y0 + CAS_PITCH_Y
                pen.moveTo((x0, y0)); pen.lineTo((x1, y0))
                pen.lineTo((x1, y1)); pen.lineTo((x0, y1)); pen.closePath()
        # the advance carries the ink's own overhang plus one column of side bearing,
        # or the last stem of every word would be clipped by the next letter's box
        adv = (cols * CAS_PITCH_X + (CAS_INK - CAS_PITCH_X) + CAS_PITCH_X) if cols \
              else CAS_SPACE
        glyphs[names[c]] = pen.glyph()
        metrics[names[c]] = (adv, 0)
        widths[c] = cols

    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=ASC, descent=-BASE)
    fb.setupNameTable({
        'familyName': 'BohemiaCasing', 'styleName': 'Regular',
        'psName': 'BohemiaCasing-Regular', 'version': 'Version 1.000',
        'copyright': 'BOHEMIA. The same cell cut, condensed and stamped for a '
                     'machine plate. Not derived from any existing typeface.',
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

    bridges = '--bridges' in sys.argv
    fbc, cwidths = build_casing(bridges)
    b64cas = emit(fbc, 'BohemiaCasing-Regular', 'CASING')
    cspread = dict(sorted(Counter(cwidths.values()).items()))
    print('  casing widths dot columns -> glyphs: %s' % cspread)
    print('  casing cell   %d wide column, %d ink, %d row -> stem %.2f columns, cap %.2fem'
          % (CAS_PITCH_X, CAS_INK, CAS_PITCH_Y, CAS_INK / CAS_PITCH_X, ASC / UPM))
    print('  casing bridges %s' % ('ON (%d glyphs)' % len(CAS_BRIDGE) if bridges else 'off'))
    print('                caps only: lowercase IS the cap, because a stencil kit is')
    print('                one alphabet. Condensed and heavy: the ink is wider than')
    print('                its own column, so neighbouring cells overlap.')

    if '--embed' in sys.argv:
        embed(base64.b64encode(b).decode('ascii'), 'BohemiaROM')
        embed(b64body, 'BohemiaBody')
        embed(b64cas, 'BohemiaCasing')

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
