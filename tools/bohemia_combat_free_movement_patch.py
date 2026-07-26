#!/usr/bin/env python3
"""BOHEMIA - COMBAT v73: STAMINA MOVEMENT IS FREE *AND* SAFE (Paolo 7/26/26).

Paolo: "you don't understand -- when I press shift it's almost like a run. It's
almost like I get free movement and I can't get shot at that turn. What don't you
understand? That's what Rogue Fable IV does. I can use up all my action stamina
points in my turn and it doesn't end my turn, meaning I DON'T GET SHOT after I
run to a location."

v72 got half of it and left the half that mattered. It stopped sprint from ending
the turn, then kept `mobExposeFire(1.0)` -- so you still ate a volley the instant
you arrived. From the player's chair that is indistinguishable from being shot for
moving, which is exactly what he said was wrong.

THE RULING, in full: a stamina move costs stamina AND NOTHING ELSE. No turn, no
return fire, no free crack, no chip damage. You spend pips, you reposition, and
the enemy does not get to answer until you actually take your turn's action.

So all three `mobExposeFire` calls are GONE:
  SPRINT  2 tiles           - 1 pip  - no turn, NO return fire
  DASH    2 tiles           - 2 pips - no turn, NO return fire, breaks their locks
  VAULT   over low cover    - 1 pip  - no turn, NO return fire, new angle

Spend all three pips crossing the board if you want. Nobody shoots. The cost of
mobility is that you arrive with an empty stamina bar and no options left, and
the enemy's two-turn red line is still ticking -- that is the tension, not a
tax on moving.

mobExposeFire() itself is kept but goes UNUSED by the mobility verbs, and its
head comment is corrected so nobody reads "mobility isn't free" and re-adds a
crack. It stays because a future non-stamina verb may want it.

Related and NOT touched: your one real ACTION (pop and shoot) still ends the turn
and still eats the volley. That is the trade the whole fight is built on.

REUSE CHECK: no assets cooked (three call sites removed, three readouts and one
comment rewritten).

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_free_movement_patch.py
Gate:  node gates/combat_lab_gate.js   (section 12)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V73 FREE AND SAFE'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # -- the law, written where the next person will read it ----------------
    demo = sub1(demo,
        "function mobExposeFire(mult){   /* V54: mobility isn't free -- guns with a bead and a clean line get ONE reduced crack while you move */",
        """/* ===== V73 FREE AND SAFE (Paolo 7/26) ===================================
   "when I press shift it's almost like a run... I get free movement and I CAN'T
   GET SHOT AT that turn... I can use up all my action stamina points in my turn
   and it doesn't end my turn, meaning I DON'T GET SHOT after I run to a
   location. That's what Rogue Fable IV does."
   A STAMINA MOVE COSTS STAMINA AND NOTHING ELSE. No turn, no return fire, no
   free crack, no chip damage. v72 stopped sprint ending the turn but left the
   volley in, and from the player's chair eating a volley on arrival IS being
   shot for moving.
   This function is now UNUSED BY THE MOBILITY VERBS. It stays for a future
   non-stamina verb; the old "mobility isn't free" note is deleted so nobody
   reads it and puts a crack back on a stamina move. */
function mobExposeFire(mult){""",
        'mobExposeFire head')

    # -- SPRINT: no volley --------------------------------------------------
    demo = sub1(demo,
        """  if(_sprinting){ setRead('SPRINTED '+['N','NE','E','SE','S','SW','W','NW'][d],'two tiles in the open — 1 pip, NO turn spent, they get a full crack at you','#e8593a');
    if(mobExposeFire(1.0))return;
    renderBoard(); updGap(); return; }   /* V72: NO turn end -- stamina is the cost */""",
        """  if(_sprinting){ setRead('SPRINTED '+['N','NE','E','SE','S','SW','W','NW'][d],'two tiles — 1 pip, no turn spent, nobody gets a shot','#8fe89a');
    renderBoard(); updGap(); return; }   /* V73 FREE AND SAFE: no turn end, NO return fire */""",
        'sprint free and safe')

    # -- DASH: no volley ----------------------------------------------------
    demo = sub1(demo,
        "  if(mobExposeFire(0.5))return;\n  renderBoard(); updGap(); }   /* NO turn end */",
        "  renderBoard(); updGap(); }   /* V73 FREE AND SAFE: no turn end, NO return fire */",
        'dash free and safe')

    # -- VAULT: no volley ---------------------------------------------------
    demo = sub1(demo,
        "  if(mobExposeFire(0.55))return;\n  renderBoard(); updGap(); }   /* NO turn end */",
        "  renderBoard(); updGap(); }   /* V73 FREE AND SAFE: no turn end, NO return fire */",
        'vault free and safe')

    # -- the readouts stop threatening him ----------------------------------
    demo = sub1(demo,
        "const on=G.sprintArm?'SPRINT \\u00b7 2 TILES \\u00b7 1 PIP \\u00b7 FULLY EXPOSED':(G.dashArm?'DASH \\u00b7 2 TILES \\u00b7 2 PIPS \\u00b7 BREAKS LOCKS':'');",
        "const on=G.sprintArm?'SPRINT \\u00b7 2 TILES \\u00b7 1 PIP \\u00b7 FREE MOVE':(G.dashArm?'DASH \\u00b7 2 TILES \\u00b7 2 PIPS \\u00b7 BREAKS LOCKS':'');   /* V73: both are free AND safe */",
        'ring label')

    demo = sub1(demo,
        "1 pip, your turn KEEPS going, and they get a full crack at you'",
        "1 pip, your turn KEEPS going, and nobody shoots'",
        'sprint button readout')

    demo = sub1(demo,
        "+' \u2014 2 tiles, exposed mid-run','#c0d0e8');",
        "+' \u2014 2 tiles, 2 pips, no turn spent, nobody shoots','#c0d0e8');",
        'dash readout')

    demo = sub1(demo,
        "new angle, exposed in the air','#c0d0e8');",
        "new angle, 1 pip, no turn spent, nobody shoots','#c0d0e8');",
        'vault readout')

    demo = sub1(demo,
        "  setRead(G.dashArm?'DASH ARMED':'DASH OFF', G.dashArm?'tap a direction on the ring — 2 tiles, 2 pips, your turn KEEPS going':'dash disarmed','#c0d0e8'); }",
        "  setRead(G.dashArm?'DASH ARMED':'DASH OFF', G.dashArm?'tap a direction on the ring — 2 tiles, 2 pips, your turn KEEPS going, nobody shoots':'dash disarmed','#c0d0e8'); }",
        'dash arm readout')

    return demo


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  demo: re-embedded (%d bytes, %+d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
