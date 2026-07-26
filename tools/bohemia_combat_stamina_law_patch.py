#!/usr/bin/env python3
"""BOHEMIA - COMBAT v72: STAMINA NEVER COSTS A TURN. And the rings halve again.

Paolo 7/26: "the thing I had you turn the opacity down for, make it 50% of what
it is right now. And you have to understand that the way the strategy is gonna
work in this game, it's gonna be fun -- like when you sprint and use stamina
points, it doesn't consume a turn, bro."

1. THE RINGS: another 50%. They now sit at 6.25% of the alpha they shipped with,
   a sixteenth. He approved the shape and the motion, so nothing else moves.

2. STAMINA IS THE FREE-ACTION ECONOMY, AND SPRINT WAS BREAKING IT.
   This is a law he already had, and my own v67 broke it while claiming to
   respect it. The constant right below the sprint code has said since V54, in
   his words: "stamina actions DON'T end your turn". Every stamina verb honoured
   it -- suppress, dash, vault are all free actions -- except SPRINT, which
   charged a pip in v67 AND still ended the turn. That is the worst of both: you
   pay the currency and lose the turn anyway, so there is no reason to ever
   press it. THE STRATEGY IS THE POINT: stamina buys you MOVEMENT INSIDE YOUR
   TURN, and the fun is in the chain.

   SPRINT now ends nothing. It keeps its full risk instead: where DASH takes a
   half-strength crack from anyone holding a bead (mobExposeFire 0.5), SPRINT
   eats the FULL one (1.0), because you crossed two tiles in the open standing
   up. That is the real difference between them, and it is now the ONLY
   difference that matters:

     SPRINT  2 tiles - 1 pip  - FULL exposure   - turn keeps going
     DASH    2 tiles - 2 pips - HALF exposure, breaks their locks - turn keeps going
     VAULT   over low cover - 1 pip - reduced exposure, new angle - turn keeps going

   Cheap and reckless, or expensive and clean. Your turn survives either way,
   and your stamina is what runs out.

REUSE CHECK: no assets cooked (an alpha multiplier and a control-flow change;
the full-exposure path reuses the shipped mobExposeFire the other mobility verbs
already ride).

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_stamina_law_patch.py
Gate:  node gates/combat_lab_gate.js   (section 12)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V72 STAMINA NEVER COSTS A TURN'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # -- 1. the rings halve again -------------------------------------------
    demo = sub1(demo,
        "const _a=(_hero?0.42:0.24)*(0.35+0.65*_f)*0.125;",
        "const _a=(_hero?0.42:0.24)*(0.35+0.65*_f)*0.0625;   /* V72 (Paolo): 50% of the last pass, so a sixteenth of where it started */",
        'ring alpha halve again')
    demo = sub1(demo,
        "+(_snap*0.10625)+')';",
        "+(_snap*0.053125)+')';   /* V72: the snap halves with it */",
        'snap alpha halve again')

    # -- 2. sprint stops eating the turn ------------------------------------
    demo = sub1(demo,
        """  if(_sprinting){ setRead('SPRINTED '+['N','NE','E','SE','S','SW','W','NW'][d],'two tiles, fully exposed — return fire incoming','#e8593a');
    endTurnReturn(true); }   /* V44: a sprint breaks cover for real, same cost as popping to fire */""",
        """  /* ===== V72 STAMINA NEVER COSTS A TURN (Paolo 7/26) =====================
     "the way the strategy is gonna work in this game, it's gonna be fun --
     like when you sprint and use stamina points, it doesn't consume a turn."
     He already had this law: the STAM_MAX line right below has read "stamina
     actions DON'T end your turn" since V54, and suppress, dash and vault all
     honour it. SPRINT did not -- v67 charged it a pip AND still ended the turn,
     which is the worst of both and means you would never press it.
     It ends nothing now. It keeps the RISK instead: a sprint eats the FULL
     exposure crack (1.0) where a dash takes half, because you crossed two tiles
     upright in the open. Cheap and reckless vs expensive and clean, and your
     turn survives either way -- what runs out is stamina. */
  if(_sprinting){ setRead('SPRINTED '+['N','NE','E','SE','S','SW','W','NW'][d],'two tiles in the open — 1 pip, NO turn spent, they get a full crack at you','#e8593a');
    if(mobExposeFire(1.0))return;
    renderBoard(); updGap(); return; }   /* V72: NO turn end -- stamina is the cost */""",
        'sprint keeps the turn')

    # the ring label must stop promising a turn cost
    demo = sub1(demo,
        "const on=G.sprintArm?'SPRINT \\u00b7 2 TILES \\u00b7 ENDS TURN':(G.dashArm?'DASH \\u00b7 2 TILES \\u00b7 FREE MOVE':'');",
        "const on=G.sprintArm?'SPRINT \\u00b7 2 TILES \\u00b7 1 PIP \\u00b7 FULLY EXPOSED':(G.dashArm?'DASH \\u00b7 2 TILES \\u00b7 2 PIPS \\u00b7 BREAKS LOCKS':'');   /* V72: neither costs a turn; the difference is the risk and the price */",
        'ring label')

    demo = sub1(demo,
        "G.sprintArm?'next ring tap runs TWO tiles \u2014 1 pip, and it ENDS YOUR TURN in the open'",
        "G.sprintArm?'next ring tap runs TWO tiles \u2014 1 pip, your turn KEEPS going, and they get a full crack at you'",
        'sprint button readout')

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
        print('  demo: re-embedded (%d bytes, +%d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
