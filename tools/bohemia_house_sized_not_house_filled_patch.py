#!/usr/bin/env python3
"""
V233 -- HOUSE-SIZED, NOT HOUSE-FILLED: THE NEIGHBOURS STAND UP  (COMBAT, [house tiles back], round 3)

REUSE CHECK: nothing is cooked. The neighbours' houses are the same baked house V231 made from the
fight's own STREET_IMG 'house' and 'wall' banks (COOK's cooked street bank); the only new pixels are
a hole in the roof, three joists and some broken shingle, drawn once per size into the same cache.
No bank file is opened here.

PAOLO 9/28, on [house tiles back]: "one tile is the size of a house doesn't mean every tile is a
house; it still has to look like a city; we have neighbours, we have so many assets, we have
streets." The board is cut from a block: houses, yards, streets, sidewalks and kerbs, cars, the roof
tile. A board of only houses is wrong. GATE OWED: a street and a non-house kind on every board.
RULE 37g (Paolo 9/27): high ground is a roof; "a standing roof is the mound, a collapsed one is not."
RULE 46 (Paolo 9/29): a board has tile BLOCKERS, and "how did Battle Brothers do it" answers first.

WHAT V231 LEFT: the street four houses wide and one climbable house, but the lots were yards and
walls only, because a roof drawn flat where men walk was the 9/18 checkerboard. So the neighbours
were missing.

WHAT THIS DOES:
1. THE LOT IS LAID OUT LIKE A STREET OF HOUSES, counted from the kerb on each side: a row of houses
   facing the street (every third tile a driveway gap between neighbours), their back yards, the
   alley wall, the next street's back yards, the next street's houses. On the house board only.
2. EVERY HOUSE STANDS UP AND IS A BLOCKER. The ground under it is yard; the house is drawn standing
   (V231's bake) and it is a tall piece of cover the size of a house: you cannot walk through it, you
   can hide behind it, it stops a line of fire -- which is Battle Brothers' tile blocker, dressed as a
   house (the cover pieces already do all three; a house is simply one of them). The enemy's own
   step already refuses a cell inside a piece of cover.
3. THE ONE YOU CAN CLIMB HAS ITS ROOF; THE NEIGHBOURS' ROOFS HAVE FALLEN IN. Rule 37g in pixels: a
   standing roof is high ground, a collapsed one is not, so the neighbours show why you cannot go
   up them. The climbable house is now one of the row facing the street, two houses from him.
4. NOBODY STARTS INSIDE A HOUSE: a crate rolled onto a house tile goes (a car whole), an enemy who
   spawns on one steps to the nearest open tile, and so does the way out. No die is drawn anywhere.

NO DAMAGE BEFORE THE DIAL: no chance, hit, reach or damage number moves. What changes is where
things are, and a house is cover the way a crate already is.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__HOUSE_SIZED_NOT_HOUSE_FILLED__'

EDITS = [
 # 1. the lot layout
 ("""  if(((wx%4)+4)%4===0) return 'wall';       /* the side wall between properties */
  if(houseOn()) return 'yard';""",
  """  /* V233 __HOUSE_SIZED_NOT_HOUSE_FILLED__: on the house board the lot is a street of houses,
     counted from the kerb: houses facing the street (every third tile a driveway gap between
     neighbours), back yards, the alley wall, the next street's back yards, its houses. A house
     here is drawn STANDING and is a blocker (drawStandingHouse, G._houseSet); never a flat roof. */
  if(houseOn()){
    const d=(wx<ST_H_ROAD0)?(ST_H_ROAD0-2-wx):(wx-(ST_H_ROAD0+3)), m=((d%4)+4)%4;
    if(m===2) return 'wall';
    if(m===0) return ((((wy%3)+3)%3)===2) ? 'yard' : 'house';
    return 'yard'; }
  if(((wx%4)+4)%4===0) return 'wall';       /* the side wall between properties */"""),

 # 2. the floor under a standing house is yard
 ("""      if(_sk==='lot') _sk=lotSubKind(wx,wy);""",
  """      if(_sk==='lot') _sk=lotSubKind(wx,wy);
      if(_sk==='house'&&houseOn()) _sk='yard';   /* V233: the ground under a standing house */"""),

 # 3. the climbable house is one of the row facing the street
 ("""    if(_mound&&standingHouse()){ ox=ST_H_ROAD0-2-Math.floor(_dFrac*2); oy=Math.round(Math.sin(a1)*Math.min(d1,2)); }""",
  """    if(_mound&&standingHouse()){ ox=ST_H_ROAD0-2; oy=Math.round(Math.sin(a1)*Math.min(d1,2));
      /* V233: it is one of the houses facing the street, never the driveway between two */
      const _wx=Math.round(((G.worldOff&&G.worldOff.x)||0)+ox), _wy=Math.round(((G.worldOff&&G.worldOff.y)||0)+oy);
      if(lotSubKind(_wx,_wy)!=='house') oy+=(oy>0?-1:1); }"""),

 # 4. the neighbours: every house tile is a standing blocker
 ("""  /* DEMO SPAWN LAYOUTS (Paolo 7/4/26)""",
  """  /* ===== V233 __HOUSE_SIZED_NOT_HOUSE_FILLED__: THE NEIGHBOURS ==================================
     Every house tile of the lot is a tall piece of cover the size of a house (Battle Brothers' tile
     blocker, dressed as a house): no walking through it, it hides you, it stops a line of fire.
     Not on the climbable one, not on the front walk to its stair. Then nothing stands inside a
     house: a crate on a house tile goes, a car whole. No die is drawn. */
  G._houseSet={};
  if(standingHouse()){
    const _wox=(G.worldOff&&G.worldOff.x)||0, _woy=(G.worldOff&&G.worldOff.y)||0;
    const _R=Math.ceil(Math.max(contentR(),sightTiles()))+1, _walk={};
    const _st=(G.stairs&&G.stairs[0])?pXY(G.stairs[0]):null;
    if(_st){ let _x=0,_y=0; for(let _i=0;_i<8;_i++){ const _dx=Math.round(_st[0])-_x, _dy=Math.round(_st[1])-_y;
      if(!_dx&&!_dy)break; _x+=Math.sign(_dx); _y+=Math.sign(_dy); _walk[_x+','+_y]=1; } }
    for(let ty=-_R;ty<=_R;ty++)for(let tx=-_R;tx<=_R;tx++){
      if(!tx&&!ty)continue;
      const _gx=Math.round(_wox+tx), _gy=Math.round(_woy+ty);
      if(streetKindAt(_gx)!=='lot'||lotSubKind(_gx,_gy)!=='house')continue;
      if(deckTileAt(tx,ty)||_walk[tx+','+ty])continue;
      G._houseSet[tx+','+ty]=1;
      G.pillars.push({ea:Math.atan2(ty,tx),edist:Math.hypot(tx,ty),r:0.95,tall:true,house:true}); }
    const _in=P=>{ if(P.house)return false; const q=pXY(P); return !!G._houseSet[Math.round(q[0])+','+Math.round(q[1])]; };
    const _gone={}; for(const P of G.pillars)if(P.car&&_in(P))_gone[P.car]=1;
    G.pillars=G.pillars.filter(P=>P.car?!_gone[P.car]:!_in(P)); }
  /* DEMO SPAWN LAYOUTS (Paolo 7/4/26)"""),

 # 5. nobody spawns inside a house
 ("""    try{ snapBody(e); }catch(_e){}""",
  """    try{ snapBody(e); }catch(_e){}
    try{ unHouse(e); }catch(_e){}   /* V233: nobody starts inside a house */"""),
 ("""  resetFightState(); placeWayOut();""",
  """  resetFightState(); placeWayOut(); try{ unHouseAll(); }catch(_e){}   /* V233: nor does the way out */"""),

 # 6. the cover pass does not draw a house as a crate
 ("""    const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];
    const s=ring*0.62;""",
  """    if(P.house)continue;   /* V233: a house is drawn standing, by drawStandingHouse */
    const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];
    const s=ring*0.62;"""),

 # 7. the draw call runs for the neighbours even without a climbable one
 ("""  if(G.deck&&G.deck.length&&standingHouse()) drawStandingHouse(""",
  """  if(standingHouse()) drawStandingHouse("""),

 # 8. the bake: a cache per house, and the collapsed roof
 ("""let _shC=null, _shK='';
function bakeStandingHouse(t2,h2,idx){
  const W2=Math.ceil(t2)+1, WH=Math.max(8,Math.round(h2)), key=W2+'|'+WH+'|'+idx+'|'+(STREET_READY?1:0);
  if(_shC&&_shK===key)return _shC;""",
  """let _shC={}, _shK='';
function bakeStandingHouse(t2,h2,idx,collapsed){
  const W2=Math.ceil(t2)+1, WH=Math.max(8,Math.round(h2)), sk=W2+'|'+WH+'|'+(STREET_READY?1:0), key=idx+'|'+(collapsed?1:0);
  if(_shK!==sk){ _shC={}; _shK=sk; }
  if(_shC[key])return _shC[key];"""),
 ("""  const st=WH/2, lit=hh(1,2)%6;""",
  """  const st=WH/2, lit=collapsed?-1:hh(1,2)%6;   /* V233: nobody is home under a fallen roof */"""),
 ("""  const s0x=W2*0.94, s1x=W2*0.66, sy0=W2, sy1=W2+WH;""",
  """  if(!collapsed){ const s0x=W2*0.94, s1x=W2*0.66, sy0=W2, sy1=W2+WH;   /* V233: only the one you can climb has a stair */"""),
 ("""  /* THE ROOF: the street's own cooked roof, the floor up there */""",
  """  }
  /* THE ROOF: the street's own cooked roof, the floor up there */"""),
 ("""  _shC=c; _shK=key; return c; }""",
  """  if(collapsed){
    /* V233: A COLLAPSED ROOF IS NOT HIGH GROUND (rule 37g), and the picture says why: the roof has
       fallen into the house, the dark inside shows, three joists still span the hole. */
    const cxr=W2*(0.36+(hh(7,1)%26)/100), cyr=W2*(0.38+(hh(7,2)%22)/100), Rr=W2*0.30;
    g.fillStyle='#0a0806'; g.beginPath();
    for(let i=0;i<11;i++){ const a=i/11*Math.PI*2, rr=Rr*(0.6+(hh(i,9)%40)/100);
      const px=cxr+Math.cos(a)*rr, py=cyr+Math.sin(a)*rr*0.8; if(i)g.lineTo(px,py); else g.moveTo(px,py); }
    g.closePath(); g.fill();
    g.strokeStyle='#5e4a35'; g.lineWidth=Math.max(2,3*u);
    for(let i=0;i<3;i++){ const y0=cyr-Rr*0.5+i*Rr*0.5;
      g.beginPath(); g.moveTo(cxr-Rr*0.9,y0+((hh(i,6)%9)-4)*u); g.lineTo(cxr+Rr*0.7,y0-((hh(i,8)%9)-4)*u); g.stroke(); }
    g.fillStyle='rgba(180,160,130,0.35)';
    for(let i=0;i<14;i++){ const a=(hh(i,11)%360)*Math.PI/180;
      g.fillRect(Math.round(cxr+Math.cos(a)*Rr*0.95),Math.round(cyr+Math.sin(a)*Rr*0.78),Math.max(1,Math.round(3*u)),Math.max(1,Math.round(2*u))); } }
  _shC[key]=c; return c; }
function unHouse(o){ if(!o||!G._houseSet)return;
  const c=[Math.round(Math.cos(o.ea)*o.edist),Math.round(Math.sin(o.ea)*o.edist)];
  if(!G._houseSet[c[0]+','+c[1]])return;
  for(const d of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1],[0,2],[0,-2],[2,0],[-2,0]]){
    const nx=c[0]+d[0], ny=c[1]+d[1]; if(!nx&&!ny)continue; if(G._houseSet[nx+','+ny])continue;
    o.edist=Math.hypot(nx,ny); o.ea=Math.atan2(ny,nx); return; } }
function unHouseAll(){ for(const e of (G.e||[]))if(e&&!e.dead)unHouse(e); if(G.exit)unHouse(G.exit); }"""),

 # 9. the draw: the climbable one and the neighbours, far first
 ("""function drawStandingHouse(x,W,H,cx,cy,ring,dz,DECK_H,focus,dz0){
  const t2=ring;
  for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy), q=pXY(T);""",
  """function drawStandingHouse(x,W,H,cx,cy,ring,dz,DECK_H,focus,dz0){
  const t2=ring;
  /* V233: the climbable house (its roof on) and the neighbours (roofs fallen in), far ones first */
  const _all=(G.deck||[]).map(T=>({T:T,c:false})).concat((G.pillars||[]).filter(P=>P.house).map(T=>({T:T,c:true})));
  _all.sort((a,b)=>pXY(a.T)[1]-pXY(b.T)[1]);
  for(const _h of _all){ const T=_h.T; const p=fieldPos(T,W,H,cx,cy), q=pXY(T);"""),
 ("""    const bk=bakeStandingHouse(t2,DECK_H,idx);""",
  """    const bk=bakeStandingHouse(t2,DECK_H,idx,_h.c);"""),
]


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES."""
    bodies = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', blob, re.S | re.I)
    if not bodies:
        sys.exit('GUARD %s: no inline scripts found, which cannot be right' % label)
    bad = 0
    for i, b in enumerate(bodies):
        fd, p = tempfile.mkstemp(suffix='.js')
        os.write(fd, b.encode('utf-8'))
        os.close(fd)
        r = subprocess.run(['node', '--check', p], capture_output=True)
        os.unlink(p)
        if r.returncode != 0:
            bad += 1
            print('  SCRIPT %d OF %d DOES NOT PARSE:' % (i + 1, len(bodies)),
                  r.stderr.decode('utf-8', 'replace').strip().splitlines()[-1][:160])
    if bad:
        sys.exit('GUARD %s: %d of %d scripts do not parse' % (label, bad, len(bodies)))
    print('  %s: %d scripts, all parse' % (label, len(bodies)))


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  the neighbours already stand')
        return
    for need in ('__HOUSE_TILES_BACK__', '__A_HOUSE_IS_NEVER_SMALLER_THAN_A_MAN__ (COMBAT'):
        if need not in blob:
            sys.exit('GUARD: %s is not in this blob; V233 is written on top of it' % need)
    for old, new in EDITS:
        n = blob.count(old)
        if n != 1:
            sys.exit('ANCHOR: expected 1, found %d for %r' % (n, old[:80]))
        blob = blob.replace(old, new, 1)
    # the same five dice in the mound block
    i0 = blob.index('__THE_MOUND_IS_ONE_CELL__')
    i1 = blob.index('if(G.deck.length){', i0)
    if blob[i0:i1].count('Math.random()') != 4:
        sys.exit('GUARD: the mound block draws a different number of dice')
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V233 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
