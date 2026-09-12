#!/usr/bin/env node
/* ============================================================================
   A GUN IS IN ITS OWN WAY UP CLOSE
   (9/12/26, COMBAT lane, VAMILY [guns close] = BB-GUNS-CLOSE)

   THE ROW WROTE ITS OWN GATE INTO ITSELF: "A LAW WITHOUT A MACHINE GATE IS NOT
   ENFORCED, so this row includes ITS GATE: an invariant over every weapon, not a
   habit. NO DAMAGE BEFORE THE DIAL still holds -- the gate asserts the SHAPE (a
   gun's effectiveness falls off close), never a number."

   So this sweeps EVERY weapon in the table rather than sampling one, and every
   claim below is about a shape: is close worse than the weapon's own range, for
   all of them, at every distance inside the band, without a single number in the
   assertion.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((rq, rp) => {
      const u = decodeURIComponent((rq.url || '/').split('?')[0]);
      const f = path.join(REPO, u);
      if (!f.startsWith(REPO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rp.writeHead(404); return rp.end('no'); }
      rp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

let pass = 0, fail = 0, SRV = null;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = async (b) => { if (b) await b.close(); if (SRV) try { SRV.close(); } catch (e) {}
  console.log('=== GUNS CLOSE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));

  SRV = await serve();
  const BASE = 'http://127.0.0.1:' + SRV.address().port;
  await page.goto(BASE + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load', timeout: 120000 });
  await sleep(9000);
  await page.mouse.click(215, 450); await sleep(2500);
  await page.mouse.click(215, 450); await sleep(3000);
  await page.evaluate(() => { try { markBeatTaught(); } catch (e) {} });
  await page.evaluate(() => { const t = document.querySelector('[data-p="combat"]'); if (t) t.click(); });
  await sleep(7000);
  const cf = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  ok('a real fight is open, which is the only place a dial exists', !!cf);
  if (!cf) return done(browser);

  /* ---- 1. EVERY WEAPON IN THE TABLE, not one sample ---------------------- */
  const sweep = await cf.evaluate(() => {
    const out = {};
    const names = Object.keys(WEAPON_RANGE);
    for (const w of names) {
      const R = wpnRange(w);
      const B = closeBand(R);
      /* the curve, walked from contact out past the band */
      const curve = [];
      for (let d = 0; d <= Math.ceil(B) + 2; d += Math.max(0.25, B / 8)) curve.push([Math.round(d * 100) / 100, Math.round(closeT(d, R) * 1000) / 1000]);
      out[w] = { eff: R.eff, max: R.max, band: Math.round(B * 1000) / 1000,
        atContact: Math.round(closeT(0, R) * 1000) / 1000,
        atEdge: Math.round(closeT(B, R) * 1000) / 1000,
        pastEdge: Math.round(closeT(B * 1.5, R) * 1000) / 1000,
        atOwnRange: Math.round(closeT(R.eff, R) * 1000) / 1000,
        monotonic: curve.every((p, i) => i === 0 || p[1] <= curve[i - 1][1] + 1e-9),
        curve: curve.slice(0, 6) };
    }
    return { out: out, names: names };
  });
  console.log('  every weapon: ' + JSON.stringify(sweep.out));
  const W = sweep.out, names = sweep.names;
  ok('EVERY WEAPON IN THE TABLE HAS A BAND IT IS BAD INSIDE, which is the row\'s "forever, on every weapon" and the reason this sweeps the table instead of sampling one gun ('
    + names.join(', ') + '): each one is at its worst in contact (' + names.map(w => W[w].atContact).join(', ')
    + '), clean at the edge of its own band (' + names.map(w => W[w].atEdge).join(', ')
    + ') and clean past it (' + names.map(w => W[w].pastEdge) + ')',
    names.length >= 4 && names.every(w => W[w].band > 0 && W[w].atContact > 0
      && W[w].atContact === Math.max.apply(null, W[w].curve.map(p => p[1]))
      && W[w].atEdge === 0 && W[w].pastEdge === 0));

  ok('and the penalty only ever EASES as you back off, for every one of them, so there is no distance where stepping away from a man makes your gun worse ('
    + names.map(w => w + ' ' + W[w].monotonic).join(', ') + ')',
    names.every(w => W[w].monotonic === true));

  ok('AND NO GUN IS PENALISED AT ITS OWN RANGE, which is the other half of the shape: the band is read off each weapon\'s OWN effective range, so the place a gun is meant to be used is exactly where it is clean ('
    + names.map(w => w + ' eff ' + W[w].eff + ' -> ' + W[w].atOwnRange).join(', ') + ')',
    names.every(w => W[w].atOwnRange === 0));

  /* ---- 2. AND THE ORDER IS THE WEAPONS' OWN, which is what keeps the row
     from fighting the shipped guns and the real world --------------------- */
  const order = names.slice().sort((a, b) => W[a].band - W[b].band);
  console.log('  band order, smallest first: ' + order.map(w => w + ' ' + W[w].band).join('  <  '));
  ok('*** AND THE ORDER COMES OUT OF THE WEAPONS THEMSELVES. *** The row says every weapon and the shipped game says the shotgun is "brutal up close" in its own WEAPON_ID and "a knife with a bang" in its own range table, and REALISM FIRST says a shotgun is the one gun that is good in a doorway. Both hold because the band is a fraction of each gun\'s OWN effective range: smallest first it reads '
    + order.join(' < ') + ', so the shotgun is least bothered by a man in its face and the rifle most, because a rifle at two feet is a club',
    W.shotgun.band < W.rifle.band && W.pistol.band < W.rifle.band
    && W.shotgun.band <= W.pistol.band && W.smg.band < W.rifle.band);

  /* ---- 3. THE DIAL, ON THE REAL SURFACE: the thing he actually plays ----- */
  const dial = await cf.evaluate(() => {
    const e = (G.e || [])[0]; if (!e) return null;
    const keepW = (typeof WEAPON !== 'undefined') ? WEAPON : null;
    const keepPkg = G.userPkg, keepD = e.edist;
    const res = {};
    G.userPkg = 4;                         /* a difficulty where the dial moves at all */
    for (const w of Object.keys(WEAPON_RANGE)) {
      try { WEAPON = w; } catch (_e) {}
      const R = wpnRange(w), B = closeBand(R);
      /* *** THE WHOLE CURVE, NOT TWO POINTS, WHICH IS THE CORRECTION THE FIRST RUN
         FORCED. *** The first cut asserted "contact is harder than the gun's own
         effective range" and it is NOT ALWAYS TRUE AND CANNOT BE: the shipped far
         curve already clamps to its hardest tier well inside some weapons' stated
         effective range (a pistol's eff is 6 and the dial's far anchor lands at
         4.8), so nothing can be harder than there and the claim was impossible
         rather than wrong about the build. THE ROW'S OWN SENTENCE is that a gun's
         effectiveness FALLS OFF CLOSE, and the honest shape of that is: the gun has
         a best distance, and it is not in contact. */
      const walk = [];
      for (let d = 0.2; d <= Math.max(B * 2.2, R.eff + 2); d += 0.4) {
        e.edist = d; walk.push([Math.round(d * 10) / 10, distPkg(e)]); }
      const tiers = walk.map(p => p[1]);
      const best = Math.min.apply(null, tiers);
      e.edist = 0.2;            const contact = distPkg(e);
      e.edist = R.eff;          const own = distPkg(e);
      e.edist = B * 1.2;        const justOut = distPkg(e);
      res[w] = { contact: contact, own: own, justOut: justOut,
        best: best, bestAt: walk[tiers.indexOf(best)][0],
        tierAtContact: (e.edist = 0.2, rangeTier(e)),
        tierAtOwn: (e.edist = R.eff, rangeTier(e)) };
    }
    try { WEAPON = keepW; } catch (_e) {}
    G.userPkg = keepPkg; e.edist = keepD;
    return res;
  });
  console.log('  the dial: ' + JSON.stringify(dial));
  const dnames = dial ? Object.keys(dial) : [];
  ok('*** AND IT REACHES THE DIAL HE ACTUALLY PLAYS, FOR EVERY WEAPON: EVERY GUN NOW HAS A BEST DISTANCE AND IT IS NOT IN CONTACT. *** The tier the pattern is drawn from was Math.round(distT*pkg), whose own comment said "point blank pulls EASIER patterns, even on Bohemian" -- the stand-and-shoot fight this row exists to prevent, written down as a feature. Walking the whole curve, each weapon\'s easiest tier sits out at ('
    + dnames.map(w => w + ' tier ' + dial[w].best + ' at ' + dial[w].bestAt).join(', ')
    + ') while contact reads (' + dnames.map(w => dial[w].contact).join(', ')
    + '), and stepping just outside the band is clean again (' + dnames.map(w => dial[w].justOut).join(', ')
    + '). THE FIRST CUT OF THIS ARM ASKED THE WRONG QUESTION -- it demanded contact be harder than the gun\'s stated effective range, which is impossible for a pistol because the shipped far curve already clamps to its hardest tier at 4.8 tiles while the pistol\'s eff is 6',
    !!dial && dnames.length >= 4
    && dnames.every(w => dial[w].contact > dial[w].best)
    && dnames.every(w => dial[w].bestAt > 0.2)
    && dnames.every(w => dial[w].justOut <= dial[w].contact));

  ok('and he can SEE it rather than feeling a mystery: inside the band the target band reads '
    + JSON.stringify(dnames.map(w => dial[w].tierAtContact)[0]) + ' and at the gun\'s own range it reads '
    + JSON.stringify(dnames.map(w => dial[w].tierAtOwn)[0]) + '. A dial that quietly gets mean is a bug to the man holding it',
    !!dial && dnames.every(w => dial[w].tierAtContact === 'TOO CLOSE')
    && dnames.every(w => dial[w].tierAtOwn !== 'TOO CLOSE'));

  /* ---- 4. HIS 7/27 RULING IS UNTOUCHED ---------------------------------- */
  const theirs = await cf.evaluate(() => {
    const e = (G.e || [])[0]; if (!e) return null;
    const keep = e.edist; const R = foeRange(e);
    e.edist = 0.5; const close = distAccuracy(e);
    e.edist = Math.max(1, R.eff); const mid = distAccuracy(e);
    e.edist = keep;
    return { close: Math.round(close * 1000) / 1000, mid: Math.round(mid * 1000) / 1000 };
  });
  console.log('  their accuracy: ' + JSON.stringify(theirs));
  ok('*** AND PAOLO\'S 7/27 RULING IS UNTOUCHED, WHICH IS WHY THIS ROW ONLY MOVED ONE SIDE. *** The men\'s accuracy against him carries that ruling in the code beside it -- "up close nothing moves, because up close was already lethal and that is his 7/27 ruling" -- and a backlog row is OUR mechanism while his ruling is CONTENTS. A man in your face still hits you ('
    + (theirs && theirs.close) + ' in contact against ' + (theirs && theirs.mid)
    + ' at his own range) and your own gun is still at its worst there, so both sides point the same way: do not be there',
    !!theirs && theirs.close > theirs.mid);

  /* ---- 5. NO DAMAGE BEFORE THE DIAL ------------------------------------- */
  const clean = await cf.evaluate(() => ({
    band: typeof closeBand === 'function', t: typeof closeT === 'function',
    /* the band is read off the weapon table and nothing else: no second table of
       per-gun close numbers can hide in here */
    noTable: !/CLOSE_BY_WEAPON|CLOSE_TABLE/.test(String(closeBand) + String(closeT)),
    src: String(closeT) }));
  ok('NO DAMAGE BEFORE THE DIAL: not one damage number, hit value or roll is authored by this row. It is one constant deciding how much of a gun\'s own range is too close, and the band is derived from the weapon table rather than a second private table of per-gun numbers ('
    + clean.noTable + ') -- which is what keeps this a constraint instead of a balance pass',
    clean.band && clean.t && clean.noTable);

  ok('no page errors through the whole sweep', errors.length === 0);
  if (errors.length) console.log('    ' + errors.slice(0, 3).join('\n    '));

  return done(browser);
})().catch(async e => {
  console.log('  FAIL gate threw: ' + (e && e.message));
  console.log('=== GUNS CLOSE GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ===');
  process.exit(1);
});
