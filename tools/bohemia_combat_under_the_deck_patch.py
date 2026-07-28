#!/usr/bin/env python3
"""BOHEMIA - COMBAT v93: YOU CAN SEE WHO IS UNDER THE DECK.

Paolo: "You still need [to] code it better with the players on it, the enemies on
it. What if I'm on the other side of the stairs that's underneath the screen?
That's why there has to be like the [opacity] thing where I could see who's
underneath the stairs."

--- REPRODUCED, AND IT IS THE OPPOSITE OF HIDDEN --------------------------
Parked a living man on the LOT, directly under a deck tile, and screenshotted at
3x. He is not hidden by the storey above him. HE IS DRAWN ON TOP OF IT.

Every body in the demo paints in one pass, after the deck, at one depth. So a man
standing underneath a platform and a man standing on it are pixel-identical, and
the picture actively lies about which floor anyone is on. That is worse than
occlusion: occlusion at least tells you something is in front.

--- THE FIX: THE X-RAY, WHICH IS WHAT HE ASKED FOR ------------------------
A body on the lot, under the deck's footprint, draws as a GHOST -- washed to a
cold blue-grey and dropped to low alpha, standing in the deck's shadow. A body on
the deck draws solid, as normal.

That is the standard answer in every top-down and isometric game that has ever had
a roof (Diablo, Baldur's Gate 3, Fallout, Zelda): geometry does not simply hide
what is behind it, the hidden thing shows through as a silhouette. It is exactly
the "opacity thing" he described.

It reads without a single word of UI:
  SOLID body   = same floor as the thing above it, standing ON the deck
  GHOST body   = underneath, one storey below, in shadow

And it uses drawHumanWashed(), which already exists in the demo and is already how
the stun / firing / peeking / wounded tints are drawn. No new draw path.

WHY THE GHOST AND NOT A DEPTH-SORT: the honest fix is to draw ground bodies, then
the deck, then deck bodies -- three passes instead of one. drawField's body pass is
a single 180-line loop that also owns wounds, weapon reads, target rings, beg
lines, elite glints and health bars. Splitting it by level to fix a readability
problem is a large, risky reorder of the most-touched function in the file, and it
would STILL need the x-ray on top, because a man perfectly hidden under a roof is
a man you cannot make a decision about. The ghost solves the whole problem in the
pass that already exists. If the body pass is ever split for another reason, the
ghost stays correct.

REUSE CHECK: no art or audio assets are cooked, read or written. This reuses
drawHumanWashed (the existing tint path) and deckTileAt (the existing level
lookup). Nothing new is drawn that was not drawn before; it is drawn differently.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_under_the_deck_patch.py
Gate:  node gates/combat_lab_gate.js   (section 29)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V93 YOU CAN SEE WHO IS UNDER THE DECK'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # ---- the predicate, next to the other level helpers --------------------
    demo = subN(demo,
        "function stairNear(){ return (G.stairs||[]).find(S=>S.edist<=1.6)||null; }",
        "function stairNear(){ return (G.stairs||[]).find(S=>S.edist<=1.6)||null; }\n"
        "/* ===== V93 YOU CAN SEE WHO IS UNDER THE DECK ==========================\n"
        "   Paolo: \"there has to be like the [opacity] thing where I could see who's\n"
        "   underneath the stairs.\"\n"
        "   REPRODUCED, and it was the OPPOSITE of hidden: a man standing on the lot\n"
        "   under a deck tile was drawn ON TOP OF THE STOREY ABOVE HIM. Every body\n"
        "   paints in one pass at one depth, so a man underneath a platform and a man\n"
        "   standing on it were pixel-identical and the picture actively lied about\n"
        "   which floor anyone was on. That is worse than occlusion -- occlusion at\n"
        "   least tells you something is in front.\n"
        "   THE X-RAY is what every top-down game with a roof does: the hidden thing\n"
        "   shows THROUGH as a silhouette rather than simply vanishing. */\n"
        "function underDeck(o){ if(!o||(o.lvl|0)!==0)return false;\n"
        "  return !!deckTileAt(Math.cos(o.ea)*o.edist,Math.sin(o.ea)*o.edist); }\n"
        "function underDeckMe(){ return myLvl()===0 && !!deckTileAt(0,0); }\n"
        "/* the ghost wash: cold, low, and unmistakably NOT the solid body next to it */\n"
        "const UNDER_TINT='rgba(96,132,178,0.90)', UNDER_ALPHA=0.42;",
        'the under-deck predicate')

    # ---- the enemies -------------------------------------------------------
    demo = subN(demo,
        "function drawEnemySprite(x,e,ex,ey,now){",
        "function drawEnemySprite(x,e,ex,ey,now){\n"
        "  /* V93: he is on the lot with a storey over his head. Ghost him, so the two\n"
        "     floors can never be confused for one. */\n"
        "  if(underDeck(e)){ const f2=enemyFrame(e,now); if(!f2)return false;\n"
        "    x.save(); x.globalAlpha=UNDER_ALPHA;\n"
        "    drawHumanWashed(x,f2,ex,ey,UNDER_TINT);\n"
        "    x.restore(); return true; }",
        'enemies under the deck are ghosts')

    # ---- and you --------------------------------------------------------
    demo = subN(demo,
        "    if(_sh>0.01)drawHumanWashed(x,pst,cx,cy,'rgba(255,208,110,'+_sh.toFixed(3)+')');\n"
        "    else drawHuman(x,pst,cx,cy);",
        "    /* V93: and YOU get the same treatment standing under it, so the rule is one\n"
        "       rule and you can always tell which floor your own body is on. */\n"
        "    if(underDeckMe()){ x.save(); x.globalAlpha=UNDER_ALPHA;\n"
        "      drawHumanWashed(x,pst,cx,cy,UNDER_TINT); x.restore(); }\n"
        "    else if(_sh>0.01)drawHumanWashed(x,pst,cx,cy,'rgba(255,208,110,'+_sh.toFixed(3)+')');\n"
        "    else drawHuman(x,pst,cx,cy);",
        'you under the deck are a ghost too')

    # ---- and the read says it in words too ---------------------------------
    demo = subN(demo,
        "  const _lv=((e.lvl|0)!==myLvl());",
        "  const _lv=((e.lvl|0)!==myLvl());\n"
        "  /* V93: the one case the level words alone could not cover -- same floor as\n"
        "     you, but with a storey over his head, which is where he is hardest to see. */\n"
        "  const _und=underDeck(e)&&!_lv;",
        'the read knows about under')

    demo = subN(demo,
        "  r.innerHTML=_lvTxt+'<span style=\"color:'+rangeCol(e)+'\">'+tier+'</span>'",
        "  r.innerHTML=(_und?'<b style=\"color:#7fa8d8\">UNDER THE DECK</b> <span style=\"color:#5a5040\">·</span> ':'')\n"
        "    +_lvTxt+'<span style=\"color:'+rangeCol(e)+'\">'+tier+'</span>'",
        'the read says under the deck')

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
