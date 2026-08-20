#!/usr/bin/env node
/* ============================================================================
   BOHEMIA ORGAN REACH — DOES ANYTHING ON THE WALKED SURFACE ACTUALLY CALL THIS?
   (8/20/26, FACTIONS lane)

   Law:  laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md (sec 4h, 4i)
   Read: records/BOHEMIA_A_WIRE_TO_THE_WRONG_SURFACE_8_20_26.md

   REUSE CHECK (REUSE-FIRST): cooks nothing, edits nothing, writes nothing. It
   only reads engine modules and the pages that inline them. gates/sfx_wired_gate.py
   and gates/silent_moments_gate.js answer the same question for SOUNDS and are
   the shape a GATE version of this should copy; neither generalises to arbitrary
   engine modules, which is why this exists as a tool.

   ------------------------------------------------------------------------
   THE SHAPE IT LOOKS FOR
   ------------------------------------------------------------------------
   Seven times in one week, in this lane alone: AN ORGAN COMPUTES SOMETHING AND
   NOTHING ON THE WALKED SURFACE CALLS IT. give(), the uncollected favour, the
   cost that cost nothing, the ladder with no rungs, neglectFor, the count that
   was asked to remember, askOutcome. Six were found by tripping over them.

   It never shows up as a crash. The organ is correct, its unit test is green,
   its gate is green, and the feature does not exist for the player.

   ------------------------------------------------------------------------
   THE TIERS, AND WHY THREE
   ------------------------------------------------------------------------
     SURFACE   called from the page he walks, OUTSIDE the inlined module bodies
     ENGINE    called by another module (or its own) — reached, just not directly
     TOOLING   only a gate or a tool touches it — it exists for the machine
     NOTHING   an organ with no body

   A helper called by its own module is FINE and must not be reported as dead;
   that is the difference between this and a naive grep.

   ------------------------------------------------------------------------
   THE BLIND SPOT THAT ALMOST PRODUCED A FALSE FINDING, AND HOW IT IS HANDLED
   ------------------------------------------------------------------------
   The first version reported `BohemiaTies: 10 functions, 0 called` — a whole
   module with no callers. Great finding, completely WRONG. The module is handed
   to another organ AS A VALUE:

       BohemiaCommitment.whoHears(fid, roster, cell, {ties: BohemiaTies, keyOf: ...})

   so its methods are called under another name and a textual `Global.fn(` count
   cannot see them. A SWEEP THAT CANNOT TELL AN INJECTED MODULE FROM A DEAD ONE
   IS THE BROKEN THING, NOT THE MODULE (fix the ruler, never the target).
   So: any module passed as a bare value is flagged INJECTED, and its functions
   are never reported as dead without that flag printed beside them.

   AND THE HAYSTACK CONTAINS THE ANSWER KEY. The pages INLINE the engine verbatim,
   so a call inside an inlined body looks exactly like a call from the surface.
   The inlined spans are cut out before counting. (The SOUNDS lane hit the
   identical trap the same week — its EVENTS table named every id in the
   haystack and the check tested nothing.)

   ------------------------------------------------------------------------
   node tools/bohemia_organ_reach.js [--surface <file>] [module ...]
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = path.dirname(__dirname);

/* module file -> the global it publishes when a page inlines it. Add a row when
   a lane wants its own organs swept; nothing here is faction-specific except the
   default list. */
const GLOBALS = {
  bohemia_commitment: 'BohemiaCommitment',
  bohemia_belonging: 'BohemiaBelonging',
  bohemia_claim: 'BohemiaClaim',
  bohemia_favour: 'BohemiaFavour',
  bohemia_introductions: 'BohemiaIntros',
  bohemia_ties: 'BohemiaTies',
  bohemia_people: 'BohemiaPeople',
};

const argv = process.argv.slice(2);
let surface = 'slices/BOHEMIA_CITY_WORLD.html';
const mods = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--surface') { surface = argv[++i]; continue; }
  mods.push(argv[i]);
}
const MODS = mods.length ? mods : Object.keys(GLOBALS);

const SURFACE_PATH = path.join(ROOT, surface);
if (!fs.existsSync(SURFACE_PATH)) {
  console.error('no such surface: ' + surface);
  process.exit(2);
}
const RAW = fs.readFileSync(SURFACE_PATH, 'utf8');

/* CUT THE INLINED MODULE BODIES OUT. A call inside an inlined module is not a
   call FROM the surface, and leaving them in makes every organ look alive. */
function surfaceOnly(src) {
  let s = src;
  for (const m of Object.keys(GLOBALS)) {
    const p = path.join(ROOT, 'engine', m + '.js');
    if (!fs.existsSync(p)) continue;
    const lines = fs.readFileSync(p, 'utf8').split('\n').filter(l => l.trim().length > 20);
    let first = null, last = null;
    for (const l of lines) if (s.indexOf(l) >= 0) { first = l; break; }
    for (let i = lines.length - 1; i >= 0; i--) if (s.indexOf(lines[i]) >= 0) { last = lines[i]; break; }
    if (!first || !last) continue;
    const a = s.indexOf(first), b = s.indexOf(last, a);
    if (a >= 0 && b > a) s = s.slice(0, a) + '\n/*<<INLINED ' + m + '>>*/\n' + s.slice(b + last.length);
  }
  return s;
}
const SURF = surfaceOnly(RAW);

function grepCount(pattern, globs) {
  try {
    const out = cp.execSync('rg -c --no-filename -e ' + JSON.stringify(pattern)
      + ' ' + globs + ' 2>/dev/null || true', { cwd: ROOT, encoding: 'utf8' });
    return out.split('\n').filter(Boolean).reduce((a, b) => a + (parseInt(b, 10) || 0), 0);
  } catch (_e) { return 0; }
}

console.log('ORGAN REACH — surface: ' + surface + '\n');
const dead = [];
for (const m of MODS) {
  const g = GLOBALS[m];
  if (!g) { console.log('  ' + m + ': no global registered, skipped'); continue; }
  let api;
  try { api = require(path.join(ROOT, 'engine', m + '.js')); }
  catch (e) { console.log('  ' + m + ': LOAD FAIL ' + e.message); continue; }

  /* is the module handed to somebody as a VALUE? then a textual count is a lie */
  const injected = new RegExp('[:(,]\\s*' + g + '\\s*[,)}]').test(SURF);
  const fns = Object.keys(api).filter(k => typeof api[k] === 'function');
  const rows = fns.map(f => {
    const surf = (SURF.match(new RegExp('\\b' + g + '\\.' + f + '\\s*\\(', 'g')) || []).length;
    /* engine-internal: any call to .f( inside engine/, minus the definition line.
       A helper called by its OWN module is reached, not dead. */
    const eng = Math.max(0, grepCount('[^.a-zA-Z]' + f + '\\s*\\(', 'engine/') - 1);
    const tool = grepCount(g + '\\.' + f + '\\s*\\(', 'gates/ tools/');
    return { f, surf, eng, tool };
  });
  const onSurface = rows.filter(r => r.surf > 0);
  const viaEngine = rows.filter(r => r.surf === 0 && r.eng > 0);
  const toolOnly = rows.filter(r => r.surf === 0 && r.eng === 0 && r.tool > 0);
  const nothing = rows.filter(r => r.surf === 0 && r.eng === 0 && r.tool === 0);

  console.log('  ' + g.padEnd(22) + fns.length + ' fns  |  surface ' + onSurface.length
    + '  engine ' + viaEngine.length + '  tooling-only ' + toolOnly.length
    + '  NOTHING ' + nothing.length + (injected ? '   [INJECTED as a value]' : ''));
  if (toolOnly.length)
    console.log('      only a gate or tool: ' + toolOnly.map(r => r.f).join(', '));
  if (nothing.length) {
    console.log('      *** NOTHING ANYWHERE: ' + nothing.map(r => r.f).join(', ')
      + (injected ? '  (module is injected — verify by hand before believing this)' : ''));
    nothing.forEach(r => dead.push(g + '.' + r.f + (injected ? '  [injected]' : '')));
  }
}

console.log('\n' + (dead.length
  ? dead.length + ' ORGAN(S) WITH NO BODY:\n  ' + dead.join('\n  ')
    + '\n\nAn organ with no caller is not a shipped feature. It is a candidate on a sheet.'
  : 'every exported function is reached by the surface, another module, or the machine.'));
