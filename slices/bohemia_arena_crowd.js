/* THE CROWD IN THE PIT (ARENA lane, 11/3/26, VAMILY rule 375 and its duct-tape amendment; ask lines 402, 403).
   Battle Brothers (bb_all/0620_Dev Blog 142: The Arena.txt): 'Your every move is commented with cheers and boos; missed that attack
   with a 95% chance to hit? People will gasp alongside you. Killed that beast with one swift stroke? People will cheer and applaud.
   Flee from your opponents? People will boo, because they paid for a match to the death.'
   The shell plays it, never the fight: the fight already posts BOHEMIA_SFX for every kill, hit, miss and fall (slices/BOHEMIA_FIGHT.html
   SND, 'side' is who struck, for a kill or a fall the side of the man who fell) and, in the pit only, 'arena_ran' when a man runs.
   This file listens while a pit fight is on (BohemiaArenaCrowd.start() from the shell's nfOpen when o.arena, stop() when he goes
   home) and answers with the crowd made from real voices and hands (slices/arena/crowd/, tools/bohemia_arena_crowd.py): the murmur
   under it all, a cheer when one of theirs falls or yours lands a big one, a gasp when yours misses or goes down, a boo when anybody
   runs, the long cheer on the win, the boo on the loss. Through the shell's own sound bus (window.__sfxOut), so the mix and the
   phone's volume are the game's. A reaction is not repeated inside a second and a half: a crowd answers moments, not every swing. */
(function(){
  'use strict';
  var ON = false, BUF = {}, AC = null, BUS = null, BED = null, LAST = {}, LOADING = false, HEARD = [];
  var NAMES = ['bed', 'cheer', 'cheer_long', 'gasp', 'boo'];
  var GAIN = {bed: 0.3, cheer: 0.7, cheer_long: 0.8, gasp: 0.5, boo: 0.65}, GAP = {cheer: 1400, gasp: 900, boo: 1500, cheer_long: 0};
  var base = (function(){ try{ var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^\/]*$/, '') : ''; }catch(e){ return ''; } })();
  function out(){ try{ var o = window.__sfxOut && window.__sfxOut(); if(o && o.AC){ AC = o.AC; BUS = o.bus || o.AC.destination; } }catch(e){} return AC; }
  function load(){
    if(LOADING || !out()) return; LOADING = true;
    NAMES.forEach(function(n){ try{ fetch(base + 'arena/crowd/' + n + '.mp3').then(function(r){ return r.arrayBuffer(); }).then(function(b){ return AC.decodeAudioData(b); })
      .then(function(buf){ BUF[n] = buf; if(n === 'bed' && ON) bed(); }).catch(function(){}); }catch(e){} });
  }
  function play(n, g){
    if(!BUF[n] || !AC) return null;
    var s = AC.createBufferSource(); s.buffer = BUF[n]; var v = AC.createGain(); v.gain.value = g;
    s.connect(v); v.connect(BUS || AC.destination); s.start(); return {s: s, v: v};
  }
  function bed(){ if(BED || !BUF.bed || !ON) return; BED = play('bed', 0.0001); if(!BED) return; BED.s.loop = true; try{ BED.v.gain.setTargetAtTime(GAIN.bed, AC.currentTime, 0.9); }catch(e){} }
  function bedOff(){ if(!BED) return; var b = BED; BED = null; try{ b.v.gain.setTargetAtTime(0.0001, AC.currentTime, 0.5); setTimeout(function(){ try{ b.s.stop(); }catch(e){} }, 2500); }catch(e){} }
  /* what the crowd says to what the fight said (records/target/bb/arena.json crowd) */
  function say(d){
    var ev = d.ev, side = d.side;
    if(ev === 'kill') return side === 'them' ? 'cheer' : 'gasp';            /* the side of the man who fell */
    if(ev === 'went_down') return side === 'them' ? 'cheer' : 'gasp';
    if(ev === 'vital') return side === 'you' ? 'cheer' : null;               /* a big hit by yours */
    if(ev === 'miss') return side === 'you' ? 'gasp' : null;                 /* yours missed */
    if(ev === 'arena_ran') return 'boo';
    if(ev === 'clear') return d.result === 'won' ? 'cheer_long' : d.result === 'lost' ? 'boo' : null;
    return null;
  }
  function react(d){
    if(!ON || !d) return;
    var k = say(d); if(!k) return;
    var now = performance.now(); if(LAST[k] && now - LAST[k] < (GAP[k] || 0)) return; LAST[k] = now;
    HEARD.push([d.ev, d.side || null, k]); if(HEARD.length > 60) HEARD.shift();
    if(!BUF[k]) { load(); return; }
    play(k, GAIN[k]);
    if(k === 'cheer_long' || (k === 'boo' && d.ev === 'clear')) setTimeout(bedOff, 2600);
  }
  window.addEventListener('message', function(e){ var d = e && e.data; if(d && d.type === 'BOHEMIA_SFX') react(d); });
  window.BohemiaArenaCrowd = {
    start: function(){ ON = true; HEARD = []; LAST = {}; load(); bed(); },
    stop: function(){ ON = false; bedOff(); },
    on: function(){ return ON; }, heard: function(){ return HEARD.slice(); }, loaded: function(){ return Object.keys(BUF); }, react: react, say: say
  };
})();
