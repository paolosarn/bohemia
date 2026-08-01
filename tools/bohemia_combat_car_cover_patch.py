#!/usr/bin/env python3
"""V108 THE CAR IS THE BEST COVER ON THE LOT AND THE WORST PLACE TO STAND.

Paolo 7/31: "I need you to take a big swing and do something really awesome
for combat pretty please Please make sure cars can be used as Cover pretty
please."

WHERE IT WAS. Since v103 a car has been six pillar cells, so it already blocked
a bullet -- but every cell was identical, worth exactly as much as a concrete
block, and the game never once said the word CAR. A wreck you can hide behind
that is mechanically a crate is not cover, it is scenery with collision.

--------------------------------------------------------------------------
THE SWING: A CAR IS NOT ONE THING, AND THE DIFFERENCE IS THE DECISION.
--------------------------------------------------------------------------
This is the most-tested thing in real ballistics and the answer is unanimous
and counter-intuitive, which is exactly what makes it a good mechanic.

  * THE ENGINE BAY STOPS RIFLE ROUNDS. Block, transmission, front wheel and
    brake assembly are a foot of cast iron and steel. Every law-enforcement
    vehicle-cover doctrine says the same sentence: get to the front wheel.
  * THE DOORS STOP NOTHING. A door is 20-gauge sheet with an air gap, a
    window regulator and a plastic card behind it. Penetration testing puts
    pistol rounds clean through both doors. It is CONCEALMENT, not cover.
  * THE BOOT IS LOW AND SOLID -- and it is where the tank lives.

So the three tiles of a car are three different offers:
  ENGINE  hard cover, and it is the far end from the tank.
  CABIN   they lose your line, and their bullets do not care. Buys time,
          never safety. THE TRAP THAT LOOKS LIKE THE SAFE OPTION.
  BOOT    hard cover, low enough to vault -- sitting on the fuel.

"Think about all the shit you will need to hide behind" was his arena brief.
This is that sentence answered properly: the same object is good cover, fake
cover and a bomb depending on which end of it you pick.

--------------------------------------------------------------------------
AND THEN IT COOKS OFF.
--------------------------------------------------------------------------
Rounds that hit the car build HEAT. So does a grenade near it. Past the
threshold the tank goes, and it takes the whole tile radius with it -- them,
and you, if you are the one hugging it. So the best cover on the lot has a
timer that YOU are also standing next to, and both sides can see the heat
climbing. A man tucked behind a car is not a stalemate any more: he is a
target with a fuse, and the answer is the grenade Paolo just got. Throw it AT
the car, not at the man.

This is the honest version, not the Hollywood one: one bullet never sets off
a fuel tank, so it takes real sustained fire or an explosion, and what is left
afterward is a burnt shell -- still an obstacle, still low hard cover, because
the block and the frame survive a fire. The lot is permanently changed.

MECHANISM-MINE / CONTENTS-PAOLO'S: the parts, the heat and the cook-off are
machinery. Every NUMBER in here (heat per round, the threshold, the blast
bands, the wreck's cover value) is a DIAL, set to something playable and his
to move.

REUSE CHECK: cooks NO new graphic pixels. It reads banks/BOHEMIA_STREET_POOLS
_HARMONIZED_7_14_26.txt only through the already-embedded street tiles, and
the car sprites are the eight approved wrecks already embedded as CAR_B64 by
v103 (approved asset index, VEHICLES row). The burnt state is a tint applied
to the SAME approved sprite, not a new one, so no art is authored here and no
bank needs opening.
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V108 THE CAR IS THREE DIFFERENT OFFERS'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    s = base64.b64decode(m.group(1)).decode('utf-8')

    if MARK in s:
        print('v108 already in; nothing to do')
        return

    # ================= 1. THE CELLS BECOME PARTS =======================
    old = """  const along=c=>vert?c[1]-oy:c[0]-ox, span=(vert?CAR_L:CAR_W)-1;
  for(const c of cells){
    const tall=along(c)<span*0.6;"""
    new = """  const along=c=>vert?c[1]-oy:c[0]-ox, span=(vert?CAR_L:CAR_W)-1;
  /* ===== V108 THE CAR IS THREE DIFFERENT OFFERS ====================
     CAR_L is 3, so a car is exactly three rows deep and the rows ARE the
     parts. Nothing is invented: this is the shape the vehicle already had.
       row 0  ENGINE  block + transmission + front wheel. HARD.
       row 1  CABIN   sheet steel and glass. CONCEALMENT ONLY.
       row 2  BOOT    low, hard, and sitting on the tank.
     hard=false is the whole mechanic: a cell that breaks their LINE without
     stopping their BULLET. It is the only cover in the game that lies. */
  /* NOT `span`. span is (vert?CAR_L:CAR_W)-1, which is 1 for a car parked
     ACROSS the screen -- a v103 slip that was invisible while it only fed a
     boolean. `along` always measures down the car's LENGTH, so the row count
     is always CAR_L. Measured: with span, a horizontal car came out
     engine/boot/boot and had NO CABIN AT ALL. */
  const _rows=CAR_L-1;
  for(const c of cells){
    const _row=Math.max(0,Math.min(2,Math.round(along(c)/Math.max(1,_rows)*2)));   /* 0 engine, 1 cabin, 2 boot */
    const part=_row<=0?'engine':(_row>=2?'boot':'cabin');
    const tall=(part!=='boot');
    const hard=(part!=='cabin');"""
    s = subN(s, old, new)

    old = """    G.pillars.push({ea:Math.atan2(c[1],c[0]),edist:Math.hypot(c[0],c[1]),
      r:0.5,tall:tall,car:cid,nose:(c===cells[0]),carVert:!!vert,
      carArt:cid%Math.max(1,CAR_B64.length)}); }
  return true; }"""
    new = """    G.pillars.push({ea:Math.atan2(c[1],c[0]),edist:Math.hypot(c[0],c[1]),
      r:0.5,tall:tall,car:cid,nose:(c===cells[0]),carVert:!!vert,
      part:part,hard:hard,tank:(part==='boot'),
      carArt:cid%Math.max(1,CAR_B64.length)}); }
  return true; }
/* ===== V108 HEAT, AND THE THING AT THE END OF IT ====================
   ONE BULLET NEVER SETS OFF A FUEL TANK -- that is the film version and it
   would make the best cover on the lot unusable. It takes sustained fire or
   an explosion, which is also what makes it a DECISION: the heat is visible
   and climbing, so both sides get to choose what to do about it. */
const CAR_COOK=10;         /* rounds-worth of heat before the tank goes [DIAL] */
const CAR_GREN_HEAT=7;     /* a grenade beside it does most of the work [DIAL] */
const CAR_BLAST=2.6;       /* tiles [DIAL] */
function carCells(cid){ return (G.pillars||[]).filter(P=>P.car===cid); }
function carHeat(cid,n){ if(!cid||G.over)return; G._carHeat=G._carHeat||{};
  if((G._carBurnt||{})[cid])return;                       /* a shell cannot burn twice */
  G._carHeat[cid]=(G._carHeat[cid]||0)+n;
  if(G._carHeat[cid]>=CAR_COOK)cookOff(cid); }
function cookOff(cid){
  if(G.over)return;
  G._carBurnt=G._carBurnt||{}; if(G._carBurnt[cid])return; G._carBurnt[cid]=1;
  const cells=carCells(cid); if(!cells.length)return;
  let sx2=0,sy2=0; for(const P of cells){ const q=pXY(P); sx2+=q[0]; sy2+=q[1]; }
  const bx=sx2/cells.length, by=sy2/cells.length;
  /* THE SHELL. Fire takes the glass, the seats and the tyres; the block and
     the frame do not go anywhere. So every cell becomes LOW HARD cover --
     the cabin gets BETTER, which is the one honest surprise in the whole
     mechanic, and the lot is permanently different for the rest of the fight. */
  for(const P of cells){ P.burnt=true; P.tall=false; P.hard=true; P.tank=false; }
  let killed=0,hurt=0;
  const band=d=>d<0.9?(46+Math.floor(Math.random()*14)):(d<CAR_BLAST?(20+Math.floor(Math.random()*10)):0);
  { const dS=Math.hypot(bx,by), sd=band(dS);
    if(sd>0){ G.pHP=Math.max(0,G.pHP-sd); try{updPlayer();}catch(_e){} try{addWound(G);}catch(_e){} G.steady=0;
      onOffbeat(()=>{ try{hurtFlash();}catch(_e){} setRead('THE TANK WENT','-'+sd+' \\u2014 you were hugging it','#e8593a'); });
      if(G.pHP<=0){ try{loseGame();}catch(_e){} return; } } }
  for(const e of (G.e||[])){ if(e.dead||e.downed)continue;
    const p=pXY(e), dmg=band(Math.hypot(p[0]-bx,p[1]-by)); if(dmg<=0)continue;
    applyDamage(e,dmg); hurt++;
    try{ G._fx.push({type:'dmgnum',ea:e.ea,edist:e.edist,lvl:e.lvl|0,n:dmg,t:0,life:1.0}); }catch(_e){}
    if(e.hp<=0){ e.dead=true; killed++; e._deathVar=Math.floor(Math.random()*3);
      try{addWound(e);}catch(_e){} e._deadAt=performance.now()+120; } }
  G._carFire=G._carFire||[]; G._carFire.push({ea:Math.atan2(by,bx),edist:Math.hypot(bx,by),t:performance.now()});
  (G.bloodSpots=G.bloodSpots||[]);   /* the scorch rides the same world-anchored list the pools do */
  G.enemiesLeft=aliveEnemies().length;
  try{updateGeomCover();}catch(_e){}
  onOffbeat(()=>{ try{sndKill();}catch(_e){}
    setRead('COOKED OFF',(killed?killed+' gone':(hurt?hurt+' caught it':'nobody was close enough'))
      +' \\u2014 that car is a shell now','#e8593a'); }); }"""
    s = subN(s, old, new)

    # cars rebuild per fight: the heat book and the fire fx go with them
    old = """    if(putCar(ox,oy,vert,cid)){ placed.push(cid); cid++; } }
  G._cars=placed.length; }"""
    new = """    if(putCar(ox,oy,vert,cid)){ placed.push(cid); cid++; } }
  G._cars=placed.length; G._carHeat={}; G._carBurnt={}; G._carFire=[]; }   /* V108: new lot, cold metal */"""
    s = subN(s, old, new)

    # ================= 2. HARD vs SOFT COVER ===========================
    old = """function myCoverAgainst(ang,dist,lvl){   /* V7: the magic arcs are dead — cover is GEOMETRY on tiles only */
  /* V90: a floor between you is not a wall between you. Nobody is covered. */
  if(lvl!=null&&(lvl|0)!==myLvl())return false;
  /* PILLAR V5: a pillar on the line to the shooter IS cover (RF4 law, geometry-driven) */
  const md=(dist==null?MAX_RANGE:dist);
  return (G.pillars||[]).some(P=>{ if(P.edist>md||P.edist<0.8)return false;
    let dA=Math.abs(((ang-P.ea+Math.PI*3)%(Math.PI*2))-Math.PI);
    return dA<Math.PI/2 && Math.sin(dA)*P.edist<P.r*0.9; }); }"""
    new = """/* ===== V108 HARD COVER vs CONCEALMENT ===============================
   coverPillarAgainst RETURNS the thing protecting you, because two systems
   now need to know WHICH piece it was: the readout (so you can be told you
   are behind a door and not a block) and the heat (so their rounds land in
   the car that stopped them). myCoverAgainst keeps its exact old boolean
   contract, so every one of its call sites is untouched.
   soft = P.hard===false = a car's CABIN. It breaks the line and stops
   nothing, which is the only cover in this game that lies to you. */
function coverPillarAgainst(ang,dist,lvl,soft){
  if(lvl!=null&&(lvl|0)!==myLvl())return null;
  const md=(dist==null?MAX_RANGE:dist);
  let best=null;
  for(const P of (G.pillars||[])){
    if(P.edist>md||P.edist<0.8)continue;
    if(!soft&&P.hard===false)continue;                    /* glass is not cover */
    const dA=Math.abs(((ang-P.ea+Math.PI*3)%(Math.PI*2))-Math.PI);
    if(dA<Math.PI/2 && Math.sin(dA)*P.edist<P.r*0.9){
      if(!best||P.edist<best.edist)best=P; } }
  return best; }
function myCoverAgainst(ang,dist,lvl){   /* V7: the magic arcs are dead — cover is GEOMETRY on tiles only */
  /* V90: a floor between you is not a wall between you. Nobody is covered. */
  return !!coverPillarAgainst(ang,dist,lvl,false); }
/* the LINE, not the protection: this is what the acquisition bead asks, so a
   car door still buys you the time it really would. */
function myConcealAgainst(ang,dist,lvl){ return !!coverPillarAgainst(ang,dist,lvl,true); }
/* V108: what am I actually behind, in his words, on the readout. */
function coverWord(P){ if(!P)return null;
  if(!P.car)return P.tall===false?'LOW STONE':'STONE';
  if(P.burnt)return 'BURNT SHELL';
  return P.part==='engine'?'ENGINE BLOCK':(P.part==='boot'?'THE BOOT':'THE DOORS'); }
function coverLine(P){ if(!P)return null;
  if(!P.car)return null;
  if(P.burnt)return 'fire took the rest \\u2014 low, and it cannot burn twice';
  if(P.part==='cabin')return 'sheet and glass \\u2014 they lose your line, not their bullet';
  if(P.part==='boot')return 'low and solid \\u2014 and the tank is right there';
  return 'a foot of cast iron \\u2014 the best cover on this lot'; }"""
    s = subN(s, old, new)

    # the enemy's own cover: a man at the doors is not protected either
    old = """  const exy=pXY(e);
  return (G.pillars||[]).some(P=>{ const pxy=pXY(P);
    return segNear(0,0,exy[0],exy[1],pxy[0],pxy[1],P.r*0.85) && Math.hypot(pxy[0]-exy[0],pxy[1]-exy[1])<1.8; }); }"""
    new = """  const exy=pXY(e);
  /* V108: the rule runs both ways -- a man tucked at a car door has no more
     protection from you than you have from him. He is concealed, not covered,
     and your dial does not care about either. */
  return (G.pillars||[]).some(P=>{ if(P.hard===false)return false; const pxy=pXY(P);
    return segNear(0,0,exy[0],exy[1],pxy[0],pxy[1],P.r*0.85) && Math.hypot(pxy[0]-exy[0],pxy[1]-exy[1])<1.8; }); }"""
    s = subN(s, old, new)

    # ---- the acquisition bead runs on the LINE, so glass counts --------
    old = """    if(myCoverAgainst(e2.ea,e2.edist,e2.lvl)){ if((e2.acq||0)>=1)_broke++; e2.acq=0; } }   /* V24 LOS BEAD (Paolo: 'it has to be a line of sight thing'): only BREAKING THE LINE resets his clock — walking in the open keeps you tracked */"""
    new = """    if(myConcealAgainst(e2.ea,e2.edist,e2.lvl)){ if((e2.acq||0)>=1)_broke++; e2.acq=0; } }   /* V24 LOS BEAD (Paolo: 'it has to be a line of sight thing'): only BREAKING THE LINE resets his clock — walking in the open keeps you tracked. V108: the LINE is what breaks it, so a car door counts here and nowhere else. */"""
    s = subN(s, old, new)

    old = """  let _broke=0; for(const e2 of G.e){ if(e2.dead||e2.melee)continue; if(myCoverAgainst(e2.ea,e2.edist,e2.lvl)){ if((e2.acq||0)>=1)_broke++; e2.acq=0; } }"""
    new = """  let _broke=0; for(const e2 of G.e){ if(e2.dead||e2.melee)continue; if(myConcealAgainst(e2.ea,e2.edist,e2.lvl)){ if((e2.acq||0)>=1)_broke++; e2.acq=0; } }   /* V108: the bead is a LINE test */"""
    s = subN(s, old, new)

    old = """  for(const e2 of G.e){ if(e2.dead||e2.melee)continue; if(myCoverAgainst(e2.ea,e2.edist,e2.lvl))e2.acq=0; }"""
    new = """  for(const e2 of G.e){ if(e2.dead||e2.melee)continue; if(myConcealAgainst(e2.ea,e2.edist,e2.lvl))e2.acq=0; }   /* V108: the bead is a LINE test */"""
    s = subN(s, old, new)

    # ================= 3. THEIR ROUNDS LAND IN THE CAR =================
    old = """  for(const e of pool){ const cov=myCoverAgainst(e.ea,e.edist,e.lvl); const acc=distAccuracy(e)*(firing(e)?1:0.6)*(cov?0.4:1)*((e.E.acc||0.55)/0.55)*(e.hp<=e.max*0.4?0.8:1);   /* V30: wounded guns shake */"""
    new = """  for(const e of pool){ const covP=coverPillarAgainst(e.ea,e.edist,e.lvl,false); const cov=!!covP;
    /* V108: a round that YOUR COVER ate has to go somewhere. If the thing
       that stopped it was a car, that is heat in the metal, and the heat is
       the fuse. Hiding behind a car is a clock you can watch. */
    if(covP&&covP.car)carHeat(covP.car,1);
    const acc=distAccuracy(e)*(firing(e)?1:0.6)*(cov?0.4:1)*((e.E.acc||0.55)/0.55)*(e.hp<=e.max*0.4?0.8:1);   /* V30: wounded guns shake */"""
    s = subN(s, old, new)

    # ================= 4. THE GRENADE IS THE ANSWER ====================
    old = """  G._grenadeBlast={ea:G.pGren.ea,edist:G.pGren.edist,t:performance.now()}; G.pGren=null;"""
    new = """  /* V108: AND THE GRENADE IS HOW YOU DELIBERATELY COOK A CAR. Throw it at
     the man behind the wreck and he steps off the tile; throw it AT THE
     WRECK and the wreck answers for you. That is the play. */
  { const seen={}; for(const P of (G.pillars||[])){ if(!P.car||seen[P.car])continue;
      const q=pXY(P); if(Math.hypot(q[0]-gp[0],q[1]-gp[1])<CAR_BLAST){ seen[P.car]=1; carHeat(P.car,CAR_GREN_HEAT); } } }
  G._grenadeBlast={ea:G.pGren.ea,edist:G.pGren.edist,t:performance.now()}; G.pGren=null;"""
    s = subN(s, old, new)

    # ================= 5. YOU CAN SEE ALL OF IT ========================
    old = """      if(im){ x.save(); x.imageSmoothingEnabled=false;
        if(!P.carVert){ x.translate(bx+bw*0.5,by+bh*0.5); x.rotate(Math.PI/2);
          x.drawImage(im,-bh*0.5,-bw*0.5,bh,bw); }
        else x.drawImage(im,bx,by,bw,bh);
        x.restore(); }
      else { x.fillStyle='#5a5346'; x.fillRect(bx,by,bw,bh); }
      continue; }"""
    new = """      if(im){ x.save(); x.imageSmoothingEnabled=false;
        if(!P.carVert){ x.translate(bx+bw*0.5,by+bh*0.5); x.rotate(Math.PI/2);
          x.drawImage(im,-bh*0.5,-bw*0.5,bh,bw); }
        else x.drawImage(im,bx,by,bw,bh);
        x.restore(); }
      else { x.fillStyle='#5a5346'; x.fillRect(bx,by,bw,bh); }
      /* ===== V108 THE HEAT IS ON THE CAR, NOT IN A MENU ==============
         A fuse nobody can see is not a decision. The metal reddens as the
         rounds go in, breathing faster the closer it gets, and a burnt shell
         goes dark and stays dark so the lot reads its own history. */
      { const _bt=(G._carBurnt||{})[P.car];
        if(_bt){ x.save(); x.globalCompositeOperation='multiply';
          x.fillStyle='rgba(38,30,26,0.72)'; x.fillRect(bx,by,bw,bh); x.restore(); }
        else { const _ht=Math.min(1,((G._carHeat||{})[P.car]||0)/CAR_COOK);
          if(_ht>0.04){ const _pu=0.55+0.45*Math.sin(performance.now()*(0.004+_ht*0.020));
            x.save(); x.globalCompositeOperation='lighter';
            x.fillStyle='rgba(232,'+Math.round(120-70*_ht)+',40,'+(0.30*_ht*_pu).toFixed(3)+')';
            x.fillRect(bx,by,bw,bh); x.restore();
            /* and the tank end burns hottest, because that is the end that matters */
            x.save(); x.globalAlpha=Math.min(0.95,0.35+0.65*_ht);
            x.strokeStyle='rgba(255,'+Math.round(190-130*_ht)+',60,0.95)';
            x.lineWidth=Math.max(1.5,ring*0.09);
            x.strokeRect(bx+1,by+1,bw-2,bh-2); x.restore(); } } }
      continue; }"""
    s = subN(s, old, new)

    # the fireball
    old = """  /* V99 YOUR grenade, in warm amber. Two fused objects on one field that look
     the same would be unreadable, and the one thing you must never be confused
     about is which of them is about to hurt YOU. */"""
    new = """  /* V108 THE COOK-OFF. World-anchored like everything else on this field, so
     it stays on the car while you keep moving. */
  if(G._carFire&&G._carFire.length){ const _fn=performance.now();
    for(let i=G._carFire.length-1;i>=0;i--){ const F=G._carFire[i];
      const age=(_fn-F.t)/1400; if(age>=1){ G._carFire.splice(i,1); continue; }
      const fp=fieldPos(F,W,H,cx,cy), rr=ring*(0.7+age*2.6), aa=Math.pow(1-age,1.7);
      x.save();
      x.fillStyle='rgba(255,'+Math.round(210-150*age)+',70,'+(0.55*aa).toFixed(3)+')';
      x.beginPath(); x.arc(fp[0],fp[1],rr,0,7); x.fill();
      x.fillStyle='rgba(40,30,26,'+(0.40*aa).toFixed(3)+')';
      x.beginPath(); x.arc(fp[0],fp[1]-rr*0.5,rr*0.85,0,7); x.fill();
      x.restore(); } }
  /* V99 YOUR grenade, in warm amber. Two fused objects on one field that look
     the same would be unreadable, and the one thing you must never be confused
     about is which of them is about to hurt YOU. */"""
    s = subN(s, old, new)

    # ---- and the readout NAMES what you are behind --------------------
    old = """  if(_sprinting){ setRead('SPRINTED '+['N','NE','E','SE','S','SW','W','NW'][d],'two tiles — 1 pip, no turn spent, nobody gets a shot','#8fe89a');"""
    new = """  /* V108: the whole car mechanic is worthless if you cannot tell which end
     of it you are standing at, so the step that puts you there says so. */
  if(!_sprinting){ let _cp=null;
    for(const e3 of (G.e||[])){ if(e3.dead||e3.melee)continue;
      const q3=coverPillarAgainst(e3.ea,e3.edist,e3.lvl,true); if(!q3)continue;
      if(!_cp||q3.edist<_cp.edist)_cp=q3; }
    if(_cp&&_cp.car){ setRead(coverWord(_cp),coverLine(_cp),
      _cp.hard===false?'#e8b04a':'#8fe89a'); renderBoard(); updGap();
      endTurnReturn(false); return; } }
  if(_sprinting){ setRead('SPRINTED '+['N','NE','E','SE','S','SW','W','NW'][d],'two tiles — 1 pip, no turn spent, nobody gets a shot','#8fe89a');"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v108: cars are cover with parts, heat and a cook-off (%d chars)' % len(s))


if __name__ == '__main__':
    main()
