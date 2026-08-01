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

  /* ONE WALL PER COMMUNITY (banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt,
   * paolo_laws, verbatim): "each plot = ONE wall design (seeded per plot);
   * variety BETWEEN plots; per-cell wall shuffle BANNED". The tile used to be
   * picked with the generic per-cell hash `hash2(gx,gy,404)&3`, which broke that
   * twice: it shuffled the design down a single wall, and the &3 capped the roll
   * at four, so NINE of his THIRTEEN approved border walls had never once been
   * drawn in this game. Sweep the whole valley and prove both halves. */
  const law = await f.evaluate(() => {
    const N = (SA_IMG.perimeter || []).length;
    const perPlot = {}; const seen = new Set(); let cells = 0, n = 0;
    for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) {
      const t = om.at(x, y); if (!t || t.district !== 'suburb') continue;
      if (++n > 300) break;
      const m = tileMeta(x, y); if (!m.sub) continue;
      const plot = (x >> 2) + ',' + (y >> 2);
      for (let ly = 0; ly < FN; ly++) for (let lx = 0; lx < FN; lx++) {
        if (m.sub[ly * FN + lx] !== 4) continue;
        const c = cellAt(x * FN + lx, y * FN + ly);
        if (!c || c.wallVariant === undefined) continue;
        cells++;
        const idx = c.wallVariant % N;
        seen.add(idx);
        (perPlot[plot] = perPlot[plot] || new Set()).add(idx);
      }
    }
    const plots = Object.keys(perPlot);
    return { N, cells, plots: plots.length,
             mixed: plots.filter(p => perPlot[p].size > 1).length,
             distinct: seen.size };
  });
  ok('the sweep reached real community walls (' + law.cells + ' wall cells across ' +
    law.plots + ' communities)', law.cells > 500 && law.plots > 5);
  ok('ONE WALL PER COMMUNITY: not one plot mixes designs (' + law.mixed + ' mixed) — ' +
    'his law names the per-cell wall shuffle and BANS it', law.mixed === 0);
  ok('VARIETY BETWEEN PLOTS: ' + law.distinct + ' of the ' + law.N + ' approved designs are ' +
    'in use across the valley — the old &3 roll capped it at 4 and nine of his thirteen ' +
    'had never been drawn', law.distinct === law.N);

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
  /* HEIGHT — REWRITTEN 8/1 BY A RULING, NOT WORKED AROUND.
     This asserted `h >= 2`, from the bank's "MIN 2 TILES" note, read as a DRAWN
     GRID HEIGHT when it was set on 7/27. Paolo, 8/1, describing the geometry
     himself: "if I am one tile north, behind a wall, because of the view of our
     game, the wall border should end at that first tile, base of the wall...
     and that's for all walls... it has to be a building if walls are two tiles
     thick."
     He is right and the measurement agreed with him: at wallH=2 the face was
     painted over the WALKABLE cell to its north - 7,417 of them across the
     valley - so you stood inside the wall. And because his thirteen approved
     tiles are complete walls at 44x44, painting one over a two-tile rect
     repeated it, which is the "two layers of walls... a different wall in the
     wall" he saw. One cause, both complaints.
     A GATE MUST NEVER OUTRANK A RULING (the same precedent people_gate cites
     for the naming law), so the claim is rewritten. NEWEST DATE WINS.
     WHAT IS ASSERTED NOW: a wall owns its own tile and nothing else, and only a
     BUILDING may be taller - which is his second sentence, machine-held.
     AND THE BANK IS NOT CONTRADICTED, which matters because line 58 still
     asserts its "MIN 2 TILES" text is intact and that assertion is correct.
     The bank is stating how tall the wall IS IN THE WORLD - two tiles of the
     0.75m grid is ~1.5m, a real Vegas block wall. The number this gate now
     holds is how many GROUND CELLS its face is painted across, which is a
     different quantity entirely. His approved 44x44 tile already contains the
     whole height; it just belongs on one cell. Both are true, and reading one
     as the other is what put wallH=2 here in the first place. */
  ok('HEIGHT: the wall ends at its own tile — the walkable border stops at its base (' + r.h + ')',
    (r.h || 0) === 1);
  ok('HEIGHT: and a BUILDING is the only thing allowed to be taller (house ' +
    (r.houseH || 3) + ' vs wall ' + r.h + ')', (r.h || 0) < (r.houseH || 3));
  if (r.housePool) ok('the house facade still uses a BUILDING pool (' + r.housePool + '), the other side of the same law',
    BUILDING.includes(r.housePool));

  /* ============================================================================
   * THE RUN IS A SECOND RENDERER, AND IT IS THE ONE HE PLAYS.
   *
   * > "i went on the run and the suburb border walls are not changed its still
   * >  the house tiles dumbass"
   *
   * Everything above measures the CITY tab. The run has its OWN tile vocabulary
   * and for the suburb perimeter it returned 'wall_base' — the SAME
   * starter-tileset tile its own bodyTile() lays as the bottom course of a
   * HOUSE. The border wall and the house wall were literally one tile, and his
   * 13 approved border walls had never existed in that renderer at all.
   *
   * Gating one surface and declaring the law held is exactly how this went
   * wrong, so the gate covers BOTH renderers now.
   * ========================================================================= */
  const runPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const runErr = [];
  runPage.on('pageerror', e => runErr.push(String(e).slice(0, 160)));
  await runPage.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html'),
    { waitUntil: 'load', timeout: 180000 });
  await runPage.waitForTimeout(8000);
  const run = await runPage.evaluate(() => ({
    pool: (typeof PERIM_B64 !== 'undefined') ? PERIM_B64.length : -1,
    decoded: (typeof PERIM_IMG !== 'undefined') ? PERIM_IMG.filter(i => i.complete && i.naturalWidth).length : -1,
    hasDraw: typeof drawPerim === 'function',
    stillHouseTile: (typeof groundTile === 'function')
      ? (function () { try { return groundTile(4, 1, 1) === 'wall_base'; } catch (e) { return null; } })() : null,
  }));
  ok('THE RUN carries his border-wall pool at all (' + run.pool + ' tiles) — it never did before',
    run.pool === tan.length);
  ok('THE RUN decoded all of them (' + run.decoded + ')', run.decoded === tan.length);
  ok('THE RUN has a perimeter draw path of its own', run.hasDraw === true);
  ok('THE RUN NO LONGER RETURNS THE HOUSE TILE for the suburb perimeter — ' +
    "'wall_base' is what its own bodyTile() lays as the bottom course of a house",
    run.stillHouseTile === false);
  ok('THE RUN boots clean with the wall in it (' + (runErr.length ? runErr[0] : 'no errors') + ')',
    runErr.length === 0);

  console.log('WALL CLASS GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
