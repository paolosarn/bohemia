#!/usr/bin/env python3
"""
BOHEMIA SFX FACTORY — the machine, and the judge surface, into the ONE alpha
(7/29/26, the SOUNDS lane's first ship).

SOUND EFFECTS ARE HIS ONLY 0%. Paolo's own progress ledger, 7/28: combat 40,
rig 59, music 30, clothing 25, world 15, animations 15, quests 10, NPCs 5,
items 5, SOUND EFFECTS 0. On 7/29 he ordered a dedicated sounds chat and this
is item 0 of its backlog.

WHAT THIS TOOL DOES
  1. inlines engine/bohemia_sfx.js (BOH_SFX) into the alpha, byte for byte, so
     the ENGINE SYNC LAW has one canonical body and the sync gate can prove it
  2. builds the JUDGE SURFACE at the top of the MUSIC TAB: 12 game moments x 5
     candidates = 60 sounds, tap to hear, thumb up or down, a note per sound, a
     comment box at the bottom, SUN MODE, and an export that lands as .txt

WHY THE MUSIC TAB AND NOT A NEW PAGE. ONE-LINK LAW: there is one alpha and one
URL. Audio already lives in the MUSIC tab, and so does the only AudioContext in
the build — putting the sounds anywhere else would mean a second audio engine,
which the SOUNDS lane intent bans outright, and a page Paolo has to be told how
to find. He taps MUSIC, the sounds are the first thing on the screen.

REUSE CHECK (REUSE-FIRST LAW, Paolo 7/22): this tool cooks ZERO graphic pixels
— it draws nothing, so no banks/ art lookup applies to it. What it DOES reuse
is audio machinery that already exists and is already approved-in-use: the
MUSIC studio's AudioContext, its master gain and its brickwall limiter chain
(MUS.audio(), MUS.AC, MUS.MAST inside the alpha). It creates no context, no
master bus and no limiter of its own. It also reuses the studio's export modal
(expText / expShare / G._expName) rather than building a second exporter, so a
sound verdict shares the file, the .txt law and the share sheet with a music
verdict.

MECHANISM-MINE / CONTENTS-PAOLO'S: the synth and the 60 candidates ship. WHICH
sound each game event makes is his verdict — BOH_SFX.BANK is empty and play()
on an unbanked event is silent on purpose.

Idempotent (marker BOHEMIA SFX FACTORY MOUNT). Re-running replaces the injected
blocks with the current engine + UI instead of stacking a second copy.

  python3 tools/bohemia_sfx_factory.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
ENGINE = 'engine/bohemia_sfx.js'

BEGIN = '<!-- BOHEMIA SFX FACTORY MOUNT (7/29/26) -->'
END = '<!-- /BOHEMIA SFX FACTORY MOUNT -->'

# --------------------------------------------------------------------------
# THE JUDGE SURFACE. Plain DOM, built at the top of #p-music, re-mounted after
# MUS.rebuild() because the studio rebuilds its whole panel when a category
# changes and anything that claimed that spot once would silently vanish.
# --------------------------------------------------------------------------
UI = r"""
/* =========================================================================
   THE SFX JUDGE — MUSIC TAB (Paolo 7/29, the SOUNDS lane)
   60 candidates for 12 game moments. Tap it, hear it, thumb it. Nothing here
   decides what a footstep sounds like; it decides what he gets to choose from.
   ========================================================================= */
(function(){
 'use strict';
 if(typeof BOH_SFX==='undefined')return;
 var N_CAND=5;

 var SJ={
  V:{}, C:{}, note:'', sun:false, built:null, cache:{},
  load:function(){ try{var d=JSON.parse(localStorage.getItem('bohemia_sfx')||'null');
    if(d){this.V=d.V||{};this.C=d.C||{};this.note=d.note||'';this.sun=!!d.sun;} }catch(e){} },
  save:function(){ try{localStorage.setItem('bohemia_sfx',JSON.stringify(
    {V:this.V,C:this.C,note:this.note,sun:this.sun}));}catch(e){} },
  cand:function(ev){ if(!this.cache[ev])this.cache[ev]=BOH_SFX.cook(ev,N_CAND); return this.cache[ev]; },
  judged:function(){ var n=0; for(var k in this.V) if(this.V[k]) n++; return n; },

  /* ONE AUDIOCONTEXT, THE PARENT'S: the studio's, with its brickwall limiter
     already in the chain. This never makes a context. */
  ac:function(){ try{ MUS.audio(); }catch(e){} return (typeof MUS!=='undefined')?MUS.AC:null; },
  bus:function(){ return (typeof MUS!=='undefined')?(MUS.MAST||MUS.AC.destination):null; },
  hear:function(v,when){ var AC=this.ac(); if(!AC)return null;
    try{ return BOH_SFX.render(v,AC,this.bus(),when); }catch(e){ return null; } },
  /* PLAY ALL 5 lands them a beat apart, on the grid, because that is how the
     game will actually fire them and a sound judged out of tempo is a lie */
  hearRow:function(ev){ var AC=this.ac(); if(!AC)return; var t=AC.currentTime+0.08, c=this.cand(ev);
    for(var i=0;i<c.length;i++) this.hear(c[i], t+i*BOH_SFX.BEAT*2); },

  exportTxt:function(){
   var L=['=== BOHEMIA SFX VERDICTS ==='];
   L.push('BATCH SFX-01 (7/29/26) - '+BOH_SFX.EVENTS.length+' game moments x '+N_CAND+' candidates');
   L.push('JUDGED: '+this.judged()+'/'+(BOH_SFX.EVENTS.length*N_CAND));
   L.push('UP = this IS the sound. DOWN = dead. blank = never judged.');
   L.push('');
   for(var i=0;i<BOH_SFX.EVENTS.length;i++){
    var E=BOH_SFX.EVENTS[i], c=this.cand(E.ev);
    L.push('['+E.label+']  '+E.ev+'   ('+E.why+')');
    for(var j=0;j<c.length;j++){
     var v=c[j], k=v.id, m=this.V[k]===1?'UP  ':(this.V[k]===-1?'DOWN':'--  ');
     var note=this.C[k]?('   "'+this.C[k]+'"'):'';
     L.push('  '+m+' '+k+note);
     if(this.V[k]===1) L.push('       VECTOR '+BOH_SFX.serialize(v));
    }
    L.push('');
   }
   L.push('NOTE: '+(this.note||'(none)'));
   var t=L.join('\n');
   /* COMMENTS CLEAR ON EXPORT (Paolo 7/19): the moment they ride an export they
      are delivered. The repo is the memory, not the box. */
   this.note=''; var nb=document.getElementById('sfxNote'); if(nb)nb.value=''; this.save();
   try{ G._expName='bohemia_sfx.txt'; }catch(e){}
   document.getElementById('expText').value=t;
   document.getElementById('expStat').textContent='SFX EXPORT: SHARE FILE into the chat';
   document.getElementById('exportModal').style.display='block';
  }
 };

 function el(tag,css,html){ var e=document.createElement(tag); if(css)e.style.cssText=css; if(html!=null)e.innerHTML=html; return e; }

 function mount(){
  var P=document.getElementById('p-music'); if(!P)return;
  if(document.getElementById('sfxWrap'))return;      /* idempotent */
  SJ.load();

  var css=document.createElement('style'); css.id='sfxCss';
  css.textContent=
   '#sfxWrap{border:1px solid #3a2a1e;border-radius:8px;padding:10px 8px;margin:0 0 14px 0;'
   +'background:linear-gradient(180deg,#120c08,#080506)}'
   +'#sfxWrap .sfxCard{border:1px solid #2a2018;border-radius:6px;padding:7px 7px 4px 7px;margin:7px 0;background:#0b0807}'
   +'#sfxWrap .sfxRow{display:flex;gap:5px;align-items:center;margin:4px 0}'
   +'#sfxWrap button{background:#14100b;border:1px solid #3a2e20;border-radius:5px;color:#cfc3a8;'
   +'font:11px ui-monospace,monospace;padding:7px 9px;letter-spacing:1px}'
   +'#sfxWrap .sfxPlay{min-width:64px;border-color:#c87a1e;color:#e8b478}'
   +'#sfxWrap .sfxUp.on{border-color:#3ad07a;color:#7ae8a0;background:#0d1a10}'
   +'#sfxWrap .sfxDn.on{border-color:#d04a4a;color:#e88a8a;background:#1a0d0d}'
   +'#sfxWrap input.sfxN{flex:1;min-width:40px;background:#0a0806;border:1px solid #2a2018;border-radius:4px;'
   +'color:#cfc3a8;font:11px ui-monospace,monospace;padding:6px 7px}'
   +'#sfxWrap textarea{width:100%;height:70px;background:#0a0806;border:1px solid #2a2018;border-radius:5px;'
   +'color:#cfc3a8;font:12px ui-monospace,monospace;padding:7px}'
   +'#sfxWrap .sfxWhy{font:10px ui-monospace,monospace;color:#7a6a4e;letter-spacing:.5px}'
   +'#sfxWrap .sfxLbl{font:12px ui-monospace,monospace;color:#e8c9a0;letter-spacing:2px}'
   /* SUN MODE: daylight-readable, because he judges outside on a phone */
   +'#sfxWrap.sun{background:#e2ddd0;border-color:#b8ad95}'
   +'#sfxWrap.sun .sfxCard{background:#f2eee3;border-color:#c4b9a1}'
   +'#sfxWrap.sun .sfxLbl{color:#3a2a10}#sfxWrap.sun .sfxWhy{color:#5a4a2a}'
   +'#sfxWrap.sun button{background:#efe9dc;color:#241d12;border-color:#b8ad95}'
   +'#sfxWrap.sun input.sfxN,#sfxWrap.sun textarea{background:#fbf8f0;color:#241d12;border-color:#c4b9a1}'
   +'#sfxWrap.sun .sfxHdr{color:#3a2a10}';
  var W=el('div'); W.id='sfxWrap';
  W.appendChild(css);

  W.appendChild(el('div','text-align:center;letter-spacing:4px;color:#e8b478;font-size:14px;'
   +'text-shadow:0 0 12px rgba(200,120,30,0.6)','<b class="sfxHdr">&#9762; S O U N D&nbsp; E F F E C T S &#9762;</b>'));
  W.appendChild(el('div','text-align:center;font:10px ui-monospace,monospace;color:#7a6a4e;'
   +'letter-spacing:1px;margin:3px 0 8px 0',
   '12 moments in the game &middot; '+N_CAND+' candidates each &middot; tap to hear it, thumb the one that should BE the sound'));

  var bar=el('div','display:flex;gap:6px;justify-content:center;align-items:center;flex-wrap:wrap;margin-bottom:6px');
  var sun=el('button',null,'SUN'); sun.addEventListener('click',function(){
    W.classList.toggle('sun'); SJ.sun=W.classList.contains('sun'); SJ.save(); });
  if(SJ.sun)W.classList.add('sun');
  var ex=el('button','border-color:#6f6;color:#8fe89a','<b>EXPORT SFX (to Claude)</b>');
  ex.addEventListener('click',function(){ SJ.exportTxt(); });
  var cnt=el('span','font:10px ui-monospace,monospace;color:#8a7a5a;letter-spacing:1px'); cnt.id='sfxCount';
  bar.appendChild(sun); bar.appendChild(ex); bar.appendChild(cnt);
  W.appendChild(bar);

  function refresh(){ var c=document.getElementById('sfxCount');
    if(c)c.textContent=SJ.judged()+' / '+(BOH_SFX.EVENTS.length*N_CAND)+' JUDGED'; }

  BOH_SFX.EVENTS.forEach(function(E){
   var card=el('div'); card.className='sfxCard';
   var hd=el('div','display:flex;gap:6px;align-items:center;justify-content:space-between');
   hd.appendChild(el('div',null,'<span class="sfxLbl">'+E.label+'</span>'
     +'<div class="sfxWhy">'+E.why+'</div>'));
   var all=el('button','border-color:#8a6ad0;color:#c0a8f0','PLAY '+N_CAND);
   all.addEventListener('click',function(){ SJ.hearRow(E.ev); });
   hd.appendChild(all); card.appendChild(hd);

   SJ.cand(E.ev).forEach(function(v,i){
    var row=el('div'); row.className='sfxRow';
    var pl=el('button',null,'&#9654; '+(i+1)); pl.className='sfxPlay';
    pl.addEventListener('click',function(){ SJ.hear(v); });
    var up=el('button',null,'&#128077;'); up.className='sfxUp'+(SJ.V[v.id]===1?' on':'');
    var dn=el('button',null,'&#128078;'); dn.className='sfxDn'+(SJ.V[v.id]===-1?' on':'');
    up.addEventListener('click',function(){ SJ.V[v.id]=(SJ.V[v.id]===1)?0:1; SJ.save();
      up.className='sfxUp'+(SJ.V[v.id]===1?' on':''); dn.className='sfxDn'+(SJ.V[v.id]===-1?' on':''); refresh(); });
    dn.addEventListener('click',function(){ SJ.V[v.id]=(SJ.V[v.id]===-1)?0:-1; SJ.save();
      up.className='sfxUp'+(SJ.V[v.id]===1?' on':''); dn.className='sfxDn'+(SJ.V[v.id]===-1?' on':''); refresh(); });
    /* PER-ITEM COMMENT (verdict workflow): the note about THIS sound rides with
       this sound into the export, not into a paragraph at the bottom */
    var nt=document.createElement('input'); nt.className='sfxN'; nt.type='text';
    nt.placeholder='note'; nt.value=SJ.C[v.id]||'';
    nt.addEventListener('input',function(){ SJ.C[v.id]=nt.value; SJ.save(); });
    row.appendChild(pl); row.appendChild(up); row.appendChild(dn); row.appendChild(nt);
    card.appendChild(row);
   });
   W.appendChild(card);
  });

  /* THE COMMENT SECTION AT THE BOTTOM, ALWAYS (verdict workflow law) */
  W.appendChild(el('div','font:10px ui-monospace,monospace;color:#7a6a4e;letter-spacing:1px;margin:10px 0 4px 0',
    'ANYTHING ELSE ABOUT THE SOUNDS (rides the export):'));
  var ta=document.createElement('textarea'); ta.id='sfxNote'; ta.value=SJ.note;
  ta.addEventListener('input',function(){ SJ.note=ta.value; SJ.save(); });
  W.appendChild(ta);

  P.insertBefore(W,P.firstChild);
  refresh();
 }

 /* The studio rebuilds its whole panel on a category change (MUS.rebuild ->
    build), so claiming the top of #p-music once would quietly stop working the
    first time he tags a song. Wrap build, and keep a slow re-adopt as the
    backstop for any other system that ever clears that panel. */
 function hook(){
  if(typeof MUS==='undefined'||!MUS.build)return false;
  if(MUS._sfxHooked)return true;
  MUS._sfxHooked=true;
  var prev=MUS.build.bind(MUS);
  MUS.build=function(){ prev(); try{ mount(); }catch(e){} };
  setInterval(function(){ var P=document.getElementById('p-music');
    if(P&&P.children.length&&!document.getElementById('sfxWrap')){ try{ mount(); }catch(e){} } },1500);
  if(MUS.built){ try{ mount(); }catch(e){} }
  return true;
 }
 if(!hook()){ var tries=0, iv=setInterval(function(){ if(hook()||++tries>40)clearInterval(iv); },250); }
 window.BOH_SFX_JUDGE=SJ;
})();
"""


def main():
    if not os.path.exists(ALPHA):
        print('FAIL: the ONE alpha is missing: %s' % ALPHA)
        return 1
    if not os.path.exists(ENGINE):
        print('FAIL: the engine body is missing: %s' % ENGINE)
        return 1

    alpha = open(ALPHA, encoding='utf8').read()
    engine = open(ENGINE, encoding='utf8').read()

    # idempotent: rip any previous mount out whole, then re-inject the current one
    if BEGIN in alpha:
        i = alpha.index(BEGIN)
        j = alpha.index(END) + len(END)
        alpha = alpha[:i] + alpha[j:]
        print('previous mount removed (idempotent re-inject)')

    block = (BEGIN
             + '\n<script>\n/* ENGINE SYNC LAW: this body is engine/bohemia_sfx.js, inlined verbatim.\n'
             + '   Edit the engine file, re-run tools/bohemia_sfx_factory.py. Never edit here. */\n'
             + engine
             + '</script>\n<script>' + UI + '</script>\n'
             + END + '\n')

    anchor = '<div id="exportModal"'
    if anchor not in alpha:
        print('FAIL: cannot find the export modal anchor in the alpha')
        return 1
    k = alpha.index(anchor)
    alpha = alpha[:k] + block + alpha[k:]

    open(ALPHA, 'w', encoding='utf8').write(alpha)

    # a straight count of what he is being handed
    n_ev = len(re.findall(r"\{ ev: '", engine))
    print('SFX FACTORY MOUNTED in the MUSIC tab of the ONE alpha.')
    print('  engine: %s (%d bytes, inlined verbatim)' % (ENGINE, len(engine)))
    print('  batch:  %d game moments x 5 candidates = %d sounds' % (n_ev, n_ev * 5))
    print('  bank:   EMPTY (mechanism-mine: which sound each event makes is his verdict)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
