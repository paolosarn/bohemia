/* ============================================================================
   WATER LIFTED GATE (9/13/26, WORLD lane) -- board row [water lifted] /
   THE-PUMPS-ARE-THE-CITY.

   THE ROW, harvested from ECONOMY round 7: "The valley floor is about 2,028 feet
   and Lake Mead hit 1,040.5, so everything Vegas drinks is lifted a thousand feet
   by 22 vertical pumps and two booster stations. WATER IS NOT SCARCE; PUMPING IS.
   Wire it: a pump station costs power, water costs pumping, thirst costs water, and
   whoever holds the pumps holds the valley."

   *** MEASURED FIRST, AND IT WAS WORSE THAN THE ROW SAYS. *** The valley drinks 4 L
   a head a day and NOTHING IN THIS GAME HAD EVER PRODUCED A SINGLE LITRE: advanceDay's
   `produced` comes only from YIELD, which is salvage and food. Water was the only good
   with a need and no way to make it -- a one-way countdown with no source.

   THE ENERGY IS PHYSICS, NOT A DIAL: lift 987.5 ft = 301.0 m, one litre is one
   kilogram, E = mgh = 2,952 J = 0.00082 kWh, over 0.75 wire-to-water efficiency =
   0.0011 kWh per litre. Every number is the row's own real measurement or arithmetic
   on it, which is why none of it is his to rule.

   node gates/water_lifted_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const PU = require(path.join(ROOT, 'engine/bohemia_pumps.js'));
const ECO = require(path.join(ROOT, 'engine/bohemia_economy.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const near = (a, b, eps) => Math.abs(a - b) <= (eps || 1e-6);
const done = () => {
  console.log('WATER LIFTED GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (the pumps lift what the valley drinks, they only run on a live'
            + ' circuit, and whoever holds that circuit holds the water)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. *** THE ENERGY IS PHYSICS, AND IT CHECKS OUT BY HAND *** -------- */
{
  ok('the lift is the row\'s own two measurements (' + PU.liftFeet().toFixed(1) + ' ft)',
     near(PU.liftFeet(), 2028 - 1040.5, 1e-9));
  ok('in metres that is ' + PU.liftMetres().toFixed(1), near(PU.liftMetres(), 301.0, 0.1));
  /* E = m*g*h for one kilogram, which is what one litre of water weighs by the
     definition of the litre. Recomputed here from first principles rather than
     copied off the module, so this is a CHECK and not an echo. */
  const joules = 1 * 9.81 * (987.5 / 3.28084);
  const perfect = joules / 3600000;
  ok('one litre lifted is ' + Math.round(joules) + ' J at perfect efficiency',
     near(joules, 2952, 2));
  ok('*** AND AT REAL PUMP EFFICIENCY IT IS ' + PU.kwhPerLitre().toFixed(6)
     + ' kWh PER LITRE ***', near(PU.kwhPerLitre(), perfect / 0.75, 1e-9));
  ok('the efficiency is stated, not hidden', PU.EFFICIENCY === 0.75);
  ok('a thousand litres costs a kilowatt-hour and change',
     near(PU.kwhFor(1000), PU.kwhPerLitre() * 1000, 1e-9));
  ok('nothing is lifted for free', PU.kwhFor(0) === 0 && PU.kwhPerLitre() > 0);
}

/* ---- 2. WHAT THE VALLEY DRINKS IS ASKED, NEVER TYPED -------------------- */
{
  ok('the economy still says a person drinks ' + ECO.GOODS.water.need + ' L a day',
     ECO.GOODS.water.need > 0);
  ok('and the module reads that rather than spelling it',
     PU.needPerDay(40) === ECO.GOODS.water.need * 40);
  ok('nobody in the valley means nobody drinking', PU.needPerDay(0) === 0);
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_pumps.js'), 'utf8');
  const code = src.replace(/^[\s\S]*?\(function \(root\)/, '')
                  .replace(/\/\*[\s\S]*?\*\//g, '')
                  .replace(/^\s*\/\/.*$/gm, '')
                  .replace(/'(?:[^'\\]|\\.)*'/g, "''");
  /* THE ONLY NUMBERS ALLOWED IN THE CODE ARE THE PHYSICS AND THE ROW'S OWN
     MEASUREMENTS. A litres-per-station rating or a balance multiplier would be a
     number nobody ruled, and the module's whole argument is that it needs none. */
  /* The physics, the row's own measurements, and ONE named display precision. The
     first cut of this refused a bare 4 in a toFixed, which is right to refuse: a
     number with no name in a file whose whole argument is that it has no dials looks
     exactly like a dial. It is named KWH_DECIMALS in the module now, and only that
     constant's own value is allowed through here. */
  ok('the rounding precision is named rather than bare', PU.KWH_DECIMALS === 4);
  const REAL = [2028, 1040.5, 3.28084, 9.81, 3600000, 0.75, 0, 1, PU.KWH_DECIMALS];
  const nums = (code.match(/\b\d+(\.\d+)?\b/g) || []).map(Number)
                 .filter(n => REAL.indexOf(n) < 0);
  ok('no number in the code that is not physics or the row\'s own measurement ('
     + nums.join(',') + ')', nums.length === 0);
}

/* ---- 3. *** PUMPING IS THE CONSTRAINT, WHICH IS THE ROW'S THESIS *** ---- */
{
  const lit = [{ district: 'pumpstation', lit: true, faction: 'Mob' }];
  const dark = [{ district: 'pumpstation', lit: false, faction: 'Mob' }];
  const r1 = PU.lift(lit, 40), r2 = PU.lift(dark, 40);
  ok('*** A RUNNING STATION COVERS WHAT THE VALLEY DRINKS *** ('
     + r1.litres + ' L for ' + r1.need + ' needed)',
     r1.litres === r1.need && r1.litres === 160);
  ok('*** AND A DARK ONE COVERS NOTHING ***', r2.litres === 0 && r2.running === 0);
  ok('the lift reports what it really cost in power (' + r1.kwh + ' kWh)',
     near(r1.kwh, +(PU.kwhPerLitre() * 160).toFixed(4), 1e-9) && r1.kwh > 0);
  /* A PUMP STATION IS SIZED TO ITS POPULATION. Two of them do not make the tap run
     harder, and saying they did would be a balance number nobody ruled. */
  const two = PU.lift([lit[0], { district: 'watertreat', lit: true, faction: 'Mob' }], 40);
  ok('two running stations do not make more water than the valley can drink',
     two.litres === r1.litres && two.running === 2);
  ok('a place that is not water infrastructure lifts nothing',
     PU.lift([{ district: 'casino', lit: true }], 40).litres === 0);
  ok('and with no infrastructure at all the answer is honest, not zero-shaped',
     PU.lift([], 40).stations === 0 && /Nothing in this valley lifts/.test(PU.say(PU.lift([], 40))));
}

/* ---- 4. *** WHOEVER HOLDS THE PUMPS HOLDS THE VALLEY *** ---------------- */
{
  const r = PU.lift([{ district: 'pumpstation', lit: true, faction: 'Anarchists' },
                     { district: 'watertreat', lit: true, faction: 'Anarchists' },
                     { district: 'reservoir', lit: false, faction: 'Mob' }], 40);
  ok('*** THE RUNNING PUMPS NAME WHO HOLDS THEM *** (' + r.holders.join(', ') + ')',
     r.holders.length === 1 && r.holders[0] === 'ANARCHISTS');
  ok('one outfit holding two pumps is one name, not two', r.holders.length === 1);
  ok('a dark pump\'s holder is not who holds the water',
     r.holders.indexOf('MOB') < 0);
  ok('and the line says it in plain words: "' + PU.say(r) + '"',
     /ANARCHISTS hold the water/.test(PU.say(r)));
  ok('a dark valley says so instead: "'
     + PU.say(PU.lift([{ district: 'reservoir', lit: false }], 40)) + '"',
     /dark/.test(PU.say(PU.lift([{ district: 'reservoir', lit: false }], 40))));
  ok('NOT ONE NUMBER FROM THE PHYSICS IS SAID AT HIM', !/\d/.test(PU.say(r)));
  ok('the words are an attempt', r.draft === true);
}

/* ---- 5. WHAT IS NOT BUILT IS NAMED ------------------------------------- */
{
  const ph = PU.placeholders();
  ok('the unruled things are enumerable (' + ph.length + ')', ph.length >= 2);
  ok('*** the PLAYER\'s own thirst is a FIFTH VERB and is left to him ***',
     ph.some(p => /day:drank/.test(p.where) && p.value === null));
  ok('and so is what it costs to get a dark station running again',
     ph.some(p => /RELIGHT/.test(p.where) && p.value === null));
  /* THE PHYSICS IS NOT A PLACEHOLDER. A measured fact about Nevada is not waiting
     on a ruling, and listing it as one would hand him a question he cannot answer. */
  ok('the physics is not offered to him as a decision',
     !ph.some(p => /kwhPerLitre|EFFICIENCY|LIFT/i.test(p.where)));
}

/* ---- 6. on the surface he walks, and in the demo ------------------------ */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }

  async function drive(ctx) {
    return ctx.evaluate(async () => {
      const R = { module: typeof BohemiaPumps };
      if (!MKT_LEDGER) { try { mktLedger(); } catch (e) {} }
      R.agents = MKT_LEDGER.agents | 0;
      R.need = BohemiaPumps.needPerDay(R.agents);

      /* WHAT IS REALLY ON THIS MAP, and how the grid answers for it */
      const st = pumpStations();
      R.stations = st.length;
      R.kinds = {}; st.forEach(s => R.kinds[s.district] = (R.kinds[s.district] || 0) + 1);
      R.litCount = st.filter(s => s.lit).length;
      R.holders = BohemiaPumps.holdersOf(st.filter(s => s.lit));

      /* THE CELL A PLANT STANDS ON HAS NO CIRCUIT -- the fact that made the first
         cut of this row dead code. Proved here rather than remembered. */
      R.onOwnCell = st.map(s => { try { const c = POWER.at(s.at[0], s.at[1]); return c ? c.id : null; } catch (e) { return null; } });

      /* TEN DAYS AS THE GAME RUNS THEM */
      const run = [];
      for (let d = 0; d < 10; d++) {
        const before = MKT_LEDGER.stocks.water;
        mktAdvanceDay();
        run.push({ before: Math.round(before), after: Math.round(MKT_LEDGER.stocks.water),
                   lifted: PUMPS_TONIGHT ? PUMPS_TONIGHT.litres : null,
                   running: PUMPS_TONIGHT ? PUMPS_TONIGHT.running : null });
      }
      R.run = run;
      R.powerStock = MKT_LEDGER.stocks.power;

      /* AND THE CARD SAYS IT */
      R.onCard = false; R.cardText = '';
      for (let n = 0; n < 3 && !R.onCard; n++) {
        advance(20 * 60);
        for (let k = 0; k < 8; k++) {
          const t = (document.getElementById('daycardIn') || {}).textContent || '';
          if (/pumps are running|pump station|pump stations are dark|lifts water/i.test(t)) {
            R.onCard = true; R.cardText = t; break;
          }
          const go = document.querySelector('#daycardIn .dcgo')
                  || document.querySelector('#daycardIn .dcx');
          if (!go) break; go.click();
          await new Promise(s => setTimeout(s, 60));
          if (!document.getElementById('daycard').classList.contains('on')) break;
        }
      }

      /* *** NOW PUT THE LIGHTS OUT AND WATCH THE VALLEY STOP DRINKING. *** The same
         douse the night already uses when a circuit goes unpaid. */
      let doused = 0;
      pumpStations().forEach(s => {
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          try {
            const c = POWER.at(s.at[0] + dx, s.at[1] + dy);
            if (c && c.id >= 0 && c.live && POWER.douse(c.id)) doused++;
          } catch (e) {}
        }
      });
      R.doused = doused;
      R.litAfterDouse = pumpStations().filter(s => s.lit).length;
      const w0 = MKT_LEDGER.stocks.water;
      mktAdvanceDay();
      R.afterDark = { before: Math.round(w0), after: Math.round(MKT_LEDGER.stocks.water),
                      lifted: PUMPS_TONIGHT ? PUMPS_TONIGHT.litres : null,
                      say: PUMPS_TONIGHT ? BohemiaPumps.say(PUMPS_TONIGHT) : '' };
      return R;
    });
  }

  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 300);
  const r = await drive(pg);
  await b.close();

  ok('the pumps module reaches the surface he walks', r.module === 'object');
  ok('*** THE VALLEY REALLY HAS WATER INFRASTRUCTURE *** ('
     + JSON.stringify(r.kinds) + ')', r.stations >= 3);
  ok('*** AND NOT ONE OF THOSE CELLS IS ON A CIRCUIT, which is why asking the plant\'s'
     + ' own cell could never have worked *** (' + r.onOwnCell.join(',') + ')',
     r.onOwnCell.every(id => id === -1 || id === null));
  ok('*** BUT THE STREET THEY FRONT IS LIVE FOR ' + r.litCount + ' OF THEM ***',
     r.litCount > 0 && r.litCount < r.stations);
  ok('*** AND THAT NAMES WHO HOLDS THE VALLEY\'S WATER *** (' + r.holders.join(', ') + ')',
     r.holders.length >= 1);
  const first = r.run[0], last = r.run[r.run.length - 1];
  ok('the valley drinks ' + r.need + ' L a day', r.need > 0);
  ok('*** AND THE PUMPS LIFT IT: ten days and the water is still there *** ('
     + first.before + ' -> ' + last.after + ')',
     r.run.every(d => d.lifted === r.need && d.running > 0)
     && Math.abs(last.after - first.before) < 1);
  ok('the ledger\'s power stock is never driven negative (' + r.powerStock + ')',
     r.powerStock >= 0);
  ok('*** HE READS IT ON THE CARD HE ALREADY READS ***', r.onCard === true);
  ok('*** THEN THE CIRCUITS GO OUT AND THE VALLEY STOPS DRINKING *** (doused '
     + r.doused + ', ' + r.litAfterDouse + ' pumps left, water '
     + r.afterDark.before + ' -> ' + r.afterDark.after + ')',
     r.doused > 0 && r.litAfterDouse === 0 && r.afterDark.lifted === 0
     && r.afterDark.after < r.afterDark.before);
  ok('and the card would say so: "' + r.afterDark.say + '"', /dark/.test(r.afterDark.say));
  ok('no page error across eleven days' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  /* the demo */
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
  let d = { module: 'none' };
  if (fr) {
    await fr.$eval('#daycardIn .dcgo', el => el.click());
    await SETTLE(p2, 400);
    d = await drive(fr);
  }
  await b2.close(); srv.close();

  ok('the demo opens the city through its splash', d.module === 'object');
  ok('*** AND THE WHOLE THING RUNS IN THE DEMO TOO: the pumps lift what the valley'
     + ' drinks, somebody holds them, and putting the circuits out stops the water ***',
     d.litCount > 0 && (d.holders || []).length >= 1
     && (d.run || []).every(x => x.lifted === d.need && x.running > 0)
     && d.afterDark && d.afterDark.lifted === 0
     && d.afterDark.after < d.afterDark.before);
  ok('no page error in the demo' + (errs2.length ? ' -- ' + errs2[0] : ''),
     errs2.length === 0);
  done();
})();
