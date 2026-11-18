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
     D18 HIS IMPACT (rule 453(3)): jobs ending through the jobs' own settle: the done are pinned, the lost not; the cork board goes up
         by itself, CAM 2 sees it, a real tap says the jobs done and the people brought home. PLANTED: the board off the message, no door;
         E11: a lost or cancelled job pinned is caught.
     D19 HIS PLACE SEEN AS HE WILL SEE IT (rule 458(c), ask row 639): every camera its own mount through a perspective, the sensor, the
         tape and the wrong clock, the glass filled, all twelve lots in its frame; a finger goes through the lens (planted: the spot read
         flat answers wrong); a real tap on the yard cuts close on it above the sheet; his men at his buildings, each once; the sheet put
         away, the camera back on its mount; D8 no top-down plan (planted: one put back reads red), D10 the lot picked in the feed.
     D17 HIS OWN BUILDINGS (rule 453(1)): the desk offers the training yard, the forge, the lookout; a real tap puts the yard up (1
         battery, 3 tape); the next day all three stand, each a door, seen at CAM 2; a real tap trains a man (his level's price), the forge
         presses 2 tape into 6 rounds, the lookout says the nearest crew; the desk says TRAIN, CRAFT, WATCH; on the crew screen the same
         fight gives the trained man 135 to the untrained man's 100. E10 PLANTED: a training that adds nothing is caught.
     D16 HIS PLACE THROUGH ITS CAMERAS (rule 451(c), row 625): his place opens on CAM 1 (REC, the camera, his place); a real tap on
         CAM 2 frames THE LOTS closer and the pot there still answers a tap; CAM 3 has the ones who live there in the shot; CAM 1 the
         whole yard again. PLANTED: the message says not planted, no camera.
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
const rP = H.make('PLACES'), pre = H.buildPlace(rP, 'yard', 0, 1); H.plant(rP, { x: 4, y: 4 }, 2, gG);
H.give(rP, { id: 'prize:cook', kind: 'prize', name: 'HIS POT', from: 'THE POT' });
const by = H.buildPlace(rP, 'yard', 0, 2), by2 = H.buildPlace(rP, 'yard', 1, 2), bp = H.buildPlace(rP, 'forge', 11, 2), bn = H.buildPlace(rP, 'castle', 1, 2);
const pl2 = H.placesOf(rP, 2), pl3 = H.placesOf(rP, 3);
ok('E10 his own buildings: refused before planting (' + pre.why + '), the yard on the first lot, a second yard ' + by2.why + ', a lot the pot holds ' + bp.why + ', a thing not on the list ' + bn.why + '; standing the day after',
  pre.why === 'NOT_PLANTED' && by.ok && by2.why === 'ONE_OF_EACH' && bp.why === 'LOT_TAKEN' && bn.why === 'NOT_A_PLACE' && !pl2[0].done && pl3[0].done, JSON.stringify({ pl2, pl3 }));
const T1 = H.trained({ YOU: { mult: 1.35, left: 3 } }, 'YOU', 100), T0 = H.trained({}, 'DESI', 100), T3 = H.trained({ YOU: { mult: 1.35, left: 1 } }, 'YOU', 100);
ok('E10 the yard (Battle Brothers\' Veteran\'s Lessons): a trained man\'s 100 is ' + T1.xp + ' (' + T1.store.YOU.left + ' fights left), an untrained man\'s stays ' + T0.xp + ', the last trained fight clears him; the price is his level\'s (' + H.trainCost(1) + ', ' + H.trainCost(5) + ')',
  T1.xp === 135 && T1.store.YOU.left === 2 && T0.xp === 100 && T3.xp === 135 && !T3.store.YOU && H.trainCost(1) === 2 && H.trainCost(5) === 5);
const lifts = r => r.xp > 100;
ok('E10 planted: training that adds nothing (a multiplier of one) is caught', !lifts(H.trained({ YOU: { mult: 1, left: 3 } }, 'YOU', 100)) && lifts(T1));
const rD = H.make('DEEDS'), dw = H.give(rD, { id: 'deed:a', kind: 'deed', name: 'Bring back the medic', from: 'HENDERSON', saved: true });
H.plant(rD, { x: 6, y: 6 }, 2, gG); const dpw = H.placeWaiting(rD, {}), d2 = H.give(rD, { id: 'deed:b', kind: 'deed', name: 'Haul the salt', from: 'JEAN' }), d2b = H.give(rD, { id: 'deed:b', kind: 'deed', name: 'Haul the salt', from: 'JEAN' });
const bd = H.buildPlace(rD, 'board', 0, 1);
ok('E11 a job done is a deed: before planting it waits, planting pins it, the same job twice is one, no lot of its own; the cork board goes up on a lot (' + bd.ok + ')',
  dw.waiting && dpw.length === 1 && rD.deeds.length === 2 && d2b.again && rD.deeds.every(x => x.lot == null) && rD.deeds[0].saved && bd.ok, JSON.stringify(rD.deeds));
const pinned = acts => acts.filter(a => /^civilian_contract_(done|poor)$/.test(a)).length;
ok('E11 planted: a lost or cancelled job pinned as a deed is caught (only done and paid-in-part pin)', pinned(['civilian_contract_done', 'fail_civilian_contract', 'cancel_contract', 'civilian_contract_poor']) === 2 && pinned(['fail_civilian_contract']) === 0);
/* E12 A GATE HE HELD (rule 453, his impact): a raid he held is a deed marked held, kept apart from the jobs */
{ const r12 = H.make(); H.plant(r12, { x: 4, y: 4, name: 'Gate' }, 2); const g12 = H.give(r12, { id: 'raid:1:3', kind: 'deed', name: 'Held the gate', from: 'Colorful', held: true, day: 3 }, []);
  const j12 = H.give(r12, { id: 'deed:j1', kind: 'deed', name: 'Haul the salt', from: 'JEAN', day: 3 }, []);
  const dd = r12.deeds || [];
  ok('E12 a gate he held is pinned, marked held; a job beside it is not (' + dd.map(x => x.name + (x.held ? '*' : '')).join(', ') + ')', g12.ok && j12.ok && dd.length === 2 && dd[0].held === true && dd[1].held === false, JSON.stringify(dd));
  const z12 = H.make(); H.plant(z12, { x: 4, y: 4, name: 'Gate' }, 2); const x12 = Object.assign({}, { id: 'raid:2:3', kind: 'deed', name: 'Held the gate', from: 'Colorful', day: 3 }); H.give(z12, x12, []);
  ok('E12 planted: the held mark left off, the gate reads as a job (the leg above would be red)', !((z12.deeds || [])[0] || {}).held); }
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
      /* D16 HIS PLACE THROUGH ITS CAMERAS (rule 451(c), ask row 625): three fixed cameras on his place, a real tap switches them */
      await close15();
      const camTap16 = async i => { const b = await fr.evaluate(i => { const e = document.querySelector('#hcamb button[data-cam="' + i + '"]'); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, r.width, r.height, r.right <= innerWidth && r.left >= 0 && r.top >= 0]; }, i);
        if (b) { await P.touchscreen.tap(fb.x + b[0], fb.y + b[1]); await P.waitForTimeout(900); } return b; };
      const c16 = await fr.evaluate(() => ({ cam: window.__HOME_CAM, txt: (document.getElementById('hcam') || {}).textContent || '', btns: document.querySelectorAll('#hcamb button').length }));
      ok('D16 his place opens on its cameras: "' + c16.txt + '", three to switch', !!c16.cam && c16.cam.n === 0 && /REC/.test(c16.txt) && /CAM 1/.test(c16.txt) && c16.btns === 3, JSON.stringify(c16));
      const b16 = await camTap16(1);
      const c16b = await fr.evaluate(() => ({ cam: window.__HOME_CAM, txt: (document.getElementById('hcam') || {}).textContent || '' }));
      ok('D16 a real tap on CAM 2: THE LOTS, closer (zoom ' + (c16b.cam && c16b.cam.zoom) + '), the button 44 px on the glass', !!b16 && b16[3] >= 44 && b16[4] && c16b.cam && c16b.cam.n === 1 && c16b.cam.zoom > 1 && /THE LOTS/.test(c16b.txt), JSON.stringify({ b16, c16b }));
      await fr.evaluate(() => { window.__HOME_THING = null; });
      for (let t = 0; t < 3; t++) { const w = await fr.evaluate(() => { const x = BohemiaSettlement.where('h11'); return x ? [x.x, x.y] : null; }); if (!w) break; await P.touchscreen.tap(fb.x + w[0], fb.y + w[1]); let up = false; for (let i = 0; i < 12 && !up; i++) { await P.waitForTimeout(250); up = await fr.evaluate(() => !!window.__HOME_THING); } if (up) break; }
      const t16 = await fr.evaluate(() => ({ th: window.__HOME_THING && window.__HOME_THING.name, cam: window.__HOME_CAM && window.__HOME_CAM.n }));
      ok('D16 at CAM 2 the pot is seen and a tap on it still says what it is (' + t16.th + ')', /POT/.test(t16.th || '') && t16.cam === 1, JSON.stringify(t16));
      await close15();
      await camTap16(2);
      const c16c = await fr.evaluate(() => { const v = BohemiaSettlement.fit(), L = BohemiaSettlement.folk().filter(p => p.resident).map(p => { const q = BohemiaSettlement.toScreen(p.x, p.y); return [p.name, q.x >= 0 && q.x <= v.W && q.y >= 0 && q.y <= v.H]; }); return { cam: window.__HOME_CAM, L }; });
      ok('D16 CAM 3: THE PEOPLE, the ones who live there in the shot (' + c16c.L.filter(x => x[1]).map(x => x[0]).join(', ') + ')', c16c.cam && c16c.cam.n === 2 && c16c.L.some(x => x[1]), JSON.stringify(c16c));
      await camTap16(0);
      const c16d = await fr.evaluate(() => window.__HOME_CAM);
      ok('D16 CAM 1 brings the whole yard back (zoom ' + (c16d && c16d.zoom) + ')', c16d && c16d.n === 0 && c16d.zoom === 1, JSON.stringify(c16d));
      await fr.evaluate(() => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home)); h.planted = false; window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); }); await P.waitForTimeout(700);
      const m16 = await fr.evaluate(() => ({ el: !!document.getElementById('hcam'), cam: window.__HOME_CAM }));
      ok('D16 planted: a place that is not his planted place has no cameras (the leg above reads red)', !m16.el && !m16.cam, JSON.stringify(m16));
      await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); }); await P.waitForTimeout(2500); await gone15(); await close15();
      /* D17 HIS OWN BUILDINGS (rule 453(1)): the training yard, the forge, the lookout; each a door, seen in the cameras */
      const sel17 = q => fr.evaluate(q => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, q);
      const settle17 = async () => { for (let i = 0; i < 25; i++) { const still = await fr.evaluate(() => { const t = getComputedStyle(document.getElementById('sheet')).transform; return t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)'; }).catch(() => true); if (still) return; await P.waitForTimeout(100); } };   /* a thumb taps the row it sees: the sheet's opening has finished (measured 11/17: a row read mid-opening, at a tenth of its size) */
      const tapQ17 = async (q, done) => { for (let t = 0; t < 3; t++) { await settle17(); const w = await sel17(q); if (!w) return false; await P.touchscreen.tap(fb.x + w[0], fb.y + w[1]); for (let i = 0; i < 12; i++) { await P.waitForTimeout(250); if (await fr.evaluate(done).catch(() => false)) return true; } } return false; };
      await F.evaluate(() => { const w = wagonGet() || {}; w.tape = 30; wagonPut(w); window.__HOME_PLACE_BUILT = null; });
      await tap15('build', () => { if (/^h\d+$/.test(BohemiaSettlement.state.open || '')) { const m = document.querySelector('#sbody .act[data-home="more"]'); if (m) m.click(); } return !!document.querySelector('#sbody .act[data-place="yard"]'); });
      const rows17 = await fr.evaluate(() => [...document.querySelectorAll('#sbody .act[data-place]')].map(b => b.dataset.place + ':' + b.textContent));
      ok('D17 the desk offers his own three: ' + rows17.map(x => x.split(':')[0]).join(', '), ['yard', 'forge', 'lookout'].every(k => rows17.some(x => x.indexOf(k + ':') === 0)) && rows17.every(x => /1 BATTERY/.test(x)), JSON.stringify(rows17));
      const b17 = await F.evaluate(() => loopBats());
      await tapQ17('#sbody .act[data-place="yard"]', () => !!window.parent.__HOME_PLACE_BUILT);
      const y17 = await F.evaluate(() => ({ built: window.__HOME_PLACE_BUILT, tape: (wagonGet() || {}).tape, bats: loopBats() }));
      ok('D17 a real tap on TRAINING YARD puts it up: 1 battery (' + b17 + ' -> ' + y17.bats + ') and 3 tape (30 -> ' + y17.tape + ')', !!y17.built && y17.built.id === 'yard' && b17 - y17.bats === 1 && y17.tape === 27, JSON.stringify(y17));
      const pb17 = await F.evaluate(() => { const a = BohemiaHomeMap.placeBuild('forge'); DAY.day = (DAY.day | 0) + 1; const b = BohemiaHomeMap.placeBuild('lookout'); DAY.day = (DAY.day | 0) + 1; const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); return [a.ok || a.why, b.ok || b.why]; });   /* the fourth lot fills, the place grows, the lookout goes up on the fifth */
      await P.waitForTimeout(2500); await gone15(); await close15();
      const pl17 = await fr.evaluate(() => (window.__HOME_DESK.home.places || []).map(p => ({ id: p.id, k: 'h' + p.lot, done: p.done })));
      ok('D17 the next days all three stand, each a door (' + pl17.map(p => p.id + '=' + p.k).join(', ') + '; the forge ' + pb17[0] + ', the lookout ' + pb17[1] + ' on the lot the place grew)', pl17.length === 3 && pl17.every(p => p.done) && await fr.evaluate(ks => ks.every(k => (window.__HOME_DOORS || []).indexOf(k) >= 0), pl17.map(p => p.k)), JSON.stringify(pl17));
      await camTap16(1);
      const seen17 = await fr.evaluate(ks => { const v = BohemiaSettlement.fit(); return ks.map(k => { const b = BohemiaSettlement._box(k); if (!b) return [k, false]; const a = BohemiaSettlement.toScreen((b[0] + b[2]) / 2, (b[1] + b[3]) / 2); return [k, a.x >= 0 && a.x <= v.W && a.y >= 0 && a.y <= v.H]; }); }, pl17.map(p => p.k));
      ok('D17 CAM 2 sees them standing on his lots (' + seen17.filter(x => x[1]).map(x => x[0]).join(', ') + ')', seen17.every(x => x[1]), JSON.stringify(seen17));
      const yk17 = pl17.filter(p => p.id === 'yard')[0].k, fk17 = pl17.filter(p => p.id === 'forge')[0].k, lk17 = pl17.filter(p => p.id === 'lookout')[0].k;
      await tap15(yk17, () => !!document.querySelector('#sbody .act[data-train]'));
      const bt17 = await F.evaluate(() => loopBats());
      await tapQ17('#sbody .act[data-train]', () => !!window.__HOME_TRAINED);
      const t17 = await F.evaluate(() => ({ all: BohemiaHomeMap.trainedAll(), bats: loopBats() }));
      const tn17 = await fr.evaluate(() => window.__HOME_TRAINED), rw17 = await fr.evaluate(() => ({ open: BohemiaSettlement.state.open, thing: window.__HOME_THING, rows: [...document.querySelectorAll('#sbody .act[data-train]')].map(b => b.dataset.train + (b.disabled ? ':off' : '')) }));
      ok('D17 a real tap on the yard, then on a man: ' + (tn17 && tn17.name) + ' trained for ' + (tn17 && tn17.cost) + ' batteries, +35% XP over his next ' + (tn17 && tn17.left) + ' fights', !!tn17 && t17.all[tn17.name] && t17.all[tn17.name].left === 3 && bt17 - t17.bats === tn17.cost, JSON.stringify({ tn17, t17, bt17, rw17 }));
      await close15();
      await tap15(fk17, () => !!document.querySelector('#sbody .act[data-press]'));
      const w17 = await F.evaluate(() => wagonGet() || {});
      await tapQ17('#sbody .act[data-press]', () => !!window.__HOME_PRESS);
      const w17b = await F.evaluate(() => wagonGet() || {});
      ok('D17 the forge: a real tap presses 2 tape into 6 rounds (tape ' + w17.tape + ' -> ' + w17b.tape + ', rounds ' + w17.rounds + ' -> ' + w17b.rounds + ')', w17.tape - w17b.tape === 2 && w17b.rounds - w17.rounds === 6, JSON.stringify({ w17, w17b }));
      await close15();
      await tap15(lk17, () => window.__HOME_THING && window.__HOME_THING.id === 'lookout');
      const l17 = await fr.evaluate(() => (document.querySelector('#sbody .say p') || {}).textContent || '');
      const lw17 = await F.evaluate(() => window.__HOME_WATCH);
      ok('D17 the lookout says what it sees ("' + l17 + '")', lw17 && (lw17.none ? /Nobody within 10 blocks/.test(l17) : new RegExp(lw17.d + ' blocks ' + lw17.dir.toLowerCase()).test(l17)), JSON.stringify(lw17));
      await close15();
      await tap15('build', () => { if (/^h\d+$/.test(BohemiaSettlement.state.open || '')) { const m = document.querySelector('#sbody .act[data-home="more"]'); if (m) m.click(); } return !!document.querySelector('#sbody .hcan'); });
      const can17 = await fr.evaluate(() => window.__HOME_CAN || []);
      ok('D17 the desk says his place can TRAIN, CRAFT and WATCH (' + can17.join(', ') + ')', ['TRAIN', 'CRAFT', 'WATCH'].every(c => can17.indexOf(c) >= 0), JSON.stringify(can17));
      await close15(); await camTap16(0);
      /* D19 HIS PLACE SEEN AS HE WILL SEE IT (rule 458(c), ask row 639: 'every time you show me my settlement, I wanna see the view that
         I'm gonna be seeing the settlement in... like security cameras'): every camera a camera; a close shot on what he taps; his men
         at his buildings; a finger through the lens */
      await close15();
      const look19 = () => fr.evaluate(() => { const cv = document.getElementById('cv'), hl = document.getElementById('hlens'), L = window.__HOME_LENS || {}, z = BohemiaSettlement.lens(), w = cv.offsetWidth, h = cv.offsetHeight;
        return { n: (window.__HOME_CAM || {}).n, persp: /matrix3d/.test(cv.style.transform), sensor: /grayscale/.test(cv.style.filter), tape: !!(hl && hl.offsetWidth && hl.querySelector('.scan') && hl.querySelector('.roll') && hl.querySelector('.vig')),
          clock: hl ? ((hl.querySelector('.ts') || {}).textContent || '') : '', tilt: L.tilt, seen: L.seen, covered: [[0, 0], [w, 0], [0, h], [w, h]].every(q => { const p = z.inv(q[0], q[1]); return !!p && p.x >= -1 && p.x <= w + 1 && p.y >= -1 && p.y <= h + 1; }) }; });
      const L19 = []; for (const n of [0, 1, 2]) { await camTap16(n); await P.waitForTimeout(300); L19.push(await look19()); }
      const cam19 = c => c.persp && c.sensor && c.tape && /^01-01-80 /.test(c.clock) && c.covered && c.seen === true;
      ok('D19 every camera is a camera: its own mount (tilts ' + L19.map(c => c.tilt).join(', ') + '), the sensor, the tape, the wrong clock (' + (L19[0] && L19[0].clock) + '), the glass filled, all twelve lots in its frame', L19.length === 3 && L19.every(cam19) && new Set(L19.map(c => c.tilt)).size === 3, JSON.stringify(L19));
      const pl19 = await fr.evaluate(() => { const cv = document.getElementById('cv'), hl = document.getElementById('hlens'), f = cv.style.filter; cv.style.filter = ''; if (hl) hl.style.display = 'none'; return f; });
      const L19p = await look19(); await fr.evaluate(f => { const cv = document.getElementById('cv'), hl = document.getElementById('hlens'); cv.style.filter = f; if (hl) hl.style.display = ''; }, pl19);
      ok('D19 planted: the camera\'s sensor and tape taken off read red', !cam19(L19p), JSON.stringify(L19p));
      await camTap16(0);
      const yk19 = await fr.evaluate(() => { const p = (window.__HOME_DESK.home.places || []).filter(q => q.id === 'yard')[0]; return p ? 'h' + p.lot : null; });
      const wid19 = k => fr.evaluate(k => { const b = BohemiaSettlement._raw(k), z = BohemiaSettlement.lens(), v = BohemiaSettlement._view(), sh = document.getElementById('sheet'), L = window.__HOME_LENS || {};
        const A = z.out(v.ox + b[0] * v.s, v.oy + b[1] * v.s), B = z.out(v.ox + b[2] * v.s, v.oy + b[3] * v.s);
        return { close: L.close, seen: L.seen, k: L.k, w: Math.round(Math.abs(B.x - A.x)), bottom: Math.round(Math.max(A.y, B.y)), top: Math.round(Math.min(A.y, B.y)), sheet: sh.classList.contains('on') ? sh.offsetTop : null, txt: (document.getElementById('hcam') || {}).textContent }; }, k);
      const w19 = await wid19(yk19);
      const p19 = await fr.evaluate(k => { const x = BohemiaSettlement.where(k), r = document.getElementById('cv').getBoundingClientRect(), z = BohemiaSettlement.lens(), L = z.inv(x.x - r.left, x.y - r.top);
        const a = L ? z.hit(L.x, L.y) : null, b = z.hit(x.x - r.left, x.y - r.top); z.clear(); return { mapped: a, flat: b, moved: L ? Math.round(Math.hypot(L.x - (x.x - r.left), L.y - (x.y - r.top))) : null }; }, yk19);
      /* the plant bites where the lens moves the yard (upright, measured 11/17); on its side CAM 1 sees the yard within a few px of flat */
      ok('D19 a finger goes through the lens: where the camera shows the yard, the yard answers (' + p19.mapped + ', the lens moves it ' + p19.moved + ' px)' + (prof === 'phone_portrait' ? '; PLANTED: the same spot read flat, without the lens, is ' + (p19.flat || 'nothing') : ''), p19.mapped === yk19 && (prof !== 'phone_portrait' || p19.flat !== yk19), JSON.stringify(p19));
      await tap15(yk19, () => window.__HOME_THING && window.__HOME_THING.id === 'yard'); await P.waitForTimeout(700);
      const c19 = await wid19(yk19);
      ok('D19 a real tap on the training yard cuts the camera close on it ("' + (c19.txt || '').replace(/\s+/g, ' ') + '", ' + w19.w + ' -> ' + c19.w + ' px wide, all of it above the sheet)', c19.close === 'TRAINING YARD' && c19.seen === true && c19.sheet != null && c19.bottom <= c19.sheet + 2 && c19.top >= 0 && c19.w >= w19.w && (prof !== 'phone_portrait' || c19.w > w19.w * 1.3) && /TRAINING YARD/.test(c19.txt || ''), JSON.stringify({ w19, c19 }));
      const m19 = await fr.evaluate(() => { const W = window.__HOME_WORKERS || [], here = BohemiaSettlement.crewHere().map(p => p.name); return { W, twice: W.filter(w => here.filter(n => n === w.name).length !== 1).map(w => w.name) }; });
      ok('D19 his men stand at his own buildings (' + m19.W.map(w => w.name + ' at the ' + w.at).join(', ') + '), each once in his place', m19.W.length >= 2 && m19.W.some(w => w.at === 'yard') && m19.W.some(w => w.at === 'forge') && !m19.twice.length, JSON.stringify(m19));
      await close15();
      const back19 = await fr.evaluate(() => ({ close: (window.__HOME_LENS || {}).close || null, n: (window.__HOME_CAM || {}).n }));
      ok('D19 the sheet put away, the camera is back on its mount (CAM ' + ((back19.n | 0) + 1) + ')', back19.close === null && back19.n === 0, JSON.stringify(back19));
      await F.evaluate(() => { const r = BohemiaHomeMap.rec(); r.places = []; localStorage.removeItem('bohemia.home.trained.v1'); DAY.day = (DAY.day | 0) - 2; const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); });
      await P.waitForTimeout(2500); await gone15(); await close15();   /* the gate's three come down so the legs after build where they always did */
      /* D18 HIS IMPACT SEEN AT HIS PLACE (rule 453(3)): a job he did is pinned on the cork board, which goes up by itself, seen at CAM 2 */
      const d18 = await F.evaluate(() => { BohemiaJobKinds.settleJob({ id: 'gate-18a', from: 'HENDERSON', title: 'Bring back the medic', plays: 'find-person' }, 'civilian_contract_done');
        BohemiaJobKinds.settleJob({ id: 'gate-18b', from: 'JEAN', title: 'Haul the salt', plays: 'haul-caravan' }, 'civilian_contract_done');
        BohemiaJobKinds.settleJob({ id: 'gate-18c', from: 'JEAN', title: 'Lost job', plays: 'carry' }, 'fail_civilian_contract');
        const s = BohemiaHomeMap.state(); return { deeds: (s.deeds || []).map(x => x.name), board: (s.places || []).filter(p => p.id === 'board') }; });
      ok('D18 three jobs end through the jobs\' own settle: the two done are pinned, the lost one not (' + d18.deeds.join(', ') + '); the cork board goes up by itself (lot ' + (d18.board[0] && d18.board[0].lot) + ')',
        d18.deeds.length === 2 && d18.deeds.indexOf('Lost job') < 0 && d18.board.length === 1 && d18.board[0].done, JSON.stringify(d18));
      await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); }); await P.waitForTimeout(2500); await gone15(); await close15();
      const bk18 = 'h' + d18.board[0].lot;
      await camTap16(1);
      const sb18 = await fr.evaluate(k => { const v = BohemiaSettlement.fit(), b = BohemiaSettlement._box(k); if (!b) return null; const a = BohemiaSettlement.toScreen((b[0] + b[2]) / 2, (b[1] + b[3]) / 2); return a.x >= 0 && a.x <= v.W && a.y >= 0 && a.y <= v.H; }, bk18);
      ok('D18 CAM 2 sees the cork board standing on his lot (' + bk18 + ')', sb18 === true);
      await tap15(bk18, () => window.__HOME_THING && window.__HOME_THING.id === 'board');
      const t18 = await fr.evaluate(() => ({ say: (document.querySelector('#sbody .say p') || {}).textContent || '', lines: [...document.querySelectorAll('#sbody [data-deed]')].map(e => e.textContent) }));
      ok('D18 a real tap on it: "' + t18.say + '" and the jobs pinned (' + t18.lines.join(' | ') + ')', /2 jobs done\. 1 brought home\./.test(t18.say) && t18.lines.length === 2 && /MEDIC/.test(t18.lines.join(' ')), JSON.stringify(t18));
      /* D18 a gate he held (rule 453, his impact): a raid held at his place is pinned; one held elsewhere is not; the jobs' count stays the jobs' */
      const h18 = await F.evaluate(() => { const H = BohemiaHomeBases, rec = hbRec(), mine = BohemiaBetween.mine(), other = Object.keys(ctBases()).find(n => n !== mine);
        const o1 = H.openRaid(rec, { base: mine, by: 'Colorful', day: DAY.day }), c1 = H.closeRaid(rec, { base: mine, outcome: 'held', day: DAY.day, how: 'fought' });
        const o2 = other ? H.openRaid(rec, { base: other, by: 'Colorful', day: DAY.day }) : null; if (o2 && o2.applied) H.closeRaid(rec, { base: other, outcome: 'held', day: DAY.day, how: 'fought' });
        window.__HOME_RAIDS_HELD(); window.__HOME_RAIDS_HELD();
        const s = BohemiaHomeMap.state(); return { opened: !!(o1 && o1.applied), other: !!(o2 && o2.applied), deeds: (s.deeds || []).map(x => x.name + (x.held ? '*' : '') + '@' + x.from) }; });
      ok('D18 a raid he held at his gate is pinned on the board, once; one held at another place is not (' + h18.deeds.join(', ') + ')', h18.opened && h18.deeds.filter(x => /^Held the gate\*@Colorful/.test(x)).length === 1, JSON.stringify(h18));
      await close15(); await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); }); await P.waitForTimeout(2500); await gone15(); await close15();
      await tap15(bk18, () => window.__HOME_THING && window.__HOME_THING.id === 'board');
      const t18h = await fr.evaluate(() => ({ say: (document.querySelector('#sbody .say p') || {}).textContent || '', lines: [...document.querySelectorAll('#sbody [data-deed]')].map(e => e.textContent), lens: (window.__HOME_LENS || {}).close || null }));
      ok('D18 seen on the camera: a tap on the board, close (' + t18h.lens + '): the held gate among the papers, the jobs still counted as jobs ("' + t18h.say + '")', /2 jobs done\./.test(t18h.say) && t18h.lines.some(l => /HELD THE GATE/.test(l) && /COLORFUL/.test(l)) && t18h.lens === 'CORK BOARD', JSON.stringify(t18h));
      await close15(); await camTap16(0);
      await fr.evaluate(() => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home)); h.places = []; window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); }); await P.waitForTimeout(700);
      const m18 = await fr.evaluate(k => (window.__HOME_DOORS || []).indexOf(k) >= 0, bk18);
      ok('D18 planted: the board taken off the message leaves no door (the leg above would be red)', m18 === false);
      await F.evaluate(() => { try { const R = hbRec(), m = BohemiaBetween.mine(); R.raids = (R.raids || []).filter(x => x.base !== m || x.by !== 'Colorful'); } catch (e) {} });   /* the gate's own raid comes down with the board, or the poll pins it again */
      await F.evaluate(() => { const r = BohemiaHomeMap.rec(); r.places = []; r.deeds = []; r.things = r.things.filter(t => t.kind !== 'deed'); const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); });
      await P.waitForTimeout(2500); await gone15(); await close15();   /* the board comes down so the legs after build where they always did */
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
        return { t, plan: window.__HOME_PLAN || null, canvas: !!c, press, open: BohemiaSettlement.state.open, lens: window.__HOME_LENS || null }; });
      ok('D8 the desk: A NIGHT, LIVING HERE, NAME IT', dk.open === 'build' && /A NIGHT/.test(dk.t) && /LIVING HERE/.test(dk.t) && /NAME IT/.test(dk.t), dk.t.slice(0, 200).replace(/\n/g, ' '));
      /* rule 458(c): no top-down plan on the desk; his lots on their own ground in the feed, the camera on THE LOTS, all of them in its glass */
      const plan8 = (d) => !d.canvas && !!d.plan && d.plan.feed && d.plan.lots === 12 && d.plan.open === 4 && d.plan.signs.indexOf('POT') >= 0 && !!d.lens && d.lens.close === 'THE LOTS' && d.lens.seen === true;
      ok('D8 no top-down plan: his ' + (dk.plan && dk.plan.lots) + ' lots on their own ground in the feed, ' + (dk.plan && dk.plan.open) + ' open, the camera on ' + (dk.lens && dk.lens.close) + ', standing: ' + (dk.plan && dk.plan.signs.join(',')), plan8(dk), JSON.stringify({ plan: dk.plan, lens: dk.lens, canvas: dk.canvas }));
      const dkp = await fr.evaluate(() => { const c = document.createElement('canvas'); c.className = 'hplan'; document.getElementById('sbody').appendChild(c); const r = !!document.querySelector('#sbody canvas.hplan'); c.remove(); return r; });
      ok('D8 planted: a top-down plan put back on the desk reads red', !plan8(Object.assign({}, dk, { canvas: dkp })));
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
      const lp10 = await fr.evaluate(() => window.__HOME_LOT_AT ? window.__HOME_LOT_AT(2) : null);   /* rule 458(c): lot 3 where the camera shows it */
      if (lp10) { await P.touchscreen.tap(fb.x + lp10.x, fb.y + lp10.y); await P.waitForTimeout(900); }
      ok('D10 lot 3 seen in the feed is a thumb\'s target (' + (lp10 && lp10.w) + ' px wide on the glass)', !!lp10 && lp10.w >= 44, JSON.stringify(lp10));
      const pick = await fr.evaluate(() => window.__HOME_PICK);
      await fr.evaluate(() => { const b = [...document.querySelectorAll('#sbody .act')].find(x => /GARDEN BED/.test(x.textContent)); if (b) b.click(); }); await P.waitForTimeout(1000);
      const lots10 = await F.evaluate(() => Object.keys(LOT_BOOK[BohemiaBetween.mine()].lots));
      ok('D10 he picked lot ' + ((pick | 0) + 1) + ' by a real tap on its ground in the feed and the garden went up there (' + lots10.join(' ') + ')', pick === 2 && lots10.indexOf('2,0') >= 0, JSON.stringify({ pick, lots10 }));
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
      /* D17 the crew screen counts the yard: a man trained climbs his share more from the fight's own count (BOHEMIA_ROSTER_SCREEN __HOME_BASE_TRAINED__) */
      await F.evaluate(() => { try { loopClose(); } catch (e) {} const c = JSON.parse(localStorage.getItem('bohemia.climb.v1') || '{}'); window.__G17 = { you: (c.YOU && c.YOU.xp) || 0, desi: (c.DESI && c.DESI.xp) || 0 };
        localStorage.setItem('bohemia.home.trained.v1', JSON.stringify({ YOU: { mult: 1.35, left: 3, day: 2 } }));
        localStorage.setItem('bohemia.fight.after.v1', JSON.stringify([{ day: 2, rows: [{ name: 'YOU', xpGained: 100 }, { name: 'DESI', xpGained: 100 }] }])); });
      await P.waitForTimeout(800);
      for (const fx of P.frames()) { const h = await fx.evaluate(() => { const c = [...document.querySelectorAll('#bohphone .app[data-app=crew]')].find(e => e.getBoundingClientRect().width > 0); if (!c) return null; const r = c.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }).catch(() => null); if (h) { await P.touchscreen.tap(h[0], h[1]); break; } }
      let R17 = null; for (let i = 0; i < 80 && !R17; i++) { R17 = P.frames().find(x => /ROSTER_SCREEN/.test(x.url())); if (R17 && !(await R17.evaluate(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready).catch(() => false))) R17 = null; if (!R17) await P.waitForTimeout(250); }
      await P.waitForTimeout(1500);
      const r17 = await F.evaluate(() => { const c = JSON.parse(localStorage.getItem('bohemia.climb.v1') || '{}'), b = window.__G17; return { you: ((c.YOU && c.YOU.xp) || 0) - b.you, desi: ((c.DESI && c.DESI.xp) || 0) - b.desi, left: (JSON.parse(localStorage.getItem('bohemia.home.trained.v1') || '{}').YOU || {}).left }; });
      ok('D17 on the crew screen the same 100 XP fight gave the trained man ' + (r17.you - r17.desi) + ' more than the untrained (his training: ' + r17.left + ' fights left)', !!R17 && r17.you - r17.desi === 35 && r17.left === 2, JSON.stringify(r17));
      await F.evaluate(() => { localStorage.removeItem('bohemia.home.trained.v1'); });
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
