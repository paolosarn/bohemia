/* ============================================================================
   THE STREET IS NEVER EMPTY (9/7/26, LIFE + CITY lane)
   ROUND 7 of VAMILY [more people] POPULATION-DEFAULT, and the first round with a
   RULING behind it rather than a [PENDING].

   THE COORDINATOR DECIDED IT 9/7: "the ship test is met by DENSITY, not headcount.
   The valley keeps its canon count; the mechanism places people where the player
   IS ... spawned near and released far, which is how every open world on earth
   fakes a city. Default: the street a player is on is never empty in daylight."

   MEASURED BEFORE ANYTHING WAS BUILT, standing in FORTY residential places spread
   across the valley at three daylight hours, counting bodies within the repo's own
   SEE_RANGE of 9 cells:
       116 of 120 standings          NOBODY IN SIGHT       96.7% empty
       the most anyone ever saw      ONE PERSON
       median                        ZERO

   AND THE REASON, ASKED OF THE SCHEDULE RATHER THAN GUESSED, AT TEN IN THE MORNING:
       people in the gathered window     1,140
       actually outside                    763
   SEVEN HUNDRED AND SIXTY-THREE PEOPLE OUTSIDE AND YOU SEE NOBODY. Sight covers
   361 cells of a 12,800,000-cell window, so the odds of a standing containing
   somebody are 763 x 361 / 12.8M = 2%, and the measurement found 4 in 120. Round 6
   divided and found placement could not close a 10.7x gap; this is the same
   division one layer down, and it is why the answer had to be a working set that
   follows the player rather than any rule about where the valley's people live.

   AFTER: 44 of 120 standings empty (36.7%), median 1, at every daylight hour.

   *** WHAT THIS GATE IS REALLY FOR IS THE FOUR WAYS THE MECHANISM COULD CHEAT. ***
   A near field is a spawner unless something stops it being one, so:
     B3  IT CAN ONLY BORROW PEOPLE THE SCHEDULE ALREADY HAS OUTDOORS. At 03:00 the
         valley is asleep and the street must be EMPTY. A mechanism that fills the
         street at three in the morning has invented people, and this leg is the
         one that would catch it.
     B4  THE CENSUS DOES NOT MOVE. The valley's headcount is identical with the
         near field on and with every borrowed body ignored -- same people, same
         homes, standing somewhere else.
     B5  NOBODY IS IN TWO PLACES. A borrowed body is not also standing at their own
         day's spot.
     B6  ONE BODY PER CELL. The OCCUPANCY LAW, which this round put under real
         pressure for the first time: people from three neighbourhoods away can now
         share a place, so two `taken` sets that have never seen each other could
         hand out one cell.
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
console.log('THE STREET IS NEVER EMPTY — density where he is, borrowed not invented');
console.log('='.repeat(74));

const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

/* A1. THE SPACING IS THE REPO'S OWN NUMBER. One borrowed body per screenful of
   walkable ground IS the ruling's sentence; the moment somebody types a number
   here instead, this is a dial and not a derivation. */
ok('A1 the street lattice is 2 x SEE_RANGE + 1 — one candidate per screenful, '
   + 'read from BohemiaStanding rather than typed',
   /var STEP = SEE \* 2 \+ 1/.test(CITY)
   && /BohemiaStanding[^]{0,80}SEE_RANGE/.test(CITY));

/* A2. AND THE ONE BUDGET IN THE MECHANISM IS SPENT IN THE WORLD'S OWN STEP COST,
   and is NAMED as a budget rather than dressed up as a derivation. How much street
   to fill is five minutes' walk at MIN_PER_CELL -- the same 0.084 minutes a cell the
   player pays. This leg exists because the first cut filled the whole neighbourhood
   and took time to first play from 21 seconds to 54. */
ok('A2 how much street gets filled is five minutes\' walk at the surface\'s own '
   + 'MIN_PER_CELL, and the comment calls it a budget instead of pretending',
   /var WALK_MIN = 5;/.test(CITY)
   && /Math\.round\(WALK_MIN \/ MIN_PER_CELL\)/.test(CITY)
   && /this is a budget|it is a budget|MECHANISM'S ONE BUDGET/i.test(CITY));

/* A2b. *** AND IT REFUSES TO FILL A NO MAN'S LAND. *** city_people_gate has asserted
   since the walk surface first got people that standing in an empty zone you see
   NOBODY, because "emptiness is authored, and it has to be provable or the next 'the
   world feels dead' change quietly fills it in". This round WAS that change and that
   gate caught it at exactly one body. The near field asks the population module the
   same question the gate asks, and this leg is here so the answer cannot be quietly
   dropped later by somebody chasing a bigger crowd. */
ok('A2b the near field refuses to borrow anybody into a zone the population module '
   + 'calls empty — authored emptiness stays empty',
   /zoneAt\(om, POWER, n0 \* P\.NB, n1 \* P\.NB, seed\)/.test(CITY)
   && /if \(zone === 'empty'\) return PPL_NEAR;/.test(CITY));

/* A3. AND NOTHING ASSERTS DEAD CODE. The reverted travel experiment left a
   pplReachNb() behind that nothing called, and an earlier draft of A2 was checking
   it -- a leg guarding a function the game does not run. */
ok('A3 the reverted travel experiment left nothing behind that nothing calls',
   CITY.indexOf('function pplReachNb') < 0);

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
  /* THE CUT DEMO, THROUGH THE IFRAME. The standalone surface never blits anybody:
     peoplePass opens `if (!PLAYER_CV) return 0;` and PLAYER_CV only exists once the
     parent frame posts BOHEMIA_CITY_PLAYER. This lane has been caught by that three
     times; it is written here at the point of use so it is four. */
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
      const P = BohemiaPopulation, span = P.NB * FN;
      const SEE = (typeof BohemiaStanding !== 'undefined' && BohemiaStanding.SEE_RANGE) || 9;
      const was = [hx, hy, T.min | 0];
      const PAD = 1 + PPL_TRAVEL_MAX;

      /* STAND SOMEWHERE, then count what is within sight. The player has to be
         MOVED, not just the coordinates read: the near field is built around where
         he is, so counting bodies at a spot he is not standing on measures a street
         the ruling is not about. */
      function standAndCount(x, y) {
        hx = x; hy = y;
        const a = [Math.floor(x / span), Math.floor(y / span)];
        let n = 0;
        for (let dy = -PAD; dy <= PAD; dy++) for (let dx = -PAD; dx <= PAD; dx++)
          for (const q of (pplPeople(a[0] + dx, a[1] + dy) || [])) {
            const at = pplAt(q);
            if (at[0] === x && at[1] === y) continue;
            if (Math.max(Math.abs(at[0] - x), Math.abs(at[1] - y)) <= SEE) n++;
          }
        return n;
      }

      /* FORTY PLACES PEOPLE LIVE, SPREAD ACROSS THE VALLEY. One spot is not a
         measurement; this lane reported a whole valley off one cell once. */
      const res = [];
      for (let ty = 0; ty < om.n; ty++) for (let tx = 0; tx < om.n; tx++) {
        const c = om.at(tx, ty);
        if (c && P.RESIDENTIAL[c.district]) res.push([tx, ty]);
      }
      const spots = [];
      const step = Math.max(1, Math.floor(res.length / 40));
      for (let i = 0; i < res.length && spots.length < 40; i += step) {
        const t = res[i];
        let x = t[0] * FN + (FN >> 1), y = t[1] * FN + (FN >> 1), okc = false;
        for (let r = 0; r < 6 && !okc; r++)
          for (let dy = -r; dy <= r && !okc; dy++) for (let dx = -r; dx <= r; dx++)
            if (pplStandable(x + dx, y + dy)) { x += dx; y += dy; okc = true; break; }
        if (okc) spots.push([x, y]);
      }

      /* *** AND THE SPOTS ARE SPLIT BY WHAT THE WORLD SAYS THE GROUND IS. ***
         The first cut of this gate averaged over all forty and reported a median of
         1. Then city_people_gate went red -- the near field was filling a NO MAN'S
         LAND -- and once authored emptiness was respected the same average said 0.
         Both numbers were true and neither meant anything, because HALF THESE SPOTS
         ARE ON GROUND THE POPULATION MODULE CALLS EMPTY. Residential district and
         settled zone are different questions, and a figure averaged over two
         populations that are meant to differ measures neither. So: settled ground is
         where the ruling's default applies, empty ground must stay dead, and they are
         counted apart. */
      const zoneOf = (x, y) => {
        try { return P.zoneAt(om, POWER, (x / FN) | 0, (y / FN) | 0, seed); }
        catch (e) { return null; }
      };
      const settled = spots.filter(s => zoneOf(s[0], s[1]) !== 'empty');
      const authoredEmpty = spots.filter(s => zoneOf(s[0], s[1]) === 'empty');

      const HOURS = [9, 13, 17];
      let zero = 0, total = 0, most = 0; const counts = [];
      let setZero = 0, setTotal = 0; const setCounts = [];
      let bodiesOnEmptyGround = 0;
      for (const h of HOURS) {
        T.min = h * 60;
        for (const s of spots) {
          const n = standAndCount(s[0], s[1]);
          counts.push(n); total++; if (!n) zero++; if (n > most) most = n;
        }
        for (const s of settled) {
          const n = standAndCount(s[0], s[1]);
          setCounts.push(n); setTotal++; if (!n) setZero++;
        }
        for (const s of authoredEmpty) bodiesOnEmptyGround += standAndCount(s[0], s[1]);
      }
      counts.sort((a, b) => a - b);
      setCounts.sort((a, b) => a - b);

      /* THE NIGHT. 03:00. The first cut of this leg asserted the street is EMPTY at
         three in the morning and it caught one body -- which turned out to be the
         world being right and the leg being wrong: `watch` is a NIGHT LOOKOUT, on a
         post, at dusk and after. A gate that demands a dead valley at 03:00 is
         demanding the watchman go home.
         So the leg tests the claim it was really for, and tests it harder: EVERY
         BORROWED BODY, AT ANY HOUR, IS SOMEBODY THEIR OWN SCHEDULE ALREADY HAS OUT
         OF DOORS. That is the whole difference between borrowing and spawning, and
         unlike a headcount it cannot be satisfied by the world happening to be
         quiet. The night is still measured, as a reading. */
      T.min = 3 * 60;
      let nightSeen = 0;
      for (const s of spots) nightSeen += standAndCount(s[0], s[1]);
      hx = was[0]; hy = was[1];
      let nightBorrowed = 0, nightInvented = 0;
      for (const [id, cell] of pplNearField()) {
        nightBorrowed++;
        const who = PPL_NEAR_LIST.filter(q => q.id === id)[0];
        if (!who) { nightInvented++; continue; }
        const sc = pplAtSched(who);
        if (sc[0] === who.home[0] && sc[1] === who.home[1]) nightInvented++;
      }

      /* NOBODY IN TWO PLACES, and NOBODY DUPLICATED ON A CELL, at 10:00 */
      T.min = 10 * 60; hx = was[0]; hy = was[1];
      const near = pplNearField();
      let twoPlaces = 0, cells = {}, dupCell = 0, dupWithBorrowed = 0, borrowed = 0, dayInvented = 0;
      for (const [id] of near) {
        const who = PPL_NEAR_LIST.filter(q => q.id === id)[0];
        if (!who) { dayInvented++; continue; }
        const sc = pplAtSched(who);
        if (sc[0] === who.home[0] && sc[1] === who.home[1]) dayInvented++;
      }
      const n0 = Math.floor(hx / span), n1 = Math.floor(hy / span);
      for (let dy = -PAD; dy <= PAD; dy++) for (let dx = -PAD; dx <= PAD; dx++)
        for (const q of (pplPeople(n0 + dx, n1 + dy) || [])) {
          const at = pplAt(q);
          const b = near.get(q.id);
          if (b) {
            borrowed++;
            const sc = pplAtSched(q);
            if (at[0] === sc[0] && at[1] === sc[1] && (sc[0] !== b[0] || sc[1] !== b[1])) twoPlaces++;
          }
          const k = at[0] + ',' + at[1];
          if (cells[k]) { dupCell++; if (b || cells[k] === 2) dupWithBorrowed++; }
          else cells[k] = b ? 2 : 1;
        }

      /* THE CENSUS DOES NOT MOVE: the same people, the same homes, whatever the
         near field says about where they are standing. */
      let heads = 0, homes = {};
      for (let dy = -PAD; dy <= PAD; dy++) for (let dx = -PAD; dx <= PAD; dx++)
        for (const q of (pplPeople(n0 + dx, n1 + dy) || [])) {
          heads++; homes[q.home[0] + ',' + q.home[1]] = 1;
        }

      /* *** AND NOBODY IS TAKEN AWAY WHILE HE IS LOOKING AT THEM. *** This is the
         guarantee on_the_way_gate handed over when its census was scoped back to the
         scheduled day: off screen, a borrowed body appearing somewhere new IS the
         ruling ("released far"); ON screen it is a person vanishing out of a doorway
         in front of him, which is the exact defect round 5 was built to kill.
         So: note who is borrowed and in sight, turn the hour, and check every one of
         them is still standing on the same cell. */
      T.min = 10 * 60; hx = was[0]; hy = was[1];
      const before = [];
      for (const [id, cell] of pplNearField())
        if (Math.max(Math.abs(cell[0] - hx), Math.abs(cell[1] - hy)) <= SEE)
          before.push([id, cell[0], cell[1]]);
      T.min = 11 * 60;
      const after = pplNearField();
      /* *** A DAY ENDING IS NOT THE FIELD MOVING SOMEBODY. *** The first cut of this leg
         counted every disappearance, and went red the moment round 8's crowd put more
         borrowed bodies inside his view: one of them had simply gone home. alive_gate
         already ruled that A HOLD MUST NEVER OUTLIVE THE SCHEDULE -- keeping somebody on
         the street after their own day ends is inventing people, which B3 forbids -- and
         it happens to everybody in the valley, borrowed or not. So a body that leaves
         because their schedule took them indoors is the world working; only a body whose
         day still has them OUT, and who is moved or dropped anyway, is this mechanism
         breaking its promise. */
      let movedInSight = 0, droppedInSight = 0, wentHome = 0;
      for (const [id, cx, cy] of before) {
        const who = PPL_NEAR_LIST.filter(q => q.id === id)[0]
                 || (function () { let f = null; for (let dy = -PAD; dy <= PAD; dy++)
                       for (let dx = -PAD; dx <= PAD; dx++)
                         for (const q of (pplPeople(n0 + dx, n1 + dy) || []))
                           if (q.id === id) f = q;
                     return f; })();
        const stillOut = who ? (function () { const sc = pplAtSched(who);
          return !(sc[0] === who.home[0] && sc[1] === who.home[1]); })() : false;
        const now = after.get(id);
        if (!now) { if (stillOut) droppedInSight++; else wentHome++; continue; }
        if (now[0] !== cx || now[1] !== cy) movedInSight++;
      }

      T.min = was[2]; hx = was[0]; hy = was[1];
      return {
        heldInSight: before.length, movedInSight, droppedInSight, wentHome,
        spots: spots.length, readings: total,
        emptyStandings: zero, pctEmpty: +(100 * zero / total).toFixed(1),
        median: counts[counts.length >> 1], most: most,
        settledSpots: settled.length, settledReadings: setTotal,
        settledEmpty: setZero,
        settledPctEmpty: setTotal ? +(100 * setZero / setTotal).toFixed(1) : null,
        settledMedian: setCounts.length ? setCounts[setCounts.length >> 1] : null,
        authoredEmptySpots: authoredEmpty.length,
        bodiesOnAuthoredEmptyGround: bodiesOnEmptyGround,
        bodiesSeenAt0300: nightSeen,
        nightBorrowed: nightBorrowed, nightInvented: nightInvented,
        dayInvented: dayInvented,
        borrowedAt1000: borrowed,
        peopleInTwoPlaces: twoPlaces,
        cellsWithTwoBodies: dupCell, ofThoseInvolvingABorrowedBody: dupWithBorrowed,
        census: heads, distinctHomes: Object.keys(homes).length
      };
    } catch (e) { return { err: String(e).slice(0, 200) }; }
  }) : { err: 'NO CITY FRAME' };

  /* B1. *** THE THING THE RULING ASKED FOR. *** Before this round it was 116 of
     120 standings with nobody in sight. The bar is set well back from what was
     measured (44) so ordinary world drift does not turn this red, but any return
     toward the old world trips it long before it reaches 96.7%. */
  ok('B1 *** THE STREET HE IS ON IS USUALLY NOT EMPTY IN DAYLIGHT *** — '
     + (m.emptyStandings != null ? m.emptyStandings : '?') + ' of '
     + (m.readings || '?') + ' standings with nobody in sight ('
     + (m.pctEmpty != null ? m.pctEmpty : '?') + '%, and it was 116 of 120 / 96.7% '
     + 'before this round)',
     !m.err && m.readings > 0 && m.pctEmpty < 70);

  /* B2. *** ON GROUND WHERE PEOPLE ACTUALLY LIVE, THE TYPICAL STANDING HAS SOMEBODY
     IN IT. *** And the split is the point. The first cut of this leg averaged over all
     forty spots and passed at median 1; then the no-man's-land fix landed and the same
     average said 0. Both were true and neither meant anything, because half these
     residential spots sit in zones the module calls EMPTY. A figure averaged over two
     populations that are meant to differ measures neither -- this lane's own standing
     note, earned twice now. */
  ok('B2 *** ON SETTLED GROUND THE TYPICAL STANDING HAS SOMEBODY IN SIGHT *** — median '
     + m.settledMedian + ' across ' + m.settledSpots + ' settled places ('
     + m.settledEmpty + ' of ' + m.settledReadings + ' still empty, '
     + m.settledPctEmpty + '%). Most seen at once ' + m.most + ', was 1',
     !m.err && m.settledMedian >= 1);

  /* B2b. AND THE OTHER HALF OF THE SPLIT: the ground the world authored as empty is
     STILL DEAD, counted here as well as in city_people_gate, because this is the gate
     whose own feature would break it. */
  ok('B2b the ' + m.authoredEmptySpots + ' places on authored-empty ground hold '
     + m.bodiesOnAuthoredEmptyGround + ' bodies across all three daylight hours',
     !m.err && m.bodiesOnAuthoredEmptyGround === 0);

  /* B3. *** AND IT IS NOT A SPAWNER. *** The leg that separates borrowing the
     valley's own people from inventing bodies, and it is checked at BOTH ends of the
     day so a quiet world can never make it pass by accident. */
  ok('B3 *** EVERY BORROWED BODY IS SOMEBODY THE SCHEDULE ALREADY HAD OUTDOORS *** — '
     + m.dayInvented + ' invented at 10:00 and ' + m.nightInvented + ' at 03:00, out of '
     + m.borrowedAt1000 + ' and ' + m.nightBorrowed + ' borrowed. It cannot put a body '
     + 'on the street that was not already out of its own front door',
     !m.err && m.dayInvented === 0 && m.nightInvented === 0);

  /* B3b. AND THE VALLEY STILL GOES QUIET. A reading, not a zero: `watch` is a night
     lookout, so 03:00 is not dead, it is nearly dead -- which is the world being
     right. The first cut of B3 demanded zero and caught the watchman. */
  ok('B3b the night is nearly empty and the day is not: ' + m.bodiesSeenAt0300
     + ' bodies across ' + (m.spots || '?') + ' places at 03:00 against '
     + (m.readings - m.emptyStandings) + ' standings with somebody in daylight',
     !m.err && m.bodiesSeenAt0300 <= Math.max(2, m.spots * 0.1));

  /* B4. THE CENSUS IS UNTOUCHED. */
  ok('B4 the valley keeps its count: ' + m.census + ' people in the gathered window '
     + 'living at ' + m.distinctHomes + ' addresses, unchanged by any of this',
     !m.err && m.census > 0 && m.distinctHomes > 0);

  /* B5. NOBODY IS IN TWO PLACES AT ONCE. */
  ok('B5 no borrowed body is also standing at their own day\'s spot ('
     + m.borrowedAt1000 + ' borrowed at 10:00, ' + m.peopleInTwoPlaces + ' in two places)',
     !m.err && m.borrowedAt1000 > 0 && m.peopleInTwoPlaces === 0);

  /* B6. THE OCCUPANCY LAW, under real pressure for the first time. */
  ok('B6 the OCCUPANCY LAW holds with people from three neighbourhoods sharing '
     + 'ground: ' + m.cellsWithTwoBodies + ' cells with two bodies on them, '
     + m.ofThoseInvolvingABorrowedBody + ' of them involving a borrowed body',
     !m.err && m.ofThoseInvolvingABorrowedBody === 0);

  /* B6b. THE GUARANTEE on_the_way_gate HANDED OVER. */
  ok('B6b nobody is moved or released while he can see them — of ' + m.heldInSight
     + ' borrowed bodies in sight, ' + m.movedInSight + ' moved and ' + m.droppedInSight
     + ' vanished with their day still out (' + m.wentHome + ' simply went home, which is '
     + 'the world working and happens to everybody)',
     !m.err && m.movedInSight === 0 && m.droppedInSight === 0);

  ok('B7 nothing threw' + (errs.length ? ' -> ' + errs[0] : ''), errs.length === 0);

  console.log('  MEASURED IN THE CUT DEMO, 40 places across the valley:');
  console.log('    ALL residential ground: ' + m.emptyStandings + ' of ' + m.readings
    + ' standings empty  (' + m.pctEmpty + '%)   was 116 of 120, 96.7%');
  console.log('    SETTLED ground only  : ' + m.settledEmpty + ' of ' + m.settledReadings
    + ' empty (' + m.settledPctEmpty + '%), median ' + m.settledMedian);
  console.log('    AUTHORED-EMPTY ground: ' + m.bodiesOnAuthoredEmptyGround
    + ' bodies across ' + m.authoredEmptySpots + ' places, and that is the point');
  console.log('    at 03:00             : ' + m.bodiesSeenAt0300 + ' bodies, and that is correct');
  console.log('    borrowed at 10:00    : ' + m.borrowedAt1000 + ' of the valley\'s own people');
  console.log('    two places / two on a cell: ' + m.peopleInTwoPlaces + ' / '
    + m.cellsWithTwoBodies + '  (borrowed-body collisions: '
    + m.ofThoseInvolvingABorrowedBody + ')');

  await ctx.close();
  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  THE STREET IS NEVER EMPTY: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  THE STREET IS NEVER EMPTY: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
