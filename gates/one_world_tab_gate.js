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
   THREE VERSIONS OF THIS CHECK, and the first two were the same mistake twice.
   v1 swept gates/ for the `.tab[data-p="city"]` selector. v2 added tools/ and the
   by-TEXT form after two gates and tools/bohemia_render_audit.js slipped through.
   Both were BLOCKLISTS: they banned the spellings I had happened to find. So
   gates/bottomleft_gate.py sailed through green-swept and then died on a 30s
   timeout in the real suite, because it names the tab a THIRD way --
       [...document.querySelectorAll('.tab')].find(x=>x.getAttribute('data-p')==='city')
   -- and then `if(t) t.click()` SWALLOWED the miss, so the failure surfaced far
   from its cause. A blocklist of spellings can always be spelled around.

   v3 asserts the PROPERTY instead: collect every tab name any gate or tool
   navigates by, and require each one to be a tab that ACTUALLY EXISTS. It needs
   no edit the next time a tab is renamed or retired -- it fails on its own,
   naming the file and the dead tab.

   AND THE BAR IS READ FROM THE RUNNING DOCUMENT, NOT FROM A REGEX. v3's first
   draft scraped the alpha with /class="tab"[^>]*data-p="([a-z]+)"/ and reported
   that four gates navigate by a CHARACTER tab that does not exist. It does
   exist. It is written `class="tab on"` because it is the tab you start on, and
   the regex demanded the exact string `class="tab"`. That is the SAME mistake as
   the blocklist one layer up: assuming a spelling. A live `querySelectorAll`
   cannot be spelled around, so the sweep waits for the browser and uses it.
   (Verified in a browser before believing the accusation: from the alpha you can
   tap back to CHARACTER, so nobody is locked out of it -- the gate was wrong,
   not the game. DO NOT CLAIM THINGS ABOUT THE CODEBASE WITHOUT CHECKING.) */
function sweepNavigators(BAR) {
  ok('the tab bar came from the LIVE document (' + [...BAR].join(',') + ')', BAR.size >= 3);
  for (const dir of ['gates', 'tools']) {
    for (const g of fs.readdirSync(path.join(ROOT, dir))) {
      if (!/\.(js|py)$/.test(g) || g === 'one_world_tab_gate.js') continue;
      const raw = fs.readFileSync(path.join(ROOT, dir, g), 'utf8');
      /* COMMENTS ARE NOT CODE. A file that EXPLAINS in prose that the CITY tab
         used to be clicked here is documenting the fix, not doing the thing --
         and this check accused bohemia_canvas_scale_audit.js of exactly that,
         one line after its comment said why it no longer does it. Strip block
         comments, line comments and python docstrings before scanning. */
      const body = raw
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/^[ \t]*(\/\/|#).*$/gm, ' ')
        .replace(/"""[\s\S]*?"""/g, ' ');
      /* a PATCH TOOL carries the old markup on purpose -- that is its search
         anchor, not navigation. The honest separator is not the filename but
         whether the file ever CLICKS anything: a byte-rewriter never does.
         A CALL, not the word: `\bclick\b` also matched this patch tool's own
         docstring sentence "four gates reached the world by clicking". */
      if (!/\.click\(|click\(\)/.test(body)) continue;
      const named = new Set();
      /* every way a tab gets named: the CSS selector, a data-p comparison however
         it is spelled (getAttribute / dataset), and the visible label text. */
      for (const m of body.matchAll(/\.tab\[data-p=["']([a-z]+)["']\]/g)) named.add(m[1]);
      for (const m of body.matchAll(/data-p['"]?\s*\)?\s*={2,3}\s*['"]([a-z]+)['"]/g)) named.add(m[1]);
      for (const m of body.matchAll(/dataset\.p\s*={2,3}\s*['"]([a-z]+)['"]/g)) named.add(m[1]);
      /* the by-TEXT form, WINDOWED to the same expression -- a file-wide test for
         `.tab` plus any uppercase textContent compare anywhere in the file caught
         button labels ('NONE') that have nothing to do with the tab bar. */
      for (const m of body.matchAll(
        /querySelectorAll\(['"]\.tab['"]\)[\s\S]{0,200}?textContent[^=]{0,24}={2,3}\s*['"]([A-Z]+)['"]/g))
        named.add(m[1].toLowerCase());
      for (const t of named)
        ok('navigates by a tab that EXISTS: ' + dir + '/' + g + ' -> ' + t.toUpperCase(),
          BAR.has(t));

      /* AND THE SWALLOW, WHICH IS THE ACTUAL BUG IN ALL THREE CASES.
         Name-checking only works when the name is a literal in the file. It is
         not in tools/bohemia_canvas_scale_audit.js, which builds the selector
         from a TABS array -- so that one clicked a dead CITY tab for a whole day
         and the name sweep above could never have seen it.
         What every one of them shares is that the FAILED CLICK WAS SILENT:
         `.catch(() => {})` on the click, or `if (t) t.click()` on a find that
         returned undefined. The gate then failed thirty seconds and one wrong
         surface later, nowhere near its cause. So: a tab click may not swallow
         its own failure. This holds for tab names that do not exist yet. */
      ok('a failed tab click is not swallowed by .catch (' + dir + '/' + g + ')',
        !/\.tab\[data-p=[^;]{0,80}?\)\s*\.catch\s*\(/.test(body));
      ok('a tab that was not found is not silently skipped (' + dir + '/' + g + ')',
        !/data-p[\s\S]{0,120}?if\s*\(\s*(\w+)\s*\)\s*\1\.click\(\)/.test(body));
    }
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
  sweepNavigators(new Set(bar));

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
