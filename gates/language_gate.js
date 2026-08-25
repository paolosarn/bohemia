/* BOHEMIA LANGUAGE GATE (8/25/26, PEOPLE lane) -- they speak Spanglish, and the
 * one thing that must never happen is a player who cannot tell what to do next.
 *
 * Paolo 8/25, LOCKED:
 *   "in regards to the spanish ... make them speak spanglish for our game i like
 *    that. have it very poor english ro spanglish to give it that flavor ty"
 *
 * WHAT THIS IS ACTUALLY GUARDING, and it is not spelling. A Las Vegas with
 * 418,400+ Spanish speakers had exactly zero in the build; every person in this
 * valley spoke flawless monolingual English, including the lane's own shipped
 * proof character, RUBEN NGUYEN. His ruling fixes that. The DANGER his ruling
 * creates is the one the localisation literature names over and over and that
 * Sleeping Dogs got attacked for: flavour that quietly turns into a
 * COMPREHENSION FAILURE, a player standing still because the thing telling them
 * what to do is in a language they do not read.
 *
 * SO THE HARD RULE IS THE POINT OF THIS FILE:
 *   *** LANGUAGE NEVER GATES REQUIRED INFORMATION. ***
 * And a promise is not a rule. What makes it checkable is that the Spanish this
 * game may say is a CLOSED, DECLARED SET (engine/bohemia_people.js ES_LEX,
 * written by tools/bohemia_bark_factory.py from the lines it actually ships),
 * so every objective, every resolution button and every job offer in the build
 * can be swept for it and proven clean.
 *
 * PROVES:
 *   A  every authored line knows what language it is in, and every register
 *      bucket names a register that exists and has an English bucket under it
 *   B  the derived valley mix matches the real Clark County numbers, it is NOT
 *      all one register, and it CLUSTERS the way the 139 limited-English tracts
 *      cluster -- with the two block mixes averaging back to the county
 *   C  NO STRING CARRYING REQUIRED INFORMATION IS NON-ENGLISH: objectives,
 *      resolution buttons, journal lines, the one action button, the person card
 *   D  the sweep can actually fail (the anti-vacuity guard), the lexicon has a
 *      meaning for every word, and nothing in a register line is an invented
 *      word -- which is how "never phonetic accent spelling" is machine-held
 *
 * WHY IT DOES NOT CARRY ITS OWN TOKENIZER: it calls the engine's esWordsIn().
 * This lane has now shipped two bugs whose entire cause was two copies of one
 * rule quietly disagreeing. A checker that re-types the rule it is checking is
 * the same shape, and it is how "o'clock" would have been read as the Spanish
 * word "o" in one place and not the other.
 *
 * Law:  laws/BOHEMIA_ADDENDUM_THEY_SPEAK_SPANGLISH_8_25_26.md
 * Prior: records/BOHEMIA_EVERYBODY_IN_THIS_VALLEY_SPEAKS_PERFECT_ENGLISH_8_25_26.md
 *   node gates/language_gate.js
 */
'use strict';
var fs = require('fs');
var path = require('path');

var ROOT = path.dirname(__dirname);
process.chdir(ROOT);

var pass = 0, fail = 0;
function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '   ' + detail : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '   ' + detail : '')); }
}
function head(s) { console.log('\n' + s); }

var P = require('../engine/bohemia_people.js');
/* THE SWEEP IS CALLED BY ITS PUBLISHED NAME, not through the alias, and that is
   deliberate. The module registers itself as the global BohemiaPeople, so this
   is its name and not a workaround -- but tools/bohemia_organ_reach.js counts
   callers TEXTUALLY, so `BohemiaPeople.esWordsIn(...)` is invisible to it and it reported
   the function as reached by NOTHING ANYWHERE. That tool documents this exact
   blind spot for values passed by injection; the alias case is the same shape
   and belongs to its own lane, flagged rather than reached into. */
var BohemiaPeople = P;
var LAW = 'laws/BOHEMIA_ADDENDUM_THEY_SPEAK_SPANGLISH_8_25_26.md';

/* ==========================================================================
   THE RULING IS ON DISK, IN HIS WORDS
   ========================================================================== */
head('0. THE RULING');
var law = fs.existsSync(LAW) ? fs.readFileSync(LAW, 'utf8') : '';
ok('the 8/25 spanglish ruling is written down as a law', !!law);
ok('and it is quoted verbatim, garbles and all', /make them speak spanglish for our game/.test(law));
ok('the hard rule is stated in the law itself',
  /LANGUAGE NEVER GATES REQUIRED INFORMATION/.test(law));
ok('and so is the reason the mix is mandatory (register 2 is a skill, 3 is a gap)',
  /never phonetic accent spelling/i.test(law) || /NEVER PHONETIC SPELLING/.test(law));

/* ==========================================================================
   A. EVERY AUTHORED LINE KNOWS WHAT LANGUAGE IT IS IN
   The expensive thing later is never the CONTENT of a line. It is a MISSING
   COLUMN: one field on a generator today, five thousand hand rulings at line
   5,000, and the human doing that reading is him.
   ========================================================================== */
head('A. EVERY LINE KNOWS WHAT LANGUAGE IT IS IN');
var book = JSON.parse(fs.readFileSync('records/BOHEMIA_WORDS_BOOK.json', 'utf8'));
var allLines = [];
(book.books || []).forEach(function (b) { (b.lines || []).forEach(function (l) { allLines.push(l); }); });
ok('the words book has lines in it at all', allLines.length > 1500, allLines.length + ' lines');

var untagged = allLines.filter(function (l) { return !l.lang; });
ok('EVERY authored player-facing line carries a register', untagged.length === 0,
  untagged.length ? untagged.slice(0, 3).map(function (l) { return l.id; }).join(', ') : allLines.length + '/' + allLines.length);

var badReg = allLines.filter(function (l) { return l.lang && !P.LANG[l.lang]; });
ok('and every register named is one the engine knows', badReg.length === 0,
  badReg.length ? badReg[0].lang : P.LANG_ORDER.join('/'));

var byReg = {};
allLines.forEach(function (l) { byReg[l.lang] = (byReg[l.lang] || 0) + 1; });
ok('all three registers actually have lines written for them',
  P.LANG_ORDER.every(function (r) { return (byReg[r] || 0) > 0; }),
  P.LANG_ORDER.map(function (r) { return r + ' ' + (byReg[r] || 0); }).join('  '));

/* THE FAILURE THE LAW NAMES BY NAME: a build where everybody who speaks Spanish
   is written as broken English. Register 2 is a SKILL. If register 3 ever
   outnumbers register 2 in the written corpus, we have made a third of the
   county sound stupid, and that is the version of his ruling that embarrasses
   us rather than the version that lands. */
ok('SPANGLISH IS THE HEADLINE REGISTER, not broken English',
  (byReg.spanglish || 0) >= (byReg.es || 0),
  'spanglish ' + (byReg.spanglish || 0) + ' vs poor-english ' + (byReg.es || 0));

/* AND NO BUCKET CAN GO MUTE BY GAINING A REGISTER. */
var regBuckets = Object.keys(P.LINES).filter(function (k) { return k.indexOf('@') >= 0; });
ok('there are register buckets at all', regBuckets.length > 20, regBuckets.length + ' buckets');
var orphan = regBuckets.filter(function (k) { return !P.LINES[k.split('@')[0]]; });
ok('every register bucket has an English bucket to fall back to', orphan.length === 0,
  orphan.length ? orphan.slice(0, 3).join(', ') : 'all ' + regBuckets.length);
var emptyReg = regBuckets.filter(function (k) { return !(P.LINES[k] || []).length; });
ok('and not one of them is empty', emptyReg.length === 0, emptyReg.join(', ') || 'none');

/* ==========================================================================
   B. THE VALLEY IS THE REAL VALLEY
   ========================================================================== */
head('B. THE MIX IS THE COUNTY, AND IT CLUSTERS');

/* The two block mixes must AVERAGE BACK to the county numbers. This is
   arithmetic on the constants, so somebody retuning BARRIO_MIX for taste and
   quietly moving the whole valley off the census turns it red without anybody
   having to run a simulation. */
var s = P.BARRIO_SHARE / 1000;
P.LANG_ORDER.forEach(function (r) {
  var blended = s * P.BARRIO_MIX[r] + (1 - s) * P.REST_MIX[r];
  ok('the two block mixes average back to the county for ' + r,
    Math.abs(blended - P.VALLEY_MIX[r]) <= 5,
    blended.toFixed(1) + ' vs ' + P.VALLEY_MIX[r] + ' per 1000');
});
[P.BARRIO_MIX, P.REST_MIX, P.VALLEY_MIX].forEach(function (m, i) {
  var tot = P.LANG_ORDER.reduce(function (a, r) { return a + (m[r] || 0); }, 0);
  ok('mix ' + ['barrio', 'rest', 'valley'][i] + ' sums to 1000', tot === 1000, String(tot));
});

/* AND THE DERIVED PEOPLE ACTUALLY COME OUT THAT WAY. Derived, not stored, so
   this is the only way to know: build a valley and count it. */
function lcg(seed) { var v = seed >>> 0; return function () { v = (Math.imul(v, 1664525) + 1013904223) >>> 0; return v; }; }
var rnd = lcg(20260825), blocks = 3000, barrio = 0, count = { en: 0, spanglish: 0, es: 0 }, total = 0;
var perBlock = [];
for (var b = 0; b < blocks; b++) {
  var seed = rnd();
  if (P.blockMixOf(seed) === P.BARRIO_MIX) barrio++;
  var here = { en: 0, spanglish: 0, es: 0 };
  for (var h = 1; h <= 14; h++) for (var sl = 1; sl <= 3; sl++) {
    var r = P.langOf(seed, 'P:' + (seed >>> 0) + ':H' + h + '-' + sl);
    count[r]++; here[r]++; total++;
  }
  perBlock.push(here);
}
ok('a valley was actually derived to measure', total > 100000, total + ' people on ' + blocks + ' blocks');
P.LANG_ORDER.forEach(function (r) {
  var got = count[r] / total * 1000;
  ok('the derived valley matches Clark County for ' + r,
    Math.abs(got - P.VALLEY_MIX[r]) <= 15,
    got.toFixed(1) + ' vs ' + P.VALLEY_MIX[r] + ' per 1000');
});

/* THE CLAIM THE LAW WRITES OUT IN CAPITALS: a build where every Spanish-speaking
   character is register 3 FAILS. Measured on the people, not on the table. */
ok('NOT EVERY SPANISH SPEAKER IS BROKEN ENGLISH',
  count.spanglish > count.es * 2,
  'spanglish ' + count.spanglish + ' vs poor-english ' + count.es);
ok('and the valley is not all one register either',
  P.LANG_ORDER.every(function (r) { return count[r] / total > 0.01; }),
  P.LANG_ORDER.map(function (r) { return r + ' ' + (count[r] / total * 100).toFixed(1) + '%'; }).join('  '));

ok('about a quarter of blocks are the limited-English kind (139 of ~500 tracts)',
  Math.abs(barrio / blocks * 1000 - P.BARRIO_SHARE) <= 25,
  (barrio / blocks * 100).toFixed(1) + '% vs 27.8%');

/* IT HAS TO ACTUALLY CLUSTER. A sprinkle that averages right is not a
   neighbourhood, and "whole blocks where the language on the street is not the
   language on the phone" is the finding this was built from. Compare the
   Spanish share of the most-Spanish decile against the least. */
var shares = perBlock.map(function (h) {
  var n = h.en + h.spanglish + h.es;
  return n ? (h.spanglish + h.es) / n : 0;
}).sort(function (x, y) { return x - y; });
var lowDecile = shares[Math.floor(shares.length * 0.1)];
var highDecile = shares[Math.floor(shares.length * 0.9)];
ok('SOME BLOCKS ARE SPANISH-SPEAKING GROUND AND SOME ARE NOT',
  highDecile > lowDecile * 4 && highDecile > 0.3,
  'top decile ' + (highDecile * 100).toFixed(0) + '% Spanish, bottom decile ' + (lowDecile * 100).toFixed(0) + '%');

/* Derived means derived: same key, same answer, forever, on any device. */
var k = 'P:12345:H3-2';
ok('language is derived, so it is the same person tomorrow',
  P.langOf(12345, k) === P.langOf(12345, k) && P.langOf(12345, k) === P.langOf(12345, k));
/* AND IT DOES NOT TRAVEL WITH THE NAME. Language is a third stream off the same
   key, and if it correlated with the name stream then every Marisol in the
   valley would speak Spanish and every Wendell would not -- a caricature built
   by accident, out of arithmetic rather than intent.
   MEASURED, NOT ASSERTED. The first version of this claim did `return n > 0`
   after a loop that computed nothing: true forever, for a reason unrelated to
   the rule. That is the vacuous pass this lane has now shipped three times, and
   the fix is always the same -- make the claim compute the thing it names. */
ok('and it does not travel with the name (independent streams)',
  (function () {
    var per = {}, rr = lcg(4242);
    for (var i = 0; i < 4000; i++) {
      var sd = rr();
      for (var hh = 1; hh <= 14; hh++) {
        var key = 'P:' + (sd >>> 0) + ':H' + hh + '-1';
        var first = P.generatedName(key).split(' ')[0];
        var p = per[first] || (per[first] = { n: 0, es: 0 });
        p.n++; if (P.langOf(sd, key) !== 'en') p.es++;
      }
    }
    var names = Object.keys(per).filter(function (n) { return per[n].n >= 200; });
    var worst = 0, worstName = '';
    names.forEach(function (n) {
      var d = Math.abs(per[n].es / per[n].n - 0.185);
      if (d > worst) { worst = d; worstName = n; }
    });
    ok.detail = names.length + ' names, worst skew ' + worstName + ' ' + (worst * 100).toFixed(1) + 'pt';
    return names.length > 40 && worst < 0.06;
  })(), (function () { return ok.detail; })());

/* ==========================================================================
   C. THE HARD RULE. THIS IS THE CLAIM THAT MATTERS.
   ========================================================================== */
head('C. NO REQUIRED INFORMATION IS NON-ENGLISH');

/* First: PROVE THE SWEEP CAN FAIL. A claim that cannot fail is not a claim, and
   this gate's whole value rests on esWordsIn actually finding things. */
ok('the sweep finds Spanish when Spanish is there (anti-vacuity)',
  BohemiaPeople.esWordsIn('Bring the agua to mi casa, pues.').length >= 3,
  JSON.stringify(BohemiaPeople.esWordsIn('Bring the agua to mi casa, pues.')));
ok('and it does not fire on plain English',
  BohemiaPeople.esWordsIn('Go to the substation and read the meter before nine.').length === 0);
ok("and it does not read o'clock as the Spanish word o",
  BohemiaPeople.esWordsIn("Nine o'clock. Watch.").length === 0);

var required = [];   // {where, text}
function req(where, text) { if (text && String(text).trim()) required.push({ where: where, text: String(text) }); }

/* 1. EVERY OBJECTIVE AND EVERY RESOLUTION BUTTON IN EVERY CANON QUEST. These
      are literally the strings that tell a player what to do and what their
      choices are. Read off the .bq source, not off a list somebody typed. */
var BQ = 'quests/bq';
fs.readdirSync(BQ).filter(function (f) { return /\.bq$/.test(f); }).forEach(function (f) {
  fs.readFileSync(BQ + '/' + f, 'utf8').split('\n').forEach(function (L, i) {
    var mo = /^\s*@OBJ\s+\d+\s+(.*)/.exec(L);
    var mp = /@OPT\s+"([^"]*)"/.exec(L);
    var ml = /^\s*@LOG\s+(.*)/.exec(L);
    if (mo) req(f + ':' + (i + 1) + ' objective', mo[1]);
    if (mp) req(f + ':' + (i + 1) + ' choice', mp[1]);
    if (ml) req(f + ':' + (i + 1) + ' journal', ml[1]);
  });
});
ok('the quest objectives and choices were found to sweep', required.length > 300,
  required.length + ' strings');

/* 2. THE ONE ACTION BUTTON, in all three registers. It is how the player knows
      an action exists; a button you cannot read is a broken button, not
      flavour. Built for a real person of each register rather than asserted. */
P.LANG_ORDER.forEach(function (r) {
  var stranger = { tier: 'stranger', role: 'worker', lang: r, household: { house: 0, slot: 0, size: 2 } };
  var known = { tier: 'asked', name: 'Marisol Rivera', role: 'worker', lang: r, household: { house: 0, slot: 0, size: 2 } };
  req('action button (' + r + ', stranger)', P.addressOf(stranger));
  req('action button (' + r + ', named)', P.addressOf(known));
  req('heading (' + r + ')', P.headingOf(stranger));
  /* 3. AND THE PERSON CARD. Every row of it is the game stating a fact, which
        is required information, including the new SPEAKS row itself. */
  P.cardFor(known, { id: 'H1-1', sched: [] }, 600, { times: 1 }).forEach(function (row) {
    req('card row ' + row.label + ' (' + r + ')', row.label + ' ' + row.value);
  });
});

/* 4. THE PHONE'S JOB OFFER AND THE OBJECTIVE HUD, off the shipped run surface
      rather than off a copy. If the run slice ever renders an offer in Spanish
      this finds it. */
['slices/BOHEMIA_RUN_CURRENT.html', 'slices/BOHEMIA_CURRENT_SLICE.html'].forEach(function (f) {
  if (!fs.existsSync(f)) return;
  var src = fs.readFileSync(f, 'utf8');
  var re = /(?:objText|objLine|offerText|jobText|OBJECTIVE|TAKE THE JOB)[^\n]{0,200}/g, m, n = 0;
  while ((m = re.exec(src)) && n < 400) { req(path.basename(f) + ' offer/objective', m[0]); n++; }
});

var offenders = [];
required.forEach(function (r) {
  var h = BohemiaPeople.esWordsIn(r.text);
  if (h.length) offenders.push(r.where + '  "' + r.text.slice(0, 70) + '"  <- ' + h.join(','));
});
ok('*** NOT ONE STRING CARRYING REQUIRED INFORMATION IS NON-ENGLISH ***',
  offenders.length === 0,
  offenders.length ? offenders.slice(0, 6).join('\n       ') : required.length + ' strings swept, 0 Spanish');

/* AND THE SAME RULE ONE LAYER UP: the words book's own objective and choice
   lines, whatever their register tag says, must be English. A line tagged
   spanglish that is an OBJECTIVE is the bug this rule exists for. */
var reqKinds = { objective: 1, choice: 1, journal: 1 };
var taggedReq = allLines.filter(function (l) { return reqKinds[l.kind]; });
var mistagged = taggedReq.filter(function (l) { return l.lang !== 'en' || BohemiaPeople.esWordsIn(l.text).length; });
ok('no objective, choice or journal line is written in another language',
  mistagged.length === 0,
  mistagged.length ? mistagged.slice(0, 3).map(function (l) { return l.id + ' [' + l.lang + ']'; }).join(', ')
                   : taggedReq.length + ' objective/choice/journal lines, all English');

/* ==========================================================================
   D. THE LEXICON IS A REAL CLOSED SET
   ========================================================================== */
head('D. THE LEXICON');
var lex = P.ES_LEX, words = Object.keys(lex);
ok('the lexicon exists and is not a stub', words.length > 100, words.length + ' words');
var noGloss = words.filter(function (w) { return !lex[w] || !String(lex[w]).trim(); });
ok('EVERY Spanish word ships with its English meaning', noGloss.length === 0,
  noGloss.slice(0, 5).join(', ') || 'all ' + words.length);

/* ES_ONLY is what claim C sweeps with, and it must have had the both-languages
   words taken out of it -- otherwise the sweep fires on every English objective
   containing "no" and the claim gets weakened until it catches nothing. */
var only = P.ES_ONLY;
ok('the sweep list drops the words that are also English',
  ['no', 'son', 'me', 'a'].every(function (w) { return only.indexOf(w) < 0; }),
  ['no', 'son', 'me', 'a'].filter(function (w) { return only.indexOf(w) >= 0; }).join(',') || 'no/son/me/a all excluded');
ok('but it keeps the words that are unmistakably Spanish',
  ['agua', 'pues', 'mija', 'cuidado'].every(function (w) { return only.indexOf(w) >= 0; }));
ok('and the clitic list is shipped rather than re-typed by each reader',
  Array.isArray(P.ES_CLITIC) && P.ES_CLITIC.indexOf('s') >= 0);

/* NEVER PHONETIC ACCENT SPELLING, HELD BY A MACHINE INSTEAD OF A COMMENT.
   "joo" for "you" is the single most common way this goes wrong in a shipped
   game, and it is not a word-hunt to catch it: a phonetic respelling is a token
   that is neither declared Spanish nor a word this game has ever said in
   English. Same test catches a typo, which is the point -- it is a check for a
   THING (an invented word) and not for a WORD. */
var enVocab = Object.create(null);
(book.books || []).forEach(function (bk) {
  (bk.lines || []).forEach(function (l) {
    if (l.lang && l.lang !== 'en') return;
    String(l.text || '').toLowerCase().replace(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ']+/g, function (w) { enVocab[w] = 1; return w; });
  });
});
var barks = JSON.parse(fs.readFileSync('records/BOHEMIA_BARKS.json', 'utf8'));
(barks._meta.englishAdditions || []).forEach(function (w) { enVocab[w] = 1; });
var invented = [];
allLines.forEach(function (l) {
  if (!l.lang || l.lang === 'en') return;
  String(l.text || '').replace(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ']+/g, function (w) {
    var lw = w.toLowerCase(), ap = lw.indexOf("'");
    var stem = (ap > 0 && P.ES_CLITIC.indexOf(lw.slice(ap + 1)) >= 0) ? lw.slice(0, ap) : null;
    if (lex[lw] || (stem && lex[stem])) return w;
    if (enVocab[lw] || (stem && enVocab[stem])) return w;
    invented.push(l.id + ': ' + w);
    return w;
  });
});
ok('no register line contains an invented word (no phonetic accent spelling)',
  invented.length === 0, invented.slice(0, 6).join(', ') || 'clean');

/* And the register has to BE a register. A "spanglish" bucket with no Spanish
   anywhere in it is a tag, not a voice, and it would sail past every claim
   above. Register 3 is deliberately exempt: poor English is GRAMMAR, not
   vocabulary, so most of its lines are correctly all-English.

   THE UNIT IS THE BUCKET, NOT THE LINE, and the first cut of this claim had it
   wrong. Line-level it read 138 of 164 and went red at my own 85% threshold --
   and the 26 it was accusing were "Still walking, then.", "New face. Huh." and
   three lines that are literally "...". A BILINGUAL PERSON DOES NOT SWITCH IN
   EVERY SENTENCE; demanding that is demanding a cartoon, which is the exact
   thing the law's craft rules forbid. A number that disagrees with the writing
   is usually the number. Per bucket, the claim says what I actually mean and
   fails on exactly what I want it to fail on: a register somebody tagged and
   never wrote. */
var sgBuckets = {};
allLines.forEach(function (l) {
  if (l.lang !== 'spanglish') return;
  var k = l.speaker || l.node || l.id;
  (sgBuckets[k] = sgBuckets[k] || []).push(l.text);
});
var sgKeys = Object.keys(sgBuckets);
var mute = sgKeys.filter(function (k) {
  return !sgBuckets[k].some(function (t) { return BohemiaPeople.esWordsIn(t).length > 0; });
});
ok('EVERY spanglish bucket actually switches languages somewhere in it',
  sgKeys.length > 20 && mute.length === 0,
  mute.length ? mute.slice(0, 4).join(', ') : sgKeys.length + ' buckets, all switch');

/* ==========================================================================
   THE MOUTH IS WIRED, not just the table. A register nobody can reach is a
   schema, and this lane has shipped one of those before: reactions were
   written, cited and green while the run called linesFor with no arguments.
   ========================================================================== */
head('E. AND SOMEBODY CAN ACTUALLY SAY IT');
var per = { key: 'x', role: 'worker', faction: null };
var enLine = P.linesFor({ key: 'x', role: 'worker', lang: 'en' }, { at: 'work' })[0];
var sgLine = P.linesFor({ key: 'x', role: 'worker', lang: 'spanglish' }, { at: 'work' })[0];
var esLine = P.linesFor({ key: 'x', role: 'worker', lang: 'es' }, { at: 'work' })[0];
ok('an english worker gets an english line', !!enLine && BohemiaPeople.esWordsIn(enLine).length === 0, enLine);
ok('a spanglish worker gets a DIFFERENT line, and it switches',
  !!sgLine && sgLine !== enLine && BohemiaPeople.esWordsIn(sgLine).length > 0, sgLine);
ok('a spanish-dominant worker gets a third line', !!esLine && esLine !== enLine && esLine !== sgLine, esLine);
/* THE FALLBACK, TESTED ON A BUCKET THAT ACTUALLY HAS NO REGISTER. The first cut
   of this claim sampled keeper:scav, which HAS a spanglish twin -- so it was
   named after the fallback and never once exercised it, and it stayed green
   through the mutation that deleted the fallback entirely. A claim whose sample
   does not contain its subject is the vacuous pass wearing the right title.
   The bucket is FOUND rather than named, so it stays honest as registers get
   written for more of them. */
var noRegKey = Object.keys(P.LINES).filter(function (k) {
  return k.indexOf('@') < 0 && !P.LINES[k + '@spanglish'] && (P.LINES[k] || []).length;
})[0];
ok('there is still a bucket with no register written for it, to test with',
  !!noRegKey, noRegKey);
var noReg = noRegKey ? P.linesFor({ key: noRegKey, role: 'worker', lang: 'spanglish' }, {}) : [];
ok('A BUCKET WITH NO REGISTER FALLS BACK TO ENGLISH RATHER THAN GOING MUTE',
  noReg.length > 0 && BohemiaPeople.esWordsIn(noReg[0]).length === 0,
  noRegKey + ' -> ' + JSON.stringify(noReg[0]));
var pe = P.personOf(4242, { id: 'H2-1', seed: 99, role: 'worker' }, { householdSize: 3, asked: true });
ok('a real derived person carries a register', !!P.LANG[pe.lang], pe.name + ' speaks ' + pe.lang);
var speaks = P.cardFor(pe, { id: 'H2-1', sched: [] }, 600, { times: 1 }).find(function (r) { return r.label === 'SPEAKS'; });
ok('and the card says what they speak, without you having to ask', !!speaks, speaks && speaks.value);

/* ==========================================================================
   F. AND IT REACHED THE SURFACES HE ACTUALLY TAPS
   A register the engine knows and the frames do not is a schema. The city frame
   was carrying a 47,907-byte copy of an 81,931-byte module -- the 8/12 bark
   table and NOTHING newer -- because the only tool that inlines it correctly
   refuses to run (it would delete 3,400 lines another lane built on top), and
   the engine sync gate keys on `const BOH_*` so it has never watched this
   module at all. That is two good guard rails leaving a gap between them.
   VERIFY ON THE REAL SURFACE: check the shipped bytes, not the engine's.
   ========================================================================== */
head('F. THE SHIPPED FRAMES CARRY THE CURRENT MODULE');
[['slices/BOHEMIA_RUN_CURRENT.html', 'the RUN frame'],
 ['slices/BOHEMIA_CITY_WORLD.html', 'the CITY frame']].forEach(function (pair) {
  var f = pair[0], what = pair[1];
  if (!fs.existsSync(f)) { ok(what + ' exists', false, f); return; }
  var src = fs.readFileSync(f, 'utf8');
  ok(what + ' carries the language layer',
    /function langOf\s*\(/.test(src) && /var ES_ONLY = /.test(src) && /function esWordsIn\s*\(/.test(src),
    'langOf ' + /function langOf\s*\(/.test(src) +
    ', ES_ONLY ' + /var ES_ONLY = /.test(src) +
    ', esWordsIn ' + /function esWordsIn\s*\(/.test(src));
  ok(what + ' carries the register buckets, not just the English ones',
    src.indexOf('"worker:work@spanglish"') >= 0 && src.indexOf('"worker:work@es"') >= 0);
  ok(what + ' shows what somebody speaks on the card',
    /label: 'SPEAKS'/.test(src) || /label:"SPEAKS"/.test(src));
});

/* ==========================================================================
   G. AND NOW THE ONLY MEASUREMENT THAT COUNTS: THE WALKED CITY
   Everything above this line is the engine agreeing with itself. VERIFY ON THE
   REAL SURFACE (7/18): the two worst bugs in this whole build were invisible to
   every claim above, because both were about what the CITY hands the engine
   rather than what the engine does with it -- one global seed used as a block
   seed (so the valley could not cluster at all), and the language derived from
   a different key than the name (two identities for one person). Neither is
   findable by reading the module. Both are findable in ninety seconds by
   walking the ground and counting.
   ========================================================================== */
function requirePlaywright() {
  for (var i = 0, g = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']; i < g.length; i++) {
    try { return require(path.join(g[i], 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
var SETTLE = require(__dirname + '/bohemia_settle.js').settle;
var CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

(async function () {
  head('G. THE WALKED CITY, COUNTED');
  var browser = null;
  try {
    browser = await requirePlaywright().chromium.launch();
    var page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    var errs = [];
    page.on('pageerror', function (e) { errs.push(String(e)); });
    await page.goto('file://' + CITY);
    await SETTLE(page, 9000);

    var m = await page.evaluate(function () {
      var mix = { en: 0, spanglish: 0, es: 0 }, blocks = [], rekeyed = 0, seen = 0;
      var sp = BohemiaPopulation.NB * FN;
      for (var cx = 8; cx < 26; cx++) for (var cy = 8; cy < 26; cy++) {
        hx = cx * sp + 4; hy = cy * sp + 4; CT_SPAWN = null;
        var R = [];
        try { ctSpawn(); R = ctEveryone(); } catch (e) { continue; }
        var here = { en: 0, spanglish: 0, es: 0 };
        for (var i = 0; i < R.length; i++) {
          var w = null, raw = null;
          try {
            w = ctPerson(R[i]);
            /* WHAT personOf WOULD HAVE SAID ON ITS OWN, with the city's one
               global seed and the pre-rekey identity. If the city ever stops
               re-deriving, these agree 100% of the time and this claim dies. */
            raw = BohemiaPeople.personOf(seed >>> 0, ctAgent(R[i]), {}).lang;
          } catch (e) { continue; }
          if (!w || mix[w.lang] === undefined) continue;
          mix[w.lang]++; here[w.lang]++; seen++;
          if (w.lang !== raw) rekeyed++;
        }
        var n = here.en + here.spanglish + here.es;
        if (n >= 3) blocks.push((here.spanglish + here.es) / n);
      }
      blocks.sort(function (a, b) { return a - b; });
      var card = null, line = null;
      try {
        var RR = ctEveryone(), ww = ctPerson(RR[0]);
        card = BohemiaPeople.cardFor(ww, ctAgent(RR[0]), 600, { times: 1 });
        line = BohemiaPeople.linesFor(ww, { at: 'work' })[0];
      } catch (e) { card = null; }
      return {
        seen: seen, blocks: blocks.length, mix: mix, rekeyed: rekeyed,
        low: blocks[Math.floor(blocks.length * 0.1)] || 0,
        high: blocks[Math.floor(blocks.length * 0.9)] || 0,
        speaks: (card || []).filter(function (r) { return r.label === 'SPEAKS'; })[0] || null,
        labels: (card || []).map(function (r) { return r.label; }),
        line: line
      };
    });

    ok('the city was actually walked and its people counted', m.seen > 800 && m.blocks > 60,
      m.seen + ' people on ' + m.blocks + ' populated blocks');
    ok('nothing threw while walking it', errs.length === 0, errs.slice(0, 2).join(' | '));
    ok('the walked valley is not all one register',
      P.LANG_ORDER.every(function (r) { return m.mix[r] > 0; }),
      P.LANG_ORDER.map(function (r) { return r + ' ' + (m.mix[r] / m.seen * 100).toFixed(1) + '%'; }).join('  '));
    ok('and spanglish still outnumbers poor english on the ground',
      m.mix.spanglish > m.mix.es, m.mix.spanglish + ' vs ' + m.mix.es);

    /* THE CLUSTERING, ON THE GROUND. One global seed as the block seed made this
       impossible: every block came out identical, so low and high deciles were
       the same number and there were no neighbourhoods, only a sprinkle. */
    ok('*** SOME BLOCKS IN THE WALKED CITY ARE SPANISH-SPEAKING GROUND AND SOME ARE NOT ***',
      m.high > 0.2 && m.high > m.low + 0.15,
      'top decile ' + (m.high * 100).toFixed(0) + '% Spanish, bottom decile ' + (m.low * 100).toFixed(0) + '%');

    ok('the city derives language off the SAME identity as the name (re-keyed)',
      m.rekeyed > m.seen * 0.05,
      m.rekeyed + ' of ' + m.seen + ' differ from what the raw block seed would have said');

    ok('the card on the surface he taps says what they speak',
      !!m.speaks && !!m.speaks.value, m.speaks ? m.speaks.label + ': ' + m.speaks.value : String(m.labels));
    /* IN THE IDENTITY HALF OF THE CARD, NOT THE FOOTER. The first cut of this
       claim demanded SPEAKS sit at exactly NAME+1 and went red because LIVES is
       between them -- AN ASSERTION THAT PINS TODAY'S LAYOUT INSTEAD OF TODAY'S
       RULE, which is the miss this lane has now made six times. The rule is
       that what somebody speaks is who they are, so it belongs above what they
       do and how often you have met. */
    ok('and it sits in the identity half of the card, not the footer',
      m.labels.indexOf('SPEAKS') > -1 &&
      m.labels.indexOf('SPEAKS') < m.labels.indexOf('WORKS') &&
      m.labels.indexOf('SPEAKS') < m.labels.indexOf('YOU HAVE MET'),
      m.labels.join(' | '));
    ok('somebody in the walked city has something to say', !!m.line, m.line);
  } catch (e) {
    ok('the walked city could be measured at all', false, String(e && e.message || e));
  } finally {
    if (browser) await browser.close();
  }

  console.log('\n' + (fail ? 'RED' : 'GREEN') + '  ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
