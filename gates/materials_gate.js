// MATERIALS GATE (8/25, WORLD lane). Was concrete_gate; it gates a TABLE now, not one material,
// and a gate named for the wrong thing is the drift this repo exists to stop.
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
const CONCRETE_FLOOR = 21;
const STEEL_FLOOR = 25;
const CHAINLINK_FLOOR = 31;
const ADOBE_FLOOR = 1;

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
    const routed = [], byCol = {}, byMat = {};
    for (const t of K.types()) {
      const sp = K.get(t); if (!sp || !sp.legend || !sp.palette) continue;
      for (const c in sp.legend) {
        const e = sp.legend[c]; if (!e) continue;
        if (K.tileLayer(e).layer !== 'structure') continue;
        const col = sp.palette[c];
        const mat = __materialOf(e);
        if (mat) { (byMat[mat] = byMat[mat] || []).push(t + ':' + c + ' ' + e.name); }
        const hit = mat === 'concrete';
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
      routed, shared, total, dam, byMat,
      hasPainter: typeof TEXKIND.concrete === 'function',
      hasSteel: typeof TEXKIND.steel === 'function',
      hasChain: typeof TEXKIND.chainlink === 'function',
      hasAdobe: typeof TEXKIND.adobe === 'function',
      /* THE VETO, BY EXAMPLE. "screen tower" is a rock screen at the quarry and a MOVIE SCREEN
         at the drive-in: one name, two objects, and one of them is a painted sheet that must
         not become corrugated steel. */
      movieScreen: __materialOf(K.get('drivein').legend[6]),
      /* CHAIN-LINK IS MATCHED ON THE NAME AND THE NAME MUST NOT SAY WALL. All three of these
         would have come in on an act-1 match and all three are wrong. */
      prisonAdmin: (K.get('prison') ? __materialOf(K.get('prison').legend[12]) : null),
      courtWall: (K.get('courthouse') ? __materialOf(K.get('courthouse').legend[20]) : null),
      jailRazor: (K.get('jail') ? __materialOf(K.get('jail').legend[8]) : null),
      tyreWall: (K.get('minigp') ? __materialOf(K.get('minigp').legend[12]) : null),
      yardFence: (K.get('railyard') ? __materialOf(K.get('railyard').legend[12]) : null),
      rockScreen: __materialOf(K.get('quarry').legend[14]),
      gantry: __materialOf(K.get('railyard').legend[13]),
      /* the discriminator, by example: a roofed building made OF concrete must stay roofed */
      store: __materialOf(K.get('commercial').legend[2]),
      warehouse: __materialOf(K.get('warehouse').legend[2]),
      damWall: __materialOf(spec.legend[2]),
      fort: __materialOf(K.get('fort').legend[2]),
    };
  });
  await browser.close();

  ok('the city page booted with no error' + (pageErr ? ' -- ' + pageErr : ''), !pageErr);
  ok('there is a MASS CONCRETE painter at all (the game had none: canopy, rock, or roof)',
     R.hasPainter);
  ok(`the concrete masses are routed and the set only GROWS (${R.routed.length} of ${CONCRETE_FLOOR})`,
     R.routed.length >= CONCRETE_FLOOR);
  ok('there is a STEEL painter -- metal is SPECULAR and concrete is not, which is most of what ' +
     'tells you a thing is metal at all', R.hasSteel);
  ok(`the steel objects are routed and the set only GROWS (${(R.byMat.steel || []).length} of ` +
     `${STEEL_FLOOR})`, (R.byMat.steel || []).length >= STEEL_FLOOR);
  ok('THE GANTRY CRANE is steel -- and its legend never once uses the word, which is why steel ' +
     'is matched on objects that are steel BY DEFINITION and concrete is matched on the word',
     R.gantry === 'steel');
  /* ONE NAME, TWO OBJECTS. This is the check that stops the steel rule eating a painted sheet. */
  ok('THE DRIVE-IN\'S "screen tower" IS A MOVIE SCREEN and does not become corrugated steel',
     R.movieScreen === null);
  ok('...while the QUARRY\'S "screen tower" -- a rock screen over the crusher -- does',
     R.rockScreen === 'steel');

  ok('THE DAM WALL routes to concrete -- the object this was found on', R.damWall === 'concrete');
  ok('A ROOFED BUILDING MADE OF CONCRETE STAYS ROOFED: commercial:2 store does not route',
     R.store === null);
  ok('...and neither does warehouse:2 tenant unit (tilt-up, and its act-1 line says concrete)',
     R.warehouse === null);
  /* ADOBE IS NOT CONCRETE, and its row sits ABOVE concrete because "adobe wall" matches the
     concrete row's NAME pattern -- first match wins, so the specific goes above the general.
     If that ordering is ever lost the fort silently becomes poured concrete, which is exactly
     the lie the row exists to stop. */
  ok('ADOBE IS ITS OWN MATERIAL: the fort\'s mud-brick curtain wall is adobe, NOT concrete ' +
     '(lift lines and calcium leaching are signatures of a POURED wall and would be a lie on ' +
     'sun-dried brick)', R.fort === 'adobe');
  ok('there is an ADOBE painter -- coursed, wobbling, no specular and NO leaching',
     R.hasAdobe);
  ok(`adobe is routed and the set only GROWS (${(R.byMat.adobe || []).length} of ${ADOBE_FLOOR})`,
     (R.byMat.adobe || []).length >= ADOBE_FLOOR);

  ok('there is a CHAIN-LINK painter -- the first material here that is mostly NOT DRAWN, ' +
     'because a fence you cannot see through is a wall', R.hasChain);
  ok(`the fences are routed and the set only GROWS (${(R.byMat.chainlink || []).length} of ` +
     `${CHAINLINK_FLOOR})`, (R.byMat.chainlink || []).length >= CHAINLINK_FLOOR);
  ok('a perimeter fence is chain-link', R.yardFence === 'chainlink');
  ok('...but prison:12 "administration" is a BUILDING that merely MENTIONS a fence, and stays ' +
     'a building', R.prisonAdmin === null);
  ok('...and courthouse:20 "secure yard wall" is masonry with wire on top, not mesh',
     R.courtWall === null);
  ok('...and jail:8 "razor wire (wall top)" is a coil on a wall, not a fence',
     R.jailRazor === null);
  ok('...and minigp:12 "tyre barrier" is a stack of tyres and waits for its own row',
     R.tyreWall === null);

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
  ok('the routing reads the LEGEND ENTRY, not the colour (__materialOf takes an entry and ' +
     'tests its name and act-1 text)',
     /function __materialOf\(entry\)/.test(src) && /entry\.act1/.test(src));
  ok('and the cell carries the answer to the renderer, the same way c.lamp and c.haz do',
     /var _mat=__materialOf\(entry\); if\(_mat\) c\.sTex=_mat;/.test(src));
  ok('ONE TABLE, MANY MATERIALS (FACTORY LAW): adding a material is a ROW, not a mechanism',
     /var MATERIALS=\[/.test(src));
  /* FIRST MATCH WINS, so the SPECIFIC must sit above the GENERAL. adobe above concrete, and
     chainlink above steel (a "catch fence" is mesh, not a mast). Asserted on the source order
     rather than trusted, because losing it is silent: the fort just quietly becomes concrete. */
  ok('THE TABLE IS ORDERED SPECIFIC-FIRST: adobe above concrete, chain-link above steel',
     src.indexOf("['adobe'") < src.indexOf("['concrete'") &&
     src.indexOf("['chainlink'") < src.indexOf("['steel'"));
  ok('APPROVED ART STILL WINS: the procedural branch sits AFTER the art-pool branches, so ' +
     'anything resolving to a judged pool keeps it',
     src.indexOf("else if(c.sTex) x.drawImage") > src.indexOf('if(_ht2){ x.drawImage'));

  for (const m of Object.keys(R.byMat).sort())
    console.log('  ' + m + ' (' + R.byMat[m].length + '): ' + R.byMat[m].join(' | '));
  console.log('MATERIALS GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
              Object.keys(R.byMat).map(m => m + ' ' + R.byMat[m].length).join(', ') +
              '; ' + R.shared + '/' + R.total + ' concrete colours shared)');
  process.exit(fail ? 1 : 0);
})();
