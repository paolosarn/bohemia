/* ==========================================================================
   __THE_PLACES_OWN_VISITS__ (WORLD 14, 11/8; VAMILY rule 436(b), ask line 521; rule 409(c))

   PAOLO 11/5: "research every building type in Pocket City 2... and see if you're missing any of those buildings."
   THE COORDINATOR 11/8 (rule 436(b)): the lab the beasts broke out of and the bank with its vault first, then the unemployment
   office and the hardware store; each a real Las Vegas place at its real spot, EACH WITH A USE (a job, a scavenge, a home base,
   a fight).

   MEASURED FIRST (records/BOHEMIA_WORLD_14_THE_PLACES_GET_THEIR_USE_11_8_26.md): WORLD TEN (11/6) seated all twelve places at
   their real spots and they open a settlement screen, but inside it they are any town: the scavenge deals the same six finds
   as a suburb (the place's own finds were never read), the jobs office hires nobody the office gives you, the bank's vault and
   the lab's pens are words in a data file. A name on a borrowed building.

   NOW, BATTLE BROTHERS' WAY OF ENTERING A LOCATION (a picture, a few lines, Attack! / Leave): arriving at one of these places, the
   person who is there talks (the road's own mouth card, slices/bohemia_road_events.js, a face that talks), and gives two or three
   choices with real costs, read from records/target/bb/real_places.json 'visit' (the one list a modder edits):
     TULE SPRINGS LAB   the night tech: OPEN PEN FOUR (a fight with the lab's dire wolves; the coolant cells and the feed if won),
                        READ THE BOARD (an hour: what broke out and from which bones; a post), WALK IN
     THE BANK           the last teller: DRILL THE BOXES (eight hours, a chance at the batteries people kept in them), RUN THE MEN
                        OFF THE UPPER FLOORS (a fight; what they had), WALK IN. The paper is worth nothing; the teller says so.
     UNEMPLOYMENT OFF.  THE LINE: a different man at the front every four days, his own trade and his own words; TAKE HIM ON (two
                        nights of food, he joins), HAND OUT FOOD DOWN THE LINE (the nearest town hears), WALK IN
     HOME CENTER x2     picked clean first, the way every real one was: SEARCH THE BACK / THE DOCK (four hours, a chance at
                        batteries and a hand tool), RUN THE CREW OUT OF THE LUMBER AISLE (a fight), WALK IN
   A choice made is gone ('once'), a fight's choice is gone when it is won ('won'), some come back ('every_days'). The card shows
   once a day at a place at most (once a man at the line), so a second arrival walks straight in; with only WALK IN left it never shows: the place opens like any town (rule 433: nothing shows that is not a question; rule 398: a card
   with nothing to decide is not a card).

   A SCRIPTED BROWSER IS NOT A PLAYER (CONTENT's rule in the road events): under automation the card shows only when a checker asks
   (window.__PLACE_VISITS_ON = true), so the hundred gates that walk into towns are not stopped by a teller; on a phone it always
   talks.

   Loaded by BOHEMIA_CITY_WORLD.html after bohemia_road_events.js (it needs the card) and bohemia_real_places.js (the list),
   wrapping loopOpenTown by name, so nothing else of the map changes.
     BohemiaPlaceVisits.placeOf(t)         the place a town record is (a valley place by its id, a region place by its name)
     BohemiaPlaceVisits.options(id)        the choices left there now, each { id, t, off, tag, in }
     BohemiaPlaceVisits.due(t)             true when arriving there shows the card
     BohemiaPlaceVisits.show(t)            the card now (the check's door)
     BohemiaPlaceVisits.choose(id, optId)  a choice, as a tap on it
     BohemiaPlaceVisits.status()           what was shown, chosen, fought and paid
   ========================================================================== */
(function (root) {
  'use strict';
  if (typeof loopOpenTown !== 'function') return;
  var KEY = 'bohemia.placevisits.v1', FOES = null, FIGHT = null;
  var PV = root.BohemiaPlaceVisits = { shown: 0, chosen: [], fought: [], paid: [], last: null, err: null, ON: true };

  function st() {
    var s = null; try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!s || typeof s !== 'object') s = {};
    if (!s.done || typeof s.done !== 'object') s.done = {};
    if (!s.seen || typeof s.seen !== 'object') s.seen = {};
    return s;
  }
  function put(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  try {   /* a new game forgets what was done at the places, the way the road forgets */
    if (typeof fogNewGame === 'function') { var _fng = fogNewGame;
      fogNewGame = function () { put({}); return _fng.apply(this, arguments); }; }
  } catch (e) {}
  PV.reset = function () { put({}); FIGHT = null; };
  PV.state = st;

  function day() { try { return loopDay() | 0; } catch (e) { return 0; } }
  function food() { try { var w = wagonGet(); return w ? (w.food | 0) : 0; } catch (e) { return 0; } }
  function bats() { try { return loopBats() | 0; } catch (e) { return 0; } }
  function men() { try { return crewCount() | 0; } catch (e) { return 1; } }
  function needOk(n) { if (!n) return true; if (n.bats && bats() < n.bats) return false; if (n.food && food() < n.food) return false; if (n.men && men() < n.men) return false; return true; }
  function RE() { return root.BohemiaRoadEvents || null; }
  function RP() { return root.BOH_REAL_PLACES || null; }
  function feed(who, txt) {
    try { if (root.BohemiaFeed && root.BohemiaFeed.mouth) { root.BohemiaFeed.mouth({ who: who, txt: txt, kind: 'world', draft: true }); return; } } catch (e) {}
    try { if (root.BOHEMIA_FEED) root.BOHEMIA_FEED.push({ who: who, txt: txt, kind: 'world', draft: true }); } catch (e) {}
  }
  function say(line) { try { if (line && typeof loopSay === 'function') loopSay(line); } catch (e) {} }

  /* which of the enemy factions are beasts (the roster's own flag), so a fight at the pens deals the lab's wolves as beasts */
  (function () { try { fetch('../records/target/bb/bohemia_enemies.json').then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) { if (j && j.factions) { FOES = {}; Object.keys(j.factions).forEach(function (k) { FOES[k] = !!j.factions[k].beast; }); } }).catch(function () {}); } catch (e) {} })();
  function beastFoe(f) { if (f === 'beasts') return true; if (FOES && f in FOES) return FOES[f];
    return /^(coyotes|lions|hogs|camels|bulls|wolves|hyenas|bears|sloths|sabres|prides|bison|horses|teratorns|dogs)$/.test(String(f)); }

  /* ---- the place a town record is ---- */
  function placeOf(t) {
    var R = RP(); if (!t || !R || !R.list) return null;
    var p = null;
    if (t.real && R.byId) p = R.byId[t.real] || null;
    if (!p && t.name) R.list.forEach(function (q) { if (!p && q && q.where === 'region' && q.name === t.name) p = q; });
    return (p && p.visit) ? p : null;
  }
  PV.placeOf = placeOf;
  function byId(id) { var R = RP(); return (R && R.byId && R.byId[id]) || null; }

  /* the line: who is at the front today (a new one every_days), and the words filled from him */
  function manOf(p) {
    var v = p.visit, L = v.line; if (!L || !L.length) return null;
    var k = Math.floor(day() / Math.max(1, v.every_days || 4));
    var m = L[((k % L.length) + L.length) % L.length];
    return { k: k, m: m };
  }
  function fill(x, m) {
    if (!m || x == null) return x;
    if (typeof x === 'string') return x.replace(/\{(name|says|look|bg|yes)\}/g, function (a, f) { return m[f] != null ? String(m[f]) : a; });
    if (Array.isArray(x)) return x.map(function (y) { return fill(y, m); });
    if (typeof x === 'object') { var o = {}; Object.keys(x).forEach(function (k) { o[k] = fill(x[k], m); }); return o; }
    return x;
  }
  function doneKey(p, o, man) { return p.id + ':' + o.id + (o.per_man && man ? ':' + man.k : ''); }
  function left(p, o, s, man) {
    if (o['in']) return true;
    var d = s.done[doneKey(p, o, man)];
    if (d == null) return true;
    if (o.once === true) return false;
    if (o.once === 'won') return d !== 'won';
    if (o.every_days) return typeof d === 'number' && day() - d >= o.every_days;
    if (o.per_man) return false;
    return true;
  }
  function tagOf(o, fx) {
    if (o['in']) return '';
    fx = fx || {};
    if (fx.fight) return 'A FIGHT';
    var t = [], cost = [];   /* what it costs first, then what it gives, then the hours: he never pays for a thing the chip hid */
    if (fx.bats < 0) cost.push(fx.bats + ' BAT');
    if (fx.food < 0) cost.push(fx.food + ' FOOD');
    if (fx.chance) t.push('A CHANCE');
    else if (fx.man && fx.man.n > 0) t.push('+1 MAN');
    else {
      if (fx.bats > 0) t.push('+' + fx.bats + ' BAT');
      if (fx.food > 0) t.push('+' + fx.food + ' FOOD');
      if (fx.gear && fx.gear !== -1) t.push('+GEAR');
      if (fx.mood && !t.length) t.push('THEY WILL HEAR');
    }
    if (fx.mins) t.push(fx.mins >= 60 ? Math.round(fx.mins / 60) + ' H' : fx.mins + ' MIN');
    return cost.concat(t).slice(0, 3).join(' · ');
  }
  function needSays(n) { var t = []; if (!n) return '';
    if (n.food && food() < n.food) t.push('NEED ' + n.food + ' FOOD'); if (n.bats && bats() < n.bats) t.push('NEED ' + n.bats + ' BAT'); if (n.men && men() < n.men) t.push('NEED ' + n.men + ' MEN');
    return t.join(' · '); }
  function options(id) {
    var p = byId(id); if (!p || !p.visit) return [];
    var s = st(), man = manOf(p), m = man ? man.m : null;
    return (p.visit.opts || []).filter(function (o) { return left(p, o, s, man); }).map(function (o) {
      var fx = fill(o.fx, m);
      var off = !needOk(o.need);   /* rule 438: never a silent button; a choice he cannot pay for says what it needs */
      return { id: o.id, t: fill(o.t, m), off: off, tag: off ? needSays(o.need) : tagOf(o, fx), 'in': !!o['in'] };
    });
  }
  PV.options = options;
  function scripted() { try { return !!(root.navigator && root.navigator.webdriver) && !root.__PLACE_VISITS_ON; } catch (e) { return false; } }
  function due(t) {
    if (!PV.ON) return false;
    var p = placeOf(t); if (!p || !RE() || !RE().card) return false;
    if (scripted()) return false;
    if (st().seen[p.id] === seenKey(p)) return false;   /* once a day at most, once a man in the line: the second arrival walks straight in */
    return options(p.id).some(function (o) { return !o['in']; });
  }
  function seenKey(p) { var man = manOf(p); return man ? 'm' + man.k : 'd' + day(); }
  PV.due = due;

  /* ---- the card ---- */
  var _open = loopOpenTown;
  function show(t) {
    var p = placeOf(t); if (!p) return false;
    var v = p.visit, man = manOf(p), m = man ? man.m : null, who = fill(v.who || {}, m);
    var s = st(); s.seen[p.id] = seenKey(p); put(s);
    PV.shown++; PV.last = { id: p.id, at: Date.now(), man: m ? m.name : null };
    try { if (typeof travelStop === 'function') travelStop(); } catch (e) {}
    RE().card({ look: who.look, name: who.name, from: who.from, text: fill(v.says, m), head: v.head || p.name,
      opts: options(p.id).map(function (o) { return { t: o.t, tag: o.tag, off: o.off, fn: function () { choose(p.id, o.id, t); } }; }) });
    return true;
  }
  PV.show = show;

  function choose(id, optId, t) {
    var p = byId(id); if (!p || !p.visit) return null;
    var o = (p.visit.opts || []).filter(function (x) { return x.id === optId; })[0]; if (!o) return null;
    var s = st(), man = manOf(p), m = man ? man.m : null;
    if (!left(p, o, s, man)) return null;
    if (!o['in'] && !needOk(o.need)) return null;
    var who = fill(p.visit.who || {}, m), r = RE();
    PV.chosen.push({ id: id, opt: optId, day: day(), man: m ? m.name : null });
    try { if (typeof DAY !== 'undefined' && DAY.happened) DAY.happened(who.name + ' at ' + p.name + ': ' + fill(o.t, m), 'place'); } catch (e) {}
    if (o['in']) { try { r.close(false); } catch (e) {} return _open(t || { name: p.name, real: p.id }); }
    var fx = JSON.parse(JSON.stringify(fill(o.fx || {}, m)));
    var key = doneKey(p, o, man);
    if (o.once === true || o.every_days || o.per_man) { s.done[key] = day(); put(s); }
    if (fx.fight) {
      try { r.close(false); } catch (e) {}
      var f = fx.fight; delete fx.fight;
      if (Object.keys(fx).length) r.apply(fx, { id: 'place:' + id, name: who.name });
      return fightAt(p, o, f, who, key);
    }
    fx = luck(fx);
    var post = fx.post || null; delete fx.post;
    var res = r.apply(fx, { id: 'place:' + id, name: who.name, why: p.name.toLowerCase() + ': ' + String(fill(o.t, m)).toLowerCase() });
    PV.paid.push({ id: id, opt: optId, got: res.got || [] });
    if (post && post.txt) feed(post.who || '@' + id, post.txt);
    r.card({ quiet: true, look: who.look, name: who.name, from: who.from, text: res.say || '...', got: res.got, head: p.visit.head || p.name,
      opts: [{ t: 'GO ON', fn: function () { r.close(); } }] });
    try { if (typeof render === 'function') render(); } catch (e) {}
    return res;
  }
  PV.choose = choose;

  /* a chance is rolled HERE and its branch laid over the choice's own cost (the road's apply() returns at a chance and would drop
     the eight hours the bank's boxes take: measured, the clock did not move) */
  function luck(fx) {
    if (!fx || !fx.chance) return fx;
    var c = fx.chance, b = Math.random() < (+c.p || 0.5) ? (c.yes || {}) : (c.no || {}), o = {};
    Object.keys(fx).forEach(function (k) { if (k !== 'chance') o[k] = fx[k]; });
    Object.keys(b).forEach(function (k) { o[k] = (typeof o[k] === 'number' && typeof b[k] === 'number' && k !== 'mins') ? o[k] + b[k] : b[k]; });
    PV.rolled = (PV.rolled | 0) + 1;
    return o;
  }
  PV.luck = luck;

  /* ---- a fight here, through the one door (the job system's way: the game's party math, the foe's own kind) ---- */
  function fightAt(p, o, f, who, key) {
    var w = [0, 0]; try { w = [city.x | 0, city.y | 0]; w = roadWhere(); } catch (e) {}
    var party = null; try { party = partyMath('job', { skulls: f.skulls || 1 }); } catch (e) { party = { count: 3, days: 1, difficulty: 1 }; }
    var n = f.n === 'party' ? party.count : ((f.n | 0) || party.count);
    party.count = Math.max(1, n | 0); try { party.word = partyWord(party.count); } catch (e) {}
    party.faction = f.foe || 'brigands';
    var beast = beastFoe(party.faction), roster = [];
    for (var i = 0; i < party.count; i++) roster.push({ arch: beast ? 'beast' : 'human' });
    FIGHT = { id: p.id, opt: o.id, f: f, who: who, key: key, won: o.once === 'won', at: Date.now() };
    /* FIXES 11/10 (ask row 551, EYES: the Mob Museum's COLLECT A DEBT came home 'THE RAIDERS ARE DOWN'): the place's own name for
       its enemy ('the men who owe the family') rides with the fight to the end screen, the way a job's leg sends its own (row 530) */
    var msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: f.label || p.name, foe: f.label || null, faction: null, draft: true,
      packageId: (typeof LOOP !== 'undefined' && LOOP.start && LOOP.start.pkg != null) ? LOOP.start.pkg : 1, roster: roster, party: party, street: true,
      why: 'place:' + p.id + ':' + o.id, at: { gx: w[0] | 0, gy: w[1] | 0 } };
    PV.lastFight = { id: p.id, opt: o.id, faction: party.faction, n: party.count, beast: beast, label: msg.label };
    var ok = false; try { ok = cityHandOver(msg); } catch (e) { PV.err = String(e && e.message || e); ok = false; }
    if (!ok) { FIGHT = null; return false; }
    PV.fought.push({ id: p.id, opt: o.id, faction: party.faction, n: party.count });
    return true;
  }
  function ended(o) {
    if (!FIGHT) return null;
    var F = FIGHT; FIGHT = null;
    o = o || {};
    var won = !!(o.victory || o.result === 'win') && !((o.alive | 0) > 0 && o.withdrew);
    var fx = won ? (F.f.win || {}) : (F.f.lose || {});
    if (o.withdrew || o.retreated) fx = {};   /* a run for the edge is no loss (RUN SIX, rule 413(d)), the road's own rule */
    if (won && F.won) { var s = st(); s.done[F.key] = 'won'; put(s); }
    fx = luck(JSON.parse(JSON.stringify(fx))); var post = fx.post || null; delete fx.post;
    var r = RE() ? RE().apply(fx, { id: 'place:' + F.id, name: F.who.name }) : { say: fx.say || '', got: [] };
    if (post && post.txt) feed(post.who || '@' + F.id, post.txt);
    PV.paid.push({ id: F.id, opt: F.opt, won: won, got: r.got || [] });
    var line = (F.who.name ? F.who.name + ': ' : '') + (r.say || (won ? 'They are down.' : 'You got out of it.')) + (r.got && r.got.length ? ' (' + r.got.join(', ') + ')' : '');
    setTimeout(function () { say(line); }, 900);   /* draft:true */
    feed('@theroad', line);
    return { won: won, got: r.got || [] };
  }
  PV.ended = ended;
  root.addEventListener && root.addEventListener('message', function (ev) {
    var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_CITY_COMBAT_END' || !FIGHT) return;
    try { if (LOOP.fighting) return; } catch (e) {}
    ended(d.outcome || {});
  });

  /* ---- arriving: the card first when a choice is left, the place's screen otherwise ---- */
  loopOpenTown = function (t) {
    var camping = false; try { camping = !!(root.CAMP && root.CAMP.on); } catch (e) {}   /* a camp at a place's edge opens its screen: the camp's, never the visit (row 606, the card waits for the camp) */
    try { if (!camping && due(t) && show(t)) return null; } catch (e) { PV.err = String(e && e.message || e); }
    return _open.apply(this, arguments);
  };
  PV.open = function (t) { return _open(t); };

  /* ---- THE LAB READS AS A LAB: a region place may name the look it borrows ('region_trade' in the file) ----
     MEASURED: the region paints its places from their words (vbRegionTrade: 'solar', 'works', 'prison'...) and the lab's words
     matched nothing, so it stood as a hill town, houses behind a wall. Reuse first (rule 430): it borrows the region's own compound
     look (the test site's: long blind blocks and containers behind a fence) until COOK FOUR's golden piece (rule 408). The patch
     already painted before the list landed is asked again, once. */
  (function () {
    if (typeof vbRegionTrade !== 'function') return;
    var _trade = vbRegionTrade;
    function tradeOf(name) { var R = RP(), out = null; ((R && R.list) || []).forEach(function (q) { if (!out && q && q.where === 'region' && q.name === name && q.region_trade) out = q.region_trade; }); return out; }
    vbRegionTrade = function (p) { var t = p && p.name ? tradeOf(p.name) : null; return t || _trade.apply(this, arguments); };
    PV.tradeOf = tradeOf;
    var tries = 0, iv = setInterval(function () {
      var R = RP(); if (++tries > 120) { clearInterval(iv); return; }
      if (!R || !R.loaded) return;
      clearInterval(iv);
      try { if (typeof VBT !== 'undefined' && VBT.tiles) { var drop = []; VBT.tiles.forEach(function (v, k) { (R.list || []).forEach(function (q) { if (q.region_trade && String(k).indexOf('rp:' + q.name + ':') === 0) drop.push(k); }); });
        drop.forEach(function (k) { VBT.tiles['delete'](k); }); PV.repainted = drop.length; if (drop.length && typeof render === 'function') render(); } } catch (e) {}
    }, 500);
  })();

  PV.status = function () {
    var R = RP(), out = { shown: PV.shown, chosen: PV.chosen.slice(-20), fought: PV.fought.slice(-10), paid: PV.paid.slice(-20), last: PV.last, lastFight: PV.lastFight || null, err: PV.err, places: [] };
    ((R && R.list) || []).forEach(function (p) { if (p.visit) out.places.push({ id: p.id, name: p.name, left: options(p.id).map(function (o) { return o.id; }) }); });
    return out;
  };
})(window);
