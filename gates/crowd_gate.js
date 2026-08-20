const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
// BOHEMIA — THE CROWD GATE (7/31/26). FACTORY LAW: new machinery, own gate,
// same turn.
//
// personlook_gate.js proves the FUNCTION is right: same id, same person, order
// proof, dials only, no sex term, canon garments only. It proves all of that
// with zero pixels involved. This gate proves the OTHER half, the half that
// actually failed twice this session:
//
//   VERIFY ON THE REAL SURFACE (7/18). A look that never reaches the canvas is
//   not a look. SHUFFLE FIT passed every headless check ever written for it and
//   changed nothing on screen, because the probes called buildFrame directly --
//   a side door around HD_CACHE -- while the surface he taps goes through
//   drawChar. So every assertion below reads PIXELS OFF THE LIVE CANVASES in
//   the real page, after the real boot, in the real tab.
//
// WHAT IT HOLDS:
//   IT DRAWS        twelve canvases, twelve non-empty bodies.
//   THEY DIFFER     a crowd of identical twins is the exact failure this whole
//                   feature exists to end, and it is also what a cache-key bug
//                   looks like from the outside. Distinct signatures, counted.
//   HE IS GIVEN     the board borrows G.bodyVar / G_WORN / G.equipped to draw
//   BACK            each citizen. If it ever forgets to put them back, Paolo's
//                   own character silently becomes a stranger. Asserted before
//                   and after, plus his portrait canvas is compared pixel-wise.
//   DETERMINISM ON  same page redrawn = same pixels. Determinism proved in the
//   THE CANVAS      function means nothing if the render path adds dice.
//   NO SIDE DOOR    the renderer must call drawChar, never buildFrame.
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const src = fs.readFileSync(ALPHA, 'utf8');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== CROWD GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

/* ---- static: no side door ---------------------------------------------- */
/* CAPTURE FROM THE COMMENT OPENER, not from the title inside it. Both matter and
   both failed on the first run. (1) CODE, NOT COMMENTS: the renderer's header
   says "Never buildFrame", and a naive search found the word and called it a
   violation -- same shape as the person-look gate's first run against its own
   header. Documenting a rule is not breaking it. (2) The first fix still failed,
   because a block that STARTS mid-comment has no opening slash-star for the
   stripper to find, so the header survived the strip and kept tripping the same
   check. A comment stripper is only correct on a whole comment. */
const block = (src.match(/\/\* --- THE CROWD: BOH_PERSONLOOK[\s\S]*?\n  \}\)\(\);/) || [''])[0];
const code = block.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
ok('the crowd renderer is in the alpha', block.length > 400);
ok('it draws through drawChar (the real path, cache and all)', /drawChar\(cv,\s*G\.dir/.test(code));
ok('it NEVER calls buildFrame (that is the side door SHUFFLE FIT fell through)',
  !/buildFrame/.test(code));
ok('it holds no garment names of its own (REUSE-FIRST: the pool is his)',
  !/'[A-Z][A-Z ]{4,}'/.test(code));
ok('it restores his look in a finally block (an exception must not strand him as a stranger)',
  /finally\s*\{[\s\S]{0,200}G\.bodyVar\s*=\s*keepVar/.test(block));

/* ---- the real surface --------------------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2200);
  ok('the alpha loads with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  if (errs.length) { await b.close(); done(); }

  await pg.evaluate(() => { const fr = document.getElementById('front'); if (fr) fr.click(); });
  await SETTLE(pg, 400);
  await pg.evaluate(() => { const t = [...document.querySelectorAll('.tab')].find(x => x.dataset.p === 'char'); if (!t) throw new Error('the tab this gate measures is not reachable: a missing tab is a FAILURE, not a skip (ONE WORLD TAB, 8/2)'); t.click(); });
  await SETTLE(pg, 1600);

  /* one shared helper: read a canvas as a compact signature + ink count */
  const READ = `(cv) => { const x = cv.getContext('2d');
      const d = x.getImageData(0,0,cv.width,cv.height).data;
      let ink = 0, h = 2166136261>>>0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i+3] > 8) { ink++;
          h ^= d[i]; h = Math.imul(h,16777619)>>>0;
          h ^= d[i+1]; h = Math.imul(h,16777619)>>>0;
          h ^= d[i+2]; h = Math.imul(h,16777619)>>>0;
          h ^= (i/4); h = Math.imul(h,16777619)>>>0; } }
      return { ink, sig: h.toString(36) }; }`;

  const r1 = await pg.evaluate((READ) => {
    const read = eval(READ);
    const host = document.getElementById('crowdBoard');
    if (!host) return { n: 0 };
    window.crowdRefresh();
    const cells = [...host.querySelectorAll('canvas')].map(read);
    /* THE HEAD, MEASURED SEPARATELY -- because the whole-body signature was 12/12
       distinct while every single citizen wore the identical face, haircut and
       skin. Bodies and clothes differ enough to mask it, and I read that as "the
       repo needs new hair art" when the truth was that NPCFactory has varied skin
       tone and hair colour since 7/2 and the board was bypassing it. A metric that
       averages over the whole sprite cannot see a region that never changes. */
    const heads = [...host.querySelectorAll('canvas')].map(cv => {
      const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
      let h = 2166136261 >>> 0; const W = cv.width, rows = Math.round(cv.height * 0.30);
      for (let y = 0; y < rows; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4; if (d[i + 3] < 8) continue;
        h ^= d[i]; h = Math.imul(h, 16777619) >>> 0;
        h ^= d[i + 1]; h = Math.imul(h, 16777619) >>> 0;
        h ^= d[i + 2]; h = Math.imul(h, 16777619) >>> 0;
      }
      return h.toString(36);
    });
    return {
      n: cells.length,
      empty: cells.filter(c => c.ink < 40).length,
      minInk: Math.min(...cells.map(c => c.ink)),
      sigs: new Set(cells.map(c => c.sig)).size,
      heads: new Set(heads).size,
      stat: (document.getElementById('crowdStat') || {}).textContent || '',
    };
  }, READ);

  ok(`the board renders a full crowd (${r1.n} canvases)`, r1.n === 12);
  ok(`every citizen actually has a body on the canvas (${r1.empty} blank, thinnest ${r1.minInk} px)`,
    r1.n === 12 && r1.empty === 0 && r1.minInk > 200);
  ok(`no two people look the same (${r1.sigs}/12 distinct)`, r1.sigs >= 11);
  ok(`and no two people share a HEAD (${r1.heads}/12 distinct heads)`, r1.heads >= 11);
  ok('the board reports what it drew (' + r1.stat.slice(0, 60) + ')', /people/.test(r1.stat));

  /* WAIT FOR THE FIRST PAINT TO FINISH BEFORE JUDGING DETERMINISM (fixed 8/20).
     The board paints twelve citizens synchronously off a setTimeout, and this check
     read the canvases, called crowdRefresh() and compared. If the first paint was
     still in flight the "before" snapshot was a HALF-DRAWN BOARD, and the refresh
     that followed finished it -- which is not dice in the render path, it is a
     stopwatch started too early. It went from rare to frequent the day the rig
     doubled, because a 112 frame is four times the work: measured, twelve citizens
     redrawn four times in a row are byte-identical every time once the board has
     actually settled. So settle on the BOARD, not on a clock. */
  await pg.waitForFunction(() => {
    const h = document.getElementById('crowdBoard'); if (!h) return false;
    const cs = [...h.querySelectorAll('canvas')]; if (cs.length !== 12) return false;
    const sig = cs.map(c => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 8) n++; return n; }).join(',');
    const was = window.__crowdSettleSig; window.__crowdSettleSig = sig;
    return was === sig && cs.every(c => c.width > 0);
  }, { timeout: 20000, polling: 250 }).catch(() => {});

  /* DETERMINISM, on the canvas: same page, redrawn, identical pixels. */
  const r2 = await pg.evaluate((READ) => {
    const read = eval(READ);
    const host = document.getElementById('crowdBoard');
    const before = [...host.querySelectorAll('canvas')].map(c => read(c).sig).join(',');
    window.crowdRefresh();
    const after = [...host.querySelectorAll('canvas')].map(c => read(c).sig).join(',');
    return { same: before === after };
  }, READ);
  ok('redrawing the same crowd gives byte-identical pixels (no dice in the render path)', r2.same);

  /* NEW CROWD walks to strangers, not to a reshuffle of the same twelve. */
  const r3 = await pg.evaluate((READ) => {
    const read = eval(READ);
    const host = document.getElementById('crowdBoard');
    const a = [...host.querySelectorAll('canvas')].map(c => read(c).sig);
    document.getElementById('crowdNew').click();
    const c2 = [...host.querySelectorAll('canvas')].map(c => read(c).sig);
    const shared = c2.filter(s => a.indexOf(s) >= 0).length;
    return { shared, distinct: new Set(c2).size };
  }, READ);
  ok(`NEW CROWD brings new people (${r3.shared}/12 repeat from the last page)`, r3.shared <= 3);
  ok(`the second page is a crowd too (${r3.distinct}/12 distinct)`, r3.distinct >= 11);

  /* HE IS GIVEN BACK: the board borrows his look. Prove it hands it over. */
  const r4 = await pg.evaluate((READ) => {
    const read = eval(READ);
    const key = () => JSON.stringify([G.bodyVar, window.G_WORN, G.equipped]);
    const cv = document.getElementById('charCv');
    G.bodyVar = { height: 0.3, belly: -0.2, arms: 0.1, shoulders: 0, armLength: 0, hips: 0 };
    window.G_WORN = {};
    drawChar(cv, G.dir, 'idle', 0);
    const beforeLook = key(), beforePix = read(cv).sig;
    window.crowdRefresh();
    drawChar(cv, G.dir, 'idle', 0);
    return { look: beforeLook === key(), pix: beforePix === read(cv).sig };
  }, READ);
  ok('drawing the crowd leaves his own look exactly as it was', r4.look);
  ok('and his own character canvas repaints identically afterwards', r4.pix);

  await b.close();
  done();
})();
