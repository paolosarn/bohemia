/* ============================================================================
   THIS WEEK (9/6/26, RUN lane)
   VAMILY [weekly goal] / BB-THIS-WEEK, day 18 of the study.

   THE ROW: *** A GOAL YOU HAVE TO GO FIND IS NOT A GOAL. *** Day 7 found the
   DAILY motor and days 9 and 11 found the HUNDRED-HOUR arc. Nobody ever asked
   WHAT YOU ARE WORKING ON THIS WEEK.

   THE EVIDENCE, and it is unusually blunt: forty children behind and
   uninterested in arithmetic, working alone under PROXIMAL SUB-GOALS, a DISTAL
   GOAL, or "work productively". Under proximal sub-goals they progressed
   rapidly, reached real mastery, and developed both self-efficacy AND genuine
   interest in a subject that had held none for them.
   *** DISTAL GOALS HAD NO DEMONSTRABLE EFFECTS. Not weaker. NONE. ***

   MEASURED BEFORE BUILDING, and both halves of the row's claim held:
     * the middle horizon was ALREADY BUILT and ALREADY HIDDEN -- rungRead()
       answers it exactly, behind the STANDING button nobody presses
     * and the reckoning card, the last thing seen every single day, said
       nothing about what you are working toward

   So nothing was designed here. The answer the game already had was put on the
   card he passes anyway, read from the STANDING card's OWN source.

   AND THE FIRST CUT OF THE WORDS FAILED ITS OWN STUDY, which is the assertion
   that matters most below: it read "8 MORE FACTIONS AND THE CITY BACKS YOU" on
   a fresh run. Eight from zero IS the distal goal -- the condition the study
   found had no effect at all -- wearing a number. The ask is ONE MORE, every
   time, and the climb sits under it as progress.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');
const SLICES = path.join(ROOT, 'slices');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const done = () => {
  console.log('THIS WEEK: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json',
               '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
      const f = path.join(SLICES, rel);
      if (!f.startsWith(SLICES) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rs.statusCode = 404; return rs.end('no');
      }
      rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
      fs.createReadStream(f).pipe(rs);
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

/* ---- 1. IN THE SOURCE ---------------------------------------------------
   THE CARD LIVES IN THE CITY FILE, AND THE DEMO LOADS THAT FILE RATHER THAN
   EMBEDDING IT -- so grepping the demo for this mark finds nothing and proves
   nothing. The first cut of this gate did exactly that and went red on a build
   that was working. The demo's half of the claim is that it loads the city at
   all; the rest of the demo's proof is the served run below, which is the only
   honest way to ask it anyway. */
{
  const demo = fs.readFileSync(path.join(SLICES, 'BOHEMIA_DEMO.html'), 'utf8');
  ok('the demo loads the walked city, which is where this lives',
     /BOHEMIA_CITY_WORLD\.html/.test(demo));
}
for (const f of ['BOHEMIA_CITY_WORLD.html']) {
  const src = fs.readFileSync(path.join(SLICES, f), 'utf8');
  ok(f + ' carries it', src.indexOf('__THIS_WEEK__') > 0);
  /* NO SECOND TABLE. This lane already shipped one bug of exactly this shape on
     exactly this card ([drains shown]: a side list next to the ledger), so the
     source is asserted, not trusted. */
  const at = src.indexOf('__THIS_WEEK__');
  const block = src.slice(at, at + 2600);
  ok('  and it reads rungRead(), the STANDING card\'s OWN source',
     /rungRead\s*\(\s*\)/.test(block));
  ok('  and it invents no second standing table of its own',
     !/BohemiaMandate|DQ\.shared\.faction|rungRoster/.test(block));
  ok('  and it degrades silently rather than inventing a goal',
     /typeof\s+rungRead\s*===\s*'function'/.test(block));
}

/* ---- 2. THE REAL SURFACE, SERVED ---------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const srv = await serve();
  const url = 'http://127.0.0.1:' + srv.address().port + '/BOHEMIA_DEMO.html';
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

    await page.goto(url, { waitUntil: 'load', timeout: 240000 });
    await SETTLE(page, 3000);
    await page.tap('#front').catch(async () => { await page.click('#front').catch(() => { }); });
    await SETTLE(page, 90000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined'
                                        && typeof advance === 'function' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    await sleep(2500);
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); srv.close(); return done(); }

    /* PLAY THE DAY OUT ON THE GAME'S OWN CLOCK. advance() is what every walked
       step calls; the HUD's T is a mirror the day loop overwrites, so driving
       that instead would be timing a race (measured, 9/6). Cards are cleared as
       they arrive, the way a player taps through them. */
    for (let i = 0; i < 40; i++) {
      const p = await city.evaluate(() => DAY.phase).catch(() => 'ended');
      if (p === 'ended') break;
      await city.evaluate(() => {
        try { const c = document.getElementById('daycard');
          if (c && c.classList.contains('on')) { const g = c.querySelector('.dcgo'); if (g) g.click(); }
        } catch (e) { }
      }).catch(() => { });
      await city.evaluate(() => { advance(30); }).catch(() => { });
      await sleep(110);
    }
    await sleep(2200);

    const card = await city.evaluate(() => {
      const inn = document.getElementById('daycardIn');
      if (!inn) return null;
      const secs = [].map.call(inn.querySelectorAll('h3'), e => e.textContent);
      const idx = secs.indexOf('WHAT YOU ARE WORKING ON');
      let items = [];
      if (idx >= 0) {
        const uls = inn.querySelectorAll('ul');
        if (uls[idx]) items = [].map.call(uls[idx].querySelectorAll('li'), e => e.textContent);
      }
      let read = null;
      try { const r = rungRead(); read = { ok: r.ok, rung: r.rung, fwu: r.fwu.length,
                                           need: r.need, total: r.total }; } catch (e) { }
      return { sections: secs, items: items, read: read };
    });
    ok('the day really ended and the reckoning is up', !!card && card.sections.length > 0);
    if (!card) { await browser.close(); srv.close(); return done(); }

    ok('*** THE LAST THING HE SEES EVERY DAY NOW SAYS WHAT HE IS WORKING ON *** ('
      + card.sections.join(' / ') + ')',
       card.sections.indexOf('WHAT YOU ARE WORKING ON') >= 0);
    ok('and it says something (' + JSON.stringify(card.items) + ')', card.items.length >= 1);

    const askLine = card.items[0] || '';
    /* *** THE CLAIM THIS WHOLE ROW RESTS ON. *** The study found DISTAL goals had
       NO demonstrable effect, so an ask of "8 more factions" on a fresh run is
       not a weaker version of this feature, it is the condition that did
       nothing. My own first cut read exactly that and this caught it. */
    ok('*** THE ASK IS THE NEXT ONE, NOT THE WHOLE CLIMB -- a distal goal is the '
      + 'condition the study found does NOTHING *** (' + askLine + ')',
       /ONE MORE FACTION|CITY BACKS YOU|GOVERNING/.test(askLine)
       && !/^\s*\d+\s+MORE/.test(askLine));

    /* AND THE CLIMB IS STILL VISIBLE, as progress rather than as the ask. */
    if (card.read && card.read.rung === 'TERRITORY' && card.read.fwu < card.read.need) {
      const prog = card.items[1] || '';
      ok('and the climb is underneath it as progress (' + prog + ')',
         prog.indexOf(String(card.read.fwu) + ' of ' + String(card.read.need)) === 0);
      /* IT COUNTS AGAINST WHAT YOU NEED, NOT THE WHOLE ROSTER: 8 of 16 factions
         exist but the mandate needs 8, and "0 of 16" would understate it by
         half and quietly make the goal twice as far away as it is. */
      ok('and it counts toward the mandate, not the whole roster ('
        + card.read.need + ' needed of ' + card.read.total + ' in the valley)',
         prog.indexOf(' of ' + String(card.read.total)) === -1
         || card.read.need === card.read.total);
    }

    /* THE STANDING CARD IS STILL THERE AND STILL AGREES: one source, two
       surfaces. A middle horizon that reads differently in two places is worse
       than one that is hidden. */
    const standing = await city.evaluate(() => {
      try {
        showStanding();
        const inn = document.getElementById('daycardIn');
        const t = inn ? inn.textContent : '';
        const r = rungRead();
        return { text: t.slice(0, 400), rung: r.rung, fwu: r.fwu.length, total: r.total };
      } catch (e) { return { err: String(e.message).slice(0, 90) }; }
    });
    ok('the STANDING card still opens and still answers (' + (standing.rung || standing.err) + ')',
       !!standing.rung);
    ok('*** AND BOTH SURFACES READ THE SAME NUMBER, because they read the same '
      + 'function *** (' + standing.fwu + ' of ' + standing.total + ')',
       !!standing.rung && standing.text.indexOf(standing.fwu + ' of ' + standing.total) >= 0);

    ok('nothing threw through any of it'
      + (errs.length ? ' -- first: ' + errs[0] : ''), errs.length === 0);

    await browser.close();
    srv.close();
    done();
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
    try { await browser.close(); } catch (e2) { }
    try { srv.close(); } catch (e2) { }
    done();
  }
})();
