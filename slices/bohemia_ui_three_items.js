/* ============================================================================
   BOHEMIA -- THE ITEM CARD AND THE ITEM BOX  (UI THREE, rows [the weapon card] and [the item box], 11/7/26;
   VAMILY rules 251(b), 249(d), 250, 224, 425(a); ask lines 146, 175, 178)

   PAOLO 10/26 (rule 251): 'there's so many numbers, we don't need this many numbers, it should just be an icon, a green arrow
   up, a red arrow down and a number... the way the weapon stats are displayed is dog shit, it's so ugly.'
   PAOLO 10/26 (rule 249): 'the interior of the boxes kinda looks like dog shit.'
   PAOLO 11/7 (rule 425): 'more of the jobs I've been asking you for months.'

   MEASURED BEFORE (the phone, 390 x 844, the smith and the armourer, the crew screen's stash):
     the shop's card was a line of word chips, 'DAMAGE 30-40 | VS ARMOUR 120% | THROUGH ARMOUR 40% | TO HIT ... | A SWING 13 |
     WEIGHT 8', cut by its own box after the third (five of eight never on the glass); the weapon's card (UI 8's pawn ticket)
     said every blow as '4 AP . 13 BREATH . 1 TILE'; a full box was the kit's pocket at 44 points, its two walls a black
     bracket across the top and the left of every piece, the piece small on a flat brown floor; the crew screen's stash wrapped
     '30-50' onto two lines.

   NOW, ONE CARD AND ONE BOX:
   THE CARD (cells()): a row of pictures, each with its bar or one number, never a line of words (rule 251(b)):
     DAMAGE         the hole, a bar from the weakest blow to the hardest, the low-to-high stretch lit, '30-40' on it
     VS ARMOUR      a sledge on a rusted plate, a bar to the most any weapon does to armour, '120%' on it
     THROUGH ARMOUR a round through a plate, a bar to the most any weapon puts straight through, '40%' on it
     REACH          a row of slabs: his own with him on it, then every tile he reaches lit, the ones too close dark
     ACTION         the fight's own pips (its drawer's amber bar): one lit for every action point the blow costs
     BREATH         the lungs and how much breath one blow costs
     WEIGHT         an anvil, a red arrow down and how much breath it takes off him to carry
     ROUNDS         one brass round a shot in the magazine
     TO HIT, HEAD   the skill's own picture (or a range target's paper man), a green arrow up and the amount
     TWO HANDS      two fists on one haft, big, beside the name
     ARMOUR (HOLDS) a plate carrier, a bar to the most any piece of its kind holds, the number on it
     MELEE DEF, RANGED DEF, INITIATIVE  the stat's own picture, the arrow and the amount
   The bar's most possible is the game's own top for that number, read from the rows (records/target/bb/weapons.json and
   armor.json), the same rule as the stats' bars (rule 223: how far it is from the maximum that's even possible). Every
   cell keeps the word it stands for in a screen reader's text and on a held finger (title), never on the glass.
   THE BOX (dress()): one look for every piece's box (the shop's shelf and bag, the crew screen's stash, his gear and the
   picker, the end of a fight's loot): a frame whose metal is the piece's quality (rust for a beat-up one, bone tin for a
   solid one, brass for a good one, brass round red enamel for the valley's own, dark tin for an empty box), a recessed
   wall that holds the shadow of the kit's one sun (up and to the left), the kit's own pocket floor (its cardboard lining,
   its cracked glass when empty: rule 430, the Crashbox art kept and improved), and a pool of light on
   the floor where the piece sits, the piece dropped on its own hard shadow down and to the right. NOTHING HERE CHANGES A
   BOX'S SIZE (rule 250, and UI 9's sizes, rule 402): the frame is a border image drawn over the box's own padding, the
   floor and the light are its background; the lit box's outline stays inside its own rectangle. Every picture is drawn
   in pixels on a canvas at the glass's own pixels (never a CSS gradient, rule 114's tell).

   BohemiaItemCard.ready() -> Promise          .quality(kind, id) -> 'worn'|'solid'|'good'|'own'|null
   BohemiaItemCard.cells(item, {row, arm}) -> [cell]   .strip(item, opts) -> span cells (the shop's .inums contract kept)
   BohemiaItemCard.card(item, opts) -> div (the big card)   .dressWeaponCard(el, id)   .dress(doc)   .MAX
   [bb Battle Brothers' item tooltip: every number beside its own small picture; its stash a grid of dark recessed slots.]
   [analog horror: the box is a pawnshop's tray worn through to the tin, a cheap lamp over the one thing in it.]
   ============================================================================ */
(function () {
  'use strict';
  if (window.BohemiaItemCard) return;
  var BASE = (function () { try { var s = document.currentScript; return s && s.src ? s.src.replace(/[^\/]*$/, '') : ''; } catch (e) { return ''; } })();
  var ICON = function (k) { return BASE + 'stat_icons/' + k + '.png'; };
  var D = { w: null, a: null, by: {}, ours: null, q: {}, wait: null };
  /* the most possible, worked from the rows on load (these are the rows' numbers as shipped 11/7, for a page not loaded yet) */
  var MAX = { damage: 120, vs_armour: 225, through_armour: 60, body: 320, head: 320, shield: 72, ap: 9, reach: 7 };
  var NAME = { damage: 'DAMAGE', vs_armour: 'VS ARMOUR', through_armour: 'THROUGH ARMOUR', reach: 'REACH', ap: 'ACTION POINTS', breath: 'BREATH A BLOW',
    weight: 'WEIGHT', rounds: 'ROUNDS', to_hit: 'TO HIT', head: 'HEAD', armour: 'ARMOUR', holds: 'HOLDS', melee_defense: 'MELEE DEF',
    ranged_defense: 'RANGED DEF', initiative: 'INITIATIVE', two_hands: 'TWO HANDS' };
  var TINT = { damage: '200,44,34', vs_armour: '184,108,58', through_armour: '150,158,164', armour: '84,104,160' };   /* each picture's own colour, lit enough to read on the board and on the receipt */

  function load() {
    if (D.wait) return D.wait;
    var get = function (f) { return fetch(BASE + '../records/target/bb/' + f).then(function (r) { return r.json(); }); };
    D.wait = Promise.all([get('weapons.json'), get('armor.json'), get('ours.json').catch(function () { return null; })]).then(function (a) {
      D.w = a[0].rows || []; D.a = a[1]; D.ours = a[2];
      D.w.forEach(function (r) { D.by['weapon:' + r.id] = r; });
      [['body', 'body'], ['head', 'head'], ['shields', 'shield']].forEach(function (p) { (D.a[p[0]] || []).forEach(function (r) { D.by[p[1] + ':' + r.id] = r; }); });
      var top = function (rows, k) { var m = 0; rows.forEach(function (r) { var v = +r[k]; if (v > m) m = v; }); return m; };
      MAX.damage = top(D.w, 'damage_max') || MAX.damage; MAX.vs_armour = top(D.w, 'armor_damage_pct') || MAX.vs_armour;
      MAX.through_armour = top(D.w, 'armor_ignore_pct') || MAX.through_armour;
      MAX.body = top(D.a.body || [], 'durability') || MAX.body; MAX.head = top(D.a.head || [], 'durability') || MAX.head; MAX.shield = top(D.a.shields || [], 'durability') || MAX.shield;
      /* the quality: a weapon's rank in its own class and hands by the wiki's value (the shop's own qualityWord, so a box's
         frame and the piece's name never disagree); armour, helmets and shields by value in their kind; the valley's own pieces
         (records/target/bb/armory.json) are their own */
      var hands = function (x) { return x.hands ? x.hands | 0 : (/^(bow|crossbow|firearm)$/.test(x['class']) ? 2 : 1); };
      var word = function (rank, n) { var q = rank / Math.max(1, n - 1); return q < 0.34 ? 'worn' : q < 0.67 ? 'solid' : 'good'; };
      D.w.forEach(function (r) {
        if (r.armory) { D.q['weapon:' + r.id] = 'own'; return; }
        var same = D.w.filter(function (x) { return !x.armory && x['class'] === r['class'] && hands(x) === hands(r); }).sort(function (a, b) { return a.value - b.value; });
        D.q['weapon:' + r.id] = word(same.indexOf(r), same.length);
      });
      [['body', 'body'], ['head', 'head'], ['shields', 'shield']].forEach(function (p) {
        var rows = (D.a[p[0]] || []).slice().sort(function (a, b) { return (a.value || 0) - (b.value || 0); });
        rows.forEach(function (r, i) { D.q[p[1] + ':' + r.id] = r.armory ? 'own' : word(i, rows.length); });
      });
      return D;
    });
    return D.wait;
  }
  function kindOf(id) { var ks = ['weapon', 'body', 'head', 'shield']; for (var i = 0; i < ks.length; i++) if (D.by[ks[i] + ':' + id]) return ks[i]; return null; }
  function quality(kind, id) { if (!id) return null; kind = kind || kindOf(id); return D.q[kind + ':' + id] || null; }

  /* ============================== THE CELLS ============================== */
  function O(k) { var v = D.ours && D.ours[k]; return v && typeof v === 'object' && 'value' in v ? v.value : v; }
  /* the row the fight reads for a weapon: a pistol fires the row ours.pistol_shot rides (its damage), its weight its own */
  function fightRow(id) {
    var w = D.by['weapon:' + id]; if (!w) return null;
    var P = O('pistol_shot'), r = P && w['class'] === P['class'] && P.by_row && P.by_row[w.id] ? D.by['weapon:' + P.by_row[w.id]] : null;
    return r ? Object.assign({}, r, { id: w.id, name: w.name, fatigue: w.fatigue, of: w }) : w;
  }
  /* reach and rounds: the roster's own armOf when the page has it (the crew screen and the shop say the same), else the row's */
  function armOf(item, row) {
    var C = window.BohemiaRoster;
    try { if (C && C.armOf && C.data && C.data.weapons) { var a = C.armOf({ kind: 'weapon', id: item.id }); if (a) return a; } } catch (e) {}
    var lo = row.range_min && row.range_max && row.range_min < row.range_max ? row.range_min : 1, hi = row.range_max || 1;
    var mag = row.ammo ? +(String(row.ammo).match(/\d+/) || [0])[0] || null : null, rl = (row.skills || []).some(function (k) { return /^Reload/.test(k.name); });
    return { lo: lo, hi: Math.max(lo, hi), rounds: mag || (rl ? 1 : null), gun: false };
  }
  /* every number a piece shows, in the order it is read (the strip clips from the end, so the last is the least) */
  function cells(item, o) {
    o = o || {}; var kind = item.kind, out = [];
    if (kind === 'weapon') {
      var r = o.row || fightRow(item.id); if (!r) return out;
      var main = (r.skills || []).filter(function (s) { return !/^Reload/.test(s.name); })[0] || {};
      var a = o.arm || armOf(item, r);
      /* a row the wiki gives no damage (a bundle of bottles, a net) shows none, never 'null-null' */
      if (r.damage_min != null && r.damage_max != null) out.push({ k: 'damage', stat: 'damage', icon: 'damage', bar: { lo: r.damage_min, hi: r.damage_max, max: MAX.damage }, text: r.damage_min + '-' + r.damage_max });
      if (r.armor_damage_pct != null) out.push({ k: 'vs_armour', icon: 'vs_armour', bar: { v: r.armor_damage_pct, max: MAX.vs_armour }, text: r.armor_damage_pct + '%' });
      if (r.armor_ignore_pct) out.push({ k: 'through_armour', icon: 'through_armour', bar: { v: r.armor_ignore_pct, max: MAX.through_armour }, text: r.armor_ignore_pct + '%' });
      /* the reader's words for the reach and the rounds are the crew screen's own line (the roster's armLine, the long way:
         'REACH 1 TO 4 TILES', '5 ROUNDS, THEN RELOAD'), so the two cards never say it two ways (THE TOWN'S PART E16) */
      var L = null; try { var C = window.BohemiaRoster; if (C && C.armLine && C.data && C.data.weapons) L = C.armLine({ kind: 'weapon', id: item.id }, true); } catch (e) {}
      if (a) out.push({ k: 'reach', tiles: { lo: a.lo, hi: Math.min(a.hi, MAX.reach) }, text: L ? '' : a.lo === a.hi ? String(a.hi) : a.lo + '-' + a.hi, say: L ? L.reach : null });
      if (main.ap != null) out.push({ k: 'ap', pips: { n: main.ap, of: MAX.ap }, text: String(main.ap) });
      if (main.fatigue) out.push({ k: 'breath', stat: 'fatigue', icon: 'fatigue', text: String(main.fatigue) });
      if (typeof r.fatigue === 'number' && r.fatigue) out.push({ k: 'weight', stat: 'fatigue', icon: 'weight', change: r.fatigue, text: String(r.fatigue) });
      if (a && a.rounds) out.push({ k: 'rounds', rounds: a.rounds, text: L && L.rounds ? '' : String(a.rounds), say: L && L.rounds ? L.rounds : null });
      if (main.hit_bonus) { var sk = /^(bow|crossbow|firearm|throwing)/.test(r['class'] || '') ? 'ranged_skill' : 'melee_skill'; out.push({ k: 'to_hit', icon: sk, change: main.hit_bonus, text: (main.hit_bonus > 0 ? '+' : '') + main.hit_bonus + '%' }); }
      if (r.head_hit_chance) out.push({ k: 'head', icon: 'head', change: r.head_hit_chance, text: (r.head_hit_chance > 0 ? '+' : '') + r.head_hit_chance + '%' });
      return out;
    }
    var row = o.row || D.by[kind + ':' + item.id]; if (!row) return out;
    var f = typeof row.fatigue === 'number' ? row.fatigue : 0;
    if (kind === 'shield') {
      out.push({ k: 'melee_defense', stat: 'melee_defense', icon: 'melee_defense', change: row.melee_defense, text: (row.melee_defense > 0 ? '+' : '') + row.melee_defense });
      out.push({ k: 'ranged_defense', stat: 'ranged_defense', icon: 'ranged_defense', change: row.ranged_defense, text: (row.ranged_defense > 0 ? '+' : '') + row.ranged_defense });
      out.push({ k: 'holds', icon: 'armour', bar: { v: row.durability, max: MAX.shield }, text: String(row.durability) });
      out.push({ k: 'weight', stat: 'fatigue', icon: 'weight', change: f, text: f ? String(f) : '0', say: 'FATIGUE' });
      if (f) out.push({ k: 'initiative', stat: 'initiative', icon: 'initiative', change: f, text: String(f) });
      return out;
    }
    out.push({ k: 'armour', icon: 'armour', bar: { v: row.durability, max: MAX[kind] || MAX.body }, text: String(row.durability) });
    out.push({ k: 'weight', stat: 'fatigue', icon: 'weight', change: f, text: f ? String(f) : '0', say: 'FATIGUE' });
    out.push({ k: 'initiative', stat: 'initiative', icon: 'initiative', change: f, text: f ? String(f) : '0' });
    return out;
  }

  /* ============================== THE PICTURES ============================== */
  var DPR = function () { return Math.max(1, Math.min(4, Math.round(window.devicePixelRatio || 1))); };
  var ARROW = ['0001000', '0011100', '0111110', '1111111', '0011100', '0011100', '0011100'];
  function arrowURL(up) {   /* the stats' own arrow (engine/bohemia_stats.js), seven cells on seven, a pixel of bone round it */
    var B = window.BohemiaStats; if (B && B.css) { B.css(); return null; }
    var c = document.createElement('canvas'); c.width = c.height = 27; var g = c.getContext('2d'), ink = up ? '#2e8b22' : '#b8261b';
    var cell = function (col) { g.fillStyle = col; ARROW.forEach(function (r, y) { for (var x = 0; x < 7; x++) if (r[x] === '1') g.fillRect(3 + x * 3, 3 + (up ? y : 6 - y) * 3, 3, 3); }); };
    g.save(); [[-2, 0], [2, 0], [0, -2], [0, 2]].forEach(function (d) { g.setTransform(1, 0, 0, 1, d[0], d[1]); cell('#efe6d0'); }); g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); cell(ink); return 'url(' + c.toDataURL('image/png') + ')';
  }
  var CSS = ''
    /* a cell: its picture, then its bar or its one number; the word is the reader's (title on a held finger) */
    + '.bic{display:inline-flex!important;align-items:center;gap:3px;flex:0 0 auto;white-space:nowrap;padding:0!important;border:0!important;background:none!important;border-radius:0!important;color:var(--bic-ink,#f2e4c6)}'
    + '.bic>img.bic-ic,.bic>i.bic-ic{flex:0 0 auto;width:var(--bic-ic,16px)!important;height:var(--bic-ic,16px)!important;image-rendering:pixelated;background:center/contain no-repeat}'
    + '.bic>b{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400!important;font-size:var(--bic-fs,12px);letter-spacing:.3px;color:inherit!important;line-height:1}'
    + '.bic-sr{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap;font-style:normal}'
    /* the bar: the stats' track and edge, the fill see-through, the number on a tag of the surface's own paper */
    + 'i.bic-bar{position:relative;display:inline-flex;align-items:center;justify-content:flex-end;flex:0 0 auto;height:var(--bic-bh,14px);box-sizing:border-box;border:1px solid var(--bst-edge,rgba(255,236,200,.28));background:var(--bst-track,rgba(0,0,0,.32));font-style:normal}'
    + 'i.bic-bar>i{position:absolute;top:0;bottom:0;display:block;pointer-events:none}'
    + 'i.bic-bar>b{position:relative;z-index:2;align-self:stretch;display:flex;align-items:center;padding:0 3px;background:var(--bst-tag,rgba(14,11,8,.7));font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;font-size:var(--bic-fs,12px);line-height:1;letter-spacing:.3px;color:var(--bst-ink,#f2e4c6)}'
    + 'i.bic-arw{display:inline-block;flex:0 0 auto;width:9px;height:9px;background:0 0/9px 9px no-repeat;image-rendering:pixelated}'
    + 'i.bic-arw.up{background-image:var(--bst-arrow-up)}i.bic-arw.dn{background-image:var(--bst-arrow-dn)}'
    + '.bic.up>b{color:var(--bst-up,#8fd16a)!important}.bic.dn>b{color:var(--bst-dn,#f08a6c)!important}.bic.eq>b{opacity:.7}'
    /* the pips and the slabs and the rounds: pictures laid side by side at their own pixels */
    + 'i.bic-row{display:inline-block;flex:0 0 auto;font-style:normal;image-rendering:pixelated}'
    + 'i.bic-pips{height:var(--bic-ph,12px)}i.bic-tiles{height:var(--bic-tw,9px)}i.bic-rds{height:calc(var(--bic-rw,5px) * 2)}'
    + 'i.bic-roww{display:inline-flex;align-items:center;gap:2px;font-style:normal}'
    + 'i.bic-roww>b{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;font-size:var(--bic-fs,12px);line-height:1}'
    /* TWO HANDS: the picture big, beside the words RUN TWO keeps (rule 194(b)) */
    + 'i.bic-two{display:inline-block;width:22px;height:22px;margin-right:4px;vertical-align:middle;background:center/contain no-repeat;image-rendering:pixelated}'
    /* the shop's strip: one row, the order is the priority */
    + '.slots.inums.bic-strip{display:flex!important;flex-wrap:nowrap!important;gap:7px!important;align-items:center;overflow:hidden;--bic-ic:16px;--bic-fs:12px;--bic-bh:15px;'
    + '--bst-ink:#f2e4c6;--bst-track:rgba(0,0,0,.32);--bst-edge:rgba(255,236,200,.3);--bst-up:#8fd16a;--bst-dn:#f08a6c;--bst-tag:rgba(14,11,8,.72);--bic-ink:#f2e4c6}'
    + '.ss-facts .twoh{display:inline-flex!important;align-items:center}'
    /* THE BIG CARD (the weapon's pawn ticket, the crew screen): a grid of cells, the bars wide, on the receipt's paper */
    + '.bic-card{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 10px;margin:6px 0 4px;--bic-ic:20px;--bic-fs:13px;--bic-bh:17px;--bic-pw:5px;--bic-ph:14px;--bic-tw:11px;--bic-rw:6px;'
    + '--bst-ink:#1f1710;--bst-track:rgba(31,23,16,.08);--bst-edge:rgba(31,23,16,.42);--bst-up:#1d5a12;--bst-dn:#8a1d0e;--bst-tag:rgba(233,224,201,.78);--bic-ink:#1f1710}'
    + '.bic-card>.bic{min-width:0}.bic-card>.bic>i.bic-bar{flex:1 1 auto;min-width:40px}'
    + '.bic-card>.bic.bic-wide{grid-column:1/-1}'
    /* a blow on the card: its name, then its pips, its breath and its reach as pictures (the words kept for the reader) */
    + '#bwcard .bwc-n.bic-blow{display:inline-flex!important;align-items:center;justify-content:flex-end;gap:7px;--bic-ic:16px;--bic-fs:12px;--bic-pw:4px;--bic-ph:12px;--bic-tw:9px}'
    + '#bwcard .bwc-n.bic-blow .bic{color:#3e1608}#bwcard{width:min(380px,calc(100vw - 16px))!important}'
    + '#bwcard .bwc-t{display:flex;align-items:center;gap:6px}#bwcard .bwc-t i.bic-two{width:24px;height:24px;margin-left:auto}';
  function css() {
    if (document.getElementById('bic-css')) return;
    var B = window.BohemiaStats; if (B && B.css) B.css();
    else { var R = document.documentElement.style; R.setProperty('--bst-arrow-up', arrowURL(true)); R.setProperty('--bst-arrow-dn', arrowURL(false)); }
    var s = document.createElement('style'); s.id = 'bic-css'; s.textContent = CSS + BOX_CSS(); (document.head || document.documentElement).appendChild(s);
  }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function pct(v) { return (Math.round(Math.max(0, Math.min(1, v)) * 100000) / 1000) + '%'; }
  function bar(c, w) {
    var b = el('i', 'bic-bar'), t = TINT[c.icon] || TINT[c.k] || '150,120,70', B = c.bar; b.style.width = w + 'px';
    var lo = B.lo != null ? B.lo : 0, hi = B.hi != null ? B.hi : B.v;
    b.dataset.max = B.max; b.dataset.lo = lo; b.dataset.hi = hi; b.dataset.fill = (hi / B.max).toFixed(5);
    if (B.lo != null) { var u = el('i', 'bic-under'); u.style.left = '0'; u.style.width = pct(lo / B.max); u.style.background = 'rgba(' + t + ',.24)'; b.appendChild(u); }
    var f = el('i', 'bic-fill'); f.style.left = pct(lo / B.max); f.style.width = pct((hi - lo) / B.max); f.style.background = 'rgba(' + t + ',.72)'; f.style.boxShadow = 'inset -1px 0 0 rgb(' + t + ')'; b.appendChild(f);
    b.appendChild(el('b', null, c.text));
    return b;
  }
  /* a row of small pictures (the pips, the slabs, the rounds) laid as ONE picture: one element, a layer each, side by side at
     their own pixels (a row of slabs is one thing to read, and one thing to count: the crew screen's budget, rule 172(c)) */
  var ROWW = { 'bic-pips': 'var(--bic-pw,4px)', 'bic-tiles': 'var(--bic-tw,9px)', 'bic-rds': 'var(--bic-rw,5px)' };
  function layers(r, cls, n, src) {   /* lay n pictures on an element as its background, one layer each, side by side */
    var W = ROWW[cls], U = [], lit = 0;
    for (var i = 0; i < n; i++) { var u = typeof src === 'function' ? src(i) : src; U.push(u); if (/pip\.png$|tile_lit|round/.test(u)) lit++; }
    r.style.backgroundImage = U.map(function (u) { return 'url(' + u + ')'; }).join(',');
    r.style.backgroundPosition = U.map(function (u, i) { return 'calc((' + W + ' + 1px) * ' + i + ') 0'; }).join(',');
    r.style.backgroundSize = W + ' 100%'; r.style.backgroundRepeat = 'no-repeat'; r.style.width = 'calc((' + W + ' + 1px) * ' + n + ' - 1px)';
    r.dataset.n = n; r.dataset.lit = lit; if (/tile_you/.test(U[0] || '')) r.dataset.you = '1'; else delete r.dataset.you;
    return r;
  }
  function row(cls, n, src, extra) {
    var r = layers(el('i', 'bic-row ' + cls), cls, n, src);
    if (!extra) return r;
    var w = el('i', 'bic-roww'); w.appendChild(r); w.appendChild(extra); return w;
  }
  /* one cell. o.form 'strip' or 'card'; o.wide the bar's width; the shop's chip contract: span.ch, data-stat, an img from
     stat_icons/, its words and its b (RUN TWO's gate reads 'DAMAGE 30-40', 'HOLDS 32', a chip's stat and its number) */
  function cell(c, o) {
    o = o || {}; var s = el('span', 'ch bic bic-' + c.k); s.dataset.cell = c.k; if (c.stat) s.dataset.stat = c.stat;
    var word = c.say || NAME[c.k] || c.k.toUpperCase(), said = c.text ? word + ' ' + c.text : word; s.title = said; s.setAttribute('aria-label', said);
    if (c.icon) { var im = el('img', 'bic-ic'); im.alt = ''; im.src = ICON(c.icon); s.appendChild(im); }
    s.appendChild(el('i', 'bic-sr', word + ' '));
    if (c.bar) { s.appendChild(bar(c, o.form === 'card' ? 60 : (c.k === 'damage' ? 50 : c.k === 'armour' || c.k === 'holds' ? 48 : 38))); return s; }
    if (c.change != null) { var d = +c.change; s.classList.add(d > 0 ? 'up' : d < 0 ? 'dn' : 'eq'); s.dataset.delta = d;
      if (d) { var a = el('i', 'bic-arw ' + (d > 0 ? 'up' : 'dn')); a.setAttribute('aria-hidden', 'true'); s.appendChild(a); }
      s.appendChild(el('b', null, c.text)); return s; }
    if (c.pips) { var lit = Math.max(0, Math.min(c.pips.of, c.pips.n | 0)), n = o.form === 'card' ? c.pips.of : lit;
      s.dataset.n = lit; s.appendChild(row('bic-pips', n, function (i) { return ICON(i < lit ? 'pip' : 'pip_off'); })); if (c.text) s.appendChild(el('b', 'bic-sr', c.text)); return s; }
    if (c.tiles) { var hi = c.tiles.hi, lo = c.tiles.lo; s.dataset.lo = lo; s.dataset.hi = hi;
      s.appendChild(row('bic-tiles', hi + 1, function (i) { return ICON(i === 0 ? 'tile_you' : i >= lo ? 'tile_lit' : 'tile'); })); if (c.text) s.appendChild(el('b', 'bic-sr', c.text)); return s; }
    if (c.rounds) { var n2 = Math.min(c.rounds, 6); s.dataset.n = c.rounds;
      s.appendChild(row('bic-rds', n2, ICON('round'), c.rounds > 6 ? el('b', null, '+' + (c.rounds - 6)) : null)); if (c.text) s.appendChild(el('b', 'bic-sr', c.text)); return s; }
    s.appendChild(el('b', null, c.text));
    return s;
  }
  /* the shop's strip: the cells in RUN TWO's .inums box (its contract kept), one row, the least important clipped first */
  function strip(item, o) { css(); var L = cells(item, o); if (!L.length) return null; return L.map(function (c) { return cell(c, { form: 'strip' }); }); }
  /* the big card: every cell on two columns, the bars long, damage across both */
  function card(item, o) {
    css(); var L = cells(item, o); if (!L.length) return null;
    var w = el('div', 'bic-card'); w.dataset.item = item.kind + ':' + item.id;
    L.forEach(function (c) { var e = cell(c, { form: 'card' }); if (c.k === 'damage' || c.k === 'armour' || c.k === 'holds') e.classList.add('bic-wide'); w.appendChild(e); });
    return w;
  }
  function twoIcon() { var t = el('i', 'bic-two'); t.style.backgroundImage = 'url(' + ICON('two_hands') + ')'; t.setAttribute('aria-hidden', 'true'); t.dataset.two = '1'; return t; }

  /* UI 8's pawn ticket (slices/bohemia_ui_weapon_card.js), dressed after it is written: the numbers under its title become the
     big card, every blow's '4 AP . 13 BREATH . 1 TILE' its pips, its breath and its slabs (the words kept for the reader and
     the ticket's own gate), TWO HANDS its picture beside the name */
  function dressWeaponCard(c, id) {
    if (!c || !D.w) return false; css();
    var r = D.by['weapon:' + id]; if (!r) return false;
    var item = { kind: 'weapon', id: id }, fr = fightRow(id), a = armOf(item, fr);
    var t = c.querySelector('.bwc-t'); if (t && (r.hands === 2 || /^(bow|crossbow|firearm)$/.test(r['class'])) && !t.querySelector('.bic-two')) { var ti = twoIcon(); ti.title = 'TWO HANDS'; t.appendChild(ti); }
    var b = c.querySelector('.bwc-b'), ii = b && b.querySelector('i'); if (ii) ii.remove();   /* 'Damage 30-45.' said as the bar now */
    var k = card(item, { row: fr, arm: a }); if (k && b) b.parentNode.insertBefore(k, b.nextSibling);
    var blows = window.BohemiaWeaponCard && BohemiaWeaponCard.blows ? BohemiaWeaponCard.blows(id) : null;
    [].forEach.call(c.querySelectorAll('.bwc-r'), function (rw, i) {
      var n = rw.querySelector('.bwc-n'), bl = blows && blows[i]; if (!n || !bl) return;
      var said = n.textContent; n.textContent = ''; n.classList.add('bic-blow'); n.appendChild(el('i', 'bic-sr', said));
      if (bl.ap != null) n.appendChild(cell({ k: 'ap', pips: { n: bl.ap, of: MAX.ap }, text: String(bl.ap) }, { form: 'strip' }));
      if (bl.breath) n.appendChild(cell({ k: 'breath', icon: 'fatigue', text: String(bl.breath) }, { form: 'strip' }));
      /* the slabs: a blow with a reach of its own (a melee strike, a whip's two) from the next tile out; a shot rides the
         weapon's own reach as the fight reads it (the roster's armOf: a crossbow's '6-6' row is 1 to 6 in the fight) */
      if (bl.reach != null) { var lo = 1, hi = +bl.reach;
        if (typeof bl.reach !== 'number') { var m = String(bl.reach).match(/\d+/g) || ['1']; lo = a ? a.lo : +m[0]; hi = a ? a.hi : +m[m.length - 1]; }
        n.appendChild(cell({ k: 'reach', tiles: { lo: Math.min(lo, hi), hi: Math.min(hi, MAX.reach) }, text: lo === hi ? String(hi) : lo + '-' + hi }, { form: 'strip' })); }
      [].forEach.call(n.querySelectorAll('.bic'), function (x) { x.classList.remove('ch'); });
    });
    c.dataset.dressed = 'bic';
    return true;
  }

  /* ============================== THE BOX ============================== */
  /* every picture of the box drawn once a quality, at the glass's own pixels; the frame a border image (nine pieces, laid
     over the box's own padding, so the box keeps its size), the floor and the light its background */
  var FRAME = {   /* the metal's mid, its lit edge (up and left, the kit's sun), its dark edge, and its grain */
    plain: [[52, 45, 36], [82, 72, 58], [20, 16, 12], 6], worn: [[104, 58, 32], [150, 92, 52], [48, 24, 12], 14],
    solid: [[176, 166, 140], [226, 218, 194], [104, 94, 74], 8], good: [[184, 140, 54], [240, 204, 118], [98, 68, 22], 8],
    own: [[184, 140, 54], [240, 204, 118], [98, 68, 22], 8]
  };
  var PX = { ring: 3, wall: 3 };   /* in CSS pixels: the frame's metal, then the wall down to the floor */
  function rnd(seed) { var x = seed >>> 0 || 1; return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; }
  function frameURL(q) {
    var d = DPR(), S = (PX.ring + PX.wall) * d, N = S * 2 + d * 2, c = document.createElement('canvas'); c.width = c.height = N;
    var g = c.getContext('2d', { willReadFrequently: true }), F = FRAME[q] || FRAME.plain, R = rnd(q.length * 977 + 31), ring = PX.ring * d;   /* PLUMBER 8: made to be encoded, on the CPU */
    var px = function (x, y, rgb, a) { g.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + (a == null ? 1 : a) + ')'; g.fillRect(x, y, 1, 1); };
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var dEdge = Math.min(x, y, N - 1 - x, N - 1 - y);
      if (dEdge < ring) {   /* the rim, three bands: its outer lip (lit up and left, dark down and right), its body, its inner lip
                               (the other way round: a raised rim); a line of ink round the outside */
        var side0 = [y, x, N - 1 - y, N - 1 - x].indexOf(dEdge), up = side0 <= 1, band = Math.floor(dEdge / d), j = (R() - 0.5) * F[3];
        var col = band === 0 ? (up ? F[1] : F[2]) : band === PX.ring - 1 ? (up ? F[2] : F[1]) : F[0];
        if (dEdge === 0) col = [12, 8, 5];
        if (q === 'worn' && dEdge > 0 && R() < 0.12) col = [40, 22, 12];   /* the rust pitted through */
        px(x, y, [col[0] + j, col[1] + j, col[2] + j]);
      } else {   /* the wall: the top and left in the shadow the rim throws, the bottom and right catch the sun; fading to the floor */
        var w = dEdge - ring, wall = PX.wall * d, t = 1 - w / wall, side = [y, x, N - 1 - y, N - 1 - x].indexOf(dEdge);
        if (w < wall) {
          if (side <= 1) { var bay = ((x & 1) + 2 * (y & 1)) / 4; if (t * 0.95 > bay * 0.5) px(x, y, [6, 4, 2], 0.3 + 0.6 * t); }
          else if (w < d) px(x, y, [255, 232, 190], 0.10);
        }
        if (q === 'own' && w < d) px(x, y, [150, 30, 24]);   /* the valley's own: red enamel round the brass */
      }
    }
    if (q === 'good' || q === 'own') { var r0 = Math.floor((ring - d) / 2), r1 = N - ring + r0;   /* a rivet in each corner */
      [[r0, r0], [r1, r0], [r0, r1], [r1, r1]].forEach(function (p) { g.fillStyle = 'rgb(250,224,150)'; g.fillRect(p[0], p[1], d, d); g.fillStyle = 'rgb(90,60,20)'; g.fillRect(p[0] + d - 1, p[1] + d - 1, 1, 1); }); }
    return { url: c.toDataURL('image/png'), slice: S, w: PX.ring + PX.wall };
  }
  function poolURL() {   /* the lamp over the piece: a soft pool, warm, ordered-dithered in four steps at the glass's pixels */
    var d = DPR(), S = 34, N = S * d, c = document.createElement('canvas'); c.width = c.height = N; var g = c.getContext('2d', { willReadFrequently: true });   /* PLUMBER 8: made to be encoded, on the CPU */
    var bay = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var dx = (x - N * 0.46) / (N * 0.5), dy = (y - N * 0.44) / (N * 0.46), r = Math.sqrt(dx * dx + dy * dy); if (r >= 1) continue;
      var v = (1 - r) * (1 - r) * 4, step = Math.floor(v), frac = v - step, th = bay[y & 3][x & 3] / 16;
      var lv = step + (frac > th ? 1 : 0); if (!lv) continue;
      g.fillStyle = 'rgba(255,214,150,' + (0.065 * lv).toFixed(3) + ')'; g.fillRect(x, y, 1, 1);
    }
    return { url: c.toDataURL('image/png'), size: S };
  }
  var BOX = null;
  function BOX_CSS() {
    /* the floor is the kit's own (rule 430: the Crashbox art stays and is improved): the pocket's cardboard lining for a box
       with a piece in it, its cracked glass for an empty one, one period of 48 points as the kit lays it (slices/ui_kit/) */
    if (!BOX) { BOX = { pool: poolURL(), floor: { url: BASE + 'ui_kit/well_full/c.png', size: 48 }, floorE: { url: BASE + 'ui_kit/well/c.png', size: 48 }, f: {} }; ['plain', 'worn', 'solid', 'good', 'own'].forEach(function (q) { BOX.f[q] = frameURL(q); }); }
    var P = 'html.bib-on:not(#bib-a):not(#bib-b):not(#bib-c) body .bib', out = [];   /* three ids: the camp's own crew screen rules carry two (html.bm-camp-live[data-bm-roster]:not(#bm-x) body #bag .slot.full) */
    var frame = function (q) { var F = BOX.f[q]; return 'border-image-source:url(' + F.url + ')!important;border-image-slice:' + F.slice + '!important;border-image-width:' + F.w + 'px!important;border-image-outset:0!important;border-image-repeat:repeat!important;'; };
    out.push(P + '{' + frame('plain') + 'border-color:transparent!important;border-radius:0!important;background-color:#1a1510!important;'
      + 'background-image:url(' + BOX.floorE.url + ')!important;background-size:' + BOX.floorE.size + 'px ' + BOX.floorE.size + 'px!important;background-position:0 0!important;background-repeat:repeat!important;background-origin:border-box!important;background-clip:border-box!important;background-blend-mode:normal!important;image-rendering:auto}');
    out.push(P + '[data-bq]{background-image:url(' + BOX.pool.url + '),url(' + BOX.floor.url + ')!important;background-size:' + BOX.pool.size + 'px ' + BOX.pool.size + 'px,' + BOX.floor.size + 'px ' + BOX.floor.size + 'px!important;'
      + 'background-position:50% 30%,0 0!important;background-repeat:no-repeat,repeat!important;background-color:#2a221a!important}');
    /* a grid of pockets: every box's floor cut from another part of the same glass, as the kit cuts it (its nth-child four) */
    [[3, 1, [0.37, 0.61]], [3, 2, [0.71, 0.23]], [5, 3, [0.13, 0.47]], [7, 4, [0.55, 0.83]]].forEach(function (v) {
      var at = Math.round(-48 * v[2][0]) + 'px ' + Math.round(-48 * v[2][1]) + 'px';
      out.push(P + ':nth-child(' + v[0] + 'n+' + v[1] + '){background-position:' + at + '!important}');
      out.push(P + '[data-bq]:nth-child(' + v[0] + 'n+' + v[1] + '){background-position:50% 30%,' + at + '!important}'); });
    ['worn', 'solid', 'good', 'own'].forEach(function (q) { out.push(P + '[data-bq="' + q + '"]{' + frame(q) + '}'); });
    out.push(P + '[data-bq="plain"]{' + frame('plain') + '}');
    /* the piece lit, on its own hard shadow down and to the right (the kit's sun); the nth-child pockets of the kit undone */
    out.push(P + '[data-bq] img.pk,' + P + '[data-bq] canvas,' + P + '[data-bq] .bm-icon{filter:drop-shadow(1px 1px 0 rgba(8,5,2,.8)) brightness(1.08)!important}');
    out.push(P + '.slot b,' + P + '.slot em{white-space:nowrap!important;letter-spacing:0!important}');
    out.push(P + ' b.bic-pic{display:inline-block!important;--bic-tw:7px;--bic-rw:4px;font-size:0!important;line-height:0!important;color:transparent!important;text-shadow:none!important;overflow:hidden;flex:0 0 auto;padding:0!important;margin-top:2px;image-rendering:pixelated}'
      + P + ' b.bic-pic.bic-tiles{height:var(--bic-tw)!important}' + P + ' b.bic-pic.bic-rds{height:calc(var(--bic-rw) * 2)!important}');   /* '30-50' on one line in a stash box (it wrapped to two) */
    return out.join('\n');
  }
  /* which piece a box holds: the shop's tile (__it), a data-item, or a kit icon's data-id inside it */
  function pieceOf(b) {
    if (b.__it && b.__it.id) return { kind: b.__it.kind, id: b.__it.id };
    var di = b.getAttribute('data-item'); if (di && di.indexOf(':') > 0) return { kind: di.split(':')[0], id: di.split(':')[1] };
    var ic = b.querySelector('[data-id]'); if (ic) { var id = ic.getAttribute('data-id'); return { kind: kindOf(id), id: id }; }
    if (b.dataset.id && kindOf(b.dataset.id)) return { kind: kindOf(b.dataset.id), id: b.dataset.id };
    return null;
  }
  var BOXES = { SETTLEMENT_SCREEN: '#sheet .grid .slot', ROSTER_SCREEN: '#bag .slot, .gslot, #picker .slot', SPOILS_SCREEN: '.slot', STASH_SCREEN: '.slot' };
  function boxSel() { var p = location.pathname; for (var k in BOXES) if (p.indexOf(k) >= 0) return BOXES[k]; return null; }
  var LOG = { dressed: 0, runs: 0 };
  function dressNow(doc) {
    doc = doc || document; var sel = boxSel(); if (!sel) return 0;
    var html = doc.documentElement; if (!html.classList.contains('bib-on')) html.classList.add('bib-on');
    css(); var n = 0;
    [].forEach.call(doc.querySelectorAll(sel), function (b) {
      if (!b.classList.contains('bib')) b.classList.add('bib');
      var full = b.classList.contains('full') || !!b.querySelector('img,canvas,.bm-icon,[data-id]');
      var p = full ? pieceOf(b) : null, q = p ? (quality(p.kind, p.id) || 'plain') : full ? 'plain' : null;
      if (q) { if (b.dataset.bq !== q) b.dataset.bq = q; } else if (b.hasAttribute('data-bq')) b.removeAttribute('data-bq');
      pictures(b);
      n++;
    });
    LOG.dressed = n; LOG.runs++;
    return n;
  }
  /* inside a box, a reach said in words ('1-4 TILES', two lines in his main hand's box) becomes its slabs, and a magazine
     ('5 RDS') its rounds; the words stay for the reader (the box's text is the same, so every screen that reads it reads it) */
  function pictures(b) {
    [].forEach.call(b.querySelectorAll('b.v, b.arm'), function (v) {
      var t = v.textContent.replace(/\s+/g, ' ').trim(); if (v.dataset.bicText === t) return;
      var m = t.match(/^(\d+)(?:-(\d+))? TILES?$/), r = t.match(/^(\d+) RDS?$/);
      if (m) { var lo = +m[1], hi = m[2] ? +m[2] : lo; hi = Math.min(hi, MAX.reach); lo = Math.min(lo, hi);
        v.className = v.className.replace(/\s*bic-(pic|row|tiles|rds)\b/g, '') + ' bic-pic bic-row bic-tiles';
        layers(v, 'bic-tiles', hi + 1, function (i) { return ICON(i === 0 ? 'tile_you' : i >= lo ? 'tile_lit' : 'tile'); }); }
      else if (r && +r[1] <= 6) { v.className = v.className.replace(/\s*bic-(pic|row|tiles|rds)\b/g, '') + ' bic-pic bic-row bic-rds'; layers(v, 'bic-rds', +r[1], ICON('round')); }
      else { if (v.classList.contains('bic-pic')) { v.classList.remove('bic-pic', 'bic-row', 'bic-tiles', 'bic-rds'); v.style.backgroundImage = v.style.width = ''; } v.dataset.bicText = t; return; }
      /* the words stay the label's own text (every screen and gate that reads it reads '1-4 TILES'), drawn at no size: the
         picture IS the label, one thing on the screen where the words were (the crew screen's count, rule 172(c)) */
      v.dataset.bicText = t; v.title = t; v.setAttribute('aria-label', t);
    });
  }
  var pending = false;
  function dress(doc) {
    if (pending) return; pending = true;
    (window.requestAnimationFrame || setTimeout)(function () { pending = false; try { dressNow(doc); } catch (e) {} });
  }
  function watch() {
    if (!boxSel() || !document.body) return;
    load().then(function () { dress(); }).catch(function () {});
    var sel = boxSel();   /* a class changing anywhere else (the town's idles, the fight behind) never wakes the dresser */
    try { new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) if (ms[i].addedNodes.length || (ms[i].type === 'attributes' && ms[i].target.matches && ms[i].target.matches(sel))) { dress(); return; } })
      .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] }); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
  load();

  window.BohemiaItemCard = { ready: load, quality: quality, cells: cells, cell: cell, strip: strip, card: card, twoIcon: twoIcon, dressWeaponCard: dressWeaponCard,
    dress: dressNow, MAX: MAX, NAME: NAME, ICON: ICON, log: function () { return { dressed: LOG.dressed, runs: LOG.runs }; }, fightRow: fightRow };
})();
