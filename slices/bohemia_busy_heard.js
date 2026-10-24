/* BOHEMIA -- THE BUSY TOWN TALKS (RUN TWO, 10/24/26, row [the busy town talks], rules 131 and 135).
   PAOLO 10/23 (rule 131): 'I would like to see characters you can't even interact with walking around the settlement, doing
   something, doing important things; but everyone that needs to get clicked on stands still, always.' PAOLO 10/24 (rule 135):
   'every time people speak... Animal Crossing style squiggle voice, but maybe it could be more creepy.' The row: the walkers at
   their jobs make the small sounds of the job and now and then mutter a squiggle to each other as they pass, quiet, never a line
   to read; a town at night should feel different from a town at noon (the coordinator, 10/24).

   WHAT IT DOES, called by slices/BOHEMIA_SETTLEMENT_SCREEN.html once a frame (busyHeard()), on the screen's own sound
   (engine/bohemia_settlement_heard.js: one AudioContext, the EFFECTS slider, ALL and MUTE, silent while the frame is hidden):
   - EVERY WALKER HAS A JOB, by the hour and his place in the hand, so the same man does the same work every visit:
     by day crates, a hammer, a pot, a broom; after dark one is always the watchman walking his round (his boots, every
     beat, the only footsteps in town), the others a cook fire and a late crate. The job is heard where he works: at the
     ends of his round, on the beat (120 BPM), each strike pitched a hair apart so it is a man and never a loop.
   - WHERE HE IS IS WHERE IT IS: panned to his place on the glass, quieter on the far lane, quieter still off the edge of
     the screen, ducked under a keeper's sheet so the man you tapped is the one you hear.
   - TWO WHO PASS MUTTER: when two walkers cross on a lane, or a walker passes a man in the crowd, now and then one says a
     few words in the squiggle and sometimes the other answers; low, panned to them, filtered a little by the distance.
     Never written anywhere (nothing to read), never while a sheet is open, and a sheet opening cuts it in 15 ms (the
     squiggle's own fade, no click). By day full voice, a mutter every few seconds at most; AFTER DARK A WHISPER: lower,
     slower, filtered close, rarer, and often nobody answers. And once in a night visit, maybe, a voice from the dark at the
     edge of town, from nobody you can see.
   - THE VOICE IS THE PERSON: a walker's voice is castVoice('face:' + look), the same voice the shell gives that face when he
     talks to you (ONE ID, ONE WHOLE PERSON), said by SOUNDS' recorded squiggle (engine/bohemia_voice_recorded.js). The
     decoded bank (125 s, about 22 MB) is BORROWED from the shell when the shell has it (window.top.SQUIGGLE: an AudioBuffer
     is not tied to one context), so the phone never holds it twice; a screen opened alone loads its own.
   The sounds of the jobs: slices/settlement/heard_jobs/ (tools/bohemia_run2_job_sounds.py: CC0 recordings from SOUNDS' bank
   through SOUNDS' chain). The lines are draft:true and never shown: they only give the squiggle its letters.
   Gate: gates/the_busy_town_talks_gate.js. */
(function(){
  'use strict';
  var DIR = 'settlement/heard_jobs/', BEAT = 500, AHEAD = 150, ONSET = 0.038;   /* the clips' own onset (encoder delay + air), measured */
  var JOBS = {
    crate:  { gain:0.32, what:'hauls crates' },   /* measured 10/24: a job's loudest 93 ms sits 20 to 25 dB under a building's own tap */
    hammer: { gain:0.24, what:'fixes a wall' },
    pot:    { gain:0.21, what:'cooks' },
    broom:  { gain:0.16, what:'sweeps' },
    guard:  { gain:0.14, what:'walks the night round' },
    fire:   { gain:0.19, what:'keeps the cook fire' }
  };
  var DAY = ['crate', 'hammer', 'pot', 'broom'], NIGHT_REST = ['fire', 'crate'];
  var NIGHT_TRIM = 0.6;   /* the valley is quieter after dark (the screen's NIGHT_TRIM for its buildings is 0.5); the watchman's boots are not trimmed: they are the night */
  /* draft:true, never shown: the squiggle's letters (the player does not speak Spanglish, the first votes). WORDS [spanglish at
     ten percent] (rule 143a, Paolo 10/24: 'it should be 10 to 15% randomized'): every bank is English with a Spanglish twin, and the
     twin is said on BohemiaSpanglish's roll for that face (about 1 in 8, some lean more); 6 of 11 day lines were Spanish before */
  var DAY_LINES = ["Hot one today, eh.", "Where's Chuy at?", "That stall's out again.", "Watch the fence tonight.", "They paid you yet?",
    "Two batteries, that's it.", "Water's late again.", "Same as always.", "Busy, busy.", "You see the price on that?", "Almost done here."];
  var DAY_ES = ["Órale, ¿qué onda?", "Ya mero, carnal.", "Two batteries, no más.", "Ni modo, pues.", "Mira nomás.", "Ándale, ándale."];
  var DAY_ANSWERS = ["Mm.", "Yeah.", "Yeah, yeah.", "Right.", "I know."], DAY_ANSWERS_ES = ["Sí, sí.", "Pues sí.", "Ya sé.", "Órale."];
  var NIGHT_LINES = ["Shh. Lights off.", "You hear that?", "Stay off the road.", "Something's out past the wash.", "Keep it down.",
    "Don't look at it.", "Who's walking out there?"];
  var NIGHT_ES = ["Stay off the road, mijo.", "Cállate. Lights off."];
  var NIGHT_ANSWERS = ["Mm.", "Shh.", "No.", "Go inside."], NIGHT_ANSWERS_ES = ["Shh. Ya.", "Ándale, inside."];
  var GREET_DAY = ["Still open?", "Hey.", "Afternoon.", "Hey, you made it."], GREET_DAY_ES = ["Buenas.", "¿Qué tal, jefe?", "Ey, buenas tardes."];
  var GREET_NIGHT = ["Lock it tonight.", "Evening."], GREET_NIGHT_ES = ["Buenas noches."];
  var DARK_LINES = ["Come out here.", "I know you're awake.", "Open up, it's only me.", "Mijo. Mijo, over here."];
  /* the twin bank for each bank; a line is said from the twin on the face's roll */
  function spBank(L){ return L === DAY_LINES ? DAY_ES : L === DAY_ANSWERS ? DAY_ANSWERS_ES : L === NIGHT_LINES ? NIGHT_ES : L === NIGHT_ANSWERS ? NIGHT_ANSWERS_ES
    : L === GREET_DAY ? GREET_DAY_ES : L === GREET_NIGHT ? GREET_NIGHT_ES : null; }
  function lineOf(L, who, R){
    var es = spBank(L), sp = es && (window.BohemiaSpanglish ? window.BohemiaSpanglish.roll('face:' + (who && who.look), 'mutter') : R() < 0.125);
    var B = sp ? es : L; return B[Math.floor(R()*B.length)];
  }
  var GAP = { day:9000, market:7000, night:16000 };   /* now and then: a few words every ten seconds at most by day, rarer after dark */
  var ONLY = null;   /* a measurement may hear one half alone: 'jobs' or 'talk' */
  var CHANCE = { day:0.6, night:0.45 }, ANSWER = { day:0.6, night:0.3 };

  function hash(s){ var h = 2166136261 >>> 0; s = String(s); for(var i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function rng(seed){ var t = seed >>> 0; return function(){ t = (t + 0x6D2B79F5) >>> 0; var r = Math.imul(t ^ (t >>> 15), 1 | t); r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
  function clamp(x, a, b){ return x < a ? a : x > b ? b : x; }

  /* HIS JOB: by the hour and his place in the hand (the hand is the place's own, so the same man, the same job, every visit) */
  function jobOf(slot, place, night){
    if(night) return slot === 0 ? 'guard' : NIGHT_REST[(hash(place + ':night') + slot - 1) % NIGHT_REST.length];
    return DAY[(hash(place + ':day') + slot) % DAY.length];
  }
  /* what a stop sounds like: the events of one stop, on the beat from its first beat (start, already on the grid) */
  function stopEvents(job, start, stopMs, end, R){
    var nb = Math.max(1, Math.floor(stopMs / BEAT)), ev = [], k;
    var jit = function(){ return 0.95 + R() * 0.1; };
    if(job === 'crate'){
      if(end === 'b') ev.push({at:start, clip:R() < .5 ? 'crate_a' : 'crate_b', g:1, rate:jit()});   /* set down where he brought it */
      else ev.push({at:start + BEAT, clip:'crate_b', g:.7, rate:jit() * 1.04});                          /* the next one lifted */
    } else if(job === 'hammer'){
      for(k = 0; k < Math.max(1, nb - 1); k++){
        ev.push({at:start + k*BEAT, clip:k % 2 ? 'hammer_b' : 'hammer_a', g:.85 + R()*.15, rate:jit()});
        if(R() < .3) ev.push({at:start + k*BEAT + BEAT/2, clip:'hammer_b', g:.55, rate:jit() * 1.03});   /* a quick tap to set the nail */
      }
    } else if(job === 'pot'){
      ev.push({at:start, clip:'pot_a', g:1, rate:jit()});
      if(nb >= 3) ev.push({at:start + 2*BEAT, clip:'pot_b', g:.7, rate:jit()});
      if(nb >= 5) ev.push({at:start + 4*BEAT, clip:'pot_b', g:.55, rate:jit() * .97});
    } else if(job === 'broom'){
      for(k = 0; k < nb; k++) ev.push({at:start + k*BEAT, clip:k % 2 ? 'broom_b' : 'broom_a', g:k % 2 ? .75 : 1, rate:jit()});
    } else if(job === 'fire'){
      ev.push({at:start, clip:'fire', g:1, rate:.97 + R()*.06});
      if(nb >= 4) ev.push({at:start + 3*BEAT, clip:'pot_b', g:.5, rate:jit() * .92});
    }
    /* the watchman makes no sound standing still: he looks at the dark */
    return ev;
  }

  /* ---------- the sound, on the screen's own context ---------- */
  var BUF = {}, LOAD = {}, JB = null, JBAC = null, duckOn = false, LOG = (window.__busyHeardLog = []);
  function sink(){ var H = window.BohemiaHeard; return H && H.sink ? H.sink() : null; }
  function jobsBus(k){
    if(JB && JBAC === k.AC) return JB;
    JBAC = k.AC; JB = k.AC.createGain(); JB.gain.value = 1; JB.connect(k.fx); return JB;
  }
  function load(AC, id){
    if(BUF[id]) return Promise.resolve(BUF[id]);
    if(LOAD[id]) return LOAD[id];
    return (LOAD[id] = fetch(DIR + id + '.mp3').then(function(r){ if(!r.ok) throw new Error(id + ' ' + r.status); return r.arrayBuffer(); })
      .then(function(ab){ return new Promise(function(res, rej){ AC.decodeAudioData(ab, res, rej); }); })
      .then(function(b){ BUF[id] = b; return b; }).catch(function(e){ delete LOAD[id]; LOG.push({err:String(e), id:id}); return null; }));
  }
  function panner(AC, pan){
    if(AC.createStereoPanner){ var p = AC.createStereoPanner(); p.pan.value = clamp(pan, -1, 1); return p; }
    var g = AC.createGain(); return g;   /* no panner on this phone: centred, never silent */
  }
  var PLAYING = [], MAX_AT_ONCE = 8;   /* the street's job sounds never hold more than eight voices of the phone's audio at once (rule 141(e)) */
  function playClip(k, id, when, gain, rate, pan){
    var AC = k.AC, b = BUF[id]; if(!b){ load(AC, id); return false; }   /* not in yet: this one is skipped, the next one plays */
    if(PLAYING.length >= MAX_AT_ONCE) return false;
    PLAYING.push(when + b.duration / rate + 0.02);
    var s = AC.createBufferSource(), g = AC.createGain(), p = panner(AC, pan);
    s.buffer = b; s.playbackRate.value = rate;
    g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(gain, when + 0.004);   /* born at zero: never a click */
    s.connect(g); g.connect(p); p.connect(jobsBus(k)); s.start(when); s.stop(when + b.duration / rate + 0.02);
    return true;
  }
  function duck(k, on){
    if(on === duckOn || !k) return; duckOn = on; var b = jobsBus(k), t = k.AC.currentTime;
    try{ b.gain.cancelScheduledValues(t); b.gain.setValueAtTime(b.gain.value, t); b.gain.linearRampToValueAtTime(on ? 0.35 : 1, t + 0.3); }catch(e){ b.gain.value = on ? 0.35 : 1; }
  }

  /* ---------- the squiggle: borrowed from the shell, or our own ---------- */
  var SQ = null, ownLoad = false, preloaded = false;
  function preload(k){ ['crate_a','crate_b','hammer_a','hammer_b','pot_a','pot_b','broom_a','broom_b','boot_a','boot_b','fire'].forEach(function(id){ load(k.AC, id); }); squiggle(k.AC); }
  function squiggle(AC){
    var M = window.BOH_VOICE_RECORDED; if(!M || !window.BOH_VOICE) return null;
    if(!SQ) SQ = M.make({dir:'voice_heard/'});
    if(SQ.ready()) return SQ;
    var T = null; try{ if(window.top && window.top !== window) T = window.top.SQUIGGLE || null; }catch(e){ T = null; }
    if(T){
      if(T.ready && T.ready() && T.idx && T.buf){ SQ.idx = T.idx; SQ.buf = T.buf; SQ.shift = T.shift || 0; M.NUM.GAIN_DB = T.idx.gain_db || 0; SQ.borrowed = true; return SQ; }
      return null;   /* the shell is loading it: wait, never a second copy */
    }
    if(!ownLoad && AC){ ownLoad = true; SQ.load(AC); }   /* opened alone (a gate, the judge page): its own copy */
    return SQ.ready() ? SQ : null;
  }

  /* ---------- the walkers' state across frames ---------- */
  var HOLD = false, W = {}, PASS = {}, live = [], lastTalk = -1e9, place = null, night = null, t0 = 0, openedAt = 0, dark = null;
  function reset(ctx, now){
    W = {}; PASS = {}; stopTalk(); lastTalk = now - 3000; place = ctx.place; night = ctx.night; openedAt = now;
    var R = rng(hash(ctx.place + ':dark:' + Math.floor(now / 60000)));
    dark = ctx.night && R() < .5 ? { at:now + 20000 + R()*40000, done:false, line:DARK_LINES[Math.floor(R()*DARK_LINES.length)], side:R() < .5 ? -1 : 1 } : null;
  }
  function stopTalk(){ live.forEach(function(h){ try{ h.stop(); }catch(e){} }); live = []; }
  function panOf(x, Wd){ return clamp((x - Wd/2) / (Wd/2), -1, 1) * 0.8; }
  function levelOf(w, Wd){ var g = 0.55 + 0.45 * clamp(w.py, 0, 1); if(w.x < -20 || w.x > Wd + 20) g *= 0.35; return g; }

  /* ONE MUTTER: who says what, when, at what level; null if nobody speaks */
  function mutter(k, now, a, b, ctx, R, greet){
    var S = squiggle(k && k.AC); if(!S || !k) return null;
    var BV = window.BOH_VOICE, AC = k.AC, nt = !!ctx.night;
    var L = greet ? (nt ? GREET_NIGHT : GREET_DAY) : nt ? NIGHT_LINES : DAY_LINES, A = nt ? NIGHT_ANSWERS : DAY_ANSWERS;
    var line = lineOf(L, a, R), mood = nt ? {arousal:-0.7, valence:-0.4} : undefined;
    var when = AC.currentTime + (t0 + Math.ceil((now - t0 + 60) / BEAT) * BEAT - now) / 1000;   /* on the next beat */
    var out = [];
    function say(who, text, at){
      var g = AC.createGain(); g.gain.value = (nt ? 0.20 : 0.34) * levelOf(who, ctx.W);
      var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = nt ? 2600 : 6000; lp.Q.value = 0.5;
      var p = panner(AC, panOf(who.x, ctx.W)); g.connect(lp); lp.connect(p); p.connect(k.fx);
      var h = S.say(text, BV.castVoice('face:' + who.look), AC, g, at, mood);
      if(h){ live.push(h); out.push({look:who.look, text:text, at:at, seconds:h.seconds, tail:h.tail, gain:g.gain.value, pan:+panOf(who.x, ctx.W).toFixed(2), recorded:!!h.recorded, night:nt}); }
      return h;
    }
    var h1 = say(a, line, when); if(!h1) return null;
    if(b && R() < (nt ? ANSWER.night : ANSWER.day)){
      var at2 = when + Math.min(h1.tail || h1.seconds, h1.seconds + 0.6) + 0.5; at2 = AC.currentTime + Math.ceil((at2 - AC.currentTime) / 0.5) * 0.5;   /* a beat after, on the grid */
      say(b, lineOf(A, b, R), at2);
    }
    return out;
  }
  /* the voice from the dark: nobody on the glass, far, at the very edge, once (night only) */
  function fromTheDark(k, now, ctx){
    var S = squiggle(k.AC); if(!S) return;
    var AC = k.AC, g = AC.createGain(); g.gain.value = 0.09;
    var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500; lp.Q.value = 0.7;
    var p = panner(AC, dark.side * 0.95); g.connect(lp); lp.connect(p); p.connect(k.fx);
    var h = S.say(dark.line, window.BOH_VOICE.castVoice('dark:' + ctx.place), AC, g, AC.currentTime + 0.05, {arousal:-0.9, valence:-0.8});
    dark.done = true;
    if(h){ live.push(h); LOG.push({t:now, kind:'dark', text:dark.line, seconds:h.seconds, pan:dark.side * 0.95, gain:0.09}); }
  }

  /* ONE FRAME. walkers: [{slot, look, x (on the glass), py (0 far .. 1 near), lane, walking, working, end, stop, drawn}];
     crowd: [{x, py, look}]; ctx: {W, night, open, place, t0, market, shown, unlocked}. opt.dry: no context, log what would play. */
  function tick(now, walkers, crowd, ctx, opt){
    opt = opt || {};
    if(HOLD && !opt.dry) return;   /* held for a measurement (the gate drives the clock itself) */
    if(!opt.dry && (!ctx.unlocked || !ctx.shown)){ if(live.length) stopTalk(); return; }   /* a phone plays nothing before a tap; a hidden frame is silent */
    var k = opt.dry ? null : sink(); if(!opt.dry && !k) return;
    if(k && !preloaded){ preloaded = true; preload(k); }   /* every clip in before the first stop, so the first crate is heard too */
    /* A FINISHED MUTTER IS LET GO (rule 141(e), Paolo 10/24: 'I just talked to everyone, and then it crashed'; measured: a handle
       kept every syllable's node alive until a sheet opened, about 25 nodes a mutter, so a town left open held them all) */
    if(k && live.length) live = live.filter(function(h){ return h.start == null || k.AC.currentTime < h.start + (h.tail || h.seconds || 0) + 0.25; });
    if(k) PLAYING = PLAYING.filter(function(t){ return t > k.AC.currentTime; });
    t0 = ctx.t0 || 0;
    if(ctx.place !== place || ctx.night !== night) reset(ctx, now);
    if(k) duck(k, !!ctx.open);
    if(ctx.open && live.length) stopTalk();   /* a sheet opened: the keeper is the one talking */
    var nt = !!ctx.night, trim = nt ? NIGHT_TRIM : 1, R0 = rng(hash(ctx.place + ':' + Math.floor(now / 1000)));
    walkers.forEach(function(w){
      if(!w.drawn) return;   /* a man not on the glass yet makes no sound */
      var st = W[w.slot] || (W[w.slot] = {q:[], was:null, step:-1, job:jobOf(w.slot, ctx.place, nt), n:0});
      var job = st.job, J = JOBS[job];
      /* he arrives at an end: the stop's events, from its first beat */
      if(w.working != null && st.was !== 'work'){
        var s0 = now - w.working, start = t0 + Math.ceil((s0 - t0) / BEAT) * BEAT, R = rng(hash(ctx.place + ':' + w.look + ':' + (st.n++)));
        stopEvents(job, start, w.stop - (start - s0), w.end, R).forEach(function(e){ if(e.at >= now - 40) st.q.push(e); });
      }
      st.was = w.working != null ? 'work' : 'walk';
      /* the watchman's boots, one a beat while he walks */
      if(job === 'guard' && w.walking != null){
        var next = Math.floor((now - t0) / BEAT) + 1, at = t0 + next * BEAT;
        if(at - now < AHEAD && next > st.step){ st.step = next; st.q.push({at:at, clip:next % 2 ? 'boot_a' : 'boot_b', g:.85 + R0()*.15, rate:.97 + R0()*.06}); }
      }
      /* play what is due, on the context's clock */
      var due = st.q.filter(function(e){ return e.at <= now + AHEAD; });
      st.q = st.q.filter(function(e){ return e.at > now + AHEAD; });
      due.forEach(function(e){
        if(e.at < now - 60) return;   /* the frame came too late for it: dropped, never played off the beat */
        var gain = J.gain * e.g * (job === 'guard' ? 1 : trim) * levelOf(w, ctx.W), pan = panOf(w.x, ctx.W);
        if(ONLY === 'talk') return;
        var played = opt.dry ? true : playClip(k, e.clip, Math.max(k.AC.currentTime, k.AC.currentTime + (e.at - now) / 1000 - ONSET), gain, e.rate, pan);
        LOG.push({t:e.at, kind:'job', job:job, clip:e.clip, look:w.look, gain:+gain.toFixed(4), pan:+pan.toFixed(2), on:w.x >= -20 && w.x <= ctx.W + 20, rate:+e.rate.toFixed(3), played:played, night:nt, beat:((e.at - t0) % BEAT + BEAT) % BEAT});
      });
    });
    if(LOG.length > 3000) LOG.splice(0, LOG.length - 3000);
    /* WHO PASSES WHOM: a walker crossing another, on his lane or across the street (a word called over), or going by a man
       who stands (the crowd, or a keeper at his door: the walker says it, the keeper keeps his voice for you, b is null) */
    var pairs = [];
    walkers.forEach(function(a, i){ if(!a.drawn) return;
      walkers.forEach(function(b, j){ if(j <= i || !b.drawn || Math.abs(a.py - b.py) > 0.25) return; pairs.push(['w' + a.slot + ':w' + b.slot, a.x - b.x, a, b]); });
      if(a.walking != null) (crowd || []).forEach(function(c, j){ if(Math.abs(c.py - a.py) < 0.08) pairs.push(['w' + a.slot + ':' + (c.keeper ? 'k' : 'c') + j, a.x - c.x, a, c.keeper ? null : c]); });
    });
    pairs.forEach(function(pr){
      var key = pr[0], sg = pr[1] < 0 ? -1 : 1, was = PASS[key];
      PASS[key] = sg;
      if(was == null || was === sg || Math.abs(pr[1]) > 40) return;
      /* they just crossed */
      var gap = nt ? GAP.night : ctx.market ? GAP.market : GAP.day;
      if(ctx.open || now - lastTalk < gap || ONLY === 'jobs') return;
      if(pr[2].x < 0 || pr[2].x > ctx.W) return;   /* off the glass: not for you */
      var R = rng(hash(ctx.place + ':' + key + ':' + Math.floor(now / BEAT)));
      if(R() >= (nt ? CHANCE.night : CHANCE.day)) return;
      lastTalk = now;
      var said = opt.dry ? [{look:pr[2].look, dry:true}] : mutter(k, now, pr[2], pr[3], ctx, R, /:k\d+$/.test(key));
      if(said) said.forEach(function(s){ s.t = now; s.kind = 'mutter'; s.who = key; LOG.push(s); });
    });
    if(nt && dark && !dark.done && now >= dark.at && !ctx.open){ if(opt.dry){ dark.done = true; LOG.push({t:now, kind:'dark', dry:true}); } else fromTheDark(k, now, ctx); }
  }

  window.BohemiaBusyHeard = {
    tick:tick, jobOf:jobOf, stopEvents:stopEvents, JOBS:JOBS, BEAT:BEAT, dir:DIR,
    log:function(){ return LOG.slice(); }, clear:function(){ LOG.length = 0; },
    reset:function(){ place = null; night = null; },
    squiggle:function(){ var s = SQ; return { have:!!(s && s.ready()), borrowed:!!(s && s.borrowed), err:s ? s.err : null }; },
    preload:function(){ var k = sink(); if(k) preload(k); },
    live:function(){ return live.length; }, hold:function(on){ HOLD = on !== false; if(HOLD) stopTalk(); },
    duck:function(){ return JB ? JB.gain.value : null; }, only:function(w){ ONLY = w || null; }, GAP:GAP
  };
})();
