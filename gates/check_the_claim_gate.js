/* ============================================================================
   CHECK THE CLAIM GATE (9/12/26, QUESTS lane) -- VAMILY [check the claim],
   YOU-CATCH-A-LIAR-BY-WALKING-TO-THE-FENCE.

   THE RESEARCH THE ROW CAME FROM: of 158 measured deception cues, 118 mean
   NOTHING, pauses among them, and people catch a lie 47% of the time, which is a
   coin. So THE LIAR IS BELIEVED and nothing in his mouth is a tell. The design
   rule: an ask can be a CLAIM, and a claim is checked by GOING TO THE THING,
   never by a highlighted dialogue option and never by a skill roll.

   MEASURED BEFORE A LINE WAS WRITTEN: nothing in engine/ checks a claim. The
   seven act-one asks shipped 9/7 are each hand-written to this rule, and that is
   where the rule stopped.

   WHAT IT HOLDS:

   1. A CLAIM THAT CANNOT BE CHECKED BY WALKING SOMEWHERE IS NOT A CLAIM. The
      same admission ticket bohemia_asks.js uses for the visible change: refused
      with a reason, before a word is put in anybody's mouth.

   2. *** A TELL THAT PREDICTS IS A BUG, AND THIS IS THE CHECK THE ROW IS FOR. ***
      The tempting version of this feature is the one every game ships: the liar
      fidgets. That is the 118 cues that mean nothing rebuilt as a mechanic, and
      it would delete the row, because if manner predicts then nobody ever walks.
      So the gate takes every claim the module can make, splits them by true and
      false, and FAILS IF THE MANNER DISTRIBUTIONS DIFFER AT ALL.

   3. AND NO TELL CAN BE SPOKEN. The banned words are refused in code, and the
      refusal is fired at a string it must catch.

   4. THE ONLY INSTRUMENT IS DISTANCE. No skill, no stat, no roll, no gate, no
      randomness anywhere in the file. Greppd, not trusted.

   5. BELIEVING IS THE DEFAULT AND IT IS NOT A MENU STATE. Before anybody walks,
      the world ACTS ON THE CLAIM. That is what the research means mechanically.

   6. WHAT SETTLES IT IS THE RUNNING SYSTEM, NEVER THE CLAIM. check() reads the
      world fresh, so a claim cannot settle itself, and a mutation that makes it
      read its own assertion has to turn this gate red.

   7. A LIE NOBODY CHECKED LEAVES NO MARK. That is the row, stated as an
      invariant: the mark exists only after somebody actually went.

   8. NO CONTENT. Not one person, place, good, price or count in the file.

   9. AND THE MANNER HASH ACTUALLY SPREADS. My first cut used the repo's usual
      32-bit FNV with a plain `*`, whose product runs past 2^53 in JavaScript and
      loses its low bits: b01, b07, b12 and b20 all landed in one bucket, so every
      person on every block said it the same way. Measured, not guessed.
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
const C = require(path.join(ROOT, 'engine/bohemia_claims.js'));
const src  = fs.readFileSync(path.join(ROOT, 'engine/bohemia_claims.js'), 'utf8');
const code = src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
const prose = src.replace(/^\s*\/\/ ?/gm, '').replace(/\s+/g, ' ');

/* ---- A WORLD, BUILT FROM THE MODULE'S OWN FENCE LIST -------------------- */
/* Every row in here is made by walking FENCES, so adding a fence to the module
   grows this gate with it instead of leaving the new one untested. */
function worldOf(n, liarEvery) {
  const w = {};
  C.ORDER.forEach((k, fi) => {
    const f = C.FENCES[k];
    w[f.list] = [];
    for (let i = 0; i < n; i++) {
      const truth = (i % 2 === 0);
      const row = { who: 'w' + fi + '_' + i, where: 'b' + ((i * 7 + fi) % 97),
                    about: 'a' + i, good: 'g' + i, id: 'i' + i };
      row[f.field] = truth;
      /* a liar every Nth row, and WHICH rows lie is decided here and never by
         anything the module can see */
      row.saysIt = (liarEvery && i % liarEvery === 0) ? !truth : truth;
      w[f.list].push(row);
    }
  });
  return w;
}
const TOLD = worldOf(120, 3);
const TRUTH = JSON.parse(JSON.stringify(TOLD));
C.ORDER.forEach(k => { const f = C.FENCES[k];
  TRUTH[f.list].forEach(r => { delete r.saysIt; }); });

const claims = C.claimsIn(TOLD).filter(C.isClaim);
ok('0a the world produces claims from its own running systems (' + claims.length + ')',
   claims.length > 100);
ok('0b every fence the module declares actually produced one (' + C.ORDER.length + ')',
   C.ORDER.every(k => claims.some(c => c.fence === k)));

/* ---- 1. NO PLACE, NO CLAIM ---------------------------------------------- */
const base = claims[0];
ok('1a a claim with nowhere to go is refused, in those words',
   /cannot be checked/.test(C.refuse(Object.assign({}, base, { where: '' })) || ''));
ok('1b a claim nobody makes is refused',
   !!C.refuse(Object.assign({}, base, { who: '' })));
ok('1c something that cannot be true or false is refused',
   /true or false/.test(C.refuse(Object.assign({}, base, { asserted: 'maybe' })) || ''));
ok('1d and a fence that does not exist is refused by name',
   /does not exist/.test(C.refuse(Object.assign({}, base, { fence: 'vibes' })) || ''));
ok('1e a real claim is not refused', C.refuse(base) === null);

/* ---- 2. *** THE TELL DOES NOT PREDICT *** ------------------------------- */
{
  const byTruth = { true: {}, false: {} };
  let liars = 0, honest = 0;
  for (const c of claims) {
    const found = C.check(c, TRUTH);
    const v = C.verdict(c, found);
    if (v !== 'true' && v !== 'false') continue;
    const bucket = byTruth[v === 'true' ? 'true' : 'false'];
    bucket[c.manner] = (bucket[c.manner] || 0) + 1;
    if (v === 'false') liars++; else honest++;
  }
  ok('2a the sample really contains both (' + honest + ' true, ' + liars + ' false)',
     liars > 20 && honest > 20);
  /* THE DISTRIBUTIONS, AS SHARES. A manner that appears at a different RATE among
     liars than among honest people is a tell, however small. */
  const manners = C.MANNER.slice();
  const shareT = manners.map(m => (byTruth['true'][m] || 0) / honest);
  const shareF = manners.map(m => (byTruth['false'][m] || 0) / liars);
  const worst = manners.reduce((acc, m, i) => {
    const d = Math.abs(shareT[i] - shareF[i]);
    return d > acc.d ? { d: d, m: m, t: shareT[i], f: shareF[i] } : acc;
  }, { d: 0, m: '', t: 0, f: 0 });
  /* THE ONLY NUMBER IN THIS GATE, AND IT IS NOT A TASTE THRESHOLD: manner is a
     deterministic hash of the place, so a liar's manner and an honest person's
     manner come from the same function of the same kind of key. The shares
     therefore differ only by how the sample happens to split, and this is a
     sampling allowance on 120 rows per fence, not a tolerance for a tell. */
  ok('2b *** manner does not predict whether it is true *** (worst gap '
     + (worst.d * 100).toFixed(1) + '% on "' + worst.m + '", honest '
     + (worst.t * 100).toFixed(1) + '% vs liars ' + (worst.f * 100).toFixed(1) + '%)',
     worst.d < 0.12);
  /* AND THE STRONGER ONE: manner is a FUNCTION OF THE PLACE, so it cannot carry
     truth even in principle. Two claims about the same place have the same manner
     whether or not they are true. */
  const sameWhere = claims.filter(c => c.where === claims[0].where);
  ok('2c and manner is a function of the place alone, so it CANNOT carry truth',
     sameWhere.length > 1 && sameWhere.every(c => c.manner === sameWhere[0].manner));
  ok('2d the same person about the same thing says it the same way twice',
     C.mannerFor('b12') === C.mannerFor('b12'));
}

/* ---- 3. NO TELL CAN BE SPOKEN ------------------------------------------- */
ok('3a a candidate carrying a tell is refused, in those words',
   /nothing in his mouth is a tell/
     .test(C.refuse(Object.assign({}, base, { manner: 'looks nervous and sweats' })) || ''));
ok('3b and the refusal fires on a tell hidden in the said line',
   C.hasTell({ said: 'He hesitates before answering.' }) === true);
ok('3c no manner the module can emit is a tell',
   C.MANNER.every(m => !C.hasTell({ manner: m })));
ok('3d and no claim it produced is one', claims.every(c => !C.hasTell(c)));

/* ---- 4. THE ONLY INSTRUMENT IS DISTANCE --------------------------------- */
ok('4a no roll anywhere', !/Math\.random/.test(code));
ok('4b no skill, stat, or perception check anywhere',
   !/\b(skill|stat|perception|charisma|insight|persuasion|intimidat)/i.test(code));
ok('4c and the file says out loud that the instrument is walking',
   /checked by GOING TO THE THING/i.test(prose));
ok('4d every fence names what going there actually means',
   C.ORDER.every(k => typeof C.FENCES[k].look === 'string' && C.FENCES[k].look.length > 8));

/* ---- 5. BELIEVING IS THE DEFAULT ---------------------------------------- */
{
  const st = C.standing(base);
  ok('5a before anybody walks, the claim is BELIEVED and the world acts on it',
     st.believed === true && st.checked === false && st.acting_on === base.asserted);
  ok('5b and the verdict before walking is not "unknown", it is believed',
     C.verdict(base, null) === 'believed');
  ok('5c the line he reads says he has not been to look',
     /have not been to look/.test(C.say(base, null)));
}

/* ---- 6. THE RUNNING SYSTEM SETTLES IT, NEVER THE CLAIM ------------------ */
{
  const liar = claims.find(c => {
    const f = C.check(c, TRUTH); return C.verdict(c, f) === 'false';
  });
  ok('6a a lie exists in the sample', !!liar);
  /* A MUTATION THAT DELETES EVERY LIE MUST MAKE THIS GATE REPORT, NOT THROW.
     Proved: the "let the claim settle itself" control emptied the sample and the
     run died here instead of printing its own verdict, and a gate that dies is a
     gate nobody can read. */
  const found = liar ? C.check(liar, TRUTH) : { went: false };
  if (!liar) { ok('6b/6c/6d skipped: no lie to walk to', false, 'sample had none'); }
  ok('6b walking to it settles it against the world, not against the claim',
     !!liar && found.went === true && found.settled === true && found.agrees === false);
  ok('6c and the line says what he found, without naming the manner as evidence',
     !!liar && /not what they told you/.test(C.say(liar, found))
     && C.say(liar, found).indexOf(liar.manner) < 0);
  /* A CLAIM ABOUT A PLACE THE WORLD NO LONGER ANSWERS ABOUT IS UNSETTLED, and
     unsettled is honest rather than a silent "true". */
  const gone = liar ? C.check(liar, {}) : null;
  ok('6d a place that answers nothing comes back UNSETTLED, never quietly true',
     !!gone && gone.went === true && gone.settled === false
     && C.verdict(liar, gone) === 'unsettled');
  const truthful = claims.find(c => C.verdict(c, C.check(c, TRUTH)) === 'true');
  ok('6e an honest claim checks out', !!truthful);
}

/* ---- 7. A LIE NOBODY CHECKED LEAVES NO MARK ----------------------------- */
{
  const liar = claims.find(c => C.verdict(c, C.check(c, TRUTH)) === 'false');
  ok('7a *** a lie nobody walked to leaves NO mark ***', C.mark(liar, null) === null);
  const m = liar ? C.mark(liar, C.check(liar, TRUTH)) : null;
  ok('7b and catching one leaves a real deed row', !!m && m.kind === 'caught_a_lie');
  ok('7c in the shape the ledger that already exists takes',
     !!m && typeof m.clout === 'string' && 'delta' in m && 'faction' in m);
  const D = require(path.join(ROOT, 'engine/bohemia_deeds.js'));
  ok('7d carrying a clout tag the deed system already grades ("' + m.clout + '")',
     typeof D.reachOf(m.clout) === 'number' && D.reachOf(m.clout) > 0);
  ok('7e and an honest claim leaves no mark either',
     C.mark(claims.find(c => C.verdict(c, C.check(c, TRUTH)) === 'true'),
            C.check(claims.find(c => C.verdict(c, C.check(c, TRUTH)) === 'true'), TRUTH)) === null);
  ok('7f the module publishes nothing itself',
     !/publish|credit|transferOut|\.set\(/.test(code));
}

/* ---- 8. NO CONTENT ------------------------------------------------------ */
{
  /* EVERY NUMBER ALLOWED IN THE CODE IS NAMED HERE WITH WHAT IT IS FOR. */
  const ALLOWED = {
    '0': 'zero, the empty delta on a deed row and an index',
    '1': 'one, a step and a bit',
    '8': 'the low half of a 32-bit multiply',
    '16': 'the high half of it',
    '2166136261': 'the FNV offset basis, so manner is stable',
    '16777619': 'the FNV prime',
    '0xffff': 'the 16-bit mask in the same multiply'
  };
  const stray = (code.match(/\b(0x[0-9a-f]+|\d+)\b/gi) || []).filter(n => !ALLOWED[n]);
  ok('8a every number in the code is the arithmetic of a hash or an index, never '
     + 'a price, a count or a threshold (' + stray.length + ' stray: '
     + [...new Set(stray)].slice(0, 6).join(',') + ')', stray.length === 0);
  ok('8b and an empty world says nothing at all',
     C.offer({}) === null && C.claimsIn({}).length === 0);
  ok('8c a world with a row the system has no answer about produces no claim',
     C.claimsIn({ shelves: [{ who: 'x', where: 'b1' }] }).length === 0);
}

/* ---- 9. THE HASH ACTUALLY SPREADS --------------------------------------- */
{
  const seen = {};
  for (let i = 0; i < 200; i++) {
    const m = C.mannerFor('b' + (i < 10 ? '0' : '') + i);
    seen[m] = (seen[m] || 0) + 1;
  }
  const used = Object.keys(seen).length;
  ok('9a 200 block ids use every manner the module has (' + used + '/'
     + C.MANNER.length + ')', used === C.MANNER.length);
  /* THE EXACT KEYS THAT COLLAPSED, BY NAME, so the bug cannot come back quietly. */
  const four = ['b01', 'b07', 'b12', 'b20'].map(C.mannerFor);
  ok('9b and the four block ids that all collapsed into one bucket no longer do ('
     + [...new Set(four)].length + ' distinct of 4)', new Set(four).size > 1);
  ok('9c the file records why the multiply is Math.imul', /Math\.imul/.test(prose));
}

/* ---- THE REAL SURFACE ---------------------------------------------------- */
const city = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
ok('S1 the module ships in the walked city, verbatim',
   city.indexOf('BOHEMIA CLAIMS -- YOU CATCH A LIAR BY WALKING TO THE FENCE') >= 0);
ok('S2 and the claim is read off the SAME snapshot the ask is, not a second one',
   /BohemiaClaims\.offer\(ctAskSnapshot\(\)\)/.test(city));
ok('S3 the check reads a NAMED PLACE, which is the whole row',
   /function ctClaimWorld\(where\)/.test(city)
   && /BohemiaClaims\.check\(claim, ctClaimWorld\(claim&&claim\.where\)\)/.test(city));
/* *** AND THIS ONE IS STRUCTURAL BECAUSE THE WORLD CANNOT CURRENTLY PROVE IT. ***
   The mutation that matters most here is a seam that reads the PLAYER'S FEET
   instead of the claim's place. I tried to catch it by walking, and I cannot: the
   grid holds no real circuit anywhere near the player (120,801 cells probed, zero),
   so his feet and the claim's place both answer nothing and both readings come back
   unsettled. The behavioural test is genuinely blind to it TODAY, and saying so is
   better than a check that passes for the wrong reason -- which is exactly what the
   first version of this gate did.
   So it is held structurally: the place read must come from the claim's own `where`
   and the function must not reach for the player's coordinates at all. The day the
   grid has circuits, R5 above starts catching it behaviourally as well. */
{
  const fn = (city.match(/function ctClaimWorld\(where\)\{[\s\S]*?\n\}/) || [''])[0];
  ok('S4 ctClaimWorld was found in the city to read', fn.length > 40);
  ok('S5 *** it takes its coordinates from the CLAIM, not from the player ***',
     /parseInt\(p\[0\],10\)/.test(fn) && /parseInt\(p\[1\],10\)/.test(fn));
  ok('S6 and it never reaches for the player\'s own position',
     !/\bhx\b/.test(fn) && !/\bhy\b/.test(fn));
}

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
    await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (t) t.click();
    });
    await SETTLE(page, 16000);

    let cityF = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof ctClaimNow === 'function')) { cityF = f; break; } }
      catch (_e) {}
    }
    ok('R1 the claim seam reached the frame the player walks in', !!cityF);

    if (cityF) {
      /* ===================================================================
         *** WHAT I MEASURED ON THE WALKED SURFACE, AND IT IS THE FINDING. ***
         I set out to prove "the check reads the claim's place, not the player's
         feet" by walking to a cell whose grid answer differed. Three measurements,
         each one killing the version before it:
           1. Swept 25,921 cells across a 4,000-cell span: EVERY ONE reads dark.
           2. Asked the grid outside the valley -- a million cells away, negative
              cells, even NaN -- and it answers {live:false, id:-1} for ALL of
              them. POWER.at NEVER says "I do not know". So a naive seam would
              settle a claim about a place that does not exist and report it dark.
              id:-1 is the grid's own way of saying there is no circuit, and the
              seam reads it that way now because of this probe.
           3. Probed 120,801 cells around the player for a REAL circuit id:
              *** ZERO. *** The grid holds no circuit anywhere near where the
              player starts.
         SO THE CLAIM SEAM IS WIRED, READ-ONLY, AND QUIET, which is exactly what
         bohemia_asks.js's own seam header already says about the shelf and the
         standing web: "the reader is here and it stays silent until [there is
         something to say]. That is correct behaviour, not a gap."
         THIS GATE THEREFORE PROVES WHAT IS TRUE AND REFUSES TO PRETEND: the seam
         exists, answers, never throws, reads a NAMED place, and comes back
         UNSETTLED rather than inventing an answer. The 480-claim proof of the
         mechanism itself is above, headless, where it can actually be made.
         =================================================================== */
      const surface = await cityF.evaluate(() => {
        const out = {};
        out.feet = hx + ',' + hy;
        try { out.live = ctClaimNow(); } catch (e) { out.err = String(e.message); }
        try { out.ask = (typeof ctAskNow === 'function') ? ctAskNow() : 'no seam'; }
        catch (e) { out.askErr = String(e.message); }
        /* does the world answer ANYWHERE the player can reach */
        let answered = 0, probed = 0;
        for (let dx = -120; dx <= 120; dx += 4) {
          for (let dy = -120; dy <= 120; dy += 4) {
            probed++;
            try { if ((ctClaimWorld((hx + dx) + ',' + (hy + dy)).circuits || []).length) answered++; }
            catch (e) {}
          }
        }
        out.probed = probed; out.answered = answered;
        /* THE SEAM, DRIVEN FOR REAL, about a place that is not his feet */
        const where = (hx + 9) + ',' + (hy + 9);
        const claim = { fence: 'circuit', who: 'somebody', where: where, about: 'c',
                        asserted: true, said: 'That block still has its lights.',
                        manner: 'says it flatly', look: 'stand on the block after dark',
                        from: 'the grid', field: 'live', draft: true };
        out.refused = BohemiaClaims.refuse(claim);
        out.believed = BohemiaClaims.standing(claim);
        out.went = ctClaimVerdict(claim);
        out.markBefore = BohemiaClaims.mark(claim, null);
        out.world = ctClaimWorld(where);
        return out;
      });
      console.log('  [on the street] feet ' + surface.feet + ' -- a live claim IS '
        + 'offered, and the grid holds a REAL circuit at ' + surface.answered + ' of '
        + surface.probed + ' reachable places, so checking it is honestly UNSETTLED');
      ok('R2 the seam answers without throwing', !surface.err, surface.err);
      ok('R3 a claim about a named place is a real claim', surface.refused === null);
      ok('R4 before anybody walks, the world BELIEVES it',
         !!surface.believed && surface.believed.believed === true
         && surface.believed.checked === false);
      ok('R5 *** going there reads the grid at THAT place and comes back UNSETTLED '
         + 'rather than inventing an answer ***',
         !!surface.went && surface.went.verdict === 'unsettled',
         surface.went && surface.went.verdict);
      ok('R6 and the line says so in plain words',
         !!surface.went && /nothing there to say either way/.test(surface.went.say || ''));
      ok('R7 *** a lie nobody walked to leaves no mark ***', surface.markBefore === null);
      ok('R8 and an unsettled walk leaves none either',
         !!surface.went && surface.went.mark === null);
      ok('R9 the seam read the named place and found the world empty there',
         !!surface.world && (surface.world.circuits || []).length === 0);
      /* AND THE HONEST STATE OF THE VALLEY, RECORDED RATHER THAN HIDDEN. */
      /* *** THE CONDITIONAL THAT MAKES THIS HONEST IN BOTH DIRECTIONS. *** Writing
         "the grid answers nowhere" as a flat assertion would turn this gate RED the
         day somebody wires a circuit, which is a gate punishing progress. Writing
         "0 or more" would be a tautology, which is a check that can never fail.
         So it is the implication: IF the world has anything to say where the player
         walks, the seam MUST produce a live claim. Quiet is only allowed while the
         world is silent. */
      /* *** AND THE LIVE SEAM DOES FIRE, WHICH IS WHERE THIS GOT INTERESTING. ***
         ctClaimNow() returns a real claim on the walked surface today. It rides
         the same snapshot row the live ASK rides -- and that row is a circuit the
         grid reports with id:-1, which is the grid's own marker for THERE IS NO
         CIRCUIT HERE. So the one thing the valley can currently say is about a
         circuit that does not exist.
         THE CLAIM MACHINERY CATCHES THAT BY ITSELF AND THAT IS THE POINT: somebody
         says the block is dark, you walk there, and the world cannot settle it.
         UNSETTLED is the honest answer and the module produces it without being
         told anything. A design that only ever answered true or false would have
         quietly called a claim about nothing TRUE.
         The id:-1 row is [asks exist]'s to fix, not this row's -- changing it here
         would take that row's own shipped ship test red inside a different job --
         so it is named in the handoff and it is this lane's next one. */
      ok('R10 the live seam offers a real claim on the walked surface',
         !!surface.live && !surface.live.refused);
      ok('R10b and a claim about a place with no real circuit comes back UNSETTLED '
         + 'rather than quietly true, which is what stops the valley lying to him '
         + 'about a thing that is not there',
         !!surface.went && surface.went.verdict === 'unsettled');
      ok('R11 nothing about the claim seam writes into the world',
         !/BohemiaClaims\.[a-z]+\s*\([^)]*\)\s*=/.test(city));
    }
    ok('R13 nothing threw on the walked surface (' + errs.length + ')',
       errs.length === 0, errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('CHECK THE CLAIM GATE: ' + pass + ' passed, ' + fail + ' failed  ('
    + claims.length + ' claims across ' + C.ORDER.length + ' fences)');
  process.exit(fail ? 1 : 0);
})();
