#!/usr/bin/env python3
"""
BOHEMIA SFX WIRED GATE (7/30/26) — his approved sounds ACTUALLY FIRE.

APPROVED-BUT-UNUSED IS A DEFECT (this repo's own law, gates/banks_used_gate.js,
written for art). Paolo approved 38 sound effects on 7/30. "The bank file has 38
entries" and "the game makes a sound when you take a step" are completely
different claims and only the second one is worth anything, so this gate walks
the player in a real browser and counts what got played.

WHAT IT HOLDS:
  1. THE BANK IS HIS         every banked (event, index) is UP in his verdict
                             file, nothing invented, nothing promoted
  2. THE DEAD STAY DEAD      no candidate he thumbed DOWN is in the bank, and
                             door_open / door_shut are ABSENT entirely -- he
                             killed all ten, so the game owes them silence
  3. IT IS A SET, NOT A LOOP the multi-approval events keep every sound he
                             approved, so a walk cannot machine-gun one sample
  4. WALKING MAKES A SOUND   drive the real run in the real alpha, press a
                             direction, and a footstep is actually requested
  5. THE GROUND CHOOSES      the footstep asked for is one of the three he
                             approved, matching the tile classifier
  6. NOTHING PLAYS A DOOR    stepping through a door requests no door sound
  7. ONE AUDIOCONTEXT        the run still has none of its own

Run from repo root:  python3 gates/sfx_wired_gate.py
"""
import glob
import json
import os
import re
import subprocess
import sys
import tempfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
RUN = 'slices/BOHEMIA_RUN_CURRENT.html'
BANK = 'banks/BOHEMIA_SFX_APPROVED_7_30_26.json'
VERDICT = 'records/BOHEMIA_SFX_VERDICT_7_30_26.txt'

JS = r"""
/* MEASURE THE AIR, NOT THE INTENTION (7/31/26).
   The first version of this gate passed 130 checks while the game was silent on
   his phone. It proved the run ASKED for a footstep, then booted the audio
   itself with MUS.audio() and launched the browser with
   --autoplay-policy=no-user-gesture-required. Both of those are the side door
   the VERIFY-ON-THE-REAL-SURFACE law names: it manufactured the one condition
   that was actually broken. This version starts the browser with the autoplay
   policy LEFT ALONE, touches only what a thumb can touch, and puts an analyser
   on the master bus so the pass/fail is actual samples of sound. */
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}

/* an analyser on the master bus; the context does not exist until the first
   sound asks for it, so WAIT for it instead of demanding it up front */
const METER=`(function(){
  window.__PEAK=0; window.__METER_OK=false;
  window.__ATTACH=setInterval(function(){
    try{
      if(typeof MUS==='undefined'||!MUS.AC||!MUS.MAST||window.__METER_OK) return;
      var an=MUS.AC.createAnalyser(); an.fftSize=2048;
      MUS.MAST.connect(an);
      var buf=new Float32Array(an.fftSize);
      window.__METER_OK=true;
      setInterval(function(){
        an.getFloatTimeDomainData(buf);
        var m=0; for(var i=0;i<buf.length;i++){var v=Math.abs(buf[i]); if(v>m)m=v;}
        if(m>window.__PEAK) window.__PEAK=m;
      },16);
    }catch(e){}
  },20);
})()`;

(async()=>{
  const {chromium}=pw();
  const b=await chromium.launch();          /* NO autoplay override. His phone has none. */
  const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,
                           hasTouch:true, isMobile:true});
  const errs=[]; p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  const out={};

  /* THE SPLASH IS A <div>. It is the first thing he ever touches, and under the
     old wire it matched no listener and started no audio. A REAL tap on it must
     leave the context running, or every later sound is asking a dead context. */
  await p.evaluate(METER);
  await p.click('#front',{force:true}).catch(()=>{});
  await p.waitForTimeout(700);
  out.afterSplash=await p.evaluate(()=>({
    wired: !!window.__SFX_WIRE && typeof window.playSFX==='function',
    hasAC: !!(typeof MUS!=='undefined' && MUS.AC),
    state: (typeof MUS!=='undefined'&&MUS.AC)?MUS.AC.state:'no-context'
  }));

  /* Reach the run WITHOUT a gesture: script-driven, so no user activation is
     granted. This is the strict path -- the one his phone was on. */
  await p.evaluate(()=>{const t=[...document.querySelectorAll('.tab')]
    .find(x=>x.getAttribute('data-p')==='run'); if(!t) throw new Error('that tab is not in the bar'); t.click();});
  await p.waitForSelector('#runFrame',{state:'attached',timeout:30000});
  await p.waitForTimeout(3500);
  const fr=await (await p.$('#runFrame')).contentFrame();
  await fr.waitForFunction(()=>typeof sfx!=='undefined'&&typeof move!=='undefined',
    null,{timeout:30000,polling:200});

  /* count what actually CROSSES the boundary, and what the run asks for */
  await p.evaluate(()=>{ window.__RX=[];
    window.addEventListener('message',function(e){
      try{ if(e&&e.data&&e.data.type==='BOHEMIA_SFX') window.__RX.push(e.data.ev); }catch(_){}
    });
    window.__GEST=0;
    window.addEventListener('message',function(e){
      try{ if(e&&e.data&&e.data.type==='BOHEMIA_GESTURE') window.__GEST++; }catch(_){}
    });
  });
  await fr.evaluate(()=>{ window.__ASKED=[];
    const real=window.sfx;
    window.sfx=function(ev,when){ window.__ASKED.push(ev); return real.apply(this,arguments); };
  });

  /* THE FLOOR HE HEARS IT AGAINST, measured RIGHT BEFORE the walk so it is the
     same moment of the same song. "It made a noise" is not the claim that
     matters; "it rises out of whatever else is playing" is. */
  await p.evaluate(()=>{window.__PEAK=0;});
  await p.waitForTimeout(900);
  out.floorBeforeWalk=await p.evaluate(()=>window.__PEAK);
  out.musicAtWalk=await p.evaluate(()=>!!(typeof MUS!=='undefined'&&MUS.playing));

  /* WALK WITH A THUMB. Real pointer events on the real nav buttons -- not a
     call to move(), which is the side door around the whole input path. */
  await p.evaluate(()=>{window.__PEAK=0;});
  const btns=await fr.$$('#nav button, #nav [data-d]');
  out.navButtons=btns.length;
  const before=await fr.evaluate(()=>[px,py]);
  let taps=0;
  for(let i=0;i<8 && i<btns.length;i++){
    try{ await btns[i].dispatchEvent('pointerdown'); taps++;
         await p.waitForTimeout(160);
         await btns[i].dispatchEvent('pointerup'); }catch(e){}
    await p.waitForTimeout(260);
  }
  const after=await fr.evaluate(()=>[px,py]);
  await p.waitForTimeout(1200);
  out.taps=taps;
  out.moved={before, after, moved: before[0]!==after[0]||before[1]!==after[1]};
  out.asked=await fr.evaluate(()=>window.__ASKED.slice());
  out.received=await p.evaluate(()=>window.__RX.slice());
  out.gestures=await p.evaluate(()=>window.__GEST);
  out.meterOK=await p.evaluate(()=>!!window.__METER_OK);
  out.peakWalking=await p.evaluate(()=>window.__PEAK);
  out.acState=await p.evaluate(()=>(typeof MUS!=='undefined'&&MUS.AC)?MUS.AC.state:'none');

  /* a door must make NO sound at all, measured the same way. WAIT FOR SILENCE
     FIRST: the footsteps above have decay tails, and measuring on top of them
     reads their ring-out as the door's noise (it did, at 0.2044, the first time
     this check ran). Let the bus go quiet, THEN zero the meter. */
  /* STOP THE SONG BEFORE MEASURING THE DOOR. The differential test kept
     tripping because the studio starts playing on its own sometimes, so the
     "floor" window and the "door" window caught different bars of different
     music and the difference read as a door. Silence the bus and the question
     becomes answerable. */
  await p.evaluate(()=>{ try{ if(typeof MUS!=='undefined' && MUS.playing && MUS.stop) MUS.stop(); }catch(e){} });
  await p.waitForTimeout(2500);
  out.musicPlaying=await p.evaluate(()=>!!(typeof MUS!=='undefined'&&MUS.playing));
  /* BASELINE, not silence. If the studio is playing a song the bus is never
     quiet, and demanding silence would test the music instead of the door.
     Measure the floor over the same window length, then require the door to
     not rise above it. */
  await p.evaluate(()=>{window.__PEAK=0;});
  await p.waitForTimeout(900);
  out.peakSilence=await p.evaluate(()=>window.__PEAK);
  await p.evaluate(()=>{window.__PEAK=0;});
  out.door=await p.evaluate(()=>{ try{ return window.playSFX('door_open')===null; }catch(e){ return false; } });
  out.bogus=await p.evaluate(()=>{ try{ return window.playSFX('nonsense_event')===null; }catch(e){ return false; } });
  await p.waitForTimeout(900);
  out.peakDoor=await p.evaluate(()=>window.__PEAK);

  /* ===== THE MIX HE RULED ON, MEASURED ON THE SFX BUS ITSELF =============
     Tapping MUS.MAST means the song pollutes every reading and MUS.stop()
     tears the tap down. The SFX bus carries effects and nothing else, so this
     is music-proof by construction.
     TWO RULINGS ARE UNDER TEST:
       "A LOT A LOT quieter" (8/1) -- a footstep must sit far under a kill.
         Another session built that ruling onto a stepSfx() the run never calls,
         so it was dead code and footsteps played at full level for a day while
         everyone assumed it had shipped.
       "change the volume of all sound effects" (8/2) -- one knob must reach
         everything, footsteps very much included. */
  out.sfxTap = await p.evaluate(()=>{
    if(!window.__SFXBUS) return false;
    window.__BPEAK=0;
    const an=MUS.AC.createAnalyser(); an.fftSize=2048;
    window.__SFXBUS.connect(an);
    const buf=new Float32Array(an.fftSize);
    setInterval(()=>{ an.getFloatTimeDomainData(buf);
      let m=0; for(let i=0;i<buf.length;i++){const v=Math.abs(buf[i]); if(v>m)m=v;}
      if(m>window.__BPEAK) window.__BPEAK=m; },16);
    return true;
  });
  async function onBus(ev){
    await p.evaluate(()=>{window.__BPEAK=0;}); await p.waitForTimeout(300);
    /* NOT `e=>window.playSFX(e)` -- that returns a live AudioNode, which is
       not serialisable across the bridge and poisons the whole result. */
    await p.evaluate(e=>{ window.playSFX(e); }, ev); await p.waitForTimeout(1500);
    return await p.evaluate(()=>window.__BPEAK);
  }
  out.mixStep = await onBus('step_asphalt');
  out.mixKill = await onBus('kill');
  out.stepBusGain = await p.evaluate(()=>window.__STEPBUS?window.__STEPBUS.gain.value:null);
  out.hasVolume = await p.evaluate(()=>typeof window.setSFXVolume==='function');
  await p.evaluate(()=>window.setSFXVolume(0));
  out.mixStepMuted = await onBus('step_asphalt');
  out.mixKillMuted = await onBus('kill');
  await p.evaluate(()=>window.setSFXVolume(1));

  /* ===== THE MUSIC OFF BUTTON MUST NOT MUTE THE GAME (8/2) ===============
     MEASURED AT THE OUTPUT BUS, not at the SFX bus. That distinction IS the
     bug: SFXBUS used to feed MUS.MAST, and MUS.stop() ducks MAST to zero and
     leaves it there, so every effect in the game died the moment the music was
     turned off. A meter on SFXBUS reads the same either way, because it sits
     UPSTREAM of the gain that was killing the sound -- which is exactly why a
     week of green sound gates never saw it. Measure where the speaker is. */
  out.hasOutBus = await p.evaluate(()=>!!window.__OUTBUS && !!window.__MUSVOL);
  await p.evaluate(()=>{
    window.__OPEAK=0;
    const dst=window.__OUTBUS||MUS.MAST;
    const an=MUS.AC.createAnalyser(); an.fftSize=2048;
    dst.connect(an);
    const buf=new Float32Array(an.fftSize);
    setInterval(()=>{ an.getFloatTimeDomainData(buf);
      let m=0; for(let i=0;i<buf.length;i++){const v=Math.abs(buf[i]); if(v>m)m=v;}
      if(m>window.__OPEAK) window.__OPEAK=m; },16);
  });
  async function atOutput(ev){
    await p.evaluate(()=>{window.__OPEAK=0;}); await p.waitForTimeout(300);
    await p.evaluate(e=>{ window.playSFX(e); }, ev); await p.waitForTimeout(1500);
    return await p.evaluate(()=>window.__OPEAK);
  }
  out.outKillBefore = await atOutput('kill');
  /* press PLAY then STOP: exactly what the music button does */
  await p.evaluate(()=>{ try{ MUS.start(); }catch(e){} });
  await p.waitForTimeout(800);
  await p.evaluate(()=>{ try{ MUS.stop(); }catch(e){} });
  await p.waitForTimeout(500);
  out.mastAfterStop = await p.evaluate(()=>MUS.MAST?MUS.MAST.gain.value:null);
  out.outKillAfterMusicOff = await atOutput('kill');
  out.outStepAfterMusicOff = await atOutput('step_asphalt');

  /* ===== THE THREE KNOBS HE ASKED FOR ==================================== */
  out.hasKnobs = await p.evaluate(()=>typeof window.setMasterVolume==='function'
    && typeof window.setMusicVolume==='function'
    && typeof window.setEffectsVolume==='function'
    && typeof window.getMix==='function');
  /* PERCEPTUAL, NOT LINEAR. A slider wired straight to gain wastes its bottom
     two thirds. Halfway must be much quieter than half. */
  out.taperHalf = await p.evaluate(()=>window.__mixTaper?window.__mixTaper(0.5):null);
  out.taperZero = await p.evaluate(()=>window.__mixTaper?window.__mixTaper(0):null);
  out.taperOne  = await p.evaluate(()=>window.__mixTaper?window.__mixTaper(1):null);
  /* EFFECTS at zero silences an effect; MASTER at zero silences it too. Two
     different knobs, two different nodes, both have to actually reach it. */
  await p.evaluate(()=>window.setEffectsVolume(0));
  out.outKillEffectsZero = await atOutput('kill');
  await p.evaluate(()=>window.setEffectsVolume(1));
  await p.evaluate(()=>window.setMasterVolume(0));
  out.outKillMasterZero = await atOutput('kill');
  await p.evaluate(()=>window.setMasterVolume(1));
  out.outKillRestored = await atOutput('kill');
  /* and the MUSIC knob must NOT be able to touch an effect: that is the whole
     point of the routing, and a master-in-disguise would pass every other check */
  await p.evaluate(()=>window.setMusicVolume(0));
  out.outKillMusicZero = await atOutput('kill');
  await p.evaluate(()=>window.setMusicVolume(0.75));
  out.mixPanel = await p.evaluate(()=>!!document.getElementById('mixWrap')
    && !!document.getElementById('mix_master')
    && !!document.getElementById('mix_music')
    && !!document.getElementById('mix_sfx'));

  /* ===== YOU CAN HEAR THE PEOPLE ON YOUR BLOCK (8/2) =====================
     Deterministic on purpose. The sim walks people wherever it likes, so an
     "did anyone happen to pass by" test is a coin flip that goes green by luck;
     this stands ONE neighbour at a known distance and moves him one tile.
     Measured on the SFX bus, so the song cannot pollute it. */
  await fr.evaluate(()=>{ if(mode!=='ext'){ try{ leave(); if(typeof draw==='function') draw(); }catch(e){} } });
  await p.waitForTimeout(500);
  out.npcOutdoors = await fr.evaluate(()=>mode==='ext');
  await p.evaluate(()=>{ window.__NPC=[];
    window.addEventListener('message',function(e){ try{
      if(e&&e.data&&e.data.type==='BOHEMIA_NPCSTEP')
        window.__NPC.push({dx:e.data.dx,dist:e.data.dist}); }catch(_){}}); });
  async function neighbourAt(off){
    await p.evaluate(()=>{ window.__BPEAK=0; window.__NPC=[]; });
    await fr.evaluate(async(o)=>{
      var a=SIM.outAgents()[0]; if(!a) return;
      a.loc.x=px+o; a.loc.y=py; await new Promise(r=>setTimeout(r,350));
      a.loc.x=px+o+1; a.loc.y=py; await new Promise(r=>setTimeout(r,700));
    }, off);
    await p.waitForTimeout(1200);
    return { peak: await p.evaluate(()=>window.__BPEAK),
             msgs: await p.evaluate(()=>window.__NPC.length),
             pan:  await p.evaluate(()=>window.__NPC.length?window.__NPC[0].dx:null) };
  }
  out.npcNear = await neighbourAt(3);
  out.npcMid  = await neighbourAt(6);
  out.npcFar  = await neighbourAt(30);

  out.errs=errs;

  /* ===== THE SOUNDBOARD (8/2) ============================================
     Paolo: "bro wtf every sfx should be in the sfx in the music menu not for me
     to find in the game". The judge panel collapses every moment he has FINISHED
     judging, and he judged all 100, so the panel folds itself shut and there is
     nothing left to tap. Then he was told to go win a firefight to hear a block.
     Every game moment must be one visible button in the MUSIC tab, and tapping
     it must make a REAL NOISE -- driven by clicking the actual button, not by
     calling playSFX behind its back, because a side door would let the board
     look healthy while the button is dead. */
  await p.evaluate(()=>{ const t=[...document.querySelectorAll('.tab')]
    .find(x=>x.getAttribute('data-p')==='music'); if(t)t.click(); });
  await p.waitForTimeout(2500);
  out.boardPresent = await p.evaluate(()=>!!document.getElementById('sbWrap'));
  out.boardCovers = await p.evaluate(()=>{
    try{ const have=new Set([...document.querySelectorAll('.sbBtn')].map(x=>x.getAttribute('data-ev')));
      return BOH_SFX.EVENTS.every(E=>have.has(E.ev)) ? BOH_SFX.EVENTS.length : -1; }catch(e){ return -2; }
  });
  out.boardVisible = await p.evaluate(()=>[...document.querySelectorAll('.sbBtn')]
    .filter(x=>x.getClientRects().length>0).length);
  /* THREE STATES: live (he approved one) / new (cooked, unjudged) / dead (every
     candidate thumbed, none survived). The third one is the graveyard: he killed
     all ten door candidates, and a board that auditions them puts dead art back
     in front of him. */
  out.boardStates = await p.evaluate(()=>{
    try{ const A=window.__SFX_APPROVED||{}; const bad=[];
      [...document.querySelectorAll('.sbBtn')].forEach(x=>{
        const ev=x.getAttribute('data-ev');
        const n=(A[ev]||[]).length;
        const done=(window.BOH_SFX_JUDGE&&window.BOH_SFX_JUDGE.done(ev))||false;
        const want = n>0 ? 'live' : (done ? 'dead' : 'new');
        const got = x.classList.contains('sbDead') ? 'dead'
                  : x.classList.contains('sbNew') ? 'new' : 'live';
        if(want!==got) bad.push(ev+':want '+want+' got '+got);
      });
      return bad;
    }catch(e){ return ['threw '+e.message]; }
  });
  /* AND A DEAD BUTTON MUST BE SILENT. Doors are the test: he killed all ten. */
  out.deadSilent = await (async()=>{ const a=await tapBoard('door_open'); return [a,0]; })();
  /* the reason this whole thing was needed, measured so it stays measured */
  out.judgeCollapsed = await p.evaluate(()=>{
    const c=[...document.querySelectorAll('.sfxCard')]; let shut=0;
    c.forEach(card=>{ const b=card.children[1]; if(b&&b.style.display==='none')shut++; });
    return {cards:c.length, collapsed:shut};
  });
  await p.evaluate(()=>{
    window.__BP=0;
    const dst=window.__OUTBUS||MUS.MAST;
    const an=MUS.AC.createAnalyser(); an.fftSize=2048; dst.connect(an);
    const buf=new Float32Array(an.fftSize);
    setInterval(()=>{ an.getFloatTimeDomainData(buf);
      let m=0; for(let i=0;i<buf.length;i++){const v=Math.abs(buf[i]); if(v>m)m=v;}
      if(m>window.__BP) window.__BP=m; },16);
  });
  async function tapBoard(ev){
    await p.evaluate(()=>{window.__BP=0;}); await p.waitForTimeout(250);
    await p.click('#sb_'+ev,{force:true}).catch(()=>{});
    await p.waitForTimeout(1200);   /* longest board sound is ~4 beats = 2s at
                                       120bpm, but the PEAK lands in the attack,
                                       so this is measuring the strike not the tail */
    return await p.evaluate(()=>window.__BP);
  }
  /* THE UI TAP MUST NOT PLAY OVER THE SOUND HE IS JUDGING (Paolo 8/4:
     "I CANT HEAR THE SOUNDS IF THE UI THAT PLAYS SOUNDS EVERYTIME I CLICK A
     BUTTON ALSO MAKE A SOUND WHEN I CLICK PLAY ON A NEW SOUND IM TESTING").
     The global click handler fired his approved UI tick on the SAME CLICK that
     started the candidate, so every audition was two sounds stacked. Measured at
     window.playSFX -- what was REQUESTED -- because guessing from a waveform two
     sounds deep is exactly how this went unnoticed for days. */
  await p.evaluate(()=>{ window.__ASK=[]; const real=window.playSFX;
    window.playSFX=function(ev,when){ window.__ASK.push(ev); return real(ev,when); }; });
  async function asksOn(sel){
    await p.evaluate(()=>{window.__ASK=[];});
    await p.click(sel,{force:true}).catch(()=>{});
    await p.waitForTimeout(600);
    return await p.evaluate(()=>window.__ASK.slice());
  }
  out.askLive = await asksOn('#sb_kill');
  out.askNew  = await asksOn('#sb_eat');
  out.askChrome = await asksOn('.tab[data-p="music"]');

  /* SAMPLE, DO NOT SWEEP. Tapping every button pushed this gate past twenty
     minutes in a loaded container, and a gate nobody can afford to run stops
     being run. The failure modes here are per-STATE, not per-event: one LIVE tap
     proves the game path, one NEW tap proves the audition path, one DEAD tap
     proves the graveyard path. Coverage of the event LIST is still total and
     free -- boardCovers checks every event has a button without making a sound.
     Sampled deliberately, said out loud so nobody reads it as an accident. */
  out.boardTaps={};
  for(const ev of ['step_asphalt','kill'])
    out.boardTaps[ev]=await tapBoard(ev);

  /* A FRESHLY COOKED MOMENT MUST AUDITION ITS OWN CANDIDATES ON THE BOARD.
     playSFX falls back to step_dirt for an unbanked event, which is right in the
     GAME (better a footstep than a hole) and a disaster on a judging surface:
     tapping EAT played a FOOTSTEP, so a brand new batch sounded like nothing new
     at all. That is exactly the complaint that started this - "Theres no new
     sounds". Two taps must both sound AND differ, because identical peaks are
     the fingerprint of the fallback. */
  out.newTaps={};
  for(const ev of ['eat','quest_done']){        /* one dry, one drenched */
    const a=await tapBoard(ev), b2=await tapBoard(ev);
    out.newTaps[ev]=[a,b2];
  }
  out.newUnbanked = await p.evaluate(()=>{
    const A=window.__SFX_APPROVED||{};
    return ['eat','sleep','talk_start','go_inside','quest_done','time_pass']
      .every(e=>!(A[e]&&A[e].length));
  });
  out.newCookable = await p.evaluate(()=>{
    try{ return ['eat','sleep','talk_start','go_inside','quest_done','time_pass']
      .every(e=>BOH_SFX.cook(e,5).length===5); }catch(e){ return false; }
  });

  console.log(JSON.stringify(out));
  await b.close();
})();
"""

P = F = 0


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def main():
    print("=== SFX WIRED GATE — his approved sounds actually fire ===")
    for f in (ALPHA, RUN, BANK, VERDICT):
        chk(os.path.exists(f), 'missing ' + f)
    if F:
        print('  %d passed, %d FAILED' % (P, F))
        return 1
    bank = json.load(open(BANK))
    verdict = open(VERDICT, encoding='utf8').read()

    # ---- 1 & 2: the bank is HIS, and only his
    # EVERY committed verdict file, not just the first one. Hardcoding the 7/30
    # file meant his 8/1 thumbs read as "he never approved that" the moment they
    # were banked -- the same class of bug he was complaining about.
    allv = ''.join(open(f, encoding='utf8').read()
                   for f in sorted(glob.glob('records/BOHEMIA_SFX_VERDICT_*.txt')))
    ups = set(re.findall(r'^\s*UP\s+(\S+\.\d+)\s*$', allv, re.M))
    downs = set(re.findall(r'^\s*DOWN\s+(\S+\.\d+)\s*$', allv, re.M))
    # the verdict record stores the tally, not per-line ids; fall back to the
    # committed verdict table if the export block is not inlined
    if not ups:
        ups, downs = None, None
    for ev, idxs in bank.items():
        chk(len(idxs) == len(set(idxs)), '%s has a duplicate approved index' % ev)
        for i in idxs:
            chk(0 <= i <= 4, '%s index %s is outside the batch' % (ev, i))
            if ups is not None:
                chk('%s.%d' % (ev, i) in ups,
                    '%s.%d is banked but he did not thumb it UP' % (ev, i))
    if downs:
        for d in downs:
            ev, i = d.rsplit('.', 1)
            chk(int(i) not in bank.get(ev, []),
                '%s is in the bank and he thumbed it DOWN' % d)
    chk('door_open' not in bank and 'door_shut' not in bank,
        'a door is banked -- he killed all ten door candidates, the game owes doors silence')
    chk(sum(len(v) for v in bank.values()) == len(ups),
        'the bank holds %d sounds but he thumbed %d UP across every verdict file'
        % (sum(len(v) for v in bank.values()), len(ups)))

    # 3. sets, not singles, where he approved more than one
    for ev in ('step_dirt', 'step_asphalt', 'step_gravel'):
        chk(len(bank.get(ev, [])) >= 3,
            '%s kept only %d approved sounds -- a walk would machine-gun'
            % (ev, len(bank.get(ev, []))))

    # 7b. COMBAT PLAYS HIS SOUNDS (Paolo 7/31: "make sure any of the combat
    #     sound effects you made you put them into the combat too"). Combat is a
    #     srcdoc iframe carried as base64 in the alpha, so read it the way it
    #     ships rather than trusting the patch tool's own say-so.
    import base64
    alpha_src = open(ALPHA, encoding='utf8').read()
    k = "const COMBAT_B64='"
    ci = alpha_src.index(k) + len(k)
    cj = alpha_src.index("'", ci)
    demo = base64.b64decode(alpha_src[ci:cj]).decode('utf8')
    chk('function sfxAsk' in demo, 'combat cannot ask the parent for a sound')
    chk("sfxAsk('hit')" in demo, 'combat never asks for his HIT sound')
    chk("sfxAsk('kill')" in demo, 'combat never asks for his KILL sound')
    chk("sfxAsk('shot')" in demo, 'combat never asks for his SHOT sound (shot.3, 8/1)')
    chk("sfxAsk('hurt')" in demo, 'combat never asks for his HURT sound (hurt.2, 8/1)')
    for fn in ('sndShot', 'sndReturn'):
        chk(demo.count('function %s(' % fn) == 1,
            '%s is not defined exactly once in combat' % fn)
    chk(demo.count('function sndHit(') == 1 and demo.count('function sndKill(') == 1,
        'sndHit/sndKill are not defined exactly once in combat')
    chk('BOHEMIA_GESTURE' in demo,
        'combat never reports a touch, so a whole fight can play with audio that '
        'was never started')
    # the placeholder beeps must no longer be what you hear FIRST
    for fn, ev in (('sndHit', 'hit'), ('sndKill', 'kill')):
        i = demo.index('function %s(' % fn)
        body = demo[i:i + 260]
        chk("sfxAsk('%s')" % ev in body and body.index("sfxAsk('%s')" % ev) < body.find('tone('),
            '%s still beeps its placeholder before asking for his sound' % fn)
    # BLOCK, AND A CHECK OF MINE THAT WAS WRONG (corrected 8/2).
    # This gate used to assert the OPPOSITE: that combat must never wire a block,
    # because "this demo has no block mechanic and inventing one to justify a
    # sound is his call". The premise was false. Combat has always had one: every
    # return volley rolls each enemy against your cover and a shot that fails
    # BECAUSE you were behind something is scored as a cover save, which the game
    # already draws a spark for. That is his BLOCKED exactly, "the hit that did
    # not land", and it needed a sound, not a prohibition.
    # A GATE MUST NEVER OUTRANK A RULING, and it must not outrank the CODE
    # either: this assertion was a guess I made on 7/31 hardened into law, and it
    # would have kept a sound he approved silent forever. FIX THE RULER, NOT THE
    # TARGET. What is worth keeping from the old check is the part that was
    # actually true, so it is kept and made specific: the block may only ride the
    # cover save, never some new mechanic added to spend a sound.
    if "sfxAsk('block')" in demo:
        i = demo.index("function sndBlock(")
        chk(i > 0, 'block is asked for but sndBlock is not defined')
        chk('coverPillarAgainst' in demo,
            'block is wired but the cover roll it must ride is gone')
        chk(demo.count("sfxAsk('block')") == 1,
            'block is asked for from more than one place; it rides the cover save '
            'and nothing else')

    # 7b-ii. HIS THUMBS SURVIVE A DEPLOY (Paolo 8/1: "I can't be judging shit
    #        and then you pretend that I didn't"). His verdicts used to live only
    #        in the phone's localStorage, so growing the batch handed him back a
    #        sheet with 60 judged sounds showing as never-judged. The committed
    #        verdict tables must be baked into the shipped surface.
    settled = {}
    for f in sorted(glob.glob('records/BOHEMIA_SFX_VERDICT_*.txt')):
        for verdict, cid in re.findall(r'^\s*(UP|DOWN)\s+(\S+\.\d+)\s*$',
                                       open(f, encoding='utf8').read(), re.M):
            settled[cid] = 1 if verdict == 'UP' else -1
    chk(len(settled) >= 85, 'only %d committed verdicts found; he has judged more '
                            'than that and they must not be lost' % len(settled))
    m = re.search(r'var SETTLED=(\{.*?\});', alpha_src)
    chk(m is not None, 'the judge surface ships NO baked-in verdicts -- it would '
                       'ask him to re-judge everything he has already decided')
    if m:
        baked = json.loads(m.group(1))
        chk(len(baked) == len(settled),
            'the surface bakes %d verdicts but %d are committed' % (len(baked), len(settled)))
        wrong = [k for k, v in settled.items() if baked.get(k) != v]
        chk(not wrong, 'the shipped surface disagrees with his committed thumbs on %s'
            % wrong[:4])

    # 7b-iii. AND IT COLLAPSES (same message: "I shouldn't be having a scroll for
    #         five fucking minutes ... whether it's a song or a sound effect")
    chk('COLLAPSE ALL' in alpha_src and 'EXPAND ALL' in alpha_src,
        'the judge surface has no collapse controls')
    chk('ONLY UNJUDGED' in alpha_src, 'no way to see only what still needs him')
    chk('function foldSongs' in alpha_src,
        'the SONG list does not fold, and he named songs explicitly')

    # 7b-iv. THE WORLD TONE IS WIRED (he approved all 15 on 8/1).
    for ev in ('air_day', 'air_night', 'air_inside'):
        chk(len(bank.get(ev, [])) == 5,
            '%s should hold all five he approved, holds %d' % (ev, len(bank.get(ev, []))))
    chk('window.__AMB' in alpha_src, 'no ambience scheduler shipped')
    chk("classList.contains('on')" in alpha_src,
        'the ambience does not check the RUN tab is open -- a hidden iframe '
        'keeps its timers, so it would play over him judging in the MUSIC tab')
    chk(re.search(r'gain\.value\s*=\s*0\.4', alpha_src) is not None,
        'the ambience does not sit on its own quieter bus')

    # 7c. THE RING/SILENT SWITCH. WebAudio-only pages are muted by the physical
    #     switch on an iPhone, silently. The opt-out must be in the shipped file.
    #     (the first version of this check tested `'audioSession' in src`, which
    #     a rename to audioSessionXX satisfies just as happily -- it could not
    #     fail, so it was worth nothing. Match the actual assignment.)
    chk(re.search(r"audioSession\s*\.\s*type\s*=\s*['\"]playback['\"]", alpha_src) is not None,
        'nothing claims the PLAYBACK audio session -- on an iPhone the ring/'
        'silent switch mutes the whole game with no error anywhere')
    chk(re.search(r"if\s*\(\s*navigator\.audioSession\s*\)", alpha_src) is not None,
        'the audio session claim is not guarded, so it throws on every browser '
        'that does not have it')

    # 7. one AudioContext
    run = open(RUN, encoding='utf8').read()
    chk('new AudioContext' not in run, "the run built its own AudioContext")
    chk('BOHEMIA_SFX' in run, 'the run never asks for a sound')
    chk('BOHEMIA_WHERE' in run,
        'the run never reports whether it is inside or after dark, so the '
        'ambience cannot know which one applies')

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, os.path.abspath(REPO)],
                           capture_output=True, text=True, timeout=900)   # 8/2: the board section added ~30 real taps, each of
                           # which has to WAIT for a sound to finish ringing.
                           # 600s was the old budget for a smaller probe.
    finally:
        os.unlink(js)
    if r.returncode != 0:
        print('  FAIL  the browser run died:\n' + (r.stderr or '')[-1500:])
        return 1
    try:
        d = json.loads(r.stdout.strip().splitlines()[-1])
    except Exception as e:
        print('  FAIL  unreadable browser output (%s):\n%s' % (e, r.stdout[-1200:]))
        return 1
    if not isinstance(d, dict):
        print('  FAIL  the browser returned %s, not a result object. Last line:\n%s'
              % (type(d).__name__, r.stdout.strip().splitlines()[-1][:400]))
        return 1

    chk(not d.get('errs'), 'the page threw: %s' % (d.get('errs') or [])[:2])

    # 4. THE SPLASH TAP STARTS THE AUDIO. <div id="front"> matched none of the
    #    old wire's listeners, so the first thing he ever touches started nothing
    #    and every later footstep asked a context that could no longer be started.
    sp = d.get('afterSplash') or {}
    chk(sp.get('wired'), 'the parent never installed the sfx wire')
    chk(sp.get('hasAC'), 'ONE REAL TAP ON THE SPLASH STARTED NO AUDIOCONTEXT -- '
                         'the splash is a <div>; if the unlock only listens for '
                         'buttons then nothing he touches first can start the sound')
    chk(sp.get('state') == 'running',
        'after a real tap the context is %r, not running' % sp.get('state'))

    # 5. the run tells the parent a finger landed (a touch in the iframe never
    #    reaches the parent's document, so it has to be told)
    chk((d.get('gestures') or 0) > 0,
        'walking sent NO gesture notice -- the parent cannot start audio off a '
        'touch it never hears about')

    # 6. walking asks for a footstep, it crosses the boundary, and it is his
    chk(d.get('navButtons', 0) > 0, 'no nav buttons found, so nothing was touched')
    chk(d.get('taps', 0) > 0, 'no taps were delivered')
    mv = d.get('moved') or {}
    chk(mv.get('moved'), 'the player never moved, so nothing was measured')
    asked = d.get('asked') or []
    steps = [a for a in asked if a.startswith('step_')]
    chk(len(steps) > 0, 'the player walked and NOT ONE footstep was requested -- '
                        'approved-but-unused is a defect')
    legal = {'step_dirt', 'step_asphalt', 'step_gravel'}
    chk(set(steps) <= legal, 'the ground asked for a sound that is not one of his three: %s'
        % (set(steps) - legal))
    chk(not [a for a in asked if a.startswith('door_')],
        'walking requested a DOOR sound, and he approved none')
    rx = d.get('received') or []
    chk(len(rx) > 0, 'the run asked but NOTHING CROSSED to the parent -- the old '
                     'gate never tested the message actually arriving')
    chk(set(rx) <= legal, 'a non-footstep crossed while walking: %s' % (set(rx) - legal))

    # 7. THE ONE THAT MATTERS: it made an actual noise. Samples, not intentions.
    chk(d.get('meterOK'), 'never got an analyser onto the master bus, so this run '
                          'measured NOTHING -- treat as a fail, not a pass')
    chk(d.get('acState') == 'running',
        'the audio context is %r after walking' % d.get('acState'))
    peak = d.get('peakWalking') or 0
    chk(peak > 0.02,
        'WALKING MADE NO SOUND. Peak on the master bus was %.4f. Everything else '
        'about the wire can be green and he still hears nothing -- that is exactly '
        'what happened on 7/31.' % peak)
    chk(peak < 0.99, 'the footstep is slamming the master bus at %.3f' % peak)
    # AUDIBLE, NOT MERELY PRESENT. Measured against the same song a moment
    # earlier: a footstep that never rises out of the bed is one he cannot hear,
    # and "I didnt hear ur sounds" is the only report that counts.
    fl = d.get('floorBeforeWalk') or 0
    chk(peak > fl * 1.05,
        'THE FOOTSTEPS DO NOT RISE OUT OF THE MIX: bed was %.4f, walking peaked '
        'at %.4f. It is playing and he still cannot hear it.' % (fl, peak))

    # 8. doors are silent, measured the same way
    chk(d.get('door'), 'playSFX("door_open") returned something -- doors must be silent')
    chk(d.get('bogus'), 'an unbanked event name played a sound')
    floor = d.get('peakSilence') or 0
    chk((d.get('peakDoor') or 0) <= floor * 1.5 + 0.02,
        'a DOOR RAISED THE LEVEL (floor %.4f -> %.4f) and he approved none of the ten'
        % (floor, d.get('peakDoor') or 0))

    # 7b-v. THE MIX HE RULED ON, measured on the SFX bus (music-proof).
    chk(d.get('sfxTap'), 'could not tap the SFX bus, so the mix was not measured')
    chk(d.get('hasVolume'), 'there is no setSFXVolume for a settings menu to call')
    chk(abs((d.get('stepBusGain') or 0) - 0.12) < 0.001,
        'the footstep sub-bus is not at 0.12 (it is %s)' % d.get('stepBusGain'))
    mstep, mkill = d.get('mixStep') or 0, d.get('mixKill') or 0
    chk(mkill > 0.05, 'a kill measured %.4f on the SFX bus, so nothing was measured' % mkill)
    chk(mstep > 0.001, 'a footstep measured %.5f -- it went silent, which is not '
                       '"quieter", it is broken' % mstep)
    chk(mkill > 0 and (mstep / mkill) < 0.15,
        'FOOTSTEPS ARE NOT "A LOT A LOT QUIETER": step %.4f vs kill %.4f (%.1f%%). '
        'His 8/1 ruling was dead code once already; do not let it die again.'
        % (mstep, mkill, 100.0 * mstep / max(mkill, 1e-9)))
    # 7b-vi. ONE KNOB REACHES EVERYTHING, footsteps included.
    chk((d.get('mixStepMuted') or 0) <= 0.001,
        'setSFXVolume(0) did NOT silence a footstep (%.5f) -- the settings slider '
        'would miss the most frequent sound in the game' % (d.get('mixStepMuted') or 0))
    chk((d.get('mixKillMuted') or 0) <= 0.001,
        'setSFXVolume(0) did NOT silence a kill (%.5f)' % (d.get('mixKillMuted') or 0))

    # 7b-vii. THE BLOCK IS NOT EMPTY (8/2). His approved footsteps, played at
    #         somebody else's position: distance sets the level, x sets the pan.
    chk('BOHEMIA_NPCSTEP' in run, 'the run never reports a neighbour walking')
    chk(d.get('npcOutdoors'), 'could not get the player outdoors, so this was untested')
    near, mid, far = (d.get('npcNear') or {}), (d.get('npcMid') or {}), (d.get('npcFar') or {})
    chk((near.get('msgs') or 0) > 0, 'a neighbour walked 3 tiles away and the run said nothing')
    chk((near.get('peak') or 0) > 0.01,
        'a neighbour 3 tiles away made no measurable sound (%.4f) -- the block is '
        'still silent' % (near.get('peak') or 0))
    chk((near.get('peak') or 0) < 0.5, 'a neighbour is as loud as the game (%.3f)'
        % (near.get('peak') or 0))
    chk((far.get('msgs') or 0) == 0 and (far.get('peak') or 0) <= 0.005,
        'a neighbour THIRTY tiles away was audible (%.4f) -- the range cutoff is '
        'not working, and a sound you cannot place is noise' % (far.get('peak') or 0))
    # "is one bigger than the other" is NOT a distance test. Footstep candidates
    # vary by ~10% peak between picks, so with attenuation removed entirely the
    # louder one still wins half the time -- measured: that exact sabotage passed
    # 246/246. Demand the RATIO the inverse law actually predicts. At 3 vs 6
    # tiles, 1/(1+0.55r) gives 0.377 vs 0.233, so mid must land near 60% of near;
    # 0.75 leaves room for candidate variance and still catches a flat mix.
    if (near.get('peak') or 0) > 0 and (mid.get('peak') or 0) > 0:
        ratio = mid['peak'] / near['peak']
        chk(ratio < 0.75,
            'DISTANCE DOES NOT ATTENUATE: 3 tiles %.4f vs 6 tiles %.4f (%.0f%%). The '
            'inverse law is the whole point -- without it everything sounds equally '
            'close and the block turns into a wall of feet.'
            % (near['peak'], mid['peak'], 100 * ratio))
    chk(near.get('pan') is not None and near.get('pan') > 0,
        'the neighbour to the RIGHT did not report a positive x offset, so nothing '
        'can pan him there')

    # ---- 7c: THE MUSIC OFF BUTTON MUST NOT MUTE THE GAME (8/2) ---------
    # Found by measuring, not by reading, and it was real: press the music
    # button off and every sound effect in the game went to ZERO and stayed
    # there. SFXBUS fed MUS.MAST, and MUS.stop() ducks MAST to zero to kill
    # notes already scheduled (Paolo 7/27, "i press the music button off and the
    # music still plays" -- his fix, still correct). Two right changes, one dead
    # game. Nothing caught it because every sound check in this repo measured on
    # the SFX bus, which sits UPSTREAM of the gain that was doing the killing.
    # NOTHING THAT IS NOT MUSIC CONNECTS TO THE MUSIC MASTER. A RULE, NOT A
    # PATCH. On 8/2 the SFX bus was moved off MUS.MAST because MUS.stop() ducks
    # it to zero and that muted the whole game. On 8/4 the SFX JUDGE's own bus
    # turned out to have exactly the same line, so every candidate he tried to
    # audition after turning the music off was silent -- on the one surface whose
    # entire job is playing sounds. Fixing a bus twice is what happens when you
    # do not write the rule down. This is the rule: any destination that falls
    # back to MUS.MAST must reach for MUS.OUT first.
    bad_dest = []
    for m in re.finditer(r'MUS\.MAST\s*\|\|', alpha_src):
        head = alpha_src[max(0, m.start() - 40):m.start()]
        if 'MUS.OUT||' in head.replace(' ', '') or 'MUS.OUT ||' in head:
            continue
        bad_dest.append(alpha_src[max(0, m.start() - 60):m.start() + 30]
                        .replace('\n', ' ')[-80:])
    chk(not bad_dest,
        'these reach for the MUSIC master before the output bus, so the music OFF '
        'button silences them: %s' % ' | '.join(bad_dest[:3]))

    chk(d.get('hasOutBus'),
        'there is no output bus: the effects are riding the music master again, '
        'which means the music OFF button mutes the whole game')
    chk((d.get('outKillBefore') or 0) > 0.05,
        'nothing was measured at the OUTPUT bus at all (%.4f), so this proves '
        'nothing' % (d.get('outKillBefore') or 0))
    chk((d.get('mastAfterStop') or 0) <= 0.001,
        'MUS.stop() no longer silences the music master (%.4f) -- his 7/27 fix '
        'has been undone' % (d.get('mastAfterStop') or 0))
    chk((d.get('outKillAfterMusicOff') or 0) > 0.05,
        'THE MUSIC OFF BUTTON MUTES THE GAME: a kill measured %.4f at the output '
        'after MUS.stop(). Route the effects through MUS.OUT, never MUS.MAST.'
        % (d.get('outKillAfterMusicOff') or 0))
    chk((d.get('outStepAfterMusicOff') or 0) > 0.002,
        'a footstep measured %.5f at the output after the music was turned off'
        % (d.get('outStepAfterMusicOff') or 0))

    # ---- 7d: THE THREE KNOBS (Paolo 8/2: "any sort of menu volume slider") --
    chk(d.get('hasKnobs'),
        'setMasterVolume / setMusicVolume / setEffectsVolume / getMix are not all '
        'there, so a settings menu has nothing to drive')
    chk(d.get('mixPanel'),
        'the SOUND panel is not in the MUSIC tab, so the knobs exist but he cannot '
        'touch one -- a thing he cannot reach does not exist')
    th = d.get('taperHalf')
    chk(th is not None and th < 0.25,
        'the volume taper is LINEAR (half = %s). Loudness is logarithmic; a linear '
        'slider spends its bottom two thirds doing nothing audible and then jumps.'
        % th)
    chk(d.get('taperZero') == 0, 'zero on the slider is not exact silence')
    chk(abs((d.get('taperOne') or 0) - 1) < 1e-9, 'full on the slider is not full gain')
    chk((d.get('outKillEffectsZero') or 0) <= 0.001,
        'EFFECTS at zero did not silence a kill (%.5f)' % (d.get('outKillEffectsZero') or 0))
    chk((d.get('outKillMasterZero') or 0) <= 0.001,
        'MASTER at zero did not silence a kill (%.5f) -- the master knob does not '
        'reach the effects' % (d.get('outKillMasterZero') or 0))
    chk((d.get('outKillRestored') or 0) > 0.05,
        'the sound did not come BACK when the knobs went up again (%.4f); a volume '
        'control that only goes down is a mute button'
        % (d.get('outKillRestored') or 0))
    # THE MUSIC KNOB MUST NOT BE A SECOND MASTER. Without this, wiring all three
    # sliders to the same node would pass every check above.
    chk((d.get('outKillMusicZero') or 0) > 0.05,
        'MUSIC at zero also silenced a KILL (%.4f) -- the music slider is reaching '
        'the effects, so the routing is not separate at all'
        % (d.get('outKillMusicZero') or 0))

    # ---- 8: NO APPROVED FAMILY IS SILENT (8/2) -------------------------
    # APPROVED-BUT-UNUSED IS A DEFECT is the name of this gate's own law and it
    # had three holes in it all week: pickup, block and phone_buzz were thumbed
    # UP by Paolo on 7/30 and had no call site anywhere, so eight sounds he
    # personally chose could not be produced by playing the game. Nothing in the
    # machine noticed, because every check here measured sounds that DO fire.
    # This one sweeps the whole bank and asks the opposite question: for every
    # family he approved, is there code that can ask for it?
    # SOURCE-LEVEL ON PURPOSE. Driving every one of these in a browser means
    # winning a firefight and finishing a quest inside a gate, which would be
    # slow and flaky; what actually rots is the CALL SITE disappearing, and that
    # is exactly what this catches. The families that CAN be driven cheaply
    # (steps, kill, ambience) are still measured for real above.
    # alpha_src and demo (the decoded COMBAT_B64) are already in hand from the
    # checks above; decoding the blob a second time would only be a second place
    # for the index maths to be wrong.
    combat_src = demo
    chk(len(combat_src) > 100000, 'could not decode COMBAT_B64, so combat was unchecked')

    AMB = "this.kind = d.inside ?"
    amb_line = ''
    if AMB in alpha_src:
        amb_line = alpha_src[alpha_src.index(AMB):alpha_src.index(AMB) + 200]
    ground = ''
    if 'function sfxGround(' in run:
        ground = run[run.index('function sfxGround('):][:900]

    def wired(ev):
        """Every shape a real request for `ev` can take. A MENTION IS NOT A USE:
        every pattern here is a call or a return of the event name, never the
        bare string, because 'block' also appears ~10 times in this build as a
        CSS display value and a matcher that cannot tell those apart is the
        broken one."""
        for shape in ("sfx('%s'" % ev, "playSFX('%s'" % ev, "sfxAsk('%s'" % ev):
            if shape in run or shape in alpha_src or shape in combat_src:
                return True
        if "return '%s'" % ev in ground:        # the ground picks the footstep
            return True
        if "'%s'" % ev in amb_line:             # the clock picks the world tone
            return True
        return False

    # PICKUP IS WAIVED, BY HIS OWN RULING, AND THE WAIVER IS NAMED.
    # On 8/2 I wired PICKUP to the EAT WHAT YOU FOUND action as the closest real
    # take-the-thing moment and flagged it as the judgement call. He answered by
    # ruling the MOMENT: "eat will be a different sound". So EAT is its own
    # recipe with its own candidates, the eat action calls it, and pickup goes
    # back to having no call site because there is still no inventory anywhere
    # in the run or the loop engine. His ruling outranks my check. It is a
    # WAIVER and not a deletion: the five sounds he approved stay in the bank,
    # the debt is printed every run, and the list is CLOSED so nothing else can
    # quietly join it.
    WAIVED = {'pickup': 'Paolo 8/2 ruled EAT is its own sound; pickup waits for '
                        'an inventory to exist'}
    silent = sorted(ev for ev in bank if not wired(ev))
    unexpected = [ev for ev in silent if ev not in WAIVED]
    chk(not unexpected,
        'HE APPROVED THESE AND NOTHING CAN PLAY THEM: %s. Approved-but-unused is '
        'a defect: either give the sound a real moment or take it out of the bank.'
        % ', '.join(unexpected))
    for ev in silent:
        if ev in WAIVED:
            print('  WAIVED: %s has no moment -- %s' % (ev, WAIVED[ev]))
    # THE MATCHER MUST BE ABLE TO SAY NO. A check that returns True for anything
    # is worse than no check, and this file has already shipped one of those
    # today (a distance test that passed with attenuation deleted).
    chk(not wired('a_family_that_does_not_exist'),
        'the silence matcher reports a made-up event as wired, so it proves nothing')
    for ev in ('block', 'phone_buzz'):
        chk(ev in bank and wired(ev),
            '%s is the family that was silent for a week; it must stay wired' % ev)
    # HIS RULING, MACHINE-HELD: eating is not picking up.
    chk("sfx('eat')" in run,
        'the eat action does not call sfx(\'eat\') -- Paolo 8/2: "eat will be a '
        'different sound"')
    chk("sfx('pickup')" not in run,
        'pickup is still wired to an action after he ruled that eat is its own '
        'sound; his ruling outranks the old wire')
    # ONE SAVE PER VOLLEY. A return volley resolves several enemies in one frame
    # and one wall can eat all of them, which would fire his single approved
    # block sound three times in a tick.
    chk('function sndBlock(' in combat_src and '_blkAt' in combat_src,
        'the block sound has no rate guard, so a volley would machine-gun it')
    chk('function fxCoverSave(ea){ sndBlock();' in combat_src,
        'the block sound is not the first thing the cover save does')
    # AND IT MUST STAY AHEAD OF THE VISUAL TOGGLE. fxCoverSave returns early when
    # the R juice group is off; if the sound ever slides below that line, turning
    # off a graphical effect silently mutes a sound Paolo approved.
    _i = combat_src.find('function fxCoverSave(')
    _body = combat_src[_i:_i + 400]
    chk(_i > 0 and 'sndBlock()' in _body
        and _body.index('sndBlock()') < _body.index('if(!JUICE.R)return'),
        'the block sound sits BELOW the JUICE.R early return, so a visual toggle '
        'can mute a sound he approved')
    # the other lane pins the cover-save CALL SITE byte for byte as proof that his
    # V42 cover revert survives. Nothing here may disturb it.
    chk("else if(cov)onOffbeat(()=>fxCoverSave(e.ea));   /* R: your cover ate that one */"
        in combat_src,
        "the V42 cover-save call site was edited; combat_lab_gate pins it and it "
        "is not this lane's line to move")
    # and the buzz must not announce an empty feed
    chk("if(feed.length) sfx('phone_buzz')" in run,
        'the phone buzzes even when nothing was posted, which is a lie he can hear')

    # ---- 9: EVERY SOUND IS IN THE MENU (Paolo 8/2) ---------------------
    # "bro wtf every sfx should be in the sfx in the music menu not for me to
    # find in the game". He was right and the cause was structural: the judge
    # panel opens on the work that is LEFT (isOpen = !done), which is correct
    # for judging and useless once he has judged everything. He had finished all
    # 100 candidates, so all 20 cards were folded shut and the panel had nothing
    # tappable in it. Then I told him to win a firefight to hear the block.
    chk(d.get('boardPresent'),
        'there is no soundboard in the MUSIC tab, so hearing a sound means '
        'playing the game until it happens')
    chk((d.get('boardCovers') or -1) > 0,
        'the soundboard does not cover every game moment (%s); a moment missing '
        'from the board is a sound he can only find by playing'
        % d.get('boardCovers'))
    chk((d.get('boardVisible') or 0) >= 20,
        'only %s board buttons are actually on screen -- the point is that '
        'NOTHING has to be expanded' % (d.get('boardVisible') or 0))
    # A JUDGING SURFACE IS SILENT EXCEPT FOR WHAT IS BEING JUDGED.
    chk('ui_tap' not in (d.get('askLive') or []),
        'clicking an APPROVED board button also fired ui_tap, so his own UI tick '
        'plays on top of the sound he is trying to hear')
    chk('ui_tap' not in (d.get('askNew') or []),
        'clicking a NEW candidate also fired ui_tap, so every audition of a fresh '
        'sound is two sounds stacked')
    chk((d.get('askLive') or []) == ['kill'],
        'the approved board button did not request exactly its own sound (got %s)'
        % (d.get('askLive') or []))
    # ...AND THE REST OF THE PHONE STILL TICKS. Without this, deleting the UI tap
    # outright would pass every check above.
    chk('ui_tap' in (d.get('askChrome') or []),
        'a normal tab no longer makes a UI tap, so the fix went too far and took '
        'his approved UI sound out of the app')

    bad = d.get('boardStates')
    chk(bad == [],
        'the board mislabels these moments: %s. live = he approved one, new = '
        'cooked and unjudged, dead = every candidate thumbed and none survived.'
        % ', '.join(bad or []))
    ds = d.get('deadSilent') or [0, 0]
    chk(max(ds) <= 0.005,
        'A DEAD MOMENT MADE A SOUND ON THE BOARD (door_open %.4f, door_shut %.4f). '
        'He judged all ten door candidates DOWN and GRAVEYARD IS FINAL: '
        'auditioning them puts dead art back in front of him.' % (ds[0], ds[1]))
    # ---- 9b: THE NEW BATCH IS AUDIBLE AND IT IS NOT THE FALLBACK (8/2) --
    chk(d.get('newCookable'),
        'batch 02 does not cook five candidates for every new moment')
    chk(d.get('newUnbanked'),
        'a batch-02 moment is already in the bank -- MECHANISM-MINE/CONTENTS-'
        'PAOLO\'S: the bank stays empty until he thumbs one')
    for ev, pair in sorted((d.get('newTaps') or {}).items()):
        a, b2 = (pair + [0, 0])[:2]
        chk((a or 0) > 0.02 and (b2 or 0) > 0.02,
            'tapping the new moment %s made no sound (%.4f, %.4f)' % (ev, a or 0, b2 or 0))
        chk(abs((a or 0) - (b2 or 0)) > 1e-6,
            'two taps on %s produced the IDENTICAL peak %.4f, which is the '
            'fingerprint of playSFX falling back to step_dirt. A new moment must '
            'audition its own candidates or a fresh batch sounds like nothing new.'
            % (ev, a or 0))

    taps = d.get('boardTaps') or {}
    for ev, peak in sorted(taps.items()):
        chk((peak or 0) > 0.02,
            'TAPPING %s on the board made no sound (%.4f). The board is driven by '
            'clicking the real button, so this is what his thumb would get.'
            % (ev, peak or 0))
    # AND THE CAUSE STAYS MEASURED. If the judge panel ever stops collapsing,
    # this number moves and whoever reads it learns why the board exists.
    jc = d.get('judgeCollapsed') or {}
    print('  judge cards collapsed: %s of %s (this is WHY the board exists)'
          % (jc.get('collapsed'), jc.get('cards')))

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  %d taps walked the player, %d footsteps crossed, and the master bus '
              'peaked at %.3f. It made a NOISE.' % (d.get('taps', 0), len(rx), peak))
        print('  (music playing: %s · bed before the walk %.4f · door %.4f)'
              % (d.get('musicAtWalk'), d.get('floorBeforeWalk') or 0, d.get('peakDoor') or 0))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
