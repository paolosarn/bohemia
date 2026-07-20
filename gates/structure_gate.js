// BOHEMIA CLOTHING STRUCTURE GATE (7/19/26). FACTORY LAW: new machinery ships
// with its own gate, same turn.
//
// STRUCTURE-NOT-COLOR LAW (Paolo 7/19: "I need to see actual different clothes,
// not just different colorways"): colorways are legal but are NEVER progress.
// This gate locks the five NEW SHAPES of cook batch 15 as real geometry, so
// they can never silently degrade into recolors of existing structures:
//   JACKET       stops at the waist (no skirt), open front, sleeves on
//   PONCHO       wider than the body, hem below the waist, neck wrapped,
//                head/face never touched
//   TALL BOOTS   the shaft climbs the shin (regular shoes stay at the ankle)
//   ROLLED       a real third sleeve length between short and long
//   GEAR         kneepads/pauldron/chestrig zone-locked to their body parts
// Extracts the REAL generators from the alpha; trusts no comments.
const fs = require('fs'), path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0; const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
if (!fs.existsSync(ALPHA)) { console.log(`\n=== STRUCTURE GATE: ${p} passed, ${f} failed ===`); process.exit(1); }
const src = fs.readFileSync(ALPHA, 'utf8');
function grab(name) {
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) return null;
  const s = src.indexOf('{', i); let d = 0;
  for (let k = s; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) return src.slice(i, k + 1); } }
  return null;
}
const NAMES = ['mix', 'bshade', 'ext', 'pExt', 'genTop', 'genCoat', 'genShoes', 'genPoncho', 'genGear', 'genBag', 'genApron'];
const bodies = NAMES.map(grab);
ok('all seven generators + helpers found in the alpha', bodies.every(Boolean));
const makeG = (dir) => { try { return new Function('CW', 'CH', 'curDir', bodies.join('\n') + '\nreturn {genTop,genCoat,genShoes,genPoncho,genGear,genBag,genApron};')(56, 56, dir); } catch (e) { console.log('  eval error: ' + e.message); return null; } };
const G = makeG('S'), GN = makeG('N'), GE = makeG('E');
ok('generators evaluate pure (S/N/E)', [G, GN, GE].every(x => x && typeof x.genBag === 'function'));

if (G) {
  const CW = 56, g = new Array(CW * CW).fill(0);
  const fill = (x0, x1, y0, y1, id) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g[y * CW + x] = id; };
  fill(27, 28, 6, 6, 1); fill(25, 30, 7, 7, 1); fill(24, 31, 8, 14, 1);   // head
  fill(25, 30, 9, 13, 2);                                                  // face
  fill(26, 29, 15, 16, 3);  fill(23, 32, 16, 32, 4);                       // neck, torso
  fill(20, 23, 18, 33, 5);  fill(32, 35, 18, 33, 6);                       // arms
  fill(24, 27, 33, 48, 9);  fill(28, 31, 33, 48, 10);                      // legs
  fill(24, 27, 49, 52, 11); fill(28, 31, 49, 52, 12);                      // feet
  const R = { dk: [40, 30, 20], mid: [90, 70, 50], lt: [140, 110, 80], mid2: [70, 55, 40], sole: [30, 24, 18] };
  const rows = (o, pred) => { const ys = []; for (const k in o) { const i = +k; if (!pred || pred(g[i])) ys.push((i / CW) | 0); } return ys; };
  const parts = (o) => { const s = new Set(); for (const k in o) s.add(g[+k]); return s; };

  // JACKET: waist hem, no skirt, open front, sleeves on
  let jk = null; try { jk = G.genCoat(g, { ramp: R, jacket: true, dir: 'S' }); } catch (e) { console.log('  jacket err: ' + e.message); }
  ok('jacket renders', jk && Object.keys(jk).length > 40);
  if (jk) { const ps = parts(jk);
    ok('jacket STOPS at the waist -- paints no legs, no background skirt', !ps.has(9) && !ps.has(10) && !ps.has(0));
    ok('jacket keeps its sleeves', ps.has(5) && ps.has(6));
    let ctr = 0; for (let y = 21; y <= 31; y++) if (jk[y * CW + 27] !== undefined || jk[y * CW + 28] !== undefined) ctr++;
    ok('jacket is OPEN down the front (clothes show)', ctr < 6);
    ok('a COAT still has a skirt (jacket is genuinely a different shape)', (() => { const c = G.genCoat(g, { ramp: R, len: 0.86, dir: 'S' }); return parts(c).has(0) || rows(c).some(y => y > 34); })());
  }

  // PONCHO: wider than the body, hem below the waist, neck wrapped, head sacred
  let po = null; try { po = G.genPoncho(g, { ramp: R }); } catch (e) { console.log('  poncho err: ' + e.message); }
  ok('poncho renders', po && Object.keys(po).length > 80);
  if (po) {
    let wide = 0; for (const k in po) { const x = (+k) % CW, y = ((+k) / CW) | 0; if (g[+k] === 0 && (x < 20 || x > 35) && y >= 17 && y <= 30) wide++; }
    ok('poncho is WIDER than the body (real background pixels past the arms)', wide >= 6);
    ok('poncho hem falls below the waist', rows(po).some(y => y >= 34));
    let neck = 0, neckTot = 0; for (let i = 0; i < g.length; i++) if (g[i] === 3) { neckTot++; if (po[i] !== undefined) neck++; }
    ok('poncho wraps the whole neck (no skin seam)', neckTot > 0 && neck === neckTot);
    ok('poncho never touches the head or face', !parts(po).has(1) && !parts(po).has(2));
  }

  // TALL BOOTS vs regular shoes
  let tall = null, low = null;
  try { tall = G.genShoes(g, { ramp: R, shaft: 'tall' }); low = G.genShoes(g, { ramp: R }); } catch (e) { console.log('  shoes err: ' + e.message); }
  ok('tall boots + regular shoes render', tall && low);
  if (tall && low) {
    const legMin = (o) => Math.min.apply(null, rows(o, (pt) => pt === 9 || pt === 10).concat([99]));
    ok('the tall shaft CLIMBS the shin (>=4 rows above the regular collar)', legMin(low) - legMin(tall) >= 4);
    ok('regular shoes stay at the ankle', legMin(low) >= 46);
  }

  // ROLLED: a real third sleeve length
  const armMax = (o) => Math.max.apply(null, rows(o, (pt) => pt === 5).concat([-1]));
  let lg = null, sh = null, rl = null;
  try { lg = G.genTop(g, { ramp: R, sleeves: 'long' }); sh = G.genTop(g, { ramp: R, sleeves: 'short' }); rl = G.genTop(g, { ramp: R, sleeves: 'rolled' }); } catch (e) { console.log('  top err: ' + e.message); }
  ok('long/short/rolled all render', lg && sh && rl);
  if (lg && sh && rl) ok('rolled is a REAL third length: short < rolled < long', armMax(sh) < armMax(rl) && armMax(rl) < armMax(lg));

  // GEAR zone locks
  let kp = null, pd = null, cr = null;
  try { kp = G.genGear(g, { ramp: R, kind: 'kneepads' }); pd = G.genGear(g, { ramp: R, kind: 'pauldron' }); cr = G.genGear(g, { ramp: R, kind: 'chestrig' }); } catch (e) { console.log('  gear err: ' + e.message); }
  ok('all three gear kinds render', [kp, pd, cr].every(o => o && Object.keys(o).length >= 6));
  if (kp && pd && cr) {
    ok('kneepads touch only the legs', [...parts(kp)].every(pt => pt === 9 || pt === 10));
    ok('kneepads sit at the knee band, not the whole leg', rows(kp).every(y => y >= 37 && y <= 44));
    ok('pauldron touches only one shoulder + its torso lip', [...parts(pd)].every(pt => pt === 6 || pt === 4) && rows(pd).every(y => y <= 22));
    ok('chest rig touches only the torso', [...parts(cr)].every(pt => pt === 4));
  }

  // WAVE 2: BAGS -- directional like the hood
  let bpS = null, bpN = null, bpE = null, stS = null;
  try { bpS = G.genBag(g, { ramp: R, kind: 'backpack' }); bpN = GN.genBag(g, { ramp: R, kind: 'backpack' }); bpE = GE.genBag(g, { ramp: R, kind: 'backpack' }); stS = G.genBag(g, { ramp: R, kind: 'satchel' }); }
  catch (e) { console.log('  bag err: ' + e.message); }
  ok('backpack renders S/N/E + satchel', [bpS, bpN, bpE, stS].every(o => o && Object.keys(o).length >= 6));
  if (bpS && bpN && bpE) {
    // back = the solid pack body over the center; front = straps beside the arms
    // with the CENTER CHEST OPEN (the shirt shows between the straps)
    ok('backpack from BEHIND is a solid pack block over the center', bpN[(21) * 56 + 27] !== undefined && bpN[(23) * 56 + 28] !== undefined && Object.keys(bpN).length >= 60);
    ok('backpack front keeps the center chest open between the straps', (() => { let c = 0; for (let y = 18; y <= 28; y++) if (bpS[y * 56 + 27] !== undefined || bpS[y * 56 + 28] !== undefined) c++; return c === 0; })());
    let out = 0; for (const k in bpE) if (g[+k] === 0) out++;
    ok('backpack PROTRUDES from the back edge in profile (real background pixels)', out >= 8);
    ok('backpack never touches the head or face', [bpS, bpN, bpE].every(o => ![...parts(o)].some(pt => pt === 1 || pt === 2)));
    ok('satchel sits at the hip (its box rows are low)', rows(stS).some(y => y >= 28) && rows(stS).every(y => y >= 16));
    // THE STRAP RULING (Paolo 7/19, canon note): front straps are REAL --
    // 2px wide beside each arm, anchored at the shoulder line
    const strapCols = new Set(); for (const k in bpS) if (g[+k] === 4) strapCols.add((+k) % CW);
    ok('backpack front straps are 2px webbing beside each arm', strapCols.has(24) && strapCols.has(25) && strapCols.has(30) && strapCols.has(31));
    ok('backpack front straps anchor at the shoulder line', rows(bpS, pt => pt === 4).includes(16));
  }
  // WAVE 2: APRON -- front panel, strings from behind
  let apS = null, apN = null;
  try { apS = G.genApron(g, { ramp: R }); apN = GN.genApron(g, { ramp: R }); } catch (e) { console.log('  apron err: ' + e.message); }
  ok('apron renders front + back', apS && apN && Object.keys(apS).length > 20);
  if (apS && apN) {
    ok('apron panel covers chest AND upper legs from the front', rows(apS, pt => pt === 4).length > 10 && rows(apS, pt => pt === 9 || pt === 10).length > 4);
    ok('apron from behind is just the strings (no panel)', Object.keys(apN).length < Object.keys(apS).length * 0.4);
    ok('apron never touches the arms', ![...parts(apS)].some(pt => pt === 5 || pt === 6));
  }
  // WAVE 2: SUSPENDERS -- torso-only straps, Y crossback
  let suS = null, suN = null;
  try { suS = G.genGear(g, { ramp: R, kind: 'suspenders' }); suN = GN.genGear(g, { ramp: R, kind: 'suspenders' }); } catch (e) { console.log('  susp err: ' + e.message); }
  ok('suspenders render front + back, torso only', suS && suN && [...parts(suS)].every(pt => pt === 4) && Object.keys(suS).length >= 10);
  // WAVE 2: TATTER -- pixels torn OUT of the silhouette
  let solid = null, torn = null;
  try { solid = G.genTop(g, { ramp: R, sleeves: 'short' }); torn = G.genTop(g, { ramp: R, sleeves: 'short', tatter: true }); } catch (e) { console.log('  tatter err: ' + e.message); }
  ok('tattered hem is REAL missing geometry (fewer pixels than the solid cut)', solid && torn && Object.keys(torn).length < Object.keys(solid).length);

  // wiring: the five shapes actually ship as cook candidates
  const gi = src.indexOf('var GARMENTS=');
  const gb = src.slice(gi, src.indexOf('];', gi));
  ok('jacket candidates ship', /jacket:true/.test(gb));
  ok('poncho candidates ship', /genPoncho\(/.test(gb));
  ok('tall boot candidates ship', /shaft:'tall'/.test(gb));
  ok('rolled-sleeve candidates ship', /sleeves:'rolled'/.test(gb));
  ok('gear candidates ship (kneepads+pauldron+chestrig)', /kind:'kneepads'/.test(gb) && /kind:'pauldron'/.test(gb) && /kind:'chestrig'/.test(gb));
  ok('wave-2 candidates ship (bags+aprons+suspenders+tatter)', /genBag\(/.test(gb) && /genApron\(/.test(gb) && /kind:'suspenders'/.test(gb) && /tatter:true/.test(gb));
  // STRUCTURE-NOT-COLOR UI LAW: colorway fillers are tagged and collapsed, never the headline
  ok('colorway entries are cw-tagged', /cw:true/.test(gb));
  ok('the UI leads with structures and collapses colorway filler', src.indexOf('COOKING - NEW STRUCTURES') >= 0 && src.indexOf('COLORWAY FILLER') >= 0);
}
console.log(`\n=== STRUCTURE GATE: ${p} passed, ${f} failed ===`);
process.exit(f ? 1 : 0);
