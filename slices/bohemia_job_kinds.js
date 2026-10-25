/* THE JOB KINDS (WORLD [every job kind], 10/24/26, rule 153(b)).
   PAOLO 10/24: 'right now the only jobs you have are pull up on people and kill them, but in Battle Brothers there were a
   lot of different jobs: find something on the map, or do a caravan, or roam around until you find a certain enemy type
   and kill a bunch of them; I want more quest types.'
   MEASURED FIRST: the town boards hold 39 people (QUESTS' act-one shelf, records/target/BOHEMIA_BOARD_SHELF.json) whose
   words already ask for every verb ('Walk the water carts to the wash', 'Find the caravan four days late', 'Hunt the pack
   that drinks here', 'Hit their fire in the dry wash'), and every one of them played the same way: a crew marked six to
   ten blocks out, reach it, fight, paid. The kind was in the words and nowhere in the game.
   NOW EVERY JOB IS ONE KIND FROM QUESTS' TABLE (questbook/research/QR_AF_THE_CONTRACT_KINDS_10_9_26.md), and the kind
   decides how it plays. ONE JOB SYSTEM: the map's own loop (__THE_LOOP_ON_THE_MAP__ in BOHEMIA_CITY_WORLD.html) still takes
   the job from the board's mouth, holds it (two at most), saves it, hands every fight through the one door (cityHandOver)
   and hears every fight's end; it hands the job to this file at those five moments and this file says what the kind does.
   Which kind: records/target/BOHEMIA_JOB_KINDS.json (a modder's file: a row per offer, a title pattern, the kind's shapes).
     ESCORT (haul-caravan)  the cargo is a truck that follows him to another town; slow (the clock); he still taps where to
                            go and where to stop; raiders come for it on the road and move at the caravan's pace, so they
                            close; each crate that arrives pays its share; a lost fight takes half of what is left.
     FIND (find-place)      the client says which way and how far; a ring on the map; inside it the place turns up
                            within two blocks, and a stop inside says which way; back to the client to be paid.
     FIND (find-person)     the same, and the ones found walk home with him a head for a crate; held ones are guarded.
     HUNT (hunt-kind)       packs of the named kind roam around the town as the fight's own 3D beasts; a tap goes after
                            one, contact is the fight; every kill counts on the job until the client's number; back to
                            be paid. A pack that smells him comes at him.
     CAMP (clear-camp)      a camp with a fire, bigger than a crew; the fight there; paid there, a flat part and a share a
                            head, capped at the camp's size.
     CLEAR (clear-crew)     today's job, unchanged, and every kind not built yet plays as it, so a board row is never broken.
   Every kind carries its stars (the skulls number), its pay in batteries, its twist at QR-AF's rate, and partial success
   where the table says. Words are draft:true attempts; the numbers are shapes TUNING owns.
     BohemiaJobKinds.kindOf(offer)  the kind of a board offer (UI and RUN TWO may read it to say the kind in a word)
     BohemiaJobKinds.word(offer)    ESCORT / FIND / HUNT / CAMP / CLEAR
     BohemiaJobKinds.status(job)    a held job's count in a few words ('3/4 CARTS TO MESQUITE', 'HUNT 2/7')
   Loaded by BOHEMIA_CITY_WORLD.html; gate: gates/every_job_kind_gate.js */
(function (root) {
  'use strict';
  var DATA = null, LOADING = false, WAIT = [];
  var BUILT = { 'haul-caravan': 1, 'find-place': 1, 'find-person': 1, 'hunt-kind': 1, 'clear-camp': 1, 'carry': 1, 'hold-defend': 1, 'recover-return': 1, 'patrol': 1 };
  var HITS = [], STEPS = 0;
  function load(url, cb) {
    if (cb) { if (DATA) cb(DATA); else WAIT.push(cb); }
    if (DATA || LOADING || typeof fetch === 'undefined') return;
    LOADING = true;
    fetch(url || '../records/target/BOHEMIA_JOB_KINDS.json').then(function (r) { return r.json(); })
      .then(function (j) { set(j); }).catch(function () { LOADING = false; });
  }
  function set(j) { DATA = (j && j.kinds) ? j : null; var w = WAIT; WAIT = []; w.forEach(function (f) { try { f(DATA); } catch (e) {} }); }
  function K(id) { return (DATA && DATA.kinds && DATA.kinds[id]) || null; }
  function seedOf(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var x = seed >>> 0 || 1; return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function pickOf(a, R) { return a && a.length ? a[Math.floor(R() * a.length) % a.length] : null; }
  function cheb(ax, ay, bx, by) { return Math.max(Math.abs(ax - bx), Math.abs(ay - by)); }
  function plural(w, n) { w = String(w || 'crate'); return n === 1 ? w : (/(s|sh|ch|x)$/.test(w) ? w + 'es' : /y$/.test(w) && !/[aeiou]y$/.test(w) ? w.slice(0, -1) + 'ies' : w + 's'); }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ---------- WHICH KIND ---------- */
  function kindOf(o) {
    if (!o) return 'clear-crew';
    var row = DATA && DATA.offers && DATA.offers[o.id];
    if (row && row.kind) return row.kind;
    if (o.kind && K(o.kind)) return o.kind;
    var t = String(o.title || '').toLowerCase(), G = (DATA && DATA.guess) || [];
    for (var i = 0; i < G.length; i++) { try { if (new RegExp(G[i].re, 'i').test(t)) return G[i].kind; } catch (e) {} }
    return (DATA && DATA.default) || 'clear-crew';
  }
  function word(o) { var k = K(kindOf(o)); return k ? k.word : 'CLEAR'; }
  function built(kind) { return !!BUILT[kind] && !!K(kind); }
  function owns(job) { return !!(job && job.plays && job.plays !== 'clear-crew' && BUILT[job.plays]); }
  function held() { try { return LOOP.held.filter(owns); } catch (e) { return []; } }

  /* ---------- THE MAP'S OWN HANDS (every one of these is the map's, called by name; nothing here moves a man or a clock) ---------- */
  function walk(x, y) { try { return cityWalkable(x, y); } catch (e) { return false; } }
  function route(ax, ay, bx, by) { try { return cityRoute(ax, ay, bx, by); } catch (e) { return null; } }
  function day() { try { return loopDay(); } catch (e) { return 0; } }
  function towns() { var bs = null; try { bs = ctBases(); } catch (e) {} var out = []; if (bs) for (var n in bs) if (bs[n]) out.push({ name: n, x: bs[n].x | 0, y: bs[n].y | 0 }); return out; }
  function townNear(x, y, r) { try { return loopTownAt(x, y, r == null ? 1 : r); } catch (e) { return null; } }
  function gate(x, y) { try { return townDoor(x, y); } catch (e) { return null; } }
  function onGlass(x, y) { try { return mapOnGlass(x, y); } catch (e) { return true; } }
  function sayLine(line) {
    try { if (typeof DAY !== 'undefined' && DAY.happened) DAY.happened(line, 'contract'); } catch (e) {}
    setTimeout(function () { try { loopSay(line); } catch (e) {} try { if (typeof updHud === 'function') updHud(); } catch (e) {} try { render(); } catch (e) {}
      try { if (typeof window.__barPaintRead === 'function') window.__barPaintRead(); } catch (e) {} }, 600);
  }
  function now(line) { try { travelSay(line); } catch (e) {} try { LOOP.said = (LOOP.said || []).concat([line]).slice(-12); } catch (e) {} }
  function save(why) { try { setTimeout(function () { saveNow(why); }, 0); } catch (e) {} }
  /* which way on the glass, in words: the phone's own reading (the map is drawn at 45 degrees) */
  function way(dx, dy) {
    var sx = dx - dy, sy = dx + dy; if (!sx && !sy) return 'here';
    var a = Math.atan2(-sy, sx) * 180 / Math.PI, W = ['east', 'north-east', 'north', 'north-west', 'west', 'south-west', 'south', 'south-east'];
    return W[(Math.round(((a + 360) % 360) / 45)) % 8];
  }
  /* a block he could stand on near (x, y), off any town's gate, that he can reach from where he stands */
  function standNear(x, y, R, glass) {
    for (var r = 0; r <= 3; r++) for (var t = 0; t < 12; t++) {
      var a = r ? Math.floor(R() * (2 * r + 1)) - r : 0, b = r ? Math.floor(R() * (2 * r + 1)) - r : 0, cx = x + a, cy = y + b;
      if (!walk(cx, cy) || townNear(cx, cy, 1)) continue;
      if (glass && !onGlass(cx, cy)) continue;
      if (cx === city.x && cy === city.y) continue;
      if (route(city.x, city.y, cx, cy)) return [cx, cy];
    }
    return null;
  }
  /* a spot r0..r1 blocks from (x, y) in a direction the dice pick */
  function spotOut(x, y, r0, r1, R, glass) {
    for (var i = 0; i < 24; i++) {
      var D = DIRS[Math.floor(R() * 8) % 8], r = r0 + Math.floor(R() * (r1 - r0 + 1));
      var s = standNear(x + D[0] * r, y + D[1] * r, R, glass && i < 16);
      if (s && cheb(s[0], s[1], x, y) >= Math.max(3, r0 - 3)) return s;
    }
    return null;
  }

  /* ---------- THE FIGHT, THROUGH THE ONE DOOR ---------- */
  function fight(job, what, count, faction, label, extra) {
    if (LOOP.fighting) return false;
    var w = [city.x, city.y]; try { w = roadWhere(); } catch (e) {}
    var party = null; try { party = partyMath('job', { skulls: job.skulls }); } catch (e) { party = { count: count, days: 1, difficulty: 1 }; }
    party.count = Math.max(1, count | 0); try { party.word = partyWord(party.count); } catch (e) {}
    party.faction = faction || 'brigands';
    var roster = []; for (var i = 0; i < party.count; i++) roster.push({ arch: party.faction === 'beasts' ? 'beast' : 'human' });
    job.fight = { what: what, n: party.count, pack: extra && extra.pack != null ? extra.pack : null };
    LOOP.fighting = job.id;
    var ok = false;
    try { ok = cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: label, faction: null, draft: true,
      packageId: (LOOP.start && LOOP.start.pkg != null) ? LOOP.start.pkg : 1, roster: roster, party: party, street: true,
      why: 'contract:' + job.id + ':' + what, at: { gx: w[0] | 0, gy: w[1] | 0 } }); } catch (e) { ok = false; }
    if (!ok) { LOOP.fighting = null; job.fight = null; return false; }
    try { CITY_CONTACT_POSTED = true; } catch (e) {}
    window.__JOB_FIGHTS = (window.__JOB_FIGHTS | 0) + 1;
    return true;
  }

  /* ---------- PAID, LOST, DONE ---------- */
  function finish(job) {
    var i = LOOP.held.indexOf(job); if (i >= 0) LOOP.held.splice(i, 1);
    try { LOOP.doneIds = (LOOP.doneIds || []).concat([job.id]).slice(-60); } catch (e) {}
  }
  function paid(job, n, line) {
    n = Math.max(0, n | 0);
    settle(job, n >= job.pay ? 'civilian_contract_done' : 'civilian_contract_poor');   /* the client's standing, Battle Brothers' +10 (+5 for part) */
    if (n > 0) { try { BohemiaPurse.credit(purseGet(), 'electricity', n, 'contract: ' + job.title, 'contract:' + job.id + ':' + LOOP.done, day()); } catch (e) {} }
    LOOP.done++;
    finish(job);
    job.result = { paid: n, at: day() };
    window.__JOB_PAID = (window.__JOB_PAID || []).concat([{ id: job.id, kind: job.plays, paid: n, of: job.pay }]).slice(-20);
    try { window.dispatchEvent(new CustomEvent('bohemia-job-paid', { detail: { job: job, paid: n, of: job.pay } })); } catch (e) {}   /* the client says it now, with this number (UI's voice) */
    sayLine(line || ('Paid ' + n + ' battery: ' + job.title + '.'));
    save('contract:paid');
  }
  function lost(job, line) {
    settle(job, 'fail_civilian_contract');   /* the client's standing, Battle Brothers' -20 */
    finish(job);
    window.__JOB_LOST = (window.__JOB_LOST || []).concat([{ id: job.id, kind: job.plays }]).slice(-20);
    sayLine(line || ('The job is lost: ' + job.title + '. Nobody pays for that.'));
    save('contract:lost');
  }
  function backTo(job) {
    var d = gate(job.fromAt.x, job.fromAt.y) || [job.fromAt.x, job.fromAt.y];
    job.target = { x: d[0], y: d[1] };
  }
  function atClient(job, x, y) { var t = townNear(x, y, 1); return !!(t && t.name === job.from); }

  /* ---------- THE PLACE A JOB NAMES (WORLD [the PC playtest: the jobs' part] (1), rule 164 item 3) ----------
     PAOLO 10/24 on his PC: 'take three carts to Prim, and it's really just the blue settlement.' MEASURED: the board's words
     name a place (Primm, the dam, the lodge on the mountain, the pump station) and the job went wherever the dice put it: the
     carts to the nearest town in range (the Blues), the place on the map called nothing but 'ESCORT TO HERE', and the client's
     town named only when he stood beside it. NOW every row says the place its words name (BOHEMIA_JOB_KINDS.json 'place'): a
     REAL one, one of the region's real places or a valley town, is where the job goes; a made one ('the pump station') is a
     block the dice pick and carries the words' own name. The map names every place a held job names (the client's town, where
     it goes), rings the NEXT one on its ground, and when that one is off the glass its name waits at the glass's edge, on the
     line from the middle of the glass to it, pointing; a tap on it walks there. */
  function realPlace(nm) {
    if (!nm) return null; var N = String(nm).toUpperCase();
    try { var bs = ctBases() || {}; for (var k in bs) if (bs[k] && String(k).toUpperCase() === N) return { name: k, x: bs[k].x | 0, y: bs[k].y | 0, town: true }; } catch (e) {}
    try { var P = (root.BOH_REGION && root.BOH_REGION.places) || []; for (var i = 0; i < P.length; i++) if (String(P[i].name).toUpperCase() === N) return { name: P[i].name, x: P[i].x | 0, y: P[i].y | 0, town: true, region: true }; } catch (e) {}
    return null;
  }
  /* a block he can stand on beside a real place (not its gate), that he can reach */
  function nearReal(job, R) { var p = job.real; return p ? standNear(p.x + (R() < 0.5 ? 2 : -2), p.y + (R() < 0.5 ? 2 : -2), R, false) : null; }
  /* the words' own direction ('the south road'), on the map's compass (north is y = 0; a mirrored seed mirrors east) */
  function wayDir(w) {
    var C = (root.BOH_REGION && root.BOH_REGION.compass) || { e: 'x1' }, ex = C.e === 'x0' ? -1 : 1;
    return ({ north: [0, -1], south: [0, 1], east: [ex, 0], west: [-ex, 0] })[String(w || '').toLowerCase()] || null;
  }
  function blocksWord(n) { return 'about ' + n + (n === 1 ? ' block' : ' blocks'); }
  /* where the job sends him NEXT, by kind and stage: { name, act, x, y, town } (a town names itself on the map) */
  function nextOf(job) {
    if (job.stage === 'wait') return null;
    var from = { name: String(job.from || '').toUpperCase(), act: 'GET PAID', x: job.fromAt ? job.fromAt.x : (job.target || {}).x, y: job.fromAt ? job.fromAt.y : (job.target || {}).y, town: true };
    var tg = job.target || {}, pn = job.placeName;
    switch (job.plays) {
      case 'haul-caravan': return job.stage === 'haul' ? { name: String(job.dest.name).toUpperCase(), act: 'ESCORT TO', x: job.dest.made ? tg.x : job.dest.x, y: job.dest.made ? tg.y : job.dest.y, town: !job.dest.made } : null;
      case 'carry': if (job.stage === 'lair' && job.lair) return { name: 'THEIR LAIR', act: 'GET IT BACK', x: job.lair.x, y: job.lair.y };
        return job.stage === 'carry' ? { name: String(job.dest.name).toUpperCase(), act: 'CARRY TO', x: job.dest.made ? tg.x : job.dest.x, y: job.dest.made ? tg.y : job.dest.y, town: !job.dest.made } : null;
      case 'find-place': case 'find-person': if (job.stage === 'look') return { name: pn || String(job.what || '').toUpperCase(), act: 'FIND', x: job.ring.x, y: job.ring.y }; return from;
      case 'hunt-kind': if (job.stage === 'back') return from;
        if (!(job.packs || []).length) return null;
        var pk = job.packs.slice().sort(function (a, b) { return cheb(a.x, a.y, city.x, city.y) - cheb(b.x, b.y, city.x, city.y); })[0];
        return { name: String(job.what || 'THEM').toUpperCase(), act: 'HUNT', x: pk.x, y: pk.y };
      case 'clear-camp': return job.stage === 'camp' ? { name: pn || String(job.what || 'THE CAMP').toUpperCase(), act: 'CAMP', x: job.camp.x, y: job.camp.y } : null;
      case 'hold-defend': return job.stage === 'hold' ? { name: from.name, act: 'HOLD', x: from.x, y: from.y, town: true, sub: pn } : null;
      case 'recover-return': if (job.stage === 'get') return { name: pn || String(job.where || job.item || '').toUpperCase(), act: 'GET ' + String(job.item || 'IT').toUpperCase(), x: job.spot.x, y: job.spot.y }; return from;
      case 'patrol': if (job.stage === 'back') return from;
        var nx = null; (job.posts || []).forEach(function (p, i) { if (!p.done && !nx) nx = { name: p.name ? String(p.name).toUpperCase() : 'POST ' + (i + 1), act: 'PATROL', x: p.x, y: p.y, town: !!p.name }; }); return nx;
    }
    /* today's crew job (and every kind not built yet): the crew, where the map marks it */
    return tg.x != null ? { name: pn || 'THE CREW', act: 'THE JOB', x: tg.x, y: tg.y, town: false } : null;
  }
  /* is this town or real place named by a job he holds? 'next' (the place he goes now: ringed) or 'named' (named), else null */
  function names(nm) {
    var N = String(nm || '').toUpperCase(), out = null; if (!N) return null;
    try { (LOOP.held || []).forEach(function (j) {
      var n = nextOf(j); if (n && n.town && n.name === N) out = 'next';
      if (!out && (String(j.from || '').toUpperCase() === N || (j.dest && String(j.dest.name).toUpperCase() === N && !j.dest.made))) out = 'named';
    }); } catch (e) {}
    return out;
  }

  /* ======================= ESCORT: haul-caravan ======================= */
  var MAKE = {}, ARRIVE = {}, STEP = {}, END = {}, DRAW = {};
  /* another town to take it to: where he can see it first, in the table's range, then near its middle; one he can reach */
  function pickDest(job, k, town, R) {
    var lo = (k.dest_blocks || [8, 30])[0], hi = (k.dest_blocks || [8, 30])[1], dest = null, door = null, path = null;
    /* THE PLACE THE WORDS NAME (rule 164 item 3): a real place is where it goes, however far; a made one is a block in range */
    if (job.real) { var d0 = gate(job.real.x, job.real.y), p0 = d0 ? route(city.x, city.y, d0[0], d0[1]) : null;
      if (p0) { job.dest = { name: job.real.name, x: job.real.x, y: job.real.y, real: true }; job.target = { x: d0[0], y: d0[1] }; return p0; } }
    if (job.placeName) { var s0 = spotOut(town.x, town.y, lo, hi, R, true), p1 = s0 ? route(city.x, city.y, s0[0], s0[1]) : null;
      if (p1) { job.dest = { name: job.placeName, x: s0[0], y: s0[1], made: true }; job.target = { x: s0[0], y: s0[1] }; return p1; } }
    var ts = towns().filter(function (t) { return t.name !== town.name; }).map(function (t) { return { t: t, d: cheb(t.x, t.y, town.x, town.y) }; });
    var mid = (lo + hi) / 2;
    /* where he can see it first (a normie sees where the cargo goes, rule 133), in the table's range, then near its middle */
    ts.forEach(function (t) { t.g = onGlass(t.t.x, t.t.y) ? 0 : 1; t.in = t.d >= lo && t.d <= hi ? 0 : 1; t.k = Math.abs(t.d - mid) + R() * 6; });
    ts.sort(function (a, b) { return a.in - b.in || a.g - b.g || a.k - b.k; });
    for (var i = 0; i < ts.length && i < 8 && !path; i++) {
      if (ts[i].d < 4) continue;
      var dr = gate(ts[i].t.x, ts[i].t.y); if (!dr) continue;
      var p = route(city.x, city.y, dr[0], dr[1]); if (p) { dest = ts[i].t; door = dr; path = p; }
    }
    if (!path) return null;
    job.dest = { name: dest.name, x: dest.x, y: dest.y };
    job.target = { x: door[0], y: door[1] };
    return path;
  }
  /* a party waits AHEAD on his road (an ambush), a block off it, three or four blocks on, where he can see them; or around him */
  function aheadOf(seed) {
    var R = rng(seedOf(seed)), at = null;
    try { var P = (typeof TRAVEL !== 'undefined' && TRAVEL && TRAVEL.path) ? TRAVEL.path : null;
      if (P) for (var a = 4; a >= 2 && !at; a--) { var q = P[Math.min(P.length - 2, TRAVEL.i + a)]; if (!q) continue;
        for (var t0 = 0; t0 < 8 && !at; t0++) { var D0 = DIRS[(t0 + Math.floor(R() * 8)) % 8], x0 = q[0] + D0[0], y0 = q[1] + D0[1];
          if (walk(x0, y0) && !townNear(x0, y0, 1) && cheb(x0, y0, city.x, city.y) >= 2) at = [x0, y0]; } } } catch (e) {}
    for (var t = 0; t < 30 && !at; t++) {
      var D = DIRS[Math.floor(R() * 8) % 8], x = city.x + D[0] * 3, y = city.y + D[1] * 3;
      if (walk(x, y) && !townNear(x, y, 1) && (t > 20 || onGlass(x, y))) at = [x, y];
    }
    return at;
  }
  /* a party closes a block for every block he walks (a caravan, a man carrying something, cannot outrun it) */
  function closeIn(r) {
    var dx = Math.sign(city.x - r.x), dy = Math.sign(city.y - r.y), tries = [[dx, dy], [dx, 0], [0, dy]];
    for (var i = 0; i < tries.length; i++) { var nx = r.x + tries[i][0], ny = r.y + tries[i][1]; if ((tries[i][0] || tries[i][1]) && walk(nx, ny)) { r.x = nx; r.y = ny; break; } }
    return cheb(r.x, r.y, city.x, city.y) <= 1;
  }
  MAKE['haul-caravan'] = function (job, k, row, town, R) {
    var sk = clamp(job.skulls, 1, 3), n = row.crates || k.crates_by_skulls[sk - 1] || 3;
    var path = pickDest(job, k, town, R), dest = job.dest;
    if (!path) return false;
    job.cargo = { what: row.cargo || 'the cargo', unit: row.unit || 'crate', n: n, of: n };
    job.perCrate = Math.max(1, Math.floor(job.pay / n));
    var na = (k.ambush_by_skulls || [1, 1, 2])[sk - 1] | 0, L = path.length;
    job.ambush = [];
    for (var a = 0; a < na; a++) job.ambush.push(Math.max(3, Math.round(L * (na === 1 ? 0.45 : 0.3 + 0.4 * a / (na - 1)) + (R() - 0.5) * 3)));
    job.walked = 0; job.trail = [[city.x, city.y]]; job.raid = null;
    job.stage = 'haul';
    job.sayTake = 'Contract from ' + town.name + ': walk ' + job.cargo.what + ' to ' + String(dest.name).toUpperCase() + ', ' + way(job.target.x - town.x, job.target.y - town.y) + ', ' +
      blocksWord(cheb(job.target.x, job.target.y, town.x, town.y)) + '. ' + n + ' ' + plural(job.cargo.unit, n) + ', ' + job.perCrate + ' batteries for every one that gets there.';   /* draft:true */
    return true;
  };
  function cargoStep(job) {
    job.trail = (job.trail || []).concat([[city.x, city.y]]).slice(-3);
    job.walked = (job.walked | 0) + 1;
  }
  STEP['haul-caravan'] = function (job, k) {
    if (job.stage !== 'haul') return false;
    cargoStep(job);
    var r = job.raid;
    if (r) {   /* the caravan is slow: they close a block for every block he walks, and contact is the fight */
      if (closeIn(r)) return raidFight(job);
      return false;
    }
    if (job.ambush && job.ambush.length && job.walked >= job.ambush[0]) {
      job.ambush.shift();
      /* AHEAD ON HIS ROAD (measured: raiders put behind a caravan walking away never closed, and the cargo reached the gate untouched) */
      var at = aheadOf(job.id + ':raid:' + job.walked);
      if (!at) return false;
      var base = 3; try { base = partyMath('job', { skulls: job.skulls }).count; } catch (e) {}
      job.raid = { x: at[0], y: at[1], n: Math.max(2, base + ((k.ambush_extra | 0) || 0)) };
      now('Raiders, ' + job.raid.n + ' of them, coming for ' + job.cargo.what + '. The caravan cannot outrun them.');   /* draft:true */
      window.__JOB_RAIDS = (window.__JOB_RAIDS | 0) + 1;
      try { render(); } catch (e) {}
    }
    return false;
  };
  function raidFight(job) {
    var r = job.raid; if (!r) return false;
    return fight(job, 'raid', r.n, (K(job.plays) || {}).ambush_foe || 'brigands', 'raiders after ' + job.cargo.what);
  }
  ARRIVE['haul-caravan'] = function (job, x, y) {
    if (job.stage !== 'haul') return false;
    if (job.raid && cheb(job.raid.x, job.raid.y, x, y) <= 1) return raidFight(job) || true;
    var t = townNear(x, y, 1);
    if (!(t && t.name === job.dest.name) && cheb(x, y, job.target.x, job.target.y) > 1) return false;
    /* T18 A THIRD PARTY SHOWS UP: at the gate somebody says the cargo is stolen */
    if (job.twist === 'T18' && !job.twistDone) {
      job.twistDone = true;
      now('At the gate of ' + job.dest.name + ', a crew says ' + job.cargo.what + ' is stolen and theirs now.');   /* draft:true */
      var n = 3; try { n = partyMath('job', { skulls: job.skulls }).count; } catch (e) {}
      return fight(job, 'gate', n, 'brigands', 'a crew at the gate of ' + job.dest.name) || true;
    }
    deliver(job);
    return false;   /* and the town opens: he is there */
  };
  function deliver(job) {
    var c = job.cargo, line = '';
    if (job.twist === 'T13' && c.n > 1) { c.n--; line = 'One ' + c.unit + ' walked off in the night, and nobody in the crew saw a thing. '; }   /* draft:true */
    var full = c.n >= c.of, n = full ? job.pay : c.n * job.perCrate;
    paid(job, n, line + c.n + ' of ' + c.of + ' ' + plural(c.unit, c.of) + ' into ' + job.dest.name + '. Paid ' + n + ' batteries' + (full ? ', the whole job.' : ', for what got there.'));
  }
  END['haul-caravan'] = function (job, f, won, ran, o) {
    var c = job.cargo, k = K(job.plays) || {}, was = c.n, take;
    if (won && !ran) take = Math.min(Math.floor(c.n / 2), ((o.fellOfYours | 0) * (k.fallen_drop == null ? 1 : k.fallen_drop)));
    else take = Math.ceil(c.n * (k.lost_fight_takes == null ? 0.5 : k.lost_fight_takes));
    c.n = Math.max(0, c.n - take);
    if (f.what === 'raid') job.raid = null;
    if (c.n <= 0) return lost(job, 'They took the last of ' + c.what + '. The job is lost: ' + job.title + '.');   /* draft:true */
    if (f.what === 'gate') {
      if (won && !ran) { deliver(job); return; }
      return paidPartial(job, 'They took ' + take + ' at the gate. ');
    }
    sayLine((won && !ran ? 'They are done. ' : 'You got clear, and they took ' + take + '. ') + c.n + ' of ' + c.of + ' ' + plural(c.unit, c.of) +
      ' still going to ' + job.dest.name + (take && won && !ran ? ' (' + take + ' dropped when your men went down).' : '.'));   /* draft:true */
    save('contract:raid');
  };
  function paidPartial(job, pre) { var c = job.cargo, n = c.n * job.perCrate; paid(job, n, pre + c.n + ' of ' + c.of + ' ' + plural(c.unit, c.of) + ' into ' + job.dest.name + '. Paid ' + n + ' batteries, for what got there.'); }

  /* ======================= FIND: find-place and find-person ======================= */
  function makeFind(job, k, row, town, R, person) {
    var b = k.blocks || [9, 18], s = job.real ? nearReal(job, R) : null, wd = wayDir(job.placeWay);
    /* the words' own direction ('the south road'): out that way from the client, in the kind's range */
    if (!s && wd) for (var w = 0; w < 6 && !s; w++) { var rr = b[0] + Math.floor(R() * (b[1] - b[0] + 1)); s = standNear(town.x + wd[0] * rr + wd[1] * (w - 2), town.y + wd[1] * rr + wd[0] * (w - 2), R, w < 3); }
    if (!s) s = spotOut(town.x, town.y, b[0], b[1], R, true);
    if (!s) return false;
    var r = k.ring || 4, off = Math.max(0, r - 1), c = null;
    for (var i = 0; i < 12 && !c; i++) { var cx = s[0] + Math.floor(R() * (2 * off + 1)) - off, cy = s[1] + Math.floor(R() * (2 * off + 1)) - off; if (walk(cx, cy) && route(city.x, city.y, cx, cy)) c = [cx, cy]; }
    if (!c) c = s;
    job.spot = { x: s[0], y: s[1] }; job.ring = { x: c[0], y: c[1], r: r };
    job.target = { x: c[0], y: c[1] };
    job.what = row.what || 'it';
    job.stage = 'look';
    var dist = cheb(c[0], c[1], town.x, town.y);
    job.sayTake = 'Contract from ' + town.name + ': find ' + job.what + (job.placeName ? ', ' + job.placeName : '') + '. ' + cap(way(c[0] - town.x, c[1] - town.y)) + ', ' + blocksWord(dist) + '. Look inside the ring on the map.';   /* draft:true */
    if (person) {
      var sk = clamp(job.skulls, 1, 3), n = row.heads || (k.heads_by_skulls || [2, 3, 5])[sk - 1];
      job.cargo = { what: job.what, unit: row.unit || 'person', n: n, of: n };
      job.perCrate = Math.max(1, Math.floor(job.pay / n));
      job.guarded = sk >= 2;
    }
    return true;
  }
  MAKE['find-place'] = function (job, k, row, town, R) { return makeFind(job, k, row, town, R, false); };
  MAKE['find-person'] = function (job, k, row, town, R) { return makeFind(job, k, row, town, R, true); };
  function found(job) {
    var k = K(job.plays) || {};
    if (job.plays === 'find-person') {
      if (job.guarded && !job.guardsDone) {
        job.guardsDone = true;
        var n = 3; try { n = partyMath('job', { skulls: job.skulls }).count; } catch (e) {}
        now('Found ' + job.what + ', and the ones holding them.');   /* draft:true */
        return fight(job, 'guards', n, 'brigands', 'the ones holding ' + job.what) || true;
      }
      return foundHome(job);
    }
    /* T22: the directions led into an ambush */
    if (job.twist === 'T22' && !job.twistDone) {
      job.twistDone = true;
      var m = 3; try { m = partyMath('job', { skulls: job.skulls }).count; } catch (e) {}
      now('It was a setup. The directions led straight into them.');   /* draft:true */
      return fight(job, 'ambush', m, 'brigands', 'an ambush where ' + job.what + ' was') || true;
    }
    var row = (DATA.offers || {})[job.id] || {};
    job.stage = 'back'; backTo(job);
    window.__JOB_FOUND = (window.__JOB_FOUND | 0) + 1;
    sayLine((row.found || ('Found ' + job.what + '.')) + ' Back to ' + job.from + ' to be paid.');   /* draft:true */
    save('contract:found');
    return false;
  }
  function foundHome(job) {
    var c = job.cargo, k = K(job.plays) || {}, pre = '';
    if (job.twist === 'T21' && c.n > 1) { c.n--; pre = 'One of them will not come. '; }   /* draft:true */
    job.stage = 'home'; backTo(job); job.trail = [[city.x, city.y]];
    window.__JOB_FOUND = (window.__JOB_FOUND | 0) + 1;
    sayLine(pre + 'Found ' + job.what + '. ' + c.n + ' walking home with you to ' + job.from + '.');   /* draft:true */
    save('contract:found');
    return false;
  }
  function findStep(job) {
    var k = K(job.plays) || {};
    if (job.stage === 'home') { cargoStep(job); return false; }
    if (job.stage !== 'look') return false;
    if (cheb(city.x, city.y, job.spot.x, job.spot.y) <= (k.seen_at || 2)) return found(job) === true;
    return false;
  }
  STEP['find-place'] = findStep; STEP['find-person'] = findStep;
  function findArrive(job, x, y) {
    var k = K(job.plays) || {};
    if (job.stage === 'look') {
      if (cheb(x, y, job.spot.x, job.spot.y) <= (k.seen_at || 2)) return found(job) === true;
      if (cheb(x, y, job.ring.x, job.ring.y) <= job.ring.r) {   /* a stop inside the ring says which way (Battle Brothers gives directions if lost) */
        now('Somewhere ' + way(job.spot.x - x, job.spot.y - y) + ' of here, ' + cheb(x, y, job.spot.x, job.spot.y) + ' blocks or so.');   /* draft:true */
        window.__JOB_HINTS = (window.__JOB_HINTS | 0) + 1;
      }
      return false;
    }
    if ((job.stage === 'back' || job.stage === 'home') && atClient(job, x, y)) {
      if (job.stage === 'back') paid(job, job.pay, 'Back in ' + job.from + ' with word of ' + job.what + '. Paid ' + job.pay + ' batteries.');   /* draft:true */
      else { var c = job.cargo, full = c.n >= c.of, n = full ? job.pay : c.n * job.perCrate;
        paid(job, n, c.n + ' of ' + c.of + ' home in ' + job.from + '. Paid ' + n + ' batteries' + (full ? '.' : ', for who came home.')); }
    }
    return false;
  }
  ARRIVE['find-place'] = findArrive; ARRIVE['find-person'] = findArrive;
  function findEnd(job, f, won, ran, o) {
    if (f.what === 'ambush') {   /* found is found; a lost fight still came home with the word */
      job.stage = 'back'; backTo(job);
      sayLine((won && !ran ? 'They are down. ' : 'You got out. ') + 'Found ' + job.what + ' anyway. Back to ' + job.from + ' to be paid.');   /* draft:true */
      save('contract:found'); return;
    }
    if (f.what === 'guards') {
      if (won && !ran) { foundHome(job); return; }
      job.guardsDone = false;
      sayLine('They still hold ' + job.what + '. The job is still there.');   /* draft:true */
      save('contract:guards'); return;
    }
  }
  END['find-place'] = findEnd; END['find-person'] = findEnd;

  /* ======================= HUNT: hunt-kind ======================= */
  MAKE['hunt-kind'] = function (job, k, row, town, R) {
    var sk = clamp(job.skulls, 1, 3);
    job.need = row.need || (k.need_by_skulls || [4, 7, 10])[sk - 1]; job.got = 0;
    job.foe = row.foe || k.foe || 'beasts'; job.what = row.what || 'them';
    job.packs = []; job.packN = 0; job.ring2 = 0;
    for (var i = 0; i < (k.packs || 3); i++) spawnPack(job, k, town, R);
    if (!job.packs.length) return false;
    backTo(job); job.target = { x: job.packs[0].x, y: job.packs[0].y };
    job.stage = 'hunt';
    job.sayTake = 'Contract from ' + town.name + ': hunt ' + job.what + '. Kill ' + job.need + '; the count is on the job. They roam around ' + town.name + '.';
    return true;
  };
  function spawnPack(job, k, town, R) {
    var pb = k.pack_blocks || [6, 15], ps = k.pack_size || [2, 4], sk = clamp(job.skulls, 1, 3);
    var s = spotOut(town.x, town.y, pb[0] + (job.ring2 | 0), pb[1] + (job.ring2 | 0), R, job.packs.length === 0);
    if (!s) return null;
    /* SIZED TO HIS CREW (the map's own job math, rule 75b; a beast fights harder than a man, so a pack is four fifths of a
       crew job's count, a fifth of the time one more): measured, packs of 3 to 5 dire wolves beat a new crew of three twice */
    var base = 3; try { base = partyMath('job', { skulls: sk }).count; } catch (e) {}
    var n = clamp(Math.round(base * 0.8) + (R() < 0.2 ? 1 : 0), ps[0], ps[1] + sk);
    var p = { id: ++job.packN, x: s[0], y: s[1], n: n, look: R() < 0.6 ? 'wolf' : 'hyena', home: [town.x, town.y] };
    job.packs.push(p); return p;
  }
  function packNear(job, x, y, r) { for (var i = 0; i < (job.packs || []).length; i++) { var p = job.packs[i]; if (cheb(p.x, p.y, x, y) <= (r == null ? 1 : r)) return p; } return null; }
  function packFight(job, p) {
    return fight(job, 'pack', p.n, job.foe, (p.look === 'hyena' ? 'hyenas' : 'a pack') + ', hunting ' + job.what, { pack: p.id });
  }
  STEP['hunt-kind'] = function (job, k) {
    if (job.stage !== 'hunt') return false;
    var R = rng(seedOf(job.id + ':walk:' + STEPS)), smell = 4, roam = (k.pack_blocks || [6, 15])[1] + 4 + (job.ring2 | 0);
    for (var i = 0; i < job.packs.length; i++) {
      var p = job.packs[i], d = cheb(p.x, p.y, city.x, city.y), mv = null;
      if (d <= smell) { var dx = Math.sign(city.x - p.x), dy = Math.sign(city.y - p.y); mv = [[dx, dy], [dx, 0], [0, dy]]; p.smelt = true; }
      else if ((STEPS + p.id) % 2 === 0) { var D = DIRS[Math.floor(R() * 8) % 8]; mv = [D]; }
      if (mv) for (var t = 0; t < mv.length; t++) { var nx = p.x + mv[t][0], ny = p.y + mv[t][1];
        if ((mv[t][0] || mv[t][1]) && walk(nx, ny) && !townNear(nx, ny, 1) && cheb(nx, ny, p.home[0], p.home[1]) <= roam) { p.x = nx; p.y = ny; break; } }
      if (cheb(p.x, p.y, city.x, city.y) <= 1) return packFight(job, p);
    }
    /* the chase: a pack he tapped, re-aimed every block (the parties' own way) */
    if (job.chase) { var c = null; job.packs.forEach(function (q) { if (q.id === job.chase) c = q; });
      if (!c) job.chase = null;
      else if (typeof TRAVEL !== 'undefined' && TRAVEL && TRAVEL.to && cheb(TRAVEL.to[0], TRAVEL.to[1], c.x, c.y) > 1) { try { var keep = TRAVEL_SPEED; travelTo(0, 0, [c.x, c.y]); if (keep > 0) travelSpeedSet(keep); } catch (e) {} } }
    var near = job.packs.slice().sort(function (a, b) { return cheb(a.x, a.y, city.x, city.y) - cheb(b.x, b.y, city.x, city.y); })[0];
    if (near) job.target = { x: near.x, y: near.y };
    return false;
  };
  ARRIVE['hunt-kind'] = function (job, x, y) {
    if (job.stage === 'hunt') { var p = packNear(job, x, y, 1); if (p) return packFight(job, p) || true; return false; }
    if (job.stage === 'back' && atClient(job, x, y)) {
      var pre = job.twist === 'T23' ? 'The last of them had young in the den. Nobody says anything on the walk back. ' : '';   /* draft:true */
      paid(job, job.pay, pre + job.got + ' of ' + job.what + ' down, ' + job.from + ' pays ' + job.pay + ' batteries.');
    }
    return false;
  };
  END['hunt-kind'] = function (job, f, won, ran, o) {
    var k = K(job.plays) || {}, dead = Math.max(0, o.dead | 0), i = -1;
    job.packs.forEach(function (p, j) { if (p.id === f.pack) i = j; });
    job.got = (job.got | 0) + dead;
    if (i >= 0) { var p = job.packs[i]; p.n -= dead + (o.fled | 0); if (p.n <= 0 || (won && !ran)) job.packs.splice(i, 1); else { p.smelt = false; } }
    job.chase = null;
    if (job.got >= job.need) {
      job.stage = 'hunt-done'; job.packs = []; job.stage = 'back'; backTo(job);
      sayLine('Hunt ' + Math.min(job.got, job.need) + '/' + job.need + '. Enough. Back to ' + job.from + ' to be paid.');   /* draft:true */
      save('contract:hunted'); return;
    }
    if (!job.packs.length) {   /* roam until you find them: more, farther out */
      job.ring2 = (job.ring2 | 0) + 4;
      var R = rng(seedOf(job.id + ':more:' + job.got)), town = { name: job.from, x: job.fromAt.x, y: job.fromAt.y };
      for (var a = 0; a < 2; a++) spawnPack(job, k, town, R);
    }
    sayLine((won && !ran ? '' : 'You pulled back. ') + 'Hunt ' + job.got + '/' + job.need + ': ' + job.what + '. ' + job.packs.length + (job.packs.length === 1 ? ' pack' : ' packs') + ' still out there.');   /* draft:true */
    save('contract:hunt');
  };

  /* ======================= CAMP: clear-camp ======================= */
  MAKE['clear-camp'] = function (job, k, row, town, R, tg) {
    if (job.real) { var sr = nearReal(job, R); if (sr) tg = { x: sr[0], y: sr[1] }; }
    if (!tg) return false;
    var base = 3; try { base = partyMath('job', { skulls: job.skulls }).count; } catch (e) {}
    var men = row.men || (base + ((k.extra_men | 0) || 0));
    job.camp = { x: tg.x, y: tg.y, men: men, of: men };
    if (job.twist === 'T17') job.camp.men = Math.max(2, Math.ceil(men / 2));
    job.foe = row.foe || 'brigands'; job.what = row.what || 'the camp';
    job.target = { x: tg.x, y: tg.y };
    job.flat = Math.max(1, Math.round(job.pay * (k.flat == null ? 0.6 : k.flat)));
    job.perHead = Math.max(1, Math.round(job.pay * (k.per_head_share == null ? 0.4 : k.per_head_share) / men));
    job.stage = 'camp';
    job.sayTake = 'Contract from ' + town.name + ': ' + job.what + '. A camp' + (job.placeName ? ' at ' + job.placeName : '') + ', ' + way(tg.x - town.x, tg.y - town.y) + ', ' + blocksWord(cheb(tg.x, tg.y, town.x, town.y)) +
      ', about ' + men + ' of them. Paid there: ' + job.flat + ' batteries and ' + job.perHead + ' for every one put down.';   /* draft:true */
    return true;
  };
  ARRIVE['clear-camp'] = function (job, x, y) {
    if (job.stage !== 'camp' || cheb(x, y, job.camp.x, job.camp.y) > 1) return false;
    if (job.twist === 'T17' && !job.twistDone) { job.twistDone = true; now('Half of them are families with nowhere else. Fewer stand up to fight.'); }   /* draft:true */
    return fight(job, 'camp', job.camp.men, job.foe, job.what) || true;
  };
  END['clear-camp'] = function (job, f, won, ran, o) {
    if (won && !ran) {
      var heads = Math.min(job.camp.of, Math.max(0, o.dead | 0)), n = Math.min(job.pay, job.flat + heads * job.perHead);
      if (job.twist === 'T17') n = job.pay;   /* the client lied; the fee locked at the offer (QR-AF rule 7) */
      return paid(job, n, 'Camp cleared: ' + job.what + '. Paid ' + n + ' batteries (' + heads + ' put down).');   /* draft:true */
    }
    if (ran) {
      job.camp.men = Math.max(1, job.camp.men - (o.dead | 0));
      sayLine('You pulled back. The camp is still there: ' + job.camp.men + ' of them.');   /* draft:true */
      save('contract:camp'); return;
    }
    lost(job);
  };

  /* ======================= DELIVER: carry ======================= */
  /* one thing in the bag to another town; no truck and no slowness; thieves may wait on the road (QR-AF C1: 'brigands steal it
     and leave tracks to their lair'): lose to them and it is gone to their lair, a camp near the road; take it back there */
  MAKE['carry'] = function (job, k, row, town, R) {
    var path = pickDest(job, k, town, R); if (!path) return false;
    job.item = row.item || 'the package'; job.has = true;
    job.walked = 0; job.thiefAt = (job.twist === 'stolen') ? Math.max(3, Math.round(path.length * 0.5)) : -1;
    job.stage = 'carry';
    job.sayTake = 'Contract from ' + town.name + ': carry ' + job.item + ' to ' + String(job.dest.name).toUpperCase() + ', ' + way(job.target.x - town.x, job.target.y - town.y) + ', ' +
      blocksWord(cheb(job.target.x, job.target.y, town.x, town.y)) + '. ' + job.pay + ' batteries when it is signed for there.';   /* draft:true */
    return true;
  };
  STEP['carry'] = function (job) {
    if (job.stage === 'carry') {
      job.walked = (job.walked | 0) + 1;
      if (job.thief) { if (closeIn(job.thief)) return thiefFight(job); return false; }
      if (job.thiefAt > 0 && job.walked >= job.thiefAt) {
        job.thiefAt = -1;
        var at = aheadOf(job.id + ':thief'); if (!at) return false;
        var n = 2; try { n = Math.max(2, partyMath('job', { skulls: job.skulls }).count - 1); } catch (e) {}
        job.thief = { x: at[0], y: at[1], n: n };
        now(n + ' of them on the road ahead, and they know what you carry.');   /* draft:true */
        try { render(); } catch (e) {}
      }
    }
    return false;
  };
  function thiefFight(job) { var t = job.thief; return t ? fight(job, 'thief', t.n, 'brigands', 'thieves after ' + job.item) : false; }
  ARRIVE['carry'] = function (job, x, y) {
    if (job.stage === 'carry') {
      if (job.thief && cheb(job.thief.x, job.thief.y, x, y) <= 1) return thiefFight(job) || true;
      var t = townNear(x, y, 1);
      if ((t && t.name === job.dest.name) || cheb(x, y, job.target.x, job.target.y) <= 1) {
        paid(job, job.pay, cap(job.item) + ', signed for in ' + job.dest.name + '. Paid ' + job.pay + ' batteries.');   /* draft:true */
      }
      return false;
    }
    if (job.stage === 'lair' && cheb(x, y, job.lair.x, job.lair.y) <= 1) return fight(job, 'lair', job.lair.n, 'brigands', 'their lair, and ' + job.item) || true;
    return false;
  };
  END['carry'] = function (job, f, won, ran, o) {
    if (f.what === 'thief') {
      job.thief = null;
      if (won && !ran) { sayLine('They are down, and ' + job.item + ' is still in the bag. On to ' + job.dest.name + '.'); save('contract:carry'); return; }   /* draft:true */
      /* stolen: tracks to their lair, a camp off the road */
      var R = rng(seedOf(job.id + ':lair')), s2 = spotOut(city.x, city.y, 4, 7, R, true);
      if (!s2) return lost(job, 'They took ' + job.item + ' and their tracks go nowhere. The job is lost.');   /* draft:true */
      var n = 3; try { n = partyMath('job', { skulls: job.skulls }).count; } catch (e) {}
      job.has = false; job.stage = 'lair'; job.lair = { x: s2[0], y: s2[1], n: n }; job.target = { x: s2[0], y: s2[1] };
      sayLine('They took ' + job.item + '. Their tracks go ' + way(s2[0] - city.x, s2[1] - city.y) + ', to a lair ' + cheb(s2[0], s2[1], city.x, city.y) + ' blocks off.');   /* draft:true */
      save('contract:stolen'); return;
    }
    if (f.what === 'lair') {
      if (won && !ran) { job.has = true; job.stage = 'carry'; job.lair = null; var d = gate(job.dest.x, job.dest.y) || [job.dest.x, job.dest.y]; job.target = { x: d[0], y: d[1] };
        sayLine('Got ' + job.item + ' back from their lair. On to ' + job.dest.name + '.'); save('contract:carry'); return; }   /* draft:true */
      sayLine(ran ? 'You pulled back. ' + cap(job.item) + ' is still in their lair.' : 'They held their lair. ' + cap(job.item) + ' is still there; the job is still yours.');   /* draft:true */
      save('contract:lair');
    }
  };

  /* ======================= DEFEND: hold-defend ======================= */
  /* the client's place, its gate marked HOLD; they come in the nights the client said, so he is there before the last of them
     (the nights are on the mark); standing at the mark the night comes: wave after wave, one fight each; every wave held pays its
     share and all held pays the whole job (QR-AF D1: burned attached locations cut the pay); not there in time, the place is raided */
  MAKE['hold-defend'] = function (job, k, row, town, R) {
    var sk = clamp(job.skulls, 1, 3), g0 = gate(town.x, town.y); if (!g0) return false;
    job.waves = row.waves || (k.waves_by_skulls || [1, 2, 3])[sk - 1]; job.wave = 0;
    job.by = day() + (row.days || k.days || 2);
    job.foe = row.foe || 'brigands'; job.what = row.what || ('the gate of ' + town.name);
    job.target = { x: g0[0], y: g0[1] };
    job.stage = 'hold';
    job.sayTake = 'Contract from ' + town.name + ': hold ' + job.what + '. They come within ' + (job.by - day()) + ' nights, ' + job.waves +
      (job.waves === 1 ? ' wave' : ' waves') + '. Stand on the HOLD mark at ' + town.name + ' before then.';
    return true;
  };
  function waveFight(job) {
    var n = 3; try { n = partyMath('job', { skulls: job.skulls }).count; } catch (e) {}
    var w = job.wave + 1;
    now('They come. Wave ' + w + ' of ' + job.waves + '.');   /* draft:true */
    return fight(job, 'wave', Math.max(2, n + (w > 1 ? 1 : 0) - (w === 1 && job.waves > 1 ? 1 : 0)), job.foe, 'wave ' + w + ' at ' + job.from);
  }
  /* the next wave when the map has him back: tried on the beat until the one door takes it */
  function nextWave(job, tries) {
    setTimeout(function () {
      if (LOOP.held.indexOf(job) < 0 || job.stage !== 'hold') return;
      var busy = false; try { busy = !!LOOP.fighting || !!(window.parent && window.parent.CITYFIGHT) || (typeof FZOOMING !== 'undefined' && FZOOMING); } catch (e) {}
      if (busy || !waveFight(job)) { if ((tries | 0) < 60) nextWave(job, (tries | 0) + 1); }
    }, tries ? 500 : 2500);
  }
  STEP['hold-defend'] = function (job) {
    if (job.stage === 'hold' && job.wave === 0 && day() > job.by) {
      lost(job, 'They came without you. ' + job.from + ' was raided, and nobody pays for that.');   /* draft:true */
    }
    return false;
  };
  ARRIVE['hold-defend'] = function (job, x, y) {
    if (job.stage !== 'hold') return false;
    if (cheb(x, y, job.target.x, job.target.y) > 1 && !atClient(job, x, y)) return false;
    if (job.wave === 0 && day() > job.by) { lost(job, 'They came without you. ' + job.from + ' was raided, and nobody pays for that.'); return false; }   /* draft:true */
    return waveFight(job) || true;
  };
  END['hold-defend'] = function (job, f, won, ran, o) {
    if (won && !ran) {
      job.wave++;
      if (job.wave >= job.waves) return paid(job, job.pay, job.from + ' held, all ' + job.waves + (job.waves === 1 ? ' wave' : ' waves') + '. Paid ' + job.pay + ' batteries.');   /* draft:true */
      sayLine('Wave ' + job.wave + ' of ' + job.waves + ' held. They regroup.');   /* draft:true */
      save('contract:wave'); nextWave(job, 0); return;
    }
    if (job.wave > 0) {   /* partial: what was held pays its share */
      var n = Math.max(1, Math.floor(job.pay * job.wave / job.waves));
      return paid(job, n, 'They got in on wave ' + (job.wave + 1) + '. ' + job.wave + ' of ' + job.waves + ' held: paid ' + n + ' batteries.');   /* draft:true */
    }
    lost(job, 'They got in. ' + job.from + ' was raided, and nobody pays for that.');   /* draft:true */
  };

  /* ======================= RECOVER: recover-return ======================= */
  /* the thing is somewhere in the valley, with whoever has it now (men, beasts, or nobody); reach it, take it (the fight where
     somebody holds it), bring it back to the client to be paid. QR-AF R1's twist as one that plays: they moved it (the place is
     empty, fresh tracks go on two to four blocks) */
  MAKE['recover-return'] = function (job, k, row, town, R) {
    var b = k.blocks || [6, 14], s = (job.real ? nearReal(job, R) : null) || spotOut(town.x, town.y, b[0], b[1], R, true); if (!s) return false;
    job.spot = { x: s[0], y: s[1] }; job.target = { x: s[0], y: s[1] };
    job.item = row.item || 'it'; job.where = row.where || null; job.foe = row.foe || 'brigands'; job.has = false;
    var n = 3; try { n = partyMath('job', { skulls: job.skulls }).count; } catch (e) {}
    job.guards = row.guards === 0 ? 0 : (row.guards || n);
    job.stage = 'get';
    job.sayTake = 'Contract from ' + town.name + ': get ' + job.item + ' back' + (job.placeName ? ' from ' + job.placeName : job.where ? ' from ' + job.where : '') + ', ' +
      way(s[0] - town.x, s[1] - town.y) + ', ' + blocksWord(cheb(s[0], s[1], town.x, town.y)) + '. ' +
      (job.guards ? 'About ' + job.guards + (job.foe === 'beasts' ? ' animals are' : ' are') + ' on it.' : 'Nobody guards it, they say.');
    return true;
  };
  function gotIt(job, pre) {
    job.has = true; job.stage = 'back'; backTo(job);
    sayLine((pre || '') + 'Got ' + job.item + '. Back to ' + job.from + ' to be paid.');   /* draft:true */
    save('contract:got');
  }
  ARRIVE['recover-return'] = function (job, x, y) {
    if (job.stage === 'get' && cheb(x, y, job.spot.x, job.spot.y) <= 1) {
      if (job.twist === 'moved' && !job.twistDone) {   /* they moved it: the tracks go on */
        job.twistDone = true;
        var s2 = spotOut(job.spot.x, job.spot.y, 2, 4, rng(seedOf(job.id + ':moved')), true);
        if (s2) { job.spot = { x: s2[0], y: s2[1] }; job.target = { x: s2[0], y: s2[1] };
          now('Empty. They moved it; fresh tracks go ' + way(s2[0] - x, s2[1] - y) + ', ' + cheb(s2[0], s2[1], x, y) + ' blocks.'); try { render(); } catch (e) {} return false; }   /* draft:true */
      }
      if (job.guards > 0) return fight(job, 'guards', job.guards, job.foe, 'the ones holding ' + job.item) || true;
      gotIt(job); return false;
    }
    if (job.stage === 'back' && atClient(job, x, y)) paid(job, job.pay, cap(job.item) + ', back in ' + job.from + '. Paid ' + job.pay + ' batteries.');   /* draft:true */
    return false;
  };
  END['recover-return'] = function (job, f, won, ran, o) {
    if (won && !ran) return gotIt(job, 'They are down. ');   /* draft:true */
    job.guards = Math.max(1, job.guards - (o.dead | 0));
    sayLine((ran ? 'You pulled back. ' : 'They held on to it. ') + cap(job.item) + ' is still there, ' + job.guards + ' on it. The job is still yours.');   /* draft:true */
    save('contract:guards');
  };

  /* ======================= PATROL: patrol ======================= */
  /* walk two posts and come back (Battle Brothers: 'patrol two settlements and return; paid for heads; the closest camps
     spawn roaming parties while you are on it'); the posts are other towns or road posts six to eighteen blocks out, marked
     POST 1 and POST 2, walked in any order; past each a band comes out ahead on his road; every one put down on the patrol
     counts; back at the client: half flat, half a head, capped (QR-AF P1: per head capped, the only kind besides CLEAR) */
  MAKE['patrol'] = function (job, k, row, town, R) {
    var b = k.post_blocks || [6, 18], posts = [];
    var ts = towns().filter(function (t) { var d = cheb(t.x, t.y, town.x, town.y); return t.name !== town.name && d >= b[0] && d <= b[1]; });
    ts.sort(function () { return R() - 0.5; });
    for (var i = 0; i < ts.length && posts.length < 2; i++) { var g1 = gate(ts[i].x, ts[i].y);
      if (g1 && route(city.x, city.y, g1[0], g1[1]) && !posts.some(function (p) { return cheb(p.x, p.y, g1[0], g1[1]) < 5; })) posts.push({ x: g1[0], y: g1[1], name: ts[i].name, done: false }); }
    for (var t = 0; t < 10 && posts.length < 2; t++) { var s = spotOut(town.x, town.y, b[0], b[1], R, true);
      if (s && !posts.some(function (p) { return cheb(p.x, p.y, s[0], s[1]) < 5; })) posts.push({ x: s[0], y: s[1], name: null, done: false }); }
    if (posts.length < 2) return false;
    var sk = clamp(job.skulls, 1, 3);
    job.posts = posts; job.heads = 0; job.cap = row.cap || (k.cap_by_skulls || [4, 7, 10])[sk - 1];
    job.bands = (k.bands_by_skulls || [1, 2, 2])[sk - 1]; job.band = null; job.walked = 0;
    job.flat = Math.max(1, Math.round(job.pay * (k.flat == null ? 0.5 : k.flat)));
    job.perHead = Math.max(1, Math.round((job.pay - job.flat) / job.cap));
    job.target = { x: posts[0].x, y: posts[0].y };
    job.stage = 'patrol';
    job.sayTake = 'Contract from ' + town.name + ': walk the posts' + (posts[0].name ? ' at ' + posts[0].name : '') + (posts[1].name ? ' and ' + posts[1].name : '') +
      ' and come back. ' + job.flat + ' batteries, and ' + job.perHead + ' for every one you put down on the way, up to ' + job.cap + '.';
    return true;
  };
  function postNext(job) { var n = null; job.posts.forEach(function (p) { if (!p.done && !n) n = p; }); return n; }
  function postWalked(job, p) {
    p.done = true;
    var left = job.posts.filter(function (q) { return !q.done; }).length, n = job.posts.length - left;
    var line = 'Post ' + n + ' of ' + job.posts.length + ' walked' + (p.name ? ' at ' + p.name : '') + '.';
    if (job.twist === 'event' && !job.twistDone && left === 0) {   /* the patrol's road event, kept as text (QR-AF P1: the crucified man) */
      job.twistDone = true; line += ' A man is tied to the post sign, very still, facing the road. Nobody in the crew says anything.';   /* draft:true */
    }
    if (left) { var nx = postNext(job); job.target = { x: nx.x, y: nx.y }; line += ' On to the next.'; }
    else { job.stage = 'back'; backTo(job); line += ' Back to ' + job.from + ' to be paid.'; }
    if (job.bands > 0) { job.bands--; job.bandDue = (job.walked | 0) + 3; }
    sayLine(line); save('contract:post');   /* draft:true */
  }
  function bandFight(job) { var b = job.band; return b ? fight(job, 'band', b.n, 'brigands', 'a crew on the patrol road') : false; }
  STEP['patrol'] = function (job) {
    if (job.stage !== 'patrol' && job.stage !== 'back') return false;
    job.walked = (job.walked | 0) + 1;
    if (job.band) { if (closeIn(job.band)) return bandFight(job); return false; }
    if (job.bandDue && job.walked >= job.bandDue) {
      job.bandDue = 0;
      var at = aheadOf(job.id + ':band:' + job.walked);
      if (at) { var n = 2; try { n = partyMath('job', { skulls: job.skulls }).count; } catch (e) {}
        job.band = { x: at[0], y: at[1], n: n }; window.__JOB_BANDS = (window.__JOB_BANDS | 0) + 1;
        now('A crew on the patrol road, ' + n + ' of them, coming your way.'); try { render(); } catch (e) {} }   /* draft:true */
    }
    if (job.stage === 'patrol') { var p = null; job.posts.forEach(function (q) { if (!q.done && cheb(q.x, q.y, city.x, city.y) <= 1) p = q; }); if (p) postWalked(job, p); }
    return false;
  };
  ARRIVE['patrol'] = function (job, x, y) {
    if (job.band && cheb(job.band.x, job.band.y, x, y) <= 1) return bandFight(job) || true;
    if (job.stage === 'patrol') { var p = null; job.posts.forEach(function (q) { if (!q.done && cheb(q.x, q.y, x, y) <= 1) p = q; }); if (p) postWalked(job, p); return false; }
    if (job.stage === 'back' && atClient(job, x, y)) {
      var heads = Math.min(job.cap, job.heads | 0), n = Math.min(job.pay, job.flat + heads * job.perHead);
      paid(job, n, 'The patrol is walked. ' + heads + ' put down on the road. Paid ' + n + ' batteries.');   /* draft:true */
    }
    return false;
  };
  END['patrol'] = function (job, f, won, ran, o) {
    job.heads = (job.heads | 0) + Math.max(0, o.dead | 0); job.band = null;
    sayLine((won && !ran ? 'They are down. ' : 'You got clear of them. ') + 'Patrol: ' + Math.min(job.cap, job.heads) + ' of ' + job.cap + ' heads.');   /* draft:true */
    save('contract:band');
  };

  /* ---------- THE FIVE MOMENTS THE MAP'S LOOP HANDS OVER ---------- */
  /* 1. TAKEN at the board: the kind decides where the job is and what it says; false = it plays as today's crew */
  function make(job, c, town, tg) {
    var kind = kindOf(c), k = K(kind), row = (DATA && DATA.offers && DATA.offers[c.id]) || {};
    job.kind = kind; job.verb = k ? k.verb : 'CLEAR'; job.word = k ? k.word : 'CLEAR'; job.plays = 'clear-crew';
    /* the place its words name (rule 164 item 3): the client's town always, and the row's place */
    job.from = town.name; job.fromAt = { x: town.x | 0, y: town.y | 0 };
    var pl = row.place || null;
    job.placeName = pl && pl.name ? String(pl.name).toUpperCase() : null;
    job.real = pl && pl.real ? realPlace(pl.real) : null;
    job.placeWay = pl && pl.way ? String(pl.way) : null;
    if (!built(kind) || kind === 'clear-crew' || window.__JOB_KINDS_OFF) {
      /* today's crew job: at the real place when the words name one (a crew he can reach beside it), else where the map put it */
      if (job.real && !window.__JOB_KINDS_OFF) { var R0 = rng(seedOf(job.id + ':crew')), s0 = nearReal(job, R0); if (s0) { job.target = { x: s0[0], y: s0[1] };
        job.sayTake = 'Contract from ' + town.name + ': ' + job.title + ', at ' + job.placeName + ', ' + way(s0[0] - town.x, s0[1] - town.y) + ', ' + blocksWord(cheb(s0[0], s0[1], town.x, town.y)) + '. Pays ' + job.pay + ' batteries.'; } }   /* draft:true */
      return false;
    }
    var R = rng(seedOf(job.id + ':' + town.name + ':' + day() + ':' + (LOOP.done | 0)));
    job.twist = (R() < (k.twist_rate || 0)) ? pickOf(k.twists, R) : null;
    /* A REAL PLACE OUT IN THE REGION THAT IS NOT ON THE MAP YET (the region's real places arrive with the land's painting, a few
       seconds after the map on a computer, much longer on a slow box): the job WAITS for it, never a made place wearing its name */
    if (pl && pl.real && !job.real && !(root.BOH_REGION && root.BOH_REGION.ready)) {
      job.plays = kind; job.made = day(); job.stage = 'wait'; job.waitReal = String(pl.real);
      job.sayTake = 'Contract from ' + town.name + ': ' + job.title + '. ' + job.placeName + ' is out past the valley; the map shows it in a moment.';   /* draft:true */
      window.__JOB_MADE = (window.__JOB_MADE || []).concat([{ id: job.id, kind: kind, twist: job.twist, wait: job.waitReal }]).slice(-20);
      return true;
    }
    var ok = false; try { ok = MAKE[kind](job, k, row, town, R, tg); } catch (e) { ok = false; }
    if (!ok) { job.sayTake = null; return false; }
    job.plays = kind; job.made = day();
    window.__JOB_MADE = (window.__JOB_MADE || []).concat([{ id: job.id, kind: kind, twist: job.twist }]).slice(-20);
    return true;
  }
  /* 2. ARRIVED (a journey ended, or he touched where he stands): true = a fight started, the town stays shut */
  function arrived(x, y) {
    var H = held();
    for (var i = 0; i < H.length; i++) { var f = ARRIVE[H[i].plays]; if (f && f(H[i], x, y) === true) return true; }
    return false;
  }
  /* 3. A STEP of his: the cargo follows, the packs and the raiders move; true = a fight started */
  function step() {
    STEPS++;
    var H = held();
    for (var i = 0; i < H.length; i++) { var f = STEP[H[i].plays], k = K(H[i].plays) || {}; if (f && f(H[i], k) === true) return true; }
    return false;
  }
  /* 4. A FIGHT ENDED that was this job's */
  function fightEnd(job, o) {
    o = o || {};
    var f = job.fight || { what: job.plays }; job.fight = null;
    var won = !!(o.victory || o.result === 'win'), ran = won && (o.alive | 0) > 0;
    window.__JOB_ENDS = (window.__JOB_ENDS || []).concat([{ id: job.id, what: f.what, won: won, ran: ran, dead: o.dead | 0 }]).slice(-20);
    try { var e = END[job.plays]; if (e) e(job, f, won, ran, o); } catch (err) { window.__JOB_ERR = String(err && err.message || err); }
    try { if (typeof saveNow === 'function') setTimeout(function () { saveNow('fight:' + (won ? 'won' : 'lost')); }, 0); } catch (e2) {}
  }
  /* 5. HERE: is there something of a held job at his feet (a touch where he stands is the arrival) */
  function here(x, y) {
    var H = held();
    for (var i = 0; i < H.length; i++) { var j = H[i];
      if (j.plays === 'hunt-kind' && j.stage === 'hunt' && packNear(j, x, y, 1)) return true;
      if (j.plays === 'clear-camp' && j.stage === 'camp' && cheb(x, y, j.camp.x, j.camp.y) <= 1) return true;
      if (j.plays === 'haul-caravan' && j.raid && cheb(x, y, j.raid.x, j.raid.y) <= 1) return true;
      if ((j.plays === 'find-place' || j.plays === 'find-person') && j.stage === 'look' && cheb(x, y, j.ring.x, j.ring.y) <= j.ring.r) return true;
      if (j.plays === 'carry' && ((j.thief && cheb(x, y, j.thief.x, j.thief.y) <= 1) || (j.stage === 'lair' && cheb(x, y, j.lair.x, j.lair.y) <= 1))) return true;
      if (j.plays === 'hold-defend' && j.stage === 'hold' && cheb(x, y, j.target.x, j.target.y) <= 1) return true;
      if (j.plays === 'recover-return' && j.stage === 'get' && cheb(x, y, j.spot.x, j.spot.y) <= 1) return true;
      if (j.plays === 'patrol' && j.band && cheb(x, y, j.band.x, j.band.y) <= 1) return true; }
    return false;
  }
  /* the clock a block costs: the caravan's pace while cargo walks with him */
  function pace() {
    var m = 1, H = held();
    for (var i = 0; i < H.length; i++) { var j = H[i], k = K(j.plays) || {};
      if ((j.plays === 'haul-caravan' && j.stage === 'haul') || (j.plays === 'find-person' && j.stage === 'home')) m = Math.max(m, k.pace || 1.5); }
    return m;
  }
  function status(job) {
    if (!owns(job)) return null;
    if (job.stage === 'wait') return 'TO ' + (job.placeName || 'THE PLACE');
    if (job.plays === 'haul-caravan') return job.cargo.n + '/' + job.cargo.of + ' ' + plural(job.cargo.unit, job.cargo.of).toUpperCase() + ' TO ' + String(job.dest.name).toUpperCase();
    if (job.plays === 'hunt-kind') return job.stage === 'back' ? 'HUNT DONE · BACK TO ' + String(job.from).toUpperCase() : 'HUNT ' + (job.got | 0) + '/' + job.need;
    if (job.plays === 'clear-camp') return 'CAMP · ' + job.camp.men;
    if (job.plays === 'carry') return job.stage === 'lair' ? 'STOLEN · THEIR LAIR' : 'CARRY TO ' + String(job.dest.name).toUpperCase();
    if (job.plays === 'hold-defend') return 'HOLD ' + String(job.from).toUpperCase() + ' · WAVE ' + Math.min(job.wave + 1, job.waves) + '/' + job.waves + ' · BY DAY ' + job.by;
    if (job.plays === 'patrol') return job.stage === 'back' ? 'PATROL WALKED · BACK TO ' + String(job.from).toUpperCase() : 'PATROL ' + job.posts.filter(function (p) { return p.done; }).length + '/' + job.posts.length + ' · ' + Math.min(job.cap, job.heads | 0) + ' HEADS';
    if (job.plays === 'recover-return') return job.stage === 'get' ? 'GET ' + String(job.item).toUpperCase() : 'GOT IT · BACK TO ' + String(job.from).toUpperCase();
    if (job.stage === 'look') return 'FIND · ' + String(job.what).toUpperCase();
    if (job.stage === 'home') return job.cargo.n + ' HOME TO ' + String(job.from).toUpperCase();
    return 'FOUND · BACK TO ' + String(job.from).toUpperCase();
  }
  /* a tap on something this file drew: a pack is gone after (the second tap is not needed: a pack moves), the rest walks there */
  function tap(sx, sy) {
    for (var i = HITS.length - 1; i >= 0; i--) { var h = HITS[i];
      if (sx < h.x - 4 || sx > h.x + h.w + 4 || sy < h.y - 4 || sy > h.y + h.h + 4) continue;
      var job = null; LOOP.held.forEach(function (j) { if (j.id === h.job) job = j; });
      if (!job) continue;
      if (cheb(h.cell[0], h.cell[1], city.x, city.y) <= 1) { try { travelStop(); } catch (e) {} if (arrived(city.x, city.y)) return true; }
      if (h.pack != null) job.chase = h.pack;
      try { travelStop(); return travelTo(0, 0, h.cell) || true; } catch (e) { return false; }
    }
    return false;
  }

  /* ---------- DRAWN ON THE MAP (the map's own pen: its people, its flag, its plates, its truck) ---------- */
  var BEAST = {}, BEAST_META = { wolf: { file: 'fight_rig/beast_dire_wolf.webp', w: 107, h: 116, foot: [51, 83] },
                                hyena: { file: 'fight_rig/beast_cave_hyena.webp', w: 106, h: 125, foot: [53, 91] } };
  var SHEET_DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
  function beastImg(look) {
    var m = BEAST_META[look] || BEAST_META.wolf, im = BEAST[look];
    if (!im) { im = BEAST[look] = new Image(); im.onload = function () { try { render(); } catch (e) {} }; im.src = m.file; }
    return im.complete && im.naturalWidth ? im : null;
  }
  /* one beast with its feet on the point: the fight's own sheet (fight_rig.json: a row a facing, a column a frame) at a person's ruler */
  function beastDraw(look, face, frame, sx, footY) {
    var im = beastImg(look), m = BEAST_META[look] || BEAST_META.wolf; if (!im) return false;
    var s = 0.5 * MAP_PERSON_K * MAP_PEOPLE_K, row = Math.max(0, SHEET_DIRS.indexOf(face));
    var w = m.w * s, h = m.h * s;
    g.fillStyle = 'rgba(10,8,6,0.4)'; g.beginPath(); g.ellipse(sx, footY, w * 0.26, w * 0.07, 0, 0, 7); g.fill();
    var sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = false;
    g.drawImage(im, frame * m.w, row * m.h, m.w, m.h, Math.round(sx - m.foot[0] * s), Math.round(footY - m.foot[1] * s), w, h);
    g.imageSmoothingEnabled = sm;
    try { MAP_DREW.beasts = (MAP_DREW.beasts | 0) + 1; } catch (e) {}
    return true;
  }
  function faceTo(dx, dy) { var sx = dx - dy, sy = dx + dy; if (!sx && !sy) return 'S'; var a = Math.atan2(sy, sx) * 180 / Math.PI; return ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'][(Math.round(((a + 360) % 360) / 45)) % 8]; }
  function plate(t, sx, cy, col, up) {
    g.font = '700 9px ' + FACE('casing');
    var w = g.measureText(t).width;
    MAP_PLATES.push({ t: t, lx: sx - w / 2 - 3, ly: cy - (up || 44), w: w, col: col, sx: sx, cy: cy, r: 33 });
    return { x: sx - w / 2 - 3, y: cy - (up || 44), w: w + 6, h: 11 };
  }
  function vis(p) { return !(p.sx < -60 || p.sx > CVW + 60 || p.sy < -80 || p.sy > CVH + 80); }
  /* the real place came onto the map: the job is made there now, from where the client is */
  function settleWait(job) {
    if (job.stage !== 'wait' || !job.waitReal) return false;
    var rp = realPlace(job.waitReal); if (!rp) return false;
    var k = K(job.plays), row = (DATA && DATA.offers && DATA.offers[job.id]) || {}, town = { name: job.from, x: job.fromAt.x, y: job.fromAt.y };
    job.real = rp; job.waitReal = null; job.stage = null;
    var R = rng(seedOf(job.id + ':' + town.name + ':' + job.made)), ok = false;
    try { ok = MAKE[job.plays](job, k, row, town, R, null); } catch (e) { ok = false; }
    if (!ok) { job.real = null; try { ok = MAKE[job.plays](job, k, row, town, R, job.target || null); } catch (e) { ok = false; } }
    if (!ok) { lost(job, 'Nobody can get to ' + job.placeName + ' from here. The job is off: ' + job.title + '.'); return false; }   /* draft:true */
    sayLine(job.sayTake); save('contract:place');
    window.__JOB_SETTLED = (window.__JOB_SETTLED || []).concat([{ id: job.id, place: job.real ? job.real.name : null }]).slice(-20);
    return true;
  }
  function draw(ox, oy) {
    HITS = [];
    var H = held(), bt = mapArtBeat(), kp = MAP_PEOPLE_K;
    H.forEach(function (j) { if (j.stage === 'wait') settleWait(j); });
    H = held();
    H.forEach(function (j) {
      if (j.stage === 'wait') return;
      try { (DRAWS[j.plays] || function () {})(j, ox, oy, bt, kp); } catch (e) { window.__JOB_DRAW_ERR = String(e && e.message || e); }
    });
    try { MAP_DREW.jobKinds = H.length; } catch (e) {}
    /* every job he holds, today's crew job too: where it sends him next, named and marked (rule 164 item 3) */
    var marks = []; try { (LOOP.held || []).forEach(function (j) { try { var m = markNext(j, ox, oy, bt); if (m) marks.push(m); } catch (e) { window.__JOB_DRAW_ERR = String(e && e.message || e); } }); } catch (e) {}
    window.__JOB_MARKS = marks;
  }
  /* THE NEXT PLACE, MARKED: on the glass a ring on its ground that breathes on the beat, and a made place's name on the ground
     under it (a town and a real place name themselves: the map's hooks light their own plates); off the glass, its name at the
     glass's edge on the line from the middle of the glass, a point toward it, the act first ('ESCORT TO PRIMM'). A tap on
     either walks there. No flag and no road line (rule 164 item 10). */
  var EDGE = { l: 14, r: 14, t: 66, b: 124 };
  function markNext(j, ox, oy, bt) {
    var n = nextOf(j); if (!n || n.x == null) return null;
    var p = iso(n.x, n.y, ox, oy), fy = p.sy + TH / 2 + 2, cell = n.town ? (gate(n.x, n.y) || [n.x, n.y]) : [n.x, n.y];
    var label = n.act === 'HOLD' ? 'HOLD · ' + (n.sub || n.name) : n.act === 'GET PAID' ? 'GET PAID · ' + n.name : n.act === 'THE JOB' ? n.name : n.act + (/ TO$/.test(n.act) ? ' ' : ' · ') + n.name;
    var on = p.sx > EDGE.l && p.sx < CVW - EDGE.r && fy > EDGE.t && fy < CVH - EDGE.b;
    if (on) {
      var rw = n.town ? 30 : 20, pulse = 0.55 + 0.35 * ((bt % 2) ? 1 : 0);
      g.save(); g.globalAlpha = pulse; g.strokeStyle = '#f0b44c'; g.lineWidth = 2;
      g.beginPath(); g.ellipse(p.sx, fy + 2, rw, rw * 0.38, 0, 0, 7); g.stroke(); g.restore();
      if (!n.town) { g.font = '700 9px ' + FACE('casing'); var w = g.measureText(n.name).width;
        MAP_PLATES.push({ t: n.name, lx: p.sx - w / 2 - 3, ly: fy + 12, w: w, col: '#ffd27a', sx: p.sx, cy: fy + 26, r: 0 });
        hit(j, { x: p.sx - w / 2 - 3, y: fy + 12, w: w + 6, h: 11 }, cell); }
      try { MAP_DREW.jobRings = (MAP_DREW.jobRings | 0) + 1; } catch (e) {}
      return { id: j.id, name: n.name, act: n.act, label: label, on: true, x: n.x, y: n.y, sx: Math.round(p.sx), sy: Math.round(fy) };
    }
    /* off the glass: where the line from the middle of the glass to it leaves the glass (inside the bars and the pad) */
    var cx = CVW / 2, cy = (EDGE.t + CVH - EDGE.b) / 2, dx = p.sx - cx, dy = fy - cy;
    var tx = dx > 0 ? (CVW - EDGE.r - cx) / dx : dx < 0 ? (EDGE.l - cx) / dx : Infinity, ty = dy > 0 ? (CVH - EDGE.b - cy) / dy : dy < 0 ? (EDGE.t - cy) / dy : Infinity;
    var t = Math.min(tx, ty), ex = cx + dx * t, ey = cy + dy * t, L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L;
    g.font = '700 9px ' + FACE('casing');
    var tw = g.measureText(label).width + 6, bx = Math.max(EDGE.l, Math.min(CVW - EDGE.r - tw, ex - ux * 14 - tw / 2)), by = Math.max(EDGE.t, Math.min(CVH - EDGE.b - 11, ey - uy * 14 - 5));
    /* the point: a small amber wedge at the edge, aimed at the place */
    g.save(); g.fillStyle = 'rgba(12,10,8,0.82)'; g.strokeStyle = '#f0b44c'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(ex + ux * 6, ey + uy * 6); g.lineTo(ex - ux * 5 - uy * 6, ey - uy * 5 + ux * 6); g.lineTo(ex - ux * 5 + uy * 6, ey - uy * 5 - ux * 6); g.closePath(); g.fill(); g.stroke(); g.restore();
    MAP_PLATES.push({ t: label, lx: bx, ly: by, w: tw - 6, col: '#f0b44c', sx: bx + tw / 2, cy: by + 14, r: 0 });
    hit(j, { x: Math.min(bx, ex - 8), y: Math.min(by, ey - 8), w: Math.max(bx + tw, ex + 8) - Math.min(bx, ex - 8), h: Math.max(by + 11, ey + 8) - Math.min(by, ey - 8) }, cell);
    try { MAP_DREW.jobEdges = (MAP_DREW.jobEdges | 0) + 1; } catch (e) {}
    return { id: j.id, name: n.name, act: n.act, label: label, on: false, x: n.x, y: n.y, ex: Math.round(ex), ey: Math.round(ey), box: [Math.round(bx), Math.round(by), Math.round(tw), 11] };
  }
  function hit(job, box, cell, pack) { HITS.push({ job: job.id, x: box.x, y: box.y, w: box.w, h: box.h, cell: cell, pack: pack == null ? null : pack }); }
  function cargoDraw(job, ox, oy, kp) {
    var tr = job.trail || [], at = tr.length >= 2 ? tr[tr.length - 2] : [city.x, city.y];
    if (at[0] === city.x && at[1] === city.y) at = [city.x + 1, city.y + 1];
    var p = iso(at[0], at[1], ox, oy); if (!vis(p)) return;
    var tk = window.__RIG_TRUCK, fy = p.sy + TH / 2 + 2;
    if (tk && tk.complete && tk.naturalWidth) { var tw = Math.round(26 * Math.max(0.7, kp)), th = Math.round(tw * tk.naturalHeight / tk.naturalWidth), sm = g.imageSmoothingEnabled;
      g.fillStyle = 'rgba(10,8,6,0.4)'; g.beginPath(); g.ellipse(p.sx, fy, tw * 0.45, tw * 0.12, 0, 0, 7); g.fill();
      g.imageSmoothingEnabled = false; g.drawImage(tk, Math.round(p.sx - tw / 2), Math.round(fy - th), tw, th); g.imageSmoothingEnabled = sm; }
    else { g.fillStyle = '#e8b048'; g.fillRect(p.sx - 5, fy - 6, 10, 6); }
    plate(job.cargo.n + '/' + job.cargo.of + ' ' + plural(job.cargo.unit, job.cargo.of).toUpperCase(), p.sx, fy, '#f2d7a0', 30);
    try { MAP_DREW.cargo = (MAP_DREW.cargo | 0) + 1; } catch (e) {}
  }
  function peopleDraw(sx, fy, bt, kp, flag, n) {
    var L = null;
    if (mapPeopleOf('job', 0)) {
      mapPersonDraw(mapPeopleOf('job', 7 + n), 'S', bt + 1, sx + 7 * kp, fy - 2 * kp, 0.5);
      L = mapPersonDraw(mapPeopleOf('job', 9 + n), 'SW', bt, sx - 3 * kp, fy + kp, 0);
    }
    if (flag) mapFlagDraw(sx - 11 * kp, fy + kp, (L ? L.h : 30 * kp) + 8 * kp, flag, bt, true);
    return L ? L.h : 30 * kp;
  }
  var DRAWS = {};
  DRAWS['haul-caravan'] = function (j, ox, oy, bt, kp) {
    if (j.stage !== 'haul') return;
    cargoDraw(j, ox, oy, kp);
    var d = iso(j.target.x, j.target.y, ox, oy);
    if (vis(d)) hit(j, plate('ESCORT TO ' + String(j.dest.name).toUpperCase(), d.sx, d.sy + TH / 2 + 2, '#f0b44c', 30), [j.target.x, j.target.y]);
    if (j.raid) { var r = iso(j.raid.x, j.raid.y, ox, oy), fy = r.sy + TH / 2 + 2;
      if (vis(r)) { var hh = peopleDraw(r.sx, fy, bt, kp, '#7a1f1a', 0);
        hit(j, plate('RAIDERS · ' + j.raid.n, r.sx, fy, '#ff8f7a', hh + 14), [j.raid.x, j.raid.y]);
        HITS.push({ job: j.id, x: r.sx - 18 * kp, y: fy - hh - 4, w: 36 * kp, h: hh + 10, cell: [j.raid.x, j.raid.y], pack: null }); } }
  };
  function ringDraw(j, ox, oy) {
    var c = j.ring, beat = mapArtBeat();
    g.save(); g.strokeStyle = '#f0b44c'; g.lineWidth = 1.5;
    var n = 28;
    for (var i = 0; i < n; i++) { if ((i + beat) % 2) continue;
      var a0 = i / n * Math.PI * 2, a1 = (i + 0.6) / n * Math.PI * 2;
      var p0 = iso(c.x + Math.cos(a0) * c.r, c.y + Math.sin(a0) * c.r, ox, oy), p1 = iso(c.x + Math.cos(a1) * c.r, c.y + Math.sin(a1) * c.r, ox, oy);
      g.globalAlpha = 0.8; g.beginPath(); g.moveTo(p0.sx, p0.sy + TH / 2); g.lineTo(p1.sx, p1.sy + TH / 2); g.stroke(); }
    g.restore();
    try { MAP_DREW.rings = (MAP_DREW.rings | 0) + 1; } catch (e) {}
  }
  DRAWS['find-place'] = DRAWS['find-person'] = function (j, ox, oy, bt, kp) {
    if (j.stage === 'look') {
      ringDraw(j, ox, oy);
      var c = iso(j.ring.x, j.ring.y, ox, oy);
      if (vis(c)) hit(j, plate('FIND · ' + String(j.what).toUpperCase(), c.sx, c.sy + TH / 2, '#f0b44c', 18), [j.ring.x, j.ring.y]);
      return;
    }
    if (j.stage === 'home') { cargoPeople(j, ox, oy, bt, kp); }
    var b = iso(j.target.x, j.target.y, ox, oy);
    if (vis(b)) hit(j, plate(j.stage === 'home' ? 'HOME' : 'GET PAID', b.sx, b.sy + TH / 2 + 2, '#9fe08a', 30), [j.target.x, j.target.y]);
  };
  function cargoPeople(j, ox, oy, bt, kp) {
    var tr = j.trail || [], at = tr.length >= 2 ? tr[tr.length - 2] : [city.x + 1, city.y + 1];
    if (at[0] === city.x && at[1] === city.y) at = [city.x + 1, city.y + 1];
    var p = iso(at[0], at[1], ox, oy); if (!vis(p)) return;
    var fy = p.sy + TH / 2 + 2, hh = peopleDraw(p.sx, fy, bt, kp, null, 20);
    plate(j.cargo.n + ' ' + plural(j.cargo.unit, j.cargo.n).toUpperCase(), p.sx, fy, '#f2d7a0', hh + 14);
  }
  DRAWS['hunt-kind'] = function (j, ox, oy, bt, kp) {
    if (j.stage === 'back') { var b = iso(j.target.x, j.target.y, ox, oy); if (vis(b)) hit(j, plate('GET PAID', b.sx, b.sy + TH / 2 + 2, '#9fe08a', 30), [j.target.x, j.target.y]); return; }
    j.packs.forEach(function (p, i) {
      var q = iso(p.x, p.y, ox, oy); if (!vis(q)) return;
      var fy = q.sy + TH / 2 + 2, face = faceTo(city.x - p.x, city.y - p.y), fr = 1 + ((bt + p.id) % 6), show = Math.min(3, p.n);
      var spots = [[0, 0], [-9, -3], [9, -2]];
      for (var s = show - 1; s >= 0; s--) beastDraw(p.look, face, p.smelt ? fr : (s === 0 ? 0 : fr), q.sx + spots[s][0] * kp, fy + spots[s][1] * kp);
      var box = plate(p.n + ' · HUNT ' + (j.got | 0) + '/' + j.need, q.sx, fy, p.smelt ? '#ff8f7a' : '#f2d7a0', 34);
      hit(j, box, [p.x, p.y], p.id);
      HITS.push({ job: j.id, x: q.sx - 22 * kp, y: fy - 30 * kp, w: 44 * kp, h: 34 * kp, cell: [p.x, p.y], pack: p.id });
    });
  };
  DRAWS['clear-camp'] = function (j, ox, oy, bt, kp) {
    if (j.stage !== 'camp') return;
    campDraw(j, j.camp, 'CAMP · ' + j.camp.men, ox, oy, bt, kp, j.foe === 'beasts');
  };
  function campDraw(j, c, label, ox, oy, bt, kp, beasts) {
    var q = iso(c.x, c.y, ox, oy); if (!vis(q)) return;
    var fy = q.sy + TH / 2 + 2, fl = 0.75 + 0.25 * Math.sin(performance.now() / 120);
    g.save();
    var gr = g.createRadialGradient(q.sx, fy - 2, 1, q.sx, fy - 2, 22 * kp); gr.addColorStop(0, 'rgba(255,170,70,' + (0.55 * fl) + ')'); gr.addColorStop(1, 'rgba(255,120,40,0)');
    g.fillStyle = gr; g.beginPath(); g.ellipse(q.sx, fy - 2, 22 * kp, 12 * kp, 0, 0, 7); g.fill();
    g.fillStyle = '#2a1d12'; g.fillRect(q.sx - 4 * kp, fy - 1, 8 * kp, 2);
    g.fillStyle = 'rgba(255,190,90,' + fl + ')'; g.beginPath(); g.moveTo(q.sx - 3 * kp, fy - 1); g.lineTo(q.sx, fy - 7 * kp * fl); g.lineTo(q.sx + 3 * kp, fy - 1); g.fill();
    g.restore();
    var hh = 30 * kp;
    if (beasts) { beastDraw('wolf', 'SW', 0, q.sx - 12 * kp, fy - 3 * kp); beastDraw('hyena', 'SE', 0, q.sx + 12 * kp, fy - 1); }
    else { hh = peopleDraw(q.sx - 10 * kp, fy - 3 * kp, bt, kp, '#c4553f', 30); peopleDraw(q.sx + 12 * kp, fy, bt + 2, kp, null, 33); }
    hit(j, plate(label, q.sx, fy, '#e8806a', hh + 16), [c.x, c.y]);
    HITS.push({ job: j.id, x: q.sx - 26 * kp, y: fy - hh - 4, w: 52 * kp, h: hh + 10, cell: [c.x, c.y], pack: null });
  }

  DRAWS['carry'] = function (j, ox, oy, bt, kp) {
    if (j.stage === 'carry') {
      var d = iso(j.target.x, j.target.y, ox, oy);
      if (vis(d)) hit(j, plate('CARRY TO HERE', d.sx, d.sy + TH / 2 + 2, '#f0b44c', 30), [j.target.x, j.target.y]);
      if (j.thief) { var r = iso(j.thief.x, j.thief.y, ox, oy), fy = r.sy + TH / 2 + 2;
        if (vis(r)) { var hh = peopleDraw(r.sx, fy, bt, kp, '#7a1f1a', 3); hit(j, plate('THIEVES · ' + j.thief.n, r.sx, fy, '#ff8f7a', hh + 14), [j.thief.x, j.thief.y]);
          HITS.push({ job: j.id, x: r.sx - 18 * kp, y: fy - hh - 4, w: 36 * kp, h: hh + 10, cell: [j.thief.x, j.thief.y], pack: null }); } }
      return;
    }
    if (j.stage === 'lair') campDraw(j, j.lair, 'LAIR · ' + j.lair.n, ox, oy, bt, kp, false);
  };
  DRAWS['hold-defend'] = function (j, ox, oy, bt, kp) {
    var d = iso(j.target.x, j.target.y, ox, oy); if (!vis(d)) return;
    var left = j.by - day();
    hit(j, plate('HOLD · ' + (left > 0 ? left + (left === 1 ? ' NIGHT' : ' NIGHTS') : 'TONIGHT'), d.sx, d.sy + TH / 2 + 2, '#ffb35c', 30), [j.target.x, j.target.y]);
  };
  DRAWS['recover-return'] = function (j, ox, oy, bt, kp) {
    if (j.stage === 'back') { var b = iso(j.target.x, j.target.y, ox, oy); if (vis(b)) hit(j, plate('GET PAID', b.sx, b.sy + TH / 2 + 2, '#9fe08a', 30), [j.target.x, j.target.y]); return; }
    var q = iso(j.spot.x, j.spot.y, ox, oy); if (!vis(q)) return;
    var fy = q.sy + TH / 2 + 2, hh = 22 * kp;
    if (j.guards > 0) { if (j.foe === 'beasts') { beastDraw('wolf', 'SW', 0, q.sx - 8 * kp, fy - 2 * kp); beastDraw('hyena', 'SE', 0, q.sx + 9 * kp, fy); hh = 30 * kp; }
      else hh = peopleDraw(q.sx, fy, bt, kp, '#c4553f', 6); }
    hit(j, plate('GET ' + String(j.item).toUpperCase(), q.sx, fy, '#f0b44c', hh + 14), [j.spot.x, j.spot.y]);
    HITS.push({ job: j.id, x: q.sx - 20 * kp, y: fy - hh - 4, w: 40 * kp, h: hh + 10, cell: [j.spot.x, j.spot.y], pack: null });
  };
  DRAWS['patrol'] = function (j, ox, oy, bt, kp) {
    if (j.stage === 'patrol') j.posts.forEach(function (p, i) { if (p.done) return; var q = iso(p.x, p.y, ox, oy); if (!vis(q)) return;
      hit(j, plate('POST ' + (i + 1), q.sx, q.sy + TH / 2 + 2, '#f0b44c', 30), [p.x, p.y]); });
    if (j.stage === 'back') { var b = iso(j.target.x, j.target.y, ox, oy); if (vis(b)) hit(j, plate('GET PAID', b.sx, b.sy + TH / 2 + 2, '#9fe08a', 30), [j.target.x, j.target.y]); }
    if (j.band) { var r = iso(j.band.x, j.band.y, ox, oy), fy = r.sy + TH / 2 + 2;
      if (vis(r)) { var hh = peopleDraw(r.sx, fy, bt, kp, '#7a1f1a', 5); hit(j, plate('CREW · ' + j.band.n, r.sx, fy, '#ff8f7a', hh + 14), [j.band.x, j.band.y]);
        HITS.push({ job: j.id, x: r.sx - 18 * kp, y: fy - hh - 4, w: 36 * kp, h: hh + 10, cell: [j.band.x, j.band.y], pack: null }); } }
  };

  /* ======================= DROP A JOB (WORLD [the PC playtest: the jobs' part] (2), rule 164 item 8) =======================
     PAOLO 10/24 on his PC: 'it's not clear how to cut a quest off... let's say I don't wanna do it anymore.' BATTLE BROTHERS
     (the library: bb_all/0626_Developer Posts.txt, 'You can manually cancel contracts by clicking the X button on the contract
     scroll'; bb_all/1670_Relations.txt, 'Canceling a Contract -10'; bb_all/1679_Renown.txt, -100 renown, worse than failing's
     -75): any held job can be dropped at any time except in its own fight; it is gone, the place that gave it thinks less of
     him (the town's own bar, records/target/bb/relations.json cancel_contract, -10), and nobody pays. So every way a job ends
     moves that bar the same way (Battle Brothers' civilian rows): done +10, done in part +5, dropped -10, failed -20. Renown has
     no Bohemia number (three currencies, none of them renown), so the standing is the whole cost. The bar is the settlement's
     (RUN TWO's [the opinion moves], bohemia.relations.v1): the map hands it every settled job on the next town it opens
     (open({settled}), one hook in loopPostOpen); until then the act waits in bohemia.job.settled.v1, so a reload loses none.
       BohemiaJobKinds.dropCost(id)  what dropping it costs: { place, act, delta, before, after, band, bandAfter }, for the button
       BohemiaJobKinds.drop(id)      drops it: { ok, cost } or { ok: false, why: 'none' | 'fighting' }; the phone says it
     The button is UI's (on the phone and the job card, UI [the PC playtest: the UI's part] (5)); this file is the rule. */
  var REL = null, SETKEY = 'bohemia.job.settled.v1', RELKEY = 'bohemia.relations.v1';
  try { if (typeof fetch !== 'undefined') fetch('../records/target/bb/relations.json').then(function (r) { return r.json(); }).then(function (j) { REL = j; }).catch(function () {}); } catch (e) {}
  function relVal(act) { var a = REL && REL.acts && REL.acts[act]; return a ? +a.value : ({ cancel_contract: -10, fail_civilian_contract: -20, civilian_contract_done: 10, civilian_contract_poor: 5 })[act] || 0; }
  function settledQ() { try { var q = JSON.parse(localStorage.getItem(SETKEY) || '[]'); return Array.isArray(q) ? q : []; } catch (e) { return []; } }
  function settle(job, act) {
    if (!job || !job.from || job.from === '?') return;
    var q = settledQ(); q.push({ place: String(job.from), act: act, id: job.id, day: day() });
    try { localStorage.setItem(SETKEY, JSON.stringify(q.slice(-40))); } catch (e) {}
    window.__JOB_SETTLED_ACTS = (window.__JOB_SETTLED_ACTS || []).concat([{ id: job.id, place: job.from, act: act, delta: relVal(act) }]).slice(-20);
  }
  /* the acts on their way to the towns' bars, taken by the next town that opens (the map's loopPostOpen) */
  function settledTake() { var q = settledQ(); if (!q.length) return undefined; try { localStorage.removeItem(SETKEY); } catch (e) {} return q.map(function (c) { return { place: c.place, act: c.act }; }); }
  /* the place's bar as the town keeps it, with what is still on its way to it */
  function standing(place) {
    var start = (REL && REL.start && REL.start.value) || 50, v = start;
    try { var r = JSON.parse(localStorage.getItem(RELKEY) || 'null'); if (r && r.bars && typeof r.bars[place] === 'number') v = r.bars[place]; } catch (e) {}
    settledQ().forEach(function (c) { if (c.place === place) v = Math.max(0, Math.min(100, v + relVal(c.act))); });
    return Math.round(v * 100) / 100;
  }
  function bandWord(v) {
    var B = (REL && REL.bands && REL.bands.value) || [{ id: 'hostile', lo: 0, hi: 9 }, { id: 'threatening', lo: 10, hi: 19 }, { id: 'unfriendly', lo: 20, hi: 29 }, { id: 'cold', lo: 30, hi: 39 },
      { id: 'neutral', lo: 40, hi: 59 }, { id: 'open', lo: 60, hi: 69 }, { id: 'friendly', lo: 70, hi: 79 }, { id: 'very_friendly', lo: 80, hi: 89 }, { id: 'allied', lo: 90, hi: 100 }];
    for (var i = 0; i < B.length; i++) if (v >= B[i].lo && v <= B[i].hi + 0.999) return B[i].id.replace(/_/g, ' ');
    return v < 0 ? B[0].id : B[B.length - 1].id;
  }
  function heldJob(id) { var j = null; try { (LOOP.held || []).forEach(function (h) { if (h.id === id) j = h; }); } catch (e) {} return j; }
  function dropCost(id) {
    var job = heldJob(id); if (!job) return null;
    var place = String(job.from || ''), before = standing(place), d = relVal('cancel_contract'), after = Math.max(0, Math.min(100, before + d));
    return { id: id, title: job.title, place: place, act: 'cancel_contract', delta: d, before: before, after: after, band: bandWord(before), bandAfter: bandWord(after), pay: job.pay };
  }
  function drop(id) {
    var job = heldJob(id); if (!job) return { ok: false, why: 'none' };
    if (LOOP.fighting === id) return { ok: false, why: 'fighting' };   /* Battle Brothers: not in the middle of its own fight */
    var c = dropCost(id);
    settle(job, 'cancel_contract');
    finish(job);
    job.result = { dropped: true, at: day() };
    window.__JOB_DROPPED = (window.__JOB_DROPPED || []).concat([{ id: id, place: c.place, before: c.before, after: c.after }]).slice(-20);
    var line = 'Dropped: ' + job.title + '. Nobody pays, and ' + String(c.place).toUpperCase() + ' thinks less of you: ' + Math.round(c.before) + ' to ' + Math.round(c.after) +
      (c.band !== c.bandAfter ? ', ' + c.band + ' to ' + c.bandAfter : ', ' + c.bandAfter) + '.';   /* draft:true */
    sayLine(line);
    save('contract:dropped');
    try { render(); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('bohemia-job-dropped', { detail: c })); } catch (e) {}
    return { ok: true, cost: c, line: line };
  }
  /* ======================= THE ROSTER THE ENEMY IS SIZED TO (WORLD [the PC playtest: the jobs' part] (3), rule 164 item 26) =======================
     PAOLO 10/24 on his PC: 'Battle Brothers matches you with opponents by the amount of people on your roster... if I fill up
     my roster, the opponents go up too.' THE LIBRARY (GROK_111; bb_all/0828_Game Mechanics.txt:105-111): a contract scales with
     the ROSTER, the 12 strongest brothers (14 for the militia and the manhunters), each 10 + 2 a level past 1, gear not counted;
     roaming parties only slightly; a camp already on the map not at all. The map's party math (__A_FEW_NOT_TWELVE__, RUN 10/5)
     had those numbers right and read the ORIGIN's men alone (LOOP.start.company): MEASURED, a crew of three that hired nine
     more still met a job sized for three. NOW the roster is every man he has, the way the fight's door finds them (the alpha's
     __WHO_YOU_HIRE_FIGHTS__): the crew screen's line (bohemia.company.v1), its bench (the laid-up still count: Battle Brothers
     counts the whole roster, reserves and wounded too), the men it knows and keeps off the line, and every hire it has not seen
     yet; less the dead (bohemia.fight.after.v1) and the men who walked when the bill went unpaid. A man with no stated level is
     a recruit, level 1. */
  function rosterMen() {
    var ls = function (k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } };
    var st = {}; try { st = LOOP.start || {}; } catch (e) {}
    var co = ls('bohemia.company.v1', null), line = ls('bohemia.company.line.v1', null), hired = ls('bohemia.hired.v1', []), walked = ls('bohemia.walked.v1', []);
    if (!Array.isArray(hired)) hired = []; if (!Array.isArray(walked)) walked = [];
    var dead = {}; try { (ls('bohemia.fight.after.v1', []) || []).forEach(function (f) { (f && f.rows || []).forEach(function (r) { if (r && r.dead && !r.main && r.name) dead[r.name] = 1; }); }); } catch (e) {}
    var gone = {}; walked.forEach(function (w) { if (w && w.name) gone[w.name] = 1; });
    var same = !(line && line.origin && st.origin && line.origin !== st.origin);
    var men = [], seen = {}, from = 'origin';
    var add = function (m, why) { if (!m) return; var nm = m.name ? String(m.name) : null;
      if (nm && (seen[nm] || dead[nm] || gone[nm])) return; if (nm) seen[nm] = 1;
      men.push({ name: nm, level: Math.max(1, (m.level | 0) || 1), why: why }); };
    var levelOf = {}; hired.forEach(function (h) { if (h && h.name) levelOf[h.name] = h.level; });
    if (Array.isArray(co) && co.length && same) {
      from = 'crew screen';
      co.forEach(function (m) { add(m, 'line'); });
      if (line && Array.isArray(line.bench)) line.bench.forEach(function (b) { if (b && b.man) add(b.man, 'bench'); });
      if (line && Array.isArray(line.known)) line.known.forEach(function (nm) { if (nm && !seen[nm]) add({ name: nm, level: levelOf[nm] }, 'reserve'); });
    } else {
      /* no crew screen yet: the origin's men, the walked from the back (the bill's own order: hires first, then the company) */
      var oc = (st.company || []).slice(), coGone = walked.filter(function (w) { return w && !w.hired; }).length;
      if (!oc.length) oc = [{}, {}, {}];   /* no picks yet: Battle Brothers' own three */
      oc.slice(0, Math.max(1, oc.length - coGone)).forEach(function (m) { men.push({ name: m && m.name || null, level: Math.max(1, (m && m.level | 0) || 1), why: 'origin' }); });
    }
    hired.forEach(function (h) { if (h && h.name && !seen[h.name]) add(h, 'hired'); });
    return { men: men, from: from };
  }
  function rosterLevels() { var r = rosterMen(); window.__ROSTER = { n: r.men.length, from: r.from, levels: r.men.map(function (m) { return m.level; }) }; return window.__ROSTER.levels; }

  root.BohemiaJobKinds = { load: load, set: set, ready: function () { return !!DATA; }, data: function () { return DATA; },
    kindOf: kindOf, word: word, built: built, owns: owns, make: make, arrived: arrived, step: step, fightEnd: fightEnd,
    here: here, pace: pace, status: status, tap: tap, draw: draw, hits: function () { return HITS.slice(); },
    roster: rosterMen, rosterLevels: rosterLevels, names: names, nextOf: nextOf, realPlace: realPlace,
    drop: drop, dropCost: dropCost, standing: standing, settledTake: settledTake, settledPeek: settledQ, settleJob: settle };
  load();
})(typeof window !== 'undefined' ? window : this);
