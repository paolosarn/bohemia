#!/usr/bin/env python3
"""V147 THE BUTTON AND THE BOARD STOP LYING.

Paolo 8/12: "sometimes I'll click it and I'll just get shot first... there's so
many times in the arena where it says there's like an invisible pillar there or
something it's very annoying. This shit is going downhill."

Three complaints, one disease: THE GAME TELLS HIM ONE THING AND DOES ANOTHER.

--------------------------------------------------------------------------
1. THE ACTION BUTTON GETS HIM SHOT WITHOUT FIRING
--------------------------------------------------------------------------
doPop has a branch that ends in recklessPop(): press the button when there is
nothing to shoot and every gun holding a bead takes a free shot at you. You
never fire. That is:

  * EXACTLY what he described, and
  * A DIRECT BREACH OF A LOCKED LAW. YOU ALWAYS SHOOT FIRST (8/3, his words:
    "no enemies never get the first shot thats why its important to not miss").
    recklessPop hands them the first shot and you get none.
  * AND IT BYPASSES V146 ENTIRELY. I made a green pop take no return fire
    yesterday; recklessPop never looks at _poppedGreen, so the safety promise
    was still being broken one branch over from where I fixed it.

*** THE PUNISHMENT ITSELF IS HIS AND IT STAYS. *** V29 exists because he asked
for a cost to popping at the wrong moment. Newest-date-wins does not delete that
-- what he is objecting to now is being SURPRISED by it, and being hit through a
promise the UI had already made. So:
  - GREEN IS ABSOLUTE. If the button was green, a reckless pop costs nothing.
    A promise the game makes is worth more than a punishment it wants.
  - AND THE BUTTON SAYS IT FIRST. In that state it now reads NOTHING TO SHOOT
    instead of POP OUT, so the risk is on screen BEFORE he commits. He is
    allowed to take a bad turn; he is not allowed to be tricked into one.

--------------------------------------------------------------------------
2. THE INVISIBLE PILLAR
--------------------------------------------------------------------------
RUN blocked a tile with `hypot(pillar, cell) < P.r*0.6+0.45`. Three problems:
  * that is up to 1.1 TILES of blocking around a rock drawn at 0.45
  * pillars hold float positions and worldShift slides them off the grid as he
    walks, so the blocking circle stops lining up with any tile he can see
  * the file has FOUR different collision radii for the same rocks
    (r*0.6+0.5, r*0.8, r*0.6+0.45, r*0.9) and none of them is the drawn size

So a cell that looks empty refuses him, and he called it an invisible pillar
because that is precisely what it is.
BLOCKING IS A TILE FACT NOW: a rock blocks the ground it actually covers --
max(0.5, P.r) from its centre -- so a small rock blocks its own tile and a big
one blocks what you can see it sitting on. Same rule as OCCUPANCY: one thing per
cell, and the cell is the unit.

--------------------------------------------------------------------------
WHAT I AM NOT DOING
--------------------------------------------------------------------------
He also asked to SEE every enemy's weapon range. That is a real ask and it is
next, but it is a new surface and this turn is three regressions in things that
already existed. Fixing the lies first, then adding the readout, because a
readout drawn on top of a lying board would just be a prettier lie.

REUSE CHECK: cooks NO graphic pixels. Reuses _poppedGreen, exposedToMe,
anyPeeking, pXY and the existing pillar list. No bank opened, nothing authored.

TASTE CHECK: authors no art. The rule is the one under every control: the game
may be hard, and it may punish him, but it may never tell him one thing and do
another. Every complaint in this message is that same betrayal wearing a
different hat.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V147 THE BUTTON AND THE BOARD STOP LYING'
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
        print('v147 already in; nothing to do')
        return

    # ---- 1. green is absolute, even here --------------------------------
    old = """function recklessPop(){ /* V29 RECKLESS POP"""
    new = """/* ===== V147 THE BUTTON AND THE BOARD STOP LYING ==================
   Paolo 8/12: "sometimes I'll click it and I'll just get shot first."
   THIS FUNCTION IS THAT. You press the button, you never fire, and every gun
   holding a bead takes a free shot. It breaches YOU ALWAYS SHOOT FIRST (8/3,
   locked, his words: "no enemies never get the first shot"), and it bypasses
   V146 entirely -- I made a green pop take no return fire yesterday and this
   branch never looked at _poppedGreen, so the promise was still being broken
   one branch over from where I fixed it.
   THE PUNISHMENT IS HIS AND IT STAYS: V29 exists because he asked for a cost to
   popping at the wrong moment. What he is objecting to is being SURPRISED by it
   and being hit through a promise the UI already made. So green is absolute
   here too, and the button now says NOTHING TO SHOOT before he commits. */
function recklessPop(){ /* V29 RECKLESS POP"""
    js = subN(js, old, new)

    old = """  audio(); G._steadyAtPop=0; G.steady=0; G._riseAt=performance.now(); G._dropAt=0;
  const holders=G.e.filter(e=>!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&!e.melee&&!pinned(e)&&e.stun<=0&&(e.acq||0)>=1);"""
    new = """  audio(); G._steadyAtPop=0; G.steady=0; G._riseAt=performance.now(); G._dropAt=0;
  /* V147: GREEN IS ABSOLUTE. A promise the game made is worth more than a
     punishment it wants. If the button was green when he committed, this costs
     nothing -- the same rule V146 gave the volley, applied to the branch that
     was quietly exempt from it. */
  if(G._poppedGreen){ G._poppedGreen=false;
    setRead('NOTHING TO SHOOT','you stood up on a green board \\u2014 nobody had a bead on you','#8fe89a');
    G.phase='cover'; G._dropAt=performance.now(); G._riseAt=0; setPhaseUI(); tickTurnEnd(); renderBoard(); updGap(); return; }
  const holders=G.e.filter(e=>!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&!e.melee&&!pinned(e)&&e.stun<=0&&(e.acq||0)>=1);"""
    js = subN(js, old, new)

    # ---- 2. the button says it BEFORE he commits ------------------------
    old = """    if(outN===0){             // nobody out, nothing to pop at
      bg='radial-gradient(circle at 50% 38%,#3a342a,#15120d 72%)'; glow='0 0 0 1px #4a4030,0 6px 22px rgba(0,0,0,.6)'; col='#8a7d66'; txt=nearCov?'POP OUT':'ENGAGE';"""
    new = """    if(outN===0){             // nobody out, nothing to pop at
      /* V147: SAY IT BEFORE HE COMMITS. This is the state that ends in
         recklessPop -- he stands up, never fires, and anyone holding a bead
         takes a free shot. It used to read POP OUT, which is an invitation.
         He is allowed to take a bad turn; he is not allowed to be tricked into
         one. */
      bg='radial-gradient(circle at 50% 38%,#3a342a,#15120d 72%)'; glow='0 0 0 1px #4a4030,0 6px 22px rgba(0,0,0,.6)'; col='#8a7d66'; txt='NOTHING TO SHOOT';"""
    js = subN(js, old, new)

    # ---- 3. the invisible pillar ---------------------------------------
    old = """    if((G.pillars||[]).some(Q=>{ const q=pXY(Q);
      return Math.hypot(q[0]-cx,q[1]-cy)<Q.r*0.6+0.45; }))break;"""
    new = """    /* V147 THE INVISIBLE PILLAR. This used to block with r*0.6+0.45 -- up to
       1.1 TILES around a rock drawn at 0.45 -- against a float position that
       worldShift slides off the grid as he walks. So cells that looked empty
       refused him, which is exactly what an invisible pillar is. A rock blocks
       THE GROUND IT COVERS: half a tile minimum, its own radius if bigger. */
    if((G.pillars||[]).some(Q=>{ const q=pXY(Q);
      return Math.hypot(q[0]-cx,q[1]-cy)<Math.max(0.5,Q.r||0.5); }))break;"""
    js = subN(js, old, new)

    old = """    if((G.pillars||[]).some(Q=>{ const w=pXY(Q);
        return Math.hypot(w[0]-sx,w[1]-sy)<Q.r*0.6+0.45; })){
      setRead('BLOCKED','low cover that way and no room on the far side','#8a7d66'); return; }"""
    new = """    if((G.pillars||[]).some(Q=>{ const w=pXY(Q);
        return Math.hypot(w[0]-sx,w[1]-sy)<Math.max(0.5,Q.r||0.5); })){   /* V147: the ground it covers, not a 1.1-tile halo */
      setRead('BLOCKED','low cover that way and no room on the far side','#8a7d66'); return; }"""
    js = subN(js, old, new)

    # ---- 4. THE REAL INVISIBLE PILLAR: THE PLAIN MOVE --------------------
    # MEASURED the RUN block first and it was only 1-2% ghosts, so RUN was not
    # it. THE PLAIN DIRECTIONAL MOVE -- the button he presses most -- still used
    # r*0.6+0.45, AND ITS MESSAGE IS LITERALLY "a pillar is there". He is
    # quoting the game back at me. Same fix, same rule: a rock blocks the ground
    # it covers, not a 1.1-tile halo around a float that drifts off the grid.
    old = """  if((G.pillars||[]).some(P=>{ const q=pXY(P); return Math.hypot(q[0]-sx,q[1]-sy)<P.r*0.6+0.45 || (_sprinting&&Math.hypot(q[0]-v[0],q[1]-v[1])<P.r*0.6+0.45); })){"""
    new = """  /* V147: THIS is the invisible pillar he kept hitting -- the plain move, the
     button he presses most, blocking with a halo up to 1.1 tiles wide around a
     rock drawn at 0.45, and saying "a pillar is there" when there visibly is
     not. A rock blocks the ground it covers. */
  if((G.pillars||[]).some(P=>{ const q=pXY(P); const _rr=Math.max(0.5,P.r||0.5); return Math.hypot(q[0]-sx,q[1]-sy)<_rr || (_sprinting&&Math.hypot(q[0]-v[0],q[1]-v[1])<_rr); })){"""
    js = subN(js, old, new)

    old = """  if((G.pillars||[]).some(P=>{ const q=pXY(P); return Math.hypot(q[0]-sx,q[1]-sy)<P.r*0.6+0.35 || Math.hypot(q[0]-v[0],q[1]-v[1])<P.r*0.6+0.35; })){ setRead('BLOCKED','a pillar is in the dash path','#8a7d66');"""
    new = """  if((G.pillars||[]).some(P=>{ const q=pXY(P); const _rr=Math.max(0.5,P.r||0.5); return Math.hypot(q[0]-sx,q[1]-sy)<_rr || Math.hypot(q[0]-v[0],q[1]-v[1])<_rr; })){ setRead('BLOCKED','a pillar is in the dash path','#8a7d66');   /* V147: same honest radius as every other mover */"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v147: the button and the board stop lying -- %d chars' % len(js))


if __name__ == '__main__':
    main()
