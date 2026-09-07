/* BOHEMIA -- EYES AND EARS -- THE SHIPPED BUNDLE CATCHER  (E11 round 2, 9/6/26)
 *
 * WHAT IT DOES
 *   Opens the shipped alpha and the shipped demo in the real Chromium at iPhone
 *   size, taps the splash the way a finger taps it, walks a few seconds, and
 *   records EVERY file the browser actually fetched. That set is "what the game
 *   can read". Nothing else in this repo is reachable at runtime, whatever it
 *   looks like on disk.
 *
 * WHY IT IS LIVE AND NOT A GREP
 *   E11's school round found the corrected rule: the defect is not the container,
 *   the defect is NO READER. A grep over the repo cannot tell a file the game
 *   loads from a file that merely exists. Only the browser knows. This is the
 *   7/18 VERIFY ON THE REAL SURFACE law applied to the load graph.
 *
 * WHAT IT DOES NOT KNOW (declared, per the anti-fatigue rule)
 *   A module loaded only on a path this walk never takes would be reported as
 *   unfetched. The walk therefore opens the front door, the city, and the demo,
 *   and the record says which paths were walked.
 *
 * OUT: records/BOHEMIA_EYES_BUNDLE_9_6_26.json
 */
const path = require('path'), fs = require('fs');
function pw(){ for (const p of ['/opt/node22/lib/node_modules/playwright','playwright','/usr/lib/node_modules/playwright','/usr/local/lib/node_modules/playwright']) { try { return require(p); } catch(e){} } throw new Error('playwright not found'); }
const { chromium } = pw();
const PHONE = { viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true };

async function walk(browser, file, label){
  const ctx = await browser.newContext(PHONE);
  const page = await ctx.newPage();
  const got = new Set(); const errs = [];
  page.on('response', r => { const u = r.url(); if (u.startsWith('file://')) got.add(decodeURIComponent(u.replace('file://',''))); });
  page.on('pageerror', e => errs.push(String(e).slice(0,160)));
  await page.goto('file://' + path.resolve(file), { waitUntil:'load' });
  await page.waitForTimeout(2500);
  try { await page.click('#front', { timeout:3000 }); } catch(e){}
  await page.waitForTimeout(3000);
  // walk a little so lazily-loaded paths get a chance
  for (let i=0;i<12;i++){ try { await page.keyboard.press('ArrowUp'); } catch(e){} await page.waitForTimeout(120); }
  await page.waitForTimeout(2500);
  await ctx.close();
  return { surface: label, file, fetched: [...got].sort(), pageErrors: errs };
}

(async () => {
  const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
  const out = [];
  out.push(await walk(browser, 'slices/BOHEMIA_ALPHA_0_9.html', 'THE ALPHA (the one link)'));
  if (fs.existsSync('slices/BOHEMIA_DEMO.html')) out.push(await walk(browser, 'slices/BOHEMIA_DEMO.html', 'THE DEMO (the thing that goes to a friend)'));
  await browser.close();
  const all = new Set(); out.forEach(w => w.fetched.forEach(f => all.add(f)));
  const doc = {
    what: 'EYES AND EARS -- what the shipped game actually fetches. The reader set.',
    date: '9/6/26',
    walked: 'front door, splash tapped as a finger taps it, twelve steps, both surfaces',
    blind_spot: 'a module loaded only on a path this walk never takes reads as unfetched; the walk is listed above',
    surfaces: out,
    bundle: [...all].sort().map(f => path.relative(process.cwd(), f))
  };
  fs.mkdirSync('records', { recursive:true });
  fs.writeFileSync('records/BOHEMIA_EYES_BUNDLE_9_6_26.json', JSON.stringify(doc, null, 1));
  console.log('BUNDLE: ' + doc.bundle.length + ' files the shipped game actually fetches');
  doc.bundle.forEach(f => console.log('   ' + f));
})();
