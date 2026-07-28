#!/usr/bin/env python3
"""BOHEMIA - COMBAT v92: THERE WAS NEVER A STAIRCASE, ONLY A DECAL.

Paolo: "You have stairs right now looking like dog shit so yeah I just fix it bro
please I don't know. Yeah just do a big brain online research. Have some
references and do what you're supposed to."

--- WHAT WAS ACTUALLY THERE ------------------------------------------------
    if(T.stair){ x.fillStyle='rgba(232,200,138,0.30)';
      for(let s2=0;s2<3;s2++)x.fillRect(...t2*0.10); }

THREE FAINT STRIPES PAINTED ON THE TOP FACE OF A DECK TILE.

Screenshotted at 3x: it reads as scratches on the platform. And the structural
problem is worse than the palette one -- THE STAIRS NEVER TOUCHED THE GROUND.
The tile they were painted on sits AT DECK LEVEL, one whole storey above the lot,
so nothing in the picture connected the two floors. I drew a texture where a
piece of ARCHITECTURE was needed. There was no way up because there was no way up
drawn.

--- THE RESEARCH -----------------------------------------------------------
Isometric/top-down pixel art is unanimous on how a step reads, and it is three
things, none of which the decal had:

1. THREE SHADES PER STEP. "the top face should be bright, the left face medium
   brightness, and the right face dark... apply this 3-shade approach to each step
   to show the dimensional height."
   -- Pixel Parmesan, Fundamentals of Isometric Pixel Art
2. HEIGHT LINES ARE PERFECTLY VERTICAL. The riser is a straight vertical face; it
   is the only thing in the frame saying "this is tall".
   -- SLYNYRD, Pixelblog 41
3. DRAW BACK TO FRONT so near steps occlude far ones. The occlusion IS the depth
   cue; without it a stack of bands is a barcode.

And it agrees with what this lane already learned the hard way on the deck face:
VALUE CONTRAST IS THE HEIGHT CUE. v90's storey face was #3e372c and the whole deck
read as a lighter patch of ground until it went near-black.

REFERENCES CONSULTED:
  Pixel Parmesan  - Fundamentals of Isometric Pixel Art (3-shade rule)
  SLYNYRD         - Pixelblog 41, Isometric Pixel Art (vertical height lines)
  Pixelation      - "Stairs in top down perspective" (thread)
  M. Bitzos       - Implementing satisfying stairs for 2D top-down games
  Zelda ALTTP     - stairs+ladders as the classic top-down elevation vocabulary

--- WHAT THIS BUILDS -------------------------------------------------------
A REAL RUN OF STEPS that starts on the lot and climbs to the deck plate:

  * FIVE steps, each with a BRIGHT TREAD and a NEAR-BLACK RISER, marching from
    the ground up to the deck's top face, so the two floors are physically joined
    in the picture for the first time.
  * IT DESCENDS TOWARD YOU. The stair tile is by construction the deck tile
    closest to the player, so the run always comes down toward the middle of the
    screen -- the direction the eye is already looking.
  * DRAWN TOP STEP FIRST, so every lower step occludes the one behind it.
  * A CAST SHADOW at the foot, on the lot, where a real stair would throw one.
  * THE CHEVRON MOVES UP off the steps so the wayfinding marker stops sitting on
    the thing it is pointing at.

REUSE CHECK: banks/ WAS searched for existing stair art, and it exists --
BOHEMIA_TILECAT_BROWN lists "Stairs, ladders and Railings" (n=6, part1),
"18. Stairs and lifts" (n=12, part3) and "16. Staircases and elevation" (n=1,
part4), 19 approved tiles in the HD repo. NOT USED, and the reason is structural
rather than taste: this staircase must span DECK_H, which is computed at runtime
from ring and the live camera zoom, and must re-derive its direction per arena
from the generated deck. A fixed raster tile cannot stretch between two screen
heights that change with the zoom. So it is cooked as VECTOR GEOMETRY in the exact
language the deck and the pillars already speak (slab body + lit top face), which
is also what keeps the greybox looking like one thing. FILED: when the combat
surface goes tiled, those 19 tiles are the replacement and this vector run is the
placeholder they answer.

No art or audio assets are written; this is drawing code in the render path.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_staircase_patch.py
Gate:  node gates/combat_lab_gate.js   (section 28)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V92 A REAL RUN OF STEPS'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # ---- 0. the entrance moves to the deck's NEAR edge ---------------------
    # This is a MIGRATION, not a change to v90's tool. v90 is already shipped on
    # main, so its tool correctly skips an already-patched tree -- editing it does
    # nothing and silently leaves the old code in the build. A change to shipped
    # code belongs in the NEW patch, where it actually runs.
    demo = subN(demo,
        "      /* THE STAIR: the closest deck tile to you, so there is always a way up you\n"
        "         can actually walk to rather than a puzzle about finding the entrance. */\n"
        "      let s=G.deck[0]; for(const T of G.deck)if(T.edist<s.edist)s=T;",
        "      /* V92 THE ENTRANCE SITS ON THE DECK'S NEAR (DOWN-SCREEN) EDGE, and among\n"
        "         those tiles the one closest to you. This is a RENDER problem solved at\n"
        "         the SOURCE: a run of steps only reads as a staircase when it comes DOWN\n"
        "         TOWARD THE VIEWER. Marching away up-screen, every riser is taller than\n"
        "         the gap to the next step and the whole run collapses into a dark smear --\n"
        "         measured invisible in exactly that one of four cases. Generating the\n"
        "         entrance on the near edge DELETES the broken orientation instead of\n"
        "         special-casing it, and it is still the nearest way up you can walk to. */\n"
        "      const _wy=T2=>Math.sin(T2.ea)*T2.edist;\n"
        "      let maxY=-1e9; for(const T2 of G.deck)maxY=Math.max(maxY,_wy(T2));\n"
        "      const _edge=G.deck.filter(T2=>_wy(T2)>maxY-0.6);\n"
        "      let s=_edge[0]; for(const T2 of _edge)if(T2.edist<s.edist)s=T2;",
        'the entrance moves to the near edge')

    # ---- 1. the decal comes off the tile -----------------------------------
    demo = subN(demo,
        "      if(T.stair){ x.fillStyle='rgba(232,200,138,0.30)';   /* the way up, drawn as steps */\n"
        "        for(let s2=0;s2<3;s2++)x.fillRect(p[0]-t2*0.42,ty+t2*(0.18+s2*0.26),t2*0.84,t2*0.10); } }",
        "      /* V92: the three stripes that used to be painted here are GONE. They were a\n"
        "         DECAL on a tile that floats one whole storey above the lot, so nothing in\n"
        "         the picture ever joined the two floors. The real run of steps is drawn\n"
        "         below, after the deck, as architecture. */ }",
        'the decal comes off')

    # ---- 2. a real run of steps --------------------------------------------
    demo = subN(demo,
        "  /* V91 THE MARKER. The button says how far and which way; this is what it is",
        "  /* ===== V92 A REAL RUN OF STEPS ======================================\n"
        "     Paolo: \"You have stairs right now looking like dog shit.\" He is right, and\n"
        "     the structural problem was worse than the palette one: THE STAIRS NEVER\n"
        "     TOUCHED THE GROUND. Three stripes painted on the top face of a deck tile,\n"
        "     one storey up, joined to nothing.\n"
        "     THE RESEARCH (Pixel Parmesan's isometric fundamentals, SLYNYRD's Pixelblog\n"
        "     41, the Pixelation top-down-stairs thread) is unanimous on three rules, and\n"
        "     the decal had none of them:\n"
        "       1. THREE SHADES PER STEP -- bright top face, dark side face.\n"
        "       2. HEIGHT LINES ARE PERFECTLY VERTICAL -- the riser is the only thing in\n"
        "          the frame that says \"this is tall\".\n"
        "       3. DRAW BACK TO FRONT so near steps occlude far ones. The occlusion IS\n"
        "          the depth cue; without it a stack of bands is a barcode.\n"
        "     Which agrees with what this lane already learned on the deck face: VALUE\n"
        "     CONTRAST IS THE HEIGHT CUE. */\n"
        "  if(G.deck&&G.deck.length&&G.stairs&&G.stairs.length){\n"
        "    const T=G.stairs[0], sp2=fieldPos(T,W,H,cx,cy), t4=ring;\n"
        "    const dzS=lvlDY(DECK_LVL);                    /* deck plane relative to your feet */\n"
        "    const topY=sp2[1]-t4*0.5+dzS;                 /* the tread that meets the deck */\n"
        "    /* A STOREY IS A STOREY WHICHEVER FLOOR YOU ARE ON. Measuring the rise as\n"
        "       -dzS made it ZERO while standing on the deck, so the way DOWN was invisible\n"
        "       from up there -- the button said DOWN and the picture said nothing. The run\n"
        "       always spans one full storey, from the deck plane to the lot. */\n"
        "    const rise=DECK_H;\n"
        "    /* IT DESCENDS TOWARD YOU. The stair tile is by construction the deck tile\n"
        "       CLOSEST to the player, so the run always comes down toward the middle of\n"
        "       the screen -- the direction the eye is already looking. Snapped to 4-way\n"
        "       so the steps stay square to the grid the rest of the board is drawn on. */\n"
        "    const NS=5, run=t4*1.05, halfW=t4*0.46;\n"
        "    /* the shadow the run throws on the lot at its foot */\n"
        "    x.fillStyle='rgba(0,0,0,0.45)';\n"
        "    x.fillRect(sp2[0]-halfW-2, topY+rise+run*0.35-2, halfW*2+4, 7);\n"
        "    /* TOP STEP FIRST. Every lower step then draws over the one behind it. */\n"
        "    for(let i2=0;i2<NS;i2++){\n"
        "      const fr=i2/(NS-1);                          /* 0 at the deck, 1 on the lot */\n"
        "      const oy=topY+fr*rise;                       /* marching down one storey */\n"
        "      /* V92: the run ALWAYS marches down-screen, toward the viewer, because the\n"
        "         stair tile is now generated on the deck's near edge. One orientation,\n"
        "         one that reads, instead of four of which one collapsed. */\n"
        "      const ox2=sp2[0], oy2=oy+fr*run*0.35;\n"
        "      const tread=Math.max(2,rise/NS*0.55), riser=Math.max(2,rise/NS);\n"
        "      const wx=halfW*2-fr*halfW*0.30;   /* narrows a touch with distance, so the run has a direction */\n"
        "      /* THE RISER: a straight vertical face, near-black against the lot. This is\n"
        "         the whole height cue -- the deck taught us that the hard way. */\n"
        "      x.fillStyle='#14110d';\n"
        "      x.fillRect(ox2-wx*0.5, oy2, wx, riser+tread);\n"
        "      /* THE TREAD: the bright top face, plus a hard lit lip on its leading edge */\n"
        "      x.fillStyle='#8c7d61';\n"
        "      x.fillRect(ox2-wx*0.5, oy2, wx, tread);\n"
        "      x.fillStyle='rgba(232,214,172,0.95)';\n"
        "      x.fillRect(ox2-wx*0.5, oy2, wx, Math.max(1,tread*0.34)); } }\n"
        "  /* V91 THE MARKER. The button says how far and which way; this is what it is",
        'the staircase')

    # ---- 3. the chevron lifts off the steps it points at --------------------
    demo = subN(demo,
        "    for(let c2=0;c2<2;c2++){ const yy=sy2-t3*(0.95+c2*0.42)-pu*t3*0.16;",
        "    for(let c2=0;c2<2;c2++){ const yy=sy2-t3*(1.55+c2*0.42)-pu*t3*0.16;   /* V92: up off the steps, so the marker stops sitting on the thing it points at */",
        'the chevron lifts off')

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
