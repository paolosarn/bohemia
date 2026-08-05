/* ============================================================================
   ART TAB GATE (8/4/26) — NAME THE TAB, ENFORCED

   Paolo 8/4: "bro can you put all the work in a different fucking tab like the
   life tab bro wtf like u want me to hunt all your work down bro thats goofy asf
   i shouldnt have to tell you that"

   HE SHOULD NOT HAVE HAD TO TELL ME. NAME THE TAB has been law since 7/28 --
   "a thing he cannot reach does not exist to him" -- and I still spent an entire
   turn handing him filesystem paths under records/target/ and calling them a
   deliverable. The law was written down. Nothing in the machine cared. That is
   the exact failure mode the 7/16 ruling exists for: A LAW WITHOUT A MACHINE
   GATE IS NOT ENFORCED.

   So this is the gate. It holds the room, the door, and every picture in it.

   THE FOUR WAYS A TAB CAN LIE, all of which happened while building this one:

   1. THE TAB EXISTS AND THE PANEL DOES NOT (or the other way round). A tab that
      opens nothing is worse than no tab: he taps it, gets a blank, and concludes
      the work does not exist.

   2. THE PANEL EXISTS AND NEVER LOADS. The alpha's frame loader named ONE tab
      and ONE frame per line, by hand, so a new tab silently stayed blank --
      which is precisely what happened here on the first try. The loader is
      generic now and this gate holds it generic, because the next lane to add a
      tab will not read this comment.

   3. THE PICTURES ARE NOT THERE. Every card points at a file. A card whose image
      404s is a card that lies about having work behind it.

   4. THE TAB CANNOT TAKE A VERDICT. The whole point of the room is that he can
      thumb it and export it. Judge surfaces in this repo export .txt, never
      .json, and that is standing.

   AND IT OPENS THE REAL TAB IN A REAL BROWSER (7/18 VERIFY ON THE REAL SURFACE).
   Every source check above can pass on a tab that throws on open. So this boots
   the alpha, dismisses the splash, taps ART like a thumb would, and asserts the
   frame actually loaded with its cards and its pictures in it.

     node gates/art_tab_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const TAB = path.join(ROOT, 'slices/BOHEMIA_ART_CURRENT.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

ok('the ART tab page exists at all', fs.existsSync(TAB));
if (!fs.existsSync(TAB)) { console.log('FAIL: art tab gate 0/1'); process.exit(1); }

const alpha = fs.readFileSync(ALPHA, 'utf8');
const tab = fs.readFileSync(TAB, 'utf8');

/* ==== 1. THE DOOR AND THE ROOM ============================================ */
ok('the alpha has an ART tab in its tab bar', /<div class="tab" data-p="art">ART<\/div>/.test(alpha));
ok('the ART tab has a panel to open', /id="p-art"/.test(alpha));
ok('the panel holds the ART page', /data-src="BOHEMIA_ART_CURRENT\.html"/.test(alpha));

/* ==== 2. THE LOADER IS GENERIC, so the next tab cannot come up blank ====== */
/* the bug: every loader line named ONE frame by hand and a new tab got none */
ok('a tab click promotes data-src for WHATEVER panel opened, not a named list',
   /querySelector\("iframe\[data-src\]"\)/.test(alpha));
ok('and it only loads once (an already-loaded frame is never reset)',
   /if\(f&&!f\.getAttribute\("src"\)\)f\.src=f\.dataset\.src;\}\);\n?\}\)\(\);/.test(alpha) ||
   /iframe\[data-src\]"\);if\(f&&!f\.getAttribute\("src"\)\)f\.src=f\.dataset\.src/.test(alpha));

/* ==== 3. EVERY PICTURE THE TAB PROMISES IS ON DISK ======================== */
const srcs = [...tab.matchAll(/src="\.\.\/records\/target\/([A-Za-z0-9_.-]+)"/g)].map(m => m[1]);
const uniq = [...new Set(srcs)];
ok('the tab shows real screenshots (' + srcs.length + ' img tags, ' + uniq.length + ' files)',
   uniq.length >= 4);
const gone = uniq.filter(f => !fs.existsSync(path.join(ROOT, 'records/target', f)));
ok('every picture the tab points at exists' + (gone.length ? ' (MISSING: ' + gone.join(', ') + ')' : ''),
   gone.length === 0);
/* a hidden img never lazy-loads, so a flip would sit on a blank box */
ok('the hidden frames are warmed after paint, so a flip is instant',
   /new Image\(\);\s*w\.src\s*=\s*im\.getAttribute\('src'\)/.test(tab));

/* ==== 4. IT CAN TAKE A VERDICT =========================================== */
ok('there are thumbs on every card', (tab.match(/class="thumb up"/g) || []).length >= 3);
ok('there is a note on every card', (tab.match(/class="note"/g) || []).length >= 3);
ok('there is ONE comment box at the bottom, always', /id="all"/.test(tab));
ok('there is an export button', /id="exp"/.test(tab));
ok('the export writes .txt, never .json', /download\s*=\s*'BOHEMIA_ART_VERDICT\.txt'/.test(tab));
ok('SUN MODE exists (he judges outdoors)', /id="sunbtn"/.test(tab) && /body\.sun\{/.test(tab));
/* the dirt card must ask for a NUMBER, because that is the ruling being sought */
ok('the grime card offers the three amounts as a dial', (tab.match(/class="dialbtn/g) || []).length >= 3);
ok('the screenshots render as PIXELS, not smoothed', /image-rendering:pixelated/.test(tab));

/* ========================================================================== */
/* ==== 5. AND IT OPENS, ON THE REAL SURFACE, THE WAY HIS THUMB OPENS IT ==== */
(async () => {
  const { chromium } = playwright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + ALPHA);
  await p.waitForTimeout(6000);
  await p.click('#front');                    /* the splash, the way he does */
  await p.waitForTimeout(1200);

  const seen = await p.evaluate(() => {
    const t = document.querySelector('.tab[data-p="art"]');
    return !!t && !!t.offsetParent;
  });
  ok('the ART tab is actually on screen and tappable', seen);

  await p.click('.tab[data-p="art"]');
  await p.waitForTimeout(3000);

  const wired = await p.evaluate(() => {
    const pan = document.getElementById('p-art');
    const fr = document.getElementById('artFrame');
    return { on: !!pan && pan.classList.contains('on'), src: fr && fr.getAttribute('src') };
  });
  ok('tapping ART opens the ART panel', wired.on);
  ok('and the panel actually LOADS its page (not a blank tab)',
     wired.src === 'BOHEMIA_ART_CURRENT.html');

  const f = p.frames().find(fr => fr.url().indexOf('ART_CURRENT') >= 0);
  ok('the ART page is really in the document', !!f);

  if (f) {
    /* scroll it the way a thumb would, so every lazy picture is asked for */
    for (let i = 0; i < 12; i++) { await f.evaluate(() => window.scrollBy(0, 700)); await p.waitForTimeout(250); }
    await p.waitForTimeout(1500);
    const inner = await f.evaluate(() => ({
      cards: document.querySelectorAll('.card').length,
      broken: [...document.querySelectorAll('img')]
        .filter(i => i.complete && i.naturalWidth === 0)
        .map(i => i.getAttribute('src')),
      loaded: [...document.querySelectorAll('img')].filter(i => i.naturalWidth > 0).length,
      total: document.querySelectorAll('img').length
    }));
    ok('there is work in the room (' + inner.cards + ' cards)', inner.cards >= 3);
    ok('no picture in the tab is broken' + (inner.broken.length ? ' (' + inner.broken.join(', ') + ')' : ''),
       inner.broken.length === 0);
    ok('the pictures reached the page (' + inner.loaded + '/' + inner.total + ')',
       inner.loaded >= Math.min(3, inner.total));

    /* THE FLIP IS THE WHOLE INTERACTION. If tapping does not change the picture,
       there is no A/B and he cannot judge a grade at all. */
    await f.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(500);
    const before = await f.evaluate(() => document.getElementById('flag_look').textContent);
    await f.click('.shotwrap.ab');
    await p.waitForTimeout(400);
    const after = await f.evaluate(() => document.getElementById('flag_look').textContent);
    ok('tapping the picture FLIPS it (' + before + ' -> ' + after + ')', before !== after);

    /* and a thumb has to stick, or the export is empty */
    await f.click('.thumb.up[data-card="look"]');
    await p.waitForTimeout(300);
    ok('a thumb sticks when tapped',
       await f.evaluate(() => document.querySelector('.thumb.up[data-card="look"]').classList.contains('on')));

    /* the dial has to move, because the number is the ruling being asked for */
    await f.evaluate(() => document.querySelector('.dialbtn[data-k="0.55"]').click());
    await p.waitForTimeout(300);
    ok('the grime dial moves when tapped',
       await f.evaluate(() => document.getElementById('flag_grime').textContent.indexOf('DIRTY') >= 0));
  }

  await b.close();
  ok('the tab threw nothing on open' + (errs.length ? ' (' + errs.slice(0, 2).join(' | ') + ')' : ''),
     errs.length === 0);

  console.log((fail ? 'FAIL' : 'PASS') + ': art tab gate ' + pass + '/' + (pass + fail));
  process.exit(fail ? 1 : 0);
})();
