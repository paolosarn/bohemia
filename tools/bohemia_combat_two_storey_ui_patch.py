#!/usr/bin/env python3
"""BOHEMIA - COMBAT v90b: THE STOREY YOU CAN SEE AND WALK ONTO.

v90 put the rule in (across levels, ground cover does not count) and the deck in
the world. This is the half Paolo actually touches:

1. THE DECK ON SCREEN, in the slab language the pillars already speak: a dark
   side face and a lit top plate, sitting one storey above the ground, with its
   shadow on the lot beneath it. The stair tile is drawn with steps on it, so the
   way up is a thing you can see rather than a thing you have to be told.

2. LEVELS ARE DRAWN RELATIVE TO YOU. Everything offsets by
   (its level - your level), so the deck floats above you from the ground and
   becomes the floor you are standing on the moment you are up there, with the
   whole lot dropping away below. One scene, always -- the same law the killshot
   and the board already obey.

3. THE STAIRS BUTTON, beside SHOVE, appearing on the same terms: only when you
   can actually use it. It costs ONE STAMINA AND NO TURN -- Paolo 7/26, LOCKED,
   and his own words this session, "sprinting and not losing a turn can help
   that." Getting to the high ground is the same class of move as closing the
   distance, so it is priced the same way.

4. ENEMIES HOLD IT. Up to two men spawn on the deck, rolled by the arena seed, so
   replaying a seed replays the whole problem. If they hold the high ground, the
   stone you are behind is not helping you and you have to go take it off them.

5. THE READ SAYS WHICH FLOOR. The range line already tells you both halves of the
   distance trade; it now says HIGH GROUND or BELOW when a floor separates you,
   and that ground cover is not counting. A mechanic nobody can see is not a
   mechanic yet -- the lesson from the orange, and from SUPPRESS three times.

REUSE CHECK: no art or audio assets are cooked, read or written. The deck draws
with the same fillRect slab + ellipse-lit-top vocabulary the pillars already use;
the button reuses the SHOVE button's show/hide pattern; the read reuses the line
v88 added.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_two_storey_ui_patch.py
Gate:  node gates/combat_lab_gate.js   (section 26)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V90B THE STOREY YOU CAN SEE'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # ---- 1. put the men on it ---------------------------------------------
    # THE ANCHOR BUG THIS CAUGHT: v1 anchored on "updateGeomCover(); renderBoard();"
    # which is UNIQUE -- and sits inside doSuppress(), not the arena builder. It
    # passed the count assert and put the deck placement inside the SUPPRESS verb.
    # ANCHOR UNIQUENESS IS NOT ANCHOR CORRECTNESS. Anchor on the last line of the
    # function you actually mean, and check what function that line is IN.
    # AND THEN I DID IT AGAIN: '} }' closed the LOOP *and* the FUNCTION, so v2's
    # block landed OUTSIDE setupEnemiesBody as module-level dead code that ran once
    # at load with G.deck undefined. Both misses had the same root cause: I checked
    # that the text was unique and never checked the BRACE DEPTH it sat at.
    demo = subN(demo,
        "    G.e.push(e); } }",
        "    G.e.push(e); }\n"
        "  /* ===== V90B THE STOREY YOU CAN SEE =================================\n"
        "     Put the deck holders up there. Rolled with the arena, so replaying a seed\n"
        "     replays the whole problem and not just the shape of it. If they hold the\n"
        "     high ground, the stone you are behind is not helping you. */\n"
        "  if(G.deck&&G.deck.length&&(G._deckHolders||0)>0){\n"
        "    const spots=G.deck.filter(T=>!T.stair).slice(0);\n"
        "    const shooters=G.e.filter(e=>!e.melee);   /* a blade on a roof is a man with nothing to do */\n"
        "    for(let k=0;k<(G._deckHolders||0)&&k<spots.length&&k<shooters.length;k++){\n"
        "      const T=spots[k], m=shooters[k];\n"
        "      m.ea=T.ea; m.edist=T.edist; m.lvl=DECK_LVL; m.gcov=0; } }\n"
        "}",
        'the men who hold it')

    # ---- 2. draw it --------------------------------------------------------
    demo = subN(demo,
        "  const epos=e=>fieldPos(e,W,H,cx,cy);",
        "  /* V90B LEVELS ARE DRAWN RELATIVE TO YOU. The deck floats a storey above the\n"
        "     lot when you are on the ground, and becomes the floor under your feet the\n"
        "     moment you climb it, with the whole lot dropping away below. ONE SCENE. */\n"
        "  const DECK_H=ring*1.15;\n"
        "  const lvlDY=l=>-(((l|0)-(G.lvl||0))*DECK_H);\n"
        "  if(G.deck&&G.deck.length){ const dz=lvlDY(DECK_LVL), t2=ring;\n"
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
        "      if(T.stair){ x.fillStyle='rgba(232,200,138,0.30)';   /* the way up, drawn as steps */\n"
        "        for(let s2=0;s2<3;s2++)x.fillRect(p[0]-t2*0.42,ty+t2*(0.18+s2*0.26),t2*0.84,t2*0.10); } }\n"
        "    /* the lip: a bright edge so the deck reads as a THING with a height */\n"
        "    x.strokeStyle='rgba(226,208,168,0.85)'; x.lineWidth=2.5;\n"
        "    for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy), ty=p[1]-t2*0.5+dz;\n"
        "      if(!deckTileAt(pXY(T)[0],pXY(T)[1]-1)){ x.beginPath();\n"
        "        x.moveTo(p[0]-t2*0.5,ty); x.lineTo(p[0]+t2*0.5,ty); x.stroke(); } } }\n"
        "  const epos=e=>{ const p=fieldPos(e,W,H,cx,cy); return [p[0],p[1]+lvlDY(e.lvl)]; };",
        'draw the deck')

    demo = subN(demo,
        "    for(const e of G.e){ if(!(e.dead||(e.downed&&e._fellAt&&_nowD>e._fellAt)))continue; const _ep=fieldPos(e,W,H,cx,cy);",
        "    for(const e of G.e){ if(!(e.dead||(e.downed&&e._fellAt&&_nowD>e._fellAt)))continue; const _ep=epos(e);   /* V90B: the dead lie on the floor they fell on */",
        'the dead keep their floor')

    # ---- 3. the button -----------------------------------------------------
    demo = subN(demo,
        '<button id="shovebtn" class="cbtn" style="display:none;border-color:#5fbf6a;color:#8fe89a">SHOVE</button>',
        '<button id="shovebtn" class="cbtn" style="display:none;border-color:#5fbf6a;color:#8fe89a">SHOVE</button>\n'
        '    <button id="stairbtn" class="cbtn" style="display:none;border-color:#c8a23a;color:#e8c88a">STAIRS</button>',
        'stairs button')

    demo = subN(demo,
        "function updShoveBtn(){ const b=D('shovebtn'); if(!b)return;",
        "/* V90B THE STAIRS. It shows on the same terms SHOVE does: only when you can\n"
        "   actually use it. ONE STAMINA, NO TURN -- Paolo 7/26 LOCKED, and his own words\n"
        "   this session: \"sprinting and not losing a turn can help that.\" Taking the high\n"
        "   ground is the same class of move as closing the distance, so it costs the same. */\n"
        "function updStairBtn(){ const b=D('stairbtn'); if(!b)return;\n"
        "  const s=(G.phase==='cover'&&!G.over&&!G.inc)?stairNear():null;\n"
        "  b.style.display=s?'':'none';\n"
        "  if(s)b.textContent=(myLvl()===DECK_LVL?'DOWN':'UP')+' \\u00b7 1 STA'; }\n"
        "function doStairs(){ if(G.inc||G.over||G.phase!=='cover')return;\n"
        "  const s=stairNear(); if(!s)return; audio();\n"
        "  if(!spendStam(1)){ setRead('NO STAMINA','the climb costs one pip','#8a7d66'); return; }\n"
        "  const up=(myLvl()!==DECK_LVL);\n"
        "  G.lvl=up?DECK_LVL:0;\n"
        "  /* stepping onto the stair tile itself, so you are ON the deck, not beside it */\n"
        "  if(up)worldShift(Math.cos(s.ea)*s.edist,Math.sin(s.ea)*s.edist);\n"
        "  try{updateGeomCover();}catch(_e){} try{updateStanceFacing();}catch(_e){}\n"
        "  renderBoard(); updGap(); updStairBtn(); updShoveBtn();\n"
        "  setRead(up?'HIGH GROUND':'BACK DOWN',\n"
        "    up?'cover on the lot stops counting — both ways':'the stone works again','#e8c88a'); }\n"
        "function updShoveBtn(){ try{updStairBtn();}catch(_e){}\n"
        "  const b=D('shovebtn'); if(!b)return;",
        'the stairs verb')

    demo = subN(demo,
        "  const ab=D('arenabtn'); if(ab)ab.addEventListener('click',()=>{ audio();",
        "  const sb2=D('stairbtn'); if(sb2)sb2.addEventListener('click',()=>doStairs());\n"
        "  const ab=D('arenabtn'); if(ab)ab.addEventListener('click',()=>{ audio();",
        'stairs wiring')

    # ---- 4. the read says which floor --------------------------------------
    demo = subN(demo,
        "  r.innerHTML='<span style=\"color:'+rangeCol(e)+'\">'+tier+'</span>'",
        "  const _lv=((e.lvl|0)!==myLvl());\n"
        "  /* V90B: a floor between you is the loudest thing on this line, because it is\n"
        "     the one that turns every piece of stone on the lot off. */\n"
        "  const _lvTxt=_lv?('<b style=\"color:#e8c88a\">'+(myLvl()===DECK_LVL?'HIGH GROUND':'HE IS ABOVE YOU')\n"
        "    +'</b> <span style=\"color:#5a5040\">·</span> no cover counts <span style=\"color:#5a5040\">·</span> '):'';\n"
        "  r.innerHTML=_lvTxt+'<span style=\"color:'+rangeCol(e)+'\">'+tier+'</span>'",
        'the read says which floor')

    # ---- 5. a fresh fight starts on the ground -----------------------------
    demo = subN(demo,
        "  G.litter=[];       /* AF: fresh ground */",
        "  G.litter=[];       /* AF: fresh ground */\n"
        "  G.lvl=0;           /* V90B: every fight starts on the lot */",
        'fresh fights start on the lot')

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
