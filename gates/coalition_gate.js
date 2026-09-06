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

  /* ========================================================================
     AND THE HALF THAT IS THE FACTIONS LANE'S. (9/6/26, the same row, which the
     board carries in both sections as "(with WORLD)".)

     *** WORLD SHIPPED THE COALITION AND THE CARD, AND MEASURED AFTER IT LANDED:
     BohemiaCoalition.formed() HAD EXACTLY ONE CALLER IN THE WHOLE GAME, AND IT
     WAS THAT CARD. *** So the valley could tell him "Cartel + Remnants have
     stopped fighting each other, and that is about you" and then every Remnant
     in the street treated him exactly as before -- no watching, no refusing,
     nothing. The row's own sentence is that the enemies who were spending their
     strength on each other POINT ALL OF IT AT YOU, and pointing it at you has
     to be something he MEETS.
     ====================================================================== */
  const A = require(path.join(ROOT, 'engine/bohemia_against.js'));

  ok('THE AGAINST ORGAN IGNORES A COALITION IT IS NOT HANDED -- additive, which '
     + 'is the zero-regression proof', A.read({}) === null
     && A.read({ rung: 'COLD' }).why === 'you');

  const joined = A.read({ coalition: { worst: 'hostile', with: 'Cartel' } });
  ok('*** A PERSON WHOSE OUTFIT JOINED A QUARREL THAT WAS NOT THEIRS IS AGAINST '
     + 'YOU, EVEN THOUGH THEY HAVE NEVER SEEN YOU AND THEIR OUTFIT HAS NO FEUD '
     + 'WITH YOURS. *** That is the whole of the row on the street: '
     + (joined && joined.word),
     !!joined && joined.level === 'hostile' && joined.why === 'joined'
     && joined.signs.watch && joined.signs.refuse);

  ok('AND THE LEVEL IS COPIED OFF THE ALLY, NEVER INVENTED. A coalition of people '
     + 'who merely dislike you cannot manufacture a war, and no fourth level was '
     + 'added to make room for one',
     A.read({ coalition: { worst: 'cold' } }).level === 'cold'
     && A.read({ coalition: { worst: 'war' } }).level === 'war'
     && A.read({ coalition: { worst: 'nonsense' } }) === null
     && Object.keys(A.LEVELS).length === 3);

  ok('and it only explains itself when it IS the reason -- if their outfit already '
     + 'hated you this hard on its own, telling him they joined somebody\'s quarrel '
     + 'is the wrong story about the person in front of him',
     A.read({ rel: { war: true }, coalition: { worst: 'cold' } }).why === 'them'
     && A.read({ rel: { war: true }, coalition: { worst: 'cold' } }).coalition === null);

  ok('and when it is, the card can name who brought them in rather than leaving '
     + 'him to guess which quarrel this is',
     (A.read({ coalition: { worst: 'hostile', with: 'Cartel' } }).coalition || {}).with === 'Cartel');

  /* *** AND ON THE SURFACE HE WALKS. *** */
  const b2 = await chromium.launch();
  const street = await (async () => {
    try {
      const p2 = await b2.newPage({ viewport: { width: 390, height: 844 } });
      const thrown = [];
      p2.on('pageerror', e => thrown.push(String(e.message).slice(0, 120)));
      await p2.route(/^https?:/, r => r.abort());
      await p2.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
      await SETTLE(p2, 14000);
      const out = await p2.evaluate(() => {
        /* ASKS THE ORGAN EVERYTHING THE CITY ASKS IT. The first cut of this
           helper predated [broke raiders] and left `roving` out, so the street
           check for it reported "nothing" after dousing every circuit a faction
           had -- a test measuring a call the game does not make, which is the
           same shape as commitment_gate's D11. */
        const say = f => {
          const a = BohemiaAgainst.read({ rel: ctRelToMine(f), rung: null,
                                          coalition: ctCoalitionAgainst(f),
                                          roving: ctRovingFaction(f) });
          return a ? (a.level + '/' + a.why) : 'nothing';
        };
        const R = { clean: {} };
        R.clean.cartel = say('Cartel');
        DQ.shared = DQ.shared || {}; DQ.shared.faction = DQ.shared.faction || {};
        DQ.shared.faction.CARTEL = -6; DQ.shared.faction.REMNANTS = -6;
        try { ctAgainstBump(); } catch (_e) {}
        R.formed = (BohemiaCoalition.formed(rungStandings(), ctBelongSave()) || [])
                     .map(p => p.a + '+' + p.b);
        R.cartel = say('Cartel'); R.remnants = say('Remnants'); R.church = say('Church');
        DQ.shared.faction.CARTEL = 2;
        try { ctAgainstBump(); } catch (_e) {}
        R.afterPeace = say('Remnants');

        /* *** AND THE ROW BB-COALITION NAMES AS ITS PAIR, ON THE SAME SURFACE.
           (9/6, [broke raiders] BB-UNPAID-TURNS-PREDATORY.) "An outfit that
           loses its income goes roving, and a roving outfit is who somebody else
           recruits." Put a faction's lights out and see what it does. */
        DQ.shared.faction.REMNANTS = 0;
        try { ctAgainstBump(); } catch (_e) {}
        const g = turfGrid();
        const lit = POWER.holdings() || {};
        const tgt = Object.keys(lit).find(f => g && g.byFaction && g.byFaction[f]);
        R.target = tgt || null;
        R.roveBefore = tgt ? say(tgt) : 'n/a';
        R.heldBefore = tgt ? !!ctRovingFaction(tgt) : null;
        let doused = 0;
        if (tgt) {
          const seen = new Set();
          for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) {
            const p = POWER.at(x, y);
            if (!p || !p.live || p.id < 0 || seen.has(p.id)) continue;
            seen.add(p.id);
            if (p.faction === tgt) { POWER.douse(p.id); doused++; }
          }
        }
        R.doused = doused;
        try { ctAgainstBump(); } catch (_e) {}
        R.roveAfter = tgt ? say(tgt) : 'n/a';
        R.otherAfter = say(Object.keys(g.byFaction).find(f => f !== tgt));
        R.thrown = 0;
        return R;
      });
      out.thrown = thrown.length;
      return out;
    } finally { await b2.close(); }
  })();

  ok('*** ON THE STREET: A CLEAN RUN IS SILENT, THEN TWO OF HIS ENEMIES UNITE AND '
     + 'A MEMBER OF EITHER ONE IS AGAINST HIM. *** clean ' + street.clean.cartel
     + ', formed ' + JSON.stringify(street.formed) + ', Cartel ' + street.cartel
     + ', Remnants ' + street.remnants,
     street.clean.cartel === 'nothing' && street.formed.length === 1
     && /^hostile\/joined$/.test(street.cartel) && /^hostile\/joined$/.test(street.remnants));

  ok('and nobody else in the valley is caught by it -- the Church is not in the '
     + 'quarrel and reads as nothing (' + street.church + ')',
     street.church === 'nothing');

  ok('AND MAKING PEACE WITH ONE TAKES IT OFF THE STREET TOO, not just off the card. '
     + 'Derived, never stored, so there is no dissolution rule to forget ('
     + street.afterPeace + ')', street.afterPeace === 'nothing');

  /* *** THE FAULT THAT COST THE MOST, AND THE CLAIM THAT WOULD HAVE CAUGHT IT. ***
     The first cut read the ally's level from ctRelToMine, which is OUTFIT versus
     OUTFIT -- and the player above has no outfit of their own, so myRipples is
     empty, so it came back null for both members and the whole thing quietly did
     nothing WHILE THE PAIR REALLY HAD FORMED. A coalition forms off rungStandings,
     the deed ledger, so that is where the level has to come from.
     THE FIRST VERSION OF THIS CLAIM WAS A GREP for `rungFor` near the function,
     and it went red on its own string arithmetic while the behaviour was correct.
     A grep proves the code exists; three separate faults this session passed
     greps while the thing did nothing. THIS IS THE BEHAVIOUR: the same run that
     produced `hostile/joined` above had NO OUTFIT and NO ripple to read, which is
     precisely the state the broken version returned nothing in. */
  ok('and the level comes off the axis the coalition FORMED on -- proved by the '
     + 'street pass above having no outfit of its own, which is exactly the state '
     + 'the outfit-versus-outfit reading came back empty in',
     street.clean.cartel === 'nothing' && /^hostile\/joined$/.test(street.cartel));

  /* *** THE PAIR ROW, PROVED ON THE SAME WALKED SURFACE. *** */
  ok('*** TAKE A FACTION\'S LIGHTS AND THEY TURN ON THE STREET, NOT JUST IN A '
     + 'TABLE. *** ' + street.target + ' held ground and ' + street.doused
     + ' lit circuits and read "' + street.roveBefore + '"; with every one of them '
     + 'doused they read "' + street.roveAfter + '". You have not weakened them, '
     + 'you have released them -- which turns a free win into a decision',
     street.heldBefore === false && street.doused > 0
     && street.roveBefore === 'nothing' && /\/broke$/.test(street.roveAfter));

  ok('and putting one faction\'s lights out does not release the whole valley -- '
     + 'everybody else is untouched (' + street.otherAfter + ')',
     street.otherAfter === 'nothing');

  ok('nothing threw on the street pass', street.thrown === 0);

  done();
})();
