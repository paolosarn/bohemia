const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THE SEE-THROUGH HAS TO SURVIVE MOTION (8/25/26, RUN lane)

   PAOLO, and the "before" is the whole point:

     "when i am facing walking south i should be behind the walls with an opacity
      so i can see myself weve talked about this before bro"

   HE HAD. It is LOCKED law from 7/27 (THE THREE-TILE WALL AND THE SEE-THROUGH),
   in his own words -- "an opacity filter for when I'm in front of a wall" -- and
   it was BUILT and it was RIGHT. I broke it on 8/23.

   HOW: the walk glide made the body draw at the CAMERA cell, the eased position
   between the cell he left and the one he is entering. playerBox() -- the box
   step 4 of the law asks "is this wall covering him?" -- kept computing from
   hx,hy, the TRUE cell.

       worst gap between the test box and the drawn body   88 px (TWO CELLS)
       frames where they disagreed by more than 2px        35 of 45  (78%)

   Two cells because holding the pad starts him running. So for most of every
   walked beat the game asked about a spot he was not standing on, the wall that
   really covered him stayed solid, and he walked into it and vanished.

   *** WHY NOTHING CAUGHT IT, AND THIS IS THE REASON THIS GATE EXISTS. ***
   wallclass_gate ALREADY proves the see-through, properly, off real canvas
   pixels -- and it proves it STANDING STILL:

       hx = spot.fx; hy = spot.fy - 1; render(); const behind = sample();

   It teleports him onto the covered tile and renders one frame. Standing still
   there is no glide, camCell returns the true cell, and playerBox was correct.
   That gate was never wrong and is not duplicated here. IT SIMPLY NEVER WALKED,
   and the defect existed only in motion.

   SO THIS ONE MOVES. It holds the pad down and measures across the beat.

   node gates/see_through_while_moving_gate.js
   ========================================================================== */
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== SEE-THROUGH WHILE MOVING: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) done();
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1200);
    await city.evaluate(() => {
      const g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
      if (g) g.click();
    });
    await SETTLE(page, 1800);

    /* ---- 1. THE LAW IS STILL THERE ---------------------------------------- */
    const law = await city.evaluate(() => ({
      wallSee: (typeof WALL_SEE !== 'undefined') ? WALL_SEE : null,
      hasBox: typeof playerBox === 'function',
      hasFacade: typeof facadePass === 'function' }));
    ok('the 7/27 see-through alpha is still a partial fade, not a hole ('
      + law.wallSee + ')', law.wallSee > 0 && law.wallSee < 1);
    ok('and the two halves of the law are both still here', law.hasBox && law.hasFacade);

    /* ---- 2. THE BOX FOLLOWS THE BODY, ACROSS A WHOLE WALKED BEAT ---------- */
    /* THE DEFECT WAS ARITHMETIC ABOUT WHERE HE IS, so it is measured as
       arithmetic: over 45 samples of a held walk, how far is the box the fade is
       computed from, from the box the body is actually drawn in? */
    const track = await city.evaluate(async () => {
      const C = HC, out = [];
      const pad = document.querySelectorAll('#pad .pb')[4];   /* south */
      if (!pad) return { err: 'no pad' };
      pad.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      for (let i = 0; i < 45; i++) {
        await new Promise(r => setTimeout(r, 25));
        const gc = camCell(hx, hy);
        const ox = Math.round(cv.width / 2 - gc[0] * C), oy = Math.round(cv.height / 2 - gc[1] * C);
        const bx = playerBox(ox, oy, C, gc);
        const lad = HC >= 64 ? 224 : (HC >= 32 ? 112 : (HC < 17 ? 28 : 56));
        const wantX0 = ox + gc[0] * C + C / 2 - lad / 2, wantY0 = oy + gc[1] * C + C - lad;
        out.push([Math.abs(bx.x0 - wantX0), Math.abs(bx.y0 - wantY0)]);
      }
      pad.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      const glided = out.length;
      const worst = Math.max.apply(null, out.map(v => Math.max(v[0], v[1])));
      const off = out.filter(v => v[0] > 2 || v[1] > 2).length;
      return { samples: glided, worst: Math.round(worst), off };
    });
    ok('the gauge actually sampled a walk (' + track.samples + ' frames)',
      !track.err && track.samples >= 20);
    ok('*** THE BOX THAT DECIDES THE FADE IS THE BOX THE BODY IS DRAWN IN, WHILE '
      + 'HE IS MOVING *** (worst ' + track.worst + 'px, ' + track.off + ' of '
      + track.samples + ' frames off) -- it was 88px and 35 of 45 before',
      track.worst <= 2 && track.off === 0);

    /* ---- 3. AND A WALL THAT COVERS HIM REALLY IS DRAWN FADED -------------- */
    /* THE ARITHMETIC BEING RIGHT IS NOT THE FEATURE, so this records the alpha the
       renderer actually paints with, for facade-sized draws that land on his body,
       WHILE HE IS WALKING.
       IT HAS TO PUT HIM SOMEWHERE A WALL ACTUALLY COVERS HIM FIRST. The first cut
       just held SOUTH from the spawn and reported "0 of 126 faded" -- which was
       TRUE and meant nothing: he walks down an arterial with nothing over him, so
       there was no fade to see and the 126 draws were full-screen ground blits.
       A gate that measures an empty stage and calls it a failure is the same
       mistake as one that measures an empty stage and calls it a pass.
       So: find a walkable cell with a facade one row south of it (that wall draws
       three tiles UP, over him), place him a few cells north, and hold SOUTH so he
       WALKS INTO being covered. The placement is scaffolding to reach the
       situation; the measurement is taken in real motion, which is the whole
       point. Facade draws are told apart from ground by size: a facade blits one
       cell, a baked ground chunk blits sixteen. */
    const seen = await city.evaluate(async () => {
      const C = HC;
      /* a spot where something really will be painted over him */
      let spot = null;
      for (let r = 3; r < 60 && !spot; r++) {
        for (let dy = -r; dy <= r && !spot; dy++) for (let dx = -r; dx <= r && !spot; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const x = hx + dx, y = hy + dy;
          let a = null, b = null;
          try { a = cellAt(x, y); b = cellAt(x, y + 1); } catch (e) { continue; }
          if (!a || !a.walk || !b || !b.face) continue;
          let clear = true;                       /* room to walk in from the north */
          for (let k = 1; k <= 4 && clear; k++) {
            let q = null; try { q = cellAt(x, y - k); } catch (e) { }
            if (!q || !q.walk) clear = false;
          }
          if (clear) spot = { x: x, y: y };
        }
      }
      if (!spot) return { err: 'no covered walkable cell within 60' };
      hx = spot.x; hy = spot.y - 4;             /* stand north of it, then walk in */
      try { render(); } catch (e) {}

      const ctx = cv.getContext('2d');
      const orig = ctx.drawImage;
      let recording = false, over = [], notOver = [], box = null;
      ctx.drawImage = function (im, dx, dy, dw, dh) {
        if (recording && box && typeof dx === 'number' && typeof dw === 'number'
            && dw <= C * 1.5 && dh <= C * 3.5) {        /* a facade course, not a ground chunk */
          const hit = dx < box.x1 && dx + dw > box.x0 && dy < box.y1 && dy + dh > box.y0;
          (hit ? over : notOver).push(this.globalAlpha);
        }
        return orig.apply(this, arguments);
      };
      const pad = document.querySelectorAll('#pad .pb')[4];
      pad.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      for (let i = 0; i < 80; i++) {
        await new Promise(r => setTimeout(r, 25));
        const gc = camCell(hx, hy);
        const ox = Math.round(cv.width / 2 - gc[0] * C), oy = Math.round(cv.height / 2 - gc[1] * C);
        box = playerBox(ox, oy, C, gc);
        recording = true; try { render(); } catch (e) { } recording = false;
      }
      pad.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      ctx.drawImage = orig;
      return { spot: spot, onHim: over.length,
               fadedOnHim: over.filter(a => a < 0.999).length,
               elsewhere: notOver.length,
               solidElsewhere: notOver.filter(a => a > 0.999).length };
    });
    ok('the gauge found somewhere a wall really does cover him and walked him into '
      + 'it (' + (seen.err || JSON.stringify(seen.spot)) + ')', !seen.err);
    ok('and something was painted over his body during that walk (' + seen.onHim
      + ' facade-sized draws)', seen.onHim > 0);
    ok('*** WHAT IS PAINTED OVER HIM WHILE HE WALKS IS FADED, SO HE CAN SEE '
      + 'HIMSELF *** (' + seen.fadedOnHim + ' of ' + seen.onHim + ')',
      seen.fadedOnHim > 0);
    ok('and the fade is aimed at him rather than being a filter over the whole '
      + 'world (' + seen.solidElsewhere + ' of ' + seen.elsewhere + ' elsewhere solid)',
      seen.elsewhere > 0 && seen.solidElsewhere > seen.elsewhere * 0.5);

    ok('and nothing threw while he walked ('
      + (errs.length ? errs.slice(0, 2).join(' | ') : 'none') + ')', errs.length === 0);

    console.log('  MEASURED: box-vs-body worst ' + track.worst + 'px over '
      + track.samples + ' walked frames \u00b7 ' + seen.fadedOnHim + ' of ' + seen.onHim
      + ' facade draws on his body FADED \u00b7 ' + seen.solidElsewhere + ' of '
      + seen.elsewhere + ' elsewhere solid');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
