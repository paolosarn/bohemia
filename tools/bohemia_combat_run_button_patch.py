#!/usr/bin/env python3
"""V122 ONE RUN BUTTON, ON THE THUMB, AND DASH AND VAULT COME OFF THE MENU.

Paolo, T4: "I want to remove some of the things off the top menu and make them
more intuitive and awesome with the UI of action movement... for the run which
you're gonna smart combine with the dash involvement maybe like if you run
towards a Cover it takes two stamina instead of one, and then it will
automatically do the move... first off the top menu removing the dash and vault
button definitely I never use them and I think I'd rather incorporate them in a
standardized run button next to the actual action in movement buttons actually
on screen."

HE IS RIGHT THAT HE NEVER USES THEM AND THE REASON IS IN THE CODE.

DASH and VAULT were buttons in a fourteen-button row at the TOP of the screen,
and the thing they do happens at the BOTTOM of the screen, on the ring, with
his thumb. DASH does not even act on its own: it ARMS, and then you have to
travel back down to the ring to say which way. Two taps at opposite ends of a
phone for one move. VAULT is worse -- it is a button that does nothing at all
unless you are already standing next to a specific kind of pillar, so most of
the time he tapped it he got a refusal.

Nobody uses a verb that lives on the other side of the screen from the hand
that performs it.

--------------------------------------------------------------------------
RUN IS ONE VERB THAT KNOWS WHAT YOU MEANT
--------------------------------------------------------------------------
It sits in the thumb cluster, on the ring, where the movement is. Tap RUN, tap
a direction, and it looks down that line and does the right thing:

  THERE IS COVER OUT THERE      you go ALL THE WAY TO IT, automatically, and
                                it costs 2 pips. His words exactly: "if you run
                                towards a Cover it takes two stamina instead of
                                one, and then it will automatically do the
                                move." You do not walk a tile at a time toward
                                a wall you can already see.
  IT IS LOW AND YOU ARE ON IT   you go OVER it. That is VAULT, with no button
                                and no refusal -- the only time vault was ever
                                the right answer is exactly this, so it stops
                                being a thing to remember and becomes a thing
                                that happens.
  NOTHING OUT THERE             you run one tile for 1 pip. That is the 8/1
                                sprint ruling, unchanged.

And it keeps DASH's real payload: the run is FREE (your turn does not end,
nobody shoots) and arriving somewhere new BREAKS THEIR RED LINES. Dash's
distinguishing feature was never "two tiles" -- it was that the fight loses
track of you. Running into cover does that better and for the same 2 pips.

WHAT IS DELIBERATELY NOT DONE: doDash, doDashMove and doVault are NOT deleted.
GRAVEYARD IS FINAL cuts both ways -- nothing dies without his word, and he said
remove the BUTTONS. The functions stay callable, unwired, so if he wants either
verb back it is a one-line restore instead of a rebuild.

THE GRENADE COMES DOWN TOO. "I was thinking I want a grenade button next to the
action and directional movement buttons as well." Same reason, same fix: it is
the same button, in the thumb cluster, calling the same doThrow. The top-row
GRENADE stays for now because it is the only one a desktop cursor can reach
comfortably; the mini-game he floated ("tossing a grenade successfully should
probably have its own mini game too potentially") is NOT invented here -- he
said "potentially" and that is not a ruling.

REUSE CHECK: cooks NO graphic pixels. The buttons are CSS-styled DOM built in
the same buildMoveRing factory that already makes the eight direction pips, in
the same colours. No bank is opened because no art is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V122 ONE RUN BUTTON'


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
        print('v122 already in; nothing to do')
        return

    # ---- 1. THE TOP ROW LOSES DASH AND VAULT ---------------------------
    old = """    <button id="dashbtn" class="cbtn" style="border-color:#8fb0e8;color:#c0d0e8">DASH</button>
    <button id="vaultbtn" class="cbtn" style="border-color:#8fb0e8;color:#c0d0e8">VAULT</button>
"""
    new = """    <!-- V122: DASH and VAULT are OFF the top menu (Paolo: "I never use them").
         They lived at the TOP of the screen and acted at the BOTTOM, on the
         ring, with his thumb -- DASH did not even act on its own, it ARMED and
         then made him travel back down to say which way. Both are folded into
         the RUN button in the thumb cluster. The FUNCTIONS are not deleted:
         nothing dies without his word, so doDash/doVault stay callable. -->
"""
    s = subN(s, old, new)

    # the listeners for buttons that no longer exist
    old = """  const _d=D('dashbtn'); if(_d)_d.addEventListener('click',doDash);
  const _v=D('vaultbtn'); if(_v)_v.addEventListener('click',doVault); }"""
    new = """  /* V122: no dashbtn/vaultbtn to bind -- the verbs live on RUN now. The
     guards were already null-safe, so this is the wire coming out, not a
     behaviour change. doDash/doVault remain defined and callable. */ }"""
    s = subN(s, old, new)

    # ---- 2. THE RUN VERB ------------------------------------------------
    old = """function doVault(){ if(G.phase!=='cover'||G.over||G.inc)return;"""
    new = """/* ===== V122 ONE RUN BUTTON, AND IT KNOWS WHAT YOU MEANT ============
   Paolo T4: "for the run which you're gonna smart combine with the dash
   involvement maybe like if you run towards a Cover it takes two stamina
   instead of one, and then it will automatically do the move."
   ONE VERB, THREE OUTCOMES, DECIDED BY WHAT IS ACTUALLY DOWN THAT LINE:
     cover out there   -> you go ALL THE WAY TO IT, 2 pips, automatically
     low cover on you  -> you go OVER it (that is VAULT, with no button and no
                          refusal -- the only time vault was ever right)
     nothing out there -> one tile, 1 pip (the 8/1 sprint ruling, unchanged)
   It keeps DASH's real payload: FREE (no turn end, nobody shoots) and arriving
   somewhere new BREAKS THEIR RED LINES. Dash's point was never "two tiles", it
   was that the fight loses track of you. */
const RUN_REACH=6;            /* how far down the line RUN will look for cover [DIAL] */
const RUN_COVER_COST=2;       /* his number: running to cover costs two pips [DIAL] */
function runTargetIn(d){
  /* the nearest pillar whose bearing is inside the 45-degree wedge of the
     direction he tapped, within reach. Nearest wins, so RUN never sails past
     the wall right in front of him to a prettier one further out. */
  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]; const v=DIRS[d];
  if(!v)return null;
  const want=Math.atan2(v[1],v[0]); let best=null;
  for(const P of (G.pillars||[])){
    const L=P.edist||0; if(L<0.5||L>RUN_REACH)continue;
    let diff=Math.abs(((P.ea-want+Math.PI*3)%(Math.PI*2))-Math.PI);
    if(diff>Math.PI/4)continue;                       /* not down that line */
    if(!best||L<best.edist)best=P; }
  return best; }
function doRun(){ if(G.phase!=='cover'||G.over||G.inc)return;
  G.runArm=!G.runArm; if(G.runArm){ G.sprintArm=false; G.dashArm=false; }   /* V67: never two armed moves */
  updRunBtn(); updMoveMode();
  setRead(G.runArm?'RUN ARMED':'RUN OFF',
    G.runArm?'tap a direction \\u2014 cover down that line and you go all the way to it':'run disarmed','#c0d0e8'); }
function updRunBtn(){ const b=D('runbtn'); if(!b)return;
  b.style.borderColor=G.runArm?'#c8b892':'#3a3226';
  b.style.color=G.runArm?'#e7d8bb':'#8a7a5a';
  b.style.background=G.runArm?'rgba(58,48,32,0.92)':'rgba(20,16,10,0.72)'; }
function doRunMove(d){ if(G.phase!=='cover'||G.over)return;
  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]; const v=DIRS[d];
  const P=runTargetIn(d);
  /* NOTHING DOWN THERE: one tile, one pip. The 8/1 ruling, untouched -- a run
     with no destination is just a step you took quickly. */
  if(!P){ const sx0=v[0], sy0=v[1];
    if((G.pillars||[]).some(Q=>{ const q=pXY(Q); return Math.hypot(q[0]-sx0,q[1]-sy0)<Q.r*0.6+0.45; })){
      setRead('BLOCKED','something is in the way','#8a7d66'); return; }
    if((G.e||[]).some(o=>{ if(o.dead||(o.lvl|0)!==myLvl())return false; const q=pXY(o);
        return Math.abs(q[0]-sx0)<0.7&&Math.abs(q[1]-sy0)<0.7; })){   /* OCCUPANCY LAW */
      setRead('SOMEBODY IS THERE','that tile is taken','#8a7d66'); return; }
    if(!spendMove(1)){ setRead('NO STAMINA','a run needs one pip','#8a7d66'); return; }
    worldShift(sx0,sy0); updateGeomCover(); G._stepAt=performance.now(); G.steady=0;
    runBreakLocks(); setRead('RUN','no cover down that line \\u2014 one tile, one pip, no turn spent','#c0d0e8');
    renderBoard(); updGap(); return; }
  const q=pXY(P), L=Math.max(0.001,P.edist), ux=q[0]/L, uy=q[1]/L;
  /* ON IT AND IT DUCKS: go OVER. This is VAULT, and it is the only case vault
     was ever the right answer, so it stops being a thing to remember. */
  if(L<=1.9&&!P.tall){
    let sx=Math.round(ux*2), sy=Math.round(uy*2);
    if(!sx&&!sy){ if(Math.abs(ux)>=Math.abs(uy))sx=ux>=0?2:-2; else sy=uy>=0?2:-2; }
    if((G.e||[]).some(o=>{ if(o.dead||(o.lvl|0)!==myLvl())return false; const w=pXY(o);
        return Math.abs(w[0]-sx)<0.7&&Math.abs(w[1]-sy)<0.7; })){   /* OCCUPANCY LAW: you do not land on a man */
      setRead('SOMEBODY IS THERE','somebody is on the far side of it','#8a7d66'); return; }
    if(!spendMove(1)){ setRead('NO STAMINA','the vault needs one pip','#8a7d66'); return; }
    worldShift(sx,sy); updateGeomCover(); G._stepAt=performance.now(); G.steady=0;
    runBreakLocks(); setRead('OVER IT','vaulted the low cover \\u2014 new angle, 1 pip, no turn spent','#c0d0e8');
    renderBoard(); updGap(); return; }
  /* COVER OUT THERE: ALL THE WAY TO IT, TWO PIPS, AUTOMATICALLY. Stop on the
     near side of the piece, which is the side that is actually cover for you.
     EVERY CHECK HAPPENS BEFORE A SINGLE PIP IS SPENT. The first cut spent
     first and refunded on refusal, and I measured what that costs: a TALL
     pillar already one tile away gave stop=0, the no-move fallback pushed one
     tile FORWARD, and RUN walked me straight INSIDE a solid wall for 2 pips.
     That is an OCCUPANCY LAW break shipped by a convenience. */
  const stop=L-1;
  let sx=Math.round(ux*stop), sy=Math.round(uy*stop);
  if(stop<0.9||(!sx&&!sy)){   /* you are already against it; there is nowhere to run to */
    setRead('ALREADY ON IT','you are up against that cover \\u2014 nothing to run to','#8a7d66'); return; }
  if((G.pillars||[]).some(Q=>{ const w=pXY(Q);
      return Math.hypot(w[0]-sx,w[1]-sy)<Q.r*0.6+0.45; })){   /* never land inside anything solid */
    setRead('BLOCKED','something is in the way down that line','#8a7d66'); return; }
  if((G.e||[]).some(o=>{ if(o.dead||(o.lvl|0)!==myLvl())return false; const p=pXY(o);
      return Math.abs(p[0]-sx)<0.7&&Math.abs(p[1]-sy)<0.7; })){   /* OCCUPANCY LAW: one body per cell */
    setRead('SOMEBODY IS THERE','that spot is taken \\u2014 pick another line','#8a7d66'); return; }
  if(!spendMove(RUN_COVER_COST)){ setRead('NO STAMINA','running to cover costs two pips','#8a7d66'); return; }
  worldShift(sx,sy); updateGeomCover(); G._stepAt=performance.now(); G.steady=0;
  const broke=runBreakLocks();
  setRead('RUN TO COVER',
    (broke?broke+' red line'+(broke>1?'s':'')+' broken \\u2014 ':'')+'you are on the '+(P.tall?'wall':'low cover')+' \\u2014 2 pips, no turn spent','#c0d0e8');
  renderBoard(); updGap(); }
function runBreakLocks(){ let n=0;
  for(const e2 of (G.e||[])){ if(e2.dead||e2.melee)continue;
    if(myConcealAgainst(e2.ea,e2.edist,e2.lvl)){ if((e2.acq||0)>=1)n++; e2.acq=0; } }
  return n; }   /* V108: the bead is a LINE test */
function doVault(){ if(G.phase!=='cover'||G.over||G.inc)return;"""
    s = subN(s, old, new)

    # ---- 2b. RUN OBEYS THE V54 TOOLKIT RULE ----------------------------
    # doRun already refuses outside the cover phase, but a live-looking button
    # that does nothing is the exact complaint that got DASH and VAULT removed.
    old = """  for(const _id of ['suppressbtn','peekbtn','dashbtn','vaultbtn']){ const _b=D(_id); if(_b)_b.disabled=aim||G.over; }   /* V54: toolkit is cover-phase only */"""
    new = """  for(const _id of ['suppressbtn','peekbtn','runbtn','grenbtn2']){ const _b=D(_id); if(_b)_b.disabled=aim||G.over; }   /* V54: toolkit is cover-phase only. V122: dashbtn/vaultbtn are gone and RUN + the thumb grenade take their place in the rule -- a live-looking button that does nothing is the exact complaint that removed the other two. */"""
    s = subN(s, old, new)

    # ---- 3. the ring routes an armed run --------------------------------
    old = """function doMove(d){ if(G.inc)return; if(G.dashArm){ G.dashArm=false; const _b=D('dashbtn'); if(_b)_b.classList.remove('on'); return doDashMove(d); }   /* V56: an armed dash steers by the ring */"""
    new = """function doMove(d){ if(G.inc)return;
  /* V122: an armed RUN steers by the ring, same rail the dash used. It is
     checked first because it is now the only armed move with a button. */
  if(G.runArm){ G.runArm=false; updRunBtn(); updMoveMode(); return doRunMove(d); }
  if(G.dashArm){ G.dashArm=false; const _b=D('dashbtn'); if(_b)_b.classList.remove('on'); return doDashMove(d); }   /* V56: an armed dash steers by the ring */"""
    s = subN(s, old, new)

    # ---- 4. the label on the ring says RUN ------------------------------
    old = """    const on=G.sprintArm?'SPRINT \\u00b7 2 TILES \\u00b7 1 PIP \\u00b7 FREE MOVE':(G.dashArm?'DASH \\u00b7 2 TILES \\u00b7 2 PIPS \\u00b7 BREAKS LOCKS':'');"""
    new = """    const on=G.runArm?'RUN \\u00b7 TAP A DIRECTION \\u00b7 COVER COSTS 2 PIPS':(G.sprintArm?'SPRINT \\u00b7 2 TILES \\u00b7 1 PIP \\u00b7 FREE MOVE':(G.dashArm?'DASH \\u00b7 2 TILES \\u00b7 2 PIPS \\u00b7 BREAKS LOCKS':''));   /* V122 */"""
    s = subN(s, old, new)

    old = """    lbl.style.color=G.sprintArm?'#e8593a':'#c0d0e8'; } }"""
    new = """    lbl.style.color=G.runArm?'#c0d0e8':(G.sprintArm?'#e8593a':'#c0d0e8'); } }"""
    s = subN(s, old, new)

    # ---- 5. THE BUTTONS, IN THE THUMB CLUSTER ---------------------------
    old = """  /* V67: the armed move reads ON THE RING, where the tap happens. */
  const mm=document.createElement('div'); mm.id='movemode';"""
    new = """  /* ===== V122 THE VERBS LIVE WHERE THE THUMB IS =====================
     Paolo: "I'd rather incorporate them in a standardized run button next to
     the actual action in movement buttons actually on screen", and "I want a
     grenade button next to the action and directional movement buttons".
     Nobody uses a verb that lives on the other side of the screen from the
     hand that performs it.
     THE OFFSET IS MEASURED, NOT GUESSED. My first placement was left:-56px and
     I measured it on the real surface: RUN overlapped the W and NW pips and
     GREN overlapped W and SW, so two of his eight directions would have been
     covered by the new buttons. The pips sit at R=66, which puts the W pip's
     left edge 34px outside the wrap, so anything wider than that offset eats a
     direction. These clear it by 14px. */
  const mk=(id,txt,col,dy,fn)=>{
    const b=document.createElement('button'); b.id=id; b.textContent=txt;
    b.style.cssText='position:absolute;left:-100px;top:'+dy+'px;width:52px;height:34px;'+
      'border-radius:8px;border:1px solid #3a3226;background:rgba(20,16,10,0.72);color:'+col+';'+
      "font:bold 10px Space Grotesk,sans-serif;letter-spacing:1px;pointer-events:auto;cursor:pointer;padding:0;";
    b.addEventListener('click',ev=>{ev.stopPropagation();fn();});
    wrap.appendChild(b); return b; };
  mk('runbtn','RUN','#8a7a5a',6,()=>{ try{audio();}catch(_e){} doRun(); });
  mk('grenbtn2','GREN','#c8a23a',48,()=>{ try{audio();}catch(_e){} doThrow(); });
  /* V67: the armed move reads ON THE RING, where the tap happens. */
  const mm=document.createElement('div'); mm.id='movemode';"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v122: RUN and GREN on the thumb, DASH and VAULT off the menu (%d chars)' % len(s))


if __name__ == '__main__':
    main()
