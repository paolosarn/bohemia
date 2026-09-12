#!/usr/bin/env node
/*
 * ENGINE CENSUS GATE -- WHICH ENGINE MODULES ARE ACTUALLY IN THE SHIPPED GAME.
 * (9/11/26, PLUMBER lane, VAMILY row [dead modules] TWENTY-NINE-ENGINE-MODULES-NOBODY-LOADS)
 *
 * THE ROW: "EYES E11 measured the shipped game live in a browser: it fetches 17
 * files and nothing else in the repo is reachable at runtime; 29 engine modules
 * have no reader, THE BIGGEST 281 KB. Dead weight for [slim build]: confirm each
 * is unreachable from both entry points, archive with a record, never delete
 * blind."
 *
 * ## THE ROW'S PREMISE IS WRONG, AND ACTING ON IT WOULD HAVE DELETED LIVE CODE.
 *
 * "Unreachable as a FILE" is not "dead". This repo INLINES engine modules into
 * the slices: the walked city carries 103 of them inside its own HTML, marked
 * `==== engine/<name>.js ====`. The file is then never fetched -- and it is also
 * the CANON COPY that the ENGINE SYNC law compares every carrier against. Archive
 * it and the code keeps running while its canon disappears.
 *
 * THE 281 KB MODULE THE ROW NAMES AS THE BIGGEST DEAD ONE IS LIVE. All 1277 of
 * its body lines are in the shipped game, word for word. Measured 9/11 -- these are
 * a SNAPSHOT and the engine grows; the live count is in the record the gate writes,
 * records/BOHEMIA_ENGINE_CENSUS.json, re-derived on every run:
 *
 *     172 engine modules                                    3820 KB
 *       0 loaded as a FILE by any reachable slice              0 KB
 *     103 INLINED into a reachable slice, marker and all     2025 KB
 *      38 code present in a shipped slice without a marker   1461 KB
 *      31 code NOWHERE in the shipped game                    334 KB
 *
 * SO THE MOST ARCHIVING COULD EVER SAVE IS 334 KB OF 3820 KB, and of that 334 KB
 * every file but one is somebody's subject: 25 are read by a gate or a tool and 9
 * have their whole body carried inside a bundle a gate checks by md5 (4 are both).
 * Archiving any of them turns a checker red. Exactly ONE module, bohemia_tests.js
 * at 15 KB, is read by nothing and carried by nothing, and this gate NAMES it
 * rather than assume it either way.
 *
 * There is nothing here for [slim build].
 *
 * ## HOW A MODULE IS PLACED (and why the first version of this got it wrong)
 *
 * v1 matched ONE "signature" line per module. That let a 151 KB STORAGE BUNDLE
 * pass as live because one prose sentence inside it also appears in the game.
 * v2 takes every body line over 45 characters, looks each one up in a Set of the
 * shipped game's own lines (inlining is verbatim, so lines match exactly), and
 * asks what FRACTION landed. The answer is bimodal and the gap is wide: live
 * modules score 72%-100%, dead ones 0%-20%. Nothing sits in between except that
 * one bundle at 58%, which says "BUNDLE FOR PROJECT STORAGE" on its own line 1.
 * The gap check holds that open: if a module ever drifts into the middle, somebody
 * has to look at it instead of a threshold deciding quietly.
 *
 * WHAT IT HOLDS:
 *   - the floors, first: this gate's whole subject is a count, and a sweep that
 *     found no modules, no shipped text or no shipped lines agrees with every
 *     claim about them. Three of the ten checks exist only to fail an empty run.
 *   - every engine module lands in exactly ONE bucket; none falls through
 *   - a module the census recorded as IN THE SHIPPED GAME still exists on disk.
 *     That is "never delete blind" made mechanical: the day somebody archives
 *     live canon, this names the file.
 *   - every module the census calls ABSENT is somebody's subject -- read by a
 *     gate or a tool, or carried whole inside another engine module. Anything
 *     else is genuinely orphaned and has to be on the NAMED list below.
 *   - that list is a ONE-WAY RATCHET. A new orphan is red. A name on the list
 *     that stopped being an orphan is red too, so the list cannot go stale.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);
const SIZE = require(path.join(__dirname, 'bohemia_build_size.js'));

const RECORD = 'records/BOHEMIA_ENGINE_CENSUS.json';

/* A module the shipped game does not carry, that no gate or tool reads, and that
 * no other engine module carries whole. Measured 9/11/26. THIS LIST MAY ONLY
 * SHRINK: adding a name here is admitting a new orphan, and this lane may not
 * delete another lane's files, so the honest move is to name it and say why. */
const KNOWN_ORPHANS = {
  'bohemia_tests.js':
    '15 KB of test fixtures from 7/2. No gate runs it, no tool reads it, no bundle '
    + 'carries it. Named in five laws and in four judge pages that are themselves '
    + 'unreachable. Its owner is whoever revives those tests, not the PLUMBER.'
};

/* A module allowed to sit in the grey band between live and dead, with the reason. */
const KNOWN_BUNDLES = {
  'BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js':
    'says "BUNDLE FOR PROJECT STORAGE -- reference copy" on its own line 1. It is 14 '
    + 'modules concatenated; some of the 14 are inlined into the game on their own, so '
    + 'half its lines are in the shipped text and half are not. bundle_gate.js checks it.'
};

const GREY_LO = 0.35, GREY_HI = 0.65;

let pass = 0, fail = 0;
const ok = (c, m, got) => { if (c) { pass++; console.log('  ok   ' + m + (got ? '   [' + got + ']' : '')); }
  else { fail++; console.log('  FAIL ' + m + (got ? '   [' + got + ']' : '')); } };

/* every line long enough to be this module's own and not boilerplate or a comment */
function bodyLines(src) {
  return src.split('\n').map(l => l.trim()).filter(l =>
    l.length > 45 && !l.startsWith('*') && !l.startsWith('//')
    && !l.startsWith('/*') && !l.startsWith('#'));
}

/* WHO COUNTS AS A READER, AND THE TWO WAYS THIS GOT IT WRONG FIRST.
 *
 * (1) THIS GATE DOES NOT COUNT AS A READER OF ANYTHING. The orphan list above names
 *     its files in order to say nothing reads them. If that naming counted, every
 *     orphan would read as looked-after the moment it was written down and this
 *     check would report green over nothing. The first run of v2 did exactly that.
 *
 * (2) A MENTION IS NOT A USE, in the suite registry specifically. bohemia_gates.py
 *     is a CATALOGUE: 580-odd rows, each a command plus a paragraph of prose saying
 *     what the gate protects. Writing this gate's own paragraph -- which names the
 *     orphan -- made the catalogue a "reader" of it, and the check went green again
 *     one step removed. In that file a module is read only if a row RUNS it, which
 *     means its name appears as an argv path, `'engine/<name>'`. Nine
 *     bohemia_loop_*_tests.js modules are owned exactly that way and stay owned.
 *     This is the same hole reusefirst_gate.py closed on 8/20, in a new place. */
const SELF = path.basename(__filename);
const CATALOGUE = 'bohemia_gates.py';
function readersOf(base) {
  const out = [];
  const scan = dir => {
    for (const n of fs.readdirSync(dir)) {
      const f = path.join(dir, n);
      let st; try { st = fs.statSync(f); } catch (e) { continue; }
      if (st.isDirectory()) { scan(f); continue; }
      const bn = path.basename(f);
      if (!/\.(js|py)$/.test(n) || bn === base || bn === SELF) continue;
      let s = ''; try { s = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
      const hit = bn === CATALOGUE
        ? (s.includes("'engine/" + base + "'") || s.includes('"engine/' + base + '"'))
        : s.includes(base);
      if (hit) out.push(f);
    }
  };
  for (const d of ['gates', 'tools']) { try { scan(d); } catch (e) {} }
  return out;
}

(function main() {
  console.log('\nEVERY ENGINE MODULE, AGAINST WHAT THE SHIPPED GAME ACTUALLY CARRIES');

  const modules = fs.readdirSync('engine').filter(f => f.endsWith('.js')).sort();
  const R = SIZE.report();
  const reachedSlices = R.inv.reached.map(f => f.rel)
    .filter(p => p.startsWith('slices/') && p.endsWith('.html'));
  const blobs = reachedSlices.map(p => { try { return fs.readFileSync(p, 'utf8'); } catch (e) { return ''; } });
  const shipped = blobs.join('\n');

  /* the shipped game's own lines, so "is this line in the game" is exact and O(1) */
  const shippedLines = new Set();
  for (const b of blobs) for (const l of b.split('\n')) { const t = l.trim(); if (t.length > 45) shippedLines.add(t); }

  /* ---- THE FLOORS, BEFORE ANY VERDICT ---------------------------------- */
  ok(modules.length > 100, 'the engine folder was actually read (' + modules.length + ' modules, floor 100). '
     + 'A census of an empty folder agrees with every claim about it');
  ok(reachedSlices.length > 0 && shipped.length > 1000000,
     'the shipped game was actually loaded (' + reachedSlices.length + ' reachable slices, '
     + (shipped.length / 1048576).toFixed(1) + ' MB). An empty haystack makes every module look dead, '
     + 'which is the exact mistake this gate exists to stop');
  ok(shippedLines.size > 10000, 'and it was actually split into lines to match against ('
     + shippedLines.size + ' distinct long lines, floor 10000). This Set IS the mechanism: if it '
     + 'came out empty every module would score 0% and the gate would call the whole engine dead');

  /* ---- THE THREE BUCKETS ----------------------------------------------- */
  const marked = [], present = [], absent = [], grey = [], thin = [];
  const score = {};
  for (const b of modules) {
    const src = fs.readFileSync('engine/' + b, 'utf8');
    if (shipped.includes('==== engine/' + b + ' ====')) { marked.push(b); score[b] = 1; continue; }
    const L = bodyLines(src);
    const hit = L.filter(l => shippedLines.has(l)).length;
    const frac = L.length ? hit / L.length : 0;
    score[b] = frac;
    if (L.length < 4) thin.push(b + ' (' + hit + '/' + L.length + ')');
    if (frac > GREY_LO && frac < GREY_HI) grey.push(b + ' (' + (frac * 100).toFixed(0) + '%)');
    if (frac >= GREY_HI) present.push(b); else absent.push(b);
  }
  const kb = a => (a.reduce((x, b) => x + fs.statSync('engine/' + b).size, 0) / 1024).toFixed(0);

  console.log('\n    ' + modules.length + ' engine modules, ' + kb(modules) + ' KB');
  console.log('      ' + String(marked.length).padStart(3) + '  INLINED into a shipped slice, marker and all   ' + kb(marked) + ' KB');
  console.log('      ' + String(present.length).padStart(3) + '  code present in a shipped slice, no marker     ' + kb(present) + ' KB');
  console.log('      ' + String(absent.length).padStart(3) + '  code NOWHERE in the shipped game               ' + kb(absent) + ' KB');
  console.log('        0  loaded as a FILE by a reachable slice         (the game inlines, it does not fetch)');

  ok(marked.length + present.length + absent.length === modules.length,
     'every module lands in exactly one bucket, none falls through',
     marked.length + ' + ' + present.length + ' + ' + absent.length + ' = ' + modules.length);
  ok(marked.length + present.length > 100,
     'MOST OF THE ENGINE IS LIVE, and the row that started this called it dead. "Unreachable as a '
     + 'file" is not "dead": this repo inlines engine modules into the slices, so the file is never '
     + 'fetched AND is the canon copy ENGINE SYNC compares against',
     (marked.length + present.length) + ' of ' + modules.length + ' carried by the shipped game');

  /* ---- THE GAP BETWEEN LIVE AND DEAD IS WIDE, AND STAYS WIDE ----------- */
  const greyUnknown = grey.filter(g => !KNOWN_BUNDLES[g.split(' ')[0]]);
  ok(greyUnknown.length === 0,
     'live and dead are far apart, so no threshold is deciding quietly. Live modules score '
     + (Math.min(...present.map(b => score[b])) * 100).toFixed(0) + '%-100%, dead ones 0%-'
     + (Math.max(0, ...absent.filter(b => !KNOWN_BUNDLES[b]).map(b => score[b])) * 100).toFixed(0)
     + '%. A module landing in the middle is half-inlined and a person has to look at it',
     greyUnknown.length ? greyUnknown.join(', ')
       : (grey.length ? grey.length + ' in the middle, all named bundles: ' + grey.join(', ')
                      : 'nothing in the middle at all'));
  ok(thin.filter(t => present.includes(t.split(' ')[0])).length === 0,
     'no module is called LIVE on fewer than four lines of evidence. A three-line module matching '
     + 'three lines is not proof it is in the game, it is proof its lines are short',
     thin.length ? thin.length + ' thin module(s), all of them absent: ' + thin.join(', ') : 'none thin');

  /* ---- NEVER DELETE BLIND ---------------------------------------------- */
  let prior = null;
  if (fs.existsSync(RECORD)) { try { prior = JSON.parse(fs.readFileSync(RECORD, 'utf8')); } catch (e) {} }
  const live = marked.concat(present).sort();
  if (prior && Array.isArray(prior.inTheShippedGame)) {
    const gone = prior.inTheShippedGame.filter(b => !fs.existsSync('engine/' + b));
    ok(gone.length === 0,
       'NEVER DELETE BLIND: a module this census recorded as being IN THE SHIPPED GAME still exists. '
       + 'Archiving one of those leaves its code running with no canon copy, which is the ENGINE SYNC '
       + 'law broken by a tidy-up',
       gone.length ? gone.join(', ') : prior.inTheShippedGame.length + ' still present');
  } else {
    ok(true, 'first run: recording which modules the shipped game carries, so a later delete of one '
       + 'of them is a named red line', live.length + ' recorded');
  }

  /* ---- AN ABSENT MODULE MUST BE SOMEBODY'S SUBJECT --------------------- */
  const why = {};
  const orphans = [];
  for (const b of absent) {
    const rd = readersOf(b);
    const L = bodyLines(fs.readFileSync('engine/' + b, 'utf8'));
    let carrier = null;
    if (L.length) {
      for (const o of modules) {
        if (o === b) continue;
        const os = fs.readFileSync('engine/' + o, 'utf8');
        if (L.every(l => os.includes(l))) { carrier = o; break; }
      }
    }
    const routes = [];
    if (rd.length) routes.push(rd.length + ' gate/tool');
    if (carrier) routes.push('carried whole by ' + carrier);
    why[b] = routes.join(' + ');
    if (!routes.length) orphans.push(b);
  }
  const byReader = absent.filter(b => why[b].includes('gate/tool'));
  const byCarrier = absent.filter(b => why[b].includes('carried whole'));

  console.log('\n    OF THE ' + absent.length + ' THE SHIPPED GAME DOES NOT CARRY (' + kb(absent) + ' KB):');
  console.log('      ' + byReader.length + ' are read by a gate or a tool (' + kb(byReader) + ' KB)');
  console.log('      ' + byCarrier.length + ' have their whole body inside another engine module (' + kb(byCarrier) + ' KB)');
  console.log('      ' + orphans.length + ' are read by nothing and carried by nothing (' + kb(orphans) + ' KB)');
  for (const b of orphans) console.log('          ' + b + ' -- ' + (KNOWN_ORPHANS[b] || 'NEW, UNEXPLAINED'));

  const surprises = orphans.filter(b => !KNOWN_ORPHANS[b]);
  ok(surprises.length === 0,
     'every module the game does not carry is somebody\'s subject: read by a gate or a tool, or '
     + 'carried whole inside another engine module. One that is neither is genuinely orphaned and '
     + 'has to be NAMED in this gate rather than assumed either way',
     surprises.length ? 'NEW ORPHAN: ' + surprises.join(', ')
       : absent.length + ' absent, ' + orphans.length + ' orphaned and named');

  const stale = Object.keys(KNOWN_ORPHANS).filter(b => !orphans.includes(b));
  ok(stale.length === 0,
     'and the named list cannot go stale. A name on it that is no longer an orphan -- somebody gave '
     + 'it a reader, or deleted it -- is red, so the list only ever shrinks',
     stale.length ? 'STALE: ' + stale.join(', ') + ' (delete the entry)'
       : Object.keys(KNOWN_ORPHANS).length + ' named, all still orphaned');

  console.log('\n    SO THE MOST ARCHIVING COULD EVER SAVE IS ' + kb(absent) + ' KB OF ' + kb(modules) + ' KB,');
  console.log('    and all but ' + kb(orphans) + ' KB of that turns a checker red. Nothing here for [slim build].');

  /* WRITE ONLY WHEN THE CENSUS ITSELF CHANGED. This runs inside the full suite, and a
   * record that rewrites its own timestamp every run leaves the tree dirty for whoever
   * ran it -- eighteen lanes seeing a modified file they did not touch. The timestamp is
   * compared out, so the file moves when the ANSWER moves and not before. */
  if (!fail) {
    const body = JSON.stringify({
      what: 'Which engine modules the shipped game actually carries. Written by gates/engine_census_gate.js.',
      why: 'The [dead modules] row called 29 modules dead including a 281 KB one that is LIVE. '
         + 'The game INLINES engine modules, so a module unreachable as a file can be running code '
         + 'whose canon copy is that file. Deleting one breaks ENGINE SYNC quietly.',
      how: 'A module is LIVE if the shipped slices carry its inline marker, or if at least '
         + (GREY_HI * 100) + '% of its body lines over 45 characters appear verbatim in the shipped text.',
      taken: new Date().toISOString(),
      counts: { modules: modules.length, inlinedWithMarker: marked.length,
                codePresentNoMarker: present.length, absentFromGame: absent.length,
                absentButRead: byReader.length, absentButCarried: byCarrier.length,
                orphaned: orphans.length },
      kb: { modules: +kb(modules), inlinedWithMarker: +kb(marked),
            codePresentNoMarker: +kb(present), absentFromGame: +kb(absent), orphaned: +kb(orphans) },
      inTheShippedGame: live,
      absentFromGame: absent.map(b => ({ module: b, keptAliveBy: why[b] || 'nothing' })),
      orphaned: orphans
    }, null, 1);
    const strip = t => t.replace(/"taken": "[^"]*",?/, '');
    let had = ''; try { had = fs.readFileSync(RECORD, 'utf8'); } catch (e) {}
    if (strip(had) !== strip(body)) fs.writeFileSync(RECORD, body);
  }

  console.log('\n=== ENGINE CENSUS GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
