/* ============================================================================
   A DAY'S WORK GATE (9/7/26, WORLD lane) -- board row [a days work] /
   EVERYBODY-IN-THE-VALLEY-HAS-A-JOB-EXCEPT-THE-PLAYER.

   THE FINDING, MEASURED IN OUR OWN CODE: the valley's people have seven acts
   (errand, free, home, scav, sleep, watch, work) and put in a seven-hour day. The
   player had six (walk, talk, fight, build, buy, sleep) and NOT ONE OF THEM WAS
   WORK. Of the four money verbs -- finish a quest (+1), build (-1), buy (-1), ask
   (-1 clout) -- three are spending, one is earning, and none is work.

   WHAT THIS GATE IS REALLY FOR: proving the working day is READ and never TYPED.
   A shift is as long as the valley's own schedule says that archetype works, on
   this seed. Where work happens is his JOB_DISTRICTS. What it produces is the
   economy's YIELD. What it pays is the purse's ruled ONE. If any of those move,
   the game moves with them and this file reports the new number rather than
   demanding the old one.

   node gates/a_days_work_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const W = require(path.join(ROOT, 'engine/bohemia_work.js'));
const A = require(path.join(ROOT, 'engine/bohemia_agents.js'));
const E = require(path.join(ROOT, 'engine/bohemia_economy.js'));
const P = require(path.join(ROOT, 'engine/bohemia_purse.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log("A DAY'S WORK GATE: " + pass + ' passed, ' + fail + ' failed'
            + '  (the player works the valley\'s own hours, for the valley\'s own'
            + ' yield, paid out of his own ruled one)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. the module owns no table of its own ---------------------------- */
{
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_work.js'), 'utf8');
  /* A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1): the
     header of this module is full of measured numbers, and every one of them is a
     COMMENT. Strip the comments and the strings before grepping the logic. */
  const logic = src.replace(/\/\*[\s\S]*?\*\//g, '')
                   .replace(/\/\/[^\n]*/g, '')
                   .replace(/'(?:\\.|[^'\\])*'/g, "''");
  const nums = (logic.match(/\b\d+(\.\d+)?\b/g) || []);
  ok('THE WORKING DAY IS READ, NEVER TYPED -- no duration, rate, price or yield is'
     + ' written into the module (numerals in its logic: ' + (nums.join(' ') || 'none') + ')',
     nums.every(n => n === '0' || n === '1' || n === '8' || n === '60'));
  ok('and it names no district of its own -- his JOB_DISTRICTS is the only list',
     !/commercial|industrial|medical|solar/.test(logic));
  ok('and no yield, price or pay word appears in its logic at all',
     !/(yield|price|pay|salvage|battery|electricity)\s*[:=]/i.test(logic));
  ok('it asks for its neighbours when it needs them, never at load time',
     /function AG\(\)/.test(src) && /function ECON\(\)/.test(src)
     && !/^\s*var\s+(AGENTS|ECONOMY)\s*=\s*(require|root)/m.test(logic));
}

/* ---- 2. every part of it is somebody else's number --------------------- */
{
  const kinds = W.kinds();
  ok('the kinds of work are the economy\'s own (' + kinds.join(', ') + ')',
     kinds.length > 0 && kinds.every(k => Object.prototype.hasOwnProperty.call(E.YIELD, k)));
  ok('and it never invents a kind the economy does not have',
     kinds.every(k => Object.keys(E.YIELD).indexOf(k) >= 0));

  /* THE SHIFT LENGTH, RECOMPUTED HERE INDEPENDENTLY off the valley's own builder.
     If this file and the module ever disagree, one of them is lying. */
  let agreed = 0, checked = 0, sample = [];
  for (const k of kinds) {
    const b = W.BRIDGE[k];
    for (let seed = 1; seed <= 50; seed++) {
      const sched = A.scheduleFor(seed, b.archetype, 8 * 60);
      let mins = 0;
      for (const blk of sched) if (blk.act === b.act) mins += (blk.t1 - blk.t0);
      checked++;
      if (W.minutesFor(k, seed) === mins) agreed++;
      if (seed === 1) sample.push(k + ' ' + mins + ' min');
    }
  }
  ok('a shift is EXACTLY the valley\'s own working block for that archetype, on this'
     + ' seed (' + sample.join(', ') + '; ' + agreed + '/' + checked + ' agree)',
     checked > 0 && agreed === checked);

  /* *** AND THE ONE NUMERAL IN THE MODULE IS PROVED NOT TO MATTER. *** minutesFor
     hands scheduleFor an 8am clock-on because the function demands one. If that
     argument could change how LONG the work is, it would be a typed shift length
     wearing a disguise. It cannot: bohemia_agents builds the work block as
     `until(shift + j(480,45))` right after `until(shift)`, so the start slides and
     the length does not. Measured rather than argued. */
  let invariant = true;
  for (const k of kinds) {
    const b = W.BRIDGE[k];
    for (let seed = 1; seed <= 30; seed++) {
      const len = (sh) => {
        const s = A.scheduleFor(seed, b.archetype, sh);
        let m = 0; for (const blk of s) if (blk.act === b.act) m += (blk.t1 - blk.t0);
        return m;
      };
      if (len(5 * 60 + 30) !== len(8 * 60) || len(9 * 60) !== len(8 * 60)) invariant = false;
    }
  }
  ok('*** and what time the crew clocks on cannot change how long the work is, so'
     + ' the one numeral in the module is not a shift length in disguise ***', invariant);

  /* WHERE WORK IS reads his districts. */
  const jd = A.JOB_DISTRICTS;
  ok('his job districts are exported so there is only ever one copy of the list ('
     + Object.keys(jd || {}).join(', ') + ')', !!jd && Object.keys(jd).length > 0);
  let siteOk = true, scavOk = true;
  for (const d of Object.keys(jd))
    if (W.kindAt({ at: () => ({ district: d }) }, 0, 0) !== 'site') siteOk = false;
  for (const d of ['residential', 'suburb', 'ruin', 'desert'])
    if (W.kindAt({ at: () => ({ district: d }) }, 0, 0) !== 'scav') scavOk = false;
  ok('standing on a district he calls a job site offers SITE work', siteOk);
  ok('and standing anywhere else offers a SCAV sweep, which is what a person with'
     + ' no crew does', scavOk);
  ok('and off the map it offers nothing rather than guessing',
     W.kindAt({ at: () => null }, 0, 0) === null);
}

/* ---- 3. a shift refuses rather than truncating ------------------------- */
{
  const world = { at: () => ({ district: 'solar' }) };
  const full = W.offer(world, 0, 0, 12345, 24 * 60);
  ok('a shift with the day ahead of it fits (' + (full && full.minutes) + ' min)',
     !!full && full.fits === true);
  const late = W.offer(world, 0, 0, 12345, 30);
  ok('*** AND A SHIFT THAT DOES NOT FIT IS REFUSED, NOT TRUNCATED *** -- half a'
     + ' day\'s work for a full day\'s pay is a number nobody ruled',
     !!late && late.fits === false && late.minutes === full.minutes);
}

/* ---- 4. what a day of it does to the valley ---------------------------- */
{
  const crew = () => Array.from({ length: 40 }, () => ({ job: { kind: 'scav' } }));
  const L = () => E.makeLedger(999, 40, 40);
  const base = E.advanceDay(L(), crew()).produced;
  const withScav = E.advanceDay(L(), crew().concat([W.asAgent('scav')])).produced;
  const withSite = E.advanceDay(L(), crew().concat([W.asAgent('site')])).produced;
  const d = (a, b, g) => Math.round(((b[g] || 0) - (a[g] || 0)) * 1000) / 1000;
  ok('*** A DAY HE WORKED IS ONE MORE PAIR OF HANDS IN THE VALLEY\'S OWN COUNT ***'
     + ' -- scav adds salvage ' + d(base, withScav, 'salvage')
     + ', site adds ' + d(base, withSite, 'salvage'),
     d(base, withScav, 'salvage') > 0 && d(base, withSite, 'salvage') > 0);
  ok('and an organised site is worth more than a lone sweep, which is the economy\'s'
     + ' own ruling and not one made here',
     d(base, withSite, 'salvage') > d(base, withScav, 'salvage'));
  ok('and the module computes no yield of its own -- it hands over an agent',
     JSON.stringify(W.asAgent('site')) === JSON.stringify({ job: { kind: 'site' } }));
  ok('and it refuses to make an agent for work that does not exist',
     W.asAgent('astronaut') === null);
}

/* ---- 5. the pay comes out of his own ruled row ------------------------- */
{
  const purse = P.create();
  const r = P.payForWork(purse, 'site', 1, 'solar');
  ok('a day\'s work pays what PAYOUT says it pays (' + JSON.stringify(r.paid) + ')',
     r.applied === true && JSON.stringify(r.paid) === JSON.stringify(
       (function () { const o = {}; for (const c of ['resources', 'electricity', 'clout'])
         if (P.PAYOUT.COMPLETE[c]) o[c] = P.PAYOUT.COMPLETE[c]; return o; })()));
  ok('*** and the ledger says WORK, not quest -- the ledger is the record of what'
     + ' you DID and audit() refuses an anonymous movement ***',
     purse.entries.length > 0 && /^work:site$/.test(purse.entries[0].reason));
  ok('and the purse still audits clean afterwards', P.audit(purse).ok === true);
  ok('and no amount is passed in from the caller, so nothing can smuggle a number'
     + ' past his ONE', !/payForWork\s*\([^)]*amount/.test(
       fs.readFileSync(path.join(ROOT, 'engine/bohemia_purse.js'), 'utf8')));
}

/* ---- 6. on the surface he walks --------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 300);

  const r = await pg.evaluate(async () => {
    const R = { module: typeof BohemiaWork };
    /* how much of this valley offers each kind, on the real map */
    const n = om.n; let site = 0, tot = 0;
    for (let y = 0; y < n; y += 2) for (let x = 0; x < n; x += 2) {
      const k = BohemiaWork.kindAt(om, x, y); if (!k) continue;
      tot++; if (k === 'site') site++;
    }
    R.siteCells = site; R.scanned = tot;

    R.btnShown = document.getElementById('workbtn').style.display;
    R.btnText = document.getElementById('workbtn').textContent;
    R.offer = workOffer();
    const bal0 = purseBalances().electricity, c0 = DAY.min;
    document.getElementById('workbtn').click();
    await new Promise(s => setTimeout(s, 200));
    R.work = WORK_TODAY;
    R.spent = DAY.min - c0;
    R.earned = purseBalances().electricity - bal0;
    R.btnAfter = document.getElementById('workbtn').style.display;
    R.offerAfter = workOffer();

    /* the card he already reads has to say it */
    advance(20 * 60);
    await new Promise(s => setTimeout(s, 200));
    R.card = (document.getElementById('daycardIn') || {}).textContent || '';

    /* a late start is refused on the surface too */
    WORK_TODAY = null; DAY.min = DAY.NIGHT_MIN - 30;
    R.lateOffer = workOffer(); workBtnSync();
    R.lateBtn = document.getElementById('workbtn').style.display;
    const balL = purseBalances().electricity;
    R.lateDid = doWork();
    R.lateSame = purseBalances().electricity === balL;
    return R;
  });
  await b.close();

  ok('the work module reaches the surface he walks', r.module === 'object');
  ok('*** THE BUTTON IS THERE WHERE HE IS STANDING *** -- "' + r.btnText + '"',
     r.btnShown === 'block' && /\d+H/.test(r.btnText));
  ok('the valley really offers both kinds (' + r.siteCells + ' of ' + r.scanned
     + ' sampled cells are job sites, the rest are a sweep)',
     r.siteCells > 0 && r.siteCells < r.scanned);
  ok('*** AND THE HOURS IT COSTS ARE THE VALLEY\'S OWN *** -- the clock moved '
     + r.spent + ' minutes, which is the shift exactly',
     !!r.offer && r.spent === r.offer.minutes);
  ok('*** AND IT PAID *** -- ' + r.earned + ' battery for a day of '
     + (r.work && r.work.kind), r.earned === 1 && !!(r.work && r.work.paid));
  ok('ONE SHIFT A DAY, because the shift IS the working day',
     r.btnAfter === 'none' && r.offerAfter === null);
  ok('*** AND THE CARD HE ALREADY READS SAYS SO ***',
     /you (put in a \d+ hour shift|scavenged for \d+ hours)/.test(r.card));
  ok('and it says what the day\'s work paid, in batteries',
     /a day.s work paid: .*batter/i.test(r.card));
  ok('and a scav sweep is not described as happening AT the district, because a'
     + ' sweep is not a job somebody gave you',
     !/scavenged for \d+ hours at the/.test(r.card));
  ok('a shift that will not fit before nightfall is refused on the surface too, and'
     + ' the purse does not move',
     !!r.lateOffer && r.lateOffer.fits === false && r.lateBtn === 'none'
     && r.lateDid === null && r.lateSame === true);
  ok('no page error across the working day' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  /* ---- 7. and in the demo, which is one day long on purpose ------------ */
  /* A ROW IS NOT SHIPPED UNTIL IT IS IN THE WALKED SURFACE **AND** THE DEMO. The
     demo reaches the city through a same-origin iframe, so it needs a real server
     and has to be entered through the splash. CT_DEMO_DAYS is 1 and day 2 goes to
     showEnding(), so its ONE day is the whole test -- learned the expensive way on
     THE-VALLEY-RUNS-OUT, where twelve nights of "nothing happened" turned out to be
     eleven reads of a designed ending. */
  const demo = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');
  if (!fs.existsSync(demo)) { ok('the demo has been cut', false); return done(); }
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
                  '.png': 'image/png', '.css': 'text/css',
                  '.webmanifest': 'application/manifest+json' };
  const srv = require('http').createServer((rq, rs) => {
    const p = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]));
    fs.readFile(p, (e, d) => {
      if (e) { rs.statusCode = 404; return rs.end('no'); }
      rs.setHeader('content-type', TYPES[path.extname(p)] || 'application/octet-stream');
      rs.end(d);
    });
  });
  await new Promise(res => srv.listen(0, res));
  const port = srv.address().port;
  const b2 = await chromium.launch();
  const p2 = await b2.newPage({ viewport: { width: 390, height: 844 } });
  const errs2 = []; p2.on('pageerror', e => errs2.push(e.message));
  await p2.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_DEMO.html',
                { waitUntil: 'load', timeout: 180000 });
  await SETTLE(p2, 1500);
  await p2.click('#front', { force: true }).catch(() => {});
  await SETTLE(p2, 2500);
  let fr = null;
  for (let i = 0; i < 200; i++) {
    fr = p2.frames().find(f => /CITY_WORLD/.test(f.url()));
    if (fr && await fr.$('#daycardIn .dcgo').catch(() => null)) break;
    await SETTLE(p2, 250);
  }
  let d = { frame: false };
  if (fr) {
    await fr.$eval('#daycardIn .dcgo', el => el.click());
    await SETTLE(p2, 400);
    d = await fr.evaluate(async () => {
      const D = { frame: true, isDemo: CT_IS_DEMO, demoDays: CT_DEMO_DAYS };
      D.btn = document.getElementById('workbtn').style.display;
      D.text = document.getElementById('workbtn').textContent;
      const bal0 = purseBalances().electricity, c0 = DAY.min;
      document.getElementById('workbtn').click();
      await new Promise(s => setTimeout(s, 200));
      D.spent = DAY.min - c0;
      D.earned = purseBalances().electricity - bal0;
      D.work = WORK_TODAY;
      return D;
    });
  }
  await b2.close(); srv.close();

  ok('the demo opens the city through its splash', d.frame === true);
  ok('and it is the demo, one day long (CT_DEMO_DAYS=' + d.demoDays + ')',
     d.isDemo === true && d.demoDays === 1);
  ok('*** AND THE PLAYER CAN WORK IN THE DEMO *** -- "' + d.text + '", '
     + d.spent + ' minutes, ' + d.earned + ' battery',
     d.btn === 'block' && d.spent > 0 && d.earned === 1 && !!(d.work && d.work.paid));
  ok('no page error in the demo' + (errs2.length ? ' -- ' + errs2[0] : ''),
     errs2.length === 0);
  done();
})();
