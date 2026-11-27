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
/* rule 5 (PLUMBER 8, 11/11/26, ask row 563: PAGES PUBLISH red on main, the list at 912.7 MB over its 900 cap):
   A FILE A PAGE NAMES BUT NEVER LOADS IS NOT PUBLISHED, and only by name here, each with the code that proves it.
   slices/BOHEMIA_RUN_CURRENT.html (21.5 MB): the alpha names it as runFrame's data-src, and nothing ever promotes it:
   the RUN tab routes to the city panel (the shell's '(t.dataset.p==='run') ? 'city'') and the tab loader reads the
   panel it SHOWS (__THE_RUN_SLICE_IS_NOT_DOWNLOADED__), and no line sets runFrame.src. Measured on the demo, after
   the door and after the RUN tab: runFrame src null, 0 loads. The serve-only gate (the_site_serves_what_the_game_
   loads_gate.js L2) presses every tab on a server that answers only this list, so the day a tab loads it, that is red. */
/* (PLUMBER 8, 11/22/26, PAGES PUBLISH red again: 913 MB of its 900 MB cap, COOK FIVE and BESTIARY with art waiting for room)
   slices/BOHEMIA_VOTE_CURRENT.html (6.5 MB): named only in a comment, the alpha's (and so the demo's) note that the VOTE tab no longer
   points at it (__THE_ONE_VOTE_TAB__, 9/14: 'untouched on disk and stays as an archive'); the tab loads BOHEMIA_VOTE_TAB.html.
   records/target/BOHEMIA_STYLE_GUIDE.json (and so the 14 MB of reference pictures only it names: COOK2_ONE_REAL_STREET.webp, the
   direction_style_guide boards, the master rig's two DIRECTION sheets): DIRECTION's bible, a data file no published page or script
   reads (no published code names STYLE_GUIDE or style_guide, measured on the list); it is published only because the crew's rig and
   portrait notes name it as where their numbers came from. The serve-only gate's L2 presses every tab on a server that answers only
   this list, so the day a page loads one of them, that is red. */
const NOT_LOADED = new Set(['slices/BOHEMIA_RUN_CURRENT.html', 'slices/BOHEMIA_VOTE_CURRENT.html', 'records/target/BOHEMIA_STYLE_GUIDE.json']);
/* rule 6 (PLUMBER 8, 11/14/26, the coordinator's rule 447 round: 'get the published set well under the cap, aim under 800'):
   INSIDE A FOLDER TAKEN WHOLE (rule 3), A KIND OF FILE NO CODE BUILDS A NAME FOR IS NOT PUBLISHED. Each kind is listed here with
   every loader that builds names in its folder, and a TELL: the text that would appear in a published code file the day one starts
   building that kind. gates/pages_publish_gate.js reads every published code file for each tell, and a hit is red (so a loader
   that starts asking for one of these files cannot ship a 404). A file a published text names EXACTLY is still published (rule 2). */
const DEAD_KINDS = [
  { dir: 'records/target/character/barber', kind: /\/(rig|portrait)\.json$/, tell: /(^|[^\w.])(rig|portrait)\.json/,
    why: "the build's sidecars: its four loaders build only <look>/face/<key>_<64|128>.png (engine/bohemia_crew_faces.js), <look>/rig_<turn>.png (engine/bohemia_rig_bodies.js) and <look>/rig_portrait_S.png (engine/bohemia_main_man.js); engine/bohemia_people_mix.js names the folder in a src note" },
  { dir: 'records/target/character/barber', kind: /\/rig_portrait_S[EW]\.png$/, tell: /rig_portrait_(S[EW]|['"`]\s*\+|\$\{)/,
    why: "the side portraits: the one loader of a barber portrait (engine/bohemia_main_man.js) asks for rig_portrait_S.png by its whole name" },
  { dir: 'records/target/portrait/rig/crew', kind: /\/(rig|portrait)\.json$/, tell: /(^|[^\w.])(rig|portrait)\.json/,
    why: "PORTRAIT's sidecars for the crew's renders: the folder's one loader (engine/bohemia_rig_bodies.js) builds <look>/rig_<turn>.png and reads no sidecar" },
  { dir: 'records/target/portrait/rig/crew', kind: /\/((raw|obj|id|rigobj|rigid|shadow)_(S|SE|E|NE|N|NW|W|SW)|calibration_(cube|sphere))\.png$/,
    tell: /(['"`\/])(raw|obj|id|rigobj|rigid|shadow)_(S|SE|E|NE|N|NW|W|SW)\b|calibration_(cube|sphere)|(raw|obj|rigobj|rigid|shadow)_['"`]\s*\+/,
    why: "PORTRAIT's render passes for each crew look (the raw, object, id, rig-object, rig-id and shadow passes a turn, the calibration cube and sphere; 4.1 MB, PLUMBER 8 11/18): the folder's one loader (engine/bohemia_rig_bodies.js) builds <look>/rig_<turn>.png only" },
  { dir: 'records/target/portrait/rig/crew', kind: /\/(raw|rig)_portrait_[^/]*\.png$/, tell: /raw_portrait|portrait\/rig\/crew[^\n]*rig_portrait/,
    why: "PORTRAIT's renders of the crew's faces: the folder's one loader (engine/bohemia_rig_bodies.js) builds <look>/rig_<turn>.png, the turns S SE E NE N NW W SW" },
  { dir: 'records/target/master_rig', kind: /\/(cook_trailer|cook_camp_trailer|cook_cart|truck)\/((raw|id|rigid|rigobj|shadow)_(S|SE|E|NE|N|NW|W|SW)\.png|calibration_(cube|sphere)\.png|calibration\.json|rig\.json|camp_trailer\.glb|rig_S\.look\.png|rig_S\.loop\.jsonl)$/,
    tell: /(['"`\/])(raw|id|rigid|rigobj|shadow)_(S|SE|E|NE|N|NW|W|SW)\b|calibration_(cube|sphere)|(raw|id|rigid|rigobj|shadow)_['"`]\s*\+|(^|[^\w.])rig\.json|camp_trailer\.glb|rig_S\.look|loop\.jsonl/,
    why: "COOK's camp renders' passes (COOK SEVEN 11/27, rule 482(c), measured: 112 files, 6.18 MB): the camp's loaders (slices/bohemia_camp_look.js, slices/bohemia_camp_map.js, the fight's CAMP_RIG) build only cook_cart/ and truck/ rig_<turn>.png; the trailers are not drawn (camp_look: 'drawn when COOK cuts a camp trailer'), and the raw, id, rig-id, rig-object and shadow passes, the calibration cube and sphere, rig.json, the .glb and the loop's look are the rig's working files" },
  /* COOK SEVEN, 11/27/26 (rule 482(c), PAGES PUBLISH at 898 MB of 900 after BUILD 11/27zz THE FIRE STATION, twenty-one insides still to
     draw): COOK's building renders (records/target/master_rig/cook_bld_<house>/rig_S.png, 22 files, 29.55 MB) shipped only because the
     street board's data (slices/fight_ground/street_board/street_board.json and storeys.json) names each in a house's 'rig' key, saying
     where its picture was cut from. No published code reads that key or names a cook_bld_ folder (measured: the houses' readers,
     slices/bohemia_street_board.js, bohemia_map_houses.js, bohemia_freeway_boards.js, engine/bohemia_fight_kinds.js and the city and fight
     pages, draw each house from its 'src' under slices/fight_ground/); the only master_rig folders code loads are cook_cart/ and truck/ */
  { dir: 'records/target/master_rig', kind: /\/cook_bld_[^/]*\/rig_S\.png$/, tell: /cook_bld_/,
    why: "COOK's building renders, named only by the street board's data as where each house was cut from ('rig'); every house is drawn from its 'src' under slices/fight_ground/, and no code names a cook_bld_ folder" },
  /* CHARACTER 3, 11/27/26 (ask row 769, PAGES PUBLISH at 910 MB of 900 after BUILD 11/27u THE MAP'S PEOPLE ARE PACKED): the walk renders
     a look is baked from (rig_Anim_<take>_<turn>_k<key>.png, 5.5 MB in the gangs' and the barber's folders): the map draws its walks from
     slices/rig_mix and BOHEMIA_RIG_CAST, the fight from slices/fight_rig; the one loader of these folders (engine/bohemia_rig_bodies.js)
     builds <look>/rig_<turn>.png, the eight turns; engine/bohemia_people_mix.js names the kind only in its src note */
  { dir: 'records/target/character', kind: /\/rig_Anim_[^/]*\.png$/, tell: /rig_Anim_['"`]|rig_Anim_[^<\s'"`]*['"`]\s*\+|rig_Anim_[^\s'"`]*\$\{|['"`]Anim_['"`]?\s*\+/,
    why: "the walk renders a look is baked from: the map and the fight draw their walks from the baked sheets (slices/rig_mix, BOHEMIA_RIG_CAST, slices/fight_rig); the folder's one loader builds <look>/rig_<turn>.png" },
  /* CHARACTER 3, 11/27/26, the same round: a map people sheet whose atlas is fresh (slices/rig_mix_packed/index.json's bytes equal the
     sheet's) is drawn from the atlas, so the whole sheet does not ship; the map reads a whole sheet the site does not have (its size
     asked, a 404) as 'the atlas is fresh' (__THE_MAPS_PEOPLE_ARE_PACKED__). A sheet re-rendered since its pack is not fresh and ships
     whole, as the map then draws it. A page that names one exactly still publishes it (rule 2). */
  { dir: 'slices/rig_mix', kind: (function () {
      const fresh = new Set();
      try { const ix = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/rig_mix_packed/index.json'), 'utf8')).sheets || {};
        for (const n in ix) { const f = n + '.png'; if (!/^rig_mix\//.test(n)) continue;
          try { if (fs.statSync(path.join(ROOT, 'slices', f)).size === ix[n].bytes && fs.existsSync(path.join(ROOT, 'slices/rig_mix_packed', ix[n].stem + '.png'))) fresh.add('slices/' + f); } catch (e) {} } } catch (e) {}
      return { test: (f) => fresh.has(f), toString: () => 'a sheet with a fresh atlas (' + fresh.size + ')', size: fresh.size };
    })(), tell: /rig_mix\/['"`]\s*\+[^;\n]*['"`]\.png['"`]|rig_mix\/[A-Za-z0-9_]+\.png/,
    why: "the map's people sheets whose atlas is fresh: the map draws them from slices/rig_mix_packed and reads a missing whole sheet as the atlas being fresh" },
];
/* and rule 3 does not take a folder whole that the code names only in prose (a path in a comment broken at the line's end) */
const NOT_WHOLE = new Map([
  ['records/target/animation', "named only in comments that say where a sheet's numbers came from (slices/BOHEMIA_ROSTER_SCREEN.html 'MEASURED FIRST ... records/target/animation/', engine/bohemia_idles.js 'the source records/target/animation/'): ANIMATION's measurement shots and sources"],
  ['slices/settlement_people', "named only in slices/BOHEMIA_SETTLEMENT_SCREEN.html's comment 'ANIMATION's flat sheets (slices/settlement_people) are not drawn here any more'"],
]);
const deadKind = (f) => DEAD_KINDS.some(k => f.startsWith(k.dir + '/') && k.kind.test(f));
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
    if (NOT_LOADED.has(f)) return;
    if (isWeak && deadKind(f)) return;   /* rule 6 */
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
          if (!p.startsWith('..') && DIR.has(p) && !NEVER_WHOLE.has(p) && !NOT_WHOLE.has(p) && !whole.has(p)) whole.set(p, f);
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
        /* rule 7 (PLUMBER 8, 11/22/26, PAGES PUBLISH at 913 MB of 900): A KIND NO CODE READS (rule 6's list, each with its tell, which the
           publish gate reads every published code file for) IS NOT PUBLISHED BY A DATA FILE'S MENTION. Measured: 11.2 MB of the barber's
           rig.json sidecars shipped because each look's wound file names its portrait.json ('portrait': where its numbers came from)
           and that names rig.json ('body_rig'); the wound file's one reader (engine/bohemia_wound_faces.js) reads its rows and its .png,
           never that key. A name in CODE still publishes one (rule 2). */
        if (FILE.has(p) && !CODE.test(f) && deadKind(p)) continue;
        if (FILE.has(p)) add(p, f, isWeak);
        else if (!/\.[A-Za-z0-9]{1,5}$/.test(p)) {
          /* rule 2b: a bare name the code adds its own extension to (rigSheetLoad(RIG_CAST, 'BOHEMIA_RIG_CAST') fetches
             BOHEMIA_RIG_CAST.json and .png; found by the serve-only gate, 11/6) */
          for (const x of EXT) if (FILE.has(p + x)) { if (!CODE.test(f) && deadKind(p + x)) continue;   /* rule 7 for a bare name too (CHARACTER 3, 11/27: rig_mix_packed's table names each sheet bare) */
            add(p + x, f + '  (the bare name ' + bare + ', ' + x + ' added)', isWeak); }
        }
        if (!FILE.has(p) && !isWeak && CODE.test(f) && DIR.has(p) && t.includes('/') && !NEVER_WHOLE.has(p) && !NOT_WHOLE.has(p)) { if (!whole.has(p)) whole.set(p, f); }
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

module.exports = { ROOTS, ENTRIES, REGISTRY, NOT_LOADED, DEAD_KINDS, NOT_WHOLE, compute, shownCards };

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
