/* BOHEMIA CONDITION -- THE COMPANY BETWEEN FIGHTS (CAMP, lane 24, [the heal button, damage that stays], rule 226, 10/26/26).
   PAOLO 10/26: 'in Battle Brothers you can't just do fights back to back to back for real and your people need to heal a little
   bit... it will combine the HP and armor stats of all your people into a single HP armor bar... once you see that you can be like
   oh fuck I need to heal... right now you can just do fights back to back to back and you always respawn... healing is important,
   the damage you sustained in battle'.
   MEASURED BEFORE A LINE WAS WRITTEN: the fight's one message home carried every man's XP, death, fall and injury and NOT ONE
   HITPOINT OR POINT OF ARMOUR; the fight rolled every man whole at the bell (crewUnit: hp = his roll, armour = the piece's full
   durability). So every fight was the first fight. And the dead came back (EYES 10/26, RUN's [eyes: the dead stand up]): an
   origin's men carry no names until the fight gives them one by their PLACE in the list, so a man dropped from the list moved
   every man behind him into the dead man's name and kit, and the shell's filter by name never matched a man with no name.
   THIS FILE IS THE ONE PLACE THAT KNOWS WHAT EACH MAN IS MISSING, by name, kept in localStorage bohemia.condition.v1 (NEW GAME
   forgets it): the hitpoints he lost, what his helmet and his body armour lost (each kept against the piece he wore, so a new
   piece comes whole), and the dead, for good. The rates are Battle Brothers' own from the wiki copy, in
   records/target/bb/condition.json (TUNING's table reads them there); the same numbers are the defaults below.
     BohemiaCondition.afterFight(rows, {day})  the fight's end rows (BOHEMIA_FIGHT_OVER crew: hp, hpMax, armH, armHMax, armB,
                                               armBMax, head, body): what each man is missing now; the dead go on the dead list
     BohemiaCondition.named(company)           an origin's nameless men named by their FIRST place (ours.json crew), the fight's
                                               own naming, so a name stays on its man when the men in front of him are gone
     BohemiaCondition.handOver(company)        the company for the fight: the dead left out, every man carrying .cond (what he is
                                               missing), which the fight's crewUnit takes off his whole numbers
     BohemiaCondition.elapse(hours, {camped})  time passes on the map: hitpoints come back (1 an hour, 2 camped, +1 the cook), each
                                               worn piece is mended 3 points an hour (x2 camped, x1.2 the blacksmith), one TAPE
                                               from the company's count (bohemia.supplies.v1) for every 15 points (x0.8 the
                                               blacksmith); no tape, no mending
     BohemiaCondition.company(origin)          the HEAL bar's numbers: the living company's hitpoints and armour, now and whole
     BohemiaCondition.drawBar(canvas, sum)     the one bar: red the blood, grey the armour, the dark part what is missing
     BohemiaCondition.laidUpDays(days)         an injury's days with the retinue's surgeon (one day fewer)
   Words are attempts, draft:true. */
(function (root) {
  'use strict';
  var KEY = 'bohemia.condition.v1', SUPPLIES = 'bohemia.supplies.v1', BASE = '../records/target/bb/';
  var DEF = { hp_per_hour_march: 1, hp_per_hour_camp: 2, cook_hp_per_hour: 1, armour_per_hour: 3, camp_repair_mult: 2, durability_per_tape: 15,
              blacksmith_repair_mult: 1.2, blacksmith_tape_mult: 0.8, surgeon_injury_days: 1, struck_down_hp_left: 1, unknown_hp_max: 55 };
  var RATE = {}; for (var dk in DEF) RATE[dk] = DEF[dk];
  /* the crew list's names and kit (ours.json, the fight's own list) and every armour piece's durability (armor.json) */
  var D = { crew: null, looks: null, armour: null, asked: {}, rates: false };
  /* a man the crew screen calls by a man's name (engine/bohemia_roster.js MEN_FOR, RUN TWO 10/26) is the same man: one key */
  var SAME = { TITO: 'TINA', MARCOS: 'MARISOL', LALO: 'LUPE', NENO: 'NENA' };
  var LAST = null;

  function json(k) { try { return JSON.parse(root.localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function fetchJSON(url, cb) { try { if (!root.fetch) return; root.fetch(url).then(function (r) { return r.json(); }).then(cb).catch(function () {}); } catch (e) {} }
  function load() {
    if (D.asked.rates) return; D.asked.rates = 1;
    var kept = json(KEY); if (kept && Array.isArray(kept.crewNames) && !D.crew) { D.crew = kept.crewNames; D.looks = kept.crewLooks || []; }
    fetchJSON(BASE + 'condition.json', function (j) { for (var k in DEF) if (j && j[k] && typeof j[k].value === 'number') RATE[k] = j[k].value; D.rates = true; });
    fetchJSON(BASE + 'ours.json', function (j) {
      var c = j && j.crew; c = c && (c.value || c); var pl = j && j.people_looks; pl = pl && (pl.value || pl);
      if (!Array.isArray(c)) return;
      D.crew = c.map(function (m) { return { name: m.name, main: !!m.main, body: m.body || null, head: m.head || null }; });
      D.looks = pl && Array.isArray(pl.crew) ? pl.crew.slice() : [];
      var s = get(); s.crewNames = D.crew; s.crewLooks = D.looks; put(s);   /* the next boot names the men before its files land */
    });
  }
  function loadArmour() {
    if (D.asked.armour) return; D.asked.armour = 1;
    fetchJSON(BASE + 'armor.json', function (j) { var o = {}; ['body', 'head'].forEach(function (p) { ((j && j[p]) || []).forEach(function (r) { if (r && r.id) o[p + ':' + r.id] = r.durability | 0; }); }); D.armour = o; notify(); });
  }
  function get() {
    var s = json(KEY);
    if (!s || typeof s !== 'object') s = {};
    if (!s.men || typeof s.men !== 'object') s.men = {};
    if (!Array.isArray(s.dead)) s.dead = [];
    ['debt', 'healed', 'mended', 'spent', 'hours', 'campHours'].forEach(function (k) { if (typeof s[k] !== 'number') s[k] = 0; });
    return s;
  }
  function put(s) { try { root.localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} return s; }
  /* one man, one key: his name in capitals, the crew screen's man's name read back to the list's, 'YOU' for the main character */
  function canon(name, main) {
    if (main) return 'YOU';
    var n = String(name == null ? '' : name).trim().toUpperCase(); if (!n) return '';
    var m = n.match(/^(.*?)( II)?$/), b = m[1];
    return (SAME[b] || b) + (m[2] || '');
  }
  function deadIn(s, k) { for (var i = 0; i < s.dead.length; i++) if (s.dead[i] && s.dead[i].name === k) return true; return false; }
  function isDead(name) { var k = canon(name); return !!k && k !== 'YOU' && deadIn(get(), k); }

  /* THE FIGHT'S END: what each man is missing now. A row with no hitpoints (an older fight) changes nothing; a man struck down and
     alive (or YOU, downed, never dead) wakes with one hitpoint */
  function afterFight(rows, ctx) {
    if (!Array.isArray(rows) || !rows.length) return null;
    var s = get(), day = (ctx && ctx.day) | 0, n = 0, left = RATE.struck_down_hp_left;
    rows.forEach(function (r) {
      if (!r || !r.name) return;
      var k = canon(r.name, r.main); if (!k) return;
      if (r.dead && !r.main) { if (!deadIn(s, k)) s.dead.push({ name: k, shown: String(r.name), look: r.look || null, day: day }); delete s.men[k]; n++; return; }
      if (!(+r.hpMax > 0)) return;
      var hp = Math.min(+r.hpMax, Math.max(left, Math.round(+r.hp || 0)));
      var m = s.men[k] || {};
      m.shown = String(r.name); if (r.look) m.look = r.look; m.main = !!r.main;
      m.hpMax = +r.hpMax; m.lostHp = Math.max(0, m.hpMax - hp);
      m.armHMax = Math.max(0, +r.armHMax || 0); m.lostH = Math.max(0, m.armHMax - Math.max(0, +r.armH || 0)); m.head = r.head || null;
      m.armBMax = Math.max(0, +r.armBMax || 0); m.lostB = Math.max(0, m.armBMax - Math.max(0, +r.armB || 0)); m.body = r.body || null;
      m.fights = (m.fights | 0) + 1; m.day = day;
      s.men[k] = m; n++;
    });
    s.lastFight = { day: day, men: n, at: Date.now() };
    put(s); notify(); return s;
  }
  /* an origin's nameless men, named by their first place: the fight's own rule (ours.crew in order, ' II' past its end, the look of
     the place), so the name is his and stays his */
  function named(company) {
    if (!Array.isArray(company)) return company;
    var C = D.crew || [], L = D.looks || [];
    if (!C.length) return company;
    return company.map(function (m, i) {
      if (!m || i === 0 || m.name) return m;
      var c = {}, d = C[i % C.length] || {}; for (var k in m) c[k] = m[k];
      c.name = (d.name || 'MAN') + (i >= C.length ? ' II' : '');
      if (!c.look && L.length) c.look = L[i % L.length];
      return c;
    });
  }
  /* the company for the fight: the dead never again; every man with what he is missing */
  function condOf(r) { return r ? { lostHp: Math.round(r.lostHp || 0), lostH: Math.round(r.lostH || 0), head: r.head || null, lostB: Math.round(r.lostB || 0), body: r.body || null } : null; }
  function handOver(company, formation) {
    if (!Array.isArray(company)) return { company: company, formation: formation || null, left: [] };
    var s = get(), out = [], at = {}, left = [];
    company.forEach(function (m, i) {
      if (!m) { at[i] = out.length; out.push(m); return; }
      var k = canon(m.name, i === 0);
      if (i > 0 && k && deadIn(s, k)) { left.push(m.name); return; }
      var c = {}; for (var f in m) c[f] = m[f];
      var r = k ? s.men[k] : null; if (r) c.cond = condOf(r); else delete c.cond;
      at[i] = out.length; out.push(c);
    });
    /* the line the crew screen set points at places in the list: a dead man's place is empty now, everyone else keeps his */
    var line = null;
    if (formation && Array.isArray(formation.front) && Array.isArray(formation.back)) {
      var re = function (row) { return row.map(function (x) { return x != null && at[x] != null ? at[x] : null; }); };
      line = { front: re(formation.front), back: re(formation.back) };
    }
    return { company: out, formation: line, left: left };
  }
  function condFor(name, main) { var r = get().men[canon(name, main)]; return condOf(r); }

  /* THE RETINUE'S HELP (engine/bohemia_camp.js): the cook's hitpoints, the blacksmith's mending, the surgeon's day */
  function hiredMap(ctx) { if (ctx && ctx.hired) return ctx.hired; try { return root.BohemiaCamp ? root.BohemiaCamp.hired() : {}; } catch (e) { return {}; } }
  function rates(ctx) {
    ctx = ctx || {}; var h = hiredMap(ctx), camped = !!ctx.camped;
    return { camped: camped, cook: !!h.cook, blacksmith: !!h.blacksmith, surgeon: !!h.surgeon,
      hp: (camped ? RATE.hp_per_hour_camp : RATE.hp_per_hour_march) + (h.cook ? RATE.cook_hp_per_hour : 0),
      armour: RATE.armour_per_hour * (camped ? RATE.camp_repair_mult : 1) * (h.blacksmith ? RATE.blacksmith_repair_mult : 1),
      tapePerPoint: (1 / RATE.durability_per_tape) * (h.blacksmith ? RATE.blacksmith_tape_mult : 1) };
  }
  function laidUpDays(days, ctx) { days = days | 0; return rates(ctx).surgeon ? Math.max(0, days - RATE.surgeon_injury_days) : days; }

  /* TIME PASSES: the map's clock hands every minute it spends (its advance(), the one place the valley's time moves) */
  function elapse(hours, ctx) {
    hours = +hours || 0; if (!(hours > 0)) return null; if (hours > 24 * 90) hours = 24 * 90;
    var s = get(), R = rates(ctx), healed = 0, want = 0, items = [];
    for (var k in s.men) {
      var m = s.men[k];
      if (m.lostHp > 0) { var g = Math.min(m.lostHp, R.hp * hours); m.lostHp -= g; healed += g; if (m.lostHp < 1e-6) m.lostHp = 0; }
      ['lostH', 'lostB'].forEach(function (p) { if (m[p] > 0) { var a = Math.min(m[p], R.armour * hours); items.push([m, p, a]); want += a; } });
    }
    var mended = 0, spent = 0, W = null;
    if (want > 0) {
      W = json(SUPPLIES); var tape = W ? Math.max(0, W.tape | 0) : 0;
      var can = Math.max(0, (tape - s.debt) / R.tapePerPoint), f = want <= can ? 1 : (want > 0 ? can / want : 0);
      items.forEach(function (it) { var d = it[2] * f; it[0][it[1]] = Math.max(0, it[0][it[1]] - d); if (it[0][it[1]] < 1e-6) it[0][it[1]] = 0; mended += d; });
      s.debt += mended * R.tapePerPoint;
      spent = Math.min(tape, Math.floor(s.debt + 1e-9));
      if (spent > 0 && W) { W.tape = Math.max(0, (W.tape | 0) - spent); try { root.localStorage.setItem(SUPPLIES, JSON.stringify(W)); } catch (e) {} s.debt -= spent; }
      if (s.debt < 0) s.debt = 0;
    }
    s.healed += healed; s.mended += mended; s.spent += spent; s.hours += hours; if (R.camped) s.campHours += hours;
    put(s);
    LAST = { hours: hours, healed: healed, mended: mended, spent: spent, short: want - mended, camped: R.camped, rates: R, tape: W ? W.tape | 0 : null };
    notify(); return LAST;
  }

  /* WHO IS WITH HIM NOW: the crew screen's company and its bench, the origin's men, the men hired at the posts, every man a fight
     has seen; never the dead, never a man who walked, never a man the crew that beat him still holds */
  function goneKeys() {
    var g = {};
    (json('bohemia.walked.v1') || []).forEach(function (x) { if (x && x.name) g[canon(x.name)] = 1; });
    (json('bohemia.taken.v1') || []).forEach(function (t) { ((t && t.names) || []).forEach(function (n) { g[canon(n)] = 1; }); });
    (json('bohemia.fight.after.v1') || []).forEach(function (f) { ((f && f.rows) || []).forEach(function (r) { if (r && r.dead && !r.main) g[canon(r.name)] = 1; }); });
    (json('bohemia.company.v1') || []).forEach(function (m) { if (m && m.dead) g[canon(m.name)] = 1; });
    delete g.YOU; return g;
  }
  function members(origin) {
    var s = get(), out = [], seen = {}, gone = goneKeys();
    var add = function (m, main) { if (!m) return; var k = canon(m.name, main); if (!k || seen[k] || (!main && (gone[k] || deadIn(s, k)))) return; seen[k] = 1; out.push({ key: k, man: m, main: !!main }); };
    var hk = json('bohemia.company.v1'), hl = json('bohemia.company.line.v1');
    if (Array.isArray(hk) && hk.length) { hk.forEach(function (m, i) { add(m, i === 0); }); if (hl && Array.isArray(hl.bench)) hl.bench.forEach(function (b) { if (b && b.man) add(b.man, false); }); }
    var o = named(Array.isArray(origin) ? origin : []); o.forEach(function (m, i) { add(m, i === 0); });
    if (!o.length) add({ name: 'YOU' }, true);
    (json('bohemia.hired.v1') || []).forEach(function (h) { if (h && !h.dead) add(h, false); });
    for (var k in s.men) if (!seen[k] && !gone[k] && !deadIn(s, k)) { seen[k] = 1; out.push({ key: k, man: { name: s.men[k].shown || k, look: s.men[k].look }, main: k === 'YOU' }); }
    return out;
  }
  /* a man no fight has seen yet is whole: the bar only needs his weight (his card's hitpoints, his pieces' durability) */
  function wholeOf(e) {
    var m = e.man || {}, g = m.gear || {}, kit = null;
    if (!g.body && !g.head && D.crew) for (var i = 0; i < D.crew.length; i++) if (canon(D.crew[i].name, D.crew[i].main) === e.key || (e.main && D.crew[i].main)) { kit = D.crew[i]; break; }
    var body = g.body || (kit && kit.body) || null, head = g.head || (kit && kit.head) || null;
    if ((body || head) && !D.armour) loadArmour();
    var A = D.armour || {};
    return { hpMax: (m.stats && +m.stats.hp > 0) ? +m.stats.hp : RATE.unknown_hp_max, armMax: (body ? A['body:' + body] | 0 : 0) + (head ? A['head:' + head] | 0 : 0) };
  }
  function company(origin) {
    var s = get(), L = members(origin), sum = { men: L.length, hp: 0, hpMax: 0, arm: 0, armMax: 0, hurt: 0, broken: 0, names: [] };
    L.forEach(function (e) {
      var r = s.men[e.key], hpMax, armMax, lostHp = 0, lostArm = 0;
      if (r) { hpMax = r.hpMax; armMax = (r.armHMax || 0) + (r.armBMax || 0); lostHp = r.lostHp || 0; lostArm = (r.lostH || 0) + (r.lostB || 0); }
      else { var w = wholeOf(e); hpMax = w.hpMax; armMax = w.armMax; }
      sum.hpMax += hpMax; sum.hp += hpMax - lostHp; sum.armMax += armMax; sum.arm += armMax - lostArm;
      if (lostHp >= 0.5) sum.hurt++; if (lostArm >= 0.5) sum.broken++; sum.names.push(e.key);
    });
    sum.blood = sum.hpMax > 0 ? sum.hp / sum.hpMax : 1; sum.armour = sum.armMax > 0 ? sum.arm / sum.armMax : 1;
    sum.whole = (sum.hpMax + sum.armMax) > 0 ? (sum.hp + sum.arm) / (sum.hpMax + sum.armMax) : 1;
    var W = json(SUPPLIES); sum.tape = W ? W.tape | 0 : null;
    sum.dead = s.dead.length;
    return sum;
  }
  /* what the long press says (rule 224(b): the exact figure a hold or a hover away; draft:true) */
  function says(sum) {
    sum = sum || company();
    var r = function (n) { return Math.round(n); };
    return 'BLOOD ' + r(sum.hp) + ' / ' + r(sum.hpMax) + '   ARMOUR ' + r(sum.arm) + ' / ' + r(sum.armMax) + (sum.tape != null ? '   TAPE ' + sum.tape : '');
  }
  /* THE ONE BAR (rule 226(c), rule 224: a bar, never a number): the company's blood in red and its armour in grey, each over its
     share of the bar's length (its whole over the whole of both), the dark part of each what is missing. Drawn at the canvas's own
     pixels, a hard one-pixel edge, nothing soft (the border law) */
  function drawBar(cv, sum, o) {
    if (!cv || !cv.getContext) return null; sum = sum || company(); o = o || {};
    var W = cv.width, H = cv.height, g = cv.getContext('2d'), tot = sum.hpMax + sum.armMax;
    var split = tot > 0 ? Math.round((W - 3) * sum.hpMax / tot) : W - 2;
    g.clearRect(0, 0, W, H);
    g.fillStyle = o.edge || '#0b0906'; g.fillRect(0, 0, W, H);
    var seg = function (x0, w, frac, lit, dim, top) {
      if (w <= 0) return; var f = Math.max(0, Math.min(w, Math.round(w * frac)));
      g.fillStyle = o.empty || '#24190f'; g.fillRect(x0, 1, w, H - 2);
      g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x0, 1, w, 1);
      if (f > 0) { g.fillStyle = lit; g.fillRect(x0, 1, f, H - 2); g.fillStyle = top; g.fillRect(x0, 1, f, 1); g.fillStyle = dim; g.fillRect(x0, H - 2, f, 1); }
    };
    seg(1, split, sum.blood, o.blood || '#b8281c', '#6e130d', '#e0574a');
    if (sum.armMax > 0) seg(split + 2, W - split - 3, sum.armour, o.armour || '#a3a7aa', '#5f6366', '#d4d7d9');
    return { split: split, blood: sum.blood, armour: sum.armour };
  }
  function notify() { try { if (root.dispatchEvent && root.CustomEvent) root.dispatchEvent(new root.CustomEvent('bohemia:condition', { detail: LAST })); } catch (e) {} }
  function forget() { try { root.localStorage.removeItem(KEY); } catch (e) {} LAST = null; }
  function dead() { return get().dead.slice(); }
  function last() { return LAST; }

  root.BohemiaCondition = { KEY: KEY, RATE: RATE, DEF: DEF, D: D, load: load, get: get, canon: canon, afterFight: afterFight, named: named, handOver: handOver,
    condFor: condFor, isDead: isDead, dead: dead, rates: rates, laidUpDays: laidUpDays, elapse: elapse, members: members, company: company,
    says: says, drawBar: drawBar, forget: forget, last: last };
  try { if (root.document) setTimeout(load, 0); } catch (e) {}
})(typeof window !== 'undefined' ? window : this);
