/* THE PHONE'S FRONT SCREEN, laid in the browser only (UI [the phone's front screen], 10/18/26). His fourteenth votes: YES on the
   phone's apps, with 'the front screen looks like dog shit, the first one, so let's update that too'. The first one is the lock
   screen the phone opens on: a 62 px clock in a phone font, two rounded translucent cards with flat colour squares for faces, and a
   flickering 'tap to unlock'. Runs INSIDE the city frame after the phone is opened and lays the new front screen over the glass;
   nothing is written to the game.
   RULE 117 (EASIER THAN BATTLE BROTHERS): minimalist, ONE clear next thing. So: the time, where you are, ONE message from ONE
   mouth with the game's own face on it (rule 19: text comes from a mouth with a portrait), and ONE press, READ. The second card
   ('41 quests available near you') goes: a to-do count on the first screen is the busy screen 117c bans; it lives in JOBS.
   ANALOG HORROR AT THE SOURCE (rule 9/20): the panel is painted in ONE canvas (the black, the glare as a dither of whole art pixels), and two things
   a salvaged phone really has are painted into the same canvas, never a filter: the last owner's lock screen BURNED INTO the panel
   (a ghost you only see when you look) and one dead row of pixels straight across the glass.
   NO BROWSER DEFAULTS (rule 114 D10): no gradient, no blur, no glow, corners 0, the game's own face (CASING) at sizes where one of
   its dots is a whole number of phone pixels (ten dots per em: 50 px = 15 phone px a dot, 13.333 = 4, 10 = 3).
   window.__bmPhoneLock(look, face, msg, clock) lays look 'A' (the message on a receipt taped to the glass) or 'B' (printed straight
   on the glass); window.__bmPhoneLockMeasure() reads it back for the sheet and the gate. */
(function () {
  'use strict';
  function u(c) { return 'url(' + c.toDataURL('image/png') + ')'; }
  /* the glass, the dark, the burn-in and the dead row, all in ONE canvas: pixels, not CSS */
  function screen(W, H) {
    var o = document.createElement('canvas'); o.width = Math.round(W * 3); o.height = Math.round(H * 3); var g = o.getContext('2d');
    /* the black of a dead panel, and the glare from the top left drawn as an ordered dither in whole art pixels (3 phone px),
       light in pixels the way the pack draws it, never a CSS gradient (the materials' 132 px glass tiles into a checkerboard at
       this size, measured on the first shot) */
    g.fillStyle = '#0e0b08'; g.fillRect(0, 0, o.width, o.height);
    var B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5], P = 3; g.fillStyle = '#1b1712';
    for (var y = 0; y < o.height; y += P) for (var x = 0; x < o.width; x += P) {
      var t = 1 - (x / o.width + y / o.height) / 0.9; if (t <= 0) continue;
      if (t * t * 10 > B[((y / P) & 3) * 4 + ((x / P) & 3)]) g.fillRect(x, y, P, P); }
    /* the last owner's lock screen, burned in: her clock and her missed calls, about 4% over the black (draft:true) */
    g.fillStyle = 'rgba(214,226,206,.045)'; g.textBaseline = 'top';
    g.font = '150px "BohemiaCasing"'; g.fillText('11:47', Math.round(o.width * .12), Math.round(o.height * .58));
    g.font = '40px "BohemiaCasing"'; g.fillText('MOM  (14)', Math.round(o.width * .12), Math.round(o.height * .58) + 170);
    /* one dead row of pixels across the panel, 3 phone px, where the crack crosses it */
    g.fillStyle = '#050403'; g.fillRect(0, Math.round(o.height * .43), o.width, 3);
    g.fillStyle = 'rgba(120,150,120,.18)'; g.fillRect(0, Math.round(o.height * .43) + 3, o.width, 1);
    return o;
  }
  function css(v) {
    return ''
      + '#bmlock{position:absolute;inset:0;z-index:6;box-sizing:border-box;padding:56px 22px 22px;display:flex;flex-direction:column;align-items:stretch;'
      + 'font-family:"BohemiaCasing",ui-sans-serif,sans-serif;color:#f2e4c6;background:#0d0a07 ' + v.screen + ' 0 0/100% 100%;border-radius:0;cursor:pointer}'
      + '#bmlock .lkclock{font-size:50px;line-height:50px;letter-spacing:0;text-align:center;color:#f2e4c6;text-shadow:0 3px 0 #000}'
      + '#bmlock .lkwhere{font-size:10px;line-height:14px;letter-spacing:1px;text-align:center;color:#a89a7c;margin-top:12px}'
      + '#bmlock .lkmsg{display:flex;gap:12px;align-items:flex-start;margin-top:44px;position:relative}'
      + '#bmlock .lkface{flex:0 0 64px;width:64px;height:64px;image-rendering:pixelated;display:block;border:1px solid #000;background:#0b0907}'
      + '#bmlock .lktx{flex:1;min-width:0}'
      + '#bmlock .lkwho{font-size:10px;line-height:14px;letter-spacing:1px}'
      + '#bmlock .lkline{font-size:13.333px;line-height:18px;margin-top:4px}'
      + '#bmlock .lkgo{margin-top:auto;align-self:center;width:168px!important;height:48px!important;min-width:168px!important;min-height:48px!important;max-width:none!important;max-height:none!important;box-sizing:border-box;display:flex;align-items:center;justify-content:center;'
      + 'font-size:13.333px;letter-spacing:2px;cursor:pointer;position:relative}'
      /* A: the message on a receipt strip taped to the glass, READ on a cardboard tab */
      + '#bmlock.A .lkmsg{padding:12px 12px 14px;background:#e2dac6 ' + v.receipt + ' 0 0/100% 100%;box-shadow:0 2px 0 #000;color:#1f1710}'
      + '#bmlock.A .lkmsg::before{content:"";position:absolute;top:-7px;left:50%;width:46px;height:14px;margin-left:-23px;background:' + v.tape + ' center/100% 100%;transform:rotate(-3deg)}'
      + '#bmlock.A .lkwho{color:#7a3a16}'
      + '#bmlock.A .lkgo{color:#f2e4c6;background:#3a2c1e ' + v.card + ' 0 0/192px 192px;box-shadow:0 2px 0 #000,inset 0 1px 0 rgba(255,220,170,.22)}'
      /* B: printed straight on the glass between two hard rules, READ in an amber box one pixel wide */
      + '#bmlock.B .lkmsg{padding:14px 0;border-top:1px solid #4a3c28;border-bottom:1px solid #4a3c28}'
      + '#bmlock.B .lkwho{color:#f0c46a}'
      + '#bmlock.B .lkline{color:#e6d8b8}'
      + '#bmlock.B .lkgo{color:#f0c46a;border:1px solid #f0c46a;background:#120e09}'
      /* sideways: the clock on the left, the message and READ on the right */
      + '#bmlock.flat{display:grid;grid-template-columns:1fr 1.3fr;grid-template-rows:auto auto 1fr;column-gap:40px;padding:34px 40px 22px}'
      + '#bmlock.flat .lkclock{grid-column:1;grid-row:1;margin-top:40px}#bmlock.flat .lkwhere{grid-column:1;grid-row:2}'
      + '#bmlock.flat .lkmsg{grid-column:2;grid-row:1/3;margin-top:24px}#bmlock.flat .lkgo{grid-column:2;grid-row:3;align-self:end}';
  }
  window.__bmPhoneLock = function (look, face, msg, clock) {
    var M = window.BohemiaMaterials; if (!M) throw new Error('no materials file in the city frame');
    clock = (String(clock || '').match(/\d{1,2}:\d{2}/) || ['06:00'])[0];   /* the HUD reads DAY 1 · 06:00; the front screen shows the time only */
    var slot = document.getElementById('phoneslot'); slot.style.position = 'relative';
    var r = slot.getBoundingClientRect();
    var v = { screen: u(screen(r.width, r.height)), card: u(M.cardboard()), tape: u(M.tape()), receipt: u(M.receipt()) };
    var st = document.getElementById('bmlockcss'); if (!st) { st = document.createElement('style'); st.id = 'bmlockcss'; document.head.appendChild(st); }
    st.textContent = css(v);
    var old = document.getElementById('bmlock'); if (old) old.remove();
    var home = document.getElementById('bmhome'); if (home) home.remove();
    var L = document.createElement('div'); L.id = 'bmlock'; L.className = look + (innerWidth >= 700 ? ' flat' : '');
    var c = document.createElement('div'); c.className = 'lkclock'; c.textContent = clock; L.appendChild(c);
    var w = document.createElement('div'); w.className = 'lkwhere'; w.textContent = 'THE VALLEY  ·  38°  ·  NO SERVICE'; L.appendChild(w);   /* draft:true */
    var m = document.createElement('div'); m.className = 'lkmsg';
    var im = document.createElement('img'); im.className = 'lkface'; im.alt = msg.who; im.src = face; m.appendChild(im);
    var tx = document.createElement('div'); tx.className = 'lktx';
    var who = document.createElement('div'); who.className = 'lkwho'; who.textContent = msg.who.toUpperCase(); tx.appendChild(who);
    var ln = document.createElement('div'); ln.className = 'lkline'; ln.textContent = msg.line; tx.appendChild(ln);
    m.appendChild(tx); L.appendChild(m);
    var go = document.createElement('div'); go.className = 'lkgo'; go.setAttribute('role', 'button'); go.textContent = 'READ'; L.appendChild(go);   /* draft:true */
    slot.appendChild(L);
    return { look: look, flat: innerWidth >= 700 };
  };
  window.__bmPhoneLockMeasure = function () {
    var R = function (e) { if (!e) return null; var q = e.getBoundingClientRect(); return [q.x, q.y, q.width, q.height].map(function (x) { return +x.toFixed(2); }); };
    var L = document.getElementById('bmlock'), face = L.querySelector('.lkface');
    var out = { W: innerWidth, H: innerHeight, lock: R(L), clock: R(L.querySelector('.lkclock')), msg: R(L.querySelector('.lkmsg')), go: R(L.querySelector('.lkgo')),
      face: { box: R(face), nat: [face.naturalWidth, face.naturalHeight] }, line: L.querySelector('.lkline').textContent, who: L.querySelector('.lkwho').textContent,
      presses: L.querySelectorAll('[role=button]').length, msgs: L.querySelectorAll('.lkmsg').length, sizes: [], css: [] };
    [L].concat([].slice.call(L.querySelectorAll('*'))).forEach(function (e) { var cs = getComputedStyle(e), b = getComputedStyle(e, '::before'), a = getComputedStyle(e, '::after');
      if ([].some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); })) out.sizes.push(parseFloat(cs.fontSize));
      out.css.push({ tag: e.className || e.tagName, bgi: [cs.backgroundImage, b.backgroundImage, a.backgroundImage].join(' | ').replace(/url\([^)]*\)/g, 'url'), radius: cs.borderTopLeftRadius,
        filter: cs.filter + ' ' + cs.backdropFilter, shadow: cs.boxShadow + ' | ' + cs.textShadow, font: cs.fontFamily, fontReady: document.fonts.check('10px "BohemiaCasing"') }); });
    return out;
  };
})();
