/* ============================================================================
   FOLD CARRIES GATE (9/16/26, WORLD lane) -- board row [fold carries] /
   THE-FOLD-CARRIES-THE-WRONG-THINGS.

   WHAT THIS DEFENDS: the handoff costs something. The heir keeps what is still lit
   and loses what went dark, so paying the rent is what decides whether your
   buildings outlive you.

   AND IT DEFENDS BOTH DIRECTIONS, which is the only honest way to check this. A
   test that only shows buildings disappearing is equally consistent with "demolish
   everything at the fold", which would be far worse than the bug it replaced. So
   the surface check stands buildings on SEPARATE circuits, douses half, and
   requires survivors AND losses in the same fold.

   node gates/fold_carries_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const HE = require(path.join(ROOT, 'engine/bohemia_heir.js'));
const FO = require(path.join(ROOT, 'engine/bohemia_fold.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('FOLD CARRIES GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (the handoff costs something: the heir keeps what is still lit and'
            + ' loses what nobody kept up)');
  process.exit(fail ? 1 : 0);
};
function code(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ')
            .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
            .replace(/'(\\.|[^'\\])*'/g, "''")
            .replace(/"(\\.|[^"\\])*"/g, '""');
}

/* ---- 1. *** THE FOLD IS A JOINER AND NEVER READS ITS OWN TABLE *** ------ */
{
  const full = { standings: { Mob: 5 }, deeds: [1, 2], territory: ['a'], builds: ['h'],
                 karma: 7, family: ['dad'], wounds: ['leg'], debt: { Mob: 4 } };
  const f = FO.fold(full, null);
  ok('fold() hands the ledger through untouched, debt included',
     JSON.stringify(f.ledger) === JSON.stringify(full));
  ok('and it names the half it is missing rather than pretending', f.missing === 'memory');
  const unruled = FO.unruled().map(r => r.field);
  ok('*** AND THE MATERIAL ROWS ARE STILL MARKED UNRULED *** (' + unruled.length + ': '
     + unruled.slice(0, 4).join(', ') + '...)',
     unruled.indexOf('builds') >= 0 && unruled.length >= 6);
  const r = HE.buildsRule();
  ok('the builds row says out loud that it is a one-way ratchet',
     r && r.field === 'builds' && /ratchet/.test(r.why || ''));
}

/* ---- 2. THE RULING IS ASKED, NOT COPIED --------------------------------- */
{
  ok('it takes something while the row is unruled', HE.takesAnything() === true);
  const row = HE.buildsRule(), wasR = row.ruled, wasC = row.carries;
  row.ruled = true; row.carries = 'whole';
  const stopped = HE.takesAnything() === false;
  const kept = HE.survives([{ x: 1, y: 1 }], () => false);
  row.ruled = wasR; row.carries = wasC;
  ok('*** RULE THE ROW `whole` AND IT STOPS TAKING ANYTHING, with nothing here to'
     + ' edit ***', stopped && kept.lost.length === 0 && kept.kept.length === 1);
  ok('and it starts again when the row goes back', HE.takesAnything() === true);
  const body = code(fs.readFileSync(path.join(ROOT, 'engine/bohemia_heir.js'), 'utf8'));
  ok('no rate, no percentage, no random in the module',
     !/Math\.random|\bpct\b|\brate\b|0\.\d/.test(body));
}

/* ---- 3. *** IT KEEPS AND IT LOSES, AND IT FAILS TOWARDS KEEPING *** ----- */
{
  const b = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 4 }];
  const s = HE.survives(b, (x) => x <= 2 ? true : (x === 4 ? null : false));
  ok('a build on a lit street is kept (' + s.kept.length + ')', s.kept.length === 3);
  ok('a build on a dark street is lost (' + s.lost.length + ')', s.lost.length === 1);
  ok('*** AND A BUILD IT CANNOT JUDGE IS KEPT, NEVER TAKEN *** (unknown ' + s.unknown + ')',
     s.unknown === 1 && s.kept.filter(x => x.x === 4).length === 1);
  ok('with no way to ask at all, nothing is taken',
     HE.survives(b, null).lost.length === 0 && HE.survives(b, null).kept.length === 4);
  ok('the kept line comes first, because a loss is felt harder than a gain',
     /still standing/.test(HE.say(s)[0]) && /gone/.test(HE.say(s)[1]));
  ok('nothing built is said plainly rather than as two zeroes',
     /nothing to hand over/.test(HE.say(HE.survives([], () => true))[0]));
  ok('the words are attempts and count real things',
     HE.draft === true && /^3 of the things/.test(HE.say(s)[0]));
  ok('the fields other lanes own are named, not touched',
     HE.NOT_MINE.indexOf('family') >= 0 && HE.NOT_MINE.indexOf('wounds') >= 0);
}

/* ---- 4. AND IT HAPPENS IN THE GAME, THROUGH THE GAME'S OWN FOLD --------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 300);

  const r = await pg.evaluate(() => {
    const R = { module: typeof window.BohemiaHeir }, n = om.n;
    if (R.module !== 'object') return R;
    const front = (x, y) => {
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        let s = null; try { s = POWER.at(x + dx, y + dy); } catch (e) { continue; }
        if (s && s.id >= 0) return s;
      }
      return null;
    };
    /* THE STRUCTURAL FACT THIS RULE RESTS ON, re-measured every run: you build on
       sand and circuits run along streets, so a plot NEVER has a wire of its own. */
    let desert = 0, ownWire = 0, fronting = 0;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const c = om.at(x, y); if (!c || c.district !== 'desert') continue;
      desert++;
      let s = null; try { s = POWER.at(x, y); } catch (e) {}
      if (s && s.id >= 0) { ownWire++; continue; }
      if (front(x, y)) fronting++;
    }
    R.desert = desert; R.ownWire = ownWire; R.fronting = fronting;

    /* one build per distinct LIVE circuit */
    const byCircuit = {};
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const c = om.at(x, y); if (!c || c.district !== 'desert') continue;
      const f = front(x, y); if (!f || !f.live) continue;
      if (!byCircuit[f.id]) byCircuit[f.id] = { x: x, y: y, id: f.id };
    }
    const picks = Object.keys(byCircuit).map(k => byCircuit[k]);
    const ty = (CE.buildableTypes(OM.DISTRICT) || [])[0];
    let placed = 0;
    picks.forEach(p => { try { if (CE.build(EDITS, p.x, p.y, CBdistAt(p.x, p.y), ty, OM.DISTRICT).ok) placed++; } catch (e) {} });
    const built = () => Object.keys(EDITS.cells || {}).filter(k => CE.cat(EDITS.cells[k]) === 'sand').length;
    R.placed = placed; R.before = built();
    /* douse HALF the circuits, so the fold must do both things at once */
    const kill = picks.slice(0, Math.floor(picks.length / 2));
    R.doused = kill.filter(p => { try { return POWER.douse(p.id); } catch (e) { return false; } }).length;
    try { ctFold(); } catch (e) { R.threw = String(e); }
    R.after = built();
    R.took = window.HEIR_TOOK;
    return R;
  });
  await b.close();

  ok('the heir book reaches the surface he walks', r.module === 'object');
  ok('*** YOU BUILD ON SAND AND WIRES RUN ALONG STREETS: ' + r.ownWire + ' of '
     + r.desert + ' buildable cells carry a wire of their own ***',
     r.desert > 0 && r.ownWire === 0 && r.fronting > 0);
  ok('the probe really built something (' + r.placed + ' on ' + r.placed + ' circuits)',
     r.placed > 3 && r.before === r.placed);
  ok('and really put half the streets out (' + r.doused + ')', r.doused > 0);
  ok('*** THE HEIR LOSES WHAT WENT DARK *** (lost ' + (r.took || {}).lost + ')',
     r.took && r.took.lost > 0);
  ok('*** AND KEEPS WHAT IS STILL LIT, which is the leg up the row asks for ***'
     + ' (kept ' + (r.took || {}).kept + ')', r.took && r.took.kept > 0);
  ok('*** THE BUILDINGS REALLY LEFT THE GAME, not just the sentence *** ('
     + r.before + ' -> ' + r.after + ')',
     r.after === r.took.kept && r.after < r.before);
  ok('and the words match the deed',
     (r.took.lines || []).length === 2
     && r.took.lines[0].indexOf(String(r.took.kept)) === 0
     && r.took.lines[1].indexOf(String(r.took.lost)) === 0);
  ok('no page error through a real generation fold'
     + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  {
    const raw = fs.readFileSync(CITY, 'utf8');
    const tool = fs.readFileSync(path.join(ROOT, 'tools/bohemia_city_work_patch.py'), 'utf8');
    const riders = (tool.slice(tool.indexOf('RIDERS = ['), tool.indexOf(']', tool.indexOf('RIDERS = [')))
      .match(/bohemia_[a-z_]+\.js/g) || []);
    const bad = riders.filter(f =>
      raw.split('/* ==== engine/' + f + ' ==== */').length !== 2 ||
      raw.split('/* ==== /engine/' + f + ' ==== */').length !== 2);
    ok('every spliced module block is opened once and closed once (' + riders.length
       + ' riders' + (bad.length ? ', broken: ' + bad.join(', ') : '') + ')',
       riders.length >= 14 && bad.length === 0);
  }
  done();
})();
