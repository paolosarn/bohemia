/* ============================================================================
   BATTERIES MINED GATE (9/11/26, WORLD lane) -- board row [batteries mined] /
   BUILDINGS-MAKE-BATTERIES.

   HIS RULING, 9/5, LOCKED: "there could be ways where you auto-mine batteries,
   set up certain buildings wherever you're doing and that's just more batteries."
   And, on what money is for: "do you need batteries to turn a laptop on? no."

   THIS CLOSES A PENDING THE PIPE ITSELF NAMED. bohemia_production.js wired every
   placed building to pay on the wake beat and wrote, in its own header,
   "[PENDING Paolo: which building types produce electricity or clout]" and
   "DELIBERATELY NOT ELECTRICITY ... making every placed building mint electricity
   would turn the build button into a printing press". Both were right. He did not
   rule that EVERY building mints batteries -- he ruled that CERTAIN ones do. So
   three do and fifty-six do not, which is the door that module wrote.

   FOUR CLAIMS:
     1. exactly the electrical districts his map already has mint batteries, and
        the build button is not a printing press
     2. the install ORDER is load-bearing and proved both ways
     3. a day away pays a day, not ten -- the cap, measured
     4. BATTERIES ARE MONEY ONLY: broke, you can still do everything but buy

   node gates/batteries_mined_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const OVERMAP_SRC = fs.readFileSync(path.join(ROOT, 'engine/bohemia_overmap.js'), 'utf8');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('BATTERIES MINED GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (certain buildings make batteries, the build button is not a'
            + ' printing press, and a day away pays a day)');
  process.exit(fail ? 1 : 0);
};

/* every case gets its own module registry, because install() mutates a shared
   table and a test that inherits another test's table is not a test. */
function fresh() {
  for (const k of Object.keys(require.cache)) delete require.cache[k];
  return { P: require(path.join(ROOT, 'engine/bohemia_purse.js')),
           PB: require(path.join(ROOT, 'engine/bohemia_powerbuild.js')),
           PR: require(path.join(ROOT, 'engine/bohemia_production.js')),
           OM: require(path.join(ROOT, 'engine/bohemia_overmap.js')),
           CE: require(path.join(ROOT, 'engine/bohemia_cityedit.js')) };
}

/* ---- 1. the module owns no number and no invented district -------------- */
{
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_powerbuild.js'), 'utf8');
  /* A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). */
  const logic = src.replace(/\/\*[\s\S]*?\*\//g, '')
                   .replace(/\/\/[^\n]*/g, '')
                   .replace(/'(?:\\.|[^'\\])*'/g, "''");
  const nums = (logic.match(/\b\d+(\.\d+)?\b/g) || []);
  ok('NO YIELD, COUNT OR RATE IS TYPED INTO THE MODULE (numerals in its logic: '
     + (nums.join(' ') || 'none') + ')', nums.every(n => n === '0' || n === '1'));

  const m = fresh();
  /* *** THE THREE ARE HIS MAP'S, AND THE REASONS ARE QUOTED FROM IT VERBATIM. ***
     A quotation that is not verbatim is the same defect as a number that is not
     measured, so each row's `why` has to still be findable in the overmap. */
  const rows = Object.keys(m.PB.POWER).sort();
  ok('the power buildings are named (' + rows.join(', ') + ')', rows.length === 3);
  const quoted = rows.filter(k => OVERMAP_SRC.indexOf(m.PB.POWER[k].why) >= 0);
  ok('*** AND EVERY ONE QUOTES THE MAP\'S OWN LINE FOR ITSELF, VERBATIM *** ('
     + quoted.length + '/' + rows.length + ' still found in the overmap)',
     quoted.length === rows.length);
  ok('the chain is make it, hold it, move it',
     rows.map(k => m.PB.POWER[k].makes).sort().join(',') === 'distributes,generates,stores');

  /* MAP LAW: no district is invented here. */
  const buildable = m.CE.buildableTypes(m.OM.DISTRICT) || [];
  ok('every power building is a district the BUILD button can really place',
     rows.every(k => buildable.indexOf(k) >= 0));
  ok('*** AND HIS TWO EXAMPLES THAT HAVE NO DISTRICT ARE NAMED, NOT INVENTED ***'
     + ' -- he said "a generator, a solar rack, a wind rig" and the enum has no '
     + m.PB.NO_DISTRICT_YET.join(' and no '),
     m.PB.NO_DISTRICT_YET.length === 2
     && m.PB.NO_DISTRICT_YET.every(n => buildable.indexOf(n) < 0));
  ok('and kinds() reads the buildable list rather than returning its own table',
     m.PB.kinds(m.OM.DISTRICT).join(',') === rows.join(','));
  ok('and kinds() is empty when nothing is buildable, rather than guessing',
     m.PB.kinds(null).length === 0 || m.PB.kinds({}).length === 0);
}

/* ---- 2. certain buildings, not every building --------------------------- */
{
  const m = fresh();
  m.PB.install(m.OM.DISTRICT);
  const inst = m.PR.install(m.OM.DISTRICT);
  const T = m.P.PRODUCTION;
  const elec = Object.keys(T).filter(k => T[k].electricity).sort();
  const res = Object.keys(T).filter(k => T[k].resources);
  ok('*** EXACTLY THE POWER BUILDINGS MINT BATTERIES *** (' + elec.join(', ') + ')',
     elec.join(',') === Object.keys(m.PB.POWER).sort().join(','));
  ok('*** AND THE BUILD BUTTON IS NOT A PRINTING PRESS *** -- ' + res.length
     + ' of ' + (res.length + elec.length) + ' buildable types still pay resources,'
     + ' which is the worry bohemia_production.js wrote down and this keeps',
     res.length > elec.length * 10);
  ok('production kept every row this ruling had already written (' + inst.kept + ')',
     inst.kept === elec.length);
  ok('a power row carries his ruling, is untuned, and is a draft',
     T.solar.ruling.indexOf('9/5') === 0 && T.solar.tuned === false && T.solar.draft === true);
  ok('and the amount is his ONE', T.solar.electricity === 1);
  ok('and it cannot be passed in from a caller, so no unruled number can get in',
     !/function install\s*\([^)]*amount/.test(
       fs.readFileSync(path.join(ROOT, 'engine/bohemia_powerbuild.js'), 'utf8')));
}

/* ---- 3. the order is load-bearing, proved both ways --------------------- */
{
  const right = fresh();
  right.PB.install(right.OM.DISTRICT); right.PR.install(right.OM.DISTRICT);
  ok('installed BEFORE production, a solar plot mints a battery',
     right.P.PRODUCTION.solar.electricity === 1 && !right.P.PRODUCTION.solar.resources);

  const wrong = fresh();
  wrong.PR.install(wrong.OM.DISTRICT);
  const late = wrong.PB.install(wrong.OM.DISTRICT);
  ok('*** AND INSTALLED AFTER IT, IT DOES NOTHING AT ALL *** -- ' + late.installed
     + ' installed, ' + late.kept + ' already taken, and solar is back on resources.'
     + ' A no-op that looks exactly like a working feature, which is why the'
     + ' caller\'s order is written down beside the call',
     late.installed === 0 && late.kept === 3
     && wrong.P.PRODUCTION.solar.resources === 1 && !wrong.P.PRODUCTION.solar.electricity);

  /* AND THE WALKED SURFACE REALLY CALLS THEM IN THAT ORDER. */
  const city = fs.readFileSync(CITY, 'utf8');
  const a = city.indexOf('BohemiaPowerBuild.install(OM.DISTRICT)');
  const b = city.indexOf('BohemiaProduction.install(OM.DISTRICT)');
  ok('and the surface he walks calls them in that order', a > 0 && b > 0 && a < b);
}

/* ---- 4. it really pays, and a day away pays a day ----------------------- */
{
  const m = fresh();
  m.PB.install(m.OM.DISTRICT); m.PR.install(m.OM.DISTRICT);
  const purse = m.P.create();
  const edits = { cells: { '10,10': 'solar', '11,11': 'battery', '12,12': 'suburb' } };
  ok('the builder\'s own delta is what counts as a building (' +
     m.PR.placed(edits).length + ' placed, ' + m.PB.mine(edits).length + ' of them power)',
     m.PR.placed(edits).length === 3 && m.PB.mine(edits).length === 2);

  const t = m.PR.tick(purse, edits, 1);
  ok('*** A POWER BUILDING YOU PUT DOWN MAKES YOU A BATTERY *** -- ' +
     JSON.stringify(t.made), t.applied === true && t.made.electricity === 2);
  ok('and the building that is not a power building still pays what it always paid',
     t.made.resources === 1);

  ok('the same day twice pays once', (m.PR.tick(purse, edits, 1) || {}).reason === 'ALREADY_PRODUCED');

  /* *** THE CAP THE 9/6 AMENDMENT ASKS FOR, AND IT IS ALREADY THE ARCHITECTURE. ***
     "cap what a building earns while the player is away, so coming back is worth
     something instead of collecting a timer." MEASURED: the tick is keyed on the
     day and this game owns no wall clock at all (NO BACKGROUND TICKING). Ten
     in-game days pass and exactly one day is paid. Nothing here caps anything
     because there is nothing to cap; this holds it so it cannot regress. */
  const before = m.P.balances(purse).electricity;
  m.PR.tick(purse, edits, 11);
  const after = m.P.balances(purse).electricity;
  ok('*** AND TEN DAYS AWAY PAYS ONE DAY, NOT TEN *** -- ' + before + ' to ' + after
     + ', which is the cap the amendment asks for, already held by NO BACKGROUND'
     + ' TICKING rather than by a number', after - before === 2);
  ok('nothing appeared that nobody earned: the purse still audits clean',
     m.P.audit(purse).ok === true);
  ok('and every battery it made says where it came from',
     purse.entries.filter(e => e.currency === 'electricity')
                  .every(e => /^produce:/.test(e.reason)));
}

/* ---- 5. on the surface he walks, and in the demo ------------------------ */
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
    const R = { module: typeof BohemiaPowerBuild };
    const T = BohemiaPurse.PRODUCTION;
    R.elec = Object.keys(T).filter(k => T[k].electricity).sort();
    R.res = Object.keys(T).filter(k => T[k].resources).length;

    if (!EDITS.cells) EDITS.cells = {};
    EDITS.cells['20,20'] = 'solar'; EDITS.cells['21,21'] = 'suburb';
    R.mine = BohemiaPowerBuild.mine(EDITS).map(x => x.type);

    const p = purseGet();
    const b0 = BohemiaPurse.balances(p).electricity;
    PROD_TODAY = BohemiaProduction.tick(p, EDITS, DAY.day + 1);
    R.gained = BohemiaPurse.balances(p).electricity - b0;
    R.line = prodLine();

    /* THE CAP, ON THE REAL SURFACE */
    const b1 = BohemiaPurse.balances(p).electricity;
    BohemiaProduction.tick(p, EDITS, DAY.day + 11);
    R.tenDays = BohemiaPurse.balances(p).electricity - b1;

    /* *** BATTERIES ARE MONEY ONLY. *** His clause: "do you need batteries to
       turn a laptop on? no." Being broke must never stop you DOING something --
       only from buying. Empty the purse and check a day's work still works and
       the day still ends. */
    const drained = BohemiaPurse.create();
    PURSEV = drained;
    R.broke = BohemiaPurse.balances(purseGet()).electricity;
    WORK_TODAY = null;
    R.offer = !!workOffer();
    const did = doWork();
    R.workedWhileBroke = !!(did && did.paid);
    R.earnedFromWork = BohemiaPurse.balances(purseGet()).electricity;
    advance(20 * 60);
    R.dayEnded = DAY.phase;
    return R;
  });
  await b.close();

  ok('the power buildings module reaches the surface he walks', r.module === 'object');
  ok('and exactly the power buildings mint there too (' + r.elec.join(', ')
     + ' against ' + r.res + ' on resources)',
     r.elec.join(',') === 'battery,solar,substation' && r.res > 50);
  ok('a solar plot he put down counts as one of his (' + r.mine.join(', ') + ')',
     r.mine.join(',') === 'solar');
  ok('*** AND IT MAKES HIM A BATTERY ON THE SURFACE HE WALKS *** (+' + r.gained + ')',
     r.gained === 1);
  ok('*** AND THE CARD HE ALREADY READS SAYS SO *** -- "' + r.line + '"',
     /made you .*batter/i.test(r.line));
  ok('and ten days away still pays one day on the real surface (+' + r.tenDays + ')',
     r.tenDays === 1);

  /* HIS CLAUSE */
  ok('*** BATTERIES ARE MONEY ONLY: WITH AN EMPTY PURSE HE CAN STILL WORK *** --'
     + ' being broke stops you buying, never doing',
     r.broke === 0 && r.offer === true && r.workedWhileBroke === true
     && r.earnedFromWork === 1);
  ok('and a day with no batteries in it still ends normally rather than jamming',
     r.dayEnded === 'ended');
  ok('no page error across the day' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  /* ---- 6. and in the demo ---------------------------------------------- */
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
      const D = { frame: true, isDemo: CT_IS_DEMO };
      const T = BohemiaPurse.PRODUCTION;
      D.elec = Object.keys(T).filter(k => T[k].electricity).sort();
      if (!EDITS.cells) EDITS.cells = {};
      EDITS.cells['30,30'] = 'solar';
      const p = purseGet(), b0 = BohemiaPurse.balances(p).electricity;
      PROD_TODAY = BohemiaProduction.tick(p, EDITS, DAY.day + 1);
      D.gained = BohemiaPurse.balances(p).electricity - b0;
      D.line = prodLine();
      return D;
    });
  }
  await b2.close(); srv.close();

  ok('the demo opens the city through its splash', d.frame === true);
  ok('*** AND A BUILDING MAKES A BATTERY IN THE DEMO TOO *** (+' + d.gained
     + ', "' + d.line + '")',
     d.isDemo === true && d.elec.join(',') === 'battery,solar,substation'
     && d.gained === 1 && /made you .*batter/i.test(d.line));
  ok('no page error in the demo' + (errs2.length ? ' -- ' + errs2[0] : ''),
     errs2.length === 0);
  done();
})();
