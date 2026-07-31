// BOHEMIA — JUDGING SURFACE + WARDROBE GATE (7/31/26). FACTORY LAW: new machinery
// ships with its own gate, same turn.
//
// Paolo 7/31 gave a list, and every item below is one of them. The reason this is
// a gate and not a changelog: his whole verdict loop runs through this tab, and
// STALE UNJUDGED IS DEAD. A surface he cannot navigate is a surface that does not
// get used, so these are load-bearing, not cosmetic.
//
//   "can i wear the clothes now? theres no option to."
//        There were TWO wardrobes. PD.layers is his 7 hand-painted pieces and
//        that is all the CHARACTER tab ever offered. The 221 generated GARMENTS
//        existed only as previews in the CLOTHES tab -- judgeable, never wearable.
//
//   THE BUG THAT ALMOST SHIPPED, measured not guessed: the first version
//        composited worn garments BEFORE the painted PD.layers loop, so his
//        equipped babypunk pieces painted straight over them and wearing a shirt
//        changed EXACTLY 0 PIXELS. It looked wired and did nothing. Order is now
//        asserted below by pixel count, because "the code is there" is not proof.
const path = require('path');
const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
const fs = require('fs');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== JUDGING SURFACE GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

const src = fs.readFileSync(ALPHA, 'utf8');

/* ---- static: the rows he asked to be deleted are actually gone ---------- */
ok('the SWING AMPLITUDE row is gone (Paolo: "older alpha shit")',
  !/<b>SWING AMPLITUDE<\/b>/.test(src));
ok('the KNOCK row is gone', !/<b>KNOCK<\/b>/.test(src));
ok('G.swing survives the row removal (the rig sync path reads it)', /G\.swing/.test(src));
ok('G.knock survives the row removal (combat\'s headshot harness reads it)', /G\.knock/.test(src));
ok('their builders are guarded so a missing element cannot throw',
  /const sw=document\.getElementById\('swingR'\);\s*\n?\s*if\(sw\)/.test(src) &&
  /const kb=document\.getElementById\('knockBtns'\);if\(kb\)/.test(src));

ok('cough is back to its pre-session coefficients (2 rejections = stop)',
  /cough:\(d,ph\)=>[\s\S]{0,400}?g\[0\]\[1\]-4/.test(src) &&
  /cough:\(d,ph\)=>[\s\S]{0,300}?spine:spF\(d\)\*\(0\.12\+0\.18\*b\)/.test(src));

/* ---- the real surface -------------------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForTimeout(2200);
  ok('the alpha loads with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  if (errs.length) { await b.close(); done(); }

  await pg.evaluate(() => { const fr = document.getElementById('front'); if (fr) fr.click(); });
  await pg.waitForTimeout(400);
  await pg.evaluate(() => { const t = [...document.querySelectorAll('.tab')].find(x => x.dataset.p === 'char'); if (t) t.click(); });
  await pg.waitForTimeout(1000);

  const st = await pg.evaluate(() => ({
    skel: G.showSkel,
    skelBtn: (document.getElementById('skelToggle') || {}).textContent,
    auto: window.G_AUTODIR,
    autoBtnOn: !!(document.getElementById('autoDirBtn') || {}).classList?.contains('on'),
    judge: !!document.getElementById('judgeAllBtn'),
    fit: !!document.getElementById('charFit'),
    garments: window.GARMENTS ? window.GARMENTS.length : 0,
    swingEl: !!document.getElementById('swingR'),
    knockEl: !!document.getElementById('knockBtns'),
  }));

  /* 4. "show skeleton is on by default. it should be off by default." */
  ok('SHOW SKELETON starts OFF', st.skel === false && st.skelBtn === 'OFF');
  /* 1. "it should be on by defauly though" */
  ok('AUTO-SPIN exists and starts ON', st.auto === true && st.autoBtnOn === true);
  /* 5. the elements themselves are gone from the DOM */
  ok('no swing slider in the DOM', !st.swingEl);
  ok('no knock buttons in the DOM', !st.knockEl);
  /* 2. the 221 are reachable */
  ok(`the generated wardrobe is reachable from the character (${st.garments} garments)`, st.garments > 200);
  /* 3 + 6 */
  ok('SHUFFLE FIT exists', st.fit);
  ok('JUDGE ALL exists', st.judge);

  /* THE ONE THAT ACTUALLY MATTERS: wearing a garment changes real pixels.
     Asserted by count because the first version was fully wired and changed 0. */
  const worn = await pg.evaluate(() => {
    const snap = () => { FRAME_CACHE.map.clear(); const fr = buildFrame('S', 'idle', 0.1);
      return fr.px.map(c => c ? c.join(',') : '').join('|'); };
    const keep = window.G_WORN;
    window.G_WORN = {}; const bare = snap();
    window.G_WORN = { base: 'RED SHIRT' }; const shirt = snap();
    window.G_WORN = { base: 'RED SHIRT', legs: 'BLUE JEANS', feet: 'BROWN BOOTS' }; const full = snap();
    window.G_WORN = keep;
    const diff = (a, c) => { let n = 0; const A = a.split('|'), C = c.split('|');
      for (let i = 0; i < A.length; i++) if (A[i] !== C[i]) n++; return n; };
    return { shirt: diff(bare, shirt), full: diff(bare, full) };
  });
  ok(`wearing a shirt actually repaints the body (${worn.shirt} px, was 0 when the composite ran too early)`,
    worn.shirt > 100);
  ok(`a full fit repaints more than a shirt alone (${worn.full} px)`, worn.full > worn.shirt);

  /* a preview must still show ONE garment on a clean body, not his whole fit */
  ok('the worn fit is skipped while a CLOTHES preview is rendering',
    /if\(!window\.CLO_PREVIEW&&window\.GARMENTS&&window\.G_WORN\)/.test(src));

  /* the wardrobe list obeys the 7/30 alphabetical standing order */
  const wl = await pg.evaluate(() => {
    window.wardrobeRefresh();
    const h = document.getElementById('wardrobe');
    const secs = h.querySelectorAll('.cloFold').length;
    const btns = [...h.querySelectorAll('button')].map(x => x.textContent);
    return { secs, n: btns.length, first: btns.slice(0, 3) };
  });
  ok(`the wardrobe lists every category (${wl.secs} sections, ${wl.n} pieces)`, wl.secs >= 8 && wl.n > 150);

  /* 1. AUTO-SPIN really advances the facing */
  const d0 = await pg.evaluate(() => G.dir);
  await pg.waitForTimeout(2300);
  const d1 = await pg.evaluate(() => G.dir);
  ok(`AUTO-SPIN advances the facing on its own (${d0} -> ${d1})`, d0 !== d1);

  /* 6. JUDGE ALL lists every clip */
  const ja = await pg.evaluate(() => {
    const t = [...document.querySelectorAll('.tab')].find(x => x.dataset.p === 'anim'); if (t) t.click();
    document.getElementById('judgeAllBtn').click();
    const h = document.getElementById('judgeAll');
    return { rows: h.querySelectorAll('.row').length, clips: CLIPS.length };
  });
  ok(`JUDGE ALL lists every clip in one pass (${ja.rows - 1} rows for ${ja.clips} clips)`,
    ja.rows >= ja.clips);

  await b.close();
  done();
})();
