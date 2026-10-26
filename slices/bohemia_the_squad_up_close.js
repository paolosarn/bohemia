/* ============================================================================
   BOHEMIA -- THE SQUAD UP CLOSE (RUN THREE [the game starts in a town], 10/26/26, rule 236(a))

   PAOLO 10/26: "when the game starts up... some sort of introduction vibe where you get a close-up of the squad, and then
   instead of starting in map mode it will start on settlement mode."
   A new game opens on a short close-up of HIS squad: the real men his origin rolled, each his own 3D head (the crew screen's
   faces, engine/bohemia_crew_faces.js), his name, his trade and his stars, one after another on the beat (120 BPM), then the
   whole crew together under the origin's name; then the town (the map's __THE_GAME_STARTS_IN_A_TOWN__ opens it). ROUND TWO (ANIMATION's
   NOTE): each man is his own body moving (smoking, drinking, talking: the town's cells at a whole-number zoom), the crew together two
   and two talking; his still head only where his pictures are not in.
   ANALOG HORROR at the source (rule 20 of the bible): it is a tape somebody found: the grain is drawn on every beat, the
   scanlines sit over it and the tracking band rolls a step a beat, the head sits a pixel off on the beat and splits its colour, the counter runs.
   NEVER FORCED (the second votes): nothing happens in its first second (the tape's black), and from then a tap, a click or a
   key skips it. THE SONG is the origin's (rule 237, SOUNDS' table): if the shell defines __originSong(origin, phase) it is
   asked for 'intro' when the tape starts and 'done' when it ends; until then the room and the pulse that BEGIN started play.

     BohemiaSquadUpClose.play({ men: [{name, look, trade, stars:{stat:n}}], origin, originName, crew, doc, base, onDone })
       doc   the document to cover (the shell's top document, so nothing of the map or the HUD shows through)
       base  where engine/ is from this page ('../engine/' from slices/)
     window.__SQUAD_UP: what it showed, when it armed, whether it was skipped, when it ended (the gate reads it)
   Words are attempts, draft:true.
   ========================================================================== */
(function (root) {
  'use strict';
  var BEAT = 500, QUIET = 1000;
  var STAT_SHORT = { hp: 'HP', fatigue: 'FAT', resolve: 'RES', initiative: 'INI', melee_skill: 'MSK', ranged_skill: 'RSK', melee_defense: 'MDF', ranged_defense: 'RDF' };
  function faces(base, cb) {
    if (root.BohemiaCrewFaces) return root.BohemiaCrewFaces.ready ? root.BohemiaCrewFaces.ready(cb) : cb();
    try { var s = document.createElement('script'); s.src = (base || '../engine/') + 'bohemia_crew_faces.js';
      s.onload = function () { try { root.BohemiaCrewFaces.ready ? root.BohemiaCrewFaces.ready(cb) : cb(); } catch (e) { cb(); } }; s.onerror = function () { cb(); };
      document.head.appendChild(s); } catch (e) { cb(); }
  }
  /* a head the faces cannot draw: the dark shape, never a stranger's face */
  function dim(x, n) { x.fillStyle = '#0c0a08'; x.fillRect(0, 0, n, n); x.fillStyle = '#2a2219'; x.beginPath(); x.ellipse(n / 2, n * .46, n * .24, n * .3, 0, 0, 7); x.fill(); x.fillRect(n * .3, n * .72, n * .4, n * .3); }
  function head(doc, look, n) {
    var c = doc.createElement('canvas'), F = root.BohemiaCrewFaces; c.width = c.height = n;
    var x = c.getContext('2d');
    if (F && look && F.has && F.has(look)) { c.width = c.height = F.SIZE || n; F.draw(c.getContext('2d'), look, F.SIZE || n, function () { dim(c.getContext('2d'), c.width); c.dataset.face = 'none'; }); c.dataset.face = 'fresh'; }
    else { dim(x, n); c.dataset.face = 'none'; }
    c.dataset.look = look || ''; return c;
  }
  /* HIS BODY, MOVING (ANIMATION's town cells, BohemiaIdles.activity, their NOTE): the same cell the town draws, at a whole-number zoom
     with smoothing off (the rig's pixels chunkier, never a smeared rim), facing three-quarter; his own seed and his place in the
     crew (o.n) so no two are in step; 'since' the moment he comes on, so his first key is a breath, never a pose snapping in.
     Redrawn only when his key changes. Null when his pictures are not in: then his head. */
  var ACTS = ['smoke', 'drink', 'talk'];
  function body(doc, m, i, z, now, pairOf) {
    var I = root.BohemiaIdles; if (!I || !I.activity || !m.look) return null;
    var act = ACTS[i % ACTS.length], has = I.activities ? I.activities(m.look) : [];
    if (has.indexOf(act) < 0) act = has.filter(function (a) { return ACTS.indexOf(a) >= 0; })[0] || has[0];
    if (!act) return null;
    var f = i % 2 ? 7 : 1, o = { act: act, n: i, since: now };
    if (act === 'talk' && pairOf) { o.pair = pairOf.pair; if (pairOf.partner) o.partner = true; f = pairOf.partner ? 7 : 1; }
    var W = 44, H = 118, c = doc.createElement('canvas'); c.width = W * z; c.height = H * z; c.dataset.look = m.look; c.dataset.face = 'wait'; c.dataset.act = act;
    var x = c.getContext('2d'), key = '';
    var e = { c: c, draw: function (t) {
      var q = I.activity(m.look, 'tape:' + (m.name || m.look), t, f, o); if (!q) return false;
      var k = q.img.src + ':' + q.x + ':' + q.y; if (k === key) return true; key = k;
      x.setTransform(1, 0, 0, 1, 0, 0); x.imageSmoothingEnabled = false; x.clearRect(0, 0, c.width, c.height);
      x.drawImage(q.img, q.x, q.y, q.w, q.h, Math.round(W * z / 2 - (q.foot[0] - q.dx) * z), Math.round((H - 5) * z - (q.foot[1] - q.dy) * z), q.w * z, q.h * z);
      c.dataset.face = 'cell'; return true; } };
    return e;
  }
  function css(doc) {
    if (doc.getElementById('squadup-css')) return;
    var st = doc.createElement('style'); st.id = 'squadup-css';
    st.textContent = '#squadup{position:fixed;inset:0;z-index:2147483000;background:#050403;color:#e9dcc4;overflow:hidden;cursor:pointer;touch-action:none;'
      + 'font-family:"BohemiaCasing",ui-monospace,Menlo,Consolas,monospace;-webkit-user-select:none;user-select:none;opacity:1;transition:opacity .4s}'
      + '#squadup.out{opacity:0}'
      + '#squadup canvas.grain{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;opacity:.22;pointer-events:none}'
      + '#squadup .scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.34) 0 1px,transparent 1px 3px);mix-blend-mode:multiply}'
      + '#squadup .band{position:absolute;left:0;right:0;height:9%;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(233,220,196,.07),transparent);top:-10%}'
      + '#squadup .vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.75) 100%)}'
      + '#squadup .osd{position:absolute;top:max(14px,env(safe-area-inset-top));left:16px;right:16px;display:flex;justify-content:space-between;font-size:13px;letter-spacing:2px;color:#e9dcc4;opacity:0;text-shadow:1px 0 rgba(255,40,60,.5),-1px 0 rgba(0,220,255,.45)}'
      + '#squadup .stage{position:absolute;left:0;right:0;top:50%;transform:translateY(-55%);display:flex;flex-direction:column;align-items:center;gap:12px;opacity:0;transition:opacity .18s}'
      + '#squadup .stage canvas.cell,#squadup .row canvas.cell{width:auto;height:auto;image-rendering:pixelated;filter:contrast(1.15) saturate(.6) brightness(.9) sepia(.15) drop-shadow(2px 0 rgba(255,30,60,.35)) drop-shadow(-2px 0 rgba(0,210,255,.3))}'
      + '#squadup .duo{display:flex;align-items:flex-end;justify-content:center;gap:10px}'
      + '#squadup .stage canvas.hd{width:min(44vw,30vh);height:min(44vw,30vh)}#squadup .stage canvas.hd.solo{width:min(62vw,44vh);height:min(62vw,44vh)}'
      + '#squadup .stage canvas:not(.cell){image-rendering:pixelated;filter:contrast(1.18) saturate(.55) brightness(.86) sepia(.18) drop-shadow(2px 0 rgba(255,30,60,.35)) drop-shadow(-2px 0 rgba(0,210,255,.3))}'
      + '#squadup .nm{font-size:clamp(20px,6vw,34px);letter-spacing:4px;color:#f4cf7c;text-shadow:2px 0 rgba(255,30,60,.45),-2px 0 rgba(0,210,255,.4)}'
      + '#squadup .tr{font-size:clamp(12px,3.4vw,16px);letter-spacing:3px;color:#d9c8a6}'
      + '#squadup .st{font-size:12px;letter-spacing:2px;color:#c9a75c}'
      + '#squadup .group{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;opacity:0;transition:opacity .3s;padding:0 16px}'
      + '#squadup .row{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;max-width:min(92vw,720px)}'
      + '#squadup .row canvas:not(.cell){width:clamp(44px,12vw,84px);height:clamp(44px,12vw,84px);image-rendering:pixelated;filter:contrast(1.18) saturate(.5) brightness(.85) sepia(.2)}'
      + '#squadup .on{font-size:clamp(18px,5.4vw,30px);letter-spacing:5px;color:#f4cf7c;text-align:center;text-shadow:2px 0 rgba(255,30,60,.45),-2px 0 rgba(0,210,255,.4)}'
      + '#squadup .cn{font-size:13px;letter-spacing:3px;color:#d9c8a6;text-align:center}'
      + '#squadup .skip{position:absolute;bottom:max(18px,env(safe-area-inset-bottom));left:0;right:0;text-align:center;font-size:11px;letter-spacing:3px;color:#8d7c5e;opacity:0;transition:opacity .4s}';
    (doc.head || doc.documentElement).appendChild(st);
  }
  function play(o) {
    o = o || {};
    var doc = o.doc || document, men = (o.men || []).filter(Boolean), done = false, t0 = performance.now(), timers = [], raf = 0;
    var live = [];
    var S = root.__SQUAD_UP = { origin: o.origin || null, men: men.map(function (m) { return m.name; }), shown: [], started: Date.now(), armedAt: null, skipped: false, endedAt: null, group: false };
    css(doc);
    var old = doc.getElementById('squadup'); if (old) old.remove();
    var w = doc.createElement('div'); w.id = 'squadup'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'your crew');
    var gc = doc.createElement('canvas'); gc.className = 'grain'; gc.width = 160; gc.height = 120; w.appendChild(gc);
    var stage = doc.createElement('div'); stage.className = 'stage'; w.appendChild(stage);
    var group = doc.createElement('div'); group.className = 'group'; w.appendChild(group);
    ['scan', 'band', 'vig'].forEach(function (k) { var e = doc.createElement('div'); e.className = k; w.appendChild(e); });
    var osd = doc.createElement('div'); osd.className = 'osd'; var pl = doc.createElement('span'); pl.textContent = '▶ PLAY'; var tc = doc.createElement('span'); tc.textContent = '00:00:00'; osd.appendChild(pl); osd.appendChild(tc); w.appendChild(osd);
    var sk = doc.createElement('div'); sk.className = 'skip'; sk.textContent = 'TAP TO SKIP'; w.appendChild(sk);   /* draft:true */
    (doc.body || doc.documentElement).appendChild(w);
    var band = w.querySelector('.band'), gx = gc.getContext('2d'), gim = gx.createImageData(160, 120), seed = 1234567;
    var song = function (phase) { try { var T = root.top || root; if (T && typeof T.__originSong === 'function') T.__originSong(o.origin || null, phase); } catch (e) {} };
    function tick() {
      if (done) return;
      var now = performance.now(), t = now - t0, d = gim.data;
      if (((t / BEAT) | 0) !== tick.k) { tick.k = (t / BEAT) | 0;   /* the grain, a new frame on the beat (a tape that repaints every frame costs the phone, and a recorder, for nothing) */
        for (var i = 0; i < d.length; i += 4) { seed = (seed * 1103515245 + 12345) >>> 0; var v = (seed >>> 24); d[i] = v; d[i + 1] = v * .92; d[i + 2] = v * .82; d[i + 3] = 255; }
        gx.putImageData(gim, 0, 0); gc.style.opacity = t < QUIET ? .07 : .22;   /* the first second is the tape's black, a breath of static */
        var jx = ((seed >>> 8) % 3) - 1; stage.style.marginLeft = jx + 'px';   /* the head a pixel off, on the beat */
        band.style.top = ((((tick.k * BEAT) / 3200) % 1.2) * 100 - 10).toFixed(1) + '%';   /* the tracking band rolls, a step a beat */
      }
      var s = Math.max(0, Math.floor((t - QUIET) / 1000)), tw = '00:00:' + (s < 10 ? '0' : '') + s; if (tc.textContent !== tw) tc.textContent = tw;   /* the counter, a second at a time */
      live.forEach(function (b) { if (b.c.isConnected) b.draw(now); });   /* his body moving: a repaint only when his key changes */
      raf = root.requestAnimationFrame(tick);
    }
    function end(skipped) {
      if (done) return; done = true; S.skipped = !!skipped; S.endedAt = Date.now();
      timers.forEach(clearTimeout); try { root.cancelAnimationFrame(raf); } catch (e) {}
      song('done');
      w.classList.add('out'); setTimeout(function () { try { w.remove(); } catch (e) {} }, skipped ? 200 : 400);
      if (o.onDone) try { o.onDone({ skipped: !!skipped }); } catch (e) {}
    }
    var arm = function () { S.armedAt = Date.now(); sk.style.opacity = 1; osd.style.opacity = .9; };
    var hit = function (e) { if (S.armedAt == null) return; if (e && e.preventDefault) e.preventDefault(); end(true); };   /* nothing in the first second: a tap then is no skip */
    w.addEventListener('pointerdown', hit); doc.addEventListener('keydown', function kd(e) { if (done) { doc.removeEventListener('keydown', kd); return; } if (/^(Escape|Enter| |Spacebar)$/.test(e.key)) hit(e); });
    tick();
    timers.push(setTimeout(arm, QUIET));
    song('intro');
    /* the quiet second loads them: every man's index and his first sheet (a call to activity starts the fetch) */
    try { var I0 = root.BohemiaIdles; if (I0 && I0.activities) men.forEach(function (m) { if (m.look) { I0.activities(m.look); ACTS.forEach(function (a) { I0.activity(m.look, 'tape:' + m.name, performance.now(), 1, { act: a, n: 0 }); }); } }); } catch (e) {}
    var zoom = function (frac) { var vh = (doc.defaultView || root).innerHeight || 800; return Math.max(1, Math.min(5, Math.floor(vh * frac / 118))); };
    var bodyOr = function (m, i, z, pair) { var b = body(doc, m, i, z, performance.now(), pair); if (b && b.draw(performance.now())) { b.c.className = 'cell'; live.push(b); return b.c; } return head(doc, m.look, 128); };
    faces(o.base, function () {
      if (done) return;
      var n = men.length, per = n <= 6 ? 2 * BEAT - 100 : Math.max(BEAT - 50, Math.round(5400 / n)), at = QUIET;
      men.forEach(function (m, i) {
        timers.push(setTimeout(function () {
          if (done) return; stage.textContent = ''; stage.style.opacity = 0;
          /* his face up close and his body moving beside it (his head alone where his pictures are not in) */
          var duo = doc.createElement('div'); duo.className = 'duo'; var hd = head(doc, m.look, 128); hd.className = 'hd'; duo.appendChild(hd);
          var bd = bodyOr(m, i, zoom(.36)); if (bd.className === 'cell') duo.appendChild(bd); else hd.className = 'hd solo'; stage.appendChild(duo);
          var nm = doc.createElement('div'); nm.className = 'nm'; nm.textContent = String(m.name || '').toUpperCase(); stage.appendChild(nm);
          if (m.trade) { var tr = doc.createElement('div'); tr.className = 'tr'; tr.textContent = String(m.trade).toUpperCase() + (m.level > 1 ? '  ·  LEVEL ' + m.level : ''); stage.appendChild(tr); }
          var ks = Object.keys(m.stars || {}).filter(function (k) { return m.stars[k] > 0; });
          if (ks.length) { var st = doc.createElement('div'); st.className = 'st'; st.textContent = ks.map(function (k) { return (STAT_SHORT[k] || k) + ' ' + '★'.repeat(m.stars[k]); }).join('   '); stage.appendChild(st); }
          root.requestAnimationFrame(function () { stage.style.opacity = 1; });
          S.shown.push(m.name);
        }, at));
        at += per;
      });
      timers.push(setTimeout(function () {
        if (done) return; stage.style.opacity = 0; group.textContent = ''; S.group = true;
        live = live.filter(function (b) { return false; });
        var gz = Math.max(1, Math.min(zoom(.26), Math.floor((((doc.defaultView || root).innerWidth || 390) * .9) / (44 * Math.max(1, Math.min(men.length, 6))))));
        var row = doc.createElement('div'); row.className = 'row';
        men.forEach(function (m, i) { var pr = men.length > 1 && i < men.length - (men.length % 2) ? { pair: 'tape:' + (i >> 1), partner: i % 2 === 1 } : null;   /* the crew together: two and two talking, turn and turn about */
          row.appendChild(bodyOr(m, pr ? 2 : i, gz, pr)); }); group.appendChild(row);
        var on = doc.createElement('div'); on.className = 'on'; on.textContent = String(o.originName || '').toUpperCase(); group.appendChild(on);
        if (o.crew) { var cn = doc.createElement('div'); cn.className = 'cn'; cn.textContent = String(o.crew).toUpperCase(); group.appendChild(cn); }
        group.style.opacity = 1;
      }, at));
      timers.push(setTimeout(function () { end(false); }, at + 4 * BEAT - 400));
    });
    return { skip: function () { end(true); }, el: w };
  }
  root.BohemiaSquadUpClose = { play: play, BEAT: BEAT, QUIET: QUIET };
})(typeof window !== 'undefined' ? window : this);
