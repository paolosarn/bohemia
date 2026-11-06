#!/usr/bin/env node
/* THE PUBLISH LIST (PLUMBER 5, 11/6/26, rule 411's round: the site is too big).
 *
 *   THE SITE PUBLISHES WHAT THE PAGES LOAD, AND NOTHING ELSE.
 *
 * MEASURED 11/6 BEFORE THIS: .github/workflows/pages.yml copied slices/, engine/ and records/target/
 * WHOLE: 1,858 MB in 32,040 files. GitHub Pages documents a 1 GB limit for a published site and a
 * 10-minute deploy timeout, and the pipe was already breaking: 3 of the last 8 `pages` runs failed
 * (4270, 4272, 4274), each one dying at actions/deploy-pages after 12 to 13 minutes, while the good
 * ones took 4 to 5. The biggest folder, slices/vote (342 MB), is the VOTE tab's history: of its 938
 * cards he has judged 763 and the triage hides 142 more, and a judged card is never drawn again
 * (the tab's own line: 'A VOTE CONSUMES. This line is the whole law.'). 36 cards were on his screen.
 *
 * WHAT IS PUBLISHED, AND WHY EACH RULE:
 *   1. THE DOORS (ENTRIES): the alpha (the one link), the demo (its own link), the VOTE tab, and the
 *      service worker the alpha registers. Nothing else is a door: the repo names no other live URL.
 *   2. EVERYTHING A PUBLISHED TEXT FILE NAMES, followed to the end. Every run of path characters in a
 *      published .html/.js/.json/.css/.txt is read as a path from three places (the file's own folder,
 *      slices/ because a script's URLs resolve against its PAGE, and the repo root); a hit on a real
 *      file publishes it, and a text file it publishes is read the same way. Comments are read too, on
 *      purpose: measured, blanking them saves 16 MB of 821 and one wrong guess by a home-made parser
 *      would 404 a real file on his phone.
 *   3. A FOLDER THE CODE BUILDS NAMES IN SHIPS WHOLE. When a published file names a FOLDER
 *      ('fight_rig/' + kind, '../records/target/character/barber/' + look + '/rig_' + turn), no
 *      reader can know the names, so every file under it ships. The three roots themselves (and
 *      records/) are never taken whole by this rule, or rule 3 would undo the list.
 *   4. THE VOTE REGISTRY IS READ THE WAY THE TAB READS IT. The registry is 1.2 MB of history and
 *      names 2,600 paths, most of them in a judged card or a card's notes. The tab draws a card only
 *      when it is NOT judged in the registry and its triage tag is not green or gray, and then loads
 *      exactly show.src and show.first (slices/BOHEMIA_VOTE_TAB.html, build() and draw()). Those, and
 *      what they name, are published; a card a lane registers next round is published by the next
 *      deploy, because this list is computed AT DEPLOY from the committed tree.
 *
 * NOTHING IS DELETED FROM THE REPO. A file this list leaves out is exactly where it was; it is simply
 * not copied into the site. A page that names a file outside the three roots is the publish gate's
 * red (gates/pages_publish_gate.js), as it always was.
 *
 *   node tools/bohemia_publish_list.js              the summary: files, MB, the biggest folders
 *   node tools/bohemia_publish_list.js --list       every published path, one a line
 *   node tools/bohemia_publish_list.js --why <path> the chain of files that publishes it
 *   node tools/bohemia_publish_list.js --copy _site copy the list into a site folder (the deploy)
 *   require('./tools/bohemia_publish_list.js').compute() -> { files, size, why, folders }
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);

/* THE FOLDERS A PAGE MAY LOAD FROM. _config.yml keeps these and excludes everything else at the top,
   and gates/pages_publish_gate.js binds the two. */
const ROOTS = ['slices', 'engine', 'records/target'];
const ENTRIES = ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html', 'slices/BOHEMIA_VOTE_TAB.html', 'slices/sw.js'];
const REGISTRY = 'records/target/BOHEMIA_VOTE_REGISTRY.json';
const TRIAGE = 'records/target/BOHEMIA_VOTE_TRIAGE.json';
const TEXT = /\.(html?|m?js|json|css|txt|svg|webmanifest)$/i;
const NEVER_WHOLE = new Set(['slices', 'engine', 'records', 'records/target']);
const TOKEN = /[A-Za-z0-9_\-.\/%~]{3,}/g;
/* rule 3 reads CODE only: names are built in a page or a script. A data file that names a folder is almost always
   saying where a thing came from ("src": "records/target/master_rig/..."), and measured, one such line in the style
   guide took 115 MB nobody loads; the files a data file names exactly are still published (rule 2). */
const CODE = /\.(html?|m?js)$/i;
const EXT = ['.json', '.png', '.webp', '.js', '.html', '.mp3', '.wav', '.ogg', '.jpg', '.css', '.txt'];

function walk(dir, out) {
  let ents; try { ents = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch (_) { return; }
  for (const e of ents) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = dir + '/' + e.name;
    if (e.isDirectory()) walk(p, out); else if (e.isFile()) out.push(p);
  }
}

/* the cards the VOTE tab can draw: not judged in the registry, triage not green or gray */
function shownCards(txt) {
  let reg, tri = {};
  try { reg = JSON.parse(txt); } catch (_) { return null; }
  try { tri = JSON.parse(fs.readFileSync(path.join(ROOT, TRIAGE), 'utf8')) || {}; } catch (_) {}
  const judged = new Set(((reg && reg.verdicts) || []).map(v => v && v.id));
  const out = [];
  for (const it of (reg && reg.items) || []) {
    if (!it || !it.id || judged.has(it.id)) continue;
    const t = tri.tags && tri.tags[it.id], tag = t && t.tag ? String(t.tag).toLowerCase() : '';
    if (tag === 'green' || tag === 'gray' || tag === 'grey') continue;
    out.push(it);
  }
  return out;
}

function compute() {
  const all = [];
  for (const r of ROOTS) walk(r, all);
  const FILE = new Set(all);
  const DIR = new Set();
  for (const f of all) { let d = path.posix.dirname(f); while (d !== '.' && !DIR.has(d)) { DIR.add(d); d = path.posix.dirname(d); } }
  /* WEAK: a file published only because its folder ships whole (rule 3), or named only by such a file. It is read
     for the files it names (a loader may fetch it and follow it), but a folder it names is NOT taken whole: the chain
     of maybes stops at one step. Measured: without this stop, a sidecar rig.json in the barber's folder names the style
     guide, the style guide names records/target/master_rig/, and 115 MB nobody loads ships with it. A weak file that a
     strong one names later turns strong and is read again. */
  const keep = new Set(), why = new Map(), whole = new Map(), taken = new Set(), weak = new Set(), queue = [];
  const add = (f, from, isWeak) => {
    if (keep.has(f)) { if (!isWeak && weak.has(f)) { weak.delete(f); why.set(f, from); if (TEXT.test(f)) queue.push(f); } return; }
    keep.add(f); why.set(f, from); if (isWeak) weak.add(f); if (TEXT.test(f)) queue.push(f);
  };
  for (const e of ENTRIES) if (FILE.has(e)) add(e, 'a door', false);
  while (queue.length) {
    const f = queue.shift();
    const isWeak = weak.has(f);
    let txt; try { txt = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (_) { continue; }
    if (f === REGISTRY) {
      const cards = shownCards(txt);
      if (cards) txt = cards.map(it => [it.show && it.show.src, it.show && it.show.first].filter(Boolean).join('\n')).join('\n');
    }
    const bases = [path.posix.dirname(f), 'slices', '.'];
    /* rule 3 in a DATA file: a string value that is a folder and nothing else ("trailer_rig": "../records/target/
       master_rig/cook_trailer/", which bohemia_camp_look.js builds names under) is a loader's base, taken whole */
    if (!isWeak && !CODE.test(f) && /\.json$/i.test(f)) {
      const SV = /"((?:[^"\\\n]|\\.){3,300})"/g; let v;
      while ((v = SV.exec(txt))) {
        const val = v[1];
        if (!/^[A-Za-z0-9_\-.\/%~]+$/.test(val) || !val.includes('/')) continue;
        for (const b of bases) {
          const p = path.posix.normalize(path.posix.join(b, val.replace(/^\.\//, '').replace(/\/+$/, '')));
          if (!p.startsWith('..') && DIR.has(p) && !NEVER_WHOLE.has(p) && !whole.has(p)) whole.set(p, f);
        }
      }
    }
    const seen = new Set();
    let m; TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(txt))) {
      const raw = m[0];
      if (seen.has(raw)) continue;
      seen.add(raw);
      let t = raw.replace(/^\.\//, '');
      try { t = decodeURIComponent(t); } catch (_) {}
      const bare = t.replace(/\/+$/, '');
      for (const b of bases) {
        const p = path.posix.normalize(path.posix.join(b, bare));
        if (p.startsWith('..')) continue;
        if (FILE.has(p)) add(p, f, isWeak);
        else if (!/\.[A-Za-z0-9]{1,5}$/.test(p)) {
          /* rule 2b: a bare name the code adds its own extension to (rigSheetLoad(RIG_CAST, 'BOHEMIA_RIG_CAST') fetches
             BOHEMIA_RIG_CAST.json and .png; found by the serve-only gate, 11/6) */
          for (const x of EXT) if (FILE.has(p + x)) add(p + x, f + '  (the bare name ' + bare + ', ' + x + ' added)', isWeak);
        }
        if (!FILE.has(p) && !isWeak && CODE.test(f) && DIR.has(p) && t.includes('/') && !NEVER_WHOLE.has(p)) { if (!whole.has(p)) whole.set(p, f); }
      }
    }
    /* rule 3 runs each time the queue drains; a text file inside a whole folder is then read as WEAK */
    if (!queue.length) {
      for (const [d, from] of [...whole]) {
        if (taken.has(d)) continue;
        taken.add(d);
        for (const g of all) if (g.startsWith(d + '/') && !keep.has(g)) add(g, from + '  (the folder ' + d + '/, whole)', true);
      }
    }
  }
  const files = [...keep].sort();
  let size = 0;
  const folders = {};
  for (const f of files) {
    let s = 0; try { s = fs.statSync(path.join(ROOT, f)).size; } catch (_) {}
    size += s;
    const k = f.split('/').slice(0, f.startsWith('records/') ? 3 : 2).join('/');
    folders[k] = (folders[k] || 0) + s;
  }
  return { files, size, why, whole: [...whole.keys()].sort(), weak, folders, total: all.length };
}

module.exports = { ROOTS, ENTRIES, REGISTRY, compute, shownCards };

if (require.main === module) {
  const a = process.argv.slice(2);
  const r = compute();
  const MB = n => (n / 1048576).toFixed(1);
  /* never process.exit() after a big write: to a pipe the write is async and exit cuts it (measured: 0 of 61 lines) */
  if (a[0] === '--list') { process.stdout.write(r.files.join('\n') + '\n'); return; }
  if (a[0] === '--why') {
    let p = a[1], n = 0;
    if (!r.why.has(p)) { console.log(p + ' is NOT published'); process.exit(1); }
    while (p && n++ < 40) { console.log((n === 1 ? '' : '  <- ') + p); p = r.why.get(p); if (p === 'a door' || !r.why.has(String(p).split('  ')[0])) { if (p) console.log('  <- ' + p); break; } p = String(p).split('  ')[0]; }
    process.exit(0);
  }
  if (a[0] === '--copy') {
    const out = path.resolve(a[1] || '_site');
    let n = 0;
    for (const f of r.files) {
      const to = path.join(out, f);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(path.join(ROOT, f), to);
      n++;
    }
    console.log('THE PUBLISH LIST: copied ' + n + ' files, ' + MB(r.size) + ' MB, of ' + r.total + ' under ' + ROOTS.join(' ') + ' into ' + out);
    process.exit(0);
  }
  console.log('THE PUBLISH LIST: ' + r.files.length + ' files, ' + MB(r.size) + ' MB (of ' + r.total + ' files under ' + ROOTS.join(', ') + '); ' + r.whole.length + ' folders whole because the code builds names in them');
  console.log(Object.entries(r.folders).sort((x, y) => y[1] - x[1]).slice(0, 20).map(([k, v]) => MB(v).padStart(8) + ' MB  ' + k).join('\n'));
}
