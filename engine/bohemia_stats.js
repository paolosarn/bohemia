/* ============================================================================
   BOHEMIA -- THE EIGHT, IN HIS ORDER, AND THE BAR TO THE MOST POSSIBLE (UI THREE, rows [the stat order] and
   [stats are bars and arrows], 10/26/26; VAMILY rules 223, 224, 247)

   PAOLO 10/26 (rule 247, LOCKED): 'the order I want to display the stats: HP, fatigue, ranged attack, melee attack, ranged
   defence, melee defence, morale and initiative, across the board, because I'm trying to scan the stars quickly... HP first
   just feels right... I wanna see, behind the numbers, like a progress bar, how far it is from the maximum that's even
   possible... remember, I asked that.' And (rule 223): 'the trait and its logo and an up green icon or a down red icon plus
   the number... I don't even want to see it would go from 63 to 68.'

   ONE LIST, ONE PLACE. Every screen that shows a man's eight reads ORDER from here, so the order can never drift.
   The DATA order the dice walk (engine/bohemia_roster.js STATS, engine/bohemia_origin_start.js STATS, Battle Brothers'
   own) is NOT this list and must not change: a seeded man is rolled stat by stat in that order, so reordering it
   would re-roll every saved man. This list is what is DISPLAYED.

   THE MOST POSSIBLE, one number a stat, the same on every screen (rule 223(c), 247(d); TUNING's ruling, the one table's
   section Q, records/BOHEMIA_TUNING_THE_BARS_MAXIMA_10_26_26.md): the highest any background rolls at the door
   (records/target/bb/backgrounds.json, the top of its range) plus the best trait a man can roll at the post for that
   stat (records/target/bb/traits.json, at_the_post, a flat number: Tough, Strong, Fearless, Quick, Dexterous, Paranoid)
   plus ten level-ups (levels 2 to 11) at the best roll with three stars (rules.json experience.stat_gains_by_stars, the
   top of the 3-star column): HP 133, FATIGUE 183, RANGED SKILL 109, MELEE SKILL 122, RANGED DEFENCE 68, MELEE DEFENCE 65,
   RESOLVE 120, INITIATIVE 195. Kept in records/target/bb/stat_max.json (a modder's file, MODS rule 22), computed by
   tools/bohemia_ui_three_stat_max.js from the same three files; the numbers below are that file's, for a screen that has
   not read it yet. Past the end (a veteran's +1s past 11, a shield, Colossus) the bar is full: TUNING's clip rule.

   HIS OWN CEILING, the faint tick [COORDINATOR'S DEFAULT, rule 205, his to kill]: his number now plus every level left to
   11 at the MIDDLE of his star column for that stat (TUNING's bar.tick.own_ceiling: where he lands raising that stat
   every level, the same middle RUN THREE's hall ceiling uses); past 11 his number. Two men with the same number read apart
   by their stars. The tick moves with what he wears, as his number does.

   THE COMPONENT (the DOM half, used by the crew screen, the level-up, the hall and the shop): row() is the stat's icon,
   its stars in one column beside it, and a bar filled to his number over the most possible, translucent, the number on
   the bar; change() is the stat's icon, a green up or red down arrow and the amount, the changed part of the bar lit.
   No 'X to Y' anywhere. Built from i and b elements only (a screen that counts its own spans keeps its count).
   ========================================================================== */
(function (root) {
  'use strict';
  var ORDER = ['hp', 'fatigue', 'ranged_skill', 'melee_skill', 'ranged_defense', 'melee_defense', 'resolve', 'initiative'];
  var NAME = { hp: 'HITPOINTS', fatigue: 'FATIGUE', ranged_skill: 'RANGED SKILL', melee_skill: 'MELEE SKILL',
    ranged_defense: 'RANGED DEFENCE', melee_defense: 'MELEE DEFENCE', resolve: 'RESOLVE', initiative: 'INITIATIVE' };
  /* rules.json names the columns its own way */
  var RULE_KEY = { hp: 'HP', fatigue: 'Fatigue', resolve: 'Resolve', initiative: 'Initiative', melee_skill: 'Melee Skill',
    ranged_skill: 'Ranged Skill', melee_defense: 'Melee Defense', ranged_defense: 'Ranged Defense' };
  /* records/target/bb/stat_max.json as computed (tools/bohemia_ui_three_stat_max.js); load() replaces these with the file */
  var DATA = {
    top_level: 11,
    max: { hp: 133, fatigue: 183, ranged_skill: 109, melee_skill: 122, ranged_defense: 68, melee_defense: 65, resolve: 120, initiative: 195 },
    best_roll: { hp: [4, 4, 4, 5], fatigue: [4, 4, 4, 5], ranged_skill: [4, 4, 4, 5], melee_skill: [3, 3, 3, 4],
      ranged_defense: [4, 4, 4, 5], melee_defense: [3, 3, 3, 4], resolve: [4, 4, 4, 5], initiative: [5, 5, 5, 6] },
    mid_roll: { hp: [3, 3.5, 4, 4.5], fatigue: [3, 3.5, 4, 4.5], ranged_skill: [3, 3.5, 4, 4.5], melee_skill: [2, 2.5, 3, 3.5],
      ranged_defense: [3, 3.5, 4, 4.5], melee_defense: [2, 2.5, 3, 3.5], resolve: [3, 3.5, 4, 4.5], initiative: [4, 4.5, 5, 5.5] }
  };

  /* the file's numbers from the game's own three files: the top of every background's range, the best flat trait a man can
     roll at the post, and ten levels at the 3-star column's best roll (a column reads '4-5': the best is 5, the middle 4.5) */
  function topOf(txt) { var m = String(txt).split('-').map(Number); return m[m.length - 1]; }
  function midOf(txt) { var m = String(txt).split('-').map(Number); return (m[0] + m[m.length - 1]) / 2; }
  function compute(backgrounds, rules, traits, levels) {
    var xp = rules.experience || rules, g = (xp.stat_gains_by_stars && xp.stat_gains_by_stars.value) || xp.stat_gains_by_stars;
    var n = levels == null ? 10 : levels, out = { top_level: n + 1, max: {}, base_top: {}, from: {}, trait_top: {}, trait_from: {}, best_roll: {}, mid_roll: {} };
    var T = (traits && (traits.traits || traits.rows)) || [];
    ORDER.forEach(function (k) {
      var hi = -1, who = null, tb = 0, tw = null;
      ((backgrounds && backgrounds.rows) || []).forEach(function (r) { var rg = r.stats && r.stats[k]; if (rg && rg[rg.length - 1] > hi) { hi = rg[rg.length - 1]; who = r.id; } });
      T.forEach(function (t) { if (!t.at_the_post) return; (t.effects || []).forEach(function (e) { if (e.stat === k && e.flat_eight && !e.pct && e.n > tb) { tb = e.n; tw = t.id; } }); });
      out.best_roll[k] = g[RULE_KEY[k]].map(topOf); out.mid_roll[k] = g[RULE_KEY[k]].map(midOf);
      out.base_top[k] = hi; out.from[k] = who; out.trait_top[k] = tb; out.trait_from[k] = tw;
      out.max[k] = hi + tb + n * out.best_roll[k][3];
    });
    return out;
  }
  function load(base) {
    base = base || '../records/target/bb/';
    if (typeof fetch !== 'function') return Promise.resolve(DATA);
    return fetch(base + 'stat_max.json').then(function (r) { return r.json(); }).then(function (f) {
      ORDER.forEach(function (k) { var v = f.max && f.max[k]; if (v && v.value != null) v = v.value; if (typeof v === 'number' && v > 0) DATA.max[k] = v;
        var b = f.best_roll && f.best_roll[k]; if (Array.isArray(b) && b.length === 4) DATA.best_roll[k] = b.slice();
        var md = f.mid_roll && f.mid_roll[k]; if (Array.isArray(md) && md.length === 4) DATA.mid_roll[k] = md.slice(); });
      if (f.top_level) DATA.top_level = f.top_level;
      return DATA;
    }).catch(function () { return DATA; });
  }
  function maxOf(k) { return DATA.max[k] || 100; }
  /* the share of the bar a number fills, 0 to 1 */
  function fill(k, n) { return Math.max(0, Math.min(1, (+n || 0) / maxOf(k))); }
  /* what is left for him to gain in this stat: every level to 11 at the middle of his star column (TUNING) */
  function growth(man, k) {
    var lv = Math.max(1, (man && man.level) || 1), left = Math.max(0, DATA.top_level - lv), st = ((man && man.stars) || {})[k] || 0;
    return left * DATA.mid_roll[k][Math.max(0, Math.min(3, st))];
  }
  /* his ceiling on the bar: the number shown now (his own, or with what he wears) plus what is left to gain */
  function ceilingOf(man, k, shown) { var n = shown != null ? +shown : ((man && man.stats && man.stats[k]) || 0); return n + growth(man, k); }

  var API = { ORDER: ORDER, NAME: NAME, RULE_KEY: RULE_KEY, DATA: DATA, compute: compute, load: load, maxOf: maxOf, fill: fill, growth: growth, ceilingOf: ceilingOf };
  root.BohemiaStats = API;
  if (typeof document === 'undefined') return;

  /* ============================== THE COMPONENT ============================== */
  /* the fill's colour, one a stat, translucent so the number reads through it (the kit's faded act-one palette) */
  var TINT = { hp: '163,48,30', fatigue: '47,111,143', ranged_skill: '118,132,42', melee_skill: '150,88,38',
    ranged_defense: '84,104,52', melee_defense: '88,106,124', resolve: '172,118,30', initiative: '196,156,36' };
  /* the arrow, seven cells on seven like the kit's star, a pixel of bone round it so it reads on paper, glass and tin */
  var ARROW = ['0001000', '0011100', '0111110', '1111111', '0011100', '0011100', '0011100'];
  function arrowURL(up, ink) {
    var c = document.createElement('canvas'); c.width = c.height = 27; var g = c.getContext('2d');
    var cell = function (col) { g.fillStyle = col; ARROW.forEach(function (r, y) { for (var x = 0; x < 7; x++) if (r[x] === '1') g.fillRect(3 + x * 3, 3 + (up ? y : 6 - y) * 3, 3, 3); }); };
    g.save(); [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, 1], [-1, 1], [1, -1]].forEach(function (d) { g.setTransform(1, 0, 0, 1, d[0], d[1]); cell('#efe6d0'); }); g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); cell(ink); return 'url(' + c.toDataURL('image/png') + ')';
  }
  function iconURL(k) { var M = root.BohemiaMaterials; return M && M.statIcon ? M.statIcon(k) : 'stat_icons/' + k + '.png'; }
  var CSS = ''
    + ':root{--bst-ink:#1f1710;--bst-track:rgba(31,23,16,.07);--bst-edge:rgba(31,23,16,.42);--bst-up:#1d5a12;--bst-dn:#8a1d0e;--bst-tick:rgba(31,23,16,.62);--bst-tag:rgba(226,218,198,.7)}'
    + '.bst-glass{--bst-ink:#f2e4c6;--bst-track:rgba(0,0,0,.32);--bst-edge:rgba(255,236,200,.28);--bst-up:#8fd16a;--bst-dn:#f08a6c;--bst-tick:rgba(255,236,200,.7);--bst-tag:rgba(14,11,8,.7)}'
    + '.bst-row{display:grid!important;grid-template-columns:24px 23px minmax(0,1fr) 40px;align-items:center;column-gap:4px;min-height:20px;white-space:nowrap;color:var(--bst-ink)}'   /* the last column always held: nothing moves when a change shows (rule 250) */
    + '.bst-row>b.bst-chg{justify-content:flex-end}'
    + '.bst-row>.bst-ic{display:inline-flex;align-items:center;width:24px;height:20px;font-size:0}'
    + 'i.bst-ic{background:center/24px 24px no-repeat;image-rendering:pixelated}'
    + '.bst-st{display:flex!important;align-items:center;gap:1px;width:23px;height:9px;margin:0!important;font-style:normal;line-height:0}'
    + '.bst-st .bmstar{margin:0!important;flex:0 0 7px;width:7px;height:7px;background:var(--bm-mark-star-ink) 0 0/7px 7px no-repeat;image-rendering:pixelated}'
    + '.bst-glass .bst-st .bmstar{background-image:var(--bm-mark-star)}'
    + '.bst-bar{position:relative;display:flex;align-items:center;height:16px;min-width:40px;box-sizing:border-box;border:1px solid var(--bst-edge);background:var(--bst-track);font-style:normal;overflow:visible}'
    + '.bst-bar>i{position:absolute;top:0;bottom:0;left:0;display:block;pointer-events:none;font-style:normal}'
    + '.bst-fill{z-index:0}'
    + '.bst-lit{z-index:1}.bst-lit.up{background:rgba(52,150,40,.78)}.bst-lit.dn{background:var(--bst-hatch-dn) 0 0/4px 4px repeat;image-rendering:pixelated}'   /* what is lost: a drawn hatch, never a CSS gradient (rule 114's tell) */
    + '.bst-bar>i.bst-tick{z-index:2;top:-3px;bottom:-3px;width:0;border-left:1px solid var(--bst-tick)}'
    /* the number on a see-through tag of the surface's own paper (or glass): the fill shows through it and runs on past it,
       and the number passes 4.5 to 1 in the sun (rule 73; the fill alone behind dark ink measured 3.3 in the sun) */
    + '.bst-bar>i.bst-n{position:relative;z-index:3;align-self:stretch;display:flex;align-items:center;padding:0 4px;background:var(--bst-tag);font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:13px;line-height:12px;font-weight:400;letter-spacing:.4px;color:var(--bst-ink)}'
    + 'b.bst-chg{display:inline-flex;align-items:center;gap:2px;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;font-size:12px;letter-spacing:.3px}'
    + 'b.bst-chg.up{color:var(--bst-up)}b.bst-chg.dn{color:var(--bst-dn)}b.bst-chg.eq{color:var(--bst-edge)}'
    + 'b.bst-chg>i.bst-arw{display:inline-block;width:9px;height:9px;background:0 0/9px 9px no-repeat;image-rendering:pixelated}'
    + 'b.bst-chg.up>i.bst-arw{background-image:var(--bst-arrow-up)}b.bst-chg.dn>i.bst-arw{background-image:var(--bst-arrow-dn)}'
    + 'i.bst-mark{display:inline-flex;align-items:center;gap:1px;font-style:normal;white-space:nowrap;vertical-align:middle}i.bst-mark>i.bst-ic{display:inline-block;width:18px;height:18px;background:center/18px 18px no-repeat;image-rendering:pixelated}'
    + '.bst-sr{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap;font-style:normal}';
  function css() {
    if (document.getElementById('bst-css')) return;
    var s = document.createElement('style'); s.id = 'bst-css'; s.textContent = CSS; (document.head || document.documentElement).appendChild(s);
    var R = document.documentElement.style;
    R.setProperty('--bst-arrow-up', arrowURL(true, '#2e8b22')); R.setProperty('--bst-arrow-dn', arrowURL(false, '#b8261b'));
    var h = document.createElement('canvas'); h.width = h.height = 4; var hg = h.getContext('2d');   /* a 4 x 4 hatch, two pixels of each stripe */
    for (var y = 0; y < 4; y++) for (var x = 0; x < 4; x++) { hg.fillStyle = ((x + y) % 4) < 2 ? 'rgba(184,38,27,.75)' : 'rgba(184,38,27,.3)'; hg.fillRect(x, y, 1, 1); }
    R.setProperty('--bst-hatch-dn', 'url(' + h.toDataURL('image/png') + ')');
    try { if (root.BohemiaMaterials && root.BohemiaMaterials.stars) root.BohemiaMaterials.stars(0); } catch (e) {}   /* the kit's star marks are laid on the root */
  }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  /* his stars, one column wide whether he has none or three */
  function starsCol(n) {
    var w = el('i', 'bst-st stars'); w.dataset.stars = n | 0;
    for (var i = 0; i < (n | 0); i++) { var s = el('i', 'bmstar'); s.setAttribute('aria-hidden', 'true'); w.appendChild(s); }
    if (n) w.setAttribute('aria-label', n + (n === 1 ? ' star' : ' stars'));
    return w;
  }
  function pct(v) { return (Math.round(v * 100000) / 1000) + '%'; }
  /* the bar: o.n his number, o.ceil his ceiling (the tick), o.from the number before a change (the lit part between) */
  function bar(k, o) {
    var b = el('i', 'bst-bar'), n = +o.n || 0, f = fill(k, n), t = TINT[k] || '120,100,70';
    b.dataset.max = maxOf(k); b.dataset.fill = f.toFixed(5);
    var lo = o.from != null ? Math.min(+o.from, n) : n, fi = el('i', 'bst-fill');
    fi.style.width = pct(fill(k, lo)); fi.style.background = 'rgba(' + t + ',.55)'; fi.style.boxShadow = 'inset -1px 0 0 rgb(' + t + ')'; b.appendChild(fi);   /* the fill's end a crisp line of the stat's own colour */
    if (o.from != null && +o.from !== n) {
      var a = fill(k, +o.from), lit = el('i', 'bst-lit ' + (n > +o.from ? 'up' : 'dn'));
      lit.style.left = pct(Math.min(a, f)); lit.style.width = pct(Math.abs(f - a)); b.appendChild(lit);
      b.dataset.from = fill(k, +o.from).toFixed(5);
    }
    if (o.ceil != null) { var c = fill(k, o.ceil), tk = el('i', 'bst-tick'); tk.style.left = pct(c); b.dataset.ceil = c.toFixed(5); b.dataset.ceilN = Math.round(o.ceil); b.appendChild(tk); }
    if (o.number !== false) b.appendChild(el('i', 'bst-n', String(o.shownText != null ? o.shownText : n)));
    return b;
  }
  /* a change: the arrow and the amount, never 'X to Y' */
  function change(d, o) {
    o = o || {}; d = Math.round(+d || 0);
    var c = el('b', 'bst-chg ' + (d > 0 ? 'up' : d < 0 ? 'dn' : 'eq')); c.dataset.delta = d;
    if (d) { var a = el('i', 'bst-arw'); a.setAttribute('aria-hidden', 'true'); c.appendChild(a); }
    c.appendChild(document.createTextNode(d ? (d > 0 ? '+' : '') + d : (o.same || '='))); c.setAttribute('aria-label', d ? (d > 0 ? 'up ' : 'down ') + Math.abs(d) : 'the same');
    return c;
  }
  /* one stat's row. o: {n, stars, ceil, from (a change's before), delta, arrow (false: the lit part only, the amount said
     elsewhere), icon: 'span'|'i'|'none', into (an element to fill instead of a new one), tag, label (said, never shown), glass} */
  function row(k, o) {
    css(); o = o || {};
    var r = o.into || el(o.tag || 'div'); r.classList.add('bst-row'); if (o.glass) r.classList.add('bst-glass');
    r.dataset.stat = k; r.dataset.n = +o.n || 0; r.dataset.max = maxOf(k); r.dataset.fill = fill(k, o.n).toFixed(5); r.dataset.stars = (o.stars | 0);
    if (o.ceil != null) r.dataset.ceil = Math.round(o.ceil);
    if (o.icon !== 'none') {
      var ic = el(o.icon === 'span' ? 'span' : 'i', 'bst-ic'); ic.setAttribute('aria-label', o.label || NAME[k]);
      if (o.icon !== 'span') { ic.style.backgroundImage = 'url(' + iconURL(k) + ')'; ic.setAttribute('role', 'img'); }
      r.appendChild(ic);
    } else if (o.label !== false) r.appendChild(el('i', 'bst-sr', (o.label || NAME[k]) + ' '));
    r.appendChild(starsCol(o.stars | 0));
    r.appendChild(bar(k, { n: o.n, ceil: o.ceil, from: o.from }));
    if (o.arrow !== false && (o.delta != null || o.from != null)) { r.appendChild(el('i', 'bst-sr', ' ')); r.appendChild(change(o.delta != null ? o.delta : (+o.n - +o.from), o)); }
    else r.appendChild(el('i', 'bst-pad'));
    return r;
  }
  /* the whole man, his eight in his order: o.shown {k: number with what he wears}, o.from {k: before a change} */
  function block(man, o) {
    o = o || {}; var w = el(o.tag || 'div', o.cls || 'bst-block'), sh = o.shown || {};
    ORDER.forEach(function (k) {
      var n = sh[k] != null ? sh[k] : (man.stats || {})[k];
      w.appendChild(row(k, { n: n, stars: (man.stars || {})[k] | 0, ceil: o.ceiling === false ? null : ceilingOf(man, k, n), from: o.from && o.from[k] != null && o.from[k] !== n ? o.from[k] : null, glass: o.glass }));
    });
    return w;
  }
  /* a stat moved by an amount, inline in a line of words: the stat's icon, the arrow and the amount; o.say the stat's word for
     a screen reader (kept in the text, never shown) */
  function mark(k, d, o) {
    css(); o = o || {}; var w = el('i', 'bst-mark'); w.dataset.stat = k; w.dataset.delta = Math.round(+d || 0);
    var ic = el('i', 'bst-ic'); ic.style.backgroundImage = 'url(' + iconURL(k) + ')'; ic.setAttribute('aria-hidden', 'true'); w.appendChild(ic);
    w.appendChild(change(d)); if (o.say) w.appendChild(el('i', 'bst-sr', ' ' + o.say));
    return w;
  }
  API.mark = mark;
  API.css = css; API.row = row; API.bar = bar; API.change = change; API.block = block; API.starsCol = starsCol; API.TINT = TINT;
})(typeof window !== 'undefined' ? window : this);
