/* ============================================================================
   THE PACKS ARE THE BAR -- A FIGHT BOARD AND A SETTLEMENT PICTURE ARE CUT FROM HIS APPROVED PACKS
   (PLUMBER 10/10/26, row [the pack gate]; rule 82a)

   PAOLO 10/10: "the cars is an asset we downloaded; a lot of the original street tiles and sidewalks we
   downloaded; look again." Rule 82a: every tile, prop, car, street, sidewalk, kerb, marking, lamp and
   house skin on a fight board and a settlement picture comes FROM the approved corpus (the purchased HD
   packs he judged in July, and the pools and banks cut from them), never cooked fresh; the 7/27 shopping
   law (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md) "was never read for the fight: measured 10/10, no
   COMBAT TWO tool reads the repo, the set, the tiles or the props."
   The corpus is tools/bohemia_pack_corpus.js (the index's table plus rule 82a's list, as data).

   WHAT COUNTS AS PROOF. A picture is FROM THE PACKS when a manifest beside it names it and lists the
   approved tiles it was cut from, every one resolving in the corpus: the shape COOK TWO's first kit
   already writes (slices/fight_ground/kit_street/kit_street.json: pieces[name] = { src, keys: [[pool,
   index], ...] }). Keys may also be {pack, idx} (UP in the confirmed set) or {bank, pool?, idx}; a piece
   that is drawn by hand on purpose says so in "exception" with its reason. A manifest is any .json in the
   picture's own folder.

   LEGS
     S1-S6  planted: a manifest whose keys resolve covers its pictures; a key past the end of its pool, a
            pool no bank has and a pack tile he judged DOWN are caught; an "exception" with a reason covers;
            a ground cook tool that names no bank is caught, and one that reads the street pools is not.
     C1     the corpus is on disk: every bank in tools/bohemia_pack_corpus.js exists (the art bank folder
            is COOK's to make and is reported until it does).
     K1     no NEW cook tool writes into slices/fight_ground/, slices/settlement_ground/ or slices/settlement/
            without naming the corpus. Tools from before the law are DEBT in gates/pack_gate_baseline.txt,
            which may only shrink.
     M1     every manifest key resolves to an approved tile (a wrong key is never debt).
     P1     no NEW picture in those folders ships without a manifest covering it. Pictures from before the
            law are DEBT in the same baseline, which may only shrink as COOK TWO and COOK FOUR re-cut them.
   MEASURED 10/10 (at landing): see the record, records/BOHEMIA_THE_PACKS_ARE_THE_BAR_10_10_26.md.
   node gates/pack_gate.js            node gates/pack_gate.js --baseline   (writes the debt list; PLUMBER only)
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { CORPUS, corpusNames, resolveKey } = require(path.join(ROOT, 'tools/bohemia_pack_corpus.js'));

/* the ground folders, found rather than listed: COOK FOUR's first re-cut landed in a new folder,
   slices/settlement_ground_packs/, the round this gate was written. The people folders are not ground. */
const DIRS = (() => { try { return fs.readdirSync(path.join(ROOT, 'slices'), { withFileTypes: true })
  .filter(e => e.isDirectory() && (/^(fight_ground|settlement_ground)/.test(e.name) || e.name === 'settlement'))
  .map(e => 'slices/' + e.name); } catch (e) { return ['slices/fight_ground', 'slices/settlement_ground', 'slices/settlement']; } })();
const PIC = /\.(png|jpe?g|webp|gif)$/i;
const BASELINE = path.join(ROOT, 'gates/pack_gate_baseline.txt');

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

/* ---- the measures, as functions so the planted cases run the same code ---------------- */
function walk(dir) {
  const out = []; let ents = [];
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const e of ents) { const p = path.join(dir, e.name); if (e.isDirectory()) out.push(...walk(p)); else out.push(p); }
  return out;
}
/* every manifest piece in a folder tree: { pic (absolute), keys, exception, manifest } */
function pieces(files) {
  const out = [];
  /* A FOLDER-WIDE LIST (COOK FOUR's PACK_TILES_USED.txt): a first line that says what it is, then one pack tile a
     line as "<pack>#<idx>". It covers every picture in its own folder when every tile on it is UP. Coarser than a
     manifest per picture, and honest: it names the tiles and the gate checks each one. */
  for (const f of files.filter(x => /PACK_TILES_USED\.txt$/.test(x))) {
    const keys = fs.readFileSync(f, 'utf8').split('\n').slice(1).map(l => l.trim()).filter(Boolean)
      .map(l => { const m = /^(.*)#(\d+)$/.exec(l); return m ? { pack: m[1], idx: +m[2] } : { line: l }; });
    for (const pic of files.filter(x => PIC.test(x) && path.dirname(x) === path.dirname(f)))
      out.push({ pic, keys, exception: null, manifest: f });
  }
  for (const f of files.filter(x => /\.json$/i.test(x))) {
    let d; try { d = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { continue; }
    const seen = [];
    (function visit(o, depth) {
      if (!o || typeof o !== 'object' || depth > 6) return;
      if (typeof o.src === 'string' && PIC.test(o.src) && (Array.isArray(o.keys) || typeof o.exception === 'string')) {
        seen.push({ pic: path.resolve(path.dirname(f), o.src), keys: Array.isArray(o.keys) ? o.keys : [], exception: o.exception || null, manifest: f });
        return; }
      for (const k in o) visit(o[k], depth + 1);
    })(d, 0);
    out.push(...seen);
  }
  return out;
}
/* a tool that writes ground pictures: it names one of the folders and writes a file */
const WRITES = /\.save\(|writeFileSync|imwrite|toFile\(|open\([^)]*['"]wb?['"]/;
/* the folders by their own names, never the bare word: "settlement" is in half the city's patch tools */
const GROUND = /fight_ground|settlement_ground|slices\/settlement\/|['"]slices['"]\s*,\s*['"]settlement['"]/;
/* A GROUND COOK TOOL: the row's words, "a cook tool under tools/ that writes a street, sidewalk, kerb, car or
   prop". By its name (cook, factory, a pack or kit maker), it names a ground folder, and it saves pictures.
   A line-by-line "where does the output go" test was tried first and missed 17 of the board cooks, which
   build their paths from a shared constant; the verdict and glare tools that only READ the boards carry no
   cook name. */
const COOKNAME = /cook|factory|_pack_|_kit_/i;
const IMAGE_SAVE = /\.save\(|toBuffer\(|imwrite|writeFileSync\([^)]*(png|webp|jpe?g)/i;
function groundTool(src, file) { return COOKNAME.test(path.basename(file || '')) && GROUND.test(src) && IMAGE_SAVE.test(src); }
const NAMES = corpusNames();
function readsCorpus(src) { return NAMES.some(n => src.includes(n)); }

function judge(rootDir, toolsDir) {
  const dirs = (() => { try { return fs.readdirSync(path.join(rootDir, 'slices'), { withFileTypes: true })
    .filter(e => e.isDirectory() && (/^(fight_ground|settlement_ground)/.test(e.name) || e.name === 'settlement'))
    .map(e => 'slices/' + e.name); } catch (e) { return DIRS; } })();
  const files = [].concat(...dirs.map(d => walk(path.join(rootDir, d))));
  const pics = files.filter(f => PIC.test(f));
  const P = pieces(files);
  const cover = new Map(), badKeys = [];
  for (const p of P) {
    const bad = p.keys.map(k => [k, resolveKey(k)]).filter(([, r]) => !r.ok);
    for (const [k, r] of bad) badKeys.push(path.relative(rootDir, p.manifest) + ': ' + JSON.stringify(k) + ' (' + r.why + ')');
    if (!bad.length && (p.keys.length || p.exception)) cover.set(p.pic, p);
  }
  const uncovered = pics.filter(f => !cover.has(f)).map(f => path.relative(rootDir, f));
  const tools = [];
  for (const f of walk(toolsDir).filter(x => /\.(py|js)$/.test(x))) {
    const src = fs.readFileSync(f, 'utf8');
    if (groundTool(src, f) && !readsCorpus(src)) tools.push(path.relative(rootDir, f));
  }
  return { pics, covered: pics.length - uncovered.length, uncovered, badKeys, tools, exceptions: P.filter(p => p.exception).length };
}

/* ---- --baseline: the debt the day the law landed ----------------------------------------- */
const J = judge(ROOT, path.join(ROOT, 'tools'));
if (process.argv.includes('--baseline')) {
  fs.writeFileSync(BASELINE, ['# THE PACK GATE\'S DEBT (PLUMBER, row [the pack gate], rule 82a, written ' + new Date().toISOString().slice(0, 10) + ').',
    '# Ground pictures with no pack manifest, and ground cook tools that never read the corpus, from before the law.',
    '# It may only SHRINK: a line comes off when COOK TWO or COOK FOUR re-cut the picture from the packs with a manifest,',
    '# or the tool reads the corpus, or either is deleted. A new line is a red in gates/pack_gate.js, never an edit here.',
    ...J.tools.map(t => 'tool ' + t), ...J.uncovered.map(p => 'picture ' + p)].join('\n') + '\n');
  console.log('wrote ' + path.relative(ROOT, BASELINE) + ': ' + J.tools.length + ' tools, ' + J.uncovered.length + ' pictures');
  process.exit(0);
}

console.log('='.repeat(74));
console.log('THE PACKS ARE THE BAR: fight boards and settlement pictures cut from his approved packs (rule 82a)');
console.log('='.repeat(74));

/* ---- S: planted ---------------------------------------------------------------------- */
const os = require('os');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'packgate-'));
try {
  const put = (rel, s) => { const p = path.join(tmp, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
  put('slices/fight_ground/kit/a.webp', 'x'); put('slices/fight_ground/kit/b.webp', 'x'); put('slices/fight_ground/kit/c.webp', 'x');
  put('slices/fight_ground/kit/d.webp', 'x'); put('slices/fight_ground/kit/e.webp', 'x'); put('slices/fight_ground/loose.webp', 'x');
  put('slices/fight_ground/kit/kit.json', JSON.stringify({ pieces: {
    a: { src: 'a.webp', keys: [['street', 0], ['side', 3]] },
    b: { src: 'b.webp', keys: [['street', 999]] },
    c: { src: 'c.webp', keys: [['moonrock', 1]] },
    d: { src: 'd.webp', keys: [{ pack: '1. Cobblestone floor tiles', idx: 999999 }] },
    e: { src: 'e.webp', exception: 'the paint line, drawn from the pool tile\'s own measured colour' } } }));
  put('slices/settlement_ground_x/p.webp', 'x'); put('slices/settlement_ground_x/q.webp', 'x');
  put('slices/settlement_ground_x/PACK_TILES_USED.txt', '2 distinct approved pack tiles\n1. Cobblestone floor tiles#0\n1. Cobblestone floor tiles#1\n');
  put('tools/cook_bad.py', "img.save(os.path.join(R, 'slices/fight_ground/x.webp'))\n");
  put('tools/verdict_reader.py', "a = Image.open(os.path.join(ROOT, 'slices/fight_ground', n + '.webp'))\nsheet.save('slices/vote/V.png')\n");
  put('tools/cook_good.py', "pools = json.load(open('banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt'))\nimg.save(os.path.join(R, 'slices/fight_ground/y.webp'))\n");
  const T = judge(tmp, path.join(tmp, 'tools'));
  const un = new Set(T.uncovered.map(p => path.basename(p)));
  ok('S1 a manifest whose keys resolve covers its picture (a.webp)', !un.has('a.webp'), JSON.stringify(T));
  ok('S2 a key past the end of its pool is caught (b.webp)', un.has('b.webp') && T.badKeys.some(b => /street#999/.test(b)));
  ok('S3 a pool no approved bank has is caught (c.webp)', un.has('c.webp') && T.badKeys.some(b => /moonrock/.test(b)));
  ok('S4 a pack tile he did not judge UP is caught (d.webp)', un.has('d.webp') && T.badKeys.some(b => /not UP/.test(b)));
  ok('S5 a hand-drawn piece that says why is covered (e.webp), and a picture with no manifest is not (loose.webp)', !un.has('e.webp') && un.has('loose.webp'));
  ok('S5b a folder-wide list of UP pack tiles (COOK FOUR\'s shape) covers its folder\'s pictures (p.webp, q.webp)', !un.has('p.webp') && !un.has('q.webp'));
  ok('S6 a ground cook tool that names no bank is caught; one that reads the street pools, and one that only reads the boards, are not (' + T.tools.join(', ') + ')',
     T.tools.length === 1 && /cook_bad\.py$/.test(T.tools[0]));
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }

/* ---- C1: the corpus is on disk --------------------------------------------------------- */
const missing = CORPUS.filter(c => !fs.existsSync(path.join(ROOT, c.file)));
ok('C1 every approved bank the corpus names is on disk (' + (CORPUS.length - missing.length) + ' of ' + CORPUS.length + ')',
   missing.every(c => c.dir), missing.filter(c => !c.dir).map(c => c.file).join(', '));
if (missing.some(c => c.dir)) console.log('  note: ' + missing.filter(c => c.dir).map(c => c.file).join(', ') + ' is not made yet (COOK [the pack is the twin] extracts the corpus to PNG by family there)');

/* ---- the debt ------------------------------------------------------------------------- */
let base = [];
try { base = fs.readFileSync(BASELINE, 'utf8').split('\n').filter(l => l && !l.startsWith('#')); } catch (e) {}
const baseTools = new Set(base.filter(l => l.startsWith('tool ')).map(l => l.slice(5)));
const basePics = new Set(base.filter(l => l.startsWith('picture ')).map(l => l.slice(8)));
const newTools = J.tools.filter(t => !baseTools.has(t)), newPics = J.uncovered.filter(p => !basePics.has(p));
console.log('  ' + J.pics.length + ' ground pictures: ' + J.covered + ' cut from the packs with a manifest (' + J.exceptions + ' hand-drawn pieces with a reason), '
  + J.uncovered.length + ' without; ' + J.tools.length + ' ground cook tools that name no bank');

ok('K1 no NEW ground cook tool skips the corpus (' + J.tools.length + ' skip it today, ' + baseTools.size + ' on the debt list from before the law)', !newTools.length,
   newTools.join(', ') + '\n         read the corpus: tools/bohemia_pack_corpus.js lists every approved bank (rule 82a; the 7/27 shopping law).');
ok('M1 every manifest key names an approved tile (' + J.badKeys.length + ' wrong)', !J.badKeys.length, J.badKeys.slice(0, 10).join('\n         '));
ok('P1 no NEW ground picture ships without a pack manifest (' + J.uncovered.length + ' without one today, ' + basePics.size + ' on the debt list from before the law)', !newPics.length,
   newPics.slice(0, 12).join(', ') + '\n         cut it from the packs and write a manifest beside it: { src, keys: [[pool, index], ...] } (COOK TWO\'s kit_street.json is the shape).');
const paid = [...basePics].filter(p => !J.uncovered.includes(p)).length + [...baseTools].filter(t => !J.tools.includes(t)).length;
if (paid) console.log('  NOTE: ' + paid + ' debt line(s) are paid (re-cut from the packs, or gone). Take them off gates/pack_gate_baseline.txt to lock the win in.');

console.log('\n=== THE PACKS ARE THE BAR: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
