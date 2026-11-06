/* BOHEMIA -- NOTHING HE CAN PRESS EVER SCROLLS  (UI 8, 11/6/26, rule 402, ask line 444)

   PAOLO 11/4: 'a lot of the UI is not intuitive enough... you want me to scroll, I never wanna scroll, scrolling is
   fucking illegal in my opinion... from the phone to the wide screen laptop, anything that's clickable I don't wanna
   scroll up and down anywhere ever again.'

   BATTLE BROTHERS' FLOOR: none of its screens scroll. The options menu is four tabs (video, audio, controls,
   gameplay); the stash is one fixed grid; the market is one fixed grid; the hiring board shows a few faces at a
   time. Ours is the same: every list fits the glass, and what does not fit is cut into PAGES he taps, never a
   scroll.

   THIS FILE is the one machine for it, loaded in every frame that has a box that could scroll (the shell, the town):

   BohemiaNoScroll.page(box, opts)   makes a box that would scroll into pages:
       the box is locked (overflow hidden, and a programmatic scroll is put back at once);
       its contents are cut into ATOMS (a block, a button, a recruit's card, one slot of a grid: a container taller
       than most of a page is cut into its own children, a card or a button never is);
       atoms are laid on pages greedily, each page filled until the next atom would not fit the box;
       a heading is never the last thing on a page (it goes over with what it heads);
       a strip at the box's top steps the pages: the page before, the dots (each a page he taps), the page after,
       and the words 'PAGE 2 OF 3' (draft:true); a swipe across the box is the next or the last page;
       an atom that cannot fit even alone (a very short glass) is drawn smaller to fit (zoom), never cut off.
     opts: { atoms: fn(box) -> container whose children are cut (default the box), keep: selector always shown
             (a sticky strip, a close button, the tabs), key: fn() -> what the box shows (a new key starts on page 1),
             room: px kept free at the foot }
     Re-cut on every change of what is inside (a MutationObserver on childList), on every resize, and when asked
     (BohemiaNoScroll.refresh()). The page he is on is kept unless it no longer exists.
   BohemiaNoScroll.reveal(el)   turns to the page that holds el (an element.scrollIntoView() inside a paged box does
       this instead of scrolling, so the game's own 'bring it into view' still works)
   BohemiaNoScroll.state(box)   { pages, at, atoms } for a checker

   THE SETTINGS CARD (#setcard, the shell's one card): tabs, Battle Brothers' options menu: SOUND, SCREEN, PLAY,
   GAME. Every row goes to a tab by its control's id (TABS below); a row nobody named goes to PLAY. A tab that still
   does not fit the glass (a phone on its side) is paged by the machine above. BACK TO THE GAME stays on every tab.
   A finger held on the phone opens the card on SCREEN (the phone's rows live there).

   NOTHING ELSE CHANGES: no row's code, no press, no word of another lane's is touched; this only hides and shows.
   [bb Battle Brothers' options are four tabs over one fixed panel; its world screens never scroll.]
   [analog horror: the pages turn like a CCTV monitor's channel switch: one hold of black, the next camera.] */
(function () {
  'use strict';
  if (window.BohemiaNoScroll) return;
  var BOXES = [];
  var HEAD = 'h1,h2,h3,h4,.gridh,.seth,.hd,.head';
  var WHOLE = 'button,a,input,select,textarea,canvas,img,p,.hire,.slot,.who,.act,.setrow,.pa,.jc,.org,[role=button],[data-ns-whole]';
  var STYLE = ''
    + '.ns-box{overflow:hidden!important;scrollbar-width:none}.ns-box::-webkit-scrollbar{display:none}'
    + '.ns-off{display:none!important}'
    + '.ns-bar{display:flex;align-items:center;justify-content:center;gap:6px;min-height:44px;margin:0 0 6px;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}'
    + '.ns-bar button{min-width:44px;min-height:44px;margin:0;padding:0 10px;border:1px solid rgba(13,10,7,.9);border-radius:2px;'
    + 'background:#2a2219 linear-gradient(160deg,rgba(255,240,200,.12),rgba(0,0,0,.25));color:#f0e2c4;font:bold 13px/1 "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1px;cursor:pointer;'
    + 'box-shadow:inset 0 1px 0 rgba(255,240,200,.22),0 1px 0 #000}'
    + '.ns-bar button:disabled{opacity:.35;cursor:default}'
    + '.ns-bar .ns-dots{display:flex;gap:4px;align-items:center}'
    + '.ns-bar .ns-dots button{min-width:30px;padding:0;font-size:11px}'
    + '.ns-bar .ns-dots button.on{background:linear-gradient(#e8b85e,#a8752c);color:#1f1710;border-color:#0d0a07}'
    + '.ns-bar .ns-of{font:10px/1 "BohemiaROM",ui-monospace,monospace;letter-spacing:1.5px;color:#cdbf9f;margin-left:4px;white-space:nowrap}'
    + '.ns-turn{animation:nsTurn .18s steps(2,end)}@keyframes nsTurn{0%{filter:brightness(.15)}100%{filter:none}}'
    + '@media (prefers-reduced-motion:reduce){.ns-turn{animation:none}}'
    /* THE SETTINGS TABS */
    + '#setcard .ns-tabs{display:flex;gap:4px;margin:0 0 10px}'
    + '#setcard .ns-tabs button{flex:1;min-height:44px;margin:0;padding:0 4px;border:1px solid #0d0a07;border-radius:2px;background:#1b1610;color:#cdbf9f;'
    + 'font:12px/1 "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1.2px;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,240,200,.14)}'
    + '#setcard .ns-tabs button.on{background:linear-gradient(#e8b85e,#a8752c);color:#1f1710;box-shadow:inset 0 1px 0 rgba(255,240,200,.6),inset 0 -2px 0 rgba(70,40,10,.55)}'
    + '#setcard .ns-taboff{display:none!important}'
    /* a settings card on a short wide glass lies wider, so a tab needs fewer pages */
    + '@media (min-aspect-ratio:3/2) and (max-height:520px){'
    + 'html body #setcard{width:min(96%,780px);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:16px;align-content:start;padding-top:18px}'
    + 'html body #setcard>.seth{display:none}html body #setcard>.ns-tabs{grid-column:1/-1}'
    + 'html body #setcard>.ns-bar{grid-column:1;grid-row:99;margin:4px 0 0}html body #setcard>#setclose{grid-column:2;grid-row:99}'
    + 'html body #setcard:has(>.ns-bar.ns-off)>#setclose{grid-column:1/-1}html body #setcard>#setphone .seth{margin:0 0 6px}}';

  function css(doc) {
    if (doc.getElementById('ns-style')) return;
    var s = doc.createElement('style'); s.id = 'ns-style'; s.textContent = STYLE; (doc.head || doc.documentElement).appendChild(s);
  }
  function shown(el) { if (!el || !el.getBoundingClientRect) return false; var r = el.getBoundingClientRect(); return r.width > 0 || r.height > 0; }
  function over(box, B) { var lim = B && B.lim ? B.lim : box.clientHeight; return box.scrollHeight > lim + 1 || box.scrollWidth > box.clientWidth + 1; }

  /* ---- THE ATOMS: what is cut onto pages ---- */
  function atomsOf(B) {
    var box = B.box, root = (B.opts.atoms && B.opts.atoms(box)) || box, out = [];
    var room = Math.max(60, box.clientHeight * 0.55);
    var keep = typeof B.opts.keep === 'function' ? B.opts.keep() : B.opts.keep;
    var skip = function (c) { return c === B.bar || (keep && c.matches && c.matches(keep)) || c.classList.contains('ns-taboff') || /^(SCRIPT|STYLE|TEMPLATE)$/.test(c.tagName); };
    var walk = function (el) {
      for (var i = 0; i < el.children.length; i++) {
        var c = el.children[i]; if (skip(c)) continue;
        var cs = getComputedStyle(c);
        if (cs.position === 'absolute' || cs.position === 'fixed' || cs.position === 'sticky') continue;   /* it lies over the box, not in its flow */
        if (cs.display === 'contents') { walk(c); continue; }   /* no box of its own: its children are the blocks */
        if (cs.display === 'none' && !c.classList.contains('ns-off')) continue;   /* hidden by its own lane: never shown by this one */
        var tall = c.classList.contains('ns-off') ? (c.__nsH || 0) : c.getBoundingClientRect().height;
        c.__nsH = tall;
        if (tall > room && c.children.length >= 2 && !(c.matches && c.matches(WHOLE))) walk(c);
        else out.push(c);
      }
    };
    walk(root);
    return out;
  }

  /* ---- THE PAGES ---- */
  var OFF = false;   /* a checker's switch only (BohemiaNoScroll.off(true)): everything back as it was, so the gate can see the crime return */
  function cut(B) {
    if (B.busy) return;
    if (OFF) { var o = B.box.querySelectorAll('.ns-off'); for (var q = 0; q < o.length; q++) o[q].classList.remove('ns-off'); B.box.classList.remove('ns-box'); if (B.bar) B.bar.classList.add('ns-off'); B.pages = [[]]; return; }
    B.busy = true;
    try {
      var box = B.box;
      css(box.ownerDocument);
      box.classList.add('ns-box');
      if (box.scrollTop) box.scrollTop = 0;
      /* everything back on first, then measure the whole */
      var all = box.querySelectorAll('.ns-off'); for (var i = 0; i < all.length; i++) all[i].classList.remove('ns-off');
      var zs = box.querySelectorAll('[data-ns-zoom]'); for (var z = 0; z < zs.length; z++) { zs[z].style.zoom = ''; zs[z].removeAttribute('data-ns-zoom'); }
      if (B.bar) B.bar.classList.add('ns-off');
      var key = B.opts.key ? String(B.opts.key()) : '';
      if (key !== B.key) { B.key = key; B.at = 0; }
      B.lim = 0;
      if (!shown(box) || !over(box)) { B.pages = [[]]; B.atoms = []; B.at = 0; paintBar(B); return; }
      if (B.bar) B.bar.classList.remove('ns-off');
      ensureBar(B);
      var A = atomsOf(B); B.atoms = A;
      A.forEach(function (a) { a.classList.add('ns-off'); });
      /* THE FIXED PART (what is kept on every page, the strip, the bar) measured alone: the pages fill what is left of the box.
         When the fixed part alone is taller than the box, the box is filled to that height and it is said in the log. */
      /* (a box that grows with what it holds only overflows at its own ceiling, so the plain test is right unless the fixed part
         alone already passes the ceiling) */
      B.lim = box.scrollHeight > box.clientHeight + 1 ? box.scrollHeight : 0;
      if (B.lim) (window.__NS_LOG = window.__NS_LOG || []).push('fixed part ' + box.scrollHeight + ' > ' + box.clientHeight + ' in ' + (box.id || box.className));
      var pages = [], cur = [];
      for (var k = 0; k < A.length; k++) {
        A[k].classList.remove('ns-off');
        if (over(box, B)) {
          if (cur.length) {
            A[k].classList.add('ns-off');
            /* a heading never closes a page: it goes over with what it heads */
            var carry = [];
            while (cur.length > 1 && cur[cur.length - 1].matches && cur[cur.length - 1].matches(HEAD)) carry.unshift(cur.pop());
            pages.push(cur); cur.forEach(function (a) { a.classList.add('ns-off'); });
            carry.forEach(function (a) { a.classList.add('ns-off'); });
            cur = carry.slice(); carry.forEach(function (a) { a.classList.remove('ns-off'); });
            A[k].classList.remove('ns-off');
            if (over(box, B)) fitAlone(B, A[k]);
          } else fitAlone(B, A[k]);
        }
        cur.push(A[k]);
      }
      if (cur.length) pages.push(cur);
      /* a page of nothing but empty slots after the last thing he owns is not a page (the bag's empty places) */
      if (B.opts.blank) while (pages.length > 1 && pages[pages.length - 1].every(function (a) { return a.matches(B.opts.blank); })) pages.pop();
      B.pages = pages;
      if (B.at >= pages.length) B.at = pages.length - 1;
      show(B, false);
    } catch (e) { (window.__NS_LOG = window.__NS_LOG || []).push(String(e)); }
    finally { B.busy = false; }
  }
  /* one atom that cannot fit even alone (a very short glass): drawn smaller, never cut off */
  function fitAlone(B, a) {
    var box = B.box, s = 1;
    for (var t = 0; t < 6 && over(box, B); t++) {
      var need = box.scrollHeight - (B.lim || box.clientHeight), h = a.getBoundingClientRect().height / s || 1;
      s = Math.max(0.75, Math.min(s - 0.04, (h * s - need - 2) / h));
      a.style.zoom = s.toFixed(3); a.setAttribute('data-ns-zoom', s.toFixed(3));
      if (s <= 0.75) break;
    }
  }
  function show(B, turn) {
    B.atoms.forEach(function (a) { a.classList.add('ns-off'); });
    (B.pages[B.at] || []).forEach(function (a) { a.classList.remove('ns-off'); });
    if (B.box.scrollTop) B.box.scrollTop = 0;
    paintBar(B);
    if (turn) { B.box.classList.remove('ns-turn'); void B.box.offsetWidth; B.box.classList.add('ns-turn'); }
  }
  function go(B, n) {
    if (!B.pages || B.pages.length < 2) return;
    var to = Math.max(0, Math.min(B.pages.length - 1, n)); if (to === B.at) return;
    B.at = to; show(B, true);
    (window.__NS_TURNS = window.__NS_TURNS || []).push({ box: B.box.id || B.box.className, at: to, of: B.pages.length });
  }
  function ensureBar(B) {
    if (B.bar && (B.opts.barSibling ? B.bar.parentNode === B.box.parentNode && B.bar.previousSibling === B.box : B.bar.parentNode === B.box)) return;
    var d = B.box.ownerDocument, bar = B.bar || d.createElement('div');
    if (!B.bar) {
      bar.className = 'ns-bar'; bar.setAttribute('data-ns-bar', '1');
      bar.innerHTML = '<button type="button" class="ns-prev" aria-label="the page before">&#9664;</button><span class="ns-dots"></span>'
        + '<button type="button" class="ns-next" aria-label="the next page">&#9654;</button><span class="ns-of"></span>';
      var stop = function (e) { e.stopPropagation(); };
      bar.addEventListener('pointerdown', stop); bar.addEventListener('touchstart', stop, { passive: true });
      bar.addEventListener('click', function (e) {
        e.stopPropagation(); e.preventDefault();
        var t = e.target.closest ? e.target.closest('button') : null; if (!t) return;
        if (t.classList.contains('ns-prev')) go(B, B.at - 1);
        else if (t.classList.contains('ns-next')) go(B, B.at + 1);
        else if (t.hasAttribute('data-p')) go(B, +t.getAttribute('data-p'));
      });
      B.bar = bar;
    }
    var first = B.opts.barAfter ? B.box.querySelector(B.opts.barAfter) : null;
    if (B.opts.barSibling) { if (bar.parentNode !== B.box.parentNode || bar.previousSibling !== B.box) B.box.parentNode.insertBefore(bar, B.box.nextSibling); return; }
    if (B.opts.barEnd) B.box.appendChild(bar);
    else if (first && first.parentNode === B.box) B.box.insertBefore(bar, first.nextSibling);
    else B.box.insertBefore(bar, B.box.firstChild);
  }
  function paintBar(B) {
    var bar = B.bar; if (!bar) return;
    var n = (B.pages || []).length;
    if (n < 2) { bar.classList.add('ns-off'); return; }
    bar.classList.remove('ns-off');
    var dots = bar.querySelector('.ns-dots'), h = '';
    if (n <= 8) for (var i = 0; i < n; i++) h += '<button type="button" data-p="' + i + '"' + (i === B.at ? ' class="on"' : '') + ' aria-label="page ' + (i + 1) + '">' + (i + 1) + '</button>';
    if (dots.innerHTML !== h) dots.innerHTML = h;
    bar.querySelector('.ns-prev').disabled = B.at <= 0;
    bar.querySelector('.ns-next').disabled = B.at >= n - 1;
    var of = bar.querySelector('.ns-of'); of.textContent = 'PAGE ' + (B.at + 1) + ' OF ' + n;   /* draft:true */
    /* a narrow strip drops the words first, then the dots: the two arrows always stay */
    of.style.display = ''; dots.style.display = '';
    if (bar.scrollWidth > bar.clientWidth + 1) of.style.display = 'none';
    if (bar.scrollWidth > bar.clientWidth + 1) { dots.style.display = 'none'; of.style.display = ''; }
  }

  function soon(B) { if (B.t) return; B.t = (window.requestAnimationFrame || setTimeout)(function () { B.t = 0; cut(B); }); }
  function page(box, opts) {
    if (!box) return null;
    for (var i = 0; i < BOXES.length; i++) if (BOXES[i].box === box) { BOXES[i].opts = opts || BOXES[i].opts; soon(BOXES[i]); return BOXES[i]; }
    var B = { box: box, opts: opts || {}, at: 0, pages: [[]], atoms: [], key: null };
    BOXES.push(B);
    box.setAttribute('data-ns-pager', '1');
    try {
      new MutationObserver(function (ms) {
        if (B.busy) return;
        for (var j = 0; j < ms.length; j++) { var t = ms[j].target;
          if (B.bar && (t === B.bar || B.bar.contains(t))) continue;
          var kp = typeof B.opts.keep === 'function' ? B.opts.keep() : B.opts.keep;
          if (kp && t.closest && t !== box && t.closest(kp)) continue;
          soon(B); return; }
      }).observe(box, { childList: true, subtree: true });
    } catch (e) {}
    try { new ResizeObserver(function () { soon(B); }).observe(box); } catch (e) {}
    box.addEventListener('scroll', function () { if (box.scrollTop) box.scrollTop = 0; if (box.scrollLeft) box.scrollLeft = 0; }, { passive: true });
    /* a swipe across the box turns the page (a swipe down or up does nothing: nothing scrolls) */
    var sx = null, sy = 0, st = 0;
    box.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') return; sx = e.clientX; sy = e.clientY; st = Date.now(); }, { passive: true });
    box.addEventListener('pointerup', function (e) {
      if (sx === null) return; var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.6 && Date.now() - st < 700) go(B, B.at + (dx < 0 ? 1 : -1));
    }, { passive: true });
    soon(B);
    return B;
  }
  function boxOf(el) { for (var i = 0; i < BOXES.length; i++) if (BOXES[i].box.contains(el)) return BOXES[i]; return null; }
  function reveal(el) {
    var B = el && boxOf(el); if (!B || !B.pages) return false;
    for (var i = 0; i < B.pages.length; i++) for (var j = 0; j < B.pages[i].length; j++) if (B.pages[i][j] === el || B.pages[i][j].contains(el)) { if (i !== B.at) go(B, i); return true; }
    return false;
  }
  /* the game's own 'bring it into view' turns the page instead of scrolling */
  try {
    var EP = Element.prototype, siv = EP.scrollIntoView, sivn = EP.scrollIntoViewIfNeeded;
    EP.scrollIntoView = function () { var B = boxOf(this); if (B) { reveal(this); return; } return siv.apply(this, arguments); };
    if (sivn) EP.scrollIntoViewIfNeeded = function () { var B = boxOf(this); if (B) { reveal(this); return; } return sivn.apply(this, arguments); };
  } catch (e) {}

  /* ---- THE SETTINGS CARD: four tabs ---- */
  var TABS = [
    ['SOUND', ['setvol', 'setmute', 'setmusic', 'setamb', 'setsfx', 'sethap']],
    ['SCREEN', ['settext', 'setbright', 'setcalib', 'setmotion', 'setphone', 'setsize', 'setui']],
    ['PLAY', ['setenc', 'setdiff', 'setcams', 'sethints', 'cbxhints']],
    ['GAME', ['setvote', 'setsave', 'setquit']]
  ];
  var SET = { tab: 0, B: null };
  function rowTab(r) {
    for (var t = 0; t < TABS.length; t++) for (var k = 0; k < TABS[t][1].length; k++) {
      var id = TABS[t][1][k]; if (r.id === id || (r.querySelector && r.querySelector('#' + id))) return t;
    }
    if (/setdiffrow|setcamsrow/.test(r.className || '')) return 2;
    return 2;
  }
  function settingsTabs() {
    var card = document.getElementById('setcard'); if (!card) return false;
    css(document);
    var tabs = card.querySelector('.ns-tabs');
    if (!tabs) {
      tabs = document.createElement('div'); tabs.className = 'ns-tabs'; tabs.setAttribute('role', 'tablist');
      tabs.innerHTML = TABS.map(function (t, i) { return '<button type="button" role="tab" data-tab="' + i + '">' + t[0] + '</button>'; }).join('');
      var h = card.querySelector('.seth'); if (h && h.parentNode === card) card.insertBefore(tabs, h.nextSibling); else card.insertBefore(tabs, card.firstChild);
      tabs.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-tab]'); if (!b) return; e.stopPropagation(); setTab(+b.getAttribute('data-tab')); });
    }
    sortRows();
    if (!SET.B) SET.B = page(card, { keep: '.seth, .ns-tabs, #setclose', barAfter: '.ns-tabs', key: function () { return SET.tab; },
      atoms: function (box) { return box; } });
    return true;
  }
  function sortRows() {
    var card = document.getElementById('setcard'); if (!card) return;
    /* the brightness picture stays under its own row (the phone's rows were laid in between them) */
    var bri = document.getElementById('setbright'), cal = document.getElementById('setcalib');
    if (bri && cal && bri.parentNode && bri.parentNode.parentNode === card && cal.parentNode === card && bri.parentNode.nextSibling !== cal) card.insertBefore(cal, bri.parentNode.nextSibling);
    for (var i = 0; i < card.children.length; i++) {
      var r = card.children[i];
      if (r.classList.contains('seth') || r.classList.contains('ns-tabs') || r.classList.contains('ns-bar') || r.id === 'setclose') continue;
      r.classList.toggle('ns-taboff', rowTab(r) !== SET.tab);
    }
    var bs = card.querySelectorAll('.ns-tabs [data-tab]');
    for (var j = 0; j < bs.length; j++) { var on = +bs[j].getAttribute('data-tab') === SET.tab; bs[j].classList.toggle('on', on); bs[j].setAttribute('aria-selected', on ? 'true' : 'false'); }
  }
  function setTab(t) { SET.tab = Math.max(0, Math.min(TABS.length - 1, t)); sortRows(); if (SET.B) cut(SET.B); }
  function watchSettings() {
    var card = document.getElementById('setcard'); if (!card) return;
    settingsTabs();
    try { new MutationObserver(function () { if (SET.B && SET.B.busy) return; sortRows(); }).observe(card, { childList: true }); } catch (e) {}
    /* the phone's held finger asks for its own rows: SCREEN (a scrollIntoView on #setphone lands here) */
    var wrap = document.getElementById('setwrap');
    if (wrap) try { new MutationObserver(function () { if (wrap.classList.contains('on') && SET.B) cut(SET.B); }).observe(wrap, { attributes: true, attributeFilter: ['class'] }); } catch (e) {}
  }
  /* a reveal inside the card also turns the TAB (the phone asks for #setphone) */
  var rv = reveal;
  reveal = function (el) {
    var card = document.getElementById('setcard');
    if (card && el && card.contains(el)) { var r = el; while (r && r.parentNode !== card) r = r.parentNode; if (r && r.classList.contains('ns-taboff')) setTab(rowTab(r)); }
    return rv(el);
  };

  /* ---- THE TOWN'S SHEET (the settlement screen, RUN TWO's file, untouched: this file plants itself in that frame) ----
     Every building's sheet is paged. On a short wide glass (a phone on its side) the sheet stands the glass's whole
     height, not 72 percent of it, and a recruit's card lies across (his numbers beside his lines, not under them),
     so a card fits a page; the shop's bag is a grid of whole rows a page. The page strip stands at the sheet's foot,
     under the shop's strip, never over the X. */
  var WIDE = '(min-aspect-ratio:4/3) and (max-height:620px)';
  /* on wide glass UI's own sheet (bohemia_ui_materials.js, THE SCREENS PAST THE PHONE) is two columns: the keeper on the left,
     what he sells on the right. On a SHORT wide glass this narrows the keeper's column to 200 (his face over his words), puts the
     page strip under him, lays a recruit's numbers beside his lines, and stands the shop's strip in its own column on the right,
     so the shelf has the middle's whole height. */
  var TOWN_CSS = ''
    + 'html body #sheet>.ns-bar{margin:8px 0 0}'
    /* the hall is a hiring screen (Battle Brothers' own is the whole screen): the glass's height, so the keeper and a recruit share a page */
    + 'html body #sheet:has(#sbody>.acts>.hire){max-height:calc(100% - 8px)!important}'
    + '@media ' + WIDE + '{html body #sheet{max-height:calc(100% - 8px)!important}'
    + 'html body #sbody:has(> .who){grid-template-columns:200px minmax(0,1fr)!important}'
    + 'html body #sbody:has(> .who) > .who{flex-direction:column;padding-right:0}'
    + 'html body #sheet:has(#sbody>.who)>.ns-bar{position:absolute;left:12px;bottom:10px;width:200px;margin:0;justify-content:space-between}'
    + 'html body #sheet:has(#sbody>.who)>.ns-bar .ns-dots{display:none}html body #sheet:has(#sbody>.who)>.ns-bar .ns-of{order:1;margin:0}html body #sheet:has(#sbody>.who)>.ns-bar .ns-next{order:2}'
    + 'html body #sbody:has(> .who) > .who canvas.face{width:56px;height:56px}'
    + 'html body #sbody:has(> .who) > .who p{font-size:12px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow:hidden}'
    + 'html body #sheet .hire .hiret{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:10px;align-content:start}'
    + 'html body #sheet .hire .hiret>*{grid-column:1}html body #sheet .hire .hiret>.hstats{grid-column:2;grid-row:1/span 9}'
    + 'html body #sheet.shopping #sbody{padding-right:312px!important;min-height:calc(var(--ns-strip-h, 215px) + 60px)}'
    + 'html body #sheet.shopping #shopstrip{position:absolute!important;right:12px;top:12px;bottom:auto;width:300px;margin:0}'
    + 'html body #sheet.shopping:has(#sbody>.who)>.ns-bar{left:auto;right:12px;width:300px}}';
  function townSheet() {
    var sh = document.getElementById('sheet'); if (!sh) return false;
    if (!document.getElementById('ns-town')) { var s = document.createElement('style'); s.id = 'ns-town'; s.textContent = TOWN_CSS; (document.head || document.documentElement).appendChild(s); }
    /* kept on every page: the X, the shop's strip and the hall's two sorts; the keeper too where he has his own column (wide) */
    /* the shop's strip stands in its own column on a short wide glass; the sheet is never shorter than it and the page strip under it */
    var stripH = function () { var st = document.getElementById('shopstrip'); if (st && matchMedia(WIDE).matches) { var h = Math.ceil(st.getBoundingClientRect().height); if (h > 0) sh.style.setProperty('--ns-strip-h', h + 'px'); } };
    try { new ResizeObserver(stripH).observe(sh); } catch (e) {}
    page(sh, { keep: function () { stripH(); return '#close, #shopstrip, .hsort' + (matchMedia(WIDE).matches ? ', .who' : ''); }, barEnd: true, blank: '#baggrid > .slot:not(.full)',
      key: function () { try { var S = window.BohemiaSettlement && BohemiaSettlement.state; return (S && S.open) || ''; } catch (e) { return ''; } } });
    return true;
  }

  /* ---- THE CREW SCREEN (UI's own, slices/BOHEMIA_ROSTER_SCREEN.html): the company on one glass ----
     The stash is cut into pages of whole rows that fit what is left under the man's card and the tabs (Battle Brothers' stash
     is one fixed grid; ours turns its pages), the page strip under it; empty places past the last thing he owns are no page.
     On a short glass the man's card (his slots, his figure, his numbers) is drawn smaller until it fits the glass's height,
     never below seven tenths. */
  var CREW = { B: null, t: 0, log: [] };
  function crewFit() {
    var bag = document.getElementById('bag'), man = document.getElementById('man'); if (!bag) return;
    var H = innerHeight, wide = innerWidth > innerHeight, cols = document.getElementById('cols');
    var padB = cols ? parseFloat(getComputedStyle(cols).paddingBottom) || 0 : 0, ROW = 62, BAR = 50;
    if (man) man.style.zoom = '';
    bag.style.maxHeight = '';
    var mr = man ? man.getBoundingClientRect() : null;
    /* a wide glass: the card has its column to itself, drawn smaller until it fits the height (never under two thirds) */
    if (man && wide && mr.height > 4 && mr.bottom > H - padB - 2) man.style.zoom = Math.max(0.66, Math.min(1, (H - mr.top - padB - 2) / mr.height)).toFixed(3);
    var roomOf = function () { var br = bag.getBoundingClientRect(), below = 0, said = document.getElementById('said');
      if (said) { var sr = said.getBoundingClientRect(); if (sr.height > 0 && sr.top >= br.bottom - 2 && sr.left < br.right && sr.right > br.left) below += sr.height + 6; }
      return Math.floor(H - br.top - below - BAR - padB - 2); };
    var room = roomOf();
    /* upright the card and the stash share the column: when not one row of the stash fits, the card gives up the height (never under four fifths) */
    if (man && !wide && room < ROW && mr.height > 4) { man.style.zoom = Math.max(0.8, (mr.height - (ROW - room)) / mr.height).toFixed(3); room = roomOf(); }
    bag.style.maxHeight = Math.max(ROW, room) + 'px';
    /* whatever still hangs past the glass (a gap, a line) comes off the bag too */
    var se = document.scrollingElement || document.documentElement, past = se.scrollHeight - H;
    if (past > 0) { room -= past; bag.style.maxHeight = Math.max(ROW, room) + 'px'; }
    if (!CREW.B) CREW.B = page(bag, { barSibling: true, blank: '.slot:not(.full)', key: function () { var t = document.querySelector('#tabs .on, #tabs [aria-selected=true]'); return t ? t.textContent : ''; } });
    else cut(CREW.B);
    CREW.log.push({ H: H, room: room, zoom: man ? man.style.zoom : null, pages: CREW.B.pages.length, past: (document.scrollingElement || document.documentElement).scrollHeight - H });
    if (CREW.log.length > 20) CREW.log.shift();
  }
  function crewSoon() { if (CREW.t) return; CREW.t = requestAnimationFrame(function () { CREW.t = 0; crewFit(); }); }
  function crewScreen() {
    var cols = document.getElementById('cols') || document.body;
    try { new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) { var t = ms[i].target; if (CREW.B && CREW.B.bar && CREW.B.bar.contains(t)) continue; if (t.id === 'bag' || (t.closest && t.closest('#bag'))) continue; crewSoon(); return; } }).observe(cols, { childList: true, subtree: true }); } catch (e) {}
    addEventListener('resize', crewSoon);
    crewSoon(); setTimeout(crewSoon, 600); setTimeout(crewSoon, 2000);
  }

  /* ---- PLANTED IN EVERY FRAME OF THE GAME (from the shell): the same file, run in that frame's own window ---- */
  var SRC = (function () { try { var s = document.currentScript; return s && s.src ? s.src : null; } catch (e) { return null; } })();
  function plant() {
    var visit = function (w, depth) {
      if (depth > 4) return;
      try {
        var d = w.document; if (!d || !d.documentElement || d.readyState === 'loading') return;
        if (w !== window && !w.BohemiaNoScroll && !d.__nsPlanted && SRC && /SETTLEMENT_SCREEN|ROSTER_SCREEN|SPOILS_SCREEN|STASH_SCREEN/.test(w.location.pathname)) {
          d.__nsPlanted = 1; var sc = d.createElement('script'); sc.src = SRC; (d.head || d.documentElement).appendChild(sc);
          /* and the weapon's card (rule 397), the same way, where the page has none of its own */
          if (!w.BohemiaWeaponCard) { var wc = d.createElement('script'); wc.src = SRC.replace(/bohemia_ui_no_scroll\.js.*$/, 'bohemia_ui_weapon_card.js'); (d.head || d.documentElement).appendChild(wc); }
        }
      } catch (e) { return; }
      try { for (var i = 0; i < w.frames.length; i++) visit(w.frames[i], depth + 1); } catch (e) {}
    };
    visit(window, 0);
  }

  window.BohemiaNoScroll = {
    page: page, reveal: function (el) { return reveal(el); }, refresh: function () { BOXES.forEach(function (B) { cut(B); }); },
    off: function (on) { OFF = !!on; BOXES.forEach(function (B) { cut(B); }); return OFF; },   /* the pages only: the settings' tabs are not a pager */
    crew: function () { return { log: CREW.log.slice(), state: CREW.B ? { pages: CREW.B.pages.length, at: CREW.B.at } : null }; },
    state: function (box) { var B = null; for (var i = 0; i < BOXES.length; i++) if (BOXES[i].box === box) B = BOXES[i]; return B ? { pages: B.pages.length, at: B.at, atoms: B.atoms.length, key: B.key } : null; },
    go: function (box, n) { for (var i = 0; i < BOXES.length; i++) if (BOXES[i].box === box) go(BOXES[i], n); },
    settingsTab: function (t) { if (t != null) setTab(t); return SET.tab; }, TABS: TABS
  };
  function boot() {
    var pg = location.pathname;
    if (/SETTLEMENT_SCREEN/.test(pg)) { townSheet(); return; }
    if (/ROSTER_SCREEN/.test(pg)) { crewScreen(); return; }
    if (/SPOILS_SCREEN|STASH_SCREEN/.test(pg)) return;   /* measured: their own layouts fit the glass (RUN's spoils) */
    watchSettings();
    if (window === window.top) { plant(); setInterval(plant, 700); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
