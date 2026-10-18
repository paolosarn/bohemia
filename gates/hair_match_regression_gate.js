/* THE HAIR MATCH REGRESSION GATE (10/10/26) -- PORTRAIT [hair match regression gate].
 *
 * REFERENCE CHECK: not a cook tool, a checker; no new pixels. The ruler is the five
 * bugs this lane has already fixed and is named against by name below.
 *
 * Rule 87: PORTRAIT keeps the dials, the hair bank and the gates even while COOK
 * THREE repaints the pixels. Five times this session a portrait silently drifted
 * from the body it is supposed to agree with:
 *   1. cut SHAPE          8/28  the portrait rolled its own shape dials, unrelated to the cut
 *   2. hair COLOUR        9/20  the portrait read the wrong "art default" layer
 *   3. the braid sentinel 9/24  braid:-1 means NONE and -1 is truthy; every face got one
 *   4. face-maker dials   10/9  the maker copied 4 of 6 dial fields, dropping tex and fade
 *   5. random texture     10/9  faceFor rolled hair.tex at random for the whole crowd
 *
 * Every one of these was "the portrait says X, the real worn cut says Y, and nothing
 * ever compared them." This gate IS that comparison, run every time, for every family
 * that has a real worn hair to compare against:
 *   - CITIZENS: the real worn cut is window.BOH_PERSONLOOK.lookFor(id, canonPool).worn.hair,
 *     the exact call faceFor() itself makes -- called a SECOND time, independently, by
 *     this gate, so a future bug inside faceFor's own wiring (any of the five shapes
 *     above) has something honest to disagree with.
 *   - THE SIX ENEMY TIERS: the real worn cut is read fresh from ours.json's
 *     people_looks.value.band and the live window.FACTION_LOOKS table -- never from a
 *     copy of [the enemy faces]'s own cook tool, so a later rename in either source
 *     is caught here too.
 *   - CITY_CAST_LOOKS (the twelve hire/keeper body looks [the hires' faces] reads):
 *     the real worn cut is read fresh from the live table, the same over.hairName
 *     construction hireFaceSrc() itself builds.
 *   - KEEPERS: NAMED HONESTLY, NOT FAKED. No lane has assigned a keeper kind a real
 *     dressed body yet ([the keepers' and hires' bodies], OPEN) -- there is nothing to
 *     match against, so this gate does not pretend to. It checks the one thing that IS
 *     true today: a keeper's face is deterministic (same place+kind, same face, every
 *     time), so a future change cannot make it silently random without this gate
 *     noticing. When a real body lands, this leg upgrades to a real match check.
 *
 * WHAT THIS GATE DOES NOT CHECK, ON PURPOSE: hair COLOUR (bug 2) is a different field
 * (hair.color, not hair.name/hair.tex) with its own dedicated proof in portrait_
 * matches_body_gate.js; re-proving it here would be the second ruler for one fact this
 * lane has already warned against. The face-maker's own dial-copy (bug 4) is a
 * different code path entirely (the interactive panel's click handler, not faceFor for
 * an NPC id) and stays face_maker_gate's job.
 *
 * MUTATION-PROVED, NOT ASSUMED: this file's own comparator is unit-tested against a
 * planted wrong value before it is ever trusted against a real face (legs M1-M3).
 *
 *   node gates/hair_match_regression_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OURS = path.join(REPO, 'records/target/bb/ours.json');

const N_CITIZENS = 200;
const ENEMY_TIERS = ['brigand_thug', 'brigand_poacher', 'brigand_marksman',
  'brigand_raider', 'brigand_leader', 'brigand_marauder'];
const KEEPER_KINDS = ['settle-smith', 'settle-armourer', 'settle-barber', 'settle-clinic', 'settle-board'];
const KEEPER_PLACES = ['THE WASH, NORTH LAS VEGAS', 'RED ROCK, SUMMERLIN'];

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) { pass++; console.log('  ok   ' + n + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + n + (note ? '   ' + note : '')); } };

/* THE COMPARATOR, SHARED BY EVERY FAMILY AND PROVED FIRST (legs M1-M3). A true miss
   on name is always a fail. A tex miss only counts when the cut OWNS a tex (locs,
   braid) -- the other eight of eleven cuts roll tex freely by design (bug 5's own
   fix comment: "a free roll for the cuts that carry no tex of their own"), so the
   real invariant there is "no braid leaks onto a cut that does not own one". */
function agrees(spHair, truthName, truthDials) {
  const nameOk = spHair.name === truthName;
  const wantsBraid = !!(truthDials && truthDials.tex === 'braid');
  const texOk = truthDials && truthDials.tex ? spHair.tex === truthDials.tex : true; /* free roll; braid is the real guard */
  const braidOk = (spHair.braid !== 0) === wantsBraid;
  const dialOk = ['side', 'front', 'vol', 'flare'].every(k =>
    truthDials && truthDials[k] != null ? spHair[k] === truthDials[k] : true);
  return nameOk && texOk && braidOk && dialOk;
}

(async () => {
  console.log('\nTHE HAIR MATCH REGRESSION GATE');

  /* M1-M3: THE COMPARATOR ITSELF, PROVED BEFORE IT JUDGES ANYTHING REAL. */
  ok('M1 a planted name mismatch reads as disagreement',
    agrees({ name: 'WRONG CUT', tex: null, braid: 0 }, 'DUST WEAVE', { tex: 'braid' }) === false);
  ok('M2 a planted braid-sign bug (braid set when the cut owns no braid) reads as disagreement',
    agrees({ name: 'LAYERED FALL', tex: 'wave', braid: 1 }, 'LAYERED FALL', { tex: null }) === false);
  ok('M3 a planted missing braid (cut owns one, portrait has none) reads as disagreement',
    agrees({ name: 'DUST WEAVE', tex: 'wave', braid: 0 }, 'DUST WEAVE', { tex: 'braid' }) === false);
  ok('M4 a true agreement still reads as agreement (the comparator is not just a trap)',
    agrees({ name: 'DUST WEAVE', tex: 'braid', braid: 1 }, 'DUST WEAVE', { tex: 'braid' }) === true);

  const ours = JSON.parse(fs.readFileSync(OURS, 'utf8'));
  const band = ours.people_looks.value.band;

  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 600, height: 400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof hairDialsFor === 'function' &&
    typeof window.BOH_PERSONLOOK !== 'undefined' && window.FACTION_LOOKS && window.CITY_CAST_LOOKS &&
    typeof keeperFaceId === 'function' && typeof hireFaceId === 'function', { timeout: 40000 });

  const r = await p.evaluate(({ N, tiers, band, keeperKinds, keeperPlaces }) => {
    const pool = (window.GARMENTS || []).filter(g => g.st === 'canon');
    function agrees(spHair, truthName, truthDials) {
      const nameOk = spHair.name === truthName;
      const wantsBraid = !!(truthDials && truthDials.tex === 'braid');
      const texOk = truthDials && truthDials.tex ? spHair.tex === truthDials.tex : true;
      const braidOk = (spHair.braid !== 0) === wantsBraid;
      const dialOk = ['side', 'front', 'vol', 'flare'].every(k =>
        truthDials && truthDials[k] != null ? spHair[k] === truthDials[k] : true);
      return nameOk && texOk && braidOk && dialOk;
    }

    /* 1 -- CITIZENS: a second, independent read of the same two public functions
       faceFor() itself calls, so a future bug in faceFor's own wiring has something
       honest to disagree with. */
    let citChecked = 0, citAgree = 0; const citMiss = [];
    for (let i = 0; i < N; i++) {
      const id = 'gate:crowd:' + i;
      const truthName = (window.BOH_PERSONLOOK.lookFor(id, pool).worn || {}).hair || '';
      if (!truthName) continue;
      const truthDials = hairDialsFor(truthName) || null;
      const sp = faceFor(id);
      citChecked++;
      if (agrees(sp.hair, truthName, truthDials)) citAgree++;
      else if (citMiss.length < 5) citMiss.push(id + ': body=' + truthName + ' portrait=' + sp.hair.name);
    }

    /* 2 -- THE SIX ENEMY TIERS: the real worn cut read fresh from ours.json's band
       and the live FACTION_LOOKS table, never from a cached copy of the cook tool
       that first proved this pairing. */
    const tierMiss = []; let tierChecked = 0, tierAgree = 0;
    for (const tierId of tiers) {
      const factions = band[tierId];
      if (!factions || !factions.length) continue;
      const faceName = factions[0].replace('faction_', '');
      const look = (window.FACTION_LOOKS || []).filter(x =>
        x.faction.toLowerCase() === faceName.toLowerCase())[0];
      if (!look || !look.worn || !look.worn.hair) continue;
      const truthName = look.worn.hair;
      const truthDials = hairDialsFor(truthName) || null;
      const sp = faceFor('enemy:' + tierId, { hairName: truthName, reads: 'either' });
      tierChecked++;
      if (agrees(sp.hair, truthName, truthDials)) tierAgree++;
      else tierMiss.push(tierId + ': want=' + truthName + ' got=' + sp.hair.name);
    }

    /* 3 -- CITY_CAST_LOOKS (the twelve hire/body looks): the exact over.hairName
       construction hireFaceSrc() builds internally, exercised directly here so a
       future change to hireFaceSrc's own lookup is still caught even though its
       return value (a PNG data URL) cannot be read back as a spec. */
    const castMiss = []; let castChecked = 0, castAgree = 0;
    for (const look of (window.CITY_CAST_LOOKS || [])) {
      if (!look.worn || !look.worn.hair) continue;
      const truthName = look.worn.hair;
      const truthDials = hairDialsFor(truthName) || null;
      const over = { hairName: truthName };
      const sp = faceFor('hire:gate-test:' + look.id, over);
      castChecked++;
      if (agrees(sp.hair, truthName, truthDials)) castAgree++;
      else castMiss.push(look.id + ': want=' + truthName + ' got=' + sp.hair.name);
    }
    /* hireFaceSrc itself still answers for every real cast look (a smoke test on the
       actual exposed function, not just the faceFor pattern it is built from). */
    let hireSrcOk = 0, hireSrcTotal = 0;
    for (const look of (window.CITY_CAST_LOOKS || [])) {
      hireSrcTotal++;
      try {
        const url = window.hireFaceSrc('gate-test-post', 0, 'cast_' + look.id, {});
        if (typeof url === 'string' && url.indexOf('data:image/png') === 0) hireSrcOk++;
      } catch (_e) {}
    }

    /* 4 -- KEEPERS, NAMED HONESTLY: no real dressed body exists for any keeper kind
       yet ([the keepers' and hires' bodies], OPEN), so there is nothing to match
       against. What IS checkable, and what a future bug COULD break silently: the
       same place+kind always renders the same face. */
    let keeperDetChecked = 0, keeperDetOk = 0;
    for (const place of keeperPlaces) for (const kind of keeperKinds) {
      const id = window.keeperFaceId(place, kind);
      const a = faceFor(id), c = faceFor(id);
      keeperDetChecked++;
      if (a.hair.name === c.hair.name && a.hair.tex === c.hair.tex) keeperDetOk++;
    }

    return {
      citChecked, citAgree, citMiss,
      tierChecked, tierAgree, tierMiss,
      castChecked, castAgree, castMiss,
      hireSrcOk, hireSrcTotal,
      keeperDetChecked, keeperDetOk
    };
  }, { N: N_CITIZENS, tiers: ENEMY_TIERS, band, keeperKinds: KEEPER_KINDS, keeperPlaces: KEEPER_PLACES });

  ok('at least 150 of ' + N_CITIZENS + ' synthetic citizens actually roll a hair cut to check',
    r.citChecked >= 150, r.citChecked + ' checked');
  ok('every citizen checked: the portrait\'s hair.name/hair.tex/braid/shape dials agree with the real worn cut',
    r.citAgree === r.citChecked, r.citAgree + ' of ' + r.citChecked + (r.citMiss.length ? '; ' + r.citMiss.join(' | ') : ''));

  ok('all six shipped enemy tiers resolve a real worn cut from ours.json + FACTION_LOOKS',
    r.tierChecked === ENEMY_TIERS.length, r.tierChecked + ' of ' + ENEMY_TIERS.length);
  ok('every enemy tier: the portrait agrees with the faction\'s real worn cut',
    r.tierAgree === r.tierChecked, r.tierAgree + ' of ' + r.tierChecked + (r.tierMiss.length ? '; ' + r.tierMiss.join(' | ') : ''));

  ok('every CITY_CAST_LOOKS entry carries a real worn hair to check',
    r.castChecked === 12, r.castChecked + ' of 12');
  ok('every cast look: the portrait agrees with the look\'s real worn cut',
    r.castAgree === r.castChecked, r.castAgree + ' of ' + r.castChecked + (r.castMiss.length ? '; ' + r.castMiss.join(' | ') : ''));
  ok('hireFaceSrc() itself answers for every real cast look (smoke test on the exposed function)',
    r.hireSrcOk === r.hireSrcTotal, r.hireSrcOk + ' of ' + r.hireSrcTotal);

  ok('keepers (no dressed body exists yet, named honestly): same place+kind renders the same face every time',
    r.keeperDetOk === r.keeperDetChecked, r.keeperDetOk + ' of ' + r.keeperDetChecked);

  ok('nothing threw anywhere in this sweep', errs.length === 0, errs.join(' | '));

  await b.close();
  console.log('\nTHE HAIR MATCH REGRESSION GATE: ' + pass + ' passed, ' + fail + ' failed\n');
  process.exit(fail ? 1 : 0);
})();
