/* BOHEMIA WALL CLASS GATE (7/27/26) — the WALL TAXONOMY, enforced in the DRAW
 * and not just in the bank.
 *
 * > "okay i literally spent hours 2 weeks ago planning the best walls for the
 * >  suburb walls and ur using some bullshit that u made for a house wall as the
 * >  subrub wall. are u even using the distrcit template and shit"
 *
 * The project files back him up completely:
 *   laws/BOHEMIA_ADDENDUM_WALL_TAXONOMY_7_17_26.md — "This is for the walls of
 *     suburb communities, different than like building wall, so keep that in
 *     mind." TWO classes that NEVER share a pool.
 *   banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt — 13 keys, and its own `law`
 *     field says WALL HEIGHT MIN 2 TILES.
 *   records/BOHEMIA_WALL_PICKS_BATCH2_VERDICTS_7_17_26.txt — batch 2 was 48
 *     candidates and exactly one survived. Batch 1 took 12. 61 judged, 13 kept.
 *
 * The pool was wired. What was not enforced was everything around it: the wall
 * was drawn ONE FLAT CELL on the ground while house facades stood three tiles
 * tall, so the only thing that looked like a wall in a suburb was the house
 * wall. And the 13 approved tiles were being shrunk 44 -> 16 with a smoothing
 * filter and then blown back up x1.375 by the current bake size — two resamples
 * on the one asset he hand-picked out of 61.
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and this one had a bank, a law
 * file and two verdict records and still drifted. So this gate boots the real
 * alpha, finds a REAL perimeter wall cell in a REAL suburb, and asserts:
 *
 *   CLASS      the cell draws from the `perimeter` pool and NEVER from a
 *              building-wall pool (hwall/hwindow/hboarded/hdoor)
 *   HEIGHT     it stands at least the 2 tiles its own bank demands, and stays
 *              SHORTER than the 3-tile house wall (a block wall is not a house)
 *   RESOLUTION the embedded tiles are at their judged 44x44, which against the
 *              zoom ladder [11,22,44,88] is exactly x0.25/x0.5/x1/x2
 *   COUNT      all 13 approved keys are present, not a subset
 *
 *   node gates/wallclass_gate.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const POOL = path.join(ROOT, 'banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt');
const LAW = path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_WALL_TAXONOMY_7_17_26.md');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* ---- the bank and the law still exist and still say what he ruled --------- */
const pool = JSON.parse(fs.readFileSync(POOL, 'utf8'));
const tan = pool.pool.filter(p => p.variant === 'tan');
const keys = Array.from(new Set(pool.pool.map(p => p.key)));
ok('the WALL TAXONOMY law is still on disk and still names both classes',
  /walls of suburb communities/.test(fs.readFileSync(LAW, 'utf8')));
ok('the perimeter bank still holds all 13 keys he passed across two batches (' + keys.length + ')',
  keys.length === 13);
ok('the bank still states its own height law (min 2 tiles)', /MIN 2 TILES/i.test(pool.law));

/* ---- his art is embedded at the size he judged it ------------------------- */
{
  const src = fs.readFileSync(ALPHA, 'utf8');
  const k = "const CITY_B64='";
  const a0 = src.indexOf(k) + k.length;
  const city = Buffer.from(src.slice(a0, src.indexOf("'", a0)), 'base64').toString('utf8');
  const m = city.match(/SA_TILES\.perimeter=\[([\s\S]*?)\]/);
  ok('the perimeter pool is embedded in the city at all', !!m);
  if (m) {
    const embedded = (m[1].match(/"[A-Za-z0-9+/=]{40,}"/g) || []).map(s => s.slice(1, -1));
    ok('ALL ' + tan.length + ' approved tan tiles are embedded (' + embedded.length + ') — not a subset',
      embedded.length === tan.length);
    ok('they are the BANK\'S OWN BYTES, at the resolution he judged them — not a ' +
      'shrunk-and-re-blown copy (two resamples on the one asset he picked out of 61)',
      embedded.length > 0 && embedded.every(b => tan.some(t => t.b64 === b)));
  }
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1200);
  await page.click('.tab[data-p="city"]').catch(() => {});
  await page.waitForTimeout(14000);
  const f = page.frames().find(fr => fr.name() === 'cityFrame');
  ok('the CITY frame is reachable', !!f);
  if (!f) { console.log('WALL CLASS GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed'); await browser.close(); process.exit(1); }

  const r = await f.evaluate(() => {
    let found = null, houseFace = null, n = 0;
    for (let y = 0; y < om.n && !found; y++) for (let x = 0; x < om.n && !found; x++) {
      const t = om.at(x, y); if (!t || t.district !== 'suburb') continue;
      if (++n > 200) break;
      const m = tileMeta(x, y); if (!m.sub) continue;
      for (let ly = 0; ly < FN && !found; ly++) for (let lx = 0; lx < FN; lx++) {
        const v = m.sub[ly * FN + lx];
        if (v === 4 && !found) found = cellAt(x * FN + lx, y * FN + ly);
        if ((v === 2 || v === 6) && !houseFace) {
          const c = cellAt(x * FN + lx, y * FN + ly);
          if (c && c.face) houseFace = c;
        }
      }
    }
    if (!found) return { noWall: true };
    return {
      pool: found.artPool_face, h: found.wallH, face: !!found.face, solid: !found.walk,
      houseH: houseFace ? (houseFace.wallH || 3) : null,
      housePool: houseFace ? houseFace.artPool_face : null,
    };
  });

  if (r.noWall) { console.log('  FAIL: no perimeter wall cell found in any suburb'); await browser.close(); process.exit(1); }

  const BUILDING = ['hwall', 'hwindow', 'hboarded', 'hdoor'];
  ok('THE SUBURB WALL IS A WALL: it stands in the facade pass instead of lying flat on the ground',
    r.face === true && r.solid === true);
  ok('WALL TAXONOMY HELD IN THE DRAW: the perimeter cell draws from the `perimeter` pool (' +
    r.pool + ') and never from a building-wall pool — "different than like building wall"',
    r.pool === 'perimeter' && !BUILDING.includes(r.pool));
  ok('HEIGHT: it stands at least the 2 tiles its own bank demands (' + r.h + ')', (r.h || 0) >= 2);
  ok('HEIGHT: and stays SHORTER than the ' + (r.houseH || 3) + '-tile house wall (' + r.h +
    ') — a community block wall is ~6ft, a house eave ~10ft', (r.h || 0) < (r.houseH || 3));
  if (r.housePool) ok('the house facade still uses a BUILDING pool (' + r.housePool + '), the other side of the same law',
    BUILDING.includes(r.housePool));

  console.log('WALL CLASS GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
