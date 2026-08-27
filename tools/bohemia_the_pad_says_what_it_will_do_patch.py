#!/usr/bin/env python3
"""
THE PAD SAYS WHAT IT IS ABOUT TO DO
(8/27/26, RUN lane. The other half of the bug he reported.)

    "how come in the run like it wants to keep spawning me like outside of like
     my starter Neighbourhood it's so confusing"

YESTERDAY'S PATCH FIXED THE CONSEQUENCE AND LEFT THE CONFUSION. LOOKING AT THE
MAP IS NOT TRAVELLING stopped a glance from moving his body 194 tiles. It did
nothing about WHY he pressed the pad in the first place, and he did not say
"it moved me", he said IT IS CONFUSING.

THE ACTUAL DEFECT, and it is a signifier problem, not a logic one: THE SAME
CONTROL, IN THE SAME CORNER, UNDER THE SAME THUMB, LOOKING EXACTLY THE SAME,
MEANS TWO COMPLETELY DIFFERENT THINGS.

    zoomed in    a press walks him one tile. About a metre. Free.
    zoomed out   a press moves the MARKER one overmap cell. Ninety-six metres.
                 TEN MINUTES OF HIS DAY. And since this turn, it can also hand
                 him a road encounter that eats twenty more.

Nothing on the screen distinguished those. Measured yesterday: three presses he
never meant cost him half an hour and a neighbourhood.

=== WHY IT IS NOT A CAPTION =================================================

The tempting fix is a line of text saying "this moves the marker". That is the
wrong tool and this repo has the receipts: NAME THE TAB exists because he does
not read the interface looking for explanations, and TALK TO HIM LIKE A PERSON
exists because words on his screen are a cost.

Norman's distinction is the one that applies. An AFFORDANCE is what a control can
do; a SIGNIFIER is what it TELLS YOU it will do. The pad's affordance changed at
the seam and its signifier never did. So the fix is to change what the control
LOOKS LIKE, not to add a sentence explaining the mismatch.

=== WHAT CHANGES, AND IT IS THREE THINGS AT ONCE ============================

One difference can be missed. Three cannot.

    SHAPE    round -> rounded square. A circle is a thumbstick, which is a body
             control. A square is a tile, which is a map control. This is the
             loudest of the three because silhouette reads before colour, which
             is the same argument the clothing law makes about identity at
             distance.
    GLYPH    single arrow -> DOUBLE arrow. The arrow itself says "this is a long
             way", which is exactly the difference between a metre and ninety-six
             of them.
    WEIGHT   the ring goes from the warm walking accent to the map's own cooler
             line, and gets slightly bigger, because the step it takes is bigger.

NO CAPTION, NO TUTORIAL, NO NEW WORDS ON HIS SCREEN.

=== WHERE IT IS DRIVEN FROM =================================================

updHud(), which every single mode change in the file already calls (19 call
sites, including both zoom seams and the chip). Driving it from render() would
be per-frame DOM work for a thing that changes twice a minute, and driving it
from the seams by hand is how the next seam gets forgotten.

REUSE CHECK: cooks NO pixels and opens no banks/. It restyles a control that
already exists using the app's own CSS variables (--acc, --line, --face); no new
art, no new colour invented, no new element.

Idempotent (marker __THE_PAD_SAYS_WHAT_IT_WILL_DO__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_PAD_SAYS_WHAT_IT_WILL_DO__'

# ---------------------------------------------------------------- 1. the look
CSS_OLD = """.pb:active{border-color:#5a4a2a;color:#fff}"""

CSS_NEW = """.pb:active{border-color:#5a4a2a;color:#fff}
/* """ + MARK + """ (8/27): THE PAD LOOKS LIKE WHAT IT IS ABOUT TO DO.
   Zoomed out, a press is not a step -- it is ninety-six metres and ten minutes,
   and it can hand him a road encounter that costs twenty more. Same corner, same
   thumb, so the CONTROL has to say it. Three changes at once, because one can be
   missed: a circle is a thumbstick and a square is a map tile, the arrow doubles
   because the distance does, and the ring cools off the walking accent onto the
   map's own line. No caption anywhere: this is a signifier, not a tutorial. */
#pad.mapmove .pb{border-radius:7px;width:46px;height:46px;
  background:radial-gradient(circle at 50% 38%,#20242a,#0d1014 75%);
  border:1px solid #4a5a68;color:#9fb4c4;font-size:17px}
#pad.mapmove .pb:active{border-color:#7fa8c4;color:#fff}"""

# ------------------------------------------------ 2. both glyphs on the button
PAD_OLD = """    const b=document.createElement('div'); b.className='pb'; b.textContent=ch;
    b.style.left=x+'px'; b.style.top=y+'px';"""

PAD_NEW = """    const b=document.createElement('div'); b.className='pb'; b.textContent=ch;
    /* """ + MARK + """: both faces of the button live ON the button, so padMode
       only ever swaps between two authored glyphs and can never invent one. */
    b.dataset.walk=ch; b.dataset.mapmove=MAPGLYPH[di];
    b.style.left=x+'px'; b.style.top=y+'px';"""

GLYPH_OLD = """  const pos=[[69,3,'↑',0],"""

GLYPH_NEW = """  /* """ + MARK + """ -- the map face of each direction, in pos order.
     A double arrow for a move that is ninety-six metres instead of one. */
  const MAPGLYPH=['⇑','⇗','⇒','⇘','⇓','⇙','⇐','⇖'];
  const pos=[[69,3,'↑',0],"""

# --------------------------------------------------------------- 3. the driver
HUD_OLD = """function updHud(){"""

HUD_NEW = """/* """ + MARK + """ (8/27) -- THE PAD LOOKS LIKE WHAT IT WILL DO.
   Paolo: "it's so confusing". The pad does not move or hide when he zooms out,
   so his thumb is already on it, and a press there is a marker cell (96 metres,
   ten minutes, and now possibly a road encounter) rather than a step. Yesterday
   three presses he never meant cost him half an hour.
   DRIVEN FROM updHud BECAUSE EVERY MODE CHANGE IN THIS FILE ALREADY CALLS IT --
   both zoom seams, the chip, the vista, sleep, the lot. Hooking the seams by
   hand is how the next seam gets forgotten, and calling it from render() would
   be per-frame DOM work for something that changes twice a minute. */
function padMode(){
  const pad=document.getElementById('pad');
  if(!pad) return;
  const map=(typeof MODE!=='undefined'&&MODE==='city');
  if(pad.classList.contains('mapmove')===map) return;   /* no churn, no relayout */
  pad.classList.toggle('mapmove',map);
  const bs=pad.querySelectorAll('.pb');
  for(let i=0;i<bs.length;i++){
    const g=map?bs[i].dataset.mapmove:bs[i].dataset.walk;
    if(g) bs[i].textContent=g;
  }
}
function updHud(){
  try{ padMode(); }catch(_e){}"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the pad already says what it will do')
        return
    for old, what in ((CSS_OLD, 'the pad button style'),
                      (PAD_OLD, 'where the buttons are built'),
                      (GLYPH_OLD, 'the direction table'),
                      (HUD_OLD, 'the hud updater')):
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
    for old, new in ((CSS_OLD, CSS_NEW), (GLYPH_OLD, GLYPH_NEW),
                     (PAD_OLD, PAD_NEW), (HUD_OLD, HUD_NEW)):
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s -- the pad changes shape, glyph and weight at the seam' % CITY)


if __name__ == '__main__':
    main()
