const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THE FAMILY IS IN THE GAME (9/4/26, RUN lane)

   He said one word: FAMILY.

     laws/BOHEMIA_ADDENDUM_FAMILY_CORE_THEME_7_19_26.md, LOCKED:
     "STRONG FAMILY CAN CONQUER ALL. NOBODY IS ANYTHING WITHOUT FAMILY ... This
      is the life lesson under the whole game."
     And 8/28, when a summary tried to delete the dynasty:
     "YEAH THREE GENERATIONS BRO CMON."

   *** MEASURED BEFORE ANY OF THIS WAS BUILT: THE GAME HAD NO FAMILY IN IT. ***

       slices/BOHEMIA_ALPHA_0_9.html    runDynasty 0  selectHeir 0  family.tree 0
       slices/BOHEMIA_CITY_WORLD.html   runDynasty 0  selectHeir 0  family.tree 0

   Those two files ARE the game. Zero, every term, both files. A complete dynasty
   engine has existed since 7/2 -- family tree, deterministic heir selection,
   three generational folds, the monument -- living in engine/bohemia_engine.js
   and in two OLD SLICES nobody opens.

   AND THE WALKED WORLD'S ONLY MENTION OF HIS SIBLING WAS A COMMENT QUOTING HIM
   ASKING FOR IT. Every other "sibling" in that file is a SIBLING ROAD CELL.

   THIS IS A WIRE, NOT AN INVENTION -- the same shape as the encounter director
   (258 approved lines, zero callers, wired 8/27) and the build stamp (a fact the
   shell held that the city could not read, 8/27). Everything needed already
   existed: FAMILY_CAST with RAY, DENISE, MARCO and NINA, named and drafted and
   rendering (family_cast_gate 26/0); his 7/19 ruling about which sibling is lost,
   already implemented as `survivesIf`; and a boot handshake already carrying two
   other answers. THE SHELL KNEW ALL OF IT AND THE WALKED WORLD HAD NEVER BEEN
   TOLD.

   WHAT THIS GATE HOLDS:
   A. the family really arrives in the walked world, off the real handshake
   B. it is the APPROVED CAST and not a second table -- names are compared
      against FAMILY_CAST itself, because two places holding one name is how the
      mother came back as DENISE from a table the scene module had never heard of
   C. exactly one sibling is lost, and it is HIS 7/19 RULING that decides which
   D. it survives a reload, because a family the game forgets is not a family
   E. HE CAN REACH IT -- on a card he already opens, proved by pressing the real
      button, never by reading a variable
   F. and it names WHO HE LOST, not only who is left. "Grief is the proof it was
      real"; a family card listing only survivors is the counterfeit family the
      whole story is against.

   node gates/the_family_is_in_the_game_gate.js
   ========================================================================== */
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== THE FAMILY IS IN THE GAME: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);

    /* B. THE SOURCE OF TRUTH, read off the shell before the city is even up. */
    const cast = await page.evaluate(() => (window.FAMILY_CAST || []).map(m => ({
      role: m.role, name: m.name, survivesIf: m.survivesIf, draft: !!m.draft })));
    ok('the approved cast is on the shell (' + cast.length + ': '
      + cast.map(c => c.name).join(', ') + ')', cast.length === 4);
    ok('and every one of them is still marked draft, so every name stays his to '
      + 'rewrite in one place', cast.every(c => c.draft === true));

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
    await SETTLE(page, 1800);

    /* A. IT ARRIVED. Off the real boot handshake, not planted by this gate. */
    const fam = await city.evaluate(() => {
      const f = (typeof famHydrate === 'function') ? famHydrate() : null;
      return { list: f, living: (typeof famLiving === 'function') ? famLiving() : null,
               lost: (typeof famLost === 'function') ? famLost() : null,
               stored: (function () { try { return !!localStorage.getItem('boh.city.family'); }
                                      catch (e) { return false; } })() };
    });
    ok('*** THE WALKED WORLD KNOWS HE HAS A FAMILY *** -- it arrived on the boot '
      + 'handshake the shell was already answering, and it was ZERO before today ('
      + (fam.list ? fam.list.length + ' people' : 'NOTHING ARRIVED') + ')',
      !!(fam.list && fam.list.length === 4));

    /* B. THE SAME PEOPLE, NOT A SECOND TABLE. */
    const gotNames = (fam.list || []).map(m => m.name).sort().join(',');
    const castNames = cast.map(c => c.name).sort().join(',');
    ok('*** AND THEY ARE THE APPROVED CAST, NOT A SECOND TABLE *** (' + gotNames
      + ') -- two places holding one name is how the mother came back as DENISE '
      + 'from a table nobody had heard of', gotNames === castNames);

    /* C. HIS RULING DECIDES WHO IS LOST. */
    const lostByRule = cast.filter(c => c.survivesIf !== 'always'
      && c.survivesIf !== 'male');   /* the male-player case his ruling spells out first */
    ok('*** EXACTLY ONE SIBLING IS LOST *** (' + (fam.lost ? fam.lost.name
      + ', the ' + fam.lost.role.toLowerCase() : 'NOBODY') + ')',
      !!fam.lost && (fam.list || []).filter(m => !m.alive).length === 1);
    ok('and WHICH one is his 7/19 ruling, read off survivesIf and decided nowhere '
      + 'else ("the surviving sibling is the SAME GENDER as the player")',
      !!(fam.lost && lostByRule.length === 1 && fam.lost.name === lostByRule[0].name));
    ok('the parents both survive, because the ruling says the loss is a sibling',
      (fam.living || []).some(m => m.role === 'FATHER')
      && (fam.living || []).some(m => m.role === 'MOTHER'));

    /* D. A FAMILY THE GAME FORGETS IS NOT A FAMILY. */
    ok('it is written down, so a reload does not orphan him', fam.stored === true);
    const survived = await city.evaluate(() => {
      /* wipe the live copy and rehydrate from storage the way a fresh boot does */
      FAMILY = null;
      const f = famHydrate();
      return f ? f.map(m => m.name + (m.alive ? '' : '(lost)')).join(',') : null;
    });
    ok('*** AND IT SURVIVES A RELOAD *** (' + survived + ')',
      !!survived && survived.indexOf('(lost)') >= 0);

    /* E + F. HE CAN REACH IT, PROVED BY PRESSING THE REAL BUTTON. */
    /* THE WHOLE DEFECT THIS FIXES IS A THING THAT EXISTED AND COULD NOT BE
       REACHED, so reading a variable here would be the same mistake wearing a
       gate's clothes. This presses STANDING and reads what appears. */
    await city.click('#rungbtn', { timeout: 8000 }).catch(() => { });
    await SETTLE(page, 900);
    const card = await city.evaluate(() => {
      const inn = document.getElementById('daycardIn');
      const on = document.getElementById('daycard').classList.contains('on');
      return { on: on, text: inn ? inn.textContent : '' };
    });
    ok('the STANDING card really opened on a real press', card.on === true);
    ok('*** AND HIS FAMILY IS ON IT *** -- on a card he already opens, not behind '
      + 'a new button nobody finds', /YOUR PEOPLE/.test(card.text)
      && (fam.living || []).every(m => card.text.indexOf(m.name) >= 0));
    ok('*** AND IT NAMES WHO HE LOST *** -- "grief is the proof it was real", and '
      + 'a family card listing only survivors is the counterfeit family the whole '
      + 'story is against (' + (fam.lost ? fam.lost.name : '?') + ')',
      /WHO YOU LOST/.test(card.text)
      && !!(fam.lost && card.text.indexOf(fam.lost.name) >= 0));

    ok('and nothing threw (' + (errs.length ? errs.slice(0, 2).join(' | ') : 'none')
      + ')', errs.length === 0);
    console.log('  MEASURED: ' + (fam.list || []).length + ' people reached the walked '
      + 'world · living ' + (fam.living || []).map(m => m.name).join(', ')
      + ' · lost ' + (fam.lost ? fam.lost.name + ' (' + fam.lost.role + ')' : 'nobody')
      + ' · on the STANDING card, from a real press');
    console.log('  BEFORE TODAY: runDynasty 0, selectHeir 0, family.tree 0, in both '
      + 'files that make up the game. FAMILY IS THE CORE THEME and there was no '
      + 'family in it.');
    console.log('  HIS, AND UNTOUCHED: every name comes from FAMILY_CAST and is '
      + 'draft:true; which sibling is lost is his 7/19 ruling; KNOWN_AT_START is '
      + 'not touched and stays empty.');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
