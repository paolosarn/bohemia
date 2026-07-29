#!/usr/bin/env python3
"""BOHEMIA - COMBAT v99: YOU CAN THROW A GRENADE. (Paolo 7/29: "grenade first")

He asked "when can i start throwing grenades or molotovs?" and the honest answer
was: never, today. The only grenade in the game was thrown AT you. He then ruled
the order: GRENADE FIRST.

--- WHAT ALREADY EXISTED, WHICH IS MOST OF IT ----------------------------
grenadeTurn() is an ENEMY action and it is good: a fused object anchored to a
world tile, a pulsing danger marker with the count drawn on it, a blast ring, and
the rule that MOVING OFF THE TILE IS HOW YOU SURVIVE IT. All of that is reused
verbatim; this adds the other direction.

--- THE ONE DESIGN DECISION, AND IT IS THE WHOLE POINT -------------------
A grenade could have been "press for damage". It is not, because Paolo has ruled
there are almost no ways to increase damage and because damage does not create a
decision. So:

*** THEY GET THE SAME TWO BEATS YOU DO. ***

An enemy standing in the blast when the fuse ticks STEPS OFF THE TILE, using the
same rule the game already teaches you: move or eat it. That single choice turns
the grenade from free damage into a POSITIONING TOOL:

  * it FLUSHES people out of cover. A man tucked behind stone who has to step off
    a tile is a man who is briefly not behind that stone.
  * it MOVES the fight. You can push a shooter off an angle without killing him.
  * it still kills whoever cannot or does not clear it, so it is never nothing.

That is area denial, which is the north star word (positioning), and it is the
same argument I made for the molotov. It applies to the grenade too.

--- THE COST ------------------------------------------------------------
A throw ENDS YOUR TURN and eats the return volley, exactly like popping out to
shoot does. That is the trade the whole fight is built on and a grenade does not
get to opt out of it. It also costs a stamina pip.

TWO PER FIGHT (a dial). Enough to feel it, few enough that it stays a decision
rather than the default opening.

--- WHAT IT IS NOT ------------------------------------------------------
A grenade kill is NOT a killshot: it does not start the dial cinematic and it
does not buy a chain shot. The chain is the reward for the DIAL, and a thrown
object never touches the dial. Keeping that line clean is why the allowance
mechanic he just ruled on still means something.

--- THE READ ------------------------------------------------------------
YOUR grenade draws in warm amber with its count on it; THEIRS stays red. Two
fused objects on one field that behave identically would be unreadable, and the
one thing you must never be confused about is which one is about to hurt you.

REUSE CHECK: no art or audio is cooked, read or written. This reuses the existing
grenade object shape, the danger-tile draw, the blast ring, applyDamage, the
stamina spend, the turn-end path and the existing sounds. The approved
o_fx_flame_burst_00 / spark loops are NOT wired here: that is TF-CMB-007's
delivery and wiring them from two places would be the duplicate this lane keeps
warning other lanes about.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_grenade_throw_patch.py
Gate:  node gates/combat_lab_gate.js   (section 33)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V99 YOU CAN THROW A GRENADE'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # ---- the throw, the tick, and the rule that they move too --------------
    demo = subN(demo,
        "function tickTurnEnd(){ meleeTurnRun();",
        "/* ===== V99 YOU CAN THROW A GRENADE (Paolo 7/29: \"grenade first\") =====\n"
        "   The only grenade in this game was thrown AT you. This is the other\n"
        "   direction, and it reuses the enemy grenade's whole shape: a fused object on\n"
        "   a world tile, a marker with the count on it, and MOVE OFF IT OR EAT IT.\n"
        "   *** THEY GET THE SAME TWO BEATS YOU DO. *** An enemy caught in the blast\n"
        "   steps off the tile, which is what turns this from free damage into a\n"
        "   POSITIONING TOOL: it flushes a man out of cover, it pushes a shooter off an\n"
        "   angle, and it still kills whoever cannot clear it. Damage is the thing Paolo\n"
        "   ruled there is no room to grow; moving people is not. */\n"
        "const P_GREN_R=1.5, P_GREN_FUSE=2, P_GREN_PER_FIGHT=2;   /* all dials */\n"
        "function gxy(o){ return [Math.cos(o.ea)*o.edist, Math.sin(o.ea)*o.edist]; }\n"
        "function canThrow(){ return !G.over && G.phase==='cover' && !G.inc && !G.pGren\n"
        "  && (G.pGrenLeft||0)>0 && aliveEnemies().length>0; }\n"
        "function doThrow(){\n"
        "  if(G.over||G.phase!=='cover'||G.inc)return;\n"
        "  if(G.pGren){ setRead('ONE IN THE AIR','wait for it to go off','#8a7d66'); return; }\n"
        "  if((G.pGrenLeft||0)<=0){ setRead('NO GRENADES','none left this fight','#8a7d66'); return; }\n"
        "  const ti=(G.selTarget!=null&&G.selTarget>=0)?G.selTarget:pickTarget();\n"
        "  const t=G.e[ti];\n"
        "  if(!t||t.dead){ setRead('NOTHING TO THROW AT','pick a target first','#8a7d66'); return; }\n"
        "  if(!spendStam(1)){ setRead('NO STAMINA','a throw costs 1 pip','#8a7d66'); return; }\n"
        "  audio(); G.pGrenLeft--;\n"
        "  /* it lands ON HIS TILE. Where it lands is the decision; the fuse is the cost. */\n"
        "  G.pGren={ea:t.ea,edist:t.edist,fuse:P_GREN_FUSE,r:P_GREN_R,_at:performance.now()};\n"
        "  try{sndShot();}catch(_e){}\n"
        "  setRead('GRENADE OUT','2 beats on '+(t.n||'him')+' -- they get the same two beats you do','#e8b04a');\n"
        "  updGrenBtn(); renderBoard(); updGap();\n"
        "  /* A THROW IS YOUR ACTION. It ends the turn and eats the volley, exactly like\n"
        "     popping out to shoot does. That is the trade the whole fight is built on. */\n"
        "  endTurnReturn(); }\n"
        "/* the same rule the game already teaches YOU, applied to them */\n"
        "function stepOffBlast(e,gp){\n"
        "  const p=gxy(e), dx=p[0]-gp[0], dy=p[1]-gp[1];\n"
        "  const L=Math.hypot(dx,dy)||1;\n"
        "  const nx=p[0]+Math.round(dx/L), ny=p[1]+Math.round(dy/L);\n"
        "  if(nx===p[0]&&ny===p[1])return false;\n"
        "  e.ea=Math.atan2(ny,nx); e.edist=Math.hypot(nx,ny);\n"
        "  e.gcov=false;   /* he MOVED: whatever stone he was tucked behind, he is not behind it now */\n"
        "  return true; }\n"
        "function pGrenTurn(){ if(!G.pGren||G.over)return;\n"
        "  G.pGren.fuse--;\n"
        "  const gp=gxy(G.pGren);\n"
        "  if(G.pGren.fuse>0){\n"
        "    let moved=0;\n"
        "    for(const e of G.e){ if(e.dead||e.downed||e.broken)continue;\n"
        "      const p=gxy(e); if(Math.hypot(p[0]-gp[0],p[1]-gp[1])<G.pGren.r&&stepOffBlast(e,gp))moved++; }\n"
        "    if(moved)setRead('THEY SCATTER',moved+' moved off the tile -- that is the grenade working','#e8b04a');\n"
        "    updateGeomCover(); return; }\n"
        "  /* it goes off. Same bands the enemy grenade uses on you: stand = full,\n"
        "     one step = a clip, two = clean. */\n"
        "  let killed=0, hurt=0;\n"
        "  for(const e of G.e){ if(e.dead||e.downed)continue;\n"
        "    const p=gxy(e), d=Math.hypot(p[0]-gp[0],p[1]-gp[1]);\n"
        "    let dmg=0; if(d<0.9)dmg=40+Math.floor(Math.random()*12); else if(d<1.5)dmg=18+Math.floor(Math.random()*8);\n"
        "    if(dmg<=0)continue;\n"
        "    applyDamage(e,dmg); hurt++;\n"
        "    if(e.hp<=0){ e.dead=true; killed++;\n"
        "      /* NOT A KILLSHOT: no dial cinematic, no chain. The chain is the reward for\n"
        "         the DIAL and a thrown object never touches the dial. */\n"
        "      e._deathVar=Math.floor(Math.random()*3); try{addWound(e);}catch(_e){}\n"
        "      e._deadAt=performance.now()+120; } }\n"
        "  G._grenadeBlast={ea:G.pGren.ea,edist:G.pGren.edist,t:performance.now()}; G.pGren=null;\n"
        "  G.enemiesLeft=aliveEnemies().length;\n"
        "  onOffbeat(()=>{ try{sndKill();}catch(_e){}\n"
        "    setRead(killed?('BLAST -- '+killed+' DOWN'):(hurt?'BLAST':'BLAST -- NOTHING'),\n"
        "      killed?'they did not clear the tile':(hurt?'clipped, not killed':'they all cleared it -- you moved them, that is the trade'),\n"
        "      killed?'#e8593a':'#e8b04a'); });\n"
        "  updGrenBtn(); updateGeomCover(); renderBoard(); updGap();\n"
        "  if(aliveEnemies().length===0){ try{winGame();}catch(_e){} } }\n"
        "function updGrenBtn(){ const b=D('grenbtn'); if(!b)return;\n"
        "  const n=(G.pGrenLeft||0);\n"
        "  b.textContent='GRENADE '+n;\n"
        "  b.disabled=!canThrow();\n"
        "  b.style.opacity=canThrow()?'1':'0.45'; }\n"
        "function tickTurnEnd(){ meleeTurnRun();",
        'the player grenade throw')

    # ---- it ticks with everything else -------------------------------------
    demo = subN(demo,
        "bleedTick(); grenadeTurn();",
        "bleedTick(); pGrenTurn(); grenadeTurn();   /* V99: yours resolves first, so a man you killed is not also throwing */",
        'the thrown grenade ticks on the turn')

    # ---- the button --------------------------------------------------------
    demo = subN(demo,
        '    <button id="vaultbtn" class="cbtn" style="border-color:#8fb0e8;color:#c0d0e8">VAULT</button>',
        '    <button id="vaultbtn" class="cbtn" style="border-color:#8fb0e8;color:#c0d0e8">VAULT</button>\n'
        '    <button id="grenbtn" class="cbtn" style="border-color:#c8a23a;color:#e8c88a" title="throw it on your target\'s tile. it ends your turn, and they get the same two beats you do">GRENADE</button>',
        'the grenade button exists')

    demo = subN(demo,
        "D('newenc').addEventListener('click',()=>{ audio(); newEncounter(); });",
        "D('grenbtn').addEventListener('click',()=>{ audio(); doThrow(); });\n"
        "D('newenc').addEventListener('click',()=>{ audio(); newEncounter(); });",
        'the grenade button is wired')

    # ---- a fresh fight is a fresh pouch ------------------------------------
    demo = subN(demo,
        "G.grenade=null; G._grenadeBlast=null; G._grenadeThrown=false; updStam();",
        "G.grenade=null; G._grenadeBlast=null; G._grenadeThrown=false;\n"
        "  G.pGren=null; G.pGrenLeft=P_GREN_PER_FIGHT;   /* V99: fresh fight, fresh pouch */\n"
        "  try{updGrenBtn();}catch(_e){}\n"
        "  updStam();",
        'a fresh fight refills the pouch')

    # ---- yours draws AMBER so it can never be confused with theirs ----------
    demo = subN(demo,
        "  if(!aimo&&G.grenade){   /* V60 GRENADE: the pulsing danger tile + fuse count */",
        "  /* V99 YOUR grenade, in warm amber. Two fused objects on one field that look\n"
        "     the same would be unreadable, and the one thing you must never be confused\n"
        "     about is which of them is about to hurt YOU. */\n"
        "  if(!aimo&&G.pGren){\n"
        "    const yp=fieldPos(G.pGren,W,H,cx,cy), rr2=ring*1.35, pu2=0.5+0.5*Math.sin(performance.now()*0.012);\n"
        "    x.save(); x.fillStyle='rgba(232,176,74,'+(0.12+pu2*0.12).toFixed(3)+')';\n"
        "    x.beginPath(); x.arc(yp[0],yp[1],rr2*0.72,0,7); x.fill();\n"
        "    x.strokeStyle='rgba(232,176,74,'+(0.55+pu2*0.35).toFixed(3)+')'; x.lineWidth=3; x.setLineDash([7,5]);\n"
        "    x.beginPath(); x.arc(yp[0],yp[1],rr2*(0.66+pu2*0.16),0,7); x.stroke(); x.setLineDash([]);\n"
        "    x.fillStyle='#ffeccd'; x.font='bold '+Math.round(ring*0.85)+'px Space Grotesk,sans-serif';\n"
        "    x.textAlign='center'; x.textBaseline='middle';\n"
        "    x.fillText(String(G.pGren.fuse),yp[0],yp[1]);\n"
        "    x.textAlign='left'; x.textBaseline='alphabetic'; x.restore(); }\n"
        "  if(!aimo&&G.grenade){   /* V60 GRENADE: the pulsing danger tile + fuse count */",
        'your grenade draws amber')

    # ---- and the world carries it, like every other anchored thing ---------
    demo = subN(demo,
        "  if(G.grenade)mv(G.grenade,0.02);   /* V60 GRENADE: anchored to its tile, so a move carries you off it */",
        "  if(G.grenade)mv(G.grenade,0.02);   /* V60 GRENADE: anchored to its tile, so a move carries you off it */\n"
        "  if(G.pGren)mv(G.pGren,0.02);       /* V99: yours is anchored to ITS tile the same way */",
        'the world carries your grenade too')

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
