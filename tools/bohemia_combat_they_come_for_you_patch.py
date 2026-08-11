#!/usr/bin/env python3
"""V136 THEY COME FOR YOU: STANDING STILL STOPS BEING THE RIGHT ANSWER.

Paolo 8/8: "right now kinda just feels like I could stand still and kill
everybody right now it's kind of weird"
Paolo 8/11: "IF IT MAKES THE GAME FUNNER AND REALISTIC DO IT"

--------------------------------------------------------------------------
HE IS RIGHT, AND IT IS ONE LINE OF CODE
--------------------------------------------------------------------------
coverSeekAI is the ONLY thing that moves a gun in this game, and it opens with:

    if(e.gcov)continue;

So every shooter on the board runs to the nearest rock exactly once and then
NEVER MOVES AGAIN for the rest of the fight. Not toward you, not around your
cover, not anywhere. The measurement from 8/8 said the same thing from the
other side: over 220 arenas and 8 guns, the tile you spawn on is worth 2.51
guns of cover, the best neighbouring tile is worth 3.41, and 55.8% of the time
stepping does nothing at all. Of course standing still wins. Nothing on the
board has ever had a reason to make you leave.

*** AND THE GAME ALREADY KNEW. *** The 7/19 melee turn advances blades toward
you every turn. Only the guns were nailed down.

--------------------------------------------------------------------------
BOTH KEYS TURN, SO IT DID NOT NEED A QUESTION
--------------------------------------------------------------------------
FUNNER: your tile decays. The rock that covered you last turn covers you from
  one fewer man this turn, because somebody walked around it. Position becomes
  a thing you have to keep re-earning instead of a thing you solve once.
REALISTIC: nobody in an actual gunfight stands at forty metres behind the same
  rock for six minutes. They bound. They flank. They close, because being
  closer is the single biggest thing you can do to hit somebody, and the file
  already agrees: distAccuracy runs .97 at point blank and .37 far out.

--------------------------------------------------------------------------
WHAT THEY DO NOW, IN ORDER OF WHAT A PERSON WOULD ACTUALLY DO
--------------------------------------------------------------------------
Each shooter scores every tile he could reach this turn and takes the best one,
against staying put. Three things are worth moving for:

  1. AN ANGLE (worth the most, by a mile). A shooter you are covered from
     contributes ZERO -- his hit chance is not reduced, it is deleted. Walking
     eight feet to where the stone is not in the way is the most valuable thing
     he can do with a turn, and it is the exact thing that makes your tile go
     stale while you stand on it.
  2. THE RANGE. Closing is worth precisely what the game's own range table says
     it is worth: the score uses distT, the same function the volley uses, so
     nobody had to invent a second opinion about distance.
  3. STONE AT THE OTHER END. A move that ends behind cover beats the same move
     ending in the open, so they go rock to rock instead of jogging across the
     lot in the open like idiots.

FIRE AND MOVEMENT, NOT A CAVALRY CHARGE. At most half the guns bound in any one
turn (PRESS_FRAC) and the ones with the most to gain go first. The rest hold
their angle and shoot. That is how it actually works, and it also means the
board never slides all at once, which is the difference between pressure and
noise.

THEY ARE STILL SHOOTERS, NOT BLADES. PRESS_STANDOFF stops them at a shooter's
distance. Nobody walks into your lap; that is what melee is for, and the shove
already answers anyone who gets there.

THEY DO NOT GET TWO TURNS. coverSeekAI still runs first for a man caught in the
open, and anyone it moved is stamped for the turn so the press cannot move him
again. One man, one move.

--------------------------------------------------------------------------
IT DOES NOT STEAL THE DAMAGE LINE
--------------------------------------------------------------------------
The volley's readout ("RETURN FIRE, 3 of 5 hit you") is the most important
thing on screen and a movement notice must never overwrite it. So setRead now
remembers its own colour, and the press APPENDS to the line that is already
there in that line's own colour instead of replacing it.

REUSE CHECK: cooks NO graphic pixels. It reuses distT, myCoverAgainst, pXY,
segNear, pinned and setRead -- every one of which already exists -- and adds no
new render path, no new sprite and no new art. The candidate scorer deliberately
calls the game's OWN distance and cover functions rather than restating them, so
a shooter can never disagree with the volley about who is covered from whom. No
bank is opened because no art is authored.

TASTE CHECK: authors no art. The taste rule is his, from 8/8: a fight you can
win standing still is not a fight, it is a shooting gallery. The restraint here
is PRESS_FRAC and PRESS_STANDOFF -- the failure mode of this feature is eight
men sprinting at you every turn, which reads as a mob and not as pressure.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region. It changes where a body stands, never how a
  body is built.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V136 THEY COME FOR YOU'
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
        print('v136 already in; nothing to do')
        return

    # ---- 1. setRead remembers its colour, so the press can append in it -----
    # NOTE the comment goes ABOVE the line, never inside it: the v133 gate holds
    # setRead to calling _speak IMMEDIATELY after stamping lastRead, and that
    # invariant is the whole reason the fight can be heard at all. A gate must
    # never be worked around; the comment moves instead.
    old = """function setRead(t,s,col){ G.lastRead={t:t,s:s||'',at:Date.now()};"""
    new = """/* V136: setRead remembers its own COLOUR so a movement notice can append to the
   damage line instead of overwriting it. What hit you always matters more than
   who walked, so the press grows the sub-line and leaves the title alone. */
function setRead(t,s,col){ G.lastRead={t:t,s:s||'',at:Date.now(),c:col||''};"""
    js = subN(js, old, new)

    # ---- 2. a man the scramble already moved cannot be moved again ----------
    old = """    e.edist=Math.max(0.8,Math.hypot(nx,ny)); e.ea=Math.atan2(ny,nx); e._movedAt=performance.now();
  }
}"""
    new = """    e.edist=Math.max(0.8,Math.hypot(nx,ny)); e.ea=Math.atan2(ny,nx); e._movedAt=performance.now();
    e._movedTurn=G.mTurn||0;   /* V136: one man, one move -- the press cannot move him again this turn */
  }
}
/* ===== V136 THEY COME FOR YOU ====================================
   Paolo 8/8: "right now kinda just feels like I could stand still and kill
   everybody right now it's kind of weird". He is right, and it is the one line
   at the top of coverSeekAI: `if(e.gcov)continue;`. Every gun in this game runs
   to the nearest rock ONCE and then never moves again for the rest of the
   fight. Nothing has ever had a reason to make you leave your tile, so of
   course standing on it is correct. (The 7/19 melee turn already advances
   blades every turn -- only the guns were nailed down.)
   Both keys turn on the 8/11 rule, so this needed no question. FUNNER: your
   tile decays, because somebody walks around the rock that was covering you.
   REALISTIC: nobody holds one rock at forty metres for six minutes; they bound,
   they flank, they close, and closing is the biggest thing you can do to hit
   a man -- which this file already agrees with (distAccuracy .97 near, .37 far).
   FIRE AND MOVEMENT, NOT A CHARGE: at most half the guns bound per turn, the
   ones with the most to gain first, the rest hold their angle and shoot. */
const PRESS_STEP=1.8;        /* a bounding advance, shorter than a panic scramble [DIAL] */
const PRESS_STANDOFF=3.2;    /* they are shooters, not blades: nobody walks into your lap [DIAL] */
const PRESS_FRAC=0.5;        /* how much of the line moves while the rest cover it [DIAL] */
const PRESS_WORTH=0.18;      /* a move has to actually be worth something [DIAL] */
/* is there stone between the player and THIS point -- the same geometry the
   volley uses, asked about a tile nobody is standing on yet */
function coverAtXY(x,y,lvl){ const d=Math.hypot(x,y)||0.01; return myCoverAgainst(Math.atan2(y,x),d,lvl); }
/* would HE have cover standing there: one pillar that both blocks the line and
   sits near him, exactly as realCoverPillar asks it of a body */
function pillarAtXY(x,y,lvl){ if((lvl|0)!==myLvl())return false;
  return (G.pillars||[]).some(P=>{ if(P.hard===false)return false; const q=pXY(P);
    return segNear(0,0,x,y,q[0],q[1],P.r*0.85) && Math.hypot(q[0]-x,q[1]-y)<1.8; }); }
/* what a tile is worth to him, in the game's own units */
function pressScore(e,x,y){
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
  return s; }
function pressAI(){ G._pressN=0; if(G.over)return;
  const turn=G.mTurn||0;
  const pool=(G.e||[]).filter(e=>e&&!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&!e.melee
    &&!pinned(e)&&(e.stun||0)<=0&&(e.prone||0)<=0&&(e.stagger||0)<=0
    &&(e.lvl|0)===myLvl()&&e._movedTurn!==turn);
  if(!pool.length)return;
  /* score every tile a man could reach this turn, against staying put */
  const plans=[];
  for(const e of pool){
    const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist;
    const here=pressScore(e,ex,ey);
    let best=null,bs=here+PRESS_WORTH;
    for(const off of [-0.9,-0.62,-0.38,-0.18,0,0.18,0.38,0.62,0.9]){
      for(const gain of [0,PRESS_STEP*0.5,PRESS_STEP]){
        const r=Math.max(PRESS_STANDOFF,e.edist-gain), a=e.ea+off;
        const nx=Math.cos(a)*r, ny=Math.sin(a)*r;
        if(Math.hypot(nx-ex,ny-ey)>PRESS_STEP*1.02)continue;   /* further than a turn's walk */
        if(Math.hypot(nx,ny)<PRESS_STANDOFF-0.01)continue;     /* he is a shooter, he keeps his distance */
        let bad=false;
        for(const o of G.e){ if(o===e||o.dead)continue;        /* one body per spot */
          const ox=Math.cos(o.ea)*o.edist, oy=Math.sin(o.ea)*o.edist;
          if(Math.hypot(ox-nx,oy-ny)<0.9){bad=true;break;} }
        if(!bad)for(const P of (G.pillars||[])){ const q=pXY(P);
          if(Math.hypot(q[0]-nx,q[1]-ny)<(P.r||0.5)*0.8){bad=true;break;} }   /* nobody stands inside the rock */
        if(bad)continue;
        const sc=pressScore(e,nx,ny);
        if(sc>bs){bs=sc;best=[nx,ny,sc-here];} } }
    if(best)plans.push({e:e,x:best[0],y:best[1],gain:best[2]}); }
  if(!plans.length)return;
  /* FIRE AND MOVEMENT: half the line bounds, the men with the most to gain go
     first, and the rest hold their angle and shoot. A board that slides all at
     once is noise, not pressure. */
  plans.sort((a,b)=>b.gain-a.gain);
  const budget=Math.max(1,Math.ceil(pool.length*PRESS_FRAC));
  let flanked=0,closed=0;
  for(const p of plans.slice(0,budget)){ const e=p.e;
    const wasBlocked=coverAtXY(Math.cos(e.ea)*e.edist,Math.sin(e.ea)*e.edist,e.lvl);
    const nd=Math.hypot(p.x,p.y);
    if(wasBlocked&&!coverAtXY(p.x,p.y,e.lvl))flanked++; else if(nd<e.edist-0.2)closed++;
    e.edist=Math.max(PRESS_STANDOFF,nd); e.ea=Math.atan2(p.y,p.x);
    e._movedAt=performance.now(); e._movedTurn=turn; e.gcov=pillarAtXY(p.x,p.y,e.lvl)?1:0;
    G._pressN++; }
  if(!G._pressN)return;
  /* say it WITHOUT stealing the damage line: same title, same colour, the
     sub-line grows. What hit you always matters more than who walked. */
  const L=G.lastRead||{};
  const word=flanked?(flanked+' came around your cover'):(closed+' closed on you');
  setRead(L.t||'THEY MOVE',(L.s?L.s+'  \\u00b7  ':'')+word,L.c||'#e8a04a'); }"""
    js = subN(js, old, new)

    # ---- 3. it runs on the turn, after the scramble --------------------------
    old = """function tickTurnEnd(){ meleeTurnRun(); updateGeomCover(); coverSeekAI(); updateGeomCover();"""
    new = """function tickTurnEnd(){ meleeTurnRun(); updateGeomCover(); coverSeekAI(); updateGeomCover();
  pressAI(); updateGeomCover();   /* V136: the scramble gets the men caught in the open, THEN the line bounds */"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    html = html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():]
    ALPHA.write_text(html)
    print('v136: the guns move -- %d chars' % len(js))


if __name__ == '__main__':
    main()
