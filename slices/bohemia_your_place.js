/* ==========================================================================================================
   YOUR PLACE, ON THE GLASS, SAID BY A FACE  (HOME BASE 6, 11/27/26; VAMILY rule 492(a)(b), plan C and B of
   records/BOHEMIA_HOME_BASE_YOUR_PLACE_WALKED_AS_A_STRANGER_11_27_26.md)

   PAOLO 11/27: 'the settlement stuff on my phone was so freaking confusing... I thought it'd be more intuitive and easy to
   navigate'; then 'build the easy shit man'. MEASURED BEFORE (the stranger's walk): the whole flow lived on the in-game phone's
   100 px page in 8 px letters with 18 px buttons, and nothing said the next step: not what PLANT is, not 'plant it' on arrival,
   not 'go in', not 'tap an empty lot'.

   NOW: the flow is on the map's glass, beside the phone, under the thumb: his crew's best man (his face, his name, his mouth on
   the beat) says the ONE next thing and the button for it is right there, 48 px tall, gold for the one next thing:
     day 2 on the map   'We need ground of our own.'            LOOK FOR GROUND / LATER (LATER leaves a YOUR PLACE button)
     good ground        'Good ground, right here. Plant it.'     PLANT HERE / CLOSE      (with what the ground gives: water,
     bad ground         'This is the road. Better ground west.'  WALK THERE / CLOSE       power, a road, how safe, in pips)
     walking            'Walking. I'll say when we're there.'
     there              'This is it. Plant it.'                  PLANT HERE / CLOSE
     PLANT HERE         'Are you sure? This is permanent.'       PLANT HERE / NOT YET
     planted            'Ours now. Go in and put something up.'  GO IN
     inside his place   'Tap an empty lot. That's where we build.'
     the first build    'It goes up tonight. Tomorrow it stands.'
   One face at a time: it steps aside while a road card asks, while the map's own voice talks, while the hint plate is up.

   ONE OWNER, NO PATCHES (rule 495): which step is engine/bohemia_home.js step() (pure, the gate reads it); what the map knows is
   BohemiaHomeMap.flowFacts() and state(); the words are records/target/bb/home_base.json flow (draft:true). This file only draws,
   times and presses. The in-game phone keeps its YOUR PLACE page as the record (the bill, who lives there).
   API: window.BohemiaYourPlace = { state(), open(), press(id) }. Read hook: window.__YOUR_PLACE (the step on the glass, its rect).
   ========================================================================================================== */
(function () {
  'use strict';
  if (window.BohemiaYourPlace) return;
  var BEAT = 500, Z = 62;
  var S = { open: false, later: false, going: false, target: null, asked: false, builtAt: 0, sawBooked: null, el: null, sig: '', faceSig: '', step: null, who: null, presses: 0, log: [], hidden: '' };
  var M = function () { return window.BohemiaMaterials || null; };
  function kit(name, s) { try { var m = M(); return m && m.kit ? m.kit(name, s || 1) : ''; } catch (e) { return ''; } }
  /* every word on the panel goes in as text (textContent), never as markup: no escaping to copy, nothing a name can inject */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = String(text); return e; }

  /* ---------------- THE LOOK: the UI kit's tin and receipt, his letters at 10 or 20 css px (JUST THE FONT) ---------------- */
  var CSS_DONE = false;
  function css() {
    if (CSS_DONE || !document.head) return; CSS_DONE = true;
    var shadow = 'filter:drop-shadow(2px 1px 0 rgba(10,6,3,.6));', ink = 'color:#1f1710;';
    var t = '#yourplace{position:fixed;z-index:' + Z + ';display:none;box-sizing:border-box;flex-direction:column;gap:8px;padding:10px;'
      + 'font-family:"BohemiaROM",ui-monospace,monospace;color:#1f1710;background:#cdbf9c;' + kit('board_plain', 1) + shadow + 'touch-action:manipulation;-webkit-user-select:none;user-select:none}'
      + '#yourplace.on{display:flex}'
      + '#yourplace .top{display:flex;gap:8px;align-items:flex-start}'
      + '#yourplace .face{flex:0 0 auto;width:56px;height:56px;box-sizing:border-box;padding:4px;background:#0a0d0b;' + kit('well', 1) + '}'
      + '#yourplace .face canvas{display:block;width:48px;height:48px;image-rendering:pixelated}'
      + '#yourplace .say{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:4px}'
      + '#yourplace .who{align-self:flex-start;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:10px;letter-spacing:2px;line-height:1;padding:4px 6px 5px;color:#120c06;background:#c8ab63;' + kit('tin_amber', .5) + '}'
      + '#yourplace .line{font-size:20px;line-height:22px;padding:6px 8px 7px;min-height:22px;background:#e8dcc0;' + kit('receipt', 1) + ink + '}'
      + '#yourplace .line i{font-style:normal;visibility:hidden}#yourplace .line i.on{visibility:visible}'
      + '#yourplace .marks{display:flex;gap:6px;justify-content:space-between}'
      + '#yourplace .mk{flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:3px;padding:4px 2px 5px;background:#26281f;color:#e7dcc6;' + kit('tin_dark', .5) + '}'
      + '#yourplace .mk svg{width:20px;height:20px;display:block}'
      + '#yourplace .mk b{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;font-size:10px;letter-spacing:1px;line-height:1}'
      + '#yourplace .mk s{display:flex;gap:2px;text-decoration:none}#yourplace .mk s u{display:block;width:8px;height:8px;background:#3d3a2e;box-shadow:inset 0 0 0 1px #0e0a05}'
      + '#yourplace .mk s u.f{background:#e6c475}#yourplace .mk.low s u.f{background:#c0533a}'
      + '#yourplace .btns{display:flex;gap:8px}'
      + '#yourplace button{flex:0 0 auto;min-height:48px;min-width:48px;box-sizing:border-box;border:0;margin:0;padding:6px 12px;cursor:pointer;white-space:nowrap;'
      + 'font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:20px;letter-spacing:1px;line-height:1;color:#1f1710;background:#b9b39c;' + kit('tin', 1) + 'text-shadow:none}'
      + '#yourplace button.gold{flex:1 1 auto;white-space:normal;color:#120c06;background:#c8ab63;' + kit('tin_amber', 1) + '}'
      + '#yourplace button:active{transform:translateY(1px)}'
      + '#yourplace.pill{padding:6px;gap:0}#yourplace.pill button{padding:6px 14px 6px 10px;display:flex;align-items:center;gap:8px}'
      + '#yourplace.pill button i{display:block;width:18px;height:22px;flex:none;background:linear-gradient(#5a3c1c,#5a3c1c) 8px 4px/2px 18px no-repeat,linear-gradient(135deg,#a8341e 50%,transparent 50%) 10px 4px/8px 8px no-repeat}';
    var st = document.createElement('style'); st.id = 'yourplace-css'; st.textContent = t; document.head.appendChild(st);
  }
  /* the four things a spot gives, as a picture each (a tap of water, a bolt, a road, a shield) and three pips: more lit is better */
  var ICON = {
    water: '<svg viewBox="0 0 20 20"><path d="M10 2 5 10a5 5 0 0 0 10 0z" fill="#7fb6c9" stroke="#0e0a05"/></svg>',
    power: '<svg viewBox="0 0 20 20"><path d="M11 1 4 11h5l-1 8 8-11h-5z" fill="#e6c475" stroke="#0e0a05"/></svg>',
    road: '<svg viewBox="0 0 20 20"><path d="M6 1 2 19M14 1l4 18" stroke="#b9b39c" stroke-width="2"/><path d="M10 2v3m0 4v3m0 4v3" stroke="#e6c475" stroke-width="2"/></svg>',
    safe: '<svg viewBox="0 0 20 20"><path d="M10 1 3 4v6c0 5 7 9 7 9s7-4 7-9V4z" fill="#9fb0c4" stroke="#0e0a05"/></svg>'
  };
  function marks(g, words) {
    var v = { water: g.water | 0, power: g.power | 0, road: g.road | 0, safe: Math.max(0, 3 - (g.danger | 0)) }, row = el('div', 'marks');
    ['water', 'power', 'road', 'safe'].forEach(function (k) {
      var m = el('div', 'mk' + (v[k] <= 1 ? ' low' : '')), pips = el('s'); m.dataset.mk = k; m.dataset.n = v[k];
      m.innerHTML = ICON[k]; m.appendChild(el('b', null, (words && words[k]) || k.toUpperCase()));
      for (var i = 0; i < 3; i++) pips.appendChild(el('u', i < v[k] ? 'f' : null)); m.appendChild(pips); row.appendChild(m); });
    return row;
  }

  /* ---------------- WHO SAYS IT: his crew's best man (the engine's bestMan), the company's own record ---------------- */
  function men() {
    var list = null;
    try { list = JSON.parse(localStorage.getItem('bohemia.company.v1') || 'null'); } catch (e) {}
    if (list && list.length) return list;
    try { var D = window.CREW_DEFS, ms = (D && D.men) || [], lk = (D && D.looks) || [];
      return ms.map(function (m, i) { return { name: m.name, look: lk[i], level: m.level, xp: m.xp, main: i === 0 || !!m.main, dead: !!m.dead }; }); } catch (e) { return []; }
  }
  function who() {
    var H = window.BohemiaHome, F = window.BohemiaCrewFaces; if (!H || !H.bestMan || !F) return null;
    var m = H.bestMan(men().filter(function (x) { return x && (!F.has || F.has(x.look)); }));
    return m ? { name: String(m.name).toUpperCase(), look: m.look } : null;
  }

  /* ---------------- ONE FACE AT A TIME: a card that asks, the map's voice, the hint plate, a setting card ---------------- */
  function someoneElse() {
    try { if (window.BohemiaRoadEvents && BohemiaRoadEvents.up && BohemiaRoadEvents.up()) return 'card'; } catch (e) {}
    try { var v = document.getElementById('bmvoice'); if (v && v.classList.contains('on') && v.offsetWidth > 0) return 'voice'; } catch (e) {}
    try { var T = window.top.document, h = T.getElementById('cbxsay'); if (h && h.style.display !== 'none' && h.offsetWidth > 0) return 'hint';
      var sw = T.getElementById('setwrap'); if (sw && sw.classList.contains('on')) return 'settings';
      var fr = T.getElementById('front'); if (fr && fr.style.display !== 'none' && fr.offsetWidth > 0) return 'door'; } catch (e) {}
    try { if (window.MEET && MEET.up) return 'meet'; } catch (e) {}
    return '';
  }

  /* the moment the map's voice or the hint plate comes on, the panel goes (a tick is a quarter second: two faces for a quarter second
     is two faces) */
  var WATCHED = typeof WeakSet !== 'undefined' ? new WeakSet() : null;
  function watch() {
    if (!WATCHED) return;
    var els = [document.getElementById('bmvoice')]; try { els.push(window.top.document.getElementById('cbxsay')); } catch (e) {}
    els.forEach(function (e) { if (!e || WATCHED.has(e)) return; WATCHED.add(e);
      try { var MO = e.ownerDocument.defaultView.MutationObserver;
        new MO(function () { var o = someoneElse(); if (o && S.el && S.el.classList.contains('on')) { hide(o); out(S.step); } }).observe(e, { attributes: true, attributeFilter: ['class', 'style'] }); } catch (x) {} });
  }

  /* ---------------- THE STEP ---------------- */
  function facts() {
    var HM = window.BohemiaHomeMap, H = window.BohemiaHome; if (!HM || !H || !H.data || !H.data() || !HM.flowFacts) return null;
    var s = null, f = null; try { s = HM.state(); f = HM.flowFacts(); } catch (e) { return null; } if (!s || !f) return null;
    var now = performance.now();
    if (S.sawBooked == null) S.sawBooked = f.booked;   /* a game that came back with a build already booked never hears 'it goes up' */
    if (f.inside && !f.sheet && f.booked > 0 && S.sawBooked === 0 && !S.builtAt) S.builtAt = now;   /* the first build: said once he is back on his cameras */
    if (!f.travelling && S.going && S.target && f.at && Math.max(Math.abs(f.at[0] - S.target[0]), Math.abs(f.at[1] - S.target[1])) > 1 && S.wasTravelling === false) S.going = false;
    S.wasTravelling = f.travelling;
    return { planted: s.planted, offer: !!s.offer, onMap: f.onMap, inside: f.inside, sheet: f.sheet, booked: f.booked, here: s.here, better: s.better, travelling: f.travelling,
      open: S.open, later: S.later, going: S.going, target: S.target, at: f.at, asked: S.asked, built: !!S.builtAt && now - S.builtAt < 14 * BEAT, words: s.words };
  }

  /* ---------------- THE GLASS ---------------- */
  function box() {
    if (S.el) return S.el; css();
    var d = document.createElement('div'); d.id = 'yourplace'; d.setAttribute('role', 'group'); d.setAttribute('aria-label', 'your place');
    /* a press here is a press on the panel, never a walk on the map under it */
    ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'click', 'wheel'].forEach(function (k) { d.addEventListener(k, function (e) { try { e.stopPropagation(); } catch (_e) {} }, { passive: true }); });
    d.addEventListener('click', function (e) { var b = e.target && e.target.closest ? e.target.closest('button[data-yp]') : null; if (b) press(b.dataset.yp); });
    document.body.appendChild(d); S.el = d; return d;
  }
  /* beside the phone, its bottoms level, under the thumb; above it when the room beside it is too narrow for a face and a few words */
  function place(d, pill) {
    var W = innerWidth, H = innerHeight, side = W >= H, r = null;
    try { r = window.BOH_PHONE_RECT ? BOH_PHONE_RECT() : null; } catch (e) {}
    d.style.left = d.style.right = d.style.top = d.style.bottom = d.style.width = '';
    var maxW = side ? 340 : 420;
    if (r && r.width > 0 && r.bottom > 0) {
      var right = r.side !== 'left', room = right ? r.left - 16 - 8 : W - r.right - 16 - 8, bottom = Math.max(16, Math.round(H - r.bottom));
      if (pill || room >= 220) { var w = pill ? null : Math.min(maxW, room);
        if (w) d.style.width = w + 'px';
        if (right) d.style.right = Math.round(W - r.left + 8) + 'px'; else d.style.left = Math.round(r.right + 8) + 'px';
        d.style.bottom = bottom + 'px'; return; }
      d.style.left = '16px'; d.style.width = Math.min(maxW, W - 32) + 'px'; d.style.bottom = Math.round(H - r.top + 8) + 'px'; return;
    }
    d.style.left = '16px'; if (!pill) d.style.width = Math.min(maxW, W - 32) + 'px'; d.style.bottom = '16px';
  }
  /* the map's own words at its foot (#packline: what the tracks underfoot say, the walk's own line) are never covered: the panel
     stands above them when the two would meet */
  function clear(d) {
    try { var p = document.getElementById('packline'); if (!p || p.style.display === 'none' || !p.textContent.trim() || p.offsetWidth < 2) return;
      var a = p.getBoundingClientRect(), b = d.getBoundingClientRect();
      if (a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom) return;
      d.style.top = ''; d.style.bottom = Math.round(innerHeight - a.top + 8) + 'px'; } catch (e) {}
  }
  function syl(w) { var m = String(w).toLowerCase().match(/[aeiouy]+/g); return Math.max(1, m ? m.length : 1); }
  function paint(st, man) {
    var d = box(), pill = st.id === 'pill';
    d.classList.toggle('pill', pill);
    var g = st.id === 'good' || st.id === 'bad' || st.id === 'arrived' ? (S.c && S.c.here && S.c.here.g) : null;
    var words = st.line.split(/\s+/);
    d.textContent = '';
    if (!pill) {
      var top = el('div', 'top'), face = el('div', 'face'), cv = el('canvas'), say = el('div', 'say'), line = el('div', 'line');
      cv.width = cv.height = 96; face.appendChild(cv);
      words.forEach(function (w, i) { if (i) line.appendChild(document.createTextNode(' ')); line.appendChild(el('i', null, w)); });
      say.appendChild(el('span', 'who', man.name)); say.appendChild(line); top.appendChild(face); top.appendChild(say); d.appendChild(top);
      if (g) d.appendChild(marks(g, (window.BohemiaHome.data().flow || {}).marks));
    }
    if (st.buttons.length) { var bs = el('div', 'btns');
      st.buttons.forEach(function (b) { var e = el('button', b.gold ? 'gold' : null); e.type = 'button'; e.dataset.yp = b.id; if (b.id === 'pill') e.appendChild(el('i')); e.appendChild(document.createTextNode(b.label)); bs.appendChild(e); });
      d.appendChild(bs); }
    d.classList.add('on'); place(d, pill); clear(d);
    (S.wordT || []).forEach(clearTimeout); S.wordT = null;
    if (pill) return;
    var F = window.BohemiaCrewFaces, c = d.querySelector('canvas');
    try { F.draw(c.getContext('2d'), man.look, c.width); } catch (e) {}
    var fresh = S.faceSig !== st.id + '|' + st.line, is = d.querySelectorAll('.line i');
    if (!fresh || stillMotion()) { [].forEach.call(is, function (x) { x.classList.add('on'); }); return; }
    S.faceSig = st.id + '|' + st.line;
    /* the words come as his mouth says them, half a beat a syllable (the map voice's own timing) */
    try { F.talk(c, man.look, st.line); } catch (e) {}
    try { window.top.postMessage({ type: 'BOHEMIA_VOICE', speaker: 'face:' + man.look, text: st.line }, '*'); } catch (e) {}
    var at = 0; S.wordT = words.map(function (w, i) { var t = at; at += syl(w) * BEAT / 2; return setTimeout(function () { if (is[i]) is[i].classList.add('on'); }, t); });
    S.log.push({ step: st.id, who: man.name, line: st.line, t: Math.round(performance.now()) });
  }
  function stillMotion() { try { return !!(window.top.BOHEMIA_SETTINGS && window.top.BOHEMIA_SETTINGS.motion && window.top.BOHEMIA_SETTINGS.motion()); } catch (e) { return false; } }
  function hide(why) { if (S.el && S.el.classList.contains('on')) { S.el.classList.remove('on'); (S.wordT || []).forEach(clearTimeout); } S.hidden = why; S.sig = ''; }

  function tick() {
    watch();
    var c = facts(); S.c = c;
    if (!c) { hide('not ready'); return out(null); }
    var st = window.BohemiaHome.step(c); S.step = st;
    if (st.id === 'quiet') { hide('quiet'); return out(st); }
    var other = someoneElse(); if (other) { hide(other); return out(st); }
    var man = who(); if (!man && st.id !== 'pill') { hide('no face'); return out(st); }
    S.who = man; S.hidden = '';
    var g = c.here && c.here.g, sig = JSON.stringify([st.id, st.line, st.buttons.map(function (b) { return b.id; }), man && man.look, g && [g.water, g.power, g.road, g.danger], innerWidth, innerHeight]);
    if (sig !== S.sig || !S.el.classList.contains('on')) { S.sig = sig; paint(st, man); }
    else { place(S.el, st.id === 'pill'); clear(S.el); }   /* the phone can move (turned, flipped to the other side); the map's line can come and go */
    out(st);
  }
  function out(st) {
    var r = null; try { if (S.el && S.el.classList.contains('on')) { var b = S.el.getBoundingClientRect(); r = { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height) }; } } catch (e) {}
    window.__YOUR_PLACE = { step: st ? st.id : null, line: st ? st.line : '', buttons: st ? st.buttons.map(function (b) { return b.id; }) : [], shown: !!r, rect: r, hidden: S.hidden, who: S.who ? S.who.name : null,
      open: S.open, later: S.later, going: S.going, asked: S.asked, presses: S.presses, said: S.log.slice(-12) };
  }

  /* ---------------- A PRESS ---------------- */
  function press(id) {
    S.presses++;
    try { window.top.postMessage({ type: 'BOHEMIA_SFX', ev: 'phone_tap' }, '*'); } catch (e) {}
    var HM = window.BohemiaHomeMap, step = S.step ? S.step.id : null;
    if (id === 'look' || id === 'pill') { S.open = true; S.later = false; }
    else if (id === 'later') { S.later = true; S.open = false; }
    else if (id === 'close') { S.open = false; S.going = false; S.asked = false; S.later = true; }
    else if (id === 'no') S.asked = false;
    else if (id === 'walk') { var b = S.c && S.c.better; if (b && HM) { S.going = true; S.target = [b.x, b.y]; S.wasTravelling = null; try { HM.go('better'); } catch (e) {} } }
    else if (id === 'plant') {
      if (step === 'sure') { var r = null; try { r = HM.plant(); } catch (e) {} S.asked = false; S.open = false; S.going = false; window.__YOUR_PLACE_PLANTED = r; }
      else S.asked = true;
    }
    else if (id === 'in') { try { HM.goIn(); } catch (e) {} }
    S.sig = ''; tick();
  }

  function boot() { css(); box(); setInterval(tick, 250); tick();
    /* the map's voice is made the first time it speaks: catch it being put on the page, so its very first line is alone too */
    try { new MutationObserver(function () { watch(); var o = someoneElse(); if (o && S.el && S.el.classList.contains('on')) { hide(o); out(S.step); } }).observe(document.body, { childList: true }); } catch (e) {} }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.BohemiaYourPlace = { state: function () { return window.__YOUR_PLACE || null; }, open: function () { press('pill'); return true; }, press: press, on: function () { return true; } };
})();
