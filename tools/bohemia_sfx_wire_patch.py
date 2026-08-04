#!/usr/bin/env python3
"""
BOHEMIA — THE APPROVED SOUNDS ACTUALLY PLAY (7/30/26, SOUNDS lane)

APPROVED-BUT-UNUSED IS A DEFECT. That is not my phrasing, it is the name of a
law this repo already enforces (gates/banks_used_gate.js) against art. Paolo
judged 60 sound effects on 7/30 and approved 38 of them across ten game moments.
Until this tool ran, every one of those thirty-eight was a number in a file and
the game was still silent. That is the defect.

WHAT ACTUALLY FIRES TODAY -- and this list is exact, because the first draft of
this docstring claimed six things and wired two. A tool that overstates itself is
a lie the next session inherits.
  FOOTSTEPS   on every committed step, chosen by THE TILE THE GAME ALREADY
              KNOWS -- the run's own tile names classify road / sidewalk /
              concrete / dirt / gravel, so the ground picks the sound. No new
              content, no guessing: asphalt on roadway and sidewalk, gravel on
              gravel and shoulder, dirt on everything else.
  SAVED       when the run records what you did (autoSave)
  UI TAP      every button, tab and option in the ALPHA's own chrome
  THE ENTRY POINT for everything else: window.playSFX(event, when). 'when' can
              be "beat", which schedules onto the next downbeat of the real song
              (the 120 BPM LAW), and the run can reach it by posting
              BOHEMIA_SFX.

WHAT IS BUILT BUT NOT YET TRIGGERED, stated plainly rather than implied:
  PICKUP, HIT, BLOCK, PHONE BUZZ. Their sounds are approved, banked and
  playable this second through playSFX -- what they lack is a moment to fire
  from. Loot has no pick-up event in the run yet, and hit/block live on the
  COMBAT surface, which is a separate lane's iframe. Those are wiring jobs on
  systems that are not this lane's to reach into, not missing audio.

WHAT IT DOES NOT WIRE: doors. door_open and door_shut have ZERO approved sounds
-- he killed all ten candidates -- so the game makes no door sound, on purpose,
until he rules on one. Wiring a door to a sound he rejected would be the exact
thing MECHANISM-MINE / CONTENTS-PAOLO'S forbids.

HE APPROVED SETS, NOT SINGLES, and that is the whole reason walking works. Five
dirt footsteps, five asphalt, five gravel: the player fires one of HIS approved
five each step, never the same one twice in a row. A single approved footstep
repeated at walking pace is a machine gun, which is why the pipeline always said
approve unlocks VOLUME. Nothing here picks a sound he did not pick; it picks
BETWEEN the ones he did.

ARCHITECTURE, and it follows from the law rather than from convenience: the run
is an iframe and has no AudioContext. ONE AUDIOCONTEXT, THE PARENT'S. So the run
does not play anything -- it POSTS the event name, and the parent plays it on the
MUSIC studio's own context and limiter, the same one the songs use. The run never
learns what a sound is; it only says what just happened.

REUSE CHECK: nothing fit and nothing needed to -- zero graphic pixels are cooked
here, so no banks/ art bank applies and none was opened. The bank it DOES open is
banks/BOHEMIA_SFX_APPROVED_7_30_26.json, Paolo's own thumbs, read in code and
turned into the play table. It reuses the MUSIC studio's AudioContext, master and
limiter (MUS.audio / MUS.AC / MUS.MAST), the existing runPost channel, and the
BOH_SFX synth. It creates no context, no bus and no second sound engine.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md sec 4 MUSIC): adds no voice and no
feedback path, so the screech rulings are untouched. The ruling it serves is the
120 BPM LAW: playSFX's `when="beat"` schedules onto the real song's next downbeat
rather than whenever the frame lands. That path is built and tested; the KILL is
not yet triggered from combat, so say "available" and not "in use" until it is.

Idempotent (markers SFX WIRE PARENT / SFX WIRE RUN). Patches the alpha and the
run's DEV SOURCE, then rebuilds the run.

  python3 tools/bohemia_sfx_wire_patch.py
"""
import json
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
RUN = 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'
BUILT = 'slices/BOHEMIA_RUN_CURRENT.html'
BANK = 'banks/BOHEMIA_SFX_APPROVED_7_30_26.json'
VERDICT = 'records/BOHEMIA_SFX_VERDICT_7_30_26.txt'

P_BEGIN = '<!-- BOHEMIA SFX WIRE PARENT (7/30/26) -->'
P_END = '<!-- /BOHEMIA SFX WIRE PARENT -->'


def parent_block(bank):
    return """
/* === SFX WIRE, PARENT SIDE (7/30/26) ====================================
   Paolo's 38 approved sounds, from his 7/30 thumbs. The table below is INDEXES
   into the shipped generator, not copied audio: candidate n of event e is
   BOH_SFX.cook(e,5)[n], which gates/sfx_render_gate.py fingerprints. So what
   plays is byte-for-byte the thing he heard when he thumbed it.
   Verdict: %s
   Bank:    %s
   ONE AUDIOCONTEXT: everything below plays on the MUSIC studio's context and
   its brickwall limiter. The run posts an event name; nothing else. */
(function(){
  'use strict';
  if(window.__SFX_WIRE)return; window.__SFX_WIRE=true;
  var APPROVED=%s;
  /* THE BOARD HAS TO KNOW WHICH MOMENTS ACTUALLY HAVE A SOUND (8/2), and it
     must read the SAME table playSFX reads. A second copy of his thumbs is a
     second thing that can be wrong. */
  try{ window.__SFX_APPROVED=APPROVED; }catch(_e){}
  var last={};                       /* per event: what played last, never twice */
  var SFX_COUNT=0;                   /* what the status line in the MUSIC tab reports */
  function pick(ev){
    var set=APPROVED[ev]; if(!set||!set.length)return null;   /* unjudged = silent */
    if(set.length===1)return set[0];
    var i, guard=0;
    do{ i=set[(Math.random()*set.length)|0]; }while(i===last[ev] && ++guard<8);
    last[ev]=i; return i;
  }
  var cache={};
  function vec(ev,i){
    var k=ev+'.'+i;
    if(!cache[k]){ try{ cache[k]=BOH_SFX.cook(ev,5)[i]; }catch(e){ return null; } }
    return cache[k];
  }
  /* ===== ONE BUS FOR EVERY SOUND EFFECT (8/2) ==========================
     Paolo 8/2: "when we have a menu and it's gonna have Settings and then we
     can change the volume of all sound effects or whatever so yeah just keep
     that in mind."
     Effects were reaching the output THREE different ways: footsteps on their
     own quiet bus, ambience on another, and everything else straight into the
     music master. A volume slider would have had to know about all three and
     would have drifted the moment a fourth appeared. So there is one node now.
     Everything an effect makes goes through SFXBUS -> MUS.MAST, and the whole
     settings hook is setSFXVolume().
     IT DOES NOT FLATTEN THE MIX HE APPROVED: the footstep bus and the ambience
     bus keep their own gains and simply feed this one instead of the master, so
     every level he judged stays exactly where it was relative to everything
     else. This is a place to put a knob, not a re-mix. */
  var SFXBUS=null, SFXVOL=1;
  try{ var sv=parseFloat(localStorage.getItem('bohemia_sfxvol'));
       if(sv>=0 && sv<=1) SFXVOL=sv; }catch(e){}
  function sfxBus(){
    try{
      if(SFXBUS) return SFXBUS;
      if(typeof MUS==='undefined' || !MUS.AC) return null;
      SFXBUS=MUS.AC.createGain(); SFXBUS.gain.value=SFXVOL;
      SFXBUS.connect(MUS.MAST||MUS.AC.destination);
      window.__SFXBUS=SFXBUS;
    }catch(e){ SFXBUS=null; }
    return SFXBUS;
  }
  /* THE WHOLE SETTINGS HOOK. When the menu exists it calls this and nothing
     else. 0 is silent, 1 is the mix he judged. */
  window.setSFXVolume=function(v){
    v=Math.max(0,Math.min(1,+v||0)); SFXVOL=v;
    try{ localStorage.setItem('bohemia_sfxvol',String(v)); }catch(e){}
    try{ if(SFXBUS) SFXBUS.gain.value=v; }catch(e){}
    return v;
  };
  window.getSFXVolume=function(){ return SFXVOL; };

  /* FOOTSTEPS SIT WAY UNDER EVERYTHING (Paolo 8/1): "relative to like the music
     it should be like a lot quieter like A LOT A LOT quieter -- the noise that
     makes for me stepping in different terrain should be quieter."
     ANOTHER SESSION BUILT THIS RULING AND IT NEVER FIRED. Their stepSfx() hangs
     off a BOHEMIA_STEP message that the run does not post -- measured live:
     stepSfx called 0 times across a walk, while playSFX handled every footstep.
     So the 0.12 they set was dead code and his ruling was being dropped on the
     floor while everyone assumed it had shipped. It is applied HERE, on the
     path that actually runs.
     A SUB-BUS, not an edit to his vectors: the verdict is on the SOUND, never
     on how loud the game chooses to play it. STEPS -> SFXBUS -> master, so the
     settings knob still reaches them. */
  var STEPBUS=null, STEP_GAIN=0.12;      /* ~-18 dB under everything else */
  function stepBus(){
    try{
      if(STEPBUS) return STEPBUS;
      var out=sfxBus(); if(!out) return null;
      STEPBUS=MUS.AC.createGain(); STEPBUS.gain.value=STEP_GAIN;
      STEPBUS.connect(out); window.__STEPBUS=STEPBUS;
    }catch(e){ STEPBUS=null; }
    return STEPBUS;
  }

  /* THE ONE ENTRY POINT. when==='beat' fires on the next downbeat of the real
     song (the 120 BPM LAW: a kill lands ON the beat), anything else fires now. */
  window.playSFX=function(ev,when){
    try{
      if(typeof BOH_SFX==='undefined')return null;
      var i=pick(ev); if(i==null)return null;
      var v=vec(ev,i); if(!v)return null;
      MUS.audio();
      var AC=MUS.AC;
      /* a footstep goes to the quiet sub-bus; everything else to the master */
      var dest=(ev.indexOf('step_')===0 ? (stepBus()||sfxBus()) : sfxBus())
               || MUS.MAST || AC.destination;
      var at=null;
      if(when==='beat' && MUS.playing && MUS.nextT){
        /* the next 16th that is also a beat boundary */
        var sd=MUS.stepDur(), s=MUS.step||0, ahead=(4-(s%%4))%%4;
        at=MUS.nextT+ahead*sd;
      }
      var node=BOH_SFX.render(v,AC,dest,at);
      if(node) SFX_COUNT++;         /* counted where it RENDERS, not where it is asked for */
      return node;
    }catch(e){ return null; }
  };
  /* UNLOCK ON THE FIRST TOUCH, ANY TOUCH (7/31 -- "I didnt hear ur sounds").
     An AudioContext may only be STARTED inside a real user gesture. iOS is
     strict about it: build one outside a gesture and it is born suspended, and
     resume() from a postMessage handler is refused for the whole session.
     The old wire only ever reached MUS.audio() from inside playSFX, and the
     only gesture that could get there was a tap on a button/.tab/.opt. The
     splash is <div id="front">, so THE FIRST THING HE EVER TOUCHES matched
     nothing. Land straight in the RUN tab, walk, and every footstep arrives by
     postMessage with no gesture behind it: silence, permanently, and the sound
     is "working" the whole time. So: unlock on the first interaction of ANY
     kind, anywhere, before anything needs to make noise. */
  /* THE RING/SILENT SWITCH (7/31, second report of silence).
     On iPhone, a page that makes sound ONLY through WebAudio is muted by the
     physical switch on the side of the phone, with no error, no warning and
     nothing in the page to see. Every check can pass and the phone stays quiet.
     Safari 16.4+ lets a page say it is playback rather than ambient audio,
     which opts out of that switch. Set it before the context starts, because it
     decides the category the context is born into. Absent everywhere else, so
     the guard is the whole compatibility story. */
  function claimPlayback(){
    try{ if(navigator.audioSession) navigator.audioSession.type='playback'; }catch(e){}
  }
  claimPlayback();
  function unlock(){
    claimPlayback();
    try{ MUS.audio(); if(MUS.AC && MUS.AC.state==='suspended') MUS.AC.resume(); }catch(e){}
    /* BUILD THE SFX MASTER THE INSTANT AUDIO EXISTS. Lazily is not good enough:
       the footstep bus is built on the first footstep and reads window.__SFXBUS
       to decide what to plug into, so if a step happens before any other sound
       it wires itself to the music master FOREVER and the volume slider cannot
       reach it. Measured exactly that: muted everything and footsteps still
       came out at 0.27. Order of creation is not something to leave to luck. */
    try{ sfxBus(); }catch(e){}
  }
  ['pointerdown','touchend','mousedown','click','keydown'].forEach(function(t){
    document.addEventListener(t, unlock, {capture:true, passive:true});
  });
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden) unlock();      /* coming back from the lock screen */
  });
  /* the run asks; the parent plays */
  window.addEventListener('message',function(ev){
    try{
      var d=ev&&ev.data; if(!d)return;
      /* A TOUCH INSIDE THE IFRAME IS STILL A TOUCH. It does not bubble out to
         this document, so the run tells us one happened and we take the chance
         to start the audio while the browser may still count it as gestured. */
      if(d.type==='BOHEMIA_GESTURE'){ unlock(); return; }
      if(d.type==='BOHEMIA_WHERE'){ AMB.where(d); return; }
      if(d.type==='BOHEMIA_NPCSTEP'){ npcStep(d); return; }
      if(d.type==='BOHEMIA_SFX') window.playSFX(d.ev,d.when);
    }catch(e){}
  });

  /* === SOMEBODY ELSE'S FOOTSTEP, PLACED IN SPACE (8/2) ==================
     THE DISTANCE MODEL IS THE RESEARCHED ONE, not a guess: a point source
     follows the inverse law, amplitude proportional to 1/r, dropping about 6 dB
     every time the distance doubles, and inverse is the recommended default
     when in doubt. So 1/(1+k*r), not a linear fade -- linear is for ambient
     zones and UI, and it makes everything sound like it is the same distance
     away until it abruptly is not.
     PAN is the crude, correct tool for a top-down 2D game: left is left. It is
     taken from the x offset only, because a top-down view has no front/back to
     confuse and faking one with filters would be inventing information the
     game does not have.
     CUTOFF, not fade-to-nothing: below a hearable gain it plays NOTHING rather
     than a sound too quiet to identify. A sound you cannot place is noise. */
  function npcStep(d){
    try{
      var r=Math.max(0.5, +d.dist||0);
      var g=1/(1+0.55*r);                    /* ~0.65 next to you, ~0.25 at 5 tiles */
      if(g<0.06) return;                     /* too far to be information */
      var pan=Math.max(-1,Math.min(1,(+d.dx||0)/6));
      var ev='step_'+(({asphalt:'asphalt',dirt:'dirt',gravel:'gravel'})[d.surface]
                      ||String(d.surface||'').replace('step_','')||'dirt');
      if(!APPROVED[ev]) ev='step_dirt';
      var i=pick(ev); if(i==null)return;
      var v=vec(ev,i); if(!v)return;
      if(typeof MUS==='undefined')return; MUS.audio(); if(!MUS.AC)return;
      /* NOT through the player's footstep bus. That bus is at 0.12 because HIS
         OWN steps fire constantly and would be fatiguing -- a neighbour's step
         is rare and is INFORMATION, and stacking 0.12 on top of distance made
         it 0.0095, which is a number, not a sound. Distance is the only thing
         that should quieten this. */
      var out=sfxBus(); if(!out)return;
      var at=MUS.AC.createGain(); at.gain.value=g; at.connect(out);
      /* the vector is HIS and is never edited -- a copy carries the position */
      var w={}, k; for(k in v) w[k]=v[k];
      w.pan=pan;
      BOH_SFX.render(w,MUS.AC,at,null);
      SFX_COUNT++;
    }catch(e){}
  }

  /* === THE WORLD TONE (8/1) ==============================================
     He approved all 15. It is one of the ambient noises: a rare sound so the
     valley is not dead air. It is NOT a clock -- something that fires a minute
     apart tells you nothing about the time, and the music already handles time
     of day. What it does is make the place feel occupied by nothing.

     THREE RULES, boring on purpose:
       WHICH  indoors -> air_inside. Outdoors -> air_night before 06:00 or from
              19:00, else air_day. The run reports both facts every 4s.
       WHEN   a random gap of 40 to 95 seconds. That is MY DEFAULT and nothing
              decided it but taste. One word from him changes it.
       QUIET  its own bus at 0.4 of the level he judged it at. He judged these
              loud enough to hear on a phone; under the game they sit below
              everything. He was told that before he thumbed them, so this is
              the plan he approved rather than a change to it.

     IT ONLY RUNS WHILE THE RUN IS ON SCREEN. If the reports stop, the ambience
     stops, so it can never play over him judging sounds in the MUSIC tab. */
  var AMB={
    kind:null, next:0, bus:null, seen:0,
    where:function(d){
      this.seen=Date.now();
      this.kind = d.inside ? 'air_inside' : (d.night ? 'air_night' : 'air_day');
    },
    gap:function(){ return 40 + Math.random()*55; },
    tick:function(){
      if(!this.kind) return;
      /* IS THE RUN ACTUALLY ON SCREEN? Message recency does NOT answer this:
         a hidden iframe keeps its timers running, so the run keeps reporting
         from the MUSIC tab and the ambience would play over him judging
         sounds. Ask the DOM whether the run panel is visible instead. */
      if(Date.now()-this.seen > 12000) return;      /* the run is not even loaded */
      /* ASK THE TAB, not the panel. Two wrong guesses before this one:
         offsetParent is null under any position:fixed ancestor even when the
         thing is plainly on screen, and #p-run is display:none the whole time
         because the RUN tab actually shows the p-city panel
         (PANEL = t.dataset.p==='run' ? 'city' : ...). The tab carrying class
         'on' is what the alpha itself uses to mean "this is the open tab", so
         use the app's own answer instead of inventing a third one. */
      var tab=document.querySelector('.tab[data-p="run"]');
      if(!tab || !tab.classList.contains('on')) return;
      var now=Date.now();
      if(!this.next){ this.next = now + this.gap()*1000; return; }
      if(now < this.next) return;
      this.next = now + this.gap()*1000;
      try{
        if(typeof BOH_SFX==='undefined' || typeof MUS==='undefined') return;
        MUS.audio(); if(!MUS.AC) return;
        if(!this.bus){
          this.bus = MUS.AC.createGain();
          this.bus.gain.value = 0.4;
          this.bus.connect(sfxBus()||MUS.MAST||MUS.AC.destination);
        }
        var set=APPROVED[this.kind]; if(!set||!set.length) return;
        var i=set[(Math.random()*set.length)|0];
        var v=vec(this.kind,i); if(!v) return;
        BOH_SFX.render(v,MUS.AC,this.bus,null);
        SFX_COUNT++;
      }catch(e){}
    }
  };
  window.__AMB=AMB;
  setInterval(function(){ AMB.tick(); }, 1000);
  /* the parent's own surfaces: every button on the phone is a UI TAP */
  document.addEventListener('click',function(e){
    var t=e&&e.target; if(!t)return;
    if(t.closest&&(t.closest('button')||t.closest('.tab')||t.closest('.opt')))
      window.playSFX('ui_tap');
  },true);
  /* SAY WHAT THE AUDIO IS DOING (7/31). He reported silence twice and both
     times I had to guess at his phone from here, because a muted iPhone and a
     broken wire look exactly the same from the outside: nothing. This is one
     line in the MUSIC tab that turns "I hear nothing" into something he can
     read back to me. It reports the three things that can each cause silence
     on their own: whether audio ever STARTED, whether the ring/silent switch
     opt-out took, and how many sounds have actually been fired. */
  function statusLine(){
    var el=document.getElementById('sfxStatus');
    if(!el){
      var host=document.getElementById('p-music'); if(!host)return;
      el=document.createElement('div'); el.id='sfxStatus';
      el.style.cssText='font:11px ui-monospace,monospace;padding:7px 9px;margin:6px 0;'+
        'border:1px solid #3a3a30;border-radius:6px;letter-spacing:.5px;line-height:1.5';
      host.insertBefore(el, host.firstChild);
    }
    var on=false, st='never started';
    try{ if(typeof MUS!=='undefined'&&MUS.AC){ st=MUS.AC.state; on=(st==='running'); } }catch(e){}
    var claim='n/a on this browser';
    try{ if(navigator.audioSession) claim=navigator.audioSession.type||'unset'; }catch(e){}
    el.style.borderColor = on ? '#4d6b45' : '#7a3a30';
    el.style.background  = on ? 'rgba(60,90,55,0.16)' : 'rgba(120,50,40,0.16)';
    el.style.color       = on ? '#a8c69c' : '#e8a08f';
    el.innerHTML =
      '<b>SOUND: '+(on?'ON':'NOT PLAYING')+'</b><br>'+
      'audio engine: '+st+'<br>'+
      'silent-switch opt-out: '+claim+'<br>'+
      'sounds fired: '+SFX_COUNT+
      (on?'':'<br>if this stays red after you tap the screen, it is the phone, not the game');
  }
  setInterval(statusLine, 700);
  if(document.readyState!=='loading') statusLine();
  else document.addEventListener('DOMContentLoaded', statusLine);
})();
""" % (VERDICT, BANK, json.dumps(bank, separators=(',', ':')))


RUN_BLOCK = r"""
/* === SFX WIRE, RUN SIDE (7/30/26) ========================================
   The run has no AudioContext and never gets one (ONE AUDIOCONTEXT, THE
   PARENT'S). It says what happened; the parent plays Paolo's approved sound.

   THE GROUND PICKS THE FOOTSTEP, and it does it from the tile the game already
   knows -- the same names groundKind() classifies for drawing. No new content
   and no guessing: a roadway or a sidewalk is asphalt, gravel and shoulder are
   gravel, everything else is dirt. */
function sfx(ev,when){
  try{ if(window.parent&&window.parent!==window)
    window.parent.postMessage({type:'BOHEMIA_SFX',ev:ev,when:when||null},'*'); }catch(_e){}
}
/* TELL THE PARENT A FINGER LANDED (7/31). A touch in here never reaches the
   parent's document, so the parent can be sitting with no audio at all while
   the thumb hammers the D-pad. This fires on the gesture itself, ahead of any
   sound, so the audio has already started by the time a footstep is asked for. */
/* WHERE AND WHEN YOU ARE (8/1). He approved all 15 world tones, so the run has
   to say which one applies. Two facts, nothing else: are you indoors, and is it
   night. mode==='ext' is the same flag the footstep classifier already uses, and
   SIM.turn is the world MINUTE (one turn = one world-minute, 1440 a day), which
   is the same clock the NPC schedules run on. Night is before 06:00 or after
   19:00, which is where the schedules already put dusk. */
function sfxWhere(){
  try{
    var min = 720;                                   /* noon if the sim is not up */
    try{ if(typeof SIM!=='undefined' && SIM) min = SIM.turn % 1440; }catch(_e){}
    var night = (min < 6*60 || min >= 19*60);
    if(window.parent&&window.parent!==window)
      window.parent.postMessage({type:'BOHEMIA_WHERE',
        inside:(mode!=='ext'), night:night, min:min},'*');
  }catch(_e){}
}
setInterval(sfxWhere, 4000);

/* YOU CAN HEAR THE PEOPLE ON YOUR BLOCK (8/2) ============================
   Every sound in this game happens AT the player. The valley has people walking
   around it and not one of them makes a noise, so the block reads empty even
   when it is full.
   The horror writing is blunt about why this matters: the player should hear
   something BEFORE seeing it, and from the sound alone know roughly where it is
   and how far. That is the whole feature.
   NO NEW SOUND IS COOKED. It is his own approved footsteps, played at somebody
   else's position -- approval unlocks volume, and this is volume.
   IT TOUCHES NOTHING THAT IS NOT MINE: the run's own updateFaces() already
   tracks agent positions, but reading its private state would couple this to
   another lane's internals, so this keeps its OWN last-seen map and compares
   against that. */
var NPCPOS={}, NPC_LAST=0;
var NPC_RANGE=7;          /* tiles. past this a step is inaudible anyway */
function npcSteps(){
  try{
    if(typeof SIM==='undefined' || !SIM) return;
    if(mode!=='ext') return;              /* indoors you do not hear the street */
    var outs=SIM.outAgents(), i, best=null, bestD=1e9;
    for(i=0;i<outs.length;i++){
      var a=outs[i], prev=NPCPOS[a.id];
      var moved = prev && (prev[0]!==a.loc.x || prev[1]!==a.loc.y);
      NPCPOS[a.id]=[a.loc.x,a.loc.y];
      if(!moved) continue;
      var dx=a.loc.x-px, dy=a.loc.y-py;
      var d=Math.sqrt(dx*dx+dy*dy);
      if(d>NPC_RANGE || d<0.5) continue;  /* d<0.5 would be the player himself */
      if(d<bestD){ bestD=d; best={dx:dx,d:d,x:a.loc.x,y:a.loc.y}; }
    }
    if(!best) return;
    /* A CROWD IS NOT A MACHINE GUN. One neighbour footfall at a time, the
       nearest one, and never faster than a person actually walks. */
    var now=Date.now();
    if(now-NPC_LAST < 260) return;
    NPC_LAST=now;
    if(window.parent&&window.parent!==window)
      window.parent.postMessage({type:'BOHEMIA_NPCSTEP',
        surface:sfxGround(best.x,best.y), dx:best.dx, dist:best.d},'*');
  }catch(_e){}
}
setInterval(npcSteps, 200);
(function(){
  function gesture(){
    try{ if(window.parent&&window.parent!==window)
      window.parent.postMessage({type:'BOHEMIA_GESTURE'},'*'); }catch(_e){}
  }
  ['pointerdown','touchstart','mousedown','keydown'].forEach(function(t){
    try{ document.addEventListener(t, gesture, {capture:true, passive:true}); }catch(_e){}
  });
})();
function sfxGround(gx,gy){
  try{
    if(mode!=='ext') return 'step_asphalt';        /* indoors is a hard floor */
    if(typeof isRoad==='function' && isRoad(gx,gy)) return 'step_asphalt';
    var n='';
    try{ n=(NAMEG&&NAMEG[gy]&&NAMEG[gy][gx]||'').toLowerCase(); }catch(_e){}
    if(/gravel|shoulder|rock|caliche|lag|track/.test(n)) return 'step_gravel';
    if(/asphalt|roadway|lane|street|sidewalk|walk|path|concrete|apron|pad|slab|lot|parking|platform|court/.test(n))
      return 'step_asphalt';
    return 'step_dirt';                            /* desert, yards, everything else */
  }catch(_e){ return 'step_dirt'; }
}
"""


def main():
    for f in (ALPHA, RUN, BANK):
        if not os.path.exists(f):
            print('FAIL: missing ' + f)
            return 1
    bank = json.load(open(BANK))
    n = sum(len(v) for v in bank.values())

    # ---------- parent ----------
    alpha = open(ALPHA, encoding='utf8').read()
    if P_BEGIN in alpha:
        i = alpha.index(P_BEGIN)
        j = alpha.index(P_END) + len(P_END)
        # TAKE BACK THE NEWLINES THE INJECTION BROUGHT. The inject below ends
        # with P_END + '\n'; a cut that stops at P_END leaves that '\n' behind,
        # so every idempotent re-run grew the file by one blank line. Silent,
        # slow, and it makes "regenerating changes nothing" a lie.
        if alpha[j:j + 1] == '\n':
            j += 1
        alpha = alpha[:i] + alpha[j:]
        print('parent wire removed (idempotent re-inject)')
    anchor = '<div id="exportModal"'
    k = alpha.index(anchor)
    alpha = alpha[:k] + P_BEGIN + '\n<script>' + parent_block(bank) + '</script>\n' + P_END + '\n' + alpha[k:]
    # THE FOOTSTEP BUS FEEDS THE SFX MASTER TOO (8/2). Another session built
    # STEP_BUS on 8/1 off his "A LOT A LOT quieter" ruling, and it connects
    # straight to the music master. That is ONE LINE in someone else's block and
    # I am changing it deliberately: his settings ruling needs ONE knob, and a
    # footstep bus that bypasses the SFX master would be the one sound a volume
    # slider could not turn down. Their gain is untouched, so the level he
    # approved is exactly preserved -- only what it plugs into changes.
    _old = 'STEP_BUS.connect(MUS.MAST || AC.destination);'
    _new = ('STEP_BUS.connect((window.__SFXBUS) || MUS.MAST || AC.destination);'
            '  /* 8/2: through the SFX master so one slider reaches it */')
    if _old in alpha:
        alpha = alpha.replace(_old, _new, 1)
        print('  footstep bus rerouted through the SFX master (their gain untouched)')
    elif _new not in alpha:
        print('  NOTE: no footstep bus found to reroute (another lane may have moved it)')

    open(ALPHA, 'w', encoding='utf8').write(alpha)

    # ---------- run ----------
    run = open(RUN, encoding='utf8').read()
    if 'SFX WIRE, RUN SIDE' in run:
        i = run.index('/* === SFX WIRE, RUN SIDE (7/30/26)')
        # RUN_BLOCK opens with a newline of its own; the cut has to eat it too
        # or the seam gains a blank line on every re-run (see the parent note).
        if i and run[i - 1] == '\n':
            i -= 1
        j = run.index("  }catch(_e){ return 'step_dirt'; }\n}\n") + len("  }catch(_e){ return 'step_dirt'; }\n}\n")
        run = run[:i] + run[j:]
        print('run wire removed (idempotent re-inject)')

    # the helpers go in just above the beat receiver, which is already near the top
    host = '/* === RUN BEAT RECEIVER (7/29/26, SOUNDS lane) ===='
    if host not in run:
        print('FAIL: the beat receiver anchor is missing; run the beat patch first')
        return 1
    run = run.replace(host, RUN_BLOCK + host, 1)

    # SAVED. The run records what you did; his bell says so. One call site, the
    # function every autosave already goes through.
    save_anchor = "function autoSave(why){ writeSave('auto:'+why); }"
    if 'sfx(\'save_chime\')' not in run:
        if save_anchor not in run:
            print('FAIL: cannot find autoSave')
            return 1
        run = run.replace(save_anchor,
                          "function autoSave(why){ writeSave('auto:'+why); "
                          "sfx('save_chime'); }   /* HIS bell (7/30) */", 1)

    # THE STEP. Fire at the committed move, for both exterior and interior.
    step_anchor = "  if(WALKMODE==='SLIDE'){ SLIDE.on=true; SLIDE.fx=dx; SLIDE.fy=dy; SLIDE.t0=Date.now(); slideKick(); }"
    if 'sfxGround(px,py)' not in run:
        if step_anchor not in run:
            print('FAIL: cannot find the move-commit line')
            return 1
        run = run.replace(step_anchor,
                          "  sfx(sfxGround(px,py));   /* HIS footstep, chosen by the ground (7/30) */\n"
                          + step_anchor, 1)

    # ---- 8/2: THE TWO APPROVED FAMILIES THAT STILL MADE NO SOUND ----------
    # APPROVED-BUT-UNUSED IS A DEFECT is this lane's own law, and it had two
    # holes left in it. He thumbed 2 PHONE BUZZ and 5 PICKUP candidates on 7/30
    # and neither had a call site, so seven sounds he chose were dead weight in
    # the bank. Both moments below already EXIST in the run; nothing is being
    # invented to justify a sound, which is the trap the door candidates fell
    # into.

    # PHONE BUZZES. His own why: "a new post, a message, the feed". The run has
    # exactly one feed and it comes out when you get home with the quest done.
    # GUARDED ON feed.length ON PURPOSE: an empty feed is the phone with nothing
    # on it, and a buzz that announces no post is a lie the player can hear.
    ph_anchor = "  var feed = BohemiaLoop.buildFeed(CTX, { limit:8 });"
    if "sfx('phone_buzz')" not in run:
        if ph_anchor not in run:
            print('FAIL: cannot find openPhone feed build')
            return 1
        run = run.replace(ph_anchor,
                          ph_anchor + "\n"
                          "  if(feed.length) sfx('phone_buzz');"
                          "   /* HIS buzz (7/30): a post landed, not just a screen */", 1)

    # PICK SOMETHING UP. THIS ONE IS A JUDGEMENT CALL AND IT IS FLAGGED AS ONE.
    # His why was "loot, items, anything into the bag", and this game has no bag:
    # there is no inventory anywhere in the run or the loop engine. What it DOES
    # have is exactly one take-the-thing action -- the prop the room is holding,
    # under your feet, offered as EAT WHAT YOU FOUND. You find it and you take
    # it; the eating is what happens next. That is the closest real moment in the
    # build, it is not a moment manufactured for the sound, and if Paolo says a
    # pickup should not fire when he eats then this one line comes out and the
    # five sounds go back to waiting for an inventory. Said out loud rather than
    # buried, because a stretched moment is the kind of thing that should be easy
    # for him to kill.
    # EAT IS ITS OWN SOUND (Paolo 8/2: "eat will be a different sound"). This
    # used to wire PICKUP here, as the closest real take-the-thing moment, and
    # it was flagged at the time as the one judgement call in that ship. He
    # answered by ruling the MOMENT rather than the sound: eating is not picking
    # up. So this wires 'eat', which batch 02 cooks its own five candidates for,
    # and PICKUP goes back to having no call site until an inventory exists.
    pk_anchor = ("      return { verb:'use', label:'EAT WHAT YOU FOUND',\n"
                 "               act:function(){ spendTime('EAT','You ate.'); } };")
    if "sfx('eat')" not in run:
        # A BUILD MAY ALREADY CARRY THE PICKUP WIRE. This tool shipped it on 8/2
        # before he ruled, so an existing tree has sfx('pickup') at this site and
        # the plain anchor is gone. Upgrade it in place rather than bailing out:
        # a patch tool that can only recognise the pristine shape cannot correct
        # its own past output, which is how a superseded ruling survives.
        if "sfx('pickup');" in run:
            run = run.replace("sfx('pickup');", "sfx('eat');", 1)
            run = run.replace(
                "/* HIS pickup (7/30): you take what the room held */",
                "/* HIS EAT (8/2 ruling: \"eat will be a different sound\") */", 1)
            print("  upgraded the old pickup wire to EAT (his 8/2 ruling)")
        elif pk_anchor not in run:
            print('FAIL: cannot find the prop use verb')
            return 1
        elif True:
            run = run.replace(pk_anchor,
                          "      return { verb:'use', label:'EAT WHAT YOU FOUND',\n"
                          "               act:function(){ sfx('eat');"
                          "   /* HIS EAT (8/2 ruling: \"eat will be a different sound\") */\n"
                          "                            spendTime('EAT','You ate.'); } };", 1)

    open(RUN, 'w', encoding='utf8').write(run)
    r = subprocess.run(['node', 'tools/build_run_slice.js'], capture_output=True, text=True)
    if r.returncode != 0:
        print('FAIL: the run would not rebuild:\n' + (r.stderr or '')[-800:])
        return 1
    built = open(BUILT, encoding='utf8').read()
    if ('SFX WIRE, RUN SIDE' not in built or 'sfxGround(px,py)' not in built
            or "sfx('phone_buzz')" not in built or "sfx('eat')" not in built):
        print('FAIL: the rebuilt run does not carry the wire')
        return 1

    print('THE APPROVED SOUNDS PLAY NOW.')
    print('  %d approved sounds across %d events, from his 7/30 thumbs' % (n, len(bank)))
    print('  footsteps chosen by the tile the game already knows')
    print('  phone buzz on a real post, EAT on the thing the room held (his 8/2 ruling)')
    print('  doors: SILENT, on purpose -- he killed all ten door candidates')
    return 0


if __name__ == '__main__':
    sys.exit(main())
