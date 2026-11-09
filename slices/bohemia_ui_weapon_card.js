/* BOHEMIA -- A WEAPON TELLS YOU WHAT IT CAN DO  (UI 8, 11/6/26, rule 397, ask line 437)

   PAOLO 11/4: 'when I click a weapon, it should tell me what sort of extra combat ability it gives me by default'.
   BATTLE BROTHERS' WAY: every weapon's card lists its skills (an axe's Chop and Split Shield, a spear's Thrust and
   Spearwall, a whip's Lash and Disarm), each with its AP, its fatigue, its reach and one plain line of what it does.

   OURS: tap any weapon anywhere it is drawn as a piece (the crew screen's slots and stash, the shop's shelf and bag, a
   body's loot, the arena's gear) and its card says its BLOWS, in the fight's own words (the fight titles a blow's
   button with the skill's name in capitals, its main blow sits on the STRIKE square, a gun's RELOAD on its own), with
   the numbers: AP, BREATH (Battle Brothers' fatigue), REACH in tiles, and one plain line of what it does. Everything
   is read from the weapon's own row (records/target/bb/weapons.json) and the fight's own rules for what a row means
   in Bohemia (records/target/bb/ours.json: melee strikes the next tile, a whip reaches two, a pistol shoots with the
   row the fight rides for it and reloads like the light crossbow); nothing is typed per weapon. The plain line is the
   wiki's effect text said in our words by a small table of phrases (PHRASES below, draft:true for WORDS). A weapon with
   nothing past its one blow says NO SPECIAL ABILITY.

   A PIECE IS FOUND BY WHAT IT CARRIES: an element with data-item="weapon:<row id>" (the shop's tiles), or one holding
   an item icon with data-id="<row id>" of a weapon row (the kit's icons: the crew screen, the spoils). The card stands
   in the half of the glass the finger is not in, clear of the piece, and the next touch anywhere puts it away (the
   touch still does its own work: one tap shows the comparison, two buy or wear it, as before).

   BohemiaWeaponCard.blows(id) -> [{word, main, ap, breath, reach, says}]   BohemiaWeaponCard.html(id)   .show(id, x, y)
   [bb Battle Brothers: the item's tooltip lists each skill's icon, its AP and fatigue, and a line of what it does.]
   [analog horror: the card is a pawn ticket stapled to the piece, its blows typed on a ribbon running out of ink.] */
(function () {
  'use strict';
  if (window.BohemiaWeaponCard) return;
  var BASE = (function () { try { var s = document.currentScript; return s && s.src ? s.src.replace(/[^\/]*$/, '') : ''; } catch (e) { return ''; } })();
  var D = { rows: null, by: {}, ours: null, lines: null, wait: null };
  function load() {
    if (D.wait) return D.wait;
    var get = function (f) { return fetch(BASE + '../records/target/bb/' + f).then(function (r) { return r.json(); }); };
    D.wait = Promise.all([get('weapons.json'), get('ours.json'), get('weapon_lines.json').catch(function () { return null; })]).then(function (a) {
      D.rows = a[0].rows || []; D.rows.forEach(function (r) { D.by[r.id] = r; }); D.ours = a[1]; D.lines = a[2] && a[2].rows || {};
      return D;
    });
    return D.wait;
  }
  function O(k) { var v = D.ours && D.ours[k]; return v && typeof v === 'object' && 'value' in v ? v.value : v; }
  function isReload(s) { return /^Reload/.test(s.name); }
  var RANGED = /^(bow|crossbow|firearm|throwing)/;
  /* the blows a row has IN THE FIGHT: a pistol (the dagger class) shoots with the row the fight rides for it and reloads with
     the light crossbow's reload (ours.pistol_shot, the fight's weaponRow); every other row its own skills */
  function skillsOf(r) {
    var P = O('pistol_shot');
    if (P && r['class'] === P['class'] && P.by_row && P.by_row[r.id] && D.by[P.by_row[r.id]]) {
      var ride = D.by[P.by_row[r.id]], rl = P.reload && D.by[P.reload.rides] ? (D.by[P.reload.rides].skills || []).filter(function (k) { return k.name === P.reload.skill; })[0] : null;
      return { list: (ride.skills || []).concat(rl ? [rl] : []), rides: ride };
    }
    return { list: r.skills || [], rides: null };
  }
  function reachOf(r, s, rides) {
    var w = rides || r, W = O('whip') || {};
    if (typeof s.range === 'number') return s.range;
    if (isReload(s)) return null;
    if (RANGED.test(w['class'] || '') || rides) return (w.range_min && w.range_min > 1 ? w.range_min + '-' : '1-') + (w.range_max || 1);
    var main = (r.skills || []).filter(function (k) { return !isReload(k); })[0];
    if (main && (W.skills || []).indexOf(main.name) >= 0) return W.reach || 2;
    return O('melee_reach') || 1;
  }
  /* THE PLAIN LINE: the wiki's effect said in our words, phrase by phrase (draft:true, for WORDS) */
  var PHRASES = [
    [/completely ignores armou?r( \(100% Direct Damage\))?/i, 'ignores armour'],
    [/(\d+)% Direct Damage/i, '$1% goes straight through armour'],
    [/Does \+(\d+) ?Damage/i, '+$1 damage'],
    [/Does -(\d+)% ?Damage/i, '$1% less damage'],
    [/inflicts (\d+)% more Damage/i, '$1% more damage'],
    [/([+-]\d+)% chance to hit the head/i, '$1 to hit the head'],
    [/([+-]\d+)% chance to hit adjacent enemies/i, 'the men beside him $1 to hit'],
    [/([+-]\d+)% chance to hit targets directly adjacent/i, '$1 to hit a man right beside him'],
    [/([+-]\d+)% chance to hit(?! (the head|adjacent|targets))/i, '$1 to hit'],
    [/Hits (\d+) targets in a straight line/i, 'hits $1 men in a line'],
    [/Hits up to (\d+) targets counterclockwise/i, 'hits up to $1 men around him'],
    [/Can hit up to (\d+) targets/i, 'hits up to $1 men'],
    [/(\d+)% chance to stun target for (\d+) turns/i, '$1% chance to stun him for $2 turns'],
    [/(\d+)% chance to stun target/i, '$1% chance to stun him'],
    [/100% chance to daze target/i, 'dazes him'],
    [/target gets additional (\d+) ?Fatigue/i, 'takes $1 of his breath'],
    [/Direct damage to shield/i, 'breaks his shield'],
    [/counterattack missed or blocked melee attacks until next turn/i, 'strikes back at every blow that misses him until his next turn'],
    [/Moves next to target/i, 'jumps to him first'],
    [/ignores zone of control/i, 'slips past the men in the way'],
    [/strikes twice/i, 'strikes twice'],
    [/no critical hits \(body hits only\)/i, 'never the head'],
    [/canceled if it misses to land a hit on opponent/i, 'stops the first man who steps up'],
    [/33% lower threshold to inflict injuries/i, 'injures more easily'],
    [/Target gets decapitated when killed with this skill/i, 'takes the head off'],
    [/scales with current Initiative|depending on current Initiative/i, 'stronger the quicker he is'],
    [/Bleeding|bleed/i, 'makes him bleed'],
    [/Disarm/i, 'can knock the weapon out of his hand']
  ];
  function plain(s) {
    var t = String(s.effect || ''), out = [];
    if (isReload(s)) return 'loads the next shot';   /* draft:true */
    PHRASES.forEach(function (p) { var m = t.match(p[0]); if (m) { var w = p[1].replace(/\$(\d)/g, function (_, i) { return m[+i]; }); if (out.indexOf(w) < 0) out.push(w); } });
    if (!out.length) out.push(t ? t.replace(/Direct Damage/gi, 'through armour').replace(/Fatigue/g, 'breath').replace(/\s+/g, ' ').trim() : 'a plain blow');
    var line = out.slice(0, 3).join(', ');
    return line.charAt(0).toUpperCase() + line.slice(1) + '.';
  }
  function blows(id) {
    var r = D.by[id]; if (!r) return null;
    var S = skillsOf(r), first = true;
    return S.list.map(function (s) {
      var main = !isReload(s) && first; if (main) first = false;
      /* FIXES 11/9 (ask row 529, EYES 11/8: the pistol's card said 'THROW JAVELIN'): a gun that rides another row's blow (the pistol
         fires as Battle Brothers' javelin, ours.pistol_shot) SHOOTS; the row it borrows is the fight's bookkeeping, never his word */
      var word = isReload(s) ? 'RELOAD' : S.rides && main ? 'SHOOT' : s.name.toUpperCase();   /* draft:true */
      return { name: s.name, word: word, main: main, ap: s.ap, breath: s.fatigue || 0, reach: reachOf(r, s, S.rides), says: plain(s) };
    });
  }
  function special(list) { return list.filter(function (b) { return !b.main && b.word !== 'RELOAD'; }).length > 0; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function html(id, name) {
    var r = D.by[id]; if (!r) return '';
    var L = blows(id), cls = (D.lines[r['class']] || {}), hit = skillsOf(r).rides || r;   /* FIXES 11/9 (row 529): the damage the fight rolls */
    var h = '<div class="bwc-t">' + esc(String(name || cls.name || r.name).toUpperCase()) + '</div>'
      + '<div class="bwc-b">' + esc(cls.line || '') + (hit.damage_min != null ? ' <i>Damage ' + hit.damage_min + '-' + hit.damage_max + '.</i>' : '') + '</div>'
      + '<div class="bwc-h">WHAT IT CAN DO</div>';   /* draft:true */
    L.forEach(function (b) {
      h += '<div class="bwc-r" data-skill="' + esc(b.name) + '"><b>' + esc(b.word) + (b.main ? ' <em>STRIKE</em>' : '') + '</b>'
        + '<span class="bwc-n">' + (b.ap != null ? b.ap + ' AP' : '') + (b.breath ? ' · ' + b.breath + ' BREATH' : '') + (b.reach != null ? ' · ' + b.reach + (b.reach === 1 ? ' TILE' : ' TILES') : '') + '</span>'
        + '<span class="bwc-s">' + esc(b.says) + '</span></div>';
    });
    if (!special(L)) h += '<div class="bwc-none">NO SPECIAL ABILITY: just its blow.</div>';   /* draft:true */
    return h;
  }
  var CSS = '#bwcard{position:fixed;z-index:2147482000;left:8px;width:min(360px,calc(100vw - 16px));box-sizing:border-box;padding:10px 12px 10px;'
    + 'background:#e9e0c9;color:#1f1710;border-radius:2px;box-shadow:0 2px 0 #000,0 10px 24px rgba(0,0,0,.6);font:12px/1.3 "BohemiaROM",ui-monospace,monospace;pointer-events:none}'
    + '#bwcard .bwc-t{font:bold 14px/1.1 "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1.2px;color:#6b2d0c}'
    + '#bwcard .bwc-b{margin:4px 0 6px;font-size:11px}#bwcard .bwc-b i{font-style:normal;opacity:.75}'
    + '#bwcard .bwc-h{font:10px/1 "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1.6px;color:#6b5f4f;border-top:1px dashed rgba(42,34,26,.45);padding-top:6px;margin-bottom:2px}'
    + '#bwcard .bwc-r{display:grid;grid-template-columns:auto 1fr;column-gap:8px;padding:4px 0;border-bottom:1px dotted rgba(42,34,26,.35)}'
    + '#bwcard .bwc-r b{font:bold 13px/1.1 "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1px}#bwcard .bwc-r b em{font-style:normal;font-size:9px;color:#7a3d10;margin-left:4px}'
    + '#bwcard .bwc-n{text-align:right;font-size:11px;color:#3e1608}#bwcard .bwc-s{grid-column:1/-1;font-size:11px;color:#3a2f22}'
    + '#bwcard .bwc-none{margin-top:6px;font:bold 11px/1.2 "BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1px;color:#6b5f4f}';
  var CUR = { id: null, el: null, at: 0 };
  function hide() { if (CUR.el) CUR.el.style.display = 'none'; CUR.id = null; }
  function show(id, x, y, name) {
    if (!D.by[id]) return false;
    if (!document.getElementById('bwc-style')) { var st = document.createElement('style'); st.id = 'bwc-style'; st.textContent = CSS; (document.head || document.documentElement).appendChild(st); }
    var c = document.getElementById('bwcard'); if (!c) { c = document.createElement('div'); c.id = 'bwcard'; c.setAttribute('role', 'note'); document.body.appendChild(c); }
    c.innerHTML = html(id, name); c.dataset.weapon = id; c.style.display = 'block';
    try { if (window.BohemiaItemCard) BohemiaItemCard.dressWeaponCard(c, id); } catch (e) {}   /* UI THREE [the weapon card] (rule 251(b)): its numbers as pictures with bars, slices/bohemia_ui_three_items.js */
    var W = innerWidth, H = innerHeight, w = c.offsetWidth, h = c.offsetHeight;
    var left = Math.max(8, Math.min(W - w - 8, x - w / 2)), top = y > H / 2 ? Math.max(8, y - h - 40) : Math.min(H - h - 8, y + 40);
    c.style.left = Math.round(left) + 'px'; c.style.top = Math.round(top) + 'px';
    CUR.id = id; CUR.el = c; CUR.at = Date.now();
    (window.__BWC_LOG = window.__BWC_LOG || []).push({ id: id, blows: blows(id).map(function (b) { return b.word; }) });
    return true;
  }
  /* which weapon a touched element is: the shop's data-item, or a kit icon's data-id inside it */
  function weaponAt(t) {
    for (var e = t; e && e.nodeType === 1 && e !== document.body; e = e.parentElement) {
      var di = e.getAttribute && e.getAttribute('data-item'); if (di && /^weapon:/.test(di)) return { id: di.slice(7), el: e };
      var ic = e.querySelector && e.querySelector('[data-id]'); if (ic && D.by[ic.getAttribute('data-id')] && (e.matches('.slot, .gslot, [role=button], button') || e.getAttribute('data-bag') != null || e.getAttribute('data-slot') != null)) return { id: ic.getAttribute('data-id'), el: e };
      if (e.getAttribute && D.by[e.getAttribute('data-id')]) return { id: e.getAttribute('data-id'), el: e };
    }
    return null;
  }
  function nameOf(el) { var n = el.querySelector && el.querySelector('.nm2'); return (n && n.textContent) || (el.getAttribute && el.getAttribute('aria-label')) || null; }
  document.addEventListener('pointerdown', function (e) { if (CUR.id && Date.now() - CUR.at > 120) hide(); }, true);
  document.addEventListener('click', function (e) {
    if (!D.rows) return;
    var hit = weaponAt(e.target); if (!hit) return;
    var r = hit.el.getBoundingClientRect();
    show(hit.id, r.left + r.width / 2, e.clientY || (r.top + r.height / 2), nameOf(hit.el));
  }, true);
  load();
  window.BohemiaWeaponCard = { ready: function () { return load(); }, blows: blows, html: html, show: show, hide: hide, plain: plain, PHRASES: PHRASES,
    rows: function () { return D.rows ? D.rows.map(function (r) { return r.id; }) : []; }, shown: function () { return CUR.id; } };
})();
