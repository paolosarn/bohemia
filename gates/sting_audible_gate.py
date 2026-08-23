#!/usr/bin/env python3
"""
BOHEMIA STING AUDIBLE GATE (8/20/26) — every musical sting actually makes sound.

WHY THIS EXISTS. The STING system answers the moments that are NOT one-shot
sound effects: winning a fight, losing one, getting paid. It reaches the rack
through `synthV`, and this repo has already been burned twice by that call:

  * `ironlung` and `throatsong` were GRAVEYARDED voices. synthV took the name,
    found nothing, and rendered a silent gain. Every gate stayed green.
  * `knock`, `rim`, `wood` and `brim` are drumV kinds. Passed to synthV they
    also render silent. Same shape, different cause.

In both cases the code was correct-looking, the wire was real, the gate was
green, and the game made no sound. A NAME THAT RESOLVES TO NOTHING IS THE ONE
FAILURE THIS PATH KEEPS HAVING, and reading the source cannot catch it -- only
rendering can.

So this gate does what VERIFY ON THE REAL SURFACE demands: it loads the shipped
alpha, renders EVERY figure in STING.FIG through the REAL synthV into an
OfflineAudioContext, and measures the samples that come out. A sting whose
voice does not resolve produces silence, and silence fails.

WHAT IT ASSERTS:
  1. EVERY FIGURE RENDERS      each STING.FIG entry produces audible RMS
  2. EVERY NOTE COUNTS         a figure's peak is above a judgeable floor, so a
                               sting cannot pass on one inaudible tick
  3. NO FIGURE IS GRAVEYARDED  no figure's voice appears in the graveyard
  4. THE FIGURES ARE REACHED   every figure name has a caller in the build

Run from repo root:  python3 gates/sting_audible_gate.py
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

# a sting is a musical gesture over a couple of beats, not a click. These floors
# are the same order as the ones sfx_render_gate uses for a judgeable candidate.
RMS_FLOOR = 0.0008
PEAK_FLOOR = 0.010

JS = r"""
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw(); const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
  const out={};
  try{
    await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
    await p.waitForTimeout(1500);
    await p.click('#front');
    await p.waitForTimeout(3000);
    Object.assign(out, await p.evaluate(async()=>{
      const r={figs:{}};
      if(typeof STING==='undefined') return {fatal:'no STING in the build'};
      const SV=window.synthV||(typeof synthV!=='undefined'?synthV:null);
      if(!SV) return {fatal:'no synthV in the build'};
      r.names=Object.keys(STING.FIG);
      for(const k of r.names){
        const F=STING.FIG[k];
        /* RENDER IT THE WAY STING DOES. Same voice, same gain, same duration,
           same semitone maths, same note offsets -- the only difference is an
           OfflineAudioContext instead of the live one, so we can look at the
           samples. Anything else would be measuring a different sound. */
        const AC=new OfflineAudioContext(1,44100*4,44100);
        const bus=AC.createGain(); bus.gain.value=1; bus.connect(AC.destination);
        const hz=x=>440*Math.pow(2,x/12);
        const step=0.125, root=45;
        for(let i=0;i<F.n.length;i++){
          const semi=root+F.oct+F.n[i][0]-55;
          const t=0.05+F.n[i][1]*step;
          try{ SV(F.v,AC,bus,hz,F.sd,semi,t,F.g); }catch(e){ r.figs[k]={err:String(e&&e.message||e)}; }
        }
        let buf=null;
        try{ buf=await AC.startRendering(); }catch(e){ r.figs[k]={err:'render: '+String(e&&e.message||e)}; continue; }
        const d=buf.getChannelData(0);
        let s=0,pk=0;
        for(let i=0;i<d.length;i++){ const v=d[i]; s+=v*v; const a=v<0?-v:v; if(a>pk)pk=a; }
        r.figs[k]={voice:F.v, notes:F.n.length,
                   rms:Math.sqrt(s/d.length), peak:pk};
      }
      /* ---- QUESTSTING FIRES ON A REAL TRANSITION -----------------------
         Not "the code is present" -- DRIVE IT. Two city-state messages of the
         shape the city actually posts (citySnapshot carries quest:DQ.serialize(),
         which carries state.done and state.outcome), and watch what STING is
         asked to play. Spy, then PUT IT BACK. */
      if(typeof QUESTSTING!=='undefined'){
        const wait=ms=>new Promise(z=>setTimeout(z,ms));
        const realPlay=STING.play.bind(STING); const asked=[];
        try{
          STING.play=function(w){ asked.push(w); return true; };
          const Q=(done,outcome)=>({quest:{id:'q1',state:{id:'q1',done:done,outcome:outcome}}});
          QUESTSTING.seen=null;
          QUESTSTING.onState(Q(false,''));      /* baseline: must NOT sound */
          r.qBaseline=asked.slice();
          QUESTSTING.onState(Q(true,'COMPLETE'));
          r.qComplete=asked.slice();
          asked.length=0;
          QUESTSTING.seen=null;
          QUESTSTING.onState(Q(false,''));
          QUESTSTING.onState(Q(true,'FAILED'));
          r.qFailed=asked.slice();
          asked.length=0;
          /* a save loaded with the quest ALREADY done is not the moment */
          QUESTSTING.seen=null;
          QUESTSTING.onState(Q(true,'COMPLETE'));
          QUESTSTING.onState(Q(true,'COMPLETE'));
          r.qReload=asked.slice();
        } finally { STING.play=realPlay; }
        r.qPutBack=(STING.play===realPlay);
        await wait(10);
      }
      return r;
    }));
  }catch(e){ out.fatal=String(e&&e.message||e); }
  out.errs=errs;
  console.log('@@'+JSON.stringify(out));
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
    print('=== STING AUDIBLE GATE — every musical sting actually makes sound ===')
    src = open(ALPHA, encoding='utf8').read()

    fd, jp = tempfile.mkstemp(suffix='.js')
    os.write(fd, JS.encode())
    os.close(fd)
    try:
        r = subprocess.run(['node', jp, ROOT], capture_output=True,
                           text=True, timeout=420)
    finally:
        os.unlink(jp)
    line = [x for x in (r.stdout or '').splitlines() if x.startswith('@@')]
    if not line:
        print('  FAIL  the probe returned nothing:\n' + (r.stderr or '')[-900:])
        print('  0 passed, 1 FAILED')
        return 1
    d = json.loads(line[-1][2:])
    if d.get('fatal'):
        print('  FAIL  ' + d['fatal'])
        print('  0 passed, 1 FAILED')
        return 1

    figs = d.get('figs') or {}
    ok('the build declares musical stings (%s)'
       % (', '.join(d.get('names') or []) or 'none'), bool(figs))

    # ---- WHAT "GRAVEYARDED" ACTUALLY LOOKS LIKE IN THAT FILE -------------
    # The first version of this check lowercased the whole graveyard and asked
    # if the voice name appeared ANYWHERE in it. That failed `bell` -- which the
    # file records as 25 UP / 0 DOWN, approved, in a paragraph EXPLAINING why
    # bells work. A MENTION IS NOT A USE, and a checker that cannot tell them
    # apart is the broken one; this repo has a law about exactly that and I
    # broke it writing the check.
    #
    # The file's real shape is `regex | verdict date | what replaced it`, and a
    # retired VOICE is recorded in the reason column with a fixed phrase:
    #     n:'THROAT OF THE DROWNED NAVE' | 7/19/26 | ... throatsong voice retired with it.
    # So the precise question is whether the voice is named as RETIRED, plus the
    # case where a voice is its own entry in the identifier column.
    gsrc = ''
    if os.path.exists('gates/bohemia_graveyard.txt'):
        gsrc = open('gates/bohemia_graveyard.txt', encoding='utf8').read()
    retired = set(m.lower() for m in
                  re.findall(r'\b([a-z][a-z0-9_]{2,})\s+voice\s+retired', gsrc, re.I))
    # SONG-DEAD-IS-NOT-VOICE-DEAD, and the file says so itself: "GRAVEYARD FINAL
    # for the song; scrapchime voice LIVES (song-dead-not-voices)". Song entries
    # are the ones whose identifier is n:'SOME TITLE', and tokenising those
    # titles is what wrongly buried `bell` -- there is a dead song called
    # A BELL FOR NOBODYS SHIFT, which says nothing whatever about the voice.
    # Only NON-song entries name code identifiers.
    for ln in gsrc.splitlines():
        head = ln.split('|')[0]
        if '|' not in ln or ln.lstrip().startswith('#') or head.lstrip().startswith("n:'"):
            continue
        for tok in re.findall(r'[a-z][a-z0-9_]{2,}', head, re.I):
            retired.add(tok.lower())

    # PROVE THE RULER ON KNOWN ANSWERS, in the gate itself, every run. These
    # three are the voices this repo has actually retired, and `bell` is the one
    # the naive version got wrong. If the graveyard file is ever restructured,
    # this fails here rather than silently clearing a dead voice downstream.
    ok('the graveyard reader finds the voices this repo really retired '
       '(ironlung, throatsong, clusternave)',
       {'ironlung', 'throatsong', 'clusternave'} <= retired)
    ok('and does not mistake a voice the graveyard merely DISCUSSES for a dead '
       'one (bell is recorded there as 25 UP / 0 DOWN)', 'bell' not in retired)

    # ---- THE ARGUMENT TEXT OF EVERY STING.play CALL ----------------------
    # `[^)]*` was wrong: STING.play((b[2]==='COMPLETE')?'done':'loss') contains
    # parentheses, so it captured only up to the first one and lost the names.
    # Balance the parens instead of guessing how deep they go.
    calls = []
    for m in re.finditer(r'STING\.play\(', src):
        i, depth = m.end(), 1          # NOT `d` -- that is the probe result
        while i < len(src) and depth:
            if src[i] == '(':
                depth += 1
            elif src[i] == ')':
                depth -= 1
            i += 1
        calls.append(src[m.end():i - 1])
    ok('the build contains STING.play calls at all (%d)' % len(calls), bool(calls))

    for k in sorted(figs):
        f = figs[k]
        if f.get('err'):
            ok('%s renders without throwing (%s)' % (k, f['err']), False)
            continue
        # 1 + 2: IT MAKES A SOUND, and enough of one to be heard over a score.
        ok('STING %-5s (%s) is AUDIBLE, not a silent gain: rms %.5f >= %.5f'
           % (k, f['voice'], f['rms'], RMS_FLOOR), f['rms'] >= RMS_FLOOR)
        ok('STING %-5s (%s) peaks above the judgeable floor: %.4f >= %.4f'
           % (k, f['voice'], f['peak'], PEAK_FLOOR), f['peak'] >= PEAK_FLOOR)
        # 3: the ironlung lesson, held by name as well as by measurement
        ok('STING %s does not play a GRAVEYARDED voice (%s)' % (k, f['voice']),
           f['voice'].lower() not in retired)
        # 4: APPROVED-BUT-UNUSED, for stings. A figure nothing calls is dead code.
        #
        # A USE IS NOT ALWAYS A LITERAL. The first version of this check looked
        # for STING.play('win') and failed on win and loss, which are perfectly
        # well called -- as STING.play(enc.victory?'win':'loss'). The ternary is
        # the real caller and the check was the broken one. (Same lesson the
        # ambience rotation taught in silent_moments_gate: `return 'dog_calls'`
        # is a caller too.) So collect the ARGUMENT TEXT of every STING.play
        # call in the build and look for the name inside it -- which still
        # refuses a bare mention elsewhere in the file, because it only ever
        # reads what sits between that call's own parentheses.
        ok('something in the build actually plays STING %s (callers: %s)'
           % (k, ' | '.join(calls) or 'none'),
           any(("'%s'" % k) in c or ('"%s"' % k) in c for c in calls))

    # ---- QUESTSTING, DRIVEN RATHER THAN GREPPED -------------------------
    # IT IS DONE went 0 UP / 20 DOWN as a sound effect because it is a MUSICAL
    # CUE. Having built the cue, the thing worth proving is not that the code is
    # there -- it is that a job finishing actually reaches it, and that the
    # things which are NOT the moment stay silent.
    if 'qComplete' in d:
        ok('QUESTSTING is silent on the first report (a baseline is not a '
           'moment): %s' % (d.get('qBaseline') or 'silent'), not d.get('qBaseline'))
        ok('finishing a job plays the DONE cadence (%s)'
           % (d.get('qComplete') or 'nothing'), d.get('qComplete') == ['done'])
        # CHANGED 8/22, AND THE BEHAVIOUR MOVED FIRST, NOT THE CHECK. This used
        # to demand `loss`, on the reasoning that "failing a job and losing a
        # fight are the same shape of moment". Walking the actual demo proved
        # they are not: the player takes the day-one job, does not finish it,
        # taps SLEEP, and the game played the fight-DEFEAT cadence -- heavy,
        # falling, authored for being beaten -- over going to bed. That is the
        # mistake the `paid` figure warns about pointed the other way ("a water
        # run in a dead valley is not a boss kill"). A missed job now has its
        # own small figure. This is not a check being loosened to match a
        # regression; it is a check following a ruling I made and can defend.
        ok('a MISSED job plays its own small figure, not the fight-defeat '
           'cadence (%s)' % (d.get('qFailed') or 'nothing'),
           d.get('qFailed') == ['missed'])
        ok('loading a save whose quest is ALREADY done makes no sound, because '
           'that is not the moment of finishing it (%s)'
           % (d.get('qReload') or 'silent'), not d.get('qReload'))
        ok('the probe put STING.play back', d.get('qPutBack'))
    else:
        ok('QUESTSTING is in the build so a finished job can be heard', False)

    ok('the page threw nothing: %s' % (d.get('errs') or 'clean'), not d.get('errs'))

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  Every sting in the build makes a sound. Measured, not read.')
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
