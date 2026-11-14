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
     E8  THE PLACE REMEMBERS (rule 412): planting, a move-in, a prize, a name, a build are kept; a resident tells one, 'you' in its act,
         'your father' one on, 'your granddad' two on; planted: a story told in act 3 that still says 'you' is caught
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

     D9  (round two, rule 440(d)) the people who moved in STAND in his place and a tap on one opens her face and a line of the
         place's story, LIVES HERE; the BUILD door is never under one of them; planted: the residents taken off the message, none stands
     D10 he picks the lot on the plan and the next build goes on it; CLEAR on the desk takes it down; the sheet stays under half the glass
     D12 (row 549) BETTER / GO THERE points at a street he can stand on beside a block that can be planted, from where nothing can
         be; planted: a target that is not walkable is caught
     D13 EACH BUILD WHOLE at his place (rule 443(f)): its row says its battery and goods and what it gives; building it takes the goods
         out of the company's supplies (the top bar's counts); a build short of its goods is greyed; the morning puts what stands into
         the supplies (planted: the morning hook taken out gives nothing, caught); a resident works one and it gives more; a roof
         finished brings a family to live there
     D15 WHAT YOU BUILD OPENS A DOOR (rule 445(b)): with no vendor stall his place's STALL is shut and says what opens it, the CLINIC
         shut until a roof; a vendor stall standing, the same real tap trades; the desk says YOUR PLACE CAN TRADE, MEND (shut), HEAL (shut).
         PLANTED: the rows taken off the message, the clinic opens for free and the leg is red.
     D14 EVERYTHING HIS LIVES THERE (rule 445): THE SEAM, BohemiaHomeMap.give(): a boss's prize killed before he plants WAITS and
         says so (the feed, the phone's page); planting places it; THE POT's, THE TAP's and THE FILTER's prizes stand on his place's
         back lots, each a door on the town screen with its own picture, a tap says what it is and who gave it; two builds handed
         through the seam stand on free lots; the same thing given twice is one; planted: the things taken off the message leave no
         door, red; a thing of no known kind is refused
     D11 ONLY THE PLANTED PLACE IS HIS (rule 442(c), his YES: 'The only place that will be mine on the map is where we decide the custom
         settlement is, that's it'): a fresh game, before planting, has NO place of his (his outfit's camp not on the map, not in the
         ledger, not named on it, no base answers his); a boss's fall handing him the nearest town is refused by the ledger; after
         planting EXACTLY ONE, the planted block; a saved game opened again (CONTINUE) still has exactly one, at the same block;
         planted: a second place written his past the guard is counted, red

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
H.prizesFrom(rec, { cook: { from: 'THE POT', day: 4 } }); H.rename(rec, 'casa gate'); H.note(rec, { kind: 'built', what: 'GARDEN BED', day: 6, act: 1 });
const kinds = rec.story.map(e => e.kind).join(',');
ok('E8 the place remembers: ' + kinds, ['planted', 'moved_in', 'prize', 'named', 'built'].every(k => kinds.indexOf(k) >= 0));
const linesAt = a => { const o = []; for (let dd = 1; dd <= 40; dd++) o.push(H.tell(rec, 'GATE MAN', a, dd)); return o.filter(Boolean); };
const L1 = linesAt(1), L2 = linesAt(2), L3 = linesAt(3);
const saysYou = l => /(^|\. )You |\byou (let|planted|named|put|carried)/.test(l);
const actOk = (L, want, not) => L.some(l => want.test(l)) && !L.some(l => not(l));
ok('E8 told from his mouth, in its own act: "' + L1.filter(saysYou)[0] + '"', actOk(L1, /(^|\. )You |\byou /, l => /father|granddad/i.test(l)));
ok('E8 one act on: "' + L2.filter(l => /father/i.test(l))[0] + '"', actOk(L2, /your father/i, l => saysYou(l) || /granddad/i.test(l)));
ok('E8 two acts on: "' + L3.filter(l => /granddad/i.test(l))[0] + '"', actOk(L3, /your granddad/i, l => saysYou(l) || /father/i.test(l)));
ok('E8 planted: act one\'s lines held to act three\'s rule are caught', !actOk(L1, /your granddad/i, l => saysYou(l) || /father/i.test(l)));
const rS = H.make('SEAM'), gw = H.give(rS, { id: 'prize:cook', kind: 'prize', name: 'HIS POT', from: 'THE POT' });
H.plant(rS, { x: 2, y: 2 }, 3, gG); const pw = H.placeWaiting(rS, {}), gb = H.give(rS, { id: 'gift:x', kind: 'nonsense' });
ok('E9 the seam: a prize before planting waits, planting places it on the back lot (' + (pw[0] && pw[0].lot) + '), a thing of no known kind is refused', gw.waiting && pw.length === 1 && pw[0].lot === 11 && !gb.ok && H.give(rS, { id: 'prize:cook', kind: 'prize' }).again, JSON.stringify({ gw, pw, gb }));
const rT = H.make('SEAM2'); H.plant(rT, { x: 2, y: 2 }, 3, gG); const gt = H.give(rT, { id: 'trophy:x', kind: 'trophy', name: 'A HORN', from: 'THE RANCH' }, { 11: 1, 10: 1 });
const offBuilt = (g, taken) => !!g.placed && g.thing.lot >= 0 && !taken[g.thing.lot];
ok('E9 a trophy never stands on a lot a build holds (the back two built on: it takes lot ' + (gt.thing && gt.thing.lot) + ')', offBuilt(gt, { 11: 1, 10: 1 }));
ok('E9 planted: a prize put down on a built lot is caught', !offBuilt({ placed: true, thing: { lot: 11 } }, { 11: 1 }));
const waits = g => !!g.waiting && !g.placed;
ok('E9 planted: a prize placed at once before he plants (no place yet) is caught', !waits({ ok: true, placed: true, thing: { lot: 11 } }) && waits(gw));
const gp = H.give(rT, { id: 'person:x', kind: 'person', name: 'GATE OKAFOR', from: 'THE RETINUE', look: { hair: 'gate' } });
ok('E9 a person handed through the seam lives there (' + rT.residents.map(r => r.name).join(',') + ')', gp.placed && rT.residents.some(r => r.name === 'GATE OKAFOR' && r.look && r.look.hair === 'gate'));
if (process.argv.includes('--engine')) done();

/* ---------------- ON THE DEMO ---------------- */
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle, continueThroughTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const ONLY = arg('--only');
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !ONLY || p === ONLY);
async function box(P, sel) { return P.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return null;
  const r = e.getBoundingClientRect(); if (r.width < 2) return null; const h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, hit: !!h && e.contains(h), dis: !!e.disabled, on: r.right <= innerWidth && r.bottom <= innerHeight && r.left >= 0 && r.top >= 0 }; }, sel).catch(() => null); }
/* how many places are HIS, read from every place the map knows and the ledger itself (never from lotIsMine alone, which is the guard) */
const HIS = () => { const H = BohemiaHomeBases, r = hbRec(), bs = ctBases() || {}, m = BohemiaBetween.mine(), names = Object.keys(bs);
  (window.BOH_REGION && BOH_REGION.places || []).forEach(p => names.push(p.name));
  const ledger = names.filter(n => { try { return H.heldBy(r, n, r.act) === H.YOU; } catch (e) { return false; } });
  const mine = names.filter(n => { try { return lotIsMine(n); } catch (e) { return false; } });
  return { onMap: !!bs[m], at: bs[m] ? [bs[m].x, bs[m].y] : null, ledger, mine, seats: (turfSeats() || []).filter(x => x.faction === m).length, plates: (window.__MAP_PLATE_NAMES || []).filter(Boolean) }; };
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
    const spot = await F.evaluate(() => { try { loopClose(); } catch (e) {} const x0 = city.x, y0 = city.y; let best = null, blk = null;
      for (let r = 2; r < 24 && !best; r++) for (let dy = -r; dy <= r && !best; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        /* row 549: he stands on the STREET (walkable, not itself a place) and the block beside it is the place */
        const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const own = BohemiaHome.grade(BohemiaHomeMap.probe(x, y)); if (own && own.ok) continue;
        const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.g && ch.g.ok && ch.side) { best = [x, y, ch.g.water, ch.g.road]; blk = [ch.x, ch.y, ch.side]; break; } }
      const bad = (function () { for (let r = 0; r < 40; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue;
        const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.g && !ch.g.ok) return [x, y]; } return null; })();
      city.x = bad[0]; city.y = bad[1]; try { render(); } catch (e) {} return { best, bad, blk }; });
    await P.waitForTimeout(900);
    const b1m = await box(P, '#bohphone .bpctx .pl');
    ok('D1 day 1 on the map: still no PLANT (never in the first minute)', !b1m);
    await F.evaluate(() => { try { render(); } catch (e) {} }); await P.waitForTimeout(500);
    const h0 = await F.evaluate(HIS);
    ok('D11 a fresh game, before planting: NO place of his (camp on the map ' + h0.onMap + ', ledger ' + h0.ledger.length + ', yours ' + h0.mine.length + ', seat ' + h0.seats + ', named CUSTOM/YOUR CAMP ' + h0.plates.some(t => /CUSTOM|YOUR CAMP/.test(t)) + ')',
       !h0.onMap && !h0.ledger.length && !h0.mine.length && !h0.seats && !h0.plates.some(t => /CUSTOM|YOUR CAMP/.test(t)), JSON.stringify(h0));
    const w14 = await F.evaluate(async () => { const S = BohemiaBosses.state(); S.verbs.cook = S.verbs.cook || { from: 'THE POT', day: 1, last: null, uses: 0 };
      for (let i = 0; i < 30 && !(BohemiaHomeMap.state().waiting || []).length; i++) await new Promise(r => setTimeout(r, 200));
      const st = BohemiaHomeMap.state(), feed = (window.BOHEMIA_FEED && BOHEMIA_FEED.posts ? BOHEMIA_FEED.posts() : []).map(p => p.txt || '').filter(t => /waits/.test(t));
      return { waiting: (st.waiting || []).map(w => w.name), planted: st.planted, given: window.__HOME_GIVEN || [] }; });
    ok('D14 THE POT killed before he plants: his pot WAITS for a place (' + w14.waiting.join(',') + ')', !w14.planted && w14.waiting.length === 1 && w14.given.some(g => g.id === 'prize:cook' && g.waiting), JSON.stringify(w14));
    const boss = await F.evaluate(() => { const H = BohemiaHomeBases, bs = ctBases(), n = Object.keys(bs)[0]; const r = H.took(hbRec(), { base: n, to: H.YOU, by: 'boss', why: 'THE TAP', day: 2 }); return { n, r, his: lotIsMine(n) }; });
    ok('D11 a boss\'s fall handing him ' + boss.n + ' is refused by the ledger (' + (boss.r && boss.r.reason) + ')', boss.r && !boss.r.applied && boss.r.reason === 'ONLY_THE_PLANTED_PLACE' && !boss.his, JSON.stringify(boss));
    await F.evaluate(() => { DAY.day = 2; try { render(); } catch (e) {} }); await P.waitForTimeout(1200);
    const b2 = await box(P, '#bohphone .bpctx .pl');
    ok('D2 day 2 on the map: PLANT on the glass in the band, the finger lands on it', !!b2 && b2.hit && b2.on, JSON.stringify(b2));
    if (b2) await P.touchscreen.tap(b2.x, b2.y); await P.waitForTimeout(1100);
    const t3 = await phoneText(P), pb3 = await box(P, '#bohphone .hb button[data-h="plant"]');
    ok('D3 on ground he can stand on with nothing to plant on it or beside it: the page grades it and PLANT HERE is off, NOT HERE said', /WATER/.test(t3) && /POWER/.test(t3) && /ROAD/.test(t3) && /DANGER/.test(t3) && pb3 && pb3.dis && /NOT HERE/.test(t3), t3.replace(/\n/g, ' '));
    const b12 = await F.evaluate(() => { const st = BohemiaHomeMap.state(), b = st.better; if (!b) return { none: true };
      const ch = BohemiaHomeMap.choose(b.x, b.y); return { b, walk: cityWalkable(b.x, b.y), ok: !!(ch && ch.g && ch.g.ok), planted: ch ? [ch.x, ch.y] : null }; });
    ok('D12 (row 549) from where nothing can be planted, BETTER points ' + (b12.b ? b12.b.d + ' ' + b12.b.dir : 'nowhere') + ' at a street he can stand on, and from there PLANT HERE works', !b12.none && b12.walk && b12.ok, JSON.stringify(b12));
    /* planted: the leg's own test aimed at the OLD target (a plantable block he cannot stand on, what GO THERE used to park beside) */
    const m12 = await F.evaluate(() => { for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) { const g = BohemiaHome.grade(BohemiaHomeMap.probe(x, y));
      if (g && g.ok && !cityWalkable(x, y)) { const ch = BohemiaHomeMap.choose(x, y); return { at: [x, y], pass: cityWalkable(x, y) && !!(ch && ch.g && ch.g.ok) }; } } return null; });
    ok('D12 planted: the same test aimed at a plantable block he cannot stand on (' + (m12 && m12.at) + ', the old target) is red', !!m12 && m12.pass === false, JSON.stringify(m12));
    await F.evaluate(s => { city.x = s[0]; city.y = s[1]; try { render(); } catch (e) {} }, spot.best); await P.waitForTimeout(1500);
    const t3b = await phoneText(P), pb3b = await box(P, '#bohphone .hb button[data-h="plant"]');
    ok('D3 (row 549) on the street beside a block with water ' + spot.best[2] + ' and road ' + spot.best[3] + ': THE BLOCK ' + spot.blk[2] + ', PLANT HERE is on', !!pb3b && !pb3b.dis && pb3b.hit && /THE BLOCK/.test(t3b), t3b.replace(/\n/g, ' '));
    ok('D14 the YOUR PLACE page says it: WAITING FOR YOUR PLACE: ' + (t3b.match(/WAITING FOR YOUR PLACE: ([^\n]*)/) || [])[1], /WAITING FOR YOUR PLACE: .*POT/.test(t3b), t3b.replace(/\n/g, ' '));
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
               again: BohemiaHome.plant(BohemiaHomeMap.rec(), { x: 3, y: 3 }, 9).why, saved: JSON.parse(localStorage.getItem('bohemia.home.v1') || '{}').planted }; }, spot.blk);
    await P.waitForTimeout(6000);
    await F.evaluate(() => { try { render(); } catch (e) {} }); await P.waitForTimeout(600);
    const plates = await F.evaluate(() => (window.__MAP_PLATE_NAMES || []).filter(Boolean));
    ok('D5 planted the block ' + spot.blk[2] + ', ' + spot.blk.slice(0, 2) + ': his outfit\'s seat IS the block (bases ' + a5.base + ', seat ' + a5.seat + ')', a5.st.planted && a5.base[0] === spot.blk[0] && a5.base[1] === spot.blk[1] && a5.seat && a5.seat[0] === spot.blk[0], JSON.stringify(a5).slice(0, 300));
    ok('D5 the painter is handed his place\'s foot (' + a5.foot + ' in the key)', (await F.evaluate(() => VB_TOWNS.key || '')).indexOf(a5.foot) >= 0);
    ok('D5 the map names it his (' + a5.st.name + '), never CUSTOM', plates.indexOf(a5.st.name) >= 0 && plates.indexOf('CUSTOM') < 0, plates.join('|'));
    ok('D5 PLANT is gone; a second planting is refused ' + a5.again + '; the save holds it', !(await box(P, '#bohphone .bpctx .pl')) && a5.again === 'PERMANENT' && a5.saved && a5.saved.x === spot.blk[0]);
    const h5 = await F.evaluate(HIS);
    ok('D11 after planting: EXACTLY ONE place of his, the planted block (' + h5.mine.join(',') + ' at ' + h5.at + '; the ledger ' + h5.ledger.length + ')', h5.onMap && h5.mine.length === 1 && h5.ledger.length === 1 && h5.at[0] === spot.blk[0] && h5.at[1] === spot.blk[1], JSON.stringify(h5));
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
    const g14 = await F.evaluate(async () => { const S = BohemiaBosses.state(); S.verbs.open = S.verbs.open || { from: 'THE TAP', day: 3 }; S.verbs.purify = S.verbs.purify || { from: 'THE FILTER', day: 3 };
      BohemiaHomeMap.bossGifts();
      const a = BohemiaHomeMap.give({ id: 'gift:church-tank', kind: 'build', build: 'tank', name: 'WATER TANK', from: 'THE CHURCH' });
      const b = BohemiaHomeMap.give({ id: 'gift:job-garden', kind: 'build', build: 'garden', name: 'GARDEN BED', from: 'A JOB DONE' });
      const again = BohemiaHomeMap.give({ id: 'gift:job-garden', kind: 'build', build: 'garden', name: 'GARDEN BED', from: 'A JOB DONE' });
      const st = BohemiaHomeMap.state(), bk = LOT_BOOK[BohemiaBetween.mine()];
      return { things: st.things.map(t => t.kind + ':' + t.name + '@' + t.lot), waiting: st.waiting.length, lots: Object.keys(bk.lots).map(k => k + ':' + bk.lots[k].id + (bk.lots[k].done ? '' : '?')), again: !!again.again }; });
    ok('D14 planting placed the pot, and THE TAP\'s and THE FILTER\'s prizes stand on the back lots (' + g14.things.filter(t => /^prize/.test(t)).join(', ') + ')', g14.waiting === 0 && ['@11', '@10', '@9'].every(l => g14.things.some(t => /^prize/.test(t) && t.endsWith(l))), JSON.stringify(g14));
    ok('D14 two builds handed through the seam stand on free lots, standing already (' + g14.lots.join(', ') + '); the same thing given twice is one', g14.lots.filter(l => /:tank$|:garden$/.test(l)).length >= 2 && g14.again, JSON.stringify(g14));
    /* D8 the desk */
    await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { const S = BohemiaSettlement; return S.ready() && S.picIn() && !!window.__HOME_DESK && window.__HOME_DESK.home && window.__HOME_DESK.home.planted; } catch (e) { return false; } }).catch(() => false)) fr = x; }
    ok('D8 his place opens as his (the map tells the town screen)', !!fr);
    if (fr) {
      await P.waitForTimeout(1500);   /* rule 438(a): no sign at rest; the building itself is the press (BohemiaSettlement.where, the middle of its own pixels) */
      const fb = await (await fr.frameElement()).boundingBox();
      const sg = await fr.evaluate(() => { const w = BohemiaSettlement.where && BohemiaSettlement.where('build'); return w ? [w.x, w.y] : null; });
      ok('D8 his place has its BUILD building on the glass', !!sg);
      for (let i = 0; i < 20; i++) { if (await fr.evaluate(() => (window.__HOME_DOORS || []).length >= 5).catch(() => false)) break; await P.waitForTimeout(250); }
      const dr14 = await fr.evaluate(() => window.__HOME_DOORS || []);
      ok('D14 every thing of his is a door on the town screen (' + dr14.join(',') + ')', ['h11', 'h10', 'h9'].every(k => dr14.indexOf(k) >= 0) && dr14.length >= 5, JSON.stringify(dr14));
      for (let i = 0; i < 24; i++) { if (await fr.evaluate(() => !document.getElementById('arrive')).catch(() => false)) break; await P.waitForTimeout(250); }   /* the arrival card goes first (a tap on it only clears it, as his thumb's would) */
      for (let t = 0; t < 3; t++) { const pw14 = await fr.evaluate(() => { const w = BohemiaSettlement.where('h11'); return w ? [w.x, w.y] : null; }); if (!pw14) break;
        await P.touchscreen.tap(fb.x + pw14[0], fb.y + pw14[1]); let up = false; for (let i = 0; i < 12 && !up; i++) { await P.waitForTimeout(250); up = await fr.evaluate(() => !!window.__HOME_THING).catch(() => false); } if (up) break; }
      const th14 = await fr.evaluate(() => window.__HOME_THING || null);
      ok('D14 a tap on the pot says what it is and who gave it ("' + (th14 && th14.line) + '")', !!th14 && /POT/.test(th14.name) && /THE POT/.test(th14.line) && /lives here, a battery off/.test(th14.line), JSON.stringify(th14));
      await fr.evaluate(() => { const c = document.getElementById('close'); if (c && BohemiaSettlement.state.open) c.click(); }); await P.waitForTimeout(700);
      const m14 = await fr.evaluate(() => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home)); h.things = []; window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); return true; });
      await P.waitForTimeout(800); const dm14 = await fr.evaluate(() => window.__HOME_DOORS || []);
      ok('D14 planted: the things taken off the message leave the prizes no door (' + dm14.join(',') + ')', m14 && ['h11', 'h10', 'h9'].every(k => dm14.indexOf(k) < 0), JSON.stringify(dm14));
      await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); }); await P.waitForTimeout(2500);   /* the real message again */
      /* D15 WHAT YOU BUILD OPENS A DOOR (rule 445(b)): at his place the stall, GUNS AND PLATE and the clinic are shut until their build stands */
      const gone15 = async () => { for (let i = 0; i < 24; i++) { if (await fr.evaluate(() => !document.getElementById('arrive') && !!(window.__HOME_DESK && window.__HOME_DESK.home && window.__HOME_DESK.home.planted)).catch(() => false)) break; await P.waitForTimeout(250); } };
      const tap15 = async (k, done) => { for (let t = 0; t < 3; t++) { const w = await fr.evaluate(k => { const x = BohemiaSettlement.where(k); return x ? [x.x, x.y] : null; }, k); if (!w) return false;
        await P.touchscreen.tap(fb.x + w[0], fb.y + w[1]); for (let i = 0; i < 12; i++) { await P.waitForTimeout(250); if (await fr.evaluate(done).catch(() => false)) return true; } } return false; };
      const shut15 = r => !!r.shut && !r.real && r.btn;
      const close15 = async () => { await fr.evaluate(() => { const c = document.getElementById('close'); if (c && BohemiaSettlement.state.open) c.click(); window.__HOME_SHUT = null; }); await P.waitForTimeout(600); };
      await gone15(); await close15();
      const s15 = await tap15('stall', () => !!window.__HOME_SHUT || !!document.getElementById('stallstrip'));
      const r15 = await fr.evaluate(() => ({ shut: window.__HOME_SHUT, real: !!document.getElementById('stallstrip'), btn: !!document.querySelector('#sbody .act[data-opens="stall"]') }));
      ok('D15 no vendor stall at his place: a real tap on THE STALL says it is shut and what opens it ("' + (r15.shut && r15.shut.line) + '"), no trading, BUILD IT one tap', s15 && shut15(r15) && r15.shut.by === 'stall', JSON.stringify(r15));
      await close15();
      const c15 = await tap15('clinic', () => !!window.__HOME_SHUT || /^clinic$/.test(BohemiaSettlement.state.open || ''));
      const rc15 = await fr.evaluate(() => ({ shut: window.__HOME_SHUT, real: BohemiaSettlement.state.open === 'clinic' && !window.__HOME_SHUT, btn: !!document.querySelector('#sbody .act[data-opens="roof"]') }));
      ok('D15 no roof: THE CLINIC is shut until a roof stands ("' + (rc15.shut && rc15.shut.line) + '")', c15 && shut15(rc15) && rc15.shut.by === 'roof', JSON.stringify(rc15));
      await close15();
      await fr.evaluate(() => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home)); h.opens = null; window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); }); await P.waitForTimeout(700);
      await tap15('clinic', () => !!window.__HOME_SHUT || /^clinic$/.test(BohemiaSettlement.state.open || ''));
      const m15 = await fr.evaluate(() => ({ shut: window.__HOME_SHUT, real: BohemiaSettlement.state.open === 'clinic' && !window.__HOME_SHUT, btn: !!document.querySelector('#sbody .act[data-opens="roof"]') }));
      ok('D15 planted: the build-to-door rows taken off the message, the clinic opens for free and the leg goes red', !shut15(m15), JSON.stringify(m15));
      await close15();
      await F.evaluate(() => BohemiaHomeMap.give({ id: 'gift:gate-stall', kind: 'build', build: 'stall', name: 'VENDOR STALL', from: 'THE GATE' }));
      await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); }); await P.waitForTimeout(2500); await gone15(); await close15();
      const o15 = await tap15('stall', () => !!document.getElementById('stallstrip') || !!window.__HOME_SHUT);
      const ro15 = await fr.evaluate(() => ({ shut: window.__HOME_SHUT, real: !!document.getElementById('stallstrip') }));
      ok('D15 a vendor stall standing: the same tap on THE STALL trades (its own sheet)', o15 && ro15.real && !ro15.shut, JSON.stringify(ro15));
      await close15();
      const d15 = await tap15('build', () => { if (/^h\d+$/.test(BohemiaSettlement.state.open || '')) { const m = document.querySelector('#sbody .act[data-home="more"]'); if (m) m.click(); } return !!document.querySelector('#sbody .hcan'); });
      const can15 = await fr.evaluate(() => window.__HOME_CAN || []);
      ok('D15 the desk says what his place can do: ' + can15.join(', '), d15 && can15.indexOf('TRADE') >= 0 && can15.indexOf('MEND (shut)') >= 0 && can15.indexOf('HEAL (shut)') >= 0, JSON.stringify(can15));
      await close15();
      await F.evaluate(() => { const bk = LOT_BOOK[BohemiaBetween.mine()]; for (const k in bk.lots) if (bk.lots[k].id === 'stall') delete bk.lots[k]; });   /* the gate's stall comes down so the legs after build where they always did */
      for (let t = 0; t < 3 && sg; t++) {   /* a slow phone: the press is asked again, as a thumb would, until the building answers */
        const w = await fr.evaluate(() => { const x = BohemiaSettlement.where('build'); return x ? [x.x, x.y] : null; }); if (!w) break;
        await P.touchscreen.tap(fb.x + w[0], fb.y + w[1]);
        let up = false; for (let i = 0; i < 24 && !up; i++) { await P.waitForTimeout(250);
          await fr.evaluate(() => { if (/^h\d+$/.test(BohemiaSettlement.state.open || '')) { const m = document.querySelector('#sbody .act[data-home="more"]'); if (m) m.click(); } }).catch(() => {});   /* one of his things under the thumb: its BUILD MORE */
          up = await fr.evaluate(() => BohemiaSettlement.state.open === 'build' && !!document.querySelector('#sbody .hdesk')).catch(() => false); }
        if (up || await fr.evaluate(() => !!BohemiaSettlement.state.open).catch(() => false)) break; }   /* a sheet that opened late is never pressed through */
      await P.waitForTimeout(600);
      const dk = await fr.evaluate(() => { const b = document.getElementById('sbody'), t = b ? b.innerText : '', c = b && b.querySelector('canvas.hplan'), sh = b && b.closest('[id]');
        const press = [].slice.call(b ? b.querySelectorAll('button') : []).filter(x => x.offsetWidth).map(x => { const r = x.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), r.bottom <= innerHeight + 0.5 && r.top >= -0.5 && r.right <= innerWidth + 0.5 && r.left >= -0.5, x.textContent.slice(0, 14)]; });   /* 11/11: its sides too (a long line pushed the fourth column of builds off the glass sideways) */
        return { t, plan: window.__HOME_PLAN || null, canvas: !!c, press, open: BohemiaSettlement.state.open }; });
      ok('D8 the desk: A NIGHT, LIVING HERE, NAME IT', dk.open === 'build' && /A NIGHT/.test(dk.t) && /LIVING HERE/.test(dk.t) && /NAME IT/.test(dk.t), dk.t.slice(0, 200).replace(/\n/g, ' '));
      ok('D8 the plan: ' + (dk.plan && dk.plan.lots) + ' lots on the road, ' + (dk.plan && dk.plan.open) + ' open, signs: ' + (dk.plan && dk.plan.signs.join(',')), dk.canvas && dk.plan && dk.plan.lots === 12 && dk.plan.open === 4 && dk.plan.signs.indexOf('POT') >= 0, JSON.stringify(dk.plan));
      const cutOf = () => fr.evaluate(() => { const out = []; document.querySelectorAll('#sbody .act[data-build] em span, #sbody .act[data-build] > span, #sbody .say p').forEach(e => { if (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1) out.push(e.textContent.slice(0, 30)); }); return out; });
      const cut8 = await cutOf();
      ok('D8 row 607: no word on the desk is cut (each build\'s cost and what it gives, YOU\'s line)', dk.open === 'build' && !cut8.length, JSON.stringify(cut8));
      await fr.evaluate(() => { const e = document.querySelector('#sbody .act[data-build="solar"] em span:last-child'); if (e) { e.dataset.w = e.style.width; e.style.width = '24px'; } });
      const cut8p = await cutOf();
      await fr.evaluate(() => { const e = document.querySelector('#sbody .act[data-build="solar"] em span:last-child'); if (e) e.style.width = e.dataset.w || ''; });
      ok('D8 planted: one build\'s line squeezed, the cut is caught (' + cut8p.join(',') + ')', cut8p.length >= 1, JSON.stringify(cut8p));
      const small = dk.press.filter(p => p[1] < 44 || !p[2]);
      ok('D8 every press 44 px tall and on the glass (' + dk.press.length + ' presses)', dk.press.length >= 9 && !small.length, JSON.stringify(small));
      const nm = await fr.evaluate(() => { const b = [].slice.call(document.querySelectorAll('#sbody .hdesk button')).filter(x => /NAME IT/.test(x.textContent))[0]; if (!b) return false; b.click(); return true; });
      await P.waitForTimeout(400);
      await fr.evaluate(() => { const i = document.querySelector('#sbody .hname input'); if (!i) return; i.value = 'Casa Gate'; i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); });
      await P.waitForTimeout(1200);
      const named = await F.evaluate(() => BohemiaHomeMap.label());
      ok('D8 a name typed at the desk is the map\'s name for it (' + named + ')', nm && named === 'CASA GATE', named);
      await P.screenshot({ path: path.join(require('os').tmpdir(), 'home_base_gate_desk_' + prof + '.png') }).catch(() => {});   /* the proof picture, never into the repo */
      /* D10 pick lot 3 on the plan, build there, clear it */
      const cv = await fr.evaluate(() => { const c = document.querySelector('#sbody canvas.hplan'); if (!c) return null; const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height, cw: c.width, ch: c.height }; });
      if (cv) { const sc = Math.min(cv.w / cv.cw, cv.h / cv.ch), dw = cv.cw * sc, dh = cv.ch * sc, oy = cv.t + (cv.h - dh) / 2;
        await P.touchscreen.tap(fb.x + cv.l + dw * (4.5 / 10), fb.y + oy + dh * (1.5 / 4)); await P.waitForTimeout(900); }
      const pick = await fr.evaluate(() => window.__HOME_PICK);
      await fr.evaluate(() => { const b = [...document.querySelectorAll('#sbody .act')].find(x => /GARDEN BED/.test(x.textContent)); if (b) b.click(); }); await P.waitForTimeout(1000);
      const lots10 = await F.evaluate(() => Object.keys(LOT_BOOK[BohemiaBetween.mine()].lots));
      ok('D10 he picked lot ' + ((pick | 0) + 1) + ' on the plan and the garden went up there (' + lots10.join(' ') + ')', pick === 2 && lots10.indexOf('2,0') >= 0, JSON.stringify({ pick, lots10 }));
      const half = await fr.evaluate(() => { const b = document.getElementById('sbody'), sh = b && b.parentElement; const t = Math.min.apply(null, [].slice.call(b.querySelectorAll('*')).filter(x => x.offsetWidth).map(x => x.getBoundingClientRect().top)); return { top: t, h: innerHeight }; });
      const clr = await fr.evaluate(() => { const b = document.querySelector('#sbody .hdesk button[data-home="clear"]'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.height]; });
      /* rule 402(c): a small sheet under half the glass; his place's desk is the screen's whole job (UI's own WHOLE list in
         gates/scrolling_is_illegal_gate.js: the hall, the shops), so upright it is held under half anyway and sideways every press on the glass */
      const upright = prof === 'phone_portrait';
      ok('D10 CLEAR sits in the desk row, 44 px; ' + (upright ? 'upright the sheet stays under half the glass' : 'sideways, the whole job, every press on the glass') + ' (its top at ' + Math.round(100 * half.top / half.h) + '%)',
         !!clr && clr[2] >= 44 && (upright ? half.top / half.h >= 0.5 : clr[1] + clr[2] / 2 <= half.h + 0.5), JSON.stringify({ clr, half }));
      if (clr) await P.touchscreen.tap(fb.x + clr[0], fb.y + clr[1]); await P.waitForTimeout(900);
      const lots10b = await F.evaluate(() => Object.keys(LOT_BOOK[BohemiaBetween.mine()].lots));
      ok('D10 CLEAR took it down (' + (lots10b.join(' ') || 'nothing') + ')', lots10b.indexOf('2,0') < 0);
      /* D13 each build whole */
      const rows13 = await fr.evaluate(() => [...document.querySelectorAll('#sbody .act[data-build]')].map(b => ({ id: b.dataset.build, t: b.textContent, off: b.disabled })));
      const g13 = rows13.filter(r => r.id === 'garden')[0];
      ok('D13 his place\'s rows say their battery, their goods and what they give (' + (g13 && g13.t) + ')', rows13.length >= 8 && g13 && /1 BATTERY/.test(g13.t) && /TAPE/.test(g13.t) && /\+1 FOOD\/DAY/.test(g13.t), JSON.stringify(rows13).slice(0, 300));
      const before13 = await F.evaluate(() => (wagonGet() || {}).tape | 0);
      await fr.evaluate(() => { const b = document.querySelector('#sbody .act[data-build="garden"]'); if (b && !b.disabled) b.click(); }); await P.waitForTimeout(1200);
      const after13 = await F.evaluate(() => ({ tape: (wagonGet() || {}).tape | 0, cost: BohemiaHome.data().builds.garden.cost.tape, lots: Object.keys(LOT_BOOK[BohemiaBetween.mine()].lots) }));
      ok('D13 the garden went up and its tape came out of the company\'s supplies (' + before13 + ' -> ' + after13.tape + ')', before13 - after13.tape === after13.cost && after13.lots.length >= 1, JSON.stringify(after13));
      const short13 = await F.evaluate(() => { const w = wagonGet() || {}; w.tape = 0; wagonPut(w); return true; });
      await fr.evaluate(() => { const c = document.getElementById('close'); if (c && BohemiaSettlement.state.open) c.click(); }); await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); }); await P.waitForTimeout(2500);
      for (let t = 0; t < 3; t++) { const w = await fr.evaluate(() => { const x = BohemiaSettlement.where('build'); return x ? [x.x, x.y] : null; }); if (w) await P.touchscreen.tap(fb.x + w[0], fb.y + w[1]);
        let up = false; for (let i = 0; i < 20 && !up; i++) { await P.waitForTimeout(250);
          await fr.evaluate(() => { if (/^h\d+$/.test(BohemiaSettlement.state.open || '')) { const m = document.querySelector('#sbody .act[data-home="more"]'); if (m) m.click(); } }).catch(() => {});   /* one of his things under the thumb: its BUILD MORE (rule 445: his things stand on the BUILD corner) */
          up = await fr.evaluate(() => !!document.querySelector('#sbody .act[data-build]')); } if (up) break; }
      const offs = await fr.evaluate(() => [...document.querySelectorAll('#sbody .act[data-build]')].map(b => [b.dataset.build, b.disabled, b.dataset.short || '']));
      ok('D13 with no tape in the supplies every build that needs tape is greyed (' + offs.filter(o => o[1]).length + ' of ' + offs.length + ')', offs.length >= 8 && offs.every(o => o[1] && /tape/.test(o[2])), JSON.stringify(offs));
      const m13 = await F.evaluate(() => { const w = wagonGet() || {}; w.tape = 20; wagonPut(w); const r = BohemiaHomeMap.rec(), bk = LOT_BOOK[BohemiaBetween.mine()];
        for (const k in bk.lots) bk.lots[k].done = true;   /* what went up stands */
        const f0 = (wagonGet() || {}).food | 0; DAY.day = DAY.day + 1; lotWake(); const f1 = (wagonGet() || {}).food | 0;
        const wk = BohemiaHomeMap.workers(), gave = (window.__HOME_MORNING || {}).gave || {};
        /* planted: the morning hook taken out */
        const keep = homeMorning; homeMorning = function () { return null; }; DAY.day = DAY.day + 1; const g0 = (wagonGet() || {}).food | 0; lotWake(); const g1 = (wagonGet() || {}).food | 0; homeMorning = keep;
        /* a roof: it goes up, stands, and a family moves in */
        const P0 = purseGet(); BohemiaPurse.credit(P0, 'electricity', 2, 'gate', 'gate', DAY.day);
        const free = [0,1,2,3].find(i => !bk.lots[i + ',0']); const st = BohemiaLotBuild.start(bk, P0, { x: free, y: 0 }, 'roof', DAY.day, lotHoldFor(BohemiaBetween.mine()));
        DAY.day = DAY.day + 1; lotWake(); bk.lots[free + ',0'] && (bk.lots[free + ',0'].done = true); DAY.day = DAY.day + 1; lotWake();
        return { f0, f1, gave, wk, g0, g1, roof: st.ok, res: BohemiaHomeMap.state().residents.map(p => p.name + ':' + p.why) }; });
      ok('D13 the morning puts what stands into the company\'s supplies (food ' + m13.f0 + ' -> ' + m13.f1 + ', gave ' + JSON.stringify(m13.gave) + ')', m13.f1 > m13.f0 && (m13.gave.food | 0) >= 1, JSON.stringify(m13));
      ok('D13 a resident works a build and it gives more (' + JSON.stringify(m13.wk) + ')', Object.keys(m13.wk).length >= 1 && (m13.gave.food | 0) >= 2, JSON.stringify(m13));
      ok('D13 planted: with the morning hook taken out nothing comes in (food ' + m13.g0 + ' -> ' + m13.g1 + ')', m13.g1 === m13.g0, JSON.stringify(m13));
      ok('D13 a roof finished brings a family to live there (' + m13.res.filter(r => /roof/.test(r)).join(', ') + ')', m13.roof && m13.res.some(r => /FAMILY|THE /.test(r) && /roof/.test(r)), JSON.stringify(m13.res));
      /* D9 who moved in stands there, and talks */
      await fr.evaluate(() => { const c = document.getElementById('close'); if (c && BohemiaSettlement.state.open) c.click(); }); await P.waitForTimeout(1200);
      const folk = await fr.evaluate(() => window.__HOME_FOLK_AT ? window.__HOME_FOLK_AT() : []);
      ok('D9 the people who moved in stand in his place (' + folk.map(f => f.name).join(', ') + ')', folk.some(f => f.name === 'GATE RUIZ'), JSON.stringify(folk));
      const bw = await fr.evaluate(() => { const w = BohemiaSettlement.where('build'); return w ? [w.x, w.y] : null; });
      ok('D9 the BUILD door is under none of them (the nearest ' + (bw && folk.length ? Math.round(Math.min.apply(null, folk.map(f => Math.hypot(f.x - bw[0], f.y - bw[1])))) : '-') + ' px away)', !!bw && folk.every(f => Math.hypot(f.x - bw[0], f.y - bw[1]) > 30));
      const gr = folk.filter(f => f.name === 'GATE RUIZ')[0];
      if (gr) { await P.touchscreen.tap(fb.x + gr.x, fb.y + gr.y); await P.waitForTimeout(1300); }
      const talk = await fr.evaluate(() => ({ t: window.__HOME_TALK || null, txt: (document.getElementById('sbody') || {}).innerText || '' }));
      ok('D9 a tap on him: his face, LIVES HERE, a line of the place\'s story ("' + (talk.t && talk.t.line) + '")', !!talk.t && talk.t.name === 'GATE RUIZ' && /LIVES HERE/.test(talk.txt) && /day \d+/.test(talk.t.line), JSON.stringify(talk).slice(0, 300));
      const planted9 = await fr.evaluate(() => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home)); h.residents = []; window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); return true; });
      await P.waitForTimeout(1200);
      const folkGone = await fr.evaluate(() => window.__HOME_FOLK_AT ? window.__HOME_FOLK_AT() : []);
      ok('D9 planted: with the residents taken off the message, none stands (the leg above would be red)', planted9 && !folkGone.some(f => f.name === 'GATE RUIZ'), JSON.stringify(folkGone));
    }
    /* D11 a saved game, opened again the way he does (CONTINUE): still exactly one, at the same block */
    if (prof === 'phone_portrait') {
      await F.evaluate(() => { try { saveNow('gate'); } catch (e) {} }); await P.waitForTimeout(1500);
      await P.close().catch(() => {});
      const e = await drive.open({ again: d, keepCards: true, beforeTap: async (pg) => {
        for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
        await pg.waitForTimeout(1500); await continueThroughTitle(pg); await pg.waitForTimeout(1800); } });
      for (let i = 0; i < 40; i++) { if (await e.fr.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data())).catch(() => false)) break; await e.page.waitForTimeout(250); }
      await e.fr.evaluate(() => { try { loopClose(); render(); } catch (x) {} }); await e.page.waitForTimeout(800);
      const hs = await e.fr.evaluate(HIS);
      ok('D11 a saved game opened again: exactly one place of his, the same block (' + hs.at + ')', hs.onMap && hs.mine.length === 1 && hs.ledger.length === 1 && hs.at && hs.at[0] === spot.blk[0] && hs.at[1] === spot.blk[1], JSON.stringify(hs));
      const m11 = await e.fr.evaluate(() => { const H = BohemiaHomeBases, bs = ctBases(), m = BohemiaBetween.mine(), n = Object.keys(bs).filter(k => k !== m)[0];
        H.__tookRaw(hbRec(), { base: n, to: H.YOU, by: 'boss', why: 'PLANTED', day: 9 }); return n; });
      const hm = await e.fr.evaluate(HIS);
      ok('D11 planted: ' + m11 + ' written his past the guard is counted, a second place, red (ledger ' + hm.ledger.join(',') + ')', hm.ledger.length === 2, JSON.stringify(hm));
      await e.close();
    } else await d.close();
  }
  done();
})().catch(e => { console.error(e); fail++; done(); });
