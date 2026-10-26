/* THE CREW IS PRESSED ON THE PHONE (RUN TWO 10/26, after UI TWO 52741663: rules 238(a), 286(b), every press in his corner, no button twice).
   With the phone up the bar's crew chip is a readout and the phone's CREW is the press; a gate that opens the crew screen the way he
   does asks here for the ONE CREW on screen, in the top page's pixels: the phone's when it is up, else the bar's crew tag over the
   map's frame, else null (the caller falls back to the town's own #crew). Nothing here presses anything the player could not. */
'use strict';

async function crewAt(page, fr) {
  const ph = await page.evaluate(() => {
    const b = document.querySelector('#bohphone.on .bprow .app[data-app=crew]'); if (!b) return null;
    const r = b.getBoundingClientRect();
    return r.width > 0 && getComputedStyle(b).display !== 'none' ? { x: r.x + r.width / 2, y: r.y + r.height / 2, who: 'phone' } : null;
  }).catch(() => null);
  if (ph) return ph;
  if (!fr) return null;
  const bar = await fr.evaluate(() => { const e = document.querySelector('[data-tb="crew"]'); if (!e) return null; const q = e.getBoundingClientRect(); return q.width > 0 && q.height > 0 ? { x: q.x + q.width / 2, y: q.y + q.height / 2 } : null; }).catch(() => null);
  if (!bar) return null;
  const fb = await (await fr.frameElement()).boundingBox();
  return { x: fb.x + bar.x, y: fb.y + bar.y, who: 'bar' };
}

/* presses the one CREW (a finger, or the mouse with opts.mouse); answers who drew it, or null when none is on screen */
async function openCrew(page, fr, opts) {
  opts = opts || {};
  const b = await crewAt(page, fr); if (!b) return null;
  if (opts.mouse) await page.mouse.click(b.x, b.y); else await page.touchscreen.tap(b.x, b.y);
  await page.waitForTimeout(700);
  return b.who;
}

module.exports = { crewAt, openCrew };
