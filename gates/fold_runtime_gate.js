/* ============================================================================
   FOLD RUNTIME GATE (9/7/26, QUESTS lane) -- VAMILY [generation handoff],
   THE-FOLD-IN-THE-RUNTIME.

   THE ROW: the gen 1 to gen 2 handoff as quest runtime -- what carries, what the
   heir inherits, the beat itself. Canon is his, the machine is ours.

   *** THE THING THIS EXISTS TO STOP IS A FOLD THAT LIES BY OMISSION. ***
   There are TWO folds in this repo and neither knows the other exists:
   foldGeneration in the dynasty engine carries THE LEDGER and has zero callers
   outside the retired slice; the walked city's ctFold carries THE MEMORY. A
   handoff that runs one of them and returns a confident answer is half a
   handoff wearing a whole one's clothes. So the beat NAMES THE MISSING HALF,
   every time, and this gate proves it does.

   WHAT IT HOLDS:

   1. THE CARRY LIST IS THE STUDY'S, NOT MINE. Every field is checked against
      records/BOHEMIA_DYNASTY_DAY_13_WHAT_CARRIES_AND_WHAT_MUST_DIE, which was
      written against measured persistence research. A field that cannot be
      traced there is a field somebody added by hand.

   2. *** NO INVENTED DECAY. *** One rate exists in this game today
      (STANDING_DECAY_TO_NEUTRAL, 0.25 a generation) and the study measured that
      real status persists at about 0.79, so 0.75 is nearly right AND IS ON THE
      WRONG FIELD, because it is the only field that decays while wealth carries
      whole forever. That is a ruling about how his hundred years feel. So the
      module reports it and changes nothing, and every field whose rate nobody
      has ruled must appear in unruled() rather than getting a number I picked.

   3. DEBT DIES, AND IT IS THE ONE THING ON THE BRIEF'S OWN LIST THAT DOES. A
      child is not personally liable for a parent's unsecured debts. You inherit
      less, and you inherit the people he owed, still standing there.

   4. WHAT YOU KEPT COMES FIRST. Losses are felt harder than equal gains, so the
      thing that answers "did I lose everything" leads and the loss follows. An
      order is a design decision and this one is measured, so it is asserted.

   5. IT WRITES INTO NOTHING. Both folds belong to other systems. This composes
      their answers and re-implements neither.

   6. AND IT RUNS IN THE GAME, reporting the missing half honestly rather than
      returning three bare numbers nobody consumes -- which is what it did
      before this round, in exactly two places in the file.
   ========================================================================== */
'use strict';
const path = require('path');
const fs   = require('fs');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};

global.window = global;
const F = require(path.join(ROOT, 'engine/bohemia_fold.js'));

/* ---- 1. THE CARRY LIST IS THE STUDY'S ------------------------------------ */
const STUDY = path.join(ROOT, 'records/BOHEMIA_DYNASTY_DAY_13_WHAT_CARRIES_AND_WHAT_MUST_DIE_9_5_26.md');
ok('1a the study this list comes from is in the repo', fs.existsSync(STUDY));
const study = fs.existsSync(STUDY)
  ? fs.readFileSync(STUDY, 'utf8').toLowerCase().replace(/\s+/g, ' ') : '';
const list = F.carryList();
ok('1b the list has every field the two folds produce (' + list.length + ')', list.length >= 12);
const untraceable = list.filter(c => study.indexOf(c.field.toLowerCase()) < 0);
ok('1c every field traces to the study (' + untraceable.length + ' do not)',
   untraceable.length === 0, untraceable.map(c => c.field).join(' '));
ok('1d and every one carries the reason it says what it says',
   list.every(c => typeof c.why === 'string' && c.why.length > 40));
ok('1e every field names which fold produced it, so nothing is invented here',
   list.every(c => ['ledger', 'memory', 'neither'].indexOf(c.from) >= 0));

/* ---- 2. NO INVENTED DECAY ------------------------------------------------ */
const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_fold.js'), 'utf8');
/* STRIP COMMENTS *AND* STRING LITERALS. The first cut of this check read the
   carry table's own prose -- which quotes the measured persistence figures 0.79,
   0.3 and 0.4 as REASONS -- and called them decay rates the module had invented.
   A checker that cannot tell a number in a sentence from a number in a formula
   will teach people to delete the sentence, which is the opposite of the point. */
const code = src.replace(/\/\*[\s\S]*?\*\//g, ' ')
                .replace(/^\s*\/\/.*$/gm, ' ')
                .replace(/'(?:[^'\\]|\\.)*'/g, "''")
                .replace(/"(?:[^"\\]|\\.)*"/g, '""');
/* a decay rate is a fraction. There must not be one in the LOGIC. */
const fractions = (code.match(/\b0\.\d+\b/g) || []);
ok('2a the module holds no decay rate of its own (' + fractions.length + ': '
   + [...new Set(fractions)].join(',') + ')', fractions.length === 0);
const unruled = F.unruled();
ok('2b and the fields nobody has ruled a rate for are listed, not guessed ('
   + unruled.length + ': ' + unruled.map(c => c.field).join(',') + ')', unruled.length >= 5);
ok('2c a field is either ruled or unruled, never silently either way',
   list.every(c => typeof c.ruled === 'boolean'));
/* THE ENGINE'S ONE RATE IS STILL THERE AND STILL UNTOUCHED BY THIS ROUND. */
const eng = fs.readFileSync(path.join(ROOT, 'engine/bohemia_engine.js'), 'utf8');
ok('2d the engine still owns the only rate in the game, and this round did not '
   + 'move it', /STANDING_DECAY_TO_NEUTRAL\s*=\s*0\.25/.test(eng));
ok('2e and the module says out loud that the rate is on the wrong field',
   /on the wrong field/i.test(src));

/* ---- 3. DEBT DIES -------------------------------------------------------- */
const dead = F.dies();
ok('3a something on the list dies (' + dead.map(c => c.field).join(',') + ')', dead.length >= 1);
ok('3b and it is the debt', dead.some(c => c.field === 'debt'));
ok('3c with the reason: you inherit the people he owed, not the bill',
   dead.some(c => /people he owed/i.test(c.why)));

/* ---- 4. WHAT YOU KEPT COMES FIRST ---------------------------------------- */
const ledger = { gen: 1, standings: { a: 1, b: 2 }, territory: { d1: 'x' },
                 builds: { b1: 2 }, economyCapacity: {}, invest: {},
                 family: { tree: [{ id: 'k' }], wounds: ['w1', 'w2'] } };
const memory = { gen: 2, carried: 5, died: 9 };
const whole = F.fold(ledger, memory);
const beat = F.theBeat(whole);
ok('4a a whole fold knows it is whole', whole.whole === true && whole.missing === null);
ok('4b the beat has both halves', beat.kept.length > 0 && beat.lost.length > 0);
ok('4c *** what you KEPT is first *** (kept: ' + beat.kept.length
   + ', lost: ' + beat.lost.length + ')',
   Object.keys(beat).indexOf('kept') < Object.keys(beat).indexOf('lost'));
ok('4d the deeds that survived lead the kept list',
   beat.kept[0] && beat.kept[0].what === 'deeds' && beat.kept[0].n === 5);
ok('4e and what died is counted, not hidden',
   beat.lost.some(l => l.what === 'deeds' && l.n === 9));
ok('4f every line is a sentence a player could read, and every one is a draft',
   beat.draft === true && beat.kept.every(k => k.say && k.say.length > 8));
/* AND A WOUND IS REPORTED, because the study called it the field closest to
   being useless: it carries and nothing settles it. */
ok('4g the wounds that came with you are named',
   beat.lost.some(l => l.what === 'wounds' && l.n === 2));

/* ---- THE MISSING HALF ---------------------------------------------------- */
ok('5a a fold with only the memory half says the ledger is missing',
   F.fold(null, memory).missing === 'ledger');
ok('5b a fold with only the ledger half says the memory is missing',
   F.fold(ledger, null).missing === 'memory');
ok('5c a fold with neither says so', F.fold(null, null).missing === 'both');
ok('5d and a half fold never claims to be whole',
   F.fold(null, memory).whole === false && F.theBeat(F.fold(null, memory)).whole === false);

/* ---- 5. IT WRITES INTO NOTHING ------------------------------------------- */
ok('6a the module assigns into no other system',
   !/Bohemia[A-Za-z]+\s*\.[A-Za-z]+\s*=[^=]/.test(code));
ok('6b and re-implements neither fold',
   !/function\s+foldGeneration|BohemiaStanding\.inherit/.test(code));

/* ======================================================================== */
/*  6. IT RUNS IN THE GAME                                                   */
/* ======================================================================== */
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto('file://' + ALPHA);
    await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await page.reload();
    await SETTLE(page, 3400);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 500);
    const tapped = await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (!t) return false; t.click(); return true;
    });
    ok('R1 the RUN tab exists and was tapped', tapped === true);
    await SETTLE(page, 16000);

    let cityF = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof ctFoldBeat === 'function')) { cityF = f; break; } }
      catch (_e) {}
    }
    ok('R2 the fold reached the frame the player looks at', !!cityF);

    if (cityF) {
      const got = await cityF.evaluate(() => {
        const out = { mod: typeof BohemiaFold };
        try { out.carry = BohemiaFold.carryList().length; } catch (e) {}
        try { out.peek = ctFoldBeat(); } catch (e) { out.peek = 'threw'; }
        try { out.folded = ctFold(); } catch (e) { out.folded = 'threw'; }
        try { out.hasLedgerFold = (typeof foldGeneration === 'function'); } catch (e) { out.hasLedgerFold = false; }
        return out;
      });
      console.log('  [in the game] missing=' + ((got.peek || {}).missing)
        + ' carry=' + got.carry + ' ledgerFoldPresent=' + got.hasLedgerFold);
      ok('R3 the whole carry list is in the game (' + got.carry + ')', got.carry === list.length);
      ok('R4 the fold can be asked what it would say WITHOUT turning a generation',
         !!got.peek && typeof got.peek.gen === 'number');
      /* *** THE HONESTY CHECK. *** The dynasty engine is genuinely not on this
         surface, so the beat must say so rather than returning a confident half. */
      ok('R5 the ledger fold really is absent from this surface',
         got.hasLedgerFold === false);
      ok('R6 *** so the beat names the missing half instead of hiding it ***',
         !!got.peek && got.peek.missing === 'ledger' && got.peek.whole === false);
      ok('R7 turning a generation returns the beat, not three bare numbers',
         !!got.folded && !!got.folded.beat && typeof got.folded.beat.whole === 'boolean');
      ok('R8 and the unruled rates travel with it, so the surface knows what the '
         + 'machine does not', !!got.peek && (got.peek.unruled || []).length >= 5);
    }
    ok('R9 nothing threw while the generation was folded', errs.length === 0, errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('FOLD RUNTIME GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
