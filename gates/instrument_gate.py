#!/usr/bin/env python3
"""
BOHEMIA INSTRUMENT GATE (8/16/26, SOUNDS lane) -- his 602 instruments are
REACHABLE from the sound engine, and every name a recipe uses is a real one.

WHY THIS GATE EXISTS. Paolo, judging all 400 on 8/16 after SFX-06 died 34 of 35:

    "These are all very bad except for one I need you to be greater than use
     more instruments. I like it was really bad."

The alpha carries a music studio whose voice rack -- synthV() -- holds SIX
HUNDRED AND TWO named instruments, and every song he has ever called fire is
built out of them. The SFX engine had never called one. Five raw synthesis
primitives, eighty moments, four hundred candidates, zero notes of the library
sitting in the same file. Five straight sweeps at roughly a 30% approval rate
that never moved, because the recipes were never the problem and the moments
were never the problem: the SOUND SOURCE was.

REUSE-FIRST has been law in this repo since 7/22 and this lane broke it for
eighteen days without a single gate noticing, because every sound gate asked
"is this recipe valid" and none asked "is there something better already
approved that you are ignoring".

WHAT IT ASSERTS, and every claim is checked on the SHIPPED SURFACE rather than
on this module, because synthV lives in the alpha and a claim about a function
in another file is worth nothing until you call it:

  1. THE RACK IS REAL AND BIG        synthV exists in the shipped alpha and
                                     resolves 500+ distinct instrument names
  2. THE DOOR EXISTS                 the engine declares synth='instrument'
                                     and an `inst` field
  3. EVERY NAME RESOLVES             every instrument a recipe names is one the
                                     rack actually answers to. A typo'd voice
                                     is a silent sound effect, which is the
                                     worst failure this lane has.
  4. IT MAKES SIGNAL                 each instrument-backed event renders
                                     audible audio through BOH_SFX.render on
                                     the real path, not just "returns without
                                     throwing"
  5. NO VOICE WAS COPIED             the engine does not duplicate a single one
                                     of his instrument bodies. One definition,
                                     in his studio, forever.
  6. SCREECH LAW HOLDS               borrowing the rack adds no delay and no
                                     convolver to the game

Run from repo root:  python3 gates/instrument_gate.py
"""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

SURFACE = r'''
const path=require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
(async()=>{
  const {chromium}=pwmod();
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front',{force:true}).catch(()=>{});
  await p.waitForTimeout(900);
  const out=await p.evaluate(async()=>{
    const r={};
    r.hasSynthV = (typeof synthV==='function');
    if(!r.hasSynthV) return r;
    if(typeof BOH_SFX==='undefined') return {fatal:'no BOH_SFX in the alpha'};
    r.specHasInstrument = (BOH_SFX.SPEC.synth.of||[]).indexOf('instrument')>=0;
    r.specHasInst = !!BOH_SFX.SPEC.inst;

    /* WHICH EVENTS ARE BUILT ON HIS RACK */
    const insts=[];
    for(const E of BOH_SFX.EVENTS){
      const c=BOH_SFX.cook(E.ev,5);
      for(const v of c) if(v.synth==='instrument') insts.push({id:v.id, ev:E.ev, inst:v.inst});
    }
    r.instCount=insts.length;
    r.instEvents=Array.from(new Set(insts.map(x=>x.ev)));
    r.names=Array.from(new Set(insts.map(x=>x.inst)));

    /* 3. EVERY NAME RESOLVES. The rack is a long if/else on `kind`, so an
       unknown name simply produces nothing -- silently. The only honest test
       is to RENDER it and see whether any sample moved. A name that makes no
       sound is a name that is not in the rack, whatever the source says. */
    const SR=44100;
    async function rackPeak(name){
      const OAC=new OfflineAudioContext(2,Math.ceil(SR*1.6),SR);
      const bus=OAC.createGain(); bus.gain.value=1; bus.connect(OAC.destination);
      try{ synthV(name,OAC,bus,x=>220*Math.pow(2,x/12),0.35,0,0.02,0.12); }catch(e){ return -1; }
      const buf=await OAC.startRendering();
      const L=buf.getChannelData(0),R=buf.getChannelData(1);
      let pk=0; for(let i=0;i<L.length;i++){const a=Math.max(Math.abs(L[i]),Math.abs(R[i])); if(a>pk)pk=a;}
      return +pk.toFixed(5);
    }
    r.namePeak={};
    for(const n of r.names) r.namePeak[n]=await rackPeak(n);
    /* and a control: a name that is definitely NOT in the rack must be silent,
       or this whole check is measuring nothing */
    r.bogusPeak = await rackPeak('definitely_not_an_instrument_xyz');

    /* 1. THE RACK IS BIG. Sample the declared list from the source text is not
       available in here, so probe a spread of known names instead. */
    const probe=['splinterbell','ashchoir','farbell','ironlung','glassrequiem',
                 'mournhorn','evictionbell','dustbowlguitar','marimba','cello',
                 'harmonica','tollbell','vibraphone','kalimba','musicbox'];
    r.probe={}; for(const n of probe) r.probe[n]=await rackPeak(n);

    /* 4. THE EVENTS THEMSELVES MAKE SIGNAL through the real render path */
    r.eventPeak={};
    for(const ev of r.instEvents){
      const v=BOH_SFX.cook(ev,5)[0];
      const secs=BOH_SFX.beatsOf(v)*BOH_SFX.BEAT+0.6;
      const OAC=new OfflineAudioContext(2,Math.ceil(SR*secs),SR);
      const bus=OAC.createGain(); bus.gain.value=1; bus.connect(OAC.destination);
      BOH_SFX.render(v,OAC,bus,0.05);
      const buf=await OAC.startRendering();
      const L=buf.getChannelData(0),R=buf.getChannelData(1);
      let pk=0; for(let i=0;i<L.length;i++){const a=Math.max(Math.abs(L[i]),Math.abs(R[i])); if(a>pk)pk=a;}
      r.eventPeak[ev]=+pk.toFixed(5);
    }
    return r;
  });
  out.errors=errs.slice(0,3);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    print('=== INSTRUMENT GATE - his 602 voices are reachable from the SFX engine ===')
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  FAIL ' + name)

    src = open(ALPHA, encoding='utf8').read()
    eng = open('engine/bohemia_sfx.js', encoding='utf8').read()

    # ---- 1. THE RACK, counted from the shipped source -----------------------
    kinds = set(re.findall(r"kind===?'([a-z_]+)'", src))
    ok('the shipped alpha carries a large instrument rack (%d named voices)'
       % len(kinds), len(kinds) >= 500)

    # ---- 5. AND NOT ONE OF THEM WAS COPIED INTO THIS ENGINE -----------------
    # The whole value of borrowing is that there stays exactly ONE definition.
    # If this engine ever grows its own splinterbell, the MUSIC lane improving
    # theirs stops reaching the game's sound effects and nobody finds out.
    ok('the sound engine defines NO instrument of its own (one definition, in '
       'his studio, forever)', "kind==='" not in eng and 'function synthV' not in eng)
    ok('the sound engine reaches the rack by CALL, not by copy',
       'synthV' in eng and 'bodyInstrument' in eng)

    # ---- 6. SCREECH LAW ----------------------------------------------------
    i = src.index('function synthV(')
    d, j = 0, src.index('function synthV(')
    while True:
        c = src[j]
        if c == '{':
            d += 1
        elif c == '}':
            d -= 1
            if d == 0:
                break
        j += 1
    rack = src[i:j]
    ok('borrowing the rack adds NO delay line to the game (SCREECH LAW)',
       'createDelay' not in rack)
    ok('borrowing the rack adds NO convolver to the game (SCREECH LAW)',
       'createConvolver' not in rack)

    # ---- the surface legs --------------------------------------------------
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(SURFACE)
        fn = fh.name
    try:
        r = subprocess.run(['node', fn, ROOT], capture_output=True, text=True, timeout=600)
    finally:
        os.unlink(fn)
    line = [x for x in r.stdout.strip().split('\n') if x.startswith('{')]
    if not line:
        print('  > the surface leg produced nothing:\n' + (r.stderr or '')[-900:])
        print('  %d passed, %d FAILED' % (p, f + 1))
        return 1
    d = json.loads(line[-1])
    if d.get('fatal'):
        ok('the surface leg ran (%s)' % d['fatal'], False)
        print('  %d passed, %d FAILED' % (p, f))
        return 1

    ok('synthV is reachable in the shipped alpha', d.get('hasSynthV'))
    ok("the engine declares synth='instrument'", d.get('specHasInstrument'))
    ok('the engine declares an `inst` field', d.get('specHasInst'))

    # THE CONTROL FIRST. If a bogus name also makes noise, every "resolves"
    # below is worthless and this gate is measuring nothing.
    ok('the probe can tell a real voice from a fake one (bogus name peaks at '
       '%.5f)' % (d.get('bogusPeak') or 0), (d.get('bogusPeak') or 0) < 0.002)
    live = [k for k, v in (d.get('probe') or {}).items() if v > 0.002]
    ok('a spread of his named voices really sound (%d of %d probed: %s)'
       % (len(live), len(d.get('probe') or {}), ', '.join(sorted(live)[:5])),
       len(live) >= 10)

    n = d.get('instCount') or 0
    print('  NOTE  %d candidates across %d moments are built on his rack: %s'
          % (n, len(d.get('instEvents') or []),
             ', '.join(d.get('instEvents') or []) or 'none yet'))
    if n:
        dead = [k for k, v in (d.get('namePeak') or {}).items() if v <= 0.002]
        ok('EVERY instrument a recipe names is one the rack answers to (%s)'
           % (', '.join(dead) or 'all %d resolve' % len(d.get('names') or [])),
           not dead)
        silent = [k for k, v in (d.get('eventPeak') or {}).items() if v <= 0.002]
        ok('every instrument-backed moment RENDERS AUDIBLE AUDIO on the real '
           'path (%s)' % (', '.join(silent) or 'none silent'), not silent)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'),
       not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  His 602 instruments are no longer a thing only the music can '
              'use.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
