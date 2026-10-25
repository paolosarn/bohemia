/* BOHEMIA -- THE SETTLEMENT HEARD, LIVE (SOUNDS, 10/18, row [the settlement's sounds] round four).
   PAOLO 10/17, the thirteenth votes, UP on sounds-the-settlement-heard-whole-10-17: "Nice yeah... I just
   heard too many bird noises and insect noises... an economic apocalypse Las Vegas... doesn't sound like
   rainforest... but yeah, I like it." His UP plus his note is the ruling (NOTES ARE RULINGS, 7/19): the
   recordings go into the real screen, with the desert bed the note asked for (row [a desert, not a
   rainforest], 7e9e31b: 418.5 animal calls a minute down to 7.5, the crickets 6.9 dB down).

   WHAT IT DOES, loaded by slices/BOHEMIA_SETTLEMENT_SCREEN.html (one script tag, one line in its sfx()):
   - every building answers the tap that opens it with its own recording (the judge page's TAPS, unchanged);
   - the clinic's door, the stall's and the guns' buy and the bar's round come through the screen's own
     sfx() events and play the recording INSTEAD of the bank sound (handles() says which), never both;
   - the bar's murmur sits under the bar's sheet while it is open;
   - the desert bed (day or night by the screen's own view) sits under the whole screen, a far thing every
     20 to 50 s, never two at once; it starts on the first tap (a phone will not play before one) and fades
     out the moment the frame is hidden (the map's LEAVE hides it, it is never unloaded) or LEAVE is pressed;
   - at night every building sound is at the screen's own NIGHT_TRIM (0.5), passed in by the caller;
   - the player's sound volume from SETTINGS (localStorage bohemia_sfxvol, the alpha's one knob) scales it all.
   - 10/20 (SOUNDS, rule 122: 'the background ambience... has to go way down; anything volume wise, I should be
     seeing a slider for it in the settings'): this screen has its own audio, so the settings card never reached it.
     Now the bed, the murmur and the far things go through AMBIENCE (bohemia_mix.amb, far down by default, the
     card's AMBIENCE slider) and the building sounds through EFFECTS (bohemia_sfxvol, as before), both under ALL and
     MUTE (BOH_SETTINGS), and a move of any slider in the card is heard here at once (the storage event).
   The recordings are the 10/17 files in slices/vote/settlement_heard/ (CC0 Freesound clips through ESC-50,
   tools/bohemia_from_a_recording.py, every author and licence in manifest.json), referenced where they are,
   never copied (pages size). Gate: gates/settlement_heard_gate.js. */
(function(){
  'use strict';
  var DIR = 'vote/settlement_heard/';
  var BED_LEVEL = 0.7;          /* -3 dB under the judge page's level: the song plays over it in the game (his sixth votes: quieter) */
  var TAPS = { hall:'hall_who_wants_work', board:'board_nail', stall:'stall_can', barber:'barber_clippers', train:'yard_drill',
               arms:'arms_counter', smith:'smith_saw', armourer:'armourer_rivets', lot:'lot_scavenge', build:'build_hammer_and_saw' };
  var FAR = { day:['far_horn','far_helicopter','far_crow','far_rooster'], night:['far_siren','far_helicopter'] };
  var AC = null, MASTER = null, AMBG = null, OUT = null, HUSH = null, BUF = {}, LOAD = {}, unlocked = false, isNight = false, shown = true;
  var log = (window.__heardLog = []);

  function vol(){ try{ var v = parseFloat(localStorage.getItem('bohemia_sfxvol')); if(v >= 0 && v <= 1) return v; }catch(e){} return 1; }
  /* the shell's own taper (p^2.5) and defaults: AMBIENCE 0.4, ALL four steps of five, not muted */
  function taper(p){ p = Math.max(0, Math.min(1, +p || 0)); return p <= 0 ? 0 : Math.pow(p, 2.5); }
  function ambVol(){ try{ var m = JSON.parse(localStorage.getItem('bohemia_mix') || 'null'); if(m && typeof m.amb === 'number') return taper(m.amb); }catch(e){} return taper(0.4); }
  function allVol(){ try{ var d = JSON.parse(localStorage.getItem('BOH_SETTINGS') || 'null'); if(d){ if(d.muted) return 0; if(typeof d.vol === 'number') return Math.max(0, Math.min(5, d.vol)) / 5; } }catch(e){} return 0.8; }
  function levels(){
    if(!AC) return;
    var t = AC.currentTime;
    [[MASTER, vol()], [AMBG, ambVol()], [OUT, allVol()]].forEach(function(p){
      try{ p[0].gain.cancelScheduledValues(t); p[0].gain.setValueAtTime(p[0].gain.value, t); p[0].gain.linearRampToValueAtTime(p[1], t + 0.05); }catch(e){ p[0].gain.value = p[1]; }
    });
  }
  window.addEventListener('storage', function(e){ if(!e || /^(bohemia_mix|bohemia_sfxvol|BOH_SETTINGS)$/.test(e.key || '')) levels(); });
  function ac(){
    if(!AC){
      var C = window.AudioContext || window.webkitAudioContext; if(!C) return null;
      AC = new C(); OUT = AC.createGain(); OUT.gain.value = allVol();
      HUSH = AC.createGain(); HUSH.gain.value = shown ? 1 : 0; HUSH_TO = shown ? 1 : 0; OUT.connect(HUSH); HUSH.connect(AC.destination);   /* 10/25: zero the moment the frame hides */
      MASTER = AC.createGain(); MASTER.gain.value = vol(); MASTER.connect(OUT);
      AMBG = AC.createGain(); AMBG.gain.value = ambVol(); AMBG.connect(OUT);
    }
    if(AC.state === 'suspended') try{ AC.resume(); }catch(e){}
    return AC;
  }
  function load(id){
    if(BUF[id]) return Promise.resolve(BUF[id]);
    if(LOAD[id]) return LOAD[id];
    return (LOAD[id] = fetch(DIR + id + '.mp3').then(function(r){ if(!r.ok) throw new Error(id + ' ' + r.status); return r.arrayBuffer(); })
      .then(function(ab){ return new Promise(function(res, rej){ ac().decodeAudioData(ab, res, rej); }); })
      .then(function(b){ BUF[id] = b; return b; })
      .catch(function(e){ delete LOAD[id]; log.push({id:id, err:String(e)}); throw e; }));
  }
  function play(id, mul, amb){
    if(!ac()) return Promise.resolve(null);
    var m = (mul == null ? 1 : mul);
    log.push({id:id, mul:m, t:AC.currentTime});
    return load(id).then(function(b){
      var s = AC.createBufferSource(); s.buffer = b;
      var g = AC.createGain(); g.gain.value = m; s.connect(g); g.connect(amb ? AMBG : MASTER); s.start();
      return s;
    }).catch(function(){ return null; });
  }

  /* THE LOOP: two copies of a loop-ready file overlapped by one second, equal-power, so the codec's padding never clicks */
  function Loop(){ this.id = null; this.timer = null; this.g = null; }
  Loop.prototype.start = function(id, level){
    var self = this; if(this.id === id) return; this.stop(); this.id = id;
    if(!ac()) return;
    load(id).then(function(b){
      if(self.id !== id) return;
      self.g = AC.createGain(); self.g.gain.setValueAtTime(0, AC.currentTime);
      self.g.gain.linearRampToValueAtTime(level, AC.currentTime + 1.2); self.g.connect(AMBG);   /* the bed and the murmur are AMBIENCE (10/20) */
      var XF = 1.0, step = b.duration - XF;
      (function one(at){
        if(self.id !== id) return;
        var s = AC.createBufferSource(); s.buffer = b; var g = AC.createGain(); s.connect(g); g.connect(self.g);
        g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(1, at + XF);
        g.gain.setValueAtTime(1, at + b.duration - XF); g.gain.linearRampToValueAtTime(0, at + b.duration);
        s.start(at);
        self.timer = setTimeout(function(){ one(at + step); }, Math.max(100, (at + step - AC.currentTime - 0.5) * 1000));
      })(AC.currentTime + 0.05);
    }).catch(function(){});
  };
  Loop.prototype.stop = function(){
    this.id = null; if(this.timer) clearTimeout(this.timer); this.timer = null;
    var g = this.g; this.g = null;
    if(g && AC){ try{ g.gain.cancelScheduledValues(AC.currentTime); g.gain.setValueAtTime(g.gain.value, AC.currentTime); g.gain.linearRampToValueAtTime(0, AC.currentTime + 0.6); }catch(e){}
      setTimeout(function(){ try{ g.disconnect(); }catch(e){} }, 900); }
  };

  var BED = new Loop(), MURMUR = new Loop(), farTimer = null, openK = null;
  function farNext(){
    if(farTimer) clearTimeout(farTimer);
    farTimer = setTimeout(function(){
      if(!BED.id) return;
      var pool = isNight ? FAR.night : FAR.day;
      play(pool[Math.floor(Math.random() * pool.length)], 1, true);   /* a far thing is AMBIENCE (10/20) */
      farNext();
    }, 20000 + Math.random() * 30000);
  }
  function bedNow(){
    if(!unlocked || !shown){ BED.stop(); MURMUR.stop(); if(farTimer) clearTimeout(farTimer); farTimer = null; return; }
    BED.start(isNight ? 'bed_night' : 'bed_day', BED_LEVEL);
    if(!farTimer) farNext();
  }

  /* WHO IS OPEN: the screen tells us (opened(k), closed()); the bar's murmur lives while its sheet is open */
  function opened(k, mul){
    if(k === openK) return;
    var was = openK; openK = k;
    if(was === 'bar') MURMUR.stop();
    if(k === 'bar'){ if(ac()) MURMUR.start('bed_bar_murmur', mul == null ? 1 : mul); return; }
    if(TAPS[k]) play(TAPS[k], mul);
  }
  function closed(){ if(openK === 'bar') MURMUR.stop(); openK = null; }

  /* THE SCREEN'S OWN EVENTS: the recording replaces the bank sound for these four, so the parent is not told */
  function handles(ev){ return ev === 'door_open' || ev === 'door_shut' || ev === 'pickup' || ev === 'bar_glass'; }
  function event(ev, mul){
    if(ev === 'door_open') play('clinic_door_open', mul);
    else if(ev === 'door_shut') play('clinic_door_shut', mul);
    else if(ev === 'pickup') play(openK === 'stall' ? 'stall_buy' : 'arms_counter', mul);
    else if(ev === 'bar_glass') play('bar_round', mul);
  }
  function night(n){ n = !!n; if(n === isNight) return; isNight = n; if(BED.id) { BED.stop(); bedNow(); } }

  /* the first tap unlocks the sound (a phone plays nothing before one); then the bed comes in */
  function unlock(){ if(unlocked) return; unlocked = true; ac(); bedNow(); }
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);
  /* HIDDEN IS SILENT: the map hides this frame on LEAVE (display:none), it never unloads it, so the bed would
     play on over the map. Read the frame's own display once a second (same origin), and the tab's visibility. */
  var gone = false;   /* LEAVE was pressed: silent until the map posts the next visit */
  /* SOUNDS 10/25 (rule 164 item 19, Paolo on his PC: 'even when I left the city I was still hearing them'): hidden means the
     frame OR any frame around it (the map's frame holds this one), and it is known THE MOMENT it happens, not a second later:
     the frame's own style is watched, and everything this screen plays goes to zero in 30 ms (HUSH, after ALL), the walkers'
     mutters included (they ride this context); the shell's floor is told so a line the shell said for a man here fades too */
  function visible(){
    if(gone || document.hidden) return false;
    try{ var x = window, n = 0;
      while(x && x !== x.parent && n++ < 8){ var fe = x.frameElement; if(!fe) break; if(!fe.isConnected) return false;
        var cs = fe.ownerDocument.defaultView.getComputedStyle(fe); if(cs.display === 'none' || cs.visibility === 'hidden') return false; x = x.parent; } }catch(e){}
    return true;
  }
  var HUSH_TO = 1;   /* where HUSH is going (an idle node's .value is not recomputed in Chromium, so the state says the target) */
  function hush(on){
    HUSH_TO = on ? 0 : 1;
    if(!AC || !HUSH) return; var t = AC.currentTime;
    try{ HUSH.gain.cancelScheduledValues(t); HUSH.gain.setValueAtTime(HUSH.gain.value, t); HUSH.gain.linearRampToValueAtTime(on ? 0 : 1, t + (on ? 0.03 : 0.25)); }catch(e){ HUSH.gain.value = on ? 0 : 1; }
  }
  function watch(){ var v = visible(); if(v !== shown){ shown = v; hush(!v); if(!v){ closed(); try{ if(window.BOH_VOICE_RECORDED) BOH_VOICE_RECORDED.floor.sweep(); }catch(e){} } bedNow(); } }
  setInterval(watch, 250);
  document.addEventListener('visibilitychange', watch);
  try{ var FE = window.frameElement; if(FE && window.MutationObserver) new MutationObserver(watch).observe(FE, { attributes:true, attributeFilter:['style', 'class', 'hidden'] }); }catch(e){}
  function left(){ gone = true; watch(); }
  /* a new visit (the map posts OPEN with a place) brings the bed back once the frame shows again */
  window.addEventListener('message', function(e){ var d = e.data || {}; if(d.type === 'BOHEMIA_SETTLEMENT_OPEN' && d.place){ gone = false; setTimeout(watch, 50); } });

  window.BohemiaHeard = { opened:opened, closed:closed, handles:handles, event:event, night:night, left:left,
    taps:function(){ var o = {}; for(var k in TAPS) o[k] = TAPS[k]; return o; },
    /* RUN TWO [the busy town talks] 10/24: the walkers' jobs and mutters play on this one context, through EFFECTS, ALL and MUTE (slices/bohemia_busy_heard.js) */
    sink:function(){ return (unlocked && ac()) ? { AC:AC, fx:MASTER, amb:AMBG } : null; },
    state:function(){ return { unlocked:unlocked, shown:shown, night:isNight, bed:BED.id, murmur:MURMUR.id, open:openK, vol:vol(), amb:ambVol(), all:allVol(),
      live:AC ? { fx:MASTER.gain.value, amb:AMBG.gain.value, all:OUT.gain.value, hush:HUSH ? HUSH_TO : null } : null }; },
    dir:DIR, bedLevel:BED_LEVEL };
})();
