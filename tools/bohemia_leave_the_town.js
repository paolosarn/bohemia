/* THE TOWN'S LEAVE IS ON THE PHONE (UI TWO, rules 238(a), 286(b): every press in his corner, no button twice).
   In the game the phone draws LEAVE in the band under PLAY and HEAL while he is in a town, and the town's own #leave is
   not on the glass. A gate that leaves a town the way he does asks here for the ONE LEAVE on screen, in the top page's
   pixels: the phone's when the phone is up, else the town's own (the town's page opened on its own, which builds no
   phone, or a build from before the phone). Nothing here presses anything the player could not. */
'use strict';

async function leaveAt(page, sf) {
  const ph = await page.evaluate(() => {
    const b = document.querySelector('#bohphone.on .bpctx.town .lv'); if (!b) return null;
    const r = b.getBoundingClientRect();
    return r.width > 0 && getComputedStyle(b).display !== 'none' ? { x: r.x + r.width / 2, y: r.y + r.height / 2, who: 'phone' } : null;
  }).catch(() => null);
  if (ph) return ph;
  const lv = sf ? await sf.$('#leave').catch(() => null) : null, bx = lv ? await lv.boundingBox() : null;
  return bx && bx.width > 0 ? { x: bx.x + bx.width / 2, y: bx.y + bx.height / 2, who: 'town' } : null;
}

/* waits up to ms for a LEAVE to be on screen; a finger (or the mouse on a computer) presses it; answers who drew it */
async function leaveTown(page, sf, opts) {
  opts = opts || {};
  const until = Date.now() + (opts.ms || 0);
  let b = await leaveAt(page, sf);
  while (!b && Date.now() < until) { await page.waitForTimeout(250); b = await leaveAt(page, sf); }
  if (!b) return null;
  if (opts.mouse) await page.mouse.click(b.x, b.y); else await page.touchscreen.tap(b.x, b.y);
  return b.who;
}

module.exports = { leaveAt, leaveTown };
