#!/usr/bin/env python3
"""V143 RUN RUNS. IN THE DIRECTION YOU TAPPED.

Paolo 8/12: "I NEED YOU TO FIX THE RUN BUTTON BRO BECAUSE IT KEEPS TRYING TO
SNAP ME TO COVER LIKE 5 TILES AWAY AN IT PREVENTS ME FROM RUNNING IN A CERTAIN
DIRECTION AND ITS SO CONFUSING BRO"

--------------------------------------------------------------------------
HE IS DESCRIBING EXACTLY WHAT I BUILT, AND IT WAS THE WRONG VERB
--------------------------------------------------------------------------
V122's RUN has ONE behaviour: find a pillar inside a 45-degree wedge of the
direction you tapped, within SIX tiles, and take you ALL THE WAY TO IT.

  * THAT IS THE SNAP. You tap a direction meaning "go that way" and you get
    hauled five tiles to a rock you never aimed at, because the rock happened to
    be inside the wedge. The DIRECTION was treated as a hint for choosing a
    destination instead of as the thing he asked for.
  * AND IT IS WHY DIRECTIONS GO DEAD. If cover is found down that line, every
    remaining path is a REFUSAL: too close gives ALREADY ON IT, a second pillar
    near the stopping point gives BLOCKED, a body near it gives SOMEBODY IS
    THERE. All three do nothing at all. So a direction with a rock in it can be
    completely unusable while the open ground right next to it is fine, and
    nothing on screen explains why.

I wrote a COVER-SEEKING verb and put it on a button labelled RUN. He has been
pressing a movement button that does not move him.

--------------------------------------------------------------------------
THE RULE: THE DIRECTION IS THE INSTRUCTION, NOT A HINT
--------------------------------------------------------------------------
RUN goes the way you tapped, as far as it can, and stops where it must.

  * it walks the line tile by tile and stops SHORT of the first thing in the
    way, instead of hunting for a destination
  * it NEVER refuses because of what is down that line. The only refusal left is
    that the very first tile is blocked -- and then it says so, because that is
    a real fact about the world and not a rule he cannot see
  * it never moves you to something you did not aim at

WHAT SURVIVES FROM V122, BECAUSE IT WAS RIGHT: the VAULT. If the thing directly
in front of you is duck-height, going OVER it is what running that way means,
and he liked that. Kept, and now it is the only special case instead of one of
four.

HIS TWO-PIP NUMBER SURVIVES TOO, HONESTLY. RUN_COVER_COST=2 was his ruling on
"running to cover", and cover-running is gone -- so the cost rides DISTANCE
instead, which is the same idea without the snap: one tile is one pip, a real
run is two. Ending up behind cover is now a reward for aiming well, not a
teleport and not a surcharge.

REUSE CHECK: cooks NO graphic pixels. It reuses worldShift, pXY, spendMove,
runBreakLocks and the existing occupancy tests. No bank is opened because no art
is authored.

TASTE CHECK: authors no art. The taste rule is the oldest one about controls: a
button must do the thing it is named. A movement control that sometimes moves
you somewhere else and sometimes does nothing is worse than no control, because
he has to build a model of when it will betray him.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V143 RUN RUNS'
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
        print('v143 already in; nothing to do')
        return

    # runTargetIn IS THE COVER-SEEKER ITSELF. It lives above doRunMove, so a
    # replacement that started at doRunMove would leave the rejected behaviour
    # sitting in the file as dead code. Dead code that implements a thing he
    # threw out is a thing the next session can accidentally call.
    start = js.index('function runTargetIn(d){')
    end = js.index('function runBreakLocks(){')
    old_body = js[start:end]

    new_body = """/* ===== V143 RUN RUNS, IN THE DIRECTION YOU TAPPED =================
   Paolo 8/12: "IT KEEPS TRYING TO SNAP ME TO COVER LIKE 5 TILES AWAY AN IT
   PREVENTS ME FROM RUNNING IN A CERTAIN DIRECTION AND ITS SO CONFUSING"
   HE IS DESCRIBING EXACTLY WHAT I BUILT. V122's RUN had ONE behaviour: find a
   pillar inside a 45-degree wedge of the tapped direction, within SIX tiles,
   and take him ALL THE WAY TO IT. The direction was a HINT for picking a
   destination instead of the instruction he actually gave.
   AND IT IS WHY DIRECTIONS WENT DEAD: once cover was found down a line, every
   other path was a REFUSAL -- ALREADY ON IT if it was close, BLOCKED if
   anything sat near the stopping point, SOMEBODY IS THERE if a body did. All
   three moved him nowhere, so a direction with a rock in it could be completely
   unusable while the open ground beside it was fine, and nothing said why.
   I wrote a COVER-SEEKING verb and put it on a button labelled RUN.
   THE DIRECTION IS THE INSTRUCTION NOW. He goes the way he tapped, as far as
   he can, stopping SHORT of the first thing in the way. The only refusal left
   is that the very first tile is blocked, which is a fact about the world he
   can see rather than a rule he cannot. */
const RUN_TILES=3;            /* how far a run carries you [DIAL] */
function runStops(d){
  /* walk the line and return how many tiles are actually free. No searching,
     no destination hunting -- just how far this direction goes. */
  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]; const v=DIRS[d];
  if(!v)return 0;
  let n=0;
  for(let k=1;k<=RUN_TILES;k++){
    const cx=v[0]*k, cy=v[1]*k;
    if((G.pillars||[]).some(Q=>{ const q=pXY(Q);
      return Math.hypot(q[0]-cx,q[1]-cy)<Q.r*0.6+0.45; }))break;
    if((G.e||[]).some(o=>{ if(o.dead||(o.lvl|0)!==myLvl())return false; const q=pXY(o);
      return Math.abs(q[0]-cx)<0.7&&Math.abs(q[1]-cy)<0.7; }))break;   /* OCCUPANCY LAW */
    n=k; }
  return n; }
/* is the thing DIRECTLY in front of me duck-height: the one case where running
   that way means going OVER. This was right in V122 and he liked it, so it is
   kept -- and it is the only special case now instead of one of four. */
function runVaultTarget(d){
  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]; const v=DIRS[d];
  if(!v)return null;
  for(const P of (G.pillars||[])){ if(P.tall)continue;
    const q=pXY(P);
    if(Math.hypot(q[0]-v[0],q[1]-v[1])<(P.r||0.5)*0.6+0.45)return P; }
  return null; }
function doRun(){ if(G.phase!=='cover'||G.over||G.inc)return;
  G.runArm=!G.runArm; if(G.runArm){ G.sprintArm=false; G.dashArm=false; }   /* V67: never two armed moves */
  updRunBtn(); updMoveMode();
  setRead(G.runArm?'RUN ARMED':'RUN OFF',
    G.runArm?'tap a direction \u2014 you go that way, as far as it is clear':'run disarmed','#c0d0e8'); }
function updRunBtn(){ const b=D('runbtn'); if(!b)return;
  b.style.borderColor=G.runArm?'#c8b892':'#3a3226';
  b.style.color=G.runArm?'#e7d8bb':'#8a7a5a';
  b.style.background=G.runArm?'rgba(58,48,32,0.92)':'rgba(20,16,10,0.72)'; }
function doRunMove(d){ if(G.phase!=='cover'||G.over)return;
  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]; const v=DIRS[d];
  if(!v)return;
  /* OVER IT: duck-height thing right in front, go over. */
  const VP=runVaultTarget(d);
  if(VP){ const sx=v[0]*2, sy=v[1]*2;
    if((G.e||[]).some(o=>{ if(o.dead||(o.lvl|0)!==myLvl())return false; const w=pXY(o);
        return Math.abs(w[0]-sx)<0.7&&Math.abs(w[1]-sy)<0.7; })){
      setRead('BLOCKED','low cover that way and somebody on the far side','#8a7d66'); return; }
    if((G.pillars||[]).some(Q=>{ const w=pXY(Q);
        return Math.hypot(w[0]-sx,w[1]-sy)<Q.r*0.6+0.45; })){
      setRead('BLOCKED','low cover that way and no room on the far side','#8a7d66'); return; }
    if(!spendMove(1)){ setRead('NO STAMINA','the vault needs one pip','#8a7d66'); return; }
    worldShift(sx,sy); updateGeomCover(); G._stepAt=performance.now(); G.steady=0;
    runBreakLocks(); setRead('OVER IT','vaulted the low cover \\u2014 new angle, 1 pip, no turn spent','#c0d0e8');
    renderBoard(); updGap(); return; }
  /* THE RUN ITSELF: as far as this direction goes. */
  const n=runStops(d);
  if(n===0){ setRead('BLOCKED','something is right in front of you that way','#8a7d66'); return; }
  /* HIS TWO-PIP NUMBER, RIDING DISTANCE INSTEAD OF COVER. RUN_COVER_COST was
     his ruling on "running to cover", and cover-running is gone -- so the same
     idea lands on how far you went, which is what it was really about. */
  const cost=(n>=2)?RUN_COVER_COST:1;
  if(!spendMove(cost)){ setRead('NO STAMINA','that run needs '+cost+' pip'+(cost>1?'s':''),'#8a7d66'); return; }
  worldShift(v[0]*n, v[1]*n); updateGeomCover(); G._stepAt=performance.now(); G.steady=0;
  const broke=runBreakLocks();
  /* ending behind cover is a REWARD for aiming well now, never a teleport */
  const onCov=coveredFromAnyone();
  setRead('RUN',
    (broke?broke+' red line'+(broke>1?'s':'')+' broken \\u2014 ':'')+
    n+' tile'+(n>1?'s':'')+', '+cost+' pip'+(cost>1?'s':'')+', no turn spent'+
    (onCov?' \\u2014 and you landed on cover':''),'#c0d0e8');
  renderBoard(); updGap(); }
"""
    js = js[:start] + new_body + js[end:]

    # the armed hint has to describe the verb it actually is now
    old = """    const on=G.runArm?'RUN \\u00b7 TAP A DIRECTION \\u00b7 COVER COSTS 2 PIPS'"""
    new = """    const on=G.runArm?'RUN \\u00b7 TAP A DIRECTION \\u00b7 UP TO 3 TILES'"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v143: RUN runs where you point it -- %d chars' % len(js))


if __name__ == '__main__':
    main()
