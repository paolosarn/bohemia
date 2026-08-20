#!/usr/bin/env python3
"""
BOHEMIA CITY STALE-CARD PATCH -- the card stayed open on somebody who was no
longer there. (8/20/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md
Gate: gates/faction_arc_gate.js

REUSE CHECK (REUSE-FIRST): cooks nothing and builds no mechanism. ctClose()
already exists and already does exactly the right thing; this calls it in the one
place that was returning instead.

--------------------------------------------------------------------------
WHAT IT DOES, MEASURED ON THE REAL SURFACE
--------------------------------------------------------------------------
    day 1   me [10246,2268]  them [10245,2268]  adjacent TRUE   card VISIBLE
    day 2   me [10293,2248]  them [10245,2268]  adjacent FALSE  card VISIBLE

Waking up moves the PLAYER. The person stays where they live. So after any
day rollover the person card is open on somebody forty cells away -- with their
name, their outfit, their terms, and BUTTONS THAT STILL FIRE against the old fid.

    function ctOpen(){
      var p=ctAdjacent(); if(!p) return;      <-- returns, leaving the old card up
      CT_OPEN=p; ctDraw();

ctClose() hides the card and clears CT_OPEN. The early return does neither, so
every redraw path that runs while nobody is adjacent leaves the previous person's
card standing with live controls.

THIS IS THE SAME FAMILY AS THE 8/18 WALL: a control on screen that does not do
what the screen says it does. There the button could not move anything; here it
moves the WRONG PERSON'S standing.

--------------------------------------------------------------------------
THE FIX IS ONE LINE AND IT IS NOT A NEW RULE
--------------------------------------------------------------------------
If there is nobody to show, close the card. Not "return and hope somebody closes
it later" -- there is no later, because the thing that would have closed it is
this function.

HOW IT WAS FOUND, which is the argument for the gate it ships with: the faction
arc gate walked the whole journey as one player for the first time, and the
second day of the walk did not behave. Nine layer gates were green over this,
because no layer is wrong -- the card is right, the organ is right, the button is
right, and they are attached to somebody who left.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_STALECARD__'

OLD = """function ctOpen(){
  CT_TERMS_OPEN = false;   /* __CITY_CARDFOLD__: each card opens folded */
  var p=ctAdjacent(); if(!p) return;"""
NEW = """function ctOpen(){
  CT_TERMS_OPEN = false;   /* __CITY_CARDFOLD__: each card opens folded */
  /* """ + MARKER + """ -- IF THERE IS NOBODY TO SHOW, CLOSE IT.
     This used to `return`, which left the PREVIOUS person's card standing --
     their name, their outfit, their terms, and buttons that still fired against
     the old fid. Measured: waking up moves the PLAYER (day 1 me [10246,2268],
     day 2 me [10293,2248]) while the person stays where they live, so after any
     day rollover the card was open on somebody forty cells away.
     Same family as the 8/18 wall: a control on screen that does not do what the
     screen says. There it could not move anything; here it moved the WRONG
     PERSON'S standing. There is no "somebody will close it later" -- this
     function IS the later. */
  var p=ctAdjacent(); if(!p){ ctClose(); return; }"""


# ---- and the bigger half: WALKING AWAY never closed it either --------------
# ctVerb() already runs on EVERY render (render is wrapped to call it), and it
# early-returns the moment CT_OPEN is set -- so it manages the TALK button and
# never once asks whether the person whose card is open is still there. The card
# is opened by TALK and closed ONLY by the GO button. Measured: open somebody's
# card and walk the whole valley, and it stays up the entire way with live
# buttons pointed at somebody you cannot see any more.
# This is the one place that already runs on movement, so it is where the check
# belongs. No new hook, no new listener.
OLD_VERB = """function ctVerb(){
  var b=document.getElementById('cttalk'); if(!b) return;
  if(CT_OPEN || MODE!=='human'){ b.style.display='none'; return; }"""
NEW_VERB = """function ctVerb(){
  var b=document.getElementById('cttalk'); if(!b) return;
  /* """ + MARKER + """ -- YOU CANNOT TALK TO SOMEBODY YOU HAVE WALKED AWAY FROM.
     This ran on every render and never asked whether the open card's person was
     still next to you, so the card was opened by TALK and closed ONLY by GO: you
     could walk the entire valley with somebody's card up and their buttons live.
     This is the one place that already runs on movement, so the check belongs
     here -- no new hook, no new listener. */
  if(CT_OPEN && MODE==='human' && !ctAdjacent()){ ctClose(); return; }
  if(CT_OPEN || MODE!=='human'){ b.style.display='none'; return; }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((OLD, NEW, "ctOpen's adjacency guard"),
                           (OLD_VERB, NEW_VERB, "ctVerb's per-render check")):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY STALECARD: no adjacent person means the card closes, not lingers')


if __name__ == '__main__':
    main()
