/* ============================================================================
   BOHEMIA BUBBLE FACE (9/24/26, PEOPLE lane).
   VAMILY [bubble face], row THE-FACE-IN-THE-BUBBLE-IS-HER.

   THE ROW, from QUESTS f403acc: "36 of 40 people carry a face index into the
   city's baked cast and the bubble ignores it, rolling a face out of a hash of
   the id... ONE ID, ONE WHOLE PERSON: the bubble draws the face the body carries."

   *** THE PICTURE WAS REAL AND THE CAUSE WAS NOT, AND IT WAS MEASURED ON THE
   *** ALPHA BEFORE A LINE WAS WRITTEN.

       people carrying `face`                    40 of 40, not 36
       the values `face` takes                   0 to 7
       entries in the baked cast                 11
       what the line that makes a person says    "face: r & 7,
                                                  // which of the 8 facings they idle in"

   IT IS A FACING. There is no face index to hand across, and the body carries no
   face either: the street draws a baked CLOTHING FIT picked by trade (longcoat,
   skirt, poncho) with no portrait in it. A field was read by its name.

   AND THE PORTRAIT WAS ALREADY DOING THE HARD PART. faceFor already dresses from
   BOH_PERSONLOOK with the canon garment pool, so the cut is a real per-person
   answer, not an unconstrained roll. (The first probe of THAT called a bare
   global `lookFor` and read `.hair` instead of `.worn.hair`, got null for
   everybody, and would have reported a dead system that is alive. Instrument
   first.)

   WHAT IS ACTUALLY WRONG IS SMALLER AND DEEPER: nothing in this game says who is
   a man and who is a woman. Not the person record, not the derived identity, not
   the name bank, not the face spec. The NAME is the only thing in that speech
   bubble that says "she", and nothing was listening to it.

   WHAT THIS HOLDS:
   A. the names Paolo approved are marked for what they read as, and the marking
      is checked against the bank itself so it cannot drift
   B. the city answers, because it is the only side that can turn an id into a
      person, and a name he has not earned steers nothing
   C. the shell narrows the POOL and never the pick, so every other dial is
      untouched and unmarked cuts stay open to everybody
   D. on the alpha: 10 faces contradicted their own name, now 0
   E. the face follows the name the moment it is earned
   F. the cook is in the VOTE tab and it is pixels

   node gates/bubble_face_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const PEOPLE = path.join(ROOT, 'engine/bohemia_people.js');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_HER_NAME_AND_HER_FACE_9_24_26.html');
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const REC = path.join(ROOT, 'records/BOHEMIA_BUBBLE_FACE_9_24_26.txt');
const DRIVE = path.join(ROOT, 'tools/bohemia_drive_the_demo.js');

let pass = 0; const fail = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }
function note(k, v) { console.log('       ' + k + ': ' + v); }
const flat = s => String(s).replace(/\s+/g, ' ');

(async () => {
const city = fs.readFileSync(CITY, 'utf8');
const alpha = fs.readFileSync(ALPHA, 'utf8');
const mod = fs.readFileSync(PEOPLE, 'utf8');
const P = require(PEOPLE);

/* ======================================================================== */
head('A. THE NAMES SAY WHAT THEY READ AS, AND THE MARKING CANNOT DRIFT');
/* ======================================================================== */
const marked = Object.keys(P.NAME_READS || {});
const she = marked.filter(n => P.NAME_READS[n] === 'she').length;
const he = marked.filter(n => P.NAME_READS[n] === 'he').length;
const strays = marked.filter(n => P.GIVEN.indexOf(n) < 0);
const unmarked = P.GIVEN.filter(n => !P.NAME_READS[n]);
note('the bank', P.GIVEN.length + ' given names, ' + marked.length + ' marked, '
  + she + ' she, ' + he + ' he, ' + unmarked.length + ' either');
ok('the marking exists and is reachable',
   typeof P.readsAs === 'function' && marked.length > 50);
ok('*** AND EVERY MARKED NAME IS REALLY IN THE BANK. *** A marking that names a '
   + 'name nobody has is a table drifting away from the thing it describes',
   strays.length === 0, strays.slice(0, 4).join(', ') || 'no strays');
ok('and only the values the reader understands are used',
   marked.every(n => P.NAME_READS[n] === 'she' || P.NAME_READS[n] === 'he'));
ok('it reads a FULL name, which is what the game actually holds',
   P.readsAs('Estella Gaines') === 'she' && P.readsAs('Ruben Vasquez') === 'he');
ok('*** AND A NAME THAT GENUINELY GOES BOTH WAYS IS LEFT ALONE, *** which is the '
   + 'one place this table could have invented something instead of reporting it',
   unmarked.length >= 2 && unmarked.length <= 8, unmarked.join(', '));
ok('nothing unknown is forced', P.readsAs('Zzzz') === 'either'
   && P.readsAs(null) === 'either' && P.readsAs('') === 'either');
ok('it is tagged draft and says it is his to overturn',
   /draft:true, and he\s*overturns any single one of them/.test(flat(mod)));
ok('*** AND THE MEASUREMENT THAT KILLED THE ROW\'S STATED CAUSE IS IN THE FILE ***',
   /which of the 8 facings they idle in/.test(flat(mod))
     && /It is a FACING/.test(flat(mod)));
probe('the bank really is big enough for those shares to mean something',
      P.GIVEN.length > 60);

/* ======================================================================== */
head('B. THE CITY ANSWERS, AND AN UNEARNED NAME STEERS NOTHING');
/* ======================================================================== */
ok('the city can say what a person\'s name reads as',
   /function ctFaceReads\(who\)/.test(city));
ok('and it asks the identity module rather than keeping a second opinion',
   /BohemiaPeople\.readsAs\(nm\)/.test(city));
ok('*** A NAME HE HAS NOT EARNED STEERS NOTHING, *** which is this lane\'s own '
   + '9/21 rule kept rather than quietly broken for a face',
   /if \(!nm\) return 'either';/.test(city)
     && /would be the game knowing something he does not/.test(flat(city)));
ok('and it rides across with the ask', /reads: ctFaceReads\(k\)/.test(city));
ok('the shell reads it off the ask and defaults to steering nothing',
   /d\.reads==='she'\|\|d\.reads==='he'/.test(alpha.replace(/\s+/g, ''))
     || /_rd=\(d\.reads==='she'/.test(alpha.replace(/\s+/g, '')));
ok('*** AND THE FACE FOLLOWS THE NAME THE MOMENT IT IS EARNED. *** The face is '
   + 'cached by id and never asked twice, so without this she would keep a '
   + 'stranger\'s face for ever under a plate with her name on it',
   /delete FACE_CV\[String\(p\.id\)\]; delete FACE_ASKED\[String\(p\.id\)\]/.test(city));

/* ======================================================================== */
head('C. THE SHELL NARROWS THE POOL, NEVER THE PICK');
/* ======================================================================== */
ok('the cut marking exists beside the bank it describes',
   /var HAIR_READS = \{/.test(alpha));
const hr = (alpha.match(/var HAIR_READS = \{[\s\S]*?\};/) || [''])[0];
const marks = (hr.match(/'(she|he)'/g) || []).length;
note('cuts marked', marks + ' of 11 canon styles');
ok('*** AND MOST CUTS ARE LEFT OPEN TO EVERYBODY, *** because locs, coils, a shag '
   + 'and a weave are worn by anybody and marking them would invent a rule',
   marks >= 3 && marks <= 6, marks + ' marked');
ok('the POOL is filtered and the generator still chooses freely from what is left',
   /_pool = _pool\.filter/.test(alpha) && /BOH_PERSONLOOK\.lookFor\(id, _pool\)/.test(alpha));
ok('and an unmarked cut is never removed for anybody',
   /return !rd \|\| rd === _reads;/.test(alpha));
ok('a person who reads neither way gets the pool untouched',
   /if \(_reads === 'she' \|\| _reads === 'he'\)/.test(alpha));
ok('and the reason the row\'s cause was wrong is written where the fix is',
   /the cause the row named\s*does not exist/.test(flat(alpha)));

/* ======================================================================== */
head('D. ON THE ALPHA: NO FACE FIGHTS ITS OWN NAME');
/* ======================================================================== */
let drove = false, r = null;
try {
  const { open } = require(DRIVE);
  const d = await open({ file: 'BOHEMIA_ALPHA_0_9.html' });
  await d.clearCards();
  drove = true;
  const rows = await d.fr.evaluate(async () => {
    try { ctPeopleWipe(); } catch (e) {}
    try { render(); } catch (e) {}
    const out = [];
    for (const p of (ctEveryone() || []).slice(0, 60)) {
      try { ctAskName(p); } catch (e) {}
      let nm = null; try { nm = ctPersonName(p.id); } catch (e) {}
      const rd = ctFaceReads(String(p.id));
      out.push({ id: String(p.id), named: !!nm, reads: rd });
    }
    return out;
  });
  r = await d.pageEval((rows) => {
    let before = 0, after = 0, steered = 0, cuts = {};
    for (const x of rows) {
      if (x.reads === 'either') continue;
      steered++;
      /* 'either' IS the old behaviour byte for byte, so this control is the
         shipped code with the steer given nothing to steer by. */
      const b = faceFor(x.id, { reads: 'either' }).hair;
      const a = faceFor(x.id, { reads: x.reads }).hair;
      const rb = b && HAIR_READS[b.name], ra = a && HAIR_READS[a.name];
      if (rb && rb !== x.reads) before++;
      if (ra && ra !== x.reads) after++;
      if (a && a.name) cuts[a.name] = (cuts[a.name] || 0) + 1;
    }
    return { before, after, steered, cutsUsed: Object.keys(cuts).length,
             total: rows.length, named: rows.filter(x => x.named).length };
  }, rows);
  note('the block', r.total + ' people, ' + r.named + ' named, ' + r.steered
    + ' with a name that reads one way');
  note('faces whose cut fought the name', r.before + ' before, ' + r.after + ' after');
  note('different cuts still in use after', r.cutsUsed);

  probe('the street really has named people on it, so a zero below is not an '
    + 'empty set', r.named > 20 && r.steered > 20);
  probe('*** AND THE DEFECT REALLY WAS THERE, so the fix is not a claim about '
    + 'nothing ***', r.before > 0);
  ok('*** NOT ONE FACE WEARS A CUT THAT FIGHTS ITS OWN NAME ***', r.after === 0,
     r.before + ' before, ' + r.after + ' after');
  ok('*** AND THE STREET DID NOT COLLAPSE ONTO TWO HAIRCUTS TO BUY IT, *** which '
     + 'is the control that matters: forcing everybody into one cut each way '
     + 'would pass the claim above and ruin the crowd',
     r.cutsUsed >= 6, r.cutsUsed + ' different cuts still worn');
  ok('and nothing threw while any of it happened', d.errs.length === 0,
     'page errors ' + d.errs.length + (d.errs.length ? ': ' + d.errs[0] : ''));
  await d.close();
} catch (e) {
  ok('the alpha drive finished', false, e.message);
}
probe('the drive really ran, so a green above is not an empty pass', drove);

/* ======================================================================== */
head('E. THE COOK IS IN THE VOTE TAB AND IT IS PIXELS');
/* ======================================================================== */
ok('the page exists', fs.existsSync(PAGE));
const page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : '';
const shots = ['PEOPLE_BUBBLE_BEFORE.png', 'PEOPLE_BUBBLE_AFTER.png'];
ok('and it shows the real faces, before and after',
   shots.every(s => page.indexOf(s) >= 0
     && fs.existsSync(path.join(ROOT, 'slices/vote', s))));
const sizes = shots.map(s => { try { return fs.statSync(path.join(ROOT, 'slices/vote', s)).size; }
                               catch (e) { return 0; } });
ok('*** AND THE TWO SHEETS ARE TWO DIFFERENT SHEETS ***',
   new Set(sizes).size === 2 && sizes.every(s => s > 3000), sizes.join(' / ') + ' bytes');
ok('and the page says out loud that it only shows the ones that were wrong',
   /only the ten who were wrong/i.test(flat(page)));
ok('and it says what is still not fixed, rather than selling the fix',
   /only the haircut so far/i.test(flat(page)));
ok('and it reads at an eighth-grade level: no code words on his screen',
   !/faceFor|lookFor|GARMENTS|BOH_PERSONLOOK|null|hash of the id/.test(page));
let item = null;
try {
  const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
  item = (reg.items || []).find(i => i.id === 'people-her-name-and-her-face-9-24');
} catch (e) {}
ok('*** IT IS REGISTERED IN THE ONE VOTE TAB, which is rule 22 ***', !!item,
   item ? item.title : 'not in the registry');
ok('and it points at the page (rule 25)',
   !!(item && item.show && item.show.src === path.basename(PAGE)));
ok('and it is not a text item, which rule 29 bans', !!(item && item.kind !== 'line'));

/* ======================================================================== */
head('F. THE RECORD');
/* ======================================================================== */
ok('the record exists', fs.existsSync(REC));
const rec = fs.existsSync(REC) ? flat(fs.readFileSync(REC, 'utf8')) : '';
ok('and it corrects the row\'s stated cause with the measurement',
   /40 of 40/.test(rec) && /FACING/.test(rec));
ok('and it credits QUESTS for the picture they were right about',
   /QUESTS/.test(rec));
ok('and it says what is measured and NOT fixed', /MEASURED AND NOT FIXED/i.test(rec));

/* ======================================================================== */
console.log('\n' + (fail.length ? 'RED' : 'GREEN') + ': ' + pass + ' passed, '
  + fail.length + ' failed');
if (fail.length) { fail.forEach(f => console.log('   FAIL  ' + f)); process.exit(1); }
})();
