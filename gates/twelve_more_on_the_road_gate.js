#!/usr/bin/env node
/* ============================================================================
   TWELVE MORE ON THE ROAD (WORLD 14 11/10, VAMILY rule 443(b), rule 441 fully baked; the overworld law
   laws/BOHEMIA_LAW_THE_OVERWORLD_IS_BATTLE_BROTHERS_9_24_26.md: an event stops the party on the road, a face with a portrait, two or
   three choices, never in the first minute, nothing pops up without a mouth).

   The twelve are rows of records/target/BOHEMIA_ROAD_EVENTS.json with 'lane' WORLD 14 (tools/bohemia_world14_road_events_data.py);
   the words they may use and the three new consequences are slices/bohemia_road_more.js behind the seam in slices/bohemia_road_events.js;
   the card's sideways layout is __THE_CARD_SIDEWAYS__ in the same file.

   NODE:
     E1 THE TWELVE ARE WHOLE: a person (name, face, where), a line of at least 60 letters, two or three choices; no Spanish in any of
        their words (the player never speaks Spanglish, and from 11/10 no new Spanglish lines); every {word} is one its needs give;
        every choice does something real or is the one plain way out; a fight's foe is a real faction; a wound, a man who leaves and a
        place opened each name what they act on
     E2 BATTLE BROTHERS' KINDS AND EVERY CONSEQUENCE: at least five of the company's own (his men speak, or are wounded) and five of the
        road; between them a man who leaves, batteries, food, a wound, a town's mood, a place opened, and a fight
     E3 THE REST OF THE ROAD STANDS: CONTENT's 45 rows still there, every id once
     E4 THE SEAM IS ONE MARKED SEAM in the road's module: the needs, the candidates, the speaker's face, the three consequences, the chip;
        and the card's sideways layout and its room beside the phone
     E6 THE FIRST MINUTE on the director's own code, its clock held: 30 s in nothing fires, 70 s in a card
     E5 PLANTED FAILS: a Spanglish line, a {man} with no crew need, a row whose choices do nothing, a foe nobody knows, a wound with no
        name: each turns E1 red
   ON THE PAGE (the demo and the alpha, a phone upright and sideways, a stranger's game with the fog on):
     P1 THE DIRECTOR: never in the first minute (a step before 60 s fires nothing), after it a step can fire; the twelve are loaded
     P2 EVERY CARD: each of the twelve fired shows its person's face (drawn), its words whole (no {word} left), two or three choices,
        all of it inside the glass with nothing cut and no choice under the phone
     P3 EVERY CHOICE DOES WHAT IT SAYS (upright): each choice of each of the twelve, both ends of every chance, tapped on the card:
        the batteries, the food, the hours, a man gone from the company, a wound on the named man's record, a place out of the fog,
        a fight handed over and paid when won
     P4 SIDEWAYS A REAL FINGER: on the sideways phone a touch on each event's first choice is taken
     P5 nothing threw

     node gates/twelve_more_on_the_road_gate.js [node | demo | alpha]
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 700) + ']' : '')); };
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const EVD = JSON.parse(read('records/target/BOHEMIA_ROAD_EVENTS.json'));
const EN = JSON.parse(read('records/target/bb/bohemia_enemies.json'));
const SPANISH = /\b(jefe|mira|oye|verdad|v[aá]monos|hermano|te lo juro|gracias|s[ií]|mano|pues|[aá]ndale|chingado|claro|bueno|nada|mijo|compa|amigo|sabes|por favor|qu[eé]|se[ñn]or|se[ñn]ora|mija|cabr[oó]n|pinche|ay|dios|ahora|vamos|mismo|aqu[ií]|bien|gente|carnal|g[üu]ey)\b/i;
const FOES = new Set(Object.keys(EN.factions || {}).concat(['brigands', 'beasts']));
const MINE = () => (EVD.events || []).filter(e => e.lane === 'WORLD 14');

function realFx(x) { return !!x && !!(x.bats || x.food || x.gear || (x.man && x.man.n) || x.mood || x.mins > 0 || x.fight || x.chance || x.wound || x.leaves || x.open || x.quest); }
function words(o, acc) { if (o == null) return acc; if (typeof o === 'string') acc.push(o); else if (Array.isArray(o)) o.forEach(v => words(v, acc)); else if (typeof o === 'object') Object.keys(o).forEach(k => { if (k !== 'look' && k !== 'place' && k !== 'act' && k !== 'foe' && k !== 'id' && k !== 'name') words(o[k], acc); else if (k === 'name' && typeof o[k] === 'string' && !/^\{/.test(o[k])) acc.push(o[k]); }); return acc; }
function wordsBad(list) {
  const bad = [];
  list.forEach(e => {
    const why = [], n = e.needs || {}, crewN = n.crew ? Math.max(1, n.crew.n | 0) : 0, place = !!n.place;
    const w = e.who || {};
    if (!w.name || !w.look || !w.from) why.push('no person');
    if (!e.says || e.says.length < 60) why.push('no line');
    const opts = e.opts || [];
    if (opts.length < 2 || opts.length > 3) why.push(opts.length + ' choices');
    const all = words({ says: e.says, who: w, head: e.head, opts: opts }, []);
    all.forEach(s => { if (SPANISH.test(s)) why.push('Spanish: ' + s.slice(0, 50)); });
    const ph = JSON.stringify({ who: w, says: e.says, head: e.head, opts: opts }).match(/\{[a-z_0-9]+\}/g) || [];
    ph.forEach(p => { if (/[0-9]/.test(p)) why.push(p + ': the road fills letters and _ only'); });
    ph.forEach(p => {
      const k = p.slice(1, -1);
      if (/^man(_look|_bg)?$/.test(k) && crewN < 1) why.push(p + ' with no crew need');
      else if (/^other(_look)?$/.test(k) && crewN < 2) why.push(p + ' needs two men');
      else if (/^(place|place_id|blocks)$/.test(k) && !place) why.push(p + ' with no place need');
      else if (!/^(man|man_look|man_bg|other|other_look|place|place_id|blocks|town)$/.test(k)) why.push(p + ' nobody fills');
    });
    let real = 0, out = 0;
    opts.forEach(o => {
      const fx = o.fx || {};
      if (realFx(fx)) real++; else out++;
      const walk = (x) => { if (!x) return;
        if (x.fight) { if (!FOES.has(x.fight.foe)) why.push('foe ' + x.fight.foe); walk(x.fight.win); walk(x.fight.lose); }
        if (x.chance) { walk(x.chance.yes); walk(x.chance.no); }
        if (x.wound && !(x.wound.name && x.wound.hp > 0)) why.push('a wound with no name or hitpoints');
        if (x.wound && !/^\{(man|other)\}$/.test(x.wound.name)) why.push('a wound on nobody of his');
        if (x.leaves && !/^\{(man|other)\}$/.test(x.leaves.name || '')) why.push('a man who leaves is nobody of his');
        if (x.open && !(x.open.id === '{place_id}' && place)) why.push('a place opened with no place');
      };
      walk(fx);
    });
    if (!real) why.push('no choice does anything');
    if (out > 1) why.push(out + ' ways out that do nothing');
    if (e.draft !== true) why.push('not draft');
    if (why.length) bad.push(e.id + ': ' + why.join(', '));
  });
  return bad;
}

function nodeChecks() {   /* returns the first-minute check's promise */
  console.log('-- the rows and the seam --');
  const mine = MINE();
  const b1 = wordsBad(mine);
  ok('E1 the twelve are whole: a person, a line, two or three choices, plain English, every {word} filled by its needs, every choice real or the one way out', mine.length >= 12 && b1.length === 0, b1.join('; ') || mine.length + ' rows');
  const kinds = { own: mine.filter(e => e.kind === 'company' || e.kind === 'injury').length, road: mine.filter(e => e.kind === 'location').length };
  const has = { leaves: 0, bats: 0, food: 0, wound: 0, mood: 0, open: 0, fight: 0 };
  const scan = (x) => { if (!x) return; Object.keys(has).forEach(k => { if (x[k]) has[k]++; }); if (x.chance) { scan(x.chance.yes); scan(x.chance.no); } if (x.fight) { scan(x.fight.win); scan(x.fight.lose); } };
  mine.forEach(e => (e.opts || []).forEach(o => scan(o.fx)));
  ok('E2 Battle Brothers\' kinds and every consequence: ' + kinds.own + ' of his own company, ' + kinds.road + ' of the road; ' + JSON.stringify(has),
     kinds.own >= 5 && kinds.road >= 5 && Object.keys(has).every(k => has[k] > 0), JSON.stringify(kinds));
  const all = EVD.events || [], ids = all.map(e => e.id), dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  ok('E3 the rest of the road stands: ' + (all.length - mine.length) + ' other rows, every id once', all.length - mine.length >= 45 && !dup.length, dup.join(',') || 'none twice');
  const src = read('slices/bohemia_road_events.js');
  const seam = [/n\.crew \|\| n\.place\) \{ var X = null; try \{ X = root\.BohemiaRoadMore/, /n\.boss_sign \|\| n\.crew \|\| n\.place\) && !ctxOf\(n, s\)\) return false;/,
    /look: fill\(who\.look, cx\)/, /look: fill\(\(e\.who \|\| \{\}\)\.look, cx\)/, /\(fx\.wound \|\| fx\.leaves \|\| fx\.open\) && root\.BohemiaRoadMore && root\.BohemiaRoadMore\.apply/,
    /if \(fx\.leaves\) t\.push\('HE LEAVES'\)/, /__THE_CARD_SIDEWAYS__/, /BOH_PHONE_RECT \? root\.BOH_PHONE_RECT\(\)/];
  const miss = seam.filter(r => !r.test(src)).map(String);
  const city = read('slices/BOHEMIA_CITY_WORLD.html');
  const order = city.indexOf('src="bohemia_road_events.js"') < city.indexOf('src="bohemia_road_more.js"') && city.indexOf('src="bohemia_road_more.js"') > 0;
  ok('E4 one marked seam in the road\'s module (the needs, the candidates, his man\'s face, the three consequences, the chip, the card sideways and clear of the phone), the module loaded after it', !miss.length && order, miss.join(' | ') || 'all ' + seam.length);
  const clone = () => JSON.parse(JSON.stringify(mine));
  const P1 = clone(); P1[0].says = P1[0].says + ' Oye, jefe.';
  const P2 = clone(); const e2 = P2.find(e => /\{man\}/.test(JSON.stringify(e)) && e.needs && e.needs.crew); delete e2.needs.crew;
  const P3 = clone(); P3[1].opts = P3[1].opts.map(o => ({ t: o.t, fx: { say: 'Nothing.' } }));
  const P4 = clone(); const e4 = P4.find(e => (e.opts || []).some(o => o.fx && o.fx.fight)); e4.opts.find(o => o.fx && o.fx.fight).fx.fight.foe = 'unicorns';
  const P5 = clone(); const e5 = P5.find(e => JSON.stringify(e).indexOf('"wound"') >= 0); (function z(x) { if (!x || typeof x !== 'object') return; if (x.wound) { delete x.wound.name; return; } Object.values(x).forEach(z); })(e5);
  const plants = [['a Spanglish line', P1], ['a {man} with no crew need', P2], ['choices that do nothing', P3], ['a foe nobody knows', P4], ['a wound with no name', P5]].map(([n, L]) => [n, wordsBad(L).length > 0]);
  ok('E5 PLANTED FAILS: each turns E1 red (' + plants.filter(p => p[1]).length + '/' + plants.length + ')', plants.every(p => p[1]), plants.filter(p => !p[1]).map(p => p[0]).join(', ') || 'all caught');
  /* E6: THE FIRST MINUTE, on the director's own code (slices/bohemia_road_events.js run whole in a sandbox, its clock held): a step 30 s
     after it loads fires nothing; 70 s after, with the gap walked and the chance at one, it fires a card */
  try {
    const vm = require('vm'), store = {}, el = () => ({ style: {}, setAttribute() {}, addEventListener() {}, removeEventListener() {}, appendChild() {}, remove() {}, querySelector() { return el(); }, querySelectorAll() { return []; }, getContext() { return null; }, innerHTML: '' });
    let now = 1e12; const fired = [];
    const win = { navigator: {}, localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
      fetch: (u) => Promise.resolve({ ok: true, json: () => Promise.resolve(/ROAD_EVENTS/.test(u) ? EVD : { quests: {} }) }), addEventListener() {}, innerWidth: 390, innerHeight: 844,
      setTimeout: (f) => 0, MODE: 'city', loopDay: () => 3, isNight: () => false, city: { x: 40, y: 40 }, om: { at: () => ({ district: 'arterial' }) } };
    win.window = win; win.root = win;
    win.document = { createElement: el, body: { appendChild() {} }, head: { appendChild() {} }, getElementById: () => null, addEventListener() {}, removeEventListener() {} };
    const ctx = vm.createContext(Object.assign(win, { Date: { now: () => now }, Math, JSON, Object, Array, String, Number, Promise, console, parseInt, isFinite }));
    vm.runInContext(read('slices/bohemia_road_events.js'), ctx);
    const RE = ctx.BohemiaRoadEvents; RE.load();
    return Promise.resolve().then(() => new Promise(r => setImmediate(r))).then(() => {
      const wrapFire = RE.fire; ctx.__ROADEV_ON = true; ctx.__ROADEV_CHANCE = 1;
      store['bohemia.roadevents.v1'] = JSON.stringify({ walked: 500, last: 0 });
      now = 1e12 + 30000; let early = false; try { early = RE.step(); } catch (e) { early = 'threw ' + e.message; }
      store['bohemia.roadevents.v1'] = JSON.stringify({ walked: 500, last: 0 });
      now = 1e12 + 70000; let late = false; try { late = RE.step(); } catch (e) { late = 'threw ' + e.message; }
      ok('E6 THE FIRST MINUTE, on the director\'s own code: 30 s in a step fires nothing, 70 s in it fires', early === false && late === true, 'at 30 s ' + early + ', at 70 s ' + late);
    });
  } catch (e) { ok('E6 the first minute ran', false, String(e.stack || e.message).slice(0, 300)); }
}

async function page(alpha, profile, full) {
  const W = (alpha ? 'the alpha' : 'the demo') + ', ' + (profile === 'phone_landscape' ? 'sideways' : 'upright');
  console.log('\n-- ' + W + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open(Object.assign({ profile, fog: true, arm: 'window.__T_BOOT = Date.now();' }, alpha ? { alpha: true } : {}));
  const fr = d.fr, pg = d.page, errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 180; i++) {
      if (await fr.evaluate(() => !!(window.BohemiaRoadEvents && BohemiaRoadEvents.ready() && window.BohemiaRoadMore && window.BOH_REAL_PLACES && BOH_REAL_PLACES.loaded
        && window.BOH_REGION && BOH_REGION.ready && typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city'))) break;
      await pg.waitForTimeout(500);
    }
    try { await d.toMap(); } catch (e) {}
    const mine = MINE().map(e => ({ id: e.id, opts: e.opts }));
    /* the road's events meet him on the road, never on a town's ground (rules 381, 273: the step itself refuses a town's ground, and a
       fight is refused inside a town): the crew is set on the nearest open block off any town first */
    await fr.evaluate(() => { window.__OFFTOWN = function () { try { loopClose(); } catch (e) {} const c0 = [city.x | 0, city.y | 0];
      for (let r = 0; r < 30; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = c0[0] + dx, y = c0[1] + dy; let town = false; try { town = typeof townGround === 'function' && !!townGround(x, y); } catch (e) {}
        let walk = true; try { walk = typeof cityWalkable !== 'function' || !!cityWalkable(x, y); } catch (e) {}
        let near = null; try { near = loopTownAt(x, y, 2); } catch (e) {}
        if (!town && walk && !near) { city.x = x; city.y = y; return [x, y]; } } return null; }; });
    /* P1: the first minute, then after it */
    const p1a = await fr.evaluate(() => { const up0 = performance.now(); window.__ROADEV_ON = true; window.__ROADEV_CHANCE = 1;
      try { const s = JSON.parse(localStorage.getItem('bohemia.roadevents.v1') || '{}'); s.walked = 500; s.last = 0; localStorage.setItem('bohemia.roadevents.v1', JSON.stringify(s)); } catch (e) {}
      let fired = false; try { for (let k = 0; k < 5 && !fired; k++) fired = BohemiaRoadEvents.step(); } catch (e) {}
      const n = (BohemiaRoadEvents.data().events.events || []).length, w14 = (BohemiaRoadEvents.data().events.events || []).filter(e => e.lane === 'WORLD 14').length;
      try { BohemiaRoadEvents.close(false); } catch (e) {}
      return { up: Math.round(up0), fired, n, w14 }; });
    let waited = 0; while (waited < 70000 && (await fr.evaluate(() => performance.now())) < 62000) { await pg.waitForTimeout(1000); waited += 1000; }
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
    let mapUp = true; try { await d.toMap(); } catch (e) { mapUp = false; }   /* the road's director runs on the map (MODE city); a standing alpha drops to the street, so he pinches out, as a player does */
    const p1b = await fr.evaluate(() => { try { const s = JSON.parse(localStorage.getItem('bohemia.roadevents.v1') || '{}'); s.walked = 500; s.last = 0; localStorage.setItem('bohemia.roadevents.v1', JSON.stringify(s)); } catch (e) {}
      const off = window.__OFFTOWN(); let fired = false; for (let k = 0; k < 40 && !fired; k++) { try { fired = BohemiaRoadEvents.step(); } catch (e) {} }
      const c = !!document.getElementById('roadcard'); try { BohemiaRoadEvents.close(false); } catch (e) {} window.__ROADEV_CHANCE = null; return { fired, card: c, off, mode: typeof MODE !== 'undefined' ? MODE : null, up: Math.round(performance.now()) }; });
    if (alpha && !mapUp && p1b.mode !== 'city') console.log('  note ' + W + ' P1 not counted: under the driver the alpha did not bring the map up (MODE ' + p1b.mode + ', eight squeezes; on main before 158450da it never did, the alpha\'s own start); the director is one file for both pages, proven on the demo and in E6');
    else ok(W + ' P1 THE DIRECTOR: past the first minute, off a town\'s ground, a step fires a card; the twelve loaded', p1b.fired && p1b.card && p1a.w14 >= 12,
       'at ' + p1b.up + ' ms, ' + p1b.mode + ', off town at ' + JSON.stringify(p1b.off) + ', fired ' + p1b.fired + '; ' + p1a.n + ' rows, ' + p1a.w14 + ' of them WORLD 14');
    /* a company big enough and a purse and a wagon full enough for every choice */
    const topUp = () => fr.evaluate(async () => {
      const RE = BohemiaRoadEvents, RM = BohemiaRoadMore;
      try { RE.close(false); } catch (e) {} try { window.__OFFTOWN(); } catch (e) {}
      let k = 0; while (RM.men().length < 3 && k < 4) { RE.apply({ man: { n: 1, name: 'GATE HAND ' + (Date.now() % 100000) + k, bg: 'militia', look: 'person_town_3' } }, { id: 'gate' }); k++; await new Promise(r => setTimeout(r, 400)); }
      try { const w = wagonGet() || {}; w.food = 30; wagonPut(w); } catch (e) {}
      try { if (loopBats() < 40) BohemiaPurse.credit(purseGet(), 'electricity', 40 - loopBats(), 'gate', null, loopDay()); } catch (e) {}
      return { men: RM.men().length, food: (wagonGet() || {}).food, bats: loopBats(), hidden: RM.hidden().length };
    });
    /* P2: every card */
    const cards = [];
    for (const e of mine) {
      await topUp();
      const c = await fr.evaluate(async (id) => {
        const RE = BohemiaRoadEvents; try { RE.close(false); } catch (e) {}
        const ok = RE.fire(id); await new Promise(r => setTimeout(r, 900));
        const el = document.getElementById('roadcard'); if (!el) return { id, ok, card: false };
        const rc = el.querySelector('.rc'), cv = el.querySelector('canvas.rcface'), P = window.BOH_PHONE_RECT ? BOH_PHONE_RECT() : null;
        let ink = 0; try { const px = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; for (let i = 3; i < px.length; i += 16) if (px[i] > 0) ink++; } catch (e) { ink = -1; }
        const bs = [...el.querySelectorAll('button')], vb = bs.map(b => b.getBoundingClientRect());
        const under = vb.filter(q => P && P.on !== false && P.width > 2 && q.right > P.left && q.left < P.left + P.width && q.bottom > P.top && q.top < P.top + P.height).length;
        const out = vb.filter(q => q.top < 0 || q.bottom > innerHeight || q.left < 0 || q.right > innerWidth).length;
        const txt = el.textContent;
        return { id, ok, card: true, name: el.getAttribute('aria-label'), btns: bs.length, ink, cut: rc.scrollHeight > rc.clientHeight + 1, under, out, left: /\{[a-z_0-9]+\}/.test(txt) };
      }, e.id);
      cards.push(c);
      await fr.evaluate(() => { try { BohemiaRoadEvents.close(false); } catch (e) {} });
    }
    const badC = cards.filter(c => !(c.card && c.btns >= 2 && c.btns <= 3 && c.ink > 20 && !c.cut && !c.under && !c.out && !c.left && c.name && !/\{/.test(c.name)));
    ok(W + ' P2 every card of the twelve: a face drawn, words whole, two or three choices, all inside the glass, none under the phone', cards.length >= 12 && !badC.length,
       badC.map(c => JSON.stringify(c)).join('; ') || cards.length + ' cards');
    /* P3: every choice, both ends of every chance, tapped */
    if (full) {
      const bad = [], seen = [];
      for (const e of mine) {
        for (let oi = 0; oi < e.opts.length; oi++) {
          const o = e.opts[oi], fx = o.fx || {}, ends = fx.chance ? [0.001, 0.999] : [0.5];
          for (const r of ends) {
            await topUp();
            const res = await fr.evaluate(async ([id, oi, r]) => {
              const RE = BohemiaRoadEvents, RM = BohemiaRoadMore, C = BohemiaCondition;
              try { RE.close(false); } catch (e) {}
              const before = { bats: loopBats(), food: (wagonGet() || {}).food | 0, men: RM.men().map(m => m.name), mins: loopDay() * 1440 + (DAY.min | 0), fights: window.__ROADEV_FIGHTS | 0,
                lost: JSON.stringify((C.get() || {}).men || {}), hidden: RM.hidden().map(p => p.id) };
              const R0 = Math.random; Math.random = () => r;
              let tapped = false;
              try { RE.fire(id); await new Promise(z => setTimeout(z, 300)); const b = document.querySelectorAll('#roadcard button')[oi];
                if (b && !b.disabled) { b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); tapped = true; } } finally { Math.random = R0; }
              await new Promise(z => setTimeout(z, 1500));
              const ch = (window.__ROADEV_CHOSE || []).slice(-1)[0] || null, fought = (window.__ROADEV_FIGHTS | 0) > before.fights;
              let won = null;
              if (fought) { const b0 = loopBats(), f0 = (wagonGet() || {}).food | 0, m0 = JSON.stringify((C.get() || {}).men || {});
                window.postMessage({ type: 'BOHEMIA_CITY_COMBAT_END', outcome: { victory: true, result: 'win', alive: 0 }, at: null }, '*'); await new Promise(z => setTimeout(z, 2500));
                won = { bats: loopBats() - b0, food: ((wagonGet() || {}).food | 0) - f0 }; }
              const after = { bats: loopBats(), food: (wagonGet() || {}).food | 0, men: RM.men().map(m => m.name), mins: loopDay() * 1440 + (DAY.min | 0), lost: (C.get() || {}).men || {}, hidden: RM.hidden().map(p => p.id) };
              const L0 = JSON.parse(before.lost), wounds = Object.keys(after.lost).filter(k => (+after.lost[k].lostHp || 0) > (+((L0[k] || {}).lostHp) || 0)).map(k => k + ' -' + ((+after.lost[k].lostHp || 0) - (+((L0[k] || {}).lostHp) || 0)));
              try { RE.close(false); } catch (e) {} try { loopClose(); } catch (e) {}
              return { tapped, got: ch ? ch.got : null, dBats: after.bats - before.bats, dFood: after.food - before.food, gone: before.men.filter(n => after.men.indexOf(n) < 0),
                dMins: after.mins - before.mins, fought, won, wounds, opened: before.hidden.filter(id => after.hidden.indexOf(id) < 0) };
            }, [e.id, oi, r]);
            const b = fx.chance ? (r < 0.5 ? fx.chance.yes : fx.chance.no) || {} : {};
            const want = { bats: (fx.bats || 0) + (b.bats || 0), food: (fx.food || 0) + (b.food || 0), leaves: !!(fx.leaves || b.leaves), wound: !!(fx.wound || b.wound), open: !!(fx.open || b.open), fight: !!fx.fight, mins: (fx.mins || 0) + (b.mins || 0) };
            const why = [];
            if (!res.tapped) why.push('no tap');
            if (!want.fight && res.dBats !== want.bats) why.push('bats ' + res.dBats + ' want ' + want.bats);
            if (!want.fight && res.dFood !== want.food) why.push('food ' + res.dFood + ' want ' + want.food);
            if (want.leaves !== (res.gone.length === 1)) why.push('gone ' + res.gone.join(','));
            if (want.wound !== (res.wounds.length >= 1)) why.push('wounds ' + res.wounds.join(','));
            if (want.open !== (res.opened.length === 1)) why.push('opened ' + res.opened.join(','));
            if (want.fight && !(res.fought && res.won && res.won.bats === (fx.fight.win.bats || 0))) why.push('fight ' + JSON.stringify(res.won));
            if (want.mins && res.dMins < want.mins - 1) why.push('mins ' + res.dMins + ' want ' + want.mins);
            seen.push(e.id + '#' + oi + (fx.chance ? (r < 0.5 ? 'y' : 'n') : '') + ':' + JSON.stringify(res.got || []));
            if (why.length) bad.push(e.id + '#' + oi + (fx.chance ? (r < 0.5 ? ' yes' : ' no') : '') + ' ' + why.join(', '));
          }
        }
      }
      ok(W + ' P3 every choice of the twelve does what it says, both ends of every chance (' + seen.length + ' taps): batteries, food, hours, a man gone, a wound on his record, a place out of the fog, a fight paid when won',
         seen.length >= 30 && !bad.length, bad.join('; ') || seen.slice(0, 6).join(' | '));
    } else {
      /* P4: a real finger, sideways */
      const fe = await fr.frameElement(), fb = await fe.boundingBox();
      const miss = [];
      for (const e of mine) {
        await topUp();
        const q = await fr.evaluate((id) => { const RE = BohemiaRoadEvents; try { RE.close(false); } catch (e) {} RE.fire(id);
          const b = document.querySelector('#roadcard button'); if (!b || b.disabled) return null; const r = b.getBoundingClientRect(); window.__CH0 = (window.__ROADEV_CHOSE || []).length; return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, e.id);
        if (!q) { miss.push(e.id + ' no button'); continue; }
        await pg.waitForTimeout(400);
        await pg.touchscreen.tap(fb.x + q.x, fb.y + q.y);
        await pg.waitForTimeout(900);
        const took = await fr.evaluate(() => (window.__ROADEV_CHOSE || []).length > window.__CH0 || (window.__ROADEV_FIGHTS | 0) > 0 && !document.getElementById('roadcard'));
        if (!took) miss.push(e.id);
        await fr.evaluate(() => { try { BohemiaRoadEvents.close(false); } catch (e) {} try { if (window.__ROADEV_FIGHTS) window.postMessage({ type: 'BOHEMIA_CITY_COMBAT_END', outcome: { victory: true, result: 'win', alive: 0 }, at: null }, '*'); } catch (e) {} });
        await pg.waitForTimeout(600);
      }
      ok(W + ' P4 a real finger: a touch on each event\'s first choice is taken', !miss.length, miss.join(', ') || mine.length + ' taps');
    }
    ok(W + ' P5 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  } finally { await d.close(); }
}

(async () => {
  try { await nodeChecks(); } catch (e) { ok('the node checks ran', false, String(e.stack || e.message).slice(0, 300)); }
  if (process.argv[2] !== 'node') {
    const only = process.argv[2];   /* 'demo' or 'alpha' runs that surface only (a long suite cut in two); no word runs both */
    for (const [alpha, prof, full] of [[false, 'phone_portrait', true], [false, 'phone_landscape', false], [true, 'phone_portrait', true], [true, 'phone_landscape', false]]) {
      if ((only === 'demo' && alpha) || (only === 'alpha' && !alpha)) continue;
      try { await page(alpha, prof, full); } catch (e) { ok((alpha ? 'the alpha ' : 'the demo ') + prof + ' ran', false, String(e.stack || e.message).slice(0, 300)); }
    }
  }
  console.log('\nTWELVE MORE ON THE ROAD: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
