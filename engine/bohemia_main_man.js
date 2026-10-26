/* ============================================================================
   BOHEMIA -- YOUR MAIN GUY (RUN THREE [make your main guy], 10/26/26, rule 263(b)(c))

   PAOLO 10/26: "before you start Bohemia should always be able to customize your main guy... it's probably gonna use a lot of
   the same UI stuff as when you go to the barber."
   MEASURED BEFORE: a new game had no step to make the main character; every origin's main man was the one look 'you', named
   YOU, on every screen.

   ONE MAN, WRITTEN ONCE (ONE ID, ONE WHOLE PERSON): localStorage bohemia.main.v1 = {look, name, parts, origin, made, at}. Every
   reader asks this file (or reads that one key): the roster's main man (engine/bohemia_roster.js lookFor and manOf: the crew
   screen, the hall, the town), the fight's company (engine/bohemia_condition.js named: the origin's first man), the tape
   (BOHEMIA_CITY_WORLD.html startSquad), the town's lead (leadLook) and the valley's casts (engine/bohemia_rig_bodies.js
   isCompany: nobody else is dealt his body). No record: the origin's main man, as before ('you', YOU).
     BohemiaMainMan.get()          the record, or null
     BohemiaMainMan.look() / name()   his look ('you' when none) and his name ('YOU' when none)
     BohemiaMainMan.pool()         the men he can be: every WHOLE man the game has drawn (his body on the map, in the fight and in
                                   the town, and his own HD face), never one of the company's own: the origin's own man first,
                                   then the valley's rolled people (engine/bohemia_people_mix.js, fight: true, company: false)
     BohemiaMainMan.make(o)        THE CHAIR: the screen that makes him, over o.doc; o.onDone({look, name, made}) when GO

   THE BARBER'S PARTS AND TAPS: the chair is the barber's (THE BARBER speaks, his face moving), the tiles are the barber's own
   renders (records/target/character/barber/<cut>, beard_<x>, mark_<x>, face_<x>: CHARACTER's barber's book on the barber's man)
   and the skin is the measured tone of the faces themselves. Rule 249: one tap lights a tile and shows the man in the mirror at
   once, in place (nothing moves, rule 250); a double tap (or a right click) takes it, and a taken part narrows the rest (a tile no
   whole man can wear with it goes dim, never away); a double tap again lets it go. Every man in the mirror is a whole man: the
   parts choose among the men the game has drawn, so the one he takes is the one every screen draws (no part is ever painted on
   a body that does not carry it). BUILD is not a row: every body is on the one master rig (real_dims 0.46 to 0.51 m wide, 1.61
   to 1.75 m tall, measured), so there is no build to pick until CHARACTER renders one (NOTE on its board).
   NOTHING IN THE FIRST SECOND (the second votes): the barber's lamp is off for the first second, then it flickers on; a tap
   before then does nothing. GO takes the man in the mirror; GO at once keeps the origin's own man (the default).
   ANALOG HORROR at the source: one tube over the chair, flickering on; the mirror is old glass with a crack in it; the tape's
   grain under everything.
   window.__MAIN_MAKER: what it showed and when, every tap, every part taken, the man and the name on GO (the gate reads it).
   Words are attempts, draft:true.
   ============================================================================ */
(function (root) {
  'use strict';
  var KEY = 'bohemia.main.v1', QUIET = 1000, DOUBLE = 380, BEAT = 500;
  var BARBER = '../records/target/character/barber/', CREWF = '../records/target/portrait/crew/';
  var BARBER_LOOK = 'person_town_20';   /* the man in the barber's apron: a rolled person of the place, his own HD face */
  var LINE = 'Sit, sit. Before the road takes you, who are you?';   /* draft:true */
  /* the six skins of the rolled people, light to dark, the colour of their own cheeks (measured: the mean of two 10 x 10 patches
     of every bare face's rest_128.png, records/target/character/barber/person_<id>/face/) */
  var SKINS = [['very light', 'PALE', '#9e7f70'], ['light', 'LIGHT', '#a08776'], ['intermediate', 'OLIVE', '#90725f'],
    ['tan', 'TAN', '#7a5d4f'], ['brown', 'BROWN', '#70554e'], ['dark', 'DARK', '#4d3933']];
  /* the origin's own main man (look 'you', PORTRAIT's crew head): his cheeks measure #967a6d, the palest; his hair his own */
  var YOU = { look: 'you', gang: 'own', skin: 'very light', cut: 'HIS OWN', beard: null, mark: null, face: null, hat: null, sex: 'm' };

  function get() { try { var m = JSON.parse(root.localStorage.getItem(KEY) || 'null'); return m && typeof m === 'object' && m.look ? m : null; } catch (e) { return null; } }
  function look() { var m = get(); return (m && m.look) || 'you'; }
  function name() { var m = get(); return (m && m.name) || 'YOU'; }
  function put(m) { try { root.localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {} return m; }
  function clear() { try { root.localStorage.removeItem(KEY); } catch (e) {} }
  function pool() {
    var M = root.BOHEMIA_PEOPLE_MIX, out = [YOU];
    if (M && M.people) M.people.forEach(function (p) { if (p && p.fight && !p.company && p.look) out.push({ look: p.look, gang: p.gang, skin: p.skin, cut: p.cut, beard: p.beard || null, mark: p.mark || null, face: p.face || null, hat: p.hat || null, sex: p.sex || null }); });
    return out;
  }
  var ROWS = [{ id: 'skin', word: 'SKIN' }, { id: 'hair', word: 'HAIR' }, { id: 'beard', word: 'BEARD' }, { id: 'face', word: 'FACE' }];
  function partOf(r, m) { return r === 'skin' ? m.skin : r === 'hair' ? m.cut : r === 'beard' ? m.beard : (m.mark || m.face || null); }
  function match(r, m, v) { if (r !== 'face') return (partOf(r, m) || null) === v; return v === null ? !m.mark && !m.face : (m.mark === v || m.face === v); }
  function values(P, r) {
    var seen = {}, out = [];
    if (r === 'skin') return SKINS.map(function (s) { return s[0]; }).filter(function (s) { return P.some(function (m) { return m.skin === s; }); });
    var add = function (v) { var k = String(v); if (!seen[k]) { seen[k] = 1; out.push(v); } };
    if (r === 'hair') { if (P.some(function (m) { return m.cut === 'HIS OWN'; })) add('HIS OWN'); P.map(function (m) { return m.cut; }).filter(function (c) { return c && c !== 'HIS OWN'; }).sort().forEach(add); }
    if (r === 'beard') { add(null); P.map(function (m) { return m.beard; }).filter(Boolean).sort().forEach(add); }
    if (r === 'face') { add(null); P.map(function (m) { return m.mark; }).filter(Boolean).sort().forEach(add); P.map(function (m) { return m.face; }).filter(Boolean).sort().forEach(add); }
    return out;
  }
  function tag(v) { return String(v).toLowerCase().replace(/[ -]/g, '_'); }
  function art(r, v) {
    if (r === 'skin') return null;
    if (r === 'hair') return v === 'HIS OWN' ? CREWF + 'you/rest_128.png' : BARBER + tag(v) + '/rig_portrait_S.png';
    if (v === null) return BARBER + 'home_clippers/rig_portrait_S.png';   /* clean: the barber's man with nothing on his face */
    if (r === 'beard') return BARBER + 'beard_' + tag(v) + '/rig_portrait_S.png';
    return /^FACE /.test(v) ? BARBER + tag(v) + '/rig_portrait_S.png' : BARBER + 'mark_' + tag(v) + '/rig_portrait_S.png';
  }
  function word(r, v) {
    if (r === 'skin') { for (var i = 0; i < SKINS.length; i++) if (SKINS[i][0] === v) return SKINS[i][1]; return String(v).toUpperCase(); }
    if (v === null) return 'CLEAN';
    return String(v).replace(/^FACE /, '');
  }
  var IMG = {};
  function image(u, cb) {
    var e = IMG[u];
    if (!e) { e = IMG[u] = { im: new root.Image(), ok: false, bad: false, w: [] }; e.im.onload = function () { e.ok = true; e.w.splice(0).forEach(function (f) { f(e.im); }); }; e.im.onerror = function () { e.bad = true; e.w.splice(0).forEach(function (f) { f(null); }); }; e.im.src = u; }
    if (e.ok) cb(e.im); else if (e.bad) cb(null); else e.w.push(cb);
  }

  function css(doc) {
    if (doc.getElementById('mainmaker-css')) return;
    var st = doc.createElement('style'); st.id = 'mainmaker-css';
    st.textContent = ''
      + '#mainmaker{position:fixed;inset:0;z-index:2147483001;background:#070504;color:#e9dcc4;overflow:hidden;display:flex;flex-direction:column;'
      + 'font:13px/1.3 ui-monospace,Menlo,Consolas,monospace;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;'
      + 'padding:max(10px,env(safe-area-inset-top)) 12px max(10px,env(safe-area-inset-bottom));box-sizing:border-box;gap:8px}'
      + '#mainmaker *{box-sizing:border-box}'
      + '#mainmaker .grain{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;opacity:.08;pointer-events:none;z-index:3}'
      + '#mainmaker .tube{position:absolute;left:0;right:0;top:0;height:46%;pointer-events:none;z-index:0;background:radial-gradient(ellipse at 50% 0,rgba(236,226,190,.13),transparent 70%)}'
      + '#mainmaker .dark{position:absolute;inset:0;background:#050403;z-index:4;pointer-events:none;animation:mmlamp 1.45s linear forwards}'
      + '@keyframes mmlamp{0%{opacity:1}62%{opacity:1}66%{opacity:.35}70%{opacity:.92}75%{opacity:.18}80%{opacity:.62}86%{opacity:.08}100%{opacity:0}}'
      + '#mainmaker .wrap{position:relative;z-index:1;flex:1;min-height:0;display:flex;flex-direction:column;gap:8px;overflow-y:auto}'
      + '#mainmaker .left,#mainmaker .right{display:flex;flex-direction:column;gap:8px;min-height:0;min-width:0}'
      + '#mainmaker .left{flex:1 1 auto}'
      + '#mainmaker .who{display:flex;gap:10px;align-items:center;min-height:56px}'
      + '#mainmaker .who canvas{width:52px;height:52px;flex:0 0 52px;border:1px solid #3a2f24;border-radius:3px;background:#0b0907;image-rendering:pixelated}'
      + '#mainmaker .who .nm{color:#d9a85a;font-size:11px;letter-spacing:2px}#mainmaker .who p{margin:3px 0 0}'
      + '#mainmaker .mirror{position:relative;flex:1 1 0;min-height:140px;display:flex;align-items:flex-end;justify-content:center;gap:14px;padding:8px;'
      + 'border:2px solid #3b3024;border-radius:3px;background:radial-gradient(ellipse at 50% 30%,#1d1812 0,#0d0a08 62%,#080605 100%);'
      + 'box-shadow:inset 0 0 0 1px #0a0806,inset 0 0 30px rgba(0,0,0,.9),0 0 0 1px #5b4934,0 3px 0 #000;overflow:hidden;touch-action:manipulation}'
      + '#mainmaker .mirror canvas{image-rendering:pixelated;image-rendering:crisp-edges}'
      + '#mainmaker .mirror canvas.crack{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.55}'
      + '#mainmaker .mirror canvas.hd{width:112px;height:112px;align-self:center;filter:contrast(1.08) saturate(.8) sepia(.12)}'
      + '#mainmaker .mirror canvas.body{filter:contrast(1.06) saturate(.85) sepia(.1)}'
      + '#mainmaker .namebar{display:flex;align-items:center;gap:8px}'
      + '#mainmaker .namebar b{color:#d9a85a;font-size:10px;letter-spacing:2px;width:44px;flex:none}'
      + '#mainmaker input{flex:1;min-width:0;min-height:52px;font:inherit;font-size:16px;letter-spacing:3px;text-transform:uppercase;color:#f4cf7c;'
      + 'background:linear-gradient(#0c0907,#15100c);border:1px solid #3a2f24;border-radius:3px;padding:6px 10px;box-shadow:inset 0 2px 6px rgba(0,0,0,.85);outline:none}'
      + '#mainmaker input:focus{border-color:#d9a85a}#mainmaker input::placeholder{color:#8d7c5e}'
      + '#mainmaker .rows{display:flex;flex-direction:column;gap:6px;min-width:0}'
      + '#mainmaker .row{display:flex;align-items:center;gap:6px;min-width:0}'
      + '#mainmaker .row b{width:44px;flex:none;color:#d9a85a;font-size:10px;letter-spacing:2px}'
      + '#mainmaker .strip{display:flex;gap:6px;overflow-x:auto;overflow-y:hidden;padding:3px 3px 5px;flex:1;min-width:0;touch-action:pan-x;scrollbar-width:none}'
      + '#mainmaker .strip::-webkit-scrollbar{display:none}'
      + '#mainmaker .tile{position:relative;flex:0 0 54px;width:54px;height:70px;padding:0;margin:0;border:1px solid #2a2119;border-radius:3px;cursor:pointer;'
      + 'background:linear-gradient(#0c0907,#17120d);box-shadow:inset 0 2px 7px rgba(0,0,0,.9),inset 0 -1px 0 rgba(255,235,200,.06),0 1px 0 rgba(255,235,200,.04);'
      + 'color:#cdbb98;font:inherit;font-size:8px;letter-spacing:.5px;line-height:1.05;touch-action:manipulation;overflow:hidden}'
      + '#mainmaker .tile canvas{position:absolute;left:3px;top:3px;width:46px;height:44px;image-rendering:pixelated;border-radius:2px}'
      + '#mainmaker .tile span{position:absolute;left:2px;right:2px;bottom:3px;height:18px;display:flex;align-items:flex-end;justify-content:center;text-align:center;pointer-events:none}'
      + '#mainmaker .tile[data-row="skin"]{height:54px}#mainmaker .tile[data-row="skin"] canvas{height:28px}'
      + '#mainmaker .tile.on{border-color:#6a5638}'
      + '#mainmaker .tile.on span{color:#f0dcb2}'
      + '#mainmaker .tile.sel{outline:2px solid #f4cf7c;outline-offset:1px;box-shadow:inset 0 2px 7px rgba(0,0,0,.9),0 0 10px rgba(244,207,124,.35)}'
      + '#mainmaker .tile.took{border-color:#d9a85a;background:linear-gradient(#1a140d,#231a10)}'
      + '#mainmaker .tile.took::after{content:"";position:absolute;right:3px;top:3px;width:7px;height:7px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff1c9 0 18%,#e8b04a 18% 60%,#6b4512 60%)}'
      + '#mainmaker .tile.dead{opacity:.3;filter:grayscale(.7)}'
      + '#mainmaker .facts{height:34px;flex:none;display:flex;align-items:center;padding:0 10px;border:1px solid #2a2119;border-radius:3px;background:#0d0a08;'
      + 'color:#d9c8a6;font-size:11px;letter-spacing:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '#mainmaker .go{flex:0 0 34%;min-height:52px;font:inherit;font-size:18px;font-weight:700;letter-spacing:6px;color:#1a120a;cursor:pointer;'
      + 'background:linear-gradient(180deg,#f2d28a 0 46%,#d9a85a 46% 100%);border:1px solid #6f5126;border-radius:3px;'
      + 'box-shadow:inset 0 1px 0 #fff0c4,inset 0 -2px 0 #8a6427,0 2px 0 #000,0 3px 6px rgba(0,0,0,.6);touch-action:manipulation}'
      + '#mainmaker .go:active{box-shadow:inset 0 2px 0 #8a6427,0 1px 0 #000}'
      /* the computer, the glass wider than tall: the mirror and his name on the left, the barber's parts on the right */
      + '@media (min-aspect-ratio:1/1){#mainmaker .wrap{flex-direction:row;gap:14px}#mainmaker .left{flex:0 0 40%}#mainmaker .right{flex:1 1 auto;justify-content:flex-end}'
      + '#mainmaker .tile{flex-basis:66px;width:66px;height:84px}#mainmaker .tile canvas{width:58px;height:54px}}';
    (doc.head || doc.documentElement).appendChild(st);
  }

  function make(o) {
    o = o || {};
    var doc = o.doc || document, P = pool(), cur = P[0], taken = {}, sel = null, done = false, t0 = performance.now(), raf = 0, f = 1, timers = [];
    var defName = String(o.defaultName || 'YOU').toUpperCase();
    var S = root.__MAIN_MAKER = { origin: o.origin || null, pool: P.length, shown: Date.now(), armedAt: null, taps: [], took: [], man: cur.look, name: null, done: null, made: null };
    css(doc);
    var old = doc.getElementById('mainmaker'); if (old) old.remove();
    var w = doc.createElement('div'); w.id = 'mainmaker'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'make your main guy');
    var tube = doc.createElement('div'); tube.className = 'tube'; w.appendChild(tube);
    var wrap = doc.createElement('div'); wrap.className = 'wrap'; w.appendChild(wrap);
    var L = doc.createElement('div'); L.className = 'left'; wrap.appendChild(L);
    var R = doc.createElement('div'); R.className = 'right'; wrap.appendChild(R);
    /* THE BARBER, speaking from his own face (a quest's text comes from a mouth with a portrait) */
    var who = doc.createElement('div'); who.className = 'who'; var bf = doc.createElement('canvas'); bf.width = bf.height = 64; who.appendChild(bf);
    var say = doc.createElement('div'); var bn = doc.createElement('div'); bn.className = 'nm'; bn.textContent = 'THE BARBER'; say.appendChild(bn);
    var bl = doc.createElement('p'); bl.textContent = LINE; say.appendChild(bl); who.appendChild(say); L.appendChild(who);
    /* THE MIRROR: his whole body and his face, the man every screen will draw */
    var mir = doc.createElement('div'); mir.className = 'mirror'; L.appendChild(mir);
    var crack = doc.createElement('canvas'); crack.className = 'crack'; crack.width = 120; crack.height = 160; mir.appendChild(crack);
    var bc = doc.createElement('canvas'); bc.className = 'body'; mir.appendChild(bc);
    var hc = doc.createElement('canvas'); hc.className = 'hd'; hc.width = hc.height = 128; mir.appendChild(hc);
    var nb = doc.createElement('div'); nb.className = 'namebar'; var nl = doc.createElement('b'); nl.textContent = 'NAME'; nb.appendChild(nl);
    var inp = doc.createElement('input'); inp.type = 'text'; inp.maxLength = 14; inp.placeholder = defName; inp.setAttribute('autocomplete', 'off'); inp.setAttribute('autocapitalize', 'characters'); inp.setAttribute('spellcheck', 'false'); inp.setAttribute('aria-label', 'his name');
    nb.appendChild(inp);
    var rows = doc.createElement('div'); rows.className = 'rows'; R.appendChild(rows);
    var facts = doc.createElement('div'); facts.className = 'facts'; R.appendChild(facts);
    var go = doc.createElement('button'); go.className = 'go'; go.type = 'button'; go.textContent = 'GO'; nb.appendChild(go); R.appendChild(nb);   /* his name and GO, one bar at the thumb */
    var gc = doc.createElement('canvas'); gc.className = 'grain'; gc.width = 120; gc.height = 90; w.appendChild(gc);
    var dark = doc.createElement('div'); dark.className = 'dark'; w.appendChild(dark);
    (doc.body || doc.documentElement).appendChild(w);

    /* the crack in the old glass, drawn once (his own seed) */
    (function () { var x = crack.getContext('2d'), s = 9871 + P.length, rnd = function () { s = (s * 1103515245 + 12345) >>> 0; return (s >>> 8) / 16777216; };
      x.strokeStyle = 'rgba(214,200,170,.35)'; x.lineWidth = 0.6; x.beginPath(); var px = 92, py = 0; x.moveTo(px, py);
      for (var i = 0; i < 9; i++) { px += (rnd() - .62) * 14; py += 6 + rnd() * 14; x.lineTo(px, py); }
      x.stroke(); x.beginPath(); x.moveTo(px - 4, py - 30); x.lineTo(px - 18, py - 16); x.stroke(); })();

    /* the tiles: built once, in place; a tap only changes their classes (rule 250) */
    var TILES = [];
    ROWS.forEach(function (r) {
      var row = doc.createElement('div'); row.className = 'row'; var b = doc.createElement('b'); b.textContent = r.word; row.appendChild(b);
      var strip = doc.createElement('div'); strip.className = 'strip'; row.appendChild(strip); rows.appendChild(row);
      values(P, r.id).forEach(function (v) {
        var t = doc.createElement('button'); t.type = 'button'; t.className = 'tile'; t.dataset.row = r.id; t.dataset.v = v === null ? '' : v;
        var c = doc.createElement('canvas'); c.width = 50; c.height = 48; t.appendChild(c);
        var sp = doc.createElement('span'); sp.textContent = word(r.id, v); t.appendChild(sp);
        var x = c.getContext('2d'); x.imageSmoothingEnabled = false;
        if (r.id === 'skin') { var sw = SKINS.filter(function (s) { return s[0] === v; })[0]; x.fillStyle = sw ? sw[2] : '#777'; x.fillRect(4, 4, 42, 40);
          x.fillStyle = 'rgba(255,240,210,.12)'; x.fillRect(4, 4, 42, 3); x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(4, 41, 42, 3); }
        else image(art(r.id, v), function (im) { if (!im) return; var hw = im.naturalWidth, own = r.id === 'hair' && v === 'HIS OWN';
          /* the barber's man's head and shoulders: the top of the render, square, his face in the middle */
          var sw = own ? hw : Math.min(hw, im.naturalHeight * .72), sx = (hw - sw) / 2, sy = own ? 0 : 0;
          x.drawImage(im, sx, sy, sw, sw * 48 / 50, 0, 0, 50, 48); });
        var e = { t: t, row: r.id, v: v, last: 0, down: null };
        t.addEventListener('pointerdown', function (ev) { e.down = [ev.clientX, ev.clientY]; });
        t.addEventListener('pointerup', function (ev) { if (ev.button === 2) return; var d = e.down; e.down = null;
          if (d && Math.abs(ev.clientX - d[0]) + Math.abs(ev.clientY - d[1]) > 10) return;   /* a finger sliding the strip is no tap */
          tapTile(e, ev); });
        t.addEventListener('contextmenu', function (ev) { ev.preventDefault(); takeTile(e); });   /* a right click is the double tap (Battle Brothers') */
        TILES.push(e); strip.appendChild(t);
      });
    });

    function fits(m, except) { for (var k in taken) if (k !== except && !match(k, m, taken[k])) return false; return true; }
    function same(a, b) { var n = 0; ROWS.forEach(function (r) { if ((partOf(r.id, a) || null) === (partOf(r.id, b) || null)) n++; }); return n; }
    function pick(row, v) {
      var c = P.filter(function (m) { return fits(m, row) && (row == null || match(row, m, v)); });
      if (!c.length) return null;
      if (c.indexOf(cur) >= 0) return cur;   /* the man on show still wears it: nothing changes that need not */
      var best = c[0], bs = -1; c.forEach(function (m) { var s = same(m, cur); if (s > bs) { bs = s; best = m; } });   /* the nearest man: the fewest parts changed */
      return best;
    }
    function alive(e) { return P.some(function (m) { return fits(m, e.row) && match(e.row, m, e.v); }); }
    function refresh() {
      TILES.forEach(function (e) {
        var k = e.t.classList, d = !alive(e);
        k.toggle('dead', d); k.toggle('on', match(e.row, cur, e.v)); k.toggle('sel', !!sel && sel === e); k.toggle('took', e.row in taken && taken[e.row] === e.v);
        e.t.setAttribute('aria-pressed', k.contains('took') ? 'true' : 'false');
      });
      var n = P.filter(function (m) { return fits(m, null); }).length;
      facts.textContent = (Object.keys(taken).length ? n + (n === 1 ? ' MAN FITS' : ' MEN FIT') + ':  ' : '')
        + ROWS.map(function (r) { return word(r.id, r.id === 'face' ? (cur.mark || cur.face || null) : (partOf(r.id, cur) || null)); }).join(' · ');
      w.dataset.man = cur.look;
    }
    function show(m) { if (!m || m === cur) { refresh(); return; } cur = m; S.man = m.look; bodyKey = ''; still = null; drawHead(); refresh(); }
    function armed() { return S.armedAt != null; }
    function tapTile(e, ev) {
      if (!armed() || done || e.t.classList.contains('dead')) return;
      var now = Date.now(), dbl = sel === e && now - e.last < DOUBLE; e.last = now;
      S.taps.push({ row: e.row, v: e.v, t: now - S.shown, dbl: dbl });
      if (dbl) return takeTile(e);
      sel = e; show(pick(e.row, e.v)); refresh();
    }
    function takeTile(e) {
      if (!armed() || done || e.t.classList.contains('dead')) return;
      if (e.row in taken && taken[e.row] === e.v) { delete taken[e.row]; S.took.push({ row: e.row, v: e.v, let: true }); }   /* a double tap again lets it go */
      else { taken[e.row] = e.v; S.took.push({ row: e.row, v: e.v }); }
      sel = e; show(pick(null, null) || cur); refresh();
    }
    inp.addEventListener('input', function () { var v = inp.value.toUpperCase().replace(/[^A-Z' -]/g, '').replace(/\s+/g, ' '); if (v !== inp.value) inp.value = v; });
    inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') inp.blur(); });
    /* his face, PORTRAIT's head of the very man (engine/bohemia_crew_faces.js) */
    function drawHead() {
      var F = root.BohemiaCrewFaces, x = hc.getContext('2d'); x.clearRect(0, 0, 128, 128); hc.dataset.look = cur.look;
      if (F && F.has && F.has(cur.look)) { F.draw(x, cur.look, 128, function () { hc.dataset.face = 'none'; }); hc.dataset.face = 'fresh'; } else hc.dataset.face = 'none';
    }
    /* his body: ANIMATION's breathing idle (the crew card's), at a whole number of screen pixels to the render's; his standing
       still until it is in; a tap on him turns him an eighth */
    var W = 88, H = 128, z = 2, bodyKey = '', still = null;
    /* the biggest whole number that fits the mirror with his face beside him: his face 128 render pixels at one or two screen
       pixels each (112 on a phone, 256 on a computer), his body at one to three */
    var hdOf = function (zz) { return zz >= 3 ? 256 : 112; };
    function zoom() { var r = mir.getBoundingClientRect(); for (var zz = 3; zz > 1; zz--) if (W * zz + hdOf(zz) + 30 <= r.width && H * zz + 16 <= r.height) return zz; return 1; }
    function sizeBody() { z = zoom(); bc.width = W * z; bc.height = H * z; bc.style.width = W * z + 'px'; bc.style.height = H * z + 'px';
      hc.style.width = hc.style.height = hdOf(z) + 'px'; bodyKey = ''; still = null; }
    function drawBody(now) {
      var I = root.BohemiaIdles, x = bc.getContext('2d'), q = null;
      try { q = I && I.frame ? I.frame(cur.look, 'main:' + cur.look, now, f, { set: 'bare', since: t0 }) : null; } catch (e) { q = null; }
      if (q && q.img) {
        var k = q.img.src + ':' + q.x + ':' + q.y + ':' + z; if (k === bodyKey) return; bodyKey = k;
        x.setTransform(1, 0, 0, 1, 0, 0); x.imageSmoothingEnabled = false; x.clearRect(0, 0, bc.width, bc.height);
        x.drawImage(q.img, q.x, q.y, q.w, q.h, Math.round(W * z / 2 - (q.foot[0] - q.dx) * z), Math.round((H - 4) * z - (q.foot[1] - q.dy) * z), q.w * z, q.h * z);
        bc.dataset.body = 'idle'; bc.dataset.look = cur.look; return;
      }
      var B = root.BohemiaRigBodies, turn = (B && B.TURNS ? B.TURNS : ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'])[f % 8], k2 = 'still:' + cur.look + ':' + turn + ':' + z;
      if (k2 === bodyKey || !B || !B.image) return;
      if (still !== k2) { still = k2; var lk = cur.look; B.image(lk, turn, function (im) { if (!im || cur.look !== lk || bodyKey === k2) return; bodyKey = k2;
        x.setTransform(1, 0, 0, 1, 0, 0); x.imageSmoothingEnabled = false; x.clearRect(0, 0, bc.width, bc.height);
        var iw = im.naturalWidth, ih = im.naturalHeight, s = Math.max(1, Math.floor(Math.min(bc.width / iw, bc.height / ih)));
        x.drawImage(im, Math.round((bc.width - iw * s) / 2), bc.height - ih * s, iw * s, ih * s); bc.dataset.body = 'still'; bc.dataset.look = lk; }); }
    }
    bc.addEventListener('pointerup', function () { if (!armed() || done) return; f = (f + 1) % 8; bodyKey = ''; still = null; });
    var gx = gc.getContext('2d'), gim = gx.createImageData(120, 90), seed = 424242;
    function tick() {
      if (done) return;
      var now = performance.now(), t = now - t0;
      if (((t / BEAT) | 0) !== tick.k) { tick.k = (t / BEAT) | 0; var d = gim.data;   /* the grain, a new frame on the beat */
        for (var i = 0; i < d.length; i += 4) { seed = (seed * 1103515245 + 12345) >>> 0; var v = seed >>> 24; d[i] = v; d[i + 1] = v * .92; d[i + 2] = v * .82; d[i + 3] = 255; }
        gx.putImageData(gim, 0, 0);
        tube.style.opacity = t < QUIET ? 0 : (0.82 + ((seed >>> 9) % 19) / 100).toFixed(2);   /* the tube's own hum, a step a beat */
      }
      drawBody(now);
      raf = root.requestAnimationFrame(tick);
    }
    function end() {
      if (done || !armed()) return; done = true;
      var nm = inp.value.trim().replace(/\s+/g, ' ').toUpperCase(), parts = {};
      ROWS.forEach(function (r) { parts[r.id] = r.id === 'face' ? (cur.mark || cur.face || null) : (partOf(r.id, cur) || null); });
      var rec = { look: cur.look, name: nm || defName, parts: parts, origin: o.origin || null, made: cur.look !== 'you' || !!nm, at: Date.now(), draft: true };
      put(rec);
      S.done = Date.now(); S.name = rec.name; S.made = rec.made; S.man = rec.look;
      timers.forEach(clearTimeout); try { root.cancelAnimationFrame(raf); } catch (e) {}
      try { inp.blur(); } catch (e) {}
      w.style.transition = 'opacity .25s'; w.style.opacity = '0'; setTimeout(function () { try { w.remove(); } catch (e) {} }, 260);
      if (o.onDone) try { o.onDone({ look: rec.look, name: rec.name, made: rec.made }); } catch (e) {}
    }
    go.addEventListener('click', function (ev) { if (ev && ev.preventDefault) ev.preventDefault(); end(); });
    timers.push(setTimeout(function () { S.armedAt = Date.now(); w.dataset.armed = '1';
      try { var F = root.BohemiaCrewFaces; if (F && F.talk) F.talk(bf, BARBER_LOOK, LINE); } catch (e) {} }, QUIET));
    var faces = function () { var F = root.BohemiaCrewFaces; if (F && F.has && F.has(BARBER_LOOK)) F.draw(bf.getContext('2d'), BARBER_LOOK, 64, function () {}); drawHead(); };
    if (root.BohemiaCrewFaces && root.BohemiaCrewFaces.ready) root.BohemiaCrewFaces.ready(faces); else faces();
    try { var I0 = root.BohemiaIdles; if (I0 && I0.load) I0.load(function () {}); } catch (e) {}
    sizeBody(); refresh(); tick();
    (doc.defaultView || root).addEventListener('resize', function rs() { if (done) { (doc.defaultView || root).removeEventListener('resize', rs); return; } sizeBody(); });
    return { el: w, go: end, man: function () { return cur; } };
  }

  root.BohemiaMainMan = { KEY: KEY, get: get, look: look, name: name, put: put, clear: clear, pool: pool, ROWS: ROWS, SKINS: SKINS, YOU: YOU,
    values: values, match: match, partOf: partOf, art: art, make: make, QUIET: QUIET };
})(typeof window !== 'undefined' ? window : this);
