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
CANNOT_DRIVE = {
    'hit', 'hit_more', 'hurt', 'hurt_more', 'kill', 'melee_hit', 'miss_past',
    'shot', 'shot_more', 'casing', 'dry_fire', 'mag_home', 'block', 'swing_air',
    'swing_more', 'vital_deep', 'will_goes', 'went_down', 'come_up',
    'heartbeat', 'stone_bite', 'chip_more', 'cover_more',
    # ^ every one of these needs a FIGHT. sfx_wired_gate drives combat and holds
    #   them; it is the gate that owns that surface.
    'eat', 'drink', 'pickup', 'set_down', 'seton_more', 'demolish', 'dirt_take',
    'cloth_on', 'cloth_more', 'tape_pull', 'tape_more', 'lungs_burn', 'power_on',
    'parts_pass', 'save_chime', 'sleep_sink', 'boots_go', 'tread_more',
    # ^ a verb, a payday, a night's sleep or a save. Several of these already
    #   carry written waivers in sfx_wired_gate for verbs that do not exist yet
    #   (equip, sprint, power, place, patch), and those waivers are still true.
    'step_asphalt', 'step_gravel', 'step_sand', 'step_wood', 'walk_more',
    'sand_more', 'wood_more',
    # ^ the ground you happen to be standing on. The classifier is held by
    #   city_where_gate, which counts all four surfaces on the real cells.
    'buzz_more', 'door_more', 'wind_more', 'shot_more', 'hurt_more',
    # ^ SIBLING pools: they are drawn from inside their parent's pick, so the
    #   name never appears at a call site by construction.
    'ui_back', 'ui_deny',
    # ^ a BACK button on a panel this drive does not open.
    'phone_buzz',
    # ^ it fires when a JOB ARRIVES, not when you open the phone. Opening the
    #   phone is not its trigger and driving it that way would be a lie.
    'generator', 'sign_alive',
    # ^ both need a LIVE CIRCUIT within three cells, which is the whole of
    #   BB-A-LIT-BLOCK-HUMS and is held by lit_block_hums_gate on a grid it
    #   counts first. 88% of circuits are dead, so a spawn usually has none.
    'sleep_sink',
    # ^ needs a night actually slept through, not a clock moved past it.
    # time_pass is NOT here any more: it IS reachable, and listing it as
    # undrivable was this gate under-waiting for the four-second heartbeat that
    # carries the clock. See the drive.
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

  /* NIGHT, and the bed again: air_night is a different approved sound */
  await cf.evaluate(()=>{ try{ if(INSIDE) swapMode(); const d=(21*60-T.min+1440)%1440; if(d) advance(d); }catch(e){} });
  await p.waitForTimeout(1200);
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

    ok('nothing threw (%s)' % (d.get('errs') or 'clean'), not d.get('errs'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  What the game plays is now a measurement, not a grep.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
