#!/usr/bin/env node
/* ============================================================================
   HIS YESES IN THE DEMO (RUN TWO [his yeses in the demo], 10/19/26)

   Paolo 10/18: 'the demo has not been fixed and updated in a long time'. Rule 118: he must see the truth, not the
   coordinator's word. He cannot tell which of his YES votes made it into the thing he plays. So the foot of the VOTE
   tab lists every YES since 10/16, IN THE DEMO with the demo's build stamp, or NOT YET with the chat that has it, and
   NOTHING IN THAT LIST IS TYPED BY HAND. This tool is the machine that decides it, in two steps:

   1. CARRIERS (needs git history): for every card in the registry, the files its commit (the card's sha) changed
      that the game could load: slices/, engine/ and records/target/, never the VOTE machinery (the registry, the
      sort file, slices/vote/, the first pictures, the tab) and never the alpha's dev pages. Written to
      records/target/BOHEMIA_YES_CARRIERS.json, keyed by sha, kept across runs (a commit's files never change).
      A shallow clone (this container's, the deploy's) does not hold the old commits, so a sha it cannot read is
      looked up in a blobless history clone (BOHEMIA_HISTORY=<dir>, or one made in the temp folder, about 11 MB).

   2. STATUS (no git): what the demo REACHES, crawled from the demo's own cut (slices/BOHEMIA_DEMO.html) through
      every file name it says (the map, the settlement, the fight, the run frame, each engine file it inlines, each
      JSON and picture they name, and the folders they build names in), never through the dev frames the cut leaves
      inert (VOTE, LOOK, WORDS, ART, UI, SLICE, LIFE, the old map tab). A YES is IN THE DEMO when a file its commit
      changed is one the demo reaches; else NOT YET, and the chat that has it is the card's lane. Written to
      records/target/BOHEMIA_YES_IN_THE_DEMO.json with the stamp the demo was cut with.

   The deploy (.github/workflows/pages.yml) runs STATUS right after it cuts the demo, so the list on his phone is
   measured against the demo he is actually served. The committed file is this lane's run.

   WHAT IT CANNOT SEE, said plainly in the record: a YES whose card names a commit that only registered the card
   (the coordinator's bulk registrations) reads NOT YET even if the thing is in the game under another commit; a
   shared file (one engine file that many things live in) reads IN for every card that touched it. It never says IN
   for a card whose commit touched nothing the demo loads.

   Run: node tools/bohemia_run2_yes_in_the_demo.js            (both steps)
        node tools/bohemia_run2_yes_in_the_demo.js status     (the deploy's step, no git)
        node tools/bohemia_run2_yes_in_the_demo.js carriers
        (status takes --demo <a cut> and --out <file>; the gate uses both)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');

const ROOT = path.dirname(__dirname);
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const CARRIERS = path.join(ROOT, 'records/target/BOHEMIA_YES_CARRIERS.json');
const OUT = path.join(ROOT, 'records/target/BOHEMIA_YES_IN_THE_DEMO.json');
const DEMO = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');
const SINCE = 1016;   /* his YES votes since 10/16, the row's word */
const FOLD = 8;       /* more files than this in one folder (a rig's 400 frames) are kept as the folder, 'dir/' */

/* the VOTE machinery and the workshop's dev pages: a commit that touched only these put nothing in the game */
const NOT_GAME = [/^records\/target\/BOHEMIA_VOTE_(REGISTRY|TRIAGE)\.json$/, /^records\/target\/BOHEMIA_YES_/, /^records\/target\/vote_first\//,
  /^slices\/vote\//, /^slices\/BOHEMIA_VOTE_/, /^slices\/BOHEMIA_(ART|LOOK|WORDS|UI|UIWALL|LIFE|MAP)_CURRENT\.html$/, /^slices\/BOHEMIA_CURRENT_SLICE\.html$/,
  /^slices\/BOHEMIA_DEMO_STAMP\.txt$/];
/* the dev frames the cut leaves in the demo's markup, inert (no tab reaches them): never crawled */
const DEV_FRAMES = ['BOHEMIA_VOTE_TAB.html', 'BOHEMIA_VOTE_CURRENT.html', 'BOHEMIA_ART_CURRENT.html', 'BOHEMIA_LOOK_CURRENT.html',
  'BOHEMIA_WORDS_CURRENT.html', 'BOHEMIA_UI_CURRENT.html', 'BOHEMIA_UIWALL_CURRENT.html', 'BOHEMIA_CURRENT_SLICE.html',
  'BOHEMIA_LIFE_CURRENT.html', 'BOHEMIA_MAP_CURRENT.html', 'BOHEMIA_ALPHA_0_9.html', 'BOHEMIA_VOTE_REGISTRY.json', 'BOHEMIA_VOTE_TRIAGE.json'];

const madeN = s => { const m = String(s || '').match(/^(\d{1,2})\/(\d{1,2})/); return m ? (+m[1]) * 100 + (+m[2]) : 0; };
const gameFile = f => /^(slices|engine|records\/target)\//.test(f) && !NOT_GAME.some(r => r.test(f));
const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };

/* ---------- 1. CARRIERS ---------- */
function git(dir, args) {
  const r = cp.spawnSync('git', ['-C', dir].concat(args), { encoding: 'utf8', maxBuffer: 1 << 26 });
  return r.status === 0 ? r.stdout : null;
}
function history() {
  if (process.env.BOHEMIA_HISTORY && fs.existsSync(process.env.BOHEMIA_HISTORY)) return process.env.BOHEMIA_HISTORY;
  const dir = path.join(os.tmpdir(), 'bohemia-history.git');
  if (!fs.existsSync(dir)) {
    const url = git(ROOT, ['remote', 'get-url', 'origin']);
    if (!url) return null;
    const r = cp.spawnSync('git', ['clone', '-q', '--bare', '--filter=blob:none', '--single-branch', '--branch', 'main',
      '--shallow-since=2026-07-01', url.trim(), dir], { encoding: 'utf8', timeout: 300000 });
    if (r.status !== 0) { console.error('no history clone: ' + (r.stderr || '').slice(0, 200)); return null; }
  } else git(dir, ['fetch', '-q', '--filter=blob:none', 'origin', 'main:main']);
  return dir;
}
/* THE SHALLOW EDGE: in a shallow clone the oldest commit has no parent, so git shows it ADDING EVERY FILE IN THE TREE
   (measured: ANIMATION's ragdoll commit read as 600 engine files in this container's 68-commit clone, and every card on
   it read IN THE DEMO). A commit is only read where its parent is there too. */
function changed(dir, sha) {
  if (git(dir, ['rev-parse', '-q', '--verify', sha + '^{commit}']) == null) return null;
  if (git(dir, ['rev-parse', '-q', '--verify', sha + '^1^{commit}']) == null) return null;
  return git(dir, ['show', '--name-only', '--format=', '--no-renames', sha]);
}
function folded(files) {
  const by = {}; files.forEach(f => { const d = f.slice(0, f.lastIndexOf('/') + 1); (by[d] = by[d] || []).push(f); });
  const out = []; Object.keys(by).sort().forEach(d => { if (by[d].length > FOLD) out.push(d); else out.push.apply(out, by[d]); });
  return out;
}
/* THE LABEL CARRIES THE THING. A card's commit is often the one that only REGISTERED it (measured: RUN TWO's
   [faces not tiny bodies] card names b57173f, which touched the board, the registry and a picture; the screens changed
   in the commit before). Every lane writes its [two-word label] in its commit subjects, so the thing a card shows is
   every commit with the same lane and the same label. */
const LABEL = /^(.*?)\s*\[([^\]]+)\]/;
function subjects(dir) {
  const out = git(dir, ['log', '--format=%h%x09%s', 'HEAD']) || '';
  const by = {};
  out.split('\n').forEach(l => { const t = l.indexOf('\t'); if (t < 0) return; const m = l.slice(t + 1).match(LABEL);
    if (m) { const k = m[1].trim().toUpperCase() + ' [' + m[2].trim().toLowerCase() + ']'; (by[k] = by[k] || []).push(l.slice(0, t)); } });
  return by;
}
function labelOf(dir, sha) {
  const m = (git(dir, ['log', '-1', '--format=%s', sha]) || '').match(LABEL);
  return m ? m[1].trim().toUpperCase() + ' [' + m[2].trim().toLowerCase() + ']' : null;
}
function carriers() {
  const reg = readJSON(REG, { items: [] });
  const have = readJSON(CARRIERS, { bySha: {} });
  const bySha = have.bySha || {};
  const want = Array.from(new Set((reg.items || []).map(i => String(i.sha || '').trim()).filter(s => /^[0-9a-f]{7,40}$/.test(s))));
  let hist = null, read = 0, missing = [];
  const subs = {};
  for (const sha of want) {
    if (bySha[sha] != null) continue;
    let dir = ROOT, out = changed(ROOT, sha);
    if (out == null) { if (hist === null) hist = history() || ''; if (hist) { dir = hist; out = changed(hist, sha); } }
    if (out == null) { missing.push(sha); continue; }
    const all = out.split('\n');
    const lab = labelOf(dir, sha);
    if (lab) {
      if (!subs[dir]) subs[dir] = subjects(dir);
      (subs[dir][lab] || []).forEach(h => { if (h !== sha.slice(0, h.length)) { const o = changed(dir, h); if (o) all.push.apply(all, o.split('\n')); } });
    }
    bySha[sha] = folded(Array.from(new Set(all.map(s => s.trim()).filter(Boolean))).filter(gameFile));
    read++;
  }
  const doc = {
    _readme: 'RUN TWO [his yeses in the demo]: for each VOTE card\'s commit (its sha), the files it changed that the game could load. Made by tools/bohemia_run2_yes_in_the_demo.js from git, never by hand; a commit\'s files never change, so rows are kept across runs. missing: shas no history this tool could reach holds (a sha from a branch that never reached main, a rebased one, a typo).',
    made: new Date().toISOString().slice(0, 16) + 'Z',
    missing: missing.sort(),
    bySha
  };
  fs.writeFileSync(CARRIERS, JSON.stringify(doc, null, 1) + '\n');
  console.log('carriers: ' + Object.keys(bySha).length + ' commits known (' + read + ' read now), ' + missing.length + ' unreadable');
}

/* ---------- 2. STATUS ---------- */
const REF = /[A-Za-z0-9_\-./]*[A-Za-z0-9_\-]\.(?:html|js|json|png|webp|jpe?g|gif|mp3|ogg|wav|m4a|glb|css|txt)\b/g;
const PUBLISHED = /^(slices|engine|records\/target)\/./;
/* a folder the game builds names in ('rig_faces/' + look + '.png'): one level under slices/ or engine/, two under
   records/target/, never the published roots themselves (records/target/ alone would make every sheet 'reached') */
const deepEnough = r => /^(slices|engine)\/[^/]+\/$/.test(r) || /^(slices|engine)\/[^/]+\/.+\/$/.test(r) || /^records\/target\/[^/]+\/$/.test(r) || /^records\/target\/[^/]+\/.+\/$/.test(r);
const DIRREF = /['"`]((?:\.\.?\/)*(?:slices|engine|records\/target|[A-Za-z0-9_\-]+)(?:\/[A-Za-z0-9_\-]+)*\/)['"`]/g;
function resolveRef(ref, fromDir) {
  ref = ref.replace(/^\.\//, '');
  const tries = [path.normalize(path.join(fromDir, ref)), path.normalize(path.join(ROOT, 'slices', ref)), path.normalize(path.join(ROOT, ref))];
  for (const t of tries) {
    if (!t.startsWith(ROOT + path.sep) || !fs.existsSync(t)) continue;
    const rel = path.relative(ROOT, t).split(path.sep).join('/');
    if (PUBLISHED.test(rel)) return rel;   /* the site serves slices/, engine/ and records/target/ only: nothing else can load */
  }
  return null;
}
function reach(demoFile) {
  const files = new Set(), dirs = new Set(), queue = [path.relative(ROOT, demoFile).split(path.sep).join('/')];
  files.add(queue[0]);
  while (queue.length) {
    const rel = queue.shift(), abs = path.join(ROOT, rel), from = path.dirname(abs);
    let txt; try { txt = fs.readFileSync(abs, 'utf8'); } catch (e) { continue; }
    if (txt.length > 40e6) continue;
    /* A NAME IN A COMMENT IS NOT A LOAD (measured: the fight's comment 'Colours: records/target/BOHEMIA_STYLE_PALETTE.json'
       read three of DIRECTION's cards IN THE DEMO). Block comments, HTML comments and line comments go before the scan. */
    /* ...but an engine file INLINED into a page is a load, and its banner lives in a comment: 'INLINED VERBATIM from
       engine/x.js' or '==== engine/x.js (... inlined verbatim) ====' */
    const BANNER = /(?:INLINED VERBATIM from|\/\* ====)\s+(engine\/[A-Za-z0-9_.\-]+\.js)/g; let bn;
    while ((bn = BANNER.exec(txt))) { const r = resolveRef(bn[1], from); if (r && !files.has(r)) { files.add(r); queue.push(r); } }
    if (/\.(js|html|css)$/.test(rel)) txt = txt.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/(^|[\s;{}(),])\/\/[^\n]*/g, '$1');
    for (const m of txt.match(REF) || []) {
      const base = m.split('/').pop();
      if (DEV_FRAMES.indexOf(base) >= 0) continue;
      const r = resolveRef(m, from);
      if (!r || files.has(r) || NOT_GAME.some(x => x.test(r))) continue;
      files.add(r);
      if (/\.(html|js|json|css)$/.test(r)) queue.push(r);
    }
    let d; DIRREF.lastIndex = 0;
    while ((d = DIRREF.exec(txt))) {
      const r = resolveRef(d[1], from);
      const dir = r && fs.statSync(path.join(ROOT, r)).isDirectory() ? r.replace(/\/$/, '') + '/' : null;
      if (dir && deepEnough(dir) && !NOT_GAME.some(x => x.test(dir))) dirs.add(dir);
    }
  }
  return { files, dirs };
}
function status(demoFile, outFile) {
  demoFile = demoFile || DEMO;
  const reg = readJSON(REG, { items: [], verdicts: [] });
  const car = readJSON(CARRIERS, { bySha: {} }).bySha || {};
  const html = fs.readFileSync(demoFile, 'utf8');
  const sm = html.match(/<div id="buildstamp"[^>]*>([^<]*)<\/div>/);
  const stamp = sm ? sm[1].trim() : '';
  const build = (stamp.match(/BUILD\s+(\S+)/) || [])[1] || stamp;
  const R = reach(demoFile);
  const items = {}; (reg.items || []).forEach(i => { if (i && i.id) items[i.id] = i; });
  const seen = new Set(), rows = [];
  (reg.verdicts || []).forEach(v => {
    if (!v || v.vote !== 'up' || madeN(v.when) < SINCE || seen.has(v.id)) return;
    seen.add(v.id);
    const it = items[v.id] || {}, sha = String(it.sha || '').trim(), files = Array.isArray(car[sha]) ? car[sha] : null;
    const hit = (files || []).find(f => /\/$/.test(f)
      ? (Array.from(R.files).some(x => x.indexOf(f) === 0) || Array.from(R.dirs).some(d => d.indexOf(f) === 0 || f.indexOf(d) === 0))
      : (R.files.has(f) || Array.from(R.dirs).some(d => f.indexOf(d) === 0)));
    rows.push({ id: v.id, title: it.title || v.id, lane: String(it.lane || '?').toUpperCase(), when: v.when || '', star: !!v.star,
                state: hit ? 'in' : 'not', by: hit || (files ? (files.length ? 'nothing the demo loads' : 'no game file') : 'commit not read') });
  });
  const doc = {
    _readme: 'RUN TWO [his yeses in the demo]: every YES since 10/16, IN THE DEMO (a file its commit changed is one the demo reaches) or NOT YET (the chat that has it is the card\'s lane). Made by tools/bohemia_run2_yes_in_the_demo.js from the registry, the carriers and the demo\'s own cut; never typed by hand. The deploy re-makes it after it cuts the demo.',
    made: new Date().toISOString().slice(0, 16) + 'Z',
    stamp, build,
    reached: R.files.size,
    rows
  };
  fs.writeFileSync(outFile || OUT, JSON.stringify(doc, null, 1) + '\n');
  const n = rows.filter(r => r.state === 'in').length;
  console.log('status: ' + rows.length + ' yes since 10/16, ' + n + ' in the demo (' + build + '), ' + (rows.length - n) + ' not yet; the demo reaches ' + R.files.size + ' files');
  return doc;
}

if (require.main === module) {
  const a = process.argv[2] || 'both';
  const di = process.argv.indexOf('--demo'), demo = di > 0 ? path.resolve(process.argv[di + 1]) : null;
  const oi = process.argv.indexOf('--out'), out = oi > 0 ? path.resolve(process.argv[oi + 1]) : null;
  if (a === 'carriers' || a === 'both') carriers();
  if (a === 'status' || a === 'both') status(demo, out);
}
module.exports = { reach, status, changed, folded, gameFile, madeN, SINCE };
