/* THE BOARD'S PEOPLE (RUN TWO [the board's quests are people], 10/18/26).
   His 10/17 ANYTHING ELSE: 'no more cards with quests, make an actual quest'. Who stands at a place's board is drawn
   from QUESTS' act-one shelf (records/target/BOHEMIA_BOARD_SHELF.json, baked from questbook/designs/act1 by
   tools/bohemia_run2_board_shelf.py): a person with a face who says the job in two sentences, the pay in the second.
   ONE PICK, TWO READERS: the settlement's board (slices/BOHEMIA_SETTLEMENT_SCREEN.html) and the phone's list
   (slices/bohemia_phone_board.js) both call pick(), so the phone never lists a job the place does not offer.
   THE PICK (QUESTS QR-O and QR-S, read, never asked): a camp shows 1, a town 2, a fortress 3; a RAIDED place keeps one,
   and it is the crew that hit it ({crew}, from FACTIONS' raid ledger); a SICK place asks for medicine first, a MARKET
   DAY puts a haul up first; the rest are the place's tier, shuffled by the place's name and the map's day, a new board
   every refresh_days (3, QR-O's draft; TUNING owns it). A job already held is skipped and the next one stands up.
     BohemiaBoardShelf.load(url, cb)   fetch the shelf once (default ../records/target/BOHEMIA_BOARD_SHELF.json)
     BohemiaBoardShelf.ready()         the shelf is in
     BohemiaBoardShelf.pick(place, day, opt)  place {name, tier}; opt {traits:[ids], held:[ids], crew:'the Cartel'}
                                       -> offers shaped like the settlement's OFFERS, or null before the shelf is in */
(function (root) {
  'use strict';
  var SHELF = null, LOADING = false, WAIT = [];
  function seedOf(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var x = seed >>> 0 || 1; return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; }
  function shuffled(list, R) { var a = list.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function set(doc) { SHELF = doc && Array.isArray(doc.offers) ? doc : null; var w = WAIT; WAIT = []; w.forEach(function (f) { try { f(SHELF); } catch (e) {} }); }
  function load(url, cb) {
    if (cb) { if (SHELF) cb(SHELF); else WAIT.push(cb); }
    if (SHELF || LOADING || typeof fetch === 'undefined') return;
    LOADING = true;
    fetch(url || '../records/target/BOHEMIA_BOARD_SHELF.json').then(function (r) { return r.json(); })
      .then(set).catch(function () { LOADING = false; });
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* a copy that is safe to hand around: {crew} said, the client copied */
  function said(o, crew) {
    var c = crew || 'a crew', x = {};
    for (var k in o) x[k] = o[k];
    x.client = {}; for (var j in o.client) x.client[j] = o.client[j];
    x.says = String(o.says).replace(/(^|[.!?]\s+)\{crew\}/g, function (m, p) { return p + cap(c); }).replace(/\{crew\}/g, c);
    return x;
  }
  function pick(place, day, opt) {
    if (!SHELF || !place) return null;
    opt = opt || {};
    var C = SHELF.counts || {}, tier = place.tier || 'camp', traits = opt.traits || [], held = opt.held || [];
    var win = Math.floor((day || 0) / (SHELF.refresh_days || 3));
    var R = rng(seedOf(String(place.name) + ':board:' + win));
    var all = SHELF.offers, out = [], seen = {};
    function take(pool, n) {
      shuffled(pool, R).forEach(function (o) { if (out.length < n && !seen[o.id] && held.indexOf(o.id) < 0) { seen[o.id] = 1; out.push(said(o, opt.crew)); } });
    }
    if (traits.indexOf('raided') >= 0) {   /* the raid leaves one job, and it is the crew that hit it */
      take(all.filter(function (o) { return o.when === 'raided'; }), C.raided || 1);
      return out;
    }
    var n = Math.min(C[tier] || 1, C.max || 4);
    ['sickness', 'market_day'].forEach(function (t) {   /* what is happening here asks first */
      if (traits.indexOf(t) >= 0) take(all.filter(function (o) { return o.when === t; }), Math.min(n, out.length + 1));
    });
    take(all.filter(function (o) { return !o.when && (o.tiers || []).indexOf(tier) >= 0; }), n);
    return out;
  }
  root.BohemiaBoardShelf = { load: load, set: set, ready: function () { return !!SHELF; }, pick: pick,
    shelf: function () { return SHELF; } };
})(typeof window !== 'undefined' ? window : this);
