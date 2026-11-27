#!/usr/bin/env node
/* THE PATCH LAYERS ONLY GO DOWN (PLUMBER 9, 11/27/26, VAMILY rule 495(c)).

   Paolo 11/27: "don't just fuck it up and fix it with fucked up coding duct tape... everything has to
   have the final organizational work of the code in mind... when we give it to a publisher."
   Rule 495(c): "the marked patch blocks layered into the big pages (the fight, the alpha, the demo, the
   city world, the settlement screen) and the copies between pages are counted by a gate, and the count
   may only go down: a new fix folds into the owning module or retires an older patch beside it."

   THIS IS THAT GATE. It runs the census (tools/bohemia_publisher_read.js, the one place the counting
   lives) and holds every number to gates/BOHEMIA_PATCH_LAYER_RATCHET.json:

     per big page: BLOCKS (a named patch's opening line, "/* ==== __NAME__"), HOOK LINES (a line outside
       a patch's own block that carries its name: a fix reaching back into older code) and OVERRIDES
       (a function declared twice at the top level, or a declared function assigned over: the newest
       copy silently wins);
     across the core (the big pages and the scripts they load): INLINED PAIRS (a module pasted into a
       page, counted per module and page, so a new function in an already-pasted module costs nothing,
       but pasting a module into one more page costs one), PASTED COPIES (a function body of 100+ chars
       in two core files that no module carries: a hand copy) and LOADED TWICE (a page that loads a
       module by <script src> AND carries a pasted copy of it).

   A number above its ratchet is RED: fold the fix into its owning module, or retire an older patch
   beside it (take its block out, or move it into the module the page loads). A number BELOW its ratchet
   is green and says LOWER IT: run this gate with --tighten in the same commit and the ratchet comes
   down to the new count (it never goes up; --tighten refuses to raise a number).

   R1 blocks, R2 hook lines, R3 overrides, per page, not above the ratchet
   R4 inlined pairs, R5 pasted copies, R6 loaded twice, not above the ratchet
   M1 the ratchet names all five big pages and every copy number
   P1 PLANTED: one more patch block and two hooks in the fight page's text read as +1 block, +2 hooks
   P2 PLANTED: a function declared twice and one assigned over read as +2 overrides
   P3 PLANTED: a body in two core pages and no module reads as a pasted copy; a module's bodies in a
      page read as one inlined pair; a page that also loads it reads as loaded twice
   About 30 s. No browser. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = require(path.join(ROOT, 'tools', 'bohemia_publisher_read.js'));
const RATCHET = path.join(__dirname, 'BOHEMIA_PATCH_LAYER_RATCHET.json');

let passed = 0, failed = 0;
function ok(name, cond, detail) {
  if (cond) passed++; else failed++;
  console.log((cond ? '  PASS ' : '  FAIL ') + name + (detail ? '  -- ' + detail : ''));
}

function now() {
  const c = R.census({});
  const pages = {};
  for (const p of R.BIG_PAGES) pages[p] = { blocks: c.pages[p].blocks, hookLines: c.pages[p].hookLines, overrides: c.pages[p].overrides };
  return { c, held: { pages, copies: { inlinedPairs: c.copies.inlinedPairs, pastedCopies: c.copies.pastedCopies, loadedTwice: c.copies.loadedTwice } } };
}

function main() {
  console.log('\nTHE PATCH LAYERS ONLY GO DOWN\n');
  const tighten = process.argv.includes('--tighten');
  const { c, held } = now();
  const r = fs.existsSync(RATCHET) ? JSON.parse(fs.readFileSync(RATCHET, 'utf8')) : null;

  ok('M1 the ratchet names all five big pages and every copy number',
     !!r && R.BIG_PAGES.every(p => r.pages && r.pages[p] && ['blocks', 'hookLines', 'overrides'].every(k => Number.isFinite(r.pages[p][k]))) &&
     ['inlinedPairs', 'pastedCopies', 'loadedTwice'].every(k => r.copies && Number.isFinite(r.copies[k])),
     r ? 'gates/BOHEMIA_PATCH_LAYER_RATCHET.json' : 'no ratchet file');
  const rr = r || { pages: {}, copies: {} };
  const lower = [];
  const leg = (id, what, key) => {
    const over = [], parts = [];
    for (const p of R.BIG_PAGES) {
      const have = held.pages[p][key], cap = (rr.pages[p] || {})[key];
      parts.push(path.basename(p, '.html').replace('BOHEMIA_', '') + ' ' + have + '/' + cap);
      if (!(have <= cap)) over.push(path.basename(p) + ' ' + have + ' > ' + cap);
      else if (have < cap) lower.push(p + ' ' + key + ' ' + cap + ' -> ' + have);
    }
    ok(id + ' ' + what + ', per big page, not above the ratchet', !over.length,
       over.length ? 'ABOVE: ' + over.join('; ') + '. Fold the fix into its owning module, or retire an older patch beside it' : parts.join(', '));
  };
  leg('R1', 'patch blocks', 'blocks');
  leg('R2', 'hook lines', 'hookLines');
  leg('R3', 'overrides', 'overrides');
  const cleg = (id, what, key, hint) => {
    const have = held.copies[key], cap = rr.copies[key];
    if (have < cap) lower.push('copies ' + key + ' ' + cap + ' -> ' + have);
    ok(id + ' ' + what + ' not above the ratchet', have <= cap, have + ' (ratchet ' + cap + ')' + (have > cap ? '. ' + hint : ''));
  };
  cleg('R4', 'inlined pairs (a module pasted into a big page)', 'inlinedPairs',
       'A module was pasted into one more page: load it with <script src> instead');
  cleg('R5', 'pasted copies (a hand copy no module carries)', 'pastedCopies',
       'A function was copied: put it once in a module both files load. The newest: ' +
       c.copies.pasted.slice(0, 3).map(x => x.name + ' in ' + x.files.map(f => path.basename(f)).join(' and ')).join('; '));
  cleg('R6', 'loaded twice (by src and pasted)', 'loadedTwice', 'Take the pasted copy out; the page already loads the module');

  // ---- the plants: prove each count moves the way the ratchet needs it to
  const fightRel = 'slices/BOHEMIA_FIGHT.html';
  const fightText = fs.readFileSync(path.join(ROOT, fightRel), 'utf8');
  const base = R.patchLayers(R.unitFromText(fightRel, fightText));
  const plant = '\n<script>\n/* ==== __A_PLANTED_PATCH__ (the gate\'s own plant) ==== */\nvar __planted = 1;\n/* ==== end __A_PLANTED_PATCH__ ==== */\n</script>\n' +
                '<script>\nvar a = 1;   /* __A_PLANTED_PATCH__ */\nvar b = 2;   /* __A_PLANTED_PATCH__: a second hook */\n</script>\n';
  const at = fightText.lastIndexOf('</body>');
  const planted = at > 0 ? fightText.slice(0, at) + plant + fightText.slice(at) : fightText + plant;
  const pl = R.patchLayers(R.unitFromText(fightRel, planted));
  ok('P1 PLANTED: one more patch block and two hooks read as +1 block and +2 hook lines',
     pl.blocks === base.blocks + 1 && pl.hookLines === base.hookLines + 2,
     'blocks ' + base.blocks + ' -> ' + pl.blocks + ', hooks ' + base.hookLines + ' -> ' + pl.hookLines);

  const files = [fightRel];
  const noMod = () => null;
  const ovA = R.pageReport('slices/PLANT.html', R.unitFromText('slices/PLANT.html',
    '<script>\nfunction keep(){ return 1; }\nfunction twice(){ return 2; }\n</script>'), files, noMod, {});
  const ovB = R.pageReport('slices/PLANT.html', R.unitFromText('slices/PLANT.html',
    '<script>\nfunction keep(){ return 1; }\nfunction twice(){ return 2; }\n</script>\n<script>\nfunction twice(){ return 3; }\nwindow.keep = function(){ return 4; };\nvar fresh = function(){ return 5; };\n</script>'), files, noMod, {});
  ok('P2 PLANTED: a function declared twice and one assigned over read as +2 overrides (a fresh var is not one)',
     ovA.overrides === 0 && ovB.overrides === 2, ovA.overrides + ' -> ' + ovB.overrides);

  const body = 'x'.repeat(R.MIN_BODY + 10);
  const mk = (files) => ({ name: 'f', len: body.length, files: new Set(files) });
  const bodies = new Map([
    ['h1', mk(['slices/A.html', 'slices/B.html'])],                        // a hand copy between two core pages
    ['h2', mk(['engine/m.js', 'slices/A.html'])], ['h3', mk(['engine/m.js', 'slices/A.html'])], ['h4', mk(['engine/m.js', 'slices/A.html'])],
    ['h5', mk(['engine/n.js', 'slices/B.html'])], ['h6', mk(['engine/n.js', 'slices/B.html'])], ['h7', mk(['engine/n.js', 'slices/B.html'])],
  ]);
  const core = new Set(['slices/A.html', 'slices/B.html', 'engine/n.js']);
  const cc = R.classifyCopies(bodies, core, pg => pg === 'slices/B.html' ? ['../engine/n.js'] : []);
  ok('P3 PLANTED: a body in two core pages reads as 1 pasted copy; a module in a page as 1 inlined pair; loaded and pasted as loaded twice',
     cc.pastedCopies === 1 && cc.inlinedPairs === 2 && cc.loadedTwice === 1,
     'pasted ' + cc.pastedCopies + ', pairs ' + cc.inlinedPairs + ', loaded twice ' + cc.loadedTwice);

  // ---- the numbers, and the way down
  console.log('\n  NOW: ' + R.BIG_PAGES.map(p => path.basename(p, '.html').replace('BOHEMIA_', '') + ' ' +
    held.pages[p].blocks + '/' + held.pages[p].hookLines + '/' + held.pages[p].overrides).join(', ') + ' (blocks/hooks/overrides); copies ' +
    held.copies.inlinedPairs + ' pairs, ' + held.copies.pastedCopies + ' pasted, ' + held.copies.loadedTwice + ' loaded twice');
  if (lower.length) {
    console.log('  BELOW THE RATCHET (good): ' + lower.join('; '));
    if (tighten && r) {
      const next = JSON.parse(JSON.stringify(r));
      for (const p of R.BIG_PAGES) for (const k of ['blocks', 'hookLines', 'overrides']) next.pages[p][k] = Math.min(r.pages[p][k], held.pages[p][k]);
      for (const k of ['inlinedPairs', 'pastedCopies', 'loadedTwice']) next.copies[k] = Math.min(r.copies[k], held.copies[k]);
      next.lowered = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(RATCHET, JSON.stringify(next, null, 1) + '\n');
      console.log('  --tighten: the ratchet is lowered to these numbers; commit gates/BOHEMIA_PATCH_LAYER_RATCHET.json with your change');
    } else console.log('  LOWER IT in the same commit: node gates/the_patch_layers_only_go_down_gate.js --tighten');
  }
  console.log('\nTHE PATCH LAYERS ONLY GO DOWN: ' + passed + ' passed, ' + failed + ' failed');
}

main();
process.exit(failed ? 1 : 0);
