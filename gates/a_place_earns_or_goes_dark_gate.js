#!/usr/bin/env node
/* A PLACE EARNS OR GOES DARK (ECONOMY FOUR 11/27, VAMILY rule 485(b): 'a place that stops earning goes dark and a place that earns
   grows'; ECONOMY THREE's handoff, job 2). records/BOHEMIA_ECONOMY_FOUR_A_PLACE_EARNS_OR_GOES_DARK_11_27_26.md.
   DATA legs (engine/bohemia_place_book.js, records/target/bb/place_book.json):
     B1 a place's men by the days alone (a patrol, a caravan one less, a crew one more), never his strength
     B2 what its men eat is the bill's price a man, handed in (the file types no battery number)
     B3 a place that can feed its men pays them all; a night it cannot, one of its wires goes dark and it keeps only the men its take
        can feed (none to put out: nothing goes dark)
     B4 no spiral: the next night, on the same take, it is not short again
     B5 a month of keep in the bank and a week that paid: WELL OFF, it relights one wire it lost and takes a man back; a place short of
        men takes them back once it can carry them (never stuck broke on money); the shelves: broke 0.75, well off 1.25
     B6 the farthest wire from the seat goes first, the nearest comes back first; the same valley the same wire
     B7 THE MEASURED VALLEY (the demo's 13 places: wires, heads, purses, parties), 120 nights: somebody goes dark, somebody stays well
        off, no place below zero wires, at most a fifth of the valley's wires out, and nobody's men never fed
     B8 every number has a value (or the file it comes from) and a source
   PAGE legs (demo | alpha, phone_portrait | phone_landscape):
     P1 the book runs at nightfall: every seated place has a verdict; a place with men out paid them ('its men on the road ate') and the
        collector's round landed
     P2 the wires' charge is one ledger line a faction a night, the same sum
     P3 a place with nothing in its pocket that its take cannot feed (Anarchists) loses its farthest wire that night (POWER says dark), the phone's feed says so; given a
        month and a week, it gets it back
     P4 the town is handed its place's verdict and its shelves read it
     P5 the pockets and the book ride the save: a snapshot restored puts every treasury and the book back
     P6 a night of the book costs under 40 ms on this box (rule 480(c)), and no page error
   node gates/a_place_earns_or_goes_dark_gate.js [data | demo | alpha] [phone_portrait | phone_landscape] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const B = require(path.join(ROOT, 'engine/bohemia_place_book.js'));
const F = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/place_book.json'), 'utf8'));
const PM = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/party_math.json'), 'utf8'));
const BILL = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/nightly_bill.json'), 'utf8'));
const MODE = process.argv[2] || 'data', SHAPE = process.argv[3] || 'phone_portrait';
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const R = PM.roaming.value || PM.roaming, PER = BILL.per_man_per_night.value;

if (MODE === 'data') {
  const m1 = ['patrol', 'caravan', 'crew'].map(a => B.partyMen(R, a, 1)), m30 = ['patrol', 'caravan', 'crew'].map(a => B.partyMen(R, a, 30));
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_place_book.js'), 'utf8');
  ok('B1 men by the days: day 1 ' + m1.join('/') + ', day 30 ' + m30.join('/') + ' (a patrol, a caravan, a crew); the engine never reads his strength',
    m1[1] === Math.max(2, m1[0] - 1) && m1[2] === m1[0] + 1 && m30[0] > m1[0] && !/strength/i.test(src.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')));
  ok('B2 the men eat the bill\'s price a man, handed in (' + PER + ' a man: 5 men ' + B.spendOf(PER, 5) + ', at 3 a man ' + B.spendOf(3, 5) + '); the file types no battery number',
    B.spendOf(PER, 5) === 5 * PER && B.spendOf(3, 5) === 15 && F.keep_per_man.value === undefined && /nightly_bill/.test(F.keep_per_man.from));
  const rich = B.night(F, { reserve: 100, take: 20, men: 6, perMan: PER, lit: 5, lost: 0 }), poor = B.night(F, { reserve: 5, take: 3, men: 6, perMan: PER, lit: 4, lost: 0 }), bare = B.night(F, { reserve: 0, take: 0, men: 3, perMan: PER, lit: 0, lost: 0 });
  ok('B3 a place that can pays its men (' + rich.paid + ' of ' + rich.spend + ', ' + rich.reserve + ' left, no wire out); one that cannot: short ' + poor.short + ', one wire out (' + poor.douse + '), keeps ' + poor.kept + ' men its take of 3 can feed; none to put out: ' + bare.douse,
    rich.paid === rich.spend && rich.short === 0 && rich.douse === 0 && poor.short > 0 && poor.douse === 1 && poor.kept === Math.floor(3 / PER) && bare.douse === 0);
  const next = B.night(F, { reserve: poor.reserve + 3, take: 3, men: 6, kept: poor.kept, perMan: PER, lit: 3, lost: 1, week: poor.week });
  ok('B4 no spiral: the next night on the same take it keeps ' + next.men + ' men, short ' + next.short + ', no wire out', next.short === 0 && next.douse === 0);
  const wk = Array(6).fill({ take: 30, spend: 10 }), well = B.night(F, { reserve: 1000, take: 30, men: 5, kept: null, perMan: PER, lit: 9, lost: 2, week: wk }), mend = B.night(F, { reserve: 1000, take: 30, men: 5, kept: 3, perMan: PER, lit: 9, lost: 2, week: wk });
  let st = { kept: 0, week: [] }, res = 65, back = null; for (let d = 0; d < 10 && back == null; d++) { res += 1; const r = B.night(F, { reserve: res, take: 1, men: 8, kept: st.kept, perMan: PER, lit: 0, lost: 0, week: st.week }); res = r.reserve; st = { kept: r.kept, week: r.week }; if (r.men > 0) back = d; }
  const S = F.shelf.value;
  ok('B5 well off: ' + well.verdict + ', relights ' + well.relight + '; with money and 3 of 5 men it takes one back (' + mend.verdict + ', 3 -> ' + mend.kept + ', relights ' + mend.relight + '); a broke place with 65 in hand takes men back on night ' + back + '; shelves broke ' + S.broke + ', well off ' + S.well_off,
    well.verdict === 'well_off' && well.relight === 1 && well.kept === null && mend.verdict === 'getting_by' && mend.kept === 4 && mend.relight === 1 && back != null && back <= 8 && S.broke < 1 && S.well_off > 1 && poor.shelf === S.broke && well.shelf === S.well_off);
  const seat = { x: 10, y: 10 }, ws = [{ id: 4, x: 11, y: 10 }, { id: 9, x: 20, y: 3 }, { id: 2, x: -2, y: 0 }, { id: 7, x: 13, y: 12 }];
  ok('B6 the farthest goes first (' + B.pickDouse(ws, seat).id + '), the nearest comes back first (' + B.pickRelight(ws, seat).id + '); the same answer twice',
    B.pickDouse(ws, seat).id === 2 && B.pickRelight(ws, seat).id === 4 && B.pickDouse(ws.slice().reverse(), seat).id === 2);
  /* the demo's valley as measured (K7QM9X, records s1): tier, purse on day 1, live wires, heads; the parties each seat sends */
  const V = { Anarchists: ['town', 80, 1, 80], Blues: ['town', 260, 0, 260], Caravans: ['fortress', 264, 21, 264], Cartel: ['fortress', 244, 37, 308], Church: ['town', 244, 10, 244], Colorful: ['camp', 40, 0, 40], Homeless: ['camp', 180, 0, 180], Mob: ['fortress', 596, 31, 596], Network: ['fortress', 652, 48, 652], Reds: ['town', 0, 0, 0], Remnants: ['fortress', 484, 12, 504], Trades: ['camp', 20, 0, 20], Volunteers: ['camp', 0, 0, 0] };
  const reach = { fortress: 3, town: 2, camp: 1 }, cn = F.collect_nights.value, S2 = {};
  let wires0 = 0, outMax = 0, neg = 0, darkened = 0, wellOff = 0, unfed = 0;
  for (const f in V) { S2[f] = { res: V[f][1], lit: V[f][2], lost: 0, week: [], kept: null, carry: 0, fed: 0 }; wires0 += V[f][2]; }
  for (let day = 1; day <= 120; day++) { let out = 0; for (const f in V) { const s = S2[f]; s.carry += V[f][3] / cn; const biz = Math.floor(s.carry); s.carry -= biz; const take = s.lit + biz; s.res += take;
    let men = 0; for (let k = 0; k < reach[V[f][0]]; k++) men += B.partyMen(R, ['patrol', 'caravan', 'crew'][k % 3], day);
    const r = B.night(F, { reserve: s.res, take, men, kept: s.kept, perMan: PER, lit: s.lit, lost: s.lost, week: s.week });
    s.res = r.reserve; s.week = r.week; s.kept = r.kept; if (r.douse) { s.lit--; s.lost++; darkened++; } if (r.relight) { s.lit++; s.lost--; } if (s.lit < 0) neg++; if (r.paid > 0) s.fed++; if (r.verdict === 'well_off') s.wo = 1; out += s.lost; }
    outMax = Math.max(outMax, out); }
  for (const f in S2) { if (S2[f].wo) wellOff++; if (V[f][3] > 0 && S2[f].fed === 0) unfed++; }
  ok('B7 the measured valley, 120 nights: ' + darkened + ' wires went dark, the most out at once ' + outMax + ' of ' + wires0 + ', ' + wellOff + ' places well off at some point, none below zero, every place with people fed its men some night',
    darkened > 0 && wellOff > 0 && neg === 0 && outMax <= wires0 / 5 && unfed === 0);
  const rows = ['keep_per_man', 'men_by_days', 'collect_nights', 'week_nights', 'well_off_nights', 'douse', 'relight', 'shelf'], miss = rows.filter(k => !F[k] || (F[k].value === undefined && !F[k].from) || !F[k].source);
  ok('B8 every number has a value (or its file) and a source', miss.length === 0, miss.join(', '));
  console.log('=== A PLACE EARNS OR GOES DARK (data): ' + pass + ' ok, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
}

const Dr = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const T = MODE + ' ' + SHAPE;
(async () => {
  const d = await Dr.open({ profile: SHAPE, alpha: MODE === 'alpha', fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, P = d.page, errs = []; P.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    await fr.waitForFunction(() => window.LOOP && LOOP.start && typeof townTap === 'function' && PLACE_BOOK && PLACE_BOOK.file, null, { timeout: 300000 }); await P.waitForTimeout(3000);
    const a = await fr.evaluate(() => { const d0 = DAY.day; let k = 0; while (DAY.day < d0 + 2 && k++ < 200) advance(60);
      const tn = PLACE_BOOK.tonight || {}, seats = turfSeats().map(s => s.faction), cur = BohemiaCells.money(), net = BohemiaPockets.of('Network');
      const es = (net.entries || []).filter(e => e.day === DAY.day - 1 || e.day === DAY.day);
      const lastNight = (net.entries || []).filter(e => e.day === (tn.day | 0));
      return { seats: seats.length, places: Object.keys(tn.places || {}).length, verdicts: Object.keys(tn.places || {}).map(f => f.slice(0, 4) + ' ' + tn.places[f].verdict).join(', '),
        ate: lastNight.filter(e => e.reason === 'its men on the road ate').length, collect: lastNight.filter(e => e.reason === "the collector's round").length,
        charge: lastNight.filter(e => e.reason === 'a day on a live wire').map(e => e.amount), netLit: (placeWires(turfSeats()).Network || []).length }; });
    ok('P1 ' + T + ': the book ran at nightfall (' + a.places + ' places of ' + a.seats + ' seats: ' + a.verdicts + '); Network fed its men (' + a.ate + ' line) and the collector came round (' + a.collect + ')',
      a.places === a.seats && a.seats > 10 && a.ate === 1 && a.collect === 1);
    ok('P2 ' + T + ': the wires\' charge is one line a faction a night (Network: ' + JSON.stringify(a.charge) + ' for its ' + a.netLit + ' wires)', a.charge.length === 1 && a.charge[0] === a.netLit);
    /* a place with nothing: Anarchists' pocket emptied (the test's own hand; one wire and 80 heads do not feed its men), a night later its farthest wire is out */
    const b = await fr.evaluate(() => { const cur = BohemiaCells.money(), pp = BohemiaPockets.of('Anarchists'), bal = BohemiaPurse.balance(pp, cur);
      BohemiaPurse.debit(pp, cur, bal, 'the gate empties it', 'gate', DAY.day); PLACE_BOOK.st.Anarchists = PLACE_BOOK.st.Anarchists || {}; PLACE_BOOK.st.Anarchists.after = 0;
      const posts0 = ((window.BOHEMIA_FEED && BOHEMIA_FEED.posts) ? BOHEMIA_FEED.posts.length : 0);
      const seat = turfSeats().filter(s => s.faction === 'Anarchists')[0], before = (placeWires(turfSeats()).Anarchists || []).slice(), far = BohemiaPlaceBook.pickDouse(before, seat);
      const d0 = DAY.day; let k = 0; while (DAY.day < d0 + 1 && k++ < 200) advance(60);
      const tn = PLACE_BOOK.tonight || {}, said = tn.said || '';
      return { far: far && far.id, dark: far ? POWER.isDark(far.id) : null, n0: before.length, n1: (placeWires(turfSeats()).Anarchists || []).length, said, verdict: tn.places && tn.places.Anarchists && tn.places.Anarchists.verdict, lost: (PLACE_BOOK.st.Anarchists.lost || []).map(w => w.id) }; });
    ok('P3 ' + T + ': Anarchists with an empty pocket lost its farthest wire (' + b.far + ', dark ' + b.dark + '; ' + b.n0 + ' -> ' + b.n1 + ' wires, ' + b.verdict + '); the feed: "' + b.said.slice(0, 90) + '"',
      b.dark === true && b.n1 === b.n0 - 1 && b.verdict === 'broke' && /Anarchists/.test(b.said) && /dark/.test(b.said));
    const c = await fr.evaluate((far) => { const cur = BohemiaCells.money(), pp = BohemiaPockets.of('Anarchists'); BohemiaPurse.credit(pp, cur, 5000, 'the gate fills it', 'gate', DAY.day);
      let k = 0, d0 = DAY.day; while (DAY.day < d0 + 9 && POWER.isDark(far) && k++ < 2000) advance(60); return { back: !POWER.isDark(far), days: DAY.day - d0, verdict: PLACE_BOOK.st.Anarchists.verdict, said: (PLACE_BOOK.tonight || {}).said || '' }; }, b.far);
    ok('P3b ' + T + ': given a month and a week it gets it back (' + c.back + ' after ' + c.days + ' nights, ' + c.verdict + ')', c.back && c.days <= 9);
    /* the town: Network's verdict handed to its screen, its shelves read it */
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} const n = 'Network', bb = ctBases()[n]; travelStop(); city.x = bb.x; city.y = bb.y; townTap({ name: n, x: bb.x, y: bb.y }); });
    for (let i = 0; i < 180; i++) { if (await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready))) break; await P.waitForTimeout(500); }
    if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const x = document.querySelector('#meetcard [data-meet="back"]'); if (x) x.click(); });
    const sf = await (await fr.$('#settleFrame')).contentFrame();
    for (let i = 0; i < 60; i++) { if (await sf.evaluate(() => !!(window.BohemiaSettlement && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === 'Network')).catch(() => false)) break; await P.waitForTimeout(500); }
    const town = await sf.evaluate(() => ({ w: BohemiaSettlement.state.wealth || null }));
    const want = await fr.evaluate(() => placeWealth('Network'));
    ok('P4 ' + T + ': Network\'s screen is handed its place (' + JSON.stringify(town.w) + ') as the book has it (' + (want && want.verdict) + ', shelves x' + (want && want.shelf) + ')',
      town.w && want && town.w.verdict === want.verdict && town.w.shelf === want.shelf);
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
    const s = await fr.evaluate(() => { const cur = BohemiaCells.money(), snap = citySnapshot(), keep = {}; BohemiaPockets.holders().forEach(h => { if (h !== 'player') keep[h] = BohemiaPockets.worth(h, cur); });
      const bytes = JSON.stringify(snap.pockets || null).length + JSON.stringify(snap.placeBook || null).length, book = JSON.stringify(PLACE_BOOK.st);
      BohemiaPurse.debit(BohemiaPockets.of('Network'), cur, 100, 'the gate spends it', 'gate', DAY.day); PLACE_BOOK.st = {};
      let threw = null; try { applyRestore(JSON.parse(JSON.stringify(snap))); } catch (e) { threw = String(e).slice(0, 120); }
      const bad = Object.keys(keep).filter(h => BohemiaPockets.worth(h, cur) !== keep[h]);
      return { bytes, bad, threw, book: JSON.stringify(PLACE_BOOK.st) === book, net: BohemiaPockets.worth('Network', cur), was: keep.Network }; });
    ok('P5 ' + T + ': the pockets and the book ride the save (' + s.bytes + ' bytes); a snapshot restored puts every treasury back (Network ' + s.was + ' -> ' + s.net + ', ' + s.bad.length + ' off) and the book' + (s.threw ? ' (threw ' + s.threw + ')' : ''),
      !s.threw && s.bad.length === 0 && s.book && s.bytes > 100 && s.bytes < 120000);
    const ms = await fr.evaluate(() => { const t = []; for (let i = 0; i < 3; i++) { const a0 = performance.now(); placeNight(); t.push(performance.now() - a0); } return t.map(x => Math.round(x * 10) / 10); });
    ok('P6 ' + T + ': a night of the book ' + ms.join(', ') + ' ms', Math.max(...ms) < 40);
  } catch (e) { ok('the walk ran', false, String(e && e.message || e).slice(0, 200)); }
  const e2 = errs.filter(e => !/ResizeObserver|favicon/.test(e));
  ok('P7 ' + T + ': no page error', e2.length === 0, e2.slice(0, 2).join(' | '));
  await d.close().catch(() => {});
  console.log('=== A PLACE EARNS OR GOES DARK (' + T + '): ' + pass + ' ok, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
