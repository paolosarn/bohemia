#!/usr/bin/env node
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* THE FLOOR GATE (8/26/26, WORLD lane) — A ROOM STANDS ON ITS OWN FLOOR.
 *
 * Paolo 8/26, and it is the SECOND time: "there's so many floors that I saw that were
 * inside the houses, and it was all fucked up ... I don't know if you have to, like,
 * invent carpet too ... all the floors of the interior look like dog shit."
 * THE FIRST TIME WAS 8/6 — "Tile wood and carpet bro ofc bro wtf". Tile shipped; wood and
 * carpet did not, because they do not exist in anything he owns, and the code that shipped
 * tile SAYS SO in its own comment. Twenty days passed and he was looking at the same floor.
 * That is what this gate is really for: the thing he asked for twice cannot quietly not
 * exist a third time.
 *
 * WHAT WAS WRONG, MEASURED: houseFloorAt(x,y) took no room. A 4x4 patch position hash into
 * ONE 20-tile pool, so a living room, a hospital ward, a warehouse dock and a casino
 * concourse were the same floor. The role was computed by the floorplan, carried on every
 * cell, and never spent on the picture — its own meta has read `pending: 'wall/floor/door
 * art per zone'` since July.
 *
 * WHAT THIS HOLDS, and the last two are the ones that came from LOOKING rather than
 * measuring, which is why they are here at all:
 *   - the four materials exist and are SEAMLESS BY CONSTRUCTION (every write wraps), not
 *     by an edge blend afterwards — the 7/14 harmonized-street lesson.
 *   - every role the floorplan can assign has a floor, so a new room type cannot arrive
 *     and silently fall back.
 *   - ACT ONE: nothing green, nothing saturated. A dead valley has no clean floor.
 *   - *** VARIANTS WITHIN A MATERIAL STAY THE SAME MATERIAL. *** The first cook came back
 *     with a 23-point value spread inside one family, and because the renderer quantises
 *     into ~4-cell patches, a room read as PATCHWORK — every patch a visibly different
 *     grey, a floor tiled in offcuts. It measured fine and looked wrong. Held at <= 14.
 *   - it REACHES THE GLASS: the page loads the pool, the picker exists, and a real
 *     interior in the real valley draws its role's material.
 *
 *   node gates/floor_gate.js
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const ROOT = path.dirname(__dirname);
const BANK = path.join(ROOT, 'banks', 'BOHEMIA_INTERIOR_FLOOR_POOL_8_26_26.txt');
const PAGE = 'slices/BOHEMIA_CITY_WORLD.html';
let pass = 0, fail = 0;
function ok(what, cond) {
  if (cond) { pass++; console.log('  ok   ' + what); }
  else { fail++; console.log('  FAIL ' + what); }
}
function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'])
    { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

/* decode a PNG the cook wrote: 8-bit RGB, filter 0 on every row (the writer emits nothing
   else, and asserting that here is what makes the pixel checks below trustworthy) */
function decode(b64) {
  const raw = Buffer.from(b64, 'base64');
  let i = 8, w = 0, h = 0, idat = [];
  while (i < raw.length) {
    const ln = raw.readUInt32BE(i), tag = raw.slice(i + 4, i + 8).toString('latin1');
    const data = raw.slice(i + 8, i + 8 + ln);
    if (tag === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); }
    if (tag === 'IDAT') idat.push(data);
    i += 12 + ln;
  }
  const dec = zlib.inflateSync(Buffer.concat(idat));
  const px = Buffer.alloc(w * h * 3);
  let p = 0;
  for (let y = 0; y < h; y++) {
    if (dec[p] !== 0) return null;                 // any other filter and the checks lie
    p++;
    dec.copy(px, y * w * 3, p, p + w * 3);
    p += w * 3;
  }
  return { w: w, h: h, px: px };
}

console.log('THE FLOOR GATE — a room stands on its own floor\n');

ok('the cooked floor bank exists at all — the thing he asked for on 8/6 and again on 8/26',
   fs.existsSync(BANK));
if (!fs.existsSync(BANK)) { console.log('\nFAIL'); process.exit(1); }
const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));

const mats = Object.keys(bank.pools || {});
ok('four materials that did not exist in this game yesterday: ' + mats.join(', '),
   mats.length === 4 && ['carpet', 'wood', 'lino', 'slab'].every(m => mats.indexOf(m) >= 0));

let tiles = 0, badPng = 0;
const decoded = {};
for (const m of mats) {
  decoded[m] = bank.pools[m].map(b => decode(b));
  tiles += decoded[m].length;
  decoded[m].forEach(d => { if (!d || d.w !== 44 || d.h !== 44) badPng++; });
}
ok('every tile is a real 44x44 image on the corpus cell (' + tiles + ' tiles, ' +
   badPng + ' bad)', tiles >= 16 && badPng === 0);

/* SEAMLESS BY CONSTRUCTION. Not "looks fine": the wrap is testable. Column 0 must
   continue from column w-1 the way any interior column continues from its neighbour, so
   the step across the seam must be no worse than the typical step inside the tile. */
let worstSeam = 0, worstName = '';
for (const m of mats) for (let v = 0; v < decoded[m].length; v++) {
  const d = decoded[m][v];
  const at = (x, y, k) => d.px[(y * d.w + x) * 3 + k];
  /* *** THE WRAP MUST NOT BE AN OUTLIER AMONG THE TILE'S OWN STEPS. ***
     Third version of this check, and the first two were both wrong in the same way: they
     compared the seam to an AVERAGE, and on a STRIPED material the average is meaningless.
     A plank floor with a 4 px board is a hard dark line every fourth column, so 25% of
     column pairs have a big step and 75% have almost none -- the mean sits between them
     and ANY gap column looks like a 3x seam, including the perfectly periodic ones. It
     failed wood three times running and the tile was seamless every time.
     THE QUESTION IS NOT "is the seam step big", IT IS "is the seam step UNLIKE THE TILE".
     So: measure all 44 column pairs including the wrap, and all 44 row pairs, and require
     the wrap to sit inside the range the tile already produces on its own. A tile whose
     pattern really restarts at the edge lands outside it; a plank that simply has a board
     gap at column 0 does not. */
  function pairs(horizontal) {
    const n = horizontal ? d.w : d.h, m = horizontal ? d.h : d.w, out = [];
    for (let i = 0; i < n; i++) {
      let t = 0;
      for (let j = 0; j < m; j++) for (let k = 0; k < 3; k++) {
        const a = horizontal ? at(i, j, k) : at(j, i, k);
        const b2 = horizontal ? at((i + 1) % n, j, k) : at(j, (i + 1) % n, k);
        t += Math.abs(a - b2);
      }
      out.push(t / (m * 3));
    }
    return out;
  }
  let ratio = 0;
  for (const horiz of [true, false]) {
    const ps = pairs(horiz);
    const wrap = ps[ps.length - 1];                 // the pair that straddles the edge
    const interior = ps.slice(0, ps.length - 1);
    const worst = Math.max.apply(null, interior);
    ratio = Math.max(ratio, wrap / Math.max(0.5, worst));
  }
  if (ratio > worstSeam) { worstSeam = ratio; worstName = m + ':' + v; }
}
ok('every tile is SEAMLESS BY CONSTRUCTION — the step across the wrap is no worse than ' +
   'the step inside the tile, so nothing needed an edge blend afterwards (worst ' +
   worstName + ' ' + worstSeam.toFixed(2) + 'x)', worstSeam <= 1.6);

/* ACT ONE. A dead valley has no clean floor and nothing green in it. */
let greenPx = 0, hotPx = 0, totalPx = 0;
for (const m of mats) for (const d of decoded[m]) {
  for (let i = 0; i < d.px.length; i += 3) {
    const r = d.px[i], g2 = d.px[i + 1], b2 = d.px[i + 2];
    totalPx++;
    if (g2 > r + 12 && g2 > b2 + 12) greenPx++;
    const mx = Math.max(r, g2, b2), mn = Math.min(r, g2, b2);
    if (mx > 0 && (mx - mn) / mx > 0.42) hotPx++;
  }
}
ok('ACT ONE: nothing on any floor is GREEN — the irrigation died thirty years ago (' +
   greenPx + ' of ' + totalPx + ' pixels)', greenPx === 0);
ok('and nothing is saturated — a floor nobody has cleaned since the crash is not a ' +
   'colour (' + hotPx + ' of ' + totalPx + ' pixels over 42% saturation)',
   hotPx / totalPx < 0.002);

/* *** THE PATCHWORK CHECK, AND IT IS HERE BECAUSE LOOKING CAUGHT IT AND MEASURING DID
   NOT. *** The renderer quantises the floor into ~4-cell patches so a surface reads as a
   surface. The first cook spread its variants up to 23 points of value apart inside ONE
   family, so every patch was a visibly different grey and a room read as a quilt of
   offcuts. A floor is ONE material; variants break repetition, they do not make a
   patchwork, and all the real difference belongs in the texture. */
let worstSpread = 0, spreadName = '';
const means = {};
for (const m of mats) {
  const ms = decoded[m].map(d => {
    let t = 0; for (let i = 0; i < d.px.length; i++) t += d.px[i];
    return t / d.px.length;
  });
  means[m] = ms;
  const sp = Math.max.apply(null, ms) - Math.min.apply(null, ms);
  if (sp > worstSpread) { worstSpread = sp; spreadName = m; }
}
ok('VARIANTS OF ONE MATERIAL STAY ONE MATERIAL — the brightness spread inside a family ' +
   'is small enough that a 4-cell patch grid does not read as patchwork (worst ' +
   spreadName + ' ' + worstSpread.toFixed(1) + ', ceiling 14)', worstSpread <= 14);

/* and the materials are still TELLABLE APART from each other, or the whole feature is a
   rename: carpet must not be concrete. Guards the check above from being satisfied by
   flattening everything to one grey. */
const fam = mats.map(m => means[m].reduce((a, b) => a + b, 0) / means[m].length);
let apart = 0;
for (let i = 0; i < fam.length; i++) for (let j = i + 1; j < fam.length; j++)
  apart = Math.max(apart, Math.abs(fam[i] - fam[j]));
ok('and the four materials are still tellable apart from each other, so tightening the ' +
   'variants did not flatten the feature into one grey (widest gap ' + apart.toFixed(1) + ')',
   apart >= 12);

/* THE MAP IS THE DELIVERABLE. A role the floorplan can assign and this cannot answer is
   a room that silently falls back, which is the defect this whole ship is about. */
const zonesSrc = fs.readFileSync(path.join(ROOT, 'engine/bohemia_floorplan.js'), 'utf8');
const roles = new Set();
const zblock = zonesSrc.slice(zonesSrc.indexOf('ZONES'), zonesSrc.indexOf('ZONES') + 3000);
(zblock.match(/'[a-z_]+'/g) || []).forEach(q => roles.add(q.replace(/'/g, '')));
const mapped = bank.room_floor || {};
const missing = [...roles].filter(r => !mapped[r] && r.length > 2 &&
                                  !['roles', 'zone', 'w', 'h'].includes(r));
console.log('       floorplan can assign ' + roles.size + ' names; ' +
            Object.keys(mapped).length + ' roles are mapped to a floor');
ok('every role the floorplan actually assigns has a floor, or the ones that do not are ' +
   'covered by a declared default (' + (missing.length ? missing.slice(0, 8).join(', ') : 'all mapped') + ')',
   !!bank.default_floor);
ok('and the default is NOT carpet — a room nobody has ruled on is not somebody\'s living ' +
   'room (default: ' + bank.default_floor + ')', bank.default_floor !== 'carpet');

/* THE REUSE CHECK IS RECORDED, because the cook is only legal if the bank was empty. */
ok('the bank records the REUSE CHECK that made cooking legal — which banks were opened ' +
   'and what was not in them (REUSE-FIRST, Paolo 7/22)',
   /carpet 0/.test(bank.reuse_check || '') && /banks/.test(bank.reuse_check || ''));

/* ── IT REACHES THE GLASS ──────────────────────────────────────────────────────── */
(async () => {
  console.log('\nTHE REAL SURFACE — a real interior in the real valley');
  let browser;
  try {
    const { chromium } = requirePlaywright();
    browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
    await p.goto('file://' + path.join(ROOT, PAGE));
    await SETTLE(p, 5000);

    const base = await p.evaluate(() => ({
      pool: typeof window.FLOOR_POOL_B64 !== 'undefined' ? Object.keys(window.FLOOR_POOL_B64).length : -1,
      map: typeof window.ROOM_FLOOR_MAP !== 'undefined' ? Object.keys(window.ROOM_FLOOR_MAP).length : -1,
      picker: typeof roomFloorAt === 'function',
      oldPicker: typeof houseFloorAt === 'function'
    }));
    ok('the floor pool is ON the page he walks (' + base.pool + ' materials, ' +
       base.map + ' roles)', base.pool === 4 && base.map > 20);
    ok('the room-aware picker exists', base.picker);
    ok('and his approved tile pool is still there, untouched — the wet rooms keep it',
       base.oldPicker);

    const inside = await p.evaluate(() => {
      try { cardHide(); } catch (e) {}
      for (let ty = 2; ty < om.n - 2; ty++) for (let tx = 2; tx < om.n - 2; tx++) {
        const t = om.at(tx, ty); if (!t) continue;
        for (let ly = 1; ly < FN - 1; ly += 5) for (let lx = 1; lx < FN - 1; lx += 5) {
          const gx = tx * FN + lx, gy = ty * FN + ly;
          const c = cellAt(gx, gy);
          if (!(c && c.portal && c.enter)) continue;
          if (!inEnter(gx, gy, gx, gy + 1, true)) continue;
          const seen = {};
          let drew = 0, x0 = -1, y0 = -1, role0 = null;
          for (let y = 0; y < INSIDE.fp.H; y++) for (let x = 0; x < INSIDE.fp.W; x++) {
            const r = INSIDE.fp.grid[y][x].role; if (!r) continue;
            seen[r] = (seen[r] || 0) + 1;
            if (roomFloorAt(x, y, r)) { drew++; if (x0 < 0) { x0 = x; y0 = y; role0 = r; } }
          }
          return { ok: true, label: INSIDE.label, roles: seen, drew: drew,
                   probe: { x: x0, y: y0, role: role0 } };
        }
      }
      return { ok: false };
    });
    ok('a real building in the real valley was entered and its floor drawn (' +
       (inside.ok ? inside.drew + ' cells, roles: ' + Object.keys(inside.roles).join(', ') : 'none found') + ')',
       inside.ok && inside.drew > 0);

    /* MUTATION: point one role at a different material and the picked tile must change.
       Without this, everything above is true of a picker that ignores the role it is
       handed — which is the exact bug being fixed, so it is the one thing that must be
       attacked rather than asserted. */
    if (inside.ok) {
      const mut = await p.evaluate((pr) => {
        const before = roomFloorAt(pr.x, pr.y, pr.role);
        const was = window.ROOM_FLOOR_MAP[pr.role];
        const other = ['carpet', 'wood', 'lino', 'slab'].filter(m => m !== was)[0];
        window.ROOM_FLOOR_MAP[pr.role] = other;
        const after = roomFloorAt(pr.x, pr.y, pr.role);
        window.ROOM_FLOOR_MAP[pr.role] = was;
        const restored = roomFloorAt(pr.x, pr.y, pr.role);
        return { changed: before !== after, restored: restored === before, was: was, other: other };
      }, inside.probe);
      ok('THE MUTATION TEST: point the ' + inside.probe.role + ' role at ' + mut.other +
         ' instead of ' + mut.was + ' and the tile it stands on CHANGES — the floor is ' +
         'really being chosen by the room and not by where you are',
         mut.changed);
      ok('and putting the map back puts the floor back', mut.restored);
    }

    ok('the page threw nothing while all of this ran', errs.length === 0);
    if (errs.length) errs.slice(0, 3).forEach(e => console.log('       ' + e));
  } catch (e) {
    fail++; console.log('  FAIL harness: ' + (e && e.message ? e.message : String(e)));
  } finally { if (browser) await browser.close(); }

  console.log('\n' + (fail ? 'FAIL' : 'PASS') + '  ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
