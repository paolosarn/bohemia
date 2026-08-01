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

/* 2b. A NAME THAT LIES IS A BUG — DEAD THINGS ARE NOT GREEN.
   Paolo 8/2, looking at the downtown block I had just shipped: "I'm just confused and
   concerned. Are you putting grass in downtown?"
   He was. 18.2% of that plot was painted hue 77 — a green — under a legend entry that
   called it hardpan dirt. That is the exact failure this gate's own master file names as
   lesson three, written by me one turn earlier: THE MACHINE CANNOT CHECK WHAT THE LEGEND
   MISDESCRIBES. The write-up said dirt, the pixels said lawn, and every other claim in
   here passed because they all read the words and none of them looked at the colour.
   So now the words and the colour have to agree. If a tile calls itself dead, dirt, bare,
   dust, gravel, sand, asphalt, concrete or vacant, it may not be painted a saturated
   living green. Desaturated olive is fine — dead vegetation in the Mojave IS grey-olive —
   the bar is SATURATION, because that is what separates a dead shrub from a watered lawn.
   Nothing is watering Las Vegas.
   RATCHET: 22 of these were already in the valley when the check landed. Named, may only
   shrink, and nothing outside the list may grow a new one. */
const GREENWASH_DEBT = new Set([
  'apartment:3', 'arterial:11', 'ballpark:3', 'campus:3', 'chapel:3', 'chapel:4',
  'cityhall:3', 'courthouse:3', 'desert:2', 'farm:3', 'firestation:3', 'freeway:7',
  'interchange:7', 'jail:7', 'library:3', 'library:4', 'policestation:3', 'rail:16',
  'speedway:3', 'swapmeet:12', 'terminal:3', 'town:3', 'trailer:3', 'truckstop:13',
  'warehouse:3', 'water:9', 'waterpark:3',
]);
const DEAD_WORDS = /\bdead\b|\bdirt\b|\bbare\b|\bdry\b|dust|hardpan|gravel|\bsand\b|asphalt|concrete|rubble|scorch|cracked|vacant/i;
const LIVING_WORDS = /\blawn\b|\bturf\b|\bgrass\b|\bhedge\b|\bfoliage\b|putting/i;
const hsv = (hex) => {
  if (!hex || hex[0] !== '#' || hex.length < 7) return null;
  const R = parseInt(hex.slice(1, 3), 16), G = parseInt(hex.slice(3, 5), 16), B = parseInt(hex.slice(5, 7), 16);
  const mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn;
  let h = 0;
  if (d) h = mx === R ? 60 * (((G - B) / d) % 6) : mx === G ? 60 * ((B - R) / d + 2) : 60 * ((R - G) / d + 4);
  if (h < 0) h += 360;
  return { h: h, s: mx ? d / mx : 0 };
};
{
  let greenNow = [], greenNew = [];
  for (const name of K.types()) {
    const d = K.get(name);
    if (!d || !d.generate || !d.legend || !d.palette) continue;
    let r;
    try { r = d.generate(11, { streets: ['S'] }); } catch (e) { continue; }
    const seen = new Set();
    for (const row of r.g) for (const c of row) seen.add(c);
    for (const c of seen) {
      const e = d.legend[c] || {}, v = hsv(d.palette[c]);
      if (!v) continue;
      /* DEAD is read from the whole write-up, but LIVING only from the NAME. Reading the
         prose for the exemption is how the first cut of this check let the very tile it
         was written for through: my own act-1 line said "NOT GRASS: nothing is watering
         downtown Las Vegas", and the word grass in that sentence exempted it. A tile is
         living because of what it IS, never because of a word in its description. */
      const text = (e.name || '') + ' ' + (e.act1 || '');
      if (v.h >= 65 && v.h <= 170 && v.s > 0.35 && DEAD_WORDS.test(text) && !LIVING_WORDS.test(e.name || '')) {
        const key = name + ':' + c;
        greenNow.push(key);
        if (!GREENWASH_DEBT.has(key))
          greenNew.push(key + ' "' + (e.name || '') + '" ' + d.palette[c]);
      }
    }
  }
  ok('DEAD THINGS ARE NOT GREEN — nothing outside the named debt calls itself dirt or dead ' +
     'and paints itself a living lawn (Paolo 8/2: "Are you putting grass in downtown?")' +
     (greenNew.length ? ' — ' + greenNew.slice(0, 4).join(', ') : ''), greenNew.length === 0);
  ok(`the greenwash debt only ever SHRINKS (${greenNow.length}, was ${GREENWASH_DEBT.size})`,
     greenNow.length <= GREENWASH_DEBT.size);
}

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
