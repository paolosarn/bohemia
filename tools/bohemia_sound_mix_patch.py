#!/usr/bin/env python3
"""
BOHEMIA - THE MIX BUS, AND THE VOLUME HE ASKED ME TO MAKE SURE EXISTED.

TWO THINGS, AND THE FIRST ONE IS A BUG I FOUND BY MEASURING, NOT BY READING.

=== 1. TURNING THE MUSIC OFF SILENCED EVERY SOUND EFFECT IN THE GAME ==========

MEASURED on the real surface before a line was changed (peak at the master's
output, so it is what reaches the speaker, not what a bus thinks it sent):

    a kill, music never started ....... 0.479
    press PLAY, then STOP ............. MUS.MAST.gain = 0
    the same kill, after that ......... 0.000
    a footstep, after that ............ 0.000

Not quieter. GONE, and gone until the music is turned back on.

HOW IT HAPPENED, because it is a good lesson and nobody was careless:
Paolo complained on 7/27 that "i press the music button off and the music still
plays". He was right: clearing the scheduler only stops NEW notes being queued,
and anything already booked still sounds. The correct fix was to duck MUS.MAST
to zero on stop(), which silences what is already in flight. It works.
Separately, on 7/30, the SFX bus was built and plugged into MUS.MAST, because at
that moment MAST was simply "the output" - it was where the limiter lived.
Neither change was wrong on its own. Together they mean the music OFF button is
also a mute-everything button, and no gate noticed because every sound check in
this repo measures with the music never started.

THE FIX IS THE ROUTING, NOT A SPECIAL CASE. MAST goes back to meaning MUSIC and
nothing else, and a real output bus is created underneath it:

    MUS.MAST ---> MUS.MUSVOL ---\\
                                 +--> MUS.OUT --> compressor --> limiter --> out
    SFXBUS   -------------------/

  - MUS.start()/stop() keep ramping MAST exactly as they do now. That is the
    music, and only the music. His 7/27 fix is untouched and still correct.
  - the effects reach the limiter without passing through the music at all.
  - the compressor and brickwall limiter still sit at the very end, so the
    screech law's guarantee is unchanged: nothing gets past them.

=== 3. THE SOUNDBOARD (added 8/2, after he said it plainly) ==================

"bro wtf every sfx should be in the sfx in the music menu not for me to find in
the game"

He was right and the cause was mine. The SFX judge panel collapses every moment
he has FINISHED judging - `isOpen = !done` - because it was designed as a to-do
list that opens on the work that is left. That is correct for JUDGING. But he
judged all 100 candidates, so every card in the panel is now folded shut and
dimmed, and the panel stopped being a place where a sound can be HEARD. Then I
told him to go win a firefight to hear the block and eat food to hear the pickup.
Making him play the game to audition a sound effect is the opposite of the
verdict workflow this whole repo runs on.

So: a SOUNDBOARD, above the judge, always open, nothing to expand. One button per
game moment, and tapping it plays THE SOUND THE GAME ACTUALLY PLAYS -- through
window.playSFX, the same call the run and combat make, so what he hears is not a
preview of a candidate, it is the thing. The moments with no approved sound say
so on the button instead of being hidden, because a silent button he cannot
explain is worse than an honest one.

=== 2. THE VOLUME CONTROL, IN HIS OWN WORDS ==================================

Paolo, 8/2: "keep in mind at the end of the day like when we have a menu and
it's gonna have Settings and then we can change the volume of all sound effects
or whatever", and then, sharper: "I'm not too concerned right now about the
volume of fucking steps, bro. I just needed you to make sure you're coding that
properly into any sort of menu volume slider."

What existed was window.setSFXVolume(): the HOOK, with nothing to drive it and
no way for him to touch it. The three nodes above are exactly the three knobs a
game needs, so they become three sliders in the MUSIC tab.

  MASTER  -> MUS.OUT       everything, including the music
  MUSIC   -> MUS.MUSVOL    songs only
  EFFECTS -> SFXBUS        footsteps, combat, ambience, UI, the lot

PERCEPTUAL, NOT LINEAR, and this is the one piece of real craft in the UI.
Loudness is roughly logarithmic, so a slider wired straight to gain spends its
bottom two thirds doing almost nothing you can hear and then jumps. Every knob
here maps position p (0..1) to gain p^2.5, which is close to a decibel taper:
half way up is about 18% of full gain, which is what "half volume" actually
sounds like. 0 is exact silence, not a very small number.

THE SETTINGS ARE HIS, SO THEY PERSIST -- but the DEFAULTS live in code, never
only in localStorage, which is the same rule his verdicts live under. A cleared
phone falls back to a mix somebody chose on purpose.

NO NEW SOUND IS COOKED HERE and nothing needs judging. This is a control.

Idempotent: re-running replaces its own block rather than stacking, proved by
md5 over two runs.

  python3 tools/bohemia_sound_mix_patch.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

BEGIN = '<!-- BOHEMIA SOUND MIX (8/2/26) -->'
END = '<!-- /BOHEMIA SOUND MIX -->'

# the music engine's own output chain, verbatim as it stands today
OLD_CHAIN = ("   this.MAST.connect(cmp);cmp.connect(lim);lim.connect(this.AC.destination);}catch(e){} },")
NEW_CHAIN = (
    "   /* THE OUTPUT BUS (8/2). MAST used to connect straight to the compressor,\n"
    "      which made it BOTH the music master AND the only output, so the SFX bus\n"
    "      plugged into it and stop()'s duck-to-zero took the whole game with it.\n"
    "      MAST is the MUSIC now. MUSVOL is his music slider, OUT is his master\n"
    "      slider and the one thing everything meets at, and the compressor and\n"
    "      brickwall still sit at the very end so nothing gets past them. */\n"
    "   this.MUSVOL=this.AC.createGain(); this.MUSVOL.gain.value=1;\n"
    "   this.OUT=this.AC.createGain(); this.OUT.gain.value=1;\n"
    "   this.MAST.connect(this.MUSVOL); this.MUSVOL.connect(this.OUT);\n"
    "   this.OUT.connect(cmp);cmp.connect(lim);lim.connect(this.AC.destination);\n"
    "   try{ window.__MUSVOL=this.MUSVOL; window.__OUTBUS=this.OUT;\n"
    "        if(window.__applyMix) window.__applyMix(); }catch(_e){}\n"
    "   }catch(e){} },")

BLOCK = r"""
<script>
/* === THE SOUND MIX (8/2/26, SOUNDS lane) =================================
   Three knobs, and the routing that makes them mean anything. See
   tools/bohemia_sound_mix_patch.py for why the music OFF button used to mute
   the entire game. */
(function(){
 'use strict';
 if(window.__SOUND_MIX) return; window.__SOUND_MIX=true;

 /* DEFAULTS IN CODE, NOT ONLY IN A COOKIE. Same rule his verdicts live under:
    a cleared phone falls back to a mix somebody chose on purpose, never to
    whatever a fresh object happens to be. */
 var MIX_DEFAULTS={master:1, music:0.75, sfx:1};
 var MIX={master:MIX_DEFAULTS.master, music:MIX_DEFAULTS.music, sfx:MIX_DEFAULTS.sfx};
 try{ var d=JSON.parse(localStorage.getItem('bohemia_mix')||'null');
   if(d){ for(var k in MIX) if(typeof d[k]==='number') MIX[k]=Math.max(0,Math.min(1,d[k])); }
 }catch(e){}

 /* PERCEPTUAL TAPER. Loudness is roughly logarithmic, so a slider wired
    straight to gain wastes its bottom two thirds and then jumps. p^2.5 is
    close to a dB taper: the halfway point lands near 18% gain, which is what
    "half volume" actually sounds like. Zero is EXACT silence. */
 function taper(p){ p=Math.max(0,Math.min(1,+p||0)); return p<=0?0:Math.pow(p,2.5); }
 window.__mixTaper=taper;

 function save(){ try{ localStorage.setItem('bohemia_mix',JSON.stringify(MIX)); }catch(e){} }

 function apply(){
  try{ if(window.__OUTBUS) window.__OUTBUS.gain.value=taper(MIX.master); }catch(e){}
  try{ if(window.__MUSVOL) window.__MUSVOL.gain.value=taper(MIX.music); }catch(e){}
  /* EFFECTS goes through the existing setSFXVolume so there is still exactly
     ONE place that owns the SFX bus gain. Two owners is how a knob silently
     stops working. */
  try{ if(window.setSFXVolume) window.setSFXVolume(taper(MIX.sfx));
       else if(window.__SFXBUS) window.__SFXBUS.gain.value=taper(MIX.sfx); }catch(e){}
 }
 window.__applyMix=apply;
 window.getMix=function(){ return {master:MIX.master, music:MIX.music, sfx:MIX.sfx}; };
 window.setMasterVolume=function(v){ MIX.master=Math.max(0,Math.min(1,+v||0)); save(); apply(); return MIX.master; };
 window.setMusicVolume =function(v){ MIX.music =Math.max(0,Math.min(1,+v||0)); save(); apply(); return MIX.music; };
 window.setEffectsVolume=function(v){ MIX.sfx  =Math.max(0,Math.min(1,+v||0)); save(); apply(); return MIX.sfx; };
 /* THE RE-APPLY TICK ONLY FIRES WHEN THE NODES ARE NEW, and that distinction
    cost a gate failure the first time this shipped. The audio context can be
    built long after this code runs and it can be REBUILT, so the knobs cannot
    be a one-shot at boot -- but a blind setInterval(apply) makes this the
    SECOND owner of the SFX gain, and it stomped every direct setSFXVolume()
    call about a second later. That is the exact defect the comment above warns
    about, written by the same hand, one function apart.
    So: remember the node identities we last wrote to, and only write again when
    they actually change. Re-applies after a context rebuild, never fights
    anybody in steady state. */
 var seen={out:null, mus:null, sfx:null};
 function applyIfNew(){
  var o=window.__OUTBUS||null, m=window.__MUSVOL||null, x=window.__SFXBUS||null;
  if(o===seen.out && m===seen.mus && x===seen.sfx) return;
  seen.out=o; seen.mus=m; seen.sfx=x;
  apply();
 }
 setInterval(applyIfNew, 1200);
 apply(); applyIfNew();

 /* ---- THE PANEL (MUSIC tab, above everything else) --------------------- */
 var CSS='#mixWrap{margin:0 0 10px 0;padding:10px 12px;border:1px solid #3a3350;'
  +'border-radius:10px;background:linear-gradient(180deg,#160f22,#0d0913)}'
  +'#mixWrap h4{margin:0 0 8px 0;font:800 10.5px ui-monospace,monospace;letter-spacing:2px;'
  +'color:#c9b6ea;text-transform:uppercase}'
  +'.mixRow{display:flex;align-items:center;gap:10px;margin:9px 0}'
  +'.mixRow label{flex:0 0 74px;font:700 10px ui-monospace,monospace;letter-spacing:1px;color:#9d90b8}'
  +'.mixRow input[type=range]{flex:1 1 auto;height:34px;accent-color:#8f6fd0;background:transparent}'
  +'.mixVal{flex:0 0 42px;text-align:right;font:700 11px ui-monospace,monospace;color:#e6dcff}'
  +'.mixNote{margin-top:6px;font:400 9.5px ui-monospace,monospace;color:#6d6386;line-height:1.45}'
  +'#sbWrap{margin:0 0 10px 0;padding:10px 12px;border:1px solid #3a3350;border-radius:10px;'
  +'background:linear-gradient(180deg,#141020,#0b0810)}'
  +'#sbWrap h4{margin:0 0 4px 0;font:800 10.5px ui-monospace,monospace;letter-spacing:2px;'
  +'color:#c9b6ea;text-transform:uppercase}'
  +'.sbGroup{margin:9px 0 0 0}'
  +'.sbGL{font:700 9px ui-monospace,monospace;letter-spacing:2px;color:#6d6386;margin:0 0 5px 2px}'
  +'.sbRow{display:flex;flex-wrap:wrap;gap:6px}'
  +'.sbBtn{flex:1 1 46%;min-height:46px;padding:6px 8px;border:1px solid #463d63;border-radius:8px;'
  +'background:#1d1730;color:#e6dcff;text-align:left;display:flex;flex-direction:column;'
  +'justify-content:center;gap:2px;cursor:pointer}'
  +'.sbBtn .sbName{font:700 10px ui-monospace,monospace;letter-spacing:.6px;line-height:1.2}'
  +'.sbBtn .sbN{font:400 8.5px ui-monospace,monospace;color:#8d81ab;letter-spacing:.5px}'
  +'.sbBtn.sbHot{background:#3a2c66;border-color:#8f6fd0}'
  +'.sbBtn.sbDead{opacity:.45}'
  +'.sbBtn.sbNew{border-color:#8f6fd0;background:#241a3d}'
  +'.sbBtn.sbNew .sbN{color:#c2a6f5}';
 try{ var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st); }catch(e){}

 function row(key,label,onDone){
  var r=document.createElement('div'); r.className='mixRow';
  var l=document.createElement('label'); l.textContent=label;
  var i=document.createElement('input'); i.type='range'; i.min='0'; i.max='100'; i.step='1';
  i.value=String(Math.round(MIX[key]*100)); i.id='mix_'+key;
  var v=document.createElement('span'); v.className='mixVal'; v.textContent=i.value+'%';
  i.addEventListener('input',function(){
    MIX[key]=(+i.value)/100; v.textContent=i.value+'%'; apply();
  });
  /* SAVE ON RELEASE, not on every pixel of the drag: a slider fires input on
     each step and writing localStorage 100 times per swipe is a stutter he
     would feel on a phone. */
  ['change','pointerup','touchend'].forEach(function(t){
    i.addEventListener(t,function(){ save(); if(onDone)onDone(); });
  });
  r.appendChild(l); r.appendChild(i); r.appendChild(v);
  return r;
 }

 /* ---- THE SOUNDBOARD ---------------------------------------------------
    Paolo 8/2: "every sfx should be in the sfx in the music menu not for me to
    find in the game". Every game moment, one button, always visible, and the
    tap plays what the GAME plays -- window.playSFX is the same entry point the
    run and combat use, so this is the sound and not a preview of one. */
 var BOARD=[
  ['WALKING',  ['step_asphalt','step_dirt','step_gravel']],
  ['THE FIGHT',['shot','hit','vital','block','hurt','kill','clear','miss']],
  ['THE WORLD',['air_day','air_night','air_inside','go_inside','door_open','door_shut']],
  ['A DAY',    ['eat','sleep','time_pass','talk_start','quest_done']],
  ['YOU',      ['pickup','phone_buzz','save_chime','ui_tap']]
 ];
 function labelOf(ev){
  try{ var E=BOH_SFX.EVENTS; for(var i=0;i<E.length;i++) if(E[i].ev===ev) return E[i].label; }catch(e){}
  return ev;
 }
 function approvedCount(ev){
  try{ return (window.__SFX_APPROVED && window.__SFX_APPROVED[ev] || []).length; }catch(e){ return 0; }
 }
 /* THREE STATES, AND THE THIRD ONE IS THE GRAVEYARD.
      LIVE  he approved at least one  -> play the GAME's sound
      NEW   cooked, not fully judged  -> audition the candidates in turn
      DEAD  every candidate thumbed and none survived -> PLAY NOTHING
    That last one is not styling. He judged all ten door candidates DOWN, and
    GRAVEYARD IS FINAL: a board that auditions them is putting dead art back in
    front of him. Dead buttons say so and stay silent. */
 function stateOf(ev){
  if(approvedCount(ev)>0) return 'live';
  var cookable=0; try{ cookable=BOH_SFX.cook(ev,5).length; }catch(e){}
  if(!cookable) return 'dead';
  try{ if(window.BOH_SFX_JUDGE && window.BOH_SFX_JUDGE.done(ev)) return 'dead'; }catch(e){}
  return 'new';
 }
 function boardBlock(){
  var b=document.createElement('div'); b.id='sbWrap';
  var h=document.createElement('h4'); h.textContent='EVERY SOUND IN THE GAME';
  b.appendChild(h);
  var sub=document.createElement('div'); sub.className='mixNote';
  sub.style.marginTop='0'; sub.style.marginBottom='8px';
  sub.textContent='Tap one and you hear exactly what the game plays. Nothing here '
   +'needs judging and nothing needs finding in a run.';
  b.appendChild(sub);
  /* ANY MOMENT NO GROUP LISTS STILL GETS A BUTTON. His complaint was that a
     sound existed and he could not reach it; a hand-written group list is
     exactly how that happens again the next time somebody cooks a batch and
     forgets this file. The leftovers group is the backstop, not the plan. */
  try{
   var listed={}; BOARD.forEach(function(g){ g[1].forEach(function(e){ listed[e]=1; }); });
   var extra=BOH_SFX.EVENTS.map(function(E){ return E.ev; }).filter(function(e){ return !listed[e]; });
   if(extra.length) BOARD.push(['ALSO IN THE GAME', extra]);
  }catch(e){}
  BOARD.forEach(function(grp){
   var g=document.createElement('div'); g.className='sbGroup';
   var gl=document.createElement('div'); gl.className='sbGL'; gl.textContent=grp[0];
   g.appendChild(gl);
   var row=document.createElement('div'); row.className='sbRow';
   grp[1].forEach(function(ev){
    var n=approvedCount(ev), st=stateOf(ev);
    var btn=document.createElement('button');
    btn.className='sbBtn'+(st==='dead'?' sbDead':'')+(st==='new'?' sbNew':'');
    btn.id='sb_'+ev;
    btn.setAttribute('data-ev',ev);
    btn.innerHTML='<span class="sbName">'+labelOf(ev)+'</span>'
      +'<span class="sbN">'
      +(st==='live' ? n+(n===1?' sound':' sounds')
        : st==='new' ? 'NEW - tap to hear all 5'
        : 'nothing survived judging')+'</span>';
    var turn=0;
    btn.addEventListener('click',function(){
     var st2=stateOf(ev);
     if(st2==='dead') return;   /* GRAVEYARD IS FINAL: nothing to play, on purpose */
     if(st2==='live'){
      /* THE GAME'S OWN CALL for a moment he has already ruled. Not a private
         preview path -- a side door would let the board sound healthy while the
         game is silent, which is a lie this lane has shipped once already. */
      try{ if(window.playSFX) window.playSFX(ev); }catch(e){}
     }else{
      /* AND A MOMENT HE HAS NOT RULED YET MUST AUDITION ITS CANDIDATES.
         playSFX falls back to step_dirt for an unbanked event, which is correct
         inside the GAME (better a footstep than a hole) and a disaster on a
         board: tapping EAT played a footstep, so a freshly cooked batch sounded
         like nothing new at all. That is literally the complaint that started
         this - "Theres no new sounds". Each tap plays the NEXT candidate, so
         five taps is the whole set and the button says which one. */
      try{
       var c=BOH_SFX.cook(ev,5), v=c[turn%c.length]; turn++;
       if(window.BOH_SFX_JUDGE) window.BOH_SFX_JUDGE.hear(v);
       else BOH_SFX.render(v, MUS.AC, (window.__SFXBUS||MUS.OUT||MUS.MAST));
       var n=btn.querySelector('.sbN');
       if(n) n.textContent='candidate '+(((turn-1)%c.length)+1)+' of '+c.length+' - not judged';
      }catch(e){}
     }
     btn.classList.add('sbHot'); setTimeout(function(){ btn.classList.remove('sbHot'); },220);
    });
    row.appendChild(btn);
   });
   g.appendChild(row); b.appendChild(g);
  });
  return b;
 }

 function build(){
  var w=document.createElement('div'); w.id='mixWrap';
  var h=document.createElement('h4'); h.textContent='SOUND';
  w.appendChild(h);
  w.appendChild(row('master','MASTER'));
  w.appendChild(row('music','MUSIC'));
  /* letting go of the EFFECTS slider plays one of his approved taps, so the
     level he just chose is a thing he HEARS instead of a number he reads */
  w.appendChild(row('sfx','EFFECTS',function(){
    try{ if(window.playSFX) window.playSFX('ui_tap'); }catch(e){}
  }));
  var n=document.createElement('div'); n.className='mixNote';
  n.textContent='These are the game’s volumes, not the studio’s. They persist on this '
   +'phone and they reach everything: songs, footsteps, combat, ambience, taps.';
  w.appendChild(n);
  return w;
 }

 /* The studio rebuilds #p-music from scratch whenever a song is tagged, so a
    one-shot mount would quietly disappear the first time he uses the CAT
    button. Same pattern the SFX judge already uses: wrap build, plus a slow
    re-adopt as the backstop. */
 function mount(){
  var P=document.getElementById('p-music'); if(!P) return;
  if(document.getElementById('mixWrap') && document.getElementById('sbWrap')) return;
  if(document.getElementById('mixWrap')){
   if(!document.getElementById('sbWrap')){
    var mw=document.getElementById('mixWrap');
    P.insertBefore(boardBlock(), mw.nextSibling);
   }
   return;
  }
  P.insertBefore(build(), P.firstChild);
  if(!document.getElementById('sbWrap')){
   var m=document.getElementById('mixWrap');
   P.insertBefore(boardBlock(), m ? m.nextSibling : P.firstChild);
  }
 }
 function hook(){
  if(typeof MUS==='undefined'||!MUS.build) return false;
  if(MUS._mixHooked) return true;
  MUS._mixHooked=true;
  var prev=MUS.build.bind(MUS);
  MUS.build=function(){ prev(); try{ mount(); }catch(e){} };
  setInterval(function(){ var P=document.getElementById('p-music');
    if(P&&P.children.length&&(!document.getElementById('mixWrap')||!document.getElementById('sbWrap'))){
      try{ mount(); }catch(e){} } },1500);
  if(MUS.built){ try{ mount(); }catch(e){} }
  return true;
 }
 if(!hook()){ var tries=0, iv=setInterval(function(){ if(hook()||++tries>40)clearInterval(iv); },250); }
})();
</script>
"""


def main():
    s = open(ALPHA, encoding='utf8').read()

    # ---- 1. the routing ---------------------------------------------------
    if 'this.MUSVOL=this.AC.createGain()' not in s:
        if OLD_CHAIN not in s:
            print('FAIL: the music output chain is not the shape this tool expects')
            return 1
        s = s.replace(OLD_CHAIN, NEW_CHAIN, 1)
        print('  MAST is the MUSIC again; MUSVOL + OUT created under it')
    else:
        print('  routing already in place')

    # ---- 2. the SFX bus stops riding the music master ---------------------
    # It plugged into MUS.MAST when MAST was the only output. Now there is a
    # real output bus, and the whole point of this patch is that the effects
    # must not pass through anything the music button can duck.
    old_conn = 'SFXBUS.connect(MUS.MAST||MUS.AC.destination);'
    new_conn = ('SFXBUS.connect(MUS.OUT||MUS.MAST||MUS.AC.destination);'
                '  /* 8/2: the OUTPUT bus, never the music master -- MUS.stop() '
                'ducks MAST to zero and that used to mute the whole game */')
    if old_conn in s:
        s = s.replace(old_conn, new_conn, 1)
        print('  SFX bus moved off the music master')
    elif new_conn.split('  /*')[0] not in s:
        print('FAIL: cannot find the SFX bus connection to move')
        return 1

    # the run-side footstep sub-bus and the playSFX fallback both name MAST as
    # their last resort; give them the output bus first for the same reason.
    # EVERY destination that falls back to the MUSIC master, in both the
    # statement form (`... || AC.destination;`) and the ARGUMENT form
    # (`render(v, AC, X || MUS.MAST || AC.destination, when)`). The argument form
    # is the one the first pass missed, and the rule check in sfx_wired_gate
    # found it a day later sitting in the other lane's footstep player. A rule
    # that only knows one syntax is not a rule.
    for a, b in (
        ("STEP_BUS.connect((window.__SFXBUS) || MUS.MAST || AC.destination);",
         "STEP_BUS.connect((window.__SFXBUS) || MUS.OUT || MUS.MAST || AC.destination);"),
        ("|| MUS.MAST || AC.destination;",
         "|| MUS.OUT || MUS.MAST || AC.destination;"),
        ("STEP_BUS || MUS.MAST || AC.destination",
         "STEP_BUS || MUS.OUT || MUS.MAST || AC.destination"),
        ("sfxBus()||MUS.MAST||MUS.AC.destination",
         "sfxBus()||MUS.OUT||MUS.MAST||MUS.AC.destination"),
    ):
        if a in s and b not in s:
            s = s.replace(a, b)

    # ---- 3. the panel -----------------------------------------------------
    if BEGIN in s:
        i = s.index(BEGIN)
        j = s.index(END) + len(END)
        if s[j:j + 1] == '\n':
            j += 1
        s = s[:i] + s[j:]
        print('  panel removed (idempotent re-inject)')
    anchor = '<!-- BOHEMIA SFX FACTORY MOUNT (7/29/26) -->'
    if anchor not in s:
        print('FAIL: cannot find the SFX factory mount to sit next to')
        return 1
    s = s.replace(anchor, BEGIN + BLOCK + END + '\n' + anchor, 1)

    open(ALPHA, 'w', encoding='utf8').write(s)
    print('THE MIX IS REAL AND IT HAS KNOBS.')
    print('  MASTER / MUSIC / EFFECTS in the MUSIC tab, perceptual taper, persisted')
    print('  and the music OFF button no longer silences the sound effects')
    return 0


if __name__ == '__main__':
    sys.exit(main())
