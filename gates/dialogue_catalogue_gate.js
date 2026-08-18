/* BOHEMIA DIALOGUE CATALOGUE GATE (8/11/26) — dialogue never waits on a thumb,
 * so the CORPUS holds the bar in his place, and "I will edit it later" has a
 * place for later.
 *
 * Paolo 8/11, LOCKED:
 *   "I HAVE A WHOLE 170 QUEST FILE WITH DIALOGUE I DONT HAVE TIME TO APPROVE THE
 *    DIALOGUE THIS SLOW LIKE THIS I WILL EDIT IT LATER JUST DIALOGUE ALWAYS
 *    REFER TO THE BEST QUESTS EVER CATALOGUE OKAY WRITE THAT DOWN AS A RULE
 *    BROTHER. READ THE QUEST SHIT AND GET INSPIRED"
 *
 * WHAT THIS IS ACTUALLY GUARDING. He took dialogue off the approval queue. The
 * thumb WAS the quality control, so removing it without replacing it is how a
 * game ends up with two thousand lines nobody ever held to a standard. What
 * replaces it is questbook/: 152 of the best-written quests ever shipped, mined
 * into 3,672 citable findings. Every authored line now cites the findings it was
 * built on, in the QUEST STUDY LAW's own vocabulary, and a citation is a claim
 * this file can check. "READ THE QUEST SHIT" becomes a precondition of writing a
 * line rather than a suggestion.
 *
 * AND THE OTHER HALF, which is not decoration: he does not dig in files. A line
 * in records/BOHEMIA_SCENE_*.json is a line he cannot edit, so "I will edit it
 * later" would quietly become never. The WORDS tab is checked here too, and
 * checked for BEING CURRENT — a stale tab is the same failure wearing a green.
 *
 * PROVES:
 *   1) the ruling is on disk, quoted, and in the file every session reads
 *   2) dialogue-bearing artifacts are DISCOVERED, not read off a hardcoded list
 *   3) every one of them carries catalogue citations; scenes cite PER LINE
 *   4) every cited id RESOLVES in the index (no invented ids)
 *   5) every cited title is the corpus's own, VERBATIM (what makes it checkable)
 *   6) every 'applied:' is a real sentence, not a name-drop
 *   7) each scene spans >= 2 studies and >= 2 masters
 *   8) the WORDS tab exists, is wired into the alpha, and lives where Pages
 *      actually publishes
 *   9) the WORDS tab is CURRENT with its sources (source-byte fingerprint)
 *  10) and nobody has quietly put dialogue back in front of him for a verdict
 *
 * Law: laws/BOHEMIA_ADDENDUM_DIALOGUE_REFERS_TO_THE_CATALOGUE_8_11_26.md
 *   node gates/dialogue_catalogue_gate.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var ROOT = path.dirname(__dirname);
process.chdir(ROOT);

var pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; } else { fail++; console.log('  FAIL: ' + m); } }

var LAW = 'laws/BOHEMIA_ADDENDUM_DIALOGUE_REFERS_TO_THE_CATALOGUE_8_11_26.md';

/* ---- 1. THE RULING IS WRITTEN DOWN. He said "WRITE THAT DOWN AS A RULE". --- */
ok(fs.existsSync(LAW), 'the 8/11 catalogue ruling is written down as a law');
var law = fs.existsSync(LAW) ? fs.readFileSync(LAW, 'utf8') : '';
ok(/ALWAYS REGER TO THE BEST QUESTS EVER CATLOUGUE/.test(law),
  'the law quotes him VERBATIM, garbles and all, so nobody re-reads it softer');
ok(/REGER = REFER/.test(law) && /CATLOUGUE = CATALOGUE/.test(law),
  'and decodes the transcription, so a future session does not invent a term out of a typo');
ok(/never waits on a thumb/i.test(law) && /questbook/i.test(law),
  'the law states BOTH halves: no approval queue, and the corpus holds the bar instead');
ok(/who dies/i.test(law) && /which faction holds/i.test(law),
  'the law restates the half that did NOT change (decisions still wait for him)');

var claude = fs.readFileSync('CLAUDE.md', 'utf8');
ok(/DIALOGUE ALWAYS REFERS TO THE CATALOGUE/.test(claude),
  'CLAUDE.md carries the rule, so every session reads it before writing a line');
ok(claude.indexOf('DIALOGUE_REFERS_TO_THE_CATALOGUE') >= 0,
  'and CLAUDE.md points at the full law');

/* ---- 2. THE INDEX THE CITATIONS RESOLVE AGAINST -------------------------- */
var IDX_PATH = 'records/BOHEMIA_QUESTBOOK_LAW_INDEX.json';
ok(fs.existsSync(IDX_PATH), 'the questbook law index exists (tools/bohemia_questbook_index.py)');
if (!fs.existsSync(IDX_PATH)) {
  console.log('DIALOGUE CATALOGUE GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(1);
}
var LAWS = JSON.parse(fs.readFileSync(IDX_PATH, 'utf8')).laws;
ok(Object.keys(LAWS).length > 3000,
  'the index holds the whole corpus (' + Object.keys(LAWS).length + ' citable findings)');

/* ---- 3. DISCOVERY, NOT A HARDCODED LIST ---------------------------------- */
/* A hardcoded list is exactly how a law stops being enforced without anybody
   noticing: a lane invents a new dialogue file and the machine never looks at
   it. Same discovery rule as the harvester, stated independently here. */
var bqFiles = fs.existsSync('quests/bq')
  ? fs.readdirSync('quests/bq').filter(function (f) { return /\.bq$/.test(f); })
    .sort().map(function (f) { return 'quests/bq/' + f; })
  : [];
var sceneFiles = fs.readdirSync('records')
  .filter(function (f) { return /^BOHEMIA_SCENE_.*\.json$/.test(f); })
  .sort().map(function (f) { return 'records/' + f; });
/* the ambient lines the walked world says are dialogue too, and they carry
   citations like everything else. Same discovery rule as the harvester, or the
   fingerprint disagrees and reports a stale tab that is not stale. */
var barkFile = fs.existsSync('records/BOHEMIA_BARKS.json') ? ['records/BOHEMIA_BARKS.json'] : [];
var reactFile = fs.existsSync('records/BOHEMIA_REACTIONS.json') ? ['records/BOHEMIA_REACTIONS.json'] : [];
/* AND ANY OTHER records/ JSON THAT HOLDS A CONTAINER OF LINES (8/17). Both this
   gate and the harvester used to name the dialogue files one by one, and the
   harvester's own comment said that was exactly the thing that lets a lane
   invent a file the machine never looks at. The next lane to do it was the
   PEOPLE lane, with records/BOHEMIA_EXCHANGES.json and 124 drafted lines that
   would have been invisible in the WORDS tab -- which under the 8/11 law means
   124 lines he cannot edit. Discovery is BY CONTENT now, on both sides,
   independently stated, so a new dialogue file is picked up the day it lands
   and the two lists cannot silently drift apart. */
var CONTAINERS = ['barks', 'reactions', 'exchanges', 'asking'];
var lineFiles = fs.readdirSync('records').sort().filter(function (f) {
  if (!/^BOHEMIA_.*\.json$/.test(f)) return false;
  if (/^BOHEMIA_SCENE_/.test(f)) return false;
  try {
    var d = JSON.parse(fs.readFileSync('records/' + f, 'utf8'));
    return d && typeof d === 'object' && CONTAINERS.some(function (k) { return k in d; });
  } catch (_e) { return false; }
}).map(function (f) { return 'records/' + f; });
/* SAME RULE **AND SAME ORDER** AS THE HARVESTER. The fingerprint hashes the
   path then the bytes of each source in sequence, so listing the same files in
   a different order reports a stale WORDS tab that is not stale. The first cut
   of this kept BARKS and REACTIONS pinned at the front and scanned for the
   rest; the harvester sorts all three together, and the two hashes disagreed
   over nothing but alphabetical position. */
var SRC = bqFiles.concat(sceneFiles).concat(lineFiles);

ok(bqFiles.length > 0, 'dialogue-bearing quests were discovered on disk (' + bqFiles.length + ' .bq)');
ok(sceneFiles.length > 0, 'dialogue-bearing scenes were discovered on disk (' + sceneFiles.length + ')');

/* ---- THE WORLD'S OWN MOUTH ---------------------------------------------- */
/* Paolo 8/12: "generate text for now with our quest catalog we have." The
   ambient bark table shipped EMPTY for a month with a comment saying nothing
   could fill it -- a comment that predates ALWAYS MAKE AN ATTEMPT (8/11). */
var barkBadId = [], barkBadTitle = [], barkThin = [], barkUncited = [], barkN = 0, barkBuckets = 0;
if (barkFile.length) {
  var BK = JSON.parse(fs.readFileSync('records/BOHEMIA_BARKS.json', 'utf8'));
  Object.keys(BK.barks || {}).forEach(function (bucket) {
    barkBuckets++;
    BK.barks[bucket].forEach(function (r) {
      barkN++;
      if (!r.study || !r.study.length) { barkUncited.push(r.id); return; }
      r.study.forEach(function (c) {
        var e = LAWS[c.id];
        if (!e) { barkBadId.push(r.id + ' -> ' + c.id); return; }
        if (String(e.title || '').trim() !== String(c.title || '').trim())
          barkBadTitle.push(r.id + ' -> ' + c.id);
        if (String(c.applied || '').trim().length < 40) barkThin.push(r.id);
      });
    });
  });
  var people = fs.readFileSync('engine/bohemia_people.js', 'utf8');
  ok(!/var LINES = \{\};/.test(people),
    'THE WORLD HAS SOMETHING TO SAY: the LINES table in engine/bohemia_people.js ' +
    'is no longer empty (it shipped `var LINES = {};` for a month)');
  ok(barkN >= 150, 'and it is real volume, not a sample (' + barkN + ' lines in ' +
    barkBuckets + ' buckets)');
  ok(barkUncited.length === 0, 'every bark cites the catalogue' +
    (barkUncited.length ? ' — UNCITED: ' + barkUncited.slice(0, 4).join(', ') : ''));
  ok(barkBadId.length === 0, 'every bark citation RESOLVES' +
    (barkBadId.length ? ' — ' + barkBadId.slice(0, 3).join(' | ') : ''));
  ok(barkBadTitle.length === 0, 'and every bark citation title is VERBATIM' +
    (barkBadTitle.length ? ' — ' + barkBadTitle.slice(0, 3).join(' | ') : ''));
  ok(barkThin.length === 0, 'and says what it applied' +
    (barkThin.length ? ' — ' + barkThin.slice(0, 3).join(' | ') : ''));
  /* the buckets have to be the WORLD'S OWN vocabulary or they never fire */
  var agents = fs.readFileSync('engine/bohemia_agents.js', 'utf8');
  var acts = ['sleep', 'home', 'work', 'free', 'scav', 'errand', 'watch'];
  var roles = ['worker', 'scav', 'keeper', 'watch'];
  var alien = Object.keys(BK.barks || {}).filter(function (k) {
    if (k.indexOf('faction:') === 0 || k.indexOf('when:') === 0) return false;
    var p = k.split(':');
    return roles.indexOf(p[0]) < 0 || (p[1] && acts.indexOf(p[1]) < 0);
  });
  ok(alien.length === 0, 'every role:act bucket uses the SIM\'S OWN words, so the lines ' +
    'actually fire' + (alien.length ? ' — INVENTED: ' + alien.join(', ') : ''));
  ok(roles.every(function (r) { return agents.indexOf(r) >= 0; }),
    'and those role words are the agents module\'s, not this gate\'s');
}

/* ---- 4/5/6. EVERY CITATION IS REAL --------------------------------------- */
var badId = [], badTitle = [], thin = [], uncited = [];

function checkCite(where, c) {
  var e = LAWS[c.id];
  if (!e) { badId.push(where + ' -> ' + c.id); return; }
  /* VERBATIM. A citation whose title does not match the corpus is a name-drop
     with a real id stapled to it, which is worse than no citation at all
     because it reads as checked. */
  if (String(e.title || '').trim() !== String(c.title || '').trim()) {
    badTitle.push(where + ' -> ' + c.id + ' says "' + c.title + '", corpus says "' + e.title + '"');
  }
  if (String(c.applied || '').trim().length < 40) thin.push(where + ' -> ' + c.id);
}

/* .bq quests cite at the FILE level (QUEST STUDY LAW, 7/26 vocabulary). */
var bqStudies = {}, bqMasters = {};
bqFiles.forEach(function (f) {
  var txt = fs.readFileSync(f, 'utf8').split('\n');
  var cites = [], pend = null;
  txt.forEach(function (ln) {
    var m = /^#\s*@STUDY\s+(Q\d+\.[A-Z]+\d+)\s+(.*?)\s*$/.exec(ln);
    if (m) { pend = { id: m[1], title: m[2], applied: '' }; cites.push(pend); return; }
    var a = /^#\s*applied:\s*(.*?)\s*$/.exec(ln);
    if (a && pend) { pend.applied = a[1]; pend = null; }
  });
  if (!cites.length) { uncited.push(f); return; }
  cites.forEach(function (c) {
    checkCite(f, c);
    var e = LAWS[c.id];
    if (e) { bqStudies[e.study] = 1; bqMasters[e.kind] = 1; }
  });
});

/* Scenes cite PER LINE. A scene is four lines and each one is its own craft
   decision, so a file-level citation would not say which finding produced
   which line — and that is the whole thing the citation is for. */
var sceneLineCount = 0, hisOwn = 0, sceneUncited = [], sceneSpanFail = [];
sceneFiles.forEach(function (f) {
  var d = JSON.parse(fs.readFileSync(f, 'utf8'));
  var says = (d.beats || []).filter(function (b) { return b.kind === 'say'; });
  var studies = {}, masters = {};
  says.forEach(function (b) {
    sceneLineCount++;
    /* HIS OWN WORDS DO NOT CITE THE CATALOGUE, and requiring it would be the
       gate outranking the ruling. The corpus exists to hold a LANE'S writing to
       a standard in his place; a line he wrote himself needs no stand-in for his
       judgement, it IS his judgement. draft:false lines carry a `source` naming
       the ruling they were quoted from instead, which attempt_gate checks. */
    if (b.draft === false) { hisOwn++; return; }
    var cs = b.study || [];
    if (!cs.length) { sceneUncited.push(f + '#' + b.id); return; }
    cs.forEach(function (c) {
      checkCite(f + '#' + b.id, c);
      var e = LAWS[c.id];
      if (e) { studies[e.study] = 1; masters[e.kind] = 1; }
    });
  });
  if (says.length && (Object.keys(studies).length < 2 || Object.keys(masters).length < 2)) {
    sceneSpanFail.push(f + ' (' + Object.keys(studies).length + ' studies, ' +
      Object.keys(masters).length + ' masters)');
  }
});

ok(uncited.length === 0, 'every .bq carries catalogue citations' +
  (uncited.length ? ' — UNCITED: ' + uncited.join(', ') : ''));
ok(sceneUncited.length === 0, 'every SCENE LINE carries its own citation' +
  (sceneUncited.length ? ' — UNCITED: ' + sceneUncited.join(', ') : ''));
ok(badId.length === 0, 'every cited id RESOLVES in the corpus index' +
  (badId.length ? ' — ' + badId.join(' | ') : ''));
ok(badTitle.length === 0, 'every cited title is the corpus\'s own, VERBATIM' +
  (badTitle.length ? ' — ' + badTitle.slice(0, 3).join(' | ') : ''));
ok(thin.length === 0, 'every citation says what it APPLIED, not just a name' +
  (thin.length ? ' — ' + thin.slice(0, 5).join(' | ') : ''));
ok(sceneSpanFail.length === 0, 'each scene spans >= 2 studies and >= 2 masters' +
  (sceneSpanFail.length ? ' — ' + sceneSpanFail.join(' | ') : ''));
ok(Object.keys(bqStudies).length >= 20,
  'the quest corpus leans on real breadth (' + Object.keys(bqStudies).length + ' distinct studies)');

/* ---- 7. THE WORDS TAB EXISTS AND HE CAN REACH IT ------------------------- */
var TAB = 'slices/BOHEMIA_WORDS_CURRENT.html';
ok(fs.existsSync(TAB), 'the WORDS tab page exists');
var tab = fs.existsSync(TAB) ? fs.readFileSync(TAB, 'utf8') : '';
var alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
ok(/data-p="words"[^>]*>WORDS</.test(alpha), 'WORDS is a real tab in the alpha tab bar');
ok(/id="p-words"/.test(alpha) && /BOHEMIA_WORDS_CURRENT\.html/.test(alpha),
  'and the WORDS panel loads that page');
/* ---- REACTIVITY: WHAT THEY SAY BECAUSE OF WHAT YOU DID ------------------ */
/* Depth is reactivity. Three shipped systems already knew exactly what a person
   thinks of you and why -- standing RUNGS, deeds witness(), the ledger -- and
   all three fed a mouth that said the same ambient line to everybody. The claim
   that matters is not "there are lines": it is that every KEY is a value one of
   those modules actually produces, because a key the world never emits is a
   line that can never fire, and that is invisible from the outside. */
var reactN = 0;
if (reactFile.length) {
  var RX = JSON.parse(fs.readFileSync('records/BOHEMIA_REACTIONS.json', 'utf8'));
  var standing = fs.readFileSync('engine/bohemia_standing.js', 'utf8');
  var loopSrc = fs.readFileSync('engine/bohemia_loop.js', 'utf8');
  var rm = /var RUNGS=\[([\s\S]*?)\];/.exec(standing);
  var RUNGS = rm ? (rm[1].match(/'[A-Z]+'/g) || []).map(function (x) { return x.slice(1, -1); }) : [];
  var cm = /CLOUT_WEIGHTS\s*=\s*\{([^}]*)\}/.exec(loopSrc);
  var CLOUTS = cm ? (cm[1].match(/(\w+)\s*:/g) || []).map(function (x) { return x.replace(/\s*:/, ''); }) : [];
  ok(RUNGS.length >= 4 && CLOUTS.length >= 4,
    'the world\'s own standing rungs and clout tags were read off the shipped modules (' +
    RUNGS.join('/') + ' | ' + CLOUTS.join('/') + ')');

  var rxUncited = [], rxBadId = [], rxBadTitle = [], rxAlien = [];
  Object.keys(RX.reactions || {}).forEach(function (key) {
    var head = key.split(':')[0], tail = key.split(':')[1];
    if (head === 'rung' && RUNGS.indexOf(tail) < 0) rxAlien.push(key);
    if ((head === 'saw' || head === 'heard') && CLOUTS.indexOf(tail) < 0) rxAlien.push(key);
    RX.reactions[key].forEach(function (r) {
      reactN++;
      if (!r.study || !r.study.length) { rxUncited.push(r.id); return; }
      r.study.forEach(function (c) {
        var e = LAWS[c.id];
        if (!e) { rxBadId.push(r.id + ' -> ' + c.id); return; }
        if (String(e.title || '').trim() !== String(c.title || '').trim())
          rxBadTitle.push(r.id + ' -> ' + c.id);
      });
    });
  });
  ok(reactN >= 50, 'THE WORLD REACTS TO WHAT YOU DID (' + reactN + ' lines across ' +
    Object.keys(RX.reactions || {}).length + ' keys)');
  ok(rxAlien.length === 0, 'EVERY REACTION KEY IS A VALUE THE WORLD ACTUALLY PRODUCES' +
    (rxAlien.length ? ' — INVENTED: ' + rxAlien.join(', ') : '') +
    ' — a key the sim never emits is a line that can never fire');
  ok(rxUncited.length === 0, 'every reaction cites the catalogue' +
    (rxUncited.length ? ' — ' + rxUncited.slice(0, 4).join(', ') : ''));
}

/* ---- TWO PEOPLE TALKING TO EACH OTHER (8/17) ---------------------------- */
/* Q043.W4 AMBIENT BANTER AS CHARACTERIZATION asks for OVERHEARD RELATIONSHIPS,
   and the bark table cited that finding while shipping 244 lines of people
   talking to nobody. These are the conversations. They are drafted words he has
   not approved, so they obey exactly the same law as everything else here. */
/* WHAT SOMEBODY TELLS YOU WHEN YOU ASK (8/17). Three strings per answer plus a
   refusal per trade, all of them drafted words he has not approved. */
var askN = 0, askBad = [];
if (fs.existsSync('records/BOHEMIA_ASKING.json')) {
  var AJ = JSON.parse(fs.readFileSync('records/BOHEMIA_ASKING.json', 'utf8'));
  (AJ.asking || []).forEach(function (a) {
    askN += 3;
    (a.study || []).forEach(function (c) {
      var e = LAWS[c.id];
      if (!e) askBad.push(a.id + ' -> ' + c.id);
      else if (String(e.title || '').trim() !== String(c.title || '').trim())
        askBad.push(a.id + ' -> ' + c.id + ' not verbatim');
    });
    if (!a.study || a.study.length < 2) askBad.push(a.id + ' (<2 studies)');
  });
  askN += Object.keys(AJ.deflect || {}).length;
  ok(askN >= 40, 'YOU CAN ASK ABOUT WHAT YOU HEARD (' + askN + ' lines across ' +
    (AJ.asking || []).length + ' answers)');
  ok(askBad.length === 0, 'every answer cites the catalogue, verbatim' +
    (askBad.length ? ' — ' + askBad.slice(0, 3).join(', ') : ''));
}

var xchN = 0, xchUncited = [], xchBadId = [], xchBadTitle = [], xchThin = [], xchHeard = [];
if (fs.existsSync('records/BOHEMIA_EXCHANGES.json')) {
  var XJ = JSON.parse(fs.readFileSync('records/BOHEMIA_EXCHANGES.json', 'utf8'));
  (XJ.exchanges || []).forEach(function (x) {
    xchN += (x.turns || []).length;
    if (!(x.join >= 1)) xchHeard.push(x.id);
    if (!x.study || x.study.length < 2) { xchUncited.push(x.id); return; }
    x.study.forEach(function (c) {
      var e = LAWS[c.id];
      if (!e) { xchBadId.push(x.id + ' -> ' + c.id); return; }
      if (String(e.title || '').trim() !== String(c.title || '').trim())
        xchBadTitle.push(x.id + ' -> ' + c.id);
      if (String(c.applied || '').trim().length < 40) xchThin.push(x.id);
    });
  });
  ok(xchN >= 90, 'PEOPLE TALK TO EACH OTHER, not just at the player (' + xchN +
    ' turns across ' + (XJ.exchanges || []).length + ' conversations)');
  ok(xchUncited.length === 0 && xchBadId.length === 0 && xchBadTitle.length === 0 &&
    xchThin.length === 0, 'every conversation cites >=2 findings, verbatim, applied' +
    (xchUncited.concat(xchBadId, xchBadTitle, xchThin).slice(0, 3).join(', ')));
  ok(xchHeard.length === 0, 'YOU WALK IN ON THE MIDDLE: no conversation is entered ' +
    'at its opening line' + (xchHeard.length ? ' — ' + xchHeard.join(', ') : ''));
  ok(rxBadId.length === 0 && rxBadTitle.length === 0,
    'and every reaction citation resolves with a VERBATIM title');

  var ppl = fs.readFileSync('engine/bohemia_people.js', 'utf8');
  ok(ppl.indexOf('var REACTIONS = {') >= 0 && ppl.indexOf('"rung:HOSTILE"') >= 0,
    'the reactions are WIRED into the people module');
  ok(/var pick = \(saw && REACTIONS\['saw:'/.test(ppl),
    'and a REACTION BEATS AN AMBIENT LINE in the lookup — somebody who watched you ' +
    'do something reckless yesterday does not open with the weather');
  var missingRung = RUNGS.filter(function (r) { return !(RX.reactions || {})['rung:' + r]; });
  var missingSaw = CLOUTS.filter(function (c) { return !(RX.reactions || {})['saw:' + c]; });
  ok(missingRung.length === 0, 'EVERY standing rung has words' +
    (missingRung.length ? ' — SILENT: ' + missingRung.join(', ') : ''));
  ok(missingSaw.length === 0, 'and every clout level has a witnessed reaction' +
    (missingSaw.length ? ' — SILENT: ' + missingSaw.join(', ') : ''));

  /* ---- AND THE SURFACE HAS TO ACTUALLY ASK ------------------------------
     THE DISEASE THIS CATCHES, and it had already happened twice by the time it
     was written: the barks were written, gated and green while the one screen
     that calls linesFor() was still calling it with NO ARGUMENTS -- so 58 of 58
     situation buckets were unreachable and the gate was cheerfully counting
     lines nobody could ever hear. Volume in a table is not reach. The claim is
     about the CALL, and it is made against the run's SOURCE file, because the
     source is what the builder inlines and a fix typed into the build output is
     erased by the next build (which is exactly how the first attempt went). */
  var runSrc = 'slices/BOHEMIA_RUN_SLICE_7_26_26.html';
  if (fs.existsSync(runSrc)) {
    var rs = fs.readFileSync(runSrc, 'utf8');
    ok(/BohemiaPeople\.linesFor\(who,\s*reactionCtx\(/.test(rs),
      'THE SCREEN ACTUALLY ASKS: the person card calls linesFor WITH the context, ' +
      'so a written line can be reached — a table nobody queries is a table nobody hears');
    ok(!/BohemiaPeople\.linesFor\(who\)/.test(rs),
      'and no call site still asks bare — one of those anywhere silently mutes every bucket');
    /* THREE SIGNALS, NOT ONE. Passing a ctx that only ever carries `met` would
       pass the claim above and still leave standing and the witness organ mute,
       which is the same bug wearing a different coat. */
    var ctx = (rs.match(/function reactionCtx\([\s\S]*?\n\}/) || [''])[0];
    ok(/RUN\.sawList/.test(ctx) && /RUN\.clout/.test(ctx),
      'the ctx reads the WITNESS organ — who was outdoors saw it, who was behind a wall heard it');
    ok(/BohemiaStanding\.(rungFor|opinionOf)/.test(ctx),
      'and it reads THIS PERSON\'S OWN standing, not the faction average on the readout');
    ok(/PEOPLE_MET\.metState\(/.test(ctx),
      'and the met state comes off the ledger that owns the bits, so no surface re-derives it');
  }

  /* ---- AND THE COPY HE ACTUALLY LOADS HAS TO BE THE FRESH ONE -----------
     ENGINE SYNC LAW, aimed at the specific way it failed here: the module was
     correct on disk, the gates all read it off disk, and the two SLICES that
     carry an inlined copy — the frame the alpha's RUN tab loads and the CITY
     world — were a build behind and had no REACTIONS in them at all. Every
     gate was green and not one person in the game could react. */
  ['slices/BOHEMIA_RUN_CURRENT.html', 'slices/BOHEMIA_CITY_WORLD.html'].forEach(function (f) {
    if (!fs.existsSync(f)) return;
    var t = fs.readFileSync(f, 'utf8');
    var carries = t.indexOf('BohemiaPeople') >= 0 || t.indexOf('bohemia_people.js') >= 0;
    if (!carries) return;
    ok(t.indexOf('var REACTIONS = {') >= 0,
      'the inlined people module in ' + f.split('/').pop() + ' carries the reactions — ' +
      'fresh on disk and stale in the surface he taps is the whole failure mode');
  });
}

/* ---- 5. ONE-LINK LAW (continued) ----------------------------------- */
/* NAME THE TAB / ONE-LINK: it must live where Pages actually publishes, or the
   tab is blank in production and works perfectly on disk — the exact 8/6 bug. */
var cfg = fs.readFileSync('_config.yml', 'utf8');
ok(TAB.indexOf('slices/') === 0 && !/^\s*-\s*slices\//m.test(cfg),
  'the tab lives in slices/, which _config.yml publishes (a records/ fetch would 404 live)');
ok(!/fetch\(|XMLHttpRequest/.test(tab),
  'the page fetches NOTHING at runtime — payload is inlined, so it cannot 404 in production');
ok(/EXPORT/.test(tab) && /\.txt/.test(tab),
  'and it exports as .txt (verdict workflow: .txt, never .json)');

/* ---- 8. AND THE TAB IS CURRENT ------------------------------------------- */
/* A stale tab is the same failure as no tab, wearing a green: he opens WORDS,
   edits yesterday's line, and the edit lands on something that moved. */
var h = crypto.createHash('sha256');
SRC.forEach(function (f) {
  h.update(Buffer.from(f, 'utf8')); h.update(Buffer.from([0]));
  h.update(fs.readFileSync(f)); h.update(Buffer.from([0]));
});
var want = h.digest('hex').slice(0, 16);
var got = (/WORDS_FINGERPRINT = '([a-f0-9]+)'/.exec(tab) || [])[1];
ok(got === want, 'the WORDS tab is CURRENT with its sources' +
  (got === want ? '' : ' — baked from ' + got + ', sources now hash ' + want +
    ' (run: python3 tools/bohemia_words_book.py)'));

var BOOK = fs.existsSync('records/BOHEMIA_WORDS_BOOK.json')
  ? JSON.parse(fs.readFileSync('records/BOHEMIA_WORDS_BOOK.json', 'utf8')) : null;
ok(BOOK !== null, 'the machine copy of the words book exists');
if (BOOK) {
  /* An INDEPENDENT count, measured here off the raw sources rather than trusted
     from the generator's own summary — a number a tool reports about itself is
     one measurement written twice. */
  var mine = sceneLineCount;
  bqFiles.forEach(function (f) {
    fs.readFileSync(f, 'utf8').split('\n').forEach(function (ln) {
      if (/^\s*@SAY\s+\S/.test(ln) || /^\s*@LOG\s+\S/.test(ln)) mine++;
      else if (/^\s*@OPT\s+["(]/.test(ln)) mine++;
      else if (/^@OBJ\s+\d+\s+"/.test(ln)) mine++;
    });
  });
  mine += barkN + reactN + xchN + askN;   /* ambient lines, reactions and the
     two-person exchanges are all in the book too. ALL FOUR turns of an
     exchange count, including the opening line the player never hears: he
     cannot edit what the second line is answering if he cannot see it. */
  ok(BOOK._meta.lines === mine, 'the book holds EVERY line on disk (book ' +
    BOOK._meta.lines + ', counted here ' + mine + ')');
  ok(BOOK._meta.fingerprint === want, 'and the machine copy is current too');
  /* every scene line's CURRENT text is actually in the page he opens */
  var missing = [];
  sceneFiles.forEach(function (f) {
    var d = JSON.parse(fs.readFileSync(f, 'utf8'));
    (d.beats || []).filter(function (b) { return b.kind === 'say'; }).forEach(function (b) {
      if (b.text && tab.indexOf(JSON.stringify(b.text).slice(1, -1)) < 0) missing.push(f + '#' + b.id);
    });
  });
  ok(missing.length === 0, 'every scene line he can edit is actually ON the page' +
    (missing.length ? ' — MISSING: ' + missing.join(', ') : ''));
}

/* ---- 9. NOBODY PUT DIALOGUE BACK IN FRONT OF HIM ------------------------- */
/* The failure mode this law names by hand is not bad dialogue, it is ASKING.
   The judge surfaces are where asking happens, so that is where it is checked. */
var judged = [];
['slices/BOHEMIA_VOTE_CURRENT.html', 'slices/BOHEMIA_ART_CURRENT.html'].forEach(function (f) {
  if (!fs.existsSync(f)) return;
  var t = fs.readFileSync(f, 'utf8');
  sceneFiles.forEach(function (sf) {
    var d = JSON.parse(fs.readFileSync(sf, 'utf8'));
    (d.beats || []).filter(function (b) { return b.kind === 'say' && b.text; }).forEach(function (b) {
      if (t.indexOf(b.text) >= 0) judged.push(f + ' <- ' + sf + '#' + b.id);
    });
  });
});
ok(judged.length === 0, 'no dialogue line is sitting on a JUDGE surface awaiting his thumb' +
  (judged.length ? ' — ' + judged.join(', ') : ''));

console.log('DIALOGUE CATALOGUE GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  (BOOK ? BOOK._meta.lines : '?') + ' lines across ' + SRC.length +
  ' sources, all sourced to the catalogue; ' + (sceneLineCount - hisOwn) +
  ' cited per line, ' + hisOwn + ' are HIS OWN WORDS and cite nothing)');
process.exit(fail ? 1 : 0);
