/* THREE NAMES -- DYNASTY row [three names], rule 32(d) (Paolo 9/23): "a
   generated name per slot, reshuffle, or type your own; sex the same way; no
   flip to an unnamed descendant."

   THE SHIP TEST IN ONE SENTENCE: reshuffle changes ONE slot and leaves the
   other two exactly where they were, on the real glass, with a real finger.

   [the flip]'s own gate already proved a synthetic click can pass while a real
   finger fails (the shell covering the top of the phone). This reuses that
   lesson rather than re-learning it: driven with a real finger, through the
   same tile geometry [the flip] already measured safe (the strip at the
   bottom of the glass). */
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(ROOT + '/tools/bohemia_drive_the_demo.js');
const A = require(ROOT + '/engine/bohemia_acts.js');
let pass = 0, fail = 0;
const ok = (what, cond) => { if (cond) { pass++; } else { fail++; console.log('  > FAIL ' + what); } };
const done = () => { console.log('THREE NAMES GATE: ' + pass + ' passed, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };

/* ---- 1. THE MECHANISM, WITHOUT A BROWSER --------------------------------- */
const SEED = '2691674296';
A.resetRoster();

const base = A.roster(SEED);
ok('the live roster has three slots, same as prepare()', base.length === 3);
ok('every slot is named from the first frame (rule 32d, no unnamed descendant)',
   base.every(a => a.named && a.name && a.name.length > 1));
ok('every slot has a concrete sex, never a shrug (a body has to be built from it)',
   base.every(a => a.sex === 'male' || a.sex === 'female'));
ok('a prepared name agrees with its own sex where the bank has one that does',
   base.every(a => a.reads === 'either' ||
     (a.sex === 'female' && a.reads === 'she') || (a.sex === 'male' && a.reads === 'he')));
ok('nothing is a custom override yet', base.every(a => a.custom === false));

/* RESHUFFLE ONE SLOT ONLY */
const before = A.roster(SEED);
const r2 = A.reshuffle(2);
const after2 = A.roster(SEED);
ok('reshuffle(2) reports it changed', r2 && r2.changed === true && r2.act === 2);
ok('*** SLOT 2 ALONE CHANGED *** (' + before[1].name + ' -> ' + after2[1].name + ')',
   after2[1].name !== before[1].name);
ok('slot 1 is untouched by slot 2\'s reshuffle', after2[0].name === before[0].name);
ok('slot 3 is untouched by slot 2\'s reshuffle', after2[2].name === before[2].name);

/* A BAD ACT REFUSES CLEANLY */
ok('reshuffling an act that does not exist changes nothing',
   A.reshuffle(9).changed === false);

/* TYPE YOUR OWN */
const setN = A.setName(1, 'Marisol');
ok('setName accepts a real name', setN.ok === true);
const afterName = A.roster(SEED);
ok('the typed name is now what slot 1 says', afterName[0].name === 'Marisol');
ok('the slot is flagged custom, so a screen knows not to overwrite it silently',
   afterName[0].custom === true);

ok('an empty typed name is refused, not accepted as a blank', A.setName(1, '   ').ok === false);
ok('...and the prior typed name survives the refusal',
   A.roster(SEED)[0].name === 'Marisol');
ok('a name past the tile\'s own bound is refused', A.setName(2, 'x'.repeat(40)).ok === false);

/* RESHUFFLING A DIFFERENT SLOT LEAVES THE TYPED ONE ALONE */
A.reshuffle(3);
ok('slot 1\'s typed name survives another slot reshuffling',
   A.roster(SEED)[0].name === 'Marisol' && A.roster(SEED)[0].custom === true);

/* SEX THE SAME WAY */
const setS = A.setSex(3, 'female');
ok('setSex accepts a real sex', setS.ok === true);
ok('the chosen sex sticks', A.roster(SEED)[2].sex === 'female');
ok('an invalid sex is refused', A.setSex(3, 'robot').ok === false);

/* A TYPED NAME IS NEVER SECOND-GUESSED BY A LATER SEX CHOICE */
A.setSex(1, 'male');
ok('changing sex on a slot with a TYPED name never touches the typed name '
   + '(his word is his word)', A.roster(SEED)[0].name === 'Marisol');

/* A SEX CHANGE ON A MERELY-PREPARED SLOT RE-DERIVES A NAME THAT AGREES */
A.resetRoster();
const beforeSex = A.roster(SEED)[1];
A.setSex(2, beforeSex.sex === 'male' ? 'female' : 'male');
const afterSex = A.roster(SEED)[1];
ok('a sex change on a non-custom slot never leaves a stale mismatched name '
   + '(' + beforeSex.name + '/' + beforeSex.sex + ' -> ' + afterSex.name + '/' + afterSex.sex + ')',
   afterSex.reads === 'either' || afterSex.reads === (afterSex.sex === 'female' ? 'she' : 'he'));

/* RESET */
A.resetRoster();
ok('resetRoster() clears every override and salt back to the pure prepare()',
   JSON.stringify(A.roster(SEED).map(a => [a.name, a.custom]))
   === JSON.stringify(A.prepare(SEED, 0).map(a => [a.name, a.custom])));

/* ---- 2. ON THE GLASS, WITH A REAL FINGER --------------------------------- */
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
  /* the phone is a city-view / map object (rule 32c, rule 33) */
  for (let i = 0; i < 4; i++) { await d.pinchOut(); await pg.waitForTimeout(450); }

  /* reset the module's live state so this run starts from the pure prepare(),
     the same discipline the mechanism section above used */
  await d.fr.evaluate(() => { try { BohemiaActs.resetRoster(); if (typeof ctActFlipPaint === 'function') { ACTFLIP_BUILT = ''; ctActFlipPaint(); } } catch (e) {} });
  await pg.waitForTimeout(300);

  const before3 = await d.fr.evaluate(() => {
    const box = document.getElementById('actflip');
    return box ? [...box.querySelectorAll('.af')].map(t => (t.querySelector('.afn') || {}).textContent) : [];
  });
  ok('the strip shows three names before any reshuffle (' + before3.join(', ') + ')',
     before3.length === 3 && before3.every(n => n && n.length > 0));

  const glyph = await d.fr.evaluate(() => {
    const box = document.getElementById('actflip');
    const tiles = box ? [...box.querySelectorAll('.af')] : [];
    const r = tiles[1] ? tiles[1].querySelector('.afr') : null;
    if (!r) return null;
    const rect = r.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, w: rect.width, h: rect.height };
  });
  ok('slot 2 carries a reshuffle glyph, sized for a thumb-adjacent tap '
     + '(' + (glyph ? Math.round(glyph.w) + 'x' + Math.round(glyph.h) : 'NONE') + ')',
     !!glyph && glyph.w >= 9 && glyph.h >= 9);
  if (!glyph) { await d.close(); done(); }

  const fb = await (await d.fr.frameElement()).boundingBox();
  const shellSees = await pg.evaluate((pt) => {
    const el = document.elementFromPoint(pt.x, pt.y);
    return el ? (el.id || el.tagName) : null;
  }, { x: fb.x + glyph.x, y: fb.y + glyph.y });
  ok('nothing in the shell covers the glyph (' + shellSees + ')', shellSees === 'cityFrame');

  await pg.touchscreen.tap(fb.x + glyph.x, fb.y + glyph.y);
  await pg.waitForTimeout(700);

  const after3 = await d.fr.evaluate(() => {
    const box = document.getElementById('actflip');
    return box ? [...box.querySelectorAll('.af')].map(t => (t.querySelector('.afn') || {}).textContent) : [];
  });
  ok('*** A REAL FINGER ON THE GLYPH RESHUFFLED SLOT 2, ON THE GLASS *** '
     + '(' + before3[1] + ' -> ' + after3[1] + ')', after3[1] !== before3[1]);
  ok('and slot 1 held still on the real glass', after3[0] === before3[0]);
  ok('and slot 3 held still on the real glass', after3[2] === before3[2]);

  /* THE GLYPH MUST NOT ALSO FLIP HIM. It sits inside the tile that flips on a
     click of its own; without stopPropagation the reshuffle tap would also
     change which act he is standing in. */
  const curAfter = await d.fr.evaluate(() => { try { return BohemiaActs.current(); } catch (e) { return null; } });
  ok('tapping the reshuffle glyph did NOT also flip him (still act ' + curAfter + ')',
     curAfter === 1);

  ok('no page error anywhere in this round\'s wire' + (d.errs.length ? ' -- ' + d.errs[0] : ''),
     d.errs.length === 0);

  console.log('  MEASURED: slot2 ' + before3[1] + ' -> ' + after3[1]
              + ' · slot1/3 held · ' + d.says());
  await d.close();
  done();
})();
