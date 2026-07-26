/* QUEST PLACEMENT GATE (7/26/26, WORLD lane) — the machine gate for the quest
   PLACEMENT CANDIDATE factory (engine/bohemia_quest_placement.js + the judge page
   tools/bohemia_quest_placement_judge.py builds).

   FACTORY LAW: a factory without its own regression gate is not a factory. This one
   proves, headlessly:

     1. MAP LAW HELD (the one that matters). The generator never invents geography:
        every candidate cell is a district the world model ALREADY generated at that
        coordinate, of exactly the kind reported, and running the generator leaves
        the world model byte-identical (it reads, it never writes).
     2. THE ANCHOR IS THE LIVE ENGINE. Candidate 'anchor' equals what the SHIPPED
        casting bridge (ctx.quests.castTarget) returns right now, so the thing Paolo
        compares against can never drift away from the thing the game does.
     3. DETERMINISM. Two independent runs (two fresh boots) produce byte-identical
        candidates. No RNG, no clock, no iteration-order luck.
     4. COVERAGE. Every canon .bq gets the anchor plus at least one real alternative,
        each with a non-empty plain-English reason.
     5. NO STACKING. No two quests propose the same cell (the shared taken-set), and
        within a quest no two candidates land on one cell.
     6. TASTE. No em dash anywhere in the reason text Paolo reads (taste canon), and
        no reason cites a district kind the valley does not actually contain.
     7. THE PAGE IS REAL AND FRESH. The judge page exists, carries every quest, and
        every engine module inlined in it is byte-identical to its canon body
        (ENGINE SYNC LAW — the page goes RED until the tool is rerun), and it is
        built on the seed the PHONE runs, not a decorative one.
     8. REACHABLE. The alpha's LIFE hub links it (one-alpha law: judge tools are
        reached from inside the alpha, never shipped as their own build).

   Run: node gates/quest_placement_gate.js
   Registered in gates/bohemia_gates.py as QUEST PLACEMENT. */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const BQ = require('../engine/bohemia_bq.js');
const Loop = require('../engine/bohemia_loop.js');
const E = require('../engine/bohemia_engine.js');
const P = require('../engine/bohemia_quest_placement.js');

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : (fail++, console.log('  FAIL: ' + name)); };

const BQ_DIR = path.join(__dirname, '..', 'quests', 'bq');
const DOSS_DIR = path.join(__dirname, '..', 'records', 'tilespec');
const PAGE = 'slices/BOHEMIA_QUEST_PLACEMENT_JUDGE_7_26_26.html';
const HUB = 'slices/BOHEMIA_LIFE_CURRENT.html';

function dossiers() {
  const out = {};
  fs.readdirSync(DOSS_DIR).filter(f => /^BOHEMIA_TILESPEC_.*\.md$/.test(f)).forEach(f => {
    out[f.replace('BOHEMIA_TILESPEC_', '').replace('.md', '')] =
      fs.readFileSync(path.join(DOSS_DIR, f), 'utf8');
  });
  return out;
}

function runBatch() {
  const ctx = Loop.boot({ seed: 'bohemia' });
  const vocab = P.buildVocab(dossiers());
  const quests = {}, anchors = {};
  fs.readdirSync(BQ_DIR).filter(f => /\.bq$/.test(f)).sort().forEach(f => {
    const text = fs.readFileSync(path.join(BQ_DIR, f), 'utf8');
    const Q = BQ.parse(text);
    const at = ctx.quests.castTarget(Q);
    const cell = ctx.worldMap.real.at(at.x, at.y);
    at.kind = cell ? cell.district : null;
    anchors[f] = at;
    quests[f] = { id: Q.id, title: Q.title, text: text, anchor: at };
  });
  const before = JSON.stringify(ctx.worldMap.districts);
  const batch = P.batch({
    worldMap: ctx.worldMap,
    owner: id => ctx.factions.owner.get(id) || null,
    vocab: vocab, quests: quests
  });
  const after = JSON.stringify(ctx.worldMap.districts);
  return { ctx, batch, anchors, unchanged: before === after, files: Object.keys(quests) };
}

const A = runBatch();
const B = runBatch();
const kinds = {};
A.ctx.worldMap.districts.forEach(d => { kinds[d.kind] = (kinds[d.kind] || 0) + 1; });

ok('the nine canon quests all got candidates', A.batch.length === A.files.length && A.batch.length >= 9);

// 1. MAP LAW: every candidate is a real, already-generated district cell
let realCells = 0, fakeCells = 0;
A.batch.forEach(q => q.candidates.forEach(c => {
  const cell = A.ctx.worldMap.real.at(c.x, c.y);
  if (cell && cell.district === c.kind && c.id === c.x + ',' + c.y) realCells++;
  else { fakeCells++; console.log('    invented cell: ' + q.file + ' ' + c.strategy + ' ' + c.id + ' says ' + c.kind + ', world says ' + (cell ? cell.district : 'nothing')); }
}));
ok('every candidate cell is a district the world already generated (' + realCells + ')', fakeCells === 0);
ok('generating candidates does not mutate the world model', A.unchanged);

// 2. the anchor IS the shipped cast
let anchorDrift = 0;
A.batch.forEach(q => {
  const a = q.candidates.filter(c => c.strategy === 'anchor')[0];
  const cast = A.anchors[q.file];
  if (!a || a.x !== cast.x || a.y !== cast.y || a.channel !== cast.channel) anchorDrift++;
});
ok('candidate 1 is exactly where the live engine casts the quest today', anchorDrift === 0);

// 3. determinism
ok('two independent runs produce byte-identical candidates',
   JSON.stringify(A.batch) === JSON.stringify(B.batch));

// 4. coverage + reasons
let thin = 0, reasonless = 0;
A.batch.forEach(q => {
  if (q.candidates.length < 2) thin++;
  q.candidates.forEach(c => {
    if (!c.reasons || !c.reasons.length || c.reasons.some(r => !r || !r.trim())) reasonless++;
  });
});
ok('every quest gets the anchor plus at least one real alternative', thin === 0);
ok('every candidate carries plain-English reasons', reasonless === 0);

// 5. no stacking, within a quest or across the batch
const seen = {};
let dupAcross = 0, dupInside = 0;
A.batch.forEach(q => {
  const inside = {};
  q.candidates.forEach(c => {
    if (inside[c.id]) dupInside++;
    inside[c.id] = true;
    if (c.strategy === 'anchor') return;         // anchors are the engine's, not ours to move
    if (seen[c.id]) dupAcross++;
    seen[c.id] = true;
  });
});
ok('no quest proposes the same cell twice', dupInside === 0);
ok('no two quests propose the same cell', dupAcross === 0);

// 6. taste + honesty
let emdash = 0, ghostKind = 0;
A.batch.forEach(q => q.candidates.forEach(c => {
  c.reasons.forEach(r => { if (r.indexOf('—') >= 0) emdash++; });
  if (c.strategy !== 'anchor' && !kinds[c.kind]) ghostKind++;
}));
ok('no em dash in anything Paolo reads', emdash === 0);
ok('no candidate cites a district kind the valley does not contain', ghostKind === 0);

// 7. the page: exists, complete, fresh, built on the phone's own seed
ok('judge page exists', fs.existsSync(PAGE));
if (fs.existsSync(PAGE)) {
  const page = fs.readFileSync(PAGE, 'utf8');
  const MODULES = (page.match(/<!-- engine-md5:([^:]+):([0-9a-f]{32}) -->/g) || []);
  ok('judge page stamps its inlined engine modules (' + MODULES.length + ')', MODULES.length >= 44);
  let stale = 0;
  MODULES.forEach(tag => {
    const m = /<!-- engine-md5:([^:]+):([0-9a-f]{32}) -->/.exec(tag);
    const body = fs.existsSync(m[1]) ? fs.readFileSync(m[1], 'utf8') : null;
    const md5 = body == null ? null : crypto.createHash('md5').update(body, 'utf8').digest('hex');
    if (md5 !== m[2] || page.indexOf(body) < 0) {
      stale++;
      console.log('    STALE: ' + m[1] + ' (rerun python3 tools/bohemia_quest_placement_judge.py)');
    }
  });
  ok('every inlined engine module is byte-identical to its canon body', stale === 0);

  const seedNum = E.WorldGen.hashSeed('bohemia');
  ok('the judge map is built on the seed the phone runs (' + seedNum + ')',
     page.indexOf('"seed":' + seedNum) >= 0 || page.indexOf('"seed": ' + seedNum) >= 0);
  let missing = 0;
  A.batch.forEach(q => { if (page.indexOf(q.file) < 0) missing++; });
  ok('the page carries every canon quest', missing === 0);
  ok('the page exports .txt, never .json', /\.txt'/.test(page) && !/\.json'/.test(page));
  ok('the page has SUN MODE and a comment box', /SUN MODE/.test(page) && /PAOLO COMMENTS/.test(page));
  ok('the page renders the real cells (world model, not a mockup)',
     /BohemiaWorld\.world\(/.test(page) && /W\.plot\(/.test(page));
}

// 8. reachable from inside the alpha
ok('the LIFE hub links the placement judge',
   fs.existsSync(HUB) && fs.readFileSync(HUB, 'utf8').indexOf('BOHEMIA_QUEST_PLACEMENT_JUDGE_7_26_26.html') >= 0);

console.log('QUEST PLACEMENT GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
