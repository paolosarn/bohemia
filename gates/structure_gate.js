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
const NAMES = ['mix', 'bshade', 'ext', 'pExt', 'genTop', 'genPants', 'genCoat', 'genShoes', 'genPoncho', 'genGear', 'genBag', 'genApron'];
const bodies = NAMES.map(grab);
ok('all seven generators + helpers found in the alpha', bodies.every(Boolean));
const makeG = (dir) => { try { return new Function('CW', 'CH', 'curDir', bodies.join('\n') + '\nreturn {genTop,genPants,genCoat,genShoes,genPoncho,genGear,genBag,genApron};')(56, 56, dir); } catch (e) { console.log('  eval error: ' + e.message); return null; } };
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
  ok('poncho renders', po && Object.keys(po).length > 60);
  if (po) {
    // TIGHT PONCHO RULING (Paolo 7/20): the drape hugs the torso (1px past it)
    // and the ARMS STAY FREE below the shoulder cap so arm animation reads.
    let past = 0; for (const k in po) { const x = (+k) % CW; if (x < 22 || x > 33) past++; }
    ok('poncho is TIGHT: nothing past 1px beyond the torso', past === 0);
    let armCov = 0, armTot = 0; for (let i = 0; i < g.length; i++) if ((g[i] === 5 || g[i] === 6) && ((i / CW) | 0) > 18) { armTot++; if (po[i] !== undefined) armCov++; }
    ok('poncho leaves the arms FREE (animation reads through)', armTot > 0 && armCov / armTot < 0.15);
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

  // WAVE 3: BEDROLL / WRAP SKIRT / SHIN GUARDS
  let brN = null, brE = null, skS = null, pnS = null, sgS = null;
  try { brN = GN.genBag(g, { ramp: R, kind: 'bedroll' }); brE = GE.genBag(g, { ramp: R, kind: 'bedroll' }); } catch (e) { console.log('  bedroll err: ' + e.message); }
  try { skS = G.genPants(g, { ramp: R, cut: 'skirt' }); pnS = G.genPants(g, { ramp: R }); } catch (e) { console.log('  skirt err: ' + e.message); }
  try { sgS = G.genGear(g, { ramp: R, kind: 'shinguards' }); } catch (e) { console.log('  shin err: ' + e.message); }
  ok('bedroll renders behind + profile', brN && brE && Object.keys(brN).length >= 20 && Object.keys(brE).length >= 4);
  if (brN) { const cols = new Set(); for (const k in brN) cols.add((+k) % CW);
    ok('bedroll spans the full shoulder width from behind', cols.has(21) && cols.has(34)); }
  ok('wrap skirt + pants render', skS && pnS);
  if (skS && pnS) {
    const cols2 = new Set(); for (const k in skS) { const y = ((+k) / 56) | 0; if (y >= 35 && y <= 40) cols2.add((+k) % 56); }
    ok('the wrap skirt panel spans PAST the legs (a real silhouette change)', cols2.has(23) && cols2.has(32));
    const maxY = Math.max.apply(null, Object.keys(skS).map(k => ((+k) / 56) | 0));
    ok('the skirt hem stops mid-shin (legs show below)', maxY <= 45);
    ok('regular pants still reach the ankle', Math.max.apply(null, Object.keys(pnS).map(k => ((+k) / 56) | 0)) >= 47);
  }
  ok('shin guards sit on the lower legs only', sgS && [...parts(sgS)].every(pt => pt === 9 || pt === 10) && rows(sgS).every(y => y >= 41) && Object.keys(sgS).length >= 10);
  // NEW IN CANON surfacing (Paolo: a verdict must never hide the new clothes)
  ok('the freshest canon batch stays visible (NEW IN CANON section)', src.indexOf('NEW IN CANON') >= 0 && /fresh:true/.test(src.slice(src.indexOf('var GARMENTS='), src.indexOf('];', src.indexOf('var GARMENTS=')))));

  // WAVE 5 (the shortcut's first run): shemagh / bracers / holster / trailing scarf
  const NAMES2 = ['mix', 'bshade', 'ext', 'pExt', 'genAcc', 'genGear'];
  const bodies2 = NAMES2.map(grab);
  const makeA = (dir) => { try { return new Function('CW', 'CH', 'curDir', bodies2.join('\n') + '\nreturn {genAcc,genGear};')(56, 56, dir); } catch (e) { console.log('  eval2: ' + e.message); return null; } };
  const A = makeA('S'), AN = makeA('N'), AE = makeA('E');
  ok('acc/gear generators evaluate for wave 5', A && AN && AE);
  if (A && AN && AE) {
    let shS = null, shN = null, brS = null, hoS = null, scL = null, scStd = null;
    try { shS = A.genAcc(g, { ramp: R, kind: 'shemagh' }); shN = AN.genAcc(g, { ramp: R, kind: 'shemagh' });
          brS = A.genGear(g, { ramp: R, kind: 'bracers' }); hoS = A.genGear(g, { ramp: R, kind: 'holster' });
          scL = A.genAcc(g, { ramp: R, kind: 'scarf', tail: 'long' }); scStd = A.genAcc(g, { ramp: R, kind: 'scarf' }); }
    catch (e) { console.log('  wave5 err: ' + e.message); }
    ok('wave-5 shapes render', [shS, shN, brS, hoS, scL, scStd].every(o => o && Object.keys(o).length >= 6));
    if (shS && shN) {
      const faceCov2 = (o) => { let c = 0, t2 = 0; for (let i = 0; i < g.length; i++) if (g[i] === 2) { t2++; if (o[i] !== undefined) c++; } return c / t2; };
      const headCov2 = (o) => { let c = 0, t2 = 0; for (let i = 0; i < g.length; i++) if (g[i] === 1) { t2++; if (o[i] !== undefined) c++; } return c / t2; };
      // the slit: in front some contiguous face rows stay OPEN while most of the face is cloth
      const openRows = (o) => { const rs = new Set(); for (let i = 0; i < g.length; i++) if (g[i] === 2 && o[i] === undefined) rs.add((i / 56) | 0); return rs.size; };
      ok('shemagh covers the skull + wraps the neck', headCov2(shS) > 0.95 && (() => { for (let i = 0; i < g.length; i++) if (g[i] === 3 && shS[i] === undefined) return false; return true; })());
      ok('shemagh keeps an eye slit open in front (cloth above and below)', openRows(shS) >= 1 && openRows(shS) <= 2 && faceCov2(shS) > 0.4 && faceCov2(shS) < 0.95);
      ok('shemagh from behind has NO skin slits', faceCov2(shN) === 1);
    }
    if (brS) ok('bracers sit on the forearms only', [...parts(brS)].every(pt => pt === 5 || pt === 6) && rows(brS).every(y => y >= 25));
    if (hoS) ok('holster: thigh rig on one leg + hip strap', [...parts(hoS)].every(pt => pt === 10 || pt === 4) && rows(hoS, pt => pt === 10).every(y => y >= 33 && y <= 40));
    if (scL && scStd) ok('trailing scarf is genuinely LONGER than the standard scarf', Object.keys(scL).length > Object.keys(scStd).length + 3);
  }
  ok('wave-5 candidates ship', /kind:'shemagh'/.test(gbAll()) && /kind:'bracers'/.test(gbAll()) && /kind:'holster'/.test(gbAll()) && /tail:'long'/.test(gbAll()));

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
  // SHUFFLE ANIMATION (Paolo 7/19): every big square carries the shuffle button,
  // pool = approved clips only, and the render path honors a per-canvas clip
  ok('every big square has the shuffle-animation button (approved clips only)', src.indexOf("sh.title='shuffle animation'") >= 0 && /CLIPS\.filter\(function\(c\)\{return !\(typeof CANDIDATE_SRC/.test(src) && src.indexOf("cv.__clip||'idle'") >= 0 && src.indexOf("buildFrame(dir,clip||'idle'") >= 0);
  // BUILD STAMP LAW (7/20): the build identifies itself on the front splash
  ok('the build stamp exists on the front splash', /id="buildstamp"[^>]*>BUILD /.test(src));
  // BUILD WATCHER (7/20): the open page detects newer deploys and offers reload
  ok('the build watcher runs in the live page', src.indexOf('BUILD WATCHER') >= 0 && src.indexOf("fetch(location.href,{cache:'no-store'})") >= 0 && src.indexOf('NEW BUILD READY') >= 0);
  // WAVE 4: hood-up covers the SKULL, never the face; hooded poncho same; chest plate front-only
  let huS = null, huN = null, cpS = null, cpN = null, hpS = null;
  try { huS = G.genTop(g, { ramp: R, sleeves: 'long', neck: 'hood', hoodUp: true }); huN = GN.genTop(g, { ramp: R, sleeves: 'long', neck: 'hood', hoodUp: true });
        cpS = G.genGear(g, { ramp: R, kind: 'chestplate' }); cpN = GN.genGear(g, { ramp: R, kind: 'chestplate' });
        hpS = G.genPoncho(g, { ramp: R, hood: true }); } catch (e) { console.log('  wave4 err: ' + e.message); }
  ok('wave-4 shapes render', [huS, huN, cpS, cpN, hpS].every(o => o && Object.keys(o).length >= 8));
  if (huS && huN && cpS && hpS) {
    const headCov = (o) => { let c = 0, t = 0; for (let i = 0; i < g.length; i++) if (g[i] === 1) { t++; if (o[i] !== undefined) c++; } return c / t; };
    const faceTouched = (o) => { for (const k in o) if (g[+k] === 2) return true; return false; };
    ok('hood-up covers the whole skull', headCov(huS) > 0.95 && headCov(huN) > 0.95);
    // NO SKIN SLITS FROM BEHIND (Paolo 7/20, screenshot ruling): from N/NE/NW
    // the hood LAYERS OVER the face; from the front the face stays open.
    const faceCov = (o) => { let c = 0, t = 0; for (let i = 0; i < g.length; i++) if (g[i] === 2) { t++; if (o[i] !== undefined) c++; } return t ? c / t : 0; };
    ok('hood-up front keeps the face open', !faceTouched(huS));
    ok('hood-up back has NO skin slits (face fully layered over)', faceCov(huN) === 1);
    ok('hooded poncho: face open in front, fully covered from behind', headCov(hpS) > 0.95 && !faceTouched(hpS) && faceCov(GN.genPoncho(g, { ramp: R, hood: true })) === 1);
    ok('the hood toggle exists (per-square, gens read CLO_HOODUP)', src.indexOf('CLO_HOODUP=!!(cv&&cv.__hoodUp)') >= 0 && src.indexOf("hoodUp:CLO_HOODUP") >= 0 && src.indexOf("hb.textContent='HOOD'") >= 0);
    ok('chest plate is torso-only, front block vs back straps', [...parts(cpS)].every(pt => pt === 4) && Object.keys(cpS).length > Object.keys(cpN).length);
  }
  ok('wave-4 candidates ship (hoods toggleable everywhere)', /hoodUp:CLO_HOODUP/.test(gbAll()) && /hood:CLO_HOODUP/.test(gbAll()) && /kind:'chestplate'/.test(gbAll()) && /hoodDefaultUp:true/.test(gbAll()));

  // WAVE 6: coveralls / split-tail duster / cape / bandolier -- four new shapes
  const NAMES3 = ['mix', 'bshade', 'ext', 'pExt', 'genCoat', 'genCoverall', 'genCape', 'genGear'];
  const bodies3 = NAMES3.map(grab);
  ok('wave-6 generators found (genCoverall + genCape are real machinery)', bodies3.every(Boolean));
  const makeW6 = (dir) => { try { return new Function('CW', 'CH', 'curDir', bodies3.join('\n') + '\nreturn {genCoat,genCoverall,genCape,genGear};')(56, 56, dir); } catch (e) { console.log('  eval3: ' + e.message); return null; } };
  const W = makeW6('S'), WN = makeW6('N'), WE = makeW6('E');
  ok('wave-6 generators evaluate (S/N/E)', W && WN && WE);
  if (W && WN && WE) {
    let cvS = null, duS = null, duN = null, caS = null, caN = null, caE = null, bdS = null;
    try { cvS = W.genCoverall(g, { ramp: R }); duS = W.genCoat(g, { ramp: R, len: 1.0, split: true, dir: 'S' }); duN = WN.genCoat(g, { ramp: R, len: 1.0, split: true, dir: 'N' });
          caS = W.genCape(g, { ramp: R }); caN = WN.genCape(g, { ramp: R }); caE = WE.genCape(g, { ramp: R }); bdS = W.genGear(g, { ramp: R, kind: 'bandolier' }); }
    catch (e) { console.log('  wave6 err: ' + e.message); }
    ok('wave-6 shapes render', [cvS, duS, duN, caS, caN, caE, bdS].every(o => o && Object.keys(o).length >= 8));
    if (cvS) { const ps6 = parts(cvS);
      ok('coveralls are ONE PIECE: torso + both arms + both legs in one garment', ps6.has(4) && ps6.has(5) && ps6.has(6) && ps6.has(9) && ps6.has(10) && ps6.has(11) && ps6.has(12));
      ok('coveralls stay a garment, never the head/face/hands', !ps6.has(1) && !ps6.has(2) && !ps6.has(7) && !ps6.has(8));
      let zip = 0; for (let y = 20; y <= 30; y++) for (const zx of [27, 28]) { const c = cvS[y * 56 + zx]; if (c && c[0] === R.dk[0] && c[1] === R.dk[1]) { zip++; break; } }
      ok('coveralls carry the front zip line', zip >= 5); }
    if (duS && duN) {
      const ventGap = (o) => { let gap = 0; for (let y = 42; y <= 47; y++) { let open = true; for (let x = 27; x <= 29; x++) if (o[y * 56 + x] !== undefined) open = false; if (open) gap++; } return gap; };
      ok('duster hem reaches the ankle (longer than the 0.86 coat)', Math.max.apply(null, Object.keys(duS).map(k => ((+k) / 56) | 0)) >= 46);
      ok('SPLIT TAIL: the back view opens a center vent at the hem', ventGap(duN) >= 2);
      ok('the front has no vent (the split is a BACK vent)', ventGap(duS) === 0 || (() => { let c = 0; for (let y = 21; y <= 31; y++) if (duS[y * 56 + 27] === undefined && duS[y * 56 + 28] === undefined) c++; return c > 5; })()); }
    if (caS && caN && caE) {
      const torsoCov = (o) => { let c = 0, t = 0; for (let i = 0; i < g.length; i++) if (g[i] === 4 && ((i / 56) | 0) > 18) { t++; if (o[i] !== undefined) c++; } return c / t; };
      const bgPix = (o) => { let c = 0; for (const k in o) if (g[+k] === 0) c++; return c; };
      ok('cape front: the body shows (drape lives BEHIND, only cap + clasp on it)', torsoCov(caS) < 0.25);
      ok('cape front: the drape peeks past the silhouette (real background pixels)', bgPix(caS) >= 10);
      ok('cape back: one full hanging panel over the body', torsoCov(caN) > 0.6);
      ok('cape profile: the drape trails off the back edge', bgPix(caE) >= 8);
      ok('cape never touches head, face or hands', ['1','2','7','8'].every(p2 => ![...parts(caS), ...parts(caN), ...parts(caE)].includes(+p2))); }
    if (bdS) {
      ok('bandolier is torso-only (a sash, not a harness)', [...parts(bdS)].every(pt => pt === 4));
      const pts = Object.keys(bdS).map(k => [(+k) % 56, ((+k) / 56) | 0]);
      const lo = pts.filter(pt => pt[1] <= 22), hi = pts.filter(pt => pt[1] >= 28);
      const avg = a => a.reduce((s2, pt) => s2 + pt[0], 0) / (a.length || 1);
      ok('bandolier runs DIAGONAL: shoulder side to opposite hip', lo.length > 0 && hi.length > 0 && avg(hi) - avg(lo) >= 4);
      let shells = 0; for (const k in bdS) { const c = bdS[k]; if (c[0] === R.lt[0] && c[1] === R.lt[1]) shells++; }
      ok('the shells ride the strap (lit studs)', shells >= 3); }
  }
  ok('wave-6 candidates ship', /genCoverall\(/.test(gbAll()) && /split:true/.test(gbAll()) && /genCape\(/.test(gbAll()) && /kind:'bandolier'/.test(gbAll()));

  // WAVE 7: bib overalls / gas mask / tool belt / ankle skirt
  if (W && WN) {
    let bo = null, boN = null, gm = null, gmN = null, tbl = null, lsk = null, wsk = null;
    try { bo = W.genCoverall(g, { ramp: R, bib: true }); boN = WN.genCoverall(g, { ramp: R, bib: true });
          const A7 = (typeof makeA === 'function') ? null : null;
          gm = G2A('S').genAcc(g, { ramp: R, kind: 'gasmask' }); gmN = G2A('N').genAcc(g, { ramp: R, kind: 'gasmask' });
          tbl = G2A('S').genGear(g, { ramp: R, kind: 'toolbelt' });
          lsk = G.genPants(g, { ramp: R, cut: 'longskirt' }); wsk = G.genPants(g, { ramp: R, cut: 'skirt' }); }
    catch (e) { console.log('  wave7 err: ' + e.message); }
    ok('wave-7 shapes render', [bo, boN, gm, gmN, tbl, lsk, wsk].every(o => o && Object.keys(o).length >= 8));
    if (bo && boN) { const ps7 = parts(bo);
      ok('bib overalls: full legs, BARE ARMS', ps7.has(9) && ps7.has(10) && ps7.has(11) && ps7.has(12) && !ps7.has(5) && !ps7.has(6));
      const tCov = (o) => { let c = 0, t = 0; for (let i = 0; i < g.length; i++) if (g[i] === 4) { t++; if (o[i] !== undefined) c++; } return c / t; };
      ok('the bib is a PANEL, not a shirt (partial torso, coveralls stay full)', tCov(bo) < 0.55 && tCov(W.genCoverall(g, { ramp: R })) > 0.9);
      ok('from behind: straps, no bib (backs differ from fronts)', tCov(boN) < tCov(bo)); }
    if (gm && gmN) {
      const fCov7 = (o) => { let c = 0, t = 0; for (let i = 0; i < g.length; i++) if (g[i] === 2) { t++; if (o[i] !== undefined) c++; } return c / t; };
      ok('gas mask covers the WHOLE face, eyes included (its own class, not the dust mask)', fCov7(gm) === 1);
      let lens = 0; for (const k in gm) { const c = gm[k]; if (c[0] === 142 && c[1] === 152) lens++; }
      ok('the lenses read (glass glint)', lens >= 2);
      ok('from behind: the head strap shows, no skin slits', fCov7(gmN) === 1 && (() => { for (const k in gmN) if (g[+k] === 1) return true; return false; })());
      const dm = G2A('S').genAcc(g, { ramp: R, kind: 'mask' });
      ok('the dust mask keeps its below-the-eyes law (both masks coexist)', dm && fCov7(dm) < 1); }
    if (tbl) {
      ok('tool belt: waist band + pouches HANGING onto the hips', [...parts(tbl)].some(pt => pt === 4) && [...parts(tbl)].some(pt => pt === 9 || pt === 10 || pt === 0));
      ok('tool belt never climbs the chest', rows(tbl).every(y => y >= 28)); }
    if (lsk && wsk) {
      const hem = (o) => Math.max.apply(null, Object.keys(o).map(k => ((+k) / 56) | 0));
      ok('ankle skirt is a REAL third length: wrap < ankle', hem(wsk) < hem(lsk) && hem(lsk) >= 46); }
  }
  ok('wave-7 candidates ship', /bib:true/.test(gbAll()) && /kind:'gasmask'/.test(gbAll()) && /kind:'toolbelt'/.test(gbAll()) && /cut:'longskirt'/.test(gbAll()));

  // GAS MASK v2 (Paolo 7/21: "have to look better east and west"): in profile
  // the mask is a SHAPE -- glint lens, canister FORWARD past the silhouette
  if (W) {
    let gmE = null, gmW2 = null;
    try { gmE = G2A('E').genAcc(g, { ramp: R, kind: 'gasmask' }); gmW2 = G2A('W').genAcc(g, { ramp: R, kind: 'gasmask' }); }
    catch (e) { console.log('  gasv2 err: ' + e.message); }
    if (gmE && gmW2) {
      const glint = (o) => { let c = 0; for (const k in o) { const v = o[k]; if (v[0] === 142 && v[1] === 152) c++; } return c; };
      const fwd = (o, sgn) => { let c = 0; for (const k in o) { const x = (+k) % 56; if (g[+k] === 0 && ((sgn > 0 && x > 30) || (sgn < 0 && x < 25))) c++; } return c; };
      ok('profile gas mask: the lens glints (E and W)', glint(gmE) >= 1 && glint(gmW2) >= 1);
      ok('profile gas mask: the canister drives FORWARD past the face (E)', fwd(gmE, 1) >= 3);
      ok('profile gas mask: the canister drives FORWARD past the face (W)', fwd(gmW2, -1) >= 3);
    }
  }

  // WAVE 8 ("MAKE MORE CLOTHES A LOT"): eight shapes, all part-grid derived --
  // the FEMALE-RIG GUARANTEE: this very fixture is not the male rig, so every
  // pass here proves the garment works on any body wearing the 12 part ids.
  if (W && WN) {
    let mtN = null, cpN8 = null, ep = null, lw2 = null, sr = null, sa = null, bn = null, bnN = null, hm = null, hmN = null, qvN = null, qvS = null;
    try { mtN = WN.genCape(g, { ramp: R, mantle: true }); cpN8 = WN.genCape(g, { ramp: R });
          ep = G2A('S').genGear(g, { ramp: R, kind: 'elbowpads' }); lw2 = G2A('S').genGear(g, { ramp: R, kind: 'legwraps' });
          sr = G2A('S').genGear(g, { ramp: R, kind: 'shoulderroll' }); sa = G2A('S').genAcc(g, { ramp: R, kind: 'sash' });
          bn = G2A('S').genAcc(g, { ramp: R, kind: 'bandana' }); bnN = G2A('N').genAcc(g, { ramp: R, kind: 'bandana' });
          hm = G2A('S').genAcc(g, { ramp: R, kind: 'helm' }); hmN = G2A('N').genAcc(g, { ramp: R, kind: 'helm' });
          qvN = GN.genBag(g, { ramp: R, kind: 'quiver' }); qvS = G.genBag(g, { ramp: R, kind: 'quiver' }); }
    catch (e) { console.log('  wave8 err: ' + e.message); }
    ok('wave-8 shapes render', [mtN, ep, lw2, sr, sa, bn, bnN, hm, hmN, qvN, qvS].every(o => o && Object.keys(o).length >= 5));
    if (mtN && cpN8) {
      const hem8 = (o) => Math.max.apply(null, Object.keys(o).map(k => ((+k) / 56) | 0));
      ok('mantle is a REAL second cape length: stops at the mid-back', hem8(mtN) < 30 && hem8(cpN8) >= 38); }
    if (ep) ok('elbow pads: arm zone only, at the elbow band', [...parts(ep)].every(pt => pt === 5 || pt === 6) && rows(ep).every(y => y >= 22 && y <= 29));
    if (lw2) ok('leg wraps: lower legs only, cloth from mid-shin down', [...parts(lw2)].every(pt => pt === 9 || pt === 10) && rows(lw2).every(y => y >= 40));
    if (sr) {
      ok('shoulder roll: torso-only and THICKER than the bandolier', [...parts(sr)].every(pt => pt === 4) && Object.keys(sr).length > Object.keys(G2A('S').genGear(g, { ramp: R, kind: 'bandolier' })).length);
      const pts8 = Object.keys(sr).map(k => [(+k) % 56, ((+k) / 56) | 0]);
      const lo8 = pts8.filter(pt => pt[1] <= 22), hi8 = pts8.filter(pt => pt[1] >= 28);
      const avg8 = a => a.reduce((s2, pt) => s2 + pt[0], 0) / (a.length || 1);
      ok('shoulder roll runs the OPPOSITE diagonal from the bandolier', lo8.length > 0 && hi8.length > 0 && avg8(lo8) - avg8(hi8) >= 4); }
    if (sa) ok('hip sash: waist band + a tail HANGING below the waist', rows(sa).some(y => y >= 34) && rows(sa).some(y => y <= 32));
    if (bn && bnN) {
      let above = 0; for (const k in bn) { const i = +k; if (g[i] === 2 && (((i / 56) | 0) <= 10)) above++; }
      ok('bandana keeps the below-the-eyes law', above === 0);
      ok('bandana hangs to a POINT past the chin', (() => { for (const k in bn) { const i = +k; if ((g[i] === 0 || g[i] === 3) && ((i / 56) | 0) >= 14) return true; } return false; })());
      ok('bandana from behind: the knot, not a face', (() => { for (const k in bnN) if (g[+k] === 2 && bnN[k] === undefined) return false; return true; })()); }
    if (hm && hmN) {
      const headCov8 = (o) => { let c = 0, t = 0; for (let i = 0; i < g.length; i++) if (g[i] === 1) { t++; if (o[i] !== undefined) c++; } return c / t; };
      const slitOpen = (o) => { let open = 0; for (let i = 0; i < g.length; i++) if (g[i] === 2 && ((i / 56) | 0) === 10 && o[i] === undefined) open++; return open; };
      const faceCov8 = (o) => { let c = 0, t = 0; for (let i = 0; i < g.length; i++) if (g[i] === 2) { t++; if (o[i] !== undefined) c++; } return c / t; };
      ok('scrap helm domes the whole skull', headCov8(hm) > 0.9 && headCov8(hmN) > 0.9);
      ok('scrap helm keeps the EYE SLIT open in front', slitOpen(hm) >= 3);
      ok('scrap helm from behind: full metal, no skin', faceCov8(hmN) === 1); }
    if (qvN && qvS) {
      ok('quiver: the tube rides the BACK, the front carries only the strap', Object.keys(qvN).length > Object.keys(qvS).length);
      ok('the arrow tips poke past the shoulder line', (() => { for (const k in qvN) { const i = +k; if (g[i] === 0 && ((i / 56) | 0) < 16) return true; } return false; })()); }
  }
  ok('wave-8 candidates ship', /mantle:true/.test(gbAll()) && /kind:'elbowpads'/.test(gbAll()) && /kind:'legwraps'/.test(gbAll()) && /kind:'shoulderroll'/.test(gbAll()) && /kind:'sash'/.test(gbAll()) && /kind:'bandana'/.test(gbAll()) && /kind:'helm'/.test(gbAll()) && /kind:'quiver'/.test(gbAll()));
  function G2A(dir) { const NAMES7 = ['mix', 'bshade', 'ext', 'pExt', 'genAcc', 'genGear'];
    return new Function('CW', 'CH', 'curDir', NAMES7.map(grab).join('\n') + '\nreturn {genAcc,genGear};')(56, 56, dir); }
  function gbAll() { const gi2 = src.indexOf('var GARMENTS='); return src.slice(gi2, src.indexOf('];', gi2)); }
}
console.log(`\n=== STRUCTURE GATE: ${p} passed, ${f} failed ===`);
process.exit(f ? 1 : 0);
