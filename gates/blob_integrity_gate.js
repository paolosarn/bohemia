#!/usr/bin/env node
/* ============================================================================
   BLOB INTEGRITY GATE — 8/2/26.

   The alpha is four base64 blobs in a trench coat:

       CITY_B64     28.1 M chars decoded   the walked world + city builder
       COMBAT_B64    1.06 M                the combat slice
       RIG_B64        95.9 K                the rig tool
       PREFAB_B64     10.6 K                the prefab tool

   Four different lanes rewrite these by STRING SURGERY every day: decode,
   replace an anchor, re-encode. Every rebase resolves a 34 MB file by taking one
   side whole. Nothing checks that what comes out the other end is still a
   coherent document.

   WHAT TODAY PROVED, twice, in one day:
     * the game shipped as a BLACK SCREEN because one </div> went missing. Every
       gate was green. It took a human tapping the link to find it, and the
       second time it also masqueraded as a dead COMBAT tab, sending another lane
       bisecting toward the wrong cause.
     * PREFAB_B64 can be silently replaced and NOTHING notices. Measured, not
       assumed: changing its accent colour left alpha_loads (20/0), city_tab
       (64/0) and rig_is_law (12/0) all green. It has no content check at all.

   The existing checks are PRESENCE and SIZE FLOOR ("RIG_B64 exists and is over
   100,000 chars"). A stale or half-merged re-encode keeps both properties. That
   is the exact shape of damage this repo actually produces, and it was the one
   shape nothing looked for.

   WHAT THIS HOLDS, for every blob, cheaply and without a browser:
     1. it is present and decodes as base64 to real UTF-8
     2. it is not TRUNCATED — HTML tags balance, the document closes
     3. it carries NO MERGE MARKERS — a blob is where a bad conflict resolution
        hides best, because nobody reads 28 million characters
     4. its inline <script> bodies still PARSE as JavaScript
     5. it has not silently collapsed — a floor under each blob's decoded size

   ON 4, AND WHY IT IS WORTH THE TROUBLE: "IT PARSES IS NOT IT RUNS" (Paolo 8/2,
   black screen plus one red line) cuts the other way too. It runs is not it
   parses: a string-surgery patch that drops a brace produces a file that boots
   far enough to look fine and dies on a code path nobody walks that day. Parsing
   is cheap and it is the floor, not the ceiling — combat_runs_smoke, zoomseam
   and the run gate drive these surfaces for real, and they stay the ceiling.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL ' + n)); };

const src = fs.readFileSync(ALPHA, 'utf8');

/* floors are ~70% of what each blob measured on 8/2 — loose enough that ordinary
   growth and trimming never trip it, tight enough that a collapse or a truncated
   merge cannot hide. */
const BLOBS = [
  ['CITY_B64', 19000000],
  ['COMBAT_B64', 700000],
  ['RIG_B64', 65000],
  ['PREFAB_B64', 7000],
];

const MARK_START = /^<<<<<<< /m, MARK_END = /^>>>>>>> /m;

for (const [name, floor] of BLOBS) {
  const m = new RegExp("const " + name + "='([^']+)'").exec(src);
  ok(name + ' is present as a single-quoted const', !!m);
  if (!m) continue;

  let body = null;
  try { body = Buffer.from(m[1], 'base64').toString('utf8'); } catch (e) { /* below */ }
  ok(name + ' decodes as base64 to UTF-8', typeof body === 'string' && body.length > 0);
  if (!body) continue;

  ok(name + ' has not collapsed (' + body.length.toLocaleString() + ' chars, floor '
    + floor.toLocaleString() + ')', body.length >= floor);

  /* TRUNCATION. Count only real tags, and skip the ones HTML never closes.
     Comments are stripped first: this repo's blobs are full of prose that
     mentions tags, and a checker that cannot tell a mention from a use is the
     broken one (8/1). */
  const stripped = body.replace(/<!--[\s\S]*?-->/g, '');
  /* COUNT THE SIMPLE WAY, and this is the second draft on purpose. The first
     walked every tag with one clever regex and reported CITY_B64 at 63 open vs
     64 close, COMBAT_B64 at 60/61 and RIG_B64 missing a </script> -- three
     truncated blobs, which would have been a serious accusation. Counting the
     plain way says 64/64, 61/61 and 1/1. THE BLOBS WERE FINE AND MY RULER WAS
     BENT. Fix the ruler, never the target (8/1). Simple and verifiable beats
     clever and wrong, in a checker more than anywhere else. */
  for (const tag of ['html', 'body', 'div', 'script', 'style']) {
    const o = (stripped.match(new RegExp('<' + tag + '\\b', 'gi')) || []).length;
    const c = (stripped.match(new RegExp('</' + tag + '>', 'gi')) || []).length;
    if (!o && !c) continue;
    ok(name + ' is not truncated: <' + tag + '> balances (' + o + ' open / ' + c + ' close)', o === c);
  }

  ok(name + ' CARRIES NO MERGE MARKERS', !MARK_START.test(body) && !MARK_END.test(body));

  /* PARSE every inline script. new vm.Script compiles without executing, which is
     exactly what is wanted: syntax only, no side effects, no globals touched. */
  let scripts = 0, broken = [];
  for (const s of stripped.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
    const code = s[1];
    if (!code.trim()) continue;
    if (/\btype\s*=\s*["'](?!text\/javascript|module)/.test(s[0])) continue;  // json/template blocks
    scripts++;
    try { new vm.Script(code); } catch (e) { broken.push(String(e.message).slice(0, 70)); }
  }
  ok(name + ' every inline script PARSES (' + scripts + ' scripts'
    + (broken.length ? ' — ' + broken[0] : '') + ')', broken.length === 0);
}

/* and the shell the blobs live in */
ok('the alpha shell carries no merge markers', !MARK_START.test(src) && !MARK_END.test(src));

console.log('\n=== BLOB INTEGRITY GATE: ' + pass + ' passed, ' + fail + ' failed ===');
console.log('    four blobs, rewritten by string surgery daily, now checked for damage.');
if (fail) process.exit(1);
