#!/usr/bin/env node
/* THE ROAD KNOWS HIS PLACE, HIS BOSSES AND HIS JOBS (WORLD 14, 11/11; the coordinator's round, batch two; the overworld law: an event
   stops the party on the road, a face with a portrait, two or three choices, never in the first minute, nothing pops up without a mouth;
   rule 441: proven on the real page, alpha and demo, phone both ways).

   Twelve rows of records/target/BOHEMIA_ROAD_EVENTS.json (lane WORLD 14, tools/bohemia_world14_road_events_data.py) that touch HIS
   PLACE (HOME BASE: a gift through its own seam, BohemiaHomeMap.give), THE BOSSES (the next boss's sign read: found, his place out of
   the dark, BohemiaHisMap.readSign; a found boss's men on the road; a fallen boss's leaderless crew) and HIS JOBS (the client's town
   remembers what he chose). Read by slices/bohemia_road_more.js behind the marked seam in slices/bohemia_road_events.js.

     K1 the twelve are whole: a person, a line, two or three choices, plain English, every {word} filled by its needs, EVERY CHOICE
        COSTS SOMETHING (batteries, food, hours, a fight, a chance, or a town's goodwill)
     K2 the three subjects, four each: his place (a gift in a choice), the bosses (a sign read, a found boss, a fallen one), his jobs (the
        client's town hears)
     K3 the seam: the needs, the two new consequences, the chip, the map memory's own reading of a sign
     K4 PLANTED FAILS: a choice that costs nothing, a {home} with no home need, a gift with no kind, a boss found with no sign to read,
        a Spanglish line: each turns K1 red
   On the page (the demo and the alpha), a phone upright and sideways, with his place planted, a boss's sign up, a boss found and one
   fallen, and a job he holds (each the game's own way: HOME BASE's plantAt, the map memory's placeSign, the board's take):
     P1 each subject's events are candidates only when their state is true (no job held: no job event; no sign: no find)
     P2 every card: a face drawn, words whole, two or three choices, inside the glass, none under the phone
     P3 (upright) every choice tapped, both ends of every chance: batteries, food, hours paid as written; a gift stands at (or waits for)
        his place; the boss is found and his place out of the dark; the client's town hears; a man joins; a wound on his record; a
        fight paid when won
     P4 (sideways) a real finger on each card's first choice is taken
     P5 nothing threw
   Run: node gates/the_road_knows_his_place_gate.js [node|demo|alpha] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 700) + ']' : '')); };
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const EVD = JSON.parse(read('records/target/BOHEMIA_ROAD_EVENTS.json'));
const EN = JSON.parse(read('records/target/bb/bohemia_enemies.json'));
const SPANISH = /\b(jefe|mira|oye|verdad|v[aá]monos|hermano|te lo juro|gracias|s[ií]|mano|pues|[aá]ndale|chingado|claro|bueno|nada|mijo|compa|amigo|sabes|por favor|qu[eé]|se[ñn]or|se[ñn]ora|mija|cabr[oó]n|pinche|ay|dios|ahora|vamos|mismo|aqu[ií]|bien|gente|carnal|g[üu]ey)\b/i;
const FOES = new Set(Object.keys(EN.factions || {}).concat(['brigands', 'beasts']));
const NEXT12 = ['ev_the_family_at_the_door', 'ev_the_solar_cart', 'ev_the_water_tank', 'ev_the_seed_library', 'ev_the_runaway_cook', 'ev_the_assessors_map',
  'ev_the_roadblock', 'ev_the_leaderless', 'ev_the_clients_runner', 'ev_the_rival_crew', 'ev_the_underpass', 'ev_the_letter_for_the_client'];
const MINE = () => (EVD.events || []).filter(e => e.lane === 'WORLD 14' && NEXT12.indexOf(e.id) >= 0);
const BAD_MOOD = { negotiation_fail: 1, minor_offensive_action: 1, offensive_action: 1, attack_them: 1 };
function costs(x) { return !!x && ((x.bats | 0) < 0 || (x.food | 0) < 0 || (x.mins | 0) > 0 || !!x.fight || !!x.chance || !!x.wound || !!(x.mood && BAD_MOOD[x.mood.act])); }
function words(o, acc) { if (o == null) return acc; if (typeof o === 'string') acc.push(o); else if (Array.isArray(o)) o.forEach(v => words(v, acc)); else if (typeof o === 'object') Object.keys(o).forEach(k => { if (k !== 'look' && k !== 'place' && k !== 'act' && k !== 'foe' && k !== 'id' && k !== 'build' && k !== 'kind') words(o[k], acc); }); return acc; }
function rowsBad(list) {
  const bad = [];
  list.forEach(e => {
    const why = [], n = e.needs || {}, w = e.who || {};
    if (!w.name || !w.look || !w.from) why.push('no person');
    if (!e.says || e.says.length < 60) why.push('no line');
    const opts = e.opts || [];
    if (opts.length < 2 || opts.length > 3) why.push(opts.length + ' choices');
    words({ says: e.says, who: w, head: e.head, opts: opts }, []).forEach(s => { if (SPANISH.test(s)) why.push('Spanish: ' + s.slice(0, 50)); });
    const ph = JSON.stringify({ who: w, says: e.says, head: e.head, opts: opts }).match(/\{[a-z_0-9]+\}/g) || [];
    ph.forEach(p => { const k = p.slice(1, -1);
      if (/[0-9]/.test(k)) why.push(p + ': letters and _ only');
      else if (/^home(_blocks)?$/.test(k) && !n.home) why.push(p + ' with no home need');
      else if (/^boss(_place|_blocks)?$/.test(k) && !n.boss) why.push(p + ' with no boss need');
      else if (/^job(_from|_pay)?$/.test(k) && !n.job) why.push(p + ' with no job need');
      else if (/^man(_look|_bg)?$/.test(k) && !n.crew) why.push(p + ' with no crew need');
      else if (!/^(home|home_blocks|boss|boss_place|boss_blocks|job|job_from|job_pay|man|man_look|man_bg|town)$/.test(k)) why.push(p + ' nobody fills'); });
    opts.forEach((o, i) => {
      const fx = o.fx || {};
      if (!costs(fx)) why.push('choice ' + (i + 1) + ' costs nothing');
      const walk = (x) => { if (!x) return;
        if (x.fight) { if (!FOES.has(x.fight.foe)) why.push('foe ' + x.fight.foe); walk(x.fight.win); walk(x.fight.lose); }
        if (x.chance) { walk(x.chance.yes); walk(x.chance.no); }
        if (x.home && !(x.home.kind && x.home.name && /^(prize|trophy|build|person)$/.test(x.home.kind) && (x.home.kind !== 'build' || x.home.build))) why.push('a gift with no kind, name or build');
        if (x.boss && x.boss.find && !(n.boss && n.boss.sign)) why.push('a boss found with no sign to read');
        if (x.wound && !/^\{(man|other)\}$/.test(x.wound.name || '')) why.push('a wound on nobody of his');
        if (x.mood && /\{job_from\}/.test(x.mood.place || '') && !n.job) why.push('a job town with no job');
      };
      walk(fx);
    });
    if (e.draft !== true) why.push('not draft');
    if (why.length) bad.push(e.id + ': ' + why.join(', '));
  });
  return bad;
}

function nodeChecks() {
  console.log('-- the rows and the seam --');
  const mine = MINE(), b1 = rowsBad(mine);
  ok('K1 the twelve are whole: a person, a line, two or three choices, plain English, every {word} filled by its needs, every choice costs something', mine.length === 12 && !b1.length, b1.join('; ') || mine.length + ' rows');
  const any = (e, f) => (e.opts || []).some(o => { let hit = false; (function z(x) { if (!x || typeof x !== 'object' || hit) return; if (f(x)) { hit = true; return; } Object.values(x).forEach(z); })(o.fx); return hit; });
  const home = mine.filter(e => e.needs && e.needs.home && any(e, x => !!x.home)), boss = mine.filter(e => e.needs && e.needs.boss),
    job = mine.filter(e => e.needs && e.needs.job && any(e, x => !!(x.mood && /\{job_from\}/.test(x.mood.place || ''))));
  const bs = { sign: boss.filter(e => e.needs.boss.sign && any(e, x => !!(x.boss && x.boss.find))).length, found: boss.filter(e => e.needs.boss.found).length, fallen: boss.filter(e => e.needs.boss.fallen).length };
  ok('K2 the three subjects: his place ' + home.length + ' (a gift in a choice), the bosses ' + boss.length + ' (a sign read ' + bs.sign + ', a found boss ' + bs.found + ', a fallen one ' + bs.fallen + '), his jobs ' + job.length + ' (the client\'s town hears)',
     home.length >= 4 && boss.length >= 4 && bs.sign >= 1 && bs.found >= 1 && bs.fallen >= 1 && job.length >= 3 && mine.filter(e => e.needs && e.needs.job).length >= 4);
  const ev = read('slices/bohemia_road_events.js'), rm = read('slices/bohemia_road_more.js'), hm = read('slices/bohemia_his_map.js');
  const seam = [[ev, /n\.crew \|\| n\.place \|\| n\.home \|\| n\.boss \|\| n\.job\) \{ var X = null;/], [ev, /n\.place \|\| n\.home \|\| n\.boss \|\| n\.job\) && !ctxOf\(n, s\)\) return false;/],
    [ev, /fx\.home \|\| fx\.boss\) && root\.BohemiaRoadMore && root\.BohemiaRoadMore\.apply/], [ev, /if \(fx\.home\) t\.push\('FOR YOUR PLACE'\)/],
    [rm, /M\.give\(o\)/], [rm, /H\.readSign\(\)/], [rm, /function homeNow\(\)/], [rm, /function bossNow\(want\)/], [rm, /function jobNow\(\)/],
    [hm, /__THE_ROAD_MORE__[\s\S]{0,300}readSign: function \(\) \{ if \(!S \|\| !S\.boss \|\| !S\.boss\.sign\) return null;/]];
  const miss = seam.filter(([s, r]) => !r.test(s)).map(([, r]) => String(r).slice(0, 60));
  ok('K3 the seam: the needs, the two new consequences (a gift through HOME BASE\'s seam, a sign read the map memory\'s own way), the chip', !miss.length, miss.join(' | ') || 'all ' + seam.length);
  const clone = () => JSON.parse(JSON.stringify(mine));
  const P1 = clone(); P1[1].opts[1].fx = { say: 'For nothing.', home: P1[1].opts[1].fx.home };
  const P2 = clone(); delete P2.find(e => e.needs && e.needs.home && /\{home\}/.test(JSON.stringify(e))).needs.home;
  const P3 = clone(); P3.find(e => e.needs && e.needs.home).opts.forEach(o => { if (o.fx.home) delete o.fx.home.kind; });
  const P4 = clone(); P4.find(e => e.needs && e.needs.boss && e.needs.boss.sign).needs.boss = { found: true };
  const P5 = clone(); P5[0].says += ' Gracias, mijo.';
  const plants = [['a choice that costs nothing', P1], ['a {home} with no home need', P2], ['a gift with no kind', P3], ['a boss found with no sign', P4], ['a Spanglish line', P5]].map(([n, L]) => [n, rowsBad(L).length > 0]);
  ok('K4 PLANTED FAILS: each turns K1 red (' + plants.filter(p => p[1]).length + '/' + plants.length + ')', plants.every(p => p[1]), plants.filter(p => !p[1]).map(p => p[0]).join(', ') || 'all caught');
}

async function page(alpha, profile, full) {
  const W = (alpha ? 'the alpha' : 'the demo') + ', ' + (profile === 'phone_landscape' ? 'sideways' : 'upright');
  console.log('\n-- ' + W + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open(Object.assign({ profile, fog: true }, alpha ? { alpha: true } : {}));
  const fr = d.fr, pg = d.page, errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 180; i++) {
      if (await fr.evaluate(() => !!(window.BohemiaRoadEvents && BohemiaRoadEvents.ready() && window.BohemiaRoadMore && window.BohemiaHomeMap && window.BohemiaHisMap && BohemiaHisMap.state && BohemiaHisMap.state()
        && window.BohemiaBosses && BohemiaBosses.data && BohemiaBosses.data() && window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaPhoneBoard
        && typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city'))) break;
      await pg.waitForTimeout(500);
    }
    try { await d.toMap(); } catch (e) {}
    const mine = MINE().map(e => ({ id: e.id, needs: e.needs, opts: e.opts }));
    await fr.evaluate(() => { window.__ROADEV_ON = true;
      window.__OFFTOWN = function () { try { loopClose(); } catch (e) {} const c0 = [city.x | 0, city.y | 0];
        for (let r = 0; r < 30; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const x = c0[0] + dx, y = c0[1] + dy; let town = false; try { town = typeof townGround === 'function' && !!townGround(x, y); } catch (e) {}
          let walk = true; try { walk = typeof cityWalkable !== 'function' || !!cityWalkable(x, y); } catch (e) {}
          let near = null; try { near = loopTownAt(x, y, 2); } catch (e) {}
          if (!town && walk && !near) { city.x = x; city.y = y; return [x, y]; } } return null; };
      /* the moods the road hands a town, heard where the game hears them (BohemiaJobKinds.settleJob) */
      const S0 = BohemiaJobKinds.settleJob; window.__MOODS = [];
      BohemiaJobKinds.settleJob = function (j, act) { try { window.__MOODS.push({ from: j && j.from, act }); } catch (e) {} return S0.apply(this, arguments); }; });
    /* P1: nothing true, no candidate; each state the game's own way */
    /* a forced fire() shows any card whatever its needs (the gate's own hand); the director asks the needs through the seam (K3), and
       the needs are this module's: BohemiaRoadMore.ctx says no while the state is false and yes once it is true */
    const cand = () => fr.evaluate((rows) => { const out = {}; rows.forEach(r => { let c = null; try { c = BohemiaRoadMore.ctx(r.needs || {}); } catch (e) {} out[r.id] = !!c; }); return out; }, MINE().map(e => ({ id: e.id, needs: e.needs })));
    const was = await fr.evaluate(() => { const S = BohemiaHisMap.state(), H = BohemiaHomeMap.state(); return { sign: !!(S.boss && S.boss.sign), found: Object.keys((S.boss && S.boss.found) || {}).length > 0, fallen: Object.keys((S.boss && S.boss.fallen) || {}).length > 0, job: (LOOP.held || []).length > 0, planted: !!(H && H.planted) }; });
    const before = await cand();
    const setUp = await fr.evaluate(async () => {
      const o = {};
      window.__OFFTOWN();
      /* his place: HOME BASE's own plant, on the block he stands on or the nearest it takes */
      const H = BohemiaHomeMap; let pl = null; const c = [city.x | 0, city.y | 0];
      for (let r = 0; r < 12 && !(pl && pl.ok); r++) for (let dy = -r; dy <= r && !(pl && pl.ok); dy++) for (let dx = -r; dx <= r && !(pl && pl.ok); dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; try { pl = H.plantAt(c[0] + dx, c[1] + dy); } catch (e) {} }
      o.planted = !!(H.state() && H.state().planted); o.home = H.state() && H.state().name;
      window.__OFFTOWN();
      /* a boss's sign: the map memory's own placing */
      const M = BohemiaHisMap, S = M.state(); let sg = !!S.boss.sign;
      /* the map memory places a sign on a street near him; where he stands may have none: a few blocks on, as he would walk */
      for (let t = 0; t < 8 && !S.boss.sign; t++) { try { sg = M.placeSign(); } catch (e) {} if (!S.boss.sign) { city.x = (city.x | 0) + 6; city.y = (city.y | 0) + (t % 2 ? 6 : -6); window.__OFFTOWN(); } }
      if (!S.boss.sign) { /* none placed in eight streets: the sign the game would place, from the next boss's own record (his ground) */
        try { const nx = M.next(), g = nx && BohemiaBosses.ground(nx.n), at = g && g.at; if (nx && at) S.boss.sign = { n: nx.n, x: city.x | 0, y: city.y | 0, boss: { x: at[0], y: at[1] }, made: 'gate' }; } catch (e) {} }
      o.sign = S.boss.sign ? S.boss.sign.n : null; window.__SIGN = S.boss.sign ? JSON.parse(JSON.stringify(S.boss.sign)) : null;
      /* a job he holds: the board's own take, at its town */
      const A = (BohemiaPhoneBoard.asks() || []).slice(0, 8); let took = false;
      for (const a of A) { if (took) break; try { LOOP.open = { name: a.place, x: a.x, y: a.y, tier: a.tier }; took = !!loopTakeContract({ id: a.id, title: a.title, pay: a.pay, skulls: a.skulls }); } catch (e) {} LOOP.open = null; }
      o.job = (LOOP.held || []).map(j => j.title + ' @ ' + j.from)[0] || null;
      window.__OFFTOWN();
      return o; });
    /* the sign up as placed (the game may read it itself the moment the crew stands on it: then the boss is found, as it should be) */
    await fr.evaluate(() => { const S = BohemiaHisMap.state(), sg = window.__SIGN; if (!sg) return; delete (S.boss.found || {})[sg.n]; S.boss.sign = JSON.parse(JSON.stringify(sg)); });
    const after = await cand();
    const subj = id => MINE().find(e => e.id === id).needs;
    const wrongBefore = NEXT12.filter(id => { const n = subj(id); if (!before[id]) return false;
      return (n.job && !was.job) || (n.home && n.home.planted && !was.planted) || (n.boss && ((n.boss.sign && !was.sign) || (n.boss.found && !was.found) || (n.boss.fallen && !was.fallen))); });
    const shouldNow = NEXT12.filter(id => { const n = subj(id); return !(n.boss && (n.boss.found || n.boss.fallen)); });
    const missNow = shouldNow.filter(id => !after[id]);
    ok(W + ' P1 an event is a candidate only when its state is true: before (' + JSON.stringify(was) + ') ' + wrongBefore.length + ' fired that should not; after the place planted, a sign up and a job taken, ' + (shouldNow.length - missNow.length) + '/' + shouldNow.length + ' fire',
       !wrongBefore.length && !missNow.length && setUp.planted && setUp.sign && setUp.job, JSON.stringify(setUp) + (wrongBefore.length ? ' WRONG ' + wrongBefore.join(',') : '') + (missNow.length ? ' MISSING ' + missNow.join(',') : ''));
    /* the boss states each event needs, set for its turn and taken back after (the map memory's own record) */
    const bossState = (want) => fr.evaluate((want) => { const S = BohemiaHisMap.state(), sg = window.__SIGN; if (!sg) return false; const n = sg.n;
      S.boss.found = S.boss.found || {}; S.boss.fallen = S.boss.fallen || {}; delete S.boss.found[n]; delete S.boss.fallen[n]; S.boss.sign = null;
      if (want === 'sign') S.boss.sign = JSON.parse(JSON.stringify(sg));
      if (want === 'found' || want === 'fallen') S.boss.found[n] = { x: sg.boss.x, y: sg.boss.y };
      if (want === 'fallen') S.boss.fallen[n] = 1;
      return true; }, want);
    const topUp = () => fr.evaluate(async () => {
      const RE = BohemiaRoadEvents, RM = BohemiaRoadMore;
      try { RE.close(false); } catch (e) {} try { window.__OFFTOWN(); } catch (e) {}
      let k = 0; while (RM.men().length < 3 && k < 4) { RE.apply({ man: { n: 1, name: 'GATE HAND ' + (Date.now() % 100000) + k, bg: 'militia', look: 'person_town_3' } }, { id: 'gate' }); k++; await new Promise(r => setTimeout(r, 400)); }
      try { const w = wagonGet() || {}; w.food = 30; wagonPut(w); } catch (e) {}
      try { if (loopBats() < 40) BohemiaPurse.credit(purseGet(), 'electricity', 40 - loopBats(), 'gate', null, loopDay()); } catch (e) {}
    });
    const stateFor = (n) => n.boss ? (n.boss.sign ? 'sign' : n.boss.found ? 'found' : 'fallen') : null;
    /* P2: every card */
    const cards = [];
    for (const e of mine) {
      await topUp(); if (e.needs.boss) await bossState(stateFor(e.needs));
      const c = await fr.evaluate(async (id) => {
        const RE = BohemiaRoadEvents; try { RE.close(false); } catch (e) {}
        const fired = RE.fire(id); await new Promise(r => setTimeout(r, 900));
        const el = document.getElementById('roadcard'); if (!el) return { id, fired, card: false };
        const rc = el.querySelector('.rc'), cv = el.querySelector('canvas.rcface'), P = window.BOH_PHONE_RECT ? BOH_PHONE_RECT() : null;
        let ink = 0; try { const px = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; for (let i = 3; i < px.length; i += 16) if (px[i] > 0) ink++; } catch (e) { ink = -1; }
        const bs = [...el.querySelectorAll('button')], vb = bs.map(b => b.getBoundingClientRect());
        const under = vb.filter(q => P && P.on !== false && P.width > 2 && q.right > P.left && q.left < P.left + P.width && q.bottom > P.top && q.top < P.top + P.height).length;
        const out = vb.filter(q => q.top < 0 || q.bottom > innerHeight || q.left < 0 || q.right > innerWidth).length;
        return { id, fired, card: true, name: el.getAttribute('aria-label'), btns: bs.length, ink, cut: rc.scrollHeight > rc.clientHeight + 1, under, out, left: /\{[a-z_0-9]+\}/.test(el.textContent) };
      }, e.id);
      cards.push(c);
      await fr.evaluate(() => { try { BohemiaRoadEvents.close(false); } catch (e) {} });
    }
    const badC = cards.filter(c => !(c.card && c.btns >= 2 && c.btns <= 3 && c.ink > 20 && !c.cut && !c.under && !c.out && !c.left && c.name && !/\{/.test(c.name)));
    ok(W + ' P2 every card of the twelve: a face drawn, words whole, two or three choices, inside the glass, none under the phone', cards.length === 12 && !badC.length, badC.map(c => JSON.stringify(c)).join('; ') || cards.length + ' cards');
    if (full) {
      /* P3: every choice, both ends of every chance */
      const bad = [], seen = [];
      for (const e of mine) {
        for (let oi = 0; oi < e.opts.length; oi++) {
          const o = e.opts[oi], fx = o.fx || {}, ends = fx.chance ? [0.001, 0.999] : [0.5];
          for (const r of ends) {
            await topUp(); if (e.needs.boss) await bossState(stateFor(e.needs));
            const res = await fr.evaluate(async ([id, oi, r]) => {
              const RE = BohemiaRoadEvents, RM = BohemiaRoadMore, C = BohemiaCondition, HM = BohemiaHomeMap, S = BohemiaHisMap.state();
              try { RE.close(false); } catch (e) {}
              const hs0 = HM.state(), sg = S.boss.sign;
              const b4 = { bats: loopBats(), food: (wagonGet() || {}).food | 0, men: RM.men().map(m => m.name), mins: loopDay() * 1440 + (DAY.min | 0), fights: window.__ROADEV_FIGHTS | 0,
                lost: JSON.stringify((C.get() || {}).men || {}), things: (hs0.things || []).length + (hs0.waiting || []).length + (hs0.residents || []).length, moods: window.__MOODS.length,
                found: Object.keys(S.boss.found || {}).length, hid: sg && sg.boss ? fogHides(sg.boss.x, sg.boss.y) : null };
              const R0 = Math.random; Math.random = () => r; let tapped = false;
              try { RE.fire(id); await new Promise(z => setTimeout(z, 620)); /* FIXES 2 11/14 (ask row 611): a card takes no press in its first beat (500 ms); this press was at 300 */ const b = document.querySelectorAll('#roadcard button')[oi];
                if (b && !b.disabled) { b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); tapped = true; } } finally { Math.random = R0; }
              await new Promise(z => setTimeout(z, 1500));
              const ch = (window.__ROADEV_CHOSE || []).slice(-1)[0] || null, fought = (window.__ROADEV_FIGHTS | 0) > b4.fights;
              let won = null;
              if (fought) { const bb = loopBats(); window.postMessage({ type: 'BOHEMIA_CITY_COMBAT_END', outcome: { victory: true, result: 'win', alive: 0 }, at: null }, '*'); await new Promise(z => setTimeout(z, 2500)); won = { bats: loopBats() - bb }; }
              const hs1 = HM.state(), L0 = JSON.parse(b4.lost), L1 = (C.get() || {}).men || {};
              const res = { tapped, got: ch ? ch.got : null, dBats: loopBats() - b4.bats, dFood: ((wagonGet() || {}).food | 0) - b4.food, dMins: loopDay() * 1440 + (DAY.min | 0) - b4.mins,
                joined: RM.men().map(m => m.name).filter(n => b4.men.indexOf(n) < 0), fought, won,
                wounds: Object.keys(L1).filter(k => (+L1[k].lostHp || 0) > (+((L0[k] || {}).lostHp) || 0)),
                gifts: (hs1.things || []).length + (hs1.waiting || []).length + (hs1.residents || []).length - b4.things,
                found: Object.keys(S.boss.found || {}).length - b4.found, out: sg && sg.boss ? !fogHides(sg.boss.x, sg.boss.y) : null, again: !!((RM.gifts || []).slice(-1)[0] || {}).again,
                moods: window.__MOODS.slice(b4.moods) };
              try { RE.close(false); } catch (e) {} try { loopClose(); } catch (e) {}
              return res;
            }, [e.id, oi, r]);
            const b = fx.chance ? (r < 0.5 ? fx.chance.yes : fx.chance.no) || {} : {};
            const want = { bats: (fx.bats || 0) + (b.bats || 0), food: (fx.food || 0) + (b.food || 0), mins: (fx.mins || 0) + (b.mins || 0), gift: !!(fx.home || b.home), find: !!((fx.boss && fx.boss.find) || (b.boss && b.boss.find)),
              man: !!(fx.man || b.man), wound: !!(fx.wound || b.wound), fight: !!fx.fight, jobMood: !!(fx.mood && /job_from/.test((MINE().find(q => q.id === e.id).opts[oi].fx.mood || {}).place || '')) };
            const why = [];
            if (!res.tapped) why.push('no tap');
            if (!want.fight && res.dBats !== want.bats) why.push('bats ' + res.dBats + ' want ' + want.bats);
            if (!want.fight && res.dFood !== want.food) why.push('food ' + res.dFood + ' want ' + want.food);
            if (want.mins && res.dMins < want.mins - 1) why.push('mins ' + res.dMins + ' want ' + want.mins);
            if (want.gift !== (res.gifts >= 1 || res.again)) why.push('gifts ' + res.gifts);   /* the same gift the same day is one thing (HOME BASE): the second choice of one event, met only in a gate */
            if (want.find && !(res.found === 1)) why.push('found ' + res.found);
            if (want.find && res.out === false) why.push('his place still dark');
            if (want.man !== (res.joined.length === 1)) why.push('joined ' + res.joined.join(','));
            if (want.wound !== (res.wounds.length >= 1)) why.push('wounds ' + res.wounds.join(','));
            if (want.fight && !(res.fought && res.won && res.won.bats === (fx.fight.win.bats || 0))) why.push('fight ' + JSON.stringify(res.won));
            if (want.jobMood && !res.moods.some(m => m && m.from && setUp.job && setUp.job.indexOf(' @ ' + m.from) >= 0)) why.push('the job town did not hear ' + JSON.stringify(res.moods));
            seen.push(e.id + '#' + oi + (fx.chance ? (r < 0.5 ? 'y' : 'n') : '') + ':' + JSON.stringify(res.got || []));
            if (why.length) bad.push(e.id + '#' + oi + (fx.chance ? (r < 0.5 ? ' yes' : ' no') : '') + ' ' + why.join(', '));
          }
        }
      }
      ok(W + ' P3 every choice of the twelve does what it says (' + seen.length + ' taps): batteries, food, hours; a gift at his place; the boss found and out of the dark; the client\'s town hears; a man joins; a wound; a fight paid when won',
         seen.length === mine.reduce((a, e) => a + e.opts.reduce((b, o) => b + (o.fx && o.fx.chance ? 2 : 1), 0), 0) && !bad.length, bad.join('; ') || seen.filter(s => /PLACE|ON THE MAP|MAN/.test(s)).slice(0, 6).join(' | '));
    } else {
      /* P4: a real finger, sideways */
      const fe = await fr.frameElement(), fb = await fe.boundingBox(), miss = [];
      for (const e of mine) {
        await topUp(); if (e.needs.boss) await bossState(stateFor(e.needs));
        const q = await fr.evaluate((id) => { const RE = BohemiaRoadEvents; try { RE.close(false); } catch (e) {} RE.fire(id);
          const b = document.querySelector('#roadcard button'); if (!b || b.disabled) return null; const r = b.getBoundingClientRect(); window.__CH0 = (window.__ROADEV_CHOSE || []).length; return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, e.id);
        if (!q) { miss.push(e.id + ' no button'); continue; }
        await pg.waitForTimeout(400); await pg.touchscreen.tap(fb.x + q.x, fb.y + q.y); await pg.waitForTimeout(900);
        const took = await fr.evaluate(() => (window.__ROADEV_CHOSE || []).length > window.__CH0 || (window.__ROADEV_FIGHTS | 0) > 0 && !document.getElementById('roadcard'));
        if (!took) miss.push(e.id);
        await fr.evaluate(() => { try { BohemiaRoadEvents.close(false); } catch (e) {} try { if (window.__ROADEV_FIGHTS) window.postMessage({ type: 'BOHEMIA_CITY_COMBAT_END', outcome: { victory: true, result: 'win', alive: 0 }, at: null }, '*'); } catch (e) {} });
        await pg.waitForTimeout(600);
      }
      ok(W + ' P4 a real finger: a touch on each card\'s first choice is taken', !miss.length, miss.join(', ') || mine.length + ' taps');
    }
    ok(W + ' P5 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  } finally { await d.close(); }
}

(async () => {
  try { nodeChecks(); } catch (e) { ok('the node checks ran', false, String(e.stack || e.message).slice(0, 300)); }
  if (process.argv[2] !== 'node') {
    const only = process.argv[2];
    for (const [alpha, prof, full] of [[false, 'phone_portrait', true], [false, 'phone_landscape', false], [true, 'phone_portrait', true], [true, 'phone_landscape', false]]) {
      if ((only === 'demo' && alpha) || (only === 'alpha' && !alpha)) continue;
      try { await page(alpha, prof, full); } catch (e) { ok((alpha ? 'the alpha ' : 'the demo ') + prof + ' ran', false, String(e.stack || e.message).slice(0, 300)); }
    }
  }
  console.log('\nTHE ROAD KNOWS HIS PLACE: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
