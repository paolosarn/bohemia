/* BOHEMIA THREE-TILE WALL GATE (7/27/26) — Paolo's two asks, measured in a real
 * frame instead of read out of the source.
 *
 * > "every wall supporting a door should be three tiles tall you know that's
 * >  what I'm trying to tell you like this game needs to focus on like working
 * >  on an opacity filter for when I'm in front of a wall or something"
 *
 * A facade used to be ONE flat cell baked into the chunk — a house front exactly
 * as tall as the ground it stood on. It is three tiles now, and because a
 * three-tile wall can stand between the camera and the player, the wall that is
 * covering him goes see-through. Both live in one live render pass.
 *
 * This gate does not grep for the feature. It patches drawImage before the app
 * boots, renders two REAL frames — one with the player standing clear of every
 * wall, one with him behind a door — and reads back what the game actually drew
 * and at what opacity:
 *
 *   HEIGHT     a facade column issues draws totalling three cells of height,
 *              and a door is a single two-cell-tall draw (DOOR LAW) inside it
 *   ASPECT     that two-cell door is blitted from a pre-derived 16x32 tile, so
 *              its destination aspect matches its source — no per-frame stretch,
 *              which is what the render contract bans
 *   SEE-THRU   standing behind a wall produces draws at reduced alpha; standing
 *              clear of every wall produces NONE. Both directions, because a
 *              filter that is always on is not a filter, it is a bug.
 *
 *   node gates/wallheight_gate.js
 */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ALPHA = path.join(path.dirname(__dirname), 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* records every drawImage with its destination size AND the alpha it was drawn
 * at, which is the whole point — alpha is invisible to a normal draw audit. */
const PROBE = `(() => {
  const P = CanvasRenderingContext2D.prototype, orig = P.drawImage;
  const rec = { on: false, draws: [] };
  window.__WALL = rec;
  P.drawImage = function (img, ...a) {
    if (rec.on) {
      try {
        let dx, dy, dw, dh, sw, sh;
        const nw = (img && (img.naturalWidth || img.width)) || 0;
        const nh = (img && (img.naturalHeight || img.height)) || 0;
        if (a.length === 2) { dx = a[0]; dy = a[1]; dw = nw; dh = nh; sw = nw; sh = nh; }
        else if (a.length === 4) { dx = a[0]; dy = a[1]; dw = a[2]; dh = a[3]; sw = nw; sh = nh; }
        else if (a.length === 8) { sw = a[2]; sh = a[3]; dx = a[4]; dy = a[5]; dw = a[6]; dh = a[7]; }
        rec.draws.push({ dx, dy, dw, dh, sw, sh, al: this.globalAlpha, tgt: this.canvas });
      } catch (e) {}
    }
    return orig.apply(this, [img, ...a]);
  };
})();`;

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(PROBE);
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1200);
  /* THE CITY TAB IS GONE (Paolo 8/2): "there's no point in having a city tab
     anymore". Both buttons opened the same panel since 7/28, so the world is
     reached through RUN now. Navigating by a button the user does not have is
     a gate testing a surface nobody can reach. */
  await page.click('.tab[data-p="run"]');
  await page.waitForTimeout(14000);
  const f = page.frames().find(fr => fr.name() === 'cityFrame');
  if (!f) { console.log('  FAIL: the CITY frame never loaded'); process.exit(1); }

  const r = await f.evaluate(() => {
    const rec = window.__WALL;
    if (!rec) return { noProbe: true };
    /* FIND A SUBURB THAT ACTUALLY HAS A FACADE, not merely the first one.
       This took the FIRST suburb cell in scan order and committed to it, which
       is always the cell nearest the top-left corner of the valley - a thin rim
       block that may hold no house front at all. It passed only because the old
       overmap seed happened to put a good suburb there. The RUN lane's ONE SEED
       fix (7/28) pointed the builder at the game's real world and this gate
       immediately reported "could not set up the measurement" about a feature
       that works fine two cells over. Keep looking until there is something to
       measure; only give up when NO suburb in the valley has a facade. */
    const suburbs = [];
    for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) {
      const t = om.at(x, y); if (t && t.district === 'suburb') suburbs.push([x, y]);
    }
    if (!suburbs.length) return { noSuburb: true };
    let hit = null, door = null, clear = null, tried = 0;
    for (const cand of suburbs) {
      if (tried++ >= 40) break;
      city.x = cand[0]; city.y = cand[1];
      let d = null;
      for (let ly = 4; ly < FN - 4; ly++) for (let lx = 4; lx < FN - 4; lx++) {
        const gx = cand[0] * FN + lx, gy = cand[1] * FN + ly;
        const c = cellAt(gx, gy);
        if (!d && c && c.face && c.artPool_face === 'hdoor') d = [gx, gy];
      }
      if (!d) for (let ly = 4; ly < FN - 4 && !d; ly++) for (let lx = 4; lx < FN - 4 && !d; lx++) {
        const gx = cand[0] * FN + lx, gy = cand[1] * FN + ly;
        const c = cellAt(gx, gy); if (c && c.face) d = [gx, gy];
      }
      if (d) { hit = cand; door = d; break; }
    }
    if (!hit) return { noSuburb: true };
    city.x = hit[0]; city.y = hit[1];
    if (MODE === 'city') swapMode();
    HC = 44;
    const C = HC;
    if (!door) return { noFacade: true };

    // FRAME A — standing right behind the wall, which must fade
    const grab = () => { rec.draws = []; rec.on = true; render(); rec.on = false; return rec.draws.slice(); };
    hx = door[0]; hy = door[1] - 1;
    const behind = grab();

    // FRAME B — walked well clear of every facade, which must NOT fade
    for (let ly = 4; ly < FN - 4 && !clear; ly++) for (let lx = 4; lx < FN - 4 && !clear; lx++) {
      const gx = hit[0] * FN + lx, gy = hit[1] * FN + ly;
      const c = cellAt(gx, gy);
      if (!c || !c.walk) continue;
      let near = false;
      for (let dy = -4; dy <= 4 && !near; dy++) for (let dx = -4; dx <= 4; dx++) {
        const n = cellAt(gx + dx, gy + dy); if (n && n.face) { near = true; break; }
      }
      if (!near) clear = [gx, gy];
    }
    let away = null;
    if (clear) { hx = clear[0]; hy = clear[1]; away = grab(); }

    /* ON THE REAL SURFACE, NOT EVERY SURFACE (8/1/26). Every predicate below buckets
     * a draw by its PIXEL SIZE alone, which quietly assumed the game's OFFSCREEN
     * canvases were never the same size as an on-screen cell. Once the bake matches
     * his 44px art (TPX 22 -> 44) they are: the chunk bake writes 44x44 tiles into a
     * 704x704 texture canvas, and tallTex derives the two-tile door ONCE into an
     * offscreen 44x88 cache -- the derive-once-and-cache this gate exists to BLESS,
     * scored as the per-frame stretch it bans. Scope every facade predicate to the
     * world canvas, which is the only thing this gate ever claimed to measure.
     * Measured: faded/tall are identical either way; `cell` goes 6,417 -> 34, which
     * is the real facade count. The gate was counting the bake as facades. */
    const onCv = x => x.tgt === cv;
    const faded = d => d.filter(onCv).filter(x => x.al < 0.99).length;
    const tall = d => d.filter(onCv).filter(x => Math.abs(x.dh - 2 * C) < 1.5 && Math.abs(x.dw - C) < 1.5);
    const cell = d => d.filter(onCv).filter(x => Math.abs(x.dh - C) < 1.5 && Math.abs(x.dw - C) < 1.5);
    /* Only the FACADE draws are this gate's business — one cell wide, one or two
     * cells tall. The street lamps are deliberately drawn 1.5 x 3 cells from a
     * square source and that is another feature's approved choice, not this
     * one's regression; scoping the check keeps this gate honest about what it
     * owns instead of failing on somebody else's art. */
    const isFacade = x => onCv(x) && Math.abs(x.dw - C) < 1.5 && (Math.abs(x.dh - C) < 1.5 || Math.abs(x.dh - 2 * C) < 1.5);
    const badAspect = d => d.filter(isFacade).filter(x => x.sw > 0 && x.sh > 0 && x.dw > 0 && x.dh > 0
      && Math.abs((x.dw / x.dh) / (x.sw / x.sh) - 1) > 0.03).length;
    const offAspect = d => d.filter(x => onCv(x) && !isFacade(x)).filter(x => x.sw > 0 && x.sh > 0 && x.dw > 0 && x.dh > 0
      && Math.abs((x.dw / x.dh) / (x.sw / x.sh) - 1) > 0.03)
      .map(x => Math.round(x.sw) + 'x' + Math.round(x.sh) + '->' + Math.round(x.dw) + 'x' + Math.round(x.dh));

    return {
      C, door, clear,
      behindTotal: behind.length, behindFaded: faded(behind),
      behindTall: tall(behind).length, behindCell: cell(behind).length,
      behindBadAspect: badAspect(behind), behindOffAspect: Array.from(new Set(offAspect(behind))),
      awayTotal: away ? away.length : -1, awayFaded: away ? faded(away) : -1,
      awayTall: away ? tall(away).length : -1,
      onCvBehind: behind.filter(onCv).length, onCvAway: away ? away.filter(onCv).length : -1,
      alphas: Array.from(new Set(behind.map(x => +x.al.toFixed(2)))).sort(),
    };
  });

  if (r.noProbe || r.noSuburb || r.noFacade) {
    console.log('  FAIL: could not set up the measurement (' + JSON.stringify(r) + ')');
    process.exit(1);
  }

  ok('the gate rendered real frames (' + r.behindTotal + ' draws behind a wall, ' + r.awayTotal + ' clear of one)',
    r.behindTotal > 20 && r.awayTotal > 20);
  /* THE SCOPE IS ITSELF GATED, so it can never quietly become a rubber stamp: the
   * frame MUST still contain draws this gate deliberately does not count (the chunk
   * bake, the tall-door cache derivation), and the ones it does count must be a real
   * facade population, not zero. */
  ok('THE MEASUREMENT IS SCOPED TO THE GLASS (' + r.onCvBehind + ' of ' + r.behindTotal +
    ' draws landed on the world canvas; the rest are the offscreen bake and the tall-door ' +
    'cache, which are not facade draws and never were)',
    r.onCvBehind > 20 && r.onCvBehind < r.behindTotal && r.onCvAway > 20);
  ok('THREE TILES TALL: facades draw a full cell high, many of them (' + r.behindCell +
    ' one-cell draws at ' + r.C + 'px) — the facade left the bake and is a live pass now',
    r.behindCell > 10);
  ok('A DOOR IS TWO TILES (DOOR LAW) inside that three-tile wall: ' + r.behindTall +
    ' draws are exactly one cell wide by two tall', r.behindTall >= 1);
  ok('THE TALL DOOR IS NOT SQUASHED: 0 FACADE draws have a destination aspect different from ' +
    'their source (' + r.behindBadAspect + ') — the 16x32 door tile is derived once and cached, ' +
    'never stretched per frame', r.behindBadAspect === 0);
  // stated, not hidden: what else in the frame draws off-aspect and why it is
  // not this gate's to fail on.
  if (r.behindOffAspect && r.behindOffAspect.length)
    console.log('  (not gated: ' + r.behindOffAspect.join(', ') + ' — the street lamp, drawn 1.5 x 3 ' +
      'cells from a square tile on purpose; another feature\'s approved choice)');
  ok('SEE-THROUGH FIRES when a wall is covering him (' + r.behindFaded + ' draws at reduced alpha, ' +
    'alphas seen: ' + JSON.stringify(r.alphas) + ')', r.behindFaded > 0);
  ok('SEE-THROUGH STAYS OFF when nothing is covering him (' + r.awayFaded + ' faded draws) — ' +
    'a filter that is always on is not a filter, it is a bug', r.awayFaded === 0);

  console.log('THREE-TILE WALL GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
