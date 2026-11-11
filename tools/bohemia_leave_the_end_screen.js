/* THE END SCREEN'S LEAVE, PRESSED THE WAY A THUMB PRESSES IT (FIXES 2, 11/11, ask row 565).
   MEASURED on the demo, the phone upright (three fights, then two more traced every 40 ms): the end screen's page says it is
   'opened' 1.0 to 1.7 s BEFORE its frame is on the glass (the fight's last blow is seen first, the screen comes in after). In that
   time its LEAVE measures at 550,893 and 394,837 on a 390 x 844 glass: off the glass, nothing under the point. A gate that read
   LEAVE's box the moment the page said 'opened' and pressed there pressed nothing, the fight's page stayed, and its next fight
   re-read the last one (THE HEAL BUTTON H4, H4b, H5; STRUCK DOWN). No thumb can press a button that is not on the glass yet.
   So: wait until LEAVE is on the glass, the top thing at its own middle (asked of the page he is looking at), and still (the same
   spot twice, 120 ms apart); then one press, a finger's or a mouse's. Nothing here presses what he could not.
     const { leaveTheEndScreen } = require('../tools/bohemia_leave_the_end_screen.js');
     const r = await leaveTheEndScreen(page, { mouse: false });     // { pressed, waited, at } or { pressed:false, why }
*/
'use strict';
async function leaveAt(page) {
  const sf = page.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
  if (!sf) return { why: 'no end screen' };
  const open = await sf.evaluate(() => !!(window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened)).catch(() => false);
  if (!open) return { why: 'the end screen has not opened' };
  const fe = await sf.frameElement().catch(() => null), box = fe ? await fe.boundingBox().catch(() => null) : null;
  if (!box) return { why: 'the end screen\'s frame is not drawn' };
  const b = await sf.evaluate(() => { const e = document.getElementById('leave'); if (!e) return null; const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    const cx = r.x + r.width / 2, cy = r.y + r.height / 2, t = document.elementFromPoint(cx, cy);
    return { cx, cy, w: r.width, shown: s.display !== 'none' && s.visibility !== 'hidden' && !e.disabled && r.width > 4, top: !!t && (t === e || e.contains(t)) }; }).catch(() => null);
  if (!b || !b.shown) return { why: 'LEAVE is not drawn' };
  if (!b.top) return { why: 'something is over LEAVE inside the end screen' };
  const x = box.x + b.cx, y = box.y + b.cy;
  const vp = page.viewportSize() || { width: 1e9, height: 1e9 };
  if (x < 0 || y < 0 || x > vp.width || y > vp.height) return { why: 'LEAVE is off the glass (' + Math.round(x) + ',' + Math.round(y) + ')' };
  const over = await fe.evaluate((f, p) => { const e = document.elementFromPoint(p[0], p[1]); return e === f ? null : (e ? (e.id || String(e.className) || e.tagName) : 'nothing'); }, [x, y]).catch(() => 'unreadable');
  if (over) return { why: 'the page has ' + over + ' over LEAVE' };
  return { x, y };
}
async function leaveTheEndScreen(page, opts) {
  opts = opts || {};
  const t0 = Date.now(), until = t0 + (opts.ms || 30000);
  let last = null, why = 'never looked';
  while (Date.now() < until) {
    const a = await leaveAt(page);
    if (a.why) { why = a.why; last = null; await page.waitForTimeout(100); continue; }
    if (last && Math.abs(last.x - a.x) < 1 && Math.abs(last.y - a.y) < 1) {
      if (opts.mouse) await page.mouse.click(a.x, a.y); else await page.touchscreen.tap(a.x, a.y);
      return { pressed: true, waited: Date.now() - t0, at: [Math.round(a.x), Math.round(a.y)] };
    }
    last = a; await page.waitForTimeout(120);
  }
  return { pressed: false, waited: Date.now() - t0, why };
}
module.exports = { leaveAt, leaveTheEndScreen };
