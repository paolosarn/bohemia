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
      return doc; }).catch(function () { return doc; })
      .then(function (d) { return fetch('../records/target/bb/job_clout.json').then(function (r) { return r.json(); }).then(function (c) { if (d && c && c.needs && c.needs.value) d.clout_needs = c.needs.value; if (d && c && c.fade && c.fade.value != null) d.clout_fade = +c.fade.value; return d; }).catch(function () { return d; }); });   /* __THE_BIG_WORK_WAITS_FOR_A_NAME__ */
  }
  /* WORLD __THE_BOARD_GROWS_WITH_THE_DAYS__ (rule 255, 10/26): a place posts only what its day lets it post for the crew he has
     (WORLD's slices/bohemia_job_danger.js fits(): no job under the day's floor, at most the day's share of red ones); the reader
     lives in the map's frame, so a board in a place's screen asks the map's. No reader: the board deals as it always did */
  /* JOBS 11/17 (rule 453 (1), __THE_TOWN_REMEMBERS__): what a town offers by how it feels about him (BohemiaJobPay.board: the bar, the
     wiki's access, relations.json board): its top skulls, its count at Hostile, one more from Friendly up; no reader, no change */
  function trust(name, day) { try { var P = root.BohemiaJobPay || (root.parent && root.parent !== root && root.parent.BohemiaJobPay); return P && P.board ? P.board(name, day) : null; } catch (e) { return null; } }
  function trusted(o, T) { return !T || ((o.skulls | 0) || 1) <= T.maxSkulls; }
  function sized(n, T, C) { if (!T) return n; if (T.cap != null) return Math.min(n, T.cap); return Math.min(n + (T.more | 0), C.max || 4); }
  /* __THE_BIG_WORK_WAITS_FOR_A_NAME__ (JOBS 11/18, rule 453): Battle Brothers' 'the more difficult Contracts people will entrust you'
     with Renown, and its fortified towns' work behind Professional (1050): records/target/bb/job_clout.json needs (by tier and skulls),
     read against the company's CLOUT (BohemiaRenown, this frame's or the map's). No reader or no file: nothing waits. WAITS keeps, per
     place, the least CLOUT that would open more of its work, for the board's one label. */
  function clout() { try { var R = root.BohemiaRenown || (root.parent && root.parent !== root && root.parent.BohemiaRenown); return R && R.score ? R.score() : null; } catch (e) { return null; } }
  function needOf(o, tier) { var N = SHELF && SHELF.clout_needs && SHELF.clout_needs[tier]; return N ? (+N[String((o.skulls | 0) || 1)] || 0) : 0; }
  function cloutLevel(have) { if (have == null || !SHELF || !SHELF.clout_needs) return ''; var n = 0; Object.keys(SHELF.clout_needs).forEach(function (t) { var N = SHELF.clout_needs[t]; Object.keys(N).forEach(function (k) { if (have >= +N[k]) n++; }); }); return 'c' + n; }
  var WAITS = {};
  /* the board's line, worked out each time it is asked (JOBS 11/20: a board held whole from what it posted for its window never ran
     pickOwn, so its line was missing): the place's own work that waits for a name, the least CLOUT that opens more of it */
  function waits(name, tier, day) {
    if (!SHELF || tier == null) return WAITS[String(name)] || null;
    var CL = clout(); if (CL == null || !SHELF.clout_needs) return null;
    var TR = trust(String(name), day), need = 0;
    SHELF.offers.forEach(function (o) { if (o.when || (o.tiers || []).indexOf(tier) < 0 || (o.towns && o.towns.indexOf(String(name)) < 0) || !trusted(o, TR)) return;
      var nd = needOf(o, tier); if (CL < nd) need = need ? Math.min(need, nd) : nd; });
    return need ? { need: need, have: CL } : null;
  }
  /* JOBS 2 11/26 __THE_WORK_FOLLOWS_WHAT_IS_SHORT__ (rule 485(b)): the map's read of what the valley is short of (BohemiaJobKinds.short,
     the valley's own ledger), from a board's page or the map's own */
  function shortJK() { try { var J = root.BohemiaJobKinds || (root.parent && root.parent !== root && root.parent.BohemiaJobKinds); return J && J.short && J.shortNow ? J : null; } catch (e) { return null; } }
  function shortSig() { var J = shortJK(); try { return J ? J.shortNow().join('+') : ''; } catch (e) { return ''; } }
  function fitter() { try { var W = root.BohemiaJobDanger || (root.parent && root.parent !== root && root.parent.BohemiaJobDanger); return W && W.fits ? W : null; } catch (e) { return null; } }
  /* JOBS 2 11/27 __EVERY_KIND_HE_MEETS__ (rule 494(a)(b), Paolo 11/27: 'in Battle Brothers there's so many different quest types... I
     haven't seen one caravan quest'). MEASURED (tools/bohemia_jobs_the_kinds_he_meets.js, a run like his on these boards, campaign
     K7QM9X): of the nine kinds the map plays, CLEAR A CAMP and PATROL were first offered on day 18 and HUNT A KIND four times in fifteen
     days, while a fortress's board could be two caravans and nothing else. NOW, read from the job kinds' own kindOf (the map's): a
     board takes a kind it does not hold yet before a second of one it does (a board mixes kinds), and in the draft each place's first
     pick past its news and its own person is the least dangerous job of a kind the map plays that no place in the valley has drafted
     this window (every kind on offer somewhere, early). No reader: the boards deal as they did. */
  function kindsJK() { try { var J = root.BohemiaJobKinds || (root.parent && root.parent !== root && root.parent.BohemiaJobKinds); return J && J.kindOf && J.built ? J : null; } catch (e) { return null; } }
  var BYID = { shelf: null, map: null };
  function offerById(id) { if (!SHELF) return null; if (BYID.shelf !== SHELF || BYID.n !== SHELF.offers.length) { BYID = { shelf: SHELF, n: SHELF.offers.length, map: {} }; SHELF.offers.forEach(function (o) { BYID.map[o.id] = o; }); } return BYID.map[id] || null; }
  function kindOfJ(KJ, o) { try { return KJ.kindOf(o); } catch (e) { return null; } }
  /* how many jobs of a kind the shelf holds (counted once a shelf): the scarce kinds are dealt first */
  var KHELD = { shelf: null, n: 0, map: null };
  function kindsHeld(KJ, k) { if (!SHELF) return 0; if (KHELD.shelf !== SHELF || KHELD.n !== SHELF.offers.length) { KHELD = { shelf: SHELF, n: SHELF.offers.length, map: {} };
      SHELF.offers.forEach(function (o) { var x = kindOfJ(KJ, o); if (x) KHELD.map[x] = (KHELD.map[x] || 0) + 1; }); } return KHELD.map[k] || 0; }
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
  /* JOBS 11/20 (__THE_TOWNS_BAR_ON_ITS_BOARD__): the towns' bars size the boards (trust, 11/17), so a bar that moved deals again (a
     board dealt at Neutral kept a Neutral size after the town turned Friendly or Cold until something else changed the key; measured
     with the cache: Anarchists 2 people at Neutral and at Friendly; without it, 2 and 3). The towns' own record and what is still on its
     way to it, read raw (no parse): a posted job stays posted (__A_POSTED_JOB_STAYS_POSTED__) and a read board stays read */
  function barsSig() { try { var L = root.localStorage; return (L.getItem('bohemia.relations.v1') || '') + '#' + (L.getItem('bohemia.job.settled.v1') || ''); } catch (e) { return ''; } }
  /* JOBS 2 11/26 __A_JOB_HAS_ONE_DOOR__ (ask row 698, FOUND BY PLUMBER 8, EVERY CHANGE AT SIXTY C2: 'the board deals a job to a
     different town depending on when its danger read comes in'; one valley, one day, the same jobs: qd-s04 at Caravans one way, at the
     Mob the other). MEASURED: the deal asked the day's floor (BohemiaJobDanger.fits) as it drafted, and the floor says null while a job
     is reading and false once its read is under the floor: a job the floor kept from one place went on to the next place in the draft,
     and what a place posted while its jobs were still reading stayed posted (MEMO), so the door a job stood at followed the order the
     phone read them in. NOW TWO STEPS. THE DRAFT, from the valley and the day only (the places, their tiers, traits and bars, his name,
     what he holds and has done, the window, the rare roll; never a read): in rounds every place drafts its board's count, then its
     next few, a job in one place's list and no other's; MEMO keeps the lists, so nothing a phone read while reading is remembered.
     THE POSTING, on every ask, from the reads as they stand: each place posts from its own list what the floor lets through; a place
     the floor left short then takes, the floor asked, work no place posts (rule 255: the place posts its next); a place with nothing
     posts the least dangerous of what was kept back (rule 335). The same reads post the same boards whatever order they came in
     (gates/a_job_has_one_door_gate.js). A board he has read stays what he read (__A_READ_BOARD_STAYS_READ__). */
  var DRAFT = { key: null }, RESERVE = 4;
  function draft(day, opt) {
    var win = Math.floor((day || 0) / (SHELF.refresh_days || 3)), C = SHELF.counts || {};
    var key = win + '|' + (day | 0) + '|' + (opt.held || []).join(',') + '|' + (opt.done || []).join(',') + '|' + (opt.crew || '') + '|' + cloutLevel(clout()) + '|' + barsSig() + '|' + shortSig() + '|' + opt.places.map(function (p) { return p.name + ':' + p.tier + ':' + (p.traits || []).join('+'); }).join(';');
    if (DRAFT.key === key) return DRAFT;
    var order = opt.places.slice().sort(function (a, b) { return seedOf(a.name + ':order:' + win) - seedOf(b.name + ':order:' + win) || (a.name < b.name ? -1 : 1); });
    var taken = {}, own = {}, want = {}, frozen = {}, dup = {};
    order.forEach(function (p) { own[p.name] = []; var tr = p.traits || []; want[p.name] = tr.indexOf('raided') >= 0 ? (C.raided || 1) : sized(Math.min(C[p.tier || 'camp'] || 1, C.max || 4), trust(p.name, day), C); });   /* __THE_TOWN_REMEMBERS__ */
    var MEMO = postedGet(), camp = campaign(), byId = {}, held = opt.held || [], done = opt.done || [];   /* __A_POSTED_JOB_STAYS_POSTED__ */
    SHELF.offers.forEach(function (o) { byId[o.id] = o; });
    var READ = readGet(), wasRead = function (n) { var r = READ[n]; return !!(r && r.win === win && r.camp === camp); };
    var gone = function (o) { return held.indexOf(o.id) >= 0 || done.indexOf(o.id) >= 0 || (o.rival && (held.indexOf(o.rival) >= 0 || done.indexOf(o.rival) >= 0)); };
    var readFirst = order.slice().sort(function (a, b) { return (wasRead(b.name) ? 1 : 0) - (wasRead(a.name) ? 1 : 0); });   /* a board he read keeps its people before any other place's memory claims one */
    readFirst.forEach(function (p) { var m = wasRead(p.name) ? { win: win, camp: camp, ids: READ[p.name].ids, seen: true } : MEMO[p.name]; if (!m || m.win !== win || m.camp !== camp) return;
      if (m.seen) {   /* __A_READ_BOARD_STAYS_READ__: the board is what he read until its window ends; only a job he took or finished leaves it */
        (m.ids || []).forEach(function (id) { var o = byId[id]; if (!o || taken[id] || gone(o)) return; taken[id] = p.name; own[p.name].push(said(o, p.crew || opt.crew)); });
        if (own[p.name].length) { frozen[p.name] = 1; return; } }
      if ((p.traits || []).indexOf('raided') >= 0) return;   /* a place raided since deals again (the raid is news) */
      (m.ids || []).forEach(function (id) { var o = byId[id]; if (!o || taken[id] || gone(o) || own[p.name].length >= want[p.name] + RESERVE || o.when) return;
        if (o.towns && o.towns.indexOf(p.name) < 0) return;
        taken[id] = p.name; own[p.name].push(said(o, p.crew || opt.crew)); }); });
    var po = function (p, extra) { return { traits: p.traits || [], held: opt.held, done: opt.done, crew: p.crew || opt.crew, draft: true, reserve: !!extra }; };
    for (var round = 0; round < (C.max || 4); round++) order.forEach(function (p) {   /* the boards' counts first: every place its first before any its second */
      if (frozen[p.name] || own[p.name].length > round || own[p.name].length >= want[p.name]) return;
      var got = pickOwn(p, day, po(p), taken, own[p.name].length + 1, own[p.name]);
      got.forEach(function (o) { taken[o.id] = p.name; }); own[p.name] = got; });
    /* __EVERY_KIND_HE_MEETS__ (JOBS 2 11/27, rule 494(b)): THE VALLEY'S PASS. Every kind with a play of its own (the nine: escort, find a
       place, find a person, hunt, camp, carry, hold, recover, patrol) that no board drafted this window, the scarcest first, is asked of
       the places in the draft's order: the first that can offer one (its tier, its trust, his name, the rare roll) puts its least
       dangerous job up, in an empty slot, or in place of its last job when that job repeats a kind on its board or is played by legs
       (never its news or its own person). MEASURED on the demo (EYES' sweep, no name, 88 days): asked place by place inside each
       board, the news and the town's own person filled the slots first and hunting, a camp and holding came on days 10, 28 or never */
    var KJd = kindsJK(); if (KJd) { var D0 = null; try { D0 = KJd.data ? KJd.data() : null; } catch (e) { D0 = null; }
      var legsK = function (k) { var r = D0 && D0.kinds && D0.kinds[k]; return !!(r && Array.isArray(r.legs) && r.legs.length); };
      var onOffer = {}; order.forEach(function (p) { (own[p.name] || []).slice(0, want[p.name]).forEach(function (o) { var k = kindOfJ(KJd, o); if (k) onOffer[k] = 1; }); });
      var nine = {}; SHELF.offers.forEach(function (o) { var k = kindOfJ(KJd, o); if (k && !onOffer[k] && KJd.built(k) && !legsK(k) && k !== 'clear-crew') nine[k] = 1; });
      Object.keys(nine).sort(function (a, b) { return kindsHeld(KJd, a) - kindsHeld(KJd, b) || (a < b ? -1 : 1); }).forEach(function (k) {
        for (var i = 0; i < order.length; i++) { var p = order[i], mine = own[p.name] || [], w = want[p.name] || 1; if (frozen[p.name]) continue;
          var kinds = mine.slice(0, w).map(function (o) { return kindOfJ(KJd, o); }), slot = mine.length < w ? mine.length : -1;
          if (slot < 0) { var j = w - 1, lk = kinds[j]; if (mine[j] && !mine[j].when && !mine[j].towns && (legsK(lk) || kinds.indexOf(lk) < j)) slot = j; }
          if (slot < 0) continue;
          var got = pickOwn(p, day, { traits: p.traits || [], held: opt.held, done: opt.done, crew: p.crew || opt.crew, draft: true, kind: k }, taken, 1, [])[0];
          if (!got) continue;
          if (slot < mine.length) { delete taken[mine[slot].id]; mine[slot] = got; } else mine.push(got);
          own[p.name] = mine; taken[got.id] = p.name; break; } }); }
    for (var r2 = 0; r2 < RESERVE; r2++) order.forEach(function (p) {   /* then each place's next, what it posts when the floor keeps one back */
      if (frozen[p.name] || own[p.name].length >= want[p.name] + RESERVE || own[p.name].length > want[p.name] + r2) return;
      var got = pickOwn(p, day, po(p, true), taken, own[p.name].length + 1, own[p.name]);
      got.forEach(function (o) { taken[o.id] = p.name; }); own[p.name] = got; });
    order.forEach(function (p) { if (!own[p.name].length) { own[p.name] = pickOwn(p, day, po(p), {}, 1, [], true); dup[p.name] = 1; } });   /* the last pass: never empty (rule 335) */
    order.forEach(function (p) { MEMO[p.name] = { win: win, camp: camp, ids: own[p.name].map(function (o) { return o.id; }) }; }); postedPut(MEMO);   /* __A_POSTED_JOB_STAYS_POSTED__: what a place drafted */
    DRAFT = { key: key, own: own, want: want, frozen: frozen, dup: dup, order: order };
    return DRAFT;
  }
  function dealt(day, opt) {
    var D = draft(day, opt), FW = fitter(), key = D.key + '|' + (FW ? FW.fitVer() : '');
    if (DEAL.key === key) return DEAL.map;
    var map = {}, posted = {}, C = SHELF.counts || {};
    var mark = function (name) { (map[name] || []).forEach(function (o) { posted[o.id] = name; }); };
    /* 1. every place posts from its own list what the floor lets through, in the draft's order */
    D.order.forEach(function (p) { var list = D.own[p.name] || [], w = D.want[p.name] || 1;
      if (D.frozen[p.name] || !FW) { map[p.name] = D.frozen[p.name] ? list.slice() : list.slice(0, w); mark(p.name); return; }
      var out = []; list.forEach(function (o) { if (out.length >= w || posted[o.id]) return; if (FW.fits(o, p.name, day, out, w) === false) return; out.push(o); });
      map[p.name] = out; mark(p.name); });
    /* 2. a place the floor left short takes, the floor asked, work no place posts (rule 255: a job under the floor is not posted, the
       place posts its next); whatever the order the reads came in, the same reads post the same boards */
    if (FW) for (var round = 0; round < (C.max || 4); round++) D.order.forEach(function (p) {
      var w = D.want[p.name] || 1; if (D.frozen[p.name] || D.dup[p.name] || map[p.name].length > round || map[p.name].length >= w) return;
      var got = pickOwn(p, day, { traits: p.traits || [], held: opt.held, done: opt.done, crew: p.crew || opt.crew }, posted, map[p.name].length + 1, map[p.name]);
      map[p.name] = got; mark(p.name); });
    /* 2b. JOBS 2 11/27 __ONE_JOB_TO_SWEAT_FOR__ (rule 491(b), Paolo 11/27: 'the jobs not scaling with my team power level'): the work
       on offer spans his strength, some easy, most a fair fight, and AT LEAST ONE his best men must sweat for. The reader's own line
       (rule 254: a read under job_danger.json cut_one is red, AUTO no longer sure of him). When nothing on offer anywhere in the
       valley reads red and a place's own list holds a red the floor lets through (rule 255 still governs the early weeks), that place
       posts it in place of its last job: the job keeps its one door, and the same reads post the same boards */
    if (FW && FW.peek && FW.cfg) { var CUT = (FW.cfg().cut_one) || 0.8, redOf = function (o, n) { try { var Q = FW.peek(o, n); return !!(Q && Q.state === 'read' && +Q.clean < CUT); } catch (e) { return false; } };
      var anyRed = D.order.some(function (p) { return (map[p.name] || []).some(function (o) { return redOf(o, p.name); }); });
      if (!anyRed) D.order.some(function (p) { if (D.frozen[p.name] || D.dup[p.name]) return false; var w = D.want[p.name] || 1, cur = map[p.name] || [];
        var cand = (D.own[p.name] || []).filter(function (o) { return !posted[o.id] && cur.indexOf(o) < 0; }), keep = cur.length >= w ? cur.slice(0, w - 1) : cur.slice();
        cand.slice(0, 2).forEach(function (o) { try { FW.fits(o, p.name, day, keep, w); } catch (e) {} });   /* its next two are asked for (read in the worker, never here) */
        var red = cand.filter(function (o) { return redOf(o, p.name) && FW.fits(o, p.name, day, keep, w) !== false; })[0];
        if (!red) return false;
        if (cur.length >= w) { var out = cur[cur.length - 1]; delete posted[out.id]; }
        map[p.name] = keep.concat([red]); posted[red.id] = p.name; root.__SWEAT_JOB = { place: p.name, id: red.id }; return true; }); }
    /* 3. the last pass: never empty (rule 335), the least dangerous of what the floor kept back */
    D.order.forEach(function (p) { if (!map[p.name].length) { map[p.name] = pickOwn(p, day, { traits: p.traits || [], held: opt.held, done: opt.done, crew: p.crew || opt.crew }, {}, 1, [], true); mark(p.name); } });
    DEAL = { key: key, map: map };
    return map;
  }
  /* __A_READ_BOARD_STAYS_READ__: the town's screen says when his eyes are on a board (BohemiaSettlement's boardHere); the ids are what
     he read, kept for the window */
  function seen(name, ids, day) {
    if (!SHELF || !name) return;
    /* JOBS 2 11/26 __THE_CARD_IS_INSTANT__ (ask row 730): the board he reads warms its people's cards (what each asks and the trip) in the
       page's idle time, so a tap on a person opens the card at once (BohemiaJobKinds.warm, the map's) */
    try { var JKw = (root.parent && root.parent !== root && root.parent.BohemiaJobKinds) || root.BohemiaJobKinds; if (JKw && JKw.warm) { var byId = {}; (SHELF.offers || []).forEach(function (o) { byId[o.id] = o; });
      JKw.warm((ids || []).map(function (id) { return byId[id]; }).filter(Boolean), name); } } catch (e) {}
    var win = Math.floor((day || 0) / (SHELF.refresh_days || 3)), M = readGet(), m = M[name], camp = campaign();
    if (m && m.win === win && m.camp === camp) return;   /* the first look is what he read */
    M[name] = { win: win, camp: camp, ids: (ids || []).slice() }; readPut(M); DEAL.key = null; DRAFT.key = null;
  }
  /* JOBS 11/21: PUSH THE PAY is dead (rule 466(c), graveyard/jobs_push_the_pay_11_17_26): no one walks out of a board */
  function pick(place, day, opt) {
    if (!SHELF || !place) return null;
    opt = opt || {};
    var stay = function () { return true; };
    if (Array.isArray(opt.places) && opt.places.length && opt.places.some(function (p) { return p && p.name === place.name; })) {
      var mine = dealt(day, opt)[place.name] || [];
      return mine.filter(stay).map(function (o) { return said(o, opt.crew); });
    }
    return pickOwn(place, day, opt, {}, null, [], true).filter(stay);
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
    var KJ = kindsJK();   /* __EVERY_KIND_HE_MEETS__ */
    function take(pool, n, mixOnly) {
      if (upto != null) n = opt.reserve ? upto : Math.min(n, upto);
      var sh = shuffled(pool, R);
      if (KJ) { var on = {}; out.forEach(function (o) { var k = kindOfJ(KJ, o); if (k) on[k] = 1; });   /* a board mixes kinds: a kind it does not hold first */
        sh = sh.filter(function (o) { return !on[kindOfJ(KJ, o)]; }).concat(mixOnly ? [] : sh.filter(function (o) { return !!on[kindOfJ(KJ, o)]; })); }   /* the own and the short passes never a second of a kind: it waits for the board's last pass */
      sh.forEach(function (o) { if (out.length >= n || !free(o)) return;
        if (opt.draft) { if (FW && FW.rare && FW.rare(o, place.name, day) === false) { kept.push(o); return; } }   /* __A_JOB_HAS_ONE_DOOR__: the draft asks no read, only the valley's own roll */
        else if (FW && FW.fits(o, place.name, day, out, size) === false) { kept.push(o); return; }   /* under the day's floor: kept back, not lost (rule 335) */
        seen[o.id] = 1; out.push(said(o, opt.crew)); });
    }
    var TR = trust(String(place.name), day), ordinary = all.filter(function (o) { return !o.when && (o.tiers || []).indexOf(tier) >= 0 && (!o.towns || o.towns.indexOf(String(place.name)) >= 0) && trusted(o, TR); }),   /* __THE_TOWN_REMEMBERS__: the work it trusts him with */
      CL = clout(), waiting = [], waitNeed = 0;
    if (CL != null) ordinary = ordinary.filter(function (o) { var nd = needOf(o, tier); if (CL >= nd) return true; waiting.push(o); waitNeed = waitNeed ? Math.min(waitNeed, nd) : nd; return false; });   /* __THE_BIG_WORK_WAITS_FOR_A_NAME__ */
    WAITS[String(place.name)] = waiting.length ? { need: waitNeed, have: CL } : null;
    if (opt.kind && KJ) {   /* __EVERY_KIND_HE_MEETS__: the valley's pass asks a place for one job of a kind, its least dangerous */
      var ofK = ordinary.filter(function (o) { return kindOfJ(KJ, o) === opt.kind && free(o); }), lo = Math.min.apply(null, ofK.map(function (o) { return (o.skulls | 0) || 1; }).concat([9]));
      take(ofK.filter(function (o) { return ((o.skulls | 0) || 1) === lo; }), out.length + 1); return out; }
    if (opt.reserve) { take(ordinary, upto != null ? upto : out.length + 1); return out; }   /* __A_JOB_HAS_ONE_DOOR__: the place's next, past its board's count */
    var own = ordinary.filter(function (o) { return !!o.towns; });   /* JOBS 11/11 (rule 425): a job that fits its town is posted there only, and the town's own person asks first, one of them */
    if (traits.indexOf('raided') >= 0) {   /* the raid leaves one job, and it is the crew that hit it */
      var raid = all.filter(function (o) { return o.when === 'raided'; });
      take(raid, C.raided || 1);
      /* PLUMBER 3 (rule 335): the crew that hit it past what the day lets his company take (all four raid jobs are fights of three
         to six men; a new crew of three reads every one under day ten's floor), the place's own ordinary work stands instead */
      if (!out.length) take(ordinary, C.raided || 1);
      return never(out, kept, raid.concat(ordinary));
    }
    var n = sized(Math.min(C[tier] || 1, C.max || 4), TR, C);   /* __THE_TOWN_REMEMBERS__ */
    ['sickness', 'market_day'].forEach(function (t) {   /* what is happening here asks first */
      if (traits.indexOf(t) >= 0) take(all.filter(function (o) { return o.when === t && trusted(o, TR); }), Math.min(n, out.length + 1));   /* __THE_TOWN_REMEMBERS__: the news's work is trusted the same */
    });
    if (own.length) take(own, Math.min(n, out.length + 1), true);
    var SJ = shortJK();   /* __THE_WORK_FOLLOWS_WHAT_IS_SHORT__: what the valley is short of asks next: one job that brings it */
    if (SJ && shortSig()) take(ordinary.filter(function (o) { try { return SJ.short(o).mult > 1; } catch (e) { return false; } }), Math.min(n, out.length + 1), true);
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
        kept.forEach(function (o) { var Q = null; try { Q = !opt.draft && FW && FW.peek ? FW.peek(o, place.name) : null; } catch (e) { Q = null; }   /* the draft reads nothing: its first */
          var c = Q && Q.state === 'read' ? +Q.clean : 0; if (c > bc) { bc = c; best = o; } });
        if (best) { out.push(said(best, opt.crew)); return out; }
      }
      if (waiting.length) {   /* __THE_BIG_WORK_WAITS_FOR_A_NAME__: a place whose every job waits for a name posts its least dangerous one (rule 335) */
        var lw = waiting.filter(function (o) { return !seen[o.id] && !taken[o.id] && held.indexOf(o.id) < 0; }).sort(function (x, y) { return ((x.skulls | 0) || 1) - ((y.skulls | 0) || 1) || (x.id < y.id ? -1 : 1); })[0];
        if (lw) { out.push(said(lw, opt.crew)); return out; }
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
  root.BohemiaBoardShelf = { load: load, set: set, ready: function () { return !!SHELF; }, pick: pick, mapPlaces: mapPlaces, seen: seen, waits: waits,
    shelf: function () { return SHELF; } };
})(typeof window !== 'undefined' ? window : this);
