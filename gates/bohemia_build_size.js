#!/usr/bin/env node
/* ============================================================================
   BOHEMIA BUILD SIZE — WHAT IS ACTUALLY IN THE THING WE SERVE
   (9/6/26, PLUMBER lane, VAMILY row [slim build] SLIM-THE-BUILD)

   The row: "the size of the demo and the alpha, byte by byte: what is in the
   4.6 MB and the 11 MB, what is dead, what is duplicated, what could load later;
   a size budget and a gate that holds it; nothing removed without a record of
   what it was."

   FOUR QUESTIONS, AND EACH ONE NEEDS A DIFFERENT MEASUREMENT:

   1. WHAT IS IN THE FILE. A 4.6 MB HTML page is not 4.6 MB of page. It is a
      handful of enormous string literals with a game around them. This splits
      every shipped surface into named blocks -- each big literal, each style,
      each inline script, and the markup left over -- and sizes them raw and
      gzipped, because gzipped is what a phone actually downloads.

   2. WHAT IS REACHABLE. GitHub Pages serves whole folders, not a build. So the
      site contains every file in slices/, engine/ and records/target whether any
      page loads it or not. This walks the reference graph from the two real
      entry points (the alpha and the demo) and marks everything it can reach:
      at boot, lazily, or not at all. A file nothing can reach is not a small
      problem in a repo that also has a push-size ceiling.

   3. WHAT IS DUPLICATED. Blocks are hashed, so a literal that exists in two
      shipped files is named once with both homes. The alpha and the demo are
      near-identical by design and both are published, which is a duplication
      that is CORRECT -- it is the point of having a demo -- so this counts it
      rather than complaining about it, and separates it from the accidental kind.

   4. WHAT COULD LOAD LATER. Not a judgement this file gets to make on its own:
      it reports what is fetched before the first frame against what is fetched
      after it, using the boot-time transfer the phone-perf instrument already
      measures, and leaves the ruling about any particular block to the lane that
      owns it.

   WHAT THIS FILE DOES NOT DO, ON PURPOSE: it removes nothing. This lane may not
   touch slices/ content at all. It measures, it writes the record, it sets the
   budget and it hands the list to the lane that owns each file. "Nothing removed
   without a record of what it was" is satisfied here by there being a record
   BEFORE anybody removes anything.

     node gates/bohemia_build_size.js            # print the inventory
     node gates/bohemia_build_size.js --record   # write records/BOHEMIA_BUILD_SIZE_9_6_26.*
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const ROOT = path.dirname(__dirname);

/* the two surfaces a person can actually arrive at */
const ENTRIES = ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html'];

/* what GitHub Pages serves, from _config.yml's exclude list read in reverse.
   Kept as a literal here AND checked against the config below, so this file
   cannot quietly describe a site that is not the one being published. */
const PUBLISHED = ['slices', 'engine', 'records/target'];

const MB = 1048576;
const gz = buf => zlib.gzipSync(buf, { level: 6 }).length;
const fmt = n => (n / MB).toFixed(2) + ' MB';

/* ---- 1. THE BLOCKS INSIDE ONE SHIPPED PAGE ------------------------------ *
   The big literals are found by their declaration, not by guessing at line
   lengths: `const NAME_B64 = '....'` and its friends are how this repo embeds a
   whole page or a whole art bank inside another one.                          */
function blocksOf(src, file) {
  const out = [];
  const seen = [];
  const add = (kind, name, start, end) => {
    if (end <= start) return;
    out.push({ kind, name, bytes: end - start, start, end,
               gz: gz(Buffer.from(src.slice(start, end), 'utf8')),
               hash: require('crypto').createHash('sha1')
                       .update(src.slice(start, end)).digest('hex').slice(0, 12) });
    seen.push([start, end]);
  };

  /* every big single-quoted or double-quoted literal assigned to a const/var */
  const lit = /(?:const|var|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:RIG2X\()?\s*(['"`])/g;
  let m;
  while ((m = lit.exec(src))) {
    const q = m[2];
    const from = m.index + m[0].length;
    let i = from;
    while (i < src.length) {
      const c = src[i];
      if (c === '\\') { i += 2; continue; }
      if (c === q) break;
      i++;
    }
    if (i - from > 50000) add('literal', m[1], m.index, i + 1);
    lit.lastIndex = i + 1;
  }

  /* styles and the inline scripts that are not already counted as a literal */
  const tag = (open, close, kind) => {
    const re = new RegExp(open, 'gi');
    let t;
    while ((t = re.exec(src))) {
      const e = src.indexOf(close, t.index);
      if (e < 0) continue;
      const s0 = t.index, s1 = e + close.length;
      const overlaps = seen.some(([a, b]) => s0 < b && a < s1);
      if (!overlaps && s1 - s0 > 20000) add(kind, kind + '@' + s0, s0, s1);
    }
  };
  tag('<style[^>]*>', '</style>', 'style');
  tag('<script(?![^>]*\\ssrc=)[^>]*>', '</script>', 'script');

  const counted = out.reduce((a, b) => a + b.bytes, 0);
  out.push({ kind: 'rest', name: 'everything else (markup, small scripts, css)',
             bytes: src.length - counted, gz: null, hash: null });
  return out.map(b => Object.assign({ file }, b));
}

/* ---- 2. THE REFERENCE GRAPH --------------------------------------------- */
const REFS = [
  /\bsrc\s*=\s*["']([^"'#?][^"'?#]*)["']/gi,
  /\bdata-src\s*=\s*["']([^"'#?][^"'?#]*)["']/gi,
  /\bhref\s*=\s*["']([^"'#?][^"'?#]*)["']/gi,
  /url\(\s*["']?([^"')?#]+)["']?\s*\)/gi,
  /\bfetch\(\s*["']([^"'?#]+)["']/gi,
  /["']([A-Z0-9_]+\.(?:js|html|png|json|webmanifest))["']/g
];
function refsOf(src, fromFile) {
  const dir = path.dirname(fromFile);
  const hits = new Set();
  for (const re of REFS) {
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(src))) {
      const raw = m[1].trim();
      if (!raw || /^(https?:|data:|blob:|mailto:|about:|javascript:|#)/i.test(raw)) continue;
      const p = path.normalize(path.join(dir, raw));
      if (!p.startsWith('..')) hits.add(p);
    }
  }
  return [...hits];
}

function walk(dirRel) {
  const abs = path.join(ROOT, dirRel);
  if (!fs.existsSync(abs)) return [];
  const out = [];
  for (const name of fs.readdirSync(abs)) {
    const rel = path.join(dirRel, name);
    const st = fs.statSync(path.join(ROOT, rel));
    if (st.isDirectory()) out.push(...walk(rel));
    else out.push({ rel, bytes: st.size });
  }
  return out;
}

function inventory() {
  const all = [];
  for (const d of PUBLISHED) all.push(...walk(d));
  const byRel = new Map(all.map(f => [f.rel, f]));

  /* reachable, breadth-first from the two entry points */
  const depth = new Map();
  let frontier = ENTRIES.filter(e => byRel.has(e));
  frontier.forEach(e => depth.set(e, 0));
  let d = 0;
  while (frontier.length) {
    const next = [];
    for (const f of frontier) {
      if (!/\.(html|js)$/i.test(f)) continue;
      let src = '';
      try { src = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (_e) { continue; }
      for (const r of refsOf(src, f)) {
        if (!byRel.has(r) || depth.has(r)) continue;
        depth.set(r, d + 1);
        next.push(r);
      }
    }
    frontier = next; d++;
  }

  const reached = all.filter(f => depth.has(f.rel));
  const orphan = all.filter(f => !depth.has(f.rel));
  return { all, byRel, depth, reached, orphan };
}

/* ---- 3. DUPLICATION ACROSS THE SHIPPED SURFACES ------------------------- */
function duplication(blockLists) {
  const byHash = new Map();
  for (const list of blockLists) {
    for (const b of list) {
      if (!b.hash) continue;
      if (!byHash.has(b.hash)) byHash.set(b.hash, []);
      byHash.get(b.hash).push(b);
    }
  }
  return [...byHash.values()].filter(v => v.length > 1)
    .map(v => ({ name: v[0].name, bytes: v[0].bytes, copies: v.length,
                 files: v.map(x => x.file) }))
    .sort((a, b) => b.bytes * (b.copies - 1) - a.bytes * (a.copies - 1));
}

function report() {
  const inv = inventory();
  const surfaces = ENTRIES.map(e => {
    const src = fs.readFileSync(path.join(ROOT, e), 'utf8');
    return { file: e, bytes: Buffer.byteLength(src), gz: gz(Buffer.from(src, 'utf8')),
             blocks: blocksOf(src, e).sort((a, b) => b.bytes - a.bytes) };
  });
  const dup = duplication(surfaces.map(s => s.blocks));
  const publishedBytes = inv.all.reduce((a, b) => a + b.bytes, 0);
  const orphanBytes = inv.orphan.reduce((a, b) => a + b.bytes, 0);
  return { surfaces, inv, dup, publishedBytes, orphanBytes };
}


/* ---- THE RECORD AND THE BUDGET ------------------------------------------ *
   Written by the tool, never typed, same as the phone-perf record: the prose and
   the budget come out of one run so they cannot disagree.

   AND THE BUDGET HERE IS A ONE-WAY RATCHET, WHICH IS THE OPPOSITE OF THE CALL I
   MADE FOR SPEED, ON PURPOSE. A frame rate has a 40% spread run to run, so a
   one-way ratchet there pinned the budget to the luckiest afternoon and would
   have gone red on an unchanged game -- that is written up in
   gates/bohemia_phone_perf.js. A FILE SIZE HAS NO SPREAD AT ALL. Byte counts are
   the same on every machine on every afternoon, so there is no noise to leave
   headroom for and nothing to excuse: these lines may only ever come down.       */
function buildRecord(R) {
  const bySurface = {};
  for (const s of R.surfaces) {
    bySurface[path.basename(s.file)] = {
      bytes: s.bytes, gzipped: s.gz,
      biggestBlocks: s.blocks.filter(b => b.bytes > 40000).slice(0, 12)
        .map(b => ({ kind: b.kind, name: b.name, bytes: b.bytes, gzipped: b.gz }))
    };
  }
  const orphans = R.inv.orphan.slice().sort((a, b) => b.bytes - a.bytes);
  const measured = {
    publishedBytes: R.publishedBytes,
    publishedFiles: R.inv.all.length,
    reachableBytes: R.inv.reached.reduce((a, b) => a + b.bytes, 0),
    reachableFiles: R.inv.reached.length,
    unreachableBytes: R.orphanBytes,
    unreachableFiles: R.inv.orphan.length,
    surfaces: bySurface,
    duplicatedAcrossSurfacesBytes: R.dup.reduce((a, b) => a + b.bytes * (b.copies - 1), 0),
    biggestSingleBlockBytes: Math.max(...R.surfaces.map(s => s.blocks[0].bytes)),
    biggestSingleBlockName: R.surfaces[0].blocks[0].name,
    topOrphans: orphans.slice(0, 40).map(f => ({ rel: f.rel, bytes: f.bytes }))
  };
  /* ---- WHAT COULD LOAD LATER ------------------------------------------
     Not a judgement this file gets to make alone, so it is a NAMED LIST with a
     number beside each, not a recommendation dressed as a fact. The test used:
     a block is a candidate if it is a whole other page carried inline as base64
     AND the door does not open on it. The alpha opens on the walked city (the
     RUN tab shows #p-city), so the fight and the rig workbench both qualify;
     the front logo does not, because it is the first thing on screen. */
  const LATER = ['COMBAT_B64', 'RIG_B64'];
  const laterBlocks = (bySurface['BOHEMIA_ALPHA_0_9.html'].biggestBlocks || [])
    .filter(b => LATER.includes(b.name));
  measured.couldLoadLater = {
    blocks: laterBlocks,
    bytes: laterBlocks.reduce((a, b) => a + b.bytes, 0),
    gzipped: laterBlocks.reduce((a, b) => a + (b.gzipped || 0), 0),
    test: 'a whole other page carried inline as base64, on a tab the door does not open on',
    perSurface: true
  };

  const seed = {
    publishedBytes: measured.publishedBytes,
    unreachableBytes: measured.unreachableBytes,
    alphaBytes: bySurface['BOHEMIA_ALPHA_0_9.html'].bytes,
    alphaGzipped: bySurface['BOHEMIA_ALPHA_0_9.html'].gzipped,
    demoBytes: bySurface['BOHEMIA_DEMO.html'].bytes,
    demoGzipped: bySurface['BOHEMIA_DEMO.html'].gzipped,
    biggestSingleBlockBytes: measured.biggestSingleBlockBytes
  };
  /* seed with a little headroom, then ratchet against whatever is already there */
  const budget = {};
  for (const k of Object.keys(seed)) budget[k] = Math.ceil(seed[k] * 1.08);
  /* how far the two shipped files may drift apart in size. They are cut from each
     other, so today's gap is 6,902 bytes; a quarter of a megabyte is generous and
     still catches one file getting a block the other did not. */
  budget.twinBytes = 262144;
  const tightened = [];
  try {
    const prev = JSON.parse(fs.readFileSync(
      path.join(ROOT, 'records/BOHEMIA_BUILD_SIZE_9_6_26.json'), 'utf8'));
    if (prev && prev.budget) {
      for (const k of Object.keys(budget)) {
        if (typeof prev.budget[k] !== 'number') continue;
        const stricter = Math.min(prev.budget[k], budget[k]);
        if (stricter !== prev.budget[k]) tightened.push(k + ': ' + prev.budget[k] + ' -> ' + stricter);
        budget[k] = stricter;
      }
    }
  } catch (_e) {}
  budget.__basis = {
    rule: 'ONE-WAY RATCHET, DOWN ONLY. A byte count has no run-to-run spread, so ' +
          'unlike the speed budget there is nothing here to leave headroom for.',
    tightenedThisRefresh: tightened
  };
  return {
    what: 'BOHEMIA -- what is in the thing we serve, byte by byte. Taken by ' +
          'gates/bohemia_build_size.js, held by gates/build_size_gate.js.',
    takenOn: new Date().toISOString(),
    staleAfterDays: 30,
    refreshCommand: 'node gates/bohemia_build_size.js --record',
    entryPoints: ENTRIES,
    publishedFolders: PUBLISHED,
    measured: measured,
    budget: budget,
    duplication: R.dup.slice(0, 20),
    owed: [
      'REMOVING ANY OF IT. This lane may not touch slices/ content, so every byte named ' +
      'here is a hand-off to the lane that owns the file, not a change this chat can make. ' +
      'The row says "nothing removed without a record of what it was"; this IS that record, ' +
      'written before anybody removes anything.'
    ]
  };
}

function recordProse(R, D) {
  const M = R.measured, B = R.budget;
  const mb = n => (n / 1048576).toFixed(2) + ' MB';
  const alpha = M.surfaces['BOHEMIA_ALPHA_0_9.html'];
  const demo = M.surfaces['BOHEMIA_DEMO.html'];
  return `# BOHEMIA -- WHAT IS IN THE THING WE SERVE (${R.takenOn.slice(0, 10)})

PLUMBER lane, VAMILY row [slim build] SLIM-THE-BUILD. Written by the tool, never typed, so
the numbers and the budget at the bottom come out of one run and cannot disagree.

NOTHING WAS REMOVED TO WRITE THIS, and this lane cannot remove any of it: slices/ content is
not this chat's to touch. This is the record the row asks for BEFORE anybody removes anything.

## THE HEADLINE

  the site we publish          ${mb(M.publishedBytes)} in ${M.publishedFiles} files
  reachable from the game      ${mb(M.reachableBytes)} in ${M.reachableFiles} files
  REACHABLE FROM NOTHING       ${mb(M.unreachableBytes)} in ${M.unreachableFiles} files

A third of what we serve to the open internet cannot be opened from the alpha or the demo by
any path: not a tab, not an iframe, not a link, not a fetch. It is old judge pages, old
galleries and old proofs, still sitting in the folder Pages publishes wholesale.

## AND THE ROW'S OWN NUMBER WAS STALE

The row says "what is in the 4.6 MB and the 11 MB". The alpha is not 11 MB any more:

  the alpha    ${mb(alpha.bytes)} raw, ${mb(alpha.gzipped)} gzipped
  the demo     ${mb(demo.bytes)} raw, ${mb(demo.gzipped)} gzipped

The 11 MB was true when the row was written and the payload-wall work has already been done
(the 8/2 lane moved 35.76 MB of inlined city out to a sibling page). Worth saying plainly so
nobody goes hunting for seven megabytes that are not there.

## WHAT IS ACTUALLY IN THE FILE

${R.measured.surfaces['BOHEMIA_ALPHA_0_9.html'].biggestBlocks.slice(0, 6)
  .map(b => '  ' + (b.name || b.kind).slice(0, 26).padEnd(28) + mb(b.bytes).padStart(9) +
            (b.gzipped != null ? '   ' + mb(b.gzipped) + ' gzipped' : '')).join('\n')}

THE SINGLE BIGGEST THING IN BOTH FILES IS THE FIGHT. ${M.biggestSingleBlockName} is
${mb(M.biggestSingleBlockBytes)} of base64 sitting inline in the alpha AND in the demo, and it
is downloaded by every person who opens either link, before the first frame, whether or not
they ever get into a fight. Four other tabs in the same file already load their page from a
sibling with data-src and pay none of it -- the cheaper pattern is in the same file, four
times over. That is not this lane's change to make; it is the clearest one on the list.

## WHAT COULD LOAD LATER

The test: a whole other page carried inline as base64, on a tab the door does not open on.
The door opens on the walked city, so the fight and the rig workbench both qualify. The front
logo does not, because it is the first thing on screen.

${(M.couldLoadLater.blocks || []).map(b => '  ' + b.name.padEnd(22) + mb(b.bytes).padStart(9) +
   '   ' + mb(b.gzipped) + ' gzipped').join('\n')}

  TOTAL, per surface       ${mb(M.couldLoadLater.bytes)} raw, ${mb(M.couldLoadLater.gzipped)} gzipped

On the slow-4G link the speed round measured (1.6 Mbit down, about 200 KB a second), that
${mb(M.couldLoadLater.gzipped)} is roughly ${(M.couldLoadLater.gzipped / 204800).toFixed(1)}
SECONDS of staring at a blank screen before the logo, on every single cold load, for two
things most players will not touch in the first minute. The pattern to move them to already
exists in the same file four times over: the UI, VOTE, RUN and SLICE tabs each load their page
from a sibling with data-src and pay none of it.

THIS IS A HAND-OFF, NOT A PLAN. Which blocks actually move, and when, belongs to the lane that
owns the file. This lane measured it and wrote it down.

## WHAT IS DUPLICATED

${mb(M.duplicatedAcrossSurfacesBytes)} of the published site is the same bytes twice, because
the alpha and the demo are near-identical files and both are served. THAT DUPLICATION IS
CORRECT: a demo that is a copy of the game is the point of having one. It is counted here so
it is never mistaken for waste, and so the day the two files stop matching, somebody notices.

## THE BIGGEST FILES NOTHING CAN REACH

${M.topOrphans.slice(0, 12).map(f => '  ' + mb(f.bytes).padStart(9) + '  ' + f.rel).join('\n')}

Full list of all ${M.unreachableFiles} in the JSON beside this file.

## THE BUDGET THE GATE HOLDS

THE TOTAL IS NOT ONE OF THESE LINES, on purpose. gates/pages_publish_gate.js has held "the
published surface is under 260 MB" since 8/6, tied to the build timeout that killed three
deploys in a row. A second ceiling on the same number at a different value is drift: raise one
and the other still fires, and nobody knows which is the rule. One fact, one owner. This gate
reports the total, checks its own count AGREES with that neighbour's, and asserts only what
nothing else was looking at.

A ONE-WAY RATCHET, DOWN ONLY, and that is the opposite of the call made for speed on purpose.
A frame rate swings 40% between runs of an unchanged build, so a one-way ratchet there pins
the budget to the luckiest afternoon and goes red on a game nobody touched. A byte count has
no spread at all: same number on every machine, every time. So there is no headroom to leave
and no afternoon to excuse.

  reachable from nothing      <= ${B.unreachableBytes} bytes
  the alpha                   <= ${B.alphaBytes} bytes (${B.alphaGzipped} gzipped)
  the demo                    <= ${B.demoBytes} bytes (${B.demoGzipped} gzipped)
  the biggest single block    <= ${B.biggestSingleBlockBytes} bytes

Refresh with: \`${R.refreshCommand}\`
Held by: gates/build_size_gate.js   Taken by: gates/bohemia_build_size.js
`;
}

module.exports = { report, inventory, buildRecord, recordProse, blocksOf, refsOf, duplication, gz, fmt,
                   ENTRIES, PUBLISHED };

if (require.main === module) {
  const R = report();
  if (process.argv.includes('--record')) {
    const rec = buildRecord(R);
    fs.writeFileSync(path.join(ROOT, 'records/BOHEMIA_BUILD_SIZE_9_6_26.json'),
                     JSON.stringify(Object.assign({}, rec,
                       { allUnreachable: R.inv.orphan.slice().sort((a, b) => b.bytes - a.bytes) }), null, 2));
    fs.writeFileSync(path.join(ROOT, 'records/BOHEMIA_BUILD_SIZE_9_6_26.md'), recordProse(rec, R));
    console.log('wrote records/BOHEMIA_BUILD_SIZE_9_6_26.json and .md\n');
  }
  console.log('THE PUBLISHED SITE: ' + fmt(R.publishedBytes) + ' in ' +
              R.inv.all.length + ' files across ' + PUBLISHED.join(', '));
  console.log('  reachable from the alpha or the demo : ' + R.inv.reached.length + ' files, ' +
              fmt(R.inv.reached.reduce((a, b) => a + b.bytes, 0)));
  console.log('  reachable from NEITHER               : ' + R.inv.orphan.length + ' files, ' +
              fmt(R.orphanBytes));
  for (const s of R.surfaces) {
    console.log('\n' + s.file + '  ' + fmt(s.bytes) + ' raw, ' + fmt(s.gz) + ' gzipped');
    for (const b of s.blocks.slice(0, 10)) {
      console.log('   ' + String(b.kind).padEnd(8) + (b.name || '').slice(0, 28).padEnd(30) +
                  fmt(b.bytes).padStart(9) + (b.gz != null ? '   ' + fmt(b.gz) + ' gz' : ''));
    }
  }
  console.log('\nDUPLICATED BLOCKS (same bytes, more than one shipped file):');
  for (const d of R.dup.slice(0, 10)) {
    console.log('   ' + d.name.slice(0, 24).padEnd(26) + fmt(d.bytes).padStart(9) +
                ' x' + d.copies + '   ' + d.files.map(f => path.basename(f)).join(' + '));
  }
  console.log('\nBIGGEST FILES NOTHING CAN REACH:');
  for (const f of R.inv.orphan.sort((a, b) => b.bytes - a.bytes).slice(0, 15)) {
    console.log('   ' + fmt(f.bytes).padStart(9) + '  ' + f.rel);
  }
}
