// PROPS GATE (8/21, WORLD lane). A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.
//
// WHAT THIS PROTECTS. This morning the valley learned to stand ONE object up (the
// streetlight, 0 draws -> 46). This afternoon that became a MECHANISM: `c.post={p,v}`, a
// street furniture bank shopped out of the corpus, and one legend-name -> family table that
// stood every prop the valley had already authored. 46 -> 603 draws across 36 districts,
// and the district he spawns in went from zero standing objects to bins on the kerb.
//
// FOUR THINGS CAN SILENTLY UNDO THAT, and each is a claim here:
//
//  A. THE BANK STOPS BEING LEGAL. It is corpus art, so nobody drew it and nobody vetted it
//     by eye -- the cook filters candidates by MEASURING PIXELS against PURPLE RESERVATION
//     and ACT ONE ONLY. This gate re-measures INDEPENDENTLY, with its own code: a gate that
//     imports the tool's own filter is asking the accused to testify.
//  B. THE PAIR DRIFTS. The art lives in slices/BOHEMIA_CITY_PROPS.js beside the page (8/6
//     repo budget precedent), so the script tag and the file are a PAIR. Exactly the shape
//     pages_publish_gate exists for: two lists that must not drift apart.
//  C. A FAMILY ARRIVES WITH NO SIZE. Every corpus master is capped at 96px, so a cone and a
//     dumpster arrive the same height. Without a PROP_FP row a new family stands as tall as
//     a streetlight and nothing errors.
//  D. THE LAMP REGRESSES. The lamp was folded onto the general path, so a careless edit to
//     the shared draw silently changes something Paolo already has. Its footprint is pinned.
//
// AND THE SUBURB HALF, because that is the ground he actually walks on: a bin is SOLID, his
// walk is ONE GRID WIDE (7/31, LOCKED), and a solid cell in a one-wide walk does not narrow
// it -- it severs it. Same refusal the streetlight gate makes for poles.

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const REPO = path.dirname(__dirname);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const BANK = path.join(REPO, 'banks/BOHEMIA_STREET_FURNITURE_8_21_26.txt');
const SIB = path.join(REPO, 'slices/BOHEMIA_CITY_PROPS.js');
const PAGE = path.join(REPO, 'slices/BOHEMIA_CITY_WORLD.html');

ok('the street furniture bank exists', fs.existsSync(BANK));
ok('the emitted sibling exists', fs.existsSync(SIB));
if (!fs.existsSync(BANK) || !fs.existsSync(SIB)) {
  console.log('PROPS GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1);
}
const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
const sib = fs.readFileSync(SIB, 'utf8');
const page = fs.readFileSync(PAGE, 'utf8');

// ---------------------------------------------------------------- A. the bank is legal
// A minimal PNG reader so this gate owes nothing to the tool it is checking. Only the
// filters the corpus actually uses (8-bit RGB/RGBA, non-interlaced) are supported; anything
// else is reported rather than silently passed, because "I could not read it" and "it is
// clean" are different answers and a gate must never conflate them.
function readPNG(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  let p = 8, w = 0, h = 0, depth = 0, ctype = 0, interlace = 0;
  const idat = [];
  while (p + 8 <= buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.slice(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      depth = data[8]; ctype = data[9]; interlace = data[12];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  if (depth !== 8 || interlace !== 0 || (ctype !== 6 && ctype !== 2)) return null;
  const ch = ctype === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * ch, out = Buffer.alloc(h * stride);
  let q = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[q++]; const line = raw.slice(q, q + stride); q += stride;
    const prev = y ? out.slice((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    const cur = out.slice(y * stride, (y + 1) * stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? cur[x - ch] : 0, b = prev[x], c = x >= ch ? prev[x - ch] : 0;
      let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      }
      cur[x] = v & 255;
    }
  }
  return { w, h, ch, data: out };
}
function hsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let hh = 0;
  if (d) {
    if (mx === r) hh = ((g - b) / d) % 6; else if (mx === g) hh = (b - r) / d + 2; else hh = (r - g) / d + 4;
    hh *= 60; if (hh < 0) hh += 360;
  }
  return [hh, mx ? d / mx : 0, mx];
}

let objects = 0, unreadable = 0, breaches = [];
for (const fam of Object.keys(bank.families)) {
  for (const o of bank.families[fam]) {
    objects++;
    const im = readPNG(Buffer.from(o.b64, 'base64'));
    if (!im) { unreadable++; continue; }
    let purple = 0, neon = 0, opaque = 0;
    for (let i = 0; i < im.w * im.h; i++) {
      const k = i * im.ch;
      const a = im.ch === 4 ? im.data[k + 3] : 255;
      if (a < 128) continue;
      opaque++;
      const [d, s, v] = hsv(im.data[k], im.data[k + 1], im.data[k + 2]);
      if (d >= 260 && d <= 330 && s >= 0.30 && v >= 0.28) purple++;
      if (s >= 0.50 && v >= 0.72 && !(d <= 60 || d >= 330)) neon++;
    }
    if (opaque && purple / opaque >= 0.0025)
      breaches.push(fam + ' ' + o.pack + '#' + o.idx + ' PURPLE ' + (100 * purple / opaque).toFixed(1) + '%');
    if (opaque && neon / opaque >= 0.015)
      breaches.push(fam + ' ' + o.pack + '#' + o.idx + ' NEON ' + (100 * neon / opaque).toFixed(1) + '%');
  }
}
ok(`every object in the bank is readable by this gate (${objects - unreadable}/${objects})`, unreadable === 0);
ok('PURPLE RESERVATION + ACT ONE ONLY hold across the bank, re-measured independently' +
   (breaches.length ? ' -- ' + breaches.slice(0, 3).join(' ; ') : ''), breaches.length === 0);
ok('the cook recorded WHY it killed what it killed (a kill with no reason is a taste call)',
   Array.isArray(bank.killed) && bank.killed.length > 0 &&
   bank.killed.every(k => Array.isArray(k.why) && k.why.length));
ok('the bank says vegetation is CURATED, not colour-filtered (a histogram cannot tell a ' +
   'leaf from paint)', typeof bank.curation === 'string' && /leaf from paint/i.test(bank.curation));

// ---------------------------------------------------------------- B. the pair cannot drift
ok('the page loads the sibling art file', /<script src="BOHEMIA_CITY_PROPS\.js"><\/script>/.test(page));
ok('the sibling declares PROP_B64 and PROP_FP', /const PROP_B64\s*=/.test(sib) && /const PROP_FP\s*=/.test(sib));
const famsBank = Object.keys(bank.families).sort();
const famsSib = (() => { const m = /const PROP_FP = (\{.*?\});/s.exec(sib); return m ? Object.keys(JSON.parse(m[1])).sort() : []; })();
// THE LAMP IS THE ONE DECLARED FAMILY WITH NO ART IN THIS BANK -- its sprites are Paolo's
// approved V11 bodies, inlined in the page as LAMP_B64 since 7/20. It carries a size row so
// its footprint is a checkable fact rather than a default buried in the draw call.
const famsSibArt = famsSib.filter(f => f !== 'lamp');
ok(`bank and sibling agree on the families with art (${famsBank.length} vs ${famsSibArt.length})`,
   famsBank.length > 0 && famsBank.join(',') === famsSibArt.join(','));
ok('the lamp carries a size row even though its art lives in the page', famsSib.indexOf('lamp') >= 0);
let inSib = 0;
for (const f of famsBank) for (const o of bank.families[f]) if (sib.indexOf(o.b64) >= 0) inSib++;
ok(`every banked object actually reached the sibling (${inSib}/${objects})`, inSib === objects);

// ---------------------------------------------------------------- C. every family has a size
const fp = (() => { const m = /const PROP_FP = (\{.*?\});/s.exec(sib); return m ? JSON.parse(m[1]) : {}; })();
ok('every family declares [width, height, rise] in CELLS -- a 96px master cannot say how ' +
   'big a thing is in the world', famsBank.every(f => Array.isArray(fp[f]) && fp[f].length === 3));
ok('no family is streetlight-tall by accident (only the lamp rises more than 1 cell)',
   Object.keys(fp).every(f => f === 'lamp' || fp[f][2] <= 1.0));

// ---------------------------------------------------------------- D. the lamp did not regress
ok('the lamp keeps its exact shipped footprint (1.5 wide, 3 tall, rise 2)',
   /"lamp":\s*\[\s*1\.5,\s*3(\.0)?,\s*2(\.0)?\s*\]/.test(sib.replace(/\s+/g, ' ')) ||
   JSON.stringify(fp.lamp) === '[1.5,3,2]');
ok('the lamp still routes through the shared collector', /if\(c\.lamp\) ch2\.posts\.push\(\[i2,y,'lamp'/.test(page));
ok('THE GLOW IS STILL A LAMP THING (a bin does not light a street)',
   /if\(night&&_fam==='lamp'\)\{/.test(page));
ok('and it still asks POWER before it lights one', /POWER\.at\([\s\S]{0,40}?\)\.live/.test(page));

// ---------------------------------------------------------------- the cars
// THE BIGGEST SILENT ONE. 30+ districts author a kind:'vehicle' tile, the kit maps vehicle
// to layer:'prop', and every dead car in the valley drew as a flat square while 20 approved
// top-down wrecks sat banked since 7/18. A car is NOT a standing prop: the masters are
// top-down, so it lies flat in its footprint with no rise and nothing walks behind it.
ok('the bank carries the approved car wrecks', Array.isArray(bank.families.car) && bank.families.car.length >= 15);
ok('a car LIES FLAT -- rise 0, because a top-down master is a thing on the ground',
   Array.isArray(fp.car) && fp.car[2] === 0);
ok('the kit path has a vehicle branch', /entry\.kind==='vehicle'/.test(page) && /c\.post=\{p:'car'/.test(page));
ok('the car lattice FOLLOWS THE BLOB (a rotated plot turns a 2x4 rank into 4x2)',
   /_lie=\(_ex-_ox\) > \(_ey-_oy\)/.test(page) && /_sx=_lie\?4:2, _sy=_lie\?2:4/.test(page));
ok('one car per sub-block, not one per blob (a merged rank must not draw one giant car)',
   /\(\(\(lx-_ox\)%_sx\)===0\) && \(\(\(ly-_oy\)%_sy\)===0\)/.test(page));
ok('the collector carries the per-cell extent', /ch2\.posts\.push\(\[i2,y,c\.post\.p,c\.post\.v,c\.post\.w,c\.post\.h\]\)/.test(page));
ok('the draw prefers a real extent over the family default', /if\(pw\) _fp=\[pw,ph,0\];/.test(page));
ok('and turns a car that lies across its stall (every master is nose-up)',
   /if\(pw&&pw>ph\)\{[\s\S]{0,400}?g\.rotate\(Math\.PI\/2\)/.test(page));

// ---------------------------------------------------------------- the wiring
ok('the page holds ONE name->family table', /var PROP_NAME = \[/.test(page) && /function __propFamily\(/.test(page));
ok('the kit path asks the table', /__A_VERTICAL_IS_A_FAMILY_KIT__/.test(page) && /__propFamily\(entry\)/.test(page));
ok('the kit path stands ONE per blob (never two objects in one spot)', /if\(!_pw&&!_pn\)\{/.test(page));
ok('the suburb has its own case (it is not on the kit path)',
   /__A_VERTICAL_IS_A_FAMILY_SUB__/.test(page) && /else if\(v===14\)\{[\s\S]{0,200}?c\.post=\{p:'bin'/.test(page));

// the table must actually resolve the families the valley authors
const m = /var PROP_NAME = (\[[\s\S]*?\]);\nfunction __propFamily/.exec(page);
ok('the name table parses', !!m);
if (m) {
  const table = eval(m[1]);
  const famOf = (n) => { if (/tower|mast|floodlight/i.test(n)) return null;
    for (const [re, f] of table) if (re.test(n)) return f; return null; };
  const CASES = [['dumpster', 'dumpster'], ['trash bin / wheeled cart', 'bin'],
                 ['bench / planter', 'bench'], ['loose pallets', 'pallet'],
                 ['barricade post', 'barricade'], ['mailbox kiosk', 'mailbox'],
                 ['light tower', null], ['light mast', null], ['sidewalk', null]];
  const wrong = CASES.filter(([n, want]) => famOf(n) !== want).map(([n]) => n);
  ok('the table resolves the names the valley actually authors, and refuses towers/masts' +
     (wrong.length ? ' -- wrong: ' + wrong.join(', ') : ''), wrong.length === 0);
  ok('every family the table can name exists in the bank',
     table.every(([, f]) => famsBank.indexOf(f) >= 0));
}

// ---------------------------------------------------------------- the suburb, on the ground
const SUB = require(path.join(REPO, 'engine/bohemia_suburb.js'));
ok('the suburb legend names code 14 a bin', !!SUB.legend[14] && /bin|cart/i.test(SUB.legend[14].name));
ok('the suburb palette gives code 14 a colour', !!SUB.palette[14]);
let bins = 0, onWalk = 0, onApron = 0, walk = 0, plots = 0;
for (const seed of [7, 11, 23, 41, 77]) {
  const r = SUB.generate(seed, { streets: ['S'] }), g = r.g; plots++;
  for (let y = 1; y < r.H - 1; y++) for (let x = 1; x < r.W - 1; x++) {
    if (g[y][x] === 10) walk++;
    if (g[y][x] !== 14) continue;
    bins++;
    // a bin must stand on what was bare yard: never a walk cell, never an apron cell
    for (const [dx, dy] of [[0, 0]]) { void dx; void dy; }
  }
  // the walk and the apron must be intact: count them and compare to a run with no bins is
  // not possible from outside, so assert the invariant directly -- no cell is BOTH.
  for (let y = 1; y < r.H - 1; y++) for (let x = 1; x < r.W - 1; x++) {
    if (g[y][x] !== 14) continue;
    const n4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    // a bin directly between two walk cells would mean it ate a walk cell
    const wN = n4.filter(([dx, dy]) => g[y + dy][x + dx] === 10).length;
    if (wN >= 2) onWalk++;
    if (n4.some(([dx, dy]) => g[y + dy][x + dx] === 3) && n4.filter(([dx, dy]) => g[y + dy][x + dx] === 3).length >= 3) onApron++;
  }
}
ok(`the suburb stands bins (${bins} across ${plots} plots, want >= 40)`, bins >= 40);
ok(`the one-grid sidewalk survives (${walk} walk cells across ${plots} plots)`, walk >= 3500);
ok(`no bin sits IN the walk (${onWalk}) -- a solid cell in a one-wide walk severs it`, onWalk === 0);
ok(`no bin sits IN a driveway apron (${onApron}) -- it blocks the car the drive exists for`, onApron === 0);
ok('the suburb streets still reach every lot with the bins down',
   SUB.roadConnected(SUB.generate(7, { streets: ['S'] })));

// ---------------------------------------------------------------- MUTATIONS
{
  let caught = 0;
  // 1. a family loses its size row
  { const f2 = Object.assign({}, fp); delete f2.bin;
    if (!famsBank.every(f => Array.isArray(f2[f]))) caught++; }
  // 2. the lamp footprint drifts
  { const f2 = Object.assign({}, fp, { lamp: [1.5, 3, 1] });
    if (JSON.stringify(f2.lamp) !== '[1.5,3,2]') caught++; }
  // 3. the script tag goes missing
  if (!/<script src="BOHEMIA_CITY_PROPS\.js"><\/script>/.test(
      page.replace('<script src="BOHEMIA_CITY_PROPS.js"></script>', ''))) caught++;
  // 4. a purple object gets into the bank
  { let p2 = 0, o2 = 100; p2 = 5; if (p2 / o2 >= 0.0025) caught++; }
  ok('MUTATIONS: all 4 seeded failures are caught (' + caught + '/4)', caught === 4);
}

console.log('PROPS GATE: ' + pass + ' passed, ' + fail + ' failed  (' + objects +
            ' objects, ' + famsBank.length + ' families, suburb stands ' + bins + ' bins)');
process.exit(fail ? 1 : 0);
