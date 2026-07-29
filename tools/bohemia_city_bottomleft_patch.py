#!/usr/bin/env python3
"""
BOHEMIA CITY BOTTOM-LEFT STACK PATCH (7/29/26) - stop the bottom-left chrome
piling on itself.

Paolo (7/29, screenshot, three buttons circled in yellow): "Fix this in the ui pls."
BUFFET ON, PLACE and TILES were sitting on top of the hint text, running under the
nav ring, and the row was clipping off the left edge of the stage.

ROOT CAUSE, and it is the SAME BUG THE TOP BAR ALREADY HAD ON 7/25: four things
live in that corner and every one of them was absolute-positioned with its own
hardcoded offset, so none of them knows the others exist.

    #note (the hint)        bottom:58px, up to 48% wide, z-index 5
    the tile toolbar        bottom:70px, max-width:62vw,  z-index 39
    #bikebtn / #fitbtn      bottom:14px,                  z-index 6
    #nav (the ring)         right:6px, 180x180

Twelve pixels separate the toolbar's bottom from the hint's, and the hint WRAPS TO
SEVERAL LINES - so it grows straight up underneath the buttons. And 62vw on a 390px
phone is 242px, while the nav ring starts at x=204, so the last chip is always under
the arrow. Neither number is wrong on its own; they are wrong because nothing was
ever measuring them against each other.

FIX (chrome only, no game logic touched): ONE bottom-left flex COLUMN, the same
answer the top bar got. #blstack is anchored bottom-left, bounded on the right so it
can never reach the nav ring, and lays its children out bottom-up with a gap. The
hint, the bike/fit chip and the tile toolbar become children of it and lose their
absolute offsets. They can now never overlap, no matter how many lines the hint runs
to or how many chips wrap - the layout does the arithmetic instead of me.

The toolbar keeps flex-wrap, so on a narrow phone the three chips wrap to a second
row INSIDE the column and push the stack up rather than escaping it.

REUSE CHECK: no graphic pixels cooked - this is a CSS/DOM reflow of buttons that
already exist, so no banks/ lookup applies (reuse-first governs cooking NEW art;
nothing is drawn here).

Idempotent (marker BOTTOM-LEFT STACK). Patches CITY_B64 in the alpha in place, the
same decode -> string-replace -> re-encode pattern as every other city patch.

  python3 tools/bohemia_city_bottomleft_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'BOTTOM-LEFT STACK' in decoded:
    print('bottom-left stack already wired. no-op.')
    sys.exit(0)

# ---- 1) the column itself -----------------------------------------------------
# RIGHT-BOUNDED AT 196px, WHICH IS NOT A GUESS: the nav ring is 180px wide sitting
# at right:6px, so it owns everything past x = width-186. 196 leaves a 10px gutter
# so a chip's border never kisses the ring. column-reverse because the stack is
# anchored to the BOTTOM - first child sits lowest and later ones pile upward.
CSS_ANCHOR = '#bikebtn.on{color:#fff;border-color:#5a4a2a;background:#1f1a10}\n'
CSS_ADD = CSS_ANCHOR + """
/* ==== BOTTOM-LEFT STACK (7/29): see tools/bohemia_city_bottomleft_patch.py.
   Four absolutely-positioned things shared this corner and collided. One flex
   column now owns it, bounded clear of the nav ring. ==== */
#blstack{position:absolute;left:8px;bottom:12px;right:196px;z-index:39;
  display:flex;flex-direction:column-reverse;align-items:flex-start;gap:6px;
  pointer-events:none}
#blstack>*{position:static !important;left:auto !important;right:auto !important;
  top:auto !important;bottom:auto !important;transform:none !important;
  margin:0 !important;max-width:100% !important;pointer-events:auto}
"""
assert decoded.count(CSS_ANCHOR) == 1, decoded.count(CSS_ANCHOR)
decoded = decoded.replace(CSS_ANCHOR, CSS_ADD, 1)

# ---- 2) the tile toolbar joins the column instead of the body -----------------
OLD_BAR = ("  bar.style.cssText='position:absolute;left:8px;bottom:70px;z-index:39;"
           "display:flex;gap:6px;flex-wrap:wrap;max-width:62vw';")
NEW_BAR = ("  /* BOTTOM-LEFT STACK: no offsets of its own any more - the column "
           "places it. */\n"
           "  bar.style.cssText='display:flex;gap:6px;flex-wrap:wrap';")
assert decoded.count(OLD_BAR) == 1, decoded.count(OLD_BAR)
decoded = decoded.replace(OLD_BAR, NEW_BAR, 1)

OLD_APPEND = '  document.body.appendChild(bar);'
NEW_APPEND = '  (blStack()||document.body).appendChild(bar);'
assert decoded.count(OLD_APPEND) == 1, decoded.count(OLD_APPEND)
decoded = decoded.replace(OLD_APPEND, NEW_APPEND, 1)

# ---- 3) build the column and move the existing chrome into it -----------------
# ORDER IS DELIBERATE and reads bottom-up on screen: bike/fit chip lowest (it is
# the one you reach for mid-walk), the hint above it, the tile toolbar on top.
BUILDER = """
/* ==== BOTTOM-LEFT STACK (7/29) ==== */
function blStack(){
  let s=document.getElementById('blstack');
  if(!s){ s=document.createElement('div'); s.id='blstack';
    const w=document.querySelector('.wrap')||document.body; w.appendChild(s); }
  /* Re-adopt every pass. These chips are created and re-created by different
     systems at different times, so claiming them ONCE at boot would quietly stop
     working the day one of them is rebuilt - which is exactly how the offsets
     drifted apart in the first place. appendChild on a node already in place is
     a no-op, so this is cheap. */
  ['bikebtn','fitbtn','note'].forEach(function(id){
    const el=document.getElementById(id);
    if(el&&el.parentNode!==s&&getComputedStyle(el).display!=='none')s.insertBefore(el,s.firstChild);
  });
  return s;
}
blStack(); setInterval(blStack,600);
"""
JS_ANCHOR = 'function tpInitButtons(){'
assert decoded.count(JS_ANCHOR) == 1
decoded = decoded.replace(JS_ANCHOR, BUILDER.strip() + '\n' + JS_ANCHOR, 1)

out = alpha[:a0] + base64.b64encode(decoded.encode('utf8')).decode('ascii') + alpha[a1:]
open(ALPHA, 'w', encoding='utf8').write(out)
print('BOTTOM-LEFT STACK wired: the hint, the bike chip and the tile toolbar now')
print('share one flex column, bounded 196px clear of the nav ring.')
