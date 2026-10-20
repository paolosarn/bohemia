/* ============================================================================
   __ONE_SONG_ONLY__ (SOUNDS 10/20/26, row [one song only], rule 122)

   PAOLO 10/20, LOCKED: 'all the music sucks except for the new one you just made, the overworld night track, so I
   shouldn't be hearing anything other than that ever; if I hear any other song ever again I'm shutting this whole
   shit down'. The same hour: 'And ALL OF THE OVERWORLD NIGHT TRACKS TOO'. Then: 'It's in the music tab!!!'.

   THE SET IS READ AT PLAY TIME, NEVER TYPED HERE. A song may sound only if the MUSIC tab's OVERWORLD NIGHT category
   holds it: MUS.cats, his saved tags first and CAT_DEFAULTS behind them (nine songs on 10/20). Tag a song there and
   it plays; untag it and it goes silent. REPO MAN is in that category and plays as THE MACHINE PARTY (his YES,
   10/19, sounds-repo-man-the-machine-party-10-19, take A: the concrete hall and the worn tape), at the loudness
   his REPO MAN has now (the recorder's own trim, -9.21 dB). Every other song stays on disk and is never heard.

   ONE FENCE, FOUR DOORS AND A NET. The street (CITYMUS), the opening (MENUMUS), the room (INTERIORMUS) and the
   fight (the faction pick) choose only from the set. Then MUS.playStep, the one place a note of any song goes into
   the graph, refuses a song outside it: the game swaps to a song inside it; a song he taps in the MUSIC tab that is
   outside it stays silent (an audition he asked for must not turn into a different song). An offline render (a
   recorder making VOTE material, rule 122(d)) never reaches a speaker and is not fenced.
   The gate is gates/one_song_only_gate.js; the patch that puts this in the alpha is
   tools/bohemia_sounds_one_song_only_patch.py.
   ========================================================================== */
(function(){
 'use strict';
 if(window.SONGFENCE) return;
 var CAT='OVERWORLD NIGHT';
 var F={ cat:CAT, log:[], refused:0, silenced:0, notes:0 };

 function lib(){ try{ return MUS.lib(); }catch(e){ return []; } }
 function nf(){ try{ return MFACTIONS.length; }catch(e){ return 0; } }
 function nameOf(fi){ var f=lib()[fi]; return f ? f.n : null; }
 /* HIS TAGS, AS THE MUSIC TAB SEES THEM. MUS.cats once the engine is built; before that the same two sources it
    builds from (his save, then CAT_DEFAULTS), read without building anything. The legacy 'OVERWORLD' tag is
    'OVERWORLD NIGHT' (his 7/19 words, MUS.bakeCats). */
 function catsOf(key){
  var c=null;
  try{
   if(MUS.cats) c=MUS.cats[key];
   else{
    var d=JSON.parse(localStorage.getItem('bohemia_music')||'null');
    c=d&&d.cats&&d.cats[key];
    if(!c && typeof CAT_DEFAULTS!=='undefined') c=CAT_DEFAULTS[key];
   }
  }catch(e){}
  return c||[];
 }
 function live(){
  try{ var ac=MUS.AC; if(!ac) return true;
   if(window.OfflineAudioContext && ac instanceof window.OfflineAudioContext) return false;
   return !/Offline/.test((ac.constructor&&ac.constructor.name)||'');
  }catch(e){ return true; }
 }
 function note(what, from, to){
  F.log.push([what, from, to, Date.now()]); if(F.log.length>40) F.log.shift();
 }

 F.allowed=function(fi, slot){
  var n=nameOf(fi); if(!n) return false;
  var c=catsOf(n+'#'+(slot||1));
  return c.indexOf(CAT)>=0 || c.indexOf('OVERWORLD')>=0;
 };
 /* every song he has in the category, faction songs included if he ever tags one */
 F.pool=function(){
  var L=lib(), out=[], k=nf();
  for(var i=0;i<L.length;i++){
   if(F.allowed(i,1)) out.push({fi:i, slot:1});
   if(i<k && F.allowed(i,2)) out.push({fi:i, slot:2});
  }
  return out;
 };
 F.names=function(){ return F.pool().map(function(c){ return nameOf(c.fi)+(c.slot===2?' (SONG 2)':''); }); };
 /* the street's own draw: never the same song twice in a row when there is another, canon 8x, unjudged 4x */
 F.pick=function(){
  var cs=F.pool(); if(!cs.length) return null;
  if(cs.length>1){ var fresh=cs.filter(function(c){ return !(c.fi===MUS.cur && c.slot===(MUS.curSlot||1)); }); if(fresh.length) cs=fresh; }
  var w=cs.map(function(c){ var v=MUS.V&&MUS.V[nameOf(c.fi)+'#'+c.slot]; return v===2?8:(v===0?1:4); });
  var t=w.reduce(function(a,b){ return a+b; },0), r=Math.random()*t;
  for(var i=0;i<cs.length;i++){ r-=w[i]; if(r<=0) return cs[i]; }
  return cs[0];
 };
 F.ok=function(){ return F.allowed(MUS.cur, MUS.curSlot||1); };
 F.now=function(){ return nameOf(MUS.cur); };
 /* put a song from the set on the transport, in place; false when the set is empty (then the music is silent) */
 F.fix=function(why){
  if(F.ok()) return true;
  var from=nameOf(MUS.cur), c=F.pick();
  if(!c) return false;
  MUS.cur=c.fi; MUS.curSlot=c.slot; F.refused++;
  note(why, from, nameOf(c.fi));
  return true;
 };
 /* THE STREET TAKING THE MUSIC BACK KEEPS THE SONG THAT IS PLAYING when it is one of his. Before 10/20 the opening
    played a menu song and the fight a faction song, so the street always had to change song on the way back; now
    all three play from the same set, and changing a night song for another night song after sixteen seconds is a
    cut nobody asked for. The street's own 64-bar turn still changes it. */
 F.keep=function(){
  try{
   if(!MUS.playing || !F.ok()) return false;
   var fr=document.getElementById('cityFrame');
   if(fr&&fr.contentWindow) fr.contentWindow.postMessage({bohemiaCityMusicState:{on:true, now:F.now()}},'*');
   note('kept', F.now(), F.now());
   return true;
  }catch(e){ return false; }
 };
 /* A FIGHT USED TO TAKE A FACTION SONG. Now it keeps the night song it walked in on, or takes one from the set. */
 F.fight=function(){ if(MUS.playing && F.ok()){ note('fight kept', F.now(), F.now()); return; } F.fix('fight'); };

 /* ---- THE DOORS ---------------------------------------------------------------------------------------------- */
 try{ CITYMUS.candidates=function(){ return F.pool(); }; }catch(e){}      /* day, dusk and dawn play the night set */
 try{ MENUMUS.candidates=function(){ return F.pool().filter(function(c){ return c.fi>=nf(); }); }; }catch(e){}   /* the opening plays a night song */
 try{ var _ic=INTERIORMUS.candidates;
      INTERIORMUS.candidates=function(){ return _ic.call(INTERIORMUS).filter(function(c){ return F.allowed(c.fi,c.slot); }); };
 }catch(e){}                                                              /* untagged songs are never his set: indoors keeps the street's song */

 /* ---- THE NET: every note of every song passes here ---------------------------------------------------------- */
 var _ps=MUS.playStep;
 F._ps=_ps;
 MUS.playStep=function(s, t, sc){
  if(live() && !F.ok()){
   /* he tapped a song outside his set in the MUSIC tab: it stays silent rather than becoming another song */
   if(MUS._audit && MUS.userPicked){ F.silenced++; if(F.silenced%64===1) note('studio silent', F.now(), null); return; }
   if(!F.fix('net')){ F.silenced++; return; }                            /* the set is empty: silence, never a song */
  }
  F.notes++;
  var mp=live() ? MP.step() : null;
  if(!mp) return _ps.apply(MUS, arguments);
  var M=MUS.MAST; MUS.MAST=mp;                                           /* his voices into the hall and the tape */
  try{ return _ps.apply(MUS, arguments); } finally { MUS.MAST=M; }
 };

 /* ---- REPO MAN, THE MACHINE PARTY -----------------------------------------------------------------------------
    engine/bohemia_machine_party.js listens to his own engine's kick and hat and a real machine answers (the kit:
    slices/vote/songs/machine_party_kit/, real recordings). Loaded once the music is running, never before the door.
    While REPO MAN is on the transport the machine is attached and his voices go through the take-A chain into the
    music master; on any other song it is detached and drumV and MUS.playStep are back exactly. */
 var SPEC={
  press:{gain:0.24, fill:0.15}, relay:{gain:0.08},
  party:{sections:['D'], steps:[4,12], gain:0.18},
  clank:{sections:['B','D'], step:6, every:2, gain:0.12},
  motor:{gain:0.05, strip:1.6},
  hall:{music:0.12, machine:0.35},
  tape:{bump_db:2.5, drive:1.6, wow:0.0008, wow_hz:0.6, flutter:0.00025, flutter_hz:5.1, top_hz:9000}
 };
 var TRIM_DB=-9.21;                       /* the recorder's measured trim for take A against his REPO MAN */
 var MP={ song:'REPO MAN', state:'idle', ac:null, chain:null, err:null, attached:0, spec:SPEC };
 MP.isRepo=function(){ return MUS.curSlot!==2 && nameOf(MUS.cur)===MP.song; };
 function kit(){
  var ac=MUS.AC;
  window.MACHINEPARTY.load(ac, 'vote/songs/machine_party_kit/')
   .then(function(){ MP.ac=ac; MP.chain=null; MP.state='ready'; })
   .catch(function(e){ MP.state='failed'; MP.err=String(e&&e.message||e); });
 }
 MP.load=function(){
  if(window.MACHINEPARTY){ try{ kit(); }catch(e){ MP.state='failed'; MP.err=String(e&&e.message||e); } return; }
  var s=document.createElement('script'); s.src='../engine/bohemia_machine_party.js'; s.async=true;
  s.onload=function(){ try{ kit(); }catch(e){ MP.state='failed'; MP.err=String(e&&e.message||e); } };
  s.onerror=function(){ MP.state='failed'; MP.err='engine did not load'; };
  document.head.appendChild(s);
 };
 /* called on every live step: the node his voices go into for this step, or null. The first call only arms the
    load, four seconds on, so nothing is fetched before the door and nothing lands inside the opening's first beat. */
 MP.step=function(){
  var X=window.MACHINEPARTY;
  if(MP.state==='idle'){ MP.state='waiting'; setTimeout(MP.load, 4000); return null; }
  if(MP.state!=='ready' || !X) return null;
  if(!MP.isRepo()){ if(X.on) X.detach(); return null; }
  if(MP.ac!==MUS.AC){ if(X.on) X.detach(); MP.chain=null; MP.state='waiting'; setTimeout(MP.load, 0); return null; }  /* a rebuilt context */
  if(!MP.chain){
   var ac=MUS.AC, trim=ac.createGain(); trim.gain.value=Math.pow(10, TRIM_DB/20); trim.connect(MUS.MAST);
   MP.chain=X.chain(ac, trim, {hall:SPEC.hall, tape:SPEC.tape}); MP.chain.trim=trim;
  }
  if(!X.on){ X.attach(SPEC, {music:MP.chain.input, machine:MP.chain.machine}); MP.attached++; }
  return MP.chain.input;
 };
 F.machine=MP;

 window.SONGFENCE=F;
})();
