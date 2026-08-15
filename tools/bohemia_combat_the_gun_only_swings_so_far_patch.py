#!/usr/bin/env python3
"""V155 THE GUN ONLY SWINGS SO FAR: A CHAIN IS ONE MOTION, NOT A PIROUETTE.

Paolo, 8/15, for the SECOND time: "I already told you if I'm facing one way the
next person that I can kill shot can't be like directly on the other side like
bumping to shoot someone."

--------------------------------------------------------------------------
HE DID TELL ME, AND THE CHAIN NEVER ONCE ASKED WHERE THE GUN WAS POINTING
--------------------------------------------------------------------------
The whole of the chain's target selection was this line:

    function nextChainTarget(){ return pickTarget(); }

Pure threat order, closest-first, all 360 degrees of the board. So a killshot
could hand you a man standing at your back and call it one continuous motion.
That is not a chain, it is a pirouette, and he spotted it the first time he
played it.

A CHAIN IS ONE MOTION. The muzzle comes off the man who just dropped and swings
onto the next one. So the next victim has to be inside the arc the gun can
actually traverse in that beat. Outside the arc there is no chain: the turn
ends, and lining the next one up costs him a reposition.

*** THAT IS THE MOVEMENT HE KEEPS ASKING FOR. *** It arrives out of the fight
instead of out of a rule, which is exactly the shape he demanded when he said
"it has to be things that switched up naturally". Where you stand decides how
many men one turn can take, so standing still has a price it has never had.

--------------------------------------------------------------------------
AND THE ARC BELONGS TO THE GUN
--------------------------------------------------------------------------
Which answers the other half of what he said that day: "maybe depending on the
gun type."

    pistol   +/- 75 deg    whips, the lightest thing you can carry
    smg      +/- 60 deg
    shotgun  +/- 55 deg    heavy at the muzzle
    rifle    +/- 40 deg    long, and slow to traverse
    sniper   +/- 20 deg    a scope sees almost nothing beside itself

THE GUN THAT GIVES THE MOST SHOTS GIVES THE LEAST GROUND. The pistol's eight
killshots a turn are worth less than they look if the men are spread out, and
the rifle that reaches the whole field only chains what is nearly in front of
it. That is a real trade between two guns he now carries at once (V149).

--------------------------------------------------------------------------
MEASURED FROM THE MUZZLE, NOT FROM THE STANCE (the bug I nearly shipped)
--------------------------------------------------------------------------
The obvious angle to measure from is G.faceAng. It is also WRONG: G.faceAng is
written a second time by updateStanceFacing every time the phase returns to
cover, from the weighted threat facing. Reading it in the chain would have
measured the swing from wherever the body happened to end up after the kill
camera, not from where the shot was taken -- a rule that looks right in the
source and does something else on the screen.

So the shot stamps its own angle (G._muzzleA) at the moment it is taken, and the
chain measures off that. Cleared on every fight reset so nothing stale carries.

REUSE CHECK: cooks NO graphic pixels. Reuses modePool, the existing V28 threat
rank (MOVED to module scope rather than copied -- a second copy of that table is
exactly how a rule and its display drift apart), setRead and the existing chain
plumbing. Nothing authored, no bank opened.

TASTE CHECK: authors no art. The taste rule is his own words twice over: a chain
that spins you 180 degrees reads as the game moving your body for you. The
restraint is that the arc never explains itself with a number on screen -- when
the chain dies the readout says the gun is pointed the other way, in plain words.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V155 THE GUN ONLY SWINGS SO FAR'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v155 already in')
        return

    # ---- 1. the rank moves to module scope, the chain gets an arc ----------
    old = """  const _rank=e=>{
    if(e.melee&&(e.windup||e.edist<=(e.reach||1.8)+0.3)) return 0;   /* V33 THREAT REACH: a windup is a LOCKED strike regardless of distance; otherwise judge by HIS reach, not a flat guess — the spear/bat that jumped your cover now ranks first */
    if(!e.melee&&!myCoverAgainst(e.ea,e.edist,e.lvl)) return 1;   /* gun with a line on your blood */
    if(e.melee) return 2;                                   /* blade still closing */
    return 3; };                                            /* covered-side / the rest */
  let b=-1,bs=1e9; for(const e of pool){ const sc=_rank(e)*1000+e.edist; if(sc<bs){bs=sc;b=e.i;} } return b; }
function nextChainTarget(){ return pickTarget(); }"""
    new = """  return bestOf(pool); }
/* V155: the rank moved to module scope so the CHAIN can use the exact order the
   first shot uses. A second copy of this table is precisely how a rule and the
   thing that draws it drift apart. */
function threatRank(e){
  if(e.melee&&(e.windup||e.edist<=(e.reach||1.8)+0.3)) return 0;   /* V33 THREAT REACH: a windup is a LOCKED strike regardless of distance; otherwise judge by HIS reach, not a flat guess — the spear/bat that jumped your cover now ranks first */
  if(!e.melee&&!myCoverAgainst(e.ea,e.edist,e.lvl)) return 1;   /* gun with a line on your blood */
  if(e.melee) return 2;                                   /* blade still closing */
  return 3; }                                             /* covered-side / the rest */
function bestOf(pool){ let b=-1,bs=1e9; for(const e of pool){ const sc=threatRank(e)*1000+e.edist; if(sc<bs){bs=sc;b=e.i;} } return b; }
/* ===== V155 THE GUN ONLY SWINGS SO FAR ========================
   Paolo, twice: "I already told you if I'm facing one way the next person that
   I can kill shot can't be like directly on the other side like bumping to
   shoot someone."
   HE DID TELL ME, AND THE CHAIN NEVER ONCE ASKED WHERE THE GUN WAS POINTING.
   nextChainTarget was literally `return pickTarget()` -- pure threat order --
   so a killshot could hand you a man at your back and call it one motion. That
   is not a chain, it is a pirouette.
   A CHAIN IS ONE MOTION: the muzzle comes off the man who just dropped and
   swings onto the next one. So the next victim has to sit inside the arc the
   gun can actually traverse, measured from where the SHOT was taken -- the shot
   stamps its own angle, see muzzleAng below, because G.faceAng is also written
   by updateStanceFacing and would have measured from the body instead of the
   gun. Outside the arc there is no chain: the turn ends, and he has to
   reposition to line the next one up. That is the movement he keeps asking for,
   arriving out of the fight instead of out of a rule.
   AND THE ARC BELONGS TO THE GUN, which answers the other half of what he said
   that day ("maybe depending on the gun type"). A pistol whips. An SMG is close
   behind. A shotgun is heavy at the muzzle. A rifle is long and slow to
   traverse, and a scope sees almost nothing beside itself. THE GUN THAT GIVES
   THE MOST SHOTS GIVES THE LEAST GROUND, and the rifle that reaches the whole
   field only chains what is nearly in front of it. */
const SWING_ARC={pistol:1.31, smg:1.05, shotgun:0.96, rifle:0.70, sniper:0.35};
const SWING_DEF=1.05;   /* [DIAL] half-angle in RADIANS -- 1.31 is 75 degrees each side of the muzzle */
function swingArc(){ const w=(typeof WEAPON!=='undefined')?WEAPON:'pistol';
  return (SWING_ARC[w]!=null)?SWING_ARC[w]:SWING_DEF; }
function angGap(a,b){ let d=(a||0)-(b||0); while(d>Math.PI)d-=2*Math.PI; while(d<-Math.PI)d+=2*Math.PI; return Math.abs(d); }
/* MEASURED FROM THE MUZZLE, NOT FROM THE STANCE. G.faceAng is ALSO written by
   updateStanceFacing every time the phase returns to cover -- the weighted
   threat facing -- so reading it here would have silently measured the swing
   from wherever the body happened to be pointing after the kill camera, not
   from where the shot was taken. The shot stamps its own angle. */
function muzzleAng(){ return (G._muzzleA!=null)?G._muzzleA:(G.faceAng||0); }
/* AND THE TURN HAS A TOTAL TRAVERSE, which is the same law one level up.
   MEASURED before this existed: with a per-hop arc only, a pistol chains 63.9%
   of the men left and the chain dies at the arc on 2.1% of kills -- because
   eight hops of 75 degrees is 600 degrees of rotation, so he could still sweep
   the entire board inside one turn, one hop at a time. That is the pirouette
   he complained about, arriving in slow motion.
   A turn is a few seconds of one man turning. The muzzle gets SWEEP_TURNS
   arcs' worth of total travel and no more, so a long chain has to be a chain
   THROUGH the field rather than a circle around him -- and where he stands
   before the first shot decides how much of the board that turn can reach. */
const SWEEP_TURNS=2.2;   /* [DIAL] how many arcs' worth of traverse one turn buys */
function turnSweep(){ return swingArc()*SWEEP_TURNS; }
function sweepLeft(){ return Math.max(0, turnSweep()-(G._sweepUsed||0)); }
function inSwing(e){ if(!e||e.ea==null)return false;
  const g=angGap(e.ea,muzzleAng());
  return g<=swingArc() && g<=sweepLeft(); }
function swingPool(){ return modePool().filter(e=>inSwing(e)); }
function nextChainTarget(){ const pool=swingPool();
  if(!pool.length)return -1;
  if(G.selTarget!=null){ const s=pool.find(e=>e.i===G.selTarget); if(s)return s.i; }
  return bestOf(pool); }"""
    js = subN(js, old, new)

    # ---- 1b. the shot stamps the angle the muzzle was actually on ----------
    old = """  { const tgt=G.e[G.fireTarget]; if(tgt){ if(tgt.ea!=null) G.faceAng=tgt.ea;"""
    new = """  { const tgt=G.e[G.fireTarget]; if(tgt){ if(tgt.ea!=null){ G.faceAng=tgt.ea;
        /* V155: the CHAIN measures its swing off THIS, never off the stance
           facing, and every hop spends from the turn's total traverse. */
        if(G._muzzleA!=null&&isChain)G._sweepUsed=(G._sweepUsed||0)+angGap(tgt.ea,G._muzzleA);
        G._muzzleA=tgt.ea; }"""
    js = subN(js, old, new)

    # the turn's traverse budget opens fresh on the turn's FIRST shot
    old = """  if(!isChain){G._chainN=1;G._poppedOut=false;}   /* V23: track whether this turn ever left the stone */"""
    new = """  if(!isChain){G._chainN=1;G._poppedOut=false;G._sweepUsed=0;G._muzzleA=null;}   /* V23: track whether this turn ever left the stone. V155: and the turn's traverse budget opens fresh */"""
    js = subN(js, old, new)

    # ---- 2. the manual chain tap obeys the same arc ------------------------
    old = """      if(G._chainWait){ G.selTarget=e.i; G._chainWait=false; G.inFU=true; enterAim(true); return; }
      if(G.phase!=='cover'||G.targetMode!=='manual')return;"""
    new = """      if(G._chainWait){ if(!inSwing(e)){ setRead('TOO FAR TO SWING','the '+WEAPON+' is pointed the other way \\u2014 he is not one motion from here','#8a7d66'); return; }
        G.selTarget=e.i; G._chainWait=false; G.inFU=true; enterAim(true); return; }
      if(G.phase!=='cover'||G.targetMode!=='manual')return;"""
    js = subN(js, old, new)

    old = """      if(G._chainWait){ G.selTarget=e.i; G._chainWait=false; G.inFU=true; enterAim(true); return; }   /* V26 MANUAL CHAIN: the chosen next victim */"""
    new = """      if(G._chainWait){ if(!inSwing(e)){ setRead('TOO FAR TO SWING','the '+WEAPON+' is pointed the other way \\u2014 he is not one motion from here','#8a7d66'); return; }
        G.selTarget=e.i; G._chainWait=false; G.inFU=true; enterAim(true); return; }   /* V26 MANUAL CHAIN: the chosen next victim -- V155: inside the arc only */"""
    js = subN(js, old, new)

    # ---- 2b. a new turn starts with the muzzle unstamped -------------------
    old = """  G.steady=0; G._steadyAtPop=0; G._poppedOut=false; G._chainN=1; G._chainWait=false;"""
    new = """  G.steady=0; G._steadyAtPop=0; G._poppedOut=false; G._chainN=1; G._chainWait=false; G._muzzleA=null; G._sweepUsed=0;   /* V155: no stale muzzle angle or spent traverse across the reset */"""
    js = subN(js, old, new)

    # ---- 3. and when nothing is in the arc, SAY SO ------------------------
    old = """  const next=nextChainTarget();
  if(next<0)return endTurnReturn();"""
    new = """  const next=nextChainTarget();
  /* V155: a chain that dies because the gun cannot get there has to SAY that,
     or it reads as the chain being broken for no reason. */
  if(next<0){ try{ if(modePool().length)setRead('NO SWING LEFT','nobody else is in front of that muzzle \\u2014 move and line one up','#8a7d66'); }catch(_e){}
    return endTurnReturn(); }"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print("v155: the gun only swings so far -- %d chars" % len(js))


if __name__ == '__main__':
    main()
