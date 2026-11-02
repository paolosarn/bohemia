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
   The pixels are hard, one pixel a pixel (the border law), the reds dried blood, never a cartoon (analog horror). Words draft:true.
   *** REDONE 11/3 (INJURY, VAMILY rules 304 and 301; Paolo 11/2: 'the UI for when a man goes down and he's gonna be healing, it's
   just so ugly', and the card voted NO: 'ugly, cluttered, try again'). ONE TIN PLATE, three lines, read top to bottom in one look:
     1 WHAT AND HOW LONG: the drop, the wound's name, the days left on the clock, and a row of clay beads, one a day, lit for the
       days still to go (data-when="now" holds the chips and the clock the gates read)
     2 WHAT IT COSTS HIM NOW: the stat icons with their red arrows, nothing else (with clinic: now | CLINIC > | after)
     3 WHAT IS HIS FOR GOOD: his scars by name (no penalty, rule 304(b)) and the knockdown tally: a bead a knockdown (red, each
       one cost him; bone only for a free one a modder's table allows), then the hitpoints gone for good and what the next one
       costs (the risk seen before it is taken, rule 303). tally(doc, inj) is the same beads for his portrait.
   Tin and clay (Crashbox, rule 301): a riveted plate lit from the top left, clay chips pressed into it, a faint scan over all. ***/
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
    /* the plate: tin lit from the top left, a dark one-pixel edge, four rivets, a faint scan (analog horror) */
    + '.injc{position:relative;margin:6px 0 5px;padding:7px 9px 7px;border:1px solid #0b0906;border-radius:3px;color:#e9dccb;font:700 10px/14px ui-monospace,monospace;'
    + 'background:radial-gradient(circle at 4px 4px,#8d7f70 0 1px,#2a211a 1.5px,transparent 2.5px),radial-gradient(circle at calc(100% - 4px) 4px,#8d7f70 0 1px,#2a211a 1.5px,transparent 2.5px),'
    + 'radial-gradient(circle at 4px calc(100% - 4px),#6d6054 0 1px,#2a211a 1.5px,transparent 2.5px),radial-gradient(circle at calc(100% - 4px) calc(100% - 4px),#6d6054 0 1px,#2a211a 1.5px,transparent 2.5px),'
    + 'repeating-linear-gradient(0deg,rgba(0,0,0,.10) 0 1px,transparent 1px 3px),linear-gradient(160deg,#4a3c31 0%,#30251d 45%,#1f1712 100%);'
    + 'box-shadow:inset 1px 1px 0 rgba(255,232,205,.20),inset -1px -1px 0 rgba(0,0,0,.65),0 2px 0 #0b0906}'
    + '.injc .injh{display:flex;align-items:center;gap:6px;letter-spacing:1px;color:#f0d9c4;text-shadow:0 1px 0 #0b0906}'
    + '.injc .injh .injname{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + '.injc canvas.injpx{width:18px;height:18px;image-rendering:pixelated;flex:0 0 auto}'
    /* the days as clay beads, one a day: lit dried blood for the days to go, sunk tin for the days done */
    + '.injc .injbeads{display:flex;gap:2px;margin:4px 0 0 24px}'
    + '.injc .injbeads b,.injtally b{display:block;width:9px;height:5px;border-radius:2px;background:#1a120d;box-shadow:inset 0 1px 1px rgba(0,0,0,.8)}'
    + '.injc .injbeads b.on{background:linear-gradient(#c23a2a,#7a170f);box-shadow:inset 0 1px 0 rgba(255,190,170,.45),0 1px 0 #0b0906}'
    + '.injc .injcol{display:flex;align-items:center;justify-content:space-between;gap:6px;min-width:0;margin-top:5px}'
    + '.injc .injrow{display:flex;flex-wrap:wrap;align-items:center;gap:4px}'
    + '.injc .injside{display:grid;grid-template-columns:1fr auto 1fr;gap:5px;align-items:center;margin-top:5px}'
    + '.injc .injside .injcol{flex-direction:column;align-items:flex-start;margin:0;padding:4px 5px;border-radius:3px;background:rgba(0,0,0,.28);box-shadow:inset 1px 1px 0 rgba(0,0,0,.5),inset -1px -1px 0 rgba(255,232,205,.08)}'
    + '.injc .injside [data-when=after]{background:rgba(60,90,50,.18)}'
    + '.injc .injto{color:#a8988a;font-size:9px}'
    /* a chip: a pressed clay lozenge, the icon and its arrow */
    + '.injc .injk{display:inline-flex;align-items:center;gap:1px;padding:1px 3px 1px 2px;border-radius:3px;background:linear-gradient(#3b2a20,#25190f);box-shadow:inset 1px 1px 0 rgba(255,220,190,.14),0 1px 0 #0b0906}'
    + '.injc .injk img{width:16px;height:16px;image-rendering:pixelated}'
    + '.injc .injk i{font-style:normal;color:#d8c4b0;font-size:9px;padding:0 1px}'
    + '.injc .injar{display:inline-block;width:3px;background:#a3241a;position:relative;margin:0 4px 5px 3px;vertical-align:middle}'
    + '.injc .injar::after{content:"";position:absolute;left:-3px;bottom:-5px;border-left:4.5px solid transparent;border-right:4.5px solid transparent;border-top:5px solid #a3241a}'
    + '.injc .injar.up{background:#5d8a44;margin:5px 4px 0 3px}.injc .injar.up::after{bottom:auto;top:-5px;border-top:0;border-bottom:5px solid #5d8a44}'
    + '.injc .injd{display:inline-flex;align-items:center;gap:3px;flex:0 0 auto;color:#f0d9c4;letter-spacing:1px}'
    + '.injc .injnone{color:#a8988a}'
    /* for good: a groove across the plate, then the scars and the tally */
    + '.injc .injlife{margin-top:6px;padding-top:5px;border-top:1px solid #0b0906;box-shadow:0 -1px 0 rgba(255,232,205,.08);color:#b9a693;display:flex;flex-wrap:wrap;align-items:center;gap:3px 8px}'
    + '.injc .injlife .injscar{color:#d8c4b0;letter-spacing:1px}'
    + '.injc .injlife .injcost{color:#e07a5f}.injc .injlife .injcost.free{color:#a8988a}'
    + '.injc .injnote{display:block;flex-basis:100%;color:#8f7d6c;font-weight:400}'
    + '.injc .injprice{margin-top:5px;color:#f1d38a;text-shadow:0 1px 0 #0b0906}'
    /* the tally: one bead a knockdown, bone while free, red once it cost a hitpoint; the same on his portrait */
    + '.injtally{display:inline-flex;gap:2px;align-items:center;vertical-align:middle}'
    + '.injtally b{width:5px;height:7px}.injtally b.free{background:linear-gradient(#d9ccb8,#8f826f);box-shadow:inset 0 1px 0 #fff3,0 1px 0 #0b0906}'
    + '.injtally b.cost{background:linear-gradient(#c23a2a,#7a170f);box-shadow:inset 0 1px 0 rgba(255,190,170,.45),0 1px 0 #0b0906}'
    + '.injtally em{font-style:normal;color:#e07a5f;font:700 9px/9px ui-monospace,monospace;margin-left:2px;text-shadow:0 1px 0 #0b0906}'
    + '.injtag{position:absolute;right:1px;bottom:1px;padding:1px 2px;border-radius:2px;background:rgba(11,9,6,.82);pointer-events:none;z-index:2}';
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
    var r = doc.createElement('div'); r.className = 'injrow'; list.forEach(function (p) { r.appendChild(chip(doc, p)); });
    if (!list.length) { var z = doc.createElement('span'); z.className = 'injnone'; z.textContent = 'NO PENALTY'; r.appendChild(z); }
    c.appendChild(r); c.appendChild(days(doc, n)); return c;
  }
  /* the wound's days as beads: of them in all, the days left lit */
  function beads(doc, left, of) {
    var b = doc.createElement('div'); b.className = 'injbeads'; b.dataset.left = left; b.dataset.of = of;
    for (var i = 0; i < Math.min(12, of); i++) { var e = doc.createElement('b'); if (i < left) e.className = 'on'; b.appendChild(e); }
    return b;
  }
  /* THE KNOCKDOWN TALLY (rule 304(c)): a bead a knockdown, the free ones bone, the ones that cost red, and the hitpoints gone */
  function tally(doc, inj, o) {
    doc = doc || root.document; style(doc);
    var t = doc.createElement('span'); t.className = 'injtally'; if (!inj || inj.main) return t;
    var n = inj.knocks | 0, cut = inj.hpCut | 0, free = Math.min(n, inj.free | 0); t.dataset.knocks = n; t.dataset.hpCut = cut;
    for (var i = 0; i < Math.min(n, 9); i++) { var e = doc.createElement('b'); e.className = i < free ? 'free' : 'cost'; t.appendChild(e); }
    if (cut > 0 && o && o.hp) { var m = doc.createElement('em'); m.textContent = '-' + cut + ' HP'; t.appendChild(m); }
    t.title = n + (n === 1 ? ' knockdown' : ' knockdowns') + (cut ? ', ' + cut + ' max HP gone for good' : ', nothing lost for good');
    t.setAttribute('aria-label', t.title);
    return t;
  }
  /* what the tally says beside it: what is gone, or what the next knockdown will cost (the risk seen first, rule 303) */
  function costWord(inj) {
    var cut = inj.hpCut | 0, cap = inj.hpCap | 0, fl = inj.freeLeft, lo = inj.rollMin | 0, hi = inj.rollMax | 0;
    var next = lo === hi ? '-' + lo : '-' + lo + ' OR -' + hi;
    if (cut >= cap && cap > 0) return { t: '-' + cut + ' MAX HP FOR GOOD. THE MOST IT TAKES.', free: false };
    if (fl > 0) return { t: (fl === 1 ? '1 MORE KNOCKDOWN' : fl + ' MORE KNOCKDOWNS') + ' COST NOTHING FOR GOOD.', free: true };
    if (cut > 0) return { t: '-' + cut + ' MAX HP FOR GOOD. NEXT ONE: ' + next + ' MORE.', free: false };
    return { t: 'NEXT KNOCKDOWN: ' + next + ' MAX HP FOR GOOD.', free: false };
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
    /* rule 304(b): the marks are scars and take nothing; only the fresh wound costs him anything now */
    var now = (inj.penalties || []).filter(function (p) { return p.from === 'fresh'; });
    if (inj.wound) {
      var n = Math.max(0, Math.ceil(inj.wound.left - 1e-9));
      var h = doc.createElement('div'); h.className = 'injh'; h.appendChild(pixel(doc, 'drop'));
      var nm = doc.createElement('span'); nm.className = 'injname'; nm.textContent = String(inj.fresh ? inj.fresh.name : markName(inj.wound.mark)).toUpperCase(); h.appendChild(nm);
      el.appendChild(h);
      el.appendChild(beads(doc, n, Math.max(n, inj.wound.of | 0)));
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
    var scars = inj.marks || [];
    if (scars.length || (inj.knocks | 0) > 0) {
      var lf = doc.createElement('div'); lf.className = 'injlife'; lf.dataset.life = scars.join(',');
      if (scars.length) { var t = doc.createElement('span'); t.className = 'injscar'; t.textContent = 'SCARS FOR LIFE: ' + scars.map(markName).join(', ').toUpperCase(); lf.appendChild(t); }
      if (!inj.main) { lf.appendChild(tally(doc, inj)); var cw = costWord(inj), cs = doc.createElement('span'); cs.className = 'injcost' + (cw.free ? ' free' : ''); cs.textContent = cw.t; lf.appendChild(cs); }
      if (o.clinic) { var nt = doc.createElement('span'); nt.className = 'injnote'; nt.textContent = 'Scars cost nothing in a fight. The clinic cannot touch them.'; lf.appendChild(nt); }
      el.appendChild(lf);
    }
    if (o.price != null) { var pr = doc.createElement('div'); pr.className = 'injprice'; pr.dataset.price = o.price; pr.textContent = o.priceWord || (o.price + ' batteries'); el.appendChild(pr); }
    return el;
  }
  root.BohemiaInjuryCard = { build: build, after: after, chip: chip, tally: tally, ICON: ICON, WORD: WORD };
})(typeof window !== 'undefined' ? window : this);
