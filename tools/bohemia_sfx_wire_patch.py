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

WHAT IT DOES NOT WIRE: doors. door_open and door_shut have ZERO approved sounds
-- he killed all ten candidates -- so the game makes no door sound, on purpose,
until he rules on one. Wiring a door to a sound he rejected would be the exact
thing MECHANISM-MINE / CONTENTS-PAOLO'S forbids.

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
BANK = 'banks/BOHEMIA_SFX_APPROVED_7_30_26.json'
VERDICT = 'records/BOHEMIA_SFX_VERDICT_7_30_26.txt'

P_BEGIN = '<!-- BOHEMIA SFX WIRE PARENT (7/30/26) -->'
P_END = '<!-- /BOHEMIA SFX WIRE PARENT -->'


def parent_block(bank):
    return """
/* === SFX WIRE, PARENT SIDE (7/30/26) ====================================
   Paolo's 38 approved sounds, from his 7/30 thumbs. The table below is INDEXES
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
  var last={};                       /* per event: what played last, never twice */
  function pick(ev){
    var set=APPROVED[ev]; if(!set||!set.length)return null;   /* unjudged = silent */
    if(set.length===1)return set[0];
    var i, guard=0;
    do{ i=set[(Math.random()*set.length)|0]; }while(i===last[ev] && ++guard<8);
    last[ev]=i; return i;
  }
  var cache={};
  function vec(ev,i){
    var k=ev+'.'+i;
    if(!cache[k]){ try{ cache[k]=BOH_SFX.cook(ev,5)[i]; }catch(e){ return null; } }
    return cache[k];
  }
  /* THE ONE ENTRY POINT. when==='beat' fires on the next downbeat of the real
     song (the 120 BPM LAW: a kill lands ON the beat), anything else fires now. */
  window.playSFX=function(ev,when){
    try{
      if(typeof BOH_SFX==='undefined')return null;
      var i=pick(ev); if(i==null)return null;
      var v=vec(ev,i); if(!v)return null;
      MUS.audio();
      var AC=MUS.AC, dest=MUS.MAST||AC.destination;
      var at=null;
      if(when==='beat' && MUS.playing && MUS.nextT){
        /* the next 16th that is also a beat boundary */
        var sd=MUS.stepDur(), s=MUS.step||0, ahead=(4-(s%%4))%%4;
        at=MUS.nextT+ahead*sd;
      }
      return BOH_SFX.render(v,AC,dest,at);
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
  function unlock(){
    try{ MUS.audio(); if(MUS.AC && MUS.AC.state==='suspended') MUS.AC.resume(); }catch(e){}
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
      if(d.type==='BOHEMIA_SFX') window.playSFX(d.ev,d.when);
    }catch(e){}
  });
  /* the parent's own surfaces: every button on the phone is a UI TAP */
  document.addEventListener('click',function(e){
    var t=e&&e.target; if(!t)return;
    if(t.closest&&(t.closest('button')||t.closest('.tab')||t.closest('.opt')))
      window.playSFX('ui_tap');
  },true);
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
/* TELL THE PARENT A FINGER LANDED (7/31). A touch in here never reaches the
   parent's document, so the parent can be sitting with no audio at all while
   the thumb hammers the D-pad. This fires on the gesture itself, ahead of any
   sound, so the audio has already started by the time a footstep is asked for. */
(function(){
  function gesture(){
    try{ if(window.parent&&window.parent!==window)
      window.parent.postMessage({type:'BOHEMIA_GESTURE'},'*'); }catch(_e){}
  }
  ['pointerdown','touchstart','mousedown','keydown'].forEach(function(t){
    try{ document.addEventListener(t, gesture, {capture:true, passive:true}); }catch(_e){}
  });
})();
function sfxGround(gx,gy){
  try{
    if(mode!=='ext') return 'step_asphalt';        /* indoors is a hard floor */
    if(typeof isRoad==='function' && isRoad(gx,gy)) return 'step_asphalt';
    var n='';
    try{ n=(NAMEG&&NAMEG[gy]&&NAMEG[gy][gx]||'').toLowerCase(); }catch(_e){}
    if(/gravel|shoulder|rock|caliche|lag|track/.test(n)) return 'step_gravel';
    if(/asphalt|roadway|lane|street|sidewalk|walk|path|concrete|apron|pad|slab|lot|parking|platform|court/.test(n))
      return 'step_asphalt';
    return 'step_dirt';                            /* desert, yards, everything else */
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

    open(RUN, 'w', encoding='utf8').write(run)
    r = subprocess.run(['node', 'tools/build_run_slice.js'], capture_output=True, text=True)
    if r.returncode != 0:
        print('FAIL: the run would not rebuild:\n' + (r.stderr or '')[-800:])
        return 1
    built = open(BUILT, encoding='utf8').read()
    if 'SFX WIRE, RUN SIDE' not in built or 'sfxGround(px,py)' not in built:
        print('FAIL: the rebuilt run does not carry the wire')
        return 1

    print('THE APPROVED SOUNDS PLAY NOW.')
    print('  %d approved sounds across %d events, from his 7/30 thumbs' % (n, len(bank)))
    print('  footsteps chosen by the tile the game already knows')
    print('  doors: SILENT, on purpose -- he killed all ten door candidates')
    return 0


if __name__ == '__main__':
    sys.exit(main())
