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
   A BOARD IS NEVER EMPTY (PLUMBER 3, rule 335): the day's floor and the done list thin it, the last job always stands.
     BohemiaBoardShelf.load(url, cb)   fetch the shelf once (default ../records/target/BOHEMIA_BOARD_SHELF.json)
     BohemiaBoardShelf.ready()         the shelf is in
     BohemiaBoardShelf.pick(place, day, opt)  place {name, tier}; opt {traits:[ids], held:[ids], done:[ids, oldest first], crew:'the Cartel'}
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
  /* __A_POSTED_JOB_STAYS_POSTED__ (JOBS 11/11, EYES ask row 610: 'A BOARD RE-DEALS BETWEEN TWO VISITS 43 GAME MINUTES APART: the sloth
     and substation jobs gone, two new ones; a job he read and left to prepare for vanishes'). The deal is keyed by the day's floor,
     which reads his crew and the day (a hire, a wound, a level, the day turning at 22:00, a town's trait), and every new key drew a
     new board from the window's shuffle. Battle Brothers keeps a contract on a settlement's board until it runs out. NOW what a place
     posted stays posted for its window (refresh_days) while nobody has taken it, in this campaign: a new deal keeps it first and
     fills the rest; a place raided since deals again (the raid is news); and the day's floor still stands (rule 255): a job it now
     keeps back for this crew comes off, said by the floor's own rule, never by a re-shuffle. */
  var POSTKEY = 'bohemia.board.posted.v1';
  function postedGet() { try { var m = JSON.parse(root.localStorage.getItem(POSTKEY) || '{}'); return m && typeof m === 'object' ? m : {}; } catch (e) { return {}; } }
  function postedPut(m) { try { root.localStorage.setItem(POSTKEY, JSON.stringify(m)); } catch (e) {} }
  var READKEY = 'bohemia.board.read.v1';   /* __A_READ_BOARD_STAYS_READ__: what he read, by town, its own record (a deal for another day never writes it) */
  function readGet() { try { var m = JSON.parse(root.localStorage.getItem(READKEY) || '{}'); return m && typeof m === 'object' ? m : {}; } catch (e) { return {}; } }
  function readPut(m) { try { root.localStorage.setItem(READKEY, JSON.stringify(m)); } catch (e) {} }
  function campaign() { try { var w = root.WORLD_SEED; if (w == null && root.parent && root.parent !== root) w = root.parent.WORLD_SEED; return String(w || ''); } catch (e) { return ''; } }
  function dealt(day, opt) {
    var win = Math.floor((day || 0) / (SHELF.refresh_days || 3)), C = SHELF.counts || {};
    var FW = fitter(), key = win + '|' + (FW ? FW.fitVer() + '|' + (day | 0) : '') + '|' + (opt.held || []).join(',') + '|' + (opt.done || []).join(',') + '|' + (opt.crew || '') + '|' + opt.places.map(function (p) { return p.name + ':' + p.tier + ':' + (p.traits || []).join('+'); }).join(';');
    if (DEAL.key === key) return DEAL.map;
    var order = opt.places.slice().sort(function (a, b) { return seedOf(a.name + ':order:' + win) - seedOf(b.name + ':order:' + win) || (a.name < b.name ? -1 : 1); });
    var taken = {}, map = {}, want = {};
    order.forEach(function (p) { map[p.name] = []; var tr = p.traits || []; want[p.name] = tr.indexOf('raided') >= 0 ? (C.raided || 1) : Math.min(C[p.tier || 'camp'] || 1, C.max || 4); });
    var MEMO = postedGet(), camp = campaign(), byId = {}, held = opt.held || [], done = opt.done || [], frozen = {};   /* __A_POSTED_JOB_STAYS_POSTED__ */
    SHELF.offers.forEach(function (o) { byId[o.id] = o; });
    var READ = readGet(), wasRead = function (n) { var r = READ[n]; return !!(r && r.win === win && r.camp === camp); };
    var readFirst = order.slice().sort(function (a, b) { return (wasRead(b.name) ? 1 : 0) - (wasRead(a.name) ? 1 : 0); });   /* a board he read keeps its people before any other place's memory claims one */
    readFirst.forEach(function (p) { var m = wasRead(p.name) ? { win: win, camp: camp, ids: READ[p.name].ids, seen: true } : MEMO[p.name]; if (!m || m.win !== win || m.camp !== camp) return;
      if (m.seen) {   /* __A_READ_BOARD_STAYS_READ__ (JOBS 11/14, rule 447(b), row 610 again: 'a board he has read stays what he read until its
         time is up'): once his eyes were on it, the board is what he read until its window ends: no floor, no news, no new face; only a
         job he took or finished leaves it */
        (m.ids || []).forEach(function (id) { var o = byId[id]; if (!o || taken[id] || held.indexOf(id) >= 0 || done.indexOf(id) >= 0 || (o.rival && (held.indexOf(o.rival) >= 0 || done.indexOf(o.rival) >= 0))) return;
          taken[id] = p.name; map[p.name].push(said(o, p.crew || opt.crew)); });
        if (map[p.name].length) { want[p.name] = map[p.name].length; frozen[p.name] = 1; return; } }
      if ((p.traits || []).indexOf('raided') >= 0) return;
      (m.ids || []).forEach(function (id) { var o = byId[id]; if (!o || taken[id] || held.indexOf(id) >= 0 || done.indexOf(id) >= 0 || map[p.name].length >= want[p.name] || o.when || (o.rival && (held.indexOf(o.rival) >= 0 || done.indexOf(o.rival) >= 0))) return;
        if (o.towns && o.towns.indexOf(p.name) < 0) return;
        if (FW && FW.fits(o, p.name, day, map[p.name], want[p.name]) === false) return;   /* rule 255 stands: what the day's floor now keeps back comes off */
        taken[id] = p.name; map[p.name].push(said(o, p.crew || opt.crew)); }); });
    for (var round = 0; round < (C.max || 4); round++) order.forEach(function (p) {
      if (frozen[p.name] || map[p.name].length > round || map[p.name].length >= want[p.name]) return;
      var got = pickOwn(p, day, { traits: p.traits || [], held: opt.held, done: opt.done, crew: p.crew || opt.crew }, taken, map[p.name].length + 1, map[p.name]);
      got.forEach(function (o) { taken[o.id] = p.name; }); map[p.name] = got;
    });
    order.forEach(function (p) { if (!map[p.name].length) map[p.name] = pickOwn(p, day, { traits: p.traits || [], held: opt.held, done: opt.done, crew: p.crew || opt.crew }, {}, 1, [], true); });   /* the last pass: never empty (rule 335) */
    order.forEach(function (p) { MEMO[p.name] = { win: win, camp: camp, ids: map[p.name].map(function (o) { return o.id; }) }; }); postedPut(MEMO);   /* __A_POSTED_JOB_STAYS_POSTED__ */
    DEAL = { key: key, map: map };
    return map;
  }
  /* __A_READ_BOARD_STAYS_READ__: the town's screen says when his eyes are on a board (BohemiaSettlement's boardHere); the ids are what
     he read, kept for the window */
  function seen(name, ids, day) {
    if (!SHELF || !name) return; var win = Math.floor((day || 0) / (SHELF.refresh_days || 3)), M = readGet(), m = M[name], camp = campaign();
    if (m && m.win === win && m.camp === camp) return;   /* the first look is what he read */
    M[name] = { win: win, camp: camp, ids: (ids || []).slice() }; readPut(M); DEAL.key = null;
  }
  function pick(place, day, opt) {
    if (!SHELF || !place) return null;
    opt = opt || {};
    if (Array.isArray(opt.places) && opt.places.length && opt.places.some(function (p) { return p && p.name === place.name; })) {
      var mine = dealt(day, opt)[place.name] || [];
      return mine.map(function (o) { return said(o, opt.crew); });
    }
    return pickOwn(place, day, opt, {}, null, [], true);
  }
  /* one place's own board: skipping what another place already posts ({id: place}), up to `upto` jobs (its tier's count when
     null), keeping the ones it already has first; `last` (the deal's last pass, or a place dealt alone): never empty (rule 335) */
  function pickOwn(place, day, opt, taken, upto, have, last) {
    var C = SHELF.counts || {}, tier = place.tier || 'camp', traits = opt.traits || [], held = opt.held || [], done = opt.done || [];
    var win = Math.floor((day || 0) / (SHELF.refresh_days || 3));
    var R = rng(seedOf(String(place.name) + ':board:' + win));
    var all = SHELF.offers, out = (have || []).slice(), seen = {}, kept = [];
    out.forEach(function (o) { seen[o.id] = 1; });
    var FW = fitter(), size = Math.min(C[tier] || 1, C.max || 4);   /* WORLD __THE_BOARD_GROWS_WITH_THE_DAYS__ */
    function free(o) { return !seen[o.id] && !taken[o.id] && held.indexOf(o.id) < 0 && done.indexOf(o.id) < 0 && !(o.rival && (held.indexOf(o.rival) >= 0 || done.indexOf(o.rival) >= 0)); }   /* JOBS 11/14: a job two towns bid on is gone from both once he takes either */
    function take(pool, n) {
      if (upto != null) n = Math.min(n, upto);
      shuffled(pool, R).forEach(function (o) { if (out.length >= n || !free(o)) return;
        if (FW && FW.fits(o, place.name, day, out, size) === false) { kept.push(o); return; }   /* under the day's floor: kept back, not lost (rule 335) */
        seen[o.id] = 1; out.push(said(o, opt.crew)); });
    }
    var ordinary = all.filter(function (o) { return !o.when && (o.tiers || []).indexOf(tier) >= 0 && (!o.towns || o.towns.indexOf(String(place.name)) >= 0); }),
      own = ordinary.filter(function (o) { return !!o.towns; });   /* JOBS 11/11 (rule 425): a job that fits its town is posted there only, and the town's own person asks first, one of them */
    if (traits.indexOf('raided') >= 0) {   /* the raid leaves one job, and it is the crew that hit it */
      var raid = all.filter(function (o) { return o.when === 'raided'; });
      take(raid, C.raided || 1);
      /* PLUMBER 3 (rule 335): the crew that hit it past what the day lets his company take (all four raid jobs are fights of three
         to six men; a new crew of three reads every one under day ten's floor), the place's own ordinary work stands instead */
      if (!out.length) take(ordinary, C.raided || 1);
      return never(out, kept, raid.concat(ordinary));
    }
    var n = Math.min(C[tier] || 1, C.max || 4);
    ['sickness', 'market_day'].forEach(function (t) {   /* what is happening here asks first */
      if (traits.indexOf(t) >= 0) take(all.filter(function (o) { return o.when === t; }), Math.min(n, out.length + 1));
    });
    if (own.length) take(own, Math.min(n, out.length + 1));
    take(ordinary, n);
    return never(out, kept, ordinary);
    /* *** THE BOARDS ALWAYS HAVE WORK (PLUMBER 3, rule 335, Paolo 11/2: 'no one has any jobs anymore... make sure it doesn't
       happen again'). The day's floor (rule 255) THINS a board, it never EMPTIES one. In the deal's last pass, after a job another
       place also shows (the floor still asked): a place whose every job the floor kept back posts the least dangerous of them (its
       red stars and its blood say so); a place whose every job is done posts the one he finished longest ago (a held job never).
       Gate: gates/the_boards_always_have_work_gate.js *** */
    function never(out, kept, pool) {
      if (out.length || !last) return out;   /* mid-deal a place with nothing takes a job another place shows first (the last pass) */
      if (kept.length) {
        var best = null, bc = -1;
        kept.forEach(function (o) { var Q = null; try { Q = FW && FW.peek ? FW.peek(o, place.name) : null; } catch (e) { Q = null; }
          var c = Q && Q.state === 'read' ? +Q.clean : 0; if (c > bc) { bc = c; best = o; } });
        if (best) { out.push(said(best, opt.crew)); return out; }
      }
      for (var i = 0; i < done.length; i++) {   /* done is oldest first */
        var id = done[i], o = null; if (held.indexOf(id) >= 0 || taken[id]) continue;
        pool.forEach(function (p) { if (!o && p.id === id) o = p; });
        if (o) { out.push(said(o, opt.crew)); return out; }
      }
      return out;
    }
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
  root.BohemiaBoardShelf = { load: load, set: set, ready: function () { return !!SHELF; }, pick: pick, mapPlaces: mapPlaces, seen: seen,
    shelf: function () { return SHELF; } };
})(typeof window !== 'undefined' ? window : this);
