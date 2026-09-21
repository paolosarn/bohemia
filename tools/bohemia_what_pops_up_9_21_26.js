/* ============================================================================
   WHAT POPS UP WHEN THE DEMO STARTS (9/21/26, RUN lane, VAMILY [no pop ups])

   PAOLO 9/20, TWICE IN A ROW: "I start the demo and a bunch of shit pops up on the
   screen. What the fuck is that?" and, on the second frame of the game, the SNATCHER
   road card: "you don't got quests like that for real... it can't just be these
   bullshit-ass text prompts."

   MEASURE FIRST, NAME EVERY ONE. Every card in this game goes through ONE function,
   cardShow, so this wraps that one function on the live page and records every card
   that opens in five minutes of walking that HE DID NOT TAP FOR: when it opened, what
   it said, and the stack that opened it, so the list is callers and not a feeling.

   It touches nothing. It is an instrument, and rule 14(g) says a lane measures on the
   glass with the one driver before it reports anything.

   node tools/bohemia_what_pops_up_9_21_26.js [--minutes 5]
   ========================================================================== */
'use strict';
const path = require('path');
const drive = require(path.join(__dirname, 'bohemia_drive_the_demo.js'));

const argv = process.argv.slice(2);
const MIN = (() => { const i = argv.indexOf('--minutes'); return i < 0 ? 5 : +argv[i + 1]; })();

(async () => {
  const d = await drive.open({ keepCards: true });
  const fr = d.fr;

  /* WRAP THE ONE CHOKE POINT, before a single card opens. Everything in the game
     that puts a panel over the world calls this. */
  await fr.evaluate(() => {
    window.__POPS = [];
    const t0 = Date.now();
    const real = window.cardShow;
    window.cardShow = function (html, onTap) {
      let who = '';
      try { throw new Error('x'); } catch (e) { who = String(e.stack || ''); }
      const txt = String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      window.__POPS.push({
        at: Date.now() - t0,
        text: txt.slice(0, 120),
        /* the first frame of the stack that is not this wrapper IS the caller */
        by: who.split('\n').slice(2, 5).map(s => s.trim().replace(/\s*\(.*$/, '')).join(' < ')
      });
      return real.apply(this, arguments);
    };
    return true;
  });

  const openNow = () => fr.evaluate(() => {
    const c = document.getElementById('daycard');
    if (!c || !c.classList.contains('on')) return null;
    return (c.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 110);
  });

  console.log('THE FIRST FRAME, before any press: ' + JSON.stringify(await openNow()));

  /* HE WALKS. One direction held, the way a stranger does, for five minutes. */
  const fEl = await d.page.$('iframe#cityFrame');
  const fb = fEl ? await fEl.boundingBox() : { x: 0, y: 0 };
  const w = await fr.evaluate(() => {
    const pad = document.getElementById('pad');
    const g = pad && pad.querySelectorAll('.pb')[2];   /* east */
    const a = g && (g.querySelector('.parr') || g);
    if (!a) return null;
    const r = a.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  const until = Date.now() + MIN * 60000;
  let presses = 0;
  while (Date.now() < until) {
    if (w) {
      const pts = [{ x: fb.x + w.x, y: fb.y + w.y, id: 1 }];
      await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts });
      await d.page.waitForTimeout(90);
      await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      presses++;
    }
    await d.page.waitForTimeout(400);
  }

  const pops = await fr.evaluate(() => window.__POPS);
  console.log('\n' + MIN + ' MINUTES FROM THE DOOR, ' + presses
    + ' presses east, NOTHING TAPPED BUT THE PAD');
  console.log('CARDS THAT OPENED BY THEMSELVES: ' + pops.length + '\n');
  const byCaller = {};
  for (const p of pops) {
    console.log('  ' + (p.at / 1000).toFixed(1).padStart(6) + 's  ' + p.text);
    console.log('          opened by: ' + p.by);
    byCaller[p.by] = (byCaller[p.by] || 0) + 1;
  }
  console.log('\nBY CALLER:');
  for (const k of Object.keys(byCaller).sort((a, b) => byCaller[b] - byCaller[a]))
    console.log('  ' + String(byCaller[k]).padStart(3) + '  ' + k);
  console.log('\nSTILL OPEN AT THE END: ' + JSON.stringify(await openNow()));
  console.log('page errors: ' + d.errs.length + (d.errs.length ? ' ' + d.errs.slice(0, 2).join(' | ') : ''));
  await d.close();
})();
