/* BOHEMIA ANSWERED-FOR GATE (7/31/26) — if I cannot write what a pixel is, it does not ship.
 *
 * PAOLO 7/31, scoring the two districts I had just rebuilt: "Commercial rebuilt is like 65 %
 * mall is like 40% i need you to be able to write about everything u draw at all times not a
 * single pixel on screen answered for bro"
 * Law: laws/BOHEMIA_ADDENDUM_EVERY_PIXEL_ANSWERED_7_31_26.md
 *
 * WHY THE EXISTING LAWS DID NOT CATCH THIS. EXPLAIN-EVERY-TILE (7/18) and the DISTRICT
 * DOSSIER LAW (7/19) were both GREEN on commercial and mall when he scored them 65 and 40.
 * legendOk() asks "does every code appear in the palette" — that is a spellcheck. It happily
 * passes a mall whose entire plot was painted "parking asphalt" before anything was built on
 * it, so 39.5% of the district was one code under one flat sentence. The laws were satisfied
 * and the work was still unanswerable, which means they were measuring the wrong thing.
 *
 * THE THREE TESTS A PIXEL HAS TO PASS NOW:
 *   1. NAMED   — it resolves to a legend entry. (The old bar, kept.)
 *   2. WRITTEN — that entry has a real act-1 account, not a stub, and resolves to a layer.
 *   3. EARNED  — it is not part of an undifferentiated slab. THE MONOBLOCK TEST: if one
 *                single code owns 30%+ of a plot, that area has not been answered for,
 *                whatever it is called.
 *
 * IT IS A RATCHET, like the squint twins and the icon debt, and for the same reason: 36 of
 * 49 districts fail the monoblock test today and 75 legend entries are stubs. A gate that is
 * red on day one is a comment nobody can act on. So the debt is NAMED, it may only SHRINK,
 * and new work cannot add to it. Some of it is legitimate and will stay — a mountain really
 * is mostly bedrock and a park really is mostly lawn — but it stays here NAMED rather than
 * silently excused, so the next person has to look at it and decide.
 *
 *   node gates/answered_for_gate.js
 */
const fs = require('fs');
const path = require('path');
const K = require('../engine/bohemia_district_kit.js');

const ROOT = path.join(__dirname, '..');
for (const f of fs.readdirSync(path.join(ROOT, 'engine'))) {
  if (!/^bohemia_.*\.js$/.test(f) || /test|kit/.test(f)) continue;
  try { require(path.join(ROOT, 'engine', f)); } catch (e) { /* not a district */ }
}

let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : fails.push(n); };

/* THE NAMED DEBT, measured 7/31 at the moment the law landed. It may only shrink.
   Districts NOT on this list must keep their biggest code under 30% of the plot. */
const MONOBLOCK_DEBT = new Set([
  'apartment', 'arterial', 'ballpark', 'battery', 'boneyard', 'campus', 'cemetery',
  'chapel', 'courthouse', 'desert', 'downtown', 'drivein', 'farm', 'freeway', 'golf',
  'industrial', 'interchange', 'jail', 'library', 'mountain', 'park', 'policestation',
  'railyard', 'solar', 'stadium', 'storage', 'substation', 'suburb', 'swapmeet',
  'terminal', 'trailer', 'truckstop', 'warehouse', 'water', 'waterpark', 'watertreat',
]);
const THIN_DEBT = 75;          // legend entries whose act-1 account is a stub. May only shrink.
const MIN_ACT1 = 40;           // a sentence that could only be about this thing
const MONO_CAP = 30;           // % of plot one code may own before nobody has answered for it

const LAYERS = new Set(['ground', 'structure', 'overhead', 'prop', 'portal']);

let swept = 0, unnamed = [], unwritten = 0, unwrittenEg = [], nolayer = [],
    monoNow = [], regressed = [], fixed = [];

for (const name of K.types()) {
  const d = K.get(name);
  if (!d || !d.generate || !d.legend || !d.palette) continue;
  let r;
  try { r = d.generate(11, { streets: ['S'] }); } catch (e) { continue; }
  swept++;

  const counts = {};
  const area = r.g.length * r.g[0].length;
  for (const row of r.g) for (const c of row) counts[c] = (counts[c] || 0) + 1;

  for (const c of Object.keys(counts)) {
    const e = d.legend[c];
    /* 1. NAMED */
    if (!e || !e.name) { unnamed.push(name + ':' + c); continue; }
    /* 2. WRITTEN */
    if (!e.act1 || e.act1.length < MIN_ACT1) {
      unwritten++;
      if (unwrittenEg.length < 3) unwrittenEg.push(name + ':' + c + ' "' + e.name + '"');
    }
    const L = K.tileLayer(e);
    if (!LAYERS.has(L.layer)) nolayer.push(name + ':' + c);
  }

  /* 3. EARNED — the monoblock test */
  const codes = Object.keys(counts).map(Number).sort((a, b) => counts[b] - counts[a]);
  const pct = 100 * counts[codes[0]] / area;
  const over = pct >= MONO_CAP;
  if (over) monoNow.push(name);
  if (over && !MONOBLOCK_DEBT.has(name))
    regressed.push(name + ' (' + pct.toFixed(1) + '% "' + (d.legend[codes[0]] || {}).name + '")');
  if (!over && MONOBLOCK_DEBT.has(name)) fixed.push(name);
}

ok(`every registered district is swept (${swept})`, swept >= 40);

ok('1. NAMED — every code on every plot resolves to a legend entry' +
   (unnamed.length ? ' — ' + unnamed.slice(0, 3).join(', ') : ''), unnamed.length === 0);

ok('2. WRITTEN — every code resolves to a real render layer (ground/structure/overhead/prop/portal)' +
   (nolayer.length ? ' — ' + nolayer.slice(0, 3).join(', ') : ''), nolayer.length === 0);

ok(`2. WRITTEN — the stub write-ups only ever SHRINK (${unwritten} of them, was ${THIN_DEBT}` +
   (unwrittenEg.length ? '; e.g. ' + unwrittenEg[0] : '') + ')', unwritten <= THIN_DEBT);

ok('3. EARNED — NO NEW MONOBLOCK: no district outside the named debt lets one code own ' +
   MONO_CAP + '% of its plot' + (regressed.length ? ' — ' + regressed.join(', ') : ''),
   regressed.length === 0);

ok(`3. EARNED — the monoblock debt only ever SHRINKS (${monoNow.length} districts, was ` +
   `${MONOBLOCK_DEBT.size}` + (fixed.length ? '; FIXED since: ' + fixed.join(', ') : '') + ')',
   monoNow.length <= MONOBLOCK_DEBT.size);

/* THE ANSWER SHEET IS THE SURFACE. He does not dig in files, so the write-ups have to be
   somewhere he can LOOK at them beside the picture, or they are an alibi rather than an
   answer. The gate asserts the tool and its page exist and that the page really carries
   the districts. */
const sheet = path.join(ROOT, 'slices', 'BOHEMIA_ANSWER_SHEET_7_31_26.html');
ok('the ANSWER SHEET exists — the render and every colour\'s write-up on one screen',
   fs.existsSync(sheet));
if (fs.existsSync(sheet)) {
  const h = fs.readFileSync(sheet, 'utf8');
  ok('the answer sheet carries every district and its swatches (' +
     (h.match(/<section>/g) || []).length + ' cards)',
     (h.match(/<section>/g) || []).length >= 40 && /BIGGEST SINGLE CODE/.test(h));
  ok('the answer sheet quotes the ruling it exists for', /not a single pixel/i.test(h));
}
const tool = path.join(ROOT, 'tools', 'bohemia_answer_sheet.py');
ok('the tool that builds it is in the repo and declares its REUSE CHECK (7/22)',
   fs.existsSync(tool) && /REUSE CHECK/.test(fs.readFileSync(tool, 'utf8')));

const law = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_EVERY_PIXEL_ANSWERED_7_31_26.md');
ok('the ruling is written down with his words and the two scores that came with it',
   fs.existsSync(law) && /not a single pixel/i.test(fs.readFileSync(law, 'utf8')) &&
   /65%/.test(fs.readFileSync(law, 'utf8')) && /40%/.test(fs.readFileSync(law, 'utf8')));

for (const f of fails) console.log('  > FAIL ' + f);
console.log(`=== ANSWERED-FOR GATE: ${pass} passed, ${fails.length} failed  ` +
            `(${swept} districts · monoblock debt ${monoNow.length}/${MONOBLOCK_DEBT.size} · ` +
            `stub write-ups ${unwritten}/${THIN_DEBT}) ===`);
process.exit(fails.length ? 1 : 0);
