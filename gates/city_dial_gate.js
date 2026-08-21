/* BOHEMIA CITY DIAL GATE (8/21/26, PEOPLE lane)
 *
 * WHY THIS EXISTS. This lane shipped a reputation system over three turns: people
 * witness what you do, remember it, tell each other at a penalty per retelling,
 * and forget it as it fades. Its entire JUDGEMENT layer, bohemia_standing's
 * DEED_WEIGHT, ships deliberately EMPTY and waits on Paolo, which is correct
 * under MECHANISM-MINE / CONTENTS-PAOLO'S: numbers are his and nothing may invent
 * one.
 *
 * BUT THE ONLY WAY HE COULD FILL IT WAS TO TELL ME AND I EDIT A FILE, and his own
 * 8/12 law answers that in one line: "where does he change this himself? If the
 * answer is 'he tells me and I edit a file', the system is not shipped yet." Not
 * inventing his numbers and not giving him the controls are two different
 * mistakes, and this lane made the second one three turns running.
 *
 * WHAT IT PROVES
 *   1) the table STILL ships empty, and nothing seeds it (the law that stands)
 *   2) the DIRECT tab has a STANDING dial, in a tab, with every act in plain words
 *   3) turning it CROSSES THE FRAME and the city applies it in place, so
 *      opinionOf/standingOf/the rungs light up with no other wiring
 *   4) the consequence he reads is computed by the SHIPPED module, not retyped
 *      up in the alpha, which cross-frame SecurityError made tempting
 *   5) it KEEPS: persists, and exports as .txt so a lane can land it as canon
 *   6) and it can be TAKEN BACK, because undo is half of a dial
 *
 * Run: node gates/city_dial_gate.js
 */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
process.chdir(ROOT);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0; const fail = [];
const ok = (n, c) => {
  if (typeof c === 'string') throw new Error('GATE BUG: ok() got a STRING as its '
    + 'condition. This file is ok(message, condition).');
  if (typeof n !== 'string') throw new Error('GATE BUG: ok() got a ' + typeof n
    + ' as its message. Arguments are reversed.');
  c ? pass++ : (fail.push(n), console.log('  FAIL: ' + n));
};

function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

/* ---- 1. THE LAW THAT STANDS: THE TABLE IS STILL EMPTY --------------------- */
const standing = fs.readFileSync('engine/bohemia_standing.js', 'utf8');
ok('A1 bohemia_standing STILL declares DEED_WEIGHT empty, and the dial did not '
  + 'seed it', /var DEED_WEIGHT\s*=\s*\{\s*\}/.test(standing));
const city = fs.readFileSync('slices/BOHEMIA_CITY_WORLD.html', 'utf8');
const alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
/* NOTHING ANYWHERE WRITES A ROW OF ITS OWN. The only writer is ctDialApply, and
   the only thing that calls it is a restore or a message from his dial. */
ok('A2 the ONLY writer of the table is the dial receiver (no lane seeds a row)',
  (city.split(/T0\[j\]\s*=\s*v;/).length - 1) === 1);
ok('A3 zero means UNRULED rather than "worth nothing", so a row he clears really '
  + 'clears', /if \(!isFinite\(v\) \|\| v === 0\) continue;/.test(city));
/* *** THE DECLARATION IS CHECKED, NOT THE RUNTIME VALUE, AND THAT IS DELIBERATE. ***
   Mutation-measured: seeding the table in the city's inlined copy left this gate
   GREEN, because the alpha pushes his (empty) dial across on boot and
   ctDialApply clears the table before anything reads it. That masking is the
   RIGHT runtime behaviour -- his dial is the authority -- but it means a probe
   can never see a seeded default. So the shipped DECLARATION is asserted empty
   everywhere it appears, which is the thing the law is actually about. */
const decls = (city.match(/var DEED_WEIGHT\s*=\s*\{[^}]*\}/g) || []);
ok('A3a every shipped declaration of DEED_WEIGHT is EMPTY (' + decls.length
  + ' found: ' + decls.join(' / ') + '), a seeded default is invisible at '
  + 'runtime because his dial overwrites it, so it has to be caught here',
  decls.length === 1 && /var DEED_WEIGHT\s*=\s*\{\s*\}/.test(decls[0]));

/* ---- 2. THE INSTRUMENT EXISTS, IN A TAB ----------------------------------- */
ok('A4 the DIRECT tab has a STANDING mode', /dirChip\('STANDING'/.test(alpha));
ok('A5 every act is named in PLAIN WORDS, not by its kind string',
  /You turn an outfit down to their face/.test(alpha)
  && /You throw in with an outfit/.test(alpha));
ok('A6 it EXPORTS as canon a lane can land', /DEED_WEIGHT\) ===/.test(alpha)
  || /STANDING: WHAT A DEED IS WORTH/.test(alpha));
/* THE READOUT IS NOT A SECOND COPY OF THE RUNGS. The alpha cannot read the city's
   module (file:// frames are opaque origin), and the tempting repair was to
   retype rungFor and HEARSAY_LOSS up there. It asks instead. */
ok('A7 the consequence is ASKED of the shipped module, never retyped in the alpha',
  /BOHEMIA_STANDING_ASK/.test(alpha) && /BOHEMIA_STANDING_ASK/.test(city));
ok('A8 and the alpha holds no copy of the rung table or the hearsay penalty',
  !/RUNGS\s*=\s*\[\['HOSTILE'/.test(alpha) && !/HEARSAY_LOSS\s*=\s*0\./.test(alpha));

(async () => {
  console.log('CITY DIAL GATE, he can set what a deed is worth himself');
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const errs = [];
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on('pageerror', e => errs.push(e.message.slice(0, 140)));
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForSelector('#front', { timeout: 40000 });
    await page.click('#front', { timeout: 120000 });
    await SETTLE(page, 1200);
    await page.click('.tab[data-p="run"]', { timeout: 120000 });
    await SETTLE(page, 20000);
    const fr = await (await page.$('#cityFrame')).contentFrame();
    ok('B1 the RUN tab shows the city frame', !!fr);
    if (!fr) return;

    /* THE TABLE IS EMPTY BEFORE HE RULES, ON THE REAL SURFACE. */
    const before = await fr.evaluate(() => {
      render();
      const W = { p: { id: '__GDL__' }, at: [hx + 1, hy] };
      BARK_DREW.length = 0; BARK_DREW.push(W);
      ctDeed('claim:refused', 'notable');
      return { rows: Object.keys(BohemiaStanding.DEED_WEIGHT).length,
               opinion: ctOpinionOf('__GDL__'),
               watched: ((CT_MINDS['__GDL__'] || {}).deeds || []).length };
    });
    ok('B2 somebody watched the deed', before.watched === 1);
    ok('B3 and forms NO opinion of it, because he has not ruled ('
      + before.rows + ' rows), printing NEUTRAL here would be a judgement he '
      + 'never made', before.rows === 0 && before.opinion === null);

    /* HE TURNS THE DIAL, THROUGH THE REAL CONTROL. */
    await page.click('.tab[data-p="direct"]', { timeout: 120000 });
    await SETTLE(page, 1500);
    const chips = await page.evaluate(() => {
      const b = [...document.querySelectorAll('#dirMode button')];
      const s = b.filter(x => x.textContent === 'STANDING')[0];
      if (s) s.click();
      return b.map(x => x.textContent);
    });
    ok('B4 STANDING sits beside CUTSCENES and QUESTS (' + chips.join('/') + ')',
      chips.indexOf('STANDING') >= 0);
    await SETTLE(page, 1200);

    const dial = await page.evaluate(() => {
      const rows = [...document.getElementById('dirDial')
        .querySelectorAll(':scope > div')].slice(1);
      return { rows: rows.length,
               firstText: rows[0] ? rows[0].textContent : '' };
    });
    ok('B5 every deed the city records has a row he can turn (' + dial.rows + ')',
      dial.rows >= 4);

    /* PRESS IT. This is the whole point: a real press on a real control. */
    await page.evaluate(() => {
      const rows = [...document.getElementById('dirDial')
        .querySelectorAll(':scope > div')].slice(1);
      [...rows[0].querySelectorAll('button')]
        .filter(b => b.textContent === '-3')[0].click();
    });
    await SETTLE(page, 1500);

    const after = await page.evaluate(() => ({
      readout: [...document.getElementById('dirDial')
        .querySelectorAll(':scope > div')][1].textContent,
      note: document.getElementById('dirNote').textContent,
      stored: !!localStorage.getItem('boh.direct.deedweight')
    }));
    ok('B6 the readout names the CONSEQUENCE in plain words, watched vs heard ("'
      + String(after.readout).slice(-70) + '")',
      /WATCHED/.test(after.readout) && /HEARD/.test(after.readout));
    ok('B7 and it says the city is live on it ("' + after.note + '")',
      /using these right now/.test(after.note));
    ok('B8 his ruling KEEPS (stored on the device)', after.stored === true);

    /* AND IT CROSSED THE FRAME AND CHANGED WHAT SOMEBODY THINKS. */
    const now = await fr.evaluate(() => ({
      table: BohemiaStanding.DEED_WEIGHT,
      rows: Object.keys(BohemiaStanding.DEED_WEIGHT).length,
      opinion: ctOpinionOf('__GDL__'),
      persisted: !!localStorage.getItem('boh.city.deedweight')
    }));
    ok('B9 IT CROSSED THE FRAME: the city is using his number ('
      + JSON.stringify(now.table) + ')',
      now.rows === 1 && now.table['claim:refused'] === -3);
    ok('B10 and the person who WATCHED it now thinks something of him ('
      + JSON.stringify(now.opinion) + '), opinionOf and the rungs lit up with no '
      + 'wiring changed', !!now.opinion && now.opinion.value === -3
      && typeof now.opinion.rung === 'string');
    ok('B11 the city keeps it too, so a reload without the alpha still has it',
      now.persisted === true);

    /* TAKING IT BACK IS HALF OF A DIAL. */
    const undone = await page.evaluate(() => {
      const rows = [...document.getElementById('dirDial')
        .querySelectorAll(':scope > div')].slice(1);
      [...rows[0].querySelectorAll('button')]
        .filter(b => b.textContent === 'NOT RULED')[0].click();
      return true;
    });
    await SETTLE(page, 1200);
    const cleared = await fr.evaluate(() => ({
      rows: Object.keys(BohemiaStanding.DEED_WEIGHT).length,
      opinion: ctOpinionOf('__GDL__')
    }));
    ok('B12 HE CAN TAKE IT BACK: clearing the row clears the opinion with it',
      undone === true && cleared.rows === 0 && cleared.opinion === null);

    await fr.evaluate(() => { delete CT_MINDS['__GDL__']; BARK_DREW.length = 0; });
    ok('B13 no page errors' + (errs.length ? ': ' + errs[0] : ''), errs.length === 0);
  } finally {
    await browser.close();
  }
  console.log('CITY DIAL GATE: ' + pass + ' passed, ' + fail.length + ' failed');
  process.exit(fail.length ? 1 : 0);
})();
