#!/usr/bin/env python3
"""
THE DEMO'S MONEY SHOT TRAPPED HIM IN IT, AND ITS TITLE SAT ON THE TOOLBAR
(8/25/26, RUN lane. Found by playing the back half of the demo, which nobody had.)

THE VISTA is demo critical-path row 11 -- the overlook where the whole valley
opens up -- and on DAY 2 it fires BY ITSELF, seconds after GET UP. Playing to it
and then trying to leave:

    tap the world              -> still open
    Escape                     -> still open
    the MODE / DROP IN button  -> still open
    tap the vista card         -> still open
    WHOLE MAP                  -> still open
    walk the pad               -> still open

SIX WAYS OUT, NONE OF THEM WORK. `vistaClose()` exists, is correct, and THE ONLY
CALLER IN THE REPO IS A GATE (`vista_beat_gate.js:127`). Nothing a player can
touch calls it. He reaches the best moment in the demo and the game keeps him
there.

That is the STANDING card again -- "I press close, it doesn't close" -- on the
one screen the demo is built to show off, and it is exactly what he asked me to
sweep for two days ago. My EVERY PANEL gate missed it because it walks the chips
in the toolbar, the drawer and the bottom-left column, and the vista is not
opened by a chip: the day loop opens it.

AND THE CARD IS ON TOP OF THE TOOLBAR. `top:64px`, hardcoded, while the toolbar
occupies 49..80 and the objective line 86..116. So "THE VALLEY / the
neighbourhoods, the boulevards, the freeway" is printed across the music button,
the save button and the day's objective. FOURTH hardcoded offset this week that
does not know what is above it.

=== THE FIX ==================================================================

1. HE CAN LEAVE, by every gesture he already has:
   - a TAP on the world (a real tap, not a drag -- the city already tells them
     apart with CB._tapMoved, so this reuses that rather than inventing a test)
   - a tap on the card itself
   - Escape
   and the card SAYS SO, because a way out he cannot see is one he does not have.

2. THE CARD MEASURES WHAT IS ABOVE IT instead of guessing 64px.

3. *** AND THE MEASUREMENT IS EXTRACTED, NOT COPIED A THIRD TIME. *** The
   population card learned this same arithmetic on 8/24 and the vista would have
   been the third hand-written copy of it. Copies drift -- that is the entire
   story of my week (a door predicate copied into homeFind, an objective hint
   copied into an inlined module, a toolbar offset copied into popwrap). So
   `topChromeBottom()` is defined once and both callers ask it.

NOT CHANGED: where the overlook is, what it frames, the survey line, the camera
move, or the returnTo bookkeeping that keeps his house alive while he is up there.
This adds a way out and moves one number.

REUSE CHECK: no graphic pixels cooked -- a DOM position and an existing close
function, so no banks/ lookup applies.

WORDS: the way-out line is UI copy, a real attempt, draft:true.

Idempotent (marker __THE_VISTA_LETS_YOU_LEAVE__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_VISTA_LETS_YOU_LEAVE__'

# ------------------------------------------------- 1. the shared measurement
HELPER_ANCHOR = """function vistaCardDraw(){"""

HELPER = """/* """ + MARK + """ (8/25) -- WHAT IS THE BOTTOM OF THE TOP CHROME.
   Defined ONCE. The population card worked this out on 8/24 and the vista card
   would have been the third hand-written copy of the same six lines -- and a
   copied rule is a rule that drifts, which is the whole story of this week (a
   door predicate copied into homeFind, an objective hint copied into an inlined
   module, a toolbar offset copied into popwrap). Anything that floats over the
   world asks this instead of guessing a number.
   `el` is the thing being POSITIONED: the answer is returned in ITS OWN
   offsetParent's coordinates, because asking the element being measured is how
   the popcard fix got it wrong the first time. */
function topChromeBottom(el){
  var low=0;
  ['topbar','tlstack','devtray'].forEach(function(id){
    var e=document.getElementById(id);
    if(e&&e.offsetParent!==null) low=Math.max(low,e.getBoundingClientRect().bottom);
  });
  if(!low) return null;
  var ph=(el&&(el.offsetParent||el.parentNode))||document.body;
  var phTop=ph?ph.getBoundingClientRect().top:0;
  return Math.ceil(low-phTop);
}
function vistaCardDraw(){"""

# ------------------------------------------------------ 2. the card, repositioned
CARD_OLD = """  if(!el){ el=document.createElement('div'); el.id='vistaCard';
    el.style.cssText='position:absolute;left:0;right:0;top:64px;z-index:45;text-align:center;'
      +'pointer-events:none;font:12px ui-monospace,monospace;letter-spacing:2px';
    (document.getElementById('wrap')||document.body).appendChild(el); }
  el.innerHTML='<div style="display:inline-block;background:rgba(12,10,8,.74);border:1px solid #3a3020;'
    +'border-radius:8px;padding:8px 14px;color:#e6d9b8">THE VALLEY<br>'
    +'<span style="color:#c8a848;font-size:11px">'+VISTA.card+'</span></div>';"""

CARD_NEW = """  if(!el){ el=document.createElement('div'); el.id='vistaCard';
    /* """ + MARK + """: pointer-events AUTO now, because tapping the card is
       one of the ways out. It used to be `none`, so the card could not even be
       tapped -- and there was nothing else to tap either. */
    el.style.cssText='position:absolute;left:0;right:0;top:64px;z-index:45;text-align:center;'
      +'pointer-events:auto;cursor:pointer;font:12px ui-monospace,monospace;letter-spacing:2px';
    el.addEventListener('click',function(){ try{ vistaClose(); }catch(_e){} });
    (document.getElementById('wrap')||document.body).appendChild(el); }
  /* """ + MARK + """: it was top:64px, hardcoded, while the toolbar sits at
     49..80 and the objective line at 86..116 -- so THE VALLEY was printed across
     the music button, the save button and the day's objective, on the one screen
     the demo exists to show off. Measured now, through the shared helper. */
  var _tcb=topChromeBottom(el);
  if(_tcb!=null) el.style.top=(_tcb+8)+'px';
  el.innerHTML='<div style="display:inline-block;background:rgba(12,10,8,.74);border:1px solid #3a3020;'
    +'border-radius:8px;padding:8px 14px;color:#e6d9b8">THE VALLEY<br>'
    +'<span style="color:#c8a848;font-size:11px">'+VISTA.card+'</span>'
    /* A WAY OUT HE CAN SEE. It existed and was invisible, which is the same as
       not existing -- his words on the STANDING card two days ago. */
    +'<br><span style="color:#8d7c5e;font-size:10px">tap anywhere to go back</span>'
    +'</div>';   /* draft:true */"""

# -------------------------------------------------- 3. a tap on the world leaves
TAP_OLD = """    if(MODE==='city' && CB._tapStart && CB._tapMoved<8 && pts.size<=1){ cityTapPlot(CB._tapStart.x,CB._tapStart.y); }"""

TAP_NEW = """    /* """ + MARK + """ (8/25). THE VISTA HAD NO WAY OUT AT ALL. vistaClose()
       exists, is correct, and its ONLY caller in the repo was a gate -- so on day
       2, when the overlook opens by itself, tapping, Escape, DROP IN, WHOLE MAP
       and the pad all left him standing on the mountain. Measured, all six.
       A TAP LEAVES. It reuses the city's own tap-versus-drag test (CB._tapMoved)
       rather than inventing one, so he can still DRAG to look around the valley
       and only a real tap comes home. It is checked before cityTapPlot because
       while the vista is up, a tap means "I am done looking", not "inspect that
       plot a mile away". */
    if(VISTA && CB._tapStart && CB._tapMoved<8 && pts.size<=1){
      try{ vistaClose(); }catch(_e){}
      CB._tapStart=null; pts.delete(e.pointerId); return;
    }
    if(MODE==='city' && CB._tapStart && CB._tapMoved<8 && pts.size<=1){ cityTapPlot(CB._tapStart.x,CB._tapStart.y); }"""

# ------------------------------------------------------------- 4. and Escape
ESC_OLD = """document.addEventListener('keydown', function(ev){
  if(ev.key!=='Escape') return;
  for(var i=0;i<OUTSIDE_PANELS.length;i++){
    var el=document.getElementById(OUTSIDE_PANELS[i][0]);
    if(panelIsOpen(el)) panelClose(OUTSIDE_PANELS[i]);
  }
});"""

ESC_NEW = """document.addEventListener('keydown', function(ev){
  if(ev.key!=='Escape') return;
  /* """ + MARK + """: the overlook is the biggest thing that can be open, so it
     answers the same key everything else does. */
  try{ if(typeof VISTA!=='undefined'&&VISTA){ vistaClose(); return; } }catch(_e){}
  for(var i=0;i<OUTSIDE_PANELS.length;i++){
    var el=document.getElementById(OUTSIDE_PANELS[i][0]);
    if(panelIsOpen(el)) panelClose(OUTSIDE_PANELS[i]);
  }
});"""

# ------------------- 5. the population card stops carrying its own copy of it
POP_OLD = """      var low = 0;
      ['topbar', 'devtray'].forEach(function (id) {
        var e = document.getElementById(id);
        if (e && e.offsetParent !== null) low = Math.max(low, e.getBoundingClientRect().bottom);
      });
      if (low) {
        var ph = wrap.offsetParent || wrap.parentNode;
        var phTop = ph ? ph.getBoundingClientRect().top : 0;
        wrap.style.top = (Math.ceil(low - phTop) + 8) + 'px';
      }"""

POP_NEW = """      /* """ + MARK + """ (8/25): this WAS six lines of arithmetic, and the
         vista card was about to become a second copy of them. Extracted to
         topChromeBottom() and called by both. Same answer, one owner. */
      var _tcb = topChromeBottom(wrap);
      if (_tcb != null) wrap.style.top = (_tcb + 8) + 'px';"""

EDITS = [
    (HELPER_ANCHOR, HELPER, 'topChromeBottom(), defined once'),
    (CARD_OLD, CARD_NEW, 'the vista card measures, and says how to leave'),
    (TAP_OLD, TAP_NEW, 'a tap on the world leaves the vista'),
    (ESC_OLD, ESC_NEW, 'and so does Escape'),
    (POP_OLD, POP_NEW, 'the population card drops its private copy of the arithmetic'),
]


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the vista already lets him leave')
        return
    for needle, why in (('function vistaClose(', 'the close that had no caller'),
                        ('function vistaOpen(', 'the overlook'),
                        ('CB._tapMoved', "the city's own tap-versus-drag test")):
        if needle not in s:
            sys.exit('FAIL: %s is missing (%s)' % (needle, why))
    for old, new, what in EDITS:
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s' % CITY)
    for _o, _n, what in EDITS:
        print('  + ' + what)


if __name__ == '__main__':
    main()
