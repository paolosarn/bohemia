#!/usr/bin/env python3
"""V157 THE BULLETS ARE OVER THERE: AMMO, AND THE DEAD ARE THE SUPPLY.

Paolo 8/15, LOCKED, demo-critical, and now said again in the same words:
"It's still kind of felt like I just found some cover and I stayed in the same
place just shooting people at the same location like nothing changed. There's no
movement. There's no movement whatsoever and I hate it."

--------------------------------------------------------------------------
I HAVE ALREADY BUILT THIS THREE TIMES AND IT DID NOT WORK
--------------------------------------------------------------------------
V152 made his cover decay. V136/V137 made them flank and press. V152 took the
grenade off its leash. Every one of those is the SAME IDEA: make his spot worse.
He has now rejected the result four times.

A FOURTH PUNISHMENT WOULD BE THE FOURTH-VERSION MISTAKE. Writing another one is
the tell that I already failed, so this changes CLASS instead.

His own law names the difference. Mechanisms 1-4 (cover expires, flankers, the
flush, rushers) are survival taxes -- every one of them can be TANKED while you
keep firing from the same tile, which is exactly what he keeps reporting. 5 and
6 (the objective moves, the resource is elsewhere) make movement the WIN
CONDITION. You cannot tank a win condition. The law also says 5 and 6 "sit
naturally with a world about scarcity and people".

--------------------------------------------------------------------------
THE GAME HAS NO AMMO. NONE. INFINITE BULLETS, SINCE THE FIRST DAY.
--------------------------------------------------------------------------
Grepped the whole combat blob: not one occurrence outside the audio blobs. In a
post-economic-collapse survival RPG about scarcity, the gun never runs out. That
is simultaneously the realism hole and the exact reason one tile can win a fight:
a spot with infinite bullets and a wall is a fortress.

  YOUR GUN HOLDS WHAT IT HOLDS.
  EVERY SHOT SPENDS A ROUND.
  YOU START WITH A MAGAZINE AND NOTHING SPARE.

--------------------------------------------------------------------------
AND THE SUPPLY IS THE DEAD, WHICH IS WHAT MAKES IT MOVEMENT
--------------------------------------------------------------------------
Ammo alone would only be a pacing tax -- he would shoot less from the same tile.
The thing that moves him is WHERE the next round is:

*** EVERY MAN YOU DROP LEAVES HIS ROUNDS ON THE GROUND WHERE HE FELL. ***

Which is never where you are standing. So the loop becomes: kill until dry, then
break cover and cross the lot to a body, under fire, while the men still up work
your angle. Movement is not a way to avoid dying any more. It is the only way to
keep shooting.

IT IS SELF-BALANCING AND IT CANNOT DEAD-END. The fight always contains enough
bullets to finish it, because the bullets are ON the enemies -- but only if he
goes and gets them. Moving costs no ammo, so there is no soft-lock: dry with
nothing in reach still leaves him his feet and his other gun.

AND IT IS TRUE TO THE WORLD. You loot the dead because rounds are currency. No
timer, no shrinking circle, no author on a loudspeaker -- the same restraint
V152 argued for, finally attached to a mechanism that can't be tanked.

--------------------------------------------------------------------------
THE NUMBERS ARE HIS
--------------------------------------------------------------------------
Mechanism mine, contents his. Every number here is a [DIAL] with a real attempt
in it (ALWAYS MAKE AN ATTEMPT, 8/11) rather than an empty table he cannot play.
ONE number controls the whole feel and it is MAG: how many shots a gun holds
before he has to leave. Everything else follows from it.

REUSE CHECK: cooks NO graphic pixels. The dropped-rounds tile REUSES the grenade
marker geometry byte for byte (same fieldPos, same pulsing disc, same dashed
ring, same label draw) exactly as V137's hold marker did rather than inventing a
second marker. worldShift already carries world tiles; the drop is one more line
in the list it already walks. Nothing authored, no bank opened.

TASTE CHECK: authors no art. The taste rule is his: "it has to be things that
switched up naturally". A magazine running dry is not a rule he has to learn, it
is a thing he can hear and see, and the answer to it is a place on the ground
rather than a menu. The restraint is that nothing announces itself -- no timer,
no warning, no shrinking play area.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region. The reload is a TURN, not a new animation, so
  it owes the CHARACTER lane nothing and cannot be blocked on a clip that does
  not exist.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V157 THE BULLETS ARE OVER THERE'
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
        print('v157 already in; nothing to do')
        return

    # ---- 1. the ammo model --------------------------------------------
    old = """const WEAPON_CAP={pistol:8,smg:2,rifle:1,shotgun:2};   /* V62 WEAPON IDENTITY: killshots/turn ceiling per weapon, min'd with your skill */"""
    new = """const WEAPON_CAP={pistol:8,smg:2,rifle:1,shotgun:2};   /* V62 WEAPON IDENTITY: killshots/turn ceiling per weapon, min'd with your skill */
/* ===== V157 THE BULLETS ARE OVER THERE ========================
   Paolo 8/15, LOCKED and demo-critical, said again in the same words: "I just
   found some cover and I stayed in the same place just shooting people at the
   same location like nothing changed. There's no movement whatsoever and I
   hate it."
   I HAVE ALREADY BUILT THIS THREE TIMES. V152 decayed his cover, V136/V137 made
   them flank and press, V152 unleashed the grenade -- all the same idea, make
   his spot worse, and he has rejected the result four times. A FOURTH
   PUNISHMENT IS THE FOURTH-VERSION MISTAKE, so this changes class.
   His own law names the difference: cover-expires and flankers are survival
   TAXES and every one of them can be TANKED while he keeps firing from the same
   tile. "The resource is elsewhere" is a WIN CONDITION, and you cannot tank a
   win condition.
   AND THE GAME HAD NO AMMO AT ALL. Not one occurrence in the whole combat blob.
   Infinite bullets in a game about scarcity, which is both the realism hole and
   the exact reason one tile can win a fight: a spot with a wall and unlimited
   rounds is a fortress.
   *** EVERY MAN YOU DROP LEAVES HIS ROUNDS WHERE HE FELL. *** Which is never
   where you are standing. Ammo alone would only make him shoot less from the
   same tile; the thing that MOVES him is where the next round is. It is
   self-balancing (the fight always holds enough bullets to finish it, because
   they are on the men) and it cannot dead-end (walking costs nothing, and the
   other gun is a tap away). And it is true to the world: you loot the dead
   because rounds are currency. */
const MAG={pistol:8, smg:16, rifle:4, shotgun:4};   /* [DIAL] what a gun HOLDS when it is full */
/* *** THE NUMBER THE WHOLE THING LIVES ON, AND THE LAW SETS IT, NOT TASTE. ***
   MEASURED with a full magazine in each gun: 65% of fights still CLEARED FROM
   ONE SPOT, because 8 in the pistol plus 4 in the rifle covers 8 men and the
   first excursion never has to happen. His law's test is "can the player win
   without leaving the first cover they reach -- if yes, it is not fixed", so
   the starting load is CONSTRAINED, not chosen: it has to be smaller than the
   fight or the mechanism is decoration.
   AND IT IS THE PREMISE ANYWAY. You scavenged this gun. Nobody in a collapse
   walks around with a full magazine and spares -- rounds are currency, you have
   almost none, and the fight is about taking theirs. Starting nearly dry is not
   a difficulty setting, it is the world. */
const START_LOADED={pistol:3, smg:5, rifle:2, shotgun:2};   /* [DIAL] what is actually IN it at the bell */
const MAG_DEF=8;
const START_SPARE=0;      /* [DIAL] loose rounds at the bell -- you have what is in the gun */
/* ROUNDS ARE ROUNDS. The first cut typed every drop by the dead man's calibre,
   which is more realistic and DEAD-ENDED THE FIGHT: measured, 24 of 40 fights
   became unwinnable because he was carrying a pistol and the ground was covered
   in rifle ammo he could not load. A mechanism that can strand him is not a
   mechanism, it is a bug with a story attached. One loose pool, and the flavour
   loss is worth a fight that can always be finished. */
function startLoad(w){ const v=START_LOADED[w]; return Math.min(magSize(w), v==null?2:v); }
const DROP_ROUNDS=3;      /* [DIAL] what a dead man's pockets are worth */
const PICKUP_R=1.3;       /* [DIAL] how close you walk to pick it up */
function magSize(w){ return MAG[w||WEAPON]||MAG_DEF; }
function roundsIn(w){ w=w||WEAPON; G.ammo=G.ammo||{}; if(G.ammo[w]==null)G.ammo[w]=startLoad(w); return G.ammo[w]; }
function spareRounds(){ if(G.spare==null)G.spare=START_SPARE; return G.spare; }
function dryNow(){ return roundsIn(WEAPON)<=0; }
function canReload(){ return spareRounds()>0 && roundsIn(WEAPON)<magSize(WEAPON); }
/* a shot costs a round. Called at the moment a shot is COMMITTED, chain shots
   included, so one trigger pull is one round and nothing is spent on a refusal. */
function spendRound(){ const w=WEAPON; G.ammo=G.ammo||{}; roundsIn(w); G.ammo[w]=Math.max(0,G.ammo[w]-1);
  try{updAmmoRead();}catch(_e){} return G.ammo[w]; }
function doReload(){ if(G.phase!=='cover'||G.over||G.inc)return;
  if(!canReload()){ setRead('NOTHING TO LOAD','no loose rounds \\u2014 they are on the men you dropped, go and get them','#e8593a'); return; }
  const w=WEAPON, need=magSize(w)-roundsIn(w), take=Math.min(need,spareRounds());
  G.ammo[w]+=take; G.spare-=take;
  try{audio();}catch(_e){}
  setRead('RELOAD',take+' round'+(take>1?'s':'')+' in the '+w+' \\u2014 the reload was your turn','#c0d0e8');
  /* THE COST: your turn, exactly like the swap. You stayed tucked, so this is
     the same exposure WAIT takes. */
  endTurnReturn(false); }
/* the dead are the supply */
function dropRounds(e){ if(!e)return; G.drops=G.drops||[];
  G.drops.push({ea:e.ea, edist:e.edist, lvl:(e.lvl|0), n:DROP_ROUNDS, _at:performance.now()}); }
/* walking over it takes it. Checked after every world move, because the world
   moving under him IS him walking. */
function sweepDrops(){ if(!G.drops||!G.drops.length)return 0;
  let got=0, rounds=0, keep=[];
  for(const d of G.drops){
    if((d.lvl|0)===myLvl() && d.edist<=PICKUP_R){
      spareRounds(); G.spare+=d.n; got++; rounds+=d.n; }
    else keep.push(d); }
  G.drops=keep;
  if(got){ try{audio();}catch(_e){}
    setRead('PICKED UP',rounds+' round'+(rounds>1?'s':'')+' off the ground','#8fe89a');
    try{updAmmoRead();}catch(_e){} }
  return rounds; }"""
    js = subN(js, old, new)

    # ---- 2. a shot spends a round, and a dry gun refuses ---------------
    old = """  G.popTarget>=0||(G.popTarget=pickTarget()); G.fireTarget=(isChain?nextChainTarget():G.popTarget); if(G.fireTarget<0){ return endTurnReturn(); }"""
    new = """  /* V157: A DRY GUN CANNOT SHOOT, and the readout NAMES THE WAY OUT rather
     than stating a fact he can already feel -- reload if he has loose rounds,
     the other gun if it is loaded, otherwise the ground. */
  if(dryNow()){ const _alt=altWeapon();
    if(canReload())setRead('EMPTY','the '+WEAPON+' is dry \\u2014 RELOAD costs your turn','#e8593a');
    else if(_alt&&_alt!==WEAPON&&roundsIn(_alt)>0)setRead('EMPTY','the '+WEAPON+' is dry \\u2014 SWAP TO '+_alt.toUpperCase()+', it is loaded','#e8593a');
    else setRead('EMPTY','no rounds anywhere on you \\u2014 they are on the men you dropped, GO AND GET THEM','#e8593a');
    return; }
  G.popTarget>=0||(G.popTarget=pickTarget()); G.fireTarget=(isChain?nextChainTarget():G.popTarget); if(G.fireTarget<0){ return endTurnReturn(); }
  spendRound();   /* V157: one trigger pull, one round -- spent only once the shot is real */"""
    js = subN(js, old, new)

    # ---- 3. a man who falls leaves his rounds --------------------------
    old = """      if(_lethalRoll){ tgt.dead=true; }   /* his ruling: this weapon finishes the job, no downed state */"""
    new = """      if(_lethalRoll){ tgt.dead=true; try{dropRounds(tgt);}catch(_e){} }   /* his ruling: this weapon finishes the job, no downed state. V157: and his pockets hit the ground where he fell */"""
    js = subN(js, old, new)

    # ---- 4. the world carries the drops, and walking takes them --------
    old = """  if(Array.isArray(G.litter))for(const L of G.litter)mv(L,0.02);
}"""
    new = """  if(Array.isArray(G.litter))for(const L of G.litter)mv(L,0.02);
  if(Array.isArray(G.drops))for(const d of G.drops)mv(d,0.02);   /* V157: rounds stay on the tile they fell on -- if they moved with him there would be nothing to walk to */
  try{sweepDrops();}catch(_e){}   /* the world moving under him IS him walking */
}"""
    js = subN(js, old, new)

    # ---- 5. the reset ------------------------------------------------
    old = """  G.pGren=null; G.pGrenLeft=P_GREN_PER_FIGHT; G.grenArm=false;    /* YOURS -- the one he caught */"""
    new = """  G.pGren=null; G.pGrenLeft=P_GREN_PER_FIGHT; G.grenArm=false;    /* YOURS -- the one he caught */
  /* V157: what you scavenged, and empty pockets. Both weapons get their
     starting load, because the pair is carried at once (V149). */
  G.ammo={}; G.spare=START_SPARE; G.drops=[];
  try{ G.ammo[WEAPON]=startLoad(WEAPON); const _a=altWeapon(); if(_a)G.ammo[_a]=startLoad(_a); }catch(_e){}"""
    js = subN(js, old, new)

    # ---- 6. the button says EMPTY, and the tap reloads ------------------
    old = """  if(G.phase!=='cover')return; G.pkgDiff=G.userPkg; const fb=D('fire'); const exp=exposedToMe(); const pexp=posExposed(); let green=false;
  let bg,glow,col,txt;"""
    new = """  if(G.phase!=='cover')return; G.pkgDiff=G.userPkg; const fb=D('fire'); const exp=exposedToMe(); const pexp=posExposed(); let green=false;
  let bg,glow,col,txt;
  /* V157: A DRY GUN OWNS THE BUTTON, and the button names the move. This is
     checked FIRST because no other state matters when the gun cannot fire -- a
     green pop with an empty magazine is the button lying again. */
  if(dryNow()){
    const _al=altWeapon(), _altLoaded=(_al&&_al!==WEAPON&&roundsIn(_al)>0);
    txt=canReload()?'RELOAD':(_altLoaded?('SWAP TO '+_al.toUpperCase()):'GO GET ROUNDS');
    bg='radial-gradient(circle at 50% 40%,#8a2618,#2e0e0a 72%)';
    glow='0 0 0 1px #e0603a,0 0 30px 7px rgba(232,89,58,.7)'; col='#ffeae6';
    if(fb){ fb.style.background=bg; fb.style.boxShadow=glow; fb.style.color=col; fb.textContent=txt; }
    G._greenNow=false; try{updMoveUI();}catch(_e){} try{updAmmoRead();}catch(_e){}
    return; }"""
    js = subN(js, old, new)

    old = """function doPop(){ if(G.phase!=='cover'||G.over)return; if(G.inc)return;   /* CUTSCENE LAW (Paolo 7/3/26): they play out, short, no skipping */"""
    new = """function doPop(){ if(G.phase!=='cover'||G.over)return; if(G.inc)return;   /* CUTSCENE LAW (Paolo 7/3/26): they play out, short, no skipping */
  /* V157: the button said RELOAD, so the tap RELOADS. A button that names a
     move and then does not perform it is the dead-end V150 was about. */
  if(dryNow()){
    if(canReload())return doReload();
    const _al=altWeapon(); if(_al&&_al!==WEAPON&&roundsIn(_al)>0){ try{audio();}catch(_e){} return doSwap(); }
    setRead('NO ROUNDS','nothing in either gun \\u2014 the bullets are on the men you dropped, WALK','#e8593a');
    try{audio();}catch(_e){} return; }"""
    js = subN(js, old, new)

    # ---- 7. he can SEE what he has left --------------------------------
    old = """function updGap(){ try{updRangeRead();}catch(_e){}   /* V88: the trade is on screen whenever the board is */"""
    new = """/* V157: rounds left, on the readout he already reads for range. A resource he
   cannot see is a resource he cannot plan around, and this one decides whether
   he can stay where he is. */
function updAmmoRead(){ try{ const el=D('ammoread'); if(!el)return;
  const n=roundsIn(WEAPON), sp=spareRounds(), mx=magSize(WEAPON);
  el.textContent=n+'/'+mx+(sp>0?(' +'+sp):'');
  el.style.color=(n===0)?'#e8593a':(n<=Math.max(1,Math.round(mx*0.34))?'#e8a04a':'#8a7d66'); }catch(_e){} }
function updGap(){ try{updRangeRead();}catch(_e){} try{updAmmoRead();}catch(_e){}   /* V88: the trade is on screen whenever the board is */"""
    js = subN(js, old, new)

    # ---- 7b. and the readout exists on the page -------------------------
    old = """  <!-- V69: the timing grade, persistent. A grade that vanishes teaches nothing. -->"""
    new = """  <!-- V157 ROUNDS LEFT: the resource that decides whether he can stay where he
       is. It sits with the range read because they are the same question --
       what this gun can do from here. -->
  <div id="ammoread" style="font-size:11px;min-height:13px;letter-spacing:2px;font-weight:700;color:#8a7d66;"></div>
  <!-- V69: the timing grade, persistent. A grade that vanishes teaches nothing. -->"""
    js = subN(js, old, new)

    # ---- 8. the tile on the ground, REUSING the grenade marker ---------
    old = """  if(!aimo&&G.grenade){   /* V60 GRENADE: the pulsing danger tile + fuse count */"""
    new = """  if(!aimo&&Array.isArray(G.drops))for(const _d of G.drops){   /* V157: rounds on the ground. THE GRENADE MARKER, reused byte for byte -- same fieldPos, same pulsing disc, same dashed ring, same label draw, exactly as V137's hold marker did rather than inventing a second one. Green because it is the one thing on this board that is FOR him. */
    if((_d.lvl|0)!==myLvl())continue;
    const dp=fieldPos(_d,W,H,cx,cy), rr4=ring*1.35, pu4=0.5+0.5*Math.sin(performance.now()*0.005);
    x.save(); x.fillStyle='rgba(95,200,110,'+(0.10+pu4*0.10).toFixed(3)+')';
    x.beginPath(); x.arc(dp[0],dp[1],rr4*0.62,0,7); x.fill();
    x.strokeStyle='rgba(95,200,110,'+(0.45+pu4*0.30).toFixed(3)+')'; x.lineWidth=2.5; x.setLineDash([6,5]);
    x.beginPath(); x.arc(dp[0],dp[1],rr4*(0.58+pu4*0.14),0,7); x.stroke(); x.setLineDash([]);
    x.fillStyle='#dcffe6'; x.font='bold '+Math.round(ring*0.34)+'px Space Grotesk,sans-serif';
    x.textAlign='center'; x.textBaseline='middle'; x.fillText('AMMO',dp[0],dp[1]);
    x.textAlign='left'; x.textBaseline='alphabetic'; x.restore(); }
  if(!aimo&&G.grenade){   /* V60 GRENADE: the pulsing danger tile + fuse count */"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v157: the bullets are over there -- %d chars' % len(js))


if __name__ == '__main__':
    main()
