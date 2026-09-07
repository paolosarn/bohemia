/* ============================================================================
   ENOUGH PEOPLE (9/7/26, LIFE + CITY lane)
   Round 6 of VAMILY [more people] POPULATION-DEFAULT. The row stays OPEN.

   THIS GATE DOES NOT CHECK A MECHANISM. It checks an ARITHMETIC that five rounds
   of mechanism have run into, and it exists so that number can never quietly rot
   or be forgotten -- and so the day somebody changes the population, the gate says
   what it bought.

   FIVE ROUNDS OF PLACEMENT: people at their front doors on residential ground;
   their day gathering them at places instead of scattering them (2 of 32 walks
   meeting somebody -> 9 of 32); the crowds on the map; the street saying when one
   is in earshot; and them walking there instead of teleporting. Rounds 4 and 5
   made the world honest without moving the meeting rate at all.

   SO THE QUESTION BECAME: CAN ANY PLACEMENT RULE GET FURTHER? Measured, and it is
   one division:
       a 400-step walk sweeps                     3,600 cells (400 x a 9-cell screen)
       the nine neighbourhoods around him are     2,359,296 cells
       so one walk sees                           0.153% OF THE GROUND
       for ONE meeting per walk you therefore need    ~655 people in them
       there are                                       61
   PLACEMENT MOVES *WHERE* PEOPLE ARE INSIDE THAT FRACTION. IT CANNOT CHANGE THE
   FRACTION. The shortfall is a factor of about ELEVEN, and no rule about doorsteps
   or gathering or commuting closes it.

   *** AND THE TWO NUMBERS ARE THE SAME NUMBER, WHICH IS THE FINDING. *** The
   standing [PENDING Paolo] since round 1 is whether the valley is the GDD's ~69,000
   or the zone map's ruled 297 times the dial (5,940 on the surface he walks). That
   is a factor of 11.6. The shortfall is a factor of 10.7. At the GDD's population
   those nine neighbourhoods hold ~708 people and a 400-step walk expects 1.08
   meetings.
   HIS DESIGN DOCUMENT ALREADY CONTAINS THE ANSWER TO HIS COMPLAINT. The decision is
   still his and nothing here takes it; this only stops anybody rediscovering the
   arithmetic a seventh time.
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

const POP = require('../engine/bohemia_population.js');

console.log('='.repeat(74));
console.log('ENOUGH PEOPLE — what placement cannot do, in one division');
console.log('='.repeat(74));

/* A1. THE GDD'S NUMBER IS STILL WRITTEN DOWN AS THE DIAL'S OWN LANDMARK, so the
   comparison below is between two things the repo itself says, not two things this
   gate invented. */
ok('A1 the population module still carries the GDD landmark it was set to ('
   + 'LANDMARK.story = ' + POP.LANDMARK.story + ', dial = ' + POP.dial() + ')',
   POP.LANDMARK.story > 1 && POP.dial() === POP.LANDMARK.story);

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
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_DEMO.html',
    { waitUntil: 'load', timeout: 300000 });
  await page.waitForTimeout(15000);
  await page.evaluate(() => {
    const f = document.getElementById('fronttap') || document.getElementById('front');
    if (f) f.click(); });
  await page.waitForTimeout(20000);
  const fr = page.frames().filter(f => /BOHEMIA_CITY_WORLD/.test(f.url()))[0] || null;

  const m = fr ? await fr.evaluate(() => {
    try {
      const P = BohemiaPopulation, NB = P.NB, span = NB * FN;
      const n0 = [Math.floor(hx / span), Math.floor(hy / span)];
      const around = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++)
        for (const q of pplPeople(n0[0] + dx, n0[1] + dy)) around.push(q);
      const HCc = (typeof HC !== 'undefined' ? HC : 22);
      const screenW = Math.round(cv.width / HCc);
      const STEPS = 400;
      const corridor = STEPS * screenW;
      const ground = (3 * span) * (3 * span);
      const frac = corridor / ground;
      /* and the valley the walked surface actually seats, asked of the module */
      let walked = 0;
      const seen = {};
      for (let ty = 0; ty < om.n; ty++) for (let tx = 0; tx < om.n; tx++) {
        const c = om.at(tx, ty);
        if (!c || !P.RESIDENTIAL[c.district]) continue;
        const k = (tx >> 2) + ',' + (ty >> 2);
        if (seen[k]) continue; seen[k] = 1;
        walked += P.headsAt(om, POWER, tx, ty, seed) * P.dialAt(tx >> 2, ty >> 2);
      }
      walked = Math.round(walked);
      return { around: around.length, screenW, corridor, ground,
               pctSeen: +(frac * 100).toFixed(3),
               needForOneMeeting: Math.round(1 / frac),
               walkedValley: walked };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'NO CITY FRAME' };

  const GDD = 69000;
  const shortfall = m.err ? 0 : m.needForOneMeeting / m.around;
  const docGap = m.err ? 0 : GDD / m.walkedValley;

  /* B1. THE FRACTION, WHICH IS THE WHOLE ARGUMENT. */
  ok('B1 one 400-step walk sees ' + (m.err || (m.pctSeen + '% of the nine '
     + 'neighbourhoods around him (' + m.corridor + ' cells of ' + m.ground + ')')),
     !m.err && m.pctSeen > 0 && m.pctSeen < 1);

  /* B2. *** WHAT PLACEMENT CANNOT DO. *** */
  ok('B2 *** ONE MEETING PER WALK NEEDS ~' + (m.needForOneMeeting || '?')
     + ' PEOPLE AROUND HIM AND THERE ARE ' + (m.around || '?')
     + ' *** — a shortfall of ' + shortfall.toFixed(1)
     + 'x that no placement rule can close',
     !m.err && m.around > 0 && shortfall > 1);

  /* B3. *** AND THE PENDING QUESTION IS THE SAME NUMBER. *** This is the leg the
     round exists for: the shortfall placement cannot close and the gap between his
     design document and his game are, to within a rounding error, one number. */
  ok('B3 *** THE SHORTFALL (' + shortfall.toFixed(1) + 'x) AND THE GDD GAP ('
     + docGap.toFixed(1) + 'x, ' + GDD + ' against the walked valley\'s '
     + (m.walkedValley || '?') + ') ARE THE SAME NUMBER *** — at the GDD\'s '
     + 'population a 400-step walk expects '
     + (m.err ? '?' : (m.around * docGap / m.needForOneMeeting).toFixed(2)) + ' meetings',
     !m.err && Math.abs(shortfall - docGap) / Math.max(shortfall, docGap) < 0.25);

  /* B4. AND THE RATCHET. The day somebody moves the population, this number moves
     with it and the gate says what it bought. It is not a threshold to pass; it is a
     reading that must stay true to the world. */
  ok('B4 the reading is live: the walked valley is ' + (m.walkedValley || '?')
     + ' at dial ' + POP.dial() + ', so this gate reports the new answer the day '
     + 'anybody changes it',
     !m.err && m.walkedValley > 0);

  ok('B5 nothing threw' + (errs.length ? ' -> ' + errs[0] : ''), errs.length === 0);

  console.log('  THE ARITHMETIC, MEASURED:');
  console.log('    one walk sees        : ' + m.pctSeen + '% of the ground around him');
  console.log('    needed for 1 meeting : ' + m.needForOneMeeting + ' people');
  console.log('    there are            : ' + m.around);
  console.log('    shortfall            : ' + shortfall.toFixed(1) + 'x');
  console.log('    the GDD gap          : ' + docGap.toFixed(1) + 'x  ('
    + GDD + ' against ' + m.walkedValley + ')');
  console.log('    *** HIS DESIGN DOCUMENT ALREADY CONTAINS THE ANSWER, AND THE');
  console.log('        DECISION IS STILL HIS: [PENDING Paolo] ***');

  await ctx.close();
  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  ENOUGH PEOPLE: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  ENOUGH PEOPLE: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
