/* ============================================================================
   FEED STREAM GATE (9/5/26, LIFE + CITY lane)

   VAMILY job [feed posts] / THE-FEED-STREAM: "one event stream the city-screen
   feed reads: the deed ledger first (exists), then faction/territory events, then
   ambient life posts."

   THE LAW SPLITS THIS IN TWO AND THE OTHER HALF IS ALREADY SHIPPED. UI owns the
   SURFACE (the phone screen in CITY mode, the scroll, the beat) and said so in its
   own header -- "this is a reader, not a source" -- while carrying two stopgaps
   because the stream did not exist: an inline ledger drain and a fixed LIFE[] list.
   B2 is the leg that matters most here: ONE feed with TWO producers is the bug this
   repo keeps writing post-mortems about, so it proves no post on the real panel can
   still come from the retired list.

   MEASURED BEFORE ANY OF IT WAS WRITTEN: BOHEMIA_FACTION_GRAPH is present,
   BohemiaTowns is present WITH ZERO CALLERS, the grid has 358 live cells, the shop
   quotes real prices -- and the world source of the feed had produced 0 posts, ever.
   Everything the world needs to talk about was in the page and nothing read it.

   A3 IS THE LEG THAT CAUGHT A REAL BUG IN MY OWN FIRST CUT. The drain capped its
   RETURN at three while the sources had already advanced their cursors, so on a busy
   beat the fourth thing that happened was gone for good -- a faction taking a seat,
   eaten by a price change and two blackouts. AN EVENT STREAM THAT LOSES EVENTS IS A
   STATUS BAR WITH EXTRA STEPS. The cap delays now; it never drops.
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

const S = require('../engine/bohemia_feedstream.js');

console.log('='.repeat(74));
console.log('FEED STREAM — one stream, three sources, and the panel just reads it');
console.log('='.repeat(74));

/* ---- A. THE STREAM, HEADLESS -------------------------------------------- */

const W0 = { deedLog: [], lit: 358, prices: { water: 1, food: 1 },
             seats: { Remnants: 'fortress', Church: 'town' }, built: 0, min: 600 };

/* A1. A FEED IS THINGS THAT HAPPENED, NOT A DESCRIPTION OF THE WORLD. The first
   drain is the baseline: "the grid is at 358" is not news. */
const st = S.make();
const first = S.drain(st, W0);
ok('A1 the first drain says NOTHING about the world — it is a baseline, because a '
   + 'source that re-states the world every beat is a status bar (' + first.length
   + ' post, kind ' + (first[0] || {}).kind + ')',
   first.length === 1 && first[0].kind === 'life');

/* A2. AND THEN IT SPEAKS ONLY WHEN SOMETHING MOVES. */
const quiet = S.drain(st, W0);
ok('A2 nothing moved, so nothing is reported about the world (' + quiet[0].kind + ')',
   quiet.every(p => p.kind === 'life'));

const W1 = { deedLog: [{ who: 'lineman', d: 15, why: 'The lineman owes you one now.', quest: 'ONE GOOD DAY' }],
             lit: 352, prices: { water: 2, food: 1 },
             seats: { Remnants: 'fortress', Church: 'camp' }, built: 1, min: 600 };
const busy = S.drain(st, W1);
ok('A3a a busy beat leads with WHAT YOU DID and then what the world did ('
   + busy.map(p => p.kind).join(',') + ')',
   busy.length === S.MAX_PER_DRAIN && busy[0].kind === 'mine'
   && busy.slice(1).every(p => p.kind === 'world'));

/* A3. THE CAP DELAYS, IT NEVER DROPS. Five things happened and three fit; the other
   two must arrive on the next beat, not vanish. */
const rest = S.drain(st, W1);
const said = busy.concat(rest).map(p => p.txt).join(' | ');
ok('A3b THE CAP DELAYS A POST, IT NEVER DROPS ONE — the seat change and the new roof '
   + 'arrive on the next beat instead of being eaten (' + rest.map(p => p.kind).join(',') + ')',
   /camp now/.test(said) && /roof/.test(said) && rest.every(p => p.kind === 'world'));

/* A4. THE LEDGER IS CAPPED AND SHIFTS, so an index is not a safe cursor once it
   wraps -- reading off the front of a rotated array would replay old deeds forever. */
const st4 = S.make();
S.drain(st4, { deedLog: [{ who: 'a', d: 1 }, { who: 'b', d: 1 }, { who: 'c', d: 1 }] });
S.drain(st4, { deedLog: [{ who: 'a', d: 1 }, { who: 'b', d: 1 }, { who: 'c', d: 1 }] });
const rotated = S.deeds(st4, { deedLog: [{ who: 'b', d: 1 }] });   /* the array shifted */
ok('A4 a rotated ledger resets the cursor instead of reading off its front ('
   + rotated.length + ' post from a shorter log)', rotated.length === 1);

/* A5. THE POST QUOTES THE QUEST'S OWN WORDS. The ledger keeps the completing stage's
   @LOG line, so a post about your standing is never prose written ABOUT the quest --
   the 8/11 catalogue rule, and the reason `why` is read first. */
const st5 = S.make();
const quoted = S.deeds(st5, { deedLog: [{ who: 'lineman', d: 9, why: 'You put the power back on Sahara.', quest: 'Q1' }] });
ok('A5 a deed post QUOTES THE QUEST\'S OWN REASON ("' + quoted[0].txt + '")',
   /You put the power back on Sahara\./.test(quoted[0].txt) && /\[Q1\]/.test(quoted[0].txt));

/* A6. AMBIENT LIFE IS KEYED OFF WHAT EXISTS -- which is the half of his ruling a
   fixed list cannot satisfy. A dark valley and a lit one must not say the same thing. */
const darkSt = S.make(), litSt = S.make();
const dark = S.life(darkSt, { lit: 0, min: 23 * 60, prices: { water: 3 } });
const bright = S.life(litSt, { lit: 900, min: 9 * 60, prices: { water: 1 },
                               seats: { Remnants: 'fortress' } });
ok('A6 a dark midnight valley and a lit morning one say DIFFERENT things ("'
   + dark[0].txt.slice(0, 34) + '" vs "' + bright[0].txt.slice(0, 34) + '")',
   dark[0].txt !== bright[0].txt);

/* A7. AND IT NEVER SAYS THE SAME THING TWICE RUNNING. The panel seeds itself with
   three in a row, so a plain rotation over a two-line set printed the same sentence
   back to back the moment he opened it -- found by reading the panel, not the diff. */
const st7 = S.make();
const w7 = { lit: 100, min: 7 * 60, prices: { water: 1 }, seats: { Mob: 'town' } };
const three = [S.life(st7, w7)[0].txt, S.life(st7, w7)[0].txt, S.life(st7, w7)[0].txt];
ok('A7 ambient life never repeats back to back (' + three.length + ' in a row, '
   + new Set(three).size + ' distinct)',
   three[0] !== three[1] && three[1] !== three[2]);

/* A8. EVERY LINE IS AN ATTEMPT, TAGGED. Posts are TEXT, so ALWAYS MAKE AN ATTEMPT
   (8/11) applies: real attempts, draft:true, and WORDS edits them later. */
const st8 = S.make();
S.drain(st8, W0);
const all = S.drain(st8, W1).concat(S.drain(st8, W1)).concat(S.life(st8, W1));
ok('A8 every post is a real attempt tagged draft:true (' + all.length + ' checked)',
   all.length > 0 && all.every(p => p.draft === true && p.who && p.txt));

/* A9. THE NAMES ARE THE WORLD'S. Nothing here types a faction name, so a post can
   only ever name a faction the graph actually has. */
const st9 = S.make();
S.drain(st9, { seats: { Nobody: 'camp' }, lit: 1 });
const named = S.drain(st9, { seats: { Nobody: 'town' }, lit: 1 });
ok('A9 a faction post names the faction it was HANDED, never one typed here ("'
   + named[0].txt + '")', /Nobody/.test(named[0].txt));

/* A10 AND A11 EXIST BECAUSE I BROKE ANOTHER LANE'S GATE AND THIS IS HOW IT STAYS
   FIXED. The first cut ran the WHOLE drain on the ambient cadence (one in eight
   beats), so a finished quest waited up to seven beats and UI's own feed gate went red
   on the latency it publishes as its contract. THE CADENCE BELONGS TO THE SOURCE:
   events every beat, ambient one in eight, and filling an empty panel is a third case
   that obeys neither. Fixing their gate is not enough -- these hold it. */
const st10 = S.make();
S.drain(st10, { deedLog: [], lit: 5, beat: 100 });
const urgent = S.drain(st10, { deedLog: [{ who: 'x', d: 1, why: 'it happened.' }], lit: 5, beat: 101 });
ok('A10 A DEED LANDS ON THE NEXT BEAT, never on the ambient cadence — the surface\'s '
   + 'published contract, and the leg that keeps UI\'s gate green ('
   + urgent.map(p => p.kind).join(',') + ')',
   urgent.length === 1 && urgent[0].kind === 'mine');

const quietBeats = [S.drain(st10, { lit: 5, beat: 102 }), S.drain(st10, { lit: 5, beat: 103 })];
ok('A11a and ambient does NOT fill every beat, or the panel is a ticker ('
   + quietBeats.map(x => x.length).join(',') + ' posts on two quiet beats)',
   quietBeats.every(x => x.length === 0));

const burst = S.seed(S.make(), { lit: 5, min: 9 * 60, prices: { water: 1 },
                                 seats: { Mob: 'town' }, beat: 200 }, 3);
ok('A11b but an EMPTY PANEL is filled at once — three lines, cadence or not, because a '
   + 'blank phone reads as broken (' + burst.length + ' seeded, '
   + new Set(burst.map(p => p.txt)).size + ' distinct)',
   burst.length === 3 && new Set(burst.map(p => p.txt)).size >= 2);

/* ---- B. THE REAL SURFACE ------------------------------------------------ */
(async () => {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(ROOT, url.replace(/^\//, ''));
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_CITY_WORLD.html',
    { waitUntil: 'load', timeout: 240000 });
  await page.waitForTimeout(6000);

  const tapText = async (re) => {
    const t = await page.evaluate(src => {
      const R = new RegExp(src);
      const e = [...document.querySelectorAll('button,div,span')]
        .filter(x => x.offsetParent !== null && R.test((x.textContent || '').trim())
                     && (x.textContent || '').trim().length < 30)
        .sort((a, b) => a.textContent.length - b.textContent.length)[0];
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), t: e.textContent.trim() };
    }, re);
    if (t) { await page.touchscreen.tap(t.x, t.y); await page.waitForTimeout(1800); }
    return t;
  };

  await tapText('^GET UP$');

  /* B1. THE GATHER READS THE REAL WORLD, and this is the first thing on this surface
     ever to read BohemiaTowns -- measured at zero callers before this job. */
  const w = await page.evaluate(() => {
    const g = BOHEMIA_FEED.world();
    return { lit: g.lit, goods: g.prices ? Object.keys(g.prices).length : 0,
             seats: g.seats ? Object.keys(g.seats).length : 0,
             sample: g.seats ? Object.keys(g.seats).slice(0, 2).map(k => k + '=' + g.seats[k]) : [],
             built: g.built, min: g.min };
  });
  ok('B1 the gather reads the REAL world: ' + w.lit + ' live blocks, ' + w.goods
     + ' priced goods, ' + w.seats + ' faction seats from the graph (' + w.sample.join(', ')
     + ') — the first caller BohemiaTowns has ever had on this surface',
     w.lit > 0 && w.goods >= 2 && w.seats >= 2
     && w.sample.every(s => /=(fortress|town|camp)$/.test(s)));

  /* B2. ONE PRODUCER. The surface's retired LIFE[] list must never reach the panel
     again -- two producers for one feed is the bug, and the second one hid behind a
     rename the first time (the seed-on-open path, missed on my first pass). */
  await tapText('CITY|DROP IN');
  await page.waitForTimeout(9000);
  const panel = await page.evaluate(() => ({
    on: BOHEMIA_FEED.isOn(),
    posts: BOHEMIA_FEED.posts().map(p => p.txt),
    hasStream: !!BOHEMIA_FEED.stream()
  }));
  /* three lines that exist ONLY in the retired list */
  const retired = [/round the block again/, /two batteries for a full can/,
                   /somebody swept the whole block on Sahara/];
  const leaked = panel.posts.filter(t => retired.some(r => r.test(t)));
  ok('B2 the panel fills IN CITY MODE and every post comes from the stream — none from '
     + 'the retired list (' + panel.posts.length + ' posts, ' + leaked.length + ' leaked)',
     panel.on === true && panel.hasStream === true
     && panel.posts.length >= 3 && leaked.length === 0);

  /* B3. AND A THING THAT HAPPENS REACHES HIS SCREEN. */
  const before = await page.evaluate(() => BOHEMIA_FEED.posts().length);
  await page.evaluate(() => { const s = BOHEMIA_FEED.stream(); if (s) s.lit = s.lit - 6; });
  await page.waitForTimeout(9000);
  const after = await page.evaluate(() => ({
    n: BOHEMIA_FEED.posts().length,
    world: BOHEMIA_FEED.posts().filter(p => p.kind === 'world').map(p => p.txt) }));
  ok('B3 SIX BLOCKS CHANGING ON THE GRID BECOMES A POST HE CAN READ ("'
     + (after.world[after.world.length - 1] || 'NO WORLD POST') + '")',
     after.n > before && after.world.length >= 1 && /grid|dark/.test(after.world.join(' ')));

  ok('B4 nothing threw on the walked surface' + (errs.length ? ' -> ' + errs[0] : ''),
     errs.length === 0);

  /* ---- C. THE DEMO (rule 7) ---------------------------------------------- */
  const dpage = await ctx.newPage();
  const derrs = [];
  dpage.on('pageerror', e => derrs.push(String(e).slice(0, 160)));
  await dpage.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_DEMO.html',
    { waitUntil: 'load', timeout: 240000 });
  await dpage.waitForTimeout(4000);
  await dpage.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
  await dpage.waitForTimeout(3000);
  await dpage.evaluate(() => {
    const n = document.getElementById('openNot'); if (n) n.click();
    const s2 = document.getElementById('openSkip'); if (s2) s2.click(); });
  await dpage.waitForTimeout(14000);
  const cf = dpage.frames().filter(f => /CITY_WORLD/.test(f.url()))[0] || null;
  const dfeed = cf ? await cf.evaluate(() => {
    try {
      const g = BOHEMIA_FEED.world();
      const st2 = BohemiaFeedStream.make();
      BohemiaFeedStream.drain(st2, g);
      g.lit = (g.lit || 0) + 5;
      const out = BohemiaFeedStream.drain(st2, g);
      return { seats: g.seats ? Object.keys(g.seats).length : 0, said: out.map(p => p.txt) };
    } catch (e) { return { err: String(e).slice(0, 90) }; }
  }) : null;
  ok('C1 the stream is live in the cut demo and the world can speak there ('
     + (dfeed && dfeed.said ? dfeed.seats + ' seats, "' + (dfeed.said[0] || '') + '"'
        : (dfeed && dfeed.err) || 'NO CITY FRAME') + ')',
     !!dfeed && !!dfeed.said && dfeed.seats >= 2
     && dfeed.said.some(t => /grid/.test(t)));
  ok('C2 nothing threw in the demo' + (derrs.length ? ' -> ' + derrs[0] : ''),
     derrs.length === 0);

  console.log('  MEASURED ON THE WALKED SURFACE:');
  console.log('    the world it reads : ' + w.lit + ' live blocks, ' + w.goods
    + ' priced goods, ' + w.seats + ' faction seats, ' + w.built + ' built');
  console.log('    on the panel       : ' + panel.posts.length + ' posts, '
    + leaked.length + ' from the retired list');
  console.log('    when the grid moved: "' + (after.world[after.world.length - 1] || '?') + '"');

  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  FEED STREAM: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  FEED STREAM: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
