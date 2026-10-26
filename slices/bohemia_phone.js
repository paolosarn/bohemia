/* ======================================================================================================================
   THE PHONE  (UI TWO, 10/26/26: [the phone overhaul], rule 212; [one phone, one place], rule 213)

   PAOLO 10/26: 'the phone should be at the bottom left or bottom right depending on the setting I choose, whether I flip
   my screen too... the buttons that matter, action-wise... one button for play and pause... it reflects the street tile
   you're on and shows you the camp... I give up on the phone displaying the top two jobs... the social media
   experience... your company, quick edit the name... the crew button goes there and looks like the social media button,
   you're gonna be pressing crew a lot... they can always choose the UI after.'
   And: 'it stays in the same place... in combat the exact same, our abilities, but small, we fit as much as we can... an
   animation to let you know it's combat time... not directly in the middle of the screen, slightly off center... the
   phone placement permanent... the same size.'
   His words in full and the research: records/BOHEMIA_PAOLO_THE_PHONE_OVERHAUL_10_26_26.md and
   records/BOHEMIA_PAOLO_ONE_PHONE_ONE_PLACE_AND_THE_CAMERA_FRAMES_AROUND_IT_10_26_26.md.

   ONE PHONE, DRAWN ONCE. Every page that wears the HUD loads this file (bohemia_ui_materials.js loads it), but only the
   TOPMOST page of the game draws the phone: the shell (the demo, the alpha) when the map, the town and the fight are its
   frames, or the map itself when it is opened alone. So the phone on the map, in the town, at camp and in the fight is
   not four copies kept in step: it is ONE element that never moves, and its rectangle is identical on all of them by
   construction. Only its screen changes.

   ONE FUNCTION EVERY SCREEN READS: window.BOH_PHONE_RECT() in every frame answers the phone's rectangle in that frame's own
   pixels ({left, top, right, bottom, width, height, side, on, screen}); BohemiaPhone.padding() is the margin a camera
   frames around (Google's map padding, the 10/26 research: the visual centre moves off the covered margin); every frame's
   <html> carries boh-phone-on / boh-phone-left|right and --boh-phone-* variables; and a 'bohemia-phone' event fires in
   every frame the moment the corner flips or the device turns, so RUN's map, RUN TWO's town and COMBAT's fight move their
   cameras at once.

   THE FIVE APPS [COORDINATOR'S DEFAULT, rule 205: the set is his to change, and he can from the settings page]:
     PLAY/PAUSE  the clock on the map (the pad's II and GO, the spacebar's one door: travelSpeedSet); the speed he last
                 chose kept as a small mark; a held finger opens the speeds (one on the map for now, rule 151(c))
     CREW        the social app's people: the company screen (rule 172), the bar's own CREW door, the same everywhere
     CAMP        make and break camp where he stands (RUN TWO's camp, rule 151(d): the followers, the wagon)
     FEED        his company's page on top (its name: one tap renames it), the city's posts under it (the 9/4 feed law,
                 the stream engine/bohemia_feedstream.js; FEED, lane 23, owns what posts; this draws the app)
     RELATIONS   every town and who holds it, how they take you (Battle Brothers' nine bands) and the last thing that moved it
   The wallpaper is the block he stands on, live (the map's own picture under the crew), or the camp's own picture; the
   newest post slides over it on the beat and slides away. No job is on the phone (rule 148 is dead, 212(d)).

   IN A FIGHT: the screen lights, a red crosshair strikes on the beat in stop-motion holds and says COMBAT, and the apps
   become his abilities (rule 180: the buttons only the player presses), small, as many as fit on one page: every fight
   button that is not move, fire, the melee strike or the reload (180(g)): the bag swaps, the weapon's sweeps, the perks'
   skills. A press on the phone is a press on the fight's own button. END TURN, AUTO and RETREAT stay on the fight's bar.
   When the fight ends the phone strikes back to the five apps.

   THE SETTINGS: the game's SETTINGS card carries THE PHONE: LEFT or RIGHT, and every app's place (up, down, hide); the
   first app takes the big slot. A finger held on the phone's home opens the same page.

   NOTHING DRAWN IN CODE: the case, the ear and every app are rendered through the rig (tools/bohemia_ui2_phone_apps.py,
   the kit's own tin, light and camera); the wells and the receipt are the kit's (slices/ui_kit). Words are attempts,
   draft:true (rule 8/11).
   ==================================================================================================================== */
(function () {
  'use strict';
  if (window.BohemiaPhone) return;

  var KEY = 'bohemia.phone.v1';               /* {side, order, hidden}: his corner and his apps */
  var NAMEKEY = 'bohemia.company.name.v1';    /* the company's name, renamed from FEED */
  var WHYKEY = 'bohemia.relations.why.v1';    /* what moved each town's opinion, the last few, per town */
  /* rule 232(b): PLAY/PAUSE and HEAL/CAMP are on the phone ALWAYS, the two big buttons; rule 238(a): every other press of the map,
     the town and the fight lives on the phone too, small, in one row he orders (SETTINGS never hides: it is the way back);
     rule 286(c): the feed is on the face, never an app */
  var APPS = ['crew', 'relations', 'notes', 'settings'];
  var LABEL = { play: 'PLAY', heal: 'HEAL', crew: 'CREW', relations: 'RELATIONS', notes: 'NOTES', settings: 'SETTINGS', leave: 'LEAVE', feed: 'THE FEED' };   /* draft:true */
  var KEEP = ['settings'];
  /* THE HEAL RING (rule 232(b), Paolo: 'a medical icon maybe in a circle'): where the rig struck the ring's track on app_heal.png,
     as fractions of the picture (tools/bohemia_ui2_phone_apps.py measures it into phone.json app_heal.ring; read at boot) */
  var RING = { cx: 0.5021, cy: 0.4845, ro: 0.4068, ri: 0.3065 };
  var BEAT = 500;                              /* 120 BPM */
  var BASE = (function () {
    try { var s = document.currentScript && document.currentScript.src; if (s) return s.replace(/[^\/]*$/, ''); } catch (e) {}
    return '';
  })();
  var IMG = function (n) { return BASE + 'phone/' + n + '.png'; };

  function ls() { try { return window.localStorage; } catch (e) { return null; } }
  function cfg() {
    var c = null; try { c = JSON.parse(ls().getItem(KEY) || 'null'); } catch (e) { c = null; }
    c = c && typeof c === 'object' ? c : {};
    var side = c.side === 'left' ? 'left' : 'right';   /* right by default: about two in three thumbs are right thumbs (Hoober) */
    var was = function (a) { return a; };   /* an order saved before rule 238 keeps what is still a row app (PLAY, HEAL and FEED left the row) */
    var order = Array.isArray(c.order) ? c.order.map(was).filter(function (a, i, A) { return APPS.indexOf(a) >= 0 && A.indexOf(a) === i; }) : [];
    APPS.forEach(function (a) { if (order.indexOf(a) < 0) order.push(a); });
    var hidden = Array.isArray(c.hidden) ? c.hidden.map(was).filter(function (a) { return APPS.indexOf(a) >= 0 && KEEP.indexOf(a) < 0; }) : [];
    if (hidden.length >= APPS.length) hidden = hidden.slice(1);   /* never a phone with nothing on it */
    return { side: side, order: order, hidden: hidden };
  }
  function cfgSave(c) { try { ls().setItem(KEY, JSON.stringify({ side: c.side, order: c.order, hidden: c.hidden })); } catch (e) {} }

  /* ---- WHO DRAWS IT: the topmost page of the game (a parent that wears the HUD too), else this one ---- */
  function hostOf() {
    var w = window;
    for (var i = 0; i < 8; i++) {
      var p = null;
      try { p = w.parent; if (!p || p === w || !p.document) break;
        if (!p.document.querySelector('script[src*="bohemia_ui_materials"],script[src*="bohemia_phone"]')) break; } catch (e) { break; }
      w = p;
    }
    return w;
  }
  var HOST = hostOf(), IS_HOST = HOST === window;

  /* ======================================================================================================================
     THE RECTANGLE. One size per device and the way it is held, the same on every screen of the game. Base 124 x 276
     points (his iPhone's corner and bezel; the job column, rules 227 and 228; the big one; two thumbs of apps); 0.9 on a
     phone on its side (390 tall),
     1.25 from 500 points across the short side (an iPad, a computer). In his chosen bottom corner, ten points and the
     safe area in from the glass's edges.
     ==================================================================================================================== */
  var BW = 124, BH = 276;
  function insets(doc) {
    var p = doc.getElementById('bohphoneinset');
    if (!p) { p = doc.createElement('div'); p.id = 'bohphoneinset';
      p.setAttribute('style', 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;'
        + 'padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)');
      (doc.body || doc.documentElement).appendChild(p); }
    var s = getComputedStyle(p);
    return { t: parseFloat(s.paddingTop) || 0, r: parseFloat(s.paddingRight) || 0, b: parseFloat(s.paddingBottom) || 0, l: parseFloat(s.paddingLeft) || 0 };
  }
  function geomFor(W, H, side, ins) {
    var land = W > H, small = Math.min(W, H) < 500;
    var cls = small ? (land ? 'phone_landscape' : 'phone_portrait') : (land ? 'wide' : 'tablet_portrait');
    var s = small ? (land ? 0.9 : 1) : 1.25;
    var w = Math.round(BW * s * 10) / 10, h = Math.round(BH * s * 10) / 10, m = 10;
    ins = ins || { t: 0, r: 0, b: 0, l: 0 };
    var left = side === 'left' ? m + ins.l : W - m - ins.r - w, top = H - m - ins.b - h;
    return { left: left, top: top, right: left + w, bottom: top + h, width: w, height: h, side: side, cls: cls, scale: s };
  }
  /* THE PADDING A CAMERA FRAMES AROUND (213(c)): the phone's own band on one axis, the cheaper one, so the focus moves
     'slightly off centre' away from it: upright, the band under the phone's top (the focus rides up by half the phone's
     height); on its side, the band beside it (the focus moves over by half its width) [UI TWO's default, his to correct] */
  function padFor(g, W, H) {
    var p = { top: 0, right: 0, bottom: 0, left: 0 };
    if (H >= W) p.bottom = Math.max(0, H - g.top);
    else if (g.side === 'right') p.right = Math.max(0, W - g.left);
    else p.left = Math.max(0, g.right);
    return p;
  }

  /* where this window sits inside the host, so a frame answers in its own pixels */
  function offsetIn(w) {
    var x = 0, y = 0;
    try {
      while (w !== HOST && w.frameElement) {
        var fe = w.frameElement, r = fe.getBoundingClientRect();
        x += r.left + (fe.clientLeft || 0); y += r.top + (fe.clientTop || 0);
        w = w.parent;
      }
    } catch (e) {}
    return { x: x, y: y };
  }

  /* ---- THIS WINDOW'S SIDE: every page, host or not, answers the rectangle and wears the variables ---- */
  var LOCAL = { state: null, sig: '' };
  function rectHere() {
    var st = LOCAL.state;
    if (!st) {   /* before the host has spoken: where it will be */
      var c = cfg(), W = innerWidth, H = innerHeight, g = geomFor(W, H, c.side, null);
      return { left: g.left, top: g.top, right: g.right, bottom: g.bottom, width: g.width, height: g.height, side: c.side, on: false, screen: null, cls: g.cls };
    }
    var o = offsetIn(window), R = st.rect;
    return { left: R.left - o.x, top: R.top - o.y, right: R.right - o.x, bottom: R.bottom - o.y, width: R.width, height: R.height,
      side: st.side, on: st.on, screen: st.screen, cls: R.cls };
  }
  function paddingHere() {
    var r = rectHere(), W = innerWidth, H = innerHeight;
    return padFor({ left: r.left, top: r.top, right: r.right, side: r.side }, W, H);
  }
  function openCentre() { var p = paddingHere(); return { x: (p.left + innerWidth - p.right) / 2, y: (p.top + innerHeight - p.bottom) / 2 }; }
  function paintHere(st) {
    LOCAL.state = st;
    var R = document.documentElement, r = rectHere();
    var sig = [st.on, st.side, st.screen, Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height), innerWidth, innerHeight].join('|');
    R.classList.toggle('boh-phone-on', !!st.on);
    R.classList.toggle('boh-phone-left', st.side === 'left');
    R.classList.toggle('boh-phone-right', st.side !== 'left');
    var set = function (k, v) { v = Math.round(v * 10) / 10 + 'px'; if (R.style.getPropertyValue(k) !== v) R.style.setProperty(k, v); };
    set('--boh-phone-left', r.left); set('--boh-phone-top', r.top); set('--boh-phone-w', r.width); set('--boh-phone-h', r.height);
    set('--boh-phone-gap-r', innerWidth - r.left); set('--boh-phone-gap-l', r.right); set('--boh-phone-gap-b', innerHeight - r.top);
    if (sig !== LOCAL.sig) {
      LOCAL.sig = sig;
      try { window.dispatchEvent(new CustomEvent('bohemia-phone', { detail: { rect: r, padding: paddingHere(), side: st.side, on: st.on, screen: st.screen } })); } catch (e) {}
    }
    localCss();
  }

  /* ======================================================================================================================
     WHAT EACH SCREEN HANDS THE PHONE (evaluated in that screen's own page, where its own names are in reach)
     ==================================================================================================================== */
  var P = {};
  /* ---- THE MAP ---- */
  P.isMap = function () { return typeof window.__CITY === 'object' && typeof travelSpeedSet === 'function' && !document.getElementById('cityFrame'); };
  P.state = function () {
    var o = { mode: null, speed: 0, last: 0, speeds: [], town: false, camp: false, meet: false, sky: false, clock: '', day: 0, place: '' };
    try { o.mode = (typeof MODE !== 'undefined') ? MODE : null; } catch (e) {}
    try { o.speed = +TRAVEL_SPEED || 0; o.last = +(TRAVEL_SPEED_LAST || TRAVEL_DEFAULT) || 0; o.speeds = (TRAVEL_SPEEDS || []).filter(function (n) { return n > 0; }); } catch (e) {}
    try { o.camp = !!(window.BohemiaMapCamp && BohemiaMapCamp.on()); } catch (e) {}
    try { o.campTown = (o.camp && typeof CAMP !== 'undefined' && CAMP.town) ? String(CAMP.town.name || '') : null; } catch (e) {}   /* CAMP [a town is safe]: a rest in a town */
    try { var sf = document.getElementById('settleFrame'); o.town = !!sf && sf.style.display === 'block' && !o.camp; } catch (e) {}
    try { o.meet = !!(MEET && MEET.up); } catch (e) {}
    try { o.sky = !!SKY; } catch (e) {}
    try { o.day = T.day; var h = (T.min / 60) | 0, m = Math.floor(T.min % 60); o.clock = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; } catch (e) {}
    try { var pl = document.querySelector('#bmtb [data-f=place]'); o.place = pl ? String(pl.textContent || '').trim() : ''; } catch (e) {}
    /* EYES [eyes: the ground on the phone] (rule 262(a)): no line names the ground he stands on; the place is the bar's (a town's
       name, CAMP), and on the map the status line says nothing */
    return o;
  };
  P.play = function (jobId) {
    try {
      if (typeof MODE !== 'undefined' && MODE !== 'city') return false;
      /* RUN 10/26 ([play takes you there], EYES' normie hour F9): the map's speed stays at 1.22 while he stands, so PAUSE is only for a
         journey under way; standing with a job on, PLAY is to the job (mapPlayToJob, the map's best route) */
      if (TRAVEL_SPEED > 0 && TRAVEL) travelSpeedSet(0);
      else if (!TRAVEL && (LOOP.held || []).length && P.jobGo(jobId)) { try { camHold(); } catch (e) {} }   /* nothing picked: to the job */
      else { travelSpeedSet(TRAVEL_SPEED_LAST || TRAVEL_DEFAULT); try { camHold(); } catch (e) {} }
      window.__PHONE_PLAYS = (window.__PHONE_PLAYS | 0) + 1;
      return true;
    } catch (e) { return false; }
  };
  P.speed = function (n) { try { return travelSpeedSet(n); } catch (e) { return false; } };
  /* THE JOBS HE IS ON (rule 227): what, where, the red stars, the time there and back (rule 222), never the offers */
  var JOBS_AT = { key: null, out: [] };
  P.jobs = function () {
    /* the path finder is not asked five times a second: only when the jobs, his block or the hour change */
    var key = ''; try { key = (LOOP.held || []).map(function (j) { return j && j.id; }).join(',') + '|' + city.x + ',' + city.y + '|' + T.day + ':' + ((T.min / 30) | 0)
      + '|' + (window.BohemiaJobDanger && BohemiaJobDanger.ready && BohemiaJobDanger.ready() ? 1 : 0); } catch (e) { key = String(Math.random()); }
    if (key === JOBS_AT.key) return JOBS_AT.out;
    var out = [];
    try {
      var W = (window.BohemiaPhoneBoard && BohemiaPhoneBoard.what) ? BohemiaPhoneBoard.what() : null;
      (LOOP.held || []).forEach(function (j) {
        if (!j || !j.id) return;
        var stars = null; try { if (window.BohemiaJobDanger && BohemiaJobDanger.stars) stars = BohemiaJobDanger.stars(j, j.from); } catch (e) {}
        if (stars == null) stars = Math.max(1, Math.min(5, (j.skulls | 0) || 1));
        var t = null; try { t = window.BohemiaJobKinds && BohemiaJobKinds.trip ? BohemiaJobKinds.trip(j, j.from) : null; } catch (e) {}
        var mins = null, back = false, at = null;
        if (t && t.job) { back = !!t.job.back; at = t.job.name || null;
          mins = (t.job.total != null ? t.job.total : (t.job.mins != null ? t.job.mins : t.job.minsHi)) + (t.toTown && t.toTown.mins ? t.toTown.mins : 0); }
        /* rule 238(d): which way, as the map shows it: the job's next place (WORLD's nextOf) from his block, turned through the map's
           own diamond (a grid step east goes right and down on the glass), in degrees, 0 = up the glass, clockwise */
        var deg = null, nx = null; try { var n = window.BohemiaJobKinds && BohemiaJobKinds.nextOf ? BohemiaJobKinds.nextOf(j) : null;
          if (n && n.x != null) { var g = __CITY.state(), dx = n.x - city.x, dy = n.y - city.y, vx = (dx - dy) * g.TW / 2, vy = (dx + dy) * g.TH / 2;
            nx = [n.x, n.y]; if (dx || dy) deg = Math.round((Math.atan2(vx, -vy) * 180 / Math.PI + 360) % 360); } } catch (e) {}
        out.push({ id: j.id, what: String((W && W[j.id]) || j.title || 'a job'), from: String(j.from || ''), at: at, stars: stars | 0, mins: mins, back: back, deg: deg, to: nx });
      });
    } catch (e) {}
    JOBS_AT = { key: key, out: out };
    return out;
  };
  P.dropCost = function (id) { try { return window.BohemiaJobKinds && BohemiaJobKinds.dropCost ? BohemiaJobKinds.dropCost(id) : null; } catch (e) { return null; } };
  P.drop = function (id) { try { return window.BohemiaJobKinds && BohemiaJobKinds.drop ? BohemiaJobKinds.drop(id) : null; } catch (e) { return null; } };
  /* PLAY TAKES HIM THERE (rule 227(c)): RUN's own route when it lands ([play takes you there]); until then the map's own
     path finder to the job's place, the same door a tap on the map uses (travelTo) */
  P.jobGo = function (id) {
    try { if (typeof window.mapPlayToJob === 'function') { var r = !!window.mapPlayToJob(id), L = window.MAP_PLAY && MAP_PLAY.last;   /* RUN 10/26: the map's best route answers; the same record */
      window.__PHONE_JOB_GO = { id: (L && L.id) || id || null, to: L && L.to ? L.to : null, ok: r, by: 'map' }; return r; } } catch (e) {}
    try {
      var held = LOOP.held || [], j = held.filter(function (x) { return x && x.id === id; })[0] || held[0]; if (!j) return false;
      var tg = j.target, x = tg && (tg.x != null ? tg.x : tg[0]), y = tg && (tg.y != null ? tg.y : tg[1]);
      if (x == null || y == null) return false;
      var ok = travelTo(0, 0, [x | 0, y | 0]); window.__PHONE_JOB_GO = { id: j.id, to: [x | 0, y | 0], ok: !!ok };
      return !!ok;
    } catch (e) { return false; }
  };
  /* THE COMPANY'S CONDITION (rule 226(c)): CAMP's numbers (BohemiaMapCamp.condition(), [the heal button, damage that stays]:
     {blood, armour, hp, hpMax, arm, armMax, men, tape, says}, the living company's sums, mended by the map's clock); before CAMP's
     module is up the company comes home whole, so the bar is full */
  P.condition = function () {
    try { var M = window.BohemiaMapCamp, c = M && typeof M.condition === 'function' ? M.condition() : null;
      if (!c && window.BohemiaHeal && typeof BohemiaHeal.condition === 'function') c = BohemiaHeal.condition();
      if (c && (c.hpMax || c.armMax)) return { hp: +c.hp || 0, hpMax: +c.hpMax || 0, arm: +c.arm || 0, armMax: +c.armMax || 0,
        blood: c.blood != null ? +c.blood : (c.hpMax ? c.hp / c.hpMax : 1), armour: c.armour != null ? +c.armour : (c.armMax ? c.arm / c.armMax : 1), says: c.says || '', from: 'camp' }; } catch (e) {}
    return { hp: 1, hpMax: 1, arm: 1, armMax: 1, blood: 1, armour: 1, says: '', from: 'whole' };
  };
  P.crew = function () {   /* the bar's own CREW: the one company screen, from the map and the town (it presses the town's own) */
    var t = document.querySelector('#bmtb .t.crew'); if (!t) return false; t.click(); return true;
  };
  P.camp = function () {   /* CAMP's own switch (BohemiaMapCamp.toggle(): makes camp, or breaks the one that stands) */
    try { var C = window.BohemiaMapCamp; if (!C) return false; var was = C.on();
      if (typeof C.toggle === 'function') { C.toggle(); return was ? 'broke' : (C.on() ? 'made' : false); }
      if (was) { C.break(); return 'broke'; } return C.make() ? 'made' : false; } catch (e) { return false; }
  };
  /* THE FLIP'S DOOR (DYNASTY's, rule 31): after the first crisis the old opened phone carried SWITCH TIMELINE; the new phone's
     status bar carries a TIMELINE tag that opens that same door, until DYNASTY puts the flip where it belongs */
  /* THE BAR'S OWN PRESSES (rule 238(a)): the phone presses the very button of this page's bar (UI's #bmtb: CREW, the gear, NOTES),
     hidden under the phone's rule, so every action keeps its one handler and has one button on the glass (286(b)) */
  P.barPress = function (k) {
    try { var b = k === 'notes' ? document.getElementById('notebtn') : document.querySelector('#bmtb .t.' + k); if (!b) return false; b.click(); return true; } catch (e) { return false; }
  };
  /* THE TOWN'S LEAVE (rule 238(a)): the town's own button, pressed from the phone's band (the town's copy hidden under the phone) */
  P.leave = function () {
    try { var d = LOOP.frame && LOOP.frame.contentWindow && LOOP.frame.contentWindow.document, b = d && d.getElementById('leave'); if (!b) return false; b.click(); window.__PHONE_LEAVE = (window.__PHONE_LEAVE | 0) + 1; return true; } catch (e) { return false; }
  };
  P.timeline = function (go) {
    var ready = false; try { ready = !!(window.BohemiaActs && BohemiaActs.crisisStarted()); } catch (e) {}
    if (!go || !ready) return ready;
    try { phoneOpen(); setTimeout(function () { var b = document.getElementById('bmtimes'); if (b && !b.classList.contains('on')) b.click(); }, 700); return true; } catch (e) { return false; }
  };
  /* THE STREAM: FEED's engine (BohemiaFeed.read(), rule 215: newest first, {handle, text, kind, reply_to}) when it is up, else the
     old stream; handed on oldest first as {who, txt, kind, re} so the app reads one shape */
  P.posts = function () {
    try {
      if (window.BohemiaFeed && typeof BohemiaFeed.read === 'function') {
        var r = BohemiaFeed.read({ limit: 30 }) || [];
        if (r.length) return r.slice().reverse().map(function (x) { var h = String(x.handle || ''); return { who: h.charAt(0) === '@' ? h : '@' + h, txt: String(x.text || ''), kind: x.kind || 'world', re: !!x.reply_to, id: x.id }; });
      }
      return window.BOHEMIA_FEED ? window.BOHEMIA_FEED.posts() : [];
    } catch (e) { return []; }
  };
  P.post = function (p) { try { return window.BOHEMIA_FEED ? window.BOHEMIA_FEED.push(p) : false; } catch (e) { return false; } };
  P.towns = function () {
    var out = [];
    try { var bs = (typeof ctBases === 'function') ? ctBases() : null; for (var n in (bs || {})) out.push(n); } catch (e) {}
    return out;
  };
  P.company = function () {
    var o = { men: 0, clout: null };
    try { o.men = (JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]') || []).length + (JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]') || []).length; } catch (e) {}
    try { var t = document.querySelector('#bmtb [data-f=crew] b'); if (t) { var m = String(t.textContent).match(/(\d+)/); if (m) o.men = +m[1]; } } catch (e) {}
    try { if (window.BohemiaRenown && BohemiaRenown.get) o.clout = BohemiaRenown.get(); } catch (e) {}
    return o;
  };
  /* the wallpaper: the map's own picture under the crew, twice up, or the town's or the camp's own picture */
  P.wall = function (ctx, w, h) {
    try {
      var sf = document.getElementById('settleFrame');
      if (sf && sf.style.display === 'block') {
        var sc = sf.contentWindow.document.getElementById('cv'); if (!sc || !sc.width) return false;
        var k = sc.width / Math.max(1, sc.clientWidth), cw0 = w * k, ch0 = h * k;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(sc, Math.max(0, (sc.width - cw0) / 2), Math.max(0, (sc.height - ch0) / 2), cw0, ch0, 0, 0, w, h);
        return 'place';
      }
      var cv = document.getElementById('cv'); if (!cv || !cv.width) return false;
      var p = __CITY.isoAt(city.x, city.y), d = cv.width / Math.max(1, cv.clientWidth), MAG = 2;
      var sw = w / MAG * d, sh = h / MAG * d, sx = p.sx * d - sw / 2, sy = (p.sy - (typeof TH !== 'undefined' ? TH : 9)) * d - sh / 2;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(cv, sx, sy, sw, sh, 0, 0, w, h);
      window.__PHONE_WALL = { sx: sx, sy: sy, sw: sw, sh: sh, at: [city.x, city.y], party: [p.sx * d, p.sy * d] };
      return 'block';
    } catch (e) { return false; }
  };
  /* ---- THE FIGHT ---- */
  P.isFight = function () { return !!document.getElementById('skills') && !!document.getElementById('bot') && !document.getElementById('cityFrame') && !document.getElementById('fightFrame'); };
  function isAbility(b) { return b.classList.contains('bag') || !!b.dataset.sweep || !!b.dataset.skill; }
  /* the fight's own buttons the phone carries, in the phone's order: STRIKE and RELOAD in the fight's own order (RELOAD first
     when the gun is dry) while the fight shows them (rule 238(a): every press of the fight on the phone), BACK while the walk can
     be taken back (the fight's own state, its inline display; on a phone upright the bar beside the phone had no room for it, and
     WAIT slid over it), then the bag swaps, the sweeps and the perks' skills (rule 180(g)) */
  function abilityButtons(sk) {
    var sr = [].slice.call(sk.querySelectorAll('#bstrike, #breload')).filter(function (b) { return b.style.display !== 'none'; });
    var bk = document.getElementById('bback'), live = bk && bk.style.display !== 'none' && !bk.disabled ? [bk] : [];
    return sr.concat(live, [].slice.call(sk.querySelectorAll('.sq')).filter(isAbility));
  }
  P.abilities = function () {
    var sk = document.getElementById('skills'); if (!sk) return { key: '', list: [] };
    var list = abilityButtons(sk).map(function (b, i) {
      var lab = b.querySelector('b');
      return { i: i, title: b.title || '', ap: lab ? String(lab.textContent || '') : '', on: b.classList.contains('on'), off: !!b.disabled,
        cv: b.querySelector('canvas'), kind: b.id === 'bstrike' ? 'strike' : b.id === 'breload' ? 'reload' : b.id === 'bback' ? 'back' : b.classList.contains('bag') ? 'bag' : b.dataset.sweep ? 'sweep' : 'skill' };
    });
    var who = document.getElementById('cnm');
    return { key: (sk.dataset.key || '') + '|' + list.map(function (a) { return a.on + '' + a.off; }).join(''), list: list,
      name: who ? String(who.textContent || '').replace(/\s*\*$/, '') : '', face: document.getElementById('face') };
  };
  /* THE FIGHT'S COMMANDS (rule 238(a)): the big button (FIGHT at the line, then what the first tap picked: WALK, SHOOT, HIT,
     THROW with its chance, else END TURN), WAIT, RETREAT (two presses; END THE FIGHT when all of theirs run), AUTO (FINISHING, the
     odds tint, the glow that teaches it) and the speed, read off the fight's own buttons and pressed through them */
  var CMD = { go: 'bend', wait: 'bwait', flee: 'bflee', auto: 'bauto', speed: 'bspeed' };
  P.cmds = function () {
    var g = function (id) { return document.getElementById(id); }, be = g('bend'); if (!be) return null;
    var bw = g('bwait'), bf = g('bflee'), ba = g('bauto'), bs = g('bspeed');
    var tn = [].filter.call(be.childNodes, function (n) { return n.nodeType === 3; })[0];
    var kind = ['walk', 'shoot', 'hit', 'throw'].filter(function (k) { return be.classList.contains(k); })[0] || '';
    var tint = ba && ba.querySelector('.tint');
    return {
      go: { label: String(tn ? tn.textContent : be.textContent || '').trim(), sub: String((be.querySelector('.sub') || {}).textContent || ''), off: !!be.disabled,
            hot: be.classList.contains('go'), kind: kind, mark: kind ? String(be.style.getPropertyValue('--mark-' + kind) || '') : '' },
      wait: { off: !bw || !!bw.disabled, run: !!(bw && bw.classList.contains('run')), label: bw ? String(bw.textContent || '').trim() : '' },   /* RUN THEM DOWN when they break (COMBAT, rule 198(h)) */
      flee: { off: !bf || !!bf.disabled, arm: !!(bf && bf.classList.contains('arm')), end: !!(bf && bf.classList.contains('end')), label: bf ? String(bf.textContent || '').trim() : '' },
      auto: { on: !!(ba && ba.classList.contains('on')), glow: !!(ba && ba.classList.contains('glow')), odds: String(((ba && ba.querySelector('.odds')) || {}).textContent || ''),
              tint: tint ? String(tint.style.backgroundColor || '') : '' },
      speed: { label: bs ? String(bs.textContent || '').trim() : '', now: !!(bs && bs.classList.contains('now')), off: !bs }
    };
  };
  P.cmd = function (k) {
    var b = CMD[k] && document.getElementById(CMD[k]); if (!b || b.disabled) return false;
    b.click(); window.__PHONE_CMD = (window.__PHONE_CMD | 0) + 1; window.__PHONE_CMD_LAST = k; return true;
  };
  P.over = function () { try { return !!(typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.over); } catch (e) { return false; } };
  P.press = function (i) {
    var sk = document.getElementById('skills'); if (!sk) return false;
    var b = abilityButtons(sk)[i];
    if (!b || b.disabled) return false; b.click(); window.__PHONE_ABILITY = (window.__PHONE_ABILITY | 0) + 1; return true;
  };

  /* ---- WHAT A PAGE DOES FOR ITSELF WHEN THE PHONE IS ON: never two phones, never a press under it ---- */
  function localCss() {
    if (document.getElementById('bohphone-local')) return;
    var css = ''
      /* THE MAP: the old phone, the speed pad and the CAMP plate step aside where the phone took over (212(g); RUN's lines
         are marked __ONE_PHONE__ for RUN to take out) */
      + 'html.boh-phone-on body:has(#cityfeed) #cityfeed,html.boh-phone-on body:has(#cityfeed) #speedpad,html.boh-phone-on body:has(#cityfeed) #campbtn{display:none!important}'
      /* CAMP's HEAL button over the camp (#healbtn, the settlement screen's) is the phone's HEAL app there: BREAK CAMP, its bar filling */
      + 'html.boh-phone-on #healbtn{display:none!important}'
      /* rule 238(a), 286(b): the bar's gear and NOTES, the town's LEAVE and the camp's BREAK CAMP are on the phone (HEAL breaks camp);
         their copies on the glass step aside, pressed from the phone. The bar's crew chip stays as what it shows (his lead's face,
         the head count, their blood): a readout now, its press the phone's CREW */
      + 'html.boh-phone-on #bmtb .t.gear,html.boh-phone-on #notebtn{display:none!important}'
      /* the map's own page says the same in RUN's marked line (#run-no-button-twice, 26c18a3a); this one is for every other page that
         wears the bar (the fight's) */
      + 'html.boh-phone-on body:not(:has(#cityfeed)) #bmtb .t.crew,html.boh-phone-on body:not(:has(#cityfeed)) #bmtb .t.crew *{pointer-events:none!important;cursor:default!important}'
      + 'html.boh-phone-on body:has(#sbody) #leave{display:none!important}'
      /* a sheet's close X sat in the phone's corner (CAMP's measure, 8db01c53: the tent, the retinue, the cart could not be closed
         by a finger): with the phone on the right the X is the sheet's top left, the keeper's row giving it the room (rule 279) */
      + 'html.boh-phone-on.boh-phone-right body:has(#sbody) #sheet #close{right:auto!important;left:8px!important}'
      + 'html.boh-phone-on.boh-phone-right body:has(#sbody) #sheet .who{padding-right:0!important;padding-left:56px!important}'
      /* THE FIGHT (rules 213(b), 238(a), 286(b)): every press of the fight is on the phone (the big button, STRIKE, RELOAD, BACK,
         the abilities, WAIT, RETREAT, AUTO, the speed), so the bar's second row and its copies step aside; the bar keeps the man
         (his face, his blood, armour, fatigue, AP) and the round's order, laid out of the phone's corner until COMBAT's own [the
         fight frames around the phone] lands. COMBAT's bench (the fight's page on its own) builds no phone and keeps its bar. */
      + 'html.boh-phone-on body:has(#skills) #row2,html.boh-phone-on body:has(#skills) #bend,html.boh-phone-on body:has(#skills) #bauto,'
      +   'html.boh-phone-on body:has(#skills) #speedpad{display:none!important}'
      + 'html.boh-phone-on.boh-phone-right body:has(#skills) #bot{right:calc(var(--boh-phone-gap-r) + 6px)!important}'
      + 'html.boh-phone-on.boh-phone-left body:has(#skills) #bot{left:calc(var(--boh-phone-gap-l) + 6px)!important}'
      /* a computer keeps the bar centred clear of the phone on both sides; a tablet, like a phone, gives up only the phone's side (both
         sides on a tablet broke the wide glass's one-row bar: THE REBUILT FIGHT PLAYS) */
      + 'html.boh-phone-on[data-screen=computer] body:has(#skills) #bot{'
      +   'right:auto!important;left:50%!important;width:min(980px,calc(100vw - 24px - 2 * (var(--boh-phone-w) + 16px)))!important}'
      /* THE COMPANY SCREEN, one column under 700 wide: the stash's tabs and pockets stand beside the phone, never under it */
      + '@media (max-width:699px){html.boh-phone-on.boh-phone-right body:has(#bag) #stash{padding-right:calc(var(--boh-phone-gap-r) + 6px)!important}'
      +   'html.boh-phone-on.boh-phone-left body:has(#bag) #stash{padding-left:calc(var(--boh-phone-gap-l) + 6px)!important}'
      +   'html.boh-phone-on body:has(#bag) #tabs{flex-wrap:wrap!important;row-gap:3px}}';
    var st = document.createElement('style'); st.id = 'bohphone-local'; st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  /* what moved a town's opinion: the town's screen tells the map (its post('relation', {place, act, before, after, band})),
     and the map keeps the last few per town; RELATIONS reads them */
  if (P.isMap()) window.addEventListener('message', function (ev) {
    var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_SETTLEMENT' || typeof d.before !== 'number' || typeof d.after !== 'number' || !d.band || !d.place) return;
    var W = {}; try { W = JSON.parse(localStorage.getItem(WHYKEY) || '{}') || {}; } catch (e) { W = {}; }
    var day = 0; try { day = T.day; } catch (e) {}
    var row = W[d.place] = W[d.place] || [];
    row.unshift({ act: String(d.act || ''), before: d.before, after: d.after, day: day });
    W[d.place] = row.slice(0, 4);
    try { localStorage.setItem(WHYKEY, JSON.stringify(W)); } catch (e) {}
  });

  /* ---- THE COMPANY'S NAME: one name, renamed from FEED; the door's pick until he renames it ---- */
  function nameGet() {
    var n = null; try { n = ls().getItem(NAMEKEY); } catch (e) {}
    if (n) return n;
    try { var p = HOST.BOH_START && HOST.BOH_START.picks(); if (p && p.name) return String(p.name); } catch (e) {}
    return 'THE CREW';
  }
  function nameSet(v) {
    v = String(v || '').replace(/\s+/g, ' ').trim().toUpperCase().slice(0, 22);
    if (!v) return false;
    try { ls().setItem(NAMEKEY, v); } catch (e) {}
    return v;
  }
  window.BohemiaCompanyName = { get: nameGet, set: nameSet, KEY: NAMEKEY };

  /* ======================================================================================================================
     THE HOST: the phone itself, drawn once
     ==================================================================================================================== */
  var H = { el: null, scr: null, state: { on: false, side: 'right', screen: null, rect: null }, cfg: cfg(), page: null, wallAt: 0, face: 'home',
    stripSig: null, stripTop: null, feedKind: null, fightKey: null, fightShown: false, anim: 0, holdT: 0, presses: 0, lastScreen: null };

  function frames(w, out) {   /* every same-origin page under w, w first */
    out = out || []; out.push(w);
    try { var fs = w.document.querySelectorAll('iframe'); for (var i = 0; i < fs.length; i++) { try { var cw = fs[i].contentWindow; if (cw && cw.document) frames(cw, out); } catch (e) {} } } catch (e) {}
    return out;
  }
  function cityWin() {
    if (P.isMap()) return window;
    try { var f = document.getElementById('cityFrame'); var w = f && f.contentWindow; if (w && w.BohemiaPhone && w.BohemiaPhone.P.isMap()) return w; } catch (e) {}
    return null;
  }
  function fightWin() {
    if (P.isFight() && !P.isMap()) return window;
    try { var f = document.getElementById('fightFrame'); if (!f) return null; var r = f.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return null;
      var w = f.contentWindow; if (w && w.BohemiaPhone && w.BohemiaPhone.P.isFight()) return w; } catch (e) {}
    return null;
  }
  function barOf(scr) {
    try { if (scr === 'fight') { var fw = fightWin(); if (fw && fw.BohemiaPhone) return fw.BohemiaPhone.P; } } catch (e) {}
    var cw = cityWin(); return cw && cw.BohemiaPhone ? cw.BohemiaPhone.P : null;
  }
  function gameOn() {
    try {
      var fr = document.getElementById('front'); if (fr && getComputedStyle(fr).display !== 'none') return false;
      var vis = function (id) { var f = document.getElementById(id); if (!f) return null; var r = f.getBoundingClientRect(); return r.width >= 2 && r.height >= 2; };
      var c = vis('cityFrame'), f = vis('fightFrame'); if (c === false && !f) return false;   /* the workshop's other tabs: no phone */
    } catch (e) {}
    return true;
  }
  function whichScreen() {
    if (!gameOn()) return null;
    var fw = fightWin();
    /* a fight inside the game (the shell's clouds, nf-on); the fight's page opened on its own is COMBAT's bench, not the game: no
       phone there (it is what COMBAT's own gates open, and the bench keeps its own bar and pace) */
    if (fw && document.body.classList.contains('nf-on')) return 'fight';
    var cw = cityWin(); if (!cw) return null;
    var s = cw.BohemiaPhone.P.state();
    if (s.sky) return null;
    if (s.camp) return 'camp';
    if (s.town) return 'town';
    if (s.mode === 'city') return 'map';
    return null;
  }

  var CSS = function () {
    var M = window.BohemiaMaterials, kit = function (n, s) { try { return M && M.kit ? M.kit(n, s) : ''; } catch (e) { return ''; } };
    return ''
      + "@font-face{font-family:'BohemiaCasing';src:url(" + BASE + "fonts/BohemiaCasing-Regular.woff2) format('woff2');font-display:block}"
      + "@font-face{font-family:'BohemiaROM';src:url(" + BASE + "fonts/BohemiaROM-Regular.woff2) format('woff2');font-display:block}"
      + '#bohphone{position:fixed;left:0;top:0;width:' + BW + 'px;height:' + BH + 'px;z-index:60;display:none;transform-origin:0 0;'
      +   'font-family:"BohemiaROM",ui-monospace,monospace;color:#efe3c6;-webkit-user-select:none;user-select:none;touch-action:manipulation;'
      +   '-webkit-tap-highlight-color:transparent;filter:drop-shadow(3px 2px 0 rgba(8,5,2,.55))}'
      + '#bohphone.on{display:block}'
      + '#bohphone.behind{opacity:.35;pointer-events:none}'
      + '#bohphone *{box-sizing:border-box}'
      + '#bohphone .case{position:absolute;inset:0;z-index:0;pointer-events:none;border-style:solid;border-width:20px 15px 23px 15px;'
      +   'border-image:url(' + IMG('case') + ') 60 45 69 45 / 20px 15px 23px 15px round}'
      + '#bohphone .ear{position:absolute;left:45px;top:2px;width:34px;height:9px;z-index:9;pointer-events:none;image-rendering:auto}'
      + '#bohphone .scr{position:absolute;z-index:1;left:8px;top:13px;right:8px;bottom:16px;border-radius:7px;overflow:hidden;background:#0b0a08}'   /* in the case's hole, over the case */
      + '#bohphone .wall{position:absolute;left:0;top:0;width:100%;height:100%;image-rendering:pixelated}'
      + '#bohphone .dim{position:absolute;inset:0;background:rgba(9,7,5,.46)}'
      + '#bohphone .glass{position:absolute;inset:0;z-index:7;pointer-events:none;opacity:.42;mix-blend-mode:screen;'
      +   'background:url(' + BASE + 'ui_kit/glass/c.png) -9px -21px/128px 128px}'
      + '#bohphone .stat{position:absolute;left:0;right:0;top:0;height:12px;z-index:6;display:flex;align-items:center;justify-content:space-between;'
      +   'padding:1px 5px 0;font-size:7px;letter-spacing:.4px;color:#e9dcbc;background:rgba(6,5,4,.62);text-shadow:0 1px 0 #000}'
      + '#bohphone .stat .wh{max-width:110px;overflow:hidden;white-space:nowrap;text-overflow:clip}'
      + '#bohphone .stat .tl{display:none;height:11px;padding:0 3px;border:0;cursor:pointer;font:6.5px "BohemiaROM",ui-monospace,monospace;letter-spacing:.4px;color:#1f1710;background:#f2c96a}'
      + '#bohphone.tl .stat .tl{display:block}#bohphone.tl .stat .wh{max-width:64px}'
      + '#bohphone .home{position:absolute;left:0;right:0;top:12px;bottom:0;z-index:2}'
      + '#bohphone .app{position:absolute;width:52px;height:56px;padding:0;margin:0;border:0;background:none;cursor:pointer;color:inherit;font:inherit;outline:none}'
      + '#bohphone .app img{position:absolute;left:4px;top:0;width:44px;height:47px;image-rendering:auto;pointer-events:none}'
      + '#bohphone .app .lab{position:absolute;left:-4px;right:-4px;top:47px;text-align:center;font-size:7px;letter-spacing:.5px;line-height:9px;color:#f1e4c4;text-shadow:0 1px 0 #000,0 0 3px #000;pointer-events:none}'
      + '#bohphone .app:active img{transform:translateY(1px)}'
      + '#bohphone .app.off{opacity:.45}'
      /* THE HOME'S BANDS (rules 232, 238, 286), the home 108 wide, 228 inside the case's lip: jobs 1..65, the feed 67..113, the two
         116..166, the band 169..195, the row 198..226 */
      + '#bohphone .bptwo{position:absolute;left:2px;right:2px;top:116px;height:50px;display:flex;flex-wrap:nowrap;gap:0;padding:0;margin:0;justify-content:space-between}'
      + '#bohphone .app.big{position:relative;width:50px;height:50px}'
      + '#bohphone .app.big img{left:3px;top:1px;width:44px;height:47px}'
      + '#bohphone .app.big .lab{display:none}'
      + '#bohphone .bprow{position:absolute;left:1px;right:1px;top:198px;height:28px;display:flex;flex-wrap:nowrap;gap:0;padding:0;margin:0;justify-content:space-between;align-items:center}'
      + '#bohphone .app.sm{position:relative;width:26px;height:28px}'
      + '#bohphone .app.sm img{left:1px;top:1px;width:24px;height:25.6px}'
      + '#bohphone .app.sm .lab{display:none}'
      + '#bohphone .bpctx{position:absolute;left:3px;right:3px;top:169px;height:26px;padding:0;margin:0}'
      + '#bohphone .bpctx .lv{display:none;position:absolute;inset:0;width:100%;padding:0 6px;border:0;cursor:pointer;align-items:center;gap:6px;font:10px "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1.4px;color:#1f1710;' + kit('tin', 0.5) + '}'
      + '#bohphone .bpctx .lv img{width:22px;height:23.5px;pointer-events:none}'
      + '#bohphone .bpctx.town .lv{display:flex}#bohphone .bpctx.town .clk{display:none}'
      + '#bohphone .bpfd{position:absolute;left:3px;right:3px;top:67px;height:46px;margin:0;overflow:hidden;cursor:pointer;padding:2px 3px;background:rgba(6,5,4,.66);box-shadow:inset 0 0 0 1px rgba(240,226,196,.14)}'
      + '#bohphone .bpfd .fp{height:21px;overflow:hidden;font-size:6.5px;line-height:7.5px;color:#ecdfc2}'
      + '#bohphone .bpfd .fp + .fp{border-top:1px solid rgba(240,226,196,.14);padding-top:1px}'
      + '#bohphone .bpfd .fp b{display:block;font-weight:400;color:#f6cf74;white-space:nowrap;overflow:hidden}'
      + '#bohphone .bpfd .fp.mine b{color:#9fd08a}'
      + '#bohphone .bpfd .fp span{display:block;max-height:13.5px;overflow:hidden}'
      + '#bohphone .bpfd .fp.new{animation:bohIn ' + BEAT + 'ms steps(2,end)}'
      + '@keyframes bohIn{0%{transform:translateY(-100%)}100%{transform:none}}'
      + '#bohphone .kf{display:flex;gap:4px;margin:0 0 4px}'
      + '#bohphone .kf button{width:26px;height:28px;padding:0;border:0;background:none;cursor:pointer;opacity:.6}'
      + '#bohphone .kf button.on{opacity:1;outline:1px solid #f6cf74}'
      + '#bohphone .kf img{width:24px;height:25.6px;display:block;pointer-events:none}'
      /* THE HEAL BAR (rule 226(c)): one bar under the cross, the company's hitpoints red and armour grey over their maxima */
      /* HEAL (rule 232(b)): the cross in its ring, the ring filled with the company's blood and armour; no word on it */
      + '#bohphone .app[data-app=heal] .lab{display:none}'
      + '#bohphone .app .rg{position:absolute;left:4px;top:0;width:44px;height:47px;pointer-events:none}'
      + '#bohphone .app.big .rg{left:2px;width:50px;height:53.4px}'
      /* THE JOB COLUMN (rules 227 and 228): the main quest's slot first and always kept, then the jobs he is on */
      + '#bohphone .jobs{position:absolute;left:3px;right:3px;top:1px;height:64px;display:flex;flex-direction:column;gap:2px}'
      + '#bohphone .jobs .mq{flex:0 0 12px;opacity:.55;' + kit('well', 0.25) + '}'
      + '#bohphone .jc{position:relative;flex:0 0 24px;display:flex;align-items:center;gap:3px;padding:1px 2px 1px 4px;cursor:pointer;color:#1f1710;' + kit('receipt', 0.4)
      +   'border-radius:1px!important;filter:drop-shadow(1px 1px 0 rgba(0,0,0,.6))}'
      + '#bohphone .jc.sel{box-shadow:inset 3px 0 0 #e8a83a!important}'
      + '#bohphone .jc .dir{flex:0 0 12px;width:12px;height:12px;display:block;transform-origin:50% 50%}'
      + '#bohphone .jc .dir svg{display:block}#bohphone .jc .dir path{fill:#2a1d10;stroke:#f1e4c4;stroke-width:.6}'
      + '#bohphone .jc .dir.here svg{display:none}#bohphone .jc .dir.here::after{content:"";display:block;width:6px;height:6px;margin:3px;border-radius:50%;background:#2a1d10}'
      + '#bohphone .jc .tx{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;line-height:8px}'
      + '#bohphone .jc .wh{font-size:7px;white-space:nowrap;overflow:hidden;text-overflow:clip}'
      + '#bohphone .jc .mt{font-size:6px;white-space:nowrap;overflow:hidden;color:#4a3826}'
      + '#bohphone .jc .st{color:#a3180c;letter-spacing:-.5px;margin-right:2px}'
      + '#bohphone .jc .x{flex:0 0 32px;width:32px;height:24px;margin:-1px -2px -1px 0;padding:0 0 0 10px;border:0;background:none;cursor:pointer}'   /* the X is 20 drawn, 32 by the card's height to a thumb */
      + '#bohphone .jc .x img{width:20px;height:21.4px;display:block;pointer-events:none}'
      + '#bohphone .jc.arm{flex:0 0 50px;background:#e8d6b4!important;color:#5a1408}'
      + '#bohphone .jobs.asking .jc:not(.arm),#bohphone .jobs.asking .je{display:none}'   /* while one asks, it has the column */
      + '#bohphone .jobs .je{flex:0 0 24px;opacity:.5;' + kit('well', 0.25) + '}'   /* an empty slot, ready to go (232(a)) */
      + '#bohphone .jc .dr{flex:0 0 44px;width:44px;height:44px;border:0;cursor:pointer;font:9px "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:.6px;color:#7a1206;' + kit('tin', 0.4) + '}'
      + '#bohphone .app .mark{position:absolute;right:-3px;bottom:3px;padding:1px 4px 0 3px;font-size:7px;line-height:8px;color:#f6cf74;background:#1c140c;border-radius:1px;pointer-events:none}'
      + '#bohphone .clk{position:absolute;inset:0;display:flex;align-items:center;gap:6px;padding:0 3px;pointer-events:none;text-shadow:0 1px 0 #000,0 0 4px #000}'
      + '#bohphone .clk b{display:block;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;font-size:15px;line-height:16px;letter-spacing:.5px;color:#f4e8cc}'
      + '#bohphone .clk i{display:block;font-style:normal;font-size:7px;line-height:9px;color:#e0d2b0;letter-spacing:.4px}'
      + '#bohphone .clk i.go{color:#f6cf74}'
      + '#bohphone .page,#bohphone .fight{position:absolute;left:0;right:0;top:12px;bottom:0;z-index:4;display:none;flex-direction:column;background:rgba(10,8,6,.78)}'
      + '#bohphone .page.on,#bohphone .fight.on{display:flex}'
      + '#bohphone .ph{flex:0 0 22px;display:flex;align-items:center;gap:4px;padding:0 5px;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:10px;'
      +   'letter-spacing:1px;color:#f4e8cc;background:rgba(0,0,0,.35);cursor:pointer}'
      + '#bohphone .ph i{font-style:normal;color:#f6cf74;font-size:12px}'
      + '#bohphone .pb{flex:1;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;padding:3px 4px 6px;font-size:7.5px;line-height:9.5px;letter-spacing:.2px}'
      + '#bohphone .pb::-webkit-scrollbar{display:none}'
      + '#bohphone .co{padding:4px 4px 5px;margin-bottom:4px;' + kit('receipt', 0.5) + 'color:#1f1710;filter:drop-shadow(1px 1px 0 rgba(0,0,0,.6))}'
      /* rule 268(a): the company's name is a box he types in: the box itself is the press (a tap puts the caret in it and the phone's
         keyboard up), the same box while he types */
      + '#bohphone .co .nm,#bohphone .co input{display:block;box-sizing:border-box;width:100%;min-height:18px;margin:0;padding:2px 3px;border:1px solid #1f1710;border-radius:1px;'
      +   'background:#f5efe0;color:#1f1710;font:10px/12px "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:.6px;box-shadow:inset 1px 1px 0 rgba(31,23,16,.25)}'
      + '#bohphone .co .nm{cursor:text;word-break:break-word}'
      + '#bohphone .co .nm u{float:right;text-decoration:none;font-size:6.5px;letter-spacing:.3px;color:#6b4a1c;margin-left:3px}'
      + '#bohphone .co .sub{display:block;font-size:7px;color:#3c2e1e}'
      + '#bohphone .po{padding:3px 0 4px;border-top:1px solid rgba(240,226,196,.12)}'
      + '#bohphone .po .w{display:block;color:#f6cf74;font-size:7px}'
      + '#bohphone .po.mine .w{color:#9fd08a}'
      + '#bohphone .po.re{padding-left:6px;border-left:1px solid rgba(240,196,126,.28)}'
      + '#bohphone .po .w i{font-style:normal;color:#9c8f70}'
      + '#bohphone .po .t{display:block;color:#ecdfc2}'
      + '#bohphone .rel{padding:3px 0 4px;border-top:1px solid rgba(240,226,196,.12)}'
      + '#bohphone .rel b{font-weight:400;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:8.5px;letter-spacing:.5px;color:#f4e8cc}'
      + '#bohphone .rel .bd{float:right;font-size:7px}'
      + '#bohphone .rel .why{display:block;color:#bfae8c;font-size:7px}'
      + '#bohphone .spd{display:flex;flex-direction:column;gap:5px;padding:6px 4px}'
      + '#bohphone .spd button{height:30px;border:0;cursor:pointer;font:9px "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1px;' + kit('tin', 0.5) + 'color:#1f1710}'
      + '#bohphone .spd button.now{' + kit('tin_amber', 0.5) + '}'
      + '#bohphone .spd p{margin:2px 0 0;font-size:7px;color:#cdbd98}'
      + '#bohphone .home.under{visibility:hidden}'
      /* THE FIGHT: the screen lit dark red, his face and name, his abilities in the kit's pockets, small, three a row */
      + '#bohphone .fight{background:#1a0907}'
      + '#bohphone .fh{flex:0 0 26px;display:flex;align-items:center;gap:4px;padding:2px 4px;background:rgba(0,0,0,.4)}'
      + '#bohphone .fh canvas{width:22px;height:22px;image-rendering:pixelated;border-radius:1px}'
      + '#bohphone .fh b{font-weight:400;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:9px;letter-spacing:.6px;color:#f4e8cc;white-space:nowrap;overflow:hidden}'
      /* rule 238(a): the fight's own commands over his abilities, the phone one size (238(b)): the big button the width of the glass,
         then WAIT, RETREAT, AUTO and the speed, then his abilities four a row, then the apps */
      + '#bohphone .fgo{flex:0 0 30px;margin:3px 3px 0;padding:0 5px;border:0;cursor:pointer;display:flex;align-items:center;gap:4px;color:#1f1710;' + kit('tin', 0.5) + '}'
      + '#bohphone .fgo.hot{' + kit('tin_amber', 0.5) + '}'
      + '#bohphone .fight.nocmd .fgo,#bohphone .fight.nocmd .fcm{display:none}'
      + '#bohphone .fgo[disabled]{opacity:.45;cursor:default}'
      + '#bohphone .fgo .mk{flex:0 0 18px;height:18px;background:center/contain no-repeat;image-rendering:pixelated;display:none}'
      + '#bohphone .fgo.mkd .mk{display:block}'
      + '#bohphone .fgo b{font-weight:400;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:10px;letter-spacing:1.2px;white-space:nowrap}'
      + '#bohphone .fgo i{margin-left:auto;font-style:normal;font-size:7px;white-space:nowrap}'
      + '#bohphone .fcm{flex:0 0 30px;margin:2px 3px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:nowrap;gap:0;padding:0}'
      + '#bohphone .fc{position:relative;width:25px;height:26.7px;padding:0;margin:0;border:0;background:none;cursor:pointer}'
      + '#bohphone .fc img{width:25px;height:26.7px;display:block;pointer-events:none}'
      + '#bohphone .fc[disabled]{opacity:.4;cursor:default}'
      + '#bohphone .fc.on{outline:2px solid #f6cf74;outline-offset:-1px}'
      + '#bohphone .fc.end{outline:2px solid #d0503a;outline-offset:-1px}'
      + '#bohphone .fc.glow{animation:bohBeat ' + BEAT + 'ms steps(2,end) infinite}'
      + '#bohphone .fc .tint{position:absolute;left:3px;top:3px;right:3px;bottom:5px;pointer-events:none;mix-blend-mode:multiply}'
      + '#bohphone .fc i{position:absolute;left:-2px;right:-2px;bottom:-3px;font-style:normal;font-size:5.5px;line-height:6.5px;text-align:center;color:#f6cf74;background:rgba(10,6,3,.8);pointer-events:none;white-space:nowrap;overflow:hidden}'
      + '#bohphone .fc i:empty{display:none}'
      + '#bohphone .fc.sp{width:25px;height:22px;font:8px "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:.5px;color:#1f1710;' + kit('tin', 0.5) + '}'
      + '#bohphone .fc.sp.now{' + kit('tin_amber', 0.5) + '}'
      + '#bohphone .ab{flex:1;display:grid;grid-template-columns:repeat(4,24px);grid-auto-rows:25px;gap:2px;justify-content:center;align-content:start;padding:3px 0;overflow:hidden}'
      + '#bohphone .ab .sk{position:relative;width:24px;height:25px;padding:0;margin:0;border:0;cursor:pointer;color:inherit;font:inherit;' + kit('well', 0.5) + '}'
      + '#bohphone .ab .sk canvas{position:absolute;left:2px;top:2px;width:20px;height:20px;pointer-events:none}'
      + '#bohphone .ab .sk i{position:absolute;right:1px;bottom:1px;font-style:normal;font-size:6px;line-height:7px;padding:0 1px;color:#f6cf74;background:rgba(10,6,3,.8);pointer-events:none}'
      + '#bohphone .ab .sk.on{outline:2px solid #f6cf74;outline-offset:-2px}'
      + '#bohphone .ab .sk[disabled]{opacity:.4;cursor:default}'
      + '#bohphone .frow{flex:0 0 30px;margin:0 0 7px;padding:0;gap:0;flex-wrap:nowrap;display:flex;justify-content:space-around;align-items:center;background:rgba(0,0,0,.4)}'
      + '#bohphone .ab .none{grid-column:1 / span 4;padding:2px 3px;font-size:7px;line-height:9px;color:#cdbd98;text-align:center}'
      /* COMBAT TIME: stop-motion holds on the beat (steps, never a smooth slide): the glass flashes, the crosshair strikes in
         three holds and beats twice, the word under it */
      + '#bohphone .cmb{position:absolute;inset:0;z-index:6;display:none;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:#2a0907}'
      + '#bohphone .cmb.on{display:flex;pointer-events:none}'   /* the strike is a picture: a finger goes through it to the page coming up under it */
      + '#bohphone .cmb img{width:56px;height:60px;transform:scale(.4);animation:bohStrike ' + (BEAT * 1.5) + 'ms steps(3,end) forwards, bohBeat ' + BEAT + 'ms steps(2,end) ' + (BEAT * 1.5) + 'ms 2}'
      + '#bohphone .cmb b{font-weight:400;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:13px;letter-spacing:2px;color:#f1d6c6;opacity:0;animation:bohWord ' + BEAT + 'ms steps(2,end) ' + (BEAT * 1.5) + 'ms forwards}'
      + '#bohphone .cmb::before{content:"";position:absolute;inset:0;background:#f4e0cc;opacity:0;animation:bohFlash ' + BEAT + 'ms steps(2,end)}'
      + '#bohphone .cmb.out{animation:bohOut ' + BEAT + 'ms steps(2,end) forwards}'
      + '@keyframes bohStrike{0%{transform:scale(.4)}100%{transform:scale(1)}}'
      + '@keyframes bohBeat{0%{transform:scale(1.12)}100%{transform:scale(1)}}'
      + '@keyframes bohWord{to{opacity:1}}'
      + '@keyframes bohFlash{0%{opacity:.85}100%{opacity:0}}'
      + '@keyframes bohOut{to{opacity:0}}'
      + '@media (prefers-reduced-motion:reduce){#bohphone .cmb img,#bohphone .cmb b{animation:none;transform:none;opacity:1}}'
      /* THE PHONE IN THE GAME'S SETTINGS: his corner and his apps */
      + '#setphone{margin:6px 0 10px}'
      + '#setphone .setrow{display:flex;align-items:center;gap:8px;margin-bottom:6px}'
      + '#setphone .pside{flex:1;display:flex;gap:6px}'
      + '#setphone .pside button,#setphone .pa button{min-height:44px;border:0;cursor:pointer;font:12px "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1.2px;' + kit('tin', 0.75) + 'color:#1f1710}'
      + '#setphone .pside button{flex:1}'
      + '#setphone .pside button.now{' + kit('tin_amber', 0.75) + '}'
      + '#setphone .pa{display:flex;align-items:center;gap:6px;margin:0 0 6px 0}'
      + '#setphone .pa img{width:40px;height:43px}'
      + '#setphone .pa span{flex:1;font:12px "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1.2px;color:#f0e2c4;text-shadow:0 1px 0 #000}'
      + '#setphone .pa.hid img,#setphone .pa.hid span{opacity:.4}'
      + '#setphone .pa button{width:44px;padding:0}'
      + '#setphone .pa button.hide{width:64px;' + kit('tin_dark', 0.75) + 'color:#f0e2c4}';
  };

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function build() {
    if (H.el || !document.body) return H.el;
    var st = document.createElement('style'); st.id = 'bohphone-css'; st.textContent = CSS(); document.head.appendChild(st);
    var ph = el('div'); ph.id = 'bohphone'; ph.setAttribute('role', 'group'); ph.setAttribute('aria-label', 'your phone');
    ph.innerHTML = '<div class="scr"><canvas class="wall" aria-hidden="true"></canvas><div class="dim"></div>'
      + '<div class="stat"><span class="wh"></span><button type="button" class="tl" aria-label="switch timeline">TIMELINE</button></div>'
      + '<div class="home"></div>'
      + '<div class="page" data-page=""><div class="ph" role="button" tabindex="0"><i>&lsaquo;</i><span></span></div><div class="pb"></div></div>'
      + '<div class="fight" aria-label="your fight"><div class="fh"><canvas width="44" height="44"></canvas><b></b></div>'
      +   '<button type="button" class="fgo" data-c="go"><span class="mk"></span><b>END TURN</b><i></i></button>'
      +   '<div class="fcm" role="toolbar" aria-label="the fight">'
      +     '<button type="button" class="fc" data-c="wait" aria-label="wait"><img alt="" src="' + IMG('app_wait') + '"><i></i></button>'
      +     '<button type="button" class="fc" data-c="flee" aria-label="retreat"><img alt="" src="' + IMG('app_retreat') + '"><i></i></button>'
      +     '<button type="button" class="fc" data-c="auto" aria-label="auto"><img alt="" src="' + IMG('app_auto') + '"><span class="tint"></span><i></i></button>'
      +     '<button type="button" class="fc sp" data-c="speed" aria-label="the fight\'s speed">1x</button></div>'
      +   '<div class="ab"></div><div class="frow" role="toolbar" aria-label="your apps in the fight"></div></div>'
      + '<div class="cmb" aria-hidden="true"><img alt="" src="' + IMG('app_combat') + '"><b>COMBAT</b></div>'
      + '<div class="glass"></div></div>'
      + '<div class="case"></div><img class="ear" alt="" src="' + IMG('ear') + '">';
    /* a finger on the phone is a finger on the phone: nothing under it hears it */
    ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'click', 'wheel', 'dblclick', 'contextmenu'].forEach(function (k) {
      ph.addEventListener(k, function (e) { e.stopPropagation(); if (k === 'contextmenu') e.preventDefault(); }, { passive: k !== 'contextmenu' });
    });
    document.body.appendChild(ph);
    H.el = ph; H.scr = ph.querySelector('.scr');
    ph.querySelector('.page .ph').addEventListener('click', function () { pageClose(); });
    ph.querySelector('.stat').addEventListener('click', function () { if (H.page) pageClose(); });
    ph.querySelector('.stat .tl').addEventListener('click', function (e) { e.stopPropagation(); var cw = cityWin(); try { cw.BohemiaPhone.P.timeline(true); window.__PHONE_TIMELINE = (window.__PHONE_TIMELINE | 0) + 1; } catch (x) {} });
    /* a finger held on the home (not on an app) opens the phone's settings */
    var home = ph.querySelector('.home'), ht = 0;
    home.addEventListener('pointerdown', function (e) { if (e.target.closest && e.target.closest('.app, .bpfd, .lv, .jc')) return; clearTimeout(ht); ht = setTimeout(settingsOpen, 600); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (k) { home.addEventListener(k, function () { clearTimeout(ht); }); });
    homeBuild();
    /* in a fight the same small icons ride under his abilities: the fight's own bar answers them (238(a)) */
    ['crew', 'notes', 'settings'].forEach(function (a) { ph.querySelector('.frow').appendChild(appButton(a, 'sm')); });
    /* the fight's commands press the fight's own buttons (rule 238(a)) */
    [].forEach.call(ph.querySelectorAll('.fight [data-c]'), function (b) { b.addEventListener('click', function () {
      var fw = fightWin(), F = fw && fw.BohemiaPhone && fw.BohemiaPhone.P; if (!F || !F.cmd) return;
      F.cmd(b.dataset.c); setTimeout(function () { fightPaint(true); }, 80);
    }); });
    return ph;
  }

  /* ---- THE HOME (rules 232, 238, 286): one size, top to bottom: his jobs (the main quest's slot, the jobs he holds, the empty
     ready slots), the city's feed moving (a tap is all of it), PLAY/PAUSE and HEAL side by side, the place's band (the hour on the
     map and at camp, LEAVE in a town), and one row of small icons he orders: CREW, RELATIONS, NOTES, SETTINGS ---- */
  function appButton(a, cls) {
    var b = el('button', 'app ' + cls); b.type = 'button'; b.dataset.app = a;
    b.setAttribute('aria-label', a === 'play' ? 'play or pause' : LABEL[a].toLowerCase());
    b.innerHTML = '<img alt="" src="' + IMG(a === 'play' ? 'app_play' : 'app_' + a) + '"><span class="lab">' + LABEL[a] + '</span>' + (a === 'play' ? '<span class="mark"></span>' : '')
      + (a === 'heal' ? '<canvas class="rg" aria-hidden="true" width="132" height="141"></canvas>' : '');
    b.addEventListener('click', function () { if (H.holdFired === b) { H.holdFired = null; return; } appPress(a); });   /* the held press's own click is the hold's */
    b.addEventListener('pointerdown', function () { H.holdFired = null; });
    if (a === 'play') {   /* a held finger opens the speeds */
      var t = 0;
      b.addEventListener('pointerdown', function () { clearTimeout(t); t = setTimeout(function () { H.holdFired = b; pageOpen('speeds'); }, 550); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (k) { b.addEventListener(k, function () { clearTimeout(t); }); });
    }
    return b;
  }
  function rowApps() { var c = H.cfg; return c.order.filter(function (a) { return c.hidden.indexOf(a) < 0; }); }
  function homeBuild() {
    var home = H.el.querySelector('.home'); home.textContent = '';
    var jb = el('div', 'jobs'); jb.setAttribute('role', 'list'); jb.setAttribute('aria-label', 'the main quest and the jobs you are on');
    jb.innerHTML = '<div class="mq" role="listitem" aria-label="the main quest\'s place"></div>'; home.appendChild(jb);
    var fd = el('div', 'bpfd'); fd.setAttribute('role', 'button'); fd.setAttribute('tabindex', '0'); fd.setAttribute('aria-label', 'the city\'s feed: tap for all of it');
    fd.addEventListener('click', function () { H.presses++; window.__PHONE_PRESSES = H.presses; pageOpen('feed'); }); home.appendChild(fd);
    var two = el('div', 'bptwo'); two.appendChild(appButton('play', 'big')); two.appendChild(appButton('heal', 'big')); home.appendChild(two);
    var ctx = el('div', 'bpctx');
    ctx.innerHTML = '<div class="clk" aria-hidden="true"><b>--:--</b><i class="g"></i></div>'   /* the hour once, here (the bar keeps the day: THE DAYS ONCE, rules 121(g), 123) */
      + '<button type="button" class="lv" aria-label="leave"><img alt="" src="' + IMG('app_leave') + '"><span>LEAVE</span></button>';   /* draft:true */
    ctx.querySelector('.lv').addEventListener('click', function () { appPress('leave'); });
    home.appendChild(ctx);
    var row = el('div', 'bprow'); row.setAttribute('role', 'toolbar'); row.setAttribute('aria-label', 'your apps');
    rowApps().forEach(function (a) { row.appendChild(appButton(a, 'sm')); });
    home.appendChild(row);
    H.homeSig = null; H.jobSig = null; H.stripSig = null;
  }

  function appPress(a) {
    H.presses++; window.__PHONE_PRESSES = H.presses;
    var cw = cityWin(), L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P;
    var scr = H.state.screen; try { scr = whichScreen() || scr; } catch (e) {}   /* where he is at the press, not a beat ago (a town just closed is the map) */
    if (a === 'play') { if (L && scr === 'map') { L.play(H.sel); paintHome(true); } return; }
    if (a === 'crew') { if (H.page) pageClose(); var Bc = barOf(scr); if (Bc && (scr === 'map' || scr === 'town' || scr === 'camp' || scr === 'fight')) Bc.barPress('crew'); return; }
    /* rule 238(a): the bar's NOTES and its gear, and the town's LEAVE, pressed here: the very same buttons of the screen he is on,
       hidden under the phone's rule (no button twice, 286(b)); a fight's own bar answers in a fight */
    if (a === 'notes' || a === 'settings') { if (H.page) pageClose(); var B = barOf(scr); if (!(B && B.barPress(a === 'notes' ? 'notes' : 'gear')) && a === 'settings') settingsOpen(); return; }
    if (a === 'leave') { if (L && scr === 'town') L.leave(); setTimeout(tick, 60); return; }
    if (a === 'heal' || a === 'camp') { if (L && (scr === 'map' || scr === 'camp' || scr === 'town')) { L.camp(); setTimeout(tick, 60); } return; }   /* CAMP [a town is safe] (rule 273(b)): HEAL in a town rests there */
    if (a === 'relations') { if (H.page === a) pageClose(); else pageOpen(a); return; }
  }

  /* ---- THE APPS' OWN PAGES, on the phone's own glass ---- */
  function pageOpen(which) {
    var pg = H.el.querySelector('.page'); H.page = which; pg.dataset.page = which; pg.classList.add('on');
    H.el.querySelector('.home').classList.add('under');
    pg.querySelector('.ph span').textContent = which === 'speeds' ? 'SPEED' : LABEL[which];
    pagePaint(true);
  }
  function pageClose() { var pg = H.el.querySelector('.page'); pg.classList.remove('on'); pg.dataset.page = ''; H.page = null; H.el.querySelector('.home').classList.remove('under'); }
  function pagePaint(fresh) {
    if (!H.page) return;
    var pb = H.el.querySelector('.page .pb'), cw = cityWin(), L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P;
    if (H.page === 'feed') {
      var posts = (L ? L.posts() : []).concat((H.own || []).filter(function (o) { return Date.now() - o.t < 120000; }).reverse()), sig = posts.length + '|' + (posts.length ? posts[posts.length - 1].txt : '') + '|' + nameGet() + '|' + (H.feedKind || '');
      if (!fresh && sig === H.feedSig) return; H.feedSig = sig;
      if (pb.querySelector('input')) return;   /* never under his thumbs while he types the name */
      var co = L ? L.company() : { men: 0 };
      if (H.feedKind) posts = posts.filter(function (p) { return p.kind === H.feedKind; });
      var KD = [['mine', 'app_crew', 'yours'], ['world', 'app_relations', 'the world\'s'], ['life', 'app_feed', 'the valley\'s talk']];
      var h = '<div class="kf" role="group" aria-label="which posts">' + KD.map(function (k) { return '<button type="button" data-kind="' + k[0] + '" aria-label="' + k[2] + '" aria-pressed="' + (H.feedKind === k[0]) + '"' + (H.feedKind === k[0] ? ' class="on"' : '') + '><img alt="" src="' + IMG(k[1]) + '"></button>'; }).join('') + '</div>'
        + '<div class="co"><span class="nm" role="textbox" tabindex="0" aria-label="your company\'s name: tap to type">' + esc(nameGet()) + '<u>TYPE</u></span>'
        + '<span class="sub">' + (co.men ? co.men + (co.men === 1 ? ' MAN' : ' MEN') : 'YOUR COMPANY') + (co.clout != null ? ' &middot; CLOUT ' + esc(co.clout) : '') + '</span></div>';
      for (var i = posts.length - 1; i >= 0; i--) { var p = posts[i];
        h += '<div class="po' + (p.kind === 'mine' ? ' mine' : '') + (p.re ? ' re' : '') + '"><span class="w">' + esc(p.who) + (p.re ? ' <i>replying</i>' : '') + '</span><span class="t">' + esc(p.txt) + '</span></div>'; }
      if (!posts.length) h += '<div class="po"><span class="t">Nothing yet. The valley is quiet.</span></div>';   /* draft:true */
      pb.innerHTML = h;
      pb.querySelector('.nm').addEventListener('click', renameStart);
      pb.querySelector('.nm').addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); renameStart(); } });
      [].forEach.call(pb.querySelectorAll('.kf button'), function (b) { b.addEventListener('click', function () { H.feedKind = H.feedKind === b.dataset.kind ? null : b.dataset.kind; H.feedSig = null; pagePaint(true); }); });
    } else if (H.page === 'relations') {
      if (!fresh && H.relAt && performance.now() - H.relAt < 2000) return; H.relAt = performance.now();
      pb.innerHTML = relationsHtml(L);
    } else if (H.page === 'speeds') {
      var s = L ? L.state() : { speeds: [], speed: 0, last: 0 };
      var hs = '<div class="spd">' + s.speeds.map(function (n) { return '<button type="button" data-n="' + n + '" class="' + (n === (s.speed || s.last) ? 'now' : '') + '">' + n + 'x</button>'; }).join('')
        + (s.speeds.length <= 1 ? '<p>One speed on the map for now.</p>' : '') + '</div>';   /* draft:true; rule 151(c) */
      pb.innerHTML = hs;
      [].forEach.call(pb.querySelectorAll('button'), function (b) { b.addEventListener('click', function () { if (L) { L.speed(+b.dataset.n); } pageClose(); paintHome(true); }); });
    }
  }
  function renameStart() {
    var nm = H.el.querySelector('.co .nm'); if (!nm) return;
    var inp = document.createElement('input'); inp.type = 'text'; inp.maxLength = 22; inp.value = nameGet(); inp.setAttribute('aria-label', 'your company\'s name');
    inp.setAttribute('autocapitalize', 'characters'); inp.setAttribute('enterkeyhint', 'done');
    nm.replaceWith(inp); inp.focus(); try { inp.select(); } catch (e) {}
    var done = false, fin = function (keep) {
      if (done) return; done = true;
      var was = nameGet(), v = keep ? nameSet(inp.value) : null;
      if (v && v !== was) {
        var cw = cityWin(), L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P;
        var own = { who: '@' + v.toLowerCase().replace(/[^a-z0-9]+/g, ''), txt: 'We go by ' + v + ' now. Remember it.', kind: 'mine', draft: true, t: Date.now() };   /* draft:true */
        if (L) L.post(own);
        H.own = [own].concat(H.own || []).slice(0, 3);   /* on top of the FEED until the engine says something newer (FEED: the 'bohemia-company-renamed' event) */
        try { var cw2 = cityWin(); if (cw2) cw2.dispatchEvent(new CustomEvent('bohemia-company-renamed', { detail: { from: was, to: v } })); } catch (e) {}
        window.__PHONE_RENAMES = (window.__PHONE_RENAMES | 0) + 1;
      }
      try { inp.remove(); } catch (e) {}
      H.feedSig = null; pagePaint(true);
    };
    inp.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') fin(true); else if (e.key === 'Escape') fin(false); });
    inp.addEventListener('blur', function () { fin(true); });
  }
  var BAND = { hostile: 'HOSTILE', threatening: 'THREATENING', unfriendly: 'UNFRIENDLY', cold: 'COLD', neutral: 'NEUTRAL', open: 'OPEN',
    friendly: 'FRIENDLY', very_friendly: 'VERY FRIENDLY', allied: 'ALLIED' };
  var BANDS = [['hostile', 9], ['threatening', 19], ['unfriendly', 29], ['cold', 39], ['neutral', 59], ['open', 69], ['friendly', 79], ['very_friendly', 89], ['allied', 100]];
  var BAND_INK = { hostile: '#ff6a52', threatening: '#ff8a5c', unfriendly: '#f0a066', cold: '#d8c08a', neutral: '#d8cdb0', open: '#cfe0a0', friendly: '#a8d890', very_friendly: '#8fd88a', allied: '#7fe0a0' };
  var WHY = { done: 'a job done', poor: 'a job half done', failed: 'a job failed', cancelled: 'a job dropped', betrayed: 'you turned on them',
    drink_for_patrons: 'a round at the bar' };   /* draft:true */
  function bandOf(v) { for (var i = 0; i < BANDS.length; i++) if (v <= BANDS[i][1] + 0.999) return BANDS[i][0]; return 'allied'; }
  function relationsHtml(L) {
    var bars = {}, why = {};
    try { bars = (JSON.parse(ls().getItem('bohemia.relations.v1') || 'null') || {}).bars || {}; } catch (e) {}
    try { why = JSON.parse(ls().getItem(WHYKEY) || '{}') || {}; } catch (e) {}
    var names = L ? L.towns() : []; Object.keys(bars).forEach(function (n) { if (names.indexOf(n) < 0) names.push(n); });
    var rows = names.map(function (n) { var met = Object.prototype.hasOwnProperty.call(bars, n); return { n: n, v: met ? +bars[n] : 50, met: met }; });
    rows.sort(function (a, b) { return (b.met - a.met) || (b.v - a.v) || (a.n < b.n ? -1 : 1); });
    if (!rows.length) return '<div class="rel"><span class="why">You have met nobody yet.</span></div>';   /* draft:true */
    return rows.map(function (r) {
      var b = bandOf(r.v), w = (why[r.n] || [])[0], wt = '';
      if (w) { var d = (w.after != null && w.before != null) ? Math.round(w.after - w.before) : null; wt = (WHY[w.rel || w.act] || WHY[w.act] || String(w.rel || w.act || '').replace(/_/g, ' ')) + (d ? ' (' + (d > 0 ? '+' : '') + d + ')' : ''); }
      else if (!r.met) wt = 'never met';   /* draft:true */
      return '<div class="rel"><b>' + esc(String(r.n).toUpperCase()) + '</b><span class="bd" style="color:' + BAND_INK[b] + '">' + BAND[b] + ' ' + Math.round(r.v) + '</span>'
        + (wt ? '<span class="why">' + esc(wt) + '</span>' : '') + '</div>';
    }).join('');
  }

  /* ---- THE JOB COLUMN (rules 227 and 228): the main quest's slot first and always kept; then the jobs he is on, each a
     receipt with its what, its red stars, where, its time there and back, and an X; the X asks once with the town board's
     own cost (rule 197), DROP drops it, a tap anywhere else on the card keeps it; a tap on a card makes it PLAY's job ---- */
  function timeWord(j) {
    if (j.mins == null) return '';
    var h = j.mins / 60, w = h < 1 ? '<1H' : h < 24 ? Math.round(h) + 'H' : Math.round(h / 24) + 'D';
    return w + (j.back ? ' THERE+BACK' : '');   /* draft:true; rule 222(b) in a phone's words */
  }
  function jobCard(j, L) {
    var armed = H.arm && H.arm.id === j.id, d = el('div', 'jc' + (H.sel === j.id ? ' sel' : '') + (armed ? ' arm' : ''));
    d.setAttribute('role', 'listitem'); d.dataset.job = j.id;
    if (!armed) {
      d.innerHTML = '<span class="dir" aria-hidden="true"><svg viewBox="0 0 12 12" width="12" height="12"><path d="M6 0.6 L10.6 11 L6 8.4 L1.4 11 Z"/></svg></span>'
        + '<div class="tx"><span class="wh"></span><span class="mt"><span class="st"></span><span class="pl"></span></span></div>'
        + '<button type="button" class="x" aria-label="drop this job"><img alt="" src="' + IMG('app_x') + '"></button>';
      /* what and where on the first line (the place may clip), the stars and the time on the second (never clipped) */
      d.querySelector('.wh').textContent = j.what + ' \u00b7 ' + String(j.at || j.from).toUpperCase();
      d.querySelector('.st').textContent = new Array(Math.max(1, Math.min(5, j.stars)) + 1).join('\u2605');
      d.querySelector('.pl').textContent = timeWord(j);
      var dv = d.querySelector('.dir'); if (j.deg == null) dv.classList.add('here'); else { dv.style.transform = 'rotate(' + j.deg + 'deg)'; dv.dataset.deg = j.deg; }   /* which way (238(d)); a dot when he is on it */
      d.setAttribute('aria-label', j.what + ', ' + j.stars + ' stars, ' + String(j.at || j.from) + (timeWord(j) ? ', ' + timeWord(j).toLowerCase() : ''));
      d.querySelector('.x').addEventListener('click', function (e) { e.stopPropagation(); H.arm = { id: j.id, cost: L ? L.dropCost(j.id) : null, why: null }; jobsPaint(L, true); });
      d.addEventListener('click', function () { H.sel = j.id; jobsPaint(L, true); });
    } else {
      var c = H.arm.cost, pl = c && c.place ? String(c.place) : '', line = H.arm.why === 'fighting' ? 'Not in its own fight.'
        : pl ? 'Drop it: the ' + pl.charAt(0).toUpperCase() + pl.slice(1).toLowerCase() + ' like you less.' : 'Drop it: nobody pays.';   /* draft:true */
      d.innerHTML = '<div class="tx"><span class="wh"></span></div>' + (H.arm.why === 'fighting' ? '' : '<button type="button" class="dr">DROP</button>');
      d.querySelector('.wh').textContent = line; d.querySelector('.wh').style.whiteSpace = 'normal';
      var dr = d.querySelector('.dr');
      if (dr) dr.addEventListener('click', function (e) { e.stopPropagation(); var r = L ? L.drop(j.id) : null;
        if (r && r.ok) { H.arm = null; window.__PHONE_DROPPED = (window.__PHONE_DROPPED || []).concat([{ id: j.id, line: r.line }]).slice(-10); }
        else if (H.arm) H.arm.why = (r && r.why) || 'none';
        jobsPaint(L, true); });
      d.addEventListener('click', function () { H.arm = null; jobsPaint(L, true); });   /* a tap anywhere else keeps it */
    }
    return d;
  }
  function jobsPaint(L, force) {
    var jb = H.el.querySelector('.home .jobs'); if (!jb) return;
    var js = L ? L.jobs() : [];
    if (H.sel && !js.some(function (j) { return j.id === H.sel; })) H.sel = null;
    if (!H.sel && js.length) H.sel = js[0].id;
    if (H.arm && !js.some(function (j) { return j.id === H.arm.id; })) H.arm = null;
    var sig = js.map(function (j) { return j.id + j.stars + j.mins + j.what + j.at + '@' + j.deg; }).join('|') + '|' + H.sel + '|' + (H.arm ? H.arm.id + H.arm.why : '');
    window.__PHONE_JOBS = js.map(function (j) { return j.id; });
    if (!force && sig === H.jobSig) return; H.jobSig = sig;
    [].slice.call(jb.querySelectorAll('.jc, .je')).forEach(function (n) { n.remove(); });
    jb.classList.toggle('asking', !!H.arm);
    js.slice(0, 2).forEach(function (j) { jb.appendChild(jobCard(j, L)); });
    /* rule 232(a): every slot he does not fill reads EMPTY, READY TO GO: a plain empty slot, never an offer */
    for (var e = Math.min(2, js.length); e < 2; e++) { var je = el('div', 'je'); je.setAttribute('role', 'img'); je.setAttribute('aria-label', 'an empty job slot, ready to go'); jb.appendChild(je); }
  }

  /* ---- THE HEAL RING (rules 226(c), 232(b)): ONE gauge of the company, bent round the cross: from the top, clockwise, the
     company's blood in red over its share (its hitpoints over the hitpoints and armour together), then the dark of what blood is
     missing, then its armour in grey over the armour's share, then the dark of what armour is missing (CAMP's bar, the same
     numbers, the same order: BohemiaMapCamp.condition()); lit from the kit's sun, upper left ---- */
  function ringPaint(cv, cd) {
    if (!cv) return;
    var k = Math.max(1, Math.min(4, (window.devicePixelRatio || 1) * ((H.state.rect && H.state.rect.scale) || 1))), r = cv.getBoundingClientRect();
    var W = Math.max(8, Math.round((r.width || 44) * k / ((H.state.rect && H.state.rect.scale) || 1))), Hh = Math.max(8, Math.round((r.height || 47) * k / ((H.state.rect && H.state.rect.scale) || 1)));
    if (cv.width !== W || cv.height !== Hh) { cv.width = W; cv.height = Hh; }
    var g = cv.getContext('2d'); g.clearRect(0, 0, W, Hh);
    if (!cd) return;
    var tot = Math.max(1e-9, (cd.hpMax || 0) + (cd.armMax || 0)), cx = RING.cx * W, cy = RING.cy * Hh, rr = (RING.ro + RING.ri) / 2 * W, lw = (RING.ro - RING.ri) * W * 0.78;
    var a0 = -Math.PI / 2, T = Math.PI * 2, seg = [[cd.hp / tot, ['#d9604a', '#b8352a', '#7e2014']], [(cd.hpMax - cd.hp) / tot, null], [cd.arm / tot, ['#d3d8d9', '#9aa0a2', '#686d6f']], [(cd.armMax - cd.arm) / tot, null]];
    g.lineWidth = lw; g.lineCap = 'butt';
    seg.forEach(function (sg) {
      var f = Math.max(0, Math.min(1, sg[0] || 0)); if (!f) return;
      var a1 = a0 + f * T;
      if (sg[1]) { var gr = g.createLinearGradient(cx - rr, cy - rr, cx + rr, cy + rr); gr.addColorStop(0, sg[1][0]); gr.addColorStop(0.5, sg[1][1]); gr.addColorStop(1, sg[1][2]);
        g.strokeStyle = gr; g.beginPath(); g.arc(cx, cy, rr, a0, a1, false); g.stroke(); }
      a0 = a1;
    });
  }
  try { fetch(BASE + 'phone/phone.json').then(function (x) { return x.json(); }).then(function (m) { var q = m && m.app_heal && m.app_heal.ring; if (q && q.ro > q.ri) { RING = q; try { paintHome(true); } catch (e) {} } }).catch(function () {}); } catch (e) {}

  /* ---- THE HOME'S FACE: the hour, the speed's mark, what each app can do here ---- */
  function paintHome(force) {
    var cw = cityWin(), L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P, s = L ? L.state() : null, scr = H.state.screen;
    var running = !!(s && s.speed > 0), mark = s ? (s.last || s.speed) : 0;
    jobsPaint(L, force);
    H.el.classList.toggle('tl', !!(L && L.timeline(false)));
    var cd = L ? L.condition() : null;
    var sig = [scr, running, mark, s && s.clock, s && s.day, s && s.place, s && s.camp, cd && [cd.hp, cd.hpMax, cd.arm, cd.armMax].join()].join('|');
    if (!force && sig === H.homeSig) return; H.homeSig = sig;
    var stW = H.el.querySelector('.stat .wh');
    if (s) stW.textContent = scr === 'camp' ? (s.campTown ? String(s.campTown).toUpperCase() : 'YOUR CAMP') : (s.place || '');   /* CAMP [a town is safe]: resting in a town, the town's name */
    var cx = H.el.querySelector('.home .bpctx'); if (cx) cx.classList.toggle('town', scr === 'town');   /* in a town the band is LEAVE */
    var k = H.el.querySelector('.home .clk');
    if (k && s) { k.querySelector('b').textContent = s.clock || '--:--';
      var g = k.querySelector('.g'); g.textContent = scr === 'map' ? (running ? 'GOING' : 'STOPPED') : scr === 'camp' ? 'RESTING' : scr === 'town' ? 'IN TOWN' : ''; g.classList.toggle('go', running && scr === 'map'); }   /* draft:true */
    [].forEach.call(H.el.querySelectorAll('.home .app'), function (b) {
      var a = b.dataset.app, off = false;
      if (a === 'play') {
        var im = b.querySelector('img'), want = IMG(running ? 'app_pause' : 'app_play'); if (im.getAttribute('src') !== want) im.setAttribute('src', want);
        b.setAttribute('aria-label', running ? 'pause' : 'play'); b.setAttribute('aria-pressed', running ? 'true' : 'false');
        b.querySelector('.mark').textContent = mark ? (Math.round(mark * 100) / 100) + 'x' : '';
        off = scr !== 'map';
      } else if (a === 'heal') {
        off = !(scr === 'map' || scr === 'camp' || scr === 'town');   /* CAMP [a town is safe] (rule 273(b)): HEAL in a town rests there */
        b.querySelector('.lab').textContent = scr === 'camp' ? 'BREAK CAMP' : 'HEAL';   /* draft:true; read by the aria label only: no word on it (232(b)) */
        var cd = L ? L.condition() : null, tot = cd ? Math.max(1, cd.hpMax + cd.armMax) : 1;
        ringPaint(b.querySelector('canvas.rg'), cd);
        if (cd) { b.dataset.blood = String(Math.round(cd.blood * 1000) / 1000); b.dataset.armour = String(Math.round(cd.armour * 1000) / 1000); b.title = (scr === 'camp' ? 'HEAL: break camp.  ' : 'HEAL: make camp.  ') + (cd.says || ''); }
        b.setAttribute('aria-label', (scr === 'camp' ? 'break camp' : 'heal: make camp') + (cd ? ', the company at ' + Math.round(100 * (cd.hp + cd.arm) / tot) + ' percent' : ''));
      }
      b.classList.toggle('off', off); b.setAttribute('aria-disabled', off ? 'true' : 'false');
    });
  }

  /* ---- THE WALLPAPER: the block he stands on, live (on the beat) ---- */
  function paintWall(force) {
    var now = performance.now(); if (!force && now - H.wallAt < BEAT) return; H.wallAt = now;
    var cv = H.el.querySelector('.wall'), r = H.scr.getBoundingClientRect(), d = window.devicePixelRatio || 1;
    var w = Math.max(1, Math.round(r.width * d)), h = Math.max(1, Math.round(r.height * d));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    var cw = cityWin(), L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P;
    var g = cv.getContext('2d'), what = false;
    if (L && H.state.screen !== 'fight') what = L.wall(g, w, h);
    H.wallWhat = what || null;
    if (!what) { g.fillStyle = '#0b0a08'; g.fillRect(0, 0, w, h); }
  }

  /* ---- THE FEED IS ON (rule 286(c)): the city's two newest posts on the face, the handle and the words, the newest stepping in
     on the beat (stop-motion); a tap is everything posted (286(d)) ---- */
  function stripPaint(force) {
    var fd = H.el.querySelector('.home .bpfd'); if (!fd) return;
    var cw = cityWin(), L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P;
    var posts = (L ? L.posts() : []).concat((H.own || []).filter(function (o) { return Date.now() - o.t < 120000; }));
    var two = posts.slice(-2).reverse(), sig = two.map(function (p) { return p.who + '|' + p.txt; }).join('||');
    if (!force && sig === H.stripSig) return;
    var was = H.stripTop; H.stripSig = sig; H.stripTop = two.length ? two[0].who + '|' + two[0].txt : null;
    fd.innerHTML = two.length ? two.map(function (p, i) { return '<div class="fp' + (p.kind === 'mine' ? ' mine' : '') + (i === 0 && was && was !== H.stripTop ? ' new' : '') + '"><b>' + esc(p.who) + '</b><span>' + esc(p.txt) + '</span></div>'; }).join('')
      : '<div class="fp"><span>The valley is quiet.</span></div>';   /* draft:true */
    if (was && was !== H.stripTop) window.__PHONE_STRIP = (window.__PHONE_STRIP | 0) + 1;
  }

  /* ---- THE FIGHT: combat time, then his abilities ---- */
  function fightIn() {
    pageClose();
    var c = H.el.querySelector('.cmb'), f = H.el.querySelector('.fight');
    f.classList.remove('on'); c.classList.remove('out'); c.classList.remove('on');
    void c.offsetWidth; c.classList.add('on');   /* restart the strike */
    H.el.querySelector('.home').style.visibility = 'hidden';
    H.fightKey = null; H.anim = (H.anim | 0) + 1; var me = H.anim;
    window.__PHONE_COMBAT = (window.__PHONE_COMBAT | 0) + 1;
    setTimeout(function () { if (me !== H.anim) return; c.classList.add('out'); f.classList.add('on'); fightPaint(true); }, BEAT * 3.5);
    setTimeout(function () { if (me !== H.anim) return; c.classList.remove('on'); c.classList.remove('out'); }, BEAT * 4.5);
  }
  function fightOut() {
    H.anim = (H.anim | 0) + 1; var me = H.anim;
    var c = H.el.querySelector('.cmb'), f = H.el.querySelector('.fight');
    f.classList.remove('on'); c.classList.remove('on'); c.classList.add('on'); c.classList.add('out');
    H.el.querySelector('.home').style.visibility = '';
    window.__PHONE_COMBAT_OUT = (window.__PHONE_COMBAT_OUT | 0) + 1;
    setTimeout(function () { if (me !== H.anim) return; c.classList.remove('on'); c.classList.remove('out'); }, BEAT);
    paintHome(true);
  }
  function fightPaint(force) {
    var fw = fightWin(), F = fw && fw.BohemiaPhone && fw.BohemiaPhone.P; if (!F) return;
    var A = F.abilities(), C = F.cmds ? F.cmds() : null, key = A.key + '#' + (C ? JSON.stringify(C) : '');
    if (!force && key === H.fightKey) return; H.fightKey = key;
    cmdPaint(C);
    window.__PHONE_ABILITIES = A.list.length;
    var hd = H.el.querySelector('.fh'), fc = hd.querySelector('canvas');
    hd.querySelector('b').textContent = A.name || '';
    try { var g0 = fc.getContext('2d'); g0.clearRect(0, 0, 44, 44); if (A.face && A.face.width) { g0.imageSmoothingEnabled = false; g0.drawImage(A.face, 0, 0, 44, 44); } } catch (e) {}
    var ab = H.el.querySelector('.ab'); ab.textContent = '';
    A.list.slice(0, 12).forEach(function (a, i) {
      var b = el('button', 'sk' + (a.on ? ' on' : '')); b.type = 'button'; b.disabled = a.off; b.title = a.title; b.setAttribute('aria-label', a.title.toLowerCase());
      var c = document.createElement('canvas'); c.width = 52; c.height = 52;
      try { if (a.cv && a.cv.width) { var g = c.getContext('2d'); g.drawImage(a.cv, 0, 0, 52, 52); } } catch (e) {}
      b.appendChild(c); if (a.ap) { var t = el('i'); t.textContent = a.ap; b.appendChild(t); }
      b.addEventListener('click', function () { F.press(i); setTimeout(function () { fightPaint(true); }, 80); });
      ab.appendChild(b);
    });
    var empty = Math.max(0, (A.list.length ? 0 : 4));
    if (!A.list.length) { var n = el('div', 'none'); n.textContent = 'No skills on this man yet. A level brings a perk.'; ab.appendChild(n); }   /* draft:true */
    for (var k = 0; k < empty; k++) { var w = el('button', 'sk'); w.type = 'button'; w.disabled = true; w.setAttribute('aria-label', 'empty'); ab.appendChild(w); }
  }

  /* the fight's commands as the fight has them now: the big button's word, its chance or AP under it and its mark (the walk,
     the shot, the blow), lit amber when it will do a thing; WAIT; RETREAT armed or ending the fight; AUTO on, its odds tint and
     its glow; the speed */
  function cmdPaint(C) {
    var f = H.el.querySelector('.fight'); f.classList.toggle('nocmd', !C); if (!C) return;
    var go = f.querySelector('.fgo'), mk = go.querySelector('.mk');
    go.querySelector('b').textContent = C.go.label || 'END TURN';
    go.querySelector('i').textContent = C.go.sub || '';
    go.disabled = C.go.off; go.classList.toggle('hot', C.go.hot);
    go.setAttribute('aria-label', (C.go.label + ' ' + C.go.sub).trim().toLowerCase());
    go.classList.toggle('mkd', !!C.go.mark); mk.style.backgroundImage = C.go.mark || '';
    var q = function (c) { return f.querySelector('.fc[data-c=' + c + ']'); };
    var wt = q('wait'); wt.disabled = C.wait.off; wt.classList.toggle('on', C.wait.run);
    wt.querySelector('i').textContent = C.wait.run ? 'RUN DOWN' : ''; wt.setAttribute('aria-label', (C.wait.label || 'wait').toLowerCase());   /* draft:true */
    var fl = q('flee'); fl.disabled = C.flee.off; fl.classList.toggle('on', C.flee.arm); fl.classList.toggle('end', C.flee.end);
    fl.querySelector('i').textContent = C.flee.end ? 'SPARE' : ''; fl.setAttribute('aria-label', (C.flee.label || 'retreat').toLowerCase());   /* draft:true */
    var au = q('auto'); au.classList.toggle('on', C.auto.on); au.classList.toggle('glow', C.auto.glow);
    au.querySelector('.tint').style.backgroundColor = C.auto.tint || ''; au.querySelector('i').textContent = C.auto.odds ? 'FINISH' : '';   /* draft:true */
    var sp = q('speed'); sp.textContent = C.speed.label || '1x'; sp.classList.toggle('now', C.speed.now); sp.disabled = C.speed.off;
  }

  /* ---- THE SETTINGS: in the game's own card, and from a held finger on the phone ---- */
  function settingsRows() {
    var card = document.getElementById('setcard'); if (!card) return false;
    var box = document.getElementById('setphone');
    if (!box) { box = el('div'); box.id = 'setphone';
      var anchor = card.querySelector('#setbright') ? card.querySelector('#setbright').parentNode : null;
      if (anchor && anchor.nextSibling) card.insertBefore(box, anchor.nextSibling); else card.appendChild(box); }
    var c = H.cfg;
    var h = '<div class="seth">THE PHONE</div>'
      + '<div class="setrow"><span class="setlab">CORNER</span><div class="pside"><button type="button" data-side="left"' + (c.side === 'left' ? ' class="now"' : '') + '>LEFT</button>'
      + '<button type="button" data-side="right"' + (c.side !== 'left' ? ' class="now"' : '') + '>RIGHT</button></div></div>';
    c.order.forEach(function (a, i) {
      var hid = c.hidden.indexOf(a) >= 0;
      h += '<div class="pa' + (hid ? ' hid' : '') + '" data-a="' + a + '"><img alt="" src="' + IMG(a === 'play' ? 'app_play' : 'app_' + a) + '"><span>' + LABEL[a] + '</span>'
        + '<button type="button" data-do="up" aria-label="move ' + LABEL[a].toLowerCase() + ' up"' + (i === 0 ? ' disabled' : '') + '>&uarr;</button>'
        + '<button type="button" data-do="down" aria-label="move ' + LABEL[a].toLowerCase() + ' down"' + (i === c.order.length - 1 ? ' disabled' : '') + '>&darr;</button>'
        + (KEEP.indexOf(a) >= 0 ? '<button type="button" class="hide" disabled title="always on the phone">ALWAYS</button></div>'   /* draft:true */
          : '<button type="button" class="hide" data-do="hide">' + (hid ? 'SHOW' : 'HIDE') + '</button></div>');
    });
    box.innerHTML = h;
    [].forEach.call(box.querySelectorAll('[data-side]'), function (b) { b.addEventListener('click', function () { setSide(b.dataset.side); settingsRows(); }); });
    [].forEach.call(box.querySelectorAll('.pa button'), function (b) { b.addEventListener('click', function () {
      var a = b.closest('.pa').dataset.a, o = H.cfg.order.slice(), i = o.indexOf(a), hd = H.cfg.hidden.slice();
      if (b.dataset.do === 'up' && i > 0) { o.splice(i, 1); o.splice(i - 1, 0, a); }
      else if (b.dataset.do === 'down' && i < o.length - 1) { o.splice(i, 1); o.splice(i + 1, 0, a); }
      else if (b.dataset.do === 'hide' && KEEP.indexOf(a) < 0) { var j = hd.indexOf(a); if (j >= 0) hd.splice(j, 1); else if (hd.length < APPS.length - 1) hd.push(a); }
      setApps(o, hd); settingsRows();
    }); });
    return true;
  }
  function settingsOpen() {
    try { if (window.BohemiaSettings && BohemiaSettings.open) { BohemiaSettings.open(); settingsRows(); var b = document.getElementById('setphone'); if (b && b.scrollIntoView) b.scrollIntoView({ block: 'start' }); return true; } } catch (e) {}
    return false;
  }
  function setSide(side) {
    H.cfg.side = side === 'left' ? 'left' : 'right'; cfgSave(H.cfg);
    window.__PHONE_FLIPS = (window.__PHONE_FLIPS | 0) + 1;
    tick();   /* the phone, every frame's variables and every camera, at once */
  }
  function setApps(order, hidden) { H.cfg.order = order; H.cfg.hidden = hidden; cfgSave(H.cfg); if (H.el) { homeBuild(); paintHome(true); } }

  /* ---- THE BEAT OF THE HOST: where the phone is, what it shows, and every frame told ---- */
  function tick() {
    var on = false, scr = null;
    try { scr = whichScreen(); on = !!scr; } catch (e) { on = false; scr = null; }
    if (!on && !H.el) return;   /* nothing is built until the game is on the glass (a bench page never pays for a phone) */
    if (!build()) return;
    var W = innerWidth, Hh = innerHeight, g = geomFor(W, Hh, H.cfg.side, insets(document));
    var ph = H.el;
    if (!H.z) H.z = document.getElementById('setwrap') ? 60 : 70;   /* under the shell's settings card; over a lone map's town */
    /* the clouds a fight comes through never swallow the phone: it is the one thing that stays where it is (213(a)) */
    var z = H.z; try { var cl = document.getElementById('nfclouds'); if (cl && +getComputedStyle(cl).opacity > 0.02) z = 999994; } catch (e) {}
    if (ph.style.zIndex !== String(z)) ph.style.zIndex = String(z);
    ph.style.left = g.left + 'px'; ph.style.top = g.top + 'px'; ph.style.transform = g.scale === 1 ? '' : 'scale(' + g.scale + ')';
    ph.classList.toggle('on', on); ph.classList.toggle('left', H.cfg.side === 'left'); ph.dataset.screen = scr || '';
    /* the game's settings card over everything: the phone shows where it now stands (the flip, at once) but takes no press */
    var sw = document.getElementById('setwrap'), setOn = !!sw && sw.classList.contains('on');
    ph.classList.toggle('behind', setOn);
    var was = H.state.screen;
    H.state = { on: on, side: H.cfg.side, screen: scr, rect: g };
    frames(window).forEach(function (w) { try { if (w.BohemiaPhone && w.BohemiaPhone._paint) w.BohemiaPhone._paint(H.state); } catch (e) {} });
    /* the face: his abilities while the fight is on; the apps the moment it is won or lost, and everywhere else */
    var over = false; if (scr === 'fight') { try { var fw0 = fightWin(); over = !!(fw0 && fw0.BohemiaPhone && fw0.BohemiaPhone.P.over()); } catch (e) {} }
    var face = scr === 'fight' && !over ? 'fight' : 'home';
    if (face !== H.face) { if (face === 'fight') fightIn(); else if (H.face === 'fight') fightOut(); H.face = face; }
    if (!on) return;
    if (face === 'fight') { if (H.el.querySelector('.fight.on')) fightPaint(false); return; }
    paintHome(false); paintWall(false); stripPaint(false);
    if (H.page) pagePaint(false);
  }

  /* ---- every page: answer the rectangle; the host also draws ---- */
  window.BOH_PHONE_RECT = rectHere;
  window.BohemiaPhone = {
    rect: rectHere, padding: paddingHere, openCentre: openCentre, host: function () { return HOST; }, isHost: IS_HOST,
    side: function () { return (LOCAL.state && LOCAL.state.side) || cfg().side; },
    setSide: function (s) { try { return HOST.BohemiaPhone && HOST.BohemiaPhone !== window.BohemiaPhone ? HOST.BohemiaPhone.setSide(s) : setSide(s); } catch (e) { return setSide(s); } },
    _paint: paintHere, P: P, APPS: APPS.slice(), name: window.BohemiaCompanyName,
    state: function () { return IS_HOST ? H.state : (LOCAL.state || null); },
    open: function (a) { if (IS_HOST && H.el) { if (a === 'settings') return settingsOpen(); pageOpen(a); return true; } return false; },
    press: function (a) { if (IS_HOST && H.el) { appPress(a); return true; } return false; },
    settings: function () { return IS_HOST ? settingsRows() : false; },
    /* for the gate: paint the wallpaper now and say what it shows */
    ring: function () { return RING; },   /* where the HEAL ring's track is on its picture (232(b)) */
    wall: function () { if (!IS_HOST || !H.el) return null; paintWall(true); var c = H.el.querySelector('.wall'); return { what: H.wallWhat, w: c.width, h: c.height }; }
  };
  if (IS_HOST) {
    window.BohemiaPhone.setSide = setSide;
    var boot = function () {
      tick(); setInterval(tick, 200);   /* tick builds the phone the first time the game is on the glass */
      window.addEventListener('resize', function () { tick(); if (H.el) paintWall(true); });
      window.addEventListener('orientationchange', function () { setTimeout(function () { tick(); if (H.el) paintWall(true); }, 60); });
      /* the gear's own card gains THE PHONE every time it opens */
      document.addEventListener('click', function (e) { var g = e.target && e.target.closest && e.target.closest('#gearbtn'); if (g) setTimeout(settingsRows, 0); }, true);
      var sw = document.getElementById('setwrap');
      if (sw) try { new MutationObserver(function () { if (sw.classList.contains('on')) settingsRows(); }).observe(sw, { attributes: true, attributeFilter: ['class'] }); } catch (e) {}
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  } else {
    /* a frame paints itself from the host's last word as soon as it loads (the host's beat also reaches it) */
    try { var hs = HOST.BohemiaPhone && HOST.BohemiaPhone.state && HOST.BohemiaPhone.state(); if (hs && hs.rect) paintHere(hs); } catch (e) {}
    window.addEventListener('resize', function () { try { if (LOCAL.state) paintHere(LOCAL.state); } catch (e) {} });
  }
})();
