// CONCRETE IS NOT A ROOF GATE (8/25, WORLD lane).
//
// realizeCell hands every structure tile in every non-terrain district the APPROVED HOUSE-ROOF
// ART POOL -- `if(!KIT_TERRAIN[d]){ c.artPool='hroof'; c.tint=pal; }` -- so Hoover Dam, every
// median barrier, every bridge column and every concrete silo in the valley was wearing house
// shingles. The line already had this argument won once for limestone (__ROCK_IS_NOT_A_ROOF__,
// whose own comment even names "a concrete headwall") and exempted only the TERRAIN districts.
//
// THIS GATE EXISTS BECAUSE THE FIX IS EASY TO BREAK IN A PARTICULAR WAY. The obvious
// implementation is to key the texture off the COLOUR, the way __terrainRockCols does. Measured
// before writing it: of the 18 palette colours worn by concrete masses, only SIX are worn by
// nothing else. #9a948a is the dam wall AND a gantry crane, a busbar, a microwave mast, razor
// wire and a water tower. So the gate asserts the routing reads the LEGEND, and it asserts by
// example that a colour-keyed version would be wrong.
//
//   node gates/concrete_gate.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const REPO = path.dirname(__dirname);

// Whatever routes today may only ever GROW. A district author naming a new concrete mass gets
// it for free; nobody quietly drops one.
const ROUTED_FLOOR = 21;

(async () => {
  let pass = 0, fail = 0;
  const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  let pageErr = null;
  page.on('pageerror', e => { pageErr = pageErr || String(e).slice(0, 200); });
  await page.goto('file://' + path.join(REPO, 'slices/BOHEMIA_CITY_WORLD.html'),
                  { waitUntil: 'load' });
  await page.waitForFunction(() => typeof render === 'function', null, { timeout: 90000 });

  const R = await page.evaluate(() => {
    const K = BohemiaDistrictKit;
    const routed = [], byCol = {};
    for (const t of K.types()) {
      const sp = K.get(t); if (!sp || !sp.legend || !sp.palette) continue;
      for (const c in sp.legend) {
        const e = sp.legend[c]; if (!e) continue;
        if (K.tileLayer(e).layer !== 'structure') continue;
        const col = sp.palette[c];
        const hit = __concreteTile(e);
        if (hit) { routed.push(t + ':' + c + ' ' + e.name); if (col) (byCol[col] = byCol[col] || []).push(true); }
        else if (col) (byCol[col] = byCol[col] || []).push(false);
      }
    }
    /* HOW MANY OF THE ROUTED COLOURS ARE SHARED WITH SOMETHING THAT IS NOT CONCRETE. This is
       the number that makes a colour-keyed rule wrong, so it is measured here rather than
       asserted from memory. */
    let shared = 0, total = 0;
    for (const col in byCol) {
      const v = byCol[col];
      if (!v.some(Boolean)) continue;
      total++; if (v.some(x => !x)) shared++;
    }
    /* A tile the game actually draws, in the built valley: the dam wall. */
    let dam = null;
    for (let ty = 2; ty < om.n - 2 && !dam; ty++) for (let tx = 2; tx < om.n - 2 && !dam; tx++) {
      const t = om.at(tx, ty); if (!t || t.district !== 'dam') continue;
      let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
      if (!m || !m.kit) continue;
      for (let ly = 20; ly < FN - 20 && !dam; ly++) for (let lx = 20; lx < FN - 20; lx++) {
        if (m.kit[ly * FN + lx] !== 2) continue;
        const c = realizeCell(tx * FN + lx, ty * FN + ly);
        dam = { s: c.s || null, sTex: c.sTex || null, artPool: c.artPool || null, wallH: c.wallH || null };
        break;
      }
    }
    const spec = K.get('dam');
    return {
      routed, shared, total, dam,
      hasPainter: typeof TEXKIND.concrete === 'function',
      /* the discriminator, by example: a roofed building made OF concrete must stay roofed */
      store: __concreteTile(K.get('commercial').legend[2]),
      warehouse: __concreteTile(K.get('warehouse').legend[2]),
      damWall: __concreteTile(spec.legend[2]),
      fort: __concreteTile(K.get('fort').legend[2]),
    };
  });
  await browser.close();

  ok('the city page booted with no error' + (pageErr ? ' -- ' + pageErr : ''), !pageErr);
  ok('there is a MASS CONCRETE painter at all (the game had none: canopy, rock, or roof)',
     R.hasPainter);
  ok(`the concrete masses are routed and the set only GROWS (${R.routed.length} of ${ROUTED_FLOOR})`,
     R.routed.length >= ROUTED_FLOOR);

  ok('THE DAM WALL routes to concrete -- the object this was found on', R.damWall === true);
  ok('A ROOFED BUILDING MADE OF CONCRETE STAYS ROOFED: commercial:2 store does not route',
     R.store === false);
  ok('...and neither does warehouse:2 tenant unit (tilt-up, and its act-1 line says concrete)',
     R.warehouse === false);
  ok('ADOBE IS NOT CONCRETE: the fort\'s mud-brick curtain wall does not route (lift lines and ' +
     'calcium leaching are signatures of POURED concrete and would be a lie on it)',
     R.fort === false);

  ok('the dam wall no longer carries the APPROVED HOUSE-ROOF pool' +
     (R.dam ? ' (artPool=' + R.dam.artPool + ')' : ' -- NO DAM CELL FOUND'),
     !!R.dam && R.dam.artPool !== 'hroof');
  ok('...and it says what it is made of instead', !!R.dam && R.dam.sTex === 'concrete');
  /* WALLS ARE TWO TALL, Paolo 8/2 LOCKED: "all walls should at least be two tiles tall from
     fencing to concrete to brick whatever". The shadow height keys off the very flag this
     change removes, so losing it would flatten every concrete mass in the game. */
  ok('WALLS ARE TWO TALL (Paolo 8/2): the mass kept its height when it lost the roof pool' +
     (R.dam ? ' (wallH=' + R.dam.wallH + ')' : ''),
     !!R.dam && R.dam.wallH >= 2);

  /* A COLOUR IS NOT AN IDENTITY -- measured, not remembered. */
  ok(`most concrete colours are SHARED with something that is not concrete (${R.shared} of ` +
     `${R.total}), which is why this is routed by the legend and not by the palette`,
     R.shared > R.total / 2);
  const src = fs.readFileSync(path.join(REPO, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  ok('the routing reads the LEGEND ENTRY, not the colour (__concreteTile takes an entry and ' +
     'tests its name and act-1 text)',
     /function __concreteTile\(entry\)/.test(src) && /entry\.act1/.test(src));
  ok('and the cell carries the answer to the renderer, the same way c.lamp and c.haz do',
     /if\(__concreteTile\(entry\)\) c\.sTex='concrete';/.test(src));
  ok('APPROVED ART STILL WINS: the procedural branch sits AFTER the art-pool branches, so ' +
     'anything resolving to a judged pool keeps it',
     src.indexOf("else if(c.sTex) x.drawImage") > src.indexOf('if(_ht2){ x.drawImage'));

  console.log('  routed: ' + R.routed.join(' | '));
  console.log('CONCRETE GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
              R.routed.length + ' masses, ' + R.shared + '/' + R.total + ' colours shared)');
  process.exit(fail ? 1 : 0);
})();
