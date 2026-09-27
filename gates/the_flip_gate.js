/* THE FLIP -- DYNASTY row [the flip], rule 31 (Paolo 9/23), his vote A on 9/23,
   the phone is city-view only (rule 32c) and the city view is the map (rule 33).

   THE SHIP TEST IN ONE SENTENCE: three faces on the cracked phone, and A REAL
   FINGER on one of them changes who you are.

   IT IS DRIVEN WITH A FINGER ON PURPOSE. This lane spent most of its round on
   exactly that: the strip painted, the handler was bound, elementFromPoint walked
   straight to the tile, and NOTHING HAPPENED, because the shell covers the top of
   the phone. A checker that dispatched a synthetic click would have been green
   through all of it. */
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(ROOT + '/tools/bohemia_drive_the_demo.js');
const A = require(ROOT + '/engine/bohemia_acts.js');
let pass = 0, fail = 0;
const ok = (what, cond) => { if (cond) { pass++; } else { fail++; console.log('  > FAIL ' + what); } };
const done = () => { console.log('THE FLIP GATE: ' + pass + ' passed, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };

/* ---- 1. THE THREE, WITHOUT A BROWSER ---------------------------------- */
const three = A.prepare('2691674296', 0);
ok('there are exactly three acts', three.length === 3);
ok('every slot is NAMED from the first frame (rule 32d, no unnamed descendant)',
   three.every(a => a.named && a.name && a.name.length > 2));
ok('and the three names are three different people',
   new Set(three.map(a => a.name)).size === 3);
ok('the eras are HIS canon, not invented (Animal / Human / Angel)',
   three.map(a => a.era).join(',') === 'ANIMAL,HUMAN,ANGEL');
ok('the gap between acts is marked draft where it is not ruled',
   three[0].laterDraft === false && three[1].laterDraft === true && three[2].laterDraft === true);
ok('a reshuffle gives a different family', 
   A.prepare('2691674296', 1).map(a => a.name).join() !== three.map(a => a.name).join());
ok('the same seed and salt give the same family, twice',
   A.prepare('2691674296', 0).map(a => a.name).join() === three.map(a => a.name).join());
/* THE FLIP ITSELF */
A.setCurrent(1);
ok('flipping moves him', A.flip(3).moved === true && A.current() === 3);
ok('and a tap on the act he is already in is NOT an event',
   A.flip(3).moved === false);
ok('an act that does not exist is refused', A.flip(9).moved === false);
A.setCurrent(1);
ok('the years between act one and act three read off the table, not a call site',
   A.yearsBetween(1, 3) === 70);
/* THE HONEST STATE OF THE GROUND */
ok('and it SAYS the ground does not differ yet rather than pretending it does',
   A.groundDiffers().differs === false && A.groundDiffers().why === 'NO_DERIVE_YET');

/* ---- 2. ON THE GLASS, WITH A REAL FINGER ------------------------------ */
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
  /* OUT TO THE CITY, because the phone is a city-view object (rule 32c) */
  for (let i = 0; i < 4; i++) { await d.pinchOut(); await pg.waitForTimeout(450); }

  const st = await d.fr.evaluate(() => {
    const box = document.getElementById('actflip');
    return { mode: (typeof MODE !== 'undefined') ? MODE : null,
      tiles: box ? box.querySelectorAll('.af').length : 0,
      names: box ? [...box.querySelectorAll('.afn')].map(e => e.textContent) : [],
      years: box ? [...box.querySelectorAll('.afy')].map(e => e.textContent) : [],
      lit: box ? [...box.querySelectorAll('.af')].map(e => e.classList.contains('now')) : [],
      cur: (typeof BohemiaActs !== 'undefined') ? BohemiaActs.current() : null };
  });
  ok('the phone is a CITY-VIEW object and we are in the city (rule 32c)', st.mode === 'city');
  ok('*** THREE FACES ARE ON THE PHONE *** (' + st.tiles + ')', st.tiles === 3);
  ok('each one carries a name you can read (' + st.names.join(', ') + ')',
     st.names.length === 3 && st.names.every(n => n && n.length > 1 && n.indexOf('…') < 0));
  ok('and when each one is (' + st.years.join(', ') + ')', st.years.length === 3);
  ok('exactly one is lit: the one he is standing in',
     st.lit.filter(Boolean).length === 1 && st.lit[0] === true);

  /* THE FINGER. The tile's own rect inside the frame, plus the frame's box in the
     page. NOT the driver's tapEl: measured this round, tapEl adds the frame offset
     to a handle box that already carries it, so its finger lands somewhere else.
     Named for PLUMBER in the record rather than worked around silently. */
  const fb = await (await d.fr.frameElement()).boundingBox();
  const tile = await d.fr.evaluate(() => {
    const t = document.querySelectorAll('#actflip .af');
    if (!t.length) return null;
    const r = t[t.length - 1].getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height };
  });
  ok('the third face is big enough for a thumb (' + (tile ? Math.round(tile.w) + 'x' + Math.round(tile.h) : 'NONE') + ')',
     !!tile && tile.w >= 24 && tile.h >= 24);
  if (!tile) { await d.close(); done(); }

  /* AND THE SHELL MUST NOT BE SITTING ON IT. The whole reason this round took as
     long as it did: the point resolved perfectly INSIDE the frame while the SHELL
     answered a different element at the same page coordinate. */
  const shellSees = await pg.evaluate((pt) => {
    const el = document.elementFromPoint(pt.x, pt.y);
    return el ? (el.id || el.tagName) : null;
  }, { x: fb.x + tile.x, y: fb.y + tile.y });
  ok('nothing in the shell is covering it (' + shellSees + ')', shellSees === 'cityFrame');

  await pg.touchscreen.tap(fb.x + tile.x, fb.y + tile.y);
  await pg.waitForTimeout(700);
  const after = await d.fr.evaluate(() => {
    const box = document.getElementById('actflip');
    return { cur: (typeof BohemiaActs !== 'undefined') ? BohemiaActs.current() : null,
      lit: box ? [...box.querySelectorAll('.af')].map(e => e.classList.contains('now')) : [],
      rec: window.__ACT_FLIP || null };
  });
  ok('*** A REAL FINGER ON THE THIRD FACE MAKES HIM THE THIRD ONE *** (act ' + after.cur + ')',
     after.cur === 3);
  ok('and the lit one moved with him', after.lit[2] === true && after.lit[0] === false);
  ok('and the page wrote down that it happened', !!after.rec && after.rec.to === 3);
  ok('no page error anywhere in the flip' + (d.errs.length ? ' -- ' + d.errs[0] : ''),
     d.errs.length === 0);

  console.log('  MEASURED: ' + st.names.join(' / ') + ' · ' + st.years.join(' / ')
              + ' · finger flipped 1 -> ' + after.cur + ' · ' + d.says());
  await d.close();
  done();
})();
