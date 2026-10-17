/* ONE SCREEN, the HUD laid in the browser only (UI [one screen], rule 110's swing, 10/17/26). Runs INSIDE the page the driver
   opened (the map's city frame, the settlement screen, the rebuilt fight) and builds the same bar on each from the materials file's
   own generators (cardboard, tape, receipt, glass, the cut edge): nothing here is drawn fresh and nothing is written to the game.
   THE LAW OF THE LAYOUT: the top is the one bar, the same on every screen (the clock the screen runs on, the place, the six
   supplies at his packs' pixels on a strip of glass, CREW and NOTES as receipt tags at the right end, every press 44 points); the
   screen's own row rides under it (the fight's turn strip); the big action keeps the bottom right corner (the map's speed pad, the
   settlement's LEAVE, the fight's END TURN). Real buttons are MOVED into the bar, never cloned, so every handler stays.
   window.__bmOneScreen(screen, imgs) lays it; window.__bmOneScreenMeasure() reads it back for the sheet and the gate. */
(function () {
  'use strict';
  var ORDER = ['batteries', 'food', 'meds', 'rounds', 'tape', 'water'];
  function u(c) { return 'url(' + c.toDataURL('image/png') + ')'; }
  function css(vars) {
    return ''
      + '#bmhud{position:fixed;left:0;right:0;top:0;z-index:40;box-sizing:border-box;padding:max(6px,env(safe-area-inset-top)) 8px 0;display:flex;flex-direction:column;gap:0;'
      + 'font-family:"BohemiaCasing",ui-sans-serif,sans-serif;color:#f2e4c6;'
      + 'background:' + vars.edge + ' bottom left/252px 10px repeat-x,linear-gradient(rgba(12,8,4,.45),rgba(12,8,4,.45)),#3a2c1e ' + vars.card + ' 0 0/256px 100%;box-shadow:0 1px 0 #000}'
      + '#bmhud.flat{flex-direction:row;align-items:center;gap:8px;padding-bottom:14px}'
      + '#bmhud .bmrow1{display:flex;align-items:center;gap:6px;min-height:44px;padding:0 0 6px}'
      + '#bmhud.flat .bmrow1{padding:0;flex:1 1 auto;min-width:0}'
      + '#bmhud .bmtag,#bmaction .bmtag{display:inline-flex;align-items:center;min-height:44px;padding:0 10px;box-sizing:border-box;color:#1f1710;font-size:11px;font-weight:normal;letter-spacing:.8px;line-height:1;white-space:nowrap;'
      + 'background:#e2dac6 ' + vars.receipt + ' center/100% 100%;filter:drop-shadow(0 1px 0 rgba(0,0,0,.85));border:0;border-radius:0;box-shadow:none;font-family:inherit;cursor:default;text-align:left;margin:0;position:static;transform:none;width:auto;height:auto}'
      + '#bmhud .bmtag.press,#bmaction .bmtag.press{cursor:pointer;min-width:52px}'
      + '#bmhud .bmtag.place{max-width:46%;overflow:hidden;text-overflow:ellipsis;display:inline-block;line-height:44px}'
      + '#bmhud .bmsp{flex:1 1 auto}'
      + '#bmhud.flat .bmtag.place{flex:0 0 auto;max-width:30%}'   /* the place keeps its name on its side; the turn strip is what shrinks */
      + '#bmhud #notebtn #noteplate,#bmhud .bmplate{display:inline;background:none!important;border:0!important;box-shadow:none!important;filter:none!important;padding:0!important;margin:0!important;font:inherit!important;color:inherit!important;letter-spacing:inherit!important;transform:none!important}'
      + '#bmhud .bmsix{display:flex;justify-content:space-between;align-items:center;gap:2px;height:40px;margin:0 0 14px;padding:2px 8px;box-sizing:border-box;'
      + 'background:#16130f ' + vars.glass + ' center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.18),0 1px 0 #000;border-top:1px solid #0d0a07}'
      + '#bmhud.flat .bmsix{margin:0;flex:0 0 auto;gap:10px;height:44px}'
      + '#bmhud .bmsix .s{display:inline-flex;align-items:center;gap:3px;font-size:13px;color:#f0c46a;font-weight:bold}'
      + '#bmhud .bmsix .s.none b{color:#bfb39a;opacity:.6}'
      + '#bmhud .bmsix img{display:block;image-rendering:pixelated;object-fit:contain}'
      + '#bmhud .bmturn{display:flex;align-items:center;gap:6px;height:46px;margin:-8px 0 6px}'
      + '#bmhud .bmturn #order{flex:1 1 auto;min-width:0}'
      + '#bmhud.flat .bmturn{flex:1 1 auto;min-width:120px;margin:0;height:44px;overflow:hidden}'
      + '#bmhud.flat .bmrow1 .bmsix{margin:0 6px 0 0;width:300px;flex:0 0 300px}'   /* one width on its side, so the strip sits at one x whatever the counts */
      + '#bmhud.flat .bmturn #bauto{flex:0 0 auto}'
      /* the big action corner on the settlement: LEAVE on the speed pad's taped card */
      + '#bmaction{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;position:fixed;right:10px;bottom:max(12px,env(safe-area-inset-bottom));z-index:40;padding:8px 6px 6px;border-radius:2px;'
      + 'background:linear-gradient(rgba(12,8,4,.4),rgba(12,8,4,.4)),#3a2c1e ' + vars.card + ' 0 0/256px 100%;filter:drop-shadow(0 1px 0 #000)}'
      + '#bmaction::before{content:"";position:absolute;top:-6px;left:50%;width:56px;height:14px;margin-left:-28px;background:' + vars.tape + ' center/100% 100%;transform:rotate(-2deg)}'
      + '#bmaction .bmtag{min-width:76px;justify-content:center;font-size:12px}'
      /* the settlement's other code boxes, in the materials: the heard line a receipt like the fight's, the sheet a cardboard card */
      + 'html body #heard{background:transparent;border:0;color:#1f1710;font-family:"BohemiaROM",ui-monospace,monospace}'
      + 'html body #heard:not(:empty){margin:0 10px 6px;padding:4px 10px;background:#e2dac6 ' + vars.receipt + ' center/cover;box-shadow:0 2px 3px rgba(0,0,0,.55)}'
      + 'html body #sheet{border:0;background:linear-gradient(rgba(12,8,4,.32),rgba(12,8,4,.32)),#3a2c1e ' + vars.card + ' 0 0/192px 192px;box-shadow:0 -2px 0 #000}'
      + 'html body #sheet::before{content:"";position:absolute;top:-7px;left:24px;width:64px;height:16px;background:' + vars.tape + ' center/100% 100%;transform:rotate(-3deg)}'
      /* the fight's last code-drawn things: the three meters and the action pips printed on receipt paper, ink on paper */
      + 'html body #stats .bar{background:#e2dac6 ' + vars.receipt + ' center/cover;border-radius:0;box-shadow:0 1px 0 rgba(0,0,0,.7);height:6px}'
      + 'html body #stats .bar i{box-shadow:none}'
      + 'html body #ap i{border-radius:0;background:#e2dac6 ' + vars.receipt + ' center/cover;box-shadow:0 1px 0 rgba(0,0,0,.7)}'
      + 'html body #ap i.on{background:linear-gradient(#f4cf7c,#d9a650)}'
      + 'html body #face{border-radius:0;box-shadow:0 0 0 1px #0d0a07,0 2px 3px rgba(0,0,0,.6)}';
  }
  function tag(text, cls) { var s = document.createElement('span'); s.className = 'bmtag ' + (cls || ''); s.textContent = text; return s; }
  function adopt(el, cls) { el.classList.add('bmtag'); (cls || '').split(' ').filter(Boolean).forEach(function (c) { el.classList.add(c); }); el.removeAttribute('style'); return el; }
  window.__bmOneScreen = function (screen, imgs) {
    var M = window.BohemiaMaterials; if (!M) throw new Error('no materials file on this screen');
    var vars = { card: u(M.cardboard()), tape: u(M.tape()), receipt: u(M.receipt()), glass: u(M.glass()) };
    var e = M.cardedge(), f = document.createElement('canvas'); f.width = e.width; f.height = e.height; var g = f.getContext('2d');
    g.translate(0, e.height); g.scale(1, -1); g.drawImage(e, 0, 0); vars.edge = u(f);   /* the flutes face down, toward the world */
    var old = document.getElementById('bmhud'); if (old) old.remove();
    var st = document.getElementById('bmhudcss'); if (!st) { st = document.createElement('style'); st.id = 'bmhudcss'; document.head.appendChild(st); }
    st.textContent = css(vars);
    var hud = document.createElement('div'); hud.id = 'bmhud'; if (innerWidth >= 700) hud.classList.add('flat');
    var row = document.createElement('div'); row.className = 'bmrow1';
    var six = document.createElement('div'); six.className = 'bmsix';
    var counts = {}, clock = '', place = '', crew = null, notes = null, host = document.body;
    if (screen === 'map') {
      var hc = document.getElementById('hclock'), hs = document.getElementById('hslot');
      clock = hc ? hc.textContent.trim() : ''; place = hs ? hs.textContent.trim().split('·')[0].trim() : '';
      document.querySelectorAll('#barread .sx').forEach(function (sx) { counts[sx.dataset.s] = { n: sx.querySelector('b').textContent.trim(), none: sx.classList.contains('none') }; });
      notes = document.getElementById('notebtn');
      var mb = document.getElementById('menubar'); if (mb) mb.style.display = 'none';
      host = document.querySelector('.wrap') || document.body;
    } else if (screen === 'settlement') {
      var S = window.BohemiaSettlement && BohemiaSettlement.state;
      clock = 'DAY ' + (((S && S.day) || 0) + 1); place = (document.getElementById('pname') || {}).textContent || '';
      var bat = /(\d+)/.exec((document.getElementById('bat') || {}).textContent || ''); if (bat) counts.batteries = { n: bat[1], none: false };
      crew = document.getElementById('crew');
      var bar = document.getElementById('bar'); if (bar) bar.style.display = 'none';
      var act = document.createElement('div'); act.id = 'bmaction'; act.appendChild(adopt(document.getElementById('leave'), 'press')); document.body.appendChild(act);
      /* the picture keeps the glass under the bar: the scene's top edge comes down to the bar's foot once laid */
    } else {
      clock = (document.getElementById('round') || {}).textContent || 'R1';
      place = ((window.FIGHT_OPTS && FIGHT_OPTS.kind) || 'the block').toUpperCase();
    }
    row.appendChild(adopt(screen === 'fight' ? document.getElementById('round') : tag(clock), 'clock'));
    row.appendChild(tag(place, 'place'));
    var sp = document.createElement('span'); sp.className = 'bmsp'; row.appendChild(sp);
    row.appendChild(crew ? adopt(crew, 'press crew') : tag('CREW', 'press crew'));
    if (notes) { row.appendChild(adopt(notes, 'press notes')); var np = document.getElementById('noteplate'); if (np) np.removeAttribute('style'), np.className = 'bmplate'; }
    else row.appendChild(tag('NOTES', 'press notes'));
    ORDER.forEach(function (k) {
      var c = counts[k] || { n: '–', none: true }; var s = document.createElement('span'); s.className = 's' + (c.none ? ' none' : ''); s.dataset.s = k;
      var im = document.createElement('img'); im.src = imgs[k]; im.alt = k; im.onload = function () { im.style.width = (im.naturalWidth / 3) + 'px'; im.style.height = (im.naturalHeight / 3) + 'px'; };
      s.appendChild(im); var b = document.createElement('b'); b.textContent = c.n; s.appendChild(b); six.appendChild(s);
    });
    /* THE RIGHT END IS ANCHORED: the six, CREW and NOTES sit at the same distance from the right edge on every screen, whatever the
       place's name is; upright the six take the second row, on its side they join the first row before CREW */
    var flat = hud.classList.contains('flat'), crewEl = row.querySelector('.crew');
    hud.appendChild(row); if (flat) row.insertBefore(six, crewEl); else hud.appendChild(six);
    var turn = null;
    if (screen === 'fight') {
      /* the fight's own row: under the one bar upright, between the place and the six on its side; #top stays the element the fight
         measures its board against, so the bar IS #top */
      var top = document.getElementById('top'); top.removeAttribute('style'); top.id = 'top'; top.className = '';
      turn = document.createElement('div'); turn.className = 'bmturn'; turn.appendChild(document.getElementById('order')); turn.appendChild(document.getElementById('bauto'));
      if (flat) { row.insertBefore(turn, sp); sp.style.display = 'none'; } else hud.appendChild(turn);
      top.innerHTML = ''; top.appendChild(hud); hud.id = 'bmhud'; top.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:4;padding:0;background:none;display:block';
      hud.style.position = 'static';
    } else host.insertBefore(hud, host.firstChild);
    var hb = hud.getBoundingClientRect().bottom;
    if (screen === 'settlement') { var app = document.getElementById('app'); if (app) app.style.paddingTop = Math.round(hb) + 'px'; }
    if (screen === 'map') { var ph = document.getElementById('cityfeed'); if (ph && ph.getBoundingClientRect().top < hb + 8) {
      /* the phone drops under the bar; on its side it keeps 19.5 by 9 and the foot of the glass */
      var room = innerHeight - (hb + 8) - 10, pr = ph.getBoundingClientRect();
      ph.style.setProperty('top', Math.round(hb + 8) + 'px', 'important');
      if (pr.height > room) { ph.style.setProperty('height', Math.round(room) + 'px', 'important'); ph.style.setProperty('width', Math.round(room * 9 / 19.5) + 'px', 'important'); ph.style.setProperty('--skin-phonew', Math.round(room * 9 / 19.5) + 'px'); }
    } }
    try { window.dispatchEvent(new Event('resize')); } catch (_e) {}
    return { clock: clock, place: place, counts: counts, flat: hud.classList.contains('flat'), hudBottom: hb, vars: vars };
  };
  window.__bmOneScreenMeasure = function () {
    var R = function (e) { if (!e) return null; var q = e.getBoundingClientRect(); return [q.x, q.y, q.width, q.height].map(function (v) { return +v.toFixed(2); }); };
    var hud = document.getElementById('bmhud');
    var out = { W: innerWidth, H: innerHeight, dpr: devicePixelRatio, hud: R(hud), clock: R(hud.querySelector('.clock')), place: R(hud.querySelector('.place')),
      crew: R(hud.querySelector('.crew')), notes: R(hud.querySelector('.notes')), six: R(hud.querySelector('.bmsix')), icons: [], turn: R(hud.querySelector('.bmturn')),
      action: R(document.getElementById('speedpad') || document.getElementById('bmaction') || document.getElementById('bend')),
      words: [] };
    hud.querySelectorAll('.bmsix img').forEach(function (im) { out.icons.push({ s: im.alt, box: R(im), nat: [im.naturalWidth, im.naturalHeight] }); });
    hud.querySelectorAll('.bmtag, .bmsix b').forEach(function (e) { out.words.push({ t: e.textContent.trim().slice(0, 24), box: R(e), ink: getComputedStyle(e).color }); });
    return out;
  };
})();
