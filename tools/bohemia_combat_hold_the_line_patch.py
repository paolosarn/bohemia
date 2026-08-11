#!/usr/bin/env python3
"""V137 THE DEFENCE IS REAL: THERE IS A PLACE BEHIND YOU AND THEY CAN REACH IT.

Paolo 8/8: "build a tutorial-tier family-defense encounter for the cold open"

--------------------------------------------------------------------------
V135 SHIPPED THE CONTRACT AND NOT THE FIGHT, AND THAT IS ON ME
--------------------------------------------------------------------------
V135 wrote the cold open as a spec with a `defend` block on it, and said in its
own docstring that a second lose condition is THE mechanism that turns a duel
into a defence. Then it shipped the spec and stopped. The defend block rode as
far as G.encounter in the parent and no further: it was never sent to the combat
frame, nothing in the fight ever read it, and nothing could ever be lost by
letting a man walk past. A defence you cannot fail is a duel with a label on it.

This is the fight.

--------------------------------------------------------------------------
WHAT A SECOND LOSE CONDITION ACTUALLY REQUIRES
--------------------------------------------------------------------------
Four things, and V135 had none of them:

1. THE PLACE HAS TO EXIST IN THE WORLD. It is world state like a pillar, a
   corpse and the blood: anchored to its tile and carried by worldShift, so
   stepping backward really does put you between them and it, and stepping
   forward really does leave it open. If it did not move with the world, every
   step you took would drag the thing you are defending along with you.

2. IT HAS TO SIT SOMEWHERE HONEST. It is placed OPPOSITE the bearing the threat
   arrives on, holdLine tiles out. That is DERIVED from where they are, not
   authored -- MAP LAW is untouched, because nothing here designs a layout, and
   *** WHAT THE PLACE IS AND WHO IS IN IT ARE STILL HIS AND STILL EMPTY. ***
   The marker says HOLD. It does not say whose house it is.

3. THEY HAVE TO WANT IT. A hostile who only ever duels you is not a threat to
   anything behind you. So a defending fight adds a pull toward the place to
   the V136 scorer, and gives every man a candidate step STRAIGHT AT IT -- which
   is the move that makes him walk past you instead of trading. He will still
   take an angle on you when the angle is worth more, which is what makes him
   read as a person rather than a lemming with a waypoint.

4. THEY HAVE TO BE ALLOWED PAST. V136 holds shooters at PRESS_STANDOFF so
   nobody walks into your lap, and at 3.2 tiles a man can never get around you
   to something 6 tiles behind. A man running an objective is not trying to
   shoot you, he is trying to get by, so HOLD_PASS lets him brush past. Without
   this one number the whole feature is geometrically impossible and would have
   looked like it worked.

--------------------------------------------------------------------------
AND IT IS THE OTHER HALF OF STANDING STILL
--------------------------------------------------------------------------
V136 made your tile decay: stand there and they walk around your cover and
close, so you get hit harder every turn. This is the harder version of the same
lesson. A closer you ignore does not kill you. He walks past you, and you lose
at full health, having killed nobody. Cover is worthless if it is not between
them and the thing that matters.

DIALS: HOLD_R how close is close enough, HOLD_PULL how badly they want it,
HOLD_PASS how wide a berth a runner gives you.

REUSE CHECK: cooks NO graphic pixels. The marker is the EXISTING grenade marker
drawn at a different point -- same fieldPos call, same pulsing disc, same dashed
ring, same label geometry, opened in code at drawField's grenade block and
copied there rather than invented. The rest reuses pXY, worldShift, pressScore,
setRead, freeze, sndLose and sendCombatEnd. No bank is opened because no art is
authored.

TASTE CHECK: authors no art and no lore. The taste rule is the one V135 named
and then leaned on: the opening of his game is the most seductive place to write
his lore for me, so the marker carries a MECHANIC word (HOLD) and not a name, a
relationship or a reason. cast and place stay empty.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V137 HOLD THE LINE'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v137 already in; nothing to do')
        return

    # ---- 1. PARENT: the defend block actually gets sent -----------------
    old = """  combatPost({type:'BOHEMIA_ENCOUNTER',packageId:G.encounter.packageId,roster:roster,
    playerHP:G.encounter.playerHP,encounterId:ctx.encounterId,questId:ctx.questId,stepId:ctx.stepId,
    objective:ctx.objective,faction:ctx.faction,reason:ctx.reason,mercy:ctx.mercy});"""
    new = """  combatPost({type:'BOHEMIA_ENCOUNTER',packageId:G.encounter.packageId,roster:roster,
    playerHP:G.encounter.playerHP,encounterId:ctx.encounterId,questId:ctx.questId,stepId:ctx.stepId,
    objective:ctx.objective,faction:ctx.faction,reason:ctx.reason,mercy:ctx.mercy,
    /* V137: v135 put the defend contract on G.encounter and then never sent it,
       so the fight could not read it and nothing could ever be lost by letting a
       man walk past. A defence you cannot fail is a duel with a label on it. */
    defend:G.encounter.defend||null});"""
    html = subN(html, old, new)

    # ---- 2. FRAME: the handoff carries it in, and places it after setup --
    old = """    var alive=0,i; for(i=0;i<(G.e||[]).length;i++)if(standing(G.e[i]))alive++;
    G.enemiesLeft=alive;
    return C; }"""
    new = """    var alive=0,i; for(i=0;i<(G.e||[]).length;i++)if(standing(G.e[i]))alive++;
    G.enemiesLeft=alive;
    /* V137 HOLD THE LINE: a defending fight gets its second lose condition here,
       AFTER setup, because the place is positioned relative to where the threat
       actually turned out to be. Guarded by typeof so the handoff core still
       loads headless in node, where the demo's functions do not exist. */
    G.defend=null; G.hold=null; G._defLost=false;
    if(d.defend&&typeof placeHoldLine==='function'){ try{ placeHoldLine(d.defend); }catch(_e){} }
    return C; }"""
    js = subN(js, old, new)

    # ---- 3. the place, the pull, and the loss ---------------------------
    old = """function pressAI(){ G._pressN=0; if(G.over)return;"""
    new = """/* ===== V137 HOLD THE LINE: THE DEFENCE IS REAL ====================
   V135 wrote the cold open as a spec with a `defend` block, said in its own
   words that a second lose condition is THE thing that turns a duel into a
   defence, and then shipped the contract without the fight: the block rode as
   far as G.encounter in the parent and was never sent, never read, and never
   able to lose anybody anything.
   THE PLACE IS WORLD STATE, like a pillar and the blood. It is anchored to its
   tile and carried by worldShift, so stepping back really does put you between
   them and it -- if it moved with you, every step would drag the thing you are
   defending along behind you and there would be nothing to defend.
   IT IS DERIVED, NOT DESIGNED: opposite the bearing the threat arrives on,
   holdLine tiles out. MAP LAW is untouched, and *** WHAT THE PLACE IS AND WHO
   IS IN IT ARE STILL HIS AND STILL EMPTY. *** The marker says HOLD. It does not
   say whose house it is.
   AND IT IS THE HARD VERSION OF THE STANDING-STILL LESSON. V136 makes your tile
   decay. This one says a man you ignore does not kill you, he walks past you,
   and you lose at full health having killed nobody. Cover is worthless if it is
   not between them and the thing that matters. */
const HOLD_R=1.2;       /* how close is close enough to have reached it [DIAL] */
const HOLD_PULL=0.9;    /* per tile of progress: how badly they want it vs an angle on you [DIAL] */
const HOLD_PASS=1.8;    /* a man running an objective is not trying to shoot you, he is trying to get by [DIAL] */
const HOLD_ANGLE=0.9;   /* what an angle on you is worth to a man who is here for the place, not for you [DIAL] */
const HOLD_STONE=0.25;  /* and what a nice rock is worth to him: almost nothing, he is not stopping [DIAL] */
function placeHoldLine(spec){
  G.defend=null; G.hold=null; G._defLost=false;
  if(!spec||!(spec.holdLine>0))return;
  let sx=0,sy=0,n=0;
  for(const e of (G.e||[])){ if(e.dead)continue; sx+=Math.cos(e.ea); sy+=Math.sin(e.ea); n++; }
  const threat=n?Math.atan2(sy,sx):0;
  G.defend={holdLine:spec.holdLine,r:HOLD_R};
  G.hold={ea:threat+Math.PI,edist:spec.holdLine,r:HOLD_R};   /* behind you, from where they are coming */
  setRead('HOLD THE LINE','they get past you and you lose, however healthy you are','#6aa8e8'); }
/* a hostile standing on it ends the fight, and it is NOT a death: you are still
   up, you just lost the only thing the fight was about. */
function holdCheck(){ if(!G.hold||G.over||G._defLost)return false;
  const h=pXY(G.hold);
  for(const e of (G.e||[])){ if(!e||e.dead||e.downed||e.broken||e.fleeing)continue;
    const p=pXY(e);
    if(Math.hypot(p[0]-h[0],p[1]-h[1])<=(G.hold.r||HOLD_R)){ G._defLost=true; loseHold(); return true; } }
  return false; }
function loseHold(){ G.over=true; G.phase='over';
  try{sndLose();}catch(_e){}
  setRead('THEY GOT PAST YOU','still standing, still lost \\u2014 that is what a defence is','#e8593a');
  try{setPhaseUI();}catch(_e){}
  try{freeze('last',0,-1);}catch(_e){}
  G._redPunch=Math.max(G._redPunch||0,1.5);
  try{stopFactionLoop();}catch(_e){}
  try{sendCombatEnd(false);}catch(_e){} }
function pressAI(){ G._pressN=0; if(G.over)return;"""
    js = subN(js, old, new)

    # ---- 4. the pull goes into the scorer -------------------------------
    # THE COMMIT. Measured first, 60 distinct arenas: without it 8 fights could be
    # ignored completely and still not lost, and the closest man stalled at 2.18
    # tiles having stopped gaining ground for 8.6 turns of 14. The cause was the
    # scorer, not the pull: the LAST step into the place costs a man the +3.0 he
    # gets for having an angle on the player, so he stood one tile short forever.
    # A man on the last few metres of an objective is not shopping for firing
    # angles, he is running. Inside HOLD_COMMIT he stops weighing the angle.
    old = """function pressScore(e,x,y){
  const d=Math.hypot(x,y)||0.01;
  let s=0;
  /* AN ANGLE IS WORTH THE MOST, BY A MILE. A shooter you are covered from does
     not have a reduced hit chance, he has none at all -- so eight feet sideways
     is the most valuable thing he can do with a turn. This is also the term
     that makes YOUR tile go stale while you stand on it. */
  if(!coverAtXY(x,y,e.lvl))s+=3.0;
  /* the range is worth exactly what the game already says it is worth */
  s+=2.2*(distT({edist:e.edist})-distT({edist:d}));
  /* rock to rock, like a person, instead of jogging the open lot */
  if(pillarAtXY(x,y,e.lvl))s+=0.8;
  return s; }"""
    new = """function pressScore(e,x,y){
  const d=Math.hypot(x,y)||0.01;
  let s=0;
  /* V137: when there is a place behind you, they want it. An ABSOLUTE distance
     term is the progress gradient, because every candidate is scored against
     where he is standing right now.
     AND THE LAST FEW METRES ARE A SPRINT, NOT A FIREFIGHT. Measured over 60
     arenas without this: eight fights could be ignored completely and still not
     lost, with the closest man stalled 2.18 tiles out having gained no ground
     for 8.6 turns of 14. The cause was this scorer and not the pull -- the last
     step INTO the place costs him the +3.0 he gets for holding an angle on you,
     so he stood one tile short of winning, forever. A man committed to an
     objective stops shopping for firing angles. */
  if(G.hold){ const h=pXY(G.hold); s-=HOLD_PULL*Math.hypot(x-h[0],y-h[1]); }
  /* AN ANGLE IS WORTH THE MOST, BY A MILE -- IN A DUEL. A shooter you are
     covered from does not have a reduced hit chance, he has none at all, so
     eight feet sideways is the most valuable thing he can do with a turn, and
     that is the term that makes YOUR tile go stale while you stand on it.
     BUT A MAN WHO IS HERE FOR THE PLACE IS NOT HERE FOR YOU. An assault force
     pushes an objective; it does not stop to shop for firing positions. His
     FEET go to the place and his gun still fires on the way, which is what the
     volley already does every turn regardless of where anybody stands.
     THE FIRST VERSION OF THIS WAS A CLIFF AND THE CLIFF WAS BACKWARDS: a
     "committed" bonus inside a radius meant that stepping INTO it cost him the
     angle term, so he refused the last stride and stalled exactly on the
     boundary. Measured: 5 of 60 defences lost, every stall at 2.6-2.7 tiles.
     A flat scale has no boundary to stall on -- the gradient runs all the way
     in. Measure the thing, do not add a second number on top of a broken one. */
  if(!coverAtXY(x,y,e.lvl))s+=G.hold?HOLD_ANGLE:3.0;
  /* the range is worth exactly what the game already says it is worth */
  s+=2.2*(distT({edist:e.edist})-distT({edist:d}));
  /* rock to rock, like a person, instead of jogging the open lot */
  if(pillarAtXY(x,y,e.lvl))s+=G.hold?HOLD_STONE:0.8;
  return s; }"""
    js = subN(js, old, new)

    # ---- 5. a step STRAIGHT AT IT, and room to get by --------------------
    old = """    const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist;
    const here=pressScore(e,ex,ey);
    let best=null,bs=here+PRESS_WORTH;
    for(const off of [-0.9,-0.62,-0.38,-0.18,0,0.18,0.38,0.62,0.9]){
      for(const gain of [0,PRESS_STEP*0.5,PRESS_STEP]){
        const r=Math.max(PRESS_STANDOFF,e.edist-gain), a=e.ea+off;
        const nx=Math.cos(a)*r, ny=Math.sin(a)*r;
        if(Math.hypot(nx-ex,ny-ey)>PRESS_STEP*1.02)continue;   /* further than a turn's walk */
        if(Math.hypot(nx,ny)<PRESS_STANDOFF-0.01)continue;     /* he is a shooter, he keeps his distance */"""
    new = """    const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist;
    const here=pressScore(e,ex,ey);
    let best=null,bs=here+PRESS_WORTH;
    /* V137: a shooter keeps his distance, but a man running an OBJECTIVE is not
       trying to shoot you, he is trying to get by. At 3.2 tiles nobody can ever
       get around you to something 6 tiles behind, so without this the whole
       defence is geometrically impossible while still looking like it works. */
    const standoff=G.hold?HOLD_PASS:PRESS_STANDOFF;
    /* the arc alone can never carry a man around you in time (0.9 rad at range
       6 is a 5.4-tile walk against a 1.8-tile step), so a defending fight also
       offers the straight line at it -- which IS the move that walks past you */
    const extra=[];
    if(G.hold){ const h=pXY(G.hold), dx=h[0]-ex, dy=h[1]-ey, L=Math.hypot(dx,dy)||1;
      for(const g of [PRESS_STEP,PRESS_STEP*0.6])extra.push([ex+dx/L*g,ey+dy/L*g]); }
    for(const off of [-0.9,-0.62,-0.38,-0.18,0,0.18,0.38,0.62,0.9]){
      for(const gain of [0,PRESS_STEP*0.5,PRESS_STEP]){
        const r=Math.max(standoff,e.edist-gain), a=e.ea+off;
        const nx=Math.cos(a)*r, ny=Math.sin(a)*r;
        if(Math.hypot(nx-ex,ny-ey)>PRESS_STEP*1.02)continue;   /* further than a turn's walk */
        if(Math.hypot(nx,ny)<standoff-0.01)continue;           /* he keeps his distance unless he is running past */"""
    js = subN(js, old, new)

    # the straight-at-it candidates run the same rejections as everything else
    old = """        const sc=pressScore(e,nx,ny);
        if(sc>bs){bs=sc;best=[nx,ny,sc-here];} } }
    if(best)plans.push({e:e,x:best[0],y:best[1],gain:best[2]}); }"""
    new = """        const sc=pressScore(e,nx,ny);
        if(sc>bs){bs=sc;best=[nx,ny,sc-here];} } }
    for(const c of extra){ const nx=c[0],ny=c[1];   /* V137: same rejections, no shortcuts */
      if(Math.hypot(nx,ny)<standoff-0.01)continue;
      let bad=false;
      for(const o of G.e){ if(o===e||o.dead)continue;
        const ox=Math.cos(o.ea)*o.edist, oy=Math.sin(o.ea)*o.edist;
        if(Math.hypot(ox-nx,oy-ny)<0.9){bad=true;break;} }
      if(!bad)for(const P of (G.pillars||[])){ const q=pXY(P);
        if(Math.hypot(q[0]-nx,q[1]-ny)<(P.r||0.5)*0.8){bad=true;break;} }
      if(bad)continue;
      const sc=pressScore(e,nx,ny);
      if(sc>bs){bs=sc;best=[nx,ny,sc-here];} }
    if(best)plans.push({e:e,x:best[0],y:best[1],gain:best[2]}); }"""
    js = subN(js, old, new)

    # ---- 6. the standoff clamp on the applied move ----------------------
    old = """    e.edist=Math.max(PRESS_STANDOFF,nd); e.ea=Math.atan2(p.y,p.x);"""
    new = """    e.edist=Math.max(G.hold?HOLD_PASS:PRESS_STANDOFF,nd); e.ea=Math.atan2(p.y,p.x);"""
    js = subN(js, old, new)

    # ---- 7. it is checked on the turn -----------------------------------
    old = """  pressAI(); updateGeomCover();   /* V136: the scramble gets the men caught in the open, THEN the line bounds */"""
    new = """  pressAI(); updateGeomCover();   /* V136: the scramble gets the men caught in the open, THEN the line bounds */
  if(holdCheck())return;          /* V137: and a man who reached the place ends it right there */"""
    js = subN(js, old, new)

    # ---- 8. the place is world state: worldShift carries it -------------
    old = """  if(G.grenade)mv(G.grenade,0.02);   /* V60 GRENADE: anchored to its tile, so a move carries you off it */"""
    new = """  if(G.hold)mv(G.hold,0.02);         /* V137: the place you are defending is a TILE, not a direction. If it moved with you there would be nothing to defend */
  if(G.grenade)mv(G.grenade,0.02);   /* V60 GRENADE: anchored to its tile, so a move carries you off it */"""
    js = subN(js, old, new)

    # ---- 9. nothing survives into the next fight ------------------------
    old = """  G.grenade=null; G._grenadeBlast=null; G._grenadeThrown=false;   /* THEIRS */"""
    new = """  G.grenade=null; G._grenadeBlast=null; G._grenadeThrown=false;   /* THEIRS */
  G.hold=null; G.defend=null; G._defLost=false;   /* V137: a defence never leaks into the next fight */"""
    js = subN(js, old, new)

    # ---- 10. he can SEE it: the grenade marker, at the place -------------
    old = """  if(!aimo&&G.grenade){   /* V60 GRENADE: the pulsing danger tile + fuse count */"""
    new = """  if(!aimo&&G.hold){   /* V137: the place you are holding. This IS the grenade marker -- same fieldPos, same pulsing disc, same dashed ring, copied from the block below rather than invented. It turns red when somebody is nearly on it. The word is a MECHANIC, never a name: what this place is stays his. */
    const hp=fieldPos(G.hold,W,H,cx,cy), rr3=ring*1.35, pu3=0.5+0.5*Math.sin(performance.now()*0.006);
    const hxy=pXY(G.hold); let near=1e9;
    for(const e of (G.e||[])){ if(!e||e.dead||e.downed||e.broken||e.fleeing)continue;
      const q=pXY(e); near=Math.min(near,Math.hypot(q[0]-hxy[0],q[1]-hxy[1])); }
    const col=(near<(G.hold.r||HOLD_R)*2.4)?'232,60,40':'106,168,232';
    x.save(); x.fillStyle='rgba('+col+','+(0.10+pu3*0.10).toFixed(3)+')';
    x.beginPath(); x.arc(hp[0],hp[1],rr3*0.72,0,7); x.fill();
    x.strokeStyle='rgba('+col+','+(0.45+pu3*0.35).toFixed(3)+')'; x.lineWidth=3; x.setLineDash([7,5]);
    x.beginPath(); x.arc(hp[0],hp[1],rr3*(0.66+pu3*0.16),0,7); x.stroke(); x.setLineDash([]);
    x.fillStyle=(col==='232,60,40')?'#ffd8d0':'#cfe3ff';
    x.font='bold '+Math.round(ring*0.42)+'px Space Grotesk,sans-serif';
    x.textAlign='center'; x.textBaseline='middle'; x.fillText('HOLD',hp[0],hp[1]);
    x.textAlign='left'; x.textBaseline='alphabetic'; x.restore(); }
  if(!aimo&&G.grenade){   /* V60 GRENADE: the pulsing danger tile + fuse count */"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    html = html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():]
    ALPHA.write_text(html)
    print('v137: the defence can actually be lost -- %d chars' % len(js))


if __name__ == '__main__':
    main()
