const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   A FRIEND CAN FINISH DAY ONE BY WALKING (8/25/26, RUN lane)

   NOTHING PROVED THIS. Everything proved a piece of it:

     WHOLE DEMO    takes the job, walks six steps, and GOES TO SLEEP. It never
                   finishes the work.
     DAY LOOP      finishes the quest by calling Q.event('enter_building',
                   {dark:true}) in Node -- the message the city would send, sent
                   by the gate instead. That proves the RUNTIME, not the world.
     COMBAT ENTRY  proves a door starts a fight.

   So the demo's actual question -- CAN SOMEBODY DO THE JOB -- was answered by
   nobody. The pieces were each green and the join between them was a guess.

   WHY IT MATTERS MORE THAN IT SOUNDS: the day-one objective is finished by
   getting inside a building with no power. If the spawn happened to sit in a
   pocket with no reachable way in, a friend would take the job, wander, find
   nothing, sleep, and the demo would be a walking simulator with a lie in the
   corner of the screen. That is not a hypothetical -- MEASURED while writing
   this, a straight-line walk at the nearest door ran NINETY STEPS and never
   arrived, because a wall stood between the two and a straight line does not
   turn.

   WHAT IT DOES: boots the real alpha, takes the job off the phone the way he
   does, then BFS's the world for the nearest thing that actually admits a body
   -- a door on a building that has one, any wall on a building that does not,
   which is the 8/2 rule -- and DRIVES THE REAL PAD along that route, one 560ms
   press per step, on the beat.

   WHAT IT HONESTLY DOES NOT PROVE: that he can FIND it. The BFS stands in for a
   player's eyes and a player's sense of his own street. What is proved is that
   the world admits a route at all, that the pad walks it, that the door lets him
   in, and that the quest hears about it -- four things that each work alone and
   had never been asked to work in a row. Discoverability is a separate question
   and is not smuggled in here.

   MEASURED THE FIRST TIME IT RAN:
       path to a way in   15 steps (836 cells explored)
       walked             12 presses, and he was inside
       stage              10 -> 20
       and the resolution card came up carrying its three real endings

   node gates/day_one_can_be_finished_gate.js
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
  console.log('\n=== DAY ONE CAN BE FINISHED: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

/* 120 BPM LAW: a press shorter than a beat lands nothing. */
const HOLD = 560;
/* A CEILING, NOT A TARGET. If the nearest way in is ever further than this from
   the spawn, day one has quietly become a hike and somebody should know. */
const MAX_STEPS = 45;

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
    await SETTLE(page, 1600);

    /* ---- HE TAKES THE JOB, OFF THE PHONE, LIKE A PLAYER ------------------ */
    await city.evaluate(() => { const b = document.getElementById('phonebtn'); if (b) b.click(); });
    await SETTLE(page, 2500);
    const pf = page.frames().find(fr => /CURRENT_SLICE/.test(fr.url()));
    let took = false;
    if (pf) {
      try {
        await pf.waitForSelector('.lv-take', { state: 'attached', timeout: 10000 });
        took = await pf.evaluate(() => {
          const t = document.querySelector('.lv-take'); if (!t) return false; t.click(); return true; });
      } catch (e) { took = false; }
    }
    ok('the job is on the phone and can be taken', took === true);
    await SETTLE(page, 2200);
    await city.evaluate(() => { try { phoneClose(); } catch (e) { } });
    await SETTLE(page, 900);

    const before = await city.evaluate(() => ({
      stage: DQ.rt.state.stage,
      obj: (document.getElementById('qline') || {}).textContent || '',
      dark: (typeof dayDark === 'function') ? dayDark() : null }));
    ok('taking it opens the day-one objective (stage ' + before.stage + ')', before.stage === 10);
    ok('and the objective tells him what to DO, not just what to find ("'
      + before.obj.trim() + '")', /get inside/i.test(before.obj));

    /* ---- IS THERE A WAY IN AT ALL, AND HOW FAR --------------------------- */
    const plan = await city.evaluate(() => {
      const R = 70, sx = hx, sy = hy;
      const key = (x, y) => x + ',' + y;
      const walk = (x, y) => { let q = null; try { q = cellAt(x, y); } catch (e) { return false; }
        return !!(q && q.walk); };
      /* THE 8/2 RULE, ASKED THE WAY THE GAME ASKS IT: a building that HAS a door
         is entered only through that door; a building with none is entered from
         any wall. Rolling a different test here would measure a world the player
         does not live in. */
      const wayIn = (x, y) => { let q = null; try { q = cellAt(x, y); } catch (e) { return false; }
        if (!q || !q.enter) return false;
        if (typeof massHasDoor === 'function' && massHasDoor(x, y))
          return typeof isDoorCell === 'function' ? isDoorCell(q) : false;
        return true; };
      const D = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
      const prev = new Map(); prev.set(key(sx, sy), null);
      let frontier = [[sx, sy]], found = null, depth = 0;
      while (frontier.length && !found && depth < R) {
        const nx = [];
        for (const [x, y] of frontier) {
          for (const [dx, dy] of D) {
            const ax = x + dx, ay = y + dy;
            if (Math.abs(ax - sx) > R || Math.abs(ay - sy) > R) continue;
            if (wayIn(ax, ay)) { prev.set(key(ax, ay), [x, y]); found = [ax, ay]; break; }
            if (!walk(ax, ay)) continue;
            if (prev.has(key(ax, ay))) continue;
            prev.set(key(ax, ay), [x, y]); nx.push([ax, ay]);
          }
          if (found) break;
        }
        frontier = nx; depth++;
      }
      if (!found) return { ok: false, explored: prev.size };
      const route = []; let cur = found;
      while (cur) { route.push(cur); cur = prev.get(key(cur[0], cur[1])); }
      route.reverse();
      return { ok: true, steps: route.length - 1, route: route, explored: prev.size };
    });

    ok('*** THERE IS A WAY INTO A BUILDING FROM WHERE THE DEMO PUTS HIM *** ('
      + (plan.ok ? plan.steps + ' steps, ' + plan.explored + ' cells explored'
                 : 'NONE within 70 cells, ' + plan.explored + ' explored') + ')',
      plan.ok === true);
    if (!plan.ok) done();
    ok('and it is a walk rather than a hike (' + plan.steps + ' <= ' + MAX_STEPS + ')',
      plan.steps <= MAX_STEPS);

    /* ---- HE WALKS IT, ON THE REAL PAD, ON THE BEAT ----------------------- */
    const dirIdx = (dx, dy) => {
      if (dx === 0 && dy < 0) return 0; if (dx > 0 && dy < 0) return 1;
      if (dx > 0 && dy === 0) return 2; if (dx > 0 && dy > 0) return 3;
      if (dx === 0 && dy > 0) return 4; if (dx < 0 && dy > 0) return 5;
      if (dx < 0 && dy === 0) return 6; return 7;
    };
    let inside = false, presses = 0;
    for (let i = 1; i < plan.route.length && !inside; i++) {
      const st = await city.evaluate(() => ({ x: hx, y: hy,
        inside: !!(typeof INSIDE !== 'undefined' && INSIDE) }));
      if (st.inside) { inside = true; break; }
      const dx = Math.sign(plan.route[i][0] - st.x), dy = Math.sign(plan.route[i][1] - st.y);
      if (dx === 0 && dy === 0) continue;
      await city.evaluate(async (a) => {
        const pad = document.querySelectorAll('#pad .pb')[a.d];
        if (!pad) return;
        pad.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        await new Promise(r => setTimeout(r, a.h));
        pad.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      }, { d: dirIdx(dx, dy), h: HOLD });
      await SETTLE(page, 180); presses++;
    }

    const after = await city.evaluate(() => ({
      inside: !!(typeof INSIDE !== 'undefined' && INSIDE),
      stage: DQ.rt.state.stage,
      card: document.getElementById('daycard').classList.contains('on'),
      options: [...document.querySelectorAll('#daycardIn .dcbtn')].length,
      txt: (document.getElementById('daycardIn').textContent || '').replace(/\s+/g, ' ').trim() }));

    ok('*** WALKING THE REAL PAD PUTS HIM INSIDE *** (' + presses + ' presses)',
      after.inside === true);
    ok('*** AND THE JOB HEARS ABOUT IT: the objective advances *** (stage '
      + before.stage + ' -> ' + after.stage + ')', after.stage === 20);
    ok('and the game asks him how he wants to finish it', after.card === true);
    ok('with the quest\'s own three endings on it (' + after.options + ')',
      after.options === 3);
    /* NO INVENTED WORDS: the buttons are the .bq's own @LOG lines. dayloop_gate
       proves that byte for byte; this only checks he is looking at them. */
    ok('and those endings are the quest\'s words, not a menu I wrote',
      /Put the current back myself/.test(after.txt));
    ok('and the whole of it threw nothing ('
      + (errs.length ? errs.slice(0, 2).join(' | ') : 'none') + ')', errs.length === 0);

    console.log('  MEASURED: a way in ' + plan.steps + ' steps away · walked in '
      + presses + ' real pad presses · stage ' + before.stage + ' -> ' + after.stage
      + ' · ' + after.options + ' endings offered');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
