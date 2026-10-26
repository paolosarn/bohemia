/* THE FIGHT'S PRESSES ARE ON THE PHONE (UI TWO, rules 238(a), 286(b): every press in his corner, no button twice).
   In the game's fights the phone draws the fight's big button (FIGHT, WALK, SHOOT, HIT, THROW, END TURN), WAIT, RETREAT,
   AUTO and the speed, and carries STRIKE, RELOAD and BACK among the abilities; each presses the fight's own button, and the
   fight's bar copies are off the glass. A gate that presses one the way he does asks here for the ONE on screen, in the top
   page's pixels: the phone's when the phone is up over the fight, else the fight's own (COMBAT's bench, the fight's page on
   its own, builds no phone and keeps its bar). Nothing here presses anything the player could not. */
'use strict';

const CMD = { bend: 'go', bwait: 'wait', bflee: 'flee', bauto: 'auto', bspeed: 'speed' };
const TITLE = { bstrike: 'STRIKE', breload: 'RELOAD', bback: 'BACK' };

async function phoneOn(f) {
  return f.evaluate(() => document.documentElement.classList.contains('boh-phone-on')).catch(() => false);
}

/* the box of the one control for the fight's button id, centre in the top page's pixels, or null */
async function fightAt(page, f, id) {
  if (await phoneOn(f)) {
    const ph = await page.evaluate(([c, t]) => {
      const fi = document.querySelector('#bohphone.on .fight.on'); if (!fi) return null;
      const e = c ? fi.querySelector('[data-c=' + c + ']') : [...fi.querySelectorAll('.ab .sk')].find(b => b.title === t);
      if (!e) return null; const r = e.getBoundingClientRect(), h = r.width > 0 ? document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) : null;
      return r.width > 0 && h && e.contains(h) ? { x: r.x + r.width / 2, y: r.y + r.height / 2, who: 'phone', off: !!e.disabled } : null;   /* on top, where a finger lands */
    }, [CMD[id] || null, TITLE[id] || null]).catch(() => null);
    if (ph) return ph;
  }
  const fe = await f.frameElement().catch(() => null), fb = fe ? await fe.boundingBox() : null;
  const r = await f.evaluate((id) => { const e = document.getElementById(id); if (!e) return null; const r = e.getBoundingClientRect();
    return r.width > 0 && getComputedStyle(e).display !== 'none' ? [r.x + r.width / 2, r.y + r.height / 2, !!e.disabled] : null; }, id).catch(() => null);
  return r && fb ? { x: fb.x + r[0], y: fb.y + r[1], who: 'fight', off: r[2] } : null;
}

/* waits up to opts.ms for the control to be on screen (the phone's fight face comes up after its combat strike, about two
   beats); a finger (or the mouse with opts.mouse) presses it; answers who drew it, or null */
async function fightPress(page, f, id, opts) {
  opts = opts || {};
  const until = Date.now() + (opts.ms == null ? 4000 : opts.ms);
  let b = await fightAt(page, f, id);
  while (!b && Date.now() < until) { await page.waitForTimeout(200); b = await fightAt(page, f, id); }
  if (!b) return null;
  if (opts.mouse) await page.mouse.click(b.x, b.y); else await page.touchscreen.tap(b.x, b.y);
  return b.who;
}

module.exports = { fightAt, fightPress };
