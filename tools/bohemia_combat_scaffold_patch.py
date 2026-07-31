#!/usr/bin/env python3
"""BOHEMIA - COMBAT v105: THE SCAFFOLD. A DECK YOU CAN SEE THROUGH.

Paolo: "The two story shit looks like dog shit. If you could try to make it look
like a scaffold at very least and again, please fix when people are [beneath, to]
change the opacity of the tile that are on top of or beneath ... so that way we
could see them. I just want to see simple like warehouse scaffold. That's very
visible throughout you know like scaffold that could be like Home Depot or
something."

Second time he has rejected this storey and the third time he has asked to see
who is under it. Both complaints have ONE answer and he named it: A SCAFFOLD IS
SEE-THROUGH BY CONSTRUCTION.

--- WHAT WAS THERE, AND WHY IT DESERVED IT ------------------------------
A near-black rectangle for the side face, a flat fill for the top, one cream
line for the lip. It read as a solid slab because that is what it was drawn as,
and a solid slab has exactly one thing it can do to the man underneath it: hide
him. v93's x-ray ghost was me patching that symptom instead of the cause.

--- THE SCAFFOLD, AND EVERY PART OF IT IS DOING A JOB --------------------
  LEGS        vertical posts down to the lot at the deck's corners. The vertical
              is the only thing in a top-down frame that says "tall" -- the same
              rule the stair run is built on -- and now it says it with a gap
              beside it instead of a wall.
  X-BRACING   the diagonal cross between legs. This is the single line that makes
              a structure read as SCAFFOLD rather than table, and it is the Home
              Depot racking silhouette he described.
  OPEN DECK   a slatted plate: boards with gaps, not a poured slab. You see the
              lot between the slats.
  KICK RAIL   a bright edge board along the open sides, so the deck still has a
              hard top line to read its height against.

--- AND THE TILE GETS OUT OF THE WAY WHEN SOMEBODY IS UNDER IT -----------
*** THE THIRD ASK, ANSWERED AT THE CAUSE THIS TIME. *** Any deck tile with a
living body underneath drops to DECK_SEE alpha, so the man shows THROUGH the
boards instead of being hidden and then re-drawn as a ghost. The tile that is in
your way is the tile that gets thin, and only that tile.

v93's ghost STAYS as the backstop: a body still washes cold under a deck, so if
he is under a tile that is not thinning for any reason you can still find him.
Two independent reads of the same fact, which is what he has now asked for three
times.

--- IT IS STILL A READ, NOT A RULE CHANGE -------------------------------
Nothing here touches cover, damage, exposure or the cross-level rule. A thinner
tile changes what you can SEE, never what you can hit.

REUSE CHECK: no art or audio is cooked, read or written. This is canvas drawing
of the deck the generator already produces, using the palette already in the
file. No bank is opened and no pixels are baked.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_scaffold_patch.py
Gate:  node gates/combat_lab_gate.js   (section 39)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V105 THE SCAFFOLD'

OLD_DECK = (
    "if(G.deck&&G.deck.length){ const dz=lvlDY(DECK_LVL), t2=ring;\n"
    "    /* its shadow on the lot underneath */\n"
    "    for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy);\n"
    "      x.fillStyle='rgba(0,0,0,0.55)'; x.fillRect(p[0]-t2*0.5,p[1]-t2*0.5,t2+1,t2+1); }\n"
    "    /* the side face: the storey itself, only drawn when it is above you. It has\n"
    "       to be MUCH darker than the lot or the deck reads as a lighter patch of\n"
    "       ground instead of a thing with a height -- which is exactly how it read\n"
    "       on the first screenshot. Value contrast IS the height cue. */\n"
    "    if(dz<0)for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy);\n"
    "      const fy=p[1]-t2*0.5+dz+t2;\n"
    "      x.fillStyle='#15120e'; x.fillRect(p[0]-t2*0.5,fy,t2+1,-dz);\n"
    "      x.fillStyle='rgba(120,104,78,0.22)'; x.fillRect(p[0]-t2*0.5,fy,t2+1,Math.min(-dz,t2*0.18)); }\n"
    "    /* the top plate, in the same slab language the pillars already speak */\n"
    "    for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy), ty=p[1]-t2*0.5+dz;\n"
    "      x.fillStyle=T.stair?'#7d6c50':'#665c49'; x.fillRect(p[0]-t2*0.5,ty,t2+1,t2+1);\n"
    "      x.strokeStyle='rgba(20,16,12,0.45)'; x.lineWidth=1;\n"
    "      x.strokeRect(p[0]-t2*0.5,ty,t2,t2);\n"
    "      /* V92: the three stripes that used to be painted here are GONE. They were a\n"
    "         DECAL on a tile that floats one whole storey above the lot, so nothing in\n"
    "         the picture ever joined the two floors. The real run of steps is drawn\n"
    "         below, after the deck, as architecture. */ }\n"
    "    /* the lip: a bright edge so the deck reads as a THING with a height */\n"
    "    x.strokeStyle='rgba(226,208,168,0.85)'; x.lineWidth=2.5;\n"
    "    for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy), ty=p[1]-t2*0.5+dz;\n"
    "      if(!deckTileAt(pXY(T)[0],pXY(T)[1]-1)){ x.beginPath();\n"
    "        x.moveTo(p[0]-t2*0.5,ty); x.lineTo(p[0]+t2*0.5,ty); x.stroke(); } } }")

NEW_DECK = (
    "/* ===== V105 THE SCAFFOLD =========================================\n"
    "     Paolo: \"The two story shit looks like dog shit... make it look like a\n"
    "     scaffold... simple like warehouse scaffold, very visible throughout, like\n"
    "     Home Depot\" -- plus, for the third time, let him SEE who is underneath.\n"
    "     BOTH complaints have one answer and he named it: A SCAFFOLD IS SEE-THROUGH\n"
    "     BY CONSTRUCTION. What was there was a near-black rectangle and a flat fill,\n"
    "     which read as a solid slab because that is what it was, and a solid slab can\n"
    "     only ever hide the man under it.\n"
    "     LEGS say tall (the vertical is the only thing in a top-down frame that can),\n"
    "     X-BRACING is what makes a structure read scaffold instead of table, the deck\n"
    "     is SLATTED so the lot shows between the boards, and a bright kick rail keeps\n"
    "     a hard top line to read the height against. */\n"
    "  if(G.deck&&G.deck.length){ const dz=lvlDY(DECK_LVL), t2=ring;\n"
    "    const _below=T=>{ const q=pXY(T);\n"
    "      return (G.e||[]).some(e2=>!e2.dead&&(e2.lvl|0)===0&&Math.abs(Math.cos(e2.ea)*e2.edist-q[0])<0.6&&Math.abs(Math.sin(e2.ea)*e2.edist-q[1])<0.6)\n"
    "        || (myLvl()===0&&Math.abs(q[0])<0.6&&Math.abs(q[1])<0.6); };\n"
    "    /* a scaffold throws a BROKEN shadow, because it has gaps */\n"
    "    for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy);\n"
    "      x.fillStyle='rgba(0,0,0,0.28)'; x.fillRect(p[0]-t2*0.5,p[1]-t2*0.5,t2+1,t2+1); }\n"
    "    if(dz<0){\n"
    "      /* THE LEGS + THE X-BRACING, only on the OUTSIDE edges, so the inside of the\n"
    "         deck stays open and you can see the lot through it. */\n"
    "      for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy), q=pXY(T);\n"
    "        const ty=p[1]-t2*0.5+dz, by=p[1]-t2*0.5;\n"
    "        const openL=!deckTileAt(q[0]-1,q[1]), openR=!deckTileAt(q[0]+1,q[1]);\n"
    "        const lx=p[0]-t2*0.5, rx=p[0]+t2*0.5;\n"
    "        x.lineWidth=Math.max(2,t2*0.09); x.strokeStyle='#3b3227';\n"
    "        if(openL){ x.beginPath(); x.moveTo(lx,ty); x.lineTo(lx,by+t2); x.stroke(); }\n"
    "        if(openR){ x.beginPath(); x.moveTo(rx,ty); x.lineTo(rx,by+t2); x.stroke(); }\n"
    "        if(openL||openR){   /* the diagonal cross: the scaffold tell */\n"
    "          x.lineWidth=Math.max(1,t2*0.05); x.strokeStyle='rgba(70,60,46,0.85)';\n"
    "          x.beginPath(); x.moveTo(lx,ty); x.lineTo(rx,by+t2);\n"
    "          x.moveTo(rx,ty); x.lineTo(lx,by+t2); x.stroke(); } }\n"
    "    }\n"
    "    /* THE OPEN DECK: boards with gaps, not a poured slab. And any tile with a\n"
    "       living body under it goes THIN, so he shows through the boards instead of\n"
    "       being hidden and then redrawn as a ghost. THE TILE IN YOUR WAY IS THE TILE\n"
    "       THAT GETS OUT OF THE WAY. */\n"
    "    const DECK_SEE=0.34, NBOARD=4;\n"
    "    for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy), ty=p[1]-t2*0.5+dz;\n"
    "      const thin=_below(T);\n"
    "      x.save(); if(thin)x.globalAlpha=DECK_SEE;\n"
    "      const bw=(t2+1)/NBOARD;\n"
    "      for(let bI=0;bI<NBOARD;bI++){\n"
    "        x.fillStyle=T.stair?'#8a7757':((bI%2)?'#6d6249':'#786c51');\n"
    "        x.fillRect(p[0]-t2*0.5+bI*bw,ty,bw*0.82,t2+1); }\n"
    "      x.strokeStyle='rgba(20,16,12,0.40)'; x.lineWidth=1;\n"
    "      x.strokeRect(p[0]-t2*0.5,ty,t2,t2);\n"
    "      x.restore(); }\n"
    "    /* the kick rail: a hard bright top line on every open edge */\n"
    "    x.strokeStyle='rgba(232,214,172,0.92)'; x.lineWidth=Math.max(2,t2*0.08);\n"
    "    for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy), ty=p[1]-t2*0.5+dz, q=pXY(T);\n"
    "      if(!deckTileAt(q[0],q[1]-1)){ x.beginPath();\n"
    "        x.moveTo(p[0]-t2*0.5,ty); x.lineTo(p[0]+t2*0.5,ty); x.stroke(); }\n"
    "      if(!deckTileAt(q[0],q[1]+1)){ x.beginPath();\n"
    "        x.moveTo(p[0]-t2*0.5,ty+t2); x.lineTo(p[0]+t2*0.5,ty+t2); x.stroke(); } } }")


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo
    demo = subN(demo, OLD_DECK, NEW_DECK, 'the deck becomes a scaffold')
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
