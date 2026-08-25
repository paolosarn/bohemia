#!/usr/bin/env python3
"""
A CARD THAT SAYS "TAP CLOSE" AND CANNOT BE TAPPED, AND A DEAD PANEL ON EVERY TAP
(8/24/26, RUN lane. Both reported by Paolo, both reproduced before touching anything.)

PAOLO, verbatim:
    "When I press standing, and I press close, it doesn't close"
    "pretty please just make sure all the buttons work ... there shouldn't be any
     buttons that bring up any pop menus that don't go away after ... clicking out
     of them"
    "an artifact from one of the first builds is that when I click a tile it'll
     show me the tile but now it's not even correct because it's so old that part
     has to be removed"

MEASURED ON THE REAL ALPHA, driving the buttons the way he does:

    STANDING opened: {"on":true,"hasAct":0}
    still open after tapping the card:                true
    still open after tapping every word saying CLOSE: true
    still open after tapping the backdrop:            true
    TILE PANEL after ONE tap on the ground:
        "CONCRETE tile 290 (world) judge the look GOOD DIRECTION NOT IT X"

=== 1. WHY STANDING CANNOT CLOSE, AND WHY IT IS THE WHOLE CARD SYSTEM ==========

cardShow's only way out is delegated through a data attribute:

    i.onclick = function(ev){ const b = ev.target.closest('[data-act]');
                              if (b && onTap) onTap(b.dataset.act); };

Four of the six callers build buttons carrying data-act, so they close. THE TWO
STANDING CALLERS BUILD NONE -- hasAct is 0, measured -- so onTap can never fire.
It passes `cardHide` as its handler and that handler is unreachable. The card even
prints a row reading "TAP / CLOSE", which is a promise to the player that no code
in the file can keep.

THE SHAPE OF THE BUG IS THE ONE THIS LANE KEEPS FINDING: a finished thing with a
published seam and no caller. `cardHide` exists, is correct, and is never called.

THE FIX IS NOT "GIVE STANDING A BUTTON". That repairs one card and leaves the
next one somebody writes exactly as stuck, because the SYSTEM lets a card exist
with no way out. So the escape becomes structural and unconditional:

  a. THE BACKDROP CLOSES. #daycard is a full-screen scrim with the card centred
     in it; a tap that lands on the scrim rather than the card is a tap OUTSIDE
     the card, which is exactly the gesture he named. Guarded on ev.target ===
     the scrim so a tap inside the card never closes it by accident.
  b. ESCAPE CLOSES, for anyone on a keyboard.
  c. EVERY CARD GETS A REAL ✕, injected by cardShow itself rather than by each
     caller -- because a rule every caller has to remember is a rule that lasts
     until the next caller. It carries data-act="close" so it also travels the
     path the four working cards already use.
  d. STANDING's dishonest "TAP / CLOSE" row becomes an actual CLOSE button.

IS DISMISSING EVERY CARD SAFE? Checked one at a time rather than assumed, because
a card you can escape from is a soft lock if the game needed the answer:
    wake (GET UP)      handler = hide + a sound + the vista check. The day is
                       already running; the card is a greeting. Safe.
    sleep (SLEEP->DAY) handler = hide + upkeep + nextDay. Dismissing means NOT
                       sleeping yet, which is a real answer, and the SLEEP button
                       is still sitting there. Safe, and it must never auto-advance.
    resolution         dismissing DEFERS the choice; the quest stays at its stage
                       and nightfall still takes the author's own FAIL branch.
    market             already has LEAVE.
    standing           informational.
No card gates the day, so nothing can strand him.

=== 2. THE TILE PANEL, WHICH HE KILLED ONCE ALREADY =========================

Every tap on the ground while walking runs this:

    if (MODE==='human' && TP._tapStart && TP._tapMoved<8) tpTap(...)

and tpTap ends in tpShowJudge(), which BUILDS the old tile-judging panel --
GOOD DIRECTION / NOT IT / X -- and appends it to the document. In normal play,
on every tap.

HE ALREADY KILLED THESE BUTTONS ON 7/29 ("I dont want those button anymore") and
tpInitButtons removes #tpJudge at boot, saying so in its own comment. THE KILL WAS
INCOMPLETE: it deleted the node once and left the function that recreates it wired
to the one gesture a walking player makes most. Killed in one place, rebuilt in
another, which is why it came back to him.

So the tap wiring goes, and tpShowJudge is made unable to build anything -- both
ends, so no third path can resurrect it. The placement half is already unreachable
(tpInitButtons pins TP.on=false and there is no button left to set it), so nothing
a player can do is lost. Nothing is deleted from the file: the dead builder stays
visible with its post-mortem, the same way 7/29 left its own.

REUSE CHECK: no graphic pixels cooked -- this removes a panel and adds a close
affordance to an existing one, so no banks/ lookup applies.

WORDS: the ✕ and the CLOSE label are UI copy, a real attempt, draft:true.

Idempotent (marker __EVERY_PANEL_CLOSES__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__EVERY_PANEL_CLOSES__'

# ------------------------------------------------------------ 1. cardShow
A1_OLD = """function cardShow(html,onTap){
  const c=document.getElementById('daycard'), i=document.getElementById('daycardIn');
  i.innerHTML=html; c.classList.add('on');
  i.onclick=function(ev){ const b=ev.target.closest('[data-act]'); if(b&&onTap)onTap(b.dataset.act); };
}"""

A1_NEW = """function cardShow(html,onTap){
  const c=document.getElementById('daycard'), i=document.getElementById('daycardIn');
  /* """ + MARK + """ (8/24). Paolo: "When I press standing, and I press close,
     it doesn't close." MEASURED: the STANDING card opens with hasAct 0, and the
     ONLY way out of a card was `ev.target.closest('[data-act]')` -- so a card
     whose author did not build a data-act button had no exit at all, while
     printing a row that says "TAP CLOSE". cardHide existed, was correct, and was
     unreachable: a finished thing with a published seam and no caller.
     FIXED IN THE SYSTEM, NOT IN THE ONE CARD, because a rule every future caller
     has to remember is a rule that lasts until the next caller. Every card now
     gets a real ✕ from here, the scrim closes on a tap outside the card, and
     Escape closes. Checked one card at a time first: none of them gates the day,
     so being able to leave one can never strand him. */
  i.innerHTML='<div class="dcx" data-act="close" title="close">\\u2715</div>'+html;
  c.classList.add('on');
  i.onclick=function(ev){
    const b=ev.target.closest('[data-act]');
    if(!b) return;
    if(b.dataset.act==='close'){ cardHide(); return; }   /* always works, even with no onTap */
    if(onTap)onTap(b.dataset.act);
  };
  /* THE TAP OUTSIDE. #daycard is a full-screen scrim with the card centred in it,
     so a click whose target IS the scrim landed outside the card -- the exact
     gesture he asked for. Guarded on target identity so a tap inside the card
     never closes it by accident. */
  c.onclick=function(ev){ if(ev.target===c) cardHide(); };
}
/* """ + MARK + """ -- and Escape, for anyone with a keyboard. Bound once. */
if(!window.__CARD_ESC){
  window.__CARD_ESC=1;
  document.addEventListener('keydown',function(ev){
    if(ev.key==='Escape'){ try{ cardHide(); }catch(_e){} }
  });
}"""

# ------------------------------------------------------------ 2. the ✕ style
A2_OLD = """#daycardIn h2{font-size:13px;letter-spacing:3px;color:var(--acc);margin-bottom:4px}"""

A2_NEW = """/* """ + MARK + """ -- the corner ✕ every card gets from cardShow. Floated
   right so it sits in the card's own top-right without a wrapper, and given a
   real touch target rather than a glyph you have to hunt for with a thumb. */
#daycardIn .dcx{float:right;margin:-6px -4px 0 8px;width:34px;height:34px;
  display:flex;align-items:center;justify-content:center;border-radius:8px;
  color:#8d7c5e;font-size:15px;line-height:1;cursor:pointer;
  border:1px solid transparent}
#daycardIn .dcx:active{color:#fff;border-color:var(--line);background:#2a251d}
#daycardIn h2{font-size:13px;letter-spacing:3px;color:var(--acc);margin-bottom:4px}"""

# ------------------------------------------- 3. STANDING stops lying about CLOSE
A3_OLD = """  h += '<div class="rrow"><span class="rk">TAP</span><span class="rv">CLOSE</span></div>';
  cardShow(h, cardHide);"""

A3_NEW = """  /* """ + MARK + """ -- this row USED to read "TAP / CLOSE" and was not a
     button: no data-act, so the card's own click delegate never matched it and
     the card could not be closed at all. A real button now, on the same path the
     working cards use. */
  h += '<div class="dcgo" data-act="close">CLOSE</div>';   /* draft:true */
  cardShow(h, cardHide);"""

A4_OLD = """    cardShow('<div class="rwhy">Standing is not loaded on this page yet.</div>'
           + '<div class="rrow"><span class="rk">TAP</span><span class="rv">CLOSE</span></div>',
           cardHide);"""

A4_NEW = """    cardShow('<div class="rwhy">Standing is not loaded on this page yet.</div>'
           + '<div class="dcgo" data-act="close">CLOSE</div>',   /* """ + MARK + """ */
           cardHide);"""

# --------------------------------------------- 4. the tile artifact, both ends
A5_OLD = """    if(MODE==='human' && typeof TP!=='undefined' && TP._tapStart && TP._tapMoved<8){ tpTap(TP._tapStart.x,TP._tapStart.y); }"""

A5_NEW = """    /* """ + MARK + """ (8/24). Paolo: "an artifact from one of the first
       builds is that when I click a tile it'll show me the tile but now it's not
       even correct because it's so old that part has to be removed."
       This line ran tpTap on EVERY tap on the ground while walking, and tpTap
       ends in tpShowJudge() which BUILDS the old GOOD DIRECTION / NOT IT panel
       and appends it to the document. Measured: one tap produced "CONCRETE tile
       290 (world) judge the look GOOD DIRECTION NOT IT X".
       HE KILLED THOSE BUTTONS ON 7/29 ("I dont want those button anymore") and
       tpInitButtons deletes the node at boot -- but deleting a node once while
       leaving the function that rebuilds it wired to the most common gesture in
       the game is not a kill. Removed at the trigger AND at the builder, so no
       third path can bring it back. The placement half is already unreachable
       (TP.on is pinned false and no button remains to set it), so nothing a
       player can reach is lost. */"""

A6_OLD = """function tpShowJudge(){
  const t=TP._selTile; if(!t)return;"""

A6_NEW = """function tpShowJudge(){
  /* """ + MARK + """ (8/24): DEAD ON PURPOSE. Paolo asked for the old tile
     inspector to be removed; the tap that called this is gone and this refuses to
     build anything, so the panel cannot come back through any caller. The builder
     below is left standing rather than deleted, the same way the 7/29 buffet kill
     left its own -- a reader who wonders where it went can see it and its reason.
     It also tears out any node a stale build left behind. */
  try{ const _z=document.getElementById('tpJudge'); if(_z&&_z.parentNode)_z.parentNode.removeChild(_z); }catch(_e){}
  return;
  /* eslint-disable no-unreachable */
  const t=TP._selTile; if(!t)return;"""

EDITS = [
    (A1_OLD, A1_NEW, 'cardShow: a real close on every card, the scrim, and Escape'),
    (A2_OLD, A2_NEW, 'the corner close button style'),
    (A3_OLD, A3_NEW, 'STANDING gets a CLOSE that is a button'),
    (A4_OLD, A4_NEW, 'the not-loaded STANDING card too'),
    (A5_OLD, A5_NEW, 'the tile-tap that raised the old panel is gone'),
    (A6_OLD, A6_NEW, 'and the builder refuses to rebuild it'),
]


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: every panel already closes')
        return
    for needle, why in (('function cardHide(', 'the hide this makes reachable'),
                        ('function tpShowJudge(', 'the old tile panel builder'),
                        ("id=\"daycard\"", 'the card scrim')):
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
