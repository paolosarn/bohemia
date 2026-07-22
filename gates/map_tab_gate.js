// MAP TAB GATE (7/21/26, district-factory session) — the MAP tab must never show a stale
// valley. Proves:
//   1. FRESHNESS: every embedded engine module (district_kit + all 30 auto-factory generators +
//      overmap/bridge/blockgen/floorplan/garage/crypt/world) is byte-identical to its canon body
//      — this goes RED until tools/bohemia_map_tab.py is rerun, same law as the CITY tab.
//   2. determinism: the page carries no Math.random / no argless Date.now/new Date in the GAME
//      script (the embedded engine bodies are checked separately by their own gates).
//   3. the alpha actually wires the MAP tab: a tab chip, a panel with the right iframe id, and
//      the click-listener that swaps data-src -> src (no empty tab / dead click regression).
const fs = require('fs');
const crypto = require('crypto');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const PAGE = 'slices/BOHEMIA_MAP_CURRENT.html';
ok('page exists', fs.existsSync(PAGE));
if (!fs.existsSync(PAGE)) { console.log('MAP TAB GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); }
const page = fs.readFileSync(PAGE, 'utf8');

// 1. freshness: every embedded module is byte-identical to its canon body, and stamped
const MODULES = [
  'engine/bohemia_district_kit.js',
  'engine/bohemia_suburb.js', 'engine/bohemia_commercial.js', 'engine/bohemia_industrial.js',
  'engine/bohemia_medical.js', 'engine/bohemia_solar.js', 'engine/bohemia_park.js',
  'engine/bohemia_wash.js', 'engine/bohemia_cemetery.js', 'engine/bohemia_drivein.js',
  'engine/bohemia_golf.js', 'engine/bohemia_stadium.js', 'engine/bohemia_truckstop.js',
  'engine/bohemia_school.js', 'engine/bohemia_firestation.js', 'engine/bohemia_swapmeet.js',
  'engine/bohemia_storage.js', 'engine/bohemia_watertreat.js', 'engine/bohemia_boneyard.js',
  'engine/bohemia_policestation.js', 'engine/bohemia_library.js', 'engine/bohemia_landfill.js',
  'engine/bohemia_railyard.js', 'engine/bohemia_substation.js', 'engine/bohemia_chapel.js',
  'engine/bohemia_courthouse.js', 'engine/bohemia_jail.js', 'engine/bohemia_farm.js',
  'engine/bohemia_downtown.js', 'engine/bohemia_trailer.js', 'engine/bohemia_apartment.js',
  'engine/bohemia_warehouse.js', 'engine/bohemia_waterpark.js', 'engine/bohemia_mall.js',
  'engine/bohemia_overmap.js', 'engine/bohemia_overmap_bridge.js', 'engine/bohemia_blockgen.js',
  'engine/bohemia_floorplan.js', 'engine/bohemia_garage.js', 'engine/bohemia_crypt.js',
  'engine/bohemia_world.js',
];
let freshCount = 0;
for (const mod of MODULES) {
  const body = fs.readFileSync(mod, 'utf8');
  const md5 = crypto.createHash('md5').update(body, 'utf8').digest('hex');
  const bodyOk = page.indexOf(body) >= 0, stampOk = page.indexOf('engine-md5:' + mod + ':' + md5) >= 0;
  if (bodyOk && stampOk) freshCount++;
  else console.log('  STALE: ' + mod + (bodyOk ? '' : ' (body drift)') + (stampOk ? '' : ' (stamp missing/mismatched)'));
}
ok('every embedded module is the canon body + stamped (' + freshCount + '/' + MODULES.length + ')', freshCount === MODULES.length);

// 2. determinism: no Math.random, no argless Date.now()/new Date() in the page's own GAME
// script (SEED is a fixed literal — a random/time-based seed would make the map non-reproducible
// and would also violate the Workflow-script constraint this codebase holds itself to elsewhere)
ok('no Math.random in the page', !/Math\.random/.test(page));
ok('no argless Date.now() / new Date() in the page', !/Date\.now\(\)/.test(page) && !/new Date\(\)/.test(page));
ok('SEED is a fixed literal (reproducible map)', /var SEED\s*=\s*\d+;/.test(page));

// 3. the alpha actually wires the MAP tab
const alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
ok('alpha has a MAP tab chip', /data-p="map">MAP</.test(alpha));
ok('alpha has the p-map panel with mapFrame pointed at BOHEMIA_MAP_CURRENT.html',
  /<div class="panel" id="p-map"><iframe id="mapFrame" data-src="BOHEMIA_MAP_CURRENT\.html"/.test(alpha));
ok('alpha wires the MAP tab click -> src swap (no dead tab)',
  /data-p=map\]"\);if\(mt\)mt\.addEventListener\("click",function\(\)\{var f=document\.getElementById\("mapFrame"\)/.test(alpha));

console.log('MAP TAB GATE: ' + pass + ' passed, ' + fail + ' failed  (' + MODULES.length + ' embedded modules)');
process.exit(fail ? 1 : 0);
