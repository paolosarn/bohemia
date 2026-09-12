#!/usr/bin/env node
/*
 * DERIVED FRESHNESS GATE -- ANYTHING DERIVED IS DERIVED AGAIN, AND PROVED TO MATCH.
 * (9/12/26, PLUMBER lane, VAMILY row [nothing baked] DERIVED-FRESHNESS-GATE)
 *
 * THE LAW IT ENFORCES, BY NAME: laws/BOHEMIA_LAW_NOTHING_IS_BAKED_ONCE_9_6_26.md.
 * That law ends with the sentence "This one gets a gate: derived_freshness_gate."
 * This is that file. Until it existed the law was advertised and unenforced, which
 * is the thing law_index_gate.py was built to make impossible.
 *
 * THE LAW: "ANYTHING DERIVED IS DERIVED ON EVERY RUN, OR A MACHINE PROVES THE COPY
 * MATCHES ITS SOURCE. NOTHING IS BAKED ONCE." It names the standard answer in one
 * line: regenerate, then fail if the tree is dirty. It came from SIX incidents in
 * one day, each found by a different lane, none of whom saw it as the same bug.
 *
 * ## IT FOUND FIVE MORE OF THE SAME THING ON ITS FIRST RUN
 *
 * Nine makers re-derive byte for byte. FIVE DO NOT, and three of those write files
 * that SHIP:
 *
 *     slices/BOHEMIA_RUN_CURRENT.html        +938 / -55   a 22 MB shipped slice
 *     slices/BOHEMIA_CURRENT_SLICE.html      +107 / -11   still carries the OLD quest
 *                                                         canon: "SIDE QUEST S01 THE
 *                                                         METER READER" where the
 *                                                         source now says "ACT ONE
 *                                                         ASK A01 THE KILLING SUMMER"
 *     slices/BOHEMIA_MAP_CURRENT.html         +92 / -7    carries engine md5 stamps
 *                                                         that no longer match the
 *                                                         engine files they name
 *     records/BOHEMIA_SURFACE_AUDIT_8_15_26.md +19 / -19  says 6 things are on the
 *                                                         walked surface; the truth
 *                                                         is 22
 *     records/BOHEMIA_REACHABILITY_CENSUS.*    +20 / -11
 *
 * Nobody did anything wrong on purpose. That is the whole point of the law: a bake
 * is correct the day it is made and rots silently after, and no lane can see the rot
 * from inside its own work.
 *
 * ## HOW IT WORKS, AND WHY IT CANNOT TOUCH YOUR TREE
 *
 * "Regenerate, then fail if the tree is dirty" is one line of diff in a repo where
 * the tree is disposable. Here it is not: eighteen lanes work in one checkout, and a
 * gate that regenerated in place and restored with `git checkout --` would eat
 * somebody's uncommitted work the first time two things happened at once.
 *
 * So it regenerates in a DETACHED GIT WORKTREE in the scratch directory, never in the
 * repo. The worktree starts at HEAD and is then overlaid with every working-tree file
 * that differs from HEAD, so it is a true copy of what you are about to push, not of
 * what you last committed. The real checkout is opened read-only and is never written
 * to, not once, not even to restore it.
 *
 * ## DISCOVERY IS BY RUNNING, NOT BY READING
 *
 * The law asks derived files to carry a header saying what makes them. The MAKERS are
 * found that way (14 of them, declared across 49 files). But the OUTPUTS are found by
 * running the maker and asking git what moved. That is deliberate, and it is the same
 * argument as the gate registry: a hand-kept list of outputs drifts, and the file that
 * most needs catching is exactly the one whose header nobody wrote.
 * IT PAID FOR ITSELF IMMEDIATELY: slices/BOHEMIA_MAP_CURRENT.html declares no maker at
 * all, so a header-driven gate would never have looked at it, and it is 92 lines stale.
 *
 * ## THE RATCHET, AND WHY THIS SHIPS GREEN WITH FIVE THINGS BROKEN
 *
 * This lane may not edit slices/ content, laws/, art or features, so it cannot fix any
 * of the five. And a gate that is red the day it arrives gets switched off -- that is
 * measured, not a worry: two gates in this repo sat failing from 8/31 while "gate
 * green" was cited as proof, because nobody could tell a new red from the old one.
 *
 * So the five are a NAMED, FROZEN BASELINE with the lane that owns each. The list can
 * only SHRINK. A file that starts drifting and is not on it is RED the same run. A file
 * on it that stops drifting is ALSO red, so the list cannot go stale and nobody can
 * park a new problem in it quietly.
 *
 * ## WHAT IT HOLDS
 *   - the floors, first: a sweep that found no makers, ran nothing, or compared no
 *     bytes agrees with every claim about freshness. Four checks exist only to fail
 *     an empty run.
 *   - every declared maker still exists and still runs without crashing
 *   - every file a maker rewrites is byte-identical to what is checked in, except
 *     the named date stamps and the named frozen baseline
 *   - the baseline shrinks and never grows quietly
 *   - a file a maker writes that carries no maker header is COUNTED and named, which
 *     is the law's header rule made visible
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const SCRATCH = process.env.BOHEMIA_SCRATCH || path.join(require('os').tmpdir(), 'bohemia_derived');
const WT = path.join(SCRATCH, 'derived_freshness_wt');
const RECORD = 'records/BOHEMIA_DERIVED_FRESHNESS.json';

/* ---------------------------------------------------------------------------
 * THE MAKERS THIS GATE RUNS. Discovered from the "Generated by <tool>" headers
 * the law asks for, then pinned here WITH A MEASURED TIME so the suite's budget
 * is a number somebody chose and not an accident. A maker that is not a plain
 * "run me and I rebuild my output" command is excluded BY NAME with the reason,
 * because a silent exclusion is how a gate stops checking.
 * ------------------------------------------------------------------------- */
const MAKERS = [
  ['python3', 'gates/bohemia_canon_index.py',              50],
  ['python3', 'tools/bohemia_faction_dossiers.py',         63],
  ['python3', 'tools/bohemia_uibook_index.py',             31],
  ['python3', 'tools/bohemia_questbook_index.py',         134],
  ['node',    'tools/bohemia_ladder_data.js',              46],
  ['python3', 'tools/bohemia_surface_audit.py',           406],
  ['python3', 'tools/bohemia_map_tab.py',                 105],
  ['node',    'tools/build_current_slice.js',             200],
  ['node',    'tools/build_run_slice.js',                1420],
  ['python3', 'tools/bohemia_city_from_above_9_11_26.py', 1006],
  ['python3', 'tools/bohemia_city_chunk_tile_bank.py',   2460],
];

const NOT_RUN = {
  'tools/bohemia_reachability_census.py':
    'MEASURED AT 66.4 SECONDS, which is ten times every other maker here put together, '
    + 'and the suite is already over its ten-minute budget. Its two outputs are on the '
    + 'frozen list below and are DRIFTING; this is a deliberate trade, not an oversight.',
  'tools/bohemia_bake_factory.py':
    'exits 1 with no arguments: it is a factory you point at a thing, not a command that '
    + 'rebuilds its own output. Nothing to regenerate and compare.',
  'tools/bohemia_city_onezoom_patch.py':
    'a PATCH tool. Running it again does not re-derive, it re-applies, and a double-apply '
    + 'is a different failure with a different gate (gates/tool_idempotent_gate.js, 8/21).',
};

/* Content that legitimately changes every run. Each one is NAMED with the file it
 * belongs to, because a blanket "ignore anything that looks like a date" would hide
 * exactly the kind of stale content this gate exists to catch. */
const VOLATILE = [
  [/^BOHEMIA_CANON_INDEX\.md$/,
   /BOHEMIA CANON INDEX .{0,4} regenerated \d\d\/\d\d\/\d\d/g,
   'the index stamps the day it was regenerated in its own first line, so it can never '
   + "be byte-equal to yesterday's copy. The stamp is masked; every other line is compared."],
];

/* KNOWN STALE, measured 9/12/26. THIS LIST MAY ONLY SHRINK. Each entry names the lane
 * that owns the file, because this lane may not edit slices/, laws/, art or features. */
const KNOWN_STALE = {
  'slices/BOHEMIA_RUN_CURRENT.html':
    'RUN. +938/-55 against what tools/build_run_slice.js produces now. A 22 MB shipped slice.',
  'slices/BOHEMIA_CURRENT_SLICE.html':
    'RUN. +107/-11 against tools/build_current_slice.js. Still carries the OLD quest canon '
    + '("SIDE QUEST S01 THE METER READER") where the source now says "ACT ONE ASK A01 THE '
    + 'KILLING SUMMER"), and is missing the 9/5 faction-towns seat rule.',
  'slices/BOHEMIA_MAP_CURRENT.html':
    'WORLD. +92/-7 against tools/bohemia_map_tab.py, including engine md5 stamps that no '
    + 'longer match the engine files they name. It declares no maker header at all.',
  'records/BOHEMIA_SURFACE_AUDIT_8_15_26.md':
    'WORLD. +19/-19 against tools/bohemia_surface_audit.py. It says 6 things are on the '
    + 'walked surface and 22 only on the one he never sees; regenerated it says 22 and 7.',
  'slices/BOHEMIA_WHICH_SURFACE_8_15_26.html':
    'WORLD. +1/-1, the same audit rendered as a page.',
  'records/BOHEMIA_REACHABILITY_CENSUS.json':
    'PLUMBER. +17/-8. Its maker is the 66-second one excluded above, so this gate does not '
    + 'run it; the drift was measured by hand this round and is recorded here.',
  'records/BOHEMIA_REACHABILITY_CENSUS.md':
    'PLUMBER. +3/-3, the same census as prose.',
};

let pass = 0, fail = 0;
const ok = (c, m, got) => { if (c) { pass++; console.log('  ok   ' + m + (got ? '   [' + got + ']' : '')); }
  else { fail++; console.log('  FAIL ' + m + (got ? '   [' + got + ']' : '')); } };

const sh = (cmd, args, cwd, ms) => cp.spawnSync(cmd, args, { cwd, timeout: ms || 600000, encoding: 'utf8' });
const git = (args, cwd) => sh('git', args, cwd || ROOT, 120000);

function mask(rel, text) {
  for (const [who, what] of VOLATILE) if (who.test(rel)) text = text.replace(what, '<VOLATILE>');
  return text;
}

/* ------------------------------------------------------------------------- */
function buildWorktree() {
  if (fs.existsSync(WT)) git(['worktree', 'remove', '--force', WT]);
  fs.mkdirSync(SCRATCH, { recursive: true });
  const add = git(['worktree', 'add', '--detach', WT, 'HEAD']);
  if (add.status !== 0) return { error: (add.stderr || String(add.error)).trim().split('\n').slice(-1)[0] };

  /* Overlay the working tree so we check what is about to be PUSHED, not what was
   * last committed. Without this a derived file you edited but did not regenerate
   * reads as fresh, which is the failure mode this gate is named after. */
  const st = git(['status', '--porcelain', '-uall']).stdout || '';
  let copied = 0;
  for (const line of st.split('\n')) {
    if (!line.trim()) continue;
    const rel = line.slice(3).trim().replace(/^"|"$/g, '');
    if (rel.includes(' -> ') || rel.endsWith('/')) continue;
    const src = path.join(ROOT, rel), dst = path.join(WT, rel);
    try {
      if (!fs.existsSync(src)) { if (fs.existsSync(dst)) fs.rmSync(dst, { force: true }); copied++; continue; }
      if (fs.statSync(src).isDirectory()) continue;
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(src, dst);
      copied++;
    } catch (e) { /* a file that vanished mid-sweep is not this gate's problem */ }
  }
  return { copied };
}

function resetWorktree() {
  git(['checkout', '--', '.'], WT);
  git(['clean', '-fdq', '.'], WT);
}

/* EVERY PATH A MAKER COULD WRITE, LISTED ONCE.
 *
 * THE FIRST VERSION OF THIS GATE ASKED GIT WHAT CHANGED, and its own floor caught
 * it: a maker whose output is already correct leaves the worktree CLEAN, so the 33
 * files that re-derive perfectly were invisible and the gate reported "1 of 6 files
 * re-derive byte for byte" when the truth was 33 of 38. A check that can only see
 * failures cannot tell a passing run from a run that did nothing -- the same defect,
 * again, that the floors exist to catch.
 *
 * So a written file is found by its MTIME, not by its diff. The reset before each
 * maker stamps every restored file, then the clock is read, then the maker runs;
 * anything stamped after that clock was written by it, identical bytes or not. */
function allPaths(dir, out) {
  out = out || [];
  let names; try { names = fs.readdirSync(dir); } catch (e) { return out; }
  for (const n of names) {
    if (n === '.git') continue;
    const f = path.join(dir, n);
    let st; try { st = fs.lstatSync(f); } catch (e) { continue; }
    if (st.isDirectory()) allPaths(f, out);
    else if (st.isFile()) out.push(f);
  }
  return out;
}

(function main() {
  console.log('\nEVERY DERIVED FILE, RE-DERIVED, AGAINST WHAT IS CHECKED IN');

  /* ---- WHAT DECLARES A MAKER (the law's header rule) -------------------- */
  const declPat = /(?:Written|Generated|Produced|Derived|Baked|Emitted|Made|Built|Cut|Regenerate|regenerate) (?:by|with) [`'"]?([A-Za-z0-9_/]+\.(?:py|js))/;
  const declared = new Map();
  const skipDir = new Set(['.git', 'node_modules', '__pycache__', 'archive']);
  (function walk(dir) {
    let names; try { names = fs.readdirSync(dir); } catch (e) { return; }
    for (const n of names) {
      if (skipDir.has(n)) continue;
      const f = path.join(dir, n);
      let st; try { st = fs.statSync(f); } catch (e) { continue; }
      if (st.isDirectory()) { walk(f); continue; }
      if (!/\.(json|md|js|py|txt|html)$/.test(n)) continue;
      let head = '';
      try { head = fs.readFileSync(f, 'utf8').slice(0, 8000); } catch (e) { continue; }
      const m = declPat.exec(head);
      if (m) declared.set(path.relative(ROOT, f), m[1]);
    }
  })(ROOT);
  const declaredMakers = new Set([...declared.values()]);

  ok(declaredMakers.size > 5, 'the repo was actually swept for maker headers (' + declaredMakers.size
     + ' distinct makers named across ' + declared.size + ' files, floor 6). A sweep that found none '
     + 'agrees that nothing is derived, which is the empty-haystack answer to every question here');

  ok(MAKERS.length > 5, 'and this gate actually has makers to run (' + MAKERS.length
     + ' pinned, ' + Object.keys(NOT_RUN).length + ' excluded by name with a reason). A gate that '
     + 'runs nothing prints a tick over nothing');

  const missing = MAKERS.map(m => m[1]).filter(f => !fs.existsSync(f));
  ok(missing.length === 0, 'every pinned maker still exists. A maker that was deleted or renamed '
     + 'leaves its output frozen forever with nothing able to notice',
     missing.length ? missing.join(', ') : MAKERS.length + ' present');
  const goneExempt = Object.keys(NOT_RUN).filter(f => !fs.existsSync(f));
  ok(goneExempt.length === 0, 'and so does every maker this gate deliberately does NOT run. An '
     + 'exemption for a file nobody has any more is a hole waiting for a new file to fall into',
     goneExempt.length ? goneExempt.join(', ') : Object.keys(NOT_RUN).length + ' exemptions, all real');

  /* ---- REGENERATE, IN A COPY --------------------------------------------- */
  const wt = buildWorktree();
  if (wt.error) {
    ok(false, 'a disposable copy of the tree could be made to regenerate into. Without one this '
       + 'gate would have to write to the repo eighteen lanes are working in, which it will not do',
       wt.error);
    console.log('\n=== DERIVED FRESHNESS GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    process.exit(1);
  }
  console.log('    regenerating in a throwaway worktree, ' + wt.copied
    + ' working-tree file(s) overlaid on HEAD. THE REPO IS NEVER WRITTEN TO.');

  const drift = [], crashed = [], wrote = [], noHeader = [];
  let compared = 0, bytes = 0, spent = 0;

  const watched = allPaths(WT);
  console.log('    watching ' + watched.length + ' file(s) in the copy for writes');

  for (const [bin, maker, budget] of MAKERS) {
    resetWorktree();
    const t0 = Date.now();
    const r = sh(bin, [maker], WT, Math.max(60000, budget * 30));
    const ms = Date.now() - t0;
    spent += ms;
    if (r.status !== 0) {
      crashed.push(maker + ' (exit ' + r.status + (r.error ? ', ' + r.error.code : '') + ', ' + ms + 'ms)');
      continue;
    }
    /* touched, not changed -- see allPaths above */
    const moved = [];
    for (const abs of watched) {
      let st; try { st = fs.statSync(abs); } catch (e) { continue; }
      if (st.mtimeMs >= t0) moved.push(path.relative(WT, abs));
    }
    for (const abs of allPaths(WT)) {
      const rel = path.relative(WT, abs);
      if (!watched.includes(abs) && !moved.includes(rel)) moved.push(rel);
    }
    for (const rel of moved) {
      wrote.push(rel);
      if (!declared.has(rel)) noHeader.push(rel);
      let made = '', kept = '';
      try { made = fs.readFileSync(path.join(WT, rel), 'utf8'); } catch (e) { made = '\0MISSING'; }
      try { kept = fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch (e) { kept = '\0ABSENT'; }
      compared++; bytes += kept.length;
      if (mask(rel, made) !== mask(rel, kept)) {
        const st = git(['diff', '--numstat', '--', rel], WT).stdout || '';
        const n = st.trim().split(/\s+/);
        drift.push({ file: rel, maker, plus: +n[0] || 0, minus: +n[1] || 0 });
      }
    }
  }
  resetWorktree();
  git(['worktree', 'remove', '--force', WT]);

  console.log('    ' + MAKERS.length + ' makers ran in ' + (spent / 1000).toFixed(1) + ' s, rewrote '
    + new Set(wrote).size + ' file(s), ' + (bytes / 1048576).toFixed(1) + ' MB compared');

  /* ---- THE FLOORS, AFTER THE WORK BUT BEFORE ANY VERDICT ---------------- */
  ok(compared > 20, 'the makers actually rewrote files to compare (' + compared + ' comparisons, '
     + 'floor 21). If a maker silently did nothing, every one of its outputs would read as fresh');
  ok(bytes > 1000000, 'and real bytes were read on both sides (' + (bytes / 1048576).toFixed(1)
     + ' MB, floor 1). Two empty strings are equal, and that is what a broken read looks like');

  ok(crashed.length === 0, 'every maker ran to a clean exit. A maker that crashes cannot re-derive '
     + 'anything, so its output is frozen and nothing can tell',
     crashed.length ? crashed.join('; ') : MAKERS.length + ' clean');

  /* ---- THE VERDICT ------------------------------------------------------ */
  const fresh = compared - drift.length;
  console.log('\n    ' + fresh + ' of ' + compared + ' derived files re-derive BYTE FOR BYTE.');
  if (drift.length) {
    console.log('    ' + drift.length + ' DO NOT:');
    for (const d of drift) {
      const known = KNOWN_STALE[d.file];
      console.log('      +' + String(d.plus).padStart(4) + '/-' + String(d.minus).padEnd(4)
        + ' ' + d.file + (known ? '' : '   *** NEW ***'));
      console.log('               ' + (known || 'NOT ON THE FROZEN LIST. Its maker is ' + d.maker
        + ' -- either regenerate it and commit the result, or add it with a reason.'));
    }
  }

  const surprises = drift.filter(d => !KNOWN_STALE[d.file]);
  ok(surprises.length === 0,
     'NOTHING IS BAKED ONCE: every derived file re-derives to exactly what is checked in, except '
     + 'the ones frozen and named below. A bake is correct the day it is made and rots silently '
     + 'after, and no lane can see that from inside its own work',
     surprises.length ? 'NEW DRIFT: ' + surprises.map(d => d.file).join(', ')
       : drift.length + ' drifting, all of them named and owned');

  const driftSet = new Set(drift.map(d => d.file));
  const healed = Object.keys(KNOWN_STALE).filter(f => !driftSet.has(f) && wrote.includes(f));
  ok(healed.length === 0,
     'and the frozen list only ever SHRINKS. A file on it that re-derives clean again has been '
     + 'fixed, and leaving it listed lets the next stale bake hide behind a stale excuse',
     healed.length ? 'FIXED, DELETE THE ENTRY: ' + healed.join(', ')
       : Object.keys(KNOWN_STALE).length + ' frozen, none healed yet');

  /* ---- THE LAW'S HEADER RULE, COUNTED ----------------------------------- */
  const uniqNoHeader = [...new Set(noHeader)];
  console.log('\n    THE LAW ALSO ASKS EVERY DERIVED FILE TO SAY WHAT MAKES IT.');
  console.log('      ' + (new Set(wrote).size - uniqNoHeader.length) + ' of ' + new Set(wrote).size
    + ' rewritten files carry a maker header.');
  if (uniqNoHeader.length) {
    console.log('      ' + uniqNoHeader.length + ' do NOT, so a header-driven check would never look at them:');
    for (const f of uniqNoHeader.slice(0, 12)) console.log('          ' + f);
    if (uniqNoHeader.length > 12) console.log('          ... and ' + (uniqNoHeader.length - 12) + ' more');
  }
  console.log('      THIS IS WHY DISCOVERY IS BY RUNNING AND NOT BY READING. '
    + (uniqNoHeader.includes('slices/BOHEMIA_MAP_CURRENT.html')
        ? 'The 92-line-stale map slice is one of them.' : ''));

  if (!fail) {
    const body = JSON.stringify({
      what: 'Every derived file re-derived and compared. Written by gates/derived_freshness_gate.js.',
      why: 'laws/BOHEMIA_LAW_NOTHING_IS_BAKED_ONCE_9_6_26.md names this gate by name. A bake is '
         + 'correct the day it is made and rots silently after.',
      how: "Each maker runs in a throwaway git worktree (HEAD plus the working tree's own changes). "
         + 'The repo itself is never written to. Outputs are discovered by asking git what moved, '
         + 'not by reading headers, because the file most likely to be stale is the one whose '
         + 'header nobody wrote.',
      taken: new Date().toISOString(),
      counts: { makersRun: MAKERS.length, makersExcluded: Object.keys(NOT_RUN).length,
                filesRewritten: new Set(wrote).size, compared, fresh, drifting: drift.length,
                missingAMakerHeader: uniqNoHeader.length },
      secondsToRun: +(spent / 1000).toFixed(1),
      drifting: drift,
      frozen: KNOWN_STALE,
      notRun: NOT_RUN,
      rewrittenWithoutAHeader: uniqNoHeader
    }, null, 1);
    const strip = t => t.replace(/"taken": "[^"]*",?/, '');
    let had = ''; try { had = fs.readFileSync(RECORD, 'utf8'); } catch (e) {}
    if (strip(had) !== strip(body)) fs.writeFileSync(RECORD, body);
  }

  console.log('\n=== DERIVED FRESHNESS GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
