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
  var AC = null, MASTER = null, BUF = {}, LOAD = {}, unlocked = false, isNight = false, shown = true;
  var log = (window.__heardLog = []);

  function vol(){ try{ var v = parseFloat(localStorage.getItem('bohemia_sfxvol')); if(v >= 0 && v <= 1) return v; }catch(e){} return 1; }
  function ac(){
    if(!AC){
      var C = window.AudioContext || window.webkitAudioContext; if(!C) return null;
      AC = new C(); MASTER = AC.createGain(); MASTER.gain.value = vol(); MASTER.connect(AC.destination);
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
  function play(id, mul){
    if(!ac()) return Promise.resolve(null);
    var m = (mul == null ? 1 : mul);
    log.push({id:id, mul:m, t:AC.currentTime});
    return load(id).then(function(b){
      var s = AC.createBufferSource(); s.buffer = b;
      var g = AC.createGain(); g.gain.value = m; s.connect(g); g.connect(MASTER); s.start();
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
      self.g.gain.linearRampToValueAtTime(level, AC.currentTime + 1.2); self.g.connect(MASTER);
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
      play(pool[Math.floor(Math.random() * pool.length)], 1);
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
  function visible(){
    if(gone || document.hidden) return false;
    try{ var fe = window.frameElement; if(fe && getComputedStyle(fe).display === 'none') return false; }catch(e){}
    return true;
  }
  function watch(){ var v = visible(); if(v !== shown){ shown = v; if(!v) closed(); bedNow(); } }
  setInterval(watch, 1000);
  document.addEventListener('visibilitychange', watch);
  function left(){ gone = true; watch(); }
  /* a new visit (the map posts OPEN with a place) brings the bed back once the frame shows again */
  window.addEventListener('message', function(e){ var d = e.data || {}; if(d.type === 'BOHEMIA_SETTLEMENT_OPEN' && d.place){ gone = false; setTimeout(watch, 50); } });

  window.BohemiaHeard = { opened:opened, closed:closed, handles:handles, event:event, night:night, left:left,
    taps:function(){ var o = {}; for(var k in TAPS) o[k] = TAPS[k]; return o; },
    state:function(){ return { unlocked:unlocked, shown:shown, night:isNight, bed:BED.id, murmur:MURMUR.id, open:openK, vol:vol() }; },
    dir:DIR, bedLevel:BED_LEVEL };
})();
