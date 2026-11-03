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
                 chose kept as a small mark; a held finger brings up the speed slider under it, 1x 2x 4x (rule 311,
                 __HOLD_PLAY_SLIDE_THE_SPEED__); let go keeps the speed, saved
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
   AMENDED 11/2 (UI, Paolo 10/27 notes 4 and 6, asks 265, 270, 275): THE PHONE RUNS THE FIGHT. Every press of the fight was already
   here (238(a)); now the CREW is too: the turn strip (every face in the order, a tap that man's sheet) and the man's card (his face,
   a tap his sheet; his name, blood, armour, wind and AP), so the fight's strip and bar slide off the glass and the glass is the
   board. THE BEAT IS SEEN: on the fight's own clock, the phone's screen catches each beat at its rim, a heart monitor's trace in its
   status line spikes on it beside the round, and the board's edges darken red under the phone (records/BOHEMIA_THE_PHONE_RUNS_THE_FIGHT_11_2_26.md).

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
  /* COORDINATOR 11/3 (rule 357(a), Paolo again: 'remove all notes buttons everywhere, even the phone... from the top right to the
     phone, anything with the Notes button, remove it from the game'): NOTES is gone from the phone's row. */
  var APPS = ['crew', 'relations', 'settings'];
  var LABEL = { play: 'PLAY', heal: 'HEAL', crew: 'CREW', relations: 'RELATIONS', notes: 'NOTES', settings: 'SETTINGS', leave: 'LEAVE', feed: 'THE FEED' };   /* draft:true */
  var KEEP = ['settings', 'crew'];   /* UI 7 (rule 368): the bar carries no crew any more, so the phone's CREW is the one door and never hides */
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
    /* FINISHER 11/3 (ask line 133's hole, EYES R6: 'standing with a job the big button shows a pause sign and means go to the job'):
       the clock runs while he stands (RUN 10/26), so speed alone is not a journey; PAUSE is only for a journey under way (P.play) */
    try { o.going = !!TRAVEL; } catch (e) {}
    try { o.regular = +TRAVEL_CLOCK.regular || 1; o.pick = +TRAVEL_CLOCK.pick || 1; o.holdMs = +TRAVEL_CLOCK.holdMs || 350; } catch (e) {}   /* __HOLD_PLAY_SLIDE_THE_SPEED__ */
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
  P.pick = function (n) { try { return travelPick(n); } catch (e) { return false; } };   /* the slider's let-go: saved, the hold never starts the clock */
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
        out.push({ id: j.id, what: String((W && W[j.id]) || (j.rescue ? 'Get your men back' : '') || j.title || 'a job'),   /* draft:true; the full title stays the card's label (ask 154) */ full: String(j.title || ''), from: String(j.from || ''), at: at, stars: stars | 0, mins: mins, back: back, deg: deg, to: nx });
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
        if (r.length) return r.slice().reverse().map(function (x) { var h = String(x.handle || ''); return { who: h.charAt(0) === '@' ? h : '@' + h, txt: String(x.text || ''), kind: x.kind || 'world', re: !!x.reply_to, id: x.id, type: x.type || '', big: !!x.big }; });
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
    try { if (window.BohemiaHireLock && BohemiaHireLock.company) { var one = BohemiaHireLock.company(); if (one.length) o.men = one.length; } } catch (e) {}   /* ONE COMPANY (rule 327): the one list, never a man let go, never one counted twice */
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
  /* EVERY INTERACT BUTTON ON THE PHONE (UI 11/2 round 2, Paolo 11/2 note 9, ask 281: 'every interact button from combat to the city
     on the phone'): the company screen's DONE and its stash's tabs (the perk to pick, ALL, WEAPONS, ARMOUR..., SORT) are the phone's
     while the screen is up, read here and pressed through the screen's own buttons (one handler each; their copies step off the glass,
     286(b)). The men, their slots and the stash's pockets stay on the screen: they are the screen's own things, as a town's buildings */
  P.roster = function () {
    var d = document.getElementById('done'), t = document.getElementById('tabs'); if (!d || !t || !document.getElementById('bag')) return null;
    var ti = document.getElementById('title'), n = t.querySelector('.n');
    /* UI 7 (rule 369): who is picked, read off his own sheet (his name, trade and level, his XP, his kills, his trait's name): the phone
       says it, so the camp under the screen keeps his slots and him and fewer words */
    var cq = function (q) { var e = document.querySelector('#card ' + q); return e ? String(e.firstChild && e.firstChild.nodeType === 3 ? e.firstChild.nodeValue : e.textContent || '').replace(/\s+/g, ' ').trim() : ''; };
    var xi = document.querySelector('#card .xpbar i'), tr = cq('.trait');
    var man = { name: cq('.nm'), sub: cq('.sub'), tally: cq('.ktally'), trait: tr ? tr.split(/\s{2,}/)[0] : '', xp: xi ? (parseFloat(xi.style.width) || 0) / 100 : null };
    return { man: man, title: ti ? String(ti.textContent || '').replace(/\s+/g, ' ').trim() : '', n: n ? String(n.textContent || '').trim() : '',
      tabs: [].slice.call(t.querySelectorAll('button')).map(function (b, i) { return { i: i, t: String(b.textContent || '').replace(/\s+/g, ' ').trim(), on: b.classList.contains('on'), perk: b.id === 'pick' || b.classList.contains('perk'), off: !!b.disabled }; }) };
  };
  P.rosterPress = function (k) {
    try { var d = document.getElementById('done'), t = document.getElementById('tabs');
      var b = k === 'done' ? d : (t ? t.querySelectorAll('button')[k] : null); if (!b) return false; b.click(); window.__PHONE_ROSTER = (window.__PHONE_ROSTER | 0) + 1; return true; } catch (e) { return false; }
  };
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
  /* THE PHONE RUNS THE FIGHT (UI 11/2, Paolo 10/27 note 4: 'the phone's not fully [filled] up and you still have the bottom left of
     the screen for the characters... why can't they just go on the phone... all the real estate has to be justified'): the man on
     the fight's card (his face, his name, his blood, armour and wind with their numbers, his AP, the plate a man of theirs wears)
     and the turn strip (every face in the order, the one acting first), read off the fight's own HUD, which hud() keeps true */
  P.man = function () {
    var g = function (id) { return document.getElementById(id); };
    var bar = function (id) { var e = g(id); if (!e) return null; var n = String(e.style.getPropertyValue('--n') || '').replace(/"/g, '').trim().split(' ').pop();
      return { w: parseFloat(e.style.width) || 0, c: String(e.style.backgroundColor || e.style.background || ''), n: /\d\/\d/.test(n) ? n : '' }; };
    var ap = g('ap'), cl = g('cls'), r = g('round'), nm = g('cnm');
    return { name: nm ? String(nm.textContent || '').replace(/\s*\*$/, '') : '', main: !!nm && /\*$/.test(String(nm.textContent || '')), face: g('face'),
      hp: bar('bhp'), arm: bar('barm'), fat: bar('bfat'), ap: ap ? ap.querySelectorAll('i.on').length : 0, apTurn: ap ? ap.children.length : 0,
      cls: cl && cl.style.display !== 'none' ? String(cl.textContent || '').trim() : '', round: r ? String(r.textContent || '').trim() : '' };
  };
  /* his face on the phone is the fight's own card: one tap opens the man's sheet (the fight's drawer), a second closes it */
  P.card = function () { var c = document.getElementById('card'), d = document.getElementById('drawer'); if (!c) return false; if (d) d.dataset.peek = '';
    c.click(); window.__PHONE_CARD = (window.__PHONE_CARD | 0) + 1; return true; };
  /* a face in the turn strip: that man's sheet (the fight's own drawer, drawn by the fight), a second tap closes it */
  P.peek = function (id) {
    try {
      var v = FIGHT.byId(id), d = document.getElementById('drawer'); if (!v || !d || typeof drawer !== 'function') return false;
      if (d.style.display === 'block' && d.dataset.peek === String(id)) { d.style.display = 'none'; d.dataset.peek = ''; UI.drawer = false; UI.wcard = null; }
      else { UI.drawer = false; UI.wcard = null; drawer(v); d.dataset.peek = String(id); }
      window.__PHONE_PEEK = (window.__PHONE_PEEK | 0) + 1; return true;
    } catch (e) { return false; }
  };
  /* THE BEAT IS SEEN (UI 11/2, Paolo 10/27 note 6: 'the beat with no sound... the fight runs on a 120 BPM beat. The beat has to be
     visible too, like a pulse on screen'): the fight's own clock, never a second one (COMBAT's THE SONG IS THE CLOCK, rule 158:
     SONG.at a beat as heard on this page's clock, songBeat() the song's beat; the fight's own 120 from its start when no song plays),
     handed over as an absolute time so the phone's page reads it on its own clock */
  P.beat = function () {
    try { if (typeof SONG === 'undefined' || typeof songBeat !== 'function') return null; var ms = songBeat(); if (!(ms > 0)) return null;
      return { at: SONG.at + performance.timeOrigin, ms: ms, from: String(SONG.from || '') }; } catch (e) { return null; }
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
      /* THE PHONE RUNS THE FIGHT (UI 11/2, Paolo 10/27 note 4: 'all the real estate has to be justified'): the man's card and the turn
         strip are on the phone now, so the fight's strip and its bar leave the glass: they slide off its edges in two stopped steps
         (they transform, never just vanish, his ask 257), and the glass is the board. Moved off whole, never collapsed, so the fight's
         own measure (hudEdges: the strip's bottom, the bar's top) reads 0 at both edges and its camera frames the whole glass around
         the phone (rule 288) */
      + 'html.boh-phone-on body:has(#skills) #top{transform:translateY(-100%)!important;visibility:hidden;transition:transform .25s steps(2,end),visibility 0s linear .25s}'
      + 'html.boh-phone-on body:has(#skills) #bot{bottom:0!important;transform:translateY(100%)!important;visibility:hidden;transition:transform .25s steps(2,end),visibility 0s linear .25s}'
      /* what the bar used to hold up: the man's sheet and the fight's hint stand clear of the phone (upright over it, on its side beside it) */
      + '@media (orientation:portrait){html.boh-phone-on body:has(#skills) #drawer,html.boh-phone-on body:has(#skills) #say{bottom:calc(var(--boh-phone-gap-b) + 8px)!important}}'
      + '@media (orientation:landscape){html.boh-phone-on.boh-phone-right body:has(#skills) #drawer{right:calc(var(--boh-phone-gap-r) + 6px)!important}'
      +   'html.boh-phone-on.boh-phone-left body:has(#skills) #drawer{left:calc(var(--boh-phone-gap-l) + 6px)!important}'
      +   'html.boh-phone-on body:has(#skills) #say{max-width:calc(100vw - 2 * (var(--boh-phone-w) + 24px))!important}}'
      + 'html.boh-phone-on.boh-phone-right body:has(#skills) #bot{right:calc(var(--boh-phone-gap-r) + 6px)!important}'
      + 'html.boh-phone-on.boh-phone-left body:has(#skills) #bot{left:calc(var(--boh-phone-gap-l) + 6px)!important}'
      /* a computer keeps the bar centred clear of the phone on both sides; a tablet, like a phone, gives up only the phone's side (both
         sides on a tablet broke the wide glass's one-row bar: THE REBUILT FIGHT PLAYS) */
      + 'html.boh-phone-on[data-screen=computer] body:has(#skills) #bot{'
      +   'right:auto!important;left:50%!important;width:min(980px,calc(100vw - 24px - 2 * (var(--boh-phone-w) + 16px)))!important}'
      /* THE COMPANY SCREEN, one column under 700 wide: the stash's tabs and pockets stand beside the phone, never under it */
      + '@media (max-width:699px){html.boh-phone-on.boh-phone-right body:has(#bag) #stash{padding-right:calc(var(--boh-phone-gap-r) + 6px)!important}'
      +   'html.boh-phone-on.boh-phone-left body:has(#bag) #stash{padding-left:calc(var(--boh-phone-gap-l) + 6px)!important}'
      +   'html.boh-phone-on body:has(#bag) #tabs{flex-wrap:wrap!important;row-gap:3px}}'
      /* ask 281: the company screen's DONE and its stash's tabs are on the phone (the phone's YOUR COMPANY face); the stash's count stays */
      + 'html.boh-phone-on body:has(#bag) #done,html.boh-phone-on body:has(#bag) #tabs button{display:none!important}';
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
      /* UI 5 (ask 133(a): 'with the phone on the left the settings card's words sit under the ghosted phone'): the card is see-through
         paper, so a ghost under it muddied CREW, RELATIONS, NOTES and SETTINGS; behind the card the phone is gone, and a flip of the
         corner shows it where it now stands for three beats, then it goes again */
      + '#bohphone.behind{opacity:0;pointer-events:none;transition:opacity .25s steps(3,end)}#bohphone.behind.flipped{opacity:.35;transition:none}'
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
      /* __THE_DAY_ON_THE_PHONE__ (UI 7, rule 368: 'Do you wanna look at the time? Look at your phone'): the day and the hour are the
         phone's first line, on the right of the place, the way a phone's own status bar carries its clock; never in the fight (the
         round and the beat's trace are its line there, and the fight's clock does not run) */
      + '#bohphone .stat .wh{flex:0 1 auto;min-width:0}'
      + '#bohphone .stat .dt{flex:0 0 auto;margin-left:auto;white-space:pre;letter-spacing:.3px;color:#f4e8cc}'
      + '#bohphone .stat .dt:empty{display:none}#bohphone.fighting .stat .dt{display:none}'
      + '#bohphone .stat .wh+.dt{padding-left:4px}#bohphone.tl .stat .tl{margin-left:3px}'
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
      /* __THE_BOSS_VERB_ON_THE_PHONE__ (BOSSES 11/2, rule 302): on the map, where a verb a boss gave him works, the band is that verb */
      + '#bohphone .bpctx .vb{display:none;position:absolute;inset:0;width:100%;padding:0 6px;border:0;cursor:pointer;align-items:center;gap:6px;font:9px "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1.1px;color:#1f1710;' + kit('tin', 0.5) + ';box-shadow:inset 0 0 0 1px #f2c56a}'
      + '#bohphone .bpctx .vb img{width:20px;height:20px;flex:none;pointer-events:none}'   /* BOSSES FIX 11/3 (rule 338): the thing he handed you (his pot, his wrench, his filter) */
      + '@keyframes bohVerbLit{0%{filter:brightness(1.6)}50%{filter:brightness(.8)}100%{filter:none}}#bohphone .bpctx.verb .vb{animation:bohVerbLit ' + BEAT + 'ms steps(2,end) 2}'   /* it lights where it works, a tube coming on */
      + '#bohphone .bpctx .vb.off{opacity:.55;cursor:default}'
      + '#bohphone .bpctx.verb .vb{display:flex}#bohphone .bpctx.verb .clk{display:none}'
      + '#bohphone .bpfd{position:absolute;left:3px;right:3px;top:67px;height:46px;margin:0;overflow:hidden;cursor:pointer;padding:2px 3px;background:rgba(6,5,4,.66);box-shadow:inset 0 0 0 1px rgba(240,226,196,.14)}'
      /* COORDINATOR 11/3 (Paolo, his screenshot: 'the tweets are only taking up half the space they should'): the strip was cut for
         TWO posts (21 px each) and rule 329 made it ONE, so the one post sat in the top half and the bottom half was always empty.
         Now the one post owns the whole strip (rule 350) and its size is FITTED: the biggest type, 9 px down to 6 px, at which the
         handle and every word fit the box. A short post reads big; a 120-character post still shows every word. fitStrip() below. */
      + '#bohphone .bpfd .fp{height:100%;overflow:hidden;font-size:6.5px;line-height:7.5px;color:#ecdfc2}'
      + '#bohphone .bpfd .fp + .fp{border-top:1px solid rgba(240,226,196,.14);padding-top:1px}'
      + '#bohphone .bpfd .fp b{display:block;font-weight:400;color:#f6cf74;white-space:nowrap;overflow:hidden}'
      + '#bohphone .bpfd .fp.mine b{color:#9fd08a}'
      + '#bohphone .bpfd .fp span{display:block;overflow:hidden;overflow-wrap:break-word}'
      + '#bohphone .bpfd .fp.new{animation:bohIn ' + BEAT + 'ms steps(2,end)}'
      + '#bohphone .bpfd .fp.gone{animation:bphSink ' + Math.round(BEAT * 2 / 3) + 'ms steps(1,end) both}#bohphone .bpfd .fp.gone.done{animation:none;visibility:hidden;opacity:0}'   /* rule 329: read, then out */
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
      + '#bohphone .jc .tx{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;line-height:7.5px}'
      /* UI 5 (ask 154: 'Get your men ba'): the what wraps on whole words over two lines and the place keeps its own word, so nothing is cut
         mid-word; the card is the same 24 tall (two lines of the what and the line of stars at 7.5 each) */
      + '#bohphone .jc .wh{font-size:7px;white-space:normal;overflow:hidden;max-height:15px;overflow-wrap:normal;word-break:normal}'
      + '#bohphone .jc .wh .at{white-space:nowrap}'
      + '#bohphone .jc .mt{font-size:6px;white-space:nowrap;overflow:hidden;color:#4a3826}'
      + '#bohphone .jc{padding-top:0!important;padding-bottom:0!important}'
      /* UI 5 (ask 154: 'after two wipes the phone held three jobs and showed two'): a rescue is held past the two contracts (RUN's
         LOOP_MAX + 1), so with three the job column takes the feed's top 26 and the feed shows its one post in the 20 left */
      + '#bohphone .home.jobs3 .jobs{height:90px}#bohphone .home.jobs3 .bpfd{top:93px;height:20px}#bohphone .home.jobs3 .bpfd .fp{height:100%}'
      + '#bohphone .jc .st{color:#a3180c;letter-spacing:-.5px;margin-right:2px}'
      + '#bohphone .jc .x{flex:0 0 32px;width:32px;height:24px;margin:-1px -2px -1px 0;padding:0 0 0 10px;border:0;background:none;cursor:pointer}'   /* the X is 20 drawn, 32 by the card's height to a thumb */
      + '#bohphone .jc .x img{width:20px;height:21.4px;display:block;pointer-events:none}'
      + '#bohphone .jc.arm{flex:0 0 50px;background:#e8d6b4!important;color:#5a1408}'
      + '#bohphone .jobs.asking .jc:not(.arm),#bohphone .jobs.asking .je{display:none}'   /* while one asks, it has the column */
      + '#bohphone .jobs .je{flex:0 0 24px;opacity:.5;' + kit('well', 0.25) + '}'   /* an empty slot, ready to go (232(a)) */
      + '#bohphone .jc .dr{flex:0 0 44px;width:44px;height:44px;border:0;cursor:pointer;font:9px "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:.6px;color:#7a1206;' + kit('tin', 0.4) + '}'
      /* __TAP_A_QUEST_YOUR_PEOPLE_GO__ (UI 7, rule 376): the quest he is going to wears the mark: its arrow (or its dot) turns the
         sel bar's amber and beats while the party is on its road; a tap the map says no to shakes the card twice */
      + '#bohphone .jc.going .dir path{fill:#e8a83a;stroke:#1c140c;stroke-width:.9}'
      + '#bohphone .jc.going .dir svg,#bohphone .jc.going .dir.here::after{animation:bphGo ' + BEAT + 'ms steps(2,end) infinite}'
      + '#bohphone .jc.going .dir.here::after{background:#e8a83a;box-shadow:0 0 0 1px #1c140c}'
      + '#bohphone .jc.nogo,#bohphone .bpfd.nogo,#bohphone .po.nogo{animation:bphNo ' + Math.round(BEAT / 4) + 'ms steps(2,end) 4}'
      + '@keyframes bphGo{0%{transform:scale(1)}50%{transform:scale(1.35)}}'
      + '@keyframes bphNo{0%{translate:-2px 0}50%{translate:2px 0}}'
      + '#bohphone .app .mark{position:absolute;right:-3px;bottom:3px;padding:1px 4px 0 3px;font-size:7px;line-height:8px;color:#f6cf74;background:#1c140c;border-radius:1px;pointer-events:none}'
      + '#bohphone .clk{position:absolute;inset:0;display:flex;align-items:center;gap:6px;padding:0 3px;pointer-events:none;text-shadow:0 1px 0 #000,0 0 4px #000}'
      + '#bohphone .clk b{display:block;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;font-size:15px;line-height:16px;letter-spacing:.5px;color:#f4e8cc}'
      + '#bohphone .clk i{display:block;font-style:normal;font-size:7px;line-height:9px;color:#e0d2b0;letter-spacing:.4px}'
      + '#bohphone .clk i.g{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:11px;line-height:14px;letter-spacing:1px;color:#f4e8cc}'   /* UI 7: the band says what the clock is doing, the hour is the first line's */
      + '#bohphone .clk i.go{color:#f6cf74}'
      /* THE PHONE'S FACES TRANSFORM (UI 11/2 round 2, Paolo 11/2 notes 3 and 8, asks 257, 279: 'not a big fan of things just disappearing
         and looking ugly'): a page, the fight's face and the company's face are always laid out and come up out of the phone's glass on
         twos (six held poses a beat, 500 ms, the music's grid: big steps first, an overshoot where the tin bends, then it sits) and go
         back into it in three holds; what was under stays until the new face covers it. Reduced motion: a two-hold fade, nothing travels */
      + '#bohphone .page,#bohphone .fight,#bohphone .crewp{position:absolute;left:0;right:0;top:12px;bottom:0;z-index:4;display:flex;flex-direction:column;background:rgba(10,8,6,.78);visibility:hidden;pointer-events:none}'
      + '#bohphone .page.on,#bohphone .fight.on,#bohphone .crewp.on{visibility:visible;pointer-events:auto;animation:bphIn 500ms steps(1,end) both}'
      + '#bohphone .page.was,#bohphone .fight.was,#bohphone .crewp.was{animation:bphOut 375ms steps(1,end) both}'
      + '@keyframes bphIn{0%{opacity:0;transform:translateY(16px) scale(.92)}16.67%{opacity:.45;transform:translateY(8px) scale(.96)}33.33%{opacity:.8;transform:translateY(3px) scale(.99)}'
      +   '50%{opacity:1;transform:translateY(-2px) scale(1.015)}66.67%{opacity:1;transform:none}100%{opacity:1;transform:none}}'
      + '@keyframes bphOut{0%{visibility:visible;opacity:1;transform:none}33.33%{visibility:visible;opacity:.6;transform:translateY(4px) scale(.98)}'
      +   '66.67%{visibility:visible;opacity:.25;transform:translateY(10px) scale(.95)}100%{visibility:hidden;opacity:0;transform:translateY(16px) scale(.92)}}'
      + '#bohphone .home.under{transition:visibility 0s linear .34s}'
      + '@keyframes bphFade{0%{opacity:0}50%{opacity:.5}100%{opacity:1}}@keyframes bphFadeOut{0%{visibility:visible;opacity:1}50%{visibility:visible;opacity:.5}100%{visibility:hidden;opacity:0}}'
      + '@media (prefers-reduced-motion:reduce){#bohphone .page.on,#bohphone .fight.on,#bohphone .crewp.on{animation:bphFade 167ms steps(1,end) both}'
      +   '#bohphone .page.was,#bohphone .fight.was,#bohphone .crewp.was{animation:bphFadeOut 167ms steps(1,end) both}#bohphone.on{animation:none}#bohphone.leaving{animation:bphFadeOut 167ms steps(1,end) both}}'
      /* the phone itself comes up from below the glass's edge when the game comes on, and sinks back when it goes (never a pop) */
      + '#bohphone.on{animation:bphRise 500ms steps(1,end)}'
      + '#bohphone.leaving{display:block;pointer-events:none;animation:bphSink 375ms steps(1,end) both}'
      + '@keyframes bphRise{0%{translate:0 70px;opacity:0}16.67%{translate:0 34px;opacity:.5}33.33%{translate:0 12px;opacity:.85}50%{translate:0 -3px;opacity:1}66.67%{translate:0 0;opacity:1}100%{translate:0 0;opacity:1}}'
      + '@keyframes bphSink{0%{translate:0 0;opacity:1}33.33%{translate:0 14px;opacity:.7}66.67%{translate:0 40px;opacity:.3}100%{translate:0 70px;opacity:0}}'
      /* YOUR COMPANY on the phone (ask 281): the screen's title and stash count, its tabs as plates two a row, DONE a thumb tall */
      + '#bohphone .crewp{background:#120d09;padding:0 3px 6px;gap:4px}'
      + '#bohphone .cph{flex:0 0 auto;padding:5px 3px 4px;display:flex;flex-direction:column;gap:2px;border-bottom:1px solid rgba(255,236,200,.08)}'
      + '#bohphone .cph b{font-weight:400;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:9px;letter-spacing:1.2px;color:#f4e8cc;text-shadow:0 1px 0 #000}'
      + '#bohphone .cph em,#bohphone .cph span{font-style:normal;font-size:6px;line-height:8px;color:#cdbd98;white-space:nowrap;overflow:hidden}'
      + '#bohphone .cman{flex:0 0 auto;padding:1px 3px 3px;display:flex;flex-direction:column;gap:2px}'
      + '#bohphone .cman b{font-weight:400;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:10px;letter-spacing:1px;color:#f6cf74;white-space:nowrap;overflow:hidden}'
      + '#bohphone .cman em,#bohphone .cman span{font-style:normal;font-size:6px;line-height:8px;color:#e6d8b6;white-space:normal;overflow:hidden;max-height:16px}'
      + '#bohphone .cman s{display:block;height:3px;background:rgba(255,236,200,.14);text-decoration:none}#bohphone .cman s i{display:block;height:100%;background:#d9a650}'
      + '#bohphone .ctabs{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:30px;gap:3px;align-content:start;overflow:hidden}'
      + '#bohphone .ctabs button{padding:0 3px;margin:0;border:0;cursor:pointer;color:#1f1710;font:8px "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:.8px;white-space:nowrap;overflow:hidden;' + kit('tin', 0.5) + '}'
      + '#bohphone .ctabs button.on{' + kit('tin_amber', 0.5) + '}'
      + '#bohphone .ctabs button.perk{color:#f6cf74;' + kit('well', 0.5) + '}'
      + '#bohphone .ctabs button:active,#bohphone .cdone:active{transform:translateY(1px)}'
      + '#bohphone .cdone{flex:0 0 46px;margin:0;padding:0 8px;border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;color:#1f1710;' + kit('tin_amber', 0.5) + '}'
      + '#bohphone .cdone img{width:22px;height:23.5px;pointer-events:none}'
      + '#bohphone .cdone b{font-weight:400;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:12px;letter-spacing:2px}'
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
      /* __TAP_A_QUEST_YOUR_PEOPLE_GO__: a post about a job he holds is a button, with the amber go-mark at its right */
      + '#bohphone .po.qp{position:relative;padding-right:12px;cursor:pointer}'
      + '#bohphone .po.qp::after,#bohphone .bpfd.quest::after{content:"";position:absolute;right:2px;top:3px;width:6px;height:8px;background:#e8a83a;clip-path:polygon(0 0,100% 50%,0 100%);pointer-events:none}'
      + '#bohphone .po.qp.going::after,#bohphone .bpfd.quest.going::after{animation:bphGo ' + BEAT + 'ms steps(2,end) infinite}'
      + '#bohphone .bpfd.quest .fp b{padding-right:8px}'
      + '#bohphone .rel{padding:3px 0 4px;border-top:1px solid rgba(240,226,196,.12)}'
      + '#bohphone .rel b{font-weight:400;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:8.5px;letter-spacing:.5px;color:#f4e8cc}'
      + '#bohphone .rel .bd{float:right;font-size:7px}'
      + '#bohphone .rel .why{display:block;color:#bfae8c;font-size:7px}'
      /* __HOLD_PLAY_SLIDE_THE_SPEED__ (WORLD 5, rule 311): the slider over PLAY's column, up out of the glass on twos as every face */
      + '#bohphone .spdsl{position:absolute;left:2px;right:2px;top:2px;height:111px;z-index:6;visibility:hidden;pointer-events:none;background:linear-gradient(#15110b,#0a0806);box-shadow:inset 0 0 0 1px rgba(240,226,196,.18),inset 0 1px 0 rgba(240,226,196,.10)}'
      + '#bohphone .spdsl.on{visibility:visible;animation:bphIn 250ms steps(1,end) both}'
      + '#bohphone .spdsl.was{animation:bphOut 250ms steps(1,end) both}'
      + '#bohphone .spdsl .tt{position:absolute;right:5px;top:3px;font:7px "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1.2px;color:#bfae8c}'
      + '#bohphone .spdsl .rl{position:absolute;left:22px;width:6px;top:' + 18 + 'px;height:' + 84 + 'px;border-radius:2px;background:linear-gradient(90deg,#050403,#2b2318 45%,#050403);box-shadow:inset 0 1px 2px rgba(0,0,0,.95),0 0 0 1px rgba(240,226,196,.16)}'
      + '#bohphone .spdsl .nt{position:absolute;left:16px;width:18px;height:2px;background:#9a835a;box-shadow:0 1px 0 #000}'
      + '#bohphone .spdsl .lb{position:absolute;left:41px;height:14px;line-height:14px;white-space:nowrap;font:11px "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1px;color:#bfae8c}'
      + '#bohphone .spdsl .lb.now{color:#f6cf74;text-shadow:0 0 4px rgba(246,207,116,.45)}'
      + '#bohphone .spdsl .lb i{font-style:normal;font-size:6.5px;letter-spacing:.6px;margin-left:4px;color:#8f8166}'
      + '#bohphone .spdsl .kn{position:absolute;left:10px;width:30px;height:14px;' + kit('tin_amber', 0.5) + 'box-shadow:0 1px 0 rgba(0,0,0,.7)}'
      + '#bohphone .app[data-app=play]{touch-action:none;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}'
      + '#bohphone .home.under{visibility:hidden}'
      /* THE FIGHT: the screen lit dark red, his face and name, his abilities in the kit's pockets, small, three a row */
      + '#bohphone .fight{background:#1a0907}'
      /* NO TURN-ORDER STRIP (UI 11/2 round 2, Paolo 11/2 note 9, ask 283: 'I don't think anyone gives a fuck about which character is
         next... as a visual I think it's just a waste'): the strip of faces is gone from the phone and from the glass; the order stays in
         the fight's code (FIGHT.S.order), and a man's sheet is a tap on him on the board */
      /* THE CARD: his face (a tap is his sheet), his name, three bars lit from above with their numbers (blood, armour, wind: the
         fight's own colours), his AP as pips and the count; a man of theirs shows his plate (LV, OUTCLASSES YOU) where the AP was */
      + '#bohphone .fh{flex:0 0 35px;display:flex;align-items:center;gap:3px;padding:2px 3px;background:rgba(0,0,0,.42);box-shadow:inset 0 -1px 0 rgba(255,236,200,.06)}'
      + '#bohphone .fh .fme{flex:0 0 32px;width:32px;height:32px;padding:0;margin:0;border:0;cursor:pointer;background:#0b0907;position:relative;'
      +   'box-shadow:0 1px 0 rgba(255,236,200,.12),0 2px 3px rgba(0,0,0,.8),inset 0 0 0 1px rgba(0,0,0,.6)}'
      + '#bohphone .fh .fme:active{transform:translateY(1px)}'
      + '#bohphone .fh canvas{position:absolute;left:1px;top:1px;width:30px;height:30px;border-radius:1px;pointer-events:none}'
      + '#bohphone .fh .fst{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}'
      + '#bohphone .fh b{display:block;font-weight:400;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:8px;line-height:8px;letter-spacing:.5px;color:#f4e8cc;white-space:nowrap;overflow:hidden;text-shadow:0 1px 0 #000}'
      + '#bohphone .fb{display:flex;align-items:center;gap:2px;height:5px}'
      + '#bohphone .fb s{flex:1;height:4px;position:relative;overflow:hidden;background:rgba(0,0,0,.6);box-shadow:inset 0 1px 0 rgba(0,0,0,.7),0 1px 0 rgba(255,236,200,.07)}'
      + '#bohphone .fb s i{position:absolute;left:0;top:0;bottom:0;width:0;box-shadow:inset 0 1px 0 rgba(255,255,255,.32),inset 0 -1px 0 rgba(0,0,0,.30)}'
      + '#bohphone .fb em{flex:0 0 21px;font-style:normal;font-size:5px;line-height:5px;color:#e9dcbc;text-align:right;white-space:nowrap;overflow:hidden}'
      + '#bohphone .fap{display:flex;align-items:center;gap:2px;height:5px;margin-top:1px}'
      + '#bohphone .fap .pp{flex:1;display:flex;gap:1px;min-width:0;overflow:hidden}'
      + '#bohphone .fap .pp i{flex:0 0 4px;height:3px;background:rgba(0,0,0,.55);box-shadow:inset 0 1px 0 rgba(0,0,0,.6)}'
      + '#bohphone .fap .pp i.on{background:#d9a85a;box-shadow:inset 0 1px 0 rgba(255,236,170,.6)}'
      + '#bohphone .fap em{flex:0 0 auto;font-style:normal;font-size:5px;line-height:5px;color:#f6cf74;white-space:nowrap}'
      + '#bohphone .fap.cls .pp{display:none}#bohphone .fap.cls em{flex:1;color:#ff6a4c;overflow:hidden}'
      /* THE BEAT IS SEEN (UI 11/2, Paolo 10/27 note 6): in a fight the status line carries the round and a heart monitor's trace on the
         fight's own beat; the glass of the phone's screen catches the beat at its rim. Stopped steps on the beat (the hit, the after-glow,
         the fade), a monitor's phosphor with the tape's red and blue ghosts, never a toy metronome */
      + '#bohphone .stat .ecg{display:none;width:36px;height:9px;flex:0 0 36px;image-rendering:pixelated;pointer-events:none}'
      + '#bohphone.fighting .stat .ecg{display:block}'
      + '#bohphone.fighting .stat .tl{display:none}'
      + '#bohphone.fighting .fight{transition:none}'
      + '#bohphone.fighting[data-beat="3"] .fight{background:#2b0d09;box-shadow:inset 0 0 0 1px rgba(255,96,64,.55),inset 0 0 9px rgba(255,64,40,.30)}'
      + '#bohphone.fighting[data-beat="2"] .fight{background:#230b08;box-shadow:inset 0 0 0 1px rgba(255,96,64,.28),inset 0 0 6px rgba(255,64,40,.14)}'
      + '#bohphone.fighting[data-beat="1"] .fight{box-shadow:inset 0 0 0 1px rgba(255,96,64,.12)}'
      /* the board's own pulse, subtle: the glass's edges darken red on the beat and one tape scanline passes, under the phone */
      + '#bohbeat{position:fixed;inset:0;pointer-events:none;display:none;opacity:0;'
      +   'background:repeating-linear-gradient(0deg,rgba(0,0,0,.07) 0 1px,rgba(0,0,0,0) 1px 3px),radial-gradient(ellipse 78% 72% at 50% 46%,rgba(0,0,0,0) 58%,rgba(96,10,6,.26) 86%,rgba(42,3,2,.46) 100%)}'
      + '#bohbeat.on{display:block}#bohbeat[data-b="3"]{opacity:1}#bohbeat[data-b="2"]{opacity:.5}#bohbeat[data-b="1"]{opacity:.2}'
      + '@media (prefers-reduced-motion:reduce){#bohbeat{display:none!important}}'
      /* rule 238(a): the fight's own commands over his abilities, the phone one size (238(b)): the big button the width of the glass,
         then WAIT, RETREAT, AUTO and the speed, then his abilities four a row, then the apps */
      + '#bohphone .fgo{flex:0 0 28px;margin:3px 3px 0;padding:0 5px;border:0;cursor:pointer;display:flex;align-items:center;gap:4px;color:#1f1710;' + kit('tin', 0.5) + '}'
      + '#bohphone .fgo.hot{' + kit('tin_amber', 0.5) + '}'
      + '#bohphone .fight.nocmd .fgo,#bohphone .fight.nocmd .fcm{display:none}'
      + '#bohphone .fgo[disabled]{opacity:.45;cursor:default}'
      + '#bohphone .fgo .mk{flex:0 0 18px;height:18px;background:center/contain no-repeat;image-rendering:pixelated;display:none}'
      + '#bohphone .fgo.mkd .mk{display:block}'
      + '#bohphone .fgo b{font-weight:400;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:10px;letter-spacing:1.2px;white-space:nowrap}'
      + '#bohphone .fgo i{margin-left:auto;font-style:normal;font-size:7px;white-space:nowrap}'
      + '#bohphone .fcm{flex:0 0 28px;margin:2px 3px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:nowrap;gap:0;padding:0}'
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
      + '#bohphone .abig{flex:0 0 50px;display:flex;gap:3px;margin:3px 3px 0}#bohphone .abig.none{display:none}'
      + '#bohphone .abig .bg{flex:1 1 0;min-width:0;position:relative;padding:0;margin:0;border:0;cursor:pointer;color:#1f1710;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;' + kit('tin', 0.5) + '}'
      + '#bohphone .abig .bg.reload{' + kit('tin_amber', 0.5) + '}'
      + '#bohphone .abig .bg canvas{width:26px;height:26px;pointer-events:none;filter:drop-shadow(0 1px 0 rgba(0,0,0,.55))}'
      + '#bohphone .abig .bg b{font-weight:400;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:8px;line-height:9px;letter-spacing:1px;pointer-events:none}'
      + '#bohphone .abig .bg i{position:absolute;right:3px;top:2px;font-style:normal;font-size:6px;line-height:7px;padding:0 1px;color:#f6cf74;background:rgba(10,6,3,.8);pointer-events:none}'
      + '#bohphone .abig .bg.on{outline:2px solid #f6cf74;outline-offset:-2px}'
      + '#bohphone .abig .bg:active{transform:translateY(1px)}'
      + '#bohphone .abig .bg[disabled]{opacity:.45;cursor:default}'
      + '#bohphone .ab{flex:1;display:grid;grid-template-columns:repeat(4,24px);grid-auto-rows:25px;gap:2px;justify-content:center;align-content:start;padding:2px 0;overflow:hidden}'
      + '#bohphone .ab .sk{position:relative;width:24px;height:25px;padding:0;margin:0;border:0;cursor:pointer;color:inherit;font:inherit;' + kit('well', 0.5) + '}'
      + '#bohphone .ab .sk canvas{position:absolute;left:2px;top:2px;width:20px;height:20px;pointer-events:none}'
      + '#bohphone .ab .sk i{position:absolute;right:1px;bottom:1px;font-style:normal;font-size:6px;line-height:7px;padding:0 1px;color:#f6cf74;background:rgba(10,6,3,.8);pointer-events:none}'
      + '#bohphone .ab .sk.on{outline:2px solid #f6cf74;outline-offset:-2px}'
      + '#bohphone .ab .sk[disabled]{opacity:.4;cursor:default}'
      + '#bohphone .frow{flex:0 0 28px;margin:0 0 6px;padding:0;gap:0;flex-wrap:nowrap;display:flex;justify-content:space-around;align-items:center;background:rgba(0,0,0,.4)}'
      + '#bohphone .ab .none{grid-column:1 / span 4;padding:2px 3px;font-size:7px;line-height:9px;color:#cdbd98;text-align:center}'
      /* COMBAT TIME: stop-motion holds on the beat (steps, never a smooth slide): the glass flashes, the crosshair strikes in
         three holds and beats twice, the word under it */
      + '#bohphone .cmb{position:absolute;inset:0;z-index:6;display:none;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:#2a0907}'
      + '#bohphone .cmb.on{display:flex;pointer-events:none}'   /* the strike is a picture: a finger goes through it to the page coming up under it */
      + '#bohphone .cmb img{width:56px;height:60px;transform:scale(.4);animation:bohStrike ' + (BEAT * 1.5) + 'ms steps(3,end) forwards, bohBeat ' + BEAT + 'ms steps(2,end) ' + (BEAT * 1.5) + 'ms 2}'
      + '#bohphone .cmb b{font-weight:400;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:13px;letter-spacing:2px;color:#f1d6c6;opacity:0;animation:bohWord ' + BEAT + 'ms steps(2,end) ' + (BEAT * 1.5) + 'ms forwards}'
      + '#bohphone .cmb::before{content:"";position:absolute;inset:0;background:#f4e0cc;opacity:0;animation:bohFlash ' + BEAT + 'ms steps(2,end)}'
      + '#bohphone .cmb.on{animation:bphFade 250ms steps(1,end) both}'
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
    var st = document.createElement('style'); st.id = 'bohphone-css'; st.textContent = CSS() + '#bohphone{transition:translate .5s cubic-bezier(.2,0,0,1),opacity .5s cubic-bezier(.2,0,0,1)}#bohphone.away{translate:0 calc(100% + 40px);opacity:0;pointer-events:none}'; document.head.appendChild(st);
    var ph = el('div'); ph.id = 'bohphone'; ph.setAttribute('role', 'group'); ph.setAttribute('aria-label', 'your phone');
    ph.innerHTML = '<div class="scr"><canvas class="wall" aria-hidden="true"></canvas><div class="dim"></div>'
      + '<div class="stat"><span class="wh"></span><span class="dt" aria-label="the day and the hour"></span><button type="button" class="tl" aria-label="switch timeline">TIMELINE</button><canvas class="ecg" width="108" height="27" aria-hidden="true"></canvas></div>'
      + '<div class="home"></div>'
      + '<div class="page" data-page=""><div class="ph" role="button" tabindex="0"><i>&lsaquo;</i><span></span></div><div class="pb"></div></div>'
      + '<div class="fight" aria-label="your fight">'
      +   '<div class="fh"><button type="button" class="fme" aria-label="his sheet"><canvas width="90" height="90"></canvas></button>'
      +     '<div class="fst"><b></b><div class="fb hp"><s><i></i></s><em></em></div><div class="fb arm"><s><i></i></s><em></em></div>'
      +     '<div class="fb fat"><s><i></i></s><em></em></div><div class="fap"><span class="pp"></span><em></em></div></div></div>'
      +   '<button type="button" class="fgo" data-c="go"><span class="mk"></span><b>END TURN</b><i></i></button>'
      +   '<div class="fcm" role="toolbar" aria-label="the fight">'
      +     '<button type="button" class="fc" data-c="wait" aria-label="wait"><img alt="" src="' + IMG('app_wait') + '"><i></i></button>'
      +     '<button type="button" class="fc" data-c="flee" aria-label="retreat"><img alt="" src="' + IMG('app_retreat') + '"><i></i></button>'
      +     '<button type="button" class="fc" data-c="auto" aria-label="auto"><img alt="" src="' + IMG('app_auto') + '"><span class="tint"></span><i></i></button>'
      +     '<button type="button" class="fc sp" data-c="speed" aria-label="the fight\'s speed">1x</button></div>'
      +   '<div class="abig" role="toolbar" aria-label="reload and strike"></div><div class="ab"></div><div class="frow" role="toolbar" aria-label="your apps in the fight"></div></div>'
      + '<div class="crewp" aria-label="your company"><div class="cph"><b>YOUR COMPANY</b><em></em><span></span></div>'
      +   '<div class="cman" aria-label="who is picked"><b></b><em></em><s><i></i></s><span></span></div>'   /* UI 7 (rule 369): the man picked, his own sheet's words */
      +   '<div class="ctabs" role="toolbar" aria-label="the stash"></div>'
      +   '<button type="button" class="cdone"><img alt="" src="' + IMG('app_crew') + '"><b>DONE</b></button></div>'
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
    home.addEventListener('pointerdown', function (e) { if (e.target.closest && e.target.closest('.app, .bpfd, .lv, .vb, .jc')) return;   /* .vb: a held finger on the boss's verb says what it does (BOSSES 11/2), never the settings */ clearTimeout(ht); ht = setTimeout(settingsOpen, 600); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (k) { home.addEventListener(k, function () { clearTimeout(ht); }); });
    homeBuild();
    /* in a fight the same small icons ride under his abilities: the fight's own bar answers them (238(a)) */
    ['crew', 'settings'].forEach(function (a) { ph.querySelector('.frow').appendChild(appButton(a, 'sm')); });
    /* his face is his sheet; a face in the turn strip is that man's sheet (the fight's own drawer) */
    ph.querySelector('.fh .fme').addEventListener('click', function () {
      var fw = fightWin(), F = fw && fw.BohemiaPhone && fw.BohemiaPhone.P; if (!F || !F.card) return;
      F.card(); setTimeout(function () { manPaint(true); }, 80);
    });
    ph.querySelector('.crewp .cdone').addEventListener('click', function () { var R = rosterWin(); if (R) R.BohemiaPhone.P.rosterPress('done'); setTimeout(tick, 60); });
    ph.querySelector('.crewp .ctabs').addEventListener('click', function (e) {
      var b = e.target && e.target.closest && e.target.closest('.ctabs button'); if (!b) return;
      var R = rosterWin(); if (R) R.BohemiaPhone.P.rosterPress(+b.dataset.i); setTimeout(function () { crewPaint(true); }, 60);
    });
    /* the board's pulse: one layer over the fight, under the phone, that no finger meets */
    var bb = el('div'); bb.id = 'bohbeat'; bb.setAttribute('aria-hidden', 'true'); document.body.appendChild(bb); H.bb = bb;
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
    if (a === 'play') {   /* __HOLD_PLAY_SLIDE_THE_SPEED__ (WORLD 5, rule 311): a held finger brings the slider up under it; slide; let go keeps it */
      var t = 0;
      b.addEventListener('pointerdown', function (e) {
        clearTimeout(t); try { b.setPointerCapture(e.pointerId); } catch (x) {}   /* the finger stays this button's while it slides off it */
        H.slideY = e.clientY; t = setTimeout(function () { if (slideOpen(H.slideY)) H.holdFired = b; }, slideHoldMs());
      });
      b.addEventListener('pointermove', function (e) { H.slideY = e.clientY; if (H.slide) slideMove(e.clientY); });
      b.addEventListener('pointerup', function (e) { clearTimeout(t); if (H.slide) slideLetGo(e.clientY); });
      b.addEventListener('pointercancel', function () { clearTimeout(t); if (H.slide) slideClose(); });
    }
    return b;
  }
  /* ---- __HOLD_PLAY_SLIDE_THE_SPEED__ (WORLD 5, 11/2, rule 311, ask 304): THE SLIDER UNDER HIS THUMB. A rail over PLAY's own
     column, regular time at the bottom (just above his thumb) and the fastest at the top. The knob starts on the speed he has
     and climbs a notch for every notch his finger climbs (relative, so the touch itself never jumps it); let go and that speed
     is his and saved (the map's travelPick: on a march it is the speed now, on PAUSE the speed PLAY sets out at; the hold never
     starts the clock). On the map only. Words draft:true. ---- */
  var SL = { top: 18, bottom: 102, h: 111 };   /* the slider's rows in the home's own points (the two buttons start at 116) */
  function slideHoldMs() { try { var cw = cityWin(), L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P, s = L && L.state(); return (s && s.holdMs) || 350; } catch (e) { return 350; } }
  function slideOpen(y0) {
    var scr = H.state.screen; try { scr = whichScreen() || scr; } catch (e) {}
    var cw = cityWin(), L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P; if (!L || scr !== 'map') return false;
    var s = L.state(), st = (s.speeds || []).slice().sort(function (a, c) { return a - c; }); if (st.length < 2) return false;
    var cur = s.speed || s.last, i0 = 0; st.forEach(function (n, i) { if (Math.abs(Math.log(n / cur)) < Math.abs(Math.log(st[i0] / cur))) i0 = i; });
    var home = H.el.querySelector('.home'), sl = home.querySelector('.spdsl');
    if (!sl) { sl = el('div', 'spdsl'); sl.setAttribute('role', 'slider'); sl.setAttribute('aria-label', 'travel speed'); home.appendChild(sl); }
    var gap = (SL.bottom - SL.top) / (st.length - 1), h = '<span class="tt">SPEED</span><i class="rl"></i>';
    st.forEach(function (n, i) { var c = SL.bottom - i * gap;
      h += '<i class="nt" style="top:' + (c - 1) + 'px"></i><span class="lb" data-i="' + i + '" style="top:' + (c - 7) + 'px">' + n + 'x'
        + (n === s.regular ? '<i>REGULAR</i>' : '') + '</span>'; });   /* draft:true */
    sl.innerHTML = h + '<i class="kn"></i>';
    sl.setAttribute('aria-valuemin', String(st[0])); sl.setAttribute('aria-valuemax', String(st[st.length - 1]));
    var r = sl.getBoundingClientRect(), k = r.height > 0 ? r.height / SL.h : 1;
    H.slide = { st: st, i0: i0, i: i0, y0: y0, gap: gap, px: Math.max(8, gap * k), L: L, el: sl, at: performance.now() };
    clearTimeout(sl.__was); sl.classList.remove('was'); sl.classList.add('on');
    slidePaint(); window.__PHONE_SLIDE = { open: true, from: st[i0], steps: st.slice(), notchPx: Math.round(H.slide.px * 10) / 10 };
    return true;
  }
  function slidePaint() {
    var S = H.slide; if (!S) return;
    var kn = S.el.querySelector('.kn'); kn.style.top = (SL.bottom - S.i * S.gap - 7) + 'px';
    [].forEach.call(S.el.querySelectorAll('.lb'), function (l) { l.classList.toggle('now', +l.dataset.i === S.i); });
    S.el.setAttribute('aria-valuenow', String(S.st[S.i])); S.el.setAttribute('aria-valuetext', S.st[S.i] + 'x');
  }
  function slideMove(y) {
    var S = H.slide; if (!S) return;
    var i = Math.max(0, Math.min(S.st.length - 1, S.i0 + Math.round((S.y0 - y) / S.px)));
    if (i !== S.i) { S.i = i; slidePaint(); }
  }
  function slideLetGo(y) {
    var S = H.slide; if (!S) return; slideMove(y);
    var n = S.st[S.i], got = S.L.pick(n);
    window.__PHONE_SLID = { n: n, from: S.st[S.i0], got: got, heldMs: Math.round(performance.now() - S.at), n_slid: (window.__PHONE_SLID ? window.__PHONE_SLID.n_slid : 0) + 1 };
    slideClose(); paintHome(true);
  }
  function slideClose() {
    var S = H.slide; H.slide = null; if (!S) return;
    var sl = S.el; sl.classList.remove('on'); sl.classList.add('was'); clearTimeout(sl.__was); sl.__was = setTimeout(function () { sl.classList.remove('was'); }, 260);
    window.__PHONE_SLIDE = { open: false };
  }
  function rowApps() { var c = H.cfg; return c.order.filter(function (a) { return c.hidden.indexOf(a) < 0; }); }
  function homeBuild() {
    var home = H.el.querySelector('.home'); home.textContent = '';
    var jb = el('div', 'jobs'); jb.setAttribute('role', 'list'); jb.setAttribute('aria-label', 'the main quest and the jobs you are on');
    jb.innerHTML = '<div class="mq" role="listitem" aria-label="the main quest\'s place"></div>'; home.appendChild(jb);
    var fd = el('div', 'bpfd'); fd.setAttribute('role', 'button'); fd.setAttribute('tabindex', '0'); fd.setAttribute('aria-label', 'the city\'s feed: tap for all of it');
    fd.addEventListener('click', function () { if (fd.dataset.quest) { questGo(fd.dataset.quest, 'strip', fd); return; }   /* rule 376: a post about his job goes there */
      H.presses++; window.__PHONE_PRESSES = H.presses; pageOpen('feed'); }); home.appendChild(fd);
    var two = el('div', 'bptwo'); two.appendChild(appButton('play', 'big')); two.appendChild(appButton('heal', 'big')); home.appendChild(two);
    var ctx = el('div', 'bpctx');
    ctx.innerHTML = '<div class="clk" aria-hidden="true"><i class="g"></i></div>'   /* UI 7 (rule 368): the day and the hour are the phone's first line now (__THE_DAY_ON_THE_PHONE__), said once; the band keeps what the clock is doing */
      + '<button type="button" class="lv" aria-label="leave"><img alt="" src="' + IMG('app_leave') + '"><span>LEAVE</span></button>'   /* draft:true */
      + '<button type="button" class="vb" aria-label="use what a boss gave you"><img alt=""><span></span></button>';   /* __THE_BOSS_VERB_ON_THE_PHONE__ (BOSSES 11/2) */
    ctx.querySelector('.lv').addEventListener('click', function () { appPress('leave'); });
    /* __THE_BOSS_VERB_ON_THE_PHONE__ (BOSSES 11/2, rule 330: 'I can put the fire down, I can purify the water, I'm so confused by what that
       means'): a held finger on it says what it does, in one plain line from the boss's file (verb.tip); a tap still uses it. UI 4's
       long-press tooltips take this over when they land (a minimal one until then) */
    (function (vb) {
      var t = null, held = false;
      vb.addEventListener('pointerdown', function () { held = false; clearTimeout(t); t = setTimeout(function () { held = true; verbTip(vb); }, 480); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (k) { vb.addEventListener(k, function () { clearTimeout(t); }); });
      vb.addEventListener('contextmenu', function (e) { e.preventDefault(); held = true; verbTip(vb); });
      vb.addEventListener('click', function (e) { if (held) { held = false; e.preventDefault(); return; } appPress('verb'); });
    })(ctx.querySelector('.vb'));
    home.appendChild(ctx);
    var row = el('div', 'bprow'); row.setAttribute('role', 'toolbar'); row.setAttribute('aria-label', 'your apps');
    rowApps().forEach(function (a) { row.appendChild(appButton(a, 'sm')); });
    home.appendChild(row);
    H.homeSig = null; H.jobSig = null; H.stripSig = null;
  }

  function verbTip(vb) {   /* __THE_BOSS_VERB_ON_THE_PHONE__: the plain line, over the button, for a few seconds */
    var v = H.verb; if (!v || !v.tip) return;
    var old = document.getElementById('bohverbtip'); if (old) old.remove();
    var r = vb.getBoundingClientRect(), d = document.createElement('div'); d.id = 'bohverbtip'; d.setAttribute('role', 'tooltip'); d.setAttribute('data-draft', 'true');
    var w = Math.min(240, Math.max(150, (window.innerWidth || 360) - 24));
    d.style.cssText = 'position:fixed;z-index:90;left:' + Math.round(Math.max(8, Math.min((window.innerWidth || 360) - w - 8, r.left + r.width / 2 - w / 2))) + 'px;bottom:' + Math.round((window.innerHeight || 640) - r.top + 6)
      + 'px;width:' + w + 'px;box-sizing:border-box;padding:7px 9px;background:#e6dcc4;color:#1f1710;font:400 11px BohemiaROM,ui-monospace,monospace;line-height:1.4;box-shadow:2px 2px 0 rgba(10,6,3,.6);pointer-events:none';
    d.innerHTML = '<b style="display:block;font:400 10px BohemiaCasing,ui-monospace,monospace;letter-spacing:.8px;margin-bottom:2px">' + String(v.button).replace(/[<>&]/g, '') + '</b>' + String(v.tip).replace(/[<>&]/g, '');
    document.body.appendChild(d); window.__VERB_TIP = { button: v.button, tip: v.tip, at: Date.now() };
    setTimeout(function () { try { d.remove(); } catch (e) {} }, 4000);
  }

  function appPress(a) {
    H.presses++; window.__PHONE_PRESSES = H.presses;
    try { window.postMessage({ type: 'BOHEMIA_SFX', ev: 'phone_tap' }, '*'); } catch (_e) {}   /* __THE_PUNCH_HEARD__ (SOUNDS 11/3): rule 301, a gear tooth and a click */
    var cw = cityWin(), L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P;
    var scr = H.state.screen; try { scr = whichScreen() || scr; } catch (e) {}   /* where he is at the press, not a beat ago (a town just closed is the map) */
    if (a === 'play') { if (L && scr === 'map') { L.play(H.sel); paintHome(true); } return; }
    if (a === 'crew') { if (H.page) pageClose(); var Bc = barOf(scr); if (Bc && (scr === 'map' || scr === 'town' || scr === 'camp' || scr === 'fight')) Bc.barPress('crew'); return; }
    /* rule 238(a): the bar's NOTES and its gear, and the town's LEAVE, pressed here: the very same buttons of the screen he is on,
       hidden under the phone's rule (no button twice, 286(b)); a fight's own bar answers in a fight */
    if (a === 'notes' || a === 'settings') { if (H.page) pageClose(); var B = barOf(scr); if (!(B && B.barPress(a === 'notes' ? 'notes' : 'gear')) && a === 'settings') settingsOpen(); return; }
    if (a === 'leave') { if (L && scr === 'town') L.leave(); setTimeout(tick, 60); return; }
    if (a === 'verb') { var Bv = cw && cw.BohemiaBosses, v = H.verb; if (Bv && v && !v.off && scr === 'map') { Bv.use(v.id); H.homeSig = null; setTimeout(tick, 60); } return; }   /* __THE_BOSS_VERB_ON_THE_PHONE__ */
    if (a === 'heal' || a === 'camp') { if (L && (scr === 'map' || scr === 'camp' || scr === 'town')) { L.camp(); setTimeout(tick, 60); } return; }   /* CAMP [a town is safe] (rule 273(b)): HEAL in a town rests there */
    if (a === 'relations') { if (H.page === a) pageClose(); else pageOpen(a); return; }
  }

  /* ---- THE APPS' OWN PAGES, on the phone's own glass ---- */
  /* a face of the phone comes up or goes back (the CSS's bphIn / bphOut, on twos); a page swapped for another comes up again */
  function panel(e, on, again) {
    if (!e) return;
    if (on) { clearTimeout(e.__was); e.classList.remove('was'); if (again && e.classList.contains('on')) { e.classList.remove('on'); void e.offsetWidth; } e.classList.add('on'); return; }
    if (!e.classList.contains('on')) return;
    e.classList.remove('on'); e.classList.add('was'); clearTimeout(e.__was); e.__was = setTimeout(function () { e.classList.remove('was'); }, 400);
    window.__PHONE_MORPHS = (window.__PHONE_MORPHS | 0) + 1;
  }
  function pageOpen(which) {
    if (!H.page) try { window.postMessage({ type: 'BOHEMIA_SFX', ev: 'phone_open' }, '*'); } catch (_e) {}   /* __THE_PUNCH_HEARD__ (SOUNDS 11/3): gears and a rubber band */
    var pg = H.el.querySelector('.page'), swap = !!H.page && H.page !== which; H.page = which; pg.dataset.page = which; panel(pg, true, swap);
    H.el.querySelector('.home').classList.add('under');
    pg.querySelector('.ph span').textContent = LABEL[which];
    pagePaint(true);
  }
  function pageClose() { var pg = H.el.querySelector('.page'); if (H.page) try { window.postMessage({ type: 'BOHEMIA_SFX', ev: 'phone_close' }, '*'); } catch (_e) {} panel(pg, false); pg.dataset.page = ''; H.page = null; H.el.querySelector('.home').classList.remove('under'); }
  function pagePaint(fresh) {
    if (!H.page) return;
    var pb = H.el.querySelector('.page .pb'), cw = cityWin(), L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P;
    if (H.page === 'feed') {
      var heldIds = ''; try { heldIds = ((cw && cw.LOOP && cw.LOOP.held) || []).map(function (j) { return j && j.id; }).join(','); } catch (e) {}
      var posts = (L ? L.posts() : []).concat((H.own || []).filter(function (o) { return Date.now() - o.t < 120000; }).reverse()), sig = posts.length + '|' + (posts.length ? posts[posts.length - 1].txt : '') + '|' + nameGet() + '|' + (H.feedKind || '') + '|' + heldIds + '|' + (H.going ? H.going.id : '');
      if (!fresh && sig === H.feedSig) return; H.feedSig = sig;
      if (pb.querySelector('input')) return;   /* never under his thumbs while he types the name */
      var co = L ? L.company() : { men: 0 };
      if (H.feedKind) posts = posts.filter(function (p) { return p.kind === H.feedKind; });
      var KD = [['mine', 'app_crew', 'yours'], ['world', 'app_relations', 'the world\'s'], ['life', 'app_feed', 'the valley\'s talk']];
      var h = '<div class="kf" role="group" aria-label="which posts">' + KD.map(function (k) { return '<button type="button" data-kind="' + k[0] + '" aria-label="' + k[2] + '" aria-pressed="' + (H.feedKind === k[0]) + '"' + (H.feedKind === k[0] ? ' class="on"' : '') + '><img alt="" src="' + IMG(k[1]) + '"></button>'; }).join('') + '</div>'
        + '<div class="co"><span class="nm" role="textbox" tabindex="0" aria-label="your company\'s name: tap to type">' + esc(nameGet()) + '<u>TYPE</u></span>'
        + '<span class="sub">' + (co.men ? co.men + (co.men === 1 ? ' MAN' : ' MEN') : 'YOUR COMPANY') + (co.clout != null ? ' &middot; CLOUT ' + esc(co.clout) : '') + '</span></div>';
      for (var i = posts.length - 1; i >= 0; i--) { var p = posts[i], qd = questOf(p, cw);   /* rule 376: a post about a job he holds is a button */
        h += '<div class="po' + (p.kind === 'mine' ? ' mine' : '') + (p.re ? ' re' : '') + (qd ? ' qp' + (H.going && H.going.id === qd ? ' going' : '') : '') + '"'
          + (qd ? ' role="button" tabindex="0" data-quest="' + esc(qd) + '" aria-label="' + esc(p.txt) + ': tap to go there"' : '') + '><span class="w">' + esc(p.who) + (p.re ? ' <i>replying</i>' : '') + '</span><span class="t">' + esc(p.txt) + '</span></div>'; }
      if (!posts.length) h += '<div class="po"><span class="t">Nothing yet. The valley is quiet.</span></div>';   /* draft:true */
      pb.innerHTML = h;
      pb.querySelector('.nm').addEventListener('click', renameStart);
      pb.querySelector('.nm').addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); renameStart(); } });
      [].forEach.call(pb.querySelectorAll('.kf button'), function (b) { b.addEventListener('click', function () { H.feedKind = H.feedKind === b.dataset.kind ? null : b.dataset.kind; H.feedSig = null; pagePaint(true); }); });
      [].forEach.call(pb.querySelectorAll('.po.qp'), function (q) { var go = function () { questGo(q.dataset.quest, 'feed', q); };
        q.addEventListener('click', go); q.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
    } else if (H.page === 'relations') {
      if (!fresh && H.relAt && performance.now() - H.relAt < 2000) return; H.relAt = performance.now();
      pb.innerHTML = relationsHtml(L);
    }   /* the speeds page a hold used to open is the slider now (__HOLD_PLAY_SLIDE_THE_SPEED__, above) */
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
  /* WORLD 4: the job file lives on the map's page; the phone is drawn on the top page (UI TWO's one phone), so it is reached there */
  function JKW() { try { if (window.BohemiaJobKinds) return window.BohemiaJobKinds; var cw = cityWin(); return cw && cw.BohemiaJobKinds ? cw.BohemiaJobKinds : null; } catch (e) { return null; } }
  function timeWord(j) {
    if (j.mins == null) return '';
    var h = j.mins / 60, w = h < 1 ? '<1H' : h < 24 ? Math.round(h) + 'H' : Math.round(h / 24) + 'D';
    /* WORLD 4 [a job's time is the truth] (rule 307): the job file's one rounding, packed for the card ('1H40', '1D7H'); '2D' for 37 hours was 30 off in 100 */
    try { var JK = JKW(); if (JK && JK.shortTime) w = JK.shortTime(j.mins).replace(/ MIN$/, 'M').replace(/ DAYS?/, 'D').replace(/ H/, 'H').replace(/ /g, ''); } catch (e) {}
    return w + (j.back && !(JKW() && JKW().payMarkHTML) ? ' THERE+BACK' : '');   /* draft:true; rule 222(b) in a phone's words; WORLD 4: the mark says it now (rule 308) */
  }
  function jobCard(j, L) {
    var armed = H.arm && H.arm.id === j.id, going = !!(H.going && H.going.id === j.id), d = el('div', 'jc' + (H.sel === j.id ? ' sel' : '') + (armed ? ' arm' : '') + (going && !armed ? ' going' : ''));
    d.setAttribute('role', 'listitem'); d.dataset.job = j.id;
    if (!armed) {
      d.innerHTML = '<span class="dir" aria-hidden="true"><svg viewBox="0 0 12 12" width="12" height="12"><path d="M6 0.6 L10.6 11 L6 8.4 L1.4 11 Z"/></svg></span>'
        + '<div class="tx"><span class="wh"></span><span class="mt"><span class="st"></span><span class="pl"></span></span></div>'
        + '<button type="button" class="x" aria-label="drop this job"><img alt="" src="' + IMG('app_x') + '"></button>';
      /* what and where on the first line (the place may clip), the stars and the time on the second (never clipped) */
      var wh = d.querySelector('.wh'), plw = String(j.at || j.from || '').toUpperCase(); wh.textContent = j.what + (plw ? ' ' : '');
      if (plw) { var atw = el('span', 'at'); atw.textContent = '\u00b7 ' + plw; wh.appendChild(atw); }   /* the place keeps its word, its dot with it (ask 154) */
      d.querySelector('.st').textContent = new Array(Math.max(1, Math.min(5, j.stars)) + 1).join('\u2605');
      d.querySelector('.pl').textContent = timeWord(j);
      /* WORLD 4 (rule 308, ask line 301): COME BACK or PAID THERE first on the line (the job file's one mark, by the held job's own kind) */
      try { var JK = JKW(), cw0 = cityWin(), hj = null; ((cw0 && cw0.LOOP && cw0.LOOP.held) || []).forEach(function (x) { if (x && x.id === j.id) hj = x; }); if (JK && JK.payMarkHTML) d.querySelector('.mt').insertAdjacentHTML('afterbegin', JK.payMarkHTML(hj || { id: j.id }, { short: true })); } catch (e) {}
      var dv = d.querySelector('.dir'); if (j.deg == null) dv.classList.add('here'); else { dv.style.transform = 'rotate(' + j.deg + 'deg)'; dv.dataset.deg = j.deg; }   /* which way (238(d)); a dot when he is on it */
      d.setAttribute('aria-label', (j.full || j.what) + ', ' + j.stars + ' stars, ' + String(j.at || j.from) + (timeWord(j) ? ', ' + timeWord(j).toLowerCase() : '') + (going ? ', your people are going there' : ', tap to go there'));
      d.setAttribute('tabindex', '0');
      d.querySelector('.x').addEventListener('click', function (e) { e.stopPropagation(); H.arm = { id: j.id, cost: L ? L.dropCost(j.id) : null, why: null }; jobsPaint(L, true); });
      /* rule 376: a tap on the card is PLAY's job AND the road to it, at once (the X keeps its own tap) */
      d.addEventListener('click', function () { H.sel = j.id; questGo(j.id, 'card', d); });
      d.addEventListener('keydown', function (e) { if (e.target === d && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); H.sel = j.id; questGo(j.id, 'card', d); } });
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
  /* ---- __TAP_A_QUEST_YOUR_PEOPLE_GO__ (UI 7, 11/3/26; rule 376, ask line 404). PAOLO 11/3: 'I should be able to click the quest
     on my phone and my people auto move towards it.' EVERY QUEST THE PHONE SHOWS IS A BUTTON: a job's card in the column, and the
     feed's post of a job he holds (a job taken, its town in the words), on the strip and on the feed's page. A tap closes the phone's
     page to the map, leaves the town by its own LEAVE (P.leave: the town's #leave, one handler) or breaks the camp by the map's own
     door (BohemiaMapCamp.break), and makes THE MAP'S ONE CALL, WORLD 8's window.BOH_TRAVEL_TO_QUEST(id)
     (slices/bohemia_quest_travel.js: the road, the nearest marker by the road's minutes, the close camera, the settlement on
     arrival); before that call is on the page, the map's own way to a job (P.jobGo: mapPlayToJob, else a tap's travelTo). Nothing
     here moves the party or the camera. Out of a town the map first fits his jobs in view (__THE_MAP_FITS_YOUR_JOBS__, a 650 ms ease
     350 ms after LEAVE): the call waits for it, so the two cameras never pull against each other. THE MARK: the quest he is going to
     wears it (its arrow amber, on the beat; the post's go-mark beats) from the tap until that road ends (there, a road's event, a
     tap of his elsewhere on the map); a tap the map says no to (no road) shakes it twice. Gate: gates/tap_a_quest_on_the_phone_gate.js ---- */
  function questOf(p, cw) {
    if (!p || p.type !== 'job_taken') return null;
    var held = []; try { held = (cw && cw.LOOP && cw.LOOP.held) || []; } catch (e) {}
    var tx = String(p.txt || '').toLowerCase();
    for (var i = 0; i < held.length; i++) { var j = held[i]; if (!j || j.id == null || j.rescue) continue;
      var f = String(j.from || '').toLowerCase(); if (f && tx.indexOf(f) >= 0) return String(j.id); }
    return null;
  }
  function questNo(id, from) {
    var q = from === 'strip' ? H.el.querySelector('.home .bpfd') : from === 'feed' ? H.el.querySelector('.page .po.qp[data-quest="' + String(id).replace(/"/g, '') + '"]')
      : H.el.querySelector('.home .jc[data-job="' + String(id).replace(/"/g, '') + '"]');
    if (!q) return; q.classList.remove('nogo'); void q.offsetWidth; q.classList.add('nogo'); clearTimeout(q.__nogo); q.__nogo = setTimeout(function () { q.classList.remove('nogo'); }, BEAT * 1.2);
  }
  var QG = { n: 0, log: [] };
  function questGo(id, from) {
    var cw = cityWin(), scr = null; try { scr = whichScreen(); } catch (e) {}
    var L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P;
    var rec = { n: ++QG.n, id: id == null ? null : String(id), from: from || null, screen: scr, ok: false, why: null, by: null, waited: 0, t: Date.now() };
    window.__PHONE_QUEST_GO = rec; QG.log.push(rec); if (QG.log.length > 12) QG.log.shift();
    H.presses++; window.__PHONE_PRESSES = H.presses;
    if (!cw || !L || rec.id == null) { rec.why = 'no map'; return rec; }
    if (scr === 'fight') { rec.why = 'a fight'; return rec; }
    var s0 = null; try { s0 = L.state(); } catch (e) {}
    if (s0 && s0.meet) { rec.why = 'a meeting'; questNo(rec.id, from); return rec; }   /* the road's card asks first: ENGAGE or FALL BACK */
    if (H.page) pageClose();   /* the phone closes to the map */
    H.going = { id: rec.id, n: rec.n, wait: true, to: null, trav: null };
    jobsPaint(L, true); questStrip(true); if (H.page) pagePaint(true);
    var t0 = performance.now(), F0 = cw.MAP_FIT, fit0 = F0 ? (F0.n | 0) : 0, jobs0 = 0; try { jobs0 = (cw.LOOP.held || []).length; } catch (e) {}
    if (scr === 'town') { try { L.leave(); } catch (e) {} }
    else if (scr === 'camp') { try { if (cw.BohemiaMapCamp && cw.BohemiaMapCamp.on()) cw.BohemiaMapCamp.break(); } catch (e) {} }
    var go = function () {
      if (!H.going || H.going.n !== rec.n) { rec.why = rec.why || 'another tap'; return; }
      var waited = performance.now() - t0, inTown = false; try { inTown = !!(cw.LOOP.frame && cw.LOOP.frame.style.display === 'block'); } catch (e) {}
      if ((scr === 'town' || scr === 'camp') && waited < 3000) {
        /* the town's LEAVE is a message: its screen closes a moment later; a camp broken in a town stands in the town: its LEAVE too */
        if (inTown) { if (scr === 'camp' && !rec.left) { var cOn = true; try { cOn = cw.BohemiaMapCamp.on(); } catch (e) {} if (!cOn) { rec.left = 1; try { L.leave(); } catch (e) {} } } setTimeout(go, 40); return; }
        var F = cw.MAP_FIT;
        if (scr === 'camp' && !rec.left) F = null;   /* only a town's LEAVE fits his jobs in view */
        if (jobs0 && F && F.on && waited < 2600 && (((F.n | 0) === fit0 && waited < 1900) || (F.last && (F.n | 0) !== fit0 && !F.last.done && !F.last.stopped))) { setTimeout(go, 40); return; }
      }
      rec.waited = Math.round(waited);
      var r = null;
      try { if (typeof cw.BOH_TRAVEL_TO_QUEST === 'function') { r = cw.BOH_TRAVEL_TO_QUEST(rec.id); rec.by = 'world'; } } catch (e) { r = null; }
      if (!r) { var ok = false; try { ok = !!L.jobGo(rec.id); } catch (e) {} r = { ok: ok, why: ok ? null : 'no road' }; rec.by = 'map'; }
      rec.ok = !!r.ok; rec.why = r.ok ? null : (r.why || 'no road'); rec.name = r.name || null; rec.to = r.to || null; rec.mins = r.mins != null ? r.mins : null; rec.of = r.of || null;
      var tv = null; try { tv = cw.TRAVEL || null; } catch (e) {}
      rec.going = !!(rec.ok && tv);
      if (rec.going) { H.going.wait = false; H.going.trav = tv; H.going.to = tv.to ? [tv.to[0] | 0, tv.to[1] | 0] : null; }
      else { H.going = null; if (!rec.ok) questNo(rec.id, from); }   /* arrived at once (a town he stands at opens), or no */
      jobsPaint(L, true); questStrip(true); if (H.page) pagePaint(true);
    };
    go();
    return rec;
  }
  /* the mark comes off when that road ends: no journey, or a journey somewhere else (his own tap on the map, another quest) */
  function questTrack() {
    var g = H.going; if (!g || g.wait) return;
    var cw = cityWin(), tv = null; try { tv = cw ? cw.TRAVEL : null; } catch (e) {}
    var near = function (a, x, y) { return Math.max(Math.abs((a[0] | 0) - (x | 0)), Math.abs((a[1] | 0) - (y | 0))) <= 1; };
    var same = !!tv && (tv === g.trav || (g.to && tv.to && near(tv.to, g.to[0], g.to[1])));
    /* a hunt's pack moves and the map re-aims the walk at it: still this quest's road while it leads to one of its own places */
    if (!same && tv && tv.to && cw.BohemiaQuestTravel && cw.BohemiaQuestTravel.places) { try {
      var hj = ((cw.LOOP && cw.LOOP.held) || []).filter(function (j) { return j && String(j.id) === g.id; })[0];
      if (hj) same = cw.BohemiaQuestTravel.places(hj).some(function (c) { return near(tv.to, c.x, c.y); }); } catch (e) {} }
    if (same) { if (tv !== g.trav) { g.trav = tv; if (tv.to) g.to = [tv.to[0] | 0, tv.to[1] | 0]; } return; }
    H.going = null; window.__PHONE_QUEST_ENDED = (window.__PHONE_QUEST_ENDED | 0) + 1;
    var L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P; jobsPaint(L, true); questStrip(true); if (H.page === 'feed') pagePaint(true);
  }
  /* the strip's post: about a job he holds, it is that job's button (its go-mark), else the feed's door (the strip's own paint untouched) */
  function questStrip(force) {
    var fd = H.el && H.el.querySelector('.home .bpfd'); if (!fd) return;
    var cw = cityWin(), qd = null, hk = ''; try { hk = ((cw && cw.LOOP && cw.LOOP.held) || []).map(function (j) { return j && j.id; }).join(','); } catch (e) {}
    var pk = (H.stripTop || '') + '#' + hk + '#' + (H.going ? H.going.id : '');
    if (!force && pk === H.stripQuestAt) return; H.stripQuestAt = pk;   /* the feed is read only when the post, his jobs or the mark change */
    if (H.stripTop && hk) { var L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P, ps = L ? L.posts() : [];
      for (var i = ps.length - 1; i >= 0; i--) if (ps[i].who + '|' + ps[i].txt === H.stripTop) { qd = questOf(ps[i], cw); break; } }
    var going = !!(qd && H.going && H.going.id === qd), k = (qd || '') + '|' + going;
    if (!force && k === H.stripQuest) return; H.stripQuest = k;
    fd.classList.toggle('quest', !!qd); fd.classList.toggle('going', going);
    if (qd) { fd.dataset.quest = qd; fd.setAttribute('aria-label', 'a post about your job: tap to go there'); }
    else { delete fd.dataset.quest; fd.setAttribute('aria-label', 'the city\'s feed: tap for all of it'); }
  }
  function jobsPaint(L, force) {
    var jb = H.el.querySelector('.home .jobs'); if (!jb) return;
    var js = L ? L.jobs() : [];
    if (H.sel && !js.some(function (j) { return j.id === H.sel; })) H.sel = null;
    if (!H.sel && js.length) H.sel = js[0].id;
    if (H.arm && !js.some(function (j) { return j.id === H.arm.id; })) H.arm = null;
    var sig = js.map(function (j) { return j.id + j.stars + j.mins + j.what + j.at + '@' + j.deg; }).join('|') + '|' + H.sel + '|' + (H.arm ? H.arm.id + H.arm.why : '') + '|' + (H.going ? H.going.id : '');
    window.__PHONE_JOBS = js.map(function (j) { return j.id; });
    if (!force && sig === H.jobSig) return; H.jobSig = sig;
    [].slice.call(jb.querySelectorAll('.jc, .je')).forEach(function (n) { n.remove(); });
    jb.classList.toggle('asking', !!H.arm);
    /* every job he holds (ask 154): two contracts and a rescue past them; the column grows into the feed's top for the third */
    js.slice(0, 3).forEach(function (j) { jb.appendChild(jobCard(j, L)); });
    var hm = H.el.querySelector('.home'); if (hm) hm.classList.toggle('jobs3', js.length > 2);
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
    var running = !!(s && s.speed > 0 && s.going !== false), mark = s ? (s.last || s.speed) : 0;
    jobsPaint(L, force);
    H.el.classList.toggle('tl', !!(L && L.timeline(false)));
    var cd = L ? L.condition() : null;
    var vh = null; try { vh = scr === 'map' && cw && cw.BohemiaBosses ? cw.BohemiaBosses.verbHere() : null; } catch (e) { vh = null; }   /* __THE_BOSS_VERB_ON_THE_PHONE__ */
    var sig = [scr, running, mark, s && s.clock, s && s.day, s && s.place, s && s.camp, cd && [cd.hp, cd.hpMax, cd.arm, cd.armMax].join(), vh ? vh.id + vh.off : ''].join('|');
    if (!force && sig === H.homeSig) return; H.homeSig = sig;
    H.verb = vh;
    var cxv = H.el.querySelector('.home .bpctx'), vb = cxv && cxv.querySelector('.vb');
    if (vb) { cxv.classList.toggle('verb', !!vh && scr === 'map'); vb.classList.toggle('off', !!(vh && vh.off)); vb.dataset.verb = vh ? vh.id : '';
      if (vh) { vb.querySelector('span').textContent = vh.button; vb.setAttribute('aria-label', vh.button.toLowerCase() + (vh.tip ? ': ' + vh.tip : '')); vb.title = vh.tip || '';
        var vi = ''; try { vi = cw.BohemiaBosses.icon ? cw.BohemiaBosses.icon(vh.id) : ''; } catch (e) {} var im0 = vb.querySelector('img'); if (vi && im0.getAttribute('src') !== vi) im0.setAttribute('src', vi); } }
    var stW = H.el.querySelector('.stat .wh');
    if (s) stW.textContent = scr === 'camp' ? (s.campTown ? String(s.campTown).toUpperCase() : 'YOUR CAMP') : (s.place || '');   /* CAMP [a town is safe]: resting in a town, the town's name */
    var stD = H.el.querySelector('.stat .dt');   /* __THE_DAY_ON_THE_PHONE__ (rule 368): the day and the hour, once, on the first line */
    if (stD && s) { var dtx = (s.day ? 'DAY ' + s.day : '') + (s.clock ? (s.day ? '  ' : '') + s.clock : ''); if (stD.textContent !== dtx) stD.textContent = dtx; }
    /* the place's whole name beside them: a long name steps down half a point at a time (to 5.5) before a letter is ever cut */
    var fitK = stW.textContent + '|' + (stD ? stD.textContent : '') + '|' + H.el.className;
    if (stW.__fit !== fitK) { stW.__fit = fitK; stW.style.fontSize = ''; for (var fs = 7; stW.scrollWidth > stW.clientWidth + 0.5 && fs > 5.5;) { fs -= 0.5; stW.style.fontSize = fs + 'px'; } }
    var cx = H.el.querySelector('.home .bpctx'); if (cx) cx.classList.toggle('town', scr === 'town');   /* in a town the band is LEAVE */
    var k = H.el.querySelector('.home .clk');
    if (k && s) {
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

  /* ---- THE FEED IS ON (rule 286(c)): the city's newest post on the face, the handle and the words, stepping in on the beat
     (stop-motion); a tap is everything posted (286(d)).
     AMENDED 11/2 (UI 4, rule 329, ask line 327; Paolo 11/2: 'there's two tweets that go out that you can see... just make it one,
     and they should only stick around for as long as it would take to read them'): ONE post at a time, never two; it stays
     1.2 s plus 0.25 s a word (a phone reader near 230 words a minute), rounded up to whole beats, then sinks out of the strip
     (two holds); the next post steps in when it comes. ---- */
  var READ = { base_ms: 1200, per_word_ms: 250, beat_ms: 500 };   /* the fallback; the numbers live in slices/phone/feed_read.json */
  try { fetch(BASE + 'phone/feed_read.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j) ['base_ms', 'per_word_ms', 'beat_ms'].forEach(function (k) { if (+j[k] > 0) READ[k] = +j[k]; }); }).catch(function () {}); } catch (e) {}
  function readMs(p) {
    var words = String(p && p.txt || '').split(/\s+/).filter(Boolean).length + String(p && p.who || '').split(/\s+/).filter(Boolean).length;
    var bm = READ.beat_ms; try { var B = window.BOHEMIA_BEAT, n = B && B.now && B.now(); if (n && n.beatMs > 0) bm = n.beatMs; } catch (e) {}
    return Math.ceil((READ.base_ms + READ.per_word_ms * words) / bm) * bm;
  }
  /* the one post fills the strip: try 9 px down to 6 px in half steps, keep the first size at which nothing is cut. A hidden phone
     (no height) is fitted the next time it paints with a height. */
  /* COORDINATOR 11/3 (Paolo: 'make sure this tweet box works when we change it to larger font... the setting on your phone for the
     largest font... it's OK if the tweet box scrolls down a little bit if it needs to'): a phone set to its biggest text scales every
     letter past what any size here can fit. So the line height follows the letters (unitless, never a fixed px that the phone's
     scaling leaves behind), and when even the smallest size cannot hold the post, the words scroll slowly up under the handle
     through the post's time (stripScroll below), then the next post steps in. Nothing is ever cut. */
  function fitStrip(fd) {
    var fp = fd && fd.querySelector('.fp'); if (!fp) return;
    var h = fp.clientHeight; if (!(h > 4)) { H.stripFitH = 0; return; }
    var sp = fp.querySelector('span'), hb = fp.querySelector('b');
    if (sp) { sp.style.maxHeight = ''; sp.scrollTop = 0; }
    for (var sz = 9; sz >= 6; sz -= 0.5) {
      fp.style.fontSize = sz + 'px'; fp.style.lineHeight = '1.16';
      if (fp.scrollHeight <= h + 0.5) break;
    }
    H.stripOver = 0;
    if (sp && fp.scrollHeight > h + 0.5) {   /* even 6 px does not fit: the phone's text is scaled up; the words scroll */
      var lh0 = parseFloat(getComputedStyle(sp).lineHeight) || 8, room = Math.max(lh0, h - (hb ? hb.offsetHeight : 0));
      sp.style.maxHeight = Math.floor(room / lh0) * lh0 + 'px';   /* whole lines only: never half a line peeking */
      H.stripOver = Math.max(0, sp.scrollHeight - sp.clientHeight);
    }
    H.stripFitH = fd.clientHeight;
  }
  /* the scroll: hold the top 1.2 s, then one whole line up every 1.5 s (stop-motion, the game's own step), hold the end 1.2 s;
     returns its ms so the post stays until its last line has been read */
  function stripScroll(fd) {
    clearTimeout(H.stripScrollT);
    var sp = fd.querySelector('.fp span'), over = H.stripOver || 0; if (!sp || !(over > 0)) return 0;
    var lh = parseFloat(getComputedStyle(sp).lineHeight) || 8, lines = Math.ceil(over / lh - 0.01), n = 0;
    H.stripScrollT = setTimeout(function step() {
      n++; sp.scrollTop = Math.min(over, n * lh);
      if (n < lines) H.stripScrollT = setTimeout(step, 1500);
    }, 1200 + 300);
    return 1500 + lines * 1500 + 1200;
  }
  try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { H.stripFitH = -1; }); } catch (e) {}
  /* COORDINATOR 11/3 (Paolo: 'there should always be text there that transitions to other text, not just be empty'): the strip
     never sits empty. One post at a time still (rule 329), each kept its read time; then, instead of sinking out to nothing, the
     next one steps in: a new post at once when one comes, else the strip walks back through the last STRIP_BACK posts and round
     again, so there is always something to read. */
  var STRIP_BACK = 6;
  /* THE PRIORITY HOLD (rule 371(b), Paolo 11/3: 'if it's an important quest and timewise you won't see any other tweets,
     priority'): while an important run plays (a town falling on its channel: its posts carry priority), the strip shows only
     those posts; and an important post on the strip (priority, or one of the feed's big kinds) keeps it its whole read time
     before anything newer steps in. Nothing else in the strip changes: its fit, its scroll and its read times are as they were. */
  function stripHold(posts) {
    var h = posts.filter(function (p) { return p && p.priority; });
    return h.length ? h : posts;
  }
  function stripPaint(force) {
    var fd = H.el.querySelector('.home .bpfd'); if (!fd) return;
    if (H.stripFitH !== fd.clientHeight && fd.querySelector('.fp')) fitStrip(fd);   /* shown again, the jobs grew, or the font came in */
    var cw = cityWin(), L = cw && cw.BohemiaPhone && cw.BohemiaPhone.P;
    var posts = stripHold((L ? L.posts() : []).concat((H.own || []).filter(function (o) { return Date.now() - o.t < 120000; })));
    var last = posts.length ? posts[posts.length - 1] : null, newest = last ? last.who + '|' + last.txt : '';
    if (newest !== H.stripNewest && H.stripHeld && Date.now() < H.stripHeld && !(last && last.priority && !H.stripHeldPri)) {
      window.__PHONE_HELD = (window.__PHONE_HELD | 0) + 1; return; }   /* 371(b): the important one keeps the strip its read time */
    if (newest !== H.stripNewest) { H.stripNewest = newest; H.stripBack = 0; }   /* a new post steps in at once */
    var ring = Math.max(1, Math.min(posts.length, STRIP_BACK)), back = (H.stripBack | 0) % ring;
    var one = posts.length ? [posts[posts.length - 1 - back]] : [], sig = one.map(function (p) { return p.who + '|' + p.txt; }).join('') + '#' + back;
    if (!force && sig === H.stripSig) return;
    var was = H.stripTop; H.stripSig = sig; H.stripTop = one.length ? one[0].who + '|' + one[0].txt : null;
    if (!one.length) { clearTimeout(H.stripT); clearTimeout(H.stripScrollT); fd.innerHTML = '<div class="fp"><span>The valley is quiet.</span></div>'; fitStrip(fd); return; }   /* draft:true */
    var p = one[0], fresh = !!(was && was !== H.stripTop);
    fd.innerHTML = '<div class="fp' + (p.kind === 'mine' ? ' mine' : '') + (fresh ? ' new' : '') + '"><b>' + esc(p.who) + '</b><span>' + esc(p.txt) + '</span></div>';
    fitStrip(fd);
    if (fresh) window.__PHONE_STRIP = (window.__PHONE_STRIP | 0) + 1;
    clearTimeout(H.stripT);
    var ms = Math.max(readMs(p), stripScroll(fd)); H.stripRead = { sig: sig, ms: ms, t: Date.now() };
    H.stripHeld = (p.priority || p.big) ? Date.now() + ms : 0; H.stripHeldPri = !!p.priority;   /* 371(b) */
    if (p.priority) window.__PHONE_PRIORITY = (window.__PHONE_PRIORITY | 0) + 1;
    H.stripT = setTimeout(function () { if (H.stripSig !== sig) return;
      window.__PHONE_STRIP_OUT = (window.__PHONE_STRIP_OUT | 0) + 1;
      if (ring > 1) { H.stripBack = ((H.stripBack | 0) + 1) % ring; stripPaint(true); } }, ms);   /* read: the next one in, never empty */
  }

  /* ---- YOUR COMPANY (ask 281): while the company screen is up, the phone is its DONE and its stash's tabs ---- */
  function rosterWin() {
    var out = null;
    frames(window).forEach(function (w) { if (out) return; try { var R = w.BohemiaPhone && w.BohemiaPhone.P; if (!R || !R.roster || !R.roster()) return;
      var fe = w.frameElement; if (fe) { if (fe.closest && fe.closest('[data-bm-folded]')) return; var r = fe.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return; } out = w; } catch (e) {} });
    return out;
  }
  function crewPaint(force) {
    var R = rosterWin(), o = R && R.BohemiaPhone.P.roster(); if (!o) return;
    var key = JSON.stringify(o); if (!force && key === H.crewKey) return; H.crewKey = key;
    var m = /^(YOUR COMPANY)\s*(.*)$/.exec(o.title) || [0, o.title, ''];
    var cp = H.el.querySelector('.crewp'); cp.querySelector('.cph b').textContent = m[1] || 'YOUR COMPANY'; cp.querySelector('.cph em').textContent = m[2] || ''; cp.querySelector('.cph span').textContent = o.n || '';
    var mn = o.man || {}, cm = cp.querySelector('.cman');   /* UI 7 (rule 369): who is picked, on the phone */
    if (cm) { cm.style.display = mn.name ? '' : 'none'; cm.querySelector('b').textContent = mn.name || ''; cm.querySelector('em').textContent = mn.sub || '';
      cm.querySelector('span').textContent = [mn.trait, mn.tally].filter(Boolean).join('  ');
      var xb = cm.querySelector('s'); xb.style.display = mn.xp == null ? 'none' : ''; xb.querySelector('i').style.width = Math.round(Math.max(0, Math.min(1, mn.xp || 0)) * 100) + '%'; }
    var tb = cp.querySelector('.ctabs'); tb.textContent = '';
    o.tabs.forEach(function (t) { var b = el('button', (t.on ? 'on' : '') + (t.perk ? ' perk' : '')); b.type = 'button'; b.dataset.i = t.i; b.disabled = t.off; b.textContent = t.t; b.setAttribute('aria-label', t.t.toLowerCase()); tb.appendChild(b); });
    window.__PHONE_CREW_TABS = o.tabs.length;
  }
  function crewIn() { pageClose(); H.crewKey = null; crewPaint(true); panel(H.el.querySelector('.crewp'), true); var hm = H.el.querySelector('.home'); clearTimeout(H.homeT); H.homeT = setTimeout(function () { if (H.face === 'crew') hm.style.visibility = 'hidden'; }, 340); window.__PHONE_CREW_IN = (window.__PHONE_CREW_IN | 0) + 1; }
  function crewOut() { clearTimeout(H.homeT); H.el.querySelector('.home').style.visibility = ''; panel(H.el.querySelector('.crewp'), false); H.homeSig = null; paintHome(true); }

  /* ---- THE FIGHT: combat time, then his abilities ---- */
  function fightIn(back) {
    pageClose();
    var c = H.el.querySelector('.cmb'), f = H.el.querySelector('.fight');
    /* __THE_WAY_BACK_IS_ON_THE_PHONE__: back from the company screen in the middle of a fight, his abilities come straight back; the
       strike card is the fight's start, never its middle */
    if (back) { c.classList.remove('out'); c.classList.remove('on'); clearTimeout(H.homeT); H.el.querySelector('.home').style.visibility = 'hidden';
      H.fightKey = null; H.anim = (H.anim | 0) + 1; H.el.classList.add('fighting'); H.manKey = null; H.beatK = null; H.beatLv = null; beatStart();
      fightPaint(true); panel(f, true); window.__PHONE_FIGHT_BACK = (window.__PHONE_FIGHT_BACK | 0) + 1; return; }
    panel(f, false); c.classList.remove('out'); c.classList.remove('on');
    void c.offsetWidth; c.classList.add('on');   /* restart the strike */
    var hm = H.el.querySelector('.home'); clearTimeout(H.homeT); H.homeT = setTimeout(function () { if (H.face === 'fight') hm.style.visibility = 'hidden'; }, 260);   /* once the strike covers them */
    H.fightKey = null; H.anim = (H.anim | 0) + 1; var me = H.anim;
    window.__PHONE_COMBAT = (window.__PHONE_COMBAT | 0) + 1;
    H.el.classList.add('fighting'); H.manKey = null; H.beatK = null; H.beatLv = null; beatStart();
    setTimeout(function () { if (me !== H.anim) return; c.classList.add('out'); fightPaint(true); panel(f, true); }, BEAT * 3.5);
    setTimeout(function () { if (me !== H.anim) return; c.classList.remove('on'); c.classList.remove('out'); }, BEAT * 4.5);
  }
  function fightOut() {
    H.anim = (H.anim | 0) + 1; var me = H.anim;
    var c = H.el.querySelector('.cmb'), f = H.el.querySelector('.fight');
    c.classList.remove('on'); c.classList.remove('out'); panel(f, false);
    clearTimeout(H.homeT); H.el.querySelector('.home').style.visibility = '';
    window.__PHONE_COMBAT_OUT = (window.__PHONE_COMBAT_OUT | 0) + 1;
    H.el.classList.remove('fighting'); H.homeSig = null; beatPaint(-1);
    paintHome(true);
  }
  function fightPaint(force) {
    var fw = fightWin(), F = fw && fw.BohemiaPhone && fw.BohemiaPhone.P; if (!F) return;
    manPaint(force);
    var A = F.abilities(), C = F.cmds ? F.cmds() : null, key = A.key + '#' + (C ? JSON.stringify(C) : '');
    if (!force && key === H.fightKey) return; H.fightKey = key;
    cmdPaint(C);
    window.__PHONE_ABILITIES = A.list.length;
    var ab = H.el.querySelector('.ab'); ab.textContent = '';
    /* A BIG RELOAD (UI 11/2 round 2, Paolo 11/2 note 9, ask 282: 'in combat there's a lot of room and also the reload button should be
       a lot bigger'): the fight's two most-pressed buttons, RELOAD first then STRIKE, stand in their own row the width of the phone's
       glass, a thumb tall (50 points, the HIG's 44 and up; four of the old squares and more), each with its picture, its word and its AP; the rest stay four a row */
    var big = H.el.querySelector('.abig'); big.textContent = '';
    var mains = A.list.filter(function (a) { return a.kind === 'reload'; }).concat(A.list.filter(function (a) { return a.kind === 'strike'; }));
    mains.forEach(function (a) {
      var b = el('button', 'bg ' + a.kind + (a.on ? ' on' : '')); b.type = 'button'; b.disabled = a.off; b.title = a.title; b.setAttribute('aria-label', a.kind);
      var c = document.createElement('canvas'); c.width = 52; c.height = 52;
      try { if (a.cv && a.cv.width) c.getContext('2d').drawImage(a.cv, 0, 0, 52, 52); } catch (e) {}
      b.appendChild(c); var w = el('b'); w.textContent = a.kind === 'reload' ? 'RELOAD' : 'STRIKE'; b.appendChild(w);   /* draft:true */
      if (a.ap) { var t = el('i'); t.textContent = a.ap; b.appendChild(t); }
      b.addEventListener('click', function () { F.press(a.i); setTimeout(function () { fightPaint(true); }, 80); });
      big.appendChild(b);
    });
    big.classList.toggle('none', !mains.length);
    window.__PHONE_BIG = mains.map(function (a) { return a.kind; }).join(',');
    A.list.forEach(function (a, i) { a.i = i; });
    A.list.filter(function (a) { return a.kind !== 'reload' && a.kind !== 'strike'; }).slice(0, 12).forEach(function (a) {
      var i = a.i;
      var b = el('button', 'sk' + (a.on ? ' on' : '')); b.type = 'button'; b.disabled = a.off; b.title = a.title; b.setAttribute('aria-label', a.title.toLowerCase());
      var c = document.createElement('canvas'); c.width = 52; c.height = 52;
      try { if (a.cv && a.cv.width) { var g = c.getContext('2d'); g.drawImage(a.cv, 0, 0, 52, 52); } } catch (e) {}
      b.appendChild(c); if (a.ap) { var t = el('i'); t.textContent = a.ap; b.appendChild(t); }
      b.addEventListener('click', function () { F.press(i); setTimeout(function () { fightPaint(true); }, 80); });
      ab.appendChild(b);
    });
    var rest = A.list.length - mains.length, empty = Math.max(0, (rest ? 0 : 4));
    if (!rest) { var n = el('div', 'none'); n.textContent = 'No skills on this man yet. A level brings a perk.'; ab.appendChild(n); }   /* draft:true */
    for (var k = 0; k < empty; k++) { var w = el('button', 'sk'); w.type = 'button'; w.disabled = true; w.setAttribute('aria-label', 'empty'); ab.appendChild(w); }
  }

  /* THE PHONE RUNS THE FIGHT (UI 11/2, Paolo 10/27 note 4): the man on the fight's card and the turn strip, painted when they change
     (the round in the status line; his face, name, bars, numbers and AP; every face in the order, a tap its sheet) */
  function faceInto(c, src) {
    try { var g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height); if (src && src.width) { g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(src, 0, 0, c.width, c.height); } } catch (e) {}
  }
  function manPaint(force) {
    var fw = fightWin(), F = fw && fw.BohemiaPhone && fw.BohemiaPhone.P; if (!F || !F.man) return;
    var M = F.man(), bars = [M.hp, M.arm, M.fat].map(function (b) { return b ? [b.w, b.c, b.n].join(',') : ''; });
    var key = [M.name, M.main, bars.join(';'), M.ap, M.apTurn, M.cls, M.round].join('|');
    if (!force && key === H.manKey) return; H.manKey = key;
    H.el.querySelector('.stat .wh').textContent = M.round || '';
    var hd = H.el.querySelector('.fh');
    hd.querySelector('b').textContent = (M.name || '') + (M.main ? ' *' : '');
    faceInto(hd.querySelector('canvas'), M.face);
    hd.querySelector('.fme').setAttribute('aria-label', ((M.name || 'his') + ' sheet').toLowerCase());   /* draft:true */
    [['hp', M.hp], ['arm', M.arm], ['fat', M.fat]].forEach(function (p) {
      var row = hd.querySelector('.fb.' + p[0]), b = p[1] || { w: 0, c: '', n: '' }, i = row.querySelector('i');
      i.style.width = Math.max(0, Math.min(100, b.w)) + '%'; i.style.backgroundColor = b.c || ''; row.querySelector('em').textContent = b.n || '';
    });
    var fa = hd.querySelector('.fap'), pp = fa.querySelector('.pp');
    fa.classList.toggle('cls', !!M.cls);
    if (M.cls) fa.querySelector('em').textContent = M.cls;
    else {
      pp.textContent = ''; for (var k = 0; k < M.apTurn; k++) { var q = document.createElement('i'); if (k < M.ap) q.className = 'on'; pp.appendChild(q); }
      fa.querySelector('em').textContent = M.apTurn ? M.ap + ' AP' : '';
    }
    window.__PHONE_MAN = M.name;
  }

  /* THE BEAT IS SEEN (UI 11/2, Paolo 10/27 note 6: 'the beat with no sound... the fight runs on a 120 BPM beat. The beat has to be
     visible too, like a pulse on screen'). One beat, the fight's own (P.beat: COMBAT's SONG clock, the one its every act lands on),
     read on this page's clock every frame while the fight is on. Each beat is three stopped holds and a rest (the hit, the after-glow,
     the fade): the phone's screen catches it at its rim, the trace in its status line spikes, and the board's edges darken red under
     the phone. Read with the sound off: it is the fight's clock, not the speaker */
  var BEAT_HOLDS = [0.10, 0.24, 0.42];   /* where each hold ends, as parts of a beat */
  var BEAT_LEAD = 8;                     /* ms: half a frame at 60 */
  function beatNow() {
    var fw = fightWin(), F = fw && fw.BohemiaPhone && fw.BohemiaPhone.P, b = null;
    try { b = F && F.beat ? F.beat() : null; } catch (e) { b = null; }
    if (!b || !(b.ms > 0) || !isFinite(b.at)) return null;
    return { at: b.at - performance.timeOrigin, ms: b.ms, from: b.from };
  }
  function beatLoop() {
    H.beatRaf = 0;
    if (H.face !== 'fight' || !H.el || !H.el.classList.contains('on')) { beatPaint(-1); return; }
    /* half a frame ahead: the hold that a beat starts is drawn on the frame nearest it, never always the one after */
    var b = beatNow(), now = performance.now() + BEAT_LEAD;
    if (b) {
      var x = (now - b.at) / b.ms, ph = x - Math.floor(x);
      var lv = ph < BEAT_HOLDS[0] ? 3 : ph < BEAT_HOLDS[1] ? 2 : ph < BEAT_HOLDS[2] ? 1 : 0;
      /* a beat landed when the phase wraps (the fight's clock re-anchors on every booked beat, so a count of beats from it is not a
         count of beats heard; the wrap is): what the gate samples against the fight's own clock */
      if (H.beatK != null && ph < H.beatK - 0.5) { var L = window.__PHONE_BEATS = window.__PHONE_BEATS || []; L.push({ t: now - BEAT_LEAD, ph: ph, ms: b.ms, from: b.from }); if (L.length > 64) L.shift(); }
      H.beatK = ph;
      beatPaint(lv, b, now);
    }
    H.beatRaf = requestAnimationFrame(beatLoop);
  }
  function beatStart() { if (!H.beatRaf) H.beatRaf = requestAnimationFrame(beatLoop); }
  function beatPaint(lv, b, now) {
    if (lv === H.beatLv) return; H.beatLv = lv;
    var on = lv >= 0; H.el.dataset.beat = on ? String(lv) : '';
    if (H.bb) { H.bb.classList.toggle('on', on); H.bb.dataset.b = on ? String(lv) : ''; H.bb.style.zIndex = String(Math.max(1, (parseInt(H.el.style.zIndex, 10) || 60) - 1)); }
    if (on && b) ecgPaint(b, now, lv);
  }
  /* the trace: two beats of a heart monitor scrolling right to left, the newest at the right; the spike on each of the fight's beats.
     Drawn in the phone's own pixels (a dot a point), the trace in the monitor's pale phosphor, the tape's red ghost a dot left and its
     blue ghost a dot right, the old end fading; it moves only on the holds, so it steps like the rest of the phone */
  var ECG = [4, -2, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1];   /* one beat in eighteen dots: the spike ON the beat, the fall, the T wave, flat, the dip before the next */
  function ecgPaint(b, now, lv) {
    var c = H.el.querySelector('.stat .ecg'); if (!c) return;
    var g = c.getContext('2d'), D = 3, cols = 36, rows = 9, base = 6, span = 2 * b.ms;
    g.clearRect(0, 0, c.width, c.height);
    var ys = [];
    for (var x = 0; x < cols; x++) {
      var t = now - span + (x + 1) / cols * span, d = ((t - b.at) % b.ms + b.ms) % b.ms, j = Math.floor(d / b.ms * 18);
      ys.push(Math.max(0, Math.min(rows - 1, base - (ECG[j] || 0))));
    }
    var run = function (dx, col, fade) {
      for (var x = 0; x < cols; x++) {
        var a = fade ? (0.25 + 0.75 * x / (cols - 1)) : 1, y0 = ys[x], y1 = x ? ys[x - 1] : ys[x], lo = Math.min(y0, y1), hi = Math.max(y0, y1);
        g.globalAlpha = a * (lv === 3 ? 1 : lv === 2 ? 0.85 : 0.7); g.fillStyle = col;
        for (var y = lo; y <= hi; y++) g.fillRect((x + dx) * D, y * D, D, D);
      }
    };
    run(-1, 'rgba(224,64,46,.75)', true); run(1, 'rgba(80,200,230,.55)', true); run(0, lv === 3 ? '#fff2d6' : '#e9dcbc', true);
    g.globalAlpha = 1;
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
    /* __THE_WAY_BACK_IS_ON_THE_PHONE__ (PLUMBER 11/2, ask line 313, rule 317, Paolo: 'when I press level up, I don't know if there's an easy
       way for me to get back'). UI round 2 moved the company screen's DONE onto the phone and hid the screen's own, but the phone took
       its YOUR COMPANY face only off a fight (scr !== 'fight') and stood at z 70: MEASURED on the demo, upright, the end screen's
       SPEND HIS 3 LEVELS opened the company screen over the spoils (the shell's #spoilsdoor, z 8000) with its DONE display:none and the
       phone on its home face under the spoils: no way out. NOW a company screen up ANYWHERE (on the map, in a town, over the fight or
       over its end screen) is the phone's face, and the phone stands over it, since it carries that screen's DONE */
    var crewUp = false; if (on) { try { crewUp = !!rosterWin(); } catch (e) {} }
    if (crewUp) z = 999995;
    if (ph.style.zIndex !== String(z)) ph.style.zIndex = String(z);
    ph.style.left = g.left + 'px'; ph.style.top = g.top + 'px'; ph.style.transform = g.scale === 1 ? '' : 'scale(' + g.scale + ')';
    if (ph.classList.contains('on') && !on) { ph.classList.add('leaving'); clearTimeout(H.leaveT); H.leaveT = setTimeout(function () { ph.classList.remove('leaving'); }, 400); }
    else if (on) { clearTimeout(H.leaveT); ph.classList.remove('leaving'); }
    ph.classList.toggle('on', on); ph.classList.toggle('left', H.cfg.side === 'left'); ph.dataset.screen = scr || '';
    /* THE PHONE STEPS ASIDE FOR A SHOP (the coordinator, Paolo 10/27: 'if you're in the shop, the phone animated to the shop, just so it's
       not there anymore'): while a building's sheet is open in the town or the camp the phone slides down out of its corner in one beat
       and comes back the beat the sheet closes; nothing of it can be pressed while it is away */
    var away = false;
    if (scr === 'town' || scr === 'camp') frames(window).forEach(function (w) { try { var B = w.BohemiaSettlement; if (B && B.state && B.state.open) away = true; } catch (e) {} });
    if (ph.classList.contains('away') !== away) ph.classList.toggle('away', away);
    /* the game's settings card over everything: the phone shows where it now stands (the flip, at once) but takes no press */
    var sw = document.getElementById('setwrap'), setOn = !!sw && sw.classList.contains('on');
    ph.classList.toggle('behind', setOn);
    if (setOn && H.behindSide && H.behindSide !== H.cfg.side) { ph.classList.add('flipped'); clearTimeout(H.flipT); H.flipT = setTimeout(function () { ph.classList.remove('flipped'); }, 1500); }
    H.behindSide = setOn ? H.cfg.side : null; if (!setOn) ph.classList.remove('flipped');
    var was = H.state.screen;
    H.state = { on: on, side: H.cfg.side, screen: scr, rect: g };
    frames(window).forEach(function (w) { try { if (w.BohemiaPhone && w.BohemiaPhone._paint) w.BohemiaPhone._paint(H.state); } catch (e) {} });
    /* the face: his abilities while the fight is on; the apps the moment it is won or lost, and everywhere else */
    var over = false; if (scr === 'fight') { try { var fw0 = fightWin(); over = !!(fw0 && fw0.BohemiaPhone && fw0.BohemiaPhone.P.over()); } catch (e) {} }
    var face = crewUp ? 'crew' : scr === 'fight' && !over ? 'fight' : 'home';   /* __THE_WAY_BACK_IS_ON_THE_PHONE__: the company screen first */
    if (face !== H.face) { var from = H.face; H.face = face; if (from === 'fight') fightOut(); if (from === 'crew') crewOut(); if (face === 'fight') fightIn(from === 'crew'); if (face === 'crew') crewIn(); }
    if (!on) return;
    if (face === 'fight') { beatStart(); if (H.el.querySelector('.fight.on')) fightPaint(false); return; }
    if (face === 'crew') { crewPaint(false); return; }
    paintHome(false); paintWall(false); stripPaint(false);
    questTrack(); questStrip(false);   /* __TAP_A_QUEST_YOUR_PEOPLE_GO__ */
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
    going: function () { return IS_HOST && H.going ? { id: H.going.id, wait: !!H.going.wait, to: H.going.to } : null; },   /* rule 376: the quest he is going to (the gate reads it) */
    questLog: function () { return IS_HOST ? QG.log.slice() : []; },
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
