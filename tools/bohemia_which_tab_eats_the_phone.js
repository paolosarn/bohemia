/* BOHEMIA — WHICH TAB EATS THE PHONE (8/20/26, RUN lane, P0-SUITE red sweep)
 *
 * CANVAS MEMORY went red with three claims that are NOT ruler bugs, unlike most
 * of what this sweep turned up. The shipped alpha peaks at 1,155 MB resident --
 * 516% of the 224 MB iOS Safari floor the mobile render contract pins. The
 * ratchets it blew through were set on 7/27, when the same measurement, with
 * every tab open, read ~93 MB. Twelve times bigger in three weeks.
 *
 * THE HEADLINE NUMBER IS TRUE AND IT IS ALSO NOT THE WHOLE STORY, which is
 * exactly why this exists rather than a line in a handoff saying "it is big":
 *
 *     ALPHA loaded              25.8 MB   <- what he opens
 *     ALPHA every tab opened  1073.8 MB   <- after visiting all sixteen
 *     RUN   after 480 steps     36.1 MB   <- what he PLAYS
 *
 * So the game as played is fine and the JUDGE SURFACES are what spend the
 * budget. That distinction decides whether this is a demo blocker or a tooling
 * bill, and nobody could tell from one aggregate number. "The alpha uses a
 * gigabyte" is unactionable; "this tab costs 300 MB and nothing frees it" is a
 * fix.
 *
 * SO IT OPENS ONE TAB AT A TIME AND PRICES EACH ONE: the delta in canvas bytes,
 * decoded image bytes and image count as that tab and only that tab is opened,
 * plus what survives after every tab has been opened and re-visited -- because a
 * tab that costs 200 MB and gives it back is a different animal from one that
 * costs 200 MB forever, and section 8 is a law about the second kind.
 *
 * IT CHANGES NOTHING AND FIXES NOTHING. It measures, so that whoever owns each
 * tab is handed a number for their own surface instead of a shared alarm nobody
 * can act on. Per the sweep law: a red with an owner gets fixed or gets a
 * written line, and a written line is worth more with the arithmetic attached.
 *
 * HONESTY CLAUSE, carried from the probe it borrows its method from: THIS IS A
 * HEADLESS DESKTOP CHROMIUM MEASUREMENT, not an iPhone. Backing-store bytes are
 * the same arithmetic anywhere, so those transfer; heap and compositor copies do
 * not.
 *
 * REUSE CHECK: cooks no graphic pixels and opens no bank. It reuses the counting
 * method of tools/bohemia_canvas_memory_probe.js (canvas registry installed via
 * addInitScript before the page's first line, decoded <img> bytes at
 * naturalW*naturalH*4) and drives the already shipped slices/BOHEMIA_ALPHA_0_9.html.
 *
 *   node tools/bohemia_which_tab_eats_the_phone.js
 *     -> records/target/BOHEMIA_TAB_MEMORY_BILL.json  (+ prints the table)
 */
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(ROOT, 'records', 'target', 'BOHEMIA_TAB_MEMORY_BILL.json');

/* same resolver every other browser tool in this repo uses -- playwright lives
   in the container's global node_modules, not the repo's */
function pw() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

/* THE REGISTRY GOES IN BEFORE THE PAGE'S FIRST LINE, and it holds WeakRefs, so a
   canvas the app has genuinely released stops counting. That is the whole point:
   a working cache shows up as a number that STOPS CLIMBING. */
const INIT = `(() => {
  const reg = [];
  self.__bohCanvases = reg;
  const push = c => { try { reg.push(new WeakRef(c)); } catch (e) {} };
  const origCreate = Document.prototype.createElement;
  Document.prototype.createElement = function (t, o) {
    const el = origCreate.call(this, t, o);
    if (String(t).toLowerCase() === 'canvas') push(el);
    return el;
  };
  if (self.OffscreenCanvas) {
    const OC = self.OffscreenCanvas;
    self.OffscreenCanvas = function (w, h) { const c = new OC(w, h); push(c); return c; };
    self.OffscreenCanvas.prototype = OC.prototype;
  }
})()`;

const COUNT = `(() => {
  let cBytes = 0, cN = 0;
  const seen = new Set();
  const add = c => {
    if (!c || seen.has(c)) return;
    seen.add(c);
    const w = c.width | 0, h = c.height | 0;
    if (w > 0 && h > 0) { cBytes += w * h * 4; cN++; }
  };
  for (const r of (self.__bohCanvases || [])) { try { add(r.deref()); } catch (e) {} }
  for (const c of document.querySelectorAll('canvas')) add(c);
  let iBytes = 0, iN = 0;
  for (const im of document.querySelectorAll('img')) {
    const w = im.naturalWidth | 0, h = im.naturalHeight | 0;
    if (w > 0 && h > 0) { iBytes += w * h * 4; iN++; }
  }
  return { cBytes, cN, iBytes, iN };
})()`;

const MB = b => b / 1048576;

/* EVERY FRAME, NOT JUST THE MAIN ONE. The alpha carries its heaviest modules as
   embedded iframes -- the whole walked city is one -- so a main-frame-only
   reading reports the biggest surface in the game as holding nothing. That was a
   real bug in the first version of the probe this borrows from. */
async function total(page) {
  const out = { cBytes: 0, cN: 0, iBytes: 0, iN: 0, frames: 0 };
  for (const fr of page.frames()) {
    let r = null;
    try { r = await fr.evaluate(COUNT); } catch (e) { continue; }
    if (!r) continue;
    out.cBytes += r.cBytes; out.cN += r.cN;
    out.iBytes += r.iBytes; out.iN += r.iN;
    out.frames++;
  }
  return out;
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ args: ['--no-sandbox', '--js-flags=--expose-gc'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(INIT);
  const p = await ctx.newPage();
  const rows = [];
  try {
    await p.goto(ALPHA, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(3500);
    /* the front splash covers every tab; a click that lands on it opens nothing,
       which is how an earlier probe reported the whole build as 0.8 MB */
    try { await p.click('#front', { timeout: 5000 }); await p.waitForTimeout(1500); } catch (e) { }

    const base = await total(p);
    /* node's console.log does %s/%d/%f and NOT %7.1f -- width and precision are
       a C thing, and the first run of this printed its own format strings. */
    const f = (n, w) => n.toFixed(1).padStart(w);
    console.log('  LOADED (before any tab)      ' + f(MB(base.cBytes + base.iBytes), 7)
      + ' MB pixels  (' + base.cN + ' canvases, ' + base.iN + ' images)');

    const tabs = await p.evaluate(() =>
      Array.prototype.map.call(document.querySelectorAll('#tabs .tab'), t => t.dataset.p));
    console.log('  ' + tabs.length + ' tabs: ' + tabs.join(' ') + '\n');
    console.log('  TAB           CANVAS Δ    IMAGE Δ    IMAGES Δ     RUNNING');
    console.log('  ' + '-'.repeat(62));

    let prev = base;
    for (const t of tabs) {
      /* dispatched, not tapped: one tab sits under the toolbar's own scroll and
         a real pointer never reaches it. The app's handler is the same either
         way, and a tab this cannot open is a tab it cannot price. */
      const opened = await p.evaluate((tab) => {
        const el = document.querySelector('#tabs .tab[data-p="' + tab + '"]');
        if (!el) return false;
        el.click();
        return true;
      }, t);
      /* A TOOL THROWS, IT DOES NOT SHRUG (ONE WORLD TAB, and I broke my own rule
         in the same session I swept eleven files for it). A tab this cannot open
         is a tab it cannot price, and carrying on would quietly publish a bill
         that is missing a line while looking complete -- which is the whole
         silence-reads-as-green disease in miniature. */
      if (!opened) throw new Error('tab "' + t + '" was listed in #tabs and could '
        + 'not be opened -- the bill would be missing a line and look complete');
      await p.waitForTimeout(1400);
      const now = await total(p);
      const row = {
        tab: t,
        canvasDeltaMB: +(MB(now.cBytes - prev.cBytes)).toFixed(1),
        imageDeltaMB: +(MB(now.iBytes - prev.iBytes)).toFixed(1),
        imagesDelta: now.iN - prev.iN,
        runningMB: +(MB(now.cBytes + now.iBytes)).toFixed(1),
      };
      rows.push(row);
      console.log('  ' + t.padEnd(12) + f(row.canvasDeltaMB, 8) + ' MB'
        + f(row.imageDeltaMB, 9) + ' MB' + String(row.imagesDelta).padStart(9)
        + f(row.runningMB, 10) + ' MB');
      prev = now;
    }

    /* AND WHAT SURVIVES. A tab that costs 200 MB and gives it back is a
       different animal from one that costs 200 MB forever, and section 8 is a
       law about the second kind. Go back to the tab he actually plays, force a
       collection, and see what is still held. */
    /* `if (el) el.click()` was the shape here, which ONE WORLD TAB exists to
       kill: a tab that moved makes it a NO-OP and the tool carries on against
       whatever surface happens to be showing. "What is still held after going
       back to the game" is meaningless if we never went back to the game. */
    const backOnRun = await p.evaluate(() => {
      const el = document.querySelector('#tabs .tab[data-p="run"]');
      if (!el) return false;
      el.click();
      return true;
    });
    if (!backOnRun) throw new Error('could not return to the RUN tab, so "what is '
      + 'still held after leaving the judge sheets" would be measured somewhere else');
    await p.waitForTimeout(2500);
    for (let i = 0; i < 3; i++) {
      try { await p.evaluate(() => { if (typeof gc === 'function') gc(); }); } catch (e) { }
      await p.waitForTimeout(600);
    }
    const after = await total(p);
    const peak = Math.max(...rows.map(r => r.runningMB), MB(base.cBytes + base.iBytes));
    console.log('  ' + '-'.repeat(62));
    console.log('  BACK ON RUN, AFTER GC        ' + f(MB(after.cBytes + after.iBytes), 7)
      + ' MB pixels  (' + after.cN + ' canvases, ' + after.iN + ' images)');
    console.log('  PEAK' + f(peak, 8) + ' MB   ->   HELD' + f(MB(after.cBytes + after.iBytes), 8)
      + ' MB   (released ' + (peak - MB(after.cBytes + after.iBytes)).toFixed(1) + ' MB)');

    fs.writeFileSync(OUT, JSON.stringify({
      HONESTY: 'HEADLESS DESKTOP CHROMIUM, not an iPhone. Backing-store bytes are '
        + 'the same arithmetic on any device and transfer; heap and compositor '
        + 'copies do not.',
      what: 'per-tab price of the alpha in canvas + decoded image bytes, opened one '
        + 'at a time, plus what is still held after returning to RUN and forcing a '
        + 'collection',
      ios_floor_mb: 224,
      loadedMB: +(MB(base.cBytes + base.iBytes)).toFixed(1),
      peakMB: +peak.toFixed(1),
      heldAfterReturnMB: +(MB(after.cBytes + after.iBytes)).toFixed(1),
      tabs: rows,
    }, null, 2) + '\n');
    console.log('\n  -> ' + path.relative(ROOT, OUT));
  } finally { await b.close(); }
})().catch(e => { console.log('TAB MEMORY BILL FAILED: ' + e.message); process.exit(1); });
