#!/usr/bin/env python3
"""
BOHEMIA CITY TOOLBAR TIDY PATCH (7/25/26, LIFE+CITY session) - stop the top
chips overlapping.

Paolo (7/25, with a screenshot): "A lot of the UI in the city tab is from very
early on ... there's a bunch of buttons on the top that are stacked on top of
each other. It's very annoying."

ROOT CAUSE: the five top buttons (MUSIC, SAVE, REROLL, UNDER, KEY) were each
absolute-positioned with HARDCODED pixel offsets (musbtn left:12, savebtn
left:110, reroll right:158, underbtn right:74, keybtn right:12). On a phone-
width stage the left group (MUSIC+SAVE) and the right group (REROLL...) collide
in the middle - exactly the stacked mess in the shot.

FIX (chrome only, no game logic touched): wrap the five chips in ONE #topbar
flex row and neutralize their absolute positioning, so they lay out with a gap
and can NEVER overlap - if they cannot all fit one line they wrap to a second,
they never stack. WHOLE MAP (bottom-left), BIKE, and the DROP IN pad are left
exactly where they are. Each chip keeps its own face/border/label styling.

REUSE CHECK: no graphic pixels cooked - this is a CSS/DOM reflow of existing
buttons, so no banks/ lookup applies (the reuse-first law is about cooking NEW
art; nothing is drawn here).

Idempotent (marker TOOLBAR TIDY). Patches CITY_B64 in the alpha in place, the
same decode -> string-replace -> re-encode pattern as the other city patches.

  python3 tools/bohemia_city_toolbar_patch.py
"""
import base64
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'TOOLBAR TIDY' in decoded:
    print('toolbar already tidy. no-op.')
    sys.exit(0)

# --- 1) DOM: wrap the five scattered top chips into one #topbar row ----------
i0 = decoded.index('<div id="reroll">')
i1 = decoded.index('</div>', decoded.index('<div id="savebtn">')) + len('</div>')
old_block = decoded[i0:i1]

# pull each chip out by id so we can order the row sensibly, whatever the emoji
chips = {m.group(1): m.group(0)
         for m in re.finditer(r'<div id="(reroll|underbtn|keybtn|musbtn|savebtn)">.*?</div>', old_block)}
assert len(chips) == 5, 'expected 5 top chips, got %d' % len(chips)
ORDER = ['musbtn', 'savebtn', 'reroll', 'underbtn', 'keybtn']   # utility left, world controls right
new_block = ('<div id="topbar"><!-- TOOLBAR TIDY: one flex row, never overlaps -->\n    '
             + '\n    '.join(chips[k] for k in ORDER)
             + '\n  </div>')
decoded = decoded.replace(old_block, new_block, 1)

# --- 2) CSS: a flex row that overrides the old absolute offsets --------------
CSS = """
/* ==== TOOLBAR TIDY (7/25): the five top chips overlapped on a phone - each
   was absolute-positioned with a hardcoded left/right offset, so MUSIC+SAVE
   collided with REROLL in the middle. Reflow them into ONE flex row that lays
   out with a gap and wraps instead of stacking. Positioning override only -
   each chip keeps its own face/border/label. ==== */
#topbar{position:absolute;left:8px;right:8px;top:8px;display:flex;flex-wrap:wrap;
  align-items:center;gap:6px;z-index:7;pointer-events:none}
#topbar>*{position:static !important;top:auto !important;right:auto !important;
  bottom:auto !important;left:auto !important;margin:0 !important;pointer-events:auto}
#topbar>div{white-space:nowrap}
/* the "move on the streets" hint was pinned to the SAME top-left corner as the
   toolbar, so its words ("streets", "moves") bled through the gaps between the
   chips - exactly the stray "stre"/"n" fragments in Paolo's shot. Drop it to a
   centered hint low on the stage, clear of the toolbar AND the pad. */
#note{left:12px !important;right:auto !important;top:auto !important;bottom:58px !important;
  transform:none !important;max-width:48%;text-align:left;z-index:5}
"""
CLOSE = '</style></head>'
assert CLOSE in decoded
decoded = decoded.replace(CLOSE, CSS + CLOSE, 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('toolbar tidied: 5 top chips reflowed into one non-overlapping flex row')
