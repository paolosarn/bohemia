/* BOHEMIA FRONT DOOR GATE (7/27/26) — a door is a fact about the plot, never a
 * dice roll.
 *
 * Paolo: "the door suck." He was right, and the reason was not the art. Every
 * exposed house tile picked its facade from a per-tile hash, and 10% of that
 * roll was a DOOR. Measured on 24 real suburb cells: 727 exposed house fronts,
 * 62 doors — one every twelve tiles, scattered down every wall of every house
 * including the backyard walls that face a dead-dirt lot with no path to them. A
 * house does not have six front doors on four sides.
 *
 * The suburb generator already knew where the front was and nobody asked it: it
 * marks the driveway apron (code 3) and the residential street (code 1) in its
 * own legend, at build time. So the door now goes where the house meets one of
 * those, one per approach, and nowhere else.
 *
 * This gate boots the real alpha, walks 24 suburb cells, and reads the facade
 * the game actually assigned to every exposed house tile. It is measured on the
 * running surface, not read out of the source, because the whole class of bug it
 * exists to stop is "the code looks reasonable and the result is nonsense".
 *
 *   node gates/frontdoor_gate.js
 */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ALPHA = path.join(path.dirname(__dirname), 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1200);
  /* THE CITY TAB IS GONE (Paolo 8/2): "there's no point in having a city tab
     anymore". Both buttons opened the same panel since 7/28, so the world is
     reached through RUN now. Navigating by a button the user does not have is
     a gate testing a surface nobody can reach. */
  await page.click('.tab[data-p="run"]').catch(() => {});
  await page.waitForTimeout(14000);
  const f = page.frames().find(fr => fr.name() === 'cityFrame');
  if (!f) { console.log('  FAIL: the CITY frame never loaded'); process.exit(1); }

  const r = await f.evaluate(() => {
    const out = { cells: 0, faces: 0, doors: 0, unreachable: 0, kitFaces: 0, kitDoors: 0 };
    let n = 0;
    for (let y = 0; y < om.n && n < 24; y++) for (let x = 0; x < om.n && n < 24; x++) {
      const t = om.at(x, y); if (!t || t.district !== 'suburb') continue;
      const m = tileMeta(x, y); if (!m.sub) continue;
      n++; out.cells++;
      for (let ly = 0; ly < FN; ly++) for (let lx = 0; lx < FN; lx++) {
        const c = cellAt(x * FN + lx, y * FN + ly);
        if (!c || !c.face || !c.artPool_face) continue;
        out.faces++;
        if (c.artPool_face !== 'hdoor') continue;
        out.doors++;
        const below = (ly + 1 < FN) ? m.sub[(ly + 1) * FN + lx] : 0;
        if (below !== 3 && below !== 1) out.unreachable++;   // not on a driveway or a street
      }
    }
    // the generic districts: their dossiers declare doors as portals, so no
    // painted door may appear on a wall face there
    let k = 0;
    for (let y = 0; y < om.n && k < 12; y++) for (let x = 0; x < om.n && k < 12; x++) {
      const t = om.at(x, y); if (!t) continue;
      const m = tileMeta(x, y); if (!m.kit) continue;
      k++;
      for (let ly = 0; ly < FN; ly++) for (let lx = 0; lx < FN; lx++) {
        const c = cellAt(x * FN + lx, y * FN + ly);
        if (!c || !c.face || !c.artPool_face) continue;
        out.kitFaces++;
        if (c.artPool_face === 'hdoor') out.kitDoors++;
      }
    }
    return out;
  });

  ok('the gate actually reached real suburb plots (' + r.cells + ' cells, ' + r.faces + ' exposed house fronts)',
    r.cells >= 8 && r.faces > 200);
  ok('EVERY DOOR IS REACHABLE: all ' + r.doors + ' front doors sit on the house\'s own driveway or street ' +
    '(' + r.unreachable + ' facing a dead-dirt backyard) — the old hash put 62 of them on walls nobody could walk to',
    r.unreachable === 0);
  ok('DOORS ARE NOT WALLPAPER: ' + r.doors + ' doors across ' + r.faces + ' exposed fronts (' +
    (100 * r.doors / Math.max(1, r.faces)).toFixed(1) + '%) — a house has one front door, not one every twelve tiles',
    r.doors > 0 && r.doors / Math.max(1, r.faces) < 0.06);
  ok('GENERIC DISTRICTS PAINT NO FAKE DOORS (' + r.kitDoors + ' of ' + r.kitFaces + ' wall faces) — those ' +
    'dossiers declare their doors as portals you step through; a painted one reads enterable and is not',
    r.kitDoors === 0);

  console.log('FRONT DOOR GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
