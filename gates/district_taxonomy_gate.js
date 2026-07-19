// DISTRICT TAXONOMY GATE (Paolo 7/18/26) — "you have to categorize things nicely." Every
// district type on the overmap must file into exactly ONE valid top-level category, so
// nothing is ever left uncategorized when districts get built autonomously.
const O = require('../engine/bohemia_overmap.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const TYPES = Object.values(O.DISTRICT);
const CATS = K.CATEGORIES;

// every overmap district type has a category, and it's a canonical one
let uncategorized = [], badCat = [];
for (const t of TYPES) {
  const c = K.category(t);
  if (!c) uncategorized.push(t);
  else if (!CATS.includes(c)) badCat.push(t + '->' + c);
}
ok('every district type is categorized (' + TYPES.length + ' types)', uncategorized.length === 0);
if (uncategorized.length) console.log('    uncategorized: ' + uncategorized.join(', '));
ok('every category is one of the canonical set', badCat.length === 0);

// the taxonomy has no phantom types (not in the enum)
const enumSet = new Set(TYPES);
const phantom = Object.keys(K.TAXONOMY).filter(t => !enumSet.has(t));
ok('no phantom types in the taxonomy', phantom.length === 0);
if (phantom.length) console.log('    phantom: ' + phantom.join(', '));

// the categories partition cleanly (counts sum to the total, every category is used)
let sum = 0; const used = new Set();
for (const c of CATS) { const n = K.inCategory(c).length; sum += n; if (n) used.add(c); }
ok('categories partition all types (sum = ' + sum + ' / ' + TYPES.length + ')', sum === TYPES.length);
ok('every category is used (no empty bucket)', used.size === CATS.length);

// the known anchors are filed right (the ones we've built + Paolo's examples)
const anchors = { suburb: 'residential', commercial: 'commercial', industrial: 'industrial', warehouse: 'industrial', casino: 'gaming_resort', park: 'leisure', freeway: 'infrastructure', desert: 'terrain' };
let anchorsOk = true;
for (const t in anchors) if (K.category(t) !== anchors[t]) { anchorsOk = false; console.log('    ' + t + ' -> ' + K.category(t) + ' (expected ' + anchors[t] + ')'); }
ok('the built + example districts are filed correctly', anchorsOk);

// report the breakdown
console.log('  categories: ' + CATS.map(c => c + '=' + K.inCategory(c).length).join('  '));
console.log('DISTRICT TAXONOMY GATE: ' + pass + ' passed, ' + fail + ' failed  (' + TYPES.length + ' types, ' + CATS.length + ' categories)');
process.exit(fail ? 1 : 0);
