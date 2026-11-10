/* ============================================================================
   A CROWD TO WALK INTO (9/12/26, LIFE + CITY lane)
   ROUND 8 of VAMILY [more people] POPULATION-DEFAULT.

   Round 7 put a FLOOR under the street: the empty standings went from 116 of 120 to 65,
   and a walk now always meets somebody. What it could not do was give him a CROWD. The
   most he ever saw at once was 2, because one borrowed body per screenful is exactly what
   that lattice promises.

   *** AND THE FIRST MEASUREMENT SAID THE CROWDS WERE ALREADY BUILT. *** Standing on
   residential ground anywhere in the valley, across four daylight hours:
       peak 2       86 of 160 standings saw nobody, 70 saw one, 4 saw two
   Standing ON a gathering place, the same count:
       17, 14, 11, 10, 9, 8, 8, 8
   Round 2's places work. HE JUST NEVER ENDS UP ON ONE -- a place is a single cell in a
   valley of millions, so the crowd exists and he walks past it forever.

   TWO CUTS THEN FAILED THE SAME WAY, AND THE WALK IS WHAT CAUGHT BOTH. Filling the
   nearest REAL place doubled the crowd standing at a place from 17 to 37 and a walk met
   0 crowds in 16, exactly as before, because the places are a hundred cells off. Round
   6's lesson in a new hat: A MECHANISM THAT IS RIGHT AND NEVER HAPPENS IS NOT A
   DELIVERABLE, and standing on sampled ground is not how anybody plays.

   WHAT SHIPPED: the crowd forms on the best FRONTAGE within two screenfuls of him, where
   a screenful is the repo's own 2 x SEE_RANGE + 1 and the frontage is scored by the same
   instrument that picks a place. Beyond one SEE_RANGE, so nobody ever forms up inside his
   own view. How many make a crowd is the population module's HEADS.cluster, never more
   than half the borrowed people so round 7's floor survives.

   AFTER, ON THE WALK:  0 of 16 walks met a crowd -> 5 of 16.  Biggest group seen 3 -> 14.

   *** ROUND 10 TOOK IT TO 13 OF 16, AND IT OPENED BY BEING WRONG ABOUT WHY. *** I
   assumed the eight misses were crowds too small. A probe that recovered the knot from
   public state on every sample said the opposite, and it was not close:

       of the 8 misses:  crowd never big enough  0
                         big enough but BEHIND   8
                         big enough and ahead    0

   Every miss had 12 or 13 bodies standing in it against a threshold of 7. Not one walk
   ever failed for want of people. Round 8 had already bought the crowd and never spent
   it: the spot was the best frontage in ANY BEARING, and a straight walk has even odds.

   THE FIRST CUT WAS A HALF-PLANE AND IT BOUGHT ONE WALK, 8 -> 9, WHICH IS NOISE. The
   walk that went from met to missed is what named the real cause: the crowd was ahead
   of him for 43 of 50 samples and he never saw it. A half-plane is 180 DEGREES WIDE, so
   a crowd 80 degrees off his line is "ahead" and he walks straight past it. Measured on
   four misses, hundreds of cells of travel each, with the crowd standing still (the
   anchor moved 0 or 1 times in a whole walk, so it was never a carrot):

       CLOSEST HE EVER GOT:  13, 14, 15, 15        SEE_RANGE is 9

   Never once inside seeing range. SO THE TEST IS THE PERPENDICULAR OFFSET FROM THE LINE
   HE IS WALKING, and the number is SEE itself -- not a tuning constant but the
   definition of the question: when he draws level with the crowd, it has to be close
   enough to SEE. 8 of 16 -> 13 of 16, and the floor did not move (16 of 16 still meet
   somebody). THE LESSON: IN FRONT OF HIM AND ON HIS WAY ARE NOT THE SAME THING, and the
   first is worth almost nothing.

   ROUND 9 TOOK IT TO 8 OF 16, and the change was not about crowds at all. The field
   rebuilt when he crossed a 512-cell NEIGHBOURHOOD BOUNDARY -- an arbitrary line on a
   grid -- so a 400-step walk got one or two chances at a crowd however far it went.
   Anchoring the rebuild on HIS OWN POSITION was tried first and measured WORSE, 4 of 16,
   because every sixty cells it threw away the crowd he might have been walking toward and
   built another somewhere else: he was chasing a mirage. ANCHORED ON THE CROWD, a crowd he
   is approaching is never discarded -- it stands until he has genuinely left it behind,
   and only then does the next one form. 5 of 16 -> 8 of 16, half of all walks.
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
console.log('A CROWD TO WALK INTO — the peaks, measured by walking');
console.log('='.repeat(74));

const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

/* A1. HOW MANY MAKE A CROWD IS THE MODULE'S OWN SETTLEMENT SIZE, not a number typed here. */
ok('A1 the crowd is HEADS.cluster from the population module, and never more than half '
   + 'the borrowed people so the floor survives',
   /P\.HEADS\.cluster \|\| 13, Math\.floor\(pool\.length \/ 2\)/.test(CITY));

/* A2. AND HOW FAR AWAY IS THE REPO'S OWN SCREENFUL, the same unit the floor's lattice
   uses -- and never inside his own view, which is round 7's promise. */
ok('A2 the crowd stands within two screenfuls and beyond one SEE_RANGE, in the repo\'s '
   + 'own unit rather than a distance somebody liked',
   /var __SCREEN = SEE \* 2 \+ 1;/.test(CITY)
   && /__d > __SCREEN \* 2/.test(CITY) && /__d <= SEE\) continue;/.test(CITY));

/* A3. AND IT STANDS ON HIS WAY, NOT MERELY IN FRONT OF HIM -- the round 10 rule, with
   the repo's own SEE as the width. A half-plane test shipped for one measurement and
   bought one walk in sixteen; this is what replaced it, and the leg names both the
   forward test and the perpendicular one so neither can be dropped back to the other. */
ok('A3 the crowd stands ON THE LINE HE IS WALKING -- forward of him AND within one '
   + 'SEE_RANGE of his heading, so he is level with it while it is still close enough '
   + 'to see, rather than anywhere in the 180 degrees a half-plane allows',
   /__vx \* __hd\[0\] \+ __vy \* __hd\[1\] <= 0\) continue;/.test(CITY)
   && /Math\.abs\(__vx \* __hd\[1\] - __vy \* __hd\[0\]\) \/ __hl > SEE\) continue;/.test(CITY));

/* A4. AND THE HEADING IS READ, NOT INVENTED. The walked surface stores no facing for
   the player; two rebuilds apart IS the heading. A stored facing would be a second
   source of truth for something the positions already answer. */
ok('A4 the heading comes from where he stood at the last rebuild against where he '
   + 'stands now, so nothing invents a second source of truth for which way he faces',
   /var PPL_NEAR_FROM = null;/.test(CITY)
   && /var __wasFrom = PPL_NEAR_FROM;\s*\n\s*PPL_NEAR_FROM = \[hx, hy\];/.test(CITY)
   && /if \(__wasFrom\) \{/.test(CITY));

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
  /* THE CUT DEMO, THROUGH THE IFRAME -- the standalone surface blits nobody. */
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
      /* A CROWD IS HALF A SETTLEMENT, from the module's own HEADS.cluster. Half, because
         half a settlement standing together is unmistakably a crowd and the whole of one
         only ever happens at a real place. */
      const CROWD = Math.ceil((P.HEADS.cluster || 13) / 2);
      const was = [hx, hy, T.min | 0];
      const PAD = 1 + PPL_TRAVEL_MAX;
      const seen = () => {
        const a = [Math.floor(hx / span), Math.floor(hy / span)];
        let n = 0;
        for (let dy = -PAD; dy <= PAD; dy++) for (let dx = -PAD; dx <= PAD; dx++)
          for (const q of (pplPeople(a[0] + dx, a[1] + dy) || [])) {
            const at = pplAt(q);
            if (at[0] === hx && at[1] === hy) continue;
            if (Math.max(Math.abs(at[0] - hx), Math.abs(at[1] - hy)) <= SEE) n++;
          }
        return n;
      };
      /* *** WALK. *** Standing on sampled ground is not how anybody plays, and two cuts
         of this round passed a standing test while a walk met nothing. */
      const DIRS = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
      const STEPS = 400;
      let metCrowd = 0, metAnybody = 0, peakAll = 0;
      for (let w = 0; w < 16; w++) {
        hx = was[0]; hy = was[1]; T.min = (9 + (w % 3) * 4) * 60;
        const d = DIRS[w % DIRS.length];
        let peak = 0, sawAny = false;
        for (let s = 0; s < STEPS; s++) {
          let nx = hx + d[0], ny = hy + d[1];
          if (!pplStandable(nx, ny)) {
            const alt = DIRS[(w + s) % DIRS.length];
            nx = hx + alt[0]; ny = hy + alt[1];
            if (!pplStandable(nx, ny)) continue;
          }
          hx = nx; hy = ny;
          if (s % 8 === 0) { const n = seen(); if (n > peak) peak = n; if (n > 0) sawAny = true; }
        }
        if (peak >= CROWD) metCrowd++;
        if (sawAny) metAnybody++;
        if (peak > peakAll) peakAll = peak;
      }

      /* AND THE NIGHT: a crowd that stands at three in the morning is invented people. */
      hx = was[0]; hy = was[1]; T.min = 3 * 60;
      let nightPeak = 0;
      for (let s = 0; s < 200; s++) {
        const nx = hx + 1, ny = hy;
        if (pplStandable(nx, ny)) { hx = nx; hy = ny; }
        if (s % 8 === 0) { const n = seen(); if (n > nightPeak) nightPeak = n; }
      }

      hx = was[0]; hy = was[1]; T.min = was[2];
      return { walks: 16, crowdIs: CROWD, metAnybody, metCrowd, peakAll, nightPeak };
    } catch (e) { return { err: String(e).slice(0, 200) }; }
  }) : { err: 'NO CITY FRAME' };

  /* B1. *** THE THING ROUND 8 IS FOR. *** It was 0 of 16 before, twice, through two
     different cuts that both passed a standing test. */
  ok('B1 *** A WALK MEETS A CROWD *** — ' + m.metCrowd + ' of ' + m.walks
     + ' walks saw ' + m.crowdIs + ' or more at once. It was 0 of 16 before round 8, 5 of '
     + '16 when round 8 shipped, 8 of 16 once the rebuild was anchored on the CROWD '
     + 'instead of on a grid line, and 13 of 16 once the crowd had to stand ON HIS WAY '
     + 'rather than merely in front of him',
     !m.err && m.metCrowd >= 11);

  /* B2. AND THE BIGGEST GROUP HE CAN GET IN FRONT OF. */
  ok('B2 the biggest group seen on a walk is ' + m.peakAll + ', and it was 3',
     !m.err && m.peakAll >= m.crowdIs);

  /* B3. AND ROUND 7'S FLOOR DID NOT GO BACK UP. A crowd built by taking the floor's own
     people away would read as a win here and a loss on the street. */
  ok('B3 every walk still meets somebody — ' + m.metAnybody + ' of ' + m.walks
     + ' — so the crowd was not built out of the floor',
     !m.err && m.metAnybody === m.walks);

  /* B4. AND IT IS NOT A SPAWNER. At three in the morning the valley is indoors and there
     is no crowd to walk into, because the mechanism can only borrow people already out. */
  ok('B4 no crowd stands at three in the morning (' + m.nightPeak + ' seen at the peak)',
     !m.err && m.nightPeak < m.crowdIs);

  ok('B5 nothing threw' + (errs.length ? ' -> ' + errs[0] : ''), errs.length === 0);

  console.log('  MEASURED BY WALKING, IN THE CUT DEMO:');
  console.log('    walks that met a crowd : ' + m.metCrowd + ' of ' + m.walks
    + '   (0 of 16 before round 8, 5 of 16 at round 8)');
  console.log('    biggest group seen     : ' + m.peakAll + '   (3 before)');
  console.log('    walks that met anybody : ' + m.metAnybody + ' of ' + m.walks
    + '   (round 7\'s floor, unchanged)');
  console.log('    at three in the morning: ' + m.nightPeak + ', and that is correct');

  await ctx.close();
  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  A CROWD TO WALK INTO: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  A CROWD TO WALK INTO: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
