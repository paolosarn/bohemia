// DEAD LEGEND CODE GATE (8/23, WORLD lane). A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.
//
// A legend code that no generator ever places is CONTENT THAT DOES NOT EXIST. It passes
// tilespec_gate (the dossier row is there), passes district_kit_gate (the entry is
// well-formed), appears in the tiling brief, and is never once in the game. That is the same
// silence that hid the streetlights, the cars and the rubble this week.
//
// =====================================================================================
// THIS GATE WAS SHIPPED WRONG AN HOUR AGO AND THIS IS THE CORRECTION
// =====================================================================================
// The first version measured by calling spec.generate() directly with synthetic options. It
// reported 59 dead codes and printed them as a worklist. THE WORKLIST WAS SUBSTANTIALLY
// FALSE, and every failure had one cause: A DISTRICT DOES NOT DECIDE ITS OWN SHAPE. The world
// hands it options, and a generator called without them builds something that never occurs.
//
//   airport / airbase  the harness said NO HANGAR, NO JET BRIDGE, NO DEAD AIRLINER. The built
//                      valley has 45,864 hangar tiles, 6,572 airliner, 70 jet bridge. An
//                      airfield is a FIELD spanning several cells and one cell is a WINDOW
//                      onto it; with no `bounds` it builds a 128-tile field whose apron loop
//                      cannot execute even once.
//   freeway            the harness said NO OVERPASS DECK and NO BRIDGE COLUMN -- "a freeway
//                      that never crosses anything", which I nearly published as a headline.
//                      The valley has 296,132 deck tiles across 101 cells and 1,818 columns.
//                      The deck needs `cross`, the arterials crossing the corridor, and only
//                      the world knows that.
//
// FIVE TIMES IN ONE SESSION THE INSTRUMENT WAS THE BROKEN PART. So this version does not ask
// a district what it would build in a vacuum. IT READS THE VALLEY THAT EXISTS, through the
// same tileMeta() the renderer uses (VERIFY ON THE REAL SURFACE, 7/18). If a code is missing
// from the built world it is missing from the game, and there is no third explanation left
// for the gate to be wrong about.

const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const REPO = path.dirname(__dirname);

// Genuinely conditional codes, each with its condition. A code that is merely UNFINISHED does
// not belong here -- that is what the gate is for. The list is short on purpose: reading the
// real world removed most of the reasons a code merely LOOKED absent.
const CONDITIONAL = {
  'suburb:5': 'gate — GATED IS RICH (Paolo): only a gated/estate community, never a walled suburb',
  // THE AIRFIELD SHARES ONE LEGEND ACROSS TWO DISTRICTS, so each of them carries the other's
  // rows and each of those rows is dead by design. bohemia_airfield.js registers `airport` and
  // `airbase` against the same LEGEND object and then branches on kind: the landside band is
  // `kind==='airport' ? 8 : 9`, the apron is a jet bridge and an airliner on one and a fighter
  // in revetments on the other. Read in the source, not inferred (engine/bohemia_airfield.js
  // lines 102, 158-174). v1 of this gate named these six and v2 dropped them, which put six
  // false entries in a worklist somebody is supposed to be able to trust.
  'airport:9': 'hangar — the airbase branch only; an airport\'s landside is one terminal block (code 8)',
  'airport:12': 'dead fighter — the airbase apron only; an airport parks airliners (code 11)',
  'airport:17': 'revetment — the airbase apron only; alert pads do not exist landside of a terminal',
  'airbase:8': 'terminal — the airport branch only; an airbase\'s landside is separate hangars (code 9)',
  'airbase:10': 'jet bridge — the airport apron only; nothing docks a bridge to a fighter',
  'airbase:11': 'dead airliner — the airport apron only; the airbase parks fighters (code 12)',
};

(async () => {
  let pass = 0, fail = 0;
  const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  let pageErr = null;
  page.on('pageerror', e => { pageErr = pageErr || String(e).slice(0, 160); });
  await page.goto('file://' + path.join(REPO, 'slices/BOHEMIA_CITY_WORLD.html'),
                  { waitUntil: 'load' });
  await page.waitForFunction(() => typeof render === 'function', null, { timeout: 90000 });

  // SAMPLE EVERY DISTRICT AS THE WORLD ACTUALLY BUILT IT. Up to CAP cells each, spread evenly
  // across every cell that district occupies, so a multi-cell field contributes windows from
  // end to end and a one-cell district contributes its whole self.
  //
  // CAP IS 160 AND THAT NUMBER IS LOAD-BEARING, stated here rather than buried. Measured the day
  // it was set: at 40 the gate reported 46 dead, at 160 it reported 41 on the same tree, and the
  // ratchet has come down since. THE SIX DIFFERENCE WERE SAMPLING ARTEFACTS -- rare
  // codes that only occur where two things coincide (a freeway crossing the rail corridor
  // exists in six cells of the whole valley). So this list still means "absent from up to 160
  // built cells", not "provably absent from the game", and deeper sampling would find a few
  // more alive. Saying so is the difference between a worklist somebody can trust and the one
  // this gate shipped with an hour ago.
  /* SPREAD THE SAMPLE ACROSS THE WHOLE DISTRICT, NOT THE FIRST 160 CELLS IT MEETS (8/24).
     This used to take cells in raster order and stop at CAP, which for any district bigger
     than CAP meant IT ONLY EVER SAW THE TOP OF THE VALLEY. It cost a false answer the same
     day it mattered: solar occupies 301 cells, another lane consolidated it to one real farm,
     and the gate reported solar:2 'control building' and solar:6 'substation switchgear' as
     DEAD. Censused across all 301 cells: 378 tiles of control building and 960 of switchgear,
     both alive -- they simply sit in cells the raster sample never reached. Nearly wrote two
     false deaths into a worklist and raised a ratchet to cover them.
     So: collect every cell of every district first, THEN take CAP of them evenly spaced. Same
     cost, and a rare feature anywhere in a district can now be seen from anywhere in it. */
  const seen = await page.evaluate((CAP) => {
    const cellsOf = {};
    for (let ty = 0; ty < om.n; ty++) {
      for (let tx = 0; tx < om.n; tx++) {
        const t = om.at(tx, ty);
        if (!t) continue;
        (cellsOf[t.district] || (cellsOf[t.district] = [])).push([tx, ty]);
      }
    }
    const out = {}, count = {};
    for (const d in cellsOf) {
      const list = cellsOf[d];
      /* EVENLY ACROSS THE WHOLE LIST. `i += floor(len/CAP)` is NOT that: at len=301 and
         CAP=160 the step is 1 and you are back to reading the first 160 cells, which is the
         exact bug this block was rewritten to kill. Indexing k*len/CAP spans the full range
         whatever the two numbers are. */
      const take = Math.min(CAP, list.length);
      for (let k = 0; k < take; k++) {
        const cell = list[Math.floor(k * list.length / take)];
        let m;
        try { m = tileMeta(cell[0], cell[1]); } catch (e) { continue; }
        const grid = m.kit || m.sub;
        if (!grid) continue;
        count[d] = (count[d] || 0) + 1;
        const s = out[d] || (out[d] = {});
        for (let j = 0; j < grid.length; j++) s[grid[j]] = 1;
      }
    }
    return { codes: out, cells: count };
  }, 160);

  ok('the city page booted with no error' + (pageErr ? ' -- ' + pageErr : ''), !pageErr);

  const K = require(path.join(REPO, 'engine/bohemia_district_kit.js'));
  require(path.join(REPO, 'engine/bohemia_world.js'));

  const dead = [];
  let codes = 0, districts = 0;
  const unseen = [];
  for (const t of K.types().slice().sort()) {
    const spec = K.get(t);
    if (!spec || !spec.legend) continue;
    const built = seen.codes[t];
    if (!built) { unseen.push(t); continue; }   // does not occur in this valley: not judged
    districts++;
    for (const c of Object.keys(spec.legend)) {
      codes++;
      if (built[c]) continue;
      const key = t + ':' + c;
      if (CONDITIONAL[key]) continue;
      dead.push(key + '  ' + String((spec.legend[c] || {}).name || ''));
    }
  }
  await browser.close();

  // THE RATCHET. Whatever is dead today is written down; it may only come down. A district
  // author adding a legend row the world never builds is told immediately -- this class has
  // stayed invisible for weeks at a time.
  const DEBT = 19;
  ok(`read the BUILT valley, not a synthetic generate (${districts} districts, ${codes} codes)`,
     districts >= 40 && codes >= 600);
  // NOBODY QUIETLY LOWERS THE SAMPLE DEPTH. Halving it would "improve" the dead count by
  // inventing five deaths, which is the failure this gate was rebuilt to stop.
  ok('the sample depth is still 160 cells per district (a shallower sweep invents deaths)',
     /\}, 160\);/.test(require('fs').readFileSync(__filename, 'utf8')));
  ok('every named-conditional entry carries a REASON (a bare allowlist explains nothing)',
     Object.values(CONDITIONAL).every(v => typeof v === 'string' && v.length > 20));
  ok(`DEAD LEGEND CODES only ever SHRINK (${dead.length}, was ${DEBT})`, dead.length <= DEBT);

  if (dead.length) {
    console.log('  authored in a legend and absent from every sampled cell of the BUILT valley:');
    for (const d of dead.slice(0, 30)) console.log('    ' + d);
    if (dead.length > 30) console.log('    ... and ' + (dead.length - 30) + ' more');
  }
  if (unseen.length) {
    console.log('  (' + unseen.length + ' registered districts do not occur in this valley, so ' +
                'they are not judged: ' + unseen.slice(0, 8).join(', ') +
                (unseen.length > 8 ? ' ...' : '') + ')');
  }

  console.log('DEAD CODE GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
              dead.length + ' dead / ' + codes + ' codes in ' + districts + ' built districts)');
  process.exit(fail ? 1 : 0);
})();
