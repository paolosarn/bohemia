/* ============================================================================
   EVERY TAP ON EVERY CARD (9/21/26, RUN lane, VAMILY [no pop ups] second half)

   PAOLO 9/21, THE THIRD TIME: "I told you what's up with all these fucked up quest
   cards that don't do anything when I click on them."

   The first half of this row killed the cards that open by themselves. This is the
   other half, and it is a different question: of the cards he can still REACH, does
   every row on them DO something when he presses it?

   RULE 14(h), WHICH IS WHY A NAIVE VERSION OF THIS MEASURES NOTHING: "IN THIS GAME A
   DEAD BUTTON IS INDISTINGUISHABLE FROM A CLOSE BUTTON, because a card closes on any
   tap it does not recognise and a screen diff reads the vanished card as life." So
   every press here is judged on THREE outcomes and never on "something changed":

       MOVED    the card is still open and its own words changed   -> alive
       CLOSED   the card went away                                 -> alive only if
                                                                      that row is a
                                                                      close/leave row
       NOTHING  the card is open and identical                     -> DEAD

   It opens each card the way he does, presses every row with a real touch at the
   row's own measured centre, reopens the card between presses, and prints the verdict
   per row.

   node tools/bohemia_every_tap_on_every_card_9_21_26.js
   ========================================================================== */
'use strict';
const path = require('path');
const drive = require(path.join(__dirname, 'bohemia_drive_the_demo.js'));

/* the cards he can reach, and how he reaches them */
const CARDS = [
  { name: 'MARKET',   open: 'showMarket' },
  { name: 'STANDING', open: 'showStanding' },
  { name: 'FEEDBACK', open: 'fbShow' },
  { name: 'ENDING',   open: 'showEnding' }
];

/* *** ONE PAGE PER CARD, AND THAT IS THE WHOLE REASON THIS TOOL CAN BE TRUSTED. ***
   The first cut tested all four cards in one page and reported the ENDING's close
   DEAD. Run on its own, in its own page, the same touch closed it on the first try.
   PROVED BOTH WAYS: all four cards together -> DEAD; the ending alone -> CLOSED, and
   an isolated probe showed the click landing on the right element with the right
   data-act. The ten feedback presses before it were leaving something behind.
   A card is not isolated by rebuilding the card. It is isolated by a fresh page, so
   each card gets one. Four boots is the price of a verdict that does not accuse a
   working control, and rule 14(g)'s "the instrument that reproduces cleanly is the
   witness" is only worth anything if the instrument is built to reproduce cleanly. */
async function runCard(card, report) {
  const d = await drive.open({});
  const fr = d.fr;
  const fEl = await d.page.$('iframe#cityFrame');
  const fb = fEl ? await fEl.boundingBox() : { x: 0, y: 0 };

  const openCard = (fn) => fr.evaluate((f) => {
    try { document.getElementById('daycard').classList.remove('on'); } catch (e) { }
    try { window[f](); } catch (e) { return String(e.message).slice(0, 80); }
    const c = document.getElementById('daycard');
    return (c && c.classList.contains('on')) ? null : 'did not open';
  }, fn);

  /* every pressable row on the open card, by what it SAYS and where it IS */
  const rows = () => fr.evaluate(() => {
    const c = document.getElementById('daycard');
    if (!c || !c.classList.contains('on')) return [];
    return Array.from(c.querySelectorAll('[data-act]')).map(el => {
      const r = el.getBoundingClientRect();
      return { act: el.dataset.act,
               text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
               x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height };
    }).filter(r => r.w > 6 && r.h > 6);
  });

  /* *** WORDS ARE NOT THE ONLY WAY A CARD ANSWERS, AND THE FIRST CUT OF THIS TOOL
     GOT THAT WRONG. *** It compared textContent and reported all nine feedback
     answers dead. A thumb on a vote row answers by GOING LIT -- a class, not a
     sentence -- so a text-only diff calls a working control dead, which is the same
     class of lie rule 14(h) is about, pointing the other way. It reads the card's
     whole MARKUP now: words, classes and attributes together. */
  const cardText = () => fr.evaluate(() => {
    const c = document.getElementById('daycard');
    if (!c || !c.classList.contains('on')) return null;          /* null = closed */
    const inn = document.getElementById('daycardIn');
    return { words: (inn.textContent || '').replace(/\s+/g, ' ').trim(),
             markup: inn.innerHTML.replace(/\s+/g, ' ') };
  });

  const tap = async (r) => {
    const pts = [{ x: fb.x + r.x, y: fb.y + r.y, id: 1 }];
    await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts });
    await d.page.waitForTimeout(80);
    await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await d.page.waitForTimeout(700);
  };

  {
    const err = await openCard(card.open);
    if (err) { console.log('\n' + card.name + ': ' + err); await d.close(); return; }
    const list = await rows();
    console.log('\n' + card.name + ' -- ' + list.length + ' pressable row(s)');
    for (let i = 0; i < list.length; i++) {
      /* *** AND THE STATE IS RESET BETWEEN PRESSES, NOT JUST THE CARD. ***
         The first cut of this reopened the card and left everything else alone, and
         it reported the ENDING's close DEAD. An isolated probe closed it with the
         same touch, first try, and the click landed on the right element with the
         right data-act -- so the tool was carrying state from the ten feedback
         presses before it. Rule 14(g): when two instruments disagree, the one that
         reproduces cleanly is the witness, and a tool that lies about a working
         control is worse than no tool. Each press now starts from a card built with
         nothing left over. */
      await fr.evaluate(() => { try { cardHide(); } catch (e) { }
                                try { window.__CARD_ESC_STATE = null; } catch (e) { } });
      await d.page.waitForTimeout(200);
      if (await openCard(card.open)) break;             /* fresh card for each press */
      const fresh = await rows();
      const r = fresh[i]; if (!r) continue;
      const before = await cardText();
      await tap(r);
      const after = await cardText();
      report.total++;
      const closer = /close|leave|keep moving|sleep|get up/i.test(r.act + ' ' + r.text);
      let verdict;
      if (after === null) verdict = closer ? 'CLOSED (and it is a close row)' : 'CLOSED (nothing else)';
      else if (before && after.words !== before.words) verdict = 'MOVED (its words changed)';
      else if (before && after.markup !== before.markup) verdict = 'MOVED (it lit up)';
      else verdict = '*** NOTHING ***';
      /* *** A DEAD VERDICT HAS TO SURVIVE A CLEAN RETRY BEFORE IT IS PRINTED. ***
         This tool called the ENDING's close dead and an isolated probe closed it with
         the same touch on the first try -- the click landed on the right element with
         the right data-act. The tool was wrong, not the game, and a tool that accuses
         a working control is worse than no tool at all. Rule 14(g) already says which
         instrument wins when two disagree: the one that reproduces cleanly. So that
         rule is MECHANICAL here. A NOTHING is retried from a page-state reset, and
         only a NOTHING that happens twice is reported. */
      if (verdict === '*** NOTHING ***') {
        await fr.evaluate(() => { try { cardHide(); } catch (e) { } });
        await d.page.waitForTimeout(600);
        if (!(await openCard(card.open))) {
          const again = (await rows())[i];
          if (again) {
            const b2 = await cardText();
            await tap(again);
            const a2 = await cardText();
            if (a2 === null) verdict = closer ? 'CLOSED (and it is a close row, on a clean retry)'
                                              : 'CLOSED (nothing else)';
            else if (b2 && a2.words !== b2.words) verdict = 'MOVED (its words changed, on a clean retry)';
            else if (b2 && a2.markup !== b2.markup) verdict = 'MOVED (it lit up, on a clean retry)';
          }
        }
        if (verdict !== '*** NOTHING ***')
          console.log('      (the first read of this row was contaminated; the clean retry is the witness)');
      }
      if (verdict.indexOf('MOVED') !== 0 && verdict.indexOf('CLOSED (and') !== 0) {
        report.dead++; report.deadRows.push(card.name + ' / ' + (r.text || r.act));
      } else report.alive++;
      console.log('   ' + String(r.act).padEnd(14) + ' "' + r.text + '"  -> ' + verdict);
    }
  }
  report.errs += d.errs.length;
  await d.close();
}

(async () => {
  const report = { dead: 0, alive: 0, total: 0, errs: 0, deadRows: [] };
  for (const card of CARDS) await runCard(card, report);
  console.log('\nROWS PRESSED: ' + report.total + '   ALIVE: ' + report.alive
    + '   DEAD: ' + report.dead);
  if (report.deadRows.length) console.log('DEAD: ' + report.deadRows.join(' | '));
  console.log('page errors: ' + report.errs);
})();
