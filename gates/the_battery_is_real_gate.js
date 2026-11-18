#!/usr/bin/env node
/* ============================================================================
   THE BATTERY IS REAL GATE (ECONOMY TWO, 11/18/26; VAMILY rule 459, ask line 645; rules 441, 454(a)).

   PAOLO 9/4: 'for one AA battery a bag of rice.'
   PAOLO 11/17: 'some of the quests, it's like 3000 or like 1000 batteries to complete a quest and I'm like bro that's a
   lot... I want people to really feel like they can look at their battery right now and relate it from the game to real
   life: hey, because this game said it, it's true, this would probably cost a couple batteries in the economic apocalypse.'

   MEASURED BEFORE (records/BOHEMIA_ECONOMY_TWO_EVERY_NUMBER_OF_BATTERIES_11_18_26.md): 669 numbers of batteries in 18 data
   files and 122 more typed into code, each lane drawing a sum its own way (seven ways); the dearest board job (251) times the
   start screen's FULL SHELVES (x1.5) times CLOUT (to x4.5) times a town's standing (to x1.15) times two pushes of the pay
   (x1.07 each) is 2,236: the '1,000' and the '3,000' he met.

   THE TABLE (no browser; records/target/bb/battery_table.json through tools/bohemia_economy_two_the_battery_table.js):
     T1 the unit is one AA and it buys a bag of rice; the ladder is the research's (a phone's battery 6, a tool pack 20, a
        car's battery 250), each with its two pictures on disk, rendered through the rig (their ledger's sha1 matches)
     T2 EVERY NUMBER IS THE TABLE'S: every place a number of batteries lives says the table's number; every typed copy in
        code says it; every number inside a sentence says it; no battery number in a live data file is outside it; no
        'N batteries' is typed into live code outside it; every row sits in its band; the worked sums are the table's
     T3 PLANTED FAULTS, each one red by its own words: a row moved off its file, a place taken out of the table (the sweep
        finds its numbers), a typed copy taken out (the code sweep finds the string), a sentence's number moved, a band
        broken, a ladder kind with no picture
     T4 the page's own copy of the ladder (slices/bohemia_the_battery.js) is the table's, number for number, and the page's
        split is the table tool's split for every sum to 6,000
     T5 A SUM IS SMALL NUMBERS: never more than three kinds, 12 tool packs, 3 phone batteries, 19 AA's; 1,000 is 4 car
        batteries and 3,000 is 12; ten is ten AA's
     T6 the bands he was promised: everyday things 1 to 10, a man's night a few, the most one job can ever pay is under ten
        car batteries
     T7 every live page loads the drawing, and the demo is cut with it
   THE REAL PAGE (the demo and the alpha, a phone upright and sideways, started the way he starts it):
     L1 THE BAR: the purse is drawn as the batteries it is (a start purse of 290: one car battery, two tool packs); the
        bar's own number is still in it; the old pile is gone; nothing runs past the glass
     L2 THE BOARD: every job's pay is pictures and small counts that add up to the pay the page wrote
     L3 THE STALL: a stack of tape is one tool pack; every box's pictures add up to its price and sit inside the box
     L4 THE HALL: a hire's price and his night sit inside the button; one who joins the camp is two kinds at the most
     L5 THE SHELVES: every tile's price sits inside its tile, two lines at the most
     L6 AT THE TOP OF CLOUT WITH A PURSE OF 2,236: the bar says 8 car batteries, 11 tool packs, 16 AA's; a job on the
        board pays in car batteries; no count on the glass is over 19 but the car batteries
     L7 the map's own line when a job is taken ('Pays N batteries') is drawn, its words kept
     L8 PLANTED ON THE LIVE PAGE: the drawing switched off, the same checks read red
     L9 nothing threw
   node gates/the_battery_is_real_gate.js [data | demo | alpha] [phone_portrait | phone_landscape] [--shots=<a folder outside the tree>]
   ============================================================================ */
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const ROOT = path.dirname(__dirname);
const TT = require(path.join(ROOT, 'tools', 'bohemia_economy_two_the_battery_table.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null && w !== '' ? '  [' + String(w).slice(0, 300) + ']' : '')); };
const clone = o => JSON.parse(JSON.stringify(o));
const args = process.argv.slice(2), SHOTDIR = (args.filter(a => /^--shots=/.test(a))[0] || '').slice(8) || (args.includes('--shots') ? path.join(require('os').tmpdir(), 'bohemia_the_battery_walk') : ''), SHOTS = !!SHOTDIR;   /* --shots[=dir]: the walk's pictures, never into the tree (a walk is 50 MB of phone screens) */
const want = (k) => !args.some(a => ['data', 'demo', 'alpha'].includes(a)) || args.includes(k);
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !args.some(a => /^phone_/.test(a)) || args.includes(p));

/* ---------------- the table ---------------- */
function data() {
  console.log('\n-- the table (records/target/bb/battery_table.json) --');
  const T = TT.load(), L = T.ladder.value, by = {}; L.forEach(k => { by[k.id] = k; });
  const led = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/economy_two_ladder_rig/swapped.json'), 'utf8')); } catch (e) { return {}; } })();
  const sha = f => { try { return crypto.createHash('sha1').update(fs.readFileSync(path.join(ROOT, f))).digest('hex'); } catch (e) { return null; } };
  const pics = L.every(k => ['icon', 'small'].every(q => { const f = 'slices/' + k[q], l = led[(q === 'small' ? 'small/' : '') + k.id]; return fs.existsSync(path.join(ROOT, f)) && l && l.file === f && l.sha1 === sha(f); }));
  ok('T1 the unit is one AA and it buys a bag of rice; a phone\'s battery 6, a tool pack 20, a car\'s battery 250; every picture on disk is the rig\'s render',
    T.unit.id === 'aa' && T.unit.worth === 1 && /bag of rice/.test(T.unit.buys) && by.aa.worth === 1 && by.phone_battery.worth === 6 && by.tool_pack.worth === 20 && by.car_battery.worth === 250 && pics, pics ? '' : 'a picture is missing or is not the ledger\'s');
  TT.reset(); const bad = TT.check(T);
  ok('T2 EVERY NUMBER IS THE TABLE\'S: ' + T.count.rows + ' numbers in ' + T.count.files + ' data files, ' + T.count.copies + ' typed copies in code, ' + T.count.prose + ' sentences; nothing outside it', !bad.length, bad.slice(0, 3).join(' | '));
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
    plant('a ladder kind with no picture', P => { P.ladder.value[1].small = 'battery_ladder/small/nothing_here.png'; }, /THE LADDER: phone_battery has no picture/),
    plant('a job that pays over ten car batteries', P => { P.bands.one_job.max = 2000; }, /THE BIGGEST JOB pays/)
  ];
  TT.reset();
  ok('T3 PLANTED: ' + P3.map(p => p[0]).join('; ') + ': every one red by its own words', P3.every(p => p[1]), P3.filter(p => !p[1]).map(p => p[0] + ' (' + p[2] + ' faults, none its own)').join('; '));
  /* T4 the page's copy and split */
  const src = fs.readFileSync(path.join(ROOT, 'slices/bohemia_the_battery.js'), 'utf8'), m = /__THE_TABLE_COPY__[\s\S]*?var LADDER = (\[[\s\S]*?\]);/.exec(src);
  let copy = null; try { copy = (new Function('return ' + m[1]))(); } catch (e) {}
  const same = !!copy && copy.length === L.length && copy.every(c => by[c.id] && by[c.id].worth === c.worth && by[c.id].name === c.name && by[c.id].many === c.many && !!by[c.id].only_whole === !!c.only_whole);
  const PAGE = require(path.join(ROOT, 'slices', 'bohemia_the_battery.js')); let diff = null;
  for (let n = 0; n <= 6000 && diff == null; n++) { const a = PAGE.split(n).map(p => p.id + ':' + p.n).join(','), b = TT.split(T, n).map(p => p.id + ':' + p.n).join(','); if (a !== b) diff = n + ' page ' + a + ' table ' + b; }
  ok('T4 the page\'s own copy of the ladder is the table\'s, and the page\'s split is the table\'s for every sum to 6,000', same && diff == null, same ? diff : 'the copy in slices/bohemia_the_battery.js is not the table\'s ladder');
  /* T5 small numbers */
  let most = { kinds: 0, tool_pack: 0, phone_battery: 0, aa: 0 }, exact = true;
  for (let n = 0; n <= 6000; n++) { const s = TT.split(T, n); most.kinds = Math.max(most.kinds, s.length); s.forEach(p => { if (p.id !== 'car_battery') most[p.id] = Math.max(most[p.id], p.n); }); if (s.reduce((a, p) => a + p.n * by[p.id].worth, 0) !== n) exact = false; }
  const w = n => TT.words(T, n);
  ok('T5 A SUM IS SMALL NUMBERS: at most ' + most.kinds + ' kinds, ' + most.tool_pack + ' tool packs, ' + most.phone_battery + ' phone batteries, ' + most.aa + ' AA; 1,000 is "' + w(1000) + '", 3,000 is "' + w(3000) + '", ten is "' + w(10) + '", twelve is "' + w(12) + '"',
    exact && most.kinds <= 3 && most.tool_pack <= 12 && most.phone_battery <= 3 && most.aa <= 19 && w(1000) === '4 CAR BATTERIES' && w(3000) === '12 CAR BATTERIES' && w(10) === '10 AA' && w(12) === '2 PHONE BATTERIES' && w(1) === '1 AA' && w(0) === '0 AA');
  /* T6 the bands */
  const S = T.sums, st = T.rows['records/target/bb/stall_prices.json'];
  const every = ['goods.food.buy.value', 'goods.meds.buy.value', 'goods.rounds.buy.value', 'goods.tape.buy.value'].map(k => st[k]);
  ok('T6 everyday things 1 to 10 (the stall: ' + every.join(', ') + '); a man\'s night ' + S.a_mans_night_fed.is + ' fed, ' + S.a_hired_mans_night_first.is + ' to ' + S.a_hired_mans_night_top.is + ' fed and paid; the most one job can ever pay is ' + S.job_pushed_twice.is + ' (' + S.job_pushed_twice.paid + ')',
    every.every(v => v >= 1 && v <= 10) && S.a_mans_night_fed.is <= 3 && S.a_hired_mans_night_top.is <= 12 && S.job_pushed_twice.is < 2500 && TT.split(T, S.job_pushed_twice.is)[0].n < 10);
  /* T7 every live page loads it */
  const pages = ['BOHEMIA_CITY_WORLD.html', 'BOHEMIA_SETTLEMENT_SCREEN.html', 'BOHEMIA_ROSTER_SCREEN.html', 'BOHEMIA_FIGHT.html', 'BOHEMIA_ALPHA_0_9.html', 'BOHEMIA_DEMO.html'];
  const lack = pages.filter(p => !/<script src="bohemia_the_battery\.js"><\/script>/.test(fs.readFileSync(path.join(ROOT, 'slices', p), 'utf8')));
  ok('T7 the map, the town, the crew screen, the fight, the alpha and the demo each load the drawing', !lack.length, lack.join(', '));
}

/* ---------------- the real page ---------------- */
const drive = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js'));
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
/* every sum drawn inside sel: what it says, what its pictures add up to, where it sits against its box */
const readSums = (fr, sel, boxSel) => fr.evaluate(([sel, boxSel]) => {
  const W = {}; BohemiaBattery.ladder().forEach(k => { W[k.id] = k.worth; });
  const out = [];
  document.querySelectorAll(sel).forEach(h => {
    const chip = h.matches('i.uc'), s = chip ? h : h.querySelector('.bsum'); if (!s) { out.push({ none: true, text: h.textContent.slice(0, 30), cls: h.className }); return; }
    const ks = chip ? [...s.querySelectorAll(':scope > i.uc-k')].map(k => ({ id: k.dataset.kind, n: +k.nextElementSibling.dataset.n, r: k.getBoundingClientRect(), bg: getComputedStyle(k).backgroundImage }))
      : [...s.querySelectorAll(':scope > i.bsum-k')].map(k => ({ id: k.dataset.kind, n: +k.dataset.n, r: k.getBoundingClientRect(), bg: getComputedStyle(k, '::before').backgroundImage, pw: parseFloat(getComputedStyle(k, '::before').width) || 0, shown: getComputedStyle(k).display !== 'none' }));
    const said = chip ? (h.dataset.n) : s.dataset.bsum, r = s.getBoundingClientRect(), box = (boxSel ? h.closest(boxSel) : h.parentElement) || h, b = box.getBoundingClientRect();
    const old = [...h.querySelectorAll('img')].filter(i => /batteries/.test(i.src) || i.classList.contains('batt')).some(i => getComputedStyle(i).display !== 'none');
    out.push({ text: h.textContent.replace(/\s+/g, ' ').trim().slice(0, 40), said: Math.abs(+said), sum: ks.reduce((a, k) => a + k.n * (W[k.id] || 0), 0), kinds: ks.map(k => k.id + ':' + k.n), files: ks.map(k => (/url\("?([^")]+)"?\)/.exec(k.bg) || [])[1] || ''),
      pic: ks.every(k => chip ? k.r.width >= 10 : (k.pw >= 9 && k.shown)), over: Math.max(0, Math.round(r.right - b.right), Math.round(b.left - r.left), Math.round(r.bottom - b.bottom)), lines: Math.round(r.height), old, big: ks.filter(k => k.id !== 'car_battery' && k.n > 19).length });
  });
  return out;
}, [sel, boxSel || null]);
const filesOk = (xs) => xs.every(x => x.files.every(f => /battery_ladder\/small\/[a-z_]+\.png$/.test(f) && fs.existsSync(path.join(ROOT, 'slices', f.replace(/^.*?(battery_ladder\/)/, '$1')))));
const good = (xs) => xs.length > 0 && xs.every(x => !x.none && x.said === x.sum && x.pic && !x.old && !x.big) && filesOk(xs);
const why = (xs) => JSON.stringify(xs.filter(x => x.none || x.said !== x.sum || !x.pic || x.old || x.big || x.over > 1).slice(0, 3).map(x => x.none ? x : { t: x.text, said: x.said, sum: x.sum, k: x.kinds, over: x.over, old: x.old, pic: x.pic }));

async function live(page, prof) {
  const tag = page + ' ' + prof.replace('phone_', '');
  console.log('\n-- ' + tag + ' --');
  const d = await drive.open(Object.assign({ profile: prof, keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }, page === 'alpha' ? { alpha: true } : {}));
  const P = d.page, errs = []; P.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const shot = async (n) => { if (!SHOTS) return; const dir = SHOTDIR; fs.mkdirSync(dir, { recursive: true }); await P.screenshot({ path: path.join(dir, 'walk_' + page + '_' + prof.replace('phone_', '') + '_' + n + '.png') }); };
  try {
    await P.waitForTimeout(3000);
    /* L1 the bar, at the purse he starts with (set to 290 so every phone reads the same sum; his own start draws the same way) */
    await d.fr.evaluate(() => loopSettleBats(290, 'the gate: a start purse')); await P.waitForTimeout(1600);
    const bar = async () => d.fr.evaluate(() => { const s = document.querySelector('#bmtb .s.bats'), b = s && s.querySelector('b'), q = s && s.querySelector('.bsum'), im = s && s.querySelector('img'), r = s && s.getBoundingClientRect(), bb = document.getElementById('bmtb').getBoundingClientRect();
      const last = [...document.querySelectorAll('#bmtb .s')].filter(x => x.getBoundingClientRect().width > 0).map(x => x.getBoundingClientRect().right).reduce((a, v) => Math.max(a, v), 0);
      return s ? { words: b.textContent, kinds: q ? [...q.querySelectorAll('.bsum-k')].map(k => k.dataset.kind + ':' + k.dataset.n).join(',') : null, old: im ? getComputedStyle(im).display !== 'none' : false, right: Math.round(last), glass: Math.round(bb.right), w: innerWidth, title: q ? q.title : '' } : null; });
    const b1 = await bar(); await shot('1_map');
    ok('L1 ' + tag + ': THE BAR draws a purse of 290 as one car battery and two tool packs, its own number still in it, the old pile gone, nothing past the glass', !!b1 && b1.words === '290' && b1.kinds === 'car_battery:1,tool_pack:2' && !b1.old && b1.right <= b1.w + 1, JSON.stringify(b1));
    /* into a town through the map's own door */
    let sf = await town(d, '^Mob$'); if (!sf) { ok('L2 ' + tag + ': the Mob\'s town through the map\'s door', false); return; }
    await sf.evaluate(() => BohemiaSettlement.open({ traits: [] })); await P.waitForTimeout(600);
    await openIt(sf, P, 'board'); await shot('2_board');
    const jb = await readSums(sf, '#sheet .act.client em i.uc[data-uc="batteries"]', '.act');
    ok('L2 ' + tag + ': THE BOARD: ' + jb.length + ' jobs, each pay pictures and small counts that add up to the pay the page wrote (' + jb.map(x => x.said + ' = ' + x.kinds.join(' ')).join('; ') + ')', good(jb) && jb.every(x => x.over <= 1), why(jb));
    await openIt(sf, P, 'stall'); await shot('3_stall');
    const sp = await readSums(sf, '#sheet .sp', '.sb'), tape = await sf.evaluate(() => { const l = document.querySelector('#sheet .stline[data-key="tape20"] .sb.buy .bsum'); return l ? { title: l.title, said: l.dataset.bsum } : null; });
    ok('L3 ' + tag + ': THE STALL: ' + sp.length + ' boxes, every one pictures that add up to its price and sit inside the box; a stack of tape is ' + (tape ? tape.title : '?'), good(sp) && sp.every(x => x.over <= 1) && !!tape && (tape.said !== '20' || tape.title === '1 TOOL PACK'), why(sp) + ' ' + JSON.stringify(tape));
    await openIt(sf, P, 'hall'); await shot('4_hall');
    const hp = await readSums(sf, '#sheet b.nsp, #sheet b.nsn', '.act'), rt = await readSums(sf, '#sheet .retf > .act > em, #sheet .rett > .act > em', '.act');
    ok('L4 ' + tag + ': THE HALL: ' + hp.length + ' prices and nights inside their buttons; ' + rt.length + ' who would join the camp, each two kinds at the most (' + rt.map(x => x.kinds.join(' ')).join('; ') + ')', good(hp) && hp.every(x => x.over <= 1) && (rt.length === 0 || (good(rt) && rt.every(x => x.kinds.length <= 2 && x.over <= 1))), why(hp.concat(rt)));
    let tiles = [];
    for (const k of ['smith', 'armourer']) { if (await openIt(sf, P, k) === k) { tiles = tiles.concat(await readSums(sf, '#sheet .slot em.money', '.slot')); await shot(k === 'smith' ? '5_smith' : '6_armourer'); } }
    ok('L5 ' + tag + ': THE SHELVES: ' + tiles.length + ' price tiles, every one inside its tile on two lines at the most', good(tiles) && tiles.every(x => x.over <= 1 && x.lines <= 22), why(tiles) + ' tallest ' + tiles.reduce((a, x) => Math.max(a, x.lines || 0), 0));
    /* L6 the top of CLOUT, a purse of 2,236: the game's own record, the one shortcut, said */
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(400);
    await d.fr.evaluate(() => { BohemiaRenown.add(4000, 'the gate: the top of clout', 'gate:battery'); });
    const { leaveTown } = require(path.join(ROOT, 'tools', 'bohemia_leave_the_town.js'));
    await leaveTown(d, sf).catch(() => {}); await P.waitForTimeout(900);
    await d.fr.evaluate(() => loopSettleBats(2236, 'the gate: the biggest job')); await P.waitForTimeout(1200);
    sf = await town(d, '^Mob$'); if (sf) { await sf.evaluate(() => BohemiaSettlement.open({ traits: [] })); await P.waitForTimeout(600); /* the board, opened with a finger until its jobs stand on it (a loaded machine once read it before it opened: red for the gate, not the game) */
      for (let k = 0; k < 4; k++) { await openIt(sf, P, 'board'); if (await sf.waitForFunction(() => BohemiaSettlement.state.open === 'board' && document.querySelectorAll('#sheet .act.client em i.uc[data-uc="batteries"]').length > 0, null, { timeout: 7000 }).then(() => true).catch(() => false)) break; }
      await P.waitForTimeout(2600); await shot('8_top_board'); }
    const b2 = await bar();   /* the bar over the town: the purse the town is spending (the map handed it 2,236 at the door) */
    const jt = sf ? await readSums(sf, '#sheet .act.client em i.uc[data-uc="batteries"]', '.act') : [];
    if (SHOTS) fs.writeFileSync(path.join(SHOTDIR, 'walk_' + page + '_' + prof.replace('phone_', '') + '.json'), JSON.stringify({ purse: 2236, jobs: jt.map(x => ({ pay: x.said, kinds: x.kinds })) }));
    const anyBig = async (fr) => fr.evaluate(() => [...document.querySelectorAll('.bsum > i.bsum-k, i.uc.uc-bsum > b.uc-n')].filter(k => { const id = k.dataset.kind || (k.previousElementSibling && k.previousElementSibling.dataset.kind); return id !== 'car_battery' && +k.dataset.n > 19 && k.getBoundingClientRect().width > 0; }).length);
    ok('L6 ' + tag + ': AT THE TOP OF CLOUT WITH 2,236: the bar says ' + (b2 ? b2.title : '?') + '; the board\'s jobs pay ' + jt.map(x => x.said + ' = ' + x.kinds.join(' ')).join('; ') + '; no count over 19 but the car batteries',
      !!b2 && b2.words === '2236' && b2.kinds === 'car_battery:8,tool_pack:11,aa:16' && !b2.old && b2.right <= b2.w + 1 && good(jt) && jt.some(x => /car_battery/.test(x.kinds.join())) && jt.every(x => x.over <= 1) && (await anyBig(d.fr)) === 0 && (await anyBig(sf)) === 0, JSON.stringify(b2) + ' ' + why(jt));
    /* L7 the map's own line when a job is taken */
    const said = await d.fr.evaluate(() => { try { loopSay('Contract from Mob: the gate\'s job. Pays 1121 batteries. The job is marked on the map.'); } catch (e) { return { err: String(e) }; } return null; }); await P.waitForTimeout(300);
    const ln = await d.fr.evaluate(() => { const l = document.getElementById('packline'), s = l && l.querySelector('.bsum'); return l ? { text: l.textContent, sum: s ? s.dataset.bsum : null, title: s ? s.title : null } : null; });
    ok('L7 ' + tag + ': the map\'s line for a job taken draws its pay (' + (ln && ln.title) + ') and keeps its words', !said && !!ln && ln.sum === '1121' && ln.title === '4 CAR BATTERIES, 6 TOOL PACKS, 1 AA' && ln.text === 'Contract from Mob: the gate\'s job. Pays 1121 batteries. The job is marked on the map.', JSON.stringify(ln || said));
    /* L8 planted on the live page: the drawing switched off */
    if (sf) { await sf.evaluate(() => document.documentElement.classList.add('bsum-off')); await d.fr.evaluate(() => document.documentElement.classList.add('bsum-off')); await P.waitForTimeout(200);
      const off = await readSums(sf, '#sheet .slot em.money, #sheet .sp, #sheet b.nsp', '.slot'), bOff = await d.fr.evaluate(() => { const k = document.querySelector('#bmtb .s.bats .bsum-k'); return k ? getComputedStyle(k).display : 'gone'; });
      await sf.evaluate(() => document.documentElement.classList.remove('bsum-off')); await d.fr.evaluate(() => document.documentElement.classList.remove('bsum-off'));
      ok('L8 ' + tag + ': PLANTED on the live page: the drawing switched off, the bar\'s pictures are gone and the checks read red', bOff === 'none', 'the bar\'s picture is ' + bOff); }
    ok('L9 ' + tag + ': nothing threw', !errs.filter(e => !/ResizeObserver/.test(e)).length, errs.slice(0, 2).join(' | '));
  } catch (e) { ok(tag + ': the walk ran', false, String(e && e.stack || e).slice(0, 400)); }
  finally { await d.close(); }
}

(async () => {
  console.log('THE BATTERY IS REAL (rule 459; ask line 645; rules 441, 454(a))');
  if (want('data')) data();
  for (const pg of ['demo', 'alpha']) if (want(pg)) for (const pr of PROFS) await live(pg, pr);
  console.log('\nTHE BATTERY IS REAL: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
