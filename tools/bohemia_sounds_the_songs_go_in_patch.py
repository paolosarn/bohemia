#!/usr/bin/env python3
"""
BOHEMIA - THE SONGS GO IN, AND HIS TURN HITS HARD (SOUNDS 10/25/26, row [the songs go in, his turn hits hard], rule 207;
with [the sound never chops], rule 175(b)).

PAOLO 10/25: 'I like the songs, I want you to implement them; there has to be a pretty big difference between the opponent's
turn and my turn... it can't just be one quiet thing that's the difference between their turn and your turn.'

WHAT THIS PUTS IN THE ALPHA AND THE DEMO (the same block in both, between its markers, replaced on a re-run):
  __THE_SONGS_GO_IN__  the thirteen approved songs (his nine at three levels, slices/vote/songs/three_levels/, and the four
    new songs, slices/vote/songs/new_four/) play FROM THEIR RECORDINGS, rendered ahead (175(b)): the game's own transport keeps
    booking every sixteenth on the 120 beat (the one grid, THE ONE BEAT, the fight's beat), and on each step it books, the
    song's recording at the level the game's intensity asks for (window.INTENSITY, KILLMUS's MUS.layers: 0 is level 1, 2 is
    level 2, 4 is level 3) is checked to be sounding at exactly that step's place; a change of level starts the new level at
    the same place on the beat it was asked for (a turn's change is committed on its beat by COMBAT's commit-on-read), a hit
    on that beat into level 3, a drop (a 15 ms cut) out of it. A stalled main thread no longer chops the music: the recording
    plays on in the audio thread while nothing is booked.
  THE LADDER (rule 207(a)): the map and the towns play 1; in a fight, their turn 2 and his turn 3 (before the first turn, the
    formation, 2). The 8/26 talking and crowd triggers no longer raise the map (207: 'the map and the towns play 1').
  THE FOUR NEW SONGS JOIN THE ROTATION (207(a)): each gets a row in MLOOPS that carries no notes (its notes are its
    recording), tagged OVERWORLD NIGHT in CAT_DEFAULTS and CANON in CANON_DEFAULTS, so the fence (rule 122) lets it play and
    the street, a fight and the song after a battle draw it like his others; the opening never opens on one (it has no live
    engine to fall back on while its recording decodes).
  MEMORY (rule 173: it never crashes before a fight): only the playing song's levels are decoded (the map: level 1; a fight:
    2 and 3, level 1 let go once 2 is in), the next song's level 1 a phrase before it is needed; on a phone the recordings
    decode at 24 kHz (a 128 s level is 12 MB, not 25).
  UNTIL A RECORDING IS DECODED, his song plays from his engine live, exactly as before; the swap lands on a beat.
AND IN __THE_SONG_ABOVE_THE_FIGHT__: the fight's lift on the music is set from the levels (they carry the gap now).

Idempotent. python3 tools/bohemia_sounds_the_songs_go_in_patch.py
Gate: gates/the_songs_go_in_gate.js
"""
import hashlib
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARTIAL = '--partial' in sys.argv   # a test while songs are still rendering: never committed
SHELLS = [os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), os.path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html')]
SL = os.path.join(ROOT, 'slices')
START = '<!-- __THE_SONGS_GO_IN__ (SOUNDS 10/25, rule 207) -->'
END = '<!-- /__THE_SONGS_GO_IN__ -->'
AFTER = '<!-- /__THE_ONE_BEAT__ -->'
# the fight's lift and trim (rule 207(d): the effects under the music in a fight; the levels carry the gap now)
LIFT_OLD = 'var LIFT = 2.0, TRIM = 0.63,'
LIFT_NEW = 'var LIFT = 1.0, TRIM = 0.5,'
LIFT_MARK = '/* __THE_SONGS_GO_IN__: 1.0 and 0.5 once the re-rendered levels carry the gap (rule 207), 2.0 and 0.63 until then */'


def die(msg):
    print('THE SONGS GO IN PATCH: ' + msg)
    sys.exit(1)


def book():
    songs = {}
    for idx in ('three_levels', 'new_four'):
        I = json.load(open(os.path.join(SL, 'vote', 'songs', idx, 'index.json')))
        for s in I['songs']:
            d = os.path.join(SL, s['dir'])
            M = json.load(open(os.path.join(d, 'measured.json')))
            missing = [f for f in ('level_1.mp3', 'level_2.mp3', 'level_3.mp3') if not os.path.exists(os.path.join(d, f))]
            if missing and PARTIAL:
                continue
            if missing:
                die(s['name'] + ': no ' + missing[0] + ' (render it first)')
            # the hit (207(c)) comes with the bigger-gap re-render; until then a song plays without it (rule 221(a): the
            # music goes in the fight now with the renders there are)
            hit = os.path.exists(os.path.join(d, 'hit.mp3'))
            h = hashlib.md5()
            for f in ('level_1.mp3', 'level_2.mp3', 'level_3.mp3') + (('hit.mp3',) if hit else ()):
                h.update(open(os.path.join(d, f), 'rb').read())
            e = {'dir': s['dir'], 'steps': int(M.get('steps') or M['bars'] * 16), 'gain_db': float(M.get('play_gain_db', 0)),
                 'hit': hit, 'v': h.hexdigest()[:8]}
            if idx == 'new_four':
                # a row with no notes: the fence, the street and the stings read its name, its key and its scale
                e['row'] = {'root': int(M['root']) + 31, 'scale': M['mode'], 'wave': 'sine', 'kick': [], 'bass': [], 'hat': [],
                            'inst': {'b': 'osc', 'l': 'pad'}, 'mel': 'longs', 'swing': 0, 'klay': 'drive', 'rendered': True}
            songs[s['name']] = e
    if len(songs) != 13 and not PARTIAL:
        die('the book has %d songs, the ruling names 13' % len(songs))
    probe = os.path.join(SL, 'vote', 'songs', 'probe.mp3')
    if not os.path.exists(probe):
        die('no slices/vote/songs/probe.mp3 (the decoder-delay probe)')
    return {'made': '10/26', 'rule': [207, 221], 'probe': 'vote/songs/probe.mp3?v=' + hashlib.md5(open(probe, 'rb').read()).hexdigest()[:8],
            'songs': songs}


BLOCK = r'''<!-- __THE_SONGS_GO_IN__ (SOUNDS 10/25, rule 207) -->
<script>
/* ============================================================================
   __THE_SONGS_GO_IN__ (SOUNDS 10/25/26, row [the songs go in, his turn hits hard], rule 207; and rule 175(b))

   PAOLO 10/25: 'I like the songs, I want you to implement them; there has to be a pretty big difference between the
   opponent's turn and my turn... it can't just be one quiet thing that's the difference between their turn and your turn.'

   THE THIRTEEN SONGS PLAY FROM THEIR RECORDINGS (slices/vote/songs/three_levels/ and new_four/, the same files the VOTE
   cards play): level 1 on the map and in the towns, level 2 on their turn, level 3 on his turn, every level of a song one
   timeline. Through a phone's speaker level 2 is 3.6 dB over level 1 and level 3 6.8 dB over level 2, and level 3 is the
   only one with the full drums and the lead (tools/bohemia_sounds_three_levels.js measures and sets it).
   HOW: the game's transport still books every sixteenth on the 120 beat (the one grid: THE ONE BEAT, the fight's beat, the
   street's turns). On each step it books, the recording at the level MUS.layers asks for is checked to be sounding at
   that step's place; a level change starts the new level at the same place, on the beat it was committed on (a turn's
   change is committed on its beat by COMBAT's commit-on-read, read here), with a hit into 3 and a drop out of it.
   RENDERED AHEAD (175(b)): a stalled main thread books nothing, and the recording plays on in the audio thread.
   UNTIL A RECORDING IS DECODED his song plays from his engine live, as it always did, and the swap lands on a beat.
   tools/bohemia_sounds_the_songs_go_in_patch.py; gate gates/the_songs_go_in_gate.js. window.SONGBOOK reads it.
   ========================================================================== */
(function(){
 'use strict';
 if(window.SONGBOOK) return;
 if(typeof MUS==='undefined' || typeof KILLMUS==='undefined') return;
 var BOOK=/*BOOK*/{}/*/BOOK*/;
 var SD=0.125, OFF=0.05, TOL=0.004;
 var R=window.SONGBOOK={ book:BOOK, sets:{}, src:null, ring:[], buses:{}, delay:null, queued:null, switches:[], hits:0,
   fallback:0, steps:0, resync:0, errs:[], decoded:0, dropped:0, rate:null };

 function live(){
  try{ var A=MUS.AC; if(!A) return null;
   if(window.OfflineAudioContext && A instanceof window.OfflineAudioContext) return null;
   if(/Offline/.test((A.constructor&&A.constructor.name)||'')) return null;
   return A; }catch(e){ return null; } }
 function nameOf(fi){ try{ var L=MUS.lib(); return L[fi]?L[fi].n:null; }catch(e){ return null; } }
 function entry(){ try{ if((MUS.curSlot||1)!==1) return null; var n=nameOf(MUS.cur); return (n && BOOK.songs[n]) ? n : null; }catch(e){ return null; } }
 function fighting(){ try{ return !!(KILLMUS.threat || KILLMUS.nf); }catch(e){ return false; } }
 /* the fight is coming: its frame is in the page (on a slow phone 9 s before the board), so its levels decode before the first turn */
 function coming(){ try{ return fighting() || !!document.getElementById('fightFrame'); }catch(e){ return false; } }
 function note(o){ o.at=+(performance.now()/1000).toFixed(3); R.switches.push(o); if(R.switches.length>80) R.switches.shift(); }

 /* ---- THE FOUR NEW SONGS: a row each, no notes (their notes are their recordings), in his set ---------------------- */
 try{
  for(var n0 in BOOK.songs){ var b0=BOOK.songs[n0]; if(!b0.row) continue;
   if(!MLOOPS.some(function(x){ return x.n===n0; })){ var row={ n:n0 }; for(var k0 in b0.row) row[k0]=b0.row[k0]; MLOOPS.push(row); }
   var key=n0+'#1';
   if(typeof CAT_DEFAULTS!=='undefined' && !CAT_DEFAULTS[key]) CAT_DEFAULTS[key]=['OVERWORLD NIGHT'];
   if(typeof CANON_DEFAULTS!=='undefined' && CANON_DEFAULTS[key]==null) CANON_DEFAULTS[key]=2;
   try{ if(MUS.cats && !MUS.cats[key]) MUS.cats[key]=['OVERWORLD NIGHT']; }catch(e){}
   try{ if(MUS.V && MUS.V[key]==null) MUS.V[key]=2; }catch(e){}
  }
 }catch(e){ R.errs.push('rows: '+e.message); }
 /* the opening never opens on a song with no live engine under it */
 try{ var mc=MENUMUS.candidates; MENUMUS.candidates=function(){ return mc.call(MENUMUS).filter(function(c){ var n=nameOf(c.fi); return !(n && BOOK.songs[n] && BOOK.songs[n].row); }); }; }catch(e){}

 /* ---- THE LADDER (207(a)): the map and the towns 1; a fight: their turn 2, his turn 3, the formation 2 ------------- */
 (function(){
  var K=KILLMUS, side=null, turn0=K.turn, settle0=K.settle, reset0=K.reset;
  K.level=function(){ if(!(this.threat || this.nf)) return 1; return side==='you' ? 3 : 2; };
  if(turn0) K.turn=function(s){ side=(s==='them')?'them':'you'; var r=turn0.apply(this, arguments); try{ turnNow(); }catch(e){} return r; };
  if(settle0) K.settle=function(){ side=null; var r=settle0.apply(this, arguments); setTimeout(function(){ try{ plan(); }catch(e){} }, 0); return r; };
  if(reset0) K.reset=function(){ side=null; return reset0.apply(this, arguments); };
  K.side=function(){ return side; };
 })();

 /* ---- DECODING: on a phone at 24 kHz; the encoder's delay read once, off the hit (one onset, 0.05 s into its file) ---- */
 function coarse(){ try{ return !!(window.matchMedia && matchMedia('(pointer: coarse)').matches); }catch(e){ return false; } }
 function decode(ab){
  return new Promise(function(res, rej){
   var C=window.OfflineAudioContext||window.webkitOfflineAudioContext, d=null;
   if(coarse() && C){ try{ d=new C(1, 1, 24000); }catch(e){ d=null; } }
   if(!d) d=live();
   if(!d) return rej(new Error('no audio'));
   R.rate=d.sampleRate;
   try{ var p=d.decodeAudioData(ab, res, rej); if(p && p.then) p.then(res, rej); }catch(e){ rej(e); }
  });
 }
 function onset(b){
  var d=b.getChannelData(0), sr=b.sampleRate, n=Math.min(d.length, Math.round(sr*0.4)), pk=0, i;
  for(i=0;i<n;i++){ var a=Math.abs(d[i]); if(a>pk) pk=a; }
  var th=Math.max(0.002, pk*0.25);
  for(i=0;i<n;i++) if(Math.abs(d[i])>th) break;
  return i>=n ? 0 : Math.max(-0.01, Math.min(0.1, i/sr-OFF));
 }
 /* THE DECODER'S DELAY, read once off the probe (one hard onset exactly 0.05 s into its file, the songs' own encoder): a
    browser that trims the encoder's padding reads 0 (Chromium does), one that keeps it reads the padding; every song's
    step 0 then sits at 0.05 s plus that. */
 var PR=null;
 function probe(){
  if(R.delay!=null) return Promise.resolve();
  if(PR) return PR;
  PR=fetch(BOOK.probe).then(function(r){ if(!r.ok) throw new Error('probe '+r.status); return r.arrayBuffer(); })
   .then(function(ab){ return decode(ab); }).then(function(b){ R.delay=onset(b); },
    function(e){ R.delay=0; R.errs.push('probe: '+(e&&e.message||e)); });
  return PR;
 }
 function setOf(n){ var s=R.sets[n]; if(!s) s=R.sets[n]={ n:n, b:BOOK.songs[n], ab:{}, buf:{}, ld:{} }; return s; }
 function bytes(s, f){
  if(s.ab[f]) return Promise.resolve(s.ab[f]);
  return fetch(s.b.dir+f+'.mp3?v='+s.b.v).then(function(r){ if(!r.ok) throw new Error(f+' '+r.status); return r.arrayBuffer(); })
   .then(function(ab){ s.ab[f]=ab; return ab; });
 }
 function load(s, f){
  if(s.buf[f]) return Promise.resolve(s.buf[f]);
  if(s.ld[f]) return s.ld[f];
  s.ld[f]=probe().then(function(){ return bytes(s, f); }).then(function(ab){ return decode(ab.slice(0)); }).then(function(b){
    delete s.ld[f]; s.buf[f]=b; R.decoded++;
    /* a level the fight asked for, decoded after the turn was told: it comes in on its next beat, not the transport's */
    if(f!=='hit') setTimeout(function(){ try{ turnNow(true); }catch(e){} }, 0);
    return b; },
   function(e){ delete s.ld[f]; R.errs.push(s.n+' '+f+': '+(e&&e.message||e)); if(R.errs.length>20) R.errs.shift(); throw e; });
  return s.ld[f];
 }
 /* WHAT IS HELD: the playing song's levels for where he is (on the map level 1 decoded and the fight's two levels as bytes,
    so a fight decodes without a fetch), the hit, the next song's level 1 (its bytes only in a fight) */
 function plan(){
  var keep={}, n=entry();
  if(n){ var s=setOf(n), k=keep[n]={}; if(s.b.hit) k.hit=1;
   if(coming()){ k.level_2=1; k.level_3=1; if(!s.buf.level_2) k.level_1=1; }
   else { k.level_1=1; k['bytes:level_2']=1; k['bytes:level_3']=1; }
   if(R.src && R.src.n===n && !R.src.stop) k['level_'+R.src.lv]=1; }
  if(fighting() && !R.queued) queue();
  /* the song after this one: queued (its bytes in a fight, its level 1 on the map) or just picked and about to swap in */
  [R.queued, (R.coming && Date.now()-R.coming.t<8000) ? R.coming : null].forEach(function(q){
   if(!q || !BOOK.songs[q.name] || q.name===n) return;
   var kq=keep[q.name]=keep[q.name]||{}; kq['bytes:level_1']=1; if(!fighting() || q===R.coming){ kq.level_1=1; if(BOOK.songs[q.name].hit) kq.hit=1; } });
  for(var m in keep){ var s2=setOf(m);
   for(var f in keep[m]){ if(f.indexOf('bytes:')===0){ bytes(s2, f.slice(6)).catch(function(){}); continue; } load(s2, f).catch(function(){}); } }
  for(var m2 in R.sets){ var s3=R.sets[m2];
   for(var g in s3.buf) if(!(keep[m2] && keep[m2][g])){ delete s3.buf[g]; R.dropped++; }
   if(!keep[m2]) s3.ab={}; }
 }
 setInterval(function(){ try{ if(live() && MUS.playing) plan(); }catch(e){} }, 1000);

 /* ---- THE NEXT SONG, CHOSEN A PHRASE EARLY so its recording is in when the street turns ------------------------------ */
 var pick0=CITYMUS.pick;
 CITYMUS.pick=function(){
  var q=R.queued;
  if(q && q.fi!==MUS.cur && Date.now()-q.t<600000){ R.queued=null;
   try{ if(!window.SONGFENCE || SONGFENCE.allowed(q.fi, q.slot)){ R.coming={ fi:q.fi, slot:q.slot, name:q.name, t:Date.now() }; setTimeout(plan, 0); return { fi:q.fi, slot:q.slot }; } }catch(e){} }
  R.queued=null;
  var c=pick0.apply(this, arguments);
  if(c){ R.coming={ fi:c.fi, slot:c.slot, name:nameOf(c.fi), t:Date.now() }; setTimeout(plan, 0); }
  return c;
 };
 function queue(){
  if(R.queued) return;
  var c=null; try{ c=pick0.call(CITYMUS); }catch(e){ c=null; }
  if(!c || c.fi===MUS.cur) return;
  R.queued={ fi:c.fi, slot:c.slot, name:nameOf(c.fi), t:Date.now() }; plan();
 }

 /* ---- THE PLAYER ---------------------------------------------------------------------------------------------------- */
 function bus(s){
  var A=live(), b=R.buses[s.n];
  if(b && b.context===A && b._to===MUS.MAST) return b;
  b=A.createGain(); b.gain.value=Math.pow(10, (s.b.gain_db||0)/20); b.connect(MUS.MAST); b._to=MUS.MAST; R.buses[s.n]=b; return b;
 }
 function begin(s, lv, k, t, fadeIn){
  var A=live(), src=A.createBufferSource(), g=A.createGain(), now=A.currentTime;
  var off=OFF+(R.delay||0)+k*SD;
  if(t<now){ off+=now-t; t=now; }                 /* a step booked late: the song where it is now, never a rush */
  src.buffer=s.buf['level_'+lv]; src.connect(g); g.connect(bus(s));
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t+(fadeIn||0.006));
  src.start(t, Math.max(0, off));
  var c={ n:s.n, lv:lv, src:src, g:g, t0:t, off0:off, stop:null };
  src.onended=function(){ try{ src.disconnect(); g.disconnect(); }catch(e){} var i=R.ring.indexOf(c); if(i>=0) R.ring.splice(i,1); };
  R.ring.push(c); R.src=c; return c;
 }
 function end(c, t, fade){
  if(!c || c.stop) return; c.stop=t;
  try{ var g=c.g.gain; g.cancelScheduledValues(t); g.setValueAtTime(1, t); g.linearRampToValueAtTime(0, t+fade); c.src.stop(t+fade+0.02); }catch(e){}
 }
 function strike(s, t){
  var hb=s.buf.hit, A=live(); if(!hb || !A) return;
  try{ var h=A.createBufferSource(); h.buffer=hb; h.connect(bus(s)); h.start(Math.max(t, A.currentTime), OFF+(R.delay||0)); R.hits++; }catch(e){}
 }
 /* the level asked for, or the nearest one under it that is decoded, else the nearest over it (a fight just over) */
 function best(s, want){ var l; for(l=want; l>=1; l--) if(s.buf['level_'+l]) return l; for(l=want+1; l<=3; l++) if(s.buf['level_'+l]) return l; return 0; }
 R.stopAll=function(fade){ var A=live(); if(!A) return; var t=A.currentTime; R.ring.slice().forEach(function(c){ c.stop=null; end(c, t, fade||0.06); }); R.src=null; };

 var PS=MUS.playStep;
 MUS.playStep=function(s, t, sc){
  var A=live();
  if(!A || !MUS.playing) return PS.apply(MUS, arguments);   /* an offline render (the cards' recorder), or a step booked by hand
                                                    with the transport stopped (a gate's sweep): his engine, as always */
  try{ if(window.SONGFENCE && !SONGFENCE.ok() && !(MUS._audit && MUS.userPicked)) SONGFENCE.fix('net'); }catch(e){}
  var lay=MUS.layers;                               /* reading it commits a turn's change, on its beat (COMBAT's read) */
  var pend=KILLMUS.pending ? KILLMUS.pending() : null; if(pend) lay=pend.want;   /* a turn already heard (turnNow) holds */
  var n=entry(), c=R.src;
  if(!n){ if(c && !c.stop) end(c, t, 0.3); R.src=null; return PS.apply(MUS, arguments); }
  var S=setOf(n), N=S.b.steps, k=MUS.step%N, want=lay>=4?3:(lay>=2?2:1);
  R.steps++; R.want=want;
  if(k===N-256 && !fighting()) queue();
  if(R.queued && R.queued.name===n) R.queued=null;
  var lv=best(S, want);
  if(!lv){
   if(c && !c.stop && c.n!==n){ end(c, t, 0.3); R.src=null; }
   if(!S.ld.level_1 && !S.ld.level_2) plan();
   if(S.b.row) return;                              /* a new song has no engine notes: it waits for its recording */
   R.fallback++; return PS.apply(MUS, arguments);   /* his song, live, until its recording is in */
  }
  var at=OFF+(R.delay||0)+k*SD;
  if(c && !c.stop && c.n===n){
   var pos=c.off0+(t-c.t0), drift=pos-at;
   if(c.lv===lv && Math.abs(drift)<TOL) return;    /* sounding, in its place */
   if(c.lv===lv && k===0 && Math.abs(pos-(OFF+(R.delay||0)+N*SD))<TOL){   /* the pass came round: the old one rings its tail */
    c.stop=t; begin(S, lv, 0, t, 0.004); note({ song:n, lv:lv, k:0, why:'round' }); return; }
   if(c.lv!==lv && Math.abs(drift)<TOL && k%4!==0) return;   /* a level change waits for the beat */
   var into3=(lv===3 && c.lv!==3), outOf3=(c.lv===3 && lv!==3);
   if(c.lv===lv) R.resync++;
   end(c, t, outOf3 ? 0.015 : 0.03);
   begin(S, lv, k, t, into3 ? 0.004 : 0.012);
   if(into3) strike(S, t);
   note({ song:n, from:c.lv, lv:lv, want:want, k:k, step:MUS.step, beat:k%4===0, t:+t.toFixed(3), why:c.lv===lv?'resync':(into3?'hit':(outOf3?'drop':'change')) });
   return;
  }
  /* a new song, or the first sound of one: from the engine's fallback the swap waits for the beat */
  if(c && !c.stop && c.n!==n) end(c, t, 0.3);
  else if(!c && R.steps>1 && k%4!==0 && !S.b.row && R.fallback) { R.fallback++; return PS.apply(MUS, arguments); }
  begin(S, lv, k, t, c ? 0.01 : 0.02);
  note({ song:n, lv:lv, want:want, k:k, step:MUS.step, t:+t.toFixed(3), why:c?'song':'start' });
 };
 R.net=MUS.playStep;
 /* THE TURN ON THE NEXT BEAT HE HEARS (207(c)). The transport books a beat ahead, so waiting for its next booked beat put
    the change 0.5 to 1.0 s after the turn (MEASURED, computer: 0.55 to 0.97 s). The recording is already sounding, so the
    level changes at the song's next beat that has not yet come out of the speaker (40 ms of margin), and the transport,
    booking that beat later, finds it done. */
 function turnNow(decoded){
  var A=live(), c=R.src, n=entry(); if(!A || !c || c.stop || !n || c.n!==n) return;
  var p=KILLMUS.pending ? KILLMUS.pending() : null, wl=p ? p.want : (decoded ? KILLMUS.want : null); if(wl==null) return;
  var want=wl>=4?3:(wl>=2?2:1), S=setOf(n), lv=best(S, want); if(!lv || lv===c.lv) return;
  var d=OFF+(R.delay||0), N=S.b.steps, now=A.currentTime+0.04;
  var pos=c.off0+(now-c.t0), k=Math.ceil((pos-d)/(4*SD)-1e-9)*4, t=c.t0+(d+k*SD-c.off0);
  if(k>=N) return;                                  /* the pass is coming round: the transport's own beat takes it */
  var into3=(lv===3 && c.lv!==3), outOf3=(c.lv===3 && lv!==3);
  end(c, t, outOf3 ? 0.015 : 0.03);
  begin(S, lv, k, t, into3 ? 0.004 : 0.012);
  if(into3) strike(S, t);
  note({ song:n, from:c.lv, lv:lv, want:want, k:k, step:k, beat:true, t:+t.toFixed(3), why:(into3?'hit':(outOf3?'drop':'change'))+(decoded?' decoded':' now') });
 }
 /* stopping the transport stops the recordings (MAST is cut to zero by stop(), and would bring them back with start()) */
 var STOP0=MUS.stop;
 MUS.stop=function(){ try{ R.stopAll(0.06); }catch(e){} return STOP0.apply(this, arguments); };
 R.state=function(){ var c=R.src; return { song:c?c.n:null, level:c?c.lv:0, want:R.want||0, playing:!!(c && !c.stop), fighting:fighting(),
   side:KILLMUS.side?KILLMUS.side():null, delay:R.delay, rate:R.rate, decoded:R.decoded, held:Object.keys(R.sets).map(function(m){ return m+':'+Object.keys(R.sets[m].buf).join(','); }),
   queued:R.queued?R.queued.name:null, hits:R.hits, fallback:R.fallback, resync:R.resync, errs:R.errs.slice(-5) }; };
 /* THE BEAT ON THE GRID, read off the decoded recording itself: its loudness in 2.5 ms frames, folded on the eighth note
    (0.25 s) from where the player puts step 0 (0.05 s + the decoder's delay) and averaged, then the steepest rise of that
    average: the kit's onsets on the beat and its eighths rise at phase 0. A fold first and a rise after, so a pad or a tail
    never outvotes the kit (rule 221(c): within 20 ms of a beat or its eighth). ms off the grid, and how steep. */
 R.beatPhase=function(n, lv){
  var s=R.sets[n], b=s&&s.buf['level_'+lv]; if(!b) return null;
  var d=b.getChannelData(0), sr=b.sampleRate, fr=Math.max(1, Math.round(sr*0.0025)), N=Math.floor(d.length/fr), o0=OFF+(R.delay||0);
  var P=0.25, B=100, sum=new Float64Array(B), cnt=new Float64Array(B), i, k;
  for(i=0;i<N;i++){ var t=i*fr/sr-o0; if(t<0) continue; var a=0; for(k=0;k<fr;k++) a+=Math.abs(d[i*fr+k]);
   var j=Math.floor((t%P)/0.0025)%B; sum[j]+=a/fr; cnt[j]++; }
  var avg=new Float64Array(B), mean=0; for(i=0;i<B;i++){ avg[i]=cnt[i]?sum[i]/cnt[i]:0; mean+=avg[i]/B; }
  var best=0, rb=-1; for(i=0;i<B;i++){ var r=avg[i]-avg[(i+B-1)%B]; if(r>rb){ rb=r; best=i; } }
  var ms=best*2.5; if(ms>125) ms-=250;
  return { ms_off_the_grid:ms, rise:+(rb/(mean||1)).toFixed(2), delay_ms:+((R.delay||0)*1000).toFixed(1), rate:sr };
 };
})();
</script>
<!-- /__THE_SONGS_GO_IN__ -->'''


def main():
    B = book()
    block = BLOCK.replace('/*BOOK*/{}/*/BOOK*/', '/*BOOK*/' + json.dumps(B, separators=(',', ':')) + '/*/BOOK*/')
    for p in SHELLS:
        s = open(p, encoding='utf-8').read()
        if START in s:
            a = s.index(START)
            b = s.index(END, a) + len(END)
            s = s[:a] + block + s[b:]
        else:
            if s.count(AFTER) != 1:
                die(os.path.basename(p) + ': the one beat\'s end marker found %d times' % s.count(AFTER))
            s = s.replace(AFTER, AFTER + '\n' + block)
        # the levels carry the fight's lift only once they are the re-rendered ones (every song its hit, rule 207); the
        # renders there were (rule 221(a)) keep the lift the fight had
        lift = LIFT_NEW if all(e['hit'] for e in B['songs'].values()) else LIFT_OLD
        if LIFT_MARK not in s:
            if s.count(LIFT_OLD) != 1:
                die(os.path.basename(p) + ': the fight lift found %d times' % s.count(LIFT_OLD))
            s = s.replace(LIFT_OLD, lift + ' ' + LIFT_MARK)
        else:
            s = re.sub(r'var LIFT = [0-9.]+, TRIM = [0-9.]+,', lift, s, count=1)
        open(p, 'w', encoding='utf-8').write(s)
        print('patched ' + os.path.basename(p) + ': %d songs in the book' % len(B['songs']))


if __name__ == '__main__':
    main()
