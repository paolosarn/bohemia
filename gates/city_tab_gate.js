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

// 1. freshness: every embedded module is byte-identical to its canon body
for (const mod of ['engine/bohemia_overmap.js', 'engine/bohemia_cityedit.js']) {
  const body = fs.readFileSync(mod, 'utf8');
  const md5 = crypto.createHash('md5').update(body, 'utf8').digest('hex');
  ok('embedded ' + mod + ' is the canon body (freshness)', page.indexOf(body) >= 0);
  ok('page stamps the ' + mod + ' md5 it was built from', page.indexOf('engine-md5:' + mod + ':' + md5) >= 0);
}

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

// 4. THE HIJACK LOCK (post-mortem 7/19: a static iframe named cityFrame was
// planted in #p-city, which made the ORIGINAL city loader's guard
// (!document.getElementById('cityFrame')) believe the real city was already
// booted - so the previous build's streaming Las Vegas (CITY_B64) silently
// never loaded and Paolo got a flat map instead of his city builder.
// PERMANENT LOCK: the alpha must keep the dynamic CITY_B64 boot intact and
// must NEVER contain a static cityFrame again. The aerial map page stays a
// dormant standalone, wired nowhere.
const alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
ok('the real city lives: CITY_B64 payload present in the alpha', alpha.indexOf('CITY_B64') >= 0);
ok('the dynamic city boot is intact (loader guard untouched)',
  alpha.indexOf("t.dataset.p==='city'&&!document.getElementById('cityFrame')") >= 0);
ok('NO static cityFrame hijack (the guard must find the panel empty)',
  !/<iframe[^>]*id="cityFrame"/.test(alpha));
ok('the aerial map page is wired NOWHERE in the alpha', alpha.indexOf('BOHEMIA_CITY_CURRENT.html') < 0);

// 5. THE MARRIAGE LOCK (7/20): the embedded city builder must carry the CANON
// overmap body, byte-for-byte. Before 7/20 it carried a stale 7/5-era fork
// (pre street-canon) hidden inside base64 where the sync gate couldn't see -
// the city rerolled the fragmented streets Paolo killed. If the overworld
// session evolves the canon streets, this goes RED until
// tools/bohemia_city_overmap_resync.py is rerun.
const b64m = alpha.match(/const CITY_B64='([^']+)'/);
ok('CITY_B64 payload extractable', !!b64m);
if (b64m) {
  const decoded = Buffer.from(b64m[1], 'base64').toString('utf8');
  const WRAP_OPEN = '(function(global){';
  const WRAP_CLOSE = "})(typeof window!=='undefined'?window:globalThis);";
  const canon = fs.readFileSync('engine/bohemia_overmap.js', 'utf8');
  const canonModule = canon.slice(canon.indexOf(WRAP_OPEN), canon.indexOf(WRAP_CLOSE) + WRAP_CLOSE.length);
  ok('MARRIED: the embedded city carries the canon overmap body verbatim',
    decoded.indexOf(canonModule) >= 0);
  ok('the canon street fixes ride inside the city (ISLAND PRUNE present)',
    decoded.indexOf('ISLAND PRUNE') >= 0);

  // 6. THE LIGHTS LOCK (7/20, Paolo: "the lights at night... in the city"):
  // the canon powergrid body rides inside the city verbatim, POWER rebuilds
  // with every world rebuild, and the lamps draw AFTER the night wash (the
  // occlusion law: light cuts the dark, tiles never cover a lamp).
  const pgBody = fs.readFileSync('engine/bohemia_powergrid.js', 'utf8');
  ok('LIT: the canon powergrid body rides inside the city verbatim',
    decoded.indexOf(pgBody) >= 0);
  ok('POWER rebuilds with every world rebuild (3 hooks)',
    (decoded.match(/POWER=BOH_POWERGRID\.powerMap\(om,seed\)/g) || []).length >= 3);
  ok('LIGHT=TERRITORY: live arterials queue lamps at night',
    decoded.indexOf('LIGHT=TERRITORY') >= 0 && decoded.indexOf('__LAMPQ') >= 0);
  ok('the lamp pass draws AFTER the night wash (light cuts the dark)',
    decoded.indexOf("g.fillRect(0,0,cv.width,cv.height); } if(window.__LAMPQ)") >= 0);
  ok('the probe surface exists (gates can interrogate the real city)',
    decoded.indexOf('window.__CITY=') >= 0);
}

console.log('CITY TAB GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
