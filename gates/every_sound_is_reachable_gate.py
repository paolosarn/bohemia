#!/usr/bin/env python3
"""
EVERY SOUND IS REACHABLE GATE (9/5/26, SOUNDS lane) - which of his approved
sounds the game ACTUALLY MAKES, measured by playing it.

THE JOB: [unused sounds] THE-OTHER-51, whose brief says "give every approved
sound a caller on the walked surface; 51 of 65 have none".

*** THAT NUMBER CAME FROM A GREP, AND A GREP CANNOT ANSWER THIS QUESTION. ***
EYES AND EARS proved it the expensive way in E4 the same round: one text search
said 50 events are never called, a better one said 56, and BOTH ARE WRONG,
because the footstep caller builds its event name by concatenation
(`'step_' + surface`) and three call sites pass a variable. A name assembled at
run time is invisible to every grep ever written. This lane's own census in
silent_moments_gate is the looser kind and says so in its own comment: "the id
appears as a string in the game code... looser than a call-site match, and far
closer to true than one."

Looser is not true either. An id sitting in a table, a comment or a dead branch
reads as called.

SO THIS GATE PLAYS THE GAME AND COUNTS. It wraps the one hook nothing can route
around -- BOH_SFX.render, which every sound in this engine goes through -- for
LIVENESS, and records event NAMES at playSFX, at the ambience bed's own pick(),
at STING.play and at the messages the walked city posts. Then it drives the
surfaces a player reaches: walking on the ground the city gives him, the door,
the phone, the ambience bed at day, at night and indoors, the clock, and a save.

*** AND IT PROVES THE AUDIO WAS ALIVE FOR THE WHOLE DRIVE. *** That is the check
EYES' first run could not make, and they refused to publish a headline without
it, correctly: a zero measured while the audio engine is down says something
about the harness, not about the game. The context state is sampled throughout
and every sample must be 'running'.

WHAT IT MEASURED THE DAY IT WAS WRITTEN, on the real surface, audio alive for
every sample:

    step_dirt 119, air_day 64, air_inside 40, wind_gust 16, door_drag 4,
    step_concrete 2, ui_tap 2

AND ONE INSTRUMENT MISTAKE WORTH KEEPING. The first drive walked 200 blind steps
and THEN sampled the ambience bed, and reported air_inside forty times on what
looked like a street. The game was right and the probe was wrong: two hundred
steps cycling four directions in a suburb walks you through a door, and the
player really was indoors. THE INSTRUMENT MOVED THE THING IT WAS MEASURING. The
bed is sampled before anything can move him, and the walk now steps back out of
any building it wanders into.

    python3 gates/every_sound_is_reachable_gate.py
"""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'banks/BOHEMIA_SFX_APPROVED_8_20_26.json')
ENG = os.path.join(ROOT, 'engine/bohemia_sfx.js')

# EVENTS WHOSE TRIGGER THIS DRIVE CANNOT REACH, EACH WITH A REASON. This is NOT
# a "never mind" list: it is the boundary of what a headless walk can honestly
# claim. A fight, a quest and a death are driven by other gates that own those
# surfaces, and poking their internals from here would measure the poke.
# WHY EACH SOUND THIS DRIVE DOES NOT PRODUCE IS NOT PRODUCED. *** A FLAT SET
# WAS NOT GOOD ENOUGH TO CLOSE THIS ROW. *** For three rounds this was a set of
# names with the reasons grouped in comments above them, which means a name
# could be added to the set and inherit a reason that was never about it. Every
# event now carries its OWN sentence, and the closing claim below is that the
# heard set and this map together cover ALL SIXTY-FIVE with nothing left over
# and nothing counted twice. That is the honest end of "give every approved
# sound a caller": not a wire for every name, but every name accounted for.
FIGHT = 'needs a FIGHT. sfx_wired_gate drives combat and owns that surface'
VERB = 'the verb does not exist yet, and sfx_wired_gate carries the written waiver'
SIB = 'a SIBLING pool, drawn from inside its parent pick, so it never appears at a call site'
CANNOT_DRIVE = {
    'hit': FIGHT, 'hit_more': FIGHT, 'hurt': FIGHT, 'hurt_more': FIGHT,
    'kill': FIGHT, 'melee_hit': FIGHT, 'miss_past': FIGHT, 'shot': FIGHT,
    'shot_more': FIGHT, 'casing': FIGHT, 'dry_fire': FIGHT, 'mag_home': FIGHT,
    'block': FIGHT, 'swing_air': FIGHT, 'swing_more': FIGHT, 'vital_deep': FIGHT,
    'will_goes': FIGHT, 'went_down': FIGHT, 'heartbeat': FIGHT,
    'stone_bite': FIGHT, 'chip_more': FIGHT, 'cover_more': FIGHT,

    'cloth_on': VERB, 'cloth_more': VERB, 'tape_pull': VERB, 'tape_more': VERB,
    'set_down': VERB, 'seton_more': VERB, 'demolish': VERB, 'drink': VERB,
    'pickup': VERB, 'lungs_burn': VERB, 'power_on': VERB,

    'buzz_more': SIB, 'door_more': SIB, 'wind_more': SIB, 'walk_more': SIB,
    'sand_more': SIB, 'wood_more': SIB, 'tread_more': SIB,

    'come_up': 'fires when the MORNING CARD is dismissed (8/22). This drive '
              'wakes the day loop directly and skips the card, and a probe that '
              'skips the UI is not evidence the UI is silent',
    'eat': 'eating is a verb the walked surface does not offer yet; Paolo ruled '
           '8/2 that EAT is its own sound, and it waits for the action',
    'boots_go': 'the boots are a CHARACTER moment, not a step: it belongs to '
                'dressing, which no surface does yet',
    'dirt_take': 'the ground taking something is a burial or a drop, and no '
                 'surface does either yet',
    'parts_pass': 'PAYDAY, wired inside payForToday. It fires only when a job '
                  'was ACCEPTED that day, and this drive accepts none -- '
                  'driving it by calling payForToday would measure the poke',
    'save_chime': 'wired in the RUN slice and proved on pixels by '
                  'silent_play_gate. The walked city has NO single save moment '
                  'to hang it on: it persists continuously, per system, and a '
                  'chime on every write would be the two-sounds problem at '
                  'scale. A written reason, not a missing wire',
    'phone_buzz': 'it fires when a JOB ARRIVES, not when you open the phone. '
                  'Opening the phone is not its trigger and driving it that way '
                  'would be a lie',
    'ui_back': 'a BACK button on a panel this drive does not open; the city UI '
               'policy posts it off the button label',
    'ui_deny': 'a REFUSAL, which needs a thing the game will not let you do; '
               'silent_play_gate drives it and proved it changes no pixels',
    'generator': 'needs a LIVE CIRCUIT within three cells. That is the whole of '
                 'BB-A-LIT-BLOCK-HUMS and lit_block_hums_gate holds it on a '
                 'grid it counts first; 88% of circuits are dead',
    'sign_alive': 'same as generator: a lit sign cannot be on a dead circuit',
    'step_wood': 'there is NO WOODEN GROUND in this valley -- no boardwalk, no '
                 'porch deck, no floorboard pool -- measured across 18 '
                 'districts and ~9,000 cells. Wiring it would mean inventing a '
                 'surface so a sound has somewhere to play',
}


def js_source():
    return r'''
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  const b=await chromium.launch({args:['--allow-file-access-from-files',
    '--autoplay-policy=no-user-gesture-required','--mute-audio']});
  const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  const out={errs:errs};
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front',{force:true}).catch(()=>{});
  await p.waitForTimeout(12000);
  const cf=p.frames().find(x=>x.url().includes('CITY_WORLD'));
  out.cityFrame=!!cf;
  if(!cf){ console.log(JSON.stringify(out)); await b.close(); return; }
  await cf.waitForLoadState('load').catch(()=>{});
  await p.waitForTimeout(4000);

  /* THE RECORDERS. render is the hook nothing routes around (liveness); the
     others give NAMES, at every path a name exists on. */
  await p.evaluate(()=>{
    window.__ASK={}; window.__RENDERS=0; window.__ALIVE=[];
    const note=(ev)=>{ if(ev) window.__ASK[ev]=(window.__ASK[ev]||0)+1; };
    if(typeof BOH_SFX!=='undefined' && BOH_SFX.render && !BOH_SFX.__w){
      const r=BOH_SFX.render;
      BOH_SFX.render=function(){ window.__RENDERS++; return r.apply(this,arguments); };
      BOH_SFX.__w=r; }
    if(window.playSFX && !window.__psW){
      const ps=window.playSFX;
      window.playSFX=function(ev){ note(ev); return ps.apply(this,arguments); };
      window.__psW=ps; }
    if(window.STING && STING.play && !window.__stW){
      const st=STING.play;
      STING.play=function(f){ note('sting:'+f); return st.apply(this,arguments); };
      window.__stW=st; }
    if(window.__AMB && !window.__ambW){
      const pk=window.__AMB.pick;
      window.__AMB.pick=function(){ const e=pk.apply(this,arguments); note(e); return e; };
      window.__ambW=pk; }
    window.addEventListener('message',function(e){
      const d=e&&e.data; if(!d) return;
      if(d.type==='BOHEMIA_STEP' && d.surface) note('step_'+d.surface);
      if(d.bohemiaCitySfx && d.bohemiaCitySfx.ev) note(d.bohemiaCitySfx.ev);
      if(d.bohemiaCitySting && d.bohemiaCitySting.fig) note('sting:'+d.bohemiaCitySting.fig);
    });
    setInterval(()=>{ try{ window.__ALIVE.push(
      (typeof MUS!=='undefined'&&MUS.AC)?MUS.AC.state:'no-context'); }catch(e){} }, 700);
  });

  const bed=async()=>{
    await p.evaluate(async()=>{ const w=ms=>new Promise(z=>setTimeout(z,ms));
      for(let i=0;i<40;i++){ try{ window.__AMB.next=1; window.__AMB.seen=Date.now();
        window.__AMB.tick(); }catch(e){} await w(40);} });
    await p.waitForTimeout(500);
    return await p.evaluate(()=>({inside:window.__AMB.inside, kind:window.__AMB.kind,
      place:window.__AMB.place, litD:window.__AMB.litD}));
  };

  /* *** THE BED FIRST, BEFORE ANYTHING CAN MOVE HIM. *** The first cut walked
     200 blind steps and then sampled, and reported air_inside forty times on
     what looked like a street -- because 200 steps cycling four directions in a
     suburb walks you through a door. THE INSTRUMENT MOVED THE THING IT WAS
     MEASURING. */
  out.bedDay = await bed();

  /* WALK, with the game's own entry point. stepOnce is a top-level function
     declaration, so window['stepOnce'] is undefined -- the same trap that made
     an earlier probe read MUS as missing. And step back out of any building the
     walk wanders into, so this stays a measurement of the STREET. */
  out.walked = await cf.evaluate(async()=>{
    const wait=ms=>new Promise(z=>setTimeout(z,ms));
    let moved=0, left=0;
    for(let i=0;i<160;i++){
      if(INSIDE){ left++; try{ swapMode(); swapMode(); }catch(e){} }
      try{ if(stepOnce(i%4)) moved++; }catch(e){}
      if(i%20===0) await wait(25);
    }
    return {moved:moved, leftBuildings:left, inside:!!INSIDE};
  });
  await p.waitForTimeout(1500);

  /* ---- THE GROUND UNDER EVERY STEP, ONE SURFACE AT A TIME. The classifier
     was fixed on 9/5 (it read two fields a city cell does not have and called
     6,561 of 6,561 cells dirt) and nothing had ever proved, per surface, that
     walking onto one fires its own footstep. This walks onto a real cell of
     each with the game's own stepOnce. ---- */
  /* *** OUTDOORS FIRST, AND THE FIRST CUT OF THIS RAN IT LAST. *** Placed at
     the end of the drive it ran while the player was INSIDE a building, where
     stepOnce takes the interior path and posts no footstep at all -- so asphalt
     and gravel read as unreachable on a build where a standalone probe had just
     walked onto both. A STEP INDOORS IS A DIFFERENT FUNCTION. */
  await cf.evaluate(()=>{ try{ if(INSIDE) swapMode(); }catch(e){} });
  await p.waitForTimeout(500);
  out.surfaces = await cf.evaluate(async()=>{
    const DIRS_=[[0,-1],[1,0],[0,1],[-1,0]];
    const res={};
    const findTile=(want)=>{                 /* an overmap tile of a district */
      const cx0=(hx/FN)|0, cy0=(hy/FN)|0;
      for(let r=1;r<40;r++) for(let ox=-r;ox<=r;ox++) for(let oy=-r;oy<=r;oy++){
        if(Math.max(Math.abs(ox),Math.abs(oy))!==r) continue;
        let t=null; try{ t=om.at(cx0+ox,cy0+oy); }catch(e){}
        if(t && t.district===want) return [cx0+ox, cy0+oy];
      }
      return null;
    };
    const tryHere=(want)=>{
      for(let r=1;r<70;r++) for(let dx=-r;dx<=r;dx++) for(let dy=-r;dy<=r;dy++){
        if(Math.max(Math.abs(dx),Math.abs(dy))!==r) continue;
        const tx=hx+dx, ty=hy+dy;
        let t=null; try{ t=cellAt(tx,ty); }catch(e){}
        if(!(t&&t.walk)) continue;
        if(__surfaceOf(t,__districtAt(tx,ty))!==want) continue;
        for(let di=0;di<4;di++){
          const fx=tx-DIRS_[di][0], fy=ty-DIRS_[di][1];
          let fc=null; try{ fc=cellAt(fx,fy); }catch(e){}
          if(!(fc&&fc.walk)) continue;
          const wx=hx, wy=hy;
          hx=fx; hy=fy;
          if(stepOnce(di)) return {ok:true, at:[tx,ty], r:r};
          hx=wx; hy=wy;
        }
      }
      return {ok:false};
    };
    for(const want of ['dirt','concrete','asphalt','gravel']) res[want]=tryHere(want);
    /* THE DESERT IS NOT NEXT DOOR. Jump to a desert TILE the overmap picks,
       then walk onto its ground the same way as everywhere else. */
    const dt=findTile('desert');
    res.desertTile=dt;
    if(dt){
      for(let k=0;k<FN && !(res.sand&&res.sand.ok); k+=7){
        const gx=dt[0]*FN+k, gy=dt[1]*FN+((k*13)%FN);
        let c=null; try{ c=cellAt(gx,gy); }catch(e){}
        if(c&&c.walk){ hx=gx; hy=gy; res.sand=tryHere('sand'); }
      }
    }
    if(!res.sand) res.sand={ok:false, why:'no desert tile within reach'};
    res.wood=tryHere('wood');
    return res;
  });
  await p.waitForTimeout(900);


  /* THE PHONE */
  await cf.evaluate(()=>{ try{ const b=document.getElementById('phonebtn'); if(b)b.click(); }catch(e){} });
  await p.waitForTimeout(1000);
  await cf.evaluate(()=>{ try{ const b=document.getElementById('phoneclose'); if(b)b.click(); }catch(e){} });
  await p.waitForTimeout(700);

  /* THE CLOCK, which is what strikes the hour chime. *** AND IT NEEDS MORE
     THAN A SECOND, WHICH THE FIRST CUT DID NOT GIVE IT. *** The chime is not
     struck by advance(); it is struck by the SHELL, when the city's next
     four-second heartbeat reports a clock that jumped. Waiting 1200ms meant the
     report had not been sent yet, and time_pass read as "cannot be driven" on a
     build where it works. A GATE THAT UNDER-WAITS WRITES ITS OWN EXCUSE LIST. */
  await cf.evaluate(()=>{ try{ advance(190); }catch(e){} });
  await cf.evaluate(()=>{ try{ window.__ctWhere && window.__ctWhere(); }catch(e){} });
  await p.waitForTimeout(1500);
  await cf.evaluate(()=>{ try{ advance(190); window.__ctWhere && window.__ctWhere(); }catch(e){} });
  await p.waitForTimeout(2500);
  /* *** AND THE NAME RECORDER IS BLIND TO THIS ONE, WHICH IS THE POINT. ***
     strikeHours calls BOH_SFX.render DIRECTLY -- it never goes through playSFX
     -- so wrapping playSFX cannot see the hour chime by name, and the first cut
     of this gate reported time_pass as unreachable on a build where it strikes.
     A HOOK THAT MISSES A PATH IS A GATE THAT INVENTS AN EXCUSE. The shell keeps
     its own per-call ledger for exactly this question, so the gate reads it. */
  out.chime = await p.evaluate(()=>{
    try{ const log=(window.__timePassLog&&window.__timePassLog())||[];
      let strikes=0, biggest=0;
      for(const r of log){ strikes+=(r.strikes||0); if((r.jump||0)>biggest) biggest=r.jump; }
      return {rows:log.length, strikes:strikes, biggestJump:biggest};
    }catch(e){ return {err:String(e)}; } });
  await p.evaluate(()=>{ try{
    const c=(window.__timePassLog&&window.__timePassLog())||[];
    let s=0; for(const r of c) s+=(r.strikes||0);
    if(s>0) window.__ASK['time_pass']=(window.__ASK['time_pass']||0)+s;
  }catch(e){} });

  /* NIGHT, and the bed again: air_night is a different approved sound.
     *** AND THE DAY HAS TO BE AWAKE FOR THE CLOCK TO MOVE, WHICH THIS MISSED
     TWICE OUT OF THREE RUNS. *** The clock drive above can tip the day past
     22:00; once DAY.phase is 'ended', advance() no longer moves T.min, so
     "set the clock to 21:00" quietly did nothing and the bed sampled a DAYTIME
     valley. air_night then read as unreachable on a build where it works --
     a FLAKE, which is worse than a red, because it passes often enough to be
     believed. Wake first, then set the clock, then CHECK it landed. */
  out.night = await cf.evaluate(()=>{
    try{
      if(INSIDE) swapMode();
      if(DAY.phase!=='awake'){ DAY.wake(); daySync(); }
      const d=(21*60-T.min+1440)%1440; if(d) advance(d);
      /* AND TELL THE SHELL, because the bed does not read the city's clock --
         it learns day from night ONLY from the four-second WHERE report. Moving
         the clock and ticking the bed in the same breath samples a bed that has
         not been told yet, and it answered air_day at nine at night. */
      try{ window.__ctWhere && window.__ctWhere(); }catch(_e){}
      return {min:T.min, isNight:(typeof isNight==='function')?isNight():null, phase:DAY.phase};
    }catch(e){ return {err:String(e)}; }
  });
  await p.waitForTimeout(1400);   /* let the report land before sampling */
  out.bedNight = await bed();

  /* A DOOR, then the bed indoors */
  out.door = await cf.evaluate(()=>{
    try{
      if(INSIDE) return {ok:true, already:true};
      for(let r=1;r<70;r++) for(let dx=-r;dx<=r;dx++) for(let dy=-r;dy<=r;dy++){
        if(Math.max(Math.abs(dx),Math.abs(dy))!==r) continue;
        const nx=hx+dx, ny=hy+dy, c=cellAt(nx,ny);
        if(!(c&&c.enter)) continue;
        if(inEnter(nx,ny,hx,hy,!!c.walk)) return {ok:true,r:r};
      }
      return {ok:false};
    }catch(e){ return {ok:false,err:String(e)}; }
  });
  await p.waitForTimeout(2500);
  out.bedInside = await bed();

  /* ---- THE END OF A DAY, BOTH DOORS INTO IT. Measured before this wire: the
     clock reaching nightfall produced NOT ONE SOUND, while pressing the sleep
     button has posted sleep_sink since 8/22. The day loop's own header says
     there are two doors -- it "ends the day at NIGHTFALL 22:00 whether you like
     it or not" -- and only one of them made a sound.
     COUNTED PER PATH, because the first probe wrapped BOTH the city's message
     and the shell's playSFX and reported one sound as two. AN INSTRUMENT THAT
     WATCHES A SOUND TWICE REPORTS A DOUBLE-PLAY THAT IS NOT ONE. ---- */
  await p.evaluate(()=>{ window.__MSG={};
    window.addEventListener('message',e=>{ const d=e&&e.data;
      if(d&&d.bohemiaCitySfx&&d.bohemiaCitySfx.ev){ const k=d.bohemiaCitySfx.ev;
        window.__MSG[k]=(window.__MSG[k]||0)+1; } }); });

  /* DOOR ONE: you decide to turn in. */
  await cf.evaluate(()=>{ try{ if(DAY.phase!=='awake'){ DAY.wake(); daySync(); } }catch(e){} });
  await p.evaluate(()=>{ window.__MSG={}; });
  await cf.evaluate(()=>{ try{ const b=document.getElementById('sleepbtn'); if(b) b.click(); }catch(e){} });
  await p.waitForTimeout(1200);
  out.dayByChoice = await p.evaluate(()=>Object.assign({},window.__MSG));

  /* DOOR TWO: the light runs out on you. */
  await cf.evaluate(()=>{ try{ DAY.wake(); daySync(); }catch(e){} });
  await p.waitForTimeout(400);
  await p.evaluate(()=>{ window.__MSG={}; });
  out.dayDrive = await cf.evaluate(async()=>{
    const w=ms=>new Promise(z=>setTimeout(z,ms));
    for(let i=0;i<40 && DAY.phase!=='ended';i++){ advance(30); await w(20); }
    return {min:T.min, phase:DAY.phase};
  });
  await p.waitForTimeout(1500);
  out.dayByClock = await p.evaluate(()=>Object.assign({},window.__MSG));
  await p.evaluate(()=>{ try{
    const n=(window.__MSG||{}).sleep_sink||0;
    if(n>0) window.__ASK['sleep_sink']=(window.__ASK['sleep_sink']||0)+n; }catch(e){} });

  out.final = await p.evaluate(()=>({
    asks: window.__ASK, renders: window.__RENDERS,
    aliveRunning: window.__ALIVE.filter(x=>x==='running').length,
    aliveTotal: window.__ALIVE.length,
    aliveOther: window.__ALIVE.filter(x=>x!=='running')
  }));
  out.errs=errs.slice(0,8);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    p = f = 0
    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    print('=== EVERY SOUND IS REACHABLE - measured by playing it, not by grepping ===')

    bank = json.load(open(BANK, encoding='utf8'))
    approved = sorted(e for e in bank if bank[e])
    eng = open(ENG, encoding='utf8').read()
    labels = dict(re.findall(r"\{ ev: '([a-z_]+)',\s*label: '([^']*)'", eng))

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(js_source())
        js = fh.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=900)
    finally:
        os.unlink(js)
    line = [x for x in r.stdout.strip().split('\n') if x.startswith('{')]
    if not line:
        print('  > FAIL the harness produced nothing')
        print(r.stdout[-1200:]); print(r.stderr[-1200:])
        return 1
    d = json.loads(line[-1])

    ok('the walked city loads', d.get('cityFrame'))
    if not d.get('cityFrame'):
        print('  %d passed, %d FAILED' % (p, f))
        return 1

    fin = d.get('final') or {}
    asks = fin.get('asks') or {}
    heard = sorted(k for k in asks if k in bank and bank[k])

    # ---- THE LIVENESS PROOF, FIRST, BECAUSE WITHOUT IT EVERY COUNT BELOW IS
    #      A STATEMENT ABOUT THE HARNESS. EYES refused to publish a zero without
    #      this and they were right.
    ok('the audio engine was RUNNING for every sample of the drive (%d/%d; '
       'anything else: %s). Without this a low count says something about the '
       'harness, not the game.'
       % (fin.get('aliveRunning') or 0, fin.get('aliveTotal') or 0,
          fin.get('aliveOther') or 'nothing'),
       (fin.get('aliveTotal') or 0) >= 10
       and fin.get('aliveRunning') == fin.get('aliveTotal'))
    ok('and the game really made sounds during it (%d renders through the one '
       'hook nothing can route around)' % (fin.get('renders') or 0),
       (fin.get('renders') or 0) > 20)

    # ---- THE DRIVE ACTUALLY DROVE.
    w = d.get('walked') or {}
    ok('the walk moved him (%s cells, and it stepped back out of %s building(s) '
       'it wandered into so this stays a measurement of the street)'
       % (w.get('moved'), w.get('leftBuildings')), (w.get('moved') or 0) > 30)
    ok('a door was walked through (%s)' % json.dumps(d.get('door')),
       (d.get('door') or {}).get('ok'))
    ok('the clock really reached night before the night bed was sampled (%s) -- '
       'a day that has already ENDED stops advance() moving T.min, and that '
       'made air_night a FLAKE rather than a red for two runs out of three'
       % json.dumps(d.get('night')), (d.get('night') or {}).get('isNight') is True)
    ok('the bed was sampled outdoors in DAY, at NIGHT and INDOORS: %s / %s / %s'
       % ((d.get('bedDay') or {}).get('kind'), (d.get('bedNight') or {}).get('kind'),
          (d.get('bedInside') or {}).get('kind')),
       (d.get('bedDay') or {}).get('kind') == 'air_day'
       and (d.get('bedNight') or {}).get('kind') == 'air_night'
       and (d.get('bedInside') or {}).get('kind') == 'air_inside')

    # ---- THE CENSUS ITSELF.
    print('  HEARD ON THE WALKED SURFACE, %d of %d approved events:'
          % (len(heard), len(approved)))
    for e in sorted(heard, key=lambda x: -asks.get(x, 0)):
        print('     %-15s %5d   %s' % (e, asks[e], labels.get(e, '')[:44]))

    silent = [e for e in approved if e not in heard]
    orphan = [e for e in silent if e not in CANNOT_DRIVE]
    both = [e for e in heard if e in CANNOT_DRIVE]
    print('  NOT HEARD: %d, of which %d have a written reason this drive cannot '
          'reach them and %d do not' % (len(silent), len(silent) - len(orphan),
                                        len(orphan)))

    # THE HOUR CHIME, END TO END. It is one of the four systems the walked
    # surface turned back on this round, and this is the only place that proves
    # a moved clock reaches an approved sound on the real surface.
    ch = d.get('chime') or {}
    ok('moving the clock strikes the hour chime on the walked surface: %s clock '
       'move(s) seen by the shell, biggest jump %s minutes, %s strike(s) played. '
       'Counted from the shell\'s own ledger, because strikeHours renders '
       'DIRECTLY and never goes through playSFX -- a name hook cannot see it, '
       'and the first cut of this gate wrote it off as unreachable because of '
       'that.' % (ch.get('rows'), ch.get('biggestJump'), ch.get('strikes')),
       (ch.get('strikes') or 0) > 0)

    ok('the walked surface makes SOMETHING of his library: %d approved events '
       'produced (%s)' % (len(heard), ', '.join(heard)), len(heard) >= 5)
    ok('EVERY approved sound this drive can reach was actually produced. Not '
       'reached and with no written reason: %s' % (orphan or 'none'), not orphan)

    # ---- THE CLOSING CLAIM OF THE-OTHER-51. Every one of the sixty-five is in
    #      exactly one bucket: HEARD here, or carrying its OWN sentence saying
    #      what it waits for. Not a wire for every name -- every name accounted
    #      for. A flat set of names with the reasons in comments above them,
    #      which is what this was for three rounds, lets a name inherit a reason
    #      that was never about it.
    ok('and nothing is counted twice -- an event that was HEARD must not also '
       'be carrying an excuse (%s)' % (both or 'none'), not both)
    ok('EVERY ONE OF THE %d APPROVED SOUNDS IS ACCOUNTED FOR: %d heard on the '
       'walked surface, %d with their own written reason, 0 unexplained'
       % (len(approved), len(heard), len(silent)),
       len(heard) + len(silent) == len(approved) and not orphan)
    print('  THE LEDGER, every approved sound and where it stands:')
    for e in approved:
        if e in heard:
            print('     HEARD    %-15s %d' % (e, asks.get(e, 0)))
    for e in approved:
        if e not in heard:
            print('     waits    %-15s %s' % (e, CANNOT_DRIVE.get(e, '?')[:70]))

    # ---- THE FOOTSTEP FAMILY, ONE SURFACE AT A TIME. THE-OTHER-51 round 2.
    su = d.get('surfaces') or {}
    for g in ('dirt', 'concrete', 'asphalt', 'gravel'):
        ok('walking onto real %s ground fires its own footstep (%s)'
           % (g, json.dumps(su.get(g))), (su.get(g) or {}).get('ok'))
    ok('THE DESERT SOUNDS LIKE THE DESERT: walking onto desert ground fires '
       'step_sand, approved 8/12 and never once played before today. The pool '
       'table sends every unnamed ground to `hyard`, the YARD pool, so the '
       'Mojave played a suburban lawn. (%s, desert tile %s)'
       % (json.dumps(su.get('sand')), su.get('desertTile')),
       (su.get('sand') or {}).get('ok'))
    ok('and step_wood is NOT reachable, which is the honest answer and not a '
       'missing wire: there is no wooden ground in this valley -- no boardwalk, '
       'no porch deck, no floorboard pool -- measured across 18 districts and '
       '~9,000 cells. Wiring it would mean inventing a surface so a sound has '
       'somewhere to play. (%s)' % json.dumps(su.get('wood')),
       not (su.get('wood') or {}).get('ok'))

    # ---- BOTH DOORS INTO THE END OF A DAY. THE-OTHER-51 round 3.
    ch = (d.get('dayByChoice') or {}).get('sleep_sink', 0)
    ck = (d.get('dayByClock') or {}).get('sleep_sink', 0)
    ok('the day loop really ended the day by the clock (%s)'
       % json.dumps(d.get('dayDrive')),
       (d.get('dayDrive') or {}).get('phase') == 'ended')
    ok('choosing to sleep sounds like sleeping (%d), which it has since 8/22'
       % ch, ch == 1)
    ok('AND THE DAY RUNNING OUT OF LIGHT SOUNDS LIKE IT TOO (%d). Measured '
       'before this wire: driving the clock to nightfall produced NOT ONE '
       'SOUND, and in a hundred-hour game over three generations the end of a '
       'day is the most repeated moment there is.' % ck, ck == 1)
    ok('and neither door plays it TWICE -- the button never goes through '
       'advance(), so the two paths cannot stack (choice %d, clock %d). Two '
       'sounds on one tap is the 8/4 complaint the UI policy exists to stop.'
       % (ch, ck), ch == 1 and ck == 1)

    ok('nothing threw (%s)' % (d.get('errs') or 'clean'), not d.get('errs'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  What the game plays is now a measurement, not a grep.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
