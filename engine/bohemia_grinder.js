/* ==========================================================================
   THE GRINDER AT HIS PLACE (HOME BASE 3, 11/22/26; VAMILY rule 469, rules 456, 460, 455, 466(c))

   PAOLO 11/17 (rule 456): 'if I personally was a father, I'm not gonna let a body rot'; a grinder he can own; the dead of a fight
   are what it eats. PAOLO 11/21 (rule 469), answering 456(c): 'C' (his own crew grinds the human dead at his place too, and he can
   sell it) and 'Ppl dont eat the brain tho'.

   THE WHOLE THING, AS HE PLAYS IT: one grinder at his place (one of his own buildings, beside the forge); the dead of a fight he wins
   come home with his company; at the grinder one tap, GRIND, and the sausage is in his stores (the top bar's FOOD, what the night
   eats first); any town's stall buys it as food. Nothing else is on the screen and nothing is explained (rule 466(c)'s lesson).

   WHAT RUNS UNDER IT, REALISM FIRST (every number records/target/bb/home_base.json grinder, with its source):
   - THE CARRY: a body is carried home on a two-man litter, so a company carries half a body a man; more dead than that are left.
   - THE HEAT: the dead keep about a day on the road; what is not at the grinder in a day has turned and is thrown out, quietly.
   - THE HEAD COMES OFF FIRST: the head and the brain go in the drum, never the grinder; everybody knows (his words).
   - THE SHAKES (kuru, rule 388): the prion sits in the brain and the spinal cord; muscle carries little to none. So the cost is rare
     and has a cause: a BAD CUT (the spine split, the cord in the batch) now and then, or a can bought at a stall from somebody who
     does not care. A man who eats from a bad batch may carry it, and it shows years later (kuru's 4.5 to 50 years, mean about 12),
     so in this game it shows in a later act: the family meets what the father ground. Clean meat from his own grinder is safe.
   - SELLING IT: legal nowhere and done everywhere. A town buys it as food and does not ask. If a town finds out it was people, his
     name there drops by the Battle Brothers ladder's 'minor offensive action'; a hungry town never asks (the famine record). A town
     he sold a bad batch to finds out when its own people start shaking, years on, and that is worse.

   PURE: no window, no DOM, no storage. The map (slices/BOHEMIA_CITY_WORLD.html __THE_GRINDER__) hands it what it measured; the town
   screen (slices/BOHEMIA_SETTLEMENT_SCREEN.html __THE_GRINDER__) shows the one button. Gate: gates/home_base_gate.js (the G legs).
   ========================================================================== */
(function (root) {
  'use strict';
  var D = null;
  function setData(d) { D = d && d.grinder ? d.grinder : (d || null); return !!D; }
  function data() { return D; }
  function V(k, dflt) { var o = D && D[k]; if (o && typeof o === 'object' && 'value' in o) o = o.value; return o == null ? dflt : o; }

  function make() { return { v: 1, pile: [], stores: { sausage: 0, man: 0, bad: 0, seen: null }, marks: [], sold: [], batches: 0, found: [], shown: {} }; }
  function load(o) {
    var s = o && o.v === 1 ? o : make();
    if (!Array.isArray(s.pile)) s.pile = []; if (!s.stores) s.stores = { sausage: 0, man: 0, bad: 0, seen: null };
    if (!Array.isArray(s.marks)) s.marks = []; if (!Array.isArray(s.sold)) s.sold = []; if (!Array.isArray(s.found)) s.found = []; if (!s.shown) s.shown = {};
    return s;
  }

  /* ---------- THE DEAD COME HOME ----------
     what the company carries: half a body a man (a litter takes two), in kilos; a body whole or not at all, a kill's meat by the kilo */
  function carryKg(crew) { return Math.max(0, Math.floor((crew | 0) * V('carry_a_man', 0.5) * V('body_kg', 62))); }
  function fresh(st, min) {
    var keep = V('keep_h', 24) * 60, n0 = st.pile.length;
    st.pile = st.pile.filter(function (p) { return (min - (p.min | 0)) < keep; });
    return n0 - st.pile.length;   /* how many turned on the road: thrown out, said nowhere */
  }
  function carried(st) { var kg = 0; st.pile.forEach(function (p) { kg += +p.kg || 0; }); return kg; }
  /* o: { humans: bodies of people, beastKg: a kill's meat in kilos (already meat), crew, min, day, act, from } */
  function bring(st, o) {
    o = o || {}; fresh(st, o.min | 0);
    var room = carryKg(o.crew) - carried(st), bk = V('body_kg', 62), took = 0, left = 0, meat = 0;
    for (var i = 0; i < (o.humans | 0); i++) { if (room >= bk) { st.pile.push({ kind: 'man', kg: bk, min: o.min | 0, day: o.day | 0, act: o.act | 0 || 1, from: o.from || null }); room -= bk; took++; } else left++; }
    var bkg = Math.max(0, Math.min(room, Math.round(+o.beastKg || 0)));
    if (bkg > 0) { st.pile.push({ kind: 'beast', kg: bkg, min: o.min | 0, day: o.day | 0, act: o.act | 0 || 1, from: o.from || null }); meat = bkg; }
    return { took: took, left: left, beastKg: meat, room: Math.max(0, room - bkg) };
  }
  /* what the pile would make now: the dead still good, in bodies and kilos, and the food it grinds into */
  function pileNow(st, min, kgNight) {
    fresh(st, min | 0);
    var men = 0, kg = 0, mk = 0;
    st.pile.forEach(function (p) { if (p.kind === 'man') { men++; mk += p.kg * V('meat_share', 0.36); } else kg += p.kg; });
    var sk = (mk + kg) * V('cure_keep', 0.8), night = kgNight > 0 ? kgNight : V('kg_a_night', 0.5);
    return { dead: men, beastKg: Math.round(kg), food: Math.floor(sk / night), manFood: Math.floor(mk * V('cure_keep', 0.8) / night) };
  }

  /* ---------- THE STORES: how much of the company's food is his sausage, how much of it was people, how much a bad batch ----------
     the food is one count (rule 209) and everything eats it; the sausage in it goes down in proportion as the count goes down */
  function reconcile(st, food) {
    var S = st.stores, f = Math.max(0, +food || 0);
    if (S.seen == null) { S.seen = f; return S; }
    if (f < S.seen && S.seen > 0) { var k = f / S.seen; S.sausage *= k; S.man *= k; S.bad *= k; }
    S.sausage = Math.min(S.sausage, f); S.man = Math.min(S.man, S.sausage); S.bad = Math.min(S.bad, S.sausage);
    S.seen = f; return S;
  }
  /* ONE TAP: the good dead go in, the head first out; the batch takes a bad cut now and then (only a batch with people in it) */
  function grind(st, o) {
    o = o || {}; var rand = o.rand || Math.random, food0 = Math.max(0, +o.food || 0);
    var P = pileNow(st, o.min | 0, o.kgNight);
    if (!st.pile.length || P.food <= 0) return { ok: false, why: 'NOBODY' };
    reconcile(st, food0);
    var bad = P.dead > 0 && rand() * 100 < V('bad_cut_pct', 3);
    var S = st.stores; S.sausage += P.food; S.man += P.manFood; if (bad) S.bad += P.food; S.seen = food0 + P.food;
    st.pile = []; st.batches++;
    return { ok: true, food: P.food, dead: P.dead, beastKg: P.beastKg, man: P.manFood, bad: bad, batch: st.batches };
  }

  /* ---------- A TOWN BUYS IT ----------
     o: { units sold, food before the sale, place, hungry (the town's stall is short of food), day, act, rand } */
  function share(n, part, whole, rand) { if (!(whole > 0) || !(part > 0)) return 0; var e = n * Math.min(1, part / whole), w = Math.floor(e); return w + (rand() < e - w ? 1 : 0); }
  function sale(st, o) {
    o = o || {}; var rand = o.rand || Math.random, units = Math.max(0, o.units | 0), f0 = Math.max(units, +o.food || 0);
    var S = reconcile(st, f0), man = share(units, S.man, f0, rand), bad = share(units, S.bad, f0, rand), saus = share(units, S.sausage, f0, rand);
    man = Math.min(man, saus); bad = Math.min(bad, saus);
    S.sausage = Math.max(0, S.sausage - saus); S.man = Math.max(0, S.man - man); S.bad = Math.max(0, S.bad - bad); S.seen = f0 - units;
    if (bad > 0 && o.place) st.sold.push({ place: String(o.place), n: bad, day: o.day | 0, act: o.act | 0 || 1, years: draw(rand), shown: false });
    var found = man > 0 && !o.hungry && rand() * 100 < V('found_out_pct', 15);
    if (found) st.found.push({ place: String(o.place || ''), n: man, day: o.day | 0, act: o.act | 0 || 1 });
    return { man: man, bad: bad, sausage: saus, found: found, act: found ? V('found_out_act', 'minor_offensive_action') : null };
  }
  /* a can bought at a stall: once in a long while it came from somebody who does not care */
  function bought(st, o) {
    o = o || {}; var rand = o.rand || Math.random, units = Math.max(0, o.units | 0), f0 = Math.max(0, +o.food || 0);
    reconcile(st, f0); var S = st.stores, bad = units > 0 && rand() * 100 < V('bought_bad_pct', 1);
    if (bad) { S.sausage += units; S.man += units; S.bad += units; }
    S.seen = f0 + units; return { bad: bad, units: units };
  }

  /* ---------- THE NIGHT: they eat; a man whose share came out of a bad batch may carry the shakes ----------
     o: { ate: units the night ate, food: the count before it, men: the names who ate (never him: the main character never dies,
     the third votes), day, act, rand } */
  function draw(rand) {   /* the years it takes to show: kuru's spread, 4.5 to 50, mean about 12, a long right tail */
    var I = V('incubation_years', { mean: 12, min: 4.5, max: 50 }), u = Math.max(1e-6, rand()), w = Math.max(1e-6, rand());
    var z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w), y = I.mean * Math.exp(0.55 * z - 0.15);
    return Math.round(Math.max(I.min, Math.min(I.max, y)) * 10) / 10;
  }
  function night(st, o) {
    o = o || {}; var rand = o.rand || Math.random, ate = Math.max(0, o.ate | 0), f0 = Math.max(ate, +o.food || 0), out = [];
    var S = reconcile(st, f0), pBad = f0 > 0 ? S.bad / f0 : 0;
    if (pBad > 0) (o.men || []).slice(0, ate).forEach(function (nm) {
      if (!nm || rand() >= pBad || rand() * 100 >= V('takes_pct', 10)) return;
      if (st.marks.some(function (m) { return m.name === nm; })) return;   /* one mark a man: it is the same sickness */
      var m = { name: String(nm), day: o.day | 0, act: o.act | 0 || 1, years: draw(rand) }; st.marks.push(m); out.push(m); });
    reconcile(st, f0 - ate);
    return out;
  }

  /* ---------- WHEN IT SHOWS ----------
     o: { act, day, yearsBetween(a, b) (BohemiaActs'), daysAYear }; a mark shows when its years have gone by: in this game, a later act */
  function since(m, o) {
    var yb = typeof o.yearsBetween === 'function' ? o.yearsBetween : function (a, b) { return (b - a) * 35; };
    var y = (o.act | 0) > (m.act | 0) ? (+yb(m.act | 0, o.act | 0) || 0) : 0;
    if ((o.act | 0) === (m.act | 0)) y += Math.max(0, (o.day | 0) - (m.day | 0)) / (o.daysAYear || V('days_a_year', 365));
    return y;
  }
  function showing(st, o) {
    o = o || {}; var dies = V('dies_years', 1);
    return st.marks.map(function (m) { var y = since(m, o); return y >= m.years ? { name: m.name, day: m.day, act: m.act, years: m.years, dead: y >= m.years + dies } : null; }).filter(Boolean);
  }
  /* a town he sold a bad batch to, once its own people shake: once each, the worse act */
  function townsShaking(st, o) {
    o = o || {}; var out = [];
    st.sold.forEach(function (s) { if (s.shown || since(s, o) < s.years) return; s.shown = true; out.push({ place: s.place, act: V('shakes_town_act', 'offensive_action'), n: s.n }); });
    return out;
  }

  var API = { setData: setData, data: data, make: make, load: load, carryKg: carryKg, fresh: fresh, bring: bring, pileNow: pileNow, reconcile: reconcile,
              grind: grind, sale: sale, bought: bought, night: night, draw: draw, showing: showing, townsShaking: townsShaking };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaGrinder = API;
})(typeof window !== 'undefined' ? window : this);
