/* THE TOP BAR, laid in the browser only (UI [the top bar], rule 121, 10/19/26). Paolo 10/19: 'I still don't like the top bar at
   the top of the screen... you could put so much things in the top of the screen... and then during combat it doesn't go away'.
   Runs INSIDE a page the driver opened and writes nothing to the game:
   - on the MAP (the demo's city frame): window.__bmTopBar(variant, facts, imgs) builds one of three bars over #menubar from the
     materials file's own generators (cardboard, receipt, glass), every fact read from the game by __bmTopBarFacts();
     A ONE ROW: the day and hour, then one pane of glass with batteries, food with the days it lasts, the crew with a tick per man;
     B TWO ROWS: the day and hour, the place, the crew, NOTES; under them the six stores at his packs' pixels and the food's days;
     C THE COMPANY ON TOP: the day dial, batteries, food and days; under them a card per man (what he was, his level, his health).
   - in the FIGHT (the rebuilt fight's frame): window.__bmFightNoTop() takes the strip off the top; the round, the turn order and
     AUTO ride the bottom bar's top edge, so the board runs to the top of the glass and the fight shows only its own strip.
   No gradient, glow, blur, soft shadow or corner over 2 (rule 114 D10): the light is drawn into the pixels (a darkened board, a
   1 px lit top line, a hard 1 px contact edge). Faces: CASING for labels, ROM for nothing here (no sentence on the bar). */
(function () {
  'use strict';
  var FONT = '"BohemiaCasing"';
  function url(c) { return 'url(' + c.toDataURL('image/png') + ')'; }
  /* the board darkened IN THE PIXELS (rule 114: never a CSS fade over it) */
  function dark(c, a) { var d = document.createElement('canvas'); d.width = c.width; d.height = c.height; var g = d.getContext('2d');
    g.drawImage(c, 0, 0); g.fillStyle = 'rgba(12,8,4,' + a + ')'; g.fillRect(0, 0, d.width, d.height); return d; }
  function flutes() { var M = window.BohemiaMaterials, e = M.cardedge(), f = document.createElement('canvas'); f.width = e.width; f.height = e.height;
    var g = f.getContext('2d'); g.translate(0, e.height); g.scale(1, -1); g.drawImage(e, 0, 0); return f; }
  /* the sun or the moon of the hour, 12 dots at 2 px (BB's day dial, as a mark) */
  function dial(min) {
    var h = (min / 60) % 24, sun = h >= 6 && h < 19, N = 12, S = 2, cv = document.createElement('canvas'); cv.width = cv.height = N * S;
    var g = cv.getContext('2d');
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var dx = x - 5.5, dy = y - 5.5, r = Math.sqrt(dx * dx + dy * dy), c = null;
      if (sun) { if (r < 3.6) c = (dx + dy < -1.5) ? '#ffe7a6' : '#f0b84e'; else if (r < 5.9 && (x === 5 || x === 6 || y === 5 || y === 6 || Math.abs(dx) === Math.abs(dy))) c = '#d99a3a'; }
      else { var ox = x - 7, oy = y - 4.5; if (r < 4.8 && Math.sqrt(ox * ox + oy * oy) > 3.6) c = (dx + dy < 0) ? '#f2ead2' : '#b9b2a0'; }
      if (c) { g.fillStyle = c; g.fillRect(x * S, y * S, S, S); }
    }
    return cv;
  }
  /* the gear as a drawn mark (the shell's is a symbol glyph, which resolves to the phone's own font: rule 114) */
  window.__bmGearMark = function () {
    var P = ['....##....', '..#.##.#..', '.########.', '..##..##..', '###....###', '###....###', '..##..##..', '.########.', '..#.##.#..', '....##....'],
      S = 2, cv = document.createElement('canvas'); cv.width = cv.height = 10 * S; var g = cv.getContext('2d');
    for (var y = 0; y < 10; y++) for (var x = 0; x < 10; x++) if (P[y][x] === '#') { g.fillStyle = (x + y < 9) ? '#3a2e20' : '#1f1710'; g.fillRect(x * S, y * S, S, S); }
    return cv.toDataURL('image/png');
  };
  /* what the bar says, every fact asked of the game, nothing kept here; null where the game knows nothing */
  window.__bmTopBarFacts = function () {
    var f = { day: null, min: null, hour: null, batteries: null, food: null, perDay: 1, daysLeft: null, crew: null, cap: null, place: null, six: {} };
    try { f.day = T.day | 0; f.min = T.min | 0; var s = String(clockStr()).split('·'); f.hour = s[s.length - 1].trim(); } catch (_e) {}
    try { var pb = purseBalances(); if (typeof pb.electricity === 'number') f.batteries = pb.electricity; if (typeof pb.resources === 'number') f.food = pb.resources; } catch (_e) {}
    /* the day eats one food (BohemiaPurse VERBS 'day:ate'; EVERYTHING COSTS ONE, the amount cannot be passed in), so the days it
       lasts are the food over one */
    if (typeof f.food === 'number') f.daysLeft = Math.floor(f.food / f.perDay);
    try { var t = om.at(city.x, city.y); f.place = (t && t.district) ? String(t.district).toUpperCase() : null; } catch (_e) {}
    try { var R = window.__BAR_READ; if (R && R.six) f.six = R.six; } catch (_e) {}
    /* the company the origin built (the front door's picks, the same list the fight is handed) */
    try { var p = window.parent.BOH_START && window.parent.BOH_START.picks(); if (p && p.company) {
      f.cap = p.cap || null;
      f.crew = p.company.map(function (m) { var hp = (typeof m.hp === 'number' && typeof m.hpMax === 'number' && m.hpMax > 0) ? m.hp / m.hpMax : 1;
        /* the background's id, said as a word: Battle Brothers' three companions by their weapon (companion_2hand is a 2-HAND) */
        var id = String(m.background || ''), word = /^companion_/.test(id) ? id.replace(/^companion_/, '').replace(/^(\d)hand$/, '$1-HAND') : id.replace(/_/g, ' ');
        return { background: word.toUpperCase(), id: id, level: m.level | 0, health: hp, carried: typeof m.hp === 'number' }; }); } } catch (_e) {}
    return f;
  };
  function css(v) {
    var tag = 'display:inline-flex;align-items:center;box-sizing:border-box;min-height:44px;padding:0 9px;color:#1f1710;background:#e2dac6 ' + v.receipt
      + ' center/100% 100%;border:0;border-radius:0;box-shadow:0 1px 0 #000;font-family:' + FONT + ';letter-spacing:.8px;line-height:1;white-space:nowrap;margin:0';
    return ''
      + '#menubar.bmtb>*{display:none!important}'
      + '#menubar.bmtb{display:block!important;height:auto!important;min-height:0!important;padding:0!important;background:' + v.edge + ' bottom left/252px 10px repeat-x,#2a2016 ' + v.card + ' 0 0/256px 100%!important;box-shadow:0 1px 0 #000!important}'
      + '#menubar.bmtb>#bmtb{display:flex!important;flex-direction:column;gap:6px;box-sizing:border-box;padding:max(6px,env(safe-area-inset-top)) 8px 16px;font-family:' + FONT + '}'
      + '#bmtb .r{display:flex;align-items:center;gap:6px;min-width:0}'
      + '#bmtb .t{' + tag + ';font-size:12px}'
      + '#bmtb .t.p{cursor:pointer;min-width:44px;justify-content:center}'
      + '#bmtb .t.n{padding:0 7px}'
      + '#bmtb .t.clock{flex-direction:column;align-items:flex-start;justify-content:center;gap:3px;padding:0 9px}'
      + '#bmtb .t.clock i{font-style:normal;font-size:9px;letter-spacing:1px}'
      + '#bmtb .t.clock b{font-size:15px;letter-spacing:1px;font-weight:normal}'
      + '#bmtb .t.place{max-width:118px;overflow:hidden;text-overflow:clip}'
      + '#bmtb .sp{flex:1 1 auto}'
      + '#bmtb .g{display:flex;align-items:center;gap:6px;box-sizing:border-box;min-height:44px;padding:0 6px;background:#16130f ' + v.glass + ' center/cover;'
      +   'box-shadow:inset 0 1px 0 rgba(255,236,200,.18),0 1px 0 #000;border:1px solid #0d0a07;border-radius:0;flex:1 1 auto;min-width:0}'
      + '#bmtb .s{display:inline-flex;align-items:center;gap:4px;color:#ffd98a;font-size:14px;white-space:nowrap}'
      + '#bmtb .s img,#bmtb .s canvas{display:block;image-rendering:pixelated}'
      + '#bmtb .s.none b{color:#ddd2b8}'
      + '#bmtb .s em{font-style:normal;font-size:10px;letter-spacing:.8px;color:#f2e4c6}'
      + '#bmtb .s em.low{color:#4a0a05;padding:3px 5px;background:#e2dac6 ' + v.receipt + ' center/100% 100%;box-shadow:0 1px 0 #000}'
      + '#bmtb .ticks{display:inline-flex;gap:2px;align-items:flex-end;height:14px}'
      + '#bmtb .ticks i{display:block;width:4px;height:14px;background:#2a231a;box-shadow:inset 0 -1px 0 #0d0a07}'
      + '#bmtb .ticks i b{display:block;width:4px;background:#8fd07a;position:relative}'
      + '#bmtb .t .ticks i{background:#b9ad92;box-shadow:inset 0 -1px 0 #6e6250} #bmtb .t .ticks i b{background:#2f6b2a}'
      + '#bmtb .ticks i.hurt b{background:#e0a24e} #bmtb .ticks i.bad b{background:#ff6a50} #bmtb .ticks i.cap{background:transparent;box-shadow:inset 0 0 0 1px #4a3e2c}'
      /* C's company row: a card per man on the cut board, read from the left */
      + '#bmtb .co{display:flex;gap:4px;align-items:stretch}'
      + '#bmtb .man{flex:1 1 0;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:3px;box-sizing:border-box;min-height:44px;padding:4px 6px;'
      +   'background:#16130f ' + v.glass + ' center/cover;border:1px solid #0d0a07;box-shadow:inset 0 1px 0 rgba(255,236,200,.18),0 1px 0 #000;color:#f2e4c6;font-size:9px;letter-spacing:.6px;white-space:nowrap;overflow:hidden}'
      + '#bmtb .man b{font-weight:normal;color:#ffd98a;font-size:10px}'
      + '#bmtb .man .hp{display:block;height:4px;background:#2a231a;box-shadow:0 1px 0 #0d0a07} #bmtb .man .hp i{display:block;height:4px;background:#8fd07a}'
      + '#bmtb .man.more{flex:0 0 auto;align-items:flex-start;color:#f2e4c6}'
      /* the shell's gear rides the bar's right end, a receipt tag like NOTES (laid from the top page) */
      + '';
  }
  function el(tagName, cls, html) { var e = document.createElement(tagName); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function ticks(crew, cap) { var h = '<span class="ticks">';
    crew.forEach(function (m) { var k = m.health >= 0.66 ? '' : (m.health >= 0.33 ? ' hurt' : ' bad'); h += '<i class="' + k + '"><b style="height:' + Math.max(2, Math.round(14 * m.health)) + 'px;top:' + (14 - Math.max(2, Math.round(14 * m.health))) + 'px"></b></i>'; });
    return h + '</span>'; }
  /* the day eats one, so when the bill is one the count and the days are the same number and it is printed once, as days */
  function food(f, img, words) { var low = typeof f.daysLeft === 'number' && f.daysLeft < 3, once = f.perDay === 1 && f.daysLeft != null;
    return '<span class="s' + (f.food == null ? ' none' : '') + '" data-f="food">' + img + (once ? '' : '<b>' + (f.food == null ? '–' : f.food) + '</b>')
      + (f.daysLeft == null ? '' : '<em class="' + (low ? 'low' : '') + '">' + f.daysLeft + (words ? (f.daysLeft === 1 ? ' DAY' : ' DAYS') : 'D') + '</em>') + '</span>'; }
  function crewS(f, mark) { var who = mark ? '<img alt="CREW" width="20" height="20" style="width:20px;height:20px" src="' + mark + '">' : '<em>CREW</em>';
    if (!f.crew) return '<span class="s none" data-f="crew">' + who + '<b>–</b></span>';
    return '<span class="s" data-f="crew">' + who + '<b>' + f.crew.length + (f.cap && !mark ? '<em>/' + f.cap + '</em>' : '') + '</b>' + ticks(f.crew, f.cap) + '</span>'; }
  /* a man, 10 dots at 2 px, lit top-left: the crew's mark where the bar has no room for the word */
  function manMark() { var P = ['...##.....', '..####....', '..####....', '...##.....', '.######...', '#.####.#..', '#.####.#..', '..#..#....', '..#..#....', '.##..##...'],
      S = 2, cv = document.createElement('canvas'); cv.width = cv.height = 10 * S; var g = cv.getContext('2d');
    for (var y = 0; y < 10; y++) for (var x = 0; x < 10; x++) if (P[y][x] === '#') { g.fillStyle = y < 4 ? '#ffe2a8' : '#e0b45c'; g.fillRect(x * S + 2, y * S, S, S); }
    return cv.toDataURL('image/png'); }
  window.__bmTopBar = function (variant, f, imgs) {
    var M = window.BohemiaMaterials; if (!M) throw new Error('no materials file on the map');
    var v = { card: url(dark(M.cardboard(), 0.5)), receipt: url(M.receipt()), glass: url(dark(M.glass(), 0.45)), edge: url(flutes()) };
    var old = document.getElementById('bmtbcss'); if (old) old.remove();
    var st = document.createElement('style'); st.id = 'bmtbcss'; st.textContent = css(v); document.head.appendChild(st);
    var bar = document.getElementById('menubar'); if (!bar) throw new Error('no #menubar');
    var prev = document.getElementById('bmtb'); if (prev) prev.remove();
    bar.classList.add('bmtb');
    var root = el('div'); root.id = 'bmtb'; root.dataset.variant = variant;
    var side = innerWidth > innerHeight;
    var I = function (k, px) { return imgs[k] ? '<img alt="" width="' + px + '" height="' + px + '" style="width:' + px + 'px;height:' + px + 'px" src="' + imgs[k] + '">' : ''; };
    var dz = dial(f.min || 0); dz.style.width = dz.style.height = '24px';
    var clock = el('span', 't clock', '<i>DAY ' + (f.day == null ? '–' : f.day) + '</i><b>' + (f.hour || '–') + '</b>'); clock.dataset.f = 'clock';
    var notes = el('span', 't p n', 'NOTES'); notes.dataset.f = 'notes';
    /* the shell's gear (SETTINGS, the top page's own button) is laid onto this slot by the shots tool, never cloned */
    var gear = el('span', 't p gear', ''); gear.dataset.f = 'gear'; gear.style.width = '44px';
    var r1 = el('div', 'r'), r2;
    if (variant === 'A') {
      r1.appendChild(clock);
      r1.appendChild(el('div', 'g', '<span class="s" data-f="batteries">' + I('batteries', 20) + '<b>' + (f.batteries == null ? '–' : f.batteries) + '</b></span>' + food(f, I('food', 20), true) + crewS(f, side ? null : manMark())));
      r1.appendChild(gear); r1.appendChild(notes); root.appendChild(r1);
    } else if (variant === 'B') {
      var place = el('span', 't place', f.place || ''); place.dataset.f = 'place';
      var crew = el('span', 't p', (f.crew ? 'CREW ' + f.crew.length + (f.cap ? '/' + f.cap : '') + ' ' + ticks(f.crew) : 'CREW')); crew.dataset.f = 'crew'; crew.style.gap = '6px';
      r1.appendChild(clock); if (f.place) r1.appendChild(place); r1.appendChild(el('span', 'sp')); r1.appendChild(crew); r1.appendChild(gear); r1.appendChild(notes);
      var six = ['batteries', 'food', 'meds', 'rounds', 'water'].map(function (k) {
        if (k === 'food') return food(f, I('food', 22), true);
        var n = k === 'batteries' ? f.batteries : (f.six ? f.six[k] : null);
        return '<span class="s' + (n == null ? ' none' : '') + '" data-f="' + k + '">' + I(k, 22) + '<b>' + (n == null ? '–' : n) + '</b></span>'; }).join('');
      r2 = el('div', 'r'); r2.appendChild(el('div', 'g', six));
      if (side) { r1.insertBefore(r2.firstChild, crew); root.appendChild(r1); } else { root.appendChild(r1); root.appendChild(r2); }
    } else {
      var dc = el('span', 't clock', ''); dc.dataset.f = 'clock'; dc.style.flexDirection = 'row'; dc.style.alignItems = 'center'; dc.style.gap = '7px';
      dc.appendChild(dz); dc.appendChild(el('span', '', '<i style="display:block;font-style:normal;font-size:9px;letter-spacing:1px">DAY ' + (f.day == null ? '–' : f.day) + '</i><b style="display:block;font-weight:normal;font-size:15px;letter-spacing:1px;margin-top:3px">' + (f.hour || '–') + '</b>'));
      r1.appendChild(dc);
      r1.appendChild(el('div', 'g', '<span class="s" data-f="batteries">' + I('batteries', 22) + '<b>' + (f.batteries == null ? '–' : f.batteries) + '</b></span>' + food(f, I('food', 22), true)));
      r1.appendChild(gear); r1.appendChild(notes); root.appendChild(r1);
      r2 = el('div', 'co'); r2.dataset.f = 'crew';
      var show = (f.crew || []).slice(0, side ? 8 : 4);
      show.forEach(function (m) { r2.appendChild(el('div', 'man', '<span>' + m.background + '</span><b>' + (m.level > 0 ? 'LV ' + m.level : 'NEW') + '</b><span class="hp"><i style="width:' + Math.round(100 * m.health) + '%"></i></span>')); });
      if (f.crew) r2.appendChild(el('div', 'man more', '<span>CREW</span><b>' + f.crew.length + (f.cap ? '/' + f.cap : '') + '</b>'));
      if (side) { r1.insertBefore(r2, gear); r2.style.flex = '1 1 auto'; r2.style.minWidth = '0'; root.appendChild(r1); } else root.appendChild(r2);
    }
    bar.appendChild(root);
    try { window.dispatchEvent(new Event('resize')); } catch (_e) {}
    var b = bar.getBoundingClientRect(); return { variant: variant, bottom: Math.round(b.bottom), height: Math.round(b.height), side: side };
  };
  /* read back for the sheet and the gate: every press and readout's box, its words, its ink and the face it resolves to */
  window.__bmTopBarMeasure = function () {
    var out = { W: innerWidth, H: innerHeight, items: [], fonts: [], css: (document.getElementById('bmtbcss') || {}).textContent || '' };
    var root = document.getElementById('bmtb') || document.getElementById('bmturnrow'); if (!root) return out;
    root.querySelectorAll('[data-f],.t,.man,.g,#round,#bauto,#order').forEach(function (e) { var r = e.getBoundingClientRect(), cs = getComputedStyle(e);
      out.items.push({ f: e.dataset.f || e.id || e.className, cls: String(e.className), text: (e.innerText || '').replace(/\s+/g, ' ').trim(), box: [r.x, r.y, r.width, r.height].map(Math.round),
        color: cs.color, font: cs.fontFamily, radius: cs.borderTopLeftRadius, bgi: (cs.backgroundImage || '').slice(0, 30) }); });
    /* every word on the bar with the ink it is printed in: an element that holds its own text */
    out.words = [];
    root.querySelectorAll('*').forEach(function (e) { var own = [].some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); });
      if (!own) return; var r = e.getBoundingClientRect(), cs = getComputedStyle(e); if (r.width < 1) return;
      out.words.push({ text: [].filter.call(e.childNodes, function (n) { return n.nodeType === 3; }).map(function (n) { return n.textContent; }).join('').trim(), box: [r.x, r.y, r.width, r.height].map(Math.round), color: cs.color, size: cs.fontSize }); });
    root.querySelectorAll('*').forEach(function (e) { var ff = getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, '').trim(); if (out.fonts.indexOf(ff) < 0 && (e.innerText || '').trim()) out.fonts.push(ff); });
    return out;
  };
  /* THE FIGHT WITH NOTHING ACROSS THE TOP: the strip is taken off and its three things ride the bottom bar's top edge. Real
     elements are MOVED, never cloned, so AUTO keeps its handler and the turn order keeps being drawn by the fight. */
  window.__bmFightNoTop = function () {
    var top = document.getElementById('top'), bot = document.getElementById('bot'); if (!top || !bot) throw new Error('no fight bars');
    var M = window.BohemiaMaterials, v = M ? { receipt: url(M.receipt()) } : { receipt: 'none' };
    var st = document.createElement('style'); st.id = 'bmtbcss'; st.textContent = ''
      + '#top{display:none!important}'
      + '#bmturnrow{display:flex;align-items:center;gap:6px;height:44px;margin:-4px 0 8px}'
      + '#bmturnrow #round{transform:none;box-shadow:0 1px 0 #000;font-family:' + FONT + ';font-weight:normal;letter-spacing:.8px;font-size:12px;padding:0 9px;height:44px;line-height:44px;box-sizing:border-box;background:#e2dac6 ' + v.receipt + ' center/100% 100%}'
      + '#bmturnrow #order{flex:1 1 auto;height:44px;padding:0 4px;background:transparent}'
      + '#bmturnrow #order canvas{width:34px!important;height:34px!important;border-radius:0;box-shadow:0 0 0 1px #0d0a07}'
      + '#bmturnrow #bauto{transform:none;box-shadow:0 1px 0 #000;font-family:' + FONT + ';font-weight:normal;letter-spacing:.8px;width:auto;min-width:52px;height:44px;padding:4px 9px;box-sizing:border-box;background:#e2dac6 ' + v.receipt + ' center/100% 100%}';
    document.head.appendChild(st);
    var row = document.createElement('div'); row.id = 'bmturnrow';
    ['round', 'order', 'bauto'].forEach(function (id) { var e = document.getElementById(id); if (e) row.appendChild(e); });
    bot.insertBefore(row, bot.firstChild);
    try { window.dispatchEvent(new Event('resize')); } catch (_e) {}
    var b = bot.getBoundingClientRect(); return { botTop: Math.round(b.top), topShown: getComputedStyle(top).display !== 'none' };
  };
})();
