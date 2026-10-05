/* THROUGH THE TITLE (RUN 10/4, [the start screen], rule 66).
   The demo now opens on a title (NEW GAME / CONTINUE / SETTINGS) that sits in front of the loading door.
   A check that measures the door the way a stranger meets it has to do what a stranger now does first:
   press NEW GAME, with a real touch, and then meet the door exactly as before. This is that one step,
   shared, so no check grows its own copy of it.
     const { throughTheTitle } = require('../tools/bohemia_through_the_title.js');
     await throughTheTitle(page);          // after page.goto, before touching the door
   Returns true when it pressed NEW GAME, false when there was no title (an older build, or the title
   skipped after a NEW GAME reload). Never throws. */
'use strict';
async function throughTheTitle(page, ms) {
  /* a slow phone (the checks throttle the CPU four times) can take most of a minute to build the page, so this
     waits for the title until the page has finished loading, and only then decides there is none */
  const until = Date.now() + (ms || 300000);
  while (Date.now() < until) {
    const p = await page.evaluate(() => {
      const t = document.getElementById('title');
      if (window.BOH_TITLE && window.BOH_TITLE.skipped) return { none: true };
      /* right after a navigation starts, the old blank page still answers -- with the game's address and
         'complete' (measured) -- so only a page that has the game's own door, finished loading, may say there
         is no title */
      if (!t) return document.getElementById('front') && document.readyState === 'complete' && window.BOH_TITLE === undefined ? { none: true } : null;
      if (t.classList.contains('gone')) return { none: true };
      const b = t.querySelector('.bm-start [data-k=new]') || t.querySelector('[data-k=new]'); if (!b) return null;
      const r = b.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || getComputedStyle(b.parentElement).visibility === 'hidden') return null;
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }).catch(() => null);
    if (p && p.none) return false;
    if (p) { await page.touchscreen.tap(p.x, p.y).catch(async () => { await page.mouse.click(p.x, p.y).catch(() => {}); });
      /* a press is only a press if the title went away; on a slow phone it can take a moment to answer */
      for (let i = 0; i < 20; i++) { await page.waitForTimeout(150);
        const gone = await page.evaluate(() => { const t = document.getElementById('title'); return !t || t.classList.contains('gone'); }).catch(() => false);
        if (gone) return true; }
      continue; }
    await page.waitForTimeout(150);
  }
  return false;
}
/* the way a returning player comes back now: CONTINUE on the title, when it is up and has a save to offer.
   Returns true when it pressed it. */
async function continueThroughTitle(page) {
  const p = await page.evaluate(() => {
    const t = document.getElementById('title'); if (!t || t.classList.contains('gone')) return null;
    const b = t.querySelector('.bm-start [data-k=continue]') || t.querySelector('[data-k=cont]'); if (!b || b.classList.contains('off') || b.disabled) return null;
    const r = b.getBoundingClientRect(); return r.width > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null;
  }).catch(() => null);
  if (!p) return false;
  await page.touchscreen.tap(p.x, p.y).catch(async () => { await page.mouse.click(p.x, p.y).catch(() => {}); });
  return true;
}
/* what the door offers a returning player, wherever it says it now: the title's CONTINUE line (its day and
   clock, as 'CONTINUE · DAY N · HH:MM') while the title is up, else the door's own button */
function doorLineInPage() {
  const t = document.getElementById('title');
  if (t && !t.classList.contains('gone')) { const c = t.querySelector('.bm-start [data-k=continue]') || t.querySelector('[data-k=cont]');
    if (c && !c.classList.contains('off') && !c.disabled) return 'CONTINUE · ' + (c.querySelector('i') || c.querySelector('span')).textContent.split(' · ').slice(0, 2).join(' · '); }
  return (document.getElementById('fronttap') || {}).textContent;
}
module.exports = { throughTheTitle, continueThroughTitle, doorLineInPage };
