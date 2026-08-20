/* ============================================================================
   LAB GATE (7/26/26, LAB lane) — THE REFERENCE LAB, machine-locked.

   AMENDED THE SAME DAY IT WAS WRITTEN, because the lane got the assignment wrong
   the first time. Paolo: "who said I wanted to test the walking... it was
   supposed to be like the actual game and all its mechanics... you need to get
   the code online and implement it for the different game mechanics like
   marriage and fishing in farming".

   So this gate now holds SIX clauses, not four:

     1. AN EMULATION IS MECHANICS, NOT FEEL. Each registry row DECLARES its
        mechanics; fewer than three fails, and a declared "mechanic" that is
        really plumbing (movement, camera, collision, lighting, transition)
        fails outright. That is clause 1+4 of
        laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md.
     2. THE LOOP CLOSES. Every declared mechanic has a live end-to-end check
        that PLAYS it to completion in a real browser. A demo of step one is not
        a mechanic.
     3. NEVER THE GAME. No engine module, no bank, no alpha, no postMessage —
        and nothing shipped links back to a lab page either.
     4. THREE DELIVERABLES: playable page, record of the numbers, pattern note.
     5. THE NUMBERS ARE SOURCED. Every constant in the page's SDV block appears
        in its record with a file:line citation from the master's own source.
     6. MEASURED, NOT ASSERTED. The live half drives the page's own functions
        through window.LAB, so it tests the shipped code path, never a second
        copy of the maths.
     7. A MODEL IS NEVER MISTAKEN FOR A MEASUREMENT (added 7/27, for Valheim).
        Some games ship no readable source at all — Valheim's logic is a compiled
        Unity DLL. A row may declare kind:'MODEL', and then the rules CHANGE
        rather than relax: the page must say on its own face that it is a model
        and why, the record must list what was actually tried and failed, EVERY
        constant must be tagged [SOURCED file:line] or [DOC ...] or declared
        ours, and at least one must be genuinely SOURCED so the row is not pure
        hearsay. An untagged number fails the build exactly like a missing
        citation does. Named in records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_7_26_26.md
        before it was ever needed: a model is a legal deliverable, a model
        pretending to be a measurement is not.

   Requires playwright (installed globally in this environment).
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROOF_DIR = process.env.LAB_GATE_PROOF_DIR
  ? path.resolve(ROOT, process.env.LAB_GATE_PROOF_DIR)
  : require('os').tmpdir();

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const near = (a, b, eps) => Math.abs(a - b) <= (eps === undefined ? 0.01 : eps);

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

/* Words that are NOT mechanics. Clause 4 of the whole-mechanics addendum: these
   are plumbing inside a mechanic and may never be a lab deliverable again. */
const NOT_A_MECHANIC = ['walk', 'walking', 'movement', 'move', 'camera', 'collision',
  'lighting', 'light', 'transition', 'feel', 'render', 'zoom', 'input'];

/* GRAVEYARDED EMULATIONS — TWO OF THEM, AND LOOT IS NOW A CLOSED SUBJECT.
   Paolo 7/27: the A Dark Room scavenge page was KILLED ("That was really bad so
   bad so bad"). That is the SECOND loot emulation dead in two days, so under
   laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md this lane does not build a
   third one. No loot row belongs in this registry again. The ADR|PZ branch in the
   constant-block regex and the .js citation branch stay: they cost nothing and a
   future NON-loot emulation of a JS game will need them.
   Paolo 7/26: the Zomboid house was KILLED ("really bad
   and not fun") and its per-item time economy is now an ANTI-reference — see
   laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md. Its row is gone and
   the graveyard gate keeps the page from coming back. Its teardown and pattern
   note survive as records of what was measured, marked dead at the top. */

const EMULATIONS = [
    /* LAB-10 IS DEAD. Paolo 8/7: "That valheim sample was so dogshit". Its page is
       graveyarded (gates/bohemia_graveyard.txt) and DELETED. Its row is gone and there is
       NO V2 -- and this one is not a content miss, it is the NINTH lab deliverable killed,
       so the post-mortem is about the FORMAT and not about Valheim:
       records/BOHEMIA_LAB_VALHEIM_BUILD_KILL_8_7_26.md.
       liveValheimBuild / shotValheimBuild stay in this file deliberately, the same way
       liveTheCrash did: B31/B32 (does the claimed thing actually LAND ON THE CANVAS, is
       every drawn size big enough to see) are the most reusable checks the row produced,
       and they are the only two in 573 that were about what a human can SEE. */
  {
    /* LAB-09. Built because he corrected LAB-08 out of existence and then named
       what he actually wanted: "modern economic crash valheim project zomboid
       FALLOUT NEW VEGAS THAT ALSO DOUBLES AS A CITY BUILDER COOK IT UP".
       Money is banned by law here, so the question is what the currency IS, and
       the answer is STANDING. FACTION STANDING NOW BELONGS TO THE PEOPLE LANE
       (registered on main 7/31) -- this row is a reference page, touches none of
       their code, and claims nothing. */
    id: 'TEN YEARS COLD',
    game: 'Fallout: New Vegas',
    kind: 'MODEL',
    mechanics: ['standing', 'the mixed axis', 'thresholds', 'deeds', 'building to matter'],
    minConsts: 34,
    page: 'slices/lab/BOHEMIA_LAB_TEN_YEARS_COLD_7_31_26.html',
    record: 'records/lab/BOHEMIA_LAB_TEN_YEARS_COLD_TEARDOWN_7_31_26.txt',
    pattern: 'records/lab/BOHEMIA_LAB_TEN_YEARS_COLD_PATTERN_NOTE_7_31_26.md',
    live: liveTenYearsCold,
    shot: { name: 'BOHEMIA_LAB_TEN_YEARS_COLD_PROOF_7_31_26.png', setup: shotTenYearsCold }
  },
    /* LAB-08 IS DEAD. Its page is graveyarded (gates/bohemia_graveyard.txt,
       7/31) and DELETED, killed by laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md
       the same day it shipped: it simulated the crash HAPPENING in a game that
       opens ten years after the crash ended. Three of its five mechanics were
       banned outright by that law. Its row is gone and there is NO V2 -- the
       answer was a different question, and it is LAB-09 below.
       liveTheCrash / shotTheCrash / crashDidNotReopenLoot stay in this file
       deliberately: crashDidNotReopenLoot is the FORBIDDEN-FEATURE pattern and it
       is the most reusable thing the row produced. */
  {
    /* LAB-07, commissioned by name. Paolo 7/31: "look at the weapon types in
       valheim. valheim does weapon types really good so i like that. valheim i
       think is a top 5 game of all time the most we can suck from it the
       better." The second MODEL row, and the second time Valheim's compiled DLL
       forced clause 7. Its three SOURCED numbers come from ValheimPlus, a
       HarmonyX mod whose C# names the game's own SkillType enum. */
    id: 'VALHEIM WEAPON TYPES',
    game: 'Valheim',
    kind: 'MODEL',
    mechanics: ['damage types', 'resistances', 'backstab', 'parry', 'weapon skill'],
    minConsts: 34,
    page: 'slices/lab/BOHEMIA_LAB_VALHEIM_WEAPONS_7_31_26.html',
    record: 'records/lab/BOHEMIA_LAB_VALHEIM_WEAPONS_TEARDOWN_7_31_26.txt',
    pattern: 'records/lab/BOHEMIA_LAB_VALHEIM_WEAPONS_PATTERN_NOTE_7_31_26.md',
    live: liveValheimWeapons,
    shot: { name: 'BOHEMIA_LAB_VALHEIM_WEAPONS_PROOF_7_31_26.png', setup: shotValheimWeapons }
  },
  {
    /* LAB-06: the action-cost model, and the row that taught this gate .cpp/.h.
       Paolo ruled its SHAPE canon the same day
       (laws/BOHEMIA_ADDENDUM_THE_ACTION_COST_SHAPE_7_31_26.md), which is what
       gates/action_cost_shape_gate.js then locked.
       LAB-06, 7/31. Built because Paolo's 7/28 correction (clause 17 of the
       mobile-camp law) made the ACTION clock the centre of the survival design,
       and then nothing in the repo could say what one action costs. Clause 4 of
       laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md reserves the
       cost TABLE to him, so this row brings the SHAPE with Cataclysm's own
       numbers and invents none of ours. A real EMULATION, not a model: the game
       is open source, so every constant is read off a line of its C++. */
    id: 'CDDA ACTION COST',
    game: 'Cataclysm: DDA',
    mechanics: ['action cost', 'condition', 'travel', 'errands', 'sleep debt'],
    minConsts: 34,
    page: 'slices/lab/BOHEMIA_LAB_CDDA_ACTION_COST_7_31_26.html',
    record: 'records/lab/BOHEMIA_LAB_CDDA_TEARDOWN_7_31_26.txt',
    pattern: 'records/lab/BOHEMIA_LAB_CDDA_PATTERN_NOTE_7_31_26.md',
    live: liveCDDA,
    shot: { name: 'BOHEMIA_LAB_CDDA_PROOF_7_31_26.png', setup: shotCDDA }
  },
  {
    /* LAB-05, commissioned by name: "Next emulation, whole mechanics: VALHEIM'S
       COMFORT LOOP... I play it and then rule Bohemia's survival system off the
       feel, not off a document." The first MODEL row: Valheim ships a compiled
       DLL, so most numbers are documented and every one is tagged. */
    id: 'VALHEIM COMFORT LOOP',
    game: 'Valheim',
    kind: 'MODEL',
    mechanics: ['food', 'rested', 'comfort'],
    minConsts: 40,
    page: 'slices/lab/BOHEMIA_LAB_VALHEIM_COMFORT_7_27_26.html',
    record: 'records/lab/BOHEMIA_LAB_VALHEIM_TEARDOWN_7_27_26.txt',
    pattern: 'records/lab/BOHEMIA_LAB_VALHEIM_PATTERN_NOTE_7_27_26.md',
    live: liveValheim,
    shot: { name: 'BOHEMIA_LAB_VALHEIM_PROOF_7_27_26.png', setup: shotValheim }
  },
  {
    /* LAB-03: the three mechanics standing in a world you walk around. This is
       the shape the lane ships in from now on — mechanics IN A PLACE. */
    id: 'STARDEW ONE WORLD',
    game: 'Stardew Valley',
    mechanics: ['fishing', 'farming', 'marriage'],
    page: 'slices/lab/BOHEMIA_LAB_STARDEW_WORLD_7_26_26.html',
    record: ['records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_TEARDOWN_7_26_26.txt',
             'records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_FEEL_LEDGER_7_26_26.txt',
             'records/lab/BOHEMIA_LAB_STARDEW_WORLD_NOTE_7_26_26.md'],
    pattern: 'records/lab/BOHEMIA_LAB_STARDEW_WORLD_NOTE_7_26_26.md',
    live: liveWorld,
    shot: { name: 'BOHEMIA_LAB_STARDEW_WORLD_PROOF_7_26_26.png', setup: shotWorld }
  },
  {
    id: 'STARDEW MECHANICS',
    game: 'Stardew Valley',
    mechanics: ['fishing', 'farming', 'marriage'],
    page: 'slices/lab/BOHEMIA_LAB_STARDEW_MECHANICS_7_26_26.html',
    record: 'records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_TEARDOWN_7_26_26.txt',
    pattern: 'records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_PATTERN_NOTE_7_26_26.md',
    live: liveMechanics,
    shot: { name: 'BOHEMIA_LAB_STARDEW_MECHANICS_PROOF_7_26_26.png', setup: shotMechanics }
  },
  {
    /* LAB-01. Kept and gated because it exists and Paolo did not kill it, but it
       is SUPERSEDED: its own record says so in its first lines, and it is the
       reason clause 1 exists. It is exempt from the three-mechanic rule and
       carries the exemption explicitly, so nobody reads it as a template. */
    id: 'STARDEW TOWN-WALK (superseded)',
    game: 'Stardew Valley',
    mechanics: [],
    supersededBy: 'laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md',
    page: 'slices/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_7_26_26.html',
    record: 'records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_FEEL_LEDGER_7_26_26.txt',
    pattern: 'records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_PATTERN_NOTE_7_26_26.md',
    live: liveTownWalk
  }
];

const DERIVED_KEYS = new Set(['DAY_START']);

console.log('='.repeat(74));
console.log('LAB GATE — mechanics not feel, the loop closes, never the game,');
console.log('           sourced numbers, measured on the real surface');
console.log('='.repeat(74));

/* ==========================================================================
   PART A — STATIC
   ========================================================================== */
function partA(em) {
  const tag = em.id;
  const P = path.join(ROOT, em.page);
  ok('A1 ' + tag + ': page exists', fs.existsSync(P));
  if (!fs.existsSync(P)) return null;
  const src = fs.readFileSync(P, 'utf8');

  /* --- clause 1: mechanics, not feel --- */
  if (em.supersededBy) {
    ok('A2 ' + tag + ': supersession is declared and the law exists',
       fs.existsSync(path.join(ROOT, em.supersededBy)));
    const note = fs.existsSync(path.join(ROOT, em.pattern)) ? fs.readFileSync(path.join(ROOT, em.pattern), 'utf8') : '';
    ok('A3 ' + tag + ': its own record says it was superseded', /RULED 7\/26|SUPERSEDED|superseded/.test(note));
  } else {
    ok('A2 ' + tag + ': declares >= 3 mechanics (' + em.mechanics.length + ')', em.mechanics.length >= 3);
    const bad = em.mechanics.filter(m => NOT_A_MECHANIC.indexOf(m.toLowerCase()) >= 0);
    ok('A3 ' + tag + ': no declared "mechanic" is really plumbing' + (bad.length ? ' (' + bad.join(',') + ')' : ''),
       bad.length === 0);
  }

  const bytes = Buffer.byteLength(src);
  ok('A4 page is small (' + Math.round(bytes / 1024) + 'KB < 220KB)', bytes < 220 * 1024);
  ok('A5 no giant base64 embed', !/[A-Za-z0-9+/]{600,}/.test(src));
  ok('A6 labeled REFERENCE', /REFERENCE (EMULATION|MODEL)/.test(src) && /NOT BOHEMIA/i.test(src));
  ok('A7 labeled PLACEHOLDER ART', /PLACEHOLDER ART/.test(src));
  ok('A8 names the game it emulates', src.indexOf(em.game) > 0);

  /* --- clause 3: never the game, outbound --- */
  const forbidden = [
    [/BOHEMIA_ALPHA/, 'the alpha'],
    [/\bBOH_[A-Z]/, 'a BOH_ engine module'],
    [/engine\/bohemia_/, 'an engine module path'],
    [/banks\/BOHEMIA_/, 'an art bank'],
    [/postMessage\s*\(/, 'postMessage']
  ];
  forbidden.forEach(([re, what], i) => {
    ok('A9.' + (i + 1) + ' does not reach into ' + what, !re.test(src));
  });

  /* --- clause 3: never the game, inbound --- */
  const shipped = [];
  const walk = (dir) => {
    for (const f of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      if (f.isDirectory()) continue;
      if (/\.(html|js)$/.test(f.name)) shipped.push(path.join(dir, f.name));
    }
  };
  walk('slices'); walk('engine');
  /* A shipped surface may not LOAD OR LINK a lab PAGE. Note what this is not:
     citing a lab RECORD in a comment is required by
     laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md (a ported mechanism
     carries its provenance), so the test is the page path and the page
     filename, never the word "lab". */
  const LAB_PAGE = /slices\/lab\/|BOHEMIA_LAB_[A-Z0-9_]+\.html/;
  const linkers = shipped.filter(f => LAB_PAGE.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
  ok('A10 no shipped surface loads or links a lab PAGE' + (linkers.length ? ' (' + linkers.join(', ') + ')' : ''),
     linkers.length === 0);

  /* --- clause 4: three deliverables --- */
  const recFiles = Array.isArray(em.record) ? em.record : [em.record];
  const recsExist = recFiles.every(f => fs.existsSync(path.join(ROOT, f)));
  ok('A11 numbers record(s) exist (' + recFiles.length + ')', recsExist);
  ok('A12 pattern note exists', fs.existsSync(path.join(ROOT, em.pattern)));
  if (!recsExist || !fs.existsSync(path.join(ROOT, em.pattern))) return null;
  const rec = recFiles.map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
  const note = fs.readFileSync(path.join(ROOT, em.pattern), 'utf8');

  /* --- clause 5: the numbers are sourced --- */
  /* VB added 8/7 for LAB-10 (Valheim's build system). */
  const block = src.match(/var (?:SDV|PZ|ADR|VH|CDDA|VW|CR|TY|VB) = \{([\s\S]*?)\n\};/);
  ok('A13 page declares a sourced-constant block', !!block);
  if (block) {
    const keys = [];
    block[1].split('\n').forEach(l => {
      const m = l.match(/^\s*([A-Z][A-Z0-9_]*):\s*(-?[0-9.]+)\s*,?/);
      if (m) keys.push([m[1], m[2]]);
    });
    const minConsts = em.minConsts || 25;
    ok('A14 constant block has >= ' + minConsts + ' sourced numbers (' + keys.length + ')',
       keys.length >= minConsts);
    const missing = [], unsourced = [], wrongVal = [], ours = [], sourced = [], doc = [], untagged = [];
    const lines = rec.split('\n');
    keys.forEach(([k, v]) => {
      const row = lines.find(l => new RegExp('^' + k + '\\s').test(l));
      if (!row) { missing.push(k); return; }
      const num = String(parseFloat(v));
      if (row.indexOf(v) < 0 && row.indexOf(num) < 0 && row.indexOf(Math.abs(parseFloat(v)) + '') < 0) wrongVal.push(k + '=' + v);
      /* a row may say "ours (declared)" instead of citing the master — that is
         the CONTENT escape hatch, and it is capped so nobody smuggles invented
         mechanism numbers through it. */
      if (/ours \(declared\)/.test(row)) { ours.push(k); return; }
      /* a citation is a real file in the master's tree: C# (Stardew), Lua
         (Zomboid), JS (A Dark Room) or C++ (Cataclysm: DDA, .cpp/.h). The
         extension is the proof that somebody
         opened the source instead of a wiki.
         A MODEL row has no such tree, so its proof is a TAG on every row —
         [SOURCED <file:line>] or [DOC <what documented it>] — and clause 7 makes
         an untagged row fail exactly like a missing citation. */
      if (em.kind === 'MODEL') {
        if (/\[SOURCED\b/.test(row)) { sourced.push(k); return; }
        if (/\[DOC\b/.test(row)) { doc.push(k); return; }
        untagged.push(k);
        return;
      }
      /* .cpp and .h added 7/31 for Cataclysm: DDA, the first C++ master. */
      if (!DERIVED_KEYS.has(k) && !/\.(cs|lua|js|cpp|h)\b/.test(row) && !/Utility\./.test(row)) unsourced.push(k);
    });
    ok('A15 every SDV key is in the record' + (missing.length ? ' (missing ' + missing.join(',') + ')' : ''),
       missing.length === 0);
    ok('A16 every row carries the page value' + (wrongVal.length ? ' (' + wrongVal.join(',') + ')' : ''),
       wrongVal.length === 0);
    ok('A17 every row cites a source file' + (unsourced.length ? ' (' + unsourced.join(',') + ')' : ''),
       unsourced.length === 0);
    ok('A17b at most 3 keys are "ours (declared)" (' + ours.length + (ours.length ? ': ' + ours.join(',') : '') + ')',
       ours.length <= 3);

    /* --- clause 7: a model is never mistaken for a measurement --- */
    if (em.kind === 'MODEL') {
      ok('A28 MODEL: every number is TAGGED [SOURCED] or [DOC] or declared ours (' +
         sourced.length + ' sourced / ' + doc.length + ' doc / ' + ours.length + ' ours' +
         (untagged.length ? ', UNTAGGED: ' + untagged.join(',') : '') + ')',
         untagged.length === 0);
      ok('A29 MODEL: at least one number is genuinely SOURCED, so it is not pure hearsay (' +
         sourced.length + ')', sourced.length >= 1);
      ok('A30 MODEL: the page says on its own face that it is a model and not a measurement',
         /NOT A MEASUREMENT/i.test(src) && /\bMODEL\b/.test(src));
      ok('A31 MODEL: the page declares kind MODEL to the harness', /kind:\s*'MODEL'/.test(src));
      ok('A32 MODEL: the record explains WHY there is no source',
         /NO SOURCE/.test(rec) && /compiled|DLL|assembly/i.test(rec));
      ok('A33 MODEL: the record lists what was actually tried and failed',
         /404/.test(rec) && /403|failed|FAILED/.test(rec));
      ok('A34 MODEL: the pattern note repeats the model warning, so a reader of ONE file cannot be fooled',
         /MODEL, not a measurement/i.test(note));
    }
  }

  ok('A18 record names the emulation page', rec.indexOf(path.basename(em.page)) > 0);
  ok('A19 record declares its source of truth', /decompiled|read directly/i.test(rec) ||
     (em.kind === 'MODEL' && /NO SOURCE/.test(rec)));
  if (!em.supersededBy) {
    ok('A20 record separates CONTENT from MECHANISM', /CONTENT/.test(rec) && /MECHANISM/.test(rec));
  }
  ok('A21 record says what is NOT implemented', /NOT IMPLEMENTED|NOT PORT|DOES NOT COPY|WHAT IS NOT HERE/i.test(rec));
  ok('A22 note has a WHAT NOT TO PORT section', /WHAT NOT TO PORT/i.test(note));
  ok('A23 note names its honest limits', /HONEST LIMIT/i.test(note));
  /* A24 hunts a CLAIM, and a claim is not a DENIAL. Fixed 7/31, the third time
     this gate has tripped on a page's own disclaimer (A10 on cited engine paths,
     A12 on the toast "no recipe, no item"): the CDDA note said "Nothing here is
     wired into the engine", which is the exact sentence the law wants written,
     and the check failed it. So the test is now per-line and skips a line that
     negates. Same lesson every time — match the structure of the claim, never
     the mention of the words.
     NOT per-line, either — that was the first attempt and it failed on the very
     note it was written for, because "Nothing here is / wired into the engine"
     is a hard-wrapped sentence and the denial sat on the line above. So the note
     is whitespace-collapsed first and the denial is looked for in the RUN-UP to
     each match. Prose does not respect line endings; a check on prose must not
     either.
     AND THE RUN-UP IS THE SENTENCE, not a fixed number of characters. A flat
     90-char window was the second attempt and it was WORSE than the bug: a real
     planted claim ("I wired it into the engine this afternoon") passed, because
     the sentence BEFORE it happened to contain the word "never". A negation only
     negates its own sentence. Caught by mutating in the other direction, which
     is the only reason this line is right — a gate tested one way is half
     tested. */
  const portClaim = /\b(ported|wired) (it )?into the (alpha|run|engine)\b/gi;
  const DENIAL = /\b(no|not|nothing|never|neither|without|until|only when)\b/i;
  const flat = note.replace(/\s+/g, ' ');
  const portClaims = [];
  let pm;
  while ((pm = portClaim.exec(flat)) !== null) {
    const before = flat.slice(0, pm.index);
    /* the start of the sentence the match sits in: after the last . ! ? or : */
    const cut = Math.max(before.lastIndexOf('. '), before.lastIndexOf('! '),
                         before.lastIndexOf('? '), before.lastIndexOf(': '));
    const runUp = before.slice(cut + 1);
    if (!DENIAL.test(runUp)) portClaims.push(flat.slice(pm.index, pm.index + 60));
  }
  ok('A24 note does not claim to have ported anything' +
     (portClaims.length ? ' ("' + portClaims[0] + '")' : ''),
     portClaims.length === 0);
  ok('A25 note either flags a pending or records that its question was RULED',
     /\[PENDING Paolo\]/.test(note) || /ruled/i.test(note));

  /* every declared mechanic must be named in both records */
  em.mechanics.forEach(m => {
    const re = new RegExp(m, 'i');
    ok('A26 ' + m + ' is torn down in the record', re.test(rec));
    ok('A27 ' + m + ' appears in the pattern note', re.test(note));
  });

  /* PER-ROW FORBIDDEN-FEATURE CHECKS. Everything above tests what a page DOES.
     A killed feature needs the opposite test: proof the row did not quietly bring
     it back. THE CRASH is the first row that needed one, because Paolo said
     "project zomboid" and the lazy reading of that is to reopen loot, which two
     verdicts killed. A gate with no check like this cannot enforce
     laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md at all. */
  if (em.id === 'THE CRASH') crashDidNotReopenLoot(src, rec, note);
  if (em.id === 'TEN YEARS COLD') coldHasNoEconomy(src, note);

  return { src, rec, note };
}

/* ==========================================================================
   PART B — LIVE: play all three loops
   ========================================================================== */
async function liveMechanics(page) {
  const S = await page.evaluate(() => window.LAB.SDV);
  /* SEED THE WHOLE ROW. This gate went red once inside the full suite and green
     standalone straight after, which is the signature of a coin flip: the catch
     checks below drive the real minigame and against Math.random even a carp
     escapes occasionally. A gate that is right most of the time is not a gate. */
  await page.evaluate(() => window.LAB.seedRNG(20260726));
  const declared = await page.evaluate(() => window.LAB.mechanics);
  ok('B0 the page declares the same mechanics the gate does',
     JSON.stringify(declared) === JSON.stringify(['fishing', 'farming', 'marriage']));

  /* ---------------- FISHING: play it to a catch ---------------- */
  const barH0 = S.BAR_BASE_H;
  const cast = await page.evaluate(() => {
    window.LAB.W.fishingLevel = 0;
    window.LAB.cast(0);
    return { barH: window.LAB.F.barH, prog: window.LAB.F.progress,
             bob: window.LAB.F.bobPos, live: window.LAB.F.live };
  });
  ok('B1 fishing: bar at level 0 is 96px (' + cast.barH + ')', cast.barH === barH0);
  ok('B2 fishing: the cast starts at 0.3 caught (' + cast.prog + ')', near(cast.prog, S.CATCH_START, 0.0001));
  ok('B3 fishing: the fish starts at 508 (' + cast.bob + ')', cast.bob === S.BOBBER_START);

  /* the exact gain rate, with the fish held inside the bar */
  const gain = await page.evaluate(() => {
    window.LAB.F.bobPos = window.LAB.F.barPos + window.LAB.F.barH / 2;
    window.LAB.F.bobSpeed = 0; window.LAB.F.bobTarget = -1; window.LAB.F.motionType = 2;
    const a = window.LAB.F.progress;
    for (let i = 0; i < 10; i++) {
      window.LAB.F.bobPos = window.LAB.F.barPos + window.LAB.F.barH / 2;
      window.LAB.fishTick(1, true);
    }
    return window.LAB.F.progress - a;
  });
  ok('B4 fishing: in the bar gains exactly 1/500 a tick (' + gain.toFixed(5) + ')',
     near(gain, S.CATCH_GAIN * 10, 0.0005));
  const loss = await page.evaluate(() => {
    window.LAB.F.bobPos = 0; window.LAB.F.bobSpeed = 0; window.LAB.F.bobTarget = -1;
    window.LAB.F.barPos = 400; window.LAB.F.motionType = 2;
    const a = window.LAB.F.progress;
    for (let i = 0; i < 10; i++) {
      window.LAB.F.bobPos = 0; window.LAB.F.barPos = 400;
      window.LAB.fishTick(1, false);
    }
    return a - window.LAB.F.progress;
  });
  ok('B5 fishing: out of the bar loses exactly 3/1000 a tick (' + loss.toFixed(5) + ')',
     near(loss, S.CATCH_LOSS * 10, 0.0005));
  ok('B6 fishing: losing is only 1.5x winning, not more', near(S.CATCH_LOSS / S.CATCH_GAIN, 1.5, 0.001));

  /* the loop closes: catch one by actually playing the minigame */
  const caught = await page.evaluate(() => {
    window.LAB.W.fishingLevel = 0; window.LAB.W.gold = 0; window.LAB.F.caught = 0;
    window.LAB.cast(0);
    return window.LAB.autoFish(40000);
  });
  ok('B7 fishing: THE LOOP CLOSES — a fish is landed by playing the bar', caught.live === false && caught.caught === 1);
  ok('B8 fishing: landing it paid gold (' + caught.gold + 'g)', caught.gold > 0);

  /* the whole skill tree is the bar getting taller */
  const level = await page.evaluate(() => {
    window.LAB.cast(0); window.LAB.autoFish(40000);
    const lvl = window.LAB.W.fishingLevel;
    window.LAB.cast(0);
    return { lvl: lvl, barH: window.LAB.F.barH };
  });
  ok('B9 fishing: levelling up really widens the bar (' + level.barH + 'px at level ' + level.lvl + ')',
     level.lvl >= 1 && level.barH === S.BAR_BASE_H + level.lvl * S.BAR_H_PER_LEVEL);
  /* the tolerance is the fish's body inside the bar, and the drawn extent is the
     TESTED extent — a one-unit step across the edge flips the outcome */
  const edge = await page.evaluate(() => {
    const r = {};
    window.LAB.cast(0);
    window.LAB.F.motionType = 2; window.LAB.F.bobTarget = -1; window.LAB.F.bobSpeed = 0;
    window.LAB.F.barPos = 200;
    const hold = (y) => {
      window.LAB.F.bobPos = y; window.LAB.F.barPos = 200;
      const a = window.LAB.F.progress; window.LAB.fishTick(1, false);
      return window.LAB.F.progress - a;
    };
    r.justInside = hold(200 + window.LAB.SDV.FISH_ABOVE);
    r.justOutside = hold(200 + window.LAB.SDV.FISH_ABOVE - 2);
    return r;
  });
  ok('B10 fishing: a fish exactly at the bar edge is INSIDE and gains',
     edge.justInside > 0);
  ok('B10b fishing: two units higher it is OUTSIDE and loses — the drawn edge IS the tested edge',
     edge.justOutside < 0);

  /* difficulty and level are both REAL, measured with one fixed controller */
  const rates = await page.evaluate(() => {
    function play(i, level) {
      window.LAB.W.fishingLevel = level;
      window.LAB.cast(i);
      let t = 0;
      while (window.LAB.F.live && t++ < 30000) {
        const F = window.LAB.F, c = F.barPos + F.barH / 2;
        window.LAB.fishTick(1, (F.bobPos - c - F.barSpeed * 10) < 0);
      }
      return window.LAB.F.progress >= 1;
    }
    const rate = (i, level, n) => { let w = 0; for (let k = 0; k < n; k++) if (play(i, level)) w++; return w / n; };
    return { easy: rate(0, 0, 10), hard: rate(4, 0, 10), hardLevelled: rate(4, 10, 10) };
  });
  ok('B11 fishing: an easy fish is really easier than a hard one (' +
     (rates.easy * 100) + '% vs ' + (rates.hard * 100) + '%)', rates.easy > rates.hard);
  ok('B11b fishing: THE SKILL TREE IS THE BAR — level 10 lands what level 0 cannot (' +
     (rates.hard * 100) + '% -> ' + (rates.hardLevelled * 100) + '%)', rates.hardLevelled > rates.hard);

  /* ---------------- FARMING: till, seed, water, sleep, harvest ---------------- */
  const farm = await page.evaluate(() => {
    const r = {};
    /* a WATERED tile advances exactly one phase-day; a DRY one advances zero */
    window.LAB.farmTool('hoe'); window.LAB.farmTap(0); window.LAB.farmTap(1);
    window.LAB.seedPick(3); window.LAB.fertPick(0);      /* MELON: summer, 12 days */
    window.LAB.farmTool('seed'); window.LAB.farmTap(0);
    r.melonSeasons = window.LAB.tile(0).crop.seasons.slice();
    /* PARSNIP on tile 1, watered */
    window.LAB.seedPick(0); window.LAB.farmTap(1);
    r.parsnipDays = window.LAB.tile(1).crop.phases.reduce((a, b) => a + b, 0);
    window.LAB.farmTool('can'); window.LAB.farmTap(1);
    r.wateredBefore = window.LAB.tile(1).state;
    const p0 = window.LAB.tile(1).crop.phase, d0 = window.LAB.tile(1).crop.dayOfPhase;
    window.LAB.setSeason('SPRING');
    window.LAB.sleep();
    r.advanced = (window.LAB.tile(1).crop.phase - p0) + (window.LAB.tile(1).crop.dayOfPhase - d0);
    r.driedOvernight = window.LAB.tile(1).state === 0;
    r.melonDead = window.LAB.tile(0).crop.dead;          /* summer crop, spring rollover */
    /* the dry tile: zero progress, and NOT dead */
    window.LAB.farmTool('hoe'); window.LAB.farmTap(2);
    window.LAB.farmTool('seed'); window.LAB.seedPick(0); window.LAB.farmTap(2);
    const q0 = window.LAB.tile(2).crop.dayOfPhase;
    window.LAB.sleep();
    r.dryProgress = window.LAB.tile(2).crop.dayOfPhase - q0;
    r.dryAlive = !window.LAB.tile(2).crop.dead;
    return r;
  });
  ok('B12 farming: a watered tile advances exactly one day (' + farm.advanced + ')', farm.advanced === 1);
  ok('B13 farming: soil dries overnight with no retaining soil', farm.driedOvernight === true);
  ok('B14 farming: a DRY tile advances ZERO days (' + farm.dryProgress + ')', farm.dryProgress === 0);
  ok('B15 farming: and a dry crop is NOT dead — a wasted day, not damage', farm.dryAlive === true);
  ok('B16 farming: a summer crop planted in spring dies at the rollover', farm.melonDead === true);
  ok('B17 farming: parsnip is a 4-day crop (' + farm.parsnipDays + ')', farm.parsnipDays === 4);

  /* Speed-Gro removes a percentage of TOTAL days, at planting */
  const speed = await page.evaluate(() => {
    window.LAB.farmTool('hoe'); window.LAB.farmTap(6);
    window.LAB.seedPick(3); window.LAB.fertPick(2);      /* MELON + deluxe speed-gro 25% */
    window.LAB.farmTool('seed'); window.LAB.farmTap(6);
    const withF = window.LAB.tile(6).crop.phases.reduce((a, b) => a + b, 0);
    const base = window.LAB.CROPS[3].phases.reduce((a, b) => a + b, 0);
    return { withF: withF, base: base };
  });
  ok('B18 farming: deluxe Speed-Gro removes 25% of the growth days (' + speed.base + ' -> ' + speed.withF + ')',
     speed.withF === speed.base - Math.ceil(speed.base * S.SPEEDGRO_DELUXE));

  /* THE LOOP CLOSES: grow a parsnip to harvest and sell it */
  const harvest = await page.evaluate(() => {
    window.LAB.farmTool('hoe'); window.LAB.farmTap(12);
    window.LAB.seedPick(0); window.LAB.fertPick(0);
    window.LAB.farmTool('seed'); window.LAB.farmTap(12);
    const gold0 = window.LAB.W.gold;
    let days = 0;
    while (!window.LAB.cropReady(12) && days++ < 30) {
      window.LAB.farmTool('can'); window.LAB.farmTap(12);
      window.LAB.setSeason('SPRING');
      window.LAB.sleep();
    }
    const ready = window.LAB.cropReady(12);
    window.LAB.farmTool('pick'); window.LAB.farmTap(12);
    return { ready: ready, days: days, earned: window.LAB.W.gold - gold0, gone: !window.LAB.tile(12).crop };
  });
  ok('B19 farming: THE LOOP CLOSES — planted, watered, grown and harvested in ' + harvest.days + ' days',
     harvest.ready === true && harvest.earned > 0);
  ok('B20 farming: a non-regrowing crop is consumed by the harvest', harvest.gone === true);

  /* regrowth reuses the same field, counting down */
  const regrow = await page.evaluate(() => {
    window.LAB.farmTool('hoe'); window.LAB.farmTap(18);
    window.LAB.seedPick(2); window.LAB.fertPick(0);      /* GREENBEAN, regrow 3 */
    window.LAB.farmTool('seed'); window.LAB.farmTap(18);
    let d = 0;
    while (!window.LAB.cropReady(18) && d++ < 40) {
      window.LAB.farmTool('can'); window.LAB.farmTap(18); window.LAB.setSeason('SPRING'); window.LAB.sleep();
    }
    window.LAB.farmTool('pick'); window.LAB.farmTap(18);
    const still = !!window.LAB.tile(18).crop;
    const left = still ? window.LAB.tile(18).crop.regrowLeft : -1;
    return { still: still, left: left };
  });
  ok('B21 farming: a regrowing crop survives its harvest', regrow.still === true);
  ok('B22 farming: and comes back in exactly its regrow days (' + regrow.left + ')', regrow.left === 3);

  /* ---------------- MARRIAGE: stranger to married ---------------- */
  const caps = await page.evaluate(() => {
    const r = {};
    window.LAB.L.married = false; window.LAB.L.status = 'FRIEND';
    r.undated = window.LAB.pointCap();
    window.LAB.L.status = 'DATING'; r.dating = window.LAB.pointCap();
    window.LAB.L.married = true; r.spouse = window.LAB.pointCap();
    window.LAB.L.married = false; window.LAB.L.status = 'FRIEND';
    return r;
  });
  ok('B22 marriage: an UNDATED villager caps at (8+1)*250-1 = 2249 (' + caps.undated + ')',
     caps.undated === (S.MAX_HEARTS_UNDATED + 1) * S.PER_HEART - 1);
  ok('B22b marriage: dating moves the cap to 2749 (' + caps.dating + ')',
     caps.dating === (S.MAX_HEARTS_DATING + 1) * S.PER_HEART - 1);
  ok('B22c marriage: marriage moves it to 3749 (' + caps.spouse + ')',
     caps.spouse === (S.MAX_HEARTS_SPOUSE + 1) * S.PER_HEART - 1);

  const gifts = await page.evaluate(() => {
    const r = {};
    window.LAB.setPoints(0);
    window.LAB.L.giftsToday = 0; window.LAB.L.giftsThisWeek = 0; window.LAB.L.talkedToday = false;
    window.LAB.gift(0);                                  /* loved */
    r.afterLove = window.LAB.L.points;
    window.LAB.gift(0);                                  /* blocked: 1 a day */
    r.afterSecondSameDay = window.LAB.L.points;
    window.LAB.L.giftsToday = 0;
    window.LAB.gift(0);                                  /* second of the week: allowed */
    r.afterSecondWeek = window.LAB.L.points;
    window.LAB.L.giftsToday = 0;
    window.LAB.gift(0);                                  /* third: blocked by the ration */
    r.afterThirdWeek = window.LAB.L.points;
    return r;
  });
  ok('B23 marriage: a loved gift is +80 (' + gifts.afterLove + ')', gifts.afterLove === S.GIFT_LOVE);
  ok('B24 marriage: one gift a day — the second is refused', gifts.afterSecondSameDay === gifts.afterLove);
  ok('B25 marriage: two a week is allowed (' + gifts.afterSecondWeek + ')', gifts.afterSecondWeek === S.GIFT_LOVE * 2);
  ok('B26 marriage: the third of the week is RATIONED OUT', gifts.afterThirdWeek === gifts.afterSecondWeek);

  const bday = await page.evaluate(() => {
    window.LAB.setPoints(0);
    window.LAB.L.giftsToday = 0; window.LAB.L.giftsThisWeek = 9;
    window.LAB.setBirthdayToday();
    window.LAB.gift(0);
    return window.LAB.L.points;
  });
  ok('B27 marriage: a birthday gift pays x8 AND beats the ration (' + bday + ')', bday === S.GIFT_LOVE * S.GIFT_BIRTHDAY_X);

  const talkDecay = await page.evaluate(() => {
    const r = {};
    window.LAB.L.birthdaySeason = 'WINTER';
    window.LAB.setPoints(500); window.LAB.L.talkedToday = false;
    window.LAB.talk(); r.afterTalk = window.LAB.L.points;
    window.LAB.talk(); r.afterSecondTalk = window.LAB.L.points;
    window.LAB.L.talkedToday = false;
    window.LAB.sleep(); r.afterIgnoredNight = window.LAB.L.points;
    return r;
  });
  ok('B28 marriage: talking is +20 (' + talkDecay.afterTalk + ')', talkDecay.afterTalk === 520);
  ok('B29 marriage: and only once a day', talkDecay.afterSecondTalk === 520);
  ok('B30 marriage: ignoring a stranger costs -2 a night (' + talkDecay.afterIgnoredNight + ')',
     talkDecay.afterIgnoredNight === 520 - S.DECAY_STRANGER);

  /* THE WALL: unlimited gifts cannot pass 8 hearts while undated */
  const wall = await page.evaluate(() => {
    window.LAB.L.status = 'FRIEND'; window.LAB.L.married = false; window.LAB.L.weddingIn = -1;
    window.LAB.setPoints(1960);
    for (let i = 0; i < 40; i++) { window.LAB.L.giftsToday = 0; window.LAB.L.giftsThisWeek = 0; window.LAB.gift(0); }
    const parked = window.LAB.L.points;
    window.LAB.court();
    return { parked: parked, status: window.LAB.L.status, cap: window.LAB.pointCap() };
  });
  ok('B31 marriage: THE WALL — 40 loved gifts stop dead at the undated cap (' + wall.parked + ')',
     wall.parked === (S.MAX_HEARTS_UNDATED + 1) * S.PER_HEART - 1);
  ok('B32 marriage: the bouquet at 2000 moves you to DATING', wall.status === 'DATING');

  const wed = await page.evaluate(() => {
    const r = {};
    window.LAB.setPoints(2400);
    window.LAB.court(); r.tooEarly = window.LAB.L.status;      /* under 2500: refused */
    window.LAB.setPoints(2500);
    window.LAB.court(); r.engaged = window.LAB.L.status; r.countdown = window.LAB.L.weddingIn;
    for (let d = 0; d < 3; d++) { window.LAB.L.talkedToday = true; window.LAB.sleep(); }
    r.married = window.LAB.L.married; r.status = window.LAB.L.status;
    r.cap = window.LAB.pointCap();
    window.LAB.L.talkedToday = false;
    const before = window.LAB.L.points;
    window.LAB.sleep();
    r.spouseDecay = before - window.LAB.L.points;
    return r;
  });
  ok('B33 marriage: the pendant is refused under 2500', wed.tooEarly === 'DATING');
  ok('B34 marriage: at 2500 it is accepted and the wedding is 3 days out (' + wed.countdown + ')',
     wed.engaged === 'ENGAGED' && wed.countdown === S.WEDDING_DELAY);
  ok('B35 marriage: THE LOOP CLOSES — stranger to MARRIED', wed.married === true && wed.status === 'MARRIED');
  ok('B36 marriage: marriage moves the ceiling to 14 hearts (' + wed.cap + ')',
     wed.cap === (S.MAX_HEARTS_SPOUSE + 1) * S.PER_HEART - 1);
  ok('B37 marriage: and ignoring a spouse costs -20, ten times a stranger (' + wed.spouseDecay + ')',
     wed.spouseDecay === S.DECAY_SPOUSE);

  /* the day is shared by all three mechanics, which is what makes it a game */
  const shared = await page.evaluate(() => {
    const d0 = window.LAB.day(); window.LAB.sleep(); return window.LAB.day() - d0;
  });
  ok('B38 one SLEEP advances the day for every mechanic at once', shared === 1);
  await page.evaluate(() => window.LAB.unseedRNG());
}

/* ==========================================================================
   PART B (LAB-03) — WALK THE WORLD AND PLAY EVERY LOOP STANDING IN IT.
   This is the check that matters: not "does fishing work" but "can you walk
   from your bed to the dock, catch a fish, walk to your plot, grow something,
   walk up to her, court her, and go to bed" — with the real movement code.
   ========================================================================== */
async function liveWorld(page) {
  const S = await page.evaluate(() => window.LAB.SDV);
  await page.evaluate(() => window.LAB.seedRNG(20260726));   /* same reason as above */

  const map = await page.evaluate(() => ({
    soil: window.LAB.soilCount(),
    house: window.LAB.furnitureCount('house'),
    shop: window.LAB.furnitureCount('shop'),
    housePlate: window.LAB.plateOf('house'),
    shopPlate: window.LAB.plateOf('shop')
  }));
  ok('W1 the world has a real plot to farm (' + map.soil + ' soil tiles)', map.soil >= 40);
  ok('W2 the house is furnished and has a bed', map.house >= 8);
  ok('W3 the shop is furnished', map.shop >= 8);

  /* the four contexts: the one button knows where it is */
  const ctx = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.place('town', 28, 24, 2); o.dock = L.context();
    L.place('town', 8, 13, 2);  o.plot = L.context();
    L.place('house', 2, 3, 0);  o.bed = L.context();
    L.place('town', 27, 12, 0);
    L.NPC.pos.x = 27 * 64; L.NPC.pos.y = 11 * 64; L.NPC.path = [];
    o.npc = L.context();
    L.place('town', 18, 17, 2); o.nothing = L.context();
    return o;
  });
  ok('W4 facing the water at the dock offers CAST', ctx.dock === 'FISH');
  ok('W5 facing the plot soil offers USE TOOL', ctx.plot === 'FARM');
  ok('W6 facing the bed offers SLEEP', ctx.bed === 'SLEEP');
  ok('W7 standing next to her offers TALK', ctx.npc === 'TALK');
  ok('W8 standing in an empty field offers nothing', ctx.nothing === null);

  /* THE WALKTHROUGH, one evaluate so the world state is continuous */
  const run = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.place('town', 8, 11, 2);
    L.setPoints(0); L.L.status = 'STRANGER'; L.L.married = false; L.L.weddingIn = -1;
    L.S.gold = 0; L.F.caught = 0; L.S.fishingLevel = 0;

    /* --- 1. walk from the front door to the plot and work it --- */
    o.reachedPlot = L.walkTo(8, 13);
    L.setFacing(2);
    L.tool('hoe'); L.act();   o.tilled = L.farmAt(8, 14).tilled;
    L.tool('seed'); L.seedPick(0); L.fertPick(0); L.act();
    o.planted = !!L.farmAt(8, 14).crop;
    o.phasesTotal = L.farmAt(8, 14).crop.phases.reduce((a, b) => a + b, 0);
    L.tool('can'); L.act();   o.watered = L.farmAt(8, 14).state;

    /* --- 2. walk the length of the map to the dock and land a fish --- */
    o.route = [L.walkTo(8, 11), L.walkTo(18, 11), L.walkTo(18, 21),
               L.walkTo(28, 21), L.walkTo(28, 24)].every(Boolean);
    o.atDock = L.standTile();
    L.setFacing(2);
    o.dockCtx = L.context();
    L.act();
    o.hooked = L.F.live;
    o.hookedName = L.F.fish ? L.F.fish.n : null;
    const fr = L.autoFish(30000);
    o.caught = fr.caught; o.goldFromFish = L.S.gold;

    /* --- 3. she is by the lake at lunchtime; walk up and court her --- */
    L.NPC.pos.x = 28 * 64; L.NPC.pos.y = 23 * 64; L.NPC.path = [];
    L.setFacing(0);
    o.npcCtx = L.context();
    L.setPoints(2000);
    L.act();
    o.modalOpened = L.S.modal;
    L.court();
    o.status = L.L.status;
    L.closeLove();
    o.modalClosed = L.S.modal === null;

    /* --- 4. walk home, in the door, to the bed, and sleep --- */
    o.routeHome = [L.walkTo(28, 21), L.walkTo(18, 21), L.walkTo(18, 11), L.walkTo(8, 11), L.walkTo(8, 10)].every(Boolean);
    let g = 0;
    L.setDirs([0]);
    while (L.S.map === 'town' && g++ < 500) L.step(1, [0], false);
    while (L.S.fadeDir !== 0 && g++ < 1200) L.step(1);
    L.setDirs([]);
    o.walkedInside = L.S.map;
    o.reachedBed = L.walkTo(2, 3);
    L.setFacing(0);
    o.bedCtx = L.context();
    const day0 = L.S.day, phase0 = L.farmAt(8, 14).crop.phase;
    L.act();
    o.dayAdvanced = L.S.day - day0;
    o.cropAdvanced = L.farmAt(8, 14).crop.phase - phase0;
    o.soilDried = L.farmAt(8, 14).state === 0;
    o.timeReset = L.S.timeOfDay;
    return o;
  });

  ok('W9 you can walk from the front door to your plot', run.reachedPlot === true);
  ok('W10 facing the soil and pressing the button TILLS it', run.tilled === true);
  ok('W11 the same button SEEDS it (parsnip, ' + run.phasesTotal + ' watered days)',
     run.planted === true && run.phasesTotal === 4);
  ok('W12 and WATERS it', run.watered === S.WATERED);
  ok('W13 you can walk the length of the map to the dock', run.route === true && run.atDock.x === 28 && run.atDock.y === 24);
  ok('W14 the dock offers CAST and the button hooks a fish (' + run.hookedName + ')',
     run.dockCtx === 'FISH' && run.hooked === true);
  ok('W15 FISHING LOOP CLOSES IN THE WORLD — landed and paid (' + run.goldFromFish + 'g)',
     run.caught === 1 && run.goldFromFish > 0);
  ok('W16 walking up to her opens the courtship, not a menu button', run.npcCtx === 'TALK' && run.modalOpened === 'love');
  ok('W17 MARRIAGE LOOP ADVANCES IN THE WORLD — the bouquet lands', run.status === 'DATING');
  ok('W18 and you can walk away from her again', run.modalClosed === true);
  ok('W19 you can walk home and in through your own front door', run.routeHome === true && run.walkedInside === 'house');
  ok('W20 you can reach your bed', run.reachedBed === true && run.bedCtx === 'SLEEP');
  ok('W21 SLEEPING ADVANCES THE DAY for the whole world at once', run.dayAdvanced === 1);
  ok('W22 FARMING LOOP RESOLVES AT SLEEP — the crop advanced a phase', run.cropAdvanced === 1);
  ok('W23 and the soil dried overnight, so tomorrow is another chore', run.soilDried === true);
  ok('W24 the clock resets to 6:00am (' + run.timeReset + ')', run.timeReset === S.DAY_START);

  /* the day is the ONLY thing the three mechanics share */
  const shared = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.place('town', 18, 17, 2);
    L.setPoints(600); L.L.talkedToday = false; L.L.status = 'FRIEND'; L.L.married = false;
    const p0 = L.L.points, d0 = L.S.day;
    L.sleep();
    o.friendshipDecayed = p0 - L.L.points;
    o.dayMoved = L.S.day - d0;
    o.npcScheduleReset = L.NPC.lastKey;
    return o;
  });
  ok('W25 one sleep also decays a friendship you ignored (-' + shared.friendshipDecayed + ')',
     shared.friendshipDecayed === S.DECAY_STRANGER);
  ok('W26 and resets her schedule for the new day', shared.npcScheduleReset === -1);

  /* the walk is still Stardew's walk, because that is what it is for */
  const walk = await page.evaluate(() => {
    const L = window.LAB;
    L.place('town', 18, 17, 2);
    const a = L.S.pos.x;
    L.step(60, [1], false);
    L.setDirs([]);
    return L.S.pos.x - a;
  });
  const walkExp = Math.max(S.MIN_STEP, S.WALK_SPEED * S.MOVE_MULT * (1000 / 60)) * 60;
  ok('W27 the walk underneath is still the measured 2.20 px/tick (' + (walk / 60).toFixed(2) + ')',
     Math.abs(walk - walkExp) < 0.5);
  await page.evaluate(() => window.LAB.unseedRNG());
}

async function shotWorld(page) {
  await page.evaluate(() => {
    const L = window.LAB;
    L.place('town', 8, 13, 2);
    L.tool('hoe');
    /* dress the plot so the shot shows a worked farm, not bare soil */
    [[7,14],[8,14],[9,14],[7,15],[8,15],[9,15],[7,16],[8,16],[9,16]].forEach(function (t) {
      const c = L.farmAt(t[0], t[1]); c.tilled = true; c.state = 1;
    });
    L.seedPick(0);
    [[7,14],[8,14],[9,14]].forEach(function (t) { L.setFacing(2); L.tool('seed'); L.farmAt(t[0], t[1]); });
    L.setTime(1000);
    L.thaw();
  });
}

async function shotMechanics(page) {
  await page.evaluate(() => {
    window.LAB.thaw();
    document.getElementById('tab_love').click();
  });
}

/* LAB-01, superseded: kept green so it cannot rot, not extended. */
async function liveTownWalk(page) {
  const S = await page.evaluate(() => window.LAB.SDV);
  const TICKMS = 1000 / 60;
  const walkExp = Math.max(S.MIN_STEP, S.WALK_SPEED * S.MOVE_MULT * TICKMS);
  const m = await page.evaluate(([P]) => {
    window.LAB.place(P.map, P.x, P.y);
    const a = window.LAB.S.pos.x;
    const b = window.LAB.step(60, [1], false);
    window.LAB.setDirs([]);
    return b.x - a;
  }, [{ map: 'town', x: 18 * 64, y: 17 * 64 }]);
  ok('B1 (superseded) the walk still measures 2.20 px/tick (' + (m / 60).toFixed(3) + ')',
     near(m, 60 * walkExp, 0.05));
  const rooms = await page.evaluate(() => ({
    house: window.LAB.furnitureCount('house'), shop: window.LAB.furnitureCount('shop')
  }));
  ok('B2 (superseded) both interiors are still furnished', rooms.house >= 8 && rooms.shop >= 8);
}

/* ==========================================================================
   PART B (LAB-05) — VALHEIM. Three mechanics, and the one that matters is the
   third: comfort has to convert FURNITURE into MINUTES, exactly, or the whole
   idea is a decoration. Every check drives the page's own function and the clock
   is the page's own tick(), so a twenty-four-minute buff is measured in
   milliseconds without a second copy of the maths.
   ========================================================================== */
async function liveValheim(page) {
  const V = await page.evaluate(() => window.LAB.VH);
  await page.evaluate(() => window.LAB.reset());
  const declared = await page.evaluate(() => window.LAB.mechanics);
  ok('V0 the page declares the same three mechanics he named',
     JSON.stringify(declared) === JSON.stringify(['food', 'rested', 'comfort']));
  ok('V0b and declares itself a MODEL', await page.evaluate(() => window.LAB.kind) === 'MODEL');

  /* ---------------- FOOD: three slots, stacking, decay ---------------- */
  const empty = await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    return { hp: L.maxHealth(), st: L.maxStamina(), slots: L.foods().length };
  });
  ok('V1 food: an empty stomach is exactly 25 health (' + empty.hp + ')', empty.hp === V.BASE_HEALTH);
  ok('V2 food: and 50 stamina (' + empty.st + ')', empty.st === V.BASE_STAMINA);

  const stack = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    ['boar', 'carrotsoup', 'queensjam', 'stew'].forEach(f => L.give(f, 2));
    o.ate1 = L.eat('boar');       o.hp1 = L.maxHealth();
    o.ate2 = L.eat('carrotsoup'); o.hp2 = L.maxHealth(); o.st2 = L.maxStamina();
    o.ate3 = L.eat('queensjam');  o.hp3 = L.maxHealth(); o.st3 = L.maxStamina();
    o.slots = L.foods().length;
    o.ate4 = L.eat('stew');       /* the fourth must be refused */
    o.slotsAfter = L.foods().length;
    o.canEatFresh = L.canEat('boar');   /* just eaten, still burning */
    return o;
  });
  ok('V3 food: eating stacks onto the base, not over it (' + stack.hp1 + ')',
     stack.ate1 === true && stack.hp1 === V.BASE_HEALTH + V.BOAR_HP);
  ok('V4 food: a second food stacks again (' + stack.hp2 + ' hp / ' + stack.st2 + ' st)',
     stack.hp2 === V.BASE_HEALTH + V.BOAR_HP + V.CARROTSOUP_HP &&
     stack.st2 === V.BASE_STAMINA + V.BOAR_ST + V.CARROTSOUP_ST);
  ok('V5 food: three foods is the whole build (' + stack.hp3 + ' hp / ' + stack.st3 + ' st)',
     stack.hp3 === V.BASE_HEALTH + V.BOAR_HP + V.CARROTSOUP_HP + V.QUEENSJAM_HP && stack.slots === 3);
  ok('V6 food: THE FOURTH IS REFUSED — three slots is a real decision',
     stack.ate4 === false && stack.slotsAfter === V.FOOD_SLOTS);
  ok('V7 food: and a food you just ate cannot be topped up', stack.canEatFresh === false);

  /* the buff DECAYS: the ceiling sags as the bar drains */
  const decay = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset(); L.give('boar', 3);
    L.eat('boar');
    o.full = L.maxHealth();
    L.tick(600);                                 /* half of boar's 1200 s */
    o.half = L.maxHealth();
    o.frac = L.foodFraction(L.foods()[0]);
    o.refusedAtExactlyHalf = L.canEat('boar');
    L.tick(1);
    o.canTopUpJustUnderHalf = L.canEat('boar');
    L.tick(598);
    o.nearlyGone = L.maxHealth();
    L.tick(2);
    o.expired = L.foods().length;
    o.backToBase = L.maxHealth();
    return o;
  });
  ok('V8 food: at half burnt the ceiling has sagged to half the bonus (' + decay.full +
     ' -> ' + decay.half + ')', decay.half === Math.round(V.BASE_HEALTH + V.BOAR_HP * 0.5));
  ok('V9 food: exactly half is still refused, a second under half is not — the edge is real',
     near(decay.frac, 0.5, 0.001) && decay.refusedAtExactlyHalf === false &&
     decay.canTopUpJustUnderHalf === true);
  ok('V10 food: when it burns out the slot frees and you are back to 25 (' + decay.backToBase + ')',
     decay.expired === 0 && decay.backToBase === V.BASE_HEALTH);

  /* AN EMPTY STOMACH NEVER KILLS YOU — the whole point of his clause (1) */
  const starve = await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    L.place(window.LAB.FIRE.x, window.LAB.FIRE.y + 2);
    L.tick(600);
    return { hp: L.S.health, max: L.maxHealth(), blackouts: L.S.blackouts };
  });
  ok('V11 food: TEN MINUTES WITH AN EMPTY STOMACH AND YOU ARE FINE, just small (' +
     Math.round(starve.hp) + '/' + starve.max + ')',
     starve.hp > 0 && starve.max === V.BASE_HEALTH && starve.blackouts === 0);

  /* ---------------- COMFORT: furniture becomes minutes ---------------- */
  const comfort = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.bare = L.comfort(); o.bareSec = L.restedDuration();
    o.roof = L.placePiece('roof');   o.afterRoof = L.comfort(); o.afterRoofSec = L.restedDuration();
    L.placePiece('rug');             o.afterRug = L.comfort();  o.afterRugSec = L.restedDuration();
    o.secondRug = L.placePiece('rug');
    o.afterSecondRug = L.comfort();
    L.placePiece('table');           o.afterTable = L.comfort();
    L.placePiece('roundtable');      o.afterRoundTable = L.comfort();
    return o;
  });
  ok('V12 comfort: a bare campfire is comfort 2 and 9 minutes (' + comfort.bare + ', ' +
     comfort.bareSec + 's)',
     comfort.bare === V.COMFORT_BASE + 1 &&
     comfort.bareSec === V.RESTED_BASE_SEC + V.RESTED_SEC_PER_COMFORT);
  ok('V13 comfort: a ROOF adds exactly one comfort and exactly 60 seconds (' +
     comfort.afterRoofSec + 's)',
     comfort.afterRoof === comfort.bare + 1 &&
     comfort.afterRoofSec === comfort.bareSec + V.RESTED_SEC_PER_COMFORT);
  ok('V14 comfort: A RUG IS A MINUTE — decorating literally makes you stronger (' +
     comfort.afterRugSec + 's)',
     comfort.afterRug === comfort.afterRoof + 1 &&
     comfort.afterRugSec === comfort.afterRoofSec + V.RESTED_SEC_PER_COMFORT);
  ok('V15 comfort: A SECOND RUG IS NOTHING — one item per CATEGORY, no stacking exploit',
     comfort.secondRug === false && comfort.afterSecondRug === comfort.afterRug);
  ok('V16 comfort: a table adds one, and a ROUND table replaces it for two (' +
     comfort.afterTable + ' -> ' + comfort.afterRoundTable + ')',
     comfort.afterTable === comfort.afterRug + 1 &&
     comfort.afterRoundTable === comfort.afterTable + 1);

  /* the radius is the mechanism: a piece outside 10 m does not count */
  const radius = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    L.placePiece('bed');
    o.inside = L.comfort();
    const bed = L.pieces().find(p => p.id === 'bed');
    bed.x = L.FIRE.x + 11; bed.y = L.FIRE.y;      /* one metre too far */
    o.outside = L.comfort();
    o.counted = L.nearbyPieces().length;
    return o;
  });
  ok('V17 comfort: THE 10 m RADIUS IS REAL — a bed 11 m away stops counting (' +
     radius.inside + ' -> ' + radius.outside + ')', radius.outside === radius.inside - 1);

  /* the documented ceiling holds: comfort 17 is 24 minutes */
  const ceiling = await page.evaluate(() => {
    const L = window.LAB;
    return { maxSec: L.VH.RESTED_BASE_SEC + (L.VH.COMFORT_MAX - L.VH.COMFORT_BASE) * L.VH.RESTED_SEC_PER_COMFORT };
  });
  ok('V18 comfort: comfort 17 works out to the documented 24 minutes (' +
     (ceiling.maxSec / 60) + ')', ceiling.maxSec === 1440);

  /* ---------------- RESTED: the twenty-second ritual ---------------- */
  const rested = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    L.place(L.FIRE.x, L.FIRE.y);
    o.atFire = L.atFire();
    o.noRoof = L.underRoof();
    o.cannotRestYet = L.canRest();               /* no roof yet */
    L.placePiece('roof');
    o.canRestNow = L.canRest();
    L.tick(19);
    o.at19 = L.isRested();
    L.tick(1.1);
    o.at20 = L.isRested();
    o.ttl = L.restedTTL();
    o.expected = L.restedDuration();
    o.hpMult = L.hpRegenMult();
    o.stMult = L.stRegenMult();
    return o;
  });
  ok('V19 rested: standing at the fire with NO ROOF is not resting',
     rested.atFire === true && rested.noRoof === false && rested.cannotRestYet === false);
  ok('V20 rested: a roof makes the spot a resting spot', rested.canRestNow === true);
  ok('V21 rested: NOT rested at 19 seconds', rested.at19 === false);
  ok('V22 rested: RESTED at 20 — the ritual is a real threshold', rested.at20 === true);
  ok('V23 rested: and it lasts exactly what the camp earns (' + rested.ttl + 's of ' +
     rested.expected + 's)', near(rested.ttl, rested.expected, 1.2));
  ok('V24 rested: while rested, regen is x1.5 health and x2 stamina',
     rested.hpMult === V.RESTED_HP_REGEN_MULT && rested.stMult === V.RESTED_ST_REGEN_MULT);

  const wearoff = await page.evaluate(() => {
    const L = window.LAB, o = {};
    o.before = L.isRested();
    L.setDirs([2]);                              /* walk away, resting resets */
    L.tick(1);
    o.restingReset = L.resting();
    L.setDirs([]);
    /* you cannot lose Rested while standing in your own camp — it re-grants every
       tick — so walk out of the camp before waiting it out. */
    L.place(L.FIRE.x, L.FIRE.y - 8);
    o.stillRestedAwayFromCamp = L.isRested();
    L.tick(L.restedTTL() + 1);
    o.after = L.isRested();
    o.mult = L.hpRegenMult();
    return o;
  });
  ok('V25 rested: walking away resets the RESTING progress', wearoff.restingReset === 0);
  ok('V26 rested: the buff travels with you out of camp, then runs out and takes the bonus',
     wearoff.before === true && wearoff.stillRestedAwayFromCamp === true &&
     wearoff.after === false && wearoff.mult === 1);

  /* rested actually changes the recovery, measured on the bar */
  const regen = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    L.place(L.FIRE.x, L.FIRE.y + 3);
    L.S.stamina = 0;
    L.tick(2);
    o.plain = L.S.stamina;
    L.reset();
    L.place(L.FIRE.x, L.FIRE.y);
    L.placePiece('roof');
    L.tick(21);
    L.S.stamina = 0;
    L.tick(2);
    o.buffed = L.S.stamina;
    return o;
  });
  ok('V27 rested: stamina really comes back twice as fast (' + Math.round(regen.plain) +
     ' vs ' + Math.round(regen.buffed) + ' in 2s)',
     near(regen.buffed, regen.plain * V.RESTED_ST_REGEN_MULT, 1.5));

  /* ---------------- THE MOUNTAIN: why any of it matters ---------------- */
  const cold = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.meadow = L.zoneAt(13, 45);
    o.forest = L.zoneAt(13, 30);
    o.mountain = L.zoneAt(13, 4);
    L.place(13, 4);
    o.freezing = L.freezing();
    const h0 = L.S.health;
    L.tick(5);
    o.lost = h0 - L.S.health;
    return o;
  });
  ok('V28 the world has three zones and the top one is freezing',
     cold.meadow === 'meadow' && cold.forest === 'forest' && cold.mountain === 'mountain' &&
     cold.freezing === true);
  ok('V29 freezing costs exactly 1 health a second (' + cold.lost.toFixed(1) + ' in 5s)',
     near(cold.lost, 5 * V.FREEZING_HP_PER_SEC, 0.2));

  /* THE LOOP CLOSES: empty you cannot make the trip; fed and rested you can */
  const trip = await page.evaluate(() => {
    const L = window.LAB, o = {};
    /* --- empty stomach, no rested: the cairn is reachable, home is not --- */
    L.reset();
    L.place(L.FIRE.x, L.FIRE.y + 1);
    o.emptyReachedPeak = L.walkTo(13, 1, 20000);
    o.emptyHpAtPeak = L.S.health;
    o.emptyBlackoutsAtPeak = L.S.blackouts;
    L.walkTo(L.FIRE.x, L.FIRE.y, 20000);
    o.emptyBlackouts = L.S.blackouts;
    /* --- fed and rested --- */
    L.reset();
    L.place(L.FIRE.x, L.FIRE.y);
    ['stew', 'jerky', 'boar'].forEach(f => L.give(f, 1));
    L.eat('stew'); L.eat('jerky'); L.eat('boar');
    o.fedMax = L.maxHealth();
    L.placePiece('roof'); L.placePiece('rug'); L.placePiece('bed');
    L.placePiece('stool'); L.placePiece('roundtable'); L.placePiece('banner');
    o.comfort = L.comfort();
    o.restedFor = L.restedDuration();
    L.tick(21);
    o.rested = L.isRested();
    o.fedArrived = L.walkTo(13, 1, 20000);
    o.hpAtPeak = L.S.health;
    o.gotThere = Math.abs(L.at().y - 1) <= 0.5;
    /* and the cairn at the top is the payoff */
    const node = L.forageAt(13, 1);
    o.tookPrize = node ? L.forage(node) : false;
    o.backHome = L.walkTo(L.FIRE.x, L.FIRE.y, 20000);
    o.blackouts = L.S.blackouts;
    o.survived = L.S.health > 0;
    return o;
  });
  ok('V30 THE LOOP: EMPTY, YOU REACH THE CAIRN ON ' + Math.round(trip.emptyHpAtPeak) +
     ' HEALTH AND THE MOUNTAIN KILLS YOU ON THE WAY DOWN (blackouts ' + trip.emptyBlackouts + ')',
     trip.emptyReachedPeak === true && trip.emptyBlackoutsAtPeak === 0 &&
     trip.emptyBlackouts >= 1);
  ok('V31 THE LOOP: three foods take you from 25 to ' + trip.fedMax + ' max health',
     trip.fedMax > V.BASE_HEALTH * 3);
  ok('V32 THE LOOP: a decorated camp is comfort ' + trip.comfort + ' = ' +
     Math.round(trip.restedFor / 60) + ' minutes of Rested',
     trip.comfort >= 7 && trip.restedFor >= V.RESTED_BASE_SEC + 6 * V.RESTED_SEC_PER_COMFORT);
  ok('V33 THE LOOP: FED AND RESTED YOU REACH THE PEAK (health ' +
     Math.round(trip.hpAtPeak) + ')', trip.rested === true && trip.gotThere === true);
  ok('V34 THE LOOP: and the cairn at the top pays out', trip.tookPrize === true);
  ok('V35 THE LOOP CLOSES: you get home alive, which is the whole point of the buffs',
     trip.backHome === true && trip.survived === true && trip.blackouts === 0);

  /* the three mechanics are one loop: remove comfort and the trip gets shorter */
  const coupled = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset(); L.place(L.FIRE.x, L.FIRE.y); L.placePiece('roof');
    L.tick(21); o.plainTTL = L.restedTTL();
    L.reset(); L.place(L.FIRE.x, L.FIRE.y);
    ['roof', 'rug', 'bed', 'stool', 'table', 'banner', 'maypole'].forEach(p => L.placePiece(p));
    L.tick(21); o.dressedTTL = L.restedTTL();
    return o;
  });
  ok('V36 THE THREE ARE ONE LOOP: the same ritual in a dressed camp buys ' +
     Math.round((coupled.dressedTTL - coupled.plainTTL) / 60) + ' more minutes',
     coupled.dressedTTL > coupled.plainTTL + 5 * V.RESTED_SEC_PER_COMFORT - 2);
}

/* ==========================================================================
   PART B — LIVE: CDDA ACTION COST (LAB-06)

   Five mechanics, and the ONE thing that has to be true or the whole finding is
   decoration: the cost of an action must be FIXED while the TIME it eats moves
   with your condition, and the ratio between best and worst must be capped.
   Every check below drives the page's own functions through window.LAB, so it
   tests the shipped maths and not a copy of it.
   ========================================================================== */
async function liveCDDA(page) {
  const C = await page.evaluate(() => window.LAB.CDDA);
  await page.evaluate(() => window.LAB.reset());

  const declared = await page.evaluate(() => window.LAB.mechanics);
  ok('D0 the page declares the five mechanics the record declares',
     JSON.stringify(declared) === JSON.stringify(['action cost', 'condition', 'travel', 'errands', 'sleep debt']));

  /* ---------------- 1. ACTION COST: fixed, in moves ---------------- */
  const moves = await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    const fresh = L.ACTIONS.map(a => L.actionMoves(a));
    L.setCondition({ overloadPct: 200, pain: 40, thirst: 100 });   /* wrecked */
    const wrecked = L.ACTIONS.map(a => L.actionMoves(a));
    return { fresh, wrecked, thirty: L.movesForMinutes(30), one: L.movesForMinutes(1) };
  });
  ok('D1 cost: a minute is 6,000 moves and 30 minutes is 180,000 (' + moves.thirty + ')',
     moves.one === 60 * C.MOVES_PER_TURN && moves.thirty === 30 * 60 * C.MOVES_PER_TURN);
  ok('D2 cost: THE COST DOES NOT MOVE WHEN YOU DO — wrecked costs the same moves as fresh',
     JSON.stringify(moves.fresh) === JSON.stringify(moves.wrecked));

  /* ---------------- 2. CONDITION: the divisor, and its cap ---------------- */
  const cond = await page.evaluate(() => {
    const L = window.LAB, job = L.ACTIONS[2], o = {};
    L.reset();
    o.freshSpeed = L.speed(); o.freshMin = L.costMinutes(job);
    /* each penalty alone, so the three are individually proven */
    L.reset(); L.setCondition({ overloadPct: 100 });
    o.weightOnly = L.speed(); o.carry = L.carryPenalty();
    L.reset(); L.setCondition({ pain: 20 });
    o.painOnly = L.speed();
    L.reset(); L.setCondition({ thirst: 40 });
    o.atThreshold = L.speed();
    L.setCondition({ thirst: 60 });
    o.pastThreshold = L.speed();
    /* halve the speed and the same job must cost exactly double */
    L.reset(); L.setCondition({ pain: 50 });
    o.halfSpeed = L.speed(); o.halfMin = L.costMinutes(job);
    return o;
  });
  ok('D3 condition: fresh is base speed and a 30-minute job costs 30 minutes (' +
     cond.freshSpeed + ', ' + cond.freshMin.toFixed(1) + ')',
     cond.freshSpeed === C.BASE_SPEED && near(cond.freshMin, 30, 0.01));
  ok('D4 condition: 100% over your cap is exactly -25 speed (' + cond.weightOnly + ')',
     cond.carry === C.CARRY_PENALTY_PER_OVERLOAD &&
     cond.weightOnly === C.BASE_SPEED - C.CARRY_PENALTY_PER_OVERLOAD);
  ok('D5 condition: pain comes straight off the speed (' + cond.painOnly + ')',
     cond.painOnly === C.BASE_SPEED - 20);
  ok('D6 condition: THIRST IS A THRESHOLD, NOT A SLOPE — 40 is free, 60 costs 20 (' +
     cond.atThreshold + ' -> ' + cond.pastThreshold + ')',
     cond.atThreshold === C.BASE_SPEED &&
     cond.pastThreshold === C.BASE_SPEED - (60 - C.THIRST_PENALTY_AT));
  ok('D7 condition: HALF THE SPEED IS DOUBLE THE TIME, on the same fixed cost (' +
     cond.halfSpeed + ' -> ' + cond.halfMin.toFixed(1) + ' min)',
     cond.halfSpeed === 50 && near(cond.halfMin, 60, 0.01));

  const floor = await page.evaluate(() => {
    const L = window.LAB, job = L.ACTIONS[2], o = {};
    L.reset();
    L.setCondition({ overloadPct: 2000, pain: 60, thirst: 120 });   /* absurd */
    o.raw = L.rawSpeed(); o.speed = L.speed(); o.atFloor = L.atFloor();
    o.min = L.costMinutes(job); o.mult = L.worstMultiplier();
    o.stepSec = L.secondsFor(L.CDDA.STEP_BASE_MOVES);
    /* and it does not keep sinking when you pile on more */
    L.setCondition({ overloadPct: 20000, pain: 60, thirst: 120 });
    o.speedAgain = L.speed(); o.minAgain = L.costMinutes(job);
    return o;
  });
  ok('D8 floor: raw speed would be ' + floor.raw + ', the page holds it at 25',
     floor.raw < 0 && floor.speed === Math.round(C.BASE_SPEED * C.SPEED_FLOOR_PCT / 100) &&
     floor.atFloor === true);
  ok('D9 floor: SO THE WORST AN ACTION EVER COSTS IS 4x — 30 minutes becomes 120, never more (' +
     floor.min.toFixed(0) + ' min, x' + floor.mult + ')',
     near(floor.min, 120, 0.01) && floor.mult === 4);
  ok('D10 floor: piling on ten times the penalty changes nothing — A BAD DAY CANNOT BECOME ' +
     'AN INFINITE ONE', floor.speedAgain === floor.speed && near(floor.minAgain, floor.min, 0.001));
  ok('D11 floor: and a step obeys the same cap — 1.00 s fresh, ' + floor.stepSec.toFixed(2) +
     ' s at the floor', near(floor.stepSec, 4, 0.01));

  /* the day actually burns when you press a button — his clause 17 in one check */
  const day = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.before = L.spent();
    L.doAction('medium');
    o.freshSpent = L.spent();
    L.reset();
    L.setCondition({ pain: 50 });
    L.doAction('medium');
    o.wreckedSpent = L.spent();
    o.clock = L.clockText();
    return o;
  });
  ok('D12 the day: pressing ONE button spends 30 minutes of the clock (' +
     (day.freshSpent / 60).toFixed(0) + ' min)',
     day.before === 0 && near(day.freshSpent, 1800, 1));
  ok('D13 the day: THE SAME BUTTON COSTS A WRECKED PLAYER TWICE THE DAY (' +
     (day.wreckedSpent / 60).toFixed(0) + ' min) — this is his clause 17, measured',
     near(day.wreckedSpent, day.freshSpent * 2, 1));

  /* ---------------- 3. TRAVEL: base + rate ---------------- */
  const travel = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.zero = L.travelMinutes(0); o.one = L.travelMinutes(1);
    o.three = L.travelMinutes(3); o.eight = L.travelMinutes(8);
    /* travel is a wall-clock estimate in their code, so speed must NOT divide it */
    L.reset(); L.doTravel(3);
    o.freshSec = L.spent();
    L.reset(); L.setCondition({ pain: 50 }); L.doTravel(3);
    o.wreckedSec = L.spent();
    return o;
  });
  ok('D14 travel: THE BASE IS REAL — going nowhere still costs 20 minutes (' + travel.zero + ')',
     travel.zero === C.TRAVEL_BASE_MIN);
  ok('D15 travel: and then it is a flat rate per distance (' + travel.one + '/' + travel.three +
     '/' + travel.eight + ')',
     travel.one === C.TRAVEL_BASE_MIN + C.TRAVEL_PER_DIST_MIN &&
     travel.three === C.TRAVEL_BASE_MIN + 3 * C.TRAVEL_PER_DIST_MIN &&
     travel.eight === C.TRAVEL_BASE_MIN + 8 * C.TRAVEL_PER_DIST_MIN);
  ok('D16 travel: THEIR TRIP IS A WALL-CLOCK ESTIMATE — condition does NOT divide it, and ' +
     'that is the divergence worth arguing about',
     near(travel.freshSec, 50 * 60, 1) && near(travel.wreckedSec, travel.freshSec, 0.001));

  /* ---------------- 4. ERRANDS: a declared block, paid rate x hours ------- */
  const errand = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.payouts = L.ERRANDS.map(e => L.payoutFor(e.id));
    o.sent = L.sendErrand('long');
    o.doubleSend = L.sendErrand('short');           /* one at a time */
    o.readyAtOnce = L.errandReady();
    o.earlyCollect = L.collectErrand();
    /* work the day until the block is done — the errand finishes while you work */
    for (let i = 0; i < 21; i++) L.doAction('long');
    o.readyAfter = L.errandReady();
    o.got = L.collectErrand();
    o.gone = L.errand();
    o.collectTwice = L.collectErrand();
    return o;
  });
  ok('D17 errands: the payout is the RATE TIMES THE HOURS (' + errand.payouts.join('/') + ')',
     JSON.stringify(errand.payouts) === JSON.stringify([
       C.PAYOUT_LOW * C.ERRAND_SHORT_H, C.PAYOUT_MID * C.ERRAND_MED_H,
       C.PAYOUT_HIGH * C.ERRAND_LONG_H, C.PAYOUT_HIGH * C.ERRAND_MAX_H]));
  ok('D18 errands: you commit the block up front and only one person is out',
     errand.sent === true && errand.doubleSend === false);
  ok('D19 errands: THERE IS NO COLLECTING EARLY — the block is the cost',
     errand.readyAtOnce === false && errand.earlyCollect === 0);
  ok('D20 errands: it finishes while you spend your own day, and pays 5 x 10 = ' +
     (C.PAYOUT_HIGH * C.ERRAND_LONG_H) + ' (' + errand.got + ')',
     errand.readyAfter === true && errand.got === C.PAYOUT_HIGH * C.ERRAND_LONG_H &&
     errand.gone === null && errand.collectTwice === 0);

  /* ---------------- 5. SLEEP DEBT: a ladder whose first rung is 2 days ---- */
  const sleep = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.startTier = L.sleepTier(); o.startAwake = L.awakeMin();
    /* a whole hard day of work is still nothing on their ladder */
    for (let i = 0; i < 16; i++) L.doAction('long');
    o.afterADay = L.awakeMin(); o.tierAfterADay = L.sleepTier();
    o.tiers = [];
    [0, 2, 4, 7, 10, 14].forEach(d => {
      L.setAwakeMin(d * 24 * 60);
      o.tiers.push(L.sleepTier());
    });
    L.setAwakeMin(2 * 24 * 60 - 1);
    o.justUnderFirstRung = L.sleepTier();
    /* sleeping pays it down, and cannot go negative */
    L.setAwakeMin(3 * 24 * 60);
    L.doSleep(8);
    o.afterSleep = L.awakeMin();
    L.setAwakeMin(60);
    L.doSleep(8);
    o.floored = L.awakeMin();
    o.sleepCostsTheClock = L.spent();
    return o;
  });
  ok('D21 sleep: you start with no debt at all',
     sleep.startTier === 'FINE' && sleep.startAwake === 0);
  ok('D22 sleep: SIXTEEN HOURS OF WORK IS STILL "FINE" — one rough day is free (' +
     Math.round(sleep.afterADay) + ' min awake)',
     near(sleep.afterADay, 16 * 60, 1) && sleep.tierAfterADay === 'FINE');
  ok('D23 sleep: the ladder climbs exactly on their rungs (' + sleep.tiers.join('>') + ')',
     JSON.stringify(sleep.tiers) === JSON.stringify(
       ['FINE', 'HARMLESS', 'MINOR', 'SERIOUS', 'MAJOR', 'MASSIVE']));
  ok('D24 sleep: ONE MINUTE UNDER TWO DAYS AND NOTHING HAS HAPPENED YET — the first rung is ' +
     'the finding', sleep.justUnderFirstRung === 'FINE');
  ok('D25 sleep: sleeping pays the debt at 1:1 and stops at zero (' +
     Math.round(sleep.afterSleep) + ', ' + sleep.floored + ')',
     near(sleep.afterSleep, 3 * 24 * 60 - 480, 1) && sleep.floored === 0);
  ok('D26 sleep: AND SLEEP COSTS THE DAY LIKE EVERYTHING ELSE DOES',
     sleep.sleepCostsTheClock >= 8 * 3600);

  /* the whole point, in one line: a stable table and a moving day */
  const bridge = await page.evaluate(() => {
    const L = window.LAB;
    const out = [];
    [0, 25, 50, 75].forEach(p => {
      L.reset(); L.setCondition({ pain: p });
      out.push({ pain: p, moves: L.actionMoves(L.ACTIONS[2]), min: L.costMinutes(L.ACTIONS[2]) });
    });
    return out;
  });
  const sameMoves = bridge.every(r => r.moves === bridge[0].moves);
  const risingTime = bridge.every((r, i) => i === 0 || r.min >= bridge[i - 1].min);
  const capped = bridge[bridge.length - 1].min <= bridge[0].min * 4 + 0.001;
  ok('D27 THE FINDING, MEASURED: one fixed cost (' + bridge[0].moves.toLocaleString() +
     ' moves) turns into ' + bridge.map(r => r.min.toFixed(0)).join('/') + ' minutes as you ' +
     'degrade, and never past 4x', sameMoves && risingTime && capped);
}

/* ==========================================================================
   PART B — LIVE: VALHEIM WEAPON TYPES (LAB-07)

   The claim this row makes is that a weapon system can be a set of EARNED
   MULTIPLIERS rather than a ladder of bigger numbers. So the checks are not
   "does a sword do 30" — they are, for each of the four multipliers: does it
   actually multiply, is it EARNED (can you fail to get it), and does the
   pipeline apply them in Valheim's documented order (per-type resistance, then
   skill, then position, then stagger, then armour on the total)?

   The skill roll is pinned by the gate (resolveHit takes an explicit roll) so
   five random mechanics can be measured exactly. That parameter exists FOR this,
   and the page defaults it to random for play.
   ========================================================================== */
/* ==========================================================================
   LAB-10 — VALHEIM'S BUILD SYSTEM. Five loops, all five played to completion
   through the page's own functions.

   THE ONE CHECK THAT MATTERS IS B28. Everything else proves a loop closes; B28
   proves the FINDING, and it proves it the only way a finding can be proved:
   by changing one thing and measuring that exactly one of three answers moved.
   ========================================================================== */
async function liveValheimBuild(page) {
  const V = await page.evaluate(() => window.LAB.VB);
  await page.evaluate(() => window.LAB.reset());

  const declared = await page.evaluate(() => window.LAB.mechanics);
  ok('B0 the page declares the five mechanics the record declares',
     JSON.stringify(declared) === JSON.stringify(
       ['building', 'crafting', 'deconstructing', 'upgrading', 'spawn suppression']));
  ok('B0b and declares itself a MODEL', await page.evaluate(() => window.LAB.kind) === 'MODEL');

  /* ---------------- 1. BUILDING: and the exemption that is the finding ------ */
  const build = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.stationsAtStart = L.stations().length;
    /* a NON-station piece on bare dirt, standing right on the cell */
    L.moveTo(7, 9);
    o.floorBefore = L.status(7, 9, 'floor');
    /* the station itself, on the same bare dirt */
    o.benchPlaced = L.teleportPlace(7, 9, 'workbench');
    /* the SAME non-station piece, one cell over, now that a bench exists */
    o.floorAfter = L.status(8, 9, 'floor');
    o.floorPlaced = L.teleportPlace(8, 9, 'floor');
    return o;
  });
  ok('B1 building: A STATION IS PLACEABLE ON BARE DIRT with no station in range — ' +
     'the exemption that makes your first tap always work',
     build.stationsAtStart === 0 && build.benchPlaced.ok === true);
  ok('B2 building: and a NON-station piece on that same dirt is refused for exactly ' +
     'that reason ("' + build.floorBefore.reason + '")',
     build.floorBefore.status === 'Invalid' &&
     build.floorBefore.reason === 'needs a station in range');
  ok('B3 building: THE LOOP CLOSES — the refused piece becomes legal the moment the ' +
     'bench exists, and places',
     build.floorAfter.status === 'Valid' && build.floorPlaced.ok === true);

  const statuses = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    L.teleportPlace(7, 9, 'workbench');
    L.moveTo(7, 9);
    o.set = [
      L.status(8, 9, 'floor').status,        /* valid */
      L.status(7, 9, 'floor').status,        /* occupied */
      L.status(-1, 9, 'floor').status,       /* off the map */
      L.status(99, 99, 'floor').status,      /* off the map */
      L.status(3, 3, 'campfire').status,     /* the no-build zone */
      L.status(7, 18, 'campfire').status     /* out of reach */
    ];
    o.noBuild = L.status(3, 3, 'campfire');
    /* MAX_PLACE_DIST is 8 m and a cell is 2.5 m, so 3 cells (7.5 m) is in reach
       and 4 cells (10 m) is not. The boundary is a metre boundary, not a cell
       count, which is the whole reason the page converts at the edge. */
    o.threeCells = L.status(7, 12, 'campfire');
    o.fourCells  = L.status(7, 13, 'campfire');
    o.d3 = L.metres(7, 12, 7, 9);
    o.d4 = L.metres(7, 13, 7, 9);
    return o;
  });
  ok('B4 building: placement answers with VALHEIM\'S THREE STATUSES and never invents ' +
     'a fourth (' + Array.from(new Set(statuses.set)).join('/') + ')',
     new Set(statuses.set).size === V.PLACEMENT_STATUS_COUNT &&
     ['Valid', 'Invalid', 'NoBuildZone'].every(s => statuses.set.indexOf(s) >= 0));
  ok('B5 building: the no-build zone is the THIRD status, not a flavour of Invalid',
     statuses.noBuild.status === 'NoBuildZone');
  ok('B6 building: reach is the SOURCED ' + V.MAX_PLACE_DIST + ' m, measured in metres — ' +
     statuses.d3 + ' m reaches, ' + statuses.d4 + ' m does not',
     statuses.d3 <= V.MAX_PLACE_DIST && statuses.d4 > V.MAX_PLACE_DIST &&
     statuses.threeCells.status === 'Valid' &&
     statuses.fourCells.reason === 'out of reach');

  const cost = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.wood0 = L.inv().wood;
    L.teleportPlace(7, 9, 'workbench');
    o.wood1 = L.inv().wood;
    L.teleportPlace(8, 9, 'floor');
    L.teleportPlace(9, 9, 'floor');
    L.teleportPlace(10, 9, 'floor');
    o.wood2 = L.inv().wood;
    o.count = L.pieces().length;
    return o;
  });
  ok('B7 building: the cost actually leaves the pack (' + cost.wood0 + ' -> ' +
     cost.wood1 + ' -> ' + cost.wood2 + ')',
     cost.wood1 === cost.wood0 - V.WORKBENCH_WOOD &&
     cost.wood2 === cost.wood1 - 3 * V.FLOOR_WOOD);

  const integ = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    L.teleportPlace(7, 9, 'workbench');
    L.teleportPlace(8, 9, 'floor');
    L.teleportPlace(2, 14, 'wall');       /* nothing adjacent, nothing beneath */
    /* NEVER LET A MISSING PIECE THROW. A mutation that stops pieces being
        placeable used to crash the whole gate here, which meant B27-B30 -- the
        checks that measure the actual finding -- never ran and could not be
        shown to catch anything. A gate that dies early is a gate whose later
        checks are unproven. */
    const nul = { supported: null, support: null };
    o.floor = L.integrity(8, 9, 'ground') || nul;
    o.orphan = L.integrity(2, 14, 'ground') || nul;
    o.loss = L.materialLoss('Wood');
    o.materials = L.MATERIALS.length;
    return o;
  });
  ok('B8 building: IT IS STILL PHYSICAL — a grounded floor is supported and an ' +
     'orphaned wall is not (' + integ.floor.support + ' vs ' + integ.orphan.support + ')',
     integ.floor.supported === true && integ.orphan.supported === false);
  ok('B8b building: integrity has the sourced TWO axes and the sourced seven material ' +
     'types', integ.loss.horizontal > 0 && integ.loss.vertical > 0 &&
     integ.materials === V.MATERIAL_TYPE_COUNT);

  /* ---------------- 2. CRAFTING: the half that wants a house --------------- */
  const craft = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    L.teleportPlace(7, 9, 'workbench');
    L.moveTo(7, 9);
    o.bare = L.canCraft();
    o.n1 = L.roofTheBench(1); o.roofed1 = L.canCraft();
    o.n6 = L.roofTheBench(6); o.roofed6 = L.canCraft();
    o.n7 = L.roofTheBench(7); o.roofed7 = L.canCraft();
    o.cover6 = 6 / 9; o.cover7 = 7 / 9;
    return o;
  });
  ok('B9a crafting: the roof helper hits the exact cover it was asked for (' +
     craft.n1 + '/' + craft.n6 + '/' + craft.n7 + ' of 9) — a cumulative helper ' +
     'reading as an absolute one made B10 and B11 agree with each other while both ' +
     'tested 7 of 9',
     craft.n1 === 1 && craft.n6 === 6 && craft.n7 === 7 &&
     Math.abs(craft.roofed6.cover - 6 / 9) < 0.001 &&
     Math.abs(craft.roofed7.cover - 7 / 9) < 0.001);
  ok('B9 crafting: a bare bench REFUSES TO CRAFT and says it wants a roof ("' +
     craft.bare.reason + '")',
     craft.bare.ok === false && /roof/.test(craft.bare.reason));
  ok('B10 crafting: a roof alone is not enough — 6 of 9 covered is ' +
     craft.cover6.toFixed(2) + ' and the requirement is ' + V.CRAFT_COVER_FRACTION,
     craft.roofed1.ok === false && craft.roofed6.ok === false &&
     craft.cover6 < V.CRAFT_COVER_FRACTION);
  ok('B11 crafting: 7 of 9 is ' + craft.cover7.toFixed(2) + ' and IT OPENS — the ' +
     'sourced 70% becomes "seven of the nine tiles over your head"',
     craft.roofed7.ok === true && craft.cover7 >= V.CRAFT_COVER_FRACTION &&
     Math.abs(craft.roofed7.cover - craft.cover7) < 0.001);

  const craftLoop = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    L.teleportPlace(7, 9, 'workbench');
    L.roofTheBench(9);
    L.moveTo(7, 9);
    o.wood0 = L.inv().wood;
    o.first = L.craft('club');
    o.wood1 = L.inv().wood;
    o.second = L.craft('club');
    o.wood2 = L.inv().wood;
    o.arrows = L.craft('arrow');
    o.made = L.made();
    /* walk out of range and it shuts */
    L.moveTo(7, 18);
    o.outOfRange = L.canCraft();
    o.dist = L.metres(7, 18, 7, 9);
    o.radius = L.benchRadius();
    return o;
  });
  ok('B12 crafting: THE LOOP CLOSES AND REPEATS — two clubs, materials leave both ' +
     'times, and arrows yield ' + V.ARROW_YIELD,
     craftLoop.first.ok === true && craftLoop.second.ok === true &&
     craftLoop.wood1 === craftLoop.wood0 - V.CLUB_WOOD &&
     craftLoop.wood2 === craftLoop.wood1 - V.CLUB_WOOD &&
     craftLoop.made.club === 2 && craftLoop.made.arrow === V.ARROW_YIELD);
  ok('B13 crafting: and it is the STATION\'S range, so walking ' + craftLoop.dist +
     ' m out of a ' + craftLoop.radius + ' m circle shuts it ("' +
     craftLoop.outOfRange.reason + '")',
     craftLoop.outOfRange.ok === false && craftLoop.dist > craftLoop.radius &&
     /no station in range/.test(craftLoop.outOfRange.reason));

  /* ---------------- 3. DECONSTRUCTING: being wrong is free ----------------- */
  const decon = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.start = JSON.parse(JSON.stringify(L.inv()));
    L.teleportPlace(7, 9, 'workbench');
    o.spent = JSON.parse(JSON.stringify(L.inv()));
    o.removed = L.removeAt(7, 9, 'ground');
    o.back = JSON.parse(JSON.stringify(L.inv()));
    /* the ruin nobody placed */
    o.ruinBefore = JSON.parse(JSON.stringify(L.inv()));
    o.ruin = L.removeAt(11, 3, 'ground');
    o.ruinAfter = JSON.parse(JSON.stringify(L.inv()));
    return o;
  });
  ok('B14 deconstructing: FULL REFUND — ' + decon.start.wood + ' -> ' + decon.spent.wood +
     ' -> ' + decon.back.wood + ', back to exactly where it started',
     decon.spent.wood === decon.start.wood - V.WORKBENCH_WOOD &&
     JSON.stringify(decon.back) === JSON.stringify(decon.start) &&
     decon.removed.refund.wood === V.WORKBENCH_WOOD * V.REFUND_FLOOR);
  ok('B15 deconstructing: BUT ONLY WHAT YOU PLACED — the ruin refunds nothing, which ' +
     'is the IsPlacedByPlayer branch and not a special case',
     decon.ruin.ok === true && decon.ruin.wasPlayers === false &&
     Object.keys(decon.ruin.refund).length === 0 &&
     JSON.stringify(decon.ruinAfter) === JSON.stringify(decon.ruinBefore));

  const drift = await page.evaluate(() => {
    const L = window.LAB, seen = [];
    L.reset();
    for (let i = 0; i < 4; i++) {
      L.teleportPlace(7, 9, 'workbench');
      L.teleportPlace(8, 9, 'floor');
      L.removeAt(8, 9, 'ground');
      L.removeAt(7, 9, 'ground');
      seen.push(L.inv().wood);
    }
    return seen;
  });
  ok('B16 deconstructing: AND IT NEVER DRIFTS over four place/remove cycles (' +
     drift.join(',') + ') — no free wood, no lost wood, so hesitating is pointless',
     new Set(drift).size === 1);

  /* ---------------- 4. UPGRADING: the circle grows ------------------------- */
  const up = await page.evaluate(() => {
    const L = window.LAB, o = { levels: [], radii: [], cells: [] };
    L.reset();
    o.grid = L.dims().cols * L.dims().rows;
    L.teleportPlace(7, 9, 'workbench');
    const snap = () => {
      o.levels.push(L.benchLevel()); o.radii.push(L.benchRadius());
      o.cells.push(L.cellsInRadius());
      o.area.push(Math.PI * L.benchRadius() * L.benchRadius());
    };
    o.area = [];
    snap();
    /* all four inside the sourced 5 m attach ring */
    [['chopblock', 6, 9], ['tanrack', 8, 9], ['adze', 7, 8], ['shelf', 7, 10]]
      .forEach(([id, x, y]) => { L.teleportPlace(x, y, id); snap(); });
    o.attachDist = L.metres(6, 9, 7, 9);
    return o;
  });
  ok('B17 upgrading: a fresh bench is level 1 at the sourced ' + V.WORKBENCH_RANGE + ' m',
     up.levels[0] === 1 && up.radii[0] === V.WORKBENCH_RANGE);
  ok('B18 upgrading: each extension inside the ' + V.ATTACH_RANGE + ' m ring adds a level ' +
     'and ' + V.RADIUS_PER_LEVEL + ' m (levels ' + up.levels.join('->') + ', radii ' +
     up.radii.join('->') + ')',
     up.levels.join(',') === '1,2,3,4,5' &&
     up.radii.every((r, i) => r === V.WORKBENCH_RANGE + i * V.RADIUS_PER_LEVEL) &&
     up.attachDist <= V.ATTACH_RANGE);
  ok('B19 upgrading: THE DOC ARITHMETIC CLOSES ON THE SOURCED RADIUS — ' +
     V.WORKBENCH_RANGE + ' + ' + V.WORKBENCH_UPGRADE_COUNT + ' x ' + V.RADIUS_PER_LEVEL +
     ' = ' + V.WORKBENCH_RANGE_MAX + ', and the page lands on it exactly',
     V.WORKBENCH_RANGE + V.WORKBENCH_UPGRADE_COUNT * V.RADIUS_PER_LEVEL === V.WORKBENCH_RANGE_MAX &&
     1 + V.WORKBENCH_UPGRADE_COUNT === V.WORKBENCH_LEVEL_MAX &&
     up.radii[up.radii.length - 1] === V.WORKBENCH_RANGE_MAX &&
     up.levels[up.levels.length - 1] === V.WORKBENCH_LEVEL_MAX);
  /* THE FIRST VERSION OF B20 ASKED THE GRID, NOT THE MECHANISM, and the grid ran
     out: 195 -> 257 -> 281 -> 285 -> 285 cells, saturating at the whole 15x19
     board, so a real growing radius read as a broken one. The claimed AREA is the
     mechanism; the flat tail is the page's window being too small to hold a
     36 m circle, which is not a fault, it is the point. Both get asserted, and
     the saturation gets asserted as SATURATION so nobody later "fixes" it. */
  ok('B20 upgrading: YOU CAN SEE IT — the CLAIMED AREA grows every single level (' +
     up.area.map(a => Math.round(a) + 'm2').join(' -> ') + ')',
     up.area.every((a, i) => i === 0 || a > up.area[i - 1]));
  ok('B20b upgrading: and the CLAIMED CELL COUNT grows every level too, without ' +
     'ever swallowing the whole ' + up.grid + '-cell board (' + up.cells.join('->') + ')',
     up.cells.every((c, i) => i === 0 || c > up.cells[i - 1]) &&
     up.cells[up.cells.length - 1] < up.grid);

  const far = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    L.teleportPlace(7, 9, 'workbench');
    L.teleportPlace(7, 13, 'chopblock');   /* inside the 20 m build radius, outside 5 m */
    o.dist = L.metres(7, 13, 7, 9);
    o.level = L.benchLevel();
    o.radius = L.benchRadius();
    return o;
  });
  ok('B21 upgrading: an extension ' + far.dist + ' m out is inside the build radius but ' +
     'OUTSIDE the ' + V.ATTACH_RANGE + ' m attach ring, and does not count',
     far.dist > V.ATTACH_RANGE && far.dist <= V.WORKBENCH_RANGE &&
     far.level === 1 && far.radius === V.WORKBENCH_RANGE);

  /* ---------------- 5. SPAWN SUPPRESSION: what the circle was for ---------- */
  const spawn = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    const cells = L.allCells();
    o.bare = L.spawnRoll(cells).filter(r => r.spawned).length;
    o.total = cells.length;
    L.teleportPlace(7, 9, 'workbench');
    const withBench = L.spawnRoll(cells);
    o.withBench = withBench.filter(r => r.spawned).length;
    o.inside = L.suppressedAt(7, 9);
    o.corner = L.suppressedAt(0, 0);
    o.cornerDist = L.metres(0, 0, 7, 9);
    o.radius = L.benchRadius();
    o.spawnRadius = L.spawnRadius();
    o.suppressed1 = L.cellsSuppressed();
    /* upgrade it and the quiet gets bigger, because it is ONE radius */
    [['chopblock', 6, 9], ['tanrack', 8, 9], ['adze', 7, 8], ['shelf', 7, 10]]
      .forEach(([id, x, y]) => L.teleportPlace(x, y, id));
    o.radius5 = L.benchRadius();
    o.spawnRadius5 = L.spawnRadius();
    o.suppressed5 = L.cellsSuppressed();
    /* take it away and the same cells come back */
    L.removeAt(7, 9, 'ground');
    o.afterRemoval = L.spawnRoll(cells).filter(r => r.spawned).length;
    o.suppressedAfter = L.cellsSuppressed();
    return o;
  });
  ok('B22 spawn suppression: with no station EVERY roll produces a monster (' +
     spawn.bare + '/' + spawn.total + ')', spawn.bare === spawn.total);
  ok('B23 spawn suppression: one bench on bare dirt eats ' +
     (spawn.total - spawn.withBench) + ' of those ' + spawn.total + ' rolls, with NO ' +
     'roof and NO cover anywhere on it',
     spawn.withBench < spawn.bare && spawn.inside === true);
  ok('B24 spawn suppression: and it is the SAME RADIUS doing both jobs at every level (' +
     spawn.radius + '=' + spawn.spawnRadius + ', ' + spawn.radius5 + '=' +
     spawn.spawnRadius5 + ') — one knob, so it can never disagree with itself',
     spawn.radius === spawn.spawnRadius && spawn.radius5 === spawn.spawnRadius5 &&
     spawn.corner === false && spawn.cornerDist > spawn.radius);
  ok('B25 spawn suppression: UPGRADING THE BENCH QUIETS MORE GROUND (' +
     spawn.suppressed1 + ' -> ' + spawn.suppressed5 + ' cells) — the coupling is real ' +
     'and not decorative', spawn.suppressed5 > spawn.suppressed1);
  ok('B26 spawn suppression: THE LOOP CLOSES — take the bench away and all ' +
     spawn.total + ' cells spawn again',
     spawn.afterRemoval === spawn.total && spawn.suppressedAfter === 0);

  /* ---------------- THE FINDING, MEASURED ---------------------------------- */
  const asym = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    L.teleportPlace(7, 9, 'workbench');
    L.moveTo(7, 9);
    o.bare = L.asymmetry();
    L.roofTheBench(7);
    L.moveTo(7, 9);
    o.roofed = L.asymmetry();
    return o;
  });
  ok('B27 THE FINDING: on bare dirt with no roof and 0% cover, one bench ALREADY ' +
     'gives you a build zone and a no-spawn zone, and gives you NO crafting',
     asym.bare.hasStation === true &&
     asym.bare.roofOverStation === false && asym.bare.coverOverStation === 0 &&
     asym.bare.mayBuildInRadius === true &&
     asym.bare.maySuppressSpawns === true &&
     asym.bare.mayCraft === false);
  ok('B28 THE FINDING, THE OTHER HALF: roofing it changes EXACTLY ONE of those three ' +
     'answers. Build ' + asym.bare.mayBuildInRadius + '->' + asym.roofed.mayBuildInRadius +
     ', spawns-off ' + asym.bare.maySuppressSpawns + '->' + asym.roofed.maySuppressSpawns +
     ', craft ' + asym.bare.mayCraft + '->' + asym.roofed.mayCraft +
     '. THE HOUSE IS AN IMPROVEMENT, NEVER A PREREQUISITE.',
     asym.roofed.mayCraft === true &&
     asym.roofed.mayBuildInRadius === asym.bare.mayBuildInRadius &&
     asym.roofed.maySuppressSpawns === asym.bare.maySuppressSpawns &&
     asym.roofed.coverOverStation >= V.CRAFT_COVER_FRACTION);
  ok('B29 THE FINDING, in the constants: the craft path requires a roof and cover and ' +
     'the build path requires neither',
     V.CRAFT_ROOF_REQUIRED === 1 && V.CRAFT_COVER_FRACTION > 0 &&
     V.BUILD_ROOF_REQUIRED === 0 && V.BUILD_COVER_FRACTION === 0);

  /* A ROOF MUST NOT SECRETLY HELP THE BUILD PATH. Two objects, one roofed and one
     not, asked the identical build question. This is the check that would catch
     the asymmetry being quietly collapsed by a later edit -- B27/B28 measure the
     page's own summary function, and a summary can be wrong in the same
     direction as the thing it summarises. */
  const roofIrrelevant = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    L.teleportPlace(7, 9, 'workbench');
    o.dry = L.status(10, 9, 'floor', true);
    L.roofTheBench(9);
    o.wet = L.status(10, 9, 'floor', true);
    o.coverNow = L.coverOf().fraction;
    return o;
  });
  ok('B30 and a roof changes NOTHING about whether you may build (' +
     roofIrrelevant.dry.status + ' at 0% cover, ' + roofIrrelevant.wet.status + ' at ' +
     Math.round(roofIrrelevant.coverNow * 100) + '%) — asked of the build path directly, ' +
     'not of the page\'s own summary',
     roofIrrelevant.dry.status === 'Valid' && roofIrrelevant.wet.status === 'Valid' &&
     roofIrrelevant.coverNow === 1);

  /* CAN YOU ACTUALLY SEE YOUR CLAIM? "The claim draws itself" is one of the five
     findings and the gate had NOTHING that could tell whether the circle lands on
     the canvas. It did not: at the first grid size a 20 m radius was 8 cells and a
     36 m one was 14.4, so the white circle fell off the board entirely and the
     only ring on screen was the player's reach. Thirty checks were green and the
     central visual was missing. A finding about what you can SEE needs a check
     about geometry on the canvas, not another check about the model. */
  const visible = await page.evaluate(() => {
    const L = window.LAB, o = {}, d = L.dims();
    L.reset();
    const cx = Math.floor(d.cols / 2), cy = Math.floor(d.rows / 2);
    L.teleportPlace(cx, cy, 'workbench');
    const cnv = document.getElementById('stage').getBoundingClientRect();
    o.cellW = cnv.width / d.cols;
    o.canvasW = cnv.width; o.canvasH = cnv.height;
    o.r1 = L.benchRadius() / L.VB.CELL_METRES * o.cellW;    /* css px */
    [['chopblock', cx - 1, cy], ['tanrack', cx + 1, cy]]
      .forEach(([id, x, y]) => L.teleportPlace(x, y, id));
    o.r3 = L.benchRadius() / L.VB.CELL_METRES * o.cellW;
    o.centreX = (cx + 0.5) * o.cellW;
    return o;
  });
  ok('B31 THE CLAIM IS ON SCREEN: a centred bench\'s level-1 circle is ' +
     Math.round(visible.r1) + 'px across a ' + Math.round(visible.canvasW) +
     'px canvas and FITS (' + Math.round(visible.centreX - visible.r1) + 'px to ' +
     Math.round(visible.centreX + visible.r1) + 'px)',
     visible.centreX - visible.r1 > 0 &&
     visible.centreX + visible.r1 < visible.canvasW);
  ok('B31b and it is still on screen after two upgrades (' + Math.round(visible.r3) +
     'px) — the growth is watchable, not just true',
     visible.r3 > visible.r1 &&
     visible.centreX - visible.r3 > 0 &&
     visible.centreX + visible.r3 < visible.canvasW);

  /* AND EVERY DRAWN THING IS BIG ENOUGH TO SEE. Three draw sizes were literals
     tuned for a 26px cell; when the grid changed to 15px the roofs became 3px,
     the spawn dots swamped the board, and THE PLAYER MARKER WAS COMPUTED AS
     CELL-16 = -1px WIDE and vanished. 572 checks were green with the player
     invisible, because not one of them looked at a size. */
  const sizes = await page.evaluate(() => window.LAB.drawSizes());
  ok('B32 every draw size is derived from the cell and stays visible at ' +
     sizes.cell + 'px cells (player ' + sizes.playerW + 'x' + sizes.playerH +
     ', roof ' + sizes.roofW + 'px, dots ' + sizes.dotSpawn.toFixed(1) + '/' +
     sizes.dotQuiet.toFixed(1) + ')',
     sizes.playerW >= 4 && sizes.playerH >= 4 &&
     sizes.roofW >= 4 && sizes.groundW > sizes.roofW &&
     sizes.dotSpawn >= 2.5 && sizes.dotQuiet >= 1 &&
     sizes.dotSpawn < sizes.cell / 2 && sizes.dotSpawn > sizes.dotQuiet);
}

async function shotValheimBuild(page) {
  /* THE SHOT HAS TO SHOW THE FINDING, and the FIRST VERSION OF IT DID NOT.
     It put a fully-upgraded bench off-centre, so its 36 m claim circle fell
     entirely outside the canvas and the proof shot of a page about a visible
     claim contained NO VISIBLE CLAIM -- the only circle on screen was the
     player's reach ring, in the wrong colour, reading as the claim to anybody
     looking. Found by opening the PNG, which is the only place it shows up, and
     it also exposed the real bug underneath: the grid was too small to hold the
     mechanic at all.
     So: a CENTRED bench at level 3, whose circle fits with room to spare, two
     extensions inside the dashed attach ring, the roofed core that has already
     crafted, an orphaned wall drawn red, and a spawn roll with green dots inside
     the circle and red ones outside it. Every claim the page makes, at once. */
  await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    const cx = 13, cy = 16;
    L.teleportPlace(cx, cy, 'workbench');
    [['chopblock', cx - 1, cy], ['tanrack', cx + 1, cy]]
      .forEach(([id, x, y]) => L.teleportPlace(x, y, id));
    L.roofTheBench(9);
    L.teleportPlace(3, 29, 'wall');          /* orphaned, draws red */
    L.teleportPlace(6, 29, 'floor');
    L.moveTo(cx, cy);
    L.craft('club');
    L.craft('arrow');
    L.spawnRoll(L.allCells());
    L.verb('PLACE');
    L.select('workbench');
  });
}

async function liveValheimWeapons(page) {
  const V = await page.evaluate(() => window.LAB.VW);
  await page.evaluate(() => window.LAB.reset());

  const declared = await page.evaluate(() => window.LAB.mechanics);
  ok('W0 the page declares the five mechanics the record declares',
     JSON.stringify(declared) === JSON.stringify(
       ['damage types', 'resistances', 'backstab', 'parry', 'weapon skill']));
  ok('W0b and declares itself a MODEL', await page.evaluate(() => window.LAB.kind) === 'MODEL');

  /* ---------------- 1. DAMAGE TYPES: a weapon is a PROFILE ---------------- */
  const types = await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    return L.WEAPONS.map(w => ({ id: w.id, skill: w.skill, types: Object.keys(w.split) }));
  });
  ok('W1 types: every weapon declares a damage-type profile, not just a number',
     types.length >= 6 && types.every(w => w.types.length >= 1));
  ok('W2 types: the three PHYSICAL types are all represented across the set',
     ['slash', 'blunt', 'pierce'].every(t => types.some(w => w.types.indexOf(t) >= 0)));
  ok('W3 types: at least one weapon SPLITS its damage — the reason a resistance ' +
     'is a tax and not a wall', types.some(w => w.types.length > 1));
  ok('W4 types: each weapon carries its Valheim SKILL class (the sourced enum)',
     types.every(w => ['Swords', 'Clubs', 'Knives', 'Spears', 'Polearms', 'Bows']
       .indexOf(w.skill) >= 0));

  /* ---------------- 2. RESISTANCES: per type, THEN armour ---------------- */
  const resist = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    const club = L.WEAPONS.find(w => w.id === 'club');
    const spear = L.WEAPONS.find(w => w.id === 'spear');
    const knife = L.WEAPONS.find(w => w.id === 'knife');
    const skel = L.ENEMIES.find(e => e.id === 'skeleton');
    const seek = L.ENEMIES.find(e => e.id === 'seeker');
    o.clubOnSkel = L.typedDamage(club, skel);
    o.spearOnSkel = L.typedDamage(spear, skel);
    o.knifeOnSeek = L.typedDamage(knife, seek);
    /* armour: the piecewise curve, both branches and the asymptote */
    o.smallArmor = L.afterArmor(10, 3);
    o.bigArmor = L.afterArmor(10, 20);
    o.hugeArmor = L.afterArmor(10, 100000);
    o.noArmor = L.afterArmor(10, 0);
    return o;
  });
  ok('W5 resist: blunt DOUBLES on a skeleton (' + resist.clubOnSkel.total + ' from ' +
     resist.clubOnSkel.parts[0].raw + ')',
     resist.clubOnSkel.parts[0].mod === V.MOD_VERY_WEAK &&
     resist.clubOnSkel.total === resist.clubOnSkel.parts[0].raw * V.MOD_VERY_WEAK);
  ok('W6 resist: and pierce is HALVED on the same skeleton (' + resist.spearOnSkel.total + ')',
     resist.spearOnSkel.parts[0].mod === V.MOD_RESISTANT);
  ok('W7 resist: THE RIGHT WEAPON IS A ' +
     (resist.clubOnSkel.total / resist.spearOnSkel.total).toFixed(1) +
     'x SWING BEFORE YOU MOVE A STEP — that is the knowledge lever',
     resist.clubOnSkel.total / resist.spearOnSkel.total >= 3);
  ok('W8 resist: A SPLIT WEAPON IS SCORED PER TYPE, separately (' +
     resist.knifeOnSeek.parts.map(p => p.raw + '*' + p.mod).join(' + ') + ')',
     resist.knifeOnSeek.parts.length === 2 &&
     resist.knifeOnSeek.parts.some(p => p.mod === V.MOD_VERY_WEAK) &&
     resist.knifeOnSeek.parts.some(p => p.mod === V.MOD_NORMAL) &&
     near(resist.knifeOnSeek.total,
          resist.knifeOnSeek.parts.reduce((a, p) => a + p.raw * p.mod, 0), 0.001));
  ok('W9 armour: it SUBTRACTS while small and goes quadratic when large (' +
     resist.smallArmor + ' vs ' + resist.bigArmor.toFixed(2) + ')',
     resist.smallArmor === 10 - 3 && near(resist.bigArmor, 100 / 80, 0.001));
  ok('W10 armour: AND IT NEVER REACHES ZERO — you can always be hurt (' +
     resist.hugeArmor.toExponential(1) + ')',
     resist.hugeArmor > 0 && resist.noArmor === 10);

  /* ---------------- 3. BACKSTAB: the positioning multiplier ---------------- */
  const back = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    const seek = L.bodies().find(b => b.id === 'seeker');
    L.face('seeker', 0, -1);                       /* it looks NORTH */
    const knife = L.WEAPONS.find(w => w.id === 'knife');
    /* stand SOUTH of it = behind */
    o.behind = L.isBehind(seek.x, seek.y + 1, seek);
    o.front = L.isBehind(seek.x, seek.y - 1, seek);
    o.side = L.isBehind(seek.x + 1, seek.y, seek);
    o.hitBehind = L.resolveHit(knife, seek, seek.x, seek.y + 1, 0, 1);
    o.hitFront = L.resolveHit(knife, seek, seek.x, seek.y - 1, 0, 1);
    o.mults = L.WEAPONS.map(w => ({ id: w.id, back: w.back }));
    return o;
  });
  ok('W11 backstab: BEHIND is behind, IN FRONT is not, and the side is not either — ' +
     'so it is EARNED', back.behind === true && back.front === false && back.side === false);
  ok('W12 backstab: a knife is x' + V.BACKSTAB_KNIFE + ' from behind and x1 in front',
     back.hitBehind.back === V.BACKSTAB_KNIFE && back.hitFront.back === 1);
  ok('W13 backstab: WHICH IS A ' + (back.hitBehind.final / back.hitFront.final).toFixed(0) +
     'x SWING FROM WALKING AROUND SOMETHING — this is the half of his sentence ' +
     'Bohemia does not have', back.hitBehind.final / back.hitFront.final > 10);
  ok('W14 backstab: the multiplier is a property of the WEAPON, and they differ (' +
     back.mults.map(m => m.id + ':' + m.back).join(' ') + ')',
     new Set(back.mults.map(m => m.back)).size >= 3 &&
     back.mults.find(m => m.id === 'knife').back === V.BACKSTAB_KNIFE &&
     back.mults.find(m => m.id === 'club').back === V.BACKSTAB_TWOHAND_CLUB);

  /* ---------------- 4. PARRY -> STAGGER -> 2x, and it is SPENT ------------ */
  const parry = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    const troll = L.bodies().find(b => b.id === 'troll');
    /* stand next to it so it swings instead of walking */
    L.place(troll.x - 1, troll.y);
    o.staggeredBefore = troll.staggered;
    L.parry();                                     /* spends the turn */
    o.staggeredAfter = L.bodies().find(b => b.id === 'troll').staggered;
    const sword = L.WEAPONS.find(w => w.id === 'sword');
    const t2 = L.bodies().find(b => b.id === 'troll');
    o.hitStaggered = L.resolveHit(sword, t2, t2.x + 99, t2.y, 0, 1).stagger;
    t2.staggered = false;
    o.hitNormal = L.resolveHit(sword, t2, t2.x + 99, t2.y, 0, 1).stagger;
    /* and NOT parrying gets you nothing */
    L.reset();
    const t3 = L.bodies().find(b => b.id === 'troll');
    L.place(t3.x - 1, t3.y);
    L.endTurn();
    o.noParryNoStagger = L.bodies().find(b => b.id === 'troll').staggered;
    o.parryMults = L.WEAPONS.map(w => w.parry);
    return o;
  });
  ok('W15 parry: SPENDING A TURN ON A PARRY STAGGERS WHAT SWINGS AT YOU',
     parry.staggeredBefore === false && parry.staggeredAfter === true);
  ok('W16 parry: AND NOT PARRYING GETS YOU NOTHING — it is a spend, not a freebie',
     parry.noParryNoStagger === false);
  ok('W17 parry: a staggered target takes exactly x' + V.STAGGER_DMG_MULT,
     parry.hitStaggered === V.STAGGER_DMG_MULT && parry.hitNormal === 1);
  ok('W18 parry: parry strength lives on WHAT YOU HOLD, so defence sets offence (' +
     parry.parryMults.join('/') + ')',
     new Set(parry.parryMults).size >= 2 &&
     Math.max.apply(null, parry.parryMults) === V.PARRY_KNIFE);

  /* ---------------- 5. WEAPON SKILL: it raises the FLOOR ------------------ */
  const skill = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.at0 = { lo: L.skillFloor(0), hi: L.skillCeil(0) };
    o.at50 = { lo: L.skillFloor(50), hi: L.skillCeil(50) };
    o.at75 = { lo: L.skillFloor(75), hi: L.skillCeil(75) };
    o.at100 = { lo: L.skillFloor(100), hi: L.skillCeil(100) };
    o.rollLo = L.skillFactor(0, 0);
    o.rollHi = L.skillFactor(0, 1);
    /* using a weapon levels ITS class and not the others */
    L.reset();
    L.setWeapon('club');
    const troll = L.bodies().find(b => b.id === 'troll');
    L.place(troll.x - 1, troll.y);
    L.attack(troll.x, troll.y);
    o.levels = JSON.parse(JSON.stringify(L.levels()));
    return o;
  });
  ok('W19 skill: at level 0 you roll ' + Math.round(skill.at0.lo * 100) + '-' +
     Math.round(skill.at0.hi * 100) + '% of the weapon',
     near(skill.at0.lo, V.SKILL_FLOOR_AT_0, 0.001) && near(skill.at0.hi, V.SKILL_CEIL_AT_0, 0.001));
  ok('W20 skill: BOTH ENDS CLIMB with the level (' + Math.round(skill.at50.lo * 100) + '-' +
     Math.round(skill.at50.hi * 100) + '% at 50)',
     skill.at50.lo > skill.at0.lo && skill.at50.hi > skill.at0.hi);
  ok('W21 skill: THE CEILING IS DONE BY ' + V.SKILL_CEIL_MAXED_AT + ' and caps at 100%',
     near(skill.at75.hi, V.SKILL_CAP, 0.001) && near(skill.at100.hi, V.SKILL_CAP, 0.001));
  ok('W22 skill: SO THE LAST QUARTER OF MASTERY BUYS ONLY CONSISTENCY — the floor ' +
     'still climbs (' + Math.round(skill.at75.lo * 100) + '% -> ' +
     Math.round(skill.at100.lo * 100) + '%) while the ceiling does not move',
     skill.at100.lo > skill.at75.lo && near(skill.at100.hi, skill.at75.hi, 0.001));
  ok('W23 skill: the roll really spans the floor and the ceiling',
     near(skill.rollLo, V.SKILL_FLOOR_AT_0, 0.001) && near(skill.rollHi, V.SKILL_CEIL_AT_0, 0.001));
  ok('W24 skill: swinging a club levels CLUBS and nothing else — that is the ' +
     'switching cost that makes the weapon choice real',
     skill.levels.Clubs > 0 && skill.levels.Swords === 0 && skill.levels.Knives === 0);

  /* ---------------- THE PIPELINE ORDER, which IS the mechanism ------------ */
  const order = await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    const knife = L.WEAPONS.find(w => w.id === 'knife');
    const seek = L.bodies().find(b => b.id === 'seeker');
    L.face('seeker', 0, -1);
    seek.staggered = true;
    const r = L.resolveHit(knife, seek, seek.x, seek.y + 1, 0, 1);
    return { r: r, armor: seek.armor };
  });
  const o = order.r;
  ok('W25 pipeline: typed total is the sum of the per-type results',
     near(o.typed.total, o.typed.parts.reduce((a, p) => a + p.out, 0), 0.001));
  ok('W26 pipeline: skill is applied to the typed total',
     near(o.afterSkill, o.typed.total * o.factor, 0.001));
  ok('W27 pipeline: position AND stagger both multiply, and they COMPOUND (x' +
     o.back + ' * x' + o.stagger + ')',
     near(o.beforeArmor, o.afterSkill * o.back * o.stagger, 0.001) &&
     o.back > 1 && o.stagger > 1);
  ok('W28 pipeline: ARMOUR IS LAST, on the total — Valheim\'s documented order',
     near(o.final, order.armor < o.beforeArmor / V.ARMOR_PIVOT_DIV
       ? o.beforeArmor - order.armor
       : (o.beforeArmor * o.beforeArmor) / (V.ARMOR_SQUARE_DIV * order.armor), 0.01));

  /* the design statement, stored as a number and checked as one */
  const slash = await page.evaluate(() => {
    const L = window.LAB;
    let weak = 0;
    L.ENEMIES.forEach(e => { if ((e.mods.slash || 1) > 1) weak++; });
    return { weak: weak, declared: L.VW.SLASH_WEAKNESS_COUNT };
  });
  ok('W29 THE DESIGN STATEMENT: NOBODY IS WEAK TO SLASH, so the default weapon is ' +
     'never optimal and never wrong', slash.weak === 0 && slash.declared === 0);

  /* and the whole thesis: the multipliers, not the printed number, decide the fight */
  const thesis = await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    const sword = L.WEAPONS.find(w => w.id === 'sword');
    const knife = L.WEAPONS.find(w => w.id === 'knife');
    const seek = L.bodies().find(b => b.id === 'seeker');
    L.face('seeker', 0, -1);
    return {
      swordPrinted: sword.split.slash,
      knifePrinted: knife.split.pierce + knife.split.slash,
      swordFront: L.resolveHit(sword, seek, seek.x, seek.y - 1, 0, 1).final,
      knifeBehind: L.resolveHit(knife, seek, seek.x, seek.y + 1, 0, 1).final
    };
  });
  ok('W30 THE THESIS, MEASURED: the knife prints ' + thesis.knifePrinted + ' to the sword\'s ' +
     thesis.swordPrinted + ' and still hits for ' + thesis.knifeBehind.toFixed(0) + ' vs ' +
     thesis.swordFront.toFixed(0) + ' — THE MULTIPLIERS DECIDE THE FIGHT, NOT THE ' +
     'PRINTED NUMBER',
     thesis.knifePrinted < thesis.swordPrinted && thesis.knifeBehind > thesis.swordFront * 5);
}

/* ==========================================================================
   PART B — LIVE: THE CRASH (LAB-08)

   The claim is that a collapse is a set of curves falling on a clock you do not
   control, plus exactly ONE that rises only when you move it, plus the thing
   neither game has: a dead utility that gets an OWNER instead of vanishing.
   So the checks are: does every crash curve fall without the player's consent,
   does comfort refuse to fall, and can you BUY BACK the thing Zomboid deletes?

   And one check that is not about mechanics at all: C1 proves this row did not
   quietly reopen Zomboid's LOOT, which is a killed feature. A gate that only
   tests what the page does, and never what it was forbidden to do, cannot
   enforce the STOP PRODUCING law.
   ========================================================================== */
async function liveTheCrash(page) {
  const C = await page.evaluate(() => window.LAB.CR);
  await page.evaluate(() => window.LAB.reset());

  const declared = await page.evaluate(() => window.LAB.mechanics);
  ok('X0 the page declares the five mechanics the record declares',
     JSON.stringify(declared) === JSON.stringify(
       ['the money dies', 'the freeze', 'the grid dies', 'the cartel', 'comfort']));
  ok('X0b and declares itself a MODEL', await page.evaluate(() => window.LAB.kind) === 'MODEL');

  /* ---------------- 1. THE MONEY DIES, on its own clock ---------------- */
  const money = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.day0 = L.moneyWorth(0);
    o.day365 = L.moneyWorth(365);
    o.day1825 = L.moneyWorth(1825);
    o.rate0 = L.rateOnDay(0);
    o.rate1825 = L.rateOnDay(1825);
    o.lost1825 = L.pctLost(1825);
    o.monthly = L.monthlyDecay();
    /* it falls whether or not the player does anything at all */
    const before = L.moneyWorth(L.day());
    L.advance(90);
    o.fellWithoutConsent = L.moneyWorth(L.day()) < before;
    return o;
  });
  ok('X1 money: day 0 is the peg and 100% of value (' + Math.round(money.rate0) + ')',
     near(money.rate0, C.LBP_PEG, 0.01) && near(money.day0, 1, 0.0001));
  ok('X2 money: five years lands on the real 2024 official rate (' +
     Math.round(money.rate1825).toLocaleString() + ' vs ' + C.LBP_OFFICIAL_2024.toLocaleString() + ')',
     near(money.rate1825, C.LBP_OFFICIAL_2024, C.LBP_OFFICIAL_2024 * 0.01));
  ok('X3 money: WHICH IS THE DOCUMENTED "MORE THAN 98% GONE" (' + money.lost1825.toFixed(1) + '%)',
     money.lost1825 > C.LBP_LOST_PCT);
  ok('X4 money: it falls monotonically, 100% -> ' + (money.day365 * 100).toFixed(0) + '% -> ' +
     (money.day1825 * 100).toFixed(1) + '%',
     money.day0 > money.day365 && money.day365 > money.day1825);
  ok('X5 money: AND IT FALLS WITHOUT THE PLAYER DOING ANYTHING — somebody else\'s clock',
     money.fellWithoutConsent === true);
  ok('X6 money: the fitted rate is a plausible ~7% a month, not a guess (' +
     (money.monthly * 100).toFixed(2) + '%)', money.monthly > 0.06 && money.monthly < 0.08);

  /* the doubling-time translation, which is the HUD lesson */
  const hyper = await page.evaluate(() => {
    const L = window.LAB;
    return L.HYPER.map(h => ({ id: h.id, dpd: L.doublesPerDay(h.doubleH) }));
  });
  const hun = hyper.find(h => h.id === 'hungary');
  const wei = hyper.find(h => h.id === 'weimar');
  ok('X7 money: HUNGARY 1946 DOUBLES PRICES FASTER THAN ONCE A DAY and Weimar does not — ' +
     'the record is legible as a rate a human can feel',
     hun.dpd > 1 && wei.dpd < 1 && hun.dpd > wei.dpd);

  /* ---------------- 2. THE FREEZE: rich and unable to reach it ---------- */
  const freeze = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.startBank = L.bank(); o.startCash = L.cash();
    L.setCap('lebanon');
    o.pulled1 = L.withdraw();
    o.capAfter = L.capRemaining();
    o.pulled2 = L.withdraw();                 /* the cap is spent for this period */
    o.bankStillFull = L.bank();
    L.advance(30);                            /* a new month, a new allowance */
    o.capNextPeriod = L.capRemaining();
    /* the shape matters more than the number: three real laws, three periods */
    o.periods = L.CAPS.map(c => ({ id: c.id, per: c.per, amount: c.amount }));
    L.setCap('greece');
    o.greeceLen = L.periodLength();
    L.setCap('argentina');
    o.argLen = L.periodLength();
    L.setCap('lebanon');
    o.lebLen = L.periodLength();
    return o;
  });
  ok('X8 freeze: you can pull exactly the cap and no more (' + Math.round(freeze.pulled1) +
     ' then ' + freeze.pulled2 + ')',
     near(freeze.pulled1, C.LB_WITHDRAW_CAP_MO, 0.01) && freeze.pulled2 === 0 &&
     freeze.capAfter === 0);
  ok('X9 freeze: AND THE MONEY IS STILL THERE — you are rich and cannot reach it (' +
     Math.round(freeze.bankStillFull).toLocaleString() + ' left)',
     freeze.bankStillFull > freeze.startBank * 0.9);
  ok('X10 freeze: a new period restores the allowance, so it is a DRIP not a wall',
     near(freeze.capNextPeriod, C.LB_WITHDRAW_CAP_MO, 0.01));
  ok('X11 freeze: three REAL caps with three different period shapes — day, week, month (' +
     freeze.greeceLen + '/' + freeze.argLen + '/' + freeze.lebLen + ')',
     freeze.greeceLen === 1 && freeze.argLen === 7 && freeze.lebLen === 30 &&
     freeze.periods.length === 3);

  /* THE RACE YOU CANNOT WIN — the finding, measured */
  const race = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset(); L.setCap('lebanon');
    o.months = Math.ceil(L.bank() / L.capDef('lebanon').amount);
    o.worthWhenDone = L.moneyWorth(o.months * 30);
    return o;
  });
  ok('X12 freeze: GETTING YOUR OWN MONEY OUT TAKES ' + race.months + ' MONTHS, by which time it ' +
     'is worth ' + (race.worthWhenDone * 100).toFixed(1) + '% — YOU CANNOT WIN THE RACE',
     race.months > 24 && race.worthWhenDone < 0.05);

  /* ---------------- 3. THE GRID DIES ON A TIMER ------------------------- */
  const grid = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.before = L.gridDead(L.CR.PZ_ELECSHUT_DAYS - 1);
    o.on = L.gridDead(L.CR.PZ_ELECSHUT_DAYS);
    o.water = L.waterDead(L.CR.PZ_WATERSHUT_DAYS);
    o.hoursBefore = L.hoursOfLight(L.CR.PZ_ELECSHUT_DAYS - 1);
    o.hoursAfter = L.hoursOfLight(L.CR.PZ_ELECSHUT_DAYS);
    return o;
  });
  ok('X13 grid: it is alive on day ' + (C.PZ_ELECSHUT_DAYS - 1) + ' and dead on day ' +
     C.PZ_ELECSHUT_DAYS + ' — Zomboid\'s real ElecShutModifier',
     grid.before === false && grid.on === true && grid.water === true);
  ok('X14 grid: and the light collapses from 24 h to what is left of the state (' +
     grid.hoursBefore + ' -> ' + grid.hoursAfter + ')',
     grid.hoursBefore === 24 && grid.hoursAfter === C.LB_STATE_POWER_HOURS);

  /* ---------------- 4. THE CARTEL: it gets an OWNER --------------------- */
  const cartel = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    L.advance(L.CR.PZ_ELECSHUT_DAYS);
    o.dark = L.hoursOfLight(L.day());
    o.priceDay0 = L.amperePriceLocal(0);
    o.priceNow = L.amperePriceLocal(L.day());
    o.priceLate = L.amperePriceLocal(1825);
    o.brokeAttempt = L.buyAmpere();            /* no cash yet */
    L.give(1e9);
    o.bought = L.buyAmpere();
    o.lit = L.hoursOfLight(L.day());
    o.amperes = L.amperes();
    return o;
  });
  ok('X15 cartel: after the timer you are down to ' + cartel.dark + ' h — the state\'s leftovers',
     cartel.dark === C.LB_STATE_POWER_HOURS);
  ok('X16 cartel: YOU CAN BUY THE LIGHT BACK — the utility has an OWNER, it did not vanish (' +
     cartel.dark + ' -> ' + cartel.lit + ' h)',
     cartel.bought === true && cartel.amperes === 1 &&
     near(cartel.lit, C.LB_STATE_POWER_HOURS + C.LB_GEN_HOURS, 0.001));
  ok('X17 cartel: and you cannot buy it with nothing — the owner is not a charity',
     cartel.brokeAttempt === false);
  ok('X18 cartel: THE VICE — the SAME ampere costs ' +
     (cartel.priceLate / cartel.priceDay0).toFixed(0) + 'x more of your money five years in, ' +
     'for the same ' + C.LB_GEN_HOURS + ' hours',
     cartel.priceLate > cartel.priceDay0 * 40 && cartel.priceNow > cartel.priceDay0);

  /* ---------------- 5. COMFORT: the only curve that rises -------------- */
  const comfort = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.base = L.restedSeconds(L.CR.VH_COMFORT_BASE);
    o.max = L.restedSeconds(L.CR.VH_COMFORT_MAX);
    o.startComfort = L.comfort();
    /* it does NOT rise on its own, however long you wait */
    L.advance(1825);
    o.afterFiveYears = L.comfort();
    /* it rises only when you spend */
    L.give(1e9);
    o.built = L.build();
    o.afterBuild = L.comfort();
    o.secAfter = L.restedSeconds(L.comfort());
    /* and NOTHING in the crash takes it back */
    L.advance(1825);
    o.stillThere = L.comfort();
    /* the documented ceiling */
    for (let i = 0; i < 40; i++) L.build();
    o.capped = L.comfort();
    o.cappedSec = L.restedSeconds(L.comfort());
    o.overCap = L.build();
    return o;
  });
  ok('X19 comfort: 480s at comfort 1 and the documented 1,440s at 17 (' + comfort.base + '/' +
     comfort.max + ')',
     comfort.base === C.VH_RESTED_BASE_SEC && comfort.max === C.VH_RESTED_MAX_SEC);
  ok('X20 comfort: FIVE YEARS OF COLLAPSE DOES NOT RAISE IT ONE POINT — it is not a curve, ' +
     'it is a choice', comfort.afterFiveYears === comfort.startComfort);
  ok('X21 comfort: it rises only when the player spends (' + comfort.startComfort + ' -> ' +
     comfort.afterBuild + ', ' + comfort.secAfter + 's)',
     comfort.built === true && comfort.afterBuild === comfort.startComfort + 1 &&
     comfort.secAfter === comfort.base + C.VH_SEC_PER_COMFORT);
  ok('X22 comfort: AND NOTHING IN THE CRASH TAKES IT BACK — five more years, still there',
     comfort.stillThere >= comfort.afterBuild);
  ok('X23 comfort: it stops at the documented 17 / 1,440s and refuses to go past (' +
     comfort.capped + ')',
     comfort.capped === C.VH_COMFORT_MAX && comfort.cappedSec === C.VH_RESTED_MAX_SEC &&
     comfort.overCap === false);

  /* ---------------- THE THESIS: falling curves vs the one rising ------- */
  const thesis = await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    const t0 = { money: L.moneyWorth(0), light: L.hoursOfLight(0), comfort: L.comfort() };
    L.give(1e9);
    L.build(); L.build();
    L.advance(1825);
    const t1 = { money: L.moneyWorth(L.day()), light: L.hoursOfLight(L.day()), comfort: L.comfort() };
    return { t0, t1 };
  });
  ok('X24 THE THESIS, MEASURED: over five years the money fell (' +
     (thesis.t0.money * 100).toFixed(0) + '% -> ' + (thesis.t1.money * 100).toFixed(1) +
     '%), the light fell (' + thesis.t0.light + ' -> ' + thesis.t1.light +
     ' h), AND THE ONLY THING THAT ROSE IS WHAT WAS BUILT (' + thesis.t0.comfort + ' -> ' +
     thesis.t1.comfort + ')',
     thesis.t1.money < thesis.t0.money && thesis.t1.light < thesis.t0.light &&
     thesis.t1.comfort > thesis.t0.comfort);
}

/* ==========================================================================
   PART B — LIVE: TEN YEARS COLD (LAB-09)

   The claim: with money banned, the currency is STANDING, and standing works
   because fame and infamy are TWO counters that never cancel. So the checks are:
   do the two counters stay independent, does the TITLE read from both, are the
   mixed-axis words reachable IN PLAY (not just described), do the per-faction
   thresholds really differ, and is BUILDING what makes you worth dealing with.
   ========================================================================== */
async function liveTenYearsCold(page) {
  const T = await page.evaluate(() => window.LAB.TY);
  await page.evaluate(() => window.LAB.reset());

  const declared = await page.evaluate(() => window.LAB.mechanics);
  ok('Y0 the page declares the five mechanics the record declares',
     JSON.stringify(declared) === JSON.stringify(
       ['standing', 'the mixed axis', 'thresholds', 'deeds', 'building to matter']));
  ok('Y0b and declares itself a MODEL', await page.evaluate(() => window.LAB.kind) === 'MODEL');

  /* ---------------- 1. STANDING: two counters that never cancel --------- */
  const two = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.startTitle = L.title('ncr');
    L.setStanding('ncr', 50, 0);
    o.fameOnly = { f: L.fame('ncr'), i: L.infamy('ncr'), t: L.title('ncr') };
    /* adding infamy must NOT reduce fame — that is the whole structural claim */
    L.setStanding('ncr', 50, 30);
    o.both = { f: L.fame('ncr'), i: L.infamy('ncr'), t: L.title('ncr') };
    L.setStanding('ncr', 0, 60);
    o.infamyOnly = { f: L.fame('ncr'), i: L.infamy('ncr'), t: L.title('ncr') };
    return o;
  });
  ok('Y1 standing: you start unknown to everybody', two.startTitle === 'unknown');
  ok('Y2 standing: FAME AND INFAMY NEVER CANCEL — 50 fame stays 50 when 30 infamy ' +
     'arrives (' + two.both.f + '/' + two.both.i + ')',
     two.fameOnly.f === 50 && two.both.f === 50 && two.both.i === 30);
  ok('Y3 standing: and the TITLE READS FROM BOTH, so the same fame gives a different ' +
     'word once infamy exists ("' + two.fameOnly.t + '" -> "' + two.both.t + '")',
     two.fameOnly.t !== two.both.t);
  ok('Y4 standing: infamy alone is its own axis, not negative fame ("' + two.infamyOnly.t + '")',
     two.infamyOnly.f === 0 && two.infamyOnly.t === 'vilified');

  /* their hard gate: high fame cannot buy off a bad name */
  const gate = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    L.setStanding('ncr', L.TY.IDOLIZED_FAME_MIN + 5, L.TY.IDOLIZED_INFAMY_MAX + 1);
    o.highFameDirty = L.trulyIdolized('ncr');
    L.setStanding('ncr', L.TY.IDOLIZED_FAME_MIN - 1, 0);
    o.lowFameClean = L.trulyIdolized('ncr');
    L.setStanding('ncr', L.TY.IDOLIZED_FAME_MIN, L.TY.IDOLIZED_INFAMY_MAX - 1);
    o.both = L.trulyIdolized('ncr');
    return o;
  });
  ok('Y5 standing: YOU CANNOT BUY YOUR WAY OUT OF A BAD NAME WITH GOOD DEEDS — 95 fame ' +
     'with 5 infamy is not idolized, and it needs BOTH',
     gate.highFameDirty === false && gate.lowFameClean === false && gate.both === true);

  /* ---------------- 2. THE MIXED AXIS, reachable IN PLAY ---------------- */
  const mixed = await page.evaluate(() => {
    const L = window.LAB, o = { titles: [] };
    L.reset();
    for (let i = 0; i < 12; i++) {
      L.doDeed('both');                       /* +6 fame AND +6 infamy, both factions */
      o.titles.push(L.title('ncr'));
    }
    o.finalF = L.fame('ncr'); o.finalI = L.infamy('ncr');
    o.mixed = L.isMixed('ncr');
    return o;
  });
  const uniq = [...new Set(mixed.titles)];
  ok('Y6 mixed: ONE REPEATED DEED WALKS YOU THROUGH ' + uniq.length + ' DIFFERENT TITLES ' +
     'while NEITHER NUMBER EVER FALLS (' + uniq.join(' -> ') + ')',
     uniq.length >= 3 && mixed.finalF > 0 && mixed.finalI > 0);
  ok('Y7 mixed: and the mixed-axis words are REACHED IN PLAY, not just described',
     uniq.some(t => ['WILD CHILD', 'DARK HERO', 'SOFT-HEARTED DEVIL'].indexOf(t) >= 0) &&
     mixed.mixed === true);
  ok('Y8 mixed: WILD CHILD specifically is reachable — the word a single slider ' +
     'could never produce', uniq.indexOf('WILD CHILD') >= 0);

  /* ---------------- 3. THRESHOLDS: the same deed is worth different ----- */
  const thr = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.costs = L.FACTIONS.map(f => ({ id: f.id, acc: f.acc, idol: f.idol }));
    o.spread = L.spread();
    /* the SAME six points buys a different tier from each of them */
    L.FACTIONS.forEach(f => L.setStanding(f.id, 6, 0));
    o.tiers = L.FACTIONS.map(f => ({ id: f.id, t: L.fameTier(f.id) }));
    return o;
  });
  ok('Y9 thresholds: their real per-faction numbers really do differ (' +
     thr.costs.map(c => c.id + ':' + c.acc + '/' + c.idol).join(' ') + ')',
     new Set(thr.costs.map(c => c.acc)).size === 4 && thr.spread > 1);
  ok('Y10 thresholds: SIX POINTS BUYS A DIFFERENT TIER FROM EACH FACTION (' +
     thr.tiers.map(t => t.id + ':' + t.t).join(' ') + ') — that is how a small faction ' +
     'matters without being buffed',
     new Set(thr.tiers.map(t => t.t)).size >= 2 &&
     thr.tiers.find(t => t.id === 'bos').t > thr.tiers.find(t => t.id === 'legion').t);
  ok('Y11 thresholds: the cheapest door in the game is the Brotherhood at ' + T.BOS_ACCEPTED +
     ' and the dearest is the Legion at ' + T.LEGION_IDOLIZED,
     T.BOS_ACCEPTED === 3 && T.LEGION_IDOLIZED === 100);

  /* ---------------- 4. DEEDS: nothing is free with everybody ------------ */
  const deeds = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.count = L.DEEDS.length;
    o.multiFaction = L.DEEDS.filter(d => Object.keys(d.fame).length > 1).length;
    o.costly = L.DEEDS.filter(d => Object.keys(d.infamy).length > 0).length;
    /* the trap: buying from one side charges you on the other */
    L.doDeed('raid');
    o.legionUp = L.fame('legion');
    o.ncrHurt = L.infamy('ncr');
    return o;
  });
  ok('Y12 deeds: several deeds move MORE THAN ONE faction at once (' + deeds.multiFaction +
     ' of ' + deeds.count + ')', deeds.multiFaction >= 2);
  ok('Y13 deeds: and some CHARGE you while paying you (' + deeds.costly + ' of ' +
     deeds.count + ') — standing is a set of people you choose between, not a score you farm',
     deeds.costly >= 2 && deeds.legionUp > 0 && deeds.ncrHurt > 0);

  /* ---------------- 5. BUILDING TO MATTER, and the dead grid ------------ */
  const built = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.reset();
    o.worth0 = L.worthMultiplier();
    o.comfort0 = L.comfort();
    o.rested0 = L.restedSeconds();
    L.buildOne(); L.buildOne(); L.buildOne(); L.buildOne();
    o.worth4 = L.worthMultiplier();
    o.comfort4 = L.comfort();
    o.rested4 = L.restedSeconds();
    o.acts = [L.cityAtAct(1), L.cityAtAct(2), L.cityAtAct(3)];
    /* the light is a STANDING, not a purchase */
    L.reset();
    o.darkAtStart = L.haveLight();
    L.setStanding('bos', L.TY.BOS_ACCEPTED, 0);      /* the cheapest door */
    o.litViaStanding = L.haveLight();
    o.owner = L.litOwner();
    return o;
  });
  ok('Y14 building: comfort and rested rise with what you put up (' + built.comfort0 + '->' +
     built.comfort4 + ', ' + built.rested0 + 's->' + built.rested4 + 's)',
     built.comfort4 === built.comfort0 + 4 &&
     built.rested4 === built.rested0 + 4 * T.VH_SEC_PER_COMFORT);
  ok('Y15 building: AND IT MAKES YOU WORTH DEALING WITH — every deed counts x' +
     built.worth4.toFixed(1) + ' once you are somebody (from x' + built.worth0.toFixed(1) + ')',
     built.worth4 > built.worth0);
  ok('Y16 building: it compounds across the three acts (' + built.acts.join(' -> ') +
     ') — the CENTURY RULE',
     built.acts[1] > built.acts[0] && built.acts[2] > built.acts[1]);
  ok('Y17 the dead grid: you start in the dark, and THE LIGHT IS A STANDING, NOT A ' +
     'PURCHASE — 3 points with the cheapest faction gets you in',
     built.darkAtStart === false && built.litViaStanding === true && built.owner !== null);

  /* the thesis: no money anywhere, and standing is what moves */
  const thesis = await page.evaluate(() => {
    const L = window.LAB;
    /* MONEY-SHAPED NAMES, not the word "cost". The first version matched /cost/
       and tripped on costToAccepted() -- the cost of somebody's RESPECT, which is
       the opposite of an economy. Fourth time this repo has shipped a check that
       hunted a word instead of a thing. */
    return { keys: Object.keys(L).filter(k =>
      /price|money|cash|wallet|inflat|exchange|withdraw|deposit|currency|balance/i.test(k)) };
  });
  ok('Y18 THE THESIS: the harness exposes NO price, no money, no rate, nothing ' +
     'economic at all' + (thesis.keys.length ? ' (' + thesis.keys.join(',') + ')' : '') +
     ' — because standing is the currency', thesis.keys.length === 0);
}

/* THE FORBIDDEN-CATEGORY CHECK for LAB-09. laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD
   bans economic gameplay as a CATEGORY, so the page that answers it must be the
   first thing proved clean. Matched as structures, never mentions: the law and the
   note are REQUIRED to name these things in order to ban them. */
function coldHasNoEconomy(src, note) {
  const ECON = [
    [/\bexchangeRate\b|\bexchange_rate\b/i, 'an exchange rate'],
    [/\binflation\w*\s*[:=]/i, 'an inflation term'],
    [/\bprices?\s*[:=]\s*[[{0-9]/i, 'a price table'],
    [/\bwithdraw\w*\s*[:=]|\bwithdrawalCap\b/i, 'a withdrawal cap'],
    [/\bmoneyWorth\b|\brateOnDay\b|\bdailyDecay\b/, 'the dead crash page\'s own money maths']
  ];
  const hits = ECON.filter(([re]) => re.test(src)).map(([, what]) => what);
  ok('Z1 TEN YEARS COLD has no economic mechanic' + (hits.length ? ' (' + hits.join(', ') + ')' : ''),
     hits.length === 0);
  ok('Z2 and it says on its own face that the economy is banned by law',
     /NO ECONOMY/i.test(src) && /TEN_YEARS_COLD/.test(src));
  ok('Z3 the THREE CURRENCIES law survives a page about what money is replaced BY',
     /THREE CURRENCIES/.test(src) && /THREE CURRENCIES/.test(note));
  ok('Z4 and the note names the lane that actually owns faction standing',
     /PEOPLE|WORLD|QUEST/.test(note));
}

async function shotTenYearsCold(page) {
  /* the shot must show the finding: a WILD CHILD who built something and is
     therefore in the lit 12%. */
  await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    L.buildOne(); L.buildOne(); L.buildOne();
    for (let i = 0; i < 10; i++) L.doDeed('both');
    L.doDeed('salvage');
  });
}

/* THE FORBIDDEN-FEATURE CHECK. Part A tests what a page does; this tests what it
   was told never to do again. Called from partA for THE CRASH only. */
function crashDidNotReopenLoot(src, rec, note) {
  /* a LOOT SYSTEM is a structure: containers with roll tables and per-item search
     time. Never a mention — the record is REQUIRED to discuss loot in order to say
     it is banned, and a check that trips on the ban is the bug this repo has now
     shipped three times (lab_gate A10, A12, A24). */
  const LOOT_STRUCT = [
    /\bcontainers?\s*[:=]\s*[[{]/i,
    /\brolls?\s*[:=]\s*\d/i,
    /procList|ProceduralDistributions/,
    /\bsearchTime\b|\brummage\w*\s*\(/i
  ];
  const hits = LOOT_STRUCT.filter(re => re.test(src));
  ok('C1 THE CRASH did not reopen Zomboid LOOT, a killed feature' +
     (hits.length ? ' (' + hits[0] + ')' : ''), hits.length === 0);
  ok('C1b and it says out loud, in all three files, that loot is closed',
     /LOOT/.test(src) && /ANTI-REFERENCE|CLOSED/i.test(src) &&
     /ANTI-REFERENCE|closed subject/i.test(rec) && /closed subject/i.test(note));
  /* the THREE CURRENCIES law must survive a page about money */
  ok('C2 THE CRASH adds no fourth currency — the THREE CURRENCIES law is named and kept',
     /THREE CURRENCIES/.test(src) && /THREE CURRENCIES/.test(note));
}

async function shotTheCrash(page) {
  /* the shot must show the FINDING, not the fresh state: five years in, the money
     nearly worthless, the grid dead, an ampere bought back off the owner, and
     comfort standing because it was built. */
  await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    L.give(1e6);
    L.build(); L.build(); L.build();
    L.advance(1825);
    L.buyAmpere();
    L.withdraw();
  });
}

async function shotValheimWeapons(page) {
  /* the screenshot must show the mechanic, so: knife equipped, standing BEHIND
     something, one backstab already landed and its maths on screen.
     THE TARGET IS THE TROLL, NOT THE SEEKER. The first version backstabbed the
     seeker and a x10 knife DELETED it (165 into 110 hp) — so the proof shot of
     the backstab mechanic contained no backstabbed creature. Found by looking at
     the rendered pixels, which is the only place it shows up. The troll's 160 hp
     survives it, so the shot shows the hit AND the thing that took it. */
  await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    L.setWeapon('knife');
    L.face('troll', 0, -1);
    const troll = L.bodies().find(b => b.id === 'troll');
    L.place(troll.x, troll.y + 1);
    L.attack(troll.x, troll.y);
  });
}

async function shotCDDA(page) {
  /* the screenshot has to show the interesting state, not the fresh one: a
     wrecked player mid-day with an errand out and three days of debt owed. */
  await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    L.setCondition({ overloadPct: 150, pain: 30, thirst: 70 });
    L.doAction('medium');
    L.doTravel(3);
    L.sendErrand('med');
    L.setAwakeMin(3 * 24 * 60);
    L.doAction('short');
  });
}

async function shotValheim(page) {
  await page.evaluate(() => {
    const L = window.LAB;
    L.reset();
    L.place(L.FIRE.x, L.FIRE.y);
    ['stew', 'carrotsoup', 'boar'].forEach(f => L.give(f, 1));
    L.eat('stew'); L.eat('carrotsoup'); L.eat('boar');
    ['roof', 'rug', 'bed', 'stool', 'roundtable', 'banner'].forEach(p => L.placePiece(p));
    L.tick(21);
    L.thaw();
  });
}

/* ==========================================================================
   DRIVER
   ========================================================================== */
(async () => {
  const statics = EMULATIONS.map(em => ({ em, r: partA(em) }));

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  try {
    for (const { em, r } of statics) {
      if (!r) { ok('LIVE ' + em.id + ': skipped, static checks failed', false); continue; }
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto('file://' + path.join(ROOT, em.page));
      await page.waitForFunction(() => !!window.LAB, null, { timeout: 15000 });
      await page.evaluate(() => window.LAB.freeze());

      await em.live(page);

      if (em.shot) {
        await em.shot.setup(page);
        await SETTLE(page, 300);
        const shot = path.join(PROOF_DIR, em.shot.name);
        await page.screenshot({ path: shot });
        ok('C1 ' + em.id + ': proof screenshot written', fs.existsSync(shot) && fs.statSync(shot).size > 8000);
        console.log('  proof: ' + shot);
      }
      ok('C2 ' + em.id + ': zero console errors' + (errors.length ? ' (' + errors[0].slice(0, 90) + ')' : ''),
         errors.length === 0);
      await ctx.close();
    }
  } finally {
    await browser.close();
  }

  console.log('='.repeat(74));
  console.log('  LAB GATE: ' + pass + ' pass / ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL: gate threw: ' + (e && e.stack || e)); process.exit(1); });
