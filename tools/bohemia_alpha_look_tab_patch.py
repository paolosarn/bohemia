#!/usr/bin/env python3
"""
PUT THE PICTURES IN A TAB (8/8/26).

Paolo 8/8, LOCKED (laws/BOHEMIA_ADDENDUM_SHOW_ME_PICTURES_IN_A_TAB_8_8_26.md):
  "just give me pictures and put it in a tab"

Adds the LOOK tab to the alpha and points it at slices/BOHEMIA_LOOK_CURRENT.html.
It rides the SAME iframe + data-src mechanism the ART/MAP/LIFE tabs already use,
so nothing about how tabs load had to change -- the panel is lazy like its
neighbours and the tab bar routes to it with no new code.

LOOK GOES FIRST IN THE BAR, not last. BOTTOM-UP (7/26) is about what he sees
without hunting, and the whole point of this tab is that the newest thing is one
tap away. A tab at the end of a ten-tab strip is another small hunt.

ONE-LINK LAW is untouched: this is a tab inside the existing alpha, not a new
link. Nothing here appends a query string and nothing here ships its own URL.

Idempotent: re-running when the tab is already there reports NOOP.

  python3 tools/bohemia_alpha_look_tab_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
TAB = '<div class="tab" data-p="look">LOOK</div>'
PANEL = ('    <div class="panel" id="p-look"><iframe id="lookFrame" '
         'data-src="BOHEMIA_LOOK_CURRENT.html" title="what is new, in pictures" '
         'style="width:100%;height:100%;border:0;background:#0d0b09"></iframe></div>\n')

if not os.path.exists(ALPHA):
    sys.exit('LOOK TAB: %s is not here.' % ALPHA)
src = open(ALPHA, encoding='utf8').read()
if 'data-p="look"' in src:
    print('the LOOK tab is already in the alpha. no-op.')
    sys.exit(0)

# --- the tab, FIRST in the bar (anchor on the RUN tab, which leads it today) ---
RUN_TAB = '<div class="tab" data-p="run">'
i = src.find(RUN_TAB)
if i < 0:
    sys.exit('LOOK TAB: could not find the tab bar to add to.')
src = src[:i] + TAB + src[i:]

# --- the panel, next to the other iframe panels ---
ART_PANEL = '    <div class="panel" id="p-art">'
j = src.find(ART_PANEL)
if j < 0:
    sys.exit('LOOK TAB: could not find the panel block to add to.')
src = src[:j] + PANEL + src[j:]

open(ALPHA, 'w', encoding='utf8').write(src)
print('THE LOOK TAB IS IN THE ALPHA.')
print('  tab   : LOOK, first in the bar')
print('  panel : #p-look -> BOHEMIA_LOOK_CURRENT.html (lazy iframe, same as ART/MAP/LIFE)')
print('  he taps one thing and sees every new thing, in pictures. No hunting.')
