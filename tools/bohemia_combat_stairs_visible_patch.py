#!/usr/bin/env python3
"""BOHEMIA - COMBAT v91: THE STAIRS ANNOUNCE THEMSELVES.

Paolo: "I couldn't find the stairs bro or whatever you had out what the fuck are
you talking about?"

REPRODUCED, and it is not close. Eight arenas, loaded and shuffled the way he
plays them:

  seed   deck  on screen  stair@  visible  STAIRS button?
  90733    6       6        6.0     true      hidden
  61932   12      12        3.0     true      hidden
   1634    8       8        4.0     true      hidden
  97658   12      12        6.0     true      hidden
  28851    4       4        5.8     true      hidden
  55377   12      12        3.2     true      hidden
  62806    8       8        4.1     true      hidden
  88539    6       6        5.0     true      hidden

  arenas with a deck:                    8 of 8
  whose stair tile was ON SCREEN:        8 of 8
  that ever showed the STAIRS button:    0 of 8

*** THE BUTTON APPEARED ZERO TIMES. ***

v90b gated it on stairNear() -- within 1.6 tiles -- and the stairs spawn 3 to 6
tiles out. So the only thing that ever said "there is a way up" required him to
first walk several tiles, under fire, toward a thing he had no reason to believe
existed. And at the zoom the fight actually plays at, the deck is about a
twelve-pixel-high slab that reads as one more piece of cover.

I wrote "a mechanic nobody can see is not a mechanic yet" into v90b's own
docstring, and then shipped a door that is invisible until you are standing on it.

--- THE FIX: THE FEATURE ADVERTISES ITSELF -------------------------------
1. THE BUTTON IS ALWAYS ON SCREEN WHENEVER THE ARENA HAS A DECK. Far away it
   reads the distance and the direction -- "STAIRS 4 tiles NW" -- and sits dimmed.
   Step next to it and it lights up and says "UP - 1 STA". Standing on the deck it
   says "DOWN - 1 STA".
   That one change means the second storey announces itself the moment the fight
   starts instead of after a journey. The BUTTON is the reliable channel on a
   phone: it cannot be zoomed out of, panned off, or mistaken for scenery.

2. A MARKER ON THE FIELD, so the button's direction has somewhere to point. A
   bright chevron stack over the stair tile, pulsing on the beat like everything
   else in this game, sized in ring units so it survives the auto-frame zooming
   out to fit eight men. It is drawn AFTER the deck so nothing paints over it.

3. AND THE DECK ITSELF SAYS WHAT IT IS, once, in the read line at the start of any
   fight that has one: "HIGH GROUND ON THE LOT - cover stops counting up there."
   He should never have to infer a rule from a tan rectangle.

WHAT DID NOT CHANGE: you still have to WALK there, it still costs a stamina pip,
and it is still the only way up. Advertising a position is not the same as giving
it away -- the walk under fire IS the price of the high ground, and that price is
the whole decision. This patch only stops the price being paid blind.

REUSE CHECK: no art or audio assets are cooked, read or written. The marker uses
the same beat-pulse and chevron drawing the melee telegraph and the approach ring
already use; the button is the button that already existed.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_stairs_visible_patch.py
Gate:  node gates/combat_lab_gate.js   (section 27)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V91 THE STAIRS ANNOUNCE THEMSELVES'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # ---- 1. the button is always there when there is a way up ---------------
    demo = subN(demo,
        "function updStairBtn(){ const b=D('stairbtn'); if(!b)return;\n"
        "  const s=(G.phase==='cover'&&!G.over&&!G.inc)?stairNear():null;\n"
        "  b.style.display=s?'':'none';\n"
        "  if(s)b.textContent=(myLvl()===DECK_LVL?'DOWN':'UP')+' \\u00b7 1 STA'; }",
        "/* ===== V91 THE STAIRS ANNOUNCE THEMSELVES ===========================\n"
        "   Paolo: \"I couldn't find the stairs bro.\" MEASURED across eight arenas: the\n"
        "   button appeared ZERO times. Every arena had a deck, every deck was on screen,\n"
        "   and every stair tile sat 3-6 tiles away while the button only showed within\n"
        "   1.6. The only thing that ever said \"there is a way up\" required him to walk\n"
        "   to it first, under fire, toward a thing he had no reason to think existed.\n"
        "   THE BUTTON IS THE RELIABLE CHANNEL ON A PHONE: it cannot be zoomed out of,\n"
        "   panned off, or mistaken for scenery. So it is always there when a way up\n"
        "   exists, and it says how far and which way until you are standing on it.\n"
        "   The WALK is still the price of the high ground. Advertising a position is\n"
        "   not giving it away. */\n"
        "const STAIR_ARROWS=['E','SE','S','SW','W','NW','N','NE'];\n"
        "function stairBearing(S){ const a=((S.ea%(Math.PI*2))+Math.PI*2)%(Math.PI*2);\n"
        "  return STAIR_ARROWS[Math.round(a/(Math.PI/4))%8]; }\n"
        "function updStairBtn(){ const b=D('stairbtn'); if(!b)return;\n"
        "  const live=(G.phase==='cover'&&!G.over&&!G.inc);\n"
        "  const S=(G.stairs||[])[0];\n"
        "  if(!live||!S){ b.style.display='none'; return; }\n"
        "  b.style.display='';\n"
        "  const near=!!stairNear();\n"
        "  if(near){ b.textContent=(myLvl()===DECK_LVL?'DOWN':'UP')+' \\u00b7 1 STA';\n"
        "    b.style.borderColor='#c8a23a'; b.style.color='#e8c88a'; b.style.opacity='1'; }\n"
        "  else { b.textContent='STAIRS '+Math.round(S.edist)+' '+stairBearing(S);\n"
        "    b.style.borderColor='#6a5c3a'; b.style.color='#9a8a62'; b.style.opacity='0.75'; } }",
        'the button is always there')

    # ---- 2. tapping it from far away SAYS where, instead of doing nothing ---
    demo = subN(demo,
        "function doStairs(){ if(G.inc||G.over||G.phase!=='cover')return;\n"
        "  const s=stairNear(); if(!s)return; audio();",
        "function doStairs(){ if(G.inc||G.over||G.phase!=='cover')return;\n"
        "  const s=stairNear();\n"
        "  if(!s){ const S=(G.stairs||[])[0];   /* V91: a tap from across the lot POINTS, it never no-ops */\n"
        "    if(S)setRead('STAIRS '+Math.round(S.edist)+' TILES '+stairBearing(S),\n"
        "      'walk to them — up there no cover counts, theirs or yours','#e8c88a');\n"
        "    return; }\n"
        "  audio();",
        'a tap from far away points')

    # ---- 3. the marker on the field ---------------------------------------
    demo = subN(demo,
        "  const epos=e=>{ const p=fieldPos(e,W,H,cx,cy); return [p[0],p[1]+lvlDY(e.lvl)]; };",
        "  /* V91 THE MARKER. The button says how far and which way; this is what it is\n"
        "     pointing AT. Sized in ring units so it survives the auto-frame zooming out\n"
        "     to fit eight men, drawn after the deck so nothing paints over it, and\n"
        "     pulsing on the beat like everything else in this game. */\n"
        "  if(!aimo&&G.stairs&&G.stairs.length&&myLvl()!==DECK_LVL){\n"
        "    const S=G.stairs[0], sp=fieldPos(S,W,H,cx,cy), sy2=sp[1]+lvlDY(DECK_LVL);\n"
        "    const pu=Math.pow(1-_bpmPhase,2), t3=ring;\n"
        "    x.save();\n"
        "    x.strokeStyle='rgba(240,214,150,'+(0.55+pu*0.45).toFixed(3)+')';\n"
        "    x.lineWidth=Math.max(2,t3*0.10); x.lineCap='round';\n"
        "    for(let c2=0;c2<2;c2++){ const yy=sy2-t3*(0.95+c2*0.42)-pu*t3*0.16;\n"
        "      x.beginPath(); x.moveTo(sp[0]-t3*0.34,yy+t3*0.24);\n"
        "      x.lineTo(sp[0],yy); x.lineTo(sp[0]+t3*0.34,yy+t3*0.24); x.stroke(); }\n"
        "    x.lineCap='butt'; x.restore(); }\n"
        "  const epos=e=>{ const p=fieldPos(e,W,H,cx,cy); return [p[0],p[1]+lvlDY(e.lvl)]; };",
        'the marker on the field')

    # ---- 4. and the deck says what it is, once, at the top of the fight -----
    demo = subN(demo,
        "  setRead('NEW ENCOUNTER','HP carried over — '+G.pHP+' left','#8fe89a'); }",
        "  /* V91: a fight with a second storey SAYS SO, once. He should never have to\n"
        "     infer a rule from a tan rectangle. */\n"
        "  if(G.stairs&&G.stairs.length)\n"
        "    setRead('HIGH GROUND ON THE LOT','stairs '+Math.round(G.stairs[0].edist)+' '+stairBearing(G.stairs[0])\n"
        "      +' — up there no cover counts, theirs or yours','#e8c88a');\n"
        "  else setRead('NEW ENCOUNTER','HP carried over — '+G.pHP+' left','#8fe89a'); }",
        'the fight says it has a storey')

    demo = subN(demo,
        "    setRead('ARENA #'+s, (_asked!=null?'replayed from the box':'fresh cover, fresh spawns')\n"
        "      +' — HP and streak kept','#e8c88a'); });",
        "    setRead('ARENA #'+s, ((G.stairs&&G.stairs.length)\n"
        "      ? ('HIGH GROUND — stairs '+Math.round(G.stairs[0].edist)+' '+stairBearing(G.stairs[0]))\n"
        "      : 'flat lot, no way up')+' — HP and streak kept','#e8c88a'); });",
        'the shuffle says whether this one has a storey')

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
