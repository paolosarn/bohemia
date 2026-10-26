/* BOHEMIA CAMP MAP -- HIS CAMP ON THE LIVE MAP, AND WHAT THE CAMP SCREEN NEEDS FROM THE MAP (CAMP TWO, 10/26/26: [camp on the live map],
   [the camp is your own settlement] (b), [the compass of danger]; rules 257, 260(b), 269(b)).
   PAOLO 10/26: 'even when I'm healing at the camp I still want to be able to see what's going on with the rest of the city... I
   wonder how we can implement that, it's a huge thing'; 'in the camp view, depending on north, south, east and west and where the
   enemies are compared to where your camp is, all eight compass directions, part of the edge of the screen... depending on the
   combat calculator, red as they get closer if they're very dangerous'.
   MEASURED FIRST: making camp put the settlement frame over the whole glass; the marker stayed a man with two men at his shoulders
   under it; nothing of the camp was ever drawn on the map; and the camp screen was told nothing about the parties walking the
   valley or about each of his men (it got the company's one bar).
   NOW, loaded by BOHEMIA_CITY_WORLD.html, one marked hook in the map's drawing of him (__CAMP_TWO__), nothing else of the map's
   code touched (campHour and campBreak are CAMP's; this file only calls BohemiaMapCamp's own doors):
     * THE CAMP AT HIS SPOT: while camped, his tents (one a pair), his carrier and the fire stand round the marker at his men's
       size (the person never grows with the zoom), the fire's keys on the beat;
     * MAP (the camp screen's plate, a pinch out, the wheel out): the camp screen steps aside with the hours still running (the
       frame stays where it is and lets the touches through, so the clock and the healing go on exactly as before), the city is
       live round the camp, and BACK TO CAMP stands where HEAL stands; a tap on it or on the camp goes back; a travel tap is the
       end of the camp (rule 267(a): a travel tap ends it), through the map's own break;
     * EVERY BEAT TO THE CAMP SCREEN: each of his men's blood and armour by name and look (the condition, read), and the parties
       coming: the hunters and every crew within nine blocks, each with the way to it on the glass, how far, and the AUTO read of
       it against his crew as it stands (WORLD's slices/bohemia_job_danger.js: the meet card's own read, the same calculator as
       COMBAT's AUTO, rule 254), turned into the eight edges by engine/bohemia_camp_life.js.
     BohemiaCampMap.peek(on) / peeking() / drawAt(g, gx, gy) / threats() / men() / state()
   Words are attempts, draft:true. */
(function (root) {
  'use strict';
  var CL = root.BohemiaCampLife;
  var K = { kit: null, img: null, cart: null, peek: false, back: null, threats: [], men: {}, reads: {}, tick: null, drawn: 0, travelAt: null, lastPost: 0 };
  try { fetch('camp_two/kit.json').then(function (r) { return r.json(); }).then(function (j) { K.kit = j; var im = new Image(); im.onload = function () { K.img = im; }; im.src = 'camp_two/kit.png'; }).catch(function () {}); } catch (e) {}
  (function () { var im = new Image(); im.onload = function () { K.cart = im; }; im.src = '../records/target/master_rig/cook_cart/rig_SE.png'; })();
  try { fetch('../records/target/bb/ours.json').then(function (r) { return r.json(); }).then(function (j) { var c = j && j.odds_colour; if (c && CL) CL.setOdds(c.value || c); }).catch(function () {}); } catch (e) {}

  function G(n) { try { return root.eval(n); } catch (e) { return undefined; } }   /* the map's own globals (var LOOP, CAMP, HUNT, city ...), read only */
  function camped() { try { return !!(root.BohemiaMapCamp && root.BohemiaMapCamp.on()); } catch (e) { return false; } }
  function frame() { var L = G('LOOP'); return L && L.frame; }

  /* ---------------------------------------------------------------- his men, one by one (the condition, read) */
  function men() {
    var C = root.BohemiaCondition, out = {}; if (!C) return out;
    var L = G('LOOP'), s = null; try { s = C.get(); } catch (e) { return out; }
    var list = []; try { list = C.members(L && L.start && L.start.company); } catch (e) { list = []; }
    /* a man's look by his name, the way the marker dresses him: the saved company, the hired, ours.json's crew in order */
    var lookOf = {}, D = G('CREW_DEFS');
    if (D && D.men) D.men.forEach(function (m, i) { if (m && m.name && D.looks && D.looks[i]) { lookOf[C.canon(m.name)] = D.looks[i]; if (m.was) lookOf[C.canon(m.was)] = D.looks[i]; } });
    ['bohemia.company.v1', 'bohemia.hired.v1'].forEach(function (k) { try { (JSON.parse(localStorage.getItem(k) || '[]') || []).forEach(function (m) { if (m && m.name && m.look) lookOf[C.canon(m.name)] = m.look; }); } catch (e) {} });
    list.forEach(function (e) {
      var r = s.men[e.key], b = 1, a = 1;
      if (r) { if (r.hpMax > 0) b = 1 - (r.lostHp || 0) / r.hpMax; var am = (r.armHMax || 0) + (r.armBMax || 0); if (am > 0) a = 1 - ((r.lostH || 0) + (r.lostB || 0)) / am; }
      var look = lookOf[e.key] || (e.man && e.man.look); if (!look && r && r.look) look = r.look;
      out[e.key] = { blood: Math.max(0, Math.min(1, b)), armour: Math.max(0, Math.min(1, a)), look: look || null, name: e.main ? 'YOU' : (e.man && e.man.name) || e.key };
    });
    return out;
  }

  /* ---------------------------------------------------------------- who is coming (rule 269(b)) */
  function readOf(id, party, at) {
    var J = root.BohemiaJobDanger; if (!J || !party) return null;
    var R = K.reads[id];
    if (!R || !R.q) {   /* the meet card's own way: the band rolled at the one door, then read (an engine not in yet is asked again next beat) */
      var msg = { type: 'BOHEMIA_CITY_ENCOUNTER', party: JSON.parse(JSON.stringify(party)), at: { gx: at[0], gy: at[1] }, why: 'camp:' + id, label: 'camp' };
      try { if (J.rollInto) J.rollInto(msg); } catch (e) {}
      var q = null; try { q = J.readParty(msg); } catch (e) { q = null; }
      if (!q) return null;
      R = K.reads[id] = { q: q, at: Date.now() };
    }
    var r = null; try { r = J.read(R.q); } catch (e) { r = null; }
    return r && r.state === 'read' ? (typeof r.clean === 'number' ? r.clean : null) : null;
  }
  function threats() {
    var out = [], city = G('city'), TW = G('TW') || 2, TH = G('TH') || 1; if (!city) return out;
    var at = (root.BohemiaMapCamp && root.BohemiaMapCamp.state && root.BohemiaMapCamp.state().at) || [city.x | 0, city.y | 0];
    var add = function (id, x, y, name, count, party, hunt) {
      var dx = x - at[0], dy = y - at[1], blocks = Math.max(Math.abs(dx), Math.abs(dy)); if (blocks > 12 || blocks < 1) return;   /* read from twelve, lit from nine: the colour is in before the edge lights */
      var sx = (dx - dy) * TW / 2, sy = (dx + dy) * TH / 2;   /* the way to them as the map's glass shows it (iso), so north is up the glass */
      out.push({ id: id, dx: sx, dy: sy, blocks: blocks, name: name, count: count, hunt: !!hunt, clean: readOf(id, party, [x, y]) });
    };
    var H = G('HUNT');
    if (H && H.at) { var ph = null; try { ph = root.eval('partyMath')('roaming', { x: H.at[0], y: H.at[1] }); ph.count = H.count; } catch (e) { ph = null; }
      add(H.id, H.at[0], H.at[1], H.name, H.count, ph, true); }
    var ps = null; try { ps = root.eval('partiesAll')(); } catch (e) { ps = null; }
    (ps || []).forEach(function (p) {
      if (!p || !p.at || p.agenda !== 'crew') return;   /* a crew is the party in the valley going somewhere to take something; a caravan and a patrol are not coming for him */
      var n = 3; try { n = root.eval('partySizeOf')(p); } catch (e) {}
      var pm = null; try { pm = root.eval('partyMath')('roaming', { x: p.at.x | 0, y: p.at.y | 0 }); pm.count = n; pm.faction = 'brigands'; } catch (e) { pm = null; }
      add(p.id, p.at.x | 0, p.at.y | 0, (p.from && p.from.faction ? p.from.faction + ' ' : '') + 'crew', n, pm, false);
    });
    return out;
  }

  /* ---------------------------------------------------------------- every beat, to the camp screen */
  function beat() {
    if (!camped()) { if (K.peek) peek(false); return; }
    var f = frame(); if (!f || !f.contentWindow) return;
    K.men = men(); K.threats = threats();
    var compass = CL ? CL.compass(K.threats) : null;
    try { f.contentWindow.postMessage({ type: 'BOHEMIA_CAMP_LOOK', men: K.men, threats: K.threats, compass: compass }, '*'); } catch (e) {}
    K.lastPost = Date.now();
    /* a travel tap while he looks at the map ends the camp (rule 267(a)), through the map's own door */
    var T = G('TRAVEL'); if (K.peek && T && T.to) { try { root.BohemiaMapCamp.break(); } catch (e) {} peek(false); }
  }
  setInterval(function () { try { beat(); } catch (e) {} }, 500);
  /* while he looks at the map from his camp the map draws on its own clock, three keys a beat (the fire's keys, the parties' steps):
     the map only paints when something asks it to, and a camp's hours ask nothing of it */
  setInterval(function () { if (!K.peek) return; try { var r = root.eval('render'); if (typeof r === 'function') r(); } catch (e) {} }, 500 / 3);

  /* ---------------------------------------------------------------- MAP: the camp steps aside, the hours run */
  function peek(on) {
    var f = frame();
    if (on && !camped()) return false;
    K.peek = !!on;
    if (f) { f.style.opacity = on ? '0' : ''; f.style.pointerEvents = on ? 'none' : ''; f.style.transition = 'opacity 250ms steps(4)'; }   /* held frames, the Crashbox way (MOTION's layer may take it over) */
    backPlate(on);
    root.__CAMP_PEEK = { on: !!on, at: Date.now(), n: ((root.__CAMP_PEEK && root.__CAMP_PEEK.n) | 0) + (on ? 1 : 0) };
    return true;
  }
  function backPlate(on) {
    var b = K.back;
    if (!b && on && document.body) {
      b = K.back = document.createElement('div'); b.id = 'campback'; b.setAttribute('role', 'button'); b.setAttribute('tabindex', '0'); b.setAttribute('aria-label', 'back to camp');
      b.setAttribute('data-morph', 'camp');
      var cv = document.createElement('canvas'); cv.width = 40; cv.height = 22; cv.setAttribute('style', 'display:block;width:40px;height:22px;image-rendering:pixelated;pointer-events:none;margin:0 auto 1px');
      var t = document.createElement('div'); t.textContent = 'CAMP'; t.setAttribute('style', 'pointer-events:none');   /* draft:true */
      b.appendChild(cv); b.appendChild(t);
      b.setAttribute('style', 'position:fixed;right:121px;bottom:17px;z-index:61;display:none;min-width:58px;height:44px;padding:2px 5px;box-sizing:border-box;flex-direction:column;align-items:center;justify-content:center;border-radius:7px;cursor:pointer;'
        + 'font:700 9px BohemiaCasing,ui-monospace,monospace;letter-spacing:1.5px;color:#e8dcc0;background:linear-gradient(#2e271b,#15110a);outline:1px solid #d9a85a;box-shadow:inset 0 1px 0 rgba(231,216,187,.20),inset 0 -2px 0 #0b0906,0 2px 0 rgba(0,0,0,.55),0 6px 16px rgba(0,0,0,.45);-webkit-tap-highlight-color:transparent;user-select:none;touch-action:manipulation');
      var stop = function (e) { try { e.stopPropagation(); } catch (x) {} };
      ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'mouseup'].forEach(function (ty) { b.addEventListener(ty, stop, { passive: true }); });
      b.addEventListener('click', function (e) { stop(e); peek(false); });
      document.body.appendChild(b);
    }
    if (b) { b.style.display = on ? 'flex' : 'none'; if (on) iconPaint(b.querySelector('canvas')); }
  }
  function iconPaint(cv) {   /* his own tent, small, from the kit: the plate is the camp */
    if (!cv || !K.img || !K.kit) return; var e = K.kit.pieces.tent_olive, g = cv.getContext('2d'); g.clearRect(0, 0, cv.width, cv.height); g.imageSmoothingEnabled = false;
    var r = e.rect, z = Math.min(cv.width / r[2], cv.height / (r[3] * 0.62)); g.drawImage(K.img, r[0], r[1], r[2], Math.round(r[3] * 0.62), Math.round(cv.width / 2 - r[2] * z / 2), 0, Math.round(r[2] * z), Math.round(r[3] * 0.62 * z));
  }

  /* ---------------------------------------------------------------- THE CAMP AT HIS SPOT (rule 257(a)): drawn round his marker */
  var Z = 0.5;   /* his body is the 112 box drawn at half: a 98 px rig man is 49 px on the glass; the camp's pieces at the same size */
  function drawAt(g, gx, gy) {
    if (!camped() || !K.img || !K.kit || !CL || !g) return false;
    var co = null; try { co = (root.BohemiaMapCamp.condition() || {}).men; } catch (e) {}
    var n = Math.max(1, co || 1), tn = CL.tents(n), C = root.BohemiaCamp, lvl = C ? C.cart().level : 0;
    var put = function (key, x, y) { var e = K.kit.pieces[key]; if (!e) return; var r = e.rect; g.drawImage(K.img, r[0], r[1], r[2], r[3], Math.round(x - e.foot[0] * Z), Math.round(y - e.foot[1] * Z), Math.round(r[2] * Z), Math.round(r[3] * Z)); };
    g.save(); g.imageSmoothingEnabled = false;
    var cloths = ['tent_olive', 'tent_tarp', 'tent_stripe'];
    /* the tents behind him in an arc, the far ones first */
    var spots = []; for (var i = 0; i < tn; i++) { var t = tn === 1 ? 0 : i / (tn - 1) - 0.5, row = i >= 4 ? 1 : 0; spots.push([gx + t * Math.min(150, 46 * tn) , gy - 34 - row * 18 - (1 - Math.abs(t) * 2) * 6]); }
    spots.sort(function (a, b) { return a[1] - b[1]; }).forEach(function (p, i) { put(cloths[i % 3], p[0], p[1]); });
    var fk = Math.floor((root.performance ? performance.now() : Date.now()) / (500 / 3)) % 6;
    put('fire_' + fk, gx + 22, gy + 4);
    if (lvl >= 2) {} else if (K.cart) { g.drawImage(K.cart, Math.round(gx - 52 - 34 * Z), Math.round(gy + 2 - 53 * Z), Math.round(K.cart.naturalWidth * Z), Math.round(K.cart.naturalHeight * Z)); }
    if (lvl >= 2) put('supplies', gx - 54, gy + 6);
    /* the fire's light at night, on the beat */
    var night = false; try { night = !!root.eval('isNight')(); } catch (e) {}
    if (night) { var fl = 0.85 + 0.15 * Math.sin(Date.now() / 500 * Math.PI), R = 70 * fl, gr = g.createRadialGradient(gx + 22, gy, 4, gx + 22, gy, R);
      gr.addColorStop(0, 'rgba(255,150,60,.30)'); gr.addColorStop(1, 'rgba(255,120,40,0)'); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.beginPath(); g.ellipse(gx + 22, gy, R, R * 0.55, 0, 0, 7); g.fill(); }
    g.restore();
    K.drawn++; K.box = { x: gx - 90, y: gy - 80, w: 180, h: 110 };
    root.__CAMP_ON_MAP = { tents: tn, men: n, at: [Math.round(gx), Math.round(gy)], drawn: K.drawn, night: night };
    return true;
  }
  /* a tap on the camp while he looks at the map goes back to it */
  document.addEventListener('pointerup', function (e) {
    if (!K.peek || !K.box) return; var b = K.box;
    if (e.clientX >= b.x && e.clientX <= b.x + b.w && e.clientY >= b.y && e.clientY <= b.y + b.h) { try { e.stopPropagation(); e.preventDefault(); } catch (x) {} K.backAt = Date.now(); peek(false); }
  }, true);
  ['click', 'pointerdown'].forEach(function (ty) { document.addEventListener(ty, function (e) {   /* the same tap never also walks him there */
    var b = K.box; if (!b || !(K.peek || Date.now() - (K.backAt || 0) < 400)) return;
    if (e.clientX >= b.x && e.clientX <= b.x + b.w && e.clientY >= b.y && e.clientY <= b.y + b.h) { try { e.stopPropagation(); } catch (x) {} } }, true); });
  function state() { return { peek: K.peek, threats: K.threats.slice(), men: K.men, drawn: K.drawn, onMap: root.__CAMP_ON_MAP || null, lastPost: K.lastPost }; }
  root.BohemiaCampMap = { peek: peek, peeking: function () { return K.peek; }, drawAt: drawAt, threats: threats, men: men, state: state, beat: beat };
})(typeof window !== 'undefined' ? window : this);
