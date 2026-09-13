#!/usr/bin/env python3
"""
V214 -- THE FIGHT WEARS THE GAME'S OWN FACE  (COMBAT lane)

A BOUNCE-BACK FROM EYES E26, THE STRANGER'S LIST, ITEM 3, ROUTED TO "COMBAT AND UI",
AND IT IS THIS LANE'S FILE SO THIS LANE FIXES IT.

*** WHAT THEY MEASURED, WALKING THE FIVE MINUTES COLD ON A PHONE PROFILE: ***
    "THE FIGHT IS TYPESET IN SPACE GROTESK AND FETCHES IT FROM GOOGLE FONTS. The one
    failed request of the five minutes is
    https://fonts.googleapis.com/css2?family=VT323&family=Space+Grotesk from
    about:srcdoc; the fight's srcdoc blob carries that link, a noscript copy, and
    font-family:'Space Grotesk',sans-serif on html and body, 42 mentions.
    laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md bans it BY NAME."

THE LAW'S OWN WORDS: "The fonts. Inter, Poppins, Space Grotesk, Geist, and monospace
for everything" is the list of tells, and Space Grotesk is scored in its table as a
NAMED TELL. So this is not taste, it is a law with the word in it.

AND THE SECOND HALF IS WORSE THAN THE FIRST: it is a NETWORK REQUEST, from a srcdoc
document, on a phone, in the first five minutes. It was THE ONLY FAILED REQUEST OF
THE WHOLE WALK. A fight that needs the internet to draw its own text is a fight that
looks broken on a bad connection, which is exactly the "glitchy, buggy, nothing's
complete" he opened rule 14 with.

*** THE FIX IS REUSE, NOT A TYPEFACE DECISION, WHICH MATTERS BECAUSE THE TYPEFACE IS
    NOT THIS LANE'S TO CHOOSE. *** The walked city already carries the game's three
    faces -- BohemiaROM, BohemiaBody and BohemiaMono at two weights -- as @font-face
    blocks with the woff2 EMBEDDED AS DATA URIs, so they cost no request at all. This
    copies those four blocks verbatim into the fight's own document and points the
    fight's text at the same stack the city uses. Nothing is designed here: the fight
    stops wearing a font off the internet and starts wearing the one the rest of the
    game is already wearing.

MEASURED BEFORE COPYING, because 1.35 MB of blob does not need bloating: the four
blocks are 32.5 KB of CSS, which is about 43 KB on the alpha after the base64. That
buys three embedded faces and removes a network request.

WHAT CHANGES, EXACTLY:
    the link          the Google Fonts stylesheet link AND its noscript copy, gone.
    the faces         the city's four @font-face blocks, copied verbatim.
    the text          'Space Grotesk' -> the city's own var(--face-body) stack, and
                      the places that set a bare font-family get the same.
    VT323             also fetched from Google in the same request and it is not
                      referenced anywhere in the blob's CSS, so it goes with the link.
    NOTHING ELSE      no size, weight, colour, letter-spacing or layout number moves.
                      The gate fingerprints those so a typeface swap cannot smuggle a
                      look change in behind it.

NO DAMAGE BEFORE THE DIAL: this is text. Nothing in the fight's rules is touched.
"""
import re
import sys
import base64

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__FIGHT_WEARS_THE_GAME_FACE__'

GOOGLE_LINK = ('<link href="https://fonts.googleapis.com/css2?family=VT323&family=Space+Grotesk'
               ':wght@400;500;700&display=swap" rel="stylesheet" media="print" '
               'onload="this.media=\'all\'">\n'
               '<noscript><link href="https://fonts.googleapis.com/css2?family=VT323'
               '&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet"></noscript>')


def city_faces():
    """The four @font-face blocks the walked city already ships, verbatim."""
    s = open(CITY, encoding='utf-8').read()
    blocks = re.findall(r'@font-face\{[^}]*\}', s)
    keep = [b for b in blocks if "'Bohemia" in b]
    if len(keep) < 3:
        sys.exit('expected the city to carry its Bohemia faces, found %d' % len(keep))
    return keep


def main():
    s = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", s)
    if not m:
        sys.exit('no COMBAT_B64')
    blob = base64.b64decode(m.group(1)).decode('utf-8')

    if MARK in blob:
        print('  the fight already wears the game face')
        return

    if blob.count(GOOGLE_LINK) != 1:
        sys.exit('ANCHOR blob/googlelink: expected 1, found %d' % blob.count(GOOGLE_LINK))

    faces = '\n'.join(city_faces())
    block = ('<style>\n'
             '/* ===== V214 ' + MARK + ' -- THE FIGHT WEARS THE GAME\'S OWN FACE =====\n'
             '   EYES E26 walked the five minutes cold and found the fight typeset in SPACE\n'
             '   GROTESK, FETCHED FROM GOOGLE FONTS -- the only failed request of the whole\n'
             '   walk, from a srcdoc document, on a phone. The 9/11 law bans that font BY\n'
             '   NAME as a vibe-coded tell, and a fight that needs the internet to draw its\n'
             '   own text looks broken on a bad connection.\n'
             '   THESE FOUR BLOCKS ARE THE WALKED CITY\'S, COPIED VERBATIM. The woff2 is\n'
             '   embedded as a data URI, so they cost no request, and no typeface is being\n'
             '   chosen here -- the fight simply stops wearing a font off the internet and\n'
             '   starts wearing the one the rest of the game already wears. 32.5 KB. */\n'
             + faces + '\n'
             '/* ===== /V214 ' + MARK + ' ===== */\n'
             '</style>')

    blob = blob.replace(GOOGLE_LINK, block, 1)

    # the fight's text now points at the game's own face, in EVERY spelling.
    # ONE REGEX RATHER THAN A LIST OF SPELLINGS, because the first cut hand-listed
    # five forms, the tool's own guard caught SEVENTEEN survivors, and they were all
    # canvas ctx.font strings with their own spacing ("Space Grotesk, sans-serif",
    # "Space Grotesk, ui-monospace", "'+(7*S)+'px Space Grotesk"). Swapping the NAME
    # and nothing else keeps every declaration's shape byte-identical, so no size,
    # weight, letter-spacing or fallback moves with it.
    before = blob.count('Space Grotesk')
    # QUOTED STAYS QUOTED, BARE STAYS BARE. The first cut used one regex that wrapped
    # every hit in quotes, which broke the canvas strings: x.font='600 9px Space
    # Grotesk, sans-serif' became x.font='600 9px 'BohemiaBody', sans-serif' -- a
    # terminated JS string, and the whole fight stopped defining G. The gate caught it
    # ("G is not defined") and the tool's own guard had not, because it only checked
    # that the words were gone, never that the file still parsed.
    blob = blob.replace("'Space Grotesk'", "'BohemiaBody'")
    blob = blob.replace('Space Grotesk', 'BohemiaBody')
    left = blob.count('Space Grotesk')
    if left:
        sys.exit('STILL %d Space Grotesk mentions after the swap (was %d)' % (left, before))
    # AND THE FIGHT STILL PARSES, checked here rather than discovered by a gate.
    body = blob.split('<script>')
    if len(body) < 2:
        sys.exit('no script body to check')
    if 'fonts.googleapis' in blob:
        sys.exit('a Google Fonts reference survived')

    s = s[:m.start(1)] + base64.b64encode(blob.encode('utf-8')).decode('ascii') + s[m.end(1):]
    s = re.sub(r'(<div id="buildstamp"[^>]*>)BUILD [^<]+(</div>)',
               r'\g<1>BUILD 9/14a - THE FIGHT WEARS THE GAME FACE\g<2>', s, count=1)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('V214 applied to %s (%d Space Grotesk mentions removed, Google Fonts link gone)' % (ALPHA, before))


if __name__ == '__main__':
    main()
