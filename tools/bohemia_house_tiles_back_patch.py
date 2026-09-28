#!/usr/bin/env python3
"""
V231 -- HOUSE TILES BACK: THE CELL BOARD IS GONE, THE STREET IS A STREET, AND THE HIGH GROUND IS
A BUILDING WITH A STANDING ROOF  (COMBAT, [house tiles back])

PAOLO 9/28, LOCKED (laws/BOHEMIA_LAW_THE_OVERWORLD_IS_BATTLE_BROTHERS_9_24_26.md s14):
    "In combat the boards and the tiles are as big as parts of the city: a house is one tile. I've
    told you this millions of times... for the combat a tile is as big as a house."
s14(b): the cell-grid FIGHT (COMBAT V227 to V229) is DEAD. s14(c): the walk's assets DRESS the
house-sized tiles. s14(e): the mound is a house tile with height, a roof. And his UP on this lane's
high-ground card (9/27): "higher terrain for us could mean like a building... with the roof that
you can be on instead of a collapsed roof, or maybe a three-story building... the buildings have
to get taller."

---------------------------------------------------------------- WHAT IT DOES, THREE THINGS

1. THE CELL ROW IS DELETED, NOT KEPT AS AN OPTION. V230 kept it "for [tile options]"; s14(f) says
   the options are house tiles and street tiles at full detail, so a 32 px cell row is a dead shape,
   and GRAVEYARD IS FINAL. Gone with it: cellBoard(), V229's four-by-four lot layout and its roof
   slices, and the bench's "A TILE IS A CELL" line. The V227 and V229 marks stay in the tombstone
   comments so the replay script reads them as applied and never re-plants them.

2. THE STREET IS A STREET, IN HOUSES. MEASURED FIRST, on the one driver, 120 arenas: 80 street
   fights, and the high ground landed on ROAD 51, MEDIAN 14, LANE 10, GUTTER 5 -- 80 of 80 in the
   carriageway. Because the street bands were written one per BODY tile (1.5 m) and the house
   board kept them one per HOUSE (12 m): the street was SEVENTEEN HOUSES WIDE, 204 metres, and the
   glass shows 6.6 houses. So on the house board a fight never had a house on screen. Now, on the
   house board only, the bands are real widths in houses: two tiles of road (24 m, a four-lane Las
   Vegas street), one tile of sidewalk and parkway each side, then the lots. The body board's
   bands are untouched, byte for byte.
   AND THE LOT HAS NO ROOF LYING ON THE GROUND. A roof tile drawn flat at ground level, where men
   walk on it, is the "checkerboard of orange roof tiles for a floor" that embarrassed him on 9/18.
   On the house board the lot is yards and property walls; the house that stands up is drawn
   standing up (3).

3. THE HIGH GROUND IS A STANDING HOUSE. The one tile of height (V228) is now placed on the lot,
   across the sidewalk, two or three houses from him -- from the SAME five dice, in the same order,
   so no seeded arena deals a different hand anywhere else. And it is drawn as a building: the
   street's own cooked roof on top (the roof you stand on), two storeys of wall under it, dead
   windows, one lit, a door, and a steel stair down the face -- replacing the scaffold, which is
   still what a warehouse mezzanine and a room get. The rule does not move: climbing is V106's,
   the pip is V114's, and the accuracy of height still arrives through V90's cover rule.

REUSE CHECK: nothing new is cooked. The roof is the fight's own STREET_IMG 'house' bank (COOK's
cooked street bank, db792724, already loaded by the fight), the wall face is the same bank's 'wall'
tile; the only new pixels are windows, a door, a stair and grime lines, drawn once per size into
one cached canvas (GRIME IS BAKED: no filters, no composite modes). No bank file is opened here.

NO DAMAGE BEFORE THE DIAL: no chance, hit, damage or turn number moves. Every change is where a
thing is and what it looks like.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__HOUSE_TILES_BACK__'

EDITS = [
 # ---- 1. THE CELL ROW IS DELETED -------------------------------------------------------------
 ("""const BOARD_OPTS={
  house:{ K:8, SIGHT:6,  CEIL:3,  WIDE:1.75, PX:112, MAX:{ shotgun:1, pistol:1, smg:1, rifle:2, sniper:3 } },
  cell: { K:2, SIGHT:24, CEIL:12, WIDE:1,    PX:32,  MAX:{ shotgun:4, pistol:4, smg:4, rifle:8, sniper:12 } } };""",
  """/* V231 __HOUSE_TILES_BACK__: THE CELL ROW IS DELETED (Paolo 9/28, overworld law s14: "for the
   combat a tile is as big as a house"; s14(b) the cell-grid fight is dead). [tile options] rows are
   house tiles and street tiles at full detail (s14f), so the only row left is the house. */
const BOARD_OPTS={
  house:{ K:8, SIGHT:6,  CEIL:3,  WIDE:1.75, PX:112, MAX:{ shotgun:1, pistol:1, smg:1, rifle:2, sniper:3 } } };"""),

 ("""function cellBoard(){ return houseOn()&&G.boardOpt==='cell'; }""",
  """/* V231: cellBoard() is gone with the row it asked about. */"""),

 # V229's layout and roof slices -> the lot, on the house board, has no roof lying on the ground
 ("""const HOUSE_CELLS=4;                 /* [DIAL] rule 34 s5: a house is about 4 by 4 cells */
const LOT_PERIOD_X=HOUSE_CELLS+1;    /* four cells of house and one of the property wall */
const LOT_PERIOD_Y=HOUSE_CELLS*2;    /* his "one by two": four cells of house, four of yard */
function lotSubKind(wx,wy){
  if(cellBoard()){   /* V230: the 4x4 house layout was written for a 3 m cell. On the house board a tile IS a house, so the layout he approved runs below. */
    const c=((wx%LOT_PERIOD_X)+LOT_PERIOD_X)%LOT_PERIOD_X;
    if(c===0) return 'wall';
    const r=((wy%LOT_PERIOD_Y)+LOT_PERIOD_Y)%LOT_PERIOD_Y;
    return (r<HOUSE_CELLS) ? 'house' : 'yard';
  }
  if(((wx%4)+4)%4===0) return 'wall';       /* the side wall between properties */
  return (((wy%2)+2)%2===0) ? 'house' : 'yard';
}""",
  """/* V231 __HOUSE_TILES_BACK__: V229's layout is DELETED with the cell row (the mark above stays so
   the replay reads it as applied). AND ON THE HOUSE BOARD NO ROOF LIES ON THE GROUND: a roof drawn
   flat where men walk is the 9/18 "checkerboard of orange roof tiles for a floor". The lot there is
   yards and property walls; the house that stands up is drawn standing up (standingHouse, below). */
function lotSubKind(wx,wy){
  if(((wx%4)+4)%4===0) return 'wall';       /* the side wall between properties */
  if(houseOn()) return 'yard';
  return (((wy%2)+2)%2===0) ? 'house' : 'yard';
}"""),

 ("""let _roofC={}, _roofT=-1;
function roofBlock(idx,px){
  if(!STREET_READY)return null;
  if(_roofT!==px){ _roofC={}; _roofT=px; }
  if(_roofC[idx])return _roofC[idx];
  const S=HOUSE_CELLS*px;
  const _bank=(S>44&&(STREET_IMG2X.house||[])[idx])?STREET_IMG2X:STREET_IMG;
  const src=(_bank.house||[])[idx]; if(!src)return null;
  const c=document.createElement('canvas'); c.width=c.height=S;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.drawImage(src,0,0,S,S);
  _roofC[idx]=c; return c; }""",
  """/* V231: roofBlock() is gone; a roof is drawn whole, on a house that stands up. */"""),

 ("""      /* V229: on the cell board a house cell draws its slice of ONE roof, picked once per
         house so every cell of the same house shows the same roof. */
      if(cellBoard()&&_sk==='house'){   /* V230: only on the cell row */
        const _c=((wx%LOT_PERIOD_X)+LOT_PERIOD_X)%LOT_PERIOD_X, _r=((wy%LOT_PERIOD_Y)+LOT_PERIOD_Y)%LOT_PERIOD_Y;
        const _bx=wx-(_c-1), _by=wy-_r;
        const _bh=(Math.imul(_bx|0,73856093)^Math.imul(_by|0,19349663))>>>0;
        const _cp=Math.ceil(t)+1, _rb=roofBlock(_bh%_sn,_cp);
        if(_rb){ x.drawImage(_rb,(_c-1)*_cp,_r*_cp,_cp,_cp,Math.floor(sx2),Math.floor(sy2),_cp,_cp); continue; } }
""", ""),

 ("""           setRead(houseOn()?(cellBoard()?'A TILE IS A CELL':'A TILE IS A HOUSE'):'A TILE IS A BODY',
             houseOn()?(cellBoard()?'three metres: a pistol reaches four, a rifle eight':'a pistol reaches one house, a rifle two'):'the old board, unchanged','#e8c88a'); }catch(_e){} });""",
  """           setRead(houseOn()?'A TILE IS A HOUSE':'A TILE IS A BODY',
             houseOn()?'a pistol reaches one house, a rifle two':'the old board, unchanged','#e8c88a'); }catch(_e){} });"""),

 # ---- 2. THE STREET IS A STREET, IN HOUSES ---------------------------------------------------
 ("""  if(G.arenaKind==='warehouse'||G.arenaKind==='room')return 'slab';   /* V200: a room is indoors too, and V100 already wrote the rule */""",
  """  if(G.arenaKind==='warehouse'||G.arenaKind==='room')return 'slab';   /* V200: a room is indoors too, and V100 already wrote the rule */
  /* V231 __HOUSE_TILES_BACK__: ON THE HOUSE BOARD THE BANDS ARE REAL WIDTHS IN HOUSES. They were
     one band per body tile and the house board kept them one per HOUSE: a street 17 houses (204 m)
     wide on a glass 6.6 houses across, so no fight ever had a house on screen. Two tiles of road
     (24 m, four lanes), a tile of sidewalk and parkway each side, then the lots. */
  if(houseOn()){
    if(wx===ST_H_ROAD0||wx===ST_H_ROAD0+1)return 'road';
    if(wx===ST_H_ROAD0-1||wx===ST_H_ROAD0+2)return 'walk';
    return 'lot'; }"""),

 ("""const ST_MED=2, ST_LANE_L=-2, ST_LANE_R=6;""",
  """const ST_MED=2, ST_LANE_L=-2, ST_LANE_R=6;
const ST_H_ROAD0=0;   /* V231 [DIAL] house board: the first of the two road tiles, where he starts */"""),

 ("""      const side=Math.random()<0.5?ST_LANE_L-1:ST_LANE_R;""",
  """      const _sd=Math.random()<0.5;   /* V231: the same one draw; on the house board the kerb lane is a road tile */
      const side=houseOn()?(_sd?ST_H_ROAD0:ST_H_ROAD0+1):(_sd?ST_LANE_L-1:ST_LANE_R);"""),

 # ---- 3. THE HIGH GROUND IS A STANDING HOUSE, ON THE LOT --------------------------------------
 ("""    if(_mound&&ox===0&&oy===0)ox=1;   /* never ON him: a mound he starts on is not a move he makes */""",
  """    if(_mound&&ox===0&&oy===0)ox=1;   /* never ON him: a mound he starts on is not a move he makes */
    /* V231 __HOUSE_TILES_BACK__: A HOUSE STANDS ON A LOT. Measured before this: 80 of 80 street
       fights put it in the carriageway. The same five dice pick it, across the sidewalk, two or
       three houses from him: _dFrac picks the depth, a1 and d1 the offset along the street. */
    if(_mound&&standingHouse()){ ox=ST_H_ROAD0-2-Math.floor(_dFrac*2); oy=Math.round(Math.sin(a1)*Math.min(d1,2)); }"""),

 ("""  if(G.deck&&G.deck.length){ const dz=lvlDY(DECK_LVL), t2=ring;
    const _below=T=>{""",
  """  if(G.deck&&G.deck.length&&standingHouse()) drawStandingHouse(x,W,H,cx,cy,ring,lvlDY(DECK_LVL),DECK_H,floorFocus(DECK_LVL),lvlDY(0));
  else if(G.deck&&G.deck.length){ const dz=lvlDY(DECK_LVL), t2=ring;
    const _below=T=>{"""),

 ("""  if(G.deck&&G.deck.length&&G.stairs&&G.stairs.length){
    const T=G.stairs[0], sp2=fieldPos(T,W,H,cx,cy), t4=ring;""",
  """  if(G.deck&&G.deck.length&&G.stairs&&G.stairs.length&&!standingHouse()){   /* V231: a house carries its own stair */
    const T=G.stairs[0], sp2=fieldPos(T,W,H,cx,cy), t4=ring;"""),

 ("""const MOUND_NEAR=1.2, MOUND_FAR=3;""",
  """const MOUND_NEAR=1.2, MOUND_FAR=3;
/* ===== V231 __HOUSE_TILES_BACK__: THE HIGH GROUND IS A HOUSE WITH ITS ROOF STILL ON ============
   His UP, 9/27: "a building... with the roof that you can be on instead of a collapsed roof, or
   maybe a three-story building." On the house board's street the one tile of height is drawn as a
   standing house: the street's own cooked roof on top (that is the floor you stand on up there),
   two storeys of wall under it, dead windows and one lit, a door, a steel stair down the face.
   Baked once per size into one canvas (GRIME IS BAKED); a warehouse and a room keep the scaffold. */
function standingHouse(){ return houseOn()&&G.arenaKind==='street'; }
let _shC=null, _shK='';
function bakeStandingHouse(t2,h2,idx){
  const W2=Math.ceil(t2)+1, WH=Math.max(8,Math.round(h2)), key=W2+'|'+WH+'|'+idx+'|'+(STREET_READY?1:0);
  if(_shC&&_shK===key)return _shC;
  const c=document.createElement('canvas'); c.width=W2; c.height=W2+WH+2;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  const u=W2/196;                                   /* 1 at the ruled 196 px house */
  const hh=(a,b)=>((Math.imul(idx+1+a,73856093)^Math.imul(b+7,19349663))>>>0);
  /* THE WALL: the street's own property-wall tile run down the face, then brought down a value so
     the roof above it reads as the lit plane (value contrast is the height cue, V92's lesson) */
  const wt=STREET_READY?streetTile('wall',0,W2,0):null;
  if(wt){ for(let y=W2;y<W2+WH;y+=W2)g.drawImage(wt,0,y,W2,Math.min(W2,W2+WH-y)); }
  else { g.fillStyle='#6b5a47'; g.fillRect(0,W2,W2,WH); }
  g.fillStyle='rgba(18,14,10,0.52)'; g.fillRect(0,W2,W2,WH);
  /* two storeys: a floor line, and three windows a storey, black, one of them lit */
  const st=WH/2, lit=hh(1,2)%6;
  g.fillStyle='rgba(8,7,5,0.8)'; g.fillRect(0,Math.round(W2+st),W2,Math.max(1,Math.round(2*u)));
  for(let f=0;f<2;f++)for(let k=0;k<3;k++){
    const wx2=Math.round(W2*(0.12+k*0.29)), wy2=Math.round(W2+f*st+st*0.22), ww=Math.round(W2*0.18), wh2=Math.round(st*0.44);
    if(f===1&&k===1)continue;                      /* the door goes here */
    g.fillStyle='#7d6c55'; g.fillRect(wx2-1,wy2-1,ww+2,wh2+2);           /* the frame */
    g.fillStyle=((f*3+k)===lit)?'#4d3f22':'#0b0907'; g.fillRect(wx2,wy2,ww,wh2);
    if((f*3+k)===lit){ g.fillStyle='#0b0907'; g.fillRect(wx2+Math.round(ww*0.55),wy2+Math.round(wh2*0.25),Math.max(2,Math.round(ww*0.18)),wh2); }   /* somebody in it */
    else if(hh(f,k)%3===0){ g.fillStyle='rgba(150,140,120,0.35)'; g.fillRect(wx2+2,wy2+2,Math.max(1,Math.round(ww*0.3)),1); } }   /* a shard of glass left */
  const dw2=Math.round(W2*0.2), dh2=Math.round(st*0.72), dx2=Math.round(W2*0.4);
  g.fillStyle='#7d6c55'; g.fillRect(dx2-1,Math.round(W2+WH-dh2)-1,dw2+2,dh2+1);
  g.fillStyle='#070605'; g.fillRect(dx2,Math.round(W2+WH-dh2),dw2,dh2);
  /* grime: water has run off the roof edge for years */
  g.fillStyle='rgba(10,8,6,0.35)';
  for(let i=0;i<9;i++){ const sx=hh(i,3)%W2, sl=Math.round(WH*(0.15+(hh(i,5)%50)/100)); g.fillRect(sx,W2,Math.max(1,Math.round(u)),sl); }
  /* THE STEEL STAIR down the right of the face, from the roof edge to the ground */
  const s0x=W2*0.94, s1x=W2*0.66, sy0=W2, sy1=W2+WH;
  g.strokeStyle='#15110c'; g.lineWidth=Math.max(2,4*u);
  g.beginPath(); g.moveTo(s0x,sy0); g.lineTo(s1x,sy1); g.stroke();
  for(let i=1;i<9;i++){ const fr=i/9, tx=s0x+(s1x-s0x)*fr, ty=sy0+(sy1-sy0)*fr;
    g.fillStyle='#15110c'; g.fillRect(Math.round(tx-W2*0.09),Math.round(ty),Math.round(W2*0.12),Math.max(2,Math.round(3*u)));
    g.fillStyle='#a8977a'; g.fillRect(Math.round(tx-W2*0.09),Math.round(ty),Math.round(W2*0.12),Math.max(1,Math.round(u))); }
  /* THE ROOF: the street's own cooked roof, the floor up there */
  const rt=STREET_READY?streetTile('house',idx,W2,0):null;
  if(rt)g.drawImage(rt,0,0,W2,W2); else { g.fillStyle='#5b4a3a'; g.fillRect(0,0,W2,W2); }
  const lip=Math.max(2,Math.round(5*u));
  g.fillStyle='rgba(12,10,8,0.8)'; g.fillRect(0,0,W2,lip); g.fillRect(0,0,lip,W2); g.fillRect(W2-lip,0,lip,W2);
  g.fillStyle='#b4a282'; g.fillRect(0,W2-lip,W2,Math.max(1,Math.round(lip*0.5)));   /* the lit front edge */
  g.fillStyle='rgba(12,10,8,0.8)'; g.fillRect(0,W2-Math.round(lip*0.5),W2,Math.round(lip*0.5)+1);
  _shC=c; _shK=key; return c; }
function drawStandingHouse(x,W,H,cx,cy,ring,dz,DECK_H,focus,dz0){
  const t2=ring;
  for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy), q=pXY(T);
    const n=(STREET_IMG.house||[]).length||1, wx=Math.round((G.worldOff?G.worldOff.x:0)+q[0]), wy=Math.round((G.worldOff?G.worldOff.y:0)+q[1]);
    const idx=((Math.imul(wx|0,73856093)^Math.imul(wy|0,19349663))>>>0)%n;
    const bk=bakeStandingHouse(t2,DECK_H,idx);
    /* the house throws a solid shadow on the lot at its foot */
    const gy=p[1]+t2*0.5+dz0;
    x.fillStyle='rgba(0,0,0,0.34)'; x.fillRect(Math.floor(p[0]-t2*0.5),Math.floor(gy-t2*0.05),Math.ceil(t2*1.12),Math.ceil(t2*0.16));
    /* A HOUSE IS SOLID. V113 fades the floor you are not on, which is right for a scaffold over
       your head and wrong for a house across the street: measured, it drew this one at 42%, a
       ghost. So it is solid, and it goes see-through only while a body stands behind it (V105). */
    const hid=(G.e||[]).some(e2=>!e2.dead&&(e2.lvl|0)===0&&Math.abs(Math.cos(e2.ea)*e2.edist-q[0])<0.6&&(Math.sin(e2.ea)*e2.edist)>q[1]-1.6&&(Math.sin(e2.ea)*e2.edist)<q[1]+0.6)
      || (myLvl()===0&&Math.abs(q[0])<0.6&&q[1]>-0.6&&q[1]<1.6);
    x.save(); x.globalAlpha=hid?0.45:1;
    x.drawImage(bk,Math.floor(p[0]-t2*0.5),Math.floor(p[1]-t2*0.5+dz));
    x.restore(); } }"""),

 # the front walk: a house you cannot reach is a picture, not high ground
 ("""        G.pillars=G.pillars.filter(P=>{ if(P.car)return !_doomed[P.car];
          const q=pXY(P); return !deckTileAt(q[0],q[1]); }); } }""",
  """        G.pillars=G.pillars.filter(P=>{ if(P.car)return !_doomed[P.car];
          const q=pXY(P); return !deckTileAt(q[0],q[1]); }); }
      /* V231 __HOUSE_TILES_BACK__: THE FRONT WALK. The house stands two or three houses off,
         and cover is rolled in a ring from 1.5 houses out -- measured, a rock sat on the way to
         its stair in 49 of 79 fights, so the high ground he voted UP was a picture he could not
         reach. A house has a way to its door: the steps a thumb takes from him to the stair are
         kept clear, a car cleared whole (V110's rule). No die is drawn; only pieces are removed. */
      if(standingHouse()&&G.stairs.length){ const _walk=[]; const _s=pXY(G.stairs[0]);
        let _x=0,_y=0; for(let _i=0;_i<8;_i++){ const _dx=Math.round(_s[0])-_x, _dy=Math.round(_s[1])-_y;
          if(!_dx&&!_dy)break; _x+=Math.sign(_dx); _y+=Math.sign(_dy); _walk.push([_x,_y]); }
        const _onWalk=P=>{ const q=pXY(P), rr=Math.max(0.5,P.r||0.5); return _walk.some(c=>Math.hypot(q[0]-c[0],q[1]-c[1])<rr); };
        const _gone={}; for(const P of G.pillars)if(P.car&&_onWalk(P))_gone[P.car]=1;
        G.pillars=G.pillars.filter(P=>P.car?!_gone[P.car]:!_onWalk(P)); } }"""),

 # the V227 body note is a tombstone now; its mark stays so the replay reads it as applied
 ("""/* V227 __THE_CELL_BOARD__: THE PERSON IS ONE CELL (rule 34 s4, which RE-READS rule 21
   rather than repealing it -- one size at every zoom, and the size is now one cell). He is
   drawn at 32 of the HD sprite's 112, and TILE_WIDE is 1 because a person fills his cell, so
   V198's own ruler puts the tile at 32 CSS px BY CONSTRUCTION:
       tile = TILE_WIDE * 112 * bodyRule() = 1 * 112 * (32/112) = 32
   and the board is 390/32 = 12.2 cells across, which is the number the VOTE card promised.
   THE 112 ART IS NOT THROWN AWAY: it stays the source this is cut from, and the portraits
   and vote pages keep it. Only the fought sprite shrinks. */""",
  """/* V227 __THE_CELL_BOARD__ (the person as one 32 px cell) IS DEAD: V231, overworld law s14. */"""),
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
        print('  the house tiles are already back')
        return
    for need in ('__NO_ATARI__', '__THE_MOUND_IS_ONE_CELL__', '__A_HOUSE_IS_FOUR_BY_FOUR__'):
        if need not in blob:
            sys.exit('GUARD: %s is not in this blob; V231 is written on top of it' % need)
    for old, new in EDITS:
        n = blob.count(old)
        if n != 1:
            sys.exit('ANCHOR: expected 1, found %d for %r' % (n, old[:80]))
        blob = blob.replace(old, new, 1)
    code = re.sub(r'/\*.*?\*/', '', blob, flags=re.S)
    # THE CELL BOARD DOES NOT COME BACK UNDER ANY NAME.
    for dead in ('cellBoard', 'roofBlock', 'HOUSE_CELLS', 'LOT_PERIOD_X', 'LOT_PERIOD_Y', "cell:", 'CELL_PX'):
        if dead in code:
            sys.exit('GUARD: %s is still in the fight' % dead)
    # THE MOUND BLOCK STILL DRAWS EXACTLY FIVE DICE.
    i0 = blob.index('__THE_MOUND_IS_ONE_CELL__')
    i1 = blob.index('if(G.deck.length){', i0)
    if blob[i0:i1].count('Math.random()') != 4:   # the four in this block; the fifth is the 0.72 roll above it
        sys.exit('GUARD: the mound block draws a different number of dice than V228 did')
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V231 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
