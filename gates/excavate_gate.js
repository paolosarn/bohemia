/* ============================================================================
   EXCAVATE GATE (PLUMBER 9/28/26, row [excavate], rule 33h, THE EXCAVATION RULE in
   records/BOHEMIA_THE_REVAMP_LIST_9_24_26.md: "nothing in slices/ or engine/ loads
   from archive/ (PLUMBER gates it)").

   A CUT system goes to archive/ the round it is cut, and the revamp is cutting a lot
   of them at once (the walked city, the cold open, the asks as text, the old pages).
   Each cut has two ways to go wrong, and neither shows up as an error on the desk:
     - the move took something the game still asks for: the page 404s on his phone,
       and on disk it looks fine because nothing on disk is broken;
     - the move left a live page pointing into archive/: the site does not publish
       archive/, so that load 404s in production too.
   And one slow way: the site keeps filling with weight nothing loads. The deploy
   copies slices/, engine/ and records/target/ whole, so every picture parked there
   rides to every phone's cache and every deploy, loaded or not.

   WHAT IT CHECKS (no browser, about two seconds, so it can run before every push):
     S1-S4  SELF-TEST FIRST, on a planted tree: the sweep follows a page to a script to
            a runtime-built chunk name, calls an orphan dead, and catches a live page
            naming an archived file; the same tree without that line comes back clean.
            A checker that has not caught a planted fault has not earned a verdict.
     L1     the three entries (the alpha, the demo, the service worker) are reached,
            and so is the VOTE registry, which is how the VOTE tab loads its pictures.
     L2     NOTHING LIVE LOADS FROM archive/: no file the game can reach names a file
            that now lives only in archive/.
     L3     every file under archive/ has a line in gates/bohemia_superseded.txt (the
            GRAVEYARD registry says what replaced it), by name, or by a folder line.
     L4     every CUT line in that registry (rule 33h) is really cut: each path it names
            is gone from where it lived and is in archive/.
     L5     THE WEIGHT, REPORTED BY NAME, NOT FAILED: every published file the game cannot
            reach that is not on gates/excavate_baseline.txt (frozen at the first
            measurement) is printed with where it belongs. It was a hard fail for one hour
            and it was WRONG: within that hour four files landed from three lanes, and three
            were normal work (an engine module with its own gate, not wired yet; a data file
            a cook tool writes; a vote page that went dead because PAOLO VOTED ON IT, since a
            vote consumes the item). A check that goes red when he votes is broken. The site's
            size already has a hard cap (PAGES PUBLISH, 260 MB); this leg names the files.

   HOW IT DECIDES WHAT THE GAME REACHES: tools/bohemia_what_loads.js, generous on
   purpose (names in page source AND data files, and a stem rule for names built at run
   time), because calling a live file dead is the expensive mistake. It was checked
   against a real phone-shaped boot of both pages through the one driver (alpha 18
   files fetched, demo 16, all to the map and back in): zero of the files the browser
   fetched were on the unreached list.

   Mutation hook for the record: BOHEMIA_EXCAVATE_SELFTEST_ONLY=1 runs S1-S4 alone.
   ========================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const { sweep, ENTRIES } = require(path.join(ROOT, 'tools/bohemia_what_loads.js'));

let pass = 0, fail = 0;
const ok = (n, c, why) => {
  if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); }
};
const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
console.log('='.repeat(74));
console.log('EXCAVATE GATE: nothing live loads from archive/, and the dead weight only falls');
console.log('='.repeat(74));

/* ---- S. THE SELF-TEST, on a planted tree ---------------------------------- */
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'excavate-'));
  const put = (f, body) => { fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true });
                             fs.writeFileSync(path.join(tmp, f), body); };
  put('slices/BOHEMIA_ALPHA_0_9.html', '<script src="boot.js"></script>');
  put('slices/BOHEMIA_DEMO.html', '<p>demo</p>');
  put('slices/sw.js', '/* worker */');
  const LIVE = "for (let n = 0; n < 2; n++) load('TILES_CHUNK_' + n + '.js');\n";
  put('slices/boot.js', LIVE + "fetch('../archive/old_cut_module.js');\n");
  put('slices/TILES_CHUNK_0.js', '');
  put('slices/TILES_CHUNK_1.js', '');
  put('slices/orphan_page.html', '<p>nobody links me</p>');
  put('archive/old_cut_module.js', '');
  const files = ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html', 'slices/sw.js',
    'slices/boot.js', 'slices/TILES_CHUNK_0.js', 'slices/TILES_CHUNK_1.js', 'slices/orphan_page.html'];
  const watch = new Set(['old_cut_module.js']);
  const a = sweep({ root: tmp, files, watch });
  ok('S1 the sweep follows page -> script -> a chunk name built at run time',
     a.reached.includes('slices/TILES_CHUNK_1.js'), 'reached: ' + a.reached.join(', '));
  ok('S2 a page nothing links is called dead', a.dead.includes('slices/orphan_page.html'),
     'dead: ' + a.dead.join(', '));
  ok('S3 a live script naming an archived file is caught, and says which script',
     (a.named.get('old_cut_module.js') || []).includes('slices/boot.js'),
     'named: ' + JSON.stringify([...a.named]));
  put('slices/boot.js', LIVE);
  const b = sweep({ root: tmp, files, watch });
  ok('S4 the same tree without that line comes back clean', b.named.size === 0,
     'named: ' + JSON.stringify([...b.named]));
  fs.rmSync(tmp, { recursive: true, force: true });
}
if (process.env.BOHEMIA_EXCAVATE_SELFTEST_ONLY) {
  console.log('\n=== EXCAVATE GATE (self-test only): ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
}

/* ---- the real tree -------------------------------------------------------- */
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 })
  .split('\n').filter(Boolean);
const archived = git(['ls-files', '--', 'archive']).filter(f => fs.existsSync(path.join(ROOT, f)));
const archBase = new Set(archived.map(f => path.basename(f)));
const t0 = Date.now();
const r = sweep({ watch: archBase });
console.log('  (sweep: ' + r.published.length + ' published, ' + r.reached.length + ' reached, '
  + r.dead.length + ' unreached = ' + mb(r.deadBytes) + ' of ' + mb(r.publishedBytes)
  + ', ' + (Date.now() - t0) + ' ms)');

/* ---- L1 ------------------------------------------------------------------- */
const REGISTRY_JSON = 'records/target/BOHEMIA_VOTE_REGISTRY.json';
const missingEntries = ENTRIES.filter(e => !r.reached.includes(e));
ok('L1 the alpha, the demo, the service worker and the VOTE registry are all reached',
   !missingEntries.length && r.reached.includes(REGISTRY_JSON),
   'not reached: ' + missingEntries.concat(r.reached.includes(REGISTRY_JSON) ? [] : [REGISTRY_JSON]).join(', ')
   + ' -- if an entry moved, the sweep is measuring nothing and every file below would read as dead');

/* ---- L2 ------------------------------------------------------------------- */
const live = [...r.named].map(([b, fs_]) => b + ' (named by ' + fs_.slice(0, 3).join(', ') + ')');
ok('L2 nothing the game can reach names a file that lives only in archive/ (' + archived.length
   + ' archived files watched)', !live.length,
   live.slice(0, 6).join('\n         ') + '\n         The site does not publish archive/, so each of '
   + 'these is a 404 on his phone. Put the file back where the live page reads it, or take the '
   + 'name out of the live page.');

/* ---- L3 ------------------------------------------------------------------- */
const regText = fs.readFileSync(path.join(ROOT, 'gates/bohemia_superseded.txt'), 'utf8');
const regLines = regText.split('\n').filter(l => l.trim() && !l.trim().startsWith('#') && l.includes('|'));
const regBody = regLines.join('\n');
const folderLines = regLines.map(l => l.split('|')[0].trim()).filter(c => /^archive\/\S*\/$/.test(c));
const unlisted = archived.filter(f => !regBody.includes(path.basename(f))
  && !folderLines.some(d => f.startsWith(d)));
ok('L3 every file under archive/ has a line in the GRAVEYARD registry (' + archived.length + ' files)',
   !unlisted.length, unlisted.slice(0, 6).join(', ') + ' -- add a line to gates/bohemia_superseded.txt '
   + 'saying what it is and what replaced it (a folder line "archive/<folder>/ | why" covers a folder)');

/* ---- L4 ------------------------------------------------------------------- */
const cutLines = regLines.filter(l => /\bCUT\b/.test(l) && /\b33h\b/.test(l));
const cutBad = [];
let cutPaths = 0;
for (const l of cutLines) {
  for (const p of l.split('|')[0].split('+').map(s => s.trim()).filter(Boolean)) {
    cutPaths++;
    if (fs.existsSync(path.join(ROOT, p))) cutBad.push(p + ' is still where it lived');
    if (!archBase.has(path.basename(p))) cutBad.push(p + ' is not in archive/');
  }
}
ok('L4 every rule-33h CUT in the registry is really cut (' + cutLines.length + ' lines, '
   + cutPaths + ' files: gone from where they lived, present in archive/)', !cutBad.length,
   cutBad.slice(0, 6).join('\n         '));

/* ---- L5 ------------------------------------------------------------------- */
const BASE = 'gates/excavate_baseline.txt';
const baseline = new Set(fs.readFileSync(path.join(ROOT, BASE), 'utf8').split('\n')
  .map(s => s.trim()).filter(s => s && !s.startsWith('#')));
const fresh = r.dead.filter(f => !baseline.has(f));
const deadSet = new Set(r.dead);
const shrunk = [...baseline].filter(f => !deadSet.has(f));
if (fresh.length) {
  console.log('  NOTE L5: ' + fresh.length + ' published file(s) the game cannot reach and not on the 9/28 baseline '
    + '(reported, not failed; the size cap is PAGES PUBLISH):');
  fresh.slice(0, 12).forEach(f => console.log('           ' + f + ' (' + mb(r.size.get(f)) + ')'));
  if (fresh.length > 12) console.log('           and ' + (fresh.length - 12) + ' more');
  console.log('         If the game should load it, link it from the alpha, the demo or the VOTE registry. A picture '
    + 'for a record belongs under records/ (not records/target/), which is never published.');
} else {
  console.log('  NOTE L5: no published file the game cannot reach is new since the 9/28 baseline ('
    + r.dead.length + ' unreached, ' + mb(r.deadBytes) + ')');
}
if (shrunk.length) {
  console.log('  NOTE: ' + shrunk.length + ' baseline line(s) no longer unreached (moved off the site, '
    + 'or the game loads them now). Take them off ' + BASE + ' to lock the win in: '
    + shrunk.slice(0, 4).join(', ') + (shrunk.length > 4 ? ' ...' : ''));
}

console.log('\n=== EXCAVATE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
