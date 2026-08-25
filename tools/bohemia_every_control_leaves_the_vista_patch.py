#!/usr/bin/env python3
"""
THREE OF THE SIX WAYS OUT OF THE VISTA STILL WENT NOWHERE
(8/25/26, RUN lane. The second half of THE VISTA LETS YOU LEAVE, same day.)

The first patch gave the overlook a tap, a card tap and an Escape, and measured
them working. THE OTHER THREE THINGS HE WOULD ACTUALLY PRESS STILL DID NOTHING:

    the MODE / DROP IN button   -> vista still open (and now MODE had flipped
                                   UNDERNEATH it, so the card sat over a view
                                   that no longer matched it -- worse than stuck)
    WHOLE MAP                   -> vista still open
    walk the pad                -> vista still open, he does not move

That is not three more bugs, it is ONE: the vista is a full-screen camera state
and NOTHING ELSE IN THE FILE KNEW IT EXISTED. Every control just did its job on
top of it.

*** AND THE FILE ALREADY SOLVED THIS ONCE, WHICH IS WHY THIS IS NOT A NEW
    INVENTION. *** SKY is the other full-screen camera state, and WHOLE MAP
    opens with:

        if(SKY){ skyExit(); return; }   /* __ONE_ZOOM_TO_THE_MOON__ */

    The moon got the treatment; the overlook never did. This is REUSE-FIRST
    applied to a control convention: copy the shape the codebase already agreed
    on rather than inventing a fourth one.

WHAT EACH CONTROL DOES NOW, and the difference matters:

  MODE / DROP IN and WHOLE MAP    COME BACK, and stop. One tap = "I am done
    looking." They are camera buttons and the vista is a camera; doing their own
    job as well would leave him somewhere he did not ask to be.

  THE PAD                         COMES BACK AND THEN WALKS. Pressing a
    direction is not "get me out of here", it is "go that way" -- so it lands
    him back in his body and the hold he is already making starts moving him.
    Swallowing that press would make the first step of every vista exit dead.

NOT CHANGED: the overlook itself, the framing, the survey line, the card, or the
returnTo bookkeeping that keeps his house alive while he is up there.

REUSE CHECK: no graphic pixels cooked -- control plumbing around an existing
close function, so no banks/ lookup applies.

Idempotent (marker __EVERY_CONTROL_LEAVES_THE_VISTA__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__EVERY_CONTROL_LEAVES_THE_VISTA__'

# --------------------------------------------------------- 1. one shared bail
BAIL_ANCHOR = """function vistaClose(){"""

BAIL = """/* """ + MARK + """ (8/25) -- IS THE OVERLOOK IN THE WAY?
   Every world control asks this FIRST. Measured before it existed: DROP IN,
   WHOLE MAP and the pad all did their own job straight through an open vista
   and left him standing on the mountain with the card still up. SKY -- the
   other full-screen camera state -- has had exactly this guard on WHOLE MAP
   since __ONE_ZOOM_TO_THE_MOON__; the overlook never got one. Returns true if
   it took the press, so a caller can decide whether to also do its own job. */
function vistaBail(){
  try{ if(typeof VISTA!=='undefined' && VISTA){ vistaClose(); return true; } }catch(_e){}
  return false;
}
function vistaClose(){"""

# ------------------------------------------- 2. MODE / DROP IN comes back home
MODE_OLD = """function transition(){
  if(transing)return; transing=true;"""

MODE_NEW = """function transition(){
  /* """ + MARK + """: while the overlook is up this button means COME BACK, and
     nothing else. It used to run the whole dive animation on top of the vista --
     MODE flipped underneath the card, so the title of the valley ended up
     printed over his own street. One tap home; if he then wants to drop in, the
     button is right there and it works. */
  if(vistaBail()) return;
  if(transing)return; transing=true;"""

# ------------------------------------------------------- 3. WHOLE MAP likewise
FIT_OLD = """  if(SKY){ skyExit(); return; }   /* __ONE_ZOOM_TO_THE_MOON__: one tap back down to the valley */"""

FIT_NEW = """  if(SKY){ skyExit(); return; }   /* __ONE_ZOOM_TO_THE_MOON__: one tap back down to the valley */
  if(vistaBail()) return;         /* """ + MARK + """: and one tap back down off the rim */"""

# ------------------------------------------ 4. and a direction walks him home
PAD_OLD = """function startHold(di){ held=di; pend=di; heldBeats=0; }"""

PAD_NEW = """function startHold(di){
  /* """ + MARK + """: a direction is not "get me out of here", it is "go that
     way". So the overlook drops AND the hold he is already making stands --
     swallowing the press would make the first step out of every vista dead,
     which is the same class of not-working-button he reported on STANDING. */
  try{ if(typeof vistaBail==='function') vistaBail(); }catch(_e){}
  held=di; pend=di; heldBeats=0; }"""

EDITS = [
    (BAIL_ANCHOR, BAIL, 'vistaBail(), the one guard'),
    (MODE_OLD, MODE_NEW, 'DROP IN comes back off the rim'),
    (FIT_OLD, FIT_NEW, 'WHOLE MAP comes back off the rim'),
    (PAD_OLD, PAD_NEW, 'and a direction brings him back and walks'),
]


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: every control already leaves the vista')
        return
    if '__THE_VISTA_LETS_YOU_LEAVE__' not in s:
        sys.exit('FAIL: run bohemia_the_vista_lets_you_leave_patch.py first')
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
