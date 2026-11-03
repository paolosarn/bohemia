/* BOHEMIA -- THE KILL CAMS SWITCH, IN THE GAME'S OWN SETTINGS  (COMBAT 7 11/3/26, rule 379, ask line 408)

   PAOLO 11/3: 'Kill cams came in like ugly dogshit, they are far from final, let's have a kill cam setting while you still work on it,
   it's fucking with the visuals they are that bad. Toggle kill cams on or off.'

   WHAT THIS IS: one row, KILL CAMS, ON / OFF, on the game's ONE settings card behind the gear (#setcard, dressed by
   bohemia_settings.js), under the FIGHTS row, built the way slices/bohemia_difficulty.js builds its row. DEFAULT OFF (rule 379(b)):
   they stay off until he says they are good. ONE TRUTH: localStorage 'bohemia.killcams.v1' ('on' or nothing); the fight
   (slices/BOHEMIA_FIGHT.html killCamsOn) reads the same key at every kill, so a tap holds from the next kill; with it off killCut
   never runs and nothing on the board changes. The words are draft:true. Not on the start screen: the row hides while the card is
   opened from it (body.setatstart), as FIGHTS does. */
(function () {
  'use strict';
  var KEY = 'bohemia.killcams.v1';
  function el(id) { return document.getElementById(id); }
  function on() { try { return localStorage.getItem(KEY) === 'on'; } catch (e) { return false; } }
  function set(v) {
    try { if (v) localStorage.setItem(KEY, 'on'); else localStorage.removeItem(KEY); } catch (e) {}
    var msg = { type: 'BOHEMIA_KILLCAMS', on: !!v };
    Array.prototype.forEach.call(document.querySelectorAll('iframe'), function (f) { try { if (f.contentWindow) f.contentWindow.postMessage(msg, '*'); } catch (e) {} });
    paint(); return on();
  }
  function paint() {
    var host = el('setcams'); if (!host) return;
    var v = on() ? 'on' : 'off';
    Array.prototype.forEach.call(host.children, function (b) { b.classList.toggle('on', b.getAttribute('data-k') === v); });
    var s = el('setcamssay'); if (s) s.textContent = v === 'on' ? 'A KILL HOLDS THE PICTURE A BEAT OR TWO. STILL BEING REWORKED.' : 'NO KILL CAM. THE FIGHT NEVER STOPS FOR ONE.';
  }
  function row() {
    var card = el('setcard'); if (!card || el('setcams')) return !!card;
    var r = document.createElement('div'); r.className = 'setrow setcamsrow';
    var l = document.createElement('span'); l.className = 'setlab'; l.textContent = 'KILL CAMS'; r.appendChild(l);
    var host = document.createElement('div'); host.id = 'setcams';
    [['on', 'ON'], ['off', 'OFF']].forEach(function (k) {
      var b = document.createElement('div'); b.className = 'setbtn'; b.setAttribute('role', 'button'); b.setAttribute('tabindex', '0');
      b.setAttribute('data-k', k[0]); b.textContent = k[1];
      b.addEventListener('click', function (e) { e.stopPropagation(); set(k[0] === 'on'); });
      host.appendChild(b);
    });
    r.appendChild(host);
    var say = document.createElement('div'); say.id = 'setcamssay';
    /* under FIGHTS, where the fight's settings are; else before the game's own row, else at the end */
    var after = el('setdiffsay'), game = el('setsave') ? el('setsave').parentNode : null;
    if (after && after.parentNode === card) { card.insertBefore(say, after.nextSibling); card.insertBefore(r, say); }
    else if (game && game.parentNode === card) { card.insertBefore(r, game); card.insertBefore(say, game); }
    else { card.appendChild(r); card.appendChild(say); }
    paint(); return true;
  }
  function look() {
    if (el('setcams-look')) return;
    var CSS = ''
      + '#setcams{flex:1;display:flex;gap:4px;min-width:0}'
      + '#setcams .setbtn{flex:1;min-width:0;padding:0 6px!important;justify-content:flex-start!important;text-align:left!important;font-size:10px!important;letter-spacing:.4px!important;opacity:.62}'
      + '#setcams .setbtn.on{opacity:1;box-shadow:inset 0 -3px 0 #a8752c!important}'
      + '#setcamssay{margin:-2px 0 10px 90px;font-family:"BohemiaROM",ui-monospace,monospace;font-size:10px;letter-spacing:.4px;line-height:1.4;color:#e6d8bd;text-shadow:0 1px 0 #000}'
      + 'body.setatstart .setcamsrow,body.setatstart #setcamssay{display:none!important}';
    var st = document.createElement('style'); st.id = 'setcams-look'; st.textContent = CSS; document.head.appendChild(st);
  }
  function boot() {
    look(); row();
    var g = el('gearbtn'); if (g && !g.__setCams) { g.__setCams = 1; g.addEventListener('click', function () { setTimeout(function () { row(); paint(); }, 0); }); }
  }
  window.BohemiaKillCams = { on: on, set: set, KEY: KEY };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
