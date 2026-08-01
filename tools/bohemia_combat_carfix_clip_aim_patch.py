#!/usr/bin/env python3
"""BOHEMIA - COMBAT v104: THE CAR STAYS, THE RIGHT CLIP PLAYS, AND YOU AIM THE GRENADE.

Three things Paolo reported, all three mine.

=========================================================================
1. "Combat ends and then the car disappears"
=========================================================================
Not combat ending. THE MOMENT YOU MOVE.

v103 picked which of a car's six cells draws the sprite by comparing the cell's
CURRENT world position to the position it was created at:

    if(Math.abs(q0[0]-P.carOx)>0.01||Math.abs(q0[1]-P.carOy)>0.01)continue;

*** BUT THIS FIELD IS POLAR AND THE WORLD MOVES UNDER YOU. *** worldShift slides
every anchored thing when you step, so after one move no cell matches its birth
coordinate any more, NO cell passes the test, and the whole car stops drawing
while still being solid cover you cannot see. camHome() at the end of a fight
recentres the world, which is why he noticed it there.

I STORED A WORLD COORDINATE IN A WORLD THAT MOVES. The fix is to stop storing a
coordinate at all: one cell is flagged `nose:true` at creation and the flag is
what draws. A flag cannot drift.

=========================================================================
2. "when people are crouching with the dead shot... they were doing
    animations they weren't supposed to be"
=========================================================================
He is right and v102 picked the wrong clip. I wrote that rise112 was "the body
coming up out of the crouch". IT IS NOT. It is baked from **'floor-rise'** --
a man getting up OFF THE FLOOR. So scrubbing it with the needle played
get-up-off-the-ground on a man who was crouching behind a wall.

THE CLIP THAT ACTUALLY IS WHAT I DESCRIBED is cfire112, baked from
**'cover-fire'** at four phases: the peek up out of cover and onto the gun. The
demo's own comment for it reads "covered gun up = peek-and-snap, never a stand".

So now the needle scrubs THAT:
    miss territory -> cover112, the tuck (unchanged, and he likes it)
    coming in      -> cfire112 indexed by exposure, rising onto the gun
    dead centre    -> cfire112's last frame, up and exposed
floor-rise goes back to being what it always was: what you play when a man gets
up off the floor.

*** THE LESSON, WRITTEN DOWN: I NAMED A CLIP FROM ITS VARIABLE NAME INSTEAD OF
FROM WHAT IT IS BAKED FROM. rise112 sounds like rising. It is one grep to the
bake line to find out it is not. ***

=========================================================================
3. "I think you did it like auto throw which I guess but I didn't see any
    damage... it definitely did not allow you to choose to be wrong"
=========================================================================
Both halves are right, and the second half is the real criticism.

AUTO-THROW HAS NO DECISION IN IT. v103 threw at whoever was already targeted, so
there was nothing to judge and no way to misjudge it. A grenade whose landing
spot you cannot choose is a damage button.

NOW YOU AIM IT: press GRENADE to arm, then TAP THE TILE. Any tile. The tap
already exists on this canvas and already sees through the zoom, so this reuses
the handler that has always been there.

*** AND YOU CAN NOW BE WRONG, WHICH IS THE WHOLE POINT. *** Throw it short and
YOU are in the blast, on the same distance bands the enemy grenade has always
used on you. There is no minimum range and no safety check. Choosing badly costs
you, which is what makes choosing mean anything.

WHY HE SAW NO DAMAGE: it very likely did land some. They step off the tile on the
fuse tick (one tile), which lands them at distance 1.0 -- still inside the 1.5
clip band -- so they took 18-25 and lived. The read said "clipped, not killed"
and that was the entire feedback. FIXED: every man the blast touches now takes a
floating damage number over his body, and the read names the count hurt as well
as the count killed. If a grenade does something, you see the number.

REUSE CHECK: no art or audio is cooked, read or written. Reuses the existing
canvas tap handler, the existing floating-number path, cfire112/cover112 (already
baked), and applyDamage. Nothing new is drawn.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_carfix_clip_aim_patch.py
Gate:  node gates/combat_lab_gate.js   (section 38)

RIG CHECK (RIG IS LAW, Paolo 7/26/26): this patch AUTHORS NO RIG GEOMETRY and
  reshapes nothing. It only CHOOSES which already-baked clip a covered body
  plays -- swapping the v102 pick (rise112, baked from 'floor-rise') for the one
  that is actually the peek out of cover (cfire112, baked from 'cover-fire').
  The clips, their joints and Paolo's painted regions are untouched; the change
  is an index into an existing bank.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V104 THE CAR STAYS'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # ---- 1. the car keeps a FLAG, not a coordinate -------------------------
    demo = subN(demo,
        "    G.pillars.push({ea:Math.atan2(c[1],c[0]),edist:Math.hypot(c[0],c[1]),\n"
        "      r:0.5,tall:tall,car:cid,carOx:ox,carOy:oy,carVert:!!vert,\n"
        "      carArt:cid%Math.max(1,CAR_B64.length)}); }",
        "    /* V104 THE CAR STAYS: a FLAG, not a coordinate. v103 remembered where the\n"
        "       nose cell was\n"
        "       BORN and compared the live position to it -- but this field is polar and\n"
        "       worldShift slides every anchored thing when you step, so after one move no\n"
        "       cell matched and the entire car stopped drawing while staying solid cover\n"
        "       you could not see. I stored a world coordinate in a world that moves. */\n"
        "    G.pillars.push({ea:Math.atan2(c[1],c[0]),edist:Math.hypot(c[0],c[1]),\n"
        "      r:0.5,tall:tall,car:cid,nose:(c===cells[0]),carVert:!!vert,\n"
        "      carArt:cid%Math.max(1,CAR_B64.length)}); }",
        'the car nose is a flag')

    demo = subN(demo,
        "      const q0=pXY(P);\n"
        "      if(Math.abs(q0[0]-P.carOx)>0.01||Math.abs(q0[1]-P.carOy)>0.01)continue;   /* only the nose cell draws */",
        "      if(!P.nose)continue;   /* V104: the flagged cell draws; a flag cannot drift */",
        'the car draws off the flag')

    # ---- 2. the needle scrubs the RIGHT clip -------------------------------
    demo = subN(demo,
        "      const R=L.rise112;\n"
        "      if(R&&R.length)return R[Math.max(0,Math.min(R.length-1,Math.round(e._expo*(R.length-1))))];\n"
        "      if(e._expo>0.5&&L.cfire112)return L.cfire112[0];\n"
        "      if(L.cover112&&L.cover112.length)return L.cover112[0]; } }",
        "      /* V104 THE RIGHT CLIP. v102 scrubbed rise112, which I described as \"the body\n"
        "         coming up out of the crouch\". IT IS NOT: rise112 is baked from\n"
        "         'floor-rise', a man getting up OFF THE FLOOR, so a crouching man played\n"
        "         get-up-off-the-ground and Paolo saw \"animations they weren't supposed to\n"
        "         be [doing]\". cfire112 is baked from 'cover-fire' -- the peek up out of\n"
        "         cover onto the gun, whose own comment reads \"never a stand\". That is the\n"
        "         clip I meant all along.\n"
        "         I NAMED A CLIP FROM ITS VARIABLE NAME INSTEAD OF FROM WHAT IT BAKES. */\n"
        "      const CF=L.cfire112, CV=L.cover112;\n"
        "      if(e._expo<=0.02&&CV&&CV.length)return CV[0];                 /* tucked */\n"
        "      if(CF&&CF.length)return CF[Math.max(0,Math.min(CF.length-1,Math.round(e._expo*(CF.length-1))))];\n"
        "      if(CV&&CV.length)return CV[0]; } }",
        'the needle scrubs the cover-fire clip')

    # ---- 3a. arming, and the throw takes a tile ----------------------------
    demo = subN(demo,
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
        "  endTurnReturn(); }",
        "/* V104 YOU AIM IT. Paolo: \"I think you did it like auto throw which I guess...\n"
        "   it definitely did not allow you to choose to be wrong.\"\n"
        "   He is right: v103 threw at whoever was already targeted, so there was nothing\n"
        "   to judge and no way to misjudge. A grenade whose landing spot you cannot pick\n"
        "   is a damage button.\n"
        "   Press to ARM, then TAP THE TILE. Any tile. *** INCLUDING ONE THAT CATCHES YOU:\n"
        "   there is no minimum range and no safety check, because choosing badly has to\n"
        "   cost you or choosing means nothing. *** */\n"
        "function doThrow(){\n"
        "  if(G.over||G.phase!=='cover'||G.inc)return;\n"
        "  if(G.pGren){ setRead('ONE IN THE AIR','wait for it to go off','#8a7d66'); return; }\n"
        "  if((G.pGrenLeft||0)<=0){ setRead('NO GRENADES','none left this fight','#8a7d66'); return; }\n"
        "  if(G.grenArm){ G.grenArm=false; updGrenBtn(); setRead('THROW OFF','kept it','#8a7d66'); return; }\n"
        "  audio(); G.grenArm=true; G.dashArm=false; G.sprintArm=false;   /* one armed move at a time */\n"
        "  updGrenBtn(); renderBoard();\n"
        "  setRead('TAP WHERE IT LANDS','any tile -- short throws catch YOU too','#e8b04a'); }\n"
        "/* the tile you tapped, in player-relative cells. The floor is drawn on a linear\n"
        "   grid (cell centre = cx + (wx-offx)*ring), so this is its exact inverse -- not a\n"
        "   guess, and not fieldPos, which clamps for bodies. */\n"
        "function tapTile(x,y){ const F=G._field; if(!F)return null;\n"
        "  return [Math.round((x-F.cx)/F.ring), Math.round((y-F.cy)/F.ring)]; }\n"
        "function throwAt(tx,ty){\n"
        "  if(!spendStam(1)){ setRead('NO STAMINA','a throw costs 1 pip','#8a7d66'); return; }\n"
        "  audio(); G.pGrenLeft--; G.grenArm=false;\n"
        "  G.pGren={ea:Math.atan2(ty,tx),edist:Math.hypot(tx,ty),fuse:P_GREN_FUSE,r:P_GREN_R,_at:performance.now()};\n"
        "  try{sndShot();}catch(_e){}\n"
        "  const d0=Math.hypot(tx,ty);\n"
        "  setRead('GRENADE OUT', d0<2.2\n"
        "    ? '2 beats -- THAT IS ON TOP OF YOU, MOVE'\n"
        "    : '2 beats -- they get the same two beats you do','#e8b04a');\n"
        "  updGrenBtn(); renderBoard(); updGap();\n"
        "  /* A THROW IS YOUR ACTION. It ends the turn and eats the volley, exactly like\n"
        "     popping out to shoot does. That is the trade the whole fight is built on. */\n"
        "  endTurnReturn(); }",
        'the grenade is armed and aimed')

    # ---- 3b. the tap throws it --------------------------------------------
    demo = subN(demo,
        "  const {cx,cy,ring,pos}=G._field; const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];",
        "  const {cx,cy,ring,pos}=G._field; const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];\n"
        "  /* V104: an armed grenade eats the tap, before anything else can claim it */\n"
        "  if(G.grenArm){ const t3=tapTile(x,y);\n"
        "    if(t3){ throwAt(t3[0],t3[1]); return; } }",
        'the tap throws the grenade')

    # ---- 3c. you can eat your own, and the damage is VISIBLE ---------------
    demo = subN(demo,
        "  let killed=0, hurt=0;\n"
        "  for(const e of G.e){ if(e.dead||e.downed)continue;\n"
        "    const p=gxy(e), d=Math.hypot(p[0]-gp[0],p[1]-gp[1]);\n"
        "    let dmg=0; if(d<0.9)dmg=40+Math.floor(Math.random()*12); else if(d<1.5)dmg=18+Math.floor(Math.random()*8);\n"
        "    if(dmg<=0)continue;\n"
        "    applyDamage(e,dmg); hurt++;",
        "  let killed=0, hurt=0;\n"
        "  /* V104 YOU CAN BE WRONG. Your own grenade measures YOUR distance on the same\n"
        "     bands the enemy's has always used on you. Throw it short and you eat it. */\n"
        "  { const dSelf=Math.hypot(gp[0],gp[1]);\n"
        "    let sd=0; if(dSelf<0.9)sd=40+Math.floor(Math.random()*12); else if(dSelf<1.5)sd=18+Math.floor(Math.random()*8);\n"
        "    if(sd>0){ G.pHP=Math.max(0,G.pHP-sd); try{updPlayer();}catch(_e){} try{addWound(G);}catch(_e){} G.steady=0;\n"
        "      onOffbeat(()=>{ try{hurtFlash();}catch(_e){} setRead('YOUR OWN GRENADE','-'+sd+' -- you threw it short','#e8593a'); });\n"
        "      if(G.pHP<=0){ G.pGren=null; try{loseGame();}catch(_e){} return; } } }\n"
        "  for(const e of G.e){ if(e.dead||e.downed)continue;\n"
        "    const p=gxy(e), d=Math.hypot(p[0]-gp[0],p[1]-gp[1]);\n"
        "    let dmg=0; if(d<0.9)dmg=40+Math.floor(Math.random()*12); else if(d<1.5)dmg=18+Math.floor(Math.random()*8);\n"
        "    if(dmg<=0)continue;\n"
        "    applyDamage(e,dmg); hurt++;\n"
        "    /* V104: \"I didn't see any damage.\" It very likely DID land -- they step one\n"
        "       tile, which is still inside the clip band, so they took 18-25 and lived and\n"
        "       the only feedback was one line of text. Now the number is ON HIM. */\n"
        "    try{ G._fx.push({type:'dmgnum',ea:e.ea,edist:e.edist,lvl:e.lvl|0,n:dmg,t:0,life:1.0}); }catch(_e){}",
        'you can eat your own, and the damage shows')

    # ---- 3d. the floating number renders -----------------------------------
    demo = subN(demo,
        "  for(const p of G._fx){ if(p.type!=='drip'||p.t<0)continue;   /* AS render: a drop falls and darkens the ground */",
        "  /* V104 THE DAMAGE NUMBER, on the man, on his storey. */\n"
        "  for(const p of G._fx){ if(p.type!=='dmgnum'||p.t<0)continue;\n"
        "    const q6=p.t/p.life, _np=fieldPos(p,W,H,cx,cy);\n"
        "    x.save(); x.globalAlpha=Math.max(0,1-q6);\n"
        "    x.fillStyle='#ffd2c0'; x.font='bold '+Math.round(ring*0.62)+'px Space Grotesk,sans-serif';\n"
        "    x.textAlign='center';\n"
        "    x.fillText('-'+p.n, _np[0], _np[1]+lvlDY(p.lvl|0)-ring*1.1-q6*ring*0.9);\n"
        "    x.textAlign='left'; x.restore(); }\n"
        "  for(const p of G._fx){ if(p.type!=='drip'||p.t<0)continue;   /* AS render: a drop falls and darkens the ground */",
        'the damage number renders')

    # ---- 3e. the read counts what it hurt, not just what it killed ---------
    demo = subN(demo,
        "    setRead(killed?('BLAST -- '+killed+' DOWN'):(hurt?'BLAST':'BLAST -- NOTHING'),\n"
        "      killed?'they did not clear the tile':(hurt?'clipped, not killed':'they all cleared it -- you moved them, that is the trade'),\n"
        "      killed?'#e8593a':'#e8b04a'); });",
        "    setRead(killed?('BLAST -- '+killed+' DOWN'):(hurt?('BLAST -- '+hurt+' HIT'):'BLAST -- NOTHING'),\n"
        "      killed?'they did not clear the tile':(hurt?(hurt+' clipped, none killed -- the numbers are on them'):'they all cleared it -- you moved them, that is the trade'),\n"
        "      killed?'#e8593a':'#e8b04a'); });",
        'the read counts the hits')

    # ---- 3f. the button says it is armed -----------------------------------
    demo = subN(demo,
        "  b.textContent='GRENADE '+n;\n"
        "  b.disabled=!canThrow();\n"
        "  b.style.opacity=canThrow()?'1':'0.45'; }",
        "  b.textContent=G.grenArm?'TAP A TILE':('GRENADE '+n);\n"
        "  b.disabled=!canThrow()&&!G.grenArm;\n"
        "  b.style.borderColor=G.grenArm?'#e8593a':'#c8a23a';\n"
        "  b.style.opacity=(canThrow()||G.grenArm)?'1':'0.45'; }",
        'the button says it is armed')

    # ---- 3g. a fresh fight disarms ----------------------------------------
    demo = subN(demo,
        "  G.pGren=null; G.pGrenLeft=P_GREN_PER_FIGHT;   /* V99: fresh fight, fresh pouch */",
        "  G.pGren=null; G.pGrenLeft=P_GREN_PER_FIGHT; G.grenArm=false;   /* V99: fresh fight, fresh pouch. V104: never armed */",
        'a fresh fight disarms the throw')

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
