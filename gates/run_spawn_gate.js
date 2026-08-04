/* ============================================================================
   RUN SPAWN GATE (8/2/26)

   Paolo 8/2: "when I first opened up the run it keeps like opening up in the very
   center of the map instead of the district that we're working on... make it easy
   for yourself moving forward like when we're upgrading a district or working on
   it together like I should be starting off there."

   The spawn was `city.y = Math.round(96*0.5)` -- the literal middle of the 96x96
   valley, on the Strip, every run, whatever we were building. This gate holds the
   run open on the district named in records/BOHEMIA_WORKING_DISTRICT.txt, and it
   checks it the only way that counts: boot the real alpha, open the RUN tab, and
   ask the world model what district the player is standing in.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const RECORD = path.join(ROOT, 'records/BOHEMIA_WORKING_DISTRICT.txt');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
function pw(){ try{ return require('/opt/node22/lib/node_modules/playwright'); }
  catch(e){ return require('playwright'); } }
/* WHERE the city app lives and WHAT SHAPE it is in are not this gate's business
   (8/4). The payload-wall pass moved it out of the alpha on 8/2 and stopped
   base64-ing it, and this gate reported the working district MISSING when it was
   set fine. One resolver knows: gates/bohemia_city_app.js. */
const CITY_APP = require('./bohemia_city_app.js');
function cityBlob(_a){ const x = CITY_APP.read(); return x ? x.src : ''; }
function cityBlob(a){
  /* THE CITY LEFT THE ALPHA (8/4): another lane split the renderer out to
     slices/BOHEMIA_CITY_WORLD.html because the alpha was 38.7 MB and ~43 days from
     GitHub's hard 100 MB push limit. It is PLAIN TEXT there, not base64. Read the file
     if the old inline blob is gone, so this gate follows the code instead of the
     container it used to live in. */
  const fs2=require('fs'), p2=require('path');
  const f2=p2.join(__dirname,'..','slices/BOHEMIA_CITY_WORLD.html');
  for (let ci = a.indexOf('CITY_B64'); ci >= 0; ci = a.indexOf('CITY_B64', ci + 1)) {
    const t = a.slice(ci + 8, ci + 20), eq = t.indexOf('='); if (eq < 0) continue;
    const qi = t.slice(eq).search(/['"`]/); if (qi < 0) continue;
    const st = ci + 8 + eq + qi + 1, en = a.indexOf(a[st - 1], st);
    if (en - st < 100000) continue;
    return Buffer.from(a.slice(st, en), 'base64').toString('utf8');
  }
  try { return fs2.readFileSync(f2,'utf8'); } catch(e) { return ''; }
}

(async () => {
  ok('the working-district record exists (so a session can read it without decoding 24MB)',
     fs.existsSync(RECORD));
  const want = fs.existsSync(RECORD) ? fs.readFileSync(RECORD, 'utf8').split('\n')[0].trim() : null;
  ok('it names a district (' + want + ')', !!want && /^[a-z_]+$/.test(want));

  const alpha = fs.readFileSync(ALPHA, 'utf8');
  const city = cityBlob(alpha);
  ok('the alpha carries a readable CITY renderer', city.length > 100000);
  const m = city.match(/const WORKING_DISTRICT='([a-z_]+)'/);
  ok('the renderer declares a WORKING_DISTRICT', !!m);
  ok('the renderer and the record AGREE (' + (m && m[1]) + ' === ' + want + ')',
     !!m && m[1] === want);
  /* the whole complaint: the old hardcoded centre-of-the-valley spawn is GONE */
  ok('the hardcoded centre-of-the-map spawn is gone',
     city.indexOf("city.y=Math.round(96*0.5); })();") < 0);
  ok('the Strip survives as a FALLBACK only (a missing district must never strand him)',
     /FALLBACK[\s\S]{0,400}L\.stripX/.test(city));

  const { chromium } = pw();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(3000);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(1500);
    await page.evaluate(() => { const t = document.querySelector('[data-p="run"]'); if(!t) throw new Error('that tab is not in the bar'); t.click(); });
    let f = null;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(3000);
      /* FIND THE FRAME BY WHAT IT IS, NOT BY HOW IT WAS LOADED (8/4). It was a
         srcdoc frame until the payload-wall pass; it is a sibling src frame now.
         One predicate knows: gates/bohemia_city_app.js. */
      f = page.frames().find(fr => require('./bohemia_city_app.js').isFrame(fr, page));
      f = page.frames().find(fr => (/srcdoc|CITY_WORLD|CITY_CURRENT/.test(fr.url())) && fr !== page.mainFrame());
      if (!f) continue;
      const up = await f.evaluate(() => typeof fit === 'function' &&
        document.getElementById('cv').width > 300).catch(() => false);
      if (up) break;
    }
    ok('the world frame booted', !!f);
    if (f) {
      const r = await f.evaluate(() => {
        const t = om.at(city.x, city.y);
        const old = { x: om.layout.stripX, y: Math.round(96 * 0.5) };
        const ot = om.at(old.x, old.y);
        return { x: city.x, y: city.y, district: t ? t.district : null,
                 oldX: old.x, oldY: old.y, oldDistrict: ot ? ot.district : null,
                 want: typeof WORKING_DISTRICT !== 'undefined' ? WORKING_DISTRICT : null };
      });
      ok('THE RUN OPENS IN THE DISTRICT WE ARE WORKING ON (cell ' + r.x + ',' + r.y +
         ' is ' + r.district + ')', r.district === want);
      /* NOT A COORDINATE PROXY. The first version of this check compared the spawn
       * to the centre COORDINATE and failed on a perfectly correct spawn, because
       * the nearest suburb to the valley centre happens to BE the centre cell. What
       * he actually complained about is the DISTRICT he landed in: the old spawn put
       * him on the Strip. So assert the thing he said, not a stand-in for it. */
      ok('THE OLD SPAWN WAS THE STRIP AND IT IS NOT WHERE HE LANDS ANY MORE (was ' +
         r.oldX + ',' + r.oldY + ' = ' + r.oldDistrict + ', now ' + r.x + ',' + r.y +
         ' = ' + r.district + ')',
         r.oldDistrict !== r.district);
      ok('he does not open on a road surface (strip/arterial/freeway/interchange)',
         ['strip','arterial','freeway','interchange','rail'].indexOf(r.district) < 0);

      /* PAOLO 8/1: "THE SUBURB IM SPAWNED IN DOESNT HAVE ACCESS TO THE REST OF THE
       * STREETS." Not a flag check -- WALK IT. Flood-fill the walkable network from
       * the exact cell he lands on and require it to leave the spawn plot AND reach
       * a real road surface. A spawn that opens in the right district but is sealed
       * inside it is the same complaint wearing a different hat. */
      const w = await f.evaluate(() => {
        const out = {};
        try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}
        const seen = new Set([hx + ',' + hy]); const st = [[hx, hy]];
        let n = 0, left = false, road = false;
        const ROADS = ['strip','arterial','freeway','beltway','interchange'];
        while (st.length && n < 60000) {
          const p = st.pop(); n++;
          const tx = (p[0] / FN) | 0, ty = (p[1] / FN) | 0;
          if (tx !== city.x || ty !== city.y) left = true;
          const tt = om.at(tx, ty);
          if (tt && ROADS.indexOf(tt.district) >= 0) road = true;
          if (left && road) break;
          for (const d of DIRS) {
            const nx = p[0] + d[0], ny = p[1] + d[1], k = nx + ',' + ny;
            if (seen.has(k)) continue;
            const c = cellAt(nx, ny); if (!c || !c.walk) continue;
            seen.add(k); st.push([nx, ny]);
          }
        }
        out.reached = n; out.leftSpawnPlot = left; out.reachedRealRoad = road;
        return out;
      });
      ok('HE CAN WALK OUT OF THE PLOT HE SPAWNS IN (' + w.reached + ' cells explored)',
         w.leftSpawnPlot);
      ok('AND THE WALK REACHES A REAL STREET -- the spawn is not sealed off',
         w.reachedRealRoad);
    }
  } finally { await browser.close(); }
  console.log('RUN SPAWN GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('RUN SPAWN GATE CRASHED: ' + e.message); process.exit(1); });
