/* WHAT THE GAME CAN ACTUALLY REACH (PLUMBER, row [excavate], rule 33h)
   ================================================================================
   The deploy publishes three folders -- slices/, engine/, records/target/ -- and
   copies them wholesale. This walks what a player's browser can reach from the two
   pages he opens (the alpha and the demo) plus the service worker, and reports
   everything published that nothing reachable points at.

   IT IS GENEROUS ON PURPOSE, because the two mistakes are not equal. Calling a live
   file dead gets it moved off the site and breaks the game. Calling a dead file live
   just leaves some weight behind. So a file counts as REACHED if a reachable file:
     - names it by path or bare filename, in page source OR IN A DATA FILE. The VOTE
       tab loads its pictures through its registry JSON, not through page source, so
       a scan of pages alone would call Paolo's vote pictures dead. Data files are
       followed like pages.
     - or names its STEM with the trailing number cut off. Slices build names like
       'BOHEMIA_CITY_TILES_0' + n + '.js' at run time; a literal-name scan misses all
       of them, and the stem rule keeps every one.
   What it cannot see: a name assembled from pieces that never appear together. So
   nothing it calls dead is moved on its word alone; the move is checked against a
   real boot's network log first (see the [excavate] record).

   node tools/bohemia_what_loads.js           summary
   node tools/bohemia_what_loads.js --list    every unreached file, biggest first
   require('./tools/bohemia_what_loads.js').sweep()  -> { published, reached, dead }
   sweep({ root, files, watch })   root: another tree (the gate's planted fixture);
     files: the published list instead of asking git; watch: a Set of bare filenames,
     and every REACHED file that names one is returned in .named (the excavation gate
     watches archive/'s names, so a live page asking for a cut file is caught even
     though the file is no longer anywhere the sweep can resolve it).
   ================================================================================ */
'use strict';
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const HOME = path.dirname(__dirname);

const PUBLISHED = ['slices/', 'engine/', 'records/target/'];
const ENTRIES = ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html', 'slices/sw.js'];
const TEXT = /\.(html?|js|mjs|json|css|txt|md|svg|webmanifest)$/i;
const REF = /[A-Za-z0-9_\-./%]{1,200}?\.(?:html?|js|mjs|json|css|png|jpe?g|gif|webp|svg|avif|mp3|ogg|wav|m4a|woff2?|ttf|glb|bin|txt|md|webmanifest)\b/gi;

function sweep(opts) {
  opts = opts || {};
  const ROOT = opts.root || HOME;
  const watch = opts.watch || new Set();
  const named = new Map();
  const all = (opts.files || execFileSync('git', ['ls-files', '--'].concat(PUBLISHED),
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 }).split('\n').filter(Boolean))
    .filter(f => fs.existsSync(path.join(ROOT, f)));
  const size = new Map(all.map(f => [f, fs.statSync(path.join(ROOT, f)).size]));
  const byBase = new Map();
  for (const f of all) { const b = path.basename(f); (byBase.get(b) || byBase.set(b, []).get(b)).push(f); }
  /* stems: name minus extension minus a trailing run of digits/underscores. Only stems
     long enough to mean something, so 'a1.png' cannot mark half the tree reached. */
  const stemOf = (b) => b.replace(/\.[^.]+$/, '').replace(/[_\-]?\d+$/, '');
  const byStem = new Map();
  for (const f of all) { const s = stemOf(path.basename(f));
    if (s.length >= 8 && s !== path.basename(f).replace(/\.[^.]+$/, ''))
      (byStem.get(s) || byStem.set(s, []).get(s)).push(f); }

  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  /* longest first, so a stem that is a prefix of another does not steal its match */
  const STEMS = byStem.size ? new RegExp([...byStem.keys()].sort((a, b) => b.length - a.length)
    .map(esc).join('|'), 'g') : null;
  const reached = new Set(), queue = [];
  const reach = (f) => { if (size.has(f) && !reached.has(f)) { reached.add(f); queue.push(f); } };
  ENTRIES.forEach(reach);
  while (queue.length) {
    const f = queue.shift();
    if (!TEXT.test(f)) continue;                            /* pictures and sounds are leaves */
    let body; try { body = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { continue; }
    /* STRIP INLINE IMAGE BLOBS FIRST. Measured: the demo carries 29 base64 runs, the
       longest 2,178,392 characters, and an unbounded filename pattern re-scans a run
       from every starting point -- quadratic, and the first two cuts of this tool
       never finished. A blob holds no filename (base64 has no dot), so removing it
       loses nothing. The pattern is also bounded to 200 characters for the same reason. */
    body = body.replace(/data:[a-z0-9.+\/-]+;base64,[A-Za-z0-9+\/=]+/gi, '')
               .replace(/[A-Za-z0-9+\/=]{400,}/g, '');
    let m; REF.lastIndex = 0;
    while ((m = REF.exec(body))) {
      let tok = m[0]; try { tok = decodeURIComponent(tok); } catch (e) { /* keep raw */ }
      const b = path.basename(tok);
      for (const g of (byBase.get(b) || [])) reach(g);
      if (watch.has(b) && !byBase.has(b)) (named.get(b) || named.set(b, []).get(b)).push(f);
    }
    /* ONE PASS PER FILE. The first cut asked body.includes(stem) for every stem
       against every page: 304 stems x 124.7 MB of published text is ~38 GB of
       scanning, and it never finished. One alternation of every stem, run once. */
    if (STEMS) { STEMS.lastIndex = 0; let s;
      while ((s = STEMS.exec(body))) (byStem.get(s[0]) || []).forEach(reach); }
  }
  const dead = all.filter(f => !reached.has(f)).sort((a, b) => size.get(b) - size.get(a));
  const bytes = (list) => list.reduce((s, f) => s + size.get(f), 0);
  for (const [b, fs_] of named) named.set(b, [...new Set(fs_)]);
  return { published: all, reached: [...reached], dead, size, bytes, named,
           publishedBytes: bytes(all), deadBytes: bytes(dead) };
}

module.exports = { sweep, PUBLISHED, ENTRIES };

if (require.main === module) {
  const r = sweep();
  const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
  console.log('\nWHAT THE GAME CAN REACH, from ' + ENTRIES.join(', '));
  console.log('  published   ' + String(r.published.length).padStart(5) + ' files   ' + mb(r.publishedBytes));
  console.log('  reached     ' + String(r.reached.length).padStart(5) + ' files   ' + mb(r.publishedBytes - r.deadBytes));
  console.log('  UNREACHED   ' + String(r.dead.length).padStart(5) + ' files   ' + mb(r.deadBytes));
  for (const dir of PUBLISHED) {
    const d = r.dead.filter(f => f.startsWith(dir));
    console.log('    in ' + dir.padEnd(16) + String(d.length).padStart(5) + ' files   ' + mb(r.bytes(d)));
  }
  if (process.argv.includes('--list'))
    for (const f of r.dead) console.log('    ' + (r.size.get(f) / 1048576).toFixed(2).padStart(7) + ' MB  ' + f);
}
