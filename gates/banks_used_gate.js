/* BOHEMIA BANKS-USED GATE (7/28/26) — APPROVED-BUT-UNUSED IS A DEFECT, and now
 * the machine says so.
 *
 * > "Is it possible as you're making any of the assets for the run? You're
 * >  completely not checking out the rest of the whole project catalog for
 * >  assets that are approved that you should work with"   — Paolo, 7/28
 *
 * THE HOLE THIS CLOSES. The SHOPPING LAW already says approved-but-unused is a
 * defect (laws/BOHEMIA_ADDENDUM_APPROVED_ASSETS_FIRST_7_26_26.md) and its own
 * text marks the enforcement machine "queued". Queued is not enforced. So the
 * same bug shipped TWICE: his 13 suburb border walls were decoded-on-load and
 * never drawn until 7/28, and his 30 house skins are decoded-on-load and never
 * drawn right now. The builder even ASSERTS the banks are PRESENT —
 *   throw new Error('the lifted art block is missing one of the approved banks')
 * — and nothing anywhere asserted they were USED. Present-and-unused passed
 * every gate in the repo, twice, which is the whole reason it happened twice.
 *
 * PRESENCE IS NOT USE. This gate boots the real run, patches drawImage, tags
 * every approved bank's image objects, draws real frames INSIDE the house and
 * OUT on the block, and counts draws per bank. A bank that is loaded and draws
 * ZERO pixels is a defect.
 *
 * WHY IT SHIPS WITH A WAIVER INSTEAD OF RED. There is exactly one bank in that
 * state today — the house skins — and fixing it is BLOCKED ON PAOLO'S PICK
 * (backlog 0P: his skins are flat textures with no corner/eave variants, so a
 * wholesale swap hands back his materials and takes away the massing he just
 * said he liked; three options are written up for him). A gate cannot force a
 * director's call. So the known defect is WAIVED BY NAME, tied to the backlog
 * item, and everything else is enforced hard: any OTHER loaded-and-unused bank
 * is an instant fail, and the day he picks, the waiver comes out and this bank
 * is enforced like the rest. A waiver with a name and a ticket is a debt on the
 * books; silence is how this shipped twice.
 *
 *   node gates/banks_used_gate.js
 */
'use strict';
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RUN = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

/* THE WAIVER LIST. By name, with the reason and the ticket. Delete an entry the
   moment its bank draws; never add one without a backlog item. */
const WAIVED = {
  /* THE HOUSE SKINS WAIVER IS GONE, 7/28, and this gate is why I deleted it: it
     failed with "delete it if not" the moment the bank started drawing.
     They draw now - 491 draws in this gate's own sweep. The massing worry the
     waiver named was real and it was answered rather than ignored: ONLY the
     field tiles wear his skins (the flat middle of a wall, the straight roof
     run, the open yard) and every tile that carries SHAPE keeps the target set
     (base course, eave shadow, corners, window, boarded, all four hips, the
     garage). Measured on the block: the CBB tileset went 83% -> 17%.
     Still open and filed, NOT waived here because it is a look call and not an
     unused bank: the four roof HIP tiles are still the target set's orange
     against his shingle roof (backlog 0S). */
  'walk-file door art (superseded)':
    'backlog 0Q — SUPERSEDED, not missing. The approved animated door bank ' +
    '(7/13, 2 tiles tall) replaced this on 7/26 and IS drawing. These 9 ride ' +
    'along because the builder lifts the walk surface\'s art block VERBATIM, ' +
    'which is that builder\'s contract. Dropping them is a payload cleanup in ' +
    'the builder\'s own lane, not a rendering defect.',
};

const PROBE = `(() => {
  const P = CanvasRenderingContext2D.prototype, orig = P.drawImage;
  const rec = { on:false, by:{} };
  window.__BANKS = rec;
  P.drawImage = function (img, ...a) {
    if (rec.on) { try { const t = (img && img.__srcTag) || 'untagged';
      rec.by[t] = (rec.by[t] || 0) + 1; } catch(e){} }
    return orig.apply(this, [img, ...a]);
  };
})();`;

(async () => {
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  let res = null;
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.addInitScript(PROBE);
    await page.goto('file://' + RUN, { waitUntil: 'load', timeout: 180000 });
    await page.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 180000 });
    await page.waitForTimeout(6000);          // let every bank finish decoding

    res = await page.evaluate(() => {
      const tag = (arr, name) => { let n = 0; try { (arr || []).forEach(o => {
        if (o && o.tagName === 'IMG') { o.__srcTag = name; n++; }
        else if (o && typeof o === 'object') Object.values(o).forEach(v => {
          if (v && v.tagName === 'IMG') { v.__srcTag = name; n++; } });
      }); } catch (e) {} return n; };

      /* every APPROVED bank the run loads, by the name Paolo would recognise */
      const loaded = {};
      /* ACCUMULATE, never overwrite: his house skins arrive as three arrays
         under one bank name, and assigning would have reported 3 images where
         there are 21 - understating the very debt this gate exists to show. */
      const put = (name, arr) => { const n = tag(arr, name); if (n) loaded[name] = (loaded[name] || 0) + n; };
      if (typeof TT        !== 'undefined') put('the CBB target tileset (42)', Object.values(TT));
      /* his 7/21 house skins arrive as three arrays but they are ONE bank and
         one decision, so they are counted as one */
      if (typeof ROOF_IMG  !== 'undefined') put('house skins (7/21 UP — roof + wall + yard)', ROOF_IMG);
      if (typeof WALL_IMG  !== 'undefined') put('house skins (7/21 UP — roof + wall + yard)', WALL_IMG);
      if (typeof YARD_IMG  !== 'undefined') put('house skins (7/21 UP — roof + wall + yard)', YARD_IMG);
      if (typeof PERIM_IMG !== 'undefined') put('suburb border walls (13, approved 7/28)', PERIM_IMG);
      /* BOUGHT BEATS PAINTED (Paolo 7/31): the library he PAID FOR. This gate
         was written for 'approved-but-unused is a defect' and was never pointed
         at his purchased art, which is exactly how 98 pavement tiles sat unused
         until he noticed himself. */
      if (typeof BOUGHT_WALK_IMG !== 'undefined') put('HIS bought concrete (sidewalk + driveway)', BOUGHT_WALK_IMG);
      if (typeof BOUGHT_ROAD_IMG !== 'undefined') put('HIS bought cracked street (road)', BOUGHT_ROAD_IMG);
      /* DOOR_IMGS (with the S) is the approved animated bank that actually
         draws; DOOR_IMG is the older walk-file art it superseded. Two different
         things one letter apart, and conflating them would have reported the
         live bank as dead. */
      if (typeof DOOR_IMGS !== 'undefined') put('animated door bank (7/13, 2 tiles tall)', DOOR_IMGS);
      if (typeof DOOR_IMG  !== 'undefined') put('walk-file door art (superseded)', DOOR_IMG);
      if (typeof IP        !== 'undefined') Object.keys(IP).forEach(k => put('interior pool (Great Sweep UP)', IP[k]));

      const rec = window.__BANKS; rec.on = true; rec.by = {};
      /* INSIDE: the run boots you asleep in your own house */
      for (let i = 0; i < 3; i++) { try { draw(); } catch (e) {} }
      /* OUT ON THE BLOCK: the surface he actually walks. Stand in a few real
         places so a bank used only in one corner still gets its chance. */
      try {
        mode = 'ext'; curHouse = -1; fp = null;
        /* STAND WHERE THE THING IS, DO NOT STAND WHERE IT USED TO BE.
           This sampled five spots around the front door, which happened to have
           the community wall in shot on the old spawn block and did not on the
           new one - so it reported his 13 approved border walls as "loaded and
           never drawn" when they draw perfectly well, twenty tiles away. A
           coverage gate that only looks in one corner measures the corner.
           Now it sweeps a grid across the whole cell AND deliberately stands
           next to one tile of every code that has its own art. */
        const stand = (x, y) => { px = Math.max(1, Math.min(W - 2, x | 0));
                                  py = Math.max(1, Math.min(H - 2, y | 0)); draw(); };
        for (let gy = 8; gy < H; gy += Math.max(8, H >> 3))
          for (let gx = 8; gx < W; gx += Math.max(8, W >> 3)) stand(gx, gy);
        /* and specifically beside each code that owns a bank (4 = the community
           wall, 6 = a garage, 2 = a house) so a rare feature is never missed */
        for (const code of [4, 6, 2]) {
          let found = null;
          for (let y = 1; y < H - 1 && !found; y++)
            for (let x = 1; x < W - 1; x++) if (G[y][x] === code) { found = [x, y]; break; }
          if (found) { stand(found[0], found[1] + 2); stand(found[0], found[1] - 2); }
        }
      } catch (e) {}
      rec.on = false;
      return { loaded, drew: rec.by };
    });
  } finally { await browser.close(); }

  console.log('BANKS-USED GATE (approved-but-unused is a defect)');
  const names = Object.keys(res.loaded);
  ok('the run really loads approved banks (the probe reached them)', names.length >= 3);

  const unused = [];
  for (const n of names) {
    const drew = res.drew[n] || 0;
    const waiver = WAIVED[n];
    console.log('  ' + (drew ? String(drew).padStart(6) : '     0') + ' draws  ' +
      n + ' (' + res.loaded[n] + ' images)' + (drew ? '' : waiver ? '   [WAIVED]' : '   <-- LOADED AND NEVER DRAWN'));
    if (!drew && !waiver) unused.push(n);
  }

  ok('PRESENCE IS NOT USE: no approved bank is loaded and never drawn',
    unused.length === 0);
  if (unused.length) {
    console.log('    these banks decode into memory and draw ZERO pixels:');
    unused.forEach(n => console.log('      - ' + n));
    console.log('    Either draw them or take them out of the build. If it is blocked on');
    console.log('    a ruling from Paolo, add it to WAIVED with its backlog item.');
  }

  /* the waivers are debts, not decoration: each must still be a real loaded bank
     that is still undrawn, or the list is lying about the state of the game */
  for (const w of Object.keys(WAIVED)) {
    ok('WAIVER IS HONEST: "' + w + '" is still loaded (not a stale entry)',
      res.loaded[w] > 0);
    ok('WAIVER IS STILL NEEDED: "' + w + '" is still undrawn (delete it if not)',
      !(res.drew[w] > 0));
  }
  if (Object.keys(WAIVED).length) {
    console.log('  WAIVED, on the books:');
    Object.entries(WAIVED).forEach(([k, v]) => console.log('    - ' + k + ': ' + v));
  }

  /* the two banks he has SAID he is happy with must never silently fall out */
  ok('the border walls he approved 7/28 are really drawing on the block',
    (res.drew['suburb border walls (13, approved 7/28)'] || 0) > 0);
  ok('the animated door bank he asked for on 7/26 is really drawing',
    (res.drew['animated door bank (7/13, 2 tiles tall)'] || 0) > 0);

  /* BOUGHT BEATS PAINTED (Paolo 7/31, LOCKED): "if i bought it i prefer it!
     Thats for all textures bro!!!" Art he paid for is not allowed to sit in
     banks/ while something painted draws in its place. */
  ok('HIS bought concrete really draws the sidewalk and driveways',
    (res.drew['HIS bought concrete (sidewalk + driveway)'] || 0) > 0);
  ok('HIS bought cracked street really draws the road',
    (res.drew['HIS bought cracked street (road)'] || 0) > 0);

  /* ========================================================================
     THE CATALOG MUST NOT LIE (NEVER DRIFT, Paolo 7/28: "Never drift off ever
     again"). The shopping index is the ONE document every session is required
     to trust before it draws anything. Its CONSUMED BY column was prose: a row
     could claim a live surface it did not have and no machine would notice,
     which is exactly how a session "checks the catalog" and still drifts.
     Every DRAWS claim below is now proven against counted draws on the real
     render path, and every DEBT claim must be a bank that really is loaded and
     really is not drawing - a debt that quietly got fixed is as misleading as
     one that quietly appeared.
     ======================================================================== */
  const idxPath = path.join(ROOT, 'records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md');
  const idx = require('fs').existsSync(idxPath) ? require('fs').readFileSync(idxPath, 'utf8') : '';
  const block = (idx.match(/```routing\n([\s\S]*?)```/) || [])[1];
  ok('THE SHOPPING INDEX carries a machine-readable routing block', !!block);
  if (block) {
    const rows = block.split('\n').map(l => l.trim()).filter(Boolean)
      .map(l => l.split('|').map(s => s.trim()))
      .filter(p => p.length === 3 && p[0] === 'RUN');
    ok('the index actually routes banks to the RUN', rows.length >= 4);
    /* the labels are the join key between the catalog and the counter, so a
       typo must fail loudly instead of silently checking nothing */
    const known = new Set(Object.keys(res.loaded).map(k => k.replace(/[—–]/g, '-')));
    for (const [, label, claim] of rows) {
      const key = Object.keys(res.loaded).find(k => k.replace(/[—–]/g, '-') === label);
      ok('INDEX ROW NAMES A REAL BANK: "' + label + '"', !!key && known.has(label));
      if (!key) continue;
      const drew = res.drew[key] || 0;
      if (claim === 'DRAWS') {
        ok('INDEX SAYS DRAWS, AND IT DRAWS: "' + label + '" (' + drew + ' draws)', drew > 0);
      } else if (claim === 'DEBT') {
        ok('INDEX SAYS DEBT, AND IT IS STILL A DEBT: "' + label + '" (delete the row if it now draws)',
          drew === 0);
        ok('A DEBT IS TRACKED, NOT SILENT: "' + label + '" is waived by name with a ticket',
          !!WAIVED[key]);
      } else {
        ok('INDEX ROW HAS A LEGAL CLAIM (DRAWS or DEBT): "' + label + '"', false);
      }
    }
  }

  console.log('BANKS-USED GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
