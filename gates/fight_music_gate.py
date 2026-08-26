#!/usr/bin/env python3
"""
BOHEMIA FIGHT MUSIC GATE (8/19/26) — the music knows when you are in a fight,
and it is PROVED BY PLAYING ONE, not by grepping for a function name.

WHY THIS GATE EXISTS. Measured on the shipped alpha before FIGHTMUS: tap in, let
the opening hand over to the streets, call startColdOpen -- THE COLD OPEN, the
first fight in the game, the one the demo opens on -- and 64 bars later the
street shuffle takes the music back MID-FIGHT:

    BEFORE THE FIGHT   city:true   THE WIND LEARNS WORDS
    IN THE FIGHT       city:true   HOMELESS
    AFTER 64 BARS      city:true   TWO COINS FOR THE FERRYMAN     <-- mid-fight

CITYMUS.on stayed true and its watchdog kept running while combat drove the same
transport. Two systems, one clock, neither aware of the other. A static check
for "is FIGHTMUS.enter called" would have gone green the moment the call site
existed and told you nothing about whether the shuffle actually let go, which is
the entire bug. So this gate PLAYS THE GAME.

WHAT IT ASSERTS, all of it off a real running transport:

  1. THE STREETS ARE PLAYING       after the opening hands over, CITYMUS owns it
  2. A FIGHT TAKES THE MUSIC       the song changes and the shuffle stands down
  3. AND KEEPS IT PAST 64 BARS     the transport is walked to the end of a pass
                                   -- which every real fight outlasts -- and the
                                   fight's song is STILL the one playing. This
                                   is the regression that shipped.
  4. LEAVING IS NOT A CUT          the frame the fight settles, the fight's song
                                   is still playing. Practitioner consensus is
                                   asymmetric: immediate IN, musical END OUT.
  5. BUT THE STREETS DO COME BACK  within one phrase, CITYMUS owns it again. A
                                   stand-down that never stands back up would
                                   pass check 4 and leave the valley silent.
  6. WINNING SOUNDS LIKE SOMETHING the sting fires on the outcome, in the key of
                                   whatever song is playing, and its notes land
                                   on the beats it scheduled them on. Measured
                                   as WINDOWED ENERGY and as PITCH RATIOS, not
                                   asserted: a stinger that renders to one blurt
                                   would pass any check that only asks "did it
                                   make a noise".
  7. THE FIGHT INTENSIFIES         MUS.playStep has gated a second and third
                                   tier of arrangement behind sk>=2 and sk>=4
                                   since 7/3, one style per faction, built for
                                   Paolo's ruling that "the progression of four
                                   kills all sound like the same progression".
                                   The only writer of MUS.layers in the whole
                                   alpha was a BUTTON in the studio, so the game
                                   never set it and every fight ever played ran
                                   flat. Proved by killing things and by
                                   COUNTING THE PARTS that fire at each layer --
                                   RMS is the wrong ruler here, because the parts
                                   that come in are quiet hats and chips that add
                                   density, not loudness.
  8. GETTING PAID SOUNDS TOO       and it refuses the three false positives that
                                   would make it worse than silence: a restored
                                   save (a whole ledger at once), a re-fired
                                   snapshot (the report is debounced), and
                                   SPENDING. Money leaving does not get a
                                   flourish. It is also asserted to be SMALLER
                                   than the fight-win sting, which is the design
                                   decision written down: a water run in a dead
                                   valley is not a boss kill.
  9. NEVER THE SCRATCH PATCH       FACTIONS[0] is CUSTOM, the studio's blank
                                   sandbox slot (motif 'plain', osc + pluck).
                                   Combat drew it uniformly, so one fight in
                                   fourteen was scored by a patch nobody wrote.
                                   200 redraws must never land on it, and must
                                   never land on a song he buried.

Run from repo root:  python3 gates/fight_music_gate.py
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

JS = r"""
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  // DEFAULT autoplay policy on purpose. Launching with
  // --autoplay-policy=no-user-gesture-required would prove nothing about the
  // gesture this whole feature is built on.
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
  const out={};
  try{
    await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
    await p.waitForTimeout(2000);
    const has=await p.evaluate(()=>({fm:typeof FIGHTMUS!=='undefined',
      mm:typeof MENUMUS!=='undefined', cm:typeof CITYMUS!=='undefined',
      cold:typeof startColdOpen==='function'}));
    Object.assign(out,has);
    if(!has.fm||!has.cm||!has.cold){ out.fatal='FIGHTMUS/CITYMUS/startColdOpen missing from the shipped alpha';
      console.log(JSON.stringify(out)); await b.close(); return; }

    await p.click('#front');                      // the real gesture
    await p.waitForTimeout(22000);                // opening hands over to the streets
    const snap=()=>p.evaluate(()=>({fight:FIGHTMUS.on,city:CITYMUS.on,watch:!!CITYMUS.watch,
      step:MUS.step,playing:!!MUS.playing,
      now:(MUS.cur<MFACTIONS.length?MFACTIONS[MUS.cur].n:(MUS.lib()[MUS.cur]||{}).n)}));
    out.streets=await snap();

    await p.evaluate(()=>{ startColdOpen(()=>{}); });
    await p.waitForTimeout(4000);
    out.inFight=await snap();

    // WALK THE TRANSPORT TO THE END OF A 64-BAR PASS. That is what happens on
    // its own after ~128 seconds of any fight; doing it directly is the same
    // code path arriving sooner, not a different one.
    await p.evaluate(()=>{ MUS.step=1020; });
    await p.waitForTimeout(3000);
    out.past64=await snap();

    // WATCH THE STING ACROSS THE REAL OUTCOME. Calling STING.play() directly
    // proves the sting WORKS; it proves nothing about it being WIRED, and
    // deleting the call site in the combat-end handler would sail past a gate
    // that only ever calls it itself. STING.last is the observable.
    out.stingBefore=await p.evaluate(()=>(typeof STING!=='undefined')?STING.last:-1);
    await p.evaluate(()=>{ window.postMessage({type:'BOHEMIA_COMBAT_END',victory:true,
      kills:2,playerHP:80,dead:2,spared:0,fled:0,alive:0,turns:5},'*'); });
    await p.waitForTimeout(1200);
    out.stingAfter=await p.evaluate(()=>(typeof STING!=='undefined')?STING.last:-1);
    out.justEnded=await snap();

    out.returned=null;
    for(const w of [4000,5000,7000,9000,12000,15000]){
      await p.waitForTimeout(w);
      const s=await snap();
      if(s.city){ out.returned=s; break; }
      out.stillHeld=s;
    }

    // ---- THE STING, measured as audio -----------------------------------
    out.sting=await p.evaluate(async()=>{
      if(typeof STING==='undefined') return {missing:true};
      const SR=44100, SV=window.synthV, step=0.125, r={};
      async function windows(which, root){
        const F=STING.FIG[which];
        const OAC=new OfflineAudioContext(1,Math.ceil(SR*4),SR);
        const bus=OAC.createGain(); bus.gain.value=1; bus.connect(OAC.destination);
        for(const nn of F.n)
          try{ SV(F.v,OAC,bus,x=>110*Math.pow(2,x/12),F.sd,root+F.oct+nn[0]-55,0.05+nn[1]*step,F.g); }catch(e){}
        const d=(await OAC.startRendering()).getChannelData(0);
        const w=[];
        for(let k=0;k<12;k++){ const a=Math.floor((0.05+k*step)*SR), z=Math.floor((0.05+(k+1)*step)*SR);
          let pk=0; for(let i=a;i<z&&i<d.length;i++){const v=Math.abs(d[i]); if(v>pk)pk=v;}
          w.push(+pk.toFixed(4)); }
        return {w, steps:F.n.map(x=>x[1]), voice:F.v};
      }
      async function hzOf(which,root,idx){
        const F=STING.FIG[which];
        const OAC=new OfflineAudioContext(1,Math.ceil(SR*1.2),SR);
        const g=OAC.createGain(); g.gain.value=1; g.connect(OAC.destination);
        try{ SV(F.v,OAC,g,x=>110*Math.pow(2,x/12),F.sd,root+F.oct+F.n[idx][0]-55,0.02,F.g); }catch(e){}
        const d=(await OAC.startRendering()).getChannelData(0);
        let zc=0; const a=Math.floor(0.03*SR), z=Math.floor(0.20*SR);
        for(let i=a+1;i<z;i++) if((d[i]>=0)!==(d[i-1]>=0))zc++;
        return +(zc/2/((z-a)/SR)).toFixed(1);
      }
      r.win=await windows('win',45); r.loss=await windows('loss',45);
      r.winOther=await windows('win',38);            // a different key still sounds
      r.hz=[]; for(let i=0;i<STING.FIG.win.n.length;i++) r.hz.push(await hzOf('win',45,i));
      r.root=(MUS.fac()||{}).root;
      r.fired=STING.play('win');                     // live, on the running transport
      r.refused=STING.play('win');                   // and refuses a burst
      return r;
    });

    // ---- THE KILL LAYERS -------------------------------------------------
    out.kill=await p.evaluate(async()=>{
      if(typeof KILLMUS==='undefined') return {missing:true};
      const r={steps:[]};
      const fire=()=>window.postMessage({type:'BOHEMIA_SHOT_RESULT',outcome:'killshot',
        zone:'kill',greedMult:1,patMeta:{pat:0,pkg:0,weapon:'x',target:'t',eid:0,angleOff:0}},'*');
      const wait=ms=>new Promise(z=>setTimeout(z,ms));
      KILLMUS.reset();
      r.atStart={kills:KILLMUS.kills,layers:MUS.layers};
      for(let k=1;k<=5;k++){ fire(); await wait(1500);
        r.steps.push({kills:KILLMUS.kills,want:KILLMUS.want,layers:MUS.layers}); }

      // ---- THE BAR LINE, TESTED ON PURPOSE RATHER THAN CAUGHT IN PASSING.
      // The first version of this check just watched the five kills above and
      // asserted that `want` was seen ahead of `layers` at least once. That is
      // TIMING-DEPENDENT: a kill that happens to land on a bar line applies
      // immediately and the gap is never observable, so the check could go red
      // on completely correct code -- and it did, on a restored tree, with the
      // exact same reading a real regression produced. A flaky gate is worse
      // than no gate, because it teaches everyone to ignore red.
      // Driven instead: park the transport just PAST a bar line, ask for a
      // lift, and prove it is held; then put the transport ON a bar line and
      // prove it lands.
      r.held=null; r.landed=null;
      try{
        KILLMUS.reset();
        MUS.step=17;                       // 17 % 16 = 1: just past the line
        KILLMUS.kills=1; KILLMUS.killed();  // -> 2 kills, which is now LEVEL 3
        await wait(400);
        r.held={step:MUS.step%16, want:KILLMUS.want, layers:MUS.layers};
        MUS.step=32;                       // 32 % 16 = 0: the top of a bar
        await wait(400);
        r.landed={want:KILLMUS.want, layers:MUS.layers};
      }catch(e){ r.barErr=String(e); }
      KILLMUS.reset();
      // AND THE PARTS REALLY THICKEN. Exact, not a signal guess: wrap the two
      // voice dispatchers, run two bars per layer, count the calls. Restored in
      // a finally -- a probe that mutates the surface puts it back.
      const SR=44100;
      async function bar(fi,layers){
        const kAC=MUS.AC,kM=MUS.MAST,kL=MUS.layers,kC=MUS.cur;
        const rs=window.synthV, rd=window.drumV; let n=0;
        try{
          window.synthV=function(){n++;}; window.drumV=function(){n++;};
          const OAC=new OfflineAudioContext(1,Math.ceil(SR*0.2),SR);
          const M=OAC.createGain(); M.connect(OAC.destination);
          MUS.AC=OAC; MUS.MAST=M; MUS.layers=layers; MUS.cur=fi;
          const sd=MUS.stepDur();
          for(let s=0;s<32;s++){ try{ MUS.playStep(s%16,0.05+s*sd,MUS.songCtx(s)); }catch(e){} }
          return n;
        } finally { window.synthV=rs; window.drumV=rd;
          MUS.AC=kAC; MUS.MAST=kM; MUS.layers=kL; MUS.cur=kC; }
      }
      r.parts=[];
      for(let fi=1;fi<MFACTIONS.length;fi++){
        r.parts.push({n:MFACTIONS[fi].n, klay:MFACTIONS[fi].klay,
          L0:await bar(fi,0), L2:await bar(fi,2), L4:await bar(fi,4)});
      }
      r.putBack={synthOK:typeof window.synthV==='function',
                 drumOK:typeof window.drumV==='function'};
      KILLMUS.reset();
      r.afterReset={kills:KILLMUS.kills,layers:MUS.layers};
      return r;
    });

    // ---- THE PAYDAY STING -----------------------------------------------
    out.pay=await p.evaluate(async()=>{
      if(typeof PAYSTING==='undefined'||typeof STING==='undefined') return {missing:true};
      const r={steps:[]};
      const E=(kind,amount)=>({currency:'water',amount,kind,reason:'x',ref:'q',day:1});
      const snap=e=>({purse:{id:'player',day:1,entries:e}});
      const wait=ms=>new Promise(z=>setTimeout(z,ms));
      const step=async(label,st)=>{ const before=STING.last;
        window.postMessage({bohemiaCityState:st},'*'); await wait(450);
        r.steps.push({label,fired:STING.last>before}); };
      PAYSTING.seen=null;
      await step('restore', snap([E('source',5),E('source',3),E('source',2)]));
      await step('resend',  snap([E('source',5),E('source',3),E('source',2)]));
      await step('spend',   snap([E('source',5),E('source',3),E('source',2),E('drain',-4)]));
      STING.last=0;
      await step('paid',    snap([E('source',5),E('source',3),E('source',2),E('drain',-4),E('source',9)]));
      // and the figure itself makes audio
      const SR=44100, SV=window.synthV, stepDur=0.125;
      async function fig(which,root){
        const F=STING.FIG[which]; if(!F)return null;
        const OAC=new OfflineAudioContext(1,Math.ceil(SR*4),SR);
        const bus=OAC.createGain(); bus.gain.value=1; bus.connect(OAC.destination);
        for(const nn of F.n)
          try{ SV(F.v,OAC,bus,x=>110*Math.pow(2,x/12),F.sd,root+F.oct+nn[0]-55,0.05+nn[1]*stepDur,F.g); }catch(e){}
        const d=(await OAC.startRendering()).getChannelData(0);
        let pk=0; for(let i=0;i<d.length;i++){const a=Math.abs(d[i]); if(a>pk)pk=a;}
        return {peak:+pk.toFixed(4), notes:F.n.length, span:Math.max(...F.n.map(x=>x[1])),
                uniq:new Set(F.n.map(x=>x[1])).size, voice:F.v};
      }
      r.paidFig=await fig('paid',45);
      r.winFig =await fig('win',45);
      return r;
    });

    out.draws=await p.evaluate(()=>{ const c={};
      for(let i=0;i<200;i++){ const k=FIGHTMUS.realFaction(0);
        const f=MFACTIONS[k]; c[f?f.n:'?']=(c[f?f.n:'?']||0)+1; }
      return c; });
    out.buried=await p.evaluate(()=>Object.keys(MUS.V).filter(k=>MUS.V[k]===0));
  }catch(e){ out.fatal=String(e&&e.message||e); }
  out.errs=errs;
  console.log(JSON.stringify(out));
  await b.close();
})();
"""

P = F = 0


def ok(msg, cond):
    global P, F
    if cond:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def main():
    print('=== FIGHT MUSIC GATE — proved by playing a fight, not by grepping ===')
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=900)
    finally:
        os.unlink(js)
    if r.returncode != 0:
        print('  FAIL  the browser run died:\n' + (r.stderr or '')[-1500:])
        return 1
    try:
        d = json.loads(r.stdout.strip().splitlines()[-1])
    except Exception as e:
        print('  FAIL  unreadable output (%s):\n%s' % (e, r.stdout[-1200:]))
        return 1
    if d.get('fatal'):
        print('  FAIL  ' + d['fatal'])
        return 1

    ok('FIGHTMUS is in the shipped alpha', d.get('fm'))

    st = d.get('streets') or {}
    ok('the streets are playing before the fight (city=%s, %s)'
       % (st.get('city'), st.get('now')), st.get('city') and st.get('playing'))

    inf = d.get('inFight') or {}
    ok('a fight TAKES the music (was %s, now %s)' % (st.get('now'), inf.get('now')),
       inf.get('now') and inf.get('now') != st.get('now'))
    ok('the street shuffle STANDS DOWN for the fight (city=%s, watchdog=%s)'
       % (inf.get('city'), inf.get('watch')),
       inf.get('city') is False and inf.get('watch') is False)
    ok('the fight is flagged as owning the music', inf.get('fight') is True)

    # 3. THE REGRESSION THAT SHIPPED
    p64 = d.get('past64') or {}
    ok('the streets do NOT take the music back 64 bars into a fight '
       '(fight song %s, after the pass %s)' % (inf.get('now'), p64.get('now')),
       p64.get('now') == inf.get('now') and p64.get('city') is False)

    je = d.get('justEnded') or {}
    ok('leaving a fight is not a CUT: the fight song is still playing the frame '
       'it settles (%s)' % je.get('now'), je.get('now') == inf.get('now'))

    ret = d.get('returned') or {}
    # ONE FLAKE SEEN, 8/20: this leg failed once in five runs and passed the
    # other four. The wait ladder gives the return up to 36s of headless time,
    # and a phrase is 128 steps -- which is 16s at real tempo but longer under a
    # loaded offline clock, so a slow machine can run out of ladder. If it flakes
    # again the fix is more ladder, NOT a weaker assertion: the thing being
    # measured is whether the streets come back at all.
    ok('but the streets DO come back within a phrase (%s)'
       % (ret.get('now') or 'they never came back'),
       bool(ret.get('city')) and bool(ret.get('playing')))
    ok('and the returned song is a street song, not the fight song (%s)'
       % ret.get('now'), ret.get('now') and ret.get('now') != inf.get('now'))

    # ---- THE STING ------------------------------------------------------
    sg = d.get('sting') or {}
    ok('the sting exists at all', not sg.get('missing'))
    # WIRED, not merely present. This is the leg that goes red if somebody
    # deletes the call in the combat-end handler, which every other sting check
    # here would happily survive.
    ok('WINNING A FIGHT ACTUALLY FIRES THE STING (STING.last %s -> %s)'
       % (d.get('stingBefore'), d.get('stingAfter')),
       isinstance(d.get('stingAfter'), (int, float))
       and isinstance(d.get('stingBefore'), (int, float))
       and d['stingAfter'] > d['stingBefore'])
    if not sg.get('missing'):
        for which in ('win', 'loss'):
            fig = sg.get(which) or {}
            w, steps = fig.get('w') or [], fig.get('steps') or []
            ok('the %s sting SOUNDS (%s, peak %.3f)'
               % (which, fig.get('voice'), max(w or [0])), max(w or [0]) > 0.05)
            # ---- THE SHAPE IS ASSERTED INDEPENDENTLY, NOT READ OFF THE FIGURE.
            # The first version of this check pulled its expected step list out
            # of STING.FIG itself, so collapsing every note onto step 0 -- which
            # turns a phrase into one blurt -- made the EXPECTATION collapse too
            # and the check sailed through. Caught by mutating it. A check that
            # reads its answer key off the thing it is testing cannot fail. The
            # claim is about the FIGURE: three or more notes, at distinct
            # positions, spread across at least half a bar.
            uniq = sorted(set(steps))
            ok('the %s sting is a PHRASE, not one blurt (%d notes at %d distinct '
               'positions, spanning %d steps)'
               % (which, len(steps), len(uniq), (max(uniq) - min(uniq)) if uniq else 0),
               len(steps) >= 3 and len(uniq) == len(steps)
               and uniq and (max(uniq) - min(uniq)) >= 4)
            # and each of those positions is a real onset in the rendered audio
            hit = [w[i] for i in uniq if i < len(w)]
            rest = [w[i] for i in range(len(w)) if i not in uniq]
            ok('every note of the %s sting lands on the beat it was scheduled '
               'for (%s at steps %s)' % (which, [round(x, 3) for x in hit], uniq),
               len(hit) == len(uniq) and all(h > 0.05 for h in hit))
            ok('the %s sting does not smear across the bar (loudest gap %.3f vs '
               'quietest note %.3f)' % (which, max(rest or [0]), min(hit or [0])),
               not rest or max(rest) < min(hit or [1]))
        ok('the sting transposes: a song in another key still sounds (%.3f)'
           % max((sg.get('winOther') or {}).get('w') or [0]),
           max((sg.get('winOther') or {}).get('w') or [0]) > 0.05)
        # AND IT IS THE INTERVAL IT CLAIMS. Ratios, not note names: a table of
        # semitones can be right and the synth still hand back something else.
        hz = sg.get('hz') or []
        ratios = [round(h / hz[0], 3) for h in hz[1:]] if len(hz) > 1 and hz[0] else []
        want = [1.5, 2.0, 3.0]
        ok('the win sting really is root/fifth/octave/octave+fifth (measured '
           'ratios %s)' % ratios,
           len(ratios) == 3 and all(abs(r - x) < 0.04 for r, x in zip(ratios, want)))
        ok('the sting fires on a live transport', sg.get('fired') is True)
        ok('and refuses a second one inside its own gap', sg.get('refused') is False)

    # ---- THE KILL LAYERS -------------------------------------------------
    kl = d.get('kill') or {}
    ok('the kill layers are driven by the game (KILLMUS)', not kl.get('missing'))
    if not kl.get('missing'):
        st = kl.get('steps') or []
        ok('a fight starts CALM (layers %s)' % (kl.get('atStart') or {}).get('layers'),
           (kl.get('atStart') or {}).get('layers') == 0)
        ok('a killshot is COUNTED (%s)' % [x['kills'] for x in st],
           [x['kills'] for x in st] == [1, 2, 3, 4, 5])
        # HIS 8/26 LADDER REPLACES HIS 8/20 BUTTON, AND THE NEWEST DATE WINS.
        # This asserted CALM / 2 KILLS -> layer 2 / 4 KILLS -> layer 4, which
        # was right when the only input was kills. On 8/26 he re-cut it into
        # three levels and moved the top from four kills to TWO:
        #   "you either kill 2 enemies or theresa whole bunch of people close
        #    together talking type shit for lvl 3"
        # A GATE MUST NEVER OUTRANK A RULING (8/1). The old numbers are not a
        # regression to defend, they are a spec he replaced, so this leg now
        # holds the new one. Law:
        # laws/BOHEMIA_ADDENDUM_MENU_MUSIC_IS_NEVER_INTENSIFIED_8_26_26.md
        got = [x['layers'] for x in st]
        ok('one kill is still CALM (%s)' % got[:1], got and got[0] == 0)
        ok('TWO KILLS GO STRAIGHT TO THE TOP, layer 4 -- his 8/26 ladder, down '
           'from the four kills that shipped (layers after each kill: %s)' % got,
           len(got) == 5 and got[1] == 4 and all(g == 4 for g in got[1:]))
        # DRIVEN, not observed in passing. See the note in the browser leg:
        # watching the five kills above for a gap is timing-dependent and went
        # red on correct code.
        held, landed = kl.get('held') or {}, kl.get('landed') or {}
        ok('the lift is HELD when the transport is mid-bar (step%%16=%s, want %s, '
           'layers %s)' % (held.get('step'), held.get('want'), held.get('layers')),
           held.get('want') == 4 and held.get('layers') == 0)
        ok('and LANDS at the top of the next bar (want %s, layers %s)'
           % (landed.get('want'), landed.get('layers')),
           landed.get('layers') == 4)
        ok('the fight settling puts it back to CALM (%s)'
           % (kl.get('afterReset') or {}).get('layers'),
           (kl.get('afterReset') or {}).get('layers') == 0)
        # AND THE ARRANGEMENT REALLY THICKENS, every faction, both thresholds
        parts = kl.get('parts') or []
        flat2 = [x['n'] for x in parts if x['L2'] <= x['L0']]
        flat4 = [x['n'] for x in parts if x['L4'] <= x['L2']]
        ok('EVERY faction adds parts at 2 kills (%s)'
           % (', '.join(flat2) or '%d factions, all thicken' % len(parts)), not flat2)
        ok('EVERY faction adds parts again at 4 kills (%s)'
           % (', '.join(flat4) or 'all thicken'), not flat4)
        if parts:
            worst = min(parts, key=lambda x: (x['L4'] - x['L0']) / max(x['L0'], 1))
            lift = 100.0 * (worst['L4'] - worst['L0']) / max(worst['L0'], 1)
            ok('the quietest lift is still a real one (%s %s: %d -> %d parts, '
               '+%.0f%%)' % (worst['n'], worst['klay'], worst['L0'], worst['L4'], lift),
               lift >= 20)
        pb = kl.get('putBack') or {}
        ok('the probe put the voice dispatchers back', pb.get('synthOK') and pb.get('drumOK'))

    # ---- THE PAYDAY STING -----------------------------------------------
    pay = d.get('pay') or {}
    ok('getting paid reaches the music (PAYSTING)', not pay.get('missing'))
    if not pay.get('missing'):
        by = {x['label']: x['fired'] for x in (pay.get('steps') or [])}
        ok('a RESTORED save does not sting for every credit ever earned',
           by.get('restore') is False)
        ok('a re-fired snapshot does not sting twice (the report is debounced)',
           by.get('resend') is False)
        ok('SPENDING does not sting -- money leaving gets no flourish',
           by.get('spend') is False)
        ok('but being PAID does sting', by.get('paid') is True)
        pf, wf = pay.get('paidFig') or {}, pay.get('winFig') or {}
        ok('the payday sting SOUNDS (%s, peak %.3f)' % (pf.get('voice'), pf.get('peak') or 0),
           (pf.get('peak') or 0) > 0.05)
        ok('it is a phrase, not one note (%s notes at %s positions)'
           % (pf.get('notes'), pf.get('uniq')),
           (pf.get('notes') or 0) >= 2 and pf.get('uniq') == pf.get('notes'))
        # THE DESIGN DECISION, WRITTEN DOWN AS A CHECK. If a water run were
        # scored as big as surviving a firefight, neither would mean anything.
        ok('a payday is DELIBERATELY smaller than surviving a fight '
           '(%s notes vs %s)' % (pf.get('notes'), wf.get('notes')),
           (pf.get('notes') or 9) < (wf.get('notes') or 0))

    draws = d.get('draws') or {}
    ok('200 redraws of the scratch slot never land on CUSTOM (%s)'
       % (draws.get('CUSTOM') or 0), not draws.get('CUSTOM'))
    buried = set(x.rsplit('#', 1)[0] for x in (d.get('buried') or []))
    hit = sorted(set(draws) & buried)
    ok('and never on a song he buried (%s)' % (', '.join(hit) or 'none'), not hit)
    ok('the redraw spreads across his factions (%d distinct)' % len(draws), len(draws) >= 5)

    ok('the page threw nothing: %s' % (d.get('errs') or 'clean'), not d.get('errs'))

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  Fought a fight: the streets let go, held past 64 bars, and came '
              'back on the phrase. %d factions in the draw, no scratch patch.' % len(draws))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
