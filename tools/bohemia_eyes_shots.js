/* BOHEMIA -- EYES AND EARS: THE SCREENSHOT PASS (lane 17, E0, 9/5/26)
 *
 * WHAT THIS IS. Paolo asked for "a double checking set of eyes" on every shipped
 * visual. Before this file there was no machine that had ever LOOKED at the game:
 * every gate in this repo reads code, counts pixels inside a bank, or asserts an
 * invariant, and not one of them opens the alpha the way a phone opens it.
 * This does exactly that and nothing else -- it never edits game code, never
 * judges taste (that is DIRECTION), it only takes the picture and reports what
 * the browser said while the picture was being taken.
 *
 * VERIFY ON THE REAL SURFACE (7/18) is the law this serves: the surface is the
 * published slice loaded over http at iPhone size, not a side-door probe.
 *
 * TAP THE SPLASH THE WAY A FINGER TAPS IT (8/30 lesson, written into the become
 * law after a probe hid the splash with display:none and screenshotted a black
 * rectangle while every report said success). So: a real click on #front.
 *
 * USAGE:  node tools/bohemia_eyes_shots.js [--out DIR] [--port 8099]
 *   Expects a static server already serving the repo root on --port.
 *   NODE_PATH must reach playwright (global here: /opt/node22/lib/node_modules).
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const args = process.argv.slice(2);
function arg(name, dflt){ const i = args.indexOf(name); return i >= 0 ? args[i+1] : dflt; }
const PORT = arg('--port', '8099');
const OUT  = path.resolve(arg('--out', 'slices/eyes'));
const BASE = `http://127.0.0.1:${PORT}/slices/`;

/* THE PHONE HE PLAYS ON. iPhone portrait, the only shape this game is built for.
   390x844 is the 12/13/14 logical viewport; deviceScaleFactor 2 keeps the shot
   readable at the size he judges art (never below the size it ships at). */
const PHONE = { viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' };

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* Panels that build a canvas world on entry get longer than the flat ones. */
const SLOW = { run:9000, city:9000, combat:7000, map:6000, slice:6000, life:6000, art:6000, looks:6000, anim:5000, rig:5000 };

async function shoot(page, file, note){
  await page.screenshot({ path: path.join(OUT, file) });
  return { file, note };
}

async function capture(name, file){
  const browser = await chromium.launch();
  const ctx = await browser.newContext(PHONE);
  const page = await ctx.newPage();
  const log = [];                       /* what the browser said while we looked */
  page.on('console', m => { if(m.type()==='error'||m.type()==='warning') log.push({at:'console', type:m.type(), text:m.text().slice(0,300)}); });
  page.on('pageerror', e => log.push({at:'pageerror', text:String(e).slice(0,300)}));
  page.on('requestfailed', r => log.push({at:'request', text:(r.url().split('/').pop()+' -> '+(r.failure()&&r.failure().errorText)).slice(0,300)}));

  const shots = [];
  const t0 = Date.now();
  await page.goto(BASE + file, { waitUntil:'domcontentloaded', timeout:120000 });
  await page.waitForTimeout(4000);
  shots.push({ file:`${name}-00-splash.png`, tab:'(the front door)', ms:Date.now()-t0 });
  await page.screenshot({ path: path.join(OUT, `${name}-00-splash.png`) });

  /* the tab bar, read off the real DOM so a renamed or cut tab cannot be missed.
     THE DEMO HAS NO TAB BAR ON PURPOSE (#tabs display:none), so a hidden bar is
     not a defect and must not be reported as one -- it is the cue to walk the
     surface in TIME instead of in tabs. */
  const tabs = await page.evaluate(() => [...document.querySelectorAll('#tabs .tab')].map(t => ({p:t.dataset.p, label:(t.textContent||'').trim()})));
  const barShown = await page.evaluate(() => { const t=document.getElementById('tabs'); if(!t) return false;
    const cs = getComputedStyle(t); return cs.display !== 'none' && cs.visibility !== 'hidden'; });

  /* ONE FINGER, ON THE SPLASH. This is the only gesture a player makes before
     the game exists, and it is what starts the audio graph too. */
  const tap0 = Date.now();
  await page.locator('#front').click({ timeout:30000 });
  await page.waitForTimeout(9000);       /* the door opens onto the game: the city builds here */
  shots.push({ file:`${name}-01-after-the-tap.png`, tab:'(first screen after one tap)', ms:Date.now()-tap0 });
  await page.screenshot({ path: path.join(OUT, `${name}-01-after-the-tap.png`) });

  let n = 2;
  if(!barShown){
    /* ONE SCREEN, WALKED IN TIME. Beats after the single tap a player makes. */
    const beats = [6000, 12000, 20000, 30000];
    let acc = 0;
    for(const b of beats){
      await page.waitForTimeout(b - acc); acc = b;
      const num = String(n).padStart(2,'0'); n++;
      const shotFile = `${name}-${num}-t${Math.round((9000+b)/1000)}s.png`;
      await page.screenshot({ path: path.join(OUT, shotFile) });
      shots.push({ file:shotFile, tab:`(the game, ${Math.round((9000+b)/1000)}s after the tap)` });
    }
  }
  for(const t of (barShown ? tabs : [])){
    const num = String(n).padStart(2,'0'); n++;
    const shotFile = `${name}-${num}-${t.p}.png`;
    try{
      const loc = page.locator(`#tabs .tab[data-p="${t.p}"]`);
      await loc.scrollIntoViewIfNeeded({ timeout:15000 });
      await loc.click({ timeout:15000 });
      await page.waitForTimeout(SLOW[t.p] || 3500);
      await page.screenshot({ path: path.join(OUT, shotFile) });
      shots.push({ file:shotFile, tab:t.label || t.p, p:t.p });
    }catch(e){
      shots.push({ file:shotFile, tab:t.label || t.p, p:t.p, error:String(e).slice(0,200) });
    }
  }

  /* AND THE GAME AGAIN AT THE END, because a tab sweep leaves the run in a
     state, and the state a player is left in is the one that matters. */
  try{
    const back = page.locator('#tabs .tab[data-p="run"]');
    if(await back.count()){ await back.scrollIntoViewIfNeeded(); await back.click(); await page.waitForTimeout(9000);
      await page.screenshot({ path: path.join(OUT, `${name}-99-back-on-the-game.png`) });
      shots.push({ file:`${name}-99-back-on-the-game.png`, tab:'(back on the game after the sweep)' }); }
  }catch(_e){}

  const stamp = await page.evaluate(() => { const el = document.getElementById('buildstamp'); return el ? (el.textContent||'').trim() : null; });
  await browser.close();
  return { name, file, stamp, tabs:tabs.length, shots, log };
}

(async () => {
  fs.mkdirSync(OUT, { recursive:true });
  const only = arg('--only', null);
  const out = [];
  if(!only || only === 'alpha') out.push(await capture('alpha', 'BOHEMIA_ALPHA_0_9.html'));
  if(!only || only === 'demo')  out.push(await capture('demo',  'BOHEMIA_DEMO.html'));
  const merge = only && fs.existsSync(path.join(OUT,'shots.json'))
    ? JSON.parse(fs.readFileSync(path.join(OUT,'shots.json'),'utf8')).filter(r => r.name !== only).concat(out)
    : out;
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(merge, null, 2));
  for(const r of out) console.log(r.name, 'stamp=', r.stamp, 'tabs=', r.tabs, 'shots=', r.shots.length, 'browser said', r.log.length, 'things');
})().catch(e => { console.error(e); process.exit(1); });
