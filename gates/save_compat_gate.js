/* ============================================================================
   SAVE COMPATIBILITY GATE (8/17/26, RUN lane) — demo board row 6, P0-SAVE.

   The board, corrected 8/15 and routed here "before the friends round":
   "DURABILITY IS NOT COMPATIBILITY: this audit verified that the bytes survive
   the BROWSER and never asked whether they survive US."

   Everything this lane has built for the save so far protects it from the PHONE
   -- two slots, generation counters, checksums, tombstones, a hostile-browser
   gate, an iOS flush. None of it protects it from the next commit.

   THE TRAP THAT WAS ARMED, measured before changing anything:

       citySnapshot() wrote   v:1        (hardcoded)
       applyRestore  tested   st.v!==1   (hardcoded, EXACT EQUALITY)

   So the first lane to do the CORRECT thing -- change the save's shape and bump
   its version -- would have silently returned false for every save in existence
   and started the player at day 1 with nothing. Indistinguishable from the save
   being wiped, which is the exact symptom he has already been burned by twice.
   I got away with adding `purse` and `market` this week ONLY because I did not
   bump the version, which is luck, not design.

   AND THE INVERSE WAS LIVE TOO: play a new build, then open a cached older one
   (a service worker, a phone that never hard refreshed), and the older build
   throws a save from the future away without a word.

   WHAT THIS GATE HOLDS:
     1. the version is ONE constant, not two hardcoded literals that can drift
     2. AN OLD SAVE STILL LOADS -- proven by loading a save written in the
        shape that existed BEFORE purse and market, in a real browser
     3. A FUTURE SAVE IS REFUSED OUT LOUD and LEFT ON DISK, never silently
        turned into a new game
     4. and the exact-equality check can never come back
     5. MUTATION-TESTED, because the whole point is a trap that only springs on
        a future commit: the gate BUMPS THE VERSION at runtime and proves an old
        save still loads. That is the scenario, performed, not asserted.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('SAVE COMPAT GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

/* ---- 1. the shape ------------------------------------------------------- */
{
  const c = fs.readFileSync(CITY, 'utf8');
  ok('the fix is in the build', c.indexOf('__THE_SAVE_SURVIVES_US__') >= 0);
  ok('the version is ONE constant', /var CITY_SAVE_V = \d+;/.test(c));
  ok('the snapshot WRITES that constant, not a literal', /return \{ v:CITY_SAVE_V,/.test(c));
  /* the old check may survive in a comment explaining itself; it must not survive
     as code. Strip block comments before looking. */
  const code = c.replace(/\/\*[\s\S]*?\*\//g, '');
  ok('and the exact-equality check is GONE from the code, not just explained',
     code.indexOf('st.v!==1') < 0);
  ok('there is a walk-forward migrator', /function migrateCity\(/.test(c));
  ok('a save from a newer build is a NAMED refusal, not a bare false',
     /FROM_A_NEWER_BUILD/.test(c));
  ok('the migration table ships EMPTY, because there is one shape today',
     /var CITY_MIGRATE = \{[\s\S]{0,400}?\};/.test(c));
}

/* ---- 2. on the real surface --------------------------------------------- */
(async () => {
  const { chromium } = pw();
  const b = await chromium.launch();
  try {
    const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/^https?:/, r => r.abort());
    await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 120000 });
    for (let i = 0; i < 120; i++) {
      if (await pg.evaluate(() => typeof migrateCity === 'function').catch(() => false)) break;
      await pg.waitForTimeout(200);
    }
    ok('the migrator is live on the walked surface',
       await pg.evaluate(() => typeof migrateCity === 'function'));

    /* AN OLD SAVE: exactly the shape that existed before purse (8/12) and
       market (8/14). This is the real regression, written out by hand rather
       than generated, so it cannot drift with the current snapshot. */
    const OLD = {
      v: 1, seed: 2691674296, day: 5, min: 700, hx: 6205, hy: 6271,
      cx: 48, cy: 48, mode: 'city', riding: false, hzoom: 22,
      loop: null, quest: null
    };
    const r = await pg.evaluate(old => {
      const m = migrateCity(old);
      return { ok: m.ok, why: m.why || null, day: m.st ? m.st.day : null,
               untouched: old.v === 1 && old.day === 5 };
    }, OLD);
    ok('A SAVE FROM BEFORE THE PURSE AND THE MARKET STILL LOADS (day ' + r.day + ')',
       r.ok === true && r.day === 5);
    ok('and the migrator never mutated what was handed to it', r.untouched === true);

    /* A FUTURE SAVE: refused, named, and NOT deleted. */
    const f = await pg.evaluate(() => {
      const fut = { v: 99, seed: 1, day: 3 };
      const m = migrateCity(fut);
      return { ok: m.ok, why: m.why, have: m.have, want: m.want, still: fut.day === 3 };
    });
    ok('a save FROM A NEWER BUILD is refused by name (' + f.why + ', has ' + f.have
       + ' wants ' + f.want + ')', f.ok === false && f.why === 'FROM_A_NEWER_BUILD');
    ok('and it is left alone rather than turned into a new game', f.still === true);

    /* THE MUTATION, AND IT IS THE WHOLE POINT. The trap only springs on a FUTURE
       commit, so the gate performs that commit: bump the version and add the
       migration a lane would add, then prove the old save still arrives. Under
       the old code this is precisely where every save died. */
    const bumped = await pg.evaluate(old => {
      const wasV = CITY_SAVE_V;
      CITY_MIGRATE[1] = function (s) { s.somethingNew = 'added in v2'; return s; };
      CITY_SAVE_V = 2;
      const m = migrateCity(old);
      const out = { ok: m.ok, why: m.why || null, v: m.st ? m.st.v : null,
                    day: m.st ? m.st.day : null, carried: m.st ? m.st.somethingNew : null };
      CITY_SAVE_V = wasV; delete CITY_MIGRATE[1];      // put the build back
      return out;
    }, OLD);
    ok('BUMP THE VERSION THE WAY A LANE WOULD, and his old save still arrives '
       + '(v' + bumped.v + ', day ' + bumped.day + ')',
       bumped.ok === true && bumped.v === 2 && bumped.day === 5);
    ok('carrying what the new shape adds', bumped.carried === 'added in v2');

    /* and a bump with NO migration written must refuse loudly rather than wipe */
    const naked = await pg.evaluate(old => {
      const wasV = CITY_SAVE_V;
      CITY_SAVE_V = 3;
      const m = migrateCity(old);
      CITY_SAVE_V = wasV;
      return { ok: m.ok, why: m.why };
    }, OLD);
    ok('and bumping WITHOUT writing the migration refuses by name rather than '
       + 'silently wiping (' + naked.why + ')',
       naked.ok === false && /NO_MIGRATION_FROM_/.test(String(naked.why)));

    ok('no page error' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  } finally { await b.close(); }
  done();
})().catch(e => { console.log('SAVE COMPAT GATE CRASHED: ' + e.message); process.exit(1); });
