#!/usr/bin/env python3
"""BOHEMIA - COMBAT v95: THE KILLSHOT ALLOWANCE. HIS RULE, BUILT.

Paolo: "i didnt notice my rule where whatever how many killshots u have after it
becomes extremely hard implemented i didnt see that."

He is right. It was not implemented. It is now.

--- FIRST, A CORRECTION I OWE HIM ----------------------------------------
The thinking doc I wrote on 7/27 (records/BOHEMIA_COMBAT_THE_KILLSHOT_ALLOWANCE_
7_27_26.md) said two things that are FALSE, and the build is different because
of it:

  I SAID: "THE CHAIN IS UNLIMITED... you shoot until you miss."
  TRUTH:  enterAim already stops the chain dead:
            if(G._chainN>wpnCap()){ setRead('CHAIN SPENT', ...); return endTurnReturn(); }

  I SAID: "there is no per-turn shot counter anywhere in the file."
  TRUTH:  G._chainN is exactly that, it has existed since v17, the read line has
          been printing "SHOT 1/2" the whole time, and there is a settings button
          labelled "KILLSHOTS/TURN" that cycles G.chainSkill from 1 to 8.

I searched for the mechanic by its absence instead of by its name. THE THING HE
ASKED FOR WAS 90% BUILT ALREADY. What was missing is the only part he actually
cared about: past the number, the game STOPS you instead of letting you push.

--- SO THE REAL CHANGE IS SMALL, WHICH IS WHY IT IS RIGHT -----------------
BEFORE: a WALL. Shot 3 of 2 does not happen. "CHAIN SPENT", turn over. There is
no decision anywhere in it: the game ends your turn for you.

AFTER: a RAMP. Shot 3 of 2 happens, at an EXTREMELY HARD dial. So every turn now
asks a question it never asked: bank the turn clean, or take a dial you probably
miss? Push-your-luck, on every turn, and the stake is the turn itself.

That is the whole idea, and it needed one wall taken down, not a new system.

--- THE THREE RULINGS, AND WHAT I DID WITH THEM ---------------------------
I asked for three and he answered by saying it is HIS RULE and it is missing. So:

1. FLOOR OR REPLACE (I recommended FLOOR, he did not contest it): FLOOR.
     pkgDiff = max(rangeDial, rampDial)
   Closing to point blank still pulls the dial easier, exactly as he ruled on
   7/27, but it can never fully cancel the ramp. Closing the distance becomes
   HOW YOU AFFORD THE EXTRA SHOT, which knits this into yesterday's rule instead
   of overwriting it.

2. THE ALLOWANCE PER SETTING: *** NOT INVENTED. *** MECHANISM-MINE /
   CONTENTS-PAOLO'S says the table ships EMPTY except what he ruled.
   CHAIN_ALLOWANCE_BY_DIFF ships [null,null,null,null,null] and every null falls
   back to G.chainSkill, HIS OWN existing KILLSHOTS/TURN dial, which already
   defaults to 2 and already matches the one number he did give
   ("on easy... I'm guaranteed for the most part like two easy shots").
   The moment he names five numbers they go in the table and nothing else moves.

3. THE RAMP SHAPE: he said "extremely hard", so it is extreme immediately.
   First shot past the allowance is V.HARD (3), the next is BOHEMIAN (4), and it
   stays there because 4 is the top of the dial. Two constants, both dials.

--- THE READ, BECAUSE "I DIDN'T SEE THAT" IS THE ACTUAL COMPLAINT ---------
The mechanic being invisible is the mistake this lane has made three times
running, and this time he said it out loud about a feature that was PARTLY there.

  within the allowance:  SHOT 2 OF 2
  past it:               SHOT 3 OF 2 - PAST YOUR ALLOWANCE  (in the warning red)

and the aim headline says PUSHING instead of CHAIN, with the dial name after it,
so the tier he is now being asked to hit is on screen before he presses.

--- WHAT STAYS A WALL ----------------------------------------------------
WEAPON_CAP is still a hard ceiling and is NOT ramped: pistol 8, smg 2, shotgun 2,
rifle 1. A gun physically running out is not a difficulty question, and it is the
weapon identity Paolo already has. So the pistol is the chain weapon (allowance
2, six pushable shots behind it) and the rifle chains not at all. The ramp lives
between the allowance and the weapon's ceiling.

REUSE CHECK: no art or audio is cooked, read or written. This is pure mechanic:
it reuses G._chainN, G.chainSkill, WEAPON_CAP, pkgDiff and the existing read
line, all of which already existed. Nothing new is drawn.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_killshot_allowance_patch.py
Gate:  node gates/combat_lab_gate.js   (section 31)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V95 THE KILLSHOT ALLOWANCE'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # ---- the allowance, the ramp, and the empty table ----------------------
    demo = subN(demo,
        "function wpnCap(){ return Math.max(1,Math.min(G.chainSkill||2, WEAPON_CAP[WEAPON]||8)); }   /* V62 */",
        "/* ===== V95 THE KILLSHOT ALLOWANCE ==================================\n"
        "   Paolo: \"i didnt notice my rule where whatever how many killshots u have\n"
        "   after it becomes extremely hard implemented i didnt see that.\"\n"
        "   It was a WALL. Shot 3 of 2 simply did not happen: 'CHAIN SPENT', turn\n"
        "   over, no decision anywhere in it -- the game ended your turn FOR you.\n"
        "   Now it is a RAMP. Shot 3 of 2 happens, at a dial you probably miss. So\n"
        "   every turn asks a question it never asked before: bank it clean, or push?\n"
        "   THE STAKE IS THE TURN ITSELF, which is why this needs no new currency. */\n"
        "/* CONTENTS-PAOLO'S: the per-difficulty allowance ships EMPTY. Every null\n"
        "   falls back to G.chainSkill -- HIS existing KILLSHOTS/TURN dial, already\n"
        "   defaulting to 2, which is the one number he actually gave (\"on easy...\n"
        "   I'm guaranteed for the most part like two easy shots\"). When he names\n"
        "   five numbers they go here and nothing else moves.\n"
        "     index = difficulty (0 EASY .. 4 BOHEMIAN) */\n"
        "const CHAIN_ALLOWANCE_BY_DIFF=[null,null,null,null,null];\n"
        "/* \"extremely hard\" -- his word, so it is extreme immediately, not a gentle\n"
        "   climb. First shot past the allowance is V.HARD, the next is BOHEMIAN, and\n"
        "   4 is the top of the dial so it stays there. Both are dials. */\n"
        "const CHAIN_RAMP_BASE=3, CHAIN_RAMP_STEP=1;\n"
        "/* the weapon's ceiling is NOT ramped and never was a difficulty question: a\n"
        "   gun running out is physics. This is what keeps the pistol the chain weapon\n"
        "   (allowance 2, six pushable shots behind it) and the rifle a one-shot. */\n"
        "function chainWall(){ return Math.max(1, WEAPON_CAP[WEAPON]||8); }\n"
        "function chainAllowance(){ const t=CHAIN_ALLOWANCE_BY_DIFF[G.userPkg|0];\n"
        "  return Math.max(1,Math.min(t!=null?t:(G.chainSkill||2), chainWall())); }\n"
        "function chainOver(){ return Math.max(0,(G._chainN||1)-chainAllowance()); }\n"
        "/* the ramp dial for the shot you are ON. 0 means the ramp is not running, and\n"
        "   0 is also EASY, which is exactly right: below the allowance the ramp adds\n"
        "   nothing because max(range,0) is just range. */\n"
        "function chainRampDial(){ const o=chainOver();\n"
        "  return o<=0?0:Math.max(0,Math.min(4,CHAIN_RAMP_BASE+(o-1)*CHAIN_RAMP_STEP)); }\n"
        "function wpnCap(){ return chainAllowance(); }   /* V62, V95: the cap IS the allowance now */",
        'the allowance, the ramp and the empty table')

    # ---- the wall comes down -----------------------------------------------
    demo = subN(demo,
        "  else { G._chainN=(G._chainN||1)+1;\n"
        "    if(G._chainN>wpnCap()){ setRead('CHAIN SPENT','the '+WEAPON+' caps you at '+wpnCap()+' this turn','#8a7d66'); return endTurnReturn(); } }   /* V53/V62: weapon-gated chain */",
        "  else { G._chainN=(G._chainN||1)+1;\n"
        "    /* V95: THE WALL IS GONE. Past your allowance the shot still happens, it\n"
        "       just gets extremely hard (see chainRampDial). The only true stop left\n"
        "       is the weapon physically having nothing more this turn. */\n"
        "    if(G._chainN>chainWall()){ setRead('OUT','the '+WEAPON+' has nothing left this turn','#8a7d66'); return endTurnReturn(); } }",
        'the chain wall comes down')

    # ---- FLOOR: the ramp can never be cancelled by closing distance ---------
    demo = subN(demo,
        "      G.pkgDiff=Math.max(0,Math.min(4,distPkg(tgt)+(tgt.elite?1:0)+(tgt.gcov?1:-1)+(G.handPeek?1:0))); } }",
        "      /* V95 THE RAMP IS A FLOOR, NOT A REPLACEMENT (his call, my recommendation,\n"
        "         uncontested). Point blank still pulls the dial easier exactly as he ruled\n"
        "         on 7/27, but it can never fully cancel the ramp -- so closing the distance\n"
        "         becomes HOW YOU AFFORD THE EXTRA SHOT instead of a way to delete the cost. */\n"
        "      G.pkgDiff=Math.max(0,Math.min(4,Math.max(\n"
        "        distPkg(tgt)+(tgt.elite?1:0)+(tgt.gcov?1:-1)+(G.handPeek?1:0),\n"
        "        chainRampDial()))); } }",
        'the ramp floors the dial')

    # ---- the headline says you are pushing ---------------------------------
    demo = subN(demo,
        "  { const tg=G.e[G.fireTarget]; setRead(isChain?'CHAIN':'AIM', (tg&&tg.elite?'ELITE · ':'')+(tg?rangeTier(tg)+' · ':'')+pkgName(G.pkgDiff)+' DIAL · '+G.pat.toUpperCase(), (tg&&tg.elite)?'#e8593a':(tg?rangeCol(tg):'#e89a4a')); } renderBoard(); }",
        "  /* V95: \"i didnt see that\" is the actual complaint, so the moment you are past\n"
        "     the allowance the headline stops saying CHAIN and says PUSHING, in the\n"
        "     warning red, with the tier you are now being asked to hit right after it. */\n"
        "  { const tg=G.e[G.fireTarget]; const _ov=chainOver()>0;\n"
        "    setRead(_ov?'PUSHING':(isChain?'CHAIN':'AIM'),\n"
        "      (_ov?'SHOT '+(G._chainN||1)+' OF '+chainAllowance()+' · ':'')\n"
        "      +(tg&&tg.elite?'ELITE · ':'')+(tg?rangeTier(tg)+' · ':'')+pkgName(G.pkgDiff)+' DIAL · '+G.pat.toUpperCase(),\n"
        "      _ov?'#e8593a':((tg&&tg.elite)?'#e8593a':(tg?rangeCol(tg):'#e89a4a'))); } renderBoard(); }",
        'the headline says PUSHING')

    # ---- and the range read counts it out in words -------------------------
    demo = subN(demo,
        "' · <b style=\"color:#8fe89a\">SHOT '+(G._chainN||1)+'/'+wpnCap()+'</b>'; }",
        "' · '+(chainOver()>0\n"
        "          ? '<b style=\"color:#e8593a\">SHOT '+(G._chainN||1)+' OF '+chainAllowance()+' · PAST YOUR ALLOWANCE</b>'\n"
        "          : '<b style=\"color:#8fe89a\">SHOT '+(G._chainN||1)+' OF '+chainAllowance()+'</b>'); }",
        'the read counts the allowance out')

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
