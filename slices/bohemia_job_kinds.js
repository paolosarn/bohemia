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
    if (n > 0) { try { BohemiaPurse.credit(purseGet(), 'electricity', n, 'contract: ' + job.title, 'contract:' + job.id + ':' + LOOP.done, day()); } catch (e) {} }
    LOOP.done++;
    finish(job);
    job.result = { paid: n, at: day() };
    window.__JOB_PAID = (window.__JOB_PAID || []).concat([{ id: job.id, kind: job.plays, paid: n, of: job.pay }]).slice(-20);
    sayLine(line || ('Paid ' + n + ' battery: ' + job.title + '.'));
    save('contract:paid');
  }
  function lost(job, line) {
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

  /* ======================= ESCORT: haul-caravan ======================= */
  var MAKE = {}, ARRIVE = {}, STEP = {}, END = {}, DRAW = {};
  /* another town to take it to: where he can see it first, in the table's range, then near its middle; one he can reach */
  function pickDest(job, k, town, R) {
    var lo = (k.dest_blocks || [8, 30])[0], hi = (k.dest_blocks || [8, 30])[1], dest = null, door = null, path = null;
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
    job.sayTake = 'Contract from ' + town.name + ': walk ' + job.cargo.what + ' to ' + dest.name + '. ' + n + ' ' + plural(job.cargo.unit, n) +
      ', ' + job.perCrate + ' batteries for every one that gets there.';
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
    var b = k.blocks || [9, 18], s = spotOut(town.x, town.y, b[0], b[1], R, true);
    if (!s) return false;
    var r = k.ring || 4, off = Math.max(0, r - 1), c = null;
    for (var i = 0; i < 12 && !c; i++) { var cx = s[0] + Math.floor(R() * (2 * off + 1)) - off, cy = s[1] + Math.floor(R() * (2 * off + 1)) - off; if (walk(cx, cy) && route(city.x, city.y, cx, cy)) c = [cx, cy]; }
    if (!c) c = s;
    job.spot = { x: s[0], y: s[1] }; job.ring = { x: c[0], y: c[1], r: r };
    job.target = { x: c[0], y: c[1] };
    job.what = row.what || 'it';
    job.stage = 'look';
    var dist = cheb(c[0], c[1], town.x, town.y);
    job.sayTake = 'Contract from ' + town.name + ': find ' + job.what + '. ' + cap(way(c[0] - town.x, c[1] - town.y)) + ', about ' + dist + (dist === 1 ? ' block' : ' blocks') + '. Look inside the ring on the map.';
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
    job.sayTake = 'Contract from ' + town.name + ': ' + job.what + '. A camp, about ' + men + ' of them. Paid there: ' + job.flat + ' batteries and ' + job.perHead + ' for every one put down.';
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
    job.sayTake = 'Contract from ' + town.name + ': carry ' + job.item + ' to ' + job.dest.name + '. ' + job.pay + ' batteries when it is signed for there.';
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
    var b = k.blocks || [6, 14], s = spotOut(town.x, town.y, b[0], b[1], R, true); if (!s) return false;
    job.spot = { x: s[0], y: s[1] }; job.target = { x: s[0], y: s[1] };
    job.item = row.item || 'it'; job.where = row.where || null; job.foe = row.foe || 'brigands'; job.has = false;
    var n = 3; try { n = partyMath('job', { skulls: job.skulls }).count; } catch (e) {}
    job.guards = row.guards === 0 ? 0 : (row.guards || n);
    job.stage = 'get';
    job.sayTake = 'Contract from ' + town.name + ': get ' + job.item + ' back' + (job.where ? ' from ' + job.where : '') + ', ' +
      way(s[0] - town.x, s[1] - town.y) + ', about ' + cheb(s[0], s[1], town.x, town.y) + ' blocks. ' +
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
    if (!built(kind) || kind === 'clear-crew') return false;
    if (window.__JOB_KINDS_OFF) return false;   /* a measurement of today's crew path alone (THE LOOP PLAYS ON THE MAP's gate) */
    var R = rng(seedOf(job.id + ':' + town.name + ':' + day() + ':' + (LOOP.done | 0)));
    job.from = town.name; job.fromAt = { x: town.x | 0, y: town.y | 0 };
    job.twist = (R() < (k.twist_rate || 0)) ? pickOf(k.twists, R) : null;
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
  function draw(ox, oy) {
    HITS = [];
    var H = held(); if (!H.length) return;
    var bt = mapArtBeat(), kp = MAP_PEOPLE_K;
    H.forEach(function (j) {
      try { (DRAWS[j.plays] || function () {})(j, ox, oy, bt, kp); } catch (e) { window.__JOB_DRAW_ERR = String(e && e.message || e); }
    });
    try { MAP_DREW.jobKinds = H.length; } catch (e) {}
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
    if (vis(d)) hit(j, plate('ESCORT TO HERE', d.sx, d.sy + TH / 2 + 2, '#f0b44c', 30), [j.target.x, j.target.y]);
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
  root.BohemiaJobKinds = { load: load, set: set, ready: function () { return !!DATA; }, data: function () { return DATA; },
    kindOf: kindOf, word: word, built: built, owns: owns, make: make, arrived: arrived, step: step, fightEnd: fightEnd,
    here: here, pace: pace, status: status, tap: tap, draw: draw, hits: function () { return HITS.slice(); } };
  load();
})(typeof window !== 'undefined' ? window : this);
