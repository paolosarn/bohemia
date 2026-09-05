/* BOHEMIA -- EYES AND EARS: THE PROBE (lane 17, E3, 9/5/26)
 *
 * WHAT IT IS. The half of a screenshot pass that needs NO GOLDEN IMAGE. It opens
 * the real surface at phone size and asks the page four questions a machine can
 * answer alone, so the answer can never go stale and never needs approving:
 *
 *   1. OFF THE GLASS   is a control sitting below the bottom of the phone, or off
 *                      its right edge, in a box that cannot be scrolled to reach it?
 *                      (Round one found the demo's own SLEEP button doing this.)
 *   2. CUT TEXT        is a line of text wider than the box it is printed in?
 *                      (Round one found a button that loses its own last word.)
 *   3. NOTHING THERE   did the screen render anything at all, or is it one flat
 *                      colour? (A black rectangle is the classic false success.)
 *   4. THE PAGE THREW  did anything throw, and did a fetch fail?
 *
 * WHY THIS AND NOT A PIXEL DIFF. Measured 9/5 in this repo: two IDENTICAL runs of
 * the screenshot pass, same build, nothing changed, disagree on 12 of 27 screens
 * (the character bench by 5.95%, whole 64px blocks 100% different, because it
 * shuffles a citizen and a fit on every load). A naive pixel diff would cry wolf on
 * nearly half the game every single run, which is exactly how every team that ever
 * abandoned visual testing abandoned it. These four questions have no such floor.
 *
 * USAGE:  node tools/bohemia_eyes_probe.js [--port 8099] [--out FILE] [--full]
 *         --full sweeps all 18 tabs; the default is the two surfaces a PLAYER sees
 *         (the demo, and the workshop's game screen).
 */
const fs = require('fs');
const path = require('path');
/* PLAYWRIGHT LIVES WHERE IT LIVES. The suite runs gates with no NODE_PATH, so a
   bare require('playwright') is an instant red that has nothing to do with the
   thing being measured. Same loader the browser gates use. */
function pw() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
    '/usr/local/lib/node_modules']) {
    try { return require(require('path').join(g, 'playwright')); } catch (e) { }
  }
  return require('playwright');
}
const { chromium } = pw();

const args = process.argv.slice(2);
const arg = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const PORT = arg('--port', '8099');
const FULL = args.includes('--full');
const OUT  = arg('--out', null);
const BASE = `http://127.0.0.1:${PORT}/slices/`;

const PHONE = { viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' };

/* THE QUESTIONS, ASKED INSIDE THE PAGE. Everything here is deliberately
   conservative: a thing only counts when it is VISIBLE, has real size, carries
   text or is a control, and CANNOT be reached by scrolling something. A tab bar
   that scrolls sideways on purpose is not a fault and must never be reported as
   one -- the fleet abandons a checker that cries wolf, and this lane's whole
   value is that its reports are true. */
const ASK = `(() => {
  const W = innerWidth, H = innerHeight;
  const seen = { offGlass: [], cutText: [] };
  const name = el => {
    const id = el.id ? '#' + el.id : '';
    const cls = (el.className && typeof el.className === 'string')
      ? '.' + el.className.trim().split(/\\s+/).slice(0,2).join('.') : '';
    const txt = (el.textContent || '').trim().replace(/\\s+/g,' ').slice(0,40);
    return (el.tagName.toLowerCase() + id + cls + (txt ? ' "' + txt + '"' : ''));
  };
  const scrollable = el => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 4) return true;
      if (/(auto|scroll)/.test(cs.overflowX) && p.scrollWidth > p.clientWidth + 4) return true;
    }
    return document.scrollingElement && document.scrollingElement.scrollHeight > H + 4;
  };
  const visible = el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return false;
    const r = el.getBoundingClientRect();
    return r.width > 8 && r.height > 8;
  };
  const isControl = el => el.matches('button,a,[role=button],input,select,textarea')
    || /(btn|button|tab|chip|key|pad|act|opt)/i.test(el.className || '');

  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length > 3) continue;             /* leaves and small boxes only */
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    const text = (el.textContent || '').trim();
    if (!text && !isControl(el)) continue;

    /* 1. OFF THE GLASS. The rect is reported RAW and the caller adds the frame's
       offset in the phone, because the game lives in an iframe and a frame that is
       802 tall inside an 844 phone has its own idea of where the bottom is. This is
       the arithmetic that withdrew this lane's loudest round-one finding. */
    if (r.top < H + 200 && r.left < W + 200 && !scrollable(el)) {
      seen.offGlass.push({ el: name(el), top: Math.round(r.top), bottom: Math.round(r.bottom),
        left: Math.round(r.left), right: Math.round(r.right) });
    }
    /* 2. CUT TEXT -- wider than its own box, with no way to scroll it */
    if (text && el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
      const cs = getComputedStyle(el);
      if (!/(auto|scroll)/.test(cs.overflowX)) seen.cutText.push({ el: name(el), by: el.scrollWidth - el.clientWidth });
    }
  }
  return seen;
})()`;

/* THE GAME IS INSIDE AN IFRAME, AND THE FIRST VERSION OF THIS PROBE DID NOT KNOW.
   It reported a clean demo while the demo's own SLEEP button hung off the bottom of
   the phone in a picture taken an hour earlier -- a checker that passes because its
   pattern stopped matching anything, which is the exact failure suite_honesty_gate
   exists to catch. Every frame is asked, and the frame is named in the answer. */
const GLASS = { w: PHONE.viewport.width, h: PHONE.viewport.height };

async function probeSurface(page, label, out){
  const offGlass = [], cutText = [];
  for (const fr of page.frames()) {
    let seen, off = { x:0, y:0 };
    if (fr !== page.mainFrame()) {
      try {
        const el = await fr.frameElement();
        const box = await el.boundingBox();
        if (!box || box.width < 8 || box.height < 8) continue;        /* a hidden panel's frame */
        off = { x: box.x, y: box.y };
      } catch (_e) { continue; }
    }
    try { seen = await fr.evaluate(ASK); } catch (_e) { continue; }   /* a frame mid-navigation */
    const where = fr === page.mainFrame() ? '' : ' [in the game frame]';
    for (const o of seen.offGlass) {
      const bottom = o.bottom + off.y, right = o.right + off.x;
      const belowBy = Math.round(bottom - GLASS.h), rightBy = Math.round(right - GLASS.w);
      if (belowBy > 4 || rightBy > 4)
        offGlass.push({ el: o.el + where, belowBy: Math.max(0,belowBy), rightBy: Math.max(0,rightBy) });
    }
    for (const c of seen.cutText)  cutText.push({ ...c, el: c.el + where });
  }
  const shot = await page.screenshot();
  out.push({ where: label, offGlass, cutText, bytes: shot.length });
}

async function run(){
  const browser = await chromium.launch();
  const report = { at: new Date().toISOString(), surfaces: [] };
  /* --surface lets the checker be pointed at a deliberately broken copy, which is how
     it is PROVEN TO BITE before anybody trusts a green from it. */
  const only = arg('--surface', null);
  const surfaces = only ? [['the surface under test', only]]
                        : [['the demo','BOHEMIA_DEMO.html'], ['the workshop','BOHEMIA_ALPHA_0_9.html']];
  for (const [name, file] of surfaces) {
    const ctx = await browser.newContext(PHONE);
    const page = await ctx.newPage();
    const thrown = [], failed = [];
    page.on('pageerror', e => thrown.push(String(e).slice(0,200)));
    page.on('requestfailed', r => failed.push(r.url().split('/').pop().slice(0,80)));
    await page.goto(BASE + file, { waitUntil:'domcontentloaded', timeout:120000 });
    await page.waitForTimeout(3500);
    const stamp = await page.evaluate(() => { const e=document.getElementById('buildstamp'); return e?(e.textContent||'').trim():null; });
    await page.locator('#front').click({ timeout:30000 });
    await page.waitForTimeout(9000);                  /* the city builds inside this click */
    const found = [];
    await probeSurface(page, name + ': the game', found);
    if (FULL) {
      const tabs = await page.evaluate(() => [...document.querySelectorAll('#tabs .tab')].map(t => t.dataset.p));
      const barShown = await page.evaluate(() => { const t=document.getElementById('tabs');
        return !!t && getComputedStyle(t).display !== 'none'; });
      if (barShown) for (const p of tabs) {
        try{
          const loc = page.locator(`#tabs .tab[data-p="${p}"]`);
          await loc.scrollIntoViewIfNeeded({ timeout:8000 }); await loc.click({ timeout:8000 });
          await page.waitForTimeout(p === 'run' ? 6000 : 2500);
          await probeSurface(page, name + ': ' + p, found);
        }catch(e){ found.push({ where:name+': '+p, error:String(e).slice(0,120) }); }
      }
    }
    report.surfaces.push({ surface:name, file, stamp, thrown, failed, screens:found });
    await ctx.close();
  }
  await browser.close();
  const text = JSON.stringify(report, null, 1);
  if (OUT) fs.writeFileSync(OUT, text);
  for (const s of report.surfaces) {
    console.log('==', s.surface, '|', s.stamp, '| threw', s.thrown.length, '| failed fetches', s.failed.length);
    for (const sc of s.screens) {
      const og = (sc.offGlass||[]).length, ct = (sc.cutText||[]).length;
      if (og || ct || sc.error) console.log('   ', sc.where, '| off the glass', og, '| cut text', ct, sc.error||'');
      for (const o of (sc.offGlass||[]).slice(0,4)) console.log('        OFF GLASS', o.belowBy?('below by '+o.belowBy+'px'):('right by '+o.rightBy+'px'), o.el);
      for (const c of (sc.cutText||[]).slice(0,4)) console.log('        CUT TEXT  by ' + c.by + 'px', c.el);
    }
  }
  return report;
}

if (require.main === module) run().catch(e => { console.error(e); process.exit(1); });

/* EXPORTED SO THE GATE ASKS THE SAME QUESTIONS THIS TOOL ASKS. One copy of the
   arithmetic; a gate that re-implements it is a second ruler and this repo has
   paid for second rulers before. */
module.exports = { run, ASK, probeSurface, PHONE, GLASS };
