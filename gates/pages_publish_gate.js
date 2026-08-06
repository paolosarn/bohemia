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

// ---- 1 + 2: every outward reference from a slice still resolves AND still ships -----
const slices = fs.readdirSync('slices').filter(f => f.endsWith('.html'));
ok('slices/ has pages in it (' + slices.length + ')', slices.length > 0);

const REF = /(?:src|href)\s*=\s*"(\.\.\/[^"?#]+)/g;
let refs = 0, dropped = [], missing = [];
for (const f of slices) {
  const txt = fs.readFileSync(path.join('slices', f), 'utf8');
  let m;
  while ((m = REF.exec(txt))) {
    const rel = path.posix.normalize(path.posix.join('slices', m[1]));
    refs++;
    const hit = excluded(rel);
    if (hit) dropped.push(f + ' -> ' + rel + '  (excluded by "' + hit + '")');
    else if (!fs.existsSync(rel)) missing.push(f + ' -> ' + rel);
  }
}
ok('every outward reference from a slice is still PUBLISHED (' + refs + ' checked)' +
   (dropped.length ? '\n         ' + [...new Set(dropped)].slice(0, 6).join('\n         ') : ''),
   dropped.length === 0);
ok('every outward reference from a slice EXISTS on disk' +
   (missing.length ? ' — ' + [...new Set(missing)].slice(0, 4).join(', ') : ''),
   missing.length === 0);

// ---- 3: the published surface stays inside what the builder can finish -------------
// RATCHET. The build that timed out was copying ~496 MB. This is the measured size of
// what Pages will actually publish now, and it may not creep back up to that.
const CAP_MB = 260;   // the published tree may not exceed this; b09f3ab died at ~496
function dirSize(p) {
  let n = 0;
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    const full = path.posix.join(p, e.name);
    if (e.name === '.git') continue;
    if (excluded(full) || excluded(full + '/')) continue;
    if (e.isDirectory()) n += dirSize(full);
    else if (e.isFile()) { try { n += fs.statSync(full).size; } catch (_) {} }
  }
  return n;
}
const mb = dirSize('.') / (1024 * 1024);
ok('the published surface is under ' + CAP_MB + ' MB (measured ' + mb.toFixed(0) + ' MB)', mb <= CAP_MB);

// ---- 4: the ONE-LINK LAW's own page is in the published set ------------------------
const LINK = 'slices/BOHEMIA_ALPHA_0_9.html';
ok('the one canonical alpha is published', fs.existsSync(LINK) && !excluded(LINK));

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
  const notCopied = kept.filter(d => !new RegExp('cp -r\\s+' + d + '(\\s|/)').test(wf));
  ok('every folder _config.yml KEEPS is copied by the workflow' +
     (notCopied.length ? ' — ' + notCopied.join(', ') : ''), notCopied.length === 0);

  const copies = [...wf.matchAll(/cp -r\s+([A-Za-z0-9_/.-]+)\s/g)].map(m => m[1].replace(/\/$/, ''));
  const contradicted = copies.filter(c => excluded(c) || excluded(c + '/'));
  ok('the workflow copies nothing _config.yml EXCLUDES' +
     (contradicted.length ? ' — ' + contradicted.join(', ') : ''), contradicted.length === 0);

  // and the alpha has to land at the exact path the ONE-LINK LAW pins, or the link is dead
  ok('the workflow lands slices/ where the one link points',
     /cp -r\s+slices\s+_site\/slices/.test(wf));
}

console.log('PAGES PUBLISH GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
            refs + ' outward refs · published surface ' + mb.toFixed(0) + ' MB / ' + CAP_MB +
            ' MB cap · the deploy queues, never cancels)');
process.exit(fail ? 1 : 0);
