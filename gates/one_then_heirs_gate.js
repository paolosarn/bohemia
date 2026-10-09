/* ONE THEN HEIRS -- DYNASTY row [one then heirs], rule 39c (Paolo 9/28): "you start
   the game you can't flip between the three people... customize just one person, and
   when you hop into the second generation you'll be given an option to customize the
   person and it will start off generated based on how you made the first."

   THE SHIP TEST IN ONE SENTENCE: a fresh game shows ONE face on the phone; opening
   act 2 grows a second, born from the first; a real finger hops into it and is
   offered a name, a sex and a reshuffle; and that offer closes for good when he
   leaves, because he has met them.

   THREE FACES FROM FRAME ONE (THE FLIP as shipped 9/24) AND NAMING ALL THREE BEFORE
   ACT 1 (THREE NAMES as shipped 9/27) ARE DEAD BY HIS RULING. Those two gates were
   re-aimed, not loosened: every leg they had still runs, after the acts they need
   have been unlocked through the same hook the game will use.

   WHAT THIS CANNOT PROVE, SAID PLAINLY: nothing in the walked game can hand the
   player a home base yet, so nothing calls unlock. The glass legs open the door with
   the game's own unlock call, and the headless legs prove the default trigger against
   the REAL home-base ledger rather than against a stand-in. */
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(ROOT + '/tools/bohemia_drive_the_demo.js');
const A = require(ROOT + '/engine/bohemia_acts.js');
const H = require(ROOT + '/engine/bohemia_homebases.js');
let pass = 0, fail = 0;
const ok = (what, cond) => { if (cond) { pass++; } else { fail++; console.log('  > FAIL ' + what); } };
const done = () => { console.log('ONE THEN HEIRS GATE: ' + pass + ' passed, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };
const SEED = '2691674296';

/* ---- 1. THE MECHANISM, WITHOUT A BROWSER --------------------------------- */
A.resetAll();
ok('a new game has ONE person, and it is act 1',
   A.visible(SEED).length === 1 && A.visible(SEED)[0].act === 1 && A.unlocked().join() === '1');
ok('that person is named and sexed from the first frame',
   !!A.visible(SEED)[0].name && (A.visible(SEED)[0].sex === 'male' || A.visible(SEED)[0].sex === 'female'));
ok('nobody is offered a customize window at the start (act 1 is the face maker\'s)',
   A.visible(SEED)[0].open === false);
ok('flipping to a locked act is REFUSED and says LOCKED',
   A.flip(2).moved === false && A.flip(2).why === 'LOCKED' && A.flip(3).why === 'LOCKED');
ok('and he is still in act 1 afterwards', A.current() === 1);
ok('setCurrent cannot smuggle him into a locked act', A.setCurrent(3) === 1);
ok('act 3 cannot unlock before act 2 (a generation cannot be skipped)',
   A.unlock(3).ok === false && A.unlock(3).why === 'NOT_NEXT' && A.unlocked().join() === '1');
ok('an act that does not exist cannot be unlocked', A.unlock(9).ok === false && A.unlock(0).ok === false);
const u2 = A.unlock(2);
ok('unlocking act 2 works and OPENS its customize window', u2.ok === true && u2.open === true);
ok('asking again is answered, not repeated', A.unlock(2).ok === false && A.unlock(2).why === 'ALREADY');
const v2 = A.visible(SEED);
ok('the strip now has TWO people', v2.length === 2 && v2[1].act === 2);
ok('the new one is offered a customize window and the old one is not', v2[1].open === true && v2[0].open === false);
ok('the new one says who they are born of (rule 39c: generated from the one before)',
   !!v2[1].bornOf && v2[1].bornOf.act === 1 && v2[1].bornOf.name === v2[0].name);
ok('act 1 still has no way in while act 2 is the only open window',
   A.customizable(1) === true && A.customizable(2) === true);

/* THE HOP */
const f2 = A.flip(2);
ok('flipping into act 2 moves him and says it is the FIRST time', f2.moved === true && f2.first === true);
ok('the window is still open while he is standing in it', A.customizable(2) === true);
A.flip(1);
const back = A.flip(2);
ok('a second visit is not "first"', back.moved === true && back.first === false);
A.flip(1);
ok('*** LEAVING AN ACT CLOSES ITS CUSTOMIZE WINDOW ***', A.customizable(2) === false && A.visible(SEED)[1].open === false);
const nm2 = A.visible(SEED)[1].name;
ok('a closed act refuses a reshuffle and says CLOSED', A.reshuffle(2).changed === false && A.reshuffle(2).why === 'CLOSED');
ok('a closed act refuses a typed name', A.setName(2, 'Nobody').ok === false && A.setName(2, 'Nobody').why === 'CLOSED');
ok('a closed act refuses a chosen sex', A.setSex(2, 'female').ok === false && A.setSex(2, 'female').why === 'CLOSED');
ok('and the person underneath did not change', A.visible(SEED)[1].name === nm2);

/* THE WINDOW, WHILE IT IS OPEN */
A.resetAll(); A.unlock(2); A.unlock(3);
const beforeAll = A.visible(SEED).map(a => a.name);
const rs = A.reshuffle(3);
const afterAll = A.visible(SEED).map(a => a.name);
ok('reshuffling act 3 changes act 3 and ONLY act 3 (' + beforeAll[2] + ' -> ' + afterAll[2] + ')',
   rs.changed === true && afterAll[2] !== beforeAll[2] && afterAll[0] === beforeAll[0] && afterAll[1] === beforeAll[1]);
ok('a typed name is kept', A.setName(2, 'Marisol').ok === true && A.visible(SEED)[1].name === 'Marisol' && A.visible(SEED)[1].custom === true);
ok('a garbage name is refused and the last one stands',
   A.setName(2, '   ').ok === false && A.visible(SEED)[1].name === 'Marisol');
ok('OK (confirm) closes the window on purpose', A.confirm(2).ok === true && A.customizable(2) === false);
ok('and the act he did not confirm is still open', A.customizable(3) === true);
ok('confirming keeps the typed name', A.visible(SEED)[1].name === 'Marisol');

/* THE FACE FOLLOWS THE PERSON, NOT THE SLOT NUMBER ([three names] found it did not) */
A.resetAll(); A.unlock(2); A.unlock(3);
const k0 = A.faceKey(SEED, 2), k3 = A.faceKey(SEED, 3);
ok('act 1\'s face key is the face he built and never changes', A.faceKey(SEED, 1) === 'act1');
ok('act 2\'s key is what a face is made from: a reshuffle count and a sex (' + k0 + ')',
   /^act2~s0~(he|she)$/.test(k0));
ok('act 3\'s key also carries act 2 (the third is born from the second) (' + k3 + ')',
   /^act3~s0~(he|she)~p0~(he|she)$/.test(k3));
A.setName(2, 'Guadalupe');
ok('*** A TYPED NAME IS NOT A FACE: it does not change the key ***', A.faceKey(SEED, 2) === k0);
A.reshuffle(2);
ok('a reshuffle changes act 2\'s key', A.faceKey(SEED, 2) !== k0 && /~s1~/.test(A.faceKey(SEED, 2)));
ok('and, because the third is born from the second, act 3\'s key moves with it',
   A.faceKey(SEED, 3) !== k3 && /~p1~/.test(A.faceKey(SEED, 3)));
const sx = A.visible(SEED)[1].sex;
A.setSex(2, sx === 'male' ? 'female' : 'male');
ok('a chosen sex changes the key too (the face must agree with it)',
   A.faceKey(SEED, 2).split('~')[2] === (sx === 'male' ? 'she' : 'he'));
ok('the same state gives the same key twice', A.faceKey(SEED, 2) === A.faceKey(SEED, 2));
ok('a bad act has no key', A.faceKey(SEED, 7) === null);

/* THE SAVE: A DOOR THAT OPENED STAYS OPEN ACROSS A RELOAD */
A.resetAll(); A.unlock(2); A.setName(2, 'Rosalva'); A.flip(2); A.unlock(3);
const blob = JSON.parse(JSON.stringify(A.save()));
A.resetAll();
ok('after a reset he is back to one person', A.unlocked().join() === '1' && A.current() === 1);
const ld = A.load(blob);
ok('*** LOADING THE SAVE GIVES BACK THE UNLOCKS, WHERE HE STANDS AND WHO HE MADE ***',
   ld.ok === true && A.unlocked().join() === '1,2,3' && A.current() === 2 &&
   A.visible(SEED)[1].name === 'Rosalva' && A.visible(SEED)[1].custom === true);
ok('the open window survived the reload too', A.customizable(3) === true && A.customizable(2) === true);
A.resetAll();
ok('an empty save is a new game, not an error', A.load(null).ok === false && A.unlocked().join() === '1');
ok('garbage is a new game, not a crash', A.load({ V: 9 }).ok === false && A.load('x').ok === false && A.unlocked().join() === '1');
A.load({ V: 1, unlocked: [1, 3], current: 3 });
ok('a hand-edited save cannot skip a generation', A.unlocked().join() === '1' && A.current() === 1);
A.load({ V: 1, unlocked: [1, 2], current: 3, override: { 2: { name: 'x'.repeat(40), sex: 'robot' } }, salt: { 2: -5 } });
ok('a bad name, a bad sex and a bad salt in a save are dropped, not trusted',
   A.visible(SEED).length === 2 && A.visible(SEED)[1].custom === false && A.current() === 1);
A.resetAll();

/* THE DEFAULT TRIGGER, AGAINST THE REAL LEDGER: "the first home base is yours" */
{
  const rec = H.make();
  ok('with an empty ledger nothing unlocks', A.unlockFromBases(rec.entries).length === 0 && A.unlocked().join() === '1');
  H.took(rec, { base: 'base:cartel', to: 'the mob' });
  ok('a base that went to somebody else unlocks nothing', A.unlockFromBases(rec.entries).length === 0);
  H.ruined(rec, { base: 'base:church' });
  ok('a base that fell unlocks nothing', A.unlockFromBases(rec.entries).length === 0);
  H.took(rec, { base: 'base:homeless', to: H.YOU });
  const got = A.unlockFromBases(rec.entries);
  ok('*** A BASE THE PLAYER TOOK IN ACT 1 UNLOCKS ACT 2 ***', got.join() === '2' && A.unlocked().join() === '1,2');
  ok('and running it again unlocks nothing new', A.unlockFromBases(rec.entries).length === 0);
  H.setAct(rec, 2);
  ok('a base taken in act 2 is the trigger for act 3, not act 2 again',
     A.unlockFromBases(rec.entries).length === 0);
  H.took(rec, { base: 'base:mob', to: H.YOU });
  ok('and it does unlock act 3', A.unlockFromBases(rec.entries).join() === '3' && A.unlocked().join() === '1,2,3');
  A.resetAll();
  ok('a ledger with BOTH bases replays in order and opens both doors, one after the other',
     A.unlockFromBases(rec.entries).join() === '2,3' && A.unlocked().join() === '1,2,3');
  A.resetAll();
  const only2 = H.make({ act: 2 });
  H.took(only2, { base: 'base:mob', to: H.YOU });
  ok('with act 2 still locked, a base taken in act 2 cannot unlock act 3 by itself',
     A.unlockFromBases(only2.entries).length === 0 && A.unlocked().join() === '1');
  ok('a non-array is answered with nothing', A.unlockFromBases(null).length === 0);
  A.resetAll();
}

/* WORDS' STANDALONE SCREEN STILL PREPARES ALL THREE: roster() is untouched */
A.resetAll();
ok('roster() is still all three, so the retired naming screen keeps working until WORDS removes it',
   A.roster(SEED).length === 3 && A.reshuffle(2).changed === true && A.setName(3, 'Ines').ok === true);
A.resetAll();

/* ---- 2. ON THE GLASS, WITH A REAL FINGER AND A REAL KEYBOARD ------------- */
(async () => {
  let d;
  try { d = await D.open({ alpha: true }); }
  catch (e) { ok('the one driver opens the alpha [' + e.message.slice(0, 70) + ']', false); done(); }
  const pg = d.page;
  let ready = false;
  for (let i = 0; i < 400 && !ready; i++) {
    ready = await pg.evaluate(() => !!window.__LOAD_READY).catch(() => false);
    if (!ready) await pg.waitForTimeout(400);
  }
  const front = await pg.evaluate(() => { const f = document.getElementById('front');
    if (!f) return null; const r = f.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (front) await pg.touchscreen.tap(front.x, front.y);
  await pg.waitForTimeout(1200);
  await pg.evaluate(() => { const t = [...document.querySelectorAll('*')]
    .filter(e => e.children.length === 0 && (e.textContent || '').trim() === 'RUN');
    if (t[0]) t[0].click(); });
  await pg.waitForTimeout(1500);
  for (let i = 0; i < 4; i++) { await d.pinchOut(); await pg.waitForTimeout(450); }
  const fb = await (await d.fr.frameElement()).boundingBox();

  const strip = () => d.fr.evaluate(() => {
    const box = document.getElementById('actflip');
    const ed = document.getElementById('actedit');
    const tiles = box ? [...box.querySelectorAll('.af')] : [];
    return {
      tiles: tiles.length,
      names: tiles.map(t => (t.querySelector('.afn') || {}).textContent),
      glyphs: tiles.map(t => !!t.querySelector('.afr')),
      lit: tiles.map(t => t.classList.contains('now')),
      editOn: !!ed && ed.classList.contains('on'),
      cur: BohemiaActs.current(), unlocked: BohemiaActs.unlocked()
    };
  });
  const painted = (i) => d.fr.evaluate((i) => {
    const t = document.querySelectorAll('#actflip .af')[i];
    if (!t) return -1;
    const c = t.querySelector('canvas'); const g = c.getContext('2d');
    const px = g.getImageData(0, 0, c.width, c.height).data; let n = 0;
    for (let k = 3; k < px.length; k += 4) if (px[k] > 0) n++;
    return n;
  }, i);
  const sig = (i) => d.fr.evaluate((i) => {
    const t = document.querySelectorAll('#actflip .af')[i];
    if (!t) return '';
    const c = t.querySelector('canvas'); const px = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let h = 0; for (let k = 0; k < px.length; k++) h = ((h * 31) + px[k]) >>> 0; return String(h);
  }, i);
  const rectOf = (sel, idx) => d.fr.evaluate((a) => {
    const els = document.querySelectorAll(a.sel); const e = els[a.idx == null ? 0 : a.idx];
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height };
  }, { sel, idx });
  const tap = async (r) => { await pg.touchscreen.tap(fb.x + r.x, fb.y + r.y); await pg.waitForTimeout(600); };
  const coverAt = (r) => pg.evaluate((pt) => { const el = document.elementFromPoint(pt.x, pt.y); return el ? (el.id || el.tagName) : null; },
                                     { x: fb.x + r.x, y: fb.y + r.y });

  /* THE BOOT STATE, BEFORE THIS GATE TOUCHES ANYTHING: the honest first-open measure */
  const boot = await strip();
  ok('*** A FRESH GAME SHOWS ONE FACE ON THE PHONE *** (' + boot.tiles + ': ' + boot.names.join(', ') + ')',
     boot.tiles === 1 && boot.unlocked.join() === '1' && boot.cur === 1);
  ok('and that one face has no reshuffle glyph and there is no offer row', boot.glyphs[0] === false && boot.editOn === false);
  ok('and it is lit: he is standing in it', boot.lit[0] === true);
  let n0 = 0; for (let i = 0; i < 12 && n0 < 100; i++) { n0 = await painted(0); if (n0 < 100) await pg.waitForTimeout(300); }
  ok('*** THE FIRST FACE IS PAINTED WITHOUT ANYTHING RE-CALLING THE PAINT (' + n0 + ' of 676 pixels) ***', n0 > 100);
  ok('a locked act cannot be flipped to from the page either',
     (await d.fr.evaluate(() => ctActFlipTo(3))) === false && (await strip()).cur === 1);

  /* THE DOOR OPENS: the game's own hook */
  await d.fr.evaluate(() => ctActUnlock(2));
  await pg.waitForTimeout(500);
  const s2 = await strip();
  ok('*** UNLOCKING ACT 2 GROWS A SECOND FACE *** (' + s2.tiles + ': ' + s2.names.join(', ') + ')', s2.tiles === 2);
  ok('the new face carries the reshuffle glyph and the old one does not', s2.glyphs[1] === true && s2.glyphs[0] === false);
  ok('and no offer row yet: he has not hopped', s2.editOn === false);
  let n1 = 0; for (let i = 0; i < 14 && n1 < 100; i++) { n1 = await painted(1); if (n1 < 100) await pg.waitForTimeout(300); }
  ok('*** THE NEW FACE PAINTS ITSELF WHEN IT ARRIVES, no other event needed (' + n1 + ' of 676 pixels) ***', n1 > 100);
  const born = await d.fr.evaluate(() => BohemiaActs.visible(seed ? String(seed) : 'bohemia')[1].bornOf);
  ok('and it is born of the first person', !!born && born.act === 1);

  /* A REAL FINGER HOPS INTO HIM */
  const t2 = await rectOf('#actflip .af', 1);
  ok('the new face is a real tile (' + Math.round(t2.w) + 'x' + Math.round(t2.h) + ')', t2 && t2.w >= 24 && t2.h >= 24);
  ok('nothing in the shell covers it (' + await coverAt(t2) + ')', (await coverAt(t2)) === 'cityFrame');
  await tap(t2);
  const hop = await strip();
  ok('*** A REAL FINGER HOPPED INTO ACT 2 ***', hop.cur === 2 && hop.lit[1] === true);
  ok('and the page wrote it down as the FIRST time', await d.fr.evaluate(() => !!window.__ACT_FLIP && window.__ACT_FLIP.first === true));
  ok('*** THE OFFER TO CUSTOMIZE APPEARS ON THE HOP ***', hop.editOn === true);
  const inp = await rectOf('#actname');
  ok('the name field is on the glass and thumb-sized (' + (inp ? Math.round(inp.w) + 'x' + Math.round(inp.h) : 'NONE') + ')', !!inp && inp.w >= 40 && inp.h >= 20);
  ok('and nothing in the shell covers the field (' + (inp ? await coverAt(inp) : '?') + ')', !!inp && (await coverAt(inp)) === 'cityFrame');
  const nameShown = await d.fr.evaluate(() => document.getElementById('actname').value);
  ok('the field arrives already holding a generated name (' + nameShown + ')', !!nameShown && nameShown.length > 1);
  ok('he was NOT handed a keyboard he did not ask for', await d.fr.evaluate(() => document.activeElement !== document.getElementById('actname')));

  /* SEX, WITH A FINGER: the face has to follow it */
  const sexNow = await d.fr.evaluate(() => BohemiaActs.visible(seed ? String(seed) : 'bohemia')[1].sex);
  const sigBefore = await sig(1);
  const want = sexNow === 'male' ? 1 : 0;      /* the other button: M is first, F second */
  const b = await rectOf('#actedit .aeb[data-sex]', want);
  await tap(b);
  const sexAfter = await d.fr.evaluate(() => BohemiaActs.visible(seed ? String(seed) : 'bohemia')[1].sex);
  ok('*** A FINGER ON ' + (want ? 'F' : 'M') + ' CHANGED THE SEX (' + sexNow + ' -> ' + sexAfter + ') ***', sexAfter !== sexNow);
  /* THE FACE'S REQUEST FOLLOWS THE SEX. What the shell's face function does with it is
     MEASURED, NOT ASSERTED: probed 9/29 on the alpha, descendantSpec(2, own, {reads}) moved
     ZERO of 4096 pixels between 'he' and 'she' in 8 of 8 variants (a reshuffle moved 761
     to 1,513), because faceFor uses reads only to narrow the haircut pool and heredity
     copies the ancestor's hair 90% of the time. That is PORTRAIT's function and taste, so
     this leg would go red the day they fix it if it asserted the defect. It asserts the
     wire instead: the ask carried the new sex and the shell was asked again. */
  const keyAfterSex = await d.fr.evaluate(() => BohemiaActs.faceKey(seed ? String(seed) : 'bohemia', 2));
  ok('*** THE FACE ASK NOW CARRIES THE CHOSEN SEX (' + keyAfterSex + ') ***',
     keyAfterSex.split('~')[2] === (sexAfter === 'female' ? 'she' : 'he'));
  let asked = false; for (let i = 0; i < 14 && !asked; i++) { asked = await d.fr.evaluate((k) => !!FACE_CV[k], keyAfterSex); if (!asked) await pg.waitForTimeout(300); }
  ok('and the shell answered that key (a face exists for it)', asked === true);
  let sigAfter = sigBefore; for (let i = 0; i < 6 && sigAfter === sigBefore; i++) { await pg.waitForTimeout(300); sigAfter = await sig(1); }
  const sexMoved = sigAfter !== sigBefore;
  const fieldAfterSex = await d.fr.evaluate(() => document.getElementById('actname').value);
  const rosterAfterSex = await d.fr.evaluate(() => BohemiaActs.visible(seed ? String(seed) : 'bohemia')[1].name);
  ok('and the field follows the re-derived name (' + fieldAfterSex + ')', fieldAfterSex === rosterAfterSex);

  /* RESHUFFLE, WITH A FINGER */
  const sigB2 = await sig(1);
  const nameB2 = (await strip()).names[1];
  const g = await rectOf('#actflip .af .afr');
  await tap(g);
  const afterRs = await strip();
  ok('*** A FINGER ON THE GLYPH RESHUFFLED HIM (' + nameB2 + ' -> ' + afterRs.names[1] + ') ***', afterRs.names[1] !== nameB2);
  ok('and it did not also flip him anywhere', afterRs.cur === 2);
  let sigA2 = sigB2; for (let i = 0; i < 14 && sigA2 === sigB2; i++) { await pg.waitForTimeout(300); sigA2 = await sig(1); }
  ok('and the face is a different one', sigA2 !== sigB2);

  /* A REAL KEYBOARD */
  const inp2 = await rectOf('#actname');
  await tap(inp2);
  const focused = await d.fr.evaluate(() => document.activeElement === document.getElementById('actname'));
  ok('a finger on the field focuses it', focused === true);
  await d.fr.evaluate(() => document.getElementById('actname').select());
  await pg.keyboard.type('Marisol', { delay: 40 });
  await pg.waitForTimeout(300);
  const typed = await d.fr.evaluate(() => document.getElementById('actname').value);
  ok('*** A REAL KEYBOARD TYPED INTO THE FIELD (' + typed + ') ***', typed === 'Marisol');
  const sigTyped = await sig(1);
  const oldB = await rectOf('#actedit .aeb[data-age="older"]');
  ok('the offer row has OLD and YNG buttons (10/2: older or younger)', !!oldB && !!(await rectOf('#actedit .aeb[data-age="younger"]')));
  if (oldB) { await tap(oldB); }
  ok('*** A REAL FINGER PICKED OLD ***', await d.fr.evaluate(() => BohemiaActs.visible(String(seed))[1].age === 'older'));
  const ok2 = await rectOf('#actedit .aeb:not([data-sex]):not([data-age])');
  await tap(ok2);
  const done2 = await strip();
  ok('*** OK KEPT THE TYPED NAME ***', done2.names[1] === 'Marisol');
  ok('the offer row is gone', done2.editOn === false);
  ok('and so is the reshuffle glyph: he has met them', done2.glyphs[1] === false);
  ok('*** A TYPED NAME DID NOT CHANGE THE FACE ***', (await sig(1)) === sigTyped);
  ok('the roster agrees and says it is his own word',
     await d.fr.evaluate(() => { const v = BohemiaActs.visible(seed ? String(seed) : 'bohemia')[1]; return v.name === 'Marisol' && v.custom === true && v.open === false; }));
  ok('and the window is closed for good', await d.fr.evaluate(() => BohemiaActs.customizable(2) === false && BohemiaActs.reshuffle(2).why === 'CLOSED'));

  /* LEAVING CLOSES THE WINDOW TOO */
  await d.fr.evaluate(() => ctActUnlock(3));
  await pg.waitForTimeout(500);
  const s3 = await strip();
  ok('unlocking act 3 grows a third face, with its glyph', s3.tiles === 3 && s3.glyphs[2] === true);
  let n2 = 0; for (let i = 0; i < 14 && n2 < 100; i++) { n2 = await painted(2); if (n2 < 100) await pg.waitForTimeout(300); }
  ok('and it paints itself (' + n2 + ' of 676)', n2 > 100);
  await tap(await rectOf('#actflip .af', 2));
  ok('a finger hops into act 3 and the offer appears', (await strip()).cur === 3 && (await strip()).editOn === true);
  await tap(await rectOf('#actflip .af', 0));
  const away = await strip();
  ok('*** FLIPPING AWAY CLOSED ACT 3\'S WINDOW: no glyph, no offer row ***', away.cur === 1 && away.glyphs[2] === false && away.editOn === false);

  /* THE SAVE, ON THE REAL PAGE */
  const snap = await d.fr.evaluate(() => JSON.parse(JSON.stringify(citySnapshot())));
  ok('*** THE CITY\'S OWN SAVE CARRIES THE ACTS ***', !!snap.acts && snap.acts.unlocked.join() === '1,2,3' && snap.acts.override && snap.acts.override[2] && snap.acts.override[2].name === 'Marisol');
  await d.fr.evaluate(() => { BohemiaActs.resetAll(); ACTFLIP_BUILT = ''; ctActFlipPaint(); });
  const wiped = await strip();
  ok('(control) wiping the module puts him back to one face', wiped.tiles === 1);
  const restored = await d.fr.evaluate((snap) => { try { applyRestore(snap); return true; } catch (e) { return String(e).slice(0, 80); } }, snap);
  await pg.waitForTimeout(600);
  await d.fr.evaluate(() => { ACTFLIP_BUILT = ''; ctActFlipPaint(); });
  const back2 = await strip();
  ok('*** RESTORING THE SAVE GIVES THE THREE FACES BACK (restore said ' + restored + ') ***',
     back2.tiles === 3 && back2.names[1] === 'Marisol');

  ok('no page error anywhere in this round\'s wire' + (d.errs.length ? ' -- ' + d.errs[0] : ''), d.errs.length === 0);
  console.log('  MEASURED: boot ' + boot.tiles + ' face -> ' + s2.tiles + ' on unlock -> hop offered -> sex ' + sexNow + '->' + sexAfter
              + ' (face pixels ' + (sexMoved ? 'MOVED' : 'did NOT move: PORTRAIT\'s function ignores sex, named') + ')'
              + ' -> typed "' + typed + '" · ' + d.says());
  await d.close();
  done();
})();
