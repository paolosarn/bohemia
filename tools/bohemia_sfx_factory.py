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

REUSE CHECK: nothing fit, and nothing needed to — this tool cooks ZERO graphic
pixels. It draws no art, so no banks/ art bank applies to it and none was used.
What it DOES reuse is audio machinery that already exists and is already
approved-in-use inside the alpha: the MUSIC studio's AudioContext, its master
gain and its brickwall limiter chain (MUS.audio(), MUS.AC, MUS.MAST). It creates
no context, no master bus and no limiter of its own. It also reuses the studio's
export modal (expText / expShare / G._expName) rather than building a second
exporter, so a sound verdict shares the file, the .txt law and the share sheet
with a music verdict. The one bank this tool touches is the SFX vector bank it
opens below, and that bank is deliberately empty until Paolo rules.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md, section 4 MUSIC — the only
section with rulings that bind audio):
  - NEVER feedback loops, createDelay or createConvolver; anything that rings is
    excited-and-decaying. HELD: the synth has none of the three, every voice
    decays to actual zero, and gates/sfx_render_gate.py proves it on the
    waveform (silent 60 ms past its own length) rather than by grepping.
  - NEVER reuse the same synthesis skeleton batch to batch. HELD BY SHAPE: the
    twelve recipes are twelve different topologies (noise beds, metal partials,
    crushed saws, tremolo'd squares), and no two events share one.
  - NEVER let two candidates in one batch differ trivially. HELD: gain jitter
    was removed from the two recipes that had it — five volumes of one sound is
    not a choice, so the five differ in attack, brightness, pitch fall and grit.
  - LIKE melody/character leading, never drone-flat texture. APPLIED as the
    audio equivalent: every candidate has a shaped envelope and a pitch or
    filter move, none is a flat burst.
  - The canon has no ruling on what a footstep should SOUND like, and this tool
    does not invent one. That is the verdict this batch exists to collect.

MECHANISM-MINE / CONTENTS-PAOLO'S: the synth and the 60 candidates ship. WHICH
sound each game event makes is his verdict — BOH_SFX.BANK is empty and play()
on an unbanked event is silent on purpose.

Idempotent (marker BOHEMIA SFX FACTORY MOUNT). Re-running replaces the injected
blocks with the current engine + UI instead of stacking a second copy.

  python3 tools/bohemia_sfx_factory.py
"""
import json
import glob
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
  V:{}, C:{}, note:'', sun:false, built:null, cache:{}, open:{}, onlyNew:false,
  /* HIS VERDICTS ARE A REPO FILE, NOT A COOKIE (Paolo 8/1: "I can't be judging
     shit and then you pretend that I didn't"). They used to live ONLY in this
     phone's localStorage, so a new deploy, a cleared cache or a second device
     wiped 60 judged sounds and the surface asked him all over again. SETTLED
     below is baked in at build time from every records/BOHEMIA_SFX_VERDICT_*.txt
     in the repo -- his actual thumbs, committed. localStorage now only holds
     CHANGES on top of that, so the worst a wiped phone can do is fall back to
     what he already decided. */
  load:function(){
    var k; for(k in SETTLED) this.V[k]=SETTLED[k];
    try{var d=JSON.parse(localStorage.getItem('bohemia_sfx')||'null');
      if(d){ if(d.V) for(k in d.V) this.V[k]=d.V[k];    /* he may change his mind */
             this.C=d.C||{};this.note=d.note||'';this.sun=!!d.sun;
             this.open=d.open||{}; this.onlyNew=!!d.onlyNew; } }catch(e){} },
  save:function(){ try{localStorage.setItem('bohemia_sfx',JSON.stringify(
    {V:this.V,C:this.C,note:this.note,sun:this.sun,open:this.open,onlyNew:this.onlyNew}));}catch(e){} },
  cand:function(ev){ if(!this.cache[ev])this.cache[ev]=BOH_SFX.cook(ev,N_CAND); return this.cache[ev]; },
  judged:function(){ var n=0; for(var k in this.V) if(this.V[k]) n++; return n; },
  /* a moment is DONE when every one of its candidates has a thumb either way */
  done:function(ev){ var c=this.cand(ev), i;
    for(i=0;i<c.length;i++) if(!this.V[c[i].id]) return false; return true; },
  ups:function(ev){ var c=this.cand(ev), n=0, i;
    for(i=0;i<c.length;i++) if(this.V[c[i].id]===1) n++; return n; },

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
   '12 moments &middot; '+N_CAND+' each &middot; struck materials in a dead room, FFX-style &middot; tap to hear it, thumb the one that should BE the sound'));

  var bar=el('div','display:flex;gap:6px;justify-content:center;align-items:center;flex-wrap:wrap;margin-bottom:6px');
  var sun=el('button',null,'SUN'); sun.addEventListener('click',function(){
    W.classList.toggle('sun'); SJ.sun=W.classList.contains('sun'); SJ.save(); });
  if(SJ.sun)W.classList.add('sun');
  var ex=el('button','border-color:#6f6;color:#8fe89a','<b>EXPORT SFX (to Claude)</b>');
  ex.addEventListener('click',function(){ SJ.exportTxt(); });
  var cnt=el('span','font:10px ui-monospace,monospace;color:#8a7a5a;letter-spacing:1px'); cnt.id='sfxCount';
  var colAll=el('button',null,'COLLAPSE ALL');
  var expAll=el('button',null,'EXPAND ALL');
  var only=el('button',null,'ONLY UNJUDGED'); only.id='sfxOnlyNew';
  bar.appendChild(sun); bar.appendChild(colAll); bar.appendChild(expAll);
  bar.appendChild(only); bar.appendChild(ex); bar.appendChild(cnt);
  W.appendChild(bar);

  function refresh(){ var c=document.getElementById('sfxCount');
    if(c)c.textContent=SJ.judged()+' / '+(BOH_SFX.EVENTS.length*N_CAND)+' JUDGED'; }

  /* EVERYTHING COLLAPSES (Paolo 8/1: "I shouldn't be having a scroll for five
     fucking minutes"). A moment he has finished judging starts CLOSED and shows
     one green line saying what he decided. Only the undecided ones are open, so
     the page opens on exactly the work that is left. */
  var CARDS=[];
  BOH_SFX.EVENTS.forEach(function(E){
   var card=el('div'); card.className='sfxCard';
   var done=SJ.done(E.ev), ups=SJ.ups(E.ev);
   var isOpen=(SJ.open[E.ev]!==undefined)?!!SJ.open[E.ev]:!done;
   var body=el('div');

   var hd=el('div','display:flex;gap:6px;align-items:center;justify-content:space-between;cursor:pointer');
   var caret=el('span','font:11px ui-monospace,monospace;color:#8a7a5a;min-width:12px','');
   var ttl=el('div',null,'<span class="sfxLbl">'+E.label+'</span>'
     +'<div class="sfxWhy">'+E.why+'</div>');
   var badge=el('div','font:10px ui-monospace,monospace;letter-spacing:1px;white-space:nowrap');
   function paint(){
    var d=SJ.done(E.ev), u=SJ.ups(E.ev);
    caret.textContent=isOpen?'▾':'▸';
    body.style.display=isOpen?'':'none';
    card.style.opacity=(d&&!isOpen)?'0.72':'1';
    badge.innerHTML = d
      ? '<span style="color:#8fe89a">DECIDED &middot; '+u+' UP</span>'
      : '<span style="color:#e8b478">NEEDS YOU</span>';
   }
   hd.addEventListener('click',function(ev){
    if(ev.target && ev.target.tagName==='BUTTON') return;   /* PLAY is not a toggle */
    isOpen=!isOpen; SJ.open[E.ev]=isOpen; SJ.save(); paint(); });
   var left=el('div','display:flex;gap:7px;align-items:center');
   left.appendChild(caret); left.appendChild(ttl);
   var right=el('div','display:flex;gap:6px;align-items:center');
   var all=el('button','border-color:#8a6ad0;color:#c0a8f0','PLAY '+N_CAND);
   all.addEventListener('click',function(){ SJ.hearRow(E.ev); });
   right.appendChild(badge); right.appendChild(all);
   hd.appendChild(left); hd.appendChild(right); card.appendChild(hd);
   card.appendChild(body);
   CARDS.push({ev:E.ev, card:card, paint:paint,
               setOpen:function(o){ isOpen=o; SJ.open[E.ev]=o; paint(); }});

   SJ.cand(E.ev).forEach(function(v,i){
    var row=el('div'); row.className='sfxRow';
    var pl=el('button',null,'&#9654; '+(i+1)); pl.className='sfxPlay';
    var mt=el('span','font:9px ui-monospace,monospace;color:#8a7a5a;letter-spacing:1px;min-width:52px',
      (v.mat||'').toUpperCase());
    pl.addEventListener('click',function(){ SJ.hear(v); });
    var up=el('button',null,'&#128077;'); up.className='sfxUp'+(SJ.V[v.id]===1?' on':'');
    var dn=el('button',null,'&#128078;'); dn.className='sfxDn'+(SJ.V[v.id]===-1?' on':'');
    up.addEventListener('click',function(){ SJ.V[v.id]=(SJ.V[v.id]===1)?0:1; SJ.save();
      up.className='sfxUp'+(SJ.V[v.id]===1?' on':''); dn.className='sfxDn'+(SJ.V[v.id]===-1?' on':'');
      paint(); refresh(); });
    dn.addEventListener('click',function(){ SJ.V[v.id]=(SJ.V[v.id]===-1)?0:-1; SJ.save();
      up.className='sfxUp'+(SJ.V[v.id]===1?' on':''); dn.className='sfxDn'+(SJ.V[v.id]===-1?' on':'');
      paint(); refresh(); });
    /* PER-ITEM COMMENT (verdict workflow): the note about THIS sound rides with
       this sound into the export, not into a paragraph at the bottom */
    var nt=document.createElement('input'); nt.className='sfxN'; nt.type='text';
    nt.placeholder='note'; nt.value=SJ.C[v.id]||'';
    nt.addEventListener('input',function(){ SJ.C[v.id]=nt.value; SJ.save(); });
    row.appendChild(pl); row.appendChild(mt); row.appendChild(up); row.appendChild(dn); row.appendChild(nt);
    body.appendChild(row);
   });
   paint();
   W.appendChild(card);
  });

  var empty=el('div','display:none;text-align:center;padding:18px 10px;font:11px ui-monospace,monospace;color:#8fe89a;letter-spacing:1px;border:1px dashed #3a5a34;border-radius:6px;margin:8px 0','NOTHING LEFT TO JUDGE &mdash; every sound in the game has your thumb on it.<br><span style="color:#7a6a4e">tap ONLY UNJUDGED again to see everything you decided</span>');
  W.appendChild(empty);

  /* the three controls that make a long list survivable, wired after the cards
     exist so they can reach every one of them */
  function applyFilter(){
   var left=0;
   CARDS.forEach(function(c){
    var hide=(SJ.onlyNew && SJ.done(c.ev));
    c.card.style.display=hide?'none':'';
    if(!SJ.done(c.ev)) left++; });
   only.style.borderColor=SJ.onlyNew?'#e8b478':'#3a3020';
   only.style.color=SJ.onlyNew?'#e8b478':'#cfc3a8';
   /* never hand him a blank page: if the filter hides everything, SAY so */
   empty.style.display=(SJ.onlyNew && left===0)?'':'none';
  }
  colAll.addEventListener('click',function(){
   CARDS.forEach(function(c){ c.setOpen(false); }); SJ.save(); });
  expAll.addEventListener('click',function(){
   CARDS.forEach(function(c){ c.setOpen(true); }); SJ.save(); });
  only.addEventListener('click',function(){
   SJ.onlyNew=!SJ.onlyNew; SJ.save(); applyFilter(); });
  applyFilter();

  /* THE COMMENT SECTION AT THE BOTTOM, ALWAYS (verdict workflow law) */
  W.appendChild(el('div','font:10px ui-monospace,monospace;color:#7a6a4e;letter-spacing:1px;margin:10px 0 4px 0',
    'ANYTHING ELSE ABOUT THE SOUNDS (rides the export):'));
  var ta=document.createElement('textarea'); ta.id='sfxNote'; ta.value=SJ.note;
  ta.addEventListener('input',function(){ SJ.note=ta.value; SJ.save(); });
  W.appendChild(ta);

  P.insertBefore(W,P.firstChild);
  refresh();
  try{ foldSongs(); }catch(e){}
 }

 /* THE SONG LIST FOLDS TOO (Paolo 8/1: "I shouldn't be having a scroll for five
    fucking minutes every time for the music WHETHER IT'S A SONG OR A SOUND
    EFFECT"). This does not touch the studio's own code: it runs AFTER MUS.build
    has rendered, finds the section headings it already writes, and makes each
    one a toggle for the rows underneath it. The studio already ships a
    tap-to-open graveyard box, so this is that idea applied to every section.
    Structure-driven and defensive -- if the list is not shaped the way it reads
    here, it does nothing at all rather than mangling the panel. */
 function foldSongs(){
  var first=document.querySelector('#p-music .mus-row'); if(!first)return;
  var lib=first.parentElement; if(!lib || lib.__folded)return;
  lib.__folded=true;
  var kids=[].slice.call(lib.children), groups=[], cur=null, i;
  for(i=0;i<kids.length;i++){
   var k=kids[i];
   var isRow=k.classList && k.classList.contains('mus-row');
   var holdsRows=k.querySelector && k.querySelector('.mus-row');
   if(!isRow && !holdsRows && (k.textContent||'').length<70){   /* a heading */
    cur={hd:k, rows:[]}; groups.push(cur);
   } else if(cur){ cur.rows.push(k); }
  }
  if(!groups.length)return;
  var ST={}; try{ ST=JSON.parse(localStorage.getItem('bohemia_songfold')||'{}'); }catch(e){}
  groups.forEach(function(g){
   if(!g.rows.length)return;
   var key=(g.hd.textContent||'').trim().slice(0,40);
   var open=(ST[key]!==undefined)?!!ST[key]:false;   /* closed by default: that is the whole point */
   var tag=document.createElement('span');
   tag.style.cssText='font:10px ui-monospace,monospace;color:#8a7a5a;margin-left:8px;letter-spacing:1px';
   g.hd.style.cursor='pointer'; g.hd.appendChild(tag);
   function paint(){
    g.rows.forEach(function(r){ r.style.display=open?'':'none'; });
    tag.textContent=(open?'▾ ':'▸ ')+g.rows.length;
   }
   g.hd.addEventListener('click',function(){
    open=!open; ST[key]=open;
    try{ localStorage.setItem('bohemia_songfold',JSON.stringify(ST)); }catch(e){}
    paint(); });
   paint();
  });
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

    # HIS VERDICTS ARE A REPO FILE (Paolo 8/1: "I can't be judging shit and then
    # you pretend that I didn't"). They used to live only in the phone's
    # localStorage, so growing the batch from 12 moments to 17 handed him back a
    # sheet with 60 already-judged sounds showing as never-judged. Read every
    # committed verdict table and bake it into the surface, so his thumbs survive
    # a new deploy, a cleared cache, and a different device.
    settled, sources = {}, []
    for f in sorted(glob.glob('records/BOHEMIA_SFX_VERDICT_*.txt')):
        txt = open(f, encoding='utf8').read()
        found = 0
        for verdict, cid in re.findall(r'^\s*(UP|DOWN)\s+(\S+\.\d+)\s*$', txt, re.M):
            settled[cid] = 1 if verdict == 'UP' else -1
            found += 1
        if found:
            sources.append('%s (%d)' % (os.path.basename(f), found))
    if not settled:
        print('FAIL: no committed verdicts found -- refusing to build a surface '
              'that would ask him to re-judge everything')
        return 1

    # idempotent: rip any previous mount out whole, then re-inject the current one
    if BEGIN in alpha:
        i = alpha.index(BEGIN)
        j = alpha.index(END) + len(END)
        # AND THE NEWLINES IT BROUGHT. The inject writes a '\n' after END; a cut
        # that stops at END leaves it, so the alpha gained one blank line every
        # single re-run. Nothing broke and nothing complained -- it just made
        # "regenerating changes nothing" quietly false. All three sound tools
        # had this exact bug; all three now eat their own newline back.
        if alpha[j:j + 1] == '\n':
            j += 1
        alpha = alpha[:i] + alpha[j:]
        print('previous mount removed (idempotent re-inject)')

    block = (BEGIN
             + '\n<script>\n/* ENGINE SYNC LAW: this body is engine/bohemia_sfx.js, inlined verbatim.\n'
             + '   Edit the engine file, re-run tools/bohemia_sfx_factory.py. Never edit here. */\n'
             + engine
             + '</script>\n<script>\n/* HIS COMMITTED THUMBS, baked in from records/'
               'BOHEMIA_SFX_VERDICT_*.txt. localStorage only holds CHANGES on top of\n'
               '   this, so a wiped phone falls back to what he already decided. */\n'
             + 'var SETTLED=' + json.dumps(settled, separators=(',', ':')) + ';\n'
             + UI + '</script>\n'
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
    print('  thumbs: %d committed verdicts baked in from %s' % (len(settled), ', '.join(sources)))
    print('          a decided moment opens COLLAPSED; he is never asked twice')
    print('  bank:   EMPTY in the engine (mechanism-mine: which sound each event makes is his verdict)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
