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
      .then(withMore).then(set).catch(function () { LOADING = false; });
  }
  /* WORLD [every job kind] (rule 153(b), 10/24): the people the job kinds' file adds for a kind no act-one design carries (a
     PATROL), appended to the shelf the same way a modder adds a row; a shelf without that file is the shelf as it was */
  function withMore(doc) {
    if (!doc || !Array.isArray(doc.offers)) return doc;
    return fetch('../records/target/BOHEMIA_JOB_KINDS.json').then(function (r) { return r.json(); }).then(function (k) {
      var more = (k && k.board_people && k.board_people.rows) || [], have = {};
      doc.offers.forEach(function (o) { have[o.id] = 1; });
      more.forEach(function (o) { if (o && o.id && !have[o.id] && /\{pay\}/.test(o.says || '')) doc.offers.push(o); });
      return doc; }).catch(function () { return doc; });
  }
  /* WORLD __THE_BOARD_GROWS_WITH_THE_DAYS__ (rule 255, 10/26): a place posts only what its day lets it post for the crew he has
     (WORLD's slices/bohemia_job_danger.js fits(): no job under the day's floor, at most the day's share of red ones); the reader
     lives in the map's frame, so a board in a place's screen asks the map's. No reader: the board deals as it always did */
  function fitter() { try { var W = root.BohemiaJobDanger || (root.parent && root.parent !== root && root.parent.BohemiaJobDanger); return W && W.fits ? W : null; } catch (e) { return null; } }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* a copy that is safe to hand around: {crew} said, the client copied */
  function said(o, crew) {
    var c = crew || 'a crew', x = {};
    for (var k in o) x[k] = o[k];
    x.client = {}; for (var j in o.client) x.client[j] = o.client[j];
    x.says = String(o.says).replace(/(^|[.!?]\s+)\{crew\}/g, function (m, p) { return p + cap(c); }).replace(/\{crew\}/g, c);
    return x;
  }
  /* ONE CONTRACT, ONE PLACE (RUN TWO 10/25, EYES [eyes: the job's real pay], rule 150: 'Haul eighty tyres to the co-op' stood on
     Church's and Mob's boards at once). Handed the valley's places (opt.places = [{name, tier, traits}], the map's own list, the
     same for the phone and every board), the shelf is DEALT across them in rounds, in an order the window turns: every place
     takes its first job before any takes a second, and a job one place posts no other place posts. Only a place the shelf
     has nothing left for gets one job somebody else also shows (a board is never empty), and the phone shows a job once. */
  var DEAL = { key: null, map: null };
  function dealt(day, opt) {
    var win = Math.floor((day || 0) / (SHELF.refresh_days || 3)), C = SHELF.counts || {};
    var FW = fitter(), key = win + '|' + (FW ? FW.fitVer() + '|' + (day | 0) : '') + '|' + (opt.held || []).join(',') + '|' + (opt.crew || '') + '|' + opt.places.map(function (p) { return p.name + ':' + p.tier + ':' + (p.traits || []).join('+'); }).join(';');
    if (DEAL.key === key) return DEAL.map;
    var order = opt.places.slice().sort(function (a, b) { return seedOf(a.name + ':order:' + win) - seedOf(b.name + ':order:' + win) || (a.name < b.name ? -1 : 1); });
    var taken = {}, map = {}, want = {};
    order.forEach(function (p) { map[p.name] = []; var tr = p.traits || []; want[p.name] = tr.indexOf('raided') >= 0 ? (C.raided || 1) : Math.min(C[p.tier || 'camp'] || 1, C.max || 4); });
    for (var round = 0; round < (C.max || 4); round++) order.forEach(function (p) {
      if (map[p.name].length > round || map[p.name].length >= want[p.name]) return;
      var got = pickOwn(p, day, { traits: p.traits || [], held: opt.held, crew: p.crew || opt.crew }, taken, map[p.name].length + 1, map[p.name]);
      got.forEach(function (o) { taken[o.id] = p.name; }); map[p.name] = got;
    });
    order.forEach(function (p) { if (!map[p.name].length) map[p.name] = pickOwn(p, day, { traits: p.traits || [], held: opt.held, crew: p.crew || opt.crew }, {}, 1, []); });
    DEAL = { key: key, map: map };
    return map;
  }
  function pick(place, day, opt) {
    if (!SHELF || !place) return null;
    opt = opt || {};
    if (Array.isArray(opt.places) && opt.places.length && opt.places.some(function (p) { return p && p.name === place.name; })) {
      var mine = dealt(day, opt)[place.name] || [];
      return mine.map(function (o) { return said(o, opt.crew); });
    }
    return pickOwn(place, day, opt, {}, null, []);
  }
  /* one place's own board: skipping what another place already posts ({id: place}), up to `upto` jobs (its tier's count when
     null), keeping the ones it already has first */
  function pickOwn(place, day, opt, taken, upto, have) {
    var C = SHELF.counts || {}, tier = place.tier || 'camp', traits = opt.traits || [], held = opt.held || [];
    var win = Math.floor((day || 0) / (SHELF.refresh_days || 3));
    var R = rng(seedOf(String(place.name) + ':board:' + win));
    var all = SHELF.offers, out = (have || []).slice(), seen = {};
    out.forEach(function (o) { seen[o.id] = 1; });
    var FW = fitter(), size = Math.min(C[tier] || 1, C.max || 4);   /* WORLD __THE_BOARD_GROWS_WITH_THE_DAYS__ */
    function take(pool, n) {
      if (upto != null) n = Math.min(n, upto);
      shuffled(pool, R).forEach(function (o) { if (out.length < n && !seen[o.id] && !taken[o.id] && held.indexOf(o.id) < 0 && !(FW && FW.fits(o, place.name, day, out, size) === false)) { seen[o.id] = 1; out.push(said(o, opt.crew)); } });
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
  /* the valley's places as the map knows them (its ctBases, mapTierOf and the living map's traits), for a page in the map's
     frame; the map hands the same list to a settlement screen it opens, so the phone and every board deal from one list */
  function mapPlaces(day) {
    try { var bs = ctBases(), out = [];
      Object.keys(bs).forEach(function (name) { var tier = 'camp', tr = [];
        try { tier = mapTierOf(name) || 'camp'; } catch (e) {}
        try { tr = BohemiaLivingMap.traitsFor(LIVING_MAP.traits, name, day).map(function (x) { return x.id; }); } catch (e) {}
        out.push({ name: name, tier: tier, traits: tr }); });
      return out.length ? out : null; } catch (e) { return null; }
  }
  root.BohemiaBoardShelf = { load: load, set: set, ready: function () { return !!SHELF; }, pick: pick, mapPlaces: mapPlaces,
    shelf: function () { return SHELF; } };
})(typeof window !== 'undefined' ? window : this);
