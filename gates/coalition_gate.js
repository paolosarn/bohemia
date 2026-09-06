/* ============================================================================
   THE COALITION GATE (9/6/26, WORLD lane) — BB-COALITION.

   "THE WORLD DOES NOT GET STRONGER, IT GETS ORGANISED." The best escalation
   mechanic in the game he named, and it costs zero balance numbers: factions that
   normally fight each other STOP, and start appearing together. NOBODY'S STAT
   BLOCK CHANGED. THE RELATIONSHIP GRAPH DID.

   SO ESCALATION IS A GRAPH EDIT, AND THE MODULE HAS NO NUMBERS IN IT AT ALL.
   The condition is pure graph and needs no ruling: A and B are hostile TO EACH
   OTHER in his own authored relations, AND both are hostile to YOU. Two outfits
   who hate each other and both hate you have a reason to stop, and that reason is
   a fact about the graph rather than a dial.
   THE OBVIOUS VERSION IS A THRESHOLD -- "when N factions hate you" -- and N is a
   number nobody ruled. Check 1 holds the file clear of one.

   NO DAMAGE BEFORE THE DIAL IS NOT A BLOCKER HERE, IT IS THE SPECIFICATION:
   nothing changes anybody's strength, only who is pointing it at whom.

   node gates/coalition_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const C = require(path.join(ROOT, 'engine/bohemia_coalition.js'));
const B = require(path.join(ROOT, 'engine/bohemia_between.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('COALITION GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (a graph edit, not a dial - no threshold anywhere - derived so'
            + ' peace dissolves it)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. it is a graph edit, and there is no number in it ---------------- */
{
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_coalition.js'), 'utf8');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const logic = code.replace(/'(?:\\.|[^'\\])*'/g, "''").replace(/"(?:\\.|[^"\\])*"/g, '""');
  /* A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). The header
     explains why there is no threshold, and a grep over prose would read that explanation
     as the violation. Comments and string bodies are stripped first. */
  ok('NO THRESHOLD ANYWHERE IN THE LOGIC -- "when N factions hate you" is a number nobody'
     + ' ruled', !/(threshold|SHARE|>=\s*0?\.\d|<=\s*0?\.\d)/i.test(logic));
  ok('and the only comparison it makes is against ZERO, which is the sign of a standing'
     + ' rather than a size of one',
     (logic.match(/[<>]\s*-?\d/g) || []).every(m => /0$/.test(m)));
  ok('NOTHING HERE CHANGES ANYBODY\'S STRENGTH -- no damage, no stat, no multiplier',
     !/(damage|hp|health|strength|power\s*[*+]|multipl)/i.test(logic));
  ok('and it writes to nothing: a coalition is a reading, never a stored flag',
     !/\.push\(\s*\{[^}]*stored|save\s*\[|localStorage/i.test(logic));

  /* CONTENTS-HIS: his own pact table ships shut. */
  ok('COALITIONS SHIPS EMPTY -- who allies with whom, and when, is his',
     Array.isArray(C.COALITIONS) && C.COALITIONS.length === 0);
}

/* ---- 2. the condition, on his real graph -------------------------------- */
{
  ok('it reads his authored pairs', C.pairs().length >= 5);
  /* MEASURED 9/6 AND WRITTEN DOWN RATHER THAN ASSUMED: of his five authored pairs only
     TWO are hostile, and both involve the Cartel. That is the ceiling on coalitions read
     off canon alone, and it is CONTENTS -- more pairs are his to author. */
  const hostile = C.pairs().filter(([a, b]) => !!C.feudBetween(a, b));
  ok('and only the HOSTILE ones can ever unite (' + hostile.length + ' of '
     + C.pairs().length + ' authored)', hostile.length >= 1 && hostile.length < C.pairs().length);

  ok('WITH NOBODY HOSTILE TO YOU, NOBODY UNITES', C.formed({}).length === 0);
  ok('and one enemy is not a coalition -- it takes two who also hate each other',
     C.formed({ CARTEL: -6 }).length === 0);

  const both = { CARTEL: -6, REMNANTS: -6 };
  const f = C.formed(both);
  ok('*** TWO OF HIS ENEMIES WHO BOTH HATE YOU STOP FIGHTING EACH OTHER ***',
     f.length === 1 && /cartel/i.test(f[0].a + f[0].b) && /remnants/i.test(f[0].a + f[0].b));
  ok('and it says WHAT IT WAS, off his own label rather than a word invented here',
     f[0].was === 'permanent-war');
  ok('every derived coalition is draft, so an authored one can overrule it',
     f[0].draft === true && f[0].ruled === false);
  ok('and it lists who is now pointed at you as one thing',
     C.against(both).length === 2);
  ok('the feud reads as suspended to anything that asks',
     !!C.suspended('Cartel', 'Remnants', both) && !!C.suspended('Remnants', 'Cartel', both));

  /* DERIVED, NEVER STORED -- the same anti-stuck design as the mandate rung. */
  ok('*** MAKING PEACE WITH ONE OF THEM DISSOLVES IT *** and no dissolution rule was'
     + ' needed, because it was never stored',
     C.formed({ CARTEL: 2, REMNANTS: -6 }).length === 0);
  ok('a faction nobody has dealt with is a stranger, not an enemy',
     C.hostileToYou({ CARTEL: 0 }, 'Cartel') === false
     && C.hostileToYou({}, 'Cartel') === false);
  ok('and his graph is still intact underneath -- the feud is suspended, never deleted',
     B.between('Cartel', 'Remnants').label === 'permanent-war');

  /* HIS PACT WINS WHATEVER THE STANDINGS SAY, the same order between() already uses. */
  C.COALITIONS.push({ a: 'Blues', b: 'Reds', because: 'gate fixture' });
  const g = C.formed({});
  ok('AN AUTHORED PACT HOLDS WITH NOBODY HOSTILE TO YOU -- his graph is the world',
     g.length === 1 && g[0].ruled === true && g[0].draft === false);
  C.COALITIONS.length = 0;
  ok('(and the fixture is removed, leaving the table as empty as it was found)',
     C.COALITIONS.length === 0);
}

/* ---- 3. on the surface he walks ---------------------------------------- */
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

  const r = await pg.evaluate(() => {
    const R = {};
    R.hasModule = typeof BohemiaCoalition !== 'undefined';
    /* THE CHECK THAT CAUGHT THE REAL BUG. The first cut resolved BohemiaBetween at LOAD
       time and saw ZERO pairs here while node saw five -- the city inlines modules in an
       order this module does not control, so it bound null and reported "no coalitions",
       which is indistinguishable from a peaceful valley. */
    R.pairs = BohemiaCoalition.pairs().length;
    R.atBoot = BohemiaCoalition.formed(rungStandings()).length;
    showStanding();
    R.cardClean = (document.getElementById('daycardIn') || {}).textContent || '';
    DQ.shared = DQ.shared || {}; DQ.shared.faction = DQ.shared.faction || {};
    DQ.shared.faction.CARTEL = -6; DQ.shared.faction.REMNANTS = -6;
    R.formed = BohemiaCoalition.formed(rungStandings()).length;
    cardHide(); showStanding();
    R.cardAfter = (document.getElementById('daycardIn') || {}).textContent || '';
    DQ.shared.faction.CARTEL = 2;
    cardHide(); showStanding();
    R.cardPeace = (document.getElementById('daycardIn') || {}).textContent || '';
    return R;
  });
  await b.close();

  ok('the walked surface carries the module', r.hasModule === true);
  ok('AND IT CAN SEE HIS GRAPH FROM THERE (' + r.pairs + ' pairs) -- bound when it is'
     + ' asked, never when it loads', r.pairs >= 5);
  ok('a clean run has no coalition and the card says nothing about one',
     r.atBoot === 0 && !/AGAINST YOU/.test(r.cardClean));
  ok('making two of his enemies hate you forms one', r.formed === 1);
  ok('*** AND THE CARD HE ALREADY OPENS NAMES THEM ***',
     /AGAINST YOU/.test(r.cardAfter) && /Cartel \+ Remnants/.test(r.cardAfter));
  ok('and says what it means, without claiming anybody got stronger',
     /not spending it on each other/.test(r.cardAfter)
     && /Nobody got stronger/.test(r.cardAfter));
  ok('making peace takes the line off the card again',
     !/AGAINST YOU/.test(r.cardPeace));

  /* AND THE STALE LINE THIS CARD CARRIED IS GONE. It said "Nobody holds this ground yet.
     No faction has claimed this district" -- true when written, FALSE since BB-TURF gave
     all 9,216 cells a named holder. A card telling him nobody is here while a faction
     refuses him a building permit two taps away is worse than one that says nothing. */
  ok('THE CARD NAMES WHO HOLDS THE GROUND HE IS ON, instead of the line that went stale',
     /THIS GROUND/.test(r.cardClean) && !/No faction has claimed/.test(r.cardClean));

  ok('no page error across forming and dissolving a coalition'
     + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  done();
})();
