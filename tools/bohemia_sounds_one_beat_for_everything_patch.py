#!/usr/bin/env python3
"""
BOHEMIA - ONE BEAT FOR EVERYTHING (SOUNDS 10/26/26, row [one beat for everything], rule 221(b)).

PAOLO 10/26: 'when does the music get implemented in the combat? I'm tired of not everything being on the same BPM, not
sounding good.' EYES (line 47): AUTO's hits, swings and shots land about 100 ms after the song's quarter beats.

THE ONE CLOCK IS THE AUDIO CLOCK. The song's transport books every sixteenth on it (THE ONE BEAT, 10/24: every booked beat
stamped where it is HEARD, the grid kept through a swap, a stall and a silence). The music is on it; the effects were not:
an effect asked for 'now' started at the audio clock's 'now', wherever that fell against the song (a postMessage from the fight,
a timer, a busy thread). Now every effect asked for 'now' starts on the song's next sixteenth OF THE SAME AUDIO CLOCK, so the
music and the effect reach the speaker together: the device's output delay (the context's outputLatency and baseLatency, a
phone 10 to 40 ms, Bluetooth 150 and more) is the same for both, which is the correction: what he HEARS lands on the beat.
  HOW, without touching one recipe: while an effect is being made (playSFX with no 'when', the fight's BOHEMIA_SFX, the map's
  BOHEMIA_SFX_AT and BOHEMIA_NPCSTEP, the real guns and landings through BULLET), its one-shot player puts a DelayNode of
  exactly (the next sixteenth - now) between it and its bus (a bus itself is never wired through one). The effect's own envelope, echoes and
  stops are untouched (they run from 'now' as before); its sound simply comes out on the grid. Asked within 12 ms after a
  sixteenth it plays at once (at most 12 ms late); no grid yet (no song ever played) it plays at once.
  A SOUND THAT KNOWS ITS MOMENT: a message may carry `at` (the epoch ms where it should be HEARD, the fight's own clock:
  performance.timeOrigin + performance.now(), the same in every frame); it is put on the audio clock through the context's
  output timestamp, on the grid point within 20 ms of it, exactly, however late the message came, as long as it came first.
  BOHEMIA_BEAT.sound(ev, facts, atEpoch) does the same from inside the shell.
  Effects booked for later ('beat', a number) are left as booked.
THE GATE: gates/one_beat_for_everything_gate.js.
Idempotent. python3 tools/bohemia_sounds_one_beat_for_everything_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHELLS = [os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), os.path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html')]
START = '<!-- __ONE_BEAT_FOR_EVERYTHING__ (SOUNDS 10/26, rule 221(b)) -->'
END = '<!-- /__ONE_BEAT_FOR_EVERYTHING__ -->'
TAIL = '</body></html>'
MARK = '/* __ONE_BEAT_FOR_EVERYTHING__ 10/26 */'

# THE ONE-SHOT PLAYERS hand their sound the grid's delay while an effect is being made (playSFX, the real guns and landings
# through __sfxOut, a placed sound, a neighbour's step). Never the buses themselves: a long-lived bus made inside the moment
# (the sting's, a bed's) must never be wired through one effect's delay.
R = "if(window.__SFXSNAP) %s=window.__SFXSNAP.route(%s);   " + MARK
BUS_EDITS = [
    ("""               || MUS.OUT || MUS.MAST || AC.destination;""",
     """               || MUS.OUT || MUS.MAST || AC.destination;
      """ + R % ('dest', 'dest')),
    ("""bus: sfxBus() || MUS.OUT || MUS.MAST || AC.destination } : null;""",
     """bus: (window.__SFXSNAP ? window.__SFXSNAP.route(sfxBus() || MUS.OUT || MUS.MAST || AC.destination) : (sfxBus() || MUS.OUT || MUS.MAST || AC.destination)) } : null;   """ + MARK),
    ("""      var out = dest0 || sfxBus() || MUS.OUT || MUS.MAST || AC.destination;
      if(!out) return null;""",
     """      var out = dest0 || sfxBus() || MUS.OUT || MUS.MAST || AC.destination;
      if(!out) return null;
      """ + R % ('out', 'out')),
    ("""var out=sfxBus(); if(!out)return;""",
     """var out=sfxBus(); if(!out)return; """ + R % ('out', 'out')),
]

BLOCK = r'''<!-- __ONE_BEAT_FOR_EVERYTHING__ (SOUNDS 10/26, rule 221(b)) -->
<script>
/* ============================================================================
   __ONE_BEAT_FOR_EVERYTHING__ (SOUNDS 10/26/26, row [one beat for everything], rule 221(b))

   PAOLO 10/26: 'when does the music get implemented in the combat? I'm tired of not everything being on the same BPM, not
   sounding good.' EYES (line 47): AUTO's hits, swings and shots landed about 100 ms after the song's quarter beats.

   THE ONE CLOCK IS THE AUDIO CLOCK. The song's transport books every sixteenth on it (__THE_ONE_BEAT__); now every effect
   asked for 'now' starts on the song's next sixteenth of that same clock, so the music and the effect come out of the
   speaker together, whatever the device's output delay (outputLatency + baseLatency: the same for both). While an effect is
   being made, its one-shot player (playSFX, the real guns and landings through __sfxOut, a placed sound, a neighbour's
   step) puts a DelayNode of exactly (the next sixteenth - now) between it and its bus: its envelope, echoes and stops run as
   they always did, its sound lands on the grid (a bus itself is never wired through one). Asked within 12 ms
   after a sixteenth, it plays at once; no grid yet, at once; booked for later ('beat', a number), as booked.
   A message may carry `at`, the epoch ms (performance.timeOrigin + performance.now()) where it should be HEARD: it goes on
   the audio clock through the output timestamp, on the grid point within 20 ms of it, exactly.
   READ IT: window.__ONEBEAT.state(), .log (every effect: ev, why, c, T, d, heard); BOHEMIA_BEAT.sound(ev, facts, atEpoch);
   BOHEMIA_BEAT.grid(t) the first sixteenth at or after audio time t. tools/bohemia_sounds_one_beat_for_everything_patch.py,
   gates/one_beat_for_everything_gate.js.
   ========================================================================== */
(function(){
 'use strict';
 if(window.__ONEBEAT) return;
 var LATE_OK=0.012, NEAR=0.02;
 var R=window.__ONEBEAT={ on:true, log:[], n:0, grid:0, now:0, at:0, free:0, depth:0, cur:null, errs:[] };
 function live(){ try{ var A=MUS.AC; if(!A || A.state!=='running') return null;
   if(window.OfflineAudioContext && A instanceof window.OfflineAudioContext) return null; return A; }catch(e){ return null; } }
 function sd(){ try{ return MUS.stepDur(); }catch(e){ return 0.125; } }
 /* the first sixteenth of the booked grid at or after audio time t (null: no grid yet) */
 function gridAt(t){
  var b=null; try{ b=window.__beatNext ? window.__beatNext(t) : null; }catch(e){ b=null; }
  if(b==null || !isFinite(b) || b<t-1e-6) return null;
  var s=sd(); return b-Math.floor((b-t)/s+1e-9)*s;
 }
 function ctxOf(A, e){
  var ts=null; try{ ts=A.getOutputTimestamp && A.getOutputTimestamp(); }catch(_e){}
  if(ts && ts.contextTime>0 && ts.performanceTime>0) return ts.contextTime+(e-performance.timeOrigin-ts.performanceTime)/1000;
  return A.currentTime+(e-performance.timeOrigin-performance.now())/1000-((A.outputLatency||0)+(A.baseLatency||0));
 }
 function heardOf(A, T){
  var ts=null; try{ ts=A.getOutputTimestamp && A.getOutputTimestamp(); }catch(_e){}
  if(ts && ts.contextTime>0 && ts.performanceTime>0) return performance.timeOrigin+ts.performanceTime+(T-ts.contextTime)*1000;
  return performance.timeOrigin+performance.now()+(T-A.currentTime+(A.outputLatency||0)+(A.baseLatency||0))*1000;
 }
 function plan(A, atEpoch){
  var c=A.currentTime, s=sd(), T, why;
  if(atEpoch!=null && isFinite(+atEpoch)){
   var t=ctxOf(A, +atEpoch), g=gridAt(t-NEAR); T=(g!=null && Math.abs(g-t)<=NEAR) ? g : t; why='at';
   if(T<c) T=c;
  } else {
   var N=gridAt(c);
   if(N==null){ T=c; why='free'; }
   else if(c-(N-s)<=LATE_OK && N-c>1e-4){ T=c; why='now'; }
   else { T=N; why='grid'; }
  }
  return { c:c, T:T, d:Math.max(0, T-c), why:why };
 }
 function open(atEpoch, ev){
  if(R.depth++>0) return;
  var A=live(); if(!A || !R.on){ R.cur=null; return; }
  var p; try{ p=plan(A, atEpoch); }catch(e){ R.errs.push('plan: '+e.message); R.cur=null; return; }
  p.ev=ev; R.n++; R[p.why]++; R.cur=p;
  try{ p.heard=+heardOf(A, p.T).toFixed(1); }catch(e){}
  R.log.push({ ev:ev, why:p.why, c:+p.c.toFixed(4), T:+p.T.toFixed(4), d:+(p.d*1000).toFixed(1), heard:p.heard });
  if(R.log.length>600) R.log.shift();
  if(p.d<0.0005) return;
  var made=[];
  window.__SFXSNAP={ ac:A, d:p.d, route:function(real){
   if(!real || real.context!==A) return real;
   for(var i=0;i<made.length;i++) if(made[i][0]===real) return made[i][1];
   var n=A.createDelay(1); n.delayTime.value=p.d; n.connect(real); made.push([real, n]); return n; } };
 }
 function close(){ if(R.depth>0) R.depth--; if(R.depth===0){ window.__SFXSNAP=null; R.cur=null; } }
 R.scope=function(fn, atEpoch, ev){ open(atEpoch, ev); try{ return fn(); } finally { close(); } };
 R.state=function(){ return { n:R.n, grid:R.grid, now:R.now, at:R.at, free:R.free, depth:R.depth, errs:R.errs.slice(-5) }; };

 /* every effect asked for now, from the shell itself (a tap, a tick, the town, the map) */
 var PS=window.playSFX;
 if(typeof PS==='function'){
  window.playSFX=function(ev, when, mul){
   if((when!=null && when!=='now') || R.depth>0) return PS.apply(this, arguments);
   return R.scope(function(){ return PS(ev, null, mul); }, null, ev);
  };
 }
 /* the fight's real guns and landings, and anything else the BULLET plays on a message */
 try{ if(window.BULLET && typeof BULLET.heard==='function'){ var BH=BULLET.heard;
  BULLET.heard=function(m){ var self=this, a=arguments; if(R.depth>0 || (m && m.when!=null)) return BH.apply(self, a);
   return R.scope(function(){ return BH.apply(self, a); }, m && m.at, m && m.ev); }; } }catch(e){ R.errs.push('bullet: '+e.message); }
 /* a message that makes a sound: the scope opens before the shell's own handler (capture) and closes after it (registered
    last, at the end of the page) */
 var SOUNDING={ BOHEMIA_SFX:1, BOHEMIA_SFX_AT:1, BOHEMIA_NPCSTEP:1 };
 var held=false;
 window.addEventListener('message', function(ev){
  var d=ev && ev.data; if(!d || !SOUNDING[d.type] || d.when!=null || held) return;
  held=true; open(d.at, d.ev || d.type);
 }, true);
 window.addEventListener('message', function(ev){ if(held){ held=false; close(); } });
 /* the one clock, handed on: the grid on the audio clock, and a sound at a heard moment */
 try{ if(window.BOHEMIA_BEAT){
  BOHEMIA_BEAT.grid=function(t){ var A=live(); return gridAt(t==null ? (A ? A.currentTime : 0) : t); };
  BOHEMIA_BEAT.sound=function(ev, facts, atEpoch){ return R.scope(function(){
    var d=Object.assign({ ev:ev }, facts||{}), b=null; try{ b=window.BULLET ? BULLET.heard(d) : null; }catch(_e){ b=null; }
    if(b==='done') return true; return PS ? PS(b && b.swap ? b.swap : ev, null, d.mul) : null; }, atEpoch, ev); };
 } }catch(e){ R.errs.push('beat: '+e.message); }
})();
</script>
<!-- /__ONE_BEAT_FOR_EVERYTHING__ -->'''


def die(msg):
    print('ONE BEAT FOR EVERYTHING PATCH: ' + msg)
    sys.exit(1)


def main():
    for p in SHELLS:
        s = open(p, encoding='utf-8').read()
        for old, new in BUS_EDITS:
            if new in s:
                continue
            if s.count(old) != 1:
                die(os.path.basename(p) + ': a bus found %d times: %s' % (s.count(old), old.strip().split('\n')[0]))
            s = s.replace(old, new)
        if START in s:
            a = s.index(START)
            b = s.index(END, a) + len(END)
            s = s[:a] + BLOCK + s[b:]
        else:
            if not s.rstrip().endswith(TAIL):
                die(os.path.basename(p) + ': the page does not end in ' + TAIL)
            i = s.rindex(TAIL)
            s = s[:i] + BLOCK + '\n' + s[i:]
        open(p, 'w', encoding='utf-8').write(s)
        print('patched ' + os.path.basename(p))


if __name__ == '__main__':
    main()
