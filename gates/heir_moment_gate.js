/* ============================================================================
   BOHEMIA HEIR MOMENT (9/18/26, PEOPLE lane).
   VAMILY [heir moment], row SUCCESSION-BEAT.

   THE ROW, decided by the coordinator 9/5 (correct-after): "an heir inherits the
   house, the purse, every debt in full, half the standing, and the wardrobe.
   WHO YOU CAN MARRY stays Paolo's (identity)."

   *** MEASURED FIRST, AND FOUR OF THE FIVE WERE ALREADY BUILT BY SOMEBODY. ***
     the house     WORLD [fold carries], 9/16: kept if lit, lost if dark
     the debt      WORLD [debt carried], 9/12, and it REVERSES this row: the bill
                   DIES and the people stay. Newer, and what DYNASTY's research
                   sharpened, so "every debt in full" is superseded, not built
     the standing  inherit(), and better than "half": only what was RETOLD
                   survives, and what a dead eyewitness alone knew dies with them
     the purse     crosses whole, measured 9 before and 9 after
   SO WHAT WAS MISSING WAS NOT AN ACCOUNT, IT WAS THE BEAT. Three finished things
   sat in the played file with NOBODY CALLING THEM:
     famAge()      zero callers. The fold advanced the generation and NOT ONE
                   PERSON AGED, so the game handed a hundred years to a newborn
                   and the heir was a child for ever.
     HEIR_TOOK     written at the fold and read by NOTHING: its lines were
                   composed, thrown away, and recomputed next time.
     famHeirSay()  read in exactly one place, a card, pinned at generation 1, so
                   after a fold it went on naming the heir of a life that had
                   already been handed over.

   NOT ONE NUMBER IS NEW. The handoff is canon and already an executable
   constant, BohemiaStayed.HANDOFF.years. And nobody dies: agePeople does not
   kill, and WHEN somebody dies of old age is a magnitude the family module is
   deliberately parked on until Paolo rules it.

   ON THE GLASS: children go newborn -> adult across the fold, and the card he
   already opens says YOU ARE YOUR FIRSTBORN while WHO INHERITS says YOUR SECOND.
   Two different people, two different questions.

   WHAT THIS HOLDS:
   A. the three dead things have exactly one caller each, and it is the fold
   B. no number is typed, no fallback is invented, and nobody dies
   C. on the demo: the control, the ageing, the beat, and two different answers

   node gates/heir_moment_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const REC = path.join(ROOT, 'records/BOHEMIA_HEIR_MOMENT_9_18_26.txt');
const DRIVE = path.join(ROOT, 'tools/bohemia_drive_the_demo.js');

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
function note(t, v) { notes.push('  NOTE  ' + t + (v == null ? '' : '   ' + v)); }
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
}
function flat(s) { return String(s).replace(/\s+/g, ' '); }
/* THE BODY, BRACE-BALANCED. A fixed window after a name ran past the end of a
   function two rounds ago and matched the line underneath, leaving a claim green
   with the feature unplugged. */
function bodyOf(src, name) {
  const i = src.indexOf('function ' + name);
  if (i < 0) return '';
  let j = src.indexOf('{', i), d = 0;
  for (let k = j; k < src.length; k++) {
    if (src[k] === '{') d++;
    else if (src[k] === '}') { d--; if (!d) return src.slice(j, k + 1); }
  }
  return '';
}

(async () => {

  /* ======================================================================== */
  head('A. THREE FINISHED THINGS THAT NOTHING CALLED, AND THE FOLD CALLS THEM');
  /* ======================================================================== */
  const city = fs.readFileSync(CITY, 'utf8');
  const ccode = stripComments(city);
  const fold = bodyOf(ccode, 'ctFold');
  probe('the body reader found the fold and it is the real one',
        fold.length > 2000 && fold.indexOf('BohemiaStanding.inherit') >= 0);

  /* *** THE FOLD HANDED A HUNDRED YEARS TO A NEWBORN. *** famAge existed, was
     finished, and had zero callers, with its own comment naming where it
     belonged: "the fold hands it the canon ~30". */
  ok('*** THE FAMILY AGES AT THE FOLD ***, so the life is not handed to somebody '
     + 'who never grew up', fold.indexOf('famAge(') >= 0);
  const agers = (ccode.match(/\bfamAge\s*\(/g) || []).length;
  ok('and the fold is the ONLY caller, apart from the definition', agers === 2,
     agers + ' occurrence(s): one definition, one call');

  /* HEIR_TOOK WAS WRITTEN AT THE FOLD AND READ BY NOTHING. */
  const readers = (ccode.match(/HEIR_TOOK/g) || []).length;
  ok('what the handover took is READ by something now, not computed and thrown '
     + 'away every fold', readers >= 4, readers + ' mentions of HEIR_TOOK');
  ok('and its own lines are what gets printed, never a second set written here',
     /HEIR_TOOK\s*&&\s*HEIR_TOOK\.lines/.test(ccode));

  /* THE CARD ASKED A PINNED GENERATION 1. */
  ok('the card asks who inherits IN THE GENERATION HE IS IN, not a pinned first',
     !/famHeirSay\(1\)/.test(ccode) && /famHeirSay\(\s*\(typeof CT_GEN/.test(ccode));

  /* ======================================================================== */
  head('B. NO NUMBER IS TYPED, NO FALLBACK IS INVENTED, AND NOBODY DIES');
  /* ======================================================================== */
  /* THE HANDOFF IS CANON AND ALREADY AN EXECUTABLE CONSTANT. Typing 30 here
     would be a second copy of a canon number, which is the defect this lane has
     found in its own work four rounds running. */
  ok('the handoff length is READ from the canon constant, never typed',
     /BohemiaStayed\.HANDOFF\.years/.test(fold));
  ok('and there is no fallback number, so a missing canon means nobody ages '
     + 'rather than a quiet thirty nobody can trace',
     !/famAge\(\s*\d+\s*\)/.test(fold) && /_sy \? famAge/.test(fold));
  /* NOBODY DIES. agePeople does not kill, and when somebody dies of old age is a
     magnitude the family module is parked on until he rules it. */
  ok('nothing at the fold kills anybody, because when a person dies of age is a '
     + 'ruling nobody has made', !/alive\s*=\s*false/.test(fold));

  /* ======================================================================== */
  head('C. ON THE DEMO: THE CONTROL, THE AGEING, AND THE BEAT');
  /* ======================================================================== */
  let drove = false;
  try {
    const { open } = require(DRIVE);
    const d = await open({});
    await d.clearCards();
    const fr = d.fr;
    drove = true;
    ok('the demo booted and the walked city answered', true,
       await fr.evaluate(() => (typeof ctFold === 'function') ? 'ok' : 'no fold'));

    const cardRows = () => fr.evaluate(() => {
      const o = []; document.querySelectorAll('#daycardIn .rrow')
        .forEach(e => o.push((e.textContent || '').trim())); return o; });

    /* THE CONTROL: before any handover, the card says nothing about one. A row
       that appeared in generation one would be a caption, not a beat. */
    await fr.evaluate(() => showStanding());
    await fr.evaluate(() => new Promise(r => setTimeout(r, 250)));
    const before = await cardRows();
    ok('*** THE CONTROL: IN THE FIRST LIFE THE CARD SAYS NOTHING ABOUT A '
       + 'HANDOVER ***, so what appears below is the beat and not a caption that '
       + 'was always there',
       !before.some(r => /^YOU ARE/.test(r)) && !before.some(r => /YEARS SINCE/.test(r)),
       before.length + ' rows, none of them a handover');

    const f = await fr.evaluate(() => {
      famMarry(); famBorn(); famBorn();
      /* PUT SOMETHING IN THE PURSE FIRST. "0 before, 0 after" is true of an empty
         pocket whatever the fold does, which is a claim that cannot fail, and
         this gate would have shipped one. */
      try { BohemiaPurse.credit(purseGet(), 'resources', 9, 'heir gate', 'heir:1', 1); } catch (e) {}
      const kidsBefore = (BohemiaFamily.kidsOf(famTree()) || []).map(k => k.age);
      const aliveBefore = (famTree() || []).filter(n => n.alive).length;
      const purseBefore = BohemiaPurse.balance(purseGet(), 'resources');
      const genBefore = CT_GEN | 0;
      const res = ctFold();
      return { kidsBefore, aliveBefore, purseBefore, genBefore,
               kidsAfter: (BohemiaFamily.kidsOf(famTree()) || []).map(k => k.age),
               aliveAfter: (famTree() || []).filter(n => n.alive).length,
               purseAfter: BohemiaPurse.balance(purseGet(), 'resources'),
               gen: CT_GEN | 0, who: HEIR_WHO, aged: HEIR_AGED, years: HEIR_YEARS,
               carried: res && res.carried };
    });
    note('the children, before the fold', f.kidsBefore.join(', '));
    note('the children, after the fold', f.kidsAfter.join(', '));
    note('who he is now', f.who);
    note('the purse across the fold', f.purseBefore + ' -> ' + f.purseAfter);

    ok('*** THE CHILDREN GROW UP. *** Before this round the fold advanced a '
       + 'generation and left the heir a newborn for ever',
       f.kidsBefore.length > 0 && f.kidsBefore.every(a => a === 'newborn')
       && f.kidsAfter.every(a => a === 'adult'),
       f.kidsBefore.join('/') + ' -> ' + f.kidsAfter.join('/'));
    ok('and the years are the canon handoff, read off the constant',
       f.years === 30 && f.aged > 0,
       f.years + ' years, ' + f.aged + ' people moved an age band');
    ok('and NOBODY DIED at the fold', f.aliveAfter === f.aliveBefore,
       f.aliveBefore + ' alive before, ' + f.aliveAfter + ' after');
    ok('the purse crosses whole, which is what the row asks for, and there is '
       + 'really something in it so the claim can fail',
       f.purseBefore > 0 && f.purseAfter === f.purseBefore,
       f.purseBefore + ' -> ' + f.purseAfter);

    await fr.evaluate(() => showStanding());
    await fr.evaluate(() => new Promise(r => setTimeout(r, 250)));
    const after = await cardRows();
    const youAre = after.find(r => /^YOU ARE/.test(r)) || '';
    const inherits = after.find(r => /^WHO INHERITS/.test(r)) || '';
    ok('*** AND THE CARD HE ALREADY OPENS TELLS HIM WHO HE IS NOW. *** A '
       + 'generation turned and the only place it showed was a developer console',
       !!youAre && !/NOBODY NAMED/.test(youAre), youAre);
    ok('and it says how long ago the life changed hands',
       after.some(r => /YEARS SINCE/.test(r)),
       after.find(r => /YEARS SINCE/.test(r)) || 'nothing said');
    /* TWO DIFFERENT QUESTIONS. heirOf hashes the generation in, so who holds it
       now and who takes it next are different people, and a card printing one
       answer under two headings would be the same wrong answer twice. */
    ok('and WHO HE IS is a different question from WHO INHERITS AFTER HIM, which '
       + 'is why they are asked about different generations',
       !!youAre && !!inherits
       && youAre.replace(/^YOU ARE/, '') !== inherits.replace(/^WHO INHERITS/, ''),
       youAre + '   |   ' + inherits);

    ok('and nothing threw while any of it happened', d.errs.length === 0,
       'page errors ' + d.errs.length + (d.errs.length ? ': ' + d.errs[0] : ''));
    await d.close();
  } catch (e) {
    ok('the demo drive finished', false, e.message);
  }
  probe('the drive really ran, so a green above is not an empty pass', drove);

  /* ======================================================================== */
  head('D. THE RECORD SAYS WHAT WAS MEASURED');
  /* ======================================================================== */
  if (fs.existsSync(REC)) {
    const r = flat(fs.readFileSync(REC, 'utf8'));
    ok('the record keeps the row\'s own ruling', /an heir inherits the house/i.test(r));
    ok('and says which half of it was already built by somebody else',
       /fold carries|debt carried/i.test(r));
    ok('and names the three things that had no caller',
       /famAge/.test(r) && /HEIR_TOOK/.test(r) && /famHeirSay/.test(r));
  } else {
    ok('the record exists', false, REC);
  }

  notes.forEach(n => console.log(n));
  console.log('\n=== HEIR MOMENT: ' + pass + ' pass / ' + fail.length + ' fail ===');
  if (fail.length) { fail.forEach(f => console.log('   - ' + f)); process.exit(1); }
})();
