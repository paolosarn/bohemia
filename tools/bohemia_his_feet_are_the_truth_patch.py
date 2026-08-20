#!/usr/bin/env python3
"""
HIS HOUSE WAS THIRTY-EIGHT CELLS FROM WHERE HE WOKE UP (8/19/26, RUN lane).

FOUND BY EXTENDING THE FIRST-NIGHT AUDIT past the wake, into the half nobody had
ever driven: can the player actually REACH the job and the market? The existing
demo gate proves those beats work, but it TELEPORTS to get to them
(`city.x = h.x; city.y = h.y`) and CALLS `offerAccept()` rather than tapping it.
So "the market opens" was proven and "he can get to the market" never was.

MEASURED ON A CLEAN BOOT OF THE REAL ALPHA, having touched nothing but GET UP:

    LANDED    = [6205, 6271]        -> his body is in overmap cell (48,48)
    HOME_KEY  = "2691674296:37,22"  -> his HOUSE was resolved in cell (37,22)
    home      = {4790, 2876}        -> a house 38 cells away from his feet
    phone.home.cell = {37,22}       -> and the phone points him at it

THE PLAYER'S OWN HOUSE -- the thing the entire run is anchored on, the thing he
asked for by name on 8/11 ("how was this a run when my house isn't labeled") --
was in a different part of the valley from the player, on every single boot.

WHY, TRACED RATHER THAN GUESSED. A property trap on city.x caught the write:

    MARKERTRACE installed at x=48 y=48 MODE=human hx=6205 hy=6271
    MARKERTRACE x 48 -> 37  @ BOHEMIA_CITY_WORLD.html:27449

The marker starts CORRECT and agreeing with the body. Then the shell's
BOHEMIA_GOTO_CELL handler moves it. The alpha fires cityGoToRunCell() when the
RUN tab opens, forwarding `G._runCell` -- WHICH COMES FROM THE RUN SLICE, a
DIFFERENT SURFACE WITH ITS OWN PLAYER. Two surfaces, two players, one marker.
The run slice says (37,22), the walked body is at (48,48), and homeFind() keys on
the marker, so the house followed the wrong one.

THIS IS THE SAME BUG THE HANDLER'S OWN COMMENT ALREADY RECORDS, HALF-FIXED. It
says the line used to be `MODE='city'` and that it "fired every time he tapped
RUN and threw him out of his body to the overview". The MODE half was fixed on
8/2. The COORDINATE half was left, and it has been quietly relocating his house
ever since.

TWO SIDES, BOTH FIXED, because either one alone leaves a live trap:

  1. HIS FEET ARE THE TRUTH. When the city is in human mode the player is
     standing in THIS world, and a cell posted by another surface is a stale echo
     -- it no longer moves his marker. In city mode the marker still follows the
     message, which is the case Paolo asked for on 7/28 ("I want that reflected
     when I'm in the city menu") and it is untouched.
  2. AND HOME IS RESOLVED FROM WHERE THE PLAYER IS, not from the camera. This
     file already had the right idiom in two places -- mktHub() and mktAt() both
     do `(MODE==='human') ? ((hx/FN)|0) : city.x` -- and homeFind() was the one
     that read the camera instead. Now it matches. Even if something moves the
     marker again, the house stays where the man is.

The vista is unaffected: it runs in city mode with the marker on the rim, and its
own 8/17 stash of HOME/HOME_KEY through returnTo still does that job.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It changes which coordinate two existing functions read,
and reuses the (MODE==='human') idiom already used by mktHub/mktAt in this file.

Gate: gates/first_night_gate.js -- boots the real alpha and asserts his house is
in the cell he is standing in.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__HIS_FEET_ARE_THE_TRUTH__'

# ---- 1. an outside surface may not move him while he is in his body ---------
OLD_GOTO = """  if(d&&d.type==='BOHEMIA_GOTO_CELL'&&typeof d.x==='number'&&typeof d.y==='number'){
    const n=(om&&om.n)||96;
    city.x=Math.max(0,Math.min(n-1,d.x|0)); city.y=Math.max(0,Math.min(n-1,d.y|0));"""

NEW_GOTO = """  if(d&&d.type==='BOHEMIA_GOTO_CELL'&&typeof d.x==='number'&&typeof d.y==='number'){
    const n=(om&&om.n)||96;
    /* """ + MARK + """ -- WHILE HE IS IN HIS BODY, HIS FEET ARE THE TRUTH.
       This cell comes from the RUN SLICE, a different surface with its own
       player, forwarded by the shell's cityGoToRunCell() every time the RUN tab
       opens. MEASURED 8/19 on a clean boot: the marker started at (48,48)
       agreeing with the body, this line moved it to (37,22), and homeFind()
       keys on the marker -- so HIS HOUSE WAS RESOLVED 38 CELLS FROM HIS FEET,
       and the phone pointed him at it. Every boot.
       THE COMMENT BELOW ALREADY DESCRIBES THIS BUG, HALF-FIXED: the MODE half
       was corrected on 8/2 ("threw him out of his body to the overview"); the
       COORDINATE half was left behind and kept relocating his house.
       In CITY mode the marker still follows the message -- that is the case
       Paolo asked for on 7/28 and it is untouched. */
    if(MODE==='human'){ window.__BOH_GOTO_IGNORED=(window.__BOH_GOTO_IGNORED||0)+1;
      try{ updHud(); }catch(_e){} return; }
    city.x=Math.max(0,Math.min(n-1,d.x|0)); city.y=Math.max(0,Math.min(n-1,d.y|0));"""

# ---- 2. and the house is resolved from where the player is ------------------
OLD_HOME = """function homeFind(){
  const key=seed+':'+city.x+','+city.y;
  if(HOME_KEY===key) return HOME;
  const bx=city.x*FN, by=city.y*FN;"""

NEW_HOME = """function homeFind(){
  /* """ + MARK + """ -- FROM WHERE THE PLAYER IS, NOT WHERE THE CAMERA IS.
     This keyed on city.x/city.y, the overmap MARKER. In human mode the marker is
     a camera and the body is the man, and when anything moved the camera the
     house moved with it: measured 8/19, body in cell (48,48), HOME_KEY
     "2691674296:37,22", his house 38 cells away on a clean boot.
     mktHub() and mktAt() in this same file already read the player's cell this
     exact way; homeFind was the one asking the camera. Now all three agree, so
     the house stays where the man is even if something moves the marker again. */
  const _pcx=(MODE==='human')?((hx/FN)|0):city.x;
  const _pcy=(MODE==='human')?((hy/FN)|0):city.y;
  const key=seed+':'+_pcx+','+_pcy;
  if(HOME_KEY===key) return HOME;
  const bx=_pcx*FN, by=_pcy*FN;"""

OLD_ANCHOR = """  const anchor=(LANDED&&((LANDED[0]/FN)|0)===city.x&&((LANDED[1]/FN)|0)===city.y)
    ? LANDED : [bx+(FN>>1), by+(FN>>1)];"""

NEW_ANCHOR = """  const anchor=(LANDED&&((LANDED[0]/FN)|0)===_pcx&&((LANDED[1]/FN)|0)===_pcy)
    ? LANDED : [bx+(FN>>1), by+(FN>>1)];"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    for name, old, new in [('the goto handler', OLD_GOTO, NEW_GOTO),
                           ('homeFind key', OLD_HOME, NEW_HOME),
                           ('homeFind anchor', OLD_ANCHOR, NEW_ANCHOR)]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
