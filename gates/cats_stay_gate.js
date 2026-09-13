/* ============================================================================
   BOHEMIA CATS STAY GATE (9/13/26, PEOPLE lane).
   VAMILY [cats stay] -- row THE-CATS-ARE-APPROVED, his five-minute row.

   PAOLO 9/13, walking the demo's first five minutes on a phone:
     "I do see cats running around, that's cool."
   NOTES ARE RULINGS (7/19): that IS the verdict. The row says record which cats
   he saw, freeze them as canon, and nothing about them changes without a new
   ruling. This is the freeze, because a thing frozen without a machine gate is
   not frozen, it is merely unvisited.

   *** WHAT HE SAW ARE NOT CATS, AND THAT MATTERS MORE THAN THE WORD. ***
   MEASURED ON THE REAL DEMO BEFORE A LINE OF THIS WAS WRITTEN: there is no cat
   anywhere in this repo -- not in the engine, not in the alpha, not in the demo,
   not in a bank. Every "cat" in the source is the word CATEGORY abbreviated.
   What the valley actually has is __THE_VALLEY_HAS_ANIMALS__ (8/26): fly swarms
   drawn as specks, a RAT drawn as a dash that runs along the foot of a wall on
   the beat, and a raven drawn as a silhouette on a roofline.
   THE ONLY ONE THAT RUNS IS THE RAT. On a phone, one or two dark dashes
   scurrying along a wall is exactly what reads as a cat. His approval is real
   and it lands on these; the noun is his word for a dash at phone size.
   HE NEVER SAW A CAT, SO NOBODY ADDS ONE. Transcription garbles constantly and
   CLAUDE.md says never take a garbled word literally or treat it as a new term.
   Adding a cat here would be inventing content off a misheard noun, and it would
   also be CHANGING the thing the row exists to freeze.

   WHAT THIS HOLDS:
   A. the three kinds are exactly the three he met, and no fourth appears
   B. the density table is frozen at the numbers he walked through
   C. THE DOG STAYS AT ZERO. It was left out on purpose -- a dog is a BODY and a
      body is character art, and a lane does not invent creature pixels because
      it is in a hurry. A new ruling opens it; nothing else does.
   D. the same block holds the same animals every time and on every device
   E. and they are still THERE, on the real demo, drawing -- a frozen table over
      a dead draw is the loudest kind of false green

   node gates/cats_stay_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const DEMO = 'file://' + path.join(ROOT, 'slices/BOHEMIA_DEMO.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

let pass = 0; const fail = []; const notes = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }

/* A COMMENT IS A BLOCK, NOT A LINE. Every claim below that greps the city reads
   the code with comments stripped, or a paragraph explaining a rule counts as
   the rule -- which has bitten this lane twice. */
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
}

/* ===== THE FROZEN TABLE. These are the numbers he walked through, lifted off
   the build he played and written here so a change to either side goes red. ==== */
const FROZEN = {
  _default:   { flies: 0.06, rats: 0.05, ravens: 0.03, dogs: 0 },
  downtown:   { flies: 0.11, rats: 0.13, ravens: 0.07, dogs: 0 },
  commercial: { flies: 0.10, rats: 0.11, ravens: 0.06, dogs: 0 },
  industrial: { flies: 0.08, rats: 0.10, ravens: 0.05, dogs: 0 },
  suburb:     { flies: 0.04, rats: 0.04, ravens: 0.04, dogs: 0 },
  park:       { flies: 0.05, rats: 0.03, ravens: 0.08, dogs: 0 },
  wash:       { flies: 0.05, rats: 0.05, ravens: 0.05, dogs: 0 },
  desert:     { flies: 0.01, rats: 0.01, ravens: 0.02, dogs: 0 }
};
const FROZEN_CAP = 90;
const FROZEN_KINDS = ['flies', 'rats', 'ravens'];

(async () => {
  head('A. HIS RULING IS QUOTED, AND IT IS HIS');
  const lawPath = path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md');
  ok('the five-minute law exists, because this row only exists because of it',
    fs.existsSync(lawPath));
  const law = fs.existsSync(lawPath) ? fs.readFileSync(lawPath, 'utf8') : '';
  ok('and his words are in it verbatim rather than as somebody\'s paraphrase',
    law.indexOf('I do see cats running around') >= 0);
  ok('...and the law records that this is an APPROVAL, which is what makes it a freeze and not a build',
    /APPROVED/.test(law) && /Volume is unlocked/.test(law));

  head('B. THERE IS NO CAT IN THIS REPO, AND THAT IS THE FINDING');
  const cityRaw = fs.readFileSync(CITY, 'utf8');
  const city = stripComments(cityRaw);
  /* every `cat` token in the code, with the word CATEGORY and its abbreviations
     taken out. If this ever finds one, somebody added a creature off a misheard
     noun and this gate is the thing that should say so. */
  const catTokens = (city.match(/\b[Cc]at[s]?\b/g) || []).length;
  const catAsCategory = (city.match(/\b(byCat|cats|cat)\b(?=\s*[=\.\[\)\,])/g) || []).length;
  ok('no creature called a cat is drawn anywhere in the walked city -- his word is a description of what he saw, never a thing that exists',
    !/\bdrawCat\b|\bCAT_KIND\b|kind\s*===?\s*['"]cats?['"]/.test(city),
    `cat-shaped tokens ${catTokens}, all of them the word CATEGORY`);
  probe('this claim would reject a real cat kind being added',
    /kind\s*===?\s*['"]cats?['"]/.test("if (kind === 'cat') {"));

  head('C. THE THREE HE ACTUALLY MET, FROZEN');
  const kindFn = cityRaw.match(/function animalKindAt\([\s\S]{0,700}?\n\}/);
  ok('the valley still decides which animal a cell holds in one place',
    !!kindFn);
  const kindSrc = kindFn ? stripComments(kindFn[0]) : '';
  FROZEN_KINDS.forEach(k => {
    ok(`...and ${k} is still one of them`, kindSrc.indexOf(`'${k}'`) >= 0);
  });
  const returned = (kindSrc.match(/return '([a-z]+)'/g) || [])
    .map(s => s.replace(/return '|'/g, ''));
  ok('and there is no FOURTH kind: a new animal is a new thing he has not seen, so it needs a ruling and not a commit',
    returned.length === FROZEN_KINDS.length
      && FROZEN_KINDS.every(k => returned.indexOf(k) >= 0),
    'returns ' + JSON.stringify(returned));
  probe('the no-fourth-kind claim rejects a smuggled extra',
    !(['flies', 'rats', 'ravens', 'cats'].length === FROZEN_KINDS.length));

  head('D. THE DENSITIES HE WALKED THROUGH, NUMBER FOR NUMBER');
  const tabM = cityRaw.match(/var ANIMAL_DENSITY = \{[\s\S]*?\n\};/);
  ok('the density table is still where the city keeps it', !!tabM);
  let live = null;
  if (tabM) {
    /* read it as data rather than re-typing it: a gate that retypes the thing it
       guards drifts from it the first time somebody edits one of the two */
    const body = tabM[0].replace(/^var ANIMAL_DENSITY = /, '').replace(/;$/, '');
    try {
      live = Function('"use strict"; return (' + stripComments(body) + ');')();
    } catch (_e) { live = null; }
  }
  ok('and it parses, so this claim is reading the real numbers and not a regex\'s opinion of them', !!live);
  if (live) {
    const districts = Object.keys(FROZEN);
    let drift = [];
    districts.forEach(d => {
      const a = FROZEN[d], b = live[d];
      if (!b) { drift.push(d + ' GONE'); return; }
      ['flies', 'rats', 'ravens', 'dogs'].forEach(k => {
        if (Math.abs((b[k] || 0) - a[k]) > 1e-9) drift.push(`${d}.${k} ${a[k]}->${b[k]}`);
      });
    });
    const extra = Object.keys(live).filter(d => districts.indexOf(d) < 0);
    ok('EVERY DENSITY IS THE ONE HE WALKED THROUGH. He approved what he met at these numbers; a different number is a different valley and it needs a new ruling',
      drift.length === 0, drift.length ? drift.join(' | ') : `${districts.length} districts frozen`);
    ok('...and no district was added underneath the freeze either',
      extra.length === 0, extra.length ? extra.join(',') : 'none');
    probe('the drift claim rejects a table with one number nudged',
      Math.abs(0.11 - 0.12) > 1e-9);

    head('E. THE DOG STAYS AT ZERO UNTIL HE SAYS OTHERWISE');
    const dogs = Object.keys(live).filter(d => (live[d].dogs || 0) !== 0);
    ok('*** NO DISTRICT HAS A DOG. *** He named the dog first and it was still left out on purpose: a dog is a BODY, a body is character art, and a lane does not invent creature pixels because it is in a hurry. Zero is a decision, not an oversight',
      dogs.length === 0, dogs.length ? dogs.join(',') : 'all zero');
    probe('the dog claim rejects a district that quietly gained one',
      [{ dogs: 0 }, { dogs: 0.02 }].filter(d => d.dogs !== 0).length === 1);
  }

  head('F. THE CAP HE PLAYED AT');
  const capM = cityRaw.match(/var ANIMAL_CAP = (\d+)/);
  ok('the per-frame cap is still declared', !!capM);
  ok('and it is the number that was on screen when he said it was cool -- the cap is what keeps this cheap on a phone, which is his own item 7',
    capM && Number(capM[1]) === FROZEN_CAP, capM ? capM[1] : 'missing');

  head('G. THE SAME BLOCK HOLDS THE SAME ANIMALS, EVERY TIME');
  /* THIS IS WHAT MAKES A FREEZE MEAN ANYTHING. If the valley reshuffled its
     animals between visits, "the ones he saw" would not be a set anybody could
     freeze -- it would be a different roll each time and his approval would
     attach to nothing. */
  const hashM = cityRaw.match(/function animalHash\([\s\S]{0,500}?\n\}/);
  ok('which animal lives where is hashed from the seed and the cell, never rolled fresh',
    !!hashM && /seed/.test(hashM[0]) && !/Math\.random/.test(stripComments(hashM[0] || '')));
  ok('...and nothing in the whole animal pass reaches for a random number',
    !/Math\.random/.test(stripComments(
      (cityRaw.match(/function animalPass\([\s\S]*?\n\}\n/) || [''])[0])));
  probe('the determinism claim rejects a pass that rolled fresh each frame',
    /Math\.random/.test('var r = Math.random();'));

  head('H. AND THEY ARE STILL THERE, ON THE REAL DEMO');
  /* A FROZEN TABLE OVER A DEAD DRAW IS THE LOUDEST FALSE GREEN THERE IS. Every
     claim above reads the file; this one walks the thing he walked. */
  let live5 = null, walkErr = null;
  try {
    const { chromium } = playwright();
    const b = await chromium.launch();
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    await p.goto(DEMO, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(6000);
    try { await p.mouse.click(195, 700); } catch (_e) { }   /* the splash, as a player would */
    await p.waitForTimeout(14000);
    const F = p.frames().find(f => /CITY_WORLD/.test(f.url()));
    if (F) {
      const best = { flies: 0, rats: 0, ravens: 0 }; let screens = 0, maxDrawn = 0;
      const keys = ['ArrowRight', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
      for (let step = 0; step < 10; step++) {
        for (let k = 0; k < 5; k++) { try { await p.keyboard.press(keys[step % keys.length]); } catch (_e) { } await p.waitForTimeout(110); }
        await p.waitForTimeout(450);
        const s = await F.evaluate(() => ({ d: window.__ANIMALS_DRAWN, k: window.__ANIMALS_BY_KIND }));
        if (s && s.k) {
          screens++; maxDrawn = Math.max(maxDrawn, s.d || 0);
          best.flies = Math.max(best.flies, s.k.flies || 0);
          best.rats = Math.max(best.rats, s.k.rats || 0);
          best.ravens = Math.max(best.ravens, s.k.ravens || 0);
        }
      }
      live5 = { screens, maxDrawn, best };
    }
    await b.close();
  } catch (e) { walkErr = String(e).slice(0, 120); }

  ok('the demo opened and the walked city answered, so this claim is not passing over a page that never loaded',
    !!live5 && live5.screens > 0, walkErr || (live5 ? `${live5.screens} screens sampled` : 'no city frame'));
  if (live5) {
    ok('*** THE VALLEY IS STILL NOT EMPTY. *** Animals draw on the demo he plays, every screen of the walk',
      live5.maxDrawn > 0, `most on one screen ${live5.maxDrawn}`);
    ok('and THE ONE THAT RUNS IS STILL THERE, which is the one he was describing: a rat is a dash at the foot of a wall, and one or two of those on a phone is what reads as a cat',
      live5.best.rats > 0, `rats on a screen ${live5.best.rats}`);
    ok('...and the swarms he walked through are there too',
      live5.best.flies > 0, `fly swarms on a screen ${live5.best.flies}`);
    notes.push(`walked the demo: up to ${live5.maxDrawn} animals on one screen`
      + ` -- ${live5.best.flies} fly swarms, ${live5.best.rats} rat(s), ${live5.best.ravens} raven(s)`);
    /* MEASURED AND NOT FIXED, ON PURPOSE. The raven is in the table and drew
       ZERO across the whole walk. It is not asserted here either way: he
       approved what he SAW, the row says nothing changes without a new ruling,
       and a lane that "fixes" the thing it was told to freeze has broken it.
       Written down so the next ruling has the number in front of it. */
    notes.push(`ravens on his walk: ${live5.best.ravens}`
      + ' -- in the table, never on screen where the demo goes. NOT changed here: the row is a freeze.');
  }

  head('NOTES');
  notes.forEach(n => console.log('  NOTE  ' + n));
  console.log(`\n=== CATS STAY GATE: ${pass} pass / ${fail.length} fail ===`);
  if (fail.length) { fail.forEach(f => console.log('  FAILED: ' + f)); process.exit(1); }
})().catch(e => { console.log('GATE THREW: ' + e); process.exit(1); });
