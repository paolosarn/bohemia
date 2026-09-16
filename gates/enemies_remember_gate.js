/* ============================================================================
   BOHEMIA ENEMIES REMEMBER (9/16/26, PEOPLE lane).
   VAMILY [enemies remember], row BB-THE-SHADOW.

   THE ROW, IN ITS OWN WORDS: "in a ONE-SHOT encounter the rational move is to
   defect; in a REPEATED one, cooperation emerges and wins... BECAUSE WE NEVER
   RESET, EVERY RELATIONSHIP IN BOHEMIA IS A REPEATED GAME... THE SHADOW OF THE
   FUTURE IS NOT A METAPHOR HERE, IT IS THE ARCHITECTURE." And its cheapest first
   version is named in the row too: THE MAN YOU SPARED TURNS UP.

   *** MEASURED FIRST, AND THE HOLE WAS AT THE ONE MOMENT IT SHOWS MOST. ***
   roadChoose is 5,230 characters and it is where EVERY encounter choice in this
   game lands. It contained ZERO deed publishes, ZERO witnesses, and never once
   looked at the crowd standing right there. So you could hand a starving man your
   water, or face him down and watch him walk off down the wash, and NOBODY IN THE
   VALLEY KNEW IT HAPPENED. Every encounter was a one-shot game inside an
   architecture whose only real advantage is that nothing is.
   And the other half: ctSeenMeCount was read in exactly ONE place, a crew list on
   a card. Nobody on the street had ever shown that they know you.

   WHAT IT TOOK, WHICH IS LESS THAN IT SOUNDS: one call at the one place a choice
   lands, and two rows in each of two tables. Everything else already existed --
   the publisher, the witness set, the fading, the gossip, and the organ that
   makes somebody say it out loud. NOTHING IS STORED, NOBODY IS INVENTED, AND NO
   WEIGHT IS WRITTEN: DEED_WEIGHT is still empty and still his.

   ON THE GLASS, WITH A CONTROL ON BOTH ENDS:
     before          he holds nothing, and the bark organ fires 0
     FACE HIM DOWN   "You wait. He works up to it twice and then walks off."
     after           he holds `spared`
     meet him again  he says "Had him cold. Let him walk."

   WHAT THIS HOLDS:
   A. one publisher, at the one place, and a refusal writes nothing
   B. a kind needs a row in BOTH tables or it is remembered and mute
   C. the three arms write three different things, because copying your last move
      is the whole mechanism and a memory that cannot tell them apart cannot
   D. on the demo: nothing, then something, then he says it, same person

   node gates/enemies_remember_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const REC = path.join(ROOT, 'records/BOHEMIA_ENEMIES_REMEMBER_9_16_26.txt');
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
/* THE BODY, NOT A WINDOW AFTER THE NAME. A fixed window ran past the end of a
   function last round and matched the line underneath, so a claim stayed green
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
  head('A. ONE PUBLISHER, AT THE ONE PLACE A CHOICE LANDS');
  /* ======================================================================== */
  const city = fs.readFileSync(CITY, 'utf8');
  const ccode = stripComments(city);

  const rc = bodyOf(ccode, 'roadChoose');
  /* THE FLOOR SAT AT 2,000 AND THE BODY IS BARELY OVER IT, so a control that
     removed forty characters turned a real red into a reader that 'could not
     find the function'. A floor that a legitimate edit can trip says nothing
     about the reader. It asks for the function's own landmarks instead. */
  probe('the body reader found roadChoose and it is the real one',
        rc.length > 1200 && rc.indexOf('ROAD_CHOICES') >= 0 && rc.indexOf('o.pay') >= 0);
  ok('*** THE PLACE EVERY ENCOUNTER CHOICE LANDS NOW WRITES IT DOWN. *** It '
     + 'published nothing at all before this round, so a man you spared and a man '
     + 'you never met were the same man', rc.indexOf('shadowRemember(') >= 0);
  /* AND IT IS THE ONLY CALLER. Two places publishing the same act is how one
     encounter ends up remembered twice, and it is the defect this lane has found
     in its own work three rounds running. */
  const callers = (ccode.match(/shadowRemember\s*\(/g) || []).length;
  ok('and it is the ONLY place that calls it, apart from the definition itself',
     callers === 2, callers + ' occurrence(s): one definition, one call');
  /* THE REFUSAL COMES FIRST. An arm he cannot afford must not write a favour he
     did not do; the call sits after the early returns, which is checkable. */
  const refuseAt = rc.indexOf('refused:true');
  const writeAt = rc.indexOf('shadowRemember(');
  ok('an arm he cannot afford writes nothing, because the refusal returns before '
     + 'the write', refuseAt >= 0 && writeAt > refuseAt,
     'refusal at ' + refuseAt + ', write at ' + writeAt);

  /* ======================================================================== */
  head('B. A KIND NEEDS A ROW IN BOTH TABLES OR IT IS REMEMBERED AND MUTE');
  /* ======================================================================== */
  /* THIS IS THE ROUND'S OWN LESSON. Publishing `spared` with no row in
     CT_DEED_WORDS reached one person and landed nowhere, because the reader drops
     any kind it has no words for. Then it landed and he still said nothing,
     because the street bark reads a SECOND table. */
  /* *** EACH CLAIM IS ANCHORED INSIDE ITS OWN TABLE, and the first cut was not.
     Both rows matched the same pattern, so removing every CT_DEED_WORDS row left
     BOTH claims green off the CT_REACT rows underneath. Two claims that cannot
     tell two tables apart are one claim wearing two hats, which is exactly the
     thing this round found in the game and then did in its own gate. */
  function tableAt(src, name) {
    const i = src.indexOf(name);
    if (i < 0) return '';
    const j = src.indexOf('{', i), k = src.indexOf('\n};', j);
    return (j < 0 || k < 0) ? '' : src.slice(j, k);
  }
  const wordsTbl = tableAt(ccode, 'CT_DEED_WORDS');
  const reactTbl = tableAt(ccode, 'CT_REACT =');
  probe('both tables were found and they are different tables',
        wordsTbl.length > 200 && reactTbl.length > 200 && wordsTbl !== reactTbl);
  for (const kind of ['spared', 'downed']) {
    ok('the card can say what `' + kind + '` was',
       new RegExp("'" + kind + "':\\s*\\{\\s*saw:\\s*'").test(wordsTbl));
    ok('and somebody standing there can say `' + kind + '` out loud',
       new RegExp("'" + kind + "':\\s*\\{[\\s\\S]{0,120}?saw:\\s*\\[").test(reactTbl));
  }

  /* THE THREE ARMS ARE THREE DIFFERENT THINGS. Tit-for-tat copies your LAST move;
     a memory that cannot tell a handout from a beating cannot copy anything. */
  const acts = ccode.match(/SHADOW_ACT\s*=\s*\{([\s\S]*?)\}/);
  const kinds = acts ? (acts[1].match(/'[a-z]+'/g) || []).map(x => x.replace(/'/g, ''))
                         .filter(x => ['favour', 'spared', 'downed'].indexOf(x) >= 0) : [];
  ok('the three arms of his own approved encounter write THREE different acts',
     new Set(kinds).size === 3, kinds.join(', '));

  /* HIS TABLE STAYS HIS. Naming an act is mechanism; what it is worth is a
     ruling, and DEED_WEIGHT ships empty on purpose. */
  const shadowBlock = ccode.slice(ccode.indexOf('SHADOW_ACT'),
                                  ccode.indexOf('SHADOW_ACT') + 1200);
  ok('and not one weight is written for them, so the deed table is still his',
     !/DEED_WEIGHT/.test(shadowBlock) && !/weight\s*[:=]\s*\d/.test(shadowBlock));

  /* ======================================================================== */
  head('C. ON THE DEMO: NOTHING, THEN SOMETHING, THEN HE SAYS IT');
  /* ======================================================================== */
  let drove = false;
  try {
    const { open } = require(DRIVE);
    const d = await open({});
    await d.clearCards();
    const fr = d.fr;
    drove = true;
    ok('the demo booted and the walked city answered', true,
       await fr.evaluate(() => (typeof shadowRemember === 'function') ? 'ok' : 'no seam'));

    const r = await fr.evaluate(() => {
      const drew = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW : [];
      const who = drew.length && drew[0].p ? String(drew[0].p.id) : null;
      const out = { who };
      out.beforeDeeds = who ? (ctKnownDeeds(who, 12) || []).map(x => x.kind) : [];
      /* THE CONTROL: with nothing done to anybody, does the street stay quiet? A
         bark that fires either way would make every number below meaningless. */
      out.barkBefore = ctDeedBark(ctMinuteNow()) ? 1 : 0;
      const ev = { id: 'scavenger_shakedown', seq: 1, name: 'desperate scavenger shakedown' };
      const res = roadChoose(ev, 'stare');
      out.armOk = !!(res && res.ok);
      out.armSay = res && res.say;
      out.afterDeeds = who ? (ctKnownDeeds(who, 12) || []).map(x => x.kind) : [];
      out.afterSays = who ? (ctKnownDeeds(who, 12) || []).map(x => x.say) : [];
      /* AND HE TURNS UP */
      out.barkAfter = ctDeedBark(ctMinuteNow()) ? 1 : 0;
      out.barkText = BARK.text || null;
      out.barkWho = BARK.p ? String(BARK.p.id) : null;
      return out;
    });
    note('the man on the glass', r.who);
    note('what the card said when he let him walk', r.armSay);
    note('what the man says the next time he sees him', r.barkText);

    probe('somebody was actually drawn to be the man', !!r.who);
    ok('*** THE CONTROL: BEFORE HE DOES ANYTHING, NOBODY IS CARRYING ANYTHING AND '
       + 'THE STREET IS QUIET ***, so everything below is the feature and not the '
       + 'organ firing anyway',
       r.beforeDeeds.length === 0 && r.barkBefore === 0,
       r.beforeDeeds.length + ' held, bark fired ' + r.barkBefore);
    ok('he faces the man down and the man walks off, which is the arm his own '
       + 'approved encounter names', r.armOk === true, r.armSay || '');
    ok('*** AND NOW SOMEBODY IS CARRYING IT. *** The act is in a real person\'s '
       + 'head, not in a book this feature keeps',
       r.afterDeeds.indexOf('spared') >= 0, r.afterDeeds.join(', '));
    /* *** AND IT HAS TO BE ABOUT THE THING HE DID. *** The first cut asked only
       whether A bark fired, and a control proved that can be an unrelated line
       about the power being out. A claim that any voice on the street satisfies
       is a claim that cannot fail for the right reason. */
    const sparedLines = (city.match(/'spared':\s*\{[\s\S]*?\n  \}/) || [''])[0];
    const isAboutIt = !!(r.barkText && sparedLines.indexOf(r.barkText) >= 0);
    ok('*** THE MAN YOU SPARED TURNS UP AND SAYS SO. *** That is the row\'s own '
       + 'cheapest first version, in its own words, and the words are about what he '
       + 'actually did rather than any voice on the street',
       r.barkAfter === 1 && isAboutIt, r.barkText || 'he said nothing');
    ok('and it is the SAME person, not somebody else repeating a rumour',
       r.barkWho === r.who, r.barkWho + ' vs ' + r.who);
    ok('and what he carries is written as something he WATCHED, not something he '
       + 'heard', (r.afterSays[0] || '').indexOf('watched') === 0, r.afterSays[0] || '');

    /* THE ARM HE CANNOT AFFORD WRITES NOTHING */
    const poor = await fr.evaluate(() => {
      const drew = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW : [];
      const who = drew.length && drew[0].p ? String(drew[0].p.id) : null;
      const before = who ? (ctKnownDeeds(who, 12) || []).length : 0;
      const ev = { id: 'scavenger_shakedown', seq: 2, name: 'desperate scavenger shakedown' };
      const res = roadChoose(ev, 'pay');
      const after = who ? (ctKnownDeeds(who, 12) || []).length : 0;
      return { refused: !!(res && res.refused), before, after };
    });
    ok('and an arm he cannot afford writes NOTHING, because a favour he could not '
       + 'do is not a favour he did',
       !poor.refused || poor.after === poor.before,
       poor.refused ? ('refused, held ' + poor.before + ' -> ' + poor.after)
                    : 'he could afford it, so the case did not arise');

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
    ok('the record carries the row\'s own sentence',
       /THE MAN YOU SPARED TURNS UP/i.test(r));
    ok('and the hole it found, with the number',
       /5,230/.test(r) && /zero/i.test(r));
    ok('and the cut it made rather than the feature it could have shipped',
       /two writers for one fact|deleted before it ever ran/i.test(r));
  } else {
    ok('the record exists', false, REC);
  }

  notes.forEach(n => console.log(n));
  console.log('\n=== ENEMIES REMEMBER: ' + pass + ' pass / ' + fail.length + ' fail ===');
  if (fail.length) { fail.forEach(f => console.log('   - ' + f)); process.exit(1); }
})();
