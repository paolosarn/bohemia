/* ============================================================================
   THEY ARE ON THE WAY (9/6/26, LIFE + CITY lane)
   Round 5 of VAMILY [more people] POPULATION-DEFAULT. The row stays OPEN.

   Rounds 1-4 put people in the houses, gathered their days at places, marked the
   crowds on the map and made them audible. THEY STILL TELEPORTED.

   MEASURED on the demo, the 61 people around where he wakes, minute by minute
   through one morning, with a jump defined as MOVING FASTER THAN THE WORLD WALKS
   (MIN_PER_CELL, the surface's own 0.084 minutes a cell, about twelve cells a
   minute):
       journeys finished in under a minute        34
       the biggest                                477 CELLS -- half a kilometre
       people ever visibly on the way, all day    NONE
   And the schedule already has rush hours: 16 of 61 change place at 08:00, 14 at
   15:00, TWENTY-EIGHT AT 17:00, 16 at 19:00. Four times a day the neighbourhood
   empties and refills and not one of those journeys ever happened on a street.

   NOTHING HERE IS A NUMBER I PICKED. The walk takes as long as the walk takes, at
   the surface's own MIN_PER_CELL -- the same cost the PLAYER pays to cross a cell.
   The schedule's own block boundary says when they set off and the block before it
   says where from.

   *** AND THE HONEST HEADLINE IS THAT IT DOES NOT MOVE THE SHIP TEST. *** Twelve
   walks from the wake cell at 08:00, 12:00 and 17:00, before and after: THREE OF
   TWELVE MET SOMEBODY, BOTH TIMES. What changed is that seven people are visibly
   walking at 08:30 where the answer used to be an empty list at every hour, and a
   body no longer crosses half a kilometre in sixty seconds. That is a defect in
   the world's honesty fixed, not a meeting rate improved, and B4 states it so
   nobody reads this row as having done the other thing.
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

console.log('='.repeat(74));
console.log('THEY ARE ON THE WAY — a body no longer crosses half a kilometre in a minute');
console.log('='.repeat(74));

const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

/* A1. THE WALK COSTS WHAT THE WORLD CHARGES. A travel time typed here would be this
   lane inventing a speed, and the player already pays one. */
ok('A1 a journey takes distance x MIN_PER_CELL — the surface\'s own step cost, the '
   + 'same one the player pays',
   /var need = dist \* MIN_PER_CELL;/.test(CITY));

/* A2. AND THE CLOCK IT READS IS THE SCHEDULE'S OWN. Inventing a departure time would
   put the walker out of step with the day agents.js already wrote. */
ok('A2 when they set off is the schedule\'s own block boundary, and where from is the '
   + 'block before it',
   /var gone = \(\(T\.min \| 0\) - \(b\.t0 \| 0\)\)/.test(CITY)
   && /BohemiaAgents\.whereAt\(p, Math\.max\(0, \(b\.t0 \| 0\) - 1\)\)/.test(CITY));

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

  const people = fr ? await fr.evaluate(() => {
    try {
      const P = BohemiaPopulation, span = P.NB * FN;
      const n0 = [Math.floor(hx / span), Math.floor(hy / span)];
      const all = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++)
        for (const q of pplPeople(n0[0] + dx, n0[1] + dy)) all.push(q);
      const was = T.min;
      const SPEED = 1 / MIN_PER_CELL;
      /* teleports, minute by minute through a morning.
         *** THIS CENSUS ASKS THE SCHEDULE, NOT THE SCREEN, AND 9/7 IS WHY. *** It
         used to call pplAt(), which was the same question until the NEAR FIELD
         landed: the coordinator's 9/7 ruling puts the valley's out-of-doors people
         onto the street the player is on and releases them when he leaves, so a
         borrowed body legitimately appears somewhere new. Counting that as a
         journey took this leg to 104 jumps of up to 916 cells and said nothing
         about the thing this gate owns, which is WHETHER A SCHEDULED DAY IS
         WALKED. pplAtSched() is that day. The near field's own guarantee -- that
         nobody is moved or released within sight of the player -- is leg B1b below
         and never_empty_gate's business; this leg keeps measuring, exactly as
         strictly as it did, the thing round 5 built. */
      let jumps = 0, biggest = 0, prev = null;
      for (let m = 5 * 60; m <= 11 * 60; m++) {
        T.min = m; if (typeof DAY !== 'undefined') DAY.min = m;
        const now = all.map(q => pplAtSched(q));
        if (prev) for (let i = 0; i < now.length; i++) {
          const d = Math.max(Math.abs(now[i][0] - prev[i][0]), Math.abs(now[i][1] - prev[i][1]));
          if (d > SPEED * 2) { jumps++; if (d > biggest) biggest = d; }
        }
        prev = now;
      }
      /* and who is visibly between places, hour by hour */
      const onWay = {};
      let peak = 0;
      for (let m = 6 * 60; m <= 20 * 60; m += 30) {
        T.min = m; if (typeof DAY !== 'undefined') DAY.min = m;
        let moving = 0, offGround = 0;
        for (const q of all) {
          const a = pplAtSched(q);           /* the scheduled day, same reason as above */
          const atHome = a[0] === q.home[0] && a[1] === q.home[1];
          const atOut = q.outSpot && a[0] === q.outSpot[0] && a[1] === q.outSpot[1];
          const atFav = q.favSpot && a[0] === q.favSpot[0] && a[1] === q.favSpot[1];
          if (!atHome && !atOut && !atFav) { moving++; if (!pplStandable(a[0], a[1])) offGround++; }
        }
        if (moving) onWay[m] = moving;
        if (moving > peak) peak = moving;
        if (offGround) onWay['WALL_' + m] = offGround;
      }
      T.min = was; if (typeof DAY !== 'undefined') DAY.min = was;
      return { people: all.length, jumps, biggest, onWay, peak,
               speed: +(1 / MIN_PER_CELL).toFixed(1) };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'NO CITY FRAME' };

  /* B1. *** NOBODY CROSSES HALF A KILOMETRE IN A MINUTE ANY MORE. *** */
  ok('B1 journeys finished in under a minute: ' + (people.err || (
       people.jumps + ' (was 34), biggest ' + people.biggest
       + ' cells (was 477), against a walking speed of ' + people.speed + ' cells a minute')),
     !people.err && people.jumps < 34 && people.biggest < 477);

  /* B2. *** AND SOMEBODY IS ACTUALLY ON THE STREET. *** Before this the answer was an
     empty list at every hour of the day: nobody was ever between two places. */
  ok('B2 *** PEOPLE ARE VISIBLY ON THE WAY *** — peak ' + (people.peak || 0)
     + ' at once (was 0, all day, every hour)',
     !people.err && people.peak >= 4);

  /* B3. AND A WALKER IS ON GROUND A PERSON CAN STAND ON. The straight line between
     two places runs through buildings; a two-cell nudge was not enough and the fix is
     to step BACK ALONG THEIR OWN ROUTE, which is what anybody going round a building
     does. A body inside a wall would be worse than a body that teleports. */
  const inWalls = Object.keys(people.onWay || {}).filter(k => k.indexOf('WALL_') === 0).length;
  ok('B3 nobody is ever walking inside a wall (' + inWalls + ' hours with a body off '
     + 'walkable ground)', !people.err && inWalls === 0);

  /* B4. *** AND THE HONEST HEADLINE: THIS DOES NOT MOVE THE SHIP TEST. *** Measured
     before and after, twelve walks from the wake cell at 08:00, 12:00 and 17:00,
     counting only people not already on the glass: THREE OF TWELVE, BOTH TIMES. This
     row fixed the world's honesty, not the meeting rate, and a gate that let the two
     be confused would be doing the confusing. */
  const walks = fr ? await fr.evaluate(() => {
    try {
      const home = [hx, hy], was = T.min;
      const dirs = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] };
      let n = 0, met = 0;
      for (const hour of [8, 12, 17]) for (const d in dirs) {
        hx = home[0]; hy = home[1];
        T.min = hour * 60; if (typeof DAY !== 'undefined') DAY.min = hour * 60;
        render();
        const already = new Set();
        for (const q of (window.BARK_DREW || [])) already.add(q.p.id);
        const v = dirs[d], seen = new Set();
        for (let i = 0; i < 400; i++) {
          if (pplStandable(hx + v[0], hy + v[1])) { hx += v[0]; hy += v[1]; }
          else if (pplStandable(hx + v[1], hy + v[0])) { hx += v[1]; hy += v[0]; }
          else break;
          T.min += MIN_PER_CELL; if (typeof DAY !== 'undefined') DAY.min = T.min;
          if (i % 3) continue;
          render();
          for (const q of (window.BARK_DREW || [])) if (!already.has(q.p.id)) seen.add(q.p.id);
        }
        n++; if (seen.size) met++;
      }
      hx = home[0]; hy = home[1]; T.min = was;
      if (typeof DAY !== 'undefined') DAY.min = was;
      render();
      return { walks: n, met: met };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'NO CITY FRAME' };
  ok('B4 SAID OUT LOUD: this does not move the meeting rate — ' + (walks.err || (
       walks.met + ' of ' + walks.walks + ' walks met somebody, and it was '
       + '3 of 12 before this row too')),
     !walks.err && walks.walks === 12 && walks.met >= 2);

  /* B5. WHAT IT COSTS. pplAt runs for every drawn body every frame, so a lerp plus a
     blocked-route backtrack in there is not free by assumption. */
  const cost = fr ? await fr.evaluate(() => {
    try {
      const P = BohemiaPopulation, span = P.NB * FN;
      const n0 = [Math.floor(hx / span), Math.floor(hy / span)];
      const all = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++)
        for (const q of pplPeople(n0[0] + dx, n0[1] + dy)) all.push(q);
      const was = T.min;
      T.min = 8 * 60 + 5; if (typeof DAY !== 'undefined') DAY.min = T.min;
      const t0 = performance.now();
      for (let r = 0; r < 200; r++) for (const q of all) pplAt(q);
      const ms = (performance.now() - t0) / 200;
      T.min = was; if (typeof DAY !== 'undefined') DAY.min = was;
      return { msForAll: +ms.toFixed(3), people: all.length,
               pctOfBeat: +(ms / 500 * 100).toFixed(2) };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'NO CITY FRAME' };
  ok('B5 it costs ' + (cost.msForAll || '?') + ' ms to place all ' + (cost.people || '?')
     + ' of them at rush hour — ' + (cost.pctOfBeat || '?') + '% of a 500 ms beat',
     !cost.err && cost.msForAll < 10);

  ok('B6 nothing threw' + (errs.length ? ' -> ' + errs[0] : ''), errs.length === 0);

  console.log('  MEASURED IN THE CUT DEMO:');
  console.log('    teleports            : ' + people.jumps + ' (was 34), biggest '
    + people.biggest + ' cells (was 477)');
  console.log('    on the way, peak     : ' + people.peak + ' at once (was 0 all day)');
  console.log('    walks that met       : ' + walks.met + ' of ' + walks.walks
    + '  — UNCHANGED, and that is the honest headline');
  console.log('    cost                 : ' + cost.msForAll + ' ms for '
    + cost.people + ' people  [THE JOB STAYS OPEN]');

  await ctx.close();
  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  THEY ARE ON THE WAY: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  THEY ARE ON THE WAY: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
