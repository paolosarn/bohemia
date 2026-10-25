/* THE PHONE'S BOARD  (UI lane 11, [phone contracts], 10/9/26)

   RULE 51c (Paolo 9/30, 'one main quest, two contracts, the phone only shows'): on the cracked phone in the city view,
   the valley's open contracts RIGHT NOW, as the feed's 'what the world did' kind of post: a place posts its ask, the
   post ages, a taken one disappears. NO accept button anywhere on the phone; accepting is the settlement's board, from
   a mouth. Tap a post and it is marked for the map (BOH_PHONE_ROUTE; drawing the route on the map is RUN's).

   ONE SOURCE OF THE JOBS: the asks are read from RUN TWO's settlement screen itself (its OFFERS and TIER_OFFERS, the
   board a mouth offers from), fetched as text and never copied here, so the phone can never offer a job the place does
   not. Which places, where and how big: the map's own ctBases() and mapTierOf(); what is taken: the map's LOOP.held.
   If the settlement's list cannot be read, the board shows nothing rather than inventing a job.
   RUN TWO [the board's quests are people], 10/18: the places now offer QUESTS' act-one people, picked per place by
   slices/bohemia_board_shelf.js; this list calls the SAME pick (the place's name and size, the map's day, the dice's
   traits from BohemiaLivingMap), so it still never offers a job the place does not. The settlement's OFFERS stay the
   fallback until the shelf is in.

   *** RULE 148, THE PHONE SHOWS TWO JOBS (UI [the phone shows two jobs], Paolo 10/24: 'the phone really should only be
   displaying the top two jobs, the two highest paying jobs in the whole Bohemia city, and it doesn't need to display so
   much information, it's overkill with the amount of text you put on the phone'). MEASURED BEFORE: the phone's face
   carried 226 words (two posts nearest-first, each a handle, the distance, a two-line ask, skulls, BATT and an age, then
   twenty-odd chat posts). NOW: the two asks that PAY MOST anywhere in the valley (pay, then stars, then the nearer), each
   one card: a short what (records/target/BOHEMIA_PHONE_JOB_WHAT.json, a data file, draft:true), its stars (rule 146(e):
   the hire's star, BohemiaMaterials.stars), its pay beside the bar's own battery mark, and its place. Nothing else until
   it is tapped: a tap shows the job's full words and the one touch that goes (TOUCH CHURCH ON THE MAP), lights the road
   (BOH_PHONE_ROUTE, RUN's map) and beats with it; the chat stream is off the face (the materials hide it). ***

   The look (one card a job, the stars and the battery drawn) is the materials' (dressPhone).
   Included by BOHEMIA_CITY_WORLD.html after bohemia_ui_materials.js. Gate: gates/the_phones_board_gate.js */
(function () {
  'use strict';
  var OFFERS = null, TIERS = null, SEEN = {}, PICK = null, BOX = null, SIG = '', SHOW = 2, WHAT = null;

  function load() {
    try {
      if (!window.BohemiaBoardShelf) {
        var sc = document.createElement('script'); sc.src = 'bohemia_board_shelf.js';
        sc.onload = function () { try { BohemiaBoardShelf.load(); } catch (e) {} };
        document.head.appendChild(sc);
      } else BohemiaBoardShelf.load();
    } catch (e) {}
    try {
      fetch('BOHEMIA_SETTLEMENT_SCREEN.html').then(function (r) { return r.text(); }).then(function (t) {
        var m = t.match(/var OFFERS = (\[[\s\S]*?\n\]);/), k = t.match(/var TIER_OFFERS = (\{[^}]*\});/);
        if (!m || !k) return;
        try { OFFERS = Function('return ' + m[1])(); TIERS = Function('return ' + k[1])(); } catch (e) { OFFERS = null; }
      }).catch(function () {});
    } catch (e) {}
    /* rule 148: the short what a job shows on the face (a data file a modder edits); without it the title, cut to the glass */
    try {
      fetch('../records/target/BOHEMIA_PHONE_JOB_WHAT.json').then(function (r) { return r.json(); })
        .then(function (d) { WHAT = (d && d.what) || {}; SIG = ''; }).catch(function () {});
    } catch (e) {}
  }
  function nowMin() { try { return ((T.day | 0) * 1440) + (T.min | 0); } catch (e) { return 0; } }
  /* which way on the screen: the map is drawn at 45 degrees, so up the glass is where x and y both shrink */
  function way(dx, dy) {
    var sx = dx - dy, sy = dx + dy;
    if (!sx && !sy) return '';
    var a = Math.atan2(-sy, sx) * 180 / Math.PI, W = ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE'];
    return W[(Math.round(((a + 360) % 360) / 45)) % 8];
  }
  /* every open ask in the valley right now: each place offers as many as its tier lets its board offer (the settlement's
     own TIER_OFFERS), skipping what is already taken (the settlement's own rule); the best paid first (rule 148) */
  function asks() {
    if (!OFFERS || !TIERS) return [];
    var bs = null; try { bs = ctBases(); } catch (e) { bs = null; }
    if (!bs) return [];
    var held = []; try { held = (LOOP.held || []).map(function (h) { return h.id; }); } catch (e) {}
    try { held = held.concat(LOOP.doneIds || []); } catch (e) {}   /* RUN 10/23 (TUNING's change 2e): a finished job leaves the phone too */
    var me = [0, 0]; try { me = [city.x | 0, city.y | 0]; } catch (e) {}
    var out = [], t = nowMin();
    Object.keys(bs).forEach(function (name) {
      var b = bs[name]; if (!b) return;
      var tier = 'camp'; try { tier = mapTierOf(name) || 'camp'; } catch (e) {}
      var n = TIERS[tier] || 1, SH = window.BohemiaBoardShelf, list = null;
      if (SH && SH.ready()) {   /* the place's own people (RUN TWO 10/18): the same pick the settlement's board makes */
        var day = Math.floor(t / 1440), tr = [];
        try { tr = BohemiaLivingMap.traitsFor(LIVING_MAP.traits, name, day).map(function (x) { return x.id; }); } catch (e) {}
        list = SH.pick({ name: name, tier: tier }, day, { traits: tr, held: held, places: SH.mapPlaces ? SH.mapPlaces(day) : null });   /* RUN TWO 10/25 (EYES [eyes: the job's real pay]): one contract, one place */
      }
      if (!list) list = OFFERS.filter(function (o) { return held.indexOf(o.id) < 0; }).slice(0, n);
      for (var i = 0; i < list.length; i++) {
        var o = list[i];
        var key = name + '|' + o.id; if (SEEN[key] == null) SEEN[key] = t;
        /* stars (146(e)): the job's own stars once RUN's [the job's stars] hands them, its skulls until then (one to three) */
        var st = Math.max(1, Math.min(3, (o.stars | 0) || (o.skulls | 0) || 1));
        try { if (typeof loopJobStars === 'function') st = loopJobStars(o); } catch (e) {}   /* RUN 10/25 __THE_JOBS_STARS__: its real party against his company */
        out.push({ key: key, place: name, x: b.x | 0, y: b.y | 0, tier: tier, id: o.id, title: o.title, skulls: o.skulls || 1, stars: st, pay: (typeof loopJobPay === 'function' ? loopJobPay(o.pay) : o.pay | 0),   /* RUN TWO 10/25 (EYES [eyes: the job's real pay]): what the contract pays, the start's bonus in it (the map's loopJobPay) */
          dist: Math.max(Math.abs((b.x | 0) - me[0]), Math.abs((b.y | 0) - me[1])), way: way((b.x | 0) - me[0], (b.y | 0) - me[1]), age: t - SEEN[key] });
      }
    });
    out.sort(function (a, b) { return b.pay - a.pay || b.stars - a.stars || a.dist - b.dist || (a.key < b.key ? -1 : 1); });
    /* a job the shelf ran short on and two places show is on the phone once, from the nearer (RUN TWO 10/25) */
    var once = {}; out = out.filter(function (a) { if (once[a.id]) return false; once[a.id] = 1; return true; });
    /* RUN 10/25 __A_FRESH_START_AND_A_FOG_OF_WAR__ (rule 155(a), TUNING's change 5): on the first day the first posts come from
       the places near his corner (twelve blocks), the best paid of those first; the rest after them */
    try { if (typeof loopDay === 'function' && loopDay() <= 1) { var nearP = out.filter(function (a) { return a.dist <= 12; }); if (nearP.length >= 2) out = nearP.concat(out.filter(function (a) { return a.dist > 12; })); } } catch (e) {}
    return out;
  }
  function placeWord(name) { return String(name).toUpperCase(); }
  function whatOf(a) { var w = WHAT && WHAT[a.id]; return w ? String(w) : String(a.title || ''); }
  function post(a) {
    var M = window.BohemiaMaterials, d = document.createElement('div');
    d.className = 'fp world job in' + (PICK === a.key ? ' picked' : '');
    d.setAttribute('role', 'button'); d.dataset.job = a.id; d.dataset.place = a.place; d.dataset.pay = a.pay; d.dataset.stars = a.stars;
    d.setAttribute('aria-label', a.place + ': ' + a.title + '. ' + a.stars + ' star' + (a.stars > 1 ? 's' : '') + ', ' + a.pay + ' batteries. Tap to light the road.');
    var x = document.createElement('div'); x.className = 'txt';
    x.textContent = PICK === a.key ? a.title : whatOf(a);   /* the short what; the job's full words once tapped */
    var m = document.createElement('div'); m.className = 'meta';
    var st = null; try { st = M && M.stars ? M.stars(a.stars, { gap: 0, ink: PICK === a.key }) : null; } catch (e) { st = null; }
    if (!st) { st = document.createElement('span'); st.className = 'bmstars'; st.textContent = new Array(a.stars + 1).join('★'); }
    m.appendChild(st);
    var pay = document.createElement('span'); pay.className = 'pay';
    var src = ''; try { src = M && M.supplyIcon ? M.supplyIcon('batteries') : ''; } catch (e) {}
    if (src) { var im = document.createElement('img'); im.className = 'batt'; im.alt = ''; im.src = src; pay.appendChild(im); }
    pay.appendChild(document.createTextNode(String(a.pay)));
    m.appendChild(pay);
    var at = document.createElement('span'); at.className = 'at'; at.textContent = placeWord(a.place); m.appendChild(at);
    d.appendChild(x); d.appendChild(m);
    /* UI [the ten changes], change 2 (rule 133; TUNING: 'tapping a job on the phone lights the card and nothing else'): the
       picked card says the one touch that goes, and it beats with the road's dots (the map's beat is performance.now() over
       BEAT, so the card's pulse is started on the same clock). The phone still only shows (51). */
    if (PICK === a.key) {
      var go = document.createElement('div'); go.className = 'go';
      go.textContent = 'TOUCH ' + placeWord(a.place) + ' ON THE MAP';
      d.appendChild(go);
      try { var B = (typeof BEAT === 'number' && BEAT > 0) ? BEAT : 500; d.style.animationDelay = (-(performance.now() % B)) + 'ms'; d.style.animationDuration = B + 'ms'; } catch (e) {}
    }
    d.addEventListener('click', function (ev) {
      try { ev.stopPropagation(); } catch (e) {}   /* a tap on a job is not a tap on the phone */
      PICK = (PICK === a.key) ? null : a.key;
      window.BOH_PHONE_ROUTE = PICK ? { place: a.place, x: a.x, y: a.y, id: a.id, title: a.title, dist: a.dist, way: a.way } : null;
      try { window.dispatchEvent(new CustomEvent('bohemia-phone-route', { detail: window.BOH_PHONE_ROUTE })); } catch (e) {}
      SIG = ''; paint();
    });
    return d;
  }
  /* ==== YOUR JOBS, AND A PLAIN WAY TO DROP ONE (UI [the PC playtest: the UI's part] (5), rule 164 item 8, Paolo 10/24 on his PC:
     'it's not clear how to cut a quest off... let's say I don't wanna do it anymore'). Battle Brothers keeps the contract you
     hold on the world map's corner as a scroll with an X that cancels it, and asks once (the library: 'You can manually
     cancel contracts by clicking the X button on the contract scroll'). Ours: the jobs he holds sit on the phone above the
     two on offer, each its short what, where it came from and its pay, and a DROP he can see. DROP asks once, with the cost
     printed (WORLD's rule, slices/bohemia_job_kinds.js dropCost: nobody pays and the place that gave it thinks less of him,
     its bar before and after); DROP IT drops it (BohemiaJobKinds.drop), KEEP IT takes the question back. Not in its own fight
     (WORLD's rule), and the card says so. The words are draft:true. ==== */
  var HELD = null, ARM = null, HELD_SIG = '';
  function heldJobs() { try { return (LOOP.held || []).filter(function (j) { return j && j.id; }); } catch (e) { return []; } }
  function heldCard(j) {
    var M = window.BohemiaMaterials, d = document.createElement('div'), armed = ARM && ARM.id === j.id;
    d.className = 'fp held in' + (armed ? ' armed' : ''); d.dataset.held = j.id; d.setAttribute('role', 'listitem');
    var x = document.createElement('div'); x.className = 'txt';
    var w = WHAT && WHAT[j.id]; x.textContent = w ? String(w) : String(j.title || 'a job');
    var m = document.createElement('div'); m.className = 'meta';
    var yo = document.createElement('span'); yo.className = 'yours'; yo.textContent = 'YOURS'; m.appendChild(yo);
    var pay = document.createElement('span'); pay.className = 'pay';
    var src = ''; try { src = M && M.supplyIcon ? M.supplyIcon('batteries') : ''; } catch (e) {}
    if (src) { var im = document.createElement('img'); im.className = 'batt'; im.alt = ''; im.src = src; pay.appendChild(im); }
    pay.appendChild(document.createTextNode(String(j.pay | 0))); m.appendChild(pay);
    var at = document.createElement('span'); at.className = 'at'; at.textContent = placeWord(j.from || ''); m.appendChild(at);
    var row = document.createElement('div'); row.className = 'hrow';
    var col = document.createElement('div'); col.className = 'hcol'; col.appendChild(x); row.appendChild(col);
    var stop = function (ev) { try { ev.stopPropagation(); } catch (e) {} };
    if (!armed) {
      var dr = document.createElement('button'); dr.type = 'button'; dr.className = 'drop'; dr.textContent = 'DROP'; dr.setAttribute('aria-label', 'drop this job: ' + (j.title || ''));
      dr.addEventListener('click', function (ev) { stop(ev); var c = null; try { c = window.BohemiaJobKinds && BohemiaJobKinds.dropCost ? BohemiaJobKinds.dropCost(j.id) : null; } catch (e) {}
        ARM = { id: j.id, cost: c, why: null }; HELD_SIG = ''; paint(); });
      row.appendChild(dr);
    }
    d.appendChild(row); d.appendChild(m);   /* the what beside DROP, then whose, the pay and the place across the whole card */
    if (armed) {
      var c = ARM.cost, q = document.createElement('div'); q.className = 'cost';
      q.textContent = ARM.why === 'fighting' ? 'NOT IN ITS OWN FIGHT.' : (c ? 'NOBODY PAYS. ' + placeWord(c.place) + ' THINKS LESS OF YOU: ' + Math.round(c.before) + ' TO ' + Math.round(c.after) + '.' : 'NOBODY PAYS.');
      var bs = document.createElement('div'); bs.className = 'asks';
      var yes = document.createElement('button'); yes.type = 'button'; yes.className = 'yes'; yes.textContent = 'DROP IT';
      var no = document.createElement('button'); no.type = 'button'; no.className = 'no'; no.textContent = 'KEEP IT';
      yes.addEventListener('click', function (ev) { stop(ev); var r = null; try { r = window.BohemiaJobKinds && BohemiaJobKinds.drop ? BohemiaJobKinds.drop(j.id) : null; } catch (e) {}
        if (r && r.ok) { ARM = null; window.__HELD_DROPPED = (window.__HELD_DROPPED || []).concat([{ id: j.id, line: r.line }]).slice(-10); }
        else ARM.why = (r && r.why) || 'none';
        HELD_SIG = ''; paint(); });
      no.addEventListener('click', function (ev) { stop(ev); ARM = null; HELD_SIG = ''; paint(); });
      if (ARM.why !== 'fighting') bs.appendChild(yes);
      bs.appendChild(no); d.appendChild(q); d.appendChild(bs);
    }
    d.addEventListener('click', stop);   /* a tap on his job is not a tap on the phone */
    return d;
  }
  function paintHeld(list) {
    if (!HELD || !HELD.parentNode) { HELD = document.createElement('div'); HELD.id = 'bmheld'; HELD.setAttribute('role', 'list'); HELD.setAttribute('aria-label', 'the jobs you hold'); list.parentNode.insertBefore(HELD, list); }
    var js = heldJobs();
    if (ARM && !js.some(function (j) { return j.id === ARM.id; })) ARM = null;
    var sig = js.map(function (j) { return j.id + ':' + (j.pay | 0); }).join(';') + '|' + (ARM ? ARM.id + (ARM.why || '') : '') + (WHAT ? 'w' : '');
    window.__PHONE_HELD = { held: js.map(function (j) { return { id: j.id, title: j.title, from: j.from, pay: j.pay | 0 }; }), armed: ARM ? ARM.id : null };
    if (sig === HELD_SIG) return; HELD_SIG = sig;
    HELD.textContent = '';
    js.forEach(function (j) { HELD.appendChild(heldCard(j)); });
    HELD.style.display = js.length ? '' : 'none';
  }
  function paint() {
    var feed = document.getElementById('cityfeed'), list = document.getElementById('cityfeedlist');
    if (!feed || !list || !feed.classList.contains('on')) return;
    paintHeld(list);
    if (!BOX || !BOX.parentNode) {
      BOX = document.createElement('div'); BOX.id = 'bmboard'; BOX.setAttribute('role', 'list'); BOX.setAttribute('aria-label', 'the two best paid jobs in the valley');
      list.parentNode.insertBefore(BOX, list);
    }
    /* RULE 148: THE TWO THAT PAY MOST in the whole valley, wherever they are (the list is sorted best paid first); two
       different jobs, and from two places when the pay allows (measured: the shelf deals one job to two fortresses, and two
       cards with the same words read as one job shown twice) */
    var all = asks(), top = [], ids = {}, from = {}, i;
    for (i = 0; i < all.length && top.length < SHOW; i++) {
      var c = all[i]; if (ids[c.id] || from[c.place]) continue;
      ids[c.id] = 1; from[c.place] = 1; top.push(c);
    }
    for (i = 0; i < all.length && top.length < SHOW; i++) if (!ids[all[i].id] && top.indexOf(all[i]) < 0) { ids[all[i].id] = 1; top.push(all[i]); }
    top.sort(function (a, b) { return b.pay - a.pay || b.stars - a.stars || a.dist - b.dist; });
    if (PICK && !all.some(function (a) { return a.key === PICK; })) { PICK = null; window.BOH_PHONE_ROUTE = null; }   /* taken: it disappears, and so does its mark */
    if (PICK && !top.some(function (a) { return a.key === PICK; })) { var pk = all.filter(function (a) { return a.key === PICK; })[0]; if (pk) top[top.length - 1] = pk; }   /* the lit one stays lit */
    var sig = top.map(function (a) { return a.key + a.pay + a.stars + (PICK === a.key); }).join(';') + (WHAT ? 'w' : '');
    window.__PHONE_BOARD = { asks: all.length, shown: top.map(function (a) { return { place: a.place, id: a.id, title: a.title, what: whatOf(a), pay: a.pay, stars: a.stars, skulls: a.skulls, dist: a.dist }; }),
      best: all.slice(0, 6).map(function (a) { return a.pay; }) };
    if (sig === SIG) return; SIG = sig;
    BOX.textContent = '';
    top.forEach(function (a) { BOX.appendChild(post(a)); });
    BOX.style.display = top.length ? '' : 'none';
  }
  load();
  setInterval(paint, 1000);
  window.BohemiaPhoneBoard = { asks: asks, paint: paint, held: heldJobs, loaded: function () { return !!OFFERS; }, what: function () { return WHAT; } };
})();
