#!/usr/bin/env python3
"""
V238 -- COVER IS A THING (COMBAT 2's cover pieces, dropped in); THE LAST MARKS OFF THE GROUND
(COMBAT, [house tiles back], rule 46f and rule 55, JUMP 1)

REUSE CHECK: nothing is cooked here. Every cover pixel is COMBAT 2's [cover pieces]
(banks/BOHEMIA_THE_FIGHT_COVER_10_1_26.txt, cooked from his 7/28 bank, SHIPPED 10/1, in VOTE as
combat2-the-cover-pieces-10-1): three dead cars, three block walls, a shed. Rule 55 (Paolo 10/1):
"COMBAT 2 = THE FLOOR ART ONLY ... COMBAT 1 keeps the fight code"; their record: "FOR COMBAT 1:
replace each tan cover block with one of these, seeded by the cell: cars on road cells, walls and the
shed on lot/slab cells. Blit 1:1 at device pixels." This file reads that bank every replay, so their
next cut arrives by re-running it. Parked cars keep the fight's own CAR_IMG bank (his car_wreck pool,
7/29). COOK's block war kit is NOT used (voted DOWN 9/30).
NOT YET: their GROUND tiles (banks/BOHEMIA_THE_FIGHT_FLOOR_SET_10_1_26.txt) are cut for a 45-degree
camera (515 x 364, rule 56); this board still draws square cells, so they wait for the board's own
45-degree projection rather than being stretched into squares.

DIRECTION's floor bar, round 21: "F4 every tile kind from its bank ... TODAY a speckle road and a
flat sidewalk, no kerb"; "F5 cover is a thing (own silhouette, >= 3 values, contact shadow) - TODAY
two-tone tan boxes"; "F3 ... the man's base a <= 2 px shadow ring ... a fat white ring by eye".

WHAT WAS ON THE BOARD, MEASURED BEFORE A LINE WAS WRITTEN (seed 1, the game's camera):
  - cover: the stucco wall tile stretched into tan bands, laid ACROSS the road like barricades;
  - each parked car was 2 x 3 TILES, his 7/29 size on the 1.5 m body tile, kept on the 12 m
    house tile: a car 24 m by 36 m, three of them on seed 1, each on an OVAL shadow;
  - under every man who sees you a bone ELLIPSE ring 0.8 of a tile wide (V179);
  - under every man his health bar, 133 px of red on the street at his feet;
  - a gun stick drawn from his feet along the ground, and the chosen man's amber ring at his feet.

NOW, house board only (the body board is byte-identical):
  - every cover piece is one of their seven, seeded by its cell: a dead car (in the lane, at the kerb)
    on a road tile; on a lot a block wall, a corner or the shed when it is tall, the knocked-through
    wall or the patrol car on the drive when it is low; their sprite whole, their hard shadow with
    it, at the biggest whole-number scale that fits one house tile (2x on a 3x phone);
  - a parked car is ONE tile (a combat tile is a house; his 2 x 3 was on the old tile),
    drawn to the man's size at a whole-number scale, a shadow from its outline, heat rim unchanged;
  - his health bar, the "he sees you" mark and the chosen-man mark go ON HIM, over his
    head beside the reach dot; the gun stick at his feet is not drawn (the body carries it).
  SAID, NOT HIDDEN: their pieces are true size at the ground's 42.9 px/m and the man draws at about
  four times that, so a 1.8 m wall reaches his thigh on the glass. That is the standing scale gap
  (rule 21: the man may not zoom), for COMBAT 2 and DIRECTION to answer, not a reason to stretch.

NO DAMAGE BEFORE THE DIAL: nothing about the fight's rules moves except the car's footprint
on the house board (one tile instead of six). Its cover is engine-hard and tall, as V108's
first row.
"""
import base64
import json
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
COVERBANK = 'banks/BOHEMIA_THE_FIGHT_COVER_10_1_26.txt'   # COMBAT 2's [cover pieces] (rule 55)
PIECES = ('car_lane', 'car_kerb', 'car_drive', 'wall', 'wall_corner', 'wall_broken', 'shed')
MARK = '__COVER_IS_A_THING__'


def bank_js():
    d = json.load(open(COVERBANK, encoding='utf-8'))
    out = []
    for i in PIECES:
        hit = [t for t in d['pieces'] if t['id'] == i]
        if len(hit) != 1:
            sys.exit('BANK: expected one cover piece %r in the bank, found %d' % (i, len(hit)))
        out.append('%s:"%s"' % (i, hit[0]['b64']))
    return 'const COVER_B64={' + ','.join(out) + '};'


HELPERS = r"""/* ===== V238 __COVER_IS_A_THING__ (COMBAT, rules 46f and 55, F5) ======================================
   On the house board cover is a THING: COMBAT 2's cover pieces (rule 55: they make the art, this lane drops
   it in), seeded by the cell: a dead car on a road tile, a block wall, a corner, a knocked-through wall or
   the shed on a lot. Each is their sprite, shadow and all, at the biggest whole-number scale that fits one
   house tile, baked once at the phone's real pixels. */
__BANK__
const COVER_IMG={}; let COVER_READY=false;
(function(){ const ks=Object.keys(COVER_B64); let left=ks.length;
  ks.forEach(k=>{ const im=new Image(); im.onload=()=>{ COVER_IMG[k]=im; if(--left===0)COVER_READY=true; };
    im.onerror=()=>{ if(--left===0)COVER_READY=true; }; im.src='data:image/png;base64,'+COVER_B64[k]; }); })();
/* which piece a cell gets: their own brief, "cars on road cells, walls and the shed on lot/slab cells" */
function coverPieceFor(road,low,h){
  if(road)return (h&1)?'car_kerb':'car_lane';
  if(low)return ['wall_broken','car_drive'][(h>>>1)&1];
  return ['wall','wall','wall_corner','shed'][(h>>>1)&3]; }
let _CPS={}, _CPK='';
function coverPieceSprite(id,ring){
  const im=COVER_IMG[id]; if(!im||!im.naturalWidth)return null;
  const k=Math.max(1,Math.floor(ring*0.98*FD/Math.max(im.naturalWidth,im.naturalHeight)));   /* whole pixels, one tile at most */
  if(_CPK!==k+'|'+FD){ _CPS={}; _CPK=k+'|'+FD; }
  if(_CPS[id])return _CPS[id];
  const c=document.createElement('canvas'); c.width=im.naturalWidth*k; c.height=im.naturalHeight*k;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false; g.drawImage(im,0,0,c.width,c.height);
  c.__v238=/^car/.test(id)?'wreck':(id==='shed'?'shed':'wall'); c.__id=id;
  const S={c:c,ax:c.width/2,ay:c.height/2}; _CPS[id]=S; return S; }
let _CARB={}, _CARK='';
function carBake(art,burnt,across,ring){
  const im=CAR_READY?CAR_IMG[art]:null; if(!im||!im.naturalWidth)return null;
  const bs=bodyScale(), Lf=Math.min(0.92*ring,248*bs);                /* 4.5 m against a 1.8 m man, never past the tile */
  const k=Math.max(1,Math.floor(Lf*FD/im.naturalHeight));
  if(_CARK!==k+'|'+FD){ _CARB={}; _CARK=k+'|'+FD; }
  const key=art+'|'+(burnt?1:0)+'|'+(across?1:0);
  if(_CARB[key])return _CARB[key];
  const w=im.naturalWidth*k, h=im.naturalHeight*k, bw=across?h:w, bh=across?w:h, pad=5*k;
  const cc=document.createElement('canvas'); cc.width=bw; cc.height=bh;
  const q=cc.getContext('2d'); q.imageSmoothingEnabled=false;
  if(across){ q.translate(bw/2,bh/2); q.rotate(Math.PI/2); q.drawImage(im,-w/2,-h/2,w,h); q.setTransform(1,0,0,1,0,0); }
  else q.drawImage(im,0,0,w,h);
  if(burnt){ q.globalCompositeOperation='source-atop'; q.fillStyle='rgba(40,30,22,0.48)'; q.fillRect(0,0,bw,bh);
    q.globalCompositeOperation='source-over'; }
  const sh=document.createElement('canvas'); sh.width=bw; sh.height=bh;   /* the car's own outline, as its shadow */
  const sq=sh.getContext('2d'); sq.drawImage(cc,0,0); sq.globalCompositeOperation='source-in';
  sq.fillStyle='rgba(0,0,0,0.38)'; sq.fillRect(0,0,bw,bh);
  const c=document.createElement('canvas'); c.width=bw+pad; c.height=bh+pad;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.drawImage(sh,3*k,4*k);                                              /* falling down-right, light at the upper left */
  g.drawImage(cc,0,0);
  c.__v238='car'; const B={c:c,w:bw,h:bh}; _CARB[key]=B; return B; }
function carOnTile(x,P,p0,ring,burnt){
  const B=carBake(P.carArt|0,burnt,!P.carVert,ring);
  if(!B){ const L=0.9*ring, Wc=L*0.6, r=P.carVert?[p0[0]-Wc/2,p0[1]-L/2,Wc,L]:[p0[0]-L/2,p0[1]-Wc/2,L,Wc];
    x.fillStyle='#5a5346'; x.fillRect(r[0],r[1],r[2],r[3]); return r; }
  const dx=Math.round(p0[0]-B.w/FD/2), dy=Math.round(p0[1]-B.h/FD/2);
  x.drawImage(B.c,dx,dy,B.c.width/FD,B.c.height/FD);
  return [dx,dy,B.w/FD,B.h/FD]; }
function coverThing(x,P,pxs,pys,ring,cw){
  if(P._lk===undefined){ const q=pXY(P), wo=G.worldOff||{x:0,y:0};
    const wx=Math.round(q[0]+wo.x), wy=Math.round(q[1]+wo.y);
    P._lh=(Math.imul((wx+64)*73856093^(wy+64),19349663)>>>0);
    P._lk=coverPieceFor(streetKindAt(wx)==='road',P.tall===false,P._lh); }
  const S=coverPieceSprite(P._lk,ring); if(!S)return false;
  x.drawImage(S.c,Math.round(pxs-S.ax/FD),Math.round(pys-S.ay/FD),S.c.width/FD,S.c.height/FD); return true; }
/* ON HIM, over his head, beside the reach dot (V235 put it at ey-93 body px): never a ring on the street */
function eyesMark(x,ex,ey){ const bs=bodyScale(), py=ey-93*bs, d=8*bs, a=3*bs;
  x.save(); x.lineCap='round';
  for(const pass of [['rgba(24,20,16,0.7)',Math.max(2.5,2.4*bs)],['rgba(240,232,208,0.95)',Math.max(1.2,1.2*bs)]]){
    x.strokeStyle=pass[0]; x.lineWidth=pass[1]; x.beginPath();
    x.moveTo(ex-d,py-a); x.lineTo(ex-d-a,py); x.lineTo(ex-d,py+a);
    x.moveTo(ex+d,py-a); x.lineTo(ex+d+a,py); x.lineTo(ex+d,py+a); x.stroke(); }
  x.restore(); }
function overHeadChevron(x,ex,ey,col){ const bs=bodyScale(), py=ey-110*bs;
  x.save(); x.lineCap='round';
  for(const pass of [['rgba(24,20,16,0.7)',Math.max(3,2.8*bs)],[col,Math.max(1.5,1.5*bs)]]){
    x.strokeStyle=pass[0]; x.lineWidth=pass[1]; x.beginPath();
    x.moveTo(ex-4*bs,py-3*bs); x.lineTo(ex,py+1*bs); x.lineTo(ex+4*bs,py-3*bs); x.stroke(); }
  x.restore(); }
function hpOnHim(x,e,ex,ey){ const bs=bodyScale(), w=34*bs, h=3*bs, by=ey-104*bs, f=Math.max(0,Math.min(1,e.hp/e.max));
  x.fillStyle='rgba(0,0,0,0.55)'; x.fillRect(Math.round(ex-w/2-1),Math.round(by-1),Math.round(w+2),Math.round(h+2));
  x.fillStyle='rgba(232,60,40,0.92)'; x.fillRect(Math.round(ex-w/2),Math.round(by),Math.round(w*f),Math.round(h)); }
/* ===== /V238 ===== */
function coverSprite(low,w,s,ring){"""

EDITS = [
 ("""      const bw=ring*wq, bh=ring*hq;
      const bx=p0[0]-ring*0.5, by=p0[1]-ring*0.5;
      x.fillStyle='rgba(0,0,0,0.30)';
      x.beginPath(); x.ellipse(bx+bw*0.5,by+bh*0.72,bw*0.42,bh*0.16,0,0,7); x.fill();
      if(im){ x.save(); x.imageSmoothingEnabled=false;""",
  """      let bw=ring*wq, bh=ring*hq, bx=p0[0]-ring*0.5, by=p0[1]-ring*0.5;
      if(houseOn()){ const _r=carOnTile(x,P,p0,ring,!!(G._carBurnt||{})[P.car]); bx=_r[0]; by=_r[1]; bw=_r[2]; bh=_r[3]; }   /* V238: one tile, the man's size, a square shadow */
      else { x.fillStyle='rgba(0,0,0,0.30)';
        x.beginPath(); x.ellipse(bx+bw*0.5,by+bh*0.72,bw*0.42,bh*0.16,0,0,7); x.fill(); }
      if(houseOn()){} else if(im){ x.save(); x.imageSmoothingEnabled=false;"""),
 ("""        if(_bt){ x.save(); x.globalCompositeOperation='multiply';
          x.fillStyle='rgba(38,30,26,0.72)'; x.fillRect(bx,by,bw,bh); x.restore(); }""",
  """        if(_bt){ if(!houseOn()){ x.save(); x.globalCompositeOperation='multiply';   /* V238: on the house board the burnt shell is baked */
          x.fillStyle='rgba(38,30,26,0.72)'; x.fillRect(bx,by,bw,bh); x.restore(); } }"""),
 ("""  for(let a=0;a<(vert?CAR_W:CAR_L);a++)for(let b=0;b<(vert?CAR_L:CAR_W);b++){""",
  """  const _ca=houseOn()?1:(vert?CAR_W:CAR_L), _cb=houseOn()?1:(vert?CAR_L:CAR_W);   /* V238: his 2x3 was on the 1.5 m tile; a combat tile is a house, so a car is one */
  for(let a=0;a<_ca;a++)for(let b=0;b<_cb;b++){"""),
 ("""    const _csp=coverSprite(P.tall===false,_cw,s,ring);""",
  """    if(houseOn()&&coverThing(x,P,pxs,pys,ring,_cw))continue;   /* V238: a burnt car on the road, a block wall elsewhere */
    const _csp=coverSprite(P.tall===false,_cw,s,ring);"""),
 ("""    x.fillStyle='rgba(232,60,40,0.85)'; x.fillRect(ex-er,ey+er*1.25,er*2*Math.max(0,e.hp/e.max),2); }""",
  """    if(houseOn()&&!e.dead){ hpOnHim(x,e,ex,ey); }   /* V238: on him, over his head, never on the street at his feet */
    else if(!houseOn()){ x.fillStyle='rgba(232,60,40,0.85)'; x.fillRect(ex-er,ey+er*1.25,er*2*Math.max(0,e.hp/e.max),2); } }"""),
 ("""        x.beginPath(); x.ellipse(ex,ey+er*0.66,er*1.15,er*0.42,0,0,7);
        x.strokeStyle='rgba(24,20,16,0.55)'; x.lineWidth=Math.max(2,er*0.30); x.stroke();
        x.strokeStyle='rgba(240,232,208,0.95)'; x.lineWidth=Math.max(1,er*0.16); x.stroke();""",
  """        if(houseOn()) eyesMark(x,ex,ey);   /* V238: he sees you, said beside the dot over his head */
        else { x.beginPath(); x.ellipse(ex,ey+er*0.66,er*1.15,er*0.42,0,0,7);
        x.strokeStyle='rgba(24,20,16,0.55)'; x.lineWidth=Math.max(2,er*0.30); x.stroke();
        x.strokeStyle='rgba(240,232,208,0.95)'; x.lineWidth=Math.max(1,er*0.16); x.stroke(); }"""),
 ("""    if(!e.dead&&!(e.prone>0)){ /* WEAPON READ V14: you always see who holds what */""",
  """    if(!e.dead&&!(e.prone>0)&&!houseOn()){ /* WEAPON READ V14: you always see who holds what */   /* V238: on the house board the body carries it */"""),
 ("""    if(G.selTarget===e.i&&!e.dead){ x.strokeStyle='rgba(232,176,74,0.9)'; x.lineWidth=2.5;   /* your chosen man */
      x.beginPath(); x.arc(ex,ey,er*1.75,0,7); x.stroke(); }""",
  """    if(G.selTarget===e.i&&!e.dead&&houseOn()) overHeadChevron(x,ex,ey,'rgba(232,176,74,0.95)');   /* V238: your chosen man, over his head */
    else if(G.selTarget===e.i&&!e.dead){ x.strokeStyle='rgba(232,176,74,0.9)'; x.lineWidth=2.5;   /* your chosen man */
      x.beginPath(); x.arc(ex,ey,er*1.75,0,7); x.stroke(); }"""),
 ("""    if(G.targetMode==='manual'&&!e.dead&&(peeking(e)||firing(e)||e.melee)&&G.selTarget!==e.i){""",
  """    if(houseOn()&&G.targetMode==='manual'&&!e.dead&&(peeking(e)||firing(e)||e.melee)&&G.selTarget!==e.i) overHeadChevron(x,ex,ey,'rgba(150,170,205,0.8)');   /* V238 */
    else if(G.targetMode==='manual'&&!e.dead&&(peeking(e)||firing(e)||e.melee)&&G.selTarget!==e.i){"""),
 ("function coverSprite(low,w,s,ring){", None),
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
        print('  cover is already a thing')
        return
    if '__THE_STREET_HAS_KERBS__' not in blob:
        sys.exit('GUARD: V237 is not in this blob; V238 is written on top of it')
    helpers = HELPERS.replace('__BANK__', bank_js())
    for old, new in EDITS:
        n = blob.count(old)
        if n != 1:
            sys.exit('ANCHOR: expected 1, found %d for %r' % (n, old[:80]))
        blob = blob.replace(old, helpers if new is None else new, 1)
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V238 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
