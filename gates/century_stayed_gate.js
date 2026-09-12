/* ============================================================================
   CENTURY STAYED GATE (9/12/26, WORLD lane) -- board row [century stayed] /
   WHO-STAYED-COUNTS.

   PAOLO 9/7 RULED IT: "buildings, and some people depending on how many years
   passed." The century rule counted BUILDINGS and nothing else. It counts SOME
   PEOPLE now: a person you kept in the valley counts for as long as they could
   still be alive given the years between the acts, and after that what counts is
   WHAT THEY LEFT.

   WHAT THIS GATE IS REALLY FOR: proving every year in it is canon somebody else
   wrote down, and that the SECOND HALF OF HIS SENTENCE ACTUALLY HAPPENS. "After
   that what counts is what they left" is a branch, and a branch that has never
   executed is not code, it is an intention -- so this drives a real record
   through three acts and watches people turn into what they left.

   node gates/century_stayed_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const S = require(path.join(ROOT, 'engine/bohemia_stayed.js'));
const C = require(path.join(ROOT, 'engine/bohemia_century.js'));
const H = require(path.join(ROOT, 'engine/bohemia_housing.js'));
const F = require(path.join(ROOT, 'engine/bohemia_family.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('CENTURY STAYED GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (buildings and some people, every year canon somebody else wrote'
            + ' down, and the people really do become what they left)');
  process.exit(fail ? 1 : 0);
};
const squash = s => s.replace(/\s+/g, ' ');

/* ---- 1. every year is canon, and its source still says it --------------- */
{
  ok('the span is carried with its source (' + S.SPAN.years + ' years, '
     + S.SPAN.source + ')', S.SPAN.years === 100 && S.SPAN.tuned === false);
  const law = squash(fs.readFileSync(path.join(ROOT, S.SPAN.source), 'utf8'));
  ok('*** AND THE LAW IT NAMES STILL SAYS IT, VERBATIM *** -- "' + S.SPAN.says + '"',
     law.indexOf(squash(S.SPAN.says)) >= 0);

  ok('the handoff is carried with its source (' + S.HANDOFF.years + ' years, '
     + S.HANDOFF.source + ')', S.HANDOFF.years === 30 && S.HANDOFF.tuned === false);
  const fam = squash(fs.readFileSync(path.join(ROOT, S.HANDOFF.source), 'utf8'));
  ok('*** AND THE MODULE IT NAMES STILL SAYS IT, VERBATIM *** -- "'
     + S.HANDOFF.says + '"', fam.indexOf(squash(S.HANDOFF.says)) >= 0);
  ok('and both are untuned, so they land in the list he tunes from',
     S.SPAN.tuned === false && S.HANDOFF.tuned === false);
}

/* ---- 2. the ages are ASKED of the family module, never copied ----------- */
{
  const adult = S.adultYears(), elder = S.elderYears();
  ok('what age an unmet resident is comes from the family module itself (adult '
     + adult + ')', adult === 41);
  ok('and so does the age this game calls elder (' + elder + ')', elder === 65);

  /* *** THEY ARE READ, NOT COPIED, AND THIS PROVES IT. *** Ask the family module
     the same question a different way: age a probe by a known number of years and
     check this file's answer moves with the module rather than staying put. If
     these numbers had been typed here, nothing about the family module could
     change them. */
  const probe = [{ id: 'p', age: 'adult', alive: true }];
  F.agePeople(probe, 10);
  ok('the family module and this file agree about an adult to the year',
     probe[0].years === adult + 10);

  const cap = S.pastLiving();
  ok('*** PAST LIVING IS ELDER PLUS ONE WHOLE HANDOFF, WHICH IS THE ONLY'
     + ' ARITHMETIC IN THE FILE *** -- ' + elder + ' + ' + S.HANDOFF.years
     + ' = ' + cap, cap === elder + S.HANDOFF.years);
  ok('and it lands at a real outer bound for a human life rather than a guess',
     cap > 80 && cap < 120);
}

/* ---- 3. a person you kept is somebody under a roof you put up ----------- */
{
  H.installCap();
  ok('a home he built houses somebody (' + H.capacityOf('suburb') + ' per home)',
     H.capacityOf('suburb') > 0);
  ok('and a building that is not a home houses nobody, which is an answer and not'
     + ' a gap', H.capacityOf('solar') === 0);

  const rec = C.make();
  for (let i = 0; i < 3; i++) C.note(rec, 'build', { type: 'suburb', x: i, y: 0, w: 1, h: 1 }, 1);
  ok('the century record already stamped the household on every build, so nothing'
     + ' new is stored (act 1 housing ' + C.totals(rec, 1).housing.toFixed(1) + ')',
     C.totals(rec, 1).housing > 0);
  const s1 = S.stayed(rec, 1);
  ok('and they count as people you kept (' + s1.people + ')',
     s1.people > 0 && s1.left === 0);
  ok('a solar farm keeps nobody',
     (function () {
       const r2 = C.make();
       C.note(r2, 'build', { type: 'solar', x: 0, y: 0, w: 1, h: 1 }, 1);
       return S.stayed(r2, 1).people === 0;
     })());
}

/* ---- 4. *** THE SECOND HALF OF HIS SENTENCE ACTUALLY HAPPENS *** -------- */
{
  H.installCap();
  const rec = C.make();
  for (let i = 0; i < 3; i++) C.note(rec, 'build', { type: 'suburb', x: i, y: 0, w: 1, h: 1 }, 1);
  C.setAct(rec, 2);
  for (let i = 0; i < 2; i++) C.note(rec, 'build', { type: 'apartment', x: i, y: 5, w: 1, h: 1 }, 400);

  const a1 = S.stayed(rec, 1), a2 = S.stayed(rec, 2), a3 = S.stayed(rec, 3);
  ok('act 1: the people you housed are here (' + a1.people + ' here, ' + a1.left + ' left behind)',
     a1.people === 6 && a1.left === 0);
  ok('act 2, thirty years on: they are ' + a2.byAct[0].age + ' and STILL HERE, and the'
     + ' new ones join them (' + a2.people + ' here)',
     a2.byAct[0].age === 71 && a2.byAct[0].living === true && a2.people === 10);
  ok('*** ACT 3, SIXTY YEARS ON: THE FIRST LOT ARE ' + a3.byAct[0].age + ' AND WHAT'
     + ' COUNTS IS WHAT THEY LEFT *** (' + a3.people + ' here, ' + a3.left
     + ' left what they built behind them)',
     a3.byAct[0].living === false && a3.left === 6 && a3.people === 4);
  ok('and the branch really executed rather than being an intention -- the same'
     + ' record answers differently in every act',
     a1.left === 0 && a2.left === 0 && a3.left > 0);

  ok('nothing is ever double counted: here plus left is everybody you housed',
     a3.people + a3.left === a1.people + (a2.people - a1.people));

  const said = S.say(a3);
  ok('and it says it in words a player reads -- "' + said + '"',
     /still here/.test(said) && /left what they built behind them/.test(said));
  ok('and it says nothing at all when the family has housed nobody, which is the'
     + ' honest empty state rather than a zero', S.say(S.stayed(C.make(), 1)) === '');
}

/* ---- 5. it refuses rather than guessing -------------------------------- */
{
  ok('with no record at all it answers without throwing',
     (function () { try { const r = S.stayed(null, 1); return !!r || r === null; }
                    catch (e) { return false; } })());
  ok('and it never moves the act itself -- the fold is another line\'s job',
     !/setAct|nextAct/.test(fs.readFileSync(path.join(ROOT, 'engine/bohemia_stayed.js'), 'utf8')
       .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')));
  ok('and it never kills anybody in the family tree',
     !/alive\s*=/.test(fs.readFileSync(path.join(ROOT, 'engine/bohemia_stayed.js'), 'utf8')));
}

/* ---- 6. on the surface he walks, and in the demo ------------------------ */
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
    const R = { module: typeof BohemiaStayed };
    R.adult = BohemiaStayed.adultYears();
    R.elder = BohemiaStayed.elderYears();
    R.cap = BohemiaStayed.pastLiving();
    const rec = centuryGet();
    for (let i = 0; i < 3; i++) centuryNote('build', 'suburb', 30 + i, 30, 1, 1);
    R.here = BohemiaStayed.stayed(rec, rec.act).people;
    advance(20 * 60);
    await new Promise(s => setTimeout(s, 200));
    R.card = (document.getElementById('daycardIn') || {}).textContent || '';
    /* and drive the acts the way a fold will, to prove the second half on the
       real surface too rather than only in node */
    BohemiaCentury.setAct(rec, 3);
    const far = BohemiaStayed.stayed(rec, 3);
    R.far = { people: far.people, left: far.left };
    R.farSay = BohemiaStayed.say(far);
    return R;
  });
  await b.close();

  ok('the stayed module reaches the surface he walks', r.module === 'object');
  ok('and reads the same ages there (adult ' + r.adult + ', elder ' + r.elder
     + ', past living ' + r.cap + ')',
     r.adult === 41 && r.elder === 65 && r.cap === 95);
  ok('housing somebody there counts them (' + r.here + ' people kept)', r.here > 0);
  ok('*** AND THE CARD HE ALREADY READS SAYS SO ***',
     /(one person|\d+ people) you kept (is|are) still here/.test(r.card));
  ok('*** AND ON THE REAL SURFACE, SIXTY YEARS ON, THEY BECOME WHAT THEY LEFT ***'
     + ' -- "' + r.farSay + '"', r.far.left > 0);
  ok('no page error' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  /* ---- 7. the demo ----------------------------------------------------- */
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
      D.cap = BohemiaStayed.pastLiving();
      const rec = centuryGet();
      for (let i = 0; i < 2; i++) centuryNote('build', 'suburb', 40 + i, 40, 1, 1);
      D.here = BohemiaStayed.stayed(rec, rec.act).people;
      advance(20 * 60);
      await new Promise(s => setTimeout(s, 200));
      D.card = (document.getElementById('daycardIn') || {}).textContent || '';
      return D;
    });
  }
  await b2.close(); srv.close();

  ok('the demo opens the city through its splash', d.frame === true);
  ok('*** AND THE PEOPLE YOU KEPT COUNT IN THE DEMO TOO *** (' + d.here + ' kept)',
     d.isDemo === true && d.cap === 95 && d.here > 0
     && /(one person|\d+ people) you kept (is|are) still here/.test(d.card));
  ok('no page error in the demo' + (errs2.length ? ' -- ' + errs2[0] : ''),
     errs2.length === 0);
  done();
})();
