/* BOHEMIA -- SETTINGS, IN OUR MATERIALS, WITH BRIGHTNESS  (UI lane 11, [settings and the slider], 10/4/26)

   RULE 73 (Paolo 10/4: 'if I'm on my phone full brightness and outside, I should still be able to play'):
   BRIGHTNESS with the calibration picture (a dark figure on a dark ground, 'slide until you can just see
   him') that raises the night's floor and never lowers the day. RULE 66: SETTINGS is one of the start
   screen's three doors; RUN builds the start screen and wires its button to BohemiaSettings.open().
   RULE 67/71: the panel was a flat dark rounded card with centred words, the slop he named.

   WHAT THIS IS: the game's ONE settings card (the one behind the gear, #setwrap/#setcard, owned by the
   shell's settings module: sound, mute, text, motion, events, vote, save, quit), not a second one. This
   file only DRESSES it and ADDS rows:
     MUSIC and SOUNDS   two five-step levels on the hooks the mix already exposes (setMusicVolume,
                        setEffectsVolume, getMix: bohemia_mix), so there is still one owner per gain
     BRIGHT             five steps, kept in boh.brightness; step 0 is the game as drawn. Published as
                        window.BOH_BRIGHTNESS {step, lift} and posted to every frame as
                        {type:'BOHEMIA_BRIGHTNESS', step, lift}, again whenever a frame loads. The night
                        passes READ it (COMBAT [night you can read], RUN's map night pass): this file does
                        not filter any world canvas (R10, grime is baked, never a filter).
   The look: cardboard taped to the glass, the title on a receipt strip, labels stamped in CASING from the
   left, steps as cracked glass that lights amber, buttons as receipt tags read from the left, a hard
   one-pixel contact edge instead of a soft shadow. Every control 44 points. The board is darkened a third
   under the words: on the bare cardboard a label read 8.8:1 indoors and 4.4:1 in the sun test (rule 73).
   10/20 (SOUNDS, rule 122: 'anything volume wise, I should be seeing a slider for it in the settings'): MUSIC,
   AMBIENCE and EFFECTS are SLIDERS now, dragged, not five steps: each moves the mix's own knob live as the finger
   moves (setMusicVolume, setAmbienceVolume, setEffectsVolume) and is saved in bohemia_mix when it is let go.
   The track is the card's cracked glass, the filled part lights amber, the handle is a 44-point receipt tag.
   NOT HERE: a narrator switch. There is no narrator in the game yet (SOUNDS builds it); a switch that
   moves nothing is a fake control, so it waits for the voice. */
(function () {
  'use strict';
  var KEY = 'boh.brightness', STEPS = 5;
  function el(id) { return document.getElementById(id); }
  function ls() { try { return window.localStorage; } catch (e) { return null; } }

  /* ---- BRIGHTNESS ---- */
  function step() { var v = 0; try { v = parseInt(ls().getItem(KEY) || '0', 10) | 0; } catch (e) {} return Math.max(0, Math.min(STEPS - 1, v)); }
  function lift(s) { return +(s * 0.06).toFixed(2); }
  function publish() {
    var s = step(), msg = { type: 'BOHEMIA_BRIGHTNESS', step: s, lift: lift(s) };
    window.BOH_BRIGHTNESS = { step: s, lift: msg.lift };
    Array.prototype.forEach.call(document.querySelectorAll('iframe'), function (f) { try { if (f.contentWindow) f.contentWindow.postMessage(msg, '*'); } catch (e) {} });
  }
  /* the calibration picture: a dark man on a dark street, drawn with the lift applied. The floor rises
     under the darkest values only (a value near black gains the most, white gains nothing). */
  function calib(cv, s) {
    var g = cv.getContext('2d'), w = cv.width, h = cv.height, L = lift(s);
    var up = function (v) { return Math.round(v + (255 - v) * L * (1 - v / 255)); };
    var col = function (r, gg, b) { return 'rgb(' + up(r) + ',' + up(gg) + ',' + up(b) + ')'; };
    g.fillStyle = col(14, 15, 20); g.fillRect(0, 0, w, h);
    g.fillStyle = col(22, 22, 26); g.fillRect(0, Math.round(h * .62), w, h);
    g.fillStyle = col(31, 30, 33); g.fillRect(0, Math.round(h * .62), w, 1);
    var X = Math.round(w * .5), Y = Math.round(h * .62);
    g.fillStyle = col(27, 26, 29);
    g.fillRect(X - 2, Y - 22, 5, 5); g.fillRect(X - 3, Y - 16, 7, 10); g.fillRect(X - 3, Y - 6, 3, 6); g.fillRect(X + 1, Y - 6, 3, 6);
  }

  /* ---- THE ROWS ---- */
  function bars(id, n, onPick) {
    var host = document.createElement('div'); host.id = id; host.className = 'setbars';
    for (var i = 0; i < n; i++) {
      var d = document.createElement('div'); d.className = 'vb'; d.setAttribute('role', 'button'); d.setAttribute('tabindex', '0');
      d.setAttribute('aria-label', id.replace('set', '') + ' ' + (i + 1));
      (function (k) { d.addEventListener('click', function () { onPick(k); paint(); }); })(i);
      host.appendChild(d);
    }
    return host;
  }
  function row(label, node) {
    var r = document.createElement('div'); r.className = 'setrow';
    var l = document.createElement('span'); l.className = 'setlab'; l.textContent = label; r.appendChild(l); r.appendChild(node); return r;
  }
  /* THE SLIDERS (SOUNDS 10/20, rule 122). One range input per knob; the filled part is drawn by --p. */
  function slider(id, key, setter) {
    var host = document.createElement('div'); host.id = id; host.className = 'setslide';
    var i = document.createElement('input'); i.type = 'range'; i.min = '0'; i.max = '100'; i.step = '1';
    i.setAttribute('aria-label', id.replace('set', '') + ' volume');
    var n = document.createElement('span'); n.className = 'setnum';
    var show = function () { i.style.setProperty('--p', i.value + '%'); n.textContent = i.value; };
    i.addEventListener('input', function () { show(); var f = window[setter]; if (f) f((+i.value) / 100); });
    host.appendChild(i); host.appendChild(n);
    host.__key = key; host.__show = show;
    return host;
  }
  function paint() {
    var mix = null; try { mix = window.getMix ? window.getMix() : null; } catch (e) {}
    var set = function (id, lit) { var h = el(id); if (!h) return; for (var k = 0; k < h.children.length; k++) h.children[k].classList.toggle('lit', k <= lit && lit >= 0); };
    if (mix) ['setmusic', 'setamb', 'setsfx'].forEach(function (id) {
      var h = el(id), i = h && h.querySelector('input'); if (!i || typeof mix[h.__key] !== 'number') return;
      if (document.activeElement !== i) i.value = String(Math.round(mix[h.__key] * 100)); h.__show();
    });
    set('setbright', step());
    var cv = document.querySelector('#setcalib canvas'); if (cv) calib(cv, step());
  }
  function rows() {
    var card = el('setcard'); if (!card || el('setbright')) return !!card;
    var anchor = el('settext') ? el('settext').parentNode : null;
    var mus = row('MUSIC', slider('setmusic', 'music', 'setMusicVolume'));
    var amb = row('AMBIENCE', slider('setamb', 'amb', 'setAmbienceVolume'));
    var sfx = row('EFFECTS', slider('setsfx', 'sfx', 'setEffectsVolume'));
    var bri = row('BRIGHT', bars('setbright', STEPS, function (k) { try { ls().setItem(KEY, String(k)); } catch (e) {} publish(); }));
    var cal = document.createElement('div'); cal.id = 'setcalib';
    cal.innerHTML = '<canvas width="96" height="48"></canvas><span>SLIDE UNTIL YOU<br>CAN JUST SEE HIM</span>';
    var vol = el('setvol') ? el('setvol').parentNode : null;
    if (vol && vol.nextSibling) { card.insertBefore(mus, vol.nextSibling); card.insertBefore(amb, mus.nextSibling); card.insertBefore(sfx, amb.nextSibling); }
    else { card.appendChild(mus); card.appendChild(amb); card.appendChild(sfx); }
    if (anchor && anchor.nextSibling) { card.insertBefore(bri, anchor.nextSibling); card.insertBefore(cal, bri.nextSibling); }
    else { card.appendChild(bri); card.appendChild(cal); }
    var lab = vol && vol.querySelector('.setlab'); if (lab && lab.textContent === 'SOUND') lab.textContent = 'ALL';
    paint(); return true;
  }

  /* ---- THE LOOK ---- */
  function look() {
    if (el('set-look')) return;
    var M = window.BohemiaMaterials, url = function (c) { return 'url(' + c.toDataURL('image/png') + ')'; };
    var cb = '', rc = '', gl = '', tp = '';
    try { if (M) { cb = url(M.cardboard()); rc = url(M.receipt()); gl = url(M.glass()); tp = url(M.tape()); } } catch (e) {}
    var R = document.documentElement.style;
    if (cb) { R.setProperty('--set-card', cb); R.setProperty('--set-rec', rc); R.setProperty('--set-glass', gl); R.setProperty('--set-tape', tp); }
    var CSS = ''
      + 'html body #setwrap{background:rgba(6,5,4,.78)}'
      + 'html body #setcard{position:relative;width:min(94%,360px);max-height:calc(100% - 24px);overflow-y:auto;border:0;border-radius:2px;padding:30px 14px 16px;'
      +   'background:linear-gradient(rgba(12,8,4,.34),rgba(12,8,4,.34)),#3a2c1e var(--set-card) 0 0/256px 100% repeat-x;box-shadow:inset 0 2px 0 rgba(255,225,180,.16),inset 0 -2px 0 rgba(0,0,0,.6),0 1px 0 #000;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;scrollbar-width:none}'
      + 'html body #setcard::-webkit-scrollbar{display:none}'
      + 'html body #setcard::before{content:"";position:absolute;top:2px;left:22px;width:70px;height:18px;background:var(--set-tape) center/100% 100%;transform:rotate(-4deg)}'
      + 'html body #setcard::after{content:"";position:absolute;top:2px;right:26px;width:62px;height:18px;background:var(--set-tape) center/100% 100%;transform:rotate(3deg)}'
      + 'html body #setcard .seth{display:inline-block;margin:0 0 14px;padding:5px 10px 7px;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:14px;letter-spacing:2px;'
      +   'color:#2a221a;background:#e2dac6 var(--set-rec) center/100% 100%;transform:rotate(-1deg);filter:drop-shadow(0 1px 0 rgba(0,0,0,.8))}'
      + 'html body #setcard .setrow{gap:10px;margin-bottom:8px}'
      + 'html body #setcard .setlab{flex:0 0 80px;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:12px;letter-spacing:1.4px;color:#f0e2c4;text-align:left;text-shadow:0 1px 0 #000}'
      + 'html body #setcard .setbars{gap:4px}'
      + 'html body #setcard .setbars .vb{min-height:44px;border-radius:2px;border:1px solid #0d0a07;background:#15110d var(--set-glass) center/cover;'
      +   'box-shadow:inset 0 1px 0 rgba(255,255,255,.10)}'
      + 'html body #setcard .setbars .vb.lit{background:linear-gradient(#e8b85e,#a8752c);border-color:#0d0a07;box-shadow:inset 0 1px 0 rgba(255,240,200,.6),inset 0 -2px 0 rgba(70,40,10,.55)}'
      + 'html body #setcard .setbtn{min-height:44px;border:0;border-radius:0;justify-content:flex-start;text-align:left;padding:0 12px;'
      +   'font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:12px;letter-spacing:1.2px;color:#2a221a;background:#e2dac6 var(--set-rec) center/100% 100%;'
      +   'box-shadow:none;filter:drop-shadow(0 1px 0 rgba(0,0,0,.8))}'
      + 'html body #setcard .setbtn.wide{margin-top:8px;width:100%}'
      /* the sliders: the track is the cracked glass, the part under the finger's side lights amber, the handle is a receipt tag */
      + 'html body #setcard .setslide{flex:1;display:flex;align-items:center;gap:8px;min-height:44px}'
      + 'html body #setcard .setslide input{flex:1;min-width:0;height:44px;margin:0;-webkit-appearance:none;appearance:none;background:transparent;touch-action:pan-y}'
      + 'html body #setcard .setslide input::-webkit-slider-runnable-track{height:16px;border:1px solid #0d0a07;border-radius:2px;'
      +   'background:linear-gradient(90deg,#e8b85e,#a8752c) 0 0/var(--p,50%) 100% no-repeat,#15110d var(--set-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,255,255,.10)}'
      + 'html body #setcard .setslide input::-moz-range-track{height:16px;border:1px solid #0d0a07;border-radius:2px;background:#15110d var(--set-glass) center/cover}'
      + 'html body #setcard .setslide input::-moz-range-progress{height:16px;background:linear-gradient(90deg,#e8b85e,#a8752c)}'
      + 'html body #setcard .setslide input::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:40px;margin-top:-13px;border:0;border-radius:0;'
      +   'background:#e2dac6 var(--set-rec) center/100% 100%;filter:drop-shadow(0 1px 0 rgba(0,0,0,.8))}'
      + 'html body #setcard .setslide input::-moz-range-thumb{width:26px;height:40px;border:0;border-radius:0;background:#e2dac6 var(--set-rec) center/100% 100%}'
      + 'html body #setcard .setnum{flex:0 0 26px;text-align:right;font-family:"BohemiaROM",ui-monospace,monospace;font-size:11px;color:#f0e2c4;text-shadow:0 1px 0 #000}'
      + '#setcalib{display:flex;align-items:center;gap:10px;margin:-2px 0 10px 90px}'
      + '#setcalib canvas{width:96px;height:48px;image-rendering:pixelated;border:1px solid #0d0a07}'
      + '#setcalib span{font-family:"BohemiaROM",ui-monospace,monospace;font-size:10px;letter-spacing:.6px;color:#e6d8bd;line-height:1.4;text-shadow:0 1px 0 #000}'
      /* opened from the start screen (before BEGIN): above the door, nothing to save or quit */
      + 'body.setatstart #setwrap{z-index:260}body.setatstart #setcard .setrow:has(#setsave){display:none}';
    var st = document.createElement('style'); st.id = 'set-look'; st.textContent = CSS; document.head.appendChild(st);
  }

  /* ---- THE DOOR FOR THE START SCREEN (RUN wires its SETTINGS button here) ---- */
  function open(opts) {
    var w = el('setwrap'); if (!w) return false;
    rows();
    if (w.parentNode !== document.body) document.body.appendChild(w);   /* out of #app, hidden until BEGIN */
    var atStart = !!(opts && opts.atStart);
    document.body.classList.toggle('setatstart', atStart);
    var cb = el('setclose');
    if (cb) { if (atStart && !cb.__was) { cb.__was = cb.textContent; cb.textContent = 'BACK'; } else if (!atStart && cb.__was) { cb.textContent = cb.__was; cb.__was = null; } }
    var g = el('gearbtn'); if (g) g.click();
    if (!w.classList.contains('on')) { w.classList.add('on'); w.setAttribute('aria-hidden', 'false'); }
    paint(); return true;
  }

  function boot() {
    look(); rows(); publish();
    /* the gear's own open repaints its rows; ours repaint on the same tap */
    var g = el('gearbtn'); if (g && !g.__setLook) { g.__setLook = 1; g.addEventListener('click', function () { setTimeout(function () { rows(); paint(); }, 0); }); }
    /* a frame that loads later (the city, the fight, the settlement) is told the brightness too */
    document.addEventListener('load', function (e) { if (e.target && e.target.tagName === 'IFRAME') publish(); }, true);
  }
  window.BohemiaSettings = { open: open, publish: publish, brightness: step, lift: lift, calib: calib };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
