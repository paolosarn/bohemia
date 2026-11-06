#!/usr/bin/env node
/* PAGES PUBLISH GATE (8/6/26, WORLD lane).
 *
 *   "the link is the door, and the tab is the room, and he needs both"
 *
 * THE FAILURE THIS EXISTS FOR. GitHub Pages failed to publish THREE COMMITS IN A ROW
 * (ba913e6 cancelled, 65a84f9 failed, b09f3ab ran thirty minutes and failed). Thirty
 * minutes is a TIMEOUT, not an error: the build was copying the whole 496 MB repository
 * when the product surface is the 106 MB in slices/. `_config.yml` now excludes the rest.
 *
 * WHY IT NEEDED A GATE AND NOT JUST A CONFIG FILE. The push kept working the entire time
 * the site was broken. Every lane's gates went green, every commit landed, and the page
 * just stopped changing — the failure lived in the ONE place no gate looked. And the fix
 * has exactly one way to bite: a slice that loads something from a folder the config
 * excludes works perfectly on disk and 404s in production. Nobody would find that either.
 *
 * SO THIS CHECKS THE THING THAT ACTUALLY BREAKS:
 *   1. every `src=`/`href=` a slice points OUTSIDE slices/ resolves to a path Pages
 *      still publishes — measured against the real exclude list, parsed from _config.yml;
 *   2. the referenced file actually exists on disk;
 *   3. the published surface stays under a size the builder can finish (the ratchet);
 *   4. the exclude list never swallows slices/ itself.
 *
 *   node gates/pages_publish_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

// ---- parse the real exclude list out of _config.yml (no YAML dependency) -----------
ok('_config.yml exists', fs.existsSync('_config.yml'));
if (!fs.existsSync('_config.yml')) { console.log('PAGES PUBLISH GATE: 0 passed, 1 failed'); process.exit(1); }
const cfg = fs.readFileSync('_config.yml', 'utf8');
const EX = [];
let inEx = false;
for (const raw of cfg.split('\n')) {
  const line = raw.replace(/#.*$/, '').trimEnd();
  if (/^exclude:\s*$/.test(line)) { inEx = true; continue; }
  if (inEx) {
    const m = /^\s+-\s+(.+?)\s*$/.exec(line);
    if (!m) { if (line.trim() !== '') inEx = false; continue; }
    EX.push(m[1].replace(/^"|"$/g, '').replace(/^'|'$/g, ''));
  }
}
ok('the exclude list is non-empty (' + EX.length + ' entries)', EX.length > 0);

// a path is excluded if any entry is a directory prefix of it, or a matching glob
function excluded(p) {
  for (const e of EX) {
    if (e.endsWith('/') && (p === e.slice(0, -1) || p.startsWith(e))) return e;
    if (e.startsWith('*.')) { if (!p.includes('/') && p.endsWith(e.slice(1))) return e; continue; }
    if (p === e || p.startsWith(e + '/')) return e;
  }
  return null;
}

ok('slices/ itself is never excluded', !excluded('slices/BOHEMIA_ALPHA_0_9.html'));

/* ---- WHAT ACTUALLY SHIPS IS THE WORKFLOW'S COPY LIST, NOT THIS CONFIG (fixed 8/20)
   THE GATE WAS MEASURING A SURFACE THAT STOPPED BEING PUBLISHED. This file's check 3
   summed everything _config.yml's exclude list KEEPS -- 271 MB -- and went red against
   its own 260 MB cap. But .github/workflows/pages.yml assembles the site by hand:

       mkdir -p _site/records
       cp -r slices _site/slices
       cp -r engine _site/engine
       cp -r records/target _site/records/target
       touch _site/.nojekyll

   `.nojekyll` means JEKYLL NEVER RUNS, so the exclude list governs nothing about the
   deploy; three explicit copies do. The real published surface is 230 MB and the last
   deploy assembled it in ZERO seconds and finished in 41 -- nowhere near the 30-minute
   timeout this cap exists to prevent.

   THE OLD BINDING COULD NOT SEE IT, and that is the reusable part: it asked "is every
   kept folder copied?" with `cp -r records(\s|/)`, which a copy of records/TARGET
   satisfies. A partial copy read as a whole one, so the config believed it published
   all of records/ while the workflow took one subfolder of it. A CHECKER THAT CANNOT
   TELL A PART FROM THE WHOLE IS THE BROKEN ONE (8/1).

   NOTHING IS WEAKENED: the cap is unchanged at 260 MB, the reference check is STRICTER
   (a ref now has to land inside a copied folder, which is the production question, not
   just survive an exclude list that no longer runs), and the drift binding below now
   names a partial copy instead of accepting it. */
/* ---- WHAT SHIPS IS THE PUBLISH LIST (PLUMBER 5, 11/6, rule 411's round: the site is too big) -------------------
   The workflow copied slices/, engine/ and records/target WHOLE: 1,858 MB in 32,040 files on 11/6, against GitHub
   Pages' 1 GB limit and its 10-minute deploy timeout, and 3 of the last 8 deploys died at that timeout. It now copies
   ONLY tools/bohemia_publish_list.js's list (what the pages name, the folders the code builds names in, the cards the
   VOTE tab can draw), computed at deploy from the committed tree. The ROOTS the list draws from are the folders this
   gate used to read off the workflow's `cp -r` lines; a `cp -r` of a whole folder into _site is now a red, because it
   would publish around the list. gates/the_site_serves_what_the_game_loads_gate.js PLAYS the game on a server that
   answers only the list; this gate reads the files. */
const WFP = '.github/workflows/pages.yml';
const wfSrc = fs.existsSync(WFP) ? fs.readFileSync(WFP, 'utf8') : '';
const LISTER = 'tools/bohemia_publish_list.js';
let PL = null; try { PL = require(path.join(ROOT, LISTER)); } catch (e) { PL = null; }
ok('the publish list exists and loads (' + LISTER + ')', !!(PL && PL.compute && PL.ROOTS));
const COPIED = PL ? PL.ROOTS.slice() : [];
const LIST = PL ? PL.compute() : { files: [], size: 0 };
const LISTED = new Set(LIST.files);
ok('the workflow publishes through the list (node ' + LISTER + ' --copy _site)', new RegExp('node\\s+' + LISTER.replace(/[.\/]/g, '\\$&') + '\\s+--copy\\s+_site\\b').test(wfSrc));
const wholeCopies = [...wfSrc.matchAll(/cp -r\s+([A-Za-z0-9_/.-]+)\s+_site\//g)].map(m => m[1]);
ok('the workflow copies no folder whole around the list' + (wholeCopies.length ? ' — cp -r ' + wholeCopies.join(', ') : ''), wholeCopies.length === 0);
ok('a push that changes the list deploys (the workflow\'s paths name ' + LISTER + ')', wfSrc.indexOf("'" + LISTER + "'") >= 0);
ok('_config.yml names the list as what is published (bohemia_publish_list: ' + LISTER + ')', new RegExp('^bohemia_publish_list:\\s*' + LISTER.replace(/[.\/]/g, '\\$&') + '\\s*$', 'm').test(cfg));
const missingSrc = COPIED.filter(c => !fs.existsSync(c));
ok('every folder the list draws from exists on disk (' + COPIED.join(', ') + ')' +
   (missingSrc.length ? ' — ' + missingSrc.join(', ') : ''), COPIED.length > 0 && missingSrc.length === 0);
/* a path ships iff the list carries it */
function shipped(p) { return LISTED.has(p); }

// ---- 1 + 2: every outward reference from a slice still resolves AND still ships -----
/* the pages the site serves: every published .html directly in slices/ (a page deeper down is read by the serve-only gate) */
const slices = LIST.files.filter(f => /^slices\/[^/]+\.html$/.test(f)).map(f => f.slice(7));
ok('the list publishes pages (' + slices.length + ' in slices/)', slices.length > 0);

const REF = /(?:src|href)\s*=\s*"(\.\.\/[^"?#]+)/g;
let refs = 0, dropped = [], missing = [];
for (const f of slices) {
  const txt = fs.readFileSync(path.join('slices', f), 'utf8');
  let m;
  while ((m = REF.exec(txt))) {
    const rel = path.posix.normalize(path.posix.join('slices', m[1]));
    refs++;
    /* THE PRODUCTION QUESTION IS "DOES THE WORKFLOW COPY IT", and that is asked FIRST.
       An exclude entry higher up the tree is not a verdict when the workflow names a
       subfolder underneath it -- records/ is excluded and records/target is copied by
       name, so the ART tab's screens do ship. Reading the exclude list first reported
       36 live references as dropped. */
    if (!fs.existsSync(rel)) { missing.push(f + ' -> ' + rel); continue; }
    if (!shipped(rel)) { const hit = excluded(rel);
      dropped.push(f + ' -> ' + rel + (hit ? '  (excluded by "' + hit + '")'
                                            : '  (not on the publish list: outside ' + COPIED.join(', ') + ', or the list did not read it)')); }
  }
}
ok('every outward reference from a slice is still PUBLISHED (' + refs + ' checked)' +
   (dropped.length ? '\n         ' + [...new Set(dropped)].slice(0, 6).join('\n         ') : ''),
   dropped.length === 0);
ok('every outward reference from a slice EXISTS on disk' +
   (missing.length ? ' — ' + [...new Set(missing)].slice(0, 4).join(', ') : ''),
   missing.length === 0);

// ---- 3: the published surface stays inside what the builder can finish -------------
/* THE BUDGET (PLUMBER 5, 11/6). The old cap, 260 MB, was set 8/6 when the 30-minute Jekyll build died at ~496 MB; the
   copies it measured had grown to 1,858 MB and it had been red for weeks while the deploy failed 3 runs in 8 at the
   10-minute timeout. Publishing the list, measured on ce14b189: 831 MB, 16,198 files. 260 MB is not reachable without
   cutting what the game loads: the fight's boards (92 MB), its sheets (79), the idles (77), the barber's people (88),
   the faces (46), the holds (40), the towns (30) are the game. Lossless shrinking was measured and is not worth it:
   the boards are already lossy WebP, a lossless re-encode of the sheets saves 0 to 4%, the PNGs 2%.
   THE CAP IS 900 MB: under GitHub Pages' documented 1 GB limit with room to spare, about 8% over today. A lane whose
   art takes the list past it finds out here, the moment it does, and makes room (a stand-in out, an old tab's picture
   out of what a page names), rather than the deploy finding out at minute ten. */
const CAP_MB = 900;   /* the publish list may not exceed this; GitHub Pages' limit is 1 GB */
const mb = LIST.size / (1024 * 1024);
ok('the published surface is under ' + CAP_MB + ' MB (measured ' + mb.toFixed(0) + ' MB, ' + LIST.files.length + ' files)', mb > 0 && mb <= CAP_MB);
for (const door of (PL ? PL.ENTRIES : [])) ok('a door is published: ' + door, shipped(door));
ok('the VOTE tab\'s registry and sort are published', shipped('records/target/BOHEMIA_VOTE_REGISTRY.json') && shipped('records/target/BOHEMIA_VOTE_TRIAGE.json'));
{ /* every card the tab can draw ships what it shows */
  let shown = []; try { shown = PL.shownCards(fs.readFileSync(path.join(ROOT, PL.REGISTRY), 'utf8')) || []; } catch (e) {}
  const off = [];
  for (const it of shown) for (const k of ['src', 'first']) { const v = it.show && it.show[k];
    if (!v || /^(https?:|data:)/.test(v) || !/\.[A-Za-z0-9]+$/.test(v)) continue;
    const rel = path.posix.normalize(path.posix.join('slices', v)); if (fs.existsSync(rel) && !shipped(rel)) off.push(it.id + ' -> ' + rel); }
  ok('every card the VOTE tab can draw (' + shown.length + ') has what it shows on the list' + (off.length ? ' — ' + off.slice(0, 4).join(', ') : ''), off.length === 0);
}

// ---- 4: the ONE-LINK LAW's own page is in the published set ------------------------
const LINK = 'slices/BOHEMIA_ALPHA_0_9.html';
ok('the one canonical alpha is published', fs.existsSync(LINK) && shipped(LINK));

// ---- 5: THE DEPLOY WORKFLOW, and it must not become a second source of truth --------
// Measured 8/6, AFTER the size fix landed: FIVE consecutive Pages builds cancelled, each
// killed by the next lane's push, because the lanes push about every thirteen minutes and
// a build takes longer than that. Shrinking the site cannot fix that on its own. The
// built-in builder cancels in flight; a workflow we own can refuse to, and that single
// line is the whole fix — so the gate checks the LINE, not the intention.
const WF = '.github/workflows/pages.yml';
ok('the deploy workflow exists (' + WF + ')', fs.existsSync(WF));
if (fs.existsSync(WF)) {
  const wf = fs.readFileSync(WF, 'utf8');
  ok('the deploy QUEUES instead of cancelling (cancel-in-progress: false)',
     /concurrency:[\s\S]{0,160}cancel-in-progress:\s*false/.test(wf));
  ok('it deploys on a push to main', /branches:\s*\[main\]/.test(wf));
  ok('it can be fired by hand when a lane needs the link now', /workflow_dispatch:/.test(wf));

  // THE BINDING. _config.yml says what is published; the workflow COPIES what is published.
  // Two hand-written lists of the same fact is the bug this repo keeps making (the tilespec
  // list, the grid-dump list, the map-tab list — all of them went stale the same way). So:
  // every top-level folder the config KEEPS must be copied, and the workflow must copy
  // nothing the config excludes. Neither list can drift without this going red.
  const TOP = fs.readdirSync('.', { withFileTypes: true })
    .filter(e => e.isDirectory() && !['.git', '.github', 'node_modules', '_site'].includes(e.name))
    .map(e => e.name);
  const kept = TOP.filter(d => !excluded(d + '/') && !excluded(d));
  /* A PARTIAL COPY IS NOT A COPY. `cp -r records/target` used to satisfy a test for
     "records is copied", so the config could claim to publish 41 MB the workflow never
     touched and nothing went red. Name it: either the whole folder is copied, or the
     config must exclude the parts that are not. */
  const whole = kept.filter(d => COPIED.includes(d));
  const partial = kept.filter(d => !COPIED.includes(d) && COPIED.some(c => c.startsWith(d + '/')));
  const notCopied = kept.filter(d => !whole.includes(d) && !partial.includes(d));
  /* THE LEGITIMATE CARVE-OUT is the other way round: the config EXCLUDES the parent
     and the workflow copies one named subfolder back (records/ excluded, records/target
     copied). That is honest -- both lists agree the parent does not ship. What is NOT
     honest is a parent the config KEEPS with only a subfolder copied, because then the
     config is publishing everything else on paper and nothing in fact. */
  ok('every folder _config.yml KEEPS is copied by the workflow' +
     (notCopied.length ? ' — ' + notCopied.join(', ') : ''), notCopied.length === 0);
  ok('no folder is HALF published — the config keeps it and the workflow takes one subfolder' +
     (partial.length ? ' — ' + partial.map(d => d + ' (only ' +
        COPIED.filter(c => c.startsWith(d + '/')).join(', ') + ')').join('; ') : ''),
     partial.length === 0);

  const copies = COPIED;
  const contradicted = copies.filter(c => {
    const e = excluded(c) || excluded(c + '/');
    if (!e) return false;
    /* a carve-out: the exclude is a PARENT of the copy, so the workflow is naming an
       exception the config already accounts for. A same-or-deeper exclude is a real
       contradiction -- the config forbids exactly the thing being copied. */
    const ee = e.replace(/\/$/, '');
    return !(c.startsWith(ee + '/'));
  });
  ok('the workflow copies nothing _config.yml EXCLUDES' +
     (contradicted.length ? ' — ' + contradicted.join(', ') : ''), contradicted.length === 0);

  // and the alpha has to land at the exact path the ONE-LINK LAW pins, or the link is dead
  ok('the workflow lands slices/ where the one link points (the list copies each file to _site/<its path>)',
     /--copy\s+_site\b/.test(wf) && shipped('slices/BOHEMIA_ALPHA_0_9.html'));
}

/* "THE DEPLOY QUEUES, NEVER CANCELS" WAS PRINTED ON EVERY RUN OF THIS GATE AND IT IS
   NOT TRUE. (Corrected 9/22, PLUMBER, row [list loads].) Measured off the Actions API:
   NINE `pages` runs in a row cancelled, every one with ZERO JOBS, each cancelled at the
   exact second the next push created the next one -- and the last successful deploy was
   455 minutes before that. `concurrency` keeps at most ONE run PENDING per group and a
   newer push supersedes it; cancel-in-progress:false protects a run that is RUNNING, and
   none of those ever reached a runner.
   A GATE THAT PRINTS A REASSURANCE IT DOES NOT CHECK IS WORSE THAN ONE THAT PRINTS
   NOTHING, because it is read as a measurement. This gate never tested that claim; it
   simply carried it from the 8/6 commit message. It now says what it actually holds, and
   points at the gate that does measure the deploy. */
console.log('PAGES PUBLISH GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
            refs + ' outward refs · the publish list ' + mb.toFixed(0) + ' MB in ' + LIST.files.length + ' files / ' + CAP_MB +
            ' MB cap · whether a deploy actually LANDS is not checked here: see ' +
            'gates/the_live_site_is_current_gate.js)');
process.exit(fail ? 1 : 0);
