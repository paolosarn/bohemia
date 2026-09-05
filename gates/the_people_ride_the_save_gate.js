/* ============================================================================
   THE PEOPLE RIDE THE SAVE  [people saved]   (9/4/26, RUN lane)
   VAMILY job BB-THE-PEOPLE-RIDE-THE-SAVE.

     "DAY 21. THE WORLD IS INSIDE THE HARDENED SAVE AND THE PEOPLE ARE OUTSIDE IT."

   engine/bohemia_save.js is not broken. Two slots with a generation counter, an
   FNV-1a checksum, a probe the SIZE of the real save, poisoning on write failure,
   a version chain, the whole phone path. save_iphone_gate drives it against a
   hostile fake browser: 44 passed, 0 failed.

   THE GAP: the walked city made ten localStorage writes; four are dev tools and
   THE OTHER FIVE ARE THE GAME'S MEMORY OF PEOPLE -- minds, known, met, belong,
   deedweight -- every one writing to raw localStorage AROUND the hardened save.
   One slot each, no checksum, no migration on four of five, and a silent catch on
   write failure: THE EXACT FOUR FAILURE MODES bohemia_save.js WAS WRITTEN TO
   KILL, reproduced outside its walls. MEASURED: all five appeared ZERO times in
   citySnapshot.

   THE SHIP TEST, from the row itself: export, import, restore, rollback and wipe
   all cover the people.

   THE ROLLBACK HALF RUNS IN NODE AGAINST THE REAL SAVE MODULE, with the same
   hostile fake store save_iphone_gate uses, because THE REAL BROWSER CANNOT RUN
   IT: on file:// the save's own size probe fails and the module correctly
   poisons itself ("this launcher will not store a save"). A rollback proof that
   quietly never rolled back is worth nothing, and this lane wrote that exact
   mistake earlier the same week -- a mutation that never executed and was
   believed anyway.

   node gates/the_people_ride_the_save_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const Save = require(path.join(ROOT, 'engine/bohemia_save.js'));
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== THE PEOPLE RIDE THE SAVE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

/* the same hostile store shape save_iphone_gate uses, kept minimal */
function fakeStore() {
  const d = Object.create(null);
  return { getItem: k => (k in d ? d[k] : null),
           setItem: (k, v) => { d[k] = String(v); },
           removeItem: k => { delete d[k]; },
           key: i => Object.keys(d)[i], get length() { return Object.keys(d).length; },
           _d: d };
}
const mk = (store) => Save.make({ store, ios: true, standalone: false });

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

(async () => {
  /* ======================================================================
     ROLLBACK -- the case the row is really about, and the one that cannot be
     seen from inside the game. THE DESYNC WAS: the world rolls back one
     generation and the people do not, because they lived in a different store.
     ====================================================================== */
  {
    const st = fakeStore();
    const s = mk(st);
    ok('the hostile store probes as disk, so this test is real', s.probe() === 'disk');

    /* GENERATION 1: day one, and the people he knew on day one. */
    s.save({ day: 1, people: { minds: { A: 1 },
                               belong: { CARTEL: { gave: 1, burned: false } } } });
    /* GENERATION 2: a later day, and MORE people memory. */
    s.save({ day: 2, people: { minds: { A: 1, B: 1 },
                               belong: { CARTEL: { gave: 9, burned: true } } } });

    const fresh = s.load();
    ok('the newest generation loads with its own people (day '
      + (fresh && fresh.data.day) + ', ' + (fresh && Object.keys(fresh.data.people.minds).length)
      + ' minds)',
      !!fresh && fresh.data.day === 2 && Object.keys(fresh.data.people.minds).length === 2);

    /* TEAR THE NEWEST SLOT. A truncated blob is failure D in save_iphone_gate's
       own list, and it is what the checksum exists to catch. */
    const keys = Object.keys(st._d).filter(k => /\.(a|b)$/.test(k));
    let newest = null, best = -1;
    for (const k of keys) {
      try { const e = JSON.parse(st._d[k]); if ((e.gen | 0) > best) { best = e.gen | 0; newest = k; } }
      catch (_e) { }
    }
    ok('*** THE TEAR ACTUALLY LANDED ON THE NEWEST SLOT *** -- a rollback test '
      + 'that never rolled back proves nothing, and this lane believed one of '
      + 'those earlier the same week (' + newest + ', gen ' + best + ')',
      !!newest && best >= 1);
    st._d[newest] = st._d[newest].slice(0, Math.floor(st._d[newest].length * 0.6));

    /* *** A ROLLBACK IS A NEXT-LAUNCH EVENT, NOT A NEXT-CALL ONE, AND THE FIRST
       CUT OF THIS TEST DID NOT KNOW THAT. *** load() prefers S.mem, the in-session
       copy of what was last written, which is correct and deliberate: inside one
       session memory IS the truth even when the disk is torn. So calling load()
       again on the SAME instance returned day 2 and the test read as a failure of
       the module. It was a failure of the harness. A real rollback happens when
       the player comes back, so the harness has to model a launch: a fresh
       instance over the same store, with no memory of the session that tore it. */
    const relaunch = mk(st);
    const back = relaunch.load();
    ok('the save really fell back a generation (day ' + (back && back.data && back.data.day) + ')',
      !!back && back.data && back.data.day === 1);
    /* THE CLAIM THE WHOLE ROW EXISTS FOR. */
    ok('*** AND THE PEOPLE CAME WITH IT *** -- the world and its population roll '
      + 'back TOGETHER, which is the desync the row names: '
      + (back && back.data.people ? Object.keys(back.data.people.minds).length + ' minds, gave '
         + back.data.people.belong.CARTEL.gave : 'NO PEOPLE ON THE ROLLED-BACK SAVE'),
      !!(back && back.data.people
         && Object.keys(back.data.people.minds).length === 1
         && back.data.people.belong.CARTEL.gave === 1
         && back.data.people.belong.CARTEL.burned === false));
  }

  /* ======================================================================
     EXPORT, RESTORE AND WIPE -- on the real surface, in the real walked city.
     ====================================================================== */
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); done(); }
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1200);
    await city.evaluate(() => {
      const c = document.getElementById('daycard');
      if (c && getComputedStyle(c).display !== 'none') {
        const b = c.querySelector('.dcgo') || c.querySelector('.dcbtn'); if (b) b.click(); }
    });
    await SETTLE(page, 1600);

    const r = await city.evaluate(() => {
      const R = {};
      const KEYS = ['boh.city.met', 'boh.city.minds', 'boh.city.known',
                    'boh.city.belong', 'boh.city.deedweight'];
      const present = () => KEYS.filter(k => {
        try { return localStorage.getItem(k) !== null; } catch (e) { return false; } });

      /* real people memory: familiarity and a burned bridge */
      try {
        ctMind('probe:one'); ctMind('probe:two'); ctMindSave();
        window.__CT_BELONG = window.__CT_BELONG || {};
        window.__CT_BELONG.meta = { CARTEL: { gave: 9, owed: 4, burned: true } };
        ctBelongPersist();
        knownSave(); ctSave();
      } catch (e) { R.seedErr = String(e.message).slice(0, 90); }

      const snap = citySnapshot();
      R.hasPeople = !!snap.people;
      R.keysInSnap = snap.people ? Object.keys(snap.people).sort() : [];
      R.mindsInSnap = snap.people && snap.people.minds ? Object.keys(snap.people.minds).length : 0;
      R.belongInSnap = snap.people ? JSON.stringify(snap.people.belong) : null;

      R.beforeWipe = present();
      try { window.__CT.wipe(); } catch (e) { R.wipeErr = String(e.message).slice(0, 90); }
      R.afterWipe = present();
      R.mindsAfterWipe = Object.keys(CT_MINDS).length;

      R.restored = (function () { try { return ctPeopleLoad(snap.people); } catch (e) { return -1; } })();
      R.mindsAfterRestore = Object.keys(CT_MINDS).length;
      R.belongAfterRestore = JSON.stringify((window.__CT_BELONG || {}).meta || null);
      R.afterRestore = present();

      /* a save written before today has no people block and must still load */
      const old = citySnapshot(); delete old.people;
      R.oldLoads = (function () { try { return applyRestore(old) !== false; } catch (e) { return false; } })();
      return R;
    });

    ok('*** THE SNAPSHOT CARRIES THE PEOPLE *** -- all five, where all five were '
      + 'ZERO before today (' + r.keysInSnap.join(', ') + ')',
      r.hasPeople && r.keysInSnap.length === 5
      && ['belong', 'deed', 'known', 'met', 'minds'].every(k => r.keysInSnap.indexOf(k) >= 0));
    ok('and it carries what he actually did, not an empty shape ('
      + r.mindsInSnap + ' blocks familiar, belonging ' + r.belongInSnap + ')',
      r.mindsInSnap >= 2 && /burned/.test(String(r.belongInSnap)));

    /* WIPE. "A WIPE THAT LEAVES HALF THE SAVE IS NOT A WIPE" was already written
       in this file, above code that cleaned two of five. */
    ok('*** A CLEAN SLATE NOW CLEANS ALL FIVE *** (' + r.beforeWipe.length
      + ' present -> ' + r.afterWipe.length + ') -- it cleaned two of five under a '
      + 'comment that already said a wipe leaving half a save is not a wipe',
      r.beforeWipe.length >= 4 && r.afterWipe.length === 0 && r.mindsAfterWipe === 0);

    /* RESTORE. */
    ok('*** AND A RESTORE BRINGS THE PEOPLE BACK *** (' + r.restored + ' of 5, '
      + r.mindsAfterRestore + ' blocks familiar again)',
      r.restored === 5 && r.mindsAfterRestore >= 2);
    ok('exactly, not approximately -- the burned bridge is the same burned bridge ('
      + r.belongAfterRestore + ')', r.belongAfterRestore === r.belongInSnap);
    ok('and the live objects and their keys move together, so the two cannot '
      + 'disagree (' + r.afterRestore.length + ' of 5 keys rewritten)',
      r.afterRestore.length === 5);

    /* BACKWARD COMPATIBILITY, which is why the save version is NOT bumped. */
    ok('a save written before today has no people block and still loads, which is '
      + 'why the version is not bumped -- bumping would make every save written '
      + 'today unreadable by any build that has not shipped yet', r.oldLoads === true);

    ok('and nothing threw (' + (errs.length ? errs.slice(0, 2).join(' | ') : 'none')
      + ')', errs.length === 0);
    console.log('  MEASURED: snapshot carries ' + r.keysInSnap.join('/') + ' · wipe '
      + r.beforeWipe.length + ' -> ' + r.afterWipe.length + ' · restore ' + r.restored
      + ' of 5 · rollback carries the people (node, hostile store)');
    console.log('  BEFORE TODAY: met/minds/known/belong/deedweight appeared ZERO times '
      + 'in citySnapshot; export did not carry the people, a restore gave yesterday\'s '
      + 'world with today\'s population, and the two-slot rollback DESYNCED.');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
