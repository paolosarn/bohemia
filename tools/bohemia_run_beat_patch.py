#!/usr/bin/env python3
"""
BOHEMIA — HAND THE RUN THE REAL BEAT (7/29/26, SOUNDS lane, backlog item 1)

THE HOLE, carried from the engine reality map: the walk's BEAT is the literal
`var BEAT=500` and DOOR_MS is `BEAT*2`. Nothing about tempo, beat index or
transport ever crosses the parent->run postMessage vocabulary, while COMBAT gets
full song data and a HERO BEAT. So the run has been counting 500 ms on its own
while a song played next to it, and the two were only ever in agreement because
both happened to be hardcoded to the same number.

That is not the 120 BPM LAW holding. That is two clocks that have not drifted
YET. The moment a song plays at anything other than the baked tempo, or the
studio's scheduler slips, the doors and the music are on separate time.

WHAT THIS SHIPS (the SOUNDS lane owns the plumbing; RUN consumes it):
  PARENT: the MUSIC studio already schedules every 16th on the AudioContext
    clock -- MUS.step and MUS.nextT. On every quarter-beat boundary the parent
    now posts BOHEMIA_RUN_BEAT to the run frame with the beat index, the BPM,
    the ms-per-beat, and -- the part that makes it usable -- the beat's audio
    time TRANSLATED INTO THE CHILD'S performance.now() timebase. An iframe
    cannot read the parent's AudioContext, so a raw AC time would be a number
    the run has no way to interpret.
  RUN: a small receiver phase-locks to those beats and exposes the live clock.
    The two places that used the hardcoded number -- the door animation and the
    slide -- read the live value instead.

FALLBACK IS THE OLD BEHAVIOUR, EXACTLY. With no song playing the receiver
reports 500 ms and the run behaves as it does today, byte for byte. This adds a
truth source; it does not change the feel of a silent run.

REUSE CHECK: nothing fit and nothing needed to -- this draws ZERO graphic pixels,
so no banks/ art bank applies and none was opened. What it reuses is the audio
machinery that already exists: the MUSIC studio's scheduler (MUS.step / MUS.nextT
/ MUS.stepDur) and its AudioContext, plus the existing runPost() channel and the
run's existing message listener. It creates no clock, no context and no second
transport of its own.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md, section 4 MUSIC): the canon's
audio rulings are about voices and screech, and this file adds no voice and no
feedback path. The ruling it does answer to is the 120 BPM LAW itself -- I-MOVE-
YOU-MOVE, everything quantizes to the beat -- which is exactly what a run driven
by the real song clock makes true instead of coincidental.

Idempotent (markers RUN BEAT BRIDGE / RUN BEAT RECEIVER).

  python3 tools/bohemia_run_beat_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
RUN = 'slices/BOHEMIA_RUN_CURRENT.html'

BEGIN = '<!-- BOHEMIA RUN BEAT BRIDGE (7/29/26) -->'
END = '<!-- /BOHEMIA RUN BEAT BRIDGE -->'

# --------------------------------------------------------------------------
# PARENT SIDE: broadcast the studio's own clock.
# --------------------------------------------------------------------------
PARENT = r"""
/* === RUN BEAT BRIDGE (7/29/26, SOUNDS lane) ==============================
   The studio schedules on the AudioContext clock. The run lives in an iframe
   and cannot see that clock at all, so a raw AC time would be meaningless to
   it. Every quarter-beat we translate the beat's audio time into the CHILD'S
   own timebase (performance.now()) and post it. One number the run can act on.

   Posted on the beat boundary only, not per 16th: the run needs the beat, and
   four times the messages for the same information is four times the cost on a
   phone. */
(function(){
  'use strict';
  if(window.__RUNBEAT_BRIDGE)return; window.__RUNBEAT_BRIDGE=true;
  var lastSent=-1;
  function tick(){
    try{
      if(typeof MUS==='undefined'||!MUS.AC){ return; }
      var playing=!!MUS.playing;
      var msPerBeat=(typeof MUS.stepDur==='function')?(MUS.stepDur()*4*1000):500;
      var beat=Math.floor((MUS.step||0)/4);
      if(!playing){
        /* SILENCE IS A STATE, NOT A GAP. Tell the run the transport stopped so
           it free-runs on the last known tempo instead of waiting forever for a
           beat that is not coming. */
        if(lastSent!==-1){ lastSent=-1;
          runPost({type:'BOHEMIA_RUN_BEAT',on:false,bpm:60000/msPerBeat,msPerBeat:msPerBeat}); }
        return;
      }
      if(beat===lastSent)return;
      lastSent=beat;
      /* MUS.nextT is the AC time of the NEXT 16th to be scheduled. Walk back to
         the audio time of the beat we are announcing, then convert into the
         child's clock: perf = now + (audioTime - acNow) * 1000. */
      var acNow=MUS.AC.currentTime;
      var stepDur=(typeof MUS.stepDur==='function')?MUS.stepDur():0.125;
      var atAudio=(MUS.nextT||acNow)-((MUS.step||0)-beat*4)*stepDur;
      /* A DELTA, NEVER A TIMESTAMP. performance.now() is measured from each
         browsing context's OWN time origin, and an iframe's origin is when the
         iframe was created -- so the parent's stamp is ahead of the child's by
         however long the page had been up. Sending one measured the run 22
         beats away from the studio on the first gate run. `inMs` means "this
         beat lands this many milliseconds from when you read this", which is
         true in anybody's clock. postMessage inside one process is sub-
         millisecond; a beat is 500. */
      runPost({type:'BOHEMIA_RUN_BEAT',on:true,beat:beat,bpm:60000/msPerBeat,
               msPerBeat:msPerBeat,inMs:(atAudio-acNow)*1000});
    }catch(_e){}
  }
  setInterval(tick,60);       /* well under a quarter-beat, so no beat is missed */
  window.__runBeatTick=tick;  /* the gate drives this directly */
})();
"""

# --------------------------------------------------------------------------
# RUN SIDE: receive it, phase-lock, expose it.
# --------------------------------------------------------------------------
CHILD = r"""
/* === RUN BEAT RECEIVER (7/29/26, SOUNDS lane) ============================
   THE RUN USED TO COUNT ITS OWN 500 ms. That agreed with the music only because
   both numbers were typed the same, which is not the 120 BPM LAW holding, it is
   two clocks that have not drifted yet.

   RB is the run's view of the SONG'S clock. When the studio is playing it is
   phase-locked to the real transport; when nothing is playing it free-runs at
   the last tempo it was told about, which starts at the 120 BPM default -- so a
   silent run behaves exactly as it did before this existed. */
var RB=(function(){
  'use strict';
  var st={on:false,beat:0,atPerf:0,msPerBeat:500,heard:0};
  function now(){ return (typeof performance!=='undefined')?performance.now():Date.now(); }
  return {
    /* the parent hands us a beat and WHEN it lands in our own timebase */
    take:function(d){
      if(!d)return;
      if(typeof d.msPerBeat==='number'&&d.msPerBeat>50&&d.msPerBeat<4000) st.msPerBeat=d.msPerBeat;
      st.on=!!d.on;
      if(d.on&&typeof d.beat==='number'&&typeof d.inMs==='number'){
        /* resolve the parent's delta into OUR timebase, the only one we can
           actually measure against */
        st.beat=d.beat; st.atPerf=now()+d.inMs; st.heard=now();
      }
    },
    msPerBeat:function(){ return st.msPerBeat; },
    bpm:function(){ return 60000/st.msPerBeat; },
    playing:function(){
      /* a transport that has said nothing for two beats is not playing, whatever
         the last message claimed */
      return st.on && (now()-st.heard) < st.msPerBeat*2.5;
    },
    /* fractional beats since the announced beat: the run's phase on the song */
    beatNow:function(){
      if(!this.playing()) return (now()/st.msPerBeat);
      return st.beat + (now()-st.atPerf)/st.msPerBeat;
    },
    phase:function(){ var b=this.beatNow(); return b-Math.floor(b); },
    /* ms from now until the next downbeat -- what an on-the-beat action waits */
    msToNextBeat:function(){
      var b=this.beatNow();
      return (Math.ceil(b)-b)*st.msPerBeat;
    },
    _state:function(){ return {on:st.on,beat:st.beat,msPerBeat:st.msPerBeat,
                               heard:st.heard,playing:this.playing()}; }
  };
})();
/* the two places the run used the hardcoded number now ask the song */
function rbBeatMs(){ return RB.msPerBeat(); }
function rbDoorMs(){ return RB.msPerBeat()*2; }   /* a door is 2 beats, always */
"""


def main():
    for f in (ALPHA, RUN):
        if not os.path.exists(f):
            print('FAIL: missing %s' % f)
            return 1

    # ---- parent ----
    alpha = open(ALPHA, encoding='utf8').read()
    # MARKERS, NOT LANDMARKS. The first version of this removal computed its end
    # offset by counting from a code line and stopped ONE LINE SHORT, leaving an
    # orphaned `})();` inside its own <script> tag -- which threw "Unexpected
    # token '}'" on every page load and was invisible until a gate opened the
    # real browser. A wrapper you insert is a wrapper you delete whole.
    if BEGIN in alpha:
        i = alpha.index(BEGIN)
        j = alpha.index(END) + len(END)
        alpha = alpha[:i] + alpha[j:]
        print('parent bridge removed (idempotent re-inject)')
    anchor = '<div id="exportModal"'
    if anchor not in alpha:
        print('FAIL: no anchor in the alpha')
        return 1
    k = alpha.index(anchor)
    alpha = alpha[:k] + BEGIN + '\n<script>' + PARENT + '</script>\n' + END + '\n' + alpha[k:]
    open(ALPHA, 'w', encoding='utf8').write(alpha)

    # ---- child ----
    run = open(RUN, encoding='utf8').read()
    if 'RUN BEAT RECEIVER (7/29/26' in run:
        i = run.index('/* === RUN BEAT RECEIVER (7/29/26')
        j = run.index("function rbDoorMs(){ return RB.msPerBeat()*2; }   /* a door is 2 beats, always */")
        j = run.index('\n', j) + 1
        run = run[:i] + run[j:]
        print('run receiver removed (idempotent re-inject)')

    # inject the receiver just above the door block that uses it
    door = 'var BEAT=500, DOOR_MS=BEAT*2;                        /* 120 BPM LAW: 2 beats */'
    if door not in run:
        # already rewired; find the rewired form
        door = 'var BEAT=500, DOOR_MS=BEAT*2;   /* fallback only: RB is the truth (7/29) */'
    if door not in run:
        print('FAIL: cannot find the run\'s beat constant')
        return 1
    run = run.replace(door, CHILD +
                      'var BEAT=500, DOOR_MS=BEAT*2;   /* fallback only: RB is the truth (7/29) */', 1)

    # the two use sites read the live clock
    a = 'var p=Math.min(1,(now-d.t0)/DOOR_MS);'
    b = 'var p=Math.min(1,(now-d.t0)/rbDoorMs());   /* the SONG says how long a door takes */'
    if a in run:
        run = run.replace(a, b, 1)
    elif b not in run:
        print('FAIL: cannot find the door progress line')
        return 1

    c = 'var k=Math.min(1,(Date.now()-SLIDE.t0)/BEAT);'
    d_ = 'var k=Math.min(1,(Date.now()-SLIDE.t0)/rbBeatMs());   /* one BEAT of the real song */'
    if c in run:
        run = run.replace(c, d_, 1)
    elif d_ not in run:
        print('FAIL: cannot find the slide line')
        return 1

    # and the listener takes the message
    lis = "window.addEventListener('message', function(ev){"
    if 'BOHEMIA_RUN_BEAT' not in run:
        run = run.replace(lis, lis + """
  /* the song's clock, from the parent (SOUNDS lane plumbing, 7/29) */
  try{ if(ev&&ev.data&&ev.data.type==='BOHEMIA_RUN_BEAT'){ RB.take(ev.data); return; } }catch(_e){}""", 1)
    open(RUN, 'w', encoding='utf8').write(run)

    print('THE RUN IS ON THE SONG\'S CLOCK.')
    print('  parent: posts BOHEMIA_RUN_BEAT every beat, audio time translated into')
    print('          the child\'s performance.now() timebase')
    print('  run:    RB phase-locks; door + slide read the live tempo')
    print('  silent: RB reports 500ms, behaviour identical to before')
    return 0


if __name__ == '__main__':
    sys.exit(main())
