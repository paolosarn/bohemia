/* ============================================================================
   ASKING GATE (8/17/26, PEOPLE lane)

   The overheard-fact log shipped READ-ONLY: eleven true things about this valley
   and no way to do anything with any of them. Q018.W3 THE RUMOR WEB asks for "a
   thread to PULL", and a thread you cannot pull is a list. Now you can ask
   somebody about a subject you overheard, and if their trade knows it, the
   thread goes one step deeper.

   WHAT THIS HOLDS:

   1. SCOPED, NOT COMBINATORIAL. Q047.X1 ASTRONOMICAL WRITING/VO COST tells a
      solo dev to get the EFFECT of reactivity with templated content rather than
      volume, and the research agrees hard: Disco Elysium's four player call
      signs alone cost 428 new dialogue cards. So the shape is 7 subjects x 2
      answers + 4 reusable refusals -- eighteen blocks covering twenty-eight
      person-and-subject combinations. This asserts that shape, because the
      moment somebody "improves" it into one line per person per subject the
      content stops being writable.

   2. MULTIPLE KEYS (Q014.W4). Every subject is answerable by TWO DIFFERENT
      trades, so you are never hunting one specific body. A subject answered by
      one trade is a fetch quest with extra steps.

   3. YOU CAN ONLY ASK ABOUT WHAT YOU HEARD. Q001.P8 rewards the LISTENER, so
      nothing is reachable from a menu. An empty log offers nothing.

   4. IT REACHES THE CARD, AND PRESSING IT DOES SOMETHING. The binding failed
      silently on the first cut -- three buttons drew perfectly and pressing one
      did nothing, because the patch's "already applied?" guard matched a string
      the step above it had just inserted. Everything looked right. So this
      PRESSES THE BUTTON and demands the log actually grow.

   5. IT NEVER POINTS ANYWHERE. Q037.W3: the log IS the map. A refusal may name
      WHO might know (a trade), never WHERE they are.

   6. AND NOTHING RESOLVES. Every deeper fact asks a sharper question. What is up
      the hill, who owns the tank and who is collecting names are CANON and
      Paolo's, and they ship unanswered on purpose. A tool that answered them
      would be writing his world for him.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const fs = require('fs');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  /* ---- A. THE TABLE ------------------------------------------------------ */
  global.window = global;
  const A = require(path.join(ROOT, 'engine/bohemia_asking.js'));
  const X = require(path.join(ROOT, 'engine/bohemia_exchanges.js'));
  const laws = JSON.parse(fs.readFileSync(
    path.join(ROOT, 'records/BOHEMIA_QUESTBOOK_LAW_INDEX.json'), 'utf8')).laws;

  const subs = A.subjects();
  ok('A1 there is something to ask about (' + subs.length + ' subjects, '
    + A.count + ' answers)', subs.length >= 5 && A.count >= 10);

  /* A2: EVERY ASKABLE SUBJECT IS OVERHEARABLE. A menu entry for a thread that
     does not exist in the world is a lie about the world. */
  const heard = new Set(X.EXCHANGES.filter(e => e.leaks).map(e => e.subject));
  const orphan = subs.filter(s => !heard.has(s));
  ok('A2 you can only be asked about what somebody can be overheard saying ('
    + orphan.length + ' orphans)', orphan.length === 0, orphan.join(' '));
  const deadEnd = [...heard].filter(s => subs.indexOf(s) < 0);
  ok('A3 and nothing overhearable is a dead end (' + deadEnd.length + ')',
    deadEnd.length === 0, deadEnd.join(' '));

  /* A4: Q014.W4 MULTIPLE KEYS -- two DIFFERENT trades per subject. */
  const single = subs.filter(s => A.whoKnows(s).length < 2);
  ok('A4 every subject has more than one kind of person who can answer it ('
    + single.length + ' do not)', single.length === 0, single.join(' '));

  /* A5: Q047.X1 -- SCOPED. The authored block count must stay far below the
     combinations it covers, or the content has quietly become a mountain. */
  const trades = Object.keys(A.DEFLECT);
  const combos = subs.length * trades.length;
  const authored = A.count + trades.length;
  ok('A5 it is templated, not combinatorial (' + authored + ' blocks cover '
    + combos + ' combinations)', authored < combos);

  ok('A6 every trade has a refusal, so no combination is silent',
    trades.every(t => typeof A.deflectFor(t) === 'string' && A.deflectFor(t).length > 10));

  /* A7: EVERY ANSWER CITES THE CORPUS, resolved and VERBATIM. */
  const badCite = [];
  for (const r of A.ASKING) {
    if (!r.study || r.study.length < 2) { badCite.push(r.id + ' (<2)'); continue; }
    for (const c of r.study) {
      const e = laws[c.id];
      if (!e) badCite.push(r.id + ' -> ' + c.id + ' unresolved');
      else if (String(e.title).trim() !== String(c.title).trim())
        badCite.push(r.id + ' -> ' + c.id + ' not verbatim');
    }
  }
  ok('A7 every answer cites >=2 findings, verbatim (' + badCite.length + ' bad)',
    badCite.length === 0, badCite.slice(0, 3).join(' | '));

  /* A8: NOTHING RESOLVES AND NOTHING POINTS. */
  const resolved = A.ASKING.filter(r =>
    /\b\d{3,}\b|go to |head to |it is at |waypoint|marker/i.test(r.deeper.implies));
  ok('A8 no answer places a waypoint or settles the question (' + resolved.length + ')',
    resolved.length === 0, resolved.map(r => r.id).join(' '));

  const dashes = A.ASKING.filter(r => /[—–]/.test(r.says + r.deeper.line + r.deeper.implies));
  ok('A9 not one line uses an em or en dash (' + dashes.length + ')', dashes.length === 0);

  /* ---- B. THE CARD ------------------------------------------------------- */
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

  try {
    await page.goto('file://' + ALPHA);
    await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await page.reload();
    await SETTLE(page, 3400);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 500);
    const _runTab = await page.evaluate(() => {
      /* NEVER SWALLOW A MISSING TAB. `if (t) t.click()` reports GREEN when the
               tab is gone -- four gates did exactly that and read green for weeks,
               which is why ONE WORLD TAB forbids the shape. Say so instead. */
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (!t) return false;
      t.click(); return true;
    });
    ok('the RUN tab exists in the alpha and was tapped', _runTab === true);
    await SETTLE(page, 16000);

    let city = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof LANDED !== 'undefined' && typeof askAbout === 'function')) { city = f; break; } }
      catch (_e) {}
    }
    ok('B1 the asking reached the frame the player looks at', !!city);
    if (!city) throw new Error('no city frame');

    await city.evaluate(() => { if (MODE !== 'human') { swapMode(); HC = HZOOM; } render(); });
    await SETTLE(page, 2200);
    const found = await city.evaluate(() => {
      BohemiaPopulation.setDial(20);
      const NB = BohemiaPopulation.NB;
      for (let ny = 0; ny < 24; ny++) for (let nx = 0; nx < 24; nx++) {
        if (BohemiaPopulation.zoneAt(om, POWER, nx * NB, ny * NB, seed) !== 'cluster') continue;
        const ppl = pplPeople(nx, ny);
        if (ppl.length < 5) continue;
        hx = ppl[0].home[0] + 1; hy = ppl[0].home[1] + 1;
        city.x = (nx * NB) | 0; city.y = (ny * NB) | 0;
        render();
        return true;
      }
      return false;
    });
    ok('B2 there is a settlement with somebody to ask', found);
    await SETTLE(page, 2000);

    /* B3: AN EMPTY LOG OFFERS NOTHING. You cannot ask about what you never
       heard, which is the whole reason listening is worth anything. */
    const cold = await city.evaluate(() => {
      ctOpen();
      const c = document.getElementById('ctcard');
      return c.querySelectorAll('.ctaskabout').length;
    });
    ok('B3 with an empty log there is nothing to ask about (' + cold + ' buttons)',
      cold === 0);

    /* B4: overhear three things the real way, and the buttons appear. */
    const offered = await city.evaluate(() => {
      ['rumor-quiet', 'water-hours', 'power-block'].forEach(id => {
        const x = BohemiaExchanges.EXCHANGES.find(e => e.id === id);
        knownHeard(x, x.turns[x.turns.length - 1]);
      });
      ctDraw();
      const c = document.getElementById('ctcard');
      return Array.from(c.querySelectorAll('.ctaskabout'))
        .map(b => b.getAttribute('data-subject'));
    });
    ok('B4 what you overheard becomes what you can ask (' + offered.join(', ') + ')',
      offered.length >= 2);

    /* B5: THREE AT MOST. The RUN lane spent 8/16 taking buttons OFF the surface
       he walks with; a card that grows one per subject is a wall on a phone. */
    const many = await city.evaluate(() => {
      BohemiaExchanges.EXCHANGES.filter(e => e.leaks).forEach(x =>
        knownHeard(x, x.turns[x.turns.length - 1]));
      ctDraw();
      return { known: knownLoad().subjects().length,
               buttons: document.getElementById('ctcard').querySelectorAll('.ctaskabout').length };
    });
    ok('B5 knowing ' + many.known + ' subjects still offers at most three buttons ('
      + many.buttons + ')', many.buttons <= 3 && many.known > 3);

    /* B6: PRESS IT. This is the assertion the first cut would have failed: the
       buttons drew and the handler was never bound. */
    const asked = await city.evaluate(() => {
      const c = document.getElementById('ctcard');
      const btn = c.querySelector('.ctaskabout');
      const subject = btn.getAttribute('data-subject');
      const before = knownLoad().count();
      btn.click();
      return { subject, before, after: knownLoad().count(),
               said: ASK_SAID && ASK_SAID.text, gave: ASK_SAID && ASK_SAID.gave };
    });
    ok('B7 pressing it makes them SAY something (' + String(asked.said).slice(0, 40) + '...)',
      !!asked.said && asked.said.length > 10);
    ok('B8 and if they knew it, the thread goes DEEPER (' + asked.before + ' -> '
      + asked.after + ')', asked.gave ? asked.after === asked.before + 1
        : asked.after === asked.before);

    /* B9: and their reply is ON THE CARD, not just in a variable. */
    const card = await city.evaluate(() => {
      ctDraw();
      return document.getElementById('ctcard').innerText || '';
    });
    ok('B9 the reply is printed on the card he is looking at',
      /THEY SAID/.test(card) && card.indexOf(String(asked.said).slice(0, 24)) >= 0);

    /* B10: ASKING THE SAME PERSON TWICE IS NOT A SECOND ANSWER. */
    const again = await city.evaluate((s) => {
      const c = document.getElementById('ctcard');
      return Array.from(c.querySelectorAll('.ctaskabout'))
        .map(b => b.getAttribute('data-subject')).indexOf(s);
    }, asked.subject);
    ok('B10 that person will not answer the same subject twice', again === -1);

    /* B11: A REFUSAL NAMES A TRADE, NEVER A PLACE. */
    const refusal = await city.evaluate(() => {
      /* find a subject this person's trade cannot answer, and ask it */
      const p = ctAdjacent(); const who = ctPerson(p);
      const trade = who.archetype || who.role;
      const subs = BohemiaAsking.subjects()
        .filter(s => !BohemiaAsking.answerFor(s, trade));
      if (!subs.length) return { skipped: true };
      const before = knownLoad().count();
      askAbout(who, who.key, subs[0]);
      ctDraw();
      return { skipped: false, before, after: knownLoad().count(),
               said: ASK_SAID.text, gave: ASK_SAID.gave,
               card: document.getElementById('ctcard').innerText || '' };
    });
    if (refusal.skipped) {
      ok('B11 (this trade can answer everything, nothing to refuse)', true);
    } else {
      ok('B11 somebody who does not know says so and teaches you nothing ('
        + refusal.before + ' -> ' + refusal.after + ')',
        refusal.gave === false && refusal.after === refusal.before);
      ok('B12 and it points you at a TRADE, never at a place',
        /TRY/.test(refusal.card) && !/\b\d{3,}\b/.test(
          (refusal.card.split('TRY')[1] || '').slice(0, 60)));
    }

    ok('B13 nothing threw while he asked', errs.length === 0, errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('ASKING GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
