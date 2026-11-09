/* ==========================================================================
   YOUR PLACE, PLANTED  (HOME BASE, 11/8/26, VAMILY rule 437(b), ask lines 356 and 522; rules 347, 343, 429(h), 434)

   PAOLO 11/3: 'you plant your part of the city kind of wherever you want... maybe it'll be a smart system... you gotta be in
   charge of the daily battery usage... are you sure you wanna plant down here, like this is permanent'.

   MEASURED BEFORE (the demo, a new game, phone upright): the seed put his outfit's camp down for him at the first second
   ('CUSTOM' on the map), nothing asked where, nothing was permanent, nothing billed it, nobody lived there.

   ENGINE (node, engine/bohemia_home.js + records/target/bb/home_base.json):
     E1  the place's plan: 12 lots, EVERY LOT FRONTS A ROAD, THE ROADS ARE ONE NETWORK (429(h))
     E2  planted: a lot walled off from every road is red; a road stub split from the street is red
     E3  the smart system: the freeway, a wash, a town's ground, no water, no road are refused; open ground with water and a road is not
     E4  PERMANENT: a second planting is refused, and so is a block the grade refused
     E5  the bill: keep + lights + people x the per-man night READ from nightly_bill.json x the water's price - a prize; planted: the
         per-man night typed differently in the engine's call is caught
     E6  progress you can see: 4 lots open, 8 when 4 stand, 12 when 8 stand
     E7  a new game is a new home (a record for another seed loads fresh)
   ON THE DEMO (phone upright and sideways; the game itself, never a bench page):
     D1  never in the first minute: no PLANT on day 1 in the town he wakes in, nor on the map
     D2  from day 2, on the map, PLANT is on the glass in the phone's band and the finger lands on it
     D3  its page grades the block he stands on (WATER, POWER, ROAD, DANGER) and PLANT HERE is off on ground that cannot take it
     D4  PLANT HERE asks 'Are you sure? This is permanent.'; NOT YET leaves him unplanted
     D5  PLANT HERE planted it: his outfit's seat is the block (ctBases, turfSeats, the painter's key), the map names it his
         (never CUSTOM), PLANT is gone; a second planting is refused PERMANENT
     D6  the night bills it from the purse (the bill's own number), and a man he let go comes to live there and eats from it;
         planted: the night's hook taken out is caught
     D7  a boss's prize (THE POT's verb) stands there and pays back
     D8  his place's BUILD building (a tap on it, rule 438(a): no floating sign) opens the desk: the plan with every lot on its road and 4 open, a sign on what stands, A NIGHT,
         LIVING HERE, NAME IT; a name typed there is the map's name for it; every press 44 px, the sheet inside the glass

   Run: node gates/home_base_gate.js [--engine] [--only phone_portrait]
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && !g ? '  [' + x + ']' : '')); };
const done = () => { console.log('YOUR PLACE, PLANTED: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };

/* ---------------- ENGINE ---------------- */
const H = require(path.join(ROOT, 'engine/bohemia_home.js'));
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/home_base.json'), 'utf8'));
const NB = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/nightly_bill.json'), 'utf8'));
H.setData(DATA);
console.log('ENGINE');
const rc = H.roadCheck();
ok('E1 the plan: ' + rc.lots + ' lots, ' + rc.roads + ' road tiles, every lot on a road, one network', rc.ok && rc.lots === 12, JSON.stringify(rc));
const cut = DATA.plan.rows.slice(); cut[1] = 'LLLRLLRLLR'; cut[2] = 'LLLRLLRLLR'; cut[3] = 'LRRRRRRRRR';   /* the west alley built over: (0,1),(0,2) and (1,1) lose their road */
const stub = DATA.plan.rows.concat(['LLLLLLLLLL', 'LLLLRLLLLL']);   /* a road tile out in the lots, joined to nothing */
const rcCut = H.roadCheck(cut), rcStub = H.roadCheck(stub);
ok('E2 planted: a lot walled off from every road is red (' + rcCut.cut.length + ' cut)', !rcCut.ok && rcCut.cut.length > 0, JSON.stringify(rcCut));
ok('E2 planted: a road stub split from the street is red (' + rcStub.stub.length + ' stub)', !rcStub.ok && rcStub.stub.length > 0, JSON.stringify(rcStub));
const good = { district: 'suburb', near: { water: 2, power: 4, road: 1, danger: 8 } };
const gG = H.grade(good);
const refused = [['freeway', { district: 'freeway', near: good.near }], ['a wash', { district: 'wash', near: good.near }],
  ['a town\'s ground', Object.assign({}, good, { town: true })], ['no water', { district: 'suburb', near: { water: 9, power: 1, road: 1, danger: 9 } }],
  ['no road', { district: 'desert', near: { water: 1, power: 1, road: 9, danger: 9 } }]];
ok('E3 open suburb with water 2 blocks off and a road beside it can be planted (water ' + gG.water + ', road ' + gG.road + ')', gG.ok && gG.water === 2 && gG.road === 3);
refused.forEach(r => { const g = H.grade(r[1]); ok('E3 refused: ' + r[0] + ' (' + (g && g.why) + ')', g && !g.ok); });
const rec = H.make('GATE');
const p1 = H.plant(rec, { x: 10, y: 12 }, 3, gG), p2 = H.plant(rec, { x: 40, y: 40 }, 4, gG);
ok('E4 planted once, at 10,12 on day 3', p1.ok && rec.planted.x === 10 && rec.planted.day === 3);
ok('E4 PERMANENT: a second planting is refused and the place does not move', !p2.ok && p2.why === 'PERMANENT' && rec.planted.x === 10);
ok('E4 a refused block is refused by plant() too', !H.plant(H.make('G2'), { x: 1, y: 1 }, 2, H.grade(refused[0][1])).ok);
const per = NB.per_man_per_night.value;
H.addResident(rec, { name: 'GATE MAN', why: 'let go' }); H.addResident(rec, { name: 'GATE WOMAN', why: 'met' });
const b0 = H.bill(rec, { perMan: per, prizes: [] }), wm = DATA.bill.water_cost_by_mark[String(rec.planted.grade.water)];
const want = DATA.bill.keep + DATA.bill.power_cost_by_mark[String(rec.planted.grade.power)] + Math.ceil(2 * per * wm);
ok('E5 the night: keep ' + DATA.bill.keep + ' + lights + 2 people x ' + per + ' (nightly_bill.json) x ' + wm + ' = ' + want, b0 && b0.due === want, JSON.stringify(b0));
const b1 = H.bill(rec, { perMan: per, prizes: [{ id: 'cook' }] });
ok('E5 THE POT\'s kitchen standing pays one back (' + b0.due + ' -> ' + b1.due + ')', b1.due === b0.due - 1);
const bWrong = H.bill(rec, { perMan: per + 3, prizes: [] });
ok('E5 planted: a per-man night not read from the file is caught (' + bWrong.due + ' != ' + want + ')', bWrong.due !== want);
ok('E6 progress: 4 open, 8 when 4 stand, 12 when 8 stand', H.lotsOpen(rec, 0) === 4 && H.lotsOpen(rec, 4) === 8 && H.lotsOpen(rec, 8) === 12, [H.lotsOpen(rec, 0), H.lotsOpen(rec, 4), H.lotsOpen(rec, 8)]);
const re = H.load(H.save(rec), 'ANOTHER');
ok('E7 a new game is a new home (another seed loads unplanted)', !re.planted && H.load(H.save(rec), 'GATE').planted.x === 10);
if (process.argv.includes('--engine')) done();

/* ---------------- ON THE DEMO ---------------- */
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const ONLY = arg('--only');
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !ONLY || p === ONLY);
async function box(P, sel) { return P.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return null;
  const r = e.getBoundingClientRect(); if (r.width < 2) return null; const h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, hit: !!h && e.contains(h), dis: !!e.disabled, on: r.right <= innerWidth && r.bottom <= innerHeight && r.left >= 0 && r.top >= 0 }; }, sel).catch(() => null); }
async function phoneText(P) { return P.evaluate(() => { const e = document.querySelector('#bohphone .hb'); return e ? e.innerText : ''; }).catch(() => ''); }
(async () => {
  for (const prof of PROFS) {
    console.log('ON THE DEMO, ' + prof);
    const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
    const P = d.page, F = d.fr;
    for (let i = 0; i < 40; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data())).catch(() => false)) break; await P.waitForTimeout(250); }
    const d1 = await F.evaluate(() => ({ day: DAY.day | 0, offer: BohemiaHomeMap.offer(), planted: BohemiaHomeMap.state().planted, label: BohemiaHomeMap.label() }));
    const b1 = await box(P, '#bohphone .bpctx .pl');
    ok('D1 day ' + d1.day + ' where he wakes: no PLANT on the phone, unplanted, his camp reads ' + d1.label, d1.day <= 1 && !d1.offer && !b1 && !d1.planted && d1.label === 'YOUR CAMP', JSON.stringify(d1));
    /* a block that can take it, near him, that he can stand on */
    const spot = await F.evaluate(() => { try { loopClose(); } catch (e) {} const x0 = city.x, y0 = city.y; let best = null;
      for (let r = 2; r < 24 && !best; r++) for (let dy = -r; dy <= r && !best; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const g = BohemiaHome.grade(BohemiaHomeMap.probe(x0 + dx, y0 + dy)); if (g && g.ok && cityWalkable(x0 + dx, y0 + dy)) { best = [x0 + dx, y0 + dy, g.water, g.road]; break; } }
      const bad = (function () { for (let r = 0; r < 30; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const c = om.at(x0 + dx, y0 + dy); if (c && c.district === 'arterial') return [x0 + dx, y0 + dy]; } return null; })();
      city.x = bad[0]; city.y = bad[1]; try { render(); } catch (e) {} return { best, bad }; });
    await P.waitForTimeout(900);
    const b1m = await box(P, '#bohphone .bpctx .pl');
    ok('D1 day 1 on the map: still no PLANT (never in the first minute)', !b1m);
    await F.evaluate(() => { DAY.day = 2; try { render(); } catch (e) {} }); await P.waitForTimeout(1200);
    const b2 = await box(P, '#bohphone .bpctx .pl');
    ok('D2 day 2 on the map: PLANT on the glass in the band, the finger lands on it', !!b2 && b2.hit && b2.on, JSON.stringify(b2));
    if (b2) await P.touchscreen.tap(b2.x, b2.y); await P.waitForTimeout(1100);
    const t3 = await phoneText(P), pb3 = await box(P, '#bohphone .hb button[data-h="plant"]');
    ok('D3 on a road (arterial): the page grades it and PLANT HERE is off, NOT HERE said', /WATER/.test(t3) && /POWER/.test(t3) && /ROAD/.test(t3) && /DANGER/.test(t3) && pb3 && pb3.dis && /NOT HERE/.test(t3), t3.replace(/\n/g, ' '));
    await F.evaluate(s => { city.x = s[0]; city.y = s[1]; try { render(); } catch (e) {} }, spot.best); await P.waitForTimeout(1500);
    const t3b = await phoneText(P), pb3b = await box(P, '#bohphone .hb button[data-h="plant"]');
    ok('D3 on open ground with water ' + spot.best[2] + ' and road ' + spot.best[3] + ': PLANT HERE is on', !!pb3b && !pb3b.dis && pb3b.hit, t3b.replace(/\n/g, ' '));
    await P.touchscreen.tap(pb3b.x, pb3b.y); await P.waitForTimeout(800);
    const t4 = await phoneText(P), no = await box(P, '#bohphone .hb button[data-h="no"]');
    ok('D4 it asks: Are you sure? This is permanent.', /Are you sure\? This is permanent\./.test(t4) && !!no, t4.replace(/\n/g, ' '));
    if (no) await P.touchscreen.tap(no.x, no.y); await P.waitForTimeout(700);
    ok('D4 NOT YET leaves him unplanted', !(await F.evaluate(() => BohemiaHomeMap.state().planted)));
    const pb4 = await box(P, '#bohphone .hb button[data-h="plant"]'); if (pb4) await P.touchscreen.tap(pb4.x, pb4.y); await P.waitForTimeout(700);
    const yes = await box(P, '#bohphone .hb button[data-h="yes"]'); if (yes) await P.touchscreen.tap(yes.x, yes.y); await P.waitForTimeout(1500);
    const a5 = await F.evaluate(s => { const bs = ctBases(), m = BohemiaBetween.mine(), seat = (turfSeats() || []).filter(x => x.faction === m)[0];
      const f = townFoot({ name: m, x: s[0], y: s[1] });
      return { st: BohemiaHomeMap.state(), base: [bs[m].x, bs[m].y], seat: seat ? [seat.x, seat.y] : null, key: VB_TOWNS.key || '', foot: f.x0 + ',' + f.y0 + ',' + f.n,
               again: BohemiaHome.plant(BohemiaHomeMap.rec(), { x: 3, y: 3 }, 9).why, saved: JSON.parse(localStorage.getItem('bohemia.home.v1') || '{}').planted }; }, spot.best);
    await P.waitForTimeout(6000);
    await F.evaluate(() => { try { render(); } catch (e) {} }); await P.waitForTimeout(600);
    const plates = await F.evaluate(() => (window.__MAP_PLATE_NAMES || []).filter(Boolean));
    ok('D5 planted at ' + spot.best.slice(0, 2) + ': his outfit\'s seat IS the block (bases ' + a5.base + ', seat ' + a5.seat + ')', a5.st.planted && a5.base[0] === spot.best[0] && a5.base[1] === spot.best[1] && a5.seat && a5.seat[0] === spot.best[0], JSON.stringify(a5).slice(0, 300));
    ok('D5 the painter is handed his place\'s foot (' + a5.foot + ' in the key)', (await F.evaluate(() => VB_TOWNS.key || '')).indexOf(a5.foot) >= 0);
    ok('D5 the map names it his (' + a5.st.name + '), never CUSTOM', plates.indexOf(a5.st.name) >= 0 && plates.indexOf('CUSTOM') < 0, plates.join('|'));
    ok('D5 PLANT is gone; a second planting is refused ' + a5.again + '; the save holds it', !(await box(P, '#bohphone .bpctx .pl')) && a5.again === 'PERMANENT' && a5.saved && a5.saved.x === spot.best[0]);
    /* D6 the night */
    const n6 = await F.evaluate(() => { const before = loopBats(), b = BohemiaHomeMap.state().bill.due; const r = BohemiaHomeMap.billNight(); return { before, after: loopBats(), due: b, r }; });
    ok('D6 the night bills his place from the purse (' + n6.before + ' -> ' + n6.after + ', due ' + n6.due + ')', n6.before - n6.after === n6.due && n6.due > 0, JSON.stringify(n6));
    const n6b = await F.evaluate(() => { const r = BohemiaHomeMap.rec(), w = JSON.parse(localStorage.getItem('bohemia.walked.v1') || '[]');
      w.push({ name: 'GATE RUIZ', look: null, dismissed: true, day: r.planted.day }); localStorage.setItem('bohemia.walked.v1', JSON.stringify(w));
      const b0 = BohemiaHomeMap.state().bill.due; BohemiaHomeMap.billNight(); const s = BohemiaHomeMap.state(); return { b0, b1: s.bill.due, res: s.residents.map(x => x.name) }; });
    ok('D6 a man he let go lives there now and eats from it (' + n6b.res.join(', ') + '; ' + n6b.b0 + ' -> ' + n6b.b1 + ')', n6b.res.indexOf('GATE RUIZ') >= 0 && n6b.b1 > n6b.b0, JSON.stringify(n6b));
    const m6 = await F.evaluate(() => { const keep = homeBillNight; homeBillNight = function () { return null; }; const before = loopBats(); crewBillNight(); const crewOnly = before - loopBats();
      homeBillNight = keep; const b2 = loopBats(); crewBillNight(); return { crewOnly, both: b2 - loopBats(), due: BohemiaHomeMap.state().bill.due }; });
    ok('D6 planted: the night with his place\'s hook taken out charges ' + m6.crewOnly + ', with it ' + m6.both + ' (the difference is his place, ' + m6.due + ')', m6.both - m6.crewOnly === m6.due, JSON.stringify(m6));
    /* D7 a boss's prize */
    const p7 = await F.evaluate(() => { const S = BohemiaBosses.state(); if (!S) return null; S.verbs.cook = S.verbs.cook || { from: 'THE POT', day: 2, last: null, uses: 0 }; const s = BohemiaHomeMap.state(); return { prizes: s.prizes.map(p => p.name), back: s.bill.back }; });
    ok('D7 THE POT\'s prize stands at his place and pays back (' + (p7 && p7.prizes.join(',')) + ', back ' + (p7 && p7.back) + ')', !!p7 && p7.prizes.indexOf('YOUR KITCHEN') >= 0 && p7.back >= 1, JSON.stringify(p7));
    /* D8 the desk */
    await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { const S = BohemiaSettlement; return S.ready() && S.picIn() && !!window.__HOME_DESK && window.__HOME_DESK.home && window.__HOME_DESK.home.planted; } catch (e) { return false; } }).catch(() => false)) fr = x; }
    ok('D8 his place opens as his (the map tells the town screen)', !!fr);
    if (fr) {
      await P.waitForTimeout(1500);   /* rule 438(a): no sign at rest; the building itself is the press (BohemiaSettlement.where, the middle of its own pixels) */
      const fb = await (await fr.frameElement()).boundingBox();
      const sg = await fr.evaluate(() => { const w = BohemiaSettlement.where && BohemiaSettlement.where('build'); return w ? [w.x, w.y] : null; });
      ok('D8 his place has its BUILD building on the glass', !!sg);
      for (let t = 0; t < 3 && sg; t++) {   /* a slow phone: the press is asked again, as a thumb would, until the building answers */
        const w = await fr.evaluate(() => { const x = BohemiaSettlement.where('build'); return x ? [x.x, x.y] : null; }); if (!w) break;
        await P.touchscreen.tap(fb.x + w[0], fb.y + w[1]);
        let up = false; for (let i = 0; i < 16 && !up; i++) { await P.waitForTimeout(250); up = await fr.evaluate(() => BohemiaSettlement.state.open === 'build' && !!document.querySelector('#sbody .hdesk')).catch(() => false); }
        if (up) break; }
      await P.waitForTimeout(600);
      const dk = await fr.evaluate(() => { const b = document.getElementById('sbody'), t = b ? b.innerText : '', c = b && b.querySelector('canvas.hplan'), sh = b && b.closest('[id]');
        const press = [].slice.call(b ? b.querySelectorAll('button') : []).filter(x => x.offsetWidth).map(x => { const r = x.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), r.bottom <= innerHeight + 0.5 && r.top >= -0.5]; });
        return { t, plan: window.__HOME_PLAN || null, canvas: !!c, press, open: BohemiaSettlement.state.open }; });
      ok('D8 the desk: A NIGHT, LIVING HERE, NAME IT', dk.open === 'build' && /A NIGHT/.test(dk.t) && /LIVING HERE/.test(dk.t) && /NAME IT/.test(dk.t), dk.t.slice(0, 200).replace(/\n/g, ' '));
      ok('D8 the plan: ' + (dk.plan && dk.plan.lots) + ' lots on the road, ' + (dk.plan && dk.plan.open) + ' open, signs: ' + (dk.plan && dk.plan.signs.join(',')), dk.canvas && dk.plan && dk.plan.lots === 12 && dk.plan.open === 4 && dk.plan.signs.indexOf('KITCHEN') >= 0, JSON.stringify(dk.plan));
      const small = dk.press.filter(p => p[1] < 44 || !p[2]);
      ok('D8 every press 44 px tall and on the glass (' + dk.press.length + ' presses)', dk.press.length >= 9 && !small.length, JSON.stringify(small));
      const nm = await fr.evaluate(() => { const b = [].slice.call(document.querySelectorAll('#sbody .hdesk button')).filter(x => /NAME IT/.test(x.textContent))[0]; if (!b) return false; b.click(); return true; });
      await P.waitForTimeout(400);
      await fr.evaluate(() => { const i = document.querySelector('#sbody .hname input'); if (!i) return; i.value = 'Casa Gate'; i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); });
      await P.waitForTimeout(1200);
      const named = await F.evaluate(() => BohemiaHomeMap.label());
      ok('D8 a name typed at the desk is the map\'s name for it (' + named + ')', nm && named === 'CASA GATE', named);
      await P.screenshot({ path: path.join(require('os').tmpdir(), 'home_base_gate_desk_' + prof + '.png') }).catch(() => {});   /* the proof picture, never into the repo */
    }
    await d.close();
  }
  done();
})().catch(e => { console.error(e); fail++; done(); });
