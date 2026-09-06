/* DOES THE BORDER WEAR ITS COLOUR WHERE HE WALKS?  (COOK, [border marked], 9/6/26)
 *
 * Measured on the real surface -- the alpha's RUN tab, the city frame the player is
 * actually inside -- never on a table read out of the source.
 *
 * THE THREE QUESTIONS:
 *   1. do border walls carry the mark at all, and how many?
 *   2. does an INTERIOR wall ever carry one? (it must not: the mark is the edge)
 *   3. is the ink the HOLDER's own measured colour, faction by faction?
 *
 *   node tools/bohemia_border_paint_probe_9_6_26.js
 */
'use strict';
const path = require('path');
const { settle: SETTLE } = require(path.dirname(__dirname) + '/gates/bohemia_settle.js');
const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
function pw() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message.slice(0, 160)));
  await page.goto('file://' + ALPHA);
  await page.waitForSelector('#front', { timeout: 40000 });
  await page.click('#front');
  await SETTLE(page, 1200);
  await page.click('.tab[data-p="run"]');
  await SETTLE(page, 22000);
  const fr = await (await page.$('#cityFrame')).contentFrame();

  const R = await fr.evaluate(() => {
    if (typeof turfGrid !== 'function' || typeof cellAt !== 'function')
      return { err: 'no turfGrid/cellAt' };
    const g = turfGrid();
    if (!g || !g.own) return { err: 'no turf grid' };
    const n = g.n;
    const isEdge = (tx, ty) => {
      const me = g.own[ty * n + tx]; if (!me) return false;
      if (tx > 0 && g.own[ty*n+tx-1] && g.own[ty*n+tx-1] !== me) return true;
      if (tx < n-1 && g.own[ty*n+tx+1] && g.own[ty*n+tx+1] !== me) return true;
      if (ty > 0 && g.own[(ty-1)*n+tx] && g.own[(ty-1)*n+tx] !== me) return true;
      if (ty < n-1 && g.own[(ty+1)*n+tx] && g.own[(ty+1)*n+tx] !== me) return true;
      return false;
    };
    /* SAMPLE BOTH KINDS, and enough of each that a zero means something. Tiles are
       built on demand, so this asks for them the way a walk does. */
    /* SPREAD ACROSS THE WHOLE VALLEY, NOT THE FIRST TWELVE. The first run of this took
       border cells in scan order and got twelve from the top three rows -- solar farm,
       freeway and mountain -- which is the valley's rim and not where anybody lives. A
       sample that only sees the rim cannot answer a question about the suburbs. */
    const allEdge = [], allIn = [];
    for (let ty = 0; ty < n; ty++) for (let tx = 0; tx < n; tx++) {
      if (!g.own[ty*n+tx]) continue;
      (isEdge(tx, ty) ? allEdge : allIn).push([tx, ty]);
    }
    const spread = (a, k) => { const o = []; if (!a.length) return o;
      const st = Math.max(1, Math.floor(a.length / k));
      for (let i = 0; i < a.length && o.length < k; i += st) o.push(a[i]);
      return o; };
    const edges = spread(allEdge, 16), inners = spread(allIn, 16);
    /* THE CELLS ARE BUILT ON DEMAND BY cellAt(), which is what a walk calls; asking
       tileMeta for them returns the kit CODES and no cells at all, which is how the
       first run of this probe reported zero of everything on a working build. */
    const look = (list) => {
      let tiles = 0, walls = 0, marks = 0; const inks = {}, whos = {};
      for (const [tx, ty] of list) {
        tiles++;
        for (let ly = 0; ly < FN; ly++) for (let lx = 0; lx < FN; lx++) {
          let c = null; try { c = cellAt(tx * FN + lx, ty * FN + ly); } catch (e) { continue; }
          if (!c) continue;
          if (c.s && c.face) walls++;
          if (c.turfMark) { marks++; inks[c.turfMark.ink] = (inks[c.turfMark.ink]||0)+1;
                            whos[c.turfMark.who] = (whos[c.turfMark.who]||0)+1; }
        }
      }
      return { tiles, walls, marks, inks, whos };
    };
    const E = look(edges), I = look(inners);
    /* HOW MUCH OF THE BORDER CAN THIS REACH AT ALL? The mark is set on the DISTRICT KIT
       path, which needs a kit legend to know a fence from a window. Districts drawn by
       the older parametric route have no legend, so the branch never sees them -- and
       that is the difference between "the border is painted" and "some of it is". */
    let kitted = 0, bare = 0; const bareKinds = {};
    for (let i = 0; i < allEdge.length; i += 7) {
      const [tx, ty] = allEdge[i];
      let m = null; try { m = tileMeta(tx, ty); } catch (e) { continue; }
      if (m && m.kitSpec && m.kitSpec.legend) kitted++;
      else { bare++; const d = (m && m.d) || '?'; bareKinds[d] = (bareKinds[d]||0)+1; }
    }
    /* AND THE NUMBER THAT ACTUALLY MATTERS, WHICH IS NOT A SHARE OF EVERY WALL IN A
       128x128 NEIGHBOURHOOD. Per BORDER cell: what kind of ground is it, how many wall
       faces stand in the band that faces the rival, and how many carry the mark. The
       first version of this re-derived "plain wall" from a c.legend field that does not
       exist and reported 0 eligible walls with 130 painted -- a ruler contradicting
       itself in one line. */
    const band = Math.max(4, FN >> 3);
    const cells = [];
    for (const [tx, ty] of edges) {
      const me = g.own[ty*n+tx];
      const W = tx>0 && g.own[ty*n+tx-1] && g.own[ty*n+tx-1] !== me;
      const E2 = tx<n-1 && g.own[ty*n+tx+1] && g.own[ty*n+tx+1] !== me;
      const N2 = ty>0 && g.own[(ty-1)*n+tx] && g.own[(ty-1)*n+tx] !== me;
      const S2 = ty<n-1 && g.own[(ty+1)*n+tx] && g.own[(ty+1)*n+tx] !== me;
      let faces = 0, marks2 = 0;
      for (let ly = 0; ly < FN; ly++) for (let lx = 0; lx < FN; lx++) {
        const near = (lx<band&&W)||(lx>=FN-band&&E2)||(ly<band&&N2)||(ly>=FN-band&&S2);
        if (!near) continue;
        let c = null; try { c = cellAt(tx*FN+lx, ty*FN+ly); } catch (e) { continue; }
        if (!c) continue;
        if (c.s && c.face) faces++;
        if (c.turfMark) marks2++;
      }
      let dd = '?'; try { const mm = tileMeta(tx, ty); dd = (mm && mm.d) || '?'; } catch (e) {}
      cells.push({ tx, ty, d: dd, who: me, faces, marks: marks2 });
    }
    cells.sort((a, b) => b.marks - a.marks);
    /* AND THE INK IS HIS: every colour drawn must be the holder's own measured hue. */
    const C = (window.BOHEMIA_FACTION_COLOURS || {}).factions || {};
    const wrong = [];
    for (const who in E.whos) if (!C[who]) wrong.push(who);
    return { n, edgeCells: edges.length, innerCells: inners.length, E, I, wrong,
             haveColours: Object.keys(C).length, band, cells,
             allEdge: allEdge.length, allIn: allIn.length, kitted, bare, bareKinds };
  });

  await b.close();
  if (errs.length) console.log('page errors: ' + errs.slice(0, 3).join(' | '));
  if (R.err) { console.log('PROBE FAILED: ' + R.err); process.exit(1); }

  console.log('\nDOES THE BORDER WEAR ITS COLOUR WHERE HE WALKS?');
  console.log('  valley ' + R.n + 'x' + R.n + ', ' + R.haveColours + ' faction colours reachable');
  console.log('  ' + R.allEdge + ' border cells and ' + R.allIn + ' interior cells in the valley;');
  console.log('  sampled ' + R.edgeCells + ' and ' + R.innerCells + ' of them, spread across it\n');
  const row = (nm, o) => console.log('    ' + nm.padEnd(10) + String(o.tiles).padStart(4) +
    ' tiles  ' + String(o.walls).padStart(6) + ' wall faces  ' + String(o.marks).padStart(5) +
    ' painted  ' + (o.walls ? (100*o.marks/o.walls).toFixed(1) : '0.0') + '%');
  row('BORDER', R.E);
  row('INTERIOR', R.I);
  console.log('\n  the colours drawn on the border, by holder:');
  for (const w of Object.keys(R.E.whos).sort((a,c)=>R.E.whos[c]-R.E.whos[a]))
    console.log('    ' + w.padEnd(14) + String(R.E.whos[w]).padStart(4) + ' marks');
  console.log('\n  EVERY SAMPLED BORDER CELL: what ground it is, wall faces standing in the');
  console.log('  band that faces the rival, and how many of them carry the mark.');
  console.log('    ' + 'cell'.padEnd(10) + 'ground'.padEnd(14) + 'holder'.padEnd(13) +
    'faces'.padStart(7) + 'marks'.padStart(7));
  for (const c of R.cells)
    console.log('    ' + (c.tx + ',' + c.ty).padEnd(10) + String(c.d).padEnd(14) +
      String(c.who).padEnd(13) + String(c.faces).padStart(7) + String(c.marks).padStart(7));
  const dry = R.cells.filter(c => c.faces === 0).length;
  console.log('\n  ' + dry + ' of ' + R.cells.length + ' border cells have NO wall face in the band at all' +
    (dry ? ' -- nothing there to paint' : ''));
  console.log('\n  HOW MUCH OF THE BORDER THIS CAN REACH (every 7th border cell, ' +
    (R.kitted + R.bare) + ' sampled):');
  console.log('    ' + R.kitted + ' have a district kit legend, so the mark can see them');
  console.log('    ' + R.bare + ' are drawn the older parametric way and carry no legend:');
  for (const k of Object.keys(R.bareKinds).sort((a,c)=>R.bareKinds[c]-R.bareKinds[a]))
    console.log('      ' + k.padEnd(14) + R.bareKinds[k]);
  console.log('\n  INTERIOR WALLS PAINTED: ' + R.I.marks + (R.I.marks ? '   <-- WRONG, the mark is the EDGE' : '   (correct: the mark is the edge)'));
  if (R.wrong.length) console.log('  INK NOT FROM HIS WARDROBE: ' + R.wrong.join(', '));
})();
