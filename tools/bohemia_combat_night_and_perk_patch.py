#!/usr/bin/env python3
"""BOHEMIA - COMBAT v98: TWO RULINGS. THE DARK SHRINKS THE RANGE, AND THE
ALLOWANCE IS A PERK.

Paolo, 7/29, two calls in one message:

  1. "i really like this nice research lets do it"  (on the night proposal)
  2. "well the kilshot how many u get before its incredibly difficult is on a
      slider unrelated to difficulty but to perks you get in the game so."

=========================================================================
RULING 1: THE DARK SHRINKS THE RANGE. NOT THE ACCURACY.
=========================================================================
The pitch he approved: a flat accuracy penalty on both sides changes NO
decision, it just makes the fight longer, and that is the tally mistake again.
What makes it a mechanic is that darkness should shrink the range at which
ANYONE shoots well.

THE IMPLEMENTATION IS ONE NUMBER, AND THAT IS NOT A SIMPLIFICATION, IT IS THE
WHOLE ELEGANCE OF IT. Everything about range in this fight already runs through
one function:

    function distT(e){ return clamp01((d - PT_BLANK) / (FAR_TILE - PT_BLANK)); }

and FOUR things read it:
    distPkg(e)      -> MY dial gets harder with distance
    distAccuracy(e) -> THEIR hit chance drops with distance
    rangeTier(e)    -> the words POINT BLANK / MID RANGE / LONG RANGE
    rangeCol(e)     -> the colour those words are printed in

So shrinking FAR_TILE at night does every single thing he asked for at once:

  * BOTH SIDES get worse at range. He asked for "all players and enemies".
  * POINT BLANK IS MATHEMATICALLY UNTOUCHED. distT is 0 for any d <= PT_BLANK
    no matter what FAR_TILE is. Not approximately untouched: exactly, provably,
    zero. So his 7/27 point-blank ruling gets LOUDER after dark instead of taxed.
  * THE READ UPDATES ITSELF FOR FREE. A man who reads MID RANGE at noon reads
    LONG RANGE at night, in the long-range colour, with no new UI at all.
  * LIGHT=TERRITORY STOPS BEING SET DRESSING. 12% of the city is lit and the
    light is owned. If dark shrinks everyone's reach, standing in a lit patch
    means being hittable from across the lot and standing in the dark means they
    have to come to you.

NO new stat, no new number on screen, no second accuracy system to keep in step.

THE NUMBERS ARE DIALS. morning 1.00 (the baseline, nothing changes), dusk 0.72,
night 0.50. At night a man 15 tiles out reads the way a man 26 tiles out reads at
noon. He approved the mechanic, not a magnitude, so these are named constants
sitting in one place for him to move.

AND THE READ SAYS WHY: the range line prints DARK when the multiplier is biting,
so a man who suddenly reads LONG RANGE is explained rather than mysterious.

=========================================================================
RULING 2: THE ALLOWANCE IS A PERK SLIDER, NOT A DIFFICULTY TABLE.
=========================================================================
v95 shipped CHAIN_ALLOWANCE_BY_DIFF, a five-slot per-difficulty table, empty,
falling back to his KILLSHOTS/TURN dial. I built that because his 7/27 words
were "how many killshots you get on your set difficulty".

He has now corrected it: the allowance is **unrelated to difficulty**. It is a
slider driven by the PERKS you earn in the game.

So the table is DELETED, not emptied further. Difficulty no longer touches the
allowance in any way, and the number comes from one place: G.chainSkill, which
is already a slider and already what a card would raise. The settings control now
says KILLSHOTS (PERK) so the reading matches the ruling, and the code says out
loud that difficulty must never be wired back into it.

*** THIS IS WHY MECHANISM-MINE / CONTENTS-PAOLO'S EXISTS. *** The table shipped
EMPTY, so his correction deleted a wire and changed no gameplay. Had I guessed
five numbers into it, this ruling would have silently rebalanced the fight.

REUSE CHECK: no art or audio is cooked, read or written. This is pure mechanic:
distT, FAR_TILE, G.dayPhase and G.chainSkill all already existed. Nothing new is
drawn.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_night_and_perk_patch.py
Gate:  node gates/combat_lab_gate.js   (section 32)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V98 THE DARK SHRINKS THE RANGE'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo
    if 'V95 THE KILLSHOT ALLOWANCE' not in demo:
        sys.exit('FAIL: v95 must be applied first (this corrects its table)')

    # ---- RULING 1: one number, and every range read follows it --------------
    demo = subN(demo,
        "function distT(e){ const d=Math.max(1,e.edist||10); return Math.min(1,Math.max(0,(d-PT_BLANK)/(FAR_TILE-PT_BLANK))); }",
        "/* ===== V98 THE DARK SHRINKS THE RANGE (Paolo 7/29: \"i really like this\n"
        "   nice research lets do it\") ==========================================\n"
        "   NOT an accuracy penalty. A flat penalty on both sides changes no decision\n"
        "   and just makes the fight longer, which is the tally mistake again. Darkness\n"
        "   shrinks the range at which ANYONE shoots well.\n"
        "   It is ONE NUMBER because every range read in this fight already runs through\n"
        "   distT: MY dial (distPkg), THEIR hit chance (distAccuracy), and the words and\n"
        "   colour of the range tier. Shrinking the far end does all of it at once.\n"
        "   *** AND POINT BLANK IS EXACTLY, PROVABLY UNTOUCHED: distT is 0 for any\n"
        "   d <= PT_BLANK whatever the far end is. So his point-blank ruling gets LOUDER\n"
        "   after dark instead of being taxed flat. ***\n"
        "   It also turns LIGHT=TERRITORY into a real map: lit means hittable from across\n"
        "   the lot, dark means they have to come to you.\n"
        "   The numbers are DIALS. He approved the mechanic, not a magnitude. */\n"
        "const NIGHT_RANGE={morning:1.00,dusk:0.72,night:0.50};\n"
        "function rangeMult(){ const m=NIGHT_RANGE[G.dayPhase||'night']; return m==null?1:m; }\n"
        "function farTile(){ return Math.max(PT_BLANK+2, FAR_TILE*rangeMult()); }\n"
        "function isDark(){ return rangeMult()<0.999; }\n"
        "function distT(e){ const d=Math.max(1,e.edist||10); const F=farTile();\n"
        "  return Math.min(1,Math.max(0,(d-PT_BLANK)/(F-PT_BLANK))); }",
        'the dark shrinks the range')

    # ---- and the read says WHY a man suddenly reads long range --------------
    demo = subN(demo,
        "  const _und=underDeck(e)&&!_lv;",
        "  const _und=underDeck(e)&&!_lv;\n"
        "  /* V98: a man who reads LONG RANGE at night when he read MID RANGE at noon is\n"
        "     not a bug, and the line has to say so or it looks like one. */\n"
        "  const _drk=isDark();",
        'the read knows it is dark')

    demo = subN(demo,
        "  r.innerHTML=(_und?'<b style=\"color:#7fa8d8\">UNDER THE DECK</b> <span style=\"color:#5a5040\">·</span> ':'')",
        "  r.innerHTML=(_drk?'<b style=\"color:#6a7fa8\">DARK</b> <span style=\"color:#5a5040\">·</span> ':'')\n"
        "    +(_und?'<b style=\"color:#7fa8d8\">UNDER THE DECK</b> <span style=\"color:#5a5040\">·</span> ':'')",
        'the read says DARK')

    # ---- RULING 2: the difficulty table is deleted, not emptied -------------
    demo = subN(demo,
        "/* CONTENTS-PAOLO'S: the per-difficulty allowance ships EMPTY. Every null\n"
        "   falls back to G.chainSkill -- HIS existing KILLSHOTS/TURN dial, already\n"
        "   defaulting to 2, which is the one number he actually gave (\"on easy...\n"
        "   I'm guaranteed for the most part like two easy shots\"). When he names\n"
        "   five numbers they go here and nothing else moves.\n"
        "     index = difficulty (0 EASY .. 4 BOHEMIAN) */\n"
        "const CHAIN_ALLOWANCE_BY_DIFF=[null,null,null,null,null];",
        "/* ===== V98 THE ALLOWANCE IS A PERK, NOT A DIFFICULTY =================\n"
        "   Paolo 7/29: \"the kilshot how many u get before its incredibly difficult is\n"
        "   on a slider UNRELATED TO DIFFICULTY but to PERKS you get in the game.\"\n"
        "   v95 shipped CHAIN_ALLOWANCE_BY_DIFF, a per-difficulty table, because his\n"
        "   7/27 words were \"on your set difficulty\". That is now corrected and the\n"
        "   table is DELETED, not emptied further. Difficulty does not touch the\n"
        "   allowance in any way; the number comes from ONE place, G.chainSkill, which\n"
        "   is already a slider and already the thing a card would raise.\n"
        "   *** DO NOT WIRE G.userPkg BACK IN HERE. *** Difficulty sets how tight the\n"
        "   needle window is. Perks set how many shots you get before it ramps. Two\n"
        "   knobs, two owners, and he has now said which is which.\n"
        "   AND THIS IS WHY THE TABLE SHIPPED EMPTY: MECHANISM-MINE/CONTENTS-PAOLO'S\n"
        "   meant his correction deleted a wire instead of silently rebalancing the\n"
        "   fight around five numbers I would have invented. */\n"
        "function perkKillshots(){ return Math.max(1,(G.chainSkill||2)|0); }",
        'the allowance is a perk, not a difficulty')

    demo = subN(demo,
        "function chainAllowance(){ const t=CHAIN_ALLOWANCE_BY_DIFF[G.userPkg|0];\n"
        "  return Math.max(1,Math.min(t!=null?t:(G.chainSkill||2), chainWall())); }",
        "function chainAllowance(){ return Math.max(1,Math.min(perkKillshots(), chainWall())); }",
        'chainAllowance reads the perk slider only')

    # ---- and the control says what it is -----------------------------------
    demo = subN(demo,
        "cs.textContent='KILLSHOTS/TURN: '+G.chainSkill; });",
        "cs.textContent='KILLSHOTS (PERK): '+G.chainSkill; });   /* V98: it is a PERK slider, and the label has to say so */",
        'the settings control says PERK')

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
