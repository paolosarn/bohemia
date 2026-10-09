/* THE PHONE'S BOARD  (UI lane 11, [phone contracts], 10/9/26)

   RULE 51c (Paolo 9/30, 'one main quest, two contracts, the phone only shows'): on the cracked phone in the city view,
   the valley's open contracts RIGHT NOW, as the feed's 'what the world did' kind of post: a place posts its ask, the
   post ages, a taken one disappears. NO accept button anywhere on the phone; accepting is the settlement's board, from
   a mouth. Tap a post and it is marked for the map (BOH_PHONE_ROUTE; drawing the route on the map is RUN's).

   ONE SOURCE OF THE JOBS: the asks are read from RUN TWO's settlement screen itself (its OFFERS and TIER_OFFERS, the
   board a mouth offers from), fetched as text and never copied here, so the phone can never offer a job the place does
   not. Which places, where and how big: the map's own ctBases() and mapTierOf(); what is taken: the map's LOOP.held.
   If the settlement's list cannot be read, the board shows nothing rather than inventing a job.

   The look (a world post, the handle stamped, the skulls as drawn marks) is the materials' (dressPhone).
   Included by BOHEMIA_CITY_WORLD.html after bohemia_ui_materials.js. Gate: gates/the_phones_board_gate.js */
(function () {
  'use strict';
  var OFFERS = null, TIERS = null, SEEN = {}, PICK = null, BOX = null, SIG = '', SHOW = 2;

  function load() {
    try {
      fetch('BOHEMIA_SETTLEMENT_SCREEN.html').then(function (r) { return r.text(); }).then(function (t) {
        var m = t.match(/var OFFERS = (\[[\s\S]*?\n\]);/), k = t.match(/var TIER_OFFERS = (\{[^}]*\});/);
        if (!m || !k) return;
        try { OFFERS = Function('return ' + m[1])(); TIERS = Function('return ' + k[1])(); } catch (e) { OFFERS = null; }
      }).catch(function () {});
    } catch (e) {}
  }
  function nowMin() { try { return ((T.day | 0) * 1440) + (T.min | 0); } catch (e) { return 0; } }
  function ago(m) {
    if (m < 60) return 'JUST POSTED';
    if (m < 1440) return Math.floor(m / 60) + 'H AGO';
    return Math.floor(m / 1440) + 'D AGO';
  }
  /* which way on the screen: the map is drawn at 45 degrees, so up the glass is where x and y both shrink */
  function way(dx, dy) {
    var sx = dx - dy, sy = dx + dy;
    if (!sx && !sy) return '';
    var a = Math.atan2(-sy, sx) * 180 / Math.PI, W = ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE'];
    return W[(Math.round(((a + 360) % 360) / 45)) % 8];
  }
  /* every open ask in the valley right now, nearest first: each place offers as many as its tier lets its board offer
     (the settlement's own TIER_OFFERS), skipping what is already taken (the settlement's own rule) */
  function asks() {
    if (!OFFERS || !TIERS) return [];
    var bs = null; try { bs = ctBases(); } catch (e) { bs = null; }
    if (!bs) return [];
    var held = []; try { held = (LOOP.held || []).map(function (h) { return h.id; }); } catch (e) {}
    var me = [0, 0]; try { me = [city.x | 0, city.y | 0]; } catch (e) {}
    var out = [], t = nowMin();
    Object.keys(bs).forEach(function (name) {
      var b = bs[name]; if (!b) return;
      var tier = 'camp'; try { tier = mapTierOf(name) || 'camp'; } catch (e) {}
      var n = TIERS[tier] || 1, shown = 0;
      for (var i = 0; i < OFFERS.length && shown < n; i++) {
        var o = OFFERS[i]; if (held.indexOf(o.id) >= 0) continue; shown++;
        var key = name + '|' + o.id; if (SEEN[key] == null) SEEN[key] = t;
        out.push({ key: key, place: name, x: b.x | 0, y: b.y | 0, tier: tier, id: o.id, title: o.title, skulls: o.skulls || 1, pay: o.pay,
          dist: Math.max(Math.abs((b.x | 0) - me[0]), Math.abs((b.y | 0) - me[1])), way: way((b.x | 0) - me[0], (b.y | 0) - me[1]), age: t - SEEN[key] });
      }
    });
    out.sort(function (a, b) { return a.dist - b.dist || b.skulls - a.skulls || (a.key < b.key ? -1 : 1); });
    return out;
  }
  function handle(name) { return '@' + String(name).toLowerCase().replace(/[^a-z0-9]+/g, ''); }
  function post(a) {
    var d = document.createElement('div');
    d.className = 'fp world job in' + (PICK === a.key ? ' picked' : '');
    d.setAttribute('role', 'button'); d.dataset.job = a.id; d.dataset.place = a.place;
    d.setAttribute('aria-label', a.place + ' needs: ' + a.title + '. ' + a.skulls + ' skull, ' + a.pay + ' batteries, ' + a.dist + ' blocks. Tap to mark it on the map.');
    var w = document.createElement('div'); w.className = 'who';
    w.textContent = handle(a.place) + ' · ' + (a.dist ? a.dist + ' BLOCKS ' + a.way : 'HERE');
    var x = document.createElement('div'); x.className = 'txt'; x.textContent = a.title;   /* the settlement's own words, draft:true there */
    var m = document.createElement('div'); m.className = 'meta';
    for (var i = 0; i < a.skulls; i++) { var s = document.createElement('i'); s.className = 'sk'; m.appendChild(s); }
    var p = document.createElement('span'); p.textContent = a.pay + ' BATT · ' + ago(a.age); m.appendChild(p);
    d.appendChild(w); d.appendChild(x); d.appendChild(m);
    d.addEventListener('click', function (ev) {
      try { ev.stopPropagation(); } catch (e) {}   /* a tap on a job is not a tap on the phone */
      PICK = (PICK === a.key) ? null : a.key;
      window.BOH_PHONE_ROUTE = PICK ? { place: a.place, x: a.x, y: a.y, id: a.id, title: a.title, dist: a.dist, way: a.way } : null;
      try { window.dispatchEvent(new CustomEvent('bohemia-phone-route', { detail: window.BOH_PHONE_ROUTE })); } catch (e) {}
      SIG = ''; paint();
    });
    return d;
  }
  function paint() {
    var feed = document.getElementById('cityfeed'), list = document.getElementById('cityfeedlist');
    if (!feed || !list || !feed.classList.contains('on')) return;
    if (!BOX || !BOX.parentNode) {
      BOX = document.createElement('div'); BOX.id = 'bmboard'; BOX.setAttribute('role', 'list'); BOX.setAttribute('aria-label', 'the valley\'s open contracts');
      list.parentNode.insertBefore(BOX, list);
    }
    /* WHO IS OFFERING WHAT: one ask per place, the nearest places first, so two posts are two places, not one place twice */
    var all = asks(), top = [], from = {};
    for (var i = 0; i < all.length && top.length < SHOW; i++) if (!from[all[i].place]) { from[all[i].place] = 1; top.push(all[i]); }
    if (PICK && !all.some(function (a) { return a.key === PICK; })) { PICK = null; window.BOH_PHONE_ROUTE = null; }   /* taken: it disappears, and so does its mark */
    var sig = top.map(function (a) { return a.key + a.dist + ago(a.age) + (PICK === a.key); }).join(';');
    window.__PHONE_BOARD = { asks: all.length, shown: top.map(function (a) { return { place: a.place, id: a.id, title: a.title, pay: a.pay, skulls: a.skulls, dist: a.dist }; }) };
    if (sig === SIG) return; SIG = sig;
    BOX.textContent = '';
    top.forEach(function (a) { BOX.appendChild(post(a)); });
    BOX.style.display = top.length ? '' : 'none';
  }
  load();
  setInterval(paint, 1000);
  window.BohemiaPhoneBoard = { asks: asks, paint: paint, loaded: function () { return !!OFFERS; } };
})();
