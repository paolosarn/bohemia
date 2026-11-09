#!/usr/bin/env node
/* ============================================================================
   THE PLACES GET THEIR USE (WORLD 14 11/8, VAMILY rule 436(b), ask line 521; rules 409(c), 429(b)(h), 430)

   The coordinator 11/8: 'the lab the beasts broke out of and the bank with its vault first, then the unemployment office and the
   hardware store; each a real Las Vegas place at its real spot, each with a use (a job, a scavenge, a home base, a fight) and its
   fight answer in WORLD 13's table'. WORLD TEN (11/6) seated them; this holds what WORLD 14 gave them: each place's visit (the
   person there talks, two or three choices with real costs, records/target/bb/real_places.json 'visit', slices/bohemia_place_visits.js)
   and its fight answer (records/target/bb/map_fight_kinds.json 'places').

   IN NODE:
     U1 THE VISITS ARE WHOLE: the lab, the bank, the jobs office and both home centres each have a visit: a person (a name, a face,
        where), their line in Spanglish (the valley's people speak it), two or three choices in plain English (the player does not),
        exactly one WALK IN; every other choice does something real (batteries, food, gear, a man, a town's mood, time, a fight, a
        chance) and says when it goes (once, once won, every N days, per man); a fight's foe is a real faction, a gear id a real
        weapon, a hire's background a real background; draft
     U2 AT THE REAL SPOT, ON EVERY VALLEY: 24 seeds x the four turned valleys (rule 344), the bank, the office and the two home
        centres each on its own block of its own kind, within 14 blocks of its real spot
     U3 ON THE ROAD NETWORK (429(h)): each fronts a road block (a 4-neighbour of the mile streets, the Strip, the beltway, the freeways)
        and that road is the valley's ONE network (the biggest joined body of road), on every valley
     U4 THE LAB ON ITS LAND: the region's own land puts the lab within 2.5 blocks of its real coordinates, on standable ground,
        reachable on foot
     U5 THE FIGHT ANSWER: WORLD 13's table carries a row for each of the five, well formed (a storeys mix summing to 1, a known man,
        cover and blocks), fronting a street, and agreeing with its kind's own row (class, building, storeys); the lab's row stands
        though it has no valley kind
     U6 PLANTED FAILS: a visit with no WALK IN, a foe nobody knows, a choice that does nothing, a player line in Spanglish, a place
        cut off from the network, the lab's row taken out, the bank's row disagreeing with its kind: each turns its check red
   ON THE DEMO AND THE ALPHA (his link; rule 438: it works on HIS surface), the one driver, phone upright:
     U7  arriving at each of the five shows the person and their choices (never the town screen first)
     U8  WALK IN opens the place's own screen
     U9  THE BANK'S BOXES: eight hours on the clock, batteries paid, the choice gone; the second arrival the same day walks straight in
     U10 THE LAB'S PENS: the fight is handed over with the lab's wolves as beasts; a loss keeps the pen, a win pays and closes it
     U11 THE LINE: the man at the front joins (his name, his trade), two nights of food spent; four days on, a different man and the
         card again
     U12 THE HOME CENTRE'S BACK ROOM pays (batteries); U12b a choice he cannot pay for says what it needs (rule 438)
     U13 THE LAB READS AS A LAB: the region paints it from the file's compound look, and a dirt track joins it to a road
     U14 every face the visits name is a face the face engine draws
     U15 MUTATION: the visits off, arriving opens the town screen straight away; a scripted browser that did not ask meets no card
     U16 nothing threw

     node gates/the_places_get_their_use_gate.js [node]
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const RP = JSON.parse(read('records/target/bb/real_places.json'));
const FK = JSON.parse(read('records/target/bb/map_fight_kinds.json'));
const EN = JSON.parse(read('records/target/bb/bohemia_enemies.json'));
const WE = JSON.parse(read('records/target/bb/weapons.json'));
const BG = JSON.parse(read('records/target/bb/backgrounds.json'));
const FOUR = ['the_lab', 'the_bank', 'the_unemployment_office', 'the_home_center_east', 'the_home_center_west'];
const VALLEY4 = FOUR.filter(id => id !== 'the_lab');
const ROAD = { freeway: 1, arterial: 1, strip: 1, beltway: 1, interchange: 1 };
const SPANISH = /\b(jefe|mira|oye|verdad|v[aá]monos|hermano|te lo juro|gracias|s[ií]|mano|pues|ándale|andale|chingado|claro|bueno|nada|mijo|compa|amigo|por favor|qu[eé])\b/i;
const MAN = ['in_or_roof', 'in', 'roof', 'open', 'none'], COVER = ['full', 'half', 'none'];
const BLOCKS = ['walls', 'fence', 'water', 'cliff', 'rows', 'barrier', 'rail'];

/* ---- U1: the visits (a pure check over a list, so a plant can run through it) ---- */
function visitsBad(places) {
  const foes = new Set(Object.keys(EN.factions || {}).concat(['brigands', 'beasts']));
  const weapons = new Set((WE.rows || WE.weapons || WE).map(w => w.id));
  const bgs = new Set((BG.rows || []).map(b => b.id));
  const bad = [];
  FOUR.forEach(id => {
    const p = places.find(q => q.id === id), why = [];
    if (!p) { bad.push(id + ': gone'); return; }
    const v = p.visit;
    if (!v) { bad.push(id + ': no visit'); return; }
    if (v.draft !== true) why.push('not draft');
    const men = v.line && v.line.length ? v.line : [null];
    men.forEach(m => {
      const f = (x) => (m && typeof x === 'string') ? x.replace(/\{(name|says|look|bg|yes)\}/g, (a, k) => m[k] != null ? String(m[k]) : a) : x;
      const who = v.who || {}, nm = f(who.name), lk = f(who.look), says = f(v.says);
      if (!nm || /\{/.test(nm) || !lk || /\{/.test(lk) || !who.from) why.push('a person with no name, face or place');
      if (!says || /\{/.test(says) || says.length < 40) why.push('no line');
      else if (!SPANISH.test(says)) why.push('the line is not Spanglish: ' + says.slice(0, 40));
      if (m && m.bg && !bgs.has(m.bg)) why.push('no background ' + m.bg);
    });
    const opts = v.opts || [];
    if (opts.length < 2 || opts.length > 3) why.push(opts.length + ' choices');
    if (opts.filter(o => o['in']).length !== 1) why.push(opts.filter(o => o['in']).length + ' WALK IN');
    opts.forEach(o => {
      if (!o.id || !o.t) { why.push('a choice with no words'); return; }
      if (SPANISH.test(o.t)) why.push('the player speaks Spanglish: ' + o.t);
      if (o['in']) return;
      if (!(o.once === true || o.once === 'won' || o.every_days > 0 || o.per_man)) why.push(o.id + ' never goes');
      const fx = o.fx || {};
      const real = (x) => !!x && (x.bats || x.food || x.gear || (x.man && x.man.n) || x.mood || x.mins > 0 || x.fight || x.chance);
      if (!real(fx)) why.push(o.id + ' does nothing');
      if (fx.fight) {
        if (!foes.has(fx.fight.foe)) why.push(o.id + ' fights ' + fx.fight.foe + ', a foe nobody knows');
        if (!real(fx.fight.win) && !(fx.fight.win && fx.fight.win.flag)) why.push(o.id + ' a win pays nothing');
        if (o.once !== 'won') why.push(o.id + ' a fight that goes before it is won');
      }
      const gears = [fx.gear, fx.fight && fx.fight.win && fx.fight.win.gear, fx.chance && fx.chance.yes && fx.chance.yes.gear].filter(Boolean);
      gears.forEach(g => { if (g !== -1 && !weapons.has(g)) why.push(o.id + ' gear ' + g + ' is no weapon'); });
      if (fx.man && fx.man.n > 0 && !(o.per_man && v.line)) why.push(o.id + ' a man from nowhere');
    });
    if (why.length) bad.push(id + ': ' + why.join(', '));
  });
  return bad;
}

/* ---- U5: the fight answers ---- */
function rowsBad(J) {
  const P = (J.places && J.places.rows) || {}, D = J.districts || {}, bad = [];
  FOUR.forEach(id => {
    const r = P[id]; if (!r) { bad.push(id + ': no row'); return; }
    const why = [];
    const s = r.storeys || {}, sum = Object.keys(s).reduce((a, k) => a + (+s[k] || 0), 0);
    if (Math.abs(sum - 1) > 1e-6 || Object.keys(s).some(k => ['1', '2', '3'].indexOf(k) < 0)) why.push('storeys ' + JSON.stringify(s));
    if (MAN.indexOf(r.man) < 0) why.push('man ' + r.man);
    if (COVER.indexOf(r.cover) < 0 || COVER.indexOf(r.open_cover) < 0) why.push('cover');
    if (!Array.isArray(r.blocks) || r.blocks.some(b => BLOCKS.indexOf(b) < 0)) why.push('blocks');
    if (r.street_front !== true) why.push('no street in front');
    if (!r.is || !r.building || !r['class']) why.push('words');
    if (r.kind) { const d = D[r.kind];
      if (!d) why.push('kind ' + r.kind + ' has no row');
      else ['class', 'building'].forEach(f => { if (d[f] !== r[f]) why.push(f + ' ' + r[f] + ' against its kind\'s ' + d[f]); });
      if (d && JSON.stringify(d.storeys) !== JSON.stringify(r.storeys)) why.push('storeys against its kind\'s'); }
    else if (id !== 'the_lab') why.push('no kind');
    if (why.length) bad.push(id + ': ' + why.join(', '));
  });
  return bad;
}

/* ---- U3: the one network ---- */
function network(m) {
  const N = m.n || 96, comp = new Int32Array(N * N).fill(-1), sizes = [];
  const isR = (x, y) => { if (x < 0 || y < 0 || x >= N || y >= N) return false; const t = m.at(x, y); return !!(t && ROAD[t.district]); };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (comp[y * N + x] >= 0 || !isR(x, y)) continue;
    const c = sizes.length; let n = 0; const st = [[x, y]]; comp[y * N + x] = c;
    while (st.length) { const [a, b] = st.pop(); n++;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const u = a + dx, v = b + dy; if (isR(u, v) && comp[v * N + u] < 0) { comp[v * N + u] = c; st.push([u, v]); } }); }
    sizes.push(n);
  }
  let big = 0; sizes.forEach((s, i) => { if (s > sizes[big]) big = i; });
  return { on: (x, y) => x >= 0 && y >= 0 && x < N && y < N && comp[y * N + x] === big, share: sizes.length ? sizes[big] / sizes.reduce((a, b) => a + b, 0) : 0 };
}
function frontsNetwork(m, net, R) {
  return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => net.on(R.x + dx, R.y + dy));
}

function nodeChecks() {
  console.log('-- the data, the valleys, the table --');
  const places = RP.places || [];
  const b1 = visitsBad(places);
  ok('U1 the visits are whole: ' + FOUR.length + ' places, each a person in Spanglish, 2 or 3 choices in plain English, one WALK IN, each choice real and going, real foes, gear and trades', b1.length === 0, b1.join('; ') || 'all ' + FOUR.length);

  const OM = require(path.join(ROOT, 'engine', 'bohemia_overmap.js'));
  const TW_ = require(path.join(ROOT, 'engine', 'bohemia_towns.js')), FG = require(path.join(ROOT, 'engine', 'BOHEMIA_faction_graph.json')), CE = require(path.join(ROOT, 'engine', 'bohemia_cityedit.js'));
  const SEEDS = [1337, 42, 99, 7, 8, 77, 555, 2024, 31337, 123456, 1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 16];
  const TURNS = [null, { ns: true }, { ew: true }, { ns: true, ew: true }];
  const lost = [], far = [], cut = []; let valleys = 0, worst = 0, minShare = 1, planted = null;
  for (const T of TURNS) for (const seed of SEEDS) {
    globalThis.VALLEY_TURN = T; const m = OM.buildOvermap(seed); valleys++;
    const seats = TW_.derive(FG, TW_.districtsOf(m, CE.cat), 1);
    const foot = t => { const k = t.tier === 'fortress' ? 4 : t.tier === 'town' ? 3 : 2; return { x0: t.x - (k >> 1), y0: t.y - (k >> 1), n: k }; };
    OM.restampRealPlaces(m, (x, y) => seats.some(t => { const f = foot(t); return x >= f.x0 - 1 && x <= f.x0 + f.n && y >= f.y0 - 1 && y <= f.y0 + f.n; }));
    const got = {}; (m.layout.realPlaces || []).forEach(R => { if (R.x != null) got[R.id] = R; });
    const net = network(m); minShare = Math.min(minShare, net.share);
    VALLEY4.forEach(id => {
      const p = places.find(q => q.id === id), R = got[id];
      if (!R) { lost.push(seed + ':' + id + ' unseated'); return; }
      const t = m.at(R.x, R.y); if (!t || t.district !== p.kind) lost.push(seed + ':' + id + ' is ' + (t && t.district));
      const dd = Math.max(Math.abs(R.x - R.want[0]), Math.abs(R.y - R.want[1])); worst = Math.max(worst, dd); if (dd > 14) far.push(seed + ':' + id + ' ' + dd);
      if (!frontsNetwork(m, net, R)) cut.push(seed + (T ? JSON.stringify(T) : '') + ':' + id);
    });
    if (!planted && seed === 1337 && !T) {   /* U6's plant: the bank's road blocks turned to desert, the bank cut off */
      const R = got.the_bank, at0 = m.at.bind(m), dead = new Set([[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => (R.x + dx) + ',' + (R.y + dy)));
      const mm = { n: m.n, at: (x, y) => dead.has(x + ',' + y) ? { district: 'desert' } : at0(x, y) };
      planted = !frontsNetwork(mm, network(mm), R);
    }
  }
  globalThis.VALLEY_TURN = null;
  ok('U2 at the real spot on every valley: ' + VALLEY4.length + ' places x ' + valleys + ' valleys (24 seeds, four turns), each its own kind, the worst ' + worst + ' blocks off', lost.length === 0 && far.length === 0, lost.concat(far).slice(0, 6).join('; ') || 'none lost');
  ok('U3 on the one road network (429(h)): each fronts a road of the valley\'s biggest joined network on every valley (that network is at least ' + Math.round(minShare * 100) + '% of all road)', cut.length === 0 && minShare > 0.5, cut.slice(0, 6).join('; ') || 'all ' + VALLEY4.length * valleys);

  const LAND = JSON.parse(read('engine/BOHEMIA_REGION_LAND.json'));
  const lab = places.find(p => p.id === 'the_lab'), q = LAND.places.find(x => x.name === lab.name);
  let u4 = !!q, w4 = 'not on the land';
  if (q) { const N = LAND.N, kmLon = 111.32 * Math.cos(LAND.origin.lat * Math.PI / 180);
    const fx = (N - 1) / 2 + (lab.lon - LAND.origin.lon) * kmLon * 1000 / LAND.metresPerCell, fy = (N - 1) / 2 - (lab.lat - LAND.origin.lat) * 111.0 * 1000 / LAND.metresPerCell;
    const off = Math.max(Math.abs(fx - (q.x + 0.5)), Math.abs(fy - (q.y + 0.5)));
    u4 = off <= 2.5 && q.hours != null; w4 = lab.name + ' at ' + q.x + ',' + q.y + ', ' + off.toFixed(1) + ' blocks off its real spot, ' + q.hours + ' h on foot'; }
  ok('U4 the lab on its land: at the fossil beds\' real coordinates, reachable on foot', u4, w4);

  const b5 = rowsBad(FK);
  ok('U5 the fight answer: WORLD 13\'s table has a row for each of the five, well formed, a street in front, agreeing with its kind\'s row (the lab its own)', b5.length === 0, b5.join('; ') || 'all ' + FOUR.length);

  /* U6: the plants */
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const P1 = clone(places); P1.find(p => p.id === 'the_bank').visit.opts = P1.find(p => p.id === 'the_bank').visit.opts.filter(o => !o['in']);
  const P2 = clone(places); P2.find(p => p.id === 'the_lab').visit.opts[0].fx.fight.foe = 'unicorns';
  const P3 = clone(places); P3.find(p => p.id === 'the_home_center_east').visit.opts[0].fx = { say: 'Nothing.' };
  const P4 = clone(places); P4.find(p => p.id === 'the_unemployment_office').visit.opts[0].t = 'Órale, take him on, jefe.';
  const J1 = clone(FK); delete J1.places.rows.the_lab;
  const J2 = clone(FK); J2.places.rows.the_bank.storeys = { '1': 1 };
  const plants = [['no WALK IN', visitsBad(P1).length > 0], ['a foe nobody knows', visitsBad(P2).length > 0], ['a choice that does nothing', visitsBad(P3).length > 0],
    ['the player in Spanglish', visitsBad(P4).length > 0], ['a place cut off from the network', planted === true], ['the lab\'s row taken out', rowsBad(J1).length > 0],
    ['the bank\'s row against its kind', rowsBad(J2).length > 0]];
  ok('U6 PLANTED FAILS: each turns its check red (' + plants.filter(p => p[1]).length + '/' + plants.length + ')', plants.every(p => p[1]), plants.filter(p => !p[1]).map(p => p[0]).join(', ') || 'all caught');
}

async function demo(alpha) {
  const W = alpha ? 'the alpha' : 'the demo';
  console.log('\n-- ' + W + ', phone upright --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open(Object.assign({ profile: 'phone_portrait', arm: 'window.__PLACE_VISITS_ON = true;' }, alpha ? { alpha: true } : {}));
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 180; i++) {
      if (await fr.evaluate(() => !!(window.BOH_REAL_PLACES && BOH_REAL_PLACES.loaded && window.BohemiaPlaceVisits && window.BohemiaRoadEvents && BohemiaRoadEvents.card
        && window.BOH_REGION && BOH_REGION.ready && typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city'))) break;
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(1200);
    try { await d.toMap(); } catch (e) {}
    const want = FOUR;
    const r = await fr.evaluate(async (want) => {
      const PV = BohemiaPlaceVisits, RE = BohemiaRoadEvents, out = { arrive: {}, faces: [], errs: [] };
      const wait = (ms) => new Promise(z => setTimeout(z, ms));
      const townOf = (id) => { if (id === 'the_lab') { const L = BOH_REGION.places.find(p => p.name === 'TULE SPRINGS LAB'); return L ? { x: L.x, y: L.y } : null; }
        const c = BOH_REAL_PLACES.cellsNow().find(c => c.id === id); return c ? { x: c.x, y: c.y } : null; };
      const arrive = (id) => { try { RE.close(false); } catch (e) {} try { loopClose(); } catch (e) {}
        const s = townOf(id); if (!s) return { none: true }; city.x = s.x; city.y = s.y;
        const t = loopTownAt(s.x, s.y, 1); loopOpenTown(t);
        const card = document.getElementById('roadcard');
        return { t: t && t.name, card: !!card, name: card ? card.getAttribute('aria-label') : null,
          btns: card ? [...card.querySelectorAll('button')].map(b => b.textContent) : [], screen: LOOP.open ? LOOP.open.name : null }; };
      PV.reset();
      const w = wagonGet() || {}; w.food = Math.max(w.food | 0, 12); wagonPut(w);
      for (const id of want) out.arrive[id] = arrive(id);
      /* U8: walk in */
      out.arrive2 = arrive('the_bank');
      PV.choose('the_bank', 'in', loopTownAt(townOf('the_bank').x, townOf('the_bank').y, 1));
      out.walkIn = LOOP.open ? { name: LOOP.open.name, real: LOOP.open.real } : null;
      /* U9: the boxes (a new day, so the card shows again) */
      PV.reset(); try { loopClose(); } catch (e) {}
      out.bank = {}; out.bank.card = arrive('the_bank').card;
      const clock = () => loopDay() * 1440 + (DAY.min | 0);
      const b0 = loopBats(), c0 = clock(), d0 = loopDay();
      const res = PV.choose('the_bank', 'boxes');
      out.bank.paid = loopBats() - b0; out.bank.got = res && res.got; out.bank.left = PV.options('the_bank').map(o => o.id);
      out.bank.days = loopDay() - d0; out.bank.mins = clock() - c0;
      try { RE.close(false); } catch (e) {}
      out.bank.again = arrive('the_bank');
      /* U10: the pens, a loss then a win, through the fight's own end */
      out.lab = { card: arrive('the_lab').card };
      const fight = async (win) => { PV.choose('the_lab', 'pens'); const lf = PV.lastFight; await wait(2500);
        const b = loopBats(), f = (wagonGet() || {}).food | 0;
        window.postMessage({ type: 'BOHEMIA_CITY_COMBAT_END', outcome: win ? { victory: true, result: 'win', alive: 0 } : { victory: false, result: 'loss', alive: 3 }, at: null }, '*');
        await wait(1500); return { lf, bats: loopBats() - b, food: ((wagonGet() || {}).food | 0) - f, left: PV.options('the_lab').map(o => o.id) }; };
      out.lab.loss = await fight(false);
      try { RE.close(false); } catch (e) {} try { loopClose(); } catch (e) {}
      PV.state && (function(){ const s = PV.state(); s.seen = {}; localStorage.setItem('bohemia.placevisits.v1', JSON.stringify(s)); })();
      arrive('the_lab');
      out.lab.win = await fight(true);
      /* U11: the line */
      try { RE.close(false); } catch (e) {} try { loopClose(); } catch (e) {}
      const h0 = JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]').length, f0 = (wagonGet() || {}).food | 0;
      out.line = { first: arrive('the_unemployment_office') };
      const hr = PV.choose('the_unemployment_office', 'hire'); await wait(1500);
      const H = JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]');
      out.line.joined = H.length - h0; out.line.who = H.length ? [H[H.length - 1].name, H[H.length - 1].background] : null; out.line.food = ((wagonGet() || {}).food | 0) - f0;
      out.line.left = PV.options('the_unemployment_office').map(o => o.id);
      try { RE.close(false); } catch (e) {}
      const dl = loopDay(); for (let k = 0; k < 40 && loopDay() < dl + 4; k++) { try { advance(12 * 60); } catch (e) { out.errs.push('advance ' + e.message); break; } }
      out.line.days = loopDay() - dl;
      out.line.later = arrive('the_unemployment_office');
      /* U12b: a choice he cannot pay for says what it needs (rule 438: never a silent button) */
      PV.reset(); try { RE.close(false); } catch (e) {} try { loopClose(); } catch (e) {}
      { const w2 = wagonGet() || {}; out.poorWas = w2.food | 0; w2.food = 0; wagonPut(w2);
        const a2 = arrive('the_unemployment_office'); out.poor = a2.btns; w2.food = out.poorWas; wagonPut(w2); }
      /* U12: the home centre's back room */
      PV.reset(); try { RE.close(false); } catch (e) {}
      arrive('the_home_center_east'); const hb = loopBats(); PV.choose('the_home_center_east', 'back'); out.hw = { paid: loopBats() - hb, left: PV.options('the_home_center_east').map(o => o.id) };
      try { RE.close(false); } catch (e) {}
      /* U13: the lab's look and its track */
      const L = BOH_REGION.places.find(p => p.name === 'TULE SPRINGS LAB');
      out.look = { trade: vbRegionTrade(L), file: PV.tradeOf ? PV.tradeOf(L.name) : null };
      try { if (BOH_REGION.drawRoads) { render(); } } catch (e) {}
      /* U14: the faces */
      const looks = []; BOH_REAL_PLACES.list.forEach(p => { if (!p.visit) return; if (p.visit.line) p.visit.line.forEach(m => looks.push(m.look)); else looks.push(p.visit.who.look); });
      for (let k = 0; k < 40 && !(window.BohemiaCrewFaces && BohemiaCrewFaces.has); k++) await wait(250);
      out.faces = looks.map(l => [l, !!(window.BohemiaCrewFaces && BohemiaCrewFaces.has(l))]);
      /* U15: off, and a script that did not ask */
      PV.reset(); PV.ON = false; out.off = arrive('the_bank'); PV.ON = true;
      PV.reset(); window.__PLACE_VISITS_ON = false; out.scripted = arrive('the_bank'); window.__PLACE_VISITS_ON = true;
      try { RE.close(false); } catch (e) {} try { loopClose(); } catch (e) {}
      out.err = PV.err;
      return out;
    }, want);
    const A = r.arrive;
    const badA = FOUR.filter(id => !(A[id] && A[id].card && !A[id].screen && A[id].btns.length >= 2 && A[id].btns.length <= 3 && A[id].btns.some(b => /^Walk in\./i.test(b))));
    ok(W + ' U7 arriving at each of the five shows the person and their choices, never the town screen first', badA.length === 0, badA.map(id => id + ' ' + JSON.stringify(A[id])).join('; ') || FOUR.map(id => A[id].btns.length).join(','));
    ok(W + ' U8 WALK IN opens the place\'s own screen', r.walkIn && r.walkIn.name === 'THE BANK', JSON.stringify(r.walkIn));
    const B = r.bank;
    ok(W + ' U9 THE BANK\'S BOXES: eight hours, batteries paid (8 or 2), the choice gone, the second arrival that day walks straight in', B.card && (B.paid === 8 || B.paid === 2) && B.left.indexOf('boxes') < 0 && !B.again.card && B.again.screen === 'THE BANK' && B.mins >= 470,
       JSON.stringify({ paid: B.paid, got: B.got, mins: B.mins, days: B.days, left: B.left, again: B.again.card ? 'card' : B.again.screen }));
    const Lb = r.lab;
    ok(W + ' U10 THE LAB\'S PENS: the lab\'s wolves as beasts; a loss keeps the pen, a win pays 6 batteries and 3 food and closes it',
       Lb.card && Lb.loss.lf && Lb.loss.lf.faction === 'wolves' && Lb.loss.lf.beast === true && Lb.loss.left.indexOf('pens') >= 0 && Lb.win.bats === 6 && Lb.win.food === 3 && Lb.win.left.indexOf('pens') < 0,
       JSON.stringify({ fight: Lb.loss.lf, loss: [Lb.loss.bats, Lb.loss.food, Lb.loss.left.join('/')], win: [Lb.win.bats, Lb.win.food, Lb.win.left.join('/')] }));
    const Ln = r.line;
    ok(W + ' U11 THE LINE: the man at the front joins with his trade for two nights of food; four days on a different man and the card again',
       Ln.first.card && Ln.joined === 1 && Ln.who && /^NUMBER \d+/.test(Ln.who[0]) && Ln.who[1] && Ln.food === -2 && Ln.later.card && Ln.later.name && Ln.later.name !== Ln.who[0],
       JSON.stringify({ joined: Ln.joined, who: Ln.who, food: Ln.food, days: Ln.days, later: Ln.later.name, laterCard: Ln.later.card }));
    ok(W + ' U12b a choice he cannot pay for says what it needs, never a silent button (rule 438)', (r.poor || []).some(b => /Take him on.*NEED 2 FOOD/.test(b)), JSON.stringify(r.poor));
    ok(W + ' U12 THE HOME CENTRE\'S BACK ROOM pays batteries (3 or 1) and is searched once', (r.hw.paid === 3 || r.hw.paid === 1) && r.hw.left.indexOf('back') < 0, JSON.stringify(r.hw));
    const tracks = await fr.evaluate(() => { try { const L = BOH_REGION.places.find(p => p.name === 'TULE SPRINGS LAB'); const T = BOH_REGION.tracks ? BOH_REGION.tracks() : null; return { ro: BOH_REGION.roadsOut || null, road: BOH_REGION.passAt ? BOH_REGION.passAt(L.x, L.y) : null }; } catch (e) { return { err: e.message }; } });
    ok(W + ' U13 THE LAB READS AS A LAB: painted from the file\'s compound look; it stands on a road or the region gives it a dirt track', r.look.trade === r.look.file && r.look.trade === 'prison' && tracks.ro && (tracks.road === 1 || tracks.ro.tracks >= 1),
       JSON.stringify(r.look) + ' ' + JSON.stringify(tracks));
    const noFace = r.faces.filter(f => !f[1]);
    ok(W + ' U14 every face the visits name is one the face engine draws', r.faces.length >= 9 && noFace.length === 0, noFace.map(f => f[0]).join(',') || r.faces.length + ' faces');
    ok(W + ' U15 MUTATION: the visits off, the bank opens straight away; a scripted browser that did not ask meets no card', !r.off.card && r.off.screen === 'THE BANK' && !r.scripted.card && r.scripted.screen === 'THE BANK',
       JSON.stringify({ off: r.off.screen, scripted: r.scripted.screen }));
    ok(W + ' U16 nothing threw', errs.length === 0 && !r.err && !r.errs.length, errs.slice(0, 2).join(' | ') + (r.err || '') + r.errs.join(','));
  } finally { await d.close(); }
}

(async () => {
  try { nodeChecks(); } catch (e) { ok('the node checks ran', false, String(e.stack || e.message).slice(0, 300)); }
  if (process.argv[2] !== 'node') for (const alpha of [false, true]) { try { await demo(alpha); } catch (e) { ok((alpha ? 'the alpha' : 'the demo') + ' ran', false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nTHE PLACES GET THEIR USE: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
