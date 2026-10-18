/* THE PHONE'S APPS, the home screen laid in the browser only (UI [the phone's apps], his 10/17 YES on the flip in the menu with
   'there's a whole app on the phone too that you could integrate'; 10/18). Runs INSIDE the city frame after the phone is opened and
   lays a home screen over the opened phone's glass from the materials file's own generators (glass, cardboard, tape, receipt) and
   his pack props cut whole at their own pixels (rule 108: cut, never drawn): nothing here is drawn fresh, nothing is written to
   the game. THE APPS ARE THE SCREENS THE GAME ALREADY HAS: the feed (the posts on the phone's face), the jobs (the phone's board,
   rule 51c), the stash, the crew (RUN TWO's company screen), settings (the shell's gear), and the timeline (the flip, which lives
   only in the menu and only after the first crisis, his eleventh votes).
   NO BROWSER DEFAULTS (rule 114 D10): no gradient, no blur, no glow, corners 0, the game's own face; the dark is painted INTO the
   material's canvas, never laid on with CSS.
   window.__bmPhoneHome(look, imgs, crisis) lays look 'A' (cardboard tiles taped to the glass, the name on a receipt tag) or 'B' (the
   prop straight on the glass, the name printed on the glass); window.__bmPhoneHomeMeasure() reads it back for the sheet and gate. */
(function () {
  'use strict';
  var APPS = [
    { k: 'feed', name: 'FEED', what: 'the posts on the phone\'s face' },
    { k: 'jobs', name: 'JOBS', what: 'the valley\'s open contracts (rule 51c)' },
    { k: 'stash', name: 'STASH', what: 'what the company carries' },
    { k: 'crew', name: 'CREW', what: 'the company screen' },
    { k: 'settings', name: 'SETTINGS', what: 'the shell\'s gear' },
    { k: 'timeline', name: 'TIMELINE', what: 'the flip, after the first crisis only' }
  ];   /* names draft:true */
  function u(c) { return 'url(' + c.toDataURL('image/png') + ')'; }
  /* the dark painted INTO the material (no gradient laid over it) */
  function dark(c, a) { var o = document.createElement('canvas'); o.width = c.width; o.height = c.height; var g = o.getContext('2d');
    g.drawImage(c, 0, 0); g.fillStyle = 'rgba(10,7,4,' + a + ')'; g.fillRect(0, 0, o.width, o.height); return o; }
  function css(v) {
    return ''
      + '#bmhome{position:absolute;inset:0;z-index:5;box-sizing:border-box;padding:40px 14px 20px;display:flex;flex-direction:column;'
      + 'font-family:"BohemiaCasing",ui-sans-serif,sans-serif;color:#f2e4c6;background:#100d0a ' + v.glass + ' center/cover;border-radius:0}'
      + '#bmhome .bmhtop{display:flex;justify-content:space-between;align-items:center;min-height:22px;font-size:11px;letter-spacing:.8px;color:#d9cba8;margin:0 2px 22px}'
      + '#bmhome .bmhgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px 8px;justify-items:center;align-content:start}'
      + '#bmhome.flat .bmhgrid{grid-template-columns:repeat(6,1fr);gap:8px}'
      + '#bmhome .app{display:flex;flex-direction:column;align-items:center;gap:7px;min-width:72px;min-height:44px;cursor:pointer;position:relative}'
      + '#bmhome .app img{display:block;image-rendering:pixelated}'
      /* A: a cardboard tile taped to the glass, the name on a receipt tag */
      + '#bmhome.A .tile{width:64px;height:64px;display:flex;align-items:center;justify-content:center;position:relative;background:#3a2c1e ' + v.card + ' 0 0/192px 192px;'
      + 'box-shadow:0 2px 0 #000,inset 0 1px 0 rgba(255,220,170,.22);border-radius:0}'
      + '#bmhome.A .tile::before{content:"";position:absolute;top:-6px;left:50%;width:34px;height:12px;margin-left:-17px;background:' + v.tape + ' center/100% 100%;transform:rotate(-4deg)}'
      + '#bmhome.A .app:nth-child(2n) .tile::before{transform:rotate(3deg)}'
      + '#bmhome.A .nm{color:#1f1710;font-size:10px;letter-spacing:.8px;padding:3px 7px 2px;background:#e2dac6 ' + v.receipt + ' center/100% 100%;box-shadow:0 1px 0 rgba(0,0,0,.85)}'
      /* B: the prop straight on the glass, its own contact line under it, the name printed on the glass */
      + '#bmhome.B .tile{width:64px;height:64px;display:flex;align-items:center;justify-content:center;position:relative}'
      + '#bmhome.B .tile::after{content:"";position:absolute;left:14px;right:14px;bottom:6px;height:3px;background:rgba(0,0,0,.55)}'
      + '#bmhome.B .tile img{position:relative;z-index:1}'
      + '#bmhome.B .nm{color:#f0c46a;font-size:10px;letter-spacing:.8px;text-shadow:0 1px 0 #000}'
      + '#bmhome .app.late .nm::after{content:"";display:inline-block;width:5px;height:5px;margin:0 0 1px 5px;background:#f0c46a;vertical-align:middle}'
      + '#bmhome .bmhfoot{margin-top:auto;font-size:9px;letter-spacing:.8px;color:#a89a7c;text-align:center}';
  }
  window.__bmPhoneHome = function (look, imgs, crisis) {
    var M = window.BohemiaMaterials; if (!M) throw new Error('no materials file in the city frame');
    var v = { glass: u(dark(M.glass(), .35)), card: u(dark(M.cardboard(), .3)), tape: u(M.tape()), receipt: u(M.receipt()) };
    var st = document.getElementById('bmhomecss'); if (!st) { st = document.createElement('style'); st.id = 'bmhomecss'; document.head.appendChild(st); }
    st.textContent = css(v);
    var slot = document.getElementById('phoneslot'); var old = document.getElementById('bmhome'); if (old) old.remove();
    slot.style.position = 'relative';
    var home = document.createElement('div'); home.id = 'bmhome'; home.className = look + (innerWidth >= 700 ? ' flat' : '');
    var clock = ''; try { clock = (document.getElementById('hclock') || {}).textContent.trim(); } catch (e) {}
    var top = document.createElement('div'); top.className = 'bmhtop';
    var l = document.createElement('span'); l.textContent = clock || '06:00'; var r = document.createElement('span'); r.textContent = 'NO SERVICE';   /* draft:true */
    top.appendChild(l); top.appendChild(r); home.appendChild(top);
    var grid = document.createElement('div'); grid.className = 'bmhgrid';
    APPS.forEach(function (a) {
      if (a.k === 'timeline' && !crisis) return;   /* the flip exists only after the first crisis */
      var el = document.createElement('div'); el.className = 'app' + (a.k === 'timeline' ? ' late' : ''); el.dataset.app = a.k; el.setAttribute('role', 'button'); el.setAttribute('aria-label', a.name);
      var t = document.createElement('div'); t.className = 'tile';
      var im = document.createElement('img'); im.alt = a.k; im.src = imgs[a.k];
      im.onload = function () { im.style.width = (im.naturalWidth / 3) + 'px'; im.style.height = (im.naturalHeight / 3) + 'px'; };
      t.appendChild(im); el.appendChild(t);
      var nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = a.name; el.appendChild(nm);
      grid.appendChild(el);
    });
    home.appendChild(grid);
    var foot = document.createElement('div'); foot.className = 'bmhfoot'; foot.textContent = crisis ? 'TIMELINE CAME WITH THE CRISIS' : '';   /* draft:true */
    home.appendChild(foot);
    slot.appendChild(home);
    return { look: look, crisis: !!crisis, apps: grid.children.length };
  };
  window.__bmPhoneHomeMeasure = function () {
    var R = function (e) { if (!e) return null; var q = e.getBoundingClientRect(); return [q.x, q.y, q.width, q.height].map(function (x) { return +x.toFixed(2); }); };
    var home = document.getElementById('bmhome'), out = { W: innerWidth, H: innerHeight, home: R(home), slot: R(document.getElementById('phoneslot')), apps: [], css: [] };
    home.querySelectorAll('.app').forEach(function (a) { var im = a.querySelector('img'), nm = a.querySelector('.nm'), cs = getComputedStyle(nm);
      out.apps.push({ k: a.dataset.app, box: R(a), tile: R(a.querySelector('.tile')), img: R(im), nat: [im.naturalWidth, im.naturalHeight], name: nm.textContent, nameBox: R(nm), font: cs.fontFamily, ink: cs.color }); });
    /* every element of the home screen, read for D10: gradients, blur, glow, rounded corners, system fonts */
    [home].concat([].slice.call(home.querySelectorAll('*'))).forEach(function (e) { var cs = getComputedStyle(e), b = getComputedStyle(e, '::before'), a = getComputedStyle(e, '::after');
      out.css.push({ tag: e.className || e.tagName, bgi: [cs.backgroundImage, b.backgroundImage, a.backgroundImage].join(' | ').replace(/url\([^)]*\)/g, 'url'), radius: cs.borderTopLeftRadius,
        filter: cs.filter + ' ' + cs.backdropFilter, shadow: cs.boxShadow + ' | ' + cs.textShadow, font: cs.fontFamily, fontReady: document.fonts.check('10px "BohemiaCasing"') }); });
    return out;
  };
})();
