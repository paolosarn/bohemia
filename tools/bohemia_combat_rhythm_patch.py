#!/usr/bin/env python3
"""BOHEMIA - COMBAT v69: MAKE THE BEAT PERCEIVABLE (Paolo 7/26/26).

Paolo, after v68: "I couldn't really tell a difference. It didn't really feel
super good. How can we do better to make this feel like a rhythm game?"

He is right and the diagnosis is not a timing bug this time -- v68's math is
correct and gated. The problem is that NOTHING ON SCREEN OR IN HIS EARS TOLD HIM
SO. A rhythm game is not "the events are on the grid". A rhythm game is four
things, and the dial had none of them:

  1. YOU SEE THE BEAT COMING. Every rhythm game is anticipation, not reaction:
     an approach circle, a falling note, a runway. The dial had a needle
     sweeping with zero indication of WHEN the moment was. You cannot play to a
     beat you cannot see arriving -- you can only react to one that already
     happened, which feels like luck.
  2. YOU ARE JUDGED, BY NAME AND BY NUMBER. PERFECT / EARLY 80ms / LATE 120ms.
     Without an error readout a player can never learn the timing, so it never
     starts to feel good, and cannot tell a fixed build from a broken one --
     which is exactly what happened here.
  3. YOU HEAR YOURSELF PLAYING THE SONG. In a rhythm game your input MAKES
     music. The dial's shot was a dull saw crack that sat outside the track.
  4. IT IS TRUE ON YOUR DEVICE. Phone audio output latency runs 40-300ms and
     every real rhythm game ships a calibration screen. Uncalibrated, "on the
     beat" can be a third of a beat wrong for that specific phone + headphones,
     which would make a perfectly correct build feel like nothing.

THIS PATCH, in felt-impact order:

  A. THE APPROACH RING. A ring collapses onto the dial across each beat and
     snaps at the hit; beat one (the hero beat) lands fatter and brighter. Now
     the beat is visible BEFORE it happens, which is the whole game.
  B. THE COUNT you can hear: the metronome tick is audible over the track, and
     beat one gets its own higher hero click.
  C. TIMING JUDGMENT. Your PRESS is graded (the permission gate still grants
     the shot on the beat -- we judge when you ASKED, not when it fired, or the
     grade would always read PERFECT and teach nothing): PERFECT inside 55ms,
     then EARLY/LATE with the real number.
  D. THE SHOT IS AN INSTRUMENT. An on-beat press fires a stab in the song's own
     key -- root+fifth+octave on a PERFECT, root alone on a near miss, nothing
     extra when you are off the grid. You hear yourself playing the track.
  E. SYNC CALIBRATION. A SYNC button in settings runs the standard tap-along
     calibration (8 clicks, median offset, thrown out if the taps are noise) and
     stores a per-device offset the whole clock rides on.

REUSE CHECK: no new graphic assets are cooked (the ring is drawn from the dial's
own geometry and existing palette tokens; the judgment reuses the shipped
showVerd rail; the stab reuses the song's own root/scale through the existing
tone()/noteHz()).

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_rhythm_patch.py
Gate:  node gates/combat_lab_gate.js   (section 9 executes the grading + offset)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V69 THE BEAT YOU CAN FEEL'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # =======================================================================
    # E. THE PER-DEVICE OFFSET, first, because everything else rides on it
    # =======================================================================
    demo = sub1(demo,
        """function audioMs(){
  if(!AC||!_seq.on||!_seq.t0)return null;
  const lat=((AC.outputLatency||AC.baseLatency||0)||0);
  const t=AC.currentTime-lat-_seq.t0;
  return t>0?t*1000:0; }""",
        """/* ===== V69 THE BEAT YOU CAN FEEL ===================================
   Paolo: "I couldn't really tell a difference... how can we do better to make
   this feel like a rhythm game?" The v68 math was right and gated; nothing on
   screen or in his ears ever told him so. A rhythm game is anticipation you can
   SEE, a grade you can READ, a sound you MAKE, and a clock calibrated to YOUR
   phone. All four land here. */
function audioMs(){
  if(!AC||!_seq.on||!_seq.t0)return null;
  const lat=((AC.outputLatency||AC.baseLatency||0)||0);
  const t=AC.currentTime-lat-_seq.t0;
  /* V69 SYNC: the per-device offset every real rhythm game calibrates for.
     Phone output latency runs 40-300ms; uncalibrated, a perfectly correct build
     can feel a third of a beat off and read as "no difference". */
  return (t>0?t*1000:0)+(G.audioOffset||0); }""",
        'audio offset')

    # =======================================================================
    # A. THE APPROACH RING: see the beat BEFORE it lands
    # =======================================================================
    demo = sub1(demo,
        "  // ---- GHOST FAN (BOARD BODY V11): faint echoes of the ARM sweeping the wedge ----",
        """  /* ---- V69 THE APPROACH RING -------------------------------------------
     The one thing the dial never had: the beat ARRIVING. A ring collapses onto
     the dial rim across each beat and snaps at the hit, so you play AHEAD of
     the moment instead of reacting after it. Beat one -- the hero beat, the one
     the drums double -- comes in fatter, brighter and from further out, so the
     bar reads at a glance. This is the anticipation every rhythm game is built
     on, and its absence is why "on the beat" was invisible. */
  { const _b=beatNow(), _f=_b-Math.floor(_b), _hero=(Math.floor(_b)%4===3);   /* the beat ARRIVING next is the hero when we are in bar-beat 4 */
    const _far=_hero?1.85:1.45, _near=0.99;
    const _r=RAD*(_far-(_far-_near)*_f);
    const _a=(_hero?0.42:0.24)*(0.35+0.65*_f);
    ctx.save();
    ctx.strokeStyle=_hero?'rgba(232,200,120,'+_a+')':'rgba(200,208,220,'+_a+')';
    ctx.lineWidth=(_hero?3.4:2.0)*S;
    ctx.beginPath(); ctx.arc(cx,cy,Math.max(4,_r),0,Math.PI*2); ctx.stroke();
    /* the SNAP: a bright flash sitting on the rim for the first sliver of the beat */
    const _snap=Math.max(0,1-_f*7);
    if(_snap>0){ ctx.strokeStyle=(Math.floor(_b)%4===0?'rgba(255,226,150,':'rgba(230,238,250,')+(_snap*0.85)+')';
      ctx.lineWidth=(Math.floor(_b)%4===0?5.0:3.0)*S;
      ctx.beginPath(); ctx.arc(cx,cy,RAD*_near,0,Math.PI*2); ctx.stroke(); }
    ctx.restore(); }
  // ---- GHOST FAN (BOARD BODY V11): faint echoes of the ARM sweeping the wedge ----""",
        'approach ring')

    # =======================================================================
    # B. A METRONOME YOU CAN ACTUALLY HEAR, WITH A HERO CLICK ON ONE
    # =======================================================================
    demo = sub1(demo,
        "function sndBeat(){ tone(415,0.035,0.022,'square'); }                          // soft tick on every beat",
        """function sndBeat(){ tone(415,0.035,0.055,'square'); }                          // V69: audible OVER the track, not under it
function sndHeroTick(){ tone(830,0.045,0.075,'square'); tone(415,0.05,0.035,'triangle'); }   /* V69: beat one has its own voice, so the bar reads by ear */""",
        'metronome volume')

    demo = sub1(demo,
        "    _beatPulse=1; if(G.sound!==false) sndBeat(); }",
        "    _beatPulse=1; if(G.sound!==false){ if(Math.floor(beatNow())%4===0)sndHeroTick(); else sndBeat(); } }   /* V69: you can hear WHICH beat it is */",
        'hero tick')

    # =======================================================================
    # C+D. THE GRADE AND THE INSTRUMENT
    # =======================================================================
    demo = sub1(demo,
        "const BEAT_GRACE=0.24;                        /* beats of look-back: you were on it */",
        """const BEAT_GRACE=0.24;                        /* beats of look-back: you were on it */
const PERFECT_MS=55, GOOD_MS=110;             /* V69: the grade bands, in real milliseconds */
/* V69 THE GRADE. Signed distance from the press to the nearest beat, in ms:
   negative = you were EARLY (the beat had not landed yet), positive = LATE.
   We grade the PRESS, never the granted shot -- the permission gate fires on
   the beat by design, so grading the shot would print PERFECT every time and
   teach him nothing. */
function beatErrMs(b){ const f=b-Math.floor(b); return (f<0.5?f:f-1)*(60000/120); }
function gradeOf(ms){ const a=Math.abs(ms);
  return a<=PERFECT_MS?'PERFECT':(a<=GOOD_MS?'GOOD':(ms<0?'EARLY':'LATE')); }
/* V69 THE SHOT IS AN INSTRUMENT. On the grid, your trigger plays a stab in the
   SONG'S OWN key -- root+fifth+octave when you nail it, the root alone when you
   are close, nothing extra when you are off the beat. That is the difference
   between a game with music and a rhythm game: you hear yourself playing. */
function sndOnBeatStab(grade){
  if(!AC)return; try{
    const f=(typeof owSong==='function')?owSong():FAC(); if(!f)return;
    const semi=(f.root-55)+((f.scale&&f.scale[0])||0)+12, t=AC.currentTime;
    if(grade==='PERFECT'){ [0,7,12].forEach((iv,i)=>tone(noteHz(semi+iv),0.13,0.055-i*0.012,'triangle',t+i*0.018)); }
    else if(grade==='GOOD'){ tone(noteHz(semi),0.10,0.040,'triangle',t); }
  }catch(_e){} }""",
        'grade + stab')

    demo = sub1(demo,
        "  G._fireReq={at:Math.ceil(beatNow()),relGreed:!!G._relGreed};",
        "  G._pressBeat=beatNow();   /* V69: the GRADE is measured here, on the press */\n  G._fireReq={at:Math.ceil(beatNow()),relGreed:!!G._relGreed};",
        'press beat on hold')

    demo = sub1(demo,
        "  if(beatsToGrant()<=0)return fireNow();      /* you were on the beat */",
        "  G._pressBeat=beatNow();   /* V69: graded on the press, always */\n  if(beatsToGrant()<=0)return fireNow();      /* you were on the beat */",
        'press beat immediate')

    demo = sub1(demo,
        """function fireNow(){
  if(G._fireReq&&G._fireReq.relGreed)G._relGreed=true;
  if(G.ks||G.inc||G.phase!=='aim'||G.over)return;   /* cutscene law: the volley finishes before your trigger works */""",
        """function fireNow(){
  if(G._fireReq&&G._fireReq.relGreed)G._relGreed=true;
  if(G.ks||G.inc||G.phase!=='aim'||G.over)return;   /* cutscene law: the volley finishes before your trigger works */
  /* V69 GRADE THE PRESS, out loud, with the real number. A rhythm game that
     never tells you HOW WRONG you were cannot be learned, and cannot be told
     apart from a broken one -- which is exactly what happened on v68. */
  { const _pb=(G._pressBeat!=null)?G._pressBeat:beatNow(); G._pressBeat=null;
    const _ms=beatErrMs(_pb), _gr=gradeOf(_ms);
    G._lastGrade={grade:_gr,ms:Math.round(_ms)};
    (G._grades=G._grades||[]).push(G._lastGrade); if(G._grades.length>24)G._grades.shift();
    try{ showVerd(_gr==='PERFECT'?'PERFECT':(_gr==='GOOD'?'GOOD':(_gr+' '+Math.abs(Math.round(_ms))+'ms')),
      _gr==='PERFECT'?'#8fe89a':(_gr==='GOOD'?'#e8c88a':'#8a7d66')); }catch(_e){}
    try{ sndOnBeatStab(_gr); }catch(_e){} }""",
        'grade on fire')

    # =======================================================================
    # E2. THE CALIBRATION ITSELF
    # =======================================================================
    demo = sub1(demo,
        "function updStam(){ const s=D('stampips'); if(!s)return;",
        """/* ===== V69 SYNC CALIBRATION ==========================================
   The standard tap-along: we click on the beat, he taps with it, we take the
   MEDIAN of the taps (median, not mean, so one fumbled tap cannot poison it)
   and shift the whole clock by it. If the spread is wider than a third of a
   beat the taps were noise and we refuse the result rather than store garbage. */
function syncLabel(){ const b=D('synccal'); if(!b)return;
  b.textContent=G._cal?('TAP THE BEAT  '+(G._cal.taps.length)+'/8'):('SYNC: '+((G.audioOffset||0)>0?'+':'')+Math.round(G.audioOffset||0)+'ms'); }
function calStart(){
  if(G._cal){ calCancel(); return; }
  try{ audio(); }catch(_e){}
  G._cal={taps:[]};
  if(!_seq.on)try{startFactionLoop();}catch(_e){}
  G._calTimer=setInterval(()=>{ if(!G._cal){clearInterval(G._calTimer);G._calTimer=null;return;}
    const b=beatNow(), i=Math.floor(b);
    if(i!==G._cal.last){ G._cal.last=i; try{sndHeroTick();}catch(_e){} } },12);
  setRead('CALIBRATE SYNC','tap the button ON each click, 8 times','#8fd0e8'); syncLabel(); }
function calCancel(){ G._cal=null; if(G._calTimer){clearInterval(G._calTimer);G._calTimer=null;} syncLabel(); }
function calTap(){
  if(!G._cal)return false;
  G._cal.taps.push(beatErrMs(beatNow()));
  syncLabel();
  if(G._cal.taps.length>=8){
    const t=G._cal.taps.slice(2).sort((a,b)=>a-b);   /* first two taps are always garbage */
    const med=t[Math.floor(t.length/2)];
    const spread=t[t.length-1]-t[0];
    calCancel();
    if(spread>170){ setRead('TAPS TOO LOOSE','nothing changed — try again on the click','#e8593a'); }
    else { G.audioOffset=Math.round((G.audioOffset||0)-med);
      setRead('SYNC SET',((G.audioOffset>0?'+':'')+G.audioOffset)+'ms — the beat is now yours','#8fe89a'); }
    syncLabel(); }
  return true; }
function updStam(){ const s=D('stampips'); if(!s)return;""",
        'calibration core')

    demo = sub1(demo,
        """  const cs=D('chainskill'); if(cs)cs.addEventListener('click',()=>{ G.chainSkill=((G.chainSkill||2)%8)+1; cs.textContent='KILLSHOTS/TURN: '+G.chainSkill; });   /* V53: default 2 */""",
        """  const cs=D('chainskill'); if(cs)cs.addEventListener('click',()=>{ G.chainSkill=((G.chainSkill||2)%8)+1; cs.textContent='KILLSHOTS/TURN: '+G.chainSkill; });   /* V53: default 2 */
  const sc=D('synccal'); if(sc)sc.addEventListener('click',()=>{ if(!calTap())calStart(); });   /* V69: same button starts it and takes the taps */
  syncLabel();""",
        'calibration wiring')

    demo = sub1(demo,
        '<button id="chainskill" style="border-color:#8fe89a;color:#cfe8c0">KILLSHOTS/TURN: 2</button>',
        '<button id="chainskill" style="border-color:#8fe89a;color:#cfe8c0">KILLSHOTS/TURN: 2</button>'
        '<button id="synccal" style="border-color:#5a7a8a;color:#8fd0e8">SYNC: 0ms</button>',
        'calibration button')


    # -----------------------------------------------------------------------
    # C2. THE GRADE HAS TO SURVIVE. showVerd is stomped by the hit verdict a
    #     beat later, so the timing grade would flash and vanish before he ever
    #     read it -- which is the same failure as v68: a fix he cannot perceive.
    #     It now lives on its own persistent strip under the dial readout, with
    #     a running PERFECT count so a session has a score to chase.
    # -----------------------------------------------------------------------
    demo = sub1(demo,
        '''  <div id="patlbl2" style="font-size:10px;color:#8a7d66;min-height:12px;letter-spacing:1px;"></div>''',
        '''  <div id="patlbl2" style="font-size:10px;color:#8a7d66;min-height:12px;letter-spacing:1px;"></div>
  <!-- V69: the timing grade, persistent. A grade that vanishes teaches nothing. -->
  <div id="timing" style="font-size:11px;min-height:14px;letter-spacing:2px;font-weight:700;color:#8a7d66;"></div>''',
        'timing strip markup')

    demo = sub1(demo,
        "    try{ sndOnBeatStab(_gr); }catch(_e){} }",
        """    try{ sndOnBeatStab(_gr); }catch(_e){}
    try{ if(_gr==='PERFECT')G._perfects=(G._perfects||0)+1; updTiming(); }catch(_e){} }""",
        'timing strip update call')

    demo = sub1(demo,
        "function updStam(){ const s=D('stampips'); if(!s)return;",
        """/* V69 THE TIMING STRIP: last grade, signed error, and the running PERFECT
   count. It stays until the next shot, unlike the verdict flash, which the hit
   result overwrites within the beat. */
function updTiming(){ const t=D('timing'); if(!t)return;
  const g=G._lastGrade;
  if(!g){ t.textContent=''; return; }
  const col=g.grade==='PERFECT'?'#8fe89a':(g.grade==='GOOD'?'#e8c88a':'#e8593a');
  const sign=g.ms>0?'+':'';
  t.style.color=col;
  t.textContent=g.grade+'  '+sign+g.ms+'ms'+((G._perfects||0)?('   \u00b7   '+G._perfects+' PERFECT'):''); }
function updStam(){ const s=D('stampips'); if(!s)return;""",
        'timing strip fn')

    # a fresh fight keeps your calibration but drops the grades
    demo = sub1(demo,
        "  G.stam=STAM_MAX; G.handPeek=false; G.dashArm=false; G.sprintArm=false; G.suppCd=0; G._fireReq=null; G._oneStreak=0;",
        "  G.stam=STAM_MAX; G.handPeek=false; G.dashArm=false; G.sprintArm=false; G.suppCd=0; G._fireReq=null; G._grades=[]; G._lastGrade=null; G._pressBeat=null; G._perfects=0; G._oneStreak=0;",
        'fresh fight grades')

    return demo


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  demo: re-embedded (%d bytes, +%d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
