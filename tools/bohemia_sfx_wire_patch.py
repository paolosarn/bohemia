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

DOORS, AND THE HALF OF THEM THAT IS STILL SILENT (updated 8/9). He killed all
ten metal/wood candidates on 7/30, so this tool wired nothing. He named DOORS in
the minimum demo sound set on 8/9, a fresh cook from ash and stone answered it,
and he thumbed door_drag.0 UP and all five door_clack candidates DOWN.
  THE DOOR DRAGGING OPEN now sounds, from openDoor() -- the moment it starts
    moving, already guarded against re-entry so one opening is one sound.
  THE DOOR SHUTTING IS STILL SILENT, and that is his ruling, not an omission.
    Reversing the drag or reusing it for the close would put a sound on a moment
    he ruled has none, which is exactly what MECHANISM-MINE / CONTENTS-PAOLO'S
    forbids. door_open and door_shut remain at zero approved and stay unwired.

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
BANK = 'banks/BOHEMIA_SFX_APPROVED_8_17_26.json'   # 8/17: he judged all 460
VERDICT = 'records/BOHEMIA_SFX_VERDICT_8_17_26.txt'

P_BEGIN = '<!-- BOHEMIA SFX WIRE PARENT (7/30/26) -->'
P_END = '<!-- /BOHEMIA SFX WIRE PARENT -->'


def parent_block(bank):
    return """
/* === SFX WIRE, PARENT SIDE (7/30/26) ====================================
   Paolo's 118 approved sounds, from his 8/15 full sweep. The table below is INDEXES
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
  /* ===== ONE MOMENT, MORE THAN FIVE VOICES (8/16b) ======================
     MEASURED, and it is the worst number in this whole lane: THE MOST-PLAYED
     SOUND IN THE GAME HAS EXACTLY ONE APPROVED VARIANT. Every shot in every
     firefight is byte-identical. So is every sidewalk step, every hit you
     take, every piece of brass, every shot your cover eats. Twelve wired
     moments sit at one variant and four more at two.
     This is the MACHINE GUN EFFECT and it is the oldest problem in game audio:
     the same sample fired in rapid succession stops reading as an event and
     starts reading as a machine. It is also, precisely, "its getting stale" --
     except this time in the GAME rather than on the judge sheet, which is why
     no amount of new moments was ever going to fix it.
     APPROVAL UNLOCKS VOLUME is already this repo's law. It had never been
     applied to sound: he approved shot.3 on 8/1 and the volume never came.

     WHY A SIBLING EVENT RATHER THAN A BIGGER COOK. A recipe cooks exactly five
     candidates and his thumbs are attached to those five vectors forever
     (verdict_frozen_gate). Widening `shot` to eight would change what shot.3
     IS. So a moment gains a SIBLING EVENT with its own id and its own five,
     and the picker draws from the union. His old thumbs never move.

     TWO THINGS THE RESEARCH CHANGED:
       ODD IS BETTER THAN EVEN. Standard round-robin practice is an odd number
       of variants against an even meter, so the cycle never locks to the
       phrasing. This game quantises EVERYTHING to 120 BPM, which makes it the
       worst possible case for an even count -- four variants against 4/4 would
       line up forever.
       NEVER TWICE IN A ROW, which this picker already did and which is kept. */
  /* WHICH MOMENTS DRAW FROM WHICH SIBLINGS (8/16b). Left is the moment the
     game asks for; right is the extra event whose approved candidates join its
     pool. Nothing here changes what he approved -- it only widens the draw. */
  var SIBLINGS={
    shot:          ['shot_more'],
    hurt:          ['hurt_more'],
    hit:           ['hit_more'],
    casing:        ['brass_more'],
    block:         ['cover_more'],
    step_concrete: ['walk_more']
  };      /* moment -> extra event ids that also feed it */
  window.__sfxSiblings=SIBLINGS;
  function poolOf(ev){
    var pool=[], set=APPROVED[ev]||[], i;
    for(i=0;i<set.length;i++) pool.push([ev,set[i]]);
    var sib=SIBLINGS[ev]||[];
    for(var s=0;s<sib.length;s++){
      var t=APPROVED[sib[s]]||[];
      for(i=0;i<t.length;i++) pool.push([sib[s],t[i]]);
    }
    return pool;
  }
  window.__sfxPool=function(ev){ return poolOf(ev).map(function(x){return x[0]+'.'+x[1];}); };
  function pick(ev){
    var pool=poolOf(ev); if(!pool.length)return null;   /* unjudged = silent */
    if(pool.length===1)return pool[0];
    var c, guard=0, key;
    do{ c=pool[(Math.random()*pool.length)|0]; key=c[0]+'.'+c[1]; }
    while(key===last[ev] && ++guard<8);
    last[ev]=key; return c;
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
  /* === VOICE LIMITING (8/4) =============================================
     MEASURED at the limiter output, firing N copies of one shot at the same
     instant:
        1 copy  energy 2.18    8 copies energy 2.25
        2       2.18          16       1.81   <- LESS THAN ONE
     Past the first, a stacked sound adds NOTHING. The brickwall holds the peak
     at 0.80 either way, so all the extra copies do is push the limiter down --
     and the limiter pushes EVERYTHING down with it: the music, the footsteps,
     the ambience. The loudest moment in the game was the moment it went flat.
     It is not hypothetical. A combat volley resolves several enemies in the same
     frame, which is why the block sound already needed a hand-rolled guard and
     the neighbour footstep needed another. Two ad-hoc guards for one defect
     means the defect belongs one level up.
     TWO LIMITS, both deliberately generous:
       PER EVENT, 45ms. Two identical sounds closer together than about 40ms do
       not read as two sounds; they read as one with a thicker attack. This is
       the flam threshold, not a gameplay choice.
       GLOBAL, 8 voices per 60ms. A fight can absolutely fire eight DIFFERENT
       things at once and should. It cannot usefully fire twenty.
     THE FIRST SOUND IS NEVER DROPPED, and a lone sound is never touched. */
  var VOX=[], LASTEV={};
  var VOX_EVENT_MS=45, VOX_WINDOW_MS=60, VOX_MAX=8;
  /* ---- AND IT USED TO DROP WHATEVER ARRIVED NINTH (8/15) ---------------
     The cap was first-come-first-served: eight sounds inside sixty
     milliseconds and the ninth was refused, whatever it was. A mix that drops
     by ARRIVAL ORDER is not a mix, it is a queue -- the thing the player most
     needed to hear is as likely to be thrown away as anything else, in the
     exact moment there is most going on.
     BEING PRECISE ABOUT WHAT WAS AND WAS NOT REACHABLE, because the first
     version of this comment overstated it and the measurement caught me: a
     flood of FOOTSTEPS could never do this. The 45 ms per-event guard admits
     one step_asphalt per burst however many are asked for -- measured, 1 of 40.
     The reachable case is many DIFFERENT sounds landing together, which is
     precisely what a fight is: a shot, a hit, a body, a casing, a door, the
     phone, two neighbours walking. That is the moment the cap was deciding by
     arrival order, and that is the moment it now decides by importance.
     PRIORITY IS THE STANDARD ANSWER and every audio middleware has it under one
     name or another -- a sound carries an importance, and when there are more
     sounds than room the least important loses. Here it is deliberately coarse,
     four tiers, because a fine-grained table would be inventing a hierarchy
     nobody ruled on:
       3 CRITICAL   the fight and the answer to it. kill, hurt, shot, hit,
                    block, vital, melee. Never refused.
       2 EVENT      something happened that you did. doors, saves, quests,
                    money, the phone, the interface.
       1 WORLD      the valley being the valley. ambience, gusts, generators.
       0 CONSTANT   footsteps -- the sound the game makes most, and the only
                    one that can plausibly flood the window on its own.
     THE HEADROOM IS THE MECHANISM: a tier may only use part of the window, so
     a flood of footsteps can never fill it past the point where a gunshot
     still fits. CRITICAL bypasses the cap entirely, which is the whole point.
     WHAT IT IS NOT: this is not voice STEALING. A Web Audio source already
     scheduled cannot be cheaply un-scheduled, so nothing already sounding is
     cut short -- the cap decides what gets IN. Saying so because "priority"
     usually implies stealing and this does less than that. */
  var PRIO={ kill:3, hurt:3, shot:3, hit:3, block:3, vital:3, melee_hit:3,
             miss:3, clear:3, dry_fire:3, casing:3, swing_air:3, heartbeat:3,
             air_day:1, air_night:1, air_inside:1, wind_gust:1, generator:1,
             dog_far:1, dog_cry:1, neon_buzz:1, neon_hum:1 };
  function prioOf(ev){
    if(PRIO[ev]!=null) return PRIO[ev];
    if(String(ev).indexOf('step_')===0) return 0;
    return 2;
  }
  /* room a tier is allowed to take. 3 is uncapped and is not in the table. */
  var TIER_ROOM={ 0:5, 1:6, 2:8 };
  function voiceOK(ev){
    var now=(typeof performance!=='undefined'&&performance.now)?performance.now():Date.now();
    var last=LASTEV[ev];
    if(last!=null && (now-last)<VOX_EVENT_MS) return false;
    while(VOX.length && (now-VOX[0])>VOX_WINDOW_MS) VOX.shift();
    var p=prioOf(ev);
    var room=(p>=3) ? Infinity : (TIER_ROOM[p]!=null ? TIER_ROOM[p] : VOX_MAX);
    if(VOX.length>=Math.min(room, p>=3 ? Infinity : VOX_MAX)) return false;
    LASTEV[ev]=now; VOX.push(now);
    return true;
  }
  window.__voiceStats=function(){ return {perEvent:VOX_EVENT_MS, window:VOX_WINDOW_MS,
    max:VOX_MAX, tiers:TIER_ROOM, prio:PRIO, prioOf:function(e){ return prioOf(e); }}; };
  /* THE ADMISSION DECISION ITSELF, so a test can ask it forty times without
     paying for forty renders. Rendering is what made the first version of
     the mix gate wrong: forty real sounds took longer than the sixty
     millisecond window they were supposed to be crowding, so the window
     emptied underneath the experiment and the cap looked broken. This is
     THE SAME FUNCTION playSFX calls, not a copy of its logic. */
  window.__voiceAdmit=function(ev){ return voiceOK(ev); };

  /* ===== DUCKING: THE MUSIC GETS OUT OF THE WAY OF A PERSON (8/15) ======
     Nothing in the game has ever moved out of the way of anything else. A
     squiggle line and a full song arrived at the same weight and fought, and
     the line lost, because a song is continuous and a voice is not.
     DUCKING UNDER DIALOGUE IS THE OLDEST MOVE IN THE BOOK -- broadcast has done
     it for decades and every game middleware ships it. THE RESEARCHED SHAPE:
     about -9 dB of duck is the usual dialogue target, with a typical game ramp
     of ~500 ms down and ~1000 ms back.
     I SHORTENED THE ATTACK AND SAY SO: 500 ms down buries the first third of a
     line that is often only a second and a half long, which is the exact thing
     the duck exists to prevent. 150 ms is fast enough to be under the first
     syllable and slow enough not to click. The recovery stays long (900 ms)
     because a fast recovery pumps, and pumping is audible in a way a slow one
     is not. All three are dials; one word from him moves any of them.
     ITS OWN NODE, SO HIS SLIDER IS NEVER TOUCHED. MUSVOL is the music volume he
     sets; ducking it would fight the mixer and lose his setting the first time
     the two disagreed. A dedicated gain sits between the music master and that
     slider instead, so the duck is the only thing that ever writes to it. */
  var DUCK=null, DUCK_UNTIL=0;
  var DUCK_DEPTH=0.355, DUCK_DOWN=0.15, DUCK_UP=0.9;   /* -9 dB, 150 ms, 900 ms */
  function duckNode(){
    try{
      if(DUCK && DUCK.__wired) return DUCK;
      if(typeof MUS==='undefined' || !MUS.AC || !MUS.MAST || !MUS.MUSVOL) return null;
      var g=MUS.AC.createGain(); g.gain.value=1;
      try{ MUS.MAST.disconnect(MUS.MUSVOL); }catch(_e){}
      MUS.MAST.connect(g); g.connect(MUS.MUSVOL);
      g.__wired=true; DUCK=g;
      try{ window.__DUCK=DUCK; }catch(_e){}
    }catch(e){ DUCK=null; }
    return DUCK;
  }
  /* seconds = how long the thing that is ducking will last. Overlapping calls
     EXTEND rather than restart, so two people talking do not pump the song. */
  window.duckMusic=function(seconds){
    try{
      var g=duckNode(); if(!g) return null;
      var AC=MUS.AC, now=AC.currentTime;
      var hold=Math.max(0.05, Math.min(8, +seconds||0.6));
      var until=now+hold;
      if(until<DUCK_UNTIL) until=DUCK_UNTIL;      /* never cut a duck short */
      DUCK_UNTIL=until;
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.linearRampToValueAtTime(DUCK_DEPTH, now+DUCK_DOWN);
      g.gain.setValueAtTime(DUCK_DEPTH, until);
      g.gain.linearRampToValueAtTime(1, until+DUCK_UP);
      return { depth:DUCK_DEPTH, down:DUCK_DOWN, up:DUCK_UP, until:until };
    }catch(e){ return null; }
  };
  window.__duckStats=function(){
    return { depth:DUCK_DEPTH, down:DUCK_DOWN, up:DUCK_UP,
             wired:!!(DUCK&&DUCK.__wired),
             gain:(DUCK?DUCK.gain.value:null) }; };
  /* ===== THE JUDGE SCREEN IS SILENT EXCEPT FOR WHAT HE PRESSES =========
     PAOLO, 8/16, AND NOT FOR THE FIRST TIME: "how many fucking times do I have
     to fucking tell you that when I click a sound button it shouldn't be doing
     the button sound click because that's disturbing me from hearing the actual
     sound effect ... everything should make a sound except for the fucking
     sound button that I played to hear different sounds to vote on".

     MEASURED BEFORE IT WAS FIXED, on the real page with a real touch, because
     the obvious suspect was wrong. The preview button does NOT play a UI click:
     tapping one renders exactly one thing, the candidate. What is actually
     landing on top of his auditions is THE GAME PLAYING ITSELF IN ANOTHER TAB
     -- the run keeps autosaving on its own timer and his approved save bell
     rings straight through the MUSIC tab. Three seconds of doing nothing at all
     renders save_chime.0. He hears it next to his taps and reads it as the
     button; the button was innocent and the room was not.

     THE AMBIENCE LANE ALREADY SOLVED THIS FOR ITSELF on 8/1 -- it checks the
     RUN tab is actually open before it plays, because a hidden iframe keeps its
     timers. That guard was never generalised, so every OTHER game sound kept
     the hole: the bell today, and a footstep or a door the moment the run moves
     while he is judging.

     AND THE GUARD GOES ON THE SOURCE, NOT ON THE SOUND'S NAME. The first
     version of this listed the run's event names and checked them inside
     playSFX, and the wired gate went red on ten checks immediately -- because
     step_asphalt is ALSO what he hears when he taps step_asphalt on the judge
     board, and silencing that is the exact opposite of what he asked for.
     Every one of those reds was right.
     The honest discriminator is WHO ASKED. The run and combat are iframes and
     can only reach the parent by postMessage; his finger on the board and the
     parent's own interface call playSFX directly. So the check sits on the
     message channel: a sound the RUN asks for while he is looking at another
     tab is dropped, and nothing he presses can ever be. */
  /* AND THE CONDITION IS "HE IS JUDGING", NOT "THE RUN TAB IS SHUT".
     The first two versions asked whether the RUN tab was visible, which is a
     PROXY for the thing he actually complained about and a bad one: it made
     every game sound depend on a tab state, and it took the block-is-not-empty
     checks red because a neighbour's footstep is staged from a probe that does
     not sit on the RUN tab. FIX THE RULER, NOT THE TARGET -- and here the
     ruler was my own condition.
     What he described is one specific room: he is on the MUSIC tab auditioning
     candidates to vote on, and the game is playing over them. So that is what
     is checked. During real play the MUSIC tab is not open and this guard is
     inert by construction, which is why it cannot silence anything he is
     actually playing. */
  function judging(){
    try{
      var el=document.getElementById('p-music');
      return !!(el && el.classList && el.classList.contains('on'));
    }catch(e){ return false; }  /* if we cannot tell, never silence */
  }
  window.__judging=judging;
  /* ===== NO TWO PLAYBACKS ARE IDENTICAL (8/18) =========================
     THE RESEARCH SAYS THERE IS NO MAGIC NUMBER OF VARIANTS. Game-audio
     practice does not beat repetition by counting samples up to some
     threshold; it randomises PITCH AND LEVEL ON EVERY PLAYBACK, and gets far
     more heard variation out of a small approved set than the set contains.
     THIS COSTS HIM NOTHING, which is why it beat the alternative. Widening a
     pool takes a batch, a ballot and his thumbs, and buys ONE moment. This
     multiplies variety across ALL 148 candidates he has ALREADY approved --
     the six-variant gunshot and the twelve moments still holding one alike --
     without asking him for a single new judgement.

     IT IS DELIBERATELY SMALL, because his approval is of a SOUND, not of a
     family of sounds. +/-3%% on pitch is about half a semitone and +/-10%% on
     level is under a decibel: audibly not-the-same-twice, nowhere near a
     different candidate. The gate measures BOTH bounds rather than trusting
     this comment -- it has to move, and it has to stay small.

     PITCH MOVES ONLY ON THE SYNTHESIS METHODS, NEVER ON HIS INSTRUMENTS.
     bodyInstrument converts hz to a SEMITONE and rounds it, so a 3%% nudge is
     either nothing or a whole semitone -- and a whole semitone on one of his
     own musical voices, in a game quantised to 120 BPM, is a WRONG NOTE rather
     than a variation. His rack varies by LEVEL alone.

     AND IT NEVER TOUCHES THE JUDGE SHEET. That surface renders candidates
     through BOH_SFX.render directly and never comes through playSFX, so what
     he auditions is always the exact vector he is voting on. Asserted in the
     gate, not assumed. */
  function vary(v){
    if(!v) return v;
    var w={},k; for(k in v) w[k]=v[k];
    var lvl = 1 + (Math.random()*2-1)*0.10;      /* +/-10%%, under a dB */
    w.gain = Math.max(0.02, Math.min(1, (v.gain||0.3) * lvl));
    if(v.synth !== 'instrument'){
      var pit = 1 + (Math.random()*2-1)*0.03;    /* +/-3%%, about half a semitone */
      w.hz = Math.max(20, Math.min(18000, (v.hz||200) * pit));
    }
    return w;
  }
  window.__sfxVary=vary;   /* exposed so the gate can measure the real spread */
  window.playSFX=function(ev,when){
    try{
      if(typeof BOH_SFX==='undefined')return null;
      if(!voiceOK(ev))return null;
      var c=pick(ev); if(c==null)return null;
      var v=vary(vec(c[0],c[1])); if(!v)return null;
      MUS.audio();
      var AC=MUS.AC;
      /* a footstep goes to the quiet sub-bus; everything else to the master */
      /* MUS.OUT BEFORE MUS.MAST, ALWAYS. MUS.stop() ducks the MUSIC master to
         zero and leaves it there (his 7/27 fix, still correct), so anything
         that falls back to MAST goes silent the moment he turns the music off.
         THIS LINE HAD THE FIX AND LOST IT: somebody repaired it in the ALPHA
         by hand, and the next run of this tool -- which owns the block and
         re-injects it whole -- reverted them. A fix that lives in generated
         output is a fix with a countdown on it. It lives in the generator now. */
      var dest=(ev.indexOf('step_')===0 ? (stepBus()||sfxBus()) : sfxBus())
               || MUS.OUT || MUS.MAST || AC.destination;
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
      if(d.type==='BOHEMIA_WHERE'){
        /* OCCLUSION HAD NO LISTENER (8/14). placeSound compares where a sound
           was made against where the player is standing, and nothing ever told
           it the second half -- so the wall cue shipped and could never fire.
           The run has been reporting `inside` every four seconds since 8/1 and
           this handler used it for the ambience bed and threw the rest away.
           No new message, no new run code: the fact was already arriving. */
        LISTENER.inside = !!d.inside;
        AMB.where(d); musicPhase(d); timePass(d); return; }
      /* THE GAME DOES NOT PLAY TO AN EMPTY ROOM (8/16, his ruling). Every
         sound below was asked for by the RUN or by COMBAT, across an iframe
         boundary. If he is not looking at that tab, he is judging, and the
         game must not put a save bell or a footstep on top of the candidate
         he is trying to hear. Nothing he PRESSES passes through here.
         AND IT IS THE IFRAME THAT IS GATED, NOT THE MESSAGE TYPE. ev.source
         is the window that posted: an iframe is not this window, a direct
         post from the parent (a probe, a measurement, his own board) is.
         Together with judging() this is as narrow as the rule can be made:
         the run or combat, talking across the iframe boundary, while he is
         looking at the judge sheet. Nothing else is touched. */
      var _fromGame = (d.type==='BOHEMIA_NPCSTEP' || d.type==='BOHEMIA_SFX_AT'
                       || d.type==='BOHEMIA_SFX');
      var _fromIframe = !!(ev && ev.source && ev.source !== window);
      if(_fromGame && _fromIframe && judging()) return;
      if(d.type==='BOHEMIA_NPCSTEP'){ npcStep(d); return; }
      if(d.type==='BOHEMIA_SFX_AT'){
        placeSound(d.ev, { dx:d.dx, dy:d.dy, dist:d.dist,
                           inside:d.inside, when:d.when||null });
        return; }
      if(d.type==='BOHEMIA_SFX') window.playSFX(d.ev,d.when);
    }catch(e){}
  });

  /* === THE CLOCK FINALLY REACHES THE MUSIC (8/4) ========================
     CITYMUS.phase shipped hardcoded to 'NIGHT', with a comment that said
     outright: "the valley is night until a world clock lands; whoever builds
     the clock sets CITYMUS.phase". The clock landed. Nobody set it.
     MEASURED before touching anything, because a claim like this has to be a
     number: at the shipped phase the overworld pool is 10 songs, and the SEVEN
     songs Paolo tagged OVERWORLD DAY or OVERWORLD DUSK/DAWN are in none of
     them. Over 200 draws, THE MARKER ON THE DOOR came up ZERO times -- the one
     song in this entire project he has ever said he likes ("now one of my new
     favorite songs that you've made"), tagged OVERWORLD DAY by his own hand,
     unplayable in the run since the day he tagged it.
     That is APPROVED-BUT-UNUSED, the defect this lane already has a law about,
     sitting in the music instead of the sound effects.
     THE FIX NEEDS NO RULING: the run already posts the world MINUTE here every
     four seconds, and this handler already uses it to choose the ambience bed.
     The same number now chooses the pool.
     THE WINDOWS NEST INSIDE THE AMBIENCE SPLIT ON PURPOSE. The bed calls night
     before 06:00 and from 19:00; DAWN and DUSK sit strictly inside the daylit
     side of that line, so the two systems can never disagree about whether it
     is dark. One clock, one opinion.
     IT NEVER CUTS A SONG. Only the phase moves; CITYMUS picks again at the end
     of its 64-bar pass, so the change arrives on a musical boundary instead of
     as a jump-cut. */
  var LASTPHASE=null;
  function musicPhase(d){
    try{
      if(typeof CITYMUS==='undefined'||!CITYMUS) return;
      var m=+d.min; if(!isFinite(m)) return;
      var ph = (m<6*60||m>=19*60) ? 'NIGHT'
             : (m<8*60)           ? 'DAWN'
             : (m<17*60)          ? 'DAY'
                                  : 'DUSK';
      if(ph===LASTPHASE) return;
      LASTPHASE=ph;
      CITYMUS.phase=ph;
      /* AND MAKE IT AUDIBLE (8/7). Setting the phase only changes what the NEXT
         pick draws from, and the shuffle only picked at the end of a 64-bar
         pass -- 128 seconds at 120 BPM -- so dawn could break and the night
         pool would keep playing for over two minutes. onPhaseChange arms a turn
         at the next 8-bar boundary; it never plays anything itself, so this
         cannot interrupt a song mid-phrase. Guarded because the hook ships in a
         separate patch and a missing one must never break the clock. */
      if(typeof CITYMUS.onPhaseChange==='function') CITYMUS.onPhaseChange();
    }catch(e){}
  }
  window.__musicPhase=function(){ return (typeof CITYMUS!=='undefined'&&CITYMUS)?CITYMUS.phase:null; };

  /* === HOURS GO BY, AND YOU HEAR HOW MANY (8/7) ==========================
     PAOLO'S RULING, on his own 130/130 export, and NOTES ARE RULINGS (7/19):

        "For hours go by have it the amount of time that goes by"

     He approved all five TIME_PASS candidates and killed all five SLEEP ones in
     the same breath, which read together is one decision rather than two: the
     passage of time is THE sound, and sleeping is a QUANTITY of it, not a
     separate ceremony that needs its own cue.

     SO IT STRIKES LIKE A CLOCK. One note per hour. Four hours is four notes,
     eight is eight. That is the most literal reading of what he asked for and
     it is also the only one that carries information: you can COUNT it without
     being told, the way a bell tower tells a valley what time it is. Nothing
     announces the number, you just hear it go by.

     IT DOES NOT RE-COOK HIS SOUND. Every strike is one of the five vectors he
     thumbed up, taken in order, cycling if there are more hours than
     candidates. The mechanism picks BETWEEN the sounds he picked; it never
     alters one. Same rule that makes footsteps work.

     ON THE BEAT, per the 120 BPM LAW: strikes land a beat apart in AUDIO time,
     scheduled ahead on the one AudioContext, not fired by a timer.

     AND IT DELIBERATELY SKIPS THE VOICE LIMITER. voiceOK() throttles on the
     WALL CLOCK, and every strike here is requested in the same millisecond even
     though they sound seconds apart -- so the limiter would drop every note
     after the first and an eight-hour sleep would strike ONCE. The limiter
     exists to stop simultaneous pile-ups crushing the brickwall (16 at once
     measured QUIETER than one, 8/4). These are not simultaneous; they are the
     opposite. Scheduling is the throttle.

     CAPPED AT 12. Past twelve strikes it stops being countable and starts being
     noise, and twelve is where a clock face stops too. */
  var STRIKE_MAX=12;
  function strikeHours(h){
    h=Math.max(1,Math.min(STRIKE_MAX, h|0));
    try{
      var set=(window.__SFX_APPROVED&&window.__SFX_APPROVED.time_pass)||[];
      if(!set.length) return 0;            /* unjudged is silent, always */
      if(typeof BOH_SFX==='undefined'||typeof MUS==='undefined') return 0;
      MUS.audio(); var AC=MUS.AC; if(!AC) return 0;
      var dest=sfxBus()||MUS.OUT||MUS.MAST||AC.destination;
      var gap=(BOH_SFX.BEAT||0.5);
      var t0=AC.currentTime+0.06, fired=0;
      for(var i=0;i<h;i++){
        var v=vec('time_pass', set[i%%set.length]); if(!v) continue;
        /* heard in the room he is standing in, like everything else */
        var vv=(typeof window.__sfxInSpace==='function')?window.__sfxInSpace(v):v;
        if(BOH_SFX.render(vv,AC,dest,t0+i*gap)){ fired++; SFX_COUNT++; }
      }
      return fired;
    }catch(e){ return 0; }
  }
  window.__strikeHours=strikeHours;

  /* WHAT COUNTS AS TIME GOING BY. The run already reports the world clock every
     four seconds, so no new state and no new message: a JUMP in that number is
     time passing, and its size is how much. An hour is the floor -- walking
     around does not move the clock by an hour in four seconds, so ordinary play
     can never trigger this, and only a real skip (sleep, a wait, a long
     journey) can. Midnight is handled: 22:00 -> 06:00 reads as -960, which is
     eight hours forward, not minus sixteen. */
  var LASTMIN=null, LASTJUMP=null, TP_MIN=60, TP_LOG=[];
  function timePass(d){
    try{
      var m=+d.min; if(!isFinite(m)) return;
      if(LASTMIN===null){ LASTMIN=m; return; }
      var jump=m-LASTMIN; if(jump<0) jump+=1440;
      LASTMIN=m;
      LASTJUMP=jump;
      var struck=0;
      if(jump>=TP_MIN) struck=strikeHours(Math.round(jump/60));
      /* ONE ROW PER CLOCK MOVE, AND THE ROW OWNS ITS OWN STRIKES (8/12).
         Reporting only the LAST jump was not enough to tell a test's clock move
         from the run's. postMessage is asynchronous: the run's own four-second
         report can be DELIVERED between a test clearing its counter and the
         test's own message arriving, so its twelve strikes land in the test's
         count while the final jump still reads as the test's. Third time this
         class of bug has been shortened instead of closed. A per-call row
         closes it: a measurement asks for the row whose jump is the one it
         asked for, and somebody else's row is simply not that row. COUNT THE
         THING, NOT EVERYTHING. */
      TP_LOG.push({jump:jump, strikes:struck});
      if(TP_LOG.length>200) TP_LOG.shift();
    }catch(e){}
  }
  /* jump is reported so a test can tell ITS OWN clock move from somebody
     else's. The run reports the world clock every four seconds on its own, and
     a stray report landing between a test's two posts is a real jump that makes
     real strikes -- indistinguishable from the test's own unless the game says
     what it actually computed. */
  window.__timePassStats=function(){
    return {floorMin:TP_MIN, max:STRIKE_MAX, last:LASTMIN, jump:LASTJUMP,
            rows:TP_LOG.length}; };
  window.__timePassLog=function(from){ return TP_LOG.slice(from||0); };

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
  var NPC_PLAYED=0, NPC_PLACED=[];
  window.__npcPlayed=function(){ return NPC_PLAYED; };
  /* A LIST, NOT THE LAST ONE (8/14). A neighbour keeps walking on his own
     schedule, so "the most recent placement" is whatever step he happened to
     take after a test finished staging -- measured: a step staged at 3 tiles
     read back as gain 0.172, which is nearly nine tiles out. A test wants the
     step it asked for, so it gets the whole recent list and picks. */
  window.__npcPlaced=function(from){ return NPC_PLACED.slice(from||0); };
  /* ===== WHERE A SOUND IS (8/13) =========================================
     THE VALLEY WAS A FLAT STEREO FIELD. Every sound in the game arrived at the
     same level from the same nowhere, except one: a neighbour's footstep, which
     got distance and pan on 8/2 and has been the only spatial sound since. A
     door across the lot, a generator running somewhere, a dog -- all of them
     played as if they were happening inside your head. In a game whose whole
     texture is walking an empty city, WHERE a sound is IS the information.

     THREE CUES, and the order matters because only the first two are exact:
       1. LEVEL. The inverse law -- amplitude proportional to 1/r, about 6 dB
          per doubling. The researched model already used for footsteps,
          generalised here instead of copied a second time. 1/(1+k*r), never a
          linear fade: linear makes everything sound the same distance away
          until it abruptly does not.
       2. PAN. Left is left. A top-down view has no front/back to confuse, and
          faking one with filters would be inventing information the game does
          not have.
       3. COLOUR. Distant sound is DULLER, and the old code had no answer for
          this at all. Two real effects push the same way: air absorbs high
          frequencies faster than low ones (ISO 9613-1 is the standard that
          quantifies it), and the further away you are the more of what reaches
          you is reflection rather than direct sound.
          HONEST ABOUT THE NUMBERS: across a city block, literal atmospheric
          absorption is small. The curve below is a GAME DIAL chosen to read
          right, resting on a real direction rather than pretending to be a
          calculation. One word from him changes it.

     OCCLUSION IS THE FOURTH AND IT IS THE ONE A CITY NEEDS. A sound made inside
     a building and heard from the street has a wall in the way: much quieter,
     much duller. The run already knows inside from outside, so this costs no
     new state. A lowpass is a filter, not a delay -- SCREECH LAW is untouched.

     HIS VECTORS ARE NEVER EDITED. Placement copies the vector and moves the
     copy, exactly as the footstep path has always done: the verdict is on the
     SOUND, never on where the game puts it. */
  var LISTENER = { inside: false };
  function placeSound(ev, place, dest0){
    try{
      if(typeof BOH_SFX==='undefined' || typeof MUS==='undefined') return null;
      var c=pick(ev); if(c==null) return null;
      var v=vec(c[0],c[1]); if(!v) return null;
      MUS.audio(); var AC=MUS.AC; if(!AC) return null;
      var out = dest0 || sfxBus() || MUS.OUT || MUS.MAST || AC.destination;
      if(!out) return null;
      place = place || {};
      var dx = +place.dx || 0, dy = +place.dy || 0;
      var r = (place.dist != null) ? Math.max(0, +place.dist)
                                   : Math.sqrt(dx*dx + dy*dy);
      r = Math.max(0.5, r);
      var g = 1/(1 + 0.55*r);                    /* the inverse law, as before */
      /* A WALL BETWEEN YOU AND IT. Only when the two sides disagree: a sound
         made inside, heard inside, is not occluded. */
      var occl = (place.inside != null) && (!!place.inside !== !!LISTENER.inside);
      if(occl) g *= 0.55;
      if(g < 0.05) return null;                  /* too far to be information */
      /* THE COLOUR OF DISTANCE. Wide open at your feet, about 4 kHz a dozen
         tiles out, under 2 kHz across a block -- and a wall takes most of what
         is left off the top. */
      var cut = 18000/(1 + 0.30*r);
      if(occl) cut *= 0.35;
      cut = Math.max(320, Math.min(20000, cut));
      var gain = AC.createGain(); gain.gain.value = g;
      var lp = AC.createBiquadFilter(); lp.type='lowpass';
      lp.frequency.value = cut; lp.Q.value = 0.7;
      lp.connect(gain); gain.connect(out);
      var w={}, k; for(k in v) w[k]=v[k];        /* his vector, never edited */
      w.pan = Math.max(-1, Math.min(1, dx/6));
      BOH_SFX.render(w, AC, lp, place.when || null);
      SFX_COUNT++;
      return { gain:g, cut:cut, pan:w.pan, occluded:!!occl, ev:ev, dist:r };
    }catch(e){ return null; }
  }
  /* THE RUN SAYS WHERE IT IS STANDING, so occlusion has two sides to compare. */
  try{ window.__sfxListener=function(o){ if(o) LISTENER.inside=!!o.inside; }; }catch(_e){}
  try{ window.playSFXAt=placeSound; }catch(_e){}

  function npcStep(d){
    try{
      var r=Math.max(0.5, +d.dist||0);
      var g=1/(1+0.55*r);                    /* ~0.65 next to you, ~0.25 at 5 tiles */
      if(g<0.06) return;                     /* too far to be information */
      var pan=Math.max(-1,Math.min(1,(+d.dx||0)/6));
      var ev='step_'+(({asphalt:'asphalt',dirt:'dirt',gravel:'gravel'})[d.surface]
                      ||String(d.surface||'').replace('step_','')||'dirt');
      if(!APPROVED[ev]) ev='step_dirt';
      var c=pick(ev); if(c==null)return;
      var v=vec(c[0],c[1]); if(!v)return;
      if(typeof MUS==='undefined')return; MUS.audio(); if(!MUS.AC)return;
      /* NOT through the player's footstep bus. That bus is at 0.12 because HIS
         OWN steps fire constantly and would be fatiguing -- a neighbour's step
         is rare and is INFORMATION, and stacking 0.12 on top of distance made
         it 0.0095, which is a number, not a sound. Distance is the only thing
         that should quieten this. */
      var out=sfxBus(); if(!out)return;
      NPC_PLAYED++;   /* what the neighbour ACTUALLY played, for anything that
                         needs to ask. A test cannot get this from the bus peak:
                         the ambience bed shares that bus and fires one-shots
                         every 40-95s, so "the bus made a noise" attributes
                         somebody else's sound to the neighbour. */
      /* ONE PLACEMENT PATH, NOT TWO (8/13). This was the only spatial sound in
         the game and it grew its own distance/pan code; placeSound is that same
         model generalised, plus the colour of distance and occlusion. Keeping a
         second copy here is how the two drift and only one of them gets fixed.
         The NPC_PLAYED counter above still increments here, because it counts
         what the NEIGHBOUR played specifically and placeSound serves everyone. */
      /* WHAT WAS ACTUALLY PLACED, so a test can attribute instead of guess.
         The shared SFX bus cannot answer "how loud was the NEIGHBOUR" -- it
         cannot attribute a peak to a particular walker -- and while chasing
         that, this recording is what found the actual bug: a step staged three
         tiles away came back at gain 0.208, exactly 0.377 x 0.55, because the
         listener still believed the player was indoors and a wall was being
         applied that no longer existed. A blunt ruler had been showing that
         intermittently as "distance does not attenuate". The ACOUSTIC proof
         lives in spatial_sound_gate, which renders offline in isolation; what
         belongs here is ATTRIBUTION -- this step, that distance, this gain. */
      var _p = placeSound(ev, { dx:(+d.dx||0), dist:r, inside:false });
      if(_p){ NPC_PLACED.push({ dist:_p.dist, gain:_p.gain, cut:_p.cut, pan:_p.pan });
              if(NPC_PLACED.length>40) NPC_PLACED.shift(); }
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
      this.inside = !!d.inside;
      this.kind = d.inside ? 'air_inside' : (d.night ? 'air_night' : 'air_day');
    },
    /* THE RARE THING THAT BREAKS THE EMPTINESS (8/12). His 270-thumb sweep
       approved A GUST COMES THROUGH (2 of 5) and A GENERATOR, SOMEWHERE (4 of
       5), and both were written for exactly this slot: not a wall of wind, but
       the occasional thing you hear when nothing is happening. They ride the
       ambience clock instead of getting one of their own, so the valley still
       makes ONE sound at a time and the gaps stay long.
       OUTDOORS ONLY: a gust and a distant generator both say "out there", and
       air_inside is the sound of a room with nobody in it but you.
       THE FREQUENCIES ARE MY DEFAULT AND NOTHING DECIDED THEM BUT TASTE --
       one gust in four, one generator in eight, so seven of eight are still the
       bed he approved first. One word from him changes either number.
       A GENERATOR MEANS PEOPLE, so it is rarer than weather on purpose. */
    pick:function(){
      if(this.inside) return this.kind;
      var A=(window.__SFX_APPROVED||{});
      var r=Math.random();
      if(r<0.125 && (A.generator||[]).length) return 'generator';
      if(r<0.375 && (A.wind_gust||[]).length) return 'wind_gust';
      return this.kind;
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
          /* MUS.OUT before MUS.MAST: nothing that is not music may fall back
             to the MUSIC master, because MUS.stop() ducks it to zero. */
          this.bus.connect(sfxBus()||MUS.OUT||MUS.MAST||MUS.AC.destination);
        }
        var ev=this.pick();
        /* THE RARE ONES HAPPEN SOMEWHERE (8/14). His own briefs say it: a
           generator is "somewhere", a dog is "far off", a gust comes "through".
           All three arrived dead centre at full level, which is the one thing
           those descriptions rule out. The BED stays exactly where it was -- an
           air tone is the room you are in and has no direction -- but anything
           that is an EVENT out in the valley gets a place.
           THE DISTANCE IS A DIAL AND NOTHING DECIDED IT BUT TASTE: far enough
           to read as "out there", near enough to stay information. */
        if(ev!==this.kind){
          var side=(Math.random()*2-1);
          placeSound(ev, { dx: side*7, dist: 6+Math.random()*9, inside:false },
                     this.bus);
          this.last=ev; return;
        }
        var set=APPROVED[ev]; if(!set||!set.length) return;
        var i=set[(Math.random()*set.length)|0];
        var v=vec(ev,i); if(!v) return;
        BOH_SFX.render(v,MUS.AC,this.bus,null);
        this.last=ev; SFX_COUNT++;
      }catch(e){}
    }
  };
  window.__AMB=AMB;
  setInterval(function(){ AMB.tick(); }, 1000);
  /* the parent's own surfaces: every button on the phone is a UI TAP.
     EXCEPT ON A SURFACE WHOSE JOB IS PLAYING A SOUND (Paolo 8/4: "I CANT HEAR
     THE SOUNDS IF THE UI THAT PLAYS SOUNDS EVERYTIME I CLICK A BUTTON ALSO MAKE
     A SOUND WHEN I CLICK PLAY ON A NEW SOUND IM TESTING"). He is right, and it
     made the entire soundboard useless: the tap fired on the SAME CLICK as the
     candidate, so his own approved UI tick played on top of every sound he was
     trying to judge. A judging surface has to be silent except for the thing
     being judged.
     MARKED BY CONTAINER, never by guessing at labels: anything inside the SFX
     judge, the soundboard, the mix panel or the music studio's transport is
     auditioning audio and never gets a tap over it. data-noui is the escape
     hatch for any panel built later, so the next audition surface does not have
     to rediscover this the hard way. */
  var NOUI='#sfxWrap,#sbWrap,#mixWrap,.mus-play,.mus-cell,[data-noui]';
  document.addEventListener('click',function(e){
    var t=e&&e.target; if(!t)return;
    if(t.closest&&t.closest(NOUI)) return;   /* this click IS a sound already */
    var btn = t.closest && (t.closest('button')||t.closest('.tab')||t.closest('.opt'));
    if(!btn) return;
    /* BACK IS NOT FORWARD (8/12). ui_tap was carrying every interface moment in
       the game by itself. His sweep approved BACK/CLOSE (3 of 5) and YOU CANNOT
       DO THAT (3 of 5), so the interface finally answers in more than one way:
       leaving a screen is a step DOWN from the tap, and a refusal is short and
       flat and never a buzzer -- his own brief, in his own row.
       READ OFF WHAT THE BUTTON ALREADY SAYS, never a new attribute nobody sets:
       a disabled control is a refusal, and a control whose text or aria-label is
       back/close/cancel/x is a way out. If neither, it is a tap, exactly as
       before -- this can only ever narrow ui_tap, never silence it. */
    var A = window.__SFX_APPROVED || {};
    var lab = ((btn.getAttribute&&(btn.getAttribute('aria-label')||''))+' '+
               (btn.textContent||'')).trim().toLowerCase();
    var refused = btn.disabled === true
               || (btn.classList && (btn.classList.contains('off')
                                  || btn.classList.contains('disabled')));
    if(refused && (A.ui_deny||[]).length) return window.playSFX('ui_deny');
    if((A.ui_back||[]).length &&
       /^(back|close|cancel|done|x|<|\u2039|\u00d7|\u2190)$/.test(lab)) return window.playSFX('ui_back');
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
/* THE SAME THING, BUT IT HAPPENED SOMEWHERE (8/14). The parent has had a full
   placement model since 8/13 -- distance, pan, the colour of distance, and a
   wall between you and it -- and exactly ONE caller: a neighbour's footstep,
   which was already spatial before any of it was written. A door across the lot
   still arrived dead centre at full level. Built-but-not-triggered is the defect
   this lane has a law about, and shipping the engine without the callers is that
   defect wearing a nicer commit message.
   THE RUN INVENTS NOTHING HERE. It knows the tile a thing happened on and it
   knows where the player is standing; the offsets below are subtraction. */
function sfxAt(ev,gx,gy,when){
  try{
    if(!(window.parent&&window.parent!==window)) return;
    var dx=0, dy=0, dist=null;
    if(typeof gx==='number' && typeof gy==='number' &&
       typeof px==='number' && typeof py==='number'){
      dx=gx-px; dy=gy-py; dist=Math.sqrt(dx*dx+dy*dy);
    }
    window.parent.postMessage({type:'BOHEMIA_SFX_AT', ev:ev, dx:dx, dy:dy,
      dist:dist, inside:(mode!=='ext'), when:when||null},'*');
  }catch(_e){}
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
/* AND THE INSTANT IT CHANGES (8/14). The four-second tick is fine for the
   ambience bed, which is a slow bed, and WRONG for occlusion, which is a
   yes/no about the wall you just walked through. Crossing a threshold left the
   parent believing you were still on the other side of it for up to four
   seconds, so every sound in that window was muffled -- or not muffled -- by a
   wall that is no longer there. MEASURED, not theorised: a neighbour's step
   staged three tiles away came back placed at gain 0.208, which is exactly the
   0.377 the inverse law gives times the 0.55 an occluder takes, because the
   listener still thought it was indoors.
   enter() and leave() are the only two doors into that state, so they say so
   the moment they run. */
(function(){
  try{
    var _enter=window.enter, _leave=window.leave;
    if(typeof _enter==='function') window.enter=function(){ var r=_enter.apply(this,arguments); try{ sfxWhere(); }catch(_e){} return r; };
    if(typeof _leave==='function') window.leave=function(){ var r=_leave.apply(this,arguments); try{ sfxWhere(); }catch(_e){} return r; };
  }catch(_e){}
})();

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
/* THE GROUND GOT FINER (8/12). Paolo approved step_concrete, step_sand and
   step_wood in his 270-thumb sweep, and this classifier only knew three
   surfaces -- so a sidewalk, a motel floor and deep desert sand all came out as
   the same footstep he had already heard. Sidewalks and interior slabs are
   CONCRETE, not roadway; a floorboard is not a road; open desert away from any
   named surface is SAND, not the packed dirt of a lot.
   ORDER IS THE SPEC: the more specific name wins, and the road test still runs
   first because a drivable surface is asphalt whatever the tile is called.
   step_glass and step_metal are NOT here: he killed all ten. */
function sfxGround(gx,gy){
  try{
    var n='';
    try{ n=(NAMEG&&NAMEG[gy]&&NAMEG[gy][gx]||'').toLowerCase(); }catch(_e){}
    if(mode!=='ext'){                              /* indoors is a hard floor */
      if(/wood|board|plank|porch|deck|parquet/.test(n)) return 'step_wood';
      return 'step_concrete';
    }
    if(typeof isRoad==='function' && isRoad(gx,gy)) return 'step_asphalt';
    if(/gravel|shoulder|rock|caliche|lag|track/.test(n)) return 'step_gravel';
    if(/wood|board|plank|porch|deck|boardwalk/.test(n)) return 'step_wood';
    if(/sidewalk|walk|concrete|apron|pad|slab|platform|court|patio|curb/.test(n))
      return 'step_concrete';
    if(/asphalt|roadway|lane|street|path|lot|parking/.test(n))
      return 'step_asphalt';
    if(/sand|dune|wash|desert|scrub|playa/.test(n)) return 'step_sand';
    if(!n) return 'step_sand';                     /* open valley: the ground is sand */
    return 'step_dirt';                            /* named yards and lots */
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
    # AND THE CHECK FOR "ALREADY DONE" IS A PROPERTY, NOT A BYTE MATCH (8/15).
    # It used to test for the exact replacement string, so the moment the mix
    # patch inserted MUS.OUT into that same line this tool started printing
    # "no footstep bus found to reroute (another lane may have moved it)" on a
    # bus that was correctly routed the whole time. A false alarm about someone
    # else's lane is worse than no message: it is a bug report pointing at the
    # wrong file. What actually matters is that STEP_BUS reaches __SFXBUS.
    _connect = [ln for ln in alpha.split('\n') if 'STEP_BUS.connect(' in ln]
    if _old in alpha:
        alpha = alpha.replace(_old, _new, 1)
        print('  footstep bus rerouted through the SFX master (their gain untouched)')
    elif any('__SFXBUS' in ln for ln in _connect):
        print('  footstep bus already reaches the SFX master (one slider covers it)')
    elif not _connect:
        print('  NOTE: no footstep bus in this build at all')
    else:
        print('  WARNING: STEP_BUS exists and does NOT reach __SFXBUS -- the one '
              'sound the volume slider cannot turn down:\n    ' + _connect[0].strip())

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

    # ---- THE DOOR DRAGGING OPEN (8/9) --------------------------------
    # He killed all ten metal/wood doors on 7/30, named DOORS in the minimum
    # demo sound set on 8/9, and thumbed door_drag.0 UP the same day. So the
    # door finally makes a noise, and openDoor() is the honest place for it:
    # it is the moment a door STARTS opening and it is already guarded against
    # re-entry ("if open or opening, return"), so one real opening is one
    # sound rather than one per animation frame.
    #
    # THE SHUT STAYS SILENT, ON PURPOSE. He killed all five door_clack
    # candidates in the same export. Playing the drag backwards, or reusing it
    # for the close, would be putting a sound on a moment he ruled has none.
    door_anchor = "  d.state='opening'; d.t0=Date.now();"
    if "sfxAt('door_drag'" not in run:
        if door_anchor not in run:
            print('FAIL: cannot find openDoor to wire the door sound')
            return 1
        run = run.replace(door_anchor,
                          door_anchor
                          + "\n  /* HIS 8/9 THUMB, AT THE DOOR (8/14). doorKey() encodes the tile, so\n     the sound can say where it happened without the run inventing\n     anything. HONEST ABOUT THE SIZE OF THIS: a door the PLAYER opens is\n     always adjacent, so distance barely moves the level -- what it buys\n     is correct OCCLUSION when you open one from the street, and ONE\n     path, so a door somebody ELSE opens is already spatial the day the\n     game has one. The SHUT stays silent: he killed all five clacks. */\n  try{ var _dk=String(k).split(':').pop().split(',');\n       sfxAt('door_drag', +_dk[0], +_dk[1]); }catch(_e){ sfx('door_drag'); }",
                          1)

    # ---- YOU SLEEP (8/15) ------------------------------------------------
    # HE REVERSED HIMSELF AND THE NEWEST DATE WINS. On 8/7 he killed all five
    # SLEEP candidates while approving all five TIME_PASS, and the wire above
    # read those two together as ONE decision: sleeping is a QUANTITY of time,
    # not a ceremony of its own, so an eight-hour night got eight clock strikes
    # and nothing else. That reading was honest and it is now SUPERSEDED. He
    # swept sleep_sink FIVE OF FIVE on 8/15 -- one of only two clean sweeps in
    # any batch since the demo set -- and a 5/5 is not a maybe.
    #
    # WHAT CHANGED IS THE SOUND, NOT THE MOMENT. The killed SLEEP candidates
    # were modal, a struck object announcing bedtime. sleep_sink is FRICTION at
    # 96 Hz with almost no room in it (space 0.16): weight settling, not an
    # event being declared. That is the difference his thumbs drew, and it is
    # the same line the four deaths in this batch drew from the other side --
    # every big-room candidate died, both no-room candidates swept.
    #
    # THE HOURS STILL STRIKE. This does not replace the 8/7 wire, it sits under
    # it: the sink fires the instant you lie down, the clock jump is picked up
    # by the parent's four-second world report and counts the night off after
    # it. Settle, then hear how long it was.
    #
    # ONE CALL SITE, AND IT IS THE FUNNEL. sleepSave() is where BOTH sleeps
    # arrive -- spendTime('SLEEP') calls it, and so does the SLEEP AND SAVE
    # button on the save sheet. Wiring it here is one sound per real sleep by
    # construction rather than by a guard.
    sleep_anchor = ("function sleepSave(){ writeSave('slept'); "
                    "toast('You slept. Saved.'); renderSaveSheet(); }")
    if "sfx('sleep_sink')" not in run:
        if sleep_anchor not in run:
            print('FAIL: cannot find sleepSave to wire his 5/5 sleep sound')
            return 1
        run = run.replace(sleep_anchor,
                          "function sleepSave(){ sfx('sleep_sink');"
                          "   /* HIS 8/15 SWEEP, 5/5. Supersedes the 8/7 reading that\n"
                          "        sleep is only a quantity of time -- the hours still\n"
                          "        strike on top of this. */\n"
                          "  writeSave('slept'); toast('You slept. Saved.'); "
                          "renderSaveSheet(); }", 1)

    # ---- YOU GO DOWN (8/16) ----------------------------------------------
    # THE ONE CANDIDATE HE KEPT out of thirty-five. went_down.4, modal ash at
    # 88 Hz with three hits -- an impact, then the body finishing its fall.
    # It fires the instant the fight is scored a loss, BEFORE loadClosest()
    # rolls the world back to the last save: the sound belongs to the moment
    # you went down, not to the reload that answers it. Putting it after would
    # play his sound over a world that has already forgotten the fight.
    # ONE SITE COVERS BOTH ENDINGS -- reload-to-save and no-save-to-return-to.
    down_anchor = "    if(!d.victory){"
    if "sfx('went_down')" not in run:
        if run.count(down_anchor) != 1:
            print('FAIL: the defeat branch is not present exactly once (%d)'
                  % run.count(down_anchor))
            return 1
        run = run.replace(down_anchor,
                          down_anchor
                          + "\n      sfx('went_down');"
                            "   /* HIS 8/16 SURVIVOR: the one of thirty-five he kept.\n"
                            "         Fired BEFORE the rollback, because the sound belongs\n"
                            "         to going down and not to the save that answers it. */",
                          1)

    # ---- YOU COME UP (8/16b) ---------------------------------------------
    # 4 of 5, all his own voices (dawnpad, dawnwash, edenmist, solarhum). The
    # other half of the sleep he swept 5/5 back on 8/15: you lie down and the
    # sink plays, you wake and this does. The run says the words already --
    # "You woke up in your own house" -- so the moment exists and was silent.
    wake_anchor = "toast('You woke up in your own house. Walk out the front door.');"
    if "sfx('come_up')" not in run:
        if run.count(wake_anchor) != 1:
            print('FAIL: the wake toast is not present exactly once (%d)'
                  % run.count(wake_anchor))
            return 1
        run = run.replace(wake_anchor,
                          "sfx('come_up');"
                          "   /* HIS 8/16b, 4 of 5, all his own instruments. The other\n"
                          "        half of the sleep he swept five of five. */\n"
                          + wake_anchor, 1)

    open(RUN, 'w', encoding='utf8').write(run)
    r = subprocess.run(['node', 'tools/build_run_slice.js'], capture_output=True, text=True)
    if r.returncode != 0:
        print('FAIL: the run would not rebuild:\n' + (r.stderr or '')[-800:])
        return 1
    built = open(BUILT, encoding='utf8').read()
    if ('SFX WIRE, RUN SIDE' not in built or 'sfxGround(px,py)' not in built
            or "sfx('phone_buzz')" not in built or "sfx('eat')" not in built
            or "sfx('sleep_sink')" not in built
            or "sfx('went_down')" not in built
            or "sfx('come_up')" not in built
            or "sfxAt('door_drag'" not in built):
        print('FAIL: the rebuilt run does not carry the wire')
        return 1

    # RE-APPLY THE TOOLS THAT LIVE INSIDE THE BLOCK THIS TOOL OWNS.
    # THIS IS NOT A CONVENIENCE, IT IS A CORRECTNESS FIX. The parent wire is
    # removed and re-injected wholesale on every run, and
    # bohemia_sfx_space_patch.py edits playSFX *inside* it. So running this tool
    # silently DELETED the acoustic spaces -- no error, no obvious diff, the same
    # two-tools-one-seam defect that duplicated two songs earlier today. The gate
    # caught it, which is the only reason it is not still deleted.
    # Ordering must be ENFORCED, never remembered: whoever owns the seam re-runs
    # whatever lives inside it.
    # ORDER MATTERS AND IT IS WRITTEN DOWN, not remembered. The mix patch
    # reroutes the SFX bus off MUS.MAST (the music OFF button used to mute the
    # whole game) and the space patch edits playSFX. Both live INSIDE the block
    # this tool rebuilds, so both are destroyed by it and both must come back.
    # The first version of this list had only the space patch, and the gate
    # immediately went red on nine checks because the bus had silently gone back
    # to riding the music master. A partial dependency list is not a dependency
    # list.
    for dep in ('tools/bohemia_sound_mix_patch.py',
                'tools/bohemia_sfx_space_patch.py'):
        if os.path.exists(dep):
            rr = subprocess.run(['python3', dep], capture_output=True, text=True)
            if rr.returncode != 0:
                print('FAIL: %s could not re-apply after the wire:' % dep)
                print((rr.stdout + rr.stderr)[-500:])
                return 1
            print('  re-applied %s (it lives inside the block this tool owns)' % dep)

    print('THE APPROVED SOUNDS PLAY NOW.')
    print('  %d approved sounds across %d events, from his 8/15 full sweep' % (n, len(bank)))
    print('  YOU SLEEP and you hear it (his 8/15 5/5), and the hours still strike')
    print('  footsteps chosen by the tile the game already knows')
    print('  phone buzz on a real post, EAT on the thing the room held (his 8/2 ruling)')
    print('  the door DRAGS open (his 8/9 thumb); the SHUT stays silent, also his')
    return 0


if __name__ == '__main__':
    sys.exit(main())
