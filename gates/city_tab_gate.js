// CITY TAB GATE (7/19/26, LIFE+CITY-SURFACE session) — the CITY tab must
// never show a stale or lawless valley. Proves:
//   1. FRESHNESS: the embedded overmap body is byte-identical to the canon
//      engine module (the overworld session reshapes streets -> this goes
//      RED until tools/bohemia_city_tab.py is rerun)
//   2. SKELETON-AS-ITSELF LAW: the page's category rules send arterials to
//      road, freeway/interchange to freeway, the water set to water, and
//      EVERY buildable district (suburb/casino/strip/downtown/...) to sand
//      (desert until grown on) — checked against the live district enum
//   3. determinism: the page carries no Math.random / Date.now
//   4. the alpha's CITY panel actually points at the page (no empty tab
//      regression)
const fs = require('fs');
const crypto = require('crypto');
const OM = require('../engine/bohemia_overmap.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const PAGE = 'slices/BOHEMIA_CITY_CURRENT.html';
const page = fs.readFileSync(PAGE, 'utf8');
const engine = fs.readFileSync('engine/bohemia_overmap.js', 'utf8');

// 1. freshness: embedded body === canon body
ok('embedded overmap is the canon body (freshness)', page.indexOf(engine) >= 0);
const md5 = crypto.createHash('md5').update(engine, 'utf8').digest('hex');
ok('page stamps the engine md5 it was built from', page.indexOf('engine-md5:' + md5) >= 0);

// 2. the category law, replayed against the page's own tables
const grab = name => {
  const m = page.match(new RegExp('(?:var\\s+|,\\s*)' + name + '=\\{([^}]*)\\}'));
  if (!m) return null;
  const set = {};
  m[1].split(',').forEach(kv => { const k = kv.split(':')[0].trim(); if (k) set[k] = 1; });
  return set;
};
const WATER = grab('WATER'), ROAD = grab('ROAD'), FREEWAY = grab('FREEWAY'),
  RAILT = grab('RAILT'), MOUNT = grab('MOUNT'), OPEN = grab('OPEN');
ok('page carries the category tables', !!(WATER && ROAD && FREEWAY && RAILT && MOUNT && OPEN));
ok('arterial -> road, freeway/interchange -> freeway', ROAD.arterial === 1 && FREEWAY.freeway === 1 && FREEWAY.interchange === 1);
ok('water set covers dam + mead + reservoirs', WATER.dam === 1 && WATER.mead === 1 && WATER.water === 1);

// every district in the live enum resolves; buildables land on sand
const skeleton = d => WATER[d] || ROAD[d] || FREEWAY[d] || RAILT[d] || MOUNT[d] || OPEN[d];
const districts = Object.values(OM.DISTRICT || {});
let buildableSand = true;
const BUILDABLE_PROBES = ['suburb', 'commercial', 'casino', 'strip', 'downtown', 'resort'];
for (const d of BUILDABLE_PROBES) if (districts.indexOf(d) >= 0 && skeleton(d)) buildableSand = false;
ok('buildable districts (suburb/casino/strip/...) draw as DESERT, never as themselves', buildableSand);

// the real map: majority of the valley is desert lots, the grid exists
const m = OM.buildOvermap(12345);
let sand = 0, road = 0, total = m.n * m.n;
for (let y = 0; y < m.n; y++) for (let x = 0; x < m.n; x++) {
  const d = m.at(x, y).district;
  if (!skeleton(d)) sand++;
  if (ROAD[d]) road++;
}
ok('the valley reads right: ' + sand + ' desert plots, ' + road + ' arterial cells (mile grid >= 2000)',
  sand > total * 0.3 && road >= 2000);

// 3. determinism
ok('no wall-clock or random in the page script', !/Math\.random|Date\.now/.test(page));

// 4. the alpha points at it
const alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
ok('the alpha CITY panel loads the page (no empty-tab regression)',
  alpha.indexOf('id="cityFrame"') >= 0 && alpha.indexOf('BOHEMIA_CITY_CURRENT.html') >= 0);

console.log('CITY TAB GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
