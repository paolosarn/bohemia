/* ==== __THE_CARCASS__ and __THE_VULTURES__ (WORLD 11, 11/6/26; VAMILY rules 392 and 386, ask lines 427 and 418) ====
   PAOLO 11/4: 'I just killed some lions... their corpse has so much meat that could feed people... can we put it in a shopping cart
   and haul it back... all the games have them explode into bite-size meat pieces... this could help you get some extra batteries...
   letting them know the location of the corpses for immediate retrieval and then you get extra batteries.' And: 'my sister said
   vultures, don't forget it, so turn up.'
   THE CARCASS IS A THING ON THE MAP, AND IT ROTS (draft:true, his to change):
   - after a fight, every beast that died lies on the map where the fight was (one heap, the animal's own picture on its side), never
     bite-size pieces in the bag; a plate says what it is, how much meat, and its clock: FRESH, TURNING, GONE (Mojave hours; a cool night
     runs the clock at half); the vultures over it are the timer, more of them every hour, landing when it turns;
   - THREE WAYS, plates on the map (never a card): HAUL IT (beside it: dressing it takes hours on the clock, an hour a beat, and the
     world goes on; the meat rides in the camp's shopping cart as one heavy good, the company walks slower; any town buys it, the
     butcher or the Mob's stew; EAT IT from the cart feeds the company two nights), TELL <the nearest town> (from anywhere: their own
     hunters walk out with carts and bring it in; batteries when it comes in, by how fresh it was when they got there), LEAVE IT (the
     birds and the coyotes have it; two days later something hungry lives there, and the next hunt from a town in reach starts at its
     den);
   - a clean kill keeps more meat (every wound the animal took spoils a share); early game it is real money (an American lion is about
     135 kg of meat: 54 batteries at the butcher, a two-skull job's pay).
   THE VULTURES (rule 386): they circle over the dead (a carcass, a fight's dead men for a day, a boss's yard: the sign of rule 243),
   follow a company that leaves bodies behind (the more he killed in two game days, the more ride over his marker), and never attack
   the living. Analog horror at the source: their shadows run on the ground under them; when he comes to the dead they lift higher and
   one stays on the heap and does not fly; now and then a wing's shadow slides across the whole glass while they follow him.
   THEIR PICTURE IS A STAND-IN (rule 408(c), records/target/bb/carcass.json vultures.stand_in): a few pixels, marked as one, until a
   golden piece exists. The carcass's picture is the animal's own fight sheet (BohemiaJobKinds.beastPic), laid on its side.
   Numbers: records/target/bb/carcass.json (the mods law). Hooks in BOHEMIA_CITY_WORLD.html (__THE_CARCASS__): the draw, the tap, the
   clock (advance), the cart's pace (cityStepMins), a town reached (loopArrived); the fight's bodies come home in the outcome (one marked
   line in the shell's nfOverIn). Gate: gates/the_carcass_and_the_vultures_gate.js. ==== */
(function (root) {
  'use strict';
  if (typeof document === 'undefined' || !root.addEventListener) { root.BohemiaCarcass = { node: true }; return; }
  var KEY = 'bohemia.carcass.v1', DATA = null, S = null, HITS = [], LAST = { drew: {}, sold: [], told: [], eaten: [], born: [] }, PICK = null, DRESS = null, SHADE = { next: 0 };
  fetch('../records/target/bb/carcass.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (j) { DATA = j; try { render(); } catch (e) {} }).catch(function () {});
  function V(path, dflt) { var o = DATA; String(path).split('.').forEach(function (k) { o = o == null ? undefined : o[k]; }); if (o && typeof o === 'object' && 'value' in o && !Array.isArray(o)) o = o.value; return o == null ? dflt : o; }
  function cheb(ax, ay, bx, by) { return Math.max(Math.abs(ax - bx), Math.abs(ay - by)); }
  function now() { try { return (T.day | 0) * 1440 + (T.min | 0); } catch (e) { return 0; } }
  function worldSeed() { try { return typeof seed !== 'undefined' ? seed : null; } catch (e) { return null; } }
  function fresh() { return { v: 1, seed: worldSeed(), n: 0, list: [], cart: null, told: [], dens: [], kills: [], dead: [] }; }
  function st() {
    if (!S) { try { S = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; } }
    if (!S || S.v !== 1) S = fresh();
    var ws = worldSeed(); if (ws != null && S.seed != null && S.seed !== ws) S = fresh();   /* a different valley: its dead are not here */
    if (S.seed == null) S.seed = ws;
    ['list', 'told', 'dens', 'kills', 'dead'].forEach(function (k) { if (!Array.isArray(S[k])) S[k] = []; });
    return S;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function H(h) { return h * 60; }
  /* ---------- what it is ---------- */
  function kindRow(id) { var K = (DATA && DATA.kinds) || {}; return K[id] || K['default'] || { faction: 'beasts', label: 'BEAST', kg: 60 }; }
  function idOfFaction(f) { var B = (DATA && DATA.by_faction) || {}; return B[f] || null; }
  function isBeastFaction(f) { return !!idOfFaction(f) && f !== '_about'; }
  function stateOf(c) { var a = c.age / 60; if (a < V('clock.fresh_h', 6)) return 'fresh'; if (a < V('clock.gone_h', 24)) return 'turning'; if (a < V('clock.bones_h', 48)) return 'gone'; return 'bones'; }
  function hoursTo(c) { var a = c.age / 60, s = stateOf(c), to = s === 'fresh' ? V('clock.fresh_h', 6) : s === 'turning' ? V('clock.gone_h', 24) : V('clock.bones_h', 48); return Math.max(0, to - a); }
  function word(s) { return s === 'fresh' ? 'FRESH' : s === 'turning' ? 'TURNING' : s === 'gone' ? 'GONE' : 'BONES'; }   /* draft:true */
  function meatOf(id, hurt) { var r = kindRow(id), cl = Math.max(V('clean.floor', 0.5), 1 - V('clean.per_wound', 0.12) * Math.max(0, hurt | 0)); return Math.round(r.kg * V('meat_share', 0.45) * cl); }
  function dressH(c) { var h = (c.liveKg || 0) / 100 * V('dress.h_per_100kg', 1); return Math.max(V('dress.min_h', 1), Math.min(V('dress.max_h', 5), Math.ceil(h * 2) / 2)); }
  function townsBy(x, y) { var out = []; try { var bs = ctBases() || {}; for (var n in bs) { var b = bs[n]; if (b) out.push({ name: n, x: b.x | 0, y: b.y | 0, d: cheb(b.x | 0, b.y | 0, x, y) }); } } catch (e) {} out.sort(function (a, b) { return a.d - b.d; }); return out; }
  function stewTown(name) { var L = V('pay.stew_towns', ['Mob']) || []; name = String(name || '').toLowerCase(); return L.some(function (t) { return name.indexOf(String(t).toLowerCase()) >= 0; }); }
  function pay(kg, table, state) { var t = V(table, {}) || {}; return Math.max(0, Math.round(kg * (+t[state] || 0))); }
  function credit(n, why) { if (!(n > 0)) return; try { BohemiaPurse.credit(purseGet(), 'electricity', n, why, 'carcass:' + why + ':' + now(), loopDay()); } catch (e) {} try { if (typeof updHud === 'function') updHud(); } catch (e) {} try { if (typeof root.__barPaintRead === 'function') root.__barPaintRead(); } catch (e) {} }
  function post(who, txt) { try { if (root.BOHEMIA_FEED) root.BOHEMIA_FEED.push({ who: who, txt: txt, kind: 'world', draft: true }); } catch (e) {} }
  function say(txt) { try { travelSay(txt); } catch (e) {} try { if (typeof DAY !== 'undefined' && DAY.happened) DAY.happened(txt, 'carcass'); } catch (e) {} }   /* the map's own line (rule 19c), and the day's ledger */
  function spotNear(x, y, salt) {   /* the block beside where the fight was, never under his feet: the board is a piece of the city round that spot */
    var D = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]], k = Math.abs(salt | 0) % 8;
    for (var i = 0; i < 8; i++) { var q = D[(i + k) % 8], nx = x + q[0], ny = y + q[1]; try { if (cityWalkable(nx, ny) && !(townGround && townGround(nx, ny))) return [nx, ny]; } catch (e) {} }
    return [x, y];
  }

  /* ---------- 1. A FIGHT ENDED: what died lies where it fell ---------- */
  function fightHome(d) {
    var o = (d && d.outcome) || {}; if (o.withdrew || o.arena) return null;
    var at = d.at && d.at.gx != null ? [d.at.gx | 0, d.at.gy | 0] : null; if (!at) { try { at = [city.x | 0, city.y | 0]; } catch (e) { return null; } }
    var s = st(), t = now(), handed = null; try { handed = root.__HANDED || null; } catch (e) {}
    var bodies = Array.isArray(o.bodies) ? o.bodies : null, beasts = [], men = 0;
    if (bodies) bodies.forEach(function (b) { if (b && b.beast) beasts.push(b); else men++; });
    else if ((o.dead | 0) > 0) { var f = handed && handed.party && handed.party.faction; if (f && isBeastFaction(f)) for (var i = 0; i < (o.dead | 0); i++) beasts.push({ kind: idOfFaction(f), hurt: 0 }); else men = o.dead | 0; }
    if ((o.dead | 0) > 0) { s.kills.push({ t: t, n: o.dead | 0 }); }
    var born = null;
    if (beasts.length) {
      var nid = function (kd) { return (DATA && DATA.kinds && DATA.kinds[kd]) ? kd : (idOfFaction(kd) || 'default'); };
      var by = {}, kg = 0, live = 0; beasts.forEach(function (b) { var id = nid(b.kind); by[id] = (by[id] | 0) + 1; kg += meatOf(id, b.hurt); live += kindRow(id).kg; });
      var top = Object.keys(by).sort(function (a, b) { return kindRow(b).kg * by[b] - kindRow(a).kg * by[a]; })[0];
      var hurt = beasts.reduce(function (a, b) { return a + (b.hurt | 0); }, 0);
      var spot = spotNear(at[0], at[1], ++s.n);
      born = { id: 'c' + s.n, at: spot, kind: top, faction: kindRow(top).faction, label: kindRow(top).label, n: beasts.length, kg: kg, kg0: kg, liveKg: live, hurt: hurt,
        clean: Math.round(100 * kg / Math.max(1, Math.round(live * V('meat_share', 0.45)))), born: t, age: 0, left: false, told: null, dressing: false };
      s.list.push(born); if (s.list.length > 12) s.list.splice(0, s.list.length - 12);
      LAST.born.push({ id: born.id, label: born.label, n: born.n, kg: born.kg, clean: born.clean, at: spot.slice(), bodies: !!bodies }); if (LAST.born.length > 12) LAST.born.shift();
      post('@thevalley', born.n + ' ' + born.label + (born.n > 1 ? 'S' : '') + ' down near the ' + whereWord(spot) + '. ' + born.kg + ' kilos of meat in the sun. The birds are already up.');   /* draft:true */
    }
    if (men > 0) { s.dead.push({ at: at.slice(), n: men, born: t, age: 0 }); if (s.dead.length > 10) s.dead.splice(0, s.dead.length - 10); }
    save(); try { render(); } catch (e) {}
    return born;
  }
  function whereWord(at) { var tn = townsBy(at[0], at[1])[0]; return tn ? String(tn.name) + ' side' : 'road'; }
  root.addEventListener('message', function (ev) { var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_CITY_COMBAT_END') return; try { if (DATA) fightHome(d); else setTimeout(function () { try { fightHome(d); } catch (e) {} }, 1500); } catch (e) { root.__CARCASS_ERR = String(e && e.message || e); } });

  /* ---------- 2. THE CLOCK (advance() calls this with the minutes the valley spent) ---------- */
  function tick(mins) {
    if (!DATA || !(mins > 0)) return;
    var s = st(), night = false; try { night = isNight(); } catch (e) {}
    var r = night ? V('clock.night_rate', 0.5) : 1, changed = false, t = now();
    s.list.forEach(function (c) { var was = stateOf(c); c.age += mins * r; if (stateOf(c) !== was) changed = true; });
    if (s.cart) { var was = stateOf(s.cart); s.cart.age += mins * r * V('clock.cart_rate', 0.6); if (stateOf(s.cart) !== was) changed = true; }
    s.dead.forEach(function (x) { x.age += mins; });
    /* the town's hunters: out to it, then home with it */
    s.told.forEach(function (k) {
      if (k.done) return;
      var c = null; s.list.forEach(function (q) { if (q.id === k.id) c = q; });
      if (!k.got && t >= k.there) { k.got = true; k.state = c ? stateOf(c) : 'gone'; k.kg = c && k.state !== 'gone' && k.state !== 'bones' ? c.kg : 0; if (c) { c.kg = 0; c.taken = true; } changed = true; }
      if (k.got && t >= k.home) { k.done = true; var n = pay(k.kg, 'pay.tell_per_kg', k.state); credit(n, 'told ' + k.town + ' where the ' + k.label + ' lay');
        LAST.told.push({ town: k.town, kg: k.kg, state: k.state, paid: n, at: t }); if (LAST.told.length > 12) LAST.told.shift();
        post('@' + String(k.town).toLowerCase().replace(/[^a-z0-9]+/g, ''), n > 0 ? 'The carts are back with the ' + k.label.toLowerCase() + '. ' + k.kg + ' kilos, ' + word(k.state).toLowerCase() + '. ' + n + ' batteries to the company that told us.' : 'Our carts went out for the ' + k.label.toLowerCase() + '. The birds had it first. Nothing to pay.');   /* draft:true */
        try { loopSay(n > 0 ? k.town + ' brought the ' + k.label.toLowerCase() + ' in. Paid ' + n + ' batteries.' : k.town + "'s carts came back empty. It had turned."); } catch (e) {}   /* draft:true */
        changed = true; }
    });
    s.told = s.told.filter(function (k) { return !k.done || t - k.home < 120; });
    /* the dead go back to the ground; one left to the birds becomes a den */
    s.list = s.list.filter(function (c) {
      if ((c.taken || c.kg <= 0) && !c.told && !c.dressing) { if (c.gone == null) c.gone = t; return t - c.gone < 180; }   /* hauled or taken: a stain and the birds for a few hours */
      if (stateOf(c) !== 'bones' || c.age < H(V('clock.bones_h', 48))) return true;
      if (!c.taken && !c.told && c.kg > 0) { var big = c.liveKg, dk = V('leave.den_kind', 'coyotes'), bysz = V('leave.den_kinds_by_size', {}) || {};
        Object.keys(bysz).map(Number).sort(function (a, b) { return a - b; }).forEach(function (kg) { if (big >= kg) dk = bysz[kg]; });
        s.dens.push({ at: c.at.slice(), kind: dk, from: c.label, t: t }); if (s.dens.length > 6) s.dens.shift();
        post('@thevalley', 'Something moved into the old ' + c.label.toLowerCase() + ' kill out past the ' + whereWord(c.at) + '. ' + dk.toUpperCase() + ' at night now.'); changed = true; }   /* draft:true */
      return false;
    });
    s.dead = s.dead.filter(function (x) { return x.age < H(V('vultures.dead_men_h', 24)); });
    s.kills = s.kills.filter(function (k) { return t - k.t < H(V('vultures.follow_hours', 48)) && t >= k.t - 60; });
    if (changed) { save(); try { render(); } catch (e) {} }
  }

  /* ---------- 3. THE THREE WAYS ---------- */
  function byId(id) { var c = null; st().list.forEach(function (q) { if (q.id === id) c = q; }); return c; }
  function near(c) { try { return cheb(city.x, city.y, c.at[0], c.at[1]) <= 1; } catch (e) { return false; } }
  function claimable(c) { var s = stateOf(c); return !!c && !c.taken && c.kg > 0 && !c.told && (s === 'fresh' || s === 'turning'); }
  /* HAUL IT: the knives, an hour a beat on the clock (the world walks the hour, the camp's way), then the cart */
  function haul(id) {
    var c = byId(id), s = st(); if (!c || !claimable(c) || !near(c) || DRESS) return false;
    if (s.cart && s.cart.kg >= V('cart.kg', 120)) { say('The cart is full. Sell it or eat it first.'); return false; }   /* draft:true */
    try { travelStop(); } catch (e) {}
    var need = dressH(c), done = 0; c.dressing = true; DRESS = { id: c.id, need: need, done: 0 };
    say('The knives come out. ' + (need === 1 ? 'An hour' : need + ' hours') + ' on the ' + c.label.toLowerCase() + '.');   /* draft:true */
    var beat = (typeof BEAT === 'number' ? BEAT : 500);
    var step = function () {
      var stop = null; try { if (typeof TRAVEL !== 'undefined' && TRAVEL) stop = 'walked'; if (MEET && MEET.up) stop = 'met'; if (LOOP && LOOP.fighting) stop = 'fight'; } catch (e) {}
      if (!stop && done < need) {
        var h = Math.min(1, need - done); try { advance(Math.round(60 * h)); } catch (e) {}
        for (var i = 0; i < Math.round(6 * h); i++) { try { meetWalk(function () { mapStepWorld(); }); } catch (e) {} try { if (MEET.up || LOOP.fighting) { stop = 'met'; break; } } catch (e) {} }
        done += h; DRESS.done = done; try { render(); } catch (e) {}
        if (!stop && done < need) { setTimeout(step, beat); return; }
      }
      DRESS = null; c.dressing = false;
      var share = Math.max(0, Math.min(1, done / need)), cap = V('cart.kg', 120), cart = s.cart || { kg: 0, label: c.label, kind: c.kind, faction: c.faction, age: c.age, from: c.id };
      var take = Math.min(Math.round(c.kg * share), cap - cart.kg);
      if (take > 0) { cart.age = cart.kg > 0 ? (cart.age * cart.kg + c.age * take) / (cart.kg + take) : c.age; cart.kg += take; cart.label = c.label; c.kg -= take; s.cart = cart; }
      if (c.kg <= 0 || share >= 1) { c.taken = true; }   /* what did not fit is left to the birds */
      save();
      say(take > 0 ? (stop ? 'Cut short. ' : '') + take + ' kilos of ' + c.label.toLowerCase() + ' in the cart.' + (c.kg > 0 ? ' ' + c.kg + ' left for the birds.' : '') : 'Nothing in the cart.');   /* draft:true */
      if (take > 0) post('@thecrew', take + ' kilos of ' + c.label.toLowerCase() + ' in the shopping cart. Somebody is going to eat tonight.');   /* draft:true */
      LAST.hauled = { id: c.id, kg: take, need: need, done: done, stop: stop, at: now() };
      try { mapStatePost(); render(); } catch (e) {}
    };
    setTimeout(step, beat); return true;
  }
  /* TELL SOMEBODY: from anywhere; the nearest town's own hunters go */
  function tell(id) {
    var c = byId(id), s = st(); if (!c || !claimable(c)) return false;
    var tn = townsBy(c.at[0], c.at[1])[0]; if (!tn) return false;
    var mpb = V('hunters.min_per_block', 12), t = now(), leg = Math.max(30, tn.d * mpb);
    var k = { id: c.id, town: tn.name, label: c.label, from: [tn.x, tn.y], to: c.at.slice(), left: t, there: t + leg, home: t + 2 * leg, got: false, done: false };
    c.told = tn.name; s.told.push(k); save();
    post('@thecrew', 'Told ' + tn.name + ' where the ' + c.label.toLowerCase() + ' is. Their carts are on the way.');   /* draft:true */
    post('@' + String(tn.name).toLowerCase().replace(/[^a-z0-9]+/g, ''), 'Carts out. Somebody says there is a ' + c.label.toLowerCase() + ' down near the ' + whereWord(c.at) + '. Pray it is fresh.');   /* draft:true */
    say('Told ' + tn.name + '. Their carts will be there in ' + Math.max(1, Math.round(leg / 60)) + ' h.');   /* draft:true */
    try { render(); } catch (e) {} return true;
  }
  function leave(id) { var c = byId(id); if (!c) return false; c.left = true; save(); say('Leave it. The birds will have it by tomorrow.'); try { render(); } catch (e) {} return true; }   /* draft:true */
  /* EAT IT: the company eats what it can before it turns */
  function eat() {
    var s = st(), c = s.cart; if (!c || c.kg <= 0) return false;
    var crew = 3; try { crew = Math.max(1, crewCount() | 0); } catch (e) {}
    var per = V('eat.kg_per_food', 0.5), food = Math.min(Math.floor(c.kg / per), crew * V('eat.nights', 2));
    if (food <= 0 || stateOf(c) === 'gone' || stateOf(c) === 'bones') { say('Nobody eats that. It has turned too far.'); return false; }   /* draft:true */
    try { var w = wagonGet() || { food: 0 }; w.food = (w.food | 0) + food; wagonPut(w); billPublish(); } catch (e) {}
    var kg = Math.round(food * per); c.kg -= kg; if (c.kg <= 0) s.cart = null; save();
    LAST.eaten.push({ kg: kg, food: food, at: now() }); if (LAST.eaten.length > 12) LAST.eaten.shift();
    say('The company eats ' + c.label.toLowerCase() + '. ' + food + ' nights of food on the fire.' + (s.cart ? ' ' + s.cart.kg + ' kilos still in the cart.' : ''));   /* draft:true */
    post('@thecrew', 'Lion on the fire. Nobody asks what it was.');   /* draft:true */
    try { render(); } catch (e) {} return true;
  }
  /* a town reached with the cart: the butcher, or the Mob's stew */
  function arrived(x, y) {
    var s = st(), c = s.cart; if (!c || c.kg <= 0) return false;
    var tn = null; try { tn = loopTownAt(x, y, 2) || townGround(x, y); } catch (e) {} if (!tn) return false;
    var stw = stewTown(tn.name), state = stateOf(c), n = pay(c.kg, stw ? 'pay.stew_per_kg' : 'pay.butcher_per_kg', state);
    var line = n > 0 ? (stw ? 'The stew pot at ' : 'The butcher at ') + tn.name + ' weighs it: ' + c.kg + ' kilos, ' + word(state).toLowerCase() + '. ' + n + ' batteries.' : (stw ? 'Even the stew at ' : 'The butcher at ') + tn.name + ' will not touch it. Dumped.';   /* draft:true */
    credit(n, (stw ? 'the stew' : 'the butcher') + ' at ' + tn.name + ': ' + c.kg + ' kg of ' + c.label.toLowerCase());
    LAST.sold.push({ town: tn.name, kg: c.kg, state: state, paid: n, stew: stw, at: now() }); if (LAST.sold.length > 12) LAST.sold.shift();
    s.cart = null; save(); try { loopSay(line); } catch (e) {}
    post('@' + String(tn.name).toLowerCase().replace(/[^a-z0-9]+/g, ''), stw ? 'Stew tonight. Do not ask.' : 'Fresh meat at the counter. First in line.');   /* draft:true */
    return true;
  }
  /* the cart's weight on the walk (cityStepMins multiplies the block's minutes by this) */
  function pace() { var c = S && S.cart; if (!c || !(c.kg > 0)) return 1; var full = Math.min(1, c.kg / V('cart.kg', 120)); return 1 + (V('cart.slow_at_full', 1.5) - 1) * full; }
  /* a den left by a carcass nobody claimed: a hunt from a town in reach starts its first pack there (bohemia_job_kinds.js spawnPack) */
  function denFor(tx, ty, r0, r1) { var s = st(), best = null; s.dens.forEach(function (d) { var dd = cheb(d.at[0], d.at[1], tx, ty); if (dd >= r0 && dd <= r1 && !best) best = d; }); return best; }

  /* ---------- 4. DRAWN ON THE MAP (the map's own pen) ---------- */
  function k() { try { return Math.max(0.55, Math.min(2.2, (MAP_PEOPLE_K || 1))); } catch (e) { return 1; } }
  function onGlass(p, m) { m = m == null ? 80 : m; try { return !(p.sx < -m || p.sx > CVW + m || p.sy < -m - 60 || p.sy > CVH + m); } catch (e) { return true; } }
  function plate(t, sx, cy, col, up, extra) {
    g.font = '700 9px ' + FACE('casing'); var w = g.measureText(t).width, box = { x: sx - w / 2 - 3, y: cy - (up || 44), w: w + 6, h: 11 };
    var P = { t: t, lx: sx - w / 2 - 3, ly: cy - (up || 44), w: w, col: col, sx: sx, cy: cy, r: 33, box: box, carcass: true };
    try { LAST.drew.labels.push(t); } catch (e) {}
    if (extra) for (var q in extra) P[q] = extra[q];
    MAP_PLATES.push(P); return box;
  }
  function hit(box, what) { var h = { what: what }; try { Object.defineProperty(h, 'x', { get: function () { return box.x; } }); Object.defineProperty(h, 'y', { get: function () { return box.y; } }); } catch (e) { h.x = box.x; h.y = box.y; } h.w = box.w; h.h = box.h; HITS.push(h); return h; }
  /* the animal on its side: its own fight sheet, the idle frame turned a quarter, darkened, a pool under it */
  function heap(c, sx, fy, kp) {
    var st0 = stateOf(c), spent = c.taken || c.kg <= 0, a = st0 === 'fresh' ? 1 : st0 === 'turning' ? 0.85 : 0.6;
    g.save();
    g.fillStyle = spent ? 'rgba(60,20,14,0.35)' : 'rgba(92,18,12,' + (st0 === 'fresh' ? 0.75 : 0.55) + ')'; g.beginPath(); g.ellipse(sx, fy, 30 * kp, 9 * kp, 0, 0, 7); g.fill();
    var drew = false;
    if (!spent && st0 !== 'bones') { try { var B = root.BohemiaJobKinds && BohemiaJobKinds.beastPic ? BohemiaJobKinds.beastPic(c.faction) : null;
      if (B && B.im && B.m) { var m = B.m, sc = 0.5 * MAP_PERSON_K * MAP_PEOPLE_K, w = m.w * sc, h = m.h * sc;
        /* down on its side, seen from the map's camera: the E-facing idle frame pressed flat to the ground about its feet, darker as it turns */
        g.save(); g.translate(Math.round(sx), Math.round(fy)); g.scale(1.1, 0.55); g.rotate(0.05); g.globalAlpha = a;
        var sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = false;
        g.filter = st0 === 'fresh' ? 'brightness(0.6) saturate(0.7)' : 'brightness(0.42) saturate(0.4) sepia(0.4)';
        g.drawImage(B.im, 0, 2 * m.h, m.w, m.h, -m.foot[0] * sc, -m.foot[1] * sc, w, h);
        g.filter = 'none'; g.imageSmoothingEnabled = sm; g.restore(); drew = true; } } catch (e) { try { g.filter = 'none'; } catch (e2) {} } }
    if (!drew) {   /* bones, or the sheet not in yet: ribs in the sand */
      g.strokeStyle = spent ? 'rgba(200,190,170,0.35)' : 'rgba(214,204,182,0.8)'; g.lineWidth = Math.max(1, kp);
      for (var i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(sx + i * 3 * kp, fy - 1); g.quadraticCurveTo(sx + i * 3 * kp + 2 * kp, fy - 7 * kp, sx + i * 3 * kp + 4 * kp, fy - 1); g.stroke(); }
    }
    g.restore();
  }
  /* THE VULTURE, A STAND-IN (rule 408(c)): a turkey vulture's shallow V, black wings with the silver trailing edge, a red head */
  /* its size is real: a turkey vulture's wings are about as wide as a man is tall (1.7 m), so at the map's man (MAP_PEOPLE_K) a bird's span
     is a man's height in pixels, near enough; seven pixel steps a wing at three pixels a step at the map's own man */
  function bird(x, sx, sy, kp, tilt, flap) {
    var s = Math.max(1, Math.round(kp * 3)), sp = 6 + (flap ? 1 : 0);
    x.save(); x.translate(Math.round(sx), Math.round(sy)); x.rotate(tilt);
    x.fillStyle = '#17110e';
    for (var i = 1; i <= sp; i++) { var dy = Math.round(-i * 0.45) - (flap ? 1 : 0); x.fillRect(-i * s, dy * s, s, s); x.fillRect((i - 1) * s, dy * s, s, s); }
    x.fillStyle = 'rgba(150,146,140,0.85)';
    for (var j = 3; j <= sp; j++) { var dy2 = Math.round(-j * 0.45) - (flap ? 1 : 0) + 1; x.fillRect(-j * s, dy2 * s, s, s); x.fillRect((j - 1) * s, dy2 * s, s, s); }
    x.fillStyle = '#21180f'; x.fillRect(-s, 0, 2 * s, s); x.fillRect(-Math.round(s / 2), s, s, s);
    x.fillStyle = '#b8352a'; x.fillRect(-Math.round(s / 2), -s, s, s);
    x.restore();
  }
  function perched(sx, sy, kp, still) {   /* hunched on the heap: wings folded, the bare red head down, facing the one who came (a bird stands about a third of a man) */
    var s = Math.max(1, Math.round(kp * 3));
    g.fillStyle = '#16100c'; g.fillRect(sx - 2 * s, sy - 5 * s, 4 * s, 5 * s); g.fillRect(sx - 3 * s, sy - 4 * s, s, 3 * s); g.fillRect(sx + 2 * s, sy - 4 * s, s, 3 * s);
    g.fillStyle = 'rgba(140,136,128,0.8)'; g.fillRect(sx - 3 * s, sy - 2 * s, s, s); g.fillRect(sx + 2 * s, sy - 2 * s, s, s);
    g.fillStyle = '#b8352a'; g.fillRect(sx + (still ? -s : s), sy - 6 * s, s, s);
  }
  function shadow(x, sx, sy, kp) { x.fillStyle = 'rgba(8,6,4,0.26)'; x.beginPath(); x.ellipse(sx, sy, 14 * kp, 3.5 * kp, 0, 0, 7); x.fill(); }
  /* ---------- THE SKY: the circling birds turn on their own thin layer over the map (MEASURED: turning them by redrawing the whole map
     cost 33 ms a frame on the gate's box, eight times a second, for as long as one bird was on the glass; the layer costs a fraction of a
     millisecond and the map draws only when it would anyway). A circle is queued where the map put its ground point (the map's own
     transform, so the street's turn and the zoom are honoured); the layer turns it on the beat until the map draws again. ---------- */
  var SKY = { cv: null, x: null, list: [], raf: 0, last: 0, frames: 0, ms: 0, shade: null };
  function skyCanvas() {
    if (SKY.cv && SKY.cv.isConnected) return SKY.cv;
    var base = document.getElementById('cv'); if (!base || !base.parentNode) return null;
    var c = document.createElement('canvas'); c.id = 'vulturesky'; c.setAttribute('aria-hidden', 'true');
    c.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:1;image-rendering:pixelated';
    base.parentNode.insertBefore(c, base.nextSibling); SKY.cv = c; SKY.x = c.getContext('2d'); return c;
  }
  function circle(gx, gy, n, kp, beat, lift, salt) {
    if (!(n > 0)) return 0;
    var M = null; try { M = g.getTransform(); } catch (e) {}
    var P = M ? M.transformPoint(new DOMPoint(gx, gy)) : { x: gx, y: gy }, sc = M ? Math.hypot(M.a, M.b) || 1 : 1;
    SKY.list.push({ x: P.x, y: P.y, n: n, kp: kp * sc, lift: lift, salt: salt | 0 });
    return n;
  }
  function skyDraw() {
    SKY.raf = 0;
    var on = SKY.list.length || SKY.shade; if (!on && !SKY.cv) return;
    var c = skyCanvas(), base = document.getElementById('cv'); if (!c || !base) return;
    var hidden = false; try { hidden = document.hidden || (typeof MODE !== 'undefined' && MODE !== 'city'); } catch (e) {}
    /* at the glass's plain points, never its device pixels (RUN's budget for the map: nothing glass-sized at the phone's pixels, 11.8 MB;
       this is about 1.3 MB on a phone held up), the birds' pixel steps scaled down to it and the CSS keeps them sharp */
    var r = base.getBoundingClientRect(), W = Math.max(1, Math.round(r.width)), Hc = Math.max(1, Math.round(r.height)), k0 = base.width / Math.max(1, r.width);
    if (c.width !== W || c.height !== Hc) { c.width = W; c.height = Hc; }
    c.style.left = r.left + 'px'; c.style.top = r.top + 'px'; c.style.width = r.width + 'px'; c.style.height = r.height + 'px';
    var x = SKY.x; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height);
    if (!on || hidden) return;
    x.setTransform(1 / k0, 0, 0, 1 / k0, 0, 0);   /* the queue is in the map canvas's own pixels */
    var now0 = performance.now(), t = now0 / 1000, per = 4 * (typeof BEAT === 'number' ? BEAT / 500 : 1), beat = Math.floor(now0 / (typeof BEAT === 'number' ? BEAT : 500));
    SKY.list.forEach(function (q) {
      var kp = q.kp, rx = 46 * kp, ry = 16 * kp, hgt = (110 + 50 * q.lift) * kp;
      for (var i = 0; i < q.n; i++) {
        var a = (t / per) * Math.PI * 2 * (i % 2 ? -1 : 1) * (0.8 + 0.06 * (i % 3)) + i * 2.4 + q.salt, rr = 0.6 + 0.4 * ((i * 37 + q.salt) % 10) / 10;
        var bx = q.x + Math.cos(a) * rx * rr, by = q.y + Math.sin(a) * ry * rr;
        shadow(x, bx + 10 * kp, by, kp);
        bird(x, bx, by - hgt - i * 6 * kp, kp, 0.18 * Math.sin(t * 2 + i), ((beat + i) % 4) === 0);
      }
    });
    /* a wing's shadow across the whole glass, now and then, while they follow him (analog horror: something passed over the camera) */
    if (SKY.shade) { var f2 = (Date.now() - SKY.shade.at) / 1600; if (f2 >= 1) SKY.shade = null; else { var W2 = c.width * k0, Hh = c.height * k0, kk = SKY.shade.kp, cx = -0.2 * W2 + 1.4 * W2 * f2, cy = Hh * (0.25 + 0.4 * f2);
      x.save(); x.globalAlpha = 0.16 * Math.sin(Math.PI * f2); x.fillStyle = '#000'; x.beginPath(); x.moveTo(cx - 140 * kk, cy - 20 * kk); x.quadraticCurveTo(cx, cy - 60 * kk, cx + 140 * kk, cy - 20 * kk); x.quadraticCurveTo(cx, cy + 10 * kk, cx - 140 * kk, cy - 20 * kk); x.fill(); x.restore(); LAST.shaded = (LAST.shaded | 0) + 1; } }
    SKY.frames++; SKY.ms = Math.round((performance.now() - now0) * 100) / 100;
    if (SKY.list.length || SKY.shade) SKY.raf = requestAnimationFrame(skyDraw);
  }
  function skyGo() { if (!SKY.raf) SKY.raf = requestAnimationFrame(skyDraw); }
  function draw(ox, oy) {
    HITS = []; var s = st(); if (!DATA) return; var kp = k(), bt = 0; try { bt = mapArtBeat(); } catch (e) {}
    var drew = { labels: [], carcass: 0, plates: 0, circling: 0, perched: 0, still: 0, dead: 0, dens: 0, carts: 0, boss: 0, following: 0, shade: false, standIn: !!V('vultures.stand_in', true) };
    var here = [0, 0]; try { here = [city.x, city.y]; } catch (e) {}
    LAST.drew = drew; SKY.list = [];
    /* the dead men: a stain where the fight was, and the birds for a day */
    s.dead.forEach(function (x, i) { var p = iso(x.at[0], x.at[1], ox, oy); if (!onGlass(p)) return; var fy = p.sy + TH / 2 + 2;
      g.fillStyle = 'rgba(70,16,10,0.4)'; g.beginPath(); g.ellipse(p.sx, fy, 12 * kp, 4 * kp, 0, 0, 7); g.fill(); drew.dead++;
      var close = cheb(here[0], here[1], x.at[0], x.at[1]) <= 1, nb = Math.min(V('vultures.circle_max', 7), 1 + Math.floor(x.age / 60 * V('vultures.circle_per_h', 0.67)) + (x.n | 0));
      drew.circling += circle(p.sx, fy, close ? Math.max(0, nb - 1) : nb, kp, bt, close ? 1 : 0, 31 + i);
      if (close || x.age > H(V('vultures.land_after_h', 10))) { perched(p.sx + 8 * kp, fy - 2, kp, close); drew.perched++; if (close) drew.still++; } });
    /* the dens */
    s.dens.forEach(function (d) { var p = iso(d.at[0], d.at[1], ox, oy); if (!onGlass(p)) return; var fy = p.sy + TH / 2 + 2;
      g.strokeStyle = 'rgba(214,204,182,0.55)'; g.lineWidth = Math.max(1, kp); for (var i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(p.sx + i * 4 * kp - 3, fy); g.lineTo(p.sx + i * 4 * kp + 3, fy - 3 * kp); g.stroke(); }
      try { var B = root.BohemiaJobKinds && BohemiaJobKinds.beastPic ? BohemiaJobKinds.beastPic(d.kind) : null;
        if (B && B.im && B.m) { var sc = 0.5 * MAP_PERSON_K * MAP_PEOPLE_K, m = B.m, w = m.w * sc, h = m.h * sc, sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = false;
          [[-8, -1, 6], [7, -3, 2]].forEach(function (q, j) { g.drawImage(B.im, 0, q[2] * m.h, m.w, m.h, Math.round(p.sx + q[0] * kp - m.foot[0] * sc), Math.round(fy + q[1] * kp - m.foot[1] * sc), w, h); });
          g.imageSmoothingEnabled = sm; } } catch (e) {}
      drew.dens++; });
    /* the carcasses, their birds, their plates and their three ways */
    s.list.forEach(function (c, i) {
      var p = iso(c.at[0], c.at[1], ox, oy); if (!onGlass(p, 200)) return; var fy = p.sy + TH / 2 + 2, stt = stateOf(c), close = near(c);
      if (onGlass(p)) { heap(c, p.sx, fy, kp); drew.carcass++; }
      var hrs = c.age / 60, nb = Math.min(V('vultures.circle_max', 7), 1 + Math.floor(hrs * V('vultures.circle_per_h', 0.67)) + Math.min(2, c.n - 1));
      var land = hrs > V('vultures.land_after_h', 10) || stt === 'gone' || stt === 'bones' || c.taken ? Math.min(V('vultures.perch_max', 3), 1 + Math.floor((hrs - V('vultures.land_after_h', 10)) / 3)) : 0;
      if (close) { land = 1; }   /* the rest lift; one stays on it and does not fly */
      drew.circling += circle(p.sx, fy, Math.max(0, nb - land), kp, bt, close ? 1 : 0, 7 + i);
      for (var q = 0; q < land; q++) { perched(p.sx + (q - 0.5 * (land - 1)) * 18 * kp, fy - 6 * kp - (q % 2) * 4 * kp, kp, close && q === 0); drew.perched++; if (close && q === 0) drew.still++; }
      if (!onGlass(p) || c.taken || c.kg <= 0) return;
      var dressing = DRESS && DRESS.id === c.id;
      var label = c.n + ' ' + c.label + (c.n > 1 ? 'S' : '') + ' · ' + c.kg + ' KG · ' + word(stt) + (stt === 'fresh' || stt === 'turning' ? ' ' + Math.max(1, Math.round(hoursTo(c))) + 'H' : '');   /* draft:true */
      if (dressing) label = 'DRESSING · ' + Math.floor(DRESS.done) + ' OF ' + DRESS.need + ' H';
      else if (c.told) label = 'TOLD ' + String(c.told).toUpperCase() + ' · ' + c.kg + ' KG';
      var col = stt === 'fresh' ? '#f2d7a0' : stt === 'turning' ? '#d9a35f' : '#9a8f80';
      var box = plate(label, p.sx, fy, col, 30); drew.plates++; hit(box, { carcass: c.id, open: true });
      if (dressing || c.told || !claimable(c) || c.left && !(PICK && PICK.id === c.id)) return;
      if (PICK && PICK.id === c.id && Date.now() < PICK.until) {
        var tn = townsBy(c.at[0], c.at[1])[0], ways = [];
        if (close) ways.push(['HAUL IT · ' + dressH(c) + 'H', 'haul', '#9fe08a']); else ways.push(['GO TO IT', 'go', '#f2d7a0']);
        if (tn) ways.push(['TELL ' + String(tn.name).toUpperCase(), 'tell', '#9fd0e0']);
        ways.push(['LEAVE IT', 'leave', '#c9b9a0']);   /* draft:true */
        ways.forEach(function (w, j) { var b2 = plate(w[0], p.sx, fy, w[2], 30 - (j + 1) * 13 - 2); drew.plates++; hit(b2, { carcass: c.id, act: w[1] }); });
        drew.ways = ways.map(function (w) { return w[1]; });
      }
    });
    /* the town's carts on the way, out and back */
    var t = now();
    s.told.forEach(function (kk) { if (kk.done) return; var f = kk.got ? Math.max(0, Math.min(1, (t - kk.there) / Math.max(1, kk.home - kk.there))) : Math.max(0, Math.min(1, (t - kk.left) / Math.max(1, kk.there - kk.left)));
      var a = kk.got ? kk.to : kk.from, b = kk.got ? kk.from : kk.to, x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f, p = iso(x, y, ox, oy); if (!onGlass(p)) return; var fy = p.sy + TH / 2 + 2;
      g.fillStyle = '#2a2420'; g.fillRect(p.sx - 6 * kp, fy - 7 * kp, 9 * kp, 5 * kp); g.fillStyle = '#c9c2b4'; g.fillRect(p.sx - 6 * kp, fy - 8 * kp, 9 * kp, 1 * kp);   /* a cart: a stand-in */
      g.fillStyle = '#120e0b'; g.fillRect(p.sx + 4 * kp, fy - 10 * kp, 2 * kp, 9 * kp); g.fillRect(p.sx + 7 * kp, fy - 9 * kp, 2 * kp, 8 * kp);
      plate(String(kk.town).toUpperCase() + "'S CARTS · " + Math.max(1, Math.round(((kk.got ? kk.home : kk.there) - t) / 60)) + 'H', p.sx, fy, '#9fd0e0', 24); drew.carts++; drew.plates++; });
    /* the boss's yard: the sign (rule 243), circling over the place where he is, unfound or found and standing */
    try { var hm = root.BohemiaHisMap && BohemiaHisMap.state ? BohemiaHisMap.state() : null, nby = V('vultures.boss_yard', 3);
      if (hm && hm.boss) { var spots = []; for (var nm in (hm.boss.found || {})) if (!(hm.boss.fallen || {})[nm]) spots.push(hm.boss.found[nm]); if (hm.boss.sign) spots.push(hm.boss.sign);
        spots.forEach(function (b, i) { if (!b || b.x == null) return; var p = iso(b.x, b.y, ox, oy); if (!onGlass(p, 120)) return; drew.circling += circle(p.sx, p.sy + TH / 2 + 2, nby, kp, bt, 0.6, 51 + i); drew.boss++; }); } } catch (e) {}
    /* over his marker: they follow a company that leaves bodies behind */
    var kills = 0; s.kills.forEach(function (x) { kills += x.n | 0; });
    var nf = Math.min(V('vultures.follow_max', 5), Math.floor(kills / Math.max(1, V('vultures.follow_per_kills', 4))));
    if (nf > 0) { var Y = null; try { Y = MAP_DREW && MAP_DREW.you; } catch (e) {} var yp = Y && isFinite(Y.x) ? { sx: Y.x, sy: Y.y } : iso(here[0], here[1], ox, oy);
      drew.following = circle(yp.sx, (Y && isFinite(Y.y) ? Y.y : yp.sy + TH / 2 + 2), nf, kp, bt, 1.4, 91); drew.circling += drew.following;
      /* a wing's shadow across the whole glass, now and then, while they follow him (drawn on the sky layer) */
      var w0 = Date.now(); if (!SHADE.next) SHADE.next = w0 + 9000; if (w0 >= SHADE.next && !SKY.shade) { SKY.shade = { at: w0, kp: kp }; SHADE.next = w0 + 26000 + ((kills * 977) % 9000); drew.shade = true; }
    }
    else { SKY.shade = null; }
    /* the cart, over his crew, and what it can do */
    if (s.cart && s.cart.kg > 0) { var Y2 = null; try { Y2 = MAP_DREW && MAP_DREW.you; } catch (e) {} var yq = Y2 && isFinite(Y2.x) ? { sx: Y2.x, cy: Y2.y } : (function () { var q = iso(here[0], here[1], ox, oy); return { sx: q.sx, cy: q.sy + TH / 2 + 2 }; })();
      var cs = stateOf(s.cart), lb = 'CART · ' + s.cart.kg + ' KG ' + s.cart.label + ' · ' + word(cs) + (cs === 'fresh' || cs === 'turning' ? ' ' + Math.max(1, Math.round(hoursTo(s.cart))) + 'H' : '');   /* draft:true */
      var bc = plate(lb, yq.sx, yq.cy, cs === 'fresh' ? '#f2d7a0' : '#d9a35f', -18); drew.plates++; hit(bc, { cart: true, open: true }); drew.cart = lb;
      if (PICK && PICK.cart && Date.now() < PICK.until) { var be = plate('EAT IT', yq.sx, yq.cy, '#9fe08a', -31); drew.plates++; hit(be, { cart: true, act: 'eat' }); drew.ways = ['eat']; } }
    LAST.drew = drew; root.__CARCASS_DREW = drew;
    try { MAP_DREW.carcass = drew.carcass; MAP_DREW.vultures = drew.circling + drew.perched; } catch (e) {}
    /* the birds keep turning on the sky layer; the map itself draws again only for a choice that times out */
    skyGo();
    if (PICK && Date.now() < PICK.until && !LAST.pickT) { LAST.pickT = setTimeout(function () { LAST.pickT = 0; try { render(); } catch (e) {} }, Math.max(50, PICK.until - Date.now() + 30)); }
  }
  /* a tap on something this file drew */
  function tap(sx, sy) {
    for (var i = HITS.length - 1; i >= 0; i--) { var h = HITS[i]; if (sx < h.x - 4 || sx > h.x + h.w + 4 || sy < h.y - 4 || sy > h.y + h.h + 4) continue;
      var w = h.what || {};
      if (w.cart) { if (w.act === 'eat') { PICK = null; eat(); return true; } PICK = { cart: true, until: Date.now() + 6000 }; try { render(); } catch (e) {} return true; }
      var c = byId(w.carcass); if (!c) continue;
      if (w.open) { PICK = { id: c.id, until: Date.now() + 6000 }; c.left = false; root.__CARCASS_PICK = { id: c.id, near: near(c) }; try { render(); } catch (e) {} return true; }
      PICK = null; root.__CARCASS_ACT = { id: c.id, act: w.act, at: now() };
      if (w.act === 'haul') return haul(c.id) || true;
      if (w.act === 'tell') return tell(c.id) || true;
      if (w.act === 'leave') return leave(c.id) || true;
      if (w.act === 'go') { try { travelStop(); return travelTo(0, 0, c.at) || true; } catch (e) { return true; } }
    }
    return false;
  }

  root.BohemiaCarcass = {
    draw: draw, tap: tap, tick: tick, pace: pace, arrived: arrived, denFor: denFor,
    haul: haul, tell: tell, leave: leave, eat: eat, fightHome: fightHome,
    /* reading, for the gate */
    data: function () { return DATA; }, ready: function () { return !!DATA; }, state: function () { return st(); }, stateOf: stateOf, dressH: dressH, meatOf: meatOf, last: function () { return LAST; },
    hits: function () { return HITS.slice(); }, sky: function () { return { px: SKY.cv ? [SKY.cv.width, SKY.cv.height] : null, circles: SKY.list.length, birds: SKY.list.reduce(function (a, q) { return a + q.n; }, 0), frames: SKY.frames, ms: SKY.ms, shade: !!SKY.shade }; }, dressing: function () { return DRESS; }, reset: function () { S = fresh(); save(); PICK = null; DRESS = null; }
  };
})(typeof window !== 'undefined' ? window : this);
