#!/usr/bin/env python3
"""
V197 TWO OF YOU. THE FIGHT HAS ONLY EVER HAD ONE PERSON ON YOUR SIDE.

  PAOLO: "OKAY NOW WHAT ABOUT 2 V 8 WHEN I HAVE A COMPANION. THIS GAME WILL ONLY
  WORK WHEN MULTIPLE PEOPLE CAN FIGHT AT THE SAME TIME! DO BIG BRAIN RESEARCH IF
  YOU NEED... I IMAGINE OUR COMBAT IS WAY MORE AUTOMATED YOU REALLY ONLY NEED TO
  CONTROL YOURSELF FOR REAL!!!"

-------------------------------------------------------------------------
FIRST, THE MEASUREMENT HE IS REACTING TO, AND IT IS NOT CLOSE
-------------------------------------------------------------------------
Same 30 boards, same policy, one man, TRIPLE the shipping health (300), fifty
turns to finish. Rooms cleared, by how many men are in the room:

    3 foes   78.3%          6 foes    5.0%
    4 foes   48.3%          7 foes    0.0%
    5 foes   30.0%          8 foes    0.0%

*** ONE MAN CLEARS ZERO ROOMS OF SEVEN OR EIGHT, OUT OF SIXTY TRIES EACH. *** And
he does not die in most of them either -- he is pinned. The fight does not end.
ENC_SIZES ships [3,4,5,6] for exactly this reason, with RF4's own notes reserving
7-8 for BOSS FIGHTS. HIS INSTINCT IS THE MEASUREMENT: eight is not a fight for one
person, and the only thing that makes it one is a second body.

-------------------------------------------------------------------------
THE RESEARCH, AND IT LANDED ON THE ONE MECHANIC THAT MATTERS
-------------------------------------------------------------------------
BATTLE BROTHERS (the game he named; LAB studied its CAMPAIGN half the same day,
so this is the combat half and does not repeat it): there are NO separate player
and AI phases -- every body, both sides, is sorted into ONE order and acts in it.
Its ally AI is set ONCE, not steered: "a unit will act like a ranged character if
he has a ranged weapon equipped... this decision is made at the time you enable
the AI." And its enemy targeting is the load-bearing part: melee goes for the
weakest body, while RANGED FIRE DISPERSES toward the softer and nearer target
rather than stacking on one man. The community answer to being shot at is "keep
weaker characters behind somebody else" -- WHICH IS ONLY A SENTENCE THAT MEANS
ANYTHING IF THERE IS SOMEBODY ELSE.

FF12'S GAMBITS / DRAGON AGE'S TACTICS: an ordered if-then ladder the ally runs by
himself, and the reason it is beloved is exactly his sentence -- it takes the
tedium out and lets you play your own character. But those are LISTS the player
edits, and he asked for the opposite. So the ladder here is FIXED and the whole
instrument is ONE WORD (8/12: where does he change this himself).

-------------------------------------------------------------------------
AND THE MACHINERY FOR AN AUTOMATED BODY ALREADY EXISTED. IT HAD ONLY EVER
BEEN GIVEN TO THE ENEMY.
-------------------------------------------------------------------------
tickTurnEnd already runs meleeTurnRun, medicTurn, breachTurn, coverSeekAI and
pressAI -- five automated actors making their own decisions every turn, and every
single one of them is on the other side. THE MEDIC ALREADY WALKS TO A BODY AND
PICKS IT UP. Nothing on your side has ever taken a turn.

Same for the geometry: V193's gunsOnTile is the fight's own exposure question
ASKED FROM A TILE THAT IS NOT WHERE YOU STAND, gated at 30 of 30 fights agreeing
with posExposed. A companion stands on a tile that is not where you stand. That
is the whole hard part of a second body, already built, already gated, and never
once used for anybody but the floor paint.

SO THIS SHIPS ONE GEOMETRY, NOT TWO (ENGINE SYNC LAW): gunsOnTile is split into
hitsTile(e,dx,dy) -- can THIS man shoot a body standing THERE -- and a count over
it. The companion asks the same function the floor paint asks. A second copy is
how one variable quietly becomes five that disagree, and this file has caught that
twice this week already.

-------------------------------------------------------------------------
THE ONE THING THAT MAKES IT A FIGHT AND NOT A TURRET: THE FIRE SPLITS
-------------------------------------------------------------------------
A companion who shoots but is never shot at is a damage buff wearing a hat. So
each turn every shooter decides WHICH OF YOU he is on, and the rule is Battle
Brothers' measured one, grounded:

  * if he cannot reach the companion at all, he is on you (unchanged)
  * if your cover stops him and the companion's does not, HE TAKES THE COMPANION
  * if both of you are open, the NEARER body wins, and when it is close his own
    index breaks the tie -- so a squad DISPERSES across two men instead of
    stacking on one, which is the finding, not a fudge

*** AND THE COST IS REAL AND IS NOT HIDDEN: A COMPANION DRAWS FIRE THAT WOULD
NEVER HAVE REACHED YOU. *** A man out of reach of your tile but in reach of his is
a man who is now shooting somebody on your side. That is the trade, it is
honest, and it is measured rather than asserted.

THE SPLIT IS ON THE VOLLEY POOL AND NOT ON THE POSITIONAL READ, deliberately.
exposedToMe is "who is shooting at you"; posExposed is its own comment's words,
"who COULD line you up", and a man who could line you up but chose the other
target still could. Folding the split into posExposed would have made V193's
agreement arm a lie the moment a second body existed -- gunsOnTile(0,0) is a
GEOMETRY question and posExposed has to stay one.

-------------------------------------------------------------------------
HIS LADDER (fixed, in order, once a turn) AND WHAT HE SAYS
-------------------------------------------------------------------------
  1. a blade inside reach of YOU            -> shoot it       "GOT THE BLADE"
  2. the spotter, while he has the room     -> shoot him      "ON THE SPOTTER"
  3. anything he can reach                  -> the one nearest dead first, so
                                               bodies actually fall
  4. nothing in reach, or too far from you  -> move one tile, onto the ground
                                               with the least fire on it

He answers the blade FIRST because that is the thing the player provably cannot:
V196 measured that crossing the room costs you the fight unless you spend a pip,
and a man with a knife on you is the same problem with no pip in it.

NO DAMAGE BEFORE THE DIAL: the companion authors NO new damage number, no new
accuracy number and no new range. He is a person from the valley with a pistol,
so he is ARCH.human -- the same 60 hp, the same acc, the same [14,26], the same
distAccuracy model every other body in this fight uses, read through a shim with
his position in it. applyDamage is untouched. Not one existing number moves.

WHO HE IS STAYS PAOLO'S (MECHANISM-MINE / CONTENTS-PAOLO'S). The name ships as a
real attempt tagged draft:true, per the 8/11 words rule, so there is somebody to
meet rather than a blank field.

REUSE CHECK: cooks no graphic pixels and opens no bank. He is drawn by
drawEnemySprite -- the same body art every human in this fight uses (SAME-SIZE
HUMAN LAW) -- with a ring under him and his name over him, both the existing
label draw. His geometry is gunsOnTile's. His accuracy is distAccuracy. His
damage roll is the same two lines the volley uses.

TASTE CHECK: one toggle in DEMO SETTINGS, one word for his stance, no new HUD
row, and he is silent unless his call changes.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V197 TWO OF YOU'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:200]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v197: already applied')
        return
    if 'V196 THE ANSWER IS YOUR LEGS' not in d:
        sys.exit('v197 needs v196 -- run the legs patch first')

    # ---- 1. ONE GEOMETRY, TWO CALLERS (ENGINE SYNC) ----
    # gunsOnTile becomes a COUNT over a per-man predicate, so the companion asks
    # the exact question the floor paint asks. Not one byte of the geometry moves.
    d = sub(d,
        """  for(const e of (G.e||[])){
    if(!e||e.dead||e.downed||e.broken||e.fleeing||e.melee)continue;
    try{ if(pinned(e))continue; }catch(_x){}
    if((e.stun||0)>0)continue;
    const ex=Math.cos(e.ea)*e.edist-dx, ey=Math.sin(e.ea)*e.edist-dy;
    const dd=Math.hypot(ex,ey);
    if(dd>maxRange(foeRange(e)))continue;          /* out of HIS reach from there */
    const _called=_spotHere&&!(e.E&&e.E.spotter);   /* V195 */""",
        """  for(const e of (G.e||[])){
    if(hitsTile(e,dx,dy,_spotHere))n++; }
  return n; }
/* ===== V197 ONE GEOMETRY, TWO CALLERS (ENGINE SYNC LAW) ==============
   V193's whole claim is that this is THE FIGHT'S OWN EXPOSURE QUESTION ASKED
   FROM A TILE THAT IS NOT WHERE YOU STAND, gated at 30 of 30 fights agreeing
   with posExposed. A COMPANION STANDS ON A TILE THAT IS NOT WHERE YOU STAND --
   so the hard part of putting a second body in this fight was already built,
   already gated, and had only ever been used to tint the floor.
   The body below is byte-for-byte what was inside gunsOnTile's loop. It is a
   FUNCTION now instead of a loop body, so the count and the companion cannot
   ever drift apart. Writing a second copy for the companion is exactly how one
   variable becomes five that disagree, and this lane has caught that twice in a
   week. */
function hitsTile(e,dx,dy,_spotHere){
    if(!e||e.dead||e.downed||e.broken||e.fleeing||e.melee)return false;
    try{ if(pinned(e))return false; }catch(_x){}
    if((e.stun||0)>0)return false;
    const ex=Math.cos(e.ea)*e.edist-dx, ey=Math.sin(e.ea)*e.edist-dy;
    const dd=Math.hypot(ex,ey);
    if(dd>maxRange(foeRange(e)))return false;      /* out of HIS reach from there */
    const _called=_spotHere&&!(e.E&&e.E.spotter);   /* V195 */""",
        what='gunsOnTile becomes a count over hitsTile')

    d = sub(d,
        """    if((e.lvl|0)!==myLvl()){ n++; continue; }
    const aa=Math.atan2(ey,ex);""",
        """    if((e.lvl|0)!==myLvl())return true;
    const aa=Math.atan2(ey,ex);""",
        what='hitsTile floor branch')

    d = sub(d,
        """    if(_called){ n++; continue; }
    let cov=false;""",
        """    if(_called)return true;
    let cov=false;""",
        what='hitsTile called branch')

    d = sub(d,
        """      if(dA<Math.PI/2 && Math.sin(dA)*pd<P.r*0.9){ cov=true; break; } }
    if(!cov)n++; }
  return n; }""",
        """      if(dA<Math.PI/2 && Math.sin(dA)*pd<P.r*0.9){ cov=true; break; } }
    return !cov; }""",
        what='hitsTile cover branch')

    # the spotter half of gunsOnTile becomes its own ask, so the companion's
    # tile can be asked the same question.
    d = sub(d,
        """function gunsOnTile(dx,dy){
  let n=0;""",
        """function gunsOnTile(dx,dy){
  let n=0;   /* V197: the loop body below now lives in hitsTile -- ONE geometry */""",
        what='gunsOnTile header note')

    # ---- 2. THE SECOND BODY ----
    d = sub(d,
        "function readGround(){",
        """/* ===== V197 TWO OF YOU ============================================
   Paolo: "THIS GAME WILL ONLY WORK WHEN MULTIPLE PEOPLE CAN FIGHT AT THE SAME
   TIME!... I IMAGINE OUR COMBAT IS WAY MORE AUTOMATED YOU REALLY ONLY NEED TO
   CONTROL YOURSELF FOR REAL!!!"
   MEASURED FIRST, and it is not close. Same 30 boards, same policy, one man at
   TRIPLE the shipping health, fifty turns to finish -- rooms cleared by roster:
     3 foes 78.3%   4 foes 48.3%   5 foes 30.0%   6 foes 5.0%   7 foes 0.0%
     8 foes 0.0%
   ZERO OF SIXTY, TWICE. And he mostly does not die in those, he is PINNED: the
   fight never ends. ENC_SIZES ships [3,4,5,6] for that reason and RF4's own
   notes reserve 7-8 for BOSS FIGHTS. His instinct IS the measurement.
   HE IS A PERSON, NOT A STAT: ARCH.human, the same 60 hp and the same [14,26]
   every goon in the valley carries, so NO DAMAGE BEFORE THE DIAL is untouched
   and no new number is authored anywhere in this feature. */
const ALLY_ON_DEFAULT=true;
const ALLY_LEASH=6;        /* [DIAL] how far he will get from you before he comes back */
const ALLY_STEP=1;         /* [DIAL] tiles a turn -- the same one step you get */
const ALLY_SPAWN=2;        /* [DIAL] tiles away when the bell rings */
const ALLY_DOWN_TURNS=99;  /* [DIAL] he stays down; picking him up is not built yet and is not pretended */
/* WORDS ARE AN ATTEMPT, DECISIONS WAIT (8/11). Who actually walks with you is
   Paolo's -- this is a real name so there is somebody to meet, not a blank. */
const ALLY_NAME='ROSA';    /* draft:true */
const ALLY_DRAFT=true;
function allyOn(){ return G.allyOff?false:ALLY_ON_DEFAULT; }
function allyUp(){ const A=G.ally; return !!(A&&!A.dead&&!A.downed); }
function allyXY(){ const A=G.ally; if(!A)return [0,0];
  return [Math.cos(A.ea)*A.edist, Math.sin(A.ea)*A.edist]; }
function allyMake(){
  if(!allyOn()){ G.ally=null; return null; }
  /* he starts BESIDE you, on your floor, on a real cell -- OCCUPANCY LAW, and
     snapBody is the same one every other body in this fight is held to. */
  const a=Math.PI*0.75;
  const A={ally:true,i:-1,arch:'human',E:ARCH.human,n:ALLY_NAME,draft:ALLY_DRAFT,
    hp:ARCH.human.hp,max:ARCH.human.hp,hpMax:ARCH.human.hp,armor:0,melee:false,
    dead:false,downed:false,broken:false,fleeing:false,inCover:false,
    stun:0,stunCooldown:0,prone:0,windup:false,acq:99,phase:0,cad:1,
    lvl:myLvl()|0,ea:a,edist:ALLY_SPAWN,say:'',sayT:-99};
  snapBody(A); G.ally=A; G._alKey=null; G._alSet={}; return A; }
/* DOES A SPOTTER HAVE A LINE ON THIS TILE -- the same ask gunsOnTile makes,
   lifted out so the companion's tile can be asked it too. */
function spotsTile(dx,dy){
  if((G.smoke||[]).length)return false;
  for(const s of (G.e||[])){
    if(!s||!s.E||!s.E.spotter)continue;
    if(s.dead||s.downed||s.broken||s.fleeing)continue;
    if((s.stun||0)>0||(s.prone||0)>0)continue;
    if((s.lvl|0)!==myLvl())continue;
    const sx=Math.cos(s.ea)*s.edist-dx, sy=Math.sin(s.ea)*s.edist-dy;
    const sd=Math.hypot(sx,sy);
    if(sd>SIGHT_TILES)continue;
    const sa=Math.atan2(sy,sx);
    let blocked=false;
    for(const P of (G.pillars||[])){
      const px=Math.cos(P.ea)*P.edist-dx, py=Math.sin(P.ea)*P.edist-dy;
      const pd=Math.hypot(px,py);
      if(pd>sd||pd<0.8)continue;
      const pa=Math.atan2(py,px);
      const dA=Math.abs(((sa-pa+Math.PI*3)%(Math.PI*2))-Math.PI);
      if(dA<Math.PI/2 && Math.sin(dA)*pd<P.r*0.9){ blocked=true; break; } }
    if(!blocked)return true; }
  return false; }
/* ===== WHICH OF THE TWO OF YOU IS THIS MAN SHOOTING ==================
   BATTLE BROTHERS, measured by its own players: melee goes for the weakest
   body, and RANGED FIRE DISPERSES toward the softer, nearer target rather than
   concentrating -- "if you start weaker characters in the backline and keep
   them behind somebody else it minimises the problem", a sentence that only
   means anything if there IS somebody else.
   PURE AND CACHED, exactly like V195's spotterCall, because this is asked by
   the volley AND by every readout that counts guns, and a side effect here
   would fire the same shot twice. */
function allyKey(){ const A=G.ally;
  return (G.mTurn|0)+':'+(A?(Math.round(A.ea*100)+':'+Math.round(A.edist*100)+':'+(A.dead?1:0)+(A.downed?1:0)):'-')+':'
    +Math.round((G.worldOff?G.worldOff.x:0)*100)+':'+Math.round((G.worldOff?G.worldOff.y:0)*100)+':'+myLvl(); }
function allyPick(){
  const out={}; if(!allyUp())return out;
  const ax=allyXY()[0], ay=allyXY()[1];
  const spA=spotsTile(ax,ay), spM=spotsTile(0,0);
  for(const e of (G.e||[])){
    if(!e||e.melee)continue;
    if(!hitsTile(e,ax,ay,spA))continue;      /* he cannot reach the companion at all */
    if(!hitsTile(e,0,0,spM)||!seesMe(e)){ out[e.i]=1; continue; }
    /* *** AND THIS IS THE HONEST COST, NOT A HIDDEN ONE: the branch above is a
       man who could NOT have reached you and is now shooting somebody on your
       side. A companion draws fire that would never have come. *** */
    const dMe=e.edist;
    const dA=Math.hypot(Math.cos(e.ea)*e.edist-ax, Math.sin(e.ea)*e.edist-ay);
    if(dA<dMe-0.5){ out[e.i]=1; continue; }
    if(dMe<dA-0.5)continue;
    if((e.i&1)===1)out[e.i]=1;   /* close to level: the squad SPLITS, it does not stack */
  }
  return out; }
function allyTakes(e){
  if(!e||e.melee||!allyUp())return false;
  const k=allyKey();
  if(G._alKey!==k){ G._alKey=k; G._alSet=allyPick(); }
  return !!G._alSet[e.i]; }
function allySplit(pool){ if(!allyUp())return pool;
  return pool.filter(e=>!allyTakes(e)); }
/* A SHOOTER SEEN FROM SOMEWHERE ELSE. Every accuracy and reach function in this
   fight reads the shooter's OWN fields, so moving the origin is a copy with a
   new position in it -- one model, not two. */
function asSeenFrom(e,dx,dy){
  const px=Math.cos(e.ea)*e.edist-dx, py=Math.sin(e.ea)*e.edist-dy;
  const o={}; for(const k in e)o[k]=e[k];
  o.edist=Math.hypot(px,py); o.ea=Math.atan2(py,px); return o; }
/* WHAT LANDS ON HIM. The same two lines the player's volley uses, and the same
   distAccuracy -- read through his position instead of yours. */
function allyIncoming(){
  if(G.over||!allyUp())return 0;
  const A=G.ally, ax=allyXY()[0], ay=allyXY()[1];
  let dmg=0,hits=0;
  for(const e of (G.e||[])){
    if(!allyTakes(e))continue;
    if(!acquired(e))continue;
    const s=asSeenFrom(e,ax,ay);
    const acc=distAccuracy(s)*(firing(e)?1:0.6)*(e.hp<=e.max*0.4?0.8:1);
    if(Math.random()<acc){ hits++;
      const a=e.E.dmg; dmg+=a[0]+Math.floor(Math.random()*(a[1]-a[0]+1)); } }
  if(dmg>0){ A.hp=Math.max(0,A.hp-Math.max(0,dmg-(A.armor||0)));
    A._hitAt=performance.now();
    if(A.hp<=0){ A.downed=true; A.dead=false; A._fellAt=performance.now();
      G._alKey=null;
      try{ setRead(ALLY_NAME+' IS DOWN','every gun she was holding is back on you','#e8593a'); }catch(_e){}
    } }
  return dmg; }
/* ===== HIS LADDER. FIXED, IN ORDER, ONCE A TURN =======================
   FF12's gambits and Dragon Age's tactics are ordered if-then lists and they
   are beloved for the reason he gave -- they take the tedium out and let you
   play your own character. But those are lists the PLAYER edits, and he asked
   for the opposite: "you really only need to control yourself for real".
   So the ladder is fixed and the instrument is one word.
   HE ANSWERS THE BLADE FIRST because that is the thing the player provably
   cannot: V196 measured that crossing a room costs you the fight unless you
   spend a stamina pip, and a knife already on you is that problem with no pip
   left in it. */
function allySay(t){ const A=G.ally; if(!A)return;
  if(A.say===t)return; A.say=t; A.sayT=performance.now();
  try{ setRead(ALLY_NAME+': '+t,'she is fighting her own turn','#8fe89a'); }catch(_e){} }
function allyShoot(t){
  const A=G.ally; const s=asSeenFrom(A,Math.cos(t.ea)*t.edist,Math.sin(t.ea)*t.edist);
  const acc=distAccuracy(s);
  A._shotAt=performance.now(); A._shotEa=Math.atan2(Math.sin(t.ea)*t.edist-allyXY()[1],
    Math.cos(t.ea)*t.edist-allyXY()[0]);
  if(Math.random()>=acc)return false;
  const dm=ARCH.human.dmg;
  applyDamage(t,dm[0]+Math.floor(Math.random()*(dm[1]-dm[0]+1)));
  if(t.hp<=0&&!t.dead){ t.dead=true; try{ bodyFell(t); }catch(_e){} }
  return true; }
function allyCanReach(t){
  if(!t||t.dead||t.downed||t.broken||t.fleeing)return false;
  if((t.lvl|0)!==(G.ally.lvl|0))return false;
  const ax=allyXY()[0], ay=allyXY()[1];
  const d=Math.hypot(Math.cos(t.ea)*t.edist-ax, Math.sin(t.ea)*t.edist-ay);
  return d<=maxRange(wpnRange('pistol')); }
function allyTurn(){
  if(G.over||!allyOn())return;
  const A=G.ally; if(!A)return;
  if(A.dead||A.downed)return;
  A.lvl=myLvl()|0;   /* he is with you: the same floor, always */
  const live=(G.e||[]).filter(e=>e&&!e.dead&&!e.downed&&!e.broken&&!e.fleeing);
  if(!live.length){ allySay('CLEAR'); return; }
  const ax=allyXY()[0], ay=allyXY()[1];
  /* 1. A BLADE ON YOU. */
  const blade=live.filter(e=>e.melee&&e.edist<=(e.reach||2)+2.5&&allyCanReach(e))
    .sort((a,b)=>a.edist-b.edist)[0];
  if(blade){ allySay('GOT THE BLADE'); allyShoot(blade); return; }
  /* 2. THE MAN WHO TOOK YOUR COVER, while he is doing it. */
  let sp=null; try{ if(spotterCall())sp=spotterMan(); }catch(_e){}
  if(sp&&allyCanReach(sp)){ allySay('ON THE SPOTTER'); allyShoot(sp); return; }
  /* 3. ANYTHING HE CAN REACH -- the one nearest dead first, so bodies fall
     instead of four men all sitting at half. */
  const reach=live.filter(allyCanReach);
  if(reach.length){ const t=reach.sort((a,b)=>(a.hp/a.max)-(b.hp/b.max))[0];
    allySay('FIRING'); allyShoot(t); return; }
  /* 4. NOTHING IN REACH: one step, onto the ground with the least fire on it,
     scored with the SAME read the player's floor is painted from. */
  const near=live.reduce((a,e)=>(!a||e.edist<a.edist)?e:a,null);
  const tx=Math.cos(near.ea)*near.edist, ty=Math.sin(near.ea)*near.edist;
  const home=Math.hypot(ax,ay)>ALLY_LEASH;   /* he is a companion, not a scout */
  let best=null,bs=1e9;
  for(let sx=-ALLY_STEP;sx<=ALLY_STEP;sx++)for(let sy=-ALLY_STEP;sy<=ALLY_STEP;sy++){
    if(!sx&&!sy)continue;
    const nx=Math.round(ax)+sx, ny=Math.round(ay)+sy;
    if(!nx&&!ny)continue;                    /* OCCUPANCY LAW: your cell is yours */
    if((G.e||[]).some(e=>{ if(!e||e.dead)return false;
      const c=cellOf(e); return c[0]===nx&&c[1]===ny; }))continue;
    const goal=home?Math.hypot(nx,ny):Math.hypot(tx-nx,ty-ny);
    const sc=gunsOnTile(nx,ny)*10+goal;
    if(sc<bs){ bs=sc; best=[nx,ny]; } }
  if(best){ putCell(A,best[0],best[1]); snapBody(A);
    G._alKey=null;
    allySay(home?'COMING BACK':'MOVING UP'); } }
function readGround(){""",
        what='the second body')

    # ---- 3. THE FIRE SPLITS (the volley pool only) ----
    d = sub(d,
        "function exposedToMe(){ return calledIn(G.e.filter(",
        "function exposedToMe(){ return allySplit(calledIn(G.e.filter(",
        what='split the volley pool open')
    d = sub(d,
        "  e=>peeking(e)||firing(e)); }   /* V195 */",
        "  e=>peeking(e)||firing(e))); }   /* V195 */   /* V197: allySplit takes out the men who are on the COMPANION this turn. It wraps rather than folds because combat_lab holds this filter as exact text -- and because posExposed must stay a pure GEOMETRY question ('who COULD line you up', its own words) or V193's agreement arm becomes a lie the moment there are two of you */",
        what='close the split')

    # ---- 4. HE TAKES HIS TURN WITH EVERY OTHER AUTOMATED ACTOR ----
    # THE HEAD OF THIS FUNCTION IS HELD AS EXACT TEXT BY TWO CLAIMS IN
    # combat_lab (V180's wiring anchor and V136's ordering window), and the first
    # cut of this patch split the line and broke both. It is kept byte-identical
    # and she is appended after it -- the long note goes ABOVE the function,
    # where a comment cannot cost an anchor a character.
    d = sub(d,
        "function tickTurnEnd(){ meleeTurnRun(); medicTurn(); breachTurn(); openGroundTick();",
        """/* ===== V197: FIVE AUTOMATED ACTORS HAVE TAKEN A TURN ON THE LINE BELOW SINCE
   THIS FIGHT WAS BUILT, AND EVERY ONE OF THEM WAS ON THE OTHER SIDE. ==========
   meleeTurnRun, medicTurn, breachTurn, coverSeekAI, pressAI -- five bodies
   making their own decisions every turn, all five theirs, and THE MEDIC ALREADY
   WALKS TO A BODY AND PICKS IT UP. Nothing on your side had ever acted.
   allyTurn is her turn; allyIncoming is what lands on her for taking it. */
function tickTurnEnd(){ meleeTurnRun(); medicTurn(); breachTurn(); openGroundTick(); allyTurn(); allyIncoming();   /* V197 */""",
        what='he takes his turn')

    # ---- 5. HE MOVES WITH THE WORLD ----
    d = sub(d,
        "  if(G.hold)mv(G.hold,0.02);",
        "  if(G.ally&&!G.ally.dead)mv(G.ally);   /* V197: a second body keeps the bubble like any other */\n  if(G.ally)G._alKey=null;\n  if(G.hold)mv(G.hold,0.02);",
        what='he moves with the world')

    # ---- 6. HE IS BUILT WHEN THE BELL RINGS ----
    d = sub(d,
        "  G.hold=null; G.defend=null; G._defLost=false;   /* V137: a defence never leaks into the next fight */",
        "  G.hold=null; G.defend=null; G._defLost=false;   /* V137: a defence never leaks into the next fight */\n  try{ allyMake(); }catch(_e){ G.ally=null; }   /* V197: she is standing beside you when the bell rings, whole */",
        what='he is built at the bell')

    # ---- 7. HE IS ON THE FIELD ----
    d = sub(d,
        "  const _hopA=(G._demo&&G._demo.k==='A')?Math.pow(1-_bpmPhase,3)*5:0;   /* demo A: unmissable unison hop */",
        """  /* ===== V197 SHE IS ON THE FIELD, AND SHE READS AS YOURS ============
     COLOUR IS TERRITORY (8/26): a colour is a statement of who would defend
     you, and hers is the one colour on this board that is not an enemy's. She
     is drawn by drawEnemySprite -- the SAME body art every human in this fight
     uses, SAME-SIZE HUMAN LAW -- so what separates her is the ring under her
     feet, her name over her head and her health, never a different body. */
  /* *** AND THE ANCHORS ARE DERIVED FROM THE DRAW, NOT GUESSED. *** drawHuman
     blits the 112 art at ey-84*S with a side of 112*S, so a body's HEAD TOP is
     exactly 84*bodyScale() above its field position and its SOLES are exactly
     28*bodyScale() below it. Every eyeballed offset in this file has landed
     inside the torso, mine included -- see the V196 correction below. */
  if(G.ally&&allyOn()){ const A=G.ally; const _ap=epos(A);
    const _S=bodyScale(), _ar=Math.max(7,ring*0.34);
    const _top=_ap[1]-84*_S, _sole=_ap[1]+28*_S;
    x.save();
    x.strokeStyle=A.downed?'rgba(232,89,58,0.8)':'rgba(143,232,154,0.9)';
    x.lineWidth=2; x.beginPath();
    x.ellipse(_ap[0],_sole,_ar*1.05,_ar*0.44,0,0,Math.PI*2); x.stroke();
    x.restore();
    try{ drawEnemySprite(x,A,_ap[0],_ap[1],nowMs); }catch(_e){}
    x.save();
    x.font='bold '+Math.max(8,Math.round(_ar*0.72))+'px Space Grotesk,sans-serif';
    x.textAlign='center'; x.textBaseline='middle';
    const _ly=_top-_ar*1.05;
    x.fillStyle='rgba(20,16,12,0.72)';
    x.fillText(ALLY_NAME,_ap[0]+1,_ly+1);
    x.fillStyle=A.downed?'#e8593a':'#8fe89a';
    x.fillText(ALLY_NAME,_ap[0],_ly);
    if(!A.downed){ const _w=_ar*1.8, _f=Math.max(0,Math.min(1,A.hp/A.max));
      x.fillStyle='rgba(20,16,12,0.6)';
      x.fillRect(_ap[0]-_w/2,_top-_ar*0.35,_w,3);
      x.fillStyle=_f>0.5?'#8fe89a':(_f>0.25?'#e8c88a':'#e8593a');
      x.fillRect(_ap[0]-_w/2,_top-_ar*0.35,_w*_f,3); }
    x.textAlign='left'; x.textBaseline='alphabetic';
    x.restore();
    /* WHAT THE FRAME ACTUALLY DID, recorded by the frame. A checker that
       recomputes fieldPos with a centre and a pixel ratio it does not have is
       measuring its own arithmetic -- V193's pixel arm burned seven attempts on
       exactly that. THIS IS THE REAL SURFACE, written down. */
    G._allyDraw={x:_ap[0],y:_ap[1],top:_top,sole:_sole,label:_ly,S:_S}; }
  const _hopA=(G._demo&&G._demo.k==='A')?Math.pow(1-_bpmPhase,3)*5:0;   /* demo A: unmissable unison hop */""",
        what='he is on the field')

    # ---- 8. WHERE HE TURNS HER OFF (8/12) ----
    d = sub(d,
        """      <button id="readbtn" class="cbtn" style="border-color:#5a7ba8;color:#a8c8e8">THE READ: ON</button>""",
        """      <button id="readbtn" class="cbtn" style="border-color:#5a7ba8;color:#a8c8e8">THE READ: ON</button>
      <button id="allybtn" class="cbtn" style="border-color:#5fbf6a;color:#8fe89a">SHE FIGHTS WITH YOU: ON</button>""",
        what='the toggle button')

    d = sub(d,
        """    const fb=D('bossforget');""",
        """    /* V197: WHERE HE TURNS HER OFF (8/12). Two of you is the whole shape of
       this fight now, so being able to see the fight without her is how you can
       tell what she is actually worth. */
    const yb=D('allybtn');
    if(yb)yb.addEventListener('click',()=>{ G.allyOff=!G.allyOff;
      yb.textContent='SHE FIGHTS WITH YOU: '+(G.allyOff?'OFF':'ON');
      yb.style.borderColor=G.allyOff?'#4a443a':'#5fbf6a';
      yb.style.color=G.allyOff?'#6a6458':'#8fe89a';
      try{ if(G.allyOff){ G.ally=null; G._alKey=null; G._alSet={}; }
           else allyMake(); renderBoard(); }catch(_e){} });
    const fb=D('bossforget');""",
        what='the toggle wiring')

    # ---- 9. AND V196'S OWN LABEL WAS INSIDE THE MAN'S CHEST ----
    # Found by looking at the companion's label, then doing the arithmetic that
    # should have been done yesterday: drawHuman blits at ey-84*S, so a head top
    # is 2.3 RINGS above the field position and er*1.9 is 0.65 of a ring. The
    # label shipped over his torso. Same derived anchor, same fix.
    d = sub(d,
        """        x.fillText('HAS THE ROOM',ex+1,ey-er*1.9+1);
        x.fillStyle='#ffb4a0';
        x.fillText('HAS THE ROOM',ex,ey-er*1.9);""",
        """        /* V197 CORRECTION: er*1.9 is 0.65 of a ring and a body's head top is
           2.3 rings up (drawHuman blits at ey-84*S), so this label shipped
           yesterday ON HIS CHEST. Anchored to the draw now, not to a guess. */
        const _hy=ey-84*bodyScale()-er*1.05;
        x.fillText('HAS THE ROOM',ex+1,_hy+1);
        x.fillStyle='#ffb4a0';
        x.fillText('HAS THE ROOM',ex,_hy);""",
        what='V196 label was inside the chest')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v197: two of you -- %d chars' % len(d))


if __name__ == '__main__':
    main()
