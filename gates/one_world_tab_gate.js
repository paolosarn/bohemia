#!/usr/bin/env node
/* ===========================================================================
   ONE WORLD TAB GATE — Paolo 8/2, LOCKED.

     "the city tab will now live in the run tab. There's no point in having a
      city tab anymore. Make sure everything in the city tab is migrated on the
      run."

   WHAT IT HOLDS: there is exactly ONE tab that shows the world and it is RUN;
   the CITY tab is gone from the bar and never comes back; tapping RUN actually
   reaches the world frame; and the routing line that makes that work is still
   present, because deleting the button without it would leave the world
   unreachable.

   AND IT HOLDS THE FINDING THAT MATTERS MORE THAN THE BUTTON: #p-run is
   display:none for the life of the app, so the RUN tab has never shown
   slices/BOHEMIA_RUN_CURRENT.html. The surface Paolo plays is the CITY FRAME.
   That is asserted here so a future session cannot rediscover it the expensive
   way - by fixing the invisible surface again, which this lane did on 8/1.

   PROVED ABLE TO FAIL: putting the CITY tab back turns the first assertion red;
   removing the routing line turns the reachability assertion red.
   =========================================================================== */
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws/BOHEMIA_LAW_ONE_WORLD_TAB_8_2_26.md');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL ' + n)); };

function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'])
    { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

const src = fs.readFileSync(ALPHA, 'utf8');

/* his words are quoted in the law file across wrapped lines, so the haystack is
   whitespace-normalised before matching. Loosening the NEEDLE would let a
   paraphrase pass; normalising the WRAPPING does not. */
ok('the law is on disk in his words', fs.existsSync(LAW) &&
  fs.readFileSync(LAW, 'utf8').replace(/[\s>]+/g, ' ')
    .indexOf("There's no point in having a city tab anymore") >= 0);
ok('THE CITY TAB IS GONE FROM THE BAR', !/data-p="city">CITY</.test(src));
ok('the RUN tab is still there', /data-p="run">RUN</.test(src));
ok('and the routing that makes RUN show the world survives',
  src.indexOf("(t.dataset.p==='run') ? 'city'") >= 0);
/* NOTHING MAY NAVIGATE BY A BUTTON THE USER DOES NOT HAVE.
   The first version of this swept gates/ for the data-p selector only, and three
   things slipped through in the same hour: two gates that found the tab by its
   TEXT ('CITY'), and tools/bohemia_render_audit.js, which is not in gates/ at
   all. So the sweep covers BOTH directories and BOTH ways of naming a tab. */
for (const dir of ['gates', 'tools']) {
  for (const g of fs.readdirSync(path.join(ROOT, dir))) {
    if (!/\.(js|py)$/.test(g) || g === 'one_world_tab_gate.js') continue;
    if (/one_world_tab_patch/.test(g)) continue;          // the patch that removed it
    const body = fs.readFileSync(path.join(ROOT, dir, g), 'utf8');
    ok('nothing clicks the dead CITY tab by selector (' + dir + '/' + g + ')',
      body.indexOf('.tab[data-p="city"]') < 0);
    ok('nothing finds the dead CITY tab by its text (' + dir + '/' + g + ')',
      !/textContent\.trim\(\)\s*===\s*'CITY'/.test(body));
  }
}

(async () => {
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1200);

  const bar = await page.evaluate(() => [...document.querySelectorAll('.tab')].map(t => t.dataset.p));
  ok('the tab bar carries no CITY button (' + bar.join(',') + ')', bar.indexOf('city') < 0);
  ok('the tab bar carries RUN', bar.indexOf('run') >= 0);

  await page.click('.tab[data-p="run"]');
  await page.waitForTimeout(14000);
  const f = page.frames().find(fr => fr.name() === 'cityFrame');
  ok('TAPPING RUN REACHES THE WORLD FRAME', !!f);

  /* THE FINDING, asserted so it cannot be forgotten: the run slice is in the
     document and is NOT what he is looking at. If this ever flips - if p-run
     becomes visible - that is a real design change and this assertion should be
     rewritten by whoever makes it, deliberately, not tripped over. */
  const vis = await page.evaluate(() => {
    const p = document.getElementById('p-run');
    const on = [...document.querySelectorAll('.panel.on')].map(x => x.id);
    return { runPanelOn: p ? p.classList.contains('on') : null, panelsOn: on };
  });
  ok('the panel RUN opens is the world panel, not p-run (' + vis.panelsOn.join(',') + ') — ' +
    'the surface he plays is the CITY FRAME, not the run slice',
    vis.runPanelOn === false && vis.panelsOn.indexOf('p-city') >= 0);

  await browser.close();
  console.log('\n=== ONE WORLD TAB GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  console.log('    Paolo 8/2: one tab shows the world, and it is RUN.');
  if (fail) process.exit(1);
})().catch(e => { console.log('  FAIL harness: ' + e.message); process.exit(1); });
