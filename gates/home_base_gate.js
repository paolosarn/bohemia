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
     D18 WHAT HE DID IS REMEMBERED, THE CORK BOARD IS DEAD (rule 466(b), HOME BASE 2 11/21): jobs ending through the jobs' own settle
         are deeds (the done, never the lost), a raid held at his gate is one deed marked held, and no board goes up, nothing of it in
         what the map hands the screen. PLANTED: a board in a save from before the kill comes down when the place loads.
         E11: a lost or cancelled job kept as a deed is caught; the board is no place any more.
     D20 WHERE HE BUILDS (EYES 11/18): with nothing open his empty lots chalked under a hammer's plate, a real tap on one is BUILD with
         it picked (planted: no planted place, no lots); at night the cameras' infrared (planted: the day back, the day sensor).
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
     F8  ONCE AND IN THE GROUND (rule 479, HOME BASE 3 11/22): every camera, each thing and each person drawn once, each on his shadow.
     F7  THE OVERFLOW (rule 466(a) step 4, HOME BASE 3 11/22): a piece whose row is full stands on a free lot behind it, its own picture.
     D22 THE GRINDER (rule 469, HOME BASE 3 11/22): built from the desk, standing, seen; the dead of a won fight home; GRIND; sold and found.
     G0-G9 (engine) THE GRINDER: the carry, the heat, one tap, the brain out, the bad cut, selling, the late shakes, the stores.
     D21 IT STARTS BARE (rule 445(b), HOME BASE 2 11/21): his place opens on its own ground with nothing built on it (home_base/bare_*,
         by day and by night, upright and sideways), its doors only his things and BUILD: none of the camp's eight (the post, the board,
         the stall, the bar, the bench, the barber, the clinic, the lot), no keeper, no crowd, no stranger walking, no town's situation.
         PLANTED: a town that is not his, opened through the map, keeps its picture, doors and keepers, and the leg reads red on it.
     D15 WHAT YOU BUILD OPENS A DOOR (rule 445(b)): with no vendor stall, shed or roof no TRADE, MEND or HEAL door stands on his ground;
         a vendor stall standing IS the stall's door (one door), somebody come to work it, and a real tap on it trades; the desk says
         YOUR PLACE CAN TRADE, MEND (shut), HEAL (shut). PLANTED: the rows taken off the message, the stall is a plain build, red.
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
ok('E11 a job done is a deed: before planting it waits, planting keeps it, the same job twice is one, no lot of its own; the cork board is no place any more (' + bd.why + ', rule 466(b))',
  dw.waiting && dpw.length === 1 && rD.deeds.length === 2 && d2b.again && rD.deeds.every(x => x.lot == null) && rD.deeds[0].saved && !bd.ok && bd.why === 'NOT_A_PLACE', JSON.stringify(rD.deeds));
const pinned = acts => acts.filter(a => /^civilian_contract_(done|poor)$/.test(a)).length;
ok('E11 planted: a lost or cancelled job pinned as a deed is caught (only done and paid-in-part pin)', pinned(['civilian_contract_done', 'fail_civilian_contract', 'cancel_contract', 'civilian_contract_poor']) === 2 && pinned(['fail_civilian_contract']) === 0);
/* E12 A GATE HE HELD (rule 453, his impact): a raid he held is a deed marked held, kept apart from the jobs */
{ const r12 = H.make(); H.plant(r12, { x: 4, y: 4, name: 'Gate' }, 2); const g12 = H.give(r12, { id: 'raid:1:3', kind: 'deed', name: 'Held the gate', from: 'Colorful', held: true, day: 3 }, []);
  const j12 = H.give(r12, { id: 'deed:j1', kind: 'deed', name: 'Haul the salt', from: 'JEAN', day: 3 }, []);
  const dd = r12.deeds || [];
  ok('E12 a gate he held is pinned, marked held; a job beside it is not (' + dd.map(x => x.name + (x.held ? '*' : '')).join(', ') + ')', g12.ok && j12.ok && dd.length === 2 && dd[0].held === true && dd[1].held === false, JSON.stringify(dd));
  const z12 = H.make(); H.plant(z12, { x: 4, y: 4, name: 'Gate' }, 2); const x12 = Object.assign({}, { id: 'raid:2:3', kind: 'deed', name: 'Held the gate', from: 'Colorful', day: 3 }); H.give(z12, x12, []);
  ok('E12 planted: the held mark left off, the gate reads as a job (the leg above would be red)', !((z12.deeds || [])[0] || {}).held); }
/* G THE GRINDER (HOME BASE 3, 11/22, VAMILY rule 469: his 'C' and 'Ppl dont eat the brain tho'; engine/bohemia_grinder.js) */
{ const G = require(path.join(ROOT, 'engine/bohemia_grinder.js')); G.setData(DATA); const GD = DATA.grinder, val = k => (GD[k] && GD[k].value != null ? GD[k].value : GD[k]);
  const seq = a => { let i = 0; return () => a[Math.min(i++, a.length - 1)]; };
  ok('G0 the grinder is one of his own buildings (GRIND, ' + JSON.stringify(DATA.places.grinder.cost) + '), every number in the file with its source', DATA.places.grinder && DATA.places.grinder.can === 'GRIND'
    && ['carry_a_man', 'body_kg', 'meat_share', 'cure_keep', 'keep_h', 'bad_cut_pct', 'bought_bad_pct', 'takes_pct', 'incubation_years', 'dies_years', 'found_out_pct', 'found_out_act', 'shakes_town_act'].every(k => GD[k] && GD[k].value != null && (GD[k].source || GD[k].unit)));
  const c3 = Math.floor(G.carryKg(3) / val('body_kg')), c6 = Math.floor(G.carryKg(6) / val('body_kg')), c12 = Math.floor(G.carryKg(12) / val('body_kg'));
  const s1 = G.make(), b1 = G.bring(s1, { humans: 5, crew: 3, min: 0, day: 1, act: 1 });
  ok('G1 THE CARRY: a company carries ' + c3 + ', ' + c6 + ', ' + c12 + ' bodies at 3, 6, 12 men (a litter over a long walk); five dead and three men: ' + b1.took + ' home, ' + b1.left + ' left', c3 === 1 && c6 === 2 && c12 === 4 && b1.took === 1 && b1.left === 4, JSON.stringify(b1));
  const at23 = G.pileNow(s1, 23 * 60).dead, at24 = G.pileNow(G.load(JSON.parse(JSON.stringify(s1))), 24 * 60).dead;
  ok('G2 THE HEAT: the dead keep ' + val('keep_h') + ' hours on the road (at 23 h ' + at23 + ' good, at 24 h ' + at24 + ': thrown out, said nowhere)', at23 === 1 && at24 === 0);
  const per = Math.floor(val('body_kg') * val('meat_share') * val('cure_keep') / val('kg_a_night'));
  const s2 = G.make(); G.bring(s2, { humans: 2, crew: 6, min: 0, day: 1, act: 1 }); const g2 = G.grind(s2, { food: 10, min: 60, rand: () => 0.99 }), g2b = G.grind(s2, { food: 10, min: 61 });
  ok('G3 ONE TAP: two bodies grind into ' + g2.food + ' food (' + per + ' a body: ' + val('body_kg') + ' kg x ' + val('meat_share') + ' boneless x ' + val('cure_keep') + ' cured / ' + val('kg_a_night') + ' kg a night); the pile is empty after (' + g2b.why + ')',
    g2.ok && g2.food === Math.floor(2 * val('body_kg') * val('meat_share') * val('cure_keep') / val('kg_a_night')) && g2.dead === 2 && !g2b.ok && g2b.why === 'NOBODY' && s2.stores.man === g2.food, JSON.stringify({ g2, st: s2.stores }));
  ok('G4 NOBODY EATS THE BRAIN: the head comes off first in the data (' + val('head_out') + ') and in a mouth at the grinder ("' + DATA.places.words.grinder + '")', val('head_out') === true && /head/i.test(DATA.places.words.grinder));
  const s3 = G.make(); G.bring(s3, { humans: 1, crew: 6, min: 0 }); const bad3 = G.grind(s3, { food: 0, min: 1, rand: () => 0.0 });
  const s4 = G.make(); G.bring(s4, { humans: 0, beastKg: 40, crew: 6, min: 0 }); const bad4 = G.grind(s4, { food: 0, min: 1, rand: () => 0.0 });
  const s5 = G.make(); G.bring(s5, { humans: 1, crew: 6, min: 0 }); const bad5 = G.grind(s5, { food: 0, min: 1, rand: () => (val('bad_cut_pct') + 0.01) / 100 });
  ok('G5 THE BAD CUT is rare and has a cause: under ' + val('bad_cut_pct') + ' in 100 a batch with people in it takes it (' + bad3.bad + '), at ' + val('bad_cut_pct') + '.01 it does not (' + bad5.bad + '), a batch of a kill\'s meat alone never (' + bad4.bad + ', ' + bad4.food + ' food from 40 kg)', bad3.bad && !bad5.bad && !bad4.bad && bad4.food === Math.floor(40 * val('cure_keep') / val('kg_a_night')));
  const sale = (st, o) => G.sale(st, Object.assign({ units: 10, food: st.stores.sausage, place: 'GATE TOWN', day: 2, act: 1 }, o));
  const s6 = G.make(); G.bring(s6, { humans: 2, crew: 6, min: 0 }); G.grind(s6, { food: 0, min: 1, rand: () => 0.99 }); const f6 = sale(s6, { rand: () => 0.0 });
  const s7 = G.make(); G.bring(s7, { humans: 2, crew: 6, min: 0 }); G.grind(s7, { food: 0, min: 1, rand: () => 0.99 }); const f7 = sale(s7, { rand: () => 0.0, hungry: true });
  const s8 = G.make(); G.bring(s8, { humans: 0, beastKg: 60, crew: 6, min: 0 }); G.grind(s8, { food: 0, min: 1 }); const f8 = sale(s8, { rand: () => 0.0 });
  ok('G6 SELLING IT: a calm town that finds out it was people moves his name there by ' + f6.act + ' (' + f6.man + ' of 10 were people); a hungry town never asks (' + f7.found + '); a kill\'s sausage tells nobody anything (' + f8.found + ')',
    f6.found && f6.act === 'minor_offensive_action' && f6.man === 10 && !f7.found && f7.man === 10 && !f8.found && f8.man === 0, JSON.stringify({ f6, f7, f8 }));
  const s9 = G.make(); G.bring(s9, { humans: 2, crew: 6, min: 0, day: 3, act: 1 }); G.grind(s9, { food: 0, min: 1, rand: () => 0.0 });
  const mk = G.night(s9, { ate: 3, food: s9.stores.sausage, men: ['DESI', 'OKAFOR', 'RAY'], day: 3, act: 1, rand: seq([0, 0, 0.5, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0.5, 0.5]) });
  const sameAct = G.showing(s9, { act: 1, day: 40 }), nextAct = G.showing(s9, { act: 2, day: 5, yearsBetween: (a, b) => Math.abs(b - a) * 35 });
  ok('G7 THE SHAKES show late: a bad batch eaten marks ' + mk.map(m => m.name + ' (' + m.years + ' y)').join(', ') + '; in its own act a month on nothing shows (' + sameAct.length + '); 35 years on, the next act, it does (' + nextAct.map(m => m.name).join(', ') + ')',
    mk.length === 3 && mk.every(m => m.years >= 4.5 && m.years <= 50) && sameAct.length === 0 && nextAct.length === 3, JSON.stringify({ mk, nextAct }));
  const s10 = G.make(); G.bring(s10, { humans: 2, crew: 6, min: 0 }); G.grind(s10, { food: 0, min: 1, rand: () => 0.99 });
  const mk10 = G.night(s10, { ate: 3, food: s10.stores.sausage, men: ['DESI', 'OKAFOR', 'RAY'], day: 3, act: 1, rand: () => 0 });
  ok('G7 clean meat from his own grinder is safe: the same night out of a clean batch marks nobody (' + mk10.length + ')', mk10.length === 0);
  const s11 = G.make(); G.bring(s11, { humans: 2, crew: 6, min: 0 }); G.grind(s11, { food: 0, min: 1, rand: () => 0.0 }); sale(s11, { units: 20, rand: seq([0, 0, 0, 0.5, 0.5, 0.99]) });
  const tw1 = G.townsShaking(s11, { act: 2, day: 1, yearsBetween: (a, b) => Math.abs(b - a) * 35 }), tw2 = G.townsShaking(s11, { act: 2, day: 2, yearsBetween: (a, b) => Math.abs(b - a) * 35 });
  ok('G8 a town he sold a bad batch to finds out when its own people shake, an act on: ' + tw1.map(t => t.place + ' ' + t.act).join(', ') + ', once (then ' + tw2.length + ')', tw1.length === 1 && tw1[0].act === 'offensive_action' && tw2.length === 0, JSON.stringify(s11.sold));
  const s12 = G.make(); G.reconcile(s12, 100); s12.stores.sausage = 50; s12.stores.man = 50; G.reconcile(s12, 50);
  ok('G9 the stores: when the food count halves (the night, a sale, anything) his sausage in it halves too (' + s12.stores.sausage + ' of 50)', s12.stores.sausage === 25 && s12.stores.man === 25);
  const s13 = G.make(); G.bring(s13, { humans: 2, crew: 6, min: 0 }); G.grind(s13, { food: 0, min: 1, rand: () => 0.99 }); s13.stores.bad = s13.stores.sausage;   /* PLANTED: a clean batch written bad by hand */
  ok('G9 planted: a clean batch written bad by hand marks a man that night (the G7 safety leg would read red on it)', G.night(s13, { ate: 1, food: s13.stores.sausage, men: ['DESI'], day: 3, act: 1, rand: () => 0 }).length === 1);
  const nosell = G.make(); G.bring(nosell, { humans: 1, crew: 6, min: 0 }); const gx = G.grind(nosell, { food: 0, min: 24 * 60 + 5 });
  ok('G9 planted: the dead brought home two days ago grind into nothing (' + (gx.why || gx.food) + '): the heat leg would read red on a pile that never turns', !gx.ok && gx.why === 'NOBODY'); }
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
      /* D21 IT STARTS BARE (rule 445(b): 'everything will be in our own custom settlement that we build from the ground up'): his place
         is its own ground with nothing on it but what is his; no door, keeper, crowd or stranger of the camp's picture */
      const bareAt = async () => { for (let i = 0; i < 24; i++) { if (await fr.evaluate(() => { const b = window.__HOME_BARE_AT && __HOME_BARE_AT(); return !!(b && b.on && BohemiaSettlement.picIn() && b.doors.indexOf('build') >= 0); }).catch(() => false)) break; await P.waitForTimeout(250); }
        await P.waitForTimeout(600); return fr.evaluate(() => window.__HOME_BARE_AT ? __HOME_BARE_AT() : null).catch(() => null); };
      const CAMP21 = ['hall', 'board', 'stall', 'bar', 'arms', 'barber', 'clinic', 'lot'];
      const bare21 = b => !!b && b.on && b.doors.indexOf('build') >= 0 && b.doors.every(k => k === 'build' || /^h\d+$/.test(k)) && !b.keepers.length && !b.crowd && !b.post && !b.strangers && !b.traits;
      const pic21 = prof === 'phone_portrait' ? /^home_base\/bare_tall\.webp$/ : /^home_base\/bare_wide\.webp$/;
      const b21 = await bareAt();
      ok('D21 IT STARTS BARE: his place opens on its own ground with nothing built on it (' + (b21 && b21.pic) + ', by night ' + (b21 && b21.night) + '); the doors are his things only (' + (b21 && b21.doors.join(',')) + '): none of the camp\'s ' + CAMP21.length + ', no keeper, no crowd, no stranger walking',
        bare21(b21) && pic21.test(b21.pic || '') && /^home_base\/bare_.*_night\.webp$/.test(b21.night || ''), JSON.stringify(b21));
      const w21 = await fr.evaluate(() => ['stall', 'arms', 'clinic', 'hall', 'bar', 'barber'].map(k => !!BohemiaSettlement.where(k)));
      ok('D15 no vendor stall, no shed, no roof: no TRADE, MEND or HEAL door stands on his ground (nor the post, the bar, the barber)', w21.every(x => !x), JSON.stringify(w21));
      /* planted: a town that is not his, opened through the map's own door, keeps its picture, its doors and its people: the leg reads red on it */
      const on21 = await F.evaluate(() => { const bs = ctBases(), m = BohemiaBetween.mine(), n = Object.keys(bs).filter(k => k !== m && bs[k] && mapTierOf(k))[0]; if (!n) return null; loopOpenTown({ name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }); return n; });
      let o21 = null; for (let i = 0; i < 40 && on21; i++) { await P.waitForTimeout(300); o21 = await fr.evaluate(n => { const S = BohemiaSettlement.state; if (!S.place || S.place.name !== n || !BohemiaSettlement.picIn()) return null; return window.__HOME_BARE_AT(); }, on21).catch(() => null); if (o21 && o21.keepers.length) break; }
      ok('D21 planted: ' + on21 + ', a town that is not his, keeps its own picture (' + (o21 && o21.pic) + '), doors (' + (o21 && o21.doors.join(',')) + ') and keepers: the bare leg reads red on it', !!o21 && !bare21(o21) && !/^home_base\//.test(o21.pic || '') && o21.keepers.length >= 3, JSON.stringify(o21));
      await F.evaluate(() => BohemiaHomeMap.give({ id: 'gift:gate-stall', kind: 'build', build: 'stall', name: 'VENDOR STALL', from: 'THE GATE' }));
      await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); }); await P.waitForTimeout(2500); await gone15(); await close15();
      await bareAt();
      const o15 = await tap15('stall', () => !!document.getElementById('stallstrip') || !!window.__HOME_SHUT);
      const sl15 = await F.evaluate(() => { const bk = LOT_BOOK[BohemiaBetween.mine()]; for (const k in bk.lots) if (bk.lots[k].id === 'stall') return parseInt(k, 10); return null; });
      const ro15 = await fr.evaluate(l => { const b = __HOME_BARE_AT(); return { shut: window.__HOME_SHUT, real: !!document.getElementById('stallstrip'), doors: b.doors, keepers: b.keepers, crowd: b.crowd, hdoor: (window.__HOME_DOORS || []).indexOf('h' + l) >= 0, lot: l }; }, sl15);
      const shop15 = r => r.real && !r.shut && r.doors.indexOf('stall') >= 0 && !r.hdoor && r.keepers.indexOf('stall') >= 0;
      ok('D15 a vendor stall standing on lot ' + ((sl15 | 0) + 1) + ': the vendor stall IS the stall\'s door (one door, not two), somebody come to work it, ' + ro15.crowd + ' come to buy; a real tap on it trades (its own sheet)', o15 && shop15(ro15), JSON.stringify(ro15));
      /* D22 SELLING IT (HOME BASE 3, rule 469(c)): food with his people's sausage in it, sold at this stall by the stall's own SELL NOW (a
         real right click on SELL, the double tap's path); the odds of finding out set to every time for the leg: the town's bar moves by the ladder's act and
         the stall's strip says so; a hungry town would not ask (engine leg G6) */
      await F.evaluate(() => { BohemiaGrinder.data().found_out_pct.value = 100; const w = wagonGet() || {}; w.food = Math.max(w.food | 0, 40); wagonPut(w);
        const st = BohemiaHomeMap.grinderState(); st.stores.seen = w.food; st.stores.sausage = w.food; st.stores.man = w.food; });
      await fr.evaluate(() => { window.__GRINDER_FOUND = null; window.__GRINDER_SOLD = undefined; });
      const sb22 = await fr.evaluate(() => { const b = document.querySelector('#sbody .stline[data-key="food"] .sb[data-side="sell"]'); if (!b) return null; b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, b.className]; });
      if (sb22) await fr.click('#sbody .stline[data-key="food"] .sb[data-side="sell"]', { button: 'right', timeout: 6000 }).catch(() => {});   /* the stall's own SELL NOW (its right click, the double tap's same path: stallTap(key, side, true)), as a real click; two taps on a phone are one answer under the swallow */
      let fo22 = null; for (let i = 0; i < 16 && !(fo22 && fo22.found); i++) { await P.waitForTimeout(250); fo22 = await fr.evaluate(() => ({ found: window.__GRINDER_FOUND, sold: window.__GRINDER_SOLD === undefined ? 'no sale' : window.__GRINDER_SOLD, strip: (document.getElementById('stallstrip') || {}).textContent || '' })); }
      await F.evaluate(() => { BohemiaGrinder.data().found_out_pct.value = 15; });
      ok('D22 SELLING IT: a real SELL NOW sells food with his people\'s sausage in it (' + (fo22 && fo22.sold && fo22.sold.n) + ' units); they find out: this town\'s bar ' + (fo22 && fo22.found && fo22.found.before) + ' -> ' + (fo22 && fo22.found && fo22.found.after) + ' (' + (fo22 && fo22.found && fo22.found.act) + '), the strip: "' + String(fo22 && fo22.strip || '').slice(-34) + '"',
        !!sb22 && !!fo22 && !!fo22.found && fo22.found.act === 'minor_offensive_action' && fo22.found.before - fo22.found.after === 10 && /people/.test(fo22.strip || ''), JSON.stringify({ sb22, fo22 }));
      await close15();
      await fr.evaluate(() => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home)); h.opens = null; window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); }); await P.waitForTimeout(800);
      const m15 = await fr.evaluate(l => { const b = __HOME_BARE_AT(); return { shut: null, real: true, doors: b.doors, keepers: b.keepers, hdoor: (window.__HOME_DOORS || []).indexOf('h' + l) >= 0 }; }, sl15);
      ok('D15 planted: the build-to-door rows taken off the message, the vendor stall is a build like any other and no stall\'s door (the leg above reads red)', !shop15(m15) && m15.hdoor && m15.doors.indexOf('stall') < 0, JSON.stringify(m15));
      await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); }); await P.waitForTimeout(2500); await gone15(); await close15();   /* the real message again */
      /* the desk the way he reaches it: a real tap on an empty lot's own ground (the middle of the BUILD ground may be the vendor stall
         now, a shop's door: __IT_STARTS_BARE__), else the BUILD ground */
      const deskUp = () => { if (/^h\d+$/.test(BohemiaSettlement.state.open || '')) { const m = document.querySelector('#sbody .act[data-home="more"]'); if (m) m.click(); } return !!document.querySelector('#sbody .hcan'); };
      let d15 = false;
      for (let t = 0; t < 3 && !d15; t++) { const lp = await fr.evaluate(() => { const f = window.__HOME_FEED; if (!f || !f.on) return null; const n = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(x => !f.slots[x])[0]; return n ? window.__HOME_FEED_AT(n) : null; });   /* an empty lot of the footage */
        if (!lp) break; await P.touchscreen.tap(fb.x + lp.x, fb.y + lp.y); for (let i = 0; i < 12 && !d15; i++) { await P.waitForTimeout(250); d15 = await fr.evaluate(deskUp).catch(() => false); } }
      if (!d15) d15 = await tap15('build', deskUp);
      const can15 = await fr.evaluate(() => window.__HOME_CAN || []);
      ok('D15 the desk says what his place can do: ' + can15.join(', '), d15 && can15.indexOf('TRADE') >= 0 && can15.indexOf('MEND (shut)') >= 0 && can15.indexOf('HEAL (shut)') >= 0, JSON.stringify(can15));
      await close15();
      await F.evaluate(() => { const bk = LOT_BOOK[BohemiaBetween.mine()]; for (const k in bk.lots) if (bk.lots[k].id === 'stall') delete bk.lots[k]; });   /* the gate's stall comes down so the legs after build where they always did */
      /* F HIS CAMERAS AS PROMISED (rule 466(a), his NO 11/21 on the skewed board: 'Go back to when you originally showed me what the shit
         would look like from the different camera angles'; rules 354 (g) to (o), 373): his place IS the 11/3 footage */
      await close15();
      const MAN = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/home_settlement/manifest.json'), 'utf8'));
      const rowOfLot = {}; MAN.lots.forEach(L => { rowOfLot[L.n] = L.row; });
      const feed = () => fr.evaluate(() => { const f = window.__HOME_FEED || {}, c = document.getElementById('hfeed'), cv = document.getElementById('cv');
        let lit = 0; try { const g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data; for (let i = 0; i < d.length; i += 4 * 97) if (d[i] + d[i + 1] + d[i + 2] > 60) lit++; } catch (e) { lit = -1; }
        return { on: !!f.on, cam: f.cam, sh: f.sh, slots: f.slots || {}, unplaced: f.unplaced || [], lit, lens: !!document.getElementById('hlens') || /matrix3d/.test(cv.style.transform), sw: !!document.getElementById('hcamb') }; });
      for (let i = 0; i < 20; i++) { const q = await feed(); if (q.on && q.lit > 50) break; await P.waitForTimeout(250); }
      const f1 = await feed();
      ok('F1 his place opens on the 11/3 footage (CAM ' + f1.cam + ', ' + f1.sh + ', ' + f1.lit + ' lit samples of the picture): no skewed board, no switch to press, nothing of his left off it', f1.on && f1.cam === 1 && f1.lit > 50 && !f1.lens && !f1.sw && !f1.unplaced.length && f1.sh === (prof === 'phone_portrait' ? 'tall' : 'wide'), JSON.stringify(f1));
      const rowsOk = sl => Object.keys(sl).every(n => !sl[n].pid || MAN.pieces[sl[n].pid].row === rowOfLot[n]);
      ok('F1 every thing of his stands on a lot of its own row (low in front, tall at the back: ' + Object.keys(f1.slots).map(n => n + ':' + (f1.slots[n].pid || f1.slots[n].kind)).join(', ') + ')', Object.keys(f1.slots).length >= 5 && rowsOk(f1.slots), JSON.stringify(f1.slots));
      ok('F1 planted: a lookout put on a front lot reads red (the leg above)', !rowsOk(Object.assign({}, f1.slots, { 1: { pid: 'lookout' } })));
      const cam2 = await fr.evaluate(async () => { const c0 = window.__HOME_FEED.cam; window.__HOME_FEED_AGE(21000); await new Promise(r => setTimeout(r, 1200)); const c1 = window.__HOME_FEED.cam; window.__HOME_FEED_AGE(21000); await new Promise(r => setTimeout(r, 1200)); const c2 = window.__HOME_FEED.cam; return [c0, c1, c2]; });
      ok('F2 the cameras cut on their own every 20 seconds, he never picks one (CAM ' + cam2.join(' -> ') + ')', cam2[0] === 1 && cam2[1] === 2 && cam2[2] === 3, JSON.stringify(cam2));
      await fr.evaluate(() => { window.__HOME_THING = null; });
      for (let t = 0; t < 3; t++) { const w = await fr.evaluate(() => { const x = BohemiaSettlement.where('h11'); return x ? [x.x, x.y] : null; }); if (!w) break; await P.touchscreen.tap(fb.x + w[0], fb.y + w[1]); let up = false; for (let i = 0; i < 12 && !up; i++) { await P.waitForTimeout(250); up = await fr.evaluate(() => !!window.__HOME_THING); } if (up) break; }
      const t16 = await fr.evaluate(async () => { const th = window.__HOME_THING && window.__HOME_THING.name, c0 = window.__HOME_FEED.cam; window.__HOME_FEED_AGE(21000); await new Promise(r => setTimeout(r, 1200)); return { th, c0, c1: window.__HOME_FEED.cam, open: BohemiaSettlement.state.open }; });
      ok('F2 a real tap on the pot where CAM 3 shows it says what it is (' + t16.th + '), and the camera holds while its sheet is open (CAM ' + t16.c0 + ' -> ' + t16.c1 + ')', /POT/.test(t16.th || '') && t16.c0 === t16.c1 && !!t16.open, JSON.stringify(t16));
      await close15();
      const camBack = await fr.evaluate(async () => { window.__HOME_FEED_AGE(21000); await new Promise(r => setTimeout(r, 1200)); return window.__HOME_FEED.cam; });
      ok('F2 the sheet put away, the cycle goes on (CAM ' + camBack + ')', camBack === 1, String(camBack));
      const doors16 = []; for (const n of Object.keys(f1.slots)) { const sl = f1.slots[n], at = await fr.evaluate(n => window.__HOME_FEED_AT(+n), n); if (!at) { doors16.push([n, 'unseen']); continue; }
        await P.touchscreen.tap(fb.x + at.x, fb.y + at.y); let got = null; for (let i = 0; i < 12 && !got; i++) { await P.waitForTimeout(250); got = await fr.evaluate(() => BohemiaSettlement.state.open).catch(() => null); }
        doors16.push([n, sl.door || sl.key, got, Math.min(at.w, at.h)]); await close15(); }
      ok('F3 every thing of his is a door where the footage shows it, a thumb wide (' + doors16.map(d => d[0] + ':' + d[2] + '@' + d[3]).join(', ') + ')', doors16.length >= 5 && doors16.every(d => d[2] === d[1] && d[3] >= 44), JSON.stringify(doors16));
      await fr.evaluate(() => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home)); h.planted = false; window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); }); await P.waitForTimeout(900);
      const m16 = await feed();
      ok('F1 planted: a place that is not his planted place has no footage (the legs above read red on it)', !m16.on, JSON.stringify({ on: m16.on }));
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
      const seen17 = await (async () => { for (let i = 0; i < 12; i++) { const f = await feed(); const S2 = Object.keys(f.slots).filter(n => f.slots[n].kind === 'place'); if (S2.length >= 3) return S2.map(n => [f.slots[n].id, +n, MAN.pieces[f.slots[n].pid].row === rowOfLot[n]]); await P.waitForTimeout(250); } return []; })();
      ok('D17 the footage shows them standing on lots of their rows (' + seen17.map(x => x[0] + ' on ' + x[1]).join(', ') + ')', seen17.length === 3 && seen17.every(x => x[2]), JSON.stringify(seen17));
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
      await close15();
      /* D22 THE GRINDER (HOME BASE 3, 11/22, rule 469: his 'C' and 'Ppl dont eat the brain tho'): a real tap on the desk puts it up; the next day
         it stands, a door, its own piece in the footage on its row; a fight he wins brings its people home, as many as his men carry (the map's
         own hook, the fight's own outcome); a real tap on it, then GRIND: the food goes up by what the dead make; NOBODY TO GRIND after; a fight
         lost brings nobody (planted). At a stall, a sale of it where they find out moves that town's bar by the ladder's act and the strip says so. */
      await F.evaluate(() => { const w = wagonGet() || {}; w.tape = 30; wagonPut(w); window.__HOME_PLACE_BUILT = null; });
      await tap15('build', () => { if (/^h\d+$/.test(BohemiaSettlement.state.open || '')) { const m = document.querySelector('#sbody .act[data-home="more"]'); if (m) m.click(); } return !!document.querySelector('#sbody .act[data-place="grinder"]'); });
      const gr22 = await fr.evaluate(() => { const b = document.querySelector('#sbody .act[data-place="grinder"]'); return b ? b.textContent : null; });
      await tapQ17('#sbody .act[data-place="grinder"]', () => !!window.parent.__HOME_PLACE_BUILT && window.parent.__HOME_PLACE_BUILT.id === 'grinder');
      const y22 = await F.evaluate(() => ({ built: window.__HOME_PLACE_BUILT, tape: (wagonGet() || {}).tape }));
      ok('D22 THE GRINDER: the desk offers it ("' + gr22 + '"); a real tap puts it up for a battery and 3 tape (30 -> ' + y22.tape + ')', !!y22.built && y22.built.id === 'grinder' && y22.tape === 27 && /GRINDER/.test(gr22 || ''), JSON.stringify({ y22, gr22 }));
      await F.evaluate(() => { DAY.day = (DAY.day | 0) + 1; const bs = ctBases(), n = BohemiaBetween.mine(); loopOpenTown({ name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }); });
      await P.waitForTimeout(2500); await gone15(); await close15();
      const gk22 = await fr.evaluate(() => { const p = ((window.__HOME_DESK.home || {}).places || []).filter(p => p.id === 'grinder')[0]; return p && p.done ? 'h' + p.lot : null; });
      const gs22 = await (async () => { for (let i = 0; i < 12; i++) { const f = await feed(); const n = Object.keys(f.slots).filter(n => f.slots[n].kind === 'place' && f.slots[n].id === 'grinder')[0]; if (n) return [+n, f.slots[n].pid, !!MAN.pieces[f.slots[n].pid] && MAN.pieces[f.slots[n].pid].row === rowOfLot[n]]; await P.waitForTimeout(250); } return null; })();
      ok('D22 the next day it stands, a door (' + gk22 + '), and the footage shows its own piece (' + (gs22 && gs22[1]) + ') on lot ' + (gs22 && gs22[0]) + ' of its row', !!gk22 && await fr.evaluate(k => (window.__HOME_DOORS || []).indexOf(k) >= 0, gk22) && !!gs22 && gs22[1] === 'grinder' && gs22[2], JSON.stringify(gs22));
      const fh22 = await F.evaluate(() => { const lost = BohemiaHomeMap.grinderFight({ outcome: { victory: false, bodies: [{ beast: false }] } });
        const won = BohemiaHomeMap.grinderFight({ outcome: { victory: true, bodies: [{ beast: false }, { beast: false }, { beast: false }, { beast: false }, { beast: false }, { beast: true, kind: 'coyote' }] } });
        return { lost: lost, won: won, now: BohemiaHomeMap.grinder(), crew: crewCount() }; });
      ok('D22 a fight he wins brings its people home, as many as his ' + fh22.crew + ' men carry (' + (fh22.won && fh22.won.took) + ' of 5; the coyote is the kill\'s); planted: a fight lost brings nobody (' + fh22.lost + ')', !!fh22.won && fh22.won.took >= 1 && fh22.won.took + fh22.won.left === 5 && fh22.lost === null && fh22.now.dead === fh22.won.took, JSON.stringify(fh22));
      await tap15(gk22, () => !!document.querySelector('#sbody .act[data-grind]'));
      const gb22 = await fr.evaluate(() => { const b = document.querySelector('#sbody .act[data-grind]'); return b ? { t: b.textContent, off: b.disabled, say: (document.querySelector('#sbody .say p') || {}).textContent || '' } : null; }) || {};
      const w22 = await F.evaluate(() => (wagonGet() || {}).food | 0);
      await tapQ17('#sbody .act[data-grind]', () => !!window.__HOME_GRIND);
      const w22b = await F.evaluate(() => ({ food: (wagonGet() || {}).food | 0, now: BohemiaHomeMap.grinder(), ground: window.__HOME_GROUND || {} }));
      const ga22 = await fr.evaluate(() => { const b = document.querySelector('#sbody .act[data-grind]'); return { t: b ? b.textContent : null, off: b ? b.disabled : null, say: (document.querySelector('#sbody .say p') || {}).textContent || '' }; });
      ok('D22 at the grinder one line ("' + gb22.say + '") and one button ("' + gb22.t + '"); a real tap grinds: food ' + w22 + ' -> ' + w22b.food + ', then "' + ga22.t + '", "' + ga22.say + '"',
        /head/i.test(gb22.say || '') && !gb22.off && /GRIND/.test(gb22.t || '') && w22b.ground.food > 0 && w22b.food - w22 === w22b.ground.food && w22b.now.dead === 0 && ga22.off && /NOBODY/.test(ga22.t || '') && /\+\d+ food/.test(ga22.say), JSON.stringify({ gb22, w22, w22b, ga22 }));
      await close15();
      /* F4 HIS MEN AT HIS BUILDINGS, ON THE FOOTAGE (rule 458(c)): each once in his place, standing on his building's lot */
      await close15();
      const m19 = await fr.evaluate(() => { const W = window.__HOME_WORKERS || [], here = BohemiaSettlement.crewHere().map(p => p.name), F = window.__HOME_FEED_PEOPLE(); return { W, twice: W.filter(w => here.filter(n => n === w.name).length !== 1).map(w => w.name), on: F.filter(p => p.works).map(p => p.name + '@' + p.works) }; });
      ok('F4 his men stand at his own buildings on the footage (' + m19.on.join(', ') + '), each once in his place', m19.W.length >= 2 && m19.W.some(w => w.at === 'yard') && m19.W.some(w => w.at === 'forge') && !m19.twice.length && m19.on.some(x => /@yard$/.test(x)) && m19.on.some(x => /@forge$/.test(x)), JSON.stringify(m19));
      /* F5 WHERE HE BUILDS: a real tap on an empty lot of the footage opens BUILD (no chalk, no plate: the lot is the camera's own ground) */
      const e20 = await fr.evaluate(() => { const f = window.__HOME_FEED; const n = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(x => !f.slots[x])[0]; return n ? { n, at: window.__HOME_FEED_AT(n) } : null; });
      if (e20 && e20.at) { await P.touchscreen.tap(fb.x + e20.at.x, fb.y + e20.at.y); await P.waitForTimeout(1300); }
      const t20 = await fr.evaluate(() => ({ open: BohemiaSettlement.state.open, desk: !!document.querySelector('#sbody .hdesk'), swallowed: window.__HOME_FEED_SWALLOWED | 0 }));
      ok('F5 a real tap on empty lot ' + (e20 && e20.n) + ' of the footage (' + (e20 && e20.at && e20.at.w) + ' px wide) opens BUILD, the desk, and its click presses nothing under the thumb', !!e20 && e20.at.w >= 44 && t20.open === 'build' && t20.desk, JSON.stringify({ e20, t20 }));
      /* F6 THE BLOCK HOLDS FOUR IN A ROW (rule 354(i)): with the back row full the desk offers the roof and the lookout greyed, and says so */
      await close15();
      const f6 = await fr.evaluate(async () => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home)); h.places = (h.places || []).concat([{ id: 'lookout', name: 'LOOKOUT', piece: 'x', lot: 24, done: true }, { id: 'lookout', name: 'LOOKOUT', piece: 'x', lot: 25, done: true }, { id: 'lookout', name: 'LOOKOUT', piece: 'x', lot: 26, done: true }]);   /* HOME BASE 3 11/22: lot numbers nothing holds (rule 479: one key is one thing, drawn once) */
        window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); await new Promise(r => setTimeout(r, 600)); BohemiaSettlement.state.open = null; return true; });
      await fr.evaluate(() => { const c = document.getElementById('close'); if (c && BohemiaSettlement.state.open) c.click(); });
      await fr.evaluate(() => { try { window.__HOME_FEED_AGE(0); } catch (e) {} });
      const g6 = await fr.evaluate(async () => { const f = window.__HOME_FEED, n = [1, 2, 3, 4, 5, 6, 7, 8].filter(x => !f.slots[x])[0], at = n ? window.__HOME_FEED_AT(n) : null; return { n, at, back: [9, 10, 11, 12].map(x => f.slots[x] ? (f.slots[x].pid || f.slots[x].kind) : null) }; });
      if (g6.at) { await P.touchscreen.tap(fb.x + g6.at.x, fb.y + g6.at.y); await P.waitForTimeout(1300); }
      const r6 = await fr.evaluate(() => [...document.querySelectorAll('#sbody .act[data-build="roof"], #sbody .act[data-place="lookout"], #sbody .act[data-build="wall"]')].map(b => (b.dataset.build || b.dataset.place) + ':' + (b.disabled ? 'off' : 'on') + ':' + (b.dataset.rowfull || '') + ':' + ((b.querySelector('em') || {}).textContent || '')));
      ok('F6 the back row full (' + g6.back.join(', ') + '): the roof is offered greyed, THE BACK ROW IS FULL (the lookout greyed, one of each or the row); the wall (the front row, two of four taken) is not (HOME BASE 3 11/22: was the garden, but the D22 grinder now fills the middle row by this leg)', r6.some(x => /^roof:off:back:THE BACK ROW IS FULL/.test(x)) && r6.some(x => /^lookout:off:/.test(x)) && r6.some(x => /^wall:(on|off)::/.test(x)), JSON.stringify({ g6, r6 }));
      await close15();
      /* F7 THE OVERFLOW (HOME BASE 3 11/22, rule 466(a) step 4): a piece whose row is full stands on a free lot of a row behind it, with its
         own picture for that lot (the pipeline's --behind-only renders); planted: the pictures behind taken off, it is not drawn at all */
      const post7 = async (cut) => fr.evaluate(async (cut) => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home));
        window.__HOME_FEED_NO_BEHIND(!!cut);
        h.things = []; h.places = ['forge', 'grinder', 'forge', 'grinder', 'forge', 'grinder', 'forge', 'grinder', 'forge'].map((id, i) => ({ id, name: id.toUpperCase(), piece: null, lot: 30 + i, done: true }));
        window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); await new Promise(r => setTimeout(r, 800));
        const f = window.__HOME_FEED || {}, sl = f.slots || {}, out = { mid: [5, 6, 7, 8].map(n => sl[n] ? sl[n].pid : null), back: [9, 10, 11, 12].map(n => sl[n] ? sl[n].pid : null), over: f.over || [], un: (f.unplaced || []).length };
        window.__HOME_FEED_NO_BEHIND(false);
        return out; }, cut);
      const f7 = await post7(false), f7c = await post7(true);
      const backOk = f7.back.filter(p => p === 'forge' || p === 'grinder').length;
      ok('F7 THE OVERFLOW: nine more of his middle-row buildings, the middle row holds four (' + f7.mid.join(', ') + '), the rest stand on the back row with their own pictures (' + f7.back.join(', ') + '; over ' + f7.over.join(' ') + '), ' + f7.un + ' not drawn',
        f7.mid.every(Boolean) && f7.over.length >= 1 && backOk === f7.over.length && f7.over.every(o => /@(9|10|11|12)$/.test(o)), JSON.stringify(f7));
      ok('F7 planted: the pictures behind taken off the manifest, the overflow is not drawn (' + f7c.over.length + ' over, ' + f7c.un + ' left off): the leg above reads red on it', f7c.over.length === 0 && f7c.un >= f7.un + f7.over.length, JSON.stringify(f7c));
      await fr.evaluate(async () => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home)); window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); });   /* the real home again */
      await P.waitForTimeout(800);
      /* F8 ONCE AND IN THE GROUND (HOME BASE 3 11/22, rule 479(b)(c)): in every camera each thing of his is drawn once and each person once,
         each person standing on his own shadow; the same thing handed twice is drawn once (planted: the count on what was sent reads two) */
      const cams8 = []; for (let c = 0; c < 3; c++) { await P.waitForTimeout(700); cams8.push(await fr.evaluate(() => { const f = window.__HOME_FEED || {}, d = window.__HOME_FEED_DRAWN ? window.__HOME_FEED_DRAWN() : null; return { cam: f.cam, slots: Object.keys(f.slots || {}).length, d }; })); await fr.evaluate(() => { try { window.__HOME_FEED_AGE(99999); } catch (e) {} }); }
      const once8 = c => !!c.d && Object.keys(c.d.pieces).length === c.slots && Object.values(c.d.pieces).every(n => n === 1) && Object.values(c.d.people).every(n => n === 1) && c.d.feet.every(q => q.shadow);
      ok('F8 ONCE AND IN THE GROUND: in CAM ' + cams8.map(c => c.cam).join(', ') + ' each thing of his drawn once (' + cams8.map(c => c.d ? Object.keys(c.d.pieces).length : '?').join('/') + ') and each person once on his own shadow (' + cams8.map(c => c.d ? Object.keys(c.d.people).length : '?').join('/') + ')', cams8.length === 3 && new Set(cams8.map(c => c.cam)).size === 3 && cams8.every(once8), JSON.stringify(cams8));
      const dup8 = await fr.evaluate(async () => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home)); const p = (h.places || [])[0]; if (p) h.places.push(JSON.parse(JSON.stringify(p))); const sent = (h.places || []).length, sentKeys = (h.places || []).map(x => 'h' + x.lot); window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); await new Promise(r => setTimeout(r, 900)); const f = window.__HOME_FEED || {}; return { sent, sentKeys, slots: Object.keys(f.slots || {}).length, keys: Object.values(f.slots || {}).map(x => x.key) }; });
      ok('F8 the same building handed twice is drawn once (' + dup8.keys.join(',') + '; ' + dup8.sent + ' sent); planted: counted on what was sent, the same check reads red', new Set(dup8.keys).size === dup8.keys.length && dup8.sent > new Set(dup8.sentKeys).size, JSON.stringify(dup8));
      await fr.evaluate(async () => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home)); window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); });
      await P.waitForTimeout(800);
      await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); }); await P.waitForTimeout(2500); await gone15(); await close15();
      await F.evaluate(() => { const r = BohemiaHomeMap.rec(); r.places = []; localStorage.removeItem('bohemia.home.trained.v1'); DAY.day = (DAY.day | 0) - 2; const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); });
      await P.waitForTimeout(2500); await gone15(); await close15();   /* the gate's three come down so the legs after build where they always did */
      /* D18 WHAT HE DID IS REMEMBERED, AND THE CORK BOARD IS DEAD (rule 466(b), his NO 11/21 on home-base-his-impact-11-17: 'This looks
         like shit get this AI slop out of my fucking face'): the jobs and the held gate stay deeds in his place's memory; no board
         goes up, nothing of it is drawn or a door; a board a save put up before the kill comes down when the place loads */
      const d18 = await F.evaluate(() => { BohemiaJobKinds.settleJob({ id: 'gate-18a', from: 'HENDERSON', title: 'Bring back the medic', plays: 'find-person' }, 'civilian_contract_done');
        BohemiaJobKinds.settleJob({ id: 'gate-18b', from: 'JEAN', title: 'Haul the salt', plays: 'haul-caravan' }, 'civilian_contract_done');
        BohemiaJobKinds.settleJob({ id: 'gate-18c', from: 'JEAN', title: 'Lost job', plays: 'carry' }, 'fail_civilian_contract');
        const s = BohemiaHomeMap.state(); return { deeds: (s.deeds || []).map(x => x.name), board: (s.places || []).filter(p => p.id === 'board').length, ensure: typeof BohemiaHomeMap.ensureBoard }; });
      ok('D18 three jobs end through the jobs\' own settle: the two done are remembered at his place (' + d18.deeds.join(', ') + '), the lost one not; no cork board goes up (rule 466(b))',
        d18.deeds.length === 2 && d18.deeds.indexOf('Lost job') < 0 && d18.board === 0 && d18.ensure === 'undefined', JSON.stringify(d18));
      const h18 = await F.evaluate(() => { const H = BohemiaHomeBases, rec = hbRec(), mine = BohemiaBetween.mine(), other = Object.keys(ctBases()).find(n => n !== mine);
        const o1 = H.openRaid(rec, { base: mine, by: 'Colorful', day: DAY.day }), c1 = H.closeRaid(rec, { base: mine, outcome: 'held', day: DAY.day, how: 'fought' });
        const o2 = other ? H.openRaid(rec, { base: other, by: 'Colorful', day: DAY.day }) : null; if (o2 && o2.applied) H.closeRaid(rec, { base: other, outcome: 'held', day: DAY.day, how: 'fought' });
        window.__HOME_RAIDS_HELD(); window.__HOME_RAIDS_HELD();
        const s = BohemiaHomeMap.state(); return { opened: !!(o1 && o1.applied), other: !!(o2 && o2.applied), board: (s.places || []).filter(p => p.id === 'board').length, deeds: (s.deeds || []).map(x => x.name + (x.held ? '*' : '') + '@' + x.from) }; });
      ok('D18 a raid he held at his gate is remembered once, marked held; one held at another place is not; still no board (' + h18.deeds.join(', ') + ')', h18.opened && h18.deeds.filter(x => /^Held the gate\*@Colorful/.test(x)).length === 1 && h18.board === 0, JSON.stringify(h18));
      await close15(); await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; loopOpenTown(t); }); await P.waitForTimeout(2500); await gone15(); await close15();
      const s18 = await fr.evaluate(() => ({ doors: window.__HOME_DOORS || [], kinds: (window.__HOME_DESK && window.__HOME_DESK.home && window.__HOME_DESK.home.places || []).map(p => p.id) }));
      ok('D18 his place shows no board: none in what the map hands the screen (' + s18.kinds.join(',') + '), no door of it (' + s18.doors.join(',') + ')', s18.kinds.indexOf('board') < 0, JSON.stringify(s18));
      const o18 = await F.evaluate(() => { const r = BohemiaHomeMap.rec(), lot = 11; r.places = (r.places || []).concat([{ id: 'board', name: 'CORK BOARD', piece: 'f_agent', lot: lot, day: 1, done: true }]); homeSave();
        const saved = ((JSON.parse(localStorage.getItem(HOME.key) || '{}').places) || []).filter(p => p.id === 'board').length; HOME.rec = null;
        const after = (homeRec().places || []).filter(p => p.id === 'board').length; homeSave(); return { saved, after }; });
      ok('D18 planted: a board in a save from before the kill (' + o18.saved + ' in the save) comes down when the place loads (' + o18.after + ' after); with the take-down off it would stand', o18.saved === 1 && o18.after === 0, JSON.stringify(o18));
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
        return { t, plan: window.__HOME_PLAN || null, canvas: !!c, press, open: BohemiaSettlement.state.open, lens: window.__HOME_LENS || null, feed: !!(window.__HOME_FEED && window.__HOME_FEED.on) }; });
      ok('D8 the desk: A NIGHT, LIVING HERE, NAME IT', dk.open === 'build' && /A NIGHT/.test(dk.t) && /LIVING HERE/.test(dk.t) && /NAME IT/.test(dk.t), dk.t.slice(0, 200).replace(/\n/g, ' '));
      /* rule 458(c): no top-down plan on the desk; his lots on their own ground in the feed, the camera on THE LOTS, all of them in its glass */
      const plan8 = (d) => !d.canvas && d.feed === true;   /* rule 466(a): no top-down plan; the footage stays behind the desk */
      ok('D8 no top-down plan on the desk: the footage stays behind it (' + dk.feed + ')', plan8(dk), JSON.stringify({ feed: dk.feed, canvas: dk.canvas }));
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
      /* D10 a build from the desk goes up and stands on a lot of its row in the footage; CLEAR on its own sheet takes it down */
      const before10 = await F.evaluate(() => Object.keys(LOT_BOOK[BohemiaBetween.mine()].lots));
      await fr.evaluate(() => { const b = [...document.querySelectorAll('#sbody .act')].find(x => /GARDEN BED/.test(x.textContent)); if (b) b.click(); }); await P.waitForTimeout(1000);
      const lots10 = await F.evaluate(() => Object.keys(LOT_BOOK[BohemiaBetween.mine()].lots)), new10 = lots10.filter(k => before10.indexOf(k) < 0)[0];
      await close15(); await fr.evaluate(() => { try { window.__HOME_FEED_AGE(0); } catch (e) {} }); await P.waitForTimeout(500);
      const s10 = await fr.evaluate(k => { const f = window.__HOME_FEED; for (const n in f.slots) if (f.slots[n].key === k) return { n: +n, pid: f.slots[n].pid, at: window.__HOME_FEED_AT(+n) }; return null; }, new10 ? 'h' + parseInt(new10, 10) : null);
      ok('D10 the garden from the desk goes up (lot ' + new10 + ') and stands in the footage on lot ' + (s10 && s10.n) + ' of its row (' + (s10 && rowOfLot[s10.n]) + ')', !!new10 && !!s10 && s10.pid === 'garden_bed' && rowOfLot[s10.n] === 'middle' && !!s10.at && s10.at.w >= 44, JSON.stringify({ new10, s10 }));
      if (s10 && s10.at) { await P.touchscreen.tap(fb.x + s10.at.x, fb.y + s10.at.y); await P.waitForTimeout(1300); }
      const clr = await fr.evaluate(() => { const b = document.querySelector('#sbody .act[data-home="clear"]'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.height]; });
      const half = await fr.evaluate(() => { const b = document.getElementById('sbody'); const t = Math.min.apply(null, [].slice.call(b.querySelectorAll('*')).filter(x => x.offsetWidth).map(x => x.getBoundingClientRect().top)); return { top: t, h: innerHeight }; });
      ok('D10 a real tap on it: its sheet has CLEAR, 44 px, on the glass', !!clr && clr[2] >= 44 && clr[1] + clr[2] / 2 <= half.h + 0.5, JSON.stringify({ clr, half }));
      if (clr) { await P.waitForTimeout(500); await P.touchscreen.tap(fb.x + clr[0], fb.y + clr[1]); await P.waitForTimeout(900); }
      const lots10b = await F.evaluate(() => Object.keys(LOT_BOOK[BohemiaBetween.mine()].lots));
      ok('D10 CLEAR took it down (' + (lots10b.join(' ') || 'nothing') + ')', !!new10 && lots10b.indexOf(new10) < 0, JSON.stringify(lots10b));
      { const e10 = await fr.evaluate(() => { const f = window.__HOME_FEED, n = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(x => !f.slots[x])[0]; return n ? window.__HOME_FEED_AT(n) : null; });
        if (e10) { await P.touchscreen.tap(fb.x + e10.x, fb.y + e10.y); await P.waitForTimeout(1300); } }   /* the desk again, by an empty lot, for the rows below */
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
      const folk = await fr.evaluate(() => window.__HOME_FEED_PEOPLE ? window.__HOME_FEED_PEOPLE().filter(p => p.resident) : []);   /* rule 466(a): where the footage shows them */
      ok('D9 the people who moved in stand in his place (' + folk.map(f => f.name).join(', ') + ')', folk.some(f => f.name === 'GATE RUIZ'), JSON.stringify(folk));
      const bw = await fr.evaluate(() => { const w = BohemiaSettlement.where('build'); return w ? [w.x, w.y] : null; });
      ok('D9 the BUILD door is under none of them (the nearest ' + (bw && folk.length ? Math.round(Math.min.apply(null, folk.map(f => Math.hypot(f.x - bw[0], f.y - bw[1])))) : '-') + ' px away)', !!bw && folk.every(f => Math.hypot(f.x - bw[0], f.y - bw[1]) > 30));
      const gr = folk.filter(f => f.name === 'GATE RUIZ')[0];
      if (gr) { await P.touchscreen.tap(fb.x + gr.x, fb.y + gr.y); await P.waitForTimeout(1300); }
      const talk = await fr.evaluate(() => ({ t: window.__HOME_TALK || null, txt: (document.getElementById('sbody') || {}).innerText || '' }));
      ok('D9 a tap on him: his face, LIVES HERE, a line of the place\'s story ("' + (talk.t && talk.t.line) + '")', !!talk.t && talk.t.name === 'GATE RUIZ' && /LIVES HERE/.test(talk.txt) && /day \d+/.test(talk.t.line), JSON.stringify(talk).slice(0, 300));
      const planted9 = await fr.evaluate(() => { const h = JSON.parse(JSON.stringify(window.__HOME_DESK.home)); h.residents = []; window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'); return true; });
      await P.waitForTimeout(1200);
      const folkGone = await fr.evaluate(() => window.__HOME_FEED_PEOPLE ? window.__HOME_FEED_PEOPLE().filter(p => p.resident) : []);
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
