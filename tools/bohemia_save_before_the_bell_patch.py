#!/usr/bin/env python3
"""
V215 -- A SAVE EXISTS AT THE BELL  (COMBAT lane, [prefight save] BB-SAVE-BEFORE-THE-BELL)

THE ROW: "*** THE GAME HE NAMED AUTOSAVES BEFORE EVERY BATTLE. OURS IS COVERED BY
ACCIDENT. *** In Battle Brothers the fight is the moment worth protecting and it is
protected ON PURPOSE: an autosave before every battle, and another when you leave a
town. MEASURED HERE: CITYSAVE.save fires only when the city posts state, and NOTHING
fires it at the moment combat opens. Opening the fight blurs the city iframe, which
fires flushState, so in practice it is probably saved -- BY A SIDE EFFECT, NOT BY
INTENT. A protection nobody wrote down is a protection nobody is maintaining, and it
disappears the first time the frame stops blurring."
SHIP TEST, the row's own: "a save exists at the bell whether or not the frame blurs."

*** MEASURED TWICE BEFORE WRITING A LINE, AND IT IS WORSE THAN THE ROW THOUGHT. ***

STATICALLY, the row is exactly right: flushState has FOUR callers in the whole walked
city and all four are lifecycle events -- pagehide, freeze, blur, visibilitychange.
Nothing calls it at the bell. There are two snapshot posts in the file: the debounced
one and flushState's.

ON THE REAL SURFACE, driving a fight through the shipped door and counting the save
traffic that actually reaches the shell:
      before the bell            0 saves, 0 blurs
      1.5 seconds after the bell 0 saves, 0 blurs
      5.5 seconds after the bell 0 saves, 0 blurs
*** NO SAVE LANDED AT THE BELL AT ALL, AND NO BLUR EITHER. *** The accidental
protection the row calls "probably saved" did not fire even once, because the frame
never blurred. Stated honestly: a headless browser may not deliver blur the way a
phone does, so this is not proof that every player loses the moment -- IT IS PROOF
THAT THE PROTECTION DEPENDS ON AN EVENT NOBODY PROMISED, which is the row's whole
argument and is why it stops being an argument and becomes one line of code.

THE BUILD IS ONE CALL AT THE ONE DOOR, and it is deliberately at the door rather than
in the four entries: V205 routed every way into a fight through cityHandOver, and
V207 and V211 already stamp the world and the plate there for exactly this reason --
so an entry built after this one is protected without knowing this exists.

ORDER MATTERS AND IT IS THE RIGHT WAY ROUND: flushState posts the snapshot to the
shell BEFORE the encounter message goes out, and postMessage from one window is
ordered, so the world as it stood BEFORE the fight is what gets written. The snapshot
is the same one the debounced path writes (__ONE_SNAPSHOT__), so there is no second
shape of save and nothing new to keep in step.

AND IT IS IDEMPOTENT BY THE FILE'S OWN DESIGN: flushState clears the debounce timer
and posts once, and its own comment says firing three times costs nothing. A bell that
also blurs now saves twice, which is free and correct.

NOTHING ELSE MOVES: no new save format, no new key, no new timer, no change to what a
snapshot contains, and nothing about the fight. This is the protection being written
down instead of being hoped for.

NO DAMAGE BEFORE THE DIAL: nothing here touches a number.
"""
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__SAVE_BEFORE_THE_BELL__'

OLD = """function cityHandOver(msg, skin){
  try{ window.__HANDOVERS=(window.__HANDOVERS||0)+1; }catch(_e){}"""

ANCHOR = "function cityHandOver(msg, skin){"

NEW = """function cityHandOver(msg, skin){
  /* ===== V215 __SAVE_BEFORE_THE_BELL__ -- A SAVE EXISTS AT THE BELL ==========
     BB-SAVE-BEFORE-THE-BELL. The game he named autosaves before EVERY battle, on
     purpose. Ours was covered by accident: CITYSAVE.save only fires when the city
     posts state, nothing fired it when combat opened, and the protection came from
     the frame happening to blur.
     MEASURED ON THE REAL SURFACE before this line existed, counting the save traffic
     that actually reaches the shell while a fight opened through this very door:
     ZERO SAVES AND ZERO BLURS, at 1.5 seconds and again at 5.5. The accidental
     protection did not fire at all. A protection nobody wrote down is one nobody is
     maintaining, and it disappears the first time the frame stops blurring.
     HERE, AT THE ONE DOOR, because V205 routed all four ways into a fight through
     this function and V207 and V211 already stamp the world and the plate here -- so
     an entry built after this one is protected without knowing this exists.
     BEFORE the encounter goes out, never after: postMessage from one window is
     ordered, so the world AS IT STOOD BEFORE THE FIGHT is what gets written. It is
     the same snapshot the debounced path writes, and flushState is idempotent by its
     own design, so a bell that also blurs simply saves twice and that is free. */
  try{ if(typeof flushState==='function') flushState(); }catch(_e){}
  /* ===== /V215 __SAVE_BEFORE_THE_BELL__ ===== */"""


def main():
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('  the bell already saves')
        return
    if s.count(ANCHOR) != 1:
        sys.exit('ANCHOR city/cityHandOver: expected 1, found %d' % s.count(ANCHOR))
    s = s.replace(ANCHOR, NEW, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('V215 applied to', CITY)


if __name__ == '__main__':
    main()
