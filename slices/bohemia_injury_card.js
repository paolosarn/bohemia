/* THE INJURY CARD (CAMP [struck down, he still fights] and [the clinic halves the days and the debuff], rules 234(d) and 241,
   10/26/26). PAOLO 10/26: 'the clinic has it for 89 batteries, I see how much it's gonna cost... I just want you to make it clear
   that it has the debuff and the time as well... if I did take it to a clinic, I want it to be clear that it would half the days
   and half the debuff'; and rule 224: icons, not numbers, everywhere.
   ONE DRAWING, TWO PLACES: the town's clinic and the crew card both build it from the same call, so the crew card matches the
   clinic (241(c)). It reads a man's injury as engine/bohemia_condition.js injuryOf(name) gives it (his marks for life, his fresh
   wound today, the penalties: engine/bohemia_long_injury.js), never a number of its own.
     BohemiaInjuryCard.build(doc, inj, {clinic, price, after})   the card: the wound's mark and word; THE WOUND's penalties as stat
                                                                icons with a red down arrow as long as the cut (the exact figure a
                                                                hover or a hold away, rule 224(b)); its days on a clock; with
                                                                clinic, the clinic's after beside the now (the days cut in two,
                                                                every arrow halved), then the price; FOR LIFE, the mark's own
                                                                penalties, which the clinic never touches, and the card says so
     BohemiaInjuryCard.after(inj, medic)                        what the clinic leaves: the days left halved (rounded up, a medic's
                                                                day fewer), the fresh wound's penalty halved with them
   The pixels are hard, one pixel a pixel (the border law), the reds dried blood, never a cartoon (analog horror). Words draft:true. */
(function (root) {
  'use strict';
  var ICON = { melee_skill: 'melee_skill', ranged_skill: 'ranged_skill', melee_defense: 'melee_defense', ranged_defense: 'ranged_defense',
    initiative: 'initiative', resolve: 'resolve', max_fatigue: 'fatigue', fatigue_recovery_per_turn: 'fatigue', hitpoints: 'hp' };
  /* the stats the kit has no icon for yet (UI's [the stat icons]): a short word in the icon's place */
  var WORD = { vision: 'SIGHT', extra_ap_per_tile_moved: 'STEP', action_points: 'AP', experience_gain: 'XP', damage_inflicted: 'DMG',
    all_levelable_attributes: 'ALL', hitpoints_lost_per_turn_in_combat: 'BLEED' };
  var SAY = { melee_skill: 'melee skill', ranged_skill: 'ranged skill', melee_defense: 'melee defence', ranged_defense: 'ranged defence',
    initiative: 'initiative', resolve: 'resolve', max_fatigue: 'wind', fatigue_recovery_per_turn: 'wind back a turn', hitpoints: 'hitpoints',
    vision: 'sight', extra_ap_per_tile_moved: 'action points a step', action_points: 'action points', experience_gain: 'experience',
    damage_inflicted: 'damage', all_levelable_attributes: 'every stat', hitpoints_lost_per_turn_in_combat: 'blood a turn' };
  /* a higher number is worse for these two (a step costs more, he bleeds more) */
  var WORSE_UP = { extra_ap_per_tile_moved: 1, hitpoints_lost_per_turn_in_combat: 1 };
  function statIcon(k) { return root.BohemiaMaterials && root.BohemiaMaterials.statIcon ? root.BohemiaMaterials.statIcon(k) : 'stat_icons/' + k + '.png'; }
  var CSS = ''
    + '.injc{margin-top:6px;padding:5px 6px;border:1px solid #5a1c12;background:#1a0f0b;color:#e9dccb;font:700 10px/14px ui-monospace,monospace}'
    + '.injc .injh{display:flex;align-items:center;gap:5px;letter-spacing:1px;color:#e0b9a6}'
    + '.injc canvas.injpx{width:24px;height:24px;image-rendering:pixelated;flex:0 0 auto}'
    + '.injc .injrow{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin-top:4px}'
    + '.injc .injcol{display:flex;flex-direction:column;gap:3px;min-width:0}'
    + '.injc .injside{display:grid;grid-template-columns:1fr auto 1fr;gap:6px;align-items:start;margin-top:4px}'
    + '.injc .injto{align-self:center;color:#8f7d6c}'
    + '.injc .injk{display:inline-flex;align-items:center;gap:2px}'
    + '.injc .injk img{width:16px;height:16px;image-rendering:pixelated}'
    + '.injc .injk i{font-style:normal;color:#b9a693;font-size:9px}'
    + '.injc .injar{display:inline-block;width:4px;background:#8c1d12;position:relative;margin:0 4px 5px 3px;vertical-align:middle}'
    + '.injc .injar::after{content:"";position:absolute;left:-3px;bottom:-5px;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #8c1d12}'
    + '.injc .injar.up{background:#4f7a3a;margin:5px 4px 0 3px}.injc .injar.up::after{bottom:auto;top:-5px;border-top:0;border-bottom:5px solid #4f7a3a}'
    + '.injc .injd{display:inline-flex;align-items:center;gap:3px}'
    + '.injc .injlife{margin-top:5px;color:#a8988a}'
    + '.injc .injlife b{color:#cdb8a6}'
    + '.injc .injnote{display:block;color:#8f7d6c;font-weight:400}'
    + '.injc .injprice{margin-top:4px;color:#f1d38a}';
  function style(doc) { if (doc.getElementById('injc-css')) return; var s = doc.createElement('style'); s.id = 'injc-css'; s.textContent = CSS; (doc.head || doc.documentElement).appendChild(s); }
  /* the two marks, drawn a pixel at a time on a 12 by 12 grid: a drop of dried blood, a clock with no glass */
  var PX = {
    drop: ['.....##.....', '.....##.....', '....####....', '....####....', '...######...', '...##o###...', '..###o####..', '..########..', '..########..', '...######...', '....####....', '............'],
    clock: ['....####....', '..##....##..', '.#...o....#.', '.#...o....#.', '#....o.....#', '#....oooo..#', '#..........#', '#..........#', '.#........#.', '.#........#.', '..##....##..', '....####....']
  };
  var INK = { drop: { '#': '#6e130d', 'o': '#b8281c' }, clock: { '#': '#a3a7aa', 'o': '#e9dccb' } };
  function pixel(doc, kind) {
    var c = doc.createElement('canvas'); c.width = 12; c.height = 12; c.className = 'injpx'; c.dataset.px = kind;
    var g = c.getContext && c.getContext('2d'); if (!g) return c;
    PX[kind].forEach(function (row, y) { for (var x = 0; x < row.length; x++) { var ink = INK[kind][row[x]]; if (ink) { g.fillStyle = ink; g.fillRect(x, y, 1, 1); } } });
    return c;
  }
  /* one penalty: the stat's icon (or its word), then an arrow as long as the cut; the figure a hover away */
  function chip(doc, p) {
    var k = doc.createElement('span'); k.className = 'injk'; k.dataset.stat = p.stat; k.dataset.value = p.value;
    if (ICON[p.stat]) { var im = doc.createElement('img'); im.alt = ''; im.src = statIcon(ICON[p.stat]); k.appendChild(im); }
    else { var w = doc.createElement('i'); w.textContent = WORD[p.stat] || p.stat.toUpperCase(); k.appendChild(w); }
    var bad = WORSE_UP[p.stat] ? p.value > 0 : p.value < 0, mag = Math.abs(p.value) * (p.unit === '%' ? 1 : 10);
    var a = doc.createElement('span'); a.className = 'injar ' + (bad ? 'dn' : 'up'); a.style.height = Math.min(20, Math.max(2, Math.round(2 + mag / 3))) + 'px'; a.dataset.len = a.style.height; k.appendChild(a);
    var said = (p.value > 0 ? '+' : '') + p.value + (p.unit === '%' ? '% ' : ' ') + (SAY[p.stat] || p.stat.replace(/_/g, ' '));
    k.title = said; k.setAttribute('aria-label', said);
    return k;
  }
  function days(doc, n) { var d = doc.createElement('span'); d.className = 'injd'; d.dataset.days = n; d.appendChild(pixel(doc, 'clock')); d.appendChild(doc.createTextNode(n + (n === 1 ? ' DAY' : ' DAYS'))); return d; }
  function col(doc, list, n) {
    var c = doc.createElement('div'); c.className = 'injcol';
    var r = doc.createElement('div'); r.className = 'injrow'; list.forEach(function (p) { r.appendChild(chip(doc, p)); }); if (!list.length) r.appendChild(doc.createTextNode('NOTHING'));
    c.appendChild(r); c.appendChild(days(doc, n)); return c;
  }
  /* WHAT THE CLINIC LEAVES (rule 241(b)): the days left halved, rounded up (a medic one fewer, never under one), and with them the
     fresh wound's share of its penalty (the share is the days left over its days, engine/bohemia_long_injury.js freshShare) */
  function after(inj, medic) {
    if (!inj || !inj.wound) return null;
    /* the clinic's own half (BohemiaCondition.halve: exact, rule 264(h)); the days on its clock rounded up like every count of days */
    var h = inj.wound.left / 2, left = root.BohemiaCondition && root.BohemiaCondition.halve ? root.BohemiaCondition.halve(inj.wound.left, medic) : (medic ? Math.max(Math.min(1, h), h - 1) : h);
    var L = root.BohemiaLongInjury, fresh = L ? L.freshNow(inj.wound.mark, left, inj.wound.of) : null;
    return { left: left, of: inj.wound.of, days: Math.max(0, Math.ceil(left - 1e-9)), fresh: fresh, penalties: fresh ? Object.keys(fresh.effects).map(function (k) { var pct = /_pct$/.test(k);
      return { stat: pct ? k.replace(/_pct$/, '') : k, value: fresh.effects[k], unit: pct ? '%' : '', from: 'fresh' }; }) : [] };
  }
  function markName(id) { var L = root.BohemiaLongInjury, m = L && L.byId(id); return m ? m.name : id; }
  function build(doc, inj, o) {
    doc = doc || root.document; o = o || {}; style(doc);
    var el = doc.createElement('div'); el.className = 'injc'; if (!inj) return el;
    var now = (inj.penalties || []).filter(function (p) { return p.from === 'fresh'; }), life = (inj.penalties || []).filter(function (p) { return p.from === 'mark'; });
    if (inj.wound) {
      var h = doc.createElement('div'); h.className = 'injh'; h.appendChild(pixel(doc, 'drop'));
      h.appendChild(doc.createTextNode('THE WOUND: ' + String(inj.fresh ? inj.fresh.name : markName(inj.wound.mark)).toUpperCase()));
      el.appendChild(h);
      var n = Math.max(0, Math.ceil(inj.wound.left - 1e-9));
      if (o.clinic) {
        var af = o.after || after(inj, o.medic);
        var sd = doc.createElement('div'); sd.className = 'injside'; sd.dataset.side = 'now-after';
        var a = col(doc, now, n); a.dataset.when = 'now'; sd.appendChild(a);
        var to = doc.createElement('span'); to.className = 'injto'; to.textContent = 'CLINIC >'; sd.appendChild(to);
        var b = col(doc, af ? af.penalties : [], af ? af.days : n); b.dataset.when = 'after'; sd.appendChild(b);
        el.appendChild(sd);
      } else {
        var c1 = col(doc, now, n); c1.dataset.when = 'now'; el.appendChild(c1);
      }
    }
    if (inj.marks && inj.marks.length) {
      var lf = doc.createElement('div'); lf.className = 'injlife'; lf.dataset.life = inj.marks.join(',');
      var t = doc.createElement('b'); t.textContent = 'FOR LIFE: ' + inj.marks.map(markName).join(', ').toUpperCase(); lf.appendChild(t);
      var r = doc.createElement('div'); r.className = 'injrow'; life.forEach(function (p) { r.appendChild(chip(doc, p)); }); lf.appendChild(r);
      if (o.clinic) { var nt = doc.createElement('span'); nt.className = 'injnote'; nt.textContent = 'The clinic cannot touch this. It is his for life.'; lf.appendChild(nt); }
      el.appendChild(lf);
    }
    if (o.price != null) { var pr = doc.createElement('div'); pr.className = 'injprice'; pr.dataset.price = o.price; pr.textContent = o.priceWord || (o.price + ' batteries'); el.appendChild(pr); }
    return el;
  }
  root.BohemiaInjuryCard = { build: build, after: after, chip: chip, ICON: ICON, WORD: WORD };
})(typeof window !== 'undefined' ? window : this);
