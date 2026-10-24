/* __THE_ONE_BEAT__ (SOUNDS 10/24, row [more music, on the one beat], rule 158; tools/bohemia_sounds_the_one_beat_patch.py)
   PAOLO 10/24, LOCKED: 'every time you press a button it's a request, and the game will do those actions on the BPM...
   everything is supposed to be on this BPM clock of the music... I know some of the songs are more like background hums
   and without drums, but we have made this universal BPM music thing for a whole reason, just to give that extra layer
   of love.'

   ONE GRID FOR THE WHOLE GAME. The song's transport (MUS) books every sixteenth on the audio clock whether the song has
   drums or not, so the clock was always running under a hum; what was missing was (1) anybody outside the transport
   being able to read it, and (2) the grid surviving a song change: every swap and every stall re-anchored the next note
   at 'now + 0.06 s', a random phase, so the beat jumped every time the music changed. Now:
     - every beat the transport books into the live context is stamped here (__beatBooked), as HEARD: the audio clock's
       own output timestamp says when that sample reaches the speaker, so the grid is the beat he hears, not the one
       that was queued (a phone's output delay is 10 to 40 ms, a Bluetooth one 150 ms and more);
     - a song change, a song start and a stall land the new song's first note on the NEXT BEAT OF THE SAME GRID
       (__beatNext), so the beat never jumps; the song's bar starts over with the song, the beat does not;
     - when nothing is playing the grid holds the last song's phase and runs on, so a fight in silence still lands on
       the beat the next song will come in on.

   HOW ANYTHING READS IT (the fight first; the note for COMBAT is records/BOHEMIA_THE_ONE_BEAT_SOUNDS_10_24_26.md):
     BOHEMIA_BEAT.next(div, leadMs)  ms from NOW to the first heard grid point at 1/div of a beat that is at least
                                     leadMs away. div is 1, 2, 4, 8 or 16 (anything else snaps down to one of those):
                                     a faster speed is a finer division of the SAME grid, never a different clock.
                                     A delta, so it is true in any window's clock (an iframe's performance.now() has
                                     its own origin; a timestamp would be off by however long the page was up).
     BOHEMIA_BEAT.now()              { on, src, bpm, beatMs, phase, beatInBar, bar, msToBeat }
     BOHEMIA_BEAT.epoch()            a heard beat on the grid in epoch ms (performance.timeOrigin + performance.now()):
                                     for a reader that keeps its own grid, convert with ITS performance.timeOrigin.
   The fight frame (#fightFrame) is also handed the object itself (cw.BOHEMIA_BEAT) and gets a message on every beat:
     { type:'BOHEMIA_BEAT', on, src, bpm, msPerBeat, inMs, beatInBar, bar, epoch }   (inMs: this beat lands in N ms)
   and any frame may post { type:'BOHEMIA_BEAT_ASK' } to the shell for the same message at once.
   src: 'song' (a song is playing), 'pulse' (the heartbeat before the first song), 'held' (the music stopped; the grid
   runs on from the last song's beat), 'free' (no audio yet; a grid from the first ask). */
(function(){
  'use strict';
  if (window.BOHEMIA_BEAT) return;
  var G = { epoch: null, step: 0, at: null, ac: null, free: null, booked: 0 };
  function now(){ return performance.timeOrigin + performance.now(); }
  function live(){
    try{
      if (typeof MUS === 'undefined' || !MUS.AC) return null;
      if (window.OfflineAudioContext && MUS.AC instanceof window.OfflineAudioContext) return null;   /* a render, not the game */
      return MUS.AC;
    }catch(_e){ return null; }
  }
  /* THE BEAT IS NOT A NEW NUMBER: four of the transport's own sixteenths */
  function beatS(){ try{ return MUS.stepDur() * 4; }catch(_e){ return 0.5; } }
  /* the epoch ms at which audio booked at context time T comes out of the speaker */
  function heard(A, T){
    var ts = null; try{ ts = A.getOutputTimestamp && A.getOutputTimestamp(); }catch(_e){}
    if (ts && ts.contextTime > 0 && ts.performanceTime > 0) return performance.timeOrigin + ts.performanceTime + (T - ts.contextTime) * 1000;
    var lat = (A.outputLatency || 0) + (A.baseLatency || 0);
    return now() + (T - A.currentTime + lat) * 1000;
  }
  function grid(){
    var bm = beatS() * 1000, playing = false;
    try{ playing = !!MUS.playing; }catch(_e){}
    if (G.epoch != null) return { e: G.epoch, bm: bm, beat0: G.step / 4, src: playing ? 'song' : 'held' };
    var A = live();
    if (A){ try{ var pb = window.__pulseNextBeat && window.__pulseNextBeat(); if (pb) return { e: heard(A, pb), bm: bm, beat0: 0, src: 'pulse' }; }catch(_e){} }
    if (G.free == null) G.free = now();
    return { e: G.free, bm: bm, beat0: 0, src: 'free' };
  }
  function snap(div){ div = +div || 1; var d = 1; while (d * 2 <= div && d < 16) d *= 2; return d; }
  function next(div, leadMs){
    var g = grid(), h = g.bm / snap(div), n = now(), t = n + Math.max(0, +leadMs || 0);
    return g.e + Math.ceil((t - g.e) / h - 1e-6) * h - n;
  }
  function state(){
    var g = grid(), t = now(), k = Math.floor((t - g.e) / g.bm), b = g.beat0 + k;
    return { on: g.src === 'song', src: g.src, bpm: 60000 / g.bm, beatMs: g.bm,
             phase: ((t - g.e) / g.bm) - k, beatInBar: ((b % 4) + 4) % 4, bar: Math.floor(b / 4),
             msToBeat: g.e + (k + 1) * g.bm - t };
  }
  function message(){
    var s = state();
    return { type: 'BOHEMIA_BEAT', on: s.on, src: s.src, bpm: s.bpm, msPerBeat: s.beatMs, inMs: s.msToBeat,
             beatInBar: (s.beatInBar + 1) % 4, bar: s.beatInBar === 3 ? s.bar + 1 : s.bar, epoch: now() + s.msToBeat };
  }
  function fightWin(){ try{ var f = document.getElementById('fightFrame'); return f && f.contentWindow; }catch(_e){ return null; } }
  function tell(w){ try{ if (w) w.postMessage(message(), '*'); }catch(_e){} }
  window.BOHEMIA_BEAT = { next: next, now: state, epoch: function(){ return grid().e; }, div: snap,
    probe: function(){ return { epoch: G.epoch, step: G.step, at: G.at, booked: G.booked, free: G.free }; } };

  /* the transport's scheduler calls this for every step it books into the live context */
  window.__beatBooked = function(T, step){
    var A = live(); if (!A || step % 4 !== 0) return;
    G.at = T; G.ac = A; G.step = step; G.epoch = heard(A, T); G.booked++;
    var w = fightWin();
    if (w){ try{ if (!w.BOHEMIA_BEAT) w.BOHEMIA_BEAT = window.BOHEMIA_BEAT; }catch(_e){} tell(w); }
  };
  /* the first beat of the grid at or after context time minT: where a song starts, swaps or picks up after a stall */
  window.__beatNext = function(minT){
    var A = live(); if (!A) return minT;
    /* the same context the last beat was booked on: count whole beats on the transport's own clock, exact */
    if (G.at != null && G.ac === A){ var bs = beatS(); return G.at + Math.ceil((minT - G.at) / bs - 1e-9) * bs; }
    var g = grid(); if (g.src === 'free') return minT;   /* no music has ever played: the first song sets the grid */
    var e = heard(A, minT), k = Math.ceil((e - g.e) / g.bm - 1e-6);
    return minT + (g.e + k * g.bm - e) / 1000;
  };
  window.addEventListener('message', function(ev){
    try{ if (ev && ev.data && ev.data.type === 'BOHEMIA_BEAT_ASK') tell(ev.source); }catch(_e){}
  });
})();
