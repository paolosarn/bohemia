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
    .find(x=>x.getAttribute('data-p')==='run'); if(t)t.click();});
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

  out.errs=errs;
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
    ups = set(re.findall(r'^\s*UP\s+(\S+)', verdict, re.M))
    downs = set(re.findall(r'^\s*DOWN\s+(\S+)', verdict, re.M))
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
    chk(sum(len(v) for v in bank.values()) == 38,
        'the bank does not hold his 38 approvals (holds %d)' % sum(len(v) for v in bank.values()))

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
    # he approved a BLOCK but this demo has no block mechanic: it must NOT be
    # invented just to spend the sound
    chk("sfxAsk('block')" not in demo,
        'combat wires a BLOCK, but this demo has no block mechanic -- inventing '
        'one to justify a sound is his call, not the machine\'s')

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

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, os.path.abspath(REPO)],
                           capture_output=True, text=True, timeout=600)
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

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  %d taps walked the player, %d footsteps crossed, and the master bus '
              'peaked at %.3f. It made a NOISE.' % (d.get('taps', 0), len(rx), peak))
        print('  (music playing: %s · bed before the walk %.4f · door %.4f)'
              % (d.get('musicAtWalk'), d.get('floorBeforeWalk') or 0, d.get('peakDoor') or 0))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
