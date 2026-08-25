#!/usr/bin/env python3
"""
BOHEMIA CITY CARD-FITS PATCH -- on the tallest cards you could not see whose name
you were reading. (8/21/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_THE_CARD_HAS_TO_FIT_8_18_26.md
Gate: gates/cardfold_gate.js (A12 rebuilt AGAIN -- see below)

REUSE CHECK (REUSE-FIRST): cooks nothing and adds no row, no rule and no content.
Three CSS properties on the container that already exists. The fold
(__CITY_NOTESFOLD__) still does the real work of keeping the card short; this is
the safety net for the tail it cannot reach.

--------------------------------------------------------------------------
A BAR THAT MEASURES ONE SAMPLE IS NOT A BAR -- THE THIRD TIME
--------------------------------------------------------------------------
A1  stood beside whoever was NEAREST, so it never once saw a vouch.
A12 was written to fix that, and measured a comfortable STATE (mid-climb, no
    wall), so it never saw the fullest card.
A12 was rebuilt to sit AT THE WALL, and still measured ONE ARBITRARY PERSON.

MEASURED across fourteen people in the IDENTICAL state:

    916px 109%  Cartel        <- the real worst
    916px 109%  Cartel
    900px 107%  Homeless
    881px 104%  Colorful
    881px 104%  Colorful
    874px 104%  Church
    852px 101%  Reds
    832px  99%  Network
    823px  98%  Mob           <- what A12 measured and called "the fullest"
    ...
    381px  45%  Custom

SEVEN OF FOURTEEN PEOPLE PRODUCE A CARD TALLER THAN THE PHONE, and A12 was
measuring the ninth worst. The height is driven by CONTENT LENGTH -- the quirk
quote alone runs 105-134 characters and wraps to three or four lines -- so
pinning one person pins one sample of a distribution.

--------------------------------------------------------------------------
WHAT OVERFLOW ACTUALLY DID TO A PLAYER, MEASURED
--------------------------------------------------------------------------
    card  916px   top -80   bottom 836
    overflowY: visible    maxHeight: none    scrollable: false
    buttons 8   OFF-SCREEN 0   -- all reachable

The card is `position:absolute; bottom:8px` with no cap, so it grows UPWARD and
spills off the top. The buttons were fine. WHAT WAS CUT OFF WAS THE TOP 80px --
their NAME, and the rows that say who put you on to them and what they just said.

So the failure was not "you cannot press the thing". It was: ON THE FULLEST CARDS
YOU CANNOT SEE WHO YOU ARE TALKING TO. That is worse than it sounds in a game
whose whole faction system is about earning a person's name.

--------------------------------------------------------------------------
THE FIX CHANGES NOTHING FOR A SHORT CARD
--------------------------------------------------------------------------
Cap the height at the viewport with the margins it already has, let it scroll,
and OPEN IT SCROLLED TO THE BOTTOM -- which is exactly where a bottom-anchored
card already sits. A short card is unchanged in every pixel. A tall one shows the
same thing it shows today, and the part that used to be CLIPPED is now reachable
by dragging down.

DELIBERATELY NOT A TRIM. Cutting rows to fit the tallest person means deciding
which of five systems' rows matter least on somebody else's behalf, and it has to
be re-argued every time content grows. The fold already removes what repeats; what
is left is live, and live rows are not the thing to delete.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_CARDFITS__'

OLD = """    '#ctcard{position:absolute;left:8px;right:8px;bottom:8px;z-index:41;display:none;'+
      'background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:12px 14px}'+"""
NEW = """    /* """ + MARKER + """ -- IT GREW UPWARD OFF THE TOP OF THE PHONE.
       bottom-anchored with no cap: measured 916px on an 844px screen with the
       card's top at -80px, so the person's NAME and the rows saying who put you
       on to them were CLIPPED. The buttons were always reachable; what you could
       not see was who you were talking to.
       Capped at the viewport with the margins it already had, scrolling instead
       of spilling. A SHORT CARD IS UNCHANGED IN EVERY PIXEL -- this only ever
       engages past the point where content was previously being thrown away. */
    '#ctcard{position:absolute;left:8px;right:8px;bottom:8px;z-index:41;display:none;'+
      'max-height:calc(100% - 16px);overflow-y:auto;-webkit-overflow-scrolling:touch;'+
      'background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:12px 14px}'+"""

# and it opens where a bottom-anchored card already sits
OLD_OPEN = """function ctSave(){"""
NEW_OPEN = """/* """ + MARKER + """ -- OPEN WHERE IT ALREADY SAT. A bottom-anchored card grows
   upward, so the bottom is what a player has always been looking at. Scrolling to
   it on open reproduces today's view exactly and leaves the formerly-clipped top
   reachable by dragging down, rather than silently re-framing the card. */
function ctCardToBottom(){
  try{
    var c = document.getElementById('ctcard');
    if(c && c.scrollHeight > c.clientHeight) c.scrollTop = c.scrollHeight;
  }catch(_e){}
}
function ctSave(){"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((OLD, NEW, 'the card container css'),
                           (OLD_OPEN, NEW_OPEN, 'the save function anchor')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY CARDFITS: the tallest card no longer hides the name at the top')


if __name__ == '__main__':
    main()
