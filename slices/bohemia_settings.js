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
   NOT HERE: a narrator switch. There is no narrator in the game yet (SOUNDS builds it); a switch that
   moves nothing is a fake control, so it waits for the voice. */
(function () {
  'use strict';
  var KEY = 'boh.brightness', STEPS = 5, LEVELS = [0, 0.25, 0.5, 0.75, 1];
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
  function nearest(v) { var best = 0; for (var i = 1; i < LEVELS.length; i++) if (Math.abs(LEVELS[i] - v) < Math.abs(LEVELS[best] - v)) best = i; return best; }
  function paint() {
    var mix = null; try { mix = window.getMix ? window.getMix() : null; } catch (e) {}
    var set = function (id, lit) { var h = el(id); if (!h) return; for (var k = 0; k < h.children.length; k++) h.children[k].classList.toggle('lit', k <= lit && lit >= 0); };
    if (mix) { set('setmusic', mix.music > 0 ? nearest(mix.music) : -1); set('setsfx', mix.sfx > 0 ? nearest(mix.sfx) : -1); }
    set('setbright', step());
    var cv = document.querySelector('#setcalib canvas'); if (cv) calib(cv, step());
  }
  function rows() {
    var card = el('setcard'); if (!card || el('setbright')) return !!card;
    var anchor = el('settext') ? el('settext').parentNode : null;
    var mus = row('MUSIC', bars('setmusic', 5, function (k) { if (window.setMusicVolume) window.setMusicVolume(LEVELS[k]); }));
    var sfx = row('SOUNDS', bars('setsfx', 5, function (k) { if (window.setEffectsVolume) window.setEffectsVolume(LEVELS[k]); }));
    var bri = row('BRIGHT', bars('setbright', STEPS, function (k) { try { ls().setItem(KEY, String(k)); } catch (e) {} publish(); }));
    var cal = document.createElement('div'); cal.id = 'setcalib';
    cal.innerHTML = '<canvas width="96" height="48"></canvas><span>SLIDE UNTIL YOU<br>CAN JUST SEE HIM</span>';
    var vol = el('setvol') ? el('setvol').parentNode : null;
    if (vol && vol.nextSibling) { card.insertBefore(mus, vol.nextSibling); card.insertBefore(sfx, mus.nextSibling); }
    else { card.appendChild(mus); card.appendChild(sfx); }
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
      + 'html body #setcard .setlab{flex:0 0 62px;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:12px;letter-spacing:1.4px;color:#f0e2c4;text-align:left;text-shadow:0 1px 0 #000}'
      + 'html body #setcard .setbars{gap:4px}'
      + 'html body #setcard .setbars .vb{min-height:44px;border-radius:2px;border:1px solid #0d0a07;background:#15110d var(--set-glass) center/cover;'
      +   'box-shadow:inset 0 1px 0 rgba(255,255,255,.10)}'
      + 'html body #setcard .setbars .vb.lit{background:linear-gradient(#e8b85e,#a8752c);border-color:#0d0a07;box-shadow:inset 0 1px 0 rgba(255,240,200,.6),inset 0 -2px 0 rgba(70,40,10,.55)}'
      + 'html body #setcard .setbtn{min-height:44px;border:0;border-radius:0;justify-content:flex-start;text-align:left;padding:0 12px;'
      +   'font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:12px;letter-spacing:1.2px;color:#2a221a;background:#e2dac6 var(--set-rec) center/100% 100%;'
      +   'box-shadow:none;filter:drop-shadow(0 1px 0 rgba(0,0,0,.8))}'
      + 'html body #setcard .setbtn.wide{margin-top:8px;width:100%}'
      + '#setcalib{display:flex;align-items:center;gap:10px;margin:-2px 0 10px 72px}'
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
