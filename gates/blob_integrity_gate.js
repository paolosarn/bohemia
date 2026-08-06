#!/usr/bin/env node
/* ============================================================================
   BLOB INTEGRITY GATE — 8/2/26.

   The game Paolo taps is not one document. It is a shell plus EIGHT big ones:
   three base64 blobs still inline in the alpha (COMBAT, RIG, PREFAB) and five
   sibling pages loaded by src -- the walked world, the run, the slice, the map
   and life.

   Different lanes rewrite these by STRING SURGERY every day: decode, replace an
   anchor, re-encode. Every rebase resolves a multi-megabyte file by taking one
   side whole. Nothing checked that what came out the other end was still a
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

   WHAT THIS HOLDS, for every one of them, cheaply and without a browser:
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
  ['COMBAT_B64', 700000],
  ['RIG_B64', 65000],
  ['PREFAB_B64', 7000],
];

/* THE SIBLING PAGES. This gate was written against "the alpha is four inline
   blobs" and that stopped being true HOURS later: 3ef222f measured the alpha at
   38.7 MB growing ~1.4-2.1 MB a day toward GitHub's hard 100 MB push limit (~43
   days to a fleet that cannot ship at all) and lifted CITY_B64 out to
   slices/BOHEMIA_CITY_WORLD.html loaded by fr.src. 38.7 MB -> 2.92 MB, first
   load 12,561 ms -> 398 ms.
   THE CHECK DID NOT GET SMALLER, IT GOT BIGGER. Everything this gate holds --
   not truncated, no merge markers, still parses -- is exactly as true of a
   sibling page as of an inline blob, and there are five of them now, each one a
   surface Paolo opens from a tab. A gate that had refused to follow the
   architecture would have been a gate testing a shape nobody ships. */
const PAGES = [
  /* 8/6: the art bank moved to BOHEMIA_CITY_TILES.js and this page went 28.2 MB ->
     1.0 MB. The floor follows the file, not the memory of it -- a floor left at 19 MB
     would fail a page that is CORRECT and smaller on purpose, which is the same
     mistake as a gate insisting on the shape it was born with. */
  ['BOHEMIA_CITY_WORLD.html', 700000],     // the walked world + city builder (code)
  ['BOHEMIA_CITY_TILES.js', 19000000],     // its art bank, split out 8/6
  ['BOHEMIA_RUN_CURRENT.html', 100000],
  ['BOHEMIA_CURRENT_SLICE.html', 100000],
  ['BOHEMIA_MAP_CURRENT.html', 100000],
  ['BOHEMIA_LIFE_CURRENT.html', 20000],
];

const MARK_START = /^<<<<<<< /m, MARK_END = /^>>>>>>> /m;

function checkDocument(name, body, floor) {
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

/* the blobs still embedded in the alpha */
for (const [name, floor] of BLOBS) {
  const m = new RegExp("const " + name + "='([^']+)'").exec(src);
  ok(name + ' is present as a single-quoted const', !!m);
  if (!m) continue;
  let body = null;
  try { body = Buffer.from(m[1], 'base64').toString('utf8'); } catch (e) { /* below */ }
  ok(name + ' decodes as base64 to UTF-8', typeof body === 'string' && body.length > 0);
  if (body) checkDocument(name, body, floor);
}

/* and the sibling pages the alpha loads by src -- same document, same damage */
for (const [file, floor] of PAGES) {
  const p = path.join(ROOT, 'slices', file);
  ok(file + ' exists (the alpha loads it by src)', fs.existsSync(p));
  if (!fs.existsSync(p)) continue;
  checkDocument(file, fs.readFileSync(p, 'utf8'), floor);
}

/* and the alpha still knows where the world went */
ok('the alpha points at the extracted world page',
  src.indexOf('BOHEMIA_CITY_WORLD.html') >= 0 && /fr\.src\s*=\s*CITY_SRC/.test(src));

/* and the shell the blobs live in */
ok('the alpha shell carries no merge markers', !MARK_START.test(src) && !MARK_END.test(src));

console.log('\n=== BLOB INTEGRITY GATE: ' + pass + ' passed, ' + fail + ' failed ===');
console.log('    eight big documents, rewritten by string surgery daily, now checked for damage.');
if (fail) process.exit(1);
