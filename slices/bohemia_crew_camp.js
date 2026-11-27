/* BOHEMIA CREW CAMP -- the crew screen shows the camp, and hands a camp person a one-handed weapon (STAFF 3 11/27/26).
   VAMILY rule 471(b), Paolo 11/22: 'these characters can only use one-handed weapons, so either a pistol or like a one-handed melee';
   rule 468: the camp's people stand in every fight; STAFF 2's handoff, next (3): 'the crew screen shows the camp and lets him hand a
   camp person a one-handed weapon'. MEASURED BEFORE: the crew screen counted the camp in its title (', 3 CAMP') and showed none of them;
   a camp person fought with his trade's tool and nothing could change it.
   NOW, on the crew screen (slices/BOHEMIA_ROSTER_SCREEN.html calls BohemiaCrewCamp.draw(api) at the end of its draw):
     - a CAMP row under KEPT: every camp person with you, his face, his first name, the weapon in his hand in its corner;
     - a tap on one shows him in the card (his name, his trade, his cart, what is in his hand) and turns the stash to ONE HAND ONLY:
       only what he can hold lights (BohemiaCamp.canHold: a weapon, one hand, never a bow, a long gun or a throw; a pistol is held),
       a tap hands it to him (BohemiaCamp.giveArms) and what he held from the stash before goes back in it; HAND IT BACK puts it in the
       stash and his trade's tool is in his hand again;
     - a tap on any man of the company takes the card back to him.
   This file owns the camp's part of the crew screen; the camp book (engine/bohemia_camp.js) owns who holds what; the words are the
   file's (records/target/bb/retinue.json staff.words, draft:true); the page lends its own stash, its drawing of a face and of an item,
   and its line (api below), so the stash stays one list. */
(function (root) {
  'use strict';
  var K = { sel: null, api: null, styled: false };
  function CB() { return root.BohemiaCamp || null; }
  function W() { var C = CB(), R = C && C.staffRules ? C.staffRules() : null; return (R && R.words) || {}; }
  function fill(t, o) { return String(t || '').replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? String(o[k]) : m; }); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function people() { var C = CB(); try { return C && C.staff ? C.staff() : []; } catch (e) { return []; } }
  function first(p) { return String(p.name || p.role || '').split(' ')[0]; }
  function pron(p) { var C = CB(), r = C && C.row ? C.row(p.id) : null, f = (p.sex || (r && r.sex)) === 'f'; return { his: f ? 'her' : 'his', he: f ? 'she' : 'he' }; }
  /* what is in his hand: the stash's piece he was handed, else his trade's tool (as the roster names any weapon) */
  function inHand(p) {
    var C = CB(), it = C && C.armsItem ? C.armsItem(p.id) : null; if (it) return { it: it, given: true };
    var R = root.BohemiaRoster, t = null; try { t = R && R.itemOf ? R.itemOf('weapon', C.tradeArms(p.id)) : null; } catch (e) {}
    return { it: t || { id: C ? C.tradeArms(p.id) : 'box_cutter', kind: 'weapon', name: String(C ? C.tradeArms(p.id) : 'box_cutter').replace(/_/g, ' ') }, given: false };
  }
  function nameOf(it) { var a = K.api; return it ? (a && a.shortName ? a.shortName(it) : String(it.name || it.id)) : ''; }

  function style() {
    if (K.styled) return; K.styled = true;
    var s = document.createElement('style'); s.id = 'crewcamp';
    s.textContent = '#camprow{display:none;grid-template-columns:auto 1fr;column-gap:4px;align-items:center;margin-top:3px}#camprow.on{display:grid}' +
      '#camp.line{justify-content:flex-start}.cell.camp{border-color:#6a5a2a}.cell.camp .hand{position:absolute;top:1px;right:1px;width:14px;height:14px;pointer-events:none;image-rendering:pixelated;object-fit:contain}' +
      '.cell.camp .hand i{font-size:9px!important}.ccl{margin-top:4px;font-size:10px;line-height:13px;color:#f6ecd6;text-shadow:0 1px 0 #000;writing-mode:horizontal-tb}.ccl img,.ccl canvas{width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;object-fit:contain}' +
      '#card .who canvas.face{width:64px;height:64px;image-rendering:pixelated}.tile.campok{outline:1px solid #f4cf7c;outline-offset:-1px}';
    document.head.appendChild(s);
  }
  /* the row, beside KEPT (made here: the page keeps no markup of it) */
  function rowEl() {
    var r = document.getElementById('camprow'); if (r) return r;
    var strip = document.getElementById('strip'); if (!strip) return null;
    r = document.createElement('div'); r.id = 'camprow';
    var h = document.createElement('div'); h.className = 'ln'; h.id = 'camph'; h.textContent = W().camp || 'CAMP';
    var l = document.createElement('div'); l.className = 'line'; l.id = 'camp'; r.appendChild(h); r.appendChild(l); strip.appendChild(r); return r;
  }

  function draw(api) {
    K.api = api || K.api; if (!K.api) return; style();
    var ps = people(), r = rowEl(); if (!r) return;
    if (K.sel && !ps.some(function (p) { return p.id === K.sel; })) K.sel = null;
    var line = document.getElementById('camp'); line.textContent = '';
    ps.forEach(function (p) {
      var d = document.createElement('div'); d.className = 'cell full camp' + (p.id === K.sel ? ' sel' : ''); d.dataset.camp = p.id; d.setAttribute('role', 'button');
      var fc = K.api.faceCanvas({ look: p.look, name: p.name }); fc.className = 'head'; d.appendChild(fc);
      var h = inHand(p), ic = K.api.itemPic(h.it, 14); ic.classList.add('hand'); d.appendChild(ic);
      var b = document.createElement('b'); b.textContent = first(p); d.appendChild(b);
      d.setAttribute('aria-label', p.name + ', ' + String(p.role || '').toLowerCase() + ', ' + nameOf(h.it));
      d.addEventListener('click', function () { K.sel = K.sel === p.id ? null : p.id; if (K.sel) K.api.say(fill(W().pick, pron(p))); else K.api.say(''); K.api.redraw(); });
      line.appendChild(d);
    });
    r.classList.toggle('on', ps.length > 0);
    var me = K.sel ? ps.filter(function (p) { return p.id === K.sel; })[0] : null;
    document.documentElement.classList.toggle('crew-camp-sel', !!me);
    if (me) { card(me); stash(me); } else { var cd = document.getElementById('card'); if (cd && cd.dataset.camp) delete cd.dataset.camp; }
    root.__CREW_CAMP = { n: ps.length, sel: K.sel, hands: ps.map(function (p) { var h = inHand(p); return { id: p.id, weapon: h.it && h.it.id, given: h.given }; }) };
  }
  function cartLine(p) { return fill(W().cart, { cart: p.cart && p.cart.word ? String(p.cart.word).toLowerCase() : 'a cart' }); }
  function handLine(p) { return fill(W().hand, { his: pron(p).his, weapon: nameOf(inHand(p).it) }); }

  /* his card, in the page's own classes (the camp's light styles them as it styles a man) */
  function card(p) {
    var el = document.getElementById('card'); if (!el) return; el.textContent = ''; el.dataset.camp = p.id;
    var who = document.createElement('div'); who.className = 'who';
    var fc = K.api.faceCanvas({ look: p.look, name: p.name }); who.appendChild(fc);
    var id = document.createElement('div'); id.className = 'id';
    var nm = document.createElement('div'); nm.className = 'nm'; nm.textContent = String(p.name || '').toUpperCase(); id.appendChild(nm);
    var sub = document.createElement('div'); sub.className = 'sub'; sub.textContent = String(p.role || '') + '  ·  ' + (W().camp || 'CAMP'); id.appendChild(sub);
    who.appendChild(id); el.appendChild(who);
    var c1 = document.createElement('div'); c1.className = 'ccl'; c1.textContent = cartLine(p); el.appendChild(c1);
    var h = inHand(p), c2 = document.createElement('div'); c2.className = 'ccl'; c2.appendChild(K.api.itemPic(h.it, 16));
    c2.appendChild(document.createTextNode(' ' + handLine(p))); el.appendChild(c2);
  }
  /* the stash, one hand only: what he can hold, lit; HAND IT BACK first when he holds a piece of it */
  function stash(p) {
    var C = CB(), A = K.api, S = A.S, tb = document.getElementById('tabs'), el = document.getElementById('bag'); if (!tb || !el || !C) return;
    tb.textContent = ''; var n = document.createElement('span'); n.className = 'n'; n.id = 'bagh'; n.textContent = 'STASH ' + S.bag.length + '/' + A.slots() + '   ' + (W().only || 'ONE HAND ONLY'); tb.appendChild(n);
    el.textContent = '';
    var h = inHand(p);
    if (h.given) { var off = document.createElement('button'); off.type = 'button'; off.className = 'slot off'; off.id = 'campback'; off.textContent = W().give_back || 'HAND IT BACK';
      off.addEventListener('click', function () { back(p); }); el.appendChild(off); }
    var shown = 0;
    S.bag.forEach(function (it, i) {
      if (!C.canHold(it)) return; shown++;
      var b = document.createElement('div'); b.className = 'slot full tile campok'; b.dataset.campbag = i; b.setAttribute('role', 'button'); b.setAttribute('aria-label', it.name);
      var ip = A.itemPic(it, 30); ip.classList.add('bm-icon'); b.appendChild(ip);
      var v = document.createElement('b'); v.textContent = A.face ? A.face(it) : ''; b.appendChild(v);
      b.addEventListener('click', function () { give(p, i); }); el.appendChild(b);
    });
    if (!shown) { var no = document.createElement('div'); no.className = 'none'; no.textContent = fill(W().none, pron(p)); el.appendChild(no); }
  }
  function give(p, bi) {
    var C = CB(), A = K.api, S = A.S, it = S.bag[bi]; if (!it) return;
    var was = inHand(p), r = C.giveArms(p.id, it); if (!r.ok) return;
    S.bag.splice(bi, 1); if (r.back) S.bag.push(r.back);
    A.saveBag(); A.sfx('equip');
    A.say(fill(was.given ? W().swap : W().given, { name: first(p), weapon: nameOf(it), tool: nameOf(was.it), old: nameOf(was.it) }));
    A.redraw();
  }
  function back(p) {
    var C = CB(), A = K.api, S = A.S;
    if (S.bag.length >= A.slots()) { A.say(W().stash_full || 'Your stash is full.'); return; }
    var it = C.takeArms(p.id); if (!it) return;
    S.bag.push(it); A.saveBag(); A.sfx('equip'); A.say(fill(W().back, { name: first(p), weapon: nameOf(it) })); A.redraw();
  }
  /* a tap on a man of the company: the card is his again */
  try {
    document.addEventListener('click', function (e) {
      if (!K.sel || !e.target || !e.target.closest) return;
      if (e.target.closest('[data-man]')) { K.sel = null; setTimeout(function () { if (K.api) K.api.redraw(); }, 0); }
    }, true);
  } catch (e) {}
  root.BohemiaCrewCamp = { draw: draw, selected: function () { return K.sel; }, select: function (id) { K.sel = id || null; if (K.api) K.api.redraw(); },
    /* the screen again after its stash changed from outside (save: the stash written as the screen writes it) */
    redraw: function (save) { if (!K.api) return false; if (save) K.api.saveBag(); K.api.redraw(); return true; } };
})(typeof window !== 'undefined' ? window : this);
