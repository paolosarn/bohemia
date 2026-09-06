/* ============================================================================
   WHERE PEOPLE LIVE GATE (9/6/26, LIFE + CITY lane)
   "AN ADDRESS IS A FRONT DOOR"

   VAMILY job [more people] POPULATION-DEFAULT, playtest dispatch item 5:
   "IM WALKING THROUGH THE CITY I THINK I SAW ONE WATCH PERSON ON ACCIDENT ... THE
   CITY SEEMS DEAD ASF AND I DONT LIKE THIS BEING THE DEFAULT I KNOW WE HAVE A
   SLIDER AND SHIT BUT YEAH MAN."

   WHAT WAS MEASURED FIRST, ON THE RUNNING DEMO, STANDING WHERE HE WAKES. Bodies
   actually blitted, standing still, every hour 05:00 to 23:00: ONE. All day.
       residents of his neighbourhood            20
       nearest one of them                       64 cells (seven screens)
       the screen                                9 x 18 cells
       front doors on the overmap cell he is on  4,188 cells, 1,118 with a doorstep
       nearest front door                        14 CELLS
   The suburb is full of houses and the game seated its residents on open ground
   with no relation to any of them -- NINE OF THE TWENTY on freeway and arterial
   cells, because homesIn() scattered evenly over all sixteen overmap cells of the
   neighbourhood while surveyNeighbourhood() had already worked out which six of
   them were suburb and thrown the answer away.

   THE DIAL WAS NOT TOUCHED AND MUST NOT BE. This module carries a standing 8/28
   warning that the next session must not turn the knob and call the job done, and
   it is right: the count is HIS ruling. Everything here moves WHERE, never how
   many, and A3 is the leg that holds that line.

   AND THE LEG THAT IS REALLY A FINDING IS A6. Summing this module's own dialled
   heads over the valley gives 5,940 people on the surface he walks, against the
   ~69,000 its own comment claims for the same dial setting (read off agents.js's
   plot model, a different population model that differs by about fourteen times).
   A6 pins the measured number so the two can never silently drift again.
   ========================================================================== */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.json': 'application/json', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const OM = require('../engine/bohemia_overmap.js');
const POP = require('../engine/bohemia_population.js');
const PG = require('../engine/bohemia_powergrid.js');

console.log('='.repeat(74));
console.log('AN ADDRESS IS A FRONT DOOR — people live on the ground that has houses on it');
console.log('='.repeat(74));

const SEED = 2691674296;                       /* the ONE SEED law's own number */
const om = OM.buildOvermap(SEED);
const FN = 128;
/* THE REAL LIGHTS, not null. zoneAt() only lets a neighbourhood become a CLUSTER if
   it has power or backs onto farm/water, so censusing with no powergrid silently
   demotes thirteen settlements and answers 230 instead of the ruled 297. A gate that
   measures the valley has to measure the valley the game builds. */
const POWER = PG.powerMap(om, SEED);

/* find a neighbourhood that really has people in it, on the canon map */
function findZone(want) {
  for (let ty = 0; ty < om.n; ty++) for (let tx = 0; tx < om.n; tx++) {
    const c = om.at(tx, ty);
    if (!c || !POP.RESIDENTIAL[c.district]) continue;
    if (POP.zoneAt(om, POWER, tx, ty, SEED) !== want) continue;
    if (!POP.headsAt(om, POWER, tx, ty, SEED)) continue;
    return [tx >> 2, ty >> 2];
  }
  return null;
}
const NLONER = findZone('loner'), NSPREAD = findZone('spread'), NCLUST = findZone('cluster');

/* ---- A. THE ARITHMETIC, HEADLESS ---------------------------------------- */

/* A1. THE SURVEY'S ANSWER IS READABLE AT ALL. It has always been computed and
   never exposed; a number nothing can ask for is a number nothing can check. */
const rt = POP.residentialTiles(om, NSPREAD[0], NSPREAD[1]);
ok('A1 the survey says which of the sixteen overmap cells have houses on them ('
   + rt.length + ' of 16 at neighbourhood ' + NSPREAD + ')',
   Array.isArray(rt) && rt.length > 0 && rt.length <= POP.NB * POP.NB
   && rt.every(t => POP.RESIDENTIAL[(om.at(NSPREAD[0] * POP.NB + t[0],
                                            NSPREAD[1] * POP.NB + t[1]) || {}).district]));

/* A2. *** THE LEG THIS JOB EXISTS FOR. *** Nobody lives on the freeway. Before
   this, half of one neighbourhood's residents did. */
function offRes(n) {
  const homes = POP.homesIn(om, POWER, n[0], n[1], SEED, FN, null, 24);
  let off = 0, on = 0;
  for (const h of homes) {
    const d = (om.at(h[0] / FN | 0, h[1] / FN | 0) || {}).district;
    POP.RESIDENTIAL[d] ? on++ : off++;
  }
  return { on, off, total: homes.length };
}
const oL = offRes(NLONER), oS = offRes(NSPREAD), oC = offRes(NCLUST);
ok('A2 EVERY resident lives on residential ground — loner ' + oL.on + '/' + oL.total
   + ', spread ' + oS.on + '/' + oS.total + ', cluster ' + oC.on + '/' + oC.total
   + ' (nobody sleeps on the freeway)',
   oL.total > 0 && oS.total > 0 && oC.total > 0
   && oL.off === 0 && oS.off === 0 && oC.off === 0);

/* A3. *** THE DIAL WAS NOT TOUCHED. *** The module's own 8/28 note says the next
   session must not turn this knob and call the job done. This job moved WHERE and
   the count has to be provably identical, so the census, the gates that add people
   up and his slider all still mean what they meant. */
ok('A3 the count did not move: the default is still the module\'s own LANDMARK.story ('
   + POP.dial() + ') and the valley still censuses '
   + POP.census(om, POWER, SEED, om.n).people,
   POP.dial() === POP.LANDMARK.story && POP.census(om, POWER, SEED, om.n).people === 297);

/* A4. AND SEATING IS NOT THINNED BY THE NEW RESTRICTION. A placement rule that
   quietly seats fewer people than it used to would be a population cut wearing a
   bug fix's clothes. */
let seatedAll = 0, wantAll = 0, checked = 0;
const seen = {};
for (let ty = 0; ty < om.n && checked < 120; ty++) for (let tx = 0; tx < om.n && checked < 120; tx++) {
  const c = om.at(tx, ty);
  if (!c || !POP.RESIDENTIAL[c.district]) continue;
  const k = (tx >> 2) + ',' + (ty >> 2);
  if (seen[k]) continue; seen[k] = 1;
  const want = Math.min(24, Math.round(POP.headsAt(om, POWER, tx, ty, SEED) * POP.dialAt(tx >> 2, ty >> 2)));
  if (!want) continue;
  checked++;
  wantAll += want;
  seatedAll += POP.homesIn(om, POWER, tx >> 2, ty >> 2, SEED, FN, null, 24).length;
}
ok('A4 the restriction seats everybody it is asked for — ' + seatedAll + ' seated of '
   + wantAll + ' asked across ' + checked + ' neighbourhoods',
   checked > 20 && seatedAll >= wantAll);

/* A5. THE DOORSTEP PASS FALLS BACK, ALWAYS. A district with no front doors must
   seat exactly as many people as it did before, or this rule deletes residents
   from every neighbourhood the art has not filled in yet. */
const noDoors = POP.homesIn(om, POWER, NSPREAD[0], NSPREAD[1], SEED, FN, null, 24, () => false);
const plain   = POP.homesIn(om, POWER, NSPREAD[0], NSPREAD[1], SEED, FN, null, 24);
ok('A5 a surface with NO front doors seats the same people it always did ('
   + noDoors.length + ' with a doorstep rule nothing satisfies, ' + plain.length + ' without one)',
   noDoors.length === plain.length && plain.length > 0);

/* A5b. AND A SURFACE THAT LIKES EVERY CELL MUST NOT SEAT MORE. The two passes are
   a preference, never a second helping. */
const allDoors = POP.homesIn(om, POWER, NSPREAD[0], NSPREAD[1], SEED, FN, null, 24, () => true);
ok('A5b a surface where everything is a doorstep seats the same number too ('
   + allDoors.length + ')', allDoors.length === plain.length);

/* A5c. DETERMINISM. Same seed, same answer, twice — the whole world depends on it. */
const twice = POP.homesIn(om, POWER, NSPREAD[0], NSPREAD[1], SEED, FN, null, 24, () => false);
ok('A5c the same neighbourhood seats the same people every time it is asked',
   JSON.stringify(twice) === JSON.stringify(noDoors));

/* A6. *** THE FINDING, PINNED. *** The dial's own comment prices dial 20 at
   ~69,000 people. Summing the dialled heads this module hands homesIn() gives
   5,940 on the surface he walks. Three answers for one fact (69,000 / 5,940 / 297)
   is the contradiction records/..._HOW_MANY_PEOPLE_CONTRADICTION_8_1_26 was opened
   about, and it is why a session set the default to 20 believing it bought the
   GDD's valley. WHICH number the valley is stays HIS; this leg only refuses to let
   the measured one drift again unnoticed. */
let walkedPeople = 0;
const seen2 = {};
for (let ty = 0; ty < om.n; ty++) for (let tx = 0; tx < om.n; tx++) {
  const c = om.at(tx, ty);
  if (!c || !POP.RESIDENTIAL[c.district]) continue;
  const k = (tx >> 2) + ',' + (ty >> 2);
  if (seen2[k]) continue; seen2[k] = 1;
  walkedPeople += POP.headsAt(om, POWER, tx, ty, SEED) * POP.dialAt(tx >> 2, ty >> 2);
}
walkedPeople = Math.round(walkedPeople);
const ceiling = Math.round(walkedPeople / POP.dial() * POP.DIAL_MAX);
ok('A6 THE WALKED CITY SEATS ' + walkedPeople + ' PEOPLE AT DIAL ' + POP.dial()
   + ', NOT THE ~69,000 THIS FILE\'S OWN NOTE CLAIMS — and the top of his slider is '
   + ceiling + ' (two population models, one dial, [PENDING Paolo])',
   walkedPeople > 5000 && walkedPeople < 7000 && ceiling < 69000);

/* ---- B. THE REAL SURFACE ------------------------------------------------ */
(async () => {
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u.replace(/^\//, ''));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const browser = await chromium.launch();

  async function onSurface(file, frameIt) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
    await page.goto('http://127.0.0.1:' + port + '/slices/' + file,
      { waitUntil: 'load', timeout: 300000 });
    await page.waitForTimeout(4000);
    if (frameIt) {
      await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
      await page.waitForTimeout(3000);
      await page.evaluate(() => {
        const n = document.getElementById('openNot'); if (n) n.click();
        const w = document.getElementById('openSkip'); if (w) w.click(); });
      await page.waitForTimeout(14000);
    } else {
      await page.waitForTimeout(9000);
    }
    const target = frameIt
      ? (page.frames().filter(f => /CITY_WORLD/.test(f.url()))[0] || null)
      : page;
    const got = target ? await target.evaluate(() => {
      try {
        const P = BohemiaPopulation, NB = P.NB, span = NB * FN;
        const n0 = [Math.floor(hx / span), Math.floor(hy / span)];
        let tot = 0, atDoor = 0, onRes = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          for (const q of pplPeople(n0[0] + dx, n0[1] + dy)) {
            tot++;
            if (pplDoorstep(q.home[0], q.home[1])) atDoor++;
            const d = (om.at(q.home[0] / FN | 0, q.home[1] / FN | 0) || {}).district;
            if (P.RESIDENTIAL[d]) onRes++;
          }
        }
        /* and how far is the nearest front door from where he is standing --
           the number that says the houses were always there */
        let door = null;
        for (let r = 1; r <= 40 && !door; r++)
          for (let dy = -r; dy <= r && !door; dy++) for (let dx = -r; dx <= r; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
            const c = cellAt(hx + dx, hy + dy);
            if (c && c.enter) { door = r; break; }
          }
        return { residents: tot, atAFrontDoor: atDoor, onResidentialGround: onRes,
                 nearestDoorCells: door, dial: P.dial(), standing: [hx, hy] };
      } catch (e) { return { err: String(e).slice(0, 120) }; }
    }) : { err: 'NO CITY FRAME' };
    await ctx.close();
    return { got, errs };
  }

  const W = await onSurface('BOHEMIA_CITY_WORLD.html', false);
  const g = W.got;

  /* B1. ON THE SURFACE HE WALKS, NOBODY LIVES ON A ROAD. */
  ok('B1 on the walked surface every resident around him is on residential ground ('
     + (g.err || g.onResidentialGround + '/' + g.residents) + ')',
     !g.err && g.residents > 0 && g.onResidentialGround === g.residents);

  /* B2. AND MOST OF THEM ARE AT A FRONT DOOR. Not all: a household seats itself
     beside its head (HOUSEHOLD_REACH), and the cell next door to a doorstep is a
     yard, which is exactly where the rest of a family stands. A MAJORITY is the
     honest claim; "every one" would be a claim the mechanism does not make. */
  ok('B2 most of them live at a front door instead of on open ground ('
     + (g.err || g.atAFrontDoor + '/' + g.residents) + ')',
     !g.err && g.residents > 0 && g.atAFrontDoor * 2 > g.residents);

  /* B3. THE HOUSES WERE ALWAYS THERE, and this is the measurement that proves the
     old placement was ignoring them rather than short of somewhere to put anybody. */
  ok('B3 there is a front door within a couple of screens of where he wakes ('
     + (g.err || g.nearestDoorCells + ' cells) — the city was never short of houses'),
     !g.err && g.nearestDoorCells !== null && g.nearestDoorCells <= 40);

  /* B4. THE DOORSTEP ANSWER IS HONEST. A `prefer` that says yes to everything would
     pass B2 and mean nothing. */
  const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p2 = await ctx2.newPage();
  await p2.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_CITY_WORLD.html',
    { waitUntil: 'load', timeout: 300000 });
  await p2.waitForTimeout(9000);
  const honest = await p2.evaluate(() => {
    let yes = 0, no = 0;
    const tx = (hx / FN | 0) * FN, ty = (hy / FN | 0) * FN;
    for (let y = 0; y < FN; y += 3) for (let x = 0; x < FN; x += 3)
      pplDoorstep(tx + x, ty + y) ? yes++ : no++;
    return { yes, no };
  }).catch(e => ({ err: String(e).slice(0, 90) }));
  ok('B4 the doorstep question is a real question — it says no to most of the cell he '
     + 'is standing on (' + JSON.stringify(honest) + ')',
     !honest.err && honest.yes > 0 && honest.no > honest.yes);
  await ctx2.close();

  ok('B5 nothing threw on the walked surface' + (W.errs.length ? ' -> ' + W.errs[0] : ''),
     W.errs.length === 0);

  /* ---- C. AND IT IS TRUE IN THE CUT DEMO, which is the file a stranger opens -- */
  const D = await onSurface('BOHEMIA_DEMO.html', true);
  const d = D.got;
  ok('C1 the cut demo seats them the same way ('
     + (d.err || d.onResidentialGround + '/' + d.residents + ' on residential ground, '
        + d.atAFrontDoor + ' at a door') + ')',
     !d.err && d.residents > 0 && d.onResidentialGround === d.residents
     && d.atAFrontDoor * 2 > d.residents);
  ok('C2 nothing threw in the demo' + (D.errs.length ? ' -> ' + D.errs[0] : ''),
     D.errs.length === 0);

  console.log('  MEASURED ON THE WALKED SURFACE:');
  console.log('    standing at          : ' + JSON.stringify(g.standing) + ', dial ' + g.dial);
  console.log('    residents around him : ' + g.residents
    + ' (' + g.onResidentialGround + ' on residential ground, ' + g.atAFrontDoor + ' at a front door)');
  console.log('    nearest front door   : ' + g.nearestDoorCells + ' cells');
  console.log('    the valley, dialled  : ' + walkedPeople + ' people at dial ' + POP.dial()
    + ', ceiling ' + ceiling + '  [PENDING Paolo: the GDD says 69,000]');

  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  AN ADDRESS IS A FRONT DOOR: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  AN ADDRESS IS A FRONT DOOR: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
