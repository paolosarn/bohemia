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
  /* 8/26: registered THE SAME TURN the module shipped. The whole point of this
     sweep is that an organ nothing calls is not a feature, and a module the
     sweep does not know about is invisible to exactly that check -- which is
     the rot this file exists to kill, wearing the sweep's own uniform. */
  bohemia_between: 'BohemiaBetween',
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

/* ---- A COMMENT IS NOT A CALLER -------------------------------------------
   THE HAYSTACK CONTAINS THE ANSWER KEY, AGAIN, AND THIS TIME IN MY OWN GATE.
   This file's docstring already warns about it for the SURFACE (the pages inline
   the engine verbatim, so a call inside an inlined body looks like a call from
   the surface) — and the gates/tools tier had no such protection at all. On
   organ_reach_gate.js's first day I wrote, in a COMMENT explaining the sweep:

       the sweep counts reach by looking for `BohemiaCommitment.states(`

   and that sentence became the only "caller" states() had. Deleting its real
   call left the gate GREEN. A green that proves nothing is worse than a red.

   THE FIX IS THE RULER, NOT THE TARGET. "Do not write the pattern in a comment"
   is not a rule anybody can keep; a sweep that cannot tell code from prose is
   the broken thing. Comments are stripped before counting.

   KNOWN LIMIT, STATED: this strip is textual, so a `//` or `/*` living inside a
   string literal eats to the end of that line or block. It can therefore
   UNDERCOUNT, never overcount — and undercounting fails LOUD (a real caller
   looks dead and somebody investigates) while overcounting fails SILENT, which
   is the failure that just happened. Wrong in the safe direction on purpose. */
/* AND THE FIRST CUT OF THIS STRIP WAS TOO GREEDY, WHICH I CAUGHT BY READING THE
   THREE NEW DEADS INSTEAD OF BELIEVING THEM. It stripped EVERY triple-quoted
   Python string as a docstring — but this repo's patch tools carry their JS
   PAYLOAD in exactly those strings (`NEW_ROW = """...body += ctRow(...)..."""`),
   so three functions with real callers were reported dead in one step.
   THE DISTINCTION THAT MATTERS: the MODULE DOCSTRING is prose and everything
   else in triple quotes is code waiting to be written into the city. So only the
   leading docstring goes, and JS comments are stripped from what remains —
   including inside the payloads, because a comment there is still a comment when
   it lands. Three false deads is what "fails loud" looks like when it works. */
function stripComments(src, py) {
  let s = src;
  if (py) {
    /* the module docstring only: the first triple-quoted block, before any code */
    s = s.replace(/^(#![^\n]*\n)?\s*(?:"""[\s\S]*?"""|'''[\s\S]*?''')/, '$1');
    s = s.replace(/(^|\n)\s*#[^\n]*/g, '$1');   /* whole-line python comments */
  }
  s = s.replace(/\/\*[\s\S]*?\*\//g, ' ');
  s = s.replace(/(^|[^:])\/\/[^\n]*/g, '$1');   /* keep https:// intact */
  return s;
}

function codeCount(pattern, dirs) {
  const re = new RegExp(pattern, 'g');
  let n = 0;
  for (const d of dirs) {
    const dir = path.join(ROOT, d);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!/\.(js|py)$/.test(f)) continue;
      let src;
      try { src = fs.readFileSync(path.join(dir, f), 'utf8'); } catch (_e) { continue; }
      n += (stripComments(src, /\.py$/.test(f)).match(re) || []).length;
    }
  }
  return n;
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
  /* PASSED AS A BARE VALUE -- two shapes, and the second was missing.
     `{ties:BohemiaTies}` is the plain one. But this codebase overwhelmingly
     writes the GUARDED form, because a module that might not be inlined must
     not throw:
         between:(typeof BohemiaBetween!=='undefined'?BohemiaBetween:null)
     There the name is followed by `:null)`, so the original character class
     [,)}] could never match it, and a correctly injected module read as seven
     dead organs. Found 8/26 by pointing this sweep at a module written that
     way the same turn it shipped.
     A SWEEP THAT CANNOT TELL AN INJECTED MODULE FROM A DEAD ONE IS THE BROKEN
     THING, NOT THE MODULE -- this file's own docstring, four lines of it, and
     it applies to this file. FIX THE RULER, NEVER THE TARGET. */
  const injected = new RegExp('[:(,]\\s*' + g + '\\s*[,)}]').test(SURF)
                || new RegExp('\\?\\s*' + g + '\\s*:').test(SURF);
  const fns = Object.keys(api).filter(k => typeof api[k] === 'function');
  const rows = fns.map(f => {
    const surf = (SURF.match(new RegExp('\\b' + g + '\\.' + f + '\\s*\\(', 'g')) || []).length;
    /* engine-internal: any call to .f( inside engine/, minus the definition line.
       A helper called by its OWN module is reached, not dead. */
    /* A COMMENT IS NOT A CALLER, AND THIS TIER STILL BELIEVED THEY WERE.
       The lesson below was learned on 8/25 for the gates/tools tier and never
       applied here, one line up. This used a RAW grep, so on 8/26 a sentence
       inside bohemia_between.js reading "what keys() enumerates for a gate to
       sweep" became keys()'s only engine caller, moved it out of tooling-only,
       and made a correct exemption look stale. A dead organ that reads as
       wired is the quiet failure this whole file exists to prevent.
       codeCount strips comments; grepCount does not. Same fix, same file, the
       tier that was missed. */
    const eng = Math.max(0, codeCount('[^.a-zA-Z]' + f + '\\s*\\(', ['engine']) - 1);
    const tool = codeCount(g + '\\.' + f + '\\s*\\(', ['gates', 'tools']);
    /* AND AN INJECTED MODULE IS CALLED THROUGH AN ALIAS, WHICH NEITHER TIER
       ABOVE CAN SEE. `eng` deliberately excludes dotted calls ([^.a-zA-Z]) so
       that Module.fn( is not double counted as an internal helper -- and that
       same exclusion blinds it to B.fn(, which is the ONLY way an injected
       module is ever called. bohemia_commitment.js line 479 reads
           var w = B.weigh(sided, h.faction, lose);
       and the sweep reported weigh as dead. Second ruler bug of the same shape
       in one afternoon: the detector could name the injection and still could
       not follow it.
       ONLY FOR INJECTED MODULES, because a dotted-anything match is broad. The
       standard-library receivers are excluded by name or Object.keys( would
       make every module's keys() look alive forever, which is the opposite
       failure and a quieter one. */
    /* AND THE ALIAS TIER IS BLIND ON A NAME THE LANGUAGE ALREADY OWNS.
       The first cut of this excluded the standard-library RECEIVERS by name
       (Object, Array, Map...) and that is not where the collision lives. The
       receivers in real code are VARIABLES holding those things:
           [...rooms.keys()]        bohemia_floorplan.js:71
           [...this.districts.keys()]   bohemia_engine.js:269
           [...ctx.factions.factions.keys()]  bohemia_loop.js:385
       so BohemiaBetween.keys() -- which nothing in engine/ calls -- read as
       alive off three Map iterations it has no relationship with. That is the
       QUIETER failure this tier risks: a dead organ that looks wired, which is
       the exact thing this whole file exists to catch, produced by the file
       itself.
       So the tier SITS OUT on any name the language already owns. Those
       functions fall back to the honest tiers, which is a real answer rather
       than a confident wrong one. A sweep that cannot tell your keys() from a
       Map's keys() should say so by declining, not by guessing. */
    const AMBIGUOUS = new Set(['keys', 'values', 'entries', 'get', 'set', 'has',
      'add', 'delete', 'clear', 'map', 'filter', 'forEach', 'find', 'some',
      'every', 'includes', 'indexOf', 'push', 'pop', 'slice', 'splice', 'join',
      'concat', 'sort', 'reverse', 'next', 'then', 'catch', 'call', 'apply',
      'bind', 'toString', 'valueOf', 'test', 'exec', 'match', 'replace',
      'split', 'trim', 'close', 'open', 'read', 'write', 'on', 'off', 'emit']);
    const canAlias = injected && !AMBIGUOUS.has(f);
    const ALIASABLE = '(?<![.\\w])(?!Object\\b|Array\\b|Math\\b|JSON\\b|String\\b'
                    + '|Number\\b|Date\\b|Promise\\b|Reflect\\b|Map\\b|Set\\b)'
                    + '[A-Za-z_$][\\w$]*\\.' + f + '\\s*\\(';
    const engAlias  = canAlias ? codeCount(ALIASABLE, ['engine']) : 0;
    const toolAlias = canAlias ? codeCount(ALIASABLE, ['gates', 'tools']) : 0;
    return { f, surf, eng: eng + engAlias, tool: tool + toolAlias };
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
