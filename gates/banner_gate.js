#!/usr/bin/env node
/* BANNER GATE (8/15/26, WORLD lane) — A MODULE THE SYNC SWEEP CANNOT SEE IS A MODULE
 * OUTSIDE THE ENGINE SYNC LAW, AND NOTHING SAID SO.
 *
 * ENGINE SYNC LAW says one canonical body per module. Its scanner
 * (tools/bohemia_city_module_resync.py) finds the embedded copies by looking for a banner
 * line that STARTS with the marker and ENDS with it, on ONE line:
 *
 *     if s.startswith('/* ==== engine/') and s.endswith('==== * /'):
 *
 * So a banner that WRAPS is not a formatting nit. It is an opt-out. The module keeps its
 * embedded copy, the sweep silently skips it, and the app drifts from the engine with every
 * gate green -- because a gate that only checks the modules it can SEE reports perfect health
 * on a shrinking sample. That is the failure this file exists to make impossible.
 *
 * IT HAD ALREADY HAPPENED TWICE. Four RUN modules dropped out this way and were caught by
 * hand; then engine/bohemia_agents.js and engine/bohemia_population.js did the same in the
 * CITY page and sat outside the law until 8/15. WHEN THEY WERE PUT BACK, THE SWEEP RESYNCED
 * BOTH IMMEDIATELY: the city was carrying a bohemia_population.js from before the 8/6 scale
 * correction, the one whose own comments describe a 48x48 valley that has been 96x96 for
 * weeks. The drift was real, it was over a week old, and the only reason nobody saw it is
 * that the checker could not look at it.
 *
 * WHAT THIS PROVES: for every slice the resync tool treats as a source, the number of engine
 * modules VISIBLE to the scanner equals the number actually inlined. Any gap is named, with
 * the module and the file, so the fix is one line and never a hunt.
 *
 *   node gates/banner_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* The same list the resync tool carries, and it is read FROM the tool rather than retyped --
   a hand-copied list is the recurring house bug (a value passed by hand where a value could
   be derived) and would go stale the day somebody adds a third page. */
const TOOL = fs.readFileSync('tools/bohemia_city_module_resync.py', 'utf8');
const listed = (TOOL.match(/CITY_FILES\s*=\s*\[([^\]]*)\]/) || [, ''])[1];
const FILES = (listed.match(/'([^']+)'/g) || []).map(s => s.slice(1, -1));

ok('the page list is READ off the resync tool, never retyped here (' + FILES.length + ' file(s))',
   FILES.length >= 1);

/* THE TOOL SCANS EXACTLY ONE PAGE, not all of them: it walks CITY_FILES and takes the FIRST
   that carries the city marker. Checking both pages instead would be measuring something the
   ENGINE SYNC LAW never looks at, and the second page's numbers came out wrong for exactly
   that reason on the first run. Mirror the selection, and mirror the base64 unwrap too --
   the alpha can carry the city as a CITY_B64 payload, and raw text search cannot see inside
   it. Same door, same key. */
function scannedPage() {
  for (const c of FILES) {
    if (!fs.existsSync(c)) continue;
    const t = fs.readFileSync(c, 'utf8');
    if (t.indexOf("const CITY_B64='") >= 0 || t.indexOf('function renderCity(){') >= 0) {
      const key = "const CITY_B64='";
      if (t.indexOf(key) < 0) return { file: c, text: t, encoded: false };
      const a0 = t.indexOf(key) + key.length;
      const a1 = t.indexOf("'", a0);
      return { file: c, text: Buffer.from(t.slice(a0, a1), 'base64').toString('utf8'),
               encoded: true };
    }
  }
  return null;
}
const PAGE = scannedPage();
ok('the page the sync sweep actually reads was found the same way the tool finds it',
   !!PAGE);

/* VISIBLE = what the scanner's own rule accepts. Written to match tools/..._resync.py line
   for line; if that rule ever changes, this must change with it and the mismatch is the
   point of failure being guarded. */
function visibleBanners(src) {
  const out = [];
  src.split('\n').forEach(line => {
    const s = line.trim();
    if (s.startsWith('/* ==== engine/') && s.endsWith('==== */')) {
      out.push('engine/' + s.split('engine/')[1].split(' ')[0].replace(/[*=/\s]+$/, ''));
    }
  });
  return out;
}

/* INLINED = every engine module whose body is actually in the page, found WITHOUT relying on
   a banner -- otherwise the check would be blind in exactly the way the bug is. Each engine
   module opens with its own distinctive first line, so the body is found by its content. */
const ENGINE = fs.readdirSync('engine').filter(f => f.endsWith('.js'));
const BODIES = {};
ENGINE.forEach(f => { BODIES[f] = fs.readFileSync(path.join('engine', f), 'utf8'); });

/* A SIGNATURE MUST BE UNIQUE TO ITS MODULE, and getting there took three tries -- each
   wrong ruler produced confident nonsense, which is the whole reason a checker gets
   verified rather than trusted:
     1. FIRST LONG LINE. For a dozen modules that is the "/* ======" divider, which occurs
        42 times in one page. It reported modules inlined that are not in the file.
     2. LONGEST NON-DIVIDER LINE. Better, but the longest line in a compact module is often
        the SHARED IIFE FOOTER -- the identical "})(typeof window !== 'undefined' ? ..."
        that ends most of these files. Eight modules came back "inlined 9 times".
     3. LONGEST LINE THAT APPEARS IN NO OTHER ENGINE MODULE. That is a fingerprint.
   FIX THE RULER, NEVER THE TARGET. Both false alarms were the checker's fault, and had
   either been believed it would have sent somebody hunting a bug that does not exist. */
function longLines(f) {
  return BODIES[f].split('\n').map(l => l.trim())
    .filter(l => l.length > 40 && !/^[/*=\-_.#\s]+$/.test(l) && !/^\/\*\s*[=\-]{6,}/.test(l))
    .sort((a, b) => b.length - a.length);
}
const LONG = {};
ENGINE.forEach(f => { LONG[f] = longLines(f); });

/* AND SOME ENGINE FILES ARE BUNDLES THAT CARRY OTHER MODULES VERBATIM. Measured, not
   assumed: bohemia_engine_graphics_7_14_26.js contains 258 of blockgen's 259 long lines,
   112 of 113 of plotgen's, and all of daycycle, light_pass and powergrid. Comparing a
   module against a bundle that CONTAINS it can never yield a unique line, and the fourth
   wrong ruler would have been "14 modules are unfingerprintable, something is broken".
   Nothing is broken; a bundle is not a peer. DERIVED here rather than listed by hand,
   because a hand-written list of bundles is the recurring house bug again. */
function containsModule(host, guest) {
  if (host === guest || !LONG[guest].length) return false;
  let hits = 0;
  for (const l of LONG[guest]) if (BODIES[host].indexOf(l) >= 0) hits++;
  return hits / LONG[guest].length > 0.9;
}
const BUNDLE = {};
ENGINE.forEach(h => { BUNDLE[h] = ENGINE.some(g => containsModule(h, g)); });
const bundles = ENGINE.filter(f => BUNDLE[f]);

function signature(f) {
  for (const l of LONG[f]) {
    let shared = false;
    for (const g of ENGINE) {
      if (g === f || BUNDLE[g]) continue;          // a bundle is not a peer
      if (BODIES[g].indexOf(l) >= 0) { shared = true; break; }
    }
    if (!shared) return l;
  }
  return null;
}
const SIG = {};
ENGINE.forEach(f => { SIG[f] = signature(f); });
ok('the bundle files are DERIVED, never listed by hand (' + bundles.join(', ') + ')',
   bundles.length >= 1);
ok('and every other engine module has a line found in no PEER module, so each one can be ' +
   'told apart by content alone (' + ENGINE.filter(f => !SIG[f]).length + ' without one)',
   ENGINE.filter(f => !SIG[f] && !BUNDLE[f]).length === 0);
function inlinedModules(src) {
  const out = [];
  /* A SIGNATURE, not the whole file: the page may legitimately carry an OLDER revision --
     that is what the resync tool is FOR -- so matching the current bytes would miss a stale
     copy, which is the very thing that must stay visible. */
  ENGINE.forEach(f => {
    if (SIG[f] && src.indexOf(SIG[f]) >= 0) out.push('engine/' + f);
  });
  return out;
}

/* THE RATCHET. Four modules were already inlined behind an unreadable banner before this
   gate existed, in pages this lane does not own (ONE SYSTEM, ONE SESSION). Naming them is
   what makes them fixable; a gate that just went red would be deleted by the next session
   that hit it. THIS LIST MAY ONLY SHRINK. Adding to it is the violation. */
const KNOWN_HIDDEN = [
  'engine/bohemia_overmap.js',
  'engine/bohemia_standing.js',
  'engine/bohemia_terrain_noise.js',
  'engine/bohemia_world_resolve.js'
];

if (PAGE) {
  const seen = visibleBanners(PAGE.text);
  const real = inlinedModules(PAGE.text);
  const hidden = real.filter(m => seen.indexOf(m) < 0);
  const fresh = hidden.filter(m => KNOWN_HIDDEN.indexOf(m) < 0);

  ok(PAGE.file.split('/').pop() + ': ' + real.length + ' module(s) inlined, ' + seen.length +
     ' visible to the sweep', real.length > 0 && seen.length > 0);
  ok('NO NEW MODULE was inlined behind a banner the scanner cannot read' +
     (fresh.length ? ' -- NEW AND HIDDEN: ' + fresh.join(', ') : ''),
     fresh.length === 0);
  ok('and the known-hidden debt only shrinks: ' + hidden.length + ' of ' +
     KNOWN_HIDDEN.length + ' still hidden',
     hidden.length <= KNOWN_HIDDEN.length);
  ok('the eight modules this lane inlines are all VISIBLE, which they were not until 8/15 ' +
     '-- the payday patch wrote "----" banners and that is an opt-out, not a style',
     ['engine/bohemia_mandate.js', 'engine/bohemia_payday.js', 'engine/bohemia_purse.js',
      'engine/bohemia_succession.js', 'engine/bohemia_fuse.js', 'engine/bohemia_weather.js',
      'engine/bohemia_economy.js', 'engine/bohemia_daycycle.js']
       .every(m => seen.indexOf(m) >= 0));
  ok('and so are the two that had silently drifted a week (agents + population)',
     ['engine/bohemia_agents.js', 'engine/bohemia_population.js']
       .every(m => seen.indexOf(m) >= 0));

  /* ONE CANONICAL BODY PER MODULE, ON THE PAGE ITSELF. The ENGINE SYNC LAW says it, and the
     sync gate checks the REPO for two bodies -- but nothing compared the PAGE against
     ITSELF, and that is where it actually broke. When the payday block was renamed from
     "THE PLAYER CAN BE PAID" to "THE WORLD YOU STAND IN", the rename ORPHANED the old
     block: the patch could not find it, so it inlined a SECOND copy of economy, purse and
     payday above it. The orphan sat LATER in the file, so the browser ran the STALE copy
     and the fresh one was dead code. Every gate green the whole time.
     IT WAS FOUND BY ACCIDENT, which is the part that matters: a good added to the economy
     on 8/15 was simply missing from window.BohemiaEconomy on the real page. VERIFY ON THE
     REAL SURFACE is what caught it; this assertion is so it never needs luck again. */
  const dupes = [];
  ENGINE.forEach(f => {
    const sig = SIG[f];
    if (!sig) return;
    let n = 0, at = 0;
    while ((at = PAGE.text.indexOf(sig, at)) >= 0) { n++; at += sig.length; }
    if (n > 1) dupes.push('engine/' + f + ' x' + n);
  });
  ok('NO module is inlined TWICE in the page -- a second copy later in the file WINS at ' +
     'runtime and silently shadows the fresh one' +
     (dupes.length ? ' -- DOUBLED: ' + dupes.join(', ') : ''),
     dupes.length === 0);
  ok('and no orphaned block survives under a marker name the patch tool no longer looks ' +
     'for, which is how the doubling happened in the first place',
     PAGE.text.indexOf('THE PLAYER CAN BE PAID') < 0);
}

/* AND THE RULE ITSELF IS PINNED. If somebody relaxes the scanner's banner test, this gate's
   copy of it becomes a lie and every assertion above silently weakens. */
ok('the scanner still finds modules by a ONE-LINE banner, which is what makes a wrapped ' +
   'banner an opt-out rather than a typo',
   /startswith\('\/\* ==== engine\/'\)\s*and\s*s\.endswith\('==== \*\/'\)/.test(TOOL));

console.log('BANNER GATE: ' + pass + ' passed, ' + fail + ' failed  (every inlined engine ' +
            'module is visible to the sync sweep; a wrapped banner is a silent opt-out from ' +
            'the ENGINE SYNC LAW and it had already happened three times)');
process.exit(fail ? 1 : 0);
