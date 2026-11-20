#!/usr/bin/env node
/* ============================================================================
   THE BATTERY IS REAL GATE (ECONOMY TWO, 11/18/26; VAMILY rule 459, ask line 645; rules 441, 454(a)).
   RE-AIMED BY ECONOMY THREE 11/20 TO RULE 463 (Paolo 11/20: 'I dont like how u made the new battery shit like 3 batteries
   thats so fucking ugly'): the drawing that split a sum into pictures of car batteries, tool packs and AA's is DEAD on every
   screen (graveyard/THREE_BATTERIES_11_20_26/, graveyard/POSTMORTEM_THE_THREE_BATTERIES_11_20_26.txt). Every sum is again
   the number with the old battery mark, the page's words letter for letter. THE ONE TABLE AND ITS PRICES STAY (rule 459).

   PAOLO 9/4: 'for one AA battery a bag of rice.'
   PAOLO 11/17: 'some of the quests, it's like 3000 or like 1000 batteries to complete a quest and I'm like bro that's a
   lot... I want people to really feel like they can look at their battery right now and relate it from the game to real life.'

   THE TABLE (no browser; records/target/bb/battery_table.json through tools/bohemia_economy_two_the_battery_table.js):
     T1 the unit is one AA and it buys a bag of rice; the research's worths stand (a phone charge 6, a tool pack 20, a car's
        battery 250) as words and research only: no ladder kind carries a picture
     T2 EVERY NUMBER IS THE TABLE'S: every place a number of batteries lives says the table's number; every typed copy in
        code says it (a price typed as a field too); every number inside a sentence says it; nothing outside it; every row
        in its band; the worked sums are the table's; AND THE THREE BATTERIES ARE DEAD (the check's 7b: no live page or live
        script loads the drawing, draws its classes or its pictures, or writes a sum as kinds of battery)
     T3 PLANTED FAULTS, each one red by its own words (the dead drawing put back on a page's list among them)
     T4 THE THREE BATTERIES ARE DEAD on disk: neither the drawing nor its pictures are in slices/; both are in the graveyard
        with their post-mortem; no live page, the baked demo included, names the drawing
     T6 the bands he was promised: everyday things 1 to 10, a man's night a few, the most one job can ever pay under 2,500
   THE REAL PAGE (the demo and the alpha, a phone upright and sideways, started the way he starts it):
     C1 THE CREW SCREEN (the one CREW, a real tap on his second man): his night in words ('N BATTERIES A NIGHT'), whole, the
        number the crew screen's own line says
     S1 THE SPOILS after a fight (won by the gate, the one shortcut, said): the bar's purse is the map's, its number beside
        the old pile; the cells off their bodies '+N' beside the old mark
     S2 a real tap on a piece: what a town pays for it, its number beside the old icon
     L1 THE BAR: a purse of 290 reads 290 beside the old pile, nothing past the glass
     L2-L5 THE BOARD, THE STALL, THE HALL, THE SHELVES: every price its number beside the old mark, inside its box
     L6 AT THE TOP OF CLOUT WITH A PURSE OF 2,236: the bar reads 2236 beside the old pile, inside the glass; the board's
        jobs their numbers beside the old mark
     L7 the map's own line when a job is taken ('Pays N batteries') is words, letter for letter
     L8 PLANTED ON THE LIVE PAGE: the dead drawing loaded from the graveyard into the town; the same checks read red
     L9 nothing threw, and nothing asked for the dead drawing or its pictures before the plant
   node gates/the_battery_is_real_gate.js [data | demo | alpha] [phone_portrait | phone_landscape] [--shots=<a folder outside the tree>]
   ============================================================================ */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const TT = require(path.join(ROOT, 'tools', 'bohemia_economy_two_the_battery_table.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null && w !== '' ? '  [' + String(w).slice(0, 300) + ']' : '')); };
const clone = o => JSON.parse(JSON.stringify(o));
const args = process.argv.slice(2), SHOTDIR = (args.filter(a => /^--shots=/.test(a))[0] || '').slice(8) || (args.includes('--shots') ? path.join(require('os').tmpdir(), 'bohemia_the_battery_walk') : ''), SHOTS = !!SHOTDIR;   /* --shots[=dir]: the walk's pictures, never into the tree */
const want = (k) => !args.some(a => ['data', 'demo', 'alpha'].includes(a)) || args.includes(k);
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !args.some(a => /^phone_/.test(a)) || args.includes(p));
const GRAVE = 'graveyard/THREE_BATTERIES_11_20_26', POST = 'graveyard/POSTMORTEM_THE_THREE_BATTERIES_11_20_26.txt';

/* ---------------- the table ---------------- */
function data() {
  console.log('\n-- the table (records/target/bb/battery_table.json) --');
  const T = TT.load(), L = T.ladder.value, by = {}; L.forEach(k => { by[k.id] = k; });
  ok('T1 the unit is one AA and it buys a bag of rice; a phone charge 6, a tool pack 20, a car\'s battery 250 (words and research: no kind carries a picture)',
    T.unit.id === 'aa' && T.unit.worth === 1 && /bag of rice/.test(T.unit.buys) && by.aa.worth === 1 && by.phone_battery.worth === 6 && by.tool_pack.worth === 20 && by.car_battery.worth === 250 && L.every(k => !k.icon && !k.small),
    L.filter(k => k.icon || k.small).map(k => k.id).join(', '));
  TT.reset(); const bad = TT.check(T);
  ok('T2 EVERY NUMBER IS THE TABLE\'S: ' + T.count.rows + ' numbers in ' + T.count.files + ' data files, ' + T.count.copies + ' typed copies in code, ' + T.count.prose + ' sentences; nothing outside it; and no live page draws the three batteries', !bad.length, bad.slice(0, 3).join(' | '));
  /* T3 planted */
  const plant = (name, fn, re) => { const P = clone(T); fn(P); TT.reset(); const b = TT.check(P); const hit = b.some(x => re.test(x)); return [name, hit, b.length]; };
  const firstRow = (f) => Object.keys(T.rows[f])[0];
  const NB = 'records/target/bb/nightly_bill.json', RET = 'records/target/bb/retinue.json', BOSS = 'records/target/bb/boss_act_one.json';
  const P3 = [
    plant('a man\'s night moved in the table and not in the game', P => { P.rows[NB][firstRow(NB)] = 3; }, /NOT THE TABLE'S NUMBER: records\/target\/bb\/nightly_bill\.json/),
    plant('the road taken out of the table', P => { P.where = P.where.filter(w => !/ROAD_EVENTS/.test(w.file)); delete P.rows['records/target/BOHEMIA_ROAD_EVENTS.json']; }, /A BATTERY NUMBER OUTSIDE THE TABLE: records\/target\/BOHEMIA_ROAD_EVENTS\.json/),
    plant('the barber\'s typed price taken out of the table', P => { P.copies = P.copies.filter(c => !/Sit in the chair/.test(c.find)); }, /TYPED IN CODE, NOT FROM THE TABLE: slices\/BOHEMIA_SETTLEMENT_SCREEN\.html/),
    plant('a typed copy that is not the table\'s number', P => { P.rows[RET]['followers.value[id=cook].price'] = 210; }, /A TYPED COPY IS NOT THE TABLE'S NUMBER: engine\/bohemia_camp\.js/),
    plant('a sentence still saying the old number', P => { P.rows[BOSS]['bosses[5].verb.pay_batteries'] = 14; }, /THE NUMBER IN A SENTENCE IS NOT THE TABLE'S: records\/target\/bb\/boss_act_one\.json/),
    plant('an everyday thing at 40', P => { P.rows['records/target/bb/stall_prices.json']['goods.meds.buy.value'] = 40; }, /OUT OF ITS BAND: records\/target\/bb\/stall_prices\.json goods\.meds/),
    plant('a job that pays over ten car batteries', P => { P.bands.one_job.max = 2000; }, /THE BIGGEST JOB pays/),
    plant('the door\'s job bonus typed as a field, its copy taken out', P => { P.copies = P.copies.filter(c => !/pay:\(\\d\+\),/.test(c.find)); }, /TYPED IN CODE, NOT FROM THE TABLE: slices\/BOHEMIA_ALPHA_0_9\.html:\d+ a money field/),
    plant('the post\'s wages, in a script only the town page loads, its name and copies taken out', P => { const g = 'engine/bohemia_goodbros.js';
      P.live_code = P.live_code.filter(f => f !== g); P.copies = P.copies.filter(c => c.file !== g); TT.pageScripts(P).forEach(f => { if (P.live_code.indexOf(f) < 0) P.live_code.push(f); }); }, /TYPED IN CODE, NOT FROM THE TABLE: engine\/bohemia_goodbros\.js:\d+ a money field/),
    plant('THE DEAD DRAWING put back on a page\'s list of scripts (rule 463)', P => { P.live_code.push(GRAVE + '/bohemia_the_battery.js'); }, /THE THREE BATTERIES ARE DEAD \(rule 463\): graveyard\/THREE_BATTERIES_11_20_26\/bohemia_the_battery\.js/)
  ];
  TT.reset();
  ok('T3 PLANTED: ' + P3.map(p => p[0]).join('; ') + ': every one red by its own words', P3.every(p => p[1]), P3.filter(p => !p[1]).map(p => p[0] + ' (' + p[2] + ' faults, none its own)').join('; '));
  /* T4 the three batteries are dead, on disk */
  const live = ['BOHEMIA_CITY_WORLD.html', 'BOHEMIA_SETTLEMENT_SCREEN.html', 'BOHEMIA_ROSTER_SCREEN.html', 'BOHEMIA_FIGHT.html', 'BOHEMIA_ALPHA_0_9.html', 'BOHEMIA_SPOILS_SCREEN.html', 'BOHEMIA_DEMO.html'];
  const names = live.filter(p => /bohemia_the_battery\.js|battery_ladder\/|\bbsum-k\b/.test(fs.readFileSync(path.join(ROOT, 'slices', p), 'utf8')));
  const back = ['slices/bohemia_the_battery.js', 'slices/battery_ladder'].filter(f => fs.existsSync(path.join(ROOT, f)));
  const kept = [GRAVE + '/bohemia_the_battery.js', GRAVE + '/battery_ladder', POST].filter(f => !fs.existsSync(path.join(ROOT, f)));
  ok('T4 THE THREE BATTERIES ARE DEAD (rule 463): no live page names the drawing (the baked demo included), neither it nor its pictures are in slices/, both are in the graveyard with the post-mortem',
    !names.length && !back.length && !kept.length, JSON.stringify({ names, back, missing: kept }));
  /* T6 the bands */
  const S = T.sums, st = T.rows['records/target/bb/stall_prices.json'];
  const every = ['goods.food.buy.value', 'goods.meds.buy.value', 'goods.rounds.buy.value', 'goods.tape.buy.value'].map(k => st[k]);
  ok('T6 everyday things 1 to 10 (the stall: ' + every.join(', ') + '); a man\'s night ' + S.a_mans_night_fed.is + ' fed, ' + S.a_hired_mans_night_first.is + ' to ' + S.a_hired_mans_night_top.is + ' fed and paid; the most one job can ever pay is ' + S.job_pushed_twice.is,
    every.every(v => v >= 1 && v <= 10) && S.a_mans_night_fed.is <= 3 && S.a_hired_mans_night_top.is <= 12 && S.job_pushed_twice.is < 2500);
}

/* ---------------- the real page ---------------- */
const drive = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js'));
const { openCrew } = require(path.join(ROOT, 'tools', 'bohemia_open_the_crew.js'));
async function town(d, re) {
  const P = d.page;
  await d.fr.evaluate((re) => { const bs = ctBases(), n = Object.keys(bs).find(k => new RegExp(re, 'i').test(k)), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, re);
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate((re) => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && new RegExp(re, 'i').test(BohemiaSettlement.state.place.name) && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }, re).catch(() => false)) { sf = x; break; } }
  if (sf) { await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await P.waitForTimeout(1200); }
  return sf;
}
async function openIt(sf, P, k) {
  await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(450);
  const w = await sf.evaluate(k => BohemiaSettlement.where(k), k); if (!w) return null;
  const fb = await (await sf.frameElement()).boundingBox();
  await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1300);
  await sf.waitForFunction((k) => BohemiaSettlement.state.open === k, k, { timeout: 8000 }).catch(() => {});
  await P.waitForTimeout(500);
  return sf.evaluate(() => BohemiaSettlement.state.open);
}
/* every price inside sel: its number, whether the OLD battery mark stands beside it (the pack's supply icon, as an <img>, a
   background, a ::before or ::after, on it or on a child), whether it sits inside its box; and whether any of the dead
   drawing's marks are on the page at all */
const marks = (fr, sel, boxSel) => fr.evaluate(([sel, boxSel]) => {
  const OLD = /supply_icons\/(small\/)?batteries\.png/;
  const has = e => [null, '::before', '::after'].some(ps => { const cs = getComputedStyle(e, ps); return OLD.test(cs.backgroundImage || '') && cs.display !== 'none' && cs.visibility !== 'hidden'; });
  const rows = [...document.querySelectorAll(sel)].filter(h => h.getBoundingClientRect().width > 0).map(h => {
    const img = [...h.querySelectorAll('img')].some(i => OLD.test(i.src) && getComputedStyle(i).display !== 'none' && i.getBoundingClientRect().width > 0);
    const kid = [...h.querySelectorAll('*')].some(x => has(x) && x.getBoundingClientRect().width > 0);
    const nb = h.querySelector(':scope > b') || h, m = /-?\d[\d,]*/.exec(String(nb.textContent || '')), r = h.getBoundingClientRect();
    const box = (boxSel ? h.closest(boxSel) : h.parentElement) || h, b = box.getBoundingClientRect();
    return { text: h.textContent.replace(/\s+/g, ' ').trim().slice(0, 40), n: m ? parseInt(m[0].replace(/,/g, ''), 10) : null, mark: img || has(h) || kid,
      over: Math.max(0, Math.round(r.right - b.right), Math.round(b.left - r.left)), uc: h.dataset && h.dataset.n != null ? +h.dataset.n : null };
  });
  return { rows, dead: document.querySelectorAll('.bsum, .bsum-k, .uc-bsum, [data-bsum]').length };
}, [sel, boxSel || null]);
const oldOk = (R) => R.dead === 0 && R.rows.length > 0 && R.rows.every(x => x.mark && x.n != null && x.over <= 1 && (x.uc == null || x.uc === x.n));
const oldWhy = (R) => 'dead marks ' + R.dead + '; ' + JSON.stringify(R.rows.filter(x => !x.mark || x.n == null || x.over > 1 || (x.uc != null && x.uc !== x.n)).slice(0, 3));
const barRead = (fr) => fr.evaluate(() => { const s = document.querySelector('#bmtb .s.bats'), b = s && s.querySelector('b'), im = s && s.querySelector('img'), r = s && s.getBoundingClientRect(), bb = document.getElementById('bmtb');
  const last = [...document.querySelectorAll('#bmtb .s')].filter(x => x.getBoundingClientRect().width > 0).map(x => x.getBoundingClientRect().right).reduce((a, v) => Math.max(a, v), 0);
  return s ? { words: b ? b.textContent.trim() : null, old: !!im && /supply_icons\/batteries\.png/.test(im.src) && getComputedStyle(im).display !== 'none' && im.getBoundingClientRect().height > 8, dead: document.querySelectorAll('.bsum, .bsum-k, [data-bsum]').length, right: Math.round(last), w: innerWidth } : null; });

/* C1 / S1 / S2: the crew screen, and the spoils after a fight; first, on a game no town has been opened in */
async function crewAndSpoils(d, tag, prof, shot) {
  const P = d.page, mouse = !/^phone_/.test(prof), tap = async (x, y) => { if (mouse) await P.mouse.click(x, y); else await P.touchscreen.tap(x, y); };
  try {
    let who = null; for (let k = 0; k < 10 && !who; k++) { who = await openCrew(P, d.fr, { mouse }); if (!who) await P.waitForTimeout(800);
      if (!who && k === 3) await town(d, '^Mob$');   /* no CREW on the glass (the alpha can open on the walked city it keeps, no phone): a town, where the phone stands, by the walk's own travel shortcut */ }
    let rf = null; for (let k = 0; k < 50 && !rf; k++) { await P.waitForTimeout(300); rf = P.frames().find(x => /ROSTER_SCREEN/.test(x.url())); }
    if (!rf) ok('C1 ' + tag + ': the crew screen through the one CREW (' + who + ')', false);
    else {
      await rf.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready && BohemiaRosterScreen.state.crew.length > 0, null, { timeout: 30000 }).catch(() => {});
      await P.waitForTimeout(1200);
      const at = await rf.evaluate(() => { const m = BohemiaRosterScreen.state.crew.find(x => !x.main && !x.dead); if (!m) return null; const N = String(m.name).toUpperCase();
        const r = [...document.querySelectorAll('*')].filter(x => x.children.length === 0 && x.textContent.trim().toUpperCase() === N).map(x => x.getBoundingClientRect()).find(q => q.width > 0 && q.height > 0);
        return r ? { x: r.x + r.width / 2, y: r.y + r.height / 2, name: m.name } : null; });
      if (at) { const fb = await (await rf.frameElement()).boundingBox(); await tap(fb.x + at.x, fb.y + at.y); await P.waitForTimeout(1300); }
      const own = await rf.evaluate(() => { const l = document.querySelector('#card .who .sub'); return l ? l.textContent.replace(/\s+/g, ' ').trim() : null; });
      const night = own && /(\d[\d,]*) BATTER(?:Y|IES) A NIGHT/.exec(own);
      const seen = await P.evaluate(() => { const e = document.querySelector('#bohphone .crewp .cman em'); if (!e || e.getBoundingClientRect().width < 2) return null; return { text: e.textContent.replace(/\s+/g, ' ').trim(), dead: document.querySelectorAll('#bohphone .bsum, #bohphone .cnight').length }; }).catch(() => null)
        || await rf.evaluate(() => { const e = document.querySelector('#card .who .sub'); if (!e || e.getBoundingClientRect().width < 2) return null; return { text: e.textContent.replace(/\s+/g, ' ').trim(), dead: document.querySelectorAll('.bsum').length }; }).catch(() => null);
      await shot('9_crew');
      ok('C1 ' + tag + ': THE CREW SCREEN, his second man (' + (at ? at.name : '?') + ', a real ' + (mouse ? 'click' : 'tap') + '): his night in words, as before 11/18t ("' + (seen && seen.text) + '"), the crew screen\'s own number',
        !!night && !!seen && seen.dead === 0 && seen.text.indexOf(night[1] + ' ' + (night[1] === '1' ? 'BATTERY' : 'BATTERIES') + ' A NIGHT') >= 0, JSON.stringify({ own, seen }));
      await rf.evaluate(() => { const b = document.getElementById('done'); if (b) b.click(); }).catch(() => {});
      for (let k = 0; k < 20; k++) { await P.waitForTimeout(250); const up = await rf.evaluate(() => { const f = window.frameElement; return !!f && f.getBoundingClientRect().width > 2 && getComputedStyle(f).visibility !== 'hidden'; }).catch(() => false); if (!up) break; }
    }
  } catch (e) { ok('C1 ' + tag + ': the crew screen walked', false, String(e && e.message || e).slice(0, 300)); }
  try {
    await d.fr.evaluate(() => { loopSettleBats(2236, 'the gate: the biggest purse'); try { updHud(); } catch (e) {} try { if (window.__barPaintRead) window.__barPaintRead(); } catch (e) {} }); await P.waitForTimeout(1200);
    const f = await drive.roadFightOffTheTown(d, { id: 'toll_crew', name: 'the toll crew', seq: 459 });
    if (!f) { ok('S1 ' + tag + ': a road fight through the map\'s own door', false); return; }
    await f.evaluate(() => { const S = FIGHT.S; S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u.armB = 0; u.armH = 0; }); S.over = true; S.result = 'won'; showOver('won'); });
    const SF = () => P.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
    for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened).catch(() => false)); i++) await P.waitForTimeout(200);
    const sf = SF(); if (!sf) { ok('S1 ' + tag + ': the spoils after the fight', false); return; }
    await P.waitForTimeout(1500);
    const mapBar = await barRead(d.fr), sb = await barRead(sf);
    const cnt = await sf.evaluate(() => { const c = BohemiaSpoilsScreen.state.counts || {}, b = document.querySelector('#counts .count[data-count=batteries]'), cs = b && getComputedStyle(b, '::before');
      return { cells: c.batteries | 0, text: b ? b.textContent.replace(/\s+/g, ' ').trim() : null, mark: !!cs && /supply_icons\/batteries\.png/.test(cs.backgroundImage) && cs.display !== 'none', dead: document.querySelectorAll('.bsum, [data-bsum], [data-bsum-sum]').length }; });
    ok('S1 ' + tag + ': THE SPOILS (the fight won by the gate): the bar reads the map bar\'s purse (' + (mapBar && mapBar.words) + ') beside the old pile, inside the glass; the cells off their bodies ("' + cnt.text + '") beside the old mark; nothing of the dead drawing',
      !!sb && !!mapBar && sb.words === mapBar.words && sb.old && sb.dead === 0 && sb.right <= sb.w + 1 && cnt.dead === 0 && (cnt.cells === 0 ? cnt.text === null : (cnt.mark && new RegExp('^\\+' + cnt.cells + ' BATTER').test(cnt.text))), JSON.stringify({ mapBar, sb, cnt }));
    const pc = await sf.evaluate(() => { const s = document.querySelector('#ground .slot, #stash .slot'); if (!s) return null; const r = s.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (!pc) { ok('S2 ' + tag + ': a piece on the ground to tap', false); return; }
    const fb = await (await sf.frameElement()).boundingBox(); await tap(fb.x + pc.x, fb.y + pc.y); await P.waitForTimeout(800); await shot('10_spoils');
    const s2 = await sf.evaluate(() => { const S = BohemiaSpoilsScreen.state, it = S.sel, sv = document.querySelector('#said .sell'), im = sv && sv.querySelector('img.bat'), r = sv && sv.getBoundingClientRect(), b = document.getElementById('said').getBoundingClientRect();
      let pays = null; try { pays = it ? BohemiaSpoils.sellBack(it, S.at) : null; } catch (e) {}
      return { pays, text: sv ? sv.textContent.trim() : null, old: !!im && getComputedStyle(im).display !== 'none' && /supply_icons\/batteries\.png/.test(im.src), inside: !!r && r.right <= b.right + 1 && r.left >= b.left - 1, dead: document.querySelectorAll('.bsum').length }; });
    ok('S2 ' + tag + ': a real ' + (mouse ? 'click' : 'tap') + ' on a piece: what a town pays for it (' + s2.pays + ') is its number beside the old icon, inside the strip',
      s2.pays != null && s2.text === String(s2.pays) && s2.old && s2.inside && s2.dead === 0, JSON.stringify(s2));
    const lv = await sf.evaluate(() => { const b = document.getElementById('leave'); if (!b) return null; const r = b.getBoundingClientRect(); return r.width > 0 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; });
    if (lv) { const fb2 = await (await sf.frameElement()).boundingBox(); await tap(fb2.x + lv.x, fb2.y + lv.y); }
    for (let k = 0; k < 40; k++) { await P.waitForTimeout(300); const up = await P.evaluate(() => [...document.querySelectorAll('iframe')].some(f => /SPOILS_SCREEN|BOHEMIA_FIGHT/.test(f.src) && f.getBoundingClientRect().width > 2 && getComputedStyle(f).visibility !== 'hidden' && getComputedStyle(f).display !== 'none')).catch(() => false); if (!up) break; }
    await P.waitForTimeout(1500);
  } catch (e) { ok('S1 ' + tag + ': the spoils walked', false, String(e && e.message || e).slice(0, 300)); }
}

async function live(page, prof) {
  const tag = page + ' ' + prof.replace('phone_', '');
  console.log('\n-- ' + tag + ' --');
  const asked = [];
  const d = await drive.open(Object.assign({ profile: prof, keepCards: true, beforeTap: async (pg) => { pg.context().on('request', r => { if (/bohemia_the_battery\.js|battery_ladder\//.test(r.url())) asked.push(r.url().replace(/^.*?\/(slices|graveyard)\//, '$1/')); }); await throughTheTitle(pg); } }, page === 'alpha' ? { alpha: true } : {}));
  const P = d.page, errs = []; P.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const shot = async (n) => { if (!SHOTS) return; fs.mkdirSync(SHOTDIR, { recursive: true }); await P.screenshot({ path: path.join(SHOTDIR, 'walk_' + page + '_' + prof.replace('phone_', '') + '_' + n + '.png') }); };
  try {
    await P.waitForTimeout(3000);
    await crewAndSpoils(d, tag, prof, shot);
    /* L1 the bar at a start purse of 290 (the bar counts a big change down on the beat: its last number lands) */
    await d.fr.evaluate(() => { loopSettleBats(290, 'the gate: a start purse'); try { updHud(); } catch (e) {} try { if (window.__barPaintRead) window.__barPaintRead(); } catch (e) {} }); await P.waitForTimeout(1600);
    let b1 = await barRead(d.fr); for (let k = 0; k < 24 && b1 && b1.words !== '290'; k++) { await P.waitForTimeout(500); b1 = await barRead(d.fr); }
    await shot('1_map');
    ok('L1 ' + tag + ': THE BAR reads a purse of 290 as "290" beside the old pile, as before 11/18t, nothing past the glass', !!b1 && b1.words === '290' && b1.old && b1.dead === 0 && b1.right <= b1.w + 1, JSON.stringify(b1));
    let sf = await town(d, '^Mob$'); if (!sf) { ok('L2 ' + tag + ': the Mob\'s town through the map\'s door', false); return; }
    await sf.evaluate(() => BohemiaSettlement.open({ traits: [] })); await P.waitForTimeout(600);
    await openIt(sf, P, 'board'); await shot('2_board');
    const jb = await marks(sf, '#sheet .act.client em i.uc[data-uc="batteries"]', '.act');
    ok('L2 ' + tag + ': THE BOARD: ' + jb.rows.length + ' jobs, each pay its number beside the old mark (' + jb.rows.map(x => x.n).join(', ') + ')', oldOk(jb), oldWhy(jb));
    await openIt(sf, P, 'stall'); await shot('3_stall');
    const sp = await marks(sf, '#sheet .sp', '.sb');
    ok('L3 ' + tag + ': THE STALL: ' + sp.rows.length + ' boxes, every one its number beside the old mark, inside the box', oldOk(sp), oldWhy(sp));
    await openIt(sf, P, 'hall'); await shot('4_hall');
    const hp = await marks(sf, '#sheet b.nsp, #sheet b.nsn', '.act'), rt = await marks(sf, '#sheet .retf > .act > em, #sheet .rett > .act > em', '.act');
    ok('L4 ' + tag + ': THE HALL: ' + hp.rows.length + ' prices and nights beside the old mark inside their buttons; ' + rt.rows.length + ' who would join the camp (' + rt.rows.map(x => x.n).join(', ') + ')',
      oldOk(hp) && (rt.rows.length === 0 || oldOk(rt)), oldWhy(hp) + ' ' + oldWhy(rt));
    const tiles = { rows: [], dead: 0 };
    for (const k of ['smith', 'armourer']) { if (await openIt(sf, P, k) === k) { const m = await marks(sf, '#sheet .slot em.money', '.slot'); tiles.rows = tiles.rows.concat(m.rows); tiles.dead += m.dead; await shot(k === 'smith' ? '5_smith' : '6_armourer'); } }
    ok('L5 ' + tag + ': THE SHELVES: ' + tiles.rows.length + ' price tiles, every one its number beside the old mark, inside its tile', oldOk(tiles), oldWhy(tiles));
    /* L6 the top of CLOUT, a purse of 2,236: the game's own record, the one shortcut, said */
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(400);
    await d.fr.evaluate(() => { BohemiaRenown.add(4000, 'the gate: the top of clout', 'gate:battery'); });
    const { leaveTown } = require(path.join(ROOT, 'tools', 'bohemia_leave_the_town.js'));
    await leaveTown(P, sf, { mouse: !/^phone_/.test(prof), ms: 6000 }).catch(() => {}); await P.waitForTimeout(900);
    await d.fr.evaluate(() => { loopSettleBats(2236, 'the gate: the biggest job'); try { updHud(); } catch (e) {} try { if (window.__barPaintRead) window.__barPaintRead(); } catch (e) {} }); await P.waitForTimeout(1200);
    sf = await town(d, '^Mob$'); if (sf) { await sf.evaluate(() => BohemiaSettlement.open({ traits: [] })); await P.waitForTimeout(600);
      for (let k = 0; k < 4; k++) { await openIt(sf, P, 'board'); if (await sf.waitForFunction(() => BohemiaSettlement.state.open === 'board' && document.querySelectorAll('#sheet .act.client em i.uc[data-uc="batteries"]').length > 0, null, { timeout: 7000 }).then(() => true).catch(() => false)) break; }
      await P.waitForTimeout(2600); await shot('8_top_board'); }
    const b2 = await barRead(d.fr), jt = sf ? await marks(sf, '#sheet .act.client em i.uc[data-uc="batteries"]', '.act') : { rows: [], dead: 1 };
    ok('L6 ' + tag + ': AT THE TOP OF CLOUT WITH 2,236: the bar reads "' + (b2 && b2.words) + '" beside the old pile, inside the glass; the board\'s jobs pay ' + jt.rows.map(x => x.n).join(', ') + ', each beside the old mark',
      !!b2 && b2.words === '2236' && b2.old && b2.dead === 0 && b2.right <= b2.w + 1 && oldOk(jt) && jt.rows.some(x => x.n >= 250), JSON.stringify(b2) + ' ' + oldWhy(jt));
    /* L7 the map's own line when a job is taken: words, letter for letter */
    const said = await d.fr.evaluate(() => { try { loopSay('Contract from Mob: the gate\'s job. Pays 1121 batteries. The job is marked on the map.'); } catch (e) { return { err: String(e) }; } return null; }); await P.waitForTimeout(300);
    const ln = await d.fr.evaluate(() => { const l = document.getElementById('packline'); return l ? { text: l.textContent, dead: l.querySelectorAll('.bsum, [data-bsum]').length, kids: l.children.length } : null; });
    ok('L7 ' + tag + ': the map\'s line for a job taken is its words, letter for letter, nothing drawn in it', !said && !!ln && ln.text === 'Contract from Mob: the gate\'s job. Pays 1121 batteries. The job is marked on the map.' && ln.dead === 0, JSON.stringify(ln || said));
    const before = asked.slice();
    /* L8 planted on the live page: the dead drawing loaded from the graveyard into the town; the same check reads red */
    if (sf) { await openIt(sf, P, 'stall');
      await sf.evaluate((src) => new Promise(r => { const s = document.createElement('script'); s.src = src; s.onload = () => r(true); s.onerror = () => r(false); document.head.appendChild(s); }), '../' + GRAVE + '/bohemia_the_battery.js');
      await sf.evaluate(() => { try { window.__BATTERY_OFF = false; if (window.BohemiaBattery && BohemiaBattery.dress) BohemiaBattery.dress(document.body); } catch (e) {} }); await P.waitForTimeout(1500);   /* the grave's copy carries the coordinator's own off switch (11/20za): the plant turns it on, as a drawing coming back would be on */
      const planted = await marks(sf, '#sheet .sp', '.sb');
      ok('L8 ' + tag + ': PLANTED on the live page: the dead drawing loaded into the town from the graveyard, the stall\'s check reads red (' + planted.dead + ' dead marks)', !oldOk(planted) && planted.dead > 0, oldWhy(planted)); }
    ok('L9 ' + tag + ': nothing threw, and nothing asked for the dead drawing or its pictures before the plant', !errs.filter(e => !/ResizeObserver/.test(e)).length && before.length === 0, errs.slice(0, 2).join(' | ') + ' ' + before.slice(0, 3).join(' '));
  } catch (e) { ok(tag + ': the walk ran', false, String(e && e.stack || e).slice(0, 400)); }
  finally { await d.close(); }
}

(async () => {
  console.log('THE BATTERY IS REAL (rule 459; rule 463: the three batteries are dead; ask line 645; rules 441, 454(a))');
  if (want('data')) data();
  for (const pg of ['demo', 'alpha']) if (want(pg)) for (const pr of PROFS) await live(pg, pr);
  console.log('\nTHE BATTERY IS REAL: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
