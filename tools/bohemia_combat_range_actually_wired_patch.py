#!/usr/bin/env python3
"""V141 THE RANGE WAS NEVER WIRED TO YOUR GUN. THAT IS THE WHOLE BUG.

Paolo 8/11, for the THIRD time: "again I can personally just stand still and
shoot and kill everyone on screen bro what's wrong with you?"

--------------------------------------------------------------------------
HE HAS BEEN RIGHT EVERY TIME AND I KEPT FIXING THE WRONG THING
--------------------------------------------------------------------------
V138 built a maximum range for every weapon and wrote this function:

    function inMyRange(e){ return !!e && (e.edist||0) <= maxRange(myRange()); }

*** AND NOTHING IN THE GAME EVER CALLED IT. *** Grep the whole demo: two hits.
One is the definition. One is a COMMENT. The player's maximum range has never
been enforced anywhere, once, since the moment it was written.

So he could always shoot everybody, at any distance, exactly as he kept saying.
And then I "fixed" it twice by moving spawn points further away -- which does
nothing at all when the gun has no range limit to be outside of.

WORSE: MY MEASUREMENTS WERE MEASURING inMyRange. I reported "0% in range at the
bell" three times. That number was true and completely meaningless, because it
described a predicate the game ignores. I was testing my own opinion about the
rules instead of the rules. A measurement that does not touch the code path the
player touches is not evidence, and this is the second time this week that
exact mistake has shipped (the giants were the first).

--------------------------------------------------------------------------
RANGE IS NOT A NUMBER, IT IS A FILTER ON WHO YOU CAN FIGHT
--------------------------------------------------------------------------
Three functions decide the whole fight, and none of them knew range existed:

  modePool()     WHO I CAN SHOOT      -> now requires inMyRange
  exposedToMe()  WHO CAN SHOOT ME NOW -> now requires inHisRange
  posExposed()   WHO COULD LINE ME UP -> now requires inHisRange

That is the entire feature, and it is symmetric on purpose: my reach limits my
targets, his reach limits his threat. Everything downstream already reads these
three -- target picking, the action button, the volley, the board chips -- so
wiring them here wires all of it, instead of bolting a check onto each caller
and missing one.

AND THE BUTTON HAS TO SAY IT. If every living man is outside your reach, the
button reads OUT OF RANGE and popping is refused with the two numbers that
matter: how far the nearest man is, and how far your gun actually goes. Silence
would just look broken -- which is what a dead button always looks like.

*** THE MOMENT THIS CREATES IS THE POINT. *** A rifleman stops at his own
effective range and shoots you while your pistol says OUT OF RANGE. You are
being hit and cannot answer. There is exactly one solution and it is your feet.

REUSE CHECK: cooks NO graphic pixels. It calls inMyRange/inHisRange, which
V138 already wrote and never used, from the three predicates that already
existed. No new system, no new state, no art, no bank opened.

TASTE CHECK: authors no art. The taste rule is his, said three times: a fight
you can win standing still is not a fight. The restraint is that a blocked shot
must EXPLAIN itself -- an unresponsive button is a bug to the person holding the
phone, however correct the rule behind it is.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V141 THE RANGE IS ACTUALLY WIRED'
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
        print('v141 already in; nothing to do')
        return

    # ---- 1. WHO I CAN SHOOT --------------------------------------------
    old = """  if(G.engageMode==='shoot') return exposedToMe().concat(mel).concat(pin);
  return G.e.filter(e=>!e.dead&&(peeking(e)||pinned(e))); }"""
    new = """  /* ===== V141 THE RANGE IS ACTUALLY WIRED =======================
     Paolo, three times: "I can personally just stand still and shoot and kill
     everyone on screen." HE WAS RIGHT EVERY TIME. V138 wrote inMyRange() and
     *** NOTHING EVER CALLED IT *** -- two hits in the whole demo, one the
     definition and one a comment. The player's max range has never been
     enforced once since it was written, so of course he could shoot anybody at
     any distance, and moving spawn points further out fixed nothing because
     there was no limit to be outside of.
     RANGE IS NOT A NUMBER, IT IS A FILTER ON WHO YOU CAN FIGHT. This is the
     one place that decides what you may shoot at, so this is where it goes --
     every caller downstream (target picking, the button, the volley, the board
     chips) already reads it. */
  const _inRange=a=>a.filter(e=>inMyRange(e));
  if(G.engageMode==='shoot') return _inRange(exposedToMe().concat(mel).concat(pin));
  return _inRange(G.e.filter(e=>!e.dead&&(peeking(e)||pinned(e)))); }
/* is there anybody at all that this gun can touch right now */
function anyInMyRange(){ return (G.e||[]).some(e=>e&&!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&inMyRange(e)); }
function nearestFoe(){ let d=Infinity;
  for(const e of (G.e||[])){ if(!e||e.dead||e.downed||e.broken||e.fleeing)continue;
    if((e.edist||0)<d)d=e.edist||0; }
  return d; }"""
    js = subN(js, old, new)

    # ---- 2. WHO CAN SHOOT ME -------------------------------------------
    old = """function exposedToMe(){ return G.e.filter(e=>!e.dead&&!e.melee&&!pinned(e)&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst(e.ea,e.edist,e.lvl)); }"""
    new = """function exposedToMe(){ return G.e.filter(e=>!e.dead&&!e.melee&&!pinned(e)&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst(e.ea,e.edist,e.lvl)&&inHisRange(e)); }   /* V141: a man too far away to reach you is not a threat, he is scenery */"""
    js = subN(js, old, new)

    old = """function posExposed(){ return G.e.filter(e=>!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&!e.melee&&!pinned(e)&&e.stun<=0&&!myCoverAgainst(e.ea,e.edist,e.lvl)); }"""
    new = """function posExposed(){ return G.e.filter(e=>!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&!e.melee&&!pinned(e)&&e.stun<=0&&!myCoverAgainst(e.ea,e.edist,e.lvl)&&inHisRange(e)); }   /* V141: HIS reach bounds HIS threat, exactly as mine bounds my targets */"""
    js = subN(js, old, new)

    # ---- 3. THE BUTTON SAYS IT -----------------------------------------
    old = """  if(G.phase!=='cover')return; G.pkgDiff=G.userPkg; const fb=D('fire'); const exp=exposedToMe(); const pexp=posExposed(); let green=false;
  let bg,glow,col,txt;
  if(exp.length>0){"""
    new = """  if(G.phase!=='cover')return; G.pkgDiff=G.userPkg; const fb=D('fire'); const exp=exposedToMe(); const pexp=posExposed(); let green=false;
  let bg,glow,col,txt;
  /* V141: IF NOTHING IS IN YOUR REACH, THE BUTTON SAYS SO. A dead button is a
     bug to the person holding the phone however correct the rule behind it is.
     The red stays if somebody is shooting you from outside your reach, because
     that is the whole moment this creates: you are being hit and cannot answer,
     and the only solution is your feet. */
  if(aliveEnemies().length>0 && !anyInMyRange()){
    const _hot=exp.length>0;
    bg=_hot?'radial-gradient(circle at 50% 40%,#8a2618,#2e0e0a 72%)':'radial-gradient(circle at 50% 38%,#26303a,#0d1215 72%)';
    glow=_hot?'0 0 0 1px #e0603a,0 0 30px 7px rgba(232,89,58,.7)':'0 0 0 1px #3a4a58,0 6px 22px rgba(0,0,0,.6)';
    col=_hot?'#ffeae6':'#7f93a4'; txt='OUT OF RANGE';
    if(fb){ fb.style.background=bg; fb.style.boxShadow=glow; fb.style.color=col; fb.textContent=txt; }
    G._green=false; try{updMoveUI();}catch(_e){}
    return; }
  if(exp.length>0){"""
    js = subN(js, old, new)

    # ---- 4. AND POPPING IS REFUSED, WITH THE TWO NUMBERS ---------------
    old = """function doPop(){ if(G.phase!=='cover'||G.over)return; if(G.inc)return;   /* CUTSCENE LAW (Paolo 7/3/26): they play out, short, no skipping */ audio();"""
    new = """function doPop(){ if(G.phase!=='cover'||G.over)return; if(G.inc)return;   /* CUTSCENE LAW (Paolo 7/3/26): they play out, short, no skipping */
  /* V141: you cannot shoot what your gun cannot reach. It says WHY, with the
     only two numbers that matter -- how far the nearest man is, and how far
     this gun actually goes. */
  if(aliveEnemies().length>0 && !anyInMyRange()){
    const _n=nearestFoe(), _r=maxRange(myRange());
    setRead('OUT OF RANGE','nearest is '+Math.round(_n)+' tiles, this gun reaches '+Math.round(_r)+' \\u2014 WALK','#6aa8e8');
    try{audio();}catch(_e){} return; }
  audio();"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v141: the range is actually wired -- %d chars' % len(js))


if __name__ == '__main__':
    main()
