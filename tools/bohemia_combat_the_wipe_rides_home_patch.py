#!/usr/bin/env python3
"""
BOHEMIA - THE WIPE RIDES HOME (COMBAT 10/24/26, row [the loss is understood], rule 143(e)).

PAOLO 10/24, LOCKED: 'if everyone in the party dies or gets down... you're still where you were before you entered the
battle and it just feels clunky... spawn in the nearest town... a mini side quest, because literally your whole squad got
wiped, that's pretty important'.

The rebuilt fight (slices/BOHEMIA_FIGHT.html) now ends a wipe with BOHEMIA_FIGHT_OVER {wipe:true, wipeInfo} and, right
after it, BOHEMIA_COMBAT_END {newFight:true, wipe:true, wipeInfo, fates, ...} so RUN can wake him in the nearest town and
start the mini side quest. MEASURED FIRST: combatMsgIn's BOHEMIA_COMBAT_END branch is the frozen fight's settle and calls
cityFightHome at once, which would take him off the recap before its four beats AND leave the rebuilt fight's frame up
(nfHome returns early once CITYFIGHT is false).

WHAT THIS PATCH PUTS IN THE ALPHA (the demo is cut from it by tools/bohemia_cut_the_demo.js): one marked guard at the top of
that branch, COMBAT's for this alone: an end message from the rebuilt fight's own frame (newFight) never goes home itself;
its wipe and its facts ride NF.over, which nfHome already hands to cityFightHome, which already posts it to the map as
BOHEMIA_CITY_COMBAT_END {outcome}. So outcome.wipe === true and outcome.wipeInfo reach RUN's map on the way home, after the
recap, through the one door home there is. RUN keeps everything else; the nearest town and the side quest are RUN's.

Idempotent: the guard sits between markers and is replaced on a re-run.
  python3 tools/bohemia_combat_the_wipe_rides_home_patch.py
then cut the demo: node tools/bohemia_cut_the_demo.js
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
ANCHOR = "  if(d.type==='BOHEMIA_COMBAT_END'){\n"
OPEN = "    /* ===== __THE_WIPE_RIDES_HOME__ (COMBAT 10/24, row [the loss is understood], rule 143(e)) ====="
CLOSE = "    /* ===== /__THE_WIPE_RIDES_HOME__ ===== */\n"
BLOCK = OPEN + r'''
       The rebuilt fight's end message (newFight) never takes him home itself: the recap keeps its beats and nfHome keeps
       the one way home. Its wipe and facts ride NF.over into cityFightHome's outcome, so the map hears
       BOHEMIA_CITY_COMBAT_END {outcome:{..., wipe:true, wipeInfo}} as he lands: RUN's nearest town and side quest read it.
       The patch: tools/bohemia_combat_the_wipe_rides_home_patch.py. */
    if(d.newFight){ try{ if(window.NF&&NF.over){ NF.over.wipe=!!d.wipe; NF.over.wipeInfo=d.wipeInfo||null; NF.over.fates=d.fates||[]; G.lastEncounter=NF.over; }
      else if(window.NF){ NF.endEarly=d; } }catch(_e){} return true; }
''' + CLOSE


def main():
    s = open(ALPHA, encoding='utf-8').read()
    if OPEN in s:
        a = s.index(OPEN); b = s.index(CLOSE, a) + len(CLOSE)
        s = s[:a] + BLOCK + s[b:]
    else:
        if s.count(ANCHOR) != 1:
            sys.exit('anchor not found exactly once: ' + str(s.count(ANCHOR)))
        s = s.replace(ANCHOR, ANCHOR + BLOCK)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('the wipe rides home: the guard is in the alpha; now cut the demo')


if __name__ == '__main__':
    main()
