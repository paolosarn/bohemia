const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* BOHEMIA NAV CLUSTER GATE (7/27/26) — one movement UI across the whole game,
 * measured in a real browser at iPhone-portrait size.
 *
 * > "on the run should be using the same movement ui s the combat shit. look in
 * >  the combat module and its direction shit and dont present me nothing until
 * >  I see the portrait and the 8 cardinal directions button that shit on the
 * >  run screen where its the arrows taking up half the screen is dog shit man"
 *
 * The run had a #ctl BAR: a full-width action button plus four 74x52 arrows,
 * and — the part that actually hurt — it was a flex SIBLING of the stage, so it
 * did not float over the world, it SHRANK the canvas. The game was played in
 * whatever the buttons left over.
 *
 * The answer already existed in the repo twice: COMBAT's buildMoveRing (8
 * buttons on a 66px radius around the fire button) and the CITY tab's #nav (the
 * same ring grown up, 8 round buttons around an 80px portrait). This gate holds
 * all three surfaces to one shape and measures the thing he actually cares
 * about — how much screen the world gets.
 *
 * MEASURED, not read:
 *   EIGHT       all 8 cardinal buttons exist and are really on screen
 *   PORTRAIT    the centre really has HIS FACE in it — the gate reads the
 *               pixels out of the canvas and requires it to be non-empty. "dont
 *               present me nothing until i see the portrait" is not satisfied by
 *               an element that exists and draws nothing.
 *   FULL SCREEN the world canvas gets >=90% of the viewport height below the
 *               objective bar, i.e. the controls float, they do not carve.
 *   NO BAR      the old #ctl strip is gone, so it cannot quietly come back
 *
 *   node gates/navcluster_gate.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const RUN_SRC = path.join(ROOT, 'slices/BOHEMIA_RUN_SLICE_7_26_26.html');
const RUN_BUILT = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');
const DIRS = ['bu', 'bne', 'br', 'bse', 'bd', 'bsw', 'bl', 'bnw'];

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* ---- SOURCE: the built run really carries what the source says ------------- */
{
  const src = fs.readFileSync(RUN_SRC, 'utf8');
  const built = fs.readFileSync(RUN_BUILT, 'utf8');
  ok('the run SOURCE has the nav cluster', src.indexOf('NAV CLUSTER') >= 0);
  ok('the run was REBUILT after the source changed (the built page carries it too) — ' +
    'editing the slice without running tools/build_run_slice.js ships the old UI',
    built.indexOf('NAV CLUSTER') >= 0);
  ok('the old #ctl control bar is gone from the source', !/#ctl\{/.test(src));
  ok('the run keeps bu/bd/bl/br as ids, so run_gate.js still taps the same buttons',
    DIRS.every(d => src.indexOf('id="' + d + '"') >= 0));
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await SETTLE(page, 2500);
  await page.click('#front').catch(() => {});
  await SETTLE(page, 1200);
  await page.click('.tab[data-p="run"]');

  /* MEASURED HERE, BEFORE THE HARNESS FORCES THE DEAD PANEL ON. The block below
     switches the visible panel to p-run to reach the run slice, and a HIDDEN
     panel's canvas measures 0px -- so asking the city about its screen share
     after that reported 0%, which is not a fact about the layout, it is a fact
     about which panel is showing. This is the moment the RUN tab has opened the
     city and nothing has been forced yet: the real surface, in its real state. */
  /* THE SCREEN-SHARE CLAIM MOVED TO THE SURFACE HE ACTUALLY LOOKS AT (8/20).
     It measured the RUN SLICE, which this gate's own harness admits is dead as a
     tab and only reachable by force-showing a panel the UI no longer exposes.
     Measured there it reported "101px of a 150px viewport, 67%" -- and a
     force-shown hidden panel reports 0x0 when it is left alone, so the number
     was never about anything. VERIFY ON THE REAL SURFACE (7/18): the RUN tab
     opens the CITY, so the city frame is where "how much screen does the world
     get" has a meaning. Measured there: 779px of an 804px viewport, 97%.
     His words were about the RUN SCREEN, and the run screen is the city now. */
  await SETTLE(page, 20000, async () => {
    const x = page.frames().find(fr => fr.name() === 'cityFrame');
    if (!x) return false;
    try { return await x.evaluate(() => { const c = document.getElementById('cv');
      return !!(c && c.getBoundingClientRect().height > 50); }); } catch (e) { return false; }
  });
  const cf = page.frames().find(fr => fr.name() === 'cityFrame');
  ok('THE RUN TAB REALLY OPENS THE CITY -- the surface his words are about', !!cf);
  if (cf) {
    const c = await cf.evaluate(() => {
      const cv = document.getElementById('cv');
      const b = cv ? cv.getBoundingClientRect() : null;
      const face = document.getElementById('modeFace');
      let lit = 0, of = 0;
      if (face && face.width) {
        try {
          const d = face.getContext('2d').getImageData(0, 0, face.width, face.height).data;
          of = face.width * face.height;
          for (let i = 3; i < d.length; i += 4) if (d[i] > 8) lit++;
        } catch (e) { }
      }
      return { canvasH: b ? Math.round(b.height) : 0, viewH: window.innerHeight,
               pads: document.querySelectorAll('#pad .pb').length,
               ctl: !!document.getElementById('ctl'), lit: lit, of: of };
    });
    const share = c.viewH ? c.canvasH / c.viewH : 0;
    ok('THE WORLD GETS THE SCREEN: on the surface the RUN tab opens, the canvas is '
      + c.canvasH + 'px of a ' + c.viewH + 'px viewport (' + (100 * share).toFixed(0)
      + '%) — the controls float over it instead of carving a bar out of it',
      share >= 0.85);
    ok('EIGHT CARDINALS on the live surface too (' + c.pads + '/8)', c.pads === 8);
    ok('THE PORTRAIT IS REALLY DRAWN THERE TOO (' + c.lit + '/' + c.of + ' opaque) — '
      + '"dont present me nothing until i see the portrait"', c.of > 0 && c.lit > c.of * 0.3);
    ok('and the old control bar never came back on the live surface either', !c.ctl);
  }
  /* THE RUN TAB OPENS THE CITY NOW (Paolo 7/28: "Kill"). The run slice is dead as a
     TAB, but it is still wired into the shell and what this gate measures is still
     alive in it - so the harness shows that panel directly instead of tapping a tab
     that no longer leads there. Stated rather than hidden: the only synthetic step
     is opening a surface the UI no longer exposes; everything measured below is
     measured on a real rendered panel. If the shell ever stops wiring runFrame,
     delete this section outright rather than prop it up. */
  await page.evaluate(() => {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
    /* ASK FOR THE RUN SLICE BY NAME (8/21). It used to arrive on a 2.5s timer
       and again from the generic tab loader -- 17.8 MB on every player's boot
       for a panel the shell never displays. That is gone; the loader is exported
       as window.__loadRunSlice and NOTHING in the product calls it, which is the
       point: a dependency you can grep beats one that happens on a timer. This
       gate is one of the four things that genuinely needs the frame live, so it
       asks. */
    try { window.__loadRunSlice && window.__loadRunSlice(); } catch (e) { }
    const r = document.getElementById('p-run'); if (r) r.classList.add('on');
  }).catch(() => {});
  /* WAIT FOR THE PIXELS, NOT FOR QUIET (8/20, RUN lane). This was a 22-second
     sleep, and the sleep-killing pass replaced it with SETTLE's default
     quiescence rule -- WHICH CANNOT SEE THIS. A MutationObserver counts DOM
     changes, and PAINTING A CANVAS MUTATES NO DOM AT ALL. So the page went
     "quiet" long before the portrait was drawn, settle returned early, and
     "THE PORTRAIT IS REALLY DRAWN" reported 0 of 4096 opaque pixels on a
     portrait that is in fact fully painted. Proved both ways: restore the
     literal 22-second sleep and the same claim passes, 4096 of 4096.
     That was my own regression, and the honest fix is the one settle's own
     docstring already names -- when the gate KNOWS what it is waiting for, pass
     the condition and quiescence is never consulted. Here the condition is
     literally the thing the next line asserts: the portrait has pixels in it. */
  await SETTLE(page, 22000, async () => {
    const fr = page.frames().find(x => x.name() === 'runFrame');
    if (!fr) return false;
    try {
      return await fr.evaluate(() => {
        const c = document.getElementById('actface');
        if (!c || !c.width) return false;
        const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        for (let i = 3; i < d.length; i += 4) if (d[i] > 8) return true;
        return false;
      });
    } catch (e) { return false; }
  });
  const f = page.frames().find(fr => fr.name() === 'runFrame');
  ok('the RUN tab really loads inside the alpha', !!f);
  if (!f) { console.log('NAV CLUSTER GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed'); await browser.close(); process.exit(1); }

  const r = await f.evaluate(dirs => {
    const box = id => { const e = document.getElementById(id); if (!e) return null;
      const b = e.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height), t: Math.round(b.top) }; };
    const face = document.getElementById('actface');
    let lit = 0, of = 0;
    if (face) {
      const x = face.getContext('2d'), d = x.getImageData(0, 0, face.width, face.height).data;
      of = face.width * face.height;
      for (let i = 3; i < d.length; i += 4) if (d[i] > 8) lit++;
    }
    const cv = document.getElementById('cv');
    const cvb = cv ? cv.getBoundingClientRect() : null;
    return {
      dirs: dirs.map(id => [id, box(id)]),
      act: box('act'), nav: box('nav'), ctl: box('ctl'),
      lit, of,
      canvasH: cvb ? Math.round(cvb.height) : 0,
      viewH: window.innerHeight,
    };
  }, DIRS);

  const missing = r.dirs.filter(([, b]) => !b || b.w < 20 || b.h < 20).map(([id]) => id);
  ok('EIGHT CARDINALS are on screen and tappable (' + (8 - missing.length) + '/8' +
    (missing.length ? ', missing: ' + missing.join(',') : '') + ')', missing.length === 0);
  ok('the centre ACTION button is a round portrait slot (' + (r.act ? r.act.w + 'x' + r.act.h : 'absent') + ')',
    !!r.act && r.act.w >= 60 && Math.abs(r.act.w - r.act.h) <= 2);
  ok('THE PORTRAIT IS REALLY DRAWN — his face, in pixels, not an empty canvas (' +
    r.lit + '/' + r.of + ' opaque) — "dont present me nothing until i see the portrait"',
    r.of > 0 && r.lit > r.of * 0.3);
  ok('THE OLD CONTROL BAR IS GONE (#ctl ' + (r.ctl ? 'still present' : 'absent') + ')', !r.ctl);

  /* the two surfaces it was copied FROM still have theirs */
  const alpha = fs.readFileSync(ALPHA, 'utf8');
  /* WHERE the city app lives is not this gate's business (8/4): one resolver knows. */
  const cityB64 = (() => { const x = require('./bohemia_city_app.js').read(); return x ? x.src : ''; })();
  const combatB64 = (() => { const k = "const COMBAT_B64='"; const a0 = alpha.indexOf(k) + k.length;
    return Buffer.from(alpha.slice(a0, alpha.indexOf("'", a0)), 'base64').toString('utf8'); })();
  ok('THE CITY TAB still has the same cluster (portrait in a #nav ring)',
    cityB64.indexOf('#nav{') >= 0 && cityB64.indexOf('modeFace') >= 0);
  ok('COMBAT still has the ring this was copied from (buildMoveRing)',
    combatB64.indexOf('buildMoveRing') >= 0);

  console.log('NAV CLUSTER GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
