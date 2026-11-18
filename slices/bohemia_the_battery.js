/* ============================================================================
   BOHEMIA -- THE BATTERY IS REAL (ECONOMY TWO, 11/18/26; VAMILY rule 459, ask line 645).

   PAOLO 9/4: 'for one AA battery a bag of rice.'
   PAOLO 11/17: 'some of the quests, it's like 3000 or like 1000 batteries to complete a quest and I'm like bro that's a
   lot... I want people to really feel like they can look at their battery right now and relate it from the game to real
   life: hey, because this game said it, it's true, this would probably cost a couple batteries in the economic apocalypse.'

   THE ONE TABLE is records/target/bb/battery_table.json. The AA is the unit; one AA buys a bag of rice. A SUM IS PAID IN THE
   FEWEST KINDS OF BATTERY, THE BIGGEST FIRST, each one a real thing a crew could carry (the research,
   records/BOHEMIA_RESEARCH_HOW_MANY_BATTERIES_ARE_IN_THE_UNITED_STATES_11_17_26.md: a rechargeable AA holds about 2.4 Wh, so
   a phone's battery is about 6 AA's, a tool pack 20, a car's battery 250): car batteries, then tool packs; what is left
   under a tool pack is phone batteries when they make it exactly, else AA's. Nobody counts out a thousand loose cells.

   THIS FILE IS ONLY THE DRAWING AND THE SPLIT. It holds no price. Every page that shows a number of batteries loads it:
     BohemiaBattery.split(1076)   [{ id:'car_battery', n:4 }, { id:'tool_pack', n:3 }, { id:'aa', n:16 }]  (each with worth, name, many)
     BohemiaBattery.words(1076)   '4 CAR BATTERIES, 3 TOOL PACKS, 16 AA' (a reader's line, a title, a gate)
     BohemiaBattery.html(1076)    the pictures and their counts; the page's own words for the sum stay in it at no size
     BohemiaBattery.node(1076)    the same as an element
     BohemiaBattery.dress(root)   every sum under root is drawn: 'N batteries' said in words, and the places a lane drew a
                                  number beside the old battery mark (a shelf's price, a stall's box, a hire, the bar's purse)
     BohemiaBattery.ladder()      the table's ladder, biggest first
   THE WORDS STAY IN THE PAGE (UI FOUR's rule, 11/17): an element's text is letter for letter what the page wrote, so every
   screen and every gate that reads it reads it. No word of a line changes (rule 454(a)): a sum is a NUMBER, and this draws
   the number. A page turns the drawing off for a checker with window.__BATTERY_OFF = true before it loads (the page as it was).
   HOW A SUM IS DRAWN IS UI FOUR'S (handoffs/UI_FOUR.md): the classes below (.bsum, .bsum-k with data-kind and data-n, .bsum-w)
   are the whole surface. (Never data-k: the no-scroll audit reads [data-k] as a press.)
   ============================================================================ */
(function (root) {
  'use strict';
  if (root.BohemiaBattery) return;
  var doc = root.document;
  /* __THE_TABLE_COPY__ the table's ladder, so the first frame before the file lands draws right. The gate
     (gates/the_battery_is_real_gate.js) fails this copy if it is not the table's, number for number. */
  var LADDER = [
    { id: 'car_battery', worth: 250, name: 'CAR BATTERY', many: 'CAR BATTERIES' },
    { id: 'tool_pack', worth: 20, name: 'TOOL PACK', many: 'TOOL PACKS' },
    { id: 'phone_battery', worth: 6, name: 'PHONE BATTERY', many: 'PHONE BATTERIES', only_whole: true },
    { id: 'aa', worth: 1, name: 'AA', many: 'AA' }
  ];
  /* __/THE_TABLE_COPY__ */
  var BASE = (function () {
    try { var s = doc.currentScript && doc.currentScript.src; if (s) return s.replace(/[^\/]*$/, ''); } catch (e) {}
    return '';
  })();
  var READY = false;
  function take(j) {
    try {
      var L = j && j.ladder && j.ladder.value; if (!L || !L.length) return false;
      var out = L.map(function (k) { return { id: String(k.id), worth: +k.worth, name: String(k.name), many: String(k.many || k.name), only_whole: !!k.only_whole }; })
        .filter(function (k) { return k.worth >= 1 && k.worth === Math.floor(k.worth); });
      out.sort(function (a, b) { return b.worth - a.worth; });
      if (!out.length || out[out.length - 1].worth !== 1) return false;   /* the unit is always there: every sum can be paid */
      var same = JSON.stringify(out) === JSON.stringify(LADDER.map(function (k) { return { id: k.id, worth: k.worth, name: k.name, many: k.many, only_whole: !!k.only_whole }; }));
      LADDER = out; READY = true;
      if (!same) { try { if (doc && doc.body) redraw(); } catch (e) {} }
      return true;
    } catch (e) { return false; }
  }
  try {
    if (typeof root.fetch === 'function' && doc) root.fetch(BASE + '../records/target/bb/battery_table.json').then(function (r) { return r.ok ? r.json() : null; }).then(take).catch(function () {});
  } catch (e) {}

  /* ---- the split: the fewest kinds of battery, the biggest first. A kind marked only_whole (the phone's battery) is used
     only when it pays everything that is left: 12 is two phone batteries, 13 is thirteen AA's (the prices were written in
     tens, and ten is ten AA's, never a phone battery and four). ---- */
  function split(n) {
    n = Math.max(0, Math.round(+n || 0)); var out = [];
    for (var i = 0; i < LADDER.length; i++) {
      var k = LADDER[i], c;
      if (k.only_whole) { if (n > 0 && n % k.worth === 0) { out.push({ id: k.id, n: n / k.worth, worth: k.worth, name: k.name, many: k.many }); n = 0; } continue; }
      c = Math.floor(n / k.worth);
      if (c > 0) { out.push({ id: k.id, n: c, worth: k.worth, name: k.name, many: k.many }); n -= c * k.worth; }
    }
    return out;
  }
  function unit() { return LADDER[LADDER.length - 1]; }
  function words(n) {
    var s = split(n); if (!s.length) return '0 ' + unit().many;
    return s.map(function (p) { return p.n + ' ' + (p.n === 1 ? p.name : p.many); }).join(', ');
  }
  function icon(id, big) { return BASE + 'battery_ladder/' + (big ? '' : 'small/') + id + '.png'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  /* the pictures and their counts. said: the page's own words for the sum ('57 batteries', or just '57'), kept letter for
     letter at no size. The counts are drawn by the style (content: attr(data-n)), so the element's text is only its words. */
  function html(n, o) {
    o = o || {}; n = Math.round(+n || 0);
    var neg = n < 0, s = split(Math.abs(n)), sign = o.sign != null ? o.sign : (neg ? '-' : ''), g = '';
    if (!s.length) s = [{ id: unit().id, n: 0 }];
    for (var i = 0; i < s.length; i++) g += '<i class="bsum-k" data-kind="' + s[i].id + '" data-n="' + s[i].n + '" style="--bsum-i:url(' + icon(s[i].id) + ')" aria-hidden="true"></i>';
    var said = o.said != null ? String(o.said) : (sign + Math.abs(n) + (Math.abs(n) === 1 ? ' battery' : ' batteries'));
    var wide = s.length === 2 && s[0].n > 9 && s[1].n > 9 ? ' data-wide="1"' : '';
    return '<i class="bsum' + (o.cls ? ' ' + o.cls : '') + (sign === '+' ? ' bsum-up' : sign ? ' bsum-dn' : '') + '" data-bsum="' + (neg ? -Math.abs(n) : n) + '" data-kinds="' + s.length + '"' + wide + ' title="' + esc((sign || '') + words(Math.abs(n))) + '">'
      + (sign ? '<i class="bsum-s" aria-hidden="true" data-s="' + esc(sign === '-' ? '−' : sign) + '"></i>' : '') + g + '<i class="bsum-w">' + esc(said) + '</i></i>';
  }
  function node(n, o) { var t = doc.createElement('template'); t.innerHTML = html(n, o); return t.content.firstChild; }

  var CSS = ''
    + '.bsum{display:inline-flex!important;flex-direction:row;align-items:center;gap:.36em;white-space:nowrap;vertical-align:middle;line-height:1;font-style:normal;text-indent:0;text-transform:none}'
    + '.bsum,.bsum>i{font-size:inherit!important;color:inherit!important;font-style:normal!important;letter-spacing:inherit;pointer-events:none}'   /* a page's own rule for every <i> (a shelf tile's is 16 px gold) never sizes a sum */
    + '.bsum>i.bsum-k{display:inline-flex;flex:0 0 auto;align-items:center;gap:.16em}'
    + '.bsum>i.bsum-k::before{content:"";flex:0 0 auto;display:block;width:max(1.3em,13px);height:max(1.3em,13px);background:var(--bsum-i) center/contain no-repeat}'
    + '.bsum>i.bsum-k::after{content:attr(data-n);font-weight:700;font-variant-numeric:tabular-nums}'
    + '.bsum>i.bsum-s::after{content:attr(data-s);font-weight:700}'
    + '.bsum>i.bsum-w{position:absolute!important;font-size:0!important;line-height:0!important;letter-spacing:0!important;width:0;height:0;overflow:hidden;margin:0!important;padding:0!important}'   /* the words, for the reader and for every screen that reads the line */
    /* the places a lane drew the old mark beside a number: the mark goes, the pictures stand in the number's place */
    + 'em.money.bsum-host::before{display:none!important}em.money.bsum-host{gap:0!important}'
    + '.sp.bsum-host>img,.pay.bsum-host>img.batt,.s.bats.bsum-host>img{display:none!important}'
    + '.nsp.bsum-host::after{display:none!important}.nsn.bsum-host>i.nsb{display:none!important}'
    + '.nsp.bsum-host .bsum,.nsn.bsum-host .bsum{gap:3px}.nsp.bsum-host .bsum>i.bsum-k,.nsn.bsum-host .bsum>i.bsum-k{gap:1px}.nsp.bsum-host .bsum>i.bsum-k::before,.nsn.bsum-host .bsum>i.bsum-k::before{width:12px;height:12px}'
    + '.nsn.bsum-host .bsum{margin-right:.4em}'
    /* a hire's button is 44 tall and about 80 wide: HIRE, his price under it, his night under that (a price of two kinds ran past the button beside the word) */
    + '.hire>.act:has(.nsp.bsum-host){grid-template-columns:auto!important;row-gap:0!important;justify-items:center}'
    + '.hire>.act:has(.nsp.bsum-host)>span{line-height:12px!important}.hire>.act:has(.nsp.bsum-host)>em .nsp{line-height:14px!important}.hire>.act:has(.nsp.bsum-host)>em .nsn{line-height:12px!important}'
    + '.retf>.act>em.bsum-host::after,.rett>.act>em.bsum-host::after{display:none!important}'
    + '.retf>.act>em.bsum-host .bsum,.rett>.act>em.bsum-host .bsum{gap:4px}.retf>.act>em.bsum-host .bsum>i.bsum-k::before,.rett>.act>em.bsum-host .bsum>i.bsum-k::before{width:13px;height:13px}'
    /* a shelf's tile is 45 points: the price is two short lines at the most, the biggest battery on top when there are three kinds */
    + 'html body #sheet .slot em.money.bsum-host,.slot em.money.bsum-host{font-size:9px!important;line-height:10px!important;letter-spacing:0!important;max-width:100%}'
    + '.slot em.money.bsum-host .bsum{flex-wrap:wrap;justify-content:center;gap:0 3px;white-space:normal;max-width:100%}'
    + '.slot em.money.bsum-host .bsum>i.bsum-k{gap:1px}.slot em.money.bsum-host .bsum>i.bsum-k::before{width:10px;height:10px}'
    + '.slot em.money.bsum-host .bsum[data-kinds="3"]>i.bsum-k:first-of-type{flex-basis:100%;justify-content:center}'
    + '.slot:has(em.money.bsum-host .bsum[data-kinds="3"])>img,.slot:has(em.money.bsum-host .bsum[data-wide="1"])>img,.slot:has(em.money.bsum-host .bsum[data-kinds="3"])>canvas,.slot:has(em.money.bsum-host .bsum[data-wide="1"])>canvas{height:46%!important;max-height:46%;min-height:0;flex:0 1 auto}'
    + '.slot em.money.bsum-host{flex:0 0 auto}'
    + '.count[data-count="batteries"]:has(.bsum)::before{display:none!important}.count[data-count="batteries"]:has(.bsum){padding-left:8px!important}'
    + '#bmtb .s.bats.bsum-host b{min-width:0!important}#bmtb .s.bats.bsum-host .bsum{gap:7px}#bmtb .s.bats.bsum-host .bsum>i.bsum-k{gap:3px}#bmtb .s.bats.bsum-host .bsum>i.bsum-k::before{width:26px;height:26px}'
    + '@media (max-width:480px){#bmtb .s.bats.bsum-host .bsum[data-kinds="3"]{gap:4px}#bmtb .s.bats.bsum-host .bsum[data-kinds="3"]>i.bsum-k{gap:1px}#bmtb .s.bats.bsum-host .bsum[data-kinds="3"]>i.bsum-k::before{width:20px;height:20px}#bmtb .s.bats.bsum-host:has(.bsum[data-kinds="3"]) b{font-size:14px!important}}'
    + '@media (max-width:359px){#bmtb .s.bats.bsum-host .bsum>i.bsum-k::before{width:20px;height:20px}#bmtb .s.bats.bsum-host .bsum[data-kinds="3"]>i.bsum-k::before{width:14px;height:14px}}'
    + '.uc.uc-bsum>b.uc-n::after{content:attr(data-n)}.uc.uc-bsum>i.uc-k,.uc.uc-bsum>b.uc-n{pointer-events:none}'   /* a picture is never a press: the finger goes through it to the button it stands on */
    + '.bsum-off .bsum>i.bsum-k,.bsum-off .bsum>i.bsum-s{display:none}.bsum-off .bsum>i.bsum-w{position:static!important;font-size:inherit!important;line-height:inherit!important;width:auto;height:auto}';
  function style() {
    if (!doc || doc.getElementById('bsum-css')) return;
    var st = doc.createElement('style'); st.id = 'bsum-css'; st.textContent = CSS; (doc.head || doc.documentElement).appendChild(st);
  }

  /* ---- the dresser ---- */
  var NUM = '(\\d{1,3}(?:,\\d{3})+|\\d+)';
  var RE = new RegExp('([+\\-\\u2212])?' + NUM + ' ?(batter(?:y|ies))\\b', 'gi'), TEST = /\d ?batter(?:y|ies)\b/i, BARE = new RegExp('^\\s*([+\\-\\u2212])?' + NUM + '\\s*$');
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1, TITLE: 1, NOSCRIPT: 1, CANVAS: 1, TEMPLATE: 1 };
  /* UI FOUR's own ground (slices/bohemia_ui_three_items.js counts()): it makes a chip of 'N batteries' there, and this
     file draws the chip. The words there are never touched twice. */
  var UC_SEL = '#sheet .act > em, #sheet .hcost > span, #sheet .hdesk > div, #sheet .slots, #sheet .stl > small, #sheet .acts > .gridh';
  var UC_PAGE = /SETTLEMENT_SCREEN/.test(String(root.location && root.location.pathname || ''));
  var LOG = { runs: 0, made: 0 };
  function off() { return !!root.__BATTERY_OFF; }
  function num(s) { return parseInt(String(s).replace(/,/g, ''), 10); }
  function skipped(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentNode) {
      if (SKIP[e.nodeName]) return true;
      if (e.classList && (e.classList.contains('bsum') || e.classList.contains('uc') || e.classList.contains('nsp') || e.classList.contains('nsn'))) return true;
      if (e.isContentEditable || (e.getAttribute && e.getAttribute('data-bsum-raw') != null)) return true;   /* data-bsum-raw: a line a lane wants left in words */
    }
    try { if (UC_PAGE && el.closest && el.closest(UC_SEL)) return true; } catch (x) {}
    return false;
  }
  function dressText(tn) {
    var v = tn.nodeValue; if (!v || !TEST.test(v)) return 0;
    if (!tn.parentNode || skipped(tn.parentNode)) return 0;
    var m, last = 0, frag = null, made = 0; RE.lastIndex = 0;
    while ((m = RE.exec(v))) {
      var n = num(m[2]); if (!isFinite(n)) continue;
      if (!frag) frag = doc.createDocumentFragment();
      if (m.index > last) frag.appendChild(doc.createTextNode(v.slice(last, m.index)));
      frag.appendChild(node(n, { sign: m[1] || '', said: m[0] }));
      last = m.index + m[0].length; made++;
    }
    if (!frag) return 0;
    if (last < v.length) frag.appendChild(doc.createTextNode(v.slice(last)));
    tn.parentNode.replaceChild(frag, tn);
    return made;
  }
  /* the first bare number among an element's own text nodes becomes the pictures (its words kept in them) */
  function dressOwnNumber(e) {
    for (var c = e.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 1 && c.classList && c.classList.contains('bsum')) return 0;   /* drawn already */
      if (c.nodeType !== 3) continue;
      var m = BARE.exec(c.nodeValue); if (!m) continue;
      e.replaceChild(node(num(m[2]), { sign: m[1] || '', said: c.nodeValue }), c); e.classList.add('bsum-host');
      return 1;
    }
    return 0;
  }
  /* THE PLACES A LANE DREW A NUMBER BESIDE THE OLD BATTERY MARK (each lane its own way; found on the page 11/18):
       em.money                    a shelf's or a bag's price tile (the settlement screen; its mark was ::before)
       .sp with the battery img    the stall's BUY and SELL boxes
       .pay with img.batt          a job on the map's phone
       b.nsp, b.nsn                a hire's price and his night (slices/bohemia_ui_no_scroll.js moneyMarks)
       #bmtb .s.bats               the bar's purse (slices/bohemia_ui_materials.js)
       .retf / .rett .act > em     the price of one who joins the camp
       [data-bsum-sum]             any element a lane marks as a bare number of batteries */
  var HOSTS = 'em.money, .sp, .pay, b.nsp, b.nsn, #bmtb .s.bats, .retf .act > em, .rett .act > em, [data-bsum-sum]';
  function dressHost(e) {
    if (!e || !e.matches) return 0;
    for (var p = e.parentNode; p && p.nodeType === 1; p = p.parentNode) if (p.classList && p.classList.contains('bsum')) return 0;
    if (e.matches('.sp')) { if (!e.querySelector(':scope > img[src*="batteries"]')) return 0; return dressOwnNumber(e); }
    if (e.matches('.pay')) { if (!e.querySelector(':scope > img.batt')) return 0; return dressOwnNumber(e); }
    if (e.matches('#bmtb .s.bats')) { var b = e.querySelector(':scope > b'); if (!b) return 0; var r = dressOwnNumber(b); if (r) e.classList.add('bsum-host'); return r; }
    return dressOwnNumber(e);
  }
  /* UI FOUR's chip for 'N batteries' (i.uc[data-uc=batteries]: the old mark, then <b>N</b>, then the words at no size):
     the same chip, the ladder's pictures in the mark's place, each with its count; the chip's text is still 'N batteries' */
  function dressChip(c) {
    if (!c || !c.dataset || c.dataset.uc !== 'batteries' || c.classList.contains('uc-bsum')) return 0;
    var n = num(c.dataset.n); if (!isFinite(n)) return 0;
    var b = c.querySelector(':scope > b'), p = c.querySelector(':scope > i.uc-p'); if (!b || !p) return 0;
    var s = split(n); if (!s.length) s = [{ id: unit().id, n: 0 }];
    var w = doc.createElement('i'); w.className = 'uc-w'; w.textContent = b.textContent;   /* the number's own letters, kept */
    var frag = doc.createDocumentFragment();
    for (var i = 0; i < s.length; i++) {
      var k = doc.createElement('i'); k.className = 'uc-i uc-p uc-k'; k.setAttribute('aria-hidden', 'true'); k.style.backgroundImage = 'url(' + icon(s[i].id) + ')'; k.dataset.kind = s[i].id;
      var q = doc.createElement('b'); q.className = 'uc-n'; q.dataset.n = s[i].n; q.setAttribute('aria-hidden', 'true');
      frag.appendChild(k); frag.appendChild(q);
    }
    frag.appendChild(w);
    c.insertBefore(frag, p); c.removeChild(p); c.removeChild(b);
    c.classList.add('uc-bsum'); c.title = words(n); c.dataset.kinds = s.length;
    return 1;
  }
  function dress(rootEl) {
    if (off() || !doc) return 0; rootEl = rootEl || doc.body; if (!rootEl) return 0;
    style(); var made = 0, x, i, q;
    if (rootEl.nodeType === 3) { made = dressText(rootEl); LOG.made += made; return made; }
    if (rootEl.nodeType !== 1 && rootEl.nodeType !== 9 && rootEl.nodeType !== 11) return 0;
    if (rootEl.nodeType === 1 && rootEl.classList && rootEl.classList.contains('bsum')) return 0;
    var w = doc.createTreeWalker(rootEl, 4 /* SHOW_TEXT */), nodes = [];
    while ((x = w.nextNode())) if (TEST.test(x.nodeValue)) nodes.push(x);
    for (i = 0; i < nodes.length; i++) made += dressText(nodes[i]);
    try {
      if (rootEl.matches && rootEl.matches(HOSTS)) made += dressHost(rootEl);
      q = rootEl.querySelectorAll ? rootEl.querySelectorAll(HOSTS) : [];
      for (i = 0; i < q.length; i++) made += dressHost(q[i]);
      if (rootEl.matches && rootEl.matches('i.uc[data-uc="batteries"]')) made += dressChip(rootEl);
      q = rootEl.querySelectorAll ? rootEl.querySelectorAll('i.uc[data-uc="batteries"]') : [];
      for (i = 0; i < q.length; i++) made += dressChip(q[i]);
      /* a host whose number was written into it later (textContent = '138'): its parent is what changed */
      var h = rootEl.parentNode && rootEl.parentNode.closest ? rootEl.parentNode.closest(HOSTS) : null; if (h) made += dressHost(h);
    } catch (e) {}
    LOG.made += made; LOG.runs++;
    return made;
  }
  /* a modder's table landed after the first frame: every drawn sum is drawn again from its own number */
  function redraw() {
    if (!doc || !doc.body) return;
    var q = doc.querySelectorAll('i.bsum[data-bsum]');
    for (var i = 0; i < q.length; i++) {
      var e = q[i], w = e.querySelector('i.bsum-w'), s = e.querySelector('i.bsum-s');
      var n = parseInt(e.getAttribute('data-bsum'), 10); if (!isFinite(n)) continue;
      e.parentNode.replaceChild(node(Math.abs(n), { sign: s ? (s.getAttribute('data-s') === '−' ? '-' : s.getAttribute('data-s')) : '', said: w ? w.textContent : null }), e);
    }
  }

  /* ---- the watch: anything a page writes later is drawn before the next frame (an observer's turn comes before paint) ---- */
  var MO = null, BUSY = false;
  function watch() {
    if (!doc || !doc.body || MO || off() || typeof root.MutationObserver !== 'function') return;
    style();
    MO = new root.MutationObserver(function (list) {
      if (BUSY || off()) return; BUSY = true;
      try {
        for (var i = 0; i < list.length; i++) {
          var m = list[i], t = m.target;
          if (m.type === 'characterData') { if (t && t.isConnected) dress(t.parentNode && t.parentNode.matches && t.parentNode.matches(HOSTS) ? t.parentNode : t); continue; }
          if (m.type === 'attributes') { if (t && t.isConnected) dress(t); continue; }
          for (var j = 0; j < m.addedNodes.length; j++) { var a = m.addedNodes[j]; if (a && a.isConnected && (a.nodeType === 3 || a.nodeType === 1)) dress(a); }
        }
      } catch (e) {}
      try { MO.takeRecords(); } catch (e2) {}   /* what this turn wrote is its own: never drawn twice */
      BUSY = false;
    });
    MO.observe(doc.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['data-uc'] });
    try { dress(doc.body); MO.takeRecords(); } catch (e) {}
  }
  if (doc) {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', watch); else watch();
    if (root.addEventListener) root.addEventListener('load', function () { watch(); try { dress(doc.body); } catch (e) {} });
  }

  root.BohemiaBattery = { split: split, words: words, html: html, node: node, dress: dress, redraw: redraw, icon: icon, style: style,
    ladder: function () { return LADDER.map(function (k) { return { id: k.id, worth: k.worth, name: k.name, many: k.many, only_whole: !!k.only_whole }; }); },
    ready: function () { return READY; }, log: LOG, take: take, BASE: BASE, HOSTS: HOSTS };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.BohemiaBattery;
})(typeof window !== 'undefined' ? window : this);
