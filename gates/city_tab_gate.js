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

  // 7. THE BUFFET LOCK (7/20, Paolo saw DROP IN: "IT STILL LOOKS LIKE THIS!"):
  // the tile-judging buffet's scatter shipped ON by default, blanketing the
  // street-level ground in banned confetti. The judging tool may exist; it
  // may NEVER ship as the default ground again.
  ok('the tile buffet never ships on by default (scatter:false)',
    decoded.indexOf('let TP = { on:false, scatter:false,') >= 0);

  // 8. THE STREET ART LOCK (7/20, Paolo: "WE ACTUALLY MADE STREETS"): the
  // approved V11/V12 street pools ARE the city's street-level ground.
  ok('the approved street pools ride in the city (SA_TILES embedded)',
    decoded.indexOf('const SA_TILES=') >= 0 && decoded.indexOf('BOHEMIA_STREET_POOLS_HARMONIZED') >= 0);
  ok('texFor serves the real art for street ground colors',
    decoded.indexOf("const sp=SA_MAP[col]") >= 0);
  ok('center lines + lane dividers draw the approved art with orientation',
    decoded.indexOf("_pool") >= 0 && decoded.indexOf("'lane_v'") >= 0);

  // 9. THE WIDTH MODELS LOCK (7/20, Paolo: "we made whole models based on
  // how wide the streets should be"): the road cross-section is the canon
  // anatomy - LANE_W=2, lanes/dir per class, white dividers, yellow median.
  ok('CANON XSEC: road cross-sections come from the blockgen width models',
    decoded.indexOf('CANON XSEC') >= 0);
  ok('classes differ: arterial 3 lanes / strip 4+med2 / freeway no sidewalks',
    decoded.indexOf('arterial:{lanes:3,med:1,side:2}') >= 0
    && decoded.indexOf('strip:{lanes:4,med:2,side:2}') >= 0
    && decoded.indexOf('freeway:{lanes:4,med:2,side:0}') >= 0);
  ok('LINE COLOR LAW at street level: yellow median, white lane dashes',
    decoded.indexOf("'#b8a040'") >= 0 && decoded.indexOf("c.g='#d8d4c4'") >= 0);

  // 10. THE INTERSECTION LOCK (7/20): V12 anatomy at street level - clean
  // box, crosswalks at the box edges (approved cross art, oriented), median
  // and lane lines stop at the crossing. Plus the walker teleport probe so
  // any coordinate stays verifiable on the real surface.
  ok('V12 XING: crossings carry the approved anatomy',
    decoded.indexOf('V12 XING') >= 0);
  ok('crosswalk art embedded both orientations',
    decoded.indexOf("'cross_ns'") >= 0 && decoded.indexOf("'cross_ew'") >= 0);
  ok('median and dashes stop at the crossing (nearX)',
    decoded.indexOf('nearX') >= 0);
  ok('the walker teleport probe exists (__CITY.human)',
    decoded.indexOf('window.__CITY.human=') >= 0);

  // 11. THE REGEN LOCK (7/20, Paolo: "make sure everything is seed regen
  // friendly"): REROLL must rebuild the WHOLE world deterministically -
  // LCG seed advance (no wall randomness), both caches dropped, POWER
  // re-rolled (gated above), and the world path free of Math.random.
  // Verified live 7/20: reroll chain 2026 -> 2338904795 -> 783686144
  // identical across fresh boots; power lottery 366/392/458 re-rolls with
  // the world; street art re-bakes; 0 errors.
  ok('REGEN: reroll advances the seed by deterministic LCG',
    decoded.indexOf('seed=(seed*1103515245+12345)>>>0') >= 0);
  ok('REGEN: reroll drops the stream (both caches cleared)',
    decoded.indexOf('chunkCache.clear(); metaCache.clear();') >= 0);
  const worldPath = decoded.slice(decoded.indexOf('function tileMeta'), decoded.indexOf('function chunkCanvas'));
  ok('REGEN: the world path holds zero Math.random (pure f(seed))',
    worldPath.indexOf('Math.random') < 0 && worldPath.length > 1000);

  // 12. THE POCKETS LOCK (7/20): approaches carry solid pocket-boundary
  // lines in the approved art; arrows deferred to a zoom-true treatment
  // (never illegible mush - the bold-marking ruling).
  ok('POCKETS: approach pocket lines in (divider-band condition, fractional-rel safe)',
    decoded.indexOf('POCKETS') >= 0 && decoded.indexOf('rel%(LANE_W+1)>=LANE_W&&rel<LANE_W+1') >= 0);
  ok('pocket art embedded both orientations',
    decoded.indexOf("'pocket_v'") >= 0 && decoded.indexOf("'pocket_h'") >= 0);

  // 13. THE LAMP POSTS LOCK (7/20): the blessed V11 dark bodies stand on
  // the sidewalks (staggered law, pure f(global coords)); DEAD IS DEFAULT;
  // live circuits get an rgb-only head glow at night (the blessed pattern).
  ok('LAMP POSTS: blessed bodies embedded + staggered-law placement',
    decoded.indexOf('LAMP POSTS') >= 0 && decoded.indexOf('const LAMP_B64=') >= 0
    && decoded.indexOf('_gal%8===2') >= 0);
  ok('dead is default; glow is runtime rgb-only per live circuit',
    decoded.indexOf('POWER.at(tX,tY).live') >= 0);

  // 14. THE BUILDING ART LOCK (7/20): residential structures wear roof and
  // facade tiles cropped from the HOUSE FACTORY BANK's approved stamps.
  ok('BUILDING ART: approved house-stamp roofs + facades embedded',
    decoded.indexOf('BUILDING ART') >= 0 && decoded.indexOf("'roof'") >= 0
    && decoded.indexOf("'wallface'") >= 0 && decoded.indexOf("'wallwin'") >= 0);
  ok('faces serve facade art (plain/window by deterministic variant)',
    decoded.indexOf("saTex(variant===3?'wallwin':'wallface',variant)") >= 0);

  // 15. THE CANON SUBURB LOCK (7/20, Paolo: "we have SUBURBS for this
  // reason, and REAL HOUSE SIZES"): residential tiles generate Paolo's
  // approved block (engine/bohemia_suburb.js, byte-locked verbatim),
  // street-gated to real road neighbors, downsampled with presence-priority
  // so walls survive; structures wear the APPROVED judge palette (real
  // house ART is PENDING a Paolo verdict cycle - the house-factory stamps
  // proved dungeon-styled, unusable as suburb skins); ground is DEAD DIRT
  // (act-1: the green lawn is gone). Freestyle prefabs are DEAD for
  // residential.
  const subBody = fs.readFileSync('engine/bohemia_suburb.js', 'utf8');
  ok('CANON SUBURB: the approved generator rides the city verbatim',
    decoded.indexOf(subBody) >= 0 && decoded.indexOf('CANON SUBURB') >= 0);
  ok('residential tiles route through the canon block (freestyle prefabs dead)',
    decoded.indexOf('SUB_RES[d]') >= 0 && decoded.indexOf('__subGrid') >= 0);
  ok('structures wear the approved judge palette, ground is dead dirt',
    decoded.indexOf("'#9c8e76'") >= 0 && decoded.indexOf("'#8a7a5e'") >= 0);
  // v2 (Paolo: "pull me a picture of a suburb I approved" - the 4:1 downsample
  // mushed THE BLOCK; now a 96m block spans a 4x4 TILE GROUP at 1:1, the same
  // 0.75m fine scale as the approved walk slice, and rerolls drop the cache)
  ok('CANON SUBURB v2: full-resolution 4x4-group windows, no downsample',
    decoded.indexOf('4x4 TILE GROUP') >= 0 && decoded.indexOf('__subBlock') >= 0);
  ok('REGEN: the group-block cache drops on reroll',
    decoded.indexOf('__subCache.clear();') >= 0);

  // 16. THE PERIMETER WALL LOCK (7/21, reuse-first law): the suburb's
  // walled ring wears Paolo's OWN approved perimeter wall pool (WB4 is his
  // pick, records/BOHEMIA_WALL_PICKS_BATCH2_VERDICTS_7_17_26), not a flat
  // color. Reuses the street pools' saTex/SA_IMG machinery - one more pool
  // key, same cache-flush.
  ok('PERIMETER WALL ART: the approved pool embedded (WALL_MAP present)',
    decoded.indexOf('PERIMETER WALL ART') >= 0 && decoded.indexOf('const WALL_MAP=') >= 0
    && decoded.indexOf('BOHEMIA_PERIMETER_WALL_POOL') >= 0);
  ok('texFor + texForKind both route the suburb wall color through the real art',
    decoded.indexOf('const wp=WALL_MAP[col]') >= 0 && decoded.indexOf("kind==='wall'&&WALL_MAP[col]") >= 0);
  ok('the wall art decodes and serves a real tile (wallArtReady probe)',
    decoded.indexOf('wallArtReady:function') >= 0 || decoded.indexOf('.wallArtReady=function') >= 0);

  // 17. THE HOUSE ART LOCK (7/21, Paolo verdict: all 30 house-skin
  // candidates UP - records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26). Real roof/
  // facade/yard art rides the canon suburb, replacing the judge-palette
  // placeholder tones.
  ok('HOUSE ART: all six approved pools embedded (roof/wall/window/boarded/door/yard)',
    ['hroof', 'hwall', 'hwindow', 'hboarded', 'hdoor', 'hyard'].every(
      p => decoded.indexOf('SA_TILES.' + p + '=') >= 0));
  ok('roof-top cells route through the real art', decoded.indexOf('c.artPool=') >= 0);
  ok('facade cells compose plain/window/boarded/door deterministically',
    decoded.indexOf('c.artPool_face=') >= 0 && decoded.indexOf("pick<6?'hwall'") >= 0);
  ok('dead-dirt ground picks one DG blend per suburb block',
    decoded.indexOf('c.gArtPool=') >= 0 && decoded.indexOf("'hyard'") >= 0);
}

console.log('CITY TAB GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
