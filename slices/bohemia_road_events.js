/* THE ROAD'S EVENTS AND THE SIDE QUESTS (CONTENT [twenty-five things on the road], 11/2/26).
   PAOLO 11/2: 'I want more content for the game, more content.' Before: 'it's fun but it got pretty boring... a little more
   quests to do.' MEASURED FIRST (records/BOHEMIA_CONTENT_MORE_TO_DO_ON_THE_ROAD_11_2_26.md): the map's road met a player with
   ONE kind of event, a forced party he can see and run from (huntSpawn); the twelve road moments with words and choices
   (ROAD_WORDS / ROAD_CHOICES in BOHEMIA_CITY_WORLD.html) never fire, refused since 9/20 for having no body on screen; the five
   playable .bq quests the demo once bound (S01, S09, S02, S22, S25) are bound to the walk, which is dead (9/28). So on the map:
   zero events with a face and a choice, zero side quests.
   NOW, THE BATTLE BROTHERS WAY (reference/library/battle_brothers/: an event stops the company on the road; a face, the
   situation, two or three choices, a real cost; some remember the choice and come back days later):
     THE MOUTH CARD    one card for every person on the road: their fresh portrait TALKING the line (PORTRAIT's heads through
                       engine/bohemia_crew_faces.js, heard through the game's one voice), their name, where they are, the
                       words, and two or three choices with what each costs. The road holds still under it (travelInterrupt,
                       the map's one pause); a choice is his GO, so the march goes on when the card goes (travelGoes).
     THE DIRECTOR      on every block the party walks on the map: never in the first real minute (THE SECOND VOTES; the
                       overworld law's 'never in the first minute'), a gap of blocks between events, then a chance a block;
                       picks by the ground under him (paved / rough / any), day or night, the chain's flags, and what he has.
     WHAT A CHOICE DOES  batteries (the purse), food (the wagon, a man's night each), gear (the bag), a man (joins the
                       hired; or walks), a town's opinion (the job system's own settled acts, Battle Brothers' relations),
                       time (the clock), a fight (through the one door, cityHandOver), a chance, a chain's flag, a side quest.
     THE SIDE QUESTS   five of QUESTS' playable .bq quests, their words verbatim (records/target/BOHEMIA_SIDE_QUESTS.json,
                       baked by tools/bohemia_side_quests_bake.js): the giver stops you on the road; when the talk turns to
                       somebody who is not here, that person's place goes on the map (the job system marks it, a tap walks
                       there); arriving, they talk; an ending closes it and pays. People, places and things, never a card
                       (laws/BOHEMIA_LAW_A_QUEST_IS_PEOPLE_PLACES_AND_THINGS_9_20_26.md): every word comes from a mouth.
   Every word lives in the data files (records/target/BOHEMIA_ROAD_EVENTS.json, BOHEMIA_SIDE_QUESTS.json), draft:true; this file
   owns none. Loaded by BOHEMIA_CITY_WORLD.html after bohemia_job_kinds.js; the job system calls places() / here() / arrived()
   (the side quests' places) and job legs call card() and apply() (slices/bohemia_job_kinds.js LEGS).
     BohemiaRoadEvents.step()             a block walked on the map; true = an event stopped him
     BohemiaRoadEvents.fire(id)           that event now (the drive, a modder testing a row)
     BohemiaRoadEvents.card(o) / close()  the mouth card: { look, name, from, text, head, opts: [{ t, tag, off, fn }] }
     BohemiaRoadEvents.apply(fx, ctx)     what a choice does: { say, fight }
     BohemiaRoadEvents.places() / here(x, y) / arrived(x, y)   the side quests on the map
     BohemiaRoadEvents.status()           what was met, chosen and held, for the drive and the gates */
(function (root) {
  'use strict';
  var EV = null, SQ = null, KEY = 'bohemia.roadevents.v1', T0 = Date.now(), UP = null, FIGHT = null, BG = null, WEAP = null;
  var DIRS8 = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  function get(url, cb) { try { fetch(url).then(function (r) { return r.ok ? r.json() : null; }).then(cb).catch(function () { cb(null); }); } catch (e) { cb(null); } }
  function load() {
    get('../records/target/BOHEMIA_ROAD_EVENTS.json', function (j) { if (j && j.events) EV = j; });
    get('../records/target/BOHEMIA_SIDE_QUESTS.json', function (j) { if (j && j.quests) SQ = j; });
  }
  /* ---------- what the road remembers (one key; a new game forgets it with the rest of the company) ---------- */
  function st() {
    var s = null; try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!s || typeof s !== 'object') s = {};
    ['seen', 'flags', 'quests'].forEach(function (k) { if (!s[k] || typeof s[k] !== 'object') s[k] = {}; });
    if (!Array.isArray(s.log)) s.log = [];
    s.walked = s.walked | 0; s.last = s.last | 0; s.met = s.met | 0;
    return s;
  }
  function put(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function day() { try { return loopDay() | 0; } catch (e) { return 0; } }
  function night() { try { return !!isNight(); } catch (e) { return false; } }
  function cheb(ax, ay, bx, by) { return Math.max(Math.abs(ax - bx), Math.abs(ay - by)); }
  function at() { try { return [city.x | 0, city.y | 0]; } catch (e) { return [0, 0]; } }
  function esc2(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function say(line) { if (!line) return; try { if (typeof loopSay === 'function') loopSay(line); } catch (e) {} }
  function feed(who, txt) { try { if (root.BOHEMIA_FEED) root.BOHEMIA_FEED.push({ who: who, txt: txt, kind: 'mine', draft: true }); } catch (e) {} }
  function happened(txt) { try { if (typeof DAY !== 'undefined' && DAY.happened) DAY.happened(txt, 'road'); } catch (e) {} }
  function save(why) { try { setTimeout(function () { try { saveNow(why); } catch (e) {} }, 0); } catch (e) {} }
  function bar() { try { if (typeof updHud === 'function') updHud(); } catch (e) {} try { if (typeof root.__barPaintRead === 'function') root.__barPaintRead(); } catch (e) {} }

  /* ---------- CONTENT 2 (11/3): WHAT IS ON THE MAP NOW, READ ONLY (the road's people talk about what is really there) ----------
     a roaming party (FACTIONS' parties, RUN's partiesAll: a caravan carrying, a crew going to take, a patrol), a raided town (a CREW
     that reached somebody's ground and is walking home with it: party.arrived), a boss's sign standing in the world (WORLD TWO's
     his map, bohemia_his_map.js state().boss.sign, never written here), the nearest town. A row asks with needs.party / needs.raided /
     needs.boss_sign; its words carry {party} {toward} {raided} {raider} {boss} {town} and are filled from what the map says. */
  function partyNear(want) {
    var ps = null, w = at(), best = null, bd = 1e9; try { ps = partiesAll(); } catch (e) {} if (!ps || !ps.length) return null;
    ps.forEach(function (p) { if (!p || !p.at || !p.from) return; if (want.agenda && p.agenda !== want.agenda) return;
      if (want.faction && String(p.from.faction || '').toLowerCase().indexOf(String(want.faction).toLowerCase()) < 0) return;
      if (!p.arrived && cheb(p.at.x | 0, p.at.y | 0, p.from.x | 0, p.from.y | 0) < 2) return;   /* still at its own gate: the map does not draw it yet */
      var d = cheb(w[0], w[1], p.at.x | 0, p.at.y | 0); if (d > (want.within || 14)) return; if (d < bd) { bd = d; best = p; } });
    return best ? { party: String(best.from.faction), toward: best.toward ? String(best.toward) : null, px: best.at.x | 0, py: best.at.y | 0, blocks: bd, pid: best.id } : null;
  }
  function raidNow() {
    var r = null, w = at(), bd = 1e9; try { (partiesAll() || []).forEach(function (p) { if (!p || p.agenda !== 'crew' || !p.arrived || !p.toward || !p.at) return;
      var d = cheb(w[0], w[1], p.at.x | 0, p.at.y | 0); if (d < bd) { bd = d; r = { raider: String(p.from.faction), raided: String(p.toward), px: p.at.x | 0, py: p.at.y | 0 }; } }); } catch (e) {}
    return r;
  }
  function bossSign(want) {
    var h = null; try { h = root.BohemiaHisMap && BohemiaHisMap.state ? BohemiaHisMap.state() : null; } catch (e) {}
    var sg = h && h.boss && h.boss.sign; if (!sg || (h.boss.fallen && h.boss.fallen[sg.n])) return null;
    if (want && want !== 'any' && want !== sg.n) return null;
    return { boss: String(sg.n), sx: sg.x | 0, sy: sg.y | 0 };
  }
  function nearTown() { try { return townOf('near'); } catch (e) { return null; } }
  function ctxOf(n, s) {
    n = n || {}; var c = { town: nearTown() || 'the next town' };
    if (n.flag && s && s.fctx && s.fctx[n.flag]) Object.keys(s.fctx[n.flag]).forEach(function (k) { c[k] = s.fctx[n.flag][k]; });
    if (n.party) { var p = partyNear(n.party); if (!p) return null; Object.keys(p).forEach(function (k) { c[k] = p[k]; }); }
    if (n.raided) { var r = raidNow(); if (!r) return null; Object.keys(r).forEach(function (k) { c[k] = r[k]; }); }
    if (n.boss_sign) { var b = bossSign(n.boss_sign); if (!b) return null; Object.keys(b).forEach(function (k) { c[k] = b[k]; }); }
    return c;
  }
  /* {word} or {word|what to say when the map has none}; a faction word for a mood's place is lower case ('faction:{party}') */
  function fill(t, c) {
    if (t == null || !c) return t;
    var D0 = { party: 'Caravans', toward: 'the next town', raided: 'nearest', raider: 'raiders', boss: 'him', town: 'the next town' };   /* a word the map did not give (a row fired by hand) */
    return String(t).replace(/\{([a-z_]+)(?:\|([^}]*))?\}/g, function (m, k, dflt) { var v = c[k]; return v != null && v !== '' ? String(v) : (dflt != null ? dflt : (D0[k] || m)); });
  }
  function fillFx(fx, c) { if (!fx || !c) return fx; try { return JSON.parse(fill(JSON.stringify(fx), c).replace(/"place":"faction:([^"]+)"/g, function (m, f) { return '"place":"faction:' + f.toLowerCase() + '"'; })); } catch (e) { return fx; } }

  /* ---------- what he has ---------- */
  function bats() { try { return loopBats() | 0; } catch (e) { return 0; } }
  function food() { try { var w = wagonGet(); return w ? (w.food | 0) : 0; } catch (e) { return 0; } }
  function men() { try { return crewCount() | 0; } catch (e) { return 1; } }
  function needOk(n) { if (!n) return true; if (n.bats && bats() < n.bats) return false; if (n.food && food() < n.food) return false; if (n.men && men() < n.men) return false; return true; }

  /* ---------- the ground under him ---------- */
  function ground() { var c = null, w = at(); try { c = om.at(w[0], w[1]); } catch (e) {} return (c && c.district) || null; }
  function whereOk(list, d) {
    list = list && list.length ? list : ['any'];
    for (var i = 0; i < list.length; i++) { var w = list[i];
      if (w === 'any') return true;
      if (w === 'paved') { try { if (CITY_PAVED[d]) return true; } catch (e) {} continue; }
      if (w === 'rough') { if (d === 'rail' || d === 'wash') return true; continue; }
      if (w === 'pass') { var c0 = null, w0 = at(); try { c0 = om.at(w0[0], w0[1]); } catch (e) {} if (c0 && (c0.passRoad || c0.passWas === 'mountain' || c0.district === 'mountain')) return true; continue; }   /* CONTENT 2: the mountains' pass roads (RUN's region joins, bohemia_region.js: a pass road's blocks carry passRoad) */
      if (w === d) return true; }
    return false;
  }
  /* a town by a word: 'near' (the nearest to him), 'faction:reds' (the town whose name carries the word, else the nearest) */
  function townOf(place) {
    var bs = null, w = at(), best = null, bd = 1e9, want = null; try { bs = ctBases(); } catch (e) {}
    if (!bs) return null;
    if (place && /^faction:/.test(place)) want = place.slice(8).toUpperCase();
    var names = Object.keys(bs);
    if (want) for (var i = 0; i < names.length; i++) if (names[i].toUpperCase().indexOf(want) >= 0) return names[i];
    names.forEach(function (n) { var b = bs[n]; if (!b) return; var d = cheb(w[0], w[1], b.x | 0, b.y | 0); if (d < bd) { bd = d; best = n; } });
    return best;
  }

  /* ======================= WHAT A CHOICE DOES ======================= */
  function credit(n, why) { try { BohemiaPurse.credit(purseGet(), 'electricity', n, why, null, day()); } catch (e) {} }
  function debit(n, why) { n = Math.min(n, bats()); if (n > 0) { try { BohemiaPurse.debit(purseGet(), 'electricity', n, why, null, day()); } catch (e) {} } return n; }
  function addFood(n) { try { var w = wagonGet() || { food: 0 }; var was = w.food | 0; w.food = Math.max(0, was + n); wagonPut(w); return w.food - was; } catch (e) { return 0; } }
  function bagGet() { try { var b = JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]'); return Array.isArray(b) ? b : []; } catch (e) { return []; } }
  function bagPut(b) { try { localStorage.setItem('bohemia.bag.v1', JSON.stringify(b)); } catch (e) {} }
  /* a weapon into the bag, in the bag's own words (the settlement's weaponItem shape: id, kind, cls, name, price, line, nums) */
  function gearIn(id) {
    var put1 = function (rows) {
      var r = (rows || []).filter(function (x) { return x && x.id === id; })[0];
      var hands = r ? (r.hands || (/bow|crossbow|firearm/.test(r['class'] || '') ? 2 : 1)) : 1;
      var it = r ? { id: r.id, kind: 'weapon', cls: r['class'], name: String(r.name || id), was: r.name, price: Math.max(1, Math.round((r.value || 30) / 10)),
        line: 'From the road.', hands: hands, nums: 'dmg ' + r.damage_min + '-' + r.damage_max + (r.range_max ? '  reach ' + r.range_max : ''), from: 'road' }
        : { id: id, kind: 'weapon', cls: 'dagger', name: String(id), price: 3, line: 'From the road.', hands: 1, nums: '', from: 'road' };
      var b = bagGet(); b.push(it); bagPut(b); root.__ROADEV_GEAR = (root.__ROADEV_GEAR || []).concat([it.id]);
    };
    if (WEAP) return put1(WEAP);
    get('../records/target/bb/weapons.json', function (j) { WEAP = j ? (j.rows || j.weapons || j) : []; put1(WEAP); });
  }
  function gearOut() { var b = bagGet(); if (!b.length) return null; var it = b.pop(); bagPut(b); return it; }
  /* a man joins the hired (the settlement's own row: name, hid, background, stats rolled in the background's range, look) */
  function manIn(m) {
    var mk = function (rows) {
      var r = (rows || []).filter(function (x) { return x && x.id === m.bg; })[0], st0 = {}, R = Math.random;
      var rg = (r && r.stats) || { hp: [50, 60], fatigue: [90, 100], resolve: [30, 40], initiative: [100, 110], melee_skill: [47, 57], ranged_skill: [32, 42], melee_defense: [0, 5], ranged_defense: [0, 5] };
      Object.keys(rg).forEach(function (k) { var a = rg[k]; st0[k] = Array.isArray(a) ? Math.round(a[0] + R() * (a[1] - a[0])) : a; });
      var h = []; try { h = JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]') || []; } catch (e) {}
      var nm = String(m.name || 'A STRANGER').toUpperCase(); if (h.some(function (x) { return x && x.name === nm; })) nm += ' II';
      var def = { name: nm, hid: 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), day: day(), background: m.bg || 'refugee', jobs: [],
        stats: st0, base: st0, traits: [], trait: null, stars: {}, look: m.look || null, kit: [], gear: (m.gear && typeof m.gear === 'object') ? JSON.parse(JSON.stringify(m.gear)) : {}, from: 'road' };   /* CONTENT 2: he comes with what he wears (the cell vest's hire: gear.acc, COMBAT's ours.cell_vest) */
      h.push(def); try { localStorage.setItem('bohemia.hired.v1', JSON.stringify(h)); } catch (e) {}
      root.__ROADEV_JOINED = (root.__ROADEV_JOINED || []).concat([nm]); bar(); save('road:joined');
    };
    if (BG) return mk(BG);
    get('../records/target/bb/backgrounds.json', function (j) { BG = j ? j.rows : []; mk(BG); });
  }
  function manOut() {
    try { var who = crewWhoWalks(); if (!who) return null;
      if (root.BohemiaHireLock && BohemiaHireLock.dismiss) BohemiaHireLock.dismiss({ name: who.name, look: who.look || null, hired: !!who.hired, day: day() }, 'road');   /* ONE COMPANY (rule 327): the one write */
      else { var w = JSON.parse(localStorage.getItem(CREW_WALKED_KEY) || '[]') || []; w.push({ name: who.name, look: who.look || null, day: day(), dismissed: true, why: 'road' }); localStorage.setItem(CREW_WALKED_KEY, JSON.stringify(w)); }
      bar(); return who.name; } catch (e) { return null; }
  }
  function mood(m, id) {
    var town = townOf(m.place || 'near'); if (!town || !m.act) return null;
    try { if (root.BohemiaJobKinds && BohemiaJobKinds.settleJob) BohemiaJobKinds.settleJob({ from: town, id: 'road:' + id }, m.act); } catch (e) {}
    return town;
  }
  function apply(fx, ctx) {
    fx = fx || {}; ctx = ctx || {}; var id = ctx.id || 'road', out = { say: fx.say || '', fight: false, got: [] };
    if (fx.chance) { var b = Math.random() < (+fx.chance.p || 0.5) ? fx.chance.yes : fx.chance.no; var o2 = apply(b, ctx); o2.got = out.got.concat(o2.got); return o2; }
    var why = (ctx.why || ('the road: ' + (ctx.name || id))).toLowerCase();
    if (fx.bats > 0) { credit(fx.bats | 0, why); out.got.push('+' + (fx.bats | 0) + ' BATTERIES'); }
    if (fx.bats < 0) { var d = debit(-fx.bats | 0, why); if (d) out.got.push('-' + d + ' BATTERIES'); }
    if (fx.food) { var f = addFood(fx.food | 0); if (f) out.got.push((f > 0 ? '+' : '') + f + ' FOOD'); }
    if (fx.gear) { if (fx.gear === -1) { var g = gearOut(); if (g) out.got.push('LOST ' + String(g.name || 'GEAR').toUpperCase()); } else { gearIn(String(fx.gear)); out.got.push('+1 GEAR'); } }
    if (fx.man) { if ((fx.man.n | 0) > 0) { if (men() < 12) { manIn(fx.man); out.got.push('+1 MAN: ' + String(fx.man.name || '').toUpperCase()); } else out.say = (out.say ? out.say + ' ' : '') + 'There is no room in the crew.'; }
      else { var gone = manOut(); if (gone) out.got.push(gone + ' LEFT'); } }
    if (fx.mood) { var t = mood(fx.mood, id); if (t) { var v = 0; try { v = ({ favor: 15, civilian_contract_done: 10, civilian_contract_poor: 5, negotiation_fail: -2.5, minor_offensive_action: -10, offensive_action: -20, attack_them: -30 })[fx.mood.act] || 0; } catch (e) {}
      out.got.push(String(t).toUpperCase() + (v >= 0 ? ' LIKES YOU MORE' : ' LIKES YOU LESS')); } }
    if (fx.mins > 0) { try { advance(fx.mins | 0); } catch (e) {} out.got.push(fx.mins >= 60 ? Math.round(fx.mins / 60 * 10) / 10 + ' H' : (fx.mins | 0) + ' MIN'); }
    var s = st();
    if (fx.flag) s.flags[fx.flag] = day();
    if (fx.unflag) delete s.flags[fx.unflag];
    put(s);
    if (fx.quest) out.quest = fx.quest;
    if (fx.fight) out.fight = fightFor(fx.fight, ctx);
    bar(); save('road:' + id);
    return out;
  }
  /* the chip on a choice: what it costs, in a few words */
  function tagOf(o) {
    var fx = (o && o.fx) || {};
    if (fx.fight) return 'A FIGHT';
    if (fx.chance) return 'A CHANCE';
    if (fx.man && fx.man.n > 0) return '+1 MAN';
    var t = [];
    if (fx.bats) t.push((fx.bats > 0 ? '+' : '') + fx.bats + ' BAT');
    if (fx.food) t.push((fx.food > 0 ? '+' : '') + fx.food + ' FOOD');
    if (fx.gear && fx.gear !== -1) t.push('+GEAR');
    if (fx.mins) t.push(fx.mins >= 60 ? Math.round(fx.mins / 60) + ' H' : fx.mins + ' MIN');
    if (fx.mood && !t.length) t.push('THEY WILL HEAR');
    return t.slice(0, 2).join(' · ');
  }

  /* ---------- a fight, through the one door (the job system's own way: a band, the map's party math) ---------- */
  function fightFor(f, ctx) {
    var w = at(); try { w = roadWhere(); } catch (e) {}
    var party = null; try { party = partyMath('job', { skulls: f.skulls || 1 }); } catch (e) { party = { count: 3, days: 1, difficulty: 1 }; }
    var n = f.n === 'party' ? party.count : ((f.n | 0) || party.count);
    party.count = Math.max(1, n); try { party.word = partyWord(party.count); } catch (e) {}
    party.faction = f.foe || 'brigands';
    var roster = []; for (var i = 0; i < party.count; i++) roster.push({ arch: party.faction === 'beasts' ? 'beast' : 'human' });
    FIGHT = { id: ctx.id, f: f, ctx: ctx, at: Date.now() };
    var ok = false;
    try { ok = cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: f.label || 'trouble on the road', faction: null, draft: true,
      packageId: (LOOP.start && LOOP.start.pkg != null) ? LOOP.start.pkg : 1, roster: roster, party: party, street: true,
      why: 'road:' + ctx.id, at: { gx: w[0] | 0, gy: w[1] | 0 } }); } catch (e) { ok = false; }
    if (!ok) { FIGHT = null; return false; }
    root.__ROADEV_FIGHTS = (root.__ROADEV_FIGHTS | 0) + 1;
    return true;
  }
  root.addEventListener && root.addEventListener('message', function (ev) {
    var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_CITY_COMBAT_END' || !FIGHT) return;
    try { if (LOOP.fighting) return; } catch (e) {}
    var F = FIGHT; FIGHT = null;
    var o = d.outcome || {}, won = !!(o.victory || o.result === 'win') && !((o.alive | 0) > 0 && o.withdrew);
    var fx = won ? (F.f.win || {}) : (F.f.lose || {});
    if (o.withdrew) fx = {};
    var r = apply(fx, F.ctx);
    root.__ROADEV_FOUGHT = (root.__ROADEV_FOUGHT || []).concat([{ id: F.id, won: won }]).slice(-20);
    var line = (F.ctx.name ? F.ctx.name + ': ' : '') + (r.say || (won ? 'They are down.' : 'You got out of it.')) + (r.got.length ? ' (' + r.got.join(', ') + ')' : '');
    setTimeout(function () { say(line); }, 900);   /* draft:true */
    if (F.ctx.leg && typeof F.ctx.leg === 'function') { try { F.ctx.leg(won, o); } catch (e) {} }
  });

  /* ======================= THE MOUTH CARD ======================= */
  function close(resume) {
    var u = UP; UP = null; if (!u) return;
    try { u.el.remove(); } catch (e) {}
    try { document.removeEventListener('keydown', u.key, true); } catch (e) {}
    if (resume !== false && !FIGHT) { try { if (typeof TRAVEL !== 'undefined' && TRAVEL && typeof travelGoes === 'function') travelGoes(); } catch (e) {} }
    try { render(); } catch (e) {}
  }
  function card(o) {
    if (UP) close(false);
    try { if (typeof travelInterrupt === 'function') travelInterrupt('event'); } catch (e) {}
    var M = root.BohemiaMaterials, kit = function (k, s) { try { return M && M.kit ? M.kit(k, s) : ''; } catch (e) { return ''; } };
    var el = document.createElement('div'); el.id = 'roadcard'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', String(o.name || 'someone'));
    el.style.cssText = 'position:fixed;inset:0;z-index:72;display:flex;align-items:center;justify-content:center;background:rgba(8,6,4,.46);pointer-events:auto';
    var W = Math.min(352, Math.max(260, (root.innerWidth || 360) - 32));
    el.innerHTML = '<div class="rc" style="width:' + W + 'px;max-height:' + Math.round((root.innerHeight || 640) - 40) + 'px;overflow:auto;padding:14px 14px 12px;box-sizing:border-box;background:#2a2016;border:1px solid #4a3a26;border-radius:2px;' + kit('board', 1) + 'filter:drop-shadow(3px 2px 0 rgba(10,6,3,.6))">'
      + (o.head ? '<div style="font:400 10px BohemiaCasing,ui-monospace,monospace;letter-spacing:1px;color:#9f8a64;margin-bottom:6px">' + esc2(o.head) + '</div>' : '')
      + '<div style="display:flex;gap:10px;align-items:center"><canvas class="rcface" width="128" height="128" style="width:76px;height:76px;flex:none;image-rendering:pixelated;background:#14100b;border:1px solid #4a3a26"></canvas>'
      + '<div style="min-width:0"><div style="font:400 15px BohemiaCasing,ui-monospace,monospace;letter-spacing:1px;color:#f2e4c6;text-shadow:0 1px 0 #000;line-height:1.2">' + esc2(o.name) + '</div>'
      + (o.from ? '<div style="margin-top:3px;font:400 11px BohemiaCasing,ui-monospace,monospace;letter-spacing:.6px;color:#cdb98e;line-height:1.25">' + esc2(o.from) + '</div>' : '') + '</div></div>'
      + '<div class="rctext" data-draft="true" style="margin-top:10px;padding:8px 10px 10px;background:#e6dcc4;color:#1f1710;' + kit('receipt', 1) + 'font:400 12px BohemiaROM,ui-monospace,monospace;line-height:1.45;white-space:pre-wrap">' + esc2(o.text) + '</div>'
      + (o.got && o.got.length ? '<div class="rcgot" style="margin-top:8px;font:400 11px BohemiaCasing,ui-monospace,monospace;letter-spacing:.8px;color:#e2b45a">' + esc2(o.got.join('  ·  ')) + '</div>' : '')
      + '<div class="rcb" style="display:flex;flex-direction:column;gap:8px;margin-top:12px"></div></div>';
    var box = el.querySelector('.rcb');
    (o.opts || []).forEach(function (op, i) {
      var b = document.createElement('button'); b.setAttribute('data-road', String(i));
      b.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:44px;padding:6px 10px;text-align:left;font:400 12px BohemiaCasing,ui-monospace,monospace;letter-spacing:.6px;line-height:1.2;color:#1f1710;background:' + (op.off ? '#7d7464' : i === 0 ? '#e2b45a' : '#b9ad92') + ';border:0;' + kit(i === 0 && !op.off ? 'tin_amber' : 'tin', 0.75) + 'cursor:' + (op.off ? 'default' : 'pointer') + (op.off ? ';opacity:.6' : '');
      b.innerHTML = '<span>' + esc2(op.t) + '</span>' + (op.tag ? '<span style="flex:none;font-size:10px;opacity:.8">' + esc2(op.tag) + '</span>' : '');
      if (op.off) b.disabled = true;
      b.addEventListener('pointerup', function (ev) { ev.stopPropagation(); ev.preventDefault(); if (op.off || !UP || UP.el !== el) return; try { op.fn(); } catch (e) { root.__ROADEV_ERR = String(e && e.message || e); close(); } });
      box.appendChild(b);
    });
    ['pointerdown', 'touchstart', 'touchmove', 'touchend', 'wheel'].forEach(function (t) { el.addEventListener(t, function (ev) { ev.stopPropagation(); }, { passive: true }); });
    document.body.appendChild(el);
    var key = function (ev) { var k = String(ev.key || ''); var n = parseInt(k, 10); if (n >= 1 && n <= (o.opts || []).length) { ev.preventDefault(); ev.stopPropagation(); var op = o.opts[n - 1]; if (!op.off) { try { op.fn(); } catch (e) { close(); } } }
      else if (k === 'Enter' && (o.opts || []).length === 1) { ev.preventDefault(); ev.stopPropagation(); try { o.opts[0].fn(); } catch (e) { close(); } } };
    document.addEventListener('keydown', key, true);
    UP = { el: el, key: key, o: o };
    /* the face says it: PORTRAIT's head, the mouth on the beat, the game's one voice */
    var F = root.BohemiaCrewFaces, cv = el.querySelector('.rcface'), line = String(o.text || '').split('\n')[0].slice(0, 220);
    var face = function () { try { var FF = root.BohemiaCrewFaces; if (!FF || !o.look || !FF.has(o.look)) return; if (!FF.talk(cv, o.look, line)) FF.draw(cv.getContext('2d'), o.look, 128); } catch (e) {} };
    if (F) face(); else { try { var sc = document.createElement('script'); sc.src = '../engine/bohemia_crew_faces.js'; sc.onload = function () { try { BohemiaCrewFaces.ready(face); } catch (e) { face(); } }; document.head.appendChild(sc); } catch (e) {} }
    root.__ROADEV_CARD = { name: o.name, look: o.look, opts: (o.opts || []).map(function (x) { return x.t; }), at: Date.now() };
    return el;
  }

  /* ======================= THE DIRECTOR ======================= */
  function candidates(s) {
    var d = ground(), dn = day(), nt = night(), D = (EV && EV.director) || {}, rep = D.repeat_days == null ? 3 : D.repeat_days, out = [];
    try { if (typeof encRepeatDays === 'function') rep = encRepeatDays(); } catch (e) {}
    var ok = function (e) {
      if (!whereOk(e.where, d)) return false;
      if (e.when === 'day' && nt) return false; if (e.when === 'night' && !nt) return false;
      var n = e.needs || {};
      if (n.min_day && dn < n.min_day) return false;
      if (n.flag) { if (s.flags[n.flag] == null) return false; if (n.flag_days && dn - s.flags[n.flag] < n.flag_days) return false; }
      if (n.notflag && s.flags[n.notflag] != null) return false;
      if (n.men && men() < n.men) return false; if (n.bats && bats() < n.bats) return false;
      if (s.seen[e.id] != null) { if (e.once) return false; if (dn - s.seen[e.id] < rep) return false; }
      if (e.on) return false;   /* CONTENT 2: met another way (on: 'scavenge', after a search in a town's lot), never by the director */
      if ((n.party || n.raided || n.boss_sign) && !ctxOf(n, s)) return false;
      return true;
    };
    ((EV && EV.events) || []).forEach(function (e) { if (ok(e)) out.push(e); });
    if (SQ) Object.keys(SQ.quests).forEach(function (qid) { var Q = SQ.quests[qid], m = Q.meet || {}; if (s.quests[qid]) return;
      var nd = { min_day: m.min_day }; Object.keys(m.needs || {}).forEach(function (k) { nd[k] = m.needs[k]; });
      var e = { id: 'quest:' + qid, quest: qid, where: m.where, when: m.when, weight: m.weight || 3, once: true, needs: nd, on: m.on || null }; if (ok(e)) out.push(e); });
    return out;
  }
  function pickOne(list) {
    var sum = 0; list.forEach(function (e) { sum += (e.weight || 1); }); var r = Math.random() * sum;
    for (var i = 0; i < list.length; i++) { r -= (list[i].weight || 1); if (r <= 0) return list[i]; }
    return list[list.length - 1] || null;
  }
  function busy() {
    if (UP || FIGHT) return true;
    try { if (LOOP.fighting || (LOOP.frame && LOOP.frame.style.display === 'block')) return true; } catch (e) {}
    try { if (document.getElementById('meetcard')) return true; } catch (e) {}
    return false;
  }
  /* CONTENT 2: THE SCAVENGE ACTION IN A TOWN. The settlement posts its lot search ({type:'BOHEMIA_SETTLEMENT', act:'scavenge',
     place}); a side quest whose meet is on: 'scavenge' is met on the first block out of that town (the one who saw you come out of
     the lot), never the first minute, once. */
  root.addEventListener && root.addEventListener('message', function (ev) {
    var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_SETTLEMENT' || d.act !== 'scavenge') return;
    var s = st(); s.scav = { place: String(d.place || ''), day: day(), used: false }; put(s); root.__ROADEV_SCAV = s.scav;
  });
  function scavMeet(s) {
    if (!SQ || !s.scav || s.scav.used || day() - (s.scav.day | 0) > 1 || Date.now() - T0 < 60000) return false;
    var qid = Object.keys(SQ.quests).filter(function (k) { var m = SQ.quests[k].meet || {}; return m.on === 'scavenge' && !s.quests[k] && (!m.min_day || day() >= m.min_day); })[0];
    s.scav.used = true; put(s); if (!qid) return false;
    s.seen['quest:' + qid] = day(); s.met++; s.log.push({ id: 'quest:' + qid, day: day(), at: at(), on: 'scavenge' }); put(s);
    root.__ROADEV_MET = (root.__ROADEV_MET || []).concat(['quest:' + qid]);
    try { if (typeof travelInterrupt === 'function') travelInterrupt('event'); } catch (e) {}
    return questBegin(qid, { town: s.scav.place || nearTown() || 'the town' });
  }
  function step() {
    if (!EV || root.__ROADEV_OFF) return false;
    /* A SCRIPTED BROWSER IS NOT A PLAYER (CONTENT 11/2, measured: every_job_kind_gate's walks to a town stalled under a road card
       nobody in the script knew to answer, 5 of its checks red, and the trip gate's tap on the phone landed on the card). A real
       phone never runs under automation (navigator.webdriver), so on a phone the road always talks; a scripted walk meets the road
       only when it asks for it (window.__ROADEV_ON = true, as tools/bohemia_content_drive.js does); fire(id) works either way */
    try { if (root.navigator && root.navigator.webdriver && !root.__ROADEV_ON) return false; } catch (e) {}
    try { if (typeof MODE !== 'undefined' && MODE !== 'city') return false; } catch (e) {}
    if (busy()) return false;
    var s = st(), D = EV.director || {}; s.walked++;
    if (s.scav && !s.scav.used && scavMeet(s)) { s = st(); s.last = s.walked; put(s); return true; }
    var gate = Date.now() - T0 < (D.first_minute_s == null ? 60 : D.first_minute_s) * 1000 || day() < (D.first_day_min || 0)
      || s.walked - s.last < (D.gap_blocks || 22) || Math.random() >= (root.__ROADEV_CHANCE != null ? root.__ROADEV_CHANCE : (D.chance_per_block || 0.06));
    if (gate) { put(s); return false; }
    var c = candidates(s), e = pickOne(c);
    if (!e) { put(s); return false; }
    s.last = s.walked; put(s);
    return fire(e.id);
  }
  function fire(id) {
    if (!EV) return false;
    var e = null; (EV.events || []).forEach(function (x) { if (x.id === id) e = x; });
    var qid = /^quest:/.test(id) ? id.slice(6) : null;
    if (!e && !(qid && SQ && SQ.quests[qid])) return false;
    var s = st(); s.seen[id] = day(); s.met++; s.log.push({ id: id, day: day(), at: at() }); s.log = s.log.slice(-60); put(s);
    root.__ROADEV_MET = (root.__ROADEV_MET || []).concat([id]);
    try { if (typeof travelInterrupt === 'function') travelInterrupt('event'); } catch (e2) {}
    if (qid) { var Qm = SQ.quests[qid].meet || {}; questBegin(qid, ctxOf(Qm.needs, s) || { town: nearTown() || 'the next town' }); return true; }
    var who = e.who || {}, cx = ctxOf(e.needs, s) || { town: nearTown() || 'the next town' };
    card({ look: who.look, name: fill(who.name, cx), from: fill(who.from, cx), text: fill(e.says, cx), head: 'ON THE ROAD', opts: (e.opts || []).slice(0, 3).map(function (o) {
      return { t: fill(o.t, cx), tag: tagOf(o), off: !needOk(o.need), fn: function () { chose(e, o, cx); } }; }) });
    return true;
  }
  function chose(e, o, cx) {
    var who = { name: fill((e.who || {}).name, cx), look: (e.who || {}).look, from: fill((e.who || {}).from, cx) }, fx = fillFx(o.fx, cx);
    if (fx && fx.flag && cx) { var s0 = st(); s0.fctx = s0.fctx || {}; s0.fctx[fx.flag] = cx; put(s0); }   /* a chain remembers what the map said (the town, the faction) */
    var r = apply(fx, { id: e.id, name: who.name });
    var s = st(); s.log.push({ id: e.id, chose: o.t, day: day() }); s.log = s.log.slice(-60); put(s);
    root.__ROADEV_CHOSE = (root.__ROADEV_CHOSE || []).concat([{ id: e.id, t: o.t, got: r.got }]);
    happened((who.name || 'Someone') + ' on the road: ' + o.t);
    if (r.say) feed('@theroad', (who.name ? who.name + ': ' : '') + r.say);
    if (r.fight) { close(false); return; }
    if (r.quest) { close(false); questBegin(r.quest); return; }
    card({ look: who.look, name: who.name, from: who.from, text: r.say || '...', got: r.got, head: 'ON THE ROAD', opts: [{ t: 'GO ON', fn: function () { close(); } }] });
  }

  /* ======================= THE SIDE QUESTS ======================= */
  function person(Q, role, c) { var P = (Q.people && Q.people[role]) || { name: String(role).toUpperCase(), look: 'faction_homeless' };
    return c ? { name: fill(P.name, c), look: P.look, from: fill(P.from, c) } : P; }
  function qctx(qid) { try { var q = st().quests[qid]; return (q && q.ctx) || null; } catch (e) { return null; } }
  function spotFrom(x, y, b) {
    b = b || [6, 12];
    for (var i = 0; i < 48; i++) {
      var D = DIRS8[Math.floor(Math.random() * 8)], r = b[0] + Math.floor(Math.random() * (b[1] - b[0] + 1)), cx = x + D[0] * r, cy = y + D[1] * r;
      try { if (!cityWalkable(cx, cy) || loopTownAt(cx, cy, 1)) continue; if (!cityRoute(city.x, city.y, cx, cy)) continue; } catch (e) { continue; }
      return [cx, cy];
    }
    return null;
  }
  function questBegin(qid, cx) {
    var Q = SQ && SQ.quests[qid]; if (!Q) return false;
    var s = st(), w = at(); s.quests[qid] = { stage: 10, at: { x: w[0], y: w[1] }, node: Q.start, know: {}, seen: {}, spots: {}, mark: null, began: day(), ctx: cx || { town: nearTown() || 'the next town' } }; put(s);
    root.__ROADEV_QUESTS = (root.__ROADEV_QUESTS || []).concat([qid]);
    happened('Met someone on the road: ' + person(Q, Q.nodes[Q.start].who, qctx(qid)).name + '.');
    node(qid, Q.start);
    return true;
  }
  function node(qid, nid) {
    var Q = SQ.quests[qid], s = st(), q = s.quests[qid], N = Q.nodes[nid]; if (!q || !N) { close(); return; }
    q.node = nid; q.seen[nid] = 1; q.mark = null; put(s);
    var P = person(Q, N.who, q.ctx);
    var opts = N.opts.length ? N.opts.slice(0, 4).map(function (o) { return { t: o.silent ? o.t : '“' + o.t + '”', fn: function () { pick(qid, nid, o); } }; })
      : [{ t: 'Go.', fn: function () { after(qid, nid); } }];   /* draft:true: the talk ends on what the world does next */
    card({ look: P.look, name: P.name, from: P.from, text: N.says.join('\n\n'), head: String(Q.title || '').toUpperCase(), opts: opts });
  }
  function pick(qid, nid, o) {
    var Q = SQ.quests[qid], s = st(), q = s.quests[qid]; if (!q) return close();
    (o.learn || []).forEach(function (k) { q.know[k] = 1; });
    root.__ROADEV_CHOSE = (root.__ROADEV_CHOSE || []).concat([{ id: 'quest:' + qid, node: nid, t: o.t }]);
    if (o.stage != null) { q.stage = Math.max(q.stage, o.stage); put(s); var S = Q.stages[o.stage]; if (S && S.end) return done(qid, o.stage); }
    put(s);
    if (!o.to || o.to === 'END') return after(qid, nid);
    var M = Q.nodes[o.to]; if (!M) return after(qid, nid);
    if (M.who === Q.nodes[nid].who) return node(qid, o.to);
    goTo(qid, o.to);
  }
  function entryMin(e) { var m = /stage>=(\d+)/.exec(e || ''); return m ? +m[1] : null; }
  function knowsOk(e, q) { var r = /knows:([a-z_0-9]+)/g, m, ok = true; while ((m = r.exec(e || ''))) if (!q.know[m[1]]) ok = false; return ok; }
  function after(qid, nid) {
    var Q = SQ.quests[qid], s = st(), q = s.quests[qid]; if (!q) return close();
    var cur = Q.nodes[nid].who;
    if (q.stage < (Q.go || 20)) q.stage = Q.go || 20;
    put(s);
    var c = Object.keys(Q.nodes).filter(function (id) { var N = Q.nodes[id], m = entryMin(N.entry); return N.entry && !q.seen[id] && m != null && m >= (Q.go || 20) && knowsOk(N.entry, q); });
    var other = c.filter(function (id) { return Q.nodes[id].who !== cur; })[0], same = c.filter(function (id) { return Q.nodes[id].who === cur; })[0];
    var nx = other || same;
    if (!nx) { q.done = q.stage; q.end = 'LEFT'; put(s); close(); say('That one is over. Nobody pays for it.'); return; }   /* draft:true */
    if (Q.nodes[nx].who === cur) return node(qid, nx);
    goTo(qid, nx);
  }
  /* CONTENT 2: the second person waits where the map already has something: at a boss's sign (near: 'boss_sign', reading it is
     WORLD TWO's own step), by the raided town's gate (near: 'raided'), on the roaming party's road (near: 'party'); else spotFrom */
  function spotNear(q, pl) {
    var c = q.ctx || {}, x = null, y = null;
    if (pl.near === 'boss_sign') { var b = bossSign('any'); if (b) { x = b.sx; y = b.sy; } else if (c.sx != null) { x = c.sx; y = c.sy; } }
    else if (pl.near === 'party' && c.px != null) { x = c.px; y = c.py; }
    else if (pl.near === 'raided' && c.raided) { try { var bs = ctBases() || {}, k = Object.keys(bs).filter(function (n) { return n.toUpperCase().indexOf(String(c.raided).toUpperCase()) >= 0; })[0]; if (k) { x = bs[k].x | 0; y = bs[k].y | 0; } } catch (e) {} }
    if (x == null) return null;
    if (pl.near === 'boss_sign') { try { if (cityWalkable(x, y) && cityRoute(city.x, city.y, x, y)) return [x, y]; } catch (e) {} }
    return spotFrom(x, y, pl.blocks || [1, 3]);
  }
  function goTo(qid, nid) {
    var Q = SQ.quests[qid], s = st(), q = s.quests[qid], role = Q.nodes[nid].who, giver = Q.nodes[Q.start].who, pl = (Q.places && Q.places[role]) || {}, P = person(Q, role, q.ctx);
    var sp = q.spots[role] || (role === giver ? [q.at.x, q.at.y] : spotNear(q, pl) || spotFrom(q.at.x, q.at.y, pl.blocks));
    if (!sp) { put(s); return node(qid, nid); }   /* no place reachable: they are here after all, never a quest stranded */
    q.spots[role] = sp; q.node = nid; q.mark = { x: sp[0], y: sp[1], name: String(fill(pl.name, q.ctx) || P.name).toUpperCase(), act: String(pl.act || 'FIND').toUpperCase() }; put(s);
    close(false);
    var w = at(), far = cheb(sp[0], sp[1], w[0], w[1]);
    say(q.mark.act + ': ' + q.mark.name + ', ' + far + ' blocks. It is marked on the map.');   /* draft:true */
    feed('@theroad', Q.title + ': ' + q.mark.act.toLowerCase() + ', ' + q.mark.name.toLowerCase() + '.');
    try { render(); } catch (e) {}
  }
  function done(qid, n) {
    var Q = SQ.quests[qid], s = st(), q = s.quests[qid], S = Q.stages[n] || {};
    q.done = n; q.end = S.end; q.mark = null; put(s);
    var N = Q.nodes[q.node] || {}, P = person(Q, N.who || Q.nodes[Q.start].who, q.ctx);
    var r = apply(fillFx(S.fx || {}, q.ctx), { id: 'quest:' + qid, name: P.name, why: 'side quest: ' + Q.title });
    root.__ROADEV_QDONE = (root.__ROADEV_QDONE || []).concat([{ id: qid, stage: n, end: S.end, got: r.got, fight: !!r.fight }]);
    happened(Q.title + ': ' + (S.log || 'done.'));
    feed('@thecrew', S.log || (Q.title + ', done.'));   /* the quest's own @LOG line, the journal on the phone */
    if (r.fight) { close(false); return; }   /* CONTENT 2: an ending that is a fight (their blood is in its pay): the fight's own end says what it paid */
    card({ look: P.look, name: P.name, from: P.from, text: (S.log || '...') + (r.say ? '\n\n' + r.say : ''), got: r.got, head: String(Q.title || '').toUpperCase() + (S.end === 'FAIL' ? ' · OVER' : ' · DONE'), opts: [{ t: 'GO ON', fn: function () { close(); } }] });
  }
  function places() {
    var s = st(), out = []; if (!SQ) return out;
    Object.keys(s.quests).forEach(function (qid) { var q = s.quests[qid]; if (q && q.mark && q.done == null) out.push({ id: 'quest:' + qid, name: q.mark.name, act: q.mark.act, x: q.mark.x, y: q.mark.y, town: false }); });
    return out;
  }
  function here(x, y) { return places().some(function (p) { return cheb(x, y, p.x, p.y) <= 1; }); }
  function arrived(x, y) {
    if (!SQ || UP) return false; var s = st(), hit = null;
    Object.keys(s.quests).forEach(function (qid) { var q = s.quests[qid]; if (!hit && q && q.mark && q.done == null && cheb(x, y, q.mark.x, q.mark.y) <= 1) hit = qid; });
    if (!hit) return false;
    try { if (typeof travelStop === 'function') travelStop(); } catch (e) {}
    node(hit, s.quests[hit].node);
    return true;
  }
  function status() {
    var s = st();
    return { ready: !!EV && !!SQ, events: EV ? EV.events.length : 0, quests: SQ ? Object.keys(SQ.quests).length : 0, walked: s.walked, last: s.last, met: s.met,
      seen: Object.keys(s.seen), flags: s.flags, held: places(), questState: s.quests, card: !!UP, fighting: !!FIGHT };
  }
  root.BohemiaRoadEvents = { load: load, ready: function () { return !!EV && !!SQ; }, step: step, fire: fire, card: card, close: close, apply: apply, tagOf: tagOf,
    places: places, here: here, arrived: arrived, status: status, questBegin: questBegin, data: function () { return { events: EV, quests: SQ }; }, up: function () { return !!UP; },
    fighting: function () { return !!FIGHT; } };
  load();
})(typeof window !== 'undefined' ? window : this);
